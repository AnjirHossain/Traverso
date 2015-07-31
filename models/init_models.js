Listings = new Mongo.Collection('listings');

TraversoUsers = new Mongo.Collection('traversousers');

Images = new FS.Collection("images", {
    stores: [
        new FS.Store.GridFS("images")
    ]
});

TraversoUsers.allow({
	insert: function(userId, userWListing) {
		return userId;
	},
	update: function(userId, userWListing, fields, modifier) {
		return userId;
	},
	remove: function(userId, userWListing){
		return userId;
	}
});

/*attempting insert only if userId exists__
  if this does not work retreat to raw true/false*/
Listings.allow({
	insert: function(userId, listing) {
		return userId && listing.owner === userId;
	},
	update: function(userId, listing, fields, modifier) {
		return userId && listing.owner === userId;
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