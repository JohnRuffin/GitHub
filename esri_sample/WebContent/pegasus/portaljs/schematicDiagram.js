/**
 * creates/initializes the schematic diagram
 * @param diagramDiv		- html div container / a place holder for schematic diagram. 
 * @param diagramOptions	- any additional / custom gojs diagram options...
 * @returns {SchematicDiagram}
 */
function SchematicDiagram(diagramDiv, diagramOptions) {
    this.diagramDiv = diagramDiv;
    this.$s$ = go.GraphObject.make;
    if (!diagramOptions) {
        diagramOptions = this.getDefaultSchematicOptions();
    }
    //creates and initializes a gojs diagram
    this.diagram = this.$s$(go.Diagram, diagramDiv, diagramOptions);
    //enabling the mouse zoom functionality
    this.diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
    this.diagram.commandHandler.archetypeGroupData = {
        isGroup: true
    };
    /**
     * is a map of node templates
     * map<<template Name>, {go.part}> 
     */ 
    this.nodeTemplateMap = new go.Map("string", go.Part);
    /**
     * is a map of link templates
     * map<<template Name>, {go.Link}> 
     */
    this.linkTemplateMap = new go.Map("string", go.Link);
    /**
     * is a map of group templates
     * map<<template Name>, {go.Part}> 
     */
    this.groupTemplateMap = new go.Map("string", go.Part);
    this.globalStylesMap;
    this.linkClickHandler;
    this.defaultNodeWidth = 40;
    this.defaultNodeHeight = 20;
    this.defaultLinkSpacing = 10;

    this.groupNodesMap = new go.Map("string", go.Node);
    this.groupColsIdMap;
    this.groupColsIndexMap;
    this.noOfGroupColumns;
    this.nodePositionsMap = {};
    this.isOptimizedPlacement = false;
}
/**
 * returns the schematic diagram width...
 * @returns
 */
SchematicDiagram.prototype.getDiagramDivWidth = function() {
    return document.getElementById(this.diagramDiv).clientWidth;
};

/**
 * returns the schematic diagram height
 * @returns
 */
SchematicDiagram.prototype.getDiagramDivHeight = function() {
    return document.getElementById(this.diagramDiv).clientHeight;
};

/**
 * adding/loading the ecosystem layer  
 * @param layerData
 * @returns {Boolean}
 */
SchematicDiagram.prototype.addEcosystemLayer = function(layerData) {
    //try {
	//loading /initializing the global styles map
    this.globalStylesMap = this.getGlobalStylesMap(layerData.globalStyles);
    //get the default group template
    this.diagram.groupTemplate = this.getDefaultGroupTemplate();
    //initialize the template(s)
    this.initializeTemplates(layerData.globalStyles);

    var models = layerData.models;
    if (models) {
        var noOfModels = models.length;
        var templateType;
        var style;
        var styleCustomProperties;
        var attributes;
        var nodesArray = [];
        var linksArray = [];
        var fromAttribute;
        var toAttribute;
        var positionStr;
        var groupId;

        var noOfColumns = 0;
        var noOfRows = 0;

        if (layerData.properties) {
            var layerDataProperties = layerData.properties;
            if (layerDataProperties.noOfColumns) {
                noOfColumns = parseInt(layerDataProperties.noOfColumns);
                if (noOfColumns <= 0) {
                    noOfColumns = 1;
                }
            }
            if (layerDataProperties.noOfRows) {
                noOfRows = parseInt(layerDataProperties.noOfRows);
                if (noOfRows <= 0) {
                    noOfRows = 1;
                }
            }
            if (layerDataProperties.defaultNodeWidth) {
                this.defaultNodeWidth = parseInt(layerDataProperties.defaultNodeWidth);
                if (this.defaultNodeWidth <= 0) {
                    this.defaultNodeWidth = 1;
                }
            }
            if (layerDataProperties.defaultLinkSpacing) {
                this.defaultLinkSpacing = parseInt(layerDataProperties.defaultLinkSpacing);
                if (this.defaultLinkSpacing <= 0) {
                    this.defaultLinkSpacing = 1;
                }
            }
        }

        var groupsSet;
        if (noOfRows > 0 || noOfColumns > 0) {
            groupsSet = new go.Set("string");
        }

        for (var i = 0; i < noOfModels; i++) {
            style = this.globalStylesMap[models[i].styleId];
            if (!style) {
                continue;
            }
            styleCustomProperties = style.customProperties;
            templateType = styleCustomProperties.templateType;

            models[i].category = models[i].styleId;
            attributes = models[i].attributes;
            if (templateType == "node") {
                models[i].key = models[i].name;
                if (styleCustomProperties.isAddPosition) {
                    if (this.isOptimizedPlacement || this.nodePositionsMap == undefined || this.nodePositionsMap[models[i].key] == undefined) {
                        models[i].loc = this.getNodePosition(models[i].coordinate);
                    } else {
                        models[i].loc = new go.Point(this.nodePositionsMap[models[i].key].x, this.nodePositionsMap[models[i].key].y);
                    }
                }
                groupId = this.getAttributeValue(attributes, "groupId");
                if (groupId) {
                    models[i].group = groupId;
                    if (groupsSet) {
                        groupsSet.add(groupId);
                    }
                }
                nodesArray.push(models[i]);
            } else if (templateType == "link") {
                if (!models[i].from && styleCustomProperties.fromAttribute) {
                    models[i].from = this.getAttributeValue(attributes, styleCustomProperties.fromAttribute);
                }
                if (!models[i].to && styleCustomProperties.toAttribute) {
                    models[i].to = this.getAttributeValue(attributes, styleCustomProperties.toAttribute);
                }
                linksArray.push(models[i]);
            }
        }
    }

    if (this.isOptimizedPlacement && (noOfRows > 0 || noOfColumns > 0)) {
        this.initializeGroups(groupsSet, nodesArray, noOfColumns, noOfRows);
    }


    //var layout = new go.LayeredDigraphLayout();
    //layout.direction = parseFloat(270, 10);

    //this.diagram.layout = layout;
    this.diagram.model = new go.GraphLinksModel(nodesArray, linksArray);
    if (this.isOptimizedPlacement) {
        this.arrangeNodes(this.diagram.model, this.defaultNodeWidth, this.defaultLinkSpacing);
    }
    //this.setPositions(this.diagram.model);
/*
	  	if(noOfRows > 0 || noOfColumns > 0) {
  			this.arrangeGroups();
  		}
  		*/

    //} catch(e) {
    //alert("Error ["+e.message+"], while loading the schematic view");
    //return false;
    //}
    return true;
};



