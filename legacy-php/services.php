<?php
require_once 'includes/db.php';
$page_title = "Our Services | Aim Images HD Photography";
$current_page = "services.php";
include 'includes/header.php';

// Base list of core services
$core_services = [
    [
        'icon' => '💍',
        'title' => 'Wedding Photography',
        'desc' => 'Comprehensive coverage of your special day with elegance, romantic intimacy, and timeless beauty. From bride and groom preparations to the evening reception dance floor.',
        'tag' => 'Most Popular'
    ],
    [
        'icon' => '💛',
        'title' => 'Kukyara & Cultural Introductions',
        'desc' => 'Honoring cherished Ugandan traditions and cultural ceremonies. We capture the vibrant attire, family blessings, exchange of gifts, and joyful community spirit.',
        'tag' => 'Cultural Heritage'
    ],
    [
        'icon' => '🏢',
        'title' => 'Corporate & Brand Photography',
        'desc' => 'High-caliber commercial imagery for companies, executive portraits, staff profiles, corporate facilities, and marketing campaigns.',
        'tag' => 'Commercial'
    ],
    [
        'icon' => '🎤',
        'title' => 'Conferences, Meetings & Events',
        'desc' => 'Dynamic live photojournalism for corporate summits, governmental conferences, award galas, and religious assemblies with fast turnaround.',
        'tag' => 'Events'
    ],
    [
        'icon' => '🎭',
        'title' => 'Portrait & Studio Sessions',
        'desc' => 'Individually styled portrait shoots for graduations, birthday milestones, baby bumps, family albums, and executive branding.',
        'tag' => 'Studio & Outdoor'
    ],
    [
        'icon' => '📸',
        'title' => 'Fashion & Modeling Portfolios',
        'desc' => 'Creative fashion shoots for emerging and seasoned models, designers, agency comp cards, and creative editorial lookbooks.',
        'tag' => 'Creative'
    ],
    [
        'icon' => '🎁',
        'title' => 'Giveaway & Celebration Shoots',
        'desc' => 'Preserving every heartfelt smile during giveaway ceremonies, family anniversaries, and celebratory community gatherings.',
        'tag' => 'Celebrations'
    ],
    [
        'icon' => '🎬',
        'title' => 'HD Videography & Drone Cinematography',
        'desc' => 'Ultra-high-definition motion filming, 4K drone aerial views, high-fidelity audio capture, and cinematic highlight reels.',
        'tag' => 'Motion & Aerial'
    ],
];

// Fetch any custom services added via admin database
$custom_services = [];
$db_services = $conn ? mysqli_query($conn, "SELECT * FROM services ORDER BY id ASC") : false;
if ($db_services && mysqli_num_rows($db_services) > 0) {
    while ($row = mysqli_fetch_assoc($db_services)) {
        $custom_services[] = [
            'icon' => '⭐',
            'title' => $row['title'],
            'desc' => $row['description'],
            'tag' => 'Specialized Service'
        ];
    }
}

$all_services = array_merge($core_services, $custom_services);
?>

<section class="section">
    <div class="section-header">
        <span class="section-subtitle">Our Expertise</span>
        <h1 class="section-title">Professional Photography & Videography</h1>
        <p class="section-desc">Tailored visual coverage crafted with state-of-the-art equipment, intentional lighting, and spiritual reverence.</p>
    </div>

    <div class="services-grid">
        <?php foreach ($all_services as $svc): ?>
            <div class="service-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="service-icon"><?php echo $svc['icon']; ?></div>
                    <span class="portfolio-tag" style="margin:0; font-size: 0.68rem;"><?php echo e($svc['tag']); ?></span>
                </div>
                <h3 class="service-title"><?php echo e($svc['title']); ?></h3>
                <p class="service-text"><?php echo e($svc['desc']); ?></p>
                <div style="margin-top:auto; padding-top:15px; border-top: 1px solid var(--border-color);">
                    <a href="contact.php?service=<?php echo urlencode($svc['title']); ?>" class="btn btn-sm btn-gold" style="width:100%; text-align:center;">
                        Book This Service
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- SERVICE EXPERIENCE PROCESS -->
<section class="section section-alt">
    <div class="section-header">
        <span class="section-subtitle">How We Work</span>
        <h2 class="section-title">Our 4-Step Process</h2>
        <p class="section-desc">From initial consultation to the final delivery of your high-definition gallery.</p>
    </div>

    <div class="services-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="service-card" style="text-align:center;">
            <div style="font-family:var(--font-heading); font-size:2.5rem; color:var(--gold); margin-bottom:10px;">01</div>
            <h3 class="service-title">Consultation</h3>
            <p class="service-text">We discuss your vision, schedule, location, and specific style preferences.</p>
        </div>

        <div class="service-card" style="text-align:center;">
            <div style="font-family:var(--font-heading); font-size:2.5rem; color:var(--gold); margin-bottom:10px;">02</div>
            <h3 class="service-title">The Shoot</h3>
            <p class="service-text">Our professional team arrives early, equipped with HD cameras and creative lighting.</p>
        </div>

        <div class="service-card" style="text-align:center;">
            <div style="font-family:var(--font-heading); font-size:2.5rem; color:var(--gold); margin-bottom:10px;">03</div>
            <h3 class="service-title">Post-Processing</h3>
            <p class="service-text">Detailed color grading, retouching, and curation to bring out vivid, natural beauty.</p>
        </div>

        <div class="service-card" style="text-align:center;">
            <div style="font-family:var(--font-heading); font-size:2.5rem; color:var(--gold); margin-bottom:10px;">04</div>
            <h3 class="service-title">Delivery</h3>
            <p class="service-text">Receive your private high-resolution digital download and optional custom printed albums.</p>
        </div>
    </div>
</section>

<!-- CALL TO ACTION -->
<section class="section" style="text-align:center;">
    <div style="max-width: 700px; margin: 0 auto;">
        <h2 style="font-family: var(--font-heading); color: var(--gold-bright); font-size: 2.2rem; margin-bottom: 15px;">
            Need a Customized Photography Package?
        </h2>
        <p style="color: var(--text-sub); font-size: 1.05rem; margin-bottom: 30px;">
            Every event is unique. Tell us about your budget and requirements and we will customize a bespoke package for you.
        </p>
        <a href="contact.php" class="btn btn-gold">Request a Custom Quote</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>