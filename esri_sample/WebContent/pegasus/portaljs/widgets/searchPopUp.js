/**
 * @author Honey Bansal
 */
function SearchPopUp(windowId, options) {
    this.searchPopUpWin;
    this.windowId = windowId;
    this.isExist = false;
    this.gridId = 'gridContainer' + this.windowId;
    this.grid;
    this.searchBox;
    this.dropDownBox;
    this.tabStrip;
    this.checkBoxDiv;
    this.gridDiv;
    this.nearByLocsData;
    this.selections = [];
    this.options = options;
    this.searchBoxInput = [];
}

SearchPopUp.prototype.openFilterPopUp = function() {
    var searchPopUp = this;
    var width;
    var height = 450;
    if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        width = "485px";
    } else {
        width = "340px";
    }
    if(this.windowId == "legType") {
    	height = 610;
    } else if (this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType" || this.windowId == "caseTypes") {
    	height = "300px";
    	width = "300px";
    } else if (this.windowId == "productVolGroupsTextArea") {
    	height = "455px";
    	width = "250px";
    }else if (this.windowId == "orgDestTextArea") {
    	height = "180px";
    	width = "250px";
    }
    if (!this.isExist) {
        this.searchPopUpWin = $("<div id='selectLocations" + this.windowId + "' style='margin: 0;padding: 0;overflow: hidden'></div>").kendoWindow({
            width: width,
            height: height,
            resizable: false,
            title: this.options.title,
            open: function(event) {
                searchPopUp.windowOpenLisetner(event);
                if (searchPopUp.windowId == "showNearBy") {
                    searchPopUp.setNearByLocationsData();
                }
            },
            close: function(event) {
                if (searchPopUp.windowId == "showNearBy") {
                    if (searchPopUpMap[searchPopUp.options.parentId] != null) {
                        $(searchPopUpMap[searchPopUp.options.parentId].grid.domElement).find("img").attr("src", "pegasus/assets/icons/add-nearby.png");
                    }
                }
            }
        });
        this.createLayout();
        this.isExist = true;
        this.bindEventListeners();
    }else {
    	this.searchPopUpWin.data("kendoWindow").title(this.options.title);
    }
    var pos = getPosition(this.options.parentObj);
    var top = pos.y + pos.h + 50;
    var left = pos.x + pos.w + 10;
    var documentHgt = parent.document.body.clientHeight;
    top = (documentHgt - height - 65) > top ? top : (documentHgt - height - 65);
    if (this.windowId == "showNearBy") {
        if (this.options.parentId == "orignDestWinOrigin" || this.options.parentId == "selectLocations" || this.options.parentId == "orignDestWinDest") {
            top = this.options.parentObj.offset().top;
            left = this.options.parentObj.offset().left + 340;
        }
        this.searchPopUpWin.data("kendoWindow").title("Show nearby locations (" + this.options.nearByLoc + ")");
    } else if (this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType") {
    	 top = pos.y + pos.h + 90;
         left = pos.x + pos.w - 90;
    } else if (this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea") {
    	top = pos.y + pos.h + 110;
    	left = pos.x + pos.w + 10;
    } else if(this.windowId == "caseTypes") {
    	top = pos.y + pos.h + 15;
    }
    if (this.options.parentObj != null) {
        this.searchPopUpWin.closest(".k-window").css({
            top: top,
            left: left
        });
        this.searchPopUpWin.data("kendoWindow").open();
    } else {
        this.searchPopUpWin.data("kendoWindow").center().open();
    }
    setTimeout(function() {
        searchPopUp.searchBox.focus();
    }, 500);
};

