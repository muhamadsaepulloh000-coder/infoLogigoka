<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
requireCsrfToken();
$body = readJsonBody();

$name = validateText($body['name'] ?? null, 'Name', 120);
$email = validateText($body['email'] ?? null, 'Email', 190);
$password = $body['password'] ?? null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(400, false, 'Enter a valid email address.');
}
if (!is_string($password) || strlen($password) < 10 || strlen($password) > 72) {
    jsonResponse(400, false, 'Password must be between 10 and 72 bytes.');
}

$pdo = getDatabaseConnection();
$check = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
$normalizedEmail = strtolower($email);
$check->execute(['email' => $normalizedEmail]);
if ($check->fetch()) {
    jsonResponse(409, false, 'An account with this email already exists.');
}

$insert = $pdo->prepare(
    'INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, \'user\')'
);
try {
    $insert->execute([
        'name' => $name,
        'email' => $normalizedEmail,
        'password' => password_hash($password, PASSWORD_DEFAULT),
    ]);
} catch (PDOException $error) {
    if ((string) $error->getCode() === '23000') {
        jsonResponse(409, false, 'An account with this email already exists.');
    }
    throw $error;
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $pdo->lastInsertId();
$_SESSION['user_name'] = $name;
$_SESSION['role'] = 'user';
$_SESSION['uploaded_images'] = [];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

jsonResponse(201, true, 'Account created successfully.', [
    'user' => currentUser(),
    'csrf_token' => $_SESSION['csrf_token'],
]);
} catch (Throwable $error) {
    error_log('InfoLogika register error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
