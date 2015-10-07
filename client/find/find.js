angular.module('Root.find', []);

var geocoder,
    listingResultsMap;

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
            // console.log( a );

            if (!$scope.showFilterPopOver) {
                $scope.filterPopOverStateMutator();
            }

            // return false;
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

            console.log(aSearchFodder);
            $scope.searchErrorNoAddress = false;

            // var _t = new Date().getMilliseconds();

            $scope.loading = true;
            $scope._searchFodderInHouse = aSearchFodder; // hax but oh well

            $meteor.autorun( $scope, function () {
                var searchProps = $scope.getReactively('_searchFodderInHouse', true);
                console.log('applyFilters reacting to autorun', searchProps);

                $meteor.call('getListings', searchProps).then(
                    function (answer) {
                        
                        if ( answer.length > 0 ) {
                            $scope.noResults = false;
                        } else {
                            $scope.noResults = true;
                        }

                        console.log('getListings answered fine: ', answer);
                        Session.set("filteredListings", answer); // data for list

                        /*
                            TODOS
                            -----
                            - map pans to whatever listing the user hovers over
                            - better alternative than for loop or place this else where
                        */

                        for ( var i = answer.length-1; i > 0; i-- ) {
                            new google.maps.Marker({
                                position: {
                                    lat: answer[i].address.geometry.location.H, 
                                    lng: answer[i].address.geometry.location.L
                                },
                                map: listingResultsMap,
                                title: 'Hello World!'
                            });
                        }


                        $scope.loading = false; 

                        var panToThis = {
                            lat: answer[0].address.geometry.location.H,
                            lng: answer[0].address.geometry.location.L
                        };

                        listingResultsMap.setCenter(panToThis);
                        listingResultsMap.setZoom(13);
                    }, 
                    function ( error ) {
                        console.log( error ); // 500 error on meteor server, currently on Heroku
                    }
                );      


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

        // WATCH STATEMENTS
        /* look inside notes for geocoding snippet */

        /*
            // the real issue
            // $scope.$watch('filteredListings', function(newVal){
            //     var newAddress = '',
            //         spMapPanSCAFF = {};

            //     if ( newVal[0] ) {

            //         // console.log(newVal);

            //         geocoder.geocode({'address': newVal[0].address.formatted_address}, function( results, status ){
            //             spMapPanSCAFF.latitude = results[0].geometry.location.lat();
            //             spMapPanSCAFF.longitude = results[0].geometry.location.lng();
            //             $scope.spMapPan = spMapPanSCAFF;
            //             $scope.$apply();
            //         });
                    
            //     } 
            // });
        */

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

angular.module('Root.find').controller('findMapCt', ['$scope','$meteor','$stateParams', function ($scope,$meteor,$stateParams){}]);

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


/*
        // angular.module('Root.find').filter('filterOmniBase', ['mutateFilteredListings','$meteor',
        // function(mutateFilteredListings,$meteor) {
        //   return function( unfilteredItems, unfilteredItemImgs, modelWRT ) {
        //     var filteredItems = [],
        //         geocoder = new google.maps.Geocoder();

        //     var test;

        //     // pivot point
        //     var geoCodeThenFilter = function(address, callback) {

        //         geocoder.geocode({'address': address}, function(results,status) {
        //             if ( status == google.maps.GeocoderStatus.OK ) {
        //                 searchLtLng.position = {
        //                     latitude: results[0].geometry.location.lat(),
        //                     longitude: results[0].geometry.location.lng()
        //                 };
        //                 callback(searchLtLng.position);
        //             } else {
        //                 alert(status);
        //             }
        //         });
        //     }
        //     var deGunkify = function(ltLngToCompareWith) {
        //         test = "geocoded ltlng exists: " + ltLngToCompareWith.latitude+' '+ltLngToCompareWith.longitude;
        //         // console.log("geocoded ltlng exists: " + ltLngToCompareWith.latitude+' '+ltLngToCompareWith.longitude);
        //         // console.log("and so does unfilteredItems: " + unfilteredItems[0]);
        //     }

        //     // a new chapter of long over due promises

        //     var ltlngPromise = new Promise(function(resolve, reject) {
        //         // do a thing, possibly async, then…
        //         var address = modelWRT.address.formatted_address; // any address
        //         var searchLtLng = {};

        //         geocoder.geocode({'address': address}, function(results,status) {
        //             if ( status == google.maps.GeocoderStatus.OK ) {
        //                 searchLtLng.position = {
        //                     latitude: results[0].geometry.location.lat(),
        //                     longitude: results[0].geometry.location.lng()
        //                 };
        //                 resolve(searchLtLng.position);
        //             } else {
        //                 reject(alert(status));
        //             }
        //         });

        //     });

        //     return ltlngPromise.then(function(result) {
        //         for ( var i = 0; i < unfilteredItems.length; i++ ) {
        //             if ( unfilteredItems[i].position === result ) {
        //                 // push this listing
        //                 filteredItems.push(unfilteredItems[i]);
        //             } else {
        //                 var range = 8046, // 5 miles
        //                     listingPin = new google.maps.LatLng(unfilteredItems[i].position.latitude, unfilteredItems[i].position.longitude),
        //                     userPin = new google.maps.LatLng(result.latitude, result.longitude); 

        //                 var inProximity = google.maps.geometry.spherical.computeDistanceBetween(userPin, listingPin);

        //                 if ( range >= inProximity ) {
        //                     filteredItems.push(unfilteredItems[i]);
        //                 }
        //             }
        //         }
        //         return filteredItems;
        //     });

        //   };
        // }]); 
*/

angular.module('Root.find').run(['$rootScope', '$meteor', '$state', function ( $rootScope, $meteor, $state ) {
  $rootScope
    .$on('$viewContentLoaded',
      function (event, viewConfig){  
        Session.set("filteredListings", []);
        
        var initMap = function () {
            // cahced at top
            listingResultsMap = new google.maps.Map(document.getElementById('listingResultsMap'), {
                center: {lat: 47.6097, lng: -122.3331},
                zoom: 14
            });
        } 

        Template.listingResults.helpers({
            listings: function () {
                return Session.get("filteredListings");
            }
        });

        initMap();

    /*    
        // Template.listingResultsMap.helpers({  
        //     mapOptions: function() {
        //         if ( GoogleMaps.loaded() ) {

        //           console.log("GoogleMaps.loaded() aint suspect in listingResultsMap");
        //           return {
        //             center: new google.maps.LatLng(47.6097, -122.3331),
        //             zoom: 8
        //           };
        //         }
        //     }
        // });

        // Template.searchGeo.onRendered(function() {
        //     this.autorun(function () {
        //         if ( GoogleMaps.loaded() ) {
                    
        //             console.log('GoogleMaps.loaded() aint suspect in searchGeo');
                    
        //             $('search-geo').geocomplete().bind('geocode:result', function(event, result){
        //                 console.log(result);
        //             });
        //         }
        //     });
        // });
    */

    });
}]);