SchematicDiagram.prototype.arrangeGroups = function() {
    var schematicDiagram = this;
    this.diagram.delayInitialization(function() {
        var groupNodesMap = schematicDiagram.groupNodesMap;
        var it = groupNodesMap.iterator;
        var groupId;
        var data;
        var rowIndex = 0;
        var colIndex = 0;
        var colId = 0;
        var groupIdArray;

        var prevColIndex;
        var prevRowIndex;
        var prevNode;

        var maxX = 0;
        var maxY = 0;
        while (it.next()) {
            groupId = it.key;
            groupIdArray = groupId.split("_");
            rowIndex = parseInt(groupIdArray[0]);
            colId = parseInt(groupIdArray[1]);
            colIndex = schematicDiagram.groupColsIdMap[colId];
            if (colIndex > 0 && colIndex < schematicDiagram.noOfGroupColumns) {
                maxX = 0;
                maxY = 0;
                var newIterator = groupNodesMap.iterator;
                while (newIterator.next()) {
                    prevColIndex = schematicDiagram.groupColsIdMap[parseInt(newIterator.key.split("_")[1])];
                    prevRowIndex = parseInt(newIterator.key.split("_")[0]);
                    if ((rowIndex == 0 && prevColIndex == colIndex - 1) || (rowIndex > 0 && prevColIndex == colIndex)) {
                        prevNode = schematicDiagram.diagram.findNodeForData(newIterator.value);
                        if (prevNode) {
                            if (rowIndex > 0) {
                                if (prevRowIndex == rowIndex - 1) {
                                    maxX = prevNode.location.x;
                                }
                                if (prevRowIndex == rowIndex) {
                                    maxY = Math.max(maxY, prevNode.location.y + prevNode.measuredBounds.height);
                                }
                            } else {
                                maxX = Math.max(maxX, prevNode.location.x + prevNode.measuredBounds.width);
                            }
                            //console.log(colIndex +" === "+prevColIndex );
                            //console.log(newIterator.key+"   - "+prevNode.location.y+" "+prevNode.location.y);
                        }
                    }
                }
                //console.log(rowIndex+"_"+colIndex +" "+maxX+" "+maxY);		
                if (maxX > 0 || maxY > 0) {
                    data = it.value;
                    var group = schematicDiagram.diagram.findNodeForData(data);
                    if (group !== null) {
                        if (maxX <= 0) {
                            maxX = group.location.x;
                        }
                        if (maxY <= 0) {
                            maxY = group.location.y;
                        }
                        group.move(new go.Point(maxX, maxY));
                    }
                }
            }
        }
    });

};

/**
 * @param model - this.diagram.model object
 * @param defaultNodeWidth - deafult node width provided in STAD
 * @param defaultLinkSpacing - default link spacing/gap provided in STAD
 */
SchematicDiagram.prototype.arrangeNodes = function(model, defaultNodeWidth, defaultLinkSpacing) {
    var schematicDiagram = this;
    var diagram = this.diagram;
    var lineCount = 1;
    var schematicNodeHeight;
    var divHeight = this.getDiagramDivHeight();
    this.diagram.delayInitialization(function() {
        diagram.startTransaction("arrangeNodes");
        var dataArr = diagram.model.nodeDataArray;
        var position;
        var positionsMap = getSchematicDiagramPositions();
        if (positionsMap == undefined) {
            return;
        }
        for (var i = 0; i < dataArr.length; i++) {
            var data = dataArr[i];
            if (!data.isGroup) {
                var node = diagram.findNodeForData(data);
                if (node != null) {
                    model.setDataProperty(node.part.data, "size", defaultNodeWidth + ", " + schematicDiagram.getSchematicNodeHeight(node, defaultLinkSpacing));
                    position = positionsMap[data.key];
                    if (position != undefined) {
                        data.loc = new go.Point(position.x, position.y);
                    }
                    node.move(data.loc);
                }
            } else {
                var group = diagram.findNodeForData(data);
                if (group !== null) {
                    group.move(data.loc);
                }
            }
        }
        diagram.commitTransaction("arrangeNodes");
    });

};

