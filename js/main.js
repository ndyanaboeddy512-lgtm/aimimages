/**
 * Aim Images HD Photography - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu when a navigation link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // 2. Interactive Star Rating for Reviews
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

        // Initial state
        if (ratingInput.value) {
            updateStars(parseInt(ratingInput.value, 10));
        }
    }

    // 3. Auto-dismiss Alert Messages
    const alerts = document.querySelectorAll('.alert-auto-dismiss');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 600);
        }, 5000);
    });

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
