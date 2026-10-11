export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user", () => null);
  const authChecked = useState("auth-checked", () => false);

  if (authChecked.value) {
    return;
  }

  try {
    const requestFetch = useRequestFetch();
    const response = await requestFetch("/api/auth/me");

    user.value = response.user;
  } catch (error) {
    if (error?.statusCode !== 401 && error?.status !== 401) {
      throw error;
    }

    user.value = null;
  }

  authChecked.value = true;
});
