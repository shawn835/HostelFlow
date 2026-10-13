<template>
  <LoadingSpinner
    fullScreen
    text="Loading room details..."
    v-if="roomLoading"
  />
  <div v-else-if="error" class="room-page">
    <div class="container">
      <p class="room-meta-desc">
        Unable to load room details: {{ error.message || "Please try again." }}
      </p>
      <button class="btn-action btn-reserve" @click="loadRoom">
        Try again
      </button>
    </div>
  </div>
  <div v-else-if="room" class="room-page">
    <div class="container">
      <!-- 1. Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/hostels" class="breadcrumb-link">Hostels</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <NuxtLink :to="`/hostels/${room.hostelId}`" class="breadcrumb-link">{{
          hostelName
        }}</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ room.roomNumber }}</span>
      </nav>

      <!-- 2. Room Header -->
      <div class="room-header">
        <div class="room-title-group">
          <span class="hostel-subtitle">{{ hostelName }}</span>
          <h1 class="room-title">{{ room.roomNumber }}</h1>
          <p class="room-meta-desc">
            {{ room.totalBeds }} {{ room.totalBeds === 1 ? "bed" : "beds" }} ·
            {{ room.bedArrangements }}
          </p>
        </div>

        <div class="availability-badge-wrapper">
          <span
            class="availability-badge"
            :class="availableBedsCount > 0 ? 'badge-green' : 'badge-gray'"
          >
            <span class="pulse-dot" v-if="availableBedsCount > 0"></span>
            {{ availableBedsCount }}
            {{ availableBedsCount === 1 ? "bed" : "beds" }} available
          </span>
        </div>
      </div>

      <!-- Main Grid Layout (Left: Visualization & Selection, Right: Room Info & Payment) -->
      <div class="room-content-grid">
        <!-- Left Column: Visual Bunk Beds & Legend -->
        <div class="visual-section">
          <div class="room-visual-card">
            <h3 class="visual-heading">Select Your Bed</h3>
            <p class="visual-subtext">
              Click an available bunk below to preview and reserve.
            </p>

            <div v-if="beds.length" class="beds-grid">
              <div
                v-for="bed in beds"
                :key="bed.id"
                class="bed-unit"
                :class="getBedClass(bed)"
                role="button"
                :tabindex="bed.status === 'available' ? 0 : -1"
                :aria-disabled="bed.status !== 'available'"
                :aria-label="`${bed.name}, ${bed.tier}, ${getBedStatusLabel(bed)}`"
                @click="handleBedClick(bed)"
                @keydown.enter="handleBedClick(bed)"
                @keydown.space.prevent="handleBedClick(bed)"
              >
                <div class="bed-info">
                  <span class="bed-id">{{ bed.name }}</span>
                  <span class="bed-tier">{{ bed.tier }}</span>
                </div>
                <span class="bed-status-pill">
                  {{ getBedStatusLabel(bed) }}
                </span>
              </div>
            </div>
            <p v-else class="room-meta-desc">
              No beds have been added to this room yet.
            </p>

            <!-- 5. Bed Legend -->
            <div class="bed-legend">
              <div class="legend-item">
                <span class="dot dot-avail"></span> available
              </div>
              <div class="legend-item">
                <span class="dot dot-sel"></span> selected
              </div>
              <div class="legend-item">
                <span class="dot dot-occ"></span> occupied
              </div>
            </div>
          </div>

          <!-- 4. Bed Information Confirmation Panel (Appears on click) -->
          <div class="selection-panel" v-if="selectedBed">
            <div class="panel-header">
              <span class="panel-title-tag">Selected Bed</span>
              <button @click="selectedBed = null" class="clear-selection-btn">
                Change
              </button>
            </div>

            <div class="panel-body">
              <div class="panel-details">
                <h4>
                  {{ selectedBed.name }}
                  <span class="tier-badge">{{ selectedBed.tier }}</span>
                </h4>
                <p>{{ room.roomNumber }} · {{ hostelName }}</p>
              </div>
              <div class="panel-status">
                <span class="status-green">Status: Available</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Room Info & 7. Payment Status Guard -->
        <div class="sidebar-section">
          <!-- 6. Room Information Card -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">Room Information</h3>
            <ul class="info-list">
              <li>
                <span class="info-key">Hostel</span>
                <span class="info-val">{{ hostelName }}</span>
              </li>
              <li>
                <span class="info-key">Room</span>
                <span class="info-val">{{ room.roomNumber }}</span>
              </li>
              <li>
                <span class="info-key">Capacity</span>
                <span class="info-val">{{ room.capacity }} students</span>
              </li>
              <li>
                <span class="info-key">Bed arrangement</span>
                <span class="info-val">{{ room.bedArrangements }}</span>
              </li>
              <li>
                <span class="info-key">Gender</span>
                <span class="info-val">Based on floor assignment</span>
              </li>
            </ul>
          </div>

          <!-- 7. Important: Payment Status Guard Card -->
          <div class="sidebar-card payment-guard-card">
            <!-- UNPAID STATE -->
            <template v-if="!isPaid">
              <div class="payment-alert unpaid">
                <div class="alert-icon-wrap red-icon">
                  <Icon name="lucide:lock" size="20" />
                </div>
                <div>
                  <h4>take note</h4>
                  <p>
                    You need to have completed payment by the payment provider
                    before reserving a bed.
                  </p>
                </div>
              </div>

              <button @click="reserveRoom" class="btn-action btn-reserve">
                <LoadingSpinner v-if="bookingLoading" size="sm" />
                <span v-else>reserve room</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const hostelId = route.params.id;
