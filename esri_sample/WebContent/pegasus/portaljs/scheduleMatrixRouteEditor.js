/**
 * @author Honey Bansal
 */

var changeRoutObject;
function refresh() {
	initializeRouteEditor();
}

function initializeRouteEditor() {
	menu = parent.scheduleMaintenananceSeletedMenu;
	mxMode = parent.scheduleMxMode;
	if(!isInitialized){
		gridId = "routeMatrixGrid";
		dashboardID = parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR;
		parent.VIEWER.addButtonsBar(parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR, $("#headerButtonsBar"));
		isInitialized = true;
		initializeKendoWinodw();
		initalizeFlightRouteData(getDataSourceData("FlightRoutes"));
		enableDisableSaveBtns(false);
	}else{
		destroyGrid(gridId);
	}
	initDataSources();
	initRouteGrid(gridId);
	showHideDeleteBtn();
}

function initRouteGrid(grid_Id) {
	var grid = $(HASH_STRING + grid_Id).kendoGrid({
		scrollable: true,
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		navigatable: true,
		detailInit: detailInit,
		dataSource: SkdMxREGridHelper.getRouteGridManager().getRouteGridDataSource(parent.selectedRouteList != undefined ? parent.selectedRouteList : [], parent.isDelete, menu),
		columns: SkdMxREGridHelper.getRouteGridManager().getRouteGridColumns(grid_Id,dashboardID),
		detailTemplate: kendo.template($("#legsGrid").html()),
		editable: {
            confirmation: false
        },
		dataBound: function() {
			this.expandRow(this.tbody.find("tr.k-master-row"));
		},
		edit: function(e) {
			displayValidationForLastTwRow(e);
			var input = e.container.find("input.k-input");
			if(input.attr("data-text-field") == "EXPIRATION_DATE" && !e.container.closest('tr').find('input.k-temp-route').prop("checked")){
				this.closeCell();
			}
			routeGridEditHandler(e);
		}
	});
	refreshMatrixWithData();
	addMouseOverEventToGrid(grid_Id);
}

function addLegsGrid(detailRow, e) {
	var gridDiv = detailRow.find("div.k-legs-grid");
	var ramdomId = "legsGrid_" + (LEGS_GRID_ID++);
	
	var legsGridData = $.grep(parent.selectedLegList, function(item) {
		return (item.ROUTE_ID == e.data.ROUTE_ID && e.data.ROUTE_ID != "");
	});
	if(legsGridData == null || legsGridData.length == 0) {
		legsGridData = [getLegObj()];
	}
	
	gridDiv.attr("id", ramdomId);
	gridDiv.kendoGrid({
		scrollable: true,
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		editable: true,
		navigatable: true,
		columns: SkdMxREGridHelper.getLegsGridManager().getLegsGridColumns(ramdomId,dashboardID, parent.isDelete, menu),
		dataSource: SkdMxREGridHelper.getLegsGridManager().getLegsGridDataSource(legsGridData, parent.isDelete, menu),
		editable: {
            confirmation: false
        },
        edit: function(e) {
        	displayValidationForLastTwRow(e);
        	legGridEditHandler(e);
		}
	});
}

