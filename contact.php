<?php
require_once 'includes/db.php';
$page_title = "Contact & Bookings | Aim Images HD Photography";
$current_page = "contact.php";

$prefilled_service = isset($_GET['service']) ? clean_input($_GET['service']) : '';

// Flash notification retrieval
$contact_success = $_SESSION['flash_contact_success'] ?? '';
$contact_error = $_SESSION['flash_contact_error'] ?? '';
$review_success = $_SESSION['flash_review_success'] ?? '';
$review_error = $_SESSION['flash_review_error'] ?? '';
unset(
    $_SESSION['flash_contact_success'], 
    $_SESSION['flash_contact_error'],
    $_SESSION['flash_review_success'],
    $_SESSION['flash_review_error']
);

// 1. Process General Contact / Booking Form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_contact'])) {
    $name = clean_input($_POST['name']);
    $email = clean_input($_POST['email']);
    $phone = clean_input($_POST['phone']);
    $service_type = clean_input($_POST['service_type']);
    $user_message = clean_input($_POST['message']);

    if (empty($name) || empty($email) || empty($user_message)) {
        $_SESSION['flash_contact_error'] = "Please fill in your name, email, and message.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['flash_contact_error'] = "Please provide a valid email address.";
    } else {
        $composed_message = $user_message;
        if (!empty($service_type)) {
            $composed_message = "[Service: " . $service_type . "]\n" . $user_message;
        }

        if ($conn) {
            $stmt = mysqli_prepare($conn, "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $phone, $composed_message);

            if (mysqli_stmt_execute($stmt)) {
                $_SESSION['flash_contact_success'] = "Thank you, " . $name . "! Your message has been sent. We will get back to you shortly.";
            } else {
                $_SESSION['flash_contact_error'] = "Something went wrong sending your message. Please reach us directly via WhatsApp or phone.";
            }
            mysqli_stmt_close($stmt);
        } else {
            $_SESSION['flash_contact_success'] = "Thank you, " . $name . "! Your message has been noted. You can also chat with us directly on WhatsApp.";
        }
    }
    header('Location: contact.php#booking');
    exit();
}

// 2. Process Client Review Submission Form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_review'])) {
    $r_name = clean_input($_POST['review_name']);
    $r_rating = isset($_POST['rating']) ? intval($_POST['rating']) : 5;
    $r_message = clean_input($_POST['review_message']);

    if ($r_rating < 1 || $r_rating > 5) {
        $r_rating = 5;
    }

    if (empty($r_name) || empty($r_message)) {
        $_SESSION['flash_review_error'] = "Please provide your name and a brief review message.";
    } else {
        if ($conn) {
            $stmt = mysqli_prepare($conn, "INSERT INTO reviews (name, message, rating, approved) VALUES (?, ?, ?, 0)");
            mysqli_stmt_bind_param($stmt, "ssi", $r_name, $r_message, $r_rating);

            if (mysqli_stmt_execute($stmt)) {
                $_SESSION['flash_review_success'] = "Thank you for your feedback! Your review has been submitted and will appear on our website once approved.";
            } else {
                $_SESSION['flash_review_error'] = "Could not submit review at this time. Please try again later.";
            }
            mysqli_stmt_close($stmt);
        } else {
            $_SESSION['flash_review_success'] = "Thank you for your feedback! Your review has been recorded.";
        }
    }
    header('Location: contact.php#leave-review');
    exit();
}

include 'includes/header.php';
?>

