/*
  Vashista Model High School - Modern Interactions & Functionality
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger lines
      const lines = mobileNavToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const lines = mobileNavToggle.querySelectorAll('span');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });
  }

  // 2. Sticky Header Effects
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
      }
    });
  }

  // 3. Hero Slider Logic
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 seconds

    // Create Navigation Dots dynamically
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const showSlide = (index) => {
      slides.forEach((slide) => slide.classList.remove('active'));
      dots.forEach((dot) => dot.classList.remove('active'));

      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    };

    const nextSlide = () => {
      let index = currentSlide + 1;
      if (index >= slides.length) index = 0;
      showSlide(index);
    };

    const prevSlide = () => {
      let index = currentSlide - 1;
      if (index < 0) index = slides.length - 1;
      showSlide(index);
    };

    const goToSlide = (index) => {
      showSlide(index);
      resetSliderTimer();
    };

    const startSliderTimer = () => {
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    const resetSliderTimer = () => {
      clearInterval(slideInterval);
      startSliderTimer();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSliderTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSliderTimer();
      });
    }

    startSliderTimer();
  }

  // 4. FAQ Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all open items
      document.querySelectorAll('.accordion-item').forEach((otherItem) => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 5. Scroll Entry Animations (Reveal on scroll)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 6. Photo Gallery Filtering & Lightbox
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === category) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox Implementation
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title').textContent;
        const category = item.querySelector('.gallery-item-category').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} (${category})`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 7. Dynamic Form Handlers (Admission Enquiry / Contacts Form Simulation)
  const contactForm = document.querySelector('#contactForm');
  const enquiryForm = document.querySelector('#enquiryForm');

  const handleFormSubmit = (form, successDivId) => {
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulating loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        setTimeout(() => {
          // Hide Form contents and show Success card
          const formCard = form.closest('.form-card');
          const successMsg = formCard.querySelector('.form-success-message');
          
          if (successMsg) {
            successMsg.textContent = form.id === 'enquiryForm' 
              ? 'Thank you for your enquiry! Our admissions team will contact you within 24 hours.' 
              : 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
            successMsg.style.display = 'block';
            
            // Smoothly scroll to the success message
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Reset button and form fields
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          form.reset();
        }, 1500);
      });
    }
  };

  handleFormSubmit(contactForm);
  handleFormSubmit(enquiryForm);
});
