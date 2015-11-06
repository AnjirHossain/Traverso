angular.module('Root').service('vehicleApiService', ['$http','$q',function ($http, $q) {
	
	var deffered = $q.defer();
	$http.get('/VehicleDataApiTraverso.json').then( function (data) {

		deffered.resolve(data);

	}, function (error) {
		console.log(error);
	});


	this.getVehicleApi = function () {
		return deffered.promise;
	} 


}]);