<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('GET');

if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$user = currentUser();
if ($user !== null) {
    $stmt = getDatabaseConnection()->prepare('SELECT id, name, role FROM users WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $user['id']]);
    $record = $stmt->fetch();
    if (!$record || !in_array($record['role'], ['user', 'admin'], true)) {
        unset($_SESSION['user_id'], $_SESSION['user_name'], $_SESSION['role'], $_SESSION['uploaded_images']);
        $user = null;
    } else {
        $user = ['id' => (int) $record['id'], 'name' => $record['name'], 'role' => $record['role']];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['role'] = $user['role'];
    }
}

jsonResponse(200, true, 'Session status loaded.', [
    'user' => $user,
    'csrf_token' => $_SESSION['csrf_token'],
]);
} catch (Throwable $error) {
    error_log('InfoLogika auth-status error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
