//Lunar Registration System
var myApp = angular.module('LunarRegistrationSystem', ['ngRoute', 'ngCookies']);

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/guest.html'
    }).when('/login', {
        templateUrl: 'pages/login-page.html',
        controller: 'mainController'
    }).when('/logout', {
        templateUrl: 'pages/guest.html'
    }).when('/support', {
        templateUrl: 'pages/support.html'
    }).when('/welcomeStudent', {
        templateUrl: 'pages/welcome-student.html'
    }).when('/missionStatement', {
        templateUrl: 'pages/mission-statement.html',
        controller: 'welcomeController'
    }).when('/admin-student', {
        templateUrl: 'pages/admin-student.html',
        controller: 'studentController'
    }).when('/admin', {
        templateUrl: 'pages/admin.html'
    }).when('/course', {
        templateUrl: 'pages/course.html',
        controller: 'courseController'
    }).when('/department', {
        templateUrl: 'pages/department.html',
        controller: 'departmentController'
    }).when('/admin-faculty', {
        templateUrl: 'pages/admin-faculty.html',
        controller: 'facultyController'
    }).when('/class', {
        templateUrl: 'pages/class.html',
        controller: 'classController'
    }).when('/room', {
        templateUrl: 'pages/room.html',
        controller: 'roomController'
    }).when('/major-minor', {
        templateUrl: 'pages/major-minor.html',
        controller: 'major-minorController'
    }).when('/student-panel', {
        templateUrl: 'pages/student-panel.html',
        controller: 'studentController'
    }).when('/student-class', {
        templateUrl: 'pages/student-class.html',
        controller: 'studentClassController'
    }).when('/faculty-panel', {
        templateUrl: 'pages/faculty-panel.html',
        controller: 'facultyPanelController'
    }).when('/researcher-panel', {
        templateUrl: 'pages/researcher-panel.html',
        controller: 'researcherPanelController'
    }).when('/transcript', {
        templateUrl: 'pages/transcript.html',
        controller: 'studentController'
    });
});

myApp.filter('letterGrade', function () {
    // Create the return function
    // set the required parameter name to **number**
    return function (number) {
        number = parseInt(number);
        switch (number) {
            case 4:
                return "A";
                break;
            case 3.67:
                return "A-";
                break;
            case 3.33:
                return "B+";
                break;
            case 3:
                return "B";
                break;
            case 2.7:
                return "B-";
                break;
            case 2.3:
                return "C+";
                break;
            case 2:
                return "C";
                break;
            case 1.7:
                return "C-";
                break;
            case 1.3:
                return "D+";
                break;
            case 1:
                return "D";
                break;
            default:
                return "F";
                break;
        }
    }
});