SearchPopUp.prototype.createLayout = function() {
    var div = $('<div style="height:100%;width:100%;white-space: nowrap;overflow:hidden"></div>').appendTo($("#selectLocations" + this.windowId));
    var ghostText = "";
    var div2;
    if (this.windowId == "orignDestWinOrigin" || this.windowId == "selectLocations" || this.windowId == "orignDestWinDest") {
        div2 = $('<div><ul><li class="k-state-active" style="margin-left:0px; margin-top:5px;">Locations</li><li style=" margin-left:0px;margin-top:5px;">Facility Groups</li><li style=" margin-left:0px;margin-top:5px;">Countries</li><li style=" margin-left:0px;margin-top:5px;">Regions</li></ul></div>').appendTo(div);
        ghostText = "location";
    } else if (this.windowId == "equipmentType") {
        var html = '<div><ul><li class="k-state-active" style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 30px;padding: 0;text-align: center;">Flight Feeder</li>';
        html += '<li style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 30px;padding: 0;text-align: center;">Flight Trunk</li>';
        html += '<li style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 30px;padding: 0;text-align: center;">Flight CLH</li>';
        html += '<li style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 30px;padding: 0;text-align: center;">Truck Standard</li>';
        html += '<li style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 30px;padding: 0;text-align: center;">Truck Oversize</li>';
        html += '</ul></div>';
        div2 = $(html).appendTo(div);
        ghostText = "equipment types";
    } else if (this.windowId == "legType") {
        div2 = $('<div><ul><li class="k-state-active" style="margin-left:0px; margin-top:5px;">Flights</li><li style=" margin-left:0px;margin-top:5px;">Trucks</li><li style=" margin-left:0px;margin-top:5px;">Others</li></ul></div>').appendTo(div);
        ghostText = "leg type";
    } else if (this.windowId == "showNearBy") {
        ghostText = "nearby";
    } else if (this.windowId == "flightLegTypes" || this.windowId == "truckLegTypes" || this.windowId == "flightLegTypesOverlay" || this.windowId == "truckLegTypesOverlay") {
        ghostText = "leg type";
    } else if (this.windowId == "flightEquipTypes" || this.windowId == "truckEquipTypes" || this.windowId == "flightEquipTypesOverlay" || this.windowId == "truckEquipTypesOverlay") {
        ghostText = "equipment type";
    } else if (this.windowId == "productsTextArea") {
        ghostText = "product";
    } else if (this.windowId == "productGroupsTextArea") {
        ghostText = "product group";
    } else if ( this.windowId == "productVolGroupsTextArea") {
        ghostText = "product volume group";
    } else if (this.windowId == "orgDestTextArea"){
    	ghostText = "location indicator";
    } else if (this.windowId == "preActivitiesGridLocation" || this.windowId == "priActivitiesGridLocation" || this.windowId == "nxtActivitiesGridLocation") {
        ghostText = "location";
    } else if (this.windowId == "preActivitiesGridTransits" || this.windowId == "priActivitiesGridTransits" || this.windowId == "nxtActivitiesGridTransits") {
        ghostText = "transit";
    } else if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        ghostText = "activity";
    } else if (this.windowId == "routeLocationTextArea") {
        ghostText = "location";
    } else if (this.windowId == "routeLegTypeTextArea") {
        ghostText = "leg type";
    } else if (this.windowId == "routeEquipTypeTextArea") {
        ghostText = "equipment type";
    } else if (this.windowId == "carrierTypeTextArea") {
        ghostText = "carrier type";
    } else if(this.windowId == "scacCodeTextArea") {
    	ghostText = "scac code";
    } else if(this.windowId == "routeTypeTextArea"){
    	ghostText = "route type";
    } else if(this.windowId == "managerTextArea"){
    	ghostText = "manager type";
    } else if(this.windowId == "trailerTypeTextArea"){
    	ghostText = "trailer type";
    } else if(this.windowId == "trailerOptionTextArea"){
    	ghostText = "trailer option";
    } else if (this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType")  {
    	ghostText = "Route type";
    } else if (this.windowId == "enterRoute") {
    	 var html = '<div><ul><li class="k-state-active" style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 20px;padding: 0;text-align: center;">Flight</li>';
         html += '<li style="margin-left: 0px; margin-top: 5px;width: 65px;white-space: pre-line;height: 20px;padding: 0;text-align: center;">Truck</li>';
         html += '</ul></div>';
         div2 = $(html).appendTo(div);
         ghostText = "routes";
    } else if(this.windowId == "caseTypes"){
    	ghostText = "case types";
    } else {
        if (this.options != undefined) {
            ghostText = this.options.title != undefined ? this.options.title : "";
        }
    }
    this.tabStrip = div2;
    var searchPopUp = this;
    if (div2 != null) {
        var kendotabstrip = div2.kendoTabStrip({
            select: function(e) {
                searchPopUp.onLocTabSelect(e);
            }
        });
        kendotabstrip.parent().find('.k-tabstrip').css({
            "padding-top": "0px"
        });
        kendotabstrip.parent().find('.k-tabstrip-items').css({
            "padding-top": "0px"
        });
    }
    var div3 = $('<div style="padding-left: 5px;padding-top: 5px"></div>').appendTo(div);
    var input31 = $('<input type="text" placeholder="Select or type ' + ghostText + '" style="width: 200px"/>').appendTo(div3);
    input31.keyup(function(event) {
        searchPopUp.searchLocations(event);
    });
    this.searchBox = input31;
    var div4;
    var div5;
    var div6;
    var isSelectAllDisabled = "";
    if (this.windowId == "orignDestWinOrigin" || this.windowId == "selectLocations" || this.windowId == "orignDestWinDest") {
    	/*div4 = $('<div style="padding-left: 10px;padding-top: 5px"><label style="vertical-align: top;line-height: 1.4;padding-right: 10px">Show :</label><input type="checkbox" value="lineHaul"/><label class="label_style" style="padding-right: 10px;">Line haul</label><input type="checkbox" value="feeder"/><label class="label_style">Feeder</label></div>').appendTo(div);
    	div4.children().get(1).onclick = function(event) {
    		searchPopUp.filterLineHaulFeeders(event);
    	};
    	div4.children().get(3).onclick = function(event) {
    		searchPopUp.filterLineHaulFeeders(event);
    	};
    	div5 = $('<div style="width: 100%;top: 80px;bottom: 46px;position: absolute;"></div>').appendTo(div);*/
        div5 = $('<div style="width: 100%;top: 55px;bottom: 46px;position: absolute;"></div>').appendTo(div);
        isSelectAllDisabled = " disabled='true' ";
    } else if (this.windowId == "equipmentType") {
        div5 = $('<div style="width: 100%;top: 65px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "legType") {
        div5 = $('<div style="width: 100%;top: 55px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "showNearBy") {
        input31.css("width", "140px");
        var dropDown31 = $('<label style="padding-left: 10px;padding-right: 10px">Locations within</label><select style="height: 18px;margin: 0;padding: 0;"><option value="25">25 Miles</option><option value="50">50 Miles</option><option value="75">75 Miles</option><option value="100">100 Miles</option><option value="200">200 Miles</option><option value="300">300 Miles</option></select>').appendTo(div3);
        this.dropDownBox = $(dropDown31[1]);
        dropDown31[1].onchange = function(e) {
            searchPopUp.setNearByLocationsData();
        };
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "flightLegTypes" || this.windowId == "truckLegTypes" || this.windowId == "flightEquipTypes" || this.windowId == "truckEquipTypes") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if(this.windowId == "flightLegTypesOverlay" || this.windowId == "truckLegTypesOverlay" || this.windowId == "flightEquipTypesOverlay" || this.windowId == "truckEquipTypesOverlay"){
    	div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "productsTextArea" || this.windowId == "productGroupsTextArea") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "preActivitiesGridLocation" || this.windowId == "priActivitiesGridLocation" || this.windowId == "nxtActivitiesGridLocation") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
        isSelectAllDisabled = " disabled='true' ";
    } else if (this.windowId == "preActivitiesGridTransits" || this.windowId == "priActivitiesGridTransits" || this.windowId == "nxtActivitiesGridTransits") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "routeLocationTextArea" || this.windowId == "routeLegTypeTextArea" || this.windowId == "routeEquipTypeTextArea" ||
    		this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType" || this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea") {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    }  else if (this.windowId == "carrierTypeTextArea" || this.windowId == "scacCodeTextArea" || this.windowId == "routeTypeTextArea" || this.windowId == "managerTextArea" 
    	|| this.windowId == "trailerTypeTextArea" || this.windowId == "trailerOptionTextArea" ) {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else if (this.windowId == "enterRoute") {
        div5 = $('<div style="width: 100%;top: 65px;bottom: 46px;position: absolute;"></div>').appendTo(div);
        $('<div id = "truckTypeCmbo" style="width: 100px;height:20px:" ></div>').appendTo(div3);
        createKendoComboBox('truckTypeCmbo',EMPTY_STRING,FILTER_TYPE_STARTS_WITH,["LineHaul","Shuttle"]);
        $("#truckTypeCmbo").data("kendoComboBox").select(0);
    } else if(this.windowId == "caseTypes"){
    	div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    } else {
        div5 = $('<div style="width: 100%;top: 30px;bottom: 46px;position: absolute;"></div>').appendTo(div);
    }
    this.checkBoxDiv = div4;
    this.gridDiv = div5;
    var div51 = $('<div id="' + this.gridId + '"style="height: 100%;width: 100%;border: none !important"></div>').appendTo(div5);
    div51.click(function(evt) {
        $(this).attr("tabindex", -1).focus();
    });
    div51.keyup(function(evt) {
        var keyCode = evt.keyCode || evt.which;
        var container = this.component.getBodyContainer();
        var rows = container.getOnScreenRows();
        if (keyCode == 38 || div51["isFocused"]) {
            row = rows[0];
            row.cells[0].component.dispatchEvent("mouseover");
            div51["isFocused"] = false;
        } else if (keyCode == 40) {
            row = rows[rows.length - 1];
            row.cells[0].component.dispatchEvent("mouseover");
        }
        if ((evt.shiftKey || evt.key == "Shift") && keyCode == 9) {
            input31.focus();
        }
    });
    input31.keydown(function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 40) {
            e.preventDefault();
            div51.attr("tabindex", -1).focus();
            div51["isFocused"] = true;
        }
    });
    if (this.windowId == "routeLocationTextArea" || this.windowId == "routeLegTypeTextArea" || this.windowId == "routeEquipTypeTextArea" || 
    		this.windowId == "carrierTypeTextArea" || this.windowId == "scacCodeTextArea" || this.windowId == "routeTypeTextArea" || this.windowId == "managerTextArea"
    			|| this.windowId == "trailerTypeTextArea" || this.windowId == "trailerOptionTextArea"|| this.windowId =="scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType" || this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea") {
        div6 = $('<div style="width: 100%;position: absolute;bottom: 0;border-top: 1px solid #94c0d2;text-align: center;padding-top: 5px;padding-bottom: 5px;"><input type="button" value="Apply" id="' + this.gridId + 'ApplyBtn" /></div>').appendTo(div);
    } else if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        div6 = $('<div style="width: 100%;position: absolute;bottom: 0;border-top: 1px solid #94c0d2;text-align: center;padding-top: 5px;padding-bottom: 5px;"><input type="button" value="Apply" id="' + this.gridId + 'ApplyBtn" /><input type="button" value="Clear All" id="' + this.gridId + 'ClearAllBtn" /></div>').appendTo(div);
    } else {
        div6 = $('<div style="width: 100%;position: absolute;bottom: 0;border-top: 1px solid #94c0d2;text-align: center;padding-top: 5px;padding-bottom: 5px;"><input type="button" value="Apply" id="' + this.gridId + 'ApplyBtn" /><input type="button" ' + isSelectAllDisabled + ' value="Select All" id="' + this.gridId + 'SelectAllBtn" /><input type="button" value="Clear All" id="' + this.gridId + 'ClearAllBtn" /></div>').appendTo(div);
    }
    this.addGridToSearchWin();
};

