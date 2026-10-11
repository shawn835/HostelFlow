import { requireRole } from "../../utils/authorization.js";
import {
  getDashboardOverview,
  getHostelOccupancy,
  getLatestAllocations,
  getInterventionCount,
} from "../../repositories/admin-dashboard.repository.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const [
    overview,
    hostelOccupancy,
    latestAllocations,
    interventionRequired,
  ] = await Promise.all([
    getDashboardOverview(),
    getHostelOccupancy(),
    getLatestAllocations(),
    getInterventionCount(),
  ]);

  return {
    success: true,
    overview,
    hostelOccupancy,
    latestAllocations,
    interventionRequired,
  };
});