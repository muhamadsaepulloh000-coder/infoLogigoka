<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

ini_set('display_errors', '0');
error_reporting(E_ALL);
set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});
set_exception_handler(static function (Throwable $error): void {
    error_log('InfoLogika API bootstrap error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
});

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Strict');

$https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Strict',
]);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function jsonResponse(int $status, bool $success, string $message, array $data = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');

    $payload = [
        'success' => $success,
        'message' => $message,
    ];
    if ($success) {
        $payload['data'] = (object) $data;
    }

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireMethod(string $method): void
{
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        header('Allow: ' . strtoupper($method));
        jsonResponse(405, false, 'Method not allowed.');
    }
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    $body = json_decode($raw === false ? '' : $raw, true);

    if (!is_array($body)) {
        jsonResponse(400, false, 'Invalid JSON request body.');
    }

    return $body;
}

function requireCsrfToken(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';

    if (!is_string($sent) || !is_string($expected) || $expected === '' || !hash_equals($expected, $sent)) {
        jsonResponse(403, false, 'Invalid or expired request token. Refresh the page and try again.');
    }
}

function currentUser(): ?array
{
    $id = $_SESSION['user_id'] ?? null;
    $role = $_SESSION['role'] ?? null;
    $name = $_SESSION['user_name'] ?? null;

    if (!is_int($id) || !in_array($role, ['user', 'admin'], true) || !is_string($name)) {
        return null;
    }

    return [
        'id' => $id,
        'name' => $name,
        'role' => $role,
    ];
}

function requireLogin(): array
{
    $user = currentUser();
    if ($user === null) {
        jsonResponse(401, false, 'Please log in to continue.');
    }

    $stmt = getDatabaseConnection()->prepare('SELECT id, name, role FROM users WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $user['id']]);
    $record = $stmt->fetch();
    if (!$record || !in_array($record['role'], ['user', 'admin'], true)) {
        unset($_SESSION['user_id'], $_SESSION['user_name'], $_SESSION['role'], $_SESSION['uploaded_images']);
        jsonResponse(401, false, 'Please log in to continue.');
    }

    $user = [
        'id' => (int) $record['id'],
        'name' => $record['name'],
        'role' => $record['role'],
    ];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['role'] = $user['role'];

    return $user;
}

function requireAdmin(): array
{
    $user = requireLogin();
    if ($user['role'] !== 'admin') {
        jsonResponse(403, false, 'Akses ditolak.');
    }

    return $user;
}

function postIntegerId(array $body): int
{
    $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        jsonResponse(400, false, 'A valid story ID is required.');
    }

    return $id;
}

function validateText(mixed $value, string $label, int $maxLength, bool $required = true): ?string
{
    if (!is_string($value)) {
        if (!$required && ($value === null || $value === '')) {
            return null;
        }
        jsonResponse(400, false, $label . ' is invalid.');
    }

    $value = trim($value);
    if ($required && $value === '') {
        jsonResponse(400, false, $label . ' is required.');
    }
    $characterCount = preg_match_all('/./us', $value, $matches);
    if ($characterCount === false || $characterCount > $maxLength) {
        jsonResponse(400, false, $label . ' is too long.');
    }

    return $value === '' ? null : $value;
}

function storyImageDirectory(): string
{
    return dirname(__DIR__) . '/uploads/news';
}

/** Translate stored category keys without changing the database representation. */
function categoryLabel(string $category): string
{
    $labels = [
        'Technology' => ['en' => 'Technology', 'id' => 'Teknologi'],
        'Education' => ['en' => 'Education', 'id' => 'Pendidikan'],
        'Social' => ['en' => 'Society', 'id' => 'Sosial'],
        'Environment' => ['en' => 'Environment', 'id' => 'Lingkungan'],
        'Economy' => ['en' => 'Economy', 'id' => 'Ekonomi'],
        'General' => ['en' => 'General', 'id' => 'Umum'],
        'Folk Stories' => ['en' => 'Folk stories', 'id' => 'Cerita rakyat'],
    ];

    return $labels[$category][($_GET['lang'] ?? '') === 'id' ? 'id' : 'en'] ?? $category;
}

