<template>
  <section class="faq-section" id="faq">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-badge">GOT QUESTIONS?</span>
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-description">
          Everything you need to know about payments, bed selection, and the
          reservation process.
        </p>
      </div>

      <!-- FAQ Accordion List -->
      <div class="faq-list">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button class="faq-question" @click="toggleFaq(index)">
            <span>{{ faq.question }}</span>
            <Icon
              :name="
                openIndex === index
                  ? 'lucide:chevron-up'
                  : 'lucide:chevron-down'
              "
              size="20"
              class="faq-icon"
            />
          </button>

          <div
            class="faq-answer-wrapper"
            :style="
              openIndex === index ? 'max-height: 200px;' : 'max-height: 0px;'
            "
          >
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Help CTA -->
      <div class="faq-footer">
        <p class="footer-prompt">Still have questions?</p>
        <NuxtLink to="/help" class="view-help-btn">
          View all help
          <Icon name="lucide:arrow-right" size="16" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const openIndex = ref(0); // Default first FAQ open

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqs = ref([
  {
    question: "How much does accommodation cost?",
    answer:
      "Hostel prices vary depending on the location, room type, and amenities. Prices typically range from KSh 4,000 to KSh 8,000 per month, clearly displayed on each hostel card.",
  },
  {
    question: "How do I select a bed?",
    answer:
      "Once your payment is verified, you can browse available hostels, select a specific room from the floor plan, and click on an available bed to reserve it instantly.",
  },
  {
    question: "Can two students select the same bed?",
    answer:
      "No. HostelFlow uses real-time locking mechanisms. Once a student selects and submits a reservation for a bed, it is instantly locked to prevent double-booking.",
  },
  {
    question: "How do I know my payment has been verified?",
    answer:
      "You will receive an instant notification on your dashboard, and your account status will update to show unlocked access for room and bed selection.",
  },
  {
    question: "What happens after I reserve a bed?",
    answer:
      "After reserving your preferred bed, your status changes to pending review. The accommodation administration will verify the details and issue your final room allocation.",
  },
  {
    question: "Can I cancel my reservation?",
    answer:
      'Yes, you can cancel your reservation directly from your "My Booking" dashboard before final administration approval, freeing up the bed for other students.',
  },
]);
</script>

<style scoped>
.faq-section {
  background-color: var(--color-bg-light);
  padding: 6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-badge {
  display: inline-block;
  background-color: var(--color-white);
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

/* FAQ List */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.faq-item {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.faq-item.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-navy);
  cursor: pointer;
}

.faq-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.faq-item.is-open .faq-icon {
  color: var(--color-primary);
}

.faq-answer-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 1.5rem;
}

.faq-item.is-open .faq-answer-wrapper {
  padding-bottom: 1.25rem;
}

.faq-answer {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Footer CTA */
.faq-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.footer-prompt {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0;
}

.view-help-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-help-btn:hover {
  border-color: var(--color-primary);
  background-color: #eff6ff;
}
</style>
