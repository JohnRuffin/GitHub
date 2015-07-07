/**
 * @author 888608 - Module & Singleton design pattern ESRI Virtual Graphic Listener (VGL)
 * @returns {ESRIVirtualGraphicManager}
 */
define(["esri/geometry/geodesicUtils", "esri/map", "esri/toolbars/edit", "esri/SpatialReference", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Circle", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/dijit/InfoWindowLite", "esri/dijit/Popup", "esri/domUtils", "esri/tasks/PrintTemplate", "esri/dijit/Print", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-construct", "dojo/_base/event"], function(geodesicUtils, Map, Edit, SpatialReference, Tiled, GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Circle, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, Extent, webMercatorUtils, InfoTemplate, InfoWindowLite, Popup, domUtils, PrintTemplate, Print, PrintTask, PrintParameters, Menu, MenuItem, MenuSeparator, on, connect, registry, declare, lang, dom, domConstruct, event) {

    var SingletonClass = declare(null, {

        constructor: function() {
            LoggerUtils.console("initialized");
            this.initialize();
            
            //start point
            this.startingPoint;
            //new vertex point
            this.newVertexPoint;
            //virtual graphic / circle graphic
            this.virtualGraphic;

            //start graphic length
            this.beforeRouteMoveDtls = [];
            //end graphic length
            this.afterRouteMoveDtls = [];

            //operation
            this.ADD = 1;
            this.CHANGE = 2;
            this.DELETE = 3;
            //
            this.operation;
        },

        /**
         * initialize the common constants/variables
         */
        initialize: function() {
        	//radius
            this.radius = esriMap.map.extent.getWidth() / 50;
            //virtual symbol
            this.virtualSymbol = new SimpleFillSymbol();
            //virtual graphic layer(VGL)
            this.virtualGraphicLayer = new GraphicsLayer();
            //set the opacity
            this.virtualGraphicLayer.setOpacity(3);
            //add the layer to esriMap object
            esriMap.addMapLayer(this.virtualGraphicLayer);
        },

        /**
         * clears the virtual graphic layer
         */
        clear: function() {
            this.virtualGraphicLayer.clear();
        },

        /**
         * add a graphic to the virtaul graphic layer
         * @param graphic
         */
        addGraphic: function(graphic) {
            if (graphic != undefined) {
                this.virtualGraphic = graphic;
                this.virtualGraphicLayer.add(this.virtualGraphic);
            }
        },

        /**
         * returns virtual graphic
         * @param vertexGraphic
         * @returns
         */
        getVirtualGraphic: function(vertexGraphic) {
            if (vertexGraphic != undefined) {
                var vGeometry = this.getVirtualGeometry(vertexGraphic);
                if (vGeometry != undefined) {
                    return ESRIHelper.getEsriGraphicManager().getGraphic(vGeometry, this.virtualSymbol);
                }
            }
        },

        /**
         * returns the virtual geometry
         * @param vertexGraphic
         * @returns {Circle}
         */
        getVirtualGeometry: function(vertexGraphic) {
            if (vertexGraphic != undefined) {
                var point = [vertexGraphic.geometry.x, vertexGraphic.geometry.y];
                return new Circle(point, {
                    radius: this.radius
                });
            }
        },

        /**
         * vertex move start listener
         * @param event
         */
        vertexMoveStartListener: function(event) {
            LoggerUtils.console("vertext-move-start");
            if (event != undefined) {
                var polyline = this.getGeometryByVertex(event);
                var vertexInfo = this.getSelectedVertexInfo(event);
                if (polyline != undefined) {
                    this.startingPoint = lang.clone(polyline.getPoint(vertexInfo.segmentIndex, vertexInfo.pointIndex));
                    this.beforeRouteMoveDtls["locationsCount"] = this.getTotalRouteLength(polyline);
                    this.beforeRouteMoveDtls["vertexInfo"] = vertexInfo;
                }
            }
        },
        
        /**
         * returns total route length
         * @param polyline
         * @returns
         */
        getTotalRouteLength: function(polyline) {
            if (polyline != undefined) {
                if (polyline.paths != undefined && polyline.paths[0] != undefined) {
                    return polyline.paths[0].length;
                }
            }
        },

        /**
         * vertex move stop listener
         * @param event
         */
        vertexMoveStopListener: function(event) {
            LoggerUtils.console("vertext-move-stop");
            //clear the graphic layer
            this.clear();
            //add the circle graphic
            this.addGraphic(this.getVirtualGraphic(this.getSelectedVertexGraphic(event)));
            //new vertex position used to caliculate the distance between the points...center of ccircle
            this.newVertexPoint = this.getSelectedVertexGraphic(event);
            //near by graphic...
            var nearByGraphic = this.findPointsInExtent(event);
            //if there is no near by graphic then get the actual location
            // of the selected vertex and make that as an near by graphic
            // to avoid the null issue while editing the graphic
            if(nearByGraphic == undefined){
                var actualLocation = ESRIHelper.getEditToolManager().getSelectedLocationByIndex(event.vertexinfo.pointIndex);
                nearByGraphic = this.findPointsInExtent(event, actualLocation);
            }
            //selected vertex info
            var vertexInfo = this.getSelectedVertexInfo(event);
            //select vertex ...target geometry
            var polyline = this.getGeometryByVertex(event);
            //select vertex ...target graphic
            var polylineGraphic = this.getGraphicByVertex(event);
            polyline.removePoint(vertexInfo.segmentIndex, vertexInfo.pointIndex);
            if (nearByGraphic != undefined) {
                var coords = this.validateCoordinatesNow(nearByGraphic.geometry, polyline.paths);
                polyline.insertPoint(vertexInfo.segmentIndex, vertexInfo.pointIndex, new Point([coords.x, coords.y]));
                this.startingPoint = new Point([coords.x, coords.y]); // Set the starting point to the last valid location.
            } else {
                polyline.insertPoint(vertexInfo.segmentIndex, vertexInfo.pointIndex, new Point([this.startingPoint.x, this.startingPoint.y]));
            }
            polyline = geodesicUtils.geodesicDensify(polyline, 90000000000);
            polylineGraphic.setGeometry(polyline);
            this.afterRouteMoveDtls["locationsCount"] = this.getTotalRouteLength(polyline);
            this.afterRouteMoveDtls["vertexInfo"] = vertexInfo;
            if (nearByGraphic != undefined) {
            	this.setOperation();
            }
            ESRIHelper.getEditToolManager().vertexChangeCompleteHandler(this.operation, nearByGraphic, this.beforeRouteMoveDtls, this.afterRouteMoveDtls);
            /*if(nearByGraphic != undefined){

            }else {
                //ESRIHelper.getEditToolManager().invalidateEditToolbar(polylineGraphic);
            }*/

            this.clear();

            ESRIHelper.getEditToolManager().changeGraphicStyles();
        },

        areAllNegativeX: function(polylinePaths) {
            if (polylinePaths != undefined) {
                for (var i = 0; i < polylinePaths.length; i++) {
                    if (polylinePaths[0] > 0) {
                        return false;
                    }
                }
            }

            return true;
        },

        validateCoordinatesNow: function(geometry, polylinePaths) {
            var tempGeometry = lang.clone(geometry);
            if (tempGeometry != undefined) {
                if (tempGeometry.x < 0 && !this.areAllNegativeX(polylinePaths)) {
                    tempGeometry.x = tempGeometry.x + 360;
                }
            }
            return tempGeometry;
        },

        setOperation: function() {
            var startCount = this.beforeRouteMoveDtls["locationsCount"];
            var endCount = this.afterRouteMoveDtls["locationsCount"];

            if (startCount - endCount > 0) {
                this.operation = this.ADD;
            } else if (startCount - endCount < 0) {
                this.operation = this.DELETE;
            } else if (startCount - endCount == 0) {
                this.operation = this.CHANGE;
            }

            LoggerUtils.console(this.operation);
        },

        vertexAddListener: function(event) {
            LoggerUtils.console("vertex-add");
        },

        vertexDeleteListener: function(event) {
            LoggerUtils.console("vertex-delete");
            //clear the graphic layer
            this.clear();

            //new vertex position used to caliculate the distance between the points...center of ccircle
            this.newVertexPoint = this.getSelectedVertexGraphic(event);

            //selected vertex info
            var vertexInfo = this.getSelectedVertexInfo(event);
            //select vertex ...target geometry
            var polyline = this.getGeometryByVertex(event);

            this.afterRouteMoveDtls["locationsCount"] = this.getTotalRouteLength(polyline);
            this.afterRouteMoveDtls["vertexInfo"] = vertexInfo;
            this.setOperation();
            ESRIHelper.getEditToolManager().vertexChangeCompleteHandler(this.operation, undefined, this.beforeRouteMoveDtls, this.afterRouteMoveDtls);
            //as it takes time to render the data after deleting the node....had placed the timeout work around to fix the issue....
            setTimeout(function() {
                ESRIHelper.getEditToolManager().changeGraphicStyles();
            }, 750);
        },

        vertexMouseOverListener: function(event) {
            LoggerUtils.console("On Mouse over of vertex");
            var tooltip = "";

            var locationGraphic;
            var selectedLocations = ESRIHelper.getEditToolManager().selectedRouteLocations[ESRIHelper.getEditToolManager().getRouteId()];
            if (selectedLocations != undefined && selectedLocations.length > 0) {
                for (var i = 0; i < selectedLocations.length; i++) {
                    if (i == event.vertexinfo.pointIndex) {
                        locationGraphic = getLocationGraphic(false, selectedLocations[i]);
                        if (locationGraphic && locationGraphic[0] != undefined) {
                            tooltip = locationGraphic[0].toolTip;
                        }
                        break;
                    }
                }
            }

            var dialogContent = "<table><tr><td colspan='2' align='center'><b><font size='2'>" + tooltip + "</font></b></td></tr>";
            var changeMouseCursor = false;
            dialogContent += "</table>";
            onLayerMouseOver(event, dialogContent, changeMouseCursor);


        },
        vertexMouseOutListener: function(event) {
            LoggerUtils.console("On Mouse out of vertex");
            //destroy the tooltip widget....
            var widget = dijit.byId("tooltipDialog");
            if (widget) {
                widget.destroy();
            }


        },

        //polyline geometry
        getGeometryByVertex: function(event) {
            if (event) {
                return event.graphic.geometry;
            }
        },

        //polyline graphic
        getGraphicByVertex: function(event) {
            if (event) {
                return event.graphic;
            }
        },

        //vertex that is currently changed
        getSelectedVertexInfo: function(event) {
            if (event) {
                return event.vertexinfo;
            }
        },

        //vertex that is currently changed
        getSelectedVertexGraphic: function(event) {
            if (event) {
                return event.vertexinfo.graphic;
            }
        },

        //circle extent
        getVirtaulGraphicExtent: function(event) {
            if (this.virtualGraphic != undefined) {
                return this.virtualGraphic.geometry.getExtent();
            }
        },

        getLayerGraphics: function(type) {
            var graphicsLayer;
            switch (type) {
            case "facilitylayer":
                graphicsLayer = ESRIHelper.getEsriZoomManager().getFacilityLabelLayer();
                return graphicsLayer.graphics;
                break;
            case "activelayer":
                graphicsLayer = ESRIHelper.getEsriZoomManager().getFacilityLabelLayer();
                return graphicsLayer.graphics;
                break;
            }

        },

        findPointsInExtent: function(event, actualLocation) {
            var virtualComponent = this;
            var clonedGeometry;
            var extent = this.getVirtaulGraphicExtent(event);
            var length = 0;
            var resultPoint;
            var nearByGraphics = [];
            // Loop through each graphic into the layer and check if it comes into the extent of the circle or not.
            dojo.forEach(this.getLayerGraphics("facilitylayer"), function(graphic) {
                graphic.geometry.normalize();
                clonedGeometry = virtualComponent.validateCoordinatesNow(graphic.geometry);
                if (graphic.visible && graphic.geometry.type == "point" && virtualComponent.contains(extent, graphic.geometry)) {
                    //Normalizing the geometry so that the length between two points will be
                    //calculated accurately.
                    length = esri.geometry.getLength(virtualComponent.newVertexPoint.geometry.normalize(), new Point([graphic.geometry.x, graphic.geometry.y]));

                    //Store into array for future use
                    nearByGraphics.push({
                        graphicObj: graphic,
                        val: length
                    });
                }else if(actualLocation!= undefined && graphic.visible && graphic.geometry.type == "point" && graphic.toolTip.indexOf(actualLocation) >= 0){
                    //Store into array for future use
                    nearByGraphics.push({
                        graphicObj: graphic,
                        val: length
                    });
                }
            });
            // If the Points in extent count is >0 then sort those points based on the distance from the vertex and get the shortest distance object.
            if (nearByGraphics.length > 0) {

                nearByGraphics.sort(function(a, b) {
                    return a.val - b.val;
                });
                resultPoint = nearByGraphics[0].graphicObj;
            }
            return resultPoint;
        },

        contains: function(extent, geometry) {
            var isContains = false;
            if (extent != undefined && geometry != undefined) {
                if (extent.contains(geometry)) {
                    return true;
                } else if (extent._partwise != undefined && extent._partwise.length > 0) {
                    var partwises = extent._partwise;
                    if (partwises != undefined) {
                        var partwise;
                        var framePart;
                        for (var i = 0; i < partwises.length; i++) {
                            partwise = partwises[i];
                            if (partwise != undefined) {
                                if (partwise.contains(geometry)) {
                                    return true;
                                } else if (partwise._parts != undefined && partwise._parts.length > 0) {
                                    for (var j = 0; j < partwise._parts.length; j++) {
                                        isContains = false;
                                        framePart = partwise._parts[j];
                                        if (framePart != undefined) {
                                            if (framePart.extent != undefined) {
                                                isContains = framePart.extent.contains(geometry);
                                                if (isContains) {
                                                    return isContains;
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }

            return isContains;
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