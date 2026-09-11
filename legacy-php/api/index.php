<?php
/**
 * Vercel Serverless Function Router for Aim Images HD Photography
 */

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = urldecode($uri);

// Remove leading slash
$path = ltrim($uri, '/');

// If root path or empty, route to index.php
if (empty($path)) {
    $path = 'index.php';
}

// Base directory is the project root (one level up from api/)
$project_root = dirname(__DIR__);
$target_file = $project_root . '/' . $path;

// Support clean URLs without .php extension
if (!file_exists($target_file) && file_exists($target_file . '.php')) {
    $target_file .= '.php';
}

// Execute the requested PHP script
if (file_exists($target_file) && !is_dir($target_file) && pathinfo($target_file, PATHINFO_EXTENSION) === 'php') {
    chdir(dirname($target_file));
    require $target_file;
    exit();
}

// Fallback: Default to home page
chdir($project_root);
require $project_root . '/index.php';
