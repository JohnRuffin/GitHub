dojo.require("esri.tasks.PrintTask");
dojo.require("esri.tasks.PrintParameters");
var LAYER_REQUEST_URL = "MAGMARequestHandler";
/**
 * common variable across all dashboards having the value of the current dashboard id
 */
var viewerDashboardId = parent.DASHBOARD_ID_MAP_VIEW;
var mapViewDiv = function() {

    };

function isScheduleMaintainance() {
    return parent.isScheduleMaintenanance;
}

function isAddLeg() {	
	LoggerUtils.console("is Active ["+parent.isAddleg +"]");
    return parent.isAddleg;
}

function addLeg(){	
	parent.isAddleg = !parent.isAddleg;
	ESRIHelper.getEditToolManager().setAddLeg(parent.isAddleg);
}

function addRoute(){	
	parent.isAddRoute = !parent.isAddRoute;
	ESRIHelper.getEditToolManager().setAddRoute(parent.isAddRoute);
}


/**
 * an array of base maps...
 */
var allMapLayers = [{
    id: "Relief",
    opacity: 0.5,
    visible: true,
    tileServerUrl: parent.SERVER_PROTOCOL + "://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer",
    displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    background: "#C1D5E8"
}, {
    id: "Grey",
    opacity: 0.5,
    visible: false,
    tileServerUrl: parent.SERVER_PROTOCOL + "://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
    displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    background: "#DADEE6"
}, {
    id: "Topography",
    opacity: 0.5,
    visible: false,
    tileServerUrl: parent.SERVER_PROTOCOL + "://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
    displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    background: "#CEE8FB"
}, {
    id: "Oceans",
    opacity: 0.5,
    visible: false,
    tileServerUrl: parent.SERVER_PROTOCOL + "://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer",
    displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    background: "#B7CEEA"
}];
/**
 * holds all base map objects
 */
var allBaseMaps = [];
/**
 * holds all custom arcgis tile map server layers
 */
var customLods = [{
    "level": 0,
    "scale": 73957190.948944,
    "resolution": 19567.87924099992
}, {
    "level": 1,
    "scale": 36978595.474472,
    "resolution": 9783.93962049996
}, {
    "level": 2,
    "scale": 18489297.737236,
    "resolution": 4891.96981024998
}, {
    "level": 3,
    "scale": 9244648.868618,
    "resolution": 2445.98490512499
}, {
    "level": 4,
    "scale": 4622324.434309,
    "resolution": 1222.992452562495
}, {
    "level": 5,
    "scale": 2311162.217155,
    "resolution": 611.4962262813797
}, {
    "level": 6,
    "scale": 1155581.108577,
    "resolution": 305.74811314055756
}, {
    "level": 7,
    "scale": 288895.277144,
    "resolution": 152.87405657041106
}, {
    "level": 8,
    "scale": 288895.277144,
    "resolution": 76.43702828507324
}, {
    "level": 9,
    "scale": 144447.638572,
    "resolution": 38.21851414253662
}, {
    "level": 10,
    "scale": 72223.819286,
    "resolution": 19.10925707126831
}, {
    "level": 11,
    "scale": 36111.909643,
    "resolution": 9.554628535634155
}, {
    "level": 12,
    "scale": 18055.954822,
    "resolution": 4.77731426794937
}, {
    "level": 13,
    "scale": 9027.977411,
    "resolution": 2.388657133974685
}, {
    "level": 14,
    "scale": 4513.988705,
    "resolution": 1.1943285668550503
}, {
    "level": 15,
    "scale": 2256.994353,
    "resolution": 0.5971642835598172
}, {
    "level": 16,
    "scale": 1128.497176,
    "resolution": 0.29858214164761665
}];;
var loadCount = 0;

/**
 * esriMap object
 */
var esriMap;

mapViewDiv.ECOEXPML_NETWORK_LANES = "nwlanes.ecoexpml";
mapViewDiv.ECOEXPML_SCHEDULE_LEGS = "schedlegs.ecoexpml";
mapViewDiv.ECOEXPML_MODE_ANALYSIS = "modeanalysis.ecoexpml";
mapViewDiv.ECOEXPML_FACILITY_LOCATION = "facilitylocation.ecoexpml";

mapViewDiv.layerIdIndex = 1;
mapViewDiv.LAYER_ID_NETWORK_LANES = mapViewDiv.layerIdIndex++;
mapViewDiv.LAYER_ID_NETWORK_SCHEDULE_LEGS = mapViewDiv.layerIdIndex++;
mapViewDiv.LAYER_ID_SCHEDULE_LEGS = mapViewDiv.layerIdIndex++;
mapViewDiv.LAYER_ID_MODE_ANALYSIS = mapViewDiv.layerIdIndex++;
mapViewDiv.LAYER_ID_LASSO = mapViewDiv.layerIdIndex++;
mapViewDiv.LAYER_ID_FACILITY_LOCATIONS = mapViewDiv.layerIdIndex++;

mapViewDiv.LAYER_IDS_NETWORK = [window[viewerDashboardId].LAYER_ID_NETWORK_LANES, window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS];
mapViewDiv.LAYER_IDS_SCHEDULE = [window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS];


var viewerToggleBtnDivId = "map-view";
var PROGRESS_DIALOG_TITLE = "map";
var favoritesMenuId = "mapViewerFavoritesMenu";
var localZuluBtnName = "toggleMZulu";

var selectedBaseMap = "Relief";
var selectedMapTransparency = 50; /******** Lasso **************/
var lasso;
var lassoGraphicLayer;
var lassoIds = {};
var resizeTimer;

var modeAnalysisLocation;
var modeAnalysisActivities;

var lassoContextMenu;
var contextManager; /******* common methods - start *******/
var locationSelectionManager;
var lastHoveredGraphicSymbol;
var isMapInitialized = false; /******* Print properties*******/
var printTask;
var facLocDataLoadStatus = {
    isRamps: false,
    isDockLocs: false,
    isHubs: false,
    isAirpotFeeder: false,
    isAirpotTrunk: false,
    isAirpotLineHaul: false,
    stations: false,
    meetPoints: false,
    isDefaultConfig: false,
    userAddedLocations: false
};
var menu; //schedule maintainance property 
var changeRoutObject;
/**
 * remove the map layers
 * @param layerIds an array of map layers
 */

mapViewDiv.clearLayers = function(layerIds) {
    if (esriMap != undefined) {
        if (layerIds) {
            esriMap.removeMapLayers(layerIds);
        } else {
            esriMap.removeMapLayers(window[viewerDashboardId].LAYER_IDS_NETWORK);
            esriMap.removeMapLayers(window[viewerDashboardId].LAYER_IDS_SCHEDULE);
        }
        esriMap.removeMapLayer(window[viewerDashboardId].LAYER_ID_MODE_ANALYSIS);
        //clear all the map layer details
        ESRIHelper.getEsriZoomManager().clearAll(layerIds);
    }
};

/**
 * remove layers by data type...
 * @param dataType
 */

function removeLayerByDataType(dataType) {
    var layerId = getLayerIdByDataType(dataType);
    if (layerId != undefined) {
        esriMap.removeMapLayer(layerId);
    }
}

/**
 * onresize of the map viewer dashboard, need to resize & resposition the 
 * map and also have to resize all the popup's (leg detail or lane detail...)
 */

function onResize() {
	var windowProperties;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (esriMap.map) {
            esriMap.map.resize();
            esriMap.map.reposition();
        }
        windowProperties = parent.dashboardController. getWindowProperties(parent.DASHBOARD_ID_MAP_VIEW);
        if(windowProperties){
        	$("#SchdleMntnceMapDwrContent").css({"max-height": windowProperties.height-100});
        }
    }, 500);
    setTimeout(function() {
        resizeAllPopUps();
    }, 200);
    
    
}

function bindToggleButtonClick(buttonParentElement) {
    buttonParentElement.attr('onclick', 'getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).toggleView(this, true)').bind('click');
} /******* common methods - end *******/

/******* display settings - start *******/
/**
 * Display Option Settings: apply the general tab settings...
 */

function applyViewerDisplaySettings() {
    applyGeneralDisplaySettings(getGeneralDisplaySettings());
    loadFacilityLocationsLayer(true);
}

function loadFacilityLocationsLayer(isRefresh) {
    var locMap = getFacLocStatus();
    if (isMapNotEquals(facLocDataLoadStatus, locMap) || isRefresh) {
        //clear all facilities details
        esriMap.clearLayerGraphics(window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS);
        //load the details
        if (locMap["isRamps"] || locMap["isDockLocs"] || locMap["isHubs"] || locMap["isAirpotFeeder"] || locMap["isAirpotTrunk"] || locMap["isAirpotLineHaul"] || locMap["isAirpotFeeder"] || locMap["isDefaultConfig"] || locMap["meetPoints"] || locMap["userAddedLocations"]) {
            loadFacLocsLayer(window[viewerDashboardId].ECOEXPML_FACILITY_LOCATION, window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS, addFacLocsLayer, locMap);
        }
        facLocDataLoadStatus = getFacLocStatus();
    } else {
        //change /update the scale....
        esriMap.setLayerMinScale(window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS + "_facilityLabelLayer", getLodIndex());
    }
    updateDropDownAttrs(viewerDashboardId, '.icon-lasso-select-disable', "k-sprite k-icon icon-lasso-select", EMPTY_STRING, true);
}

function loadUserAddedLocations() {
    loadFacilityLocationsLayer(); 
    openLocationsPopup();
}

function openLocationsPopup(){
	 if ($("#userAddedLocations").is(":checked")) {
        if (parent.searchPopUpMap['selectLocations']) {
            parent.searchPopUpMap['selectLocations'].openFilterPopUp();
        } else {
            parent.openSelectLocDialog('selectLocations', 'Select Locations', undefined, undefined, false, null, null, this);
        }
    } else {
        $('#selectLocations').dialog('close');
    }
}

