Meteor.methods({

addMemes: function(file, name, category, description, is_featured) {
        console.log("Inside Meteor Call, at start");
        if (file) {
        	fsFile = new FS.File(file);
      		Raw_Meme_Images.insert(fsFile, function (err, fileObj) {
        	//Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        	if (!err) {
                    toastr.success("Meme Added");
                    console.log("Inside Meteor Call, no err");
                    var Meme = '/cfs/files/Raw_Memes/' + fileObj._id;
                    Raw_Memes.insert({
                        name: name,
                        category: category,
                        description: description,
                        is_featured: is_featured,
                        image: Meme,
                        createdAt: new Date()
                    });
                }
    		});

        } else {
            toastr.error("Meme NOT Added. Could not detect file.");
            console.log("Inside Meteor Call, w/err");
    	}
    },        	

    addMeme: function(file, name, category, description, is_featured) {
        console.log("Inside Meteor Call, at start");
        if (file) {
            fsFile = new FS.File(file);
            Meme.insert(fsFile, function (err, result) {
                if (!err) {
                    toastr.success("Meme Added");
                    console.log("Inside Meteor Call, no err");
                    var Meme = '/cfs/files/Meme/' + result._id;
                    Meme_raw.insert({
                        name: name,
                        category: category,
                        description: description,
                        is_featured: is_featured,
                        image: Meme,
                        createdAt: new Date()
                    });
                }
            });

        } else {
            toastr.error("Meme NOT Added");
            console.log("Inside Meteor Call, w/err");
    	}
    },

    addCaption: function(id, caption_top, caption_bottom){
        Meme_raw.update({_id: id}, {
            $push: {
                caption: {
                    caption_top: caption_top,
                    caption_bottom: caption_bottom,
                    caption_date: new Date()
                }
            }
        });
        toastr.success('Caption Noted');
    }

});
//**************************************
/*Meteor.methods({
	addProduct: function(file, name, category, description, is_featured){
		if (file) {
			fsFile = new FS.File(file);
			ProductsImages.insert(fsFile, function(err, result){
				if (!err) {
					var productImage = '/cfs/files/ProductsImages/'+result._id;

					Products.insert({
						name: name,
						category: category,
						description: description,
						is_featured: is_featured,
						image: productImage,
						createdAt: new Date()
					});
				}
			});

		} else {
				var productImage = '/img/noimage.png';

					Products.insert({
						name: name,
						category: category,
						description: description,
						is_featured: is_featured,
						image: productImage,
						createdAt: new Date()
					});
		}


	},

	addReview: function(id, rating, body){
		Products.update({
			_id: id
			},{
			$push:{
				reviews:{
					rating: rating,
					body: body,
					review_date: new Date()
				}
			}
		});
	}

});*/