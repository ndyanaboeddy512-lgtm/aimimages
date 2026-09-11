<?php
require_once '../includes/db.php';

if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit();
}

$admin_username = $_SESSION['admin'];
$success_msg = $_SESSION['flash_success'] ?? '';
$error_msg = $_SESSION['flash_error'] ?? '';
unset($_SESSION['flash_success'], $_SESSION['flash_error']);

// Allowed image extensions and mime types
$allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];
$allowed_mimes = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Safe Image Upload Helper
 */
function handle_safe_upload($file_array, $target_dir, $allowed_exts, $allowed_mimes) {
    if (!isset($file_array) || $file_array['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'No image uploaded or upload error occurred.'];
    }

    $filename = $file_array['name'];
    $tmp_name = $file_array['tmp_name'];
    $filesize = $file_array['size'];

    // 8MB max size
    if ($filesize > 8 * 1024 * 1024) {
        return ['success' => false, 'error' => 'Image exceeds maximum 8MB size limit.'];
    }

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_exts)) {
        return ['success' => false, 'error' => 'Invalid file format. Allowed formats: JPG, PNG, WEBP.'];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $tmp_name);
    finfo_close($finfo);

    if (!in_array($mime, $allowed_mimes)) {
        return ['success' => false, 'error' => 'Uploaded file is not a valid image.'];
    }

    $safe_name = uniqid('aim_', true) . '.' . $ext;
    $destination = rtrim($target_dir, '/\\') . DIRECTORY_SEPARATOR . $safe_name;

    if (move_uploaded_file($tmp_name, $destination)) {
        return ['success' => true, 'filename' => $safe_name];
    }

    return ['success' => false, 'error' => 'Failed to save uploaded file.'];
}

// -------------------------------------------------------------
// POST HANDLERS
// -------------------------------------------------------------

// 1. Add Portfolio Item
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_portfolio'])) {
    $title = clean_input($_POST['title']);
    $category = clean_input($_POST['category']);

    if (empty($title)) {
        $error_msg = "Please enter a photo title.";
    } else {
        $upload_result = handle_safe_upload($_FILES['photo'], '../images', $allowed_exts, $allowed_mimes);
        if ($upload_result['success']) {
            $image_name = $upload_result['filename'];
            $stmt = mysqli_prepare($conn, "INSERT INTO portfolio (title, category, image) VALUES (?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "sss", $title, $category, $image_name);
            if (mysqli_stmt_execute($stmt)) {
                $success_msg = "Portfolio photo uploaded successfully!";
            } else {
                $error_msg = "Database error adding portfolio photo.";
            }
            mysqli_stmt_close($stmt);
        } else {
            $error_msg = $upload_result['error'];
        }
    }
}

// 2. Add Employee / Team Member
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_employee'])) {
    $emp_name = clean_input($_POST['emp_name']);
    $emp_role = clean_input($_POST['emp_role']);
    $emp_bio = clean_input($_POST['emp_bio']);

    if (empty($emp_name)) {
        $error_msg = "Employee name is required.";
    } else {
        $photo_name = null;
        if (isset($_FILES['emp_photo']) && $_FILES['emp_photo']['error'] === UPLOAD_ERR_OK) {
            $upload_result = handle_safe_upload($_FILES['emp_photo'], '../images', $allowed_exts, $allowed_mimes);
            if ($upload_result['success']) {
                $photo_name = $upload_result['filename'];
            } else {
                $error_msg = $upload_result['error'];
            }
        }

        if (empty($error_msg)) {
            $stmt = mysqli_prepare($conn, "INSERT INTO employees (name, role, bio, photo) VALUES (?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "ssss", $emp_name, $emp_role, $emp_bio, $photo_name);
            if (mysqli_stmt_execute($stmt)) {
                $success_msg = "Team member added successfully!";
            } else {
                $error_msg = "Database error saving team member.";
            }
            mysqli_stmt_close($stmt);
        }
    }
}

