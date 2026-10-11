import { createHostel } from "../../../services/hostel.service.js";
import { requireRole } from "../../../utils/authorization.js";

export default defineEventHandler(async (event) => {
  await requireRole(event, "admin");

  const parts = await readMultipartFormData(event);

  if (!parts) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid form data",
    });
  }

  let name;
  let gender;
  let price;
  let image;

  for (const part of parts) {
    if (part.name === "name") {
      name = part.data.toString();
    }

    if (part.name === "gender") {
      gender = part.data.toString();
    }

    if (part.name === "price") {
      console.log("price", price);
      price = Number(part.data.toString());
    }

    if (part.name === "image") {
      image = part;
    }
  }

  const hostel = await createHostel({
    name,
    gender,
    price,
    image,
  });

  return {
    success: true,
    hostel,
  };
});
