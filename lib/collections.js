//Meme Categories
Categories = new Mongo.Collection("categories");

Raw_Memes = new Mongo.Collection("raw_Memes");

Edited_Memes = new Mongo.Collection("edited_Memes");

//
Raw_Meme_Images = new FS.Collection("raw_Meme_Images", {
  stores: [new FS.Store.FileSystem("raw_Meme_Images", {path: "~/raw_memes"})]
});

Edited_Meme_Images = new FS.Collection("edited_Meme_Images", {
  stores: [new FS.Store.FileSystem("edited_Meme_Images", {path: "~/edited_Meme_Images"})]
});

Raw_Meme_Images.allow({
	insert: function(fileId, doc){
		return true;
	},
	download: function(fileId, doc){
		return true;
	}
});

Edited_Meme_Images.allow({
	insert: function(fileId, doc){
		return true;
	},
	download: function(fileId, doc){
		return true;
	}
});
