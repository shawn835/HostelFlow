<template>
  <LoadingSpinner fullScreen text="loading hostel data..." v-if="loading" />
  <div v-else-if="error" class="hostel-detail-page">
    <div class="container">
      <p>
        Unable to load hostel details:
        {{ error.message || "Please try again." }}
      </p>
      <button @click="loadHostel">Try again</button>
    </div>
  </div>
  <div class="hostel-detail-page" v-else-if="hostel">
    <div class="container">
      <!-- Back Link -->
      <NuxtLink to="/hostels" class="back-link">
        <Icon name="lucide:arrow-left" size="16" />
        <span>Back to Hostels</span>
      </NuxtLink>

      <!-- Hostel Header Banner -->
      <div class="hostel-banner">
        <div class="banner-content">
          <div class="title-row">
            <h1 class="hostel-name">{{ hostel.name }}</h1>
            <span class="gender-badge" :class="getGenderClass(hostel.gender)">
              {{ hostel.gender }}
            </span>
          </div>
          <p class="hostel-desc">
            Accommodation information and real-time room availability for
            {{ hostel.name }}.
          </p>
        </div>

        <div class="banner-image-wrapper">
          <img :src="hostel.image" :alt="hostel.name" class="banner-img" />
        </div>
      </div>

      <!-- Hostel Information Stats Grid -->
      <div class="info-section">
        <h2 class="section-heading">Hostel Information</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Gender</span>
            <span class="stat-value">{{ hostel.gender }}</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Price</span>
            <span class="stat-value"
              >KSh {{ hostel.price.toLocaleString() }}
              <small>/semester</small></span
            >
          </div>

          <div class="stat-card">
            <span class="stat-label">Total Rooms</span>
            <span class="stat-value">{{ hostel.totalRooms }}</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Total Beds</span>
            <span class="stat-value">{{ hostel.totalBeds }}</span>
          </div>

          <div class="stat-card highlight-card">
            <span class="stat-label">Available Beds</span>
            <span class="stat-value text-success">{{
              hostel.bedsAvailable
            }}</span>
          </div>
        </div>
      </div>

      <!-- Choose Your Room Section -->
      <div class="rooms-section">
        <div class="rooms-header-row">
          <h2 class="section-heading">Choose your room</h2>
          <span class="rooms-hint">Select a room to view available beds</span>
        </div>

        <div class="rooms-list">
          <div v-for="room in hostel.rooms" :key="room.number" class="room-row">
            <div class="room-info">
              <span class="room-number">{{ room.number }}</span>
              <span class="room-meta">{{ room.totalBeds }} beds</span>
            </div>

            <div class="room-status-wrapper">
              <span
                class="room-availability"
                :class="room.available > 0 ? 'text-success' : 'text-danger'"
              >
                <Icon
                  :name="
                    room.available > 0
                      ? 'lucide:check-circle'
                      : 'lucide:x-circle'
                  "
                  size="14"
                />
                {{ room.available }} available
              </span>

              <template v-if="room.available > 0">
                <button @click="viewBeds(room.id)" class="btn-view-beds">
                  view bed
                  <Icon name="lucide:arrow-right" size="14" />
                </button>
              </template>
              <template v-else>
                <span class="badge-full">Full</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const hostelId = route.params.id;

const { getPublicHostelDetails, loading } = useHostels();

const hostel = ref(null);
const error = ref(null);

const loadHostel = async () => {
  error.value = null;

  try {
    const response = await getPublicHostelDetails(hostelId);

    hostel.value = response.hostel;
  } catch (err) {
    error.value = err;
  }
};

await loadHostel();

const getGenderClass = (gender) => {
  if (gender === "Boys") return "badge-boys";
  if (gender === "Girls") return "badge-girls";

  return "badge-coed";
};

const viewBeds = (roomId) => {
  navigateTo(`/hostels/${hostel.value.id}/rooms/${roomId}`);
};
</script>

<style scoped>
.hostel-detail-page {
  background-color: var(--color-bg-light);
  padding: 3rem 0 5rem 0;
  min-height: 80vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

/* Banner */
.hostel-banner {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2.5rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.hostel-name {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0;
}

.gender-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.badge-boys {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.badge-girls {
  background-color: #db2777;
  color: var(--color-white);
}
.badge-coed {
  background-color: var(--color-navy);
  color: var(--color-white);
}

.hostel-desc {
  font-size: 1.0625rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.banner-image-wrapper {
  height: 200px;
  border-radius: 0.75rem;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info Section */
.section-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.highlight-card {
  border-color: #bbf7d0;
  background-color: #f0fdf4;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-navy);
}

.stat-value small {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

.text-success {
  color: var(--color-success);
}
.text-danger {
  color: #dc2626;
}

/* Rooms Section */
.rooms-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.rooms-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.rooms-hint {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.room-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  transition: border-color 0.2s ease;
}

.room-row:hover {
  border-color: #cbd5e1;
}

.room-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.room-number {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-navy);
}

.room-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.room-status-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.room-availability {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.btn-view-beds {
  background-color: #eff6ff;
  color: var(--color-primary);
  border: 1px solid #bfdbfe;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: background-color 0.2s ease;
}

.btn-view-beds:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.badge-full {
  background-color: #f1f5f9;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hostel-banner {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .room-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .room-status-wrapper {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
