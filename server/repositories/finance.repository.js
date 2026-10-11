import pool from "../utils/db.js";

export const getHostelPaymentTotal = async (admissionNumber) => {
  const query = `
    SELECT
      COALESCE(SUM(amount), 0)::int AS "totalPaid"
    FROM finance_payments
    WHERE admission_number = $1
      AND payment_type = 'hostel';
  `;

  const result = await pool.query(query, [admissionNumber]);

  return result.rows[0].totalPaid;
};
