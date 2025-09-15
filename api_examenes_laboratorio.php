<?php
// Permitir CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once "config.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($method) {
    case 'GET':
        // Listar todos los exámenes activos
        $sql = "SELECT * FROM examenes_laboratorio WHERE activo = 1 ORDER BY nombre";
        $result = $conn->query($sql);
        $examenes = [];
        while ($row = $result->fetch_assoc()) {
            $examenes[] = $row;
        }
        echo json_encode(["success" => true, "examenes" => $examenes]);
        break;
    case 'POST':
        // Crear nuevo examen
        $data = json_decode(file_get_contents('php://input'), true);
        $nombre = $data['nombre'] ?? null;
        $metodologia = $data['metodologia'] ?? null;
        $valor_referencial = $data['valor_referencial'] ?? null;
        $unidades = $data['unidades'] ?? null;
        $precio_publico = $data['precio_publico'] !== "" ? $data['precio_publico'] : null;
        $precio_convenio = $data['precio_convenio'] !== "" ? $data['precio_convenio'] : null;
        $tipo_tubo = $data['tipo_tubo'] ?? null;
        $tipo_frasco = $data['tipo_frasco'] ?? null;
        $tiempo_resultado = $data['tiempo_resultado'] ?? null;
        $condicion_paciente = $data['condicion_paciente'] ?? null;
        $preanalitica = $data['preanalitica'] ?? null;
        $stmt = $conn->prepare("INSERT INTO examenes_laboratorio (nombre, metodologia, valor_referencial, unidades, precio_publico, precio_convenio, tipo_tubo, tipo_frasco, tiempo_resultado, condicion_paciente, preanalitica, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
        $stmt->bind_param(
            "ssssddsssss",
            $nombre,
            $metodologia,
            $valor_referencial,
            $unidades,
            $precio_publico,
            $precio_convenio,
            $tipo_tubo,
            $tipo_frasco,
            $tiempo_resultado,
            $condicion_paciente,
            $preanalitica
        );
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok]);
        break;
    case 'PUT':
        // Actualizar examen
        $data = json_decode(file_get_contents('php://input'), true);
        $nombre = $data['nombre'] ?? null;
        $metodologia = $data['metodologia'] ?? null;
        $valor_referencial = $data['valor_referencial'] ?? null;
        $unidades = $data['unidades'] ?? null;
        $precio_publico = $data['precio_publico'] !== "" ? $data['precio_publico'] : null;
        $precio_convenio = $data['precio_convenio'] !== "" ? $data['precio_convenio'] : null;
        $tipo_tubo = $data['tipo_tubo'] ?? null;
        $tipo_frasco = $data['tipo_frasco'] ?? null;
        $tiempo_resultado = $data['tiempo_resultado'] ?? null;
        $condicion_paciente = $data['condicion_paciente'] ?? null;
        $preanalitica = $data['preanalitica'] ?? null;
        $id = $data['id'];
        $stmt = $conn->prepare("UPDATE examenes_laboratorio SET nombre=?, metodologia=?, valor_referencial=?, unidades=?, precio_publico=?, precio_convenio=?, tipo_tubo=?, tipo_frasco=?, tiempo_resultado=?, condicion_paciente=?, preanalitica=? WHERE id=?");
        $stmt->bind_param(
            "ssssddsssssi",
            $nombre,
            $metodologia,
            $valor_referencial,
            $unidades,
            $precio_publico,
            $precio_convenio,
            $tipo_tubo,
            $tipo_frasco,
            $tiempo_resultado,
            $condicion_paciente,
            $preanalitica,
            $id
        );
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok]);
        break;
    case 'DELETE':
        // Eliminar (desactivar) examen
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("UPDATE examenes_laboratorio SET activo=0 WHERE id=?");
            $stmt->bind_param("i", $id);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok]);
        } else {
            echo json_encode(["success" => false, "error" => "ID requerido"]);
        }
        break;
    default:
        echo json_encode(["success" => false, "error" => "Método no soportado"]);
}
$conn->close();
