import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const validatePassword = (password, confirmPassword) => {
  if (!password || typeof password !== "string") {
    throw new Error("Password is required.");
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    throw new Error("Password confirmation is required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter.");
  }

  if (!/\d/.test(password)) {
    throw new Error("Password must contain at least one number.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error("Password must contain at least one special character.");
  }
};
