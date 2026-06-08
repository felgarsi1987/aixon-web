// interactions.js — Scroll reveals, progress bar, nav, FAQ, counters
(function() {
  'use strict';

  // Progress bar
  var progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    var max = document.body.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // Nav scroll class
  var nav = document.getElementById('main-nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  // Intersection observer for reveals
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  function initReveals() {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  // FAQ accordion
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(o) { o.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // Mobile nav burger
  function initBurger() {
    var burger = document.querySelector('.nav-burger');
    var links = document.querySelector('.nav-links');
    if (!burger || !links) return;
    burger.addEventListener('click', function() {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { links.classList.remove('open'); });
    });
  }

  // Counter animation
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var duration = 1800;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var val = target * ease;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  function initCounters() {
    document.querySelectorAll('[data-target]').forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('scroll', updateNav, { passive: true });

  document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    updateNav();
    initReveals();
    initFAQ();
    initBurger();
    initCounters();
    initSmoothScroll();
  });
})();
