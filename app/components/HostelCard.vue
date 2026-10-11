<template>
  <div class="hostel-card">
    <!-- Image Wrapper with Gender / Status Badge -->
    <div class="card-image-wrapper">
      <img :src="hostel.image" :alt="hostel.name" class="card-img" />
      <span class="gender-badge" :class="getGenderClass(hostel.gender)">
        {{ hostel.gender }}
      </span>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <h3 class="card-title">{{ hostel.name }}</h3>

      <!-- Bed Availability -->
      <div class="card-meta-row">
        <span
          class="beds-count"
          :class="{ 'warning-text': hostel.bedsAvailable <= 10 }"
        >
          <Icon name="lucide:bed" size="16" /> {{ hostel.totalBeds }} beds
          available
        </span>
      </div>

      <!-- Price & Action Button -->
      <div class="card-footer-row">
        <div class="price-block">
          <span class="card-price"
            >KSh {{ hostel.price.toLocaleString() }}</span
          >
          <span class="price-period">/ semester</span>
        </div>

        <NuxtLink :to="`/hostels/${hostel.id}`" class="card-action-btn">
          View Hostel
          <Icon name="lucide:arrow-right" size="16" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define the props received from the parent grid
defineProps({
  hostel: {
    type: Object,
    required: true,
  },
});

// Helper to style badges based on gender type
const getGenderClass = (gender) => {
  if (gender === "Boys") return "badge-boys";
  if (gender === "Girls") return "badge-girls";
  return "badge-coed";
};
</script>

<style scoped>
.hostel-card {
  background-color: var(--color-white);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.hostel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -4px rgba(15, 23, 42, 0.06);
  border-color: #cbd5e1;
}

.card-image-wrapper {
  position: relative;
  height: 220px;
  width: 100%;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Gender Badges */
.gender-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  backdrop-filter: blur(4px);
  letter-spacing: 0.02em;
}

.badge-boys {
  background-color: rgba(37, 99, 235, 0.9);
  color: var(--color-white);
}

.badge-girls {
  background-color: rgba(219, 39, 119, 0.9); /* Pinkish tint for girls */
  color: var(--color-white);
}

.badge-coed {
  background-color: rgba(15, 23, 42, 0.85);
  color: var(--color-white);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.75rem;
}

.card-meta-row {
  margin-bottom: 1.25rem;
}

.beds-count {
  font-size: 0.875rem;
  color: var(--color-success);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.beds-count.warning-text {
  color: var(--color-warning);
}

.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  margin-top: auto;
}

.price-block {
  display: flex;
  flex-direction: column;
}

.card-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-navy);
}

.price-period {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.card-action-btn {
  background-color: #eff6ff;
  color: var(--color-primary);
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.card-action-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}
</style>
