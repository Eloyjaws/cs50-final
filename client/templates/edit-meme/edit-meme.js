Template.edit_meme.events({
	"submit .edit-meme": function(event){
    	event.preventDefault();
        var name = event.target.name.value;
        var category = event.target.category.value;
        var description = event.target.description.value;
        var is_featured = event.target.is_featured.value;

        Raw_Memes.update({
            _id: this._id
        }, {
            $set:{
                name: name,
                category: category,
                description: description,
                is_featured: is_featured
            }
        });
        toastr.success("Meme Edited");


        event.target.name.value = "";
        event.target.category.value = "";
        event.target.description.value="";
        event.target.is_featured.value="";

        Router.go('/choose');
        return false;
    }
});

Template.edit_meme.helpers({
    'checkvalue': function(val1, val2){
        if (val1 == val2){
            return "checked";
        }
    }
});
