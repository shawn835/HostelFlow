import * as hostelRepository from "../../../../repositories/hostel.repository.js";
import { requireRole } from "../../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  requireRole(event, "admin");

  const hostelId = getRouterParam(event, "hostelId");

  if (!hostelId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel ID is required",
    });
  }

  const hostel = await hostelRepository.getHostelDetails(hostelId);

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
