import { findStudentAccount } from "../../repositories/studentRepository.js";
import { comparePassword } from "../../utils/password.js";
import { setAuthCookie } from "../../utils/cookies.js";
import { createToken } from "../../utils/auth.js";

export default defineEventHandler(async (event) => {
  const { admissionNumber, password } = await readBody(event);

  // 1. Validate input
  if (!admissionNumber || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Admission number and password are required",
    });
  }

  // 2. Find HostelFlow account
  const account = await findStudentAccount(admissionNumber);

  if (!account) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid admission number or password",
    });
  }

  // 3. Make sure password has already been set
  if (!account.passwordHash) {
    throw createError({
      statusCode: 403,
      statusMessage: "Password setup has not been completed",
    });
  }

  // 4. Compare supplied password with stored hash
  const passwordMatches = await comparePassword(password, account.passwordHash);

  if (!passwordMatches) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid admission number or password",
    });
  }

  // 5. Create normal authentication token
  const token = createToken({
    userId: account.id,
    role: account.role,
    tokenVersion: account.tokenVersion,
  });

  // 6. Store token in HTTP-only cookie
  setAuthCookie(event, token);

  return {
    success: true,
    message: "Login successful",
  };
});
