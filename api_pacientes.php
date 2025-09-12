<?php
// Siempre enviar headers CORS y Content-Type antes de cualquier salida
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Capturar errores fatales y enviar JSON con CORS
set_exception_handler(function($e) {
    http_response_code(500);
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Error del servidor: ' . $e->getMessage()]);
    exit();
});
require_once __DIR__ . '/config.php';

// Eliminar paciente (DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el id desde la query string
    parse_str($_SERVER['QUERY_STRING'] ?? '', $params);
    $id = isset($params['id']) ? intval($params['id']) : 0;
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM pacientes WHERE id = ?");
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al eliminar paciente: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'ID de paciente no válido']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $dni = $data['dni'] ?? '';
    $nombre = $data['nombre'] ?? '';
    $apellido = $data['apellido'] ?? '';
    $historia = $data['historia_clinica'] ?? '';
    $fecha_nacimiento = isset($data['fecha_nacimiento']) && $data['fecha_nacimiento'] !== '' ? $data['fecha_nacimiento'] : null;
    $sexo = $data['sexo'] ?? 'M';
    $direccion = $data['direccion'] ?? null;
    $telefono = $data['telefono'] ?? null;
    $email = $data['email'] ?? null;

    // Validar campos obligatorios
    if (!$dni) {
        echo json_encode(['success' => false, 'error' => 'El campo DNI no debe estar vacío']);
        exit;
    }
    if (!$nombre) {
        echo json_encode(['success' => false, 'error' => 'El campo Nombre no debe estar vacío']);
        exit;
    }
    if (!$apellido) {
        echo json_encode(['success' => false, 'error' => 'El campo Apellido no debe estar vacío']);
        exit;
    }
    if (!$historia) {
        echo json_encode(['success' => false, 'error' => 'El campo Historia Clínica no debe estar vacío']);
        exit;
    }

    // Si todos los obligatorios están OK, registrar
    if ($dni && $nombre && $apellido && $historia) {
        $stmt = $conn->prepare("INSERT INTO pacientes (dni, nombre, apellido, historia_clinica, fecha_nacimiento, sexo, direccion, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssssssss', $dni, $nombre, $apellido, $historia, $fecha_nacimiento, $sexo, $direccion, $telefono, $email);
        if ($stmt->execute()) {
            $id = $conn->insert_id;
            $res = $conn->query("SELECT * FROM pacientes WHERE id = $id");
            $paciente = $res->fetch_assoc();
            echo json_encode(['success' => true, 'paciente' => $paciente]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al registrar paciente: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos para registrar paciente']);
    }
    exit;
}


// Listar todos los pacientes (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT id, historia_clinica, nombre, apellido, fecha_nacimiento, dni, creado_en FROM pacientes ORDER BY id DESC");
    $pacientes = [];
    while ($row = $result->fetch_assoc()) {
        // Calcular edad si hay fecha de nacimiento
        if (!empty($row['fecha_nacimiento'])) {
            $birth = new DateTime($row['fecha_nacimiento']);
            $today = new DateTime();
            $edad = $today->diff($birth)->y;
        } else {
            $edad = null;
        }
        $row['edad'] = $edad;
        $pacientes[] = $row;
    }
    echo json_encode(['success' => true, 'pacientes' => $pacientes]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);
