/**
 * @author Honey Bansal
 * All methods in this file are common and used in scheduleMatrixRouteEditor.js and ScheduleWIPMatxix.js
 */
var menu;
var mxMode;
var gridId;
var dashboardID;
var LEGS_GRID_ID = 0;
var isInitialized = false;
var isValidationError = false;
var isRouteValidationError = false;
var searchPopUpMap = new Object();
var expandedRoutes = [];

/******* common methods - start *******/
function onPlanChange() {
}
function onTabSelect(tabName) {
}
function onBeforeRunQuery() {
}
function onNetworkQuerySuccess() {
}
function onNetworkScheduleQuerySuccess() {
}
function onScheduleQuerySuccess() {
}
function onResize() {
}
/******* common methods - end *******/

function onChangeCombo(evt,options,grid_Id,kendoComboBoxEditor) {
    var value = kendoComboBoxEditor.value();
    var grid = $('#' + grid_Id).data("kendoGrid");
    grid.dataItem(evt.sender.element.closest("tr"))[options.field] = value;
    if ((menu == 'TS'|| menu=='TSS') && options.field =='ROUTE_TYPE_CD') {
        var gridData = grid.dataItem(evt.sender.element.closest("tr"));
        if (evt.sender.element.closest("tr").find('input.k-temp-route').prop("checked")) {
            if (gridData['ROUTE_TYPE_CD'] == 'LineHaul' || gridData['ROUTE_TYPE_CD'] == 'Linehaul') {
                setRouteTypeValue(grid, evt.sender.element.closest("tr"),"ax");
            }else if (gridData['ROUTE_TYPE_CD'] == 'Shuttle'){
                setRouteTypeValue(grid, evt.sender.element.closest("tr"),"axa");
            }
        } else {
            if (gridData['ROUTE_TYPE_CD'] == 'LineHaul' || gridData['ROUTE_TYPE_CD'] == 'Linehaul') {
                setRouteTypeValue(grid, evt.sender.element.closest("tr"),"aa");
            }else if (gridData['ROUTE_TYPE_CD'] == 'Shuttle'){
                setRouteTypeValue(grid, evt.sender.element.closest("tr"),"aaa");
            }
        }
    }
}

function setRouteTypeValue(grid,tableRow,value) {
    grid.dataItem(tableRow)['MV_NUM']=value;
    parent.SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(grid, tableRow, "MV_NUM").text(value);
}

function createValidationDataSource(dataType, dataItem) {
    var datasource = new kendo.data.DataSource({
        serverFiltering:false,
        transport: {
            read: {
                url:
                    function (options) {
                        return  ROUTE_SCHEDULE_VALIDATION_SERVICE_DATA_URL + dataType +
                            "&commonCaseId=" + parent.getCommonCaseId() +
                            "&scheduleId=" + parent.getScheduleId() +
                            "&browserSessionId=" + parent.getBrowserSessionId() +
                            "&modeDesc=" + getNotNullStr(dataItem.MODE) +
                            "&capacityDesc=" + getNotNullStr(dataItem.CAPACITY_CD) +
                            "&carrierDesc=" + getNotNullStr(dataItem.CARRIER_TYPE) +
                            "&routeTypeDesc=" + getNotNullStr(dataItem.ROUTE_TYPE_CD) +
                            "&equipDesc=" + getNotNullStr(dataItem.EQUIP_TYPE) +
                            "&legDesc=" + getNotNullStr(dataItem.LEG_TYPE);
                    },
                dataType: OUTPUT_TYPE_JSON
            }
        },
        requestStart: function(e) {
            console.log("requestStart occured while setting the check box");
        },
        requestEnd: function(e) {
            console.log("requestEnd occured while setting the check box");
        },
        error: function(e) {
            console.log("Error occured while setting the check box");
        }
    });
    datasource.read();
    return datasource;
}

function getNotNullStr(string) {
    if(string != undefined && string != null && string != 'undefined' && string != 'null') {
        return string;
    }
    return EMPTY_STRING;
}

function detailInit(e) {
    var detailRow = e.detailRow;
    var tabStrip = detailRow.find("#tabstrip").kendoTabStrip({
        animation: {
            open: {effects: "fadeIn"}
        }
    });
    var ts = tabStrip.data("kendoTabStrip");
    //ts.enable(ts.tabGroup.children("li:eq(1)"), false);
    ts.enable(ts.tabGroup.children("li:eq(2)"), false);
    //ts.enable(ts.tabGroup.children("li:eq(3)"), false);
    addLegsGrid(detailRow, e);
    if(e.data.MODE == "Flight" && (e.data.ROUTE_CONTEXT_CD != undefined && e.data.ROUTE_CONTEXT_CD != "Flt CLH")) {
        addSeasonsGrid(detailRow, e);
    }else {
        ts.tabGroup.children("li:eq(3)").attr("style","display:none");
    }
    addAllocationGrid(detailRow, e);
}
function addAllocationGrid(detailRow, e){
    var gridDiv = detailRow.find("div.k-allocation-grid");
    var ramdomId;// = "allocationGrid_" + allocGridData[0]['LEG_ID'] + e.data["ROUTE_ID"];//(LEGS_GRID_ID - 1);
    var allocGridData = [];
    var selectedLegs;
    if(dashboardID == parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP){
        selectedLegs = parent.selectedWIPLegList;
    }else{
        selectedLegs = parent.selectedLegList;
    }
    var legsGridData = $.grep(selectedLegs, function(item) {
        return (item.ROUTE_ID == e.data.ROUTE_ID && e.data.ROUTE_ID != "");
    });
    if(legsGridData != undefined && legsGridData.length > 0){
        for(var i=0; i < legsGridData.length; i++){
            if(legsGridData[i] != undefined && legsGridData[i]['OPERATION_CD'] != undefined && legsGridData[i]['OPERATION_CD'] != "Deleted"){
                if(legsGridData[i].ALLOCS != undefined && (legsGridData[i].ALLOCS).length > 0){
                    legsGridData[i].ALLOCS[0].isLeg = true;
                    $.merge(allocGridData,legsGridData[i].ALLOCS);
                }else{
                    var legAlloc = getAllocLegObj(legsGridData[i],true);
                    $.merge(allocGridData,[legAlloc]); ;
                }
            }
        }
    }
    if(allocGridData == undefined || allocGridData.length == 0) {
        var legAlloc = getAllocLegObj(null,true);
        allocGridData = [legAlloc];
    }
    ramdomId = "allocationGrid_" + (allocGridData[0] != undefined ? allocGridData[0]['ROUTE_ID'] : EMPTY_STRING);// + e.data["ROUTE_ID"];
//	console.log("allocationGrid_ID: "+ ramdomId);
    gridDiv.attr("id", ramdomId);
    gridDiv.kendoGrid({
        scrollable: true,
        pageable: false,
        selectable:false,
        reorderable: true,
        resizable: true,
        detailInit: allocationDetailInit,
        detailTemplate: kendo.template($("#allocGridTemp").html()),
        editable: true,
        navigatable: true,
        editable: {
            confirmation: false
        },
        edit: function(e) {
            allocationGridEditHandler(e);
        },
        columns:SkdMxREGridHelper.getAllocationGridManager().getAllocationGridColumns(ramdomId,dashboardID),
        dataSource: SkdMxREGridHelper.getAllocationGridManager().getAllocationGridDataSource(allocGridData),
        dataBound: function() {
            var dataSource = this.dataSource;
            this.element.find('tr.k-master-row').each(function() {
                var row = $(this);
                var data = dataSource.getByUid(row.data('uid'));
                if (!data.get('LOC_ALLOCATION')) {
                    row.find('.k-hierarchy-cell a').css({ opacity: 0.0, cursor: 'default' });//.click(function(e) { e.stopImmediatePropagation(); return false; });
                    row.find('.k-hierarchy-cell a')[0].className = 'k-icon';
                }else{
                    row.find('.k-hierarchy-cell a').click();
                }
            });
        }
    });
    var allocKDs = $("#" + ramdomId).data("kendoGrid").dataSource;
    allocKDs.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
    $('#'+ramdomId).data("kendoGrid").refresh();
}

function allocationDetailInit(e) {
    var detailRow = e.detailRow;
    addLocAllocationGrid(detailRow, e);
}
function addLocAllocationGrid(detailRow, e){
    var gridDiv = detailRow.find("div.k-locAllocation-grid");
    var ramdomId = "loc_allocationGrid_" + e.data.ALLOC_ID;
    var locAllocGridData = e.data.LOC_ALLOCS;
    if(locAllocGridData == undefined || locAllocGridData.length == 0) {
        var legAlloc = getLocAllocLegObj(e.data);
        locAllocGridData = [legAlloc];
    }
    gridDiv.attr("id", ramdomId);
    gridDiv.kendoGrid({
        scrollable: true,
        pageable: false,
        selectable:false,
        reorderable: true,
        resizable: true,
        editable: true,
        editable: {
            confirmation: false
        },
        edit: function(e) {
            var input = e.container.find("input.k-input");
            input.select();
            input.blur(function (e) {
                parent.SkdGridHelper.getSkdGridManager().changeCaseToUpperCase($(this));
            });
            displayValidationForLastTwRow(e);
        },
        parse: function (d) {
            $.each(d, function (idx, dataItem) {
                parseLocAllocationCostData(dataItem);
            });
            return d;
        },
        navigatable: true,
        columns:SkdMxREGridHelper.getLocAllocationGridManager().getLocAllocationGridColumns(ramdomId,dashboardID),
        dataSource: SkdMxREGridHelper.getLocAllocationGridManager().getLocAllocationGridDataSource(locAllocGridData)
    });

}

function validateTotalWeightCube(input, field) {
    try {
        var allocRow = input.closest("tr").closest("div.k-grid.k-widget").closest("tr").prev();
        var allocGrid = allocRow.closest("div.k-grid.k-widget").data("kendoGrid");
        var allocData = allocGrid.dataItem(allocRow);
        if(allocData[field] == null || parseInt(input.val().replace(/\,/g, '')) > parseInt(allocData[field].replace(/\,/g, ''))){
            return false;
        }
    }catch (e) {
        console.log("Error in validateTotalWeightCube");
    }
    return true;

}

