var LAYER_REQUEST_URL = "MAGMARequestHandler";

var viewerDashboardId = parent.DASHBOARD_ID_SCHEMATIC_VIEW;
var schematicViewDiv = function(){
	
};

var schematicDiagramContainer;
schematicViewDiv.ECOEXPML_NETWORK_LANES = "nwlanes_schematic.ecoexpml";
schematicViewDiv.ECOEXPML_SCHEDULE_LEGS = "schedlegs_schematic.ecoexpml";

schematicViewDiv.layerIdIndex = 100;
schematicViewDiv.LAYER_ID_NETWORK_LANES = schematicViewDiv.layerIdIndex++;
schematicViewDiv.LAYER_ID_NETWORK_SCHEDULE_LEGS = schematicViewDiv.layerIdIndex++;
schematicViewDiv.LAYER_ID_SCHEDULE_LEGS = schematicViewDiv.layerIdIndex++;

//var isNetworkScheduleDataAvailable = false;
var isScheduleForNetworkFlag = false;

schematicViewDiv.LAYER_IDS_NETWORK = [window[viewerDashboardId].LAYER_ID_NETWORK_LANES,window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS];
schematicViewDiv.LAYER_IDS_SCHEDULE = [window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS];

var viewerToggleBtnDivId = "schematicSView";
var PROGRESS_DIALOG_TITLE = "schematic";
var favoritesMenuId = "schematicViewerFavoritesMenu";
var localZuluBtnName = "toggleSZulu";
/******* common methods - start *******/

/**
 * caching all the schematic positions...
 */
var schematicDiagramPositions;
var isOptimizedPlacement = false;

/**
 * returns {Object} having schematic node positions...
 * @returns
 */
function getSchematicDiagramPositions(){
	return schematicDiagramPositions;
}

function setSchematicDiagramPositions(schematicNodePositions){
	schematicDiagramPositions = schematicNodePositions;
}

/**
 * clears all the layers, diagram etc.,
 * @param layerIds an {Array} of layer ids
 */
schematicViewDiv.clearLayers = function(layerIds) {	
	//if the schematic diagram container object is initialized
	if(schematicDiagramContainer) {
		//then if there are layers that need to be cleaned 
		if(layerIds) {
			//then clear the selected layers 
			schematicDiagramContainer.clear(layerIds);
		} else {
			//else clear all the layers...
			schematicDiagramContainer.clearAll();
		}
	}
};

/**
 * clears the schematic diagram based on the data type... 
 * @param dataType		data type refers to network, schedule or network & schedule
 */
function removeLayerByDataType(dataType) {
	//get the layer id by data type...
	var layerId = getLayerIdByDataType(dataType);
	//if the layer id is available then ...
	if(layerId != undefined) {
		//clear the diagram 
		schematicDiagramContainer.clear([layerId]);
	}
}

/**
 * resize event handlers... 
 * Resize's all the popup's
 */
function onResize() {
	setTimeout(function(){
		resizeAllPopUps();
	},200);
}

/**
 * 
 * @param buttonParentElement
 */
function bindToggleButtonClick(buttonParentElement) {
	buttonParentElement.attr('onclick','getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).toggleView(this, true)').bind('click');
}
/******* common methods - end *******/

/******* display settings - start *******/
function applyViewerDisplaySettings() {
		
}
/******* display settings - end *******/

/******* common methods - favorites - start *******/

/**
 * get the settings for the header of the schematic dashboard...
 * @param isApplicationLevel 		where the favorite is an application level...
 */
