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
      let instrBtn = $('#instructionBtn');
      let instrCont = $('#instructionContent');
      let mixedFruitCont = $('#mixedFruitContainer');
      let mixedFruit = document.createElement('img');
      let singleFruit = document.querySelectorAll('.fruitSelectors');
      let bucket = document.querySelectorAll('.bucket');
      let bucketCont = document.querySelector('#bucketContainer');
      let canvas = document.getElementById('mixedFruitCanvas');
      let context = canvas.getContext('2d');
      let img1 = new Image();
      let img2 = new Image();
      let fruitTypes = ['Apples', 'Oranges', 'Mixed'];
      let bucketArr = [];
      let bucketHintTry = 0;

      $(document).ready(function(){
        $('.tooltipped').tooltip({delay: 50});
      });

      instrBtn.on('click', function() {
        instrCont.slideToggle();
      });

      img1.src = "../assets/images/Apple.png";
      context.drawImage(img1, 0, 1);

      img2.src = "../assets/images/Orange.png";
      context.drawImage(img2, 40, 0);

      mixedFruit.src = canvas.toDataURL();
      mixedFruit.width = '135';
      mixedFruit.draggable = 'true';
      mixedFruit.setAttribute('id', 'mixedFruit');
      mixedFruit.setAttribute('class', 'responsive-img');
      mixedFruitCont.append(mixedFruit);

    // FRUITSELECTOR DRAG FEATURE
      mixedFruit.addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData("fruit", ev.target.id);
      });
      singleFruit[0].addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData("fruit", ev.target.id);
      });
      singleFruit[1].addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData("fruit", ev.target.id);
      });
    // FRUIT SELECTOR DRAG FEATURE END

    // BUCKET DROP FEATURE
      bucket[0].addEventListener('dragenter', function(ev) {
        ev.preventDefault();
      });
      bucket[0].addEventListener('dragover', function(ev) {
        ev.preventDefault();
      });
      bucket[0].addEventListener('drop', function(ev) {
        ev.preventDefault();
        if(ev.target.children[0] === undefined){
          var data = ev.dataTransfer.getData("fruit");
          ev.target.appendChild(document.getElementById(data));
        }
      });

      bucket[1].addEventListener('dragenter', function(ev) {
        ev.preventDefault();
      });
      bucket[1].addEventListener('dragover', function(ev) {
        ev.preventDefault();
      });
      bucket[1].addEventListener('drop', function(ev) {
        ev.preventDefault();
        if(ev.target.children[0] === undefined){
          var data = ev.dataTransfer.getData("fruit");
          ev.target.appendChild(document.getElementById(data));
        }
      });

      bucket[2].addEventListener('dragenter', function(ev) {
        ev.preventDefault();
      });
      bucket[2].addEventListener('dragover', function(ev) {
        ev.preventDefault();
      });
      bucket[2].addEventListener('drop', function(ev) {
        ev.preventDefault();
        if(ev.target.children[0] === undefined){
          var data = ev.dataTransfer.getData("fruit");
          ev.target.appendChild(document.getElementById(data));
        }
      });
    // BUCKET DROP FEATURE END

    // BUCKET HINT FEATURE
      bucketCont.addEventListener('click', function(ev) {
        console.log(ev.target.getAttribute('class'))
        if(ev.target.getAttribute('class') === 'responsive-img bucket') {
          if(bucketHintTry === 0){
            bucketHintTry += 1;
            let aTag = document.createElement('a');
            aTag.setAttribute('class', 'btn tooltipped');
            aTag.setAttribute('data-position', 'right');
            aTag.setAttribute('data-delay', '50');
            aTag.setAttribute('data-tooltip', 'testing');

        // <a class="btn tooltipped" data-position="right" data-delay="50"
        // data-tooltip='Hint: The buckets are mislabelled, so remember that the "apples"
        // bucket cannot contain apples.'>Hint!</a>
          }
        }
      })

      $http
        .get(`http://127.0.0.1:3000/members?profileId=${paramRes}`)
        .then(function(response){
          $scope.player = response.data.data;
          for(var i = 0; i < 3; i++){
            let randNum = Math.floor(Math.random() * fruitTypes.length)
            let bucketType = fruitTypes.splice(randNum, 1);
            bucketArr.push(bucketType[0]);
          }
          $scope.bucketOne = bucketArr[0];
          $scope.bucketTwo = bucketArr[1];
          $scope.bucketThree = bucketArr[2];
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