//method to add one allocation to show on UI
function appendAllocation(matchingLegs){
    for(var k=0; k < matchingLegs.length; k++){
        if((matchingLegs[k])['ALLOCS'] == undefined){
            (matchingLegs[k])['ALLOCS'] = [getAllocLegObj(matchingLegs[k],true)];
        }
    }
}

function initializeValidation() {
    var grid = $("#"+gridId).data("kendoGrid");
    grid.element.on("focusout", ".k-invalid", function () {
        var content = grid.content;
        if(content != null) {
            var height = grid.lockedContent ? grid.lockedContent.height() : grid.content.height();
            var cell = $(this).closest("td");
            var message = cell.find(".k-invalid-msg");
            if (message.length == 0) {
                return;
            }
            var callout = message.find(".k-callout");
            var top = message.position().top + callout.outerHeight() + message.outerHeight();
            var horizontalScrollBarHeight = grid.lockedContent ? 0 : (content[0].clientWidth < content[0].scrollWidth ? 17 : 0);
            height -= horizontalScrollBarHeight;
            if(top > height) {
                $(content).animate({
                    scrollTop: content.scrollTop() + top - height
                }, 500);
            }
        }
    });
}

function displayValidationForLastTwRow(e) {
    var currentGridId = e.container.closest('.k-grid')[0].id;
    var grid = e.container.closest('.k-grid').data('kendoGrid');
    if (currentGridId == gridId) {
        e.container.data("kendoValidator").bind("validate", function (e) {
            if (!e.valid) {
                var message = this.element.find(".k-invalid-msg");
                message.css("margin-top", -(message.outerHeight() +2) + "px");
                message.css("margin-left", "40px");
                message.find(".k-callout").hide();
                if ( $(this.element).find("input").attr("name") =='MV_NUM'
                    || $(this.element).find("input").attr("name")=='LEG_TYPE' || $(this.element).find("input").attr("name")=='EQUIP_TYPE') {
                    message.css("margin-left", "120px");
                }
            }
        });
    } else {
        if (grid.dataSource.data().length==1) {
            if (e.container.closest("tr").is(":last-child")) {
                e.container.data("kendoValidator").bind("validate", function (e) {
                    if (!e.valid) {
                        var message = this.element.find(".k-invalid-msg");
                        message.css("margin-top", -(message.outerHeight() +2) + "px");
                        message.css("margin-left", "40px");
                        message.find(".k-callout").hide();
                        if ( $(this.element).find("input").attr("name") =='DESTINATION'
                            || $(this.element).find("input").attr("name")=='ORIGIN' || $(this.element).find("input").attr("name")=='EQUIP_TYPE') {
                            message.css("margin-left", "80px");
                        }
                    }
                });
            }
        }else if(e.container.closest("tr").is(":last-child")) {
            e.container.data("kendoValidator").bind("validate", function (e) {
                if (!e.valid) {
                    var message = this.element.find(".k-invalid-msg");
                    message.css("margin-top", -(message.outerHeight() + message.prev().outerHeight()) + "px");
                    message.find(".k-callout").hide();
                    if ( $(this.element).find("input").attr("name") =='DESTINATION' || $(this.element).find("input").attr("name")=='ORIGIN'
                        ||  $(this.element).find("input").attr("name")=='EQUIP_TYPE') {
                        message.css("margin-left", "80px");
                    }
                }
            });
        } else if (grid.dataSource.data().length > 1) {
            e.container.data("kendoValidator").bind("validate", function (e) {
                if (!e.valid) {
                    var message = this.element.find(".k-invalid-msg");
                    if ( $(this.element).find("input").attr("name") =='DESTINATION' || $(this.element).find("input").attr("name")=='ORIGIN'
                        || $(this.element).find("input").attr("name")=='EQUIP_TYPE') {
                        message.css("margin-left", "80px");
                    }
                }
            });
        }
    }
}

function destroyGrid(gridId){
    if($('#'+gridId).data("kendoGrid")) {
        $('#'+gridId).data("kendoGrid").destroy();
        $('#'+gridId).empty();
    }
}

function checkboxRowTemplatehandler(model,grid_Id) {
    if(isValidRouteContextType(model)){
        if(model && model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
            if(parent.getResourceAccessType(parent.getRouteType(model.ROUTE_CONTEXT_CD)) == 2) {
                return "<img title='Undelete Route' style='cursor:pointer' src ='"+ICON_IMAGE_UNDELETE_ROUTE+"' onclick=undeleteRoute(this,'" + grid_Id + "') />";
            }
            return "<img title='Undelete Route' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_ADD_DISABLE+"' />";
        }
        if(parent.getResourceAccessType(parent.getRouteType(model.ROUTE_CONTEXT_CD)) == 2) {
            if ((parent.selectedWIPRouteList  && parent.selectedWIPRouteList.length ==1) || model.IS_CHECKED == "true" || model.IS_CHECKED == true) {
                return "<input class='k-route-checkbox' type='checkbox' checked onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
            } else {
                return "<input class='k-route-checkbox' type='checkbox' onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
            }
        }
    }
    return "<input class='k-route-checkbox' disabled type='checkbox'/><label></label>";
}

function undeleteRoute(undeleteBtn,grid_Id) {
    var currentTR = $(undeleteBtn).closest("tr");
    var gridData = $("#"+grid_Id).data("kendoGrid");
    var data = gridData.dataItem(currentTR);
    data.OPERATION_CD = parent.OPERATION_CD_MODIFY;
    data.CHANGE_FLAG = parent.OPERATION_CD_MODIFY;
    var legData = $.grep(parent.selectedWIPLegList, function(obj) {
        return obj["ROUTE_ID"] == data.ROUTE_ID;
    });
    for(var obj in legData) {
        legData[obj].OPERATION_CD = parent.OPERATION_CD_MODIFY;
        legData[obj].CHANGE_FLAG = parent.OPERATION_CD_MODIFY;
    }
    var timeReference = !isLocalTimeFlag() ? "Local" : "Zulu";
    parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService([data], legData, timeReference, onUnDeleteSaveUpdateServiceSuccess);
}

function checkboxRowHandler(checkBox,grid_Id){
    var currentTR = $(checkBox).closest("tr");
    var gridData = $(HASH_STRING+grid_Id).data("kendoGrid");
    var data = gridData.dataItem(currentTR);
    data.IS_CHECKED = $(checkBox).prop("checked");
    if (data.DSTPARENT_ROUTE_ID != null) {
        var masterRows = gridData.tbody.find("tr.k-master-row");
        for(var i=0; i < masterRows.length;i++){
            var dataItem = gridData.dataItem(masterRows[i]);
            if (dataItem != undefined && dataItem.DSTPARENT_ROUTE_ID != undefined && (dataItem.DSTPARENT_ROUTE_ID == data.DSTPARENT_ROUTE_ID)) {
                if ($(checkBox).prop("checked")) {
                    masterRows[i].childNodes[1].childNodes[0].checked =true;
                } else {
                    masterRows[i].childNodes[1].childNodes[0].checked =false;
                }
            }
        }
    }
    enableDisableSaveNDeteleBtn();
}

function tempRouteCheckboxRowTemplatehandler(model,grid_Id) {
    return "<input type='checkbox' class='k-temp-route' onclick=tempRouteCheckboxRowHandler(this,'"+grid_Id+"') /><label></label>";
}

/*function duplicateRouteRadioRowTemplatehandler(data,grid_Id){
 return "<input type='radio' checked = 'checked' name='duplicateRoute' onclick=duplicateRouteRadioClickHandler(this,'"+grid_Id+"') /><label style='min-width: 20px;'></label>";
 }

 function duplicateRouteRadioClickHandler(checkBox,grid_Id){
 console.log("duplicateRouteRadioClickHandler");
 }*/
function tempRouteCheckboxRowHandler(checkBox,grid_Id){
    var currentTR = $(checkBox).closest("tr");
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var data = grid.dataItem(currentTR);
    if (menu == "TS" || menu == "TSS") {
        if ($(checkBox).prop("checked")) {
            if (data['ROUTE_TYPE_CD'] == "Linehaul" || data['ROUTE_TYPE_CD'] == "LineHaul") {
                setRouteTypeValue(grid,currentTR,'ax');
            } else if (data['ROUTE_TYPE_CD'] == "Shuttle"){
                setRouteTypeValue(grid,currentTR,'axa');
            }
        } else {
            if (data['ROUTE_TYPE_CD'] == "Linehaul" || data['ROUTE_TYPE_CD'] == "LineHaul") {
                setRouteTypeValue(grid,currentTR,'aa');
            } else if (data['ROUTE_TYPE_CD'] == "Shuttle"){
                setRouteTypeValue(grid,currentTR,'aaa');
            }
        }
    }
}


function revisionCommentButtonRowHandler(button, grid_id) {
    var currentTR = $(button).closest("tr");
    var gridData = $(HASH_STRING+grid_id).data("kendoGrid");
    gridData.expandRow(currentTR);
    setDashboardTitle(button,grid_id,parent.DASHBOARD_ID_REVISION_COMMENTS);
    parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(gridData.dataItem(currentTR),grid_id,dashboardID,button,null,null,null,parent.OPERATION_FROM_MATRIX);
    parent.openDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS,true);
}

function internalCommentButtonRowHandler(button, grid_id) {
    var currentTR = $(button).closest("tr");
    var gridData = $(HASH_STRING+grid_id).data("kendoGrid");
    var routeData = gridData.dataItem(currentTR);
    gridData.expandRow(currentTR);
    routeData.COMMENT = true;
    setDashboardTitle(button,grid_id,parent.DASHBOARD_ID_INTERNAL_COMMENTS);
    parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(routeData,grid_id,dashboardID,button,null,null,null,parent.OPERATION_FROM_MATRIX);
    parent.openDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS,true);
}

function setDashboardTitle(object, grid_id, dashboardId) {
    var currentTR = $(object).closest("tr");
    var gridData = $(HASH_STRING+grid_id).data("kendoGrid");
    //var legData = gridData.dataItem(currentTR);
    var routeData = gridData.dataItem(currentTR);
    if (parent.currentSelectedRouteComment != null && parent.currentSelectedRouteComment ["ROUTE_ID"] != routeData["ROUTE_ID"]) {
        if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS) != undefined) {
            parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS);
        }
        if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS) != undefined) {
            parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS);
        }

    }
