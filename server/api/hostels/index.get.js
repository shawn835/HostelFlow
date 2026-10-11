import * as hostelRepository from "../../repositories/hostel.repository.js";
export default defineEventHandler(async () => {
  const hostels = await hostelRepository.getPublicHostels();

  return {
    success: true,
    hostels,
  };
});
