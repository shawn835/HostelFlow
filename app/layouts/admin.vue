<!-- app/layouts/admin.vue -->
<template>
  <div class="admin-layout-wrapper">
    <AdminSidebar />
    <main class="admin-main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.admin-layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-light);
}

.admin-main-content {
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
}
</style>
