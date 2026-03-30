<?php
// api/results.php — Get election results
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$election_id = intval($_GET['election_id'] ?? 0);

if (!$election_id) {
    echo json_encode(["success" => false, "message" => "Election ID required"]);
    exit();
}

$conn = getDB();

// Get election info
$elec = $conn->prepare("SELECT title, status, start_date, end_date FROM Election WHERE election_id = ?");
$elec->bind_param("i", $election_id);
$elec->execute();
$election = $elec->get_result()->fetch_assoc();
$elec->close();

if (!$election) {
    echo json_encode(["success" => false, "message" => "Election not found"]);
    $conn->close(); exit();
}

// Get vote counts per candidate
$stmt = $conn->prepare("
    SELECT c.candidate_id, c.name, c.party, COUNT(v.vote_id) AS vote_count
    FROM Candidate c
    LEFT JOIN Vote v ON c.candidate_id = v.candidate_id AND v.election_id = ?
    WHERE c.election_id = ?
    GROUP BY c.candidate_id, c.name, c.party
    ORDER BY vote_count DESC
");
$stmt->bind_param("ii", $election_id, $election_id);
$stmt->execute();
$result = $stmt->get_result();

$candidates = [];
$total_votes = 0;

while ($row = $result->fetch_assoc()) {
    $candidates[] = $row;
    $total_votes += $row['vote_count'];
}

// Add percentage to each candidate
foreach ($candidates as &$c) {
    $c['percentage'] = $total_votes > 0
        ? round(($c['vote_count'] / $total_votes) * 100, 1)
        : 0;
}

echo json_encode([
    "success"     => true,
    "election"    => $election,
    "candidates"  => $candidates,
    "total_votes" => $total_votes
]);

$stmt->close();
$conn->close();
