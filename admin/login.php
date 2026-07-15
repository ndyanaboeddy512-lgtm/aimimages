<?php
session_start();
include '../includes/db.php';

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = md5($_POST['password']);
    $sql = "SELECT * FROM admin WHERE username='$username' AND password='$password'";
    $result = mysqli_query($conn, $sql);
if(mysqli_num_rows($result) == 1) {
        $_SESSION['admin'] = $username;
        header('Location: /aimimages/admin/dashboard.php');
        exit();
    } else {
        $error = "Invalid username or password!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login - Aim Images</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        body { background: #111; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .login-box { background: #fff; padding: 40px; width: 350px; border-radius: 8px; }
        .login-box h2 { text-align: center; margin-bottom: 25px; }
        input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
        button { width: 100%; padding: 12px; background: #FFD700; border: none; font-weight: bold; font-size: 1em; cursor: pointer; }
        .error { color: red; margin-bottom: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Admin Login</h2>
        <?php if(isset($error)) echo "<p class='error'>$error</p>"; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>