//	parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(routeData,grid_id,dashboardID,object,null,null,null,parent.OPERATION_FROM_MATRIX);
    /*parent.currentSelectedRouteComment = routeData;
     parent.selectedDetails= new Object();
     parent.selectedDetails.selectedCheckBox = object;
     parent.selectedDetails.grid_id = grid_id;
     parent.selectedDetails.parentGridId = gridId;
     parent.selectedDetails.dashboardID = dashboardID;*/

    /*var currentCase = parent.getSelectedCase();

     var dashboardTitle="Comments - Plan: " + currentCase.commonCaseDesc + " "
     + "Schedule: Master"+" "+ "Route: "+routeData.MV_NUM;
     if (dashboardId == parent.DASHBOARD_ID_REVISION_COMMENTS) {
     dashboardTitle = "Revision " + dashboardTitle;
     }
     parent.dashboardController.setDashboardTitle(dashboardId, dashboardTitle);*/
    parent.SkdGridHelper.getSkdGridManager().setDashBoardTitle(routeData,dashboardId);
}

function locationAllocationCheckboxRowHandler(checkbox, grid_id) {
    var currentTR = $(checkbox).closest("tr");
    var gridData = $(HASH_STRING+grid_id).data("kendoGrid");
    var data =  gridData.dataItem(currentTR);
    if ($(checkbox).prop('checked')){
        currentTR.find('.k-hierarchy-cell a').css({ opacity: 1.0, cursor: 'default' });
        currentTR.find('.k-hierarchy-cell a')[0].className = 'k-icon k-plus';
        currentTR.find('.k-hierarchy-cell a').click();
    }else{
        currentTR.find('.k-hierarchy-cell a').css({ opacity: 0.0, cursor: 'default' });
        currentTR.find('.k-hierarchy-cell a')[0].className = 'k-icon k-minus';
        currentTR.find('.k-hierarchy-cell a').click();
        currentTR.find('.k-hierarchy-cell a')[0].className = 'k-icon';
    }
}

function manTimedCheckboxRowTemplatehandler(model,grid_Id) {
    if(model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
        return "<input type='checkbox' disabled class='k-manually-timed'/><label></label>";
    }else if(model.ROUTE_CONTEXT_CD == ROUTE_CONTEXT_CODES.FLT_CLH || model.ROUTE_CONTEXT_CD ==  ROUTE_CONTEXT_CODES.TRK_GNP || model.ROUTE_CONTEXT_CD == ROUTE_CONTEXT_CODES.TRK_GBT ||
        model.ROUTE_CONTEXT_CD == ROUTE_CONTEXT_CODES.TRK_SLH || model.ROUTE_CONTEXT_CD ==  ROUTE_CONTEXT_CODES.TRK_SSH) {
        if(model.USE_LEG_MINS_FLAG == "True") {
            return "<input type='checkbox' checked class='k-manually-timed' onclick=manTimedCheckboxRowHandler(this,'"+grid_Id+"') data-bind='checked: USE_LEG_MINS_FLAG'/><label></label>";
        }
        return "<input type='checkbox' class='k-manually-timed' onclick=manTimedCheckboxRowHandler(this,'"+grid_Id+"') data-bind='checked: USE_LEG_MINS_FLAG' /><label></label>";
    }
    return "<input type='checkbox' disabled class='k-manually-timed' onclick=manTimedCheckboxRowHandler(this,'"+grid_Id+"') data-bind='checked: USE_LEG_MINS_FLAG'/><label></label>";
}

function manTimedCheckboxRowHandler(checkBox,grid_Id){
    var currentTR = $(checkBox).closest("tr");
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var data = grid.dataItem(currentTR);
    grid.expandRow(currentTR);
    if($(checkBox).prop("checked") == false) {
        data.USE_LEG_MINS_FLAG = "False";
    }
    parent.SkdGridHelper.getSkdGridManager().changeCaseToUpperCase($(checkBox));
    var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid($(checkBox));
    if(isValid && $(checkBox).prop("checked") == false && !isNull(data["ANCHOR_LEG_TM_CD"])) {
        parent.SkdGridHelper.getSkdGridManager().updateFirstLegGridDataSourceFromRoute($(checkBox),"div.k-legs-grid");
        var legsGrid = $(checkBox).closest("tr").next().find("div.k-legs-grid").data("kendoGrid");
        legsData = legsGrid.dataSource.data();
        var isRouteEditor = gridId == "routeMatrixGrid" ? true : false;
        parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(data.toJSON(), legsData.toJSON(), onDefaultsServiceSuccess, !isLocalTimeFlag(), isRouteEditor, undefined,false);
    }
}

function addRowTemplate(model,grid_Id,isAllocation) {
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var datasource = grid.dataSource;
    var titleStr = "Add a Leg";
    if(grid_Id.indexOf("loc_allocationGrid") >= 0){
        titleStr = "Add a Loc Allocation";
    }else if(grid_Id.indexOf("allocationGrid") >= 0){
        titleStr = "Add a Allocation";
    }
    if(model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
        return "<img src ='"+ICON_IMAGE_PATH_ADD_DISABLE+"'/>";
    }
    if(!isNull(isAllocation) && isAllocation == "true"){
        return "<img title='"+titleStr+"' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_ADD+"' onclick=addRowHandler(this,'" + grid_Id + "','" + isAllocation + "') />";
    }else{
        if((datasource.view()).indexOf(model) == (datasource.view().length - 1)){
            return "<img title='"+titleStr+"' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_ADD+"' onclick=addRowHandler(this,'" + grid_Id + "') />";
        }
        return "<img src ='"+ICON_IMAGE_PATH_ADD_DISABLE+"'/>";
    }
}

function deleteRowtemplate(model, grid_Id,isAllocation) {
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var datasource = grid.dataSource;
    var titleStr = "Delete a Leg";
    if(grid_Id.indexOf("loc_allocationGrid") >= 0){
        titleStr = "Delete a Loc Allocation";
    }else if(grid_Id.indexOf("allocationGrid") >= 0){
        titleStr = "Delete a Allocation";
    }
    if(model.CHANGE_FLAG == parent.OPERATION_CD_DELETE) {
        return "<img src ='"+ICON_IMAGE_PATH_CLOSE_DISABLE+"' />";
    }
    if((!isNull(isAllocation) && isAllocation == "true") || grid_Id.indexOf("loc_allocationGrid") >= 0){
        /*var allocPerLeg = {};
         for(var i=0; i<datasource.view().length; i++) {
         if(allocPerLeg[datasource.view()[i]["LEG_ID"]] != null) {
         allocPerLeg[datasource.view()[i]["LEG_ID"]] = allocPerLeg[datasource.view()[i]["LEG_ID"]] + 1;
         }else {
         allocPerLeg[datasource.view()[i]["LEG_ID"]] = 1;
         }
         }
         if(allocPerLeg[model.LEG_ID] > 1) {
         return "<img title='"+titleStr+"' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_CLOSE+"' onclick=deleteRowHandler(this,'" + grid_Id + "','" + isAllocation + "') />";
         }else {
         return EMPTY_STRING;
         }*/
        return "<img title='"+titleStr+"' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_CLOSE+"' onclick=deleteRowHandler(this,'" + grid_Id + "','" + isAllocation + "') />";
    }else{
        if(datasource.view().length == 1) {
            return "<img src ='"+ICON_IMAGE_PATH_CLOSE_DISABLE+"' />";
        }
        return "<img title='"+titleStr+"' style='cursor:pointer' src ='"+ICON_IMAGE_PATH_CLOSE+"' onclick=deleteRowHandler(this,'" + grid_Id + "') />";
    }
}

function deleteRouteRowtemplate(model, grid_Id, dashboardID,deleteAll) {
    var tooltip = "Remove All Routes";
    if(!deleteAll){
        tooltip = "Remove From WIP";
    }
    return "<img title='"+tooltip+"' style='cursor:pointer' src ='"+ICON_IMAGE_CLOSE_WINDOW+"' onclick=removeRouteFromWIPOnly(this,'" + grid_Id + "','" + deleteAll + "') />";
}


function removeRouteFromWIPOnly(deleteBtn,grid_Id,deleteAll) {
    var currentTR = $(deleteBtn).closest("tr");
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var tempData;
    if(deleteAll == 'undefined'){
        tempData = grid.dataItem(currentTR);
        if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) > -1) {
            var index = expandedRoutes.indexOf(tempData["ROUTE_ID"]);
            expandedRoutes.splice(index, 1);
        }
        grid.removeRow(currentTR);
    }else{
        var ds = grid.dataSource;
        var dsView = ds.view();
        for ( var i = 0; i < dsView.length; i++) {
            tempData = dsView[i];
            if(expandedRoutes && expandedRoutes.indexOf(tempData["ROUTE_ID"]) > -1) {
                var index = expandedRoutes.indexOf(tempData["ROUTE_ID"]);
                expandedRoutes.splice(index, 1);
            }
            ds.remove(tempData);
        }
    }
    updateSelectedRouteNLegList();
    /*if (parent.selectedWIPRouteList.length==0) {//FDX-1140
     closeWIPWindow(null);
     }*/
}

function deleteRowHandler(deleteBtn,grid_Id,isAllocation) {
    var currentTR = $(deleteBtn).closest("tr");
    var rowIndex = currentTR.index();
    if(isAllocation == "true") {
        var masterRows = $(HASH_STRING+grid_Id).find("tr.k-master-row");
        rowIndex = masterRows.index(currentTR);
    }
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var data = grid.dataItem(currentTR);
    if(grid_Id.indexOf("legsGrid") == 0 && data.OPERATION_CD != parent.OPERATION_CD_ADD) {
        showConfirmation(null, "legRow", deleteBtn, grid_Id);
    }else {
        if(grid_Id.indexOf("legsGrid") == 0) {
            setAnchorLeg(currentTR);
        }
        if(isAllocation == "true" || grid_Id.indexOf("loc_allocationGrid") == 0) {
            var datasource = grid.dataSource;
            var allocPerLeg = {};
            for(var i=0; i<datasource.view().length; i++) {
                if(allocPerLeg[datasource.view()[i]["LEG_ID"]] != null) {
                    allocPerLeg[datasource.view()[i]["LEG_ID"]] = allocPerLeg[datasource.view()[i]["LEG_ID"]] + 1;
                }else {
                    allocPerLeg[datasource.view()[i]["LEG_ID"]] = 1;
                }
            }
        }
        if(data.OPERATION_CD == parent.OPERATION_CD_ADD) {
            grid.removeRow(currentTR);
        }else if(grid_Id.indexOf("loc_allocationGrid") == 0){
            data.OPERATION_CD = parent.OPERATION_CD_DELETE;
            allocationDeleteHandler(deleteBtn,grid_Id,isAllocation,data,currentTR);
        }else {
            data.OPERATION_CD = parent.OPERATION_CD_DELETE;
            allocationDeleteHandler(deleteBtn,grid_Id,isAllocation,data,currentTR);
        }
        if((isAllocation == "true" || grid_Id.indexOf("loc_allocationGrid") == 0) && allocPerLeg && allocPerLeg[data.LEG_ID] <= 1) {
            data['ALLOC_IDX'] = rowIndex;
            addRowHandler(deleteBtn,grid_Id,isAllocation, null, data);
        }
        if(!isAllocation && !(grid_Id.indexOf("loc_allocationGrid") == 0)){
            updateLegGridDataSource("MV_NUM_SEQ", grid_Id, parent.OPERATION_CD_DELETE, null, isAllocation);
        }
        parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
    }
}