// 3. Add Custom Service
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_service'])) {
    $service_title = clean_input($_POST['service_title']);
    $service_desc = clean_input($_POST['service_desc']);

    if (empty($service_title)) {
        $error_msg = "Service title is required.";
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO services (title, description) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, "ss", $service_title, $service_desc);
        if (mysqli_stmt_execute($stmt)) {
            $success_msg = "New service added successfully!";
        } else {
            $error_msg = "Database error saving service.";
        }
        mysqli_stmt_close($stmt);
    }
}

// 4. Delete Records (GET Actions)
if (isset($_GET['delete_portfolio'])) {
    $pid = intval($_GET['delete_portfolio']);
    $stmt = mysqli_prepare($conn, "SELECT image FROM portfolio WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $pid);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    if ($row = mysqli_fetch_assoc($res)) {
        if (!empty($row['image']) && file_exists('../images/' . $row['image'])) {
            @unlink('../images/' . $row['image']);
        }
    }
    mysqli_stmt_close($stmt);

    $del = mysqli_prepare($conn, "DELETE FROM portfolio WHERE id = ?");
    mysqli_stmt_bind_param($del, "i", $pid);
    mysqli_stmt_execute($del);
    mysqli_stmt_close($del);
    $success_msg = "Portfolio item deleted.";
}

if (isset($_GET['delete_employee'])) {
    $eid = intval($_GET['delete_employee']);
    $del = mysqli_prepare($conn, "DELETE FROM employees WHERE id = ?");
    mysqli_stmt_bind_param($del, "i", $eid);
    mysqli_stmt_execute($del);
    mysqli_stmt_close($del);
    $success_msg = "Team member removed.";
}

if (isset($_GET['delete_contact'])) {
    $cid = intval($_GET['delete_contact']);
    $del = mysqli_prepare($conn, "DELETE FROM contacts WHERE id = ?");
    mysqli_stmt_bind_param($del, "i", $cid);
    mysqli_stmt_execute($del);
    mysqli_stmt_close($del);
    $success_msg = "Message deleted.";
}

// 5. Change Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $old_pass = $_POST['old_password'] ?? '';
    $new_pass = $_POST['new_password'] ?? '';
    $confirm_pass = $_POST['confirm_password'] ?? '';

    if (empty($old_pass) || empty($new_pass) || empty($confirm_pass)) {
        $error_msg = "All password fields are required.";
    } elseif ($new_pass !== $confirm_pass) {
        $error_msg = "New passwords do not match.";
    } elseif (strlen($new_pass) < 6) {
        $error_msg = "New password must be at least 6 characters long.";
    } else {
        $stmt = mysqli_prepare($conn, "SELECT id, password FROM admin WHERE username = ?");
        mysqli_stmt_bind_param($stmt, "s", $admin_username);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        if ($user = mysqli_fetch_assoc($res)) {
            $match = false;
            if (password_verify($old_pass, $user['password']) || md5($old_pass) === $user['password']) {
                $match = true;
            }

            if ($match) {
                $new_hash = password_hash($new_pass, PASSWORD_DEFAULT);
                $up = mysqli_prepare($conn, "UPDATE admin SET password = ? WHERE id = ?");
                mysqli_stmt_bind_param($up, "si", $new_hash, $user['id']);
                if (mysqli_stmt_execute($up)) {
                    $success_msg = "Admin password updated successfully!";
                } else {
                    $error_msg = "Failed to update password in database.";
                }
                mysqli_stmt_close($up);
            } else {
                $error_msg = "Current password is incorrect.";
            }
        }
        mysqli_stmt_close($stmt);
    }
}

