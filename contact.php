<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Aim Images HD Photography</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        nav { background: #000; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
        nav .logo { color: #FFD700; font-size: 1.5em; font-weight: bold; }
        nav ul { list-style: none; display: flex; gap: 30px; }
        nav ul li a { color: #fff; text-decoration: none; }
        nav ul li a:hover { color: #FFD700; }
        .contact-section { padding: 60px 40px; max-width: 700px; margin: 0 auto; }
        .contact-section h2 { font-size: 2em; margin-bottom: 10px; }
        .contact-info { margin-bottom: 40px; color: #555; }
        .contact-info p { margin: 8px 0; }
        .contact-form input, .contact-form textarea {
            width: 100%; padding: 12px; margin-bottom: 15px;
            border: 1px solid #ccc; border-radius: 4px; font-size: 1em;
        }
        .contact-form textarea { height: 150px; }
        .btn { background: #FFD700; color: #000; padding: 12px 35px; border: none; font-weight: bold; cursor: pointer; font-size: 1em; }
        .success { background: #d4edda; color: #155724; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
    </style>
</head>
<body>
    <nav>
        <div class="logo">Aim Images</div>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="about.php">About</a></li>
            <li><a href="services.php">Services</a></li>
            <li><a href="portfolio.php">Portfolio</a></li>
            <li><a href="contact.php">Contact</a></li>
        </ul>
    </nav>

    <div class="contact-section">
        <h2>Contact Us</h2>
        <div class="contact-info">
            <p>📍 Rugarama Road, Kabale, Uganda</p>
            <p>📞 +256 764 709 563</p>
            <p>✉️ aimugimages@gmail.com</p>
            <p>📸 Instagram: @aimimages_hd_photography</p>
            <p>▶️ YouTube: @AimImagesphotography</p>
        </div>

        <?php
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $name = $_POST['name'];
            $email = $_POST['email'];
            $phone = $_POST['phone'];
            $message = $_POST['message'];
            $sql = "INSERT INTO contacts (name, email, phone, message) VALUES ('$name', '$email', '$phone', '$message')";
            if(mysqli_query($conn, $sql)) {
                echo '<div class="success">Message sent! We will get back to you soon.</div>';
            }
        }
        ?>

        <div class="contact-form">
            <form method="POST">
                <input type="text" name="name" placeholder="Your Name" required>
                <input type="email" name="email" placeholder="Your Email" required>
                <input type="text" name="phone" placeholder="Your Phone Number">
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit" class="btn">Send Message</button>
            </form>
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