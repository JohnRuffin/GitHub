/**
 * @author 927456 Honey Bansal
 * This script belongs to Map/Application Mode Analysis Dashboard
 * and used to draw gantt chart diagram on the dashboard
 * Included in modeAnalysis.jsp
 */

/**
 * Default constructor for the class
 * creates the instance of class and initialize the gojs gantt chart diagram
 * @param diagramDiv
 * @param activitiesDetailMap
 * @param diagramOptions
 * @returns {GanttChartDiagram}
 */
function GanttChartDiagram(diagramDiv, activitiesDetailMap, diagramOptions) {

	this.RIGHT_LABEL_CAT = "rightLabelCat";
	
	this.LEFT_LABEL_CAT = "leftLabelCat";
	
	this.minLabelWidth = 30;
	
	//div element for gantt chart diagram
	this.diagramDiv = diagramDiv;
	//list of activities details
	this.activitiesDetailMap = activitiesDetailMap;
	//gojs constant to create graphically objects on canvas
	this.$s$  = go.GraphObject.make;
	//get default diagram options if not passed in constructor 
	if(!diagramOptions) {
		diagramOptions = this.getDefaultGanttChartOptions();
	}
	//gojs gantt chart diagram  
	this.ganttDiagram = this.$s$(go.Diagram, diagramDiv, diagramOptions);
	//list of nodes/bars showing on gantt chart
	this.nodesArray;
	//origin activities min avail time
	this.minAvailTimeInMilliSec;
	//destination activities max avail time
	this.maxDueTimeInMilliSec;
	//time ruler offset to show time more the 24hrs on ruler
	this.scaleOffset = 0;
	//initialize the diagram
	this.initializeDiagram();
}
/**
 * To get the gantt chart diagram default options
 * @returns
 */
GanttChartDiagram.prototype.getDefaultGanttChartOptions = function(){
	return {
		padding: 0,
		_widthFactor: 1,
		isReadOnly: true,
		allowZoom: false,
		allowMove: false,
		allowSelect:false,
		//isEnabled:false,
		hasHorizontalScrollbar:false,
		hasVerticalScrollbar:false
	};
};
/**
 * To initialize the gojs gantt chart diagram with grid layout, node and link templates 
 * @returns
 */
GanttChartDiagram.prototype.initializeDiagram = function() {
	var ganttChartDiagram = this;
	this.ganttDiagram.grid.visible = true;
	this.ganttDiagram.grid = this.$s$(go.Panel, go.Panel.Grid,
								{ gridCellSize: new go.Size(50000, 42)},
								this.$s$(go.Shape, "LineH", { stroke: "#BBBBBB", strokeWidth: 1}));
	
	this.ganttDiagram.nodeTemplateMap = this.getGanttNodeTemplate();
	this.ganttDiagram.toolManager.panningTool.isEnabled = false;
	this.ganttDiagram.toolManager.hoverDelay = 10;
	this.ganttDiagram.toolManager.mouseWheelBehavior = null;
};
/**
 * To show and format the tool tip on chart bars
 * @param node
 * @param toolTip
 * @returns
 */
GanttChartDiagram.prototype.tooltipTextConverter = function(node, toolTip) {
	try {
		var time, timeStr, timeArray;
		if(isLocalFlag) {
			if(node.key.indexOf("left") == 0) {
				timeStr = "Available Time(L) ";
				time = node.availTimeL;
			}else if(node.key.indexOf("right") == 0) {
				timeStr = "Due Time(L) ";
				time = node.dueTimeL;
			}
		}else {
			if(node.key.indexOf("left") == 0) {
				timeStr = "Available Time(Z) ";
				time = node.availTimeZ;
			}else if(node.key.indexOf("right") == 0) {
				timeStr = "Due Time(Z) ";
				time = node.dueTimeZ;
			}
		}
		if(time) {
			if(time.toString().indexOf("+") > 0) {
				timeArray = time.toString().split("+");
			}else {
				timeArray = time.toString().split("-");
			}
			if(timeArray && timeArray.length > 0) {
				time = timeArray[0];
			}
			timeArray = time.toString().split(":");
			if(timeArray && timeArray.length > 2) {
				time = timeArray[0] + ":" + timeArray[1]; 
			}
		}
		return timeStr + time;
	}catch (e) {
		console.log(e.message);
	}
};
/**
 * Default tooltip and node template for gojs gantt chart diagram
 * @returns
 */
