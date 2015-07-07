/**
 * @author Honey Bansal
 */

var addPreviousLeg = "Add Previous Leg";
var addNextLeg = "Add Next Leg";

function clear(){
	parent.selectedWIPLegList = [];
	parent.selectedWIPRouteList= [];
	parent.selectedWIPSeasonLegList = [];
	initializeWIPMatrix();
}
function refresh() {
	initializeWIPMatrix();
}

/**
	Generic method that invokes after master data gets initialized... 
*/
function afterMasterDataInitialized(){
	//initalizeFlightRouteData(getDataSourceData("FlightRoutes"));
}

function initializeWIPMatrix() {
	if(!isInitialized){
		gridId = "routeMatrixWIPGrid";
		dashboardID = parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP;
		parent.VIEWER.addButtonsBar(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP, $("#headerButtonsBar"));
		initializeKendoWinodw();
		bindCloseHandler();
		isInitialized = true;
		
	}else {
		destroyGrid(gridId);
	}
	setLocalZuluBtnState();
	initRouteGrid(gridId);
	handleNewRoute();
}

function bindCloseHandler(){ //FDX-1162 WIP: Close Red X Should "Clear Routes and Close Panel"
	// event handler for close
	var onClose = function(e) {
		if(e.userTriggered) {
			removeRouteFromWIPOnly(EMPTY_STRING,'routeMatrixWIPGrid','true');
		}
	};
	// attach close event handler via bind()
	 var dashboardWindow = parent.dashboardController.getDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
	 dashboardWindow.data("kendoWindow").bind("close", onClose);
}
function initContextMenu(){
	if($("#context-menu").data("kendoContextMenu") != undefined){
		$("#context-menu").data("kendoContextMenu").destroy();
	}
	$("#scheduleMatrixMainWIPDiv").append("<ul id='context-menu'></ul>");
	$("#context-menu").kendoContextMenu({
		target: "#routeMatrixWIPGrid .k-legs-grid .k-grid-content",
		alignToAnchor: true,
		dataSource:[{text: addPreviousLeg},{text: "Add Next Leg"}],
		filter: "td",
		select: function(e) {
			// handle event
			var rtGrid_Id = rtCurrentTarget.parentElement.parentElement.parentElement.parentElement.id;
			if(e.item.textContent == addPreviousLeg){
				addRowHandler(rtCurrentTarget,rtGrid_Id,false,true);
			}else{
				addRowHandler(rtCurrentTarget,rtGrid_Id,false);
			}
		}
	});
}
function initRouteGrid(grid_Id) {
	var grid = $(HASH_STRING + grid_Id).kendoGrid({
		scrollable: true,
		dataSource: getRouteGridDataSource(),
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		editable: true,
		navigatable: true, // enable keyboard navigation
		detailTemplate: kendo.template($("#legsWIPGrid").html()),
		detailInit: detailInit,
		columns:getRouteGridColumns(grid_Id),
		dataBound: function() {
			if(expandedRoutes && expandedRoutes.length > 0) {
				var gridData =  $("#"+gridId).data("kendoGrid");
				var masterRows = gridData.tbody.find("tr.k-master-row");
				for(var i=0; i < masterRows.length;i++){
					if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
						var tempData = gridData.dataItem(masterRows[i]);
						for(var p = 0; p < expandedRoutes.length; p++){
							if(tempData["ROUTE_ID"] == expandedRoutes[p]){
								this.expandRow(masterRows[i]);
							}
						}
					}
				}
			}
		},
		edit: function(e) {
			setEditValues(e.container);
			this.expandRow(e.container.parent());
			enableDisableColumnCell(e, this);
			routeGridEditHandler(e);
		},
		editable: {
            confirmation: false
        }
	});
	addMouseOverEventToGrid(grid_Id);
	addExpandCollapseClickhandler(grid_Id);
	refreshMatrixWithData();
}

function addExpandCollapseClickhandler(grid_Id) {
	var gridData = $("#"+grid_Id).data("kendoGrid");
	var table = $("#"+grid_Id).find("div.k-grid-content table");
	table.on("click", "a.k-icon.k-plus", function(event) {
		if($(event.currentTarget).parents().eq(5).attr("id").indexOf("routeMatrixWIPGrid") >= 0) {
			var tempData = gridData.dataItem($(event.currentTarget).parents("tr.k-master-row"));
			if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) < 0) {
				expandedRoutes.push(tempData["ROUTE_ID"]);
			}
		}
	});
	table.on("click", "a.k-icon.k-minus", function(event) {
		if($(event.currentTarget).parents().eq(5).attr("id").indexOf("routeMatrixWIPGrid") >= 0) {
			var tempData = gridData.dataItem($(event.currentTarget).parents("tr.k-master-row"));
			if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) > -1) {
				var index = expandedRoutes.indexOf(tempData["ROUTE_ID"]);
				expandedRoutes.splice(index, 1);
			}
		}
	});
	
	var headerCell = $("#"+grid_Id).find("div.k-grid-header table").find("th.k-hierarchy-cell.k-header");
	if(headerCell.parents().eq(5).attr("id").indexOf("routeMatrixWIPGrid") >= 0) {
		headerCell.append('<a class="k-icon k-plus" onclick="expandCollapseAll(this)" id="expandCollapseIcon" href="#" tabindex="-1"></a>');
	}
}

function expandCollapseAll(btn) {
	var isExpand = $(btn).hasClass("k-plus");
	var grid = $("#"+gridId).data("kendoGrid");
	var masterRows = grid.tbody.find("tr.k-master-row");
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
			var tempData = grid.dataItem(masterRows[i]);
			if(isExpand) {
				if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) < 0) {
					expandedRoutes.push(tempData["ROUTE_ID"]);
				}
				grid.expandRow(masterRows[i]);
			}else {
				if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) > -1) {
					var index = expandedRoutes.indexOf(tempData["ROUTE_ID"]);
					expandedRoutes.splice(index, 1);
				}
				grid.collapseRow(masterRows[i]);
			}
		}
	}
	if(isExpand) {
		$(btn).removeClass("k-plus");
		$(btn).addClass("k-minus");
	}else {
		$(btn).addClass("k-plus");
		$(btn).removeClass("k-minus");
	}
}

function setEditValues(addBtn){
	if(addBtn[0] != undefined && addBtn[0].id.indexOf("legsGrid") >= 0){
		isEditLeg = true;
	} else if (addBtn[0] != undefined && $(addBtn).parent().parent().parent().parent().parent()[0].id.indexOf("legsGrid") >= 0) {
		isEditLeg = true;
	} else{
		isEditLeg = false;
	}
	currentGridId = addBtn.parent().parent().parent().parent().parent().attr("id");
	if(currentGridId == null) {
		currentGridId = addBtn.attr("id").replace("_active_cell", "");
	}
	if(currentGridId == null) {
		currentGridId = gridId;
	}
	isServiceCallOnEdit = true;
	var grid = $(HASH_STRING+currentGridId).data("kendoGrid");
	var row = $(addBtn).closest("tr");
	if(grid != null) {
		var dataItem = {};
		dataItem = jQuery.extend(true, {}, grid.dataItem(row));
		currentEditIndex = getRowIndex(grid.dataSource,dataItem);
		currentEditCellType = addBtn.find("input.k-input").attr('data-bind');
		if(currentEditCellType != undefined && currentEditCellType.length > 0 ){
			currentEditCellType = currentEditCellType.substr(6,currentEditCellType.length);
		}else{
			currentEditCellType = "";
		}
		console.log("currentEditIndex:"+currentEditIndex +"\n currentEditCellType:"+currentEditCellType);
	}
}

