/**
* @author 888600 Abhishek Sharma
* This script belongs to Network Matrix Dashboard.
* Included in networkMatrix.jsp
*/

//Progress message in Network Matrix
var PROGRESS_DIALOG_MESSAGE_NETWORK_MATRIX = "Loading full network matrix...";
// Calendar row template for Local & Zulu
var	calenderRowTemplateL="#= calenderRowEditor(data,'networkMatrixTreeGrid','L') #";
var	calenderRowTemplateZ="#= calenderRowEditor(data,'networkMatrixTreeGrid','Z') #";

var commonMatrixConstants = {
		   // Array for All Local columns
		LOCAL_COLUMNS : ["NOOP_DAYS_L","AVAIL_TIME_L","ORIGIN_DAY_L","LOCAL_NIGHTS_CROSSED","ARRIVAL_DAY_L","DUE_TIME_L","CAL_BUTTON_L","KEYWORD_EFFDT_L","EFFDAYSL"],
		   //Array for All Zulu columns
		ZULU_COLUMNS : ["NOOP_DAYS_Z","AVAIL_TIME_Z","ORIGIN_DAY_Z","ZULU_NIGHTS_CROSSED","ARRIVAL_DAY_Z","DUE_TIME_Z","CAL_BUTTON_Z" ,"KEYWORD_EFFDT_Z","EFFDAYSZ"],
		   //Array for Week Local columns
		WEEK_COLUMNS_L : ["EFFWEEKSL_W5"],
		   //Array for Week Zulu columns
		WEEK_COLUMNS_Z : ["EFFWEEKSZ_W5"],
		   //Day column
		DAY_COLUMN : "DAY",
		volColLabelMap:{},
		timeColLabelMap:{}
};

//Favorite component
var favoriteComponent;
var networkMatrixTreeGridConstants = {
		EFF_LOCAL_COLUMNS:["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7","EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"],
		EFF_ZULU_COLUMNS : ["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7","EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"],
		   //Network ID column
		ID_COLUMN : "LANE_ID",
		gridConfig: '<grid headerClicked="itemheaderClickedHandler"  ' +
			'itemClick="itemClickHandler"  ' +
			'filterPageSortChange = "filterPageSortChangeHandler"  ' +
			'horizontalScrollPolicy="auto" ' + //Enables the horizontal scroll policy
		    /*'enableExport="true" ' +*/ // This Enables the export operation in the toolbar
		    'forcePagerRow="true" ' +
		    'enablePaging="true" pageSize="1000" '+
		/*Flag to force appearance of the pager row even with enablePaging=false. 
																		  Use this flag to show the pager control even if the enablePaging is set to false. 
																		  This is used in a scenario where you wish to show buttons other than the paging buttons in the pager bar*/
		    'enableFilters="true" ' + // This Enables the inline filters
		    'enableFooters="true" ' + // This Enables the footers.
		    'variableHeaderHeight="true" ' + // This Enables the variable header heights.			
		    'footerDrawTopBorder="true" ' + // ??
		    'enableMultiColumnSort="true" ' + // This enables the multi sorting of columns
		    'useCompactPreferences="true" ' + ' ' + /*'selectionMode="singleCells" '+*/
		    /*'enableSplitHeader="false" '+*/
		    'borderColor="0x9f9f9f" '+		        
		    'disclosureOpenIcon="custom/collapse.png" disclosureClosedIcon="custom/expand.png" '+
		    'enableDynamicLevels="true" ' +
		    'autoLoadPreferences="false" '+
		    'enableMultiplePreferences="true" '+
		    'showSpinnerOnFilterPageSort="true" '+
		    'enableEagerDraw="true" '+		    
		    'enableSelectionBubble="true" '+	
			'enableSelectionCascade="true" '
					/*'selectedKeyField="LEG_TYPE" '+	*/
		    
};
var isLaneLevelGroupingInitilized = false;
var isFullRoutingGroupingInitilized = false;
var gridConfigStr;
/*var LOCAL_TOTAL_FREQ = null;
var ZULU_TOTAL_FREQ = null;
*/
	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["AVAIL_TIME_L"] = ["Avail Time"];
	commonMatrixConstants.timeColLabelMap["DUE_TIME_L"] = ["Due Time"];
	commonMatrixConstants.timeColLabelMap["ORIGIN_DAY_L"] = ["Orig Day"];
	commonMatrixConstants.timeColLabelMap["LOCAL_NIGHTS_CROSSED"] = ["Mids Crossed"];
	commonMatrixConstants.timeColLabelMap["ARRIVAL_DAY_L"] = ["Arriv Day"];
	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["AVAIL_TIME_Z"] = ["Avail Time"];
	commonMatrixConstants.timeColLabelMap["DUE_TIME_Z"] = ["Due Time"];
	commonMatrixConstants.timeColLabelMap["ORIGIN_DAY_Z"] = ["Orig Day"];
	commonMatrixConstants.timeColLabelMap["ZULU_NIGHTS_CROSSED"] = ["Mids Crossed"];
	commonMatrixConstants.timeColLabelMap["ARRIVAL_DAY_Z"] = ["Arriv Day"];
	

	commonMatrixConstants.volColLabelMap["TOTAL_WEIGHT"] = ["Ttl Wt"];
	commonMatrixConstants.volColLabelMap["TOTAL_PIECES"] = ["Ttl Pcs"];
	commonMatrixConstants.volColLabelMap["TOTAL_CUBE"] = ["Ttl Cu"];

