# ZoteroEXTended

![screenshot](http://i.imgur.com/qooTFVi.png)

## Installation

### Simply install [ZoteroEXT.xpi](https://github.com/CSCC01-Fall2015/team02-course-project/releases/download/0.01a/ZoteroEXT.xpi) addon file to Zotero standalone or firefox.

#### You may also choose to build it yourself:

##### *Manually:*

1. Clone repo<br/>
2. zip the 'chrome' folder, chrome.manifest, and 'install.rdf'<br/>
3. change the .zip extension to '.xpi'<br/>

##### *Or using our script:*

Windows: (from a command prompt)<br/>
`generate_xpi.bat`
<br/>
Linux/Mac: <br/>
`sh generate_xpi.sh`

### Features
##### Intro video (Please Click to watch!):
[![ZoteroEXT Intro](https://j.gifs.com/yDLRdV.gif)](https://www.youtube.com/watch?v=HpYCk87p-H8)
<br/>
- Batch add, remove, rename, or merge multiple tags in one go!
- Download, edit, and install user made CSL styles with ease using our built in powerful csl-editor!
- More coming soon!

### Usage

TODO: Write usage instructions

### Changelog
```
November 24, 2015
  + Numerous bug fixes with batch editing feature
  + added cfg file to easily change csl server
November 21, 2015
  + Edit tags feature implemented
  + Custom output styles feature implemented
  + Submenu added to group ZoteroEXT features
November 11, 2015 
  + Delete feature now fully functional
  + Merge feature now fully functional
November 8, 2015 
  + Updated UI for delete/edit/merge tags
  + Tags now show in a checkbox list
  + Adding tags is now functional for selected items & tag specific items.
November 7, 2015 
  + Updated UI for adding tags 
  + Added callback in ZoteroEXTended window 
October 25, 2015
  + Plugin name changed to 'ZoteroEXT' (short for 'ZoteroEXTended') 
  + Cleaned up code (Removed traces of Helloworld)
  + Updated GUI shell (added tabs, added listbox example)
October 23, 2015
  + Initial release 
  + Added basic hello world GUI shell in 'actions' menu
```
