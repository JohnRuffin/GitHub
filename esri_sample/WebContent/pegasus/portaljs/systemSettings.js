/**
 * @author 888600 Abhishek Sharma
 * This script has the configuration method related to System Setting window.
 * This script used in systemSettings.jsp.
 */

/******* common methods - start *******/
var systemSettingsWin;
var startdefaultplan;
var sharableDataSource;
var responceCache;
var effDaysConfig = "M,T,W,T,F,S,S";
var prodGroupConfiguration;
var prodSeperator = "::::";
var productGroupPrefix;
var distanceInKm = false;
var WgtInKg = false;
var localTime = true;

function clear() {}

function onPlanChange() {}

function onTabSelect(tabName) {}

function onNetworkQuerySuccess() {}

function onNetworkScheduleQuerySuccess() {}

function onScheduleQuerySuccess() {}

function onResize() {}

function refresh() {

} /******* common methods - end *******/

/**
 * Method to initialize System Setting window.
 */

function initialize() {
    initializeSystemSettings();
    refresh();
}

/**
 * Method to initiaze Product Group component
 * User will be able to select multiple product groups under one category only
 */

function initializeProductGroupList() {
    // sharableDataSource datasource will be fillted with the Product Group data for "Volume" category
    if (sharableDataSource == null || sharableDataSource.data() && sharableDataSource.data().length <= 0) {
        sharableDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: getProductGroupsVolumeDataURL(),
                    dataType: "json",
                    data: function() {
                        console.log("System settings are loading for common case id [" + parent.getCommonCaseId() + "]");
                        return {
                            "commonCaseId": parent.getCommonCaseId(),
                            "uniqueRequestId": getUniqueId(),
                            "rand": getTime()
                        };
                    }
                }
            },
            requestEnd: function(e) {
                setTimeout(function() {
                    refreshProductGroups();
                }, 50);
            }
        });
        sharableDataSource.read();
    }

}

/**
 * Method to refresh Product Group component
 * Iterate through the Product Group volume data and build product group component
 */
/** Method to refresh Product Group component */

function refreshProductGroups() {
    var data = new Array();
    var subData;
    if (sharableDataSource.data().length > 0){
    	var keys = Object.keys(sharableDataSource.data()[0]);
    	if(keys != undefined){
        	for (var i = 0; i < keys.length; i++) {
                if (keys[i] != "_events" && keys[i] != "uid" && keys[i] != "parent") {
                    var tempData = sharableDataSource.data()[0][keys[i]];
                    if (tempData) {
                        var tempkeys = Object.keys(tempData);
                        subData = new Array();
                        for (var j = 0; j < tempkeys.length; j++) {
                            if (tempkeys[j] != "_events" && tempkeys[j] != "uid" && tempkeys[j] != "parent") {
                                if (tempData[tempkeys[j]] && tempData[tempkeys[j]].hasOwnProperty("prodGrpDesc")) {
                                    subData.push({
                                        prodId: tempData[tempkeys[j]].prodGrpName,
                                        id: tempData[tempkeys[j]].prodGrpDesc,
                                        ProductName: tempData[tempkeys[j]].prodGrpDesc,
                                        object: tempData[tempkeys[j]]
                                    });
                                }
                            }
                        }
                    }
                    data.push({
                        id: keys[i],
                        CategoryName: keys[i],
                        items: subData
                    });
                }
            }
    	}
    }
    
    // Creating kendo tree view component based on product group data.
    var treeview = $("#treeview");
    if (treeview.length > 0 && treeview.data("kendoTreeView") == undefined) {
    	treeview.kendoTreeView({
            checkboxes: {
                checkChildren: true
            },

            dataSource: data,
            dataBound: function(e) {
                if (!this.dataSource.data().length) {
                    this.element.append("<p class='no-items'>No items yet.</p>");
                } else {
                    this.element.find(".no-items").remove();
                }
            },
            dataTextField: ["CategoryName", "ProductName"]
        });
    } else {
    	treeview.data("kendoTreeView").dataSource.data(data);
    }

    resetSystemSettings(responceCache);
    appendLabels();
    setVolumeGrpNames();
}
var isProductInitalized = false;

