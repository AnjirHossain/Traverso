angular.module('Root.listingPage', []);

angular.module('Root.listingPage').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider

    /*landing subdir*/
      .state('listingdetails', {
      	url: '/listing/:listingId',
      	templateUrl: 'client/listing/listing.ng.html',
      	controller: 'listingCtrl'
      });
      
      $urlRouterProvider.otherwise('/find');
}]);

angular.module('Root.listingPage').controller('listingCtrl',['$scope','$meteor','$stateParams','$filter','$location','$rootScope',
	function($scope, $meteor, $stateParams, $filter, $location, $rootScope) {

    $scope.$meteorSubscribe('listings').then(function(data){
      // self.subscription = data;
      $scope.listing = $meteor.object(Listings, $stateParams.listingId);


      var listingOwner = $scope.listing.getRawObject().owner;
      $scope.listingOwner = Meteor.users.findOne({_id: listingOwner});

      // listing count create property is sell.js and increment the user's listing count upon listing
      


    });
    
	}
]);