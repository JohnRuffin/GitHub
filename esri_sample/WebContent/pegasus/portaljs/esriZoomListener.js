/**
 * @author 888608 - Module & Singleton design pattern ESRI Zoom listener for Map
 * @returns {ESRIZoomListener}
 */
define(["esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/domUtils", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/dom", "dojo/dom-construct"], function(GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, domUtils, on, connect, registry, declare, dom, domConstruct) {

    // This returned object becomes the defined value of this module
    var SingletonClass = declare(null, {
        /*
         * initialization of the esri zoom listener object
         */
        constructor: function(mapLevelConfiguration) {
        	this.currentMapLevel;
            this.allFacilities;
            // method to cache the layerIds for different layer types
            this.initialize();
            this.mapLevelConfiguration = mapLevelConfiguration;
        },

        getFacilityLabelLayer: function() {
            return esriMap.getMapLayer(window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS + "_facilityLabelLayer");
        },

        setFacilityLabelGraphics: function() {
            var allFacilities = this.getFacilityLabelLayer() != undefined ? this.getFacilityLabelLayer().graphics : undefined;
            var allFacilityMap;
            if (allFacilities != undefined) {
                allFacilityMap = [];
                var allNearByLocations;
                for (var i = 0; i < allFacilities.length; i++) {
                    if (allFacilities[i].visible) {
                        allFacilityMap.push(this.getLocCd(allFacilities[i].toolTip));
                        if (allFacilities[i].data.attributes["AllLocations"] != undefined) {
                            allNearByLocations = allFacilities[i].data.attributes["AllLocations"];
                            for (var j = 0; j < allNearByLocations.length; j++) {
                                allFacilityMap.push(allNearByLocations[j].locCd);
                            }
                        }
                    }
                }
            }
            this.allFacilities = allFacilityMap;
        },
        /*
         * method that is triggered on zoom event
         * 
         * @param zoomEvent - map zoom event object
         */
        mapZoomListener: function(zoomEvent, layerId) {
            this.setFacilityLabelGraphics();
            this.currentMapLevel = zoomEvent.level;
            // switch by level
            switch (zoomEvent.level) {
                // indicates that the planner is @ "0" zoom level
            case 0:
                // @ "0" zoom level, hide all details on the map except for
                // lanes / legs
                // this.showHidePlacemarks(false, false, false, zoomEvent.level,
                // undefined, layerId);
                this.showHidePlacemarks(true, !$('#shwNumberSymbolsId').is(":checked"), false, zoomEvent.level, esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"), layerId);
                break;
                // indicates that the planner is @ "1" zoom level
            case 1:
                // @ "1" zoom level, hide all details on the map except for
                // lanes / legs
                // this.showHidePlacemarks(false, false, false, zoomEvent.level,
                // undefined, layerId);
                this.showHidePlacemarks(true, true, true, zoomEvent.level, esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"), layerId);
                break;
                // indicates that the planner is @ "2" zoom level
            case 2:
                // @ "2" zoom level, hide all details on the map except for
                // lanes / legs
                // this.showHidePlacemarks(false, false, false, zoomEvent.level,
                // undefined, layerId);
                this.showHidePlacemarks(true, true, true, zoomEvent.level, esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"), layerId);
                break;
                // indicates that the planner is @ "3" zoom level
            case 3:
                // @ "3" zoom level, hide all details on the map except for
                // lanes / legs and location placemarks
                // this.showHidePlacemarks(true, false, false, zoomEvent.level,
                // esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"),
                // layerId);
                // break;
                // indicates that the planner is @ "4" zoom level
            case 4:
                // @ "4" zoom level, hide all details on the map except for
                // lanes / legs, location placemarks & picture marker symbols
                // this.showHidePlacemarks(true, true, true, zoomEvent.level,
                // esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"),
                // layerId);
                this.showHidePlacemarks(true, true, true, zoomEvent.level, esriMap.getZoomLevelStyles(layerId, "NormalZoomLevel"), layerId);
                break;
                // indicates that the planner is @ "5" zoom level
            case 5:
                // @ "5" zoom level, hide all details on the map except for
                // lanes / legs, location placemarks & picture marker symbols
                // this.showHidePlacemarks(true, true, true, zoomEvent.level,
                // esriMap.getZoomLevelStyles(layerId, "HigherZoomLevel"),
                // layerId);
                // break;
                // indicates that the planner is @ "6" or "7" zoom level
            case 6:
            case 7:
                // @ "6" & "7" zoom level, show all details on the map...
                // this.showHidePlacemarks(true, true, true, zoomEvent.level,
                // esriMap.getZoomLevelStyles(layerId, "NormalZoomLevel"),
                // layerId);
                // break;
                // indicates that the planner is @ "8" and above zoom level
            default:
                // @ "6" & "7" zoom level, show all details on the map...
                this.showHidePlacemarks(true, true, true, zoomEvent.level, esriMap.getZoomLevelStyles(layerId, "LowZoomLevel"), layerId);
            }
        },
        /**
         * 
         * @param userAddedLocsIds
         *//*
        setUsrAddedLocs: function(userAddedLocsIds) {
        	this.userAddedLocsArr = userAddedLocsIds;
        },
        *//**
         * 
         * @returns {Array}
         *//*
        getUsrAddedLocs: function() {
        	return this.userAddedLocsArr;
        },*/
        /**
         * 
         * @returns {Array}
         */
        getUserSelectedFacTypes: function(isScheduleMaintenance) {
            var userSelectedFacTypes = [];
            var isUserAddedLocation = false;

            if(isScheduleMaintenance) {
                isUserAddedLocation  = $("#userAddedLocations").is(":checked");
            }

            if($("#hubsChk").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("HU");
            }
            if($("#airportTrunk").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("Trunk");
            }
            if($("#rampsChk").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("RP");
            }
            if($("#dockChk").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("DL");
            }
            if($("#meetPoints").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("MP");
            }
            if($("#airportFeeder").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("Feeder");
            }
            if($("#airportLineHaul").is(":checked") || isUserAddedLocation){
                userSelectedFacTypes.push("Line Haul");
            }
            /*if($("#stations").is(":checked")){
             userSelectedFacTypes.push("HU");
             }*/
            return userSelectedFacTypes;
        },
        /**
         * delete all the cache and free the memory
         */
        clearAll: function(layerIds) {
            if (layerIds == undefined) {
                delete this.locationsLayerIds;
                delete this.numberLayerIds;
                delete this.pictureSymbolLayerIds;
                delete this.directionLayerIds;
                delete this.countLayerIds;
                delete this.labelLayerIds;
                this.initialize();
            } else {
                for (var i = 0; i < layerIds.length; i++) {
                    this.clear(layerIds[i]);
                }
            }
        },

        /**
         * delete all the cache by layer id and free the memory
         */
        clear: function(layerId) {
            delete this.locationsLayerIds[layerId];
            delete this.numberLayerIds[layerId];
            delete this.pictureSymbolLayerIds[layerId];
            delete this.directionLayerIds[layerId];
            delete this.countLayerIds[layerId];
            delete this.labelLayerIds[layerId];

            // re-initialize the cache w.r.t layer id
            this.initialize(layerId);
        },

        /**
         * initialize the cache by layer id
         * 
         */
        initialize: function(layerId) {
            if (layerId == undefined) {
                // caches all the layer id's having layer type as "location"
                this.locationsLayerIds = {};
                // caches all the layer id's having layer type as "numberSymbol"
                this.numberLayerIds = {};
                // caches all the layer id's having layer type as
                // "pictureSymbol"
                this.pictureSymbolLayerIds = {};
                // caches all the layer id's having layer type as "direction"
                this.directionLayerIds = {};
                // caches all the layer id's having layer type as "countLayer"
                this.countLayerIds = {};
                // caches all the layer id's having layer type as "label"
                this.labelLayerIds = {};
            } else {
                // caches all the layer id's having layer type as "location"
                this.locationsLayerIds[layerId] = [];
                // caches all the layer id's having layer type as "numberSymbol"
                this.numberLayerIds[layerId] = [];
                // caches all the layer id's having layer type as
                // "pictureSymbol"
                this.pictureSymbolLayerIds[layerId] = [];
                // caches all the layer id's having layer type as "direction"
                this.directionLayerIds[layerId] = [];
                // caches all the layer id's having layer type as "countLayer"
                this.countLayerIds[layerId] = [];
                // caches all the layer id's having layer type as "label"
                this.labelLayerIds[layerId] = [];
            }
            if(this.userAddedLocsArr == undefined ){
            	// caches all the userAddedLocsArr having locCd
                this.userAddedLocsArr = [];
            }
        },

        /**
         * method to iterate all the map layers and cache all those layers
         * having layer type as "location", "pictureSymbol", "label",
         * "countLayer", "direction", "numberSymbol" into respective cache
         * objects by layer id
         */
        constructLayerDetails: function(layerId) {
            this.setFacilityLabelGraphics();
            // before start caching ...clear all the layer details by layer id
            this.clear(layerId);
            // get all the map layers
            var mapLayerIds = esriMap.getAllMapLayers(layerId);
            var mapLayer;
            if (mapLayerIds != undefined) {
                // iterate all the layers
                for (var i = 1; i < mapLayerIds.length; i++) {
                    if (mapLayerIds[i]) {
                        mapLayer = esriMap.getMapLayer(mapLayerIds[i].replace(" ", "_"));
                        if (mapLayer != undefined) {
                            // check for layer type
                            switch (mapLayer.type) {
                            case "location":
                                // if the object is not initialized then
                                // initialize it
                                if (this.locationsLayerIds[layerId] == undefined) {
                                    this.locationsLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.locationsLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            case "pictureSymbol":
                                // if the object is not initialized then initialize
                                // it
                                if (this.pictureSymbolLayerIds[layerId] == undefined) {
                                    this.pictureSymbolLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.pictureSymbolLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            case 'labelLayer':
                            case "label":
                                // if the object is not initialized then initialize
                                // it
                                if (this.labelLayerIds[layerId] == undefined) {
                                    this.labelLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.labelLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            case "countLayer":
                                // if the object is not initialized then initialize
                                // it
                                if (this.countLayerIds[layerId] == undefined) {
                                    this.countLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.countLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            case "direction":
                                // if the object is not initialized then initialize
                                // it
                                if (this.directionLayerIds[layerId] == undefined) {
                                    this.directionLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.directionLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            case "numberSymbol":
                                // if the object is not initialized then initialize
                                // it
                                if (this.numberLayerIds[layerId] == undefined) {
                                    this.numberLayerIds[layerId] = [];
                                }
                                // cache the layer id
                                this.numberLayerIds[layerId].push(mapLayerIds[i]);
                                break;
                            }
                        }
                    }
                }
            }
            // free the memory for the temp object...
            delete mapLayerIds;
        },

        /**
         * method to show/hide the level of details
         * 
         * @param showLocations -
         *            parameter to show/hide the location marks on map
         * @param showLaneSymbols -
         *            parameter to show/hide the lane/ legs symbols on map
         * @param showSymbols -
         *            parameter to show/hide the excess/arrow/any other picture
         *            marker symbols on map
         * @param zoomLevel -
         *            parameter to that consider the zoom level
         * @param zoomLevelStyles -
         *            zoom styles associated with that zoom level
         */
        showHidePlacemarks: function(showLocations, showLaneSymbols, showSymbols, zoomLevel, zoomLevelStyles, layerId) {
            if (zoomLevelStyles != undefined) {
                // trigger method that shows/hides the location marks on map
                this.showHideLocation(showLocations, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
                // trigger method that updates the specifications of location
                // label graphics on map
                this.modifyLocationLabelProperties(showLocations, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
                // trigger method that shows/hides the lane/leg numbers and
                // symbols marks on map
                this.showHideLaneSymbols(showLaneSymbols, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
                // trigger method that shows/hides the picture marker symbols on
                // map
                this.showHideExcessSymbols(showSymbols, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
                // trigger method that shows/hides the picture marker symbols on
                // map
                this.showHideArrowSymbols(showSymbols, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
             // trigger method that shows/hides the user added locations 
                // map
                this.showHideUserAddedLocation(showSymbols, zoomLevel, zoomLevelStyles.icon.customProperties, layerId);
            } else {
                // trigger method that shows/hides the location marks on map
                this.showHideLocation(showLocations, zoomLevel, undefined, layerId);
                // trigger method that updates the specifications of location
                // label graphics on map
                this.modifyLocationLabelProperties(showLocations, zoomLevel, undefined, layerId);
                // trigger method that shows/hides the lane/leg numbers and
                // symbols marks on map
                this.showHideLaneSymbols(showLaneSymbols, zoomLevel, undefined, layerId);
                // trigger method that shows/hides the picture marker symbols on
                // map
                this.showHideExcessSymbols(showSymbols, zoomLevel, undefined, layerId);
                // trigger method that shows/hides the picture marker symbols on
                // map
                this.showHideArrowSymbols(showSymbols, zoomLevel, undefined, layerId);
            }
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        showHideLocation: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
            var layerIds = this.locationsLayerIds[layerId];
            // helper method which actually process the styles on graphics
            this.forEach(layerIds, isVisible, zoomLevel, zoomLevelStyles, "location", layerId);
            // free memory
            delete layerIds;
        },

        /**
         * method that is used to modify the location label properties
         */
        modifyLocationLabelProperties: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
            if (zoomLevelStyles == undefined) {
                return;
            }
            // get the layer ids
            var layerIds = this.labelLayerIds[layerId];
            var layer;
            if (layerIds != undefined) {
                // iterate all layers
                for (var i = 0; i < layerIds.length; i++) {
                    // get the layer
                    layer = esriMap.getMapLayer(layerIds[i]);
                    if (layer != undefined) {
                        // get the graphics
                        var graphics = layer.graphics;
                        if (graphics != undefined) {
                            // iterate the graphics
                            for (var i = 0; i < graphics.length; i++) {
                                // method that actually process/updates the
                                // graphic
                                var zoomLevelSelection = $("#zoomLevelId").data("kendoComboBox").value();
                                if (parseInt(zoomLevelSelection) <= parseInt(zoomLevelSelection) - 1) {
                                    graphics[i].hide();
                                } else {
                                    this.updateGraphicProperties(graphics[i], zoomLevel, "labelLayer", zoomLevelStyles, layerId);
                                }

                            }
                        }
                    }
                }
            }

            // free memory
            delete layerIds;
            delete layer;
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        showHideLaneSymbols: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
            // handler for lane/leg symbols
            var layerIds = this.numberLayerIds[layerId];
            // helper method which actually process the styles on graphics
            this.forEach(layerIds, isVisible, zoomLevel, zoomLevelStyles, "laneSymbol", layerId);

            // handler for labels/count of lanes/legs
            layerIds = this.countLayerIds[layerId];
            // helper method which actually process the styles on graphics
            this.forEach(layerIds, isVisible, zoomLevel, zoomLevelStyles, "laneLabel", layerId);

            // free memory
            delete layerIds;
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        showHideExcessSymbols: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
            var layerIds = this.pictureSymbolLayerIds[layerId];
            // helper method which actually process the styles on graphics
            this.forEach(layerIds, isVisible, zoomLevel, zoomLevelStyles, "excessSymbol", layerId);
            // free memory
            delete layerIds;
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        showHideArrowSymbols: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
            var layerIds = this.directionLayerIds[layerId];
            // helper method which actually process the styles on graphics
            this.forEach(layerIds, isVisible, zoomLevel, zoomLevelStyles, "arrowSymbol", layerId);
            delete layerIds;
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        forEach: function(layerIds, isVisible, zoomLevel, zoomLevelStyles, graphicType, layerId) {
            var layer;
            if (layerIds != undefined) {
                for (var i = 0; i < layerIds.length; i++) {
                    layer = esriMap.getMapLayer(layerIds[i]);
                    if (layer != undefined) {
                        // helper method which actually process the styles on
                        // graphics
                        this.showHideGraphics(layer.graphics, isVisible, zoomLevel, graphicType, zoomLevelStyles, layerId);
                    }
                }
            }
            delete layer;
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param graphics -
         *            collection of graphics in a map layer
         * @param isVisible -
         *            show/hide the graphic
         * @param zoomLevel -
         *            map zoom level
         * @param graphicType -
         *            indicates whether its a location/excess symbol/arrows or
         *            lane/leg symbol etc.,
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        showHideGraphics: function showHideGraphics(graphics, isVisible, zoomLevel, graphicType, zoomLevelStyles, layerId) {
            if (graphics != undefined) {
                // iterate all the graphics
                for (var i = 0; i < graphics.length; i++) {
                    // show or hide the graphic
                    if (isVisible) {
                        graphics[i].show();
                        // process additional properties of the graphic..
                        this.updateGraphicProperties(graphics[i], zoomLevel, graphicType, zoomLevelStyles, layerId);
                    } else {
                        graphics[i].hide();
                    }
                }
            }
        },

        /**
         * helper method to show/hide the graphics
         * 
         * @param graphic -
         *            {Graphic} object on a map *
         * @param zoomLevel -
         *            map zoom level
         * @param graphicType -
         *            indicates whether its a location/excess symbol/arrows or
         *            lane/leg symbol etc.,
         * @param zoomLevelStyles -
         *            zoom style associated with zoom level
         */
        updateGraphicProperties: function(graphic, zoomLevel, graphicType, zoomLevelStyles, layerId) {
            var graphicSymbol;
            var count;
            var locCd;

            if (graphicType == "location") {
                // get the graphic symbol
                graphicSymbol = graphic.symbol;
                // check whether this location is of type "HUB" or not?
                if (graphic.data.styleId != undefined && graphic.data.styleId.indexOf("_H") < 0) {
                    // if so, then update the specific style for hub
                    graphicSymbol.setSize(zoomLevelStyles.symbolWidth);
                } else {
                    graphicSymbol.setSize(zoomLevelStyles.hubWidth);
                }
                if (layerId == window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS) {
                    if ($("#isDefaultConfig").is(":checked")) {
                        this.manageLocations(graphic, zoomLevel, zoomLevelStyles);
                    } else if ($("#userAddedLocations").is(":checked")) {
                        this.manageUserAddedLocations(graphic);
                    }
                }
            } else if (graphicType == "excessSymbol") {
                // update the width and height of the excess symbol on map...
                graphicSymbol = graphic.symbol;
                graphicSymbol.setWidth(zoomLevelStyles.xsSymbolWidth);
                graphicSymbol.setHeight(zoomLevelStyles.xsSymbolHeight);
            } else if (graphicType == "arrowSymbol") {
                // update the width and height of the arrow symbol on map...
                graphicSymbol = graphic.symbol;
                graphicSymbol.setWidth(zoomLevelStyles.arrowWidth);
                graphicSymbol.setHeight(zoomLevelStyles.arrowHeight);
            } else if (graphicType == "laneSymbol") {
                // update the size of the symbol on map by considering the
                // number of lanes / legs ...
                graphicSymbol = graphic.symbol;
                // get the number of lanes / legs
                count = this.getTotalLegsOrLanes(graphic);
                if (count <= 1) {
                    graphicSymbol.setSize(zoomLevelStyles.countSymbolSize);
                } else if (count > 1 && count <= 9) {
                    graphicSymbol.setSize(zoomLevelStyles.countSymbolSize_1);
                } else if (count >= 10 && count <= 99) {
                    graphicSymbol.setSize(zoomLevelStyles.countSymbolSize_2);
                } else if (count >= 100) {
                    graphicSymbol.setSize(zoomLevelStyles.countSymbolSize_3);
                }
            } else if (graphicType == "laneLabel") {
                // update font properties of labels
                graphicSymbol = graphic.symbol.font;
                graphicSymbol.setSize(zoomLevelStyles.laneLegFontSize);
                graphic.symbol.setOffset(zoomLevelStyles.laneLegFontXoffset, zoomLevelStyles.laneLegFontYoffset);
            } else if (graphicType == "labelLayer") {

                // update the font properties of lane/leg count labels
                graphicSymbol = graphic.symbol.font;
                graphicSymbol.setSize(zoomLevelStyles.locationFontSize);
                graphic.symbol.setOffset(zoomLevelStyles.locationFontXoffset, zoomLevelStyles.locationFontYoffset);
                locCd = this.getLocCd(graphic.toolTip);
                if (this.allFacilities != undefined && locCd != undefined) {
                    if (layerId == [window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS]) {
                    	if($("#isDefaultConfig").is(":checked")){
                    		this.manageLocations(graphic, zoomLevel);
                    	}else if ($("#userAddedLocations").is(":checked")) {
                            this.manageUserAddedLocations(graphic);
                        }else {
                    		graphic.show();
                    	}                        
                        
                    } else {
                        if (this.allFacilities.indexOf(locCd) >= 0) {
                            graphic.hide();
                        } else {
                            graphic.show();
                        }
                    }
                }
            }

            delete count;
            delete graphicSymbol;
        },
        /**
         * 
         * @param isVisible
         * @param zoomLevel
         * @param zoomLevelStyles
         * @param layerId
         */
        showHideUserAddedLocation: function(isVisible, zoomLevel, zoomLevelStyles, layerId) {
        	var usrAddedLocs = this.userAddedLocsArr;
        	if ($("#isManual").is(":checked") && $("#userAddedLocations").is(":checked")) {
        		for( var i=0;i< usrAddedLocs.length; i++){
            		parent.VIEWER.setVisibleAndHighlight(true, usrAddedLocs[i]);
    			}
            }
        	delete usrAddedLocs;
        },
        /**
         * 
         * @param placemark
         */
        manageUserAddedLocations: function(placemark) {
        	var usrAddedLocs = this.userAddedLocsArr;
        	var facTypes = this.getUserSelectedFacTypes();
			var layerType  ="Default";
			if((facTypes.length==0 && usrAddedLocs.length > 0)){
				layerType  ="labelLayer";
			}
			switch(layerType){
			case  "labelLayer":
				for(var  i =0;i<usrAddedLocs.length; i++){
					if (this.isValidUserAddedLocation(usrAddedLocs[i], placemark)) {
							placemark.show();						
						} else {
							placemark.hide();
						}				
				}
			break;
			default:
				for( var j=0;j< facTypes.length; j++){
					if (this.isFacilityType(facTypes[j], placemark)) {
						placemark.show();
						break;
					} else {
						placemark.hide();
					}
				}		
        	//console.log(placemark.data.name);
        	/*for( var i=0;i< usrAddedLocs.length; i++){
        		parent.VIEWER.setVisibleAndHighlight(false, usrAddedLocs[i]);
        		if (usrAddedLocs[i] == placemark.data.name ) {
		            placemark.show();
		            break;
		        } else {
		        	if(facTypes.length==0)
		        		placemark.hide();
		        }
			}*/
        	if(facTypes.length==0 || (facTypes.length==0 && usrAddedLocs.length == 0) || $("#isNoneLocations").is(":checked"))
    		    placemark.hide();
        	delete usrAddedLocs;
        	delete facTypes;
			}
        },
        
        getMapLevelFacilityTypes: function() {
        	if(this.currentMapLevel != undefined){
        		var facTypes = this.mapLevelConfiguration["level" + this.currentMapLevel];
                if (facTypes != undefined) {
                    return facTypes.split(",");
                }
        	}
        },
        
        manageLocations: function(placemark, zoomLevel) {
            var facTypes = this.mapLevelConfiguration["level" + zoomLevel];
            if (facTypes != undefined) {
                facTypes = facTypes.split(",");
                switch ("level" + zoomLevel) {
                case "level0":
                case "level1":
                case "level2":
                case "level3":
                case "level4":
                case "level5":
                case "level6":
                case "level7":
                case "level8":
                case "level9":
                case "level10":
                case "level11":
                case "level12":
                case "level13":
                case "level14":
                case "level15":
                case "level16":
                case "level17":
                case "level18":
                    for (var i = 0; i < facTypes.length; i++) {
                        if (this.isFacilityType(facTypes[i], placemark)) {
                            placemark.show();
                            break;
                        } else {
                            placemark.hide();
                        }
                    }

                    break;
                default:
                    placemark.show();
                }
            } else {
                placemark.show();
            }

        },
        
        isValidUserAddedLocation: function(locCd, placemark) {
            if (placemark != undefined && locCd != undefined) {
                var allLocations;
                if (placemark.data != undefined && placemark.data.attributes != undefined && placemark.data.attributes.AllLocations != undefined) {
                    allLocations = placemark.data.attributes.AllLocations;
                    if (allLocations != undefined) {
                        for (var i = 0; i < allLocations.length; i++) {
                            return allLocations[i].locCd == locCd;
                        }
                    }
                }
            }
            return false;
        },
        
        validateHighlightedGraphicsNow: function(locations){
        	if(locations != undefined && contextManager != undefined){
        		var highlightedGraphics = contextManager.getHighlightedGraphics();
        		var highlightedGraphicsKeys = Object.keys(highlightedGraphics);
        		if(highlightedGraphicsKeys != undefined){
        			var key;
        			var highlightedGraphic;
        			for(var i=0; i< highlightedGraphicsKeys.length; i++){
        				key = highlightedGraphicsKeys[i];
        				if(locations.indexOf(key) <= -1){
        					highlightedGraphic = highlightedGraphics[key];
        					this.manageUserAddedLocations(highlightedGraphic);        					
        				}
        			}
        		}
        	}
        },
        
        getLocationNameByFacType: function(facilityType, placemark) {
            if (placemark != undefined && facilityType != undefined) {
                var allLocations;
                if (placemark.data != undefined && placemark.data.attributes != undefined && placemark.data.attributes.AllLocations != undefined) {
                    allLocations = placemark.data.attributes.AllLocations;
                    if (allLocations != undefined) {
                        for (var i = 0; i < allLocations.length; i++) {
                            if( allLocations[i].facType == facilityType){
                            	return allLocations[i].locCd;
                            }
                        }
                    }
                }
            }
        },
        
        /**
         * 
         * @param facilityType
         * @param placemark
         * @returns {Boolean}
         */
        isFacilityType: function(facilityType, placemark) {
            if (placemark != undefined && facilityType != undefined) {
                var allLocations;
                //get all locations represented by the by related airport on map
                if (placemark.data != undefined && placemark.data.attributes != undefined && placemark.data.attributes.AllLocations != undefined) {
                    allLocations = placemark.data.attributes.AllLocations;
                    if (allLocations != undefined) {
                        for (var i = 0; i < allLocations.length; i++) {
                            switch (facilityType) {
                            case "Line Haul":
                                if (allLocations[i].facilityUsedAttributes && allLocations[i].facilityUsedAttributes.usedAsCommercialLinehaulLoc == "Y") {
                                    return true;
                                }
                                break;
                            case "Feeder":
                                if (allLocations[i].facilityUsedAttributes && allLocations[i].facilityUsedAttributes.usedAsFeederLocation == "Y") {
                                    return true;
                                }
                                break;
                            case "Trunk":
                                if (allLocations[i].facilityUsedAttributes && allLocations[i].facilityUsedAttributes.usedAsTrunkLocation == "Y") {
                                    return true;
                                }
                                break;
                            default:
                                if (allLocations[i].facType == facilityType) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        },

        /**
         * returns number of lanes / legs associated for each graphic
         */
        getTotalLegsOrLanes: function(graphic) {
            var count = 0;
            if (graphic != undefined && graphic.data != undefined) {
                count = graphic.data.attributes["NoOfLegs"] != undefined ? graphic.data.attributes["NoOfLegs"] : graphic.data.attributes["NoOfLanes"];
            }

            return count;
        },

        getLocCd: function(toolTip) {
            if (toolTip != undefined) {
                return toolTip.substring(0, toolTip.indexOf("<br/>"));
            }

            return toolTip;
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