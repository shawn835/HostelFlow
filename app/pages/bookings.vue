<template>
  <LoadingSpinner
    fullScreen
    text="Loading your booking details..."
    v-if="pending"
  />

  <div class="bookings-page" v-else-if="booking">
    <div class="container">
      <!-- Main Booking Summary Card -->
      <div class="booking-card">
        <!-- 1. Confirmation Header & Reference Banner -->
        <div class="card-section confirmed-banner">
          <div class="success-icon-title">
            <div class="icon-circle">
              <Icon name="lucide:check" size="22" />
            </div>
            <div>
              <h2 class="section-title">Booking Confirmed</h2>
              <p class="section-subtitle">
                Your hostel booking has been confirmed.
              </p>
            </div>
          </div>

          <div class="ref-box">
            <div class="ref-info">
              <span class="ref-label">Booking Reference</span>
              <span class="ref-code">#{{ booking.reference }}</span>
            </div>
            <button @click="copyReference" class="btn-copy">
              <Icon name="lucide:copy" size="14" />
              {{ copied ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>

        <!-- 2. Your Allocation Section -->
        <div class="card-section">
          <span class="section-tag">Your Allocation</span>

          <div class="allocation-box">
            <h3 class="hostel-heading">{{ booking.hostelName }}</h3>

            <div class="allocation-grid">
              <div class="alloc-item">
                <span class="alloc-label">Room</span>
                <span class="alloc-val">{{ booking.roomNumber }}</span>
              </div>
              <div class="alloc-item">
                <span class="alloc-label">Bed</span>
                <div class="bed-detail-row">
                  <span class="alloc-val">{{ booking.bedNumber }}</span>
                  <span class="bed-tier">{{ booking.tier }} bunk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Payment Section -->
        <div class="card-section">
          <span class="section-tag">Payment</span>

          <div class="info-list">
            <div class="info-row">
              <span class="info-key">Required</span>
              <span class="info-val"
                >KSh {{ booking.price.toLocaleString() }}</span
              >
            </div>
            <div class="info-row">
              <span class="info-key">Paid</span>
              <span class="info-val"
                >KSh {{ booking.price.toLocaleString() }}</span
              >
            </div>
            <div class="info-row highlight-row">
              <span class="info-key">Status</span>
              <span class="info-val text-success">
                <Icon name="lucide:check-circle-2" size="16" />
                Fully Paid
              </span>
            </div>
          </div>
        </div>

        <!-- 4. Booking Details Section -->
        <div class="card-section">
          <span class="section-tag">Booking Details</span>

          <div class="info-list">
            <div class="info-row">
              <span class="info-key">Booked on</span>
              <span class="info-val">{{ formatDate(booking.createdAt) }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Status</span>
              <span class="info-val text-success font-bold">{{
                booking.status
              }}</span>
            </div>
          </div>
        </div>

        <!-- 5. Actions & Footer Section -->
        <div class="card-section actions-footer">
          <button @click="downloadConfirmation" class="btn-primary">
            <Icon name="lucide:download" size="16" />
            Download Confirmation
          </button>

          <button
            @click="handleCancelBooking(booking.id)"
            class="btn-danger-outline"
          >
            Cancel Booking
          </button>

          <p class="help-text">
            Need help?
            <a href="#" @click.prevent="contactAdmin"
              >Contact Hostel Administration</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="empty-state" v-else>
    <div class="container">
      <div class="empty-state-card">
        <div class="empty-icon-wrap">
          <Icon name="lucide:bed-double" size="32" />
        </div>

        <div class="empty-copy">
          <span class="empty-eyebrow">Your next chapter starts here</span>
          <h2 class="empty-title">No booking yet</h2>
          <p class="empty-description">
            You don’t have an active hostel booking. Find a place that feels
            like home and reserve your bed in just a few steps.
          </p>
        </div>

        <div class="empty-actions">
          <NuxtLink to="/hostels" class="btn-primary">
            Explore hostels
            <Icon name="lucide:arrow-right" size="16" />
          </NuxtLink>
          <span class="empty-note">
            <Icon name="lucide:shield-check" size="15" />
            Browse available hostels and rooms
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

definePageMeta({
  middleware: "auth",
});

const copied = ref(false);
const { $toast } = useNuxtApp();

const { useGetBooking, cancelBooking, loading } = useBooking();
const { data: response, pending, error, refresh } = await useGetBooking();

const booking = computed(() => response.value?.booking ?? null);

onMounted(async () => {
  if (!booking.value) {
    await refresh();
  }
});

const copyReference = async () => {
  if (!booking.value?.id) return;

  await navigator.clipboard.writeText(String(booking.value.reference));

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const downloadConfirmation = () => {
  $toast.info("coming soon...");
};

const handleCancelBooking = async (bookingId) => {
  try {
    await cancelBooking(bookingId);
    $toast("Your booking has been canceled successfully.");
    await refresh();
  } catch (error) {
    $toast("Failed to cancel the booking. Please try again later.");
  }
};

const contactAdmin = () => {};
</script>

<style scoped>
.bookings-page {
  background-color: var(--color-bg-light);
  padding: 3rem 0 6rem 0;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.booking-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
}

.card-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.card-section:last-child {
  border-bottom: none;
}

/* Confirmed Banner */
.confirmed-banner {
  background-color: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.success-icon-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-circle {
  width: 40px;
  height: 40px;
  background-color: var(--color-success);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 0.125rem 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #166534;
  margin: 0;
}

.ref-box {
  background-color: var(--color-white);
  border: 1px solid #bbf7d0;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ref-info {
  display: flex;
  flex-direction: column;
}

.ref-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.ref-code {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--color-navy);
  font-family: monospace;
}

.btn-copy {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-navy);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background-color: #f8fafc;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Section Tags */
.section-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: 0.75rem;
}

/* Allocation Box */
.allocation-box {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.hostel-heading {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 1rem 0;
  letter-spacing: 0.02em;
}

.allocation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.alloc-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.alloc-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.alloc-val {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-navy);
}

.bed-detail-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.bed-tier {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Info Lists (Payment & Booking Details) */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9375rem;
}

.highlight-row {
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-border);
}

.info-key {
  color: var(--color-text-muted);
}

.info-val {
  font-weight: 700;
  color: var(--color-navy);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.text-success {
  color: var(--color-success);
}
.font-bold {
  font-weight: 800;
}

/* Actions Footer */
.actions-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fafafa;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.75rem;
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-danger-outline {
  background: none;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.625rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-danger-outline:hover {
  background-color: #fef2f2;
}

.help-text {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0.5rem 0 0 0;
}

.help-text a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

.empty-state {
  min-height: 85vh;
  padding: 4rem 0;
  display: flex;
  align-items: center;
  background:
    radial-gradient(
      ellipse at 50% 0%,
      rgba(37, 99, 235, 0.08),
      transparent 58%
    ),
    var(--color-bg-light);
}

.empty-state-card {
  max-width: 560px;
  margin: 0 auto;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.empty-icon-wrap {
  width: 76px;
  height: 76px;
  margin-bottom: 1.5rem;
  display: grid;
  place-items: center;
  color: var(--color-primary);
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 1.25rem;
}

.empty-copy {
  max-width: 420px;
}

.empty-eyebrow {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.empty-title {
  margin: 0.5rem 0 0.75rem;
  color: var(--color-navy);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.empty-description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.975rem;
  line-height: 1.7;
}

.empty-actions {
  width: 100%;
  max-width: 320px;
  margin-top: 1.75rem;
}

.empty-actions .btn-primary {
  min-height: 48px;
  text-decoration: none;
}

.empty-note {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.empty-note :deep(svg) {
  color: var(--color-success);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .confirmed-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ref-box {
    width: 100%;
    justify-content: space-between;
  }

  .empty-state {
    min-height: 75vh;
    padding: 2rem 0;
  }

  .empty-state-card {
    padding: 2.5rem 1.5rem;
  }
}
</style>