/**
 * get the positions of the schematic nodes 
 * @param model
 * @returns {Array}
 */
SchematicDiagram.prototype.getPositions = function() {
    var schematicDiagram = this;
    var diagram = this.diagram;
    var model = diagram.model;
    diagram.startTransaction("getPositions");

    var group;

    var dataArr = diagram.model.nodeDataArray;
    var positions = {};
    for (var i = 0; i < dataArr.length; i++) {
        var nodeData = dataArr[i];
        if (nodeData.isGroup) {
            group = diagram.findNodeForData(nodeData);
            if (group !== null) {
                positions[nodeData.key] = {
                    isGroup: true,
                    key: nodeData.key,
                    x: nodeData.loc.x,
                    y: nodeData.loc.y
                };
            }
        } else {
            group = diagram.findNodeForData(nodeData);
            if (group != null) {
                positions[nodeData.key] = {
                    isGroup: false,
                    key: nodeData.key,
                    x: nodeData.loc.x,
                    y: nodeData.loc.y
                };
            }
        }
    }
    diagram.commitTransaction("getPositions");
    return positions;
};

/**
 * get the link states <b>deprecated</b>
 * @param model
 * @returns {Array}
 */
SchematicDiagram.prototype.getLinkStates = function(model) {
    var schematicDiagram = this;
    var diagram = this.diagram;
    diagram.startTransaction("getLinkStates");
    var json = [];
    var linkPart;

    var linkArr = diagram.model.linkDataArray;
    var obj;
    for (var i = 0; i < linkArr.length; i++) {
        var link = linkArr[i];
        linkPart = diagram.findLinkForData(link);
        if (linkPart !== null) {
            //obj = {key: link.key, x:link.loc.x, y: link.loc.y};
            json.push(obj);
        }
    }
    diagram.commitTransaction("getLinkStates");
    return json;
};


/**
 * expand the links (lanes / legs)
 * @param link
 * @param schematicDiagramObj
 */
