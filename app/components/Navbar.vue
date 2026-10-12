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
        <!-- <NuxtLink to="/help" class="nav-link" @click="closeMenu">Help</NuxtLink> -->

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
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  text-decoration: none;
}

.brand-icon {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--color-navy);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.profile-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  color: var(--color-navy);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.profile-pill:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.profile-icon {
  color: var(--color-primary);
}

.chevron-icon {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

.mobile-auth-section {
  display: none;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-navy);
}

@media (max-width: 768px) {
  .desktop-auth-section {
    display: none;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: var(--color-white);
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1.25rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-links.nav-open {
    display: flex;
  }

  .mobile-auth-section {
    display: block;
    width: 100%;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .mobile-profile-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
