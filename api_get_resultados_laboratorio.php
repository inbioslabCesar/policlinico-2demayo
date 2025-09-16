<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/config.php';

$orden_id = isset($_GET['orden_id']) ? intval($_GET['orden_id']) : null;
if (!$orden_id) {
    echo json_encode(['success' => false, 'error' => 'Falta orden_id']);
    exit;
}
$stmt = $conn->prepare('SELECT * FROM resultados_laboratorio WHERE orden_id = ? ORDER BY id DESC LIMIT 1');
$stmt->bind_param('i', $orden_id);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$stmt->close();
if ($row) {
    $row['resultados'] = json_decode($row['resultados'], true);
    echo json_encode(['success' => true, 'resultado' => $row]);
} else {
    echo json_encode(['success' => false, 'resultado' => null]);
}
