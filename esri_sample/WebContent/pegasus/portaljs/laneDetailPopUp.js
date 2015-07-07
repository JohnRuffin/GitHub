/**
 * @author 927456 Honey Bansal
 * This script belongs to Map and Schematic view dashboard
 * and used to show lane detail in pop-up window
 * Included in mapViewer.jsp and schematicViewer.jsp
 */

/**
 * Default constructor for the class
 * creates the instance of class and initialized the variables
 * @param linkObject
 * @param originObj
 * @param destinationObj
 * @param globalStylesMap
 * @param styleByIdFn
 * @param isTemplateAlreadyDefined
 * @param styleByNameFn
 * @returns {LaneDetailPopUp}
 */
function LaneDetailPopUp(linkObject, originObj, destinationObj, globalStylesMap, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn) {
	//div element for pop-up window
	this.laneDetailPopUpWin;
	//lane detail object
	this.laneObject = linkObject;
	//clone of lane detail object
	this.clonedLaneObject = clone(linkObject);
	//removing detail of lanes from cloned lane object 
	this.clonedLaneObject.attributes.LaneActivities = [];
	//origin location object
	this.originObj = originObj;
	//destination location object
	this.destinationObj = destinationObj;
	//style map for nodes/locations and links/lanes
	this.globalStylesMap = globalStylesMap;
	//link style method by id to get the style for link
	this.styleByIdFn = styleByIdFn;
	//link style method by name to get the style for link
	this.styleByNameFn = styleByNameFn;
	//flag to check whether link template is already defined, 
	//false for map, true for schematic
	this.isTemplateAlreadyDefined = isTemplateAlreadyDefined;
	//colors map
	this.colorsMap = {};
	//origin location style
	this.originStyle = globalStylesMap[originObj.styleId];
	//destination location style
	this.destinationStyle = globalStylesMap[destinationObj.styleId];
    //
    this.locNameCodeMap = [];
	//convert the origin loc color to hex color
	if(this.originStyle && this.originStyle.icon && this.originStyle.icon.color) {
		this.colorsMap[originObj.name] = this.toHexColor(this.originStyle.icon.color);
        this.cacheLocations(originObj);
	}
	//convert the destination loc color to hex color
	if(this.destinationStyle && this.destinationStyle.icon && this.destinationStyle.icon.color) {
		this.colorsMap[destinationObj.name] = this.toHexColor(this.destinationStyle.icon.color);
        this.cacheLocations(destinationObj);
	}
	//flag to check whether pop-up is already created
	this.isExist = false;	
	//grid id
	this.gridId;
	//grid parent id
	this.gridParentDivId;
	//grid height
	this.gridHeight;
	//lane id string
	this.laneIdStr;
	//key
	this.key;
	//flag to check whether pop-up is closed
	this.isClosed = false;
	//gojs constant to create graphically objects on canvas
	this.$s$ = go.GraphObject.make;
	//list of all gojs diagrams in pop-up window
	this.diagramsArray = new Array();
}
/**
 * To get the color of location from color map
 * @param name
 * @returns
 */
LaneDetailPopUp.prototype.getColor = function(name) {
	if(this.colorsMap[name] == undefined) {
		var style = window[this.styleByNameFn](name);
        if(style  == undefined){
            style = window[this.styleByNameFn](this.getLocName(name));
        }
		if(style && style.icon && style.icon.color) {
			this.colorsMap[name] = this.toHexColor(style.icon.color);
		}
	}

	return this.colorsMap[name];
};