GanttChartDiagram.prototype.getGanttNodeTemplate = function() {
	var ganttChartDiagram = this;
	var tooltipTemplate = this.$s$(go.Adornment, go.Panel.Auto,
							{isShadowed:true, shadowBlur:8},
							this.$s$(go.Shape, "Rectangle",
									{ fill: this.getGrayBrush(), stroke: "gray", height:18 }),
							this.$s$(go.TextBlock,
									{ font: "8pt arial", wrap: go.TextBlock.WrapFit,
										desiredSize: new go.Size(200, NaN),
										alignment: go.Spot.Center,
										margin: 5 },
										new go.Binding("text", "", this.tooltipTextConverter)));
	var nodeTemplateMap = this.ganttDiagram.nodeTemplateMap;
	nodeTemplateMap.add(this.RIGHT_LABEL_CAT,this.$s$(go.Node, "Horizontal",
			{margin:0, selectable:false, toolTip: tooltipTemplate},
			this.$s$(go.Shape,
				{ figure: "Rectangle", fill: "gray", stroke: "darkgray", strokeWidth: 1, height: 20, margin:0},
				new go.Binding("fill", "color"),
				new go.Binding("figure", "figure"),
				new go.Binding("width", "width"),
				new go.Binding("height", "height"),
				new go.Binding("stroke", "stroke"),
				new go.Binding("visible", "visible")),
			this.$s$(go.TextBlock, {stroke: "white", font: "bold 8pt arial", margin: 5, alignment: go.Spot.Left },
				new go.Binding("text", "text"),
				new go.Binding("stroke", "textStroke"),
				new go.Binding("visible", "visible"),
				new go.Binding("alignment", "textAlignment")), 
			new go.Binding("location", "loc")
	));
	nodeTemplateMap.add(this.LEFT_LABEL_CAT,this.$s$(go.Node, "Horizontal",
			{margin:0, selectable:false, toolTip: tooltipTemplate},
			this.$s$(go.TextBlock, {stroke: "white", font: "bold 8pt arial", margin: 5, alignment: go.Spot.Left },
					new go.Binding("text", "text"),
					new go.Binding("stroke", "textStroke"),
					new go.Binding("visible", "visible"),
					new go.Binding("alignment", "textAlignment")),
			this.$s$(go.Shape,
				{ figure: "Rectangle", fill: "gray", stroke: "darkgray", strokeWidth: 1, height: 20, margin:0},
				new go.Binding("fill", "color"),
				new go.Binding("figure", "figure"),
				new go.Binding("width", "width"),
				new go.Binding("height", "height"),
				new go.Binding("stroke", "stroke"),
				new go.Binding("visible", "visible"))
			, 
			new go.Binding("location", "loc")
	));
	nodeTemplateMap.add(EMPTY_STRING,this.$s$(go.Node, go.Panel.Auto,
			{margin:0, selectable:false, toolTip: tooltipTemplate},
			this.$s$(go.Shape,
				{ figure: "Rectangle", fill: "gray", stroke: "darkgray", strokeWidth: 1, height: 20, margin:0},
				new go.Binding("fill", "color"),
				new go.Binding("figure", "figure"),
				new go.Binding("width", "width"),
				new go.Binding("height", "height"),
				new go.Binding("stroke", "stroke"),
				new go.Binding("visible", "visible")),
			this.$s$(go.TextBlock, {stroke: "white", font: "bold 8pt arial", margin: 5, alignment: go.Spot.Left },
				new go.Binding("text", "text"),
				new go.Binding("stroke", "textStroke"),
				new go.Binding("visible", "visible"),
				new go.Binding("alignment", "textAlignment")), 
			new go.Binding("location", "loc")
	));
	return nodeTemplateMap;
};
/**
 * To convert the milliseconds to time string hh:mm
 * @param milliSecs
 * @returns
 */
