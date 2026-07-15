
<?php
session_start();
include '../includes/db.php';
if(!isset($_SESSION['admin'])) {
    header('Location: /aimimages/admin/login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Aim Images</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        body { background: #f4f4f4; }
        .topbar { background: #000; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .topbar h1 { color: #FFD700; font-size: 1.3em; }
        .topbar a { color: #fff; text-decoration: none; font-size: 0.9em; }
        .topbar a:hover { color: #FFD700; }
        .dashboard { padding: 30px; }
        .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .card { background: #000; color: #FFD700; padding: 25px; border-radius: 5px; text-align: center; }
        .card h2 { font-size: 2em; }
        .card p { color: #fff; font-size: 0.9em; margin-top: 5px; }
        .sections { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .section-box { background: #fff; padding: 25px; border-radius: 5px; }
        .section-box h3 { margin-bottom: 15px; border-bottom: 2px solid #FFD700; padding-bottom: 10px; }
        .btn { display: inline-block; background: #FFD700; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 3px; margin-top: 10px; }
        .btn-red { background: #e74c3c; color: #fff; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table th { background: #000; color: #FFD700; padding: 10px; text-align: left; }
        table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="topbar">
        <div style="display:flex; align-items:center; gap:15px;">
    <img src="/aimimages/images/logo.png" style="height:45px; width:auto;">
    <h1>Aim Images Admin Panel</h1>
</div>
        <div>
            <span style="color:#FFD700; margin-right:20px;">Welcome, <?php echo $_SESSION['admin']; ?></span>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <div class="dashboard">
        <?php
        $total_portfolio = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM portfolio"));
        $total_employees = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM employees"));
        $total_contacts = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM contacts"));
        $total_reviews = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM reviews"));
        ?>
        <div class="cards">
            <div class="card"><h2><?php echo $total_portfolio; ?></h2><p>Portfolio Photos</p></div>
            <div class="card"><h2><?php echo $total_employees; ?></h2><p>Team Members</p></div>
            <div class="card"><h2><?php echo $total_contacts; ?></h2><p>Messages</p></div>
            <div class="card"><h2><?php echo $total_reviews; ?></h2><p>Reviews</p></div>
        </div>

        <div class="sections">
            <div class="section-box">
                <h3>📸 Add Portfolio Photo</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="text" name="title" placeholder="Photo Title" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
                    <input type="text" name="category" placeholder="Category (e.g. Wedding)" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
                    <input type="file" name="photo" style="margin-bottom:10px;">
                    <br>
                    <button type="submit" name="add_portfolio" class="btn">Upload Photo</button>
                </form>
                <?php
                if(isset($_POST['add_portfolio'])) {
                    $title = $_POST['title'];
                    $category = $_POST['category'];
                    $photo = $_FILES['photo']['name'];
                    move_uploaded_file($_FILES['photo']['tmp_name'], '../images/'.$photo);
                    mysqli_query($conn, "INSERT INTO portfolio (title, category, image) VALUES ('$title', '$category', '$photo')");
                    echo '<p style="color:green;margin-top:10px;">Photo uploaded successfully!</p>';
                }
                ?>
            </div>

            <div class="section-box">
                <h3>👥 Add Employee</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="text" name="emp_name" placeholder="Full Name" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
                    <input type="text" name="emp_role" placeholder="Role/Position" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
                    <textarea name="emp_bio" placeholder="Short Bio" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;height:80px;"></textarea>
                    <input type="file" name="emp_photo" style="margin-bottom:10px;">
                    <br>
                    <button type="submit" name="add_employee" class="btn">Add Employee</button>
                </form>
                <?php
                if(isset($_POST['add_employee'])) {
                    $name = $_POST['emp_name'];
                    $role = $_POST['emp_role'];
                    $bio = $_POST['emp_bio'];
                    $photo = $_FILES['emp_photo']['name'];
                    move_uploaded_file($_FILES['emp_photo']['tmp_name'], '../images/'.$photo);
                    mysqli_query($conn, "INSERT INTO employees (name, role, bio, photo) VALUES ('$name', '$role', '$bio', '$photo')");
                    echo '<p style="color:green;margin-top:10px;">Employee added successfully!</p>';
                }
                ?>
            </div>

            <div class="section-box">
                <h3>💬 Recent Messages</h3>
                <?php
                $contacts = mysqli_query($conn, "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5");
                if(mysqli_num_rows($contacts) > 0) {
                    echo '<table><tr><th>Name</th><th>Phone</th><th>Message</th></tr>';
                    while($row = mysqli_fetch_assoc($contacts)) {
                        echo '<tr><td>'.$row['name'].'</td><td>'.$row['phone'].'</td><td>'.substr($row['message'],0,50).'...</td></tr>';
                    }
                    echo '</table>';
                } else {
                    echo '<p style="color:#555;">No messages yet.</p>';
                }
                ?>
            </div>

            <div class="section-box">
                <h3>⭐ Pending Reviews</h3>
                <?php
                $reviews = mysqli_query($conn, "SELECT * FROM reviews WHERE approved=0 ORDER BY created_at DESC");
                if(mysqli_num_rows($reviews) > 0) {
                    while($row = mysqli_fetch_assoc($reviews)) {
                        echo '<p><strong>'.$row['name'].'</strong>: '.substr($row['message'],0,80).'</p>';
                        echo '<a href="approve_review.php?id='.$row['id'].'" class="btn" style="font-size:0.8em;padding:5px 10px;">Approve</a> ';
                        echo '<br><br>';
                    }
                } else {
                    echo '<p style="color:#555;">No pending reviews.</p>';
                }
                ?>
            </div>
        </div>
    </div>
    <div class="section-box" style="margin-top:20px;">
    <h3>🔐 Change Password</h3>
    <form method="POST">
        <input type="password" name="old_password" placeholder="Current Password" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
        <input type="password" name="new_password" placeholder="New Password" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
        <input type="password" name="confirm_password" placeholder="Confirm New Password" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ccc;">
        <button type="submit" name="change_password" class="btn">Update Password</button>
    </form>
    <?php
    if(isset($_POST['change_password'])) {
        $old = md5($_POST['old_password']);
        $new = $_POST['new_password'];
        $confirm = $_POST['confirm_password'];
        $check = mysqli_query($conn, "SELECT * FROM admin WHERE password='$old'");
        if(mysqli_num_rows($check) == 1) {
            if($new == $confirm) {
                mysqli_query($conn, "UPDATE admin SET password=MD5('$new') WHERE password='$old'");
                echo '<p style="color:green;margin-top:10px;">Password updated successfully!</p>';
            } else {
                echo '<p style="color:red;margin-top:10px;">New passwords do not match!</p>';
            }
        } else {
            echo '<p style="color:red;margin-top:10px;">Current password is wrong!</p>';
        }
    }
    ?>
</div>
</body>
</html>