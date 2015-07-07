/**
 * @author 888600 Abhishek Sharma
 * This utils script belongs to all matrices.
 * This is the utility script which has common methods for all the matrix.
 */
var DEFAULT_MATRIX_HEIGHT = 200;
var matrixID;
var dashboardID;
var renderEmpty = true;
//network matrixes
var direction = "I";
var isSyncMap = false;
var isSyncSchematic = false;
var syncSearchCriteria;
var isSyncOn = false;
var dayWhereClause = "";
var isClearOn = false;
var isEditRouteEnabled = false; 
var totalContainers = 0;
var matrixData;
var matrixIsLoading = {};
var favColumns;
var favGroup;
var favFilter;
var favSort;
var applyFavoriteSettings = true;
var favPreferences;
var currentSorts;
var isGrouping = false;
var POUND_TO_KG_VALUE = 0.453592;
var MILES_TO_KM_VALUE = 1.60934;

var HEADER_D1 = "M";
var HEADER_D2 = "T";
var HEADER_D3 = "W";
var HEADER_D4 = "T";
var HEADER_D5 = "F";
var HEADER_D6 = "S";
var HEADER_D7 = "S";
var HEADER_W1 = "W1";
var HEADER_W2 = "W2";
var HEADER_W3 = "W3";
var HEADER_W4 = "W4";
var HEADER_W5 = "W5";
var HEADER_LOCAL_SUFFIX = " (L)";
var HEADER_ZULU_SUFFIX = " (Z)";

var HEADER_EFF_DAYS_L_TOOLTIP = "Effective days - Local time";
var HEADER_EFF_WEEKS_L_TOOLTIP = "Effective weeks - Local time";
var HEADER_EFF_DAYS_Z_TOOLTIP = "Effective days - Zulu time";
var HEADER_EFF_WEEKS_Z_TOOLTIP = "Effective weeks - Zulu time";

var HEADER_LEG_EFF_WEEKS_L_TOOLTIP = "Leg Effective weeks - Local time";
var HEADER_LEG_EFF_WEEKS_Z_TOOLTIP = "Leg Effective weeks - Zulu time";
var HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP = "Route Effective weeks - Local time";
var HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP = "Route Effective weeks - Zulu time";

/** Labels for Network Matrix */
var HEADER_LANE = "Lane";
var HEADER_LANE_TOOLTIP = "Lane direction";
var HEADER_ORG_ACT = "Orig Act";
var HEADER_ORG_ACT_TOOLTIP = "Origin activity";
var HEADER_AVAIL_TIME_L = "Avail Time (L)";
var HEADER_AVAIL_TIME_L_TOOLTIP = "Available time - Local";
var HEADER_AVAIL_TIME_Z = "Avail Time (Z)";
var HEADER_AVAIL_TIME_Z_TOOLTIP = "Available time - Zulu";

var All_Weight_Columns_Label = 'All Weight Columns';
var All_Pieces_Columns_Label = 'All Pieces Columns';
var All_Cube_Columns_Label = 'All Cube Columns';
var All_Zulu_Columns_Label = 'All Zulu';
var All_Local_Columns_Label = 'All Local';

var Product_Grp_Item_Wt = 'Product Grp Item Wt';
var Product_Grp_Item_Cu = 'Product Grp Item Cu';
var Product_Grp_Item_Pcs = 'Product Grp Itm Pcs';

var HEADER_ODY = "Orig Day (L)";
var HEADER_ODY_TOOLTIP = "Origin day";
var HEADER_ODY_L = "Orig Day (L)";
var HEADER_ODY_L_TOOLTIP = "Origin Day";
var HEADER_ODY_Z = "Org Day(Z)";
var HEADER_ODY_Z_TOOLTIP = "Origin Day";
var HEADER_DL = "Dl";
var HEADER_DL_TOOLTIP = "Delay Day";
var HEADER_RD_Z = "Mid night crossed (Z)";
var HEADER_RD_Z_TOOLTIP = "Mid night crossed (Z)";
var HEADER_RD_L = "Mid night crossed (L)";
var HEADER_RD_L_TOOLTIP = "Mid night crossed (L)";
var HEADER_SM = "SM";
var HEADER_SM_TOOLTIP = "Suggested mode";
var HEADER_MM = "MM";
var HEADER_MM_TOOLTIP = "Mandatory mode";
var HEADER_TRANSITS = "Trnst";
var HEADER_TRANSITS_TOOLTIP = "Transits";
var HEADER_ADY_L = "Arriv Day (L)";
var HEADER_ADY_L_TOOLTIP = "Arrival day - Local";
var HEADER_ADY_Z = "Arriv Day (Z)";
var HEADER_ADY_Z_TOOLTIP = "Arrival day - Zulu";
var HEADER_DUE_TIME_L = "Due Time (L)";
var HEADER_DUE_TIME_L_TOOLTIP = "Due Time - Local";
var HEADER_DUE_TIME_Z = "Due Time (Z)";
var HEADER_DUE_TIME_Z_TOOLTIP = "Due Time - Zulu";
var HEADER_DEST_ACT = "Dest Act";
var HEADER_DEST_ACT_TOOLTIP = "Destination activity";
var HEADER_LANE_STATUS = "Lane Status";
var HEADER_LANE_STATUS_TOOLTIP = "Lane status";
var HEADER_PRODS = "Products";
var HEADER_PRODS_TOOLTIP = "Products";
var HEADER_ODPD_COUNT = "ODPD Cnt";
var HEADER_ODPD_COUNT_TOOLTIP = "ODPD Count";
var HEADER_PIECES_TOTAL = "Ttl Pcs";
var HEADER_PIECES_TOTAL_TOOLTIP = "Total Pieces";

/** Labels for Schedule Matrix */
var HEADER_ROUTE_NO = "Mv No";
var HEADER_ROUTE_NO_TOOLTIP = "Movement number";
var HEADER_EQ = "Eq";
var HEADER_EQ_TOOLTIP = "Equipment code";
var HEADER_DAYS_LOCAL = "Days(L)";
var HEADER_DAYS_ZULU = "Days(Z)";
var HEADER_LOCAL_WEEK = "Weeks(L)";
var HEADER_ZULU_WEEK = "Weeks(Z)";
var HEADER_ORIG = "Orig Loc";
var HEADER_ORIG_TOOLTIP = "Origin location";
var HEADER_DES = "Dest Loc";
var HEADER_DES_TOOLTIP = "Destination location";
var HEADER_ARR_NXT_DAY_L = "Arrive NxtDay(L)";
var HEADER_ARR_NXT_DAY_Z = "Arrive NxtDay(Z)";
var HEADER_LOCAL_DEP = "Dept (L)";
var HEADER_LOCAL_DEP_TOOLTIP = "Block out time";
var HEADER_LOCAL_ARR = "Arriv (L)";
var HEADER_LOCAL_ARR_TOOLTIP = "Block in time";
var HEADER_ZULU_DEP = "Dept (Z)";
var HEADER_ZULU_DEP_TOOLTIP = "Departure time - Zulu";
var HEADER_LOCAL_DEP_SCH_TOOLTIP = "Departure time - Local";
var HEADER_ZULU_ARR = "Arriv (Z)";
var HEADER_ZULU_ARR_TOOLTIP = "Arrival time - Zulu";
var HEADER_ZULU_ARR_SCH_TOOLTIP = "Arrival time - Local";
var HEADER_FLIGHT = "Transit (hhmm)";
var HEADER_FLIGHT_TOOLTIP = "Amount of time in transit";
var HEADER_FLIGHT_HST_CD = "Flt Hist Code";
var HEADER_FLIGHT_HST_CD_TOOLTIP = "Flight history code";
var HEADER_BLOCK = "Block";
var HEADER_BLOCK_TOOLTIP = "Amount of time on the ground and in transit";
var HEADER_BLOCK_SCH = "Block (hhmm)";
var HEADER_BLOCK_SCH_TOOLTIP = "Amount of time on the ground and in transit";
var HEADER_SCHEDULE_ORG = "Orig";
var HEADER_SCHEDULE_ORG_TOOLTIP = "Origin";
var HEADER_SCHEDULE_DEST = "Dest";
var HEADER_SCHEDULE_DEST_TOOLTIP = "Destination";
var HEADER_TAXIOUT_CD = "Txi Out Code";
var HEADER_TAXIOUT_CD_TOOLTIP = "Taxi-out code";
var HEADER_TAXIIN_CD = "Txi In Code";
var HEADER_TAXIIN_CD_TOOLTIP = "Taxi-in code";
var HEADER_GRND_TIME = "Grnd (hhmm)";
var HEADER_GRND_TIME_TOOLTIP = "Amount of time on the ground";
var HEADER_TTL_FREQ = "Ttl Freq";
var HEADER_TTL = "Freq ";
var HEADER_TTL_1 = "Freq M (L)";
var HEADER_TTL_2 = "Freq T (L)";
var HEADER_TTL_3 = "Freq W (L)";
var HEADER_TTL_4 = "Freq T (L)";
var HEADER_TTL_5 = "Freq F (L)";
var HEADER_TTL_6 = "Freq S (L)";
var HEADER_TTL_7 = "Freq S (L)";
var HEADER_TTLZ_1 = "Freq M (Z)";
var HEADER_TTLZ_2 = "Freq T (Z)";
var HEADER_TTLZ_3 = "Freq W (Z)";
var HEADER_TTLZ_4 = "Freq T (Z)";
var HEADER_TTLZ_5 = "Freq F (Z)";
var HEADER_TTLZ_6 = "Freq S (Z)";
var HEADER_TTLZ_7 = "Freq S (Z)";
var HEADER_FREQ = "Freq Wk";
var HEADER_FREQ_TOOLTIP = "Frequency by week";
var HEADER_TTL_TOOLTIP = "Frequency by day of week";
var HEADER_FLIGHT_COUNT = "Ttl Freq";
var HEADER_FLIGHT_COUNT_TOOLTIP = "Total frequency";
var HEADER_S = "S";
var HEADER_S_TOOLTIP = "Sequence";
var HEADER_IATA_DESC = "IATA Desc";
var HEADER_IATA__DESC_TOOLTIP = "IATA equipment type";
var HEADER_MODE = "Mode";
var HEADER_MODE_TOOLTIP = "Mode used for this leg";
var HEADER_LEG_TYPE = "T";
var HEADER_LEG_TYPE_TOOLTIP = "Leg Type";
var HEADER_ROUTE_EFFDT = "Route EffDate";
var HEADER_LEG_EFFDT = "Leg EffDate";
var HEADER_CAL_BTN = "Cal";
var HEADER_NO_OPS_L = "No Op Days (L)";
var HEADER_NO_OPS_Z = "No Op Days (Z)";
var HEADER_LEG_NO_OPS_L = "Leg No Op Days (L)";
var HEADER_LEG_NO_OPS_Z = "Leg No Op Days (Z)";
var HEADER_ROUTE_NO_OPS_L = "Route No Op Days (L)";
var HEADER_ROUTE_NO_OPS_Z = "Route No Op Days (Z)";
var HEADER_NO_OPS_TOOLTIP = "Days of non-operation";
var HEADER_CARRIER = "Carrier";
var HEADER_TAXIOUT_MIN_L = "Txi Out (hhmm)";
var HEADER_TAXIOUT_MIN_L_TOOLTIP = "Amount of time it takes to taxi out";
var HEADER_TAXIOUT_MIN_Z = "Txi Out (hhmm)";
var HEADER_TAXIOUT_MIN_Z_TOOLTIP = "Amount of time it takes a plane to taxi out";
var HEADER_OFF_L = "Off (L)";
var HEADER_OFF_L_TOOLTIP = "The time the wheels leave the ground";
var HEADER_OFF_Z = "Off (Z)";
var HEADER_OFF_Z_TOOLTIP = "The time the wheels hit the ground";
var HEADER_BLK_HHMM_L = "Block(hhmm)";
var HEADER_BLK_HHMM_L_TOOLTIP = "Total time on the ground and in transit";
var HEADER_BLK_HHMM_Z = "Blk Time(Z)";
var HEADER_BLK_HHMM_Z_TOOLTIP = "Total time on the ground and in transit";
var HEADER_TRANSIT_HHMM = "Trnst Time";
var HEADER_TRANSIT_HHMM_TOOLTIP = "Total transit time";
var HEADER_LAND_TIME_L = "On (L)";
var HEADER_LAND_TIME_Z = "On (Z)";
var HEADER_LAND_TIME_TOOLTIP = "The time the wheels hit the ground";
var HEADER_TAXIIN_MIN_L = "Txi In (hhmm)";
var HEADER_TAXIIN_MIN_L_TOOLTIP = "Amount of time it takes to taxi in";
var HEADER_TAXIIN_MIN_Z = "Txi In (hhmm)";
var HEADER_TAXIIN_MIN_Z_TOOLTIP = "Amount of time it takes the plane to taxi in";
var HEADER_LEG_MILES = "Leg Miles";
var HEADER_LEG_MILES_TOOLTIP = "Number of miles in the leg";
var HEADER_LEG_KMS = "Leg Kms";
var HEADER_LEG_KMS_TOOLTIP = "Number of kilometers in the leg";
var HEADER_OPERATING_COST = "Ops Cost";
var HEADER_OPERATING_COST_TOOLTIP = "Operating Cost";
var HEADER_RTE_HOL_DAYS_L = "Hol Eff Days (L)";
var HEADER_RTE_HOL_DAYS_L_TOOLTIP = "Holiday Effective days - Local";
var HEADER_RTE_HOL_DAYS_Z = "Hol Eff Days (Z)";
var HEADER_RTE_HOL_DAYS_Z_TOOLTIP = "Holiday Effective days - Zulu";

var HEADER_LEG_HOL_DAYS_L = "Leg Hol Eff Days (L)";
var HEADER_LEG_HOL_DAYS_L_TOOLTIP = "Leg Holiday Effective days - Local";
var HEADER_LEG_HOL_DAYS_Z = "Leg Hol Eff Days (Z)";
var HEADER_LEG_HOL_DAYS_Z_TOOLTIP = "Leg Holiday Effective days - Zulu";
var HEADER_ROUTE_HOL_DAYS_L = "Route Hol Eff Days (L)";
var HEADER_ROUTE_HOL_DAYS_L_TOOLTIP = "Route Holiday Effective days - Local";
var HEADER_ROUTE_HOL_DAYS_Z = "Route Hol Eff Days (Z)";
var HEADER_ROUTE_HOL_DAYS_Z_TOOLTIP = "Route Holiday Effective days - Zulu";

var HEADER_SCAC_CD = "SCAC Code";
var HEADER_SCAC_CD_TOOLTIP = "Contract carrier company";
var HEADER_IATA_MV_NBR = "IATA Mv No";
var HEADER_IATA_MV_NBR_TOOLTIP = "IATA movement number";
var HEADER_IN_DST = "In Dst";
var HEADER_IN_DST_TOOLTIP = "Route affected by Daylight Savings Time";
var HEADER_TEMP_RT = "Temp Rte";
var HEADER_TEMP_RT_TOOLTIP = "Temporary truck route";
var HEADER_BAL_MV_NBR = "Bal Mv No";
var HEADER_BAL_MV_NBR_TOOLTIP = "Return route for equipment balancing";
var HEADER_LAST_UPDT_TIME = "Last Chg Date";
var HEADER_LAST_UPDT_TIME_TOOLTIP = "Time last change was made to the schedule";
var HEADER_CHANGE_FLAG = "Last Chg Type";
var HEADER_CHANGE_FLAG_TOOLTIP = "Type of change made to schedule: (I)nserdt, (M)odified, (D)eleted";
var HEADER_MPH = "MPH";
var HEADER_MPH_TOOLTIP = "Miles per hour by leg";
var HEADER_OWNER_LOC_CD = "Owner Loc Code";
var HEADER_OWNER_LOC_CD_TOOLTIP = "Owner location code";
var HEADER_GLOBAL_RGN_CD = "Global Region";
var HEADER_GLOBAL_RGN_CD_TOOLTIP = "Global region code";
var HEADER_ALLOC_FLAG = "Allocs";
var HEADER_ALLOC_FLAG_TOOLTIP = "Indicates whether leg has allocations";
var HEADER_REASON_CD = "Reason Code";
var HEADER_REASON_CD_TOOLTIP = "Code that identifies why a route is needed";

var HEADER_LAST_CHG_USER = "Last Chg User";
var HEADER_LAST_CHG_USER_TOOLTIP = "Last updated user";
var HEADER_COMMENTS = "Comments";
var HEADER_COMMENTS_TOOLTIP = "Route Comments";


var HEADER_CARRIER_STG_TM = "Carrier Pre Stage HHMM";
var HEADER_CARRIER_STG_TM_TOOLTIP = "Carrier Pre Stage HHMM";
var HEADER_DAILY_RT_CC_CHG = "Daily Rate + CC Chg";
var HEADER_DAILY_RT_CC_CHG_TOOLTIP = "Daily Rate + CC Chg";
var HEADER_TOTAL_MTH_CST = "Total Cost for Month";
var HEADER_TOTAL_MTH_CST_TOOLTIP = "Total Cost for Month";
var HEADER_TRACK_EQUIP_TYPE = "Tractor Type";
var HEADER_TRACK_EQUIP_TYPE_TOOLTIP = "Tractor Type";
var HEADER_TRACK_PERSTAGE_TM = "Tractor Pre Stage HHMM";
var HEADER_TRACK_PERSTAGE_TM_TOOLTIP = "Tractor Pre Stage HHMM";
var HEADER_TRACK_STAGE_TM = "Tractor Post Stage HHMM";
var HEADER_TRACK_STAGE_TM_TOOLTIP = "Tractor Post Stage HHMM";
var HEADER_TRAIL_OPT = "Trailer Option";
var HEADER_TRAIL_OPT_TOOLTIP = "Trailer Option";
var HEADER_TRAIL_1PRESTAGE_TM = "Trailer 1 Pre Stage HHMM";
var HEADER_TRAIL_1PRESTAGE_TM_TOOLTIP = "Trailer 1 Pre Stage HHMM";
var HEADER_TRAIL_1STAGE_TM = "Trailer 1 Post Stage HHMM";
var HEADER_TRAIL_1STAGE_TM_TOOLTIP = "Trailer 1 Post Stage HHMM";
var HEADER_TRAIL_2PRESTAGE_TM = "Trailer 2 Pre Stage HHMM";
var HEADER_TRAIL_2PRESTAGE_TM_TOOLTIP = "Trailer 2 Pre Stage HHMM";
var HEADER_TRAIL_2STAGE_TM = "Trailer 2 Post Stage HHMM";
var HEADER_TRAIL_2STAGE_TM_TOOLTIP = "Trailer 2 Post Stage HHMM";
var HEADER_UNLOAD_TM = "Unload Min";
var HEADER_UNLOAD_TM_TOOLTIP = "Unload Min";
var HEADER_LOAD_TM = "Load Min";
var HEADER_LOAD_TM_TOOLTIP = "Load Min";
var HEADER_TRAIL_AVAIL_TM = "Trailer Avl Unload HHMM";
var HEADER_TRAIL_AVAIL_TM_TOOLTIP = "Trailer Avl Unload HHMM";

/** Labels for Allocation Matrix */
var HEADER_EFF_DAYS_L = "Eff days (L)";
var HEADER_EFF_DAYS_L_TOOLTIP = "Effective days - Local";
var HEADER_EFF_DAYS_Z = "Eff Days(Z)";
var HEADER_EFF_DAYS_Z_TOOLTIP = "Effective days - Zulu";
var HEADER_LEG_EFF_DAYS_L = "Leg Eff days (L)";
var HEADER_LEG_EFF_DAYS_L_TOOLTIP = "Leg Effective days - Local";
var HEADER_LEG_EFF_DAYS_Z = "Leg Eff Days(Z)";
var HEADER_LEG_EFF_DAYS_Z_TOOLTIP = "Leg Effective days - Zulu";
var HEADER_ROUTE_EFF_DAYS_L = "Route Eff days (L)";
var HEADER_ROUTE_EFF_DAYS_L_TOOLTIP = "Route Effective days - Local";
var HEADER_ROUTE_EFF_DAYS_Z = "Route Eff Days(Z)";
var HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP = "Route Effective days - Zulu";

var HEADER_KEY_EFF_DAYS_L = "Keyword Eff Days (L)";
var HEADER_KEY_EFF_DAYS_L_TOOLTIP = "Keyword Effective days - Local";
var HEADER_KEY_EFF_DAYS_Z = "Keyword Eff Days(Z)";
var HEADER_KEY_EFF_DAYS_Z_TOOLTIP = "Keyword Effective days - Zulu";

var HEADER_LEG_KEY_EFF_DAYS_L = "Leg Keyword Eff Days (L)";
var HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP = "Leg Keyword Effective days - Local";
var HEADER_LEG_KEY_EFF_DAYS_Z = "Leg Keyword Eff Days(Z)";
var HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP = "Leg Keyword Effective days - Zulu";
var HEADER_ROUTE_KEY_EFF_DAYS_L = "Route Keyword Eff Days (L)";
var HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP = "Route Keyword Effective days - Local";
var HEADER_ROUTE_KEY_EFF_DAYS_Z = "Route Keyword Eff Days(Z)";
var HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP = "Route Keyword Effective days - Zulu";

var HEADER_WEEK_EFF_DAYS_L = "Leg Weekly Pattern (L)";
var HEADER_WEEK_EFF_DAYS_L_TOOLTIP = "Leg Weekly Pattern (L)";
var HEADER_WEEK_EFF_DAYS_Z = "Leg Weekly Pattern (Z)";
var HEADER_WEEK_EFF_DAYS_Z_TOOLTIP = "Leg Weekly Pattern (Z)";
var HEADER_ROUTE_WEEK_EFF_DAYS_L = "Route Weekly Pattern (L)";
var HEADER_ROUTE_WEEK_EFF_DAYS_L_TOOLTIP = "Route Weekly Pattern (L)";
var HEADER_ROUTE_WEEK_EFF_DAYS_Z = "Route Weekly Pattern (Z)";
var HEADER_ROUTE_WEEK_EFF_DAYS_Z_TOOLTIP = "Route Weekly Pattern (Z)";

var HEADER_EFF_WEEKS_L = "Eff Weeks(L)";
var HEADER_EFF_WEEKS_Z = "Eff Weeks(Z)";
var HEADER_PROD_GRP = "Prod Grp";
var HEADER_PROD_GRP_TOOLTIP = "Product group";
var HEADER_WGT_TOTAL = "Ttl Wt";
var HEADER_WGT_TOTAL_TOOLTIP = "Total Weight";
var HEADER_CB_TOTAL = "Ttl Cu";
var HEADER_CB_TOTAL_TOOLTIP = "Total Cube";
var HEADER_WGT_TOTAL_ALLOWED_TOOLTIP = "Total allowed weight";
var HEADER_CB_TOTAL_ALLOWED_TOOLTIP = "Total allowed cubic volume";
var HEADER_WGT_USED = "Used Wt";
var HEADER_WGT_USED_TOOLTIP = "Weight used";
var HEADER_CB_USED = "Used Cu";
var HEADER_CB_USED_TOOLTIP = "Volume used";
var HEADER_WGT_EX = "Excess Wt";
var HEADER_WGT_EX_TOOLTIP = "Used weight in excess of allowed amount";
var HEADER_WGT_EX_VOL_TOOLTIP = "Amount of Excess weight";
var HEADER_CB_EX = "Excess Cu";
var HEADER_CB_EX_TOOLTIP = "Used volume in excess of allowed amount";
var HEADER_CB_EX_VOL_TOOLTIP = "Amount of Excess volume";
var HEADER_PCS_EX = "Excess Pcs";
var HEADER_PCS_EX_TOOLTIP = "Amount of Excess Pieces";
var HEADER_MAX_PAY_WT = "Max Pld Wt";
var HEADER_MAX_PAY_WT_TOOLTIP = "Maximum payload weight";
var HEADER_MAX_PAY_CU = "Max Pld Cu";
var HEADER_MAX_PAY_CU_TOOLTIP = "Maximum payload volume";
var HEADER_COMMENT = "Comment";