function getFacLocStatus() {
    var locMap = new Object();
    locMap["isRamps"] = $("#rampsChk").is(":checked");
    locMap["isDockLocs"] = $("#dockChk").is(":checked");
    locMap["isHubs"] = $("#hubsChk").is(":checked");
    locMap["isAirpotFeeder"] = $("#airportFeeder").is(":checked");
    locMap["isAirpotTrunk"] = $("#airportTrunk").is(":checked");
    locMap["isAirpotLineHaul"] = $("#airportLineHaul").is(":checked");
    locMap["meetPoints"] = $("#meetPoints").is(":checked");
    locMap["stations"] = $("#stations").is(":checked");
    locMap["isDefaultConfig"] = $("#isDefaultConfig").is(":checked");
    locMap["userAddedLocations"] = $("#userAddedLocations").is(":checked");
    locMap["facilityUsedType"] = getfacilityUsedType();

    return locMap;
}

function getfacilityUsedType() {
    if ($("#displayUsedOnlyRadio").is(":checked")) {
        return "Y";
    } else {
        return "N";
    }
}

function isMapNotEquals(firstMap, secMap) {
    try {
        if (firstMap.length != secMap.length) {
            return true;
        } else {
            for (var key in firstMap) {
                if (firstMap[key] != secMap[key]) {
                    return true;
                }
            }
            return false;
        }
    } catch (e) {
        console.log("Error in isMapNotEquals" + e.message);
    }
}

function showLocationClickHandler(event) {
    if (viewerDataEnabled != undefined && !getViewerDataEnabled()) {
        $("#applyDisplaySettings").removeAttr("disabled");
    }
}

/**
 * applying the general tab settings in display settings...
 * @param displaySettings
 */

function applyGeneralDisplaySettings(displaySettings) {
    setLabelType(displaySettings["labeltype"]);
}

/**
 * retrieve all the details for the general tab in display settings...
 * @returns {___anonymous4595_4596}
 */

function getGeneralDisplaySettings() {
    var displaySettings = {};
    var labelType = "";
    if (!($("#nolblradio")[0].checked)) {
        labelType = "none";
    } else if ($("#airCtyradio")[0].checked) {
        labelType = "city";
    }

    displaySettings["labeltype"] = labelType;

    return displaySettings;
}

/**
 * base map change handler....
 * @param baseMapsCmb
 */

function changeBaseMap(baseMapsCmb) {
    //hide the one which is already shown..
    esriMap.showMapLayer(selectedBaseMap, false);
    //get the base map layer id
    selectedBaseMap = baseMapsCmb.value;
    //show the selected base map...
    esriMap.showMapLayer(selectedBaseMap, true);
    //set the transparency
    esriMap.setMapTransparency(selectedBaseMap, selectedMapTransparency);
    //change the background color...
    changeMapWinBackgroundColor(baseMapsCmb.value);
}

/**
 * Region chnage handler....
 */

function changeRegion(regionCmb) {
    //change the map extent of the selected region type...
    changeMapExtent(regionCmb.value);
}

/**
 * change the map extent....according to the selected region type...
 * @param region
 */

function changeMapExtent(region) {
    var customExtentAndSR;
    if (region == "APAC only") {
        customExtentAndSR = new esri.geometry.Extent(138.6720703125465, -18.10664414070422, 143.7503906250869, 48.66016584879858);
    } else if (region == "Europe only") {
        customExtentAndSR = new esri.geometry.Extent(-15.387685546857753, 36.06340387460192, 58.616220703122586, 59.26369417432977);
    } else if (region == "US only") {
        customExtentAndSR = new esri.geometry.Extent(-136.67674804682548, 23.479476755518085, -62.67284179684517, 50.983405703942964);
    } else if (region == "APAC-US") {
        customExtentAndSR = new esri.geometry.Extent(-360.372656249963434, -16.893506245063435, 39.13998046882068, 78.16328477626925);
    } else if (region == "US-Europe") {
        customExtentAndSR = new esri.geometry.Extent(-116.41839843745576, 9.358565211036472, 31.58941406250489, 62.18422264520656);
    } else if (region == "Europe-APAC") {
        customExtentAndSR = new esri.geometry.Extent(-7.873476562484629, 8.229437932519877, 140.13433593747604, 61.64633945332139);
    } else if (region == "North America") {
        customExtentAndSR = new esri.geometry.Extent(-160.67674804682548, 0.479476755518085, 3.67284179684517, 50.983405703942964);
    } else {
        customExtentAndSR = new esri.geometry.Extent(-132.808242187452, -34.74621121567413, 163.20738281246906, 71.523135455252);
    }
    esriMap.setMapExtent(customExtentAndSR);
}

/**
 * enable / disable the auto zoom....
 * @param chkAutoZoom
 */

function enableAutoZoom(chkAutoZoom) {
    esriMap.enableAutoZoom(chkAutoZoom.checked);
}

/**
 * set map transparency...
 * @param e
 */

function setMapTransparency(e) {
    selectedMapTransparency = e.value;
    esriMap.setMapTransparency(selectedBaseMap, selectedMapTransparency);
}

/******* display settings- end *******/

/******* common methods - favorites - start *******/
/**
 * retrieve the header button settings of the map viewer dashboard...
 */

function getHeaderButtonSettings(isApplicationLevel) {
    var headerButtonSettings = {};
    if (isApplicationLevel && isApplicationLevel != undefined) {
        headerButtonSettings = getViewerHeaderButtonSettings(false);
    } else {
        headerButtonSettings = getViewerHeaderButtonSettings(true);
    }

    if (parent.$('#marketView')[0].isHighlighted != null) {
        headerButtonSettings["marketViewEnabled"] = parent.$('#marketView')[0].isHighlighted;
    } else {
        headerButtonSettings["marketViewEnabled"] = false;
    }
    return headerButtonSettings;
}

/**
 * retrieve the display option settings of map viewer settings...
 * @param isApplicationLevel
 * @returns {___anonymous8714_8715}
 */

function getDisplayOptionSettings(isApplicationLevel) {
    var displaySettings = {};
    displaySettings.generalDisplayFav = getGeneralTabSettingsFavorite();
    displaySettings.scheduleDisplayFav = getScheduleTabSettingsFavorite(true);
    displaySettings.networkDisplayFav = getNetworkTabSettingsFavorite(true);
    return displaySettings;
}

/**
 * retrieve the content settings of map viewer
 * @param isApplicationLevel
 * @returns {___anonymous9176_9177}
 */

function getContentFavoriteSettings(isApplicationLevel) {
    var contentFav = {};
    contentFav.mapExtent = esriMap.map.extent;
    return contentFav;
}

/**
 * apply the header button settings 
 * @param headerButtonSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

function applyHeaderButtonSettings(headerButtonSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (headerButtonSettings != null) {
/*parent.highlightBtn(parent.$('#btnMapSyncSchematic')[0],!headerButtonSettings["btnMapSyncSchematicClass"]);
		parent.enableSync(parent.$('#btnMapSyncSchematic')[0],parent.DASHBOARD_ID_MAP_VIEW,[parent.DASHBOARD_ID_SCHEMATIC_VIEW,parent.DASHBOARD_ID_NETWORK_MATRIX,parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,parent.DASHBOARD_ID_SCHEDULE_MATRIX]);
		parent.highlightBtn(parent.$('#btnMapSyncMatrix')[0],!headerButtonSettings["btnMapSyncMatrixClass"]);
		parent.enableSync(parent.$('#btnMapSyncMatrix')[0],parent.DASHBOARD_ID_MAP_VIEW,[parent.DASHBOARD_ID_SCHEMATIC_VIEW,parent.DASHBOARD_ID_NETWORK_MATRIX,parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,parent.DASHBOARD_ID_SCHEDULE_MATRIX]);
		*/
        applyViewerHeaderButtonSettings(headerButtonSettings, false);
        if (!parent.isNetworkQuery || (parent.isNetworkQuery && parent.getDashboardContentWindow(viewerDashboardId).isScheduleForNetworkFlag)) {
            parent.highlightBtn(parent.$('#marketView')[0], !headerButtonSettings["marketViewEnabled"]);
        } else {
            parent.highlightBtn(parent.$('#marketView')[0], false);
        }
        parent.VIEWER.enableMarketView(parent.$('#marketView')[0], parent.DASHBOARD_ID_MAP_VIEW);
    }
}

/**
 * apply display option settings for map viewer dashboard
 * @param displayOptionSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (displayOptionSettings) {
        applyGeneralTabSettingsFavorite(displayOptionSettings.generalDisplayFav);
        applyScheduleTabSettingsFavorite(displayOptionSettings.scheduleDisplayFav, true);
        applyNetworkTabSettingsFavorite(displayOptionSettings.networkDisplayFav, true);
        //refresh the viewer if its not default favorite and if the map already has content
        //		var isRefreshViewer = !isDefaultFavorite && parent.hasRunQuery();
        var isRefreshViewer = parent.hasRunQuery();
        if (isRefreshDashboard != undefined && !isRefreshDashboard) {
            isRefreshViewer = false;
        }
        applyDisplaySettings(isRefreshViewer);
    }
}

/**
 * apply content settings to the map viewer settings...
 * @param contentSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
/*
	var mapExtent=new esri.geometry.Extent(contentSettings.mapExtent.xmin,contentSettings.mapExtent.ymin,contentSettings.mapExtent.xmax,contentSettings.mapExtent.ymax,contentSettings.mapExtent.spatialReference);
	esriMap.setMapExtent(mapExtent);
*/
} /******* common methods - favorites - end *******/

/**
 * initializing map display option setting(s)
 */