SchematicDiagram.prototype.expandView = function(link, childNodeDetailsAttr, countAttr, styleAttr) {
    var schematicDiagramObj = this;
    //get the gojs schematic diagram
    var diagram = schematicDiagramObj.diagram;
    diagram.startTransaction("expandView");
    var nodeHeight;
    //clone the source link data
    var cloneLinkData = clone(link.part.data);
    //remove the source link from schematic viewer
    diagram.model.removeLinkData(link.part.data);
    
    //get the origin schematic node
    var linkFromNode = diagram.findPartForKey(cloneLinkData.from);
    //get the destination schematic node 
    var linkFromTo = diagram.findPartForKey(cloneLinkData.to);
    
    //total number of links that need to be created
    var laneCount = parseInt(cloneLinkData.attributes[countAttr]);

    var lanesArray = [];
    var cloneAttributes;
    if (laneCount) {
    	//get the lane / leg activities
        var laneActivities = cloneLinkData.attributes[childNodeDetailsAttr];
        //get the lane/leg count 
        var laneCount = laneActivities ? laneActivities.length : 0;
        for (var i = 0; i < laneCount; i++) {
        	//clone the require properties and create the data object for childs links
            cloneAttributes = clone(cloneLinkData.attributes);
            cloneAttributes[childNodeDetailsAttr] = [laneActivities[i]];
            cloneAttributes[countAttr] = "";
            //create and add the child links...
            lanesArray[i] = getChildNetworkModel(cloneLinkData, cloneAttributes, laneActivities[i], i, styleAttr);
            diagram.model.addLinkData(lanesArray[i]);
        }
    }

    var nodeHeight;
    //if the origin of the link  is a hub
    if (!cloneLinkData.attributes.Origin.hub) {
    	// and then the origin of the link is not same as  hub node  
        if ((cloneLinkData.attributes.Origin.locCd == linkFromNode.part.data.name)) {
        	//compute and get the node height
            nodeHeight = linkFromNode.height > laneCount * schematicDiagramObj.defaultLinkSpacing ? linkFromNode.part.height : laneCount * schematicDiagramObj.defaultLinkSpacing;
            //set the node property
            diagram.model.setDataProperty(linkFromNode.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
        // and then the destination of the link is not same as  hub node
        if ((cloneLinkData.attributes.Origin.locCd == linkFromTo.part.data.name)) {
        	//then compute the node height
            nodeHeight = linkFromTo.height > laneCount * schematicDiagramObj.defaultLinkSpacing ? linkFromTo.part.height : laneCount * schematicDiagramObj.defaultLinkSpacing;
            //set the node property
            diagram.model.setDataProperty(linkFromTo.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
    }


    //if the destination of a link is hub
    if (!cloneLinkData.attributes.Destination.hub) {
    	// and then the origin of the link is not same as  hub node 
        if ((cloneLinkData.attributes.Destination.locCd == linkFromNode.part.data.name)) {
        	//compute and get the node height
            nodeHeight = parseInt(getSchematicNodeSizeByHeight(linkFromNode.part.data.size)) > laneCount * schematicDiagramObj.defaultLinkSpacing ? parseInt(getSchematicNodeSizeByHeight(linkFromNode.part.data.size)) : laneCount * schematicDiagramObj.defaultLinkSpacing;
            diagram.model.setDataProperty(linkFromNode.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
     // and then the destination of the link is not same as  hub node
        if ((cloneLinkData.attributes.Destination.locCd == linkFromTo.part.data.name)) {
        	//compute and get the node height
            nodeHeight = parseInt(getSchematicNodeSizeByHeight(linkFromTo.part.data.size)) > laneCount * schematicDiagramObj.defaultLinkSpacing ? parseInt(getSchematicNodeSizeByHeight(linkFromTo.part.data.size)) : laneCount * schematicDiagramObj.defaultLinkSpacing;;
            diagram.model.setDataProperty(linkFromTo.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
    }

    // add the link (expandable link...)
    diagram.model.addLinkData({
        "attributes": clone(cloneLinkData.attributes),
        "category": "ExpStyle",
        "coordinates": cloneLinkData.coordinates,
        "name": cloneLinkData.name,
        "styleId": cloneLinkData.styleId,
        "from": cloneLinkData.to,
        "to": cloneLinkData.from,
        "type": cloneLinkData.type,

        "lanesArray": lanesArray
    });
    
    diagram.commitTransaction("expandView");
    schematicDiagramObj.setPositions(diagram.model);

};

/**
 * collapse the links (lane / leg )
 * @param link
 * @param childNodeDetailsAttr
 * @param countAttr
 * @param styleAttr
 */
SchematicDiagram.prototype.collapseView = function(link, childNodeDetailsAttr, countAttr, styleAttr) {
    var schematicDiagramObj = this;
    var diagram = schematicDiagramObj.diagram;
    diagram.startTransaction("collapseLinks");
    var cloneLinkData = clone(link.part.data);
    //remove the link that is source of click event
    diagram.model.removeLinkData(link.part.data);
    //source link origin
    var linkFromNode = diagram.findPartForKey(cloneLinkData.from);
    //source link destination
    var linkFromTo = diagram.findPartForKey(cloneLinkData.to);
    var lanesArray = cloneLinkData.lanesArray;
    //cloneAttributes.NoOfLanes = lanesArray.length; 
    diagram.model.addLinkData({
        "attributes": clone(cloneLinkData.attributes),
        "category": cloneLinkData.styleId,
        "coordinates": cloneLinkData.coordinates,
        "name": cloneLinkData.name,
        "styleId": cloneLinkData.styleId,
        "from": cloneLinkData.from,
        "to": cloneLinkData.to,
        "type": cloneLinkData.type,
        "linkText": "--",
        "tempLinkColor": cloneLinkData.linkBoxColor,
        "tempLinkText": cloneLinkData.linkText,
        "lanesArray": lanesArray

    });


    //remove all the other links
    if (lanesArray) {
        for (var i = 0; i < lanesArray.length; i++) {
            var t = diagram.findPartForData(lanesArray[i]);
            diagram.model.removeLinkData(t.part.data);
        }
    }
    
    //re-compute the node height
    var nodeHeight;
    if (!cloneLinkData.attributes.Origin.hub) {
        if ((cloneLinkData.attributes.Origin.locCd == linkFromNode.part.data.name)) {
            nodeHeight = schematicDiagramObj.getSchematicNodeHeight(linkFromNode, schematicDiagramObj.defaultLinkSpacing);
            diagram.model.setDataProperty(linkFromNode.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }

        if ((cloneLinkData.attributes.Origin.locCd == linkFromTo.part.data.name)) {
            nodeHeight = schematicDiagramObj.getSchematicNodeHeight(linkFromTo, schematicDiagramObj.defaultLinkSpacing);
            diagram.model.setDataProperty(linkFromTo.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
    }



    if (!cloneLinkData.attributes.Destination.hub) {
        if ((cloneLinkData.attributes.Destination.locCd == linkFromNode.part.data.name)) {
            nodeHeight = schematicDiagramObj.getSchematicNodeHeight(linkFromNode, schematicDiagramObj.defaultLinkSpacing);
            diagram.model.setDataProperty(linkFromNode.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
        if ((cloneLinkData.attributes.Destination.locCd == linkFromTo.part.data.name)) {
            nodeHeight = schematicDiagramObj.getSchematicNodeHeight(linkFromTo, schematicDiagramObj.defaultLinkSpacing);
            diagram.model.setDataProperty(linkFromTo.part.data, "size", schematicDiagramObj.defaultNodeWidth + ", " + nodeHeight);
        }
    }
    var clonedPositions = schematicDiagramObj.getPositions();
    diagram.commitTransaction("collapseLinks");
    schematicDiagramObj.setPositions(diagram.model);

};



/**
 * set node positions
 * @param model
 * @param positionObject
 * - 
 */
SchematicDiagram.prototype.setPositions = function(positionsMap) {

    var schematicDiagram = this;
    var diagram = this.diagram;
    var model = diagram.model;
    diagram.startTransaction("setPositions");
    //schematicDiagram.setFavoriteLocationPositionsMap(positionsMap);
    //var positionsMap = schematicDiagram.getFavoriteLocationPositionsMap();

    if (positionsMap != null) {
        var group;

        diagram.delayInitialization(function() {
        	//iterate all the nodes
            var dataArr = diagram.model.nodeDataArray;
            for (var i = 0; i < dataArr.length; i++) {
                var d = dataArr[i];
                var sib;
                //check whether the node is a group
                if (d.isGroup) {
                	// get the data for the group node
                    group = diagram.findNodeForData(d);
                    if (group !== null) {
                    	//get the position for the node from positionsMap
                        sib = positionsMap[d.key];
                        //create a new loction 
                        d.loc = new go.Point(sib.x, sib.y);
                        //move to new location...
                        group.move(d.loc);
                    }

                } else {
                	//if the node is not a group node...
                    group = diagram.findNodeForData(d);
                    if (group != null) {
                    	//then get the node postion
                        sib = positionsMap[d.key];
                        if (sib) {
                        	//create the new location/position
                            d.loc = new go.Point(sib.x, sib.y);
                        } 
                        //move to new location...
                        group.move(d.loc);
                    }
                }
            }
        });
    }
    diagram.commitTransaction("setPositions");
};

/**
 * returns the schematic node height
 * @param node
 * @param defaultLinkSpacing
 * @returns
 */
SchematicDiagram.prototype.getSchematicNodeHeight = function(node, defaultLinkSpacing) {
    var lineCount;
    var schematicNodeHeight;
    if (node != null) {
    	/*
    	 * logic that computes the height of the node based on the links that come into and go out of the node 
    	 */
    	//get the link count
        lineCount = node.findNodesInto().count > node.findNodesOutOf().count ? node.findNodesInto().count : node.findNodesOutOf().count;
        if (lineCount > 1) {
        	//compute the schematic node height
            schematicNodeHeight = (lineCount * defaultLinkSpacing);
            if (this.getDiagramDivHeight() < schematicNodeHeight) {
                schematicNodeHeight = parseInt(this.getDiagramDivHeight() * 0.90);
            }
            return schematicNodeHeight;
        }
    }
    return this.defaultNodeHeight;
};

/**
 * <b>this method is deprecated...</b>
 * @param groupsSet
 * @param nodesArray
 * @param noOfColumns
 * @param noOfRows
 */
SchematicDiagram.prototype.initializeGroups = function(groupsSet, nodesArray, noOfColumns, noOfRows) {
    var groupId;
    var divWidth = this.getDiagramDivWidth();
    var divHeight = this.getDiagramDivHeight();
    if (groupsSet && divWidth > 0 && divHeight > 0) {

        var iterator = groupsSet.iterator;
        var minCol = 0;
        var groupArr;
        var colsSet = new go.Set("number");
        var colIndex;
        while (iterator.next()) {
            groupId = iterator.value;
            groupArr = groupId.split("_");
            colIndex = parseInt(groupArr[1]);
            colsSet.add(colIndex);
            minCol = Math.min(minCol, colIndex);
        }

        var colsArray = colsSet.toArray();
        colsArray.sort(function(a, b) {
            return a - b;
        });

        this.groupColsIdMap = {};
        this.groupColsIndexMap = {};
        for (var i = 0; i < colsArray.length; i++) {
            this.groupColsIdMap[colsArray[i]] = i;
            this.groupColsIndexMap[i] = colsArray[i];
        }
        noOfColumns = colsSet.count;
        this.noOfGroupColumns = noOfColumns;

        var boxWidth = Math.round(divWidth / noOfColumns);
        var boxHeight = Math.round(divHeight / noOfRows);
        var node;
        for (var j = 0; j < noOfRows; j++) {
            for (var i = 0; i < noOfColumns; i++) {
                groupId = j + "_" + this.groupColsIndexMap[i];
                if (!groupsSet.contains(groupId)) {
                    continue;
                }
                node = {
                    key: groupId,
                    isGroup: true,
                    loc: new go.Point(i * boxWidth, j * boxHeight)
                };
                this.groupNodesMap.add(groupId, node);
                nodesArray.push(node);
            }
        }
    }
};

SchematicDiagram.prototype.clear = function() {
    this.diagram.clear();
};

/**
 * split the coordinate string and get the position 
 * @param coordStr
 * @returns {go.Point}
 */
SchematicDiagram.prototype.getNodePosition = function(coordStr) {
    var locStr;
    if (coordStr) {
        var locsArray = coordStr.split(",");
        //locStr = parseInt(locsArray[0])+" "+parseInt(locsArray[1]);
        return new go.Point(parseInt(locsArray[0]), parseInt(locsArray[1]));
    }

    return locStr;
};


SchematicDiagram.prototype.getAttributeValue = function(obj, propertyString) {
    if (obj) {
        var properties = propertyString.split(".");
        var arrayIndex = 0;
        var toIndex = 0;
        var property;
        var index = -1;
        for (var i = 0; i < properties.length; i++) {
            index = -1;
            arrayIndex = properties[i].indexOf("[");
            if (arrayIndex > 0) {
                property = properties[i].substring(0, arrayIndex);
                toIndex = properties[i].indexOf("]");
                index = parseInt(properties[i].substring(arrayIndex + 1, toIndex));
            } else {
                property = properties[i];
            }
            if (index >= 0) {
                obj = obj[property][index];
            } else {
                obj = obj[property];
            }
        }
    }
    return obj;
};

SchematicDiagram.prototype.getDefaultSchematicOptions = function() {
    //initialAutoScale : go.Diagram.UniformToFill,
    //initialContentAlignment:go.Spot.Center

    return {
        _widthFactor: 1,
        allowZoom: true,
        scale: .9
    };
};

SchematicDiagram.prototype.getDiagramModel = function() {
    return this.diagram.model;
};

/**
 * initialize all the templates which includes the node templates and link templates..
 * @param globalStyles
 */
SchematicDiagram.prototype.initializeTemplates = function(globalStyles) {
    if (globalStyles) {
        var noOfStyles = globalStyles.length;
        if (noOfStyles > 0) {
            var styleCustomProperties;
            var templateName;
            var templateType;
            var template;
            //iterate all the styles
            for (var i = 0; i < noOfStyles; i++) {
            	//get the style property
                styleCustomProperties = globalStyles[i].customProperties;
                //get the style template name
                templateName = styleCustomProperties.templateName;
                // get the template type...
                templateType = styleCustomProperties.templateType;
                if (!templateName || !templateType) {
                    alert('templateName and templateType properties need to be defined in the style');
                }
                //if the template is for node 
                if (templateType == "node") {
                	//then get the node template 
                    template = this.getNodeTemplateByName(templateName, globalStyles[i]);
                    //load the gojs node template map
                    if (template) {
                        this.nodeTemplateMap.add(globalStyles[i].id, template);
                    }
                } else if (templateType == "link") {
                    template = this.getLinkTemplateByName(templateName, globalStyles[i]);
                    if (template) {
                        this.linkTemplateMap.add(globalStyles[i].id, template);
                    }
                } else if (templateType == "group") {}
            }

            this.diagram.nodeTemplateMap = this.nodeTemplateMap;
            this.diagram.linkTemplateMap = this.linkTemplateMap;
        }
    }
};

/**
 * returns the node template 
 * @param	templateName		template name that need to search for
 * @param 	style				style object
 */
SchematicDiagram.prototype.getNodeTemplateByName = function(templateName, style) {
    var nodeTemplate;

    if (templateName == "defaultNode") {
    	//if the template name is default then return the default node template
        nodeTemplate = this.getDefaultNodeTemplate(style);
    }

    return nodeTemplate;
};

/**
 * @param	templateName		template name that need to search for
 * @param 	style				style object
 */
SchematicDiagram.prototype.getLinkTemplateByName = function(templateName, style) {
    var linkTemplate;

    if (templateName == "defaultLink") {
        linkTemplate = this.getDefaultLinkTemplate(style);
    }

    return linkTemplate;
};

/**
 * returns the link template by style id
 * @param styleId
 * @returns
 */
SchematicDiagram.prototype.getLinkTemplateByStyleId = function(styleId) {
    return this.linkTemplateMap.getValue(styleId);
};

/**
 * return the default node template for schematic diagram
 * @param style
 * @returns
 */
SchematicDiagram.prototype.getDefaultNodeTemplate = function(style) {
	var schmeaticDiagram = this;
    var shapeProperties = {};
    var textProperties = {};
    var textKey;

    /*
     * renderering the schematic node 
     * 	- schematic node shape styles
     * 	- schematic node label styles 
     */	
    if (style) {
        var iconStyle = style.icon;
        /*
         * iconStyles are for schematic node representation and styles
         */
        if (iconStyle) {
        	//get the hex color
            fillColor = this.toHexColor(iconStyle.color);
            //get the icon style properties
            var iconStyleProperties = iconStyle.customProperties;
            if (iconStyleProperties) {
            	//if the icon shape is not defined  
                if (!iconStyleProperties.shapeType) {
                	//then provide the default shape...
                    shapeProperties.figure = "RoundedRectangle";
                } else {
                	//else draw the shape that is define in the style properties...
                    shapeProperties.figure = iconStyleProperties.shapeType;
                }
                //set the color for filling the style...
                shapeProperties.fill = this.toHexColor(iconStyle.color);
                //set the border color 
                shapeProperties.stroke = this.toHexColor(iconStyleProperties.borderColor);
                //set the border width
                shapeProperties.strokeWidth = iconStyleProperties.borderWidth;
                //set the width of the schematic node...
                if (iconStyleProperties.width) {
                    shapeProperties.width = parseInt(iconStyleProperties.width);
                }
                //set the height of the schematic node...
                if (iconStyleProperties.height) {
                    shapeProperties.height = parseInt(iconStyleProperties.height);
                }
                //if the style is having click event taht need to bind to the schematic node 
                if (iconStyleProperties.hasOwnProperty("click")) {
                	//then bind the click event to the schematic node...
                    shapeProperties["click"] = window[iconStyleProperties["click"]];
                }
                
                //bind the mouse leave event so that to track the node positions & update the same...
                shapeProperties["mouseLeave"] = function(event, object){
                	schmeaticDiagram.updateNodePosition(event, object);
                };
            }
        }
        
        /*
         * schematic node label styles
         */
        var labelStyle = style.label;
        if (labelStyle) {
        	//text color...
            textProperties.stroke = this.toHexColor(labelStyle.color);
            var labelStyleProperties = labelStyle.customProperties;
            if (labelStyleProperties) {
            	//text font style... 
                textProperties.font = labelStyleProperties.font;
                //text align...
                textProperties.textAlign = labelStyleProperties.align;
                //text margin...
                textProperties.margin = parseInt(labelStyleProperties.margin);
            }
        }
    }
    
    //text property that needs to be bind to the schematic node element
    if (!textKey) {
        textKey = "name";
    }
    
    if (!textProperties.margin) {
        textProperties.margin = 5;
    }
    /*
     * here is the logic to create a node with inbound(from spot) and outbound(to spot) with all sides.
     * 	- position of the node is dynamic and binded to the property "loc"
     * 	- shape of the schematic node is renderes by shapeProperties
     * 	- text block  on the schematic node is rendered by textProperties
     * 	- text on the text block is rendered dynamically by the "textKey" or "name" property
     */
    return this.$s$(go.Node, go.Panel.Auto, {
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
    }, new go.Binding("location", "loc").makeTwoWay(), this.$s$(go.Shape, shapeProperties, new go.Binding("desiredSize", "size", go.Size.parse)), this.$s$(go.TextBlock, textProperties, new go.Binding("text", textKey)));
};

/**
 * Updates the positions of the nodes in nodePositionsMap
 * @param event  gojs Event
 * @param object go.Shape object
 */
SchematicDiagram.prototype.updateNodePosition = function(event, object) {
	//get the node data
	var nodeData = object.part.data;
	//if the nodePositionsMap is not initialized then initialize it 
    if(this.nodePositionsMap == undefined){
        this.nodePositionsMap = {};
    }
    //if the node position for the selected node is available then... 
    if(this.nodePositionsMap[nodeData.key] != undefined){
    	//update the positions of the location
        this.nodePositionsMap[nodeData.key].x = nodeData.loc.x;
        this.nodePositionsMap[nodeData.key].y = nodeData.loc.y;
    }else {
    	//else create a position and save in the nodePositionsMap 
        this.nodePositionsMap[nodeData.key] = {
          isGroup: false,
          key: nodeData.key,
          x: nodeData.loc.x,
          y: nodeData.loc.y
        };
    } 
    //update the global object hodling the node positions    
    setSchematicDiagramPositions(this.nodePositionsMap); 
};
/**
 * returns the default link template
 * @param style
 * @returns {go.Link}
 */
SchematicDiagram.prototype.getDefaultLinkTemplate = function(style) {
    var link = new go.Link();
    //link rouitng types 
    //link.curve= go.Link.Bezier;
    var lineCustomProperties;
    var lineProperties;
    var schmeaticDiagram = this;
    if (style) {
    	//get the line style properties 
        var lineStyle = style.line;
        if (lineStyle) {
        	//get the custom /addtional properties of the line that are defined in ecosystem
            lineCustomProperties = lineStyle.customProperties;
            if (lineCustomProperties) {
                lineProperties = lineCustomProperties.lineProperties;
                if (lineProperties) {
                	//if the link have the click event that need to bind
                    if (lineProperties.hasOwnProperty("click")) {
                    	//then bind the click event to link element
                        lineProperties["click"] = window[lineProperties["click"]];
                    }
                    //indicates whether the link to be represented as dashed link...
                    if (lineProperties.strokeDashArray) {
                    	var strokeArray = lineProperties.strokeDashArray.split(",").map(function (x) { 
                    	    return parseInt(x, 10);
                    	});
                        lineProperties.strokeDashArray = strokeArray;
                    }
                }
            }

            if (lineProperties == undefined) {
                lineProperties = {};
            }
            //get the link color
            if (lineStyle.color) {
            	//set the link color
                lineProperties.stroke = this.toHexColor(lineStyle.color);
            } else {
            	//reset the link color
                lineProperties.stroke = null;
            }
            
            if(lineProperties != undefined){
            	//initialize the link
                link.add(this.$s$(go.Shape, lineProperties));
            }

            if (lineCustomProperties) {
            	//get the line symbols
                var lineSymbols = lineCustomProperties.lineSymbols;
                if (lineSymbols) {
                    var symbolType;
                    var textAttributeFn;
                    var symbolProperties;
                    //iterate over all the line symbols...
                    for (var i = 0; i < lineSymbols.length; i++) {
                    	//generate the symbol properteis 
                        symbolProperties = this.getLineSymbolProperties(lineCustomProperties[lineSymbols[i]]);
                        //get the symbol type
                        symbolType = symbolProperties.symbolType;
                        if (symbolType) {
                            delete symbolProperties["symbolType"];
                            //if the symbol type is text 	
                            if (symbolType == "text") {
                            	//add the text block to the link 
                                textAttributeFn = symbolProperties.textAttributeFn;
                                if (textAttributeFn) {
                                    delete symbolProperties["textAttributeFn"];
                                    link.add(this.$s$(go.TextBlock, symbolProperties, new go.Binding("text", "attributes", window[textAttributeFn])));
                                } else {
                                    link.add(this.$s$(go.TextBlock, symbolProperties));
                                }
                            } else if (symbolType == "shape") {
                                link.add(this.$s$(go.Shape, symbolProperties));
                            }
                        }
                    }
                }
            }

            //bind the click event on the link template ...
            if (this.linkClickHandler) {
                link.click = this.linkClickHandler;
            }
        }
    }
    return link;
};

/**
 * logic to place the symbol on the link. 
 * @param symbolProperties
 * @returns
 */
SchematicDiagram.prototype.getLineSymbolProperties = function(symbolProperties) {
	//check for segment Orientation 
    if (symbolProperties.hasOwnProperty("segmentOrientation")) {
    	//set the segment orientation
        symbolProperties.segmentOrientation = go.Link[symbolProperties.segmentOrientation];
    }
    //check for segment offsetx and segment offset y
    if (symbolProperties.hasOwnProperty("segmentOffsetX") && symbolProperties.hasOwnProperty("segmentOffsetY")) {
    	//create the segment offset
        if (symbolProperties["segmentOffsetX"] == "NaN" || symbolProperties["segmentOffsetY"] == "NaN") {
            symbolProperties.segmentOffset = new go.Point(NaN, NaN);
        } else {
            symbolProperties.segmentOffset = new go.Point(parseInt(symbolProperties.segmentOffsetX), parseInt(symbolProperties.segmentOffsetY));
        }
        delete symbolProperties["segmentOffsetX"];
        delete symbolProperties["segmentOffsetY"];
    }
    //bind the click event on the symbol 
    if (symbolProperties.hasOwnProperty("click")) {
        symbolProperties["click"] = window[symbolProperties["click"]];
    }
    return symbolProperties;
};


SchematicDiagram.prototype.setLinkClickHandler = function(clickHandler) {
    this.linkClickHandler = clickHandler;
};

/**
 * retuns the schematic group template [deprecated]
 * @returns 
 */
SchematicDiagram.prototype.getDefaultGroupTemplate = function() {
	/*
	 * creates a group template with layered digraph  layout 
	 * 	- resizeable is true
	 * 	- dynamic position(s) binding to the "loc" varaible
	 * 	- having rounded rectangle as shape...
	 * 	- enabling two way binding...
	 */
    var groupTemplate = this.$s$(go.Group, go.Panel.Auto, {
        layout: this.$s$(go.LayeredDigraphLayout, {
            direction: 0,
            columnSpacing: .8
        })
    }, {
        resizable: true,
        resizeObjectName: "SHAPE"
    }, new go.Binding("position", "loc"), {
        selectable: true
    }, this.$s$(go.Shape, "RoundedRectangle", {
        name: "SHAPE",
        fill: null,
        stroke: null
    }, new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)), this.$s$(go.Placeholder, {
        padding: new go.Margin(2, 2)
    }));

/*
var groupTemplate = this.$s$(go.Group,  go.Panel.Auto,
									{ // define the group's internal layout
										layout: this.$s$(go.LayeredDigraphLayout,
											{ direction: 0, columnSpacing: .8 })
									},
	{ resizable: true, resizeObjectName: "SHAPE"
	},
	new go.Binding("position", "loc"),
	{
		selectable : true
	}, this.$s$(go.Shape, "RoundedRectangle", // the rectangular shape around the
	// members
	{
		name : "SHAPE",
		fill : null,
		stroke : "red"
	}, new go.Binding("desiredSize", "size", go.Size.parse)
			.makeTwoWay(go.Size.stringify)),
	 this.$s$(go.TextBlock, { alignment: go.Spot.TopLeft, alignmentFocus:
	 go.Spot.TopLeft, font: "normal 7pt arial" }, new go.Binding("text",
	  "key")),
	 this.$s$(go.Placeholder, {
		padding : new go.Margin(2, 2)
	}));
		*/

    return groupTemplate;

};

/**
 * loading the styles 
 * @param globalStyles
 * @returns {Object <styleId>, <styleObject>}
 */
SchematicDiagram.prototype.getGlobalStylesMap = function(globalStyles) {
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
};

/**
 * parse the colorStr having xxxxxxxx to xxxxxx while first two characters are opacity/transparency
 * @param colorStr
 * @returns	hex code color string
 */
SchematicDiagram.prototype.toHexColor = function(colorStr) {
    if (colorStr && colorStr.charAt(0) != '#') {
        return "#" + colorStr.substring(2);
    }

    return colorStr;
};

/**
 * returns the style object that is cached in globalStylesMap
 * @param styleId -- ID that is assigned to style object
 * @returns {Object}
 */
SchematicDiagram.prototype.getSchematicObjectStyle = function(styleId) {
    return this.globalStylesMap[styleId];
};