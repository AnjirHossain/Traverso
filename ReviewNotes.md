
#Code review notes
Oct 3, 2015 by Sebastian Sastre (sebastian@flowingconcept.com)

- great that you kept css short in each template folder!
- super short files are fine!
- keep files shorter, root.js is huge! 
- when you define models use one file per model using the name of the model in the filename. That way you can find them easily and setup all its concerns and rules in that one place. So in `models/` dir you'd have `models/Listing.js` and so on.
- I suggest always using 1 file per template, with its filename having the same identical name than the template's.
- You might want to try to upgrade to Meteor 1.2 see if all goes fine (1.2 officially supports angular now)
- After a clean clone, I've found exceptions when `init` and the navar is not rendered, investigating...
- urigo:angular is deprecated
- 