function addSeasonsGrid(detailRow, e) {
	var gridDiv = detailRow.find("div.k-seasons-grid");
	var ramdomId = "seasonsGrid_" + LEGS_GRID_ID;
	var seasonGridData = $.grep(parent.selectedSeasonLegList, function(item) {
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
	if(parent.selectedRouteList && parent.selectedRouteList.length > 0) {
		$('#'+gridId).data("kendoGrid").dataSource.data($('#'+gridId).data("kendoGrid").dataSource.options.schema.parse(parent.selectedRouteList));
	}
	initializeValidation();
	parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
}

function closeRouteWindow() {
	parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
}

function showHideDeleteBtn() {
	if(parent.isDelete == false) {
		parent.$("#deleteRoute").hide();
	} else {
		parent.$("#deleteRoute").show();
	}
}

function deleteRoute(btn) {
	callSaveUpdateService();
}

function initDataSources(){
	if (mxMode == "CREATE") {
		parent.selectedRouteList = [];
		parent.selectedLegList = [];
		if(!parent.isMoveToREFromMap()){
			handleDefautValuesService();
		}
		
	}else if(mxMode == "addPreviousLeg" || mxMode == "addNextLeg") {
		parent.SkdMxServiceHelper.getDefaultServiceManager().callDefautValuesService(parent.selectedRouteList, parent.selectedLegList,onDefaultsServiceSuccess);
	}
}

function handleDefautValuesService() {
	//if (mxMode == "CREATE") {
		var route, leg;
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
	//}
}

function getRouteNo(event) {
	try {
		if(changeRoutObject != null) {
			var routeGrid = $("#"+gridId).data("kendoGrid");
			var routeRow = $(changeRoutObject.parentDiv.data("btnObj")).closest("tr");
			routeGrid.dataItem(routeRow).MV_NUM = changeRoutObject.value;
			var legGrid = routeRow.next().find("div.k-legs-grid").data("kendoGrid");
			if(legGrid == undefined){
				legGrid = $("#"+routeRow.parent().parent().parent().parent()[0].id).data("kendoGrid");
				legGrid.dataItem(routeRow).MV_NUM = changeRoutObject.value;
			}else{
				var legRow = legGrid.tbody.find("tr").eq(0);
				legGrid.dataItem(legRow).MV_NUM = changeRoutObject.value;
			}
			parent.SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, "MV_NUM").text(changeRoutObject.value);
			$(changeRoutObject.parentDiv).data("kendoWindow").close();
		}
	}catch (e) {
		console.log("Error while updating the route");
	}
	 enableDisableSaveBtns();
}


//call this method every time if any change made in legs grid
function updateSelectedRouteNLegList() {
	var legsGirds =  $("#"+gridId).find("div.k-legs-grid");
	parent.selectedRouteList = [];
	parent.selectedLegList = [];
	try {
		parent.selectedRouteList = $("#"+gridId).data("kendoGrid").dataSource.data().toJSON();
		for(var i=0; i<legsGirds.length; i++) {
			$.merge(parent.selectedLegList, $(legsGirds[i]).data("kendoGrid").dataSource.data().toJSON());
		}
		bindAllocationsToLegsData(parent.selectedRouteList,parent.selectedLegList);
		// Updating the Mv Nums to all legs.
		 for(var i=0; i<parent.selectedLegList.length; i++) {
			 parent.selectedLegList[i]['MV_NUM'] = parent.selectedRouteList[0]['MV_NUM'];
		 }	
	}catch (e) {
		console.log("Error while updating the leg list");
	}
}

function callSaveUpdateService() {
	updateSelectedRouteNLegList();
	var timeReference = !isLocalTimeFlag() ? "Local" : "Zulu";
	 
	if (parent.isDelete) {
		for(var i=0; i<parent.selectedRouteList.length; i++) {
			 parent.selectedRouteList[i]['OPERATION_CD'] = parent.OPERATION_CD_DELETE;	 
		 }
		 for(var i=0; i<parent.selectedLegList.length; i++) {
			 parent.selectedLegList[i]['OPERATION_CD'] = parent.OPERATION_CD_DELETE;
		 }		
	}

	parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(parent.selectedRouteList, parent.selectedLegList, timeReference, onSaveServiceSuccess);
}

function onSaveServiceSuccess(response, io) {
	parent.showProgressDialog(false);
	if(response && response._errorCd && response._errorCd > 0) {
		parent.showErrorMsg(response._errorDesc);
	} else {
		parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
		parent.onSaveServiceSuccess(response, parent.isDelete);
	}
}

function dateTimeEditor(container, options) {
    console.log("options", options);
    $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
    .appendTo(container)
    .kendoDateTimePicker({});
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
		var rteData = $.parseJSON(response.rteData);
		var legData = $.parseJSON(response.legData);
		var matchingLegs = [];
		var nonMachingLegs = [];
		var isFound = false;
		for(var i=0; i<rteData.length; i++) {
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
			for(var j=0; j<parent.selectedRouteList.length; j++) {
				if(parent.selectedRouteList[j]["ROUTE_ID"] == rteData[i]["ROUTE_ID"] || parent.selectedRouteList[j]["ROUTE_ID"] == "") {
					rteData[i]["MENU"] = parent.selectedRouteList[j]["MENU"];
					parent.selectedRouteList[j] = rteData[i];
					isFound = true;
					break;
				}
			}
			if(isFound == false) {
				$.merge(parent.selectedRouteList, [rteData[i]]);
			}
			nonMachingLegs = $.grep(parent.selectedLegList, function(obj) {
				return (obj["ROUTE_ID"] != rteData[i]["ROUTE_ID"] && obj["ROUTE_ID"] != "");
			});
			//adding one allocation to show on UI
			appendAllocation(matchingLegs);
			parent.selectedLegList = $.merge(nonMachingLegs, matchingLegs);
		}
		setDefaultServiceRouteType(parent.selectedRouteList);
		if(response.seasonData != null) {
		// Uncomment it for multi season data.
			setSeasonalData(response.seasonData);
		}
		refreshMatrixWithData();
	}
}

