myApp.service("DepartmentList", function ($http, $rootScope) {
    this.getAllDepartments = function () {
        $http.get('../backend/getAllDepartments.php').then(function successCallback(response) {
            $rootScope.departments = response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
});


myApp.service("RoomList", function ($http) {
    this.getAllRooms = function () {

        return $http.get('../backend/getAllRooms.php').then(function successCallback(response) {
            return response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
});


myApp.service("HoldsList", function ($http) {

    this.getAllHolds = function (sid) {

        return $http.get('../backend/getStudentById.php?id=' + sid).then(function successCallback(response) {

            return response.data;

        }, function errorCallback(err) {

        });
    }

});

myApp.service("MajorList", function ($http) {
    this.getAllMajors = function () {
        return $http.get('../backend/getAllMajors.php').then(function successCallback(response) {
            return response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
});

myApp.service("MinorList", function ($http) {
    this.getAllMinors = function () {
        return $http.get('../backend/getAllMinors.php').then(function successCallback(response) {
            return response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
});

myApp.service("FacultyList", function ($http) {
    this.getAllFaculty = function () {
        return $http.get('../backend/getAllFaculty.php').then(function successCallback(response) {
            return response.data;
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    }
});
