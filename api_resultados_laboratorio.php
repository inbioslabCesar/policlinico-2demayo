<?php
// api_resultados_laboratorio.php: Guarda resultados de laboratorio
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
        // Guardar resultados de laboratorio
        $data = json_decode(file_get_contents('php://input'), true);
        $consulta_id = $data['consulta_id'] ?? null;
        $tipo_examen = $data['tipo_examen'] ?? null;
        $resultados = $data['resultados'] ?? null;
        if (!$consulta_id || !$resultados) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos requeridos']);
            exit;
        }
        $json = json_encode($resultados);
        // Insertar resultados
        $stmt = $conn->prepare('INSERT INTO resultados_laboratorio (consulta_id, tipo_examen, resultados) VALUES (?, ?, ?)');
        $stmt->bind_param('iss', $consulta_id, $tipo_examen, $json);
        $ok = $stmt->execute();
        $stmt->close();
        // Cambiar estado de la orden a completado
        $stmt2 = $conn->prepare('UPDATE ordenes_laboratorio SET estado = "completado" WHERE consulta_id = ?');
        $stmt2->bind_param('i', $consulta_id);
        $stmt2->execute();
        $stmt2->close();
        echo json_encode(['success' => $ok]);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Método no soportado']);
}
