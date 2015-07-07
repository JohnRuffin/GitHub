/**
 * 
 */
var selectedPreviousFacilityType;
var selectedPrimaryFacilityType;
var selectedNextFacilityType;
var enableLogs = true; // enable logging to console
var severityLevel = 0; // EventInfoLevel = 0; Info =1; debug=2; warn = 3;
						// error=4;
var DATA_SERVLET_URL = "dataServlet/DataRendererServlet";
var PARAM_DATA_TYPE = "&datatype=";
var PARAM_QUERY_TYPE = "&query=";
var MASTER_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.MasterServiceDataRenderer"+PARAM_DATA_TYPE;
var NETWORK_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.NetworkLaneMatrixRenderer";

var FULL_ROUTING_NETWORK_MATRIX_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.FullRoutingMatrixRenderer";

var SCHEDULE_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleMatrixRenderer";

var SCHEDULE_ALLOC_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleAllocationMatrixRenderer";

var VOLUME_UTILIZATION_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleVolUtilizationMatrixRenderer";

var VOLUME_IBOB_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleIBOBMatrixRenderer";

var SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer"+PARAM_DATA_TYPE;
var NETWORK_SCHEMATIC_LANE_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.NetworkActionPopUpMatrixRenderer";
var SCHEDULER_SCHEMATIC_LEG_RENDERER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.SchedulerActionPopUpMatrixRenderer";

var SYS_SETTING_RENDER_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.SystemSettingRenderer";
var DAYS_RENDER_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.DaysRenderer";

var MODE_ANALYSIS_SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ModeAnalysisDataRenderer"+PARAM_DATA_TYPE;
var AVAILABLE_ROUTES_SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.AvailableRouteNumberRenderer"+PARAM_DATA_TYPE;
var SCHEDULE_ROUTE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleRouteDataRenderer"+PARAM_DATA_TYPE;

var SCHEDULE_LEGTYPE_RENDERER_URL=DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.LegTypeListRenderer";
var SCHEDULE_EQUIPMENTTYPE_RENDERER_URL=DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.EquipmentTypeListRenderer";
var ROUTE_SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.UpdateServiceDataRenderer";
var ROUTE_TIMECOST_SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleServiceTimeAndCostRenderer";
var ROUTE_SCHEDULE_VALIDATION_SERVICE_DATA_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ScheduleValidationServiceRenderer"+PARAM_DATA_TYPE;

var CLONE_PEGASUS_URL = "clonePegasus.do";
var PEGASUS_AJAX_URL = "pegasusAjaxAction.do?operation=";

var COMMON_SERVICE_RENDERER = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.CommonServiceDataRenderer";

//BAD Gate Way error - proxy
var SERVICE_RESPOSNE_STATUS_RENDER_URL = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.ServiceResposeLoadStatusRenderer";
var RESPOSNE_LOADING = "LOADING";
var RESPOSNE_LOADED = "LOADED";
var RESPOSNE_ERROR = "ERROR";

var DATA_TYPE_PRODUCTS = "PRODUCT_LIST";
var DATA_TYPE_PRODUCTGROUPS = "PRODUCTGROUP_LIST";
var DATA_TYPE_FACILITY_LOCS_BY_COUNTRY_CODE = "FACILITY_LOCS_BY_COUNTRY_CODE";
var DATA_TYPE_ACTIVITIES = "ACTIVITY_LIST";
var DATA_TYPE_ACTIVITIES_DETAIL = "ACTIVITIES_DETAIL_LIST";
var DATA_TYPE_LOCATIONS = "FACILITY_LIST";
var DATA_TYPE_FACILITIES = "FACILITIES";
var DATA_TYPE_FACILITIES_WITH_GLOBALRGN = "FACILITIES_WITH_GLOBALRGN";
var DATA_TYPE_ACTIVITY_FACILITY = "ACTIVITY_FACILITY_LIST";
var DATA_TYPE_SQW_ACTIVITY_FACILITY = "SQW_ACTIVITY_FACILITY_LIST";
var DATA_TYPE_SQW_ACTIVITIES_DETAIL = "SQW_ACTIVITY_DETAILS_LIST";
var DATA_TYPE_FACILITIESGROUPS = "FACILITYGROUP_LIST";
var DATA_TYPE_LOCATIONS_BY_FACILITIESGROUP = "LOCATIONS_BY_FACILITYGROUP_LIST";
var DATA_TYPE_GLOBALREGION = "GLOBALREGION_LIST";
var DATA_TYPE_ZONESLIST = "ZONES_LIST";
var DATA_TYPE_COUNTRYCODES = "COUNTRYCODE_LIST";
var DATA_TYPE_EQUIPMENTTYPES = "EQUIPMENTTYPE_LIST";
var DATA_TYPE_LEGTYPES = "LEGTYPE_LIST";
var DATA_TYPE_ROUTEFLIGHTS = "ROUTES_FLIGHT";
var DATA_TYPE_ROUTETRUCKS = "ROUTES_TRUCK";

