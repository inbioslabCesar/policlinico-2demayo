<?php
// api_historia_clinica.php: Guarda y consulta datos de historia clínica por consulta_id
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $consulta_id = $data['consulta_id'] ?? null;
        $datos = $data['datos'] ?? null;
        if (!$consulta_id || !$datos) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos requeridos']);
            exit;
        }
        $json = json_encode($datos);
        // Verificar si ya existe HC para esta consulta
        $stmt_check = $conn->prepare('SELECT id FROM historia_clinica WHERE consulta_id = ?');
        $stmt_check->bind_param('i', $consulta_id);
        $stmt_check->execute();
        $res_check = $stmt_check->get_result();
        if ($res_check->fetch_assoc()) {
            // Ya existe: actualizar
            $stmt = $conn->prepare('UPDATE historia_clinica SET datos = ?, fecha_registro = CURRENT_TIMESTAMP WHERE consulta_id = ?');
            $stmt->bind_param('si', $json, $consulta_id);
            $ok = $stmt->execute();
            $stmt->close();
        } else {
            // No existe: insertar
            $stmt = $conn->prepare('INSERT INTO historia_clinica (consulta_id, datos) VALUES (?, ?)');
            $stmt->bind_param('is', $consulta_id, $json);
            $ok = $stmt->execute();
            $stmt->close();
        }
        echo json_encode(['success' => $ok]);
        $stmt_check->close();
        break;
    case 'GET':
        $consulta_id = isset($_GET['consulta_id']) ? intval($_GET['consulta_id']) : null;
        if (!$consulta_id) {
            echo json_encode(['success' => false, 'error' => 'Falta consulta_id']);
            exit;
        }
        $stmt = $conn->prepare('SELECT * FROM historia_clinica WHERE consulta_id = ?');
        $stmt->bind_param('i', $consulta_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if ($row) {
            $row['datos'] = json_decode($row['datos'], true);
            echo json_encode(['success' => true, 'hc' => $row]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No encontrado']);
        }
        $stmt->close();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
