Zotero.cslEdit = {
	DB: null,
	
	init: function () {
	},
	
	openWindow: function() {
		
		var strWindowFeatures = "resizable=yes,chrome=yes,centerscreen=yes";
		this.cslWindow = window.openDialog("chrome://zoteroEXTended/content/browser.xul",
					"basicViewer", "chrome,resizable,centerscreen,menubar,scrollbars", "http://54.84.6.245:5001/about/");		
	},
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.cslEdit.init(); }, false);
