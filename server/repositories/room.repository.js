import pool from "../utils/db";

export const createRoom = async ({ hostelId, roomNumber }) => {
  const query = `
    INSERT INTO rooms (hostel_id, room_number)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [hostelId, roomNumber];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getPublicRoomDetails = async (hostelId, roomId) => {
  const query = `
    WITH room_info AS (
      SELECT
        r.id,
        r.hostel_id,
        r.room_number,
        h.name AS "hostelName"
      FROM rooms r
      JOIN hostels h
        ON h.id = r.hostel_id
      WHERE r.id = $2
        AND r.hostel_id = $1
    ),

    bed_info AS (
      SELECT
        b.id,
        b.bed_number,
        b.tier,

        CASE
          WHEN bk.status = 'confirmed' THEN 'occupied'
          WHEN bk.status = 'pending' THEN 'pending'
          ELSE 'available'
        END AS status

      FROM beds b

      LEFT JOIN hostel_bookings bk
        ON bk.bed_id = b.id
        AND bk.status IN ('confirmed', 'pending')

      WHERE b.room_id = $2
    ),

    room_stats AS (
      SELECT
        ri.id,
        ri.hostel_id,
        ri."hostelName",
        ri.room_number,

        COUNT(bi.id)::int AS "totalBeds",

        COUNT(
          CASE
            WHEN bi.tier = 'upper' THEN 1
          END
        )::int AS "upperBeds",

        COUNT(
          CASE
            WHEN bi.tier = 'lower' THEN 1
          END
        )::int AS "lowerBeds"

      FROM room_info ri

      LEFT JOIN bed_info bi
        ON TRUE

      GROUP BY
        ri.id,
        ri.hostel_id,
        ri."hostelName",
        ri.room_number
    )

    SELECT
      rs.id,
      rs.hostel_id AS "hostelId",
      rs."hostelName",
      rs.room_number AS "roomNumber",
      rs."totalBeds",

      rs."totalBeds" AS capacity,

      CONCAT(
        rs."upperBeds",
        ' upper, ',
        rs."lowerBeds",
        ' lower'
      ) AS "bedArrangements",

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', bi.id,
              'name', CONCAT('Bed ', bi.bed_number),
              'tier',
                CASE
                  WHEN bi.tier = 'upper' THEN 'Upper bunk'
                  WHEN bi.tier = 'lower' THEN 'Lower bunk'
                  ELSE bi.tier
                END,
              'status', bi.status
            )
            ORDER BY bi.bed_number
          )
          FROM bed_info bi
        ),
        '[]'
      ) AS beds

    FROM room_stats rs;
  `;

  const result = await pool.query(query, [hostelId, roomId]);

  return result.rows[0] ?? null;
};
