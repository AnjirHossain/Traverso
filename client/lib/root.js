angular.module('Root',['angular-meteor','ui.router','uiGmapgoogle-maps','Root.sell','Root.find','Root.landing','Root.profile']);

angular.module('Root').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

  	$locationProvider.html5Mode(true);

    $stateProvider

    /*landing subdir*/
      .state('landing', {
      	url: '/landing',
      	templateUrl: 'client/landing/landing.ng.html',
      	controller: 'landingCtrl'
      });

      /*root subdir*/
      $urlRouterProvider.otherwise('/landing');
}]);

angular.module('Root').controller('Root.ct', ['$scope', '$meteor', '$stateParams','$location', 
  function($scope,$meteor,$stateParams,$location){
    /*not the cause*/
    $scope.listings = $meteor.collection(Listings).subscribe('listings');
    $scope.listingImages = $meteor.collectionFS(Images, false, Images).subscribe('images');
    // if (Meteor.userId()) {
    //   $scope.currentUserEmail = Meteor.user().emails[0].address;
    // }
    $scope.currRoute = function(l) {
      return l === $location.path();
    };
    $scope.showPopOverUserProp = false;
    $scope.doSometingHolyShit = function() {
      if ( $scope.showPopOverUserProp ) {
        $scope.showPopOverUserProp = false;
      } else {
        $scope.showPopOverUserProp = true;
      }
    };
  }
]);

angular.module('Root').run(['$rootScope', '$state',function($rootScope, $state){
  $rootScope
    .$on('$viewContentLoaded',
      function(event, viewConfig){ 
        
        function classReg( className ) {
          return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        }

        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        var hasClass, addClass, removeClass;

        if ( 'classList' in document.documentElement ) {
          hasClass = function( elem, c ) {
            return elem.classList.contains( c );
          };
          addClass = function( elem, c ) {
            elem.classList.add( c );
          };
          removeClass = function( elem, c ) {
            elem.classList.remove( c );
          };
        }
        else {
          hasClass = function( elem, c ) {
            return classReg( c ).test( elem.className );
          };
          addClass = function( elem, c ) {
            if ( !hasClass( elem, c ) ) {
              elem.className = elem.className + ' ' + c;
            }
          };
          removeClass = function( elem, c ) {
            elem.className = elem.className.replace( classReg( c ), ' ' );
          };
        }

        function toggleClass( elem, c ) {
          var fn = hasClass( elem, c ) ? removeClass : addClass;
          fn( elem, c );
        }

        var classie = {
          
          hasClass: hasClass,
          addClass: addClass,
          removeClass: removeClass,
          toggleClass: toggleClass,
          
          has: hasClass,
          add: addClass,
          remove: removeClass,
          toggle: toggleClass
        };


        if ( typeof define === 'function' && define.amd ) {
          
          define( classie );
        } else {
          
          window.classie = classie;
        }

        var docElem = document.documentElement,
          header = document.querySelector( '.navbar' ),
          didScroll = false,
          changeHeaderOn = 300,
          efs1 = document.getElementById('modalEndPoint1'),
          efs2 = document.getElementById('modalEndPoint2')
          popOverToDash = document.getElementById('testBox');

        function init() {

          window.addEventListener( 'scroll', function( event ) {
            
            
            if( !didScroll ) {
              didScroll = true;
              setTimeout( scrollPage, 250 );
            }
          
          }, false );

          efs2.addEventListener( 'click', function(event) {
            var em1 = document.getElementById('createAuthError');
            var em2 = document.getElementById('useAuthError');
            em1.innerHTML = '';            
            em2.innerHTML = '';
          });
        }

        function scrollPage() {
          var sy = scrollY();
          if ( sy >= changeHeaderOn) {
            classie.add( header, 'active' );
            
          } else {
            
            classie.remove( header, 'active' );
            
          }

          didScroll = false;

        }

        function scrollY() {
          return window.pageYOffset || docElem.scrollTop;
        }

        init();
      });

  $rootScope
    .$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      if (error === "AUTH_REQUIRED") {
        $state.go('landing');
        // var efs = document.getElementById('createAuthError'),
        //     efs2 = document.getElementById('useAuthError');
        // efs.innerHTML = '';
        // efs2.innerHTML = '';
        $('#authModal').modal('toggle');
        
      }
    });
}]);

angular.module('Root').filter('cell', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + ' ' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});






