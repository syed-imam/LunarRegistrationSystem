// Admin-Faculty Controller - Contains all CRUD operations about faculty entities
myApp.controller("facultyController", ['DepartmentList', '$window', '$filter', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', function (DepartmentList, $window, $filter, $rootScope, $scope, $http, $location, $log, $timeout) {

	DepartmentList.getAllDepartments();
	$scope.facultys = []; // Result of many facultys will be held here
	$scope.faculty = {}; // Result of a single faculty will be held here
	$scope.uFaculty = {};
	$scope.idnum = null;
	$scope.numofrecords = 0;
	$scope.pages = 0;
	$scope.pagesCollection = [];
	$scope.display1 = true;
	$scope.display2 = false;
	$scope.facultysAll = [];
	$scope.disabledField = true;
	$scope.facultyFilter = "";

	// Handle the gender radio button
	$scope.gender = {
		type: ""
	}
	
		$scope.faculty = {
		department: ""
	}

	$scope.selectedIndex = 0;
	$scope.itemClicked = function ($index) {
		$scope.selectedIndex = $index;
	};

	// Add a faculty
	$scope.addFaculty = function () {

		$scope.faculty.department = $scope.faculty.department.department_name;
		console.log($scope.faculty.department);
		console.log($scope.faculty);

		// Handle the date formatting
		$scope.faculty.birthday = new Date($scope.faculty.birthday.getMonth() + 1 + '/' + $scope.faculty.birthday.getDate() + '/' + $scope.faculty.birthday.getFullYear());

		// Send all the modeled data to the back-end
		$http.post('../backend/addFaculty.php', {
			data: $scope.faculty
		}).then(function successCallback(response) {
			if (response.data.trim() === 'true') {
				console.log("Good job");
				$rootScope.message = "A new faculty has been added!";
				$scope.done = true;
			} else if (response.data.trim() === 'redundant') {
				console.log("User exists");
				$rootScope.message = "User e-mail alreadys exists in the system!";
			} else {
				$rootScope.message = "There has been a problem adding a new faculty!";
				console.log("Sorry");
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.getAllFaculty = function () {
		$scope.disabledField = true;
		$http.get('../backend/getAllFaculty.php')
			.then(function successCallback(response) {
				$scope.facultysAll = response.data;
			console.log($scope.facultysAll)
				$scope.numofrecords = $scope.facultysAll.length;
				$scope.pages = Math.ceil($scope.numofrecords / 15);
				$scope.pagesCollection = []; //set it back to empty

				for (var i = 1; i <= $scope.pages; i++) {
					$scope.pagesCollection.push(i);
				}

				$scope.facultys = $scope.facultysAll.slice(0, 15);

			}, function errorCallback(err) {
				console.log("ERROR ", err);
			});
	};

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

	$scope.getFacultyById = function () {
		if ($scope.selectedfilter === "All") {
			console.log($scope.facultysAll);
			$scope.facultys = $scope.facultysAll;
			//set pages
			$scope.numofrecords = $scope.facultys.length;
			//console.log($scope.numofrecords);            
			$scope.pages = Math.ceil($scope.numofrecords / 15);
			$scope.pagesCollection = []; //set it back to empty
			for (var i = 1; i <= $scope.pages; i++) {
				$scope.pagesCollection.push(i);
			}
			return;
		}
		//function in jquery to filter the record
		$scope.facultys = $.grep($scope.facultysAll, function (e) {
			if (typeof ($scope.facultyFilter) != 'undefined') {
				$scope.selectedfilter = $scope.selectedfilter.trim();
				$scope.facultyFilter = $scope.facultyFilter.trim();
				switch ($scope.selectedfilter) {
					case "firstname":
						return (e.user_fname.toUpperCase() === $scope.facultyFilter.toUpperCase());
						break;
					case "lastname":
						return (e.user_lname.toUpperCase().includes($scope.facultyFilter.toUpperCase()));
						break;
					case "idnumber":
						return (e.user_id === $scope.facultyFilter);
						break;
					default:
						break;
				}
			}
		});
		//this is to set page numbers
		$scope.numofrecords = $scope.facultys.length;
		//console.log($scope.numofrecords);            
		$scope.pages = Math.ceil($scope.numofrecords / 15);
		$scope.pagesCollection = []; //set it back to empty
		for (var i = 1; i <= $scope.pages; i++) {
			$scope.pagesCollection.push(i);
		}
	};

	// Update a single faculty
	$scope.updateFaculty = function () {
				$scope.uFaculty.department = $scope.uFaculty.department.department_name;

		$http.post('../backend/updateFaculty.php', {
			data: $scope.uFaculty
		}).then(function successCallback(response) {
			if (response.data.trim() === 'true') {
				$rootScope.message = "Faculty has been updated";
				$scope.done = true;
			} else if (response.data.trim() === 'redundant') {
				console.log("User exists");
				$rootScope.message = "User e-mail alreadys exists in the system!";
			} else {
				$rootScope.message = "There has been a problem updating a faculty!";
				console.log("Sorry nigga");
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.deleteFaculty = function () {
		$http.post('../backend/deleteFaculty.php', {
			id: $scope.uFaculty.id,
		}).then(function successCallback(response) {
			$scope.getAllFacultys();
			if (response.data.trim() === 'true') {
				$rootScope.message = "Faculty has been deleted";
				$scope.display1 = true;
				$scope.display2 = false;
			} else {
				$rootScope.message = "There has been a problem deleting a faculty!";
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.movePage = function (num) {
		$scope.readStartIndex = 0;
		$scope.readEndIndex = 15;
		$scope.readStartIndex = $scope.readStartIndex + (num * 15);
		$scope.readEndIndex = $scope.readEndIndex + (num * 15);
		$scope.facultys = $scope.facultysAll.slice($scope.readStartIndex, $scope.readEndIndex);
	}

	$scope.updateFormData = function (obj) {
		$scope.display2 = true;
		$scope.display1 = false;
		$scope.uFaculty.id = obj.user_id;
		$scope.uFaculty.firstname = obj.user_fname;
		$scope.uFaculty.lastname = obj.user_lname;
		$scope.uFaculty.email = obj.user_email;
		$scope.uFaculty.password = obj.user_password;
		$scope.uFaculty.phonenumber = obj.user_phone;
		$scope.uFaculty.streetaddress = obj.user_street;
		$scope.uFaculty.state = obj.user_state;
		$scope.uFaculty.city = obj.user_city;
		$scope.uFaculty.zipcode = obj.user_zipcode;
		$scope.uFaculty.birthday = new Date(obj.user_birthday);
		$scope.uFaculty.gender = obj.user_gender;
		
		    $scope.uFaculty.department = {
        department_name: obj.department_name
    };
	}

	$scope.toggle = function () {
		$scope.disabledField = true;
		$scope.display2 = false;
		$scope.display1 = true;
	};

	$scope.getAllFaculty();
}]);