SearchPopUp.prototype.addGridToSearchWin = function() {
	var leftPadding = 0;
	 if(this.windowId == "scheduleMaintenanceRouteType"  || this.windowId == "skdMxMapRouteType" || this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea"){
		 leftPadding = 30;
	 }
    var gridConfig = '<grid filterPageSortMode="client" ' + 'rebuildGridOnDataProviderChange="true" ' + 'showSpinnerOnFilterPageSort="false" ' + 'variableHeaderHeight="true" ' + 'preferencePersistenceKey="searcgGrid" ' + 'autoLoadPreferences="false" ' + 'horizontalScrollPolicy="false" ' + 'enableSelectionCascade="true" enableDynamicLevels="true" ' + 'enableDefaultDisclosureIcon="false" selectedKeyField="locCd" ' + '></grid>';
    new AdvancedDataGrid(this.gridId, {
        configuration: gridConfig,
        id: "grid" + this.windowId,
        dataProvider: [],
        isCellCustomBackgroundDrawFunctionDefault: false,
        isAddCellBackgroundDrawFunction: false,
        isCreationCompleteDefault: false
    }, this.getMatrixColumns(leftPadding));
    this.grid = AdvancedDataGrid.getAdvancedDataGrid(this.gridId);
    this.grid.addEventListener(this.grid, "itemClick", SearchPopUp.onItemClickHandler);
    this.grid.addEventListener(this.grid, "headerClicked", SearchPopUp.onHeaderItemClickHandler);

    if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        this.grid.enableDefaultDisclosureIcon = true;
        this.grid.setHeaderVisible(true);
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "openWinL", true);
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "availTimeL", true);
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "dueTimeL", true);
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "keyEffDaysL", true);
        AdvancedDataGrid.setColumnWidthByUniqueIdentifier(this.gridId, "desc", 100);
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "desc", false);
    } else {
        this.grid.setHeaderVisible(false);
        AdvancedDataGrid.setColumnWidthByUniqueIdentifier(this.gridId, "desc", 300);
    }
    if (this.options.facilityType == "Region") {
        this.grid.enableDefaultDisclosureIcon = true;
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "expandColIcon", true);
    } else {
        this.grid.enableDefaultDisclosureIcon = false;
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "expandColIcon", false);
    }
    if (this.windowId == "routeLocationTextArea" || this.windowId == "routeLegTypeTextArea" || this.windowId == "routeEquipTypeTextArea" 
    	|| this.windowId == "carrierTypeTextArea" || this.windowId == "scacCodeTextArea" || this.windowId == "routeTypeTextArea" || 
    	this.windowId == "managerTextArea" || this.windowId == "trailerTypeTextArea" || this.windowId == "trailerOptionTextArea"||
    	this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType" || this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea") {
        this.grid.setSelectionMode("singleRow");
    } else {
        this.grid.setSelectionMode("multipleRows");
    }
    if(this.windowId == "enterRoute"){
    	 AdvancedDataGrid.setColumnWidthByUniqueIdentifier(this.gridId, "locCd", 85);
    }
    this.grid.setCellBorderFunction(this.cellBorderCustomDrawFn);
    this.grid["searchPopUp"] = this;
    this.grid.setSelectedKeyField("locCd");
};

SearchPopUp.prototype.getMatrixColumns = function(leftPadding) {
    var matrixCols = [{
        hidden: true,
        width: 15,
        field: "expandColIcon",
        enableExpandCollapseIcon: true,
        enableHierarchicalNestIndent: true
    }, {
        field: "checkbox",
        title: "Select All",
        type: "checkbox",
        width: 20,
        headerWordWrap: "true",
        sortable: false,
        filterable: false,
        headerText: "Check"
    }, {
        field: "showNearBy",
        title: "Show nearby ",
        width: 25,
        textAlign: "center",
        sortable: false,
        filterable: false,
        headerText: "Show nearby",
        labelFunction: this.nearByLabelFunction
    }, {
        field: "locCd",
        title: "Activities",
        width: 50,
        textAlign: "left",
        sortable: false,
        filterable: false,
        headerText: "Activities",
        paddingLeft :leftPadding	
    }, {
        field: "desc",
        title: "Description",
        width: 100,
        textAlign: "left",
        sortable: false,
        filterable: false,
        headerText: "Description"
    }, {
        field: "openWinL",
        title: "OpenWin(L)",
        width: 80,
        textAlign: "left",
        sortable: false,
        filterable: false,
        hidden: true,
        headerText: "OpenWin(L)"
    }, {
        field: "availTimeL",
        title: "AvailTime(L)",
        width: 80,
        textAlign: "left",
        sortable: false,
        filterable: false,
        hidden: true,
        headerText: "AvailTime(L)"
    }, {
        field: "dueTimeL",
        title: "DueTime(L)",
        width: 80,
        textAlign: "left",
        sortable: false,
        filterable: false,
        hidden: true,
        headerText: "DueTime(L)"
    }, {
        field: "keyEffDaysL",
        title: "Operating Days",
        width: 85,
        textAlign: "left",
        sortable: false,
        filterable: false,
        hidden: true,
        headerText: "Operating Days"
    }];
    if (this.windowId == "equipmentType" || this.windowId == "legType" || this.windowId == "showNearBy" || 
    		this.windowId == "flightLegTypes" || this.windowId == "truckLegTypes" || this.windowId == "flightEquipTypes" || this.windowId == "truckEquipTypes" ||
    		this.windowId == "flightLegTypesOverlay" || this.windowId == "truckLegTypesOverlay" || this.windowId == "flightEquipTypesOverlay" || this.windowId == "truckEquipTypesOverlay" ||
    		this.windowId == "productsTextArea" || this.windowId == "productGroupsTextArea" || this.windowId == "enterRoute") {
        matrixCols.splice(0, 1);
        matrixCols.splice(1, 1);
        matrixCols.splice(3, 6);
    } else if (this.windowId == "preActivitiesGridActivity" || this.windowId == "priActivitiesGridActivity" || this.windowId == "nxtActivitiesGridActivity") {
        matrixCols.splice(0, 1);
        matrixCols.splice(1, 1);
        matrixCols[1].width = 100;
    } else if (this.windowId == "preActivitiesGridTransits" || this.windowId == "priActivitiesGridTransits" || this.windowId == "nxtActivitiesGridTransits" || this.windowId == "preActivitiesGridLocation" || this.windowId == "priActivitiesGridLocation" || this.windowId == "nxtActivitiesGridLocation") {
        matrixCols.splice(0, 1);
        matrixCols.splice(1, 1);
        matrixCols.splice(3, 6);
        matrixCols[1].width = 80;
    } else if (this.windowId == "routeLocationTextArea" || this.windowId == "routeLegTypeTextArea" || this.windowId == "routeEquipTypeTextArea" 
    	|| this.windowId == "carrierTypeTextArea" || this.windowId == "scacCodeTextArea" || this.windowId == "routeTypeTextArea" || this.windowId == "managerTextArea" 
    		|| this.windowId == "trailerTypeTextArea" || this.windowId == "trailerOptionTextArea") {
        matrixCols.splice(0, 3);
        matrixCols.splice(2, 5);
        matrixCols[0].width = 60;
        matrixCols[0].textAlign = "center";
    } else if (this.windowId == "orignDestWinOrigin" || this.windowId == "orignDestWinDest" || this.windowId == "selectLocations") {
        matrixCols.splice(0, 1);
        matrixCols.splice(4, 7);
        matrixCols.push(this.getNestedColumnDtls());
    } else if (this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType"){
    	 matrixCols.splice(0, 3);
         matrixCols.splice(1, 5);
         matrixCols[0].width = 60;
         matrixCols[0].textAlign = "left";
    } else if (this.windowId == "productVolGroupsTextArea" || this.windowId == "orgDestTextArea"){
	   	 matrixCols.splice(0, 3);
	     matrixCols.splice(1, 5);
	     matrixCols[0].width = 90;
	     matrixCols[0].textAlign = "left";
	} else if(this.windowId == "caseTypes"){
		 matrixCols.splice(0, 1);
         matrixCols.splice(1, 1);
         matrixCols.splice(3, 6);
	}
    return matrixCols;
};