function isServiceCallAfterEdit(){
    return (typeof isServiceCallOnEdit != 'undefined' && isServiceCallOnEdit != undefined && isServiceCallOnEdit == true);
}

function addLegsGrid(detailRow, e) {
	var gridDiv = detailRow.find("div.k-legs-grid");
	var ramdomId;// = "legsGrid_" + (LEGS_GRID_ID++);
	var legsGridData = $.grep(parent.selectedWIPLegList, function(item) {
		return item.ROUTE_ID == e.data.ROUTE_ID;
	});
	if(legsGridData == null || legsGridData.length == 0) {
		legsGridData = [getLegObj()];
	}
	ramdomId = "legsGrid_" +(legsGridData[0] != undefined ? legsGridData[0]['ROUTE_ID'] : EMPTY_STRING);
	gridDiv.attr("id", ramdomId);
	gridDiv.kendoGrid({
		scrollable: true,
		dataSource: SkdMxREGridHelper.getLegsGridManager().getLegsGridDataSource(legsGridData, false, parent.getScheduleMaintenananceSelectedMenu(e.data["ROUTE_CONTEXT_CD"])),
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		editable: true,
		navigatable: true,
		columns:SkdMxREGridHelper.getLegsGridManager().getLegsGridColumns(ramdomId,dashboardID, false, parent.getScheduleMaintenananceSelectedMenu(e.data["ROUTE_CONTEXT_CD"])),
		editable: {
            confirmation: false
        },
	  	edit: function(e) {
	  		setEditValues(e.container);
	  		displayValidationForLastTwRow(e);
	  		legGridEditHandler(e);
	  		disableAllColumnCell(e, this);
		}
	});
	parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
	$("#"+ ramdomId +" .k-grid-content").on('mousedown', 'tr', function (e) {
        //For Right Click --> 
		if (e.which == 3) {
			rtCurrentTarget = e.currentTarget;
			initContextMenu();
        }
	});
}

function addSeasonsGrid(detailRow, e) {
	var gridDiv = detailRow.find("div.k-seasons-grid");
	var ramdomId = "seasonsGrid_" + LEGS_GRID_ID++;
	var seasonGridData = $.grep(parent.selectedWIPSeasonLegList, function(item) {
		return (item.ROUTE_ID == e.data.ROUTE_ID && e.data.ROUTE_ID != "");
	});
	gridDiv.attr("id", ramdomId);
	gridDiv.kendoGrid({
		scrollable: true,
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		editable: false,
		navigatable: true,
		columns:SkdMxREGridHelper.getSeasonsGridManager().getSeasonsGridColumns(ramdomId),
		dataSource: SkdMxREGridHelper.getSeasonsGridManager().getSeasonsGridDataSource(seasonGridData)
	});
}

function refreshMatrixWithData() {
	if(parent.selectedWIPRouteList && parent.selectedWIPRouteList.length >= 0) {
		//$('#'+gridId).data("kendoGrid").dataSource.data(parent.selectedWIPRouteList);
        if($('#'+gridId).data("kendoGrid") != undefined){
            $('#'+gridId).data("kendoGrid").dataSource.data($('#'+gridId).data("kendoGrid").dataSource.options.schema.parse(parent.selectedWIPRouteList));
        }
	}
	initializeValidation();
	parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
	disableDeletedRow();
	expandCollapse();
	enableDisableSaveNDeteleBtn();
	//console.log("copy to WIP done:" +getTime()); //FDX-1183
	//parent.stopSecondsTimer(); //FDX-1183
}


function expandCollapse() {
	var headerCell = $("#"+gridId).find("div.k-grid-header table").find("th.k-hierarchy-cell.k-header");
	if (headerCell.length>1) {
		headerCell =$(headerCell[0]);
	}
	if (expandedRoutes && expandedRoutes.length>0 && parent.selectedWIPRouteList.length==1) {
		if(headerCell.parents().eq(5).attr("id").indexOf("routeMatrixWIPGrid") >= 0) {
			var collapseIcon = headerCell.find(".k-icon.k-plus");
			var expandIcon = headerCell.find(".k-icon.k-minus");
			for (var i =0; i < collapseIcon.length;i++) {
				$(collapseIcon[i]).remove();
			}
			for (var i =0; i < expandIcon.length;i++) {
				$(expandIcon[i]).remove();
			}
			//collapseIcon.remove();
			headerCell.append('<a class="k-icon k-minus" onclick="expandCollapseAll(this)" id="expandCollapseIcon" href="#" tabindex="-1"></a>');
		}	
	} else if (expandedRoutes && expandedRoutes.length==0) {
		var collapseIcon = headerCell.find(".k-icon.k-plus");
		var expandIcon = headerCell.find(".k-icon.k-minus");
		for (var i =0; i < collapseIcon.length;i++) {
			$(collapseIcon[i]).remove();
		}
		for (var i =0; i < expandIcon.length;i++) {
			$(expandIcon[i]).remove();
		}
		headerCell.append('<a class="k-icon k-plus" onclick="expandCollapseAll(this)" id="expandCollapseIcon" href="#" tabindex="-1"></a>');
	}
}
function disableDeletedRow() {
	try {
		var grid = $('#'+gridId).data("kendoGrid");
		var masterRows = grid.tbody.find("tr.k-master-row");
		for(var i=0; i < masterRows.length;i++){
			if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
				if(grid.dataItem(masterRows[i]).CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
					$(masterRows[i]).css("color", "#8f8f8f");
					$(masterRows[i]).next().find("table").css("color", "#8f8f8f");
				}
			}
		}
	}catch (e) {
		console.log("Error in disableDeletedRow");
	}
}

function closeWIPWindow(event) {
	parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
}

function disableAllColumnCell(e, that) {
	if(e.model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
		that.closeCell();
	}
}

function enableDisableColumnCell(e, that) {
	var input = e.container.find("input.k-input");
	if(e.model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
		that.closeCell();
	}else if(e.model.MODE == "Flight") {
		 if (e.model.CONVEYANCE =='Flt Feeder' && e.model.ROUTE_TYPE_CD =='Linehaul') {
			 if (input.attr("data-bind").indexOf("SCAC_CD_input") > -1) {
				 that.closeCell();
			 }
		 } else if (e.model.CONVEYANCE =='Flt Trunk') {
			 if (input.attr("data-bind").indexOf("SCAC_CD_input") > -1) {
				 that.closeCell();
			 }
		 }
		if(input.attr("data-bind").indexOf("TEMPORARY_ROUTE") > -1 || input.attr("data-bind").indexOf("EXPIRATION_DATE")  > -1 ||
				input.attr("data-bind").indexOf("ROUTE_TYPE_CD")  > -1 || input.attr("data-bind").indexOf("IATA_MV_NBR")  > -1 ||
				input.attr("data-bind").indexOf("BAL_MV_NBR")  > -1 || input.attr("data-bind").indexOf("USE_LEG_MINS_FLAG") > -1 ) {
			that.closeCell();
		}
	}else if (e.model.MODE == "Truck") {
		if (e.model.ROUTE_TYPE_CD =='Linehaul' || e.model.ROUTE_TYPE_CD =='Shuttle') {
			if (input.attr("data-bind").indexOf("SCAC_CD_input") > -1) {
				 that.closeCell();
			 }
		}else if (e.model.CAPACITY_CD == "Oversized") {
			if(input.attr("data-bind").indexOf("TEMPORARY_ROUTE") > -1 || input.attr("data-bind").indexOf("EXPIRATION_DATE")  > -1 ||
					input.attr("data-bind").indexOf("ROUTE_TYPE_CD")  > -1 || input.attr("data-bind").indexOf("IATA_MV_NBR")  > -1 ||
					input.attr("data-bind").indexOf("BAL_MV_NBR")  > -1 || input.attr("data-bind").indexOf("USE_LEG_MINS_FLAG") > -1 ||
					input.attr("data-bind").indexOf("SCAC_CD_input") > -1) {
				that.closeCell();
			}
		}
	}
}

