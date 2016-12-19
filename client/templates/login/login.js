
Template.login.helpers({
	userEmail: function(){
		return Meteor.user().emails[0].address;
	}
});

Template.login.events({
		"click .register-link": function(event){
		$('.panel-login').hide();
		$('.panel-register').fadeIn();
	},
	"click .login-link": function(event){
		$('.panel-register').hide();
		$('.panel-login').fadeIn();
	},
	"submit .register-form": function(event){
		var email = event.target.email.value;
		var password = event.target.password.value;
		var password2 = event.target.password2.value;

		if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, password2)) {
		Accounts.createUser({
				email: email,
				password: password,
				profile: {
					usertype: 'customer'
				}
			}, function(err){
				if (err) {
					console.log("error");
					toastr.error('There was an error with registration');
				} else {
					toastr.success('You are now logged in');
					Router.go('/');
				}
			});
			}
			return false;
		},
		"submit .login-form": function(event){
			var email = event.target.email.value;
			var password = event.target.password.value;

			Meteor.loginWithPassword(email, password, function(error){
				if (error) {
					event.target.email.value = email;
					event.target.password.value = password;
					toastr.error(error.reason);
				} else {
					toastr.success('You are now logged in');
					Router.go('/');
				}
			});
				//clear form
				event.target.email.value = "";
				event.target.password.value = "";

				//prevent Submit
				return false;
		},

		
});


//validation rules

//trim helper
var trimInput = function(val){
	return val.replace(/^\s*|\s*$/g, "");
}

//check for empty fields
isNotEmpty = function(value){
	if (value && value !== '') {
		return true;
	}
	toastr.error('Please fill in all the fields');
	return false;
};

//validate email
isEmail = function(value){
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA=Z0-9]{2,4})+$/;
	if (filter.test(value)) {
		return true;
	}
	toastr.error('Please use a valid Email address');
	return false;
};

//Check password field
isValidPassword = function(password){
	if (password.length < 6){
		toastr.error('Password must be at least 6 characters');
		return false;
	}
	return true;
};

//Match passwords
areValidPasswords = function(password, confirm){
	if (!isValidPassword(password)) {
		return false;
	}
	if (password !== confirm) {
		toastr.error('Passwords do not match!');
		return false;
	}
	return true;
};