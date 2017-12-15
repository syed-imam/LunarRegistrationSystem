myApp.controller("departmentController", ['$rootScope', '$scope', '$http', '$location', '$log', '$timeout','DepartmentList', function ($rootScope, $scope, $http, $location, $log, $timeout,DepartmentList) {

    $rootScope.department={};
    
    
    
    $scope.addDepartment=function(){
        
    console.log($scope.department);    
        
        $http.post('../backend/addDepartment.php', {department:$scope.department}).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                console.log("Good job");
                $rootScope.message = "A new department has been added!";
                $scope.done = true;
            } else if (response.data.trim() === 'redundant') {
                console.log("User exists");
                $rootScope.message = "User e-mail alreadys exists in the system!";
            } else {
                $rootScope.message = "There has been a problem adding a new department";
                console.log("Sorry");
                console.log(response);
            }
        }, function errorCallback(response) {
            console.log(response);
        });
                
    }
    
     $rootScope.getAll = 85;
    
     $rootScope.getAllDepartments=function(){

         
        DepartmentList.getAllDepartments(); 
         
         /*
             $http.get('../backend/getAllDepartments.php')
            .then(function successCallback(response) {
                 
               $scope.departments = response.data;
               $rootScope.allDepartments=$scope.departments;     
                console.log($scope.departments); 
            
             }, function errorCallback(err) {
                console.log("ERROR ", err);
            });
        */
         
         
        
    }
    
   
}]);