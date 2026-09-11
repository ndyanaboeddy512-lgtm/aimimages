<?php
require_once 'includes/db.php';
$page_title = "Portfolio Gallery | Aim Images HD Photography";
$current_page = "portfolio.php";
include 'includes/header.php';

// Active Category filter
$selected_cat = isset($_GET['category']) ? clean_input($_GET['category']) : 'all';

// Fetch distinct categories from database
$cat_list = [];
$cat_query = $conn ? mysqli_query($conn, "SELECT DISTINCT category FROM portfolio WHERE category IS NOT NULL AND category != ''") : false;
if ($cat_query) {
    while ($crow = mysqli_fetch_assoc($cat_query)) {
        $cat_list[] = $crow['category'];
    }
}

// Prepare filtered query
$result = false;
if ($conn) {
    if ($selected_cat !== 'all') {
        $stmt = mysqli_prepare($conn, "SELECT * FROM portfolio WHERE category = ? ORDER BY created_at DESC");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $selected_cat);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
        }
    } else {
        $result = mysqli_query($conn, "SELECT * FROM portfolio ORDER BY created_at DESC");
    }
}
?>

<section class="section">
    <div class="section-header">
        <span class="section-subtitle">Visual Showcase</span>
        <h1 class="section-title">Client Portfolio Gallery</h1>
        <p class="section-desc">A curated collection of unforgettable moments, genuine celebrations, and refined portraiture.</p>
    </div>

    <!-- Category Filter Bar -->
    <?php if (!empty($cat_list)): ?>
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom: 40px; flex-wrap:wrap;">
            <a href="portfolio.php" class="btn btn-sm <?php echo ($selected_cat === 'all') ? 'btn-gold' : 'btn-outline'; ?>">
                All Works
            </a>
            <?php foreach ($cat_list as $cat): ?>
                <a href="portfolio.php?category=<?php echo urlencode($cat); ?>" 
                   class="btn btn-sm <?php echo ($selected_cat === $cat) ? 'btn-gold' : 'btn-outline'; ?>">
                    <?php echo e($cat); ?>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <!-- Portfolio Photo Grid -->
    <div class="portfolio-grid">
        <?php
        if ($result && mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $img_url = get_image_url($row['image']);
                $title = e($row['title']);
                $category = !empty($row['category']) ? e($row['category']) : 'Aim Images';

                echo '<div class="portfolio-card lightbox-trigger" data-full="' . $img_url . '" data-title="' . $title . '" data-cat="' . $category . '" role="button" tabindex="0" title="Click to view full photo">
                    <img src="' . $img_url . '" alt="' . $title . '" loading="lazy" onerror="this.src=\'images/logo.png\'">
                    <div class="portfolio-overlay">
                        <span class="portfolio-tag">' . $category . '</span>
                        <h4 class="portfolio-name">' . $title . '</h4>
                        <span style="color:var(--gold-bright); font-size:0.75rem; margin-top:4px; font-weight:600;">🔍 View Fullscreen</span>
                    </div>
                </div>';
            }
        } else {
            echo '<div class="no-items-placeholder">
                <h3 style="color:var(--gold); margin-bottom: 10px; font-family:var(--font-heading);">No Photos In This Category Yet</h3>
                <p>We are continuously updating our client gallery. Check back soon or book your session now!</p>
                <div style="margin-top:20px;">
                    <a href="contact.php" class="btn btn-gold btn-sm">Book a Photo Session</a>
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
            Want Your Special Day Featured Here?
        </h2>
        <p style="color: var(--text-sub); margin-bottom: 25px;">
            Let’s collaborate to produce captivating images that you and your loved ones will cherish forever.
        </p>
        <a href="contact.php" class="btn btn-gold">Inquire Now</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>