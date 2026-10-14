export default defineNuxtRouteMiddleware((to) => {
  const user = useState("user", () => null);

  if (!user.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