/** Labels for Volume Utilization Matrix */
var HEADER_VOL_DAY = "Vol Day";
var HEADER_VOL_DAY_L = "Vol Day (L)";
var HEADER_VOL_DAY_Z = "Vol Day (Z)";
var HEADER_VOL_DAY_L_TOOLTIP = "Primary activity volume day";
var HEADER_VOL_DAY_Z_TOOLTIP = "Primary activity volume day";
var HEADER_VOL_DAY_TOOLTIP = "Leg effective volume day";
var HEADER_T = "T";
var HEADER_OP_DAYS = "OP Days";
var HEADER_EQ_DESC = "IATA Desc";
var HEADER_EQ_DESC_TOOLTIP = "IATA description";
var HEADER_DEPT_L = "Dept (L)";
var HEADER_DEPT_Z = "Dept (Z)";
var HEADER_ARR_L = "Arriv (L)";
var HEADER_ARR_Z = "Arriv (Z)";
var HEADER_WGT_TOTAL_PER = "Ttl Wt %";
var HEADER_WGT_TOTAL_PER_TOOLTIP = "Percentage of weight utilization";
var HEADER_CU_TOTAL_PER = "Ttl Cu %";
var HEADER_CU_TOTAL_PER_TOOLTIP = "Percentage of volume utilization";
var HEADER_WGT_AVAIL = "Avail Wt";
var HEADER_WGT_AVAIL_TOOLTIP = "Amount of available weight";
var HEADER_CU_AVAIL = "Avail Cu";
var HEADER_CU_AVAIL_TOOLTIP = "Amount of available volume";
var HEADER_WGT_MAX = "Max Nwk Wgt";
var HEADER_CU_MAX = "Max Nwk Cube";

var HEADER_CAL_L_TOOLTIP = "Cal (L)";
var HEADER_CAL_Z_TOOLTIP = "Cal (Z)";
var HEADER_LEG_CAL_L_TOOLTIP = "Leg Cal (L)";
var HEADER_LEG_CAL_Z_TOOLTIP = "Leg Cal (Z)";
var HEADER_ROUTE_CAL_L_TOOLTIP = "Route Cal (L)";
var HEADER_ROUTE_CAL_Z_TOOLTIP = "Route Cal (Z)";

var matrixDisplayOptionsHtml;
var searchCriteria;
var syncSourceDashboardId;
var gridFilterTypeConstants = {
    FILTER_TYPE_STRING: "string",
    FILTER_TYPE_NUMBER: "number",
    FILTER_TYPE_DATE: "date",
    FILTER_TYPE_BOOLEAN: "boolean",
    FILTER_TYPE_NONE: "none",
    FILTER_TYPE_DESCRIPTION: "description",
    FILTER_TYPE_TIME: "time"
};
var selectedIds = [];
var defaults;
var groupByColumnsArr = {};
$(document).ready(function() {
    defaults = flexiciousNmsp.StyleDefaults.defaults;
    flexiciousNmsp.Constants.IMAGE_PATH = WSSO_URL + "/pegasus/portalcss/treegrid/images/";
    defaults.IMAGE_PATH = WSSO_URL + "/pegasus/portalcss/treegrid/images/";

    //we move the sort icon to the left, and no longer need mcs
    defaults.alternatingItemColors = [0xF2F7FA, 0xFFFFFF];
    //variable header height
    defaults.variableHeaderHeight = true;
    //custom colors
    defaults.headerColors = [0xEDECDF, 0xEDECDF];
    //custom colors
    defaults.columnGroupColors = [0xEDECDF, 0xEDECDF];
    //custom colors
    defaults.pagerColors = [0xEDECDF, 0xEDECDF];
    //custom colors
    defaults.footerColors = [0xEDECDF, 0xEDECDF];
    //custom colors
    defaults.alternatingTextColors = [0x475055, 0x475055];
    defaults.verticalGridLineColor = defaults.horizontalGridLineColor = defaults.headerVerticalGridLineColor = defaults.headerHorizontalGridLineColor = 0xC0D2E7;
});


function onBeforeTabSelect(tabName) {
    //do nothing
}

/**
 * Resize matrix
 * Method used to resize the matrix.
 * @param gridId - matrix Id i.e "networkMatrixGrid"
 * @param dashboardId - dashboard Id i.e "networkMatrixTreeGridDiv"
 */

function resizeMatrix(gridId, dashboardId) {
    try {
        // AdvancedDataGrid.rebuild(gridId);
        AdvancedDataGrid.reDrawAdvancedDataGrid(gridId);
        maintainFooterVisibilty(gridId);
    } catch (e) {
        console.log(e.message);
    }
}

/**
 * getter/setter for Matrix ID
 * To get or set matrix ID.
 */

function getMatrixID() {
    return matrixID;
}

function setMatrixID(matrixID) {
    this.matrixID = matrixID;
}

/**
 * getter/setter for Dashboard ID
 * To get or set Dashboard ID.
 */

function getDashboardID() {
    return dashboardID;
}

function setDashboardID(dashboardID) {
    this.dashboardID = dashboardID;
}

/**
 * Ready method
 * Method to call initialize method of selected matrix.
 */
$(window).resize(function() {
    onResize();
});

/**
 * Clear Matrix
 * Method to clear out Matrix.
 * @param isClearAll - Flag to determine if the Sync has to be cleared or not.
 * @param isRefreshMatrix - Flag to determine if the matrix has to be refreshed or not.
 */

function clear(isClearAll, isRefreshMatrix) {
    if (!isClearAll) {
        if (!canApplyClear()) {
            return;
        }
    }

    dayWhereClause = "";
    clearSync(isClearAll);
    renderEmpty = true;
    if (isRefreshMatrix == undefined || isRefreshMatrix) {
        //        var grid = $('#' + getMatrixID()).data("kendoGrid");
        isClearOn = true;
        destroy();
    }
    if (!parent.isRunQuery) {
        enableDisableRefresh(false, null, true);
    }
}

/**
 * Text Length
 * Method to get text length.
 * @param text - Text for which the length has to be computed.
 */

function getTextLength(text) {
    return parent.getTextLength(text);
}

/**
 * Text Length
 * Method to add button bar.
 */

function addButtonsBar() {
    parent.VIEWER.addButtonsBar(getDashboardID(), $("#headerButtonsBar"));
    //initialize the search criteria
    searchCriteria = new SearchCriteria();
    searchCriteria.setCriteria(CRITERIA_BROWSER_SESSION_ID, parent.getBrowserSessionId());
}

/**
 * When day gets selected on day component of any matrix
 * Method to get data for selected days from day component.
 * @param selectedDays - Selected days.
 */

function onDaySelect(selectedDays, dataType) {
    setDayWhereClause(selectedDays);
    refreshMatrix();
}

/**
 * Selected days where clause
 * Method to set selected days where clause to get the data only for those days.
 * @param selectedDays - Selected days.
 */

function setDayWhereClause(selectedDays) {
    if (selectedDays != undefined && selectedDays != "") {
        selectedDays = getDaysArray(selectedDays).toString();
        var whereClause = " DAY in (" + selectedDays + ")";
        dayWhereClause = parent.escapeWhereClause(whereClause);
    } else {
        dayWhereClause = "";
    }
}

/**
 * Reset Dashboard
 * Method to destroy and re-initialize any matrix dashboard.
 * @param isClearOperation - Flag to determine if default favorites has to be applied or it has to be re-initialize.
 */

function resetDashboard(restoreDefaultFavorite, isClearOperation, isRefreshViewer) {
/*if (window.hasOwnProperty("isNetworkScheduleFlag")) {
		isNetworkScheduleFlag = parent.isScheduleForNetworkFlag;
	}*/
    resetColumnGroupings();
    if (!(isClearOperation != undefined && isClearOperation) && (favoriteComponent.defaultfavorite != null)) {
        favoriteComponent.applyDefaultFavorite();
    } else {
        if (favoriteComponent.defaultfavorite != null) {
            initialize(false, favoriteComponent.defaultfavorite);
        } else {
            initialize(false);
        }

        resetSettingsChkBoxes(typeof getMatrixFavId == "function" ? getMatrixFavId()[0] : getMatrixID()[0]);
        setEffectiveSeperateDays();
        populateIdsAndSync();
    }
    // Reset this flag back to off to use the actual matrix renderer URL.
    isClearOn = false;
}

/**
 * Resets Column groupings in the matrix
 */

function resetColumnGroupings() {
    groupByColumns = [];
    groupByColumnsArr = {};
    if (getGroupbarId()) {
        $('#' + getGroupbarId()).html("Drag a column here to group by that column.");
    }
}

/**
* Refresh Dashboard
* Method to refresh matrix.
* @param isReset - Flag to determine if dashboard has to be reset or not.

function refreshMatrix(isReset,restoreDefaultFavorite) {
	if(isReset){
		parent.getDashboardContentWindow(getDashboardID()).resetDashboard(restoreDefaultFavorite);
	} else {
		if(!isSyncOn) {
			setSearchCriteria();
		}
		var grid = $("#"+getMatrixID()).data("kendoGrid");
		grid.dataSource.read();
	}	
}

*/


function refreshMatrix(isReset, restoreDefaultFavorite) {
    if (isReset) {
        parent.getDashboardContentWindow(getDashboardID()).resetDashboard(restoreDefaultFavorite);
    } else {
        if (!isSyncOn) {
            setSearchCriteria();
        }
        totalContainers = 0;
        if (!getMatrixIsLoading(getContainerId()[totalContainers])) {
            setMatrixData(false, 0);
        }
    }
}

/** Method to get matrix data type */

function getDataTypeByMatrixId() {
    var dataType;
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK;
    } else if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_SCHEDULE;
    } else if (dashboardID == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK_SCHEDULE;
    } else {
        dataType = getDataType();
    }

    return dataType;
}

function getTreeGridDataTypeByMatrixId() {
    var dataType;
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK;
    } else if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_SCHEDULE;
    } else if (dashboardID == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK_SCHEDULE;
    } else if (dashboardID == parent.DASHBOARD_ID_ALLOCATION_MATRIX) {
        dataType = parent.DATA_TYPE_LOCATION_ALLOCATION;
    } else if (dashboardID == parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX) {
        dataType = parent.DATA_TYPE_VOLUME_UTILIZATION_TREE_GRID_SCHEDULE;
    } else {
        dataType = getDataType();
    }

    return dataType;
}

/**
 * Dashboard params
 * Method to get datasource parameters.
 */

function getDatasourceParams(isResetData) {
    var params = {};
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();
    
    params.scheduleId = parent.getScheduleId();
    params.isResetCache = isResetData;
    params.direction = direction;
    // If the matrix id is either Network or Volume utilization, get the product group configuration.
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX || dashboardID == parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX) {
        var prodGrps = getProdGroupConfiguration();
        if (prodGrps && prodGrps != "") {
            params.prodGrps = prodGrps;
        }
    }
    //get query window specific parameters ....
    getQueryWindowParams(params);

    // Get the conversion factor for Weight in "Kg" or in "Pounds".
    params.wtConversionFactor = isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1;
    if (renderEmpty) {
        params.renderEmpty = renderEmpty;
        return params;
    }
    // set selected days where clause.
    var dataType = getDataTypeByMatrixId();
    if (dataType != undefined) {
        if (dayWhereClause == undefined || dayWhereClause == "") {
            var firstDay = -1;
            // Taking all available days to make it consistent in all matrices.
            //firstDay = parent.getAvailableDays(dataType);

            if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX) {
                firstDay = parent.getFirstAvailableDay(dataType);
            } else if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
                firstDay = [];
            } else {
                firstDay = parent.getAvailableDays(dataType);
            }

/*if (dashboardID == parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
                firstDay = parent.getAvailableDays(dataType);
            } else {
                firstDay = parent.getFirstAvailableWeek(dataType);
            } */

            if (firstDay != undefined) {
                parent.setDashboardSelectedDays(dashboardID, dataType, [firstDay]);
                setDayWhereClause(firstDay);
            }
        }
    }

    if (dayWhereClause != undefined && dayWhereClause != "") {
        params.whereClause = dayWhereClause;
    }

    params.selectedDays = getSelectedDaysById(dashboardID, dataType);
    if (params.selectedDays != undefined) {
        params.selectedDays = getDaysArray(params.selectedDays).toString();
        LoggerUtils.console(params.selectedDays);
    }

    // 	if the sync is on, set the search criteria.
    if (isSyncOn) {
        if (syncSearchCriteria) {
            if (syncSearchCriteria.searchCriteria) {
                params.searchcriteria = syncSearchCriteria.searchCriteria.getSearchCriteria();
            }
            if (syncSearchCriteria.whereClause) {
                params.whereClause = syncSearchCriteria.whereClause;
            }

            if (syncSearchCriteria.activityWhereClause) {
                params.activityWhereClause = syncSearchCriteria.activityWhereClause;
            }

            if (syncSearchCriteria.nwSearchCriteria) {
                params.nwSearchCriteria = syncSearchCriteria.nwSearchCriteria.getSearchCriteria();
            }
            if (syncSearchCriteria.nwActivityWhereClause) {
                params.nwActivityWhereClause = syncSearchCriteria.nwActivityWhereClause;
            }

            if (syncSearchCriteria.nwWhereClause) {
                params.nwWhereClause = syncSearchCriteria.nwWhereClause;
            }
        }
    } else {
        params.searchcriteria = searchCriteria.getSearchCriteria();
    }

    params.browserSessionId = parent.getBrowserSessionId();
    return params;
}


function getSelectedDaysById(dashboardId, dataType) {
    if (isSyncOn && syncSourceDashboardId != undefined) {
        return parent.getDashboardSelectedDays(syncSourceDashboardId, dataType);
    }

    return parent.getDashboardSelectedDays(dashboardId, dataType);
}

function getQueryWindowParams(params) {
    var queryWindow;
    if (parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY) != undefined) {
        queryWindow = parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY);
    }

    if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
        params.isShowDeletedRoutes = queryWindow.$("#showDeletedChk").is(":checked");
    }
    
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX) {
        params.prodGrps = getNwProdGroupNames();
        params.isNwProdGrp = true;
    }

    queryWindow = parent;
    params.isFullRoutingQuery = parent.VIEWER.getIsFullRouting();

    if (params.isFullRoutingQuery) {
        params["dataType"] = "FRM";
    }

/*if(dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX){		
		console.log("isFullRouting Query ["+params.isFullRoutingQuery+"]");
	}*/
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        params.isNetworkSummary = true;
    }
/*
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        params.isNetworkSummary = true;
    }*/

    if (dashboardID != parent.DASHBOARD_ID_NETWORK_MATRIX && dashboardID != parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        parent.setSQWParameters(params);
    }

    delete queryWindow;
}

/**
 * Clear Sync
 * Method to clear sync.
 */

function clearSync() {
    isSyncOn = false;
    isSyncMap = false;
    isSyncSchematic = false;
    selectedIds = [];
    //dont have to reset grid as its getting reinitialized
    //resetGridFilter();	
    removeHighlight();
}

/**
 * Sync on
 * Method to turn sync on.
 * @param flag - Flag to determine if the sync is on or not.
 */

function setSyncOn(flag) {
    //	flag(getDashboardID());
    isSyncOn = flag;
    if (!flag) {
        resetGridFilter();
        refreshMatrix();
    }
}

/**
 * Enable Sync
 * Method to enable sync.
 * @param btnId - Button instance of the sync buttons in matrix.
 * @param isEnableSync - Flag to determine if the sync has to be enabled or not.
 */

function enableSync(btnId, isEnableSync) {
    var dashboardId;
    // Based on which sync is on, set the corresponding flag and dashboard Id.
    if (btnId.indexOf("SyncMap") > 0) {
        isSyncMap = isEnableSync;
        dashboardId = parent.DASHBOARD_ID_MAP_VIEW;
    } else if (btnId.indexOf("SyncSchematic") > 0) {
        isSyncSchematic = isEnableSync;
        dashboardId = parent.DASHBOARD_ID_SCHEMATIC_VIEW;
    }

    // If isEnableSync and isSyncOn both are on. Turn Sync function off.
    if (isEnableSync && isSyncOn) {
        isSyncOn = false;
    }
    // Apply sync function.
    if (parent.isDashboardActive(dashboardId)) {
        parent.getDashboardContentWindow(dashboardId).setSyncOn(isEnableSync);
        populateIds();
        if (isEnableSync) {
            syncViewerDashboard(dashboardId);
        }
    }
}

/**
 * Data type by Dashboard Id
 * Method to get dashboard Id from data type.
 */

function getDataTypeByDashboardId() {
    var dataType;
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK;
    } else if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_SCHEDULE;
    } else if (dashboardID == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK_SCHEDULE;
    }

    return dataType;
}

/** Method to get sync search criteria */

function getSyncSearchCriteria() {
    var searchCriteria = new SearchCriteria();
    searchCriteria.setCriteria(CRITERIA_BROWSER_SESSION_ID, parent.getBrowserSessionId());

    var idFied;
    var dataType;
    var layerId;

    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX || dashboardID == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK;
        idFied = CRITERIA_LANE_ID;
    } else if (dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_SCHEDULE;
        searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, false);
        idFied = CRITERIA_LEG_ID;
    } else if (dashboardID == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
        dataType = parent.DATA_TYPE_NETWORK_SCHEDULE;
        searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, true);
        idFied = CRITERIA_LEG_ID;
    }
    searchCriteria.setCriteria(idFied, selectedIds.toString(), false, TYPE_STRING, OPERATOR_IN);

    var matrixSyncSearchCriteria = {};
    matrixSyncSearchCriteria.dataType = dataType;
    matrixSyncSearchCriteria.searchCriteria = searchCriteria;
    matrixSyncSearchCriteria.whereClause = dayWhereClause;
    return matrixSyncSearchCriteria;
}

/**
 * Sync Dashboards
 * Method to sync dashboards.
 */

function syncDashboards() {
    if (isSyncOn) {
        return;
    }

    var dashboardsToSync = [];
    // Based on the flag push dashboard Id whether Map or Schematic or both has to be synced.
    if (isSyncMap) {
        dashboardsToSync.push(parent.DASHBOARD_ID_MAP_VIEW);
    }
    if (isSyncSchematic) {
        dashboardsToSync.push(parent.DASHBOARD_ID_SCHEMATIC_VIEW);
    }

    for (var i = 0; i < dashboardsToSync.length; i++) {
        syncViewerDashboard(dashboardsToSync[i]);
    }
}

/**
 * Sync Viewer Dashboards
 * Method to sync viewer dashboard.
 * @param dashboardId - dashboard which has to be synced.
 */

function syncViewerDashboard(dashboardId) {
    var hasIdsToSync = selectedIds != undefined && selectedIds.length > 0;
    var dataType = getDataTypeByDashboardId();
    var selectedDays = parent.getDashboardSelectedDays(getDashboardID(), dataType);
    if (selectedDays != undefined) {
        //reset the days
        parent.setDashboardSelectedDays(dashboardId, dataType, selectedDays);
        var dashboardContentWindow = parent.getDashboardContentWindow(dashboardId);
        if (dashboardContentWindow != undefined) {
            //dashboardContentWindow.setDayWhereClause(selectedDays, dashboardContentWindow.getLayerIdByDataType(dataType));
            dashboardContentWindow.closePopups();
        }
    }
    //sync
    if (hasIdsToSync) {
        parent.VIEWER.syncDashboard(dashboardId, getSyncSearchCriteria());
    } else {
        clearViewerLayer(dashboardId);
    }
}

/**
 * Sync Viewer Dashboards
 * Method to sync viewer dashboard.
 * @param viewerDashboardId - Dashboard which has to be synced.
 */

function clearViewerLayer(viewerDashboardId) {
    var dashboard = parent.getDashboardContentWindow(viewerDashboardId);
    if (dashboard != undefined) {
        dashboard.removeLayerByDataType(getDataTypeByDashboardId());
    }
}

/** Method to sync a dashboard */

function syncDashboard(searchCriteria, sourceDashboardId) {
    syncSourceDashboardId = sourceDashboardId;
    setSyncOn(true);
    syncSearchCriteria = searchCriteria;
    if (searchCriteria.ids) {
        filterGridByIds(searchCriteria.ids);
    } else {
        clearIdsFromGridFilter();
        parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), false);
        resetMatrixDataLoadingStatus();
        refreshMatrix();
    }
}

function resetMatrixDataLoadingStatus() {
    setMatrixIsLoading(getContainerId()[0], false);
}

/**
 * Clear Id from Grid Filter
 * Method to clear or apply based on applied filter on any matrix.
 */

function clearIdsFromGridFilter() {
/*
    var grid = $("#" + getMatrixID()).data("kendoGrid");
    if (grid != undefined) {
        var noOfFilters = 0;
        var filter = grid.dataSource.filter();
        if (filter != undefined && filter.filters != undefined) {
            var filters = filter.filters;
            var noOfFilters = filters.length;
            if (noOfFilters > 0) {
                for (var i = noOfFilters - 1; i >= 0; i--) {
                    if (filters[i].field == getIdColumn()) {
                        filters.splice(i, 1);
                    }
                }
            }
        }

        if (noOfFilters > 0) {
            if (filters.length == 0) {
                grid.dataSource.filter([]);
            } else {
                grid.dataSource.filter(filter);
            }
        }
    }
*/
}

/**
 * Reset Grid Filter
 * Method to reset grid filter.
 */

function resetGridFilter() {
/*
    var grid = $("#" + getMatrixID()).data("kendoGrid");
    if (grid != undefined) {
        renderEmpty = true;
        grid.dataSource.filter([]);
    }
*/
}

/**
 * Filter grid by Ids
 * Method to filter grids by IDs.
 * @param ids - Filter ids which has to be applied in the given matrix.
 */

function filterGridByIds(ids) {
    var grid;
    for (var i = 0; i < getContainerId().length; i++) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(getContainerId()[i]);
        if (getMatrixData(getContainerId()[i]) != undefined) {
            grid.setDataProvider(getFilterGridData(JSON.parse(getMatrixData(getContainerId()[i])).slice(), ids));
            AdvancedDataGrid.setSelectAllState(getContainerId()[i], flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
        }
    }
}