GanttChartDiagram.prototype.convertToTimeFormat = function(milliSecs) {
	var time = milliSecs/1000;
	var h = Math.floor(time / 3600);
	var m = Math.floor(time % 3600 / 60);
	
	return ((h > 0 ? h + ":" : ":") + (m > 0 ? (h >= 0 && m < 10 ? "0" : "") + m + "" : "00"));
	
};
/**
 * To convert the time string to hours
 * @param timeStr
 * @returns
 */
GanttChartDiagram.prototype.convertTimeToHhs = function(timeStr) {
	if(timeStr) {
		var timeArray = timeStr.toString().split(":");
		if(timeArray && timeArray.length == 2) {
			return timeArray[0] * 1 + timeArray[1]/60;
		}else if(timeArray.length == 1){
			return timeArray[0]/60 * 1;
		}
	}
};
/**
 * To add the mode analysis service response
 * creates the gantt chart, adds the bars for O/D's flights/trucks  
 * @param response
 * @param minAvailTimeInMilliSec
 * @param maxDueTimeInMilliSec
 * @param diffTimeInMilliSec
 * @returns
 */
GanttChartDiagram.prototype.addGanttChart = function(response, minAvailTimeInMilliSec, maxDueTimeInMilliSec, diffTimeInMilliSec) {
	if(response) {
		//min avail time in milliseconds
		this.minAvailTimeInMilliSec = minAvailTimeInMilliSec;
		//max due time in milliseconds
		this.maxDueTimeInMilliSec = maxDueTimeInMilliSec;
		
		//width of gantt chart div
		var chartWidth = $("#"+this.diagramDiv).width();
		//width of one millisecond time difference on UI
		var widthFactor = chartWidth/diffTimeInMilliSec;
		
		//arrays of all flight/trucks bars
		var ganttNodesArray = [];
		//added a dummy row at (0,5) to set the nodes start locations
		ganttNodesArray.push({key:"dummyNode", visible:false, 
								width:1, height:1,
								loc : new go.Point(0,0)});
		
		var originCd, destinationCd, activityCd, activityAvailTime, activityDueTime, activityAirTime, activitySurfaceTime;
		var rowIndex, isOrigin, availTimeL, dueTimeL, availTimeZ, dueTimeZ, serverTime, isVisible;
		for(var j=0; j<response.length; j++) {
			originCd = response[j].originCd;
			destinationCd = response[j].destinationCd;
			activityCd = response[j].activityCd;
			activityAvailTime = response[j].activityAvailTime != null ? response[j].activityAvailTime : minAvailTimeInMilliSec;
			activityDueTime = response[j].activityDueTime != null ? response[j].activityDueTime : maxDueTimeInMilliSec;
			activityAirTime = response[j].activityAirTime * 1000;
			activitySurfaceTime = response[j].activitySurfaceTime * 1000;
			rowIndex = response[j].rowIndex;
			isOrigin = response[j].isOrigin;
			serverTime = response[j].serverTime;
			isVisible = false;
			try {
				//times to show tooltip on bars
				availTimeL = this.activitiesDetailMap[originCd+"_"+activityCd].availTimeL;
				dueTimeL = this.activitiesDetailMap[originCd+"_"+activityCd].dueTimeL;
				availTimeZ = this.activitiesDetailMap[originCd+"_"+activityCd].availTimeZ;
				dueTimeZ = this.activitiesDetailMap[originCd+"_"+activityCd].dueTimeZ;
			}catch (e) {
				availTimeL = EMPTY_STRING;
				dueTimeL = EMPTY_STRING;
				availTimeZ = EMPTY_STRING;
				dueTimeZ = EMPTY_STRING;
			}
			var leftStartX;
			var labelCategory = EMPTY_STRING;
			var rowWidth = 0;
			if(isOrigin == "true" || isOrigin == true) {
				//starting x position of bar for origins
				leftStartX = (activityAvailTime - minAvailTimeInMilliSec) * widthFactor;
				//bar will be visible if flight hasn't crossed the  due time
				if((activityAvailTime - minAvailTimeInMilliSec + activityAirTime) * widthFactor < chartWidth - leftStartX){
					isVisible = true;
				}
				//origin flights -  if the AIR Time is greater than zero
				if(activityAirTime != undefined && activityAirTime > 0){
					rowWidth = activityAirTime * widthFactor;
					if(rowWidth < ((this.convertToTimeFormat(activityAirTime)).length) * 7){
						labelCategory = this.RIGHT_LABEL_CAT;
					}
					ganttNodesArray.push({ key:"leftFlight"+rowIndex,
						text: this.convertToTimeFormat(activityAirTime),
						color: this.getVioletBrush(),
						stroke:"#B3A2C7", textStroke:"#403152", visible:isVisible,
						width: rowWidth,
						height:20,
						category:labelCategory,
						loc: new go.Point(leftStartX, ((rowIndex-1)*42)+5),
						leftStartX:leftStartX,
						activityAvailTime:activityAvailTime,
						activityAirTime:activityAirTime,
						locCd:originCd,
						availTimeL:availTimeL,
						availTimeZ:availTimeZ,
						serverTime:serverTime,
						mode:"F",
						direction:"I",
						rowIndex:rowIndex
					});
					rowWidth = 0;
					labelCategory = EMPTY_STRING;
				}
				
				isVisible = false;
				//bar will be visible if truck hasn't crossed the  due time
				if((activityAvailTime - minAvailTimeInMilliSec + activitySurfaceTime) * widthFactor < chartWidth - leftStartX){
					isVisible = true;
				}
				//origin trucks  - if the Surface Time is greater than zero
				if(activitySurfaceTime != undefined && activitySurfaceTime > 0){
					rowWidth = activitySurfaceTime * widthFactor;
					if(rowWidth < ((this.convertToTimeFormat(activitySurfaceTime)).length) * 7){
						labelCategory = this.RIGHT_LABEL_CAT;
					}
					ganttNodesArray.push({ key:"leftTruck"+rowIndex,
						text: this.convertToTimeFormat(activitySurfaceTime),
						color: this.getOrangeBrush(),
						stroke:"#FFC000", textStroke:"#984807", visible:isVisible,
						width: rowWidth, 
						height:10,
						category:labelCategory,
						loc: new go.Point(leftStartX, ((rowIndex-1)*42)+28),
						leftStartX:leftStartX,
						activityAvailTime:activityAvailTime,
						activitySurfaceTime:activitySurfaceTime,
						locCd:originCd,
						availTimeL:availTimeL,
						availTimeZ:availTimeZ,
						serverTime:serverTime,
						mode:"T",
						direction:"I",
						rowIndex:rowIndex
					});
					rowWidth = 0;
					labelCategory = EMPTY_STRING;
				}				
			}else {
				leftStartX = chartWidth/2;
				//destination flights - if the AIR Time is greater than zero
				if(activityAirTime != undefined && activityAirTime > 0){
					rowWidth = activityAirTime * widthFactor;
					if(rowWidth < ((this.convertToTimeFormat(activityAirTime)).length) * 7){
						labelCategory = this.LEFT_LABEL_CAT;
					}
					ganttNodesArray.push({ key:"rightFlight"+rowIndex,
						text: this.convertToTimeFormat(activityAirTime),
						color: this.getBlueBrush(),
						stroke:"#8EB4E3", textStroke:"#1F497D", visible:true,
						width: rowWidth, 
						height:20,
						category:labelCategory,
						loc: new go.Point(leftStartX, ((rowIndex-1)*42)+5),
						leftStartX:leftStartX,
						activityDueTime:activityDueTime,
						activityAirTime:activityAirTime,
						locCd:originCd,
						dueTimeL:dueTimeL,
						dueTimeZ:dueTimeZ,
						serverTime:serverTime,
						mode:"F",
						direction:"O",
						rowIndex:rowIndex
					});
					rowWidth = 0;
					labelCategory = EMPTY_STRING;
				}
				
				//destination trucks - if the Surface Time is greater than zero
				if(activitySurfaceTime != undefined && activitySurfaceTime > 0){
					rowWidth = activitySurfaceTime * widthFactor;
					if(rowWidth < ((this.convertToTimeFormat(activitySurfaceTime)).length) * 7){
						labelCategory = this.LEFT_LABEL_CAT;
					}
					ganttNodesArray.push({ key:"rightTruck"+rowIndex,
						text: this.convertToTimeFormat(activitySurfaceTime),
						color: this.getGreenBrush(),
						stroke:"#9BBB63", textStroke:"#4F6231", visible:true,
						width: rowWidth,
						height:10,
						category:labelCategory,
						loc: new go.Point(leftStartX, ((rowIndex-1)*42)+28),
						leftStartX:leftStartX,
						activityDueTime:activityDueTime,
						activitySurfaceTime:activitySurfaceTime,
						locCd:originCd,
						dueTimeL:dueTimeL,
						dueTimeZ:dueTimeZ,
						serverTime:serverTime,
						mode:"T",
						direction:"O",
						rowIndex:rowIndex
					});
					rowWidth = 0;
					labelCategory = EMPTY_STRING;
				}
			}
		}
		//adds the nodes array to gojs diagram
		this.refreshChart(ganttNodesArray);
	}
};
/**
 * To refresh the chart on refreshing the analysis
 * @param ganttNodesArray
 * @returns
 */
