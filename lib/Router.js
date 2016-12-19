Router.configure({
	layoutTemplate: 'layout'
});

var OnBeforeActions = {
	loginRequired: function(){
		if (!Meteor.userId()) {
			Router.go('/');
			toastr.info("You have to sign in first!");
		} else {
			this.next();
		}
	}
}

Router.onBeforeAction(OnBeforeActions.loginRequired, {
	only: ['create','add']
});


Router.map(function(){
	this.route('home',{
		path: '/',
		template: 'home'
	});

	this.route('choose', {
		path: '/choose',
		template: 'choose',
		data: function(){
			templateData = {
				Raw_Meme: Raw_Memes.find()
			};
			
			return templateData;
		}
	});

	this.route('add', {
		path: '/add',
		template: 'add_meme',
		data: function(){
			templateData = {
				categories: Categories.find()
			};
			
			return templateData;
		}
	});

	this.route('edit', {
		path: '/edit/:_id',
		template: 'edit_meme',
		data: function(){
			return Raw_Memes.findOne(this.params._id);
		}
	});

	this.route('create_meme', {
		path: '/create_meme/:_id',
		template: 'create_meme',
		data: function(){
			return Raw_Memes.findOne(this.params._id)
		}
	});

	this.route('savememe', {
		path:'/savememe/:_id',
		template: 'savememe',
		data: function(){
			return Edited_Memes.findOne(this.params._id)
		}
	});
});