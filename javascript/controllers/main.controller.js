// Main Controller
myApp.controller("mainController", ['$rootScope', '$scope', '$http', '$location', '$log', '$cookieStore', function ($rootScope, $scope, $http, $location, $log, $cookieStore) {
    $rootScope.loggedIn = $cookieStore.get('logged');
    $rootScope.loggedtype = $cookieStore.get('utype');
    $rootScope.message = "";
    // Close the dialog box
    $scope.close = function () {
            $rootScope.message = "";
        }
        // Logout
    $scope.logout = function () {
            $http.get('../backend/logout.php').then(function () {
                $cookieStore.put('logged', false);
                $cookieStore.put('uid', false);
                $cookieStore.put('utype', false);
                $rootScope.loggedIn = $cookieStore.get('logged');
                $rootScope.message = "You have logged out!";
            });
        }
        // Login
    $scope.logIn = function () {
        var usertype;
        $http.post('../backend/login.php', {
            username: $scope.username
            , password: $scope.password
        }).then(function successCallback(response) {
            if (response.data.user_id > 0) {
                $cookieStore.put('logged', true);
                $cookieStore.put('uid', parseInt(response.data.user_id));
                $rootScope.loggedIn = $cookieStore.get('logged');
                if (response.data.user_type === "s") {
                    usertype = 1; // student
                    if ($rootScope.loggedIn === true) {
                        $rootScope.loggedtype = 1;
						window.location = "#!/student-panel";
                    }
                }
                else if (response.data.user_type === "a") {
                    usertype = 2; // admin
                    if ($rootScope.loggedIn === true) {
						$rootScope.loggedtype = 2;
                        window.location = "#!/admin";
                    }
                }
                else if (response.data.user_type === "f") {
                    usertype = 3; // faculty
                    if ($rootScope.loggedIn === true) {
						$rootScope.loggedtype = 3;
                        window.location = "#!/faculty-panel";
                    }
                }
                else if (response.data.user_type === "r") {
                    usertype = 4; // faculty
                    if ($rootScope.loggedIn === true) {
						$rootScope.loggedtype = 4;
                        window.location = "#!/researcher-panel";
                        window.location = "#!/researcher-panel";
						
                    }
                }
                $cookieStore.put('utype', usertype);
            }
            else {
                $rootScope.message = "Username or password does not match!";
            }
        }, function errorCallback(error) {});
    };
}]);