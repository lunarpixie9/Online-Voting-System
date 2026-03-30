<?php
// api/elections.php — Get all elections (and candidates for a specific one)
require_once '../config/db.php';

$conn = getDB();

if (isset($_GET['election_id'])) {
    // Get candidates for a specific election
    $election_id = intval($_GET['election_id']);

    $stmt = $conn->prepare("
        SELECT c.candidate_id, c.name, c.party, c.bio
        FROM Candidate c
        WHERE c.election_id = ?
    ");
    $stmt->bind_param("i", $election_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $candidates = [];
    while ($row = $result->fetch_assoc()) {
        $candidates[] = $row;
    }

    echo json_encode(["success" => true, "candidates" => $candidates]);
    $stmt->close();

} else {
    // Get all elections
    $result = $conn->query("SELECT * FROM Election ORDER BY created_at DESC");
    $elections = [];
    while ($row = $result->fetch_assoc()) {
        $elections[] = $row;
    }
    echo json_encode(["success" => true, "elections" => $elections]);
}

$conn->close();
