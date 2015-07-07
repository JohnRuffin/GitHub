function SkdMxMapDrawerController() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function(btnObj) {
        this.selectedPointer = "Default";
    };

    constructorFn.isActiveValidateNow = function(isSkdMxActive) {
        if ((!SkdMxHelper.getMapOpeationManager().isActiveMode()) || !isSkdMxActive) {
            ESRIHelper.getEsriGraphicManager().resetRouteSelection();
            ESRIHelper.getEditToolManager().deActivate();
        }
    };

    /**
     * Fdx / FDX-1292
     * SMD: 8888 Create Route Allows Mix Mode in Locations
     * Update the mode whenever the user selects the type of route he/she want to create
     */
    constructorFn.updateMode = function() {
        if (parent.scheduleMaintenananceSeletedMenu == "" || parent.scheduleMaintenananceSeletedMenu == undefined) {
            parent.scheduleMaintenananceSeletedMenu = MODE_CODES.FLT_TRUNK;
        }
        if(parent.scheduleMaintenananceSeletedMenu == MODE_CODES.FLT_FEEDER
            || parent.scheduleMaintenananceSeletedMenu == MODE_CODES.FLT_TRUNK || parent.scheduleMaintenananceSeletedMenu == "FI" || parent.scheduleMaintenananceSeletedMenu == MODE_CODES.FLT_CLH){
            SkdMxHelper.getMapOpeationManager().setMode("Flight");
        }else {
            SkdMxHelper.getMapOpeationManager().setMode("Truck");
        }
    };

    constructorFn.isTruckMode = function() {
        if (parent.scheduleMaintenananceSeletedMenu == "" || parent.scheduleMaintenananceSeletedMenu == undefined) {
            parent.scheduleMaintenananceSeletedMenu = MODE_CODES.FLT_TRUNK;
        }

        return SkdMxHelper.getMapOpeationManager().getMode() == "Truck" || parent.scheduleMaintenananceSeletedMenu != MODE_CODES.FLT_FEEDER
            && parent.scheduleMaintenananceSeletedMenu != MODE_CODES.FLT_TRUNK && parent.scheduleMaintenananceSeletedMenu != "FI" && parent.scheduleMaintenananceSeletedMenu != MODE_CODES.FLT_CLH;
    };

    constructorFn.showDomElement = function(domIds) {
        if(domIds != undefined){
            for(var i=0; i<domIds.length; i++ ){
                if(domIds[i] != undefined){
                    $("#"+domIds[i]).show();
                }
            }
        }
    };

    constructorFn.hideDomElement = function(domIds) {
        if(domIds != undefined){
            for(var i=0; i<domIds.length; i++ ){
                if(domIds[i] != undefined){
                    $("#"+domIds[i]).hide();
                }
            }
        }
    };

    constructorFn.resetSkdMxDrawerOnPlanChangeHandler = function() {
        if(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap != undefined){
            var routeIds = Object.keys(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap);
            if(routeIds  != undefined){
                showProgressDialog(true, "Please wait...");
                var routeId;
                for(var i=0; i< routeIds.length; i++ ){
                    routeId = routeIds[i];
                    if(routeId  != undefined){
                        SkdMxHelper.getSkdMxGridComponentManager().updateSelectionByRouteId(routeId);
                        this.selectPointer(document.getElementById("btnCancelPointer"));
                    }
                }
                showProgressDialog(false);
            }
        }
    };

    /**
     *
     * @param btnObj
     */
    constructorFn.selectPointer = function(btnObj, flag, isDuplicate) {
        if (isScheduleMaintainance()) {
            switch (btnObj.id) {
                case "btnDefaultPointer":
                    this.selectedPointer = "Default";
                    SkdMxHelper.getMapOpeationManager().setSelectRoute(true);
                    $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", false);
                    this.showDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "btnAddPointer":
                    this.selectedPointer = "Add";
                    SkdMxHelper.getMapOpeationManager().setAddLeg(true);
                    $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", "disabled");
                    this.hideDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "btnDeletePointer":
                    this.selectedPointer = "Delete";
                    SkdMxHelper.getMapOpeationManager().setDeleteLeg(true);
                    $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", "disabled");
                    this.hideDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "btnCancelPointer":
                    this.selectedPointer = "Cancel";
                    SkdMxHelper.getMapOpeationManager().setCancelLeg(true);
                    this.showDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "btnSkdMxAddRoute":
                    if (!SkdMxHelper.getSkdMxGridComponentManager().isEmptyRoute()) { //returns true if we have grid with zero lanes
                        this.selectedPointer = "Default";
                        SkdMxHelper.getMapOpeationManager().setAddRoute(true);
                        $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", false);
                        //$("#flightTypeCmb").data("kendoDropDownList").enable(true);
                    } else {
                        parent.showErrorMsg("Please add lanes or delete the empty route");
                    }
                    break;
                case "btnSkdMxRouteTypeSelection":
                    parent.VIEWER.openRouteSelectionSearchPopup("skdMxMapRouteType", document.getElementById("btnSkdMxRouteTypeSelection"));
                    break;
                /* case "btnSMEdit":
                 if(!SkdMxHelper.getSkdMxGridComponentManager().isValidRoute(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute)){
                 parent.showErrorMsg("Please select route before moving to route editor");
                 return;
                 }
                 this.selectedPointer = "Edit to RE";
                 SkdMxHelper.getMapOpeationManager().setMoveToRE(true);
                 this.showDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                 break;*/
                case "saveToWip":
                    SkdMxHelper.getSkdMxGridComponentManager().setMoveNumber($("#moveNumCell_"+SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute).val(), SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
                    if(!SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSave(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute, isDuplicate)){
                        parent.showErrorMsg("Please select route or fill all the information before saving to WIP.");
                        return;
                    }
                    this.selectedPointer = "Save to WIP";
                    SkdMxHelper.getMapOpeationManager().setSaveToWIP(true);
                    this.showDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "saveToSchedule":
                    SkdMxHelper.getSkdMxGridComponentManager().setMoveNumber($("#moveNumCell_"+SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute).val(), SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
                    if(!SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSave(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute)){
                        parent.showErrorMsg("Please select route or fill all the information before saving to Schedule.");
                        return;
                    }
                    this.selectedPointer = "Save to Schedule";
                    SkdMxHelper.getMapOpeationManager().setSaveToSchedule(true);
                    this.showDomElement(["btnSkdMxRouteTypeSelection", "btnSMDuplicate"]);
                    break;
                case "btnSMDuplicate":
                    if(!SkdMxHelper.getSkdMxGridComponentManager().isValidRoute(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute)){
                        parent.showErrorMsg("Please select route before duplicating a route");
                        return;
                    }
                    parent.showProgressDialog(true, "Duplicating the route...");
                    if (!SkdMxHelper.getSkdMxGridComponentManager().isEmptyRoute()) { //returns true if we have grid with zero lanes
                        this.selectedPointer = "Duplicate";
                        SkdMxHelper.getMapOpeationManager().setDuplicateRoute(true);
                        $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", false);
                    } else {
                        parent.showErrorMsg("Please add lanes or delete the empty route");
                    }
                    break;
                case "deleteFromSchedule" :
                    if(!SkdMxHelper.getSkdMxGridComponentManager().isValidRoute(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute)){
                        parent.showErrorMsg("Please select route to delete");
                        return;
                    }
                    showConfirmation(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute], "routeRow");
            }
            this.iconStyleChangeHandler(btnObj);
            this.validateOperation(isDuplicate);
            parent.oldEquipType = "";  //reset the equipment type
        } else {
            this.selectedPointer = "Default";
            SkdMxHelper.getMapOpeationManager().setDeleteLeg(false);
            SkdMxHelper.getMapOpeationManager().setAddLeg(false);
            SkdMxHelper.getMapOpeationManager().setSelectRoute(false);
            SkdMxHelper.getMapOpeationManager().setAddRoute(false);
        }
        this.changeCursor(this.selectedPointer);
    };



    constructorFn.restoreSkdMxState = function() {
        switch(this.selectedPointer){
            case "btnDefaultPointer":
            case "btnAddPointer":
            case "btnDeletePointer":
            case "btnCancelPointer":
            case "btnSkdMxAddRoute":
            /*case "btnSMEdit":*/
            case "btnSMDuplicate":
            default:
                this.selectedPointer = "Default";
                SkdMxHelper.getMapOpeationManager().setSelectRoute(false);
                SkdMxHelper.getMapOpeationManager().setAddLeg(false);
                SkdMxHelper.getMapOpeationManager().setDeleteLeg(false);
                SkdMxHelper.getMapOpeationManager().setCancelLeg(false);
                SkdMxHelper.getMapOpeationManager().setAddRoute(false);
                SkdMxHelper.getMapOpeationManager().setMoveToRE(false);
                SkdMxHelper.getMapOpeationManager().setSaveToWIP(false);
                SkdMxHelper.getMapOpeationManager().setSaveToSchedule(false);
                SkdMxHelper.getMapOpeationManager().setDuplicateRoute(false);
                //Fdx / FDX-1292
                //SMD: 8888 Create Route Allows Mix Mode in Locations
                // => reset the mode whenever the user is not in SMD mode
                SkdMxHelper.getMapOpeationManager().setMode("");
                $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']").attr("disabled", false);
                $("#btnSkdMxRouteTypeSelection").show();
                $("#btnSMDuplicate").show();
                break;
        }
        this.iconStyleChangeHandler({id: "restore"});
    };

    constructorFn.changeCursor = function(cursors) {
        switch (cursors) {
            case "Default":
                dojo.byId("map_layers").style.cursor = "url('" + parent.WSSO_URL + "/pegasus/assets/cursor/cursor_Select.cur'),crosshair";
                break;
            case "Delete":
                dojo.byId("map_layers").style.cursor = "url('" + parent.WSSO_URL + "/pegasus/assets/cursor/cursor_Delete.cur'),crosshair";
                break;
            case "Add":
                dojo.byId("map_layers").style.cursor = "url('" + parent.WSSO_URL + "/pegasus/assets/cursor/cursor_Add3.cur'),crosshair";
                break;
            default:
                dojo.byId("map_layers").style.cursor = "default";
        }
    };

    constructorFn.validateOperation = function(isDuplicate) {
        if (this.selectedPointer != undefined) {
            if (SkdMxHelper.getMapOpeationManager().isAddLeg()) {
                this.validateAddLegOperationNow();
            } else if (SkdMxHelper.getMapOpeationManager().isDeleteLeg()) {
                this.validateDeleteOperationNow();
            } else if (SkdMxHelper.getMapOpeationManager().isSelectRoute()) {
                this.validateSelectRouteOperationNow();
            } else if (SkdMxHelper.getMapOpeationManager().isAddRoute()) {
                this.validateAddRouteOperationNow();
            } else if (SkdMxHelper.getMapOpeationManager().isCancelRoute()) {
                SkdMxHelper.getSkdMxGridComponentManager().clear(ESRIHelper.getEditToolManager().getRouteId());
                this.validateCancelRouteOperationNow(true);
                //SkdMxHelper.getSkdMxGridComponentManager().cancelGridUpdates();
                ESRIHelper.getEditToolManager().setRouteId(undefined);
            } else if (SkdMxHelper.getMapOpeationManager().isMoveToRE()) {
                /*this.editRoute(document.getElementById("btnSMEdit"));
                 SkdMxHelper.getSkdMxGridComponentManager().clear(ESRIHelper.getEditToolManager().getRouteId());
                 this.validateCancelRouteOperationNow(false);
                 //SkdMxHelper.getSkdMxGridComponentManager().cancelGridUpdates();
                 ESRIHelper.getEditToolManager().setRouteId(undefined);*/
            } else if (SkdMxHelper.getMapOpeationManager().isSaveToWIP()) {
                this.saveToWIP(document.getElementById("saveToWip"), isDuplicate);
                SkdMxHelper.getSkdMxGridComponentManager().clear(ESRIHelper.getEditToolManager().getRouteId());
                //FdxFDX-1260: MAP..WIP sync issue
                this.validateCancelRouteOperationNow(false);
                //SkdMxHelper.getSkdMxGridComponentManager().cancelGridUpdates();
                ESRIHelper.getEditToolManager().setRouteId(undefined);
            } else if (SkdMxHelper.getMapOpeationManager().isSaveToSchedule()) {
                this.saveToSchedule(document.getElementById("saveToSchedule"));
            } else if (SkdMxHelper.getMapOpeationManager().isDuplicateRoute()) {
                this.validateDuplicateRouteOperationNow();
            }
        }
    };

    constructorFn.validateAddLegOperationNow = function() {
        ESRIHelper.getEditToolManager().validateAddLegOperationNow();
    };

    constructorFn.validateDeleteOperationNow = function() {
        ESRIHelper.getEditToolManager().validateDeleteOperationNow();
    };

    constructorFn.validateSelectRouteOperationNow = function() {
        ESRIHelper.getEditToolManager().validateSelectRouteOperationNow();
    };

    constructorFn.validateAddRouteOperationNow = function() {
        SkdMxHelper.getMapOpeationManager().setNewRoute(true);
        SkdMxHelper.getSkdMxGridComponentManager().createRoute(parent.scheduleMaintenananceSeletedMenu);
    };

    constructorFn.validateDuplicateRouteOperationNow = function() {
        SkdMxHelper.getSkdMxGridComponentManager().createRoute(parent.scheduleMaintenananceSeletedMenu, undefined, {
            routeId: SkdMxHelper.getMapOpeationManager().getRouteId()
        });

    };

    constructorFn.validateCancelRouteOperationNow = function(isClear) {
        ESRIHelper.getEditToolManager().validateCancelRouteOperationNow(isClear);
    };

    constructorFn.selectFirstRouteHandler = function() {
        if(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap != undefined){
            var routeIds = Object.keys(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap);
            if(routeIds  != undefined && routeIds.length > 0){
                SkdMxHelper.getSkdMxGridComponentManager().updateSelectionByRouteId(routeIds[0]);
            }
        }
    };

    constructorFn.clearGraphicLayers = function(isClear) {
        ESRIHelper.getEditToolManager().clearLayers(isClear);
    };

    constructorFn.isRouteSelected = function() {
        return $("input:radio[name ='SchdleMntnceMapDwrGridRadio_Grp']:checked").length > 0;
    };



    constructorFn.invokeOperatoin = function(event) {
        if (this.selectedPointer != undefined) {
            if (SkdMxHelper.getMapOpeationManager().isAddLeg()) {
                ESRIHelper.getEditToolManager().activateAddLegHandler(event);
            } else if (SkdMxHelper.getMapOpeationManager().isAddRoute() || SkdMxHelper.getMapOpeationManager().getRouteId() == undefined) {
                if (SkdMxHelper.getMapOpeationManager().getRouteId() == undefined) {
                    SkdMxHelper.getMapOpeationManager().setRouteId(undefined, true);
                }
                ESRIHelper.getEditToolManager().activateAddRouteHandler(event);
            }
        }
    };

    /**
     *
     */
    constructorFn.iconStyleChangeHandler = function(btnObj) {
        switch (btnObj.id) {
            case "btnDefaultPointer":
                this.styleChangeHandler(["btnDefaultPointer"], true);
                this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnAddPointer", "btnDeletePointer", "btnCancelPointer"], false);
                break;
            case "btnAddPointer":
                this.styleChangeHandler(["btnAddPointer"], true);
                this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnDefaultPointer", "btnDeletePointer", "btnCancelPointer"], false);
                break;
            case "btnDeletePointer":
                this.styleChangeHandler(["btnDeletePointer"], true);
                this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnDefaultPointer", "btnAddPointer", "btnCancelPointer"], false);
                break;
            case "btnCancelPointer":
                this.styleChangeHandler(["btnCancelPointer"], true);
                this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnDefaultPointer", "btnAddPointer", "btnDeletePointer"], false);
                break;
            case "btnSkdMxAddRoute":
                this.styleChangeHandler(["btnSkdMxAddRoute"], true);
                this.styleChangeHandler(["btnCancelPointer", "btnDefaultPointer", "btnAddPointer", "btnDeletePointer"], false);
                break;
            /* case "btnSMEdit":
             this.styleChangeHandler(["btnSMEdit"], true);
             this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnCancelPointer", "btnDefaultPointer", "btnAddPointer", "btnDeletePointer"], false);
             break;*/
            case "restore":
                this.styleChangeHandler(["btnSkdMxAddRoute", "btnSkdMxRouteTypeSelection", "btnCancelPointer", "btnDefaultPointer", "btnAddPointer", "btnDeletePointer"], false);
                break;
        }
    };

    /**
     *
     */
    constructorFn.styleChangeHandler = function(buttonIds, isActive) {
        if (buttonIds) {
            for (var i = 0; i < buttonIds.length; i++) {
                if (!isActive) {
                    $("#" + buttonIds[i]).removeClass("iconbtn-active");
                    $("#" + buttonIds[i]).removeClass("n-icon-active");
                } else {
                    $("#" + buttonIds[i]).addClass("iconbtn-active");
                    $("#" + buttonIds[i]).addClass("n-icon-active");
                }
            }
        }
    };

    constructorFn.paintSkdMxDrawerWizard = function(laneOrLegGraphic) {
        //get route ids
        var routeIds = ESRIHelper.getEsriGraphicManager().getRouteIdFromGraphic(laneOrLegGraphic);
        var isNetworkSchedule = parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX == true ? true : false;
        if (!ESRIHelper.getEditToolManager().isAlreadySelectedRoute(routeIds[0])) {
            //populate the grid
            var rowData = (ESRIHelper.getEsriGraphicManager().getLegDetailsByRoute(routeIds[0]))[0];
            if(rowData == undefined){
                return;
            }
            showProgressDialog(true, "Retrieving route data...");
            parent.callScheduleRouteDataService(null, rowData, "copyRouteToWIP", this.scheduleRouteDataServiceCallback, rowData.legId, rowData.routeId, parent.isNetworkQuery);
        }

        //reset the ui
        ESRIHelper.getEsriGraphicManager().resetRouteSelection();
        //set the route id for the selected route
        SkdMxHelper.getMapOpeationManager().setRouteId(routeIds[0]);
        //highlight the route
        ESRIHelper.getEsriGraphicManager().highlightRouteHandler(routeIds[0], 1, 0.3);
        //invoke
        ESRIHelper.getEditToolManager().modifyRouteHandler(routeIds[0]);

        ESRIHelper.getEditToolManager().hideGraphics(routeIds[0]);

    };

    constructorFn.paintSkdMxDrawerWizardByRouteId = function(routeId) {
        if (!ESRIHelper.getEditToolManager().isAlreadySelectedRoute(routeId)) {
            //populate the grid
            var rowData;
            var isNetworkSchedule = parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX == true ? true : false;
            if ((ESRIHelper.getEsriGraphicManager().getLegDetailsByRoute(routeId)) != undefined) {
                rowData = (ESRIHelper.getEsriGraphicManager().getLegDetailsByRoute(routeId))[0];
                if(rowData == undefined){
                    return;
                }
                if (rowData != undefined) {
                    showProgressDialog(true, "Retrieving route data...");
                    parent.callScheduleRouteDataService(null, rowData, "copyRouteToWIP", this.scheduleRouteDataServiceCallback, rowData.legId, rowData.routeId,parent.isNetworkQuery);
                }
            }
        }
        //reset the ui
        ESRIHelper.getEsriGraphicManager().resetRouteSelection();
        //set the route id for the selected route
        SkdMxHelper.getMapOpeationManager().setRouteId(routeId);
        //highlight the route
        ESRIHelper.getEsriGraphicManager().highlightRouteHandler(routeId, 1, 0.3);
        //invoke
        ESRIHelper.getEditToolManager().modifyRouteHandler(routeId);
        ESRIHelper.getEditToolManager().hideGraphics(routeId);
    };


    constructorFn.scheduleRouteDataServiceCallback = function(response, io) {
        parent.initialLegList = [];
        parent.initialRouteList = [];
        if (response && response.errorCd && response.errorCd > 0) {
            parent.showErrorMsg(response.errorDesc);
        } else {
            //    		var actionType = response.actionType;
            if(response.legData != undefined){
                var legId = response.legId;
                var legData = $.parseJSON(response.legData);
                var rteData = $.parseJSON(response.rteData);
                SkdMxHelper.getMapOpeationManager().setMode(rteData["MODE"]);
                //SkdMxHelper.getSkdMxGridComponentManager().setModeHeader(rteData["MODE"], rteData["CONVEYANCE"]);
                var matchingLegs = [];
                for (var i = 0; i < rteData.length; i++) {
                    matchingLegs = $.grep(legData, function(obj) {
                        return obj["ROUTE_ID"] === rteData[i]["ROUTE_ID"];
                    });
                    $.merge(parent.initialLegList, jQuery.extend(true, [], matchingLegs));
                    if (matchingLegs && matchingLegs.length > 0) {
                        rteData[i]["MV_NUM"] = matchingLegs[0]["MV_NUM"];
                        rteData[i]["LEG_TYPE"] = matchingLegs[0]["LEG_TYPE"];
                        rteData[i]["EQUIP_TYPE"] = matchingLegs[0]["EQUIP_TYPE"];
                        rteData[i]["MODE"] = matchingLegs[0]["MODE"];
                    }
                }
                parent.initialRouteList = jQuery.extend(true, [], rteData);
                parent.mergeInitialRouteData(parent.initialLegList,parent.initialRouteList);
                //fixed issue with one leg route...
                SkdMxHelper.getSkdMxGridComponentManager().setAnchorData(undefined, matchingLegs, rteData[0]);
                SkdMxHelper.getSkdMxGridComponentManager().populateRtDtlsNSMGrid(matchingLegs, rteData, legId);
                SkdMxHelper.getSkdMxGridComponentManager().setRouteDetails(response, "seasonData", rteData[0]["ROUTE_ID"]);
                SkdMxHelper.getSkdMxGridComponentManager().getModeHeaderByRteData(rteData, rteData[0]["ROUTE_ID"]);
                SkdMxHelper.getSkdMxGridComponentManager().updateRouteDetails(rteData);
                //duplicate copies for revision comments
                SkdMxHelper.getSkdMxGridComponentManager().staticRteDataMap[rteData[0].ROUTE_ID] = dojo.clone(rteData);
                SkdMxHelper.getSkdMxGridComponentManager().staticLegDataMap[rteData[0].ROUTE_ID] = dojo.clone(matchingLegs);
            }

            delete legData;
            delete rteData;
            delete matchingLegs;
            delete legId;
        }
        SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
        setTimeout(function(){
            showProgressDialog(false);
        }, 1000);
    };
    constructorFn.getSelectedMode = function(rowData) {
        var selectObj = "";
        if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.FLT_CLH) {
            selectObj = MODE_HEADER_LABELS.FLT_CLH;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.FLT_TRUNK) {
            selectObj = MODE_HEADER_LABELS.FLT_TRUNK;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.FLT_FEEDER) {
            selectObj = MODE_HEADER_LABELS.FLT_FEEDER;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.TRK_GBT) {
            selectObj = MODE_HEADER_LABELS.TRK_GBT;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.TRK_SLH) {
            selectObj = MODE_HEADER_LABELS.TRK_SLH;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.TRK_GNP) {
            selectObj = MODE_HEADER_LABELS.TRK_GNP;
        } else if (rowData.ROUTE_CONTEXT_CD== ROUTE_CONTEXT_CODES.TRK_SSH) {
            selectObj = MODE_HEADER_LABELS.TRK_SSH;
        }

        return selectObj;
    };

    constructorFn.getModeCode = function(modeDescription){
        switch (modeDescription) {
            case ROUTE_CONTEXT_CODES.FLT_TRUNK:
            case MODE_HEADER_LABELS.FLT_TRUNK:
                return MODE_CODES.FLT_TRUNK;
                break;
            case ROUTE_CONTEXT_CODES.FLT_FEEDER:
            case MODE_HEADER_LABELS.FLT_FEEDER:
                return MODE_CODES.FLT_FEEDER;
                break;
            case "Flight - Interline/OBC":
                return "FI";
                break;
            case ROUTE_CONTEXT_CODES.FLT_CLH:
                return MODE_CODES.FLT_CLH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_SLH:
            case MODE_HEADER_LABELS.TRK_SLH:
                return MODE_CODES.TRK_SLH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_SSH:
            case MODE_HEADER_LABELS.TRK_SSH:
                return MODE_CODES.TRK_SSH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_GBT:
            case MODE_HEADER_LABELS.TRK_GBT:
                return MODE_CODES.TRK_GBT;
                break;
            case ROUTE_CONTEXT_CODES.TRK_GNP:
            case MODE_HEADER_LABELS.TRK_GNP:
                return MODE_CODES.TRK_GNP;
                break;
            default:
                return modeDescription;
        }
    };

    /**
     *
     * @param btnObj
     */
    constructorFn.editRoute = function(btnObj) {
        var selectedMode = "";
        var selectedLegList;
        var selectedRouteList;
//        var selectedSeasonsList;
        var actionType = "addRoute";

        parent.isDelete = false;

        selectedLegList = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
        selectedRouteList = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
//        selectedSeasonsList = SkdMxHelper.getSkdMxGridComponentManager().getRouteDetails("seasonData", SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
        selectedMode = $("#modeCell_"+SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute).text();// this.getSelectedMode(selectedLegList[0]);

        parent.scheduleMaintenananceSeletedMenu = this.getModeCode(selectedMode);
        parent.mergeData(selectedLegList, selectedRouteList);
        parent.dashboardController.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP,true);
        parent.refreshREWindows(actionType);

        SkdMxHelper.getMapOpeationManager().setMoveToRE(true);
    };

    constructorFn.saveToWIP = function(btnObj, isDuplicate) {
        var selectedLegList;
        var selectedRouteList;
        var selectedSeasonsList;
        var actionType = "addRoute";

        parent.isDelete = false;
        showProgressDialog(true, "Please wait...");
        selectedLegList = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
        selectedRouteList = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
        selectedSeasonsList = SkdMxHelper.getSkdMxGridComponentManager().getRouteDetails("seasonData", SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);

        this.processMoveToWIP(selectedRouteList, selectedLegList, selectedSeasonsList);

        SkdMxHelper.getMapOpeationManager().setSaveToWIP(true);
        showProgressDialog(false);
    };

    /**
     * refractored the code for split route and saving the route to WIP
     * @param selectedRouteList
     * @param selectedLegList
     * @param selectedSeasonsList
     * @param isSplitRoute
     */
    constructorFn.processMoveToWIP = function(selectedRouteList, selectedLegList, selectedSeasonsList, isSplitRoute) {
        var selectedMode = this.getSelectedMode(selectedLegList[0]);
        parent.scheduleMaintenananceSeletedMenu = this.getModeCode(selectedLegList[0].ROUTE_CONTEXT_CD);
        selectedRouteList[0]["MENU"] = parent.scheduleMaintenananceSeletedMenu;
        var finalSelectLegList=[];
        var finalSelectRouteList =[];
        var finalSelectSeasonList =[];
        var FilteredWIPRouteList = parent.selectedWIPRouteList;
        var FilteredWIPLegList = parent.selectedWIPLegList;
        var FilteredWIPSeasonList = parent.selectedWIPSeasonLegList;
        if (FilteredWIPRouteList != null && FilteredWIPRouteList.length >0) {
            for (var i=0; i<selectedRouteList.length; i++) {
                var routeId = selectedRouteList[i].ROUTE_ID;
                FilteredWIPRouteList = $.grep(FilteredWIPRouteList, function(obj) {
                    return obj["ROUTE_ID"] != routeId;
                });
                FilteredWIPLegList = $.grep(FilteredWIPLegList, function(obj) {
                    return obj["ROUTE_ID"] != routeId;
                });
                FilteredWIPSeasonList = $.grep(FilteredWIPSeasonList, function(obj) {
                    return obj["ROUTE_ID"] != routeId;
                });
                var FilteredUpdatedLegList = $.grep(selectedLegList, function(obj) {
                    return obj["ROUTE_ID"] == routeId;
                });

                var object = [];
                object.push(selectedRouteList[i]);
                $.merge(finalSelectRouteList,object);
                $.merge(finalSelectLegList,FilteredUpdatedLegList);
                if(isSplitRoute == undefined || !isSplitRoute){
                    $.merge(finalSelectSeasonList, (selectedSeasonsList["legData"] != undefined? $.parseJSON(selectedSeasonsList["legData"]): {}));
                }else {
                    $.merge(finalSelectSeasonList, selectedSeasonsList);
                }

            }
            $.merge(finalSelectRouteList,FilteredWIPRouteList);
            $.merge(finalSelectLegList,FilteredWIPLegList);
            $.merge(finalSelectSeasonList,FilteredWIPSeasonList);
        } else {
            finalSelectRouteList = selectedRouteList;
            finalSelectLegList = selectedLegList;
            if(isSplitRoute == undefined || !isSplitRoute){
                finalSelectSeasonList = (selectedSeasonsList["legData"] != undefined? $.parseJSON(selectedSeasonsList["legData"]): {});
            }else {
                finalSelectSeasonList = selectedSeasonsList;
            }
        }

        parent.dashboardController.openDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
        if (finalSelectRouteList.length > 0) {
            parent.selectedWIPRouteList = finalSelectRouteList;
            parent.selectedWIPLegList = finalSelectLegList;
            parent.selectedWIPSeasonLegList = finalSelectSeasonList;
            var dashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
            try{
                if(dashboard != undefined && dashboard.hasOwnProperty("refreshMatrixWithData")){
                    dashboard.setExpandedRoute(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
                    dashboard.refreshMatrixWithData();
                }
            }catch(err){
                console.log("Error while refreshing the WIP Matrix" + err);
            }

        }
    };

    constructorFn.saveToSchedule = function(btnObj) {
        var selectedLegList;
        var selectedRouteList;
        var timeReference;
        var routeId;
        parent.isDelete = false;

        routeId = SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute;
        console.log(SkdMxHelper.getStaticRouteData(routeId));
        selectedLegList = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
        selectedRouteList = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
        timeReference = parent.getDashboardContentWindow('mapViewDiv').isLocalFlag ? "Local" : "Zulu";
        var staticRouteList = SkdMxHelper.getStaticRouteData(routeId);
        var changedRouteList = SkdMxHelper.getRouteData(routeId);
        var staticLeglist = SkdMxHelper.getStaticLegData(routeId);
        var changedLeglist = SkdMxHelper.getLegData(routeId);

        this.setAllocationData(selectedLegList, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag);
        this.setAllocationData(changedLeglist, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag);

        //Condition to open Revision popup
        if (this.isRevisionPopupApplicable(staticRouteList, staticLeglist, changedRouteList, changedLeglist)) {
            parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(
                changedRouteList[0],null, null,null,changedLeglist,staticLeglist,staticRouteList,parent.OPERATION_FROM_DRAWER);
            parent.SkdGridHelper.getSkdGridManager().setDashBoardTitle(changedRouteList[0],parent.DASHBOARD_ID_REVISION_COMMENTS);
            parent.openDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS,true);
        } else {
            parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(selectedRouteList, selectedLegList, timeReference, function(response, io) {
                SkdMxHelper.getSkdMxGridComponentManager().onSaveServiceSuccess(response, io, routeId);
            });
        }
    };

    constructorFn.setAllocationData = function(legData, isLocalFlag) {
        if(legData != null) {
            for(var i=0; i<legData.length; i++) {
                var leg = legData[i];
                if (leg!=null && leg.ALLOCS!= null && leg.ALLOCS.length > 0) {
                    for(var j=0; j<leg.ALLOCS.length; j++) {
                        var alloc = leg.ALLOCS[j];
                        alloc["IS_LOCAL"] = isLocalFlag? "1": "0";
                    }
                }
            }
            return legData;
        }
        return legData;
    };

    constructorFn.isRevisionPopupApplicable = function(staticRouteList,staticLeglist,changedRouteList,changedLeglist) {
        if (parent.getSelectedCase().caseType=='FNL' && changedRouteList[0].MODE=="Flight"
            && changedRouteList[0].ROUTE_CONTEXT_CD != ROUTE_CONTEXT_CODES.FLT_CLH) {
            if (changedRouteList[0].OPERATION_CD == parent.OPERATION_CD_ADD) {
                return true;
            } else if (changedRouteList[0].OPERATION_CD == parent.OPERATION_CD_MODIFY) {
                tempLegList = $.grep(changedLeglist, function(obj) {
                    return obj["OPERATION_CD"] == parent.OPERATION_CD_DELETE;
                });
                if (tempLegList.length >0) {
                    return true;
                } else if (parent.SkdGridHelper.getSkdGridManager().isDataModified(staticRouteList,staticLeglist,changedRouteList,changedLeglist)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     *
     * @param btnObj
     */
    constructorFn.addRoute = function(btnObj) {
        SkdMxHelper.getMapOpeationManager().setRouteId(undefined, true);
    };
    /**
     *
     * @param btnObj
     */
    constructorFn.duplicateRoute = function(btnObj) {

    };
    /**
     *
     * @param btnObj
     */
    constructorFn.deleteRoute = function(btnObj) {
        //        var grpName = this.SchdleMntnceMapDwrGridRadio + "_" + "Grp";
        //        var selectedRadioId = $('input[name="' + grpName + '"]:checked').val();
        //        console.log(selectedRadioId);
        var actionType = "deleteRoute";
        parent.isDelete = true;
        var selectedLegList = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
        var selectedRouteList = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
        selectedMode = this.getSelectedMode(parent.selectedLegList[0]);

        parent.mergeData(selectedLegList, selectedRouteList);
        parent.dashboardController.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP,true);
        parent.refreshREWindows(actionType);

        delete selectedLegList;
        delete selectedRouteList;
    };

    //SkdMxMapDrawerController.isSliderOpen = false;
    constructorFn.isSliderInitialize = false;

    /**
     * @param divClass
     * @param horizontalDivId
     */
    constructorFn.initializeDrawerPanel = function() {
        $('#SkdMxMapDrawerController').panel({
            collapseType: 'slide-right',
            collapsed: true,
            trueVerticalText: true,
            vHeight: '52px',
            width: '405px',
            customIcons: {
                header: 'ui-icon-triangle-1-e',
                headerSelected: 'ui-icon-triangle-1-s',
                headerRight: 'ui-icon-1-n-route',
                headerRightSelected: 'ui-icon-1-e-route',
                headerLeft: 'ui-icon-arrowthickstop-1-s',
                headerLeftSelected: 'ui-icon-arrowthickstop-1-w',
                isCustomIcon: true
            } //304 ,73,
        });
        this.hideDrawer();
    };

    /**
     *
     */
    constructorFn.showDrawer = function(isOpen, menuText) {
        if ($('#SkdMxMapDrawerController')[0] != undefined) {
            $('#SkdMxMapDrawerController').show();
            if (isOpen) $('#SkdMxMapDrawerController').panel('showOptionDiv');
            if (menuText != "" && menuText != undefined) {
                //Fdx / FDX-1292
                //SMD: 8888 Create Route Allows Mix Mode in Locations
                //=> update the mode that the user want to create
                SkdMxHelper.getDrawer(). updateMode();
                SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnSkdMxAddRoute"), true);
            }
        }
    };

    constructorFn.hideDrawer = function() {
        if ($('#SkdMxMapDrawerController')[0] != undefined) $('#SkdMxMapDrawerController').hide();
    };
    constructorFn.showHideDrawer = function(isScheduleMaintenanance, isOpen) {
        if (isScheduleMaintenanance) {
            this.showDrawer(isOpen);
            ESRIHelper.getEditToolManager().showEditToolLayer();
            //whenever the user clicks on "Schedule Maintenance" mode,
            // following logic ensures that it is loaded with default configurations
            selectAndExecuteSelectionHandler('isDefaultConfig');
        } else {
            this.hideDrawer();
            ESRIHelper.getEditToolManager().hideEditToolLayer();
            //whenever the user is not in "Schedule Maintenance" mode,
            // following logic ensures that it is removes the default configurations from map
            selectAndExecuteSelectionHandler('isNoneLocations');
        }
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}

function MapOperationManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function(btnObj) {
        this.isByLeg = false;
        //
        this.selectRoute = false;
        this.addLeg = false;
        this.deleteLeg = false;
        //
        this.addRoute = false;
        //edit tool
        this.moveRoute = false;
        this.modifyRoute = false;
        this.scaleRoute = false;
        this.rotateRoute = false;
        this.splitLeg = false;

        this.uniformScalingResizing = false;
        this.editRouteName = false;
        this.moveToRE = false;
        this.saveToWIP = false;
        this.saveToSchedule = false;
        //
        this.routeId;
        //
        this.mode;
        //
        this.duplicateRoute = false;
        //
        this.validationError = false;
    };

    constructorFn.isByLegQuery = function() {
        return this.isByLeg;
    };

    constructorFn.setByLegQuery = function(flag) {
        this.isByLeg = flag;
    };

    constructorFn.isValidationError = function() {
        return this.validationError;
    };

    constructorFn.setValidationError = function(flag) {
        this.validationError = flag;
    };

    constructorFn.isDuplicateRoute = function() {
        return this.duplicateRoute;
    };

    constructorFn.setDuplicateRoute = function(flag) {
        this.duplicateRoute = flag;
        if (flag) {
            this.selectRoute = false;
            this.addRoute = false;
            this.newRoute = false;
            this.cancelRoute = false;
        }
    };

    constructorFn.isModifyRoute = function() {
        return this.modifyRoute;
    };

    constructorFn.isSplitRoute = function() {
        return this.splitLeg;
    };

    constructorFn.isDeleteLeg = function() {
        return this.deleteLeg;
    };

    constructorFn.enableUpdateMode = function() {
        this.modifyRoute = true;
        this.splitLeg = true;
        this.deleteLeg = false;
        this.moveToRE = false;
    };

    constructorFn.disableUpdateMode = function() {
        this.modifyRoute = false;
        this.splitLeg = false;
        this.deleteLeg = false;
        this.moveToRE = false;
    };


    constructorFn.enableDeleteMode = function() {
        this.modifyRoute = false;
        this.splitLeg = false;
        this.deleteLeg = true;
        this.moveToRE = false;
    };

    constructorFn.disableDeleteMode = function() {
        this.modifyRoute = false;
        this.splitLeg = false;
        this.deleteLeg = false;
        this.moveToRE = false;
    };

    constructorFn.isActiveMode = function() {
        return (this.isAddLeg() || this.isAddRoute() || this.isDeleteLeg());
    };

    constructorFn.isSelectMode = function() {
        return (this.isSelectRoute());
    };

    constructorFn.isAddLeg = function() {
        return this.addLeg;
    };

    constructorFn.setAddLeg = function(flag) {
        this.addLeg = flag;
        if (flag) {
            this.selectRoute = false;
            this.deleteLeg = false;
            this.addRoute = false;
            this.moveToRE = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
        }
    };

    constructorFn.isSelectRoute = function() {
        return this.selectRoute;
    };

    constructorFn.setSelectRoute = function(flag) {
        this.selectRoute = flag;
        if (flag) {
            this.addLeg = false;
            this.deleteLeg = false;
            this.addRoute = false;
            this.cancelRoute = false;
            this.moveToRE = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
        }
    };


    constructorFn.isMoveToRE = function() {
        return this.moveToRE;
    };

    constructorFn.setMoveToRE = function(flag) {
        this.moveToRE = flag;
        if (flag) {
            this.addLeg = false;
            this.deleteLeg = false;
            this.addRoute = false;
            this.newRoute = false;
            this.selectRoute = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
        }
    };

    constructorFn.isSaveToWIP = function() {
        return this.saveToWIP;
    };

    constructorFn.setSaveToWIP = function(flag) {
        this.saveToWIP = flag;
        if (flag) {
            this.addLeg = false;
            this.deleteLeg = false;
            this.addRoute = false;
            this.newRoute = false;
            this.selectRoute = false;
            this.moveToRE = false;
            this.saveToSchedule = false;
        }
    };

    constructorFn.isSaveToSchedule= function() {
        return this.saveToSchedule;
    };

    constructorFn.setSaveToSchedule = function(flag) {
        this.saveToSchedule = flag;
        if (flag) {
            this.addLeg = false;
            this.deleteLeg = false;
            this.addRoute = false;
            this.newRoute = false;
            this.selectRoute = false;
            this.moveToRE = false;
            this.saveToWIP = false;
        }
    };

    constructorFn.isAddRoute = function() {
        return this.addRoute || this.isNewRoute();
    };
    constructorFn.isNewRoute = function() {
        return (this.newRoute != undefined && this.newRoute);
    };
    constructorFn.getCallforMatrix = function() {
        return (this.isCallforMatrix != undefined && this.isCallforMatrix);
    };
    constructorFn.setCallforMatrix = function(flag) {
        this.isCallforMatrix = flag;
    };
    constructorFn.setNewRoute = function(flag) {
        this.newRoute = flag;
    };
    constructorFn.isCancelRoute = function() {
        return this.cancelRoute || (this.routeId == undefined);
    };

    constructorFn.setAddRoute = function(flag) {
        this.addRoute = flag;
        if (flag) {
            this.selectRoute = false;
            this.addLeg = false;
            this.deleteLeg = false;
            this.newRoute = false;
            this.cancelRoute = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
            this.moveToRE = false;
        }

    };

    constructorFn.isDeleteLeg = function() {
        return this.deleteLeg;
    };

    constructorFn.setDeleteLeg = function(flag) {
        this.deleteLeg = flag;
        this.selectRoute = flag;
        if (flag) {
            this.addLeg = false;
            this.addRoute = false;
            this.newRoute = false;
            this.cancelRoute = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
            this.moveToRE = false;
        }
    };

    constructorFn.setCancelLeg = function(flag) {
        if (flag) {
            this.deleteLeg = false;
            this.selectRoute = false;
            this.addLeg = false;
            this.addRoute = false;
            this.newRoute = false;
            this.saveToWIP = false;
            this.saveToSchedule = false;
            this.moveToRE = false;
        }
        this.cancelRoute = flag;
    };
    constructorFn.getRouteId = function() {
        return this.routeId;
    };

    constructorFn.getMode = function() {
        return this.mode;
    };

    constructorFn.setMode = function(mode) {
        this.mode = mode;
    };

    constructorFn.setRouteId = function(routeId, newRoute) {
        if (this.routeId != routeId) {
            ESRIHelper.getStageManager().beforeRouteSelectionChangeListener(this.routeId, routeId, newRoute);
        }
        this.newRoute = newRoute;
        this.routeId = routeId;
        if (this.routeId != routeId) {
            ESRIHelper.getStageManager().afterRouteSelectionChangeListener(this.routeId, routeId, newRoute);
        }
    };
    constructorFn.generateRandomRouteId = function(routeId) {
        return parent.randomString();
    };

    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}

/**
 *
 */
var SkdMxHelper = (function() {
    function constructorFn() {
        this.skdMxDrawerController;
        this.mapOperationManager;
        this.skdMxGridComponentManager;
    };

    constructorFn.getDrawer = function() {
        if (this.skdMxDrawerController == undefined) {
            this.skdMxDrawerController = (new SkdMxMapDrawerController()).getInstance();
        }
        return this.skdMxDrawerController;
    };

    constructorFn.getMapOpeationManager = function() {
        if (this.mapOperationManager == undefined) {
            this.mapOperationManager = (new MapOperationManager()).getInstance();
        }
        return this.mapOperationManager;
    };

    constructorFn.getSkdMxGridComponentManager = function() {
        if (this.skdMxGridComponentManager == undefined) {
            this.skdMxGridComponentManager = (new SkdMxGridComponentManager()).getInstance();
        }
        return this.skdMxGridComponentManager;
    };

    constructorFn.getStaticRouteData = function(routeId) {
        if (this.skdMxGridComponentManager == undefined) {
            this.skdMxGridComponentManager = (new SkdMxGridComponentManager()).getInstance();
        }
        if(routeId != undefined){
            return this.skdMxGridComponentManager.staticRteDataMap[routeId];
        }
        return;
    };

    constructorFn.getStaticLegData = function(routeId) {
        if (this.skdMxGridComponentManager == undefined) {
            this.skdMxGridComponentManager = (new SkdMxGridComponentManager()).getInstance();
        }
        if(routeId != undefined){
            return this.skdMxGridComponentManager.staticLegDataMap[routeId];
        }
        return;
    };

    constructorFn.getRouteData = function(routeId) {
        if (this.skdMxGridComponentManager == undefined) {
            this.skdMxGridComponentManager = (new SkdMxGridComponentManager()).getInstance();
        }
        if(routeId != undefined){
            return this.skdMxGridComponentManager.rteDataMap[routeId];
        }
        return;
    };

    constructorFn.getLegData = function(routeId) {
        if (this.skdMxGridComponentManager == undefined) {
            this.skdMxGridComponentManager = (new SkdMxGridComponentManager()).getInstance();
        }
        if(routeId != undefined){
            return this.skdMxGridComponentManager.matchingLegsMap[routeId];
        }
        return;
    };

    return constructorFn;
})();


/**
 *
 */

function SkdMxGridComponentManager() {

    function constructorFn() {
        this.initialize();
    };
    constructorFn.initialize = function() {
        //variables..constants here
        this.gridCount = 0;
        this.SchdleMntnceMapDwrGridRadio = "SchdleMntnceMapDwrGridRadio";
        this.SchdleMntnceMapDwrContentGrid = "SchdleMntnceMapDwrContentGrid";
        this.gridMap = [];
        this.matchingLegsMap = {};
        this.rteDataMap = {};
        this.staticRteDataMap = {};
        this.staticLegDataMap = {};
        this.legIdDataMap = {};
        this.routeDetailsMap = {};
    };
    constructorFn.createGridNdAdd2Display = function(data, routeId) {
        if (routeId == undefined) {
            routeId = this.gridCount;
        }
        var gridId = this.SchdleMntnceMapDwrContentGrid + "_" + routeId;
        var schdleMntnceMapDwrContent = $("#SchdleMntnceMapDwrContentTbl");
        //first row
        /* schdleMntnceMapDwrContent.append("<tr id='row0" + "_" + routeId + "'><td colspan='2'><table style='padding-left: 20px'><tr><td  style='padding-left: 15px' " +
         "class='boldFont'>Mode: </td><td style='padding-left: 25px; width:250px;' class='boldFont' colspan='2'>" +
         this.getModeHeaderByRteData(data, routeId) + "</td></tr></table></td></tr>");
         */
        //second row
        //Fdx - 6.	Route Assist UI for 8888 trucks
        //a.	Need to force planner to enter 3 alpha characters
        //when asking for rt # assistance for 8888 trucks
        schdleMntnceMapDwrContent.append("<tr id='row1" + "_" + routeId + "'><td colspan='2'><table width='100%' style='padding-left: 20px;'><tr><td style='width:160px;'><table><tr>" +
        "<td class='boldFont' style='padding-left:10px' >Mv No: </td><td id='routeNumCell" + "_" + routeId + "' style='padding-left:25px;' class='boldFont'><input type='text'" +
        " id='moveNumCell" + "_" + routeId + "' style='width:50px;' value='"+this.getRouteNumber(this.rteDataMap[routeId], routeId)+"' " +
        " onblur='SkdMxHelper.getSkdMxGridComponentManager().updateRouteNLegList(\""+routeId+"\")'><img " +
        "src='pegasus/assets/icons/routesearch.png' title='Select Route' style='margin-left:3px;cursor:pointer' " +
        "onclick=\"routeRowHandler(this,'routeMatrixGrid', true, 'moveNumCell" + "_" + routeId + "', '"+routeId+"', '"+this.rteDataMap[routeId][0]["ROUTE_TYPE_CD"]+"' )\" /> </td></tr></table></td>" +
        "<td><table width='100%'><tr><th>Mode:</th><td id='modeCell" + "_" + routeId + "' style='padding-left:10px; width:250px; font-size:11px;' class='boldFont' colspan='2'>" +
        this.getModeHeaderByRteData(data, routeId) + "</td><td  class='boldFont'  style='display:"+(SkdMxHelper.getSkdMxGridComponentManager().isManualTimedMode()?"":"none" )+"'  >" +
        "Manually Timed:</td><td style='float:right;display: "+(SkdMxHelper.getSkdMxGridComponentManager().isManualTimedMode()?"":"none" )+"'  >" +
        "<input type='checkbox' id='manualTimed" + "_" + routeId + "' "+(SkdMxHelper.getSkdMxGridComponentManager().isManualTimedRoute(data)?"checked='checked'":"" )+" onclick='SkdMxHelper.getSkdMxGridComponentManager().isManualTimeCheckboxClickHandler(this, \""+routeId+"\")' /><label style='min-width: 1px;'></label></td></tr><tr><th>Legs:</th><td colspan='3' id='row1SeqCell" + "_" + routeId + "' style='padding-left: 10px; font-weight: bold; font-size:11px'>" + this.getRouteSquence(data, routeId) + "</td></tr></table></td>"+
        "</tr></table></td></tr>");
        //3rd row
        var schdleMntnceMapDwrContentDiv = $("<tr id='row2" + "_" + routeId + "'></tr>");
        schdleMntnceMapDwrContentDiv.append("<td> <input checked='checked' type='radio' name='" + this.SchdleMntnceMapDwrGridRadio + "_" + "Grp" + "' value='" + routeId +
        "' id='" + this.SchdleMntnceMapDwrGridRadio + "_" + routeId + "' onclick='SkdMxHelper.getSkdMxGridComponentManager().updateRouteSelection(this)'/><label></label></td>");
        schdleMntnceMapDwrContentDiv.append("<td><div id='" + gridId + "' class='smgrid'/></td>");
        //table
        schdleMntnceMapDwrContent.append(schdleMntnceMapDwrContentDiv);
        //4th row
        schdleMntnceMapDwrContent.append("<tr id='row3" + "_" + routeId + "' style='text-align: center;font-weight: bold;'> <td colspan='2'><table width='100%' " +
        "style='padding-left: 20px;'><tr><td id='dailyRouteCostCell" + "_" + routeId + "' align='left' width='280px' class='boldFont'>Daily Route Costs: " +
        this.getDailyRouteCost(data, routeId) + "</td><td id='totalRouteCostCell" + "_" + routeId + "' align='left' class='boldFont'>Monthly Route Costs: " +
        this.getRouteCost(this.rteDataMap[routeId], routeId) + "</td> </tr></table></td></tr>");
        //5th row
        schdleMntnceMapDwrContent.append("<tr id='row4" + "_" + routeId + "' style='text-align: center;font-weight: bold;'> <td colspan='2'>&nbsp;</td></tr>");
        this.initSMGrid(gridId, data, routeId);

        this.gridCount = this.gridCount + 1;

        this.setGridStyles("#" + gridId);
        delete gridId;
        delete schdleMntnceMapDwrContent;
        delete schdleMntnceMapDwrContentDiv;
    };

    constructorFn.isManualTimedMode = function() {
        return SkdMxHelper.getDrawer().isTruckMode() || parent.scheduleMaintenananceSeletedMenu == MODE_CODES.FLT_CLH;
    };

    constructorFn.isManualTimedRoute = function(data) {
        if(data != undefined && data[0] != undefined){
            if(data[0]["USE_LEG_MINS_FLAG"]!= undefined && data[0]["USE_LEG_MINS_FLAG"] == "True"){
                return true;
            }
        }


        return false;
    };

    constructorFn.formatAsMoney = function(cost) {
        return parseFloat(cost).toFixed(0).replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    constructorFn.getRouteCost = function(data, routeId) {
        var routeCost = "$";
        if (data != undefined && data instanceof Array && data.length > 0) {
            routeCost = routeCost + (data[0]["TOTALMONTH_COST_AMT"] != undefined ? this.formatAsMoney(parseFloat((data[0]["TOTALMONTH_COST_AMT"])).toFixed(2)) : "-");
        }
        return routeCost;
    };

    constructorFn.getRouteNumber = function(data, routeId) {
        if (data != undefined && data instanceof Array && data.length > 0) {
            return (data[0]["MV_NUM"] != undefined ? data[0]["MV_NUM"] : "");
        }
        return "";
    };

    constructorFn.getRoutePropertyValue = function(routeId, propertyName) {
        if (routeId != undefined ) {
            if(propertyName == undefined){
                propertyName = "ROUTE_CONTEXT_CD";
            }
            return SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId][0][propertyName];
        }
    };

    constructorFn.getDailyRouteCost = function(data, routeId) {
        var routeCost = "$";
        if (data != undefined && data instanceof Array && data.length > 0) {
            if (data[0]["DAILYRATE_PLUSCC_CHG_AMT"] != undefined) {
                routeCost = routeCost + (data[0]["DAILYRATE_PLUSCC_CHG_AMT"] != undefined ? this.formatAsMoney(parseFloat((data[0]["DAILYRATE_PLUSCC_CHG_AMT"])).toFixed(2)) : "-");
            } else {
                routeCost = routeCost + (data[0]["DAILYRATE_PLUSCC_CHG_AMT"] != undefined ? this.formatAsMoney(parseFloat((data[0]["DAILYRATE_PLUSCC_CHG_AMT"])).toFixed(2)) : "-");
            }
        }
        return routeCost;
    };


    constructorFn.getModeHeaderByRteData = function(data, routeId) {
        var modeHeader = "";
        if (data != undefined && data instanceof Array && data.length > 0) {
            modeHeader = this.getModeDescription(data[0]["MODE"], data[0]["CAPACITY_CD"], data[0]["CONVEYANCE"], data[0]["ROUTE_TYPE_CD"], data[0]["ROUTE_CONTEXT_CD"] );
        } else if (data == undefined) {
            if (parent.scheduleMaintenananceSeletedMenu == "") {
                parent.scheduleMaintenananceSeletedMenu = MODE_CODES.FLT_TRUNK;
            }
            return this.getModeDescription(parent.scheduleMaintenananceSeletedMenu);
        }
        return modeHeader;
    };

    constructorFn.setSkdMxSelectedMenu= function(skdMxType){
        parent.scheduleMaintenananceSeletedMenu = skdMxType;
        menu = parent.scheduleMaintenananceSeletedMenu;
    };

    constructorFn.getModeDescription = function(mode, capacity, conveyance, routeTypeCd, routeContextCd) {
        var skdMxType = routeContextCd;

        if (routeContextCd == undefined) {
            skdMxType = mode;
        }

        switch (skdMxType) {
            case ROUTE_CONTEXT_CODES.FLT_TRUNK:
            case MODE_CODES.FLT_TRUNK:
                this.setSkdMxSelectedMenu(MODE_CODES.FLT_TRUNK);
                return MODE_HEADER_LABELS.FLT_TRUNK;
                break;
            case ROUTE_CONTEXT_CODES.FLT_FEEDER:
            case MODE_CODES.FLT_FEEDER:
                this.setSkdMxSelectedMenu(MODE_CODES.FLT_FEEDER);
                return MODE_HEADER_LABELS.FLT_FEEDER;
                break;
            case "FI":
                this.setSkdMxSelectedMenu("FI");
                return "Flight - Interline/OBC";
                break;
            case ROUTE_CONTEXT_CODES.FLT_CLH:
            case MODE_CODES.FLT_CLH:
                this.setSkdMxSelectedMenu(MODE_CODES.FLT_CLH);
                return MODE_HEADER_LABELS.FLT_CLH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_SLH:
            case MODE_CODES.TRK_SLH:
                this.setSkdMxSelectedMenu(MODE_CODES.TRK_SLH);
                return MODE_HEADER_LABELS.TRK_SLH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_SSH:
            case MODE_CODES.TRK_SSH:
                this.setSkdMxSelectedMenu(MODE_CODES.TRK_SSH);
                return MODE_HEADER_LABELS.TRK_SSH;
                break;
            case ROUTE_CONTEXT_CODES.TRK_GBT:
            case MODE_CODES.TRK_GBT:
                this.setSkdMxSelectedMenu(MODE_CODES.TRK_GBT);
                return MODE_HEADER_LABELS.TRK_GBT;
                break;
            case ROUTE_CONTEXT_CODES.TRK_GNP:
            case MODE_CODES.TRK_GNP:
                this.setSkdMxSelectedMenu(MODE_CODES.TRK_GNP);
                return MODE_HEADER_LABELS.TRK_GNP;
                break;
            default:
                return mode;
        }
    },


        constructorFn.getRouteSquence = function(data, routeId) {
            var routeSquence = "";
            if (data != undefined && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["OPERATION_CD"] === "Deleted") {
                        continue;
                    }
                    routeSquence = routeSquence + data[i].ORIGIN + " - ";
                    if (this.getTotalActiceLegs(data, routeId, i) == 1) {
                        routeSquence = routeSquence + data[i].DESTINATION;
                    }
                }
            }
            return routeSquence;
        };

    constructorFn.getTotalActiceLegs = function(data, routeId, fromIndex) {
        var activeLegs = 0;
        if (data != undefined && data.length > 0) {
            for (var i = fromIndex; i < data.length; i++) {
                if (data[i]["OPERATION_CD"] === "Deleted") {
                    continue;
                }
                activeLegs++;
            }
        }
        return activeLegs;
    };

    constructorFn.setRouteSquence = function(data, routeId) {
        if ($("#row1SeqCell_" + routeId)[0] != undefined) $("#row1SeqCell_" + routeId)[0].innerText = this.getRouteSquence(data, routeId);

    };
    /**
     *
     * @param grid_Id
     * @returns
     */
    constructorFn.initSMGrid = function(grid_Id, data, routeId) {
        this.currentSelectedRoute = routeId;
        this.gridMap[routeId] = $(HASH_STRING + grid_Id).kendoGrid({
            scrollable: true,
            dataSource: this.getGridDataSource(grid_Id, data),
            pageable: false,
            selectable: false,
            reorderable: true,
            navigatable: true,
            editable: true,
            columns: this.getGridColumns(grid_Id, routeId),
            edit: function(e) {
                if (e.container.parent().parent().parent().parent().parent()[0].id != SkdMxHelper.getSkdMxGridComponentManager().getSelectedGridId()) {
                    this.closeCell();
                }
                var input = e.container.find("input.k-input");
                if(input != undefined && input[0] != undefined ){
                    input[0].select();
                    //if(input[0]["name"] == "FLIGHT_MINS"){
                    input[0]["previousValue"] = input[0]["value"];
                    //}
                }
                parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().validateDataFromValidationService(input);
                $(input[0]).keydown(function(event){
                    LoggerUtils.console("before EnterEventHandler");
                    var keyCode = (event.keyCode ? event.keyCode : event.which);
                    if (keyCode == 13) {
                        LoggerUtils.console("before onBlurOrEnterEventHandler keycode ["+keyCode+"]");
                        SkdMxHelper.getSkdMxGridComponentManager().onBlurOrEnterEventHandler(event, this, grid_Id, routeId);
                    }
                    SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
                });

                input.blur(function(event){
                    LoggerUtils.console("before onBlurOrEnterEventHandler");
                    var currentTarget = event.currentTarget;
                    if(currentTarget  != undefined && currentTarget.previousValue!= currentTarget.value){
                        SkdMxHelper.getSkdMxGridComponentManager().onBlurOrEnterEventHandler(event, this, grid_Id, routeId);
                    }
                    SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
                });
                SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
                GridFocusManager.followCursor(e.container, grid_Id, routeId);
            }
        });

        this.addMouseOverEventToGrid(grid_Id);
    };

    constructorFn.validateBeforeSaveHandler = function() {
        if(!SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSave(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute) ||
            SkdMxHelper.getMapOpeationManager().isValidationError()){
            SkdMxHelper.getDrawer().showDomElement(["noSaveToWip", "noSaveToSchedule", "noDeleteFromSchedule"]);
            SkdMxHelper.getDrawer().hideDomElement(["saveToWip", "saveToSchedule", "deleteFromSchedule"]);
        }else {
            var routeData = this.rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
            if(routeData != null && routeData.length > 0 && parent.getResourceAccessType(parent.getRouteType(routeData[0].ROUTE_CONTEXT_CD)) == 2) {
                SkdMxHelper.getDrawer().showDomElement(["saveToWip", "saveToSchedule", "deleteFromSchedule"]);
                SkdMxHelper.getDrawer().hideDomElement(["noSaveToWip", "noSaveToSchedule", "noDeleteFromSchedule"]);
            }
        }
    };

    constructorFn.onBlurOrEnterEventHandler = function(event, currentTarget, grid_Id, routeId) {
        LoggerUtils.console("onBlurOrEnterEventHandler");
        LoggerUtils.console(currentTarget);
        var index = $(currentTarget).closest("tr").index();
        parent.SkdGridHelper.getSkdGridManager().changeCaseToUpperCase($(currentTarget));
        if (parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid($(currentTarget))) {
            LoggerUtils.console("Data validated");
            LoggerUtils.console("event.currentTarget.name ["+event.currentTarget.name+"]");
            LoggerUtils.console(event.currentTarget);
            if(SkdMxHelper.getMapOpeationManager().isValidationError()){
                return;
            }
            if(event.currentTarget.name == "FLIGHT_MINS"){
                if(event.currentTarget["previousValue"] != event.currentTarget["value"]){
                    /*var manualTimeTd = $(event.currentTarget).parent().next();
                     if(manualTimeTd  != undefined && manualTimeTd[0] != undefined){
                     if($(manualTimeTd[0]).find(".k-revision-comment")[0] != undefined)
                     $(manualTimeTd[0]).find(".k-revision-comment")[0].checked = true;
                     }*/
                    this.setUseLegMinFlag(routeId, $("#manualTimed_"+routeId).prop("checked"));
                }
            }
            parent.SkdGridHelper.getSkdGridManager().updateLegGridDataSourceFromLeg($(currentTarget), $("#" + grid_Id), SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId][0]);
            parent.SkdGridHelper.getSkdGridManager().updateRouteFromFirstLegGridDataSource($(currentTarget), SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId][0]);

            var legsData = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getMapOpeationManager().getRouteId());
            var routeData = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getMapOpeationManager().getRouteId()];
            var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData[0] != undefined ? routeData[0] : routeData, legsData, SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag, true, $(currentTarget));
            SkdMxHelper.getSkdMxGridComponentManager().showLoader();
            if (isCallService) {
                $(HASH_STRING + grid_Id).data("kendoGrid").refresh();
            }
            delete legsData;
            delete routeData;
        }

    };

    constructorFn.setMoveNumber = function(moveNum, routeId) {
        if(routeId == undefined){
            routeId = SkdMxHelper.getMapOpeationManager().getRouteId();
        }
        //set the move number to the selected route
        $("#moveNumCell_"+routeId).val(moveNum);
        //updating the move number on route object
        var routeData = this.rteDataMap[routeId];
        if(routeData != undefined){
            routeData[0]["MV_NUM"] = moveNum;
        }
        //updating the move number on leg datasource by grid
        var legData  = this.getRouteDataSource(routeId);
        if(legData   != undefined){
            var leg;
            for(var i=0; i< legData .length; i++){
                leg = legData[i];
                leg["MV_NUM"] = moveNum;
            }
        }

        //updating the move number on leg datasource in matching legs datasource
        legData  = SkdMxHelper.getLegData(routeId);
        if(legData   != undefined){
            var leg;
            for(var i=0; i< legData .length; i++){
                leg = legData[i];
                leg["MV_NUM"] = moveNum;
            }
        }
    };

    constructorFn.isValidRoute = function(routeId) {
        if(routeId == undefined){
            return false;
        }
        //updating the move number on route object
        var routeData = this.rteDataMap[routeId];
        if(routeData == undefined){
            return false;
        }

        return true;
    };

    constructorFn.validateBeforeSave = function(routeId, isDuplicate) {
        //updating the move number on route object
        var routeData = this.rteDataMap[routeId];
        if(routeData == undefined){
            return false;
        }

        if(routeData != undefined ){
            if(!isNotEmptyOrNull(routeData[0]["MV_NUM"])){
                return false;
            }

            if(!parent.getDashboardContentWindow('mapViewDiv').isLocalFlag){
                if(!isNotEmptyOrNull(routeData[0]["EFFDAYSZ_DESC"])){
                    return false;
                }
            }else {
                if(!isNotEmptyOrNull(routeData[0]["EFFDAYSL_DESC"])){
                    return false;
                }
            }
        }

        var legProperties;
        if(!parent.getDashboardContentWindow('mapViewDiv').isLocalFlag){
            legProperties = ["ZULU_DEP", "ZULU_ARR", "MV_NUM", "LEG_TYPE", "EQUIP_TYPE", "EFFDAYSZ_DESC" ];
        }else {
            legProperties = ["EFFDAYSL_DESC", "MV_NUM", "LEG_TYPE", "EQUIP_TYPE", "LOCAL_DEP", "LOCAL_ARR"];
        }

        //updating the move number on leg datasource
        var legData  = this.getRouteDataSource(routeId);
        if(legData   != undefined){
            var leg;
            for(var i=0; i< legData .length; i++){
                leg = legData[i];
                for(var j =0; j< legProperties.length; j++){
                    if(!isNotEmptyOrNull(leg[legProperties[j]])){
                        return false;
                    }
                }
            }

            if(legData[0]["CONVEYANCE"] == "Truck" ){
                if(isDuplicate == undefined || !isDuplicate){
                    //function to validate GNP 8888 and 8889 for Truck - FDX-1161
                    if(!isValidRouteContextType(legData[0])){
                        return false;
                    }
                }
            }
        }

        return true;
    };


    constructorFn.addMouseOverEventToGrid = function(grid_Id) {
        var table = $(HASH_STRING+grid_Id).find("div.k-grid-content table");
        table.on("mouseover", "td", function(event) {
            SkdMxHelper.getSkdMxGridComponentManager().addToolTip(this);
        });
    };

    constructorFn.addToolTip = function(that) {
        parent.DataHelper.getTooltipManager().setToolTip(that,parent.DASHBOARD_ID_MAP_VIEW);
    };

    constructorFn.getSelectedGridId = function() {
        return SkdMxHelper.getSkdMxGridComponentManager().SchdleMntnceMapDwrContentGrid + "_" + SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute;
    },

        constructorFn.getSelectedDataSource = function(routeId) {
            var data= this.getRouteDataSource(routeId);
            if (data != undefined) {
                return data.toJSON();
            }
        };

    constructorFn.getRouteDataSource = function(routeId) {
        var grid = $(HASH_STRING + this.SchdleMntnceMapDwrContentGrid + "_" + routeId).data("kendoGrid");
        if (grid != undefined) {
            return grid.dataSource.data();
        }
    };

    constructorFn.setRouteDetails = function(response, propertyName, routeId) {
        var data = "{}";
        if(response[propertyName] != undefined){
            data = response[propertyName]; //"seasonData"
        }
        data = $.parseJSON(data);
        SkdMxHelper.getSkdMxGridComponentManager().routeDetailsMap[routeId+"-"+propertyName] = data;
    };

    constructorFn.getRouteDetails = function(propertyName, routeId) {
        if(propertyName != undefined && routeId != undefined){
            return SkdMxHelper.getSkdMxGridComponentManager().routeDetailsMap[routeId+"-"+propertyName];
        }
    };
    /**
     * changes are made for fixing the undelete route functionality from map
     * FDX-1031 --> MAP: Un-delete Flights Trucks
     * @param response
     * @param io
     * @param routeId
     * @param undeletedRouteList
     */
    constructorFn.onSaveServiceSuccess = function(response, io, routeId, undeletedRouteList) {
        parent.showProgressDialog(false);
        var routeResponse;
        if(response && response.scheduleErrWrgsMap) {
            routeResponse = response.scheduleErrWrgsMap[routeId];
            if(routeResponse.errors != undefined && routeResponse.errors.wserrorCount > 0){
                parent.showErrorMsg(routeResponse.errors.wserror[0]["wserrorDesc"]);
                SkdMxHelper.getMapOpeationManager().setSaveToSchedule(false);
            } else if(response && response._errorCd && response._errorCd > 0) {
                parent.showErrorMsg(response._errorDesc);
                SkdMxHelper.getMapOpeationManager().setSaveToSchedule(false);
            }else {
                var routeList = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId];
                if(parent.getRouteIds(response, true)){
                    SkdMxHelper.getMapOpeationManager().setSaveToSchedule(true);
                    SkdMxHelper.getSkdMxGridComponentManager().clear(ESRIHelper.getEditToolManager().getRouteId());
                    SkdMxHelper.getDrawer().validateCancelRouteOperationNow(true);
                    ESRIHelper.getEditToolManager().setRouteId(undefined);
                }else {
                    //Fdx / FDX-1292
                    //SMD: 8888 Create Route Allows Mix Mode in Locations
                    // => if the route is not saved then invoke route selection handelr
                    SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnDefaultPointer"));
                }
                //save success dispatcher
                //* FDX-1031 --> MAP: Un-delete Flights Trucks @Aditya
                if(routeList == undefined) {
                    routeList = undeletedRouteList;
                }
                parent.onSaveServiceSuccess(response, false,false,routeList);
            }
        }
    };

    constructorFn.onDefaultsServiceSuccess = function(response, io, options) {
        parent.showProgressDialog(false);
        var routeId;
        if ((response && response.errorCd && response.errorCd > 0) || response && response._errorCd && response._errorCd > 0) {
            if (response.errorDesc) {
                parent.showErrorMsg(response.errorDesc);
            } else {
                parent.showErrorMsg(response._errorDesc);
            }
        } else {
            var rteData = $.parseJSON(response.rteData);
            var legData = $.parseJSON(response.legData);
            routeId = rteData[0]["ROUTE_ID"];
            // if response returning more than one route then its SPLIT Route....
            if(rteData != undefined && rteData.length > 1){
                parent.showErrorMsg("Split route occurred. Transferring routes to WIP", "S");
                parent.showProgressDialog(true, "Please wait...");
                parent.dashboardController.openDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
                SkdMxHelper.getDrawer().processMoveToWIP(rteData, legData, parseSeasonalData(response.seasonData, []), true);
                SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnCancelPointer"), true);
                parent.showProgressDialog(false);
                setTimeout(function(){
                    parent.closeHeaderMsgWin();
                }, 10000);
                return;
            }
            if (SkdMxHelper.getMapOpeationManager().isNewRoute() && !SkdMxHelper.getMapOpeationManager().getCallforMatrix()) {
                SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[rteData[0]["ROUTE_ID"]] = rteData;
                //cache sesson's data
                SkdMxHelper.getSkdMxGridComponentManager().setRouteDetails(response, "seasonData", rteData[0]["ROUTE_ID"]);
                SkdMxHelper.getSkdMxGridComponentManager().createGridNdAdd2Display(undefined, rteData[0]["ROUTE_ID"]);

                ESRIHelper.getEditToolManager().validateAddRouteOperationNow(rteData[0]["ROUTE_ID"]);
                SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnDefaultPointer"));
            } else if (SkdMxHelper.getMapOpeationManager().isDuplicateRoute() && !SkdMxHelper.getMapOpeationManager().getCallforMatrix()) {
                parent.showErrorMsg("Duplicate route requested. Transferring routes to WIP", "S");
                if (options != undefined) {
                    SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[rteData[0]["ROUTE_ID"]] = this.getDuplicateRoute(this.rteDataMap[options.routeId], rteData[0]["ROUTE_ID"]);
                    this.rteDataMap[options.routeId][0]["IS_DUPLICATE"] = 1;
                    this.rteDataMap[options.routeId][0]["IS_CHECKED"] = true;
                    //cache sesson's data
                    SkdMxHelper.getSkdMxGridComponentManager().setRouteDetails(response, "seasonData", rteData[0]["ROUTE_ID"]);
                    SkdMxHelper.getSkdMxGridComponentManager().createGridNdAdd2Display(this.getDuplicateLegs(this.matchingLegsMap[options.routeId], rteData[0]["ROUTE_ID"], legData), rteData[0]["ROUTE_ID"]);

                    ESRIHelper.getEditToolManager().validateAddRouteOperationNow(rteData[0]["ROUTE_ID"]);
                    SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnDefaultPointer"));
                    //SkdMxHelper.getSkdMxGridComponentManager().setMoveNumber("");
                    //set duplicate route
                    SkdMxHelper.getMapOpeationManager().setDuplicateRoute(false);
                    ESRIHelper.getEditToolManager().duplicateRouteCallbackHandler(options, rteData[0]["ROUTE_ID"]);
                    options.duplicateRouteId = rteData[0]["ROUTE_ID"];
                    //invoke time and cost with default service
                    SkdMxHelper.getSkdMxGridComponentManager().validateAndInvokeDefaultOrTimeCostServiceNow(
                        SkdMxHelper.getSkdMxGridComponentManager().getSelectedKendoGridInstance(rteData[0]["ROUTE_ID"]), rteData[0]["ROUTE_ID"], parent.OPERATION_CD_ADD, true, undefined, true, options);

                    $("#moveNumCell_"+rteData[0]["ROUTE_ID"]).focus();
                    //LoggerUtils.console(options);
                }
                setTimeout(function(){
                    parent.closeHeaderMsgWin();
                }, 5000);
            } else {
                var matchingLegs = [];
                for (var i = 0; i < rteData.length; i++) {
                    matchingLegs = $.grep(legData, function(obj) {
                        return obj["ROUTE_ID"] === rteData[i]["ROUTE_ID"];
                    });
                    if (matchingLegs != null && matchingLegs.length > 0) {
                        rteData[i]["MV_NUM"] = matchingLegs[0]["MV_NUM"] != undefined ? rteData[0]["MV_NUM"] : "";
                        rteData[i]["LEG_TYPE"] = matchingLegs[0]["LEG_TYPE"];
                        rteData[i]["EQUIP_TYPE"] = matchingLegs[0]["EQUIP_TYPE"];
                    }
                    SkdMxHelper.getSkdMxGridComponentManager().updateRouteDetails(rteData);
                    SkdMxHelper.getSkdMxGridComponentManager().setRouteSquence(matchingLegs, rteData[0]["ROUTE_ID"]);
                    SkdMxHelper.getSkdMxGridComponentManager().populateRtDtlsNSMGrid(matchingLegs, [rteData[i]], matchingLegs[0].LEG_ID);
                    //cache sesson's data
                    SkdMxHelper.getSkdMxGridComponentManager().setRouteDetails(response, "seasonData", rteData[0]["ROUTE_ID"]);
                    delete matchingLegs;
                }
            }
            delete rteData;
            delete legData;
            SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();

            if(options != undefined && options["isDuplicate"]){
                parent.showProgressDialog(true, "Duplicating the route...");
                if(options != undefined && options["isDuplicate"] && this.rteDataMap[options.duplicateRouteId][0]){
                    this.rteDataMap[options.duplicateRouteId][0]["IS_DUPLICATE"] = 2;
                    this.rteDataMap[options.duplicateRouteId][0]["IS_CHECKED"] = true;
                }
                SkdMxHelper.getDrawer().selectPointer(document.getElementById('saveToWip'), true, true);
                setTimeout(function(){
                    $("#"+SkdMxHelper.getSkdMxGridComponentManager().SchdleMntnceMapDwrGridRadio + "_" +options.routeId)[0].checked = true;
                    SkdMxHelper.getSkdMxGridComponentManager().updateSelectionByRouteId(options.routeId);
                    SkdMxHelper.getDrawer().selectPointer(document.getElementById('saveToWip'), true, true);
                    parent.showProgressDialog(false);
                },250);
            }
        }


        SkdMxHelper.getSkdMxGridComponentManager().hideLoader();

        setTimeout(function() {
            //placeCursorToFieldName(currentEditIndex,SkdMxHelper.getSkdMxGridComponentManager().gridMap[routeId][0].id,currentEditCellType, true);
            if(SkdMxHelper.getSkdMxGridComponentManager().gridMap[routeId] != undefined){
                GridFocusManager.placeCursorToFiledName(SkdMxHelper.getSkdMxGridComponentManager().gridMap[routeId][0].id, routeId);
            }
        },500);

    };

    constructorFn.updateRouteDetails = function(rteData) {
        if ($("#row3_" + rteData[0]["ROUTE_ID"])[0] != undefined) {
            $("#totalRouteCostCell_" + rteData[0]["ROUTE_ID"]).text("Monthly Route Costs: " + SkdMxHelper.getSkdMxGridComponentManager().getRouteCost(rteData));
            $("#dailyRouteCostCell_" + rteData[0]["ROUTE_ID"]).text("Daily Route Costs: " + kendo.toString(SkdMxHelper.getSkdMxGridComponentManager().getDailyRouteCost(rteData), "0.00"));
            //$("#modeCell_" + rteData[0]["ROUTE_ID"]).text(SkdMxHelper.getSkdMxGridComponentManager().getModeHeaderByRteData(rteData));
            $("#moveNumCell_" + rteData[0]["ROUTE_ID"]).val((rteData[0]["MV_NUM"] != undefined ? rteData[0]["MV_NUM"] : ""));
            if(SkdMxHelper.getSkdMxGridComponentManager().isManualTimedRoute(rteData)){
                $("#manualTimed_"+ rteData[0]["ROUTE_ID"]).attr("checked", "checked");
            }else {
                $("#manualTimed_"+ rteData[0]["ROUTE_ID"]).removeAttr("checked");
            }
        }
    },

        constructorFn.getDuplicateRoute = function(object, routeId) {
            var rteData;
            if (object != undefined && routeId != undefined) {
                rteData = this.getDuplicateObject(object);
                rteData[0]["ROUTE_ID"] = routeId;
                rteData[0]["OPERATION_CD"] = "Insert";
                rteData[0]["IS_DUPLICATE"] = 2;
                rteData[0]["IS_CHECKED"] = true;
            }
            return rteData;
        },

        constructorFn.getDuplicateLegs = function(object, routeId, actualLegData) {
            var legData;
            if (object != undefined && routeId != undefined) {
                legData = this.getDuplicateObject(object);
                var allocData;
                var alloc;
                if (legData != undefined) {
                    for (var i = 0; i < legData.length; i++) {
                        legData[i]["LEG_ID"] = actualLegData[i]!= undefined? actualLegData[i]["LEG_ID"]: "";
                        legData[i]["legId"] = i + 1;
                        legData[i]["ROUTE_ID"] = routeId;
                        legData[i]["OPERATION_CD"] = "Insert";
                        //setting the allocation's to insert state while duplicating the route...
                        allocData = legData[i]["ALLOCS"];
                        if(allocData != undefined && allocData.length > 0){
                            for (var j = 0; j < allocData.length; j++) {
                                alloc = allocData[j];
                                alloc["OPERATION_CD"] = "Insert";
                                alloc["CHANGE_FLAG"] = "Insert";
                            }
                        }
                    }
                }
                return legData;
            }
        },

        constructorFn.getDuplicateObject = function(object) {
            if (object != undefined) {
                return ESRIHelper.getEditToolManager().cloneObject(object);
            }
        },

    /**
     *
     * @param grid_Id
     * @returns {Array}
     */
        constructorFn.getGridColumns = function(grid_Id, routeId) {
            var calenderRowTemplateL = "#= " + parent.SkdGridHelper.getSkdGridManager().calenderRowEditor + "(data,'" + grid_Id + "','L','mapViewDiv') #";
            var calenderRowTemplateZ = "#= " + parent.SkdGridHelper.getSkdGridManager().calenderRowEditor + "(data,'" + grid_Id + "','Z','mapViewDiv') #";
            return [{
                field: "ORIGIN",
                title: "Origin",
                hidden: true,
                width: "60px",
                headerAttributes: {
                    title: "Origin",
                    style: "text-align:center"
                }
            }, {
                field: "DESTINATION",
                title: "Dest",
                hidden: true,
                width: "60px",
                headerAttributes: {
                    title: "Dest",
                    style: "text-align:center"
                }
            }
                /*,
                 {
                 field : "EQUIP_TYPE",
                 title : "Equip",
                 hidden : false,
                 width : "60px",
                 editor : function(container, options) {
                 var inputTag =$('<input id = "' +options.model.LEG_ID + '" name="' + options.field + '" />').appendTo(container);;
                 parent.SkdGridHelper.getSkdGridManager().gridKendoComboBoxEditor(inputTag,container, options, $("#"+grid_Id).data("kendoGrid"), "equipTypeCd", "equipTypeDesc", "equipTypeCd", "EquipTypeRequest");
                 },
                 headerAttributes : {
                 title : "Equip",
                 style : "text-align:center"
                 }
                 },
                 {
                 field : "LEG_TYPE",
                 title : "Leg Type",
                 hidden : false,
                 width : "60px",
                 editor : function(container, options) {
                 var inputTag =$('<input id = "' +options.model.LEG_ID + '" name="' + options.field + '" />').appendTo(container);;
                 parent.SkdGridHelper.getSkdGridManager().gridKendoComboBoxEditor(inputTag,container, options, $("#"+grid_Id).data("kendoGrid"), "legTypeCd", "legTypeDesc", "legTypeCd", "LegTypeRequest");
                 },
                 headerAttributes : {
                 title : "Leg Type",
                 style : "text-align:center"
                 }
                 }*/
                , {
                    field: "LEG_TYPE",
                    title: "Leg Type",
                    width: "50px",
                    hidden: false,
                    sortable: false,
                    filterable: false,
                    editable: true,
                    attributes: {
                        style: "border-right:none !important"
                    },
                    headerAttributes: {
                        title: "Leg Type",
                        style: "text-align:center; padding-left:20px !important;"
                    }
                }, {
                    title: EMPTY_STRING,
                    template: function(data) {
                        return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LegTypeRequest", "routeLegTypeTextArea", "LEG_TYPE", parent.DASHBOARD_ID_MAP_VIEW);
                    },
                    width: "14px",
                    editable: false,
                    attributes: {
                        style: "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
                    },
                    headerAttributes: {
                        style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
                    }
                }, {
                    field: "EQUIP_TYPE",
                    title: "Equip Type",
                    width: "50px",
                    hidden: false,
                    sortable: false,
                    filterable: false,
                    editable: true,
                    attributes: {
                        style: "border-right:none !important"
                    },
                    headerAttributes: {
                        title: "Equipment Type",
                        style: "text-align:center; padding-left:19px !important;"
                    }
                }, {
                    title: EMPTY_STRING,
                    template: function(data) {
                        return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", parent.DASHBOARD_ID_MAP_VIEW);
                    },
                    width: "14px",
                    editable: false,
                    attributes: {
                        style: "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
                    },
                    headerAttributes: {
                        style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
                    }
                }, {
                    field: "FULL_EFFDAY_HOLIDAY_L",
                    title: "Leg Effective Days (L)",
                    hidden: !parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    width: "110px",
                    attributes: {
                        style: "border-right:none !important"
                    },
                    headerAttributes: {
                        title: "Leg Effective Days",
                        style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
                    }
                }, {
                    field: "FULL_EFFDAY_HOLIDAY_Z",
                    title: "Leg Effective Days (Z)",
                    hidden: parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    width: "110px",
                    attributes: {
                        style: "border-right:none !important"
                    },
                    headerAttributes: {
                        title: "Leg Effective Days",
                        style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
                    }
                }, {
                    field: "CAL_BUTTON_L",
                    title: " ",
                    hidden: !parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    width: "14px",
                    template: calenderRowTemplateL,
                    attributes: {
                        style: "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
                    },
                    headerAttributes: {
                        style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
                    }
                }, {
                    field: "CAL_BUTTON_Z",
                    title: " ",
                    hidden: parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    width: "14px",
                    template: calenderRowTemplateZ,
                    attributes: {
                        style: "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
                    },
                    headerAttributes: {
                        style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
                    }
                },
                /*{
                 hidden : parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                 field : "FULL_EFFDAY_HOLIDAY_L",
                 hidden : false,
                 title : "Eff Days",
                 width : "100px",
                 attributes : {
                 style : ""
                 },
                 headerAttributes : {
                 title : "Eff Days",
                 style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
                 }
                 }*/
                {
                    hidden: !parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    field: "LOCAL_DEP",
                    title: "Dept (L)",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Departure Time",
                        style: "text-align:center;"
                    }
                }, {
                    hidden: parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    field: "ZULU_DEP",
                    title: "Dept (Z)",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Departure Time",
                        style: "text-align:center;"
                    }
                }, {
                    hidden: !parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    field: "LOCAL_ARR",
                    title: "Arriv (L)",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Arrival Time",
                        style: "text-align:center;"
                    }
                }, {
                    hidden: parent.getDashboardContentWindow('mapViewDiv').isLocalFlag,
                    field: "ZULU_ARR",
                    title: "Arriv (Z)",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Arrival Time",
                        style: "text-align:center;"
                    }
                }, {
                    field: "LOC_GRND_MIN_QTY",
                    title: "Grnd Mins",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Ground Time Minutes",
                        style: "text-align:center;"
                    }
                    /*,
                     editor : function(container, options) {
                     grndMinCellEditor(container, options);
                     }*/
                }, {
                    field: "FLIGHT_MINS",
                    title: "Transit (hhmm)",
                    width: "60px",
                    attributes: {
                        style: ""
                    },
                    headerAttributes: {
                        title: "Transit Time Minutes",
                        style: "text-align:center;"
                    },
                    editor : function(container, options) {
                        SkdMxHelper.getSkdMxGridComponentManager().transitMinsEditor(container, options, routeId);
                    }
                }
            ];
        };

    constructorFn.transitMinsEditor = function(container, options, routeId){
        if( $("#manualTimed_"+routeId).prop("checked")) {
            container.append('<input type="text" class="k-input k-textbox" name="'+ options.field +'" data-bind="value:'+ options.field +'">');
        }else {
            container.text(options.model[options.field]);
        }
    };

    constructorFn.isManualTimeCheckboxClickHandler = function(chkBoxObj, routeId){
        if(routeId != undefined && !$(chkBoxObj).prop("checked") ){
            this.setUseLegMinFlag(routeId, $(chkBoxObj).prop("checked") );
        }
    };

    constructorFn.setUseLegMinFlag = function(routeId, flag){
        if(routeId != undefined){
            SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId][0]["USE_LEG_MINS_FLAG"] = flag ? "True" : "False" ;
        }
    };

    constructorFn.isManualTimeCheckboxRowHandler = function(target,grid_Id){
        var transitTd = $(target).parent().prev();
        if(transitTd  != undefined && transitTd[0] != undefined){
            $(transitTd[0]).click ();
        }
        LoggerUtils.console(transitTd);
    };

    constructorFn.getGridDataSource = function(grid_Id, data) {
        return new kendo.data.DataSource({
            pageSize: 500,
            data: (data != undefined) ? data : [],
            filter: {
                field: "OPERATION_CD",
                operator: "neq",
                value: "Deleted"
            },
            schema: {
                model: {
                    id: "LegsGrid",
                    fields: {
                        LEG_ID: {
                            type: "string",
                            editable: false
                        },
                        ROUTE_ID: {
                            type: "string",
                            editable: false
                        },
                        MV_NUM: {
                            type: "string",
                            editable: false
                        },
                        MV_NUM_SEQ: {
                            type: "number",
                            editable: false
                        },
                        FULL_EFFDAY_HOLIDAY_L: {
                            type: "string",
                            editable: false
                        },
                        FLIGHT_MINS: {
                            type: "string",
                            editable: SkdMxHelper.getSkdMxGridComponentManager().isManualTimedMode()
                        },
                        CAL_BUTTON_L: {
                            type: "string",
                            editable: false
                        },
                        FULL_EFFDT_Z: {
                            type: "string",
                            editable: false
                        },
                        CAL_BUTTON_Z: {
                            type: "string",
                            editable: false
                        },
                        LEG_TYPE: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                legtype: function (input) {
                                    if(input.val() == undefined || input.val() == "") {
                                        input.attr("data-legtype-msg", "LegType Field is Required");
                                        // enableDisableSaveBtns(false);
                                        SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                        return false;
                                    }
                                    if (input.is("[name='LEG_TYPE']")) {
                                        var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
                                        if(!isValid){
                                            input.attr("data-legtype-msg", "Please enter the valid LegType");
                                            // enableDisableSaveBtns(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
//   								enableDisableSaveBtns(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        EQUIP_TYPE: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                equipmenttype: function (input) {
                                    if(input.val() == undefined || input.val() == "") {
                                        input.attr("data-equipmenttype-msg", "EqType Field is Required");
                                        // enableDisableSaveBtns(false);
                                        SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                        return false;
                                    }
                                    if (input.is("[name='EQUIP_TYPE']")) {
                                        var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
                                        if(!isValid){
                                            input.attr("data-equipmenttype-msg", "Please enter the valid equipmentType");
                                            // enableDisableSaveBtns(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
//   								enableDisableSaveBtns(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        ORIGIN: {
                            type: "string",
                            editable: false
                        },
                        DESTINATION: {
                            type: "string",
                            editable: false
                        },
                        OWNER_LOC_CD: {
                            type: "string",
                            editable: false
                        },
                        MANAGER_ID: {
                            type: "string",
                            editable: false
                        },
                        LOCAL_DEP: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                localdepvalidation: function(input) {
                                    if (input.val() == undefined || input.val() == "") {
                                        return true;
                                    }
                                    if (input.is("[name='LOCAL_DEP']")) {
                                        if (!validateTimeWithOrWithoutColon(input.val())) {
                                            input.attr("data-localdepvalidation-msg", "Please enter the valid Time");
                                            //enableOrDisableSaveMenu(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
                                    //enableOrDisableSaveMenu(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        ZULU_DEP: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                zuludepvalidation: function(input) {
                                    if (input.val() == undefined || input.val() == "") {
                                        return true;
                                    }
                                    if (input.is("[name='ZULU_DEP']")) {
                                        if (!validateTimeWithOrWithoutColon(input.val())) {
                                            input.attr("data-zuludepvalidation-msg", "Please enter the valid Time");
                                            //enableOrDisableSaveMenu(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
                                    //enableOrDisableSaveMenu(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        LOCAL_ARR: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                localarrvalidation: function(input) {
                                    if (input.val() == undefined || input.val() == "") {
                                        return true;
                                    }
                                    if (input.is("[name='LOCAL_ARR']")) {
                                        if (!validateTimeWithOrWithoutColon(input.val())) {
                                            input.attr("data-localarrvalidation-msg", "Please enter the valid Time");
                                            //enableOrDisableSaveMenu(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
                                    //enableOrDisableSaveMenu(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        ZULU_ARR: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: false,
                                zuluarrvalidation: function(input) {
                                    if (input.val() == undefined || input.val() == "") {
                                        return true;
                                    }
                                    if (input.is("[name='ZULU_ARR']")) {
                                        if (!validateTimeWithOrWithoutColon(input.val())) {
                                            input.attr("data-zuluarrvalidation-msg", "Please enter the valid Time");
                                            //enableOrDisableSaveMenu(false);
                                            SkdMxHelper.getMapOpeationManager().setValidationError(true);
                                            return false;
                                        }
                                    }
                                    //enableOrDisableSaveMenu(true);
                                    SkdMxHelper.getMapOpeationManager().setValidationError(false);
                                    return true;

                                }
                            }
                        },
                        CALCULATED_ARR_TIME: {
                            type: "string",
                            editable: false
                        },
                        LOC_GRND_MIN_QTY: {
                            type: "string",
                            editable: true
                        },
                        ARRIVAL_DAY_L: {
                            type: "string",
                            editable: false
                        },
                        ARRIVAL_DAY_Z: {
                            type: "string",
                            editable: false
                        },
                        BLOCK_TIME_Z: {
                            type: "string",
                            editable: false
                        },
                        LEG_MILES: {
                            type: "string",
                            editable: false
                        },
                        TRACK_EQUIP_TYPE: {
                            type: "string",
                            editable: false
                        },
                        TRAIL_AVAIL_TM: {
                            type: "string",
                            editable: false
                        },
                        TRAIL_OPT: {
                            type: "string",
                            editable: false
                        },
                        DAILY_RT_CC_CHG: {
                            type: "string",
                            editable: false
                        },
                        TOTAL_MTH_CST: {
                            type: "string",
                            editable: false
                        },
                        TOTAL_MTH_CST: {
                            type: "string",
                            editable: false
                        },
                        CARRIER_DESC: {
                            type: "string",
                            editable: false
                        },
                        CARRIER_DESC: {
                            type: "string",
                            editable: false
                        },
                        IN_DST: {
                            type: "string",
                            editable: false
                        },
                        USE_LEG_MINS_FLAG: {
                            type: "string",
                            editable:false
                        }
                    }
                }
            }
        });
    };
    constructorFn.getDataSourceData = function(dataType) {
        try {
            return parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[dataType].data().toJSON();
        } catch (e) {
            parent.showErrorMsg("Error occured while fetching the data for " + dataType);
        }
    };

    constructorFn.populateSMGrid = function(legDetails, tempRouteId) {
        var routeId;
        if (tempRouteId != undefined) {
            routeId = tempRouteId;
        } else if (legDetails[0].ROUTE_ID != undefined) {
            routeId = legDetails[0].ROUTE_ID;
        } else {
            routeId = legDetails[0]["routeId"];
            legDetails[0]["ROUTE_ID"] = routeId;
        }
        if (this.gridMap != undefined && this.gridMap[routeId] != undefined) {
            var ds = this.getGridDataSource((this.gridMap[routeId])[0].id, legDetails);
            ds.read();
            $(this.gridMap[routeId]).data("kendoGrid").setDataSource(ds);
            delete ds;
        } else {
            this.createGridNdAdd2Display(legDetails, routeId);
        }
        setTimeout(function(routeId) {
            try{
                SkdMxHelper.getSkdMxGridComponentManager().setGridStyles(SkdMxHelper.getSkdMxGridComponentManager().gridMap[SkdMxHelper.getMapOpeationManager().getRouteId()].selector);
            }catch(e){
                console.log("Error occured while setting the styles ");
            }

        }, 1000);
        this.validateGridLayoutNow();
        delete routeId;
    };

    constructorFn.setGridStyles = function(gridId) {
        var isStyleApplied = false;
        if (gridId != undefined) {
            if (!$(gridId).find(".k-grid-header").hasClass("k-grid-custom-header")) {
                $(gridId).find(".k-grid-header").addClass("k-grid-custom-header");
                isStyleApplied = true;
            }

            if (!$(gridId).find(".k-grid-content").hasClass("k-grid-custom-content")) {
                $(gridId).find(".k-grid-content").addClass("k-grid-custom-content");
            }
        }

        if (isStyleApplied) {
            $(gridId).data("kendoGrid").refresh();
        }
    };

    constructorFn.getLocalColumns = function() {
        return ["FULL_EFFDAY_HOLIDAY_L", "CAL_BUTTON_L", "LOCAL_DEP", "LOCAL_ARR", "ARRIVAL_DAY_L", "BLOCK_INDAY_L_NBR"];
    };

    constructorFn.getZuluColumns = function() {
        return ["FULL_EFFDAY_HOLIDAY_Z", "CAL_BUTTON_Z", "ZULU_DEP", "ZULU_ARR", "ARRIVAL_DAY_Z", "BLOCK_INDAY_Z_NBR"];
    };
    constructorFn.showLocalZuluColumns = function(toggleBtn) {
        SkdMxHelper.getSkdMxGridComponentManager().showColumns(SkdMxHelper.getSkdMxGridComponentManager().getLocalColumns(), toggleBtn.toggled);
        SkdMxHelper.getSkdMxGridComponentManager().showColumns(SkdMxHelper.getSkdMxGridComponentManager().getZuluColumns(), !toggleBtn.toggled);
    };

    constructorFn.showColumns = function(columnsArray, isShow) {
        if (columnsArray) {
            var legsGirds = Object.keys(this.gridMap); //get available matrixids
            for (var j = 0; j < legsGirds.length; j++) {
                var grid = $("#" + SkdMxHelper.getSkdMxGridComponentManager().SchdleMntnceMapDwrContentGrid + "_" + legsGirds[j]).data("kendoGrid");
                if (grid != null) {
                    for (var i = 0; i < columnsArray.length; i++) {
                        if (isShow) {
                            grid.showColumn(columnsArray[i]);
                        } else {
                            grid.hideColumn(columnsArray[i]);
                        }
                    }
                }
                grid.refresh();
            }
        }
    };

    constructorFn.validateGridLayoutNow = function() {
        if (this.gridMap != undefined && Object.keys(this.gridMap).length > 0) {
            $("#SchdleMntnceMapDwrContent").show();
        } else {
            $("#SchdleMntnceMapDwrContent").hide();
        }
    };
    /**
     *
     * @param count
     */
    constructorFn.updateRouteSelection = function(radioBtn) {
        var routeId = $(radioBtn).val();
        this.currentSelectedRoute = routeId;
        if (SkdMxHelper.getSkdMxGridComponentManager().isEmptyRoute(routeId)) { //if route is empty with no legs
            SkdMxHelper.getMapOpeationManager().setAddRoute(true);
            ESRIHelper.getEditToolManager().validateAddRouteOperationNow(this.currentSelectedRoute);
        }
        this.setModeByRouteId(routeId);
        SkdMxHelper.getDrawer().paintSkdMxDrawerWizardByRouteId(routeId);
        SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnDefaultPointer"), true);
        SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
    };

    constructorFn.updateRouteNLegList = function(routeId) {
        SkdMxHelper.getSkdMxGridComponentManager().setMoveNumber($("#moveNumCell_"+routeId).val().toUpperCase(), routeId);
        SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
    };




    constructorFn.updateSelectionByRouteId = function(routeId) {
        this.currentSelectedRoute = routeId;
        if (SkdMxHelper.getSkdMxGridComponentManager().isEmptyRoute(routeId)) { //if route is empty with no legs
            SkdMxHelper.getMapOpeationManager().setAddRoute(true);
            ESRIHelper.getEditToolManager().validateAddRouteOperationNow(this.currentSelectedRoute);
        }
        this.setModeByRouteId(routeId);
        SkdMxHelper.getDrawer().paintSkdMxDrawerWizardByRouteId(routeId);
        SkdMxHelper.getDrawer().selectPointer(document.getElementById("btnDefaultPointer"), true);
        SkdMxHelper.getSkdMxGridComponentManager().validateBeforeSaveHandler();
    };

    constructorFn.setModeByRouteId = function(routeId) {
        if (routeId) {
            var routeData = this.rteDataMap[routeId];
            if (routeData != undefined) {
                SkdMxHelper.getMapOpeationManager().setMode(routeData[0]["MODE"]);
                this.getModeHeaderByRteData(routeData, routeId);
            }
        }
    };

    constructorFn.setModeHeader = function(mode, mission) {
        if (mode != undefined) {
            $(".ui-icon-1-e-route").parent().text("Schedule Maintenanace: " + mode + " - " + mission);
        }
    },

        constructorFn.addPreviousLeg = function(tempRouteId, legId, legObject) {
            var routeId;
            if (tempRouteId != undefined) {
                routeId = tempRouteId;
            } else {
                routeId = this.currentSelectedRoute;
            }
            var tempList = parent.createSelectedLegList(this.rteDataMap[routeId], this.matchingLegsMap[routeId], 'addPreviousLeg', (legId != undefined ? legId : this.legIdDataMap[routeId]), legObject);
            this.populateSMGrid(tempList, routeId);
            delete tempList;
        };
    constructorFn.createRoute = function(menu, legObject, options) {
        var route, leg;
        if (menu == undefined || menu == EMPTY_STRING || menu == MODE_CODES.FLT_TRUNK) { //defeault option is flight trunk
            route = [getRouteObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_TRUNK, undefined, ROUTE_CONTEXT_CODES.FLT_TRUNK, menu)];
            leg = [getLegObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_TRUNK, ROUTE_CONTEXT_CODES.FLT_TRUNK, null, legObject)];
        } else if (menu == MODE_CODES.FLT_FEEDER) {
            route = [getRouteObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_FEEDER, undefined, ROUTE_CONTEXT_CODES.FLT_FEEDER, menu)];
            leg = [getLegObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_FEEDER, ROUTE_CONTEXT_CODES.FLT_FEEDER, null, legObject)];
        } else if (menu == MODE_CODES.FLT_CLH) {
            route = [getRouteObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_FEEDER, "Linehaul", ROUTE_CONTEXT_CODES.FLT_CLH, menu)];
            leg = [getLegObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_FEEDER, ROUTE_CONTEXT_CODES.FLT_CLH, "Linehaul", legObject)];
        } else if (menu == MODE_CODES.TRK_SLH) {
            route = [getRouteObj("Truck", "Standard", "Truck", "Linehaul", ROUTE_CONTEXT_CODES.TRK_SLH, menu)];
            leg = [getLegObj("Truck", "Standard", "Truck", ROUTE_CONTEXT_CODES.TRK_SLH, "Linehaul", legObject)];
        } else if (menu == MODE_CODES.TRK_SSH) {
            route = [getRouteObj("Truck", "Standard", "Truck", "Shuttle", ROUTE_CONTEXT_CODES.TRK_SSH, menu)];
            leg = [getLegObj("Truck", "Standard", "Truck", ROUTE_CONTEXT_CODES.TRK_SSH, "Shuttle", legObject)];
        } else if (menu == MODE_CODES.TRK_GNP) {
            route = [getRouteObj("Truck", "Standard", "Truck", "Shuttle", ROUTE_CONTEXT_CODES.TRK_GNP, menu)];
            leg = [getLegObj("Truck", "Standard", "Truck", ROUTE_CONTEXT_CODES.TRK_GNP, "Shuttle", legObject)];
        } else if (menu == MODE_CODES.TRK_GBT) {
            route = [getRouteObj("Truck", "Oversized", "Truck", undefined, ROUTE_CONTEXT_CODES.TRK_GBT, menu)];
            leg = [getLegObj("Truck", "Oversized", "Truck", ROUTE_CONTEXT_CODES.TRK_GBT, null, legObject)];
        }
        SkdMxHelper.getMapOpeationManager().setCallforMatrix(false);
        SkdMxHelper.getSkdMxGridComponentManager().showLoader();
        parent.SkdMxServiceHelper.getDefaultServiceManager().callDefautValuesService(route, leg, function(response, io) {
            SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess(response, io, options);
        });
    };

    constructorFn.showLoader = function() {
        //$("#timeCostAnimator").show();
    };

    constructorFn.hideLoader= function() {
        //$("#timeCostAnimator").hide();
    };


    constructorFn.getSelectedKendoGridInstance = function(tempRouteId) {
        var legGridId;
        if (tempRouteId != undefined) {
            legGridId = this.SchdleMntnceMapDwrContentGrid + "_" + tempRouteId;
        } else {
            legGridId = this.getSelectedGridId();
        }

        return $(HASH_STRING + legGridId).data("kendoGrid");
    };

    constructorFn.getSelectedRadioBtnId = function() {
        return SkdMxHelper.getSkdMxGridComponentManager().SchdleMntnceMapDwrGridRadio + "_" + SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute;
    },

    /**
     * FdxFDX-1268 :- Anchor time not being managed correctly when 'add previous' used
     *  set the anchor tag
     *  Rules:
     *  1) persit the same leg that is anchored irrespective of any number of legs thar are added
     *  2)  In case of delete operation, the next leg becomes the anchor
     *  while the total legs are greater than or equal to the current leg sequence anchor
     *  3) in case of delete operation, current leg sequence is > than  total legs then reset to
     *  first leg as the anchor leg
     */
        constructorFn.setAnchorData = function(routeId, legData, routeDtls) {
            var routeData;
            if(routeId == undefined){
                routeData = routeDtls;
            }else {
                routeData = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[routeId][0];
            }
            if(routeData != undefined &&  legData != undefined){
                var cellL;
                var cellZ;
                var leg;
                for(var i=0; i<legData.length; i++){
                    if( parseInt(routeData.ANCHOR_LEG_SEQ) +1 <= legData.length &&  legData[i]["MV_NUM_SEQ"] == parseInt(routeData.ANCHOR_LEG_SEQ) +1 ){
                        leg = legData[i];
                        break;
                    }else if( parseInt(routeData.ANCHOR_LEG_SEQ) +1 > legData.length ){
                        leg = legData[0];
                        routeData.ANCHOR_LEG_SEQ = "0";
                        break;
                    }
                }
                //will be used in future
                if(leg != undefined){
                    if(routeData.ANCHOR_LEG_TM_CD == "Block In") {
                        cellL = leg["LOCAL_ARR"];
                        cellZ = leg["ZULU_ARR"];
                    }else if(routeData.ANCHOR_LEG_TM_CD == "Block Out") {
                        cellL = leg["LOCAL_DEP"];
                        cellZ = leg["ZULU_DEP"];
                    }else if(routeData.ANCHOR_LEG_TM_CD == "Off") {
                        cellL = leg["B_OFFTIME_L"];
                        cellZ = leg["B_OFFTIME_Z"];
                    }else if(routeData.ANCHOR_LEG_TM_CD == "On") {
                        cellL = leg["LANDING_TIME_L"];
                        cellZ = leg["LANDING_TIME_Z"];
                    }

                    if(cellL != undefined && cellZ != undefined){
                        routeData["ANCHOR_LEG_ID"] = leg["LEG_ID"];
                    }
                }
            }
        },

        constructorFn.addLeg = function(type, tempRouteId, operation, legObject, index) {
            var legGridId;
            if (tempRouteId != undefined) {
                legGridId = this.SchdleMntnceMapDwrContentGrid + "_" + tempRouteId;
            } else {
                legGridId = this.getSelectedGridId();
                tempRouteId = this.currentSelectedRoute;
            }
            var legIndex;
            var grid = $(HASH_STRING + legGridId).data("kendoGrid");
            if (grid != undefined) {
                var datasource = grid.dataSource;
                if (index != undefined) {
                    legIndex = index;
                } else {
                    legIndex = datasource.data().length;
                }
                //for add operation's... set the anchor tag
                //FdxFDX-1268 :- Anchor time not being managed correctly when 'add previous' used
                this.setAnchorData(tempRouteId, this.getActiveLegs(kendoDatasource));
                datasource.insert(legIndex, parent.getLegObj());

                var kendoDatasource = grid.dataSource;
                var datasource = kendoDatasource.data();
                var j = 0;
                var activeLegIndex;
                for (var i = 0; i < datasource.length; i++) {
                    if (datasource[i]["OPERATION_CD"] != parent.OPERATION_CD_DELETE && type == "MV_NUM_SEQ") {
                        j = j + 1;
                        datasource[i]["MV_NUM_SEQ"] = j;
                        if (datasource[i]["LEG_ID"] == 1) {
                            datasource[i]["LEG_ID"] = datasource[i]["ROUTE_ID"] + "-" + (j);
                        }
                        if (legIndex == 0 && i == 0 && operation == parent.OPERATION_CD_ADD) {
                            datasource[i]["ROUTE_ID"] = tempRouteId; //datasource[i-1]["ROUTE_ID"];
                            //if its first leg then get the next leg to update the origin and destination...
                            activeLegIndex = this.getLegIndexByView(datasource[i], kendoDatasource, false);
                            if (datasource[activeLegIndex] != undefined) {
                                datasource[i]["MV_NUM"] = datasource[activeLegIndex]["MV_NUM"];
                                datasource[i]["LEG_TYPE"] = datasource[activeLegIndex]["LEG_TYPE"];
                                datasource[i]["EQUIP_TYPE"] = datasource[activeLegIndex]["EQUIP_TYPE"];
                                datasource[i]["MODE"] = datasource[activeLegIndex]["MODE"];
                                datasource[i]["CONVEYANCE"] = datasource[activeLegIndex]["CONVEYANCE"];
                                datasource[i]["CAPACITY_CD"] = datasource[activeLegIndex]["CAPACITY_CD"];
                                datasource[i]["ORIGIN"] = legObject["ORIGIN"];
                                datasource[i]["DESTINATION"] = legObject["DESTINATION"];
                            } else {
                                datasource[i]["MODE"] = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId][0]["MODE"];
                                datasource[i]["CONVEYANCE"] = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId][0]["CONVEYANCE"];
                                datasource[i]["CAPACITY_CD"] = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId][0]["CAPACITY_CD"];
                                datasource[i]["ORIGIN"] = legObject["ORIGIN"];
                                datasource[i]["DESTINATION"] = legObject["DESTINATION"];
                            }

                            datasource[i]["ORIGIN"] = legObject["ORIGIN"];
                            datasource[i]["DESTINATION"] = legObject["DESTINATION"];
                        } else if (legIndex > 0 && i == legIndex && operation == parent.OPERATION_CD_ADD) {
                            //if the leg that is added is last leg then get the previous leg object...
                            datasource[i]["ROUTE_ID"] = tempRouteId; //datasource[i-1]["ROUTE_ID"];
                            activeLegIndex = this.getLegIndexByView(datasource[i], kendoDatasource, true);
                            if(datasource[activeLegIndex] != undefined){
                                datasource[i]["MV_NUM"] = datasource[activeLegIndex]["MV_NUM"];
                                datasource[i]["LEG_TYPE"] = datasource[activeLegIndex]["LEG_TYPE"];
                                datasource[i]["EQUIP_TYPE"] = datasource[activeLegIndex]["EQUIP_TYPE"];
                                datasource[i]["ORIGIN"] = legObject["ORIGIN"];
                                datasource[i]["MODE"] = datasource[activeLegIndex]["MODE"];
                                datasource[i]["CONVEYANCE"] = datasource[activeLegIndex]["CONVEYANCE"];
                                datasource[i]["CAPACITY_CD"] = datasource[activeLegIndex]["CAPACITY_CD"];
                                datasource[i]["DESTINATION"] = legObject["DESTINATION"];
                            }
                        }
                    } else if (type == "MV_NUM") {
                        datasource[i]["MV_NUM"] = datasource[i]["MV_NUM"];
                    }
                }
                //FdxFDX-1268 :- Anchor time not being managed correctly when 'add previous' used
                maintainAnchorLeg(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId][0], this.getActiveLegs(kendoDatasource));
                grid.refresh();

                this.validateAndInvokeDefaultOrTimeCostServiceNow(grid, tempRouteId, operation, true);
            } else {
                //    		this.createRoute(parent.scheduleMaintenananceSeletedMenu,legObject);
            }
        };

    /**
     *
     * @param kendoDatasource
     * @returns {Array}
     */
    constructorFn.getActiveLegs = function (kendoDatasource) {
        if (kendoDatasource != undefined) {
            var activeLegs = [];
            var _data = kendoDatasource.data();
            var legItem;
            for (var i = 0; i < _data.length; i++) {
                legItem = _data[i];
                if (legItem["OPERATION_CD"] == "Deleted") {
                    continue;
                }
                activeLegs.push(legItem);
            }
            return activeLegs;
        }
    };

    constructorFn.validateAndInvokeDefaultOrTimeCostServiceNow = function(grid, tempRouteId, operation, isAddLeg, mapOperation, isDuplicateRoute, customProperties) {
        var legData = grid.dataSource.data().toJSON();
        var routeData = this.rteDataMap[tempRouteId];
        if (mapOperation == undefined || mapOperation.isTriggerDefaultService) {
            if (operation == parent.OPERATION_CD_ADD) {
                if (!parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().canTriggerTimeNCostService(routeData[0] != undefined ? routeData[0] : routeData, legData, undefined, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag, true) || (isDuplicateRoute != undefined && isDuplicateRoute)) {
                    if (isAddLeg) {
                        SkdMxHelper.getMapOpeationManager().setCallforMatrix(true);
                    }
                    SkdMxHelper.getSkdMxGridComponentManager().showLoader();
                    parent.SkdMxServiceHelper.getDefaultServiceManager().callDefautValuesService(routeData, legData, function(response, io) {
                        if(customProperties){
                            customProperties["isDuplicate"] = isDuplicateRoute;
                        }
                        SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess(response, io, customProperties);
                        if(isDuplicateRoute){
                            return;
                        }
                        var legData = grid.dataSource.data().toJSON();
                        var routeData = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId];
                        var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData[0] != undefined ? routeData[0] : routeData, legData, function(response, io) {
                            SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess(response, io);
                        }, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag, true, undefined, true);
                        if(isCallService ){
                            SkdMxHelper.getSkdMxGridComponentManager().showLoader();
                        }
                    });
                } else {
                    var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData[0] != undefined ? routeData[0] : routeData, legData, SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag, true, undefined, true);
                    if(isCallService ){
                        SkdMxHelper.getSkdMxGridComponentManager().showLoader();
                    }
                }

            } else if (operation == parent.OPERATION_CD_DELETE) {
                var isCallService = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData[0] != undefined ? routeData[0] : routeData, legData, SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess, parent.getDashboardContentWindow('mapViewDiv').isLocalFlag, true, undefined, false);
                if(isCallService ){
                    SkdMxHelper.getSkdMxGridComponentManager().showLoader();
                }
            }
        }
    };

    constructorFn.getLegDetailByDeletedOrder = function(grid, index) {
        var nonFilteredKendoDatasource = grid.dataSource;
        nonFilteredKendoDatasource.filter({
            field: "OPERATION_CD",
            operator: "neq",
            value: "Deleted"
        });
        var datasource = nonFilteredKendoDatasource.view();
        return nonFilteredKendoDatasource.getByUid(datasource[index]["uid"]);
    };

    constructorFn.ChangeLegDestinationOrOrigin = function(type, tempRouteId, operation, legObject, index, mapOperation) {
        var legGridId;
        if (tempRouteId != undefined) {
            legGridId = this.SchdleMntnceMapDwrContentGrid + "_" + tempRouteId;
        } else {
            legGridId = this.getSelectedGridId();
        }
        var legIndex;
        var grid = $(HASH_STRING + legGridId).data("kendoGrid");
        var datasource = grid.dataSource;

        if (index != undefined) {
            legIndex = index;
        } else {
            legIndex = datasource.data().length;
        }

        if (mapOperation != undefined) {
            switch (mapOperation.oprType) {
                case "move":
                    //getting the un-deleted records
                    var legDetail = (datasource.view())[legIndex];
                    if (legDetail != undefined) {
                        switch (mapOperation.subOprType) {
                            case "start":
                                legDetail["ORIGIN"] = LegDetailGraphicUtils.getOrigin(legObject);
                                break;

                            case "end":
                                legDetail["DESTINATION"] = LegDetailGraphicUtils.getDestination(legObject);
                                break;
                        }
                    }
                    legIndex = datasource.indexOf(legDetail);
                    break;
                case "insert":
                    //logic for considering the deleted data items
                    var _view = datasource.view();
                    var legDetail = _view[legIndex];
                    if(legDetail == undefined){
                        if (_view.length == legIndex) {
                            legDetail = _view[_view.length - 1];
                            legIndex = datasource.indexOf(legDetail);
                            legIndex = legIndex + 1;
                        }  else {
                            legIndex = _view.length + 1;
                        }
                    } else {
                        legIndex = datasource.indexOf(legDetail);
                    }
                    datasource.insert(legIndex, parent.getLegObj());
                    break;
                case "delete":
                    var preLegDetail;
                    var legDetail = this.getLegDetailByDeletedOrder(grid, legIndex);
                    switch (mapOperation.subOprType) {
                        case "start":
                            if(legDetail["OPERATION_CD"] === "Insert"){
                                datasource.remove(legDetail);
                            }else {
                                legDetail["OPERATION_CD"] = "Deleted";
                            }
                            break;
                        case "middle":
                            preLegDetail = this.getLegDetailByDeletedOrder(grid, legIndex - 1);
                            preLegDetail["DESTINATION"] = LegDetailGraphicUtils.getDestination(legDetail);
                            if(legDetail["OPERATION_CD"] === "Insert"){
                                datasource.remove(legDetail);
                            }else {
                                legDetail["OPERATION_CD"] = "Deleted";
                            }
                            break;
                        case "end":
                            if(legDetail["OPERATION_CD"] === "Insert"){
                                datasource.remove(legDetail);
                            }else {
                                legDetail["OPERATION_CD"] = "Deleted";
                            }
                            break;
                    }
                    break;
            }
        }

        //get the grid datasource
        var kendoDatasource = grid.dataSource;
        //all inactive & activelegs
        var datasource = kendoDatasource.data();
        //FdxFDX-1268 :- Anchor time not being managed correctly when 'add previous' used
        this.setAnchorData(tempRouteId, this.getActiveLegs(kendoDatasource));
        var j = 0;
        var previousLegIndex = 0;
        for (var i = 0; i < datasource.length; i++) {
            //for all active legs
            if (datasource[i]["OPERATION_CD"] != parent.OPERATION_CD_DELETE && type == "MV_NUM_SEQ") {
                //update the sequence
                j = j + 1;
                datasource[i]["MV_NUM_SEQ"] = j;
                if (datasource[i]["LEG_ID"] == 1) {
                    datasource[i]["LEG_ID"] = datasource[i]["ROUTE_ID"] + "-" + (j);
                }

                if (legIndex == 0 && i == 0 && datasource.length == 1 && operation == parent.OPERATION_CD_ADD) {
                    //if this is first leg and having only only one leg for route
                    datasource[i]["ROUTE_ID"] = tempRouteId;
                    datasource[i]["MV_NUM"] = datasource[0]["MV_NUM"];
                    datasource[i]["LEG_TYPE"] = datasource[0]["LEG_TYPE"];
                    datasource[i]["EQUIP_TYPE"] = datasource[0]["EQUIP_TYPE"];
                    datasource[i]["ORIGIN"] = legObject["ORIGIN"] != undefined ? legObject["ORIGIN"] : datasource[0]["ORIGIN"];
                    datasource[i]["MODE"] = datasource[0]["MODE"];
                    datasource[i]["CONVEYANCE"] = datasource[0]["CONVEYANCE"];
                    datasource[i]["CAPACITY_CD"] = datasource[0]["CAPACITY_CD"];
                    datasource[i]["DESTINATION"] = legObject["DESTINATION"] != undefined ? legObject["DESTINATION"] : datasource[0]["DESTINATION"];
                } else if (legIndex == 0 && i == 0 && operation == parent.OPERATION_CD_ADD) {
                    //if this is first leg and having more than one leg for route
                    datasource[i]["ROUTE_ID"] = tempRouteId; //datasource[i-1]["ROUTE_ID"];
                    datasource[i]["MV_NUM"] = datasource[1]["MV_NUM"];
                    datasource[i]["LEG_TYPE"] = datasource[1]["LEG_TYPE"];
                    datasource[i]["EQUIP_TYPE"] = datasource[1]["EQUIP_TYPE"];
                    datasource[i]["ORIGIN"] = legObject["ORIGIN"] != undefined ? legObject["ORIGIN"] : datasource[1]["ORIGIN"];
                    datasource[i]["MODE"] = datasource[1]["MODE"];
                    datasource[i]["CONVEYANCE"] = datasource[1]["CONVEYANCE"];
                    datasource[i]["CAPACITY_CD"] = datasource[1]["CAPACITY_CD"];
                    datasource[i]["DESTINATION"] = legObject["DESTINATION"] != undefined ? legObject["DESTINATION"] : datasource[1]["DESTINATION"];
                } else if (legIndex > 0 && i == legIndex && operation == parent.OPERATION_CD_ADD) {
                    //if this is not first leg
                    datasource[i]["ROUTE_ID"] = tempRouteId; //datasource[i-1]["ROUTE_ID"];
                    //get the previous leg from the array of active legs & update the properties
                    previousLegIndex = this.getLegIndexByView(datasource[i], kendoDatasource);
                    if (previousLegIndex != undefined) {
                        datasource[i]["MV_NUM"] = datasource[previousLegIndex]["MV_NUM"];
                        datasource[i]["LEG_TYPE"] = datasource[previousLegIndex]["LEG_TYPE"];
                        datasource[i]["EQUIP_TYPE"] = datasource[previousLegIndex]["EQUIP_TYPE"];
                        datasource[i]["ORIGIN"] = legObject["ORIGIN"] != undefined ? legObject["ORIGIN"] : datasource[previousLegIndex]["ORIGIN"];
                        datasource[i]["MODE"] = datasource[previousLegIndex]["MODE"];
                        datasource[i]["CONVEYANCE"] = datasource[previousLegIndex]["CONVEYANCE"];
                        datasource[i]["CAPACITY_CD"] = datasource[previousLegIndex]["CAPACITY_CD"];
                        datasource[i]["DESTINATION"] = legObject["DESTINATION"] != undefined ? legObject["DESTINATION"] : datasource[previousLegIndex]["DESTINATION"];
                    }
                }
            } else if (type == "MV_NUM") {
                datasource[i]["MV_NUM"] = datasource[i]["MV_NUM"];
            }
        }
        //FdxFDX-1268 :- Anchor time not being managed correctly when 'add previous' used
        maintainAnchorLeg(SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[tempRouteId][0], this.getActiveLegs(kendoDatasource));
        grid.refresh();

        this.validateAndInvokeDefaultOrTimeCostServiceNow(grid, tempRouteId, operation, true, mapOperation);
    };

    /**
     *
     * @param legDataItem
     * @param kendoDatasource
     * @returns {*}
     */
    constructorFn.getLegIndexByView = function (legDataItem, kendoDatasource, isPrevious) {
        if(isPrevious == undefined){
            isPrevious = true;
        }
        if (legDataItem != undefined) {
            var _view = kendoDatasource.view();
            if (_view != undefined) {
                var leg;
                for (var i = 0; i < _view.length; i++) {
                    leg = _view[i];
                    if (leg != undefined) {
                        if (leg["uid"] == legDataItem["uid"]) {
                            if(isPrevious){
                                if (i - 1 >= 0) {
                                    return kendoDatasource.indexOf(_view[i - 1]);
                                }
                            }else{
                                if (i + 1 < _view.length) {
                                    return kendoDatasource.indexOf(_view[i + 1]);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    constructorFn.populateRouteData = function(graphicData, routeId) {
        var routeObj = getRouteObj("Flight", "Standard", ROUTE_CONTEXT_CODES.FLT_TRUNK, "Linehaul");
        routeObj["ROUTE_ID"] = routeId;
        return [routeObj];
    };

    constructorFn.populateRtDtlsNSMGrid = function(matchingLegs, rteData, legId) {
        if (matchingLegs != undefined && matchingLegs[0] != undefined) {
            this.matchingLegsMap[matchingLegs[0].ROUTE_ID] = matchingLegs;
            this.rteDataMap[matchingLegs[0].ROUTE_ID] = rteData;
            this.legIdDataMap[matchingLegs[0].ROUTE_ID] = legId;
            this.populateSMGrid(matchingLegs, matchingLegs[0].ROUTE_ID);
        } else {
            console.log("error in populateRtDtlsNSMGrid");
        }
    };

    constructorFn.removeAddedLanes = function(lanes) {
        var legs = [];
        for (var i = 0; i < lanes.length; i++) {
            if ((lanes[i].LEG_ID).length > 2) { //need to update the logic
                legs.push(lanes[i]);
            }
        }
        lanes = legs;
        return lanes;
    };
    constructorFn.cancelGridUpdates = function() {
        var routeIds = Object.keys(this.rteDataMap);
        var matchingLegs;
        var rteData;
        var legId;
        for (var i = 0; i < routeIds.length; i++) {
            matchingLegs = this.removeAddedLanes(this.matchingLegsMap[routeIds[i]]);
            rteData = this.rteDataMap[routeIds[i]];
            legId = this.legIdDataMap[routeIds[i]];
            this.populateRtDtlsNSMGrid(matchingLegs, rteData, legId);
        }
        delete routeIds;
        delete matchingLegs;
        delete rteData;
        delete legId;
    };

    constructorFn.destroyGrid = function(routeId) {
        if (routeId != undefined) {
            var gridId = "#" + this.SchdleMntnceMapDwrContentGrid + "_" + routeId;
            var grid = $(gridId).data("kendoGrid");
            if (grid) {
                grid.destroy();
            }
            this.destroyById(gridId);
            //this.destroyById("#row0_" + routeId);
            this.destroyById("#row1_" + routeId);
            this.destroyById("#row2_" + routeId);
            this.destroyById("#row3_" + routeId);
            this.destroyById("#row4_" + routeId);
        }
    };

    constructorFn.destroyById = function(elementId) {
        if (elementId != undefined) {
            $(elementId).empty();
            $(elementId).remove();
        }
    };

    constructorFn.isEmptyRoute = function(routeId) {
        var routeIds;
        if (routeId != undefined) {
            routeIds = [routeId];
        } else {
            routeIds = Object.keys(this.rteDataMap);
        }

        for (var i = 0; i < routeIds.length; i++) {
            if (this.matchingLegsMap[routeIds[i]] == undefined || (this.matchingLegsMap[routeIds[i]] != undefined && (this.matchingLegsMap[routeIds[i]]).length == 0)) {
                return true;
                break;
            }
        }
        return false;
    };
    constructorFn.clear = function(routeId) {
        if (routeId != undefined) {
            this.destroyGrid(routeId);
            delete this.gridMap[routeId];
            delete this.matchingLegsMap[routeId];
            delete this.rteDataMap[routeId];
            delete this.staticRteDataMap[routeId];
            delete this.staticLegDataMap[routeId];
            delete this.legIdDataMap[routeId];

            /* this.gridMap[routeId] = undefined;
             this.matchingLegsMap[routeId] = undefined;
             this.rteDataMap[routeId] = undefined;
             this.legIdDataMap[routeId] = undefined;*/

        }

    };

    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}

var GridFocusManager = (function() {
    function constructorFn() {
        this.editedRowIndex;
        this.editedColumnType;
        this.routeId;
    };


    constructorFn.followCursor = function(container, gridId, routeId, dataField){
        if(container != undefined && gridId!= undefined){
            this.routeId = routeId;
            var row = $(container).closest("tr");
            var dataItem = jQuery.extend(true, {}, $(HASH_STRING + gridId).data("kendoGrid").dataItem(row));
            this.editedRowIndex = getRowIndex($(HASH_STRING + gridId).data("kendoGrid").dataSource,dataItem);
            this.editedColumnType = container.find("input.k-input").attr('data-bind');
            if((this.editedColumnType =="" || this.editedColumnType == undefined )&& dataField != undefined){
                this.editedColumnType  = dataField;
            }else {
                if(this.editedColumnType != undefined && this.editedColumnType.length > 0 ){
                    this.editedColumnType = this.editedColumnType.substr(6,this.editedColumnType.length);
                }else{
                    this.editedColumnType = "";
                }
            }
        }
    };

    constructorFn.placeCursorToFiledName = function(gridId, routeId){
        if(gridId != undefined && routeId == this.routeId){
            var grid = this.getGrid(gridId);
            var row = this.getRowByIndex(gridId);
            if(grid!= undefined && row != undefined && row[0] != undefined){
                var fieldValue = grid.dataItem(row)[this.editedColumnType];
                var fieldCell = parent.SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(grid, row, this.editedColumnType);
                fieldCell.click();
            }
            rowIdx = undefined;
        }
    };

    constructorFn.getGrid= function(gridId){
        if(gridId != undefined){
            return $(HASH_STRING+gridId).data("kendoGrid");
        }
    };

    constructorFn.getRowByIndex = function(gridId){
        if(gridId != undefined){
           return $(HASH_STRING+gridId +' tr').eq(this.editedRowIndex + 1);
        }
    };


    return constructorFn;
})();