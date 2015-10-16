var centerAndZoomOn = function ( aGoogleAnswer ) {
    // Uses given aGoogleAnswer to center and zoom on it. (what it does? expose intention)
    // Defaults to the general area of the entered address when there are no results.


    // Normalize coordinates



    // center

    // zoom

};

angular.module('Root.find', []);
 
var geocoder,
    listingResultsMap,
    listingMarkers = [],
    listingClusters;

angular.module('Root.find').config(['$urlRouterProvider','$stateProvider', '$locationProvider',function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider

    /*sell subdir*/
    /*find subdir*/
      .state('find', {
        url: '/find',
        templateUrl: 'client/find/find.ng.html',
        controller: 'findCtrl'
      });

      /*root subdir*/
      // $url.when - > where to ?
}]);

angular.module('Root.find').controller('findCtrl', ['$scope','$meteor','$stateParams','$filter','listingPageSv', 
    function($scope,$meteor,$stateParams,$filter,listingPageSv) {
        // initializeTemplates creates blaze methods
        initializeTemplates();

        // console.log($scope.listings);
        
        // GOOGLE
        geocoder = new google.maps.Geocoder(); /* ship to service | factory */
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };

        var icon = {
            url: '/mapmarker.png',
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(32, 32)
        };

        var mcOptions = {
            gridSize: 50, 
            maxZoom: 13,
            styles: [
                {
                    textColor: 'white',
                    height: 45,
                    url: "/cluster45x45.png",
                    width: 45
                },
                {
                    textColor: 'white',
                    height: 47,
                    url: "/cluster47x47.png",
                    width: 47
                },
                {
                    textColor: 'white',
                    height: 53,
                    url: "/cluster53x53.png",
                    width: 53
                },
                {
                    textColor: 'white',
                    height: 78,
                    url: "/cluster78x78.png",
                    width: 78
                },
                {
                    textColor: 'white',
                    height: 78,
                    url: "/cluster78x78.png",
                    width: 78
                }
            ]
        };

        $scope.searchBoxRangeFilter = {};
        $scope.listingWindowContent = {};
        $scope.filteredListings = [];
        $scope.searchBoxBase = '';
        $scope.noAddress = false;
        $scope.searchFodder = {};
        $scope._searchFodderInHouse = {};
        $scope.noResults = true;

        $scope.passListing = function( id ) {
            listingPageSv.passListing( id );
        };

        // tangent: pagination
        $scope.filterLax = 6;
        $scope.incrementFilterLax = function() {

            $scope.filterLax += 6;
        };
        $scope.autocompleteOptions = {
            componentRestrictions: { country: 'us' },
            types: ['geocode']
        };

        $scope.loading = false;

        $scope.beginSearch = function(a) {            
            if (!$scope.showFilterPopOver) {
                $scope.filterPopOverStateMutator();
            }
            
            // reset markers upon address budge
            if ( listingMarkers.length ) {
                listingMarkers = [];
            }

            console.log('address ', a);
        };

        $scope.applyFilters = function(aSearchFodder) {

            if ( !aSearchFodder.address ) {

                if ( $scope.searchErrorNoAddress ){
                    $scope.searchErrorNoAddress = false;
                } else {
                    $scope.searchErrorNoAddress = true;
                }
                return;
            }

            // green light for computation
            $scope.searchErrorNoAddress = false;

            // loading indicator
            $scope.loading = true;

            // temporary
            $scope._searchFodderInHouse = aSearchFodder;


            $meteor.autorun( $scope, function () {

                var test = $scope._searchFodderInHouse;

                // temporary moving inside the dynamic formula for stripping out lat long
                if ( test.address.geometry.location.lat ) {
                    test.address.geometry.location.latitudeFinal = test.address.geometry.location.lat();
                    console.log('lat');
                }

                if ( test.address.geometry.location.lng ) {
                    test.address.geometry.location.longitudeFinal = test.address.geometry.location.lng();
                    console.log('lng');
                }

                var searchProps = test;

                $meteor.call('getListings', searchProps).then(
                    function ( answer ) {

                        /*
                            TODOS
                            -----
                            - map clusters
                            - map panning to location of listing that user hovers over
                            - function for adding | removing markers 
                            - attach _id to every listing marker
                            - refactor tasks into functions
                        */
                        
                        var panToThis,
                            location_obj,
                            location_arr = [];

                        // centerAndZoomOn();
                        // addMarkersOn();

                        // normalizing latitude longitude
                        if ( answer.length > 0 ) {
                            $scope.noResults = false;

                            // prime up pan so map centers on first listing
                            location_obj = answer[0].address.geometry.location; // location.lat() 

                            window.answer = answer[0].address.geometry.location; 

                            console.log('location_obj ', location_obj);

                            // if (answer. ... loc) {

                                //}

                            // if ( answer[0].loc.length ) {

                            // }
                            if ( answer[0].loc.length ) {
                                location_arr = answer[0].loc.length;
                            }


                        } else {
                            $scope.noResults = true;

                            // prime up pan so map centers on where the user searched
                            if ( searchProps.address ) {
                                
                                location_obj = searchProps.address.geometry.location;

                                window.searchProps = searchProps.address.geometry.location;
                                
                                console.log('non empty searchProps', searchProps);

                                for (var k in location_obj) {
                                    // []
                                    location_arr.push(location_obj[k]);        
                                }
                            }
                        }

                        
                        console.log('location_obj contains ', location_obj);

                        panToThis = {
                            lat: location_arr[0],
                            lng: location_arr[1]
                        };

                        console.log('panToThis contains ', panToThis);

                        listingResultsMap.setCenter(panToThis);
                        listingResultsMap.setZoom(13);

                        console.log('getListings answered fine: ', answer);
                        Session.set("filteredListings", answer); // data for list

                        // removing markers from google maps
                        listingMarkers.map(function (m) {
                            m.setMap(null);
                            console.log("markers should've been cleared");
                        });       

                        listingMarkers = [];
                        listingClusters = new MarkerClusterer(listingResultsMap, listingMarkers, mcOptions);

                        answer.map(function (e) {
                            var listingMarker = new google.maps.Marker({
                                position: {
                                    lat: e.loc[1], 
                                    lng: e.loc[0]
                                },
                                map: listingResultsMap,
                                icon: icon,
                                title: '$ ' + e.price 
                            });

                            listingMarkers.push(listingMarker);
                        });

                        listingClusters.addMarkers(listingMarkers);
                    }, 
                    function (error) {

                        console.log(error); 
                    }
                );      

                $scope.loading = false; 
            });

            $scope.filterPopOverStateMutator();
        };

        $scope.searchErrorNoAddress = false;

        $scope.$watch('searchFodder.address', function(context){
            // figure out way to watch entire object fcol
            if (!context) {
                console.log('reaction to searchFodder.address. Context is: ', context);
                $scope.filteredListings = [];
                $scope.filterLax = 6;
            }
        });

        // tangent: listing_window 
        var listingWindowProp = document.getElementById('listingWindow');

        $scope.listingWindowOpen = function (listingId){
            var listingInWindow = Listings.findOne({_id:listingId}),
                listingImgInWindow = Images.findOne({_id:listingInWindow.listImgId});

            $scope.listingWindowContent.listingId = listingId;
            $scope.listingWindowContent.year = listingInWindow.year;
            $scope.listingWindowContent.make = listingInWindow.make.name;
            $scope.listingWindowContent.model = listingInWindow.model.name;
            $scope.listingWindowContent.mileage = listingInWindow.milage;
            $scope.listingWindowContent.listingImgInWindow = "/cfs/files/images/"+listingInWindow.listImgId+"/"+listingInWindow.imageName;
            $scope.listingWindowContent.price = listingInWindow.price;
            $scope.listingWindowContent.trim = listingInWindow.trim;
            $scope.listingWindowContent.body = listingInWindow.body;
            $scope.listingWindowContent.description = listingInWindow.description;
            $scope.listingOwner = Meteor.users.findOne({_id:listingInWindow.owner});
            
            $scope.toggleListingWindow();
        };
        
        $scope.toggleListingWindow = function() {

            listingWindowProp.classList.toggle('active');
        };

        // tangent: dropdown_filter
        $scope.showFilterPopOver = false; 

        $scope.filterPopOverStateMutator = function() {

            if (!$scope.showFilterPopOver) {
                $scope.showFilterPopOver = true;
            } else {
                $scope.showFilterPopOver = false;
            }
        };

        var filterToggle_PreownedProp;
        $scope.mutateFilter = function(event) {
            filterToggle_PreownedProp =  document.querySelector('div.toggle_PreOwned');
            filterToggle_PreownedProp.classList.toggle('active');
            /*ng-model this out*/
            if (!$scope.filterPopOverPreset.preowned) {
                $scope.filterPopOverPreset.preowned = true;
            } else {
                $scope.filterPopOverPreset.preowned = false;
            }
        };

        $scope.updateViewsScaffold = function( listingId ) {
            $meteor.call('updateViews', listingId).then(function(){
                $scope.$apply();
            });
        };

        $scope.filterPopOverPreset = {
            price: {
                min: 0,
                max: 500000
            },
            mileage: {
                min: 0,
                max: 300000
            },
            years: [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
            preOwned: false
        };

        // tangent: geocoding
        $scope.spMapPan = {
            latitude: 47.6097,
            longitude: -122.3331
        };

        /* def going inside map controller */
        $scope.map = {
          icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=1%7C37455C%7CFFFFFF",
          center: {
            latitude: 47.6097,
            longitude: -122.3331
          },
          zoom: 12,
          options: {
            scrollwheel: false,
            panControl: false,
            zoomControl: true,
            zoomControlOptions: {style:'SMALL'},
            streetViewControl: false
          },
            marker: {
                id: 0,
                latitude: 47.6097,
                longitude: -122.3331,
                options: {
                    visible: true
                }
            },
          events: {},
          styles: [
            {
                'featureType': 'administrative',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#efeae2'
                    }
                ]
            },
            {
                'featureType': 'administrative',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'administrative',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#444444'
                    }
                ]
            },
            {
                'featureType': 'landscape',
                'elementType': 'all',
                'stylers': [
                    {
                        'color': '#f2f2f2'
                    }
                ]
            },
            {
                'featureType': 'landscape',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'landscape.man_made',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#efeae2'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#efeae2'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural.landcover',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#efeae2'
                    }
                ]
            },
            {
                'featureType': 'landscape.natural.terrain',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#efeae2'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#bcd593'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.attraction',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.business',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.government',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.medical',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#bcd593'
                    }
                ]
            },
            {
                'featureType': 'poi.place_of_worship',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.school',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'poi.sports_complex',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'all',
                'stylers': [
                    {
                        'saturation': -100
                    },
                    {
                        'lightness': 45
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#ffffff'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#e0e0e0'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'hue': '#00c3ff'
                    },
                    {
                        'saturation': '100'
                    },
                    {
                        'lightness': '0'
                    },
                    {
                        'gamma': '0.19'
                    },
                    {
                        'weight': '2.14'
                    },
                    {
                        'visibility': 'on'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'simplified'
                    }
                ]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'transit',
                'elementType': 'all',
                'stylers': [
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'water',
                'elementType': 'all',
                'stylers': [
                    {
                        'color': '#a3d6df'
                    },
                    {
                        'visibility': 'on'
                    }
                ]
            }]
        };

        $scope.listingInfoWindowOptions = {

            visible: false
        };

        $scope.toggleWindowInMap = function() {
            
            $scope.listingInfoWindowOptions.visible = !$scope.listingInfoWindowOptions.visible;
        };
    }
]);

