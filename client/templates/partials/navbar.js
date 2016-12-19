Template.navbar.events({
	"click .logout-link": function(){
		Meteor.logout(function(error){
			if (error) {
				toastr.error(error.reason);
			} else {
				toastr.success("You are now logged out");
				Router.go("/");
			}
		});
	}
});