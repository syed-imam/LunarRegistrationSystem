<?php

include_once "database.php";

class Minor {
          
    public function getAllMinors(){
        $conn = Database::connect();
        $statement = "SELECT * FROM Minor";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close();
        return $arr;
    }

    public function updateMinor($minorName, $departmentName, $oMinorName, $oDepartmentName){  
        $conn = Database::connect();
             
        $sql = "UPDATE Minor SET minor_name = ?, department_name= ? WHERE minor_name = ? AND department_name = ?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("ssss", $minorName, $departmentName, $oMinorName, $oDepartmentName);
        if($statement->execute()){
            return true;
        } else {            
            return false;
        }
    }
               
}

$minor = new Minor();

?>