/******* common methods - start *******/

/**
* Called when Plan is changed
* To hide/unhide matrix columns based on the selected plan.
*/
function onPlanChange() {
	// hide/unhide columns based on week plan.
	updateEffectiveSettingsClick("All_Local_Columns");
	updateEffectiveSettingsClick("All_Zulu_Columns");
}

function onTabSelect(tabName) {
}

/**
* Called before Network Query executed
* To clear the network matrix out.
*/
function onBeforeRunQuery() {
	clear(false, false);	
}
/**
* Called on Network Query success
* To refresh network matrix.
*/
function onNetworkQuerySuccess() {
	refreshMatrix();	
}

function onNetworkScheduleQuerySuccess() {
}

function onScheduleQuerySuccess() {
}

/**
* Called on Network Matrix refresh
* To refresh network matrix.
*/
function refresh() {
	if(parent.needToLoadData(parent.DASHBOARD_ID_NETWORK_MATRIX)) {
		refreshMatrix();
	}
}

/**
* Called on day component click
* To open the network matrix day control.
* @param btn - day button instance 
*/
function openDayControl(btn) {
	parent.VIEWER.openDayControl(btn, parent.DASHBOARD_ID_NETWORK_MATRIX, parent.DATA_TYPE_NETWORK);
}

/******* common methods - end *******/

/******* common methods - favorites - start *******/

function getHeaderButtonSettings() {
 	var headerButtonSettings = {}; 
	/*if(parent.$('#btnNetworkMatrixSyncMap')[0].isHighlighted != null){
		headerButtonSettings["NetworkMatrixSyncMapClass"] = parent.$('#btnNetworkMatrixSyncMap')[0].isHighlighted;
	}else{
	    headerButtonSettings["NetworkMatrixSyncMapClass"]  = false;
	}
	if(parent.$('#btnNetworkMatrixSyncSchematic')[0].isHighlighted != null){
		headerButtonSettings["NetworkMatrixSyncSchematicClass"] = parent.$('#btnNetworkMatrixSyncSchematic')[0].isHighlighted;
	}else{
	    headerButtonSettings["NetworkMatrixSyncSchematicClass"]  = false;
	}*/
    return headerButtonSettings;  
}

/**
* Network Display option setting
* get network matrix display option favorites setting.
*/
function getDisplayOptionSettings() {
	return getColumnsSettings(getMatrixFavId()[0]);
}

/**
* Network Contents setting
* get network matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings(getMatrixFavId()[0]);
}
function applyHeaderButtonSettings(headerButtonSettings) {
	if(headerButtonSettings != null){/*
		parent.highlightBtn(parent.$('#btnNetworkMatrixSyncMap')[0],!headerButtonSettings["NetworkMatrixSyncMapClass"]);
		parent.enableSync(parent.$('#btnNetworkMatrixSyncMap')[0],parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
		parent.highlightBtn(parent.$('#btnNetworkMatrixSyncSchematic')[0],!headerButtonSettings["NetworkMatrixSyncSchematicClass"]);
		parent.enableSync(parent.$('#btnNetworkMatrixSyncSchematic')[0],parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
	*/} 
}

/**
* Network Display option setting
* apply network matrix display option favorites setting.
*/
var favDisplayOptionSettings = null;
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
//	setColumnsSettings(displayOptionSettings,getMatrixFavId()[0]);
	favDisplayOptionSettings = displayOptionSettings;
}

