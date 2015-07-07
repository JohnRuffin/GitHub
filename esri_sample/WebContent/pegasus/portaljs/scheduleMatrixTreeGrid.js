/**
 * @author 888600 Abhishek Sharma
 * This script belongs to Schedule Matrix Dashboard.
 * Included in scheduleMatrix.jsp
 */
/** Labels for Schedule Matrix */
//Boolean flag to determine if the request is from Network Schedule or not
var isNetworkScheduleFlag;
var commonMatrixConstants = {
	//Array for Week Local columns
    WEEK_COLUMNS_L: ["EFFWEEKSL_W5"],
    //Array for Week Zulu columns
    WEEK_COLUMNS_Z: ["EFFWEEKSZ_W5"],
    ROUTE_WEEK_COLUMNS_L: ["RTEEFFWEEKSL_W5"],
    ROUTE_WEEK_COLUMNS_Z: ["RTEEFFWEEKSZ_W5"],
    LOCAL_TOTAL_FREQ: ["TOTAL_FREQ_1", "TOTAL_FREQ_2", "TOTAL_FREQ_3", "TOTAL_FREQ_4", "TOTAL_FREQ_5", "TOTAL_FREQ_6", "TOTAL_FREQ_7"],
    ZULU_TOTAL_FREQ: ["TOTAL_FREQZ_1", "TOTAL_FREQZ_2", "TOTAL_FREQZ_3", "TOTAL_FREQZ_4", "TOTAL_FREQZ_5", "TOTAL_FREQZ_6", "TOTAL_FREQZ_7"],
    timeColLabelMap: {}  
};
var WEEKDAYSCONSTANTS = {
	mon:" Monday",
	tues:" Tuesday",
	wed:" Wednesday",
	thur:" Thursday",
	fri:" Friday",
	sat:" Saturday",
	sun:" Sunday"
};

var WEEKSCONSTANTS ={
	wk1:" Week 1 ",
	wk2:" Week 2 ",
	wk3:" Week 3 ",
	wk4:" Week 4 ",
	wk5:" Week 5 "
};

