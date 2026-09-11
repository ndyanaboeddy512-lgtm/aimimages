<?php
require_once 'includes/db.php';
$page_title = "About Us | Aim Images HD Photography";
$current_page = "about.php";
include 'includes/header.php';
?>

<!-- ABOUT HERO BANNER -->
<section class="section" style="padding-bottom: 30px;">
    <div class="section-header">
        <span class="section-subtitle">Our Story</span>
        <h1 class="section-title">About Aim Images HD Photography</h1>
        <p class="section-desc">Born from a passion for visual storytelling and rooted in faith and excellence.</p>
    </div>

    <div class="about-grid">
        <div class="about-text">
            <p>
                Since <strong>2022</strong>, Aim Images HD Photography has been turning moments into lasting memories in the rolling hills of Kabale, Uganda, and across East Africa. From romantic weddings to corporate boardrooms, we believe that photography is more than snapping a picture &mdash; it is the art of immortalizing emotion, cultural dignity, and authentic joy.
            </p>
            <p>
                Guided by our foundational principle, <em>"With God We Always Work Professionally"</em>, we bring intentionality, creative lighting, and high-definition gear to every single assignment. Whether documenting an intimate Kukyara introduction or directing a high-energy music video, we treat every client’s story with reverence and care.
            </p>
            <p>
                Our studio is conveniently located on <strong>Rugarama Road in Kabale</strong>, offering full-service indoor portrait sessions as well as traveling on-location across Uganda for outdoor shoots, destination weddings, and cultural celebrations.
            </p>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">2022</div>
                <div class="stat-label">Year Founded</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">HD</div>
                <div class="stat-label">Crisp Quality</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">8+</div>
                <div class="stat-label">Creative Services</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">100%</div>
                <div class="stat-label">Client Dedication</div>
            </div>
        </div>
    </div>
</section>

<!-- STUDIO CORE VALUES -->
<section class="section section-alt">
    <div class="section-header">
        <span class="section-subtitle">What Drives Us</span>
        <h2 class="section-title">Our Guiding Pillars</h2>
        <p class="section-desc">The principles that define our creative craft and client experience.</p>
    </div>

    <div class="services-grid">
        <div class="service-card">
            <div class="service-icon">🙏</div>
            <h3 class="service-title">Faith & Integrity</h3>
            <p class="service-text">We believe in transparent, reliable, and honest collaboration in every client interaction and pricing agreement.</p>
        </div>

        <div class="service-card">
            <div class="service-icon">✨</div>
            <h3 class="service-title">Artistic Precision</h3>
            <p class="service-text">Every image is carefully color-graded, curated, and produced with high dynamic range and pristine clarity.</p>
        </div>

        <div class="service-card">
            <div class="service-icon">🤝</div>
            <h3 class="service-title">Cultural Reverence</h3>
            <p class="service-text">We take deep pride in documenting Ugandan cultural rites, introductions (Kukyara), and heritage with beauty.</p>
        </div>
    </div>
</section>

<!-- DYNAMIC TEAM SECTION -->
<section class="section">
    <div class="section-header">
        <span class="section-subtitle">Behind The Lens</span>
        <h2 class="section-title">Meet Our Creative Team</h2>
        <p class="section-desc">The dedicated artists, photographers, and visual editors who make magic happen.</p>
    </div>

    <div class="team-grid">
        <?php
        $team_sql = "SELECT * FROM employees ORDER BY created_at DESC";
        $team_res = $conn ? mysqli_query($conn, $team_sql) : false;

        if ($team_res && mysqli_num_rows($team_res) > 0) {
            while ($member = mysqli_fetch_assoc($team_res)) {
                $photo = get_image_url($member['photo']);
                $name = e($member['name']);
                $role = !empty($member['role']) ? e($member['role']) : 'Visual Artist';
                $bio = !empty($member['bio']) ? e($member['bio']) : 'Dedicated to delivering exceptional imagery with artistic passion.';
                
                echo '<div class="team-card">
                    <div class="team-photo-wrap">
                        <img src="' . $photo . '" alt="' . $name . '" loading="lazy" onerror="this.src=\'images/logo.png\'">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">' . $name . '</h3>
                        <div class="team-role">' . $role . '</div>
                        <p class="team-bio">' . $bio . '</p>
                    </div>
                </div>';
            }
        } else {
            // Default studio team cards if no database entries exist yet
            echo '<div class="team-card">
                <div class="team-photo-wrap" style="display:flex;align-items:center;justify-content:center;background:#111;">
                    <img src="images/logo.png" alt="Aim Images Studio" style="width:70%;height:auto;object-fit:contain;">
                </div>
                <div class="team-info">
                    <h3 class="team-name">Lead Cinematographer & Founder</h3>
                    <div class="team-role">Creative Director</div>
                    <p class="team-bio">Passionate visual artist leading Aim Images HD Photography with a commitment to faith, excellence, and storytelling.</p>
                </div>
            </div>';

            echo '<div class="team-card">
                <div class="team-photo-wrap" style="display:flex;align-items:center;justify-content:center;background:#111;">
                    <img src="images/logo.png" alt="Aim Images Studio" style="width:70%;height:auto;object-fit:contain;">
                </div>
                <div class="team-info">
                    <h3 class="team-name">Portrait & Event Specialist</h3>
                    <div class="team-role">Senior Photographer</div>
                    <p class="team-bio">Specializing in candid ceremonies, natural light portraits, and high-impact event coverage throughout Uganda.</p>
                </div>
            </div>';
        }
        ?>
    </div>
</section>

<!-- CALL TO ACTION -->
<section class="section section-alt" style="text-align: center;">
    <div style="max-width: 650px; margin: 0 auto;">
        <h2 style="font-family: var(--font-heading); color: var(--gold-bright); font-size: 2rem; margin-bottom: 15px;">
            Let's Collaborate On Your Next Project
        </h2>
        <p style="color: var(--text-sub); margin-bottom: 25px;">
            We're always ready to capture your story. Get in touch with our team today.
        </p>
        <a href="contact.php" class="btn btn-gold">Contact The Team</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>