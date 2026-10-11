// server/services/room.service.js

import * as roomRepository from "../repositories/room.repository";

export const createRoom = async ({ hostelId, roomNumber }) => {
  if (!hostelId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel ID is required",
    });
  }

  if (!roomNumber || typeof roomNumber !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Room number is required",
    });
  }

  const normalizedRoomNumber = roomNumber.trim().toUpperCase();

  if (!normalizedRoomNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: "Room number cannot be empty",
    });
  }
  try {
    return await roomRepository.createRoom({
      hostelId,
      roomNumber: normalizedRoomNumber,
    });
  } catch (error) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Room already exists in this hostel",
      });
    }

    throw error;
  }
};
