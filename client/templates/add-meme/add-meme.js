Template.add_meme.events({
	"submit .add-meme": function(event){
    	event.preventDefault();
        var name = event.target.name.value;
        var category = event.target.category.value;
        var description = event.target.description.value;
        var is_featured = event.target.is_featured.value;
        var image_url = event.target.picture.value;

        if (image_url) {
            console.log("Inside Meteor Call, no err");
            Raw_Memes.insert({
                name: name,
                category: category,
                description: description,
                is_featured: is_featured,
                image_url: image_url,
                createdAt: new Date()
            });
            toastr.success("Meme Added");
        } else {
            toastr.error("Meme NOT Added. Could not detect file.");
            console.log("Inside Meteor Call, w/err");
    	}
    
        event.target.name.value = "";
        event.target.category.value = "";
        event.target.description.value="";
        event.target.is_featured.value="";

        Router.go('/');
        return false;
    }
});


