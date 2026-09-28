<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
$admin = requireAdmin();
requireCsrfToken();
$id = postIntegerId(readJsonBody());
$pdo = getDatabaseConnection();
$stmt = $pdo->prepare(
    "UPDATE news SET status = 'rejected', reviewed_at = NOW(), reviewed_by = :reviewed_by
     WHERE id = :id AND status = 'pending'"
);
$stmt->execute(['reviewed_by' => $admin['id'], 'id' => $id]);

if ($stmt->rowCount() !== 1) {
    jsonResponse(404, false, 'Pending story not found.');
}

jsonResponse(200, true, 'Story rejected.', ['id' => $id, 'status' => 'rejected']);
} catch (Throwable $error) {
    error_log('InfoLogika reject-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