SearchPopUp.prototype.getNestedColumnDtls = function() {
    return {
        type: "nextlevel",
        parentChildrenField: "children",
        childrenField: "children",
        currentLevelParentFiled: "children",
        selectedKeyField: "locCd",
        nestIndent: undefined,
        isReusePreviousLevelColumns: true,
        parentItemLoadMode: "client",
        childItemLoadMode: "client",
        currentLevelItemLoadMode: "client",
        parentChildrenCountField: "CHILD_COUNT",
        currentChildrenCountField: "CHILD_COUNT",
        isCellCustomBackgroundDrawFunctionDefault: false,
        isAddCellBackgroundDrawFunction: false,
        //cellBorderFunction:this.cellBorderCustomDrawFn,
        itemOpenHandler: this.nextLvlItemClickHandler,
        itemCloseHandler: this.nextLvlItemClickHandler
    };
};

SearchPopUp.prototype.cellBorderCustomDrawFn = function(cell) {
    if (cell.getColumn() && cell.getColumn().getDataField() == "locCd") {
        $(cell.domElement).css('font-weight', 'bold');
    } else {
        $(cell.domElement).css('font-weight', 'normal');
    }
    return false;
};

SearchPopUp.prototype.nearByLabelFunction = function(item, column, cell) {
    return "<span title='show nearby locations'><img src='pegasus/assets/icons/add-nearby.png' style='cursor: pointer;' isopenstate='false'></span>";
};

SearchPopUp.prototype.clearGridBorder = function() {
    var searchPopUp = this;
    setTimeout(function() {
        $(searchPopUp.grid.domElement).find("div").css('border-color', '#FFFFFF');
    }, 1);
    setTimeout(function() {
        $(searchPopUp.grid.domElement).find("div").css('border-color', '#FFFFFF');
    }, 1500);
};

SearchPopUp.prototype.populateObject = function(obj, type, attributes) {
    var newObj = new Object();
    newObj.locCd = obj[attributes[0]] + "";
    newObj.desc = obj[attributes[1]];
    if (type == "Locations" || type == "ShowNearBy" || type == "ActivityFacilities") {
        newObj.desc = obj[attributes[1]] + ", " + (obj[attributes[2]] != undefined ? (obj[attributes[2]] + ", ") : "") + obj[attributes[3]] + " - " + obj[attributes[4]];
    } else if (type == "GlobalRegions") {
        $.each(getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()["ZonesList"].data(), function(key, value) {
            if (obj.globalRgnCd == value.globalRgnCd) {
                if (newObj.children == undefined) {
                    newObj.children = new Array();
                }
                newObj.children.push({
                    locCd: newObj.locCd + "_" + value.zone,
                    desc: value.zoneDesc
                });
            }
        });
    } else if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
        return obj;
    } else if (type == "FlightRoutes") {
    	newObj.locCd = obj[attributes[0]] +"-"+ obj[attributes[1]];
        newObj.desc = obj[attributes[2]];
    } else if (type == "TruckRoutes") {
    	newObj.locCd = obj[attributes[0]];
    }
    return newObj;
};

SearchPopUp.prototype.searchLocations = function(evt) {
	var type = this.getActiveTabType(evt.item);
	this.searchBoxInput[type] = $(evt.target).val();
	if(type == "TruckRoutes" && (this.searchBoxInput[type]).length > 1 && 
			(this.options.truckRoutesStr == undefined || (this.options.truckRoutesStr != undefined && this.options.truckRoutesStr != this.searchBoxInput[type]))){
		this.options.truckRoutesStr = this.searchBoxInput[type];
		parent.SkdMxServiceHelper.getAvailableRouteListServiceManager().callAvailableRouteListService("Truck",  
				$("#truckTypeCmbo").data("kendoComboBox").value(), this.searchBoxInput[type],this.truckRoutesCallback,true);
	}else{
		var attributes = this.getSearchAttributes(type);
		var filterData;
		if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
			filterData = this.filterActivitiesData(type);
		} else {
			filterData = this.filterLocationsData(type);
		}
		this.setGridDataProvider(filterData, type, attributes);
		this.checkSelections(this.selections, type);
		if (this.searchBoxInput[type] != null && this.searchBoxInput[type] != "") {
			$("#" + this.gridId + "SelectAllBtn").attr("disabled", false);
		} else if (type == "Locations" || type == "ActivityFacilities") {
			$("#" + this.gridId + "SelectAllBtn").attr("disabled", true);
		}
	}
};

SearchPopUp.prototype.setGridDataProvider = function(filterData, type, attributes) {
    var data = [];
    if (filterData != null) {
        for (var x = 0; x < filterData.length; x++) {
            obj = this.populateObject(filterData[x], type, attributes);
            data.push(obj);
        }
        this.grid.setDataProvider(data);
        this.grid.setTotalRecords(filterData.length);
        //this.clearGridBorder();
        if (type == "GlobalRegions") {
            this.grid.expandAll();
        } else if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
            var searchPopUp = this;
            setTimeout(function() {
                searchPopUp.grid.expandAll();
            }, 50);
        }
    }
};

SearchPopUp.prototype.getEquipmentData = function(type) {
    var dataType = type.split("_")[0];
    var filterType = type.split("_")[1];
    var attributes = this.getSearchAttributes(type);
    var data = getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()[dataType].data();
    var locs = $.grep(data, function(e) {
        return e[attributes[2]] != undefined ? e[attributes[2]].toString().toLowerCase() == filterType.toString().toLowerCase() : undefined;
    });
    return locs;

};

