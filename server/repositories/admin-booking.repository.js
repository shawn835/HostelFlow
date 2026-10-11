import pool from "../utils/db.js";

export const getAllAllocations = async ({
  page,
  perPage,
  search,
  status,
  hostel,
}) => {
  const offset = (page - 1) * perPage;

  const filters = `
    WHERE (
      $1::text IS NULL
      OR sa.admission_number ILIKE '%' || $1 || '%'
      OR h.id::text ILIKE '%' || $1 || '%'
      OR hb.status ILIKE '%' || $1 || '%'
      OR hb.id::text ILIKE '%' || $1 || '%'
    )
    AND (
      $2::text IS NULL
      OR hb.status = $2
    )
    AND (
      $3::text IS NULL
      OR h.id::text = $3::text
    )
  `;

  const values = [search || null, status || null, hostel || null];

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM hostel_bookings hb
    JOIN student_accounts sa ON sa.id = hb.student_id
    JOIN beds b ON b.id = hb.bed_id
    JOIN rooms r ON r.id = b.room_id
    JOIN hostels h ON h.id = r.hostel_id
    ${filters};
  `;

  const dataQuery = `
    SELECT
      hb.id AS "bookingId",
      sa.admission_number AS "admissionNumber",
      hb.status,
      hb.created_at AS "allocatedAt",
      h.id AS "hostelId",
      h.name AS "hostelName",
      r.room_number AS "roomNumber",
      b.bed_number AS "bedNumber"
    FROM hostel_bookings hb
    JOIN student_accounts sa ON sa.id = hb.student_id
    JOIN beds b ON b.id = hb.bed_id
    JOIN rooms r ON r.id = b.room_id
    JOIN hostels h ON h.id = r.hostel_id
    ${filters}
    ORDER BY hb.created_at DESC, hb.id DESC
    LIMIT $4 OFFSET $5;
  `;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery, values),
    pool.query(dataQuery, [...values, perPage, offset]),
  ]);

  const total = countResult.rows[0].total;

  return {
    allocations: dataResult.rows,
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
};
