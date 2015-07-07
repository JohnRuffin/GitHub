/**
 * @author 888608 - Module & Singleton design pattern ESRI Graphic Manager for Map
 * @returns {ESRIGraphicManager}
 */
define(["pegasus/portaljs/controls/esriEditToolManager.js", "pegasus/portaljs/esriZoomListener.js", "pegasus/portaljs/controls/esriGraphicManager.js", "pegasus/portaljs/controls/esriStageGraphicManager.js", "pegasus/portaljs/controls/esriVirtualGraphicManager.js", "pegasus/portaljs/controls/routeManager.js", "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/domUtils", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/dom", "dojo/dom-construct"], function(EditToolManager, ESRIZoomManager, ESRIGraphicManager, StageGraphicManager, VirtualGraphicManager, RouteManager, GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, domUtils, on, connect, registry, declare, dom, domConstruct) {


    var SingletonClass = declare(null, {

        constructor: function(mapLevelConfiguration) {
        	
        },

        getMapLevelConfiguration: function() {
            return parent.mapLevelConfiguration;
        },

        getEsriMap: function() {
            return esriMap;
        },

        getRouteManager: function() {
            return RouteManager.getInstance();
        },

        getEsriGraphicManager: function() {
            return ESRIGraphicManager.getInstance();
        },

        getEsriZoomManager: function() {
            return ESRIZoomManager.getInstance(this.getMapLevelConfiguration());
        },
        
        getEditToolManager: function() {
            return EditToolManager.getInstance();
        },
        
        getStageManager: function() {
            return StageGraphicManager.getInstance();
        },
        
        getVirtualGraphicManager: function() {
            return VirtualGraphicManager.getInstance();
        }

    });


    var _instance;

    return {
        getInstance: function(mapLevelConfiguration) {
            if (_instance == undefined) {
                _instance = new SingletonClass(mapLevelConfiguration);
            }
            return _instance;
        }
    };
});


var ESRIHelper = (function() {
    function constructorFn(esriController) {
        this.esriController = esriController;
    };

    return constructorFn;
})();

ESRIHelper.getController = function() {
    return this.esriController.getInstance();
};

ESRIHelper.setController = function(esriController) {
    this.esriController = esriController;
};

ESRIHelper.getEsrimap = function(esriController) {
    return this.getController().getEsriMap();
};

ESRIHelper.getRouteManager = function() {
    return this.getController().getRouteManager();
};

ESRIHelper.getEsriGraphicManager = function() {
    return this.getController().getEsriGraphicManager();
};

ESRIHelper.getEsriZoomManager = function() {
    return this.getController().getEsriZoomManager();
};

ESRIHelper.getEditToolManager = function(){
	return this.getController().getEditToolManager();
};

ESRIHelper.getStageManager = function(){
	return this.getController().getStageManager();
};

ESRIHelper.getVirtualGraphicManager = function(){
	return this.getController().getVirtualGraphicManager();
};