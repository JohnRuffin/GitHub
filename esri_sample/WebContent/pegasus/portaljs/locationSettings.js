/******* common methods - start *******/
var locationSettingsWin;

/**
 * Method called while opening Location Setting window
 */

function onOpenLocationSettingsWin() {
    onOpenLocationSettings();
}
/**
 * Method called while opening Location Setting window
 * This method will initialize Product group list component along with other default configurations. 
 */

function onOpenLocationSettings(itemDiv) {
    if (locationSettingsWin != null && locationSettingsWin.data("kendoWindow") != null) {
       locationSettingsWin.data("kendoWindow").open();
       locationSettingsWin.data("kendoWindow").center();
    }else if(locationSettingsWin == undefined || locationSettingsWin.data("kendoWindow") == undefined){
    	createLocationSettingsWin(itemDiv);
    }
}
/**
 * Method called while closing Location Setting window
 * This method will close system setting window
 */

function onCloseLocationSettings() {
    if (locationSettingsWin != null && locationSettingsWin.data("kendoWindow") != null) {
        locationSettingsWin.data("kendoWindow").close();
    } else {}
}
/**
 * Method called while closing Location Setting window
 * This method will close system setting window
 */

function onCancelLocationSettings() {
    onCloseLocationSettings();
}
/**
 * Method used to create Location setting window
 * This method create kendo window for Location setting window
 */

function createLocationSettingsWin(itemDiv) {
    locationSettingsWin = $('#' + itemDiv);

    if (!locationSettingsWin.data("kendoWindow")) {
        locationSettingsWin.kendoWindow({
            width: "450px",
            modal: false,
            resizable: false,
            actions: ["close"],
            title: "Location Settings"
        });
    }
    locationSettingsWin.data("kendoWindow").open();
    locationSettingsWin.data("kendoWindow").center();
}

function showMapLocationSelectionHandler(locationId){
	var selectedItem = $("#"+locationId).attr("id");
	
	switch(selectedItem){
	case "isNoneLocations":
		$("#applyDisplaySettings").attr("disabled", "disabled");
		//ESRIHelper.getEsriZoomManager().getFacilityClusterLayer().hide();
	case "isDefaultConfig":
		$(".locationSelection").hide();
		$("#rampsChk")[0].checked = false;
		$("#dockChk")[0].checked = false;
		$("#hubsChk")[0].checked = false;
		$("#airportFeeder")[0].checked = false;
		$("#airportTrunk")[0].checked = false;
		$("#airportLineHaul")[0].checked = false;
		$("#meetPoints")[0].checked = false;
		$("#stations")[0].checked = false;
		$("#userAddedLocations")[0].checked = false;
		loadFacilityLocationsLayer(true);
		$("#applyDisplaySettings").removeAttr("disabled");
		$(".locationSelectionsChk").attr("disabled", "disabled");		
		break;
	case "isManual":
		 $("#applyDisplaySettings").removeAttr("disabled");
		 $(".locationSelectionsChk").removeAttr("disabled"); 
		 loadFacilityLocationsLayer(true);
		break;
	}
}

/**
 * As  Schedule Maintenance is depended on Facilities on the map….
     Work flow for the same is as follows
     1)	Whenever the user selects the “Schedule Maintenance” mode, the map populates with default option selected
     2)	Whenever the user unselects the “Schedule Maintenance” mode, the map switches back to “No Selections” mode
 * @param locationId
 */
function selectAndExecuteSelectionHandler(locationId){
    if($("#isNoneLocations")[0].checked || locationId == "isNoneLocations"){
        //reset the radio btn states
        $("#isDefaultConfig").prop("checked", false);
        $("#isNoneLocations").prop("checked", false);
        //set the state of the radio btn
        $("#"+locationId).prop("checked", true);
        //invoke loading the facility layer for rendering the data on the map
        showMapLocationSelectionHandler(locationId);
    }
}