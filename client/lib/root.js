angular.module('Root',['angular-meteor','ui.router','uiGmapgoogle-maps','google.places','Root.sell','Root.find','Root.landing','Root.profile','Root.listingPage']);

angular.module('Root').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

  	$locationProvider.html5Mode(true);

    $stateProvider

    /*landing subdir*/
      .state('landing', {
      	url: '/landing',
      	templateUrl: 'client/landing/landing.ng.html',
      	controller: 'landingCtrl'
      });
      
      $urlRouterProvider.otherwise('/landing');
}]);

angular.module('Root').controller('Root.ct', ['$scope', '$meteor', '$stateParams','$location','listingPageSv','mutateFilteredListings', 
  function($scope,$meteor,$stateParams,$location, listingPageSv, mutateFilteredListings) {
    /*not the cause*/
    $scope.listings = $meteor.collection(Listings).subscribe('listings');
    $scope.listingImages = $meteor.collectionFS(Images, false, Images).subscribe('images');
    // console.log($scope.listings);
    $scope.showUplDImg = false;
    
    $scope.currRoute = function(l) {
      return l === $location.path();
    };
    $scope.showPopOverUserProp = false;
    $scope.doSometingHolyShit = function() {
      if ( $scope.showPopOverUserProp ) {
        $scope.showPopOverUserProp = false;
      } else {
        $scope.showPopOverUserProp = true;
      }
    };
    $scope.geoLocate = function(){};

    /* open items this at your own peril */
    $scope.filterInSet = {
      years: [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]
    };

    $scope.items = [
      {
        makes: [
          {
            name: 'Acura', 
            models: [ 
                {name:'TL', years:['111','112'], trims:['2.5','3.2','3.2 Type-S','Base','SH-AWD','Technology Package','Advance Package','Special Edition']},
                {name:'TSX', years:['121', '122'], trims:['Base','Special Edition','Technology Package','']},
                {name:'Vigor', years:['111','112'], trims:['LS','GS']}, 
                {name:'ZDX', years:['121', '122'], trims:['Base','Technology Package','Advance Package']},
                {name:'RSX', years:['121', '122'], trims:['Base','Type-S']},
              {name:'SLX', years:['111','112'], trims:['Base']},
                {name:'ILX', years:['121', '122'], trims:['Base','Premium','Technology Package']},
                {name:'Integra', years:['111','112'], trims:['RS','LS','Special Edition','GS-R','GS','Type-R']},
                {name:'Legend', years:['111','112'], trims:['L','LS','Base','SE','GS']}, 
                {name:'MDX', years:['121', '122'], trims:['Base','Touring','Technology Package','Advance Package','SH-AWD','AcuraWatch Package']},
                {name:'NSX', years:['111','112'], trims:['Base','T']}, 
                {name:'RDX', years:['121','122'], trims:['Base','SH-AWD','Technology Package','Advanced Package','AcuraWatch Plus Package']},
                {name:'RL', years:['121', '122'], trims:['3.5','3.5 Premium','Base']},
              {name:'RLX', years:['111','112'], trims:['Base','Navigation','Technology Package','Advanced Package','Krell Audio Package','Sport Hybrid SH-AWD']}, 
                {name:'CL', years:['121', '122'], trims:['3.0','2.2','3.2 Type-S']},
                {name:'TSX Sport Wagon', years:['121', '122'], trims:['Base','Technology Package']}   
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
              {name:'100', years:['111','112'], trims:['Base','Quattro','CS','S','CS Quattro']},
              {name:'200', years:['111','112'], trims:['Base','Quattro']},
              {name:'4000', years:['111','112']}, 
              {name:'5000', years:['121', '122']},
              {name:'80', years:['111','112']}, 
              {name:'S5', years:['121', '122'], trims:['Quattro','Premium Plus Quattro','Prestige Quattro']},
              {name:'A3', years:['121', '122'], trims:['2.0T','3.2 Quattro','2.0T PZEV','2.0T Quattro','2.0 TDI','1.8 TFSI','2.0 TFSI']},
              {name:'A4', years:['111','112'], trims:['2.8','2.8 Quattro','1.8T','3.0','3.0 Quattro','1.8T Quattro','2.0T','2.0T Special Ed.','2.0T Quattro','3.2','3.2 Quattro']},
              {name:'A5', years:['121', '122'], trims:['Quattro','2.0T Premium Quattro','A5 Convertible']},
              {name:'A6', years:['111','112'], trims:['2.8','2.8 Quattro','3.0','3.0 Quattro','2.7T Quattro','4.2 Quattro','3.2','3.2 Quattro','4.2 Quattro','2.0T','3.0T','TDI',]},
              {name:'A7', years:['111','112']}, 
              {name:'A8', years:['121', '122']},
              {name:'Cabriolet', years:['111','112']}, 
              {name:'Q3', years:['121', '122']},
              {name:'Q5', years:['121', '122'], trims:['3.2 Premium Quattro','2.0T Premium Quattro','2.0T Premium Plus Quattro','3.0T','TDI','Hybrid']},
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
                {name:'Accord', years:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['DX','EX','LX','LX V6','EX V6','SE','Value Package','Hybrid','EX-L','Sport','Touring V-6']},
                {name:'Civic', years:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['EX','DX','LX','GX','Hybrid','DX-VP','LX-S','EX-L','Si','LX PZEV','HF','EX PZEV','EX-L PZEV','Natural Gas','Hybrid PZEV']},
                {name:'CR-V', years:[1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['EX','LX','EX-L','SE','Touring']},
                {name:'Pilot', years:[2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['LX','EX','EX-L','Touring','SE']},
                {name:'Odyssey', years:[1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], Trims:['LX','EX','EX-L','Touring','Touring Elite']},
                {name:'Fit', years:[2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['Base','Sport','LX','EX','EX-L']}

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
                {name:'Cherokee', years:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2014,2015,2016], trims:['Base','Sport','Limited','Laredo','Briarwood','Country','SE','Classic','Latitude','Trailhawk','Altitude']},
                {name:'Comanche', years:[1990,1991,1992], trims:['Base','Eliminator','Pioneer']},
                {name:'Commander', years:[2006,2007,2008,2009,2010], trims:['Base','Limited','Sport','Overland']},
                {name:'Compass', years:[2007,2008,2009,2010,2011,2012,2013,2014,2015,2016], trims:['Base','Sport','Limited','Sport Fleet','Latitude','Altitude','High Altitude']},
                {name:'Grand Cherokee', years:[1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['Base','Limited','Laredo','SE','Orvis','TSi','Special Edition','5.9 Limited','Summit','SRT8','Altitude']},
                {name:'Grand Cherokee SRT', years:[2015], trims:['Base']},
                {name:'Grand Wagoneer', years:[1990,1991,1993], trims:['Base']},
                {name:'Liberty', years:[2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012], trims:['Sport','Limited','Renegade','Columbia Edition','Rocky Mountain']},
                {name:'Patriot', years:[2007,2008,2009,2010,2011,2012,2013,2014,2015,2016], trims:['Sport','Limited','Sport Fleet','Latitude X','Altitude','High Altitude','Latitude']},
                {name:'Renegade', years:[2015], trims:['Sport','Latitude','Limited','Trailhawk']},
                {name:'Wagoneer', years:[1990], trims:['Limited']},
                {name:'Wrangler', years:[1990,1991,1992,1993,1994,1995,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['S','Islander','Base','Sahara','Laredo','Renegade','SE','Sport','Rio Grande','X','Rubicon','Unlimited','Unlimited Rubicon','Unlimited X','Unlimited Sahara','Unlimited Sport','Unlimited Sport RHD','70th Anniversary','Unlimited 70th Anniversary','Willys Wheeler','Freedom Edition',' Unlimited Freedom Edition','Unlimited Willys Wheeler','Altitude',' Unlimited Altitude','Rubicon Hard Rock','Unlimited Rubicon Hard Rock']}
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
                {name:'jetta', years:['111','112'], trims: ['base','S','TDI S','1.8T SE',]},
                {name:'Passat', years:['121', '122'], trims: ['1.8T S','1.8T Limited Edition','1.8T SE','1.8 Sport']},
                {name:'Golf', years:['111','112'], trims: [ 'launch Edition','TSI S','TSI S with Sunroof','TDI S','TSI SE','TSI SEL','TDI SEL']},
                {name:'GTI', years:['121', '122'], trims: ['Wolfsburg Edition','Driver\'s Edition']},
                {name:'Beetle', years:['121', '122'], trims:['1.8T','TDI','1.8T Classic']},
            ]
          },

          {
            name: 'Subaru', 
            models: [ 
                {name:'Outback', years:[2000,2001,2002,2003,2004,2005, 2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016], trims:['Base','Limited','L.L. Bean Edition','VDC','H6-3.0','H6-3.0 L.L. Bean Edition','H6-3.0 VDC','2.5i','2.5i limited','2.5 XT','2.5 XT Limited','3.0 R L.L. Bean Edition','2.5i Premium','2.5i Limited','3.6R Limited']},
                {name:'Forester', years:[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016], trims:['X','XS','XT',' 2.5 X','Sports 2.5 X','Sports 2.5 XT']},
                {name:'Impreza', years:[1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['2.5 RS','WRX','WRX STI','2.5i','Outback Sport',' 2.0i']},
                {name:'Legacy', years:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015], trims:['L','L Special Edition','2.5GT','2.5i','3.0R','3.6R']},
                {name:'WRX', years:[2013,2014], trims:['Base','Premium','Limited','STI']}   
           
            ]
          },
          {
            name: 'Tesla', 
            models: [ 
                {name:'Model S', years:['2012','2013','2014','2015'], trims: ['60','70D','85','85D','P85D']},
                {name:'Roadster', years:['2008','2009','2010','2011'], trims: ['2.5','2.5sport']},

            ]
          },
          {
            name: 'Toyota', 
            models: [ 
                {name:'Corolla', years:['111','112'], trims: ['S','LE','LE ECO','LE PLUS','S']},  
                {name:'RAV 4', years:['121', '122'], trims: ['LE','XLE','Limited']},
                {name:'Prius', years:['111','112'], trims: [ 'Two','Three','Persona Series Special Edition','Four','Five']},
                {name:'Camry', years:['121', '122'], trims: ['LE','SE','XSE','XLE','XSE V6','XLE V6']},
                {name:'Highlander', years:['121', '122'], trims: ['LE','LE V6','LE Plus V6','Limited V6','Limited Platinum V6']},
                {name:'Land Cruiser', years:['111','112']} 
            ]
          },
          {
            name: 'Scion', 
            models: [ 
                {name:'FR-S', years:[2013,2014,2015,2016], trims: ['Base','Release series']}, 
                {name:'iA', years:[2016], trims: ['trim']},
                {name:'iM', years:[2016], trims:['trim']},
                {name:'iQ', years:[2012, 2013,2014,2015], trims:['Base','Release Series']},
                {name:'tC', years:[2005, 2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016], trims: ['Base','Release Series']},
                {name:'xA', years:[2004,2005,2006], trims:['Base']},
                {name:'xB', years:[2004,2005,2006,2008,2009,2010,2011,2012,2013,2014,2015], trims:['Base','Release Series']},
                {name:'xD', years:[2008,2009,2010,2011,2012,2013,2014], trims:['base','Release Series','Scion 10 Series']}
            ]
          },
          {
            name: 'Smart', 
            models: [ 
                {name:'Fortwo', years:[2008,2009,2010,2011,2012,2013,2014,2015], trims:['Hatchback','Convertible','Electric']}
            ]
          },
          {
            name: 'Ram', 
          models: [
              {name:'1500', years:[2011,2012,2013,2014,2015], trims:['1500 Crew Cab','1500 Diesel',' 1500 Quad Cab','1500 Regular Cab']},
              {name:'2500', years:[2011,2012,2013,2014,2015], trims:['2500 Crew Cab',' 2500 Mega Cab','2500 Regular Cab']},
              {name:'3500', years:[2011,2012,2013,2014,2015], trims:['3500 Crew Cab','3500 Mega Cab','3500 Regular Cab']}, 
              {name:'C/V Cargo Van', years:[2012], trims:['Base']},
              {name:'C/V Tradesman', years:[2013], trims:['Base']},
              {name:'CV Tradesman', years:[2014,2015], trims: ['Base']},
              {name:'Dakota', years:[2011], trims:['Dakota Crew Cab','Dakota Extended Cab']},
              {name:'Promaster Cargo Van', years:[2014,2015,2016], trims:['1500 Low Roof 3dr Van W/ 118\” Wheelbase','1500 Low Roof 3dr Van W/ 136\” Wheelbase','1500 High Roof 3dr Van','2500 High Roof 3dr Van W/ 136” Wheelbase','2500 High Roof 3dr Van W/ 159” Wheelbase','3500 High Roof 3dr Van','3500 High Roof 3dr Van W/ Extended Length']},
              {name:'Promaster City', years:[2015], trims:['Tradesman Cargo 4dr Minivan','Wagon 4dr Minivan','Tradesman SLT Cargo 4dr Minivan','Wagon SLT 4dr Minivan']},
              {name:'Promaster Window Van', years:[2014,2015,2016], trims:['2500 High Roof 3dr Van','3500 High Roof 3dr Van']}
               
          ]
          },
          {
            name: 'FIAT', 
            models: [ 
                {name:'500', years:[2012,2013,2014,2015], trims:['Hatchback','Convertible','Abarth',' C Abarth']},
                {name:'500e', years:[2013,2014,2015], trims:['Hatchback']},
                {name:'500L', years:[2014,2015], trims:['Wagon']},
                {name:'500X', years:[2016], trims:['SUV']}
            ]
          },
          {
            name: 'Fisker', 
            models: [ 
                {name:'Karma', years:[2012], trims:['Eco-Standard 4dr','Eco-Sport 4dr','Eco-Chic 4dr']}
            ]
          },
          {
            name: 'Mitsubishi ',
            models: [
              {name: 'Lancer', years:[2004,2005,2006,2007,2008,,2009,2010,2011,2012,2013,2014,2015], trims: ['ES','SE','GT','Ralliart']},  
              {name:'Outlander Sport', years:['121', '122'], trims: ['ES','SE','GT']},
                {name:'3000GT', years:['111','112'], trims: ['Base','SL','VR-4']},
                {name:'Diamante', years:['121', '122']},
                {name:'Eclipse', years:['121', '122'], trims: ['GS','GS sport','SE','GT'] },
              {name:'Endeavor', years:['111','112'], trims: ['LS','SE']},
              {name:'Expo', years:['111','112'], trims: ['ES','SE','GT']},
                {name: 'Galant', years:['121', '122'], trims:['ES','SE']},
                {name:'i-MiEV', years:['111','112']}, 
                {name:'Lancer Evolution', years:['121', '122'], trims: ['GSR','MR']},
                {name:'lancer sportback', years:['121', '122'], trims: ['GT','ES']},
                {name:'Mirage', years:['111','112'], trims: ['DE','ES']}, 
            ]
          }
        ]
      }
    ]; /*end of items*/
    
}]);


angular.module('Root').run(['$rootScope', '$state',function($rootScope, $state){
  $rootScope
    .$on('$viewContentLoaded',
      function(event, viewConfig){ 
        
        function readUri (inputProp) {
          if ( inputProp && inputProp.files[0] ) {

            var rootAjsElement = document.querySelector('[ng-app=Root]');
            var $rootAjsElementScope = angular.element(rootAjsElement).scope();

            $rootAjsElementScope.$apply(function(){
              var reader = new FileReader();
              console.log("Instantiated file reader: "+inputProp.files[0]);

              reader.onload = function (e) {
                $('#uplDImg').attr('src', e.target.result);
                console.log("On load fired: " + inputProp.files[0]);
              }

              reader.readAsDataURL(inputProp.files[0]);
              $rootAjsElementScope.showUplDImg = true;
              console.log("Some random shit happened");            
            });

          }

        }

        $("#imgUploadIdScaff").change(function(){
          readUri(this);
        });

        function classReg( className ) {
          return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        }

        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        var hasClass, addClass, removeClass;

        if ( 'classList' in document.documentElement ) {
          hasClass = function( elem, c ) {
            return elem.classList.contains( c );
          };
          addClass = function( elem, c ) {
            elem.classList.add( c );
          };
          removeClass = function( elem, c ) {
            elem.classList.remove( c );
          };
        }
        else {
          hasClass = function( elem, c ) {
            return classReg( c ).test( elem.className );
          };
          addClass = function( elem, c ) {
            if ( !hasClass( elem, c ) ) {
              elem.className = elem.className + ' ' + c;
            }
          };
          removeClass = function( elem, c ) {
            elem.className = elem.className.replace( classReg( c ), ' ' );
          };
        }

        function toggleClass( elem, c ) {
          var fn = hasClass( elem, c ) ? removeClass : addClass;
          fn( elem, c );
        }

        var classie = {
          
          hasClass: hasClass,
          addClass: addClass,
          removeClass: removeClass,
          toggleClass: toggleClass,
          
          has: hasClass,
          add: addClass,
          remove: removeClass,
          toggle: toggleClass
        };


        if ( typeof define === 'function' && define.amd ) {
          
          define( classie );
        } else {
          
          window.classie = classie;
        }

        var docElem = document.documentElement,
          header = document.querySelector( '.navbar' ),
          didScroll = false,
          changeHeaderOn = 300,
          efs1 = document.getElementById('modalEndPoint1'),
          efs2 = document.getElementById('modalEndPoint2')
          popOverToDash = document.getElementById('testBox');

        function init() {

          window.addEventListener( 'scroll', function( event ) {
            
            
            if( !didScroll ) {
              didScroll = true;
              setTimeout( scrollPage, 250 );
            }
          
          }, false );

          efs2.addEventListener( 'click', function(event) {
            var em1 = document.getElementById('createAuthError');
            var em2 = document.getElementById('useAuthError');
            em1.innerHTML = '';            
            em2.innerHTML = '';
          });
        }

        function scrollPage() {
          var sy = scrollY();
          if ( sy >= changeHeaderOn) {
            classie.add( header, 'active' );
            
          } else {
            
            classie.remove( header, 'active' );
            
          }

          didScroll = false;

        }

        function scrollY() {
          return window.pageYOffset || docElem.scrollTop;
        }

        init();
      });

  $rootScope
    .$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      if (error === "AUTH_REQUIRED") {
        $state.go('landing');
        // var efs = document.getElementById('createAuthError'),
        //     efs2 = document.getElementById('useAuthError');
        // efs.innerHTML = '';
        // efs2.innerHTML = '';
        $('#authModal').modal('toggle');
        
      }
    });
}]);

angular.module('Root').filter('cell', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + ' ' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

angular.module('Root').factory('listingPageSv', function() {
  var listingGlobObj = {
    listingToBeDisplayed: {}
  }

  return {
      passListing: function(listingId){
        listingGlobObj.listingToBeDisplayed = Listings.findOne({_id:listingId});
        console.log("pass listing function, alive !: "+listingId);
      },
      pullListing: function() {
        console.log("pull listing function, alive: "+listingGlobObj.listingToBeDisplayed);
        return listingGlobObj.listingToBeDisplayed;
      }
  };

});

angular.module('Root').factory('mutateFilteredListings', function() {

  var filteredListingWrp = [];

  return {
      initListing: function(pushingTo) {
        filteredListingWrp = pushingTo;
      },
      passListing: function(filteredListingToPush){
        filteredListingWrp.push(filteredListingToPush);
      },
      pullListing: function() {
        return filteredListingWrp;
      }
  };

});


