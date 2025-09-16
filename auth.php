<?php
// Forzar parámetros de cookie de sesión cross-domain para desarrollo
$cookieParams = session_get_cookie_params();
session_set_cookie_params([
    'lifetime' => $cookieParams['lifetime'],
    'path' => '/',
    //'domain' => 'localhost', // Eliminado para compatibilidad
    'secure' => false,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();
function require_role($roles) {
    if (!isset($_SESSION['usuario'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'No autenticado']);
        exit;
    }
    $userRole = $_SESSION['usuario']['rol'];
    if (is_array($roles)) {
        if (!in_array($userRole, $roles)) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Acceso denegado']);
            exit;
        }
    } else {
        if ($userRole !== $roles) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Acceso denegado']);
            exit;
        }
    }
}
