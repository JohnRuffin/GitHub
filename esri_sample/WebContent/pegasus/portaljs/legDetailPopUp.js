/**
 * @author 927456 Honey Bansal
 * This script belongs to Map and Schematic view dashboard
 * and used to show leg detail in pop-up window
 * Included in mapViewer.jsp and schematicViewer.jsp
 */

/**
 * Default constructor for the class
 * creates the instance of class and initialized the variables
 * @param linkObject
 * @param originObj
 * @param destinationObj
 * @param globalStylesMap
 * @param isScheduleForNetworkFlag
 * @param styleByIdFn
 * @param isTemplateAlreadyDefined
 * @param styleByNameFn
 * @returns {LegDetailPopUp}
 */
function LegDetailPopUp(linkObject, originObj, destinationObj, globalStylesMap, isScheduleForNetworkFlag, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn, isLocalFlag) {
	//div element for pop-up window
	this.legDetailPopUpWin;
	//legs detail object
	this.legObject = linkObject;
	//origin location object
	this.originObj = originObj;  
	//clone of leg detail object
	this.clonedLegObject = clone(linkObject);
	//removing detail of legs from cloned leg object 
	this.clonedLegObject.attributes.LegDetails = [];
	//destination location object
	this.destinationObj = destinationObj;
	//style map for nodes/locations and links/legs
	this.globalStylesMap = globalStylesMap;
	//flag is schedule data for network query
	this.isScheduleForNetwork = isScheduleForNetworkFlag;
	//link style method by id to get the style for link
	this.styleByIdFn = styleByIdFn;
	//link style method by name to get the style for link 
	this.styleByNameFn = styleByNameFn;
	//flag to check whether link template is already defined, 
	//false for map, true for schematic
	this.isTemplateAlreadyDefined = isTemplateAlreadyDefined;
	//flag to check whether local or zulu time
	this.isLocalFlag = isLocalFlag;
	//colors map
	this.colorsMap = {};
	//origin location style
	this.originStyle = globalStylesMap[originObj.styleId];
	//destination location style
	this.destinationStyle = globalStylesMap[destinationObj.styleId];
    //temporary cache to old the loc name and city name mapping object
    this.locNameCodeMap = [];
	//convert the origin loc color to hex color
	if(this.originStyle && this.originStyle.icon && this.originStyle.icon.color) {
       this.colorsMap[originObj.name]= this.toHexColor(this.originStyle.icon.color);
       //cache the city name to location code
       this.cacheLocations(originObj);
    }
	//convert the destination loc color to hex color
	if(this.destinationStyle && this.destinationStyle.icon && this.destinationStyle.icon.color) {
		this.colorsMap[destinationObj.name] = this.toHexColor(this.destinationStyle.icon.color);
        //cache the city name to location code
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
	//leg id string
	this.legIdStr;
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
 * cache the city name to location Name
 * @param graphic
 */
LegDetailPopUp.prototype.cacheLocations = function(graphic) {
    if(graphic != undefined){
        if(graphic.name.length > 3 && graphic.attributes!= undefined && graphic.attributes.RelFacility != undefined && graphic.attributes.RelFacility.locCd != undefined){
            this.locNameCodeMap[graphic.attributes.RelFacility.locCd ] =  graphic.name;
        }else {
            this.locNameCodeMap[graphic.name] =  graphic.name;
        }
    }
};

/**
 * To get the color of location from color map
 * @param name
 * @returns
 */
LegDetailPopUp.prototype.getColor = function(name) {
	if(this.colorsMap[name] == undefined) {
		var style = window[this.styleByNameFn](name);
        //if the sytle is undefined then get the style by city name
        if(style  == undefined){
            style = window[this.styleByNameFn](this.getLocName(name));
        }
		if(style && style.icon && style.icon.color) {
			this.colorsMap[name] = this.toHexColor(style.icon.color);
		}
	}
	
	return this.colorsMap[name];
};

/**
 * if the city name is not found for the location code then get the graphic object representing
 * the location code from map and cache the city name to location code...
 * @param locCd
 * @returns {*}
 */
LegDetailPopUp.prototype.getLocName = function(locCd) {
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
};
/**
 * To get the style by style id
 * @param styleId
 * @returns
 */
LegDetailPopUp.prototype.getStyle = function(styleId) {
	if(styleId) {
		return window[this.styleByIdFn](styleId);
	}
};
/**
 * To initialize the pop-up window and add leg detail components to it
 * if pop-up not exist it will create otherwise will show existing one only
 * @returns
 */
LegDetailPopUp.prototype.showPopUp = function() {
	var height = document.body.clientHeight < 600 ? document.body.clientHeight - 100 : 500;
	var legDetailPopUp = this;	
	if(!this.legObject.id) {
		this.legObject.id = Math.random().toString().replace(".","");
	}
	if(!this.isExist) {
		this.legDetailPopUpWin = 	$("<div id='popUp" + this.legObject.id + "'/>").kendoWindow({
									width: "600px",
									height: height,
									draggable: true,
									modal: false,
									resizable: true,
									actions: ["close"],
									resize: function(e){
										legDetailPopUp.onPopUpResize(legDetailPopUp);
										//parent.resizePopupHandler(e.sender, $("#"+e.sender.wrapper.find('.k-grid')[0].id),  150, 140);
									},
									open: function(e){
										legDetailPopUp.isClosed = false;
										legDetailPopUp.setVolumeDaysAndRefresh(legDetailPopUp);
									},
									close: function(e){
										legDetailPopUp.setVolumeDaysAndRefresh(legDetailPopUp);
										legDetailPopUp.isClosed = true;
										resetSyncFromPopup(legDetailPopUp.key);										
									},
									title: "Leg Detail (" +  this.legObject.attributes.LegName + ")"
								});
		this.createLayout();
		this.addLegDetailsForAllActivities();
		this.isExist = true;
		
	}
	this.legDetailPopUpWin.data("kendoWindow").center();
	this.legDetailPopUpWin.data("kendoWindow").open();
	this.legDetailPopUpWin.parent().find('.k-window-content').addClass("winContent");
	this.legDetailPopUpWin.parent().parent().mouseleave(function(e){
		legDetailPopUp.legDetailPopUpWin.trigger("mouseup");
	});
	this.onPopUpResize(legDetailPopUp);
	if(this.diagramsArray) {
		for(var i=0; i<this.diagramsArray.length;i++) {
			this.diagramsArray[i].rebuildParts();
		}
	}
	return true;
};
/**
 * To resize the pop-up window on resizing parent dashboard
 * @returns
 */
LegDetailPopUp.prototype.resizePopUp = function() {
	var height = document.body.clientHeight < 600 ? document.body.clientHeight - 100 : 500;
	this.legDetailPopUpWin.parent().height(height);
	this.onPopUpResize(this);
};
/**
 * Set the volumes days and refresh the data
 * @param legDetailPopUp
 * @returns
 */
LegDetailPopUp.prototype.setVolumeDaysAndRefresh = function(legDetailPopUp) {
	//var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	var selectedDays = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	selectedDays = getRanges(selectedDays);
	
	if(selectedDays){
		$("#volumn_" + legDetailPopUp.legObject.id).val(selectedDays.toString());
	}
	legDetailPopUp.filterGridData(legDetailPopUp);
};
/**
 * To resize the inner div on resizing parent div
 * @param legDetailPopUp
 * @returns
 */
LegDetailPopUp.prototype.onPopUpResize = function(legDetailPopUp) {
	var parentHeight = $("#" + "outerMainDiv_" + legDetailPopUp.legObject.id).parent().height();
	$("#" + "outerMainDiv_" + legDetailPopUp.legObject.id).height(parentHeight - 35);
	$("#" + "footerCloseButtonDiv_" + legDetailPopUp.legObject.id).height(25);
//	$("#" + "outerMainDiv_" + legDetailPopUp.legObject.id).data("kendoSplitter").trigger("resize");
	//resize approach updated by kendo (http://docs.kendoui.com/api/framework/kendo#methods-resize)
	kendo.resize($("#" + "outerMainDiv_" + legDetailPopUp.legObject.id));
};
/**
 * To create the layout of pop-up window
 * Adds splitter between top leg diagram and lower matrix
 * @returns
 */
LegDetailPopUp.prototype.createLayout = function() {
	var outerMainDiv = document.createElement("div");
	outerMainDiv.id = "outerMainDiv_" + this.legObject.id;
	outerMainDiv.className = "outerMainDivStyle";
	document.getElementById("popUp" + this.legObject.id).style.overflow = "hidden";
	document.getElementById("popUp" + this.legObject.id).appendChild(outerMainDiv);
	
	var firstlegsDetailDiv = document.createElement("div");
	firstlegsDetailDiv.id = "firstLegDetailDiv_" + this.legObject.id;
	firstlegsDetailDiv.className = "firstDetailDivStyle";
	document.getElementById("outerMainDiv_" + this.legObject.id).appendChild(firstlegsDetailDiv);
	
	var secondMatrixDiv = document.createElement("div");
	secondMatrixDiv.id = "secondMatrixDiv_" + this.legObject.id;
	secondMatrixDiv.className = "secondMatrixDivStyle";
	secondMatrixDiv.style.height = "230px";
	document.getElementById("outerMainDiv_" + this.legObject.id).appendChild(secondMatrixDiv);
	
	var thirdCloseButtonDiv = document.createElement("div");
	thirdCloseButtonDiv.id = "footerCloseButtonDiv_" + this.legObject.id;
	thirdCloseButtonDiv.className = "footerCloseButtonDivStyle";
	document.getElementById("popUp" + this.legObject.id).appendChild(thirdCloseButtonDiv);
	
	var parentHeight = $('#popUp' + this.legObject.id).data("kendoWindow").options.height;
	var firstPaneSize = 140;
	if(this.legObject.attributes.LegDetails.length > 1 && parentHeight > 350) {
		firstPaneSize = 270;
	}
	this.gridHeight = 500 - firstPaneSize - 100;
	var legPopup = this;  
	$("#" + outerMainDiv.id).kendoSplitter({
        orientation: "vertical",
        resize: function (e) {
			setTimeout(function(){
				legPopup.resizeMatrix();
			},50);
        },
        panes: [
            {collapsible: false, size:firstPaneSize},
            {collapsible: false}
        ]
    });
};
/**
 * To add the all leg details, matrix and close all in the pop-up window
 * @returns
 */
LegDetailPopUp.prototype.addLegDetailsForAllActivities = function() {
	for(var count=0;count<this.legObject.attributes.LegDetails.length;count++){
		this.diagramsArray.push(this.addLegDiagram(this.legObject.attributes.LegDetails[count], count));
		this.addLegDetails(this.legObject.attributes.LegDetails[count], count);
	}
	this.addShowVolumes();
	if(this.legObject.attributes.LegDetails != null ){		
		this.addMatrix(this.legObject.attributes.LegDetails[0]);
		$("#btn_" + this.legObject.id).find("#span_"+0).removeClass("matrix-off");
		$("#btn_" + this.legObject.id).find("#span_"+0).addClass("k-icon matrix-on");		
		//update the hidden variable with the effective days for the selected leg
		$("#selectedEffectiveDay_"+this.legObject.id).val(this.legObject.attributes.LegDetails[0].day);
	}
	this.addButtons();
};
/**
 * Add close all button
 * @returns
 */
LegDetailPopUp.prototype.addButtons = function() {
	var legDetailPopUp = this;
	var div = document.createElement("div");
	div.id = "details_" + this.legObject.id;
    
    var element = document.createElement("input");
	element.setAttribute("type", "button");
    element.setAttribute("value", "Close All");
    element.setAttribute("class", "closeAll");
    element.onclick = function() {
    	closeAllPopUps("LegPopUps");
    };
    div.appendChild(element);
    
    document.getElementById("footerCloseButtonDiv_" + this.legObject.id).appendChild(div);
};
/**
 * Add leg detail voumne matrix
 * @param details
 * @returns
 */
LegDetailPopUp.prototype.addMatrix = function(details) {
	var mdiv = document.createElement("div");
	mdiv.id = "matrix_" + this.legObject.id;
	mdiv.className = "popUpMatriStyle";
	//mdiv.style.width = "100%";
	document.getElementById("secondMatrixDiv_" + this.legObject.id).appendChild(mdiv);
	this.gridId = mdiv.id;
	this.gridParentDivId = "secondMatrixDiv_" + this.legObject.id;
	this.legIdStr =  details.legId ;
	this.createMatrix();
};
/**
 * Create leg detail volume matrix
 * @returns
 */
LegDetailPopUp.prototype.createMatrix = function() {
	var legDetailPopUp = this; 
	var isDataLoaded = false;
	$("#"+this.gridId).kendoGrid({
		dataSource: {
			transport: {
				read: {
					url: function (options) {
				        return getSchedulerSchematicLegDetailUrl();
				    },
					dataType: "json",
					data: function() {
					  	return getLegDetailPopupMatrixDatasourceParams(legDetailPopUp.legIdStr, legDetailPopUp.isScheduleForNetwork);
				  }
				}
		  	},
		  	
          schema:{
				model: {
					fields: getLegDetailPopupMatrixSchema()
				}
			}			
		},
		sortable: {
			mode: "multiple",
	        allowUnsort: true
	    },
	    height: 150,
	    filterable:false,
	    resizable: true,
		reorderable: true,
		dataBound:  function() {
	    	setTimeout(function(){
	    		legDetailPopUp.showTooltip(legDetailPopUp);
	    		if(!isDataLoaded){
	    			legDetailPopUp.filterGridData(legDetailPopUp);
	    			isDataLoaded = true;
	    		}
	    		legDetailPopUp.resizeMatrix();
	    	}, 1000);
	    },
		scrollable: {
			virtual: true
	    },
	    columns : getLegDetailPopupMatrixColumns(),
	    requestEnd: function(e) {
	    	legDetailPopUp.resizeMatrix();
	    },
		error: function(e) {			
			checkForTimeoutError(e);
		}
    });	
};
/**
 * Load the volume data in matrix
 * @param mdivId
 * @param details
 * @returns
 */
LegDetailPopUp.prototype.loadLegMatrix = function(mdivId, details) {
	var legDetailPopUpObj = this;
	this.legIdStr =  details.legId ;
	var grid = $("#"+mdivId).data("kendoGrid");	
	if(grid) {
		grid.dataSource.read();
	}
	hideBusyCursor();
	var label = $("#mvSegNo_" + this.legObject.id);
	label.html(details.mvNbr);
};
/**
 * Error handler for showing error if any while loading data in matrix
 * @param e
 * @returns
 */
LegDetailPopUp.prototype.legDataSource_error = function (e) {
	parent.showErrorMsg(e.status);
};
/**
 * To resize the matrix for showing scroll
 * @returns
 */
LegDetailPopUp.prototype.resizeMatrix = function() {
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
 * @param legDetailPopUp
 * @returns
 */
LegDetailPopUp.prototype.showTooltip = function(legDetailPopUp) {
	$("td", "#"+legDetailPopUp.gridId).on("mouseover", function (ev) {
		if(ev.currentTarget.innerText) {
			ev.currentTarget.title = ev.currentTarget.innerText;
		}
    });
	$("th", "#"+legDetailPopUp.gridId).on("mouseover", function (ev) {
		if($(ev.currentTarget).find("a").text()){
			ev.currentTarget.title = $(ev.currentTarget).find("a").text();
		}
    });
};
/**
 * To filer the volume data in the matrix by day selected
 * @param legDetailPopUpObj
 * @returns
 */
LegDetailPopUp.prototype.filterGridData = function(legDetailPopUpObj) {
	var daysArray = legDetailPopUpObj.getValuesArray($("#volumn_" + legDetailPopUpObj.legObject.id).val());
	var filtersArray = [];
	for(var i=0;i<daysArray.length;i++){
		filtersArray.push({field: "DAY", operator: "eq", value: daysArray[i]});
	}
	var filter = {logic: "or", filters: filtersArray};
	$("#matrix_" + legDetailPopUpObj.legObject.id).data("kendoGrid").dataSource.filter(filter);
	$("#getVolumeBtn_" + legDetailPopUpObj.legObject.id).attr("disabled", true);
};
/**
 * To convert the days comma separated string into array
 * @param dayStr
 * @returns
 */
LegDetailPopUp.prototype.getValuesArray = function(dayStr) {
	var days = [];
	if(dayStr) {
		var daysStrArray = dayStr.toString().split(",");
		for(var i=0,tempStr;tempStr=daysStrArray[i];i++){
			var tempStrArray = tempStr.toString().split("-");
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
 * @param legDetailPopUpObj
 * @returns
 */
LegDetailPopUp.prototype.volumnDayKeyUpHandler = function(keyEvent, legDetailPopUpObj) {
	var isValid = validateMultipleDayExp($(keyEvent.currentTarget).val());
	if(!isValid) {
		$(keyEvent.currentTarget)[0].value=($(keyEvent.currentTarget).val()).substring(0,($(keyEvent.currentTarget).val()).length-1);
	}else{
		$("#getVolumeBtn_"+legDetailPopUpObj.legObject.id).attr("disabled", false);
		var evtobj = keyEvent || window.event || event;
		var code = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
		if(code == 13) {
			if(legDetailPopUpObj.volumnDayBlurHandler(keyEvent, legDetailPopUpObj)) {
				$("#volumn_"+legDetailPopUpObj.legObject.id).blur();
				$("#getVolumeBtn_"+legDetailPopUpObj.legObject.id).trigger("click");
			}
		}
	}
};
/**
 * To validate the days entered on focus out from day input
 * @param event
 * @param legDetailPopUpObj
 * @returns
 */
LegDetailPopUp.prototype.volumnDayBlurHandler = function(event, legDetailPopUpObj) {
	var availableDays = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	var enteredDays = legDetailPopUpObj.getValuesArray($(event.currentTarget).val());
	var isValid = containsAll(enteredDays, availableDays);
	if(!isValid) {
		$(event.currentTarget).val(EMPTY_STRING);
		parent.showFilterErrorMsg("You can only see volumes for days included in your query");
		$("#getVolumeBtn_"+legDetailPopUpObj.legObject.id).attr("disabled", true);
	}
	return isValid;
};
/**
 * To show day control in click of calendar icon
 * @param e
 * @param calBtn
 * @param legId
 * @returns
 */
LegDetailPopUp.prototype.onVolDayCalenderClick = function(e,calBtn, legId) {
	var selDays;
	if(selDays == "" || selDays == null){
		selDays = $("#"+e.currentTarget.textInputId)[0].value;
	}	
	var keyObject = {dashboardId: viewerDashboardId, dataType: parent.getDataType(isScheduleForNetworkFlag)};
	var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	var days = parent.getAvailableDays(parent.getDataType(isScheduleForNetworkFlag));
	if(days) {
		if(!selectedDays) {
			selectedDays = days.toString();
		}
		if(selDays != ""){
			selectedDays =  selDays;
		}
		//, $("#selectedEffectiveDay_"+legId).val()
	 	showDayControl(false, selectedDays, calBtn, true, keyObject, true, days.toString(), parent.getSelectedCase(),null,null,null,null,setSelectedDays);
	} else {
		alert('No days to select');
	}
	
	//showDayControl(false,selDays,calBtn, false, "", true);
};
/**
 * To set the selected day from day control in day input
 */
function setSelectedDays(lastClickedCalBtn, selectedDaysStr, keyObject) {
	if(selectedDaysStr == EMPTY_STRING){
		lastClickedCalBtn.isNoDaySelected = true;
		parent.showErrorMsg("Please select at least one day on the calendar");
		return true;
	}else {
		if(typeof selectedDaysStr == "string") {
			$(lastClickedCalBtn).parent().siblings().eq(1).find("input").val(selectedDaysStr);
		}
		if(selectedDaysStr && selectedDaysStr.selectedPlanDays) {
			$(lastClickedCalBtn).parent().siblings().eq(1).find("input").val(selectedDaysStr.selectedPlanDays);
		}
		//$(lastClickedCalBtn).parent().siblings().eq(2).find("#getVolumeBtn").removeAttr("disabled");
		$(lastClickedCalBtn).parent().parent().find("input[type='button']").removeAttr("disabled");
		parent.showErrorMsg(EMPTY_STRING);
		lastClickedCalBtn.isNoDaySelected = false;
	}
}
/**
 * To add the show volume div in pop-up window
 * @returns
 */
LegDetailPopUp.prototype.addShowVolumes = function() {
	var legDetailPopUpObj = this;
	var element;
	var div = document.createElement("div");
	div.id = "details_" + this.legObject.id;
	div.className = "showVolumnStyle";
	
	element = document.createElement("input");
	element.id = "selectedEffectiveDay_" + this.legObject.id;
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
	element.id = "volumn_" + this.legObject.id;
	element.setAttribute("type", "text");
	element.onkeyup = function(event) {
		legDetailPopUpObj.volumnDayKeyUpHandler(event, legDetailPopUpObj);
	};
	element.onblur = function(event) {
		legDetailPopUpObj.volumnDayBlurHandler(event, legDetailPopUpObj);
	};
	var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
	if(selectedDays ){
		if(selectedDays instanceof Array){
			var dayStr ="";
			for(var v=0; v<selectedDays.length;v++ ){
				
				if(v == selectedDays.length-1){
					dayStr +=  selectedDays[v];
				}else {
					dayStr+=  selectedDays[v]+",";
				}
			}
			element.setAttribute("value", dayStr);
		}			
		else{
			element.setAttribute("value", selectedDays);
		}			
	}	
	cell.appendChild(element);	
	row.appendChild(cell);
	
	cell = document.createElement("td");
	element = document.createElement("div");
	element.id = "volumeForDay_" + this.legObject.id;
	element.textInputId = "volumn_" + this.legObject.id;
	element.className = "calendar-mini";
	element.onclick = function(e) {
		legDetailPopUpObj.onVolDayCalenderClick(e,element, legDetailPopUpObj.legObject.id);
		setTimeout(function(){
			legDetailPopUpObj.resizeMatrix();
		},50);
	};
	cell.appendChild(element);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	element = document.createElement("input");
	element.id = "getVolumeBtn_" + this.legObject.id;
	element.setAttribute("type", "button");
	element.setAttribute("value", "Get volumes");
	element.setAttribute("class", "closeAll");	
	element.setAttribute("disabled", "disabled");
	element.onclick = function() {
		legDetailPopUpObj.filterGridData(legDetailPopUpObj);
	};
	element.setAttribute("class", "closeAll");
	cell.setAttribute("class", "tdVolumneBtn");
	cell.style.width = "100%";
	cell.appendChild(element);
	
	row.setAttribute("valign", "top");
	row.appendChild(cell);
	
	cell = document.createElement("td");
	cell.style.width = "90px";
	cell.style.textAlign = "right";
    element = document.createElement("label");
	element.innerHTML = "Mv No &nbsp;&nbsp;";
	cell.appendChild(element);
	element = document.createElement("label");
	try {
		element.innerHTML = (this.legObject.attributes.LegDetails[0]).mvNbr;
	}catch (e) {
	}
	element.id = "mvSegNo_" + this.legObject.id;
	element.style.color = "#003366";
	cell.appendChild(element);
	row.appendChild(cell);
	
	tblBody.appendChild(row);
	div.appendChild(tblBody);
	
	document.getElementById("secondMatrixDiv_" + this.legObject.id).appendChild(div);
};
/**
 * To add leg detail div in pop-up window
 * @param details
 * @param count
 * @returns
 */
LegDetailPopUp.prototype.addLegDetails = function(details, count) {
    var legDetailPopUp = this;
	var div = document.createElement("div");
	div.id = "details_" + this.legObject.id + "_" + count;
	div.className = "legDetailDiv";
	/*div.style.height = "80px";
	div.style.width = "430px";*/
	div.style.width = "530px";
	var leftdiv = document.createElement("div");
	leftdiv.className = "detailLeftDiv";
	leftdiv.style.width = "440px";
	var rightdiv = document.createElement("div");
	rightdiv.className = "detailRightDiv";
	
	var tbl = document.createElement("table");
	/*tbl.setAttribute("border", "1");*/
	tbl.setAttribute("cellpadding", "0");
	tbl.setAttribute("cellspacing", "0");
    var tblBody = document.createElement("tbody");
    var row, cell, cellText, label, element;
    
    row = document.createElement("tr");
    
    cell = document.createElement("td");	/* Row1 column1 - Dept days*/
    /*cell.colSpan = 2;  */  
    cellText = document.createTextNode("Dept days");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
	
    cell = document.createElement("td"); 	/* Row1 column2 - label*/
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = parent.getEffDaysStringFromSystemSetting(details, "day");
    cell.appendChild(label);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row1 column3 - Calendar Icon */
    cell.setAttribute("align", "left");
    element = document.createElement("img");
	element.id = "calendar_" + this.legObject.id + "_" + count;
	element.src = ICON_IMAGE_PATH_DAYS;
	element.onclick = function() {
		legDetailPopUp.openCalendar(legDetailPopUp, element, details.day, details.noOpDaysL);
	};	
	div.appendChild(element);
	cell.appendChild(element);
    row.appendChild(cell);
	
    //space
    cell = document.createElement("td");	/* Row1 column4 - Blank Space */
	cell.setAttribute("style", "width:20px");
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	
    cell = document.createElement("td");	/* Row1 column5 - Ground Time */
    cellText = document.createTextNode("Ground Time");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row1 column6 - Label */
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.groundTime;
    cell.appendChild(label);
    row.appendChild(cell);
    
    tblBody.appendChild(row);
    
    row = document.createElement("tr");
    
    cell = document.createElement("td");	/* Row2 column1 - Seq # */	
    cellText = document.createTextNode("Leg #");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    /*cell.colSpan = 2;  */
    cell.appendChild(cellText);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row2 column2 - label */
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.mvNbrSeq;
    cell.appendChild(label);
    row.appendChild(cell);
	    
    cell = document.createElement("td");	/* Row2 column3 - Leg Type */	
    cellText = document.createTextNode("Leg type");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row2 column4 - value */	
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.legType;
    cell.appendChild(label);
    row.appendChild(cell);
	    
    cell = document.createElement("td");	/* Row2 column5 - Carrier */	
    cellText = document.createTextNode("Carrier");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
	
    cell = document.createElement("td");	/* Row2 column6 - value */	
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.carrier != undefined ? details.carrier: "";
    cell.appendChild(label);
    row.appendChild(cell);
	
    tblBody.appendChild(row);
    
    row = document.createElement("tr");
    
    cell = document.createElement("td");	/* Row3 column1 - Max wgt */	
    /*cell.colSpan = 2;*/
    cellText = document.createTextNode("Max wgt");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row3 column2 - label */	
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.maxWt;
    cell.appendChild(label);
    row.appendChild(cell);
	
	//space
    cell = document.createElement("td");	/* Row3 column3 - Blank Space */	
	cell.setAttribute("style", "width:8px");
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	//space
    cell = document.createElement("td");	/* Row3 column4 - Blank Space */	
    cell.setAttribute("style", "width:20px");
	cellText = document.createTextNode(" ");
	cell.appendChild(cellText);
	row.appendChild(cell);
	
    
	cell = document.createElement("td");	/* Row3 column5 - Max cube */	
    cellText = document.createTextNode("Max cube");
    cell.className = "grey-text";
    cell.setAttribute("align", "right");
    cell.appendChild(cellText);
    row.appendChild(cell);
		
    cell = document.createElement("td");	/* Row3 column6 - label */	
    cell.setAttribute("align", "left");
    label = document.createElement("label");
    label.innerHTML = details.maxCu;
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
   /* mCell.appendChild(tbl);*/
    mRow.appendChild(mCell); 
    
    mCell = document.createElement("td");
    var btnDiv = document.createElement("div");
    btnDiv.id = "btn_" + this.legObject.id;
    var element = document.createElement("span");
    element.id="span_"+count;
	//element.setAttribute("type", "button");
    //element.setAttribute("value", "Details");
    element.setAttribute("class", "k-icon matrix-off");
    element.setAttribute("style", "cursor: pointer;");
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
    	/*var selectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
		$("#volumn_" + legDetailPopUp.legObject.id).val(selectedDays);
		*/
		$("#selectedEffectiveDay_"+legDetailPopUp.legObject.id).val(details.day);
		$(element).removeClass("matrix-off");
    	$(element).addClass("k-icon matrix-on");
    	showBusyCursor();      	
    	legDetailPopUp.loadLegMatrix("matrix_" + legDetailPopUp.legObject.id, details);
    	setTimeout(function (){
    		legDetailPopUp.filterGridData(legDetailPopUp);
    	}, 100);
    };
    btnDiv.appendChild(element);    
    mCell.appendChild(btnDiv);
    mCell.setAttribute("style", "padding-left: 10px");
    mRow.appendChild(mCell);     
    mTblBody.appendChild(mRow);  
    //mTbl.appendChild(mTblBody);
    mTblBody.setAttribute("align", "center");
    rightdiv.appendChild(mTblBody);
    div.appendChild(rightdiv);
    
    document.getElementById("firstLegDetailDiv_" + this.legObject.id).appendChild(div);
};
/**
 * Day control click handler to show calendar
 * @param legDetailPopUp
 * @param calBtn
 * @param effectiveDay
 * @param noOpDaysL
 * @returns
 */
LegDetailPopUp.prototype.openCalendar = function(legDetailPopUp, calBtn, effectiveDay, noOpDaysL) {
	showDayControl(false, effectiveDay, calBtn, true, legDetailPopUp, true, null, null, noOpDaysL,null,null,null,setSelectedDays);
};
/**
 * To create and add leg daigram in pop-up window
 * @param details
 * @param count
 * @returns
 */
LegDetailPopUp.prototype.createDiagram = function(details, count) {
	var outerDiv = document.createElement("div");
	outerDiv.className = "goDiagramStyle";
	outerDiv.style.paddingBottom = "10px";
	var div = document.createElement("div");
	div.style.width = "370px";
	div.id = "diagram_" + this.legObject.id  + "_" + count;
	document.getElementById("firstLegDetailDiv_" + this.legObject.id).appendChild(outerDiv).appendChild(div);
	var legDiagram = this.$s$(go.Diagram, div.id, 
							{isReadOnly: true, allowMove: false, allowSelect:false, allowHorizontalScroll: false, allowVerticalScroll:false });
	
	return legDiagram;
};
/**
 * Add leg daigram in pop-up window
 * @param details
 * @param count
 * @returns
 */
LegDetailPopUp.prototype.addLegDiagram = function(details, count) {
	var legDiagram ;
	try {
		legDiagram = this.createDiagram(details, count);
	} catch (e) {
		document.removeChild("diagram_" + this.legObject.id  + "_" + count);
		legDiagram = this.createDiagram(details, count);
	}
	
	legDiagram.nodeTemplate = this.getNodeTemplate();
	if(this.isTemplateAlreadyDefined) {
		legDiagram.linkTemplate = this.getStyle(details.legStyleId);
	} else {
		var linkTemplateMap = getPopupLinkTemplateMap();
		if(!linkTemplateMap[details.legStyleId]) {
			linkTemplateMap[details.legStyleId] = this.getLinkTemplate(this.getStyle(details.legStyleId));
		}
		legDiagram.linkTemplate = linkTemplateMap[details.legStyleId];
	}
	
	var nodeDataArray = [
	         	      	{ key: details.origin, name: details.origin, figure: "RoundedRectangle", color: this.getColor(details.originAP), width: 48, height:20, loc: "0 5"},
	         	      	{ key: details.destination, name: details.destination,  figure: "RoundedRectangle", color: this.getColor(details.destinationAP), width: 48, height:20, loc: "310 5"}
	             	];
	
	var detailsObj = clone(details);
	var nextArrivalDay = EMPTY_STRING;
	if(detailsObj.nextArrivalDay != null && parseInt(detailsObj.nextArrivalDay) != 0) {
		if(parseInt(detailsObj.nextArrivalDay) < 0) {
			nextArrivalDay = " (" + detailsObj.nextArrivalDay + ")";
		}else {
			nextArrivalDay = " (+" + detailsObj.nextArrivalDay + ")";
		}
	}
	if(this.isLocalFlag) {
		detailsObj.arrivalTime = detailsObj.arrivalTime + nextArrivalDay;
		detailsObj.departureTime = detailsObj.departureTime + " (L)";
	}else {
		detailsObj.arrivalTime = detailsObj.arrivalTime + nextArrivalDay;
		detailsObj.departureTime = detailsObj.departureTime + " (Z)";
	}
	
	var legLinkObject = clone(this.clonedLegObject);
	legLinkObject.category = detailsObj.legStyleId;
	legLinkObject.attributes.LegDetails = [detailsObj];
	legLinkObject.from = detailsObj.origin;
	legLinkObject.to = detailsObj.destination;
	
	var linkDataArray = [legLinkObject];
	
	legDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
	
	return legDiagram; 
};
/**
 * Default node template for gojs diagram
 * @returns
 */
LegDetailPopUp.prototype.getNodeTemplate = function() {
	return 	this.$s$(go.Node, go.Panel.Auto,
        	this.$s$(go.Shape,
          		{figure: "RoundedRectangle", stroke:"#558ED5"},
          		new go.Binding("fill", "color"),
          		new go.Binding("width", "width"),
          		new go.Binding("height", "height"),
          		new go.Binding("figure", "figure")
          	),
        	this.$s$(go.TextBlock,
          		{ margin: 3, stroke: "#ffffff", font : "9pt Arial"  },
          		new go.Binding("text", "key")
          	),
          	new go.Binding("location", "loc", go.Point.parse)
 		);
};
/**
 * Default link template for gojs diagram
 * @param style
 * @returns
 */
LegDetailPopUp.prototype.getLinkTemplate = function(style) {
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
 * Leg detail diagram link properties
 * @param symbolProperties
 * @returns
 */
LegDetailPopUp.prototype.getLineSymbolProperties = function(symbolProperties) {
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
 * Convert color to hex code
 * @param colorStr
 * @returns
 */
LegDetailPopUp.prototype.toHexColor = function(colorStr) {
	if(colorStr && colorStr.charAt(0) != '#') {
		return "#"+colorStr.substring(2);
	}
	
	return colorStr;
};
/**
 * Matrix column scheme
 * @returns
 */
function getLegDetailPopupMatrixSchema() {
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
			PERCENT_WEIGHT: {
				type: "number"
			}, 
			PERCENT_CUBE: {
				type: "number"
			},
			AVAIL_WEIGHT: {
				type: "number"
			},
			AVAIL_CUBE: {
				type: "number"
			},
			TOTAL_EXCESS_WEIGHT: {
				type: "number"
			},
			TOTAL_EXCESS_CUBE: {
				type: "number"
			}, 
			MAX_WEIGHT: {
				type: "number"
			},
			MAX_CUBE: {
				type: "number"
			}
		};
	
	return addProductGroupsSchema(gridFields, true);
}
/**
 * Matrix column with styles/attributes
 * @returns {Array}
 */
function getLegDetailPopupMatrixColumns() {
	var matrixCols = [ {
	        field: "DAY",
	        width: 32,
	        title: "Day",
	        attributes:{style:"text-align:center;"}
	    }, {
	    	field: "TOTAL_WEIGHT",
	    	width: 55,
	        title: "Ttl Wt",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	       		title: "Ttl Wt"
	       	}
	    }, {
	    	field: "TOTAL_CUBE",
	        width: 55,
	        title: "Ttl Cu",
	       	attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	       		title: "Ttl Cu"
	      	}
	    }, {
	    	field: "TOTAL_PIECES",
	        width: 55,
	        title: "Ttl Pcs",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	       		title: "Ttl Pcs"
	      	}
	    }, {
			field: "TOTAL_EXCESS_WEIGHT",
			width: 55,
			title: "Excess Wt",
			attributes:{style:"text-align:right;"}, format:"{0:n0}",
			headerAttributes: {
				title:"Excess Wt"
	      	}
		}, {
			field: "TOTAL_EXCESS_CUBE",
			width: 55,
			title: "Excess Cu",
			attributes:{style:"text-align:right;"}, format:"{0:n0}",
			headerAttributes: {
				title:"Excess Cu"
			}
		}, {
	    	field: "PERCENT_WEIGHT",
	        width: 55,
	        title: "Ttl Wt %",
	        attributes:{style:"text-align:right;"}, format:"{0:p0}",
	        headerAttributes: {
      		  	title: "Ttl Wt %"
      	  	}
	    }, {
	    	field: "PERCENT_CUBE",
	        width: 55,
	        title: "Ttl Cu %",
	        attributes:{style:"text-align:right;"}, format:"{0:p0}",
	        headerAttributes: {
	        	title: "Ttl Cu %"
      	  	}
	    }, {
	    	field: "AVAIL_WEIGHT",
	        width: 55,
	        title: "Avail Wt",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	       		title: "Avail Wt"
	       	}
	    }, {
	    	field: "AVAIL_CUBE",
	        width: 55,
	        title: "Avail Cu",
	        attributes:{style:"text-align:right;"}, format:"{0:n0}",
	       	headerAttributes: {
	       		title: "Avail Cu"
	       	}
	    }, {
			field: "MAX_WEIGHT",
			width: 55,
			title: "Max Wt",
			attributes:{style:"text-align:right;"}, format:"{0:n0}",
			headerAttributes: {
				title:"Max Wt"
	      	}
		}, {
			field: "MAX_CUBE",
			width: 55,
			title: "Max Cu",
			attributes:{style:"text-align:right;"}, format:"{0:n0}",
			headerAttributes: {
				title:"Max Cu"
			}
		}
    ];
	
	matrixCols = addProductGroupsColumns(matrixCols, true, false);
	return matrixCols; 
}
/**
 * Matrix datasource parameters
 */
function getLegDetailPopupMatrixDatasourceParams(idStr, isScheduleForNetwork) {
	var params = {};
	params.commonCaseId = parent.getCommonCaseId();
	params.scheduleId = parent.getScheduleId();
	params.effDayPatternStr = parent.getSelectedEffDayStrPattern();	
	params.browserSessionId = parent.getBrowserSessionId();
	if(parent.isNetworkQuery) {
		params.isScheduleForNetwork = isScheduleForNetwork;
	}
	params.idStr = idStr;
	var prodGrps = getProdGroupConfiguration();
	if(prodGrps && prodGrps != "") {
		params.prodGrps = prodGrps;
	}

	params.wtConversionFactor = isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1;
	
	return params;	
}