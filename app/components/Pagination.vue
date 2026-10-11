<template>
  <div class="pagination-wrapper" v-if="totalItems > 15">
    <div class="pagination-info">
      Showing <strong>{{ startIndex + 1 }}</strong> to
      <strong>{{ Math.min(endIndex, totalItems) }}</strong> of
      <strong>{{ totalItems }}</strong> entries
    </div>

    <div class="pagination-controls">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        <Icon name="lucide:chevron-left" size="16" />
        Previous
      </button>

      <div class="page-numbers">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          class="page-num-btn"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        Next
        <Icon name="lucide:chevron-right" size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 15,
  },
  currentPage: {
    type: Number,
    required: true,
  },

  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:currentPage"]);

const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage);
const endIndex = computed(() => startIndex.value + props.itemsPerPage);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
  }
};
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-top: none;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-num-btn {
  width: 32px;
  height: 32px;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-num-btn.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

@media (max-width: 640px) {
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}
</style>
