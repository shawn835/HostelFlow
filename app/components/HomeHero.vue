<template>
  <section class="hero-section">
    <div class="hero-bg-glow"></div>

    <div class="container hero-container">
      <!-- Left Column: Compelling Value Proposition -->
      <div class="hero-content">
        <div class="hero-badge">
          <Icon name="lucide:sparkles" size="14" />
          <span>Official Campus Accommodation Portal</span>
        </div>

        <h1 class="hero-title">
          Secure Your Ideal Campus
          <span class="text-gradient">Hostel Bed</span> in Seconds.
        </h1>

        <p class="hero-description">
          HostelFlow simplifies student housing with real-time room visualizers,
          automated admission verification, and instant bed reservations.
        </p>

        <div class="hero-cta-group">
          <!-- Action buttons change dynamically based on auth status -->
          <NuxtLink
            :to="isLoggedIn ? '/bookings' : '#portal-access'"
            class="btn-primary-hero"
          >
            {{ isLoggedIn ? "View My Booking" : "Get Started Now" }}
            <Icon name="lucide:arrow-right" size="18" />
          </NuxtLink>
          <a href="#how-it-works" class="btn-secondary-hero"> How It Works </a>
        </div>

        <!-- Quick Proof Metrics -->
        <div class="hero-metrics-grid">
          <div class="metric-item">
            <span class="metric-num">{{ stats.housedStudents }}+</span>
            <span class="metric-label">Housed Students</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-item">
            <span class="metric-num">{{ stats.totalBeds }}</span>
            <span class="metric-label">Total Beds</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-item">
            <span class="metric-num">100%</span>
            <span class="metric-label">Verified Process</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Dynamic Card (Logged In vs Logged Out) -->
      <Transition name="hero-card" mode="out-in">
        <div
          v-if="!isLoggedIn && currentStep === 'password'"
          key="password"
          class="password-step"
        >
          <div class="verified-badge-card">
            <span class="verified-text">
              <Icon name="lucide:check-circle-2" size="16" />
              Verified: <strong>{{ verifiedAdmission }}</strong>
            </span>
            <button
              type="button"
              @click="resetAdmission"
              class="change-admission-btn"
            >
              Change
            </button>
          </div>

          <PasswordForm
            :is-submitting="isSubmitting"
            @submit-password="handleLoginSubmit"
          />
        </div>

        <!-- STATE A: Logged Out (Show Admission Verification Prompt) -->
        <div
          v-else-if="!isLoggedIn"
          key="admission"
          id="portal-access"
          class="hero-card-wrapper"
        >
          <div class="portal-access-card">
            <div class="card-top-icon">
              <Icon name="lucide:shield-check" size="28" />
            </div>

            <h3>Student Portal Access</h3>
            <p>
              Verify your admission number to check room availability and manage
              your allocation.
            </p>

            <form
              @submit.prevent="handleAdmissionSubmit"
              class="admission-form"
            >
              <label for="hero-admission-number" class="admission-label">
                Admission Number
              </label>
              <div class="admission-input-group">
                <Icon name="lucide:user" size="16" class="input-icon" />
                <input
                  id="hero-admission-number"
                  v-model="admissionNumber"
                  type="text"
                  placeholder="e.g. NUR/001"
                  autocomplete="off"
                  required
                  class="admission-input"
                />
              </div>
              <button
                type="submit"
                class="btn-portal-submit"
                :disabled="isVerifying"
              >
                <span v-if="isVerifying" class="loading-spinner"></span>
                <template v-else>
                  Verify Admission
                  <Icon name="lucide:chevron-right" size="16" />
                </template>
              </button>
            </form>

            <div v-if="feedbackMessage" class="admission-feedback" role="alert">
              <Icon name="lucide:alert-circle" size="16" />
              <span>{{ feedbackMessage }}</span>
            </div>

            <div class="secure-badge-footer">
              <Icon name="lucide:lock" size="12" />
              <span>Secured via HostelFlow Registry</span>
            </div>
          </div>
        </div>

        <!-- STATE B: Logged In (Show Active Booking & Welcome Status) -->
        <div v-else key="logged-in" class="hero-card-wrapper">
          <div class="portal-access-card logged-in-card">
            <div class="user-welcome-header">
              <div class="avatar-sm">{{ userInitials }}</div>
              <div>
                <span class="welcome-tag">WELCOME BACK</span>
                <h3 class="user-name">{{ user?.firstName || "Student" }}</h3>
              </div>
            </div>

            <div class="active-allocation-box" v-if="booking">
              <div class="alloc-row-top">
                <span class="alloc-title">Active Allocation</span>
                <span class="status-pill-mini">{{ booking?.status }}</span>
              </div>
              <div class="alloc-details">
                <div>
                  <span class="lbl">Hostel</span>
                  <span class="val">{{ booking?.hostelName }}</span>
                </div>
                <div>
                  <span class="lbl">Room / Bed</span>
                  <span class="val"
                    >{{ booking?.roomNumber }} · Bed
                    {{ booking?.bedNumber }}</span
                  >
                </div>
              </div>
            </div>

            <div class="card-actions-grid">
              <NuxtLink to="/bookings" class="btn-portal-submit">
                Manage Booking
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
              <button @click="handleLogout" class="btn-subtle-logout">
                Log out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const currentStep = ref("admission");
const admissionNumber = ref("");
const verifiedAdmission = ref("");
const isVerifying = ref(false);
const isSubmitting = ref(false);
const feedbackMessage = ref("");
const user = useState("user", () => null);
const authChecked = useState("auth-checked", () => false);
const isLoggedIn = computed(() => Boolean(user.value));
const userInitials = computed(() => {
  const firstName = user.value?.firstName || "";
  const lastName = user.value?.lastName || "";

  return `${firstName[0] || ""}${lastName[0] || ""}` || "ST";
});
const { $toast } = useNuxtApp();
const { logOut } = useAuth();

