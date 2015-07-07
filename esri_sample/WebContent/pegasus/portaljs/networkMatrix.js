/**
* @author 888600 Abhishek Sharma
* This script belongs to Network Matrix Dashboard.
* Included in networkMatrix.jsp
*/

//Progress message in Network Matrix
var PROGRESS_DIALOG_MESSAGE_NETWORK_MATRIX = "Loading full network matrix...";
// Calendar row template for Local & Zulu
var	calenderRowTemplateL="#= calenderRowEditor(data,'networkMatrixGrid','L') #";
var	calenderRowTemplateZ="#= calenderRowEditor(data,'networkMatrixGrid','Z') #";

var EFF_LOCAL_COLUMNS=["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7",
   					"EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"];
var EFF_ZULU_COLUMNS = ["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7",
					"EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"];
// Array for All Local columns
var LOCAL_COLUMNS = ["NOOP_DAYS_L","AVAIL_TIME_L","ORIGIN_DAY_L","LOCAL_NIGHTS_CROSSED","ARRIVAL_DAY_L","DUE_TIME_L","CAL_BUTTON_L","KEYWORD_EFFDT_L","EFFDAYSL"];
//Array for All Zulu columns
var ZULU_COLUMNS = ["NOOP_DAYS_Z","AVAIL_TIME_Z","ORIGIN_DAY_Z","ZULU_NIGHTS_CROSSED","ARRIVAL_DAY_Z","DUE_TIME_Z","CAL_BUTTON_Z" ,"KEYWORD_EFFDT_Z","EFFDAYSZ"];
//Array for Week Local columns
var WEEK_COLUMNS_L = ["EFFWEEKSL_W5"];
//Array for Week Zulu columns
var WEEK_COLUMNS_Z = ["EFFWEEKSZ_W5"];
//Day column
var DAY_COLUMN = "DAY";
//Network ID column
var ID_COLUMN = "LANE_ID";
//Favorite component
var favoriteComponent;

/*var LOCAL_TOTAL_FREQ = null;
var ZULU_TOTAL_FREQ = null;
*/
var timeColLabelMap = new Object();
	timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	timeColLabelMap["AVAIL_TIME_L"] = ["Avail Time"];
	timeColLabelMap["DUE_TIME_L"] = ["Due Time"];
	timeColLabelMap["ORIGIN_DAY_L"] = ["Orig Day"];
	timeColLabelMap["LOCAL_NIGHTS_CROSSED"] = ["Mids Crossed"];
	timeColLabelMap["ARRIVAL_DAY_L"] = ["Arriv Day"];
	timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	timeColLabelMap["AVAIL_TIME_Z"] = ["Avail Time"];
	timeColLabelMap["DUE_TIME_Z"] = ["Due Time"];
	timeColLabelMap["ORIGIN_DAY_Z"] = ["Orig Day"];
	timeColLabelMap["ZULU_NIGHTS_CROSSED"] = ["Mids Crossed"];
	timeColLabelMap["ARRIVAL_DAY_Z"] = ["Arriv Day"];
	
var volColLabelMap = new Object(); 
	volColLabelMap["TOTAL_WEIGHT"] = ["Ttl Wt"];
	volColLabelMap["TOTAL_PIECES"] = ["Ttl Pcs"];
	volColLabelMap["TOTAL_CUBE"] = ["Ttl Cu"];

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
	return getColumnsSettings('networkMatrixGrid');
}

/**
* Network Contents setting
* get network matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings('networkMatrixGrid');
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
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,"networkMatrixGrid");
}

/**
* Network Content setting
* apply network matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings('networkMatrixGrid',contentSettings);
}
/******* common methods - favorites - end *******/