function getFilterGridData(response, selectedIds) {
    var fResponse = [];
    if (response != undefined && response.length >= 0) {
        $.each(response, function(idx, dataItem) {
            $.each(selectedIds, function(sId, sDataItem) {
                if (dataItem[getIdColumn()] == sDataItem) {
                    fResponse.push(dataItem);
                }
            });
        });
    }
    if (fResponse != undefined && fResponse.length > 0) {
        return fResponse;
    } else {
        return response;
    }
}
/**
 * Event on resize
 * Event to resize given matrix.
 */

function onResize() {
    //do nothing
    if (getMatrixID() instanceof Array) {
        var containerIds = getMatrixID();
        if (containerIds != undefined) {
            for (var i = 0; i < containerIds.length; i++) {
                resizeMatrix(containerIds[i], getDashboardID());
            }
        }
    } else {
        resizeMatrix(getMatrixID(), getDashboardID());
    }
}

/**
 * Matrix data Tooltip
 * Method to show tool tips.
 */

function showTooltip(args) {
    //show scrollbar if no data
    showScrollbarIfNoData();

/*$("td", "#"+getMatrixID()).on("mouseover", function (ev) {
		if($(ev.currentTarget).find("img") && $(ev.currentTarget).find("img").length > 0) {
			if((getMatrixID() == getScheduleTreeGridContainerId() || getMatrixID() == "volumeUtilizationTreeGridMatrixContainer") && ev.currentTarget.innerHTML.indexOf("calendar") > 0 && ev.currentTarget.innerHTML.indexOf("'L'") > 0) {
				ev.currentTarget.title = "Leg Cal (L)";
			}else if((getMatrixID() == getScheduleTreeGridContainerId() || getMatrixID() == "volumeUtilizationTreeGridMatrixContainer") && ev.currentTarget.innerHTML.indexOf("calendar") > 0 && ev.currentTarget.innerHTML.indexOf("'Z'") > 0) {
				ev.currentTarget.title = "Leg Cal (Z)";
			}else if(ev.currentTarget.innerHTML.indexOf("calendar") > 0 && (ev.currentTarget.innerHTML.indexOf("'RL'") > 0)) {
				ev.currentTarget.title = "Route Cal (L)";
			}else if(ev.currentTarget.innerHTML.indexOf("calendar") > 0 && (ev.currentTarget.innerHTML.indexOf("'RZ'") > 0)) {
				ev.currentTarget.title = "Route Cal (Z)";
			}else if(ev.currentTarget.innerHTML.indexOf("calendar") > 0 && ev.currentTarget.innerHTML.indexOf("'L'") > 0) {
				ev.currentTarget.title = "Cal (L)";
			}else if(ev.currentTarget.innerHTML.indexOf("calendar") > 0 && ev.currentTarget.innerHTML.indexOf("'Z'") > 0) {
				ev.currentTarget.title = "Cal (Z)";
			}else if(ev.currentTarget.innerHTML.indexOf("comment") > 0) {
				ev.currentTarget.title = "Click cell to see more";
			}
		} else {
			var tooltip = $(ev.currentTarget).text();
			if(tooltip != "" && tooltip != " ") {
				ev.currentTarget.title = tooltip;
			}
		}
    });*/
    if (getMatrixID() instanceof Array) {
        var containerIds = getMatrixID();
        if (containerIds != undefined) {
            for (var i = 0; i < containerIds.length; i++) {
                updateMatrixCheckboxStates(containerIds[i]);
            }
        }
    } else {
        updateMatrixCheckboxStates(getMatrixID());
    }

    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
        // var grid = AdvancedDataGrid.getAdvancedDataGrid("scheduleMatrixTreeGridContainer"); //$("#scheduleMatrixGrid").data("kendoGrid");
        // If there is group by event, no need to updating frequency columns.
        //if (!grid._group || !grid.groupable.draggable.dropped) {
        changeFreqHandler($('#freqComboSettings')[0]);
        //}
        aggregateCalc(args);
    }
    LoggerUtils.trace("FROM BROWSER: Matrix[Response][Completed][Tooltip_Applied][END] -> Applied tooltips, updated checkbox states, applied aggregate calculations ");
}

/**
 * Initialize display option
 * Method to initialize display options component.
 */

function initializeDisplayOptions(reInitilize) {
    if (!reInitilize) {
        parent.createOptionsPanelByDiv($("#matrixDisplayOptions"), 'slide-right', true, true, '66px', '250px');
        createCheckboxesFromTables(getMatrixID(), 'selectablechekboxesDiv', 'volumecolumnsDiv', 'timeRelatedcolumnsDiv');
    } else {
        $("#matrixDisplayOptions .checkboxGroup-rows").parent().remove();
        createCheckboxesFromTables(getMatrixID(), 'selectablechekboxesDiv', 'volumecolumnsDiv', 'timeRelatedcolumnsDiv');
        if (typeof favDisplayOptionSettings != 'undefined' && favDisplayOptionSettings != undefined) {
            setColumnsSettings(favDisplayOptionSettings, getMatrixFavId()[0]);
            favDisplayOptionSettings = null;
        }
    }
}

/**
 * Initialize display option
 * Method to check if column is reserved. it means whether check box has to be created for a column or not.
 */

