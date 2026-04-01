<?php
require_once '../config/db.php';

$conn = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data        = json_decode(file_get_contents("php://input"), true);
    $title       = trim($data['title']       ?? '');
    $description = trim($data['description'] ?? '');
    $start_date  = trim($data['start_date']  ?? '');
    $end_date    = trim($data['end_date']    ?? '');
    $admin_id    = intval($data['admin_id']  ?? 1);

    if (!$title || !$start_date || !$end_date) {
        echo json_encode(["success" => false, "message" => "Title and dates are required"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO Election (title, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, 'upcoming', ?)");
    $stmt->bind_param("ssssi", $title, $description, $start_date, $end_date, $admin_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Election created", "election_id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} elseif (isset($_GET['election_id'])) {
    $election_id = intval($_GET['election_id']);
    $stmt = $conn->prepare("SELECT candidate_id, name, party, bio, election_id FROM Candidate WHERE election_id = ?");
    $stmt->bind_param("i", $election_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $candidates = [];
    while ($row = $result->fetch_assoc()) $candidates[] = $row;
    echo json_encode(["success" => true, "candidates" => $candidates]);
    $stmt->close();
    $conn->close();

} else {
    $result = $conn->query("SELECT * FROM Election ORDER BY created_at DESC");
    $elections = [];
    while ($row = $result->fetch_assoc()) $elections[] = $row;
    echo json_encode(["success" => true, "elections" => $elections]);
    $conn->close();
}
?>