function setDefaultServiceRouteType(selectedRouteList) {
	if (menu=='TS' || menu=='TSS') {
		for(var i=0; i<selectedRouteList.length; i++) {
			if (selectedRouteList[i]['MV_NUM'] == EMPTY_STRING || selectedRouteList[i]['MV_NUM'] == null) {
				if (selectedRouteList[i]['ROUTE_TYPE_CD']== "Linehaul" || selectedRouteList[i]['ROUTE_TYPE_CD']== "LineHaul") {
					selectedRouteList[i]['MV_NUM'] ='aa';
				} else if (selectedRouteList[i]['ROUTE_TYPE_CD'] == "Shuttle"){
					selectedRouteList[i]['MV_NUM'] ='aaa';
				}
			}
		}
	} else if (menu=='TSG' || menu=='TO') {
		for(var i=0; i<selectedRouteList.length; i++) {
			if (selectedRouteList[i]['MV_NUM'] == EMPTY_STRING || selectedRouteList[i]['MV_NUM'] == null) {
				if (selectedRouteList[i]['CARRIER_TYPE']== "FedEx") {
					selectedRouteList[i]['MV_NUM'] ='aa';
				} else if (selectedRouteList[i]['CARRIER_TYPE']== "Contract") {
					selectedRouteList[i]['MV_NUM'] ='ax';
				} else  {
					selectedRouteList[i]['MV_NUM'] ='';
				}
			}
		}
	}
}

function setSeasonalData(seasons) {
	var seasonObj = $.parseJSON(seasons);
	var rteData = $.parseJSON(seasonObj.rteData);
	var legData = $.parseJSON(seasonObj.legData);
	var nonMachingLegs = parent.selectedSeasonLegList;
	for(var i=0; i<rteData.length; i++) {
		nonMachingLegs = $.grep(nonMachingLegs, function(obj) {
			return (obj["ROUTE_ID"] != rteData[i]["ROUTE_ID"] && obj["ROUTE_ID"] != "");
		});
	}
	parent.selectedSeasonLegList = $.merge(nonMachingLegs,legData);
}

function getCheckedData(gridId, isRouteEditorOpen) {
	updateSelectedRouteNLegList();
	var gridData = $("#routeMatrixGrid").data("kendoGrid");
	var gridTable = gridData.table[0];
	var gridRouteSelectedRows = [];
	var gridLegSelectedRowsData = parent.selectedLegList != undefined ? parent.selectedLegList : [];
	var gridSeasonSelectedRowsData = [];
	for(var i=0,row; row=gridTable.rows[i];i++){
		if (!$(row).hasClass('k-detail-row')) {
/*				var legsGrid = $(row).next().find("div.k-legs-grid").data("kendoGrid");
				var legsData = legsGrid.dataSource.data().toJSON();
				$.merge(gridLegSelectedRowsData,legsData);*/
				if($(row).next().find("div.k-seasons-grid") && $(row).next().find("div.k-seasons-grid").data("kendoGrid")) {
					$.merge(gridSeasonSelectedRowsData, $(row).next().find("div.k-seasons-grid").data("kendoGrid").dataSource.data().toJSON());
				}
		}
	}
	var masterRows = gridData.tbody.find("tr.k-master-row");
	for(var i=0; i < masterRows.length;i++){
		if(gridData.dataSource.data()[i] != undefined){
			tempData = gridData.dataSource.data()[i].toJSON();
			tempData["MENU"] = menu;
			gridRouteSelectedRows.push(tempData);
		}
	}
	
	var finalSelectLegList=[];
	var finalSelectRouteList =[];
	var finalSelectSeasonList =[];
	var FilteredWIPRouteList = parent.selectedWIPRouteList;
	var FilteredWIPLegList = parent.selectedWIPLegList;
	var FilteredWIPSeasonList = parent.selectedWIPSeasonLegList;
	if (FilteredWIPRouteList != null && FilteredWIPRouteList.length >0) {
		for (var i=0; i<gridRouteSelectedRows.length; i++) {
			var routeId = gridRouteSelectedRows[i].ROUTE_ID;
			FilteredWIPRouteList = $.grep(FilteredWIPRouteList, function(obj) {
				return obj["ROUTE_ID"] != routeId;
		 	});
			FilteredWIPLegList = $.grep(FilteredWIPLegList, function(obj) {
				return obj["ROUTE_ID"] != routeId;
			});
			FilteredWIPSeasonList = $.grep(FilteredWIPSeasonList, function(obj) {
				return obj["ROUTE_ID"] != routeId;
			});
			var FilteredUpdatedLegList = $.grep(gridLegSelectedRowsData, function(obj) {
				return obj["ROUTE_ID"] == routeId;
			});
			var FilteredUpdatedSeasonList = $.grep(gridSeasonSelectedRowsData, function(obj) {
				return obj["ROUTE_ID"] == routeId;
			});
			
			var object = [];
			object.push(gridRouteSelectedRows[i]);
			$.merge(finalSelectRouteList,object);
			$.merge(finalSelectLegList,FilteredUpdatedLegList);
			$.merge(finalSelectSeasonList,FilteredUpdatedSeasonList);
		}
		$.merge(finalSelectRouteList,FilteredWIPRouteList);
		$.merge(finalSelectLegList,FilteredWIPLegList);
		$.merge(finalSelectSeasonList,FilteredWIPSeasonList);
 	} else {
 		finalSelectRouteList = gridRouteSelectedRows;
 		finalSelectLegList = gridLegSelectedRowsData;
 		finalSelectSeasonList = gridSeasonSelectedRowsData;
 	}
	if (finalSelectRouteList.length > 0) {
		parent.dashboardController.openDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
		parent.selectedWIPRouteList = finalSelectRouteList;
		parent.selectedWIPLegList = finalSelectLegList;
		parent.selectedWIPSeasonLegList = finalSelectSeasonList;
		var dashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
		if(dashboard != undefined && dashboard.hasOwnProperty("refreshMatrixWithData")){
			dashboard.refreshMatrixWithData();
		}
	}
	parent.selectedLegList = [];
	parent.selectedRouteList = [];
	$('#'+gridId).data("kendoGrid").dataSource.data(parent.selectedRouteList);
	if (isRouteEditorOpen) {
		parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
	}
	
	parent.resetSkdMxDrawer([]);
	setInitialRouteData(finalSelectRouteList);
}

