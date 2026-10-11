<template>
  <LoadingSpinner v-if="loading" text="loading allocations..." fullScreen />
  <div class="admin-allocations-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <span class="page-tag">ADMINISTRATION</span>
        <h1 class="page-title">Allocations</h1>
        <p class="page-subtitle">
          Monitor and filter active student bed reservations and booking states.
        </p>
      </div>

      <button @click="exportAllocations" class="btn-action-outline">
        <Icon name="lucide:download" size="16" />
        Export Records
      </button>
    </div>

    <!-- Filter Panel Card -->
    <div class="filter-panel">
      <div class="search-box">
        <Icon name="lucide:search" size="18" class="search-icon" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by student admission..."
          class="search-input"
        />
      </div>

      <div class="filters-group">
        <select v-model="selectedHostel" class="filter-select">
          <option value="">All hostels</option>

          <option v-for="hostel in hostels" :key="hostel.id" :value="hostel.id">
            {{ hostel.name }}
          </option>
        </select>

        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option value="confirmed">confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button @click="resetFilters" class="btn-reset" title="Clear Filters">
          <Icon name="lucide:rotate-ccw" size="16" />
        </button>
      </div>
    </div>

    <!-- Reusable DataTable Integration -->
    <DataTable
      :columns="allocationColumns"
      :rows="allAllocations"
      emptyText="No allocation records match your filter criteria."
    >
      <!-- Custom Status Slot matching uniform badge design system -->
      <template #status="{ row }">
        <span class="status-badge" :class="row.status.toLowerCase()">
          {{ row.status }}
        </span>
      </template>

      <!-- Custom Allocated At Date Slot -->
      <template #allocatedAt="{ row }">
        <span class="text-muted">{{ formatDate(row.allocatedAt) }}</span>
      </template>

      <!-- Custom Actions Slot -->
      <template #actions="{ row }">
        <button @click="viewDetails(row)" class="btn-table-action">
          Manage
        </button>
      </template>
    </DataTable>

    <!-- Reusable Paginator (Triggers automatically if total items > 15) -->
    <Pagination
      :totalItems="total"
      :itemsPerPage="itemsPerPage"
      :totalPages="totalPages"
      v-model:currentPage="currentPage"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const searchQuery = ref("");
const selectedStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(15);
const hostels = ref([]);
const selectedHostel = ref("");

const allAllocations = ref([]);
const total = ref(0);
const totalPages = ref(0);

const { getAllocations, loading } = useAdmin();

let searchTimer;

const allocationColumns = [
  { key: "admissionNumber", label: "Student" },
  { key: "hostelName", label: "Hostel" },
  { key: "roomNumber", label: "Room" },
  { key: "bedNumber", label: "Bed" },
  { key: "status", label: "Status" },
  { key: "allocatedAt", label: "Allocated At" },
  { key: "actions", label: "Action" },
];

const loadAllocations = async () => {
  try {
    const result = await getAllocations({
      page: currentPage.value,
      perPage: itemsPerPage.value,
      search: searchQuery.value.trim(),
      status: selectedStatus.value,
      hostel: selectedHostel.value,
    });

    allAllocations.value = result.allocations;
    total.value = result.total;
    totalPages.value = result.totalPages;
  } catch (error) {
    console.error("Failed to load allocations:", error);
  }
};

onMounted(loadAllocations);

// Debounce free-text searching.
watch(searchQuery, () => {
  currentPage.value = 1;
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    loadAllocations();
  }, 300);
});

// Exact status filtering and pagination.
watch([selectedHostel, selectedStatus, currentPage, itemsPerPage], () => {
  loadAllocations();
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
});

const resetFilters = () => {
  clearTimeout(searchTimer);
  searchQuery.value = "";
  selectedStatus.value = "";
  selectedHostel.value = "";
  currentPage.value = 1;
  loadAllocations();
};

const getHostelOptions = async () => {
  const result = await $fetch("/api/admin/hostels/options");

  hostels.value = result.hostels;
};

onMounted(getHostelOptions);

const viewDetails = (row) => {
  // Replace with your booking details UI.
  console.log("Selected booking:", row.bookingId);
};

const exportAllocations = () => {
  // CSV export can be implemented separately.
  alert("CSV export is not implemented yet.");
};
</script>

<style scoped>
.admin-allocations-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Filter Panel */
.filter-panel {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  color: var(--color-navy);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
  background-color: var(--color-white);
}

.filters-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-select {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--color-navy);
  outline: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: var(--color-primary);
}

.btn-reset {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 38px;
  height: 38px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  border-color: #dc2626;
  color: #dc2626;
  background-color: #fef2f2;
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

.text-muted {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .filter-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .filters-group {
    flex-wrap: wrap;
  }
}
</style>
