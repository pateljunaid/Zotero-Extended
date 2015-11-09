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
			
			Zotero.ExtBatch.addTags(items, textbox.value);
			this.ZEXTwindow.alert("Tag was successfully added");
			textbox.value = ""; // clear text box after adding tag
		}
		else {
			textbox.placeholder = "You forgot to give a tag!";
		}
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

	//Doesn't work yet...very close, something needs to be changed
	runRenameTag: function(id) {
		var allTags = Zotero.Tags.getAll();
		var list = this.ZEXTwindow.document.getElementById(id).childNodes;
		for (var i = 0; i < list.length; i++) {
			alert(allTags[list[i].id].name);
			if (allTags[list[i].id].name != list[i].value){
				Zotero.ExtBatch.renameTag(list[i].id, list[i].value);
				Zotero.zoteroEXTended.loadTags();
			}
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
			textbox.setAttribute('id', id);
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