SearchPopUp.prototype.getLocationsDataSource = function(type) {
    if (type == "ShowNearBy") {
        return this.nearByLocsData;
    /*}else if(dataType == "Locations"){
    	locs = this.filterLineHaulFeeders();*/
    } else if (type == "FlightFilterLegTypes") {
        return getLegTypeData(this.options.flag)['F'];
    } else if (type == "TruckFilterLegTypes") {
        return getLegTypeData(this.options.flag)['T'];
    } else if (type == "FlightFilterEquipTypes") {
        return getEquipmentTypeData(this.options.flag)['F'];
    } else if (type == "TruckFilterEquipTypes") {
        return getEquipmentTypeData(this.options.flag)['T'];
    } else if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
        return AdvancedActivityComponent.getActivitiesData(this.options.nearByLoc, this.options.days, this.options.facilityType, type);
    } else if (type == "FlightEquipmentTypes_1" || type == "FlightEquipmentTypes_2" || type == "FlightEquipmentTypes_Y" || type == "TruckEquipmentTypes_S" || type == "TruckEquipmentTypes_O") {
        return this.getEquipmentData(type);
    } else if (type == "RouteLocations" || type == "RouteLegTypes" || type == "RouteEquipTypes" || type == "RouteCarrierTypes" || type == "RouteScacCodeTypes" ||
    		type == "RouteRouteTypes" || type == "RouteManagerTypes" || type == "RouteTrailerTypes" || type == "RouteTrailerOptions" || type == "MaintenanceRouteType") {
        return this.options.response;
    } else if (type == "TruckRoutes" ) {
    	return this.options.response != undefined ? this.options.response: [];
    } else if (type == "ProductVolGroups") {
    	return this.options.response;
    } else if (type == "OrgDestType") {
    	return [{text:"Origin"},{text:"Destination"}];
    } else if(type == "CaseTypes") {
    	return getUnqiueCaseTypes();
    } else {
    	return getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()[type].data();
    }
};

SearchPopUp.prototype.filterLocationsData = function(dataType) {
    var locs = this.getLocationsDataSource(dataType);
    var attributes = this.getSearchAttributes(dataType);
    var value = this.searchBox.val();
    var filterData = [];
    var nonMatchingtems = [];
    if (value != null && value.length > 0) {
        var matchingItems = $.grep(locs, function(e) {
            if (e[attributes[0]].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != 0) {
                nonMatchingtems.push(e);
            }
            return e[attributes[0]].toString().toLowerCase().indexOf(value.toString().toLowerCase()) == 0;
        });
        var nonMatchingtems2 = [];
        var matchingItems2 = $.grep(nonMatchingtems, function(e) {
            if (e[attributes[1]].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != 0) {
                nonMatchingtems2.push(e);
            }
            return e[attributes[1]].toString().toLowerCase().indexOf(value.toString().toLowerCase()) == 0;
        });
        var matchingItems3 = [];
        if (dataType == "Locations" || dataType == "ShowNearBy" || dataType == "ActivityFacilities") {
            matchingItems3 = $.grep(nonMatchingtems2, function(e) {
                var desc = e[attributes[2]] + ", " + e[attributes[3]] + " - " + e[attributes[4]];
                return desc.toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0;
            });
        }
        var filterData = $.merge($.merge($.merge(filterData, matchingItems), matchingItems2), matchingItems3);
        return filterData;
    }
    return locs;
};

SearchPopUp.prototype.filterActivitiesData = function(dataType) {
    var locs = this.getLocationsDataSource(dataType);
    var attributes = this.getSearchAttributes(dataType);
    var value = this.searchBox.val();
    var filterData = [];
    var matchingItems = [];
    var nonMatchingtems = [];
    var firstLvlChild;
    var secondLvlChild;
    var thirdLvlChild;
    var secondLvlMaching = [];
    var thirdLvlMaching = [];
    var flag = false;
    var obj = {};
    if (value != null && value.length > 0) {
        for (var i = 0; i < locs.length; i++) {
            firstLvlChild = locs[i].children;
            secondLvlMaching = [];
            for (var j = 0; j < firstLvlChild.length; j++) {
                secondLvlChild = firstLvlChild[j];
                if (secondLvlChild.children) {
                    thirdLvlChild = secondLvlChild.children;
                    thirdLvlMaching = [];
                    for (var k = 0; k < thirdLvlChild.length; k++) {
                        if (thirdLvlChild[k].locCd.toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0) {
                            thirdLvlMaching.push(thirdLvlChild[k]);
                        }
                    }
                    if (thirdLvlMaching.length > 0) {
                        secondLvlMaching.push({
                            locCd: locs[i].locCd,
                            desc: locs[i].desc,
                            children: thirdLvlMaching
                        });
                    }
                } else if (secondLvlChild.locCd.toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0) {
                    secondLvlMaching.push(secondLvlChild);
                }
            }
            if (secondLvlMaching.length > 0) {
                matchingItems.push({
                    locCd: locs[i].locCd,
                    desc: locs[i].desc,
                    children: secondLvlMaching
                });
            }
        }
        return matchingItems;
    }
    return locs;
};

SearchPopUp.prototype.filterLineHaulFeeders = function(event) {
    var locs = getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()["Locations"].data();
    var lineHaul = (event && event.currentTarget && event.currentTarget.value == "lineHaul") ? event.currentTarget : this.checkBoxDiv.children().get(1);
    var feeder = (event && event.currentTarget && event.currentTarget.value == "feeder") ? event.currentTarget : this.checkBoxDiv.children().get(3);
    var matchingItems;
    if (lineHaul.checked && !feeder.checked) {
        matchingItems = $.grep(locs, function(e) {
            return e.facilityUsedAttributes.usedAsCommercialLinehaulLoc == "Y";
        });
    } else if (!lineHaul.checked && feeder.checked) {
        matchingItems = $.grep(locs, function(e) {
            return e.facilityUsedAttributes.usedAsFeederLocation == "Y";
        });
    } else if (lineHaul.checked && feeder.checked) {
        matchingItems = $.grep(locs, function(e) {
            return (e.facilityUsedAttributes.usedAsCommercialLinehaulLoc == "Y" || e.facilityUsedAttributes.usedAsFeederLocation == "Y");
        });
    } else {
        matchingItems = locs;
    }
    if (event) {
        this.setGridDataProvider(matchingItems, "Locations", this.getSearchAttributes("Locations"));
    }
    return matchingItems;
};

SearchPopUp.prototype.onLocTabSelect = function(event) {
    var type = this.getActiveTabType($(event.item));
    this.searchBox.val(this.searchBoxInput[type]);
    this.changeGridColumnWidth(type);
    if (this.windowId == "orignDestWinOrigin" || this.windowId == "selectLocations" || this.windowId == "orignDestWinDest") {
        if (type == "Locations") {
            //this.checkBoxDiv.css("display", "block");
            //this.gridDiv.css("top", "80px");
            this.grid.getColumnByDataField("showNearBy").setVisible(true);
            //this.grid.getColumnByDataField("expandColIcon").setVisible(false);
        } else if (type == "GlobalRegions") {
            //this.checkBoxDiv.css("display", "none");
            //this.gridDiv.css("top", "55px");
            //this.grid.getColumnByDataField("expandColIcon").setVisible(true);
            this.grid.getColumnByDataField("showNearBy").setVisible(false);
        } else {
            //this.checkBoxDiv.css("display", "none");
            //this.gridDiv.css("top", "55px");
            this.grid.getColumnByDataField("showNearBy").setVisible(false);
            //this.grid.getColumnByDataField("expandColIcon").setVisible(false);
        }
    }
    if (this.options.facilityType == "Region" || type == "GlobalRegions" || type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
        this.grid.enableDefaultDisclosureIcon = true;
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "expandColIcon", true);
    } else {
        this.grid.enableDefaultDisclosureIcon = false;
        AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(this.gridId, "expandColIcon", false);
    }
    if (this.windowId == "enterRoute"){
    	if(type == "TruckRoutes"){
    		this.showHideTruckCombo(true);
    	}else{
    		this.showHideTruckCombo(false);
    	}
    } 
    this.searchLocations({
        target: this.searchBox,
        item: $(event.item)
    });
};

