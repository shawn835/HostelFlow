<template>
  <section class="hostels-workflow-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-badge">QUICK WORKFLOW</span>
        <h2 class="section-title">How it works</h2>
        <p class="section-description">
          Secure your campus accommodation in three straightforward steps.
        </p>
      </div>

      <!-- Compact 3-Step Grid -->
      <div class="compact-steps-grid">
        <!-- Step 01 -->
        <div class="compact-step-card">
          <div class="step-top-row">
            <span class="step-num">01</span>
            <div class="step-icon-box">
              <Icon name="lucide:credit-card" size="18" />
            </div>
          </div>
          <h3 class="step-heading">Pay</h3>
          <p class="step-text">Complete your hostel payment securely.</p>
        </div>

        <!-- Step 02 -->
        <div class="compact-step-card">
          <div class="step-top-row">
            <span class="step-num">02</span>
            <div class="step-icon-box">
              <Icon name="lucide:bed-double" size="18" />
            </div>
          </div>
          <h3 class="step-heading">Choose</h3>
          <p class="step-text">Select your hostel, room and bed.</p>
        </div>

        <!-- Step 03 -->
        <div class="compact-step-card">
          <div class="step-top-row">
            <span class="step-num">03</span>
            <div class="step-icon-box">
              <Icon name="lucide:check-circle-2" size="18" />
            </div>
          </div>
          <h3 class="step-heading">Reserve</h3>
          <p class="step-text">
            Reserve your selected bed and track your booking.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hostels-workflow-section {
  background-color: var(--color-white);
  padding: 5rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  max-width: 550px;
  margin: 0 auto 3rem auto;
}

.section-badge {
  display: inline-block;
  background-color: var(--color-bg-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.875rem;
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 1rem;
  color: var(--color-text-muted);
}

/* Compact 3-Column Grid */
.compact-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.compact-step-card {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1.75rem 1.5rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.compact-step-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -4px rgba(15, 23, 42, 0.04);
  border-color: #cbd5e1;
}

.step-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.step-num {
  font-size: 1.25rem;
  font-weight: 800;
  color: #cbd5e1;
}

.step-icon-box {
  width: 38px;
  height: 38px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.375rem;
}

.step-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .compact-steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