var DATA_LEG_DESC="legTypeDesc";
var DATA_LEG_TYPE="legTypeCd";

var LOCAL_ZULU_FLAG = "L";
var PATH_TYPE = "L";
var INITIALIZING_STR = "Initializing...";

var PARAM_ACTION_TYPE = "&actionType=";
var BROWSER_SERVLET_URl = DATA_SERVLET_URL+"?renderertype=com.spacetimeinsight.fedex.renderer.BrowserSessionHelper"+PARAM_ACTION_TYPE;

function getBrowserRendererUrl(actionType){
	return BROWSER_SERVLET_URl+actionType;
}

var ICON_IMAGE_PATH_CLOSE="pegasus/assets/icons/delete_row.png";
var ICON_IMAGE_PATH_CLOSE_DISABLE="pegasus/assets/icons/delete_row_gray.png";
var ICON_IMAGE_PATH_ADD="pegasus/assets/icons/add_row.png";
var ICON_IMAGE_PATH_ADD_DISABLE="pegasus/assets/icons/add_row_gray.png";
var ICON_IMAGE_PATH_DAYS="pegasus/assets/icons/table-calendar-icon.png";
var ICON_IMAGE_ARROW="pegasus/assets/icons/pop-up-list.png";
var ICON_IMAGE_PATH_NEARBY="pegasus/assets/icons/add-nearby.png";
var IOCN_IMAGE_PATH_COMMENT="pegasus/assets/icons/comment_icon.png";
var IOCN_IMAGE_CLOSE="pegasus/assets/icons/close.png";
var ICON_IMAGE_PATH_ROUTE="pegasus/assets/icons/routesearch.png";
var ICON_IMAGE_PATH_DUPLICATE = "pegasus/assets/edit/Duplicate.png";
var ICON_IMAGE_CLOSE_WINDOW="pegasus/assets/icons/close_window.png";
var ICON_IMAGE_UNDELETE_ROUTE="pegasus/assets/edit/undelete.png";
//duplciate enhancements
var ICON_IMAGE_PATH_DUPLICATE_FROM = "pegasus/assets/edit/Duplicate_From.png";
var ICON_IMAGE_PATH_DUPLICATE_TO = "pegasus/assets/edit/Duplicate_To.png";
//filter windows constants 
var WINDOW_WIDTH = "465px";

var WINDOW_HEADER_GERNRAL="General";
var WINDOW_HEADER_PREVIOUS="From";
var WINDOW_HEADER_PRIMARY="Through";
var WINDOW_HEADER_NEXT="To";

var WINDOW_HEADER_ROUTES="Routes";
var WINDOW_HEADER_ORG_AND_DEST="Origins and Destinations";
var WINDOW_HEADER_DEPT_ARR_ACT="Departure, Arrival, and Active Times";
var WINDOW_HEADER_TYPES="Types";
var WINDOW_HEADER_MODE="Modes";


var FILTER_TYPE_STARTS_WITH="startswith";
var PLACEHOLDER_SELECT="Select";
var CONSTANTS_DIV="Div";
var EMPTY_STRING="";
var COMMA_STRING=",";
var HASH_STRING="#";
var SPACE_STRING_CD="&nbsp;";
var FILTER_NETWORK_TAB="Network";
//grid constants
var LOCCD="locCd";
var ACTYCD="ACTYCD";
var COUNTRYCODE="countryCode";
var GROUPNAME="groupName";
var GLOBALRGNDESC="globalRgnDesc";
var GLOBALRGNCD="globalRgnCd";

var PRODOFFSET="prodOffset";
var PRODNAME="productName";
var PRODDESC="productDesc";

var PRODGROUPMASKID="prodMaskId";
var PRODGROUPNAME="prodGrpName";
var PRODGROUPDESC="prodGrpDesc";

