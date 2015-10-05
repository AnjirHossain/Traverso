Meteor.methods({

  getListings: function ( searchProps ) {
    // Answers the listings that result from querying based on the given searchProps.
    check(searchProps, Object);

    // default, manages to retreive 
    var selectors = {},
        maxDistance = 0.009;

    // find a better way to store all specificity than just if elses
    if ( searchProps.address ) {

      // magic numbers for now, will get much better
      if ( searchProps.address.address_components && searchProps.address.address_components.length < 6 ) {
        maxDistance = 0.15;        
      }      

      selectors['loc'] = { 
        $near: [ searchProps.address.geometry.location.L, searchProps.address.geometry.location.H],
        $maxDistance: maxDistance
      };    
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
    }).fetch();
  }
});