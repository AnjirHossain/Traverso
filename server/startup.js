Meteor.startup(function () {
  ensureIndexing();
});


function ensureIndexing () {
  // Makes sure the collections of database have the indices we need
  Listings._ensureIndex({'loc':'2d','make.name':1,'price':1,'year':1,'milage':1});

}