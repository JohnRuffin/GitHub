function TransitPopUp(linkObject, originObj, destinationObj, schematicDiagramObj, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn) {
	this.laneDetailPopUpWin;
	this.laneObject = linkObject;
	
	this.clonedLaneObject = clone(linkObject);
	this.clonedLaneObject.attributes.LaneActivities = [];
	
	this.originObj = originObj;  
	this.destinationObj = destinationObj;
	this.schematicDiagramObj = schematicDiagramObj;
	this.globalStylesMap = schematicDiagramObj.globalStylesMap;
	this.styleByIdFn = styleByIdFn;
	this.styleByNameFn = styleByNameFn;
	this.isTemplateAlreadyDefined = isTemplateAlreadyDefined;
	this.colorsMap = {};		
	this.originStyle = schematicDiagramObj.globalStylesMap[originObj.styleId];
	this.destinationStyle = schematicDiagramObj.globalStylesMap[destinationObj.styleId];
	if(this.originStyle && this.originStyle.icon && this.originStyle.icon.color) {
		this.colorsMap[originObj.name] = this.toHexColor(this.originStyle.icon.color);
	}
	if(this.destinationStyle && this.destinationStyle.icon && this.destinationStyle.icon.color) {
		this.colorsMap[destinationObj.name] = this.toHexColor(this.destinationStyle.icon.color);
	}
	
	this.isExist = false;	
	this.gridId;
	this.gridParentDivId;
	this.gridHeight;
	this.$s$ = go.GraphObject.make;
}

TransitPopUp.prototype.getColor = function(name) {
	if(this.colorsMap[name] == undefined) {
		var style = window[this.styleByNameFn](name);
		if(style && style.icon && style.icon.color) {
			this.colorsMap[name] = this.toHexColor(style.icon.color);
		}
	}
	
	return this.colorsMap[name];
};

TransitPopUp.prototype.getStyle = function(styleId) {
	if(styleId) {
		return window[this.styleByIdFn](styleId);
	}
};

TransitPopUp.prototype.showPopUp = function() {
	var laneDetailPopUp = this;
	if(!this.laneObject.id) {
		this.laneObject.id = Math.random().toString().replace(".","");
	}
	if(!this.isExist) {
		this.laneDetailPopUpWin = 	$("<div id='popUp_" + this.laneObject.id + "'/>").kendoWindow({
									width: "405px",
									height: "160px",
									draggable: true,
									modal: false,
									resizable: true,
									actions: ["close"],
									resize: function(){
										//laneDetailPopUp.onPopUpResize(laneDetailPopUp);
									},
									title: "Lane Detail (" +  this.laneObject.name + ")"
								});
		this.createLayout();
		this.isExist = true;
	}
	this.laneDetailPopUpWin.data("kendoWindow").open().center();
	this.laneDetailPopUpWin.parent().find('.k-window-content').css({
    	 "padding-left": "0px",
    	 "padding-right": "0px",
    	 "padding-botom": "0px"
    });
	return true;
};

TransitPopUp.prototype.toHexColor = function(colorStr) {
	if(colorStr && colorStr.charAt(0) != '#') {
		return "#"+colorStr.substring(2);
	}
	
	return colorStr;
};

TransitPopUp.prototype.createLayout = function() {
	var transitPopUp = this;
	var outerMainDiv = document.createElement("div");
	outerMainDiv.id = "transit_outerMainDiv_" + this.laneObject.id;
	outerMainDiv.style.overflow = "hidden";
	document.getElementById("popUp_" + this.laneObject.id).appendChild(outerMainDiv);
	
	var transitDiagram = this.createDiagram(outerMainDiv.id);
	transitDiagram.nodeTemplate = this.getNodeTemplate();
	transitDiagram.linkTemplateMap = this.schematicDiagramObj.linkTemplateMap;
	
	this.addTransitDetailsForAllActivities(transitDiagram);
	
	var div = document.createElement("div");
	div.style.textAlign = "center";
	var element = document.createElement("input");
	element.setAttribute("type", "button");
    element.setAttribute("value", "OK");
    element.onclick = function() {
    	closeTrasientPopUp(transitPopUp.laneObject.name);
    };
    outerMainDiv.appendChild(div).appendChild(element);
};


