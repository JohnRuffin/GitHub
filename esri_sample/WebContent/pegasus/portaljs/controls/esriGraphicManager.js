/**
 * @author 888608 - Module & Singleton design pattern ESRI Graphic Manager for Map
 * @returns {ESRIGraphicManager}
 */
define(["esri/units", "esri/geometry/Circle", "esri/geometry/geodesicUtils", "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/domUtils", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/lang", "dojo/_base/declare", "dojo/dom", "dojo/dom-construct"], function(Units, Circle, geodesicUtils, GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, domUtils, on, connect, registry, lang, declare, dom, domConstruct) {


    var SingletonClass = declare(null, {

        constructor: function() {

            this.PARAM_WIDTH_HIGHLIGHT = 1.5;
            this.PARAM_WIDTH_NORMAL = 1;
            this.PARAM_WIDTH_OPACITY = 0.5;
            this.PARAM_OPACITY_LOW = 0.5;
            this.PARAM_OPACITY_NORMAL = 1;
            this.HANGER_IMAGE_URL = "pegasus/assets/edit/pin1.png";
            this.layerId = function() {
                if (parent.isNetworkQuery && !isScheduleForNetworkFlag) {
                    return mapViewDiv.LAYER_ID_NETWORK_LANES;
                } else if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
                    return mapViewDiv.LAYER_ID_NETWORK_SCHEDULE_LEGS;
                } else {
                    return mapViewDiv.LAYER_ID_SCHEDULE_LEGS;
                }
            };

            this.laneOrLegGraphicId = function() {
                if (this.isNetworkQuery) {
                    return "laneId";
                } else if (this.isScheduleOverlay) {
                    return "routeId";
                } else {
                    return "routeId";
                }
            };

            this.setGraphicProperties = function(graphic, props) {
                if (props != undefined && graphic != undefined) {
                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        switch (keys[i]) {
                        case "width":
                            if (props[keys[i]] == undefined) {
                                props[keys[i]] = this.PARAM_WIDTH_NORMAL;
                            }
                            if (graphic != undefined) {
                                var symbol = this.getGraphicSymbol(graphic);
                                if (symbol != undefined) {
                                    symbol.setWidth(props[keys[i]]);
                                    graphic.setSymbol(symbol);
                                }
                            }
                            break;
                        case "opacity":
                            if (props[keys[i]] == undefined) {
                                props[keys[i]] = this.PARAM_OPACITY_NORMAL;
                            }

                            if (graphic != undefined) {
                                var symbol = this.getGraphicSymbol(graphic);
                                if (symbol != undefined) {
                                    var color = this.getSymbolColor(symbol);
                                    color.a = props[keys[i]];
                                    graphic.setSymbol(symbol);
                                }
                            }
                            break;
                        }
                    }
                }
            };

            /**
             * 
             */
            this.getGraphicSymbol = function(graphic) {
                if (graphic != undefined) {
                    return graphic.symbol;
                }
            };

            /**
             * 
             */
            this.getSymbolColor = function(symbol) {
                if (symbol != undefined) {
                    return symbol.color;
                }
            };

            this.setGraphicsProperties = function(graphics, props) {
                if (graphics != undefined) {
                    var count = graphics != undefined ? graphics.length : 0;
                    for (var i = 0; i < count; i++) {
                        this.setGraphicProperties(graphics[i], props);
                    }
                    this.refreshLaneOrLegGraphicsLayer();
                }
            };



        },

        getLaneOrLegGraphics: function() {
            var mapLayer = this.getMapLayer();
            if (mapLayer != undefined) {
                return mapLayer.graphics;
            }
        },

        refreshLaneOrLegGraphicsLayer: function() {
            var mapLayer = this.getMapLayer();
            if (mapLayer != undefined) {
                return mapLayer.refresh();
            }
        },

        getMapLayer: function() {
            return esriMap.getMapLayer(this.layerId());
        },

        getLegDetails: function(legGraphic) {
            if (legGraphic != undefined) {
                return (legGraphic.data != undefined && legGraphic.data.attributes != undefined) ? legGraphic.data.attributes["LegDetails"] : undefined;
            }
        },
        getLegDetailsArr: function(legGraphicArr) {
            var tempArr = [];
            for (var i = 0; i < legGraphicArr.length; i++) {
                if (legGraphicArr[i] != undefined) {
                    (legGraphicArr[i].data != undefined && legGraphicArr[i].data.attributes != undefined) ? tempArr.push((legGraphicArr[i].data.attributes["LegDetails"])[0]) : undefined;
                }
            }
            return tempArr;
        },
        totalLegs: function(legGraphic) {
            var legDetails = this.getLegDetails(legGraphic);
            if (legDetails != undefined) {
                //gets the total leg count that are active and not deleted...
                return this.validateLegDetailsByDeleteFlag(lang.clone(legDetails)).length;
            }
        },

        getRouteId: function(legDetail) {
            if (legDetail != undefined) {
                return legDetail["routeId"];
            }
        },

        /**
         * Returns array of routes ids
         * @param legGraphic
         * @param includeDeletedLegsOnly   - indicates whether to include deleted routes only or not
         * @returns {Array}
         */
        getRouteIdFromGraphic: function(legGraphic, includeDeletedLegsOnly) {
            if (legGraphic != undefined) {
                var legDetails = this.getLegDetails(legGraphic);
                var routeIds = [];
                var routeId;
                if (legDetails != undefined) {
                    var count = legDetails.length;
                    for (var i = 0; i < count; i++) {
                        if( includeDeletedLegsOnly != undefined && includeDeletedLegsOnly ){
                            if(!this.isDeletedLeg(legDetails[i])){
                                continue;
                            }
                        }
                        routeId = this.getRouteId(legDetails[i]);
                        //if route id is already present in the array...skip to add it again
                        if(routeIds.indexOf(routeId) <= -1){
                            routeIds.push(this.getRouteId(legDetails[i]));
                        }

                    }
                }
                return routeIds;
            }
        },

        /**
         * returns whether the leg is deleted or active
         * @param legDetail
         * @returns {boolean}
         */
        isDeletedLeg: function(legDetail) {
            if (legDetail != undefined) {
                if(legDetail["changeFlag"] == "Deleted"){
                    return true;
                }
            }
            return false;
        },

        
        getLaneOrLegGraphicsByIdCloned: function(id) {
            var mapGraphics = this.getLaneOrLegGraphics();
            if (mapGraphics != undefined) {
                var count = mapGraphics.length;
                var laneOrLegGraphics = [];
                var legDetails;
                for (var i = 0; i < count; i++) {
                    legDetails = this.getLegDetails(mapGraphics[i]);
                    if (legDetails != undefined) {
                        for (var j = 0; j < legDetails.length; j++) {
                            if (legDetails[j]["routeId"] == id) {
                                //marshalling the property to sort the graphics by seq number
                                mapGraphics[i]["mvNbrSeq"] = legDetails[j]["mvNbrSeq"];
                                //changes made to indicate whether the graphic is deleted or not
                                laneOrLegGraphics.push({"data": lang.clone(mapGraphics[i].data), "mvNbrSeq": legDetails[j]["mvNbrSeq"], "changeFlag": legDetails[j]["changeFlag"]});
                            }
                        }
                    }
                }
                //validate and returns the active leg/lane graphics
                this.validateLaneOrLegGraphicsByDeleteFlag(laneOrLegGraphics);
                return laneOrLegGraphics.sort(this.dynamicSort("mvNbrSeq"));
            }
        },
        
        isGraphicInReverseDirection: function(legGraphic, routeId) {
        	var legDetails;
            if (legGraphic != undefined) {
                legDetails = this.getLegDetails(legGraphic);
                if (legDetails != undefined) {
                    for (var j = 0; j < legDetails.length; j++) {
                        if (legDetails[j]["routeId"] == routeId) {
                        	if(this.isSameLocation("destination", legGraphic.data.attributes.Destination, legDetails[j])){
                        		return false;
                        	}
                        	
                        	if(this.isSameLocation("destinationAP", legGraphic.data.attributes.Destination, legDetails[j])){
                        		return false;
                        	}
                        }
                    }
                }
                return true;
            }
        },
        
        isSameLocation: function(type, legGraphiclocation, legDetail) {
        	if( legDetail[type] === legGraphiclocation.locCd || legDetail[type] === legGraphiclocation.locCdActual ){
        		return true;
        	}
        	
        	return false;
        },
        
        getLaneOrLegGraphicsById: function(id) {
            var mapGraphics = this.getLaneOrLegGraphics();
            if (mapGraphics != undefined) {
                var count = mapGraphics.length;
                var laneOrLegGraphics = [];
                var legDetails;
                for (var i = 0; i < count; i++) {
                    legDetails = this.getLegDetails(mapGraphics[i]);
                    if (legDetails != undefined) {
                        for (var j = 0; j < legDetails.length; j++) {
                            if (legDetails[j]["routeId"] == id) {
                                //marshalling the property to sort the graphics by seq number
                                mapGraphics[i]["mvNbrSeq"] = legDetails[j]["mvNbrSeq"];
                                //changes made to indicate whether the graphic is deleted or not
                                //made changes to handle in case of graphic is a circle/polygon....
                                laneOrLegGraphics.push({"data": lang.clone(mapGraphics[i].data), "mvNbrSeq": legDetails[j]["mvNbrSeq"], "changeFlag": legDetails[j]["changeFlag"],
                                    geometry: lang.clone(mapGraphics[i].geometry.type == "polygon"? {paths: mapGraphics[i].geometry.paths}: mapGraphics[i].geometry)});
                            }
                        }
                    }
                }
                //validate and returns the active leg/lane graphics
                this.validateLaneOrLegGraphicsByDeleteFlag(laneOrLegGraphics);
                return laneOrLegGraphics.sort(this.dynamicSort("mvNbrSeq"));
            }
        },

        /**
         * validate the lane or leg graphics to include all deleted legs or only active legs
         * @param laneOrLegGraphics
         */
        validateLaneOrLegGraphicsByDeleteFlag: function(laneOrLegGraphics) {
            if(laneOrLegGraphics != undefined){
                /*var isEntireRouteDeleted = true;
                for (var j = 0; j < laneOrLegGraphics.length; j++) {
                    if (laneOrLegGraphics[j]["changeFlag"] == "Modify" || laneOrLegGraphics[j]["changeFlag"] == "Insert") {
                        isEntireRouteDeleted = false;
                        break;
                    }
                }*/
                ///if(!isEntireRouteDeleted){
                    for (var i = laneOrLegGraphics.length-1; i >= 0; i--) {
                        if (laneOrLegGraphics[i]["changeFlag"] == "Deleted") {
                            laneOrLegGraphics.splice(i, 1);
                        }
                    }
                //}
            }
        },

        /**
         * validate the lane or leg graphics to include all deleted legs or only active legs
         * @param laneOrLegGraphics
         */
        validateLegDetailsByDeleteFlag: function(legDetails) {
            if(legDetails != undefined){
                /*var isEntireRouteDeleted = true;
                for (var j = 0; j < legDetails.length; j++) {
                    if (legDetails[j]["changeFlag"] == "Modify" || legDetails[j]["changeFlag"] == "Insert" ) {
                        isEntireRouteDeleted = false;
                        break;
                    }
                }*/
               // if(!isEntireRouteDeleted){
                    for (var i = legDetails.length-1; i >= 0; i--) {
                    if (legDetails[i]["changeFlag"] == "Deleted") {
                        legDetails.splice(i, 1);
                    }
                }
               // }
            }

            return legDetails;
        },

        getLegDetailsById: function(id){
            var mapGraphics = this.getLaneOrLegGraphics();
            if (mapGraphics != undefined) {
                var count = mapGraphics.length;
                var legDetailsArr = [];
                var legDetails;
                for (var i = 0; i < count; i++) {
                    legDetails = this.getLegDetails(mapGraphics[i]);
                    if (legDetails != undefined) {
                        for (var j = 0; j < legDetails.length; j++) {
                            if (legDetails[j]["routeId"] == id) {
                                legDetailsArr.push(legDetails[j]);
                            }
                        }
                    }
                }
                return legDetailsArr;
            }
        },

        /**
         * gets all the legs associated with that route id..
         * @param id
         * @param includeDeletedLegsOnly  -- indicates whether to include the deleted routes only or not
         * @returns {*}
         */
        getLegDetailsByRoute: function(id, includeDeletedLegsOnly) {
            if(id != undefined){
                var legDetailsArr = this.getLegDetailsById(id, includeDeletedLegsOnly);
                if(legDetailsArr  != undefined){
                    if(!includeDeletedLegsOnly){
                        this.validateLegDetailsByDeleteFlag(legDetailsArr);
                    }
                    return legDetailsArr.sort(this.dynamicSort("mvNbrSeq"));
                }
            }
        },

        /**
         * gets all the legs associated with that route id..
         * @param id
         * @returns {*}
         */
        getDeletedRouteById: function(id) {
            if(id != undefined){
                var legDetailsArr = this.getLegDetailsById(id);
                if(legDetailsArr  != undefined){
                    legDetailsArr = this.getLegDetailsByDeleteFlag(legDetailsArr);
                    return legDetailsArr.sort(this.dynamicSort("mvNbrSeq"));
                }
            }
        },

        /**
         * check whether the multiple routes are deleted ...
         * @param routeIds
         * @returns {boolean}
         */
        areMultipleRoutesDeleted: function(routeIds) {
            if (routeIds != undefined) {
                var routeId;
                var totalDeletedRoutes = this.getTotalDeletedRoutesCount(routeIds);
                if(totalDeletedRoutes > 1){
                    return true;
                }
            }
            return false;
        },

        /**
         * gets the totoal deleted routes count
         * @param routeIds
         * @returns {number}
         */
        getTotalDeletedRoutesCount: function(routeIds) {
            var totalDeletedRoutes = 0;
            if (routeIds != undefined) {
                var routeId;
                for(var i=0; i< routeIds.length; i++){
                    routeId = routeIds[i];
                    if(routeId  != undefined){
                        var rowData = (ESRIHelper.getEsriGraphicManager().getDeletedRouteById(routeId, true))[0];
                        if(rowData != undefined){
                            totalDeletedRoutes++;
                        }
                    }
                }
            }
            return totalDeletedRoutes;
        },

        /**
         * whether to show the "un-delete route" menu or not
         * @param graphic
         * @returns {boolean}
         */
        isShowUnDeleteMenu: function(graphic){
            var count = this.getTotalDeletedRoutesCount(this.getRouteIdFromGraphic(graphic, true));
            if(count <=0) {
                return false
            }
            return true;
        },

        /**
         * validate the lane or leg graphics to include all deleted legs or only active legs
         * @param laneOrLegGraphics
         */
        getLegDetailsByDeleteFlag: function(legDetails) {
            if(legDetails != undefined) {
                var isEntireRouteDeleted = true;
                for (var j = 0; j < legDetails.length; j++) {
                    if (legDetails[j]["changeFlag"] == "Modify" || legDetails[j]["changeFlag"] == "Insert") {
                        isEntireRouteDeleted = false;
                        break;
                    }
                }
                if (isEntireRouteDeleted) {
                    return legDetails;
                }else {
                    return [];
                }

            }
        },

        dynamicSort: function(name) {
            var sortOrder = 1;
            if (name[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function(a, b) {
                var result = (a[name] < b[name]) ? -1 : (a[name] > b[name]) ? 1 : 0;
                return result * sortOrder;
            };
        },

        getLegDetailsByRoutes: function(routeIds, includeDeletedLegsOnly) {
            if (routeIds != undefined) {
                var count = routeIds.length;
                var routeLegDetailsMap = [];
                for (var i = 0; i < count; i++) {
                    routeLegDetailsMap[routeIds[i]] = this.getLegDetailsByRoute(routeIds[i], includeDeletedLegsOnly);
                }
                return routeLegDetailsMap;
            }
        },

        getLegDetailsByRouteFromGraphic: function(legGraphic, includeDeletedLegsOnly) {
            if (legGraphic != undefined) {
                return this.getLegDetailsByRoutes(this.getRouteIdFromGraphic(legGraphic, includeDeletedLegsOnly), includeDeletedLegsOnly);
            }
        },

        getLaneOrLegGraphicsByIds: function(ids) {
            if (ids != undefined) {
                var routeLegGraphicsMap = [];
                var count = ids.length;
                for (var i = 0; i < count; i++) {
                    routeLegGraphicsMap[ids[i]] = this.getLaneOrLegGraphicsById(ids[i]);
                }
                return routeLegGraphicsMap;
            }
        },

        getRouteLegGraphics: function(legGraphic) {
            if (legGraphic != undefined) {
                var routeIds = this.getRouteIdFromGraphic(legGraphic);
                if (routeIds != undefined) {
                    return this.getLaneOrLegGraphicsByIds(routeIds);
                }
            }
        },

        getLaneOrLegGraphicsByNoId: function(id) {
            var mapGraphics = this.getLaneOrLegGraphics();
            if (mapGraphics != undefined) {
                var count = mapGraphics.length;
                var laneOrLegGraphics = [];
                var legDetails;
                var isRouteFound;
                for (var i = 0; i < count; i++) {
                    isRouteFound = false;
                    legDetails = this.getLegDetails(mapGraphics[i]);
                    if (legDetails != undefined) {
                        for (var j = 0; j < legDetails.length; j++) {
                            if (legDetails[j]["routeId"] == id) {
                                isRouteFound = true;
                                break;
                            }
                        }
                    }

                    if (!isRouteFound) {
                        laneOrLegGraphics.push(mapGraphics[i]);
                    }
                }
                return laneOrLegGraphics;
            }
        },

        highlightRouteHandler: function(routeId, width, alpha) {
            if (routeId != undefined) {
                this.setMapLayersOpacity(getLayerId(), 0.1);

                var otherRouteLegGraphics = this.getLaneOrLegGraphicsByNoId(routeId);
                if (otherRouteLegGraphics != undefined) {
                    this.setGraphicsProperties(otherRouteLegGraphics, {
                        width: this.PARAM_WIDTH_OPACITY,
                        opacity: alpha
                    });
                }

                var routeLegGraphics = this.getLaneOrLegGraphicsById(routeId);
                if (routeLegGraphics != undefined) {
                    this.setGraphicsProperties(routeLegGraphics, {
                        width: width,
                        opacity: this.PARAM_OPACITY_NORMAL
                    });
                }

            }

        },

        resetHighlightRouteHandler: function() {
            var polylineGraphics = this.getLaneOrLegGraphics();
            if (polylineGraphics != undefined) {
                this.setGraphicsProperties(polylineGraphics, {
                    width: undefined,
                    opacity: undefined
                });
            }
        },

        isLegGraphic: function(graphic) {
            if (graphic != undefined) {
                return (this.totalLegs(graphic) >= 1 ? true : false);
            }
            return false;
        },

        setGraphicVisible: function(graphic, isVisible) {
            if (graphic != undefined) {
                if (isVisible) {
                    graphic.show();
                } else {
                    graphic.hide();
                }
            }
        },

        setGraphicsVisibility: function(locationGraphics, isVisible) {
            var esriGraphicComponent = this;
            if (locationGraphics != undefined) {
                $.each(locationGraphics, function(key, graphic) {
                    esriGraphicComponent.setGraphicVisible(graphic, isVisible);
                });
            }
        },

        setMapLayersOpacity: function(layerId, opacity) {
            var pictureSymbolLayers = ESRIHelper.getEsriZoomManager().pictureSymbolLayerIds[layerId];
            //var labelLayers = ESRIHelper.getEsriZoomManager().labelLayerIds[layerId];
            var countLayers = ESRIHelper.getEsriZoomManager().countLayerIds[layerId];
            //var directionLayers = ESRIHelper.getEsriZoomManager().directionLayerIds[layerId];
            var numberLayers = ESRIHelper.getEsriZoomManager().numberLayerIds[layerId];

            this.setGraphicLayersOpacity(pictureSymbolLayers, opacity);
            //this.setGraphicLayersOpacity(labelLayers, opacity);
            this.setGraphicLayersOpacity(countLayers, opacity);
            //this.setGraphicLayersOpacity(directionLayers, opacity);
            this.setGraphicLayersOpacity(numberLayers, opacity);
        },

        hideMapLayers: function(layerId, isHide) {

            var pictureSymbolLayers = ESRIHelper.getEsriZoomManager().pictureSymbolLayerIds[layerId];
            var labelLayers = ESRIHelper.getEsriZoomManager().labelLayerIds[layerId];
            var countLayers = ESRIHelper.getEsriZoomManager().countLayerIds[layerId];
            var directionLayers = ESRIHelper.getEsriZoomManager().directionLayerIds[layerId];
            var numberLayers = ESRIHelper.getEsriZoomManager().numberLayerIds[layerId];
            var locationSymbolLayers = ESRIHelper.getEsriZoomManager().locationsLayerIds[layerId];

            this.hideGraphicLayer(pictureSymbolLayers, isHide);
            this.hideGraphicLayer(labelLayers, isHide);
            this.hideGraphicLayer(countLayers, isHide);
            this.hideGraphicLayer(directionLayers, isHide);
            this.hideGraphicLayer(numberLayers, isHide);
            this.hideGraphicLayer(locationSymbolLayers, isHide);
        },

        hideGraphicLayer: function(layers, opacity) {
            var esriGraphicComponent = this;
            if (layers != undefined) {
                $.each(layers, function(key, layerId) {
                    if (layerId != undefined) {
                        esriGraphicComponent.hideMapLayer(layerId, opacity);
                    }
                });
            }
        },

        hideMapLayer: function(layerId, opacity) {
            var layer;
            if (layerId != undefined) {
                layer = esriMap.getMapLayer(layerId);
                if (opacity) {
                    //layer.show();
                    //this.getMapLayer().show();
                } else {
                    //layer.hide();
                    //this.getMapLayer().hide();
                }
            }
        },

        setGraphicLayersOpacity: function(layers, opacity) {
            var esriGraphicComponent = this;
            if (layers != undefined) {
                $.each(layers, function(key, layerId) {
                    if (layerId != undefined) {
                        esriGraphicComponent.setGraphicLayerOpacity(layerId, opacity);
                    }
                });
            }
        },

        setGraphicLayerOpacity: function(layerId, opacity) {
            var layer;
            if (layerId != undefined) {
                layer = esriMap.getMapLayer(layerId);
                layer.setOpacity(opacity);
            }
        },

        resetRouteSelection: function() {
            this.setMapLayersOpacity(getLayerId(), 1);
            this.resetHighlightRouteHandler();
        },

        getSingleGraphicbyRouteId: function(routeId, isHide) {
            var routeGraphics = this.getLaneOrLegGraphicsById(routeId);
            var geometry;
            if (routeGraphics != undefined) {
                var paths = GeometryHelper.getGeometryFromGraphics(routeGraphics, routeId);
                var polyline = new Polyline({
                    "paths": [
                    paths]
                });

                return new Graphic(this.toGeodesicUtils(polyline), this.getFeatureSymbol("polyline"));
            }
        },
        
        toGeodesicUtils: function(geometry, lineSegmentWidth) {
        	if(geometry != undefined){
        		if(lineSegmentWidth != undefined){
        			lineSegmentWidth = 100000000000000000000000000000000000000;
        		}
        		return geodesicUtils.geodesicDensify(geometry, lineSegmentWidth );
        	}        	
        },
        
        hideAllRouteGraphic: function(routeId, legCount) {
            var routeLegGraphics = this.getLaneOrLegGraphicsById(routeId);
            if (routeLegGraphics != undefined) {
            	if(legCount == undefined){
            		legCount = 1;
            	}
            	var props = {
                        width: 0,
                        opacity: 0
                    };
            	 if (routeLegGraphics != undefined) {
                     var count = routeLegGraphics != undefined ? routeLegGraphics.length : 0;
                     for (var i = 0; i < count; i++) {
                    	 if(this.getTotalLegs(routeLegGraphics[i]) == 1 ){
                    		 this.setGraphicProperties(routeLegGraphics[i], props);
                    	 }                         
                     }
                     this.refreshLaneOrLegGraphicsLayer();
                 }
            	
            }
        },
        
        getTotalLegs: function(graphic){
        	if(graphic != undefined){
        		if(graphic.data.attributes){
        			return graphic.data.attributes.NoOfLegs;
        		}
        	}
        	return -1;
        },

        getAllLocationsbyRouteId: function(routeId) {
            var legDetails = this.getLegDetailsByRoute(routeId);
            if (legDetails != undefined) {
                var count = legDetails.length;
                var allLocations = [];
                var location;
                for (var i = 0; i < count; i++) {
                    if (legDetails[i] != undefined) {
                        location = legDetails[i].origin;
                        if (location != undefined) {
                            allLocations.push(location);
                        }

                        if (i == (count - 1)) {
                            location = legDetails[i].destination;
                            if (location != undefined) {
                                allLocations.push(location);
                            }
                        }
                    }
                }

                return allLocations;
            }
        },

        getPictureMarkerSymbol: function(url) {
            return new PictureMarkerSymbol({
                "url": this.HANGER_IMAGE_URL,
                "height": 20,
                "width": 13,
                "type": "esriPMS"
            });
        },

        getPointGeometry: function(lng, lat) {
            return new Point(lng, lat);
        },

        getPictureGraphic: function(graphic) {
            if (graphic != undefined) {
                var geometry = graphic.geometry;
                return this.getGraphic(this.getPointGeometry(geometry.x, geometry.y), this.getPictureMarkerSymbol());
            }
        },

        getLineGraphic: function(startPoint, endPoint) {
            if (startPoint != undefined && endPoint != undefined) {
                var coords = CoordinateUtils.validateCoordinatesNow(lang.clone(startPoint.geometry), lang.clone(endPoint.geometry));//CoordinateUtils.validateCoordinatesByQuadrant(CoordinateUtils.validateCoordinatesNow(lang.clone(startPoint.geometry), lang.clone(endPoint.geometry)));
                if (coords != undefined) {
                    console.log(coords[0] + "," + coords[1]);
                    return this.getGraphic(this.getLineGeometry(coords[0], coords[1]), this.getFeatureSymbol("polyline"));
                }
            }
        },

        getFeatureSymbol: function(type) {
            switch (type) {
            case "polyline":
                return new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID, new dojo.Color([75, 19, 136]), 1);
                break;
            }
        },

        getLineGeometry: function(startPoint, endPoint) {
            if (startPoint != undefined && endPoint != undefined) {
                return this.toGeodesicUtils( new Polyline({
                    "paths": [
                        [
                        this.getPointGeometryFromGeometry(startPoint), this.getPointGeometryFromGeometry(endPoint)]
                    ]
                }));
            }
        },

        getPolylineGraphic: function(pointGraphics) {
            if (pointGraphics != undefined) {
                var pointGraphic;
                var paths = [];
                for (var i = 0; i < pointGraphics.length; i++) {
                    paths.push(this.getPointGeometryFromGraphic(pointGraphics[i]));
                }
                var polyline = new Polyline({
                    "paths": [
                    paths]
                });

                var polylineSbl = this.getFeatureSymbol("polyline");

                return new Graphic(this.toGeodesicUtils(polyline), polylineSbl);

            }
        },

        getPointGeometryFromGeometry: function(pointGeometry) {
            if (pointGeometry != undefined) {
                return [pointGeometry.x, pointGeometry.y];
            }
        },

        getPointGeometryFromGraphic: function(pointGraphic) {
            if (pointGraphic != undefined) {
                return this.getPointGeometryFromGeometry(pointGraphic.geometry);
            }
        },


        getGraphic: function(geometry, symbol) {
            if (geometry != undefined && symbol != undefined) {
                return new Graphic(geometry, symbol);
            }
        },

        getVirtualGraphic: function(startPoint, endPoint, length){
            var graphic = new Polyline();

            if(length == undefined){
                length = 315000;
            }

            if(CoordinateUtils.areSameCoordinates(startPoint, endPoint)){
                graphic = new Circle(this.destinationPoint(startPoint, 0, 0.1), {
                    radius: 6.865,
                    geodesic: true,
                    radiusUnit: Units.MILES
                });
                //cache the paths and use it in place of rings for polygon or paths in case of polylines...
                graphic.paths = new Array([[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]]);
                return graphic;
            }else {
                graphic = new Polyline();
                graphic.addPath([startPoint, endPoint]);
                return this.getPolylineWithMinimumPoints(graphic);
            }
        },

        destinationPoint:  function (point, brng, dist) {
            dist = dist / 57.62;  // radius of the Earth in decimal degrees at the equator
            brng = brng.toRadians();

            var lat1 = point.y.toRadians(), lon1 = point.x.toRadians();

            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                    Math.cos(lat1),
                    Math.cos(dist) - Math.sin(lat1) *
                    Math.sin(lat2));

            if (isNaN(lat2) || isNaN(lon2)) return null;

            return new Point(lon2.toDegrees(), lat2.toDegrees());
        },

        getPolylineWithMinimumPoints: function(polyline, length, minPoints){
            if(minPoints == undefined){
                minPoints = 12;
            }

            if(length == undefined){
                length = 310000;
            }
            if(polyline != undefined){
                var geodesicGeometry = geodesicUtils.geodesicDensify(polyline, length );
                while(!CoordinateUtils.hasMinimumPoints(geodesicGeometry, minPoints) && length > 0.03){
                    length = length /10;
                    geodesicGeometry =  geodesicUtils.geodesicDensify(polyline, length );
                }
                return geodesicGeometry;
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

var GeometryHelper = (function() {
    function constructorFn() {

    };

   /* constructorFn.getGeometryFromGraphics = function(routeGraphics) {
        if (routeGraphics != undefined) {
            var newGeometryPath = [];
            var subPaths;
            var totalPathCount;
            var cords = [];
            for (var i = 0; i < routeGraphics.length; i++) {
                paths = routeGraphics[i].geometry.paths;
                if (paths != undefined) {
                    totalPathCount = paths.length;
                    
                    newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][0]));
                    
                    if(i ==  (routeGraphics.length-1)){
                    	if(totalPathCount == 1){
                    		newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][paths[0].length -1]));	
                    	}else {
                    		newGeometryPath.push(CoordinateUtils.stringToCoords(paths[1][paths[1].length -1]));	
                    	}                    	
                    }
                }
            }
            console.log(newGeometryPath);
            return newGeometryPath;
        }

    };*/
    

    constructorFn.getGeometryFromGraphics = function(routeGraphics, routeId) {
        if (routeGraphics != undefined) {
            var newGeometryPath = [];
            var subPaths;
            var totalPathCount;
            var cords = [];
            for (var i = 0; i < routeGraphics.length; i++) {
                paths = routeGraphics[i].geometry.paths;
                if (paths != undefined) {
                    totalPathCount = paths.length;
                    
                    if(!ESRIHelper.getEsriGraphicManager().isGraphicInReverseDirection(routeGraphics[i], routeId)){
                    	newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][0]));
                    }else {
                    	newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][paths[0].length -1]));
                    }
                    
                    
                    if(i ==  (routeGraphics.length-1)){
                    	if(totalPathCount == 1){
                    		if(!ESRIHelper.getEsriGraphicManager().isGraphicInReverseDirection(routeGraphics[i], routeId)){
                    			newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][paths[0].length -1]));
                            }else {
                            	newGeometryPath.push(CoordinateUtils.stringToCoords(paths[0][0]));
                            }	
                    	}else {
                    		if(!ESRIHelper.getEsriGraphicManager().isGraphicInReverseDirection(routeGraphics[i], routeId)){
                    			newGeometryPath.push(CoordinateUtils.stringToCoords(paths[1][paths[1].length -1]));
                            }else {
                            	newGeometryPath.push(CoordinateUtils.stringToCoords(paths[1][0]));
                            }	
                    	}                    	
                    }
                }
            }
            console.log(newGeometryPath);
            return newGeometryPath;
        }

    };

    return constructorFn;
})();

