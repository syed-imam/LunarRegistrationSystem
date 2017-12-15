<?php

include_once "database.php";
include_once "researcher.php";

$researchData=new Researcher();

echo json_encode($researchData->getCourseGradeAverageInfo());

?>