function updateSelectedRouteNLegList() {
	var legsGirds =  $("#"+gridId).find("div.k-legs-grid");
	if(legsGirds != undefined && parent.selectedWIPRouteList != undefined && (legsGirds.length == parent.selectedWIPRouteList.length)){
		parent.selectedWIPRouteList = [];
		parent.selectedWIPLegList = [];
		try {
			parent.selectedWIPRouteList = $("#"+gridId).data("kendoGrid").dataSource.data().toJSON();
			for(var i=0; i<legsGirds.length; i++) {
				$.merge(parent.selectedWIPLegList, $(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON());
			}
			bindAllocationsToLegsData(parent.selectedWIPRouteList,parent.selectedWIPLegList);
		}catch (e) {
			console.log("Error while updating the leg list");
		}
	}else{
		var routeLegDataMap = {};
		parent.selectedWIPRouteList = [];
		try {
			parent.selectedWIPRouteList = $("#"+gridId).data("kendoGrid").dataSource.data().toJSON();
			for(var j=0; j < parent.selectedWIPLegList.length; j++){
				if(isNull(routeLegDataMap[parent.selectedWIPLegList[j]["ROUTE_ID"]])){
					routeLegDataMap[parent.selectedWIPLegList[j]["ROUTE_ID"]] = [parent.selectedWIPLegList[j]];
				}else{
					(routeLegDataMap[parent.selectedWIPLegList[j]["ROUTE_ID"]]).push(parent.selectedWIPLegList[j]);
				}
			}	
			parent.selectedWIPLegList = [];
			for(var i=0; i < legsGirds.length; i++) {
				if($(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON() != undefined &&
						$(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON()[0] != undefined && 
						routeLegDataMap[$(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON()[0]["ROUTE_ID"]] != undefined){
					routeLegDataMap[$(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON()[0]["ROUTE_ID"]] = undefined;
				}
				$.merge(parent.selectedWIPLegList, $(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON());
			}
			//var keys = Object.keys(routeLegDataMap);
			for(var p = 0; p < parent.selectedWIPRouteList.length; p++){
				if(routeLegDataMap[parent.selectedWIPRouteList[p]["ROUTE_ID"]] != undefined){
					$.merge(parent.selectedWIPLegList,routeLegDataMap[parent.selectedWIPRouteList[p]["ROUTE_ID"]]);
				}
			}	
			//keys = undefined;
			bindAllocationsToLegsData(parent.selectedWIPRouteList,parent.selectedWIPLegList);
		}catch (e) {
			console.log("Error while updating the leg list");
		}
	}
}

function getSelectedRouteList() {
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var masterData = [];
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0 && masterRows[i].childNodes[1].childNodes[0].checked){
			masterData.push(gridData.dataItem(masterRows[i]));
		}
	}
	return masterData;
}

function deleteFromSchedule(event) {
	/*var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var masterData = [];
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0 && masterRows[i].childNodes[1].childNodes[0].checked){
			masterData.push(gridData.dataItem(masterRows[i]));
		}
	}*/
	var masterData = getSelectedRouteList();
	if(masterData.length > 0) {
		showConfirmation(masterData, "routeRow");
	}
}

function getSelectedRouteListForFlightFnl() {
	var masterData = getSelectedRouteList();
	var flightSelectedRouteList = [];
	if(masterData.length > 0) {
		for (var i=0; i <masterData.length;i++) {
			if (masterData[i].MODE=="Flight" && parent.getSelectedCase().caseType=='FNL') {
				flightSelectedRouteList.push(masterData[i]);
			}
		}
	}
	var routeWithoutDiscardRevision = [];
	if (flightSelectedRouteList.length > 0) {
		routeWithoutDiscardRevision = getRouteWithoutDiscardRevision(flightSelectedRouteList);
	}
	var routeWithOutRevision=[];
	if (routeWithoutDiscardRevision.length > 0){
		routeWithOutRevision = getRouteWithoutRevisionComment(routeWithoutDiscardRevision);
	}
	return 	routeWithOutRevision;
}

function showAlertForRevsion(routeList) {
	var alertWindow = $("#revisionAlertWindow");
	if(!alertWindow.data("kendoWindow")) {
		alertWindow.css({display : "block"});
		alertWindow.kendoWindow({
			height: "150px",
			width: "300px",
			draggable: true,
			modal: true,
			resizable: false,
			actions: ["close"],
			title: "Alert"
		});
	}
	alertWindow.data("kendoWindow").content("");
	var leftdiv=$('<div></div>');
	//if (savedMvNum != "") {
		var saveTable =  $('<table></table>').attr('style',"font-family:Arial, Helvetica, sans-serif;font-weight:bold;font-size:8pt");
		saveTable.appendTo(leftdiv);
		var row = $('<tr></tr>').appendTo(saveTable);
		$('<td></td>').text("Revision NOT added for following Routes:").appendTo(row); 
		for(var i=0; i<routeList.length; i++) {
			var row = $('<tr></tr>').appendTo(saveTable);
			var column = $('<td></td>').appendTo(row);
			$('<span style="padding-left:40px"></span>').text(routeList[i]["MV_NUM"]).appendTo(column); 
			$('<span style="padding-left:20px"></span>').text(routeList[i]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(column); 
		}
	//}
	leftdiv.appendTo(alertWindow);	
	($('<br>')).appendTo(alertWindow);
	($("<input onclick='OkHandler(event)' style='min-width: 45px !important;margin-left:90px;' type='button' value='OK'/>")).appendTo(alertWindow);
	/*alertWindow.data("kendoWindow").content(leftdiv + "<br>" +
			"<input onclick='OkHandler(event)' style='min-width: 45px !important;margin-left:90px;' type='button' value='OK'/>");*/
	alertWindow.data("kendoWindow").center();
	alertWindow.data("kendoWindow").open();
}

function OkHandler(event) {
	if($("#revisionAlertWindow").data("kendoWindow")) {
		$("#revisionAlertWindow").data("kendoWindow").close();
	}
}

function duplicateRoute(event) {
	
}

function removeFromWIPOnly(event) {
	var isCheck = false;
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var tempData;
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0 && masterRows[i].childNodes[1].childNodes[0].checked){
			isCheck = true;
			tempData = gridData.dataItem(masterRows[i]).toJSON();
			if(tempData != undefined){
				parent.selectedWIPRouteList = $.grep(parent.selectedWIPRouteList, function(obj) {
					return obj["ROUTE_ID"] != tempData.ROUTE_ID;
				});
				parent.selectedWIPLegList = $.grep(parent.selectedWIPLegList, function(obj) {
					return obj["ROUTE_ID"] != tempData.ROUTE_ID;
				});
			}
		}
	}
	removeFromWIPInitialList();
	if (isCheck) {
		refreshMatrixWithData();
		if (parent.selectedWIPRouteList.length==0) {
			closeWIPWindow(null);
		}
	}
}

function removeFromWIPInitialList() {
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0 && masterRows[i].childNodes[1].childNodes[0].checked){
			tempData = gridData.dataItem(masterRows[i]).toJSON();
			parent.initialWIPRouteList = $.grep(parent.initialWIPRouteList, function(obj) {
				return obj["ROUTE_ID"] != tempData.ROUTE_ID;
		 	});
			parent.initialWIPLegList = $.grep(parent.initialWIPLegList, function(obj) {
				return obj["ROUTE_ID"] != tempData.ROUTE_ID;
		 	});
		}
	}
}

function onDefaultsServiceSuccess(response, io) {
	parent.showProgressDialog(false);
	if(( response && response.errorCd && response.errorCd > 0 )|| response && response._errorCd && response._errorCd > 0) {
		if(response.errorDesc){
			parent.showErrorMsg(response.errorDesc);
		}else{
			parent.showErrorMsg(response._errorDesc);
		}
	}else{
		if($("#context-menu").data("kendoContextMenu") != undefined){
			$("#context-menu").data("kendoContextMenu").destroy();
		}
		var rteData = $.parseJSON(response.rteData);;
		var legData = $.parseJSON(response.legData);
		if (parent.scheduleMxMode=="CREATE") {
			for(var i=0; i<rteData.length; i++) {
				rteData[i]["MENU"]=parent.scheduleMaintenananceSeletedMenu;
			}
			parent.scheduleMxMode="";
		}
		var matchingLegs = [];
		var nonMachingLegs = [];
		var isFound = false;
		for(var i=0; i<rteData.length; i++) {
			if(expandedRoutes && expandedRoutes.indexOf(rteData[i]["ROUTE_ID"]) < 0) {
				expandedRoutes.push(rteData[i]["ROUTE_ID"]);
			}
			matchingLegs =  $.grep(legData, function(obj) {
	            return obj["ROUTE_ID"] === rteData[i]["ROUTE_ID"];
	        });
			if(matchingLegs != null && matchingLegs.length > 0) {
				rteData[i]["MV_NUM"] = matchingLegs[0]["MV_NUM"];
				rteData[i]["LEG_TYPE"] = matchingLegs[0]["LEG_TYPE"];
				rteData[i]["EQUIP_TYPE"] = matchingLegs[0]["EQUIP_TYPE"];
			}
			isFound = false;
			if (gridId)
			for(var j=0; j<parent.selectedWIPRouteList.length; j++) {
				if(parent.selectedWIPRouteList[j]["ROUTE_ID"] == rteData[i]["ROUTE_ID"] || parent.selectedWIPRouteList[j]["ROUTE_ID"] == "") {
					rteData[i]["MENU"] = parent.selectedWIPRouteList[j]["MENU"];
                    //persisting the duplicate route status when invoking the time and cost....
                    rteData[i]["IS_DUPLICATE"] = parent.selectedWIPRouteList[j]["IS_DUPLICATE"];
					parent.selectedWIPRouteList[j] = rteData[i];
					isFound = true;
					break;
				}
			}
			if(isFound == false && parent.selectedWIPRouteList != undefined && isDuplicateRow()) {
				rteData[i]["IS_DUPLICATE"] = 2;
				rteData[i]["IS_CHECKED"] = true;
				parent.selectedWIPRouteList.splice(duplicateRouteIndex, 0,rteData[i]);
				//only original route have green color 
				if(parent.selectedWIPRouteList[duplicateRouteIndex - 1] != undefined){
					parent.selectedWIPRouteList[duplicateRouteIndex - 1]["IS_CHECKED"] = true;
					if(parent.selectedWIPRouteList[duplicateRouteIndex - 1]["IS_DUPLICATE"] == undefined && parent.selectedWIPRouteList[duplicateRouteIndex - 1]["IS_DUPLICATE"] != 2){
						parent.selectedWIPRouteList[duplicateRouteIndex - 1]["IS_DUPLICATE"] = 1;
					}
				}	
			}else if(isFound == false && parent.selectedWIPRouteList != undefined ) {
				parent.selectedWIPRouteList.splice(0, 0,rteData[i]);
			}
			nonMachingLegs = $.grep(parent.selectedWIPLegList, function(obj) {
				return (obj["ROUTE_ID"] != rteData[i]["ROUTE_ID"] && obj["ROUTE_ID"] != "");
			});
			//adding one allocation to show on UI
			appendAllocation(matchingLegs);
			parent.selectedWIPLegList = $.merge(nonMachingLegs, matchingLegs);
		}
		if(response.seasonData != null) {
			// Uncomment it for multi season data.
			setSeasonalData(response.seasonData);
		}
		
		refreshMatrixWithData();
		if(typeof rowIdx != 'undefined' && rowIdx != undefined){
			placeCursorToFieldName(rowIdx,tempGrid_Id,"ORIGIN",false);
			placeCursorToFieldName(rowIdx,tempGrid_Id,"DESTINATION",false);
		}	
		if(isDuplicateRow()){//FDX-1167 WIP: Duplicated Route Should Have 'Fade In Effect' for New Route
			isDuplicateRoute = false;
			kendo.fx(($(HASH_STRING+gridId +' tr.k-master-row').not("#tabstrip tr.k-master-row")).eq(duplicateRouteIndex)).fade("in").duration(2000).play();
			kendo.fx(($(HASH_STRING+gridId +' tr.k-master-row').not("#tabstrip tr.k-master-row")).eq(duplicateRouteIndex).next()).fade("in").duration(2000).play();
			setTimeout(function() {
				placeCursorToFieldName(duplicateRouteIndex,gridId,"MV_NUM",true);
			},2500);
		}
		if(isServiceCallAfterEdit()){
			isServiceCallOnEdit = false;
			setTimeout(function() {
				placeCursorToFieldName(currentEditIndex,gridId,currentEditCellType,true,isEditLeg);
			},500);
		}
		
	}
}

function placeCursorToFieldName(rowIdx,tempGrid_Id,fieldType,isValid,isEditLegFlag){
	if(rowIdx == undefined){
		rowIdx = currentEditIndex;
	}
	
	if(fieldType == undefined){
		fieldType = currentEditCellType;
	}
	
	if(isEditLegFlag == undefined){
		isEditLegFlag = isEditLeg;
	}
	
	setTimeout(function() {
		var grid = $(HASH_STRING+currentGridId).data("kendoGrid");
		var row;
		if(!isValid){
			row = $(HASH_STRING+currentGridId +' tr').eq(rowIdx + 1);
		}else{
			if(!isEditLegFlag){
				row = $(HASH_STRING+currentGridId +' tr.k-master-row').not("#tabstrip tr.k-master-row").eq(rowIdx);
			}else{
				row = $(HASH_STRING+currentGridId +' .k-grid-content tr').eq(rowIdx);
			}	
		}
		if(row[0] != undefined){
			var fieldValue = grid.dataItem(row)[fieldType];
			if(fieldValue == undefined || isValid){
				var fieldCell = parent.SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(grid, row, fieldType);
				fieldCell.click();
			}
		}
		rowIdx = undefined;
	},250);
}

function getModifiedRoute() {
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var gridTable = gridData.table[0];
	var tempData;
	var rteList = [];
	var legList = [];
	var tempLegList = [];
	var addedRouteList = [];
	for(var i=0,row; row=gridTable.rows[i];i++){
		if($(row).hasClass('k-master-row') && row.childNodes[1].childNodes[0].checked){
			tempData = gridData.dataItem(row);
			if (tempData.MODE=="Flight" && parent.getSelectedCase().caseType=='FNL' 
								&& tempData.ROUTE_CONTEXT_CD != ROUTE_CONTEXT_CODES.FLT_CLH) {
				if ((tempData.OPERATION_CD == parent.OPERATION_CD_MODIFY)) {
					rteList.push(tempData.toJSON());
					tempLegList = $.grep(parent.selectedWIPLegList, function(obj) {
						return obj["ROUTE_ID"] == tempData.ROUTE_ID;
					});
					$.merge(legList, tempLegList);
				} else if (tempData.OPERATION_CD == parent.OPERATION_CD_ADD) {
					addedRouteList.push(tempData);
				}
			}
		}
	}
	var ModifiedRoute =[];
	for(var i=0; i <rteList.length; i++) {
		var isDelete= false;
		var initWIPLegList = $.grep(parent.initialWIPLegList, function(obj) {
			return obj["ROUTE_ID"] == rteList[i].ROUTE_ID;
		});
		var initWIPRouteList = $.grep(parent.initialWIPRouteList, function(obj) {
			return obj["ROUTE_ID"] == rteList[i].ROUTE_ID;
		});
	
		var modifiledLegList = $.grep(legList, function(obj) {
			return obj["ROUTE_ID"] == rteList[i].ROUTE_ID;
		});
	
		for (var leg=0; leg < modifiledLegList.length; leg++) {
			 if (modifiledLegList[leg].OPERATION_CD == parent.OPERATION_CD_DELETE) {
				 ModifiedRoute.push(rteList[i]);
				 isDelete = true;
			 } 
		}
		if (!isDelete) {
			if (parent.SkdGridHelper.getSkdGridManager().isRouteDataModified(initWIPRouteList[0], rteList[i])) {
				ModifiedRoute.push(rteList[i]);
				continue;
			}
			if (parent.SkdGridHelper.getSkdGridManager().isLegDataModified(initWIPLegList, modifiledLegList)){
				ModifiedRoute.push(rteList[i]);
			}
		}
	
	}
	$.merge(ModifiedRoute,addedRouteList);
	var finalmodifiedRoute = getRouteWithoutDiscardRevision(ModifiedRoute);
	var finalcommentNotAdded = getRouteWithoutRevisionComment(finalmodifiedRoute);
	return finalcommentNotAdded;
}

function getRouteWithoutDiscardRevision(ModifiedRoute) {
	var finalmodifiedRoute =[];
	if (ModifiedRoute.length > 0)  {
		for (var i =0; i <ModifiedRoute.length; i++){
			if (ModifiedRoute[i].DISCARDREVISION != undefined  && ModifiedRoute[i].DISCARDREVISION) {
			} else {
				finalmodifiedRoute.push(ModifiedRoute[i]);
			}
		}
	}
	return finalmodifiedRoute;
}

function getRouteWithoutRevisionComment(finalmodifiedRoute) {
	finalcommentNotAdded= [];
	if (finalmodifiedRoute.length >0){
		for (var i =0; i <finalmodifiedRoute.length; i++){
			if (!getComment(finalmodifiedRoute[i].COMMENTS)) {
				finalcommentNotAdded.push(finalmodifiedRoute[i]);
			}
		}
	}
	return finalcommentNotAdded;
}

function callSaveUpdateService() {
	updateSelectedRouteNLegList();
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var gridTable = gridData.table[0];
	var tempData;
	var rteList = [];
	var legList = [];
	var tempLegList = [];
	for(var i=0,row; row=gridTable.rows[i];i++){
		//for(var i=0; i < masterRows.length;i++){
		if($(row).hasClass('k-master-row') && row.childNodes[1].childNodes[0].checked){
			tempData = gridData.dataItem(row);
			rteList.push(tempData.toJSON());
			tempLegList = $.grep(parent.selectedWIPLegList, function(obj) {
				return obj["ROUTE_ID"] == tempData.ROUTE_ID;
			});
			$.merge(legList, tempLegList);
		}
	}
	if(rteList && rteList.length > 0) {
		var timeReference = !isLocalTimeFlag() ? "Local" : "Zulu";
		parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(rteList, legList, timeReference, onSaveServiceSuccess);
	}else {
		parent.showErrorMsg("Please select route or fill all the information before saving to Schedule.");
	}
}

function onUnDeleteSaveUpdateServiceSuccess(response, io) {
	onSaveOrDeleteServiceSuccess(response, false, true);
}

function onDeleteSaveUpdateServiceSuccessWIP(response, io) {
	onSaveOrDeleteServiceSuccess(response, true);
}

function onSaveServiceSuccess(response, io) {
	onSaveOrDeleteServiceSuccess(response, false);
}

function onSaveOrDeleteServiceSuccess(response, isDelete, isUndelete) {
	parent.showProgressDialog(false);
	if(response && response._errorCd && response._errorCd > 0) {
		parent.showErrorMsg(response._errorDesc);
	} else {
		parent.onSaveServiceSuccess(response, isDelete, isUndelete, parent.selectedWIPRouteList);
		var scheduleErrWrgsMap = response.scheduleErrWrgsMap;
		var routeIds = Object.keys(scheduleErrWrgsMap);
		for(var i=0; i<routeIds.length; i++) {
			if(scheduleErrWrgsMap[routeIds[i]].success) {
				parent.selectedWIPRouteList = $.grep(parent.selectedWIPRouteList, function(obj) {
					return obj["ROUTE_ID"] != routeIds[i];
				});
				expandedRoutes = $.grep(expandedRoutes, function(obj) {
					return obj != routeIds[i];
				});
				parent.selectedWIPLegList = $.grep(parent.selectedWIPLegList, function(obj) {
					return obj["ROUTE_ID"] != routeIds[i];
				});
			}
		}
		refreshMatrixWithData();
		if (parent.selectedWIPRouteList.length == 0) {
			closeWIPWindow(null);
		}
	}
}

function setLocalZuluBtnState() {
	if(parent.$("#toggleWIPZulu")[0] != undefined) {
		if(parent.isLocalTimeFlag()) {
			parent.$("#toggleWIPZulu")[0].toggled = false;
			parent.$("#toggleWIPZulu").children(1)[0].className = "k-icon icon-toggle-local";
		}else {
			parent.$("#toggleWIPZulu")[0].toggled = true;
			parent.$("#toggleWIPZulu").children(1)[0].className = "k-icon icon-toggle-zulu";
		}
	}
}

// this is method returns wrong flag, if local time returns false
function isLocalTimeFlag() {
	return parent.$("#toggleWIPZulu")[0] != undefined ? (parent.$("#toggleWIPZulu")[0].toggled != undefined ? parent.$("#toggleWIPZulu")[0].toggled : false) : false;
}

function getLocalColumns() {
	return ["ALLOC_CAL_BUTTON_L","FULL_EFFDAY_HOLIDAY_L","CAL_BUTTON_L","LOCAL_DEP","LOCAL_ARR","ARRIVAL_DAY_L","ROUTE_NOOP_DAYS_L","ROUTE_HOL_DAYS_L","NOOP_DAYS_L","LEG_HOL_DAYS_L","B_OFFTIME_L","LANDING_TIME_L","TOTAL_FREQ_1","TOTAL_FREQ_2","TOTAL_FREQ_3","TOTAL_FREQ_4","TOTAL_FREQ_5","TOTAL_FREQ_6","TOTAL_FREQ_7","CAL_BUTTON_L","BLOCK_INDAY_L_NBR","ORIGIN_DAY_L","LEG_EFFDAYSL_DESC"];
}

function getZuluColumns() {
	return ["ALLOC_CAL_BUTTON_Z","FULL_EFFDAY_HOLIDAY_Z","CAL_BUTTON_Z","ZULU_DEP","ZULU_ARR","ARRIVAL_DAY_Z","ROUTE_NOOP_DAYS_Z","ROUTE_HOL_DAYS_Z","NOOP_DAYS_Z","LEG_HOL_DAYS_Z","B_OFFTIME_Z","LANDING_TIME_Z","TOTAL_FREQZ_1","TOTAL_FREQZ_2","TOTAL_FREQZ_3","TOTAL_FREQZ_4","TOTAL_FREQZ_5","TOTAL_FREQZ_6","TOTAL_FREQZ_7","CAL_BUTTON_Z","BLOCK_INDAY_Z_NBR","ORIGIN_DAY_Z","LEG_EFFDAYSZ_DESC"];
}

function getRouteGridColumns(grid_Id) {
	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
	var deleteRowTemplate = SkdMxREGridHelper.getCommonGridManager().getDeleteRouteRowTemplate(grid_Id, dashboardID);
	var routeRowTemplate = SkdMxREGridHelper.getCommonGridManager().getRouteRowEditor(grid_Id);
	return [{
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			title: EMPTY_STRING, 
			width: "22px", 
			attributes: {
				style:"text-align:center;"
			}, 
			template: function(data) {
				return checkboxRowTemplatehandler(data,grid_Id);
			},
			headerAttributes: {
      		  	title:"checkbox"
      	  	}
    	},{
			title : EMPTY_STRING,
			width : "30px",
			hidden: false,
			template : deleteRowTemplate,
			headerTemplate : function(data) {
      		  return deleteRouteRowtemplate(data,grid_Id,dashboardID,true);
      	  	},
			attributes : {
				style:"text-align:center;"
			}
		},{
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			title: EMPTY_STRING, 
			width: "30px", 
			attributes: {
				style:"text-align:center;"
			}, 
			template: function(data) {
				return duplicateIconRowTemplatehandler(data,grid_Id);
			}
    	},{
			field : "ROUTE_ID",
			title : " ",
			hidden : true,
			width : "10px",
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes : {
				title : "Route Id",
				style:"text-align:center;"
			}
		},{ 
			field : "MV_NUM",
			title : "Mv No*",
			width : "70px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				 style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Move Number",
      		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
      	  	}
		},{
			field : "ROUTE_BUTTON",
			title : " ",
			width : "20px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			template: routeRowTemplate,
			attributes: {
				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
			},
			headerAttributes: {
				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
			}	
		},{
			field : "FULL_EFFDAY_HOLIDAY_L",
			title : "Route Eff Days (L)*",
			hidden: isLocalTimeFlag(),
			width : "150px",
			sortable : false,
			filterable : false,
			editable:false,
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Route Effective Days (L)",
      		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
      	  	}
		},{
			field : "CAL_BUTTON_L",
			title : " ",
			width : "14px",
			hidden: isLocalTimeFlag(),
			sortable : false,
			filterable : false,
			editable:false,
			template: calenderRowTemplateL,
			attributes: {
				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
			},
			headerAttributes: {
				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
			}	
		},{
			field : "FULL_EFFDAY_HOLIDAY_Z",
			title : "Route Eff Days (Z)*",
			hidden: !isLocalTimeFlag(),
			width : "150px",
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes : {
				title : "Route Effective Days (Z)",
				style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
			}
		},{
			field : "CAL_BUTTON_Z",
			title: " ",
			hidden: !isLocalTimeFlag(),
			width: "14px",
			template: calenderRowTemplateZ,
			attributes: {
				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
			},
			headerAttributes: {
				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
			}
		},{
			field : "FULL_ROUTE_PATH",
			title : "Location",
			width : "150px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			attributes : {
				style:""
			},
			headerAttributes: {
      		  	title:"Location",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "LEG_TYPE",
			title : "Leg Type*",
			width : "40px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Leg Type",
      		  	style:"text-align:center;"
      	  	}
		},{
      	  	title: EMPTY_STRING,
      	  	template: function(data) {
      	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LegTypeRequest", "routeLegTypeTextArea", "LEG_TYPE", dashboardID);
      	  	},
      	  	width:"14px",
      	  	editable:false,
      	  	attributes: {
      	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  	},
      	  	headerAttributes: {
      	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  	}
    	},{
			field : "EQUIP_TYPE",
			title : "Equip Type*",
			width : "40px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Equipment Type",
      		  	style:"text-align:center;"
      	  	}
		},{
      	  	title: EMPTY_STRING,
      	  	template: function(data) {
      	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", dashboardID);
      	  	},
      	  	width:"14px",
      	  	editable:false,
      	  	attributes: {
      	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  	},
      	  	headerAttributes: {
      	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  	}
    	},{
			field : "CARRIER_TYPE",
			title : "Carrier*",
			width : "50px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable: true,
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Carrier Type",
      		  	style:"text-align:center;"
      	  	}
		},{
  	  		title: EMPTY_STRING,
  	  		template: function(data) {
  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "CarrierTypeRequest", "carrierTypeTextArea", "CARRIER_TYPE", dashboardID);
  	  		},
  	  		width:"14px",
  	  		editable:false,
  	  		attributes: {
  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
  	  		},
  	  		headerAttributes: {
  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
  	  		}
    	},{
  	  		title: EMPTY_STRING,
  	  		template: function(data) {
  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "ScacCodeRequest", "scacCodeTextArea", "SCAC_CD", dashboardID);
  	  		},
  	  		width:"14px",
  	  		editable:false,
  	  		hidden : true,
  	  		attributes: {
  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
  	  		},
  	  		headerAttributes: {
  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
  	  		}
    	},{
			field : "DAILYRATE_PLUSCC_CHG_AMT",
			title : "Route Daily Cost",
			width : "80px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"Route Daily Cost",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "TOTALMONTH_COST_AMT",
			title : "Monthly Route Cost",
			width : "80px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"Monthly Route Cost",
      		  	style:"text-align:center;"
      	  	}
		},
		{
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			title: "Revision Comment", 
			width: "90px", 
			attributes: {
				style:"text-align:center;"
			}, 
			template: function(data) {
				return SkdMxREGridHelper.getCommonGridManager().revisionComentButtonRowTemplatehandler(data,grid_Id);
			},
			headerAttributes: {
      		  	title:"Revision Comment",
      		  	style:"text-align:center;"
      	  	}
    	},{
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			title: "Internal Comment", 
			width: "90px", 
			attributes: {
				style:"text-align:center;"
			}, 
			template: function(data) {
				return SkdMxREGridHelper.getCommonGridManager().intenalCommentButtonRowTemplatehandler(data,grid_Id);
			},
			headerAttributes: {
      		  	title:"Internal Comment",
      		  	style:"text-align:center;"
      	  	}
    	},		
		{
			field : "ROUTE_TYPE_CD",
			title : "Route Type",
			width : "70px",
			hidden : true,
			sortable : false,
			filterable : false,
			editable: true,
			attributes : {
				style:"border-right:none !important"
			},
			headerAttributes: {
      		  	title:"Route Type",
      		  	style:"text-align:center;"
      	  	}
		},{
  	  		title: EMPTY_STRING,
  	  		template: function(data) {
  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "RouteTypeRequest", "routeTypeTextArea", "ROUTE_TYPE_CD", dashboardID);
  	  		},
  	  		width:"14px",
  	  		editable:false,
  	  		hidden : true,
  	  		attributes: {
  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
  	  		},
  	  		headerAttributes: {
  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
  	  		}
    	},{
			field : "TEMPORARY_ROUTE",
			title : "Temp Rte",
			width : "40px",
			hidden : true,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"Temporary Route",
      		  	style:"text-align:center;"
      	  	}
		},
		{
			field : "EXPIRATION_DATE",
			title : "Expiration Date",
			width : "100px",
			hidden : true,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"Expiration Date",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "IATA_MV_NBR",
			title : "IATA Mv No",
			width : "50px",
			hidden : true,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"IATA Mv No",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "BAL_MV_NBR",
			title : "Bal Mv No",
			width : "55px",
			hidden :true,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			headerAttributes: {
      		  	title:"Bal Mv No",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "USE_LEG_MINS_FLAG",
			title : "Manually Timed",
			width : "55px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:true,
			attributes : {
				style : "padding-left:4px;"
			},
			template: function(data) {
				return manTimedCheckboxRowTemplatehandler(data,grid_Id);
			},
			headerAttributes: {
      		  	title:"Manually Timed",
      		  	style:"text-align:center;"
      	  	}
		},{
			field : "SCAC_CD",
			title : "SCAC Code",
			width : "50px",
			hidden : false,
			sortable : false,
			filterable : false,
			editable:false,
			attributes : {
				style:""
			},
			headerAttributes: {
      		  	title:"SCAC Code",
      		  	style:"text-align:center;"
      	  	}
		}
    ];
}

