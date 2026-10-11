<template>
  <LoadingSpinner fullScreen text="Loading student records..." v-if="pending" />
  <section class="grid-section" v-else>
    <div class="container">
      <!-- Data-driven grid -->
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
.grid-section {
  background-color: var(--color-bg-light);
  padding: 4rem 0;
  min-height: 400px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hostels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .hostels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hostels-grid {
    grid-template-columns: 1fr;
  }
}
</style>
