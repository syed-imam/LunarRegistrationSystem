<?php

include_once "database.php";

class Department{
        
public function addDepartment($name, $address, $city, $state, $zipcode, $chair, $phone){  
    
        $conn = Database::connect();
       
        $schoolid=1;
        $faculty=55;    
        
        $sql = "INSERT INTO Department(department_name, school_id, department_street, department_chair, department_city, zipcode, department_phone) VALUES (?,?,?,?,?,?,?)";
        $statement = $conn->prepare($sql);
        $statement->bind_param("sisisss", $name,$schoolid,$address,$faculty,$city,$zipcode,$phone);
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
      
    
   
public function getAllDepartments(){
       
        $conn = Database::connect();
        $statement = "SELECT *FROM  Department JOIN School ON Department.school_id = School.school_id JOIN  User ON department_chair = user_id";
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
        $statement->bind_param("",$crn);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
       $conn->close();
    
}
        
    
    
}


?>