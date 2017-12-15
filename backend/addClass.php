<?php
include_once "class.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);


if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 



extract($_POST);

$days=array();

if(isset($data["mon"]))
{
    array_push($days,"Monday");
}

if(isset($data["tue"]))
{
    array_push($days,"Tuesday");
}
if(isset($data["wed"]))
{
    
    array_push($days,"Wednesday");
}
if(isset($data["thu"]))
{
     array_push($days,"Thursday");

}
if(isset($data["fri"]))
{
    array_push($days,"Friday");

}

$class=new Classlist();
//echo json_encode($data);
//print_r($days);
//echo $data["mon"]." ".isset($data["tue"])." ".isset($data["wed"])." ".isset($data["thu"])." ".isset($data["fri"]); 


return ($class->addClass($data["crn"], $data["firstprofessor"], $data["section"], $data["year"], $data["semester"], $data["building"], $data["room"], $days, $data["timeperiod"], $data["capacity"]));


?>