GanttChartDiagram.prototype.refreshChart = function(ganttNodesArray) {
	if(ganttNodesArray) {
		this.nodesArray = ganttNodesArray;
		this.ganttDiagram.clear();
		this.ganttDiagram.model = new go.GraphLinksModel(ganttNodesArray);
	}
};
/**
 * To refresh, show/hide the bars on moving the slider or on changing the activity times
 * @param sliderValues
 * @param sliderMinMaxValues
 * @param diffTimeInMilliSec
 * @param minProTime
 * @param btnMap
 * @returns
 */
GanttChartDiagram.prototype.refreshGanttChart = function(sliderValues, sliderMinMaxValues, diffTimeInMilliSec, minProTime, btnMap) {
	if(sliderValues && sliderValues.length > 0 && sliderMinMaxValues && sliderMinMaxValues.length > 0) {
		var leftFlightMap = {};
		var leftTruckMap = {};
		var rightFlightMap = {};
		var rightTruckMap = {};
		//width of one hour on UI
		var chartWidthFactor = $("#"+this.diagramDiv).width()/diffTimeInMilliSec * 3600000;
		//value of due time(the dashed line on slider div)
		var dueTime = sliderValues[1] - this.convertTimeToHhs(minProTime);
		var nodeData = this.nodesArray;
		//iterate all the nodes of gantt chart and change the color if origin nodes crossed due time 
		//or hide the destination nodes if crossed the activity due time
		if(nodeData && nodeData.length > 0) {
			var node;
			var truckNodeData;
			var nodeTime;
			for(var i=0; i<nodeData.length;i++) {
				node = nodeData[i];
				if(node.key.indexOf("leftFlight") != -1) {
					nodeTime = node.activityAirTime/60000;
					var actAvailTime = (node.activityAvailTime - this.minAvailTimeInMilliSec)/3600000;
					var actEndTime = (node.activityAvailTime - this.minAvailTimeInMilliSec + node.activityAirTime)/3600000 + sliderMinMaxValues[0];
					truckNodeData = this.getNodeData("leftTruck"+node.rowIndex);
					//hide if origin flight node crossed the end value of slider
					if(actEndTime > sliderValues[1] || nodeTime >  btnMap["travelTimeFromOrigin"]) {
						node.visible = false;
					//change the color of flight node if crossed due time line on slider but not crossed the end value of slider
					}else if(actEndTime > dueTime && actEndTime <= sliderValues[1]) {
						node.color = this.getGrayBrush();
						node.stroke = "#D9D9D9";
						node.textStroke = "#7F7F7F";
						node.visible = btnMap["leftFlight"] || this.isMustFly(btnMap["mustFlyOrigin"], truckNodeData);
					//change the color of flight node again to original color if slider due time line moved right side out of bar 
					}else {
						node.color = this.getVioletBrush();
						node.stroke = "#B3A2C7";
						node.textStroke = "#403152";
						node.visible = btnMap["leftFlight"] || this.isMustFly(btnMap["mustFlyOrigin"], truckNodeData);
					}
					//to move the flight node if time is changed from the clock icon/pop-up time box
					node.loc.x = chartWidthFactor * actAvailTime;
					node.width = chartWidthFactor * node.activityAirTime/3600000;
					if(node.visible){
						leftFlightMap[node.rowIndex] = node;
					}
				}else if(node.key.indexOf("leftTruck") != -1) {
					nodeTime = node.activitySurfaceTime/60000;
					var actAvailTime = (node.activityAvailTime - this.minAvailTimeInMilliSec)/3600000;
					var actEndTime = (node.activityAvailTime - this.minAvailTimeInMilliSec + node.activitySurfaceTime)/3600000 + sliderMinMaxValues[0];
					//hide if origin truck node crossed the end value of slider
					if(actEndTime > sliderValues[1] || nodeTime >  btnMap["travelTimeFromOrigin"]) {
						node.visible = false;
						this.setNodeProperty(node, "isActiveTruckable", false);						
					//change the color of truck node if crossed due time line on slider but not crossed the end value of slider
					}else if(actEndTime > dueTime && actEndTime <= sliderValues[1]) {
						node.color = this.getGrayBrush();
						node.stroke = "#D9D9D9";
						node.textStroke = "#7F7F7F";
						node.visible = btnMap["leftTruck"];
						this.setNodeProperty(node, "isActiveTruckable", false);	
					//change the color of truck node again to original color if slider due time line moved right side out of bar
					}else {
						node.color = this.getOrangeBrush();
						node.stroke = "#FFC000";
						node.textStroke = "#984807";
						node.visible = btnMap["leftTruck"];
						this.setNodeProperty(node, "isActiveTruckable", true);	
					}
					//to move the truck node if time is changed from the clock icon/pop-up time box
					node.loc.x = chartWidthFactor * actAvailTime;
					node.width = chartWidthFactor * node.activitySurfaceTime/3600000;
					
					if(node.visible){
						leftTruckMap[node.rowIndex] = node;
					}
				}else if(node.key.indexOf("rightFlight") != -1) {
					nodeTime = node.activityAirTime/60000;
					truckNodeData = this.getNodeData("rightTruck"+node.rowIndex);
					if(nodeTime >  btnMap["travelTimeToDestination"]) {
						node.visible = false;
					}else if(sliderValues[1] +  node.activityAirTime/3600000 >= ((node.activityDueTime-this.minAvailTimeInMilliSec)/3600000) + sliderMinMaxValues[0] + this.scaleOffset) {
						//hide the destination flight if time crossed the activity due time and ignoreDueTime is false
						node.visible = btnMap["ignoreDueTime"] && btnMap["rightFlight"];
					}else {
						node.visible = btnMap["rightFlight"] || this.isMustFly(btnMap["mustFlyDest"], truckNodeData);
					}
					//move the destination flight on moving slider
					node.loc.x = chartWidthFactor * (sliderValues[1] - sliderMinMaxValues[0]) + 2;
					node.width = chartWidthFactor * node.activityAirTime/3600000;
					if(node.visible){
						rightFlightMap[node.rowIndex] = node;
					}
				}else if(node.key.indexOf("rightTruck") != -1) {
					nodeTime = node.activitySurfaceTime/60000;
					if(nodeTime >  btnMap["travelTimeToDestination"]) {
						node.visible = false;
					}else if(sliderValues[1] +  node.activitySurfaceTime/3600000 >= ((node.activityDueTime-this.minAvailTimeInMilliSec)/3600000) + sliderMinMaxValues[0] + this.scaleOffset){
						//hide the destination truck if time crossed the activity due time and ignoreDueTime is false
						node.visible = btnMap["ignoreDueTime"] && btnMap["rightTruck"];
						this.setNodeProperty(node, "isActiveTruckable", false);	
					}else {
						node.visible = btnMap["rightTruck"];
						this.setNodeProperty(node, "isActiveTruckable", true);	
					}
					//move the destination flight on moving slider
					node.loc.x = chartWidthFactor * (sliderValues[1] - sliderMinMaxValues[0]) + 2;
					node.width = chartWidthFactor * node.activitySurfaceTime/3600000;
					if(node.visible){
						rightTruckMap[node.rowIndex] = node;
					}
				}
			}
			//update the nodes in gantt chart after all above changes
			this.ganttDiagram.updateAllTargetBindings();
			
			return {"leftFlight": leftFlightMap, "leftTruck": leftTruckMap ,"rightFlight": rightFlightMap, "rightTruck": rightTruckMap};
		}
	}
};

