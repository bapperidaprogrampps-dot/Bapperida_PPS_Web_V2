<?php
/**
 * Hostinger Shared / cPanel MySQL Centralized Database Handler
 * Bapperida Provinsi Papua Selatan
 * 
 * Skrip ini menyediakan REST API MySQL berbasis PDO PHP
 * untuk pengguna Hostinger Shared Web Hosting & Cloud Hosting.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Konfigurasi Database MySQL Hostinger
// Sesuaikan dengan data database yang Anda buat di cPanel / hPanel Hostinger
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';
$dbName = getenv('DB_NAME') ?: 'bapperida_db';

function getPdoConnection($dbHost, $dbPort, $dbUser, $dbPass, $dbName) {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ];
        return new PDO($dsn, $dbUser, $dbPass, $options);
    } catch (PDOException $e) {
        return null;
    }
}

$pdo = getPdoConnection($dbHost, $dbPort, $dbUser, $dbPass, $dbName);
$action = isset($_GET['action']) ? $_GET['action'] : 'status';

// 1. ACTION STATUS: Cek koneksi MySQL
if ($action === 'status') {
    if (!$pdo) {
        echo json_encode([
            'success' => false,
            'connected' => false,
            'service' => 'Hostinger PHP MySQL PDO',
            'config' => [
                'host' => $dbHost,
                'port' => $dbPort,
                'user' => $dbUser,
                'database' => $dbName
            ],
            'error' => 'Koneksi MySQL gagal. Pastikan database telah dibuat di hPanel Hostinger dan user memiliki hak akses (privileges).'
        ]);
        exit;
    }

    $tables = ['tb_settings', 'tb_articles', 'tb_documents', 'tb_employees', 'tb_indicators', 'tb_agendas', 'tb_gallery', 'tb_complaints', 'tb_info_requests'];
    $stats = [];

    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM {$table}");
            $cnt = $stmt->fetchColumn();
            $stats[] = ['name' => $table, 'rows' => (int)$cnt];
        } catch (Exception $e) {
            $stats[] = ['name' => $table, 'rows' => 0, 'uninitialized' => true];
        }
    }

    echo json_encode([
        'success' => true,
        'connected' => true,
        'service' => 'Hostinger PHP MySQL PDO',
        'config' => [
            'host' => $dbHost,
            'port' => $dbPort,
            'user' => $dbUser,
            'database' => $dbName
        ],
        'tables' => $stats,
        'checkedAt' => date('c')
    ]);
    exit;
}

// 2. ACTION SYNC: Ambil seluruh data dari MySQL
if ($action === 'sync') {
    if (!$pdo) {
        http_response_code(503);
        echo json_encode(['success' => false, 'error' => 'Database MySQL tidak terhubung']);
        exit;
    }

    $result = [];

    // tb_settings
    try {
        $stmt = $pdo->query("SELECT setting_value FROM tb_settings WHERE setting_key = 'agency_settings' LIMIT 1");
        $val = $stmt->fetchColumn();
        if ($val) $result['settings'] = json_decode($val, true);
    } catch (Exception $e) {}

    // tb_articles
    try {
        $stmt = $pdo->query("SELECT * FROM tb_articles ORDER BY created_at DESC");
        $articles = [];
        while ($row = $stmt->fetch()) {
            $articles[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'category' => $row['category'],
                'excerpt' => $row['excerpt'],
                'content' => $row['content'],
                'image' => $row['image'],
                'date' => $row['date'],
                'author' => $row['author'],
                'readTime' => $row['read_time'],
                'isFeatured' => (bool)$row['is_featured']
            ];
        }
        $result['articles'] = $articles;
    } catch (Exception $e) {}

    echo json_encode([
        'success' => true,
        'database' => 'Hostinger MySQL PDO',
        'data' => $result,
        'count' => count($result),
        'syncedAt' => date('c')
    ]);
    exit;
}

echo json_encode(['success' => true, 'service' => 'Bapperida Hostinger MySQL Endpoint']);