var CoordinateUtils = (function() {
    function constructorFn() {

    };

    constructorFn.isUnique = function(coordinates, coord) {
        var isUnique = true;
        $.each(coordinates, function(i, coordinate) {
            if (coordinate[0] == coord[0] && coordinate[1] == coord[1]) {
                isUnique = false;
            }
            
            if (coordinate[0] == coord[0] +360 && coordinate[1] == coord[1]) {
                isUnique = false;
            }
            
            if (coordinate[0] == coord[0] - 360 && coordinate[1] == coord[1]) {
                isUnique = false;
            }
        });

        return isUnique;
    };

    constructorFn.validateCoordinatesNow = function(startPoint, endPoint) {

        if (startPoint != undefined && endPoint != undefined) {
            var coordinates = [];
            var flag1 = startPoint.x < 0 && endPoint.x > 0;
            var flag2 = startPoint.x > 0 && endPoint.x < 0;
            var flag3 = startPoint.x < 0 && endPoint.x < 0;
            var flag4 = startPoint.x > 0 && startPoint.x < 90 && (endPoint.x < 0 && endPoint.x > -90 || endPoint.x > 0 && endPoint.x < 90);
            var flag5 = endPoint.x > 0 && endPoint.x < 90 && (startPoint.x < 0 && startPoint.x > -90 || startPoint.x > 0 && startPoint.x < 90);

            var start = startPoint.x;;
            var end = endPoint.x;

            if (flag1 || flag4) {
                //start = startPoint.x + 360;
            }

            if (flag2 || flag5) {
               // end = endPoint.x + 360;
            }

            if (flag3) {
                //start = startPoint.x + 360;
                //end = endPoint.x + 360;
            }
            startPoint.x = start;
            endPoint.x = end;
            coordinates[0] = startPoint;
            coordinates[1] = endPoint;

            return coordinates;
        }
    };


    constructorFn.coordsInDifferentQuadrants = function(coordinates) {
        for (var i = 0; i < coordinates.length; i++) {
            if (!(coordinates[i].x >= 0 && coordinates[i].x < 445)) {
                return true;
            }
        }
        return false;
    };

    constructorFn.validateCoordinatesByQuadrant = function(coordinates) {
        if (coordinates != null) {

            if (!this.coordsInDifferentQuadrants(coordinates)) {
                return coordinates;
            }
            for (var i = 0; i < coordinates.length; i++) {
                for (var j = 0; j < coordinates.length; j++) {
                    // System.out.println(o[i]-o[j]);
                    if (coordinates[i].x - coordinates[j].x < 0) {
                        if (coordinates[i].x - coordinates[j].x > -359) {
                            if (coordinates[i].x < coordinates[j].x && coordinates[i].x <= 340) {
                                coordinates[i].x = 359 + coordinates[i].x;
                            } else if (coordinates[i].x > coordinates[j].x && coordinates[j].x <= 340) {
                                coordinates[j].x = 359 + coordinates[j].x;
                            }

                        }

                    } else if (coordinates[i].x - coordinates[j].x > 0) {
                        if (coordinates[i].x - coordinates[j].x > 300) {
                            if (coordinates[i].x < coordinates[j].x && coordinates[i].x <= 340) {
                                coordinates[i].x = 359 + coordinates[i].x;
                            } else if (coordinates[i].x > coordinates[j].x && coordinates[j].x <= 340) {
                                coordinates[j].x = 359 + coordinates[j].x;
                            }
                        }
                    }
                }

            }
        }
        return coordinates;
    };


    constructorFn.stringToCoords = function(coordStrAry) {
        if (coordStrAry != undefined) {
            var coords = [];
            coords[0] = parseFloat(coordStrAry[0]);
            coords[1] = parseFloat(coordStrAry[1]);
            return coords;
        }
    };
    
    constructorFn.isNegativeCoords = function(coordStrAry) {
        if (coordStrAry != undefined) {
           return parseFloat(coordStrAry[0]) < 0;
        }
    };
    
    constructorFn.areAllNegativeCoords = function(coordStrAry) {
        if (coordStrAry != undefined) {
           return parseFloat(coordStrAry[0]) < 0;
        }
    };
    
    constructorFn.sqr = function (x) {
        return x * x;
    };
    
    constructorFn.dist2 = function (v, w) {
        return this.sqr(v.x - w.x) + this.sqr(v.y - w.y);
    };
    
    constructorFn.distToSegmentSquared = function (p, v, w) {
        var l2 = this.dist2(v, w);
        if (l2 == 0) return this.dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) return this.dist2(p, v);
        if (t > 1) return this.dist2(p, w);
        return this.dist2(p, {
            x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y)
        });
    };
    
    constructorFn.distToSegment = function (p, v, w) {
        return Math.sqrt(this.distToSegmentSquared(p, v, w));
    };
    
    constructorFn.calculateBearing = function (ptA, ptB) {
        var startLong, endLong, startLat, endLat;
        startLong = ptA.x.toRadians();
        endLong = ptB.x.toRadians();
        startLat = ptA.y.toRadians();
        endLat = ptB.y.toRadians();

        var dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0)
                dLong = -(2.0 * Math.PI - dLong);
            else
                dLong = (2.0 * Math.PI + dLong);
        }

        return ((Math.atan2(dLong, dPhi)).toDegrees() + 360.0) % 360.0;
    };

    constructorFn.hasMinimumPoints = function (geometry, count) {
        if(count  == undefined){
            count = 12;
        }
        if(geometry != undefined){
            var coordsArray = geometry.paths!= undefined?geometry.paths[0]: [];
            if(coordsArray != undefined && coordsArray.length > count){
                return true;
            }
        }

        return false;
    };

    constructorFn.getArrowAngle= function (ptA, ptB) {
        var fromLat, fromLon, destLat, destLon;
        fromLat = ptA.x.toRadians();
        destLat = ptB.x.toRadians();
        fromLon = ptA.y.toRadians();
        destLon = ptB.y.toRadians();

        var lat1 = fromLat.toRadians();
        var lat2 = destLat.toRadians();
        var dLon = (destLon - fromLon).toRadians();
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        return ((Math.atan2(y, x)).toDegrees() + 360.0) % 360.0;
    };

    constructorFn.computeAngle= function (p1, p2) {
        var rise = p2.y - p1.y;
        var run = p2.x - p1.x;
        return  (180/Math.PI) * Math.atan2(run, rise);
    };



    constructorFn.areSameCoordinates= function (startPoint, endPoint) {

        if(startPoint != undefined && endPoint != undefined){
            if((startPoint.x == endPoint.x) && (startPoint.y == endPoint.y)){
                return true;
            }
        }
        return false;
    };

    return constructorFn;
})();

var SymbolHelper = (function() {
    function constructorFn() {

    };

    return constructorFn;
})();