/**
 * method returns whether location have the only Flight mode but not truck mode that can make it by due time
 * @param isTruckable -- button selection parameters
 * @param node	- truck node data
 */
GanttChartDiagram.prototype.isMustFly = function(isTruckable, node){
	if(node != undefined){
		return (isTruckable && !((node != undefined  && node.isActiveTruckable)));
	}
	
	return false;
};

/**
 * returns the node from the go js diagram  
 * @param key	- key for node on gantt chart
 * @returns {go.Node}
 */
GanttChartDiagram.prototype.getNode = function(key){
	if(key != undefined){
		return this.ganttDiagram.findNodeForKey(key);
	}
};

/**
 * return the node data for a specified key from {go.Diagram} object
 * @param key	- key for node on gantt chart
 * @returns {Object}
 */
GanttChartDiagram.prototype.getNodeData = function(key){
	var data;
	var _node;
	if(key != undefined){
		_node = this.getNode(key);
		return _node!= undefined? (_node.part.data): undefined;		
	}
	
	delete _node;
};

/**
 * set the property name /value 
 * @param node - 
 * @param name
 * @param value
 */
GanttChartDiagram.prototype.setNodeProperty = function(node, name, value){
	if(node != undefined){
		node[name] = value;
	}
};

GanttChartDiagram.prototype.setPosition = function(nodeData, index){
	var node;
	if(nodeData != undefined){
		node = this.ganttDiagram.findNodeForData(nodeData);
		if (node != undefined) {			
			//create a new loction 
			if(nodeData.node != undefined){
				nodeData.loc = new go.Point(nodeData.node.loc.x, index);
			}else{
				nodeData.loc = new go.Point(nodeData.loc.x, index);
			}
		    //move to new location...
			node.move(nodeData.loc);
		}
	}
};



