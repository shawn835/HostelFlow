<template>
  <div class="profile-page" v-if="student">
    <div class="container">
      <!-- Page Top Header -->
      <div class="page-header">
        <h1 class="page-title">Profile</h1>
        <p class="page-subtitle">Manage your HostelFlow account</p>
      </div>

      <!-- User Identity Card -->
      <div class="profile-main-card">
        <div class="avatar-box">
          <span class="avatar-initials">{{ initials }}</span>
        </div>
        <div class="profile-identity-info">
          <h2 class="student-name">
            {{ student.firstName }} {{ student.lastName }}
          </h2>
          <span class="admission-code">{{ student.admissionNumber }}</span>
          <div class="badge-row">
            <span class="role-text">Student</span>
            <span class="active-dot-pill">
              <span class="dot"></span>
              {{ student.active ? "Active" : "Inactive" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="section-group">
        <h3 class="group-heading">Personal Information</h3>
        <div class="info-card">
          <div class="info-row-stack">
            <span class="info-label">Full name</span>
            <span class="info-value"
              >{{ student.firstName }} {{ student.lastName }}</span
            >
          </div>
          <div class="divider"></div>
          <div class="info-row-stack">
            <span class="info-label">Admission number</span>
            <span class="info-value font-mono">{{
              student.admissionNumber
            }}</span>
          </div>
          <div class="divider"></div>
          <div class="info-row-stack">
            <span class="info-label">Account type</span>
            <span class="info-value">{{ student.role }}</span>
          </div>
        </div>
      </div>

      <!-- Account Security Section -->
      <!-- <div class="section-group">
        <h3 class="group-heading">Account Security</h3>
        <div class="info-card action-card" @click="changePassword">
          <div class="action-card-content">
            <div class="info-row-stack">
              <span class="info-label">Password</span>
              <span class="info-subtext">Keep your account secure</span>
            </div>
            <span class="action-link"
              >Change <Icon name="lucide:arrow-right" size="14"
            /></span>
          </div>
        </div>
      </div> -->

      <!-- Account Details Section -->
      <div class="section-group">
        <h3 class="group-heading">Account</h3>
        <div class="info-card">
          <div class="info-row-split">
            <span class="info-label">Account status</span>
            <span class="info-value text-success font-bold">Active</span>
          </div>
          <div class="divider"></div>
          <div class="info-row-split">
            <span class="info-label">Member since</span>
            <span class="info-value">{{ formatDate(student.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Logout Action Button -->
      <div class="logout-container">
        <button @click="handleLogout" class="btn-logout" :disabled="loading">
          <Icon name="lucide:log-out" size="16" />
          <LoadingSpinner v-if="loading" size="sm" text="logging out..." />
          <span v-else>log out</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const student = useState("user", () => null);
const { logOut, loading } = useAuth();
const { $toast } = useNuxtApp();

const initials = computed(() => {
  if (!student.value) return "";
  const names = `${student.value.firstName} ${student.value.lastName}`.split(
    " ",
  );
  return names
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

const changePassword = () => {
  router.push("/setup-password");
};

const handleLogout = async () => {
  try {
    const response = await logOut();

    if (response.success) {
      $toast.success("Logged out successfully");
      await router.push("/login");
    }
  } catch (error) {
    $toast.error(error.statusMessage || error.message || "Logout failed");
  }
};
</script>

<style scoped>
.profile-page {
  background-color: var(--color-bg-light);
  padding: 3rem 0 6rem 0;
  min-height: 85vh;
  display: flex;
  justify-content: center;
}

.container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* Main Profile Card */
.profile-main-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.avatar-box {
  width: 64px;
  height: 64px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-identity-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.student-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0;
}

.admission-code {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-family: monospace;
}

.badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.375rem;
}

.role-text {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.active-dot-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-success);
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-success);
  border-radius: 50%;
}

/* Sections */
.section-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.25rem 0.25rem;
}

.info-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-card {
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.action-card:hover {
  border-color: var(--color-primary);
  background-color: #fafafa;
}

.action-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-row-stack {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-row-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.info-subtext {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-navy);
}

.action-link {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  width: 100%;
}

.font-mono {
  font-family: monospace;
}
.text-success {
  color: var(--color-success);
}
.font-bold {
  font-weight: 800;
}

/* Logout Container */
.logout-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.btn-logout {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-logout:hover {
  background-color: #fee2e2;
}
</style>
