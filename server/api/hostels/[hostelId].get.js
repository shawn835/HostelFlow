import * as hostelRepository from "../../repositories/hostel.repository.js";

export default defineEventHandler(async (event) => {
  const hostelId = getRouterParam(event, "hostelId");

  if (!hostelId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel ID is required",
    });
  }

  const hostel = await hostelRepository.getPublicHostelDetails(hostelId);

  if (!hostel) {
    throw createError({
      statusCode: 404,
      statusMessage: "Hostel not found",
    });
  }

  return {
    success: true,
    hostel,
  };
});
