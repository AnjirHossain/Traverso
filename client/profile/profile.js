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
  
  // used for listing ownership
  $scope.userIdScaffold = function() {
    return Meteor.userId();
  };

  $scope.removeListing = function(target) {
    Listings.remove({_id: target._id}); 
  };

}]);

/*rg*/
angular.module('Root.profile').controller('profileSettingsCtrl', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams){

  initProfileTemplates();

  // show and hide
  $scope.showEditProfileMode = false;

  $scope.startProfileEdit = function (){
    // profile edit mode
    $scope.showEditProfileMode = !$scope.showEditProfileMode;
  };

}]);

angular.module('Root.profile').run(['$rootScope', '$meteor', '$state', function ($rootScope, $meteor, $state){
  $rootScope
    .$on('$viewContentLoaded', 
      function (event, viewConfig){
        // Session.set('editMode', false);        
        
        Tracker.autorun(function(){
          if (Meteor.user()) {
            Session.setDefault('avi', Meteor.user().profile.profilePicUrl);
            // Session.setDefault('');
            // console.log('stay calm', Session.get('avi'));
          }
        });

    });
}]);

function initProfileTemplates() {
  // setting editMode false using Session var
  // must change to reactive vars
  Session.set('editMode', false);
  // Session.setDefault('avi', currentUser.profile.profilePicUrl);

  Template.editProfile.helpers({
    'currentUser_Email': function () {
      return Meteor.user().emails[0].address;
    },
    'userAvatar': function () {
      return Session.get('avi');
    },
    'editProfileMode': function () {
      if ( Session.get('editMode') ) {
        
        return Session.get('editMode');
      }
    },
    'accountTypeDealer': function () {
      if (Meteor.user()) {
        if (Meteor.user().profile) {
          if ( Meteor.user().profile.profileType === 'dealership') {
            console.log('user profile', Meteor.user().profile);
            return true;
          } else {
            return false;
          }
        }
      }
    },
    'accountTypeIndividual': function () {
      if (Meteor.user()) {
        if (Meteor.user().profile) {
          if ( Meteor.user().profile.profileType === 'individual') {
            console.log('user profile', Meteor.user().profile);
            return true;
          } else {
            return false;
          }
        }
      }
    } 
  });

  Template.editProfile.events({
    'click #startProfileEdit': function ( event ) {
      Session.set('editMode', true);  
    },
    // 'click #saveChangesToProfile': function ( event ){
    //   // event.preventDefault();
       
    //   return false;
    // },
    'submit #userDataUpdateForm': function (event) {
      event.preventDefault();
      Session.set('editMode', false); 
      // gather all data from form; (password & avatar pending).
      var userAccountChanges;

      if (Meteor.user().profile.profileType === 'dealership') {
        userAccountChanges = {
          username: event.target.userNameChanged.value,
          email: event.target.userEmailChanged.value,
          profile: {
            profilePicUrl: '' + Meteor.user().profile.profilePicUrl,
            name: event.target.userNameChanged.value, 
            phone: event.target.userPhoneNumberChanged.value
          }
        }; 
      } else {
        userAccountChanges = {
          username: event.target.userNameChanged.value,
          email: event.target.userEmailChanged.value,
          profile: {
            profilePicUrl: '' + Meteor.user().profile.profilePicUrl,
            firstName: event.target.userFirstNameChanged.value,
            lastName: event.target.userLastNameChanged.value,
            name: event.target.userFirstNameChanged.value + ' ' + event.target.userLastNameChanged.value, 
            phone: event.target.userPhoneNumberChanged.value
          }
        }; 
      }

      if ( event.target.userImgFileChanged.files[0] ) {
        // storing all files
        var filesTempWrapper = event.target.userImgFileChanged.files;
        // changing to map
        for (var i = 0, l = filesTempWrapper.length; i < l; i++) {
          UserImages.insert(filesTempWrapper[i], function (err, fileObj) {
            if (err) {

              console.log('Oops!', err);
              userAccountChanges.profile.profilePicUrl = '' + Meteor.user().profile.profilePicUrl;
            }
            
            if (fileObj) {
              var fileObjIf = fileObj._id,
                  fileObjName = encodeURI(UserImages.findOne({_id: fileObj._id}).name());
              userAccountChanges.profile.profilePicUrl = '/cfs/files/userimages/'+ fileObjIf +'/'+ fileObjName;
              Meteor.call('updateUserProfileData', Meteor.userId(), userAccountChanges, function (error){
                if (error) {
                  console.log('Oops!', error);
                }
              });
            }
          });
        }
      } else {
        console.log('no need to run insert block');
        Meteor.call('updateUserProfileData', Meteor.userId(), userAccountChanges);
      }
      event.target.userImgFileChanged.value = '';
    },

    'change #userImgFile': function (event) {
      // console.log(event);
      // event.preventDefault();

      var selectedFiles = event.target.files,
          readerProfile = new FileReader();

      readerProfile.onload = function (e){
        e.preventDefault();
        console.log('some crazy pointer', e.target.result);
        Session.set('avi', e.target.result);
      };

      readerProfile.readAsDataURL(selectedFiles[0]);  
    }

  });
}




