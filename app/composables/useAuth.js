export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);
  const user = useState("user", () => null);
  const authChecked = useState("auth-checked", () => false);
  const logOut = async () => {
    loading.value = true;

    try {
      const res = await $fetch("/api/auth/logout", {
        method: "DELETE",
      });

      user.value = null;
      authChecked.value = false;

      return res;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    logOut,
  };
};
