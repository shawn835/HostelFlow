import * as bedRepository from "../../../../../../../repositories/bed.repository.js";
import { requireRole } from "../../../../../../../utils/authorization.js";
export default defineEventHandler(async (event) => {
  requireRole(event, "admin");

  const roomId = getRouterParam(event, "roomId");

  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Room ID is required",
    });
  }

  const room = await bedRepository.getRoomBeds(roomId);

  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: "Room not found",
    });
  }

  return {
    success: true,
    room,
    beds: room.beds,
  };
});
