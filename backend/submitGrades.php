<?php
include_once "database.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);


$conn = Database::connect();

for($i=0; $i<sizeof($data);$i++)
{
    
    $sql ="UPDATE Enrollment SET enrol_grade=? WHERE student_id=? AND class_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("dii", $data[$i]["grade"], $data[$i]["id"], $class);
    if(!$stmt->execute())
    {
       echo "false";        
    }    
}
echo "true";


?>