/**
* Network Content setting
* apply network matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings(getMatrixFavId()[0],contentSettings);
}
/******* common methods - favorites - end *******/
function createOrInitalizeGrids(){
	if(parent.VIEWER.getIsFullRouting() == true){
		$( "#outboundGrid" ).hide();	
		$( "#inboundGrid" ).hide();	
	}
   gridConfigStr = networkMatrixTreeGridConstants.gridConfig + (parent.VIEWER.getIsFullRouting()? 'enableDrillDown="true" enableDefaultDisclosureIcon="false" ' :' enableDefaultDisclosureIcon="true" ')
   		+'preferencePersistenceKey="'+getMatrixFavId()[0]+'" ></grid>';
	initializeDisplayOptions(true);
	$("#"+getContainerId()[0]).empty();
	new AdvancedDataGrid(getContainerId()[0], {
		configuration: gridConfigStr,
		id: getContainerId()[0],
		dataProvider: [],
		isCellCustomBackgroundDrawFunctionDefault: false,
		isCreationCompleteDefault: true,
		itemLoadHandler: itemLoadHandler
	}, getMatrixColumns(favColumns), updateResponseHandler);	
	if(parent.VIEWER.getIsFullRouting() == true){
		$("#"+getContainerId()[1]).empty();
		gridConfigStr = networkMatrixTreeGridConstants.gridConfig + (parent.VIEWER.getIsFullRouting()? 'enableDrillDown="true" enableDefaultDisclosureIcon="false" ' :' enableDefaultDisclosureIcon="true" ')
   		+'preferencePersistenceKey="'+getMatrixFavId()[1]+'" ></grid>';
		new AdvancedDataGrid(getContainerId()[1], {
			configuration: gridConfigStr,
			id: getContainerId()[1],
			dataProvider: [],
			isCellCustomBackgroundDrawFunctionDefault: false,
			isCreationCompleteDefault: true,
			itemLoadHandler: itemLoadHandler  
		}, getMatrixColumns(favColumns), updateResponseHandler);
	}
}
/**
* Network Initialize method
* Method to use for initialization of Network Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	
	setMatrixFavoriteSettings(favoriteSettings);
	setMatrixID(getContainerId());
	if(flag == undefined) {
//		setMatrixID("networkMatrixTreeGrid");
        setDashboardID(parent.DASHBOARD_ID_NETWORK_MATRIX);
		isClearOn = false;
		addButtonsBar();
		initializeDisplayOptions();
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_NETWORK_MATRIX, "networkMatrixFavoritesMenu","Network - Detail");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
	}
	
	var matrixURL = getMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
//	showProgressDialog(true, "Please wait...");
	parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), false);
	createOrInitalizeGrids();
	
	refresh();
	if(flag == undefined) {
//		$( "#networkMatrixTabs" ).tabs();
//		initializeDisplayOptions();
		showHideDisplayOptions();
		if(parent.isAtleastOneSyncOn) {
			enableDisableRefresh(false);
		} else {
			enableDisableRefresh(true, null, true);
		}
		//parent.isRunQuery = false;
		parent.setDashboardInitialized(parent.DASHBOARD_ID_NETWORK_MATRIX);
	}
	initilizeGrouping();
//	$( "#networkMatrixTabs" ).tabs( "load", 1 );
//	$( "#networkMatrixTabs" ).tabs( "refresh" );
//	setEffectiveSeperateDays();
	/*if (isLocalTimeFlag()) {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_L, !isFiveWeekPlan());
	} else {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_Z, !isFiveWeekPlan());
	}*/
	$("#Inbound").parent().addClass("selected");	
	$("#Outbound").parent().removeClass("selected");
	setTimeout(function() {
		onMatrixChange($("#networkMatrixTabs .selected a"));
		direction = "I";
	},500);
	
}
function initilizeGrouping(){
	if(parent.VIEWER.getIsFullRouting()){
		if (!isFullRoutingGroupingInitilized) {
			initalizeMouseEventsForGrouping(getContainerId()[0],$('#groupBarInbound'));	
			initalizeMouseEventsForGrouping(getContainerId()[1],$('#groupBarOutbound'));
			isFullRoutingGroupingInitilized = true;
		}
	} else {
		if (!isLaneLevelGroupingInitilized) {
			initalizeMouseEventsForGrouping(getContainerId()[0],$('#groupBar'));
			isLaneLevelGroupingInitilized = true;
		}
	}	
}
function updateResponseHandler(response) {
	if(response != undefined && response.length >= 0){
	    $.each(response, function(idx, dataItem) {
	       populateEffectiveDayColumns(dataItem, "EFFDAYSL", "EFFDAYSZ");
	    });
	}  
    showProgressDialog(false);
    return response;
}
function itemheaderClickedHandler(event) {
    if (event && (event.column.dataField == getIdColumn() || event.column.getUniqueIdentifier() == getIdColumn() )){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}
}
function itemClickHandler(event) {
	if (event && (event.column.dataField == getIdColumn() || event.column.getUniqueIdentifier() == getIdColumn() )){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	} else {
        calenderCellClickHandler(event);
    }
	/*if (event && event.column.dataField == "COMMENTS") {
        var commentObjArr = jQuery.parseJSON(event.item.COMMENTS);
        var commentText = "";
        for (var i = 0; i < commentObjArr.length; i++) {
            commentText += "<font color='#376092' size=2px>" + commentObjArr[i].commentDesc + "</font> by " + commentObjArr[i].createUser + " on " + dateTimeFormat(new Date(parseInt(commentObjArr[i].createDtTm))) + "<br><br>";
        }
        createCommentsWin('commentsWindowDiv', commentText);
    }if (event && event.column.dataField == "LEG_ID"){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}else {
        calenderCellClickHandler(event);
    }*/
}

/**
 * calender Row Handler method
 * Custom item editor to render calender button.
 * It will show the results in calendar based on LOCAL_DAYS & ZULU_DAYS depending on localZuluFlag.
 */

