Zotero.ExtBatch = {
	
	// Return an array of Zotero items that have a tag with value 'tag'
	findIdsByTag: function(tag) {
		// Initiliaze the search object and set the condition 
		var s = new Zotero.Search();
		s.addCondition('tag', 'is', tag);
		// Execute the search, results is an array of id's
		var results = s.search();
		// return a list of Zotero items	
		return Zotero.Items.get(results);
	},
	
	// Add a tag with the value of 'tag' to each item in 'items'
	addTags: function(items, tag) {
		items.forEach(function(entry) {
			// add a tag to each item
			entry.addTag(tag);
		});
	},
	
	removeTags: function(items, tag) {
		items.forEach(function(entry) {
			// remove the tag from each item
			// entry.removeTag(tag); - not working
		});
	}
};