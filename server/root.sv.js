Meteor.publish('images', function() {
	return Images.find();
});

Meteor.publish('traversousers', function() {
	return TraversoUsers.find();
});

Meteor.publish('listings', function( searchProps ) {
	
	check(searchProps, Object);
	Listings._ensureIndex({"loc":"2d","make.name":1,"price":1,"year":1,"milage":1});

	var selectors = {};

	// find a better way to store all specificity than just if elses
	if ( searchProps.address ) {
		selectors["loc"] = { 
	   		$near: [ searchProps.address.geometry.location.L, searchProps.address.geometry.location.H],
	   		$maxDistance: 1.5/3963.2 // radius
	    };		
	} 
 
	if ( searchProps.make && searchProps.make.name ) {
		selectors["make.name"] = searchProps.make.name;
	}

	if ( searchProps.model && searchProps.model.name ) {
		selectors["model.name"] = searchProps.model.name;
	}

	if ( searchProps.mileageMax && searchProps.mileageMin ) {
		selectors["milage"] = { 
			$gte: parseInt(searchProps.mileageMin), 
			$lte: parseInt(searchProps.mileageMax)
		};
	} else {
		
		if ( searchProps.mileageMax ) {
			selectors["milage"] = {
				$lte: parseInt(searchProps.mileageMax)	
			};
		} 
			
		if ( searchProps.mileageMin ) {
			selectors["milage"] = {
				$gte: parseInt(searchProps.mileageMin)	
			};
		} 
	}

	if ( searchProps.priceMax && searchProps.priceMin ) {
		selectors["price"] = { 
			$gte: parseInt(searchProps.priceMin), 
			$lte: parseInt(searchProps.priceMax)
		};
	} else {
		
		if ( searchProps.priceMax ) {
			selectors["price"] = {
				$lte: parseInt(searchProps.priceMax)	
			};
		} 
			
		if ( searchProps.priceMin ) {
			selectors["price"] = {
				$gte: parseInt(searchProps.priceMin)	
			};
		} 
	}

	if ( searchProps.priceMax && searchProps.priceMin ) {
		selectors["price"] = { 
			$gte: parseInt(searchProps.priceMin), 
			$lte: parseInt(searchProps.priceMax)
		};
	} else {
		
		if ( searchProps.priceMax ) {
			selectors["price"] = {
				$lte: parseInt(searchProps.priceMax)	
			};
		} 
			
		if ( searchProps.priceMin ) {
			selectors["price"] = {
				$gte: parseInt(searchProps.priceMin)	
			};
		} 
	}

	if ( searchProps.yearMax && searchProps.yearMin ) {
		selectors["year"] = { 
			$gte: parseInt(searchProps.yearMin), 
			$lte: parseInt(searchProps.yearMax)
		};
	} else {
		
		if ( searchProps.yearMax ) {
			selectors["year"] = {
				$lte: parseInt(searchProps.yearMax)	
			};
		} 
			
		if ( searchProps.yearMin ) {
			selectors["year"] = {
				$gte: parseInt(searchProps.yearMin)	
			};
		} 
	}

	// temp
	return Listings.find({
		$or: [ selectors ]
	});

});

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