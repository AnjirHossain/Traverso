var vehicleApiPromise;

angular.module('Root',['angular-meteor','ui.router','uiGmapgoogle-maps','google.places','Root.sell','Root.find','Root.landing','Root.profile','Root.listingPage']);

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
      
      $urlRouterProvider.otherwise('/landing');
}]);

angular.module('Root').controller('Root.ct', ['$scope', '$meteor', '$stateParams','$location','$http','vehicleApiService','listingPageSv','mutateFilteredListings', 
  function($scope,$meteor,$stateParams,$location,$http, vehicleApiService, listingPageSv, mutateFilteredListings) {
    
    $scope.listings = $meteor.collection(Listings).subscribe('listings');
    $scope.listingImages = $meteor.collectionFS(Images, false, Images).subscribe('images');
    $scope.showUplDImg = false;
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

    vehicleApiPromise = vehicleApiService.getVehicleApi();
    vehicleApiPromise.then(function (data) {
            
        // temp
        $scope.makes = data.data.makes;
        console.log(data.data.makes);

    });

    /* factor out into new controller */

    // models are nested inside makes
    $scope.getModels = function (make) {
      console.log('here\' the make', make);
    };

    // years are nested inside model
    $scope.getYears = function (model) {
      console.log('here are models', model);
    };

    $scope.getTrims = function (year) {
      console.log('here are models', year);
    };

    $scope.logTrim = function (trim) {
      console.log(trim);
    };
    
}]);


angular.module('Root').run(['$rootScope', '$state', '$location',function($rootScope, $state, $location){
  $rootScope
    .$on('$viewContentLoaded',
      function(event, viewConfig){ 
        
        function readUri (inputProp) {
          if ( inputProp && inputProp.files[0] ) {

            var rootAjsElement = document.querySelector('[ng-app=Root]');
            var $rootAjsElementScope = angular.element(rootAjsElement).scope();

            $rootAjsElementScope.$apply(function(){
              var reader = new FileReader();
              console.log("Instantiated file reader: "+inputProp.files[0]);

              reader.onload = function (e) {
                $('#uplDImg').attr('src', e.target.result);
                console.log("On load fired: " + inputProp.files[0]);
              }

              reader.readAsDataURL(inputProp.files[0]);
              $rootAjsElementScope.showUplDImg = true;          
            });

          }

        }

        $("#imgUploadIdScaff").change(function(){
          readUri(this);
        });

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
        } else {
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
          header = document.querySelector( '.bar' ),
          didScroll = false
          efs1 = document.getElementById('modalEndPoint1'),
          efs2 = document.getElementById('modalEndPoint2'),
          popOverToDash = document.getElementById('testBox');

        function init() {

          window.addEventListener( 'scroll', function( event ) {
            
            
            if( !didScroll ) {
              didScroll = true;
              // setTimeout( scrollPage, 250 );
              scrollPage();
            }
          
          });

          efs2.addEventListener( 'click', function (event) {
            var em1 = document.getElementById('createAuthError');
            var em2 = document.getElementById('useAuthError');
            
            // if (em1) {
              em1.innerHTML = '';     
            // }

            // if (em2) {
              em2.innerHTML = '';  
            // }
          });
        }

        function scrollPage () {
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

        if ( $location.path() !== '/landing' ) {
          changeHeaderOn = 0;
        } else {
          changeHeaderOn = 300;
        }

        init();

      });

  $rootScope
    .$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error){
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

angular.module('Root').factory('listingPageSv', function() {
  var listingGlobObj = {
    listingToBeDisplayed: {}
  }

  return {
      passListing: function (listingId){
        listingGlobObj.listingToBeDisplayed = Listings.findOne({_id:listingId});
        console.log("pass listing function, alive !: "+listingId);
      },
      pullListing: function () {
        console.log("pull listing function, alive: "+listingGlobObj.listingToBeDisplayed);
        return listingGlobObj.listingToBeDisplayed;
      }
  };

});

angular.module('Root').factory('mutateFilteredListings', function() {

  var filteredListingWrp = [];

  return {
      initListing: function (pushingTo) {
        filteredListingWrp = pushingTo;
      },
      passListing: function (filteredListingToPush){
        filteredListingWrp.push(filteredListingToPush);
      },
      pullListing: function() {
        return filteredListingWrp;
      }
  };

});