/**
 * Method used to set the product group Id based on product group name and description
 */

function setInputIds() {
    var dataItem;
    $("#treeview").find("input:checkbox").each(function(i) {
        dataItem = $("#treeview").data("kendoTreeView").dataSource.get($(this).parent().parent().find(".k-in")[0].textContent);
        this.prodId = dataItem.prodId + prodSeperator + dataItem.parent().parent().CategoryName;
        this.productName = dataItem.ProductName;
    });
    $("#treeview").find("input:radio").each(function(i) {
        dataItem = $("#treeview").data("kendoTreeView").dataSource.get($(this).parent().parent().find(".k-in")[0].textContent);
        this.id = dataItem.CategoryName;
    });
    isProductInitalized = true;
}
/**
 * Method to append product group name labels to check boxes and option buttons
 */

function appendLabels() {
    $("#treeview").find(".k-plus").each(function() {
        this.nextSibling.children[0].type = "radio";
        this.nextSibling.children[0].name = "radoiProductGrp";
    });
    $("#treeview").find(".k-minus").each(function() {
        this.nextSibling.children[0].type = "radio";
        this.nextSibling.children[0].name = "radoiProductGrp";
    });
    var checkboxArr = $("#treeview").find("input:checkbox");
    var label;
    // Appending Labels to all the check boxes.
    for (var i = 0; i < checkboxArr.length; i++) {
        label = $("<label>");
        label[0].className = 'clear-labelMargin';
        $(checkboxArr[i]).parent().append(label);
    }
    // Appending Labels to all the radio buttons.
    $("#treeview").find("input:radio").each(function() {
        label = $("<label>");
        label[0].className = 'clear-labelMargin';
        $(this).parent().append(label);
    });
    $('#treeview input[type=radio]').click(function(e) {
        updateRadio(e);
    });
    $('#treeview input[type=checkbox]').click(function(e) {
        updateChks(e);
    });
    setInputIds();

    $("#treeview").find("input:checkbox").filter(':checked').each(function() {
        $('#' + ($(this)[0].prodId).split(prodSeperator)[1])[0].checked = true;
    });
}

/**
 * Event to update checkbox state.
 * @param e
 */

function updateChks(e) {
    $(e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement).find("input:radio")[0].checked = true;
    $(e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement).siblings().each(function(i) {
        $(this).children().eq(1).children().each(function(j) {
            $(this).find("input[type=checkbox]")[0].checked = false;
            ($("#treeview").data("kendoTreeView").dataSource.get($(this).find(".k-in")[0].textContent)).checked = false;
        });
    });
}

/**
 * Radiobutton Event and select/unselect all the checkboxes underneath
 * @param e
 */

function updateRadio(e) {
    $(e.currentTarget.parentElement.parentElement.parentElement).siblings().find("input").each(function(i) {
        this.checked = false;
        ($("#treeview").data("kendoTreeView").dataSource.get($(this).parent().parent().find(".k-in")[0].textContent)).checked = false;
    });
    $(e.currentTarget.parentElement.parentElement.parentElement).find("input:checkbox").each(function(j) {
        this.checked = true;
        ($("#treeview").data("kendoTreeView").dataSource.get($(this).parent().parent().find(".k-in")[0].textContent)).checked = true;
    });
}

/**
 * Method used to add button bar
 */

function addButtonsBar() {
    parent.addButtonsBar('networkMatrixDiv', $("#headerButtonsBar"));
}
/**
 * Method used to initialize System setting configurations
 */

function initializeSystemSettings() {
    if (systemSettingsWin == null || !systemSettingsWin.data("kendoWindow")) {
        createSystemSettingsWin('systemSettingDiv');
    }
    systemSettingsWin.data("kendoWindow").close();
}
/**
 * Method called while opening System Setting window
 */

function openSystemSettingsWin() {
    onOpenSystemSettings();
}
/**
 * Method called while opening System Setting window
 * This method will initialize Product group list component along with other default configurations. 
 */

