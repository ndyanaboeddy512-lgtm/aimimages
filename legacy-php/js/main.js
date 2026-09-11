/**
 * Aim Images HD Photography - Main JavaScript
 * Includes: Mobile Nav, Lightbox Viewer, Review Rating, and Smart Booking Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // -------------------------------------------------------------
    // 2. Fullscreen Lightbox Gallery Viewer
    // -------------------------------------------------------------
    const lightbox = document.getElementById('aimLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = document.getElementById('lightboxOverlay');

    const openLightbox = (imgSrc, title, cat) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = title || 'Aim Images Photography';
        if (lightboxCat) {
            lightboxCat.textContent = cat || 'Photography';
            lightboxCat.style.display = cat ? 'inline-block' : 'none';
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent page scroll behind modal
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    };

    document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const fullImg = trigger.getAttribute('data-full') || trigger.querySelector('img')?.src;
            const title = trigger.getAttribute('data-title') || trigger.querySelector('img')?.alt || '';
            const cat = trigger.getAttribute('data-cat') || '';
            if (fullImg) openLightbox(fullImg, title, cat);
        });

        // Enable keyboard Enter/Space activation for accessibility
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // -------------------------------------------------------------
    // 3. Interactive Star Rating for Reviews
    // -------------------------------------------------------------
    const starContainer = document.querySelector('.star-rating-picker');
    const ratingInput = document.getElementById('selectedRating');

    if (starContainer && ratingInput) {
        const stars = starContainer.querySelectorAll('.star-btn');

        const updateStars = (val) => {
            stars.forEach(s => {
                const sVal = parseInt(s.dataset.value, 10);
                if (sVal <= val) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        };

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                e.preventDefault();
                const val = parseInt(star.dataset.value, 10);
                ratingInput.value = val;
                updateStars(val);
            });

            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.dataset.value, 10);
                stars.forEach(s => {
                    const sVal = parseInt(s.dataset.value, 10);
                    if (sVal <= val) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hovered'));
            });
        });

        if (ratingInput.value) {
            updateStars(parseInt(ratingInput.value, 10));
        }
    }

    // -------------------------------------------------------------
    // 4. Auto-dismiss Alert Messages
    // -------------------------------------------------------------
    const alerts = document.querySelectorAll('.alert-auto-dismiss');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 600);
        }, 5000);
    });

    // -------------------------------------------------------------
    // 5. Dynamic WhatsApp Message Composer on Booking Form
    // -------------------------------------------------------------
    const nameField = document.getElementById('name');
    const serviceField = document.getElementById('service_type');
    const dateField = document.getElementById('event_date');
    const waQuickBtn = document.getElementById('instantWaBtn');

    if (waQuickBtn && nameField) {
        const updateWaLink = () => {
            const clientName = nameField.value.trim() || 'a client';
            const selectedService = (serviceField && serviceField.value) ? serviceField.value : 'photography services';
            const eventDate = (dateField && dateField.value) ? ` on ${dateField.value}` : '';

            const messageText = `Hello Aim Images HD Photography, my name is ${clientName}. I would like to inquire about booking ${selectedService}${eventDate}.`;
            waQuickBtn.href = `https://wa.me/256764709563?text=${encodeURIComponent(messageText)}`;
        };

        nameField.addEventListener('input', updateWaLink);
        if (serviceField) serviceField.addEventListener('change', updateWaLink);
        if (dateField) dateField.addEventListener('change', updateWaLink);
    }
});
