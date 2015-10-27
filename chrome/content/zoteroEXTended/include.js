// Only create main object once
if (!Zotero.zoteroEXTended) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zoteroEXTended/content/zoteroEXT.js");
	loader.loadSubScript("chrome://zoteroEXTended/content/ExtBatch.js");
}
