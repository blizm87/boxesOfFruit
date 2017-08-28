(function(){
  'use strict';

  console.log('I am Boxes of Fruit module');
  angular
    .module('BoxesOfFruitApp', ['ngRoute'])
    .config(routes)
    .controller('mainCtrl', ['$scope', '$http', '$timeout', mainCtrl])
    .controller('indexCtrl', ['$scope', '$http', '$timeout', indexCtrl])
    .controller('gameCtrl', ['$scope', '$http', '$timeout', gameCtrl])

    //  CONTROLLER FUNCTION HANDLER SECTION

    function mainCtrl($scope, $http, $timeout){
      console.log('I am the main controller')

    } //  END MAINCTRL -  CONTROLLER

    function indexCtrl($scope, $http, $timeout){
      console.log('I am the index controller')

    } //  END INDEXCTRL -  CONTROLLER

    function gameCtrl($scope, $http, $timeout){
      console.log('I am the game controller')
      let urlParams = window.location.href.split('?')[1];
      let paramRes = urlParams.split('=')[1];
      $http
        .get(`http://127.0.0.1:3000/members?profileId=${paramRes}`)
        .then(function(response){
          console.log(response)
        }, function(err){
          console.log(err)
        })
    } //  END GAMECTRL -  CONTROLLER

    //  ANGULAR ROUTE HANDLER SECTION
    function routes($routeProvider){
      $routeProvider
        .when('/', {
          templateUrl: '../partials/index.html',
          controller: 'indexCtrl'
        })
        .when('/game', {
          templateUrl: '../partials/game.html',
          controller: 'gameCtrl'
        })
        .otherwise({
          rediretTo: '/',
          controller: 'mainCtrl'
        })
    }

})();
