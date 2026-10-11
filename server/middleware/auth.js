import { verifyToken } from "../utils/auth.js";

export default defineEventHandler((event) => {
  const token = getCookie(event, "token");

  if (!token) {
    return;
  }

  try {
    const user = verifyToken(token);

    event.context.user = user;
  } catch (error) {
    event.context.user = null;
  }
});