function getIsColumnReserved(reservedDisplayOptionColumnsMap, colName) {
    var reservedDisplayOptionColumnsArr;
    for (var key in reservedDisplayOptionColumnsMap) {
        reservedDisplayOptionColumnsArr = reservedDisplayOptionColumnsMap[key];
        for (var i = 0; i < reservedDisplayOptionColumnsArr.length; i++) {
            if (colName == reservedDisplayOptionColumnsArr[i]) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Is column hidden
 * Method to check if column is hidden or not. If column is hidden, not to add checkbox
 * @param hiddenColumns - Array of hidden columns.
 * @param colName - column which has to be checked if it's hidden or not
 */

function isColumnHidden(hiddenColumns, colName) {
    if (hiddenColumns != null) {
        for (var i = 0; i < hiddenColumns.length; i++) {
            if (colName == hiddenColumns[i]) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Check box event handler
 * check box display option handler
 * @param hiddenColumns - Array of hidden columns.
 * @param colName - matrix column name
 * @param colLabel - matrix column label
 * @param hiddenColumns - array of hidden columns
 * @param checkboxBtn - instance of checkbox button
 * @param chekboxesDiv - checkbox div instance
 * @param matrixGridId - matrix grid id.
 * @param labelsMap - map of all columns labels
 * @param reservedDisplayOptionColumnsMap - map of reserved columns.
 */

function createCheckBoxAndEventHandler(colName, colLabel, hiddenColumns, checkboxBtn, chekboxesDiv, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap) {
    if (reservedDisplayOptionColumnsMap == null) {
        return;
    }

    // Iterating map of reserved columns and create checkboxes in display option. If the column is not hidden, select the checkbox else not. 
    checkboxBtn = "";
    var volColMap = new Object();
    volColMap["All_Weight_Columns"] = [];
    volColMap["All_Cube_Columns"] = [];
    volColMap["All_Pieces_Columns"] = [];

    if (matrixGridId[0] === "volumeUtilizationTreeGridMatrixContainer") {
        volColMap = addProductGroupsAggregateColumnSettings(volColMap, true, true);
    } else {
        volColMap = addProductGroupsAggregateColumnSettings(volColMap, true, undefined, true);
    }


    for (var key in reservedDisplayOptionColumnsMap) {
        colName = key;
        colLabel = labelsMap[key];
        if (!colLabel) {
            colLabel = colName;
        }
        if (hiddenColumns[key] != null && !(hiddenColumns[key])) {
            checkboxBtn = $('<tr><td class="checkboxGroup checkboxGroup-rows"><input type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + colLabel + '</label></td></tr>');
        } else {
            checkboxBtn = $('<tr><td class="checkboxGroup checkboxGroup-rows"><input checked type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + colLabel + '</label></td></tr>');
        }
        checkboxBtn.appendTo('#' + chekboxesDiv);
        checkboxBtn = "";

        if ((getVolumeDisplayOptionLabelsMap()[colName]) != null) {
            var colArr = [];
            colArr = jQuery.extend(true, {}, volColMap[colName]);
            colArr = $.map(colArr, function(k, v) {
                return [k];
            });
            if (getMatrixID().indexOf("locAllocMatrixGrid") <= -1) {
                createSettingsOption((getVolumeDisplayOptionLabelsMap()[colName])[0], null, key, hiddenColumns, checkboxBtn, chekboxesDiv, colArr, 'checkbox', 30, true, [(reservedDisplayOptionColumnsMap[colName])[0]]);
            }
        }
        checkboxBtn = "";
        var siblingIdArr;
        if ((reservedDisplayOptionColumnsMap[colName]) != null) {
            for (var p = 0; p < (reservedDisplayOptionColumnsMap[colName]).length; p++) {
                if (getMatrixID().indexOf("locAllocMatrixGrid") <= -1) {
                    siblingIdArr = $.merge($.merge([], (getVolumeDisplayOptionLabelsMap()[colName])), (reservedDisplayOptionColumnsMap[colName]));
                } else {
                    siblingIdArr = reservedDisplayOptionColumnsMap[colName];
                }
                createSettingsOption((reservedDisplayOptionColumnsMap[colName])[p], commonMatrixConstants.volColLabelMap[(reservedDisplayOptionColumnsMap[colName])[p]], key, hiddenColumns, checkboxBtn, chekboxesDiv, [(reservedDisplayOptionColumnsMap[colName])[p]], 'checkbox', 30, true, siblingIdArr);
            }
        }
        $("#" + colName).on('click', function(e) {
            var colmnsToHide = [];
            if (getMatrixID().indexOf("locAllocMatrixGrid") <= -1) {
                $("#" + ((getVolumeDisplayOptionLabelsMap()[e.currentTarget.id])[0]).replace(/ /g, "_") + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
                $.merge($.merge(colmnsToHide, volColMap[e.currentTarget.id]), reservedDisplayOptionColumnsMap[e.currentTarget.id]);
            } else {
                colmnsToHide = reservedDisplayOptionColumnsMap[e.currentTarget.id];
            }
            if ((reservedDisplayOptionColumnsMap[e.currentTarget.id]) != null) {
                for (var q = 0; q < (reservedDisplayOptionColumnsMap[e.currentTarget.id]).length; q++) {
                    $("#" + ((reservedDisplayOptionColumnsMap[e.currentTarget.id])[q]).replace(/ /g, "_") + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
                }
            }
            hideUnhideColumns(e.currentTarget, matrixGridId, colmnsToHide);
        });
    }
}

function createTimeCheckBoxAndEventHandler(colName, colLabel, hiddenColumns, checkboxBtn, chekboxesDiv, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap) {
    if (reservedDisplayOptionColumnsMap == null) {
        return;
    }
    if (commonMatrixConstants.timeColLabelMap == null) {
        commonMatrixConstants.timeColLabelMap = new Object();
    }
    // Iterating map of reserved columns and create checkboxes in display option. If the column is not hidden, select the checkbox else not. 
    checkboxBtn = "";
    var columnsToHide = getColumnsToHideInSettings();
    for (var key in reservedDisplayOptionColumnsMap) {
        colName = key;
        colLabel = labelsMap[key];
        if (!colLabel) {
            colLabel = colName;
        }
        colName = colName.replace(/ /g, "_");
        if (hiddenColumns[key] != null && !(hiddenColumns[key])) {
            checkboxBtn = $('<tr><td class="checkboxGroup checkboxGroup-rows"><input type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + colLabel + '</label></td></tr>');
        } else {
            checkboxBtn = $('<tr><td class="checkboxGroup checkboxGroup-rows"><input checked type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + colLabel + '</label></td></tr>');
        }
        checkboxBtn.appendTo('#' + chekboxesDiv);
        checkboxBtn = "";
        $("#" + colName).on('click', function(e) {
            try {
                parent.showProgressDialog(true, "Loading Columns...");

                for (var k = 0; k < (reservedDisplayOptionColumnsMap[e.currentTarget.id]).length; k++) {
                    var colName1 = reservedDisplayOptionColumnsMap[e.currentTarget.id][k];
                    if ($("#" + colName1 + e.currentTarget.id) != null && $("#" + colName1 + e.currentTarget.id)[0] != null && $("#" + e.currentTarget.id) != null && $("#" + e.currentTarget.id)[0] != null) {
                        $("#" + colName1 + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
                    }
                }
                if ($("#Freq_DaysMS" + e.currentTarget.id)[0] != null) {
                    $("#Freq_DaysMS" + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
                }
                setTimeout(function() {

                    hideUnhideColumns(e.currentTarget, matrixGridId, reservedDisplayOptionColumnsMap[e.currentTarget.id]);
                    $("#Effective_Days" + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
                    if ($("#" + e.currentTarget.id)[0].checked == $("#Effective_Days" + e.currentTarget.id)[0].checked) {
                        var key = e.currentTarget.id;
                        var effDaysKey = "";
                        if ($("#" + ("Keyword Eff Days".replace(/ /g, "_") + key)).is(":checked")) {
                            effDaysKey = "Keyword_Eff_Days";
                        } else if ($("#" + ("Eff Days".replace(/ /g, "_") + key)).is(":checked")) {
                            effDaysKey = "Eff_Days";
                        } else if ($("#" + ("Separate Columns".replace(/ /g, "_") + key)).is(":checked")) {
                            effDaysKey = "Separate_Columns";
                        } else if ($("#" + ("Weekly Pattern".replace(/ /g, "_") + key)).is(":checked")) {
                            effDaysKey = "Weekly_Pattern";
                        }

                        effectiveDaysClickHandler(($("#" + "Effective Days".replace(/ /g, "_") + key)[0].checked), "", key);
                        hideUnhideEffectiveDaysColumns(effDaysKey, key, $("#" + "Effective Days".replace(/ /g, "_") + key)[0].checked);
                        //return;
                    } else {
                        //                        $("#Effective_Days" + e.currentTarget.id).click();
                    }


                    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0 || getMatrixID().indexOf("volumeUtilizationTreeGridMatrixContainer") >= 0) {
                       if($("#Route_Effective_Days" + e.currentTarget.id) && $("#Route_Effective_Days" + e.currentTarget.id).length > 0) {
	                    	$("#Route_Effective_Days" + e.currentTarget.id)[0].checked = $("#" + e.currentTarget.id)[0].checked;
	                        if ($("#" + e.currentTarget.id)[0].checked == $("#Route_Effective_Days" + e.currentTarget.id)[0].checked) {
	                            var key = e.currentTarget.id;
	                            var effDaysKey = "";
	                            if ($("#" + ("Route Keyword Eff Days".replace(/ /g, "_") + key)).is(":checked")) {
	                                effDaysKey = "Route_Keyword_Eff_Days";
	                            } else if ($("#" + ("Route Eff Days".replace(/ /g, "_") + key)).is(":checked")) {
	                                effDaysKey = "Route_Eff_Days";
	                            } else if ($("#" + ("Route Separate Columns".replace(/ /g, "_") + key)).is(":checked")) {
	                                effDaysKey = "Route_Separate_Columns";
	                            } else if ($("#" + ("Route Weekly Pattern".replace(/ /g, "_") + key)).is(":checked")) {
	                                effDaysKey = "Route_Weekly_Pattern";
	                            }
	                            effectiveDaysClickHandler($("#Route Effective Days".replace(/ /g, "_") + key)[0].checked, "Route_", key);
	                            hideUnhideEffectiveDaysColumns(effDaysKey, key, $("#Route Effective Days".replace(/ /g, "_") + key)[0].checked);
	                            //return;
	                        } else {
	                            //                            $("#Route_Effective_Days" + e.currentTarget.id).click();
	                        }
                       }
                    }

                }, 5);
            } finally {
                parent.showProgressDialog(false);
            }
        });

        appendEffectiveDaysSettings(hiddenColumns, checkboxBtn, chekboxesDiv, key, reservedDisplayOptionColumnsMap);
        var siblingIdArr;
        for (var k = 0; k < (reservedDisplayOptionColumnsMap[colName]).length; k++) {
            var colName1 = reservedDisplayOptionColumnsMap[colName][k];
            var colLabel1 = commonMatrixConstants.timeColLabelMap[colName1];
            if (!colLabel1) {
                colLabel1 = colName1;
            }
            if ((columnsToHide == null || !isColumnHidden(columnsToHide, colName1)) && colLabel1 != null) {
                if (getMatrixID().indexOf("networkSummaryMatrixTreeGridDivContainer") >= 0 || getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
                    siblingIdArr = $.merge(["Effective_Days", "Freq DaysMS"], reservedDisplayOptionColumnsMap[colName]);
                } else {
                    siblingIdArr = $.merge(["Effective_Days"], reservedDisplayOptionColumnsMap[colName]);
                }
                if (colLabel1.indexOf("EFF") < 0 && colLabel1.indexOf("FREQ") < 0) {
                    createSettingsOption(colName1, colLabel1, key, hiddenColumns, checkboxBtn, chekboxesDiv, [colName1], 'checkbox', 30, true, siblingIdArr);
                }
            }
        }

        if ((typeof commonMatrixConstants.LOCAL_TOTAL_FREQ != 'undefined' && commonMatrixConstants.LOCAL_TOTAL_FREQ != null && (commonMatrixConstants.LOCAL_TOTAL_FREQ).length >= 0) && typeof commonMatrixConstants.ZULU_TOTAL_FREQ != 'undefined' && commonMatrixConstants.ZULU_TOTAL_FREQ != null && (commonMatrixConstants.ZULU_TOTAL_FREQ).length >= 0) {
            if (key.indexOf("Local") >= 0) {
                createSettingsOption("Freq DaysMS", "Freq Days (M-S)", key, hiddenColumns, checkboxBtn, chekboxesDiv, commonMatrixConstants.LOCAL_TOTAL_FREQ, 'checkbox', 30, true, $.merge(["Effective_Days"], reservedDisplayOptionColumnsMap[colName]));
            } else if (typeof commonMatrixConstants.ZULU_TOTAL_FREQ != 'undefined' && commonMatrixConstants.ZULU_TOTAL_FREQ != null) {
                createSettingsOption("Freq DaysMS", "Freq Days (M-S)", key, hiddenColumns, checkboxBtn, chekboxesDiv, commonMatrixConstants.ZULU_TOTAL_FREQ, 'checkbox', 30, true, $.merge(["Effective_Days"], reservedDisplayOptionColumnsMap[colName]));
            }
        }
    }
}

function getScheduleTreeGridContainerId() {
    return parent.DASHBOARD_ID_SCHEDULE_MATRIX + parent.PARAM_TREE_GRID;
}

function appendEffectiveDaysSettings(hiddenColumns, checkboxBtn, chekboxesDiv, key, reservedDisplayOptionColumnsMap) {
    var effColumnsArr;
    var effDaysCol;
    var keyEffDayCol;
    var weeklyPattern;
    var calBtn;
    var routeEffColumnsArr;
    var routeEffDaysCol;
    var routeKeyEffDayCol;
    var routeCalBtn;
    var routeWeeklyPattern;
    var allTimeCol = [];
    var allRouteTimeCol = [];
    if (key == "All_Local_Columns") {
        effColumnsArr = getEffectiveColumns(true);
        effDaysCol = ["EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS"];
        keyEffDayCol = ["KEYWORD_EFFDT_L"];
        calBtn = ["CAL_BUTTON_L"];
        weeklyPattern = ["FULL_EFFDT_L"];
    } else {
        effColumnsArr = getEffectiveColumns(false);
        effDaysCol = ["EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS"];
        keyEffDayCol = ["KEYWORD_EFFDT_Z"];
        calBtn = ["CAL_BUTTON_Z"];
        weeklyPattern = ["FULL_EFFDT_Z"];
    }
    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
        allTimeCol = $.merge($.merge($.merge($.merge($.merge(allTimeCol, effColumnsArr), effDaysCol), keyEffDayCol), calBtn), weeklyPattern); //$.merge($.merge(effColumnsArr,effDaysCol),keyEffDayCol);
    } else {
        allTimeCol = $.merge($.merge($.merge($.merge(allTimeCol, effColumnsArr), effDaysCol), keyEffDayCol), calBtn); //$.merge($.merge(effColumnsArr,effDaysCol),keyEffDayCol); 
    }
    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0 || getMatrixID().indexOf("volumeUtilizationTreeGridMatrixContainer") >= 0) {
        createSettingsOption("Effective Days", "Leg Effective Days", key, hiddenColumns, checkboxBtn, chekboxesDiv, allTimeCol, 'checkbox', 30, true, reservedDisplayOptionColumnsMap[key]);
    } else {
        createSettingsOption("Effective Days", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, allTimeCol, 'checkbox', 30, true, reservedDisplayOptionColumnsMap[key]);
    }


    $("#" + "Effective Days".replace(/ /g, "_") + key).on('click', function(e) {
        effectiveDaysClickHandler($("#Effective Days".replace(/ /g, "_") + key)[0].checked, "", key, true);
    });

    createSettingsOption("Keyword Eff Days", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, keyEffDayCol, 'radio', 50, true, null, true);
    createSettingsOption("Eff Days", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, effDaysCol, 'radio', 50, true, null, true);
    createSettingsOption("Separate Columns", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, effColumnsArr, 'radio', 50, true, null, true);
    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
        createSettingsOption("Weekly Pattern", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, effColumnsArr, 'radio', 50, true, null, true);
    }
    updateEffectiveSettingsClick(key);
    $("#" + ("Eff Days".replace(/ /g, "_") + key))[0].checked = true;
    if (isScheduleMatirix(getMatrixID())) {
    	if (isLocalTimeFlag()) {
    		 $("#All_Local_Columns").attr('disabled', 'disabled');
    	   	 $("#" + ("Effective Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
    	   	 $("#All_Zulu_Columns").removeAttr('disabled');
    	   	 $("#" + ("Effective Days".replace(/ /g, "_") + "All_Zulu_Columns")).removeAttr('disabled');
    	} else {
    		 $("#All_Local_Columns").removeAttr("disabled");
    	   	 $("#" + ("Effective Days".replace(/ /g, "_") + "All_Local_Columns")).removeAttr("disabled");
    		 $("#All_Zulu_Columns").attr('disabled', 'disabled');
    	   	 $("#" + ("Effective Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
    	}
   
   }
    if ((key.indexOf("Zulu") < 0 && isLocalTimeFlag()) || key.indexOf("Zulu") >= 0 && !isLocalTimeFlag()) {
        $("#" + ("Keyword Eff Days".replace(/ /g, "_") + key)).removeAttr("disabled");
        $("#" + ("Eff Days".replace(/ /g, "_") + key)).removeAttr("disabled");
        $("#" + ("Separate Columns".replace(/ /g, "_") + key)).removeAttr("disabled");
        $("#" + ("Weekly Pattern".replace(/ /g, "_") + key)).removeAttr("disabled");
    } else {
        $("#" + ("Keyword Eff Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
        $("#" + ("Eff Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
        $("#" + ("Separate Columns".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
        $("#" + ("Weekly Pattern".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
    }

    // Adding Route Effective days columns in Schedule Matrix and Volume Utilization matrix
    if(getMatrixID().indexOf(parent.DASHBOARD_ID_SCHEDULE_MATRIX + parent.PARAM_TREE_GRID) != 0 ){
	    	if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0 || getMatrixID().indexOf("volumeUtilizationTreeGridMatrixContainer") >= 0) {
		        if (key == "All_Local_Columns") {
		            routeEffColumnsArr = getRouteEffectiveColumns(true);
		            routeEffDaysCol = ["RTEEFFDAYSL", "ROUTE_LOCAL_DAYS"];
		            routeKeyEffDayCol = ["ROUTE_KEYWORD_EFFDT_L"];
		            routeCalBtn = ["CAL_BUTTON_ROUTE_L"];
		            routeWeeklyPattern = ["ROUTE_FULL_EFFDT_L"];
		        } else {
		            routeEffColumnsArr = getRouteEffectiveColumns(false);
		            routeEffDaysCol = ["RTEEFFDAYSZ", "ROUTE_ZULU_DAYS"];
		            routeKeyEffDayCol = ["ROUTE_KEYWORD_EFFDT_Z"];
		            routeCalBtn = ["CAL_BUTTON_ROUTE_Z"];
		            routeWeeklyPattern = ["ROUTE_FULL_EFFDT_Z"];
		        }
		        if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
		            allRouteTimeCol = $.merge($.merge($.merge($.merge($.merge(allRouteTimeCol, routeEffColumnsArr), routeEffDaysCol), routeKeyEffDayCol), routeCalBtn), routeWeeklyPattern); //$.merge($.merge(effColumnsArr,effDaysCol),keyEffDayCol);
		        } else {
		            allRouteTimeCol = $.merge($.merge($.merge($.merge(allRouteTimeCol, routeEffColumnsArr), routeEffDaysCol), routeKeyEffDayCol), routeCalBtn); //$.merge($.merge(effColumnsArr,effDaysCol),keyEffDayCol);
		        }
		
		        createSettingsOption("Route Effective Days", null, key, hiddenColumns, checkboxBtn, chekboxesDiv, allRouteTimeCol, 'checkbox', 30, true, reservedDisplayOptionColumnsMap[key]);
		        $("#" + "Route Effective Days".replace(/ /g, "_") + key).on('click', function(e) {
		            effectiveDaysClickHandler($("#Route Effective Days".replace(/ /g, "_") + key)[0].checked, "Route_", key, true);
		        });
		
		        createSettingsOption("Route Keyword Eff Days", "Keyword Eff Days", key, hiddenColumns, checkboxBtn, chekboxesDiv, keyEffDayCol, 'radio', 50, true, null, true, "Route_");
		        createSettingsOption("Route Eff Days", "Eff Days", key, hiddenColumns, checkboxBtn, chekboxesDiv, effDaysCol, 'radio', 50, true, null, true, "Route_");
		        createSettingsOption("Route Separate Columns", "Separate Columns", key, hiddenColumns, checkboxBtn, chekboxesDiv, effColumnsArr, 'radio', 50, true, null, true, "Route_");
		        if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0) {
		            createSettingsOption("Route Weekly Pattern", "Weekly Pattern", key, hiddenColumns, checkboxBtn, chekboxesDiv, effColumnsArr, 'radio', 50, true, null, true, "Route_");
		        }
		        updateEffectiveSettingsClick(key);
		        $("#" + ("Route Keyword Eff Days".replace(/ /g, "_") + key))[0].checked = true;
		        if ((key.indexOf("Zulu") < 0 && isLocalTimeFlag()) || key.indexOf("Zulu") >= 0 && !isLocalTimeFlag()) {
		            $("#" + ("Route Keyword Eff Days".replace(/ /g, "_") + key)).removeAttr("disabled");
		            $("#" + ("Route Eff Days".replace(/ /g, "_") + key)).removeAttr("disabled");
		            $("#" + ("Route Separate Columns".replace(/ /g, "_") + key)).removeAttr("disabled");
		            $("#" + ("Route Weekly Pattern".replace(/ /g, "_") + key)).removeAttr("disabled");
		        } else {
		            $("#" + ("Route Keyword Eff Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
		            $("#" + ("Route Eff Days".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
		            $("#" + ("Route Separate Columns".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
		            $("#" + ("Route Weekly Pattern".replace(/ /g, "_") + key)).attr('disabled', 'disabled');
		        }
	    	}
    	}
	}

function effectiveDaysClickHandler(isEnable, effType, key, isClick) {
    if (isEnable) {
        $('input[name="' + effType + key + 'radio"]').removeAttr("disabled");
        if (isClick != undefined && isClick == true) $('input[name="' + effType + key + 'radio"]:checked').click();
    } else {
        $('input[name="' + effType + key + 'radio"]').attr('disabled', 'disabled');
    }
}


function updateEffectiveSettingsClick(key) {
    $("#" + "Keyword Eff Days".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getEffectiveColumns(true);
                    keyEffDayCol = ["KEYWORD_EFFDT_L"];
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L", "EFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getEffectiveColumns(false);
                    keyEffDayCol = ["KEYWORD_EFFDT_Z"];
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z", "EFFWEEKSZ_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.target, getMatrixID(), keyEffDayCol, hideColumnsArr);

            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Eff Days".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getEffectiveColumns(true);
                    effDaysCol = ["EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS"];
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L", "EFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getEffectiveColumns(false);
                    effDaysCol = ["EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS"];
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z", "EFFWEEKSZ_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.target, getMatrixID(), effDaysCol, hideColumnsArr);
            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Separate Columns".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                effColumnsArr = [];
                if (key == "All_Local_Columns") {
                    effColumnsArr = getEffectiveColumns(true);
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L", "EFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getEffectiveColumns(false);
                    hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z", "EFFWEEKSZ_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.target, getMatrixID(), effColumnsArr, hideColumnsArr);

            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Weekly Pattern".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getEffectiveColumns(true);
                    fullEffDaysCol = ["FULL_EFFDT_L"];
                    hideColumnsArr = $.merge(["FULL_EFFDT_L", "KEYWORD_EFFDT_L", "LOCAL_DAYS", "RTEEFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getEffectiveColumns(false);
                    fullEffDaysCol = ["FULL_EFFDT_Z"];
                    hideColumnsArr = $.merge(["FULL_EFFDT_Z", "KEYWORD_EFFDT_Z", "ZULU_DAYS", "RTEEFFWEEKSZ_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.target, getMatrixID(), fullEffDaysCol, hideColumnsArr);
            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });

    // Event for Route Effective days in Schedule & Volume utilization matrix.
    $("#" + "Route Keyword Eff Days".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getRouteEffectiveColumns(true);
                    keyEffDayCol = ["ROUTE_KEYWORD_EFFDT_L"];
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "RTEEFFDAYSL", "ROUTE_FULL_EFFDT_L", "RTEEFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getRouteEffectiveColumns(false);
                    keyEffDayCol = ["ROUTE_KEYWORD_EFFDT_Z"];
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "RTEEFFDAYSZ", "ROUTE_FULL_EFFDT_Z", "RTEEFFWEEKSL_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.currentTarget, getMatrixID(), keyEffDayCol, hideColumnsArr);

            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Route Eff Days".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getRouteEffectiveColumns(true);
                    effDaysCol = ["ROUTE_LOCAL_DAYS", "RTEEFFDAYSL"];
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "RTEEFFDAYSL", "ROUTE_FULL_EFFDT_L", "RTEEFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getRouteEffectiveColumns(false);
                    effDaysCol = ["ROUTE_ZULU_DAYS", "RTEEFFDAYSZ"];
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "RTEEFFDAYSZ", "ROUTE_FULL_EFFDT_Z", "RTEEFFWEEKSL_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.currentTarget, getMatrixID(), effDaysCol, hideColumnsArr);

            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Route Separate Columns".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                effColumnsArr = [];
                if (key == "All_Local_Columns") {
                    effColumnsArr = getRouteEffectiveColumns(true);
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "RTEEFFDAYSL", "ROUTE_FULL_EFFDT_L", "RTEEFFWEEKSL_W5"], effColumnsArr);
                } else {
                    effColumnsArr = getRouteEffectiveColumns(false);
                    hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "RTEEFFDAYSZ", "ROUTE_FULL_EFFDT_Z", "RTEEFFWEEKSL_W5"], effColumnsArr);
                }
                hideUnhideColumns(e.currentTarget, getMatrixID(), effColumnsArr, hideColumnsArr);
            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
    $("#" + "Route Weekly Pattern".replace(/ /g, "_") + key).on('click', function(e) {
        try {
            parent.showProgressDialog(true, "Loading Columns...");
            setTimeout(function() {
                if (key == "All_Local_Columns") {
                    effColumnsArr = getRouteEffectiveColumns(true);
                    fullEffDaysCol = ["ROUTE_FULL_EFFDT_L"];
                    hideColumnsArr = $.merge(["ROUTE_FULL_EFFDT_L", "ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS"], effColumnsArr);
                } else {
                    effColumnsArr = getRouteEffectiveColumns(false);
                    fullEffDaysCol = ["ROUTE_FULL_EFFDT_Z"];
                    hideColumnsArr = $.merge(["ROUTE_FULL_EFFDT_Z", "ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS"], effColumnsArr);
                }
                hideUnhideColumns(e.currentTarget, getMatrixID(), fullEffDaysCol, hideColumnsArr);
            }, 5);
        } finally {
            parent.showProgressDialog(false);
        }
    });
}

function hideUnhideEffectiveDaysColumns(effDaysKey, key, includeKeyEffDayCol) {
    if (effDaysKey == "Keyword_Eff_Days") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                keyEffDayCol = ["KEYWORD_EFFDT_L"];
            } else {
                keyEffDayCol = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L"], effColumnsArr);
        } else {
            effColumnsArr = getEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                keyEffDayCol = ["KEYWORD_EFFDT_Z"];
            } else {
                keyEffDayCol = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Keyword Eff Days".replace(/ /g, "_") + key))[0], getMatrixID(), keyEffDayCol, hideColumnsArr);
    }
    if (effDaysKey == "Eff_Days") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effDaysCol = ["EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS"];
            } else {
                effDaysCol = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L"], effColumnsArr);
        } else {
            effColumnsArr = getEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effDaysCol = ["EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS"];
            } else {
                effDaysCol = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Eff Days".replace(/ /g, "_") + key))[0], getMatrixID(), effDaysCol, hideColumnsArr);
    }
    if (effDaysKey == "Separate_Columns") {
        effColumnsArr = [];
        if (key == "All_Local_Columns") {
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effColumnsArr = getEffectiveColumns(true);
            } else {
                effColumnsArr = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS", "FULL_EFFDT_L"], effColumnsArr);
        } else {
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effColumnsArr = getEffectiveColumns(false);
            } else {
                effColumnsArr = [];
            }
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS", "FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Separate Columns".replace(/ /g, "_") + key))[0], getMatrixID(), effColumnsArr, hideColumnsArr);
    }
    if (effDaysKey == "Weekly_Pattern") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                fullEffDaysCol = ["FULL_EFFDT_L"];
            } else {
                fullEffDaysCol = [];
            }
            hideColumnsArr = $.merge(["FULL_EFFDT_L", "KEYWORD_EFFDT_L", "LOCAL_DAYS"], effColumnsArr);
        } else {
            effColumnsArr = getEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                fullEffDaysCol = ["FULL_EFFDT_Z"];
            } else {
                fullEffDaysCol = [];
            }
            hideColumnsArr = $.merge(["FULL_EFFDT_Z", "KEYWORD_EFFDT_Z", "ZULU_DAYS"], effColumnsArr);
        }
        hideUnhideColumns($("#" + ("Weekly Pattern".replace(/ /g, "_") + key))[0], getMatrixID(), fullEffDaysCol, hideColumnsArr);
    }

    // For Route Effective days in Schedule & Volume utilization matrix.
    if (effDaysKey == "Route_Keyword_Eff_Days") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getRouteEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                keyEffDayCol = ["ROUTE_KEYWORD_EFFDT_L"];
            } else {
                keyEffDayCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "ROUTE_FULL_EFFDT_L"], effColumnsArr);
        } else {
            effColumnsArr = getRouteEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                keyEffDayCol = ["ROUTE_KEYWORD_EFFDT_Z"];
            } else {
                keyEffDayCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "ROUTE_FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Route Keyword Eff Days".replace(/ /g, "_") + key))[0], getMatrixID(), keyEffDayCol, hideColumnsArr);

    }
    if (effDaysKey == "Route_Eff_Days") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getRouteEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effDaysCol = ["ROUTE_LOCAL_DAYS"];
            } else {
                effDaysCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "ROUTE_FULL_EFFDT_L"], effColumnsArr);
        } else {
            effColumnsArr = getRouteEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effDaysCol = ["ROUTE_ZULU_DAYS"];
            } else {
                effDaysCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "ROUTE_FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Route Eff Days".replace(/ /g, "_") + key))[0], getMatrixID(), effDaysCol, hideColumnsArr);
    }
    if (effDaysKey == "Route_Separate_Columns") {
        effColumnsArr = [];
        if (key == "All_Local_Columns") {
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effColumnsArr = getRouteEffectiveColumns(true);
            } else {
                effColumnsArr = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS", "ROUTE_FULL_EFFDT_L"], effColumnsArr);
        } else {
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                effColumnsArr = getRouteEffectiveColumns(false);
            } else {
                effColumnsArr = [];
            }
            hideColumnsArr = $.merge(["ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS", "ROUTE_FULL_EFFDT_Z"], effColumnsArr);;
        }
        hideUnhideColumns($("#" + ("Route Separate Columns".replace(/ /g, "_") + key))[0], getMatrixID(), effColumnsArr, hideColumnsArr);
    }
    if (effDaysKey == "Route_Weekly_Pattern") {
        if (key == "All_Local_Columns") {
            effColumnsArr = getRouteEffectiveColumns(true);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                fullEffDaysCol = ["ROUTE_FULL_EFFDT_L"];
            } else {
                fullEffDaysCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_FULL_EFFDT_L", "ROUTE_KEYWORD_EFFDT_L", "ROUTE_LOCAL_DAYS"], effColumnsArr);
        } else {
            effColumnsArr = getRouteEffectiveColumns(false);
            if (includeKeyEffDayCol != undefined && includeKeyEffDayCol == true) {
                fullEffDaysCol = ["ROUTE_FULL_EFFDT_Z"];
            } else {
                fullEffDaysCol = [];
            }
            hideColumnsArr = $.merge(["ROUTE_FULL_EFFDT_Z", "ROUTE_KEYWORD_EFFDT_Z", "ROUTE_ZULU_DAYS"], effColumnsArr);
        }
        hideUnhideColumns($("#" + ("Route Weekly Pattern".replace(/ /g, "_") + key))[0], getMatrixID(), fullEffDaysCol, hideColumnsArr);
    }
}

function createSettingsOption(colName5, colLabel5, key, hiddenColumns, checkboxBtn, chekboxesDiv, reservedDisplayOptionSettingsMap, inputType, paddingLeft, isOptionsAvail, siblingIdArr, isHideUnhideColumns, groupName) {
    if (!colLabel5) {
        colLabel5 = colName5;
    }
    if (groupName == undefined) {
        groupName = "";
    }
    if (((hiddenColumns[colName5] != null && !(hiddenColumns[colName5])) || (hiddenColumns[key] != null && !(hiddenColumns[key]))) && inputType != 'radio') {
    	colName5 = colName5.replace(/ /g, "_") + key;
        checkboxBtn = $('<tr><td class="checkboxGroup-rows" style="padding-left:' + paddingLeft + 'px"><input type="' + inputType + '" class="mtrixchkbox" id="' + colName5 + '" name="' + groupName + key + inputType + '"/><label for="' + colName5 + '" class="label_style matrix_chkboxlabel">' + colLabel5 + '</label></td></tr>');
    } else {
    	colName5 = colName5.replace(/ /g, "_") + key;
        checkboxBtn = $('<tr><td class="checkboxGroup-rows" style="padding-left:' + paddingLeft + 'px"><input checked type="' + inputType + '" class="mtrixchkbox" id="' + colName5 + '" name="' + groupName + key + inputType + '"/><label for="' + colName5 + '" class="label_style matrix_chkboxlabel">' + colLabel5 + '</label></td></tr>');
    }
    checkboxBtn.appendTo('#' + chekboxesDiv);
    checkboxBtn = "";
    var hideColumnsArr;
    if (inputType == 'radio') {
        if (key == "All_Local_Columns") {
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_L", "EFFDAYSL", "EFF_DATS_L", "LOCAL_DAYS"], getEffectiveColumns(true));
        } else {
            hideColumnsArr = $.merge(["KEYWORD_EFFDT_Z", "EFFDAYSZ", "EFF_DATS_Z", "ZULU_DAYS"], getEffectiveColumns(false));;
        }
    }
    if (!isHideUnhideColumns) {
        if (!isOptionsAvail) {
            $("#" + colName5).on('click', function(e) {
                hideUnhideColumns(e.currentTarget, getMatrixID(), reservedDisplayOptionSettingsMap[colName5], hideColumnsArr);
            });
        } else {
            $("#" + colName5).on('click', function(e) {
                hideUnhideColumns(e.currentTarget, getMatrixID(), reservedDisplayOptionSettingsMap, hideColumnsArr);
            });
        }
    }
    $("#" + colName5).on('click', function(e) {
        var chkflag = true;
        var siblingId;
        var columnsToHide = getColumnsToHideInSettings();
        if (siblingIdArr != null && siblingIdArr.length > 0) {
            for (var j = 0; j < siblingIdArr.length; j++) {
                siblingId = siblingIdArr[j];
                if (siblingId.indexOf("EFF") < 0 && siblingId.indexOf("FREQ") < 0 && (columnsToHide == null || !isColumnHidden(columnsToHide, siblingId))) {
                    if (!($("#" + siblingId.replace(/ /g, "_") + key)[0].checked)) {
                        chkflag = false;
                        break;
                    }
                }
            }
            if (chkflag && $("#" + colName5)[0].checked) {
                $("#" + key)[0].checked = true;
            } else {
                $("#" + key)[0].checked = false;
            }

        }
    });

}
/**
 * Check box table
 * Method to create display option components
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 * @param chekboxesDiv - check box div
 */

function createCheckboxesFromTables(matrixGridId, chekboxesDiv, volumeChkDiv, timeChkDiv) {
    var columns;
    var colName;
    var colLabel;
    var isColumnResevered;
    var checkboxBtn;
    var reservedDisplayOptionColumnsMap;

    //get all reserved colums 
    var labelsMap = getReservedDisplayOptionColumnsLabelsMap();
    //create ckeckboxes for aggregate colums 
    reservedDisplayOptionColumnsMap = getAggregateColumnsSettings();
    // To find out all the hidden columns
    var hiddenColumns = getReservedColumnsVisiblity();
    // create ckeckboxes for reserved colums
    createCheckBoxAndEventHandler(colName, colLabel, hiddenColumns, checkboxBtn, volumeChkDiv, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap);
    reservedDisplayOptionColumnsMap = getTimeZoneColumnsSettings();
    createTimeCheckBoxAndEventHandler(colName, colLabel, hiddenColumns, checkboxBtn, timeChkDiv, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap);
    reservedDisplayOptionColumnsMap = $.extend(reservedDisplayOptionColumnsMap, getAggregateColumnsSettings());

    if (matrixGridId.indexOf("volumeUtilizationTreeGridMatrixContainer") >= 0) {
        reservedDisplayOptionColumnsMap = addProductGroupsAggregateColumnSettings(reservedDisplayOptionColumnsMap, true, true);
    } else {
        reservedDisplayOptionColumnsMap = addProductGroupsAggregateColumnSettings(reservedDisplayOptionColumnsMap, true);
    }

    //adding blank space
/*checkboxBtn = $('<tr><td style="height:5px"></td></tr>');
	checkboxBtn.appendTo('#'+chekboxesDiv);*/
    checkboxBtn = "";
    columns = getMatrixColumns();
    // Get all the columns which should not display in display options
    var columnsToHide = getColumnsToHideInSettings();
    //    checkboxBtn = $('<tr><td style="padding-top:4px"></td></tr>');
    //    checkboxBtn.appendTo('#' + chekboxesDiv);
    checkboxBtn = "";
    // Iterating through all matrix columns and create checkboxes for rest of the columns other that reserved columns
    for (var i = 0; i < columns.length; i++) {
        colName = null;
        colName = columns[i].field;
        if (colName != undefined && colName != EMPTY_STRING && (columnsToHide == null || !isColumnHidden(columnsToHide, colName))) {
            isColumnResevered = getIsColumnReserved(reservedDisplayOptionColumnsMap, colName);
            if (colName != "" && !(isColumnResevered)) {
                if (colName != "FREQ") {
                    if (hiddenColumns[colName] != null && !(hiddenColumns[colName])) {
                        checkboxBtn = $('<tr><td class="checkboxGroup-rows left-padding2"><input type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + columns[i].title + '</label></td></tr>');
                    } else {
                        checkboxBtn = $('<tr><td class="checkboxGroup-rows left-padding2"><input checked type="checkbox" class="mtrixchkbox" id="' + colName + '" /><label for="' + colName + '" class="label_style matrix_chkboxlabel">' + columns[i].title + '</label></td></tr>');
                    }
                    checkboxBtn.appendTo('#' + chekboxesDiv);
                    checkboxBtn = "";
                } else {
                    createAndAppendFeqCombo(checkboxBtn, colName, columns, i, chekboxesDiv);
                }
                $("#" + colName).on('click', function(e) {
                    hideUnhideColumns(e.currentTarget, matrixGridId);
                });
            }
        }
    }
}

function createAndAppendFeqCombo(checkboxBtn, colName, columns, i, chekboxesDiv) {
    checkboxBtn = $('<tr><td class="checkboxGroup-rows left-padding2"><input checked type="checkbox" class="mtrixchkbox" id="' + colName + '" />' + '<label for="' + colName + '" class="label_style matrix_chkboxlabel">' + 'Freq Wk' + '</label>' + '<label style="padding-right: 5px;">Default week</label>' + '<select style="width: 50px;" id="freqComboSettings" onchange="changeFreqHandler(this)"></select>' + '</td></tr>');
    checkboxBtn.appendTo('#' + chekboxesDiv);
    checkboxBtn = "";
    if (isFiveWeekPlan()) {
        createComboBox('freqComboSettings', [0, 1, 2, 3, 4, 5]);
    } else {
        createComboBox('freqComboSettings', [0, 1, 2, 3, 4]);
    }
}

/**
 * onChange event of week dropdown in display option.
 * Event to set total frequency for selected week.
 */

function changeFreqHandler(freqCombo) {
    var grid = AdvancedDataGrid.getAdvancedDataGrid(getContainerId());
    var groupByColumns = getGroupByColumnsArr(getContainerId());
    if (groupByColumns && groupByColumns.length > 0) {
        grid.setDataProvider(
        dynamicMultipleGroupBy(updateResponseHandler(JSON.parse(getMatrixData(getContainerId())).slice(), false), flexiciousNmsp.UIUtils.extractPropertyValues(groupByColumns, "dataField"), "(None)", null, [], false, getIdColumn()));
    } else {
        grid.setDataProvider(updateResponseHandler(JSON.parse(getMatrixData(getContainerId())).slice(), false));
    }
    grid.expandAll();
};

/**
 * Flight Freq method
 * Method to get Flight Freq String on effective days
 */

function buildFlightFreqStr(totalDays) {
    var flightFreqStr = totalDays.trim();
    for (var i = 0; i < 7; i++) {
        if (flightFreqStr.charAt(i) == "-") {
            flightFreqStr = flightFreqStr.replace(flightFreqStr.charAt(i), "0");
        } else if(flightFreqStr.charAt(i) == "C") {
            flightFreqStr = flightFreqStr.replace(flightFreqStr.charAt(i), "0");
        } else if (flightFreqStr.charAt(i) == "H") {
            flightFreqStr = flightFreqStr.replace(flightFreqStr.charAt(i), "1");
        } else {
            flightFreqStr = flightFreqStr.replace(flightFreqStr.charAt(i), "1");
        }
    }
    return flightFreqStr;
}

/**
 * Flight Freq method
 * Method to get Flight Freq String on effective days
 */

function buildTotalFlightCount(totalDays) {
    var fltCount = 0;
    for (var i = 0; i < totalDays.length; i++) {
        var flightFreqStr = totalDays[i].trim();
        for (var j = 0; j < 7; j++) {
            if (flightFreqStr.charAt(j) != "-" && flightFreqStr.charAt(j) != "C") {
                fltCount = fltCount + 1;
            }
        }
    }
    return fltCount;
}

/**
 * Freq columns template.
 * Method to apply freq week columns template on Schedule matrix data.
 * If the CHANGE_FLAG is 'D'. It means leg is deleted.
 */

function applyFreqTemplate(changeFlag, totalFltFreq) {

    if (changeFlag == parent.OPERATION_CD_DELETE) {
        return '<span style="color:#ff0000">' + totalFltFreq + '</span>';
    }

    return parseInt(totalFltFreq);
}

/**
 * base map change handler....
 * @param baseMapsCmb
 */
/*
function changeFreqHandler(freqCombo) {
	applyFavoriteSettings=true;
	if(freqCombo.value != null && freqCombo.value != EMPTY_STRING){
		favFilter = jQuery.parseJSON('{"filters":[{"field":"FREQ","operator":"eq","value":'+ freqCombo.value +'}],"logic":"and"}');
	}else{
		favFilter = EMPTY_STRING; 
	}	
	applyMatrixSortFilterGroupByFavoriteSettings();
}  */
/**
 * create a combo box for the provided divId.
 * @param divId
 * @param data
 * @param dataTextField
 * @param dataValueField
 * @returns
 */

function createComboBox(divId, data, dataTextField, dataValueField, selectIndex) {
    var comboObj = createKendoComboBoxByDiv($("#" + divId), EMPTY_STRING, FILTER_TYPE_STARTS_WITH, data, dataTextField, dataValueField);
    if (selectIndex != undefined) {
        comboObj.data("kendoComboBox").select(selectIndex);
    } else {
        comboObj.data("kendoComboBox").select(1);
    }


    return comboObj;
}

function createKendoComboBoxByDiv(comboDiv, placeholder, filterType, dataSource, dataTextField, dataValueField) {
    //create kendoComboBox UI component
    return comboDiv.kendoComboBox({
        minLength: 0,
        dataSource: dataSource,
        filter: filterType,
        placeholder: placeholder,
        dataTextField: dataTextField,
        dataValueField: dataValueField,
        change: function(e) {
            //changes for defect #385
            if (e.sender._oldIndex < 0) {
                e.sender.text("");
            }
        }
    });
}
/**
 * Hide/Unhide columns
 * Method to hide/unhide columns
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 * @param chkObj - check box object
 * @param columsArry - matrix columns array
 */

function hideUnhideColumns(chkObj, matrixGridId, columsArry, hideColumnsArr) {

    // Is plan is 5 week plan, Add week 5 columns in the matrix column array.
    if (isFiveWeekPlan()) {
        if ((chkObj.id == "Effective_DaysAll_Local_Columns" || chkObj.id == "All_Local_Columns") && !isExists(columsArry, "EFFWEEKSL_W5")) {
            columsArry.push("EFFWEEKSL_W5");
        } else if ((chkObj.id == "Effective_DaysAll_Zulu_Columns" || chkObj.id == "All_Zulu_Columns") && !isExists(columsArry, "EFFWEEKSZ_W5")) {
            columsArry.push("EFFWEEKSZ_W5");
        } else if ((chkObj.id == "Route_Effective_DaysAll_Local_Columns" || chkObj.id == "All_Local_Columns") && !isExists(columsArry, "RTEEFFWEEKSL_W5")) {
            //if (matrixGridId == getScheduleTreeGridContainerId()) {
            columsArry.push("RTEEFFWEEKSL_W5");
            //}
        } else if ((chkObj.id == "Route_Effective_DaysAll_Zulu_Columns" || chkObj.id == "All_Zulu_Columns") && !isExists(columsArry, "RTEEFFWEEKSZ_W5")) {
            //if (matrixGridId == getScheduleTreeGridContainerId()) {
            columsArry.push("RTEEFFWEEKSZ_W5");
            //}
        }
    } else {
        var index = -1;
        var indexRte = -1;
        if ((chkObj.id == "Effective_DaysAll_Local_Columns" || chkObj.id == "All_Local_Columns") && isExists(columsArry, "EFFWEEKSL_W5")) {
            var index = columsArry.indexOf("EFFWEEKSL_W5");
        } else if ((chkObj.id == "Effective_DaysAll_Zulu_Columns" || chkObj.id == "All_Zulu_Columns") && isExists(columsArry, "EFFWEEKSZ_W5")) {
            var index = columsArry.indexOf("EFFWEEKSZ_W5");
        } else if ((chkObj.id == "Route_Effective_DaysAll_Local_Columns" || chkObj.id == "All_Local_Columns") && isExists(columsArry, "RTEEFFWEEKSL_W5")) {
            var index = columsArry.indexOf("RTEEFFWEEKSL_W5");
        } else if ((chkObj.id == "Route_Effective_DaysAll_Zulu_Columns" || chkObj.id == "All_Zulu_Columns") && isExists(columsArry, "RTEEFFWEEKSZ_W5")) {
            var index = columsArry.indexOf("RTEEFFWEEKSZ_W5");
        }
        if (index > -1) {
            columsArry.splice(index, 1);
        }
    }


    if (hideColumnsArr != null && hideColumnsArr.length > 0) {
        for (var p = 0; p < hideColumnsArr.length; p++) {
            //grid.hideColumn(hideColumnsArr[p]);
            AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, hideColumnsArr[p], false);
        }
    }
    // Based on the checkbox state, show/hide columns in matrix.
    if (columsArry != null) {
        if (chkObj.checked) {
            for (var i = 0; i < columsArry.length; i++) {
                AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, columsArry[i], true);
            }
        } else {
            for (var i = 0; i < columsArry.length; i++) {
                AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, columsArry[i], false);
            }
        }
    } else {
        if (chkObj.checked) {
            AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, chkObj.id, true);
        } else {
            AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, chkObj.id, false);
        }
    }
    // If request is coming from Volume utilization matrix, call hideUnhideIBOBColumns method to show/hide IBOB columns.
    if (matrixGridId[0] === "volumeUtilizationTreeGridMatrixContainer") {
        hideUnhideIBOBColumns(chkObj.checked, chkObj.id);
    }
}

/**
 * Hide/Unhide columns
 * Method to hide/unhide IBOB columns
 * @param currentState - Current state of checkbox.
 * @param currentTargetId - checkbox Id
 */

function hideUnhideIBOBColumns(currentState, currentTargetId) {

    if (currentTargetId == "All_Local_Columns") {
        for (var i = 0; i < ibobOpenMatrixIds.length; i++) {
            hideUnhideMatrixColumns("IBOBMatrix" + ibobOpenMatrixIds[i], LOCAL_COLUMNS_IBOB, !currentState);
        }

    } else if (currentTargetId == "All_Zulu_Columns") {
        for (var i = 0; i < ibobOpenMatrixIds.length; i++) {
            hideUnhideMatrixColumns("IBOBMatrix" + ibobOpenMatrixIds[i], ZULU_COLUMNS_IBOB, !currentState);
        }
    }
}

/** Method of favorites - start */

/**
 * Matrix column setting
 * Method to get favorite column settings
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 */

function getColumnsSettings(matrixGridId) {
    var favoriteNetworkMatrix = {};
    //	$.merge($("#displayOptionsDiv input[type='radio']:checked"),$("#displayOptionsDiv input[type='radio']:checked"));
    var itemsList = $.merge($("#displayOptionsDiv input[type='radio']"), $("#displayOptionsDiv input[type='checkbox']"));
    for (var i = 0; i < itemsList.length; i++) {
        favoriteNetworkMatrix[itemsList[i].id] = itemsList[i].checked;
    }
    //to add the settings for Totals for each break Grand totals
    if ($('#totalsforeachbreakChk')[0] != null) favoriteNetworkMatrix[$('#totalsforeachbreakChk')[0].id] = $('#totalsforeachbreakChk')[0].checked;
    if ($('#grandtotalsChk')[0] != null) favoriteNetworkMatrix[$('#grandtotalsChk')[0].id] = $('#grandtotalsChk')[0].checked;
    if ($('#freqComboSettings')[0] != null) favoriteNetworkMatrix['freqComboSettings'] = $('#freqComboSettings')[0].value;
    return favoriteNetworkMatrix;
}

/**
 * Matrix content setting
 * Method to get favorite content favorite settings
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 */

function getMatrixContentFavoriteSettings(matrixGridId) {
    var favoriteNetworkMatrix = {};

    var columnsArray = getVisibleColumnsWithIDColumn(matrixGridId);
    var columns = {};
    for (var i = 0; i < columnsArray.length; i++) {
        columns[columnsArray[i].getDataField()] = {
            field: columnsArray[i].getDataField(),
            width: columnsArray[i].getWidth(),
            isVisible: columnsArray[i].getVisible
        };
    }

    favoriteNetworkMatrix["columns"] = columns;
    favoriteNetworkMatrix["preferences"] = AdvancedDataGrid.getPreferences(matrixGridId);
    favoriteNetworkMatrix["groupByColumns"] = JSON.stringify(getGroupByColumnNames(matrixGridId));
    // To apply group by/sort/filter params to the matrix.
/*favoriteNetworkMatrix["gridGroupBy"] = JSON.stringify(($("#" + matrixGridId).data("kendoGrid").dataSource._group), parent.replacer);
    favoriteNetworkMatrix["gridSortedBy"] = JSON.stringify(($("#" + matrixGridId).data("kendoGrid").dataSource._sort), parent.replacer);
    favoriteNetworkMatrix["gridFilterBy"] = JSON.stringify(($("#" + matrixGridId).data("kendoGrid").dataSource._filter), parent.replacer);*/
    return favoriteNetworkMatrix;
}

function getGroupByColumnNames(matrixGridId) {
    var groupArray;
    groupByColumns = getGroupByColumnsArr(matrixGridId);
    if (groupByColumns != undefined && groupByColumns.length > 0) {
        groupArray = [];
        for (var i = 0; i < groupByColumns.length; i++) {
            groupArray.push({
                "dataField": groupByColumns[i].getUniqueIdentifier(),
                "headerText": groupByColumns[i].getHeaderText()
            });
        }
    }
    return groupArray;
}


/**
 * Matrix column setting
 * Method to set favorite column settings
 * @param displayOptionSettings - matrix display option setting configuration.
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 */

function setColumnsSettings(displayOptionSettings, matrixGridId) {
    var itemsList = $.merge($("#displayOptionsDiv input[type='radio']"), $("#displayOptionsDiv input[type='checkbox']"));
    var reservedDisplayOptionColumnsMap;
    var timeZoneColumnsSettings = getTimeZoneColumnsSettings();
    var aggregateColumnsSettings = getAggregateColumnsSettings();
    var chkMap;
    // Iterating through all the checkboxes and set it as per gavorites.
    for (var i = 0; i < itemsList.length; i++) {
        itemsList[i].checked = displayOptionSettings[itemsList[i].id];
        reservedDisplayOptionColumnsMap = timeZoneColumnsSettings;
        chkMap = reservedDisplayOptionColumnsMap[itemsList[i].id];
        if (chkMap == null || chkMap.length <= 0) {
            reservedDisplayOptionColumnsMap = aggregateColumnsSettings;
            chkMap = reservedDisplayOptionColumnsMap[itemsList[i].id];
        }
        if (chkMap == null || chkMap.length <= 0) {
            chkMap = [itemsList[i].id];
        }
        // method to hide/unhide columns  
        hideUnhideMatrixColumns(matrixGridId, chkMap, !itemsList[i].checked);
    }
    var itemsList = $("#timeRelatedcolumnsDiv input[type='radio']");
    for (var i = 0; i < itemsList.length; i++) {
        if (((itemsList[i]).id).indexOf("All_Local_Columns") >= 0) {
            if ($("#Effective_DaysAll_Local_Columns")[0].checked || ($("#Route_Effective_DaysAll_Local_Columns")[0] != undefined && $("#Route_Effective_DaysAll_Local_Columns")[0].checked)) {
                $(itemsList[i]).removeAttr("disabled");
            } else {
                $(itemsList[i]).attr('disabled', 'disabled');
            }
        }
        if (((itemsList[i]).id).indexOf("All_Zulu_Columns") >= 0) {
            if ($("#Effective_DaysAll_Zulu_Columns")[0].checked || ($("#Route_Effective_DaysAll_Local_Columns")[0] != undefined && $("#Route_Effective_DaysAll_Zulu_Columns")[0].checked)) {
                $(itemsList[i]).removeAttr("disabled");
            } else {
                $(itemsList[i]).attr('disabled', 'disabled');
            }
        }
    }
    //to add the settings for Totals for each break Grand totals
    if ($('#totalsforeachbreakChk')[0] != null) {
        $('#totalsforeachbreakChk')[0].checked = displayOptionSettings[$('#totalsforeachbreakChk')[0].id];
        hideUnhideMatrixColumns(matrixGridId, [$('#totalsforeachbreakChk')[0].id], !$('#totalsforeachbreakChk')[0].checked);
    }
    if ($('#grandtotalsChk')[0] != null) {
        $('#grandtotalsChk')[0].checked = displayOptionSettings[$('#grandtotalsChk')[0].id];
        hideUnhideMatrixColumns(matrixGridId, [$('#grandtotalsChk')[0].id], !$('#grandtotalsChk')[0].checked);
    }
    if ($('#freqComboSettings')[0] != null) {
        $("#freqComboSettings").data("kendoComboBox").value(displayOptionSettings['freqComboSettings']);
    }
}

function setEffectiveSeperateDays() {
    var weekColumnsL = commonMatrixConstants.WEEK_COLUMNS_L;
    var weekColumnsZ = commonMatrixConstants.WEEK_COLUMNS_Z;
    if (getMatrixID().indexOf(getScheduleTreeGridContainerId()) >= 0 || getMatrixID().indexOf("volumeUtilizationTreeGridMatrixContainer") >= 0) {
        weekColumnsL = $.merge(commonMatrixConstants.WEEK_COLUMNS_L, commonMatrixConstants.ROUTE_WEEK_COLUMNS_L);
        weekColumnsZ = $.merge(commonMatrixConstants.WEEK_COLUMNS_Z, commonMatrixConstants.ROUTE_WEEK_COLUMNS_Z);
    }
    if ($("#Separate_ColumnsAll_Zulu_Columns")[0].checked) {
        hideUnhideMatrixColumns(getMatrixID(), weekColumnsZ, !isFiveWeekPlan());
    } else {
        hideUnhideMatrixColumns(getMatrixID(), weekColumnsZ, true);
    }
    if ($("#Separate_ColumnsAll_Local_Columns")[0].checked) {
        hideUnhideMatrixColumns(getMatrixID(), weekColumnsL, !isFiveWeekPlan());
    } else {
        hideUnhideMatrixColumns(getMatrixID(), weekColumnsL, true);
    }
/*if(getMatrixID() instanceof Array){
		var containerIds = getMatrixID();
		if(containerIds != undefined){
			for(var i=0; i<containerIds.length; i++){
				if ($("#Separate_ColumnsAll_Zulu_Columns")[0].checked) {
			        hideUnhideMatrixColumns(containerIds[i], weekColumnsZ, !isFiveWeekPlan());
			    } else {
			        hideUnhideMatrixColumns(containerIds[i], weekColumnsZ, true);
			    }
			    if ($("#Separate_ColumnsAll_Local_Columns")[0].checked) {
			        hideUnhideMatrixColumns(containerIds[i], weekColumnsL, !isFiveWeekPlan());
			    } else {
			        hideUnhideMatrixColumns(containerIds[i], weekColumnsL, true);
			    }
			}
		}
    }*/


}
/**
 * Matrix content setting
 * Method to set favorite contents settings
 * @param contentSettings - destroy the grid and intialize the grid with the content settings.
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 */

function setMatrixContentFavoriteSettings(matrixGridId, contentSettings) {

    $('#' + matrixGridId).empty();
    applyFavoriteSettings = true;
    initialize(false, contentSettings);

/*    setTimeout(function() {
        var grid = $("#" + matrixGridId).data("kendoGrid");
        grid.hideColumn(0);
        grid.showColumn(0);
    }, 500);*/
    setEffectiveSeperateDays();
/*var columns = contentSettings.columns;
	if (columns != undefined) {
		for(var j=0; j<columns.length; j++) {
			resizeMatrixColumns(matrixGridId, j, (columns[j]).width);
		}
	}*/
}

/**
 * Matrix column resizing
 * Method to resize matrix columns
 * @param idx - column ids.
 * @param matrixGridId - matrix grid id (Network, Schedule etc).
 * @param width - width of the column
 */
/** Method of favorites - end */

function resizeMatrixColumns(matrixGridId, idx, width) {
    $("#networkMatrixGrid").find(".k-grid-header-wrap").find("colgroup col").eq(idx).css({
        width: width
    });
    $("#networkMatrixGrid").find(".k-grid-content").find("colgroup col").eq(idx).css({
        width: width
    });
    $("#networkMatrixGrid").find(".k-grid-footer").find("colgroup col").eq(idx).css({
        width: width
    });
}

/** Method of favorites - end */

/**
 * Show local/zulu columns
 * Method to show local/zulu columns
 * @param toggleBtn - instance of toggle button.
 */

function showLocalZuluColumns(toggleBtn) {
    showColumns(getLocalColumns(), toggleBtn.toggled);
    showColumns(getZuluColumns(), !toggleBtn.toggled);
    parent.toggleTimeView(toggleBtn);
}

/**
 * Show local/zulu columns
 * Method to remove highlight
 */

function removeHighlight() {
    var btnSyncMap = parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
    var btnSyncSchematic = parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');

    parent.highlightBtn(btnSyncMap.parent()[0], false);
    parent.highlightBtn(btnSyncSchematic.parent()[0], false);
/*	if(parent.isNetworkQuery) {
		parent.highlightBtn($("#btnNetworkMatrixSyncMap", parent.document)[0], false);
		parent.highlightBtn($("#btnNetworkMatrixSyncSchematic", parent.document)[0], false);
	} else {
		parent.highlightBtn($("#btnScheduleMatrixSyncMap", parent.document)[0], false);
		parent.highlightBtn($("#btnScheduleMatrixSyncSchematic", parent.document)[0], false);
	}*/
}

/**
 * Show columns
 * Method to show columns
 * @param columnsArray - instance of toggle button.
 * @param isShow - Flag to determine if we have to show or hide matrix columns.
 */

function showColumns(columnsArray, isShow) {
    if (columnsArray) {
        var grid = $("#" + matrixID).data("kendoGrid");
        for (var i = 0; i < columnsArray.length; i++) {
            if (isShow) {
                grid.showColumn(columnsArray[i]);
            } else {
                grid.hideColumn(columnsArray[i]);
            }
        }
    }
}

/**
 * Replace all
 * Method to replace all occurences of a string
 * @param stringToFind - String to find.
 * @param stringToReplace - String to replace.
 */

function replaceAll(string, stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    var index = string.indexOf(stringToFind);
    while (index != -1) {
        string = string.replace(stringToFind, stringToReplace);
        index = string.indexOf(stringToFind);
    }
    return string;
};

/**
 * Reserved Display option labels
 * Method to get reserved display option columns labels
 */

function getReservedDisplayOptionColumnsLabelsMap() {
    var map = new Object();
    map["All_Weight_Columns"] = [All_Weight_Columns_Label];
    map["All_Pieces_Columns"] = [All_Pieces_Columns_Label];
    map["All_Cube_Columns"] = [All_Cube_Columns_Label];
    map["All_Zulu_Columns"] = [All_Zulu_Columns_Label];
    map["All_Local_Columns"] = [All_Local_Columns_Label];
    return map;
}
/**
 * Reserved Display option labels
 * Method to get reserved display option columns labels
 */

function getVolumeDisplayOptionLabelsMap() {
    var map = new Object();
    map["All_Weight_Columns"] = [Product_Grp_Item_Wt];
    map["All_Cube_Columns"] = [Product_Grp_Item_Cu];
    map["All_Pieces_Columns"] = [Product_Grp_Item_Pcs];
    return map;
}
/**
 * Calendar row editor
 * Method for Calendar row editor
 * @param grid_Id - matrix grid id.
 * @param localZuluFlag - Flag to determine if the control is local or zulu.
 */

function calenderRowEditor(model, grid_Id, localZuluFlag) {
    return "<img src ='" + ICON_IMAGE_PATH_DAYS + "' onclick=calenderRowHandler(this," + grid_Id + ",'" + localZuluFlag + "') isOpenState='false'/>";
}

function calLabelFunction(item, column, cell) {
    if (dashboardID == parent.DASHBOARD_ID_NETWORK_MATRIX) {
        setCellStyle(6, cell);
    }

/*if (item.children != undefined && item.children.length > 0) {
        return "";
    }*/
    if (item.children != undefined && item.children.length > 0) {
        return "";
    }
    var headerTxt = column.getHeaderText().replace("&nbsp;", "<img src='pegasus/assets/icons/calendar_12px.png' isopenstate='false'>");

    //return "<span title='"+matrixColumn.headerText +"'>" +"<img src='pegasus/assets/icons/calendar_12px.png' isopenstate='false'>" +"</span>";
    return headerTxt;
}


function reverseIndent(item, col, cell) {
    if (parent.VIEWER.getIsFullRouting()) {
        if (typeof cell == "undefined") cell = null;

        if (cell != undefined && "ORIGIN,DESTINATION,PATH_SEQ".indexOf(col.getDataField()) >= 0) {
            setCellStyle(parseInt(item["PATH_SEQ"]), cell);
        } else if (cell != undefined) {
            setCellStyle(6, cell);
        }
    }
    return flexiciousNmsp.UIUtils.resolveExpression(item, col.getDataField());
};


function setCellStyle(seqNumber, cell) {
    if (cell == undefined) {
        return;
    }
    var labelDomElement = $(cell.domElement).find("label");
    removeAllCellStyles(seqNumber, labelDomElement);
    switch (seqNumber) {
    case 1:
    case -5:
        if (!labelDomElement.hasClass("level1")) {
            labelDomElement.addClass("level1");
        }
        break;
    case 2:
    case -4:
        if (!labelDomElement.hasClass("level2")) {
            labelDomElement.addClass("level2");
        }
        break;
    case 3:
    case -3:
        if (!labelDomElement.hasClass("level3")) {
            labelDomElement.addClass("level3");
        }
        break;
    case 4:
    case -2:
        if (!labelDomElement.hasClass("level4")) {
            labelDomElement.addClass("level4");
        }
        break;
    case 5:
    case -1:
        if (!labelDomElement.hasClass("level5")) {
            labelDomElement.addClass("level5");
        }
        break;
    default:
        if (!labelDomElement.hasClass("level1")) {
            //labelDomElement.addClass("level1");
        } else {
            labelDomElement.removeClass("level1");
        }
        break;
    }
}

function removeAllCellStyles(seqNumber, labelDomElement) {
    labelDomElement.removeClass("level1");
    labelDomElement.removeClass("level2");
    labelDomElement.removeClass("level3");
    labelDomElement.removeClass("level4");
    labelDomElement.removeClass("level5");
}

/**
 * Checkbox row editor
 * Method for Checkbox row editor
 * @param grid_Id - matrix grid id.
 * This is not being used anywhere
 */
/** checkbox row editor */

function checkboxRowEditor(model, grid_Id) {
    return "<input type='checkbox' id='" + model.LANE_ID + "' class='tickCheckBox'/><label></label>";
}

/** Method to check if plan is five week plan or four week */

function isFiveWeekPlan() {
    var weekPlan = parent.getSelectedPlanWeek();
    if (weekPlan == 5) {
        return true;
    }
    return false;
}

/** Method to get effective days configuration string */

function getEffDaysConfiguration() {
    var effDaysLabels = parent.getEffDaysConfiguration();
    var effDaysArray;
    if (effDaysLabels != undefined) {
        effDaysArray = effDaysLabels.toString().split(",");
    }

    return effDaysArray;
}

/**
 * Update Grid column headers
 * Method to update grid column headers
 * @param effDaysHeader - effective days colume header string.
 * @param grdId - matrix grid id.
 */
/** Method to update grid column headers */

function updateGridColumnHeaders(effDaysHeader, grdId) {
    var effDaysArray = effDaysHeader.toString().split(",");
    var columnNameL = "EFFDAYSL_D";
    var columnNameZ = "EFFDAYSZ_D";
    var dayColL = "(L)";
    var dayColZ = "(Z)";
    if (effDaysArray != null) {
        for (var i = 0; i < effDaysArray.length; i++) {
            // for local columns
            $("#" + grdId + " thead th[data-field='" + columnNameL + (i + 1) + "'] .k-link").html(effDaysArray[i] + dayColL);
            $("#" + grdId + " thead th[data-field='" + columnNameL + (i + 1) + "']").attr("title", effDaysArray[i] + dayColL);
            // for zulu columns
            $("#" + grdId + " thead th[data-field='" + columnNameZ + (i + 1) + "'] .k-link").html(effDaysArray[i] + dayColZ);
            $("#" + grdId + " thead th[data-field='" + columnNameZ + (i + 1) + "']").attr("title", effDaysArray[i] + dayColZ);
        }
    }
}

/**
 * Hide/Unhide matrix columns
 * Method to hide/unhide columns
 * @param matrixGridId - matrix grid id.
 * @param columsArry - array of matrix columns.
 * @param isHide - Flag to determine if the column has to be hidden or not.
 */

function hideUnhideMatrixColumns(matrixGridId, columsArry, isHide) {
    if (columsArry != null) {
        if (isHide) {
            for (var i = 0; i < columsArry.length; i++) {
                AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, columsArry[i], false);
            }
        } else {
            for (var i = 0; i < columsArry.length; i++) {
                AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, columsArry[i], true);
            }
        }
    }
}

