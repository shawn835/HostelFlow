export const setAuthCookie = (event, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  setCookie(event, "token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const setSetupCookie = (event, setupToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  setCookie(event, "setupToken", setupToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
};

export const clearAuthCookie = (event) => {
  const isProduction = process.env.NODE_ENV === "production";

  deleteCookie(event, "token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

export const clearSetupCookie = (event) => {
  const isProduction = process.env.NODE_ENV === "production";

  deleteCookie(event, "setupToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};
