<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Add Hostel</h3>
        <button @click="close" class="close-btn">
          <Icon name="lucide:x" size="20" />
        </button>
      </div>

      <form @submit.prevent="handleCreateHostel" class="modal-form">
        <div class="form-group">
          <label class="form-label">Hostel Name</label>
          <input
            type="text"
            v-model="form.name"
            placeholder="e.g. Nyayo Hostel"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Gender Allocation</label>
          <select v-model="form.gender" class="form-select">
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Mixed">Mixed / Floor-based</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Hostel price (Per Semester/Month)</label>
          <input
            type="number"
            v-model="form.price"
            placeholder="e.g. 5000"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Hostel Image</label>
          <div class="upload-box">
            <Icon name="lucide:image-plus" size="24" class="upload-icon" />
            <span>{{
              form.imageFileName ? form.imageFileName : "Upload building photo"
            }}</span>
            <input
              type="file"
              @change="handleFileUpload"
              class="file-input"
              accept="image/*"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="close" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-create" :disabled="loading">
            {{ loading ? "Creating..." : "Create Hostel" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {
  allowedMimeTypes,
  MAX_HOSTEL_IMAGE_SIZE,
} from "~/shared/validation/hostel.js";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "created"]);
const { $toast } = useNuxtApp();

const { createHostel, loading } = useHostels();

const form = reactive({
  name: "",
  gender: "Boys",
  price: "",
  image: null,
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    //validate file type and size if needed
    if (!allowedMimeTypes.includes(file.type)) {
      $toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > MAX_HOSTEL_IMAGE_SIZE) {
      // 5MB limit
      $toast.error("Image size should not exceed 5MB.");
      return;
    }

    form.image = file;
  }
};

const close = () => {
  emit("close");
};

const handleCreateHostel = async () => {
  try {
    await createHostel(form);

    $toast.success("Hostel created successfully!");

    emit("created");
    close();
  } catch (error) {
    $toast.error(
      error?.statusMessage || error?.message || "Failed to create hostel.",
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
  max-width: 500px;
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
  gap: 1.125rem;
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

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  color: var(--color-navy);
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.upload-box {
  position: relative;
  border: 2px dashed var(--color-border);
  border-radius: 0.5rem;
  padding: 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  background-color: var(--color-bg-light);
}

.upload-icon {
  color: var(--color-primary);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
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