/**
 * hide local/zulu matrix columns
 * Method to hide local or zulu columns
 * @param matrixGridId - matrix grid id.
 * @param localColums - array of local columns.
 * @param zuluColumns - array of zulu columns.
 * @param isLocal - Flag to determine if the column is local column or not.
 */

function showLocalOrZuluMatrixColumns(matrixGridId, localColums, zuluColumns, isLocal) {
    var favoriteComponent = getFavoriteComponent();
    if (favoriteComponent != undefined && favoriteComponent.defaultfavorite != undefined && !favoriteComponent.defaultfavorite) {

        if (localColums != null && zuluColumns != null) {
            if (!isLocal) {
                for (var i = 0; i < localColums.length; i++) {
                    AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, localColums[i], false);
                }
            } else {
                for (var i = 0; i < zuluColumns.length; i++) {
                    AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(matrixGridId, zuluColumns[i], false);
                }
            }
        }
    }
}

/** Method to check if id exists in values */

function isExists(values, id) {
    for (var i = 0; i < values.length; i++) {
        if (values[i] == id) {
            return true;
        }
    }
    return false;
}

/** Method to add product group column headers */

function addProductGroupColumnHeaders(grdId) {
    destroy(grdId);
}

/** Method to destroy grid */

function destroy(grdId) {
    resetDashboard(true, false, false);
}

