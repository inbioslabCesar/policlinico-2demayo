<?php
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// CORS para localhost y producción
$allowedOrigins = [
    'http://localhost:5173',
    'https://darkcyan-gnu-615778.hostingersite.com'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar consultas (por médico, paciente o todas)
        $medico_id = isset($_GET['medico_id']) ? intval($_GET['medico_id']) : null;
        $paciente_id = isset($_GET['paciente_id']) ? intval($_GET['paciente_id']) : null;
    $sql = 'SELECT consultas.*, pacientes.nombre AS paciente_nombre, pacientes.apellido AS paciente_apellido, pacientes.historia_clinica, medicos.nombre AS medico_nombre FROM consultas LEFT JOIN pacientes ON consultas.paciente_id = pacientes.id LEFT JOIN medicos ON consultas.medico_id = medicos.id';
        $params = [];
        $types = '';
        if ($medico_id) {
            $sql .= ' WHERE medico_id = ?';
            $params[] = $medico_id;
            $types .= 'i';
        } elseif ($paciente_id) {
            $sql .= ' WHERE paciente_id = ?';
            $params[] = $paciente_id;
            $types .= 'i';
        }
        $stmt = $conn->prepare($sql);
        if ($types) $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode(['success' => true, 'consultas' => $rows]);
        $stmt->close();
        break;
    case 'POST':
        // Agendar nueva consulta
        $data = json_decode(file_get_contents('php://input'), true);
        $paciente_id = $data['paciente_id'] ?? null;
        $medico_id = $data['medico_id'] ?? null;
        $fecha = $data['fecha'] ?? null;
        $hora = $data['hora'] ?? null;
        if (!$paciente_id || !$medico_id || !$fecha || !$hora) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos requeridos']);
            exit;
        }
        // Verificar que no haya otra consulta en ese horario para el médico
        $stmt = $conn->prepare('SELECT COUNT(*) as total FROM consultas WHERE medico_id=? AND fecha=? AND hora=? AND estado="pendiente"');
        $stmt->bind_param('iss', $medico_id, $fecha, $hora);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if ($row['total'] > 0) {
            echo json_encode(['success' => false, 'error' => 'El médico ya tiene una consulta pendiente en ese horario']);
            $stmt->close();
            exit;
        }
        $stmt->close();
        $stmt = $conn->prepare('INSERT INTO consultas (paciente_id, medico_id, fecha, hora) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iiss', $paciente_id, $medico_id, $fecha, $hora);
        $ok = $stmt->execute();
        echo json_encode(['success' => $ok, 'id' => $ok ? $stmt->insert_id : null]);
        $stmt->close();
        break;
    case 'PUT':
        // Actualizar estado de consulta
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        $estado = $data['estado'] ?? null;
        if (!$id || !$estado) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos requeridos']);
            exit;
        }
        $stmt = $conn->prepare('UPDATE consultas SET estado=? WHERE id=?');
        $stmt->bind_param('si', $estado, $id);
        $ok = $stmt->execute();
        echo json_encode(['success' => $ok]);
        $stmt->close();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
