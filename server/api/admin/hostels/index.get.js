import * as hostelRepository from "../../../repositories/hostel.repository.js";
import { requireRole } from "../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const hostels = await hostelRepository.getAllHostels();

  return {
    success: true,
    hostels,
  };
});