const roomId = route.params.roomId;
const { $toast } = useNuxtApp();

const { getPublicRoomDetails, loading: roomLoading } = useHostels();
const { createBooking, loading: bookingLoading } = useBooking();

const room = ref(null);
const selectedBed = ref(null);

const hostelName = computed(() => room.value?.hostelName ?? "Hostel");

const loadRoom = async () => {
  try {
    const response = await getPublicRoomDetails(hostelId, roomId);

    room.value = response.room;
  } catch (err) {
    console.error("Error loading room:", err);
  }
};

await loadRoom();

const beds = computed(() => room.value?.beds ?? []);

const availableBedsCount = computed(() => {
  return beds.value.filter((bed) => bed.status === "available").length;
});

const handleBedClick = (bed) => {
  if (!bed) return;
  if (bed.status !== "available") return;

  if (selectedBed.value?.id === bed.id) {
    selectedBed.value = null;
  } else {
    selectedBed.value = bed;
  }
};

const getBedClass = (bed) => {
  if (selectedBed.value?.id === bed.id) {
    return "unit-selected";
  }

  if (bed.status === "available") {
    return "unit-available";
  }

  if (bed.status === "pending") {
    return "unit-reserved";
  }

  return "unit-occupied";
};

const getBedStatusLabel = (bed) => {
  if (selectedBed.value?.id === bed.id) {
    return "Selected";
  }

  if (bed.status === "available") {
    return "Available";
  }

  if (bed.status === "pending") {
    return "Pending";
  }

  return "Occupied";
};

//reserving
const reserveRoom = async () => {
  if (!selectedBed.value) {
    $toast.error("Please select a bed to reserve.");
    return;
  }

  try {
    await createBooking(selectedBed.value.id);

    $toast.success("Bed reserved successfully!");
    await navigateTo("/bookings");
  } catch (err) {
    $toast.error(
      err?.data?.statusMessage ||
        err?.statusMessage ||
        "Failed to reserve bed. Please try again",
    );
  }
};
</script>

<style scoped>
.room-page {
  background-color: var(--color-bg-light);
  padding: 2.5rem 0 5rem 0;
  min-height: 85vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.breadcrumb-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: var(--color-navy);
  font-weight: 600;
}

/* Header */
.room-header {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.hostel-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.room-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0.25rem 0;
}

.room-meta-desc {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
}

.availability-badge {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-green {
  background-color: #f0fdf4;
  color: var(--color-success);
  border: 1px solid #bbf7d0;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-success);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* Grid Layout */
.room-content-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 2rem;
}

/* Visual Section */
.room-visual-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  margin-bottom: 1.5rem;
}

.visual-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.25rem;
}

.visual-subtext {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.beds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin: 0 auto 2rem;
}

/* Bed Unit Styling */
.bed-unit {
  background-color: var(--color-white);
  border-radius: 0.625rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.unit-available {
  border-color: #bbf7d0;
  background-color: #f0fdf4;
  color: var(--color-success);
  cursor: pointer;
}
.unit-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
}

.unit-selected {
  border-color: var(--color-primary);
  background-color: #eff6ff;
  color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  cursor: pointer;
}

.unit-reserved {
  border-color: #fde68a;
  background-color: #fef3c7;
  color: var(--color-warning);
  cursor: not-allowed;
}

.unit-occupied {
  border-color: var(--color-border);
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.8;
}

.bed-info {
  display: flex;
  flex-direction: column;
}

.bed-id {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-navy);
}

.bed-tier {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.bed-status-pill {
  font-size: 0.75rem;
  font-weight: 600;
}

/* Legend */
.bed-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-avail {
  background-color: var(--color-success);
}
.dot-sel {
  background-color: var(--color-primary);
}
.dot-occ {
  background-color: #94a3b8;
}
.dot-res {
  background-color: var(--color-warning);
}

/* Selection Panel */
.selection-panel {
  background-color: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.1);
  animation: slideUp 0.25s ease-out forwards;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.panel-title-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
}

.clear-selection-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  text-decoration: underline;
}

.panel-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-details h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tier-badge {
  font-size: 0.75rem;
  background-color: #f1f5f9;
  color: var(--color-text-muted);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.panel-details p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.status-green {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-success);
}

/* Sidebar Section */
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.info-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9375rem;
}

.info-key {
  color: var(--color-text-muted);
}

.info-val {
  color: var(--color-navy);
  font-weight: 600;
}

/* Payment Guard Card */
.payment-guard-card {
  position: relative;
}

.tester-toggle-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-bg-light);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.tester-btn {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}

.payment-alert {
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
}

.payment-alert.unpaid {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.payment-alert.paid {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.alert-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.red-icon {
  background-color: #fee2e2;
  color: #dc2626;
}
.green-icon {
  background-color: #dcfce7;
  color: var(--color-success);
}

.payment-alert h4 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
}

.payment-alert p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.btn-action {
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
}

.btn-reserve {
  background-color: var(--color-navy);
  color: var(--color-white);
}
.btn-reserve:hover {
  background-color: #1e293b;
}

.btn-reserve {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn-reserve:hover:not(.btn-disabled) {
  opacity: 0.9;
}

.btn-disabled {
  background-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 968px) {
  .room-content-grid {
    grid-template-columns: 1fr;
  }

  .room-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