function getHeaderButtonSettings(isApplicationLevel) {
	var headerButtonSettings = {}; 
	//if the favorite is application level 
 	if(isApplicationLevel && isApplicationLevel != undefined){
 		//then include the favorite to get the direction, schedule or network flag & current viewer constant...
 		headerButtonSettings=getViewerHeaderButtonSettings(false);
 	}else {
 		//else get the remaining favorite details 
 		//(avoid to get the direction, schedule or network flag & current viewer constant...)
 		headerButtonSettings=getViewerHeaderButtonSettings(true);
 	}
 	
 	if(parent.$('#btnExpandCollapse') != null){
		headerButtonSettings["toggleexpandClass"] = parent.$('#btnExpandCollapse')[0].toggled;
	}
	/*if(parent.$('#btnSchematicSyncMap')[0].isHighlighted != null){
		headerButtonSettings["btnSchematicSyncMapClass"] = parent.$('#btnSchematicSyncMap')[0].isHighlighted;
	}else{
	    headerButtonSettings["btnSchematicSyncMapClass"]  = false;
	}
	if(parent.$('#btnSchematicSyncMatrix')[0].isHighlighted != null){
		headerButtonSettings["btnSchematicSyncMatrixClass"] = parent.$('#btnSchematicSyncMatrix')[0].isHighlighted;
	}else{
	    headerButtonSettings["btnSchematicSyncMatrixClass"]  = false;
	}*/
    return headerButtonSettings;  
}

/**
 * get the settings for the display options of the schematic dashboard...
 * @param isApplicationLevel 		whether the favorite is an application level...
 */
function getDisplayOptionSettings(isApplicationLevel) {
	var displaySettings={};
	//get the schedule tab settings...
	displaySettings.scheduleDisplayFav =getScheduleTabSettingsFavorite();
	//get the network tab settigns...
	displaySettings.networkDisplayFav =getNetworkTabSettingsFavorite();
	return displaySettings;

}

/**
 * get the content settings for the schematic dashboard...
 * @param isApplicationLevel		whether the favorite is an application level...
 * @returns {Object}
 */
function getContentFavoriteSettings(isApplicationLevel) {
	var schematicDiagramObj;
	var diagram;
	//check whether the schematic diagram container is initialized....
	if(schematicDiagramContainer){
		//then get the schematic diagram object...
		schematicDiagramObj = schematicDiagramContainer.getDiagram(getLayerId());
		//return the schematic diagram positions...
		return schematicDiagramObj.getPositions();
	}
	return EMPTY_STRING;
}

/**
 * applying the header button settings...
 * @param headerButtonSettings		schematic diagram header settings
 * @param isDefaultFavorite			flag to indicate whether the favorite is an default or not
 * @param isApplicationLevel		flag to indicate whether the favorite is an application level or not
 * @param isRefreshDashboard		flag to indicate whether to refresh the dashboard or not once the favorite is applied 
 */
function applyHeaderButtonSettings(headerButtonSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(headerButtonSettings != null){
		//if the synchornization between the map and schematic is active 
		if(isSyncViewer) {
			//then enable synchronization & perform necessary actions (includes enabling/disabling the header buttons etc.,) 
			if(isBtnHighlighted("btnMapSyncSchematic")){
				//parent.enableSync(parent.$('#btnMapSyncSchematic')[0],parent.DASHBOARD_ID_SCHEMATIC_VIEW,[parent.DASHBOARD_ID_MAP_VIEW], isBtnHighlighted("btnMapSyncSchematic"));
				enableSync("btnMapSyncSchematic", true);
			}else if(isBtnHighlighted("btnSchematicSyncMap")){
				//parent.enableSync(parent.$('#btnSchematicSyncMap')[0],parent.DASHBOARD_ID_SCHEMATIC_VIEW,[parent.DASHBOARD_ID_MAP_VIEW], isBtnHighlighted("btnSchematicSyncMap"));
				enableSync("btnSchematicSyncMap", true);
			}
			
			
			
		}
		//if the synchornization between the map and matrix is active  
		if(isSyncMatrix) {
			//then enable synchronization & perform necessary actions (includes enabling/disabling the header buttons etc.,)
			parent.enableSync(parent.$('#btnMapSyncMatrix')[0],parent.DASHBOARD_ID_SCHEMATIC_VIEW,[parent.DASHBOARD_ID_NETWORK_MATRIX,parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,parent.DASHBOARD_ID_SCHEDULE_MATRIX], false);
		}
		//aplying the header settings on schematic viewer...
		applyViewerHeaderButtonSettings(headerButtonSettings,false);
		
		parent.$('#btnExpandCollapse')[0].toggled=!headerButtonSettings["toggleexpandClass"];
		//updating the state of the expand / collapse button....
		toggleExpand(parent.$('#btnExpandCollapse')[0], false);		
	}
}

function isBtnHighlighted(btnId){
	return parent.isBtnHighlighted(btnId);
}

