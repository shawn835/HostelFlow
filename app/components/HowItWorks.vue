<template>
  <section class="how-it-works-section" id="how-it-works">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-badge">SIMPLE WORKFLOW</span>
        <h2 class="section-title">How HostelFlow Works</h2>
        <p class="section-description">
          From payment to bed allocation — everything handled online in four
          straightforward steps.
        </p>
      </div>

      <!-- 4-Step Grid -->
      <div class="steps-grid">
        <div class="step-card" v-for="step in workflowSteps" :key="step.number">
          <div class="step-header">
            <span class="step-number">{{ step.number }}</span>
            <div class="step-icon-wrapper">
              <Icon :name="step.icon" class="step-icon" />
            </div>
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-text">{{ step.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const workflowSteps = ref([
  {
    number: "01",
    icon: "lucide:log-in",
    title: "login",
    text: "Log in with your student credentials, after you have paid through the institution's payment portal, you can proceed to reserve your bed.",
  },
  {
    number: "02",
    icon: "lucide:layout-grid",
    title: "Choose",
    text: "choose an available hostel and bed. You can filter by gender, price, and availability to find the best option for you.",
  },
  {
    number: "03",
    icon: "lucide:bed-double",
    title: "Reserve",
    text: `Confirm your booking and check its status in bookings tab. You can also cancel or change your reservation if needed.`,
  },
]);
</script>

<style scoped>
.how-it-works-section {
  background-color: var(--color-white);
  padding: 6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem auto;
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
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-navy);
  margin-bottom: 0.75rem;
}

.section-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* Grid Layout */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.step-card {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
  border-color: #cbd5e1;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.step-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #cbd5e1;
  letter-spacing: -0.02em;
}

.step-icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}

.step-text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