function initializeDisplayOptions() {
    //create the drawer
    parent.createOptionsPanelByDiv($("#mapOptions"), 'slide-right', true, true, '66px', '450px');
   	Slider.initializeFacilityPanel("faciSlider-arrow", "fPanel");
    //initialize schdleMntnceSlider
   	SkdMxHelper.getDrawer().initializeDrawerPanel();
    //create the tab strip for network, general & 
    //legends when in network view and schedule, general and legend in schedule view
    $("#displayOptionsTabstrip").kendoTabStrip({
        select: onViewerSettingsTabSelect
    });
    var tabstrip = $("#displayOptionsTabstrip").data("kendoTabStrip");
    //drop down that hold(s) all region types
    var rgnCombo = createComboBox('regionCmb', parent.getRegionTypes());
    //drop down that hold(s) all basemaps
    createComboBox('baseMapsCmb', parent.getMapTypes());
    //to select the default "US only"
    rgnCombo.data("kendoComboBox").select(6);
    createComboBox('zoomLevelId', parent.getZoomLevels(), undefined, undefined, 0);
    getKendoComboBox("zoomLevelId").wrapper.css({
        width: "45px"
    });

    //initializing common display option settings...
    initializeCommmonDisplayOptions();

    //initializing the map transparency slider and attaching the events for slide and change events
    var mapOptSlider = $("#transparencySlider").kendoSlider({
        showButtons: false,
        min: 0,
        max: 100,
        smallStep: 1,
        tickPlacement: 'none',
        largeStep: 1,
        value: 50,
        slide: setMapTransparency,
        change: setMapTransparency
    }).data("kendoSlider");

    //if the selected tab on query window is network then show only network, general and legend
    //else show only the schedule, network and legend... method @ViewerUtils.js
    showNetworkDisplayOptionsTab(parent.isNetworkQuery);
    tabstrip.select(tabstrip.tabGroup.children("li").eq(2));
    //flights combobox in Map drawer for schedule Mntnce
    //initializeKendoWinodw(true);
    //initalizeFlightRouteData(getDataSourceData("FlightRoutes"));
}

/**
 * Changes are made according the arcgis 3.7 API & Dojo api
 */
require(["esri/graphic", "esri/geometry/Geometry", "esri/geometry/Polyline", "esri/symbols/SimpleLineSymbol", "esri/toolbars/edit", "pegasus/portaljs/controls/esriEditToolManager.js", "pegasus/portaljs/controls/esriController.js", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer", "esri/geometry/Extent", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dojo/_base/connect", "dijit/registry", "pegasus/portaljs/esriMap.js", "pegasus/portaljs/esriZoomListener.js", "pegasus/portaljs/controls/esriGraphicManager.js", "pegasus/portaljs/controls/esriStageGraphicManager.js", "pegasus/portaljs/controls/esriVirtualGraphicManager.js",  "pegasus/portaljs/controls/routeManager.js", "pegasus/portaljs/widgets/contextMenu.js", "pegasus/portaljs/widgets/locationSelectionMenu.js", "dojo/_base/lang", "dojo/_base/event", "dojo/domReady!"], function(Graphic, Geometry, Polyline, SimpleLineSymbol, Edit, EditToolManager, ESRIController, Tiled, GraphicsLayer, Extent, Menu, MenuItem, MenuSeparator, on, connect, registry, ESRIMap, ESRIZoomManager, ESRIGraphicManager, StageGraphicManager, VirtualGraphicManager, RouteManager, ContextManager, LocationSelectionManager, lang, event, ready) {
    initializeBaseMaps();
    /**
     * initializing the base maps...
     */

    function initializeBaseMaps() {
        //initializing the print configuration
        //esri.config.defaults.io.proxyUrl = parent.SERVER_URL + "pegasus/portaljsp/proxy.jsp";
        //setting the timeout for print functionality
        esri.config.defaults.io.timeout = 300000;
        esri.setRequestPreCallback(esriPreRequestCallbackFunction);
        //add the base maps
        addBaseMaps(allMapLayers, Tiled, on);
    }

    /**
     * adding the base maps
     */

    function addBaseMaps(mapLayers) {
        if (mapLayers) {
            var _layer;
            dojo.forEach(mapLayers, function(layerDtls) {
                //get the ArcGIS Tiled Map Service Layer object
                _layer = getArcGISTiledMapServiceLayer(layerDtls, Tiled);
                //cache the layer 
                allBaseMaps.push(_layer);
                //once all the layers are loaded then invoke the invoke the map initializer  to initialize the map object
                on(_layer, "load", function(e) {
                    //trigger the method to initialize the maps..once all layers are loaded....
                    addLods(e, on, _layer);
                });
            });
        }
    }

    /**
     * returns ArcGIS Tiled Map Service Layer
     * @param params
     * @returns {esri.layers.ArcGISTiledMapServiceLayer}
     */

    function getArcGISTiledMapServiceLayer(params) {
        return new Tiled(params.tileServerUrl, {
            id: params.id,
            visible: params.visible,
            displayLevels: params.displayLevels,
            opacity: params.opacity
        });
    }

    /**
     * 
     * @param lyr  esri.layers.ArcGISTiledMapServiceLayer layer
     */

    function addLods(lyrEvent, _layer) {
        if (lyrEvent.layer != undefined) {
            //customLods = customLods.concat(lyrEvent.layer.tileInfo.lods);
            loadCount++;
            //once all the layers are loaded 
            if (loadCount == allMapLayers.length) {
                ESRIHelper.setController(ESRIController);
                //then initialize the map
                initializeMap();
                //set the map initialization flag as true
                isMapInitialized = true;
                //hide the progress window
                parent.showProgressDialog(false);
                //for getting the map extent...
                //dojo.connect(esriMap.map, "onExtentChange", showExtent);
            }
        }
    }

    /**
     * initialization of map...
     */

    function initializeMap() {
        //create the esriMap object..
        esriMap = new ESRIMap("map", {
            center: [-118.35, 34.45],
            zoom: 0,
            slider: true,
            sliderPosition: (isAdvancedQueryModule() ? "top-left" : "bottom-right"),
            sliderStyle: "large",
            lods: customLods,
            fadeOnZoom: true,
            force3DTransforms: true,
            autoResize: true,
            navigationMode: "css-transforms",
            resizeHandlerFn: esriMapResizeHandler,
            isAutoZoom: $('#autozoomChk').is(":checked"),
            wrapAround180:true
        }, "status");
        //mouse over handler
        esriMap.layerMouseOverFn = mapLayerMouseOverHandler;
        //mouse out handler
        esriMap.layerMouseOutFn = mapLayerMouseOutHandler;
        //print complete callback method
        esriMap.printCompleteFn = esriMapPrintComplete;
        //print error callback method
        esriMap.printErrorFn = esriMapPrintError;

        // adding the layers
        if (allBaseMaps) {
            dojo.forEach(allBaseMaps, function(baseMapLayer) {
                esriMap.map.addLayer(baseMapLayer);
            });
        }

        //map click handler
        on(esriMap.map, 'click', function(evt) {
            mapClickHandler(evt);
        });

        //map zoom listeners
        on(esriMap.map, 'zoom-end', function(e) {
            //dispatch the zoom listener event
           	triggerMapZoomListener(e);
        });

        $(window).scroll(function() {
            esriMap.map.resize();
            //esriMap.map.resposition();
        });

        //initialize the lasso component....
        initializeLassoComponents(esriMap.map);
        //initialize the context menu...
        initializeContextMenus();
        //if the favoriteComponent is initialized and the default favorite is not applied 
        if (favoriteComponent != null && !favoriteComponent.isFavoriteApplied) {
            //then apply the default favorite...
            log("Applying default favorite [map viewer ]");
            favoriteComponent.applyDefaultFavorite();
            //send the dashboard initialized status to dashboard controller
            parent.setDashboardInitialized(parent.DASHBOARD_ID_MAP_VIEW);
        }
        //send the dashboard initialized status to dashboard controller 
        if (typeof parent.isAdvanceQuery == "function" && !parent.isAdvanceQuery()) {
            parent.setDashboardInitialized(parent.DASHBOARD_ID_MAP_VIEW);
        }

        //initializePrinter();
        //based on the map..selection....change the background color...
        changeMapWinBackgroundColor(selectedBaseMap);

        loadFacilityLocationsLayer();
        //initialize the loading animator
        $(function() {
			$(".meter > span").each(function() {
				$(this)
					.data("origWidth", $(this).width())
					.width(0)
					.animate({
						width: $(this).data("origWidth")
					}, 1200);
			});
		});
    }

    function esriMapResizeHandler(mapEvent, esriMap) {
        esriMap.resize();
        esriMap.reposition();
        Slider.resizeFacilityHandler("faciSlider-arrow", "fPanel");
    }

    /**
     * @param ext map.extent
     */

    function showExtent(ext) {
        var extent = esri.geometry.webMercatorToGeographic(ext);
        var s = "";
        s = "XMin: " + extent.xmin + "&nbsp;" + "YMin: " + extent.ymin + "&nbsp;" + "XMax: " + extent.xmax + "&nbsp;" + "YMax: " + extent.ymax;
        console.log("Extent:" + s);
    }


    /**
     * initializing the context menu...
     */

    function initializeContextMenus() {
        //create context manager
        contextManager = new ContextManager(contextMenuClickListener);
        //create context manager
        locationSelectionManager = new LocationSelectionManager(locationSelectionMenuClickListener);
    }
    
    function locationSelectionMenuClickListener(e) {
        SkdMxHelper.getDrawer().invokeOperatoin(e);
    }
    
    function contextMenuClickListener(e) {
        //parent.showProgressDialog(true, "Please wait...");
        if (e.menuItem.type == undefined) {
            e.menuItem["type"] = e.menuItem.label;
        }
        if (typeof Slider == "function" && e.menuItem.type != "Mode Analysis") {
            //Slider.showVerticalPanel("vSlider-arrow", Slider.getVerticalDivId());
        }
        switch (e.menuItem.type) {
        case "from":
        case "From":
            fromSelectionListener(getLocationNames(e.menuItem["locations"]));
            break;
        case "to":
        case "To":
            toSelectionListener(getLocationNames(e.menuItem["locations"]));
            break;
        case "through":
        case "Through":
            throughSelectionListener(getLocationNames(e.menuItem["locations"]));
            break;
        case "Mode Analysis":
            //open the mode analysis dashboard...
            parent.openDashboard(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS);
            //if the dashboard is having the showMapLocations method..then invoke it...
            if (parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS) && parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS).hasOwnProperty("showMapLocations")) {
                parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS).showMapLocations(true);
            }
            break;
        case "origin":
        case "Origin":
            originSelectionListener(getLocationNames(e.menuItem["locations"]));
            break;
        case "destination":
        case "Destination":
            destinationSelectionListener(getLocationNames(e.menuItem["locations"]));
            break;
        case "lassoFrom":
            fromSelectionListener(getLassoedLocationNames(e.menuItem["graphic"]));
            break;
        case "lassoTo":
            toSelectionListener(getLassoedLocationNames(e.menuItem["graphic"]));
            break;
        case "lassoThrough":
            throughSelectionListener(getLassoedLocationNames(e.menuItem["graphic"]));
            break;
        case "lassoDestination":
            destinationSelectionListener(getLassoedLocationNames(e.menuItem["graphic"]));
            break;
        case "lassoOrigin":
            originSelectionListener(getLassoedLocationNames(e.menuItem["graphic"]));
            break;
        case "Un-Delete Route":
            UnDeleteRouteManager.undeleteRouteHandler(e, e.menuItem["locations"][0]);
            break;
        }
        //parent.showProgressDialog(false);
    }

    function fromSelectionListener(data) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).buildDatasets("#preActivitiesGrid", data);
    }

    function toSelectionListener(data) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).buildDatasets("#nxtActivitiesGrid", data);
    }

    function throughSelectionListener(data) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).buildDatasets("#priActivitiesGrid", data);
    }

    function originSelectionListener(data) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).buildDatasets("orignDestWinOrigin", data);
    }

    function destinationSelectionListener(data) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).buildDatasets("orignDestWinDest", data);
    }

    function getLocationNames(data) {
        var locationNames;
        if (data != undefined) {
            locationNames = [];
            for (var i = 0; i < data.length; i++) {
                if (parent.isNetworkQuery && data[i].locCd.length <= 3) {
                    continue;
                }
                locationNames.push(data[i].locCd);
            }
        }
        return locationNames;
    }

    /**
     * initialize the lasso functionality for the map...
     * @param map
     */

    function initializeLassoComponents(map) {
        //created the graphics layers for lassoed graphics
        lassoGraphicLayer = new GraphicsLayer();
        lassoGraphicLayer.id = window[viewerDashboardId].LAYER_ID_LASSO;
        //adding the layer to esri map
        esriMap.addMapLayer(lassoGraphicLayer);
        //initialize the lasso component....
        lasso = new LassoComponent("mapAreaDiv", esriMap, lassoGraphicLayer, lassoListenerFn, lassoEndHandler);
        //creating the menu....
        lasso.createMenu();
    }
});

