/* ============================================================
   INQUIRY.JS — Budget slider, timeline, progress, form submit
   ============================================================ */

'use strict';

/* ---------- Budget Slider ---------- */
const budgetData = [
  { amount: '$2,000',  label: 'Starter project',     scope: 'Best for a simple landing page or one-pager with clean design and basic contact form.' },
  { amount: '$5,000',  label: 'Essential build',      scope: 'A multi-page website with custom design, responsive layout, and light interactivity.' },
  { amount: '$10,000', label: 'Mid-range project',    scope: 'Typically covers a multi-page website with custom design, responsive build, and basic CMS integration.' },
  { amount: '$20,000', label: 'Professional scope',   scope: 'Full brand + web system — custom design, motion, CMS, and a polished component library.' },
  { amount: '$35,000', label: 'Premium engagement',   scope: 'A comprehensive build with strategy, identity, multi-platform design, and end-to-end development.' },
  { amount: '$50,000', label: 'Enterprise level',     scope: 'Large-scale digital product with design systems, complex functionality, and long-term support.' },
  { amount: '$50,000+', label: 'Custom engagement',   scope: 'Fully bespoke — let\'s talk about scope, team structure, and what success looks like for you.' },
];

const rangeInput   = document.getElementById('budgetRange');
const amountEl     = document.getElementById('budgetAmount');
const labelEl      = document.getElementById('budgetLabel');
const scopeEl      = document.getElementById('budgetScope');
const tierEls      = document.querySelectorAll('.budget-tier');

function updateBudget(val) {
  const v = parseInt(val);
  amountEl.textContent = budgetData[v].amount;
  labelEl.textContent  = budgetData[v].label;
  scopeEl.textContent  = budgetData[v].scope;
  tierEls.forEach((t, i) => t.classList.toggle('active', i === v));
  // Update track fill
  const pct = (v / 6) * 100;
  rangeInput.style.backgroundSize = `${pct}% 100%`;
}

if (rangeInput) {
  rangeInput.addEventListener('input', () => updateBudget(rangeInput.value));
  updateBudget(rangeInput.value);
}

/* ---------- Progress Bar ---------- */
const progressFill = document.getElementById('progressFill');
const psItems      = document.querySelectorAll('.ps-item');
const sections     = document.querySelectorAll('.inq-section');

function updateProgress() {
  const scrollY  = window.scrollY;
  const docH     = document.body.scrollHeight - window.innerHeight;
  const pct      = Math.min((scrollY / docH) * 100, 100);
  if (progressFill) progressFill.style.height = pct + '%';

  // Highlight active sidebar item
  let active = 0;
  sections.forEach((sec, i) => {
    const top = sec.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.5) active = i;
  });
  psItems.forEach((item, i) => item.classList.toggle('active', i === active));
}

window.addEventListener('scroll', updateProgress, { passive: true });

psItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.section);
    const target = sections[idx];
    if (!target) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 24, behavior: 'smooth' });
  });
});

/* ---------- Form Submit ---------- */
const form       = document.getElementById('inquiryForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.querySelector('.submit-text').textContent = 'Sending…';
      submitBtn.disabled = true;
    }
    setTimeout(() => {
      form.querySelectorAll('.inq-field, .inq-email-wrap, .inq-submit').forEach(el => {
        el.style.display = 'none';
      });
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.setAttribute('aria-hidden', 'false');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 600);
  });
}
