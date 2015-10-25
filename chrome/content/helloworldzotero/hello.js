Zotero.HelloWorldZotero = {
	DB: null,
	
	init: function () {
		// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('helloworld');
		
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
		window.openDialog('chrome://helloworldzotero/content/ui.xul',
		'SQL INJECTORS TITLE','')
	},
	
	btnClick: function() {
		Zotero.HelloWorldZotero.insertHello();
	},
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.HelloWorldZotero.init(); }, false);