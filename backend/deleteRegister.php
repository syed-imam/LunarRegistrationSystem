<?php
include_once "database.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);
extract($_GET);

echo "Here".$credits;
// Check redundancy


$conn = Database::connect();



$sql = "DELETE FROM Registration WHERE class_id=? AND student_id=?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ii",$class_id, $student_id);
        $statement->execute();         



$sql = "UPDATE Class SET count_registered=count_registered-1 WHERE class_id=?";
        $statement3 = $conn->prepare($sql);
        $statement3->bind_param("i",$class_id);
        $statement3->execute();         



$sql = "INSERT INTO Student_Full_Time (Student_id, current_semester_credits) VALUES (?,?) ON DUPLICATE KEY UPDATE current_semester_credits = ?";
        $statement1 = $conn->prepare($sql);
        $statement1->bind_param("iii",$student_id, $credits, $credits);
        if($statement1->execute()){
            
            
            $conn->close(); 

            return true;
        }            
        else
        { 
            
            $conn->close(); 

            return false;
        }




?>