function deleteLegFromSchedule(event) {
    var grid_Id = event.currentTarget.grid_Id;
    var deleteBtn = event.currentTarget.deleteBtn;
    var currentTR = $(deleteBtn).closest("tr");
    var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    var data = grid.dataItem(currentTR);
    setAnchorLeg(currentTR);
    allocationDeleteHandler(deleteBtn,grid_Id,false,data,currentTR);
    if(data.OPERATION_CD == parent.OPERATION_CD_ADD) {
        grid.removeRow(currentTR);
    }else {
        data.OPERATION_CD = parent.OPERATION_CD_DELETE;
    }
    updateLegGridDataSource("MV_NUM_SEQ", grid_Id, parent.OPERATION_CD_DELETE, null, false);
    parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
}

function setAnchorLeg(currentTR) {
    var routeRow = currentTR.closest("tr.k-detail-row").prev();
    var routeGrid = routeRow.closest("div.k-grid.k-widget").data("kendoGrid");
    if(routeGrid != null) {
        var routeData = routeGrid.dataItem(routeRow);
        var legGrid = currentTR.closest("div.k-grid.k-widget").data("kendoGrid");
        var legData = legGrid.dataSource.data();
        if(routeData && routeData["ANCHOR_LEG_SEQ"] == currentTR.index()) {
            if(currentTR.next() && currentTR.next().length > 0) {
                routeData["ANCHOR_LEG_ID"] = legGrid.dataItem(currentTR.next())["LEG_ID"];
            }else {
                routeData["ANCHOR_LEG_ID"] = legGrid.dataItem(currentTR.parent().children("tr:first"))["LEG_ID"];
            }
        }
    }
}

function allocationDeleteHandler(deleteBtn, grid_Id, isAllocation, data, currentTR) {
    var allocIndex;
    var allocDS;
    try {
        if(!isAllocation){
            allocIndex = "#loc_allocationGrid_" + data['ALLOC_ID'];
        }else{
            allocIndex = "#allocationGrid_" + data['ROUTE_ID'];
        }
        if ($(allocIndex)[0] != undefined) {
            allocDS = $(allocIndex).data("kendoGrid").dataSource;
            allocDatasource = allocDS.view();
            var rowIdx = $("tr", $(allocIndex).data("kendoGrid").tbody).index(
                currentTR);
            for ( var i = 0; i < allocDatasource.length; i++) {
                if (data["LEG_ID"] == allocDatasource[i]["LEG_ID"]
                    && !allocDatasource[i]['isLeg']
                    && allocDatasource[i]['ALLOC_IDX'] == rowIdx) {
                    allocDatasource[i]["OPERATION_CD"] = parent.OPERATION_CD_DELETE;
                } else if (data["LEG_ID"] == allocDatasource[i]["LEG_ID"]
                    && (!isAllocation && !(grid_Id.indexOf("loc_allocationGrid") == 0))) {
                    allocDatasource[i]["OPERATION_CD"] = parent.OPERATION_CD_DELETE;
                }
            }
            if (allocDS != undefined){
                if(!isAllocation){
                    validateLocAllocationData(allocDS, allocIndex);
                }else{
                    validateAllocationData(grid_Id, parent.OPERATION_CD_DELETE,
                        data, allocDS, allocIndex, "MV_NUM_SEQ");
                }
            }
        }
    } catch (e) {
        console.log("Error while allocationDeleteHandler");
    }
}

function getRowIndexByView(_view, row){
    if(_view != undefined ){
        for(var i=0 ; i< _view.length; i++){
            if(_view[i].uid == row.uid){
                return i;
            }
        }
    }
}

function isDuplicateRow(){
    return (typeof isDuplicateRoute != 'undefined' && isDuplicateRoute != undefined && isDuplicateRoute == true);
}

function addRowHandler(addBtn,grid_Id,isAllocation,isPrevious, dataRow) {
    try {
        var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
        var datasource = grid.dataSource;
        var row = $(addBtn).closest("tr");
        var routeRow = row.closest("tr.k-detail-row").prev();
        var routeGrid = routeRow.closest("div.k-grid.k-widget").data("kendoGrid");
        var routeData = {};
        if(routeRow && routeGrid) {
            routeData = routeGrid.dataItem(routeRow);
        }
        var dataItem = {};
        if(dataRow != null) {
            dataItem = jQuery.extend(true, {}, dataRow);
        }else {
            dataItem = jQuery.extend(true, {}, grid.dataItem(row));
        }
        var rowIdx;
        if(!isPrevious){
            rowIdx = getRowIndex(datasource, dataItem) +1;//(datasource.indexOf(dataItem)) + 1;
        }else{
            rowIdx = getRowIndex(datasource, dataItem); //(datasource.indexOf(dataItem));
        }
        if((isAllocation =="true" || grid_Id.indexOf("loc_allocation") == 0) && dataRow != null && getRowIndex(datasource, dataItem) == null) {
            rowIdx = dataRow['ALLOC_IDX'];
        }
        tempGrid_Id = grid_Id;
        if(isAllocation =="true"){
            dataItem.isLeg = false;
            dataItem['ALLOC_IDX'] = rowIdx;
            datasource.insert(rowIdx, getAllocLegObj(dataItem,false));
        }else if(grid_Id.indexOf("loc_allocation") == 0){
            dataItem['ALLOC_IDX'] = rowIdx + 1;
            datasource.insert(rowIdx + 1, getLocAllocLegObj(dataItem));
        }else{
            if (routeData["OPERATION_CD"]== parent.OPERATION_CD_ADD && datasource.data().length==9) {
                parent.showErrorMsg("A route can only have up to 9 legs");
                return;
            }
            var viewRowIdx;
            if(!isPrevious){
                viewRowIdx = getRowIndexByView(datasource.view(), dataItem) +1;//(datasource.indexOf(dataItem)) + 1;
            }else{
                viewRowIdx = getRowIndexByView(datasource.view(), dataItem); //(datasource.indexOf(dataItem));
            }
            datasource.insert(rowIdx, getLegObj());
            updateLegGridDataSource("MV_NUM_SEQ", grid_Id, parent.OPERATION_CD_ADD, addBtn,isAllocation,viewRowIdx,isPrevious);
            parent.SkdGridHelper.getSkdGridManager().showAnchorTimeFlag(gridId, dashboardID);
        }
        //fade-in effect for the rows[1123,1124,1067]
        kendo.fx($(HASH_STRING+tempGrid_Id +' tr').eq(rowIdx + 1)).fade("in").duration(1500).play();
    }catch (e) {
        console.log("Error while addRowHandler");
    }
}



