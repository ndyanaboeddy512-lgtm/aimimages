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

if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$action = isset($_GET['action']) ? clean_input($_GET['action']) : 'approve';

if ($id > 0) {
    if ($action === 'approve') {
        $stmt = mysqli_prepare($conn, "UPDATE reviews SET approved = 1 WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['flash_success'] = "Review approved successfully!";
        } else {
            $_SESSION['flash_error'] = "Failed to approve review.";
        }
        mysqli_stmt_close($stmt);
    } elseif ($action === 'unapprove') {
        $stmt = mysqli_prepare($conn, "UPDATE reviews SET approved = 0 WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['flash_success'] = "Review set back to pending.";
        } else {
            $_SESSION['flash_error'] = "Failed to update review status.";
        }
        mysqli_stmt_close($stmt);
    } elseif ($action === 'delete') {
        $stmt = mysqli_prepare($conn, "DELETE FROM reviews WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['flash_success'] = "Review deleted successfully.";
        } else {
            $_SESSION['flash_error'] = "Failed to delete review.";
        }
        mysqli_stmt_close($stmt);
    }
}

header('Location: dashboard.php#reviews-section');
exit();
?>