function getRouteGridDataSource(data) {
	return new kendo.data.DataSource({
		pageSize: 500,
		data: (data != undefined) ? data : [],
		schema: {
			model: {
				id: "RouteData",
				fields: {
					ROUTE_ID: {
						type: "string",
						editable: false
					},
					MV_NUM: {
						type: "string",
						editable: true
					},
					ROUTE_BUTTON: {
						type: "string",
						editable: false
					},
					FULL_EFFDAY_HOLIDAY_L: {
						type: "string",
						editable: false
					},
					CAL_BUTTON_L: {
						type: "string",
						editable: false
					},
					FULL_EFFDAY_HOLIDAY_Z: {
						type: "string",
						editable: false
					},
					CAL_BUTTON_Z: {
						type: "string",
						editable: false
					},
					FULL_ROUTE_PATH: {
						type: "string",
						editable: false
					},
					LEG_TYPE: {
						type: "string",
						editable: true,
						validation: {
							 required: false,
							 legtype: function (input) {
								 if(input.val() == undefined || input.val() == "") {
									 input.attr("data-legtype-msg", "LegType Field is Required");
									 isRouteValidationError = true;
									 return false;
								 }
								 if (input.is("[name='LEG_TYPE']")) {
									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
									 if(!isValid){
										 input.attr("data-legtype-msg", "Please enter the valid LegType");
										 isRouteValidationError = true;
										 return false;
									 }
								}
								isRouteValidationError = false;
								return true;
								 
							 }
						 }
					},
					EQUIP_TYPE: {
						type: "string",
						editable:true,
						validation: {
							 required: false,
							 equipmenttype: function (input) {
								 if(input.val() == undefined || input.val() == "") {
									 input.attr("data-equipmenttype-msg", "EqType Field is Required");
									 isRouteValidationError = true;
									 return false;
								 }
								 if (input.is("[name='EQUIP_TYPE']")) {
									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
									 if(!isValid){
										 input.attr("data-equipmenttype-msg", "Please enter the valid equipmentType");
										 isRouteValidationError = true;
										 return false;
									 }
								}
								isRouteValidationError = false;
								return true;
								 
							 }
						}
					},
					CARRIER_TYPE: {
						type: "string",
						editable:true
					},
					SCAC_CD:{
						type: "string",
						editable:false
					},
					DAILYRATE_PLUSCC_CHG_AMT: {
						type: "string",
						editable:false
					},
					TOTALMONTH_COST_AMT: {
						type: "string",
						editable:false
					},
					TEMPORARY_ROUTE: {
						type: "string",
						editable:true
					},
					EXPIRATION_DATE: {
						type: "string",
						editable:true
					},
					ROUTE_TYPE_CD: {
						type: "string",
						editable:true
					},
					IATA_MV_NBR: {
						type: "string",
						editable:true,
						validation: {
							 required: false,
							 iataroutevalidation: function (input) {
								 if(input.val() == undefined || input.val() == "") {
									 return true;
								 }
								 if (input.is("[name='IATA_MV_NBR']")) {
									 if(!validateAlphaNumericCharacters(input.val())){
										 input.attr("data-iataroutevalidation-msg", "Please enter alpha numeric characters only");
										 return false;
									 }
								}
								return true;
								 
							 }
						 }
					},
					BAL_MV_NBR: {
						type: "string",
						editable:true
					},
					USE_LEG_MINS_FLAG: {
						type: "string",
						editable:false
					}
					
				}
			},
			parse: function (d) {
				$.each(d, function (idx, dataItem) {	
					parseCostData(dataItem);
				});
				return d;
			}
		}
	});
}

