import pool from "../utils/db.js";

export const createHostel = async (data) => {
  const { name, gender, price, image } = data;

  const query = `
    INSERT INTO hostels (name, gender, price, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, gender, price, image ?? null];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getAllHostels = async () => {
  const query = `
    SELECT
    h.id,
    h.name,
    h.gender,
    h.price,
    h.image,
    h.active,

   COUNT(DISTINCT r.id) AS "totalRooms",
   COUNT(DISTINCT b.id) AS "totalBeds",
   COUNT(DISTINCT CASE
    WHEN bk.status = 'confirmed' THEN b.id
END) AS "occupiedBeds",
COUNT(DISTINCT b.id)
-
COUNT(DISTINCT CASE
    WHEN bk.status = 'confirmed' THEN b.id
END) AS "availableBeds"

FROM hostels h

LEFT JOIN rooms r
    ON r.hostel_id = h.id

LEFT JOIN beds b
    ON b.room_id = r.id

LEFT JOIN hostel_bookings bk
    ON bk.bed_id = b.id

GROUP BY h.id

ORDER BY h.created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const getHostelDetails = async (hostelId) => {
  const query = `
    WITH room_stats AS (
      SELECT
        r.id,
        r.hostel_id,
        r.room_number,

        COUNT(b.id) AS "totalBeds",

        COUNT(
          CASE
            WHEN bk.status = 'confirmed' THEN 1
          END
        ) AS "occupiedBeds"

      FROM rooms r

      LEFT JOIN beds b
        ON b.room_id = r.id

      LEFT JOIN hostel_bookings bk
        ON bk.bed_id = b.id

      WHERE r.hostel_id = $1

      GROUP BY
        r.id,
        r.hostel_id,
        r.room_number
    ),

    hostel_stats AS (
      SELECT
        h.id,
        h.name,
        h.gender,

        COUNT(rs.id) AS "totalRooms",

        COALESCE(SUM(rs."totalBeds"), 0) AS "totalBeds",

        COALESCE(SUM(rs."occupiedBeds"), 0) AS "occupiedBeds"

      FROM hostels h

      LEFT JOIN room_stats rs
        ON rs.hostel_id = h.id

      WHERE h.id = $1

      GROUP BY
        h.id,
        h.name,
        h.gender,
        h.price,
        h.image,
        h.active
    )

    SELECT
      hs.*,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', rs.id,
              'roomNumber', rs.room_number,
              'totalBeds', rs."totalBeds",
              'occupiedBeds', rs."occupiedBeds",
              'availableBeds',
                rs."totalBeds" - rs."occupiedBeds"
            )
            ORDER BY rs.room_number
          )
          FROM room_stats rs
        ),
        '[]'
      ) AS rooms,

      hs."totalBeds" - hs."occupiedBeds" AS "availableBeds"

    FROM hostel_stats hs;
  `;

  const result = await pool.query(query, [hostelId]);

  return result.rows[0] ?? null;
};

export const getPublicHostels = async () => {
  const query = `
    SELECT
      h.id,
      h.name,
      h.price,
      h.image,
      h.gender,

      COUNT(DISTINCT b.id)::int AS "totalBeds"

    FROM hostels h

    LEFT JOIN rooms r
      ON r.hostel_id = h.id

    LEFT JOIN beds b
      ON b.room_id = r.id

    WHERE h.active = TRUE

    GROUP BY
      h.id,
      h.name,
      h.price,
      h.image,
      h.gender

    ORDER BY h.created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const getPublicHostelDetails = async (hostelId) => {
  const query = `
    WITH room_stats AS (
      SELECT
        r.id,
        r.hostel_id,
        r.room_number,

        COUNT(DISTINCT b.id)::int AS "totalBeds",

        COUNT(
          DISTINCT CASE
            WHEN bk.status = 'confirmed' THEN b.id
          END
        )::int AS "occupiedBeds"

      FROM rooms r

      LEFT JOIN beds b
        ON b.room_id = r.id

      LEFT JOIN hostel_bookings bk
        ON bk.bed_id = b.id

      WHERE r.hostel_id = $1

      GROUP BY
        r.id,
        r.hostel_id,
        r.room_number
    ),

    hostel_stats AS (
      SELECT
        h.id,
        h.name,
        h.gender,
        h.price,
        h.image,

        COUNT(rs.id)::int AS "totalRooms",

        COALESCE(
          SUM(rs."totalBeds"), 0
        )::int AS "totalBeds",

        COALESCE(
          SUM(rs."occupiedBeds"), 0
        )::int AS "occupiedBeds"

      FROM hostels h

      LEFT JOIN room_stats rs
        ON rs.hostel_id = h.id

      WHERE h.id = $1
        AND h.active = TRUE

      GROUP BY
        h.id,
        h.name,
        h.gender,
        h.price,
        h.image
    )

    SELECT
      hs.id,
      hs.name,
      hs.gender,
      hs.price,
      hs."totalRooms",
      hs."totalBeds",

      hs."totalBeds" - hs."occupiedBeds"
        AS "bedsAvailable",

      hs.image,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', rs.id,
              'number', rs.room_number,
              'totalBeds', rs."totalBeds",
              'available',
                rs."totalBeds" - rs."occupiedBeds"
            )
            ORDER BY rs.room_number
          )
          FROM room_stats rs
        ),
        '[]'
      ) AS rooms

    FROM hostel_stats hs;
  `;

  const result = await pool.query(query, [hostelId]);

  return result.rows[0] ?? null;
};
