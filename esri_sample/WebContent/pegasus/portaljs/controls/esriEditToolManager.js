/**
 * Module design pattern
 * ESRI Edit tool manager
 * @param mapDiv - div id  for map initialization...
 * @param options	- custom map options..
 * @param statusDiv - loading status information...
 * @returns {ESRIEditToolManager}
 */
define(["esri/geometry/geodesicUtils", "esri/map", "esri/toolbars/edit", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/dijit/InfoWindowLite", "esri/dijit/Popup", "esri/domUtils", "esri/tasks/PrintTemplate", "esri/dijit/Print", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-construct", "dojo/_base/event"], function(geodesicUtils, Map, Edit, Tiled, GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, Extent, webMercatorUtils, InfoTemplate, InfoWindowLite, Popup, domUtils, PrintTemplate, Print, PrintTask, PrintParameters, Menu, MenuItem, MenuSeparator, on, connect, registry, declare, lang, dom, domConstruct, event) {

    var SingletonClass = declare(null, {
        PREVIOUS_LEG: 1,
        NEXT_LEG: 2,

        constructor: function() {
            this.editToolbar;

            //graphic layer initialization
            this.initializeLayer();
            //add leg functionality
            this.legs = [];
            this.startPointGraphic;
            this.endPointGraphic;
            this.selectedRouteLocations = {};
            this.selectedRouteGraphics = {};
            this.isLegAdded = false;
            this.isLocationSelected = false;
            //leg constants
            this.isPreviousOrNextLeg = this.NEXT_LEG;
            this.tempLegId = 1;
        },

        getIsPreviousOrNextLeg: function() {
            return this.isPreviousOrNextLeg;
        },

        getRouteId: function() {
            return SkdMxHelper.getMapOpeationManager().getRouteId();
        },

        initializeLayer: function() {
            this.editGraphicLayer = new GraphicsLayer();
            //adding the layer to esri map
            esriMap.addMapLayer(this.editGraphicLayer);

            this.createPointLayer = new GraphicsLayer();
            esriMap.addMapLayer(this.createPointLayer);

            this.createPolylineLayer = new GraphicsLayer();
            esriMap.addMapLayer(this.createPolylineLayer);
            //add event listener
            on(this.createPolylineLayer, "graphic-add", this.addLegListener);
        },

        addLegListener: function(event) {
            if (ESRIHelper.getEditToolManager().getRouteId() != undefined) {
                var graphic = event.graphic;
                var legDetail;
                if (graphic != undefined) {
                    //try{
                    legDetail = (graphic["data"]["attributes"]["LegDetails"][graphic.data.attributes.LegDetails.length - 1]); //need to conform
                    var ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
                    var selectedLocations = ESRIHelper.getEditToolManager().selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()];
                    if (selectedLocations == undefined) {
                        ESRIHelper.getEditToolManager().selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()] = [];
                        selectedLocations = ESRIHelper.getEditToolManager().selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()];
                        //selectedLocations.splice(0, 0, ripLegDetail["ORIGIN"]);
                    }

                    if (legDetail != undefined) {
                        //updated to indicate if its a previous leg
                        if (ripLegDetail["MV_NUM_SEQ"] <= 1 || ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg()  == ESRIHelper.getEditToolManager().PREVIOUS_LEG) {
                            SkdMxHelper.getSkdMxGridComponentManager().addLeg("MV_NUM_SEQ", ripLegDetail["ROUTE_ID"], parent.OPERATION_CD_ADD, ripLegDetail, 0);
                            //if its the first leg that is added by using create route popup
                            if(selectedLocations.length <= 1){
                                selectedLocations.splice(0, 0, ripLegDetail["ORIGIN"]);
                                selectedLocations.push(ripLegDetail["DESTINATION"]);
                            }else{
                                selectedLocations.splice(0, 0, ripLegDetail["ORIGIN"]);
                            }
                        } else {
                            SkdMxHelper.getSkdMxGridComponentManager().addLeg("MV_NUM_SEQ", ripLegDetail["ROUTE_ID"], parent.OPERATION_CD_ADD, ripLegDetail);
                            //                            SkdMxHelper.getSkdMxGridComponentManager().addNextLeg(ripLegDetail["ROUTE_ID"], legDetail["previousLegId"], ripLegDetail, graphic.data);
                            selectedLocations.push(ripLegDetail["DESTINATION"]);
                        }
                    }
                    LoggerUtils.console("====================SELECTED LOCATIONS===================================================");
                    LoggerUtils.console(selectedLocations);
                    LoggerUtils.console("====================SELECTED LOCATIONS===================================================");
                }
            }
        },

        convertToRIPLegObject: function(legDetail) {
            if (legDetail != undefined) {
                var ripLegDetail = getLegObj("F");
                ripLegDetail["ROUTE_ID"] = legDetail["routeId"];
                ripLegDetail["MV_NUM_SEQ"] = legDetail["mvNbrSeq"];
                ripLegDetail["ORIGIN"] = legDetail["origin"];;
                ripLegDetail["DESTINATION"] = legDetail["destination"];
                ripLegDetail["LEG_ID"] = ripLegDetail["MV_NUM_SEQ"];

                return ripLegDetail;
            }
        },

/*isAddLeg: function(){
        	return this.addLeg;
        },
        
        isAddRoute: function(){
        	return this.addRoute;
        },
        
        setAddLeg: function(isAddLeg){
        	this.addLeg =  isAddLeg;
        	if(!this.addLeg){
        		this.deactivateAddLegHandler();
        	}else {
        		this.editGraphicLayer.clear();
        	}
        	this.deActivate();
        },
        
        setAddRoute: function(isAddRoute){
        	this.addRoute=  isAddRoute;
        	if(!this.addRoute){
        		this.deactivateAddRouteHandler();
        	}else{
        		this.editGraphicLayer.clear();
        	}
        	
        	this.setAddLeg(false);
        },*/

        validateAddLegOperationNow: function() {
            if (SkdMxHelper.getMapOpeationManager().isNewRoute()) {
                ESRIHelper.getStageManager().beforeOpeartionChangeListener(this.getRouteId());
                var graphic = ESRIHelper.getStageManager().getGraphic(this.getRouteId());
                if(graphic != undefined){
                    //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
                    this.addEditGraphic(ESRIHelper.getEsriGraphicManager().getGraphic(graphic.geometry, graphic.symbol));
                	//this.editGraphicLayer.add(ESRIHelper.getEsriGraphicManager().getGraphic(graphic.geometry, graphic.symbol));
                }                
            }
            this.resetAddLegOperation();
            this.deActivate();
            this.clearAddFuncLayers();
        },

        validateDeleteOperationNow: function() {
            ESRIHelper.getStageManager().beforeOpeartionChangeListener(this.getRouteId());
            var graphic = ESRIHelper.getStageManager().getGraphic(this.getRouteId());
            //avoid adding the graphic from stagging and try to add only
            // when there is no graphic in the dit layers...
            if(graphic != undefined && this.getFirstEditGraphicFromEditLayer() == undefined){
                //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
                this.addEditGraphic(ESRIHelper.getEsriGraphicManager().getGraphic(graphic.geometry, graphic.symbol));
            	//this.editGraphicLayer.add(ESRIHelper.getEsriGraphicManager().getGraphic(graphic.geometry, graphic.symbol));
            }            
            this.resetAddLegOperation();
            this.deActivate();
            this.clearAddFuncLayers();
            SkdMxHelper.getMapOpeationManager().enableDeleteMode();
            var polylineGraphic = this.getFirstEditGraphicFromEditLayer();
            if (polylineGraphic != undefined) {
                this.activateEditToolbar(polylineGraphic);
            }

        },

        validateSelectRouteOperationNow: function() {
        	if(SkdMxHelper.getDrawer().isRouteSelected()){
        		 var generatedGraphic = this.convertToSingleGraphic();
                 var polylineGraphic = this.getFirstEditGraphicFromEditLayer();
                 this.clearAddFuncLayers();
                 if (polylineGraphic != undefined) {
                     this.activateEditToolbar(polylineGraphic);
                 }else if(generatedGraphic != undefined){
                     //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
                    this.addEditGraphic(generatedGraphic);
                 	//this.editGraphicLayer.add(generatedGraphic);
                 	this.activateEditToolbar(generatedGraphic);
                 }
        	}           
        },

        convertToSingleGraphic: function(isClearLayers) {
            var polylineGraphic = this.getFirstEditGraphicFromEditLayer();
            if (this.editGraphicLayer != undefined && this.isPolylineDrawn()) {
                if (polylineGraphic != undefined) {
                    var geometry = polylineGraphic.geometry;
                    var pointGraphics = this.getPointLayerGraphics();
                    var pointGraphic;
                    var coords;
                    for (var i = 0; i < pointGraphics.length; i++) {
                    	if(i==0){
                    		continue;
                    	}
                    	pointGraphic = pointGraphics[i];
                    	if(pointGraphic["isUsed"]){
                    		continue;
                    	}
                        if (pointGraphic.geometry != undefined) {
                        	coords = ESRIHelper.getVirtualGraphicManager().validateCoordinatesNow(pointGraphic.geometry);
                            if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.NEXT_LEG) {
                                geometry.insertPoint(0, this.getEditGraphicPathsLength(), new Point(coords.x, coords.y));
                            } else {
                                geometry.insertPoint(0, 0, new Point(coords.x, coords.y));
                            }
                            //convert the graphic to geodesic line
                            polylineGraphic.geometry = ESRIHelper.getEsriGraphicManager().toGeodesicUtils(geometry);
                        }
                        pointGraphics[i]["isUsed"] = true;
                    }
                    this.refreshLayer();
                    this.refreshEditToolbar();
                } else {
                    var pointGraphics = this.getPointLayerGraphics();
                    if (pointGraphics != undefined) {
                        polylineGraphic = ESRIHelper.getEsriGraphicManager().getPolylineGraphic(pointGraphics);
                        //convert the graphic to geodesic line
                        polylineGraphic.geometry  = ESRIHelper.getEsriGraphicManager().toGeodesicUtils(polylineGraphic.geometry);
                        for (var i = 0; i < pointGraphics.length; i++) {
                        	pointGraphics[i]["isUsed"] = true;
                        }
                       
                        if(!isClearLayers || isClearLayers == undefined){
                        	this.clearAddFuncLayers();
                        }
                        
                    }
                }
            }

            return polylineGraphic;
        },

        refreshLayer: function() {
            if (this.editGraphicLayer != undefined) {
                this.editGraphicLayer.refresh();
            }
        },


        refreshEditToolbar: function() {
            if (this.editToolbar != undefined) {
                this.editToolbar.refresh();
            }
        },



        getEditGraphicPathsLength: function() {
            var editGraphic = this.getFirstEditGraphicFromEditLayer();
            if (editGraphic != undefined) {
                var path0 = editGraphic.geometry.paths[0];
                if (path0 != undefined) {
                    return path0.length;
                }
            }
        },

        isPolylineDrawn: function() {
            var pointGraphics = this.getPointLayerGraphics();
            if (pointGraphics != undefined && pointGraphics.length >= 2) {
                return true;
            }

            return false;
        },

        getFirstEditGraphicFromEditLayer: function() {
            if (this.editGraphicLayer != undefined && this.editGraphicLayer.graphics != undefined) {
                return this.editGraphicLayer.graphics[0];
            }
        },

        getPointGeometry: function(graphic) {
            if (graphic != undefined) {
                return graphic.geometry;
            }
        },

        getPointLayerGraphics: function() {
            if (this.createPointLayer != undefined) {
               return this.createPointLayer.graphics;
            }
        },

        validateAddRouteOperationNow: function(routeId) {
            //SkdMxHelper.getMapOpeationManager().setRouteId(SkdMxHelper.getMapOpeationManager().generateRandomRouteId(), true);
        	var tempRouteId;
        	if(SkdMxHelper.getMapOpeationManager().isDuplicateRoute()){
        		tempRouteId = lang.clone(SkdMxHelper.getMapOpeationManager().getRouteId());        		
        	}
            SkdMxHelper.getMapOpeationManager().setRouteId(routeId, true);                     
            this.startPointGraphic = undefined;
            this.endPointGraphic = undefined;
            this.deActivate();
            this.clearAllLayers();
            SkdMxHelper.getMapOpeationManager().setRouteId(this.getRouteId(), true);
            this.isPreviousOrNextLeg = this.NEXT_LEG;
            this.tempLegId = 1;
            if(SkdMxHelper.getMapOpeationManager().isDuplicateRoute()){
            	ESRIHelper.getStageManager().duplicateRouteHandler(tempRouteId , routeId);
        	} 
        },

        validateCancelRouteOperationNow: function(isClear) {
        	this.clearLayers(isClear);
            this.deActivate();
            this.resetAddLegOperation();
            SkdMxHelper.getMapOpeationManager().disableUpdateMode();
            SkdMxHelper.getMapOpeationManager().disableDeleteMode();
            this.selectedRouteLocations[this.getRouteId()] = [];
            this.startPointGraphic = undefined;
            this.endPointGraphic = undefined;
            this.tempLegId = 1;
            if(this.getRouteGraphics() != undefined && this.getRouteGraphics()[this.getRouteId()]){
            	delete this.getRouteGraphics()[this.getRouteId()];
            }
            if(this.selectedRouteGraphics != undefined && this.selectedRouteGraphics[this.getRouteId()]){
            	delete this.selectedRouteGraphics[this.getRouteId()];
            }
            LoggerUtils.console("==============Deleted Object");
            LoggerUtils.console(this.selectedRouteGraphics);
            ESRIHelper.getStageManager().removeGraphicByRouteId(this.getRouteId());
            SkdMxHelper.getMapOpeationManager().setRouteId(undefined);
        },
        
        clearLayers: function(isClear) {
        	if(isClear){
        		this.clearAllLayers();
        	}else {
        		this.clearPointLayer();
        	}
        },
        
        clearAddFuncLayers: function() {
            this.deActivate();
            this.createPointLayer.clear();
            this.createPolylineLayer.clear();
        },

        clearAllLayers: function() {
            this.editGraphicLayer.clear();
            this.createPointLayer.clear();
            this.createPolylineLayer.clear();
        },
        
        clearPointLayer: function() {            
            this.createPointLayer.clear();
        },
        
        hideEditToolLayer: function() {
        	this.deActivate();
            this.editGraphicLayer.hide();
            this.createPointLayer.hide();
            this.createPolylineLayer.hide();
        },
        showEditToolLayer: function() {
        	this.activate(ESRIHelper.getEditToolManager().getRouteId());
            this.editGraphicLayer.show();
            this.createPointLayer.show();
            this.createPolylineLayer.show();
        },
        activateAddLegHandler: function(event) {
            if (SkdMxHelper.getMapOpeationManager().isAddLeg() && (this.isValidLocationToAddLeg(event.graphic) || this.isLocationSelected)) {
                this.drawPointsAndAddLeg(event.graphic);
            }
        },

        activateAddRouteHandler: function(event) {
            if (SkdMxHelper.getMapOpeationManager().isAddRoute() && (this.editGraphicLayer.graphics == undefined || (this.editGraphicLayer.graphics != undefined && this.editGraphicLayer.graphics.length == 0))) {
                this.drawPointsAndAddLeg(event.graphic);
            }
        },

        drawPointsAndAddLeg: function(graphic) {
            if (graphic != undefined) {
                var point = this.getGraphic(graphic, true);
                if (this.startPointGraphic == undefined) {
                    this.startPointGraphic = point;
                    this.isLocationSelected = true;
                } else if (this.endPointGraphic == undefined) {
                    this.endPointGraphic = point;
                    //                    this.drawLeg();
                    if (SkdMxHelper.getMapOpeationManager().getRouteId() != undefined) {
                        this.drawLeg();
                        if (this.startPointGraphic != undefined) {
                            this.startPointGraphic = this.endPointGraphic;
                            this.endPointGraphic = undefined;
                        }
                    } else {
                        SkdMxHelper.getSkdMxGridComponentManager().createRoute(parent.scheduleMaintenananceSeletedMenu);
                    }

                }
            }
        },

        isValidLocationToAddLeg: function(graphic) {
            if (SkdMxHelper.getMapOpeationManager().isAddLeg() && this.isValidLocationGraphic(graphic) && this.selectedRouteLocations[this.getRouteId()] != undefined) {
                var locCdActual = this.getLocationName(graphic);
                if (locCdActual != undefined && (locCdActual == this.selectedRouteLocations[this.getRouteId()][0] || locCdActual == this.selectedRouteLocations[this.getRouteId()][this.selectedRouteLocations[this.getRouteId()].length - 1])) {
                    if (locCdActual == this.selectedRouteLocations[this.getRouteId()][0]) {
                        this.isPreviousOrNextLeg = this.PREVIOUS_LEG;
                    } else if (locCdActual == this.selectedRouteLocations[this.getRouteId()][this.selectedRouteLocations[this.getRouteId()].length - 1]) {
                        this.isPreviousOrNextLeg = this.NEXT_LEG;
                    }
                    return true;
                }
            }
            return false;
        },

        getRouteGraphics: function() {
            if (this.getRouteId() != undefined) {
                if (this.selectedRouteGraphics[this.getRouteId()]) {
                    return this.selectedRouteGraphics[this.getRouteId()];
                }
            }
        },


        isValidLocationGraphic: function(graphic) {
            if (graphic != undefined && graphic.data != undefined && graphic.data.attributes != undefined) {
                return true;
            }
            return false;
        },

        getGraphic: function(graphic, isClone) {
            if (graphic != undefined) {
                var point = ESRIHelper.getEsriGraphicManager().getPictureGraphic(graphic);
                point = this.copyProperties("location", graphic, point);
                this.legs.push(point);
                this.addGraphic(point, 'location');
                return point;
            }
        },

        copyProperties: function(type, sourceObj, targetObj) {

            switch (type) {
            case "location":
                targetObj.data = sourceObj.data;
                break;
            case "leg":
                targetObj.data = sourceObj.data;
                break;
            }

            return targetObj;

        },

        getLegCoordinates: function() {
            return [[this.startCoords.x, this.startCoords.y], [this.endCoords.x, this.endCoords.y]];
        },

        drawLeg: function() {
            if (this.startPointGraphic != undefined && this.endPointGraphic != undefined) {
                var graphic = ESRIHelper.getEsriGraphicManager().getLineGraphic(this.startPointGraphic, this.endPointGraphic);
                var cloneLastGraphicData;
                LoggerUtils.console(this.getRouteGraphics());
                if (this.getRouteGraphics() != undefined && this.getRouteGraphics().length > 0) {
                    if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.PREVIOUS_LEG && !this.isLocationSelected) {
                        cloneLastGraphicData = lang.clone(this.getRouteGraphics()[0].data);
                    } else if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.NEXT_LEG && !this.isLocationSelected) {
                        cloneLastGraphicData = lang.clone(this.getRouteGraphics()[this.getRouteGraphics().length - 1].data);
                    } else if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.PREVIOUS_LEG && this.isLocationSelected) {
                        cloneLastGraphicData = lang.clone(this.getRouteGraphics()[0].data);
                    } else if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.NEXT_LEG && this.isLocationSelected) {
                        cloneLastGraphicData = lang.clone(this.getRouteGraphics()[this.getRouteGraphics().length - 1].data);
                    }

                } else if (SkdMxHelper.getMapOpeationManager().isNewRoute()) {
                    this.selectedRouteGraphics[this.getRouteId()] = [];
                }
                graphic["data"] = this.updateGraphicData(cloneLastGraphicData, ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.NEXT_LEG, true);
                if (SkdMxHelper.getMapOpeationManager().isNewRoute()) {
                    // this.selectedRouteGraphics[this.getRouteId()].push(graphic);
                }

                this.addGraphic(graphic, 'polyline');
                if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.PREVIOUS_LEG) {
                    (this.getRouteGraphics()).splice(0, 0, {data: graphic.data, mvNbrSeq: graphic.mvNbrSeq});
                } else if (ESRIHelper.getEditToolManager().getIsPreviousOrNextLeg() == this.NEXT_LEG) {
                    if (this.selectedRouteGraphics[this.getRouteId()] == undefined) {
                        this.selectedRouteGraphics[this.getRouteId()] = [];
                    }
                    this.getRouteGraphics().push({data: graphic.data, mvNbrSeq: graphic.mvNbrSeq});
                }
                
                ESRIHelper.getStageManager().updateGraphicInCreateOrAddMode(this.getRouteId(), true);
            }

        },
        
        cloneObject: function(object){
        	if(object != undefined){
        		return lang.clone(object);
        	}        	 
        },
        
        duplicateRouteCallbackHandler: function(options, routeId){
        	ESRIHelper.getEditToolManager().duplicateRouteDetails(options.routeId, routeId);        	        	
        	SkdMxHelper.getSkdMxGridComponentManager().updateSelectionByRouteId(routeId);
        },
        
        duplicateRouteDetails: function(fromRouteId, routeId){
        	var routeGraphics; 
        	if(fromRouteId != undefined){
        		//route graphcis
        		routeGraphics = this.cloneObject(this.selectedRouteGraphics[fromRouteId]);
        		this.selectedRouteGraphics[routeId] = LegDetailGraphicUtils.duplicateRouteDetails(fromRouteId, routeId, routeGraphics);
        		LoggerUtils.console(this.selectedRouteGraphics);
        		//route locations
        		this.selectedRouteLocations[routeId] = this.cloneObject(this.selectedRouteLocations[fromRouteId]);
        	}        	
        },

        updateGraphicData: function(cloneLastGraphicData, isNextLeg, isNewLeg) {
            if (this.startPointGraphic != undefined && this.endPointGraphic) {
                if (cloneLastGraphicData != undefined && cloneLastGraphicData.attributes != undefined) {
                    var legDetail = this.getLegDetailObj(this.getRouteId(), cloneLastGraphicData, isNextLeg);
                    if (isNextLeg) {
                    	this.setDestinationByGraphic(this.getLocationName(this.endPointGraphic), cloneLastGraphicData);
                    	this.setOriginByGraphic(this.getLocationName(this.startPointGraphic), cloneLastGraphicData);
                        legDetail["destinationAP"] = this.getLocationName(this.endPointGraphic);
                        legDetail["destination"] = this.getLocationName(this.endPointGraphic);
                        legDetail["origin"] = this.getLocationName(this.startPointGraphic);
                        legDetail["originAP"] = this.getLocationName(this.startPointGraphic);
                        legDetail["mvNbrSeq"] = parseInt(this.getLegDetailAttribute("mvNbrSeq", legDetail)) + 1;
                        if (legDetail["previousLegId"] == undefined) {
                            legDetail["previousLegId"] = this.getLegDetailAttribute("legId", legDetail); // (legDetail)["legId"];
                        } else {
                            legDetail["previousLegId"] = this.getLegDetailAttribute("mvNbrSeq", legDetail) - 1;
                        }

                        cloneLastGraphicData["attributes"]["LegDetails"] = [legDetail];
                    } else {
                    	this.setDestinationByGraphic(this.getLocationName(this.startPointGraphic), cloneLastGraphicData);
                    	this.setOriginByGraphic(this.getLocationName(this.endPointGraphic), cloneLastGraphicData);                       
                        (legDetail)["origin"] = this.getLocationName(this.endPointGraphic);
                        (legDetail)["originAP"] = this.getLocationName(this.endPointGraphic);
                        (legDetail)["destination"] = this.getLocationName(this.startPointGraphic);
                        (legDetail)["destinationAP"] = this.getLocationName(this.startPointGraphic);
                        (legDetail)["mvNbrSeq"] = parseInt(this.getLegDetailAttribute("mvNbrSeq", legDetail)) - 1;
                        cloneLastGraphicData["attributes"]["LegDetails"] = [legDetail];
                        if ((legDetail)["previousLegId"] == undefined) {
                            (legDetail)["previousLegId"] = this.getLegDetailAttribute("legId", legDetail);
                        } else {
                            (legDetail)["previousLegId"] = this.getLegDetailAttribute("mvNbrSeq", legDetail) + 1;
                        }
                    }(legDetail)["routeId"] = this.getRouteId();
                } else if (isNewLeg != undefined && isNewLeg) {
                    cloneLastGraphicData = this.getNewLegDetailsObj();
                    var legDetail = (cloneLastGraphicData["attributes"]["LegDetails"])[0];
                    if (isNextLeg) {
                        if (legDetail["previousLegId"] == undefined) {
                            legDetail["previousLegId"] = this.getLegDetailAttribute("legId", legDetail);
                        } else {
                            legDetail["previousLegId"] = (this.getLegDetailAttribute("mvNbrSeq", legDetail)) - 1;
                        }
                    } else {
                        if ((legDetail)["previousLegId"] == undefined) {
                            legDetail["previousLegId"] = this.getLegDetailAttribute("legId", legDetail);
                        } else {
                            legDetail["previousLegId"] = this.getLegDetailAttribute("mvNbrSeq", legDetail) + 1;
                        }
                    }
                    cloneLastGraphicData["attributes"]["LegDetails"] = [legDetail];
                }

                return cloneLastGraphicData;
            }
        },
        
        setDestinationByGraphic: function(destination, graphicData){
        	if(graphicData != undefined){
        		if(graphicData["attributes"]["Destination"] != undefined){
        			graphicData["attributes"]["Destination"]["locCdActual"] = this.getLocationName(this.endPointGraphic);
        		}else {
        			graphicData["attributes"]["Destination"] = []; 
        			graphicData["attributes"]["Destination"]["locCdActual"] = this.getLocationName(this.endPointGraphic);
        		}        		
        	}        	
        },
        
        setOriginByGraphic: function(destination, graphicData){
        	if(graphicData != undefined){
        		if(graphicData["attributes"]["Origin"] != undefined){
        			graphicData["attributes"]["Origin"]["locCdActual"] = this.getLocationName(this.endPointGraphic);
        		}else {
        			graphicData["attributes"]["Origin"] = []; 
        			graphicData["attributes"]["Origin"]["locCdActual"] = this.getLocationName(this.endPointGraphic);
        		}        		
        	} 
        },

        getLegDetailAttribute: function(name, legDetail) {
            switch (name) {
            case "legId":
                if (legDetail["legId"] != undefined) {
                    return legDetail["legId"];
                } else {
                    return legDetail["LEG_ID"];
                }
                break;
            case "mvNbrSeq":
                if (legDetail["mvNbrSeq"] != undefined) {
                    return legDetail["mvNbrSeq"];
                } else {
                    return legDetail["MV_NUM_SEQ"];
                }
                break;
            }
        },

        getLegDetailObj: function(routeId, cloneLastGraphicData, isNextLeg) {
            if (routeId != undefined) {
                var legDetail;
                var mvNbrSeq;
                var legDetails = (cloneLastGraphicData["attributes"]["LegDetails"]);
                if (legDetails != undefined) {
                    for (var i = 0; i < legDetails.length; i++) {
                        if (legDetails[i] == undefined) {
                            continue;
                        }
                        if (legDetails[i]["routeId"] == routeId || legDetails[i]["ROUTE_ID"] == routeId) {
                            if (isNextLeg) {
                                if (mvNbrSeq == undefined || mvNbrSeq <= this.getLegDetailAttribute("mvNbrSeq", legDetails[i])) {
                                    mvNbrSeq = this.getLegDetailAttribute("mvNbrSeq", legDetails[i]);
                                    legDetail = legDetails[i];
                                }
                            } else {
                                if (mvNbrSeq == undefined || mvNbrSeq >= this.getLegDetailAttribute("mvNbrSeq", legDetails[i])) {
                                    mvNbrSeq = this.getLegDetailAttribute("mvNbrSeq", legDetails[i]);
                                    legDetail = legDetails[i];
                                }
                            }

                        }
                    }
                }

                return legDetail;
            }

        },

        getLocationName: function(graphic) {
        	var locationName;
            if (graphic != undefined) {
                var locCd = graphic["data"]["attributes"]["locCdActual"];
                //Fdx / FDX-1292
                //SMD: 8888 Create Route Allows Mix Mode in Locations
                //=> if its a flight mode then
                if (!SkdMxHelper.getDrawer().isTruckMode() && locCd != undefined && locCd != "") {
                    return locCd;
                } else if(SkdMxHelper.getDrawer().isTruckMode() || SkdMxHelper.getMapOpeationManager().getMode() == "Truck"){
                	var facTypes =  ESRIHelper.getEsriZoomManager().getUserSelectedFacTypes(true);
                	if(facTypes != undefined && facTypes.length > 0){
                		locationName = this.validateAndGetLocationNow(facTypes, graphic);
                	}else if($("#isDefaultConfig").is(":checked")){
                		locationName = this.validateAndGetLocationNow(ESRIHelper.getEsriZoomManager().getMapLevelFacilityTypes(), graphic);
                	}
                    //if the location name of the selected graphic is not known then get the actual  location code
                    if(locationName == undefined){
                        locationName = graphic["data"]["attributes"]["locCdActual"];
                        if(locationName != undefined && !(locationName.length > 3)){
                            locationName = undefined;
                        }
                    }
                }
            }
            if(locationName == undefined){
        		locationName =  (graphic!= undefined && graphic.data != undefined)? graphic.data.name:"";
        	}
            return locationName;
        },
        
        validateAndGetLocationNow: function(facilityTypes, placemark){
        	if(this.containsFacType(facilityTypes, "HU") && ESRIHelper.getEsriZoomManager().isFacilityType("HU", placemark)){
    			return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("HU", placemark);
    		}else if(this.containsFacType(facilityTypes, "RP") && ESRIHelper.getEsriZoomManager().isFacilityType("RP", placemark)){
    			return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("RP", placemark);
    		}else if(this.containsFacType(facilityTypes, "DL") && ESRIHelper.getEsriZoomManager().isFacilityType("DL", placemark)){
    			return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("DL", placemark);
    		}else if(this.containsFacType(facilityTypes, "MP") && ESRIHelper.getEsriZoomManager().isFacilityType("MP", placemark)){
    			return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("MP", placemark);
    		}else {
    			if(ESRIHelper.getEsriZoomManager().isFacilityType("HU", placemark)){
    				return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("HU", placemark);
    			}else if(ESRIHelper.getEsriZoomManager().isFacilityType("RP", placemark)){
    				return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("RP", placemark);
    			}else if(ESRIHelper.getEsriZoomManager().isFacilityType("DL", placemark)){
    				return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("DL", placemark);
    			}else if(ESRIHelper.getEsriZoomManager().isFacilityType("MP", placemark)){
    				return ESRIHelper.getEsriZoomManager().getLocationNameByFacType("MP", placemark);
    			} 
    		}
        },
        
        containsFacType: function(facTypes, type){
        	if(facTypes != undefined ){
        		return facTypes.indexOf(type) >= 0;
        	}
        },

        getNewLegDetailsObj: function() {
            var newTempObj = {};
            if (this.startPointGraphic != undefined && this.endPointGraphic) {
                var org = this.getLocationName(this.startPointGraphic);
                var dest = this.getLocationName(this.endPointGraphic);
                newTempObj = {
                    attributes: {
                        CubePercentage: 0,
                        Destination: {
                            byRelatedAirportId: dest,
                            cityName: dest,
                            destination: true,
                            hub: false,
                            locCd: org,
                            locCdActual: dest,
                            origin: dest,
                            transit: false
                        },
                        HasMultipleLines: false,
                        IsBothDirections: "",
                        IsFlyFeeder: "",
                        IsFlyTrunk: "",
                        IsMixedMode: "",
                        IsOther: "",
                        IsTruck: "",
                        LegDetails: this.getLegDetails(org, dest),
                        LegName: org + "-" + dest,
                        NoOfLegs: 1,
                        Origin: {
                            byRelatedAirportId: org,
                            cityName: org,
                            destination: false,
                            hub: false,
                            locCd: org,
                            locCdActual: org,
                            origin: true,
                            transit: false
                        },
                        ToolTip: "",
                        WeightPercentage: 0
                    },
                    coordinates: [],
                    id: "",
                    name: org + "-" + dest,
                    styleId: "CFT",
                    type: 2
                };
                this.tempLegId = this.tempLegId + 1;
            }
            return newTempObj;
        },
        getLegDetails: function(org, dest) {
            var routeId = this.getRouteId();
            var tempArr = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(routeId);
            if (tempArr == undefined) {
                tempArr = [];
            }
            tempArr.push({
                arrivalTime: "",
                cube: 0,
                cubePercentage: 0,
                day: "",
                departureTime: "",
                destination: dest,
                destinationAP: dest,
                equipCode: "",
                flyFeeder: false,
                flyTrunk: true,
                groundTime: "",
                iataEquipDesc: "",
                legDay: 0,
                legId: this.tempLegId,
                legStyleId: "S_CFT",
                legType: "I",
                maxCu: 0,
                maxWt: 0,
                mvNbr: "",
                mvNbrSeq: this.tempLegId != undefined ? this.tempLegId : 0,
                nextArrivalDay: "0",
                noOpDaysL: "",
                origin: org,
                originAP: org,
                other: false,
                routeEffDays: "",
                routeId: routeId,
                routeNbr: routeId,
                truck: false,
                weight: 0,
                weightPercentage: 0
            });
            return tempArr;
        },
        deactivateAddLegHandler: function() {
            SkdMxHelper.getMapOpeationManager().setAddLeg(false);
            this.resetAddLegOperation();
        },

        resetAddLegOperation: function() {
            this.legs = [];
            this.startPointGraphic = undefined;
            this.endPointGraphic = undefined;
            //this.setSelectedRoutelocations();
            this.isLegAdded = false;
            this.isLocationSelected = false;
        },

        resetDeleteLegOperation: function() {

        },

        deactivateAddRouteHandler: function() {
            SkdMxHelper.getMapOpeationManager().setAddRoute(false);
        },

        addGraphic: function(graphic, type) {
            switch (type) {
            case "location":
                this.createPointLayer.add(graphic);
                break;
            case "polyline":
                this.createPolylineLayer.add(graphic);
                break;
            default:
                //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
                this.addEditGraphic(graphic);
               // this.editGraphicLayer.add(graphic);
            }
        },


        modifyRouteHandler: function(routeId) {
            var editToolbarComponent = this;
            if (routeId != undefined) {
                this.setRouteId(routeId);
                this.setSelectedRoutelocations();
                this.activate(routeId);
            }
        },

        setRouteId: function(routeId) {
            SkdMxHelper.getMapOpeationManager().setRouteId(routeId);
        },

        setSelectedRoutelocations: function() {
            if (this.getRouteId() != undefined) {
                var selectedLocations = this.selectedRouteLocations[this.getRouteId()];
                if (selectedLocations == undefined || selectedLocations.length == 0) {
                    this.selectedRouteLocations[this.getRouteId()] = ESRIHelper.getEsriGraphicManager().getAllLocationsbyRouteId(this.getRouteId());
                    this.selectedRouteGraphics[this.getRouteId()] = ESRIHelper.getEsriGraphicManager().getLaneOrLegGraphicsByIdCloned(ESRIHelper.getEditToolManager().getRouteId());
                }
            }
        },

        activate: function(routeId) {
            LoggerUtils.console("Activate [" + routeId + "]");
            var editToolbarComponent = this;
            if (routeId != undefined) {
                this.initializeEditTool();
                var routeGraphic = this.getSelectedRouteGraphic(routeId);
                if(routeGraphic != undefined){
                    //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
                	this.addEditGraphic(routeGraphic);
                	this.activateEditToolbar(routeGraphic);
                }

            }
        },

        //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
        addEditGraphic: function(routeGraphic){
            if(routeGraphic != undefined){
                this.editGraphicLayer.clear();
                this.editGraphicLayer.add(routeGraphic);
            }
        },

        initializeEditTool: function() {
            if (this.editToolbar == undefined) {
                LoggerUtils.console("initializeEditTool");
                this.editToolbar = ESRIHelper.getEsrimap().getEditTool();

                this.editToolbar.on("vertex-move-start", function(event) {
                    LoggerUtils.console("vertex-move-start");
                    ESRIHelper.getVirtualGraphicManager().vertexMoveStartListener(event);

                });

                this.editToolbar.on("vertex-move-stop", function(event) {
                    LoggerUtils.console("vertex-move-stop");
                    if (!SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                        ESRIHelper.getVirtualGraphicManager().vertexMoveStopListener(event);
                    }
                });

                this.editToolbar.on("vertex-delete", function(event) {
                    LoggerUtils.console("vertex-delete");
                    if (SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                        ESRIHelper.getVirtualGraphicManager().vertexDeleteListener(event);
                    }
                    ESRIHelper.getEditToolManager().refreshLayer();
                    ESRIHelper.getEditToolManager().refreshEditToolbar();
                });

                this.editToolbar.on("vertex-add", function(event) {
                    LoggerUtils.console("vertex-add");
                    if (!SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                        ESRIHelper.getVirtualGraphicManager().vertexAddListener(event);
                    }
                });
                
                this.editToolbar.on("vertex-mouse-over", function(event) {
                    ESRIHelper.getVirtualGraphicManager().vertexMouseOverListener(event);
                });
                
                this.editToolbar.on("vertex-mouse-out", function(event) {
                    ESRIHelper.getVirtualGraphicManager().vertexMouseOutListener(event);
                });
            }
        },

        getSelectedRouteGraphic: function(routeId) {
            if (routeId != undefined) {
                if (this.isCurrentSelectedRoute(routeId)) {
                    LoggerUtils.console("isCurrentSelectedRoute");
                    var stagedGraphic = ESRIHelper.getStageManager().getGraphic(routeId);
                    if (stagedGraphic != undefined) {
                        return ESRIHelper.getEsriGraphicManager().getGraphic(stagedGraphic.geometry, stagedGraphic.symbol);
                    }
                }
                LoggerUtils.console("newly selected route");
                return ESRIHelper.getEsriGraphicManager().getSingleGraphicbyRouteId(routeId);
            }
        },

        activateEditToolbar: function(graphic) {
            if (graphic != undefined) {
                this.initializeEditTool();
                if (SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                    SkdMxHelper.getMapOpeationManager().enableDeleteMode();
                } else {
                    SkdMxHelper.getMapOpeationManager().enableUpdateMode();
                }
                this.invalidateEditToolbar(graphic);
            }

            this.changeGraphicStyles();
        },

        invalidateEditToolbar: function(graphic){
            this.editToolbar.activate(this.getEditToolMode(), graphic, this.getEditToolOptions());
        },

        changeGraphicStyles: function() {
           var mapGraphics = ESRIHelper.getEsrimap().map.graphics.graphics;
            if(mapGraphics != undefined){
                var mapGraphic;
                var mapGraphicSymbol;
                var originGraphicIndex;
                var destinationGraphicIndex = 0;
                for(var i=0; i<mapGraphics.length; i++){
                    mapGraphic = mapGraphics[i];
                    if(mapGraphic.visible  && mapGraphic.symbol != undefined && mapGraphic.symbol.url != undefined){
                        if(originGraphicIndex == undefined){
                            originGraphicIndex = i;
                        }
                        destinationGraphicIndex = i;
                    }
                }
                if(destinationGraphicIndex  > 1){
                    mapGraphic = mapGraphics[originGraphicIndex];
                    mapGraphicSymbol =  lang.clone(mapGraphic.symbol);
                    mapGraphicSymbol.url = "pegasus/assets/edit/start.png";
                    mapGraphic.setSymbol(mapGraphicSymbol);

                    mapGraphic = mapGraphics[destinationGraphicIndex];
                    mapGraphicSymbol =  lang.clone(mapGraphic.symbol);
                    mapGraphicSymbol.url = "pegasus/assets/edit/end.png";
                    mapGraphic.setSymbol(mapGraphicSymbol);
                }
            }
        },

        isCurrentSelectedRoute: function(routeId) {
            if (this.selectedRouteGraphics) {
                if (this.getRouteId() == routeId) {
                    return true;
                }
            }
            return false;
        },

        isAlreadySelectedRoute: function(routeId) {
            if (this.selectedRouteGraphics) {
                var routeIds = Object.keys(this.selectedRouteGraphics);
                if (routeIds != undefined) {
                    for (var i = 0; i < routeIds.length; i++) {
                        if (routeIds[i] == routeId) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        hideAllSelectedGraphics: function() {
            if (this.selectedRouteGraphics) {
                var routeIds = Object.keys(this.selectedRouteGraphics);
                if (routeIds != undefined) {
                    for (var i = 0; i < routeIds.length; i++) {
                        this.hideGraphics(routeIds[i]);
                    }
                }
            }
        },

        hideGraphics: function(routeId) {
            if (routeId != undefined) {
                ESRIHelper.getEsriGraphicManager().hideAllRouteGraphic(routeId);
            }
        },

        getEditToolMode: function() {
            var editToolMode = 0;
            if (false) {
                editToolMode = editToolMode | Edit.MOVE;
            }
            if (SkdMxHelper.getMapOpeationManager().isModifyRoute() || SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                editToolMode = editToolMode | Edit.EDIT_VERTICES;
            }
            if (false) {
                editToolMode = editToolMode | Edit.SCALE;
            }
            if (false) {
                editToolMode = editToolMode | Edit.ROTATE;
            }
            if (false) {
                editToolMode = editToolMode | Edit.EDIT_TEXT;
            }

            return editToolMode;
        },

        getEditToolOptions: function() {
            return {
                allowAddVertices: SkdMxHelper.getMapOpeationManager().isSplitRoute(),
                allowDeleteVertices: SkdMxHelper.getMapOpeationManager().isDeleteLeg(),
                uniformScaling: false
            };
        },

        deActivate: function() {
            LoggerUtils.console("De-Activate [Edit Tool]");
            if (this.editToolbar) {
                this.editToolbar.deactivate();
                //
                SkdMxHelper.getMapOpeationManager().disableUpdateMode();
                SkdMxHelper.getMapOpeationManager().disableDeleteMode();
            }
        },

        getSelectedLocationByIndex: function(index) {
            var selectedLocations = this.selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()];
            if (selectedLocations != undefined) {
                return selectedLocations[index];
            }
        },

        vertexChangeCompleteHandler: function(operation, nearByGraphic, beforeMoveRouteDtls, afterMoveRouteDtls) {
            if (operation != undefined) {
                this.refreshLayer();
                this.refreshEditToolbar();
                var routeGraphics = this.getRouteGraphics();
                var locationName;
                var pointIndex = (afterMoveRouteDtls.vertexInfo.pointIndex);
                var vertexInfo;
                var routeGraphic;
                var cloneGraphicData;

                switch (operation) {
                case 1:
                    if ((beforeMoveRouteDtls.locationsCount - 1) == afterMoveRouteDtls.vertexInfo.pointIndex) {
                        LegDetailGraphicUtils.invokeDeleteVertexHandler("end", pointIndex - 1, this.getSelectedLocationByIndex(afterMoveRouteDtls.vertexInfo.pointIndex));
                    } else if (pointIndex == 0) {
                        LegDetailGraphicUtils.invokeDeleteVertexHandler("start", pointIndex, this.getSelectedLocationByIndex(afterMoveRouteDtls.vertexInfo.pointIndex));
                    } else if (pointIndex > 0) {
                        LegDetailGraphicUtils.invokeDeleteVertexHandler("middle", pointIndex, this.getSelectedLocationByIndex(afterMoveRouteDtls.vertexInfo.pointIndex));
                    }
                    break;
                case 2:
                    if ((afterMoveRouteDtls.locationsCount - 1) == afterMoveRouteDtls.vertexInfo.pointIndex) {
                        if (afterMoveRouteDtls.vertexInfo.pointIndex == 1) {
                            LegDetailGraphicUtils.invokeMoveVertexHandler("end", 0, nearByGraphic);
                        } else {
                            LegDetailGraphicUtils.invokeMoveVertexHandler("end", pointIndex - 1, nearByGraphic);
                        }
                    } else if (pointIndex == 0) {
                        LegDetailGraphicUtils.invokeMoveVertexHandler("start", pointIndex, nearByGraphic);
                    } else if (pointIndex > 0 && afterMoveRouteDtls.vertexInfo.pointIndex < afterMoveRouteDtls.locationsCount) {
                        LegDetailGraphicUtils.invokeMoveVertexHandler("middle", pointIndex, nearByGraphic);
                    }
                    break;
                case 3:
                    LegDetailGraphicUtils.invokeAddVertexHandler(pointIndex, nearByGraphic);
                    break;
                }
            }else{
                if(nearByGraphic == undefined ){
            		this.hideEditToolLayer();
            		this.showEditToolLayer();
            	} 
        }
        },

        cloneData: function(data) {
            if (data != undefined) {
                return lang.clone(data);
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

var LegDetailGraphicUtils = (function() {

    function constructorFn() {

    };

    constructorFn.invokeAddVertexHandler = function(pointIndex, nearByGraphic) {
        var legDetail;
        var preLegDetail;
        var nextLegDetail;
        var locationName = ESRIHelper.getEditToolManager().getLocationName(nearByGraphic);

        this.updateSelectedLocations(pointIndex, locationName, "insert");

        var legDetail = this.getLegDetailByIndex(pointIndex - 1);
        var destination = ESRIHelper.getEditToolManager().cloneData(this.getDestination(legDetail).toString());
        this.setDestination(legDetail, locationName);

        var ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
        SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex - 1, {
            oprType: "move",
            subOprType: "end",
            isTriggerDefaultService: false
        });

        var nxtLegDetail = ESRIHelper.getEditToolManager().cloneData(legDetail);
        //origin
        this.setOrigin(nxtLegDetail, locationName);
        //destination
        this.setDestination(nxtLegDetail, destination);
        //routeid
        this.setRouteId(nxtLegDetail, this.getRouteId(legDetail));
        //legid
        this.setLegId(nxtLegDetail, undefined);
        ESRIHelper.getEditToolManager().getRouteGraphics().splice(pointIndex, 0, {
            data: {
                attributes: {
                    LegDetails: [nxtLegDetail]
                }
            }
        });
        this.updateRouteSeqNbr();
        ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(nxtLegDetail);
        SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex, {
            oprType: "insert",
            subOprType: "start",
            isTriggerDefaultService: true
        });
        console.log(ESRIHelper.getEditToolManager().getRouteGraphics());
    };


    constructorFn.invokeDeleteVertexHandler = function(indexType, pointIndex, locationName) {
        var legDetail;
        var preLegDetail;
        var nextLegDetail;
        //var locationName = ESRIHelper.getEditToolManager().getLocationName(nearByGraphic);
        switch (indexType) {
        case "start":
            this.removeRouteGraphicByIndex(pointIndex, 1);
            ripLegDetail = [];
            ripLegDetail["ROUTE_ID"] = ESRIHelper.getEditToolManager().getRouteId();
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_DELETE, [], pointIndex, {
                oprType: "delete",
                subOprType: "start",
                isTriggerDefaultService: true
            });

            this.updateSelectedLocations(pointIndex, locationName, "delete");
            break;
        case "middle":
            //previous leg of the select location...
            preLegDetail = this.getLegDetailByIndex(pointIndex - 1);
            //actual leg of the selected location
            legDetail = this.getLegDetailByIndex(pointIndex);
            this.setDestination(preLegDetail, this.getDestination(legDetail));

            ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_DELETE, [], pointIndex, {
                oprType: "delete",
                subOprType: "middle",
                isTriggerDefaultService: true
            });

            this.updateSelectedLocations(pointIndex, locationName, "delete");
            this.removeRouteGraphicByIndex(pointIndex, 1);


            break;
        case "end":
            this.removeRouteGraphicByIndex(pointIndex, 1);
            ripLegDetail = [];
            ripLegDetail["ROUTE_ID"] = ESRIHelper.getEditToolManager().getRouteId();
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_DELETE, [], pointIndex, {
                oprType: "delete",
                subOprType: "end",
                isTriggerDefaultService: true
            });
            this.updateSelectedLocations(pointIndex, locationName, "delete");
            break;
        }

    };


    constructorFn.invokeMoveVertexHandler = function(indexType, pointIndex, nearByGraphic) {
        var legDetail;
        var preLegDetail;
        var nextLegDetail;
        var ripLegDetail;
        var locationName = ESRIHelper.getEditToolManager().getLocationName(nearByGraphic);
        switch (indexType) {
        case "start":
            legDetail = this.getLegDetailByIndex(pointIndex);
            this.setOrigin(legDetail, locationName);
            ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex, {
                oprType: "move",
                subOprType: "start",
                isTriggerDefaultService: true
            });
            this.updateSelectedLocations(pointIndex, locationName, "change");
            break;
        case "middle":
            preLegDetail = this.getLegDetailByIndex(pointIndex - 1);
            this.setDestination(preLegDetail, locationName);

            ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(preLegDetail);
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex - 1, {
                oprType: "move",
                subOprType: "end",
                isTriggerDefaultService: false
            });
            this.updateSelectedLocations(pointIndex, locationName, "change");

            legDetail = this.getLegDetailByIndex(pointIndex);
            this.setOrigin(legDetail, locationName);

            ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex, {
                oprType: "move",
                subOprType: "start",
                isTriggerDefaultService: true
            });

            break;
        case "end":
            legDetail = this.getLegDetailByIndex(pointIndex);
            this.setDestination(legDetail, locationName);

            ripLegDetail = ESRIHelper.getEditToolManager().convertToRIPLegObject(legDetail);
            SkdMxHelper.getSkdMxGridComponentManager().ChangeLegDestinationOrOrigin("MV_NUM_SEQ", this.getRouteIdFromLegDetail(ripLegDetail), parent.OPERATION_CD_ADD, ripLegDetail, pointIndex, {
                oprType: "move",
                subOprType: "end",
                isTriggerDefaultService: true
            });
            this.updateSelectedLocations(pointIndex + 1, locationName, "change");
            break;
        }
        console.log(ESRIHelper.getEditToolManager().getRouteGraphics());
    };
    
    constructorFn.getRouteIdFromLegDetail = function(ripLegDetail){
    	return ESRIHelper.getEditToolManager().getRouteId() != undefined?ESRIHelper.getEditToolManager().getRouteId(): ((ripLegDetail!= undefined && ripLegDetail["ROUTE_ID"]!= undefined)?ripLegDetail["ROUTE_ID"]: this.getRouteId());
    };

    constructorFn.getOrigin = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["ORIGIN"] != undefined) {
                return legDetail["ORIGIN"];
            } else if (legDetail["origin"] != undefined) {
                return legDetail["origin"];
            }

            return legDetail["originAP"];
        }
    };

    constructorFn.getDestination = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["DESTINATION"] != undefined) {
                return legDetail["DESTINATION"];
            } else if (legDetail["destination"] != undefined) {
                return legDetail["destination"];
            }

            return legDetail["destinationAP"];
        }
    };

    constructorFn.getMvNbrSeq = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["MV_NUM_SEQ"] != undefined) {
                return legDetail["MV_NUM_SEQ"];
            }

            return legDetail["mvNbrSeq"];
        }
    };

    constructorFn.setOrigin = function(legDetail, locationName) {
        if (legDetail != undefined) {
            legDetail["ORIGIN"] = locationName;
            legDetail["origin"] = locationName;
            legDetail["originAP"] = locationName;
        }
    };

    constructorFn.setDestination = function(legDetail, locationName) {
        if (legDetail != undefined) {
            legDetail["DESTINATION"] = locationName;
            legDetail["destination"] = locationName;
            legDetail["destinationAP"] = locationName;
        }
    };

    constructorFn.setMvNbrSeq = function(legDetail, mnNbrSeq) {
        if (legDetail != undefined) {
            legDetail["MV_NUM_SEQ"] = mnNbrSeq;
            legDetail["mvNbrSeq"] = mnNbrSeq;
        }
    };

    constructorFn.getLegId = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["LEG_ID"] != undefined) {
                return legDetail["LEG_ID"];
            }

            return legDetail["legId"];
        }
    };

    constructorFn.setLegId = function(legDetail, legId) {
        if (legDetail != undefined) {
            legDetail["legId"] = legId;
            legDetail["LEG_ID"] = legId;
        }
    };


    constructorFn.getPreviousLegId = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["previousLegId"] != undefined) {
                return legDetail["previousLegId"];
            }

            return legDetail["legId"];
        }
    };

    constructorFn.setPreviousLegId = function(legDetail, legId) {
        legDetail["previousLegId"] = legId;

    };

    constructorFn.getRouteId = function(legDetail) {
        if (legDetail != undefined) {
            if (legDetail["routeId"] != undefined) {
                return legDetail["routeId"];
            }

            return legDetail["ROUTE_ID"];
        }
    };

    constructorFn.setRouteId = function(legDetail, routeId) {
        if (legDetail != undefined) {
            legDetail["routeId"] = routeId;
            legDetail["ROUTE_ID"] = routeId;
        }
    };

    constructorFn.getLegDetailByIndex = function(index) {
        if (index != undefined) {
            var legDetails = this.getLegDetailsByIndex(index);
            if (legDetails != undefined) {
                return legDetails;
            }
        }
    };

    constructorFn.getLegDetailsByIndex = function(index) {
        if (index != undefined) {
            var routeGraphics = ESRIHelper.getEditToolManager().getRouteGraphics();
            if (routeGraphics != undefined) {
                var legDetails;
                var legDetail;
                return this.getLegDetail(routeGraphics[index]);
            }
        }
    };

    constructorFn.duplicateRouteDetails = function(fromRouteId, routeId, routeGraphics){
    	if (routeGraphics != undefined) {
    		var legDetails;
            for (var i = 0; i < routeGraphics.length; i++) {
            	legDetails = routeGraphics[i].data.attributes["LegDetails"];
            	if(legDetails  != undefined){
            		for (var j = 0; j < legDetails.length;j++) {
                		if(this.getRouteId(legDetails[j]) == fromRouteId){
                			this.setRouteId(legDetails[j], routeId);
                		}            		
                	}
            	}            	
                routeGraphics[i].data.attributes["LegDetails"] = legDetails;
            }            
        }
    	
    	return routeGraphics;
    };

    constructorFn.setLegDetailByIndex = function(index, legDetail) {
        if (index != undefined) {
            var routeGraphics = ESRIHelper.getEditToolManager().getRouteGraphics();
            if (routeGraphics != undefined) {
                var legDetails;
                var legDetail;
                for (var i = 0; i < routeGraphics.length; i++) {
                    if (index == i) {
                        routeGraphics[i].data.attributes["LegDetails"] = [legDetail];
                    }
                }
            }
        }
    };

    constructorFn.removeRouteGraphicByIndex = function(index) {
        if (index != undefined) {
            var routeGraphics = ESRIHelper.getEditToolManager().getRouteGraphics();
            if (routeGraphics != undefined) {
                routeGraphics.splice(index, 1);
            }
        }
        //FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
        ESRIHelper.getEditToolManager().refreshLayer();
    };

    constructorFn.updateRouteSeqNbr = function() {
        var routeGraphics = ESRIHelper.getEditToolManager().getRouteGraphics();
        if (routeGraphics) {
            if (routeGraphics != undefined) {
                var legDetails;
                var legDetail;
                for (var i = 0; i < routeGraphics.length; i++) {
                    legDetail = this.getLegDetail(routeGraphics[i]);
                    if (legDetail != undefined) {
                        this.setMvNbrSeq(legDetail, i + 1);
                        if (this.getLegId(legDetail) != undefined) {
                            this.setLegId(legDetail, this.getLegId(legDetail));
                        } else {
                            this.setLegId(legDetail, this.getMvNbrSeq(legDetail));
                        }
                        if (i == 0) {
                            this.setPreviousLegId(legDetail, undefined);
                        } else {
                            this.setPreviousLegId(legDetail, this.getLegId(this.getLegDetail(routeGraphics[i - 1])));
                        }
                    }
                    routeGraphics[i]["mvNbrSeq"] = this.getMvNbrSeq(legDetail);
                }
            }
        }

        ESRIHelper.getEditToolManager().getRouteGraphics();
    };

    constructorFn.getLegDetail = function(routeGraphic) {
        if (routeGraphic != undefined) {
            return this.getLegDetails(routeGraphic)[0];
        }
    };

    constructorFn.getLegDetails = function(routeGraphic) {
        if (routeGraphic != undefined) {
            return routeGraphic.data.attributes["LegDetails"];
        }
    };

    constructorFn.updateSelectedLocations = function(pointIndex, locationName, operationType) {
        var selectedLocations = ESRIHelper.getEditToolManager().selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()];
        if (selectedLocations != undefined) {
            switch (operationType) {
            case "change":
                selectedLocations[pointIndex] = locationName;
                break;
            case "insert":
                selectedLocations.splice(pointIndex, 0, locationName);
                break;
            case "delete":
            	if(locationName === selectedLocations[pointIndex]){
            		selectedLocations.splice(pointIndex, 1);
            	}else {
            		selectedLocations.splice(selectedLocations.indexOf(locationName), 1);
            	}
                
                break;
            }
            LoggerUtils.console(selectedLocations);
        }
    };


    return constructorFn;
})();