/**
 * To apply the new activity time provided in pop-up input box for each location
 * @param value
 * @param sliderValues
 * @param sliderMinMaxValues
 * @param diffTimeInMilliSec
 * @param minProTime
 * @param btnMap
 * @param direction
 * @param rowIndex
 * @returns
 */
GanttChartDiagram.prototype.applyActivityTime =  function(value, sliderValues, sliderMinMaxValues, diffTimeInMilliSec, minProTime, btnMap, direction, rowIndex) {
	if(this.nodesArray && sliderMinMaxValues && sliderMinMaxValues.length > 0) {
		var flightNode = $.grep(this.nodesArray, function(e){ return e.key == direction+"Flight"+rowIndex; });
		var truckNode = $.grep(this.nodesArray, function(e){ return e.key == direction+"Truck"+rowIndex; });
		var chartWidthFactor = $("#"+this.diagramDiv).width()/diffTimeInMilliSec * 3600000;
		if(direction == "left") {
			if(flightNode && flightNode.length > 0) {
				var newActAvailTime = flightNode[0].activityAvailTime + (value - this.convertTimeToHhs(flightNode[0].serverTime)) * 3600000;
				flightNode[0].activityAvailTime = newActAvailTime;
				flightNode[0].serverTime = this.convertToTimeFormat(value * 3600000);
			}
			if(truckNode && truckNode.length > 0) {
				var newActAvailTime = truckNode[0].activityAvailTime + (value - this.convertTimeToHhs(truckNode[0].serverTime)) * 3600000;
				truckNode[0].activityAvailTime = newActAvailTime;
				truckNode[0].serverTime = this.convertToTimeFormat(value * 3600000);
			}
		}else {
			if(flightNode && flightNode.length > 0) {
				var newActDueTime = flightNode[0].activityDueTime + (value - this.convertTimeToHhs(flightNode[0].serverTime)) * 3600000;
				flightNode[0].activityDueTime = newActDueTime;
				flightNode[0].serverTime = this.convertToTimeFormat(value * 3600000);
			}
			if(truckNode && truckNode.length > 0) {
				var newActDueTime = truckNode[0].activityDueTime + (value - this.convertTimeToHhs(truckNode[0].serverTime)) * 3600000;
				truckNode[0].activityDueTime = newActDueTime;
				truckNode[0].serverTime = this.convertToTimeFormat(value * 3600000);
			}
		}
		this.refreshGanttChart(sliderValues, sliderMinMaxValues, diffTimeInMilliSec, minProTime, btnMap);
	}
};

