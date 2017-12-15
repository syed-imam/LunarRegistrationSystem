// Admin-Student Controller - Contains all CRUD operations about student entities
myApp.controller("researcherPanelController", ['$window', '$filter', '$rootScope', '$scope', '$http', '$location', '$log', '$timeout', '$cookieStore', function ($window, $filter, $rootScope, $scope, $http, $location, $log, $timeout, $cookieStore) {

	$scope.majorCountData = [];
	$scope.minorCountData = [];
	$scope.courseCountData = [];
	$scope.courseGradeAverage = [];
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.display3 = false;
    $scope.display4 = false;
    $scope.display5 = false;	
	
    $scope.getMajorCount = function () {
        $http.get('../backend/getMajorEnrollment.php').then(function successCallback(response) {
            $scope.majorCountData = response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };
	
	$scope.getMinorCount = function () {
        $http.get('../backend/getMinorEnrollment.php').then(function successCallback(response) {
            $scope.minorCountData = response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };

	$scope.getCourseCount = function () {
        $http.get('../backend/getCourseEnrollment.php').then(function successCallback(response) {
            $scope.courseCountData = response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };
	
	$scope.getCourseAverageGrade = function () {
        $http.get('../backend/getCourseAverage.php').then(function successCallback(response) {
            $scope.courseGradeAverage = response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    };
	
	$scope.getMajorCount();
	$scope.getMinorCount();
	$scope.getCourseCount();
	$scope.getCourseAverageGrade();

}]);