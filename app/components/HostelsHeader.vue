<template>
  <div class="hostels-header-section">
    <div class="container">
      <!-- Breadcrumb / Back Link -->
      <NuxtLink to="/" class="back-link">
        <Icon name="lucide:arrow-left" size="16" />
        <span>Back to Home</span>
      </NuxtLink>

      <div class="header-content">
        <div>
          <span class="header-badge">CAMPUS ACCOMMODATION</span>
          <h1 class="header-title">Find your hostel</h1>
          <p class="header-description">
            Browse available hostels and choose the accommodation that works for
            you.
          </p>
        </div>

        <!-- Availability Summary Badge -->
        <!-- <div class="summary-badge-card">
          <div class="summary-icon-wrapper">
            <Icon name="lucide:building-2" size="22" />
          </div>
          <div class="summary-stats">
            <span class="stats-main">3 Hostels · 120 Rooms · 480 Beds</span>
            <span class="stats-sub">
              <span class="live-dot"></span> Live verified inventory
            </span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.hostels-header-section {
  background: linear-gradient(135deg, var(--color-bg-light) 0%, #eff6ff 100%);
  padding: 3rem 0 2.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.header-content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.header-badge {
  display: inline-block;
  background-color: var(--color-white);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.875rem;
  border: 1px solid var(--color-border);
}

.header-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
  line-height: 1.15;
}

.header-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 540px;
  margin: 0;
  line-height: 1.5;
}

/* Summary Stats Card */
.summary-badge-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
}

.summary-icon-wrapper {
  width: 44px;
  height: 44px;
  background-color: #dbeafe;
  color: var(--color-primary);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-stats {
  display: flex;
  flex-direction: column;
}

.stats-main {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 0.125rem;
}

.stats-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-success);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-badge-card {
    width: 100%;
  }

  .header-title {
    font-size: 2rem;
  }
}
</style>
