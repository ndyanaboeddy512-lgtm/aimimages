<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - Aim Images HD Photography</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        nav { background: #000; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
        nav .logo { color: #FFD700; font-size: 1.5em; font-weight: bold; }
        nav ul { list-style: none; display: flex; gap: 30px; }
        nav ul li a { color: #fff; text-decoration: none; }
        nav ul li a:hover { color: #FFD700; }
        .portfolio-section { padding: 60px 40px; max-width: 1100px; margin: 0 auto; }
        .portfolio-section h2 { font-size: 2em; text-align: center; margin-bottom: 10px; }
        .portfolio-section p.intro { text-align: center; color: #555; margin-bottom: 40px; }
        .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .portfolio-item { position: relative; overflow: hidden; border-radius: 5px; background: #111; height: 250px; }
        .portfolio-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .portfolio-item:hover img { transform: scale(1.05); }
        .portfolio-item .overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: #FFD700; padding: 15px; transform: translateY(100%); transition: transform 0.3s; }
        .portfolio-item:hover .overlay { transform: translateY(0); }
        .no-photos { text-align: center; color: #555; padding: 60px; font-size: 1.1em; }
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

    <div class="portfolio-section">
        <h2>Our Portfolio</h2>
        <p class="intro">A glimpse of the moments we have captured</p>

        <div class="portfolio-grid">
            <?php
            $sql = "SELECT * FROM portfolio ORDER BY created_at DESC";
            $result = mysqli_query($conn, $sql);
            if(mysqli_num_rows($result) > 0) {
                while($row = mysqli_fetch_assoc($result)) {
                    echo '<div class="portfolio-item">
                        <img src="images/'.$row['image'].'" alt="'.$row['title'].'">
                        <div class="overlay">'.$row['title'].'</div>
                    </div>';
                }
            } else {
                echo '<div class="no-photos" style="grid-column: span 3;">Portfolio photos coming soon. Check back later!</div>';
            }
            ?>
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