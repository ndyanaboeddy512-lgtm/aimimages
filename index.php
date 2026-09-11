<?php
require_once 'includes/db.php';
$page_title = "Aim Images HD Photography | Professional Studio in Kabale, Uganda";
$current_page = "index.php";
include 'includes/header.php';
?>

<!-- HERO SECTION -->
<section class="hero">
    <div class="hero-content">
        <span class="hero-badge">Kabale, Uganda &bull; Est. 2022</span>
        <h1 class="hero-title">
            With God We Always Work 
            <span class="highlight">Professionally</span>
        </h1>
        <p class="hero-tagline">
            Capturing timeless memories, radiant portraits, traditional ceremonies, and high-definition video productions across Uganda.
        </p>
        <div class="hero-actions">
            <a href="contact.php" class="btn btn-gold">Book a Session</a>
            <a href="portfolio.php" class="btn btn-outline">Explore Gallery</a>
        </div>
    </div>
</section>

<!-- SERVICES PREVIEW -->
<section class="section">
    <div class="section-header">
        <span class="section-subtitle">What We Do</span>
        <h2 class="section-title">Crafted Visual Storytelling</h2>
        <p class="section-desc">From intimate portraits to grandiose cultural ceremonies, we preserve every second with artistic precision.</p>
    </div>

    <div class="services-grid">
        <div class="service-card">
            <div class="service-icon">💍</div>
            <h3 class="service-title">Wedding Photography</h3>
            <p class="service-text">Every look of love, gentle tear, and joyous dance celebrated and preserved for generations.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>

        <div class="service-card">
            <div class="service-icon">💛</div>
            <h3 class="service-title">Kukyara & Introductions</h3>
            <p class="service-text">Honoring traditional heritage and cultural ceremonies with vibrant, authentic high-definition captures.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>

        <div class="service-card">
            <div class="service-icon">🏢</div>
            <h3 class="service-title">Corporate & Events</h3>
            <p class="service-text">Professional visuals for businesses, annual conferences, summits, and corporate team identities.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>

        <div class="service-card">
            <div class="service-icon">🎭</div>
            <h3 class="service-title">Portraits & Studio</h3>
            <p class="service-text">Individual, graduation, family, and executive portraits designed to reflect your genuine character.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>

        <div class="service-card">
            <div class="service-icon">📸</div>
            <h3 class="service-title">Fashion & Modeling</h3>
            <p class="service-text">Creative high-fashion lookbooks, model portfolios, and artistic styling tailored for commercial impact.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>

        <div class="service-card">
            <div class="service-icon">🎬</div>
            <h3 class="service-title">Cinematic Videography</h3>
            <p class="service-text">Crystal-clear HD video filming, drone aerial shots, and motion storytelling for any special event.</p>
            <a href="services.php" class="service-link">Learn More &rarr;</a>
        </div>
    </div>
</section>

<!-- RECENT PORTFOLIO SHOWCASE -->
<section class="section section-alt">
    <div class="section-header">
        <span class="section-subtitle">Portfolio Highlights</span>
        <h2 class="section-title">Moments We Have Immortalized</h2>
        <p class="section-desc">A small glimpse into our recent photography and visual projects.</p>
    </div>

    <div class="portfolio-grid">
        <?php
        $port_query = "SELECT * FROM portfolio ORDER BY created_at DESC LIMIT 6";
        $port_res = $conn ? mysqli_query($conn, $port_query) : false;
        if ($port_res && mysqli_num_rows($port_res) > 0) {
            while ($item = mysqli_fetch_assoc($port_res)) {
                $img = e($item['image']);
                $title = e($item['title']);
                $category = !empty($item['category']) ? e($item['category']) : 'Photography';
                echo '<div class="portfolio-card">
                    <img src="images/' . $img . '" alt="' . $title . '" loading="lazy" onerror="this.src=\'images/logo.png\'">
                    <div class="portfolio-overlay">
                        <span class="portfolio-tag">' . $category . '</span>
                        <h4 class="portfolio-name">' . $title . '</h4>
                    </div>
                </div>';
            }
        } else {
            echo '<div class="no-items-placeholder">
                <p>New gallery photos will be featured here soon.</p>
                <p style="margin-top:10px;"><a href="contact.php" class="btn btn-sm btn-gold">Book Next Shoot With Us</a></p>
            </div>';
        }
        ?>
    </div>

    <div style="text-align:center; margin-top: 45px;">
        <a href="portfolio.php" class="btn btn-outline">View Full Portfolio Gallery</a>
    </div>