function setInitialRouteData(finalSelectRouteList)  {
	var filteredInitialRouteList = [];
	var filteredInitialLegList = [];
	//var filteredInitialWIPRouteList = [];
	//var filteredInitialWIPLegList = [];
	if (finalSelectRouteList != null && finalSelectRouteList.length> 0) {
		for(var i =0; i < finalSelectRouteList.length; i++) {
			 for ( var j=0; j < parent.initialRouteList.length; j++) {
				  if (parent.initialRouteList[j]["ROUTE_ID"] == finalSelectRouteList[i]["ROUTE_ID"]) {
					  var object = [];
					  object.push(parent.initialRouteList[j]);
					 $.merge(filteredInitialRouteList,object);
					 initialLegList = $.grep(parent.initialLegList, function(obj) {
							return obj["ROUTE_ID"] == finalSelectRouteList[i]["ROUTE_ID"];
					 });
					 $.merge(filteredInitialLegList,initialLegList);
				  }
			 }
		}
	}
	if (filteredInitialRouteList != null && filteredInitialRouteList.length>0) {
		for(var i =0; i < filteredInitialRouteList.length; i++) {
			FilteredWIPInitialRouteList = $.grep(parent.initialWIPRouteList, function(obj) {
				return obj["ROUTE_ID"] != filteredInitialRouteList[i]["ROUTE_ID"];
			});
			FilteredWIPInitialLegList = $.grep(parent.initialWIPLegList, function(obj) {
				return obj["ROUTE_ID"] != filteredInitialRouteList[i]["ROUTE_ID"];
			});
			parent.initialWIPRouteList = FilteredWIPInitialRouteList;
			parent.initialWIPLegList = FilteredWIPInitialLegList;
		}
		 $.merge(parent.initialWIPRouteList,filteredInitialRouteList);
		 $.merge(parent.initialWIPLegList,filteredInitialLegList);
	}
}

//this is method returns wrong flag, if local time returns false
function isLocalTimeFlag() {
	return parent.$("#toggleREZulu")[0] != undefined ? (parent.$("#toggleREZulu")[0].toggled != undefined ? parent.$("#toggleREZulu")[0].toggled : false) : false;
}

function getLocalColumns() {
	return ["FULL_EFFDAY_HOLIDAY_L","CAL_BUTTON_L","LOCAL_DEP","LOCAL_ARR","ARRIVAL_DAY_L","BLOCK_INDAY_L_NBR","LEG_EFFDAYSL_DESC"];
}

function getZuluColumns() {
	return ["FULL_EFFDAY_HOLIDAY_Z","CAL_BUTTON_Z","ZULU_DEP","ZULU_ARR","ARRIVAL_DAY_Z","BLOCK_INDAY_Z_NBR","LEG_EFFDAYSZ_DESC"];
}
