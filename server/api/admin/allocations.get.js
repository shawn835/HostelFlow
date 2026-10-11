import { requireRole } from "../../utils/authorization.js";
import { getAllAllocations } from "../../repositories/admin-booking.repository.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const query = getQuery(event);

  const parsePositiveInt = (value, fallback) => {
    if (value === undefined || value === "") {
      return fallback;
    }

    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid pagination parameters",
      });
    }

    return parsed;
  };

  const page = parsePositiveInt(query.page, 1);
  const perPage = parsePositiveInt(query.perPage, 20);

  if (perPage > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: "perPage cannot exceed 100",
    });
  }

  const search =
    typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";

  // Extract and sanitize the hostel ID filter
  const hostel =
    typeof query.hostel === "string" && query.hostel.trim() !== ""
      ? query.hostel.trim().slice(0, 50)
      : undefined;

  const allowedStatuses = ["confirmed", "cancelled", "pending"];

  let status;

  if (query.status !== undefined && query.status !== "") {
    if (
      typeof query.status !== "string" ||
      !allowedStatuses.includes(query.status)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid booking status",
      });
    }

    status = query.status;
  }

  const result = await getAllAllocations({
    page,
    perPage,
    search,
    status,
    hostel,
  });

  return {
    success: true,
    ...result,
  };
});