function scrollToSelectedRow(grid) {
    grid.element.find(".k-grid-content").animate({
        scrollTop: grid.tbody.height()
    }, 1);
}
function validateAllocationData(legGridId, operation, data, allocDS, allocIndex, type){
    var kendoDatasource;
    var datasource;
    if(operation == parent.OPERATION_CD_DELETE ){//delete operation
        allocDS.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
        datasource = allocDS.view();
        var j = 0;
        for(var i=0; i <datasource.length; i++){
            if (datasource[i]["OPERATION_CD"] != parent.OPERATION_CD_DELETE && type == "MV_NUM_SEQ") {
                if(datasource[i]["isLeg"]){
                    j = j+1;
                    if(datasource[j] != null) {
                        datasource[j]["ORIGIN"] = datasource[i]["DESTINATION"];
                    }
                }else{
                    datasource[i]["ORIGIN"] = datasource[i-1]["ORIGIN"];
                    datasource[i]["DESTINATION"] = datasource[i-1]["DESTINATION"];
                }
                datasource[i]["MV_NUM_SEQ"] = j ;

                if(i == datasource.length - 1 && operation == parent.OPERATION_CD_ADD) {
                    datasource[i]["ROUTE_ID"] = datasource[i-1]["ROUTE_ID"];
                    datasource[i]["MV_NUM"] = datasource[i-1]["MV_NUM"];
                    datasource[i]["LEG_TYPE"] = datasource[i-1]["LEG_TYPE"];
                    datasource[i]["EQUIP_TYPE"] = datasource[i-1]["EQUIP_TYPE"];
                    datasource[i]["ORIGIN"] = datasource[i-1]["DESTINATION"];
                    datasource[i]["MODE"] = datasource[i-1]["MODE"];
                }
            } else if (type == "MV_NUM") {
                datasource[i]["MV_NUM"] = datasource[i]["MV_NUM"];
            }
        }
    }else{//add operation
        kendoDatasource = $('#'+legGridId).data("kendoGrid").dataSource;
        datasource = kendoDatasource.view();
        var allocKDs = $(allocIndex).data("kendoGrid").dataSource;
        var allocDs = allocKDs.view();
        allocDs.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
        datasource = allocDs.view();

        var isOldObj = false;
        for(var i=0; i < datasource.length; i++){
            for(var j=0; j < allocDs.length; j++){
                if(datasource[i]["LEG_ID"] == allocDs[j]["LEG_ID"]){
                    isOldObj = true;
                    allocDs[j]["MV_NUM_SEQ"] = datasource[i]["MV_NUM_SEQ"];
                    allocDs[j]["ORIGIN"] = datasource[i]["ORIGIN"];
                    allocDs[j]["DESTINATION"] = datasource[i]["DESTINATION"];
                    allocDs[j]["FULL_EFFDAY_HOLIDAY_L"] = datasource[i]["FULL_EFFDAY_HOLIDAY_L"];
                    allocDs[j]["FULL_EFFDAY_HOLIDAY_Z"] = datasource[i]["FULL_EFFDAY_HOLIDAY_Z"];
                    allocDs[j]["EQUIP_TYPE"] = datasource[i]["EQUIP_TYPE"];
                    break;
                }else{
                    isOldObj = false;
                }
            }
            if(!isOldObj){
                allocKDs.insert(allocDs.length +1, datasource[i]);
            }
        }
        $(allocIndex).data("kendoGrid").refresh();
    }

    //add operation
    kendoDatasource = $('#'+legGridId).data("kendoGrid").dataSource;
    datasource = kendoDatasource.view();
    var allocKDs = $(allocIndex).data("kendoGrid").dataSource;
    allocKDs.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
    var allocDs = allocKDs.view();
    for(var i=0; i < datasource.length; i++){
        for(var j=0; j < allocDs.length; j++){
            if(datasource[i]["LEG_ID"] == allocDs[j]["LEG_ID"]){
                allocDs[j]["MV_NUM_SEQ"] = datasource[i]["MV_NUM_SEQ"];
                allocDs[j]["ORIGIN"] = datasource[i]["ORIGIN"];
                allocDs[j]["DESTINATION"] = datasource[i]["DESTINATION"];
                allocDs[j]["FULL_EFFDAY_HOLIDAY_L"] = datasource[i]["FULL_EFFDAY_HOLIDAY_L"];
                allocDs[j]["FULL_EFFDAY_HOLIDAY_Z"] = datasource[i]["FULL_EFFDAY_HOLIDAY_Z"];
                allocDs[j]["EQUIP_TYPE"] = datasource[i]["EQUIP_TYPE"];
            }
        }
    }
    $('#'+legGridId).data("kendoGrid").refresh();
    $(allocIndex).data("kendoGrid").refresh();
}
function validateLocAllocationData(allocDS, allocIndex){
    allocDS.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
    $(allocIndex).data("kendoGrid").refresh();
}
function updateLegGridDataSource(type, legGridId, operation, addBtn, isAllocation,rowIdx,isPrevious){
    var routeRow = $('#'+legGridId).closest("tr.k-detail-row").prev();
    var routeGrid = routeRow.closest("div.k-grid.k-widget").data("kendoGrid");
    var routeData = routeGrid.dataItem(routeRow);

    var kendoDatasource = $('#'+legGridId).data("kendoGrid").dataSource;
    var datasource = kendoDatasource.view();
    var j = 0;
    kendoDatasource.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
    datasource = kendoDatasource.view();
    for(var i=0; i <datasource.length; i++){
        if (datasource[i]["OPERATION_CD"] != parent.OPERATION_CD_DELETE && type == "MV_NUM_SEQ") {
            j = j+1;
            datasource[i]["MV_NUM_SEQ"] = j ;
            if(!isPrevious){
                if(datasource[j] != null) {
                    datasource[j]["ORIGIN"] = datasource[i]["DESTINATION"];
                }
                if(i == rowIdx && operation == parent.OPERATION_CD_ADD) {
                    datasource[i]["ROUTE_ID"] = datasource[i-1]["ROUTE_ID"];
                    datasource[i]["MV_NUM"] = datasource[i-1]["MV_NUM"];
                    datasource[i]["LEG_TYPE"] = datasource[i-1]["LEG_TYPE"];
                    datasource[i]["EQUIP_TYPE"] = datasource[i-1]["EQUIP_TYPE"];
                    datasource[i]["ORIGIN"] = datasource[i-1]["DESTINATION"];
                    datasource[i]["MODE"] = datasource[i-1]["MODE"];
                }
            }else{
                if(datasource[i] != undefined && datasource[i+1] != undefined) {
                    datasource[i]["DESTINATION"] = datasource[i+1]["ORIGIN"];
                }
                if(i == rowIdx && operation == parent.OPERATION_CD_ADD) {
                    datasource[i]["ROUTE_ID"] = datasource[i+1]["ROUTE_ID"];
                    datasource[i]["MV_NUM"] = datasource[i+1]["MV_NUM"];
                    datasource[i]["LEG_TYPE"] = datasource[i+1]["LEG_TYPE"];
                    datasource[i]["EQUIP_TYPE"] = datasource[i+1]["EQUIP_TYPE"];
                    datasource[i]["DESTINATION"] = datasource[i+1]["ORIGIN"];
                    datasource[i]["MODE"] = datasource[i+1]["MODE"];
                }
            }

        } else if (type == "MV_NUM") {
            datasource[i]["MV_NUM"] = datasource[i]["MV_NUM"];
        }
    }
    maintainAnchorLeg(routeData, kendoDatasource.view());
    updateSelectedRouteNLegList();
    //kendoDatasource.filter( { field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE });
    if(operation == parent.OPERATION_CD_ADD) {
        getDataNCallDefaultValueService(legGridId);
    }else if(operation == parent.OPERATION_CD_DELETE) {
        getDataNCallTimeNCostService(legGridId);
    }
    $('#'+legGridId).data("kendoGrid").refresh();
}

function getDataNCallDefaultValueService(grid_Id) {
    var legData = $("#"+grid_Id).data("kendoGrid").dataSource.data().toJSON();
    var routeData = $("#"+gridId).data("kendoGrid").dataItem($("#"+grid_Id).closest("tr").prev()).toJSON();
    bindAllocationsToLegsData([routeData],legData);
    parent.SkdMxServiceHelper.getDefaultServiceManager().callDefautValuesService([routeData], legData,onDefaultsServiceSuccess);
}

function bindAllocationsToLegsData(routeData,legData){
    var allocIndex;
    var allocDs;
    var allocMap = {};
    for(var p = 0; p < routeData.length; p++) {
        allocIndex = (routeData[p] != undefined ? routeData[p]['ROUTE_ID']:EMPTY_STRING);
        if( $('#'+("allocationGrid_" + allocIndex))[0] != undefined){
            allocDs = $('#'+("allocationGrid_" + allocIndex)).data("kendoGrid").dataSource.data().toJSON();
            for(var j=0; j < allocDs.length; j++){
                if(validateAllocation(allocDs[j])){
                    if(isNull(allocMap[allocDs[j]["LEG_ID"]])){
                        allocMap[allocDs[j]["LEG_ID"]] = [allocDs[j]];
                    }else{
                        (allocMap[allocDs[j]["LEG_ID"]]).push(allocDs[j]);
                    }
                }
            }
        }
    }
    for(var i=0; i < legData.length; i++){
        var keys = Object.keys(allocMap);
        if(keys != null) {
            for(var j=0; j < keys.length; j++){
                if(keys[j] == legData[i]["LEG_ID"]) {
                    (legData[i]).ALLOCS = allocMap[keys[j]];
                    bindLocAllocationsToLegsData((legData[i]).ALLOCS);
                }
            }
        }
    }
}
function bindLocAllocationsToLegsData(allocData){
//	var allocIndex = grid_Id.substring(grid_Id.indexOf("_")+1,grid_Id.length);
    var allocDs = null;
    var ramdomId;
    for(var p=0; p < allocData.length; p++){
        ramdomId = "#loc_allocationGrid_" + allocData[p]["ALLOC_ID"];
        if($(ramdomId)[0] != undefined){
            allocDs = $(ramdomId).data("kendoGrid").dataSource.data().toJSON();
            if(allocDs != undefined){
                var allocLocMap = {};
                for(var j=0; j < allocDs.length; j++){
                    if(validateLocAllocation(allocDs[j])){
                        if(isNull(allocLocMap[allocDs[j]["ALLOC_ID"]])){
                            allocLocMap[allocDs[j]["ALLOC_ID"]] = [allocDs[j]];
                        }else{
                            (allocLocMap[allocDs[j]["ALLOC_ID"]]).push(allocDs[j]);
                        }
                    }
                }
                for(var i=0; i < allocData.length; i++){
                    var keys = Object.keys(allocLocMap);
                    if(keys != null) {
                        for(var j=0; j < keys.length; j++){
                            if(keys[j] == allocData[i]["ALLOC_ID"]) {
                                (allocData[i]).LOC_ALLOCS = allocLocMap[keys[j]];
                            }
                        }
                    }
                }
            }
        }
    }
}
function validateLocAllocation(allocObj){
    if(isNull(allocObj["ALLOC_WEIGHT"]) || isNull(allocObj["ALLOC_CUBE"])){
        return false;
    }
    return true;
}
function validateAllocation(allocObj){
    if(isNull(allocObj["PROD_GRP_NM"]) || isNull(allocObj["ALLOC_WEIGHT"]) || isNull(allocObj["ALLOC_CUBE"]))
        return false;
    if(!isNull(allocObj["ALLOCATION_EFF_L"]) || !isNull(allocObj["ALLOCATION_EFF_Z"]))
        return true;
}
function getDataNCallTimeNCostService(grid_Id) {
    var legData = $("#"+grid_Id).data("kendoGrid").dataSource.data().toJSON();
    var routeData = $("#"+gridId).data("kendoGrid").dataItem($("#"+grid_Id).closest("tr").prev()).toJSON();
    bindAllocationsToLegsData([routeData],legData);
    var isRouteEditor = gridId == "routeMatrixGrid" ? true : false;
    parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData, legData, onDefaultsServiceSuccess, !isLocalTimeFlag(), isRouteEditor);
}

function showLocalZuluColumns(toggleBtn) {
    showColumns(getLocalColumns(), toggleBtn.toggled);
    showColumns(getZuluColumns(), !toggleBtn.toggled);
    parent.toggleTimeView(toggleBtn);
}