<section class="section">
    <div class="section-header">
        <span class="section-subtitle">Get In Touch</span>
        <h1 class="section-title">Let's Discuss Your Vision</h1>
        <p class="section-desc">Reach out for bookings, availability checks, or general inquiries. We are here to serve you.</p>
    </div>

    <div class="contact-layout">

        <!-- LEFT: Studio Details -->
        <div>
            <div class="contact-card" style="margin-bottom: 30px;">
                <h2 style="font-family: var(--font-heading); color: var(--gold-bright); font-size: 1.4rem; margin-bottom: 8px;">
                    Studio Location & Hours
                </h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">
                    Visit our studio in Kabale or schedule an on-location photo session across Uganda.
                </p>

                <ul class="contact-info-list">
                    <li>
                        <span class="icon">📍</span>
                        <div>
                            <strong style="color:var(--text-white); display:block;">Studio Address</strong>
                            <span>Rugarama Road, Kabale, Western Uganda</span>
                        </div>
                    </li>
                    <li>
                        <span class="icon">📞</span>
                        <div>
                            <strong style="color:var(--text-white); display:block;">Call / WhatsApp</strong>
                            <a href="tel:+256764709563">+256 764 709 563</a>
                        </div>
                    </li>
                    <li>
                        <span class="icon">✉️</span>
                        <div>
                            <strong style="color:var(--text-white); display:block;">Email Inquiries</strong>
                            <a href="mailto:aimugimages@gmail.com">aimugimages@gmail.com</a>
                        </div>
                    </li>
                    <li>
                        <span class="icon">🕒</span>
                        <div>
                            <strong style="color:var(--text-white); display:block;">Operating Hours</strong>
                            <span>Monday – Saturday: 8:00 AM – 7:00 PM</span><br>
                            <span style="font-size:0.85rem; color:var(--text-muted);">Sunday: By Appointment</span>
                        </div>
                    </li>
                </ul>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                    <h4 style="font-size: 0.95rem; color: var(--text-white); margin-bottom: 12px;">Connect On Social Media:</h4>
                    <div class="social-links">
                        <a href="https://instagram.com/aimimages_hd_photography" target="_blank" rel="noopener noreferrer" class="social-btn">
                            Instagram
                        </a>
                        <a href="https://youtube.com/@AimImagesphotography" target="_blank" rel="noopener noreferrer" class="social-btn">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>

            <!-- Instant WhatsApp Box -->
            <div class="contact-card" style="background: linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(12, 13, 14, 0.9) 100%); border-color: rgba(37, 211, 102, 0.3);">
                <h3 style="color: #25D366; font-size: 1.15rem; margin-bottom: 8px;">💬 Prefer Instant Chat?</h3>
                <p style="color: var(--text-sub); font-size: 0.92rem; margin-bottom: 16px;">
                    Send us a direct message on WhatsApp for immediate availability checks and quote estimates.
                </p>
                <a href="https://wa.me/256764709563?text=Hello%20Aim%20Images,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20shoot." 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn btn-sm" 
                   style="background:#25D366; color:#fff; font-weight:bold;">
                    Chat on WhatsApp Now
                </a>
            </div>
        </div>

        <!-- RIGHT: Contact & Booking Form -->
        <div>
            <div class="contact-card" id="booking">
                <h2 style="font-family: var(--font-heading); color: var(--gold-bright); font-size: 1.4rem; margin-bottom: 8px;">
                    Send a Message or Booking Request
                </h2>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px;">
                    Fill out the form below and we will get back to you promptly.
                </p>

                <?php if (!empty($contact_success)): ?>
                    <div class="alert alert-success alert-auto-dismiss">
                        ✅ <?php echo e($contact_success); ?>
                    </div>
                <?php endif; ?>

                <?php if (!empty($contact_error)): ?>
                    <div class="alert alert-danger">
                        ⚠️ <?php echo e($contact_error); ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="contact.php#booking">
                    <div class="form-group">
                        <label for="name">Your Full Name *</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Grace Tumusiime" required>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" class="form-control" placeholder="grace@example.com" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone / WhatsApp Number</label>
                            <input type="text" id="phone" name="phone" class="form-control" placeholder="+256 700 000 000">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 15px;">
                        <div class="form-group">
                            <label for="service_type">Service Needed</label>
                            <select id="service_type" name="service_type" class="form-control">
                                <option value="">-- Select a Service --</option>
                                <option value="Wedding Photography" <?php echo ($prefilled_service === 'Wedding Photography') ? 'selected' : ''; ?>>Wedding Photography</option>
                                <option value="Kukyara / Introduction" <?php echo ($prefilled_service === 'Kukyara & Cultural Introductions' || $prefilled_service === 'Kukyara') ? 'selected' : ''; ?>>Kukyara (Introduction Ceremony)</option>
                                <option value="Corporate / Event" <?php echo (strpos($prefilled_service, 'Corporate') !== false) ? 'selected' : ''; ?>>Corporate & Event Photography</option>
                                <option value="Portrait / Studio" <?php echo (strpos($prefilled_service, 'Portrait') !== false) ? 'selected' : ''; ?>>Portrait & Studio Session</option>
                                <option value="Modeling / Fashion" <?php echo (strpos($prefilled_service, 'Modeling') !== false) ? 'selected' : ''; ?>>Fashion & Modeling Portfolio</option>
                                <option value="Videography" <?php echo (strpos($prefilled_service, 'Videography') !== false) ? 'selected' : ''; ?>>HD Videography & Drone</option>
                                <option value="Other">Other Custom Inquiry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="event_date">Preferred Date</label>
                            <input type="date" id="event_date" name="event_date" class="form-control">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="message">Your Message / Event Venue & Details *</label>
                        <textarea id="message" name="message" class="form-control" placeholder="Tell us about your event venue in Kabale or elsewhere, package requirements, and ideas..." required></textarea>
                    </div>

                    <button type="submit" name="send_contact" class="btn btn-gold" style="width:100%;">
                        Send Inquiry
                    </button>

                    <div style="margin-top: 15px; text-align: center;">
                        <span style="display:block; color:var(--text-muted); font-size:0.82rem; margin-bottom:8px;">— Or connect with us immediately —</span>
                        <a href="https://wa.me/256764709563?text=Hello%20Aim%20Images,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20shoot." target="_blank" class="btn btn-outline" style="width:100%; border-color:#25D366; color:#25D366;">
                            💬 Instant WhatsApp Consultation
                        </a>
                    </div>
                </form>
            </div>
        </div>

    </div>