function getLassoedLocationNames(graphic) {
    var locations = [];
    var lassoResults = esriMap.findGraphicsWithinLayer(mapViewDiv.LAYER_ID_LASSO, "6_allFacilities", true, false, "point");
    if (lassoResults) {
        var count = lassoResults.length;
        var allLocationTypes;
        for (var i = 0; i < count; i++) {
            if (lassoResults[i] != undefined && lassoResults[i].visible && lassoResults[i].data != undefined && lassoResults[i].data.attributes != undefined) {
                allLocationTypes = lassoResults[i].data.attributes["AllLocations"];
                if (allLocationTypes != undefined) {
                    for (var j = 0; j < allLocationTypes.length; j++) {
                        if (parent.isNetworkQuery && allLocationTypes[j].locCd.length <= 3) {
                            continue;
                        }
                        locations.push(allLocationTypes[j].locCd);
                    }
                }
            }
        }
    }
    return locations;
    delete lassoResults;
    delete locations;
}

function getPolylineGraphics(layerId) {
    var mapLayer = esriMap.getMapLayer(layerId);
    if (mapLayer != undefined) {
        return mapLayer.graphics;
    }
}


function setPlacemarkHighlight(isHighlight, locationName) {
    var locationGraphics = getLocationGraphic(isHighlight, locationName);
    if (locationGraphics != undefined && locationGraphics.length > 0) {
        contextManager.highlightGraphics(isHighlight, locationGraphics);
    }
}

function setVisibleAndHighlight(isHighlight, locationName) {
    var locationGraphics = getLocationGraphic(isHighlight, locationName);
    if (locationGraphics != undefined && locationGraphics.length > 0) {
        ESRIHelper.getEsriGraphicManager().setGraphicsVisibility(locationGraphics, isHighlight);
        contextManager.highlightGraphics(isHighlight, locationGraphics, locationName);
    }
}

function getLocationGraphic(isHighlight, locationName) {
    var mapLayers = [];
    var result = [];
    var mapLayer = esriMap.map.getLayer("6_allFacilities");
    if (mapLayer) {
        mapLayers.push(mapLayer);

        var targetLayerGraphics;
        var noOfMapLayers = mapLayers.length;
        for (var k = 0; k < noOfMapLayers; k++) {
            if (mapLayers[k] == undefined) {
                continue;
            }
            targetLayerGraphics = mapLayers[k].graphics;
            if (targetLayerGraphics == undefined) {
                continue;
            }
            if (targetLayerGraphics) {
                var targetLayerGraphicsCount = targetLayerGraphics.length;
                var allLocationTypes;
                for (var i = 0; i < targetLayerGraphicsCount; i++) {
                    if (targetLayerGraphics[i] != undefined && targetLayerGraphics[i].data != undefined && targetLayerGraphics[i].data.attributes != undefined) {
                        allLocationTypes = targetLayerGraphics[i].data.attributes["AllLocations"];
                        if (allLocationTypes != undefined && allLocationTypes.length > 0) {
                            for (var j = 0; j < allLocationTypes.length; j++) {
                                if (allLocationTypes[j].locCd == locationName) result.push(targetLayerGraphics[i]);
                            }
                        }
                    }
                }
                delete allLocationTypes;
            }
        }
        return result;
        delete targetLayerGraphics;
        delete mapLayers;
        delete result;
    }
}


/**
 * returns whether the map is initialized or not...
 * @returns {Boolean}
 */

function hasMapInitialized() {
    return isMapInitialized;
}

/**
 * Event fired when we click on a graphic....
 * @param evt
 */

function showActivityPopup(evt) {
	if(isScheduleMaintainance() && SkdMxHelper.getMapOpeationManager().isActiveMode()){
		SkdMxHelper.getDrawer().invokeOperatoin(evt);		
	}else {
		showNetworkActivityPopup(evt.graphic.data);
	    showFacilityEncyclopediaDrawer(evt);
	}    
}
/**
 * Event fired when we click on a graphic....
 * @param evt
 */

function showFacilityEncyclopedia(evt) {
    showFacilityEncyclopediaDrawer(evt.graphic.data);
}
/**
 * on mouse over, binding the mode analysis menu
 * @param evt
 */

function bindModeAnalysisMenu(evt) {
    //get the data object from the selected graphic
    var dataObject = evt.graphic.data;
    //check whether the location is having any activities
    if (isShowModeAnalysisMenu(dataObject)) {
        //add the menu item and create the context menu
        contextManager.buildMenu({
            menuNodes: ["Mode Analysis"]
        });
        //bind the context menu to the graphic...
        contextManager.bindDomNode(evt.graphic.tooltip, evt.graphic.getDojoShape().getNode());
    }
}


/**
 * unbind the context menu on mouse out...
 * @param evt
 */

function unBindModeAnalysisMenu(evt) {
    var dataObject = evt.graphic.data;
    //check whether the graphic is a valid one for mode analysis... 
    if (isShowModeAnalysisMenu(dataObject)) { // if so then unbind the context menu...
        contextManager.unBindDomNode(evt.graphic.getDojoShape().getNode());
    }
}

/**
 * lasso draw end event handler
 * @param eventType
 */

function lassoListenerFn(eventType, event) {
    showBusyCursor(true);
    setTimeout(function() {
        var lassoResults;
        //when the synchronization is active for matric or schematic viewer then
        if (isSyncMatrix || isSyncViewer) {
            var ids = [];
            //if the eventType is clear 
            if (eventType != "onClear") {
                //then find the polyline graphics that are available in all the layers.
                lassoResults = esriMap.findGraphicsWithinLayer(window[viewerDashboardId].LAYER_ID_LASSO, getLayerId(), true, false, "polyline");
                if (lassoResults) {
                    var count = lassoResults.length;
                    for (var i = 0; i < count; i++) {
                        //get the lane / leg id's
                        getIds(lassoResults[i].data, ids);
                    }
                }
            }
            lassoIds[getLayerId()] = ids;
            //synchronize the dashbaords for those id's
            syncDashboards(ids);
        }

        //if market view is enabled 
        if (isMarketViewEnabled()) {
            //then find graphics that are available in lasso layer
            lassoResults = esriMap.findGraphicsWithinLayer(window[viewerDashboardId].LAYER_ID_LASSO, getLayerId(), true, false, "polyline");
            //render the popup for those lassoed selections...
            lassoMarketViewSelectionHandler(lassoResults);
        }


        if (event != undefined && event.target != undefined && event.target.nodeName == "path") {
            contextManager.buildMenu({
                locations: ["lasso"],
                graphic: event.target.e_graphic
            }, esriMap.findGraphicsWithinLayer(mapViewDiv.LAYER_ID_LASSO, "6_allFacilities", true, false, "point"));
            contextManager.bindDomNode(new Date().getTime(), event.target);
        }


        hideBusyCursor(true);
    }, 100);
}