function showColumns(columnsArray, isShow) {
    if (columnsArray) {
        var legsGrid =  $("#"+gridId).find("div.k-legs-grid");
        for(var j =0;j<legsGrid.length;j++) {
            var grid = $(legsGrid[j]).data("kendoGrid");
            if(grid != null) {
                for (var i=0; i<columnsArray.length; i++) {
                    if (isShow) {
                        if (showWIPColumn(grid,columnsArray[i])) {
                            grid.hideColumn(columnsArray[i]);
                        } else {
                            grid.showColumn(columnsArray[i]);
                        }
                    } else {
                        if (showWIPColumn(grid,columnsArray[i])) {
                            grid.hideColumn(columnsArray[i]);
                        } else {
                            grid.hideColumn(columnsArray[i]);
                        }
                    }
                }
            }
        }
        var seasonsGrid =  $("#"+gridId).find("div.k-seasons-grid");
        for(var j =0;j<seasonsGrid.length;j++) {
            var grid = $(seasonsGrid[j]).data("kendoGrid");
            if(grid != null) {
                for (var i=0; i<columnsArray.length; i++) {
                    if (isShow) {
                        grid.showColumn(columnsArray[i]);
                    } else {
                        grid.hideColumn(columnsArray[i]);
                    }
                }
            }
        }
        var allocationGrid =  $("#"+gridId).find("div.k-allocation-grid");
        for(var j =0;j<allocationGrid.length;j++) {
            var grid = $(allocationGrid[j]).data("kendoGrid");
            if(grid != null) {
                for (var i=0; i<columnsArray.length; i++) {
                    if (isShow) {
                        grid.showColumn(columnsArray[i]);
                    } else {
                        grid.hideColumn(columnsArray[i]);
                    }
                }
            }
        }
        var locAllocationGrid =  $("#"+gridId).find("div.k-locAllocation-grid");
        for(var j =0;j<locAllocationGrid.length;j++) {
            var grid = $(locAllocationGrid[j]).data("kendoGrid");
            if(grid != null) {
                for (var i=0; i<columnsArray.length; i++) {
                    if (isShow) {
                        grid.showColumn(columnsArray[i]);
                    } else {
                        grid.hideColumn(columnsArray[i]);
                    }
                }
            }
        }
        var routeGrid = $("#"+gridId).data("kendoGrid");
        if (isShow) {
            routeGrid.showColumn(columnsArray[1]);
            routeGrid.showColumn(columnsArray[2]);
        } else {
            routeGrid.hideColumn(columnsArray[1]);
            routeGrid.hideColumn(columnsArray[2]);
        }
    }
}

function showWIPColumn(grid,columnName) {
    if (gridId == "routeMatrixWIPGrid") {
        if (grid.dataSource.data()[0].MODE == "Truck") {
            if (columnName == "B_OFFTIME_L" || columnName == "LANDING_TIME_L" || columnName == "LANDING_TIME_Z" ||columnName == "B_OFFTIME_Z") {
                return true;
            }
        }
    }
    return false;
}
function routeGridEditHandler(e) {
    var input = e.container.find("input.k-input");
    input.select();
    parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().validateDataFromValidationService(input);
    input.keyup(function(e) {
        if(e.keyCode !=  9){
            enableDisableSaveBtnsFromRoute($(this));
        }
    });
    input.blur(function (e) {
        parent.SkdGridHelper.getSkdGridManager().changeCaseToUpperCase($(this));
        updateMVNoForLegs($(this),"div.k-legs-grid");
        var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid($(this));
        enableDisableSaveBtns();
        if(isValid) {
            parent.SkdGridHelper.getSkdGridManager().updateFirstLegGridDataSourceFromRoute($(this),"div.k-legs-grid");
            callTimeNCostFromRoute($(this));
        }else {
        }
    });
}
function updateMVNoForLegs(that,grid_Id){
    if(that.attr('data-bind').indexOf('value:MV_NUM') > -1
        && parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().isNotEmptyOrNull(that.val())) {
        var legsGrid = that.closest("tr").next().find(grid_Id).data("kendoGrid");
        if(legsGrid != null) {
            var gridData = legsGrid.dataSource.view();
            if(gridData && gridData.length > 0) {
                for (var i = 0; i< gridData.length;i++) {
                    gridData[i].MV_NUM = that.val();
                }
            }
            updateSelectedRouteNLegList();
        }
    }
}

function legGridEditHandler(e) {
    var input = e.container.find("input.k-input");
    input.select();
    parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().validateDataFromValidationService(input);
    input.keyup(function(e) {
        if(e.keyCode !=  9){
            enableDisableSaveBtnsFromLeg($(this));
        }
    });
    input.blur(function (e) {
        parent.SkdGridHelper.getSkdGridManager().changeCaseToUpperCase($(this));
        var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid($(this));
        var isTimeValid = checkIsTimeDataValid($(this));
        enableDisableSaveBtns();
        if(isValid && isTimeValid) {
            var routeData = $("#"+gridId).data("kendoGrid").dataItem($(this).closest("tr.k-detail-row").prev());
            parent.SkdGridHelper.getSkdGridManager().updateOriginNDestinationOnBlur($(this), "div.k-legs-grid");
            parent.SkdGridHelper.getSkdGridManager().updateLegGridDataSourceFromLeg($(this), "div.k-legs-grid", routeData);
            parent.SkdGridHelper.getSkdGridManager().updateRouteFromFirstLegGridDataSource($(this),routeData);
            callTimeNCostFromLeg($(this));
        }
    });
}

function allocationGridEditHandler(event) {
    var input = event.container.find("input.k-input");
    input.select();
    input.keyup(function(e) {
        if(e.keyCode !=  9){
            if($(this).attr("data-bind").indexOf("value:ALLOC_CUBE") > -1 || $(this).attr("data-bind").indexOf("value:ALLOC_WEIGHT") > -1) {
                if($(this).attr("data-bind").indexOf("value:ALLOC_CUBE") > -1) {
                    this.kendoBindingTarget.source["ALLOC_CUBE"] = $(this).val();
                }else if($(this).attr("data-bind").indexOf("value:ALLOC_WEIGHT") > -1){
                    this.kendoBindingTarget.source["ALLOC_WEIGHT"] = $(this).val();
                }
                parent.SkdGridHelper.getSkdGridManager().enableDisableLocAllocCheckBox($(this).parent().parent(), this.kendoBindingTarget.source, $(this).val());
            }
        }
    });
}

function checkIsTimeDataValid(cell) {
    try {
        if(cell && cell.val() != "") {
            if(cell.attr("data-bind").indexOf("value:LOCAL_DEP") > -1 || cell.attr("data-bind").indexOf("value:LOCAL_ARR") > -1) {
                if(!validateTimeWithOrWithoutColon(cell.val())){
                    return false;
                }
            }
        }
    }catch (e) {
        console.log("Error while validing the time data");
    }
    return true;
}

function grndMinCellEditor(container, options) {
    var row = container.closest("tr");
    if(row.is(":last-child")) {
        container.text(options.model[options.field]);
    }else {
        container.append('<input type="text" class="k-input k-textbox" name="'+ options.field +'" data-bind="value:'+ options.field +'">');
    }
}

function transitMinsEditor(container, options) {
    var manualCheckBox = container.closest("tr.k-detail-row").prev().find("input.k-manually-timed");
    if(manualCheckBox && manualCheckBox.length > 0 && manualCheckBox.prop("checked")) {
        container.append('<input type="text" onkeyup="transitKeyUpHandler(this);" class="k-input k-textbox" name="'+ options.field +'" data-bind="value:'+ options.field +'">');
    }else {
        container.text(options.model[options.field]);
    }
}

function transitKeyUpHandler(container) {
    var grid = $('#' + gridId).data("kendoGrid");
    var data = grid.dataItem($(container).closest("tr.k-detail-row").prev());
    data.USE_LEG_MINS_FLAG = "True";
}

function callTimeNCostFromRoute(cell) {
    if(!isRouteValidationError) {
        var isRouteEditor = gridId == "routeMatrixGrid" ? true : false;
        var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostServiceFromRoute(cell,
            onDefaultsServiceSuccess, $("#"+gridId), "div.k-legs-grid", !isLocalTimeFlag(), isRouteEditor);
        if(isCallService) {
            updateSelectedRouteNLegList();
            $("#"+gridId).data("kendoGrid").refresh();
        }
    }
}

function callTimeNCostFromLeg(cell) {
    //if(!isValidationError) {
    var isRouteEditor = gridId == "routeMatrixGrid" ? true : false;
    var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostServiceFromLeg(cell,
        onDefaultsServiceSuccess, $("#"+gridId), "div.k-legs-grid", !isLocalTimeFlag(), isRouteEditor);
    if(isCallService) {
        updateSelectedRouteNLegList();
        $("#"+gridId).data("kendoGrid").refresh();
    }
    //}
}

function addMouseOverEventToGrid(grid_Id) {
    var table = $(HASH_STRING+grid_Id).find("div.k-grid-content table");
    table.on("mouseover", "tr.k-master-row td", function(event) {
        addToolTip(this);
    });
    table.on("mouseover", "div.k-legs-grid.k-grid.k-widget td", function(event) {
        addToolTip(this);
    });
    table.on("mouseover", "div.k-seasons-grid.k-grid.k-widget td", function(event) {
        addToolTip(this);
    });
    table.on("mouseover", "div.k-allocation-grid.k-grid.k-widget td", function(event) {
        addToolTip(this);
    });
}

