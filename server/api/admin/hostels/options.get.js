import pool from "../../../utils/db.js";
import { requireRole } from "../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const query = `
    SELECT
      id,
      name
    FROM hostels
    WHERE active = TRUE
    ORDER BY name ASC;
  `;

  const result = await pool.query(query);

  return {
    success: true,
    hostels: result.rows,
  };
});
