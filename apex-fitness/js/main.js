/* ========================================================================
   CONQUER FITNESS — Main JavaScript
   Shared interactivity: nav, scroll animations, accordion, gallery, filters
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. MOBILE NAVIGATION
  // ========================================================================
  const hamburger = document.querySelector('.navbar-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      const icon = hamburger.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = isOpen ? 'close' : 'menu';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = hamburger.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================================================
  // 2. SCROLL REVEAL ANIMATIONS
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ========================================================================
  // 3. NAVBAR SCROLL EFFECT
  // ========================================================================
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        navbar.style.boxShadow = '0 0 30px rgba(171, 214, 0, 0.2)';
      } else {
        navbar.style.boxShadow = '0 0 20px rgba(171, 214, 0, 0.15)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ========================================================================
  // 4. FAQ ACCORDION
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(other => {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ========================================================================
  // 5. GALLERY LIGHTBOX
  // ========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // ========================================================================
  // 6. SCHEDULE / CLASS FILTER
  // ========================================================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const filterableItems = document.querySelectorAll('[data-category]');

  if (filterChips.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;

        // Update active state
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // Filter items
        filterableItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ========================================================================
  // 7. CONTACT FORM VALIDATION
  // ========================================================================
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.neon-input, .neon-select').forEach(input => {
        input.style.borderBottomColor = '';
      });

      // Validate name
      if (name && name.value.trim() === '') {
        name.style.borderBottomColor = '#ff2d55';
        isValid = false;
      }

      // Validate email
      if (email && !isValidEmail(email.value)) {
        email.style.borderBottomColor = '#ff2d55';
        isValid = false;
      }

      // Validate message
      if (message && message.value.trim() === '') {
        message.style.borderBottomColor = '#ff2d55';
        isValid = false;
      }

      if (isValid) {
        // Show success state
        const btn = contactForm.querySelector('button[type="submit"]');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> <span>Message Sent!</span>';
          btn.style.background = 'rgba(195, 244, 0, 0.2)';
          btn.style.borderColor = '#c3f400';
          btn.style.color = '#c3f400';
          btn.disabled = true;

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
            contactForm.reset();
          }, 3000);
        }
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ========================================================================
  // 8. COUNTER ANIMATION (for stats)
  // ========================================================================
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = target.dataset.count;
          const suffix = target.dataset.suffix || '';
          const prefix = target.dataset.prefix || '';
          const numericValue = parseFloat(endValue.replace(/,/g, ''));
          const hasDecimal = endValue.includes('.');
          const duration = 2000;
          const start = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            let current;
            if (hasDecimal) {
              current = (numericValue * eased).toFixed(1);
            } else {
              current = Math.floor(numericValue * eased).toLocaleString();
            }

            target.textContent = prefix + current + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ========================================================================
  // 9. SMOOTH SCROLL for in-page anchors
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