/**
 * validate the selections for market view and render the popup's
 */

function lassoMarketViewSelectionHandler(lassoResults) {
    //if the lassoed results are more than zero 
    if (lassoResults && lassoResults.length > 0) {
        //and less than 25 the 
        if (lassoResults.length <= 25) {
            //initialize the marketview and 
            if (!marketviewPopUp) {
                marketviewPopUp = new MarketViewPopUp();
            }
            //get the market view display settings
            var marketViewDisplaySettingsMap = getMarketViewDisplaySettingsMap();
            marketViewDisplaySettingsMap["top"] = 100;
            marketViewDisplaySettingsMap["left"] = 150;
            //re-initialize / initialize the propertues in market view...
            marketviewPopUp.initialize(isMarketViewExpandedOption(), marketViewDisplaySettingsMap);
            var path;
            var screenPoint;
            for (var v = 0; v < lassoResults.length; v++) {
                path = lassoResults[v].geometry.type != "point" ? lassoResults[v].geometry.paths[0][1] : null;
                if (path) {
                    //render the results for that partucular graphic...
                    screenPoint = esri.geometry.toScreenPoint(esriMap.map.extent, esriMap.map.width, esriMap.map.height, lassoResults[v].geometry.getExtent().getCenter());
                    //get the top position of the screen viewport
                    var top = getTop(screenPoint.y);
                    //get the left position of the screen viewport
                    var left = getLeft(screenPoint.x);
                    //show popup for the lassoResults[v] at the position(top, left) ie., (x,y)
                    marketviewPopUp.openPopup(lassoResults[v], top, left);
                }
            }
        } else {
            showErrorMsg("Selection limit exceeded", "Your selection includes too many lines(" + lassoResults.length + ").<br> Please make a new selection of up to 20 lines.");
        }
    }
    //once the popup are rendered on the map then clear the lassoed selections...
    if (lasso) {
        lasso.clearSelections();
    }
}

/**
 * returns the top w.r.t map view port 
 * @param top
 * @returns
 */

function getTop(top) {
    while (top > esriMap.map.height) {
        top = top - esriMap.map.height;
    }

    while (top < 0) {
        top = top + esriMap.map.height;
    }

    return top;
}

/**
 * returns the left w.r.t map view port...
 * @param left
 * @returns
 */

function getLeft(left) {
    while (left > esriMap.map.width) {
        left = left - esriMap.map.width;
    }

    while (left < 0) {
        left = left + esriMap.map.width;
    }
    return left;
}




//initializing the Print for esri maps...

function createPrintDijit() {
    initializePrinter(true);
}

/**
 * create Print Object and execute
 */

function initializePrinter(isPrintMap) {
    //set the print flag for esri 		
    esriMap.isPrintting = isPrintMap;
    esriMap.hideNonPrintableLayers(getLayerId(), !isPrintMap);
    //if its a map view and print is running then 
    if (typeof esriMap != "undefined" && esriMap.isPrintting === true) {
        //trigger the print service....
        parent.showProgressDialog(true, "Printing...");
        esriMap.executePrint(parent.PEGASUS_PRINT_SERVICE_URL);
    }
}




/**
 * validate whether the mode analysis menu need to be shown or not...
 * @param locationData - graphic data
 * @returns {Boolean}
 */

function isShowModeAnalysisMenu(locationData) {
    // valid activities for that selected location w.r.t mode analysis
    modeAnalysisActivities = [];
    modeAnalysisLocation = '';
    if (locationData.attributes != undefined) {
        //get the actual location code...
        modeAnalysisLocation = locationData.attributes.locCdActual;
        //get the activities for that location...
        var locActivities = locationData.attributes.activities;
        if (locActivities != undefined) {
            var firstChar;
            for (var i = 0; i < locActivities.length; i++) {
                firstChar = locActivities[i].charAt(0);
                if (firstChar != 'P' && firstChar != 'A') {
                    modeAnalysisActivities.push(locActivities[i]);
                }
            }

            return locActivities.length > 0;
        }
    }
    return false;
}

/**
 * polyline click handler....
 */

function polylineClickHandler() {
    //open the dashboard from pagasusViewer.js
    parent.dashboardController.openDashboard(parent.DASHBOARD_ID_MODE_ANALYSIS);
}

/**
 * show the corresponding layers based on the view
 */

function showLayers() {
    //hide the mode analysis layer
    esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_MODE_ANALYSIS, false);
    if (parent.isNetworkQuery) {
        //hide the schedule layer when the user is in network view...
        esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, false);
        //if the user is in network - schedule overlay mode
        if (isScheduleForNetworkFlag) {
            //hide the network lanes layers 
            esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, false);
            //show the schedule legs details layers
            esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, true);
        } else {
            //show the network lanes layer
            esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, true);
            //hide the network - schedule overlay layers...
            esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, false);
        }
    } else {
        //if the user is in schedule mode...
        //show the schedule legs layer
        esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, true);
        //hdie the network lanes and netwrok schedule legs layer
        esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, false);
        esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, false);
    }
}

/**
 * hide all layers
 */

function hideAllLayers() {
    esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, false);
    esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, false);
    esriMap.showMapLayer(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, false);
}

/**
 * load ecosystem
 * @param response
 * @param io
 */


mapViewDiv.addLayer = function(response, io) {
    LoggerUtils.trace("FROM BROWSER: Starting -> Rendering the map with the response");
    try {
        if (response && response._errorCd && response._errorCd > 0) {
            //if there is an error in response then show the header error message 
            parent.showFilterErrorMsg(response._errorDesc);
        } else {
            //remove the layer (if its already added....)
            esriMap.removeMapLayer(response.id);
            //adding / loading the ecosystem layer 
            esriMap.addEcosystemLayer(response);
            if (response.id != window[viewerDashboardId].LAYER_ID_MODE_ANALYSIS) {
                //show the layers
                showLayers();
            }


            if (response.id == window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS || response.id == window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) {
                //update the market view...
                updateMarketViewWindows();
            }
        }
    } catch (e) {
        console.log("Error = [" + e.message + "] occurred while adding the data to map");
    }
    //resetting / updating the graphics w.r.t the zoom level specifications...
    initializeMapZoomListener(response.id);

    showProgressDialog(false);
    LoggerUtils.trace("FROM BROWSER: Completed -> Rendering the map with the response");
};

function initializeMapZoomListener(layerId) {
    if (ESRIHelper.getEsriZoomManager() != undefined) {
        ///create an object with the level of detail 
        var zoomEventObj = {
            "level": getMapZoomLevel()
        };
        ESRIHelper.getEsriZoomManager().constructLayerDetails(layerId);
        triggerMapZoomListener(zoomEventObj);
        //ready for garbage collection.... 
        delete zoomEventObj;
    }
}

/**
 * method that dispatches the zoom event object and renders the graphics as per the design specifications	 * 
 * @param zoomEventObj {MapEvent}
 */

function triggerMapZoomListener(zoomEventObj) {
    if (ESRIHelper.getEsriZoomManager() != undefined) {
        //get all the current visible layers
        //var currentVisibleLayerIds = esriMap.getActiveLayerIds([window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS]);
        var currentVisibleLayerIds = esriMap.getActiveLayerIds();
        if (currentVisibleLayerIds != undefined) {
            for (var i = (currentVisibleLayerIds.length - 1); i >= 0; i--) {
                //trigger the map zoom listener
                ESRIHelper.getEsriZoomManager().mapZoomListener(zoomEventObj, currentVisibleLayerIds[i]);
            }

        }
    }
}

/**
 * map click handler...
 * @param evt
 */
function mapClickHandler(evt) {
    var graphic = evt.graphic;
    //if the selection is not valid then return...
    if (!graphic || !graphic.data || !graphic.data.attributes || !graphic.data.attributes.Origin) {
        //if(lastSelectedLineIds[getLayerId()] && lastSelectedLineIds[getLayerId()].length > 0) {
        //syncDashboards([]);
        //}
        SkdMxHelper.getDrawer().isActiveValidateNow(isScheduleMaintainance());
        return;
    }
    //get the layer id...
    var layerId = getLayerId();
    //if the geometry is a point then get the line graphic else it is a line graphic ...
    if (graphic.geometry.type == "point") {
        graphic = esriMap.getLineGraphic(layerId, graphic);
    }

    if (graphic) {
        showBusyCursor(true);
        //if the synchronize matrix or Schematic view are true  
        if (isSyncMatrix || isSyncViewer) {
            //then synchronize the dashboards...
            syncDashboards(getIds(graphic.data));
        }
        //get the origin and destination graphics for a line graphic...
        var originGraphic = esriMap.getStartPointGraphic(layerId, graphic);
        var destinationGraphic = esriMap.getEndPointGraphic(layerId, graphic);

        if (originGraphic && destinationGraphic) {
            //get the map of global styles for the layer
            var globalStylesMap = esriMap.getLayerGlobalStylesMap(layerId);
            //if the user is in the schedule mode and market view is not enabled...
            if ((!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)) && !isMarketViewEnabled()) {
                if (SkdMxHelper.getMapOpeationManager().isSelectRoute() && ESRIHelper.getEsriGraphicManager().isLegGraphic(graphic)) {
                    selectRouteHandler(graphic, evt, true);
                } else {
                    //then show the leg detail pop up
                    lastSelectedLineId = showLegDetailPopup(graphic.data, originGraphic.data, destinationGraphic.data, globalStylesMap, "getMapObjectStyleById", false, "getMapObjectStyleByName");
                }
            } else if ((!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)) && isMarketViewEnabled()) { //if the user is in the schedule mode and market view is enabled...
                //then initialize the market view & show the popup's
                if (!marketviewPopUp) {
                    marketviewPopUp = new MarketViewPopUp();
                }
                //get the settings of the marketview from the schedule display options
                var marketViewDisplaySettingsMap = getMarketViewDisplaySettingsMap();
                marketViewDisplaySettingsMap["top"] = evt.screenPoint.y;
                marketViewDisplaySettingsMap["left"] = evt.screenPoint.x;
                marketviewPopUp.initialize(isMarketViewExpandedOption(), marketViewDisplaySettingsMap);
                marketviewPopUp.showPopup(graphic);
            } else { //if user is in network view then show the lane detail popup...
                lastSelectedLineId = showLaneDetailPopup(graphic.data, originGraphic.data, destinationGraphic.data, globalStylesMap, "getMapObjectStyleById", false, "getMapObjectStyleByName");
            }
        } else {
            parent.showErrorMsg("Error [Origin or Destination data not found] occured while showing the popup ");
        }
    } else {
        parent.showErrorMsg("Error [Line data not found] occured while showing the popup ");
    }
    hideBusyCursor(true);
}

