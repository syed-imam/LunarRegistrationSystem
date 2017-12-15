<?php
include_once "course.php";



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$course=new Course();


if($course->addCourse($data["crn"], $data["title"], $data["desc"], $data["department"], $data["status"], $data["credits"]))
{
    
       for($i=0;$i<sizeof($prereqs);$i++)
       {
          
          if(!$course->addPrereq($data["crn"], $prereqs[$i]["courseID"]))
          {
              echo"false";
          }
          //var_dump($prereqs[$i]["courseID"]);
       }

    
     echo "true";
    
    
}
else
{
    
   echo "false";
}


?>