function onOpenSystemSettings() {
    if (systemSettingsWin != null && systemSettingsWin.data("kendoWindow") != null) {
        initializeProductGroupList();
        resetSystemSettings(responceCache);
        // setting the x, y position
        systemSettingsWin.closest(".k-window").css({
            top: 40,
            left: 910
        });
        systemSettingsWin.data("kendoWindow").open();
        appendLabels();
    } else {}

}
/**
 * Method called while closing System Setting window
 * This method will close system setting window
 */

function onCloseSystemSettings() {
    if (systemSettingsWin != null && systemSettingsWin.data("kendoWindow") != null) {
        systemSettingsWin.data("kendoWindow").close();
    } else {}
}
/**
 * Method called while closing System Setting window
 * This method will close system setting window
 */

function onCancelSystemSettings() {
    onCloseSystemSettings();
}
/**
 * Method used to create System setting window
 * This method create kendo window for System setting window
 */

function createSystemSettingsWin(itemDiv) {
    systemSettingsWin = $('#' + itemDiv);

    if (!systemSettingsWin.data("kendoWindow")) {
        systemSettingsWin.kendoWindow({
            width: "400px",
            modal: true,
            resizable: false,
            actions: ["close"],
            title: "Application Settings"
        });
    }
    systemSettingsWin.data("kendoWindow").close();
    systemSettingsWin.data("kendoWindow").center();
}

function getLegTypeSetting() {
    if ($("#flightradio").is(":checked")) {
        return "flightradio";
    } else if ($("#truckradio").is(":checked")) {
        return "truckradio";
    } else if ($("#railradio").is(":checked")) {
        return "railradio";
    } else if ($("#shipradio").is(":checked")) {
        return "shipradio";
    }
}

function getUserId() {

}

function getCurrentPlanValue() {
    return;
}

/**
 * This method is used to retrieve and apply System setting configuration
 * This method will call system setting service and retrieve the data from database
 */

function retriveAndApplySystemSettings() {
    var userId;
    serviceUrl = SYS_SETTING_RENDER_DATA_URL;
    userId = getUserId();
    callSaveSystemSettingService(serviceUrl, userId, "", "READ", onSystemSettingRetriveRequestSucceeded, onSystemRetriveSettingRequestFailure, false);
}

/**
 * Success callback method of System Setting service
 */

function onSystemSettingRetriveRequestSucceeded(response, io) {
    if (io == "success" && response != null) {
        resetSystemSettings(response);
    } else {}
}

/**
 * This method is used to reset the System setting configuration based on the new responseSettings configuration
 * @param responseSettings
 */

function resetSystemSettings(responseSettings) {
    if (responseSettings.volumeGroups && responseSettings.volumeGroups != " " && responseSettings.volumeGroups != "") {
        var subCategories = [];
        var checkedNodes = [];
        checkedNodes = responseSettings.volumeGroups.split(COMMA_STRING);
        productGroupPrefix = checkedNodes[0].split(prodSeperator)[1] + ":";
        for (var i = 0; i < checkedNodes.length; i++) {
            subCategories.push(checkedNodes[i].split(prodSeperator)[0]);
        }
        if (subCategories.length > 0) {
            setProductGroupConfiguration(productGroupPrefix + subCategories.toString());
        } else {
            setProductGroupConfiguration("");
        }
    }

    responceCache = responseSettings;
    if (responseSettings != null) {
        if (responseSettings['weight'] != null) $("#" + responseSettings['weight'])[0].checked = true;
        if (responseSettings['lenght'] != null) $("#" + responseSettings['lenght'])[0].checked = true;
        if (responseSettings['effdays'] != null) $("#" + responseSettings['effdays'])[0].checked = true;
        if (responseSettings['timezone'] != null) $("#" + responseSettings['timezone'])[0].checked = true;
        if (responseSettings['onstartdefaultplantype'] != null) $("#" + responseSettings['onstartdefaultplantype'])[0].checked = true;
        if (responseSettings['volumeGroups'] != null) {
            var treeView = $("#treeview").data("kendoTreeView");
            var tempdata;
            if (treeView != null && treeView.dataSource != null) {
                tempdata = treeView.dataSource.view();
                var resCheckedNodes = responseSettings['volumeGroups'].split(',');
                var prodGrpId;
                setCheckedNodeIds(tempdata, resCheckedNodes, prodGrpId);
                treeView.setDataSource(tempdata);
            }
        }
        setApplicationSettingData(responseSettings);
        initializeProductGroupList();
    } else {
        //alert("no default case");
    }

}
/**
 * Method that gathers IDs of checked nodes
 */
