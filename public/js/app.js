(function(){
  'use strict';

  console.log('I am Boxes of Fruit module');
  angular
    .module('BoxesOfFruitApp', ['ngRoute'])
    .config(routes)
    .controller('mainCtrl', ['$scope', '$http', '$timeout', '$window', mainCtrl])

    //  CONTROLLER FUNCTION HANDLER SECTION

    function mainCtrl($scope, $http, $timeout, $window){
      console.log('I am the main controller')

    } //  END MAINCTRL -  CONTROLLER

    //  ANGULAR ROUTE HANDLER SECTION
    function routes($routeProvider){
      $routeProvider
        .when('/', {
          templateUrl: '../partials/index.html',
          controller: 'mainCtrl'
        })
        .otherwise({
          rediretTo: '/',
          controller: 'mainCtrl'
        })
    }

})();
