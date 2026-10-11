import { verifySetupToken } from "../../utils/auth.js";
import { updatePassword } from "../../repositories/passwordRepo.js";
import { createToken } from "../../utils/auth.js";
import { clearSetupCookie, setAuthCookie } from "../../utils/cookies.js";
import { hashPassword, validatePassword } from "../../utils/password.js";

export default defineEventHandler(async (event) => {
  const setupToken = getCookie(event, "setupToken");

  if (!setupToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Password setup session is missing",
    });
  }

  // 1. Verify setup token
  let decodedToken;

  try {
    decodedToken = verifySetupToken(setupToken);
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired setup token",
    });
  }

  const userId = decodedToken.userId;

  const { password, confirmPassword } = await readBody(event);

  try {
    validatePassword(password, confirmPassword);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
  // 6. Hash password
  const hashedPassword = await hashPassword(password);

  const account = await updatePassword(hashedPassword, userId);

  if (!account) {
    throw createError({
      statusCode: 404,
      statusMessage: "Student account not found",
    });
  }

  clearSetupCookie(event);

  const payload = {
    userId: account.id,
    tokenVersion: account.tokenVersion,
  };

  const authToken = createToken(payload);

  setAuthCookie(event, authToken);

  return {
    success: true,
    message: "Password created successfully",
    user: {
      id: account.id,
      role: account.role,
      admissionNumber: account.admissionNumber,
    },
  };
});
