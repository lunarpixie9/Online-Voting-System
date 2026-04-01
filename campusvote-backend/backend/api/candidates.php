<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $name        = trim($data['name']        ?? '');
    $party       = trim($data['party']       ?? '');
    $bio         = trim($data['bio']         ?? '');
    $election_id = intval($data['election_id'] ?? 0);

    if (!$name || !$election_id) {
        echo json_encode(["success" => false, "message" => "Name and election are required"]);
        exit();
    }

    $conn = getDB();
    $stmt = $conn->prepare("INSERT INTO Candidate (name, party, bio, election_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $name, $party, $bio, $election_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Candidate added", "candidate_id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>