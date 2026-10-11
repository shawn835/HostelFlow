<template>
  <div class="table-container-card">
    <!-- Optional Search / Header Toolbar Slot -->
    <div class="table-toolbar" v-if="$slots.toolbar || title">
      <div>
        <h3 v-if="title" class="table-title">{{ title }}</h3>
        <p v-if="subtitle" class="table-subtitle">{{ subtitle }}</p>
      </div>
      <div class="toolbar-actions">
        <slot name="toolbar" />
      </div>
    </div>

    <div class="table-responsive">
      <table class="dynamic-table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="row.id || rowIndex">
            <td v-for="col in columns" :key="col.key">
              <!-- Allow custom rendering via scoped slots per column key, otherwise fallback to standard text -->
              <slot :name="col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] !== undefined ? row[col.key] : "-" }}
              </slot>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="!rows || rows.length === 0">
            <td :colspan="columns.length" class="empty-state-cell">
              <div class="empty-content">
                <Icon name="lucide:folder-open" size="24" class="empty-icon" />
                <span>{{ emptyText }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  columns: {
    type: Array,
    required: true,
    // Expected format: [{ key: 'student', label: 'Student' }, { key: 'hostel', label: 'Hostel' }]
  },
  rows: {
    type: Array,
    required: true,
    // Expected format: [{ student: 'NUR/001', hostel: 'KANU', ... }]
  },
  emptyText: {
    type: String,
    default: "No records found.",
  },
});
</script>

<style scoped>
.table-container-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.table-toolbar {
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.table-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
}

.table-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0.125rem 0 0 0;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.dynamic-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9375rem;
}

.dynamic-table th {
  padding: 0.875rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  background-color: #f8fafc;
  border-bottom: 1px solid var(--color-border);
}

.dynamic-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-navy);
}

.dynamic-table tr:last-child td {
  border-bottom: none;
}

.dynamic-table tr:hover td {
  background-color: #fafafa;
}

.empty-state-cell {
  text-align: center;
  padding: 3rem !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.empty-icon {
  color: #94a3b8;
}
</style>
