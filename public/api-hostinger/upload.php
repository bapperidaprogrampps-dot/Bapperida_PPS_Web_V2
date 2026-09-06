<?php
/**
 * Hostinger Shared / cPanel Upload Handler
 * Bapperida Provinsi Papua Selatan
 * 
 * Skrip ini digunakan jika aplikasi di-hosting pada layanan Hostinger Shared Web Hosting
 * berbasis PHP/Apache (cPanel/hPanel) tanpa Node.js server aktif.
 */

@ini_set('upload_max_filesize', '128M');
@ini_set('post_max_size', '128M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', '300');
@ini_set('max_input_time', '300');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$categories = ['documents', 'images', 'videos', 'general'];
$uploadsRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads';

function formatBytesPHP($bytes, $precision = 2) {
    if (!$bytes || $bytes <= 0) return '0 Bytes';
    $units = ['Bytes', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $categoryStats = [];
    $totalFiles = 0;
    $totalSize = 0;

    foreach ($categories as $cat) {
        $catDir = $uploadsRoot . DIRECTORY_SEPARATOR . $cat;
        $count = 0;
        $catSize = 0;
        if (is_dir($catDir)) {
            $files = array_diff(scandir($catDir), ['.', '..']);
            $count = count($files);
            foreach ($files as $f) {
                $filePath = $catDir . DIRECTORY_SEPARATOR . $f;
                if (is_file($filePath)) {
                    $catSize += filesize($filePath);
                }
            }
        }
        $categoryStats[$cat] = [
            'count' => $count,
            'totalSize' => $catSize,
            'totalSizeFormatted' => formatBytesPHP($catSize)
        ];
        $totalFiles += $count;
        $totalSize += $catSize;
    }

    echo json_encode([
        'success' => true,
        'status' => 'ok',
        'provider' => 'Hostinger Shared Hosting (PHP Storage)',
        'time' => date('c'),
        'maxFileSize' => ini_get('upload_max_filesize') ?: '128M',
        'postMaxSize' => ini_get('post_max_size') ?: '128M',
        'uploadBasePath' => '/uploads',
        'totalFiles' => $totalFiles,
        'totalStorageUsed' => formatBytesPHP($totalSize),
        'categories' => $categoryStats,
        'hostingerReady' => true
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
                $errorMsg = 'Ukuran file melebihi batas maksimal server Hostinger (' . ini_get('upload_max_filesize') . '). Silakan naikkan upload_max_filesize di cPanel PHP Settings atau gunakan URL tautan video publik.';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'File hanya terunggah sebagian karena koneksi terputus.';
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
if (!in_array($category, $categories)) {
    $category = 'general';
}

// Target folder di Hostinger: uploads/{kategori}
$baseUploadDir = $uploadsRoot . DIRECTORY_SEPARATOR . $category;
if (!is_dir($baseUploadDir)) {
    @mkdir($baseUploadDir, 0755, true);
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
        'sizeFormatted' => formatBytesPHP($file['size']),
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
