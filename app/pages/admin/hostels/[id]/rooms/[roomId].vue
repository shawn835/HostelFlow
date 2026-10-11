<template>
  <div class="admin-room-detail-page">
    <!-- Back Navigation to Hostel Detail -->
    <NuxtLink :to="`/admin/hostels/${hostelId}`" class="back-link">
      <Icon name="lucide:arrow-left" size="16" />
      <span>{{ hostelName }}</span>
    </NuxtLink>

    <!-- Room Header & Metrics Summary Card -->
    <div class="room-detail-header-card">
      <div class="header-main-info">
        <h1 class="room-title">Room {{ room.roomNumber }}</h1>
        <p class="room-counts-summary">
          {{ room.totalBeds }} Beds · {{ room.occupiedBeds }} Occupied ·
          {{ room.availableBeds }} Available
        </p>
      </div>

      <div class="room-badge-box">
        <span class="status-badge success" v-if="room.availableBeds > 0"
          >Spaces Available</span
        >
        <span class="status-badge warning" v-else>Fully Occupied</span>
      </div>
    </div>

    <!-- Beds Table Section with Add Bed Action -->
    <DataTable
      title="Beds"
      subtitle="Manage individual bed tiers and student assignments for this room."
      :columns="bedColumns"
      :rows="beds"
    >
      <template #toolbar>
        <button @click="isAddBedModalOpen = true" class="btn-primary">
          <Icon name="lucide:plus" size="18" />
          Add Bed
        </button>
      </template>

      <!-- Custom Slot for Status column -->
      <template #status="{ row }">
        <span class="status-badge" :class="row.status.toLowerCase()">
          {{ row.status }}
        </span>
      </template>

      <!-- Custom Slot for Occupant column -->
      <template #occupant="{ row }">
        <span
          :class="
            row.occupant === '—'
              ? 'text-muted'
              : 'font-mono font-bold text-navy'
          "
        >
          {{ row.occupantAdmissionNumber || "—" }}
        </span>
      </template>
    </DataTable>

    <!-- Add Bed Modal Component -->
    <AddBedModal
      :isOpen="isAddBedModalOpen"
      :roomId="roomId"
      :hostelId="hostelId"
      @close="isAddBedModalOpen = false"
      @created="handleBedCreated"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();

const hostelId = route.params.id;
const roomId = route.params.roomId;

const isAddBedModalOpen = ref(false);

const { getRoomBeds, loading } = useHostels();

// Room summary metrics
const room = ref(null);

// Beds
const beds = ref([]);

const bedColumns = [
  { key: "bedNumber", label: "Bed" },
  { key: "tier", label: "Tier" },
  { key: "status", label: "Status" },
  { key: "occupantAdmissionNumber", label: "Occupant" },
];

const loadRoomBeds = async () => {
  const response = await getRoomBeds(hostelId, roomId);

  room.value = response.room;
  beds.value = response.beds;
};

await loadRoomBeds();

const handleBedCreated = async () => {
  isAddBedModalOpen.value = false;

  await loadRoomBeds();
};
</script>

<style scoped>
.admin-room-detail-page {
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

.room-detail-header-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.room-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
}

.room-counts-summary {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
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

/* Status Badges */
.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

.text-muted {
  color: var(--color-text-muted);
}
.font-mono {
  font-family: monospace;
}
.font-bold {
  font-weight: 700;
}
.text-navy {
  color: var(--color-navy);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .room-detail-header-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
}
</style>
