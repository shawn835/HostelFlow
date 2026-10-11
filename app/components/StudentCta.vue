<template>
  <section class="cta-section">
    <div class="container">
      <div class="cta-card">
        <!-- Decorative background glow -->
        <div class="cta-glow"></div>

        <!-- STATE A: Logged-in Student with an Active Booking -->
        <template v-if="isLoggedIn && hasActiveBooking">
          <div class="cta-content">
            <span class="status-badge warning-badge">
              <Icon name="lucide:clock" size="14" /> {{ bookingStatusText }}
            </span>
            <h2 class="cta-title">Your booking is awaiting approval.</h2>
            <p class="cta-description">
              You have successfully reserved a bed at
              <strong>{{ bookingHostelName }}</strong
              >. Our administration team is reviewing your details.
            </p>
            <div class="cta-actions">
              <NuxtLink to="/bookings" class="btn-primary">
                View My Booking
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- STATE B: Visitor / Logged-in Student without an active booking -->
        <template v-else>
          <div class="cta-content">
            <span class="status-badge primary-badge">
              <Icon name="lucide:sparkles" size="14" /> GET STARTED TODAY
            </span>
            <h2 class="cta-title">Ready to find your accommodation?</h2>
            <p class="cta-description">
              Skip the long queues and secure your preferred room and bed online
              in just a few clicks.
            </p>
            <div class="cta-actions">
              <NuxtLink to="/hostels" class="btn-primary">
                Find a Hostel
                <Icon name="lucide:arrow-right" size="16" />
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Prototype state variables (Easily toggle these to test both states)
const isLoggedIn = ref(true);
const hasActiveBooking = ref(true); // Set to false to see the visitor CTA
const bookingHostelName = ref("Sunrise Hostel (Room 102 - Bed B)");
const bookingStatusText = ref("Pending Administration Review");
</script>

<style scoped>
.cta-section {
  background-color: var(--color-white);
  padding: 5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cta-card {
  background: linear-gradient(135deg, var(--color-navy) 0%, #1e293b 100%);
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1);
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  margin-bottom: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.primary-badge {
  background-color: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(37, 99, 235, 0.3);
}

.warning-badge {
  background-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.125rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-description strong {
  color: var(--color-white);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    opacity 0.2s ease,
    transform 0.1s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Background Ambient Glow */
.cta-glow {
  position: absolute;
  width: 350px;
  height: 350px;
  background: rgba(37, 99, 235, 0.18);
  filter: blur(80px);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cta-card {
    padding: 3rem 1.5rem;
  }

  .cta-title {
    font-size: 2rem;
  }
}
</style>