var scheduleMatrixTreeGridConstants = {
    HEADER_LOCAL_SUFFIX: " (L)",
    HEADER_ZULU_SUFFIX: " (Z)",
    HEADER_ROUTE_NO: "Mv No",
    HEADER_ROUTE_NO_TOOLTIP: "Move Number",
    HEADER_EQ: "Equip Type",
    HEADER_EQ_TOOLTIP: "Equipment Type",
    HEADER_DAYS_LOCAL: "Days(L)",
    HEADER_DAYS_ZULU: "Days(Z)",
    HEADER_LOCAL_WEEK: "Weeks(L)",
    HEADER_ZULU_WEEK: "Weeks(Z)",
    HEADER_ORIG: "Orig Loc",
    HEADER_ORIG_TOOLTIP: "Origin location",
    HEADER_DES: "Dest Loc",
    HEADER_DES_TOOLTIP: "Destination location",
    HEADER_ARR_NXT_DAY_L: "Arrive NxtDay(L)",
    HEADER_ARR_NXT_DAY_Z: "Arrive NxtDay(Z)",
    HEADER_LOCAL_DEP: "Dept (L)",
    HEADER_LOCAL_DEP_TOOLTIP: "Departure Time",
    HEADER_LOCAL_ARR: "Arriv (L)",
    HEADER_LOCAL_ARR_TOOLTIP: "Arrival Time",
    HEADER_ZULU_DEP: "Dept (Z)",
    HEADER_ZULU_DEP_TOOLTIP: "Departure Time",
    HEADER_LOCAL_DEP_SCH_TOOLTIP: "Departure time - Local",
    HEADER_ZULU_ARR: "Arriv (Z)",
    HEADER_ZULU_ARR_TOOLTIP: "Arrival time - Zulu",
    HEADER_ZULU_ARR_SCH_TOOLTIP: "Arrival time - Local",
    HEADER_FLIGHT: "Transit (hhmm)",
    HEADER_FLIGHT_TOOLTIP: "Transit Minutes",
    HEADER_FLIGHT_HST_CD: "Flt Hist Code",
    HEADER_FLIGHT_HST_CD_TOOLTIP: "Flight History Code",
    HEADER_BLOCK: "Block (hhmm)",
    HEADER_BLOCK_TOOLTIP: "Block Minutes",
    HEADER_BLOCK_SCH: "Block (hhmm)",
    HEADER_BLOCK_SCH_TOOLTIP: "Block Minutes",
    HEADER_USE_LEG_MINS_FLAG:"Manual Transit",
    HEADER_USE_LEG_MINS_FLAG_TOOLTIP:"Manual Transit",
    HEADER_SCHEDULE_ORG: "Orig",
    HEADER_SCHEDULE_ORG_TOOLTIP: "Origin",
    HEADER_SCHEDULE_DEST: "Dest",
    HEADER_SCHEDULE_DEST_TOOLTIP: "Destination",
    HEADER_TAXIOUT_CD: "Taxi Out Code",
    HEADER_TAXIOUT_CD_TOOLTIP: "Taxi Out Code",
    HEADER_TAXIIN_CD: "Taxi In Code",
    HEADER_TAXIIN_CD_TOOLTIP: "Taxi In Code",
    HEADER_GRND_TIME: "Grnd Mins",
    HEADER_GRND_TIME_TOOLTIP: "Ground Minutes",
    HEADER_TTL_FREQ: "Ttl Freq",
    HEADER_TTL: "Freq ",
    HEADER_TTL_1: "Freq M (L)",
    HEADER_TTL_2: "Freq T (L)",
    HEADER_TTL_3: "Freq W (L)",
    HEADER_TTL_4: "Freq T (L)",
    HEADER_TTL_5: "Freq F (L)",
    HEADER_TTL_6: "Freq S (L)",
    HEADER_TTL_7: "Freq S (L)",
    HEADER_TTLZ_1: "Freq M (Z)",
    HEADER_TTLZ_2: "Freq T (Z)",
    HEADER_TTLZ_3: "Freq W (Z)",
    HEADER_TTLZ_4: "Freq T (Z)",
    HEADER_TTLZ_5: "Freq F (Z)",
    HEADER_TTLZ_6: "Freq S (Z)",
    HEADER_TTLZ_7: "Freq S (Z)",
    HEADER_FREQ: "Freq Wk Cnt",
    HEADER_FREQ_TOOLTIP: "Frequency Week Count",
    HEADER_TTL_TOOLTIP: "Frequency",
    HEADER_FLIGHT_COUNT: "Ttl Freq",
    HEADER_FLIGHT_COUNT_TOOLTIP: "Frequency Total",
    HEADER_S: "S",
    HEADER_S_TOOLTIP: "Sequence",
    HEADER_IATA_DESC: "Equip Desc",
    HEADER_IATA__DESC_TOOLTIP: "Equipment Description",
    HEADER_MODE: "Mode",
    HEADER_MODE_TOOLTIP: "Mode",
    HEADER_LEG_TYPE: "Leg Type",
    HEADER_LEG_TYPE_TOOLTIP: "Leg Type",
    HEADER_ROUTE_EFFDT: "Route EffDate",
    HEADER_LEG_EFFDT: "Leg EffDate",
    HEADER_CAL_BTN: "Cal",
    HEADER_NO_OPS_L: "No Op Days (L)",
    HEADER_NO_OPS_Z: "No Op Days (Z)",
    HEADER_LEG_NO_OPS_L: "Leg No Op Days (L)",
    HEADER_LEG_NO_OPS_Z: "Leg No Op Days (Z)",
    HEADER_ROUTE_NO_OPS_L: "Route No Op Days (L)",
    HEADER_ROUTE_NO_OPS_Z: "Route No Op Days (Z)",
    HEADER_NO_OPS_TOOLTIP: "Leg No Operation Days",
    HEADER_CARRIER: "Carrier",
    HEADER_TAXIOUT_MIN_L: "Txi Out (hhmm)",
    HEADER_TAXIOUT_MIN_L_TOOLTIP: "Amount of time it takes to taxi out",
    HEADER_TAXIOUT_MIN_Z: "Taxi Out (hhmm)",
    HEADER_TAXIOUT_MIN_Z_TOOLTIP: "Taxi Out Minutes",
    HEADER_OFF_L: "Off (L)",
    HEADER_OFF_L_TOOLTIP: "Off",
    HEADER_OFF_Z: "Off (Z)",
    HEADER_OFF_Z_TOOLTIP: "Off",
    HEADER_BLK_HHMM_L: "Block(hhmm)",
    HEADER_BLK_HHMM_L_TOOLTIP: "Total time on the ground and in transit",
    HEADER_BLK_HHMM_Z: "Blk Time(Z)",
    HEADER_BLK_HHMM_Z_TOOLTIP: "Total time on the ground and in transit",
    HEADER_TRANSIT_HHMM: "Trnst Time",
    HEADER_TRANSIT_HHMM_TOOLTIP: "Total transit time",
    HEADER_LAND_TIME_L: "On (L)",
    HEADER_LAND_TIME_Z: "On (Z)",
    HEADER_LAND_TIME_TOOLTIP: "On",
    HEADER_TAXIIN_MIN_L: "Taxi In (hhmm)",
    HEADER_TAXIIN_MIN_L_TOOLTIP: "Taxi In Minutes",
    HEADER_TAXIIN_MIN_Z: "Taxi In (hhmm)",
    HEADER_TAXIIN_MIN_Z_TOOLTIP: "Taxi In Minutes",
    HEADER_LEG_MILES: "Leg Miles",
    HEADER_LEG_MILES_TOOLTIP: "Leg Miles",
    HEADER_LEG_KMS: "Leg Kms",
    HEADER_LEG_KMS_TOOLTIP: "Leg Kilometers",
    HEADER_OPERATING_COST: "Ops Cost",
    HEADER_OPERATING_COST_TOOLTIP: "Operating Cost",
    HEADER_RTE_HOL_DAYS_L: "Hol Eff Days (L)",
    HEADER_RTE_HOL_DAYS_L_TOOLTIP: "Holiday Effective Days",
    HEADER_RTE_HOL_DAYS_Z: "Hol Eff Days (Z)",
    HEADER_RTE_HOL_DAYS_Z_TOOLTIP: "Holiday Effective Days",

    HEADER_LEG_HOL_DAYS_L: "Leg Hol Effective Days (L)",
    HEADER_LEG_HOL_DAYS_L_TOOLTIP: "Leg Holiday Effective Days",
    HEADER_LEG_HOL_DAYS_Z: "Leg Hol Effective Days (Z)",
    HEADER_LEG_HOL_DAYS_Z_TOOLTIP: "Leg Holiday Effective Days",
    HEADER_CARRYOVER_FLAG:"Carryover",
    HEADER_CARRYOVER_FLAG_TOOLTIP:"Carryover",
    HEADER_ESTOPS_SCHE_FLAG:"ETOPS Sched",
    HEADER_ESTOPS_SCHE_FLAG_TOOLTIP:"ETOPS Schedule",
    HEADER_REVISION_COMMENTS:"Revision Comment",
    HEADER_REVISION_COMMENTS_TOOLTIP:"Revision Comment",
    HEADER_FORTE_REV_TMSTP:"FORTE Revision Eff Date", 
    HEADER_FORTE_REV_TMSTP_TOOLTIP:"FORTE Revision Effective Date", 
    HEADER_PHX_LINE_HAUL_LEG_FLG:"Used As Line Haul",
    HEADER_PHX_LINE_HAUL_LEG_FLG_TOOLTIP:"Used As Line Haul",
    HEADER_FLAG_DOM_CERT_FLG:"Flag/Dom",
    HEADER_FLAG_DOM_CERT_FLG_TOOLTIP:"Flag/Domestic Certification",
    HEADER_ROUTE_HOL_DAYS_L: "Route Hol Eff Days (L)",
    HEADER_ROUTE_HOL_DAYS_L_TOOLTIP: "Route Holiday Effective Days",
    HEADER_ROUTE_HOL_DAYS_Z: "Route Hol Eff Days (Z)",
    HEADER_ROUTE_HOL_DAYS_Z_TOOLTIP: "Route Holiday Effective Days",

    HEADER_SCAC_CD: "SCAC Code",
    HEADER_SCAC_CD_TOOLTIP: "SCAC Code",
    HEADER_IATA_MV_NBR: "IATA Mv No",
    HEADER_IATA_MV_NBR_TOOLTIP: "IATA Move Number",
    HEADER_IN_DST: "In DST",
    HEADER_IN_DST_TOOLTIP: "In Daylight Saving",
    HEADER_TEMP_RT: "Temp Rte",
    HEADER_TEMP_RT_TOOLTIP: "Temp Route",
    HEADER_BAL_MV_NBR: "Bal Mv No",
    HEADER_BAL_MV_NBR_TOOLTIP: "Return route for equipment balancing",
    HEADER_LAST_UPDT_TIME: "Last Chg Date",
    HEADER_LAST_UPDT_TIME_TOOLTIP: "Last Change Date",
    HEADER_CHANGE_FLAG: "Last Chg Type",
    HEADER_CHANGE_FLAG_TOOLTIP: "Last Change Type",
    HEADER_MPH: "MPH",
    HEADER_MPH_TOOLTIP: "Miles Per Hour",
    HEADER_OWNER_LOC_CD: "Owner Loc Code",
    HEADER_OWNER_LOC_CD_TOOLTIP: "Owner Location Code",
    HEADER_GLOBAL_RGN_CD: "Ctl Rgn Desc",
    HEADER_GLOBAL_RGN_CD_TOOLTIP: "Controlling Region Description",
    HEADER_ALLOC_FLAG: "Allocs",
    HEADER_ALLOC_FLAG_TOOLTIP: "Allocations?",
    HEADER_REASON_CD: "Reason Code",
    HEADER_REASON_CD_TOOLTIP: "Reason Code",

    HEADER_LAST_CHG_USER: "Last Chg User",
    HEADER_LAST_CHG_USER_TOOLTIP: "Last Change User",
    HEADER_COMMENTS: "Internal Comment",
    HEADER_COMMENTS_TOOLTIP: "Internal Comment",


    HEADER_CARRIER_STG_TM: "Carrier Pre Stage (hhmm)",
    HEADER_CARRIER_STG_TM_TOOLTIP: "Carrier Pre Stage Minutes",
    HEADER_DAILY_RT_CC_CHG: "Daily Leg Cost",
    HEADER_DAILY_RT_CC_CHG_TOOLTIP: "Daily Leg Cost",
    HEADER_TOTAL_MTH_CST: "Total Leg Cost",
    HEADER_TOTAL_MTH_CST_TOOLTIP: "Total Leg Cost",
    HEADER_TRACK_EQUIP_TYPE: "Tractor Type",
    HEADER_TRACK_EQUIP_TYPE_TOOLTIP: "Tractor Type",
    HEADER_TRACK_PERSTAGE_TM: "Tractor Pre Stage (hhmm)",
    HEADER_TRACK_PERSTAGE_TM_TOOLTIP: "Tractor Pre Stage Minutes",
    HEADER_TRACK_STAGE_TM: "Tractor Post Stage (hhmm)",
    HEADER_TRACK_STAGE_TM_TOOLTIP: "Tractor Post Stage Minutes",
    HEADER_TRAIL_OPT: "Trailer Option",
    HEADER_TRAIL_OPT_TOOLTIP: "Trailer Option",
    HEADER_TRAIL_1PRESTAGE_TM: "Trailer 1 Pre Stage (hhmm)",
    HEADER_TRAIL_1PRESTAGE_TM_TOOLTIP: "Trailer 1 Pre Stage Minutes",
    HEADER_TRAIL_1STAGE_TM: "Trailer 1 Post Stage (hhmm)",
    HEADER_TRAIL_1STAGE_TM_TOOLTIP: "Trailer 1 Post Stage Minutes",
    HEADER_TRAIL_2PRESTAGE_TM: "Trailer 2 Pre Stage (hhmm)",
    HEADER_TRAIL_2PRESTAGE_TM_TOOLTIP: "Trailer 2 Pre Stage Minutes",
    HEADER_TRAIL_2STAGE_TM: "Trailer 2 Post Stage (hhmm)",
    HEADER_TRAIL_2STAGE_TM_TOOLTIP: "Trailer 2 Post Stage Minutes",
    HEADER_UNLOAD_TM: "Unload (hhmm)",
    HEADER_UNLOAD_TM_TOOLTIP: "Unload Minutes",
    HEADER_LOAD_TM: "Load (hhmm)",
    HEADER_LOAD_TM_TOOLTIP: "Load Minutes",
    HEADER_TRAIL_AVAIL_TM: "Trailer Avail Unload (hhmm)",
    HEADER_TRAIL_AVAIL_TM_TOOLTIP: "Trailer Available Unload Minutes",

    /** Labels for Allocation Matrix */
    HEADER_EFF_DAYS_L: "Eff Days (L)",
    HEADER_EFF_DAYS_L_TOOLTIP: "Effective Days",
    HEADER_EFF_DAYS_Z: "Eff Days(Z)",
    HEADER_EFF_DAYS_Z_TOOLTIP: "Effective Days",
    HEADER_LEG_EFF_DAYS_L: "Leg Effective Days (L)",
    HEADER_LEG_EFF_DAYS_L_TOOLTIP: "Leg Effective Days",
    HEADER_LEG_EFF_DAYS_Z: "Leg Effective Days (Z)",
    HEADER_LEG_EFF_DAYS_Z_TOOLTIP: "Leg Effective Days",
    HEADER_ROUTE_EFF_DAYS_L: "Route Eff Days (L)",
    HEADER_ROUTE_EFF_DAYS_L_TOOLTIP: "Route Effective Days",
    HEADER_ROUTE_EFF_DAYS_Z: "Route Eff Days(Z)",
    HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP: "Route Effective Days",

    HEADER_KEY_EFF_DAYS_L: "Keyword Eff Days (L)",
    HEADER_KEY_EFF_DAYS_L_TOOLTIP: "Keyword Effective Days",
    HEADER_KEY_EFF_DAYS_Z: "Keyword Eff Days(Z)",
    HEADER_KEY_EFF_DAYS_Z_TOOLTIP: "Keyword Effective Days",

    HEADER_LEG_KEY_EFF_DAYS_L: "Leg Keyword Eff Days (L)",
    HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP: "Leg Keyword Effective Days",
    HEADER_LEG_KEY_EFF_DAYS_Z: "Leg Keyword Eff Days (Z)",
    HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP: "Leg Keyword Effective Days",
    HEADER_ROUTE_KEY_EFF_DAYS_L: "Route Keyword Eff Days (L)",
    HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP: "Route Keyword Effective days - Local",
    HEADER_ROUTE_KEY_EFF_DAYS_Z: "Route Keyword Eff Days(Z)",
    HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP: "Route Keyword Effective days - Zulu",

    HEADER_WEEK_EFF_DAYS_L: "Leg Weekly Pattern (L)",
    HEADER_WEEK_EFF_DAYS_L_TOOLTIP: "Leg Weekly Pattern (L)",
    HEADER_WEEK_EFF_DAYS_Z: "Leg Weekly Pattern (Z)",
    HEADER_WEEK_EFF_DAYS_Z_TOOLTIP: "Leg Weekly Pattern (Z)",
    HEADER_ROUTE_WEEK_EFF_DAYS_L: "Route Weekly Pattern (L)",
    HEADER_ROUTE_WEEK_EFF_DAYS_L_TOOLTIP: "Route Weekly Pattern (L)",
    HEADER_ROUTE_WEEK_EFF_DAYS_Z: "Route Weekly Pattern (Z)",
    HEADER_ROUTE_WEEK_EFF_DAYS_Z_TOOLTIP: "Route Weekly Pattern (Z)",

    HEADER_EFF_WEEKS_L: "Eff Weeks(L)",
    HEADER_EFF_WEEKS_Z: "Eff Weeks(Z)",
    HEADER_PROD_GRP: "Prod Grp",
    HEADER_PROD_GRP_TOOLTIP: "Product group",
    HEADER_WGT_TOTAL: "Ttl Wt",
    HEADER_WGT_TOTAL_TOOLTIP: "Total Weight",
    HEADER_CB_TOTAL: "Ttl Cu",
    HEADER_CB_TOTAL_TOOLTIP: "Total Cube",
    HEADER_WGT_TOTAL_ALLOWED_TOOLTIP: "Total allowed weight",
    HEADER_CB_TOTAL_ALLOWED_TOOLTIP: "Total allowed cubic volume",
    HEADER_WGT_USED: "Used Wt",
    HEADER_WGT_USED_TOOLTIP: "Weight used",
    HEADER_CB_USED: "Used Cu",
    HEADER_CB_USED_TOOLTIP: "Volume used",
    HEADER_WGT_EX: "Excess Wt",
    HEADER_WGT_EX_TOOLTIP: "Used weight in excess of allowed amount",
    HEADER_WGT_EX_VOL_TOOLTIP: "Amount of Excess weight",
    HEADER_CB_EX: "Excess Cu",
    HEADER_CB_EX_TOOLTIP: "Used volume in excess of allowed amount",
    HEADER_CB_EX_VOL_TOOLTIP: "Amount of Excess volume",
    HEADER_PCS_EX: "Excess Pcs",
    HEADER_PCS_EX_TOOLTIP: "Amount of Excess Pieces",
    HEADER_MAX_PAY_WT: "Max Wt",
    HEADER_MAX_PAY_WT_TOOLTIP: "Max Weight",
    HEADER_MAX_PAY_CU: "Max Cu",
    HEADER_MAX_PAY_CU_TOOLTIP: "Max Cubes",
    HEADER_MAX_PAYLOAD_WGT_SRC:"Max Payload Wt Source", 
    HEADER_MAX_PAYLOAD_WGT_SRC_TOOLTIP:"Max Payload Weight Source", 
    HEADER_SOURCE_NBR :"Source",
    HEADER_SOURCE_NBR_TOOLTIP:"Source",
    
    HEADER_ADY_L: "Arriv Day (L)",
    HEADER_ADY_L_TOOLTIP: "Arrival Day",
    HEADER_ADY_Z_TOOLTIP : "Arrival Day",
    HEADER_ADY_Z: "Arriv Day (Z)",
    HEADER_D1: "M",
    HEADER_D2: "T",
    HEADER_D3: "W",
    HEADER_D4: "T",
    HEADER_D5: "F",
    HEADER_D6: "S",
    HEADER_D7: "S",
    HEADER_W1: "W1",
    HEADER_W2: "W2",
    HEADER_W3: "W3",
    HEADER_W4: "W4",
    HEADER_W5: "W5",

/*gridConfig : '<grid id=getContainerId() itemClick = "itemClickHandler" ' +
	'horizontalScrollPolicy="auto" columnGroupStyleName="cgStyle" ' +
	'enablePrint="true" enablePreferencePersistence="true" enableFooters="true" footerDrawTopBorder="true"  '+
	'enableExport="true" enableCopy="true" filterRowHeight="1" '+
	'preferencePersistenceKey="columnLockModes" spinnerLabel="" variableHeaderHeight="true" '+
	'enableMultiColumnSort="true" useCompactPreferences="true" showSpinnerOnFilterPageSort="true">'+
	'<level enableFilters="true"></level>'+ 
	'</grid>',*/
    gridConfig: '<grid headerClicked  = "itemheaderClickedHandler"  ' + 'itemClick = "itemClickHandler"  ' + 'horizontalScrollPolicy="auto" ' + //Enables the horizontal scroll policy
    'itemOpen="itemOpenHandler" '+
    'itemClose="itemCloseHandler" '+
    'filterPageSortChange = "filterPageSortChangeHandler"  ' +
    'forcePagerRow="true" ' +
    'enablePaging="true" pageSize="1000" '+
    'enableFilters="true" ' + // This Enables the inline filters
    'enableFooters="true" ' + // This Enables the footers.
    'variableHeaderHeight="true" ' + // This Enables the variable header heights.			
    'footerDrawTopBorder="true" ' + // ??
    'enableMultiColumnSort="true" ' + // This enables the multi sorting of columns
    'useCompactPreferences="true" ' + 'preferencePersistenceKey="scheduleMatrix" ' + /*'selectionMode="singleCells" '+*/
    'enableDynamicLevels="true" ' +
    'itemRollOver="itemRollDataOver" '+
    'autoLoadPreferences="false" '+
    'enableMultiplePreferences="true" '+
    '>' + '</grid>',
    columnIndex: 0,

    /******* common constants - start *******/
    EFF_LOCAL_COLUMNS: ["EFFDAYSL_D1", "EFFDAYSL_D2", "EFFDAYSL_D3", "EFFDAYSL_D4", "EFFDAYSL_D5", "EFFDAYSL_D6", "EFFDAYSL_D7", "EFFWEEKSL_W1", "EFFWEEKSL_W2", "EFFWEEKSL_W3", "EFFWEEKSL_W4"],
    EFF_ZULU_COLUMNS: ["EFFDAYSZ_D1", "EFFDAYSZ_D2", "EFFDAYSZ_D3", "EFFDAYSZ_D4", "EFFDAYSZ_D5", "EFFDAYSZ_D6", "EFFDAYSZ_D7", "EFFWEEKSZ_W1", "EFFWEEKSZ_W2", "EFFWEEKSZ_W3", "EFFWEEKSZ_W4"],

    // Route Effective days column array
    ROUTE_EFF_LOCAL_COLUMNS:[],// ["RTEEFFDAYSL_D1", "RTEEFFDAYSL_D2", "RTEEFFDAYSL_D3", "RTEEFFDAYSL_D4", "RTEEFFDAYSL_D5", "RTEEFFDAYSL_D6", "RTEEFFDAYSL_D7", "RTEEFFWEEKSL_W1", "RTEEFFWEEKSL_W2", "RTEEFFWEEKSL_W3", "RTEEFFWEEKSL_W4"],
    ROUTE_EFF_ZULU_COLUMNS:[],// ["RTEEFFDAYSZ_D1", "RTEEFFDAYSZ_D2", "RTEEFFDAYSZ_D3", "RTEEFFDAYSZ_D4", "RTEEFFDAYSZ_D5", "RTEEFFDAYSZ_D6", "RTEEFFDAYSZ_D7", "RTEEFFWEEKSZ_W1", "RTEEFFWEEKSZ_W2", "RTEEFFWEEKSZ_W3", "RTEEFFWEEKSZ_W4"],

    //Array for All Local columns
    LOCAL_COLUMNS: ["NOOP_DAYS_L", "LOCAL_DEP", "LOCAL_ARR", "ARRIVAL_DAY_L", "B_OFFTIME_L", "LANDING_TIME_L", "CAL_BUTTON_L", "LOCAL_DAYS", "KEYWORD_EFFDT_L", "LEG_HOL_DAYS_L",  "FULL_EFFDT_L", "ROUTE_LOCAL_DAYS", "ROUTE_KEYWORD_EFFDT_L", "ROUTE_FULL_EFFDT_L", "CAL_BUTTON_ROUTE_L"],
    //Array for All Zulu columns
    ZULU_COLUMNS: ["NOOP_DAYS_Z", "ZULU_DEP", "ZULU_ARR", "ARRIVAL_DAY_Z", "B_OFFTIME_Z", "LANDING_TIME_Z", "CAL_BUTTON_Z", "ZULU_DAYS", "KEYWORD_EFFDT_Z", "LEG_HOL_DAYS_Z", "FULL_EFFDT_Z", "ROUTE_ZULU_DAYS", "ROUTE_KEYWORD_EFFDT_Z", "ROUTE_FULL_EFFDT_Z", "CAL_BUTTON_ROUTE_Z"],
    LOCAL_TOTAL_FREQ: ["TOTAL_FREQ_1", "TOTAL_FREQ_2", "TOTAL_FREQ_3", "TOTAL_FREQ_4", "TOTAL_FREQ_5", "TOTAL_FREQ_6", "TOTAL_FREQ_7"],
    ZULU_TOTAL_FREQ: ["TOTAL_FREQZ_1", "TOTAL_FREQZ_2", "TOTAL_FREQZ_3", "TOTAL_FREQZ_4", "TOTAL_FREQZ_5", "TOTAL_FREQZ_6", "TOTAL_FREQZ_7"],

    //Array for Week Local columns
    WEEK_COLUMNS_L: ["EFFWEEKSL_W5"],
    ROUTE_WEEK_COLUMNS_L: ["RTEEFFWEEKSL_W5"],
    //Array for Week Zulu columns
    WEEK_COLUMNS_Z: ["EFFWEEKSZ_W5"],
    ROUTE_WEEK_COLUMNS_Z: ["RTEEFFWEEKSZ_W5"],
    //Array for Holiday columns
    HIDDEN_COLUMNS: ["LEG_HOL_DAYS_L", "LEG_HOL_DAYS_Z", "OPERATING_COST", "GLOBAL_RGN_DESC"],
    // Array of Days.
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'R', 'N'],
    //Array of Weeks.
    weekData: [1, 2, 3, 4],
    //Schedule ID column
    ID_COLUMN: "LEG_ID",
    timeColLabelMap: {}    
};
//var LOCAL_TOTAL_FREQ =["FREQ","TOTAL_FREQ_1","TOTAL_FREQ_2","TOTAL_FREQ_3","TOTAL_FREQ_4","TOTAL_FREQ_5","TOTAL_FREQ_6","TOTAL_FREQ_7"];
//var ZULU_TOTAL_FREQ =["FREQ","TOTAL_FREQZ_1","TOTAL_FREQZ_2","TOTAL_FREQZ_3","TOTAL_FREQZ_4","TOTAL_FREQZ_5","TOTAL_FREQZ_6","TOTAL_FREQZ_7"];
//Favorite component
var favoriteComponent;
commonMatrixConstants.timeColLabelMap["NOOP_DAYS_L"] = ["Leg No Op Days"];
//commonMatrixConstants.timeColLabelMap["ROUTE_NOOP_DAYS_L"] = ["Route No Op Days"];
commonMatrixConstants.timeColLabelMap["LOCAL_DEP"] = ["Dept"];
commonMatrixConstants.timeColLabelMap["LOCAL_ARR"] = ["Arriv"];
commonMatrixConstants.timeColLabelMap["AVAIL_TIME_Z"] = ["Freq Days (M-S)"];
commonMatrixConstants.timeColLabelMap["ARRIVAL_DAY_L"] = ["Arriv Day"];
commonMatrixConstants.timeColLabelMap["B_OFFTIME_L"] = ["Off"];
commonMatrixConstants.timeColLabelMap["LANDING_TIME_L"] = ["On"];
commonMatrixConstants.timeColLabelMap["LEG_HOL_DAYS_L"] = ["Leg Hol Eff Days"];
//commonMatrixConstants.timeColLabelMap["ROUTE_HOL_DAYS_L"] = ["Route Hol Eff Days"];
commonMatrixConstants.timeColLabelMap["NOOP_DAYS_Z"] = ["Leg No Op Days"];
//commonMatrixConstants.timeColLabelMap["ROUTE_NOOP_DAYS_Z"] = ["Route No Op Days"];
commonMatrixConstants.timeColLabelMap["ZULU_DEP"] = ["Dept"];
commonMatrixConstants.timeColLabelMap["ZULU_ARR"] = ["Arriv"];
commonMatrixConstants.timeColLabelMap["AVAIL_TIME_Z"] = ["Freq Days (M-S)"];
commonMatrixConstants.timeColLabelMap["ARRIVAL_DAY_Z"] = ["Arriv Day"];
commonMatrixConstants.timeColLabelMap["B_OFFTIME_Z"] = ["Off"];
commonMatrixConstants.timeColLabelMap["LANDING_TIME_Z"] = ["On"];
commonMatrixConstants.timeColLabelMap["LEG_HOL_DAYS_Z"] = ["Leg Hol Eff Days"];
//commonMatrixConstants.timeColLabelMap["ROUTE_HOL_DAYS_Z"] = ["Route Hol Eff Days"]; 
/******* common constants - end *******/
//Progress message in Schedule Matrix
/******* common methods - start *******/


