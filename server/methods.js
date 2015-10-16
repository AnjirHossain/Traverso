Meteor.methods({

  getListings: function ( searchProps ) {
    // Answers the listings that result from querying based on the given searchProps.
    check(searchProps, Object);

    // default, manages to retreive 
    var selectors = {},
        maxDistance = 16/3963;

    // find a better way to store all specificity than just if elses
    if ( searchProps.address ) {

      // magic numbers for now, will get much better
      if ( searchProps.address.address_components && searchProps.address.address_components.length > 6 ) {
        maxDistance = 7/3963;        
      }      

      // google api geom object returns letters
      // instead of lat long, so this is a way to always have the right value
      var location_obj = {},
          location_arr = [];

      console.log('location in server: ', searchProps.address.geometry.location);

      if ( searchProps.address.geometry.location ) {

        console.log('here it is: ', searchProps.address.geometry.location);
        
        var lng = searchProps.address.geometry.location.longitudeFinal,
            lat = searchProps.address.geometry.location.latitudeFinal;

        selectors['loc'] = {
          $geoWithin: {
            $centerSphere: [[ lng, lat], maxDistance]
          }
        };
      }
      
    }
   
    if ( searchProps.make && searchProps.make.name ) {
      selectors['make.name'] = searchProps.make.name;
    }

    if ( searchProps.model && searchProps.model.name ) {
      selectors[ 'model.name'] = searchProps.model.name;
    }

    if ( searchProps.mileageMax && searchProps.mileageMin ) {
      selectors['milage'] = { 
        $gte: parseInt(searchProps.mileageMin), 
        $lte: parseInt(searchProps.mileageMax)
      };
    } else {

      if ( searchProps.mileageMax ) {
        selectors['milage'] = {
          $lte: parseInt(searchProps.mileageMax)  
        };
      } 
        
      if ( searchProps.mileageMin ) {
        selectors['milage'] = {
          $gte: parseInt(searchProps.mileageMin)  
        };
      } 
    }

    if ( searchProps.priceMax && searchProps.priceMin ) {
      selectors['price'] = { 
        $gte: parseInt(searchProps.priceMin), 
        $lte: parseInt(searchProps.priceMax)
      };
    } else {
      
      if ( searchProps.priceMax ) {
        selectors['price'] = {
          $lte: parseInt(searchProps.priceMax)  
        };
      } 
        
      if ( searchProps.priceMin ) {
        selectors['price'] = {
          $gte: parseInt(searchProps.priceMin)  
        };
      } 
    }

    if ( searchProps.priceMax && searchProps.priceMin ) {
      selectors['price'] = { 
        $gte: parseInt(searchProps.priceMin), 
        $lte: parseInt(searchProps.priceMax)
      };
    } else {
      
      if ( searchProps.priceMax ) {
        selectors['price'] = {
          $lte: parseInt(searchProps.priceMax)  
        };
      } 
        
      if ( searchProps.priceMin ) {
        selectors['price'] = {
          $gte: parseInt(searchProps.priceMin)  
        };
      } 
    }

    if ( searchProps.yearMax && searchProps.yearMin ) {
      selectors['year'] = { 
        $gte: parseInt(searchProps.yearMin), 
        $lte: parseInt(searchProps.yearMax)
      };
    } else {
      
      if ( searchProps.yearMax ) {
        selectors['year'] = {
          $lte: parseInt(searchProps.yearMax) 
        };
      } 
        
      if ( searchProps.yearMin ) {
        selectors['year'] = {
          $gte: parseInt(searchProps.yearMin) 
        };
      } 
    }

    // temp
    return Listings.find({
      $or: [ selectors ]
    }, { sort: {'loc': -1} }).fetch();
  },
  // get listingOwner
  getListingOwner: function ( ownerId ) {
    check(ownerId, String);

    return Meteor.users.find({_id: ownerId}).fetch();
  }
});