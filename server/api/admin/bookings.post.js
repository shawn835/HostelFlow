import { findStudentAccount } from "../../repositories/studentRepository";
import { requireAuth } from "../../utils/authorization";

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const student = await findStudentAccount(event);

  if (!student) {
    throw createError({
      status: 404,
      statusMessage: "student not found",
    });
  }
});