/**
 * Called when Plan is changed
 * To hide/unhide matrix columns based on the selected plan.
 */

function onPlanChange() {
    var combobox = $("#freqComboSettings").data("kendoComboBox");
    if (isFiveWeekPlan()) {
        weekData = getWeekData();
        combobox.dataSource._data = weekData;
        combobox.options.dataSource = weekData;
        combobox.dataSource.query();
    } else {
        weekData = getWeekData();
        combobox.dataSource._data = weekData;
        combobox.options.dataSource = weekData;
        combobox.dataSource.query();
    }
    combobox.select(0);
    updateEffectiveSettingsClick("All_Local_Columns");
    updateEffectiveSettingsClick("All_Zulu_Columns");
}
/**
 * method to get frequency week combo dataSource
 * @returns {Array}
 */

function getWeekData() {
    if (isFiveWeekPlan()) {
        return weekData = [1, 2, 3, 4, 5];
    } else {
        return weekData = [1, 2, 3, 4];
    }
}

function onTabSelect(tabName) {}

/**
 * Called before Network Query executed
 * To clear the network matrix out.
 */

function onBeforeRunQuery() {
    clear(false, false);
}

function onNetworkQuerySuccess() {}

/**
 * Called on Network Schedule Query success
 * To refresh Network Schedule matrix.
 */

function onNetworkScheduleQuerySuccess() {
    if (parent.isNetworkQuery && isNetworkScheduleFlag) {
        refreshMatrix();
    }
}

/**
 * Called on Schedule Query success
 * To refresh Schedule matrix.
 */

function onScheduleQuerySuccess() {
    if (!parent.isNetworkQuery && !isNetworkScheduleFlag) {
        refreshMatrix();
    }
}

/**
 * get matrix data type.
 * Method to check data type for Schedule or Network Schedule.
 */

function getDataType() {
    if (isNetworkScheduleFlag) {
        return parent.DATA_TYPE_NETWORK_SCHEDULE;
    }

    return parent.DATA_TYPE_SCHEDULE;
}

/**
 * Called on Schedule Matrix refresh
 * To refresh schedule matrix.
 */

function refresh() {
    if (parent.needToLoadData(getDashboardID(), isNetworkScheduleFlag)) {
        refreshMatrix();
    }
}

/**
 * Called on day component click
 * To open the schedule matrix day control.
 */

function openDayControl(btn) {
    parent.VIEWER.openDayControl(btn, getDashboardID(), parent.getDataType(isNetworkScheduleFlag));
}

/******* common methods - end *******/

/******* common methods - favorites - start *******/

function getHeaderButtonSettings() {
    var headerButtonSettings = {};
    return headerButtonSettings;
}

/**
 * Schedule Display option setting
 * get schedule matrix display option favorites setting.
 */

function getDisplayOptionSettings() {
    return getColumnsSettings(getContainerId()[0]);
}

/**
 * Schedule Contents setting
 * get schedule matrix contents favorites setting.
 */

function getContentFavoriteSettings() {
    return getMatrixContentFavoriteSettings(getContainerId()[0]);
}

function applyHeaderButtonSettings(headerButtonSettings) {
    if (headerButtonSettings != null) {
/*
		var btnSyncMap=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
	 	var btnSyncSchematic=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');
	 	
		parent.highlightBtn(btnSyncMap.parent()[0],!headerButtonSettings["ScheduleMatrixSyncMapClass"]);
		parent.enableSync(btnSyncMap.parent()[0],getDashboardID(),[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
		parent.highlightBtn(btnSyncSchematic.parent()[0],!headerButtonSettings["ScheduleMatrixSyncSchematicClass"]);
		parent.enableSync(btnSyncSchematic.parent()[0],getDashboardID(),parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
		
	*/
    }
}