// angular.module('Root.find').controller('findMapCt', ['$scope','$meteor','$stateParams', function ($scope,$meteor,$stateParams){}]);

angular.module('Root.find').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
        
                    scope.$eval(attrs.ngEnter);   
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('Root.find').run(['$rootScope', '$meteor', '$state', function ( $rootScope, $meteor, $state ) {
  $rootScope
    .$on('$viewContentLoaded',
      function (event, viewConfig){  
        Session.set("filteredListings", []);
        
        var initMap = function () {
            // cached at top, try (user's location via ip) before resorting to this area
            listingResultsMap = new google.maps.Map(document.getElementById('listingResultsMap'), {
                center: {lat: 47.6097, lng: -122.3331},
                zoom: 14
            });
        } 

        initMap();

    });
}]);

function initializeTemplates() {

    Template.listingResults.helpers({
        listings: function () {
            return Session.get("filteredListings");
        }
    });

    // need dismiss code for modal
    Template.listingResults.events({
        'click #listingItem': function (event) {

            // store listing nad lister and set it as the session variable
            var listingClicked = Listings.findOne({_id: this._id});
            
            Session.set('currentListingBeingViewed', listingClicked);
            Session.set('currentListingOwner', Meteor.users.findOne({_id: listingClicked.owner}));
        }
    });

    Template.listingModal.helpers({
        'listingContent': function () {
            return Session.get('currentListingBeingViewed');
        },
        'listingOwner': function (){
            return Session.get('currentListingOwner');
        }
    });

    Template.listingModal.events({
        'click #viewListing': function (event) {

            // temporary until I read up more on Temporary UI State in meteor
            $('#listingModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
    });
}