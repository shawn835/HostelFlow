import { requireAuth } from "../../utils/authorization.js";
import { createBooking } from "../../services/booking.service.js";

export default defineEventHandler(async (event) => {
  const account = await requireAuth(event);

  const body = await readBody(event);

  if (!body?.bedId) {
    throw createError({
      statusCode: 400,
      statusMessage: "BED_ID_REQUIRED",
    });
  }

  const booking = await createBooking({
    studentId: account.id,
    admissionNumber: account.admissionNumber,
    bedId: body.bedId,
  });

  return {
    success: true,
    booking,
  };
});
