angular.module('Root.sell',[]);

var listingItemInjectionObj = {};
var geocoder;

angular.module('Root.sell').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

  	// $locationProvider.html5Mode(true);
  	$urlRouterProvider.when('/sell', '/:listingsinfo');

    $stateProvider

		.state('sell', {
			url: '/sell',
			templateUrl: 'client/sell/sell.ng.html',
			controller: 'sellCtrl',
			resolve: {
				"currentUser": ["$meteor", function($meteor){
					return $meteor.requireUser();
				}]
			}
		})

		.state('sell.listinginfo', {
			url: '/:listingsinfo',
			templateUrl: 'client/sell/listinginfo/sell.listinginfo.ng.html',
			controller: 'sellListingCt'
		})

		.state('sell.specs', {
        	url: '/:specs',
        	templateUrl: 'client/sell/listingspecs/sell.specs.ng.html', /*client/sell/listinginfo/sell.listinginfo.ng.html*/
        	controller: 'sellSpecsCt'
        })

        .state('sell.contact', {
        	url: '/:contact',
        	templateUrl: 'client/sell/listingcontact/sell.contact.ng.html', /*client/sell/listinginfo/sell.listinginfo.ng.html*/
        	controller: 'sellContactCt'
        })

        .state('sell.listsuccess', {
        	url: '/:listsuccess',
        	templateUrl: 'client/sell/listingsuccess/sell.listingsuccess.ng.html', /*client/sell/listinginfo/sell.listinginfo.ng.html*/
        	controller: 'sellSuccessCt'
        });

}]);