/**
 * Schedule Display option setting
 * apply schedule matrix display option favorites setting.
 */

function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    setColumnsSettings(displayOptionSettings, getContainerId()[0]);
}

/**
 * Schedule Content setting
 * apply schedule matrix contents favorites setting.
 */

function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    setMatrixContentFavoriteSettings(getContainerId()[0], contentSettings);
} /******* common methods - favorites - end *******/

/**
 * Schedule Initialize method
 * Method to use for initialization of Schedule Matrix.
 * @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
 * @param favoriteSettings - Columns which are stored in favorites
 */

function getContainerId() {
    return [parent.DASHBOARD_ID_SCHEDULE_MATRIX + parent.PARAM_TREE_GRID];
}

function initialize(flag, favoriteSettings) {
	if (!canApplyClear()) {
        return;
    }
	AdvancedDataGrid.setDataProvider(getContainerId()[0], []);
    setMatrixFavoriteSettings(favoriteSettings);
    if (flag == undefined) {
        setMatrixID(getContainerId());
        if (isNetworkScheduleFlag) {
            setDashboardID(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
        } else {
            setDashboardID(parent.DASHBOARD_ID_SCHEDULE_MATRIX);
        }
        isClearOn = false;
        addButtonsBar();
        favoriteComponent = new FavoriteComponent(getDashboardID(), isNetworkScheduleFlag ? "networkScheduleMatrixFavoritesMenu" : "scheduleMatrixTreeGridFavoritesMenu", isNetworkScheduleFlag ? "Network Schedule" : "Schedule Matrix");
        favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
        searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
    }
    if (isClearOn == true) {
        matrixURL = null;
    }

    //showProgressDialog(true, "Please wait...");
    parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), false);
    new AdvancedDataGrid(getContainerId()[0], {
		configuration: scheduleMatrixTreeGridConstants.gridConfig,
		id: getContainerId()[0],
		dataProvider: [],
		isCellCustomBackgroundDrawFunctionDefault: false
	}, getMatrixColumns(favColumns), updateResponseHandler);
    
    if (flag == undefined) {    	
        initializeDisplayOptions();
        createKendoDropDown("weekCmb", "text", "value");
        if (isNetworkScheduleFlag) {
            if (parent.isAtleastOneSyncOn) {
                enableDisableRefresh(false);
            } else {
                enableDisableRefresh(parent.isNetworkScheduleDataAvailable, null, true);
            }
        } else {
            if (parent.isAtleastOneSyncOn) {
                enableDisableRefresh(false);
            } else {
                enableDisableRefresh(true, null, true);
            }
            parent.isRunQuery = false;
        }

        parent.setDashboardInitialized(getDashboardID());

        if (isNetworkScheduleFlag) {
            //check if sync is already on
            var syncSearchCriteria;
            var viewerIds = [parent.DASHBOARD_ID_MAP_VIEW, parent.DASHBOARD_ID_SCHEMATIC_VIEW];
            var viewerDashboard;
            for (var i = 0; i < viewerIds.length; i++) {
                viewerDashboard = parent.getDashboardContentWindow(viewerIds[i]);
                if (viewerDashboard != undefined && viewerDashboard.isSyncMatrix) {
                    syncSearchCriteria = viewerDashboard.getSyncSearchCriteria(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
                    if (syncSearchCriteria != undefined) {
                        syncDashboard(syncSearchCriteria);
                        break;
                    }
                }
            }
        }
    }
    
    refresh();
//    setRightClickMenu(parent.isScheduleMaintenanance);
}

/*function setRightClickMenu(scheduleMaintenaceFlag) {
	var containerId = $('#' + getContainerId()[0]);
	if (scheduleMaintenaceFlag) {
		containerId.contextmenu({
			menu: [
               {title: "Edit", cmd: "copyRouteToWIP", uiIcon: "ui-icon-copy"}
           ],
           select: function(event, ui) {
               var grid = document.getElementById(getContainerId()[0]).component;
               if(!grid.currentCell)
            	   grid.currentCell = grid.getBodyContainer().getCellFromMouseEventTarget(ui.target[0].component);
               if(grid.currentCell && grid.currentCell.getRowInfo() && grid.currentCell.getRowInfo().rowPositionInfo && grid.currentCell.getRowInfo().rowPositionInfo.rowData) {
	               var rowData = grid.currentCell.getRowInfo().rowPositionInfo.rowData;
	               parent.setScheduleMaintenananceMode(ui.cmd);
	               parent.showProgressDialog(true, "Retrieving route data...");
	               parent.callScheduleRouteDataService(grid, rowData, ui.cmd,"callScheduleRouteDataService");
               }
           }
	    });
	} else {
		containerId.contextmenu({menu:[]});
	}
}*/


function updateResponseHandler(response, onlyFreqColumns) {
	if(response != undefined && response.length >= 0){
	    $.each(response, function(idx, dataItem) {
	    	if (!onlyFreqColumns) {
	    		populateEffectiveDayColumns(dataItem, "FULL_EFFDT_L", "FULL_EFFDT_Z", "");
	    		populateEffectiveDayColumns(dataItem, "ROUTE_FULL_EFFDT_L", "ROUTE_FULL_EFFDT_Z", "RTE");
	    	}
	        populateFltFreqColumns(dataItem, "FULL_EFFDT_L", "FULL_EFFDT_Z");
	    });
	}
    showProgressDialog(false);
    return response;
}

/**
 * Schedule Aggregate columns method
 * Method to set Aggregate columns in schedule matrix.
 */

function getAggregateColumnsSettings() {
    var map = new Object();
    return map;
}

/**
 * Schedule Timezone method
 * Method to set Timezone columns.
 */

