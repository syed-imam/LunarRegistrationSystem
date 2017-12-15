<?php
include_once "minor.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

if($minor->updateMinor($data["name"], $data["department"], $data1["name"], $data1["department"]))
{
    echo "true";
} 
else 
{
    echo "false";
}

?>