function addToolTip(that) {
    if(gridId == "routeMatrixGrid"){
        parent.DataHelper.getTooltipManager().setToolTip(that,parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
    }else{
        parent.DataHelper.getTooltipManager().setToolTip(that,parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
    }
}
/**
 * function to impliment save to schedule
 * @param btnObj
 */
function saveToSchedule(btnObj){
    var gridData = $("#"+gridId).data("kendoGrid");
    var routeData = gridData.dataSource.data().toJSON();
    var routeList = getModifiedRoute();
    var staticRouteList;
    var changedRouteList;
    var staticLeglist;
    var changedLeglist;
    if (routeList!= null && routeList.length > 0 && parent.isValidRevisionsCountOk(routeList)){
        for(var i = 0;i < routeList.length; i++) {
            routeId = routeList[i]["ROUTE_ID"];
            if(parent.getRevisionsCounter(routeId) <= 0){
//					parent.updateRevisionsCounter(routeId);
                staticRouteList = $.grep(parent.initialWIPRouteList, function(obj) {
                    return obj["ROUTE_ID"] == routeId;
                });
                changedRouteList = $.grep(parent.selectedWIPRouteList, function(obj) {
                    return obj["ROUTE_ID"] == routeId;
                });
                staticLeglist = $.grep(parent.initialWIPLegList, function(obj) {
                    return obj["ROUTE_ID"] == routeId;
                });
                changedLeglist = $.grep(parent.selectedWIPLegList, function(obj) {
                    return obj["ROUTE_ID"] == routeId;
                });

                parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(routeList[i],gridId, dashboardID,null,changedLeglist,staticLeglist,staticRouteList,parent.OPERATION_FROM_MATRIX_SAVE);
                parent.SkdGridHelper.getSkdGridManager().setDashBoardTitle(routeList[i],parent.DASHBOARD_ID_REVISION_COMMENTS);
                parent.openDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS,true);
                break;
            }
        }
    } else {
        syncRevisionComments();
        callSaveUpdateService();
        parent.clearRevisionsUpdateMap();
    }
}

function isRevisionPopupOpen() {
    var gridData = $("#"+gridId).data("kendoGrid");
    var routeData = gridData.dataSource.data().toJSON();
    if (routeData[0]["CHANGE_FLAG"] == parent.OPERATION_CD_MODIFY) {
        if (routeData[0].DISCARDREVISION != undefined && routeData[0].DISCARDREVISION) {
            return false;
        } else if (isDataModified(routeData) && !getComment(routeData[0]["COMMENTS"])){
            return true;
        } else {
            return false;
        }
    }
}

function syncRevisionComments() {
    var gridData = $("#"+gridId).data("kendoGrid");
    var gridTable = gridData.table[0];
    j=0;
    for(var i=0,row; row=gridTable.rows[i];i++) {
        if ($(row).hasClass('k-master-row')) {
            var routeData = gridData.dataSource.data()[j];
            j++;
            if (gridId == "routeMatrixGrid") {
                setRevisionComments(routeData, getLegGridData(row, routeData));
            } else  {
                if (row.childNodes[1].childNodes[0].checked) {
                    setRevisionComments(routeData, getLegGridData(row, routeData));
                }
            }
        }
    }
}

function getLegGridData(routeRow, routeData) {
    var legsGrid = $(routeRow).next().find("div.k-legs-grid");
    var legsData;
    if(legsGrid && legsGrid.length > 0) {
        legsData = legsGrid.data("kendoGrid").dataSource.data();
    }else if(routeData != null){
        legsData = $.grep(parent.selectedWIPLegList, function(obj) {
            return obj.ROUTE_ID == routeData.ROUTE_ID;
        });
    }
    return legsData;
}

function getCommnentData(comments) {
    if (comments != "" && comments != null) {
        return $.parseJSON(comments);
    } else {
        return null;
    }
}
function setRevisionComments(routeData, legData) {
    var commentList = getCommnentData(routeData.COMMENTS);
    var internalList = [];
    var revisionList= [];
    if (commentList != null) {
        revisionList = $.grep(commentList, function(obj) {
            return (obj["commentTypeCd"].type == 1);
        });
        revisionList.sort(function(x, y){
            return x.createTmstp - y.createTmstp;
        });
        internalList = $.grep(commentList, function(obj) {
            return (obj["commentTypeCd"].type == 0);
        });
    }
    if (revisionList != null && revisionList.length >0) {
        var revisionObject = revisionList[revisionList.length-1];
        if (revisionObject['EDITABLE'] == true || (revisionObject["operationCd"] != undefined && revisionObject["operationCd"] != null
            && revisionObject["operationCd"].type != undefined && revisionObject["operationCd"].type == 1)) {
            var routeinfos = revisionObject["origRouteDesc"] .split("-");
            var commentDesc = revisionObject["commentDesc"].split(parent.FIELD_SEPARATOR);
            var commentDescExt = commentDesc[0].split(parent.FIELD_SEPARATOR);
            //var commentDescExt = revisionObject["routeDetailCommentCurrent"];
            //routeinfos[0] = getModifiedRouteinformation(false,routeData,legData);
            revisionObject["origRouteDesc"] = revisionObject["origRouteDesc"]; //routeinfos[0]; //+"-"+routeinfos[1];
            //commentDescExt[0]= getModifiedRouteinformation(true,routeData,legData);
            revisionObject["commentDesc"] = parseString(commentDesc[0])  + parent.FIELD_SEPARATOR + parseString(commentDesc[1]);
        }
    }
    $.merge(internalList,revisionList);
    routeData.COMMENTS = JSON.stringify(internalList, replacer);
}

function parseString(str){
    if(str == ""){
        return str;
    }

    if(str == undefined){
        return "";
    }

    return str;
}

function getModifiedRouteinformation(isCommentDesc,routeData,legData) {
    if (isCommentDesc) {
        return getRouteDetailsComment(routeData, legData);
    } else {
        return getRouteInformation(routeData,legData);
    }
}

function getRouteDetailsComment(routeData, legRows) {
    var finalString = "";
    if (routeData["MV_NUM"] !=null) {
        finalString = finalString + routeData["MV_NUM"] +" ";
    }
    if (legRows.length >0) {
        for (var i =0; i <legRows.length;i++) {
            var firstLeg = legRows[i];
            var firstLegOrigin = firstLeg["ORIGIN"];
            if (firstLegOrigin != null)  {
                finalString= finalString + firstLegOrigin + "~";
            }
            var firstLegDestination = firstLeg["DESTINATION"];
            //if (firstLegDestination != null) {
            //	finalString= finalString + firstLegDestination + " ";
            //}
            /*var firstEqType = firstLeg["EQUIP_TYPE"];
             if (firstEqType != null) {
             finalString= finalString + firstEqType + " ";
             }
             var firstEffectiveDate = firstLeg["KEYWORD_EFFDT_L"];
             if (firstEffectiveDate != null) {
             finalString= finalString + firstEffectiveDate +"";
             }*/
            if (i == (legRows.length-1)) {
                finalString =  finalString + firstLegDestination + " ";
            } /*else {
             finalString =  finalString.trim()+"," ;
             }*/
        }
    }
    if (routeData["EQUIP_TYPE"] !=null) {
        finalString = finalString + routeData["EQUIP_TYPE"] ; // parent.getEquipmentDesc(routeData["EQUIP_TYPE"],routeData["MODE"]=="Flight" ? "F":"T");
    }
    finalString = parent.SkdGridHelper.getSkdGridManager().getFormattedData(routeData,finalString);
    return finalString;
}


function getRouteInformation (routeData, legRows) {
    var finalString = "";
    if (routeData["MV_NUM"] !=null) {
        finalString = finalString + routeData["MV_NUM"] +" ";
    }
    if (legRows.length >0) {
        for (var i =0; i <legRows.length;i++) {
            var firstLeg = legRows[i];
            if(finalString != null && finalString.length >0) {
                finalString= finalString + " ";
            }
            var firstLegType = firstLeg["LEG_TYPE"];
            if (firstLegType != null) {
                finalString= finalString + firstLegType + " ";
            }
            var firstLegDepTime = firstLeg["LOCAL_DEP"];
            if (firstLegDepTime != null) {
                finalString= finalString + firstLegDepTime + " ";
            }
            var firstLegOrigin = firstLeg["ORIGIN"];
            if (firstLegOrigin != null)  {
                finalString= finalString + firstLegOrigin + " ";
            }
            var firstLegArrDay = firstLeg["BLOCK_INDAY_L_NBR"];
            if (firstLegArrDay!= null) {
                finalString= finalString + firstLegArrDay + " ";
            }
            var firstLegDestination = firstLeg["DESTINATION"];
            if (firstLegDestination != null) {
                finalString= finalString + firstLegDestination + " ";
            }

            var firstLegGroundtime = firstLeg['LOC_GRND_MIN_QTY'];
            if (firstLegGroundtime != null) {
                finalString= finalString + firstLegGroundtime + " ";
            }
            var firstEffectiveDate = firstLeg["KEYWORD_EFFDT_L"];
            if (firstEffectiveDate != null) {
                finalString= finalString + firstEffectiveDate +"";
            }
            if (i == (legRows.length-1)) {
                finalString =  finalString.trim() ;
            } else {
                finalString =  finalString.trim()+"," ;
            }
        }
    }

    return finalString;
}
function isDataModified(routeData) {
    var gridData = $("#"+gridId).data("kendoGrid");
    var routeDataList = gridData.dataSource.data().toJSON();
    var legDataList = [];
    var gridTable = gridData.table[0];
    for(var i=0,row; row=gridTable.rows[i];i++){
        if ($(row).hasClass('k-master-row')) {
            var legsGrid = $(row).next().find("div.k-legs-grid").data("kendoGrid");
            var legsData = legsGrid.dataSource.data().toJSON();
            $.merge(legDataList,legsData);
        }
    }
    var initialRouteList = parent.initialRouteList;
    var initialLegList = parent.initialLegList;
    for (var i=0; i <initialRouteList.length; i++) {
        var initalroute = initialRouteList[i];
        var filterintialLegList = $.grep(initialLegList, function(obj) {
            return obj["ROUTE_ID"] == initalroute["ROUTE_ID"];
        });
        var updatedRouteList =  $.grep(routeDataList, function(obj) {
            return obj["ROUTE_ID"] == initalroute["ROUTE_ID"];
        });
        var updatedLegList =  $.grep(legDataList, function(obj) {
            return obj["ROUTE_ID"] == initalroute["ROUTE_ID"];
        });
        if (parent.SkdGridHelper.getSkdGridManager().isRouteDataModified(initalroute,updatedRouteList[0])) {
            return true;
        }
        if (parent.SkdGridHelper.getSkdGridManager().isLegDataModified(filterintialLegList,updatedLegList)) {
            return true;
        }
    }
    return false;
}
/*
 function isRouteDataModified(initalroute, updatedRoute) {
 if (initalroute["FULL_EFFDAY_HOLIDAY_L"] != updatedRoute["FULL_EFFDAY_HOLIDAY_L"]
 || initalroute["FULL_EFFDAY_HOLIDAY_Z"] != updatedRoute["FULL_EFFDAY_HOLIDAY_Z"]
 || initalroute["LEG_TYPE"] != updatedRoute["LEG_TYPE"] || initalroute["LEG_TYPE"] != updatedRoute["LEG_TYPE"]
 || initalroute["CARRIER_TYPE"] != updatedRoute["CARRIER_TYPE"]) {
 return true;
 }
 return false;
 }

 function isLegDataModified(filterInitialLegList, updatedLegList) {
 if (filterInitialLegList.length != updatedLegList.length) {
 return true;
 } else {
 for (var i=0; i <filterInitialLegList.length; i++) {
 var filteredLegList =  $.grep(updatedLegList, function(obj) {
 return obj["LEG_ID"] == filterInitialLegList[i]["LEG_ID"];
 });
 if (filteredLegList != undefined  && filteredLegList.length >0) {
 if (filterInitialLegList[i]["FULL_EFFDAY_HOLIDAY_L"] != filteredLegList[0]["FULL_EFFDAY_HOLIDAY_L"] ||
 filterInitialLegList[i]["FULL_EFFDAY_HOLIDAY_Z"] != filteredLegList[0]["FULL_EFFDAY_HOLIDAY_Z"]||
 filterInitialLegList[i]["ORIGIN"] != filteredLegList[0]["ORIGIN"]||
 filterInitialLegList[i]["DESTINATION"] != filteredLegList[0]["DESTINATION"]||
 filterInitialLegList[i]["LOCAL_DEP"] != filteredLegList[0]["LOCAL_DEP"]||
 filterInitialLegList[i]["ZULU_DEP"] != filteredLegList[0]["ZULU_DEP"]||
 filterInitialLegList[i]["LOCAL_ARR"] != filteredLegList[0]["LOCAL_ARR"]||
 filterInitialLegList[i]["BLOCK_INDAY_L_NBR"] != filteredLegList[0]["BLOCK_INDAY_L_NBR"]||
 filterInitialLegList[i]["BLOCK_INDAY_Z_NBR"] != filteredLegList[0]["BLOCK_INDAY_Z_NBR"]) {
 return true;
 };
 } else {
 return true;
 };
 };
 }
 return false;
 }
 */

function getComment(comments) {
    var commentData =[];
    if (comments != "" && comments != null) {
        commentData = $.parseJSON(comments);
    }
    var commentList =[];
    if (commentData != null && commentData.length>0) {
        commentList = $.grep(commentData, function(obj) {
            return (obj["commentTypeCd"].type == 1);
        });
        commentList.sort(function(x, y){
            return x.createTmstp - y.createTmstp;
        });
    }
    if (commentList != null && commentList.length>0) {
        for(var i= 0;i <commentList.length;i++) {
            if (commentList[i]["operationCd"].type == 1) {
                return true;
            }
        }
    }
    return false;
}
/**
 * function to impliment save to WIP
 * @param btnObj
 */
function saveToWIP(btnObj){
    getCheckedData(gridId,true);
}

/**
 * function to impliment add duplicate route
 * @param btnObj
 */
function addDuplicateRoute(btnObj){
//	TODO: Impl pending
}

/**
 * function to save the saveToWip, saveToSchedule btns
 *
 * @param isSaveFlag
 */
function enableDisableSaveBtns(){
    var save2ScheduleWIP = parent.$("#saveToScheduleWIP");
    checkButtonStates(save2ScheduleWIP);
    isEnable = validateRouteGrid();
    if(save2ScheduleWIP != undefined && save2ScheduleWIP.length == 1){
        if (isEnable) {
            save2ScheduleWIP[0].children[0].className = "k-icon save-settings";
            save2ScheduleWIP.attr('onclick', 'parent.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).saveToSchedule(this);').bind('click');
        } else {
            save2ScheduleWIP[0].children[0].className = "k-icon save-settings-disable";
            save2ScheduleWIP.attr('onclick', '').unbind('click');
        }
    }
}

function checkButtonStates(btnObj){
    try {
        if(btnObj != undefined && btnObj["length"] == 0 ){
            parent.VIEWER.addButtonsBar(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP, $("#headerButtonsBar"));
        }
    } catch (e) {
        console.log("Error in checkButtonStates");
    }
}

function enableDisableSaveNDeteleBtn() {
    var deleteFromWIP = parent.$("#deleteFromWIP");
    checkButtonStates(deleteFromWIP);
    var grid = $("#"+gridId).data("kendoGrid");
    var masterRows = grid.tbody.find("tr.k-master-row");
    var checkedRtesExist = false;
    for(var i=0; i<masterRows.length;i++) {
        if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
            if($(masterRows[i]).find("input.k-route-checkbox").prop("checked")) {
                checkedRtesExist = true;
                break;
            }
        }
    }
    //if(deleteFromWIP && deleteFromWIP.length > 0 && deleteFromWIP[0].children && deleteFromWIP[0].children.length > 0) {
    if (checkedRtesExist) {
        deleteFromWIP[0].children[0].className = "k-icon icon-delete-route";
        deleteFromWIP.attr('onclick', 'parent.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).deleteFromSchedule(this);').bind('click');
    } else {
        deleteFromWIP[0].children[0].className = "k-icon icon-delete-route-disable";
        deleteFromWIP.attr('onclick', '').unbind('click');
    }
    //}
    enableDisableSaveBtns();
}

