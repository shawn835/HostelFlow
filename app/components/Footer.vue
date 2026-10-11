<template>
  <footer class="site-footer">
    <div class="footer-container">
      <!-- Top Grid Section -->
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <Icon name="lucide:home" class="brand-icon" />
            <span>HostelFlow</span>
          </NuxtLink>
          <p class="brand-tagline">
            Find your hostel. Choose your bed. Stay organized.
          </p>
        </div>

        <!-- Quick Links Column -->
        <div class="footer-links-col">
          <h4 class="col-title">Quick Links</h4>
          <ul class="links-list">
            <li>
              <NuxtLink to="/hostels" class="footer-link">Hostels</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/bookings" class="footer-link">My Booking</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile" class="footer-link">Profile</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Column -->
        <!-- <div class="footer-links-col">
          <h4 class="col-title">Support</h4>
          <ul class="links-list">
            <li>
              <NuxtLink to="/help" class="footer-link">Help Center</NuxtLink>
            </li>
            <li><NuxtLink to="/faqs" class="footer-link">FAQs</NuxtLink></li>
            <li>
              <NuxtLink to="/contact" class="footer-link">Contact Us</NuxtLink>
            </li>
          </ul>
        </div> -->
      </div>

      <!-- Divider Rule -->
      <div class="footer-divider"></div>

      <!-- Bottom Bar Section -->
      <div class="footer-bottom">
        <p class="copyright">© 2026 HostelFlow</p>
        <div class="legal-links">
          <NuxtLink to="/privacy" class="legal-link">Privacy</NuxtLink>
          <span class="dot">·</span>
          <NuxtLink to="/terms" class="legal-link">Terms</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: var(--color-white);
  border-top: 1px solid var(--color-border);
  padding: 4rem 0 2rem 0;
  color: var(--color-navy);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Grid Layout */
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  text-decoration: none;
  margin-bottom: 1rem;
}

.brand-icon {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.brand-tagline {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 280px;
}

/* Columns */
.col-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 1.25rem;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary);
}

/* Divider */
.footer-divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border);
  margin-bottom: 2rem;
}

/* Bottom Bar */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.copyright {
  margin: 0;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legal-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--color-primary);
}

.dot {
  color: var(--color-border);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