/**
 * Undelete route manager ..manages the un-delete operations that are performed from Map
 *
 */
var UnDeleteRouteManager = (function() {
    function constructorFn() {

    };

    /**
     * Operation get triggered when the user click on Un-Delete btn from ROute Manager
     */
    constructorFn.undeleteRouteFromMapHandler = function(){
        //gets the selected route id from Route Wizard
        var routeId = $("input:radio[name ='routes']:checked").val();
        if (routeId != undefined) {
            //invoke the undelete service handler to get the route and leg information( from SIServer )
            this.invokeUndeleteServiceHandler(routeId);
            //closed the route wizard popup
            closeRouteHandler();
        }
    };

    /**
     * ajax call to SIServer to retrieve the route information
     * @param routeId
     */
    constructorFn.invokeUndeleteServiceHandler = function (routeId){
        //get the route data of the selected route id for the leg details object of Map graphics
        var rowData = (ESRIHelper.getEsriGraphicManager().getDeletedRouteById(routeId, true))[0];
        if(rowData == undefined){
            return;
        }
        showProgressDialog(true, "Retrieving route data...");
        //invoke ajax call
        parent.callScheduleRouteDataService(null, rowData, "copyRouteToWIP", this.undeleteRouteServiceCallback, rowData.legId, rowData.routeId, parent.isNetworkQuery);
    };

    /**
     * call back handler for the undelete service handler...
     * @param response -- response that is received from the SIServer
     * @param io - any io information that can be used in case of error
     */
    constructorFn.undeleteRouteServiceCallback =  function (response, io){

        if (response && response.errorCd && response.errorCd > 0) {
            parent.showErrorMsg(response.errorDesc);
        } else {
            if(response.legData != undefined){
                //parse the string data to json object
                var legId = response.legId;
                var legData = $.parseJSON(response.legData);
                var rteData = $.parseJSON(response.rteData);
                //setting the operation code and change flag  on route object
                rteData[0]["OPERATION_CD"] = parent.OPERATION_CD_MODIFY;
                rteData[0]["CHANGE_FLAG"] = parent.OPERATION_CD_MODIFY;
                //setting the operation code and change flag  on leg object(s)
                if (legData && legData.length > 0) {
                    for (var i = 0; i < legData.length; i++) {
                        legData[i]["OPERATION_CD"] = parent.OPERATION_CD_MODIFY;
                        legData[i]["CHANGE_FLAG"] = parent.OPERATION_CD_MODIFY;
                    }
                }

                var timeReference;
                var routeId = rteData[0]["ROUTE_ID"];

                parent.isDelete = false;

                timeReference = parent.getDashboardContentWindow('mapViewDiv').isLocalFlag ? "Local" : "Zulu";
                //invoke an ajax call to save or undelete the route from Map
                parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(rteData, legData, timeReference, function(response, io) {
                    //call back handler
                    SkdMxHelper.getSkdMxGridComponentManager().onSaveServiceSuccess(response, io, routeId, rteData);
                });
            }

        }
        setTimeout(function(){
            showProgressDialog(false);
        }, 1000);
    };

    /**
     * If the undelete operation on the leg graphic from map is representing an association for different routes then
     * the system opens the Route Wizard with the deleted the routes only for selection....if there is only on route that is
     * deleted then it will invoke the ssave service handler to undelete the route....
     * @param evt
     * @param graphic
     */
    constructorFn.undeleteRouteHandler = function(evt, graphic) {
        //gets all the route ids that are deleted...
        var routeIds = ESRIHelper.getEsriGraphicManager().getRouteIdFromGraphic(graphic, true);
        if(routeIds  != undefined){
               //if there are multiple routes that are deleted then
            if(ESRIHelper.getEsriGraphicManager().areMultipleRoutesDeleted(routeIds)){
                //open the pop up to show the deleted routes
                popupManager.showPopup(evt, graphic, "routeSettingsDiv", renderRouteWizardHandler, closeRouteWizardHandler, undefined, {includeDeletedRoutes: true});
            }else {
                //if not then invoke the save service...
                this.invokeUndeleteServiceHandler(routeIds[0]);
            }
        }
    };

    return constructorFn;
})();