function calenderCellClickHandler(event) {
	if (event && event.item) {
        var selDays, noOpDays;
        var flag = false;
        if (event.column.dataField == 'CAL_BUTTON_L') {
            selDays = event.item["EFFDAYSL"];
            noOpDays = event.item["NOOP_DAYS_L"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_Z') {
            selDays = event.item["EFFDAYSZ"];
            noOpDays = event.item["NOOP_DAYS_Z"];
            flag = true;
        }
        if (flag == true) {
            parent.showDayControl(false, selDays, event.cell.domElement, true, null, true, null, null, noOpDays, null, null);
        }
    }
}

/**
* Network Aggregate columns method
* Method to set Aggregate columns in network matrix.
*/
function getAggregateColumnsSettings(){
	var map = new Object(); 
	map["All_Weight_Columns"] = ["TOTAL_WEIGHT"];
	map["All_Cube_Columns"] = ["TOTAL_CUBE"];
	map["All_Pieces_Columns"] = ["TOTAL_PIECES"];
	
	return map;//addProductGroupsAggregateColumnSettings(map, true);
}

/**
* Network Timezone method
* Method to set Timezone columns.
*/
function getTimeZoneColumnsSettings(){
	var map = new Object(); 
	if(isFiveWeekPlan()){
		map["All_Local_Columns"] =$.merge($.merge([],getLocalColumns()),commonMatrixConstants.WEEK_COLUMNS_L);	
		map["All_Zulu_Columns"] = $.merge($.merge([],getZuluColumns()),commonMatrixConstants.WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("networkMatrixTreeGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
	return map;
}

/**
* Network Reserved columns visibility method
* Method to set columns visibility in matrix.
*/
function getReservedColumnsVisiblity(){
	var map = new Object();
	
	if (isLocalTimeFlag()) {
		map["All_Zulu_Columns"] = false;
	} else {
		map["All_Local_Columns"] = false;
	}
	return map;
}

/**
* Network columns visibility method
* Method to set columns visibility in Display options.
*/
function getColumnsToHideInSettings(){
	var colToHide=[getIdColumn(), "EFFDAYSL", "EFFDAYSZ", "CAL_BUTTON_L", "CAL_BUTTON_Z"];
	if(!isFiveWeekPlan()){
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_L);
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_Z);
	}
	return colToHide;
}
function setSearchCriteria() {
}

/**
* Network local columns method
* Method to get local columns of Netwrok matrix.
*/
function getLocalColumns() {
	return $.merge($.merge([],commonMatrixConstants.LOCAL_COLUMNS),networkMatrixTreeGridConstants.EFF_LOCAL_COLUMNS);
}

/**
* Network zulu columns method
* Method to get zulu columns of Netwrok matrix.
*/
function getZuluColumns() {
	return $.merge($.merge([],commonMatrixConstants.ZULU_COLUMNS),networkMatrixTreeGridConstants.EFF_ZULU_COLUMNS);
}

/**
* Network day column method
* Method to get day column of Netwrok matrix.
*/
function getDayColumn() {
	return commonMatrixConstants.DAY_COLUMN;
}
function getEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],networkMatrixTreeGridConstants.EFF_LOCAL_COLUMNS),commonMatrixConstants.WEEK_COLUMNS_L);	
		}else{
			return networkMatrixTreeGridConstants.EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],networkMatrixTreeGridConstants.EFF_ZULU_COLUMNS),commonMatrixConstants.WEEK_COLUMNS_Z);
		}else{
			return networkMatrixTreeGridConstants.EFF_ZULU_COLUMNS;
		}
	}
}
/**
* Network id column method
* Method to get id column of Netwrok matrix.
*/
function getIdColumn() {
	return networkMatrixTreeGridConstants.ID_COLUMN;
}



