/**
 * @author aditya.velala
 */
var map, editToolbar;

require([ "esri/map", "esri/toolbars/edit", "esri/graphic",
		"esri/geometry/Point", "esri/geometry/Polyline",
		"esri/geometry/Polygon", "esri/symbols/SimpleLineSymbol",
		"esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol",
		"dojo/_base/event", "dojo/parser", "dojo/dom", "dojo/dom-style",
		"dijit/registry", "dijit/Menu", "dijit/form/ToggleButton",
		"dijit/form/DropDownButton", "dijit/CheckedMenuItem",
		"dijit/layout/BorderContainer", "dijit/layout/ContentPane",
		"dojo/domReady!" ],

function(Map, Edit, Graphic, Point, Polyline, Polygon, SimpleLineSymbol,
		SimpleFillSymbol, TextSymbol, event, parser, dom, domStyle, registry,
		Menu) {
	parser.parse();
	
	map = new Map("map", {
		basemap : "gray",
		center : [ 3.955, 59.338 ],
		zoom : 3
	});
});