/**
* Network Initialize method
* Method to use for initialization of Network Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	
	setMatrixFavoriteSettings(favoriteSettings);
	if(flag == undefined) {
		setMatrixID("networkMatrixGrid");
		setDashboardID(parent.DASHBOARD_ID_NETWORK_MATRIX);
		isClearOn = false;
		addButtonsBar();	
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_NETWORK_MATRIX, "networkMatrixFavoritesMenu","Full Network Matrix");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
	}
	
	var matrixURL = getMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
	
	var matrixObject = this;
	var networkDiv =  $('<div id="networkMatrixGrid" style="width:100%;"></div>').empty().appendTo("#networkMatrix");
	var element = networkDiv.kendoGrid({
		dataSource : {
			transport: {		
				read: {
				  url: function (options) {
				        return matrixURL;
				    },
				  dataType: "json",
				  data: function() {
					  	return matrixObject.getDatasourceParams();
				  }
				}
			  },
              schema:{
					model: {
						fields: getSchema()
					},
					parse: function (d) {
						$.each(d, function (idx, dataItem) {				            	
								populateEffectiveDayColumns(dataItem, "EFFDAYSL", "EFFDAYSZ");
								populateTimeColumns(dataItem);
				        });
				        return d;
					}
				},
          aggregate: getAggregateColumns(),
		  requestStart: function(e) {
				 showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_NETWORK_MATRIX);
		  },
		  requestEnd: function(e) {		  	  
			  showProgressDialog(false);
			  onResize();	
			  if(renderEmpty) {
		  	  		renderEmpty = false;
		  	  } else {		   
		  	  	parent.setDashboardDataStatus(parent.DASHBOARD_ID_NETWORK_MATRIX, parent.DATA_TYPE_NETWORK, true);
			  	setTimeout( function() {
			  			applyMatrixSortFilterGroupByFavoriteSettings();
						//sync other dashboards
						populateIdsAndSync();
						validateMatrixCheckboxStates("networkMatrixGrid");
					}, 100);			  	
				}
		  },
		  error: function(e) {
		  	  if(renderEmpty) {
		  	  	renderEmpty = false;
		  	  }
		  	  checkForTimeoutError(e);
			  showProgressDialog(false);
			  parent.setDashboardDataStatus(parent.DASHBOARD_ID_NETWORK_MATRIX, parent.DATA_TYPE_NETWORK, true);			  
		  }
		},
		 sortable: {
			 mode: "multiple",
	         allowUnsort: true
	     },
	     filterable: {
	    	 messages: {
	    	 filter: "Apply filter",
	    	 clear: "Clear filter",
	    	 info: "Only show values that:"
	    	 }
	     },
        groupable: true,
		resizable: true,
		reorderable: true,
		dataBound: onResize,
		height: DEFAULT_MATRIX_HEIGHT,
		dataBound:  showTooltip,
		scrollable: true,
	    columns: getMatrixColumns(favColumns)
	});
	refresh();
	if(flag == undefined) {
		initializeDisplayOptions();
		showHideDisplayOptions();
		if(parent.isAtleastOneSyncOn) {
			enableDisableRefresh(false);
		} else {
			enableDisableRefresh(true, null, true);
		}
		//parent.isRunQuery = false;
		parent.setDashboardInitialized(parent.DASHBOARD_ID_NETWORK_MATRIX);
	}
//	setEffectiveSeperateDays();
	/*if (isLocalTimeFlag()) {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_L, !isFiveWeekPlan());
	} else {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_Z, !isFiveWeekPlan());
	}*/
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
		map["All_Local_Columns"] =$.merge($.merge([],getLocalColumns()),WEEK_COLUMNS_L);	
		map["All_Zulu_Columns"] = $.merge($.merge([],getZuluColumns()),WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("networkMatrixGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
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
		$.merge(colToHide,WEEK_COLUMNS_L);
		$.merge(colToHide,WEEK_COLUMNS_Z);
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
	return $.merge($.merge([],LOCAL_COLUMNS),EFF_LOCAL_COLUMNS);
}

/**
* Network zulu columns method
* Method to get zulu columns of Netwrok matrix.
*/
function getZuluColumns() {
	return $.merge($.merge([],ZULU_COLUMNS),EFF_ZULU_COLUMNS);
}

/**
* Network day column method
* Method to get day column of Netwrok matrix.
*/
function getDayColumn() {
	return DAY_COLUMN;
}
function getEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_LOCAL_COLUMNS),WEEK_COLUMNS_L);	
		}else{
			return EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_ZULU_COLUMNS),WEEK_COLUMNS_Z);
		}else{
			return EFF_ZULU_COLUMNS;
		}
	}
}
/**
* Network id column method
* Method to get id column of Netwrok matrix.
*/
function getIdColumn() {
	return ID_COLUMN;
}

