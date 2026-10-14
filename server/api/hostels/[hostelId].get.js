import * as hostelRepository from "../../repositories/hostel.repository.js";

export default defineEventHandler(async (event) => {
  const hostelId = Number(getRouterParam(event, "hostelId"));
  const query = getQuery(event);

  const page = Number(query.page ?? 1);

  if (
    !Number.isInteger(hostelId) ||
    hostelId <= 0 ||
    !Number.isInteger(page) ||
    page < 1
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid hostel ID or page number",
    });
  }

  const hostel = await hostelRepository.getPublicHostelDetails(hostelId, page);

  if (!hostel) {
    throw createError({
      statusCode: 404,
      statusMessage: "Hostel not found",
    });
  }

  return {
    success: true,
    data: hostel,
  };
});
