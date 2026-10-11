import { requireAuth } from "../../utils/authorization.js";
import { getBookingByStudent } from "../../repositories/booking.repository.js";

export default defineEventHandler(async (event) => {
  const account = await requireAuth(event);

  const booking = await getBookingByStudent(account.id);

  if (!booking) {
    return {
      success: true,
      booking: null,
    };
  }

  return {
    success: true,
    booking,
  };
});