TransitPopUp.prototype.getLinkTemplate = function() {
	return this.$s$(go.Link,
	        { routing: go.Link.Orthogonal,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        corner: 4,
        selectionAdornmentTemplate:
          this.$s$(go.Adornment,
            this.$s$(go.Shape, { isPanelMain: true, stroke: "dodgerblue", strokeWidth: 3 })) },
      new go.Binding("points").makeTwoWay(),
      this.$s$(go.Shape));
	
};



TransitPopUp.prototype.addTransitDetailsForAllActivities = function(transitDiagram ) {
	
	if(this.laneObject.attributes && this.laneObject.attributes.LaneActivities) {
		var laneActivities = this.laneObject.attributes.LaneActivities;
		var linkDataArray = [];
		 var rightPorts =  [] ;
		 var leftPorts =  [] ;
		 var rightArray = [];
		 var leftArray = [];
		  
		 if(laneActivities){
			var tempLinkDataArray ;
			var attribute = new Object();
			attribute.LaneActivities = new Array();
			for(var k=0;k<laneActivities.length; k++){
				if(laneActivities[k].transits) {
					attribute.LaneActivities.push(laneActivities[k]);
					break;
				}
			}
			if(attribute.LaneActivities.length < 1){
				attribute = this.laneObject.attributes;
			}
			for(var k=0;k<laneActivities.length; k++){
				tempLinkDataArray = {"from":laneActivities[k].origin, "to":laneActivities[k].destination,
						"category": laneActivities[k].laneStyleId, "fromPort":laneActivities[k].originActivity+""+k,
						"toPort":laneActivities[k].destinationActivity+""+k,
						"attributes": attribute};
				linkDataArray.push(tempLinkDataArray);
				
				if(laneActivities[0].origin == laneActivities[k].origin){
					if(rightPorts.indexOf(tempLinkDataArray.fromPort) <0){
						rightPorts.push(tempLinkDataArray.fromPort);
						rightArray.push({"portColor":"#923951", "portId":tempLinkDataArray.fromPort});
					}
					
				}
				
				if(laneActivities[0].origin == laneActivities[k].destination){
					if(rightPorts.indexOf(tempLinkDataArray.toPort) <0){
						rightPorts.push(tempLinkDataArray.toPort);
						rightArray.push({"portColor":"#923951", "portId":tempLinkDataArray.toPort});
					}
					//rightPorts.push(tempLinkDataArray.toPort);
				}
				
				if(laneActivities[0].destination == laneActivities[k].origin){
					if(leftPorts.indexOf(tempLinkDataArray.fromPort) <0){
						leftPorts.push(tempLinkDataArray.fromPort);
						leftArray.push({"portColor":"#923951", "portId":tempLinkDataArray.fromPort});
					}
					
				}
				
				if(laneActivities[0].destination == laneActivities[k].destination){
					if(leftPorts.indexOf(tempLinkDataArray.toPort) <0){
						leftPorts.push(tempLinkDataArray.toPort);
						leftArray.push({"portColor":"#923951", "portId":tempLinkDataArray.toPort});
					}
					
				}
				
			}
		 }
		 
		 
		 
		  var nodeDataArray = [
								{ 	key: laneActivities[0].origin,
									name:laneActivities[0].origin, 
									figure:"RoundedRectangle",
									width: 100, 
									height:100, 
									loc:  "0 0",
									"rightArray":rightArray,
									color: this.getColor(laneActivities[0].origin)
								},
								{ 	key: laneActivities[0].destination,
									name:laneActivities[0].destination, 
									figure:"RoundedRectangle", 
									width: 100, 
									height:100, 
									loc: "300 0",
									"leftArray":leftArray,
									color: this.getColor(laneActivities[0].destination)
								}
							];
		  transitDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
		  transitDiagram.model.linkFromPortIdProperty = "fromPort";
		  transitDiagram.model.linkToPortIdProperty = "toPort";
		  transitDiagram.model.undoManager.isEnabled = true;  // start recording changes
		
	}
	
	
};


