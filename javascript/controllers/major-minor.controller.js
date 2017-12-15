myApp.controller("major-minorController", ['DepartmentList', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', function (DepartmentList, $rootScope, $scope, $http, $location, $log, $timeout) {

	DepartmentList.getAllDepartments();

	$scope.major = {};
	$scope.minor = {};
	$scope.uMajor = {};
	$scope.oMajor = {};
	$scope.oMinor = {};
	$scope.uMinor = {};
	$scope.numofrecords = 0;
	$scope.numofrecords1 = 0;
	$scope.pages = 0;
	$scope.pages1 = 0;
	$scope.pagesCollection = [];
	$scope.pagesCollection1 = [];
	$scope.majorsAll = [];
	$scope.majors = [];
	$scope.minorsAll = [];
	$scope.minors = [];
	$scope.disabledField = true;
	$scope.selectedfilter = "MajorName";
	$scope.selectedfilter1 = "MinorName";
	$scope.departmentdropdownlist = false;
	$scope.otheroptiontextfield = true;
	$scope.departmentdropdownlist1 = false;
	$scope.otheroptiontextfield1 = true;
	$scope.allowinput = false;
	$scope.majorfilter = '';
	$scope.minorfilter = '';

	$scope.selectedIndex = 0;
	$scope.itemClicked = function ($index) {
		$scope.selectedIndex = $index;
	};

	$scope.selectedIndex1 = 0;
	$scope.itemClicked1 = function ($index) {
		$scope.selectedIndex1 = $index;
	};

	$scope.toggle = function () {
		$scope.disabledField = true;
		$scope.display2 = false;
		$scope.display1 = true;
		$scope.display3 = false;
		$scope.display4 = false;
		$scope.display6 = false;
	};

	$scope.toggle1 = function () {
		$scope.disabledField = true;
		$scope.display2 = false;
		$scope.display1 = false;
		$scope.display3 = true;
		$scope.display4 = false;
		$scope.display7 = false;
	};

	$scope.addMajor = function () {
		$scope.major.department = $scope.major.department.department_name;
		console.log($scope.major);
		$http.post('../backend/addMajorMinor.php', {
			data: $scope.major
		}).then(function successCallback(response) {
			if (response.data.trim() === 'true') {
				$rootScope.message = "A new major/minor has been added!";
				$scope.done = true;
			} else if (response.data.trim() === 'redundant') {
				$rootScope.message = "Major/minor alreadys exists in the system!";
			} else {
				$rootScope.message = "There has been a problem adding a new major/minor!";
			}
		}, function errorCallback(response) {
			console.log("THIS ERROR:" + response);
		});

	}

	$scope.getAllMajors = function () {
		$http.get('../backend/getAllMajors.php').then(function successCallback(response) {
			$scope.majorsAll = response.data;
			$scope.numofrecords = $scope.majorsAll.length;
			$scope.pages = Math.ceil($scope.numofrecords / 15);
			$scope.pagesCollection = []; //set it back to empty

			for (var i = 1; i <= $scope.pages; i++) {
				$scope.pagesCollection.push(i);
			}

			$scope.majors = $scope.majorsAll.slice(0, 15);
		}, function errorCallback(err) {
			console.log("ERROR ", err);
		});

	}

	$scope.getAllMinors = function () {
		$http.get('../backend/getAllMinors.php').then(function successCallback(response) {
			$scope.minorsAll = response.data;
			$scope.numofrecords = $scope.minorsAll.length;
			$scope.pages = Math.ceil($scope.numofrecords / 15);
			$scope.pagesCollection = []; //set it back to empty

			for (var i = 1; i <= $scope.pages; i++) {
				$scope.pagesCollection.push(i);
			}

			$scope.minors = $scope.minorsAll.slice(0, 15);
		}, function errorCallback(err) {
			console.log("ERROR ", err);
		});
	}

	// Update a single student
	$scope.updateMajor = function () {

		$scope.uMajor.department = $scope.uMajor.department.department_name;
		console.log($scope.uMajor);
		console.log($scope.oMajor);
		$http.post('../backend/updateMajor.php', {

			data: $scope.uMajor,
			data1: $scope.oMajor
		}).then(function successCallback(response) {
			if (response.data.trim() === 'true') {
				$rootScope.message = "Major has been updated";
			} else if (response.data.trim() === 'redundant') {
				$rootScope.message = "Major alreadys exists in the system!";
			} else {
				$rootScope.message = "There has been a problem updating the major!";
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.updateMinor = function () {

		$scope.uMinor.department = $scope.uMinor.department.department_name;

		$http.post('../backend/updateMinor.php', {

			data: $scope.uMinor,
			data1: $scope.oMinor
		}).then(function successCallback(response) {
			if (response.data.trim() === 'true') {
				$rootScope.message = "Minor has been updated";
			} else if (response.data.trim() === 'redundant') {
				$rootScope.message = "Minor alreadys exists in the system!";
			} else {
				$rootScope.message = "There has been a problem updating the minor!";
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.updateFormData = function (obj) {
		$scope.display2 = true;
		$scope.display3 = false;
		$scope.display1 = false;
		$scope.display4 = false;
		console.log($scope.display2, $scope.display1);
		$scope.oMajor.name = obj.major_name;
		$scope.oMajor.department = obj.department_name;
		$scope.uMajor.name = obj.major_name;
		$scope.uMajor.department = obj.department_name;
	}

	$scope.updateFormData1 = function (obj) {
		$scope.display3 = false;
		$scope.display2 = false;
		$scope.display1 = false;
		$scope.display4 = true;
		console.log($scope.display2, $scope.display1);
		$scope.oMinor.name = obj.minor_name;
		$scope.oMinor.department = obj.department_name;
	}

	$scope.switchInputMethod = function () {
		if ($scope.selectedfilter === "Department") {
			$scope.otheroptiontextfield = false;
			$scope.departmentdropdownlist = true;
			$scope.allowinput = false;
		} else {
			$scope.otheroptiontextfield = true;
			$scope.departmentdropdownlist = false;
			$scope.allowinput = false;
		}
	};

	$scope.switchInputMethod1 = function () {
		if ($scope.selectedfilter1 === "Department") {
			$scope.otheroptiontextfield1 = false;
			$scope.departmentdropdownlist1 = true;
			$scope.allowinput = false;
		} else {
			$scope.otheroptiontextfield1 = true;
			$scope.departmentdropdownlist1 = false;
			$scope.allowinput = false;
		}
	};

	$scope.getMajorById = function () {

		//function in jquery to filter the record
		$scope.majors = $.grep($scope.majorsAll, function (e) {
			if (typeof ($scope.majorfilter) != 'undefined') {
				$scope.selectedfilter = $scope.selectedfilter.trim();
				$scope.majorfilter = $scope.majorfilter.trim();
				switch ($scope.selectedfilter) {
					case "MajorName":
						return (e.major_name.toUpperCase().includes($scope.majorfilter.toUpperCase()));
						break;
					case "Department":
						//console.log(e.department.toUpperCase() +"   "+$scope.coursefilter.toUpperCase());
						return (e.department_name === $scope.department.department_name);
						break;
					default:
						break;
				}
			}

		});
		console.log($scope.majors);
		//this is to set page numbers
		$scope.numofrecords = $scope.majors.length;
		//console.log($scope.numofrecords);            
		$scope.pages = Math.ceil($scope.numofrecords / 15);
		$scope.pagesCollection = []; //set it back to empty
		for (var i = 1; i <= $scope.pages; i++) {
			$scope.pagesCollection.push(i);
		}
	};

	$scope.getMinorById = function () {

		//function in jquery to filter the record
		$scope.minors = $.grep($scope.minorsAll, function (e) {
			if (typeof ($scope.minorfilter) != 'undefined') {
				$scope.selectedfilter1 = $scope.selectedfilter1.trim();
				$scope.minorfilter = $scope.minorfilter.trim();
				switch ($scope.selectedfilter1) {
					case "MinorName":
						return (e.minor_name.toUpperCase().includes($scope.minorfilter.toUpperCase()));
						break;
					case "Department":
						//console.log(e.department.toUpperCase() +"   "+$scope.coursefilter.toUpperCase());
						return (e.department_name === $scope.department.department_name);
						break;
					default:
						break;
				}
			}

		});
		console.log($scope.minors);
		//this is to set page numbers
		$scope.numofrecords1 = $scope.minors.length;
		//console.log($scope.numofrecords);            
		$scope.pages1 = Math.ceil($scope.numofrecords1 / 15);
		$scope.pagesCollection1 = []; //set it back to empty
		for (var i = 1; i <= $scope.pages1; i++) {
			$scope.pagesCollection1.push(i);
		}
	};

	$scope.movePage = function (num) {
		$scope.readStartIndex = 0;
		$scope.readEndIndex = 15;
		$scope.readStartIndex = $scope.readStartIndex + (num * 15);
		$scope.readEndIndex = $scope.readEndIndex + (num * 15);
		$scope.majors = $scope.majorsAll.slice($scope.readStartIndex, $scope.readEndIndex);
	}

	$scope.movePage1 = function (num) {
		$scope.readStartIndex1 = 0;
		$scope.readEndIndex1 = 15;
		$scope.readStartIndex1 = $scope.readStartIndex1 + (num * 15);
		$scope.readEndIndex1 = $scope.readEndIndex1 + (num * 15);
		$scope.minors = $scope.minorsAll.slice($scope.readStartIndex1, $scope.readEndIndex1);
	}
}]);