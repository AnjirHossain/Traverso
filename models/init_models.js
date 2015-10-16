Listings = new Mongo.Collection('listings');

Images = new FS.Collection("images", {
    stores: [
        new FS.Store.GridFS("images")
    ]
});

UserImages = new FS.Collection("userimages", {
    stores: [
        new FS.Store.GridFS("userimages")
    ]
});

Listings.allow({
	insert: function(userId, listing) {
		return userId && listing.owner === userId;
	},
    update: function(userId, docs, fields, modifier) {
		if (fields.views && modifier["$set"] && modifier["$set"].views) {
			return true; // don't deny this
		}
	},
	remove: function(userId, listing){
		return userId && listing.owner === userId;
	}
});

Images.allow({
	insert: function(userId, image) {
		return true;
	},
	update: function(userId, image, fields, modifier) {
		return true;
	},
	remove: function(userId, image){
		return true;
	},
	download:function(){
		return true;
	}
});

// UserImages.allow({
	
// });