</section>

<!-- CLIENT REVIEW SUBMISSION SECTION -->
<section class="section section-alt" id="leave-review">
    <div class="section-header">
        <span class="section-subtitle">Client Feedback</span>
        <h2 class="section-title">Leave a Review</h2>
        <p class="section-desc">Have we captured a special milestone for you? We would love to hear about your experience.</p>
    </div>

    <div style="max-width: 650px; margin: 0 auto;">
        <div class="contact-card">
            <?php if (!empty($review_success)): ?>
                <div class="alert alert-success alert-auto-dismiss">
                    ✅ <?php echo e($review_success); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($review_error)): ?>
                <div class="alert alert-danger">
                    ⚠️ <?php echo e($review_error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="contact.php#leave-review">
                <div class="form-group">
                    <label for="review_name">Your Name / Couple Name *</label>
                    <input type="text" id="review_name" name="review_name" class="form-control" placeholder="e.g. Sarah & Brian" required>
                </div>

                <div class="form-group">
                    <label>Your Rating *</label>
                    <div class="star-rating-picker" title="Click to rate">
                        <span class="star-btn selected" data-value="1">&#9733;</span>
                        <span class="star-btn selected" data-value="2">&#9733;</span>
                        <span class="star-btn selected" data-value="3">&#9733;</span>
                        <span class="star-btn selected" data-value="4">&#9733;</span>
                        <span class="star-btn selected" data-value="5">&#9733;</span>
                    </div>
                    <input type="hidden" name="rating" id="selectedRating" value="5">
                </div>

                <div class="form-group">
                    <label for="review_message">Your Experience & Testimonial *</label>
                    <textarea id="review_message" name="review_message" class="form-control" placeholder="Write a few words about our service, photo quality, and customer experience..." required></textarea>
                </div>

                <button type="submit" name="submit_review" class="btn btn-outline" style="width:100%; border-color:var(--gold); color:var(--gold);">
                    Submit Review For Approval
                </button>
            </form>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>