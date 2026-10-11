export const useBooking = () => {
  const loading = ref(false);
  const error = ref(null);

  const createBooking = async (bedId) => {
    loading.value = true;

    try {
      return await $fetch("/api/bookings", {
        method: "POST",
        body: { bedId },
      });
    } finally {
      loading.value = false;
    }
  };

  const useGetBooking = async () => {
    return await useFetch(`/api/bookings`);
  };


  const cancelBooking = async (bookingId) => {
    loading.value = true;

    try {
      return await $fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createBooking,
    useGetBooking,
    cancelBooking,
  };
};
