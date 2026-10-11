<template>
  <aside class="admin-sidebar">
    <!-- Brand / Header -->
    <div class="sidebar-brand">
      <div class="brand-icon-box">
        <Icon name="lucide:shield-alert" size="20" />
      </div>
      <div class="brand-text">
        <span class="brand-title">HostelFlow</span>
        <span class="brand-subtitle">Admin Portal</span>
      </div>
    </div>

    <!-- Navigation Menu Links -->
    <div class="sidebar-nav-container">
      <!-- Primary Management Section -->
      <div class="nav-section">
        <NuxtLink to="/admin/dashboard" class="nav-item" active-class="active">
          <Icon name="lucide:layout-dashboard" size="18" />
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/admin/hostels" class="nav-item" active-class="active">
          <Icon name="lucide:building-2" size="18" />
          <span>Hostels</span>
        </NuxtLink>

        <NuxtLink to="/admin/rooms" class="nav-item" active-class="active">
          <Icon name="lucide:bed-double" size="18" />
          <span>Rooms & Beds</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/allocations"
          class="nav-item"
          active-class="active"
        >
          <Icon name="lucide:clipboard-check" size="18" />
          <span>Allocations</span>
        </NuxtLink>

        <NuxtLink to="/admin/students" class="nav-item" active-class="active">
          <Icon name="lucide:users" size="18" />
          <span>Students</span>
        </NuxtLink>
      </div>

      <!-- Operations Section -->
      <div class="nav-section">
        <span class="section-category-label">Operations</span>

        <NuxtLink
          to="/admin/interventions"
          class="nav-item"
          active-class="active"
        >
          <Icon name="lucide:life-buoy" size="18" />
          <span>Interventions</span>
        </NuxtLink>

        <NuxtLink to="/admin/reports" class="nav-item" active-class="active">
          <Icon name="lucide:bar-chart-3" size="18" />
          <span>Reports</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Visual Divider -->
    <div class="sidebar-divider"></div>

    <!-- Bottom System & User Section -->
    <div class="sidebar-footer">
      <NuxtLink to="/admin/profile" class="nav-item" active-class="active">
        <Icon name="lucide:user-cog" size="18" />
        <span>Admin Profile</span>
      </NuxtLink>

      <NuxtLink to="/admin/settings" class="nav-item" active-class="active">
        <Icon name="lucide:settings" size="18" />
        <span>Settings</span>
      </NuxtLink>

      <button @click="handleLogout" class="nav-item logout-btn">
        <Icon name="lucide:log-out" size="18" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  if (confirm("Are you sure you want to sign out of the Admin portal?")) {
    router.push("/login");
  }
};
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  background-color: var(--color-navy);
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid #1e293b;
  flex-shrink: 0;
}

/* Brand Header */
.sidebar-brand {
  padding: 1.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-icon-box {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--color-white);
  letter-spacing: -0.01em;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

/* Navigation Container */
.sidebar-nav-container {
  flex: 1;
  padding: 1.25rem 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-category-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  padding: 0 0.75rem 0.5rem 0.75rem;
}

/* Nav Items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--color-white);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Divider */
.sidebar-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.08);
  margin: 0 1.25rem;
}

/* Footer Section */
.sidebar-footer {
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #f87171;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Responsive Hide on small screens if layout requires drawer behavior */
@media (max-width: 768px) {
  .admin-sidebar {
    display: none; /* Can be adapted into a drawer/hamburger menu later */
  }
}
</style>