const handleAdmissionSubmit = async () => {
  const normalizedAdmission = admissionNumber.value.trim().toUpperCase();
  if (!normalizedAdmission) {
    feedbackMessage.value = "Admission number is required.";
    return;
  }

  isVerifying.value = true;
  feedbackMessage.value = "";

  try {
    const response = await $fetch("/api/auth/start-login", {
      method: "POST",
      body: { admissionNumber: normalizedAdmission },
    });

    verifiedAdmission.value = normalizedAdmission;

    if (response.next === "password") {
      currentStep.value = "password";
      return;
    }

    if (response.next === "setup-password") {
      await navigateTo("/setup-password");
      return;
    }

    throw new Error("Unexpected admission verification response");
  } catch (error) {
    feedbackMessage.value =
      error?.data?.statusMessage ||
      error?.message ||
      "Something went wrong. Please try again.";
  } finally {
    isVerifying.value = false;
  }
};

const handleLoginSubmit = async ({ password }) => {
  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        admissionNumber: verifiedAdmission.value,
        password,
      },
    });

    $toast.success(response.message);
    authChecked.value = false;
    await navigateTo("/bookings");
  } catch (error) {
    $toast.error(
      error?.data?.statusMessage || "Unable to log in. Please try again.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

const resetAdmission = () => {
  admissionNumber.value = "";
  verifiedAdmission.value = "";
  feedbackMessage.value = "";
  currentStep.value = "admission";
};

const handleLogout = async () => {
  try {
    await logOut();
    resetAdmission();
    $toast.success("Logged out successfully");
  } catch (error) {
    $toast.error(
      error?.data?.statusMessage || "Unable to log out. Please try again.",
    );
  }
};

const { useGetBooking } = useBooking();
const { data: response, pending, error, refresh } = await useGetBooking();

const booking = computed(() => response.value?.booking ?? null);

const { data: heroStats } = await useFetch("/api/hostels/stats");

const stats = computed(() => heroStats.value?.stats);
</script>

<style scoped>
.hero-section {
  position: relative;
  background-color: var(--color-navy);
  color: var(--color-white);
  padding: 6rem 0 7rem 0;
  overflow: hidden;
}

.hero-bg-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.25) 0%,
    rgba(15, 23, 42, 0) 70%
  );
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 4rem;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #93c5fd;
  width: fit-content;
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 900;
  line-height: 1.15;
  color: var(--color-white);
  margin: 0;
  letter-spacing: -0.03em;
}

.text-gradient {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.125rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  max-width: 520px;
}

.hero-cta-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-primary-hero {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5);
}

.btn-primary-hero:hover {
  opacity: 0.95;
  transform: translateY(-2px);
}

.btn-secondary-hero {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.btn-secondary-hero:hover {
  border-color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.05);
}

.hero-metrics-grid {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-item {
  display: flex;
  flex-direction: column;
}

.metric-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-white);
}

.metric-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-divider {
  width: 1px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Right Column Cards */
.hero-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.password-step {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 480px;
}

.hero-card-enter-active,
.hero-card-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.hero-card-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.hero-card-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (prefers-reduced-motion: reduce) {
  .hero-card-enter-active,
  .hero-card-leave-active {
    transition-duration: 0.01ms;
  }
}

.portal-access-card {
  background-color: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 1.25rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-top-icon {
  width: 52px;
  height: 52px;
  background-color: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.portal-access-card h3 {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--color-white);
  margin: 0;
}

.portal-access-card p {
  font-size: 0.9375rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.admission-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.admission-label {
  color: #cbd5e1;
  font-size: 0.8125rem;
  font-weight: 600;
}

.admission-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0 1rem;
}

.admission-input-group:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}

.admission-input {
  width: 100%;
  min-width: 0;
  padding: 0.875rem 0.75rem;
  background: transparent;
  border: 0;
  outline: 0;
  color: var(--color-white);
  font-size: 0.9375rem;
}

.admission-input::placeholder {
  color: #64748b;
}

.input-icon {
  flex-shrink: 0;
  color: #94a3b8;
}

.btn-portal-submit {
  width: 100%;
  border: 0;
  cursor: pointer;
}

.btn-portal-submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(15, 23, 42, 0.25);
  border-top-color: var(--color-navy);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.admission-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fca5a5;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.verified-badge-card {
  background-color: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.verified-text {
  color: #4ade80;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.change-admission-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 0.8125rem;
  cursor: pointer;
  text-decoration: underline;
}

.btn-portal-submit {
  background-color: var(--color-white);
  color: var(--color-navy);
  padding: 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 800;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-portal-submit:hover {
  background-color: #f8fafc;
}

.secure-badge-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
}

/* Logged In State Specific Styles */
.user-welcome-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-sm {
  width: 44px;
  height: 44px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.welcome-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #64748b;
}

.user-name {
  font-size: 1.125rem !important;
  font-weight: 800;
  color: var(--color-white);
  margin: 0;
}

.active-allocation-box {
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.alloc-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alloc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.status-pill-mini {
  background-color: rgba(22, 163, 74, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.alloc-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.alloc-details .lbl {
  font-size: 0.6875rem;
  color: #64748b;
  display: block;
  text-transform: uppercase;
  font-weight: 600;
}

.alloc-details .val {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-white);
}

.card-actions-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-subtle-logout {
  background: none;
  border: none;
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  text-align: center;
}

.btn-subtle-logout:hover {
  color: #ef4444;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-card-wrapper {
    width: 100%;
  }

  .portal-access-card {
    max-width: 100%;
  }
}
</style>
