import { requireAuth } from "../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  return {
    success: true,
    user: {
      id: user.id,
      role: user.role,
      admissionNumber: user.admissionNumber,
      firstName: user.firstName,
      active: user.active,
      lastName: user.lastName,
      createdAt: user.createdAt,
    },
  };
});