/**
 * update the market view settings when the user the clicked on apply button in display option settings...
 */

function updateMarketViewWindows() {
    if ((!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)) && isMarketViewEnabled()) {
        if (marketviewPopUp) {
            //get the market view display option settings 
            var marketViewDisplaySettingsMap = getMarketViewDisplaySettingsMap();
            marketViewDisplaySettingsMap["top"] = null;
            marketViewDisplaySettingsMap["left"] = null;
            marketviewPopUp.initialize(isMarketViewExpandedOption(), marketViewDisplaySettingsMap);
            //update the market view windows....
            marketviewPopUp.updateMarketViewWindows();
        }
    }
}

function marketViewChangeHandler(targetObject) {
    if (marketviewPopUp) {
        showBusyCursor(true);
        updateMarketViewWindows();
        hideBusyCursor(true);
    }
}

/**
 * method deprecated....
 * @returns {Boolean}
 */

function isMarketViewExpandedOption() {
    return false;
}

/**
 * returns all the market view settings from the schedule display settings...
 * @returns {map of marketview settings}
 */

function getMarketViewDisplaySettingsMap() {
    var marketViewDisplaySettingsMap = {};
    if (isAdvancedQueryModule()) {
        marketViewDisplaySettingsMap["loadIndicator"] = $("input:radio[name ='loadindicatorsgrp']:checked")[0].id;
        marketViewDisplaySettingsMap["loadIndicatorMin"] = getCautionLow(); //$("#txtCautionLow")[0].value;
        marketViewDisplaySettingsMap["loadIndicatorMax"] = getCautionHigh();
        marketViewDisplaySettingsMap["loadIndicatorUnder"] = getCautionUnder();
        marketViewDisplaySettingsMap["loadIndicatorNormal"] = getCautionNormal();//$("#txtCautionHigh ")[0].value;        
    } else {
        marketViewDisplaySettingsMap["loadIndicator"] = $("input:radio[name ='scheduleFilterUtilization']:checked")[0].id;
        marketViewDisplaySettingsMap["loadIndicatorMin"] = getCautionLow();
        marketViewDisplaySettingsMap["loadIndicatorMax"] = getCautionHigh();
        marketViewDisplaySettingsMap["loadIndicatorUnder"] = getCautionUnder();
        marketViewDisplaySettingsMap["loadIndicatorNormal"] = getCautionNormal();
    }
    marketViewDisplaySettingsMap["marketViewWChk"] = $("#marketViewWChk").is(":checked");
    marketViewDisplaySettingsMap["marketViewWPercentChk"] = $("#marketViewWPercentChk").is(":checked");
    marketViewDisplaySettingsMap["marketViewCuChk"] = $("#marketViewCuChk").is(":checked");
    marketViewDisplaySettingsMap["marketViewCuPercentChk"] = $("#marketViewCuPercentChk").is(":checked");
    marketViewDisplaySettingsMap["routesLabelChk"] = $("#routesLabelChk").is(":checked");
    marketViewDisplaySettingsMap["marketViewVolChk"] = $("#marketViewVolChk").is(":checked");
    marketViewDisplaySettingsMap["iataEquipDescLabelChk"] = $("#iataEquipDescLabelChk").is(":checked");
    marketViewDisplaySettingsMap["departureTimeLabelChk"] = $("#departureTimeLabelChk").is(":checked");
    marketViewDisplaySettingsMap["equipCodeLabelChk"] = $("#equipCodeLabelChk").is(":checked");
    marketViewDisplaySettingsMap["effDaysLabelChk"] = $("#effDaysLabelChk").is(":checked");
    marketViewDisplaySettingsMap["arrivalTimeLabelChk"] = $("#arrivalTimeLabelChk").is(":checked");
    marketViewDisplaySettingsMap["marketOrgDestChk"] = $("#marketOrgDestChk").is(":checked");


    return marketViewDisplaySettingsMap;
}

/**
 * retrieve the map object style 
 * @param name - style name (key)
 * @returns {Object}
 */

function getMapObjectStyleByName(name) {
    //get the style object for the layerId....by name
    return esriMap.getLayerObjectStyleByObjectName(getLayerId(), name);
}

/**
 * retrieve the map style by styleId
 * @param styleId
 * @returns
 */

function getMapObjectStyleById(styleId) {
    return esriMap.getLayerObjectStyleByStyleId(getLayerId(), styleId);
}

/**
 * show/load the mode analysis tool for the sort location
 * @param sortLocation	sort location Name
 * @param locationDetails	location details
 */

function loadModeAnalysisLayer(sortLocation, locationDetails) {
    hideAllLayers();

    var params = {};
    params.ecoexpmodel = window[viewerDashboardId].ECOEXPML_MODE_ANALYSIS;
    params.renderdata = "true";
    params.rendertype = "json";
    params.layerid = window[viewerDashboardId].LAYER_ID_MODE_ANALYSIS;
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();    
    params.scheduleId = parent.getScheduleId();
    params.browserSessionId = parent.getBrowserSessionId();
    params.isDontFireEcosystemEvents = true;
    params.sortLocation = sortLocation;
    params.locationDetails = JSON.stringify(locationDetails);
    //set the general tab settings whenever the planner sync the mode analysis view with map
    setGeneralTabParameters(params);
    callService({
        url: LAYER_REQUEST_URL,
        paramsMap: params,
        successCallback: addModeAnalysisLayer,
        showProgressWindow: true
    });
}

/**
 * callback event handler for mode analysis 
 * @param response
 * @param io
 */

function addModeAnalysisLayer(response, io) {
    //add mode analysis layer...
    mapViewDiv.addLayer(response, io);
}

function syncSchematicViewer() {
    var schematicViewerDashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_SCHEMATIC_VIEW);
    if (schematicViewerDashboard != undefined) {
        schematicViewerDashboard.syncSchematicViewerSettingsWithMap(getViewerHeaderButtonSettings(false), getDisplayOptionSettings(), isSyncViewer);
        schematicViewerDashboard.refreshDashboard();
    }
    //do not refresh the dashboard as its already being refreshed
    parent.openDashboard(parent.DASHBOARD_ID_SCHEMATIC_VIEW, false);
}

/**
 * market view collapse handler...
 */

function collapseHandler() {
    showBusyCursor(true);
    setTimeout(function() {
        if (marketviewPopUp) {
            marketviewPopUp.collapseAll();
        }
        hideBusyCursor(true);
    }, 100);
}

/**
 * market view volume chnage handler...
 * @param divId	- grid id
 * @param legId	- led id
 * @param volumeDay	- volume day
 */

function marketviewVolumeChangeHandler(divId, legId, volumeDay) {
    if (marketviewPopUp) {
        marketviewPopUp.marketviewVolumeChangeHandler(divId, legId, volumeDay);
    }
}
/*
	function showHighlightGraphic(evt){
		var graphic = evt.graphic;	
		highlightGraphic = new esri.Graphic(graphic.geometry, highlightSymbol);
		esriMap.addGraphic(highlightGraphic);
	}

	function closeHighlightGraphic(evt){
		if(highlightGraphic){
			esriMap.removeGraphic(highlightGraphic);		
		}
	}
	*/

/**
 * enable/disable the market view button....
 */

function resetMarketView(enableSync) {
    if (!(enableSync != null && enableSync == true)) {
        if (!parent.isNetworkQuery || (parent.isNetworkQuery && parent.getDashboardContentWindow(viewerDashboardId).isScheduleForNetworkFlag)) {
            parent.highlightBtn(parent.$('#marketView')[0], true);
        } else {
            parent.highlightBtn(parent.$('#marketView')[0], false);
        }
    }
    parent.VIEWER.enableMarketView(parent.$('#marketView')[0], parent.DASHBOARD_ID_MAP_VIEW, enableSync);
}

/**
 * reset / clear favorite controller...
 */