/**
 * applying the display option settings...
 * @param displayOptionSettings		schematic display option settings...
 * @param isDefaultFavorite			flag to indicate whether the favorite is an default or not
 * @param isApplicationLevel		flag to indicate whether the favorite is an application level or not
 * @param isRefreshDashboard		flag to indicate whether to refresh the dashboard or not once the favorite is applied 
 */
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(displayOptionSettings) {
		//applying the schedule tab display option settings..
		applyScheduleTabSettingsFavorite(displayOptionSettings.scheduleDisplayFav);
		//applying the network tab display option settings
		applyNetworkTabSettingsFavorite(displayOptionSettings.networkDisplayFav);
		//logic to show either network tab or schedule tab..
		showNetworkDisplayOptionsTab(parent.isNetworkQuery && !isScheduleForNetworkFlag);
		//if the query had already executed then... refresh the schematic viewer...
		var isRefreshViewer = parent.hasRunQuery();
		if(isRefreshDashboard != undefined && !isRefreshDashboard) {
			isRefreshViewer = false;
		}
		//apply the remaining display option settings and refresh the viewer...
		applyDisplaySettings(isRefreshViewer);
	}
}

/**
 * applying the content settings (mainly positions of nodes... )
 * @param contentSettings			schematic viewer content settigns...
 * @param isDefaultFavorite			flag to indicate whether the favorite is an default or not
 * @param isApplicationLevel		flag to indicate whether the favorite is an application level or not
 * @param isRefreshDashboard		flag to indicate whether to refresh the dashboard or not once the favorite is applied 
 */
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	//updating the schematic positions...
	schematicDiagramPositions = contentSettings; 
}
/******* common methods - favorites - end *******/

/******* header button methods - start *******/
/**
 * expand / collapse the schematic nodes. used to show all the lanes / legs in expand mode while in collapse mode
 *  it collapse to one lane / leg  
 * @param  	isExpand		flag to indicate whether to expand or collapse...	
 * @param	isRefreshViewer	flag t
 */
function expandCollapse(isExpand, isRefreshViewer) {
	btn.toggled = isExpand;
	toggleExpand($("#btnExpandCollapse", parent.document)[0], isRefreshViewer);
}

/**
 * Whenever the user toggle's expand/ collapse then reset the dashboard data status 
 * @param btn			Source button
 * @param isRefreshViewer	flag indicates whether to refresh viewer or not...
 */
function toggleExpand(btn, isRefreshViewer) {
	//appling the button states...
	if(!btn.toggled){
		btn.children[0].className = "k-icon collapse-all";
		btn.children[0].title= "Collapse all lines";
		btn.toggled = true;
	} else {
		btn.children[0].className = "k-icon expand-all";
		btn.children[0].title= "Expand all lines";
		btn.toggled = false;
	}
	isReturnAll = btn.toggled;
	//reset the dashboard data status
	parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK, false);
	parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);
	parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_SCHEDULE, false);
	
	//if true then refresh the viewer...
	if(isRefreshViewer) {
		refreshViewer();
	}
}

/******* header button methods - end *******/
/**
 * Whenever user clicks on the synchronize schematic viewer with map then this method is going to trigger. 
 * Main purpose is to import the settings (display options & header settings ) from source and update the same 
 * in the schematic display options...
 * 
 * @param mapViewerHeaderButtonSettings		header settings of map viewer dashboard
 * @param mapViewerDisplaySettings			display option settings of map viewer dashboard...
 */
function syncSchematicViewerSettingsWithMap(mapViewerHeaderButtonSettings, mapViewerDisplaySettings, isSyncViewer) {
	//if the map viewer dashboard settings are not available  
	if(mapViewerHeaderButtonSettings == undefined) {
		//then get the header and display option settings...
		var mapDashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW); 
		mapViewerHeaderButtonSettings = mapDashboard.getViewerHeaderButtonSettings(false);
		mapViewerDisplaySettings = mapDashboard.getDisplayOptionSettings();
	}
	//apply the header button settings 
	applyViewerHeaderButtonSettings(mapViewerHeaderButtonSettings,true,false, isSyncViewer);
	//apply the display button settings...
	applyDisplayOptionSettings(mapViewerDisplaySettings, false);
}

