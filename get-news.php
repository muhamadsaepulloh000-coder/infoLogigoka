<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('GET');

$pdo = getDatabaseConnection();
$stmt = $pdo->query(
    "SELECT n.id, n.title, n.category, n.source_url, n.image, n.content,
            n.premise_p, n.premise_q, n.created_at, u.name AS sender
     FROM news n
     INNER JOIN users u ON u.id = n.user_id
     WHERE n.status = 'approved'
     ORDER BY n.created_at DESC, n.id DESC"
);
$news = $stmt->fetchAll();

foreach ($news as &$item) {
    $item['id'] = (int) $item['id'];
}
unset($item);

jsonResponse(200, true, 'Published stories loaded.', ['news' => $news]);
} catch (Throwable $error) {
    error_log('InfoLogika get-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
