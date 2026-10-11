export const useHostels = () => {
  const loading = ref(false);
  const error = ref(null);
  const requestFetch = useRequestFetch();

  const createHostel = async (form) => {
    loading.value = true;

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("gender", form.gender);
      formData.append("price", form.price);

      if (form.image) {
        formData.append("image", form.image);
      }

      return await requestFetch("/api/admin/hostels", {
        method: "POST",
        body: formData,
      });
    } finally {
      loading.value = false;
    }
  };

  const getHostels = async () => {
    loading.value = true;

    try {
      return await requestFetch("/api/admin/hostels");
    } finally {
      loading.value = false;
    }
  };

  const createRoom = async (hostelId, roomNumber) => {
    loading.value = true;

    try {
      return await requestFetch(`/api/admin/hostels/${hostelId}/rooms`, {
        method: "POST",
        body: { roomNumber },
      });
    } finally {
      loading.value = false;
    }
  };

  const getHostel = async (hostelId) => {
    loading.value = true;

    try {
      return await requestFetch(`/api/admin/hostels/${hostelId}`);
    } finally {
      loading.value = false;
    }
  };

  const createBed = async (hostelId, roomId, bedNumber, tier) => {
    loading.value = true;

    try {
      return await requestFetch(
        `/api/admin/hostels/${hostelId}/rooms/${roomId}/beds`,
        {
          method: "POST",
          body: {
            bedNumber,
            tier,
          },
        },
      );
    } finally {
      loading.value = false;
    }
  };

  const getRoomBeds = async (hostelId, roomId) => {
    loading.value = true;

    try {
      return await requestFetch(
        `/api/admin/hostels/${hostelId}/rooms/${roomId}/beds`,
      );
    } finally {
      loading.value = false;
    }
  };

  //shared data fetching methods for public hostel pages
  const getPublicHostels = () => {
    return useFetch("/api/hostels", {
      key: "public-hostels",
    });
  };

  const usePublicHostels = () => {
    return useFetch("/api/hostels", {
      key: "public-hostels",
    });
  };

  const getPublicHostelDetails = async (hostelId) => {
    loading.value = true;

    try {
      return await $fetch(`/api/hostels/${hostelId}`);
    } finally {
      loading.value = false;
    }
  };

  const getPublicRoomDetails = async (hostelId, roomId) => {
    loading.value = true;

    try {
      return await $fetch(`/api/hostels/${hostelId}/rooms/${roomId}`);
    } finally {
      loading.value = false;
    }
  };

  return {
    createHostel,
    getHostels,
    createRoom,
    getHostel,
    createBed,
    getRoomBeds,

    getPublicHostels,
    usePublicHostels,
    getPublicRoomDetails,
    getPublicHostelDetails,

    loading,
    error,
  };
};
