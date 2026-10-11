import * as roomRepository from "../../../../repositories/room.repository.js";

export default defineEventHandler(async (event) => {
  const hostelId = getRouterParam(event, "hostelId");
  const roomId = getRouterParam(event, "roomId");

  if (!hostelId || !roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel ID and room ID are required",
    });
  }

  const room = await roomRepository.getPublicRoomDetails(hostelId, roomId);

  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: "Room not found in this hostel",
    });
  }

  return {
    success: true,
    room,
  };
});
