<template>
  <LoadingSpinner fullScreen text="Loading student records..." v-if="pending" />

  <section class="available-section">
    <div class="container">
      <!-- Section Header -->
      <div class="header-flex">
        <div>
          <span class="section-badge">LIVE INVENTORY</span>
          <h2 class="section-title">Featured Available Hostels</h2>
          <p class="section-description">
            Explore verified student accommodations near campus and secure your
            space early.
          </p>
        </div>

        <NuxtLink to="/hostels" class="view-all-link">
          View All Hostels
          <Icon name="lucide:arrow-right" size="16" />
        </NuxtLink>
      </div>

      <!-- Hostels Grid -->
      <div class="hostels-grid">
        <HostelCard
          v-for="hostel in hostels"
          :key="hostel.id"
          :hostel="hostel"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const { usePublicHostels } = useHostels();

const { data: response, pending, error, refresh } = await usePublicHostels();

const hostels = computed(() => response.value?.hostels ?? []);
</script>

<style scoped>
.available-section {
  padding: 5rem 0;
  background-color: var(--color-bg-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header Layout */
.header-flex {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.section-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.375rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.section-description {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0;
  max-width: 600px;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  transition:
    gap 0.2s ease,
    color 0.2s ease;
}

.view-all-link:hover {
  gap: 0.625rem;
  color: #1d4ed8;
}

/* Hostels Grid */
.hostels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .hostels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .hostels-grid {
    grid-template-columns: 1fr;
  }
}
</style>