// Fetch System Counts
$total_portfolio = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM portfolio"));
$total_employees = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM employees"));
$total_contacts = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM contacts"));
$total_reviews = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM reviews"));
$pending_reviews_count = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM reviews WHERE approved = 0"));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Aim Images HD Photography</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-body: #0c0d0e;
            --bg-surface: #141619;
            --bg-card: #191c20;
            --gold: #dfb035;
            --gold-bright: #ffd700;
            --border: rgba(255, 255, 255, 0.08);
            --border-gold: rgba(223, 176, 53, 0.3);
            --text: #ffffff;
            --text-sub: #b0b7c3;
            --text-muted: #747c8a;
            --radius: 8px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: var(--bg-body);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            padding-bottom: 60px;
        }

        /* Top Header */
        .admin-nav {
            background: #08090a;
            border-bottom: 1px solid var(--border);
            padding: 14px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .admin-nav .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }
        .admin-nav .brand img {
            height: 40px;
            width: auto;
        }
        .admin-nav .brand span {
            font-family: 'Cinzel', serif;
            color: var(--gold-bright);
            font-size: 1.15rem;
            font-weight: 700;
        }
        .admin-user-group {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .user-tag {
            color: var(--text-sub);
            font-size: 0.88rem;
        }
        .user-tag strong {
            color: var(--gold);
        }
        .view-site-link {
            color: var(--text-sub);
            font-size: 0.85rem;
            text-decoration: none;
            padding: 6px 14px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            transition: all 0.2s;
        }
        .view-site-link:hover {
            color: var(--gold);
            border-color: var(--gold);
        }
        .logout-btn {
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            padding: 6px 14px;
            border-radius: var(--radius);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(239, 68, 68, 0.3);
            transition: all 0.2s;
        }
        .logout-btn:hover {
            background: #ef4444;
            color: #fff;
        }

        /* Container */
        .dashboard-container {
            max-width: 1280px;
            margin: 30px auto;
            padding: 0 24px;
        }

        /* Flash Alerts */
        .alert {
            padding: 14px 18px;
            border-radius: var(--radius);
            margin-bottom: 24px;
            font-size: 0.92rem;
        }
        .alert-success {
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.4);
            color: #4ade80;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #f87171;
        }

        /* Stat Metrics */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 35px;
        }
        .metric-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--gold);
        }
        .metric-num {
            font-family: 'Cinzel', serif;
            font-size: 2.2rem;
            color: var(--gold-bright);
            font-weight: 700;
        }
        .metric-label {
            color: var(--text-muted);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
        }
        .badge-alert {
            background: #e11d48;
            color: #fff;
            font-size: 0.75rem;
            padding: 2px 8px;
            border-radius: 20px;
            margin-left: 6px;
        }

        /* Main Workspace */
        .admin-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 28px;
        }
        .card-panel {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 26px;
            margin-bottom: 28px;
        }
        .card-panel h3 {
            font-family: 'Cinzel', serif;
            color: var(--gold-bright);
            font-size: 1.15rem;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border);
            padding-bottom: 12px;
        }

        /* Forms */
        .form-group {
            margin-bottom: 16px;
        }
        .form-group label {
            display: block;
            font-size: 0.85rem;
            color: var(--text-sub);
            margin-bottom: 6px;
        }
        .form-input, .form-textarea, select.form-input {
            width: 100%;
            padding: 10px 14px;
            background: #0f1113;
            border: 1px solid var(--border);
            border-radius: 6px;
            color: #fff;
            font-family: inherit;
            font-size: 0.9rem;
        }
        .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--gold);
        }
        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }
        .btn-submit {
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
            color: #000;
            border: none;
            font-weight: 700;
            padding: 10px 22px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.35);
        }

        /* Tables & Lists */
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
        }
        .admin-table th {
            background: #111315;
            color: var(--gold);
            text-align: left;
            padding: 10px 12px;
            font-weight: 600;
            border-bottom: 1px solid var(--border);
        }
        .admin-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            color: var(--text-sub);
            vertical-align: top;
        }
        .table-thumb {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
        }

        /* Action Buttons */
        .btn-action {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.78rem;
            font-weight: 600;
            text-decoration: none;
            margin-right: 4px;
        }
        .btn-action-green {
            background: rgba(34, 197, 94, 0.15);
            color: #4ade80;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .btn-action-green:hover { background: #22c55e; color: #000; }
        .btn-action-red {
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .btn-action-red:hover { background: #ef4444; color: #fff; }
        .btn-action-gray {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-sub);
            border: 1px solid var(--border);
        }

        @media (max-width: 900px) {
            .admin-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Top Admin Bar -->
    <header class="admin-nav">
        <a href="dashboard.php" class="brand">
            <img src="../images/logo.png" alt="Aim Images Logo">
            <span>Aim Images Admin</span>
        </a>
        <div class="admin-user-group">
            <a href="../index.php" target="_blank" class="view-site-link">View Live Website &nearr;</a>
            <span class="user-tag">Logged in as <strong><?php echo e($admin_username); ?></strong></span>
            <a href="logout.php" class="logout-btn">Logout</a>
        </div>
    </header>

    <div class="dashboard-container">

        <!-- Flash Messages -->
        <?php if (!empty($success_msg)): ?>
            <div class="alert alert-success">✅ <?php echo e($success_msg); ?></div>
        <?php endif; ?>
        <?php if (!empty($error_msg)): ?>
            <div class="alert alert-error">⚠️ <?php echo e($error_msg); ?></div>
        <?php endif; ?>

        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-num"><?php echo $total_portfolio; ?></div>
                <div class="metric-label">Portfolio Items</div>
            </div>
            <div class="metric-card">
                <div class="metric-num"><?php echo $total_employees; ?></div>
                <div class="metric-label">Team Members</div>
            </div>
            <div class="metric-card">
                <div class="metric-num"><?php echo $total_contacts; ?></div>
                <div class="metric-label">Client Messages</div>
            </div>
            <div class="metric-card">
                <div class="metric-num">
                    <?php echo $total_reviews; ?>
                    <?php if ($pending_reviews_count > 0): ?>
                        <span class="badge-alert"><?php echo $pending_reviews_count; ?> pending</span>
                    <?php endif; ?>
                </div>
                <div class="metric-label">Total Reviews</div>
            </div>
        </div>

        <!-- 2-Column Dashboard Grid -->
        <div class="admin-grid">

            <!-- LEFT COLUMN: Forms -->
            <div>
                <!-- Add Portfolio Item -->
                <div class="card-panel">
                    <h3>📸 Upload Portfolio Photo</h3>
                    <form method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="p_title">Photo Title / Caption *</label>
                            <input type="text" id="p_title" name="title" class="form-input" placeholder="e.g. Traditional Wedding Ceremony" required>
                        </div>
                        <div class="form-group">
                            <label for="p_cat">Category</label>
                            <input type="text" id="p_cat" name="category" class="form-input" placeholder="e.g. Wedding, Portrait, Corporate, Kukyara">
                        </div>
                        <div class="form-group">
                            <label for="p_file">Select Image File (JPG, PNG, WEBP max 8MB) *</label>
                            <input type="file" id="p_file" name="photo" class="form-input" accept="image/*" required>
                        </div>
                        <button type="submit" name="add_portfolio" class="btn-submit">Upload to Gallery</button>
                    </form>
                </div>

                <!-- Add Employee -->
                <div class="card-panel">
                    <h3>👥 Add Team Member</h3>
                    <form method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="e_name">Full Name *</label>
                            <input type="text" id="e_name" name="emp_name" class="form-input" placeholder="e.g. John Bosco" required>
                        </div>
                        <div class="form-group">
                            <label for="e_role">Role / Specialization</label>
                            <input type="text" id="e_role" name="emp_role" class="form-input" placeholder="e.g. Lead Wedding Photographer">
                        </div>
                        <div class="form-group">
                            <label for="e_bio">Brief Bio</label>
                            <textarea id="e_bio" name="emp_bio" class="form-textarea" placeholder="Passionate visual storyteller with 5+ years experience..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="e_photo">Profile Photo (Optional)</label>
                            <input type="file" id="e_photo" name="emp_photo" class="form-input" accept="image/*">
                        </div>
                        <button type="submit" name="add_employee" class="btn-submit">Save Team Member</button>
                    </form>
                </div>

                <!-- Add Custom Service -->
                <div class="card-panel">
                    <h3>⚙️ Add Photography Service</h3>
                    <form method="POST">
                        <div class="form-group">
                            <label for="s_title">Service Title *</label>
                            <input type="text" id="s_title" name="service_title" class="form-input" placeholder="e.g. Drone Aerial Coverage" required>
                        </div>
                        <div class="form-group">
                            <label for="s_desc">Description</label>
                            <textarea id="s_desc" name="service_desc" class="form-textarea" placeholder="Ultra-HD 4K aerial photos and cinematography..."></textarea>
                        </div>
                        <button type="submit" name="add_service" class="btn-submit">Add Service</button>
                    </form>
                </div>

                <!-- Change Admin Password -->
                <div class="card-panel">
                    <h3>🔐 Change Admin Password</h3>
                    <form method="POST">
                        <div class="form-group">
                            <label for="curr_pass">Current Password *</label>
                            <input type="password" id="curr_pass" name="old_password" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="new_pass">New Password (min 6 characters) *</label>
                            <input type="password" id="new_pass" name="new_password" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="conf_pass">Confirm New Password *</label>
                            <input type="password" id="conf_pass" name="confirm_password" class="form-input" required>
                        </div>
                        <button type="submit" name="change_password" class="btn-submit">Update Password</button>
                    </form>
                </div>
            </div>

            <!-- RIGHT COLUMN: Lists & Moderation -->
            <div>
                <!-- Pending & Approved Reviews Moderation -->
                <div class="card-panel" id="reviews-section">
                    <h3>⭐ Review Moderation</h3>
                    
                    <h4 style="font-size: 0.9rem; color: var(--gold); margin-bottom: 12px;">Pending Approvals (<?php echo $pending_reviews_count; ?>)</h4>
                    <?php
                    $pending_reviews = mysqli_query($conn, "SELECT * FROM reviews WHERE approved = 0 ORDER BY created_at DESC");
                    if (mysqli_num_rows($pending_reviews) > 0):
                    ?>
                        <table class="admin-table" style="margin-bottom: 25px;">
                            <thead>
                                <tr>
                                    <th>Client / Rating</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($rev = mysqli_fetch_assoc($pending_reviews)): ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo e($rev['name']); ?></strong><br>
                                            <span style="color:var(--gold-bright);"><?php echo str_repeat('★', intval($rev['rating'] ?: 5)); ?></span>
                                        </td>
                                        <td><?php echo nl2br(e($rev['message'])); ?></td>
                                        <td>
                                            <a href="approve_review.php?id=<?php echo $rev['id']; ?>&action=approve" class="btn-action btn-action-green">Approve</a>
                                            <a href="approve_review.php?id=<?php echo $rev['id']; ?>&action=delete" class="btn-action btn-action-red" onclick="return confirm('Delete this review?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 25px;">No reviews currently awaiting approval.</p>
                    <?php endif; ?>

                    <h4 style="font-size: 0.9rem; color: var(--text-sub); margin-bottom: 12px;">Recently Approved Reviews</h4>
                    <?php
                    $approved_reviews = mysqli_query($conn, "SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT 5");
                    if (mysqli_num_rows($approved_reviews) > 0):
                    ?>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($arev = mysqli_fetch_assoc($approved_reviews)): ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo e($arev['name']); ?></strong><br>
                                            <small style="color:var(--gold-bright);"><?php echo str_repeat('★', intval($arev['rating'] ?: 5)); ?></small>
                                        </td>
                                        <td><?php echo nl2br(e($arev['message'])); ?></td>
                                        <td>
                                            <a href="approve_review.php?id=<?php echo $arev['id']; ?>&action=unapprove" class="btn-action btn-action-gray" title="Mark as pending">Unapprove</a>
                                            <a href="approve_review.php?id=<?php echo $arev['id']; ?>&action=delete" class="btn-action btn-action-red" onclick="return confirm('Delete permanently?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">No approved reviews yet.</p>
                    <?php endif; ?>
                </div>

                <!-- Recent Client Messages / Contacts -->
                <div class="card-panel">
                    <h3>✉️ Recent Client Messages</h3>
                    <?php
                    $contacts = mysqli_query($conn, "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 8");
                    if (mysqli_num_rows($contacts) > 0):
                    ?>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Sender</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($msg = mysqli_fetch_assoc($contacts)): ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo e($msg['name']); ?></strong><br>
                                            <a href="tel:<?php echo e($msg['phone']); ?>" style="font-size:0.8rem;"><?php echo e($msg['phone']); ?></a><br>
                                            <a href="mailto:<?php echo e($msg['email']); ?>" style="font-size:0.8rem;"><?php echo e($msg['email']); ?></a>
                                        </td>
                                        <td>
                                            <?php echo nl2br(e($msg['message'])); ?><br>
                                            <small style="color:var(--text-muted);"><?php echo date('M d, Y H:i', strtotime($msg['created_at'])); ?></small>
                                        </td>
                                        <td>
                                            <a href="dashboard.php?delete_contact=<?php echo $msg['id']; ?>" class="btn-action btn-action-red" onclick="return confirm('Delete message?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">No inquiries received yet.</p>
                    <?php endif; ?>
                </div>

                <!-- Manage Portfolio Items -->
                <div class="card-panel">
                    <h3>🖼️ Current Gallery Photos (Latest 8)</h3>
                    <?php
                    $portfolio_items = mysqli_query($conn, "SELECT * FROM portfolio ORDER BY created_at DESC LIMIT 8");
                    if (mysqli_num_rows($portfolio_items) > 0):
                    ?>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Preview</th>
                                    <th>Title & Category</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($pi = mysqli_fetch_assoc($portfolio_items)): ?>
                                    <tr>
                                        <td>
                                            <img src="../images/<?php echo e($pi['image']); ?>" alt="Thumbnail" class="table-thumb" onerror="this.src='../images/logo.png'">
                                        </td>
                                        <td>
                                            <strong><?php echo e($pi['title']); ?></strong><br>
                                            <span style="color:var(--gold); font-size:0.8rem;"><?php echo e($pi['category']); ?></span>
                                        </td>
                                        <td>
                                            <a href="dashboard.php?delete_portfolio=<?php echo $pi['id']; ?>" class="btn-action btn-action-red" onclick="return confirm('Delete this photo from gallery?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">No photos uploaded yet.</p>
                    <?php endif; ?>
                </div>

                <!-- Manage Team Members -->
                <div class="card-panel">
                    <h3>👥 Current Team Members</h3>
                    <?php
                    $emps = mysqli_query($conn, "SELECT * FROM employees ORDER BY created_at DESC");
                    if (mysqli_num_rows($emps) > 0):
                    ?>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name & Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($emp = mysqli_fetch_assoc($emps)): ?>
                                    <tr>
                                        <td>
                                            <?php if (!empty($emp['photo'])): ?>
                                                <img src="../images/<?php echo e($emp['photo']); ?>" alt="Photo" class="table-thumb">
                                            <?php else: ?>
                                                <div style="width:50px;height:50px;background:#222;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#666;">👤</div>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <strong><?php echo e($emp['name']); ?></strong><br>
                                            <span style="color:var(--gold); font-size:0.8rem;"><?php echo e($emp['role']); ?></span>
                                        </td>
                                        <td>
                                            <a href="dashboard.php?delete_employee=<?php echo $emp['id']; ?>" class="btn-action btn-action-red" onclick="return confirm('Remove this team member?');">Delete</a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">No team members registered yet.</p>
                    <?php endif; ?>
                </div>

            </div>

        </div>

    </div>

</body>
</html>