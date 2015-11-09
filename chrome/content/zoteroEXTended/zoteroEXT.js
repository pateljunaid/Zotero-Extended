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
			alert("Tag was successfully added");
			this.ZEXTwindow.focus(); //regain focus after alert window
			textbox.value = ""; //clear text box
		}
		else {
			textbox.placeholder = "You forgot to give a tag!";
		}
	},
	
	/*
	* Updates and fills in the tags listboxes in remove-tag/edit-tag tabs
	*/
	loadTags: function() {
		var removeList = this.ZEXTwindow.document.getElementById('remove-tag-list');
		var editList = this.ZEXTwindow.document.getElementById('edit-tag-list');
		var mergeList = this.ZEXTwindow.document.getElementById('merge-tags-list');
		// Search for all tags
		var allTags = Zotero.Tags.search();
		for (var id in allTags){
			currentTag = allTags[id].name;
			// Create row for remove-tag list ------------------------------
			var row = this.ZEXTwindow.document.createElement('listitem');
			row.setAttribute('label', currentTag);
			row.setAttribute('type', 'checkbox');

			// Create row for edit-tag list -----------------------------------
			var row2 = this.ZEXTwindow.document.createElement('richlistitem');
			var textbox = this.ZEXTwindow.document.createElement('textbox');
			textbox.setAttribute('placeholder', 'new tag name');
			textbox.setAttribute('value', currentTag);
			textbox.setAttribute('onfocus', "this.select();"); //hightlight box when clicked
			row2.appendChild(textbox);
			
			// Add the rows to the respective listbox's
			removeList.appendChild(row);
			mergeList.appendChild(row);
			editList.appendChild(row2);
		}
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.zoteroEXTended.init(); }, false);