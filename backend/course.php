<?php
include_once "database.php";
class Course{
        
public function addCourse($crn, $title, $desc, $department, $status, $credits){  
      
        $conn = Database::connect();
        
        
        $sql = "INSERT INTO Course (course_id, course_name, department, credits, course_description, status) VALUES (?,?,?,?,?,?)";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ssssss", $crn, $title, $department, $credits, $desc, $status);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
    
       $conn->close();

}

    
public function updateCourse($crn, $title, $desc,$credits,$department){  
      
        $conn = Database::connect();
             
        $sql = "UPDATE Course SET course_name=?, department=?, credits=?,course_description=? WHERE course_id=?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ssiss", $title, $department, $credits, $desc, $crn);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
       $conn->close();
}
      
    
   
public function getAllCourses(){
       
        $conn = Database::connect();
        $statement = "SELECT Course.course_id, course_name, department, credits, course_description, STATUS ,prereq_id FROM Course LEFT JOIN Prerequisite ON Course.course_id = Prerequisite.course_id";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        return $arr;
    
        $conn->close();
}
    
public function deleteCourse($crn){
    
        $conn = Database::connect();
             
        $sql = "DELETE FROM Course WHERE course_id=?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("i",$crn);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
       $conn->close();
    
}
    
public function addPrereq($crn, $prereq){
    
        $conn = Database::connect();
        
        
        $sql = "INSERT INTO Prerequisite (prereq_id, course_id) VALUES (?,?)";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ii",$prereq,$crn);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
    
       $conn->close();
    
}

    
public function deletePrereq($crn){

        $conn = Database::connect();
        
        $sql="DELETE FROM Prerequisite WHERE course_id=?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("i",$crn);
        $statement->execute();   //delete all the prereqs for that course
    
}
    
}  //class ends



?>