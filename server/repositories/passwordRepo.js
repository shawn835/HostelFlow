import pool from "../utils/db.js";

export const updatePassword = async (hashedPassword, userId) => {
  const query = `
    UPDATE student_accounts 
    SET password_hash = $1, updated_at = NOW() 
    WHERE id = $2 
    RETURNING
      id,
      role,
      admission_number AS "admissionNumber",
      token_version AS "tokenVersion";
  `;

  const result = await pool.query(query, [hashedPassword, userId]);

  return result.rows[0] || null;
};