SearchPopUp.prototype.changeGridColumnWidth = function(type) {
    if (this.windowId == "orignDestWinOrigin" || this.windowId == "selectLocations" || this.windowId == "orignDestWinDest") {
        var column = this.grid.getColumnByDataField("locCd");
        if (type == "FacilityGroups") {
            column.setWidth(120);
        } else {
            column.setWidth(50);
        }
    }
};

SearchPopUp.prototype.getSearchAttributes = function(type) {
    switch (type) {
    case 'Locations':
    case 'ShowNearBy':
        return ["locCd", "city", "provStCd", "countryCd", "facType"];
        break;
    case 'FacilityGroups':
        return ["groupName", "grpDesc"];
        break;
    case 'CountryCodes':
        return ["countryCode", "countryDesc"];
        break;
    case 'GlobalRegions':
        return ["globalRgnCd", "globalRgnDesc"];
        break;
    case 'FlightEquipmentTypes_1':
    case 'FlightEquipmentTypes_2':
        return ["eqType", "eqTypeDesc", "conveyance"];
        break;
    case 'FlightEquipmentTypes_Y':
        return ["eqType", "eqTypeDesc", "isCommercialLinehaul"];
        break;
    case 'TruckEquipmentTypes_S':
    case 'TruckEquipmentTypes_O':
        return ["eqType", "eqTypeDesc", "capacityType"];
        break;
    case 'FlightLegTypes':
    case 'TruckLegTypes':
    case 'OtherLegTypes':
        return ["legTypeCd", "legTypeDesc"];
        break;
    case 'FlightFilterLegTypes':
    case 'TruckFilterLegTypes':
        return ["legTypeCd", "legTypeDesc"];
        break;
    case 'FlightFilterEquipTypes':
    case 'TruckFilterEquipTypes':
        return ["eqType", "eqTypeDesc"];
        break;
    case 'Products':
        return ["productName", "productDesc"];
        break;
    case 'ProductGroups':
        return ["prodGrpName", "prodGrpDesc"];
        break;
    case 'ActivityFacilities':
        return ["locCd", "city", "provStCd", "countryCd", "facType"];
        break;
    case 'PreviousActivity':
    case 'PrimaryActivity':
    case 'NextActivity':
        return ["locCd", "desc"];
        break;
    case "RouteLocations":
        return ["locationCd", "locationDesc"];
        break;
    case "RouteLegTypes":
        return ["legTypeCd", "legTypeDesc"];
        break;
    case "RouteEquipTypes":
        return ["equipTypeCd", "equipTypeDesc"];
        break;
    case "RouteCarrierTypes":
        return ["carrierTypeCd", "carrierTypeDesc"];
        break;
    case "RouteScacCodeTypes":
        return ["scacCd", "scacCdDesc"];
        break;
    case "RouteRouteTypes":
        return ["routeTypeCd", "routeTypeDesc"];
        break;
    case "RouteManagerTypes":
        return ["managerId", "managerDesc"];
        break;
    case "RouteTrailerTypes":
        return ["trailerTypeCd", "trailerTypeDesc"];
        break;
    case "RouteTrailerOptions":
        return ["trailerOptionCd", "trailerOptionDesc"];
        break;
    case "FlightRoutes":
        return ["firstNbr", "lastNbr","flightNbrDesc"];
        break;
	case "TruckRoutes":
	    return ["mvNbr","mvNbr"];
	    break;
	case "MaintenanceRouteType":
		return ["text","value"];
		break;
	 case 'ProductVolGroups':
		 return ["productGroupName","productGroupDesc"];
		 break;
	 case 'OrgDestType':
		 return  ["text","text"];
		 break;
	 case 'CaseTypes' :
		 return ["caseType", "caseDesc"];
		 break;
    }
};

SearchPopUp.prototype.getActiveTabType = function(item) {
    if (item == null && this.tabStrip != null) {
        item = this.tabStrip.find("li.k-tab-on-top.k-state-active");
    }
    if (item != null && item.length < 1 && this.tabStrip != null) {
        item = this.tabStrip.find("li.k-tab-on-top.k-state-active");
    }
    var type;
    if (item != null && item.text() == "Locations") {
        type = "Locations";
    } else if (item != null && item.text() == "Facility Groups") {
        type = "FacilityGroups";
    } else if (item != null && item.text() == "Countries") {
        type = "CountryCodes";
    } else if (item != null && item.text() == "Regions") {
        type = "GlobalRegions";
    } else if (this.windowId == "equipmentType" && item != null && (item.text() == "Flight Feeder")) {
        type = "FlightEquipmentTypes_1";
    } else if (this.windowId == "equipmentType" && item != null && (item.text() == "Flight Trunk")) {
        type = "FlightEquipmentTypes_2";
    } else if (this.windowId == "equipmentType" && item != null && (item.text() == "Flight CLH")) {
        type = "FlightEquipmentTypes_Y";
    } else if (this.windowId == "equipmentType" && item != null && item.text() == "Truck Standard") {
        type = "TruckEquipmentTypes_S";
    } else if (this.windowId == "equipmentType" && item != null && item.text() == "Truck Oversize") {
        type = "TruckEquipmentTypes_O";
    } else if (this.windowId == "legType" && item != null && item.text() == "Flights") {
        type = "FlightLegTypes";
    } else if (this.windowId == "legType" && item != null && item.text() == "Trucks") {
        type = "TruckLegTypes";
    } else if (this.windowId == "legType" && item != null && item.text() == "Others") {
        type = "OtherLegTypes";
    } else if (this.windowId == "showNearBy") {
        type = "ShowNearBy";
    } else if (this.windowId == "flightLegTypes" || this.windowId == "flightLegTypesOverlay") {
        type = "FlightFilterLegTypes";
    } else if (this.windowId == "truckLegTypes" || this.windowId == "truckLegTypesOverlay") {
        type = "TruckFilterLegTypes";
    } else if (this.windowId == "flightEquipTypes" || this.windowId == "flightEquipTypesOverlay") {
        type = "FlightFilterEquipTypes";
    } else if (this.windowId == "truckEquipTypes" || this.windowId == "truckEquipTypesOverlay") {
        type = "TruckFilterEquipTypes";
    } else if (this.windowId == "productsTextArea") {
        type = "Products";
    } else if (this.windowId == "productGroupsTextArea") {
        type = "ProductGroups";
    } else if (this.windowId == "productVolGroupsTextArea") {
        type = "ProductVolGroups";
    } else if(this.windowId == "orgDestTextArea"){
    	type = "OrgDestType";
    } else if (this.windowId == "preActivitiesGridLocation" || this.windowId == "priActivitiesGridLocation" || this.windowId == "nxtActivitiesGridLocation") {
        if (this.options.facilityType == "Location") {
            type = "ActivityFacilities";
        } else if (this.options.facilityType == FACILITY_GROUP) {
            type = "FacilityGroups";
        } else if (this.options.facilityType == "Country") {
            type = "CountryCodes";
        } else if (this.options.facilityType == "Region") {
            type = "GlobalRegions";
        } else {
            type = "ActivityFacilities";
        }
    } else if (this.windowId == "preActivitiesGridTransits" || this.windowId == "priActivitiesGridTransits" || this.windowId == "nxtActivitiesGridTransits") {
        type = "ActivityFacilities";
    } else if (this.windowId == "preActivitiesGridActivity") {
        type = "PreviousActivity";
    } else if (this.windowId == "priActivitiesGridActivity") {
        type = "PrimaryActivity";
    } else if (this.windowId == "nxtActivitiesGridActivity") {
        type = "NextActivity";
    } else if (this.windowId == "routeLocationTextArea") {
        type = "RouteLocations";
    } else if (this.windowId == "routeLegTypeTextArea") {
        type = "RouteLegTypes";
    } else if (this.windowId == "routeEquipTypeTextArea") {
        type = "RouteEquipTypes";
    } else if (this.windowId == "carrierTypeTextArea") {
        type = "RouteCarrierTypes";
    } else if(this.windowId == "scacCodeTextArea") {
    	type = "RouteScacCodeTypes";
    } else if(this.windowId == "routeTypeTextArea") {
    	type = "RouteRouteTypes";
    } else if(this.windowId == "managerTextArea") {
    	type = "RouteManagerTypes";
    } else if(this.windowId == "trailerTypeTextArea") {
    	type = "RouteTrailerTypes";
    } else if(this.windowId == "trailerOptionTextArea") {
    	type = "RouteTrailerOptions";
    } else if (this.windowId == "enterRoute") {
        if(item != null && item.text() == "Truck"){
        	type = "TruckRoutes";
        }else{
        	type = "FlightRoutes";
        }
    } else if (this.windowId == "scheduleMaintenanceRouteType" || this.windowId == "skdMxMapRouteType") {
    	type  = "MaintenanceRouteType";
    } else if(this.windowId == "caseTypes") {
    	type = "CaseTypes";
    }
    return type;
};