function getTimeZoneColumnsSettings() {
    var map = new Object();
    if (isFiveWeekPlan()) {
        map["All_Local_Columns"] = $.merge($.merge($.merge([], getLocalColumns()), scheduleMatrixTreeGridConstants.WEEK_COLUMNS_L), scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_L);
        map["All_Zulu_Columns"] = $.merge($.merge($.merge([], getZuluColumns()), scheduleMatrixTreeGridConstants.WEEK_COLUMNS_Z), scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_Z);
    } else {
        map["All_Local_Columns"] = getLocalColumns();
        map["All_Zulu_Columns"] = getZuluColumns();
    }
    showLocalOrZuluMatrixColumns(getContainerId()[0], map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
    return map;
}

/**
 * Schedule Reserved columns visibility method
 * Method to set columns visibility in matrix.
 */

function getReservedColumnsVisiblity() {
    var map = new Object();
    if (isLocalTimeFlag()) {
        map["All_Zulu_Columns"] = false;
    } else {
        map["All_Local_Columns"] = false;
    }
    map["LEG_HOL_DAYS_L"] = false;
    map["LEG_HOL_DAYS_Z"] = false;
    map["OPERATING_COST"] = false;
    map["GLOBAL_RGN_DESC"] = false;
    map["NOOP_DAYS_L"] = false;
    map["NOOP_DAYS_Z"] = false;
    map["LEG_HOL_DAYS_L"] = false;
    map["LEG_HOL_DAYS_Z"] = false;
    map["MODE"] = false;
    map["MPH"] = false;
    map["SCAC_CD"] = false;
    map["IATA_MV_NBR"] = false;
    map["IN_DST"] = false;
    map["TEMP_RT"] = false;
    map["OWNER_LOC_CD"] = false;
    map["REASON_CD"] = false;
    map["CARRIER_STG_TM"] = false;
    map["TRACK_EQUIP_TYPE"] = false;
    map["TRACK_PERSTAGE_TM"] = false;
    map["TRACK_STAGE_TM"] = false;
    map["TRAIL_OPT"] = false;
    map["TRAIL_1PRESTAGE_TM"] = false;
    map["TRAIL_1STAGE_TM"] = false;
    map["TRAIL_2PRESTAGE_TM"] = false;
    map["TRAIL_2STAGE_TM"] = false;
    map["TRAIL_AVAIL_TM"] = false;
    map["UNLOAD_TM"] = false;
    map["LOAD_TM"] = false;
    map["LEG_MILES"] = false;
    map["LEG_KMS"] = false;
    map["DAILY_RT_CC_CHG"] = false;
    map["TOTAL_MTH_CST"] = false;
    return map;
}

/**
 * Schedule holiday columns visibility method
 * Method to set holiday columns visibility in schedule matrix.
 */

function getRegularColumnsVisiblity() {
    var map = new Object();
    map["HIDDEN_COLUMNS"] = false;
    return map;
}

/**
 * Schedule columns visibility method
 * Method to set columns visibility in Display options.
 */

function getColumnsToHideInSettings() {
    var colToHide = [getIdColumn(),"ROUTE_ID",,"CAL_BUTTON_L", "CAL_BUTTON_Z", "LOCAL_DAYS", "ZULU_DAYS", "ROUTE_LOCAL_DAYS", "ROUTE_ZULU_DAYS", "CAL_BUTTON_ROUTE_L", "CAL_BUTTON_ROUTE_Z"];
    if (getContainerId()[0]== 'scheduleMatrixTreeGridDivContainer') {
    	$.merge(colToHide,["MV_NUM","MV_NUM_SEQ","LEG_TYPE","EQUIP_TYPE","EQUIP_DESC"]);
    }
    if (!isFiveWeekPlan()) {
        $.merge(colToHide, scheduleMatrixTreeGridConstants.WEEK_COLUMNS_L);
        $.merge(colToHide, scheduleMatrixTreeGridConstants.WEEK_COLUMNS_Z);
        $.merge(colToHide, scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_L);
        $.merge(colToHide, scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_Z);
    }
    return colToHide;
}

/**
 * Total Frequency method
 * Method to compute total frequency of flights based on effective days string.
 */

function getTotalFreq(totalDays, totalWeeks) {
    totalFreq = 0;
    totalWeek = 0;
    var totDays = buildFlightCountStr(totalDays);
    var totWeeks = replaceAll(totalWeeks, "-", "").length;

    for (var i = 0; i < 7; i++) {
        if (totDays.charAt(i).indexOf('1') >= 0) {
            totalFreq += 1;
        }
    }
    return totalFreq * totWeeks;
}

/**
 * Flight count method
 * Method to get total count on effective days
 */

function buildFlightCountStr(totalDays) {
    var flightCount = replaceAll(totalDays, "-", "0");

    for (var i = 0; i < 7; i++) {
        if (isExists(days, totalDays.charAt(i))) {
            flightCount = flightCount.replace(totalDays.charAt(i), "1");
        }
    }
    return flightCount;
}

/*
function buildNoOpStr(totalWeeks) {
	var opDatStr="";
	for (var i = 0; i < totalWeeks.length; i++) {
		if(totalWeeks.charAt(i).indexOf('-') >= 0) {
			opDatStr += "X" +(i+1);
	    }  
	}
	return opDatStr;
} */


function setSearchCriteria() {
	if(searchCriteria) {
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
}

/**
 * Schedule local columns method
 * Method to get local columns of Schedule matrix.
 */

function getLocalColumns() {
    return $.merge($.merge($.merge($.merge([], scheduleMatrixTreeGridConstants.LOCAL_COLUMNS), scheduleMatrixTreeGridConstants.EFF_LOCAL_COLUMNS), scheduleMatrixTreeGridConstants.ROUTE_EFF_LOCAL_COLUMNS), scheduleMatrixTreeGridConstants.LOCAL_TOTAL_FREQ);
}

/**
 * Schedule zulu columns method
 * Method to get zulu columns of Schedule matrix.
 */

function getZuluColumns() {
    return $.merge($.merge($.merge($.merge([], scheduleMatrixTreeGridConstants.ZULU_COLUMNS), scheduleMatrixTreeGridConstants.EFF_ZULU_COLUMNS), scheduleMatrixTreeGridConstants.ROUTE_EFF_ZULU_COLUMNS), scheduleMatrixTreeGridConstants.ZULU_TOTAL_FREQ);
}

function getEffectiveColumns(isLocalTime) {
    var weeksColumnL = ["EFFWEEKSL_W5"];
    var weeksColumnZ = ["EFFWEEKSZ_W5"];
    if (isLocalTime) {
        if (isFiveWeekPlan()) {
            return $.merge($.merge([], scheduleMatrixTreeGridConstants.EFF_LOCAL_COLUMNS), weeksColumnL);
        } else {
            return scheduleMatrixTreeGridConstants.EFF_LOCAL_COLUMNS;
        }
    } else {
        if (isFiveWeekPlan()) {
            return $.merge($.merge([], scheduleMatrixTreeGridConstants.EFF_ZULU_COLUMNS), weeksColumnZ);
        } else {
            return scheduleMatrixTreeGridConstants.EFF_ZULU_COLUMNS;
        }
    }
}

function getRouteEffectiveColumns(isLocalTime) {
    if (isLocalTime) {
        if (isFiveWeekPlan()) {
            return $.merge($.merge([], scheduleMatrixTreeGridConstants.ROUTE_EFF_LOCAL_COLUMNS), scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_L);
        } else {
            return scheduleMatrixTreeGridConstants.ROUTE_EFF_LOCAL_COLUMNS;
        }
    } else {
        if (isFiveWeekPlan()) {
            return $.merge($.merge([], scheduleMatrixTreeGridConstants.ROUTE_EFF_ZULU_COLUMNS), scheduleMatrixTreeGridConstants.ROUTE_WEEK_COLUMNS_Z);
        } else {
            return scheduleMatrixTreeGridConstants.ROUTE_EFF_ZULU_COLUMNS;
        }
    }
}

/**
 * Schedule holidays columns method
 * Method to get holidays columns of Schedule matrix.
 */

function getHolidayColumns() {
    return scheduleMatrixTreeGridConstants.HOLIDAY_COLUMNS;
}

/**
 * Schedule id column method
 * Method to get id column of Schedule matrix.
 */

function getIdColumn() {
    return scheduleMatrixTreeGridConstants.ID_COLUMN;
}

/**
 * week dropdown component in Schedule matrix display setting.
 * Method to create week dropdown in display settings.
 */

function createKendoDropDown(id, dataTextField, dataValueField) {
    $("#" + id).kendoDropDownList({
        dataSource: scheduleMatrixTreeGridConstants.weekData,
        index: 0,
        change: onChange
    });
}

/**
 * onChange event of week dropdown in display option.
 * Event to set total frequency for selected week.
 */

function onChange() {
    var selectVal = $('#weekCmb').val();
    var selectInd = $('#weekCmb')[0].selectedIndex;
    var grid = $("#scheduleMatrixGrid").data("kendoGrid");
    var effDaysLIndex = getMatrixColumnIndex(grid, "LOCAL_DAYS");
    var noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L");
    var freqWkIndex = getMatrixColumnIndex(grid, "FREQ");

    var effDayStr = "";
    var noOpDaysStr = "";
    grid.tbody.find("tr").each(function(i) {
        effDayStr = $(this).find("td").eq(effDaysLIndex)[0].innerHTML;
        noOpDaysStr = $(this).find("td").eq(noopDaysLIndex)[0].innerHTML;
        var dayStringArray = effDayStr.split(" ");
        var totFreq = 0;
        if (isExists(dayStringArray[1], selectInd + 1)) {
            totFreq = getTotalFreq(dayStringArray[0], selectVal);
        }
        if (totFreq != 0) {
            totFreq = totFreq - getTotalFreqPerWeek(noOpDaysStr, selectVal);
        }
        grid._data[i].field = totFreq;
        $(this).find("td").eq(freqWkIndex).html(totFreq);
    });
};

/**
 * To compute total freq of flights per week.
 * Method to compute total freq per week excluding no op days.
 */

function getTotalFreqPerWeek(noOpDaysStr, selectedWeek) {
    var count = 0;
    if (noOpDaysStr != undefined || noOpDaysStr != "") {
        var noOpArray = noOpDaysStr.split('X');
        for (var i = 0; i < noOpArray.length; i++) {
            var noOpWeek = Math.ceil(noOpArray[i] / 7);
            if (noOpWeek == selectedWeek) {
                count++;
            }
        }
    }
    return count;
}

/**
 * To compute total freq of flights per week.
 * Method to compute total freq per week excluding no op days.
 */

function getFreqDaysPerWeek(noOpDaysStr, selectedWeek) {
    var freqColumns = new Array();
    if (noOpDaysStr != undefined || noOpDaysStr != "") {
        var noOpArray = noOpDaysStr.split('X');
        for (var i = 0; i < noOpArray.length; i++) {
            var noOpWeek = Math.ceil(noOpArray[i] / 7);
            if (noOpWeek == selectedWeek) {
                var noopDay = noOpArray[i] % 7;
                freqColumns.push(noopDay);
            }
        }
    }
    return freqColumns;
}

/**
 * To compute total flight count.
 * Method to compute total flight count excluding no op days.
 */

function getTotalFlightCount(noOpDaysStr) {
    var count = 0;
    if (noOpDaysStr != undefined || noOpDaysStr != "") {
        var noOpArray = noOpDaysStr.split('X');
        for (var i = 0; i < noOpArray.length; i++) {
            var noOpWeek = Math.ceil(noOpArray[i] / 7);
            count++;
        }
    }
    return count;
}

function itemheaderClickedHandler(event) {
    if (event && (event.column.dataField == "LEG_ID" || event.column.getUniqueIdentifier() == "LEG_ID" ) ){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}
}
function itemRollDataOver(event) {
	if (event.column != null) {
		if (event.column.dataField =="COMMENTS")  {
			var val = $("<p>"+event.cell._text+"</p>").text();
			if ( val !==null && val !="") {
				setTooltip(event,"Click to see the comments");
				event.cell.domElement.title ="Click to see the comments";
			}
		}
//		FDX-1103 SM: Ensure all columns that are to be codes (e.g. Flt Hist Code, Txi Out code, etc...) are actually codes. Description should show on hover.
		 else if(event.column.dataField == "FLIGHT_CD"){
			setTooltip(event, (event.cell.getRowInfo().getData())["FLIGHT_DESC"]);
		} else if(event.column.dataField == "TAXIOUT_CD"){
			setTooltip(event, (event.cell.getRowInfo().getData())["TAXIOUT_DESC"]);
		} else if(event.column.dataField == "TAXIIN_CD"){
			setTooltip(event, (event.cell.getRowInfo().getData())["TAXIIN_DESC"]);
		}
	}
}
function setTooltip(event, tooltip){
	if(tooltip != undefined){
		$(event.cell.domElement).find("label").attr("title",tooltip);
		event.cell.domElement.title = tooltip;
	}	
}
function itemClickHandler(event) {
    if (event && event.column.dataField == "COMMENTS") {
        var commentObjArr = jQuery.parseJSON(event.item.COMMENTS);
        if (commentObjArr != null) {
        	var commentList;
        	if ($(event.column.getHeaderText())[0].title == "Internal Comment") {
        		commentList = getCommentList(0,commentObjArr);
        	} else {
        		commentList = getCommentList(1,commentObjArr);
        	}
        	if (commentList != null && commentList.length >0) {
        		var commentText = "";
        		var commentLength= commentList.length-1;
            	commentText += "<font color='#376092' size=2px>" + commentList[commentLength].commentDesc + "</font> by " + commentObjArr[commentLength].createUserNm + " on " + dateTimeFormat(new Date(parseInt(commentObjArr[commentLength].createTmstp))) + "<br><br>";
            	createCommentsWin('commentsWindowDiv', commentText);
        	}
        	
        	/*for (var i = 0; i < commentObjArr.length; i++) {
        	commentText += "<font color='#376092' size=2px>" + commentObjArr[i].commentDesc + "</font> by " + commentObjArr[i].createUserNm + " on " + dateTimeFormat(new Date(parseInt(commentObjArr[i].createTmstp))) + "<br><br>";
        }*/
        	
        }
    }if (event && (event.column.dataField == "LEG_ID" || event.column.getUniqueIdentifier() == "LEG_ID" ) ){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}else {
        calenderCellClickHandler(event);
    }
}

function getCommentList(commentTypeCd,commentObjArr) {
	// var commObj = jQuery.parseJSON(dataItem.COMMENTS);
     var commentList = $.grep(commentObjArr, function(obj) {
			return (obj["commentTypeCd"].type == commentTypeCd);
		});
     commentList.sort(function(x, y){
			return x.createTmstp - y.createTmstp;
		});
     return commentList;
}


function applyCellTectColorTemplate(cell){
	var rowData = cell.getRowInfo().getData();
	if(rowData["CHANGE_FLAG"] == parent.OPERATION_CD_DELETE) {
		$(cell.domElement).find("label").css("color", "#8f8f8f");
		$(cell.domElement).find("font").css("color", "#8f8f8f");
        return 0xd3d3d3;
    }else {
    	$(cell.domElement).find("label").css("color", "#376092");
    	$(cell.domElement).find("font").css("color", "#376092");
        return 0x376092;
    }
}

function itemOpenHandler(event){
	console.log(event);
	event.preventDefault();
	loadChildren(event.item);
	AdvancedDataGrid.addNestedColumns(getMatrixID(), getNestedColumns(),  event.level);
}

function itemCloseHandler(event){
	console.log(event);
	event.preventDefault();
}

/**
 * calender Row Handler method
 * Custom item editor to render calender button.
 * It will show the results in calendar based on LOCAL_DAYS & ZULU_DAYS depending on localZuluFlag.
 */

function calenderCellClickHandler(event) {
    if (event && event.item) {
        var selDays, noOpDays, holDays;
        var flag = false;
        if (event.column.dataField == 'CAL_BUTTON_ROUTE_L') {
            selDays = event.item["ROUTE_FULL_EFFDT_L"];
            noOpDays = event.item["ROUTE_NOOP_DAYS_L"];
            holDays = event.item["ROUTE_HOL_DAYS_L"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_ROUTE_Z') {
            selDays = event.item["ROUTE_FULL_EFFDT_Z"];
            noOpDays = event.item["ROUTE_NOOP_DAYS_Z"];
            holDays = event.item["ROUTE_HOL_DAYS_Z"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_L') {
            selDays = event.item["FULL_EFFDT_L"];
            noOpDays = event.item["NOOP_DAYS_L"];
            holDays = event.item["LEG_HOL_DAYS_L"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_Z') {
            selDays = event.item["FULL_EFFDT_Z"];
            noOpDays = event.item["NOOP_DAYS_Z"];
            holDays = event.item["LEG_HOL_DAYS_Z"];
            flag = true;
        }
        if (flag == true) {
            parent.showDayControl(false, selDays, event.cell.domElement, true, null, true, null, null, noOpDays, null, holDays);
        }
    }
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
 * Schedule Matrix columns
 * Method to get Schedule Matrix columns
 * @param favColumns - Columns which are stored as part of favorite.
 */

function getMatrixColumns(favColumns) {

    var matrixCols = [{
        field: "LEG_ID",
        title: " ",
        hidden: getPropertyValue(favColumns, "LEG_ID", "isVisible", false),
        type: "checkbox",
        width: 20,
        headerWordWrap: "true",
        sortable: false,
        filterable: false,
        headerText:"Check legs that you want to synchronize with Map or Schematic",
        columnLockMode: "left",
        attributes: {
            style: "padding-left:4px;"
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler
    }, {
        field: "ROUTE_ID",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_NO,
        textAlign:"center",
        hidden: true,
        sortable: false,
        filterable: false,
        columnLockMode: "left",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "MV_NUM",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_NO,
        textAlign:"center",
        hidden: getPropertyValue(favColumns, "MV_NUM", "isVisible", false),
        sortable: true,
        filterable: true,
        columnLockMode: "left",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 65,
        footerLabel: "Leg Cnt: ",
        footerOperation: "count",
        footerOperationPrecision:"0",
        headerText: scheduleMatrixTreeGridConstants.HEADER_ROUTE_NO_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "MV_NUM_SEQ",
        hidden: getPropertyValue(favColumns, "MV_NUM_SEQ", "isVisible", false),
        title: scheduleMatrixTreeGridConstants.HEADER_S,
        textAlign:"center",
        sortable: true,
        filterable: true,
        columnLockMode: "left",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 35,
        headerText: scheduleMatrixTreeGridConstants.HEADER_S_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        sortable: true,
        field: "LOCAL_DAYS",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_EFF_DAYS_L,
        textAlign:"center",
        columnLockMode: "left",
        filterable: true,
        width: 180,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D1",
        title: getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        columnLockMode: "left",
        width: 45,
        headerText: WEEKDAYSCONSTANTS.mon,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 1);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFDAYSL_D2",
        title: getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        columnLockMode: "left",
        width: 45,
        headerText: WEEKDAYSCONSTANTS.tues,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 2);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D3",
        title: getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        columnLockMode: "left",
        width: 45,
        headerText: WEEKDAYSCONSTANTS.wed,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 3);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D4",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.thur,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 4);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D5",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.fri,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 5);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D6",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.sat,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 6);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSL_D7",
        title: getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        columnLockMode: "left",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.sun,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 7);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFWEEKSL_W1",
        title: scheduleMatrixTreeGridConstants.HEADER_W1 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        columnLockMode: "left",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk1,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 1);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFWEEKSL_W2",
        title: scheduleMatrixTreeGridConstants.HEADER_W2 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        columnLockMode: "left",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk2,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 2);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFWEEKSL_W3",
        title: scheduleMatrixTreeGridConstants.HEADER_W3 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        columnLockMode: "left",
        width: 45,
        headerText: WEEKSCONSTANTS.wk3,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 3);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFWEEKSL_W4",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W4 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk4,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 4);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFWEEKSL_W5",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W5 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk5,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 5);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "KEYWORD_EFFDT_L",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_KEY_EFF_DAYS_L,
        textAlign:"left",
        filterable: true,
        width: 175,
        headerText: HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "FULL_EFFDT_L",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_WEEK_EFF_DAYS_L,
        textAlign:"left",
        filterable: true,
        width: 225,
        headerText: HEADER_WEEK_EFF_DAYS_L_TOOLTIP,
        /*labelFunction: function(dataItem, column) {
        	return applyEffectiveDaysWithHolidaysTemplate(dataItem, dataItem.FULL_EFFDT_L, dataItem.LEG_HOL_DAYS_L);
        },*/
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        hidden: !isLocalTimeFlag(),
        field: "CAL_BUTTON_L",
        columnLockMode: "left",
        title: "&nbsp;",
        excludeFromExport: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
        filterable: false,
        sortable: false,
        width: 35,
        headerText: HEADER_LEG_CAL_L_TOOLTIP,
        labelFunction: calLabelFunction,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "ZULU_DAYS",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_EFF_DAYS_Z,
        textAlign:"center",
        filterable: true,
        columnLockMode: "left",
        width: 180,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D1",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.mon,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 1);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D2",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.tues,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 2);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D3",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.wed,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 3);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D4",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.thur,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 4);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D5",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.fri,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 5);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D6",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.sat,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 6);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFDAYSZ_D7",
        columnLockMode: "left",
        title: getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKDAYSCONSTANTS.sun,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 7);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "EFFWEEKSZ_W1",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W1 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk1,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 1);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFWEEKSZ_W2",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W2 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk2,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 2);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFWEEKSZ_W3",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W3 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk3,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 3);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFWEEKSZ_W4",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W4 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk4,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 4);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "EFFWEEKSZ_W5",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_W5 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: WEEKSCONSTANTS.wk5,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 5);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        hidden: true,
        field: "KEYWORD_EFFDT_Z",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_KEY_EFF_DAYS_Z,
        textAlign:"left",
        filterable: true,
        width: 175,
        headerText: HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "FULL_EFFDT_Z",
        columnLockMode: "left",
        title: scheduleMatrixTreeGridConstants.HEADER_WEEK_EFF_DAYS_Z,
        textAlign:"left",
        filterable: true,
        width: 225,
        headerText: HEADER_WEEK_EFF_DAYS_Z_TOOLTIP,
        /*labelFunction: function(dataItem, column) {
        	return applyEffectiveDaysWithHolidaysTemplate(dataItem, dataItem.FULL_EFFDT_Z, dataItem.LEG_HOL_DAYS_Z);
        },*/
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        hidden: isLocalTimeFlag(),
        field: "CAL_BUTTON_Z",
        columnLockMode: "left",
        title: "&nbsp;",
        excludeFromExport: true,
        filterable: false,
        sortable: false,
        width: 35,
        headerText: HEADER_LEG_CAL_Z_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
        labelFunction: calLabelFunction,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "LEG_TYPE",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_TYPE,
        textAlign:"center",
        sortable: true,
        filterable: true,
        columnLockMode: "left",
        enableHierarchicalNestIndent: true,
        width: 40,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_TYPE_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "EQUIP_TYPE",
        title: scheduleMatrixTreeGridConstants.HEADER_EQ,
        textAlign:"center",
        sortable: true,
        filterable: true,
        columnLockMode: "left",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 40,
        headerText: scheduleMatrixTreeGridConstants.HEADER_EQ_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "EQUIP_DESC",
        title: scheduleMatrixTreeGridConstants.HEADER_IATA_DESC,
        textAlign:"center",
        sortable: true,
        filterable: true,
        columnLockMode: "left",
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_IATA__DESC_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        field: "ORIGIN",
        title: scheduleMatrixTreeGridConstants.HEADER_SCHEDULE_ORG,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_SCHEDULE_ORG_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "DESTINATION",
        title: scheduleMatrixTreeGridConstants.HEADER_SCHEDULE_DEST,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_SCHEDULE_DEST_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        hidden: !isLocalTimeFlag(),
        field: "LOCAL_DEP",
        title: scheduleMatrixTreeGridConstants.HEADER_LOCAL_DEP,
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LOCAL_DEP_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "ZULU_DEP",
        title: scheduleMatrixTreeGridConstants.HEADER_ZULU_DEP,
        textAlign:"center",
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LOCAL_DEP_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        hidden: !isLocalTimeFlag(),
        field: "LOCAL_ARR",
        title: scheduleMatrixTreeGridConstants.HEADER_LOCAL_ARR,
        textAlign:"center",
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LOCAL_ARR_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "ZULU_ARR",
        title: scheduleMatrixTreeGridConstants.HEADER_ZULU_ARR,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LOCAL_ARR_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "ARRIVAL_DAY_L",
        title: scheduleMatrixTreeGridConstants.HEADER_ADY_L,
        textAlign:"center",
        filterable: true,
        headerText: scheduleMatrixTreeGridConstants.HEADER_ADY_L_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 65,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "ARRIVAL_DAY_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_ADY_Z,
        textAlign:"center",
        filterable: true,
        headerText: scheduleMatrixTreeGridConstants.HEADER_ADY_Z_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 60,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "LOC_GRND_MIN_QTY",
        width: 60,
        title: scheduleMatrixTreeGridConstants.HEADER_GRND_TIME,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        textAlign:"center",
        filterable: true,
        headerText: scheduleMatrixTreeGridConstants.HEADER_GRND_TIME_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "FLIGHT_MINS",
        title: scheduleMatrixTreeGridConstants.HEADER_FLIGHT,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        textAlign:"center",
        footerOperation: "sumTime",
        filterable: true,
        width: 60,
        headerText: scheduleMatrixTreeGridConstants.HEADER_FLIGHT_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "BLOCK_TIME_Z",
        textAlign:"center",
        title: scheduleMatrixTreeGridConstants.HEADER_BLOCK_SCH,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        footerOperation: "sumTime",
        filterable: true,
        width: 60,
        headerText: scheduleMatrixTreeGridConstants.HEADER_BLOCK_SCH_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "USE_LEG_MINS_FLAG",
        textAlign:"center",
        title: scheduleMatrixTreeGridConstants.HEADER_USE_LEG_MINS_FLAG,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        filterable: true,
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_USE_LEG_MINS_FLAG_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },	{   
		field: "MAX_PAYLOAD_WT",
		title: scheduleMatrixTreeGridConstants.HEADER_MAX_PAY_WT,
		width: 80,
		hidden:false,
		aggregates: ["sum"],
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		headerText: scheduleMatrixTreeGridConstants.HEADER_MAX_PAY_WT_TOOLTIP,
		labelFunction: function(dataItem, column, cell) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction(dataItem, column, cell);
        },
