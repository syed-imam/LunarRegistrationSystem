<?php

include_once "database.php";

class Major {
          
    public function getAllMajors(){
        $conn = Database::connect();
        $statement = "SELECT * FROM Major";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close();
        return $arr;
    }

    public function updateMajor($majorName, $departmentName, $oMajorName, $oDepartmentName){  
        $conn = Database::connect();
             
        $sql = "UPDATE Major SET major_name = ?, department_name= ? WHERE major_name = ? AND department_name = ?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ssss", $majorName, $departmentName, $oMajorName, $oDepartmentName);
        if($statement->execute()){
            return true;
        } else {            
            return false;
        }
    }
           
}

$major = new Major();

?>