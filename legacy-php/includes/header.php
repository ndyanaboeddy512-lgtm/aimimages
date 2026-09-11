<?php
if (!isset($page_title)) {
    $page_title = "Aim Images HD Photography - With God We Always Work Professionally";
}
if (!isset($current_page)) {
    $current_page = basename($_SERVER['PHP_SELF']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <meta name="description" content="Aim Images HD Photography - Professional photography and videography in Kabale, Uganda. Weddings, corporate, portraits, and events.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="site-header">
        <nav class="navbar">
            <a href="index.php" class="brand-logo">
                <img src="images/logo.png" alt="Aim Images HD Photography Logo" class="logo-img">
                <div class="brand-text-group">
                    <span class="brand-title">AIM IMAGES</span>
                    <span class="brand-sub">HD PHOTOGRAPHY</span>
                </div>
            </a>
            
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle Navigation Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="nav-links" id="navLinks">
                <li><a href="index.php" class="<?php echo ($current_page == 'index.php') ? 'active' : ''; ?>">Home</a></li>
                <li><a href="about.php" class="<?php echo ($current_page == 'about.php') ? 'active' : ''; ?>">About</a></li>
                <li><a href="services.php" class="<?php echo ($current_page == 'services.php') ? 'active' : ''; ?>">Services</a></li>
                <li><a href="portfolio.php" class="<?php echo ($current_page == 'portfolio.php') ? 'active' : ''; ?>">Portfolio</a></li>
                <li><a href="contact.php" class="<?php echo ($current_page == 'contact.php') ? 'active' : ''; ?>">Contact</a></li>
                <li><a href="contact.php" class="nav-cta">Book Session</a></li>
            </ul>
        </nav>
    </header>