</section>

<!-- CLIENT TESTIMONIALS / REVIEWS -->
<section class="section">
    <div class="section-header">
        <span class="section-subtitle">Client Kind Words</span>
        <h2 class="section-title">What Our Clients Say</h2>
        <p class="section-desc">Real stories from people who trusted us with their once-in-a-lifetime moments.</p>
    </div>

    <div class="reviews-grid">
        <?php
        $reviews_query = "SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT 3";
        $reviews_res = $conn ? mysqli_query($conn, $reviews_query) : false;

        if ($reviews_res && mysqli_num_rows($reviews_res) > 0) {
            while ($rev = mysqli_fetch_assoc($reviews_res)) {
                $rating_stars = str_repeat('★', intval($rev['rating'] ?: 5));
                echo '<div class="review-card">
                    <div class="review-stars">' . $rating_stars . '</div>
                    <p class="review-text">"' . e($rev['message']) . '"</p>
                    <div class="review-author">
                        <div class="author-avatar">' . strtoupper(substr(e($rev['name']), 0, 1)) . '</div>
                        <div>
                            <div class="author-name">' . e($rev['name']) . '</div>
                            <div class="author-date">' . date('F Y', strtotime($rev['created_at'])) . '</div>
                        </div>
                    </div>
                </div>';
            }
        } else {
            // Default placeholder reviews for aesthetic presentation until reviews are submitted
            echo '<div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"Aim Images made our Kukyara truly memorable. Their respect, punctuality, and the quality of the photos exceeded our highest expectations."</p>
                <div class="review-author">
                    <div class="author-avatar">A</div>
                    <div>
                        <div class="author-name">Angella & David</div>
                        <div class="author-date">Kabale, Uganda</div>
                    </div>
                </div>
            </div>';

            echo '<div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"The professionalism demonstrated by the Aim Images team during our regional conference was top-notch. Fast delivery and stunning HD resolution."</p>
                <div class="review-author">
                    <div class="author-avatar">K</div>
                    <div>
                        <div class="author-name">Kigezi Business Forum</div>
                        <div class="author-date">Corporate Event</div>
                    </div>
                </div>
            </div>';

            echo '<div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"They know how to make you feel comfortable in front of the camera. The portraits came out looking natural, vibrant, and elegant."</p>
                <div class="review-author">
                    <div class="author-avatar">M</div>
                    <div>
                        <div class="author-name">Moses K.</div>
                        <div class="author-date">Portrait Session</div>
                    </div>
                </div>
            </div>';
        }
        ?>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="contact.php#leave-review" class="btn btn-outline btn-sm">⭐ Submit Your Own Review</a>
    </div>
</section>

<!-- CALL TO ACTION BANNER -->
<section class="section section-alt" style="text-align: center;">
    <div style="max-width: 700px; margin: 0 auto;">
        <h2 style="font-family: var(--font-heading); color: var(--gold-bright); font-size: 2.2rem; margin-bottom: 15px;">
            Let's Make Your Moments Unforgettable
        </h2>
        <p style="color: var(--text-sub); font-size: 1.1rem; margin-bottom: 30px;">
            Have an upcoming wedding, ceremony, or portrait session? We'd love to partner with you.
        </p>
        <a href="contact.php" class="btn btn-gold">Contact Us Today</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>