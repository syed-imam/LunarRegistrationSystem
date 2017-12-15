myApp.controller("roomController", ['$rootScope', '$scope', '$http', '$location', '$log', '$timeout','RoomList', function ($rootScope, $scope, $http, $location, $log, $timeout, RoomList) {
    $scope.room = {};
    $scope.uRoom = {};
    $scope.numofrecords = 0;
    $scope.pages = 0;
    $scope.pagesCollection = [];      
    $scope.roomsAll = [];
    $scope.rooms = [];
    $scope.display1 = true;
    $scope.display2 = false;
    $scope.disabledField = true;
    
    $scope.selectedIndex = 0;
    $scope.itemClicked = function ($index) {
        $scope.selectedIndex = $index;
    };
    
    $scope.toggle = function () {
        $scope.disabledField = true;
        $scope.display2 = false;
        $scope.display1 = true;
    };
    
    $scope.addRoom = function () {
        $http.post('../backend/addRoom.php', {
            data: $scope.room
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "A new room has been added!";
                $scope.done = true;
            }
            else if (response.data.trim() === 'redundant') {
                $rootScope.message = "Room alreadys exists in the system!";
            }
            else {
                $rootScope.message = "There has been a problem adding a new room!";
            }
        }, function errorCallback(response) {
            console.log("THIS ERROR:" + response);
        });
    }
    
    $scope.getAllRooms=function () {       
    /*   
        $http.get('../backend/getAllRooms.php').then(function successCallback(response) {
        $rootScope.roomsAll = response.data;
        console.log($scope.roomsAll);
            
            
            $scope.numofrecords = $scope.roomsAll.length;
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            
            for (var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }

            $scope.rooms = $scope.roomsAll.slice(0, 15);
        }, function errorCallback(err) {
            console.log("ERROR ", err);
        });
    */
            var roomPromise=RoomList.getAllRooms(); 
            roomPromise.then(function(result){
            
       //     $rootScope.roomsAll=result; 
			$scope.roomsAll=result;   	
        //    $scope.numofrecords = $rootScope.roomsAll.length;
			$scope.numofrecords = $scope.roomsAll.length	
            $scope.pages = Math.ceil($scope.numofrecords / 15);
            $scope.pagesCollection = []; //set it back to empty
            
            for(var i = 1; i <= $scope.pages; i++) {
                $scope.pagesCollection.push(i);
            }

            $scope.rooms = $scope.roomsAll.slice(0, 15);
                    
            });
        
        
        
    }
    
    // Update a single student
    $scope.updateRoom = function () {
        console.log($scope.uRoom);
        $http.post('../backend/updateRoom.php', {
            data: $scope.uRoom
        }).then(function successCallback(response) {
            if (response.data.trim() === 'true') {
                $rootScope.message = "Room has been updated";
            } else if (response.data.trim() === 'redundant') {
                $rootScope.message = "Room alreadys exists in the system!";
            } else {
                $rootScope.message = "There has been a problem updating the room!";
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    
    
    
    $scope.deleteRoom = function () {
        $http.post('../backend/deleteRoom.php', {
            id: $scope.uStudent.id,
        }).then(function successCallback(response) {
            $scope.getAllRooms();
            if (response.data.trim() === 'true') {
                $rootScope.message = "Room has been deleted";
                $scope.display1 = true;
                $scope.display2 = false;
            } else {
                $rootScope.message = "There has been a problem deleting a room!";
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    
    $scope.updateFormData = function (obj) {
        $scope.display2 = true;
        $scope.display1 = false;
        console.log($scope.display2, $scope.display1);
        $scope.uRoom.number = obj.room_number;
        $scope.uRoom.buildingName = obj.building_name;
        $scope.uRoom.capacity = obj.room_capacity;
    }
    
    $scope.movePage = function (num) {
        $scope.readStartIndex = 0;
        $scope.readEndIndex = 15;
        $scope.readStartIndex = $scope.readStartIndex + (num * 15);
        $scope.readEndIndex = $scope.readEndIndex + (num * 15);      
        $scope.rooms = $scope.roomsAll.slice($scope.readStartIndex, $scope.readEndIndex);
    }
    
    $scope.getAllRooms();

}]);