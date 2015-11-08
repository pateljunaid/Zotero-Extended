Zotero.zoteroEXTended = {
	DB: null,
	
	init: function () {
		// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('zoteroEXTended');
		
		if (!this.DB.tableExists('changes')) {
			this.DB.query("CREATE TABLE changes (num INT)");
			this.DB.query("INSERT INTO changes VALUES (0)");
		}
	},
	
	insertHello: function() {
		var data = {
			title: "Zotero",
			company: "Center for History and New Media",
			creators: [
				['Dan', 'Stillman', 'programmer'],
				['Simon', 'Kornblith', 'programmer']
			],
			version: '1.0.1',
			company: 'Center for History and New Media',
			place: 'Fairfax, VA',
			url: 'http://www.zotero.org'
		};
		Zotero.Items.add('computerProgram', data); // returns a Zotero.Item instance
	},
	
	openWindow: function(){
		var strWindowFeatures = "resizable=no,chrome=yes,centerscreen=yes";
		this.ZEXTwindow = window.openDialog('chrome://zoteroEXTended/content/ui.xul',
		'Zotero EXTended',strWindowFeatures);
		//win.getElementById('enter-new-tag-label').setAttribute("value","TESTESTEST");
	},
	
	addButtonClick: function() {
		var textbox = this.ZEXTwindow.document.getElementById('add-tag-textbox');
		if (textbox.value != ""){
			alert(textbox.value);
			this.ZEXTwindow.focus(); //regain focus after alert window
			textbox.value = ""; //clear text box
		}
		else{
			textbox.placeholder = "You forgot to give a tag!";
		}
		this.insertHello();
		//Zotero.HelloWorldZotero.insertHello();
	},
	
	
	/*
	Updates and fills in the tags listboxes in remove-tag/edit-tag tabs
	*/
	loadTags: function(){
		var removeList = this.ZEXTwindow.document.getElementById('remove-tag-list');
		var editList = this.ZEXTwindow.document.getElementById('edit-tag-list');
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
			//row2.appendItem(currentTag);
			row2.appendChild(textbox);
			
			
			//var row2 = this.ZEXTwindow.document.createElement('listitem');
			//var cell = this.ZEXTwindow.document.createElement('listcell');
			//var textbox = this.ZEXTwindow.document.createElement('textbox');
			//cell.setAttribute('label', currentTag);
			//textbox.setAttribute('placeholder', 'new tag name');
			//row2.appendChild(cell);
			//row2.appendChild(textbox);
			
			
			// Add the rows to the respective listbox's
			removeList.appendChild(row);
			editList.appendChild(row2);
		}
		//alert(Zotero.Tags.getAll());
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.zoteroEXTended.init(); }, false);