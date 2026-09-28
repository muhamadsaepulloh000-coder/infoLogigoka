<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

try {
requireMethod('POST');
requireLogin();
requireCsrfToken();

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    jsonResponse(400, false, 'Select an image to upload.');
}
$file = $_FILES['image'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    jsonResponse(400, false, 'The image upload did not complete.');
}
if (!isset($file['size']) || (int) $file['size'] < 1 || (int) $file['size'] > 5 * 1024 * 1024) {
    jsonResponse(400, false, 'Images must be smaller than 5 MB.');
}
if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    jsonResponse(400, false, 'Invalid uploaded image.');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
if (!is_string($mime) || !isset($extensions[$mime])) {
    jsonResponse(400, false, 'Only JPG, JPEG, PNG, and WEBP images are allowed.');
}
$imageInfo = @getimagesize($file['tmp_name']);
if ($imageInfo === false || ($imageInfo['mime'] ?? '') !== $mime) {
    jsonResponse(400, false, 'The uploaded file is not a valid image.');
}
if (($imageInfo[0] ?? 0) < 1 || ($imageInfo[1] ?? 0) < 1 || ($imageInfo[0] * $imageInfo[1]) > 40000000) {
    jsonResponse(400, false, 'The image dimensions are too large.');
}

$directory = storyImageDirectory();
if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
    jsonResponse(500, false, 'Image storage is unavailable.');
}

$filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
$destination = $directory . DIRECTORY_SEPARATOR . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(500, false, 'The image could not be saved.');
}

$relativePath = 'backend/uploads/news/' . $filename;
if (!isset($_SESSION['uploaded_images']) || !is_array($_SESSION['uploaded_images'])) {
    $_SESSION['uploaded_images'] = [];
}
if (count($_SESSION['uploaded_images']) >= 5) {
    $oldPath = array_shift($_SESSION['uploaded_images']);
    if (is_string($oldPath) && preg_match('~^backend/uploads/news/([a-f0-9]{32}\.(?:jpg|jpeg|png|webp))$~', $oldPath, $matches)) {
        $oldFile = $directory . DIRECTORY_SEPARATOR . $matches[1];
        if (is_file($oldFile)) {
            @unlink($oldFile);
        }
    }
}
$_SESSION['uploaded_images'][] = $relativePath;

jsonResponse(201, true, 'Image uploaded.', ['image' => $relativePath]);
} catch (Throwable $error) {
    error_log('InfoLogika upload-image error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