angular.module('Root.sell').controller('sellCtrl', ['$scope','$meteor','$stateParams','$location','$state','$http', function($scope,$meteor,$stateParams,$location,$state,$http){

	$scope.listingFormBaseData = {};

	$scope.processListingFormBaseData = function(){
		// event.preventDefault(); 
		if (!Meteor.userId()) {
			$('#authModal').modal('toggle');
			return;
		}
		// listingItemInjectionObj.make = $scope.make;
		// listingItemInjectionObj.description = $scope.description;
		var filesTempWrapper = event.target.listingImg.files;
		// GOOGLE
		geocoder = new google.maps.Geocoder();

		// MULTIPLE IMAGE UPLOADS
		if (!(filesTempWrapper && filesTempWrapper.length)) {
			alert("Please upload images for your listing! :)");
			return;
		} else {	
			for (var i = 0, l = filesTempWrapper.length; i < l; i++) {
			  Images.insert(filesTempWrapper[i], function (err, fileObj) {	    
			    if (err) {
			    	console.log(err);
			    	return;
			    }
			    /*
			    	absolutely must alter otherwise large portions of data get inserted
			    	insert mirrors cache
			    */

			    var styleIdForSpecRetrieval = $scope.listingFormBaseData.trim.id;

			    var styleSpecsApiUrl = 'https://api.edmunds.com/api/vehicle/v2/styles/'+styleIdForSpecRetrieval+'?view=full&fmt=json&api_key=m5tquq8q8z6a56hptyu9zudq';


				$scope.listingFormBaseData.make = $scope.listingFormBaseData.make.name;
				$scope.listingFormBaseData.model = $scope.listingFormBaseData.model.name;
				$scope.listingFormBaseData.year = $scope.listingFormBaseData.year.year;
				$scope.listingFormBaseData.trim = $scope.listingFormBaseData.trim; // hold off on specificity for now
				$scope.listingFormBaseData.listImgId = fileObj._id;
				$scope.listingFormBaseData.owner = Meteor.userId();

				var componentForm = {
					street_number: 'short_name',
					route: 'long_name',
					locality: 'long_name',
					administrative_area_level_1: 'short_name',
					postal_code: 'short_name'
				};
					
			    var address = $scope.listingFormBaseData.address.formatted_address;
			    var addressComponentsWrp = $scope.listingFormBaseData.address;

				listingItemInjectionObj = $scope.listingFormBaseData;
				listingItemInjectionObj.listingType = Meteor.user().profile.profileType;
				console.log(listingItemInjectionObj.listingType);

				// idk the purpose of this 
				// listingItemInjectionObj.addressComponentsInjWrp = addressComponentsInjWrp;
				listingItemInjectionObj.views = 0;

			    $http({
					method: 'GET',
					url: styleSpecsApiUrl
				}).then(function (response) {
					console.log(response.data);
					listingItemInjectionObj.speculations = response.data;	

					// all insertions inside this call back in order to get listingItemInjectionObj.speculations
				    console.log('style id', styleIdForSpecRetrieval);
				    
				    // GOOGLE
					geocoder.geocode( { 'address': address}, function(results, status) {
						if ( status == google.maps.GeocoderStatus.OK ) {				

							listingItemInjectionObj.loc = [ results[0].geometry.location.lng(), results[0].geometry.location.lat()];
							var urlLead = Images.findOne({_id: fileObj._id});
							listingItemInjectionObj.imageName = encodeURI(urlLead.name());

							$scope.pushListings(listingItemInjectionObj);
						} else {
							// handle
							alert('Something went wrong while storing the location: ' + status);
						}
					});

				}, function (err) {
					// present error to user
					console.log('line 93 sell.js', err);
				});

			 //    console.log('style id', styleIdForSpecRetrieval);
			 //    $scope.listingFormBaseData.make = $scope.listingFormBaseData.make.name;
			 //    $scope.listingFormBaseData.model = $scope.listingFormBaseData.model.name;
			 //    $scope.listingFormBaseData.year = $scope.listingFormBaseData.year.year;
			 //    $scope.listingFormBaseData.trim = $scope.listingFormBaseData.trim; // hold off on specificity for now
			 //    $scope.listingFormBaseData.listImgId = fileObj._id;
			 //    $scope.listingFormBaseData.owner = Meteor.userId();

				// var componentForm = {
				// 	street_number: 'short_name',
				// 	route: 'long_name',
				// 	locality: 'long_name',
				// 	administrative_area_level_1: 'short_name',
				// 	postal_code: 'short_name'
				// };
				// var addressComponentsInjWrp = {
				// 	street_number: '',
				// 	route: '',
				// 	locality: '',
				// 	administrative_area_level_1: '',
				// 	postal_code: ''
				// };
			 //    var address = $scope.listingFormBaseData.address.formatted_address;
			 //    var addressComponentsWrp = $scope.listingFormBaseData.address;

				// listingItemInjectionObj = $scope.listingFormBaseData;
				// listingItemInjectionObj.addressComponentsInjWrp = addressComponentsInjWrp;
				// listingItemInjectionObj.views = 0;
			    
			 //    // GOOGLE
				// geocoder.geocode( { 'address': address}, function(results, status) {
				// 	if ( status == google.maps.GeocoderStatus.OK ) {

				// 		// listingItemInjectionObj.position = {
				// 		// 	latitude: results[0].geometry.location.G,
				// 		// 	longitude: results[0].geometry.location.K,
				// 		// };						

				// 		listingItemInjectionObj.loc = [ results[0].geometry.location.lng(), results[0].geometry.location.lat()];
				// 		var urlLead = Images.findOne({_id: fileObj._id});
				// 		listingItemInjectionObj.imageName = encodeURI(urlLead.name());

				// 		$scope.pushListings(listingItemInjectionObj);
				// 	} else {
				// 		// handle
				// 		alert('Something went wrong while storing the location: ' + status);
				// 	}
				// });

			    $scope.listingFormBaseData = {};

			  });
			}
		}

		event.target.listingImg.value = '';
		$state.go('sell.listsuccess');
		return false;
	};

	$scope.pushListings = function (toPush) {
    	Listings.insert(toPush);
    };
}]);

angular.module('Root.sell').controller('sellListingCt',['$scope','$meteor','$stateParams','$location', function($scope,$meteor,$stateParams,$location){
	
	$scope.stateInit = true;
	$scope.stateMid = false;
	$scope.stateFinal = false;
}]);

angular.module('Root.sell').controller('sellSpecsCt',['$scope','$meteor','$stateParams','$location', function($scope,$meteor,$stateParams,$location){
	
	$scope.stateInit = false;
	$scope.stateMid = true;
	$scope.stateFinal = false;
	/* car spec drop downs MUST be expaned */
}]);

angular.module('Root.sell').controller('sellContactCt',['$scope','$meteor','$stateParams','$location', function($scope,$meteor,$stateParams,$location){
	
	$scope.stateInit = false;
	$scope.stateMid = false;
	$scope.stateFinal = true;
	
	$scope.updateCacheThree = function(event) {
		$scope.listingFormBaseData = {};
    	return false;
    };
}]);

angular.module('Root.sell').controller('sellSuccessCt',['$scope','$meteor','$stateParams','$location', function($scope,$meteor,$stateParams,$location){
	
	$scope.stateInit = false;
	$scope.stateMid = false;
	$scope.stateFinal = true;
}]);

angular.module('Root.find').run(['$rootScope', '$meteor', '$state', function($rootScope, $meteor, $state) {
  $rootScope
    .$on('$viewContentLoaded',
      function(event, viewConfig){  

    

    });
}]);
