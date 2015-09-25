Meteor.publish('images', function() {
	return Images.find();
});

Meteor.publish('traversousers', function() {
	return TraversoUsers.find();
});

Meteor.publish('listings', function( searchProps ) {
	check(searchProps, Object);
	
	// to give listings to other parts of app that don't have selectors
	var selectors = {};
	
	if ( !searchProps ) {
		// selectors["noop"] = true;	
	}

	Listings._ensureIndex({"loc": "2dsphere"}); // work around

	if ( searchProps.address && searchProps.address.geometry ) {
		var lat = searchProps.address.geometry.location.G,
			lon = searchProps.address.geometry.location.K,
			maxDistance = 1.5/3963.2;

		selectors["loc"] = { 
			$geoWithin: { 
				$geometry: { 
					$centerSphere: [ [ lon, lat ], maxDistance ] 
				}
			}
		};
	}

	return Listings.findFaster({
		$or: [ selectors ]
	}, { fields: { price: 1 } });
});

// Meteor.publish('listings', function(){
// 	return Listings.find();
// });

Accounts.config({
	sendVerificationEmail: true,
	forbidClientAccountCreation: false, /*gotta move to server*/
	loginExpirationInDays: 365 
	/*need to throw OAuth Secret key in here*/
});

Accounts.validateNewUser(function (user) {  
	// Ensure user name is long enough
	if (user.username.length < 4) {
		throw new Meteor.Error(403, 'Your username needs at least 4 characters');
	}

	var passwordTest = new RegExp("(?=.{6,}).*", "g");
	if (passwordTest.test(user.password) == false) {
		if (! user.password === user.passwordConfirmed ) {
			throw new Meteor.Error(403, 'Your password is too weak !');
		}
	}

	return true;
});