SearchPopUp.prototype.getRadius = function() {
    return this.dropDownBox.val();
};


SearchPopUp.prototype.bindEventListeners = function() {
    var searchComponent = this;
    if (this.gridId != undefined) {
        $("#" + this.gridId + "ApplyBtn").click(function() {
            searchComponent.gridApplyHandler();
        });

        $("#" + this.gridId + "SelectAllBtn").click(function() {
            searchComponent.gridSelectionHandler();
        });

        $("#" + this.gridId + "ClearAllBtn").click(function() {
            searchComponent.gridClearHandler();
        });
    }
};

SearchPopUp.prototype.gridSelectionHandler = function() {
    this.checkSelections();
    this.setAllSelections();
    //this.clearGridBorder();
};

SearchPopUp.prototype.checkSelections = function(selectionsList, type) {
    if (selectionsList != undefined) {
        AdvancedDataGrid.setSelectedKeys(this.gridId, selectionsList);
        AdvancedDataGrid.setSelectedKeysState(this.gridId, flexiciousNmsp.TriStateCheckBox.STATE_CHECKED, selectionsList);
    } else {
        AdvancedDataGrid.setSelectAllState(this.gridId, flexiciousNmsp.TriStateCheckBox.STATE_CHECKED);
    }
};

SearchPopUp.prototype.uncheckSelections = function(selectionsList) {
    if (selectionsList != undefined) {
        AdvancedDataGrid.setSelectedKeys(this.gridId, selectionsList);
    }
    AdvancedDataGrid.setSelectAllState(this.gridId, flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED);
};

SearchPopUp.prototype.gridClearHandler = function() {
    this.uncheckSelections();
    this.updateSelectionsList();
    //this.clearGridBorder();
};



SearchPopUp.prototype.updateSelectionsList = function() {
    var delLocations = this.getLocationCodesDataProvider();
    if (delLocations != undefined) {
        this.removeItem(this.selections, delLocations);
    }
};

SearchPopUp.prototype.getLocationCodesDataProvider = function() {
    var grid = AdvancedDataGrid.getAdvancedDataGrid(this.gridId);
    if (grid != undefined) {
        var dataProvider = grid.getDataProvider();
        if (dataProvider != undefined) {
            var delLocations = [];
            for (var item in dataProvider) {
                delLocations.push(dataProvider[item]["locCd"]);
            }
            return delLocations;
        }
    }
};

SearchPopUp.prototype.gridApplyHandler = function() {
    if (this.options != undefined && this.options.setApplyResponseHandler != undefined) {
        this.formatLocationsAry();
    }
    this.clear();
    //this.clearGridBorder();
    this.searchPopUpWin.data("kendoWindow").close();
};

SearchPopUp.prototype.ClearNClosePopup = function() {
	this.clear();
	this.searchPopUpWin.data("kendoWindow").close();
};

SearchPopUp.prototype.getAllSelections = function() {
    this.setAllSelections();
    return this.selections;
};

SearchPopUp.prototype.setAllSelections = function() {
    var gridSelections = AdvancedDataGrid.getSelectedKeys(this.gridId);
    if (gridSelections != undefined) {
        $.merge(this.selections, gridSelections);
    }
};

SearchPopUp.prototype.setSelectedActivities = function(item) {
    if (item && item.children) {
        for (var i = 0; i < item.children.length; i++) {
            this.setSelectedActivities(item.children[i]);
        }
    } else {
        if (this.selections.indexOf(item["locCd"]) < 0) {
            this.selections.push(item["locCd"]);
        }
    }
};

SearchPopUp.prototype.removeSelectedActivities = function(item) {
    if (item && item.children) {
        for (var i = 0; i < item.children.length; i++) {
            this.removeSelectedActivities(item.children[i]);
        }
    } else {
        this.removeItem(this.selections, [item["locCd"]]);
    }
};

SearchPopUp.onHeaderItemClickHandler = function(event) {
	var checkBox = $(event.cell.domElement).find(".checkBox");
	var searchPopUp = event.grid["searchPopUp"];
	var type = searchPopUp.getActiveTabType();
	if(checkBox && checkBox.length > 0) {
		if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
			if(event.grid.getDataProvider() && event.grid.getDataProvider().length > 0) {
				for(var i=0;i<event.grid.getDataProvider().length;i++) {
					searchPopUp.setSelectedActivities(event.grid.getDataProvider()[i]);
				}
			}
		}
	}else {
		if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
			if(event.grid.getDataProvider() && event.grid.getDataProvider().length > 0) {
				for(var i=0;i<event.grid.getDataProvider().length;i++) {
					searchPopUp.removeSelectedActivities(event.grid.getDataProvider()[i]);
				}
			}
		}
	}
};

