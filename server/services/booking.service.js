import pool from "../utils/db.js";
import * as bookingRepository from "../repositories/booking.repository.js";
import { verifyHostelPayment } from "../services/finance.service.js";
import { generateBookingReference } from "../utils/bookings.js";

export const createBooking = async ({ studentId, admissionNumber, bedId }) => {
  // 1. Verify hostel payment
  await verifyHostelPayment(admissionNumber);

  // 2. Check if student already has an active booking
  const existingBooking =
    await bookingRepository.getActiveBookingByStudent(studentId);

  if (existingBooking) {
    throw createError({
      statusCode: 409,
      statusMessage: "ALREADY_BOOKED",
    });
  }

  // 3. Start transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 4. Lock the requested bed
    const bed = await bookingRepository.getBedForUpdate(client, bedId);

    if (!bed) {
      throw createError({
        statusCode: 404,
        statusMessage: "BED_NOT_FOUND",
      });
    }

    // 5. Check whether the bed already has an active booking
    const existingBedBooking = await bookingRepository.getBedBooking(
      client,
      bedId,
    );

    if (existingBedBooking) {
      throw createError({
        statusCode: 409,
        statusMessage: "BED_ALREADY_BOOKED",
      });
    }

    // 6. Create the booking
    const booking = await bookingRepository.createBooking(client, {
      reference: generateBookingReference(),
      studentId,
      bedId,
      status: "confirmed",
    });

    // 7. Commit
    await client.query("COMMIT");

    return booking;
  } catch (error) {
    // 8. Rollback anything that happened inside the transaction
    await client.query("ROLLBACK");

    throw error;
  } finally {
    // 9. Release the PostgreSQL connection
    client.release();
  }
};


export const cancelStudentBooking = async (
  bookingId,
  studentId,
) => {
  const booking = await bookingRepository.findBookingById(
    bookingId,
    studentId,
  );

  if (!booking) {
    throw createError({
      statusCode: 404,
      statusMessage: "BOOKING_NOT_FOUND",
    });
  }

  if (booking.status === "cancelled") {
    throw createError({
      statusCode: 409,
      statusMessage: "BOOKING_ALREADY_CANCELLED",
    });
  }

  if (booking.status !== "confirmed") {
    throw createError({
      statusCode: 409,
      statusMessage: "BOOKING_REQUIRES_INTERVENTION",
    });
  }

  const cancelled = await bookingRepository.cancelBooking(
    bookingId,
    studentId,
  );

  if (!cancelled) {
    throw createError({
      statusCode: 409,
      statusMessage: "BOOKING_STATUS_CHANGED",
    });
  }

  return cancelled;
};