LaneDetailPopUp.prototype.getLocName = function(locCd) {
    if(locCd != undefined){
        var locationName = this.locNameCodeMap[locCd];
        if(locationName == undefined){
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
};

LaneDetailPopUp.prototype.cacheLocations = function(graphic) {
    if(graphic != undefined){
        if(graphic.name.length > 3 && graphic.attributes!= undefined && graphic.attributes.RelFacility != undefined && graphic.attributes.RelFacility.locCd != undefined){
            this.locNameCodeMap[graphic.attributes.RelFacility.locCd ] =  graphic.name;
        }else {
            this.locNameCodeMap[graphic.name] =  graphic.name;
        }
    }
};

/**
 * To get the style by style id
 * @param styleId
 * @returns
 */
LaneDetailPopUp.prototype.getStyle = function(styleId) {
	if(styleId) {
		return window[this.styleByIdFn](styleId);
	}
};
/**
 * To initialize the pop-up window and add lane detail components to it
 * if pop-up not exist it will create otherwise will show existing one only
 * @returns
 */
LaneDetailPopUp.prototype.showPopUp = function() {
	var height = document.body.clientHeight < 600 ? document.body.clientHeight - 100 : 500;
	var laneDetailPopUp = this;
	if(!this.laneObject.id) {
		this.laneObject.id = Math.random().toString().replace(".","");
	}
	if(!this.isExist) {
		this.laneDetailPopUpWin = 	$("<div id='popUp" + this.laneObject.id + "'/>").kendoWindow({
									width: "450px",
									height: height,
									draggable: true,
									modal: false,
									resizable: true,
									actions: ["close"],
									resize: function(e){
										laneDetailPopUp.onPopUpResize(laneDetailPopUp);
									},
									open: function(e){
										laneDetailPopUp.isClosed = false;
										//after opening the window, set the volumes from map view and refresh the data
										if(laneDetailPopUp){
											laneDetailPopUp.setVolumeDaysAndRefresh(laneDetailPopUp);
										}										
									},
									close: function(e){
										//after closing the window, set the volumes from map view and refresh the data
										laneDetailPopUp.setVolumeDaysAndRefresh(laneDetailPopUp);
										laneDetailPopUp.isClosed = true;
										resetSyncFromPopup(laneDetailPopUp.key);										
									},
									title: "Lane Detail (" +  this.laneObject.name + ")"
								});
		this.createLayout();
		this.addLaneDetailsForAllActivities();
		this.isExist = true;
	}
	this.laneDetailPopUpWin.data("kendoWindow").center();
	this.laneDetailPopUpWin.data("kendoWindow").open();
	this.laneDetailPopUpWin.parent().find('.k-window-content').addClass("winContent");
	this.laneDetailPopUpWin.parent().parent().mouseleave(function(e){
		laneDetailPopUp.laneDetailPopUpWin.trigger("mouseup");
	});
	this.onPopUpResize(laneDetailPopUp);
	if(this.diagramsArray) {
		for(var i=0; i<this.diagramsArray.length;i++) {
			this.diagramsArray[i].rebuildParts();
		}
	}
	setTimeout(function(){
		try {
			laneDetailPopUp.laneDetailPopUpWin.data("kendoWindow").wrapper[0].style.marginTop = "30px";
		}catch (e) {
			console.log("Error while setting margin");
		}
	},100);
	setTimeout(function(){
		laneDetailPopUp.resizeMatrix();
	},700);
	return true;
};
/**
 * To resize the pop-up window on resizing parent dashboard
 * @returns
 */
LaneDetailPopUp.prototype.resizePopUp = function() {
	var height = document.body.clientHeight < 600 ? document.body.clientHeight - 100 : 500;
	this.laneDetailPopUpWin.parent().height(height);
	this.onPopUpResize(this);
};


/**
 * Set the volumes days and refresh the data
 * @param laneDetailPopUp
 */
LaneDetailPopUp.prototype.setVolumeDaysAndRefresh = function(laneDetailPopUp) {
	//var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	
	var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	if(selectedDays == undefined) {
		selectedDays = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	}
	selectedDays = getRanges(selectedDays);
	if(selectedDays){
		$("#volumn_" + laneDetailPopUp.laneObject.id).val(selectedDays.toString());
	}
	laneDetailPopUp.filterGridData(laneDetailPopUp);
};
/**
 * Convert color to hex code
 * @param colorStr
 * @returns
 */
LaneDetailPopUp.prototype.toHexColor = function(colorStr) {
	if(colorStr && colorStr.charAt(0) != '#') {
		return "#"+colorStr.substring(2);
	}
	
	return colorStr;
};
/**
 * To resize the inner div on resizing parent div
 * @param laneDetailPopUp
 * @returns
 */
LaneDetailPopUp.prototype.onPopUpResize = function(laneDetailPopUp) {
	var parentHeight = $("#" + "outerMainDiv_" + laneDetailPopUp.laneObject.id).parent().height();
	$("#" + "outerMainDiv_" + laneDetailPopUp.laneObject.id).height(parentHeight - 35);
	$("#" + "footerCloseButtonDiv_" + laneDetailPopUp.laneObject.id).height(25);
	//$("#" + "outerMainDiv_" + laneDetailPopUp.laneObject.id).data("kendoSplitter").trigger("resize");
	//resize approach updated by kendo (http://docs.kendoui.com/api/framework/kendo#methods-resize)
	kendo.resize($("#" + "outerMainDiv_" + laneDetailPopUp.laneObject.id));
};
/**
 * To create the layout of pop-up window
 * Adds splitter between top lane diagram and lower matrix
 * @returns
 */
LaneDetailPopUp.prototype.createLayout = function() {
	var outerMainDiv = document.createElement("div");
	outerMainDiv.id = "outerMainDiv_" + this.laneObject.id;
	outerMainDiv.className = "outerMainDivStyle";
	document.getElementById("popUp" + this.laneObject.id).style.overflow = "hidden";
	document.getElementById("popUp" + this.laneObject.id).appendChild(outerMainDiv);
	
	var firstLanesDetailDiv = document.createElement("div");
	firstLanesDetailDiv.id = "firstLanesDetailDiv_" + this.laneObject.id;
	firstLanesDetailDiv.className = "firstDetailDivStyle";
	document.getElementById("outerMainDiv_" + this.laneObject.id).appendChild(firstLanesDetailDiv);
	
	var secondMatrixDiv = document.createElement("div");
	secondMatrixDiv.id = "secondMatrixDiv_" + this.laneObject.id;
	secondMatrixDiv.className = "secondMatrixDivStyle";
	document.getElementById("outerMainDiv_" + this.laneObject.id).appendChild(secondMatrixDiv);
	
	var thirdCloseButtonDiv = document.createElement("div");
	thirdCloseButtonDiv.id = "footerCloseButtonDiv_" + this.laneObject.id;
	thirdCloseButtonDiv.className = "footerCloseButtonDivStyle";
	document.getElementById("popUp" + this.laneObject.id).appendChild(thirdCloseButtonDiv);
	
	var parentHeight = $('#popUp' + this.laneObject.id).data("kendoWindow").options.height;
	var firstPaneSize = 115;
	if(this.laneObject.attributes.LaneActivities.length > 1 && parentHeight > 320) {
		firstPaneSize = 220;
	}
	this.gridHeight = 500 - firstPaneSize - 100;
	var lanePopup = this;  
	$("#" + outerMainDiv.id).kendoSplitter({
        orientation: "vertical",
        resize: function (e) {
        	setTimeout(function(){
        		lanePopup.resizeMatrix();
			},50);
        },
        panes: [
            {collapsible: false, size:firstPaneSize},
            {collapsible: false}
        ]
    });
};
/**
 * To add the all lane details, matrix and close all in the pop-up window
 * @returns
 */
LaneDetailPopUp.prototype.addLaneDetailsForAllActivities = function() {
	if(this.laneObject.attributes && this.laneObject.attributes.LaneActivities) {
		//reverse order outbound is coming first in LaneActivities array
		var selectedLane = false;
		for(var count=this.laneObject.attributes.LaneActivities.length-1;count>=0;count--){
			this.diagramsArray.push(this.addLaneDiagram(this.laneObject.attributes.LaneActivities[count],count));
			if(count == this.laneObject.attributes.LaneActivities.length-1){
				selectedLane = true;
			}else {
				selectedLane = false;
			}
			this.addLaneDetails(this.laneObject.attributes.LaneActivities[count],count);
		}
		this.addShowVolumes();
		//logic for first record selection and data in the matrix
		if(this.laneObject.attributes.LaneActivities != null && this.laneObject.attributes.LaneActivities[0]){
			//top record in the matrix
			var laneDetailsCount = this.laneObject.attributes.LaneActivities.length-1;
			//add the matrix 
			this.addMatrix(this.laneObject.attributes.LaneActivities[laneDetailsCount]);
			//if the icon is disabled icon then remove it
			$("#btn_" + this.laneObject.id).find("#span_"+laneDetailsCount).removeClass("matrix-off");
			//add the active icon
			$("#btn_" + this.laneObject.id).find("#span_"+laneDetailsCount).addClass("k-icon matrix-on");
			//update the hidden variable with the effective days for the selected lane
			$("#selectedEffectiveDay_"+this.laneObject.id).val(this.laneObject.attributes.LaneActivities[laneDetailsCount].effectiveDay);
		}
		this.addButtons();		
	}
};
/**
 *  Add close all button
 * @returns
 */
LaneDetailPopUp.prototype.addButtons = function() {
	var laneDetailPopUp = this;
	var div = document.createElement("div");
	div.id = "details_" + this.laneObject.id;
    
    var element = document.createElement("input");
	element.setAttribute("type", "button");
    element.setAttribute("value", "Close All");
    element.setAttribute("class", "closeAll");
    element.onclick = function() {
    	closeAllPopUps("LanePopUps");
    };
    div.appendChild(element);
    
    document.getElementById("footerCloseButtonDiv_" + this.laneObject.id).appendChild(div);
};
/**
 * Add lane detail voumne matrix
 * @param details
 * @returns
 */
LaneDetailPopUp.prototype.addMatrix = function(details) {
    var mdiv = document.createElement("div");
	mdiv.id = "matrix_" + this.laneObject.id;
	mdiv.className = "popUpMatriStyle";
	//mdiv.style.width = "100%";
	document.getElementById("secondMatrixDiv_" + this.laneObject.id).appendChild(mdiv);
	this.laneIdStr =  details.laneId;
	this.gridId = mdiv.id;
	this.gridParentDivId = "secondMatrixDiv_" + this.laneObject.id;
	this.createMatrix();
};
/**
 * Create lane detail volume matrix
 * @returns
 */
LaneDetailPopUp.prototype.createMatrix = function() {
	var laneDetailPopUp = this;
	//to avoid multiple times reloading...
	var isDataLoaded = false;
	$("#"+this.gridId).kendoGrid({
		dataSource: {
			transport: {		
				read: {
					url: function (options) {
				        return getNetworkSchematicLaneDetailUrl();
				    },
					dataType: "json",
					data: function() {
					  	return getLaneDetailPopupMatrixDatasourceParams(laneDetailPopUp.laneIdStr);
				  }
				}
		  	},
		  	
          schema:{
				model: {
					fields: getLaneDetailPopupMatrixSchema()
				}
			}			
		},
		sortable: {
			mode: "multiple",
	        allowUnsort: true
	    },
	    height: 200,
	    filterable:false,
	    resizable: true,
		reorderable: true,
		dataBound:  this.resizeMatrix,
		dataBound:  function() {
			laneDetailPopUp.showTooltip(laneDetailPopUp);
			setTimeout(function(){
				//once the data is bounded to the matrix then... 
				if(!isDataLoaded){
					//apply the DAY filter..... 
					laneDetailPopUp.filterGridData(laneDetailPopUp);
					isDataLoaded = true;
				}				
	    	}, 500);
	    },
		scrollable: {
			virtual: true
	    },
	    columns : getLaneDetailPopupMatrixColumns(),
	    requestEnd: function(e) {
	    	laneDetailPopUp.resizeMatrix();
	    }
    });	
};
/**
 * Load the volume data in matrix
 * @param mdivId
 * @param details
 * @returns
 */
LaneDetailPopUp.prototype.loadLaneMatrix = function(mdivId, details) {
	this.laneIdStr =  details.laneId ;
	var grid = $("#"+mdivId).data("kendoGrid");	
	if(grid) {
		grid.dataSource.read();				
	}
	hideBusyCursor();
};
/**
 * Error handler for showing error if any while loading data in matrix
 * @param e
 * @returns
 */
LaneDetailPopUp.prototype.laneDataSource_error = function(e) {
	parent.showErrorMsg(e.status);
};
/**
 * To filer the volume data in the matrix by day selected
 * @param laneDetailPopUpObj
 * @returns
 */
LaneDetailPopUp.prototype.filterGridData = function(laneDetailPopUpObj) {
	var daysArray = laneDetailPopUpObj.getValuesArray($("#volumn_" + laneDetailPopUpObj.laneObject.id).val());
	var filtersArray = [];
	for(var i=0;i<daysArray.length;i++){
		filtersArray.push({field: "DAY", operator: "eq", value: daysArray[i]});
	}
	var filter = {logic: "or", filters: filtersArray};
	$("#matrix_" + laneDetailPopUpObj.laneObject.id).data("kendoGrid").dataSource.filter(filter);
	$("#getVolumeBtn_" + laneDetailPopUpObj.laneObject.id).attr("disabled", true);
};
/**
 * To convert the days comma separated string into array
 * @param dayStr
 * @returns
 */
LaneDetailPopUp.prototype.getValuesArray = function(dayStr) {
	var days = [];
	if(dayStr) {
		var daysStrArray = dayStr.split(",");
		for(var i=0,tempStr;tempStr=daysStrArray[i];i++){
			var tempStrArray = tempStr.split("-");
			if(tempStrArray.length == 2){
				for(var j=parseInt(tempStrArray[0]);j<=parseInt(tempStrArray[1]); j++){
					days.push(j);
				}
			}else if(tempStrArray.length == 1){
				days.push(parseInt(tempStrArray[0]));
			}
		}
	}
	return days;
};
/**
 * To enable/disable the get volume button and filter data on hitting enter
 * @param keyEvent
 * @param laneDetailPopUpObj
 * @returns
 */
LaneDetailPopUp.prototype.volumnDayKeyUpHandler = function(keyEvent, laneDetailPopUpObj) {
	var isValid = validateMultipleDayExp($(keyEvent.currentTarget).val());
	if(!isValid) {
		$(keyEvent.currentTarget)[0].value=($(keyEvent.currentTarget).val()).substring(0,($(keyEvent.currentTarget).val()).length-1);
	}else{
		$("#getVolumeBtn_"+	laneDetailPopUpObj.laneObject.id).attr("disabled", false);
		var evtobj = keyEvent || window.event || event;
		var code = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
		if(code == 13) {
			if(laneDetailPopUpObj.volumnDayBlurHandler(keyEvent, laneDetailPopUpObj)) {
				$("#volumn_"+ laneDetailPopUpObj.laneObject.id).blur();
				$("#getVolumeBtn_"+	laneDetailPopUpObj.laneObject.id).trigger("click");
			}
		}
	}
};
/**
 * To validate the days entered on focus out from day input
 * @param event
 * @param laneDetailPopUpObj
 * @returns
 */
LaneDetailPopUp.prototype.volumnDayBlurHandler = function(event, laneDetailPopUpObj) {
	var availableDays = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	var enteredDays = laneDetailPopUpObj.getValuesArray($(event.currentTarget).val());
	var isValid = containsAll(enteredDays, availableDays);
	if(!isValid) {
		$(event.currentTarget).val(EMPTY_STRING);
		parent.showFilterErrorMsg("You can only see volumes for days included in your query");
		$("#getVolumeBtn_"+laneDetailPopUpObj.laneObject.id).attr("disabled", true);
	}
	return isValid;
};
/**
 * To show day control in click of calendar icon
 * @param e
 * @param calBtn
 * @param laneId
 * @returns
 */
LaneDetailPopUp.prototype.onVolDayCalenderClick = function(e,calBtn, laneId) {
	var selDays;
	//selected days in the text input box
	if(selDays == "" || selDays == null){
		selDays = $("#"+e.currentTarget.textInputId)[0].value;
	}	
	var keyObject = {dashboardId: viewerDashboardId, dataType: parent.getDataType(isScheduleForNetworkFlag)};
	//seelcted days from the map viewer.....
	var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	//???? 
	var days = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	if(days) {
		if(!selectedDays) {
			selectedDays = days.toString();
		}
		if(selDays != ""){
			selectedDays =  selDays;
		}
		//day calendar.... commented out assigned with effective days for the selected LANE
		//, $("#selectedEffectiveDay_"+laneId).val()
	 	showDayControl(false, selectedDays, calBtn, true, keyObject, true, days.toString(), parent.getSelectedCase(),null,null,null,null,setSelectedDays);
	} else {
		alert('No days to select');
	}
	
	//showDayControl(false,selDays,calBtn, false, "", true);
};
/**
 * To add the show volume div in pop-up window
 * @returns
 */
LaneDetailPopUp.prototype.addShowVolumes = function() {
	var laneDetailPopUpObj = this;
	var element;
	//changed the format... to table from div...simialr to LegDetailsPopUp...
	var div = document.createElement("div");
	div.id = "details_" + this.laneObject.id;
	div.className = "showVolumnStyle";
	
	element = document.createElement("input");
	element.id = "selectedEffectiveDay_" + this.laneObject.id;
	element.setAttribute("type", "hidden");
	div.appendChild(element);
	
	var tbl = document.createElement("table");
	tbl.setAttribute("cellpadding", "0");
	tbl.setAttribute("cellspacing", "0");
	tbl.setAttribute("border", "1");
    var tblBody = document.createElement("tbody");
    var row, cell, cellText, label;
    row = document.createElement("tr");
    cell = document.createElement("td");
    
    element = document.createElement("label");
	element.innerHTML = "View volumes for day";
	cell.appendChild(element);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	element = document.createElement("input");
	element.id = "volumn_" + this.laneObject.id;
	element.setAttribute("type", "text");
	element.onkeyup = function(event) {
		laneDetailPopUpObj.volumnDayKeyUpHandler(event, laneDetailPopUpObj);
	};
	element.onblur = function(event) {
		laneDetailPopUpObj.volumnDayBlurHandler(event, laneDetailPopUpObj);
	};
	var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	if(selectedDays ){
		element.setAttribute("value", selectedDays);			
	}	
	cell.appendChild(element);	
	row.appendChild(cell);
	
	cell = document.createElement("td");
	element = document.createElement("div");
	element.id = "volumeForDay_" + this.laneObject.id;
	element.textInputId = "volumn_" + this.laneObject.id;
	element.className = "calendar-mini";
	element.onclick = function(e) {
		laneDetailPopUpObj.onVolDayCalenderClick(e,element, laneDetailPopUpObj.laneObject.id);
	};
	cell.appendChild(element);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	element = document.createElement("input");
	element.id = "getVolumeBtn_" + this.laneObject.id;
	element.setAttribute("type", "button");
	element.setAttribute("value", "Get volumes");
	element.setAttribute("disabled", "disabled");
	element.setAttribute("class", "closeAll");
	element.onclick = function() {
		laneDetailPopUpObj.filterGridData(laneDetailPopUpObj);
		setTimeout(function(){
    		laneDetailPopUpObj.resizeMatrix();
		},200);
	};
	cell.setAttribute("class", "tdVolumneBtn");
	cell.appendChild(element);
	
	row.setAttribute("valign", "top");
	row.appendChild(cell);
	tblBody.appendChild(row);
	div.appendChild(tblBody);
	
	document.getElementById("secondMatrixDiv_" + this.laneObject.id).appendChild(div);
};
/**
 * To add lane detail div in pop-up window
 * @param details
 * @param count
 * @returns
 */
LaneDetailPopUp.prototype.addLaneDetails = function(details, count) {
	var laneDetailPopUp = this;
	var div = document.createElement("div");
	div.id = "details_" + this.laneObject.id + "_" + count;
	div.className = "laneDetailDiv";
	var leftdiv = document.createElement("div");
	leftdiv.className = "detailLeftDiv";
	var rightdiv = document.createElement("div");
	rightdiv.className = "detailRightDiv";
	var tbl = document.createElement("table");
	/*tbl.setAttribute("border", "1");*/
	tbl.setAttribute("cellpadding", "0");
	tbl.setAttribute("cellspacing", "0");
    var tblBody = document.createElement("tbody");
    var row, cell, cellText, label, element;
    
    row = document.createElement("tr");
    
    //first cell
    cell = document.createElement("td");	/* Row1 column1 - Eff days*/
    cellText = document.createTextNode("Eff days");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
    
    cell = document.createElement("td");	/* Row1 column2 - value*/
    label = document.createElement("label");
    label.innerHTML = parent.getEffDaysStringFromSystemSetting(details, "effectiveDay");
    cell.appendChild(label);
    cell.setAttribute("align", "left");
	row.appendChild(cell);
		
	cell = document.createElement("td");	/* Row1 column3 - Calendar icon*/
    element = document.createElement("img");
	element.id = "calendar_" + this.laneObject.id + "_" + count;
	element.src = ICON_IMAGE_PATH_DAYS;
	element.onclick = function() {
		laneDetailPopUp.openCalendar(laneDetailPopUp, element, details.effectiveDay);
	};
	div.appendChild(element);
	cell.appendChild(element);
    row.appendChild(cell);
    //space
    cell = document.createElement("td");	/* Row1 column4 - Blank Space*/
	cell.setAttribute("style", "width:30px");
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	
    cell = document.createElement("td");	/* Row1 column5 - Mode*/
    cellText = document.createTextNode("Mode");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell); 
    	
    label = document.createElement("label");
    if(details.mm != "") {
    	if(details.mm == "F") {
    		label.innerHTML = "Fly (MM)";
    	}else if(details.mm == "T") {
    		label.innerHTML = "Truck (MM)";
    	}
    }else if(details.sm != "") {
    	if(details.sm == "F") {
    		label.innerHTML = "Fly (SM)";
    	}else if(details.sm == "T") {
    		label.innerHTML = "Truck (SM)";
    	}
    }
	cell = document.createElement("td");	/* Row1 column6 - value*/
	cell.setAttribute("align", "left");
    cell.appendChild(label);
    row.appendChild(cell);
    
    tblBody.appendChild(row);
    
    row = document.createElement("tr");
    
    cell = document.createElement("td");	/* Row2 column1 - Available*/
    cellText = document.createTextNode("Available");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
	row.appendChild(cell);
		
	cell = document.createElement("td");	/* Row2 column2 - value*/
	cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.availableTime;
    cell.appendChild(label);
    row.appendChild(cell);
   
	//space
	cell = document.createElement("td");	/* Row2 column3 - Blank Space*/
	/*cell.setAttribute("style", "width:8px");*/
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	
	//space
	cell = document.createElement("td");	/* Row2 column4 - Blank Space*/
	cell.setAttribute("style", "width:30px");
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	
	cell = document.createElement("td");	/* Row2 column5 - Due*/
    cellText = document.createTextNode("Due");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
	row.appendChild(cell);
    	
	cell = document.createElement("td");	/* Row2 column6 - value*/
	cell.setAttribute("align", "left");
    label = document.createElement("label");
    var dueTimeLabel = details.dueTime;
    if(details.nightsCrossed && details.nightsCrossed > 0) {
    	dueTimeLabel += " (+"+details.nightsCrossed+")";
    }     
    label.innerHTML = dueTimeLabel;
    cell.appendChild(label);
    row.appendChild(cell);
    
    tblBody.appendChild(row);
    tbl.appendChild(tblBody);
    leftdiv.appendChild(tbl);
    div.appendChild(leftdiv);
    
    var mTbl = document.createElement("table");
    var mTblBody = document.createElement("tbody");
    var mRow = document.createElement("tr");
    var mCell = document.createElement("td");
    /*mCell.appendChild(tbl);*/
    /*mCell.setAttribute("style", "padding-left: 20px");*/
    mRow.appendChild(mCell); 
    
    mCell = document.createElement("td");
    var btnDiv = document.createElement("div");
    btnDiv.id = "btn_" + this.laneObject.id;
    
    var element = document.createElement("span");
    element.id = "span_"+count;
	//element.setAttribute("type", "button");
    //element.setAttribute("value", "Details");
    element.setAttribute("class", "k-icon  matrix-off");
    element.setAttribute("style", "cursor: pointer;");
    element.setAttribute("padding-left", "5px");
    element.onclick = function() {
    	var selectedItems = $("span.matrix-on");
    	if(selectedItems){
    		for(var i=0; i<selectedItems.length; i++){
    			var menuItem = selectedItems[i];
    			if(menuItem .parentElement.id == btnDiv.id){
    				$(menuItem).removeClass("matrix-on");
        			$(menuItem).addClass("matrix-off");
    			}
    		}
    	}    	
    	element.setAttribute("class", "k-icon matrix-on");
    	$("#selectedEffectiveDay_"+laneDetailPopUp.laneObject.id).val(details.effectiveDay);
    	showBusyCursor();
    	laneDetailPopUp.loadLaneMatrix("matrix_" + laneDetailPopUp.laneObject.id, details);
    	setTimeout(function (){
    		laneDetailPopUp.filterGridData(laneDetailPopUp);
    	}, 100);
    	setTimeout(function(){
    		laneDetailPopUp.resizeMatrix();
		},400);
    };
    btnDiv.appendChild(element); 
    mCell.appendChild(btnDiv);
    mCell.setAttribute("style", "padding-left: 10px");
    mRow.appendChild(mCell);
    mTblBody.appendChild(mRow);
    div.setAttribute("style", "align: center");
    //mTbl.appendChild(mTblBody);
    mTblBody.setAttribute("align", "center");
    rightdiv.appendChild(mTblBody);
    div.appendChild(rightdiv);
    document.getElementById("firstLanesDetailDiv_" + this.laneObject.id).appendChild(div);
};
/**
 * Day control click handler to show calendar
 * @param laneDetailPopUp
 * @param calBtn
 * @param effectiveDay
 * @returns
 */
LaneDetailPopUp.prototype.openCalendar = function(laneDetailPopUp, calBtn, effectiveDay) {
	showDayControl(false, effectiveDay, calBtn, true, null, true,null,null,null,null,null,null,setSelectedDays);
};
/**
 * To create and add lane daigram in pop-up window
 * @param activity
 * @param count
 * @returns
 */
LaneDetailPopUp.prototype.createDiagram = function(activity, count) {
	var outerDiv = document.createElement("div");
	outerDiv.className = "goDiagramStyle";
	var div = document.createElement("div");
	div.id = "diagram_" + this.laneObject.id + "_" + count;
	document.getElementById("firstLanesDetailDiv_" + this.laneObject.id).appendChild(outerDiv).appendChild(div);
	var laneDiagram = this.$s$(go.Diagram, div.id, 
							{isReadOnly: true, allowMove: false, allowSelect:false, allowHorizontalScroll: false, allowVerticalScroll:false }
						);
	
	return laneDiagram;
};
/**
 * Add lane daigram in pop-up window
 * @param activity
 * @param count
 * @returns
 */
LaneDetailPopUp.prototype.addLaneDiagram = function(activity, count) {
	var laneDiagram;
	try {
		laneDiagram = this.createDiagram(activity, count);
	}catch (e) {
		if($('#'+"diagram_" + this.laneObject.id + "_" + count).length > 0){
			document.removeChild("diagram_" + this.laneObject.id + "_" + count);
		}		
		laneDiagram = this.createDiagram(activity, count);
	}
	
	laneDiagram.nodeTemplate = this.getNodeTemplate(); 
	if(this.isTemplateAlreadyDefined) {
		laneDiagram.linkTemplate = this.getStyle(activity.laneStyleId);
	} else {
		var linkTemplateMap = getPopupLinkTemplateMap();
		if(!linkTemplateMap[activity.laneStyleId]) {
			linkTemplateMap[activity.laneStyleId] = this.getLinkTemplate(this.getStyle(activity.laneStyleId));
		}
		laneDiagram.linkTemplate = linkTemplateMap[activity.laneStyleId];
	}
	
	var laneColor = "#000000";
	var originColor;
	var destColor;
	if(activity.direction == "I") {
		laneColor = this.originColor;
		originColor = this.originColor;
		destColor = this.destinationColor;
	}else {
		laneColor = this.destinationColor;
		originColor = this.destinationColor;
		destColor = this.originColor;
	}
	
	var nodeDataArray = [
	         	      	{ key: "O_"+activity.origin, name:activity.origin, figure:"RoundedRectangle", color: this.getColor(activity.origin), width: 48, height:20, loc: "0 5"},
	         	      	{ key: "D_"+activity.destination, name:activity.destination, figure:"RoundedRectangle", color: this.getColor(activity.destination), width: 48, height:20, loc: "250 5"}
	             	];
	
	var laneLinkObject = clone(this.clonedLaneObject);
	laneLinkObject.category = activity.laneStyleId;
	laneLinkObject.attributes.LaneActivities = [activity];
	laneLinkObject.from = "O_"+activity.origin;
	laneLinkObject.to = "D_"+activity.destination;
	
	var linkDataArray = [laneLinkObject];
	
	laneDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
	
	return laneDiagram;
};
/**
 * Default node template for gojs diagram
 * @returns
 */
LaneDetailPopUp.prototype.getNodeTemplate = function() {
	return 	this.$s$(go.Node, go.Panel.Auto,
	        	this.$s$(go.Shape,
	          		{figure: "RoundedRectangle" },
	          		new go.Binding("fill", "color"),
	          		new go.Binding("width", "width"),
	          		new go.Binding("height", "height"),
	          		new go.Binding("figure", "figure")
	          	),
	        	this.$s$(go.TextBlock,
	          		{ margin: 3, stroke: "#ffffff", font : "9pt Arial"  },
	          		new go.Binding("text", "name")
	          	),
	          	new go.Binding("location", "loc", go.Point.parse)
	 		);
};
/**
 * Default link template for gojs diagram
 * @param style
 * @returns
 */
LaneDetailPopUp.prototype.getLinkTemplate = function(style) {
	var link = new go.Link();
	//link rouitng types 
	//link.routing = go.Link.AvoidsNodes;
	var lineCustomProperties;
	var lineProperties;
	var schmeaticDiagram = this;			
	if(style) {
		var lineStyle = style.line;
		if(lineStyle) {
			lineCustomProperties = lineStyle.customProperties;
			if(lineCustomProperties) {
				lineProperties = lineCustomProperties.lineProperties;	
				if(lineProperties) {
					if(lineProperties.hasOwnProperty("click")) {
						delete lineProperties["click"];	
					}			
					if(lineProperties.strokeDashArray) {
						//lineProperties.strokeDashArray = lineProperties.strokeDashArray.split(",");
						var strokeArray = lineProperties.strokeDashArray.split(",").map(function (x) { 
                    	    return parseInt(x, 10);
                    	});
                        lineProperties.strokeDashArray = strokeArray;
					}
				}
			} 
			
			if(lineProperties == undefined) {
				lineProperties = {};
			}
			
			if(lineStyle.color) {
				lineProperties.stroke = this.toHexColor(lineStyle.color);
			} else {
				lineProperties.stroke = null;
			}
			
			link.add(this.$s$(go.Shape, lineProperties));

			if(lineCustomProperties) {
				var lineSymbols = lineCustomProperties.lineSymbols;
				if(lineSymbols) {
					var symbolType;
					var textAttributeFn;
					var symbolProperties;
					for(var i = 0; i < lineSymbols.length; i++) {
						symbolProperties = this.getLineSymbolProperties(lineCustomProperties[lineSymbols[i]]);
						symbolType = symbolProperties.symbolType;
						if(symbolType) {
							delete symbolProperties["symbolType"];
							
							if(symbolType == "text") {
								textAttributeFn = symbolProperties.textAttributeFn;
								if(textAttributeFn) {
									delete symbolProperties["textAttributeFn"];
									link.add(this.$s$(go.TextBlock, symbolProperties,
													 new go.Binding("text", "attributes", window[textAttributeFn])));
								} else {
									link.add(this.$s$(go.TextBlock, symbolProperties));
								}
							} else if(symbolType == "shape") {
								link.add(this.$s$(go.Shape, symbolProperties));
							}
						}						
					}
				}
			}
			
			if(this.linkClickHandler) {
				link.click = this.linkClickHandler;
			}
		}
	}
	return link;
};
/**
 * Lane detail diagram link properties
 * @param symbolProperties
 * @returns
 */
LaneDetailPopUp.prototype.getLineSymbolProperties = function(symbolProperties) {
	if(symbolProperties.hasOwnProperty("segmentOrientation")) {			
		symbolProperties.segmentOrientation = go.Link[symbolProperties.segmentOrientation];
	} 
	
	if(symbolProperties.hasOwnProperty("segmentOffsetX") && symbolProperties.hasOwnProperty("segmentOffsetY")) {
		if(symbolProperties["segmentOffsetX"] == "NaN" || symbolProperties["segmentOffsetY"] == "NaN") {		
			symbolProperties.segmentOffset = new go.Point(NaN,NaN);
		} else {
			symbolProperties.segmentOffset = new go.Point(parseInt(symbolProperties.segmentOffsetX), parseInt(symbolProperties.segmentOffsetY));
		}
		delete symbolProperties["segmentOffsetX"];
		delete symbolProperties["segmentOffsetY"];
	}
	
	if(symbolProperties.hasOwnProperty("click")) {
		symbolProperties["click"] = window[symbolProperties["click"]];	
		delete symbolProperties["click"];	
	}
	return symbolProperties;
};
/**
 * To resize the matrix for showing scroll
 * @returns
 */
LaneDetailPopUp.prototype.resizeMatrix = function() {
	if(this.gridParentDivId) {
	    var gridElement = $("#"+this.gridId);
    	var dataArea = gridElement.find(".k-grid-content");	    
	    var parentElement = $("#"+this.gridParentDivId);
   	 	var newHeight = parentElement.height() - 42;
   	 	var diff = gridElement.find(".k-grouping-header").innerHeight() + gridElement.find(".k-grid-header").innerHeight();
   	 	if(newHeight > 0) {
		    gridElement.height(newHeight);
		    dataArea.height(newHeight-diff);
	    }
    }
};
/**
 * To show tooltip in matrix
 * @param laneDetailPopUp
 * @returns
 */
LaneDetailPopUp.prototype.showTooltip = function(laneDetailPopUp) {
	$("td", "#"+laneDetailPopUp.gridId).on("mouseover", function (ev) {
		if(ev.currentTarget.innerText) {
			ev.currentTarget.title = ev.currentTarget.innerText;
		}
    });
	$("th", "#"+laneDetailPopUp.gridId).on("mouseover", function (ev) {
		if($(ev.currentTarget).find("a").text()){
			ev.currentTarget.title = $(ev.currentTarget).find("a").text();
		}
    });
};
/**
 * To replace the all occurences of substring in a string
 * @param txt
 * @param replace
 * @param with_this
 * @returns
 */
LaneDetailPopUp.prototype.replaceAll = function(txt, replace, with_this) {
	return txt.replace(new RegExp(replace, 'g'),with_this);
};
/**
 * Matrix column scheme
 * @returns
 */
function getLaneDetailPopupMatrixSchema() {
	var gridFields = {
			DAY: {
				type: "number"
			},					
			TOTAL_WEIGHT: {
				type: "number"
			},
			TOTAL_CUBE: {
				type: "number"
			},
			TOTAL_PIECES: {
				type: "number"
			}, 
			ODPD: {
				type: "number"
			}
		};
	
	return addProductGroupsSchema(gridFields, true, undefined, true);
}
/**
 * Matrix column with styles/attributes
 * @returns {Array}
 */
function getLaneDetailPopupMatrixColumns() {
	var matrixCols = [ {
	        field: "DAY",
	        width: 32,
	        title: "Day",
	        attributes:{style:"text-align:center;"}
	    }];

	matrixCols = matrixCols.concat([ {
	    	field: "TOTAL_WEIGHT",
	    	width: 55,
	        title: "Ttl Wt",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	      		  title: "Ttl Wt"
	      	  }
	    } , {
	    	field: "TOTAL_CUBE",
	        width: 55,
	        title: "Ttl Cu",
	       	attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	      		  title: "Ttl Cu"
	      	  }
	    } , {
	    	field: "TOTAL_PIECES",
	        width: 55,
	        title: "Ttl Pcs",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	      		  title: "Ttl Pcs"
	      	  }
	    } ,  {
	    	field: "ODPD",
	        width: 55,
	        title: "ODPD Count",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	      		  title: "ODPD Count"
	      	  }
	    }
    ]);
	
	matrixCols = addProductGroupsColumns(matrixCols, true, false, undefined, true);
	
	return matrixCols; 
}
/*
function getLaneDetailPopupMatrixAggregateColumns() {
	var aggregateCols = [
	  { field: "TOTAL_WEIGHT", aggregate: "sum" },
	  { field: "TOTAL_PIECES", aggregate: "sum" },
	  { field: "TOTAL_CUBE", aggregate: "sum" }	  
  ];
  	
	return addProductGroupsAggregateColumns(aggregateCols, true);
}
*/
/**
 * Matrix datasource parameters
 */
function getLaneDetailPopupMatrixDatasourceParams(idStr) {
	var params = {};
	params.commonCaseId = parent.getCommonCaseId();
	params.effDayPatternStr = parent.getSelectedEffDayStrPattern();
	params.browserSessionId = parent.getBrowserSessionId();
	params.idStr = idStr;
	var prodGrps = getNwProdGroupNames();
	if(prodGrps && prodGrps != "") {
		params.prodGrps = prodGrps;
	}

	params.wtConversionFactor = isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1;
	 params.isNwProdGrp = true;
	return params;	
}