//		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"customsum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{   
		field: "MAX_PAYLOAD_CU",
		title: scheduleMatrixTreeGridConstants.HEADER_MAX_PAY_CU,
		hidden:false,
		width: 80,
		aggregates: ["sum"],
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		headerText: scheduleMatrixTreeGridConstants.HEADER_MAX_PAY_CU_TOOLTIP,
		labelFunction: function(dataItem, column, cell) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction(dataItem, column, cell);
        },
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"customsum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{   
        field: "MAX_PAYLOAD_WGT_SRC_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_MAX_PAYLOAD_WGT_SRC,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_MAX_PAYLOAD_WGT_SRC_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{   
        field: "SOURCE_NBR",
        title: scheduleMatrixTreeGridConstants.HEADER_SOURCE_NBR,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_SOURCE_NBR_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{   
        field: "CARRYOVER_FLAG",
        title: scheduleMatrixTreeGridConstants.HEADER_CARRYOVER_FLAG,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_CARRYOVER_FLAG_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{
        hidden: true,
        sortable: true,
        field: "NOOP_DAYS_L",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_NO_OPS_L,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_NO_OPS_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        hidden: true,
        field: "NOOP_DAYS_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_NO_OPS_Z,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_NO_OPS_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        hidden: true,
        sortable: true,
        field: "LEG_HOL_DAYS_L",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_HOL_DAYS_L,
        textAlign:"center",
        filterable: true,
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_HOL_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        hidden: true,
        field: "LEG_HOL_DAYS_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_HOL_DAYS_Z,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_HOL_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {   
        field: "ESTOPS_SCHE_FLAG",
        title: scheduleMatrixTreeGridConstants.HEADER_ESTOPS_SCHE_FLAG,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_ESTOPS_SCHE_FLAG_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	}, {   
        field: "COMMENTS",
        title: scheduleMatrixTreeGridConstants.HEADER_REVISION_COMMENTS,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_REVISION_COMMENTS_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION,
        width: 120,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            if (dataItem.COMMENTS == "") {
                return "";
            }
            var commObj = jQuery.parseJSON(dataItem.COMMENTS);
            internalList = getCommentList(1,commObj);
            var commentsText = "";
            if (internalList != null && internalList.length >0) {
            	 var commentLength = internalList.length-1;
                commentsText = internalList[commentLength].commentDesc;
            }
            if (commentsText == "") {
                return "";
            }
            if (dataItem.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
                return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#8f8f8f">'+ 
                '<span><a href="#" style="text-decoration: none"><font color="#8f8f8f">' + commentsText + '</font></a></span>'+
                '<span class = "comment-icon">'+
                '<img src="' + IOCN_IMAGE_PATH_COMMENT + '" style="vertical-align: top;"></span></td></tr></table>';
            } else {
                return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#376092">'+
                '<span><a href="#" style="text-decoration: none"><font color="#376092">' + commentsText + 
                '</font></a></span><span class = "comment-icon"><img src="' + IOCN_IMAGE_PATH_COMMENT + 
                '" style="vertical-align: top;"></span></td></tr></table>';
            }
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	if (this.dataField =="COMMENTS")  {
        		$(cell.domElement).find("label").addClass("comment-col");
        	}	
        	return applyCellTectColorTemplate(cell);
        }
	},{   
        field: "FORTE_REV_TMSTP",
        title: scheduleMatrixTreeGridConstants.HEADER_FORTE_REV_TMSTP,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_FORTE_REV_TMSTP_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            if (dataItem.FORTE_REV_TMSTP == "") {
                return "";
            }
            var date = new Date(dataItem.FORTE_REV_TMSTP);
            var cDate = date.getDate();
            var cMonth = date.getMonth() + 1;
            var cYear = date.getFullYear();
            var dateStr = '' + cYear + '-' + (cMonth <= 9 ? '0' + cMonth : cMonth) + '-' + (cDate <= 9 ? '0' + cDate : cDate);
            var cHour = date.getHours();
            var cMinuts = date.getMinutes();
            var cSeconds = date.getSeconds();
            var timeStr = (cHour <= 9 ? '0' + cHour : cHour) + ':' + (cMinuts <= 9 ? '0' + cMinuts : cMinuts) + ':' + (cSeconds <= 9 ? '0' + cSeconds : cSeconds);
            return dateStr + ' ' + timeStr;
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{   
        field: "PHX_LINE_HAUL_LEG_FLG",
        title: scheduleMatrixTreeGridConstants.HEADER_PHX_LINE_HAUL_LEG_FLG,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_PHX_LINE_HAUL_LEG_FLG_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{   
        field: "FLAG_DOM_CERT_FLG",
        title: scheduleMatrixTreeGridConstants.HEADER_FLAG_DOM_CERT_FLG,
        textAlign:"center",
        sortable: false,
        filterable: false,
        headerText: scheduleMatrixTreeGridConstants.HEADER_FLAG_DOM_CERT_FLG_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        width: 75,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
	},{
        field: "ALLOC_FLAG",
        title: scheduleMatrixTreeGridConstants.HEADER_ALLOC_FLAG,
        textAlign:"center",
        filterable: true,
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_ALLOC_FLAG_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },
	{
        field: "LAST_UPDT_TIME",
        title: scheduleMatrixTreeGridConstants.HEADER_LAST_UPDT_TIME,
        textAlign:"center",
        filterable: true,
        width: 130,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LAST_UPDT_TIME_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },
	{
        field: "LAST_UPDT_USER",
        title: scheduleMatrixTreeGridConstants.HEADER_LAST_CHG_USER,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LAST_CHG_USER_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "CHANGE_FLAG",
        title: scheduleMatrixTreeGridConstants.HEADER_CHANGE_FLAG,
        textAlign:"center",
        filterable: true,
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_CHANGE_FLAG_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "FLIGHT_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_FLIGHT_HST_CD,
        textAlign:"center",
        filterable: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_FLIGHT_HST_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "TAXIOUT_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_TAXIOUT_CD,
        textAlign:"center",
        filterable: true,
        width: 100,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TAXIOUT_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        field: "TAXI_OUT_MIN_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_TAXIOUT_MIN_Z,
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        textAlign:"center",
        width: 70,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TAXIOUT_MIN_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "B_OFFTIME_L",
        title: scheduleMatrixTreeGridConstants.HEADER_OFF_L,
        textAlign:"center",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_OFF_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "B_OFFTIME_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_OFF_Z,
        textAlign:"center",
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_OFF_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "LANDING_TIME_L",
        title: scheduleMatrixTreeGridConstants.HEADER_LAND_TIME_L,
        textAlign:"center",
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LAND_TIME_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "LANDING_TIME_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_LAND_TIME_Z,
        textAlign:"center",
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 40,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LAND_TIME_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TAXIIN_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_TAXIIN_CD,
        textAlign:"center",
        filterable: true,
        width: 100,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TAXIIN_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TAXI_IN_MIN_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_TAXIIN_MIN_Z,
        filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        textAlign:"center",
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TAXIIN_MIN_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "FREQ",
        title: scheduleMatrixTreeGridConstants.HEADER_FREQ,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_FREQ_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_1",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.mon,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 1);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_2",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,

        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.tues,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 2);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_3",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.wed,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 3);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_4",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.thur,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 4);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_5",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.fri,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 5);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_6",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.sat,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 6);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "TOTAL_FREQ_7",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.sun,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 7);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_1",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.mon,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 1);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_2",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.tues,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 2);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_3",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.wed,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 3);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_4",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.thur,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 4);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_5",
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.fri,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 5);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_6",
        //title: scheduleMatrixTreeGridConstants.HEADER_TTLZ_6,
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.sat,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 6);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "TOTAL_FREQZ_7",
        //title: scheduleMatrixTreeGridConstants.HEADER_TTLZ_7,
        title: scheduleMatrixTreeGridConstants.HEADER_TTL + getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TTL_TOOLTIP + WEEKDAYSCONSTANTS.sun,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 7);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "FLIGHT_COUNT",
        title: scheduleMatrixTreeGridConstants.HEADER_FLIGHT_COUNT,
        textAlign:"center",
        filterable: true,
        width: 55,
        aggregates: ["sum"],
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0",
        headerText: scheduleMatrixTreeGridConstants.HEADER_FLIGHT_COUNT_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "COMMENTS",
        title: scheduleMatrixTreeGridConstants.HEADER_COMMENTS,
        textAlign:"center",
        filterable: false,
        width: 120,
        headerText: scheduleMatrixTreeGridConstants.HEADER_COMMENTS_TOOLTIP,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION,
        labelFunction: function(dataItem, column) {
            if (dataItem.children != undefined && dataItem.children.length > 0) {
                return "";
            }
            if (dataItem.COMMENTS == "") {
                return "";
            }
            var commObj = jQuery.parseJSON(dataItem.COMMENTS);
            internalList = getCommentList(0,commObj);
           
            
            var commentsText = "";
            if (internalList != null && internalList.length >0) {
            	 var commentLength = internalList.length-1;
                commentsText = internalList[commentLength].commentDesc;
            }
            if (commentsText == "") {
                return "";
            }
            if (dataItem.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
                return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#8f8f8f">'+ 
                '<span><a href="#" style="text-decoration: none"><font color="#8f8f8f">' + commentsText + '</font></a></span>'+
                '<span class = "comment-icon">'+
                '<img src="' + IOCN_IMAGE_PATH_COMMENT + '" style="vertical-align: top;"></span></td></tr></table>';
            } else {
                return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#376092">'+
                '<span><a href="#" style="text-decoration: none"><font color="#376092">' + commentsText + 
                '</font></a></span><span class = "comment-icon"><img src="' + IOCN_IMAGE_PATH_COMMENT + 
                '" style="vertical-align: top;"></span></td></tr></table>';
            }
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	if (this.dataField =="COMMENTS")  {
        		$(cell.domElement).find("label").addClass("comment-col");
        	}	
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        field: "MODE",
        hidden: true,
        title: scheduleMatrixTreeGridConstants.HEADER_MODE,
        textAlign:"center",
        filterable: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_MODE_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "SCAC_CD",
        hidden: true,
        title: scheduleMatrixTreeGridConstants.HEADER_SCAC_CD,
        textAlign:"center",
        filterable: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_SCAC_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "IATA_MV_NBR",
        title: scheduleMatrixTreeGridConstants.HEADER_IATA_MV_NBR,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_IATA_MV_NBR_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "IN_DST",
        title: scheduleMatrixTreeGridConstants.HEADER_IN_DST,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_IN_DST_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TEMP_RT",
        title: scheduleMatrixTreeGridConstants.HEADER_TEMP_RT,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 55,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TEMP_RT_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        field: "MPH",
        title: scheduleMatrixTreeGridConstants.HEADER_MPH,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_MPH_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "OWNER_LOC_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_OWNER_LOC_CD,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 65,
        headerText: scheduleMatrixTreeGridConstants.HEADER_OWNER_LOC_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "REASON_CD",
        title: scheduleMatrixTreeGridConstants.HEADER_REASON_CD,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_REASON_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },  {
        field: "CARRIER_STG_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_CARRIER_STG_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_CARRIER_STG_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRACK_EQUIP_TYPE",
        title: scheduleMatrixTreeGridConstants.HEADER_TRACK_EQUIP_TYPE,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRACK_EQUIP_TYPE_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRACK_PERSTAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRACK_PERSTAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRACK_PERSTAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRACK_STAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRACK_STAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRACK_STAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_OPT",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_OPT,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_OPT_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_1PRESTAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_1PRESTAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_1PRESTAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_1STAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_1STAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_1STAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_2PRESTAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_2PRESTAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 85,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_2PRESTAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_2STAGE_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_2STAGE_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 95,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_2STAGE_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TRAIL_AVAIL_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_TRAIL_AVAIL_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 95,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TRAIL_AVAIL_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "UNLOAD_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_UNLOAD_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_UNLOAD_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "LOAD_TM",
        title: scheduleMatrixTreeGridConstants.HEADER_LOAD_TM,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LOAD_TM_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "LEG_MILES",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_MILES,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_MILES_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "LEG_KMS",
        title: scheduleMatrixTreeGridConstants.HEADER_LEG_KMS,
        textAlign:"center",
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
        filterable: true,
        width: 50,
        headerText: scheduleMatrixTreeGridConstants.HEADER_LEG_KMS_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },{
        field: "DAILY_RT_CC_CHG",
        title: scheduleMatrixTreeGridConstants.HEADER_DAILY_RT_CC_CHG,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
        textAlign:"center",
        filterable: true,
        hidden: true,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_DAILY_RT_CC_CHG_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "TOTAL_MTH_CST",
        title: scheduleMatrixTreeGridConstants.HEADER_TOTAL_MTH_CST,
        textAlign:"center",
        filterable: true,
        hidden: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
        width: 75,
        headerText: scheduleMatrixTreeGridConstants.HEADER_TOTAL_MTH_CST_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },
    //FDX-1212 SM: Add/Update/Tool Tip for Global Region Code
    {
        hidden: true,
        field: "GLOBAL_RGN_DESC",
        title: scheduleMatrixTreeGridConstants.HEADER_GLOBAL_RGN_CD,
        textAlign:"center",
        filterable: true,
        width: 90,
        headerText: scheduleMatrixTreeGridConstants.HEADER_GLOBAL_RGN_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }/*, {
        hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D1", "isVisible", true),
        field: "RTEEFFDAYSL_D1",
        title: getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        sortable: true,
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 1);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 1);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D2", "isVisible", true),
        sortable: true,
        field: "RTEEFFDAYSL_D2",
        title: getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 2);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 2);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSL_D3",
        title: getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        sortable: true,
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 3);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 3);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSL_D4",
        title: getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 4);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 4);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSL_D5",
        title: getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 5);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 5);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSL_D6",
        title: getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 6);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 6);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSL_D7",
        title: getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 7);
	    	//return 0xFBEA74;
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
        labelFunction: function(dataItem, column) {
	    	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 7);
	    	//return 0xFBEA74;
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSL_W1",
        title: scheduleMatrixTreeGridConstants.HEADER_W1 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 1);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSL_W2",
        title: scheduleMatrixTreeGridConstants.HEADER_W2 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 2);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSL_W3",
        title: scheduleMatrixTreeGridConstants.HEADER_W3 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 3);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSL_W4",
        title: scheduleMatrixTreeGridConstants.HEADER_W4 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 4);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSL_W5",
        title: scheduleMatrixTreeGridConstants.HEADER_W5 + scheduleMatrixTreeGridConstants.HEADER_LOCAL_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 5);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "ROUTE_LOCAL_DAYS",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_EFF_DAYS_L,
        textAlign:"center",
        filterable: true,
        width: 120,
        headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_KEYWORD_EFFDT_L",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_KEY_EFF_DAYS_L,
        textAlign:"left",
        filterable: true,
        width: 175,
        headerText: HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "ROUTE_FULL_EFFDT_L",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_WEEK_EFF_DAYS_L,
        textAlign:"left",
        filterable: true,
        width: 225,
        headerText: HEADER_ROUTE_WEEK_EFF_DAYS_L_TOOLTIP,
        labelFunction: function(dataItem, column) {
        	return applyEffectiveDaysWithHolidaysTemplate(dataItem, dataItem.ROUTE_FULL_EFFDT_L, dataItem.ROUTE_HOL_DAYS_L);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_NOOP_DAYS_L",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_NO_OPS_L,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: HEADER_NO_OPS_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_HOL_DAYS_L",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_HOL_DAYS_L,
        textAlign:"center",
        filterable: true,
        width: 80,
        headerText: HEADER_ROUTE_HOL_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: !isLocalTimeFlag(),
        field: "CAL_BUTTON_ROUTE_L",
        title: "&nbsp;",
        excludeFromExport: true,
        filterable: false,
        sortable: false,
        width: 45,
        headerText: HEADER_ROUTE_CAL_L_TOOLTIP,
        labelFunction: calLabelFunction,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },*//*, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D1",
        title: getEffDaysConfiguration()[0] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 1);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D2",
        title: getEffDaysConfiguration()[1] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 2);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D3",
        title: getEffDaysConfiguration()[2] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 3);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D4",
        title: getEffDaysConfiguration()[3] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 4);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D5",
        title: getEffDaysConfiguration()[4] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 5);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D6",
        title: getEffDaysConfiguration()[5] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 6);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFDAYSZ_D7",
        title: getEffDaysConfiguration()[6] + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 7);
    	},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSZ_W1",
        title: scheduleMatrixTreeGridConstants.HEADER_W1 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 1);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSZ_W2",
        title: scheduleMatrixTreeGridConstants.HEADER_W2 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 2);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSZ_W3",
        title: scheduleMatrixTreeGridConstants.HEADER_W3 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 3);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSZ_W4",
        title: scheduleMatrixTreeGridConstants.HEADER_W4 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 4);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "RTEEFFWEEKSZ_W5",
        title: scheduleMatrixTreeGridConstants.HEADER_W5 + scheduleMatrixTreeGridConstants.HEADER_ZULU_SUFFIX,
        textAlign:"center",
        filterable: true,
        width: 45,
        headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 5);
		},
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "ROUTE_ZULU_DAYS",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_EFF_DAYS_Z,
        textAlign:"center",
        filterable: true,
        width: 120,
        headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_KEYWORD_EFFDT_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_KEY_EFF_DAYS_Z,
        textAlign:"center",
        filterable: true,
        width: 175,
        headerText: HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        sortable: true,
        field: "ROUTE_FULL_EFFDT_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_WEEK_EFF_DAYS_Z,
        textAlign:"left",
        filterable: true,
        width: 225,
        headerText: HEADER_ROUTE_WEEK_EFF_DAYS_Z_TOOLTIP,
        labelFunction: function(dataItem, column) {
        	return applyEffectiveDaysWithHolidaysTemplate(dataItem, dataItem.ROUTE_FULL_EFFDT_Z, dataItem.ROUTE_HOL_DAYS_Z);
        },
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_NOOP_DAYS_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_NO_OPS_Z,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: HEADER_NO_OPS_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        sortable: true,
        field: "ROUTE_HOL_DAYS_Z",
        title: scheduleMatrixTreeGridConstants.HEADER_ROUTE_HOL_DAYS_Z,
        textAlign:"center",
        filterable: true,
        width: 75,
        headerText: HEADER_ROUTE_HOL_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: isLocalTimeFlag(),
        field: "CAL_BUTTON_ROUTE_Z",
        title: "&nbsp;",
        excludeFromExport: true,
        filterable: false,
        sortable: false,
        width: 45,
        headerText: HEADER_ROUTE_CAL_Z_TOOLTIP,
        labelFunction: calLabelFunction,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }*//*,{
        field: "CARRIER_DESC",
        title: scheduleMatrixTreeGridConstants.HEADER_CARRIER,
        textAlign:"center",
        filterable: true,
        width: 65,
        headerText: HEADER_CARRIER,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        hidden: true,
        field: "OPERATING_COST",
        title: scheduleMatrixTreeGridConstants.HEADER_OPERATING_COST,
        textAlign:"center",
        filterable: true,
        width: 55,
        headerText: HEADER_OPERATING_COST_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }, {
        field: "BAL_MV_NBR",
        title: scheduleMatrixTreeGridConstants.HEADER_BAL_MV_NBR,
        textAlign:"center",
        filterable: true,
        width: 55,
        headerText: HEADER_BAL_MV_NBR_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    },
    
   {
        hidden: true,
        field: "GLOBAL_RGN_DESC",
        title: scheduleMatrixTreeGridConstants.HEADER_GLOBAL_RGN_CD,
        textAlign:"center",
        filterable: true,
        width: 90,
        headerText: scheduleMatrixTreeGridConstants.HEADER_GLOBAL_RGN_CD_TOOLTIP,
        cellBackgroundColorFunction: cellWhiteBackgroundFunctionHandler,
        cellTextColorFunction: function(cell) {
        	return applyCellTectColorTemplate(cell);
        }
    }*/
    ];
    
    //nested column pattern
    //matrixCols.push(getNestedColumns());
    
    return matrixCols;
}


