// Meteor.subscribe('traversousers');

Template.createAuth.events({
    'submit #createAuthFormTag': function (event) {
        // event.preventDefault();
        var user, 
        	passwordsDontMatch;

	    // Collect data and validate it.

	    // You can go about getting your data from the form any way you choose, but
	    // in the end you want something formatted like so:
	    user = {
			username: event.target.createuserusername.value,
			email: event.target.createuseremail.value,
			password: event.target.createuserpassword.value,
			passwordConfirmed: event.target.createuserpasswordconfirm.value,
			profile: {
				firstName: event.target.createuserfirstname.value,
				lastName: event.target.createuselastrname.value,
				name: event.target.createuserfirstname.value + ' ' + event.target.createuselastrname.value, 
				phone: event.target.createusercell.value
			}
	    }

	    /*
			if ( passwordsDontMatch ) {
				alert user through dom

					select e in dom 
					update its message
					clear password fields
					return 
			}
	    */

	    passwordsDontMatch = !(user.password === user.passwordConfirmed);

	    if ( passwordsDontMatch ) {

	    	var errMessage = "Oops! passwords don't match, <span style=\"color:#00E364;\"> lets try that again !</span>";
	    	document.getElementById('createAuthError').innerHTML = errMessage;
	    	
	    	event.target.createuserpassword.value = '';
	    	event.target.createuserpasswordconfirm.value = '';
	    	return;
	    }


		Accounts.createUser(user, function (error) {
			// target which field causes error, notify
			var errMessage;
			if (error) {
				
				if (error.reason){
					console.log(error.reason);
					if (error.reason === 'internal server error') {
						errMessage = "Make sure you've entered valid all fields and provided a valid email";
						document.getElementById('createAuthError').innerHTML = errMessage;
					} 

				}

				errMessage = "Oops, looks like <span style=\"text-transform:lowercase;color:#F84D34;\">" + error.reason + "</span> <span style=\"color:#00E364;\">Lets try again!</span>";
				document.getElementById('createAuthError').innerHTML = errMessage;
				return;
			} else {
				console.log(user);
			}
		});


		// a lil twist o da knob to get things right

		event.target.createuserusername.value = '';
		event.target.createuseremail.value = '';
		event.target.createuserpassword.value = '';
		event.target.createuserpasswordconfirm.value = '';
		event.target.createuserfirstname.value = '';
		event.target.createuserlastname.value = '';
		event.target.createusercell.value = '';
        return false;
    }
});

Template.useExistingAuth.events({
    'submit #useAuthFormTag': function (event) {
        // event.preventDefault();

        var username = event.target.loginusername.value,
            password = event.target.loginpassword.value;

        Meteor.loginWithPassword(username, password, function(error) {
        	// target which field causes error, notify
            var errMessage;

            if ( error ) {
            	if (error.reason) {
            		console.log(error.reason);
            		if (error.reason === 'internal server error') {
						errMessage = "Make sure you've entered valid all fields and provided a valid email";
						document.getElementById('createAuthError').innerHTML = errMessage;
						return;
					} 

            		errMessage = "Oops, <span style=\"text-transform:lowercase;color:#F84D34;\">" + error.reason + "</span> <span style=\"color:#00E364;\">Lets try again !</span>";
            		document.getElementById('useAuthError').innerHTML = errMessage;
            	}
            	return;
            } else if(Meteor.user()) {
            	console.log("Sombody logged in: " + Meteor.user().profile.name);
            } else {
            	console.log("multiple things could've gone wrong");
            }
            
        });

        event.target.loginusername.value = '';
        event.target.loginpassword.value = '';
        return false;
    }
});

Template.dashPreviewInNav.events({
    'click #signOut': function (event) {
        // event.preventDefault();
        Meteor.logout(function() {/*handle*/});
        
        return;
    }
});