import * as bedRepository from "../repositories/bed.repository.js";

const ALLOWED_TIERS = new Set(["upper", "lower"]);

export const createBed = async ({ hostelId, roomId, bedNumber, tier }) => {
  if (!hostelId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel ID is required",
    });
  }

  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Room ID is required",
    });
  }

  if (!Number.isInteger(bedNumber) || bedNumber <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bed number must be a positive integer",
    });
  }

  if (!ALLOWED_TIERS.has(tier.toLowerCase())) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bed tier must be either upper or lower",
    });
  }

  try {
    return await bedRepository.createBed({
      hostelId,
      roomId,
      bedNumber,
      tier: tier.toLowerCase(),
    });
  } catch (error) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "That bed number already exists in this room",
      });
    }

    throw error;
  }
};
