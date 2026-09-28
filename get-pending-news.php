<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('GET');
requireAdmin();

$pdo = getDatabaseConnection();
$status = $_GET['status'] ?? 'pending';
if (!is_string($status) || !in_array($status, ['all', 'pending', 'approved', 'rejected'], true)) {
    jsonResponse(400, false, 'Invalid status filter.');
}
$stats = $pdo->query(
    "SELECT COUNT(*) AS total,
            SUM(status = 'pending') AS pending,
            SUM(status = 'approved') AS published,
            SUM(status = 'rejected') AS rejected
     FROM news"
)->fetch();

$sql = "SELECT n.id, n.user_id, n.title, n.category, n.source_url, n.image,
            n.content, n.premise_p, n.premise_q, n.status, n.created_at,
            u.name AS sender, u.email AS sender_email
     FROM news n
     INNER JOIN users u ON u.id = n.user_id";
$params = [];
if ($status !== 'all') {
    $sql .= ' WHERE n.status = :status';
    $params['status'] = $status;
}
$sql .= ' ORDER BY n.created_at DESC, n.id DESC';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$stories = $stmt->fetchAll();
foreach ($stories as &$story) {
    $story['id'] = (int) $story['id'];
}
unset($story);

jsonResponse(200, true, 'Pending submissions loaded.', [
    'stats' => [
        'total' => (int) ($stats['total'] ?? 0),
        'pending' => (int) ($stats['pending'] ?? 0),
        'published' => (int) ($stats['published'] ?? 0),
        'rejected' => (int) ($stats['rejected'] ?? 0),
    ],
    'news' => $stories,
]);
} catch (Throwable $error) {
    error_log('InfoLogika get-pending-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
