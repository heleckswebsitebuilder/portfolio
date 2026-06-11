/* ============================================================
   PORTFOLIO — MAIN.JS
   Custom cursor · Nav scroll · Scroll reveals · Mobile menu
   ============================================================ */

'use strict';

/* ---------- Custom Cursor ---------- */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot follows exactly
  cursorDot.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;
});

// Smooth cursor lag
function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.transform = `translate(${curX - 20}px, ${curY - 20}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover states
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.querySelectorAll('.project').forEach(el => {
  const label = el.dataset.cursor || 'View';
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('project-hover', 'text-label');
    cursor.classList.remove('hover');
    cursor.dataset.label = label;
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('project-hover', 'text-label');
    delete cursor.dataset.label;
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorDot.style.opacity = '1';
});

/* ---------- Nav Scroll Effect ---------- */
const nav = document.getElementById('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  // Hide nav on fast scroll down, show on scroll up
  if (y > lastScrollY + 8 && y > 120) {
    nav.style.transform = 'translateY(-100%)';
  } else if (y < lastScrollY - 4) {
    nav.style.transform = 'translateY(0)';
  }
  lastScrollY = y;
}, { passive: true });

nav.style.transition = 'background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1)';

/* ---------- Mobile Menu ---------- */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

revealEls.forEach(el => observer.observe(el));

/* ---------- Smooth Anchor Scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Marquee Pause on Hover (handled in CSS) ---------- */

/* ---------- Tilt on project cards (desktop only) ---------- */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -5;
      const tiltY  = dx *  5;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Number Counter Animate ---------- */
function animateCounter(el) {
  const raw   = el.textContent.trim();
  const match = raw.match(/(\d+)(\D*)/);
  if (!match) return;
  const end    = parseInt(match[1]);
  const suffix = match[2] || '';
  const dur    = 1200;
  const step   = 16;
  const steps  = dur / step;
  let current  = 0;

  const timer = setInterval(() => {
    current = Math.min(current + end / steps, end);
    el.textContent = Math.round(current) + suffix;
    if (current >= end) clearInterval(timer);
  }, step);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

/* ---------- Page load reveal ---------- */
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});
