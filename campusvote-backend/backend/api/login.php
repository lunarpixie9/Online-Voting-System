<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// api/login.php — Login for Voter and Admin
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data  = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email']    ?? '');
$pass  = trim($data['password'] ?? '');
$role  = trim($data['role']     ?? 'voter'); // 'voter' or 'admin'

if (!$email || !$pass) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit();
}

$conn = getDB();

if ($role === 'admin') {
    $stmt = $conn->prepare("SELECT admin_id, name, password FROM Admin WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Admin not found"]);
        $stmt->close(); $conn->close(); exit();
    }

    $user = $result->fetch_assoc();

    if (!password_verify($pass, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
        $stmt->close(); $conn->close(); exit();
    }

    echo json_encode([
        "success"  => true,
        "role"     => "admin",
        "admin_id" => $user['admin_id'],
        "name"     => $user['name'],
        "email"    => $email
    ]);

} else {
    $stmt = $conn->prepare("SELECT voter_id, name, password FROM Voter WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Voter not found"]);
        $stmt->close(); $conn->close(); exit();
    }

    $user = $result->fetch_assoc();

    if (!password_verify($pass, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
        $stmt->close(); $conn->close(); exit();
    }

    echo json_encode([
        "success"   => true,
        "role"      => "voter",
        "voter_id"  => $user['voter_id'],
        "name"      => $user['name'],
        "email"     => $email
    ]);
}

$stmt->close();
$conn->close();