/** Method to get distance configuration setting */

function isDistanceInKmsFlag() {
    var distanceFlag = parent.isDistanceInKmsFlag();
    return distanceFlag;
}

/** Method to get timezone configuration setting */

function isLocalTimeFlag() {
    var localFlag = parent.isLocalTimeFlag();
    return localFlag;
}

/**
 * get visible matrix columns
 * Method to get visible columns
 * @param grid - matrix grid id.
 */

function getVisibleColumns(grid) {
    if (grid == undefined) {
        grid = $("#" + getMatrixID()).data("kendoGrid");
    }

    var columns = grid.columns;
    var columnTitles = [];
    var noOfColumns = columns.length;
    for (var i = 0; i < noOfColumns; i++) {
        if (columns[i].hidden != true && columns[i].field != getIdColumn()) {
            columnTitles.push(columns[i]);
        }
    }
    return columnTitles;
}

function formatHolidayString(holEffDays) {
    if (holEffDays != null) {
        var holDayStringArray = holEffDays.split(",");
        var weeks = [];
        var holidays = [];
        for (var i = 0; i < holDayStringArray.length; i++) {
            weeks = holDayStringArray[i].split(" ");
            if (weeks && weeks.length == 2) {
                for (var j = 0; j < weeks[1].length; j++) {
                    holidays[weeks[1].charAt(j)] = weeks[0];
                }
            }
        }
        return holidays;
    }
    return "";
}

/**
 * Effective days template.
 * Method to apply effective days template on Schedule matrix data.
 * If the CHANGE_FLAG is 'D'. It means leg is deleted.
 * If the CHANGE_FLAG is 'H'. It means A new flight is added that day .
 * If the CHANGE_FLAG is 'D'. It means There was a schedule flight but latest cancelled.
 */


function applyEffectiveDaysDayTemplate(cell, dataItem, daysColumn, holidayDaysColumn, index) {
    var lvl = cell.level.getNestDepth();
    if (cell.rowInfo.getIsDataRow() && dataItem[daysColumn + index]) {
        var effDaysDay = dataItem[daysColumn + index];
        var holEffDays = dataItem[holidayDaysColumn];
        var holidays = formatHolidayString(holEffDays);
        for (var i = 0; i < holidays.length; i++) {
            if (holidays[i].charAt(index - 1) == 'H' && effDaysDay != '-') {
                return 0xFBEA74;
            } else if (holidays[i].charAt(index - 1) == 'C' && effDaysDay != '-') {
                return 0xff0000;
            }
        }
        if ((daysColumn == "EFFDAYSL_D" && isNoOpDay(dataItem.NOOP_DAYS_L, dataItem.FULL_EFFDT_L, index)) || (daysColumn == "RTEEFFDAYSL_D" && isNoOpDay(dataItem.ROUTE_NOOP_DAYS_L, dataItem.ROUTE_FULL_EFFDT_L, index))) {
            // return '<span style="background-color:#7e7e7e;display:block;">' + effDaysDay + '</span>';
            return 0x7e7e7e;
        } else if ((daysColumn == "EFFDAYSZ_D" && isNoOpDay(dataItem.NOOP_DAYS_Z, dataItem.FULL_EFFDT_Z, index)) || (daysColumn == "RTEEFFDAYSZ_D" && isNoOpDay(dataItem.ROUTE_NOOP_DAYS_Z, dataItem.ROUTE_FULL_EFFDT_Z, index))) {
            //return '<span style="background-color:#7e7e7e;display:block;">' + effDaysDay + '</span>';
            return 0x7e7e7e;
        }
        cell.domElement.isStyled = true;
        //return false;
    }
    return 0xFFFFFF;
}

/**
 * Effective days week template.
 * Method to apply effective days template on Schedule matrix data.
 * If the CHANGE_FLAG is 'D'. It means leg is deleted.
 */

function applyEffectiveDaysWeekTemplate(cell, dataItem, weeksColumn, index) {
    var lvl = cell.level.getNestDepth();
    if (cell.rowInfo.getIsDataRow()) {
        var effDaysWeek = dataItem[weeksColumn + index];

        var isHolWeekL = isHolidayWeek(dataItem.LEG_HOL_DAYS_L, dataItem.FULL_EFFDT_L, index);
        var isHolWeekZ = isHolidayWeek(dataItem.LEG_HOL_DAYS_Z, dataItem.FULL_EFFDT_Z, index);
        var isRouteHolWeekL = "";
        var isRouteHolWeekZ = "";
        if (getMatrixID().indexOf("locAllocMatrixGrid") <= -1) {
            isRouteHolWeekL = isHolidayWeek(dataItem.ROUTE_HOL_DAYS_L, dataItem.ROUTE_FULL_EFFDT_L, index);
            isRouteHolWeekZ = isHolidayWeek(dataItem.ROUTE_HOL_DAYS_Z, dataItem.ROUTE_FULL_EFFDT_Z, index);
        }

        if ((weeksColumn == "EFFWEEKSL_W" && isHolWeekL == "C") || (weeksColumn == "EFFWEEKSZ_W" && isHolWeekZ == "C") || (weeksColumn == "RTEEFFWEEKSL_W" && isRouteHolWeekL == "C") || (weeksColumn == "RTEEFFWEEKSZ_W" && isRouteHolWeekZ == "C")) {
            //return '<span style="background-color:#ff0000;display:block;">' + effDaysWeek + '</span>';
            return 0xff0000;
        } else if ((weeksColumn == "EFFWEEKSL_W" && isHolWeekL == "H") || (weeksColumn == "EFFWEEKSZ_W" && isHolWeekL == "H") || (weeksColumn == "RTEEFFWEEKSL_W" && isRouteHolWeekL == "H") || (weeksColumn == "RTEEFFWEEKSZ_W" && isRouteHolWeekZ == "H")) {
            //return '<span style="background-color:#FBEA74;display:block;">' + effDaysWeek + '</span>';
            return 0xFBEA74;
        } else if (weeksColumn == "EFFWEEKSL_W" && isNoOpWeek(dataItem.NOOP_DAYS_L, dataItem.FULL_EFFDT_L, index) || (weeksColumn == "RTEEFFWEEKSL_W" && isNoOpWeek(dataItem.ROUTE_NOOP_DAYS_L, dataItem.ROUTE_FULL_EFFDT_L, index))) {
            //return '<span style="background-color:#7e7e7e;display:block;">' + effDaysWeek + '</span>';
            return 0x7e7e7e;
        } else if (weeksColumn == "EFFWEEKSZ_W" && isNoOpWeek(dataItem.NOOP_DAYS_Z, dataItem.FULL_EFFDT_Z, index) || (weeksColumn == "RTEEFFWEEKSZ_W" && isNoOpWeek(dataItem.ROUTE_NOOP_DAYS_Z, dataItem.ROUTE_FULL_EFFDT_Z, index))) {
            //return '<span style="background-color:#7e7e7e;display:block;">' + effDaysWeek + '</span>';
            return 0x7e7e7e;
        }
        cell.domElement.isStyled = true;
        return 0xFFFFFF;
    }
}

/*
function applyEffectiveDaysExceptionTemplate(dataItem, effDays, holEffDays) {
	if (getMatrixID() == getScheduleTreeGridContainerId()) {
		if(dataItem.CHANGE_FLAG == "D") {
			return '<span style="color:#ff0000">' + effDaysDay +'</span>';
		} 
	}
	var effDaysArray = effDays.toString().split(" ");
	var holDaysArray = holEffDays.toString().split(" ");
	var effStr = "";
	for(var i=0; i<effDays.length; i++) {
		if(holEffDays.charAt(i) == 'H' && effDays.charAt(i) != '-') {
			effStr += '<span style="background-color:#FBEA74;">' + effDays.charAt(i) +'</span>';
		} else if(holEffDays.charAt(i) == 'C' && effDays.charAt(i) != '-') {
			effStr += '<span style="background-color:#ff0000;">' + effDays.charAt(i) +'</span>';
		} else if (holEffDays.charAt(i) == 'H' && holEffDays.charAt(i) == effDays.charAt(i)){
			effStr += '<span style="background-color:#FBEA74;">' + effDays.charAt(i) +'</span>';
		} else if (holEffDays.charAt(i) == 'C' && holEffDays.charAt(i) == effDays.charAt(i)){
			effStr += '<span style="background-color:#ff0000;">' + effDays.charAt(i) +'</span>';
		} else {
			effStr += effDays.charAt(i);
		}
	}
	return effStr;
}
*/

