// Admin-Student Controller - Contains all CRUD operations about student entities
myApp.controller("studentController", ['$window', '$filter', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', '$cookieStore', 'HoldsList', 'MajorList', 'MinorList', 'FacultyList', function ($window, $filter, $rootScope, $scope, $http, $location, $log, $timeout, $cookieStore, HoldsList, MajorList, MinorList, FacultyList) {
    $scope.students = []; // Result of many students will be held here
    $scope.student = {}; // Result of a single student will be held here
    $scope.uStudent = {};
    $scope.idnum = null;
    $scope.numofrecords = 0;
    $scope.pages = 0;
    $scope.pagesCollection = [];
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.studentsAll = [];
    $scope.disabledField = true;
    $scope.studentFilter = "";
    $scope.thisStudent = {};
    $scope.thisHolds = {};
    $scope.studentHolds = [];
    $scope.selectedClasses = {};
    $scope.holds = [];
    $scope.totalCreditsStudent = 0;
    $scope.thisStudentInfo = null // everything about an individual student
    $scope.studentStanding = '';
    $scope.transcriptClasses = null;
    $scope.accumulatedGPA = 0;
    $scope.smallGPA = [];

    $scope.major = {
        major_name: ""
    };
    $scope.minor = {
        minor_name: ""
    };

    var majorPromise = MajorList.getAllMajors();
    majorPromise.then(function (result) {
        $scope.majors = result;
        //console.log($scope.majors);
    });

    var minorPromise = MinorList.getAllMinors();
    minorPromise.then(function (result) {
        $scope.minors = result;
        //console.log($scope.minors);
    });

    var facultyPromise = FacultyList.getAllFaculty();
    facultyPromise.then(function (result) {
        $scope.facultys = result;
        //console.log($scope.facultys);
    });

    $scope.getStudentTotalCredits = function () {

        var sid = $cookieStore.get('uid');

        $http.get('../backend/getStudentsTotalCredits.php?student_id=' + sid).then(function successCallback(response) {
            $scope.totalCreditsStudent = response.data[0].total_credits;
            if ($scope.totalCreditsStudent < 24) {
                $scope.studentStanding = 'Freshman';
            } else if ($scope.totalCreditsStudent < 48) {
                $scope.studentStanding = 'Sophomore';
            } else if ($scope.totalCreditsStudent < 72) {
                $scope.studentStanding = 'Junior';
            } else if ($scope.totalCreditsStudent < 96) {
                $scope.studentStanding = 'Senior';
            }
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }

    $scope.getStudentInfo = function (callback) {
        var sid = $cookieStore.get('uid');

        $http.get('../backend/getStudentInfo.php?student_id=' + sid).then(function successCallback(response) {
            if (response.data === "0") {
                $scope.creditsEarned = 0;
            } else {
                $scope.creditsEarned = parseInt(response.data[0].current_semester_credits);
            }
            if (response.data === "0") {
                $scope.selectedClasses = [];
            } else {
                $scope.selectedClasses = response.data;
            }

            callback(response);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }


    // Handle the gender radio button
    $scope.gender = {
        type: ""
    }
    $scope.selectedIndex = 0;
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };


    // Add a student
    $scope.addStudent = function () {
        //console.log($scope.student);

        $scope.student.major = $scope.major.major_name;
        if ($scope.minor) {
            $scope.student.minor = $scope.minor.minor_name;
        }
        $scope.student.faculty = $scope.faculty.faculty_id;
        // Handle the date formatting
        $scope.student.birthday = new Date($scope.student.birthday.getMonth() + 1 + '/' + $scope.student.birthday.getDate() + '/' + $scope.student.birthday.getFullYear());
        // Send all the modeled data to the back-end

        $http.post('../backend/addStudent.php', {
            data: $scope.student
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                //console.log("Good job");
                $rootScope.message = "A new student has been added!";
                $scope.done = true;
            } else if (response.data.trim() === 'redundant') {
                console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            } else {
                $rootScope.message = "There has been a problem adding a new student!";
                //console.log("Sorry");
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    $scope.getAllStudents = function () {
        $scope.disabledField = true;
        $http.get('../backend/getAllStudents.php').then(function successCallback(response) {
            //console.log(response.data);
            $scope.studentsAll = response.data;

            $scope.studentsAll = $.grep($scope.studentsAll, function (e) {
                return (e.user_type === "s");
            });

            $scope.numofrecords = $scope.studentsAll.length;
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }
            $scope.students = $scope.studentsAll.slice(0, 15);
            //console.log($scope.students);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };

    $scope.getStudentInfo(function () {
        //console.log("I am called");
        //console.log($scope.selectedClasses);
        $scope.getStudentHolds();
    });

    // All the individual student info
    $scope.getStudentHolds = function () {
        var sid = $cookieStore.get('uid');

        var holdPromise = HoldsList.getAllHolds(sid);

        holdPromise.then(function (result) {

            $scope.thisStudent = result;
            $scope.thisHolds = $scope.thisStudent.slice(1, $scope.thisStudent.length);

            $scope.thisStudentInfo = $.grep($scope.studentsAll, function (e) {
                return (e.user_id == $scope.thisStudent[0].user_id);
            });
        });
    };

    $scope.getStudentById = function () {
        if ($scope.selectedfilter === "All") {
            //console.log($scope.studentsAll);
            $scope.students = $scope.studentsAll;
            //set pages
            $scope.numofrecords = $scope.students.length;
            //console.log($scope.numofrecords);            
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }
            return;
        }
        //function in jquery to filter the record
        $scope.students = $.grep($scope.studentsAll, function (e) {
            if (typeof ($scope.studentFilter) != 'undefined') {
                $scope.selectedfilter = $scope.selectedfilter.trim();
                $scope.studentFilter = $scope.studentFilter.trim();
                switch ($scope.selectedfilter) {
                    case "firstname":
                        return (e.user_fname.toUpperCase() === $scope.studentFilter.toUpperCase());
                        break;
                    case "lastname":
                        return (e.user_lname.toUpperCase().includes($scope.studentFilter.toUpperCase()));
                        break;
                    case "idnumber":
                        return (e.user_id === $scope.studentFilter);
                        break;
                    default:
                        break;
                }
            }
        });

        //this is to set page numbers
        $scope.numofrecords = $scope.students.length;
        //console.log($scope.numofrecords);            
        $scope.pages = Math.ceil($scope.numofrecords / 15);
        $scope.pagesCollection = []; //set it back to empty
        for (var i = 1; i <= $scope.pages; i++) {
            $scope.pagesCollection.push(i);
        }
    }

    // GPA
    $scope.calculateGPA = function (classes) {
        //console.log("This is GPA Stuff");
        var allCredits = 0;
        var allTotal = 0;
        var smallCredits = 0;
        var smallTotal = 0;
        Object.keys(classes).forEach(function (key) {
            var ccc = classes[key]; //each class
            for ( var i = 0; i < ccc.length; i++){
                allTotal += parseInt(ccc[i].credits) * parseInt(ccc[i].enrol_grade);
                allCredits += parseInt(ccc[i].credits);
                smallTotal += parseInt(ccc[i].credits) * parseInt(ccc[i].enrol_grade);
                smallCredits += parseInt(ccc[i].credits);
                
            }
            
            $scope.smallGPA.push(smallTotal/smallCredits);
            smallCredits= 0;
            smallTotal = 0;
            
            $scope.accumulatedGPA = allTotal/allCredits;
        });
    }

    $scope.buildHolds = function () {

        $scope.holds = [];
        if ($scope.uStudent.academichold === true) {
            $scope.holds.push(1);
        }
        if ($scope.uStudent.bursarhold === true) {
            $scope.holds.push(2);
        }
        if ($scope.uStudent.disciplinaryhold === true) {
            $scope.holds.push(3);
        }
        if ($scope.uStudent.healthhold === true) {
            $scope.holds.push(4);
        }
    }


    // Update a single student
    $scope.updateStudent = function () {

        $scope.buildHolds();

        $scope.uStudent.majorthing = $scope.uStudent.major.major_name;
        if ($scope.uStudent.minor) {
            $scope.uStudent.minorthing = $scope.uStudent.minor.minor_name;
        }

        $scope.uStudent.facultyID = $scope.uStudent.faculty.faculty_id;

        //console.log("hereee", $scope.uStudent);

        $http.post('../backend/updateStudent.php', {
            data: $scope.uStudent,
            holds: $scope.holds
        }).then(function successCallback(response) {
            //console.log(response.data.trim());
            if (response.data.trim() === 'true') {
                $rootScope.message = "Student has been updated";
                $scope.done = true;
            } else if (response.data.trim() === 'redundant') {
                //console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            } else {
                $rootScope.message = "There has been a problem updating a student!";
               // console.log("Sorry nigga");
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.deleteStudent = function () {
        $http.post('../backend/deleteStudent.php', {
            id: $scope.uStudent.id,
        }).then(function successCallback(response) {
            $scope.getAllStudents();
            if (response.data.trim() === 'true') {
                $rootScope.message = "Student has been deleted";
                $scope.display1 = true;
                $scope.display2 = false;
            } else {
                $rootScope.message = "There has been a problem deleting a student!";
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.switchInputMethod = function () {
        if ($scope.selectedfilter === "firstname") {
            $scope.allowinput = false;
        } else if ($scope.selectedfilter === "lastname") {
            $scope.allowinput = false;
        } else if ($scope.selectedfilter === "All") {
            $scope.allowinput = true;
        } else {
            $scope.allowinput = false;
        }
    };

    $scope.movePage = function (num) {
        $scope.readStartIndex = 0;
        $scope.readEndIndex = 15;
        $scope.readStartIndex = $scope.readStartIndex + (num * 15);
        $scope.readEndIndex = $scope.readEndIndex + (num * 15);
        $scope.students = $scope.studentsAll.slice($scope.readStartIndex, $scope.readEndIndex);
    }

    $scope.updateFormData = function (obj) {
        var sid = obj.user_id;
        $scope.uStudent.academichold = false;
        $scope.uStudent.bursarhold = false;
        $scope.uStudent.disciplinaryhold = false;
        $scope.uStudent.healthhold = false;

        $http.get('../backend/getStudentHolds.php?id=' + sid).then(function successCallback(response) {
            $scope.studentHolds = [];
            $scope.studentHolds = response.data;
            $scope.display2 = true;
            $scope.display1 = false;
            $scope.uStudent.id = obj.user_id;
            $scope.uStudent.firstname = obj.user_fname;
            $scope.uStudent.lastname = obj.user_lname;
            $scope.uStudent.email = obj.user_email;
            $scope.uStudent.password = obj.user_password;
            $scope.uStudent.phonenumber = obj.user_phone;
            $scope.uStudent.streetaddress = obj.user_street;
            $scope.uStudent.state = obj.user_state;
            $scope.uStudent.city = obj.user_city;
            $scope.uStudent.zipcode = obj.user_zipcode;
            $scope.uStudent.birthday = new Date(obj.user_birthday);
            $scope.uStudent.gender = obj.user_gender;


            $scope.uStudent.major = {
                major_name: obj.major_name
            };

            $scope.uStudent.minor = {
                minor_name: obj.minor_name
            };

            $scope.uStudent.faculty = {
                faculty_id: obj.student_advisor
            };

            for (var i = 0; i < $scope.studentHolds.length; i++) {
                if ($scope.studentHolds[i].hold_id == 1) {
                    $scope.uStudent.academichold = true;
                }
                if ($scope.studentHolds[i].hold_id == 2) {
                    $scope.uStudent.bursarhold = true;
                }
                if ($scope.studentHolds[i].hold_id == 3) {
                    $scope.uStudent.disciplinaryhold = true;
                }
                if ($scope.studentHolds[i].hold_id == 4) {
                    $scope.uStudent.healthhold = true;
                }
            }

        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }

    $scope.showTranscript = function () {
        var sid = $cookieStore.get('uid');
        $http.get('../backend/transcript.php?id=' + sid).then(function successCallback(response) {
            //console.log("transcript:", response.data);
            $scope.transcriptClasses = response.data;
			console.log($scope.transcriptClasses);
            $scope.calculateGPA($scope.transcriptClasses);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }

    $scope.toggle = function () {
        $scope.disabledField = true;
        $scope.display2 = false;
        $scope.display1 = true;
    };
    $scope.getAllStudents();
    $scope.getStudentTotalCredits();

}]);
