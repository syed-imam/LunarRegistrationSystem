myApp.controller("classController", ['$rootScope', '$scope', '$http', '$location', '$log', '$timeout', 'RoomList', 'DepartmentList', 'FacultyList', function ($rootScope, $scope, $http, $location, $log, $timeout, RoomList, DepartmentList, FacultyList) {
    DepartmentList.getAllDepartments();
    //getting departments dynamically
    //$rootScope.getAllDepartments();
    //console.log($rootScope.allDepartments);  i will work on this crap later
    //i have to get all rooms dynamically
    var roomPromise = RoomList.getAllRooms();
    roomPromise.then(function (result) {
        $scope.roomsAll = result;
        console.log($scope.roomsAll);
    });
    
    
    var facultyPromise = FacultyList.getAllFaculty();
    facultyPromise.then(function (result) {
        $scope.facultys = result;
        //console.log($scope.facultys);
    });
        
    //promise Object    
    var days1 = [];
    var days2 = [];
    $scope.class = {};
    $scope.idcourse;
    $scope.numofrecords = 0;
    $scope.pages = 0;
    $scope.pagesCollection = [];
    // $scope.readStartIndex=0;
    //$scope.readEndIndex=5;
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.disabledField = true;
    $scope.departmentdropdownlist = false;
    $scope.otheroptiontextfield = true;
    $scope.allowinput = false;
    $scope.focussedBuilding;
    $scope.selectedIndex = 0;
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };
    $scope.setDays1 = function () {
        days1 = [];
        if ($scope.class.mon) {
            days1.push("Monday");
        }
        if ($scope.class.tue) {
            days1.push("Tuesday");
        }
        if ($scope.class.wed) {
            days1.push("Wednesday");
        }
        if ($scope.class.thu) {
            days1.push("Thursday");
        }
        if ($scope.class.fri) {
            days1.push("Friday");
        }
    }
    $scope.setDays2 = function () {
        days2 = [];
        if ($scope.mon) {
            days2.push("Monday");
        }
        if ($scope.tue) {
            days2.push("Tuesday");
        }
        if ($scope.wed) {
            days2.push("Wednesday");
        }
        if ($scope.thu) {
            days2.push("Thursday");
        }
        if ($scope.fri) {
            days2.push("Friday");
        }
    }
    $scope.switchInputMethod = function () {
        if ($scope.selectedfilter === "Department") {
            $scope.otheroptiontextfield = false;
            $scope.departmentdropdownlist = true;
            $scope.allowinput = false;
        }
        else if ($scope.selectedfilter === "All") {
            $scope.otheroptiontextfield = true;
            $scope.departmentdropdownlist = false;
            $scope.allowinput = true;
        }
        else {
            $scope.otheroptiontextfield = true;
            $scope.departmentdropdownlist = false;
            $scope.allowinput = false;
        }
    };
    $scope.generateRooms = function () {
        console.log($scope.class.building);
        /*
         $scope.courses = $.grep($scope.coursesAll, function (e) {
            return e.course_id === $scope.idcourse;
        });
        */
        $scope.rooms = $.grep($scope.roomsAll, function (e) {
            return e.building_name.trim() === $scope.class.building;
        });
        console.log($scope.rooms);
    };
    $scope.updateformdata = function (obj) {
        //$scope.resetCheckedDays(); 
        
        console.log(obj);
        
        $scope.display2 = true;
        $scope.display1 = false;
        console.log(obj);
        switch (obj.day1.trim()) {
        case "Monday":
            $scope.mon = true;
            break;
        case "Tuesday":
            $scope.tue = true;
            break;
        case "Wednesday":
            $scope.wed = true;
            break;
        case "Thursday":
            $scope.thu = true;
            break;
        case "Friday":
            $scope.fri = true; //checkboxes are set to true and false        
            break;
        default:
            console.log("");
        }
        switch (obj.day2.trim()) {
        case "Monday":
            $scope.mon = true;
            break;
        case "Tuesday":
            $scope.tue = true;
            break;
        case "Wednesday":
            $scope.wed = true;
            break;
        case "Thursday":
            $scope.thu = true;
            break;
        case "Friday":
            $scope.fri = true;
            break;
        default:
            console.log("");
        }
        console.log(obj);
        // $scope.idcourse=obj.course_id;
        $scope.crctitle = obj.course_name;
        $scope.building = obj.building_name;
        $scope.section = obj.section;
        $scope.class.building = $scope.building;
        $scope.generateRooms();
        //$scope.class.room=obj.class.room;
        $scope.year = obj.YEAR;
        $scope.semester = obj.semester;
        //$scope.semester=obj.semester;
        $scope.time = obj.time_period;
        $scope.professor = obj.user_id;
        $scope.room = {
            room_number: obj.room_number
        };
        
        $scope.faculty1={
              
            faculty_id:obj.user_id
            
        };
        
        $scope.class_id = obj.class_id;
        console.log($scope.room);
    }
    
    
    $scope.toggle = function () {
        $scope.disabledField = true;
        $scope.display2 = false;
        $scope.display1 = true;
    };
    
    
  $scope.addClass = function () {
      
      
        $scope.class.firstprofessor=$scope.faculty.user_id;     
      
        $scope.facultyClasses = [];
        $scope.getAllClasses(); //to check for conflicts
        $scope.setDays1();
        console.log($scope.roomsAll);
        var roomCapacity = $.grep($scope.roomsAll, function (e) {
            // console.log($scope.class);
            return (e.building_name === $scope.class.building && e.room_number === $scope.class.room.room_number);
        });
        console.log(roomCapacity[0].room_capacity);
        $scope.class.capacity = roomCapacity[0].room_capacity;
            
        console.log($scope.class);
        
        //var uid = $cookieStore.get("uid");
        $http.get('../backend/getClassesTaught.php?uid=' + $scope.class.firstprofessor + '&semester=' + $scope.class.semester + '&year=' + $scope.class.year).then(function successCallback(response) {
            $scope.facultyClasses = response.data;
            
            
            var FacultyClasses = $.grep($scope.facultyClasses, function (e) {
                return (e.time_period === $scope.class.timeperiod && e.semester === $scope.class.semester && e.year === $scope.class.year && ((e.day1.trim() === days1[0] || e.day1.trim() === days1[1]) || (e.day2.trim() === days1[0] || e.day2.trim() === days1[1])));
            });
            
            console.log($scope.facultyClasses);   
            console.log(FacultyClasses.length);  //repeat or not
            
           
            
                        
            if(FacultyClasses.length==0){
                //THis is chekcing time and location clash
                var classArray = $.grep($scope.classesAll, function (e) {
                    console.log($scope.class);
                    return (e.YEAR === $scope.class.year && e.semester === $scope.class.semester && e.building_name === $scope.class.building && e.room_number === $scope.class.room.room_number && e.time_period === $scope.class.timeperiod && ((e.day1.trim() === days1[0] || e.day1.trim() === days1[1]) || (e.day2.trim() === days1[0] || e.day2.trim() === days1[1])));
                });
                //i wana check here faculty timeslot clash
                console.log(classArray.length); //class array length       
                console.log(classArray);
                if (classArray.length > 0) {
                    $rootScope.message = "Your new class's schedule clashes with the schedule of class with ID " + classArray[0].class_id + "";
                    return;
                }
                $scope.class.room = $scope.class.room.room_number; //Assign Room number into Room
                console.log($scope.class);
                $http.post('../backend/addClass.php', {
                    data: $scope.class
                }).then(function successCallback(response) {
                    if (response.data.trim() === 'true') {
                        console.log("Good job");
                        $rootScope.message = "A new class has been added!";
                        $scope.done = true;
                    }
                    else if (response.data.trim() === 'redundant') {
                        console.log("User exists");
                        $rootScope.message = "User e-mail alreadys exists in the system!";
                    }
                    else if(response.data.trim() === 'problem4'){
                        
                          $rootScope.message = "This faculty is already teaching 4 classes this Semester!";
                    }
                    else {
                        $rootScope.message = "There has been a problem adding a new class!";
                        console.log("Sorry");
                        console.log(response);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            else
                {                    
                     $rootScope.message="This Faculty is teaching a class already at this timeslot"; 
                    
                }
    
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
      
      
        //from room i can get room capacity
    }
        
    
    $scope.classesAll = [];
    $scope.classes = [];
        
        
        
        
    $scope.getAllClasses = function () {
        //$scope.display1=true;
        //$scope.display2=false;
        // $scope.toggle();         
        $http.get('../backend/getAllClasses.php').then(function successCallback(response) {
            $scope.classesAll = response.data;
            console.log($scope.classesAll);
            $scope.numofrecords = $scope.classesAll.length;
            //    console.log($scope.numofrecords);            
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }
            //i want to show only first 5
            $scope.classes = $scope.classesAll.slice(0, 15);
            //   console.log($scope.classesAll);
            console.log($scope.classes);
            //classes is an array of objects
            //i want to filter this data to show first 10 records
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };
        
        
    $scope.searchClasses = function () {
        //  console.log($scope.department.department_name);
        console.log("Here" + $scope.selectedterm);
        //function in jquery to filter the record
        $scope.classes = $.grep($scope.classesAll, function (e) {
            if (typeof ($scope.selectedterm) !== 'undefined' && typeof ($scope.department) === 'undefined') {
                switch ($scope.selectedterm) {
                case "1":
                    return (e.YEAR === "2016" && e.semester === "Spring");
                    break;
                case "2":
                    return (e.YEAR === "2016" && e.semester === "Summer");
                    break;
                case "3":
                    return (e.YEAR === "2016" && e.semester === "Fall");
                    break;
                case "4":
                    return (e.YEAR === "2016" && e.semester === "Winter");
                    break;
                case "5":
                    return (e.YEAR === "2017" && e.semester === "Spring");
                    break;
                case "6":
                    return (e.YEAR === "2017" && e.semester === "Summer");
                    break;
                case "7":
                    return (e.YEAR === "2017" && e.semester === "Fall");
                    break;
                case "8":
                    return (e.YEAR === "2017" && e.semester === "Winter");
                    break;
                case "9":
                    return (e.YEAR === "2018" && e.semester === "Spring");
                    break;
                case "10":
                    return (e.YEAR === "2018" && e.semester === "Summer");
                    break;
                case "11":
                    return (e.YEAR === "2018" && e.semester === "Fall");
                    break;
                case "12":
                    return (e.YEAR === "2018" && e.semester === "Winter");
                    break;
                }
            }
            else if (typeof ($scope.selectedterm) !== 'undefined' && typeof ($scope.department) !== 'undefined') {
                switch ($scope.selectedterm) {
                case "1":
                    return (e.YEAR === "2016" && e.semester === "Spring" && e.department === $scope.department.department_name);
                    break;
                case "2":
                    return (e.YEAR === "2016" && e.semester === "Summer" && e.department === $scope.department.department_name);
                    break;
                case "3":
                    return (e.YEAR === "2016" && e.semester === "Fall" && e.department === $scope.department.department_name);
                    break;
                case "4":
                    return (e.YEAR === "2016" && e.semester === "Winter" && e.department === $scope.department.department_name);
                    break;
                case "5":
                    return (e.YEAR === "2017" && e.semester === "Spring" && e.department === $scope.department.department_name);
                    break;
                case "6":
                    return (e.YEAR === "2017" && e.semester === "Summer" && e.department === $scope.department.department_name);
                    break;
                case "7":
                    return (e.YEAR === "2017" && e.semester === "Fall" && e.department === $scope.department.department_name);
                    break;
                case "8":
                    return (e.YEAR === "2017" && e.semester === "Winter" && e.department === $scope.department.department_name);
                    break;
                case "9":
                    return (e.YEAR === "2018" && e.semester === "Spring" && e.department === $scope.department.department_name);
                    break;
                case "10":
                    return (e.YEAR === "2018" && e.semester === "Summer" && e.department === $scope.department.department_name);
                    break;
                case "11":
                    return (e.YEAR === "2018" && e.semester === "Fall" && e.department === $scope.department.department_name);
                    break;
                case "12":
                    return (e.YEAR === "2018" && e.semester === "Winter" && e.department === $scope.department.department_name);
                    break;
                }
            }
            else if (typeof ($scope.selectedterm) === 'undefined' && typeof ($scope.department) !== 'undefined') {
                switch ($scope.selectedterm) {
                case "1":
                    return (e.department === $scope.department.department_name);
                    break;
                case "2":
                    return (e.department === $scope.department.department_name);
                    break;
                case "3":
                    return (e.department === $scope.department.department_name);
                    break;
                case "4":
                    return (e.department === $scope.department.department_name);
                    break;
                case "5":
                    return (e.department === $scope.department.department_name);
                    break;
                case "6":
                    return (e.department === $scope.department.department_name);
                    break;
                case "7":
                    return (e.department === $scope.department.department_name);
                    break;
                case "8":
                    return (e.department === $scope.department.department_name);
                    break;
                case "9":
                    return (e.department === $scope.department.department_name);
                    break;
                case "10":
                    return (e.department === $scope.department.department_name);
                    break;
                case "11":
                    return (e.department === $scope.department.department_name);
                    break;
                case "12":
                    return (e.department === $scope.department.department_name);
                    break;
                }
            }
        });
        console.log($scope.classes);
        //this is to set page numbers
        $scope.numofrecords = $scope.classes.length;
        //console.log($scope.numofrecords);            
        $scope.pages = Math.ceil($scope.numofrecords / 15);
        $scope.pagesCollection = []; //set it back to empty
        for (var i = 1; i <= $scope.pages; i++) {
            $scope.pagesCollection.push(i);
        }
    }
    
    
    
    
    $scope.updateClass = function(){        
        
        $scope.professor= $scope.faculty1.user_id;     
        
        var roomCapacity = $.grep($scope.roomsAll, function (e) {
            // console.log($scope.class);
            return (e.building_name === $scope.class.building && e.room_number === $scope.room.room_number);
        });
        
        $scope.setDays2(); //days2 array is populated
        console.log(days2);
        
        //Before update class check for conflicts
        $scope.facultyClasses = [];
        
                
        //var uid = $cookieStore.get("uid");
        $http.get('../backend/getClassesTaught.php?uid=' + $scope.professor + '&semester=' + $scope.semester + '&year=' + $scope.year).then(function successCallback(response){            
            
            $scope.facultyClasses = response.data;            
            
            var FacultyClasses = $.grep($scope.facultyClasses, function (e) {
                return (e.time_period ===  $scope.time && e.semester === $scope.semester && e.year === $scope.year && ((e.day1.trim() === days2[0] || e.day1.trim() === days2[1]) || (e.day2.trim() === days2[0] || e.day2.trim() === days2[1])));
            });
            
            console.log($scope.facultyClasses);   
            console.log(FacultyClasses.length);  //repeat or not            
                                 
            if(FacultyClasses.length==0){
                
                //THis is chekcing time and location clash
                var classArray = $.grep($scope.classesAll, function (e) {
                    console.log($scope.class);
                    return (e.YEAR === $scope.year && e.semester === $scope.semester && e.building_name === $scope.class.building && e.room_number === $scope.room.room_number && e.time_period === $scope.time && ((e.day1.trim() === days2[0] || e.day1.trim() === days2[1]) || (e.day2.trim() === days2[0] || e.day2.trim() === days2[1])));
                });
                //i wana check here faculty timeslot clash
                console.log(classArray.length); //class array length       
                console.log(classArray);
                
                
                if(classArray.length > 0 && classArray[0].class_id != $scope.class_id){
                            
                    
                    $rootScope.message = "Your new class's schedule clashes with the schedule of class with ID " + classArray[0].class_id + "";
                    return;
                }
                else  //it is okay to update
                {
                    $http.post('../backend/updateClass.php', {
                    classid: $scope.class_id
                    , building: $scope.class.building
                    , room: $scope.room.room_number
                    , year: $scope.year
                    , semester: $scope.semester
                    , time: $scope.time
                    , section: $scope.section
                    , days: days2
                    , capacity: roomCapacity[0].room_capacity
                    , professor: $scope.professor
                }).then(function successCallback(response) {
                    if (response.data.trim() === 'true') {
                        $rootScope.message = "Class has been updated";
                        $scope.done = true;
                    }
                    else if (response.data.trim() === 'redundant') {
                        console.log("User exists");
                        $rootScope.message = "User e-mail alreadys exists in the system!";
                    }
                    else if(response.data.trim() === 'problem4'){                        
                        $rootScope.message = "This faculty is already teaching 4 classes!";                 
                    }
                    else {
                        $rootScope.message = "There has been a problem updating a class!";
                        console.log("Sorry nigga");
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
                    
                }       
        
            }
            else{
                  $rootScope.message = "This faculty is already teaching at this timeslot";
                
            }
    }, function errorCallback(response) {
                    console.log(response);
                });
    }
    
    
    $scope.deleteClass = function () {
        console.log("Delete function");
        $http.post('../backend/deleteCourse.php', {
            crn: $scope.idcourse
        , }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "Course has been deleted";
                $scope.done = true;
                $scope.getAllCourses();
                $scope.display1 = true;
                $scope.display2 = false;
            }
            else if (response.data.trim() === 'redundant') {
                console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            }
            else {
                $rootScope.message = "There has been a problem deleting a course!";
                console.log("Sorry nigga");
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    $scope.movePage = function (num) {
        $scope.readStartIndex = 0;
        $scope.readEndIndex = 15;
        //console.log(num);        
        $scope.readStartIndex = $scope.readStartIndex + (num * 15);
        $scope.readEndIndex = $scope.readEndIndex + (num * 15);
        //console.log($scope.classesAll);
        //console.log($scope.classes);        
        $scope.classes = $scope.classesAll.slice($scope.readStartIndex, $scope.readEndIndex);
    }
    $scope.resetCheckedDays = function () {
        $scope.mon = false;
        $scope.tue = false;
        $scope.wed = false;
        $scope.thu = false;
        $scope.fri = false;
    };
    $scope.getAllClasses();
}]);