/*
    ***** BEGIN LICENSE BLOCK *****
    
    Copyright © 2011 Center for History and New Media
                     George Mason University, Fairfax, Virginia, USA
                     http://zotero.org
    
    This file is part of Zotero.
    
    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
    
    ***** END LICENSE BLOCK *****
*/

var browser;
function loadURI() {
	browser.loadURI.apply(browser, arguments);
}

window.addEventListener("load", function() {
	document.title = "ZoteroEXT - Custom output styles";
	browser = document.getElementById('my-browser');
	// align page title with title of shown document
	browser.addEventListener("pageshow", function() {
		/* NADEEM: Let's add a listener to the cslDownload event
		 * 	Whenever the user downloads a csl it will download it here
		 *		Using aux data.
		 */
		browser.contentDocument.addEventListener("cslDownload", function(event){
				var csl = event.detail.cslData;
				Zotero.Styles.install(csl, 'ZoteroEXT');
		});
		
	}, false);
	
	// show document
	browser.loadURI.apply(browser, window.arguments);
	
	// XXX Why is this necessary to make the scroll bars appear?
	window.setTimeout(function() {
		document.getElementById("my-browser").style.overflow = "auto";
	}, 0);
}, false);