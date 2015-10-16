angular.module('Root.profile',[]);

angular.module('Root.profile').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider

    /*sell subdir*/
    /*find subdir*/
      .state('profile', {
        url: '/profile',
        templateUrl: 'client/profile/profile_root.ng.html',
        controller: 'profileRootCtrl'
      })

      /*rg*/
      .state('profile.settings', {
        url: '/:settings',
        templateUrl: 'client/profile/settings/profile_settings.ng.html',
        controller: 'profileSettingsCtrl'
      });

      /*root subdir*/
      // $url.when - > where to ?
}]);

angular.module('Root.profile').controller('profileRootCtrl', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams){
  $scope.message = "Profile !";
}]);

angular.module('Root.profile').controller('profileRootListingsCtrl', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams){
  
  
  $scope.profileListings = $meteor.collection(Listings).subscribe('listings');

  $scope.message = "This user's listings !";
  
  $scope.userIdScaffold = function() {
    return Meteor.userId();
  };

  $scope.removeListing = function(target) {
    Listings.remove({_id: target._id}); 
  };

}]);

/*rg*/
angular.module('Root.profile').controller('profileSettingsCtrl', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams){
  $scope.message = "Settings in profile @#$!";

  $scope.editProfilePic = function (){  
    // properly retrieve image
    // call secure server method to update user account
    // clear all states 
    alert('coming very soon!');

  };

  $scope.editContactInfo = function (){
    // properly retrieve changes
    // call secure server method to update user account
    // clear all states 
    alert('coming very soon!');
  };

}]);