var EQTYPE="eqType";
var EQTYPEDESC="eqTypeDesc";
var LEGTYPECD="legTypeCd";
var LEGTYPEDESC="legTypeDesc";
                     
var TEMPLETE_LOCCD="#:locCd#";
var TEMPLETE_ACTYCD="#:ACTYCD#";
var TEMPLETE_CITY="#:city#";
var TEMPLETE_COUNTRYCODE="#:countryCode#";
var TEMPLETE_COUNTRYDESC="#:countryDesc#";
var TEMPLETE_GROUPNAME="#:groupName#";
var TEMPLETE_GRPDESC="#:grpDesc#";
var TEMPLETE_GLOBALRGNDESC="#:globalRgnDesc#";
var TEMPLETE_GLOBALRGNCD="#:globalRgnCd#";
var TEMPLETE_HYPHEN=" - ";
var TEMPLATE_PRODUCTS = "<span style='white-space: nowrap;width:auto;'> #:"+PRODNAME+"# - #:"+PRODDESC+"#"+"</span>";
var TEMPLATE_PRODUCTGROUPS = "<span style='white-space: nowrap;width:auto;'> #:"+PRODGROUPNAME+"# - #:"+PRODGROUPDESC+"#"+"</span>";

var TEMPLATE_EQUIPMENTS = "<span style='white-space: nowrap;width:auto;'> #:"+EQTYPE+"# - #:"+EQTYPEDESC+"#"+"</span>";
var TEMPLATE_LEGS = "<span style='white-space: nowrap;width:auto;'> #:"+LEGTYPECD+"# - #:"+LEGTYPEDESC+"#"+"</span>";
var TEMPLATE_LOCATIONS="<span style='white-space: nowrap;width:auto;'>"+ TEMPLETE_LOCCD +TEMPLETE_HYPHEN+ TEMPLETE_CITY +"</span>";
var TEMPLATE_COUNTRYCODE="<span style='white-space: nowrap;width:auto;'> "+TEMPLETE_COUNTRYCODE +TEMPLETE_HYPHEN+TEMPLETE_COUNTRYDESC +"</span>";
var TEMPLATE_FACGROUP="<span style='white-space: nowrap;width:auto;'> "+ TEMPLETE_GROUPNAME +TEMPLETE_HYPHEN+ TEMPLETE_GRPDESC +"</span>";
var TEMPLATE_GLOBALRGN="<span> "+TEMPLETE_GLOBALRGNCD+TEMPLETE_HYPHEN+ TEMPLETE_GLOBALRGNDESC +"</span>";
var SPAN_STARTING_TAG="<span>";
var SPAN_ENDING_TAG="</span>";
var LABEL="label";
var VALUE="value";

var TITLE_LOCS="Location";
var TITLE_ACTIVITY="Activity";
var TITLE_DAY="Day";
var TITLE_DAYS="Day(s)";
var TITLE_TRANSITS="Transits";
var TITLE_TYPE="Type";

var TITLE_SM="SM";
var TITLE_MM="MM";
var HEADER_LABEL_LOCS="Select a location.";
var HEADER_LABEL_LOCS_PRI="Select a location. To limit selection list, press Ctrl-L for Locations, Ctrl-G for Facilities";
var HEADER_LABEL_ACTIVITIES ="Select an activity";
var HEADER_LABEL_DAYS ="Enter a plan day";
var HEADER_LABEL_TRANSIT="Select one or more transits";
var HEADER_LABEL_TYPE="Select a type";
var HEADER_LABEL_SM="Select a Suggested Mode";
var HEADER_LABEL_MM="Select a Mandatory Mode";
var NETWORK_MATRIX_QRY = "select * from NW_LANE_DETAILS";

var OPT_TYPE_CREATE="Create";
var OPT_TYPE_UPDATE="Update";
var OPT_TYPE_DELETE="Delete";
var DEFAULT_STRING=" (default)";
var ToolTip_Viewer_NoDirection="Direction is not available";

