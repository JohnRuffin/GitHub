/**
 * This is the main class where all the graphics are staged and queried as & when the selections are made from UI
 * It also holds the updated changes that are made to the graphic
 * {ESRIStageGraphicManager}
 */
define(["esri/map", "esri/toolbars/edit", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/dijit/InfoWindowLite", "esri/dijit/Popup", "esri/domUtils", "esri/tasks/PrintTemplate", "esri/dijit/Print", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-construct", "dojo/_base/event"], function(Map, Edit, Tiled, GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, Extent, webMercatorUtils, InfoTemplate, InfoWindowLite, Popup, domUtils, PrintTemplate, Print, PrintTask, PrintParameters, Menu, MenuItem, MenuSeparator, on, connect, registry, declare, lang, dom, domConstruct, event) {

    var SingletonClass = declare(null, {

        constructor: function() {
            this.initialize();
        },

        /**
         * creates a staged graphic layer
         */
        initialize: function() {
            this.stageGraphicLayer = new GraphicsLayer();
            //adding the layer to esri map
            esriMap.addMapLayer(this.stageGraphicLayer);
            //stage graphic layer is hidden
            this.stageGraphicLayer.hide();
        },

        /**
         * Is the main listener that is triggered before another route is selected on the UI 
         * @param currentRouteId  -- current selected route id
         * @param selectedRouteId	-- route id that is going to be selected
         * @param newRouteId		-- is it a new route id which indicates that the route is a new route
         */
        beforeRouteSelectionChangeListener: function(currentRouteId, selectedRouteId, newRouteId) {
            if (currentRouteId != undefined) {
                if (selectedRouteId != undefined) {
                    LoggerUtils.console("currentRouteId [" + currentRouteId + "]");
                    LoggerUtils.console("selectedRouteId [" + selectedRouteId + "]");
                    //remove the graphic with current route id
                    this.removeGraphicByRouteId(currentRouteId);
                    //create a single graphic layer representing the current route id
                    var g = ESRIHelper.getEditToolManager().convertToSingleGraphic();
                    if (g != undefined) {
                    	//add the graphic
                        this.addGraphic(new Graphic(g.geometry, g.symbol), currentRouteId);
                    }
                }
            }
        },

        /**
         * Is the main listener that is triggered before another operation is triggered for UI 
         * @param currentRouteId	 -- current selected route id
         * @param newRouteId	-- is it a new route id which indicates that the route is a new route
         */
        beforeOpeartionChangeListener: function(currentRouteId, newRouteId) {
            if (currentRouteId != undefined) {
                LoggerUtils.console("currentRouteId [" + currentRouteId + "]");
              //remove the graphic with current route id
                this.removeGraphicByRouteId(currentRouteId);
              //create a single graphic layer representing the current route id
                var g = ESRIHelper.getEditToolManager().convertToSingleGraphic();
                if (g != undefined) {
                	//add the graphic
                    this.addGraphic(new Graphic(g.geometry, g.symbol), currentRouteId);
                }
            }
        },
        
        updateGraphicInCreateOrAddMode: function(currentRouteId, isClearLayers) {
        	var g = ESRIHelper.getEditToolManager().convertToSingleGraphic(isClearLayers);
            if (g != undefined) {
            	//add the graphic after removing once it found
            	this.removeGraphicByRouteId(currentRouteId);
                this.addGraphic(new Graphic(g.geometry, g.symbol), currentRouteId);
            }
        },
        

        /**
         * return the graphic from the staged graphic layer for the provided route id
         * @param routeId  - route id for which the graphic is required
         * @returns
         */
        getGraphic: function(routeId) {
            if (routeId != undefined) {
                var graphics = this.getGraphics();
                if (graphics != undefined) {
                    var graphic;
                    for (var i = 0; i < graphics.length; i++) {
                        if (routeId === this.getRouteId(graphics[i])) {
                            return graphics[i];
                        }
                    }
                }
            }
        },

        /**
         * returns the route id for a graphic object
         * @param graphic
         * @returns
         */
        getRouteId: function(graphic) {
            if (graphic != undefined) {
                if (graphic.attributes != undefined) {
                    return graphic.attributes["routeId"];
                }
            }
        },
        
        /**
         * returns all the graphics from the staged graphic layer
         * @returns {graphics}
         */
        getGraphics: function() {
            if (this.stageGraphicLayer != undefined) {
                return this.stageGraphicLayer.graphics;
            }
        },
        
        /**
         * refresh the staged graphic layer
         */
        refresh: function() {
            this.stageGraphicLayer.refresh();
        },

        /**
         * add the graphic to the staged graphic layer
         * @param graphic
         * @param routeId
         */
        addGraphic: function(graphic, routeId) {
            if (graphic != undefined) {
                if (graphic.attributes == undefined) {
                    graphic.attributes = [];
                }
                graphic.attributes["routeId"] = routeId;
                this.stageGraphicLayer.add(graphic);
                this.refresh();
            }
        },

        /**
         * remove from SGL (Staged Graphic Layer)
         * @param graphic
         */
        removeGraphic: function(graphic) {
            if (graphic != undefined) {
                this.stageGraphicLayer.remove(graphic);
                this.refresh();
            }
        },

        /**
         * removes the graphic
         * @param routeId
         */
        removeGraphicByRouteId: function(routeId) {
            if (routeId != undefined) {
                this.removeGraphic(this.getGraphic(routeId));
            }
        },
        
        /**
         * future listener for after route selection change 
         */
        afterRouteSelectionChangeListener: function() {

        },
        
        duplicateRouteHandler: function(fromRouteId, routeId){
        	var graphic2Duplicate;
        	if(fromRouteId != undefined){
        		graphic2Duplicate = this.getGraphic(fromRouteId);
        		if(graphic2Duplicate != undefined){
        			this.addGraphic(new Graphic(lang.clone(graphic2Duplicate.geometry), graphic2Duplicate.symbol), routeId);
        		}
        	}
        	
        }
    });

    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = new SingletonClass();
            }
            return _instance;
        }
    };
});