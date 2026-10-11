import { requireAuth } from "../../utils/authorization.js";
import { cancelStudentBooking } from "../../services/booking.service.js";

export default defineEventHandler(async (event) => {
  const account = await requireAuth(event);
  const bookingId = getRouterParam(event, "bookingId");

  if (!bookingId || !/^\d+$/.test(bookingId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "INVALID_BOOKING_ID",
    });
  }

  const booking = await cancelStudentBooking(bookingId, account.id);

  return {
    success: true,
    message: "Booking cancelled successfully",
    booking,
  };
});