/**
 * To delete the node from gantt chart on deleting row from table
 * @param rowIndex
 */
GanttChartDiagram.prototype.deleteRow = function(rowIndex) {
	if(this.nodesArray && this.nodesArray.length > 1) {
		var tempArray = new Array(); 
		tempArray.push(this.nodesArray[0]);
		for(var i=1; i<this.nodesArray.length; i++){
			if(this.nodesArray[i].rowIndex < rowIndex) {
				tempArray.push(this.nodesArray[i]);
			}else if(this.nodesArray[i].rowIndex > rowIndex) {
                this.nodesArray[i].loc.y = this.nodesArray[i].loc.y - 42;
				this.nodesArray[i].rowIndex = this.nodesArray[i].rowIndex - 1;
				if(this.nodesArray[i].key.indexOf("leftFlight") > -1) {
					this.nodesArray[i].key = "leftFlight" + this.nodesArray[i].rowIndex;
				}else if(this.nodesArray[i].key.indexOf("leftTruck") > -1) {
					this.nodesArray[i].key = "leftTruck" + this.nodesArray[i].rowIndex;
				}else if(this.nodesArray[i].key.indexOf("rightFlight") > -1) {
					this.nodesArray[i].key = "rightFlight" + this.nodesArray[i].rowIndex;
				}else if(this.nodesArray[i].key.indexOf("rightTruck") > -1) {
					this.nodesArray[i].key = "rightTruck" + this.nodesArray[i].rowIndex;
				}
				tempArray.push(this.nodesArray[i]);
			}
		}
		this.nodesArray = tempArray;
		this.refreshChart(this.nodesArray);
	}
};
/**
 * Bars violet color gradient style
 * @returns
 */
