import jwt from "jsonwebtoken";

export const createToken = (payload) => {
  const config = useRuntimeConfig();

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
};

export const verifyToken = (token) => {
  const config = useRuntimeConfig();

  return jwt.verify(token, config.jwtSecret);
};

export const createSetupToken = (payload) => {
  const config = useRuntimeConfig();

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "10m",
  });
};

export const verifySetupToken = (token) => {
  const config = useRuntimeConfig();

  const payload = jwt.verify(token, config.jwtSecret);

  if (payload.purpose !== "password_setup") {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid setup token purpose",
    });
  }

  return payload;
};