//function that gathers IDs of checked nodes

function setCheckedNodeIds(nodes, resCheckedNodes, prodGrpId) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].hasChildren) {
            setCheckedNodeIds(nodes[i].children.view(), resCheckedNodes, prodGrpId);
        }
        for (var j = 0; j < resCheckedNodes.length; j++) {
            if (nodes[i].hasOwnProperty('prodId') && nodes[i].parent().parent().hasOwnProperty('CategoryName')) {
                prodGrpId = nodes[i].prodId + prodSeperator + nodes[i].parent().parent().CategoryName;
                if (prodGrpId == resCheckedNodes[j]) {
                    nodes[i].checked = true;
                }
            }

        }
    }
}

/**
 * Method called when clicked on save button
 * This method is used to save System setting data in the database
 */

function onSaveSystemSettings(isReload) {
    var systemSettingData = {};
    var systemSettingJSON;
    var userId;
    setVolumeGrpNames();
    // This will collect all the System Setting configuration and call the Save System Setting configuration service.
    systemSettingData.weight = $("#poundsradio").is(":checked") == true ? "poundsradio" : "kgradio";
    systemSettingData.lenght = $("#milesradio").is(":checked") == true ? "milesradio" : "kmradio";
    systemSettingData.effdays = $("#mtwtfssradio").is(":checked") == true ? "mtwtfssradio" : "mtwrfsnradio";
    systemSettingData.timezone = $("#localtimeradio").is(":checked") == true ? "localtimeradio" : "zulutimeradio";
    systemSettingData.onstartdefaultplantype = $("#lastUsedRadio").is(":checked") == true ? "lastUsedRadio" : "choosePlanRadio";
    if ($("#lastUsedRadio").is(":checked")) {
        systemSettingData.onstartdefaultplan = getCommonCaseId();
        systemSettingData.onstartdefaultcasetype = getSelectedCaseTypes();
    }
    setApplicationSettingData(systemSettingData);
    addProdGrpDtlsToSettingsData(systemSettingData);
    serviceUrl = SYS_SETTING_RENDER_DATA_URL;
    userId = getUserId();
    systemSettingJSON = JSON.stringify(systemSettingData);
    // Calling Save System Setting configuration service to update the existing System Configuration data
    callSaveSystemSettingService(serviceUrl, userId, systemSettingJSON, "SAVE", onSystemSettingRequestSucceeded, onSystemSettingRequestFailure, isReload);
    systemSettingsWin.data("kendoWindow").close();
}

/**
 * Method used to set/update System Setting data based on systemSettingData object
 */

function setApplicationSettingData(systemSettingData) {
    if (systemSettingData.effdays == "mtwtfssradio") {
        setEffDaysConfig("M,T,W,T,F,S,S");
    } else if (systemSettingData.effdays == "mtwrfsnradio") {
        setEffDaysConfig("M,T,W,R,F,S,N");
    }

    if (systemSettingData.timezone == "zulutimeradio") {
        setLocalTime(false);
    } else {
        setLocalTime(true);
    }

    if (systemSettingData.lenght == "kmradio") {
        setDistanceInKms(true);
    } else {
        setDistanceInKms(false);
    }

    if (systemSettingData.weight == "kgradio") {
        setWeightInKgs(true);
    } else {
        setWeightInKgs(false);
    }
}

/**
 * Method used to add product group configuration
 */

