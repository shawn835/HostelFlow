<template>
  <div class="filters-section">
    <div class="container">
      <div class="filters-card">
        <!-- Search Input Bar -->
        <div class="search-bar-wrapper">
          <Icon name="lucide:search" class="search-icon" size="20" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search hostel name or location..."
            class="search-input"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="clear-search-btn"
          >
            <Icon name="lucide:x" size="16" />
          </button>
        </div>

        <!-- Filter Dropdowns Grid -->
        <div class="dropdowns-grid">
          <!-- Gender Filter -->
          <div class="filter-group">
            <label class="filter-label">Gender</label>
            <div class="select-wrapper">
              <select v-model="selectedGender" class="filter-select">
                <option value="all">All Genders</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="coed">Boys & Girls</option>
              </select>
              <Icon
                name="lucide:chevron-down"
                class="select-chevron"
                size="16"
              />
            </div>
          </div>

          <!-- Availability Filter -->
          <div class="filter-group">
            <label class="filter-label">Availability</label>
            <div class="select-wrapper">
              <select v-model="selectedAvailability" class="filter-select">
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="occupied">Fully occupied</option>
              </select>
              <Icon
                name="lucide:chevron-down"
                class="select-chevron"
                size="16"
              />
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-group">
            <label class="filter-label">Price</label>
            <div class="select-wrapper">
              <select v-model="selectedPrice" class="filter-select">
                <option value="any">Any Price</option>
                <option value="low">Under KSh 5,000</option>
                <option value="mid">KSh 5,000 - 7,000</option>
                <option value="high">Above KSh 7,000</option>
              </select>
              <Icon
                name="lucide:chevron-down"
                class="select-chevron"
                size="16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const selectedGender = ref("all");
const selectedAvailability = ref("all");
const selectedPrice = ref("any");
</script>

<style scoped>
.filters-section {
  background-color: var(--color-white);
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.filters-card {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Search Bar */
.search-bar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: 1rem;
  color: var(--color-navy);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  color: var(--color-navy);
}

/* Dropdowns Grid */
.dropdowns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-navy);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-select {
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.9375rem;
  color: var(--color-navy);
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.select-chevron {
  position: absolute;
  right: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dropdowns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
