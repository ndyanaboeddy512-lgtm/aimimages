<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aim Images Photography</title>
    <style>
* { margin: 0; padding: 0; box-sizing: border-box; }
nav { background: #000; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
nav .logo { color: #FFD700; font-size: 1.5em; font-weight: bold; }
nav ul { list-style: none; display: flex; gap: 30px; }
nav ul li a { color: #fff; text-decoration: none; }
nav ul li a:hover { color: #FFD700; }
.hero { background: #111; height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; }
.hero-text h1 { font-size: 3em; color: #FFD700; margin-bottom: 15px; }
.hero-text p { margin-bottom: 30px; }
.btn { background: #FFD700; color: #000; padding: 12px 35px; text-decoration: none; font-weight: bold; }
.services-preview { padding: 60px 40px; text-align: center; background: #f9f9f9; }
.services-preview h2 { font-size: 2em; margin-bottom: 40px; }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; margin: 0 auto; }
.service-card { background: #000; color: #FFD700; padding: 30px 20px; font-weight: bold; border-radius: 5px; }
/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        padding: 15px 20px;
        gap: 15px;
    }
    nav ul {
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
    }
    .hero-text h1 {
        font-size: 1.8em;
    }
    .services-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .services-grid {
        grid-template-columns: 1fr;
    }
    .hero-text h1 {
        font-size: 1.4em;
    }
}
</style>
</head>
<body>

    <!-- NAVIGATION -->
    <nav>
        <div class="logo">
<img src="/aimimages/images/logo.png" alt="Aim Images HD Photography" style="height:50px; width:auto; filter: brightness(0) invert(1);">
        </div>
</div>
        <ul>
            <li><a href="/aimimages/index.php">Home</a></li>
            <li><a href="/aimimages/about.php">About</a></li>
            <li><a href="/aimimages/services.php">Services</a></li>
            <li><a href="/aimimages/portfolio.php">Portfolio</a></li>
            <li><a href="/aimimages/contact.php">Contact</a></li>
        </ul>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero">
        <div class="hero-text">
            <h1>Aim Images HD Photography</h1>
            <p>With God We Always Work Professionally</p>
            <a href="contact.php" class="btn">Book Us Now</a>
        </div>
    </section>

    <!-- SERVICES PREVIEW -->
    <section class="services-preview">
        <h2>What We Do</h2>
        <div class="services-grid">
            <div class="service-card">Wedding Photography</div>
            <div class="service-card">Corporate Photography</div>
            <div class="service-card">Portrait</div>
            <div class="service-card">Videography</div>
            <div class="service-card">Modeling</div>
            <div class="service-card">Kukyara</div>
        </div>
    </section>

    <script src="js/main.js"></script>
    <footer style="background:#000; color:#fff; padding:40px; text-align:center;">
    <div style="margin-bottom:20px;">
        <img src="/aimimages/images/logo.png" style="height:60px; width:auto;">
    </div>
    <p style="color:#FFD700; font-size:1.1em; margin-bottom:10px;">Aim Images HD Photography</p>
    <p style="color:#aaa; margin-bottom:5px;">📍 Rugarama Road, Kabale, Uganda</p>
    <p style="color:#aaa; margin-bottom:5px;">📞 +256 764 709 563</p>
    <p style="color:#aaa; margin-bottom:20px;">✉️ aimugimages@gmail.com</p>
    <div style="margin-bottom:20px;">
        <a href="https://instagram.com/aimimages_hd_photography" style="color:#FFD700; margin:0 10px; text-decoration:none;">Instagram</a>
        <a href="https://youtube.com/@AimImagesphotography" style="color:#FFD700; margin:0 10px; text-decoration:none;">YouTube</a>
    </div>
    <p style="color:#555; font-size:0.85em;">© 2024 Aim Images HD Photography. All rights reserved.</p>
</footer>
<!-- WhatsApp Floating Button -->
<a href="https://wa.me/256764709563" target="_blank" 
style="
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #25D366;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    text-decoration: none;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    z-index: 9999;
">💬</a>
</body>
</html>c