/**
* Network Matrix columns
* Method to get Network Matrix columns
* @param favColumns - Columns which are stored as part of favorite.
*/
function getMatrixColumns(favColumns) {
	//<column width="60" enableExpandCollapseIcon="true" enableHierarchicalNestIndent="true" />
	var matrixCols = [
	{		
		hidden: !parent.VIEWER.getIsFullRouting(),
	    width: 60,
	    enableExpandCollapseIcon: true,
	    enableHierarchicalNestIndent: true	    
	 },           
	 {		
		field: "LANE_ID",
		title: " ",
        hidden: getPropertyValue(favColumns, "LANE_ID", "isVisible", false),
        type: "checkbox",
        width: 20,
        headerWordWrap: "true",
        sortable: false,
        filterable: false,
        headerText: "Check lanes that you want to synchronize with Map or Schematic",
        columnLockMode: "left",
        columnWidthMode: "fixed",
        attributes: {
            style: "padding-left:4px;"
        },
		labelFunction2: reverseIndent
	 }, {
		field: "DIRECTION",
		title: HEADER_LANE,
		width: 50,
		textAlign:"center",
		headerText: HEADER_LANE_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		field: "ORIGIN",
		title: HEADER_ORIG,
		width: 65,
		textAlign:"center",
		headerText: HEADER_ORIG_TOOLTIP,
      	labelFunction2: reverseIndent,
      	headerAlign:"center"
	}, {
		field: "ORIGIN_ACTY",			
		title: HEADER_ORG_ACT,
		width: 65,
		textAlign:"center",
		headerText: HEADER_ORG_ACT_TOOLTIP,
		labelFunction2: reverseIndent

	}, {
		hidden:isLocalTimeFlag(),
		field: "AVAIL_TIME_Z",			
		title: HEADER_AVAIL_TIME_Z,
		textAlign:"center",
		filterable: true,
		width: 65,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_AVAIL_TIME_Z_TOOLTIP,
		labelFunction2: reverseIndent
	},{
		hidden:!isLocalTimeFlag(),
		field: "AVAIL_TIME_L",	
		title: HEADER_AVAIL_TIME_L,
		textAlign:"center",
		filterable: true,
		width: 65,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_AVAIL_TIME_L_TOOLTIP,
		labelFunction2: reverseIndent
	},{
		hidden:!isLocalTimeFlag(),
		field: "ORIGIN_DAY_L",			
		title: HEADER_ODY_L,
		textAlign:"center",
		width: 65,
		headerText: HEADER_ODY_L_TOOLTIP,
		labelFunction2: reverseIndent
	},{
		hidden:isLocalTimeFlag(),
		field: "ORIGIN_DAY_Z",			
		title: HEADER_ODY_Z,
		textAlign:"center",
		width: 65,
		headerText: HEADER_ODY_Z_TOOLTIP,
		labelFunction2: reverseIndent
	},{
		field: "MANDATORY_DELAY",			
		title: HEADER_DL,
		textAlign:"center",
		width: 45,
		headerText: HEADER_DL_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "ZULU_NIGHTS_CROSSED",			
		title: HEADER_RD_Z,
		textAlign:"center",
		width: 50,
		headerText: HEADER_RD_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "LOCAL_NIGHTS_CROSSED",			
		title: HEADER_RD_L,
		textAlign:"center",
		width: 50,
		headerText: HEADER_RD_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		field: "SM",
		title: HEADER_SM,
		textAlign:"center",
		width: 40,
		headerText: HEADER_SM_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		field: "MM",
		title: HEADER_MM,
		textAlign:"center",
		width: 40,
		headerText: HEADER_MM_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		field: "TRANSITS",
		title: HEADER_TRANSITS,
		textAlign:"center",
		width: 80,
		headerText: HEADER_TRANSITS_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "ARRIVAL_DAY_Z",
		title: HEADER_ADY_Z,
		textAlign:"center",
		width: 65,
		headerText: HEADER_ADY_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ARRIVAL_DAY_L",
		title: HEADER_ADY_L,
		textAlign:"center",
		width: 65,
		headerText: HEADER_ADY_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "DUE_TIME_Z",
		textAlign:"center",
		title: HEADER_DUE_TIME_Z,
		filterable: true,
		width: 65,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_DUE_TIME_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "DUE_TIME_L",
		title: HEADER_DUE_TIME_L,
		textAlign:"center",
		filterable: true,
		width: 65,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_DUE_TIME_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		field: "DESTINATION",
		title: HEADER_DES,
		textAlign:"center",
		width: 70,
		headerText: HEADER_DES_TOOLTIP,
      	headerAlign:"center",
		labelFunction2: reverseIndent
	},  {
		field: "DESTINATION_ACTY",
		title: HEADER_DEST_ACT,
		textAlign:"center",
		width: 55,
		headerText: HEADER_DEST_ACT_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D2",
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D3",
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP
	}, {
		hidden:true,
		field: "EFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	},{
		hidden:true,
		field: "EFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSL_W3",
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSL_W4",
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSL_W5",
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSL",
		title: HEADER_EFF_DAYS_L,
		textAlign:"center",
		width: 120,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSL");
    		},
			labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_KEY_EFF_DAYS_L,
		textAlign:"left",
		width: 80,
		headerText: HEADER_KEY_EFF_DAYS_L_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "CAL_BUTTON_L",
		title: "&nbsp;",
		filterable: false,
        sortable: false,
        excludeFromExport: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
        width: 45,
        headerText: HEADER_CAL_L_TOOLTIP,
        labelFunction: calLabelFunction,
        labelFunction2: reverseIndent
	}, {
		hidden:!isLocalTimeFlag(),
		field: "NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		textAlign:"center",
		template: calenderRowTemplateL,
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
      	  template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.NOOP_DAYS_L);
				return noopStr;
			},
			labelFunction2: reverseIndent	
	}, {
		hidden:true,
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 20,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
		labelFunction2: reverseIndent
	}, {
		hidden: true,
		field: "EFFDAYSZ",
		title: HEADER_EFF_DAYS_Z,
		textAlign:"center",
		width: 120,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSZ");
  		},
		labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_KEY_EFF_DAYS_Z,
		textAlign:"left",
		width: 75,
		headerText:HEADER_KEY_EFF_DAYS_Z_TOOLTIP,
			labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_Z",
		title: "&nbsp;",
		filterable: false,
        sortable: false,
        excludeFromExport: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
        width: 45,
        headerText: HEADER_CAL_Z_TOOLTIP,
        labelFunction: calLabelFunction,
        labelFunction2: reverseIndent
	}, {
		hidden:isLocalTimeFlag(),
		field: "NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		textAlign:"center",
		template: calenderRowTemplateZ,
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
      	  template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z);
				return onOpStr;
			},
			labelFunction2: reverseIndent	
	}, {
		field: "DAY",
		title: HEADER_VOL_DAY,
		textAlign:"center",
		width: 50,
		headerText: HEADER_VOL_DAY_Z_TOOLTIP,
		labelFunction2: reverseIndent,
		isSortNumeric:true
	},{
		field: "LANE_STATUS",
		title: HEADER_LANE_STATUS,
		textAlign:"center",
		width: 65,
		headerText: HEADER_LANE_STATUS_TOOLTIP,
		cellBackgroundColorFunction : laneStatusCellBackgroundFn,
		labelFunction2: reverseIndent
	},  {
		field: "PRODUCTS",
		title: HEADER_PRODS,
		textAlign:"center",
		width: 140,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION,
		headerText: HEADER_PRODS_TOOLTIP,
		labelFunction2: reverseIndent
	},  {
		field: "ODPD",
		title: HEADER_ODPD_COUNT,
		textAlign:"right",
		width: 60,
		/*aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",*/
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_ODPD_COUNT_TOOLTIP,
		labelFunction2: reverseIndent,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		isSortNumeric:true
	},{
		field: "TOTAL_WEIGHT",
		title: HEADER_WGT_TOTAL,
		textAlign:"right",
		width: 60,
		isSortNumeric:true,
		headerText:  HEADER_WGT_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0",  
          		labelFunction2: reverseIndent  		
	}, {
		field: "TOTAL_PIECES",
		title: HEADER_PIECES_TOTAL,
		textAlign:"right",
		width: 70,
		isSortNumeric:true,
		headerText: HEADER_PIECES_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0",
          	labelFunction2: reverseIndent
	}, {
		field: "TOTAL_CUBE",
		title: HEADER_CB_TOTAL,
		textAlign:"right",
		width: 60,
		isSortNumeric:true,
		headerText: HEADER_CB_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0",
          	labelFunction2: reverseIndent
	}];
	
	if(parent.VIEWER.getIsFullRouting()){
		matrixCols.splice(2,0,{
			field: "PATH_SEQ",
			title: "Seq", 
			sortable:false,
			filterable:true,
			textAlign:"center",
			labelFunction2: reverseIndent,
			headerAlign:"center"
		});
	}
	
	// Remove ORIGIN_DAY_L, ORIGIN_DAY_Z, ARRIVAL_DAY_L, ARRIVAL_DAY_Z if query is Lane level query.
	if(!parent.VIEWER.getIsFullRouting()){
		matrixCols.splice(7,2);
		matrixCols.splice(13,2);
	}
	
	showHideDisplayOptions();
	
	matrixCols = addProductGroupsColumns(matrixCols, true, undefined, undefined, true);
	
	/*matrixCols = matrixCols.concat([ {
		field: "TOTAL_WEIGHT",
		title: HEADER_WGT_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText:  HEADER_WGT_TOTAL_TOOLTIP,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0"  
	}, {
		field: "TOTAL_PIECES",
		title: HEADER_PIECES_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_PIECES_TOTAL_TOOLTIP,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0"  
	}, {
		field: "TOTAL_CUBE",
		title: HEADER_CB_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_CB_TOTAL_TOOLTIP,
          	footerOperation:"sum",
          	footerAlign:"right",
          	footerOperationPrecision:"0"  
	}]); */
	// If there are favorite on network matrix, hiding the columns based on saved favorites configuration.
	if(favColumns) {
		var column;
		var columnArray = new Array();
		for(var i=0; i<favColumns.length; i++) {
			for(var j=0; j<matrixCols.length; j++) {
				if(matrixCols[j].field == favColumns[i].field) {
					matrixCols[j].width = favColumns[i].width;
					matrixCols[j].hidden = false;
					columnArray.push(matrixCols[j]);
				}
			}
		}
		for(var i=0; i<matrixCols.length; i++) {
			var flag = true;
			for(var j=0; j<favColumns.length; j++) {
				if(matrixCols[i].field == favColumns[j].field) {
					flag = false;
					break;
				}
			}
			if(flag) {
				matrixCols[i].hidden = true;
				columnArray.push(matrixCols[i]);
			}
		}
		return columnArray;
	} 
	
	if(parent.VIEWER.getIsFullRouting()){ 
		matrixCols.push(getNestedColumnDtls());
	}
	
	return matrixCols;
}

