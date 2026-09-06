<?php
/**
 * Hostinger Shared / cPanel Centralized Data Handler
 * Bapperida Provinsi Papua Selatan
 * 
 * Skrip ini menyediakan REST API penyimpanan data terpusat berbasis JSON
 * untuk Hostinger Shared Web Hosting (Apache/PHP/cPanel/hPanel).
 * Memastikan data sinkron di semua browser, HP, dan komputer pengunjung.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Folder penyimpanan data terpusat di Hostinger: uploads/data
$baseDataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'data';
if (!is_dir($baseDataDir)) {
    mkdir($baseDataDir, 0755, true);
}

// Helper sanitasi nama file key
function sanitizeKey($key) {
    return preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$key);
}

// -------------------------------------------------------------
// GET REQUEST: Mengambil data terpusat
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $requestedKey = isset($_GET['key']) ? sanitizeKey($_GET['key']) : '';
    $getAll = isset($_GET['all']) || empty($requestedKey);

    if ($getAll) {
        $result = [];
        $files = scandir($baseDataDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $key = pathinfo($file, PATHINFO_FILENAME);
                $filePath = $baseDataDir . DIRECTORY_SEPARATOR . $file;
                $content = file_get_contents($filePath);
                $decoded = json_decode($content, true);
                if ($decoded !== null) {
                    $result[$key] = $decoded;
                }
            }
        }

        echo json_encode([
            'success' => true,
            'service' => 'Hostinger PHP Central Storage',
            'data' => $result,
            'count' => count($result),
            'syncedAt' => date('c')
        ]);
        exit;
    } else {
        $filePath = $baseDataDir . DIRECTORY_SEPARATOR . $requestedKey . '.json';
        if (file_exists($filePath)) {
            $content = file_get_contents($filePath);
            $decoded = json_decode($content, true);
            echo json_encode([
                'success' => true,
                'key' => $requestedKey,
                'data' => $decoded !== null ? $decoded : $content,
                'syncedAt' => date('c')
            ]);
            exit;
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'key' => $requestedKey,
                'error' => 'Data belum tersedia di server'
            ]);
            exit;
        }
    }
}

// -------------------------------------------------------------
// POST REQUEST: Menyimpan data terpusat
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Payload JSON tidak valid']);
        exit;
    }

    $requestedKey = isset($_GET['key']) ? sanitizeKey($_GET['key']) : '';

    // Jika simpan single key lewat query parameter ?key=settings
    if (!empty($requestedKey)) {
        $dataToSave = isset($payload['data']) ? $payload['data'] : $payload;
        $filePath = $baseDataDir . DIRECTORY_SEPARATOR . $requestedKey . '.json';
        file_put_contents($filePath, json_encode($dataToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

        echo json_encode([
            'success' => true,
            'key' => $requestedKey,
            'message' => "Data {$requestedKey} berhasil disimpan terpusat di server Hostinger (PHP)",
            'savedAt' => date('c')
        ]);
        exit;
    }

    // Jika simpan lewat body { key: '...', data: ... }
    if (isset($payload['key'])) {
        $cleanKey = sanitizeKey($payload['key']);
        $dataToSave = isset($payload['data']) ? $payload['data'] : null;
        $filePath = $baseDataDir . DIRECTORY_SEPARATOR . $cleanKey . '.json';
        file_put_contents($filePath, json_encode($dataToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

        echo json_encode([
            'success' => true,
            'key' => $cleanKey,
            'message' => "Data {$cleanKey} berhasil disimpan terpusat di server Hostinger (PHP)",
            'savedAt' => date('c')
        ]);
        exit;
    }

    // Jika simpan semua modul data sekaligus { all: { settings: ..., articles: ... } } atau { data: { ... } }
    $bulkData = isset($payload['all']) ? $payload['all'] : (isset($payload['data']) ? $payload['data'] : $payload);
    if (is_array($bulkData)) {
        $savedCount = 0;
        foreach ($bulkData as $key => $val) {
            $cleanKey = sanitizeKey($key);
            if (!empty($cleanKey)) {
                $filePath = $baseDataDir . DIRECTORY_SEPARATOR . $cleanKey . '.json';
                file_put_contents($filePath, json_encode($val, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
                $savedCount++;
            }
        }

        echo json_encode([
            'success' => true,
            'message' => "{$savedCount} modul data berhasil disinkronkan ke server Hostinger (PHP)",
            'savedCount' => $savedCount,
            'savedAt' => date('c')
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Format payload penyimpanan tidak dikenali']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Metode HTTP tidak didukung']);