function enableDisableSaveBtnsFromRoute(cell) {
    try {
        if(cell.attr("data-bind").indexOf("value:MV_NUM") > -1) {
            cell[0].kendoBindingTarget.source.MV_NUM = cell.val();
        }if(cell.attr("data-bind").indexOf("value:LEG_TYPE") > -1) {
            cell[0].kendoBindingTarget.source.LEG_TYPE = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1) {
            cell[0].kendoBindingTarget.source.EQUIP_TYPE = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:CARRIER_TYPE") > -1) {
            cell[0].kendoBindingTarget.source.CARRIER_TYPE = cell.val();
        }
        cell[0].kendoBindingTarget.source.dirty = true;
        //enableDisableSaveBtns();
    }catch (e) {
        console.log("Error in setFieldValueOnKeyUp");
    }
}

function enableDisableSaveBtnsFromLeg(cell) {
    try {
        if(cell.attr("data-bind").indexOf("value:LEG_TYPE") > -1) {
            cell[0].kendoBindingTarget.source.LEG_TYPE = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1) {
            cell[0].kendoBindingTarget.source.EQUIP_TYPE = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:ORIGIN") > -1) {
            cell[0].kendoBindingTarget.source.ORIGIN = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:DESTINATION") > -1) {
            cell[0].kendoBindingTarget.source.DESTINATION = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:LOCAL_DEP") > -1) {
            cell[0].kendoBindingTarget.source.LOCAL_DEP = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:ZULU_DEP") > -1) {
            cell[0].kendoBindingTarget.source.ZULU_DEP = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:LOCAL_ARR") > -1) {
            cell[0].kendoBindingTarget.source.LOCAL_ARR = cell.val();
        }else if(cell.attr("data-bind").indexOf("value:ZULU_ARR") > -1) {
            cell[0].kendoBindingTarget.source.ZULU_ARR = cell.val();
        }
        cell[0].kendoBindingTarget.source.dirty = true;
        //enableDisableSaveBtns();
    }catch (e) {
        console.log("Error in setFieldValueOnKeyUp");
    }
}

/**
 * to validate the data for mandatory values
 */
function validateRouteGrid(){
    var grid = $("#"+gridId).data("kendoGrid");
    var masterRows = grid.tbody.find("tr.k-master-row");
    var data, legGrid, legData;
    var flag = false;
    for(var i=0; i<masterRows.length;i++) {
        if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
            if($(masterRows[i]).find("input.k-route-checkbox").prop("checked")) {
                flag = false;
                data = grid.dataItem(masterRows[i]);
                if(!isNull(data['MV_NUM']) && !isNull(data['FULL_EFFDAY_HOLIDAY_L']) && !isNull(data['FULL_EFFDAY_HOLIDAY_Z']) &&
                    !isNull(data['LEG_TYPE']) && !isNull(data['EQUIP_TYPE']) && !isNull(data['CARRIER_TYPE'])){

                    if($(masterRows[i]).next().find("div.k-legs-grid") && $(masterRows[i]).next().find("div.k-legs-grid").length > 0) {
                        legGrid = $(masterRows[i]).next().find("div.k-legs-grid").data("kendoGrid");
                        if(legGrid && legGrid.dataSource) {
                            legData = legGrid.dataSource.data();
                        }
                    }else {
                        legData = $.grep(parent.selectedWIPLegList, function(item) {
                            return item.ROUTE_ID == data.ROUTE_ID;
                        });
                    }
                    for(var j=0;j<legData.length;j++) {
                        flag = false;
                        if(!isNull(legData[j]['FULL_EFFDAY_HOLIDAY_L']) && !isNull(legData[j]['FULL_EFFDAY_HOLIDAY_Z']) && ! isNull(legData[j]['LEG_TYPE']) &&
                            !isNull(legData[j]['EQUIP_TYPE']) && !isNull(legData[j]['ORIGIN']) && !isNull(legData[j]['DESTINATION']) &&
                            !isNull(legData[j]['LOCAL_DEP']) && !isNull(legData[j]['ZULU_DEP']) && !isNull(legData[j]['LOCAL_ARR']) && !isNull(legData[j]['ZULU_ARR'])){
                            flag = true;
                        }
                    }
                }
            }
        }
    }
    return flag;
}

function parseCostData(dataItem){
    formatAsCost(dataItem, "DAILYRATE_PLUSCC_CHG_AMT");
    formatAsCost(dataItem, "TOTALMONTH_COST_AMT");
    formatAsCost(dataItem, "DAILY_RT_CC_CHG");
    formatAsCost(dataItem, "TOTAL_MTH_CST");
    formatAsCost(dataItem, "OPERATING_COST");
}

function parseAllocationCostData(dataItem){
    formatAsCost(dataItem, "ALLOC_WEIGHT",true);
    formatAsCost(dataItem, "ALLOC_CUBE",true);
}
function parseLocAllocationCostData(dataItem){
    formatAsCost(dataItem, "ALLOC_WEIGHT",true);
    formatAsCost(dataItem, "ALLOC_CUBE",true);
}
function formatAsCost(dataItem, propertyName,isCube){
    if(dataItem != undefined){
        if(propertyName != undefined && dataItem[propertyName] != undefined && (dataItem[propertyName].indexOf(',') === -1)) {
            if (dataItem[propertyName] != ""){
                dataItem[propertyName] = parseFloat(dataItem[propertyName]).toFixed(0).replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }else {
                if(!isCube){
                    dataItem[propertyName] = "0.00";
                }else{
                    dataItem[propertyName] = EMPTY_STRING;
                }
            }
        }
    }
}

function setExpandedRoute(routeId){
    if(expandedRoutes != undefined ){
        if(expandedRoutes.indexOf(routeId) <= -1) {
            expandedRoutes.push(routeId);
        }
    }
}