<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// api/vote.php — Cast a Vote (one per election per voter)
require_once '../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data         = json_decode(file_get_contents("php://input"), true);
$voter_id     = intval($data['voter_id']     ?? 0);
$candidate_id = intval($data['candidate_id'] ?? 0);
$election_id  = intval($data['election_id']  ?? 0);

if (!$voter_id || !$candidate_id || !$election_id) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$conn = getDB();

// Check if voter already voted in this election
$check = $conn->prepare("SELECT vote_id FROM Vote WHERE voter_id = ? AND election_id = ?");
$check->bind_param("ii", $voter_id, $election_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "You have already voted in this election"]);
    $check->close(); $conn->close(); exit();
}
$check->close();

// Check election is active
$elec = $conn->prepare("SELECT status FROM Election WHERE election_id = ?");
$elec->bind_param("i", $election_id);
$elec->execute();
$elecResult = $elec->get_result()->fetch_assoc();
$elec->close();

if (!$elecResult || $elecResult['status'] !== 'active') {
    echo json_encode(["success" => false, "message" => "This election is not currently active"]);
    $conn->close(); exit();
}

// Cast vote
$stmt = $conn->prepare("INSERT INTO Vote (voter_id, candidate_id, election_id) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $voter_id, $candidate_id, $election_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Vote cast successfully!"]);
} else {
    // Duplicate entry error (constraint triggered)
    if ($conn->errno === 1062) {
        echo json_encode(["success" => false, "message" => "You have already voted in this election"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to cast vote: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