function resetViewerContents() {
    var TRUE_CHKBOXES_ARR;
    var FALSE_CHKBOXES_ARR;
    var TRUE_RADIO_ARR;
    var COMBO_ARR;
    if (parent.isNetworkQuery && !isScheduleForNetworkFlag) {
        TRUE_CHKBOXES_ARR = ['flyChk', 'truckChk', 'otherChk', 'flySuggestedChk', 'truckSuggestedChk', 'otherSuggestedChk', 'flyMandatoryChk', 'truckMandatoryChk', 'otherMandatoryChk', 'popupDisplayOptionWeightChk', 'popupDisplayOptionCubeChk', 'popupDisplayOptionPiecesChk', 'popupDisplayOptionOdpdChk', 'nolblradio', 'shwPictureMarkerSymbolsId',  "isNoneLocations"];
        FALSE_CHKBOXES_ARR = ['rampsChk', 'hubsChk', 'dockChk', 'airportFeeder', 'airportTrunk', 'airportLineHaul', 'showerrorsChk', "meetPoitns", "stations", 'differentmodeChk','shwNumberSymbolsId','autozoomChk','isDefaultConfig'];
        TRUE_RADIO_ARR = ['displayUsedOnlyRadio', 'ltrIdradio', 'sortActivityType'];
        COMBO_ARR = ['connErrorCombo', 'baseMapsCmb', 'regionCmb'];
    } else {
        TRUE_CHKBOXES_ARR = ['schematicMatrixweightChk', 'schematicMatrixpiecesChk', 'schematiMatrixccubeChk', 'marketOrgDestChk', 'marketViewCuPercentChk', 'marketViewWPercentChk', 'nolblradio', 'marketViewVolChk', 'shwPictureMarkerSymbolsId', 'routesLabelChk', 'iataEquipDescLabelChk', 'effDaysLabelChk', "isNoneLocations"];
        FALSE_CHKBOXES_ARR = ['rampsChk', 'hubsChk', 'dockChk', 'airportFeeder', 'airportTrunk', 'airportLineHaul', "meetPoitns", "stations", 'weightChk', 'marketViewCuChk', 'cubeChk', 'netlegtypeFlyChk', 'marketViewWChk', 'netlegtypeTruckChk', 'schematiclegtypeRailChk', 'schematiclegtypeShipChk', 'shwNumberSymbolsId', 'equipCodeLabelChk', 'autozoomChk','departureTimeLabelChk', 'arrivalTimeLabelChk', 'isDefaultConfig'];
        TRUE_RADIO_ARR = ['displayUsedOnlyRadio', 'highstradio', 'ltrIdradio'];
        COMBO_ARR = ['baseMapsCmb', 'regionCmb', 'railCombo', 'shipCombo'];
    }

    parent.resetFilterComponent();
    parent.updatekendoCombo(COMBO_ARR, "kendoComboBox", parent.getDashboardContentWindow(viewerDashboardId));
    parent.updateControl(TRUE_CHKBOXES_ARR, true, parent.getDashboardContentWindow(viewerDashboardId));
    parent.updateControl(FALSE_CHKBOXES_ARR, false, parent.getDashboardContentWindow(viewerDashboardId));
    parent.updateControl(TRUE_RADIO_ARR, true, parent.getDashboardContentWindow(viewerDashboardId));

    if (isAdvancedQueryModule()) {
        if (parent.isNetworkQuery && !isScheduleForNetworkFlag) {
            parent.validateComboBoxOnCheckboxByDiv($('#showerrorsChk')[0], $('#connErrorCombo'));
            disableShowModes($('#differentmodeChk')[0]);
        } else {
            $('#txtUnder').val(0);
            $('#txtNormal').val(10);
            $('#txtCaution').val(80);
            $('#txtExcess').val(100);
            parent.updatekendoMultiSelect(['networkFlyCombo', 'networkTruckCombo'], 'kendoMultiSelectBox', parent.getDashboardContentWindow(viewerDashboardId));
            $('#networkFlyCombo').data('kendoMultiSelectBox').selectedValues = EMPTY_STRING;
            $('#networkTruckCombo').data('kendoMultiSelectBox').selectedValues = EMPTY_STRING;
        }
    }

    $("#regionCmb").data('kendoComboBox').select(6);
    $('#transparencySlider').data("kendoSlider").value(50);
    changeBaseMap($('#baseMapsCmb')[0]);
    changeMapExtent($('#regionCmb').data('kendoComboBox').value());
    //getKendoComboBox("zoomLevelId").value(5);
    //enable or disable the combo box... 
    lineLabelRadioClickHandler();
}

/**
 * event handler for move over an graphic for showing the tooltip
 * @param evt
 */

function mapLayerMouseOverHandler(evt) {
    LoggerUtils.console("mapLayerMouseOverHandler");
    var graphic = evt.graphic;
    if (!graphic || !graphic.data || !graphic.data.name) {
        return;
    }
    //get the data from the graphic...
    var dataObj = graphic.data;
    var attributes = dataObj.attributes;
    var tooltip=evt.graphic.toolTip;
	if(tooltip == undefined)
	{
		tooltip=attributes.ToolTip;
	}
    var dialogContent = "<table><tr><td colspan='2' align='center'><b><font size='2'>" + tooltip + "</font></b></td></tr>";
    var changeMouseCursor = false;

    lastHoveredGraphicSymbol = null;
    //if its a polyline then get the line symbol and update the width of the highlight line...then add the graphic...
    if (graphic.geometry.type == "polyline") {
        if (!( SkdMxHelper.getMapOpeationManager().isActiveMode() || SkdMxHelper.getMapOpeationManager().isSelectMode() )) {
            lastHoveredGraphicSymbol = graphic.symbol;
            lastHoveredGraphicSymbol.width = 3;
            graphic.setSymbol(lastHoveredGraphicSymbol);
        }
    }

    //update the tooltip to show no connectivity, caution, inbound or outbound...
    if (attributes != undefined && attributes.Origin != undefined) {
        changeMouseCursor = true;
        var layerId = getLayerId();
        if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
            var directionLabel;
            if (attributes.HasNoConnectivity) {
                directionLabel = "No Connectivity";
            } else {
                if (attributes.Direction == "I") {
                    directionLabel = "Inbound";
                } else if (attributes.Direction == "O") {
                    directionLabel = "Outbound";
                } else {
                    directionLabel = "Bi-directional";
                }
            }

            dialogContent += "<tr><td align='center'><font color='#999999' size='1'>" + directionLabel + "</font></td></tr>";
        } else {
            var volumeValue;
            var type = getVolumePercentageType();
            if (type == "weight") {
                volumeValue = attributes.WeightPercentage;
            } else if (type == "cube") {
                volumeValue = attributes.CubePercentage;
            } else {
                volumeValue = attributes.WeightPercentage < attributes.CubePercentage ? attributes.CubePercentage : attributes.WeightPercentage;
            }
            dialogContent += "<tr><td align='center'><font color='#999999' size='1'>" + getCautionType(volumeValue) + "</font></td></tr>";
        }
    }
    dialogContent += "</table>";
    onLayerMouseOver(evt, dialogContent, changeMouseCursor);
    bindLocationFocusHandler(evt);
};


function selectRouteHandler(laneOrLegGraphic, evt, isMouseClick) {
    if(SkdMxHelper.getMapOpeationManager().isByLegQuery()){
       parent.showErrorMsg("Route Maintenance is not available for 'By Leg' Queries");
        setTimeout(function(){
            parent.closeHeaderMsgWin();
        }, 5000);
       return;
    }
    if (isMouseClick && laneOrLegGraphic != undefined && ESRIHelper.getEsriGraphicManager().totalLegs(laneOrLegGraphic) > 1 ) {
        popupManager.showPopup(evt, laneOrLegGraphic, "routeSettingsDiv", renderRouteWizardHandler, closeRouteWizardHandler);
    } else if (laneOrLegGraphic != undefined && ESRIHelper.getEsriGraphicManager().totalLegs(laneOrLegGraphic) == 1) {
        closeRouteHandler();
        SkdMxHelper.getDrawer().paintSkdMxDrawerWizard(laneOrLegGraphic);
    }
}

function renderRouteWizardHandler(legGraphic, popupWindow, includeDeletedRoutes) {
    if (ESRIHelper.getRouteManager() != undefined) {
        ESRIHelper.getRouteManager().paintRouteWizard(legGraphic, includeDeletedRoutes);
    }
    openRouteWizardHandler(undefined, popupWindow);
    
}

function removeRouteHighlight(laneOrLegGraphic) {
    if (laneOrLegGraphic != undefined && ESRIHelper.getEsriGraphicManager().totalLegs(laneOrLegGraphic) == 1) {
        ESRIHelper.getEsriGraphicManager().resetRouteSelection();
        ESRIHelper.getEditToolManager().deActivate();
    }
}

/**
 * 
 * @param evt - map mouse over event
 * @param dialogContent - tooltip content 
 * @param changeMouseCursor	 - chnage mouse cursor to pointer
 */

function onLayerMouseOver(evt, dialogContent, changeMouseCursor) {
    mapLayerMouseOutHandler(evt, true);
    var target = evt.target;
    if (target && changeMouseCursor) {
        target.style.cursor = "pointer";
    }

    var dialog = new dijit.TooltipDialog({
        id: "tooltipDialog",
        content: dialogContent,
        style: "position: absolute; font: normal normal bold 6pt Tahoma;z-index:100"
    });
    dialog.startup();

    dojo.style(dialog.domNode, "opacity", 0.85);
    if(evt.pageX==undefined)
	{
		var node=evt.vertexinfo.graphic.getNode();
		dijit.popup.open({ popup: dialog, around: node });
        tooltipDialog.opened_ = true;
        node.innerHTML = "Hide";
	}
	else
	{
	    dijit.placeOnScreen(dialog.domNode, {
	        x: evt.pageX,
	        y: evt.pageY
	    }, ["TL", "BL"], {
	        x: 10,
	        y: 10
	    });
	}

    $(".dijitTooltipConnector").remove();
};

/**
 * map mouse out handelr...
 * @param evt
 */

function mapLayerMouseOutHandler(evt, isRemoveToiltip) {
    if (lastHoveredGraphicSymbol != undefined && (!isRemoveToiltip || isRemoveToiltip === undefined)) {
        var graphic = evt.graphic;
        lastHoveredGraphicSymbol.width = 1;
        graphic.setSymbol(lastHoveredGraphicSymbol);
        lastHoveredGraphicSymbol = null;
    }

    //destroy the tooltip widget....
    var widget = dijit.byId("tooltipDialog");
    if (widget) {
        widget.destroy();
    }
};


function closeRouteHandler() {
    popupManager.close("Route Selection");
    ESRIHelper.getRouteManager().destroy();
}

function closeRouteWizardHandler(event) {
    ESRIHelper.getRouteManager().destroy();
}

function openRouteWizardHandler(event, popupWIndow) {
    console.log($("div#routeWizard").height());
    console.log($("canvas").width());
    
    popupWIndow.closest(".k-window").css({
        top: 50,
        left: 100,
        width: ESRIHelper.getRouteManager().getWidth(),
        height: (($("div#routeWizard").height()+100) > getMapWindowHeight()? getMapWindowHeight()-100:($("div#routeWizard").height()+100)) 
    });  
}