var Tooltip_Map_Switch_To_Schedule="Switch to schedule overlay view";
var Tooltip_Map_Switch_To_Network="Switch to network view";
var ToolTip_Viewer_Inbound="Shows inbound. Click to change to outbound";
var ToolTip_Viewer_Outbound="Shows outbound. Click to change both directions";
var ToolTip_Viewer_Both="Shows both directions. Click to change to inbound";
var ToolTip_Viewer_NoData="Switch to Schedule Overlay View. Icon enabled once data becomes available.";
var ToolTip_Viewer_NoNetworkView="Network View is not available";
var EXPORT_TO_EXCEL_PREFIX = "data:application/vnd.ms-excel,";
var Icon_Schedule_Overlay="k-icon icon-schedule-overlay-view";
var Icon_Schedule_Overlay_Disabled="k-icon icon-schedule-overlay-view-disable";
var Icon_Network_Overlay="k-icon icon-network-view";
var Icon_Inbound_View="k-icon icon-inbound-view";
var Icon_Outbound_View="k-icon icon-outbound-view";
var Icon_Both_View="k-icon icon-both-view";
var ToolTip_Viewer_Both_Disabled="k-icon icon-both-view-disable";
var ToolTip_Viewer_Inbound_Disabled="k-icon icon-inbound-view-disable";
var ToolTip_Viewer_Outbound_Disabled="k-icon icon-outbound-view-disable";
var NOT_ENOUGH_DAYS_IN_PLAN_ERROR="There are not that many days in the Plan month or you have entered an invalid character";
var TIME_LESS_THAN_2359_ERROR="Please enter a time of 2359 or less";


var gridFilterTypeConstants = {
	    FILTER_TYPE_STRING: "string",
	    FILTER_TYPE_NUMBER: "number",
	    FILTER_TYPE_DATE: "date",
	    FILTER_TYPE_BOOLEAN: "boolean",
	    FILTER_TYPE_NONE: "none",
	    FILTER_TYPE_DESCRIPTION: "description",
	    FILTER_TYPE_TIME: "time"
	};

function getNetworkMatrixQry(){
	return getNetworkMatrixUrl(NETWORK_MATRIX_QRY);
}

function getNetworkMatrixUrl(query){
	//NETWORK_RENDERER_URL
	return getNetworkOrFullRoutingUrl(PARAM_QUERY_TYPE+query);
}

function getMatrixUrl(){
	return getNetworkOrFullRoutingUrl();
}

function getNetworkOrFullRoutingUrl(uri){
	if(parent.VIEWER.getIsFullRouting()){
		return FULL_ROUTING_NETWORK_MATRIX_RENDERER_URL+(uri!=undefined?uri:"");
	}else {
		return NETWORK_RENDERER_URL+(uri!=undefined?uri:"");
	}
}

function getScheduleMatrixUrl(){  
	return SCHEDULE_RENDERER_URL+"&rand="+getTime();
}
function getScheduleLegTypeUrl(){
	return SCHEDULE_LEGTYPE_RENDERER_URL+"&rand="+getTime();
}
function getScheduleEquipmentTypeSearchCriteriaTypeUrl(){
	return SCHEDULE_EQUIPMENTTYPE_RENDERER_URL+"&rand="+getTime();
}
function getScheduleAllocationMatrixUrl(){  
	return SCHEDULE_ALLOC_RENDERER_URL+"&rand="+getTime();
}

function getVolumeUtilizationMatrixUrl(){  
	return VOLUME_UTILIZATION_RENDERER_URL+"&rand="+getTime();
}
function getVolumeIBOBMatrixUrl(){  
	return VOLUME_IBOB_RENDERER_URL+"&rand="+getTime();
}
function getNetworkSchematicLaneDetailUrl() {
	return NETWORK_SCHEMATIC_LANE_RENDERER_URL+"&rand="+getTime();
}
function getSchedulerSchematicLegDetailUrl() {
	return SCHEDULER_SCHEMATIC_LEG_RENDERER_URL+"&rand="+getTime();
}
function getSelectedFacilityType(gridId){
	if(gridId == "preActivitiesGrid"){
		return selectedPreviousFacilityType; 
	} else if (gridId == "priActivitiesGrid") {
		return selectedPrimaryFacilityType; 
	} else if (gridId == "nxtActivitiesGrid") {
		return selectedNextFacilityType; 
	}
	return selectedPreviousFacilityType;  
}
function setSelectedFacilityType(facilityType, gridId){
	if(gridId == "preActivitiesGrid"){
		this.selectedPreviousFacilityType = facilityType;
	} else if (gridId == "priActivitiesGrid") {
		this.selectedPrimaryFacilityType = facilityType;
	} else if (gridId == "nxtActivitiesGrid") {
		this.selectedNextFacilityType = facilityType;
	}	
}