/**
 * initializing the display options in schematic viewer
 */
function initializeDisplayOptions() {
	//creating the schematic drawer
	parent.createOptionsPanelByDiv($("#mapOptions"),'slide-right',true,true,'66px','450px');
	//creating the tab view (either network & legend or schedule & legend)
	$("#displayOptionsTabstrip").kendoTabStrip({select: onViewerSettingsTabSelect});
	//initializing the common properties
	initializeCommmonDisplayOptions();
	//show / hide the network tab based on the current query window view...
	showNetworkDisplayOptionsTab(parent.isNetworkQuery && !isScheduleForNetworkFlag);
}

/**
 * show the necessary layers....
 */
function showLayers() {
	//if its the network query 
	if(parent.isNetworkQuery) {
		//hide the network & schedule legs layer
		showSchematicView(window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, false);
		// the network & schedule overlay toggle is active 
		if(isScheduleForNetworkFlag) {
			//then hide the network layer 
			showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, false);
			//show the network & schedule legs layer ...
			showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, true);
		} else {
			//show the network layer 
			showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, true);
			//hide the network & schedule legs layer...
			showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, false);
		}		
	} else {
		//if user is in schedule view then hide the 
		//network lanes or network/schedule legs and show the schedule layer...
		showSchematicView(window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, true);
		showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_LANES, false);
		showSchematicView(window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, false);		
	}
}

/**
 * show / hide the schematic layer 
 * @param layerId	layer id that need to be shown 
 * @param isShow	show /hide flag...
 */
function showSchematicView(layerId, isShow) {
	//get the html schematic div id for the layer id 
	var divId = getSchematicViewDiv(layerId);
	if(divId) {
		//show / hide the schematic div...
		showDiv(divId, isShow);
	}
}

/**
 * get the schematic view div id based on the layer type
 * @param layerId		
 * @returns {String}
 */
function getSchematicViewDiv(layerId) {
	if(layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
		return "networkSchematicViewDiv";
	} else if(layerId == window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) {
		return "networkScheduleSchematicViewDiv";
	} else {
		return "scheduleSchematicViewDiv";
	}
}

/**
 * When user clicks on the optimize icon on the schematic header then 
 * this method get invoked to optimize and refresh the viewer...
 */
function refreshWithOptimizedPlacement() {
	isOptimizedPlacement = true;
	refreshViewer();
}

/**
 * 
 * @param response
 * @param io
 */


schematicViewDiv.addLayer =  function(response, io){
	//try {
		if(response && response._errorCd && response._errorCd > 0) {
	    	parent.showFilterErrorMsg(response._errorDesc);    	
	    } else {
			if(!schematicDiagramContainer){
				schematicDiagramContainer = new SchematicDiagramContainer();
			}
			response.id = parseInt(response.id);
			var divId = getSchematicViewDiv(response.id);			
			var schematicDiagram = schematicDiagramContainer.getDiagram(response.id);
			if(schematicDiagram == null) {
				schematicDiagram = new SchematicDiagram(divId);
				schematicDiagramContainer.addDiagram(response.id, schematicDiagram);
			} else {
				schematicDiagram.clear();
			}
			schematicDiagram.isOptimizedPlacement = isOptimizedPlacement;
			schematicDiagram.nodePositionsMap = schematicDiagramPositions;
			schematicDiagram.addEcosystemLayer(response);
			if(isOptimizedPlacement) {
				isOptimizedPlacement = false;
			}
			//if(schematicDiagramPositions){
				//schematicDiagram.setPositions(schematicDiagramPositions);
			//}
			showLayers();
			if(favoriteComponent != null){
			    setTimeout( function() {
			    	if(favoriteComponent!=null && !favoriteComponent.isFavoriteApplied)
			    		favoriteComponent.applyDefaultFavorite();
				    parent.setDashboardInitialized(parent.DASHBOARD_ID_SCHEMATIC_VIEW);
			    }, 100);
			}
		}
	//} catch(e) {
	//	alert("Error = ["+e.message+"] occurred while adding the data to schematic");
	//} 
	if(isAdvancedQueryModule()){
		populateLegTypeDropDowns();
	}		
	showProgressDialog(false);
};	

