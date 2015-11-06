Meteor.startup(function(){

	// temp adding more subscriptions soon
	Meteor.subscribe('users');
	Meteor.subscribe('userimages');
	
	// if no users w/ profileType: 'dealership'
	
});

// will be the single location where all session variables are set
function setSessionVariables() {
	Session.setDefault('createDealerAccount', false);
	Session.setDefault('createIndividualAccount', false);
	Session.setDefault('chooseAccountType', true);
}