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
	* @param {String} id - ID of the DOM element
	* @param {String} textboxId - ID of the searchbox
	* @param {int} mode - 1 for edit, 2 for remove and merge, since edit uses textboxes instead of checkboxes
	* 
	*/
	searchTagsChange: function(id, textboxId, mode){
		//get the string that's being searched
		var searchTag = this.ZEXTwindow.document.getElementById(textboxId).value;
		var list = this.ZEXTwindow.document.getElementById(id);
		var no_match = true;

		this.resetSelectAll();

		//Clear all tags from the tab
		while (list.firstChild)
			list.removeChild(list.firstChild);
		
		var allTags = Zotero.Tags.getAll();
		for (var id in allTags){
			currentTag = allTags[id].name;
			//check if the search string is a substring
			if (currentTag.toLowerCase().indexOf(searchTag.toLowerCase()) > -1){	
					no_match = false;
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

		//Display "No matching tags" if there aren't any matches
		if (no_match){			
			var row = this.ZEXTwindow.document.createElement('listitem');
			row.setAttribute('label', "No matching tags");
			list.appendChild(row);
		}
	},

	
	/*
	* Toggle between SelectAll and Deselect All
	* @param {String} domId - id of the DOM element
	* @param {String} boxId - id of the checkbox
	*/
	selectToggle: function(boxId, domId){
		var box = this.ZEXTwindow.document.getElementById(boxId);
		var list = this.ZEXTwindow.document.getElementById(domId);
		var extract = domId.split('-')[0] + "-tag-textbox";
		var searchTag = this.ZEXTwindow.document.getElementById(extract).value;
		
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
		
		//render all tags with either checked boxes or unchecked ones
		var allTags = Zotero.Tags.getAll();
		
		for (var id in allTags){
			currentTag = allTags[id].name;
			if (currentTag.toLowerCase().indexOf(searchTag.toLowerCase()) > -1){	
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
			
		}
	},
	
	/*
	* Resets searchbox content
	*/
	resetSearch: function(){
		//Clear searchboxes
		this.ZEXTwindow.document.getElementById('remove-tag-textbox').value ="";
		this.ZEXTwindow.document.getElementById('edit-tag-textbox').value ="";
		this.ZEXTwindow.document.getElementById('merge-tag-textbox').value ="";
	},
	
	/*
	* Resets Select All checkbox content
	*/
	resetSelectAll: function(){
		//uncheck the select all box and reset the name
		this.ZEXTwindow.document.getElementById('remove-tag-select').checked=false;
		this.ZEXTwindow.document.getElementById('remove-tag-select').label="Select All";
		
		this.ZEXTwindow.document.getElementById('merge-tag-select').checked=false;
		this.ZEXTwindow.document.getElementById('merge-tag-select').label="Select All";
	},
	
	/*
	* Updates and fills in the tags listboxes in remove-tag/edit-tag tabs
	*/
	loadTags: function() {	
		//clear fields
		this.resetSearch();
		this.resetSelectAll();
		
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