function isNoOpDay(noOpDays, weekEffDays, index) {
    var days = [];
    if (noOpDays) {
        var noOpDaysArray = noOpDays.toString().split("X");
        var noOpWeekArray = weekEffDays.toString().split(",");
        for (var i = 0; i < noOpDaysArray.length; i++) {
            var noOpWeek = Math.ceil(noOpDaysArray[i] / 7);
            if (noOpWeek > 0 && noOpWeekArray[noOpWeek] != undefined && noOpWeekArray[noOpWeek].trim() != "-------") {
                var day = parseInt(noOpDaysArray[i]) % 7;
                if (day > -1 && day == index) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isNoOpWeek(noOpDays, weekEffDays, index) {
    var days = [];
    if (noOpDays) {
        var noOpDaysArray = noOpDays.toString().split("X");
        var noOpWeekArray = weekEffDays.toString().split(",");
        for (var i = 0; i < noOpDaysArray.length; i++) {
            var noOpWeek = Math.ceil(noOpDaysArray[i] / 7);
            if (noOpWeek > 0 && noOpWeekArray[noOpWeek] != undefined && noOpWeekArray[noOpWeek].trim() != "-------") {
                //var day = parseInt(noOpDaysArray[i])%7;
                if (noOpWeek == index) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isHolidayWeek(holEffDays, weekEffDays, index) {
    var holWeekArray = formatHolidayString(holEffDays);
    if (holWeekArray && holWeekArray.length >= index) {
        var week = holWeekArray[index];
        if (week && week.indexOf("C") >= 0) {
            return "C";
        } else if (week && week.indexOf("H") >= 0) {
            return "H";
        }
    }
    return "";
}

function cellWhiteBackgroundFunctionHandler(cell) {
    return 0xFFFFFF; //White color
}


/**
 * get visible matrix columns with ID column
 * Method to get visible columns including id column.
 * @param grid - matrix grid id.
 */

function getVisibleColumnsWithIDColumn(gridId) {
/*if (grid == undefined) {
        grid = $("#" + getMatrixID()).data("kendoGrid");
    }

    var columns = grid.columns;
    var columnTitles = [];
    var noOfColumns = columns.length;
    for (var i = 0; i < noOfColumns; i++) {
        if (columns[i].hidden != true) {
            columnTitles.push(columns[i]);
        }
    }
    return columnTitles;*/
    return AdvancedDataGrid.getVisibleColumns(gridId);
}

function showHideDisplayOptions() {
    if (!parent.VIEWER.getIsFullRouting()) {
        $("#ORIGIN_DAY_LAll_Local_Columns").parent().parent().hide();
        $("#ORIGIN_DAY_ZAll_Zulu_Columns").parent().parent().hide();
        $("#ARRIVAL_DAY_LAll_Local_Columns").parent().parent().hide();
        $("#ARRIVAL_DAY_ZAll_Zulu_Columns").parent().parent().hide();
    } else {
        $("#ORIGIN_DAY_LAll_Local_Columns").parent().parent().show();
        $("#ORIGIN_DAY_ZAll_Zulu_Columns").parent().parent().show();
        $("#ARRIVAL_DAY_LAll_Local_Columns").parent().parent().show();
        $("#ARRIVAL_DAY_ZAll_Zulu_Columns").parent().parent().show();
    }
}

/**
 * On clicking on Export icon on matrix header.
 * Method to export matrix data
 * @param evt - Event of export.
 */

function exportToExcel(evt) {
    try {
        // Getting the filted/sorted data if applicable.
        var grid;
        if (parent.VIEWER.getIsFullRouting() && typeof direction != null && direction == "O") {
            grid = AdvancedDataGrid.getAdvancedDataGrid(getMatrixID()[1]);
        } else {
            grid = AdvancedDataGrid.getAdvancedDataGrid(getMatrixID()[0]);
        }
        grid.toolbarExcelHandlerFunction();
        parent.showProgressDialog(true, "Export in progress...");

    } catch (e) {
        parent.showErrorMsg(e.message);
    } finally {
        parent.showProgressDialog(false);
    }

}

/**
 * Method to enable the EditInWip button 
 */
function enableDisableEditInWIP(disableRequest){
    var containerIds = getContainerId();
    //		selected data from the grid 
    var selectedData;
    var isNetworkSchedule = getDashboardID() == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX ? true : false;
    var buttonId  = "routeEdit_" + (isNetworkSchedule);//FDX-1283 "Copy to WIP" button is not getting enabled
    if (containerIds != undefined) {
        for (var i = 0; i < containerIds.length; i++) {
            selectedData = AdvancedDataGrid.getAdvancedDataGrid(containerIds[i]).getSelectedKeys();
            if ((selectedData != undefined && selectedData.length > 0) && !disableRequest) {
            	if(!isEditRouteEnabled)
            		enableDisableBtns(buttonId,!isEditRouteEnabled,"k-icon edit-route","getDashboardContentWindow('" + getDashboardID() + "').openRoutesInWIP('copyRouteToWIP','" +isNetworkSchedule + "')");
            		if(parent.$("#scheduleMaintenanaceMenu")[0] != undefined && !(parent.$("#scheduleMaintenanaceMenu")[0].isHighlighted)){
            			parent.$("#scheduleMaintenanaceMenu").click();
            		}
            	isEditRouteEnabled = true; 
            }else{
            	enableDisableBtns(buttonId,!isEditRouteEnabled,"k-icon edit-route-disable");
            	isEditRouteEnabled = false; 
            }
        }
    }
}
function openRoutesInWIP(uiCmd,isNetworkSchedule){
    if (parent.isByRouteQuery) {
    	var grid = document.getElementById(getContainerId()[0]).component;
        parent.setScheduleMaintenananceMode(uiCmd);
        parent.showProgressDialog(true, "Retrieving route data...");
        parent.callScheduleRouteDataService(grid, null, uiCmd,"callScheduleRouteDataService",null,null,isNetworkSchedule);    	
    } else {
    	showMatrixToWIPConfirmation();
    }

     //   console.log("copy to WIP stating:" +getTime()); //FDX-1183
}
/**
 * function to save the saveToWip, saveToSchedule btns 
 * 
 * @param isSaveFlag
 */
function enableDisableBtns(buttonId,isEnable,className,clickHandler){
	var tempButton = parent.$("#"+ buttonId);
	if(tempButton != undefined && tempButton.length == 1){
		if (isEnable) {
			tempButton[0].children[0].className = className;
			tempButton.attr('onclick', clickHandler).bind('click');
		} else {
			tempButton[0].children[0].className = className;
			tempButton.attr('onclick', '').unbind('click');
		}
	}
}
/**
 * Populate Ids.
 * Method populate matrix Ids if SyncMap or SyncSchematic is true.
 */

function populateIds() {
    //	selected ids to sync
    selectedIds = [];
    var itemSelected = false;
    if (isSyncMap || isSyncSchematic) {
        var containerIds = getContainerId();
        //		selected data from the grid 
        var selectedData;
        //		selected data from the grid 
        var filteredData;
        if (containerIds != undefined) {
            for (var i = 0; i < containerIds.length; i++) {
                selectedData = AdvancedDataGrid.getAdvancedDataGrid(containerIds[i]).getSelectedKeys(); //selected items from the grid 
                filteredData = AdvancedDataGrid.getAdvancedDataGrid(containerIds[i]).getBodyContainer().getFilteredPagedSortedData(true, true, true, true, true, true); //only filtered row form the grid 
                //trying to add the ids in the selected state from the filtered list
                if (selectedData != undefined && filteredData != undefined && selectedData.length > 0 && filteredData.length > 0) {
                    $.each(filteredData, function(f, fItem) {
                        $.each(selectedData, function(i, item) {
                            if (item[getIdColumn()] == fItem[getIdColumn()]) {
                                itemSelected = true;
                                selectedIds.push(item[getIdColumn()]);
                            }
                        });
                    });
                }
                //if we don't have any ids in the filtered list we need to show all selected data on map 
/*if(selectedIds.length == 0 && selectedData != undefined && selectedData.length > 0){
					$.each(selectedData, function(i, item) {
						selectedIds.push(item[getIdColumn()]);
					});	 
				}*/
            }
            for (var i = 0; i < containerIds.length; i++) {
                filteredData = AdvancedDataGrid.getAdvancedDataGrid(containerIds[i]).getBodyContainer().getFilteredPagedSortedData(true, true, true, true, true, true); //only filtered row form the grid 
                //if we don't have any ids selected in the filtered list we need to show all filtered data on map 
                if ((selectedIds.length == 0 || !itemSelected) && filteredData != undefined && filteredData.length > 0) {
                    $.each(filteredData, function(i, item) {
                        selectedIds.push(item[getIdColumn()]);
                    });
                }
            }
            //if still no ids populated show all the ids
            if (selectedIds.length == 0) {
                for (var i = 0; i < containerIds.length; i++) {
                    if (matrixData[containerIds[i]] != null) {
                        $.each(JSON.parse(matrixData[containerIds[i]]), function(i, item) {
                            selectedIds.push(item[getIdColumn()]);
                        });
                    }
                }
            }
            itemSelected = false;
        }
    }
}

function showMatrixToWIPConfirmation() {
	var alertWindow = $("#alertSmToWipWindow");
	if(!alertWindow.data("kendoWindow")) {
		alertWindow.css({display : "block"});
		alertWindow.kendoWindow({
			width: "400px",
			draggable: true,
			modal: true,
			resizable: false,
			actions: [],
			title: "Alert"
		});
	}
	var messageDiv = alertWindow.find("div#confirmationDiv").empty();
	messageDiv.append('<label style="display: table-row;vertical-align: middle;">You have RUN a "by Leg" query. These are for display purposes. In order to modify / save route information, return "by Route."</label>');
	alertWindow.parent("div.k-widget.k-window").addClass('alertWInStyle');
	alertWindow.data("kendoWindow").center();
	alertWindow.data("kendoWindow").open();
}

function okClickHandler(event) {
	if($("#alertSmToWipWindow").data("kendoWindow")) {
		$("#alertSmToWipWindow").data("kendoWindow").close();
	}
}

/**
 * method fired on filterPageSortChange event
 * filterPageSortChangeHandler
 * @param event
 */

function filterPageSortChangeHandler(event) {
    setTimeout(function() {
        if ((event.cause == "filterChange" && !isGrouping && parent.progressDialog.isClosed) || (event.cause == "filterChange" && parent.progressDialog.isClosed)) {
            populateIdsAndSync();
        }
    }, 300);
}
/**
 * Populate Ids and sync.
 * Method populate matrix Ids if SyncMap or SyncSchematic is true and sync.
 */

function populateIdsAndSync() {
    if (isSyncOn) {
        return;
    }

    if (isSyncMap || isSyncSchematic) {
        populateIds();
        syncDashboards();
    }
}

/**
 * Check all checkboxes.
 * Method to select all matrix columns.
 * @param checkbox - checkbox object.
 * This method is not being used anywhere
 */

function selectAllMatrixColumns(checkbox) {
    selectedIds = [];
    var grid = $("#" + getMatrixID()).data("kendoGrid");
    grid.table.find("tr").find("td input").attr("checked", checkbox.checked).trigger("change");
    if (checkbox.checked) {
        grid.table.find("tr").find("td input").each(function() {
            selectedIds.push($(this).attr('id'));
        });
    }
    if (selectedIds.length == 0) {
        populateIds();
    }
    syncDashboards();
}

/**
 * check a checkbox.
 * Event on selecting  matrix columns.
 * @param checkbox - checkbox object.
 * This method is not being used anywhere
 */

function selectMatrixColumn(checkbox) {
    populateIdsAndSync();
    enableDisableEditInWIP();
}

/**
 * check a checkbox.
 * Method on Total for each break checkbox.
 * @param gridId - matrix grid Id.
 * @param evt - checkbox event object.
 */

function onTotalForEachBreak(gridId, evt) {
    // If checkbox event is true, display the total row else not.
    if (evt.checked == true) {
/*  $("#"+gridId).find("div.flexDataGridFooterCell").parent().each(function() {
            $(this).css({
                "display": "table-row"
            });
        });*/
    } else {
/*  $("#"+gridId).find("div.flexDataGridFooterCell").parent().each(function() {
            $(this).css({
                "display": "none"
            });
        });*/
    }
}

/**
 * check a checkbox.
 * Method on Grand Total checkbox.
 * @param gridId - matrix grid Id.
 * @param evt - checkbox event object.
 */

function onGrandTotal(gridId, evt) {
    // If checkbox event is true, display the grand total else not.
    showHideFooter(gridId, evt.checked);
}

function maintainFooterVisibilty(gridId) {
    if ($("#grandtotalsChk")[0] && !$("#grandtotalsChk")[0].checked) {
        setTimeout(function() {
            showHideFooter(gridId, false);
        }, 100);
    }
}

function showHideFooter(gridId, isShow) {
    var grid = $("#" + gridId)[0].component;
    var body = grid.getBodyContainer();
    var footer = grid.getFooterRows()[0];
    var leftBody = grid.getLeftLockedContent();
    var leftFooter = grid.getLeftLockedFooter();
    if (isShow) {
        footer.showHide(true);
        body.setHeight(body.getHeight() - footer.getHeight());
        leftBody.setHeight(leftBody.getHeight() - leftFooter.getHeight());
        $("#" + gridId).find("#bottomBar").show();
    } else {
        footer.showHide(false);
        //body.setHeight(body.getHeight() + footer.getHeight());
        //leftBody.setHeight(leftBody.getHeight() + leftFooter.getHeight());
        body.setHeight(grid.getHeight() - grid.getPagerRowHeight() - grid.getHeaderRowHeight() - grid.getFilterRowHeight());
        leftBody.setHeight(grid.getHeight() - grid.getPagerRowHeight() - grid.getHeaderRowHeight() - grid.getFilterRowHeight());
        $("#" + gridId).find("#bottomBar").hide();
    }
}

function resetVolAndTimeColumns() {
    var itemsList = $.merge($("#volumecolumnsDiv input[type='checkbox']"), $("#timeRelatedcolumnsDiv input[type='checkbox']"));
    for (var i = 0; i < itemsList.length; i++) {
        if (((itemsList[i].id).indexOf("Zulu") < 0 && isLocalTimeFlag()) || (itemsList[i].id).indexOf("Zulu") >= 0 && !isLocalTimeFlag()) {
            itemsList[i].checked = true;
        } else {
            itemsList[i].checked = false;
        }
    }
    itemsList = null;
    itemsList = $("#timeRelatedcolumnsDiv input[type='radio']");
    for (var i = 0; i < itemsList.length; i++) {
        if (((itemsList[i].id).indexOf("Zulu") < 0 && isLocalTimeFlag()) || (itemsList[i].id).indexOf("Zulu") >= 0 && !isLocalTimeFlag()) {
            $(itemsList[i]).removeAttr("disabled");
        } else {
            $(itemsList[i]).attr('disabled', 'disabled');
        }
        if (getContainerId()[0]== 'scheduleMatrixTreeGridDivContainer') {
       	 if (itemsList[i].id== 'Eff_DaysAll_Local_Columns' || itemsList[i].id == "Eff_DaysAll_Zulu_Columns") {
                itemsList[i].checked = true;
            } else {
                itemsList[i].checked = false;
            }
       } else {
       	if ((itemsList[i].id).indexOf("Keyword") >= 0) {
       		itemsList[i].checked = true;
       	} else {
       		itemsList[i].checked = false;
       	}
       }
    }
}
/**
 * Reset matrix display options checkboxes.
 * Method for resetting matrix display options checkboxes.
 * @param matrixGridId - matrix grid Id.
 */

function resetSettingsChkBoxes(matrixGridId) {
    var columns;
    var colName;
    var isColumnResevered;
    var reservedDisplayOptionColumnsMap;

    //create ckeckboxes for reserved colums 
    var labelsMap = getReservedDisplayOptionColumnsLabelsMap();
    reservedDisplayOptionColumnsMap = getAggregateColumnsSettings();
    var hiddenColumns = getReservedColumnsVisiblity();
    resetCheckBoxes(colName, hiddenColumns, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap);
    reservedDisplayOptionColumnsMap = getTimeZoneColumnsSettings();
    //	resetCheckBoxes(colName,hiddenColumns,matrixGridId,labelsMap,reservedDisplayOptionColumnsMap);
    reservedDisplayOptionColumnsMap = $.extend(reservedDisplayOptionColumnsMap, getAggregateColumnsSettings());
    columns = AdvancedDataGrid.getColumns(matrixGridId); // $("#" + matrixGridId).data("kendoGrid").options.columns;
    var columnsToHide = getColumnsToHideInSettings();
    for (var i = 0; i < columns.length; i++) {
        colName = null;
        colName = columns[i].getDataField();
        if (columnsToHide == null || !isColumnHidden(columnsToHide, colName)) {
            isColumnResevered = getIsColumnReserved(reservedDisplayOptionColumnsMap, colName);
            if (colName != "" && !(isColumnResevered) && $("#" + colName) != null && $("#" + colName)[0] != null) {
                if (hiddenColumns[colName] != null && !(hiddenColumns[colName])) {
                    $("#" + colName)[0].checked = false;
                } else {
                    $("#" + colName)[0].checked = true;
                }
                hideUnhideColumns($("#" + colName)[0], matrixGridId);
            }
        }
    }
    resetVolAndTimeColumns();
}

/**
 * Reset matrix display options checkboxes.
 * Method for resetting matrix display options checkboxes.
 * @param colName - matrix column name.
 * @param hiddenColumns - array of hidden columns.
 * @param matrixGridId - matrix grid Id.
 * @param labelsMap - map of matrix column labels.
 * @param reservedDisplayOptionColumnsMap - map of reserved display options.
 */

function resetCheckBoxes(colName, hiddenColumns, matrixGridId, labelsMap, reservedDisplayOptionColumnsMap) {
    if (reservedDisplayOptionColumnsMap == null) {
        return;
    }
    for (var key in reservedDisplayOptionColumnsMap) {
        colName = key;
        if (hiddenColumns[key] != null && !(hiddenColumns[key])) {
            $("#" + colName)[0].checked = false;
            hideUnhideColumns($("#" + colName)[0], matrixGridId, reservedDisplayOptionColumnsMap[colName]);
        } else {
            $("#" + colName)[0].checked = true;
            hideUnhideColumns($("#" + colName)[0], matrixGridId, reservedDisplayOptionColumnsMap[colName]);
        }
    }
}

/**
 * Reset matrix contents.
 * Method for resetting matrix contents.
 * @param matrixGridId - matrix grid Id.
 * This method is not being used anywhere
 */

function resetGridContent(matrixGridId) {
/*
    $("#" + matrixGridId).data("kendoGrid").dataSource.group(EMPTY_STRING);
    $("#" + matrixGridId).data("kendoGrid").dataSource.sort(EMPTY_STRING);
    $("#" + matrixGridId).data("kendoGrid").dataSource.filter(EMPTY_STRING);
*/
}

/**
 * Enable/Disable refresh.
 * Method for enabling/disabling matrix dashboards icons in matrix headers.
 * @param enableFlag - Flag to enable/disable header button icons.
 * @param dashboardId - Current Dashboard Id.
 * @param isInitializing - Flag to check whether dashboard exists or not.
 * @param targetDashboardId - Target dashboard for Sync.
 */

function enableDisableRefresh(enableFlag, dashboardId, isInitializing, targetDashboardId) {
    var dashboardIds;
    if (dashboardId == null || dashboardId == EMPTY_STRING) {
        dashboardId = getDashboardID();
    }
    // based on enableFlag flag, Enable/Disable all the icons as per the condition.
    if (enableFlag) {
        if (dashboardId == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
            dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
        } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
            dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
        } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
            dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
        } else {
            dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
        }
        // This is when initializing the dashboard/clearing the query. It will disable all the sync buttons for all the dashbaords.
        if (targetDashboardId == null) {
            if (typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()) {
                //updateButtonAttrs(dashboardId, '.sync-to-map-disable', "k-icon sync-to-map", "Synchronize with map", "VIEWER.enableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-schematic')", true);
                //updateButtonAttrs(dashboardId, '.sync-to-schematic-disable', "k-icon sync-to-schematic", "Synchronize with schematic", "VIEWER.enableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-map')", true);
                updateButtonAttrs(dashboardId, '.sync-to-map-disable', "k-icon sync-to-map", "Synchronize with map", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-schematic')", true);
                updateButtonAttrs(dashboardId, '.sync-to-schematic-disable', "k-icon sync-to-schematic", "Synchronize with schematic", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-map')", true);
            } else {
                if (parent.commonViewer.currentView == 'map') {
                    if (dashboardId == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    }
                    updateButtonAttrs(dashboardId, '.sync-to-map-disable', "k-icon sync-to-map", "Synchronize with map", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-schematic')", true);
                    updateButtonAttrs(dashboardId, '.sync-to-schematic', "k-icon sync-to-schematic-disable", "Synchronize with schematic is not available", EMPTY_STRING, false);

                } else {
                    if (dashboardId == parent.DASHBOARD_ID_SCHEDULE_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else if (dashboardId == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
                        dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    } else {
                        dashboardIds = "[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
                    }
                    updateButtonAttrs(dashboardId, '.sync-to-schematic-disable', "k-icon sync-to-schematic", "Synchronize with schematic", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-map')", true);
                    updateButtonAttrs(dashboardId, '.sync-to-map', "k-icon sync-to-map-disable", "Synchronize with map is not available", EMPTY_STRING, false);
                }
            }
        }
        // It will disable all the other icons than sync while initializing or disable the icons for target dashboard only when sync is on.
        if (targetDashboardId == null || targetDashboardId == dashboardId) {
            updateButtonAttrs(dashboardId, '.icon-refresh-disable', "k-icon icon-refresh", "Refresh data to match query", 'getDashboardContentWindow("' + dashboardId + '").refreshMatrix(true,true)', true);
            updateButtonAttrs(dashboardId, '.icon-select-calendar-disable', "k-icon icon-select-calendar", "Open day selector", 'getDashboardContentWindow("' + dashboardId + '").openDayControl(this)', true);
            updateDropDownAttrs(dashboardId, '.icon-favorites-disable', "k-sprite k-icon icon-favorites", EMPTY_STRING, true);
            updateButtonAttrs(dashboardId, '.export-to-excel-disable', "k-icon export-to-excel", "Export to excel", 'getDashboardContentWindow("' + dashboardId + '").exportToExcel(this)', false);
            if (dashboardId != parent.DASHBOARD_ID_NETWORK_MATRIX) {
                var isNetworkSchedule = dashboardId == parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX ? true : false;
                updateButtonAttrs(dashboardId, '.open-utilization-matrix-disable', "k-icon open-utilization-matrix", "Open utilization matrix", 'openScheduleMatrixDashboard(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX,"' + isNetworkSchedule + '")', true);
                //updateButtonAttrs(dashboardId, '.open-allocations-matrix-disable', "k-icon open-allocations-matrix", "Open allocations matrix", 'openScheduleMatrixDashboard(DASHBOARD_ID_ALLOCATION_MATRIX,"' + isNetworkSchedule + '")', true);
                updateButtonAttrs(dashboardId, '.open-allocations-matrix-disable', "k-icon open-allocations-matrix", "Open allocations matrix", 'openScheduleMatrixDashboard(DASHBOARD_ID_ALLOCATION_MATRIX,"' + isNetworkSchedule + '")', true);
            }
        }
    } else {
        updateButtonAttrs(dashboardId, '.sync-to-map', "k-icon sync-to-map-disable", "Synchronize with map is not available", EMPTY_STRING, false);
        updateButtonAttrs(dashboardId, '.sync-to-schematic', "k-icon sync-to-schematic-disable", "Synchronize with schematic is not available", EMPTY_STRING, false);
        if (isInitializing == true || dashboardId == targetDashboardId) {
            updateButtonAttrs(dashboardId, '.icon-refresh', "k-icon icon-refresh-disable", "Refresh not available", EMPTY_STRING, false);
            updateButtonAttrs(dashboardId, '.icon-select-calendar', "k-icon icon-select-calendar-disable", "Day selector is not available", EMPTY_STRING, false);
            updateDropDownAttrs(dashboardId, '.icon-favorites', "k-sprite k-icon icon-favorites-disable", "Favorites are not available", false);
        }
        if (isInitializing) {
            updateButtonAttrs(dashboardId, '.export-to-excel', "k-icon export-to-excel-disable", "Export is not available", EMPTY_STRING, false);
            if (dashboardId != parent.DASHBOARD_ID_NETWORK_MATRIX) {
                updateButtonAttrs(dashboardId, '.open-utilization-matrix', "k-icon open-utilization-matrix-disable", "Utilization matrix is not available", EMPTY_STRING, false);
                updateButtonAttrs(dashboardId, '.open-allocations-matrix', "k-icon open-allocations-matrix-disable", "Allocations matrix is not available", EMPTY_STRING, false);
            }
        }
    }
}

/**
 * To enable/disable header buttons
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param onclickValue
 * @param enableClick
 */

function updateButtonAttrs(dashboardId, btnClass, btnClassName, btnTitle, onclickValue, enableClick) {
	if (parent.dashboardController.getDashboard(dashboardId) != undefined ) {
		var viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
	    if (viewerBtn[0] != null) {
	        viewerBtn[0].className = btnClassName;
	        viewerBtn.parent()[0].title = btnTitle;
	        if (enableClick) {
	            viewerBtn.parent().attr('onclick', onclickValue).bind('click');
	        } else {
	            viewerBtn.parent().attr('onclick', EMPTY_STRING).unbind('click');
	        }
	    }
	    if (btnClass.indexOf("disable") > 0) {
	        viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass.replace("-disable", EMPTY_STRING));
	        viewerBtn.parent().attr('onclick', onclickValue).bind('click');
	    }		
	}
}
/**
 * To enable/disable menu dropdowns
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param enableClick
 */

function updateDropDownAttrs(dashboardId, btnClass, btnClassName, btnTitle, enableClick) {
    var viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
    if (viewerBtn[0] != null) {
        updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick);
    } else if (!parent.dashboardController.isDashboardInitialized(dashboardId)) {
        setTimeout(function() {
            updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick);
        }, 1000);
    }
    if (btnClass.indexOf("disable") > 0) {
        viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass.replace("-disable", EMPTY_STRING));
        viewerBtn.parents("ul").next(".btnWrapper").remove();
    }
}

/**
 * To enable/disable menu dropdowns
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param enableClick
 */

function updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick) {
    var viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
    if (viewerBtn[0] != null) {
        viewerBtn.parents("ul").next(".btnWrapper").remove();
        viewerBtn[0].className = btnClassName;
        if (!enableClick) {
            var wrapper = $("<div class='btnWrapper' title='" + btnTitle + "'></div>");
            viewerBtn.parents("ul").after(wrapper);
        }
    }
}

/**
 * To show scroll bar if there is no data in matrix
 */

function showScrollbarIfNoData() {
    var grid = $("#" + getMatrixID()).data("kendoGrid");
    if (grid.dataSource.view().length == 0) {
        //insert empty row
        var colspan = grid.thead.find("th").length;
        var emptyRow = "<tr><td colspan='" + colspan + "'><i>No data to display<i></td></tr>";
        grid.tbody.html(emptyRow);

        //workarounds for IE lt 9
        //this.table.width(800);
        //$(".k-grid-content").height(2 * kendo.support.scrollbar());
    }
}

/**
 * Method to find occurences in the given string.
 * @param stringVal
 * @param charVal
 * @returns {Number}
 */

function charOccurrInString(stringVal, charVal) {
    var count = 0;
    for (var i = 0; i < stringVal.length; i++) {
        if (stringVal.charAt(i) == charVal) {
            count++;
        }
    }
    return count;
}

/**
 * Method to populate effective days local and zulu string.
 * @param dataItem
 * @param effDaysL
 * @param effDaysZ
 * @param routeCd - Used only for route eff days separate columns in Schedule & Volume Utilization matrix. For other matrices it will be ""
 */

function populateEffectiveDayColumns(dataItem, effDaysL, effDaysZ, routeCd) {
    if (routeCd == undefined) {
        routeCd = "";
    }
    var effDaysL = parent.getEffDaysStringFromSystemSetting(dataItem, effDaysL);
    var dayStringArrayL;
    if (effDaysL) {
        dayStringArrayL = effDaysL.split(",");
    }
    var effDaysZ = parent.getEffDaysStringFromSystemSetting(dataItem, effDaysZ);
    var dayStringArrayZ;
    if (effDaysZ) {
        dayStringArrayZ = effDaysZ.split(',');
    }
    if (dayStringArrayL && dayStringArrayZ) {
    	for(var j=0; j<dayStringArrayL.length; j++) {
	        for (var i = 1; i < 8; i++) {
	            if (dayStringArrayL[j] != undefined && !isCharExist(dataItem[routeCd + "EFFDAYSL_D" + i])) {
	                dataItem[routeCd + "EFFDAYSL_D" + i] = dayStringArrayL[j].trim().charAt(i - 1);
	            }
	            if (dayStringArrayZ[j] != undefined && !isCharExist(dataItem[routeCd + "EFFDAYSZ_D" + i])) {
	                dataItem[routeCd + "EFFDAYSZ_D" + i] = dayStringArrayZ[j].trim().charAt(i - 1);
	            }
	        }
	        dataItem[routeCd + "EFFWEEKSL_W" + (j+1)] = j+1;
	        dataItem[routeCd + "EFFWEEKSZ_W" + (j+1)] = j+1;
    	}
    }
}

function isCharExist(str) {
	if(str != null) {
		var match = str.match(/[a-zA-Z]/g);
		if(match && match.length > 0) {
			return true;
		}
	}
	return false;
}

/**
 * Method to get no op days string
 * @param noopStr
 * @returns
 */

function getNoOpString(noopStr) {
    var tempOnOpStr = EMPTY_STRING;
    if (!isFiveWeekPlan()) {
        var daysArray = noopStr.toString().split("X");
        for (var i = 0; i < daysArray.length; i++) {
            if (parseInt(daysArray[i]) < 29) {
                tempOnOpStr += "X" + daysArray[i];
            }
        }
        return tempOnOpStr;
    }
    return noopStr;
}

/**
 * Get matrix column index.
 * @param grid
 * @param colField
 * @returns {Number}
 */

function getMatrixColumnIndex(grid, colField) {
    if (grid == undefined) {
        grid = $("#" + getMatrixID()).data("kendoGrid");
    }
    var columns = grid.columns;
    var columnTitles = [];
    var noOfColumns = columns.length;
    for (var i = 0; i < noOfColumns; i++) {
        if (columns[i].field == colField) {
            return i;
        }
    }
    return 0;
}

/**
 * Set matrix groupby,sort and filter favorite settings.
 * @param favoriteSettings
 */

function setMatrixFavoriteSettings(favoriteSettings) {
    favColumns = null;
    favGroup = null;
    favFilter = null;
    favSort = null;
    favPreferences = undefined;
    resetColumnGroupings();
    if (favoriteSettings != undefined) {
        favColumns = favoriteSettings.columns;
        if (favoriteSettings.groupByColumns != undefined && favoriteSettings.groupByColumns != "[]") {
            favGroup = jQuery.parseJSON(favoriteSettings.groupByColumns);
        }
        if (favoriteSettings.gridSortedBy != undefined && favoriteSettings.gridSortedBy != "[]") {
            favSort = jQuery.parseJSON(favoriteSettings.gridSortedBy);
        }
        if (favoriteSettings.gridFilterBy != undefined && favoriteSettings.gridFilterBy != "[]") {
            favFilter = jQuery.parseJSON(favoriteSettings.gridFilterBy);
        }
        if (favoriteSettings.preferences != undefined && favoriteSettings.preferences != "[]") {
            favPreferences = favoriteSettings.preferences;
        }
    }
}

/**
 * Apply matrix groupby,sort and filter favorite settings.
 */

function applyMatrixSortFilterGroupByFavoriteSettings(favGroup, containerId) {
    if (applyFavoriteSettings) {
        applyFavoriteSettings = false;
        var favGrpCount;
        var dataGridColumn;
        if (favGroup != null && favColumns != undefined) {
            favGrpCount = favGroup.length;
            groupByColumns = getGroupByColumnsArr(containerId);
            if (groupByColumns == undefined) {
                groupByColumns = [];
            }
            for (var i = 0; i < favGrpCount; i++) {
                dataGridColumn = AdvancedDataGrid.getColumnByUniqueIdentifier(getMatrixID()[0], favGroup[i].dataField);
                groupByColumns.push(dataGridColumn);
                performGroupByClauseHandler(getMatrixID()[0], $('#' + getGroupbarId()), true, dataGridColumn, null, null, groupByColumns);
            }
            setGroupByColumnsArr(containerId, groupByColumns);
        }
    }

/*var gridDataSource = $("#" + matrixID).data("kendoGrid").dataSource;
    if (favFilter != null) {
        renderEmpty = true;
        setFilterHeaderActiveStates(matrixID, favFilter);
        gridDataSource.filter(favFilter);
    }
    if (favSort != null) {
        renderEmpty = true;
        gridDataSource.sort(favSort);
    }
    if (favGroup != null) {
        renderEmpty = true;
        gridDataSource.group(favGroup);
    }*/
}

/**
 * To show active icons for favorite filters.
 * @param matrixID
 * @param favFilter
 */

function setFilterHeaderActiveStates(matrixID, favFilter) {
    var tableHeaderColumns = null;
    if (matrixID != undefined) {
        tableHeaderColumns = $("#" + matrixID).find("th");
        if (tableHeaderColumns != undefined) {
            var tableColumnName;
            for (var i = 0; i < tableHeaderColumns.length; i++) {
                tableColumnName = $(tableHeaderColumns[i]).attr("data-field");
                if (isFilteredByColumnName(tableColumnName, favFilter)) {
                    $(tableHeaderColumns[i]).find(".k-grid-filter").addClass("k-state-active");
                } else {
                    $(tableHeaderColumns[i]).find(".k-grid-filter").removeClass("k-state-active");
                }
            }
        }
    }
}


function validateMatrixCheckboxStates(matrixID) {
    if (matrixID != undefined) {
        $('#' + matrixID + ' input[type=checkbox][id!=matrixHeaderChk]').click(function() {
            updateMatrixCheckboxStates(matrixID);
        });
    }
}

function updateMatrixCheckboxStates(matrixID) {
    if (matrixID != undefined) {
        var numChkBoxes = $('#' + matrixID + ' input[type=checkbox][id!=matrixHeaderChk]').length;
        var numChkBoxesChecked = $('#' + matrixID + ' input[type=checkbox][checked][id!=matrixHeaderChk]').length;
        if (numChkBoxes == numChkBoxesChecked && numChkBoxes > 0) {
            $('#matrixHeaderChk')[0].checked = true;
        } else {
            if ($('#matrixHeaderChk')[0] != undefined) {
                $('#matrixHeaderChk')[0].checked = false;
            }
        }
    }
}

/**
 * Flag to determine if the column has been filterd or not.
 * @param tableColumnName
 * @param favFilter
 * @returns
 */

function isFilteredByColumnName(tableColumnName, favFilter) {
    var filters;
    if (tableColumnName != undefined && favFilter != undefined) {
        filters = favFilter.filters;
        if (filters != undefined) {
            var filter;
            for (var i = 0; i < filters.length; i++) {
                filter = filters[i];
                if (filter.field != undefined) {
                    return validateBySingleFilter(tableColumnName, filter);
                } else if (filter.filters != undefined) {
                    return validateByMultipleFilters(tableColumnName, filter);
                }
            }
        }
    }
    return false;
}

/**
 * Validate if multiple filters have been applied.
 * @param tableColumnName
 * @param filter
 * @returns {Boolean}
 */

function validateByMultipleFilters(tableColumnName, filter) {
    if (tableColumnName != undefined) {
        var multipleFilters = filter.filters;
        var multipleFilter;
        for (var j = 0; j < multipleFilters.length; j++) {
            multipleFilter = multipleFilters[j];
            if (multipleFilter.field != undefined && tableColumnName == multipleFilter.field) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Validate if a filter has been applied.
 * @param tableColumnName
 * @param filter
 * @returns {Boolean}
 */

function validateBySingleFilter(tableColumnName, filter) {
    if (tableColumnName != undefined) {
        if (filter.field != undefined && tableColumnName == filter.field) {
            return true;
        }
    }
    return false;
}

/**
 * Method to apply default favorites on initialization.
 */

function applyDefaultFavoriteOnInitialize() {
    if (favoriteComponent.isDefaultFavoriteAvailable()) {
        renderEmpty = true;
        favoriteComponent.applyDefaultFavorite();
    }
}

function dateTimeFormat(date) {
    var cDate = date.getDate();
    var cMonth = date.getMonth() + 1;
    var cYear = date.getFullYear();
    var dateStr = '' + cYear + '/' + (cMonth <= 9 ? '0' + cMonth : cMonth) + '/' + (cDate <= 9 ? '0' + cDate : cDate);

    var cHour = date.getHours();
    var cMinuts = date.getMinutes();
    var cSeconds = date.getSeconds();

    var timeStr = (cHour <= 9 ? '0' + cHour : cHour) + ':' + (cMinuts <= 9 ? '0' + cMinuts : cMinuts) + ':' + (cSeconds <= 9 ? '0' + cSeconds : cSeconds);

    return dateStr + ' ' + timeStr;
}

/*
function detachMatrixEventHandlers() {
	
	var reservedDisplayOptionColumnsMap;
	
	var columns=$("#"+getMatrixID()).data("kendoGrid").options.columns;
	//get all reserved colums 
	var labelsMap=getReservedDisplayOptionColumnsLabelsMap();
	//create ckeckboxes for aggregate colums 
	reservedDisplayOptionColumnsMap=getAggregateColumnsSettings();
	// To find out all the hidden columns
	var hiddenColumns=getReservedColumnsVisiblity();
	// create ckeckboxes for reserved colums
	//createCheckBoxAndEventHandler(colName,colLabel,hiddenColumns,checkboxBtn,volumeChkDiv,matrixGridId,labelsMap,reservedDisplayOptionColumnsMap);
	reservedDisplayOptionColumnsMap=getTimeZoneColumnsSettings();
	//createTimeCheckBoxAndEventHandler(colName,colLabel,hiddenColumns,checkboxBtn,timeChkDiv,matrixGridId,labelsMap,reservedDisplayOptionColumnsMap);
	reservedDisplayOptionColumnsMap=$.extend(reservedDisplayOptionColumnsMap, getAggregateColumnsSettings());
	reservedDisplayOptionColumnsMap=addProductGroupsAggregateColumnSettings(reservedDisplayOptionColumnsMap, true);
	
	for (var key in reservedDisplayOptionColumnsMap) {
		 colName=key;
		 $("#"+colName).off();
	}
	
	for (var i=0;i<columns.length;i++){
		colName=null;
		colName=columns[i].field;
			$("#"+colName).off();
	}
	$("td", "#"+getMatrixID()).off();
	$("td").off();
}
*/

function timeFilter(element) {
    element.kendoTimePicker({
        format: "{0:HH:mm}",
        close: function(e) {
            this.value(kendo.parseDate(kendo.toString(this.value(), "HH:mm"), "HH:mm"));
            this.trigger("change");
        }
    });
}

function timeFilterInHHMM(element) {
    element.kendoTimePicker({
        format: "{0:HHmm}",
        close: function(e) {
            this.value(kendo.parseDate(kendo.toString(this.value(), "HHmm"), "HHmm"));
            this.trigger("change");
        }
    });
}

function dateTimeFilter(element) {
    element.kendoDateTimePicker({
        format: "{0:yyyy-MM-dd HH:mm}",
        timeFormat: "HH:mm",
        close: function(e) {
            this.value(kendo.parseDate(kendo.toString(this.value(), "yyyy-MM-dd HH:mm"), "yyyy-MM-dd HH:mm"));
            this.trigger("change");
        }
    });
}


function setMatrixData(isResetData, index) {
    AdvancedDataGrid.setPreferences(getContainerId()[index], favPreferences);
    var serviceUrl;
    var isScheduleForNetFlag = false;
    var dataTypeByMatrixId = getTreeGridDataTypeByMatrixId();
    if (dataTypeByMatrixId === parent.DATA_TYPE_NETWORK) {
        serviceUrl = getMatrixUrl();
    } else if (dataTypeByMatrixId === parent.DATA_TYPE_SCHEDULE || dataTypeByMatrixId === parent.DATA_TYPE_NETWORK_SCHEDULE) {
        serviceUrl = getScheduleMatrixUrl();
        if (parent.isNetworkScheduleDataAvailable) {
            isScheduleForNetFlag = true;
        }
    } else if (dataTypeByMatrixId === parent.parent.DATA_TYPE_LOCATION_ALLOCATION) {
        serviceUrl = getScheduleAllocationMatrixUrl();
        if (parent.isNetworkScheduleDataAvailable) {
            isScheduleForNetFlag = true;
        }
    } else if (dataTypeByMatrixId == parent.DATA_TYPE_VOLUME_UTILIZATION_TREE_GRID_SCHEDULE) {
        serviceUrl = getVolumeUtilizationMatrixUrl();
        if (parent.isNetworkScheduleDataAvailable) {
            isScheduleForNetFlag = true;
        }
    }
    var params = {};
    renderEmpty = false;
    //console.log("index call: "+ getContainerId()[index]);
    setParametersBeforeLoadingNextContainer(getContainerId()[index]);
    params["paramsMap"] = getDatasourceParams(isResetData);
    params["url"] = serviceUrl;
    params["isSyncOn"] = isSyncOn;
    params["successCallback"] = function(response, io) {
        if (response && response._errorCd && response._errorCd > 0) {
            //if there is an error in response then show the header error message 
            parent.showFilterErrorMsg(response._errorDesc);
            showProgressDialog(false);
        } else {
            onLoadScheduleForNetworkSuccess(response, io, getContainerId()[index], isScheduleForNetFlag);
            totalContainers++;
            //fix for synchronization when dashboard is having more than one container
            isSyncOn = params["isSyncOn"];
            if (totalContainers < getContainerId().length) {
                setMatrixData(isResetData, totalContainers);
            }

            if (totalContainers >= getContainerId().length) {
                //fix for synchronization when dashboard is having more than one container
                isSyncOn = false;
                for (var j = 0; j < totalContainers; j++) {
                    showProgressDialog(false);
                }
            }
        }
    };
    params["failureCallback"] = function(response, io) {
        setMatrixIsLoading(getContainerId()[index], false);
        onServiceRequestFailure(response, io);
    };
    params["showProgressWindow"] = true;
    setMatrixIsLoading(getContainerId()[index], true);
    //params["paramsMap"].renderEmpty = false;
    callService(params);
}

function setMatrixIsLoading(matrixId, isLoadingFlag) {
    matrixIsLoading[matrixId] = isLoadingFlag;
}

function getMatrixIsLoading(matrixId) {
    return matrixIsLoading[matrixId];
}

function beforeloadingNextContainer(containerId) {
    AdvancedDataGrid.setPreferences(containerId, favPreferences, true);
}

function setParametersBeforeLoadingNextContainer(containerId) {
    if (containerId == parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID + "Outbound") {
        direction = "O";
    } else if (containerId == parent.DASHBOARD_ID_NETWORK_MATRIX + parent.PARAM_TREE_GRID + "Inbound") {
        direction = "I";
    }
}

function getMatrixData(containerId) {
    if (matrixData != undefined) {
        return matrixData[containerId];
    } else {
        return null;
    }
}

function onServiceRequestFailure(response, io) {
    parent.onServiceRequestFailure(response, io);
}

function onLoadScheduleForNetworkSuccess(response, io, containerId, isScheduleForNetFlag) {
    if (parent.needToLoadData(getDashboardID(), isScheduleForNetFlag)) {
        //console.log("index response: "+ containerId);
        if (totalContainers == (getContainerId().length - 1)) {
            parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), true);
        }

        beforeloadingNextContainer(containerId);
        if (matrixData == undefined) {
            matrixData = {};
        }
        matrixData[containerId] = JSON.stringify(response);
        AdvancedDataGrid.setDataProvider(containerId, response);
        if (isScheduleMatirix(containerId)) {
        	 AdvancedDataGrid.setSelectAllState(containerId, flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED);
        } else {
        	AdvancedDataGrid.setSelectAllState(containerId, flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
        }
       
        AdvancedDataGrid.setPreferences(containerId, favPreferences);
        applyMatrixSortFilterGroupByFavoriteSettings(favGroup, containerId);
    }
    setMatrixIsLoading(containerId, false);
}

function isScheduleMatirix(containerId) {
	if (containerId == "scheduleMatrixTreeGridDivContainer") {
		return true;
	} else {
		false;
	}
}
/*
function dateTimeEditor(container, options) {
    console.log("options", options);
    $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
    .appendTo(container)
    .kendoDateTimePicker({});
}*/
//add handler for grouping

function initalizeMouseEventsForGrouping(gridContainerId, groupBarElement) {
    groupBarElement.mouseover(function(e) {
        var grid = document.getElementById(gridContainerId).component;
        if (grid != undefined && grid.getHeaderContainer().columnDraggingDragCell) {
            var checkIconClass = grid.getStyle("checkIconClass");
            grid.getHeaderContainer().columnResizingCellGlyph.colIcon.setSource(defaults.IMAGE_PATH + checkIconClass);
        }
    });
    groupBarElement.mouseout(function(e) {
        var grid = document.getElementById(gridContainerId).component;
        if (grid != undefined && grid.getHeaderContainer().columnDraggingDragCell) {
            var crossIconClass = grid.getStyle("crossIconClass");
            grid.getHeaderContainer().columnResizingCellGlyph.colIcon.setSource(defaults.IMAGE_PATH + crossIconClass);
        }
    });
    groupBarElement.mouseup(function(e) {
        var targetItem = null;
        if (e.which == 1) {
            if (e.target.localName == "span") {
                targetItem = e.target.parentNode;
            } else {
                targetItem = e.target;
            }
            performGroupByClauseHandler(gridContainerId, groupBarElement, undefined, undefined, e, targetItem, getGroupByColumnsArr(gridContainerId));
        }
    });
};

function getGroupByColumnsArr(containerId) {
    return groupByColumnsArr[containerId];
}

function setGroupByColumnsArr(containerId, data) {
    groupByColumnsArr[containerId] = data;
}

function performGroupByClauseHandler(gridContainerId, groupBarElement, isForceGroupBy, dataGridColumn, e, target, groupByColumns) {
    var grid = document.getElementById(gridContainerId).component;
    if (grid == undefined) {
        return;
    }
    if (groupByColumns == undefined) {
        groupByColumns = [];
    }
    isGrouping = true;
    grid.clearFilter();
    footerCols = [];
    $(grid.getColumns()).each(function(index, col) {
        if (col.footerOperation) footerCols.push(col);
    });
    var rebuild = false;
    if (target != undefined && target.tagName == "A") {
        groupByColumns.splice(groupBarElement.children().index(target), 1);
        rebuild = true;
    } else if (grid.getHeaderContainer().columnDraggingDragCell) {
        var columnToGroupBy = grid.getHeaderContainer().columnDraggingDragCell.getColumn();
        if (groupByColumns.indexOf(columnToGroupBy) == -1) groupByColumns.push(columnToGroupBy);
        grid.enableDynamicLevels = true;
        rebuild = true;
    } else if (isForceGroupBy) {
        var columnToGroupBy = dataGridColumn;
        if (groupByColumns.indexOf(columnToGroupBy) == -1) groupByColumns.push(columnToGroupBy);
        grid.enableDynamicLevels = true;
        rebuild = true;
    }
    if (rebuild) {
        if (target && target.tagName != "A") {
            grid.getColumnLevel().nextLevel = null;
        }
        if (groupByColumns.length == 0) {
            if (getMatrixData(getContainerId()[0]) != undefined) {
                grid.setDataProvider(updateResponseHandler(JSON.parse(getMatrixData(gridContainerId)).slice()));
                //grid.setSelectAllState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
            }
        } else {
            if (getMatrixData(getContainerId()[0]) != undefined) {
                grid.setDataProvider(
                dynamicMultipleGroupBy(updateResponseHandler(JSON.parse(getMatrixData(gridContainerId)).slice()), flexiciousNmsp.UIUtils.extractPropertyValues(groupByColumns, "dataField"), "(None)", null, [], false, getIdColumn()));
                //grid.setSelectAllState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
            }
        }
        if (groupByColumns.length >= 0) {
            var totalGroupByColumns = 1;
            grid.validateNow();
            grid.setEnableFilters(true);
            var lvl = grid.getColumnLevel();
            while (lvl) {
                //lvl.setEnableFilters(false);
                lvl.enablePaging = false;
                if (typeof getNestedColumnDtls == "function") {
                    if (lvl.nextLevel != undefined && totalGroupByColumns <= groupByColumns.length) {
                        lvl.itemLoadMode = "client";
                        lvl.nextLevel.reusePreviousLevelColumns = true;
                        grid.removeEventListener(null, "itemLoad", itemLoadHandler);
                    } else {
                        AdvancedDataGrid.getWaraper(typeof getMatrixFavId == "function" ? getMatrixFavId()[0] : getContainerId()[0]).createDataGridLevel(getNestedColumnDtls(), lvl, true);
                        AdvancedDataGrid.getWaraper(typeof getMatrixFavId == "function" ? getMatrixFavId()[0] : getContainerId()[0]).refreshAdvancedDataGrid();
                        break;
                    }
                }
                lvl = lvl.nextLevel;
                totalGroupByColumns++;
            }

            grid.rebuild();
            grid.validateNow();
            //to expand the last level
            if (groupByColumns.length > 1) {
                grid.expandToLevel(groupByColumns.length - 1);
            } else {
                grid.expandToLevel(groupByColumns.length);
            }
            //AdvancedDataGrid.setSelectAllState(getContainerId()[0],flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
            //AdvancedDataGrid.refreshCheckBoxes (getContainerId()[0]);
        }
        var html = "";
        $(groupByColumns).each(function(index, item) {
            html += "<a class='button' style='margin: 3px' dataField='" + item.getDataField() + "'>" + item.getHeaderText() + "</a>";
        });
        setGroupByColumnsArr(gridContainerId, groupByColumns);
        if (html === "") {
            html = "Drag a column here to group by that column.";
        }
        groupBarElement.html(html);
    }
    isGrouping = false;
}


var groupByColumns = [];
var footerCols = [];

function dynamicMultipleGroupBy(dp, props, nullValue, filterfunction, additionalProperties, useOtherBucket, nameProperty) {
    var prop = props.shift();
    var grouped = dynamicGroupBy(dp, prop, nullValue, filterfunction, additionalProperties, useOtherBucket, nameProperty);
    var uiUtil = flexiciousNmsp.UIUtils;


    if (props.length > 0) {
        for (var i = 0; i < grouped.length; i++) {
            var item = grouped[i];
            item.children = dynamicMultipleGroupBy(item.children, props.slice(), nullValue, filterfunction, additionalProperties, useOtherBucket, nameProperty);
        }

    }
    for (var i = 0; i < grouped.length; i++) {
        var obj = grouped[i];
        $(footerCols).each(function(index, col) {
            var value;
            switch (col.footerOperation) {
            case flexiciousNmsp.FlexDataGridFooterCell.SUM:
                value = uiUtil.sum(obj.children, col.getDataField());
                break;
            case flexiciousNmsp.FlexDataGridFooterCell.AVERAGE:
                value = uiUtil.average(obj.children, col.getDataField());
                break;
            case flexiciousNmsp.FlexDataGridFooterCell.MIN:
                value = uiUtil.min(obj.children, col.getDataField());
                break;
            case flexiciousNmsp.FlexDataGridFooterCell.MAX:
                value = uiUtil.max(obj.children, col.getDataField());
                break;
            case flexiciousNmsp.FlexDataGridFooterCell.COUNT:
                value = uiUtil.getLength(obj.children);
                break;
            case "sumTime":
                value = getFormatedTime(obj.children, col.getDataField());
                break;
            }
//            obj[col.getDataField()] = value;
        });
    }

    return grouped;
}

function getFormatedTime(gridDataAry, dataField) {
    var gridData;

    if (gridDataAry != undefined && gridDataAry instanceof Array && gridDataAry.length > 0) {
        gridData = [];
        getScheduleMatrixObject(gridDataAry, gridData);
    } else {
        gridData = gridDataAry;
    }

    var total = 0; //time in seconds
    for (var i = 0; i < gridData.length; i++) {
        total = Math.abs(total) + (Math.abs(parent.toSeconds(gridData[i][dataField])) * Math.abs(gridData[i]["FLIGHT_COUNT"])); //Maths.abs is not required for positive values
    }
    var result = "";
    if (total > 0) {
        // format time differnece
        result = [
        Math.floor(total / 3600), // an hour has 3600 seconds
        Math.floor((total % 3600) / 60) // a minute has 60 seconds
        ];
        // 0 padding and concatation
        result = result.map(function(v) {
            return v < 10 ? '0' + v : v;
        }).join(":");
    }
    return result.toString();
}

function getFormattedSum(gridDataAry, dataField) {
	 var gridData;
	 if (gridDataAry != undefined && gridDataAry instanceof Array && gridDataAry.length > 0) {
		 gridData = [];
		 getScheduleMatrixObject(gridDataAry, gridData);
	 } else {
		 gridData = gridDataAry;
	 }
	 var total = 0;
	 for (var i = 0; i < gridData.length; i++) {
		 total = Math.abs(total) + (Math.abs(gridData[i][dataField]) * Math.abs(gridData[i]["FLIGHT_COUNT"])); //Maths.abs is not required for positive values
	 }
	 return total;
}

function getScheduleMatrixObject(gridDataAry, gridData) {
    if (gridDataAry != undefined) {
        if (gridDataAry instanceof Array) {
            for (var i = 0; i < gridDataAry.length; i++) {
                if (gridDataAry[i].children) {
                    getScheduleMatrixObject(gridDataAry[i].children, gridData);
                } else {
                    gridData.push(gridDataAry[i]);
                }
            }
        } else {
            gridData.push(gridDataAry);
        }
    }
}

function dynamicGroupBy(dp, prop, nullValue, filterfunction, additionalProperties, useOtherBucket, nameProperty) {
    if (!additionalProperties) additionalProperties = [];
    var buckets = {};
    var key;
    var result = [];
    //iterate through the flat list and create a hierarchy
    if (useOtherBucket) {
        buckets["other"] = [];
    }
    for (var i = 0; i < dp.length; i++) {
        var item = dp[i];
        key = flexiciousNmsp.UIUtils.resolveExpression(item, prop); //the parent
        if (key == null) key = "";
        key = (key.toString().trim());

        if (!buckets[key]) {
            buckets[key] = []; //the children
        }
        if (filterfunction == null || filterfunction(item)) buckets[key].push(item); //add to the parents child list
        else if (useOtherBucket) {
            buckets["other"].push(item);
        }
    }
    for (key in buckets) {
        var obj = {};
       // obj[prop] = key == "null" || key == null || (key.toString().trim()) == "" ? nullValue : key;
        obj['children'] = buckets[key];
        /*if (buckets[key].length > 0) {
            for (var i = 0; i < additionalProperties.length; i++) {
                var addProp = additionalProperties[i];
                obj[addProp] = buckets[key][0][addProp];
            }
        }
        if (nameProperty) {
            obj[nameProperty] = key;
        }*/
        result.push(obj); //create the final structure
    }

    return result; //this will refresh the grid...
};


function switchAndEnableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery) {
    parent.VIEWER.enableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery);
}



function customFooterOperationHandler(dataProvider, dataField) {
    if (dataField != undefined) {
        switch (dataField) {
        case "MAX_PAYLOAD_WT":
        case "MAX_PAYLOAD_CU":
        	return getFormattedSum(dataProvider, dataField);
        	break;
        default:
            return getFormatedTime(dataProvider, dataField);
        }
    }
}