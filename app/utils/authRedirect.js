const redirectOrigin = "http://localhost";

export const getSafeRedirect = (destination) => {
  if (
    typeof destination !== "string" ||
    !destination.startsWith("/") ||
    destination.startsWith("//") ||
    destination.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(destination)
  ) {
    return null;
  }

  try {
    const url = new URL(destination, redirectOrigin);

    if (
      url.origin !== redirectOrigin ||
      url.pathname === "/login" ||
      url.pathname === "/login/"
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return destination;
};
