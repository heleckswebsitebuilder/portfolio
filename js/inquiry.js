/* ============================================================
   INQUIRY.JS — Budget slider, timeline, progress, form submit
   ============================================================ */

'use strict';

/* ---------- Budget Slider ---------- */
const budgetData = [
  {
    amount: '$250',
    label: 'Starter',
    scope: "You're getting silky smooth animations, custom design, and a site that looks like it cost 20x more. This is the best $250 you'll ever spend on your brand.",
    cta: true
  },
  {
    amount: '$500',
    label: 'Essential',
    scope: 'Multi-page site with custom design, scroll animations, mobile-optimised layout, and a contact form. Everything your brand needs to make a real first impression.',
    cta: true
  },
  {
    amount: '$1,000',
    label: 'Professional',
    scope: 'A polished, fully custom website with advanced interactions, refined typography, and a design system built to grow with you. This is where brands start getting taken seriously.',
    cta: true
  },
  {
    amount: '$2,000',
    label: 'Mid-Range',
    scope: 'Full brand + web — custom identity, motion design, CMS integration, and a component library your team can actually use. Built to scale.',
    cta: true
  },
  {
    amount: '$3,000',
    label: 'Premium',
    scope: 'A comprehensive digital presence — strategy, identity, multi-page build, micro-interactions, and end-to-end development. For brands that refuse to blend in.',
    cta: true
  },
  {
    amount: '$5,000',
    label: 'Enterprise',
    scope: 'The full package. Brand strategy, design system, complex functionality, e-commerce or booking, and long-term support. No corners cut, no compromises.',
    cta: true
  },
  {
    amount: '$5,000+',
    label: 'Custom',
    scope: "You've got something big in mind. Let's talk scope, team structure, and what success looks like. Submit the inquiry and I'll reach out to build something made entirely for you.",
    cta: false
  },
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
  const pct = (v / 6) * 100;
  rangeInput.style.backgroundSize = `${pct}% 100%`;

  // Show/hide checkout button
  let checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) {
    checkoutBtn = document.createElement('a');
    checkoutBtn.id = 'checkoutBtn';
    checkoutBtn.className = 'checkout-btn';
    scopeEl.parentNode.insertBefore(checkoutBtn, scopeEl.nextSibling);
  }
  if (budgetData[v].cta) {
    checkoutBtn.textContent = `Get Started — ${budgetData[v].amount} →`;
    checkoutBtn.href = `checkout.html?package=${encodeURIComponent(budgetData[v].label)}&price=${encodeURIComponent(budgetData[v].amount)}`;
    checkoutBtn.style.display = 'inline-flex';
  } else {
    checkoutBtn.style.display = 'none';
  }
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
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.querySelector('.submit-text').textContent = 'Sending…';
      submitBtn.disabled = true;
    }

    // Collect all form data including pill selections
    const data = new FormData(form);

    // Add selected pills (goals, pages, features, branding)
    ['goals', 'pages', 'features', 'branding'].forEach(group => {
      const selected = Array.from(document.querySelectorAll(`[data-group="${group}"].selected`))
        .map(el => el.textContent.trim());
      if (selected.length) data.set(group, selected.join(', '));
    });

    // Add timeline and budget
    const timeline = document.querySelector('.tl-option input:checked');
    if (timeline) data.set('timeline', timeline.value);
    data.set('budget', document.getElementById('budgetAmount')?.textContent || '');

    try {
      const res = await fetch('https://formspree.io/f/xaqzpelr', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.querySelectorAll('.inq-field, .inq-email-wrap, .inq-submit').forEach(el => {
          el.style.display = 'none';
        });
        if (successMsg) {
          successMsg.classList.add('show');
          successMsg.setAttribute('aria-hidden', 'false');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        submitBtn.querySelector('.submit-text').textContent = 'Something went wrong — try again';
        submitBtn.disabled = false;
      }
    } catch {
      submitBtn.querySelector('.submit-text').textContent = 'Something went wrong — try again';
      submitBtn.disabled = false;
    }
  });
}
