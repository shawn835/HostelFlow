<template>
  <div class="setup-page">
    <div class="container">
      <NuxtLink to="/login" class="back-link">
        <Icon name="lucide:arrow-left" size="16" />
        <span>Back to Login</span>
      </NuxtLink>

      <div class="setup-wrapper">
        <div class="progress-indicator">
          <span class="step-badge">Step 2 of 2</span>
          <h1 class="page-title">Secure Your Account</h1>
          <p class="page-subtitle">
            Your admission has been verified. Now set a secure password to
            complete your HostelFlow account setup.
          </p>
        </div>

        <!-- Feedback message display if API fails -->
        <div v-if="feedbackMessage" class="feedback-box" :class="feedbackType">
          <Icon
            :name="
              feedbackType === 'success'
                ? 'lucide:check-circle-2'
                : 'lucide:alert-circle'
            "
            size="18"
          />
          <span>{{ feedbackMessage }}</span>
        </div>

        <!-- 2 inputs: confirm prop set to true -->
        <PasswordForm
          :confirm="true"
          @submit-password="handlePasswordSetup"
          :isSubmitting="isSubmitting"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getSafeRedirect } from "../utils/authRedirect.js";

const route = useRoute();
const { $toast } = useNuxtApp();
const user = useState("user", () => null);
const isSubmitting = ref(false);
const feedbackMessage = ref("");
const feedbackType = ref("error");

const handlePasswordSetup = async ({ password, confirmPassword }) => {
  isSubmitting.value = true;
  feedbackMessage.value = "";

  try {
    // Calls your future Nuxt server API route
    const response = await $fetch("/api/auth/set-password", {
      method: "POST",
      body: {
        password: password,
        confirmPassword: confirmPassword,
      },
    });

    user.value = response.user;
    await navigateTo(getSafeRedirect(route.query.redirect) || "/bookings");
    $toast.success("password created successfully");
  } catch (error) {
    feedbackType.value = "error";
    feedbackMessage.value =
      error?.data?.statusMessage ||
      "Unable to set your password. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.setup-page {
  background: linear-gradient(135deg, var(--color-bg-light) 0%, #eff6ff 100%);
  padding: 4rem 0 6rem 0;
  min-height: 85vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.setup-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.progress-indicator {
  text-align: center;
  width: 100%;
}

.step-badge {
  display: inline-block;
  background-color: var(--color-white);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
  border: 1px solid var(--color-border);
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 auto;
  max-width: 440px;
}

/* Ensure the PasswordForm component takes full width of the wrapper */
.setup-wrapper :deep(.password-form-card) {
  width: 100%;
  max-width: 100%;
}

/* Feedback message box */
.feedback-box {
  margin-top: 1.25rem;
  padding: 0.875rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  animation: fadeIn 0.2s ease-out forwards;
}

.feedback-box.success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: var(--color-success);
}

.feedback-box.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