function duplicateIconRowTemplatehandler(model,grid_Id) {
	if(model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
		return "<img src ='"+ICON_IMAGE_PATH_DUPLICATE+"' />";
	}
    if(model.IS_DUPLICATE == 1){
        return "<img title='Original Route' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_DUPLICATE_FROM+"' onclick=duplicateRowHandler(this,'" + grid_Id + "') />";
    }else if(model.IS_DUPLICATE == 2){
        return "<img title='Cloned Route' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_DUPLICATE_TO+"' onclick=duplicateRowHandler(this,'" + grid_Id + "') />";
    }else {
        return "<img title='Duplicate Route' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_DUPLICATE+"' onclick=duplicateRowHandler(this,'" + grid_Id + "') />";
    }
}

function duplicateRowHandler(image,grid_id) {
	//parent.showProgressDialog(true, "Duplicating the route...");
	updateSelectedRouteNLegList();
	var legList = [];
	isDuplicateRoute = true; 
	var currentTR = $(image).closest("tr");
	var grid = $(HASH_STRING+grid_id).data("kendoGrid");
	var data = grid.dataItem(currentTR);
	var routeList = getCloneObject([data.toJSON()]);
	duplicateRouteIndex = getRowIndex(grid.dataSource,data) + 1;
	tempLegList = $.grep(parent.selectedWIPLegList, function(obj) {
		return obj["ROUTE_ID"] == routeList[0].ROUTE_ID;
	});
	expandedRoutes.push(routeList[0]["ROUTE_ID"]);
	
	routeList[0]["ROUTE_ID"]="";
	routeList[0]["OPERATION_CD"] = "Insert";
	if (routeList[0]["DSTPARENT_ROUTE_ID"] != null) {
		routeList[0]["DSTPARENT_ROUTE_ID"]="";
	}
	routeList[0]["SCHEDULE_ID"] = "";
	setEmptyRevisionCommentForRoute(routeList[0]);
	$.merge(legList, CloneLegObject(getCloneObject(tempLegList)));
	setAllocationIDEmpty(legList);
	var isRouteEditor = gridId == "routeMatrixGrid" ? true : false;
	parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeList[0], legList, onDefaultsServiceSuccess, !isLocalTimeFlag(), isRouteEditor, undefined,true);
	
}
function setAllocationIDEmpty(legList) {
	for (var i=0; i < legList.length;i++) {
		var legItem = legList[i] ;
		if (legItem.ALLOCS != null && legItem.ALLOCS.length >0) {
			var allocations = legItem.ALLOCS;
			for (var j =0; j < allocations.length ; j++) {
				allocations[j]["ALLOC_ID"] = "";
				allocations[j]["OPERATION_CD"]="Insert";
				allocations[j]["LEG_ID"]="";
				if (allocations[j]["LOC_ALLOCATION"] != null && allocations[j]["LOC_ALLOCATION"] == true) {
					var locationAllocations = allocations[j]["LOC_ALLOCS"];
					for (var k = 0; k <locationAllocations.length; k++) {
						locationAllocations[k]["ALLOC_ID"] = "";
						locationAllocations[k]["OPERATION_CD"]="Insert";
						locationAllocations[k]["LEG_ID"]="";
						locationAllocations[k]["LOC_ALLOC_ID"] = "";
						locationAllocations[k]["ROUTE_ID"] ="";
					}
				}
			}
		}
	}
}

