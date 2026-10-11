<template>
  <LoadingSpinner v-if="loading" text="Loading dashboard data..." fullScreen />
  <div class="admin-dashboard" v-else>
    <div class="dashboard-header">
      <div>
        <span class="page-tag">ADMINISTRATION OVERVIEW</span>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          Welcome back. Here is the real-time summary of HostelFlow operations.
        </p>
      </div>

      <div class="header-action-group">
        <button @click="refreshData" class="btn-action-outline">
          <Icon name="lucide:refresh-cw" size="16" />
          Refresh Stats
        </button>
      </div>
    </div>

    <!-- 1. Overview Metric Cards Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon-box bg-blue">
          <Icon name="lucide:users" size="20" />
        </div>
        <div class="metric-content">
          <span class="metric-label">Students</span>
          <h3 class="metric-value">{{ overviewStats.students }}</h3>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-box bg-indigo">
          <Icon name="lucide:bed-double" size="20" />
        </div>
        <div class="metric-content">
          <span class="metric-label">Beds</span>
          <h3 class="metric-value">{{ overviewStats.beds }}</h3>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-box bg-amber">
          <Icon name="lucide:lock" size="20" />
        </div>
        <div class="metric-content">
          <span class="metric-label">Occupied</span>
          <h3 class="metric-value">{{ overviewStats.occupied }}</h3>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-box bg-green">
          <Icon name="lucide:check-circle-2" size="20" />
        </div>
        <div class="metric-content">
          <span class="metric-label">Available</span>
          <h3 class="metric-value text-success">
            {{ overviewStats.available }}
          </h3>
        </div>
      </div>
    </div>

    <!-- 2. Two-Column Section: Hostel Occupancy & Interventions -->
    <div class="dashboard-split-grid">
      <!-- Hostel Occupancy Progress Card -->
      <div class="dashboard-card">
        <div class="card-header-row">
          <h3 class="card-heading">Hostel Occupancy</h3>
          <span class="card-sub-hint">Capacity usage</span>
        </div>

        <div class="occupancy-list">
          <div
            class="occupancy-item"
            v-for="(stat, index) in occupancyStats"
            :key="stat.id || index"
          >
            <div class="occupancy-info">
              <span class="hostel-name">{{ stat.hostelName }}</span>
              <span class="occupancy-pct">{{ stat.occupancyPercentage }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div
                class="progress-bar-fill"
                :class="stat.fillClass || 'fill-kanu'"
                :style="{ width: `${stat.occupancyPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interventions Alert Card -->
      <div
        class="dashboard-card interventions-card"
        v-if="interventionRequired > 0"
      >
        <div class="card-header-row">
          <h3 class="card-heading">Interventions</h3>
          <span class="badge-alert">Action Needed</span>
        </div>

        <div class="intervention-body">
          <div class="alert-box">
            <Icon
              name="lucide:alert-triangle"
              size="24"
              class="text-warning-icon"
            />
            <div>
              <h4>{{ interventionRequired }} cases require attention</h4>
              <p>
                Unresolved allocation disputes, complaints, or other issues that
                need administrative review.
              </p>
            </div>
          </div>

          <NuxtLink to="/admin/interventions" class="btn-review">
            Review Cases
            <Icon name="lucide:arrow-right" size="16" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 3. Recent Allocations Table -->
    <div class="dashboard-card table-card">
      <div class="card-header-row">
        <div>
          <h3 class="card-heading">Recent Allocations</h3>
          <p class="card-description">
            Latest bed reservations across campus hostels.
          </p>
        </div>
        <NuxtLink to="/admin/allocations" class="view-all-link"
          >View all</NuxtLink
        >
      </div>

      <!-- DataTable Component -->
      <DataTable
        title="Recent Allocations"
        subtitle="Latest bed reservations across campus hostels."
        :columns="allocationColumns"
        :rows="recentAllocations"
      >
        <template #status="{ row }">
          <span class="status-badge" :class="row.status.toLowerCase()">
            {{ row.status }}
          </span>
        </template>

        <template #allocatedAt="{ row }">
          <span>{{ formatDate(row.allocatedAt) }}</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const allocationColumns = [
  { key: "admissionNumber", label: "Student" },
  { key: "hostelName", label: "Hostel" },
  { key: "roomNumber", label: "Room" },
  { key: "bedNumber", label: "Bed" },
  { key: "status", label: "Status" },
  { key: "allocatedAt", label: "Allocated At" },
];

const { getDashboardStats, loading } = useAdmin();

const dashboard = ref(null);

const loadDashboard = async () => {
  try {
    dashboard.value = await getDashboardStats();
  } catch (error) {
    console.error("failed fetch dashboard data", error);
  }
};

const refreshData = loadDashboard;

onMounted(loadDashboard);

const overviewStats = computed(() => dashboard.value?.overview ?? {});

const occupancyStats = computed(() => dashboard.value?.hostelOccupancy ?? []);

const recentAllocations = computed(
  () => dashboard.value?.latestAllocations ?? [],
);

const interventionRequired = computed(
  () => dashboard.value?.interventionRequired ?? 0,
);
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
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

.btn-action-outline {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-action-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.metric-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.metric-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  flex-shrink: 0;
}

.bg-blue {
  background-color: var(--color-primary);
}
.bg-indigo {
  background-color: #4f46e5;
}
.bg-amber {
  background-color: #d97706;
}
.bg-green {
  background-color: #16a34a;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0;
}

.text-success {
  color: var(--color-success);
}

/* Split Grid */
.dashboard-split-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.card-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
}

.card-sub-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

/* Occupancy Bars */
.occupancy-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.occupancy-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.occupancy-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-navy);
}

.occupancy-pct {
  color: var(--color-text-muted);
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
}

.fill-kanu {
  background-color: var(--color-primary);
}
.fill-soweto {
  background-color: #4f46e5;
}
.fill-mary {
  background-color: #db2777;
}

/* Interventions Card */
.badge-alert {
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid #fecaca;
}

.intervention-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.alert-box {
  background-color: #fef8f0;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.text-warning-icon {
  color: #d97706;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-box h4 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0 0 0.125rem 0;
}

.alert-box p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
}

.btn-review {
  background-color: var(--color-navy);
  color: var(--color-white);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-review:hover {
  background-color: #1e293b;
}

/* Table */

.font-bold {
  font-weight: 700;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

.pill-success {
  background-color: #f0fdf4;
  color: var(--color-success);
  border: 1px solid #bbf7d0;
}

.pill-warning {
  background-color: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-split-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
