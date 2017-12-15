myApp.controller("courseController", ['DepartmentList', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', '$compile', function (DepartmentList, $rootScope, $scope, $http, $location, $log, $timeout, $compile) {
    DepartmentList.getAllDepartments(); //getting departments dynamically
    $scope.selectedIndex = 0;
    
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
        console.log($scope.pages);
        console.log($scope.selectedIndex);
    };
    
    $scope.prereqs = [];
    $scope.addPrereq = function () {
        console.log($scope.prereqs);
        $scope.prereqs.push({
            courseID: ''
        });
    };
    
    $scope.removePrereq = function () {
        var lastItem = $scope.prereqs.length - 1;
        $scope.prereqs.splice(lastItem);
    };
    
    $scope.addPrereqForCourse = function () {
        console.log($scope.prereqForCourse);
        $scope.prereqForCourse.push({
            prereq_id: ''
        });
    };
    
    $scope.removePrereqForCourse = function () {
        var lastItem = $scope.prereqForCourse.length - 1;
        $scope.prereqForCourse.splice(lastItem);
    };
    
    $scope.course = {};
    $scope.idcourse;
    $scope.numofrecords = 0;
    $scope.pages = 0;
    $scope.pagesCollection = [];
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.departmentdropdownlist = false;
    $scope.otheroptiontextfield = true;
    $scope.disabledField = true;
    $scope.selectedfilter = "CRN";
    $scope.allowinput = false;
    $scope.coursefilter = '';
    
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
    
    $scope.updateformdata = function (obj) {
        //Doing some crap here
        $scope.prereqForCourse = $.grep($scope.coursesAllWithDuplicates, function (e) {
            return (e.course_id === obj.course_id && e.prereq_id != null);
        });
        console.log($scope.prereqForCourse);
        console.log($rootScope.departments);
        $scope.display2 = true;
        $scope.display1 = false;
        console.log(obj.department);
        $scope.idcourse = obj.course_id;
        $scope.crctitle = obj.course_name;
        $scope.crcdesc = obj.course_description;
        $scope.crccredits = obj.credits;
        $scope.selecteddepartment = {
            department_name: obj.department
        };
        console.log($scope.selecteddepartment);
    };
    
    $scope.toggle = function () {
        $scope.disabledField = true;
        $scope.display2 = false;
        $scope.display1 = true;
    };
    
    //In future, i will fetch this as json from database
    $scope.addCourse = function () {
        $scope.course.department = $scope.course.department.department_name;
        console.log($scope.course);
        console.log($scope.prereq);
        console.log($scope.prereqs);
        $http.post('../backend/addCourse.php', {
            data: $scope.course
            , prereqs: $scope.prereqs
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                console.log("Good job");
                $rootScope.message = "A new course has been added!";
                $scope.done = true;
            }
            else if (response.data.trim() === 'redundant') {
                console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            }
            else {
                $rootScope.message = "There has been a problem adding a new student!";
                console.log("Sorry");
                console.log(response);
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    
    $scope.coursesAll = [];
    $scope.courses = [];
    
    $scope.getAllCourses = function () {
        $http.get('../backend/getAllCourses.php').then(function successCallback(response) {
            $scope.coursesAll = response.data;
            $scope.coursesAllWithDuplicates = $scope.coursesAll;
            //Removing duplicates from the json
            var dups = [];
            $scope.coursesAll = $scope.coursesAll.filter(function (el) {
                // If it is not a duplicate, return true
                if (dups.indexOf(el.course_id) == -1) {
                    dups.push(el.course_id);
                    return true;
                }
                return false;
            });
            $scope.numofrecords = $scope.coursesAll.length;
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }
            //i want to show only first 5
            $scope.courses = $scope.coursesAll.slice(0, 15);
            //   console.log($scope.coursesAll);
            console.log($scope.courses);
            //courses is an array of objects
            //i want to filter this data to show first 10 records
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };
    
    $scope.getCourseById = function () {
        if ($scope.selectedfilter === "All") {
            console.log($scope.coursesAll);
            $scope.courses = $scope.coursesAll;
            //set pages
            $scope.numofrecords = $scope.courses.length;
            //console.log($scope.numofrecords);            
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }
            return;
        }
        //function in jquery to filter the record
        $scope.courses = $.grep($scope.coursesAll, function (e) {
            if (typeof ($scope.coursefilter) != 'undefined') {
                $scope.selectedfilter = $scope.selectedfilter.trim();
                $scope.coursefilter = $scope.coursefilter.trim();
                switch ($scope.selectedfilter) {
                case "CRN":
                    return (e.course_id === $scope.coursefilter);
                    break;
                case "Title":
                    return (e.course_name.toUpperCase().includes($scope.coursefilter.toUpperCase()));
                    break;
                case "Department":
                    //console.log(e.department.toUpperCase() +"   "+$scope.coursefilter.toUpperCase());
                    return (e.department === $scope.department.department_name);
                    break;
                default:
                    break;
                }
            }

        });
        console.log($scope.courses);
        //this is to set page numbers
        $scope.numofrecords = $scope.courses.length;
        //console.log($scope.numofrecords);            
        $scope.pages = Math.ceil($scope.numofrecords / 15);
        $scope.pagesCollection = []; //set it back to empty
        for (var i = 1; i <= $scope.pages; i++) {
            $scope.pagesCollection.push(i);
        }
    };
    
    $scope.updateCourse = function () {
        //how to update the prerequisites?!    
        $http.post('../backend/updateCourse.php', {
            crn: $scope.idcourse
            , title: $scope.crctitle
            , desc: $scope.crcdesc
            , credits: $scope.crccredits
            , department: $scope.selecteddepartment.department_name
            , prereqs: $scope.prereqForCourse
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "Course has been updated";
                $scope.done = true;
            }
            else if (response.data.trim() === 'redundant') {
                console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            }
            else {
                $rootScope.message = "There has been a problem updating a course!";
                console.log("Sorry nigga");
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    
    $scope.deleteCourse = function () {
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
    };
    
    $scope.movePage = function (num) {
        $scope.readStartIndex = 0;
        $scope.readEndIndex = 15;
        $scope.readStartIndex = $scope.readStartIndex + (num * 15);
        $scope.readEndIndex = $scope.readEndIndex + (num * 15);
        $scope.courses = $scope.coursesAll.slice($scope.readStartIndex, $scope.readEndIndex);
    };
    
    $scope.getAllCourses();
}]);