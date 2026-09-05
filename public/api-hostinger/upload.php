<?php
/**
 * Hostinger Shared / cPanel Upload Handler
 * Bapperida Provinsi Papua Selatan
 * 
 * Skrip ini digunakan jika aplikasi di-hosting pada layanan Hostinger Shared Web Hosting
 * berbasis PHP/Apache (cPanel/hPanel) tanpa Node.js server aktif.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'ok',
        'service' => 'Bapperida Hostinger PHP Storage Handler',
        'time' => date('c'),
        'maxUploadSize' => ini_get('upload_max_filesize'),
        'postMaxSize' => ini_get('post_max_size')
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metode tidak didukung. Gunakan POST.']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $errorMsg = 'Tidak ada file yang diunggah atau terjadi kesalahan upload.';
    if (isset($_FILES['file']['error'])) {
        switch ($_FILES['file']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMsg = 'Ukuran file melebihi batas maksimal server Hostinger (' . ini_get('upload_max_filesize') . ').';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'File hanya terunggah sebagian.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMsg = 'Tidak ada file yang dipilih.';
                break;
        }
    }
    echo json_encode(['success' => false, 'error' => $errorMsg]);
    exit;
}

$category = isset($_POST['category']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['category']) : 'general';
$allowedCategories = ['documents', 'images', 'videos', 'general'];
if (!in_array($category, $allowedCategories)) {
    $category = 'general';
}

// Target folder di Hostinger: uploads/{kategori}
$baseUploadDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $category;
if (!is_dir($baseUploadDir)) {
    mkdir($baseUploadDir, 0755, true);
}

$file = $_FILES['file'];
$originalName = basename($file['name']);
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Filter ekstensi berbahaya
$forbidden = ['php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'cgi', 'pl', 'exe', 'sh', 'bat'];
if (in_array($ext, $forbidden)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Tipe berkas tidak diizinkan untuk alasan keamanan server.']);
    exit;
}

// Generate nama file aman
$cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($originalName, PATHINFO_FILENAME));
$cleanBase = substr($cleanBase, 0, 40);
$uniqueName = $cleanBase . '-' . time() . '-' . mt_rand(1000, 9999) . '.' . $ext;
$targetPath = $baseUploadDir . DIRECTORY_SEPARATOR . $uniqueName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $relativeUrl = '/uploads/' . $category . '/' . $uniqueName;
    echo json_encode([
        'success' => true,
        'message' => 'Berkas berhasil diunggah ke server Hostinger (PHP)',
        'url' => $relativeUrl,
        'filename' => $uniqueName,
        'originalName' => $originalName,
        'category' => $category,
        'size' => $file['size'],
        'mimetype' => $file['type'],
        'storage' => 'hostinger-php',
        'uploadedAt' => date('c')
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Gagal memindahkan berkas ke folder penyimpanan Hostinger. Pastikan folder uploads memiliki izin tulis (chmod 755).'
    ]);
}
