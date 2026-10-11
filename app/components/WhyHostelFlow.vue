<template>
  <section class="why-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-badge">PLATFORM ADVANTAGE</span>
        <h2 class="section-title">Why Use HostelFlow?</h2>
        <p class="section-description">
          Built specifically to eliminate accommodation stress and
          administrative friction for students.
        </p>
      </div>

      <!-- 3-Column Benefits Grid -->
      <div class="benefits-grid">
        <!-- Benefit 01 -->
        <div class="benefit-card">
          <div class="icon-wrapper">
            <Icon name="lucide:clock" size="24" />
          </div>
          <h3 class="benefit-title">No Long Queues</h3>
          <p class="benefit-text">
            Choose and secure your student accommodation entirely online from
            your phone or laptop.
          </p>
        </div>

        <!-- Benefit 02 -->
        <div class="benefit-card">
          <div class="icon-wrapper">
            <Icon name="lucide:eye" size="24" />
          </div>
          <h3 class="benefit-title">Know What's Available</h3>
          <p class="benefit-text">
            See real-time available rooms and specific bed inventories before
            making your selection.
          </p>
        </div>

        <!-- Benefit 03 -->
        <div class="benefit-card">
          <div class="icon-wrapper">
            <Icon name="lucide:shield-check" size="24" />
          </div>
          <h3 class="benefit-title">Zero Overbooking Clashes</h3>
          <p class="benefit-text">
            A single bed cannot be successfully reserved by two students
            simultaneously thanks to atomic locking.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-section {
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
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.benefit-card {
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -4px rgba(15, 23, 42, 0.05);
  border-color: #cbd5e1;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.benefit-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.75rem;
}

.benefit-text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 968px) {
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
