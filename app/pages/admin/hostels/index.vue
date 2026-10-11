<template>
  <div class="admin-hostels-page">
    <!-- 1. Page Header -->
    <div class="page-header">
      <div>
        <span class="page-tag">ADMINISTRATION</span>
        <h1 class="page-title">Hostels</h1>
        <p class="page-subtitle">
          Manage hostel buildings, rooms and beds across the institution.
        </p>
      </div>

      <button @click="isAddModalOpen = true" class="btn-primary">
        <Icon name="lucide:plus" size="18" />
        Add Hostel
      </button>
    </div>

    <!-- 2. Hostel List Grid -->
    <div class="hostels-grid">
      <div class="hostel-card" v-for="hostel in hostels" :key="hostel.id">
        <div class="hostel-card-top">
          <div>
            <div class="name-row">
              <h3 class="hostel-name">{{ hostel.name }}</h3>
              <span
                class="status-badge"
                :class="hostel.active ? 'active' : 'inactive'"
              >
                {{ hostel.active ? "Active" : "Inactive" }}
              </span>
            </div>
            <span class="gender-tag">{{ hostel.gender }} Hostel</span>
          </div>
        </div>

        <!-- Calculated Stats Grid -->
        <div class="stats-mini-grid">
          <div class="stat-box">
            <span class="stat-val">{{ hostel.totalRooms }}</span>
            <span class="stat-key">Rooms</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ hostel.totalBeds }}</span>
            <span class="stat-key">Total Beds</span>
          </div>
          <div class="stat-box">
            <span class="stat-val text-navy">{{ hostel.occupiedBeds }}</span>
            <span class="stat-key">Occupied</span>
          </div>
          <div class="stat-box">
            <span class="stat-val text-success">{{
              hostel.availableBeds
            }}</span>
            <span class="stat-key">Available</span>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="hostel-card-actions">
          <NuxtLink :to="`/admin/hostels/${hostel.id}`" class="btn-view">
            View Hostel
          </NuxtLink>
          <button @click="editHostel(hostel)" class="btn-edit">Edit</button>
        </div>
      </div>
    </div>

    <!-- Add Hostel Modal Component -->
    <AddHostelModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @created="handleHostelCreated"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const isAddModalOpen = ref(false);

const { getHostels, loading } = useHostels();

const hostels = ref([]);

const loadHostels = async () => {
  const response = await getHostels();

  hostels.value = response.hostels;
};

await loadHostels();

const handleHostelCreated = async () => {
  await loadHostels();
};
</script>
<style scoped>
.admin-hostels-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.page-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.375rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.625rem 1.25rem;
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

/* Hostels Grid */
.hostels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.hostel-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hostel-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.hostel-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0;
}

.gender-tag {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

/* Stats Mini Grid */
.stats-mini-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  background-color: var(--color-bg-light);
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  text-align: center;
}

.stat-box {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-navy);
}

.stat-key {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: 700;
}

.text-success {
  color: var(--color-success);
}

/* Card Actions */
.hostel-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.btn-view {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.btn-view:hover {
  opacity: 0.9;
}

.btn-edit {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.btn-edit:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hostels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hostels-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
