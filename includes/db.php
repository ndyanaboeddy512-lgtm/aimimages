<?php
// Database Configuration (Environment variables with local fallback)
$host     = getenv('DB_HOST') ?: "localhost";
$user     = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
$database = getenv('DB_NAME') ?: "aimimages";
$port     = getenv('DB_PORT') ? intval(getenv('DB_PORT')) : 3306;

// Suppress uncaught fatal errors so public pages render gracefully even if database is offline
mysqli_report(MYSQLI_REPORT_OFF);
$conn = @mysqli_connect($host, $user, $password, $database, $port);

if ($conn) {
    mysqli_set_charset($conn, "utf8mb4");
}

// Session startup for auth and notifications
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * XSS prevention helper
 */
function e($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Clean user string input
 */
function clean_input($data) {
    return trim($data ?? '');
}
?>