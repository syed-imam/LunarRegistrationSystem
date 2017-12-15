// Admin-Student Controller - Contains all CRUD operations about student entities
myApp.controller("facultyPanelController", ['$window', '$filter', '$rootScope', '$scope', '$http', '$location', '$timeout', '$cookieStore', function ($window, $filter, $rootScope, $scope, $http, $location, $timeout, $cookieStore) {

    $scope.classes = null;
    $scope.notInClass = true;
    $scope.selectedClass = null;
    $scope.allStudentInThisClass = null;
    $scope.gradesForAll = []; //this array has student name with their correponding grades
    $scope.attendanceForAll = [];
    $scope.repeatStudent;
    $scope.showAttendance = false;
    $scope.adviseeList = null;
    $scope.facultyFullName='';
    
    
//This part is to get start and end date for attendance    
     var today = new Date('2017-02-14');
     today = $filter('date')(today, 'yyyy-M-d');

          
    $http.get('../backend/getCurrentSemester.php?today=' + today).then(function successCallback(response) {
        
        
     $scope.semesterStart=response.data[0].date_start;
     $scope.endSemester=response.data[0].date_end;        
 
    console.log($scope.semesterStart);     
    console.log($scope.endSemester);     
     
                 
                
    }, function errorCallback(err) {
        console.log("ERROR ", err);
    });

    
    
    
    $scope.getFacultyInfo= function(){       
            
            var uid = $cookieStore.get("uid");
    
            $http.get('../backend/getFacultyById.php?id=' + uid).then(function (res){
               
                
                $scope.facultyFullName=res.data;
                console.log($scope.facultyFullName);
                
            }, function(err){
                console.log(err); 
            });

        
    }

    $scope.insertGrade = function (grade, stid) {
        var localstu = {
            id: stid,
            grade: grade
        };

        var foundIndex = -1;

        for (var i = 0; i < $scope.gradesForAll.length; i++) {
            if ($scope.gradesForAll[i].id === stid) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex !== -1) {
            $scope.gradesForAll[foundIndex].grade = grade;
        } else {
            $scope.gradesForAll.push(localstu);
        }
        
        console.log($scope.gradesForAll);
    }
    
    $scope.getAdvisees = function() {
        var uid = $cookieStore.get("uid");
        
        
        
        $http.get('../backend/getAdvisees.php?uid=' + uid).then(function (res){
            $scope.adviseeList = res.data;
            console.log($scope.adviseeList);
        }, function(err){
            console.log(err); 
        });
    }

    
    $scope.getClassesTaught = function(){
        
         var today = new Date('2017-02-14');
         today = $filter('date')(today, 'yyyy-M-d');

         $scope.currentSemester;
         $scope.currentYear;        
        
          
    $http.get('../backend/getCurrentSemester.php?today=' + today).then(function successCallback(response) {
        console.log(response.data);
        $scope.currentSemester=response.data[0].semester;
        $scope.currentYear=response.data[0].year;
        
                
        var uid = $cookieStore.get("uid");

        $http.get('../backend/getClassesTaught.php?uid=' + uid+'&semester='+$scope.currentSemester+'&year='+$scope.currentYear).then(function successCallback(response){
            $scope.classes = response.data;
            console.log($scope.classes);
        }, function errorCallback(err){
            console.log("ERROR ", err);
        });
        
        
        
        
    }, function errorCallback(err) {
        console.log("ERROR ", err);
    });
        

    }

    $scope.showThisClass = function (whichClass) {
        $scope.notInClass = false;
        $scope.selectedClass = whichClass;
        console.log(whichClass);
        $scope.getAllStudentInClass(whichClass.class_id);
    }

    $scope.getAllStudentInClass = function (class_id) {
        $http.get('../backend/getAllStudentsInClass.php?classid=' + class_id).then(function successCallback(response) {
            $scope.allStudentInThisClass = response.data;
            console.log($scope.allStudentInThisClass);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }

    $scope.setForStudent = function (num, who) {
        console.log(num, who);
    }

    $scope.submitGrades = function () {

        $http.post('../backend/submitGrades.php', {
            data: $scope.gradesForAll,
            class: $scope.selectedClass.class_id
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "Grades submitted!";
                $scope.done = true;
            } else {
                $rootScope.message = "There has been a problem submitting grades!";

            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.showAttendanceSheet = function () {
        $scope.showAttendance = true;
    }

    $scope.insertAttendance = function (attend, stu) {

        console.log(attend, stu);
        var localstu = {
            id: stu,
            attend: attend
        };

        var foundIndex = -1;

        for (var i = 0; i < $scope.attendanceForAll.length; i++) {
            if ($scope.attendanceForAll[i].id === stu) {
                foundIndex = i;
                break;
            }

        }
        if (foundIndex !== -1) {
            $scope.attendanceForAll[foundIndex].attend = attend;
        } else {
            $scope.attendanceForAll.push(localstu);
        }
    }

    $scope.submitAttendance = function () {

        $http.post('../backend/submitAttendance.php', {
            data: $scope.attendanceForAll,
            class: $scope.selectedClass.class_id,
            attendDate: $scope.selectedDate
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "Attendance submitted!";
                $scope.done = true;
            } else {
                $rootScope.message = "There has been a problem submitting attendance!";

            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.toggle = function () {
        $scope.selectedClass = null;
        $scope.allStudentInThisClass = null;
        $scope.notInClass = true;
    }
    
     $scope.getFacultyInfo();
    
}]);
