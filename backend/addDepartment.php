<?php
include_once "department.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$depart=new Department();


if($depart->addDepartment($department["name"], $department["streetaddress"], $department["city"], $department["states"], $department["zipcode"],$department["chair"],$department["phone"]))
{    
    echo "true";
}
else
{
    
   echo "false";
}

?>