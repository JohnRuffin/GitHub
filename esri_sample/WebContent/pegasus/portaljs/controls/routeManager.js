/**
 * @author 888608 - Module & Singleton design pattern ESRI Graphic Manager for Map
 * @returns {ESRIHelper.getRouteManager()}
 */
define(["esri/layers/GraphicsLayer", "esri/toolbars/draw", "esri/graphic", "esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Multipoint", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/domUtils", "dojo/on", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/dom", "dojo/dom-construct"], function(GraphicsLayer, Draw, Graphic, Geometry, Point, Polyline, Polygon, Multipoint, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol, Font, domUtils, on, connect, registry, declare, dom, domConstruct) {

    /**
     * 
     */
    var SingletonClass = declare(null, {

        constructor: function() {
            this.legDetails;
            this.dataObject;
            //gojs constant to create graphically objects on canvas
            this.$s$ = go.GraphObject.make;
            //list of all gojs diagrams in pop-up window
            this.diagramsArray = {};
            this.styleByIdFn = "getMapObjectStyleById";
            this.styleByNameFn = "getMapObjectStyleByName";
            this.globalStylesMap;
            this.clonedLegObject;
            //colors map
            this.colorsMap = {};
            //temporary cache to old the loc name and city name mapping object
            this.locNameCodeMap = [];
            //template link map
            this.linkTemplateMap = new go.Map("string", go.Link);
            this.DEFAULT_NODE_WIDTH = 40;
            this.DEFAULT_NODE_HEIGHT = 20;
            this.SELECTED_NODE_WIDTH = 45;
            this.SELECTED_NODE_HEIGHT = 23;
            this.DEFAULT_NODE_STROKE_COLOR = "#558ED5";
            this.DEFAULT_NODE_STROKE_WIDTH = 1;
            this.SELECTED_NODE_STROKE_COLOR = "#23ba28";
            this.SELECTED_NODE_STROKE_WIDTH = 3;
            
            this.MAX_ROUTE_LENGTH = 4;
            this.routeLegGraphicsMap;

        },
        
        getMaxNodes: function() {
            return this.MAX_ROUTE_LENGTH;
        },

        /**
         * returns the width of the route pop up manager
         *
         * @returns {number}
         */
        getWidth: function() {
            if(this.MAX_ROUTE_LENGTH <= 5){
            	return 480;
            }else if(this.MAX_ROUTE_LENGTH == 6){
            	return 530;
            }else if(this.MAX_ROUTE_LENGTH == 7){
            	return 585;
            }else if(this.MAX_ROUTE_LENGTH == 8){
            	return 590;
            }else if(this.MAX_ROUTE_LENGTH == 9){
            	return 660;
            } else {
            	return 800;
            }
        },
        
        /**
         * re-validate all the master data based on the layer id 
         * @param legGraphic
         */
        validateNow: function(legGraphic) {
            //global styles map
            this.globalStylesMap = esriMap.getLayerGlobalStylesMap(getLayerId());
            this.dataObject = legGraphic.data;
            //retrieve all the leg details from the selected graphic
            this.legDetails = ESRIHelper.getEsriGraphicManager().getLegDetails(legGraphic);
            //backup the dataobject for future reference 
            this.clonedLegObject = clone(this.dataObject);
        },

        /**
         * create a gojs diagram
         * @param count
         * @param selectedRtLgDtls
         * @returns
         */
        createDiagram: function(count, selectedRtLgDtls) {
            //main container
            var outerDiv = document.createElement("div");
            outerDiv.className = "goDiagramStyle";
            outerDiv.style.paddingBottom = "10px";
            //radio selection
            this.createRadioDiv(outerDiv, selectedRtLgDtls, count);
            //gojs container
            var div = document.createElement("div");
            div.style.width = "100%";
            div.style.marginLeft = "100px";
            div.id = "diagram_" + "_" + count;
            div.className="diagramClass";
            //main wizard
            document.getElementById("routeWizard").appendChild(outerDiv).appendChild(div);
            //leg diagram initialization 
            var legDiagram = this.$s$(go.Diagram, div.id, {
                isReadOnly: true,
                allowMove: false,
                allowSelect: false,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

            return legDiagram;
        },

        /**
         * create a radio for selecting the route...
         * @param outerDiv
         * @param selectedRtLgDtls
         * @param count
         */
        createRadioDiv: function(outerDiv, selectedRtLgDtls, count) {
            var radioHtml = '<input type="radio" name="routes" id="' + (selectedRtLgDtls != undefined ? selectedRtLgDtls.legId : "") + '" value="' + (selectedRtLgDtls != undefined ? selectedRtLgDtls.routeId : undefined) + '" ';
            if (count == 0) {
                radioHtml += ' checked="checked"';
            }
            radioHtml += '/>';
            radioHtml += '<label class="label_style" for="' + (selectedRtLgDtls != undefined ? selectedRtLgDtls.legId : "") + '" style="font-weight: bold;">' + (selectedRtLgDtls != undefined ? selectedRtLgDtls.mvNbr : "") + '</label>';

            var radioFragment = document.createElement('div');
            radioFragment.style.width = "130px";
            radioFragment.style.float = "left";
            radioFragment.style.paddingLeft = "20px";
            radioFragment.style.paddingTop = "6px";
            radioFragment.innerHTML = radioHtml;
            outerDiv.appendChild(radioFragment);
        },

        /**
         * clear the dom
         * @param index
         */
        clear: function(index) {
            $("#" + "diagram_" + "_" + index).empty();
            $("#" + "diagram_" + "_" + index).remove();
            $("#" + "details_" + "_" + index).empty();
            $("#" + "details_" + "_" + index).remove();
            $("#routeWizard").empty();
        },

        /**
         * clear all the nodes....
         */
        clearAll: function() {
            $(".diagramClass").empty();
            $(".diagramClass").remove();
            $("#routeWizard").empty();
        },

        /**
         * creating the container for adding the routes
         * @param count
         * @param legDetails
         */
        addSelectedLegDetails: function(count, legDetails) {
            // route container
            var div = document.createElement("div");
            div.style.width = "100px";
            div.id = "details_" + "_" + legDetails.routeId;
            document.getElementById("routeWizard").appendChild(div);
            //add the leg details...
            this.updateSelectedLegDetails(count, legDetails);
        },

        /**
         * show the route effective days and equipment code
         * @param count
         * @param legDetails
         */
        updateSelectedLegDetails: function(count, legDetails) {
            if (count != undefined) {
                this.setSelectedLegDetails(count, legDetails);
            } else {
                $("#details__" + legDetails.routeId).empty();
                this.setSelectedLegDetails(count, legDetails);
            }
        },

        /**
         * creating the dom for showing the leg details
         * @param count
         * @param legDetails
         */
        setSelectedLegDetails: function(count, legDetails) {
            //fixes for the route effective days and width of the strip
            $("#details__" + legDetails.routeId).html('<div class="legDetailDiv" style="margin-left:65px;"><div class="detailLeftDiv" style="width: 90%"><table cellpadding="0" cellspacing="0"><tbody><tr><td class="grey-text" align="right">Eq Type:</td><td align="left"><label>' + legDetails["equipCode"] + '/' + legDetails["iataEquipDesc"] + '</label></td><td class="grey-text" align="right">Route Eff Days:</td><td align="left"><label>' + legDetails["day"] + '</label></td></tr></tbody></table></div></div>');
        },


        getOriginLocCd: function() {
            if (this.dataObject != undefined) {
                return this.dataObject.attributes.Origin.locCd;
            }
        },

        getDestinationLocCd: function() {
            if (this.dataObject != undefined) {
                return this.dataObject.attributes.Destination.locCd;
            }
        },

        /**
         * 
         * @param routeLegDetails
         * @param count
         * @returns {___legDiagram5}
         */
        addRouteLegDiagram: function(routeLegDetails, count, routeId) {
            var legDiagram;
            try {
                legDiagram = this.createDiagram(count, routeLegDetails[0]);
            } catch (e) {
                this.clear(count);
                legDiagram = this.createDiagram(count, routeLegDetails[0]);
            }

            this.addSelectedLegDetails(count, routeLegDetails[0]);

            legDiagram.nodeTemplate = this.getNodeTemplate();

            var nodeDataArray = [];
            var linkDataArray = [];
            var legLinkObject;

            var legDetail;
            var xPosition = "0 5";
            var locations = [];
            var nodeProperties;
            var isSelectedOrgDestLink = false;
            var destNodeLocCd;
            for (var i = 0; i < routeLegDetails.length; i++) {
                legDetail = routeLegDetails[i];
                //postion
                xPosition = "" + i * 60 + " 5";
                nodeWidth = 40;
                nodeHeight = 20;
                isSelectedOrgDestLink = false;
                if (locations.indexOf(legDetail.origin) <= -1) {
                    if ((destNodeLocCd == legDetail.origin) || (this.getOriginLocCd() == legDetail.origin && this.getDestinationLocCd() == legDetail.destination) || (this.getDestinationLocCd() == legDetail.origin) || (routeLegDetails.length == 1)) {
                        nodeProperties = this.getSelectedNodeProperties();
                        isSelectedOrgDestLink = true;
                        if (destNodeLocCd == undefined) {
                            destNodeLocCd = legDetail.destination;
                        }
                    } else {
                        nodeProperties = this.getDefaultNodeProperties();
                        isSelectedOrgDestLink = false;
                    }
                    locations.push(legDetail.origin);
                    nodeDataArray.push(this.getOriginNode(legDetail, nodeProperties.nodeWidth, nodeProperties.nodeHeight, nodeProperties.nodeStroke, nodeProperties.nodeStrokeWidth, xPosition));
                }

                if ((this.getOriginLocCd() == legDetail.origin && this.getDestinationLocCd() == legDetail.destination) || (routeLegDetails.length == 1)) {
                    nodeProperties = this.getSelectedNodeProperties();
                } else {
                    nodeProperties = this.getDefaultNodeProperties();
                }
                xPosition = "" + ((i + 1) * 60) + " 5";
                if (i == (routeLegDetails.length - 1) && locations.indexOf(legDetail.destination) <= -1) {
                    nodeDataArray.push(this.getDestinationNode(legDetail, nodeProperties.nodeWidth, nodeProperties.nodeHeight, nodeProperties.nodeStroke, nodeProperties.nodeStrokeWidth, xPosition));
                }
                this.linkTemplateMap.add(legDetail.legStyleId, this.getLinkTemplate(this.getStyle(legDetail.legStyleId), true));
                linkDataArray.push(this.getLinkObject(legDetail, isSelectedOrgDestLink));
            }

            this.diagramsArray[routeId] = legDiagram;

            legDiagram.linkTemplateMap = this.linkTemplateMap;
            legDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
            
            if(nodeDataArray.length > this.MAX_ROUTE_LENGTH){
            	this.MAX_ROUTE_LENGTH = nodeDataArray.length; 
            }
            return legDiagram;
        },

        getDefaultNodeProperties: function() {
            return {
                nodeWidth: this.DEFAULT_NODE_WIDTH,
                nodeHeight: this.DEFAULT_NODE_HEIGHT,
                nodeStroke: this.DEFAULT_NODE_STROKE_COLOR,
                nodeStrokeWidth: this.DEFAULT_NODE_STROKE_WIDTH
            };
        },

        getSelectedNodeProperties: function() {
            return {
                nodeHeight: this.SELECTED_NODE_HEIGHT,
                nodeWidth: this.SELECTED_NODE_WIDTH,
                nodeStroke: this.SELECTED_NODE_STROKE_COLOR,
                nodeStrokeWidth: this.SELECTED_NODE_STROKE_WIDTH
            };
        },

        getDestinationNode: function(legDetail, nodeWidth, nodeHeight, nodeStroke, nodeStrokeWidth, xPosition) {
            return {
                key: legDetail.destination,
                name: legDetail.destination,
                figure: "RoundedRectangle",
                color: this.getColor(legDetail.destinationAP),
                width: nodeWidth,
                height: nodeHeight,
                loc: xPosition,
                stroke: nodeStroke,
                strokeWidth: nodeStrokeWidth
            };
        },

        getOriginNode: function(legDetail, nodeWidth, nodeHeight, nodeStroke, nodeStrokeWidth, xPosition) {
            return {
                key: legDetail.origin,
                name: legDetail.origin,
                figure: "RoundedRectangle",
                color: this.getColor(legDetail.originAP),
                width: nodeWidth,
                height: nodeHeight,
                loc: xPosition,
                stroke: nodeStroke,
                strokeWidth: nodeStrokeWidth
            };
        },

        getLinkObject: function(legDetail) {
            if (legDetail != undefined) {
                var legLinkObject = clone(this.clonedLegObject);
                legLinkObject.legDetail = legDetail;
                legLinkObject.category = legDetail.legStyleId;
                legLinkObject.attributes.LegDetails = [legDetail];
                legLinkObject.from = legDetail.origin;
                legLinkObject.to = legDetail.destination;
                return legLinkObject;
            }
        },

        getNodeTemplate: function() {
            return this.$s$(go.Node, go.Panel.Auto, this.$s$(go.Shape, {
                figure: "RoundedRectangle"
            }, new go.Binding("strokeWidth", "strokeWidth"), new go.Binding("stroke", "stroke"), new go.Binding("fill", "color"), new go.Binding("width", "width"), new go.Binding("height", "height"), new go.Binding("figure", "figure")), this.$s$(go.TextBlock, {
                margin: 3,
                stroke: "#ffffff",
                font: "9pt Arial"
            }, new go.Binding("text", "key")), new go.Binding("location", "loc", go.Point.parse));
        },

        getStyle: function(styleId) {
            if (styleId) {
                return window[this.styleByIdFn](styleId);
            }
        },

        getExpandStyle: function(isSelectedOrgDestLink, lineColor) {
            return {
                "id": "ExpStyle",
                "line": {
                    "customProperties": {
                        "countShapeSymbol": {
                            "stroke": lineColor,
                            "height": 4,
                            "figure": "circle",
                            "width": 4,
                            "fill": "#FFFFFF",
                            "click": this.showSelectedLegDetails,
                            "symbolType": "shape",
                            "strokeWidth": 1,
                            "visible": isSelectedOrgDestLink

                        },
                        "lineSymbols": ["countShapeSymbol"]
                    },
                    "width": 1.0
                },
                "customProperties": {
                    "templateType": "link",
                    "templateName": "defaultLink",
                    "fromAttribute": "Origin.locCd",
                    "toAttribute": "Destination.locCd"
                }
            };
        },

        showSelectedLegDetails: function(event, object) {
            this.ESRIHelper.getRouteManager().updateSelectedLegDiagram(event, object);
            this.ESRIHelper.getRouteManager().updateSelectedLegDetails(null, object.part.data.legDetail);
        },

        getLinkTemplate: function(style, isSelectedOrgDestLink) {
            var link = new go.Link();
            //link rouitng types 
            //link.routing = go.Link.AvoidsNodes;
            var lineCustomProperties;
            var lineProperties;
            var schmeaticDiagram = this;
            if (style) {

                var lineStyle = style.line;
                if (lineStyle) {
                    lineCustomProperties = lineStyle.customProperties;
                    if (lineCustomProperties) {
                        lineProperties = lineCustomProperties.lineProperties;
                        if (lineProperties) {
                            if (lineProperties.hasOwnProperty("click")) {
                                delete lineProperties["click"];
                            }
                            if (lineProperties.strokeDashArray) {
                                var strokeArray;
                                if (lineProperties.strokeDashArray instanceof Array) {
                                    strokeArray = lineProperties.strokeDashArray.map(function(x) {
                                        return parseInt(x, 10);
                                    });
                                } else {
                                    strokeArray = lineProperties.strokeDashArray.split(",").map(function(x) {
                                        return parseInt(x, 10);
                                    });
                                }

                                lineProperties.strokeDashArray = strokeArray;
                            }
                        }
                    }

                    if (lineProperties == undefined) {
                        lineProperties = {};
                    }

                    if (lineStyle.color) {
                        lineProperties.stroke = this.toHexColor(lineStyle.color);
                    } else {
                        lineProperties.stroke = null;
                    }

                    link.add(this.$s$(go.Shape, lineProperties));

                    var ExpStyle = this.getExpandStyle(isSelectedOrgDestLink, lineProperties.stroke);
                    if (lineCustomProperties) {
                        var lineSymbols = ExpStyle.line.customProperties.lineSymbols;

                        lineCustomProperties["countShapeSymbol"] = ExpStyle.line.customProperties.countShapeSymbol;
                        lineCustomProperties["countSymbol"] = ExpStyle.line.customProperties.countSymbol;
                        lineCustomProperties.width = 1;

                        if (lineSymbols) {
                            var symbolType;
                            var textAttributeFn;
                            var symbolProperties;
                            for (var i = 0; i < lineSymbols.length; i++) {
                                symbolProperties = this.getLineSymbolProperties(lineCustomProperties[lineSymbols[i]]);
                                symbolType = symbolProperties.symbolType;
                                if (symbolType) {
                                    delete symbolProperties["symbolType"];

                                    if (symbolType == "shape") {
                                        link.add(this.$s$(go.Shape, symbolProperties, new go.Binding("visible", "", this.isVisible)));
                                    }
                                }
                            }
                        }
                    }

                    if (this.linkClickHandler) {
                        link.click = this.linkClickHandler;
                    }
                }
            }
            return link;
        },

        isVisible: function(object) {
            var originNode = this.ESRIHelper.getRouteManager().diagramsArray[object.legDetail.routeId].findPartForKey(object.legDetail.origin);
            var destNode = this.ESRIHelper.getRouteManager().diagramsArray[object.legDetail.routeId].findPartForKey(object.legDetail.destination);

            if (this.ESRIHelper.getRouteManager().isSelectedNode(originNode) && this.ESRIHelper.getRouteManager().isSelectedNode(destNode)) {
                return false;
            }
            return true;
        },

        isSelectedNode: function(node) {
            if (node != undefined) {
                return node.part.data.height == this.SELECTED_NODE_HEIGHT;
            }
        },

        getColor: function(name) {
            if (this.colorsMap[name] == undefined) {
                var style = window[this.styleByNameFn](name);
                //if the sytle is undefined then get the style by city name
                if(style  == undefined){
                    style = window[this.styleByNameFn](this.getLocName(name));
                }
                if (style && style.icon && style.icon.color) {
                    this.colorsMap[name] = this.toHexColor(style.icon.color);
                }
            }

            return this.colorsMap[name];
        },

        /**
         * if the city name is not found for the location code then get the graphic object representing
         * the location code from map and cache the city name to location code...
         * @param locCd
         * @returns {*}
         */
        getLocName : function(locCd) {
            if(locCd != undefined){
                var locationName = this.locNameCodeMap[locCd];
                if(locationName == undefined){
                    //hitting the map graphic layer to indify the graphic object...
                    var graphic = esriMap.findMatchingPointGraphic(getLayerId(), locCd);
                    if(graphic != undefined){
                        this.cacheLocations(graphic.data);
                        locationName = this.locNameCodeMap[locCd];
                    }
                }

                if(locationName == undefined){
                    locationName = locCd;
                }

                return locationName;
            }
        },

        /**
         * cache the city name to location Name
         * @param graphic
         */
        cacheLocations:  function(graphic) {
            if(graphic != undefined){
                if(graphic.name.length > 3 && graphic.attributes!= undefined && graphic.attributes.RelFacility != undefined && graphic.attributes.RelFacility.locCd != undefined){
                    this.locNameCodeMap[graphic.attributes.RelFacility.locCd ] =  graphic.name;
                }else if(graphic.name.length > 3 && graphic.attributes!= undefined && graphic.attributes.locCdActual != undefined){
                    this.locNameCodeMap[graphic.attributes.locCdActual] =  graphic.name;
                    this.locNameCodeMap[graphic.attributes.locCdActual.substring(0,3)] =  graphic.name;
                }else {
                    this.locNameCodeMap[graphic.name] =  graphic.name;
                }
            }
        },


        paintRouteWizard: function(legGraphic, includeDeletedLegsOnly) {
            this.clearAll();
            if (legGraphic != undefined) {
            	this.MAX_ROUTE_LENGTH = 4;
                this.validateNow(legGraphic);
                this.routeLegGraphicsMap = ESRIHelper.getEsriGraphicManager().getLegDetailsByRouteFromGraphic(legGraphic, includeDeletedLegsOnly);
                if (this.routeLegGraphicsMap != undefined) {
                    var routeKeys = Object.keys(this.routeLegGraphicsMap);
                    var legDetails;
                    for (var i = 0; i < routeKeys.length; i++) {
                        legDetails = this.routeLegGraphicsMap[routeKeys[i]];
                        if(legDetails != undefined && legDetails.length > 0){
                            this.addRouteLegDiagram(legDetails, i, routeKeys[i]);
                        }
                    }
                }
            }

            if(includeDeletedLegsOnly){
                $("#undeleteBtn").show();
                $("#addtoWIPButton").hide();
            }else {
                $("#addtoWIPButton").show();
                $("#undeleteBtn").hide();
            }
        },

        toHexColor: function(colorStr) {
            if (colorStr && colorStr.charAt(0) != '#') {
                return "#" + colorStr.substring(2);
            }

            return colorStr;
        },

        /**
         * Leg detail diagram link properties
         * @param symbolProperties
         * @returns
         */
        getLineSymbolProperties: function(symbolProperties) {
            if (symbolProperties.hasOwnProperty("segmentOrientation")) {
                symbolProperties.segmentOrientation = go.Link[symbolProperties.segmentOrientation];
            }

            if (symbolProperties.hasOwnProperty("segmentOffsetX") && symbolProperties.hasOwnProperty("segmentOffsetY")) {
                if (symbolProperties["segmentOffsetX"] == "NaN" || symbolProperties["segmentOffsetY"] == "NaN") {
                    symbolProperties.segmentOffset = new go.Point(NaN, NaN);
                } else {
                    symbolProperties.segmentOffset = new go.Point(parseInt(symbolProperties.segmentOffsetX), parseInt(symbolProperties.segmentOffsetY));
                }
                delete symbolProperties["segmentOffsetX"];
                delete symbolProperties["segmentOffsetY"];
            }

            if (symbolProperties.hasOwnProperty("click")) {
                symbolProperties["click"] = window[symbolProperties["click"]] == undefined ? symbolProperties["click"] : window[symbolProperties["click"]];
            }
            return symbolProperties;
        },

        updateSelectedLegDiagram: function(event, object) {
            var legDetail = this.getLegDetailFromLink(object);
            var diagram = this.diagramsArray[legDetail.routeId];
            var routeLegDetails = this.routeLegGraphicsMap[legDetail.routeId];
            for (var i = 0; i < routeLegDetails.length; i++) {
                this.setDefaultNodeValueByLeg(diagram, routeLegDetails[i]);
            }

            this.setSelectedNodeValueByLeg(diagram, object.part.data);
        },

        getLegDetailFromLink: function(object) {
            return object.part.data.legDetail;
        },

        setDefaultNodeValueByLeg: function(diagram, legDetail) {
            if (legDetail != undefined) {
                this.setDefaultNodeValues(diagram.findPartForKey(legDetail.origin), diagram);
                this.setDefaultNodeValues(diagram.findPartForKey(legDetail.destination), diagram);
                this.resetLinkStates(diagram);
            }
        },

        resetLinkStates: function(diagram) {
            diagram.startTransaction("getLinkStates");
            var linkArr = diagram.model.linkDataArray;
            var linkData;
            for (var i = 0; i < linkArr.length; i++) {
                linkData = linkArr[i];
                diagram.model.removeLinkData(linkArr[i]);
                diagram.model.addLinkData(linkData);
            }
            diagram.commitTransaction("getLinkStates");
        },

        setSelectedNodeValueByLeg: function(diagram, linkData) {
            if (linkData != undefined) {
                this.setSelectedNodeValues(diagram.findPartForKey(linkData.from), diagram);
                this.setSelectedNodeValues(diagram.findPartForKey(linkData.to), diagram);
                this.hideLinkSymbol(diagram, linkData);
            }
        },

        hideLinkSymbol: function(diagram, linkData) {
            diagram.startTransaction("setSelectedNodeValueByLeg");
            diagram.model.removeLinkData(linkData);
            linkData.visible = false;
            diagram.model.addLinkData(linkData);
            diagram.commitTransaction("setSelectedNodeValueByLeg");
        },

        setDefaultNodeValues: function(linkNode, diagram) {
            diagram.startTransaction("setDefaultNodeValues");
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "stroke", this.DEFAULT_NODE_STROKE_COLOR);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "strokeWidth", this.DEFAULT_NODE_STROKE_WIDTH);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "height", this.DEFAULT_NODE_HEIGHT);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "width", this.DEFAULT_NODE_WIDTH);
            diagram.commitTransaction("setDefaultNodeValues");
        },

        setSelectedNodeValues: function(linkNode, diagram) {
            diagram.startTransaction("setSelectedNodeValues");
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "stroke", this.SELECTED_NODE_STROKE_COLOR);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "strokeWidth", this.SELECTED_NODE_STROKE_WIDTH);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "height", this.SELECTED_NODE_HEIGHT);
            if (linkNode !== null) diagram.model.setDataProperty(linkNode.part.data, "width", this.SELECTED_NODE_WIDTH);
            diagram.commitTransaction("setSelectedNodeValues");
        },

        destroy: function() {

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