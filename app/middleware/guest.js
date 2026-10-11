export default defineNuxtRouteMiddleware(() => {
  const user = useState("user", () => null);

  if (user.value) {
    return navigateTo(
      user.value.role === "admin" ? "/admin/hostels" : "/bookings",
    );
  }
});
