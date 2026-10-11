import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

import {
  allowedMimeTypes,
  MAX_HOSTEL_IMAGE_SIZE,
} from "~/shared/validation/hostel.js";
export const uploadImageToCloudinary = async (file, folderName) => {
  const config = useRuntimeConfig();

  cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "No image provided",
    });
  }

  // Validate file type
  if (!allowedMimeTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid image format",
    });
  }

  // Validate file size
  if (file.data.length > MAX_HOSTEL_IMAGE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image must be under 2MB",
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName || "hostel_images",
          resource_type: "image",
          transformation: [
            {
              width: 800,
              height: 600,
              crop: "fill",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      Readable.from(file.data).pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Image upload failed",
    });
  }
};
