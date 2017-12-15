<?php
include_once "database.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$conn = Database::connect();
$attend=false;

//We have to make date dynamic

for($i=0; $i<sizeof($data);$i++)
{  

    if($data[$i]["attend"]==="Present")
    {
      $attend=true;	
    }
    else
    {
      $attend=false;    
    }
    
    $sql ="INSERT INTO Meeting(student_id, class_id, attend_date, is_present) VALUES (".$data[$i]['id'].",".$class.",'".$attendDate."',".$attend.")";
   
	if(!$conn->query($sql))
	{
		echo "false";
	}
    
}
echo "true";


?>