function addProdGrpDtlsToSettingsData(systemSettingData) {
    var checkedNodes = [];
    var prodGrpTree = $("#treeview");
    prodGrpTree.find("input:checkbox").filter(':checked').each(function(i) {
        checkedNodes.push(this.prodId);
    });
    if (prodGrpTree != null && isProductInitalized) {
        systemSettingData.volumeGroups = checkedNodes.join(COMMA_STRING);
    } else if(responceCache){
        systemSettingData.volumeGroups = responceCache['volumeGroups'];
    }
    var subCategories = [];
    if (systemSettingData.volumeGroups && systemSettingData.volumeGroups != "") {
        checkedNodes = systemSettingData.volumeGroups.split(COMMA_STRING);
        productGroupPrefix = checkedNodes[0].split(prodSeperator)[1] + ":";
        for (var i = 0; i < checkedNodes.length; i++) {
            subCategories.push(checkedNodes[i].split(prodSeperator)[0]);
        }
    }
    var iskmr = false;
    if (systemSettingData.lenght === "kmradio") {
        iskmr = true;
    }
    var iskgr = false;
    if (systemSettingData.weight === "kgradio") {
        iskgr = true;
    }

    var prodGroup = productGroupPrefix + subCategories.toString();
    if (prodGroup != getProductGroupConfiguration()) {
        if (subCategories.length > 0) {
            setProductGroupConfiguration(prodGroup);
        } else {
            setProductGroupConfiguration("");
        }
        // Updating Network/Volume Utilization matrix with the updated product groups
        var nwDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_NETWORK_MATRIX);
        if (nwDashboardContentWindow) {
            nwDashboardContentWindow.addProductGroupColumnHeaders("networkMatrixGrid");
        }
        var vuDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX);
        if (vuDashboardContentWindow) {
            vuDashboardContentWindow.addProductGroupColumnHeaders("volUtilizationMatrixGrid");
        }
        var mapDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW);
        if (mapDashboardContentWindow && mapDashboardContentWindow.hasOwnProperty("addProductGroupColumnHeadersInPopUp")) {
            mapDashboardContentWindow.addProductGroupColumnHeadersInPopUp();
        }
    }
}

/**
 * Method used to update System Setting data based on the plan
 */

function updateSystemSettings(caseId) {
    if ($("#lastUsedRadio").is(":checked")) {
        var systemSettingData = {};
        var systemSettingJSON;
        var userId;
        systemSettingData.weight = responceCache['weight'];
        systemSettingData.lenght = responceCache['lenght'];
        systemSettingData.effdays = responceCache['effdays'];
        systemSettingData.timezone = responceCache['timezone'];
        systemSettingData.onstartdefaultplantype = responceCache['onstartdefaultplantype'];
        systemSettingData.onstartdefaultcasetype = getSelectedCaseTypes();
        addProdGrpDtlsToSettingsData(systemSettingData);
        if (caseId != null) {
            systemSettingData.onstartdefaultplan = caseId;
        }

        serviceUrl = SYS_SETTING_RENDER_DATA_URL;
        userId = getUserId();
        systemSettingJSON = JSON.stringify(systemSettingData);
        callSaveSystemSettingService(serviceUrl, userId, systemSettingJSON, "SAVE", onSystemSettingRequestSucceeded, onSystemSettingRequestFailure, false);
        systemSettingsWin.data("kendoWindow").close();
    }
}

/**
 * Method on system settings success request
 * @param response - response string from system setting service call
 * @param io - Tells whether its a success or failure
 */

