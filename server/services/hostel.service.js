import * as hostelRepository from "../repositories/hostel.repository.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const createHostel = async (data) => {
  const { name, gender, price, image } = data;

  // Validation

  if (!name || !gender || !price || !image) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, gender, price and image are required",
    });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hostel name must be a valid string",
    });
  }

  if (typeof gender !== "string" || gender.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Gender must be a valid string",
    });
  }

  if (!Number.isInteger(price) || price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Price must be a positive integer",
    });
  }

  // Upload image to Cloudinary
  let imageUrl = null;

  if (image) {
    const uploadedImage = await uploadImageToCloudinary(image, "hostel_images");

    imageUrl = uploadedImage.url;
    // public_id = uploadedImage.publicId;
  }

  // Create hostel
  return await hostelRepository.createHostel({
    name: name.trim(),
    gender: gender.trim(),
    price,
    image: imageUrl,
  });
};
