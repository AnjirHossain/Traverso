Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('traversousers', function() {
  return TraversoUsers.find();
});

Meteor.publish('listings', function() {
  return Listings.find();
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
		throw new Meteor.Error(403, 'Your username needs at least 5 characters');
	}

	var passwordTest = new RegExp("(?=.{6,}).*", "g");
	if (passwordTest.test(user.password) == false) {
		if (! user.password === user.passwordConfirmed ) {
			throw new Meteor.Error(403, 'Your password is too weak!');
		}
	}

	return true;
});