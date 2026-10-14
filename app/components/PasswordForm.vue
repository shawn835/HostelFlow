<template>
  <div class="password-form-card">
    <div class="form-header">
      <div class="icon-box">
        <Icon name="lucide:lock" size="22" />
      </div>
      <div>
        <h3 class="card-title">
          {{ confirm ? "Set Password" : "Enter Password" }}
        </h3>
        <p class="card-subtitle">
          {{
            confirm
              ? "Create a secure password to protect your student account."
              : "Please enter your password to sign in."
          }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="password-form">
      <!-- Password Input -->
      <div class="input-group">
        <label for="password" class="input-label">{{
          confirm ? "new Password" : "password"
        }}</label>
        <div class="input-wrapper">
          <Icon name="lucide:key" class="input-prefix-icon" size="18" />
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            :placeholder="
              confirm ? 'At least 6 characters' : 'Enter your password'
            "
            required
            class="password-input"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="toggle-visibility-btn"
          >
            <Icon
              :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
              size="18"
            />
          </button>
        </div>
      </div>

      <!-- Confirm Password Input (Only rendered if confirm prop is true) -->
      <div class="input-group" v-if="confirm">
        <label for="confirmPassword" class="input-label"
          >Confirm Password</label
        >
        <div class="input-wrapper">
          <Icon
            name="lucide:shield-check"
            class="input-prefix-icon"
            size="18"
          />
          <input
            id="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Re-enter password"
            required
            class="password-input"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="toggle-visibility-btn"
          >
            <Icon
              :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'"
              size="18"
            />
          </button>
        </div>
      </div>

      <!-- Password Requirements Checklist (Only shown during setup) -->
      <div class="requirements-box" v-if="confirm">
        <span class="requirements-title">Password must include all of these:</span>
        <ul class="requirements-list">
          <li :class="{ met: hasMinLength }">
            <Icon
              :name="hasMinLength ? 'lucide:check-circle-2' : 'lucide:circle'"
              size="14"
            />
            <span>At least 6 characters</span>
          </li>
          <li :class="{ met: hasUppercase }">
            <Icon
              :name="hasUppercase ? 'lucide:check-circle-2' : 'lucide:circle'"
              size="14"
            />
            <span>At least one uppercase letter (A-Z)</span>
          </li>
          <li :class="{ met: hasLowercase }">
            <Icon
              :name="hasLowercase ? 'lucide:check-circle-2' : 'lucide:circle'"
              size="14"
            />
            <span>At least one lowercase letter (a-z)</span>
          </li>
          <li :class="{ met: hasNumber }">
            <Icon
              :name="hasNumber ? 'lucide:check-circle-2' : 'lucide:circle'"
              size="14"
            />
            <span>At least one number (0-9)</span>
          </li>
          <li :class="{ met: hasSpecialCharacter }">
            <Icon
              :name="
                hasSpecialCharacter
                  ? 'lucide:check-circle-2'
                  : 'lucide:circle'
              "
              size="14"
            />
            <span>At least one special character (e.g. !, @, #)</span>
          </li>
          <li :class="{ met: passwordsMatch && password.length > 0 }">
            <Icon
              :name="
                passwordsMatch && password.length > 0
                  ? 'lucide:check-circle-2'
                  : 'lucide:circle'
              "
              size="14"
            />
            <span>Passwords match</span>
          </li>
        </ul>
      </div>

      <button
        type="submit"
        class="btn-submit"
        :disabled="!isFormValid || isSubmitting"
      >
        {{ confirm ? "Update Password" : "Sign In" }}
        <Icon name="lucide:arrow-right" size="16" />
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  confirm: {
    type: Boolean,
    default: false,
  },

  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit-password"]);

const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation rules
const hasMinLength = computed(() => password.value.length >= 6);

const hasUppercase = computed(() => /[A-Z]/.test(password.value));

const hasLowercase = computed(() => /[a-z]/.test(password.value));

const hasNumber = computed(() => /\d/.test(password.value));

const hasSpecialCharacter = computed(() => /[^A-Za-z0-9]/.test(password.value));

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value;
});

const isFormValid = computed(() => {
  if (props.confirm) {
    return (
      hasMinLength.value &&
      hasUppercase.value &&
      hasLowercase.value &&
      hasNumber.value &&
      hasSpecialCharacter.value &&
      passwordsMatch.value
    );
  }

  return password.value.length > 0;
});

const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit("submit-password", {
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>

<style scoped>
.password-form-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  max-width: 480px;
  width: 100%;
}

.form-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.icon-box {
  width: 44px;
  height: 44px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-navy);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
}

.password-input {
  width: 100%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
  padding: 0.75rem 2.75rem 0.75rem 2.75rem;
  font-size: 0.9375rem;
  color: var(--color-navy);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.password-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.password-input::placeholder {
  color: var(--color-text-muted);
}

.toggle-visibility-btn {
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

.toggle-visibility-btn:hover {
  color: var(--color-navy);
}

.requirements-box {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
  padding: 1rem;
}

.requirements-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-navy);
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.requirements-list li.met {
  color: var(--color-success);
  font-weight: 600;
}

.btn-submit {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 0.625rem;
  padding: 0.8125rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition:
    opacity 0.2s ease,
    transform 0.1s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  background-color: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
