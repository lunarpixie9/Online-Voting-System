<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$mobile   = trim($data['mobile']   ?? '');
$password = trim($data['password'] ?? '');

if (!$name || !$email || !$mobile || !$password) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit();
}

if (!preg_match('/^[6-9]\d{9}$/', $mobile)) {
    echo json_encode(["success" => false, "message" => "Invalid mobile number"]);
    exit();
}

$conn = getDB();

// Check duplicate in RegisteredUser
$check = $conn->prepare("SELECT user_id FROM RegisteredUser WHERE email = ? OR mobile = ?");
$check->bind_param("ss", $email, $mobile);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email or mobile already registered"]);
    $check->close(); $conn->close(); exit();
}
$check->close();

// Insert into RegisteredUser
$hashed = password_hash($password, PASSWORD_BCRYPT);
$stmt = $conn->prepare("INSERT INTO RegisteredUser (name, email, mobile, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $mobile, $hashed);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "user_id" => $conn->insert_id
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();