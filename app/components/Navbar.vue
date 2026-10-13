<template>
  <header class="navbar">
    <div class="nav-container">
      <!-- Logo / Brand -->
      <NuxtLink to="/" class="nav-brand">
        <Icon name="lucide:home" class="brand-icon" />
        <span>HostelFlow</span>
      </NuxtLink>

      <!-- Desktop Navigation Links -->
      <nav class="nav-links" :class="{ 'nav-open': isMenuOpen }">
        <NuxtLink to="/hostels" class="nav-link" @click="closeMenu">
          Hostels
        </NuxtLink>
        <NuxtLink v-if="user" to="/bookings" class="nav-link" @click="closeMenu"
          >My Booking</NuxtLink
        >

        <!-- Mobile-only Auth Section -->
        <div class="mobile-auth-section">
          <template v-if="user">
            <NuxtLink
              to="/profile"
              class="nav-link mobile-profile-link"
              @click="closeMenu"
            >
              <Icon name="lucide:user" />
              <span>{{ user.firstName }}</span>
            </NuxtLink>
          </template>
          <!-- admin -->
          <template v-if="user">
            <NuxtLink
              to="/admin/dashboard"
              class="nav-link mobile-profile-link"
              @click="closeMenu"
            >
              <Icon name="lucide:shield-alert" />
              <span>Admin</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="btn-primary-outline"
              @click="closeMenu"
            >
              Profile / Login
            </NuxtLink>
          </template>
        </div>
      </nav>

      <!-- Desktop Auth / Profile Section -->
      <div class="desktop-auth-section">
        <template v-if="user">
          <NuxtLink to="/profile" class="profile-pill">
            <Icon name="lucide:user" class="profile-icon" />
            <span class="profile-name">{{ user.firstName }}</span>
            <Icon name="lucide:chevron-down" class="chevron-icon" />
          </NuxtLink>
        </template>

        <!-- admin -->
        <template v-if="user && user.role === 'admin'">
          <NuxtLink to="/admin/dashboard" class="profile-pill">
            <Icon name="lucide:shield-alert" class="profile-icon" />
            <span class="profile-name">Admin</span>
            <Icon name="lucide:chevron-down" class="chevron-icon" />
          </NuxtLink>
        </template>
      </div>

      <!-- Hamburger Menu Toggle Button (Mobile) -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle Menu">
        <Icon :name="isMenuOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
const user = useState("user", () => null);

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.02);
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand / Logo */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-navy);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.brand-icon {
  color: var(--color-primary);
  width: 24px;
  height: 24px;
}

/* Desktop Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

/* Mobile-only sections hidden on desktop */
.mobile-auth-section {
  display: none;
}

/* Desktop Auth / Profile & Admin Section */
.desktop-auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  color: var(--color-navy);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.profile-pill:hover {
  border-color: var(--color-primary);
  background-color: var(--color-white);
}

.profile-icon {
  color: var(--color-primary);
}

.chevron-icon {
  color: var(--color-text-muted);
  width: 14px;
  height: 14px;
}

/* Primary Outline Button for Login */
.btn-primary-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary-outline:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Mobile Menu Toggle Button */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-navy);
  cursor: pointer;
  padding: 0.5rem;
}

/* Responsive Styles for Mobile */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .desktop-auth-section {
    display: none;
  }

  .nav-links {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    gap: 1.25rem;
    box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.05);
    display: none; /* Hidden by default */
  }

  .nav-links.nav-open {
    display: flex;
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .mobile-auth-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .mobile-profile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: none !important;
  }
}
</style>
