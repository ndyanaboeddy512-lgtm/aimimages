<?php
require_once __DIR__ . '/../includes/db.php';

if (!function_exists('clean_input')) {
    function clean_input($data) {
        return trim($data ?? '');
    }
}
if (!function_exists('e')) {
    function e($string) {
        return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
    }
}
if (!function_exists('get_image_url')) {
    function get_image_url($image_path, $prefix = '') {
        if (empty($image_path)) {
            return $prefix . 'images/logo.png';
        }
        if (filter_var($image_path, FILTER_VALIDATE_URL)) {
            return $image_path;
        }
        return $prefix . 'images/' . ltrim($image_path, '/');
    }
}

if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    header('Location: dashboard.php?tab=media');
    exit();
}

// Fetch existing portfolio item
$stmt = mysqli_prepare($conn, "SELECT * FROM portfolio WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);
$item = mysqli_fetch_assoc($res);
mysqli_stmt_close($stmt);

if (!$item) {
    $_SESSION['flash_error'] = "Portfolio photo not found.";
    header('Location: dashboard.php?tab=media');
    exit();
}

$error_msg = '';
$success_msg = '';

$allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];
$allowed_mimes = ['image/jpeg', 'image/png', 'image/webp'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = clean_input($_POST['title']);
    $category = clean_input($_POST['category']);
    $image_url = clean_input($_POST['image_url']);
    $image_final = $item['image'];

    if (empty($title)) {
        $error_msg = "Title cannot be empty.";
    } else {
        // 1. Check if a new external URL is provided
        if (!empty($image_url) && filter_var($image_url, FILTER_VALIDATE_URL)) {
            $image_final = $image_url;
        }
        // 2. Check if a new file is uploaded
        elseif (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $filename = $_FILES['photo']['name'];
            $tmp_name = $_FILES['photo']['tmp_name'];
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

            if (in_array($ext, $allowed_exts)) {
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($finfo, $tmp_name);
                finfo_close($finfo);

                if (in_array($mime, $allowed_mimes)) {
                    $safe_name = uniqid('aim_', true) . '.' . $ext;
                    if (move_uploaded_file($tmp_name, '../images/' . $safe_name)) {
                        // Clean up old local image file if applicable
                        if (!filter_var($item['image'], FILTER_VALIDATE_URL) && file_exists('../images/' . $item['image'])) {
                            @unlink('../images/' . $item['image']);
                        }
                        $image_final = $safe_name;
                    } else {
                        $error_msg = "Failed to save the new uploaded file.";
                    }
                } else {
                    $error_msg = "Invalid image MIME type.";
                }
            } else {
                $error_msg = "Invalid file extension. Allowed: JPG, PNG, WEBP.";
            }
        }

        if (empty($error_msg)) {
            $up = mysqli_prepare($conn, "UPDATE portfolio SET title = ?, category = ?, image = ? WHERE id = ?");
            mysqli_stmt_bind_param($up, "sssi", $title, $category, $image_final, $id);
            if (mysqli_stmt_execute($up)) {
                $_SESSION['flash_success'] = "Portfolio photo updated successfully!";
                header('Location: dashboard.php?tab=media');
                exit();
            } else {
                $error_msg = "Database error updating record.";
            }
            mysqli_stmt_close($up);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Portfolio Item - Aim Images Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0c0d0e;
            --card: #151719;
            --gold: #dfb035;
            --gold-bright: #ffd700;
            --border: rgba(255, 255, 255, 0.08);
            --text: #fff;
            --text-sub: #b0b7c3;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .edit-box {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 35px;
            width: 100%;
            max-width: 550px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.6);
        }
        h2 {
            font-family: 'Cinzel', serif;
            color: var(--gold-bright);
            font-size: 1.35rem;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 12px;
        }
        .preview-wrap {
            text-align: center;
            margin-bottom: 20px;
            background: #090a0b;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid var(--border);
        }
        .preview-img {
            max-height: 200px;
            width: auto;
            border-radius: 6px;
            object-fit: contain;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-size: 0.85rem;
            color: var(--text-sub);
            margin-bottom: 6px;
        }
        input, select {
            width: 100%;
            padding: 11px 14px;
            background: #0e1012;
            border: 1px solid var(--border);
            border-radius: 6px;
            color: #fff;
            font-size: 0.92rem;
            font-family: inherit;
        }
        input:focus, select:focus {
            outline: none;
            border-color: var(--gold);
        }
        .btn {
            display: inline-block;
            padding: 11px 22px;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            border: none;
            font-size: 0.92rem;
        }
        .btn-gold {
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
            color: #000;
        }
        .btn-cancel {
            background: transparent;
            color: var(--text-sub);
            border: 1px solid var(--border);
            margin-left: 10px;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #f87171;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 18px;
            font-size: 0.88rem;
        }
    </style>
</head>
<body>
    <div class="edit-box">
        <h2>✏️ Edit Portfolio Photo</h2>

        <?php if (!empty($error_msg)): ?>
            <div class="alert-error">⚠️ <?php echo e($error_msg); ?></div>
        <?php endif; ?>

        <div class="preview-wrap">
            <img src="<?php echo get_image_url($item['image'], '../'); ?>" alt="Current Image" class="preview-img">
            <p style="font-size:0.78rem; color:var(--text-sub); margin-top:8px;">Current Preview</p>
        </div>

        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Photo Title / Caption *</label>
                <input type="text" id="title" name="title" value="<?php echo e($item['title']); ?>" required>
            </div>

            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" name="category">
                    <?php
                    $cats = ['Wedding', 'Kukyara & Introductions', 'Portrait & Studio', 'Corporate & Events', 'Fashion & Modeling', 'Videography', 'Giveaway', 'Landscape & Travel'];
                    foreach ($cats as $cat):
                    ?>
                        <option value="<?php echo $cat; ?>" <?php echo ($item['category'] === $cat) ? 'selected' : ''; ?>>
                            <?php echo $cat; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="photo">Replace Image File (Upload from Computer)</label>
                <input type="file" id="photo" name="photo" accept="image/*">
            </div>

            <div class="form-group">
                <label for="image_url">Or Replace with Image URL (Web Link)</label>
                <input type="url" id="image_url" name="image_url" placeholder="https://images.unsplash.com/... or https://..." value="<?php echo filter_var($item['image'], FILTER_VALIDATE_URL) ? e($item['image']) : ''; ?>">
                <small style="color:#777; font-size:0.75rem;">Entering a URL will override the local file and is recommended for cloud/Vercel hosting.</small>
            </div>

            <div style="margin-top: 25px;">
                <button type="submit" class="btn btn-gold">Save Changes</button>
                <a href="dashboard.php?tab=media" class="btn btn-cancel">Cancel</a>
            </div>
        </form>
    </div>
</body>
</html>
