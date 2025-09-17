<?php
session_start();
echo 'Session path: ' . session_save_path() . '<br>';
echo 'Session id: ' . session_id() . '<br>';
$_SESSION['test'] = 'ok';
session_write_close();
?>