/**
 * when the user clicks on the inconsistent transit on the schematic viewer then this method get's triggered to
 * show the transit popup
 * @param event		- schematic event object
 * @param object	- schematic node 
 */
function inconsistentTransitClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		if(schematicDiagramContainer){
			var schematicDiagramObj = schematicDiagramContainer.getDiagram(getLayerId());
			
			if(schematicDiagramObj){
				//show the transit popup...
				showTransitPopup(object.part.data, object.part.fromNode.data,
						 object.part.toNode.data, schematicDiagramObj, "getSchematicObjectStyle", true);
			}
		}
		hideBusyCursor();
	}, 100);
}

/**
 * when the user click on the location in the schematic viewer...
 * and if the mode is network only mode then schematic diagram container shows all the 
 * activites with inbound and outbound...
 * @param event		schematic event object
 * @param object	schematic node object
 */
function schematicLocationClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		if(parent.isNetworkQuery && !isScheduleForNetworkFlag) {
			//show the network activity popup...
			showNetworkActivityPopup(object.part.data);
		}
		hideBusyCursor();
	}, 100);
}

/**
 * when the user click on the link(lane / leg ) in the schematic viewer...
 * then schematic diagram container shows lane detail popup or leg detail popup based on the mode the user is in.
 * @param event		schematic event object
 * @param object	schematic node object	
 */
function schematicLinkClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		if(parent.isNetworkQuery && !isScheduleForNetworkFlag) {
			//event dispatcher for network schematic link click handler...
			networkSchematicLinkClickHandler(event, object);
		} else {
			//event dispatcher for schedule schematic link click handler...
			scheduleSchematicLinkClickHandler(event, object);
		}
		hideBusyCursor();
	}, 100);
}

/**
 * show the lane details & when the synchronization is active between
 * the schematic viewer and matrix then synchronize the view between the matrix and the popup
 * @param event		schematic event object
 * @param object	schematic node object
 */
function networkSchematicLinkClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		var schematicDiagramObj = schematicDiagramContainer.getDiagram(window[viewerDashboardId].LAYER_ID_NETWORK_LANES );
		if(schematicDiagramObj) {
			//synchronize the dashboards if the schematic viewer and matrix flags are active...
			if(isSyncMatrix || isSyncViewer) {
				syncDashboards(getIds(object.part.data));
			}
			//show the popup...
			lastSelectedLineId = showLaneDetailPopup(object.part.data, object.part.fromNode.data,
							 object.part.toNode.data, schematicDiagramObj.globalStylesMap, "getSchematicObjectStyle", true);
			hideBusyCursor();
		}
	}, 100);
}

