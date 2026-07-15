<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Aim Images HD Photography</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        nav { background: #000; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
        nav .logo { color: #FFD700; font-size: 1.5em; font-weight: bold; }
        nav ul { list-style: none; display: flex; gap: 30px; }
        nav ul li a { color: #fff; text-decoration: none; }
        nav ul li a:hover { color: #FFD700; }
        .about-section { padding: 60px 40px; max-width: 900px; margin: 0 auto; }
        .about-section h2 { font-size: 2em; margin-bottom: 20px; }
        .about-section p { line-height: 1.8; color: #555; margin-bottom: 20px; font-size: 1.1em; }
        .about-highlights { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
        .highlight-card { background: #000; color: #FFD700; padding: 30px 20px; text-align: center; border-radius: 5px; }
        .highlight-card h3 { font-size: 2em; margin-bottom: 10px; }
        .highlight-card p { color: #fff; font-size: 0.9em; }
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

    <div class="about-section">
        <h2>About Aim Images HD Photography</h2>
        <p>Since 2022, Aim Images HD Photography has been turning moments into memories on the streets of Kabale, Uganda. From weddings to boardrooms, we don't just take photos — we tell your story.</p>
        <p>With God at the center of everything we do, we approach every shoot with professionalism, creativity, and a deep passion for capturing life's most meaningful moments. Our team is dedicated to delivering high quality photography and videography that exceeds your expectations.</p>
        <p>Based on Rugarama Road, Kabale, we serve clients across Uganda and beyond — from intimate portrait sessions to large corporate events and beautiful Kukyara ceremonies.</p>

        <div class="about-highlights">
            <div class="highlight-card">
                <h3>2022</h3>
                <p>Year Founded</p>
            </div>
            <div class="highlight-card">
                <h3>7+</h3>
                <p>Services Offered</p>
            </div>
            <div class="highlight-card">
                <h3>HD</h3>
                <p>Quality Guaranteed</p>
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