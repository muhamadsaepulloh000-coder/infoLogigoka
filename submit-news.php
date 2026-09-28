<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
$user = requireLogin();
requireCsrfToken();
$body = readJsonBody();

$title = validateText($body['title'] ?? null, 'Title', 220);
$category = validateText($body['category'] ?? null, 'Category', 80);
$sourceUrl = validateText($body['source_url'] ?? null, 'Source URL', 2048);
$content = validateText($body['content'] ?? null, 'Story content', 100000);
$premiseP = validateText($body['premise_p'] ?? null, 'Statement P', 500);
$premiseQ = validateText($body['premise_q'] ?? null, 'Statement Q', 500);
$image = validateText($body['image'] ?? null, 'Image path', 255, false);

$allowedCategories = ['Technology', 'Education', 'Social', 'Environment', 'Economy', 'General', 'Folk Stories'];
if (!in_array($category, $allowedCategories, true)) {
    jsonResponse(400, false, 'Choose a valid story category.');
}
if (!filter_var($sourceUrl, FILTER_VALIDATE_URL) || !in_array(strtolower((string) parse_url($sourceUrl, PHP_URL_SCHEME)), ['http', 'https'], true)) {
    jsonResponse(400, false, 'Source URL must be a valid HTTP or HTTPS URL.');
}

if ($image !== null) {
    $uploaded = $_SESSION['uploaded_images'] ?? [];
    if (!is_array($uploaded) || !in_array($image, $uploaded, true) || !preg_match('~^backend/uploads/news/[a-f0-9]{32}\.(?:jpg|jpeg|png|webp)$~', $image)) {
        jsonResponse(400, false, 'Upload the story image again before submitting.');
    }
}

$pdo = getDatabaseConnection();
$insert = $pdo->prepare(
    "INSERT INTO news (user_id, title, category, source_url, image, content, premise_p, premise_q, status)
     VALUES (:user_id, :title, :category, :source_url, :image, :content, :premise_p, :premise_q, 'pending')"
);
$insert->execute([
    'user_id' => $user['id'],
    'title' => $title,
    'category' => $category,
    'source_url' => $sourceUrl,
    'image' => $image,
    'content' => $content,
    'premise_p' => $premiseP,
    'premise_q' => $premiseQ,
]);

if ($image !== null) {
    $_SESSION['uploaded_images'] = array_values(array_diff($_SESSION['uploaded_images'], [$image]));
}

jsonResponse(201, true, 'Berita berhasil dikirim dan sedang menunggu review admin.', [
    'id' => (int) $pdo->lastInsertId(),
    'status' => 'pending',
]);
} catch (Throwable $error) {
    error_log('InfoLogika submit-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
