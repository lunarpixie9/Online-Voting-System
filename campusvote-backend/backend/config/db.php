<?php
// ─────────────────────────────────────────
// Database Configuration
// Place this file in XAMPP's htdocs/voting-backend/config/
// ─────────────────────────────────────────

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           // default XAMPP password is empty
define('DB_NAME', 'voting_system');

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode([
            "success" => false,
            "message" => "Database connection failed: " . $conn->connect_error
        ]));
    }

    return $conn;
}

// Allow cross-origin requests from React dev server
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
