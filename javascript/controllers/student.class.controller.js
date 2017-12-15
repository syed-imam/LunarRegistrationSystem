// Admin-Student Controller - Contains all CRUD operations about student entities
myApp.controller("studentClassController", ['$window', '$filter', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', '$cookieStore', 'DepartmentList', 'HoldsList', function ($window, $filter, $rootScope, $scope, $http, $location, $log, $timeout, $cookieStore, DepartmentList, HoldsList) {
    DepartmentList.getAllDepartments();
    $scope.deleteAble = true;
    var today = new Date("2017-02-14");
    today = $filter('date')(today, 'yyyy-M-d');
        
    var deadline;
    $scope.nextSemester;
    $scope.nextYear;
    
    console.log(today);
    
    $http.get('../backend/getCurrentSemester.php?today=' + today).then(function successCallback(response) {
        console.log(response.data);
        //deadline=response.data[0].semester_deadline;
        //console.log(deadline);
        $scope.getAllClasses(response.data[0]);
    }, function errorCallback(err) {
        console.log("ERROR ", err);
    });
    $scope.pages = 0;
    $scope.pagesCollection = [];
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.classesAll = [];
    $scope.classes = [];
    $scope.selectedClasses = {};
    $scope.creditsEarned = 0;
    $scope.thisStudent = {};
    $scope.thisHolds = {};
    //i 
    $scope.getAllClasses = function (currentSemesterInfo) {
        
        deadline = currentSemesterInfo.semester_deadline;
        $scope.nextYear = currentSemesterInfo.year;
        $scope.nextSemester=currentSemesterInfo.semester;
        
        
        console.log(today<deadline);
        
        today=new Date(today);   //convert string back to date 
        deadline=new Date(deadline);  //convert string back to date for comparision
        
        if (today > deadline) {    //if deadline has passed
            //if today is greater than deadline then, clean up registration table
            // $scope.deleteAble = false;
            //move everything for that student from registration into enrollment and clean up registration    
            $http.post('../backend/enroll.php', {currentSemester:$scope.nextSemester, currentYear:$scope.nextYear}).then(function successCallback(response2) {
                console.log("Data");
                $scope.classes = $.grep($scope.classesAll, function (e) {
                    return (e.YEAR == '2017' && e.semester == 'Fall');
                });
            }, function errorCallback(err) {
                console.log("ERROR ", err);
            });
                    
            
            switch (currentSemesterInfo.semester) {
            case 'Spring':
                $scope.nextSemester = 'Summer';
                break;
            case 'Summer':
                $scope.nextSemester = 'Fall';
                break;
            case 'Fall':
                $scope.nextSemester = 'Winter';
                break;
            case 'Winter':
                $scope.nextSemester = 'Spring';
                $scope.nextYear = $scope.nextYear + 1;
                break;
            }      
           
                    
        }
        
        $http.get('../backend/getClassesForRegistration.php?nextSemester='+$scope.nextSemester+'&nextYear='+$scope.nextYear).then(function successCallback(response){
            
            $scope.classesAll = response.data;
            //i need to get current date...from which i ll get next semester and year
            //i ll do grep here to get classes from next semester and year            
            $scope.numofrecords = $scope.classesAll.length;
            //    console.log($scope.numofrecords);    
            console.log($scope.classesAll);
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++){
                $scope.pagesCollection.push(i);
            }
            $scope.classes = $scope.classesAll.slice(0, 15);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
        
    };
        
    $scope.searchClasses = function () {
            
        $scope.classes = $.grep($scope.classesAll, function (e) {
                    return (e.department === $scope.department.department_name);
                }           
        );  }
    
    $scope.getStudentInfo = function(callback) {
        var sid = $cookieStore.get('uid');
        $http.get('../backend/getStudentInfo.php?student_id=' + sid).then(function successCallback(response) {
            if (response.data === "0") {
                $scope.creditsEarned = 0;
            }
            else {
                $scope.creditsEarned = parseInt(response.data[0].current_semester_credits);
            }
            if (response.data === "0") {
                $scope.selectedClasses = [];
            }
            else {
                console.log(response.data);
                $scope.selectedClasses = response.data;
            }
            callback(response);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
    
    
    
    $scope.dropCourse = function (id, credits) {
        var sid = $cookieStore.get('uid'); //user id
        var total = parseInt($scope.creditsEarned) - parseInt(credits);
        var holdPromise = HoldsList.getAllHolds(sid);
        holdPromise.then(function (result) {
            $scope.thisStudent = result;
            $scope.thisHolds = $scope.thisStudent.slice(1, $scope.thisStudent.length);

            if ($scope.thisHolds.length > 0) {
                $rootScope.message = "There are holds on your account which prevents you from dropping!";
            }else {
                $http.post('../backend/deleteRegister.php', {
                    class_id: id
                    , student_id: sid
                    , credits: total
                }).then(function successCallback(response2) {
                    $scope.getStudentInfo(function () {
                        console.log($scope.selectedClasses);
                    });
                }, function errorCallback(err) {
                    console.log("ERROR ", err);
                });
            }
        });
    }
    
    $scope.register = function (id, credits, capacity, roomId, day1, day2, starttime, endtime, building_name, course_name) {      
                          
       
        $scope.getStudentInfo(function (response) { //this returns the classes that he has registred for
        
            
             console.log(response.data); //response data is 0
            
            var sid = $cookieStore.get('uid');
            var holdPromise = HoldsList.getAllHolds(sid);
            holdPromise.then(function (result) {
                $scope.thisStudent = result;
                $scope.thisHolds = $scope.thisStudent.slice(1, $scope.thisStudent.length);
                
                var classArray = $.grep($scope.selectedClasses, function (e) {
                    return (course_name === e.course_name || e.class_id === id || (e.start_time === starttime && e.end_time === endtime && ((e.day1.trim() === day1 || e.day1.trim() === day2) || (e.day2.trim() === day1 || e.day2.trim() === day2))));
                });
                
                
                if ($scope.thisHolds.length > 0) {
                    $rootScope.message = "There are holds on your account which prevents you from registering!";
                }
                else if (classArray.length > 0) {
                    $rootScope.message = "Cant register!";
                }
                else {
                    var sid = $cookieStore.get('uid');
                    var total = parseInt($scope.creditsEarned) + parseInt(credits);
                    if (total < 19) {
                        $http.post('../backend/register.php', {
                            class_id: id
                            , student_id: sid
                            , student_credits: total
                            , room_capacity: capacity
                            , room_id: roomId
                        }).then(function successCallback(response2) {
                            console.log(response2);
                            $scope.getStudentInfo(function () {
                                console.log("I am called")
                            });
                            if (response2.data.trim() === "false") {
                                $rootScope.message = "Registeration error";
                            }
                            else if (response2.data.trim() === "true") {
                                $rootScope.message = "Course Registered";
                            }
                            else {
                                $rootScope.message = response2.data;
                            }
                        }, function errorCallback(err) {
                            console.log("ERROR ", err);
                        });
                    }
                    else {
                        $rootScope.message = "Can't register for more than 18 credits!";
                    }
                }
            });
        
        
        });
        
        
        
    }
    $scope.toggle = function () {
        $scope.display2 = false;
        $scope.display1 = true;
    };
    $scope.selectedClassDescription = "";
    $scope.showCourseDescription = function (desc) {
        $scope.selectedClassDescription = desc;
    }
    $scope.movePage = function (num) {
        $scope.readStartIndex = 0;
        $scope.readEndIndex = 15;
        $scope.readStartIndex = $scope.readStartIndex + (num * 15);
        $scope.readEndIndex = $scope.readEndIndex + (num * 15);
        $scope.classes = $scope.classesAll.slice($scope.readStartIndex, $scope.readEndIndex);
    }
    
     $scope.getStudentInfo(function(){}); 
    
}]);