/**
 * method is triggered when the user clicks on the link count (symbol used to indicate total number of lanes / legs )
 * this method is used to expand the lanes / legs on the schematic diagram 
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function expandClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		if(parent.isNetworkQuery && !isScheduleForNetworkFlag) {
			//network mode: expand click handler...
			networkExpandClickHandler(event, object);
		} else {
			//schedule mode: expand click handler
			scheduleExpandClickHandler(event, object);
		}
		hideBusyCursor();
	}, 100);
}

/**
 * method is triggered when the user clicks on the collapse button (symbol used to indicate collapse  "--")
 * this method is used to collapse the lanes / legs on the schematic diagram 
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function collapseClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		if(parent.isNetworkQuery && !isScheduleForNetworkFlag) {
			//netwrok mode: collapse handler
			networkCollapseClickHandler(event, object);
		} else {
			//schedule mode: collapse handler
			scheduleCollapseClickHandler(event, object);
		}
		hideBusyCursor();
	}, 100);
}

/**
 * event dispatcher to expand view on schematic diagram container for network mode
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function networkExpandClickHandler(event, object) {
	var schematicDiagramObj = schematicDiagramContainer.getDiagram(window[viewerDashboardId].LAYER_ID_NETWORK_LANES );
	if(schematicDiagramObj) {
		//event dispatcher 
		schematicDiagramObj.expandView(object, "LaneActivities", "NoOfLanes", "laneExStyleId");
	}
}

/**
 * event dispatcher to expand view on schematic diagram container for schedule mode
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function scheduleExpandClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		var schematicDiagramObj = schematicDiagramContainer.getDiagram(getLayerId());
		if(schematicDiagramObj) {
			//expand event dispatcher
			schematicDiagramObj.expandView(object, "LegDetails", "NoOfLegs", "legExStyleId");
		}
	hideBusyCursor();
	}, 100);
}

/**
 * event dispatcher to collapse view on schematic diagram container for network mode
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function networkCollapseClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		var schematicDiagramObj = schematicDiagramContainer.getDiagram(window[viewerDashboardId].LAYER_ID_NETWORK_LANES );
		if(schematicDiagramObj) {
			//collapse event dispatcher
			schematicDiagramObj.collapseView(object,  "LaneActivities", "NoOfLanes", "laneExStyleId");		
		}
		hideBusyCursor();
	}, 100);
}

/**
 * event dispatcher to collapse view on schematic diagram container for schedule mode
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function scheduleCollapseClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		var schematicDiagramObj = schematicDiagramContainer.getDiagram(getLayerId() );
		if(schematicDiagramObj) {
			//collapse event dispatcher
			schematicDiagramObj.collapseView(object, "LegDetails", "NoOfLegs", "legExStyleId");		
		}
		hideBusyCursor();
	}, 100);
}


function getSchematicNodeSizeByHeight(size) {
	if(size){
		var bounds = size.split(" ");
		return bounds[1].substring(0, bounds[1].length);
	}
}

/**
 * Method trigged from schematicDiagram.js when the user clicks on expand lanes or leg(s) 
 * It creates & returns the data for link(s) 
 * @param linkData		actual link data from where child links are created...
 * @param attributes	actual attributes 
 * @param laneActivity	lane activity or leg activity
 * @param nodeId		ID for this new link
 * @param styleAttr		style id for this link
 * @returns {Object}
 */
function getChildNetworkModel(linkData, attributes, laneActivity, nodeId, styleAttr){
	return {
		"attributes": attributes,
		"category": laneActivity[styleAttr],
		"coordinates": linkData.coordinates,
		"name": laneActivity.origin+"-"+laneActivity.destination,
		"styleId": linkData.styleId,
		"from" : laneActivity.originAP != undefined ? laneActivity.originAP : laneActivity.origin,
		"to" : laneActivity.destinationAP != undefined ? laneActivity.destinationAP : laneActivity.destination,
		"type": linkData.type,
		"id": laneActivity.origin+"-"+laneActivity.destination+nodeId
	};
}

/**
 * show the leg details & when the synchronization is active between
 * the schematic viewer and matrix then synchronize the view between the matrix details and the leg detail popup
 * @param event		schematic event object
 * @param object	schematic node object 
 */
function scheduleSchematicLinkClickHandler(event, object) {
	showBusyCursor();
	setTimeout(function(){
		try{		
			var schematicDiagramObj = schematicDiagramContainer.getDiagram(getLayerId());
			if(schematicDiagramObj){
				//synchronize the dashboards if the schematic viewer and matrix flags are active...
				if(isSyncMatrix || isSyncViewer) {
					syncDashboards(getIds(object.part.data));
				}
				//show the leg detail popup...
				lastSelectedLineId = showLegDetailPopup(object.part.data, object.part.fromNode.data,
						 object.part.toNode.data, schematicDiagramObj.globalStylesMap, "getSchematicObjectStyle", true);
			}
		} catch (e) {
			parent.showErrorMsg("Error occured while loading the leg details");
		}
		hideBusyCursor();
	}, 100);
	
	
	
}

/******** schematic diagram function ********/
function getSchematicNoOfLanes(attributes) {
	return attributes.NoOfLanes;
}

function getSchematicNoOfLegs(attributes) {
	return attributes.NoOfLegs;
}
/********* schematic diagram function  *******/

function getSchematicObjectStyle(name){
	var schematicDiagram = schematicDiagramContainer.getDiagram(getLayerId());
	return  schematicDiagram.getLinkTemplateByStyleId(name);
}
/**
 * clear/reset the viewer header settings... 
 * @param resetViewerHeader
 */
