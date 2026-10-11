<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Add Room</h3>
        <button @click="close" class="close-btn">
          <Icon name="lucide:x" size="20" />
        </button>
      </div>

      <form @submit.prevent="handleAddRoom" class="modal-form">
        <div class="form-group">
          <label class="form-label">Room Number / Name</label>
          <input
            type="text"
            v-model="roomNumber"
            placeholder="e.g. 105"
            required
            class="form-input"
          />
          <span class="form-hint"
            >Hostel ID: <strong>{{ hostelId }}</strong> (Auto-assigned)</span
          >
        </div>

        <div class="modal-actions">
          <button type="button" @click="close" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-create" :disabled="loading">
            {{ loading ? "Creating..." : "Create Room" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  hostelId: {
    type: String,
    required: true,
  },
});

const { $toast } = useNuxtApp();

const emit = defineEmits(["close", "created"]);

const { createRoom, loading } = useHostels();

const roomNumber = ref("");

const close = () => {
  roomNumber.value = "";
  emit("close");
};

const handleAddRoom = async () => {
  if (!roomNumber.value.trim()) return;
  try {
    await createRoom(props.hostelId, roomNumber.value.trim());
    $toast.success("room created successfully!");
    emit("created");
    close();
  } catch (error) {
    $toast.error(
      error?.statusMessage || error?.message || "Failed to create room.",
    );
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-container {
  background-color: var(--color-white);
  border-radius: 1rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  animation: scaleUp 0.2s ease-out forwards;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-navy);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  color: var(--color-navy);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn-cancel {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-create {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-create:hover {
  opacity: 0.9;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
