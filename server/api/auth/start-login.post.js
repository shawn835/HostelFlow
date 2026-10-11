import { createSetupToken } from "../../utils/auth.js";
import {
  createStudentAccount,
  findStudent,
  findStudentAccount,
} from "../../repositories/studentRepository.js";
import { setSetupCookie } from "../../utils/cookies.js";

// server/api/auth/first-login.post.js

export default defineEventHandler(async (event) => {
  const { admissionNumber } = await readBody(event);

  if (!admissionNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: "Admission number is required",
    });
  }

  // 1. Check school registry
  const student = await findStudent(admissionNumber);

  if (!student) {
    throw createError({
      statusCode: 404,
      statusMessage: "Student not found, kindly contact the admin!",
    });
  }

  // 2. Check HostelFlow account
  const existingAccount = await findStudentAccount(admissionNumber);

  if (existingAccount?.passwordHash) {
    return {
      success: true,
      next: "password",
    };
  }

  // 4. Account doesn't exist → create it
  const account =
    existingAccount ||
    (await createStudentAccount({
      admissionNumber,
      firstName: student.first_name,
      lastName: student.last_name,
    }));

  // 5. Create temporary setup token
  const setupToken = createSetupToken({
    userId: account.id,
    purpose: "password_setup",
  });

  // 6. Store setup token in cookie
  setSetupCookie(event, setupToken);

  return {
    success: true,
    next: "setup-password",
  };
});
