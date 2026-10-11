import { createRoom } from "../../../../../services/room.service.js";
import { requireRole } from "../../../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
   requireRole(event, "admin");

  const hostelId = getRouterParam(event, "hostelId");

  const body = await readBody(event);

  const room = await createRoom({
    hostelId,
    roomNumber: body.roomNumber,
  });

  return {
    success: true,
    room,
  };
});
