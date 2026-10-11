import pool from "../utils/db.js";

export const getActiveBookingByStudent = async (studentId) => {
  const query = `
    SELECT
      id,
      student_id AS "studentId",
      bed_id AS "bedId",
      status,
      created_at AS "createdAt"
    FROM hostel_bookings
    WHERE student_id = $1
      AND status IN ('pending', 'confirmed')
    LIMIT 1;
  `;

  const result = await pool.query(query, [studentId]);

  return result.rows[0] ?? null;
};

export const getBedForUpdate = async (client, bedId) => {
  const query = `
    SELECT
      id,
      room_id AS "roomId"
    FROM beds
    WHERE id = $1
    FOR UPDATE;
  `;

  const result = await client.query(query, [bedId]);

  return result.rows[0] ?? null;
};

export const getBedBooking = async (client, bedId) => {
  const query = `
    SELECT
      id,
      status
    FROM hostel_bookings
    WHERE bed_id = $1
      AND status IN ('pending', 'confirmed')
    LIMIT 1;
  `;

  const result = await client.query(query, [bedId]);

  return result.rows[0] ?? null;
};

export const createBooking = async (
  client,
  { reference, studentId, bedId, status },
) => {
  const query = `
    INSERT INTO hostel_bookings (
    booking_reference,
      student_id,
      bed_id,
      status
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      student_id AS "studentId",
      bed_id AS "bedId",
      status,
      created_at AS "createdAt";
  `;

  try {
    const result = await client.query(query, [
      reference,
      studentId,
      bedId,
      status,
    ]);

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "BED_ALREADY_BOOKED",
      });
    }

    throw error;
  }
};

export const findBookingById = async (bookingId, studentId) => {
  const query = `
    SELECT
      id,
      student_id AS "studentId",
      bed_id AS "bedId",
      status,
      created_at AS "createdAt"
    FROM hostel_bookings
    WHERE id = $1
      AND student_id = $2;
  `;

  const result = await pool.query(query, [bookingId, studentId]);

  return result.rows[0] ?? null;
};

export const getBookingByStudent = async (studentId) => {
  const query = `
    SELECT
      hb.id,
      hb.status,
      hb.booking_reference AS "reference",
      hb.created_at AS "createdAt",

           b.bed_number AS "bedNumber",
      b.tier,

     
      r.room_number AS "roomNumber",

       h.name AS "hostelName",
      h.gender,
      h.price

    FROM hostel_bookings hb

    JOIN beds b
      ON b.id = hb.bed_id

    JOIN rooms r
      ON r.id = b.room_id

    JOIN hostels h
      ON h.id = r.hostel_id

    WHERE hb.student_id = $1
      AND hb.status IN ('pending', 'confirmed')

    ORDER BY hb.created_at DESC

    LIMIT 1;
  `;

  const result = await pool.query(query, [studentId]);

  return result.rows[0] ?? null;
};

export const cancelBooking = async (bookingId, studentId) => {
  const query = `
    UPDATE hostel_bookings
    SET status = 'cancelled'
    WHERE id = $1
      AND student_id = $2
      AND status = 'confirmed'
    RETURNING id, status;
  `;

  const result = await pool.query(query, [bookingId, studentId]);

  return result.rows[0] ?? null;
};
