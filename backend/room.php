<?php

include_once "database.php";

class Room {
        
    public function addRoom($roomnumber, $buildingname, $capacity){  
    
        $conn = Database::connect();
        
        $sql = "INSERT INTO Room(room_number, building_name, room_capacity) VALUES (?,?,?)";
        $statement = $conn->prepare($sql);
        $statement->bind_param("isi", $roomnumber, $buildingname, $capacity);
        if ($statement->execute()) {
            return true;
        } else {            
            return false;
        }
    
        $conn->close();
    }
    
    public function getAllRooms(){
        $conn = Database::connect();
        $statement = "SELECT * FROM Room";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close();
        return $arr;
    }

    public function updateRoom($roomNumber, $buildingName, $capacity){  
        $conn = Database::connect();
             
        $sql = "UPDATE Room SET room_number = ?, building_name= ?, room_capacity = ? WHERE room_number = ? AND building_name = ?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("isiis", $roomNumber, $buildingName, $capacity, $roomNumber, $buildingName);
        if($statement->execute()){
            return true;
        } else {            
            return false;
        }
    }
        
    public function deleteRoom($roomNumber, $buildingName){
        $conn = Database::connect();
             
        $sql = "DELETE FROM Room WHERE (SELECT * FROM Class WHERE semester != 'Spring' AND year != 2017) AND  room_number = ? AND building_name = ?";
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

$room = new Room();

?>