/**
* calender Row Handler method
* Custom item editor to render calendar button.
* It will show the results in calendar based on EFFDAYSL & EFFDAYSZ depending on localZuluFlag.
* @param calBtn - Instance of calendar button.
* @param grid_Id - Grid Id.
* @param localZuluFlag - Flag to determine if it's L(ocal) or Z(ulu).
*/
function calenderRowHandler(calBtn,grid_Id,localZuluFlag) {
	var grid = $("#"+grid_Id.id).data("kendoGrid");
	var groupColCorrection;
	var effDaysLIndex;
	var effDaysZIndex;
	var noopDaysLIndex;
	var noopDaysZIndex;

	var currentTR = $(calBtn).closest("tr");
	var childrens, selDays, noOpDays;
	if(currentTR && currentTR.length > 0){
		childrens = currentTR[0].childNodes;
		groupColCorrection = childrens.length - grid.columns.length;
		effDaysLIndex = getMatrixColumnIndex(grid, "EFFDAYSL") + groupColCorrection;
		effDaysZIndex = getMatrixColumnIndex(grid, "EFFDAYSZ") + groupColCorrection;
		noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L") + groupColCorrection;
		noopDaysZIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_Z") + groupColCorrection;
		if(childrens && childrens.length > effDaysLIndex){
			if (localZuluFlag == 'L') {
				selDays = childrens[effDaysLIndex].innerText;
				noOpDays = childrens[noopDaysLIndex].innerText;
			} else {
				selDays = childrens[effDaysZIndex].innerText;
				noOpDays = childrens[noopDaysZIndex].innerText;
			}
		}
	}
	
	calBtn.gridId = grid_Id.id;
	showDayControl(false,selDays,calBtn, true, "", true, null, null, noOpDays);
}

