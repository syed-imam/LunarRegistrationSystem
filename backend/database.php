<?php

class Database {
    private static $servername = "localhost",
            $username = "root",
            $password = "alijoshadil2017",
            $dbname = "mydb",
            $conn;
     
    public static function connect() {
        self::$conn = new mysqli(self::$servername, self::$username, self::$password, self::$dbname);
        if (self::$conn->connect_error) {
            die("Connection failed: " . self::$conn->connect_error);
        } else {
            return self::$conn;
        }
    }
}

?>