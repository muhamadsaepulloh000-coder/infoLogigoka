<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
requireAdmin();
requireCsrfToken();
$id = postIntegerId(readJsonBody());
$pdo = getDatabaseConnection();

$find = $pdo->prepare('SELECT image FROM news WHERE id = :id LIMIT 1');
$find->execute(['id' => $id]);
$story = $find->fetch();
if (!$story) {
    jsonResponse(404, false, 'Story not found.');
}

$delete = $pdo->prepare('DELETE FROM news WHERE id = :id');
$delete->execute(['id' => $id]);

// The relational data cascades in MySQL. Remove the associated image file as well.
if (is_string($story['image']) && preg_match('~^backend/uploads/news/([a-f0-9]{32}\.(?:jpg|jpeg|png|webp))$~', $story['image'], $matches)) {
    $path = storyImageDirectory() . DIRECTORY_SEPARATOR . $matches[1];
    if (is_file($path)) {
        @unlink($path);
    }
}

jsonResponse(200, true, 'Story deleted.', ['id' => $id]);
} catch (Throwable $error) {
    error_log('InfoLogika delete-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
