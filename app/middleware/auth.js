export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user", () => null);

  if (!user.value) {
    return navigateTo("/login");
  }
});