/**
* Network Matrix columns
* Method to get Network Matrix columns
* @param favColumns - Columns which are stored as part of favorite.
*/
function getMatrixColumns(favColumns) {
	var matrixCols = [
	 {
		field: "LANE_ID",
		title: " ", 
		width: 20, 
		sortable:false,
		filterable:false,
		attributes: { style:"padding-left:4px;"}, 
		template: "<input type='checkbox' id='#=data.LANE_ID#' value='#=data.LANE_ID#' class='tickCheckBox' onclick='selectMatrixColumn(this);'/><label></label>",
		headerAttributes: {
      		  title:"Check lanes that you want to synchronize with Map or Schematic"
      	  },
        headerTemplate: "<input type='checkbox' id='matrixHeaderChk' class='tickCheckBox' onclick='selectAllMatrixColumns(this);'/><label></label>"
	}, {
		field: "DIRECTION",
		title: HEADER_LANE,
		width: 35,
		attributes:  { style:"text-align:center;" },
		headerAttributes: {
      		  title:HEADER_LANE_TOOLTIP
      	  }
	}, {
		field: "ORIGIN",
		title: HEADER_ORIG,
		width: 55,
		attributes:  { style:"text-align:center;" },
		headerAttributes: {
      		  title:HEADER_ORIG_TOOLTIP
      	  }
	}, {
		field: "ORIGIN_ACTY",			
		title: HEADER_ORG_ACT,
		width: 45,
		attributes:  { style:"text-align:center;" },
		headerAttributes: {
      		  title:HEADER_ORG_ACT_TOOLTIP
      	  }

	}, {
		hidden:isLocalTimeFlag(),
		field: "AVAIL_TIME_Z",			
		title: HEADER_AVAIL_TIME_Z,
		attributes:  { style:"text-align:center;" },
		width: 55,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_AVAIL_TIME_Z_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "AVAIL_TIME_L",	
		title: HEADER_AVAIL_TIME_L,
		attributes:  { style:"text-align:center;" },
		width: 55,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_AVAIL_TIME_L_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "ORIGIN_DAY_L",			
		title: HEADER_ODY_L,
		attributes:  { style:"text-align:center;" },
		width: 55,
		headerAttributes: {
      		  title:HEADER_ODY_L_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "ORIGIN_DAY_Z",			
		title: HEADER_ODY_Z,
		attributes:  { style:"text-align:center;" },
		width: 55,
		headerAttributes: {
      		  title:HEADER_ODY_Z_TOOLTIP
      	  }
	},{
		field: "MANDATORY_DELAY",			
		title: HEADER_DL,
		attributes:  { style:"text-align:center;" },
		width: 30,
		headerAttributes: {
      		  title:HEADER_DL_TOOLTIP
      	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "ZULU_NIGHTS_CROSSED",			
		title: HEADER_RD_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_RD_Z_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "LOCAL_NIGHTS_CROSSED",			
		title: HEADER_RD_L,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_RD_L_TOOLTIP
      	  }
	}, {
		field: "SM",
		title: HEADER_SM,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_SM_TOOLTIP
      	  }
	}, {
		field: "MM",
		title: HEADER_MM,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_MM_TOOLTIP
      	  }
	}, {
		field: "TRANSITS",
		title: HEADER_TRANSITS,
		attributes:  { style:"text-align:center;" },
		width: 60,
		headerAttributes: {
      		  title:HEADER_TRANSITS_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ARRIVAL_DAY_Z",
		title: HEADER_ADY_Z,
		attributes:  { style:"text-align:center;" },
		width: 55,
		headerAttributes: {
      		  title:HEADER_ADY_Z_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ARRIVAL_DAY_L",
		title: HEADER_ADY_L,
		attributes:  { style:"text-align:center;" },
		width: 55,
		headerAttributes: {
      		  title:HEADER_ADY_L_TOOLTIP
      	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "DUE_TIME_Z",
		attributes:  { style:"text-align:center;" },
		title: HEADER_DUE_TIME_Z,
		width: 55,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_DUE_TIME_Z_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "DUE_TIME_L",
		title: HEADER_DUE_TIME_L,
		attributes:  { style:"text-align:center;" },
		width: 55,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_DUE_TIME_L_TOOLTIP
      	  }
	}, {
		field: "DESTINATION",
		title: HEADER_DES,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_DES_TOOLTIP
      	  }
	},  {
		field: "DESTINATION_ACTY",
		title: HEADER_DEST_ACT,
		attributes:  { style:"text-align:center;" },
		width: 40,
		headerAttributes: {
      		  title:HEADER_DEST_ACT_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D2",
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D3",
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  }
	},{
		hidden:true,
		field: "EFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSL_W3",
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSL_W4",
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSL_W5",
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  }	
	}, {
		hidden:true,
		field: "EFFDAYSL",
		title: HEADER_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSL");
    		}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_KEY_EFF_DAYS_L_TOOLTIP
    	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "CAL_BUTTON_L",
		title: "&nbsp;",
		template: calenderRowTemplateL,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		hidden:!isLocalTimeFlag(),
		field: "NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateL,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.NOOP_DAYS_L);
				return noopStr;
			}	
	}, {
		hidden:true,
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 20,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  }
	}, {
		hidden: true,
		field: "EFFDAYSZ",
		title: HEADER_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSZ");
  		}
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_KEY_EFF_DAYS_Z_TOOLTIP
    	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_Z",
		title: "&nbsp;",
		template: calenderRowTemplateZ,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		field: "NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateZ,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z);
				return onOpStr;
			}	
	}, {
		field: "DAY",
		title: HEADER_VOL_DAY,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_VOL_DAY_Z_TOOLTIP
      	  }

	},{
		field: "LANE_STATUS",
		title: HEADER_LANE_STATUS,
		attributes:  { style:"text-align:center;" },
		width: 65,
		headerAttributes: {
      		  title:HEADER_LANE_STATUS_TOOLTIP
      	  },
		template: function(dataItem) {
			var laneStatus = dataItem.LANE_STATUS;
			var color;
			var textColor;
			
			if(laneStatus) {
				if(laneStatus == 'No Paths') {
					color = "#ff0000";
					textColor = "#ffffff";
				} else if(laneStatus == 'Prod Restricted') {
					color = "#ff0000"; 
					textColor = "#ffffff";
				} else if(laneStatus == 'Bad Lane') {
					color = "#ff0000"; 
					textColor = "#ffffff";
				} else {
				     if(laneStatus == 'Not Effective') {
				     	color = "#808080";
				     	textColor = "#ffffff";
				     } if(laneStatus == 'N/A') {
				     	color = "#006600";
				     	textColor = "#ffffff";
				     } else if(laneStatus == 'OK') {
				     	color = "#0080ff";
				     	textColor = "#ffffff";
				     } else if(laneStatus == 'Zero') {
				     	color = "#ff0000";
				     	textColor = "#ffffff";
				     } else if(laneStatus == 'Partial') {
				     	color = "#ffff00";
				     	textColor = "#333333";
				     } else if(laneStatus == 'Excess') {
				     	color = "#ffc800";
				     	textColor = "#333333";
				     } else if(laneStatus == 'Unknown') {
				     	color = "#ffffff";
				     	textColor = "#333333";
				     }
				}
			}
			if(laneStatus) {
				return "<span style='display: inline-block;width:100%;background-color:"+color+";color:"+textColor+"'>"+laneStatus+"</span>";
			}
			return "";
		}

	},  {
		field: "PRODUCTS",
		title: HEADER_PRODS,
		attributes:  { style:"text-align:center;" },
		width: 100,
		headerAttributes: {
      		  title:HEADER_PRODS_TOOLTIP
      	  }
	},  {
		field: "ODPD",
		title: HEADER_ODPD_COUNT,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_ODPD_COUNT_TOOLTIP
      	  }
	}];
	
	if(parent.VIEWER.getIsFullRouting()){
		matrixCols.splice(1,0, {
			field: "PATH_SEQ",
			title: "Seq", 
			width: 40, 
			sortable:false,
			filterable:true,
			attributes:  { style:"text-align:center;" }		
		});
		
		/*
		,{
			field: "NW_ROUTING_ID",
			title: "NRID", 
			width: 40, 
			sortable:false,
			filterable:true,
			attributes:  { style:"text-align:center;" }		
		}
		*/
	}
	
	// Remove ORIGIN_DAY_L, ORIGIN_DAY_Z, ARRIVAL_DAY_L, ARRIVAL_DAY_Z if query is Lane level query.
	if(!parent.VIEWER.getIsFullRouting()){
		matrixCols.splice(6,2);
		matrixCols.splice(12,2);
	}
	
	showHideDisplayOptions();
	
	matrixCols = addProductGroupsColumns(matrixCols, true);
	
	matrixCols = matrixCols.concat([ {
		field: "TOTAL_WEIGHT",
		title: HEADER_WGT_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title: HEADER_WGT_TOTAL_TOOLTIP
      	  }
	}, {
		field: "TOTAL_PIECES",
		title: HEADER_PIECES_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_PIECES_TOTAL_TOOLTIP
      	  }
	}, {
		field: "TOTAL_CUBE",
		title: HEADER_CB_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_TOTAL_TOOLTIP
      	  }
	}]);
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
	
	return matrixCols;
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
	
	return addProductGroupsSchema(gridFields, true);
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