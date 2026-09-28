<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
requireLogin();
requireCsrfToken();

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'] ?? 'Strict',
    ]);
}
session_destroy();

jsonResponse(200, true, 'Logged out successfully.');
} catch (Throwable $error) {
    error_log('InfoLogika logout error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
