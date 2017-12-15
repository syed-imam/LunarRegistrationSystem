<?php
include_once "student.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

if($student->deleteStudent($id)) {
    echo "true";
} else {
    echo "false";
}
?>