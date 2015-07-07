/**
 * Module design pattern
 * ESRI Map 
 * @param mapDiv - div id  for map initialization...
 * @param options	- custom map options..
 * @param statusDiv - loading status information...
 * @returns {ESRIMap}
 */
define(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer", "esri/toolbars/draw",  "esri/toolbars/edit", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/dijit/InfoWindowLite", "esri/dijit/Popup", "esri/domUtils", "esri/tasks/PrintTemplate", "esri/dijit/Print", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-construct"], function(Map, Tiled, GraphicsLayer, Draw, Edit, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, Extent, webMercatorUtils, InfoTemplate, InfoWindowLite, Popup, domUtils, PrintTemplate, Print, PrintTask, PrintParameters, Menu, MenuItem, MenuSeparator, on, connect, registry, declare, lang, dom, domConstruct) {

    // This returned object becomes the defined value of this module
    return declare(null, {
        constructor: function(mapDiv, options, statusDiv) {
            try {

            	this.resizeHandlerFn = options.resizeHandlerFn ;	
                this.childLayersMap = {};
                this.layerGlobalStylesMap = {};
                this.layerMouseOverFn;
                this.layerMouseOutFn;
                this.printCompleteFn;
                this.printErrorFn;
                this.stylesMap = {};

                this.mapDiv = mapDiv;
                if (!options.infoWindow) {
                    options.infoWindow = new Popup(null, domConstruct.create("div"));
                }
                //initialize the esri.map
                this.map = new Map(mapDiv, options);
                this.mapOptions = options;
                this.isAutoZoom = options.isAutoZoom;
                //drawtool for lasso
                this.drawTool;
                this.vertexSymbol =  new PictureMarkerSymbol('pegasus/assets/edit/pin1.png', 13, 20);
                this.ghostLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([75, 19, 136]), 1);
                //edittool
                editTool = new Edit(this.map, {
                	vertexSymbol: this.vertexSymbol,
                	ghostLineSymbol: this.ghostLineSymbol
                } );
                //flag which is used to indentify whether print is current running or not... ??
                this.isPrintting = false;
                
                if (statusDiv) {
                    //show loading icon on the bottom right corner
                    on(this.map, "update-start", function() {
                        domUtils.show(dom.byId(statusDiv));
                    });
                    on(this.map, "update-end", function() {
                        domUtils.hide(dom.byId(statusDiv));
                    });
                }
                var esriComponent = this;
                //map resize & reposition handler....
                on(this.map, 'resize', function(e) {
                	if(esriComponent.resizeHandlerFn != undefined){
                		esriComponent.resizeHandlerFn(e, esriComponent.map);
                	}                	                    
                });

            } catch (e) {
                alert("Error [" + e.message + "] occurred while initializing the map");
            }
        },
        /**
         * enable/ disable the auto zoom functionality
         * @param flag
         */
        enableAutoZoom: function(flag) {
            this.isAutoZoom = flag;
        },

        /**
         * load the ecosystem layer. 
         * 	-is the main method to render the graphics on the map. 
         * 		1) checks for point or polyline graphic that needs to be rendered
         * 		  a) if its a point graphic then creates the necessary child graphics layer(s) based on the picture
         * 			marker symbols or simple marker symbols or text symbols and add the respective graphics to the respective graphic layers 
         * 		  b) 	  			 
         * @param layerData
         * @returns {Boolean}
         */
        addEcosystemLayer: function(layerData) {
            try {
                //get the global styles map..
                var globalStylesMap = this.getGlobalStylesMap(layerData.globalStyles);
                //get the global icon symbols map
                var globalIconSymbolsMap = this.getGlobalIconSymbolsMap(layerData.globalStyles);
                //get the line symbols map..
                var globalLineSymbolsMap = this.getGlobalLineSymbolsMap(layerData.globalStyles);
                //get the picture symbols map...
                var globalPictureSymbolsMap = this.getGlobalPictureSymbolsMap(layerData.globalStyles);
                //cache the global styles for this layer id
                this.layerGlobalStylesMap[layerData.id] = globalStylesMap;

                var geometry;
                var iconSymbol;
                var lineSymbol;
                var pictureSymbol;
                var txtSymbol;
                var graphic;
                var style;
                //var centerPoint;
                var bbox;
                if (layerData.properties) {
                    bbox = layerData.properties.bbox;
                }
                this.stylesMap[layerData.id] = {};
                var models = layerData.models;

                if (models && models.length > 0) {
                    //create a new graphic layer
                    var graphicsLayer = new GraphicsLayer();
                    //assign the layer id as id for graphics layer
                    graphicsLayer.id = layerData.id;

                    var modelType;
                    var iconLayersMap = {};
                    var textLayersMap = {};
                    var pictureLayersMap = {};

                    var labelCustomProperties;
                    var iconCustomProperties;
                    var attributes;

                    var childLayerId;
                    var childLayer;
                    //iterate all models.
                    for (var i = 0; i < models.length; i++) {
                        attributes = models[i].attributes;
                        //check for style id in a model...and if present then 
                        //get the icon symbol, picture symbol, line symbol and style for the model style...
                        if (models[i].styleId && models[i].styleId != '') {
                            iconSymbol = globalIconSymbolsMap[models[i].styleId];
                            pictureSymbol = globalPictureSymbolsMap[models[i].styleId];
                            lineSymbol = globalLineSymbolsMap[models[i].styleId];
                            style = globalStylesMap[models[i].styleId];
                        } else {
                            //if there is no style for the model then 
                            //get the icon symbol from style
                            iconSymbol = this.getIconSymbol(models[i].style);
                            //get the picture marker symbol
                            pictureSymbol = this.getPictureMarkerSymbol(models[i].style.icon);
                            //get the simple line symbol...
                            lineSymbol = this.getLineSymbol(models[i].style);
                            style = models[i].style;
                        }
                        //type of model (polyline or placemark)
                        modelType = models[i].type;

                        switch (modelType) {
                        case 1:
                            //placemark
                            //get the geometry of type esri.geometry.Point
                            geometry = this.getGeometry(models[i]);
                            //add icon symbols	
                            if (style.icon) {
                                //get the icon properties that are configured from STAD
                                iconCustomProperties = style.icon.customProperties;
                                //if there is a picture marker symbol associated with this model...  
                                if (pictureSymbol) {
                                    //then create a new picture graphic layer and add all the picture marker symbols graphics to that layer
                                    if (iconCustomProperties) {
                                        childLayerId = iconCustomProperties.layerId;
                                        if (!childLayerId) {
                                            childLayerId = modelType;
                                        } else {
                                            childLayerId = layerData.id + "_" + childLayerId;
                                        }
                                        if (iconCustomProperties.addAsLayer && !pictureLayersMap[childLayerId] && ((pictureLayersMap[childLayerId] == undefined) || pictureLayersMap[childLayerId].type != iconCustomProperties.layerType)) {
                                            pictureLayersMap[childLayerId] = this.createChildLayer(layerData.id, iconCustomProperties);
                                        }
                                    } else {
                                        childLayerId = modelType;
                                    }
                                    //creating the graphic...
                                    graphic = new Graphic(geometry, pictureSymbol);

                                    //add to show or not show tooltip
                                    //graphic.toolTip = models[i].name;				
                                    if (pictureLayersMap[childLayerId]) {
                                        //pictureLayersMap[childLayerId].add(graphic);
                                        //adding a graphic to the graphics layer
                                        this.addLayerGraphic(pictureLayersMap[childLayerId], graphic, models[i]);
                                    } else {
                                        //graphicsLayer.add(graphic);
                                        //if there is no picture graphic layer then add it to the default parent graphic layer
                                        this.addLayerGraphic(graphicsLayer, graphic, models[i]);
                                    }
                                } else if (iconSymbol) {
                                    //if there is a simple marker symbol(s) associated with this model... 
                                    //then create a new simple marker graphic layer and add all the simple marker symbols graphics to that layer
                                    this.stylesMap[layerData.id][models[i].name] = models[i].styleId;
                                    if (iconCustomProperties) {
                                        childLayerId = iconCustomProperties.layerId;
                                        //defining the child layer id
                                        if (!childLayerId) {
                                            childLayerId = modelType;
                                        } else {
                                            childLayerId = layerData.id + "_" + childLayerId;
                                        }

                                        if (iconCustomProperties.addAsLayer && !iconLayersMap[childLayerId]) {
                                            //create the layer and cache the layer
                                            iconLayersMap[childLayerId] = this.createChildLayer(layerData.id, iconCustomProperties);
                                        }
                                    } else {
                                        childLayerId = modelType;
                                    }
                                    //creating the graphic
                                    graphic = new Graphic(geometry, iconSymbol);
                                    //add to show or not show tooltip
                                    //graphic.toolTip = models[i].name;	
                                    //adding the graphic to the layer
                                    if (iconLayersMap[childLayerId]) {
                                        //iconLayersMap[childLayerId].add(graphic);
                                        this.addLayerGraphic(iconLayersMap[childLayerId], graphic, models[i]);
                                    } else {
                                        //graphicsLayer.add(graphic);
                                        this.addLayerGraphic(graphicsLayer, graphic, models[i]);
                                    }
                                }
                            }

                            //add text symbol
                            if (style.label) {
                                //get the text symbol that are used to add text on grpahics layer
                                txtSymbol = this.getTextSymbol(style.label);
                                if (txtSymbol) {
                                    labelCustomProperties = style.label.customProperties;
                                    if (labelCustomProperties) {
                                        //defining the child layer id
                                        childLayerId = labelCustomProperties.layerId;
                                        if (!childLayerId) {
                                            childLayerId = modelType;
                                        } else {
                                            childLayerId = layerData.id + "_" + childLayerId;
                                        }

                                        if (labelCustomProperties.addAsLayer && !textLayersMap[childLayerId]) {
                                            //create a new graphics layer and add all the text graphics to that layer
                                            textLayersMap[childLayerId] = this.createChildLayer(layerData.id, labelCustomProperties);
                                        }
                                        if (labelCustomProperties.textAttribute) {
                                            //adding the text to the text symbol...
                                            txtSymbol.text = this.getAttributeValue(attributes, labelCustomProperties.textAttribute) + "";
                                        }
                                    } else {
                                        childLayerId = modelType;
                                    }
                                    if (!txtSymbol.text) {
                                        //if the text is undefined then defining the text symbol with model name..
                                        txtSymbol.text = models[i].name;
                                    }
                                    if (labelCustomProperties && labelCustomProperties.isVisible != undefined && !labelCustomProperties.isVisible) {
                                    	txtSymbol.text = "";
                                    }

                                    graphic = new Graphic(geometry, txtSymbol);
                                    //adding the text symbol graphics to the text symbol graphic layer...
                                    if (textLayersMap[childLayerId]) {
                                        //textLayersMap[childLayerId].add(graphic);
                                        this.addLayerGraphic(textLayersMap[childLayerId], graphic, models[i]);
                                    } else {
                                        //graphicsLayer.add(graphic);
                                        this.addLayerGraphic(graphicsLayer, graphic, models[i]);
                                    }
                                }
                            }
                            break;
                        case 2:
                            //linestring
                            geometry =  this.getGeometry(models[i]);
                            //get the esri.geometry.Polyline geometry
                            graphic = new Graphic(geometry, lang.clone(lineSymbol));

                            //create a new graphic layer for polylines and the graphic to that graphics layer
                            this.addLayerGraphic(graphicsLayer, graphic, models[i]);
                            
                            break;
                        default:
                            break;
                        }
                    }

                    this.addMapLayer(graphicsLayer);
                    this.addMapSymbolLayers(pictureLayersMap);
                    this.addMapSymbolLayers(iconLayersMap);
                    this.addMapSymbolLayers(textLayersMap);

                    if (this.isAutoZoom && bbox) {
                        this.setMapExtentByBBOX(bbox);
                    }

                }

            } catch (e) {
                alert("Error [" + e.message + "], while loading the layer ");
                return false;
            }
            return true;
        },

        getLayerObjectStyleByObjectName: function(layerId, name) {
            return this.layerGlobalStylesMap[layerId][this.stylesMap[layerId][name]];
        },

        getLayerObjectStyleByStyleId: function(layerId, styleId) {
            return this.layerGlobalStylesMap[layerId][styleId];
        },

        getLayerGlobalStylesMap: function(layerId) {
            return this.layerGlobalStylesMap[layerId];
        },

        //internal 
        addMapSymbolLayers: function(symbolLayersMap) {
            if (symbolLayersMap) {
                var symbolTypes = Object.keys(symbolLayersMap);
                if (symbolTypes) {
                    for (var i = 0; i < symbolTypes.length; i++) {
                        this.addMapLayer(symbolLayersMap[symbolTypes[i]]);
                    }
                }
            }
        },

        /**
         * creates a layer and connect mouse events to that layer.
         * @param parentLayerId		
         * @param layerProperties	
         * @returns {___childLayer1}
         */
        createChildLayer: function(parentLayerId, layerProperties) {
            //creating a new graphics layer
            var childLayer = new GraphicsLayer();
            var childLayerId;
            //defining the graphics layer id...
            if (layerProperties.layerId) {
                childLayerId = parentLayerId + "_" + layerProperties.layerId;
            } else {
                childLayerId = "temp_" + Math.random();
            }
            childLayer.id = childLayerId;
            //defining the layer type
            if (layerProperties.layerType != undefined) {
                childLayer.type = layerProperties.layerType;
            }
            //flag indicating whether this layer is to go in print service or not
            if (layerProperties.isPrintable != undefined) {
                childLayer.isPrintable = layerProperties.isPrintable;
            }

            if (!this.childLayersMap[parentLayerId]) {
                this.childLayersMap[parentLayerId] = [];
            }
            this.childLayersMap[parentLayerId].push(childLayerId);
            //todo
            try {
                if (layerProperties.layerMaxScale) {
                    childLayer.maxScale = this.mapOptions.lods[parseInt(layerProperties.layerMaxScale)].scale;
                }
                if (layerProperties.layerMinScale) {
                    childLayer.minScale = this.mapOptions.lods[parseInt(layerProperties.layerMinScale)].scale;
                }
            } catch (e) {}

            //attaching the mouse events to the graphics layer
            var mouseEventsStr = layerProperties.mouseEvents;
            if (mouseEventsStr) {
                var mouseEvents = mouseEventsStr.split(",");
                for (var i = 0; i < mouseEvents.length; i++) {
                    on(childLayer, mouseEvents[i], window[layerProperties[mouseEvents[i]]]);
                }
            }

            return childLayer;
        },

        /**
         * adding a layer onto esri.map.
         * attaching event(s) to that layer
         * 	a) onMouseOver
         * 	b) onMouseOut 
         * @param layer
         */
        addMapLayer: function(layer) {
            if (layer) {
                this.map.addLayer(layer);
                on(layer, "mouse-over", this.layerMouseOverFn);
                on(layer, "mouse-out", this.layerMouseOutFn);
            }
        },

        /**
         * logic to reorder the map layers.
         * @param layerId - ID assigned to the layer.
         * @param index	- ordering index...
         */
        reorderLayer: function(layerId, index) {
            var layer = this.map.getLayer(layerId);
            if (layer) {
                this.map.reorderLayer(layer, index);
            }
        },

        /**
         * logic to reorder the map layers.
         * @param layerId - ID assigned to the layer.
         * @param index	- ordering index...
         */
        reorderAllLayers: function(layerId, index) {
            var allLayerIds = this.getAllMapLayers(layerId);
            if (allLayerIds != undefined) {
                for (var i = 0; i < allLayerIds.length; i++) {
                    if (allLayerIds[i] != undefined && !(allLayerIds[i] instanceof Object)) {
                        this.reorderLayer(allLayerIds[i], index);
                    }
                }
            }
        },

        /**
         * returns all the esri.layers.Layer(s) that are added to esri.map  
         * @param layerId	ID assigned to the layer.
         * @returns {Array}	array of  esri.layers.Layer
         */
        getAllMapLayers: function(layerId) {
            var mapLayers = [];
            var mapLayer = this.map.getLayer(layerId);
            if (mapLayer) {
                mapLayers.push(mapLayer);
                mapLayers = mapLayers.concat(this.getChildMapLayers(layerId));
            }

            return mapLayers;
        },

        /**
         * returns all the esri.layers.Layer(s) for that parent layer id
         * @param layerId ID assigned to the parent layer.
         * @returns
         */
        getChildMapLayers: function(layerId) {
            var childMapLayers;
            if (layerId) {
                childMapLayers = this.childLayersMap[layerId];
            }
            return childMapLayers;
        },

        /**
         * removes all the esri.layers.Layer(s) for that parent layer id
         * @param layerId		ID assigned to the parent layer.
         */
        removeChildMapLayers: function(layerId) {
            if (layerId && this.childLayersMap[layerId]) {
                var childLayerIds = this.childLayersMap[layerId];
                for (var i = 0; i < childLayerIds.length; i++) {
                    this.removeMapLayer(childLayerIds[i]);
                }
                this.childLayersMap[layerId] = [];
            }
        },

        /**
         * remove the esri.layers.Layer from the map...
         * @param layerId		ID assigned to the layer.
         */
        removeMapLayer: function(layerId) {
            if (layerId) {
                this.removeChildMapLayers(layerId);
                var layer = this.map.getLayer(layerId);
                if (layer) {
                    //removing the layer...
                    this.map.removeLayer(layer);
                } else {
                    console.log("Layer with id = [" + layerId + "] not found");
                }
            }
        },

        /**
         * Removes all esri.layers.Layer(s) 
         */
        removeAllMapLayers: function() {
            this.map.removeAllLayers();
        },

        /**
         * removes all the map layers.
         * @param layerIds 		an array of layer id's
         */
        removeMapLayers: function(layerIds) {
            if (layerIds) {
                for (var i = 0; i < layerIds.length; i++) {
                    this.removeMapLayer(layerIds[i]);
                }
            }
        },

        /**
         * show  / hide the map layers
         * @param layerId 		ID assigned to the layer.
         * @param isShow		show / hide the layer (flag).
         */
        showChildMapLayers: function(layerId, isShow) {
            if (layerId && this.childLayersMap[layerId]) {
                //get the child layers 
                var childLayerIds = this.childLayersMap[layerId];
                //iterate all the child layers 
                for (var i = 0; i < childLayerIds.length; i++) {
                    //show or hide the map layer
                    this.showMapLayer(childLayerIds[i], isShow);
                }
            }
        },

        /**
         * get the  esri.layers.Layer 
         * @param layerId 		ID assigned to the layer.
         * @returns
         */
        getMapLayer: function(layerId) {
            var mapLayer;
            if (layerId) {
                mapLayer = this.map.getLayer(layerId);
            }

            return mapLayer;
        },

        /**
         * show / hide the map layer
         * @param layerId		ID assigned to the layer.
         * @param isShow		show / hide the map layer 
         */
        showMapLayer: function(layerId, isShow) {
            if (layerId) {
                //get the layer
                var layer = this.map.getLayer(layerId);
                if (layer) {
                    if (isShow) {
                        layer.show();
                    } else {
                        layer.hide();
                    }
                    this.showChildMapLayers(layerId, isShow);
                } else {
                    console.log("Layer with id = [" + layerId + "] not found");
                }
            }
        },

        /**
         * set the transparency for the map layer
         * @param layerId	ID assigned to the layer.		
         * @param transparency   transparency / opacity to the layer
         */
        setMapTransparency: function(layerId, transparency) {
            if (layerId) {
                //get the 
                var layer = this.map.getLayer(layerId);
                if (layer) {
                    layer.setOpacity(1 - (transparency / 100));
                } else {
                    console.log("Layer with id = [" + layerId + "] not found");
                }
            }
        },

        /**
         * adding a graphic to a layer and assigning a tooltip
         * @param layer A layer that contains one or more Graphic features
         * @param graphic	A Graphic can contain geometry, a symbol, attributes, 
         * 					or an infoTemplate. A Graphic is displayed in the GraphicsLayer. 
         * 					The GraphicsLayer allows you to listen for events on Graphics
         * @param model		stas model object
         */
        addLayerGraphic: function(layer, graphic, model) {
            if (graphic) {
            	//setting the tooltip
            	this.setToolTip(graphic, model);
            	
                graphic.data = model;
                layer.add(graphic);
            }
        },
        
        setToolTip: function(graphic, model){
        	
        	if (model.attributes != undefined && model.attributes.toolTip != undefined) {
                graphic.toolTip = model.attributes.toolTip;
        	}else if (model.attributes != undefined && model.attributes.ToolTip != undefined) {
                graphic.toolTip = model.attributes.ToolTip;
        	} else {
        		graphic.toolTip = model.name;
        	}
        },

        /**
         * adding a graphic to the map default graphics layer...
         * @param graphic
         */
        addGraphic: function(graphic) {
            if (graphic) {
                this.map.graphics.add(graphic);
            }
        },

        /**
         * remove the graphic from the map graphics layer...
         * @param graphic
         */
        removeGraphic: function(graphic) {
            if (graphic) {
                this.map.graphics.remove(graphic);
            }
        },

        /**
         * Based on the model type, either it creates  esri.geometry.Point or esri.geometry.Polyline Geometry  
         * @param model	stas/siserver  model object 
         * @param spatialReference 	The spatial reference of a map, layer, or inputs to and outputs from a task. 
         * 							Each projected and geographic coordinate system is defined by both a well-known ID (WKID) 
         * 							or a definition string (WKT). 
         * @returns {@link esri.geometry.Point}  or {@link esri.geometry.Polyline} 
         */
        getGeometry: function(model, spatialReference) {
            var geometry;

            if (model) {
                var coordPropertiesArray;

                switch (model.type) {
                case 1:
                    //placemark
                    if (model.coordinate) {
                        //creating the point geometry...
                        coordPropertiesArray = model.coordinate.split(",");
                        if (spatialReference) {
                            geometry = new Point(parseFloat(coordPropertiesArray[0]), parseFloat(coordPropertiesArray[1]), spatialReference);
                        } else {
                            geometry = new Point(parseFloat(coordPropertiesArray[0]), parseFloat(coordPropertiesArray[1]));
                        }
                    }
                    break;
                case 2:
                	//linestring
                    if (model.coordinates) {
                        //creating the polyline geometry with An array of paths where each path is an array of points
                        geometry = new Polyline();
                        //get the coordinates for the polyline
                        var pathCoordsArray = model.coordinates;
                        //iterate 
                        for (var j = 0; j < pathCoordsArray.length; j++) {
                            //coordinates are in the form of longitude, latitude, altitude longitude, latitude, altitude 
                            //so, split by " " coordinate properties
                            coordPropertiesArray = pathCoordsArray[j].split(" ");
                            var pointsArray = [];
                            var noOfCoords = coordPropertiesArray.length;
                            var coordsArray;
                            //iterate over all coordinates
                            for (var i = 0; i < noOfCoords; i++) {
                                if (coordPropertiesArray[i] && coordPropertiesArray[i] != "") {
                                    //split by "," to get the actual latitude and longitude
                                    coordsArray = coordPropertiesArray[i].split(",");
                                    //create the point geometry and populate an array of paths where each path is an array of points 
                                    if (spatialReference) {
                                        pointsArray.push(new Point(coordsArray[0], coordsArray[1], spatialReference));
                                    } else {
                                        pointsArray.push(new Point(parseFloat((coordsArray[0])), parseFloat((coordsArray[1]))));
                                    }
                                }
                            }
                            geometry.addPath(pointsArray);
                        }
                    }
                    //geometry = esri.geometry.geodesicDensify(geometry,150000000000000000000000);
                    break;
                default:
                    break;
                }
            }

            return geometry;
        },

        /**
         * generate the simple line symbol
         * @param style
         * @returns
         */
        getLineSymbol: function(style) {
            if (style) {
                var lineWidth;
                var lineColor;
                var lineStyle;

                if (style.line) {
                    lineColor = style.line.color;
                    lineWidth = style.line.width;
                    if (style.line.customProperties) {
                        lineStyle = this.getLineStyle(style.line.customProperties.style);
                    }

                    return this.getSimpleLineSymbol({
                        color: lineColor,
                        style: lineStyle,
                        width: lineWidth
                    });
                }
            }
        },

        /**
         * generate the simple marker symbol for the style....
         * @param style
         * @returns
         */
        getIconSymbol: function(style) {
            if (style) {
                var symbolColor;
                var symbolAngle;
                var symbolXoffset;
                var symbolYoffset;
                var symbolStyle;
                var symbolSize;
                var isApplyOffset;

                if (style.icon) {
                    symbolSize = style.icon.scale;
                    symbolColor = style.icon.color;
                    if (style.icon.customProperties) {
                        symbolXoffset = style.icon.customProperties.xoffset;
                        symbolYoffset = style.icon.customProperties.yoffset;
                        symbolStyle = style.icon.customProperties.style;

                        isApplyOffset = style.icon.customProperties.isApplyOffset;
                    }

                    return this.getSimpleMarkerSymbol({
                        angle: symbolAngle,
                        color: symbolColor,
                        size: symbolSize,
                        style: symbolStyle,
                        isApplyOffset: isApplyOffset,
                        xoffset: symbolXoffset,
                        yoffset: symbolYoffset,
                        outlineSymbol: this.getLineSymbol(style)
                    });
                }
            }

        },

        /**
         * retrieve  the styles by style id 
         * @param globalStyles
         * @returns {___anonymous16629_16630}
         */
        getGlobalStylesMap: function(globalStyles) {
            var globalSymbolsMap = {};
            if (globalStyles) {
                var noOfStyles = globalStyles.length;
                if (noOfStyles > 0) {
                    for (var i = 0; i < noOfStyles; i++) {
                        globalSymbolsMap[globalStyles[i].id] = globalStyles[i];
                    }
                }
            }

            return globalSymbolsMap;
        },

        /**
         * retrieve the styles for picture symbols 
         * @param globalStyles
         * @returns {___anonymous17103_17104}
         */
        getGlobalPictureSymbolsMap: function(globalStyles) {
            var globalSymbolsMap = {};
            if (globalStyles) {
                var noOfStyles = globalStyles.length;
                if (noOfStyles > 0) {
                    for (var i = 0; i < noOfStyles; i++) {
                        if (globalStyles[i].icon && globalStyles[i].icon.url && globalStyles[i].icon.url != '') {
                            globalSymbolsMap[globalStyles[i].id] = this.getPictureMarkerSymbol(globalStyles[i].icon);
                        }
                    }
                }
            }

            return globalSymbolsMap;
        },

        /**
         * retrieve the styles for icon symbols 
         * @param globalStyles
         * @returns {___anonymous17643_17644}
         */
        getGlobalIconSymbolsMap: function(globalStyles) {
            var globalSymbolsMap = {};
            if (globalStyles) {
                var noOfStyles = globalStyles.length;
                if (noOfStyles > 0) {
                    for (var i = 0; i < noOfStyles; i++) {
                        globalSymbolsMap[globalStyles[i].id] = this.getIconSymbol(globalStyles[i]);
                    }
                }
            }

            return globalSymbolsMap;
        },

        /**
         * retrieve the styles for line symbols map
         * @param globalStyles
         * @returns {___anonymous18122_18123}
         */
        getGlobalLineSymbolsMap: function(globalStyles) {
            var globalSymbolsMap = {};
            if (globalStyles) {
                var noOfStyles = globalStyles.length;
                if (noOfStyles > 0) {
                    for (var i = 0; i < noOfStyles; i++) {
                        globalSymbolsMap[globalStyles[i].id] = this.getLineSymbol(globalStyles[i]);
                    }
                }
            }

            return globalSymbolsMap;
        },

        /**
         * returns the dojo color and sets the opacity / transparency 
         * @param colorStr
         * @returns {___dojoColor5}
         */
        getColor: function(colorStr) {
            var hex;
            var alpha;
            var dojoColor;
            if (colorStr) {
                hex = "#" + colorStr.substring(2);
                var alphaStr = colorStr.substring(0, 2);
                alpha = parseInt(alphaStr, 16) / 255;
            }

            if (hex) {
                dojoColor = new dojo.Color(hex);
            } else {
                dojoColor = new dojo.Color("#" + Math.floor(Math.random() * 16777215).toString(16));
            }

            if (alpha) {
                dojoColor.a = alpha;
                return dojoColor;
            }

            return dojoColor;

        },

        /**
         * generic method to get the simple marker symbol style (refer esri esri.symbol.SimpleMarkerSymbol api for more information...)
         * @param symbolStyleStr
         * @returns
         */
        getMarkerStyle: function(symbolStyleStr) {
            if (symbolStyleStr) {
                if (symbolStyleStr == "cross") {
                    return SimpleMarkerSymbol.STYLE_CROSS;
                } else if (symbolStyleStr == "diamond") {
                    return SimpleMarkerSymbol.STYLE_DIAMOND;
                } else if (symbolStyleStr == "square") {
                    return SimpleMarkerSymbol.STYLE_SQUARE;
                } else if (symbolStyleStr == "diagonalcross") {
                    return SimpleMarkerSymbol.STYLE_X;
                }
            }
            return SimpleMarkerSymbol.STYLE_CIRCLE;
        },

        /**
         * generic method to get the simple line symbol style (refer esri esri.symbol.SimpleLineSymbol api for more information...)
         * @param lineStyleStr
         * @returns
         */
        getLineStyle: function(lineStyleStr) {
            if (lineStyleStr) {
                if (lineStyleStr == "dash") {
                    return SimpleLineSymbol.STYLE_DASH;
                } else if (lineStyleStr == "dashdot") {
                    return SimpleLineSymbol.STYLE_DASHDOT;
                } else if (lineStyleStr == "dashdotdot") {
                    return SimpleLineSymbol.STYLE_DASHDOTDOT;
                } else if (lineStyleStr == "dot") {
                    return SimpleLineSymbol.STYLE_DOT;
                } else if (lineStyleStr == "longdash") {
                    return SimpleLineSymbol.STYLE_LONGDASH;
                } else if (lineStyleStr == "longdashdot") {
                    return SimpleLineSymbol.STYLE_LONGDASHDOT;
                } else if (lineStyleStr == "null") {
                    return SimpleLineSymbol.STYLE_NULL;
                } else if (lineStyleStr == "shortdash") {
                    return SimpleLineSymbol.STYLE_SHORTDASH;
                } else if (lineStyleStr == "shortdashdot") {
                    return SimpleLineSymbol.STYLE_SHORTDASHDOT;
                } else if (lineStyleStr == "shortdashdotdot") {
                    return SimpleLineSymbol.STYLE_SHORTDASHDOTDOT;
                } else if (lineStyleStr == "shortdot") {
                    return SimpleLineSymbol.STYLE_SHORTDOT;
                }
            }

            return SimpleLineSymbol.STYLE_SOLID;
        },

        /**
         * text alignment (refer esri esri.symbol.TextSymbol api for more information...)
         * @param alignStr
         * @returns
         */
        getTextAlign: function(alignStr) {
            if (alignStr) {
                if (alignStr == "middle") {
                    return TextSymbol.ALIGN_MIDDLE;
                } else if (alignStr == "start") {
                    return TextSymbol.ALIGN_START;
                }
            }

            return TextSymbol.ALIGN_END;
        },

        /**
         * text decoration		(refer esri esri.symbol.TextSymbol api for more information...)
         * @param decorationStr
         * @returns
         */
        getTextDecoration: function(decorationStr) {
            if (decorationStr) {
                if (decorationStr == "linethrough") {
                    return TextSymbol.DECORATION_LINETHROUGH;
                } else if (decorationStr == "overline") {
                    return TextSymbol.DECORATION_OVERLINE;
                } else if (decorationStr == "underline") {
                    return TextSymbol.DECORATION_UNDERLINE;
                }
            }

            return TextSymbol.DECORATION_NONE;
        },

        /**
         * text font properties (refer esri esri.symbol.Font api for more information...)
         * @param fontProperties
         * @returns {___font6} esri.symbol.Font
         */
        getFont: function(fontProperties) {
            var font;
            if (fontProperties) {
                font = new Font();
                if (fontProperties.fontFamily) {
                    font.family = fontProperties.fontFamily;
                }
                if (fontProperties.fontSize) {
                    font.size = fontProperties.fontSize;
                }
                if (fontProperties.fontStyle) {
                    if (fontProperties.fontStyle == "italic") {
                        font.style = Font.STYLE_NORMAL;
                    } else if (fontProperties.fontStyle == "oblique") {
                        font.style = Font.STYLE_OBLIQUE;
                    }
                } else {
                    font.style = Font.STYLE_NORMAL;
                }

                if (fontProperties.fontVariant) {
                    if (fontProperties.fontVariant == "smallcaps") {
                        font.variant = Font.VARIANT_SMALLCAPS;
                    }
                } else {
                    font.variant = Font.VARIANT_NORMAL;
                }

                if (fontProperties.fontWeight) {
                    if (fontProperties.fontWeight == "bold") {
                        font.weight = Font.WEIGHT_BOLD;
                    } else if (fontProperties.fontWeight == "bolder") {
                        font.weight = Font.WEIGHT_BOLDER;
                    } else if (fontProperties.fontWeight == "lighter") {
                        font.weight = Font.WEIGHT_LIGHTER;
                    }
                } else {
                    font.weight = Font.WEIGHT_NORMAL;
                }
            }

            return font;
        },

        /**
         * get simple line symbol by setting color, width & style
         * @param properties
         * @returns {esri.symbol.SimpleLineSymbol } 
         */
        getSimpleLineSymbol: function(properties) {
            var lineSymbol = new SimpleLineSymbol();

            if (properties.color) {
                lineSymbol.color = this.getColor(properties.color);
            }
            if (properties.width) {
                lineSymbol.width = properties.width;
            }
            if (properties.style) {
                lineSymbol.style = this.getLineStyle(properties.style);
            }

            return lineSymbol;
        },

        /**
         * get simple marker  symbol by setting color, angle, size, xoffset, yoffset,outline symbol & style
         * @param properties
         * @returns {esri.symbol.SimpleLineSymbol}
         */
        getSimpleMarkerSymbol: function(properties) {
            var markerSymbol = new SimpleMarkerSymbol();
            if (properties.angle) {
                markerSymbol.angle = properties.angle;
            }
            if (properties.color) {
                markerSymbol.color = this.getColor(properties.color);
            }
            if (properties.size) {
                markerSymbol.size = properties.size;
            }
            if (properties.style) {
                markerSymbol.style = this.getMarkerStyle(properties.style);
            }

            if (properties.isApplyOffset) {
                if (properties.xoffset) {
                    markerSymbol.xoffset = properties.xoffset;
                }

                if (properties.yoffset) {
                    markerSymbol.yoffset = properties.yoffset;
                }
            }

            if (properties.outlineSymbol) {
                markerSymbol.outline = properties.outlineSymbol;
            }

            return markerSymbol;
        },

        /**
         * generate the picture marker symbol...
         * @param properties
         * @returns {esri.symbol.PictureMarkerSymbol}
         */
        getPictureMarkerSymbol: function(properties) {
            var pictureSymbol;

            if (properties && properties.url) {
                pictureSymbol = new PictureMarkerSymbol();

                pictureSymbol.url = properties.url;

                if (properties.scale) {
                    pictureSymbol.size = properties.scale;
                    pictureSymbol.width = properties.scale;
                    pictureSymbol.height = properties.scale;
                }

                if (properties.angle) {
                    pictureSymbol.setAngle(parseInt(properties.angle));
                }

                if (properties.customProperties) {
                    if (properties.customProperties.xoffset) {
                        pictureSymbol.xoffset = parseInt(properties.customProperties.xoffset);
                    }

                    if (properties.customProperties.yoffset) {
                        pictureSymbol.yoffset = parseInt(properties.customProperties.yoffset);
                    }

                    if (properties.customProperties.width) {
                        pictureSymbol.width = properties.customProperties.width;
                    }

                    if (properties.customProperties.height) {
                        pictureSymbol.height = properties.customProperties.height;
                    }
                }

                return pictureSymbol;
            }
        },

        /**
         * returns the text symbol by parsing labelStyle object properties
         * @param labelStyle 
         * @returns {___textSymbol8} Text symbols are used to add text on the graphics layer.
         * @reference http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/arcgis/help/jsapi_start.htm#jsapi/textsymbol.htm
         */
        getTextSymbol: function(labelStyle) {
            var textSymbol;

            if (labelStyle) {
                fontSize = labelStyle.scale;
                if (fontSize > 0) {
                    textSymbol = new TextSymbol();
                    if (labelStyle.color) {
                        textSymbol.color = this.getColor(labelStyle.color);
                    }
                    if (labelStyle.customProperties) {
                        labelStyle.customProperties.fontSize = fontSize;

                        if (labelStyle.customProperties.align) {
                            textSymbol.align = this.getTextAlign(labelStyle.customProperties.align);
                        }
                        if (labelStyle.customProperties.angle) {
                            textSymbol.angle = labelStyle.customProperties.angle;
                        }
                        textSymbol.decoration = this.getTextDecoration(labelStyle.customProperties.decoration);

                        if (labelStyle.customProperties.kerning) {
                            //determines whether to adjust the spacing between characters in the text string.
                            textSymbol.kerning = labelStyle.customProperties.kerning;
                        }
                        if (labelStyle.customProperties.rotated) {
                            //Determines whether every character in the text string is rotated.
                            textSymbol.rotated = labelStyle.customProperties.rotated;
                        }

                        if (labelStyle.customProperties.xoffset && labelStyle.customProperties.yoffset) {
                            textSymbol.setOffset(parseInt(labelStyle.customProperties.xoffset), parseInt(labelStyle.customProperties.yoffset));
                        } else {
                            if (labelStyle.customProperties.xoffset) {
                                textSymbol.xoffset = parseInt(labelStyle.customProperties.xoffset);
                            }
                            if (labelStyle.customProperties.yoffset) {
                                textSymbol.yoffset = parseInt(labelStyle.customProperties.yoffset);
                            }
                        }
                        textSymbol.font = this.getFont(labelStyle.customProperties);
                    }
                }
            }

            return textSymbol;
        },

        /**
         * return the attribute value for a given propertyString in an object
         */
        getAttributeValue: function(obj, propertyString) {
            if (obj) {
                var properties = propertyString.split(".");
                for (var i = 0; i < properties.length; i++) {
                    obj = obj[properties[i]];
                }
            }
            return obj;
        },

        /**
         * find the matching line graphic in the graphics layer for the given layerId
         * @param layerId
         * @param linePointGraphic  point graphic on the line...
         * @returns {esri.geometry.polyline}
         */
        getLineGraphic: function(layerId, linePointGraphic) {
            //find the matching line graphic...
            return this.findMatchingLineGraphic(layerId, linePointGraphic.geometry);
        },

        /**
         * find the matching point graphic in the graphics layer for the given layerId and return the starting point...
         * @param layerId
         * @param lineGraphic		target line graphic..
         * @returns
         */
        getStartPointGraphic: function(layerId, lineGraphic) {
            //find matching point graphic...
            return this.findMatchingPointGraphic(layerId, lineGraphic.getPoint(0, 0));
        },

        /**
         * find the matching point graphic in the graphics layer for the given layerId and return the ending  point...
         * @param layerId
         * @param lineGraphic 	target line graphic
         * @returns
         */
        getEndPointGraphic: function(layerId, lineGraphic) {
            //total number of paths...in a polyline graphic...
            var noOfPaths = lineGraphic.paths.length;
            //total number of points...in a polyline graphic
            var noOfPoints = lineGraphic.paths[noOfPaths - 1].length;
            //find and return the matching point graphic
            return this.findMatchingPointGraphic(layerId, lineGraphic.getPoint(noOfPaths - 1, noOfPoints - 1));
        },

        /**
         * find and return the matching point graphic in a graphic layer by layer id and equal to the point graphic...
         * @param layerId	- layer id of a target graphics layer ..
         * @param point -- target point graphic...
         * @returns {esri.geometry.Point}
         */
        findMatchingPointGraphic: function(layerId, point) {
            var matchedGraphic;
            //check whether there are child layers for the target layer id
            if (this.childLayersMap[layerId]) {
                var geometry;
                //if(!withInDistance) {
                //withInDistance = 10;
                //|| (this.getDistance(geometry, point) <= withInDistance)
                //}
                for (var j = 0; j < this.childLayersMap[layerId].length; j++) {
                    //get the child graphics layer...
                    var childLayerGraphics = this.map.getLayer(this.childLayersMap[layerId][j]).graphics;
                    var count = childLayerGraphics == null ? 0 : childLayerGraphics.length;
                    //loop through the graphic in that layer and check whether the graphic is matched with the target point graphic....
                    for (var i = 0; i < count; i++) {
                        graphic = childLayerGraphics[i];
                        //get the geometry to compare with target point graphic
                        geometry = graphic.geometry;
                        if (geometry.type == "point") {
                            if ((geometry.x == point.x && geometry.y == point.y)) {
                                //match successfull...return this graphic...
                                return graphic;
                            }
                        }
                    }
                }
            }

            return matchedGraphic;
        },

        /**
         * find and return the matching line graphic in a graphic layer by layer id and bisects to the point graphic...
         * @param layerId	- layer id of a target graphics layer ..
         * @param point -- target point graphic...
         * @returns {esri.geometry.Polyline}
         */
        findMatchingLineGraphic: function(layerId, point) {
            var matchedGraphic;
            var geometry;
            //get all the graphics for the target layer id 
            var lineGraphics = this.map.getLayer(layerId).graphics;
            var count = lineGraphics == null ? 0 : lineGraphics.length;

            var paths;
            //loop through all the graphics...
            for (var i = 0; i < count; i++) {
                graphic = lineGraphics[i];
                //get the geometry
                geometry = graphic.geometry;
                //check for polyline graphics...
                if (geometry.type == "polyline") {
                    //get all the paths....
                    paths = geometry.paths;
                    //check whether the target point is on the line 
                    for (var j = 0; j < paths.length; j++) {
                        for (var k = 0; k < paths[j].length; k++) {
                            if (paths[j][k][0] == point.x && paths[j][k][1] == point.y) {
                                //match successfull ..so, return the target line graphic..
                                return graphic;
                            }else if (this.isMatchedLineGraphic (paths[j][k][0], paths[j][k][1], point.x, point.y)) {
                                //match successfull ..so, return the target line graphic..
                                return graphic;
                            }
                        }
                    }
                }
            }

            return matchedGraphic;
        },
        
        isMatchedLineGraphic: function (pathXPoint, pathYPoint, pointX, pointY){
        	return (( ((parseFloat(pathXPoint)).toFixed(5) == (360+pointX).toFixed(5)) ||
                            		((parseFloat(pathXPoint)).toFixed(5) == (pointX).toFixed(5))) &&
                            		parseFloat(pathYPoint).toFixed(5) == (pointY).toFixed(5));
        },

        /**
         * find graphics that are available in target graphics(by targetLayerId ) layer that are matching the graphics in actual/source graphics layer(by layerId) 
         *  
         * @param layerId			source graphic layer
         * @param targetLayerId		target graphics layer  
         * @param isSourceLayerInWebMercator	flag to indiacate whether the source graphics are in webmercator or not
         * @param includeChildLayers			flag that indicates whetehr to check the graphics in child layers....
         * @param graphicType					graphic type that indicates whether its a polygon, polyline or point....
         * @returns {Array} 		an array of esri.Graphics
         */
        findGraphicsWithinLayer: function(layerId, targetLayerId, isSourceLayerInWebMercator, includeChildLayers, graphicType) {
            var results = [];
            //get the map layer by layer id
            var layer = this.getMapLayer(layerId);
            if (layer) {
                //get all the graphic in the esri graphics layer
                var layerGraphics = layer.graphics;
                var layerGeoGraphics = [];
                if (layerGraphics) {
                    var count = layerGraphics.length;
                    //if source layer is in webmercator then..... 
                    if (isSourceLayerInWebMercator) {
                        var geo;
                        for (var i = 0; i < count; i++) {
                            //then convert to geometry graphic...
                            geo = webMercatorUtils.webMercatorToGeographic(layerGraphics[i].geometry);
                            //add the newly generated graphic to the default map graphis layer...
                            layerGeoGraphics[i] = new Graphic(geo, layerGraphics[i].symbol);
                            this.map.graphics.add(layerGeoGraphics[i]);
                        }
                    }

                    this.addGraphicsWithinLayer(layerGeoGraphics, targetLayerId, graphicType, includeChildLayers, results);
                    if (isSourceLayerInWebMercator) {
                        //if the source graphics are in webmercator then remove those graphics from the map to main consistency...
                        for (var i = 0; i < count; i++) {
                            this.map.graphics.remove(layerGeoGraphics[i]);
                        }
                    }
                }
            }

            return results;
        },

        /**
         * 
         * @param layerGraphics
         * @param targetLayerId
         * @param graphicType
         * @param includeChildLayers
         * @param results
         */
        addGraphicsWithinLayer: function(layerGraphics, targetLayerId, graphicType, includeChildLayers, results) {
            if (layerGraphics) {
                var noOfGraphics = layerGraphics.length;

                var mapLayers = [];
                var mapLayer = this.map.getLayer(targetLayerId);
                if (mapLayer) {
                    mapLayers.push(mapLayer);
                    if (includeChildLayers) {
                        mapLayers = mapLayers.concat(this.getChildMapLayers(targetLayerId));
                    }
                }
                var targetLayerGraphics;
                var noOfMapLayers = mapLayers.length;
                for (var k = 0; k < noOfMapLayers; k++) {
                	if(mapLayers[k] == undefined){
                		continue;
                	}
                    targetLayerGraphics = mapLayers[k].graphics;
                    if(targetLayerGraphics == undefined){
                		continue;
                	}
                    if (layerGraphics && targetLayerGraphics) {
                        var targetLayerGraphicsCount = targetLayerGraphics.length;
                        var flag = false;
                        for (var i = 0; i < targetLayerGraphicsCount; i++) {
                            flag = false;
                            for (var j = 0; j < noOfGraphics; j++) {
                                if (graphicType != undefined && targetLayerGraphics[i].geometry.type != graphicType) {
                                    continue;
                                }
                                flag = layerGraphics[j]._extent.intersects(targetLayerGraphics[i].geometry) || layerGraphics[j]._extent.contains(targetLayerGraphics[i].geometry);
                                if (flag) {
                                	//chnages for fixes w.r.t point and extent
                                	if(targetLayerGraphics[i].geometry.type =="point" && this.isPointInside(layerGraphics[j].geometry.rings[0], targetLayerGraphics[i].geometry) ){
                                		results.push(targetLayerGraphics[i]);
                                	}else if(targetLayerGraphics[i].geometry.type !="point"){
                                		results.push(targetLayerGraphics[i]);
                                	}                                    
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        },

        /**
         *	set map extent by boundary box... 
         * @param bbox
         */
        setMapExtentByBBOX: function(bbox) {
            if (bbox) {
                var arrBBox = bbox.split(",");
                var west = parseFloat(arrBBox[0]);
                var south = parseFloat(arrBBox[1]);
                var east = parseFloat(arrBBox[2]);
                var north = parseFloat(arrBBox[3]);

                this.setMapExtent(Extent(west, south, east, north));
            }
        },

        /**
         * get the map extent...
         * @param extent
         */
        setMapExtent: function(extent) {
            this.map.setExtent(extent);
        },

        /**
         * 
         * @param point
         * @param toleranceInPixel
         * @returns {esri.geometry.Extent}
         */
        pointToExtent: function(point, toleranceInPixel) {
            var mapPixelWidth = this.map.extent.getWidth() / this.map.width;
            var toleraceInMapCoords = toleranceInPixel * mapPixelWidth;
            return new Extent(point.x - toleraceInMapCoords, point.y - toleraceInMapCoords, point.x + toleraceInMapCoords, point.y + toleraceInMapCoords, this.map.spatialReference);
        },

        /**
         * get distance between two points (webmercater points)
         * @param p1
         * @param p2
         * @returns {Number}
         */
        getDistance: function(p1, p2) {
            p1 = this.toGeographic(p1);
            p2 = this.toGeographic(p2);
            with(Math) { // Convert coordinates from degrees to Radians
                var lat1 = p1.y * (Math.PI / 180);
                var lon1 = p1.x * (Math.PI / 180);
                var lat2 = p2.y * (Math.PI / 180);
                var lon2 = p2.x * (Math.PI / 180);
                // Calculate the total extent of the route
                var distance = 2 * asin(sqrt(pow((sin((lat1 - lat2) / 2)), 2) + cos(lat1) * cos(lat2) * pow((sin((lon1 - lon2) / 2)), 2)));

                return distance;
            }

            return -1;
        },

        /**
         * to convert the point from webmercater to geographic...
         * @param geoPoint
         * @returns {esri.geometry.geographicToWebMercator}
         */
        toWebmercater: function(geoPoint) {
            return new webMercatorUtils.geographicToWebMercator(geoPoint);
        },

        /**
         * to convert the point from geographic to webmercater...
         * @param webmercatorPoint
         * @returns
         */
        toGeographic: function(webmercatorPoint) {
            return webMercatorUtils.webMercatorToGeographic(webmercatorPoint);
        },

        /**
         * Release 1.1 
         */
        /**
         * BRS: 1.3.1.11 - > Add preference to set at which zoom level location labels appear
         */
        getLodIndex: function(zoomLevel) {
            //get all the lods for the map
            var lodsList = this.mapOptions.lods;
            if (zoomLevel > 0 && zoomLevel != undefined) {
                if (lodsList != undefined) {
                    for (var i = 0; i < lodsList.length; i++) {
                        //validate the lod level with zoom level ...lod index starts from 0 
                        if (lodsList[i].level == (parseInt(zoomLevel) - 1)) {
                            return i; //return the index for that level..,
                        }
                    }
                }
            }
        },

        /**
         * get the printTemplate object
         * ANSI D Landscape - 34 x 22, Legal Portrait - 8.5 x 14, 
         * ANSI E Landscape - 44 x 34, A4 Portrait - 8.27 x 11.69, 
         * ANSI E Portrait - 34 x 44, Letter Portrait - 8.5 x 11, 
         * A4 Landscape - 11.69 x 8.27, ANSI D Portrait - 22 x 34, 
         * Letter Landscape - 11 x 8.5, Legal Landscape - 14 x 8.5, MAP_ONLY
         * 
         * 
         * PDF, PNG32, PNG8, JPG, GIF, EPS, SVG, SVGZ
         * 
         * 
         * @returns {___plate0}
         */
        getPrintTemplate: function(layoutType, formatType) {
            if (layoutType == undefined) {
                layoutType = "05.ANSI D Landscape - 34 x 22";
            }

            if (formatType == undefined) {
                formatType = "PNG32";
            }
            var plate = new PrintTemplate();
            plate.layout = plate.label = layoutType;
            plate.format = formatType;

            return plate;
        },

        /**
         * method that is used to invoke the print service to print the map
         * 
         * @param printUrl		- print service end point
         * @param layoutType	- preferred layout type. Refer {getPrintTemplate}
         * @param formatType	- preferred format type Refer {getPrintTemplate}
         */
        executePrint: function(printUrl, layoutType, formatType) {
            //initialize the print parameters
            var params = new PrintParameters();
            params.map = this.map;
            //initialize and get the prefered print template
            params.template = this.getPrintTemplate(layoutType, formatType);
            //create the print task with async as true 
            printTask = new PrintTask(printUrl, {
                async: true
            });
            // execute the print
            printTask.execute(params, this.printCompleteFn, this.printErrorFn);
        },

        /**
         * method to hide/show the layers that are printable
         * 
         * @param layerId		- layer id indicating the network view / schedule overlay view or schedule view
         * @param isPrintMap	- flag indicating whether the print is in progress
         */
        hideNonPrintableLayers: function(layerId, isPrintMap) {
            //get all the map layers by MODE (network view / schedule overlay view or schedule view)
            var mapLayerIds = this.getAllMapLayers(layerId);
            var mapLayer;
            if (mapLayerIds != undefined) {
                //iterate all the map layers
                for (var i = 0; i < mapLayerIds.length; i++) {
                    mapLayer = esriMap.getMapLayer(mapLayerIds[i]);
                    //if the map layer is printable 
                    if (mapLayer != undefined && (mapLayer.isPrintable != undefined && (!mapLayer.isPrintable || mapLayer.isPrintable === "false"))) {
                        //show/hide it
                        esriMap.showMapLayer(mapLayer.id, isPrintMap);
                    }
                }
            }
        },

        /**
         * get the zoom style by style id
         */
        getZoomLevelStyles: function(layerId, styleId) {
            //get the global style map for the selected layer
            var globalStylesMap = this.layerGlobalStylesMap[layerId];
            if (globalStylesMap != undefined) {
                return globalStylesMap[styleId];
            }
            return undefined;
        },

        /**
         * create a grpahic
         *  
         * @param geometry 	- {esri.geometry}
         * @param symbol	- {esri.symbol} 
         */
        createGraphic: function(geometry, symbol) {
            if (geometry != undefined && symbol != undefined) {
                //creates a graphic object
                return new Graphic(geometry, symbol);
            }
        },

        /**
         * creates a draw toolbar object
         */
        createDrawTool: function() {
            if (this.drawTool == undefined) {
                this.drawTool = new Draw(this.map, {
                    showTooltips: true
                });
            }
        },

        /**
         * Activate the draw toolbar object & change the cursor style
         * 
         * @param shape		- shape that need to be drawn on map
         * @param cursorStyle 	- cursor style
         */
        activateDrawTool: function(shape, cursorStyle) {
            if (shape != undefined) {
                //disable panning on map
                this.map.isPan = false;
                //and activate the shape that need to draw on map
                this.drawTool.activate(Draw[shape.toUpperCase().replace(/ /g, "_")]);
                //change the cursor style
                dojo.byId("map_layers").style.cursor = cursorStyle;
            }
        },

        /**
         * deactivate the draw toolbar
         */
        deactivateDrawTool: function() {
            this.drawTool.deactivate();
            //regain the map panning...
            this.map.isPan = true;
            //change the cursor style...
            dojo.byId("map_layers").style.cursor = 'default';
        },

        /**
         * add a draw tool bar event on to map
         * @param drawEvent			- Draw tool event name
         * @param drawEventCallBackMethod  	- callback handler
         */
        addDrawEvent: function(drawEvent, drawEventCallBackMethod) {
            if (drawEvent != undefined) {
                //attach the event to draw tool
                this.drawTool.on(drawEvent, drawEventCallBackMethod);
            }
        },

        /**
         * logic to reorder the map layers.
         * @param layerId - ID assigned to the layer.
         * @param index	- ordering index...
         */
        clearLayerGraphics: function(layerId) {
            var allLayerIds = this.getAllMapLayers(layerId);
            if (allLayerIds != undefined) {
                for (var i = 0; i < allLayerIds.length; i++) {
                    if (allLayerIds[i] != undefined && !(allLayerIds[i] instanceof Object)) {
                        this.clearGraphics(allLayerIds[i]);
                    }
                }
            }
        },


        /**
         * logic to reorder the map layers.
         * @param layerId - ID assigned to the esri map layer.
         */
        clearGraphics: function(layerId) {
            var _layer = this.map.getLayer(layerId);
            if (_layer != undefined && _layer instanceof GraphicsLayer) {
                _layer.clear();
            }
        },

        /**
         * Return all those layers that are currently visible
         * @param exceptLayerIds  -- {Array} of layer id's that to be ignored
         */
        getActiveLayerIds: function(exceptLayerIds) {
            var layerIds;
            var activeLayerIds;
            var _layer;
            if (this.childLayersMap != undefined) {
                //get all the parent layer id's
                layerIds = Object.keys(this.childLayersMap);
                if (layerIds != undefined) {
                    activeLayerIds = [];
                    for (var l = 0; l < layerIds.length; l++) {
                        //check / validate for active layer id
                        if (this.isActiveLayer(layerIds[l], exceptLayerIds)) {
                            activeLayerIds.push(layerIds[l]);
                        }
                    }
                }
            }
            //return an {Array} of layer id's
            return activeLayerIds;
        },

        /**
         * Check / validate whether the layer id is visible or not...
         * @param layerId 		- map layer id
         * @param exceptLayerIds - {Array} of layers that need to be ignored
         */
        isActiveLayer: function(layerId, exceptLayerIds) {
            if (layerId != undefined) {
                var _layer = this.getMapLayer(layerId);
                if (_layer != undefined && _layer["visible"] && (exceptLayerIds == undefined || (exceptLayerIds!= undefined && exceptLayerIds.indexOf(parseInt(layerId)) <= -1) )) {
                    return true;
                }
            }
        },

        /**
         * update the layer minimum scale
         * @param layerId 	- Map layer Id
         * @param value		- minimum scale value
         */
        setLayerMinScale: function(layerId, value) {
            var layer;
            if (layerId != undefined) {
                layer = this.getMapLayer(layerId);
                if (layer != undefined && value != undefined) {
                    layer.setMinScale(this.mapOptions.lods[parseInt(value)].scale);
                    layer.refresh();
                }
            }
        },
        
        isPointInside: function(coordinates, point){
            for(var c = false, i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i){
            	((coordinates[i][1] <= point.y && point.y < coordinates[j][1]) || (coordinates[j][1] <= point.y && point.y < coordinates[i][1]))
                && (point.x < (coordinates[j][0] - coordinates[i][0]) * (point.y - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])
                && (c = !c);
            }
                
            return c;
        },
        
        /**
         * creates a Edit toolbar object
         */
        getEditTool: function() {
        	if(this.editTool == undefined){        		
                this.editTool = new Edit(this.map, {
                	vertexSymbol: this.vertexSymbol,
                	ghostLineSymbol: this.ghostLineSymbol
                });                
        	}
            if (this.editTool != undefined) {
                return this.editTool;
            }
        }
    });
});