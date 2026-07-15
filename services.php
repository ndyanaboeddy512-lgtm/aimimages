<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services - Aim Images HD Photography</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        nav { background: #000; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
        nav .logo { color: #FFD700; font-size: 1.5em; font-weight: bold; }
        nav ul { list-style: none; display: flex; gap: 30px; }
        nav ul li a { color: #fff; text-decoration: none; }
        nav ul li a:hover { color: #FFD700; }
        .services-section { padding: 60px 40px; max-width: 1000px; margin: 0 auto; }
        .services-section h2 { font-size: 2em; margin-bottom: 10px; text-align: center; }
        .services-section p.intro { text-align: center; color: #555; margin-bottom: 40px; }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
        .service-card { background: #000; color: #fff; padding: 35px 25px; border-radius: 5px; text-align: center; }
        .service-card .icon { font-size: 2.5em; margin-bottom: 15px; }
        .service-card h3 { color: #FFD700; margin-bottom: 10px; font-size: 1.1em; }
        .service-card p { font-size: 0.9em; color: #ccc; line-height: 1.6; }
    </style>
</head>
<body>
    <nav>
        <div class="logo">Aim Images</div>
        <ul>
            <li><a href="/aimimages/index.php">Home</a></li>
            <li><a href="/aimimages/about.php">About</a></li>
            <li><a href="/aimimages/services.php">Services</a></li>
            <li><a href="/aimimages/portfolio.php">Portfolio</a></li>
            <li><a href="/aimimages/contact.php">Contact</a></li>
        </ul>
    </nav>

    <div class="services-section">
        <h2>Our Services</h2>
        <p class="intro">Professional photography and videography for every occasion</p>

        <div class="services-grid">
            <div class="service-card">
                <div class="icon">💍</div>
                <h3>Wedding Photography</h3>
                <p>Capturing your special day with elegance and emotion. Every moment preserved forever.</p>
            </div>
            <div class="service-card">
                <div class="icon">🏢</div>
                <h3>Corporate Photography</h3>
                <p>Professional images for your business, events, and corporate identity.</p>
            </div>
            <div class="service-card">
                <div class="icon">🎤</div>
                <h3>Meetings & Events</h3>
                <p>Complete coverage of conferences, seminars, and all official gatherings.</p>
            </div>
            <div class="service-card">
                <div class="icon">🎭</div>
                <h3>Portrait Photography</h3>
                <p>Individual and group portraits that bring out your best personality.</p>
            </div>
            <div class="service-card">
                <div class="icon">🎁</div>
                <h3>Giveaway Photography</h3>
                <p>Covering all your giveaway events with vibrant, high quality shots.</p>
            </div>
            <div class="service-card">
                <div class="icon">💛</div>
                <h3>Kukyara (Introduction)</h3>
                <p>Beautifully documenting the cherished Ugandan introduction ceremony.</p>
            </div>
            <div class="service-card">
                <div class="icon">📸</div>
                <h3>Modeling Photography</h3>
                <p>Creative shoots for models, portfolios, and fashion projects.</p>
            </div>
            <div class="service-card">
                <div class="icon">🎬</div>
                <h3>Videography</h3>
                <p>HD video production for events, commercials, and social media content.</p>
            </div>
        </div>
    </div>
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
</html>