export const useAdmin = () => {
  const loading = ref(true);

  const requestFetch = useRequestFetch();

  const getDashboardStats = async () => {
    loading.value = true;

    try {
      return await requestFetch("/api/admin/dashboard");
    } finally {
      loading.value = false;
    }
  };

  const getAllocations = async (params) => {
    loading.value = true;

    try {
      return await requestFetch("/api/admin/allocations", {
        query: params,
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    getAllocations,
    getDashboardStats,
  };
};