SearchPopUp.onItemClickHandler = function(event) {
    var searchPopUp = event.grid["searchPopUp"];
    var type = searchPopUp.getActiveTabType();
    if (event.isItemSelected) {
        if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
            searchPopUp.setSelectedActivities(event.item);
        } else if (type == "RouteLocations" || type == "RouteLegTypes" || type == "RouteEquipTypes" || type == "RouteScacCodeTypes" 
        	|| type == "RouteManagerTypes" || type == "RouteTrailerTypes" || type == "RouteTrailerOptions" || type == "MaintenanceRouteType") {
            searchPopUp.selections = [(event.item["locCd"])];
        } else if(type == "RouteCarrierTypes" || type == "RouteRouteTypes"){
        	searchPopUp.selections = [(event.item["desc"])];
        }else {
            searchPopUp.selections.push(event.item["locCd"]);
            if (type == "GlobalRegions") {
                var tempArray = [];
                $.each(searchPopUp.selections, function(key, value) {
                    try {
                        var gregion = value.split("_")[0];
                        if (value.indexOf("_") > -1 && searchPopUp.selections.indexOf(gregion) > -1) {
                            tempArray.push(value);
                        }
                    } catch (e) {

                    }
                });
                searchPopUp.removeItem(searchPopUp.selections, tempArray);
            }
        }
    } else {
        if (type == "PreviousActivity" || type == "PrimaryActivity" || type == "NextActivity") {
            searchPopUp.removeSelectedActivities(event.item);
        } else {
            if (event.item.children) {
                var array = [];
                $.each(event.item.children, function(key, value) {
                    array.push(value.locCd);
                });
                searchPopUp.removeItem(searchPopUp.selections, $.merge([event.item["locCd"]], array));
            } else {
                searchPopUp.removeItem(searchPopUp.selections, [event.item["locCd"]]);
            }
        }
    }
    if (event.column.dataField == "showNearBy") {
        var parentId = event.grid.searchPopUp.windowId;
        openSelectLocDialog("showNearBy", "Show nearby locations (" + event.item["locCd"] + ")", event.item["locCd"], parentId, null, null, null, event.grid.searchPopUp.searchPopUpWin.parent());
        searchPopUp.changeIconColor(event);
    }
};

SearchPopUp.prototype.nextLvlItemClickHandler = function(event) {
    //event.grid.searchPopUp.clearGridBorder();
};

SearchPopUp.prototype.changeIconColor = function(event) {
    $(this.grid.domElement).find("img").attr("src", "pegasus/assets/icons/add-nearby.png");
    $(event.cell.domElement).find("img").attr("src", "pegasus/assets/icons/add-nearby-gray.png");
};

SearchPopUp.prototype.setNearByLocationsData = function() {
    var searchPopUp = this;
    callService({
        url: getNearByLocationsRenderer() + "&rand=" + getTime(),
        paramsMap: {
            locCd: this.options.nearByLoc,
            radius: this.getRadius(),
            type: "Locations"
        },
        successCallback: function(response, io) {
            var type = searchPopUp.getActiveTabType();
            attributes = searchPopUp.getSearchAttributes(type);
            searchPopUp.setGridDataProvider(response, type, attributes);
            searchPopUp.nearByLocsData = response;
            searchPopUp.checkSelections(searchPopUp.selections);
        },
        showProgressWindow: false
    });
};

SearchPopUp.prototype.removeItem = function(allElements, delElements) {
    if (delElements != undefined && allElements != undefined) {
        var itemIndex;
        var count = delElements.length;
        for (var i = (count - 1); i >= 0; i--) {
            do {
                itemIndex = allElements.indexOf(delElements[i]);
                if (itemIndex != -1) {
                    allElements.splice(itemIndex, 1);
                }
                itemIndex = allElements.indexOf(delElements[i]);
            } while (itemIndex != -1);
        }
    }
};


SearchPopUp.prototype.clear = function() {
    this.selections = [];
    this.searchBoxInput = [];
    //this.clearGridBorder();
    if (this.tabStrip && $(this.tabStrip).data("kendoTabStrip").select().index() != 0) {
        $(this.tabStrip).data("kendoTabStrip").select(0);
    } else {
        this.onLocTabSelect({});
    }
};


SearchPopUp.prototype.windowOpenLisetner = function(event) {
    if (this.options != undefined && this.options.getApplyResponseHandler != undefined) {
        var inputLocations;
        if (this.windowId == "flightLegTypes" || this.windowId == "truckLegTypes" || this.windowId == "flightEquipTypes" || this.windowId == "truckEquipTypes" ||
        		this.windowId == "flightLegTypesOverlay" || this.windowId == "truckLegTypesOverlay" || this.windowId == "flightEquipTypesOverlay" 
        			|| this.windowId == "truckEquipTypesOverlay" || this.windowId == "caseTypes") {
            this.onLocTabSelect({});
            inputLocations = this.options.getApplyResponseHandler(this.windowId);
            if (inputLocations != undefined && inputLocations != "") {
                this.selections = inputLocations.split(",");
                this.checkSelections(this.selections);
            }
            //this.selections = [];
            this.searchBoxInput = [];
            //this.clearGridBorder();
        } else if (this.windowId == "selectLocations") {
            this.onLocTabSelect({});
            var tabstrip = $(this.tabStrip).data("kendoTabStrip");
            //disable the items
            tabstrip.disable(Array.prototype.slice.call(tabstrip.items()).slice(1, 4));
            inputLocations = this.options.getApplyResponseHandler(this.windowId);
            if (inputLocations != undefined) {
                this.selections = inputLocations;
                this.checkSelections(this.selections);
            }

            //this.searchBoxInput = [];
            //this.clearGridBorder();
        } else {
            this.clear();
        }
    }
};

SearchPopUp.prototype.formatLocationsStr = function(locationStr) {
    var locationsList;
    if (locationStr != undefined) {
        return locationStr.replace(/ /g, ",").split(",");
    }
};

SearchPopUp.prototype.formatLocationsAry = function() {
    var locationAry = this.selections;
    if (this.selections != undefined && this.options != undefined && this.options.getApplyResponseHandler != undefined) {
        if (this.options["isUniqueObjects"] == undefined || this.options["isUniqueObjects"]) {
            //get all the locations from origin's or destination's
            var inputLocations;
            if (this.windowId == "showNearBy") {
                inputLocations = this.options.getApplyResponseHandler(this.options.parentId);
            } else {
                inputLocations = this.options.getApplyResponseHandler(this.windowId);
            }
            if (inputLocations != undefined) {
                //format the input string to an array of locations..
                var schedLocs = this.formatLocationsStr(inputLocations.toString().toUpperCase());
                var uniqueSchedLocs = [];
                if (locationAry != undefined) {
                    var itemIndex;
                    for (var i = 0; i < locationAry.length; i++) {
                        itemIndex = schedLocs.indexOf(locationAry[i].toString().toUpperCase());
                        if (itemIndex == -1 && locationAry[i] != "" && locationAry[i] != " ") {
                            uniqueSchedLocs.push(locationAry[i]);
                        }
                    }
                    this.options.setApplyResponseHandler(this.windowId, uniqueSchedLocs, this.options);
                }
            }
        } else {
            this.options.setApplyResponseHandler(this.windowId, locationAry, this.options);
        }
    }
};
SearchPopUp.prototype.truckRoutesCallback = function(response, io) {
	parent.showProgressDialog(false);
	if(response != undefined && response.availableRouteNumberList != undefined){
		var popUp = searchPopUpMap['enterRoute'];
		var type = "TruckRoutes";
		popUp.options.response = response.availableRouteNumberList.availableRouteNumber;
		popUp.setGridDataProvider(popUp.options.response,type, popUp.getSearchAttributes(type));
		
		delete popUp;
		delete type;
	}
};
SearchPopUp.prototype.showHideTruckCombo = function(isShow){
	var dropdownlist = $("#truckTypeCmbo").data("kendoComboBox");
	if(isShow){
		dropdownlist.wrapper.show();
	}else{
		dropdownlist.wrapper.hide(); 
	}
};