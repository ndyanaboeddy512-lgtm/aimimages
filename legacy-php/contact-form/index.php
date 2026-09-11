<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aim Images - Simple Contact Form</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body style="padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
    <div style="background: #191c20; padding: 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 400px;">
        <h2 style="color: #ffd700; margin-bottom: 20px;">Simple Contact Form</h2>
        <form action="process.php" method="POST">
            <label for="name" style="display:block; margin-bottom: 8px; color: #ccc;">Name:</label>
            <input type="text" name="name" id="name" required style="width: 100%; padding: 10px; background: #0f1113; border: 1px solid #333; color: #fff; border-radius: 4px; margin-bottom: 15px;">
            <button type="submit" name="submit" style="background: #ffd700; color: #000; font-weight: bold; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;">Submit</button>
        </form>
    </div>
</body>
</html>