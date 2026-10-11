import pool from "../utils/db.js";

export const createBed = async ({ hostelId, roomId, bedNumber, tier }) => {
  const query = `
    INSERT INTO beds (room_id, bed_number, tier)
    SELECT $2, $3, $4
    FROM rooms
    WHERE id = $2
      AND hostel_id = $1
    RETURNING *;
  `;

  const values = [hostelId, roomId, bedNumber, tier];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

export const getRoomBeds = async (roomId) => {
  const query = `
    WITH room_info AS (
      SELECT
        r.id,
        r.room_number
      FROM rooms r
      WHERE r.id = $1
    ),

    bed_info AS (
      SELECT
        b.id,
        b.room_id,
        b.bed_number,
        b.tier,

        CASE
          WHEN bk.status = 'confirmed' THEN 'occupied'
          WHEN bk.status = 'pending' THEN 'pending'
          ELSE 'available'
        END AS status,

        CASE
          WHEN bk.status = 'confirmed'
            THEN sa.admission_number
          ELSE NULL
        END AS "occupantAdmissionNumber"

      FROM beds b

      LEFT JOIN hostel_bookings bk
        ON bk.bed_id = b.id
        AND bk.status IN ('confirmed', 'pending')

      LEFT JOIN student_accounts sa
        ON sa.id = bk.student_id

      WHERE b.room_id = $1
    )

    SELECT
      ri.id,
      ri.room_number AS "roomNumber",

      COUNT(bi.id)::int AS "totalBeds",

      COUNT(
        CASE
          WHEN bi.status = 'occupied' THEN 1
        END
      )::int AS "occupiedBeds",

      COUNT(
        CASE
          WHEN bi.status = 'available' THEN 1
        END
      )::int AS "availableBeds",

      COALESCE(
        json_agg(
          json_build_object(
            'id', bi.id,
            'bedNumber', bi.bed_number,
            'tier', bi.tier,
            'status', bi.status,
            'occupantAdmissionNumber', bi."occupantAdmissionNumber"
          )
          ORDER BY bi.bed_number
        ) FILTER (WHERE bi.id IS NOT NULL),
        '[]'
      ) AS beds

    FROM room_info ri

    LEFT JOIN bed_info bi
      ON bi.room_id = ri.id

    GROUP BY
      ri.id,
      ri.room_number;
  `;

  const result = await pool.query(query, [roomId]);

  return result.rows[0] ?? null;
};