function setEmptyRevisionCommentForRoute(route) {
	var commentString = route.COMMENTS;
	var comments ="";
	if (commentString != "" && commentString != null) {
		comments = $.parseJSON(commentString);
		for (var i =0; i <comments.length; i++) {
			comments[i]["operationCd"].type = 1;
			comments[i]["routeId"]="";
			comments[i]["routeCommentId"] = "";
		}
		route.COMMENTS = JSON.stringify(comments, replacer);
	}
		
}

function handleNewRoute() {
	var mxMode = parent.scheduleMxMode;
	if (mxMode == "CREATE") {
		if(parent.selectedWIPRouteList == undefined)
			parent.selectedWIPRouteList = [];
		if(parent.selectedWIPLegList == undefined)
			parent.selectedWIPLegList = [];
		var menu = parent.scheduleMaintenananceSeletedMenu;
		var route = null;
		var leg =  null;
		if(menu == "FT") {
			route = [getRouteObj("Flight", "Standard", "Flt Trunk", undefined, "Flt Trunk")];
			leg = [getLegObj("Flight", "Standard", "Flt Trunk", "Flt Trunk")];
		}else if(menu == "FF") {
			route = [getRouteObj("Flight", "Standard", "Flt Feeder", undefined, "Flt Feeder")];
			leg = [getLegObj("Flight", "Standard", "Flt Feeder", "Flt Feeder")];
		}else if(menu == "FC") {
			route = [getRouteObj("Flight", "Standard", "Flt Feeder", "Linehaul", "Flt CLH")];
			leg = [getLegObj("Flight", "Standard", "Flt Feeder", "Flt CLH", "Linehaul")];
		}else if(menu == "TS") {
			route = [getRouteObj("Truck", "Standard", "Truck", "Linehaul", "Trk Std LH")];
			leg = [getLegObj("Truck", "Standard", "Truck", "Trk Std LH", "Linehaul")];
		}else if(menu == "TSS") {
			route = [getRouteObj("Truck", "Standard", "Truck", "Shuttle", "Trk Std SH")];
			leg = [getLegObj("Truck", "Standard", "Truck", "Trk Std SH", "Shuttle")];
		}else if(menu == "TSG") {
			route = [getRouteObj("Truck", "Standard", "Truck", "Shuttle", "Trk Std GNP")];
			leg = [getLegObj("Truck", "Standard", "Truck", "Trk Std GNP", "Shuttle")];
		}else if(menu == "TO") {
			route = [getRouteObj("Truck", "Oversized", "Truck", undefined, "Trk Ovr Z GBT")];
			leg = [getLegObj("Truck", "Oversized", "Truck", "Trk Ovr Z GBT")];
		}
		parent.SkdMxServiceHelper.getDefaultServiceManager().callDefautValuesService(route, leg,onDefaultsServiceSuccess);		
	}
}
function getRouteNo(event) {
	try {
		if(changeRoutObject != null) {
			var routeGrid = $("#"+gridId).data("kendoGrid");
			var routeRow = $(changeRoutObject.parentDiv.data("btnObj")).closest("tr");
			routeGrid.expandRow(routeRow);
			routeGrid.dataItem(routeRow).MV_NUM = changeRoutObject.value;
			var legGrid = routeRow.next().find("div.k-legs-grid").data("kendoGrid");
			if(legGrid == undefined){
				legGrid = $("#"+routeRow.parent().parent().parent().parent()[0].id).data("kendoGrid");
				legGrid.dataItem(routeRow).MV_NUM = changeRoutObject.value;
			}else{
				for (var i = 0; i< legGrid.dataItems().length;i++) {
					legGrid.dataItems()[i].MV_NUM = changeRoutObject.value;
				}
				
			}
			parent.SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, "MV_NUM").text(changeRoutObject.value);
			$(changeRoutObject.parentDiv).data("kendoWindow").close();
			updateSelectedRouteNLegList();
		}
	}catch (e) {
		console.log("Error while updating the route");
	}
	enableDisableSaveBtns();
}

function getCloneObject(cloneobject) {
	var newObject = jQuery.extend(true, [{}], cloneobject);
	return newObject;
}

function CloneLegObject(legData,routeId) {
	  if (legData != undefined) {
          for (var i = 0; i < legData.length; i++) {
              legData[i]["LEG_ID"] = "";
              legData[i]["legId"] = i + 1;
              legData[i]["ROUTE_ID"] = "";
              legData[i]["OPERATION_CD"] = "Insert";
              legData[i]["SCHEDULE_ID"] = "";
          }
      }
	  return legData;
}