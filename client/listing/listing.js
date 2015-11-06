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
    
    // var listing = Listings.findOne({_id: $stateParams.listingId});

    // console.log('listing ', Listings);
    Template.listingView.helpers({
      'listing': function (){

        if ( $stateParams.listingId ) {
          var listing = Listings.findOne({_id: $stateParams.listingId}),
              listingOwner = listing.owner;

          Session.set('listingOwnerId', listingOwner);
          console.log('recently set session variable', Session.get('listingOwnerId'));
          console.log(listing.speculations);
          return listing;
        }
      }, 
      'listingOwner': function (){
        if ( Session.get('listingOwnerId') ) {

          // verified, logs all the time 
          if ( Meteor.users.findOne({_id: Session.get('listingOwnerId')}) ) {

            Session.set('listeremail', Meteor.users.findOne({_id: Session.get('listingOwnerId')}).emails[0].address );
            return Meteor.users.findOne({_id: Session.get('listingOwnerId')});
          }

        }
      },
      'listerEmail': function (){
        if (Session.get('listeremail')) {
          return Session.get('listeremail');
        }
      }

    });

	}
]);

// run template setup code and ensure a way to make user data persist everywhere 
/*
  $viewContentLoaded: make template helpers that ensure all necessary data is present
*/

angular.module('Root.listingPage').run(['$rootScope', '$meteor', '$state', '$stateParams', function ($rootScope, $meteor, $state, $stateParams){
  $rootScope
    .$on('$viewContentLoaded', 
      function (event, viewConfig){

        if ( $stateParams.listingId ) {
          $meteor.call('incrementViews', $stateParams.listingId).then(
            function (data){
              // console.log('something was returned', data);
            },
            function (error){
              // console.log('o no', error);
            }
          );
        }


    });
}]);