Zotero.zoteroEXTended = {
	DB: null,
	
	init: function () {
	},
	
	openWindow: function() {
		var strWindowFeatures = "resizable=no,chrome=yes,centerscreen=yes";
		this.ZEXTwindow = window.openDialog('chrome://zoteroEXTended/content/ui.xul',
		'Zotero EXTended',strWindowFeatures);
	},
	
	/*
	* Get the items that are selected in the Zotero GUI
	*/
	getSelectedItems: function() {
		var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator)
		.getMostRecentWindow("navigator:browser").ZoteroPane;
		return ZoteroPane.getSelectedItems();
	},
	
	addButtonClick: function() {
		// Get controls from the window
		var textbox = this.ZEXTwindow.document.getElementById('add-tag-textbox');
		var selectedRadio = this.ZEXTwindow.document.getElementById('add-tag-selecteditems-radio');
		var selectByTag = this.ZEXTwindow.document.getElementById('add-tag-select-by-tag');
		
		if (textbox.value != "") {
			var items;
			if (selectedRadio.selected)
				items = this.getSelectedItems(); // Get the selected items
			else
				items = Zotero.ExtBatch.findIdsByTag(selectByTag.value); // Get the items by tag
			
			if (items.length == 0)
				this.ZEXTwindow.alert("No items selected");
			else {
				Zotero.ExtBatch.addTags(items, textbox.value);
				this.ZEXTwindow.alert("Tag was successfully added");
				textbox.value = ""; // clear text box after adding tag
				this.loadTags(); // Refresh list of tags
			}
		}
		else {
			textbox.placeholder = "You forgot to give a tag!";
		}
	},
	
	removeButtonClick: function() {
		//clear the search box
		this.ZEXTwindow.document.getElementById('remove-tag-textbox').value ="";
		//uncheck the select all box
		this.ZEXTwindow.document.getElementById('remove-tag-select').checked=false;
		this.ZEXTwindow.document.getElementById('remove-tag-select').label="Select All";
		
		
		var selected = this.getSelectedTags('remove-tag-list');
		Zotero.ExtBatch.removeTags(selected);
	},
	
	/**
	* Get the list of selected tags to be merged and the name of the new tag
	*@param {String} id - the id of the object being passed in
	*/
	getSelectedTags: function(id) {
		var list = this.ZEXTwindow.document.getElementById(id).children;
		var selected = [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].checked){
				selected.push(list[i].label);
			}
		}
		return selected;
	},


	/**
	* Get the list of selected tags to be merged and the name of the new tag
	*@param {String} id - the id of the object being passed in
	*/
	runRenameTag: function(target) {
		//clear the search box
		this.ZEXTwindow.document.getElementById('edit-tag-textbox').value ="";
		var dict = {}; // create an empty dictionary
		var allTags = Zotero.Tags.getAll();
		var list = this.ZEXTwindow.document.getElementById(target).childNodes;
		for (var i = 0; i < list.length; i++) {
			if (list[i].id != list[i].value){
				dict[list[i].id] = list[i].value;
			}
		}
		var count = 0;
		for (var key in dict) {
			Zotero.ExtBatch.renameTag(key, dict[key]);
			count += 1;
		}
		Zotero.zoteroEXTended.loadTags();
		this.ZEXTwindow.alert(count + " tags successfully renamed");
	},
	
	/*
	* Render tags on changes detected within the search textbox
	* @param {String} id - id of the DOM element
	* @param {int} mode - 1 for edit, 2 for remove and merge, since edit uses textboxes instead of checkboxes
	* 
	*/
	searchTagsChange: function(id, textboxId, mode){
		//get the string that's being searched
		searchTag = this.ZEXTwindow.document.getElementById(textboxId).value;
		var list = this.ZEXTwindow.document.getElementById(id);
		
		//Clear all tags from the tab
		while (list.firstChild)
			list.removeChild(list.firstChild);
		
		//Try1 - This works but feels very inefficient. This is because we're getting all the tags and 
		//then checking if searchTag is a substring in each of them, one by one. 
		//There's gotta be better ways, as seen in the other tries below this one
		var allTags = Zotero.Tags.getAll();
		for (var id in allTags){
			currentTag = allTags[id].name;
			//check if the search string is a substring
			if (currentTag.toLowerCase().indexOf(searchTag.toLowerCase()) > -1){	
					
					// Edit tags case
					if (mode == 1){
						var row = this.ZEXTwindow.document.createElement('textbox');
						row.setAttribute('placeholder', 'new tag name');
						row.setAttribute('value', currentTag);
						row.setAttribute('id', currentTag);
						row.setAttribute('onfocus', "this.select();"); // hightlight box when clicked								
					}
					
					// Add, Merge tags case
					else if (mode == 2){	
						var row = this.ZEXTwindow.document.createElement('listitem');
						row.setAttribute('label', currentTag);
						row.setAttribute('type', 'checkbox');
					}
					
					list.appendChild(row);
			}
		}
		
		//The stuff below is a mess
		//Try2
		
		/*var s = new Zotero.Search();
		s.addCondition('tag', 'contains', searchTag);
		// Execute the search, results is an array of id's
		var results = s.search();
		// Return a list of Zotero items
		var test = Zotero.Items.get(results);
		
		for (var next in test) {
			alert(next);
		}
		
		test.forEach(function(entry) {
			alert(entry);
		});*/
		
		//Try 3
		
		/*var ids = [];
		ids = ids.concat(Object.values(Zotero.Tags.search(searchTag)));
		ids.forEach(function (tag) {
			alert(tag);
			alert(tag.name);
		});*/
		
	},

	
	/*
	* Toggle between SelectAll and Deselect All
	* @param {String} domId - id of the DOM element
	* @param {String} boxId - id of the checkbox
	*/
	selectToggle: function(boxId, domId){
		var box = this.ZEXTwindow.document.getElementById(boxId);
		var list = this.ZEXTwindow.document.getElementById(domId);
		
		if (box.checked){
			box.checked=false;
			box.label="Select All";	
		}
		else{
			box.checked=true;
			box.label="Deselect All";
		}
		
		//clear all tags
		while (list.firstChild)
			list.removeChild(list.firstChild);
		
		var allTags = Zotero.Tags.getAll();
		for (var id in allTags){
			currentTag = allTags[id].name;
			
			//re-render by selecting/unselecting all
			var row = this.ZEXTwindow.document.createElement('listitem');
			row.setAttribute('label', currentTag);
			row.setAttribute('type', 'checkbox');
			
			if (box.checked){
				row.setAttribute('checked', true);
			}
			else{
				row.setAttribute('checked', false);
			}
			list.appendChild(row);
		}
		
	},
	
	/*
	* Updates and fills in the tags listboxes in remove-tag/edit-tag tabs
	*/
	loadTags: function() {
		var removeList = this.ZEXTwindow.document.getElementById('remove-tag-list');
		var editList = this.ZEXTwindow.document.getElementById('edit-tag-list');
		var mergeList = this.ZEXTwindow.document.getElementById('merge-tag-list');
		
		while (removeList.firstChild)
			removeList.removeChild(removeList.firstChild);
		while (editList.firstChild)
			editList.removeChild(editList.firstChild);
		while (mergeList.firstChild)
			mergeList.removeChild(mergeList.firstChild);
		
		// Search for all tags
		//Zotero.Tags.reloadAll()
		var allTags = Zotero.Tags.getAll();
		for (var id in allTags){
			currentTag = allTags[id].name;
			// Create row for remove-tag list ------------------------------
			var row = this.ZEXTwindow.document.createElement('listitem');
			row.setAttribute('label', currentTag);
			row.setAttribute('type', 'checkbox');
				
			// Create row for merge-tag list ------------------------------
			var row1 = this.ZEXTwindow.document.createElement('listitem');
			row1.setAttribute('label', currentTag);
			row1.setAttribute('type', 'checkbox');
			
			// Create row for edit-tag list -----------------------------------
			//var row2 = this.ZEXTwindow.document.createElement('richlistitem');
			var textbox = this.ZEXTwindow.document.createElement('textbox');
			textbox.setAttribute('placeholder', 'new tag name');
			textbox.setAttribute('value', currentTag);
			textbox.setAttribute('id', currentTag);
			textbox.setAttribute('onfocus', "this.select();"); // hightlight box when clicked
			//row2.appendChild(textbox);
			
			// Add the rows to the respective listbox's
			removeList.appendChild(row);
			editList.appendChild(textbox);
			mergeList.appendChild(row1);
		}
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.zoteroEXTended.init(); }, false);
