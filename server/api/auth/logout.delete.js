import { requireAuth } from "../../utils/authorization.js";
import { incrementTokenVersion } from "../../repositories/studentRepository.js";
import { clearAuthCookie } from "../../utils/cookies.js";

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);

  await incrementTokenVersion(user.userId);

  clearAuthCookie(event);

  return {
    success: true,
  };
});