function recursiveColumns(nestedColumn, count){
	var columns;
	var nestedColumns;
	if(nestedColumn != undefined){
		for(var i=0; i< count; i++){
			if(nestedColumn["level"] == undefined){
				nestedColumn["level"] = i+1;
				columns = nestedColumn["columns"];
				nestedColumns = getNestedColumns();
				columns.push(nestedColumns);
			}			
			recursiveColumns(nestedColumns, (count-1));
		}		
	}
};

function getNestedColumns(){	
	return  { 
		type: "nextlevel",
		parentChildrenField: "children",
		childrenField: undefined,
		currentLevelParentFiled: "children",  
		selectedKeyField: "LED_ID",
		nestIndent:undefined,
		isReusePreviousLevelColumns: false,
		columns: [
			{
				field: "",
				title: "", 
				hidden: false,
			    type : "checkbox",
				headerWordWrap:"true",
				sortable:false,
				filterable:false,
				width: 20,								
				attributes: { style:"padding-left:4px;"}
			},      
			{
				field: "LEG_ID",
				title: " ", 
				hidden: true,
			    headerWordWrap:"true",
				sortable:false,
				filterable:false,
				width: 20,
				/*columnLockMode:"left",*/
				attributes: { style:"padding-left:4px;"}
			},
			{ 	
				field: "ORIGIN", 
				title: "Origin", 
				attributes:  { style:"text-align:center;" },        		
            	width: 100
            },
            { 
            	field: "DESTINATION", 
            	title: "Destination", 
            	columnWidthMode:"fitToContent",
            	attributes:  { style:"text-align:center;" },
            	width: 100
            },
            { 
            	field: "", 
            	title:"", 
            	excludeFromSettings:true,
            	excludeFromPrint:true,
            	excludeFromExport:true,
            	paddingLeft:0, 
            	paddingRight:0,
            	width:1,
            	minWidth:1
            }
		]
	};	
}

