import pool from "../utils/db.js";

export const findStudent = async (admissionNumber) => {
  const query = `
   SELECT *
    FROM registry
    WHERE admission_number = $1
  `;
  const result = await pool.query(query, [admissionNumber]);

  return result.rows[0] || null;
};

export const createStudentAccount = async ({
  admissionNumber,
  firstName,
  lastName,
}) => {
  const query = `
    INSERT INTO student_accounts (admission_number, first_name, last_name)
    VALUES ($1, $2, $3)
    RETURNING id, admission_number
    `;
  const result = await pool.query(query, [
    admissionNumber,
    firstName,
    lastName,
  ]);

  return result.rows[0] || null;
};

export const findStudentAccount = async (admissionNumber) => {
  const query = `
    SELECT
      id,
      admission_number AS "admissionNumber",
      token_version AS "tokenVersion",
      role,
      password_hash AS "passwordHash"
    FROM student_accounts
    WHERE admission_number = $1
  `;

  const result = await pool.query(query, [admissionNumber]);

  return result.rows[0] || null;
};

export const findStudentAccountById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        role,
        admission_number AS "admissionNumber",
        first_name AS "firstName",
        last_name AS "lastName",
        active,
        token_version AS "tokenVersion",
        created_at AS "createdAt"
        FROM student_accounts
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const incrementTokenVersion = async (userId) => {
  const query = `
    UPDATE student_accounts
    SET token_version = token_version + 1
    WHERE id = $1;
  `;

  const result = await pool.query(query, [userId]);

  return (result.rowCount ?? 0) > 0;
};
