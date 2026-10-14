import { getSafeRedirect } from "../utils/authRedirect.js";

export default defineNuxtRouteMiddleware((to) => {
  const user = useState("user", () => null);

  if (user.value) {
    const defaultDestination =
      user.value.role === "admin" ? "/admin/hostels" : "/bookings";
    const destination =
      getSafeRedirect(to.query.redirect) || defaultDestination;

    return navigateTo(destination, { replace: true });
  }
});
