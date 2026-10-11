<template>
  <div
    class="spinner-wrapper"
    :class="{ 'full-screen': fullScreen, inline: !fullScreen }"
  >
    <div
      class="spinner"
      :style="{ width: sizeMap[size], height: sizeMap[size] }"
    ></div>
    <span v-if="text" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: "md", // 'sm', 'md', 'lg'
    validator: (val) => ["sm", "md", "lg"].includes(val),
  },
  text: {
    type: String,
    default: "",
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});

const sizeMap = {
  sm: "18px",
  md: "32px",
  lg: "48px",
};
</script>

<style scoped>
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner-wrapper.inline {
  display: inline-flex;
  flex-direction: row;
}

.spinner-wrapper.full-screen {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  z-index: 999;
  min-height: 200px;
}

.spinner {
  border: 3px solid rgba(37, 99, 235, 0.15);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<!-- <button class="btn-primary" :disabled="isSubmitting">
  <LoadingSpinner v-if="isSubmitting" size="sm" />
  <span v-else>Save Changes</span>
</button> -->
