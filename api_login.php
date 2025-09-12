<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Conexión a la base de datos
$mysqli = new mysqli('localhost', 'root', '', 'poli2demayo');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);
$usuario = $data['usuario'] ?? '';
$password = $data['password'] ?? '';

if (!$usuario || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Usuario y contraseña requeridos']);
    exit;
}


// Consulta segura usando SHA2 para la contraseña
$stmt = $mysqli->prepare('SELECT id, usuario, nombre, rol FROM usuarios WHERE usuario = ? AND password = SHA2(?, 256) LIMIT 1');
$stmt->bind_param('ss', $usuario, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'usuario' => $row]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales incorrectas']);
}

$stmt->close();
$mysqli->close();
