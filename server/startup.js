Meteor.startup(function () {

  ensureIndexing();
  
  // don't add to CarModels unless 
  if (!!CarModels && CarModels.find().count() > 0) {
  	console.log('count: ', CarModels.find().count());
  	return;
  } else {
  	ensureVehicleAPI();
  }

});


function ensureIndexing () {
  // Makes sure the collections of database have the indices we need
  Listings._ensureIndex({'loc':'2d','make.name':1,'price':1,'year':1,'milage':1});
}

/*
	ensures data from the VehicleAPI
	- first fetching all makes 
	- aggregating styles for each model/year
	- inserting aggregated data into CarModels for later usage
*/

function ensureVehicleAPI () {

	var url = 'http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=jjawk3r63ms55jx5n8phfss7';

	HTTP.call( 'GET', url, function (error, answer) {
    // Get all makes from the API.
		// Iterate over them and one collect styles for each year & model
    if(error) {
      return console.log('Problem fetching makes from edmunds: ', error);
    }

		// parameters being passed before styles w/ aMake/aModel/aYear
		answer.data.makes.forEach(function (aMake) {

			aMake.models.forEach(function (aModel, i) {

				aModel.years.forEach(function (aYear, j) {
					
          // 1. We might have aMake locally, lets check that
          var makeToUpsert = CarModels.findOne(aModel.id);

          // 2. Do we have this make locally AND it has styles already?
          if(!!makeToUpsert && !!makeToUpsert.models[i].years[j].styles) {
            return;  // by pass with no action because we already have it.
          }

          // 3. Lets insert it after fetching the styles that corresponds to it
					var styleUrl = 'http://api.edmunds.com/api/vehicle/v2/'+aMake.niceName+'/'+aModel.niceName+'/'+aYear.year.toString()+'/styles?fmt=json&api_key=jjawk3r63ms55jx5n8phfss7'; 

					// This delay is to satisfy the requests per second allowed by the API.
					Meteor._sleepForMs(500);

					HTTP.call('GET', styleUrl, function (err, ans){
						
						if (err) {
							return console.log('Could not fetch style: ', err);
						}

						var theStyles = JSON.parse(ans.content).styles;

						
						aMake.models[i].years[j].styles = theStyles;
						console.log('years:   ', JSON.stringify(aMake.models[i].years[j]));

						CarModels.insert(aMake);
						// console.log(aMake.niceName+' '+ aModel.niceName +' '+aYear.year+' styles: ', theStyles);
					});

					// }






				});

			});

		});

	});


}