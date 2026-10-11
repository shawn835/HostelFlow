<template>
  <div class="admin-hostel-detail-page">
    <!-- Back Navigation -->
    <NuxtLink to="/admin/hostels" class="back-link">
      <Icon name="lucide:arrow-left" size="16" />
      <span>Hostels</span>
    </NuxtLink>

    <!-- Hostel Header & Metrics Summary Card -->
    <div class="hostel-detail-header-card">
      <div class="header-main-info">
        <div class="title-row">
          <h1 class="hostel-title">{{ hostel.name }}</h1>
          <span class="gender-pill">{{ hostel.gender }}</span>
        </div>
        <p class="hostel-counts-summary">
          {{ hostel.totalRooms }} Rooms · {{ hostel.totalBeds }} Beds
        </p>
      </div>

      <div class="occupancy-pill-box">
        <div class="occ-stat">
          <span class="occ-val text-navy">{{ hostel.occupiedBeds }}</span>
          <span class="occ-lbl">Occupied</span>
        </div>
        <div class="divider-vertical"></div>
        <div class="occ-stat">
          <span class="occ-val text-success">{{ hostel.availableBeds }}</span>
          <span class="occ-lbl">Available</span>
        </div>
      </div>
    </div>

    <!-- Rooms Table Section with Add Room Action -->
    <DataTable
      title="Rooms"
      subtitle="Manage individual rooms and bed allocations for this building."
      :columns="roomColumns"
      :rows="rooms"
    >
      <template #toolbar>
        <button @click="isAddRoomModalOpen = true" class="btn-primary">
          <Icon name="lucide:plus" size="18" />
          Add Room
        </button>
      </template>

      <!-- Custom Slot for Action column -->
      <template #action="{ row }">
        <button @click="viewRoom(row)" class="btn-table-action">View</button>
      </template>
    </DataTable>

    <!-- Add Room Modal Component -->
    <AddRoomModal
      :isOpen="isAddRoomModalOpen"
      :hostelId="hostelId"
      @close="isAddRoomModalOpen = false"
      @created="handleRoomCreated"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});
const route = useRoute();
const router = useRouter();

const hostelId = route.params.id;

const isAddRoomModalOpen = ref(false);

const { getHostel, loading } = useHostels();

const hostel = ref(null);
const rooms = ref([]);

const roomColumns = [
  { key: "roomNumber", label: "Room" },
  { key: "totalBeds", label: "Beds" },
  { key: "occupiedBeds", label: "Occupied" },
  { key: "availableBeds", label: "Available" },
  { key: "action", label: "Action" },
];

const loadHostel = async () => {
  const response = await getHostel(hostelId);

  hostel.value = response.hostel;
  rooms.value = response.hostel.rooms;
};

await loadHostel();

const viewRoom = (row) => {
  router.push(`/admin/hostels/${hostelId}/rooms/${row.id}`);
};

const handleRoomCreated = async () => {
  await loadHostel();
};
</script>

<style scoped>
.admin-hostel-detail-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  width: fit-content;
}

.back-link:hover {
  color: var(--color-primary);
}

.hostel-detail-header-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.25rem;
}

.hostel-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0;
}

.gender-pill {
  font-size: 0.75rem;
  font-weight: 700;
  background-color: #f1f5f9;
  color: var(--color-text-muted);
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.hostel-counts-summary {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
}

.occupancy-pill-box {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
}

.occ-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.occ-val {
  font-size: 1.25rem;
  font-weight: 800;
}

.occ-lbl {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.divider-vertical {
  width: 1px;
  height: 28px;
  background-color: var(--color-border);
}

.text-success {
  color: var(--color-success);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.625rem 1.125rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-table-action {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-table-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: #f8fafc;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hostel-detail-header-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
}
</style>