TransitPopUp.prototype.createDiagram = function(mainDivId) {
	var div = document.createElement("div");
	div.id = "transit_diagram_" + this.laneObject.id ;
	div.style.width = "400px";
	div.style.height = "120px";
	div.style.left = "10px";
	div.align = "center";
	document.getElementById(mainDivId).appendChild(div);
	var transitDiagram;
	try{
		transitDiagram = this.$s$(go.Diagram, div.id, 
					{isReadOnly: false, allowMove: false, allowSelect:false, isEnabled:false, allowHorizontalScroll: false, allowVerticalScroll:false }
				);
	}catch(error){
		$("#"+"transit_diagram_" + this.laneObject.id ).remove();
		try{
			document.removeChild("transit_diagram_" + this.laneObject.id );
		}catch(e){
			// error
			console.log("Error while initializing the diagram for transits ["+e.message+"]");
		}
		transitDiagram = this.$s$(go.Diagram, div.id, 
				{isReadOnly: false, allowMove: false, allowSelect:false, isEnabled:false, allowHorizontalScroll: false, allowVerticalScroll:false, allowZoom:true, initialContentAlignment: go.Spot.Center }
			);
	}
	
	return transitDiagram;
};

TransitPopUp.prototype.getNodeTemplate = function() {
	var portSize = 8;
	return this.$s$(go.Node, go.Panel.Table,
	        { locationObjectName: "BODY",
        locationSpot: go.Spot.Center,
        selectionObjectName: "BODY",
        selectionAdornmentTemplate:
          this.$s$(go.Adornment, go.Panel.Auto,
            this.$s$(go.Shape, "Rectangle",
              { stroke: "dodgerblue",
                strokeWidth: 3,
                fill: null }),
            this.$s$(go.Placeholder)) },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      this.$s$(go.Panel, go.Panel.Auto,
        { row: 1, column: 1, name: "BODY",
          stretch: go.GraphObject.Fill },
        this.$s$(go.Shape, "Rectangle",
          { minSize: new go.Size(75, 75) }, new go.Binding("fill", "color")),         
        this.$s$(go.TextBlock,
          { margin: 10, textAlign: "center" },
          new go.Binding("text", "key"))),
      // the Panel holding the left port elements, which are themselves Panels,
      // created for each item in the itemArray, bound to data.leftArray
      this.$s$(go.Panel, go.Panel.Vertical,
        { row: 1, column: 0,
          itemTemplate:
            this.$s$(go.Panel,
              { _side: "left",
                fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                cursor: "pointer" },
              new go.Binding("portId", "portId"),
              this.$s$(go.Shape, "Rectangle",
                { stroke: null, fill: null,
                  desiredSize: new go.Size(portSize, portSize),
                  margin: new go.Margin(5,0) }
                )) },
        new go.Binding("itemArray","leftArray")),
      // the Panel holding the right port elements, which are themselves Panels,
      // created for each item in the itemArray, bound to data.rightArray
      this.$s$(go.Panel, go.Panel.Vertical,
        { row: 1, column: 2,
          itemTemplate:
            this.$s$(go.Panel,
              { _side: "right",
                fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
               cursor: "pointer" },
              new go.Binding("portId", "portId"),
              this.$s$(go.Shape, "Rectangle",
                { stroke: null, fill: null,
                  desiredSize: new go.Size(portSize, portSize),
                  margin: new go.Margin(5, 0) })) },
          new go.Binding("itemArray", "rightArray"))
      );

};