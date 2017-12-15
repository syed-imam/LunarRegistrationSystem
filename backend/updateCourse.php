<?php
include_once "course.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$course=new Course();

if($course->updateCourse($crn,$title,$desc,$credits,$department))
{

   $course->deletePrereq($crn);
    
    
       for($i=0;$i<sizeof($prereqs);$i++)
       {
          
          if(!$course->addPrereq($crn, $prereqs[$i]["prereq_id"]))
          {
              echo"false";
          }
         
       }
    
   echo "true";    
} 
else 
{
    echo "false";
}


?>