/**
 * ESRI Map Print :Print successfully completed callback handler 
 * @param result
 */

function esriMapPrintComplete(result) {
    //read the url from the result set
    var urlIndex = result.url.indexOf("viu=");
    if (urlIndex >= 0) {
        //and open the URL in new window....
        window.open(result.url.substring(urlIndex + 4), "_blank");
    } else {
        //open the PDF in new window...
        window.open(result.url, "_blank");
    }

    parent.closeProgressDialog();
    //once the print is completed then
    //revert the map changes to its original settings
    initializePrinter(false);
    delete printTask;
}

/**
 * ESRI Map Print :Print error callback handler
 * @param error
 */

function esriMapPrintError(error) {
    parent.showErrorMsg(error + " occurred while printing the map");
    parent.showProgressDialog(false);
    //Oops ..print functionality for trapped.... then
    //revert the map changes to its original settings
    initializePrinter(false);
    delete printTask;
}

/**
 * ESRI Request pre-processor 
 * @param ioArgs
 * @returns
 */

function esriPreRequestCallbackFunction(ioArgs) {
    // inspect ioArgs
    if (ioArgs.content != undefined && ioArgs.content.Web_Map_as_JSON != undefined) {
        //as the current print service cannot handle the https requests....convert all of those to http
        ioArgs.content.Web_Map_as_JSON = ioArgs.content.Web_Map_as_JSON.replaceAll("https", "http");
    }
    return ioArgs;
}

/**
 * Change the map background color based on the selected layer....
 * @param baseMap
 */

function changeMapWinBackgroundColor(baseMap) {
    try {
        var layerObj = $.grep(allMapLayers, function(e) {
            return e.id == baseMap;
        });
        parent.changeMapBackgroundColor(layerObj[0].background);
    } catch (e) {
        console.log(e.message);
    }
}

/**
 *	Release 1.1
 */

function getLodIndex() {
    if ($("#zoomLevelId").length > 0) {
        return esriMap.getLodIndex($("#zoomLevelId").data("kendoComboBox").value());
    }
    return esriMap.getLodIndex("1"); //default zoom level
}

function getMapZoomLevel() {
    return esriMap.map.getLevel();
}

function lineLabelRadioClickHandler() {
    if ($("#nolblradio")[0].checked) {
        $("#ltrIdradio").removeAttr("disabled");
        $("#airCtyradio").removeAttr("disabled");
        //getKendoComboBox("zoomLevelId").enable(true);
    } else {
        $("#ltrIdradio").attr("disabled", true);
        $("#airCtyradio").attr("disabled", true);
        //getKendoComboBox("zoomLevelId").enable(false);
    }
}

/**
 * Mehtod is used to select the checkbox when the user clicks on the
 * label.
 */

function checkboxToggleHandler(checkboxId) {
    if (checkboxId != undefined) {
        $("#" + checkboxId).attr("checked", !$("#" + checkboxId)[0].checked);
    }
}


/**
 * Lasso End Handler /// 
 * @param geometry
 */

function lassoEndHandler(evt, shape) {
    var lassoComponent = this;
    //once the lasso is drawn on the map then add the graphic 
    //to the lasso graphic layer...
    var graphic = esriMap.createGraphic(evt.geometry, getLassoStyle(evt.geometry));
    if (lassoGraphicLayer != undefined) {
        lassoGraphicLayer.add(graphic);
    }
    //deactivate the drawtool
    if (shape === "Rectangle") {
        esriMap.deactivateDrawTool();
        setTimeout(function() {
            esriMap.activateDrawTool(shape);
        }, 100);
    }
}

/**
 * returns the symbol for drawing the extent...
 * @param geometry
 * @returns
 */

function getLassoStyle(geometry) {
    var symbol;
    switch (geometry.type) {
    case "polygon":
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([85, 142, 213]), 2), new dojo.Color([79, 129, 189, 0.25]));
        break;
    }

    return symbol;
}


function bindLocationFocusHandler(evt) {
    //get the data object from the selected graphic
    var dataObject = evt.graphic.data;
    //check whether the location is having any activities
    if (dataObject != undefined && dataObject["attributes"] != undefined && dataObject["attributes"]["AllLocations"] != undefined) {
        //if (!isAdvancedQueryModule()) {
        //add the menu item and create the context menu
        var allLocations = cloneArray(dataObject["attributes"]["AllLocations"]);
        if (!parent.isNetworkQuery && (dataObject["attributes"]["RelFacility"] != undefined && dataObject["attributes"]["RelFacility"] != "")) {
            allLocations.splice(0, 0, dataObject["attributes"]["RelFacility"]);
        }
        
        //check whether the location is having any activities
        if (isShowModeAnalysisMenu(dataObject)) {
        	 contextManager.buildMenu({
                 locations: allLocations,
                 menuNodes: ["Mode Analysis"]
             }, [evt.graphic]);
        }else {
        	contextManager.buildMenu({
                locations: allLocations                
            }, [evt.graphic]);
        }
       

        //bind the context menu to the graphic...
        contextManager.bindDomNode(evt.graphic.toolTip, evt.graphic.getDojoShape().getNode());
        
        if(SkdMxHelper.getMapOpeationManager().isActiveMode()){
        	if(SkdMxHelper.getDrawer().isTruckMode()){
        		if(!locationSelectionManager.isValid2BuildMenu({
                	facilities: allLocations
                }, [evt.graphic])){
        			locationSelectionManager.buildMenu({
                    	facilities: allLocations
                    }, [evt.graphic]);

                    //bind the context menu to the graphic...
                    locationSelectionManager.bindDomNode(evt.graphic.toolTip, evt.graphic.getDojoShape().getNode());
        		}        		
            }else {
            	locationSelectionManager.unBindAllNodes();
            }
        }
    }else if(dataObject != undefined && dataObject["attributes"] != undefined && dataObject["attributes"]["NoOfLegs"] != undefined ){
        if (ESRIHelper.getEsriGraphicManager().isShowUnDeleteMenu( evt.graphic) ) {
            contextManager.buildMenu({
                menuNodes: ["Un-Delete Route"]
            }, [evt.graphic]);
            //bind the context menu to the graphic...
            contextManager.bindDomNode(evt.graphic.toolTip, evt.graphic.getDojoShape().getNode());
        }
    }
}

function bindLocationFocusOutHandler(evt) {
    //get the data object from the selected graphic
    var dataObject = evt.graphic.data;

}

function cloneArray(object) {
    if (object) {
        return $.map(object, function(val, key) {
            return val;
        });
    }
    return null;
};


function getMapWindowWidth() {
    return $("#mapView").width();
}

function getMapWindowHeight() {
    return $("#mapView").height();
}

function openLocationsWindow() {
    onOpenLocationSettings("locationSettingDiv");
}

String.prototype.replaceAll = function(stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};


function validateRouteUtilization(checkbox, textId) {
    if ($(checkbox)[0].checked) {
        $("#" + textId).removeAttr("disabled");
    } else {
        $("#" + textId).attr("disabled", "disabled");
    }
}

function editRouteFromMapHandler() {
    var routeId = $("input:radio[name ='routes']:checked").val();
    if (routeId != undefined) {
    	SkdMxHelper.getDrawer().paintSkdMxDrawerWizardByRouteId(routeId);
    	closeRouteHandler();
    }
}

var start;
var end;
function invokeAddLegHandler(event){
	if(start == undefined){
		start = ESRIHelper.getEsriGraphicManager().getPictureGraphic(event.graphic);
		esriMap.map.graphics.add(start);
		start = start.geometry;
		if(end != undefined){
			drawLineHandler();
		}
		end = undefined;
	}else if(end == undefined){
		end = ESRIHelper.getEsriGraphicManager().getPictureGraphic(event.graphic);
		esriMap.map.graphics.add(end);
		end = end.geometry;
		drawLineHandler();
		start = undefined;
	}
}

function drawLineHandler(){
	 var coordinates = [
	                    [start.x, start.y],
	                    [end.x, end.y]];
	 var polylineGeometry =ESRIHelper.getEditToolManager().getPolylineGeometry({coords: coordinates});
     
    
     var polylineSymbol = ESRIHelper.getEditToolManager().getFeatureSymbol(polylineGeometry);
     esriMap.map.graphics.add(ESRIHelper.getEsriGraphicManager().getGraphic(polylineGeometry, polylineSymbol));
}


function routeTypeSelectHandler(){
    /**
     * Fdx / FDX-1292
     * SMD: 8888 Create Route Allows Mix Mode in Locations
     * Update the mode whenever the user selects the type of route he/she want to create
     */
    SkdMxHelper.getDrawer(). updateMode();
	SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnSkdMxAddRoute"), true);
	$('#SkdMxMapDrawerController').panel('hideMapOptionDiv');
    menu = parent.scheduleMaintenananceSeletedMenu;
}

function getRouteNo(event) {
	try {
		if(changeRoutObject != null) {
			SkdMxHelper.getSkdMxGridComponentManager().setMoveNumber(changeRoutObject.value);			
			$(changeRoutObject.parentDiv).data("kendoWindow").close();
            //Fdx / FDX-1292
            //SMD: 8888 Create Route Allows Mix Mode in Locations
            // => fix to update the icon states when the move number is selected from route popup
            SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
		}
	}catch (e) {
		console.log("Error while updating the route");
	}
}

function resetSkdMxDrawer(routeIds){
	if(routeIds != undefined){
		if(!SkdMxHelper.getDrawer().isRouteSelected()){
			SkdMxHelper.getDrawer().clearGraphicLayers(true);
		}else {
			if(routeIds.indexOf(SkdMxHelper.getMapOpeationManager().getRouteId()) === -1){
				//to do
			}
		}
		
	}
}