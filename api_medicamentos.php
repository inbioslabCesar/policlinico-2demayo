<?php
// api_medicamentos.php
require_once "config.php";
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar medicamentos
    $sql = "SELECT * FROM medicamentos ORDER BY nombre";
        $result = $conn->query($sql);
        $medicamentos = [];
        while ($row = $result->fetch_assoc()) {
            // Formatear fecha_vencimiento como yyyy-mm-dd si existe
            if (isset($row['fecha_vencimiento']) && $row['fecha_vencimiento']) {
                $row['fecha_vencimiento'] = date('Y-m-d', strtotime($row['fecha_vencimiento']));
            }
            $medicamentos[] = $row;
        }
        echo json_encode($medicamentos);
        break;
    case 'POST':
        // Crear o actualizar medicamento
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            // Actualizar
            $stmt = $conn->prepare("UPDATE medicamentos SET codigo=?, nombre=?, presentacion=?, concentracion=?, laboratorio=?, stock=?, fecha_vencimiento=?, estado=?, precio_compra=?, margen_ganancia=? WHERE id=?");
            $stmt->bind_param("ssssssssddi", $data['codigo'], $data['nombre'], $data['presentacion'], $data['concentracion'], $data['laboratorio'], $data['stock'], $data['fecha_vencimiento'], $data['estado'], $data['precio_compra'], $data['margen_ganancia'], $data['id']);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok]);
        } else {
            // Validar código único
            $stmt_check = $conn->prepare("SELECT id FROM medicamentos WHERE codigo = ?");
            $stmt_check->bind_param("s", $data['codigo']);
            $stmt_check->execute();
            $stmt_check->store_result();
            if ($stmt_check->num_rows > 0) {
                echo json_encode(["success" => false, "error" => "El código ya existe. Usa uno diferente."]);
                $stmt_check->close();
                break;
            }
            $stmt_check->close();
            // Crear
            $stmt = $conn->prepare("INSERT INTO medicamentos (codigo, nombre, presentacion, concentracion, laboratorio, stock, fecha_vencimiento, estado, precio_compra, margen_ganancia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssssdd", $data['codigo'], $data['nombre'], $data['presentacion'], $data['concentracion'], $data['laboratorio'], $data['stock'], $data['fecha_vencimiento'], $data['estado'], $data['precio_compra'], $data['margen_ganancia']);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok, "id" => $conn->insert_id]);
        }
        break;
    case 'DELETE':
        // Eliminar medicamento
        parse_str(file_get_contents('php://input'), $data);
        if (isset($data['id'])) {
            $stmt = $conn->prepare("DELETE FROM medicamentos WHERE id=?");
            $stmt->bind_param("i", $data['id']);
            $ok = $stmt->execute();
            echo json_encode(["success" => $ok]);
        } else {
            echo json_encode(["success" => false, "error" => "ID requerido"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
