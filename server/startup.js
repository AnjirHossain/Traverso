Meteor.startup(function () {
  ensureIndexing();
  // console.log('line 7 startup in server', Meteor.users.find({'profile.profileType':'dealership'}).fetch() );

  if (Meteor.users.find({'profile.profileType':'dealership'}).fetch().length === 0) {
  	console.log('dealer accounts count:', Meteor.users.find({'profile.profileType':'dealership'}).fetch().length);
  	seedDbWithDealershipAccounts();
  }

});


function ensureIndexing() {
  // Makes sure the collections of database have the indices we need
  Listings._ensureIndex({'loc':'2d','make':1,'price':1,'year':1,'milage':1});
}

function seedDbWithDealershipAccounts() {
	var dealers = [
		{
			username: 'Porsche of Seattle',
			email: 'sales@porscheofseattle.com',
			password: 'seattle_porsche',
			passwordConfirmed: 'seattle_porsche',
			profile: {
				profilePicUrl: '/imgs/img_route_profile/current_user_null.png',
				profileType: 'dealership',
				name: 'Porsche of Seattle', 
				phone: '2062303490'
			}
	    }
	];

	for (var i = 0; i < dealers.length; i++) {
		// dealers[i] store in var called dealer

		Accounts.createUser(dealers[i]);
	}


	/*
		Accounts.createUser(user, function (error) {
			// target which field causes error, notify
			var errMessage;
			if (error) {
				
				if (error.reason){
					console.log(error.reason);
					if (error.reason === 'internal server error') {
						errMessage = "Make sure you've provided all fields and provided a valid email";
						document.getElementById('createAuthError').innerHTML = errMessage;
					} 

				}

				errMessage = "Oops, looks like <span style=\"text-transform:lowercase;color:#F84D34;\">" + error.reason + "</span> <span style=\"color:#00E364;\">Lets try again!</span>";
				document.getElementById('createAuthError').innerHTML = errMessage;
				return;
			} else {
				console.log('individual account', user);
				Session.set('avi', user.profile.profilePicUrl);
				Session.set('createDealerAccount', false);
				Session.set('createIndividualAccount', false);
				Session.set('chooseAccountType', true);
			}
		});
	*/
}