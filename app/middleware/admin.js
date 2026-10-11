export default defineNuxtRouteMiddleware(() => {
  const user = useState("user", () => null);

  if (!user.value) {
    return navigateTo("/login");
  }

  if (user.value.role !== "admin") {
    return navigateTo("/bookings");
  }
});