function resetViewerHeader(resetViewerHeader) {
		resetViewerHeaderSettings();
		parent.$('#btnExpandCollapse')[0].toggled=true;
		toggleExpand(parent.$('#btnExpandCollapse')[0], false);//do not refresh viewer
		
		//commented sync
		//parent.highlightBtn(parent.$('#btnSchematicSyncMap')[0],true);
		//parent.enableSync(parent.$('#btnSchematicSyncMap')[0],parent.DASHBOARD_ID_SCHEMATIC_VIEW,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_NETWORK_MATRIX,parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,parent.DASHBOARD_ID_SCHEDULE_MATRIX]);
		
		//parent.highlightBtn(parent.$('#btnSchematicSyncMatrix')[0],true);
		//parent.enableSync(parent.$('#btnSchematicSyncMatrix')[0],parent.DASHBOARD_ID_SCHEMATIC_VIEW,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_NETWORK_MATRIX,parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,parent.DASHBOARD_ID_SCHEDULE_MATRIX]);
}

/**
 * clear/reset the viewer content settings...
 */
function resetViewerContents(){
	var TRUE_CHKBOXES_ARR;
	var FALSE_CHKBOXES_ARR;
	var TRUE_RADIO_ARR;
	var COMBO_ARR;
	if(parent.isNetworkQuery && !isScheduleForNetworkFlag){
		TRUE_CHKBOXES_ARR=['flyChk','truckChk','otherChk','flySuggestedChk','truckSuggestedChk','otherSuggestedChk','flyMandatoryChk','truckMandatoryChk','otherMandatoryChk','popupDisplayOptionWeightChk','popupDisplayOptionCubeChk','popupDisplayOptionPiecesChk','popupDisplayOptionOdpdChk'];
		FALSE_CHKBOXES_ARR=['showerrorsChk','labelDepartureDaysChk','labelArrivalDaysChk','labelAvailableTimeChk','labelDueTimeChk','differentmodeChk',];
		TRUE_RADIO_ARR=['sortActivityType'];
		
	}else{
		TRUE_CHKBOXES_ARR=['scheduleFlightChk','scheduleTruckChk','schematicMatrixweightChk','schematicMatrixpiecesChk','schematiMatrixccubeChk'];
		FALSE_CHKBOXES_ARR=['netlegtypeFlyChk','netlegtypeTruckChk','schdllegtypeFlyChk','schdllegtypeTruckChk','schematiclegtypeRailChk','schematiclegtypeShipChk','routesLabelChk','marketViewVolChk','iataEquipDescLabelChk','equipCodeLabelChk','departureTimeLabelChk','effDaysLabelChk','arrivalTimeLabelChk'];
		TRUE_RADIO_ARR=['cuberadio'];
	
	}
	
	parent.updateControl(TRUE_CHKBOXES_ARR,true,parent.getDashboardContentWindow(viewerDashboardId));
	parent.updateControl(FALSE_CHKBOXES_ARR,false,parent.getDashboardContentWindow(viewerDashboardId));
	parent.updateControl(TRUE_RADIO_ARR,true,parent.getDashboardContentWindow(viewerDashboardId));
    if (isAdvancedQueryModule()) {
    	if(parent.isNetworkQuery && !isScheduleForNetworkFlag){
    		parent.validateComboBoxOnCheckboxByDiv($('#showerrorsChk')[0], $('#connErrorCombo'));
    		disableShowModes($('#differentmodeChk')[0]);
    	}else{
    		$('#txtWeightPercentageLow')[0].value=$('#txtCubePercentageLow')[0].value=$('#txtCautionLow')[0].value=20;
    		$('#txtWeightPercentageHigh')[0].value=$('#txtCubePercentageHigh')[0].value=$('#txtCautionHigh')[0].value=180;
    		
    		parent.updatekendoMultiSelect(['networkFlyCombo','networkTruckCombo','scheduleFlyCombo','scheduletruckCombo'],'kendoMultiSelectBox',parent.getDashboardContentWindow(viewerDashboardId));
    		$('#networkFlyCombo').data('kendoMultiSelectBox').selectedValues=EMPTY_STRING;
    		$('#networkTruckCombo').data('kendoMultiSelectBox').selectedValues=EMPTY_STRING;
    		$('#scheduleFlyCombo').data('kendoMultiSelectBox').selectedValues=EMPTY_STRING;
    		$('#scheduletruckCombo').data('kendoMultiSelectBox').selectedValues=EMPTY_STRING;
    	}	
    }
	
}