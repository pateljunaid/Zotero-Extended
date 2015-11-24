Zotero.cslEdit = {
	DB: null,
	
	init: function () {
	},
	
	openWindow: function() {
		
		var request = new XMLHttpRequest();
		request.open('GET', "chrome://zoteroEXTended/content/csl_server_url.cfg", false);
		request.send(null);
		var server_url= "http://104.196.43.156:5001/about/"; // fallback server URL;
		if (request.status == 200){
			server_url = request.responseText;
		}
		
		var strWindowFeatures = "resizable=yes,chrome=yes,centerscreen=yes";
		this.cslWindow = window.openDialog("chrome://zoteroEXTended/content/browser.xul",
					"basicViewer", "chrome,resizable,centerscreen,menubar,scrollbars", server_url);		
	},
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.cslEdit.init(); }, false);
