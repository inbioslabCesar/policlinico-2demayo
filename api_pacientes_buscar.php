<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// API para buscar pacientes por dni, nombre+apellido o historia_clinica
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $tipo = $data['tipo'] ?? '';
    $valor = $data['valor'] ?? '';
    $sql = '';
    $params = [];
    $types = '';

    if ($tipo === 'dni') {
        $sql = 'SELECT * FROM pacientes WHERE dni = ?';
        $params[] = $valor;
        $types = 's';
    } elseif ($tipo === 'nombre') {
        $sql = 'SELECT * FROM pacientes WHERE nombre LIKE ? OR apellido LIKE ?';
        $params[] = "%$valor%";
        $params[] = "%$valor%";
        $types = 'ss';
    } elseif ($tipo === 'historia') {
        $sql = 'SELECT * FROM pacientes WHERE historia_clinica = ?';
        $params[] = $valor;
        $types = 's';
    } else {
        echo json_encode(['success' => false, 'error' => 'Tipo de búsqueda inválido']);
        exit;
    }

    $stmt = $conn->prepare($sql);
    if ($types) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $paciente = $res->fetch_assoc();
    if ($paciente) {
        echo json_encode(['success' => true, 'paciente' => $paciente]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Paciente no encontrado']);
    }
    $stmt->close();
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);
