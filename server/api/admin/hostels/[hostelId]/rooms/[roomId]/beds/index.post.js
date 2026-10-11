import { createBed } from "../../../../../../../services/bed.service.js";
import { requireRole } from "../../../../../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const hostelId = getRouterParam(event, "hostelId");
  const roomId = getRouterParam(event, "roomId");
  const body = await readBody(event);

  const bed = await createBed({
    hostelId,
    roomId,
    bedNumber: Number(body.bedNumber),
    tier: body.tier,
  });

  return {
    success: true,
    bed,
  };
});