GanttChartDiagram.prototype.getVioletBrush = function() {
	return this.$s$(go.Brush, go.Brush.Linear, { "0.0": "#F1E5FC", "1.0": "rgba(167,148,188,0.6)" });
};
/**
 * Bars orange color gradient style
 * @returns
 */
GanttChartDiagram.prototype.getOrangeBrush = function() {
	return this.$s$(go.Brush, go.Brush.Linear, { "0.0": "#FFFC83", "1.0": "rgba(229,182,37,0.6)"});
};
/**
 * Bars blue color gradient style
 * @returns
 */
GanttChartDiagram.prototype.getBlueBrush = function() {
	return this.$s$(go.Brush, go.Brush.Linear, { "0.0": "#D3F1FF", "1.0": "rgba(98,147,204,0.6)" });
};
/**
 * Bars green color gradient style
 * @returns
 */
GanttChartDiagram.prototype.getGreenBrush = function() {
	return this.$s$(go.Brush, go.Brush.Linear, { "0.0": "#E9FBC1", "1.0": "rgba(151,176,99,0.6)" });
};
/**
 * Bars gray color gradient style
 * @returns
 */
GanttChartDiagram.prototype.getGrayBrush = function() {
	return this.$s$(go.Brush, go.Brush.Linear, { "0.0": "#FFFFFF", "1.0": "rgba(233,233,233,0.6)" });
};
/**
 * To get the detail of nodes/bars to show the data on map
 * @returns
 */
GanttChartDiagram.prototype.getNodeDetails = function() {
	var nodeDetails = [];
	if(this.nodesArray) {
		for(var i = 0; i < this.nodesArray.length; i++) {
			if(this.nodesArray[i].visible) {
				nodeDetails.push({locCd:this.nodesArray[i].locCd, mode:this.nodesArray[i].mode, direction:this.nodesArray[i].direction});
			}
		}
	}
	return nodeDetails;
};