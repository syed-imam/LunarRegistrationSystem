<?php

include_once "database.php";
include_once "department.php";



$department=new Department();

echo json_encode($department->getAllDepartments());

?>