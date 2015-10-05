// need to update views on $scope load

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
    
    $scope.$meteorSubscribe('listings', {}).then(function() {
      $scope.listing = $meteor.object(Listings, $stateParams.listingId);  

      // bug: user data only persists when the owner is logged in
      var listingOwner = $scope.listing.getRawObject().owner;
      $scope.listingOwner = Meteor.users.findOne({_id: listingOwner});
    });
	}
]);