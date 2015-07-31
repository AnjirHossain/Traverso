angular.module('Root.sell',[]);

var listingItemInjectionObj = {}


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

angular.module('Root.sell').controller('sellCtrl', ['$scope','$meteor','$stateParams','$location','$state', function($scope,$meteor,$stateParams,$location,$state){

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
		var geocoder = new google.maps.Geocoder();


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
			    /*insert mirrors cache*/

			    $scope.listingFormBaseData.listImgId = fileObj._id;
			    /*scope does not overlap unless you place following line here*/
			    $scope.listingFormBaseData.owner = Meteor.userId();
			   
			   	// $scope hand off
			    listingItemInjectionObj = $scope.listingFormBaseData;
			    var address = listingItemInjectionObj.street + ' ' + listingItemInjectionObj.city + ' ' + listingItemInjectionObj.state + ' ' + listingItemInjectionObj.zip;
			   
			    

				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						// results[0].geometry.location
						listingItemInjectionObj.position = {
							latitude: results[0].geometry.location.G,
							longitude: results[0].geometry.location.K,
						};

						$scope.pushListings(listingItemInjectionObj);
					} else {
						alert('Something went wrong while storing the location: ' + status);
					}
				});
			    $scope.listingFormBaseData = {};
			  });
			}
		}

		// $scope.make = '';
		// $scope.description = ''; 
		// $scope.authCache = '';
		event.target.listingImg.value = "";
		$state.go('sell.listsuccess');
		return false;
	};

	$scope.pushListings = function(toPush){
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
	$scope.items = [
	  {
	    makes: [{
		  	name: 'Acura', 
		    models: [ 
		        {name:'2.5TL', years:['111','112']},
		        {name:'3.2TL', years:['111','112']},
		        {name:'Tl', years:['111','112']}, 
		        {name:'TSX', years:['121', '122']},
		        {name:'Vigor', years:['111','112']}, 
		        {name:'ZDX', years:['121', '122']},
		        {name:'RSX', years:['121', '122']},
		     	{name:'SLX', years:['111','112']}, 
		        {name:'ILX', years:['121', '122']},
		        {name:'Integra', years:['111','112']},
		        {name:'Legend', years:['111','112']}, 
		        {name:'MDX', years:['121', '122']},
		        {name:'NSX', years:['111','112']}, 
		        {name:'RDX', years:['121', '122']},
		        {name:'RSX', years:['121', '122']},
		     	{name:'SLX', years:['111','112']}, 
		        {name:'ILX', years:['121', '122']},
		        {name:'i8', years:['121', '122']}   
		    ]
		  },
		  {
		  	name: 'AMC', 
		    models: [ 
		        {name:'Alliance', years:['111','112']},
		        {name:'Concord', years:['111','112']},
		        {name:'Eagle', years:['111','112']}, 
		        {name:'Encore', years:['121', '122']},
		        {name:'Spirit', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Aston Martin', 
		    models: [ 
		        {name:'DB7', years:['111','112']},
		        {name:'DB9', years:['111','112']},
		        {name:'DBS', years:['111','112']}, 
		        {name:'Lagonda', years:['121', '122']},
		        {name:'Rapide', years:['111','112']}, 
		        {name:'V12 Vantage', years:['121', '122']},
		        {name:'V8 Vantage', years:['121', '122']},
		     	{name:'Vanquish', years:['111','112']}, 
		        {name:'Virage', years:['121', '122']},
		        {name:'Integra', years:['111','112']},
		        {name:'Legend', years:['111','112']}, 
		        {name:'MDX', years:['121', '122']},
		        {name:'NSX', years:['111','112']}, 
		        {name:'RDX', years:['121', '122']},
		        {name:'RSX', years:['121', '122']},
		     	{name:'SLX', years:['111','112']}, 
		        {name:'ILX', years:['121', '122']},
		        {name:'i8', years:['121', '122']}   
		    ]
		  },
		  {
		  	name: 'Audi', 
		    models: [ 
		        {name:'100', years:['111','112']},
		        {name:'200', years:['111','112']},
		        {name:'4000', years:['111','112']}, 
		        {name:'5000', years:['121', '122']},
		        {name:'80', years:['111','112']}, 
		        {name:'90', years:['121', '122']},
		        {name:'A3', years:['121', '122']},
		     	{name:'A4', years:['111','112']}, 
		        {name:'A5', years:['121', '122']},
		        {name:'A6', years:['111','112']},
		        {name:'A7', years:['111','112']}, 
		        {name:'A8', years:['121', '122']},
		        {name:'Cabriolet', years:['111','112']}, 
		        {name:'Q3', years:['121', '122']},
		        {name:'Q5', years:['121', '122']},
		     	{name:'Q7', years:['111','112']}, 
		        {name:'Quattro', years:['121', '122']},
		        {name:'R8', years:['121', '122']},   
		        {name:'RS 4', years:['121', '122']},
		        {name:'RS 5', years:['121', '122']},
		     	{name:'RS 6', years:['111','112']}, 
		        {name:'S4', years:['121', '122']},
		        {name:'S5', years:['111','112']},
		        {name:'S6', years:['111','112']}, 
		        {name:'S7', years:['121', '122']},
		        {name:'S8', years:['111','112']}, 
		        {name:'TT', years:['121', '122']},
		        {name:'TT RS', years:['121', '122']},
		     	{name:'TTS', years:['111','112']}, 
		        {name:'V8 Quattro', years:['121', '122']} 
		    ]
		  },
		  {
		  	name: 'Avanti', 
		    models: [ 
		        {name:'Coupe', years:['111','112']},
		        {name:'Sedan', years:['111','112']} 
		    ]
		  },
		  {
		  	name: 'BMW', 
		    // models: ['1 Series','2 Series','3 Series','M2','M3','3 Series','6 Series','i8'] 
		    models: [ 
		        {name:'1 Series', years:['111','112']}, 
		        {name:'2 Series', years:['121', '122']},
		        {name:'3 Series', years:['111','112']}, 
		        {name:'M2', years:['121', '122']},
		        {name:'M3', years:['121', '122']},
		     	{name:'6 Series', years:['111','112']}, 
		        {name:'i3', years:['121', '122']},
		        {name:'i8', years:['121', '122']}   
		    ]
		  },
		  {
		  	name: 'Chevrolet', 
		    models: [ 
		        {name:'ES', years:['111','112']},
		        {name:'IS 250', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Dodge', 
		    models: [ 
		        {name:'charger', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Ford', 
		    models: [ 
		        {name:'Focus', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'GMC', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Honda', 
		    models: [ 
		        {name:'Accord', years:['111','112']},
		        {name:'Civic', years:['111','112']},
		        {name:'CRV', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Hummer', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Jaguar', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Jeep', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'KIA', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Land Rover', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Lexus', 
		    models: [ 
		        {name:'ES', years:['111','112']},
		        {name:'IS 250', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Mercedes-Benz', 
		    // models: ['A-Class','B-Class','C-Class','CL-Class','CLK-Class','CLS-Class','E-Class','G-Class','GL-Class','M-Class','R-Class','S-Class','SLK-Class']
		    models: [ 
		        {name:'A-Class', years:['111','112']}, 
		        {name:'B-Class', years:['121', '122']},
		        {name:'C-Class', years:['111','112']}, 
		        {name:'CL-Class', years:['121', '122']},
		        {name:'CLK-Class', years:['121', '122']},
		     	{name:'6 Series', years:['111','112']}, 
		        {name:'E-Class', years:['121', '122']},
		        {name:'G-Class', years:['121', '122']}   
		    ]
		  },
		  {
		  	name: 'Mini Cooper', 
		    // models: ['A-Class','B-Class','C-Class','CL-Class','CLK-Class','CLS-Class','E-Class','G-Class','GL-Class','M-Class','R-Class','S-Class','SLK-Class']
		    models: [ 
		        {name:'Model', years:['111','112']}, 
		    ]
		  },
		  {
		  	name: 'Nissan', 
		    models: [ 
		        {name:'Juke', years:['111','112']}, 
		        {name:'Altima', years:['121', '122']},
		        {name:'Maxima', years:['111','112']}, 
		        {name:'Rogue', years:['121', '122']},
		        {name:'Murano', years:['121', '122']},
		     	{name:'LEAF', years:['111','112']} 
		    ]
		  },
		  {
		  	name: 'Porsche', 
		    models: [ 
		        {name:'Caymen', years:['111','112']},
		        {name:'Boxter', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Volkswagen', 
		    models: [ 
		        {name:'Golf Mk1', years:['111','112']}, 
		        {name:'Golf Mk2', years:['121', '122']},
		        {name:'Jetta A1', years:['111','112']}, 
		        {name:'Jetta A2', years:['121', '122']},
		        {name:'Passat B1', years:['121', '122']},
		     	{name:'Passat B2', years:['111','112']} 
		    ]
		  },
		  {
		  	name: 'Volvo', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Subaru', 
		    models: [ 
		        {name:'Outback', years:['111','112']}, 
		        {name:'Forester', years:['121', '122']},
		        {name:'Impreza', years:['111','112']}, 
		        {name:'Legacy', years:['121', '122']},
		        {name:'Crosstrek', years:['121', '122']},
		     	{name:'WRX', years:['111','112']} 
		    ]
		  },
		  {
		  	name: 'Tesla', 
		    models: [ 
		        {name:'Model', years:['111','112']}
		    ]
		  },
		  {
		  	name: 'Toyota', 
		    models: [ 
		        {name:'Corolla', years:['111','112']}, 
		        {name:'RAV 4', years:['121', '122']},
		        {name:'Prius', years:['111','112']}, 
		        {name:'Camry', years:['121', '122']},
		        {name:'Highlander', years:['121', '122']},
		     	{name:'Land Cruiser', years:['111','112']} 
		    ]
		  }]
	  }];

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
	
	// $scope.updateCacheThree = function(event) {
	// 	$scope.listingFormBaseData = {};
 //    	return false;
 //    };


}]);
