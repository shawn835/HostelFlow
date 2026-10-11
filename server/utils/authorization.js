import { findStudentAccountById } from "../repositories/studentRepository.js";

export const requireAuth = async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const account = await findStudentAccountById(user.userId);

  if (!account) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  if (user.tokenVersion !== account.tokenVersion) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return account;
};
export const requireRole = async (event, ...allowedRoles) => {
  const user = await requireAuth(event);

  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  return user;
};