/**
 * Schedule Matrix Aggregate columns
 * Method to configure aggregate columns in Schedule matrix
 */

function getAggregateColumns() {
    var aggregateCols = [{
        field: "MV_NUM",
        aggregate: "count"
    }];
    return aggregateCols;
}


/**
 * Method used to create Comments window
 * This method create kendo window for comments window
 */

function createCommentsWin(itemDiv, selectedText) {
    var commentWin = $('#' + itemDiv);
    $("#comments").html(selectedText);
    $("#comments").dialog();
}


/**
 * Reset Grid Header
 * Method to reset Schedule matrix header with the default state of icons.
 */

function resetGridHeader() {
    var btnSyncMap = parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
    var btnSyncSchematic = parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');

    parent.highlightBtn(btnSyncMap.parent()[0], true);
    parent.enableSync(btnSyncMap.parent()[0], getDashboardID(), [parent.DASHBOARD_ID_MAP_VIEW, parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
    parent.highlightBtn(btnSyncSchematic.parent()[0], true);
    parent.enableSync(btnSyncSchematic.parent()[0], getDashboardID(), parent.DASHBOARD_ID_NETWORK_MATRIX, [parent.DASHBOARD_ID_MAP_VIEW, parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
}


/**
 * To populate Flight Frequency columns.
 * Method to configure all Freq columns on Schedule matrix data.
 */

function populateFltFreqColumns(dataItem, effDaysL, effDaysZ) {
    var effDaysL = dataItem[effDaysL];
    var dayStringArray = effDaysL.split(",");
    var effDaysZ = dataItem[effDaysZ];
    var dayStringZArray = effDaysZ.split(",");
    var noOpfreqColumnsL = new Array();
    var noOpfreqColumnsZ = new Array();
    // Updating Local Freq columns based on selected week
    var freqSelectedInd = $('#freqComboSettings')[0].value;
    var totFreqL = buildFlightFreqStr(dayStringArray[freqSelectedInd]);
    var totFreq = 0;
    //var totFreqZulu = 0;
    for (var i = 1; i < 8; i++) {
        dataItem["TOTAL_FREQ_" + i] = totFreqL.charAt(i - 1);
        totFreq = parseInt(totFreq) + parseInt(totFreqL.charAt(i - 1));
    }
    var totFreqZ = buildFlightFreqStr(dayStringZArray[freqSelectedInd]);
    for (var j = 1; j < 8; j++) {
        dataItem["TOTAL_FREQZ_" + j] = totFreqZ.charAt(j - 1);
        //totFreqZulu = parseInt(totFreqZulu) + parseInt(totFreqZ.charAt(j - 1));
    }
    var fltCount = buildTotalFlightCount(dayStringArray);
    if (totFreq == 0) {
        for (var i = 1; i < 8; i++) {
            dataItem["TOTAL_FREQ_" + i] = 0;
        }
    }
    if (totFreqZ == 0) {
        for (var i = 1; i < 8; i++) {
            dataItem["TOTAL_FREQZ_" + i] = 0;
        }
    }

    dataItem.FREQ = totFreq;
    dataItem.FLIGHT_COUNT = fltCount;
}

/**
 * Total Freq template.
 * Method to apply Total Freq columns template on Schedule matrix data.
 * If the CHANGE_FLAG is 'D'. It means leg is deleted.
 */

function applyTotalFltFreqTemplate(dataItem, totalFltFreqColumn, index) {
    var totalFltFreq = dataItem[totalFltFreqColumn + index];

    /*if (dataItem.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
        return '<span style="color:#ff0000">' + totalFltFreq + '</span>';
    }*/

    return parseInt(totalFltFreq);
}

/**
 * Total Freq template.
 * Method to apply Total Freq columns template on Schedule matrix data.
 * If the CHANGE_FLAG is 'D'. It means leg is deleted.
 */

/*function applyEffectiveDaysWithHolidaysTemplate(dataItem, fullEffDays, holEffDays) {
	var effDays;
    if (dataItem.children != undefined && dataItem.children.length > 0) {
		effDays = "";
    }else {
    	try {
            var holWeekArray = formatHolidayString(holEffDays);
            var fullEffDaysArray = fullEffDays.toString().split(",");
            var effDayByWeek;
            for (var i = 0; i < holWeekArray.length; i++) {
        		effDayByWeek = fullEffDaysArray[i].trim();
                for (var j = 0; j < holWeekArray[0].length; j++) {
                	if (holWeekArray[i].charAt(j) != "-") {
            			effDayByWeek = replaceAt(effDayByWeek, j, holWeekArray[i].charAt(j));
            		}
            	}
            	fullEffDaysArray[i] = effDayByWeek;
            }
        	effDays = fullEffDaysArray.join(COMMA_STRING);
    	} catch (e) {
            parent.showErrorMsg(e.message);
        }
    }
	return effDays;
}*/

//replace the character from str at given index
function replaceAt(str, index, character) {
	return str.substr(0, index) + character + str.substr(index+character.length);
}

/**
 * Can Apply Clear
 * Method to check if clear operation can be applied in Schedule/Network Schedule matrix
 */

function canApplyClear() {
    if (isNetworkScheduleFlag) {
        return parent.isNetworkQuery;
    } else {
        return !parent.isNetworkQuery;
    }
}

function getGroupbarId(){
	return "groupBar";
}

(function($) {
    jQuery.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler.apply(this, arguments);
            }
        }
    };
    if (kendo && kendo.ui && kendo.ui.Widget) {
        kendo.ui.Widget.prototype.init = function(element, options) {
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