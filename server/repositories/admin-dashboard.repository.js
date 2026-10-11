import pool from "../utils/db.js";

export const getDashboardOverview = async () => {
  const query = `
    SELECT
      (
        SELECT COUNT(*)
        FROM student_accounts
      )::int AS students,

      (
        SELECT COUNT(*)
        FROM beds b
        JOIN rooms r ON r.id = b.room_id
        JOIN hostels h ON h.id = r.hostel_id
        WHERE h.active = TRUE
      )::int AS beds,

      (
        SELECT COUNT(*)
        FROM hostel_bookings hb
        JOIN beds b ON b.id = hb.bed_id
        JOIN rooms r ON r.id = b.room_id
        JOIN hostels h ON h.id = r.hostel_id
        WHERE hb.status = 'confirmed'
          AND h.active = TRUE
      )::int AS occupied,

      (
        SELECT COUNT(*)
        FROM beds b
        JOIN rooms r ON r.id = b.room_id
        JOIN hostels h ON h.id = r.hostel_id
        WHERE h.active = TRUE
          AND NOT EXISTS (
            SELECT 1
            FROM hostel_bookings hb
            WHERE hb.bed_id = b.id
              AND hb.status IN ('confirmed', 'pending')
          )
      )::int AS available;
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

export const getHostelOccupancy = async () => {
  const query = `
    SELECT
      h.id AS "hostelId",
      h.name AS "hostelName",

      COUNT(b.id)::int AS "totalBeds",

      COUNT(b.id) FILTER (
        WHERE hb.status = 'confirmed'
      )::int AS "occupiedBeds",

      CASE
        WHEN COUNT(b.id) = 0 THEN 0
        ELSE ROUND(
          COUNT(b.id) FILTER (
            WHERE hb.status = 'confirmed'
          ) * 100.0 / COUNT(b.id),
          2
        )
      END AS "occupancyPercentage"

    FROM hostels h

    LEFT JOIN rooms r
      ON r.hostel_id = h.id

    LEFT JOIN beds b
      ON b.room_id = r.id

    LEFT JOIN hostel_bookings hb
      ON hb.bed_id = b.id
      AND hb.status = 'confirmed'

    WHERE h.active = TRUE

    GROUP BY h.id, h.name

    ORDER BY h.name ASC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const getLatestAllocations = async () => {
  const query = `
    SELECT
      hb.status,
      hb.created_at AS "allocatedAt",

      sa.admission_number AS "admissionNumber",
    
      
      h.name AS "hostelName",

     
      r.room_number AS "roomNumber",

     
      b.bed_number AS "bedNumber"
     

    FROM hostel_bookings hb

    JOIN student_accounts sa
      ON sa.id = hb.student_id

    JOIN beds b
      ON b.id = hb.bed_id

    JOIN rooms r
      ON r.id = b.room_id

    JOIN hostels h
      ON h.id = r.hostel_id

    ORDER BY hb.created_at DESC, hb.id DESC

    LIMIT 10;
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const getInterventionCount = async () => {
  const query = `
    SELECT
      COUNT(*)::int AS "interventionCount"
    FROM hostel_bookings
    WHERE status NOT IN ('confirmed', 'cancelled');
  `;

  const result = await pool.query(query);

  return result.rows[0].interventionCount;
};