function getNestedColumnDtls(){
	return  { 
		type: "nextlevel",
		parentChildrenField: "children",
		childrenField: undefined,
		currentLevelParentFiled: undefined,  
		selectedKeyField: undefined,
		nestIndent:undefined,
		isReusePreviousLevelColumns: true,
		parentItemLoadMode: "server",
		currentLevelItemLoadMode: "server",
		itemLoadHandler:itemLoadHandler,		
		parentChildrenCountField: "CHILD_COUNT",
		currentChildrenCountField: "CHILD_COUNT",
		/*rowBackgroundColorFunction: setRowBackgroundColor,*/
		cellBackgroundColorFunction : laneStatusCellBackgroundFn,
		isCellCustomBackgroundDrawFunctionDefault: false
	};
};

function setRowBackgroundColor(cell){
	var lvl = cell.level.getNestDepth();
	switch (lvl) {
	case 2: 
		return 0xD8EDFD;
	    break;
	case 3: 
		return 'rgba(219,237,253,0.8)';
	    break;
	case 4: 
		return 'rgba(219,237,253,0.6)';
		break;
	case 5:
		return 'rgba(219,237,253,0.4)';
	    break;
	}
}

function itemLoadHandler(gridEvent){
	//gridEvent.target.removeEventListener("itemLoad", gridEvent.filter.level);
	gridEvent.filter.parentObject["children"]= [];	
	getChildData(gridEvent.filter.parentObject,gridEvent);
}

