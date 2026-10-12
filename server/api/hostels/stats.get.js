import pool from "../../utils/db.js";

export default defineEventHandler(async () => {
  const query = `
    SELECT
      (
        SELECT COUNT(*)
        FROM student_accounts
      )::int AS "housedStudents",

      (
        SELECT COUNT(*)
        FROM beds b
        JOIN rooms r ON r.id = b.room_id
        JOIN hostels h ON h.id = r.hostel_id
        WHERE h.active = TRUE
      )::int AS "totalBeds";
  `;

  const result = await pool.query(query);

  return {
    success: true,
    stats: {
      ...result.rows[0],
      verifiedProcess: true,
    },
  };
});