function onSystemSettingRequestSucceeded(response, io) {
    if (io == "success" && response != null) {
        var effDaysHeader;
        // If success, update effDays header
        if (response.effdays == "mtwtfssradio") {
            effDaysHeader = "M,T,W,T,F,S,S";
        } else if (response.effdays == "mtwrfsnradio") {
            effDaysHeader = "M,T,W,R,F,S,N";
        }
        // If success, update effDays header in all the matrices		
        var nwDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_NETWORK_MATRIX);
        var scDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX);
        var nsDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
        var laDashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_ALLOCATION_MATRIX);
        if (isDashboardActive(DASHBOARD_ID_NETWORK_MATRIX)) {
            nwDashboardContentWindow.updateGridColumnHeaders(effDaysHeader, "networkMatrixGrid");
        }
        if (isDashboardActive(DASHBOARD_ID_SCHEDULE_MATRIX)) {
            scDashboardContentWindow.updateGridColumnHeaders(effDaysHeader, "scheduleMatrixGrid");
        }
        if (isDashboardActive(DASHBOARD_ID_ALLOCATION_MATRIX)) {
            laDashboardContentWindow.updateGridColumnHeaders(effDaysHeader, "locAllocMatrixGrid");
        }
        if (isDashboardActive(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX)) {
            nsDashboardContentWindow.updateGridColumnHeaders(effDaysHeader, "scheduleMatrixGrid");
        }
        resetSystemSettings(response);        
    } else {}
}
/**
 * System setting retrieve service failure callback method 
 */

function onSystemRetriveSettingRequestFailure(response, io) {
    if (io == "success" && response != null) {} else {}
}
/**
 * System setting save service failure callback method 
 */

function onSystemSettingRequestFailure(response, io) {
    if (io == "success" && response != null) {

    }
}
/**
 * Method to call System Setting service 
 */

function callSaveSystemSettingService(serviceUrl, userId, systemSettingJSON, datatype, onSuccessRequestfun, onFailureRequestfun, isReload) {
    var moduleId = 1;
    var languageId = 1;
    var paramsMap = {
        'browserSessionId': getBrowserSessionId(),
        'userId': userId,
        'commonCaseId': getCommonCaseId(),
        'datatype': datatype,
        'moduleId': moduleId,
        'languageId': languageId,
        'systemSettings': systemSettingJSON
    };
    callService({
        url: serviceUrl,
        paramsMap: paramsMap,
        successCallback: function(response, io){
        	onSuccessRequestfun(response, io);
        	if(isReload){
        		window.location.reload();
        	}
        },
        failureCallback: onFailureRequestfun,
        showProgressWindow: false
    });
} /** Getter/Setter for effective days configuration String  */

function getEffDaysConfig() {
    return effDaysConfig;
}

function setEffDaysConfig(effDaysConfig) {
    this.effDaysConfig = effDaysConfig;
}

/** Getter/Setter for Product Group configuration String  */

function getProductGroupConfiguration() {
    return prodGroupConfiguration;
}

function setProductGroupConfiguration(prodGroupConfiguration) {
    this.prodGroupConfiguration = prodGroupConfiguration;
}
function setVolumeGrpNames(volumeGrpNames){
	//console.log('setVolumeGrpNames');
	if(volumeGrpNames == undefined){
		var checkedNodeNames = [];
	    var prodGrpTree = $("#treeview");
	    prodGrpTree.find("input:checkbox").filter(':checked').each(function(i) {
	        checkedNodeNames.push(this.productName);
	    });
	    this.volumeGrpNames = checkedNodeNames.join();
	}else{
		this.volumeGrpNames = volumeGrpNames;
	}   
}

function getProductGroupNames(){
	//console.log('getVolumeGrpNames');
	if (this.volumeGrpNames == undefined){
		initializeProductGroupList();
	}else{
		return this.volumeGrpNames;
	}
}
/** Getter/Setter for Distance configuration String  */

function isDistanceInKms() {
    return distanceInKm;
}

function setDistanceInKms(distanceInKm) {
    this.distanceInKm = distanceInKm;
}

/** Getter/Setter for weight configuration String  */

function isWeightInKgs() {
    return WgtInKg;
}

function setWeightInKgs(WgtInKg) {
    this.WgtInKg = WgtInKg;
}

/** Getter/Setter for timezone configuration String  */

function isLocal() {
    return localTime;
}

function setLocalTime(localTime) {
    this.localTime = localTime;
}

function volumeGroupsRefreshHandler() {
    if (sharableDataSource != undefined) {
        sharableDataSource.data([]);
        sharableDataSource.read();
    }
}

function getSelectedEffDayStrPattern(){
	return $("input:radio[name ='effdaysgrp']:checked").val();
}

function getSelectedEffDayPattern(){
	return getSelectedEffDayStrPattern().split(",");
}