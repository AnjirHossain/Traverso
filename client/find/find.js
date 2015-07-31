angular.module('Root.find',[]);

angular.module('Root.find').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',function($urlRouterProvider, $stateProvider, $locationProvider){

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

angular.module('Root.find').controller('findCtrl', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams) {
        $scope.searchBoxBaseFilter = function (listing) {
            if (!listing) { 
                console.log('listing isn\'t here');
                return;
            }

            if (!$scope.filteredListings) {
                console.log('filtered listing isn\'t here');
                return;
            }
                
            return ( angular.lowercase(listing.street).indexOf($scope.searchBoxBase || '') !== -1 || angular.lowercase(listing.city).indexOf($scope.searchBoxBase || '') !== -1 || angular.lowercase(listing.state).indexOf($scope.searchBoxBase || '') !== -1 || listing.zip.indexOf($scope.searchBoxBase || '') !== -1 );
            
        };

$scope.map = {
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=1%7C37455C%7CFFFFFF',
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



    }
]);

angular.module('Root.find').controller('findMapCt', ['$scope','$meteor','$stateParams', function($scope,$meteor,$stateParams){

	
}]);