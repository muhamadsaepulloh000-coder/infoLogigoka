<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
requireCsrfToken();
$body = readJsonBody();
$email = validateText($body['email'] ?? null, 'Email', 190);
$password = $body['password'] ?? null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password) || $password === '' || strlen($password) > 72) {
    jsonResponse(400, false, 'Email or password is invalid.');
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1');
$stmt->execute(['email' => strtolower($email)]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(401, false, 'Email or password is incorrect.');
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['role'] = $user['role'];
$_SESSION['uploaded_images'] = [];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

jsonResponse(200, true, 'Login successful.', [
    'user' => currentUser(),
    'csrf_token' => $_SESSION['csrf_token'],
]);
} catch (Throwable $error) {
    error_log('InfoLogika login error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