function getChildData(selectedItem, gridEvent){
	if(selectedItem != undefined){
		var params = {};
	    params["renderEmpty"]= false;
	    params["paramsMap"] = getDatasourceParams(false);
	    params["paramsMap"]["laneId"] = selectedItem["LANE_ID"];
	    params["paramsMap"]["laneSequence"] = selectedItem["PATH_SEQ"];
	    params["paramsMap"]["direction"] = selectedItem["DIRECTION"];
	    params["paramsMap"]["day"] = selectedItem["DAY"];
	    params["url"] = getMatrixUrl();
	    params["successCallback"] = function(response, io){
	    	onLoadChildDataSuccess(response, io, gridEvent);
	    };
	    params["failureCallback"] = onServiceRequestFailure;
	    params["showProgressWindow"] = false;    
	    callService(params);
	}    
}

function onLoadChildDataSuccess(response, io, gridEvent){
	if(response!= undefined){
		gridEvent.target["wrapper"].createDataGridLevel(getNestedColumnDtls(), gridEvent.filter.level);
		if(gridEvent.filter.level.nextLevel) {
			gridEvent.filter.level.nextLevel._parentLevel = gridEvent.filter.level;
			gridEvent.filter.level.nextLevel.setDepth(gridEvent.filter.level._nestDepth + 1);
		}
		//gridEvent.target["wrapper"].rebuild();
		gridEvent.target.setChildData(gridEvent.filter.parentObject,response,gridEvent.filter.level.getParentLevel(),response.length);
		populateIdsAndSync();
	}else {
		gridEvent.target.setChildData(gridEvent.filter.parentObject,[],gridEvent.filter.level.getParentLevel(),0);
	}
	matrixData[getContainerId()[0]] = JSON.stringify(gridEvent.target["wrapper"].grid.getDataProvider());
}


function getPropertyValue(favColumns, key, propertyName, defaultValue) {
    var column;
    if (favColumns != undefined) {
        column = favColumns[key];
        if (column == undefined) {
            switch (propertyName) {
            case "isVisible":
                return true;
                break;
            case "width":
                return defaultValue;
                break;
            }
        }
        return column != undefined && column[propertyName] != undefined ? column[propertyName] : defaultValue;
    }

    return defaultValue;
}

/**
* Network Matrix Schema
* Method to configure matrix schema
*/
function getSchema() {
	var gridFields = {
		LANE_ID: {
			type: "string"
		},
		DIRECTION: {
			type: "string"
		},
		ORIGIN: {
			type: "string"
		},
		ORIGIN_ACTY: {
			type: "string"
		},
		AVAIL_TIME_Z: {
			type: "date"
		},
		AVAIL_TIME_L: {
			type: "date"
		},
		Z_L_DAY_OFFSET: {
			type: "number"
		},
		MANDATORY_DELAY: {
			type: "number"
		},
		SM: {
			type: "string"
		},
		MM: {
			type: "string"
		},
		TRANSITS: {
			type: "string"
		},
		ORIGIN_DAY_Z: {
			type: "number"
		},
		ORIGIN_DAY_Z: {
			type: "number"
		},
		ARRIVAL_DAY_L: {
			type: "number"
		},
		ARRIVAL_DAY_Z: {
			type: "number"
		},
		ZULU_NIGHTS_CROSSED: {
			type: "number"
		},
		LOCAL_NIGHTS_CROSSED: {
			type: "number"
		},
		DUE_TIME_Z: {
			type: "date"
		},
		DUE_TIME_L: {
			type: "date"
		},
		DESTINATION: {
			type: "string"
		},
		DESTINATION_ACTY: {
			type: "string"
		},
		DAY: {
			type: "number"
		},
		EFFDAYSZ: {
			type: "string"
		},
		EFFDAYSL: {
			type: "string"
		},
		KEYWORD_EFFDT_L: {
			type: "string"
		},
		KEYWORD_EFFDT_Z: {
			type: "string"
		},
		NOOP_DAYS_L: {
			type: "string"
		},
		NOOP_DAYS_Z: {
			type: "string"
		},
		LANE_STATUS: {
			type: "string"
		},					
		PRODUCTS: {
			type: "string"
		},
		ODPD: {
			type: "number"
		},
		TOTAL_WEIGHT: {
			type: "number"
		},
		TOTAL_PIECES: {
			type: "number"
		}, 
		TOTAL_CUBE: {
			type: "number"
		},
		PATH_SEQ: {
			type: "number"
		}
	};
	
	return addProductGroupsSchema(gridFields, true, undefined, true);
}

/**
* Network Matrix Aggregate columns
* Method to configure aggregate columns in Network matrix
*/
function getAggregateColumns() {
	var aggregateCols = [
	  { field: "ODPD", aggregate: "sum" },
	  { field: "TOTAL_WEIGHT", aggregate: "sum" },
	  { field: "TOTAL_PIECES", aggregate: "sum" },
	  { field: "TOTAL_CUBE", aggregate: "sum" }
  ];
  
	
	return addProductGroupsAggregateColumns(aggregateCols, true);
}

