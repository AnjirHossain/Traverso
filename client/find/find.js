// REFACTOR LONG TASKS W/ EXPRESSIVE JS

// angular.module('Root.find').controller('findMapCt', ['$scope','$meteor','$stateParams', function ($scope,$meteor,$stateParams){}]);

angular.module('Root.find', []);
 
var geocoder,
    listingResultsMap,
    listingMarkers = [],
    listingClusters;

angular.module('Root.find').config(['$urlRouterProvider','$stateProvider', '$locationProvider',function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $urlRouterProvider.when('/find', '/:personallistings');

    $stateProvider

        /*sell subdir*/
        /*find subdir*/
        .state('find', {
            url: '/find',
            templateUrl: 'client/find/find.ng.html',
            controller: 'findCtrl'
        })

        .state('find.dealership', {
            url: '/:dealershiplistings',
            templateUrl: 'client/find/dealershiplistings/dealershipView.ng.html',
            controller: 'findCtrl'
        })

        .state('find.personal', {
            url: '/:personallistings',
            templateUrl: 'client/find/privatelistings/privateView.ng.html',
            controller: 'findCtrl'
        });

      /*root subdir*/
      // $url.when - > where to ?
}]);

angular.module('Root.find').controller('findCtrl', ['$scope','$meteor','$stateParams','$filter','listingPageSv', 
    function($scope,$meteor,$stateParams,$filter,listingPageSv) {
        // initFindTemplates creates blaze methods
        initFindTemplates();

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
        $scope.notEnoughInfo = false;
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
            
            // reset markers upon address change
            if ( listingMarkers.length ) {
                listingMarkers = [];
            }
        };

        $scope.applyFilters = function (aSearchFodder) {

            // validating user entered info START
            if ( _.isEmpty(aSearchFodder) ) {
                console.log('aSearchFodder is empty');
                $scope.notEnoughInfo = true;
                return;
            } 
            $scope.notEnoughInfo = false;
            console.log('have detected that aSearchFodder is an obj: ', aSearchFodder);

            // loading indicator
            $scope.loading = true;
            $scope.filterPopOverStateMutator();

            // transferring to var so as to not alter $scope
            $scope._searchFodderInHouse = aSearchFodder;
            var _searchFodderInHouse = $scope._searchFodderInHouse;

            if ( _searchFodderInHouse.address ) {
                if ( _searchFodderInHouse.address.geometry.location.lat ) {
                    _searchFodderInHouse.address.geometry.location.latitudeFinal = _searchFodderInHouse.address.geometry.location.lat();
                }
                if ( _searchFodderInHouse.address.geometry.location.lng ) {
                    _searchFodderInHouse.address.geometry.location.longitudeFinal = _searchFodderInHouse.address.geometry.location.lng();
                } 
            }
            // validating user entered info END

            // Producing results START
            $meteor.autorun( $scope, function () {

                
                /*
                    Normalizing lat lng
                    -------------------
                    - server does not detect lat() lng() funcs
                      sent from client; (would probably be a huge security risk).
                    - rename and embrace
                */
                

                var searchProps = _searchFodderInHouse;

                $meteor.call('getDealershipListings', searchProps).then(
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

                        if ( answer.length > 0 ) {
                            // vett
                            $scope.noResults = false;

                            // if loc is actually population
                            if ( answer[0].loc.length ) {
                                
                                var loc = answer[0].loc.slice();
                                loc.reverse();  

                                location_arr = loc;


                                panToThis = {
                                    lat: location_arr[0],
                                    lng: location_arr[1]
                                };

                                console.log('panToThis contains ', panToThis);

                                listingResultsMap.setCenter(panToThis);
                                listingResultsMap.setZoom(13);

                                console.log('getListings answered fine: ', answer);
                                Session.set('filteredListings', answer); // data for list

                                // removing markers from google maps
                                listingMarkers.map(function (m) {
                                    m.setMap(null);
                                    console.log('markers should\'ve been cleared');
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
                                $scope.loading = false;
                            }
                        } else {
                            // vett
                            $scope.loading = false;
                            $scope.noResults = true;


                            if ( searchProps.address ) {
                                if ( searchProps.address.geometry.location ) {
                                    location_obj = searchProps.address.geometry.location;
      
                                    if ( location_obj.lat() && location_obj.lng()) {
                                        console.log('lat lng funcs', location_obj);

                                        location_arr.push( location_obj.lat() );
                                        location_arr.push( location_obj.lng() );

                                        // location_arr.reverse();

                                        panToThis = {
                                            lat: location_arr[0],
                                            lng: location_arr[1]
                                        };

                                        listingResultsMap.setCenter(panToThis);
                                        listingResultsMap.setZoom(13);
                                    }                
                                }
                            }
                        } 

                        
                    }, 
                    function (error) {

                        console.log(error); 
                    }
                );             
            });
            // Producing results END
        };

        // FACTOR INTO RESPECTIVE CONTROLLER
        $scope.applyFiltersPrivate = function (aSearchFodder) { 

            // validating user info START
            if ( _.isEmpty(aSearchFodder) ) {
                console.log('aSearchFodder is empty');
                $scope.notEnoughInfo = true;
                return;
            } 
            $scope.notEnoughInfo = false;
            console.log('have detected that aSearchFodder is an obj: ', aSearchFodder);

            // validating user info END

            $scope.loading = true;
            $scope.filterPopOverStateMutator();
            
            // transferring to var so as to not alter $scope
            $scope._searchFodderInHouse = aSearchFodder;

            // Producing results START
            $meteor.autorun( $scope, function () {

                var _searchFodderInHouse = $scope._searchFodderInHouse;
                /*
                    Normalizing lat lng
                    -------------------
                    - server does not detect lat() lng() funcs
                      sent from client; (would probably be a huge security risk).
                    - rename and embrace
                */
                if ( _searchFodderInHouse.address ) {
                    if ( _searchFodderInHouse.address.geometry.location.lat ) {
                        _searchFodderInHouse.address.geometry.location.latitudeFinal = _searchFodderInHouse.address.geometry.location.lat();
                    }
                    if ( _searchFodderInHouse.address.geometry.location.lng ) {
                        _searchFodderInHouse.address.geometry.location.longitudeFinal = _searchFodderInHouse.address.geometry.location.lng();
                    } 
                }

                var searchProps = _searchFodderInHouse;

                $meteor.call('getPrivateListings', searchProps).then(
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
                        if ( answer.length > 0 ) {
                            // vett
                            $scope.noResults = false;
                            console.log('getListings answered fine: ', answer);
                            Session.set('filteredListings', answer); // data for list
                            $scope.loading = false;
                        } else {
                            // vett
                            $scope.noResults = true;
                            $scope.loading = false;
                        } 
                    }, 
                    function (error) {
                        console.log(error); 
                    }
                );             
            });
            // Producing results END
        };

        $scope.searchErrorNoAddress = false;

        // tangent: listing_window 
        var listingWindowProp = document.getElementById('listingWindow');

        $scope.listingWindowOpen = function (listingId){
            var listingInWindow = Listings.findOne({_id:listingId}),
                listingImgInWindow = Images.findOne({_id:listingInWindow.listImgId});

            $scope.listingWindowContent.listingId = listingId;
            $scope.listingWindowContent.year = listingInWindow.year;
            $scope.listingWindowContent.make = listingInWindow.make;
            $scope.listingWindowContent.model = listingInWindow.model;
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

angular.module('Root.find').controller('dealershipViewControl', ['$scope','$meteor','$stateParams','$filter','listingPageSv', 
    function ($scope, $meteor, $stateParams, $filter, listingPageSv) {

    }
]);

angular.module('Root.find').controller('personalViewControl', ['$scope','$meteor','$stateParams','$filter','listingPageSv', 
    function ($scope, $meteor, $stateParams, $filter, listingPageSv) {
        
    }
]);

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

function initFindTemplates() {

    Template.listingResults.helpers({
        listings: function () {
            return Session.get('filteredListings');
        }
    });

    Template.listingResultsPrivate.helpers({
        listings: function () {
            return Session.get('filteredListings');
        }
    });

    Template.listingPrivate.helpers({
        lister: function () {
            console.log(this.owner);
            return Meteor.users.findOne({_id: this.owner});
        }
    });

    Template.listingResultsPrivate.events({
        'click #listingItem': function (event) {

            // store listing nad lister and set it as the session variable
            var listingClicked = Listings.findOne({_id: this._id});
            
            Session.set('currentListingBeingViewed', listingClicked);
            Session.set('currentListingOwner', Meteor.users.findOne({_id: listingClicked.owner}));
            Session.set('currentListingOwnerEamil', Session.get('currentListingOwner').emails[0].address);
        }
    });

    // need dismiss code for modal
    Template.listingResults.events({
        'click #listingItem': function (event) {

            // store listing nad lister and set it as the session variable
            var listingClicked = Listings.findOne({_id: this._id});
            
            Session.set('currentListingBeingViewed', listingClicked);
            Session.set('currentListingOwner', Meteor.users.findOne({_id: listingClicked.owner}));
            Session.set('currentListingOwnerEamil', Session.get('currentListingOwner').emails[0].address);
        }
    });

    Template.listingModal.helpers({
        'listingContent': function () {
            return Session.get('currentListingBeingViewed');
        },
        'listingOwner': function (){
            return Session.get('currentListingOwner');
        },
        'listingOwnerEmail': function (){
            if ( Session.get('currentListingOwnerEamil') ) {
                return Session.get('currentListingOwnerEamil');
            }
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