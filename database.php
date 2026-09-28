<?php
declare(strict_types=1);

/**
 * XAMPP defaults: MySQL on localhost, database infologika, user root, no password.
 * Set INFOLOGIKA_DB_* environment variables if your local MySQL differs.
 */
function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('INFOLOGIKA_DB_HOST') ?: '127.0.0.1';
    $port = getenv('INFOLOGIKA_DB_PORT') ?: '3306';
    $name = getenv('INFOLOGIKA_DB_NAME') ?: 'infologika';
    $user = getenv('INFOLOGIKA_DB_USER') ?: 'root';
    $password = getenv('INFOLOGIKA_DB_PASSWORD') ?: 'root';
    if ($password === false) {
        $password = '';
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $host,
        $port,
        $name
    );

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    ]);

    return $pdo;
}