/**
* Reset Grid Header
* Method to reset Network matrix header with the default state of icons.
*/
function resetGridHeader(){
	parent.highlightBtn(parent.$('#btnNetworkMatrixSyncMap')[0],true);
	parent.enableSync(parent.$('#btnNetworkMatrixSyncMap')[0],parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
	parent.highlightBtn(parent.$('#btnNetworkMatrixSyncSchematic')[0],true);
	parent.enableSync(parent.$('#btnNetworkMatrixSyncSchematic')[0],parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
}

/**
* Can Apply Clear
* Method to check if clear operation can be applied in Network matrix
*/
function canApplyClear() {
	return parent.isNetworkQuery;
}
function onMatrixChange(target){
//	onMatrixChange($("#networkMatrixTabs .selected"));
	if (window.event != undefined) {
		window.event.preventDefault();
	}
	$("#networkMatrixTabs").find('li').removeClass("selected");
    $(target).parent().addClass("selected");
    if(target.id == "Outbound"){
    	direction = "O";
		$( "#outboundGrid" ).show();	
		$( "#inboundGrid" ).hide();	
		$( "#groupBarOutbound" ).hide();	
		$( "#groupBarInbound" ).hide();
	}else{
		direction = "I";
		$( "#outboundGrid" ).hide();	
		$( "#inboundGrid" ).show();
		$( "#groupBarInbound" ).hide();	
		$( "#groupBarOutbound" ).hide();
	}
    onResize();
}
function getMatrixFavId() {
	if(parent.VIEWER.getIsFullRouting()){
		if($("#networkMatrixTabs .selected").text().indexOf("Inbound") < 0) {
		//if(direction == "O"){
			return [parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID+"Outbound"];
		}else{
			return [parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID+"Inbound"];
		}
	}else {
		return [parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID];
	}    
}
function getContainerId() {
	if(parent.VIEWER.getIsFullRouting()){
		$("#networkMatrixTreeGridLane").hide();
		$( "#fullRoutingQueryGrid" ).show();		
		return [parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID+"Inbound", parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID+"Outbound"];
	}else {
		$("#networkMatrixTreeGridLane").show();		
		$( "#fullRoutingQueryGrid" ).hide();
		return [parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID];
	}    
}

function getActiveTab(){/*	
	var activeTabIndex = $( "#networkMatrixTabs" ).tabs( "option", "active" );	
	if(activeTabIndex == 0){
		return "Inbound";
	}else {
		return "Outbound";
	}
	
	return "";
*/}

function getGroupbarId(){
	if(parent.VIEWER.getIsFullRouting()){
		if(direction == "O"){
			return "groupBarOutbound";
		}else{
			return "groupBarInbound";
		}
	}
	return "groupBar";
}

function laneStatusCellBackgroundFn(cell) {
	var laneStatus = cell.getText();
	var color = "0xffffff";
	var textColor;
	if(laneStatus == 'No Paths') {
		color = "0xff0000";
		textColor = "#ffffff";
	} else if(laneStatus == 'Prod Restricted') {
		color = "0xff0000"; 
		textColor = "#ffffff";
	} else if(laneStatus == 'Bad Lane') {
		color = "0xff0000"; 
		textColor = "#ffffff";
	} else if(laneStatus == 'Not Effective') {
     	color = "0x808080";
     	textColor = "#ffffff";
	 } else if(laneStatus == 'N/A') {
     	color = "0x006600";
     	textColor = "#ffffff";
     } else if(laneStatus == 'OK') {
     	color = "0x0080ff";
     	textColor = "#ffffff";
     } else if(laneStatus == 'Zero') {
     	color = "0xff0000";
     	textColor = "#ffffff";
     } else if(laneStatus == 'Partial') {
     	color = "0xffff00";
     	textColor = "#333333";
     } else if(laneStatus == 'Excess') {
     	color = "0xffc800";
     	textColor = "#333333";
     } else if(laneStatus == 'Unknown') {
     	color = "0xffffff";
     	textColor = "#333333";
	}
	//cell.domElement.firstChild.style.color = textColor;
	return color;
}

(function ($) {
    jQuery.event.special.destroyed = {
        remove: function (o) {
            if (o.handler) {
                o.handler.apply(this, arguments);
            }
        }
    };
    if (kendo && kendo.ui && kendo.ui.Widget) {
        kendo.ui.Widget.prototype.init = function (element, options) {
            var that = this;

            that.element = kendo.jQuery(element).handler(that);
            
            // This is the section that listens for destroy and calls it when this widget is being removed from the dom
            //  everything else is from the kendo libraries
            that.element.bind('destroyed', function() {
                if (that.destroy) {
                    var widget = that.element.data("kendo" + options.prefix + options.name);
                    if ((null !== widget) && (typeof widget !== "undefined")) that.destroy();
                }
            });

            kendo.Observable.fn.init.call(that);

            options = that.options = $.extend(true, {}, that.options, options);

            if (!that.element.attr(kendo.attr("role"))) {
                that.element.attr(kendo.attr("role"), (options.name || "").toLowerCase());
            }

            that.element.data("kendo" + options.prefix + options.name, that);

            that.bind(that.events, options);
        };
    }
})(jQuery);