var revisionList ;
var originalRevisionList;
var RouteDetailsExt = [];
var isAdded= false;
var COMMENT_SEPERATOR = "-";
var FIELD_SEPARATOR = "0x03"
var selectedEquipDesc = EMPTY_STRING;
var selectedEquipMap =[];

function refresh() {
    initializeRevisionComment();
}

function initializeRevisionComment() {
    resetVariables();
    intializeReadOnly();
    getRevisionComment();
    setRevisionComment();
    setLastInternalComment();
    initKendoWindow();

    $("#revisionDialog").data("kendoWindow").close();
}

function initKendoWindow() {
    $("#revisionDialog").kendoWindow({
        width: "300px",
        height: "200px",
        modal: true,
        title: "Revision Comment",
        visible: false,
        actions:{}
    });
}

function resetVariables() {
    revisionList = null; ;
    originalRevisionList = null;
}
function intializeReadOnly() {
    $('#reasonCode').attr('readonly','readonly');
    $('#revisionComment').attr('readonly','readonly');
    $('#from').attr('readonly','readonly');
    $('#to').attr('readonly','readonly');
    $('#routeDetailComment').attr('readonly','readonly');
    $('#requestedBy').attr('readonly','readonly');
    $('#internalComment').attr('readonly','readonly');
    $( "#from" ).datepicker( "option", { disabled: true });
    $( "#to" ).datepicker( "option", { disabled: true });
}

function removeReadOnly(isEdit) {
    $('#reasonCode').removeAttr("readonly");
    $('#revisionComment').removeAttr("readonly");
    $('#routeDetailComment').removeAttr('readonly');
    $('#from').removeAttr("readonly");
    $('#to').removeAttr("readonly");
    $('#requestedBy').removeAttr("readonly");
    $( "#from" ).datepicker( "option", { disabled: false });
    $( "#to" ).datepicker( "option", { disabled: false });

}


function openDashboard(button) {
    parent.revisionInterCommentButton = button;
    parent.openDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS,true);
}

function setLastInternalComment() {
    var commentArray = getInternalComment();
    if (commentArray.length>0) {
        $('#internalcommentId').attr('value', "New/Edit("+commentArray.length+")");
        var commentObject = commentArray[commentArray.length-1];
        $('#internalComment').val(commentObject["commentDesc"]);
    } else {
        $('#internalcommentId').attr('value', "New/Edit(0)");
        $('#internalComment').val("");
    }
}

function getRevisionComment() {
    if(parent.currentSelectedRouteComment != undefined ){
        var commentList = getCommnentData(parent.currentSelectedRouteComment.COMMENTS);
        if (commentList != null) {
            revisionList = $.grep(commentList, function(obj) {
                return (obj["commentTypeCd"].type == 1);
            });
            originalRevisionList = revisionList;
            revisionList.sort(function(x, y){
                return x.createTmstp - y.createTmstp;
            });

        }
    }
}
function getCommnentData(comments) {
    if (comments != "" && comments != null) {
        return $.parseJSON(comments);
    } else {
        return null;
    }
}
function setRevisionComment() {
    if (revisionList != undefined && revisionList.length>0) {
        var revisionObject = revisionList[revisionList.length-1];
        if (revisionObject['EDITABLE'] == true || (revisionObject["operationCd"] != undefined && revisionObject["operationCd"] != null
            && revisionObject["operationCd"].type != undefined && revisionObject["operationCd"].type == 1)) {
            revisionObject.origRouteDesc = getOriginalRouteInformation();
            revisionObject.RouteDesc = getModifiedRouteinformation(false);
            setUIData(revisionObject,true);
        } else  {
            var randomNumber  = getRandomNumber();
            var emptyCommentObject = getCommentEmptyObject(getRouteId(),randomNumber);
            revisionList.splice(revisionList.length, 0, emptyCommentObject);
            emptyCommentObject.origRouteDesc = getOriginalRouteInformation();
            emptyCommentObject.RouteDesc = getModifiedRouteinformation(false);
            setUIData(emptyCommentObject,true);
        }
    } else {
        revisionList =[];
        var randomNumber  = getRandomNumber();
        var emptyCommentObject = getCommentEmptyObject(getRouteId(),randomNumber);
        revisionList.splice(revisionList.length, 0, emptyCommentObject);
        emptyCommentObject.origRouteDesc = getOriginalRouteInformation();
        emptyCommentObject.RouteDesc = getModifiedRouteinformation(false);
        setUIData(emptyCommentObject,true);
    }
    removeReadOnly();
    setButtonStatus(revisionList);
}

function setButtonStatus(revisionList) {
    if (revisionList != null && revisionList.length >0) {
        if (revisionList.length==1) {
            $('#Previous').attr("disabled","disabled");
            $('#Next').attr("disabled","disabled");
            $('#Edit').attr("disabled","disabled");
        } else {
            $('#Previous').removeAttr("disabled");
            $('#Next').attr("disabled","disabled");
            $('#Edit').attr("disabled","disabled");
        }
    }
}

function getCommnentData(comments) {
    if (comments != "" && comments != null) {
        return $.parseJSON(comments);
    } else {
        return null;
    }
}

function getUpperCaseValue(textId){
	var textIdVal = $('#'+textId).val();
    if(textIdVal != undefined && textIdVal != ""){
    	return textIdVal.toUpperCase();
    }else{
    	return "";
    }
}

function setCurrentObject(revisionObject,isNew,isPrevious)  {
    var routeId = revisionObject["routeId"];
    var revisionComment = getUpperCaseValue("revisionComment");
    var routeDetailComment = getUpperCaseValue('routeDetailComment');
    var routeDetailCommentCurrent;// = $('#routeDetailCommentCurrent').val();

    if (routeDetailComment !=null && routeDetailComment !="") {
        if(routeDetailCommentCurrent != undefined && routeDetailCommentCurrent != ""){
            revisionObject["commentDesc"] = routeDetailComment + "&" +routeDetailCommentCurrent +  "<0x03>" + revisionComment;
        }else {
            revisionObject["commentDesc"] =  routeDetailComment +  ((revisionComment != undefined && revisionComment != "") ? "<0x03>" + revisionComment: "" );
        }
    } else {
        revisionObject["commentDesc"] = revisionComment;
    }

    revisionObject["reasonDesc"] = getUpperCaseValue('reasonCode');

    var originRoutDesc= $('#changedFrom').text();
    var routeDesc =  $('#RouteDesc').text();
    revisionObject["origRouteDesc"] = routeDesc +FIELD_SEPARATOR +  originRoutDesc;

    if (isNew == undefined && typeof isNew != "boolean") {
        revisionObject["createUserNm"] = $('#createdBy').text();
        revisionObject["createTmstp"] = Date.parse($('#creationdate').text());
    }
    revisionObject["reqByDesc"] = getUpperCaseValue('requestedBy');

    var from = $('#from').val();
    var to = $('#to').val();
    if (from != null && from != "") {
        if (to == null || to =="") {
            to ="00/00/0000";
        }
        revisionObject["effectiveDateDesc"] = from + " to " + to;
    }

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
function performAdd() {
    var routeCommentID =  $("#routeCommentId").val();
    if (revisionList != undefined && revisionList.length>0) {
        for (var i =0; i < revisionList.length;i++) {
            if (revisionList[i]["routeCommentId"] == routeCommentID) {
                setCurrentObject(revisionList[i],undefined,undefined);
            }
        }
    }
    var randomNumber  = getRandomNumber();
    var emptyCommentObject = getCommentEmptyObject(getRouteId(),randomNumber);
    var lastRevisionComment = revisionList[revisionList.length-1];
    var originalRouteDec = lastRevisionComment["origRouteDesc"] ;
    revisionList.splice(revisionList.length, 0, emptyCommentObject);
    emptyCommentObject.origRouteDesc = originalRouteDec.split(FIELD_SEPARATOR)[0];
    emptyCommentObject.RouteDesc = getModifiedRouteinformation(false);

    setUIData(emptyCommentObject,true);
    $('#Previous').removeAttr("disabled");
    $('#Next').attr("disabled","disabled");
    $('#Edit').attr("disabled","disabled");
    removeReadOnly();
}

function next() {
    var routeCommentID =  $("#routeCommentId").val();
    intializeReadOnly();
    if (revisionList != undefined && revisionList.length>0) {
        for (var i =0; i < revisionList.length;i++) {
            if (revisionList[i]["routeCommentId"] == routeCommentID) {
                if (i <revisionList.length && i!=(revisionList.length-1) ) {
                    setCurrentObject(revisionList[i],undefined,undefined);
                    if ((i+1) == (revisionList.length-1)) {
                        $('#Next').attr("disabled","disabled");
                        $('#Edit').attr("disabled","disabled");
                        $('#Previous').removeAttr("disabled");
                        setUIData(revisionList[i+1]);
                        removeReadOnly();
                    } else {
                        $('#Next').removeAttr("disabled");
                        $('#Edit').removeAttr("disabled");
                        $('#Previous').removeAttr("disabled");
                        setUIData(revisionList[i+1]);
                    }
                    break;
                } else if(i==(revisionList.length-1)){
                    $('#Next').attr("disabled","disabled");
                    $('#Edit').attr("disabled","disabled");
                    $('#Previous').removeAttr("disabled");
                }
            }
        }
    }
    setLastInternalComment();
}
function getOriginalRouteInformation() {
    if (parent.selectedDetails != undefined) {
        if (parent.selectedDetails.from ==parent.OPERATION_FROM_MATRIX) {
            var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var routeData = routeGrid.dataItem(currentTR);
            if (parent.selectedDetails.dashboardID == parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR) {
                return getOriginalRouteInfoForRE(routeData);
            } else {
                return getOriginalRouteInfoForWIP(routeData);
            }
        }else {
            if (parent.selectedDetails.changedRouteData[0].OPERATION_CD != parent.OPERATION_CD_ADD) {
                return getRouteInformation(parent.selectedDetails.staticRouteData[0],parent.selectedDetails.staticLegData);
            }else  if (parent.selectedDetails.changedRouteData[0].OPERATION_CD == parent.OPERATION_CD_ADD) {
                parent.selectedDetails.staticRouteData = parent.selectedDetails.changedRouteData;
                parent.selectedDetails.staticLegData = parent.selectedDetails.changedLegData;
                return "";
            }
        }
    }
    return "";
}

function getOriginalRouteInfoForRE(routeData) {
    if (parent.initialRouteList != null && parent.initialRouteList.length > 0) {
        routerow = $.grep(parent.initialRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        legRows = $.grep(parent.initialLegList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        if (routerow != null && routerow.length > 0 && legRows != null && legRows.length >0) {
            return getRouteInformation(routerow[0],legRows);
        }
    }
    if (parent.selectedRouteList != null && parent.selectedRouteList.length > 0) {
        routerow = $.grep(parent.selectedRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        legRows = $.grep(parent.selectedLegList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        return getRouteInformation(routerow[0],legRows);
    }
}

function getOriginalRouteInfoForWIP(routeData) {
    if (parent.initialWIPRouteList != null && parent.initialWIPRouteList.length > 0) {
        routerow = $.grep(parent.initialWIPRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        legRows = $.grep(parent.initialWIPLegList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        if (routerow != null && routerow.length > 0 && legRows != null && legRows.length >0) {
            return getRouteInformation(routerow[0],legRows);
        }
    }
    if (parent.selectedWIPRouteList != null && parent.selectedWIPRouteList.length > 0) {
        routerow = $.grep(parent.selectedWIPRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        legRows = $.grep(parent.selectedWIPLegList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        if (routerow[0]["OPERATION_CD"] == parent.OPERATION_CD_ADD) {
            return "";
        } else {
            return getRouteInformation(routerow[0],legRows);
        }
    }
}

function getSelectedRouteInfoForWIP(routeData){
    var routerow;
    if (parent.initialWIPRouteList != null && parent.initialWIPRouteList.length > 0) {
        routerow = $.grep(parent.selectedWIPRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        return routerow;
    }
}

function getInitialRouteInfoForWIP(routeData){
    var routerow;
    if (parent.initialWIPRouteList != null && parent.initialWIPRouteList.length > 0) {
        routerow = $.grep(parent.initialWIPRouteList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        return routerow;
    }
}

function getInitialRouteLegInfoForWIP(routeData){
    var legRows;
    if (parent.initialWIPRouteList != null && parent.initialWIPRouteList.length > 0) {
        legRows = $.grep(parent.initialWIPLegList, function(obj) {
            return (obj["ROUTE_ID"] == routeData["ROUTE_ID"]);
        });
        return legRows;
    }
}

function getModifiedRouteinformation(isCommentDesc,revisionObject) {
    if (parent.selectedDetails != undefined) {
        if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX) {
            var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var routeData = routeGrid.dataItem(currentTR);
            var legGrid = $(parent.selectedDetails.selectedCheckBox).closest("tr").next().find("div.k-legs-grid");

            var legRows;
            if (legGrid != null && legGrid.length >0) {
                legRows = dashboard.$(legGrid).data("kendoGrid").dataSource.data().toJSON();
            } else {
                legRows = $.grep(parent.selectedWIPLegList, function(item) {
                    return item.ROUTE_ID == routeData.ROUTE_ID;
                });
            }
            if (isCommentDesc) {
                setRouteDetailsComment(revisionObject,routeData, legRows);
            } else {
                return getRouteInformation(routeData,legRows);
            }
        }else if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX_SAVE) {
            if (isCommentDesc) {
                var routeData;
                var legRows;
                if(parent.selectedDetails.staticRouteData == undefined && parent.selectedDetails.changedRouteData != undefined && parent.selectedDetails.changedRouteData[0]["CHANGE_FLAG"] == parent.OPERATION_CD_ADD){
                    routeData = parent.selectedDetails.changedRouteData[0];
                    legRows = parent.selectedDetails.changedLegData;
                }else{
                    routeData = parent.selectedDetails.staticRouteData[0];
                    legRows = parent.selectedDetails.staticLegData;
                }
                setRouteDetailsComment(revisionObject,routeData, legRows);
            } else {
                var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
                var routeGrid = dashboard.$("#legsGrid_"+parent.selectedDetails.staticRouteData[0]['ROUTE_ID']).data("kendoGrid");
                var legrows = $.grep(routeGrid.dataSource.data(), function(item) {
                    return item.ROUTE_ID == parent.selectedDetails.staticRouteData[0]['ROUTE_ID'];
                });
                return getRouteInformation(parent.selectedDetails.staticRouteData[0],legrows);
            }
        }else {
            if (isCommentDesc) {
                var routeData;
                var legRows;
                if(parent.selectedDetails.staticRouteData == undefined && parent.selectedDetails.changedRouteData != undefined && parent.selectedDetails.changedRouteData[0]["CHANGE_FLAG"] == parent.OPERATION_CD_ADD){
                    routeData = parent.selectedDetails.changedRouteData[0];
                    legRows = parent.selectedDetails.changedLegData;
                }else{
                    routeData = parent.selectedDetails.staticRouteData[0];
                    legRows = parent.selectedDetails.staticLegData;
                }
                setRouteDetailsComment(revisionObject,routeData, legRows);
            } else {
            	return getRouteInformation(parent.selectedDetails.changedRouteData[0],parent.selectedDetails.changedLegData);
           }
        }
    }
}
function setRouteDetailsComment(revisionObject,routeData, legRows) {
    if(revisionObject != undefined && revisionObject.commentDesc != EMPTY_STRING){
        var revisionCommentInfo = revisionObject["commentDesc"].split("<0x03>");
        if (revisionCommentInfo.length > 0)
            $('#routeDetailComment').val(parseString(revisionCommentInfo[0]));
    }else if (routeData != undefined && routeData["EQUIP_TYPE"] !=null) {
        selectedequipType = routeData["EQUIP_TYPE"];
        getEquipDesc(routeData);
        equipDesCounter = setInterval(function() { ///then after repeated interval checking....
            if(parent.SkdGridHelper.getSkdGridManager().getNotNullStr(selectedEquipDesc)){
                if (equipDesCounter) {
                    window.clearInterval(equipDesCounter);
                    equipDesCounter = undefined;
                }
                if(getInitialRouteInfoForWIP(routeData) && getInitialRouteInfoForWIP(routeData).length >0){
                    $('#routeDetailComment').val(getRouteDetailsComment(getInitialRouteInfoForWIP(routeData)[0], getInitialRouteLegInfoForWIP(routeData)));
                }else {
                    $('#routeDetailComment').val(getRouteDetailsComment(routeData, legRows));
                }
            }
        }, 1500);
    }
}
function getRouteDetailsComment(routeData, legRows) {
    var finalString = "";
    if (routeData != undefined && routeData["MV_NUM"] !=null) {
        finalString = finalString + routeData["MV_NUM"] +" ";
    }
    if (legRows!= undefined && legRows.length >0) {
        for (var i =0; i <legRows.length;i++) {
            var firstLeg = legRows[i];
            var firstLegOrigin = firstLeg["ORIGIN"];
            if (firstLegOrigin != null)  {
                finalString= finalString + firstLegOrigin + COMMENT_SEPERATOR;
            }
            var firstLegDestination = firstLeg["DESTINATION"];
            if (i == (legRows.length-1)) {
                finalString =  finalString + firstLegDestination + " ";
            }
        }
    }
    if (routeData["EQUIP_TYPE"] !=null && parent.SkdGridHelper.getSkdGridManager().getNotNullStr(selectedEquipMap[routeData["EQUIP_TYPE"]])) { //selectedEquipDesc
        finalString = finalString + selectedEquipMap[routeData["EQUIP_TYPE"]] ; //selectedEquipDesc
    }
    finalString = parent.SkdGridHelper.getSkdGridManager().getFormattedData(routeData,finalString);
    //console.log(finalString);
    return finalString;
}

function getEquipDesc(routeData){
    selectedEquipDesc = EMPTY_STRING;
    selectedEquipMap[routeData["EQUIP_TYPE"]] = EMPTY_STRING;
    if(routeData != undefined){
        parent.SkdMxServiceHelper.getValidationServiceManager().callValidationService("EquipTypeRequest", parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.MODE),
            parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.CAPACITY_CD), parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.CARRIER_TYPE), parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.ROUTE_TYPE_CD),
            parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.EQUIP_TYPE), parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.LEG_TYPE), parent.SkdGridHelper.getSkdGridManager().getNotNullStr(routeData.ROUTE_CONTEXT_CD), equipTypeCallBack);
    }
}

function equipTypeCallBack(response, io){
    if(response && response._errorCd && response._errorCd > 0) {
        showErrorMsg(response._errorDesc);
    } else {
        var typeObj = $.grep(response, function(e) {
            return e["equipTypeCd"] == selectedequipType;
        });
        if(typeObj[0] != undefined){
	        selectedEquipDesc = typeObj[0]["equipTypeDesc"];
	        selectedEquipMap[typeObj[0]["equipTypeCd"]] = typeObj[0]["equipTypeDesc"];
        }
    }
    parent.showProgressDialog(false);
}

function getRouteInformation (routeData, legRows) {
    var finalString = EMPTY_STRING;
    if (routeData != undefined && routeData["MV_NUM"] !=null) {
        finalString = finalString + routeData["MV_NUM"] +" ";
    }
    var legTracker = [];
    if (legRows != undefined &&  legRows.length >0) {
        for (var i =0; i <legRows.length;i++) {
            var firstLeg = legRows[i];

            if(legTracker.indexOf(firstLeg["ROUTE_ID"]) >= 0){
                continue;
            }
            legTracker.push(firstLeg["ROUTE_ID"]);

            //var lastLeg = legRows[legRows.length-1];
            //	var mvno= routeData["MV_NUM"];
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
            //var firstLegDepTime = firstLeg["LOCAL_DEP"];
            //var fisrstLegOrigin = firstLeg["ORIGIN"];
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
                finalString =  finalString.trim()+ (legTracker.length>1? ",":"") ;
            }
        }

        legTracker = undefined;
    }

    return finalString;
}


function previous () {
    removeReadOnly();
    var routeCommentID =  $("#routeCommentId").val();
    if (revisionList != undefined && revisionList.length>0) {
        for (var i =0; i < revisionList.length;i++) {
            if (revisionList[i]["routeCommentId"] == routeCommentID) {
                if (i>1) {
                    setCurrentObject(revisionList[i],undefined,true);
                    setUIData(revisionList[i-1]);
                    $('#Previous').removeAttr("disabled");
                    $('#Next').removeAttr("disabled");
                    $('#Edit').removeAttr("disabled");
                    intializeReadOnly();
//					 $('#routeDetailCommentCurrent').hide();
                    break;
                } else {
                    setCurrentObject(revisionList[i],undefined,true);
                    setUIData(revisionList[i-1]);
                    $('#Previous').attr("disabled","disabled");
                    $('#Next').removeAttr("disabled");
                    $('#Edit').removeAttr("disabled");
                    intializeReadOnly();
//					 $('#routeDetailCommentCurrent').hide();
                }
            }
        }
    }
    setLastInternalComment();
}

function performCancel() {
    $("#revisionDialog").data("kendoWindow").center().open();
}

function returnToRevision() {
    $("#revisionDialog").data("kendoWindow").close();
}

function discardRevision() {
    revisionList = originalRevisionList;
    if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS) != undefined) {
        parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS);
        if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX) {
            var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
            currentTR.find(".k-revision-comment")[0].checked=false;
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var routeData = routeGrid.dataItem(currentTR);
            routeData.DISCARDREVISION = true;
            refreshhRouteEditorDashBoard();
        } if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX_SAVE) {
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var routeDataArr = $.grep(routeGrid.dataSource.data(), function(item) {
                return item.ROUTE_ID == parent.selectedDetails.staticRouteData[0]['ROUTE_ID'];
            });
            parent.updateRevisionsCounter(parent.selectedDetails.staticRouteData[0]['ROUTE_ID'])//parent.revisionsAdded++;
            var routeData = routeDataArr[0].DISCARDREVISION = true;
            refreshhRouteEditorDashBoard();
            dashboard.saveToSchedule();
        }else {
            timeReference = parent.getDashboardContentWindow('mapViewDiv').isLocalFlag ? "Local" : "Zulu";
            if (parent.selectedDetails.changedRouteData[0].OPERATION_CD == parent.OPERATION_CD_DELETE) {
                parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(
                    parent.selectedDetails.changedRouteData, parent.selectedDetails.changedLegData, timeReference,
                    parent.dashboardController.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).onDeleteSaveUpdateServiceSuccessDrawer);
            } else {
                parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(
                    parent.selectedDetails.changedRouteData, parent.selectedDetails.changedLegData, timeReference, function(response, io) {
                        parent.dashboardController.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).SkdMxHelper
                            .getSkdMxGridComponentManager().onSaveServiceSuccess(response, io, parent.selectedDetails.changedRouteData[0].ROUTE_ID);
                    });
            }
        }
    }
}

function setEmptyData(randomId) {
    $("#routeCommentId").val(randomId);
    $("#revisionComment").val("");
    $('#reasonCode').val("");
    $('#createdBy').val(parent.loginUserId);
    $('#creationdate').val(getDateTimeForamt(new Date()));
    $('#requestedBy').val("");
    $('#crewNotifiedDesc').val("");
}

function setUIData(revisionObject ,isNew) {
    $("#routeCommentId").val(revisionObject["routeCommentId"]);
    if (isNew) {
        $("#RouteDesc").text(revisionObject["RouteDesc"]);
        $('#changedFrom').text(revisionObject["origRouteDesc"]);
    } else {
        var originalRouteDesc = revisionObject["origRouteDesc"];
        if (originalRouteDesc != undefined && originalRouteDesc != null) {
            var routeinfos = originalRouteDesc.split(FIELD_SEPARATOR);
            if (routeinfos!= null && routeinfos.length==2){
                $("#RouteDesc").text(routeinfos[0]);
                $('#changedFrom').text(routeinfos[1]);
            } else{
                $('#changedFrom').text(originalRouteDesc);
            }
        }

    }
    if (isNew) {
        getModifiedRouteinformation(true,revisionObject)
        $("#revisionComment").val("");
        var revisionCommentInfo = revisionObject["commentDesc"].split("<0x03>");
        if (revisionCommentInfo.length==2) {
            $("#revisionComment").val(revisionCommentInfo[1]);
        }

    } else if (revisionObject["operationCd"].type == 1) {
        var revisionCommentInfo = revisionObject["commentDesc"].split("<0x03>");
        getModifiedRouteinformation(true,revisionObject);
        $("#revisionComment").val(parseString(revisionCommentInfo[1]));
    } else {
        $('#routeDetailComment').val("");
        var revisionCommentInfo = revisionObject["commentDesc"].split("<0x03>");
        $('#routeDetailComment').val(revisionCommentInfo[0]);
        $("#revisionComment").val(parseString(revisionCommentInfo[1]));
    }

    $('#reasonCode').val(revisionObject["reasonDesc"]);
    if(parent.currentSelectedRouteComment != undefined)
        setRevisionDateRange(parent.currentSelectedRouteComment);
    $('#createdBy').text(revisionObject["createUserNm"]);
    if (typeof revisionObject["createTmstp"] == "number") {
        var date =  getDateTimeForamt(new Date(revisionObject["createTmstp"]));
        $('#creationdate').text(date);
    } else {
        $('#creationdate').text(revisionObject["createTmstp"]);
    }

    $('#requestedBy').val(revisionObject["reqByDesc"]);
    if (revisionObject["effectiveDateDesc"]  != undefined && revisionObject["effectiveDateDesc"] != null && revisionObject["effectiveDateDesc"] != "") {
        var effdateDesc = revisionObject["effectiveDateDesc"].split(" to ");
        if (effdateDesc.length == 2) {
            $('#from').val(effdateDesc[0]);
            if (effdateDesc[1] == "00/00/0000") {
                $('#to').val("");
                $('#throughCombo').val("beyond");
            } else {
                $('#to').val(effdateDesc[1]);
                $('#throughCombo').val("through");
            }
        } else {
            $('#from').val(revisionObject["effectiveDateDesc"]);
            $('#to').val(revisionObject["effectiveDateDesc"]);
        }
    } else {
        $('#throughCombo').val("through");
    }
}



function getCommentEmptyObject(routeID,randomNumber) {
    return {
        "valid":true,
        "routeId":routeID,
        "ocaNbr":"0",
        "operationCd":{"type":1},
        "commentDesc":EMPTY_STRING,
        "commentTypeCd":{"type":1},
        "createUserNm":parent.loginUserId,
        "createTmstp":getDateTimeForamt(),
        "crewNotifiedDesc":null,
        "effectiveDateDesc":EMPTY_STRING,
        "origRouteDesc":EMPTY_STRING,
        "reasonDesc":EMPTY_STRING,
        "reqByDesc":EMPTY_STRING,
        "routeCommentId":randomNumber,
        "RouteDesc":EMPTY_STRING,
        "EDITABLE":true
    };
}

function performSave() {
    var routeCommentID =  $("#routeCommentId").val();
    if (revisionList != undefined && revisionList.length>0) {
        for (var i =0; i < revisionList.length;i++) {
            if (revisionList[i]["routeCommentId"] == routeCommentID) {
                setCurrentObject(revisionList[i],undefined,undefined);
            }
        }
    }
    if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS) != undefined) {
        parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS);
        if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX) {
            var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var routeData = routeGrid.dataItem(currentTR);
            parent.updateRevisionsCounter(routeData['ROUTE_ID']);
            setRevisionDataToRouteObject(routeData);
            refreshhRouteEditorDashBoard();
            if(revisionList != undefined && revisionList.length>=0) {
                $(parent.selectedDetails.selectedCheckBox).attr('value',"New/Edit("+revisionList.length+")");
            }
        } else if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX_SAVE) {
            parent.updateRevisionsCounter(parent.selectedDetails.staticRouteData[0]['ROUTE_ID'])
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            var ds = routeGrid.dataSource.data();
            if (ds != undefined && ds.length > 0) {
                for (var i =0; i < ds.length;i++) {
                    if (ds[i]["ROUTE_ID"] == parent.selectedDetails.staticRouteData[0]['ROUTE_ID']) {
                        //setRevisionDataToRouteObject(ds[i]);
                        setRevisionDataToRouteObject(ds[i], parent.selectedDetails.changedRouteData[0]);
                    }
                }
            }
            refreshhRouteEditorDashBoard();
            dashboard.saveToSchedule();

        }else {
            setRevisionDataToRouteObject(parent.selectedDetails.changedRouteData[0]);
            timeReference = parent.getDashboardContentWindow('mapViewDiv').isLocalFlag ? "Local" : "Zulu";
            if (parent.selectedDetails.changedRouteData[0].OPERATION_CD == parent.OPERATION_CD_DELETE) {
                parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(
                    parent.selectedDetails.changedRouteData, parent.selectedDetails.changedLegData, timeReference,
                    parent.dashboardController.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).onDeleteSaveUpdateServiceSuccessDrawer);
            } else {
                parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(
                    parent.selectedDetails.changedRouteData, parent.selectedDetails.changedLegData, timeReference, function(response, io) {
                        parent.dashboardController.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).SkdMxHelper
                            .getSkdMxGridComponentManager().onSaveServiceSuccess(response, io, parent.selectedDetails.changedRouteData[0].ROUTE_ID);
                    });
            }
        }


    }
}

function setRevisionDataToRouteObject(routeData, changedRouteData) {
    var commentData;
    if(changedRouteData != undefined){
        commentData =getCommnentData(changedRouteData.COMMENTS);
    }else {
        commentData =getCommnentData(routeData.COMMENTS);
    }

    var commentList =[];
    if (commentData != null && commentData.length>0) {
        commentList = $.grep(commentData, function(obj) {
            return (obj["commentTypeCd"].type == 0);
        });
    }
    $.merge(commentList,revisionList);
    routeData.COMMENTS = JSON.stringify(commentList, replacer);
}


function performEdit() {
    removeReadOnly(true);
}

function getInternalComment() {
    var routeData;
    var commentList =[];
    if(parent.selectedDetails != undefined){
        if (parent.selectedDetails.from == parent.OPERATION_FROM_MATRIX) {
            var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
            var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
            var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
            routeData = routeGrid.dataItem(currentTR);
        } else {
            routeData= parent.selectedDetails.changedRouteData[0];
        }
        var commentData =getCommnentData(routeData.COMMENTS);

        if (commentData != null && commentData.length>0) {
            commentList = $.grep(commentData, function(obj) {
                return (obj["commentTypeCd"].type == 0);
            });
            commentList.sort(function(x, y){
                return x.createTmstp - y.createTmstp;
            });
        }
    }
    return commentList;
}

function setRevisionDateRange(routData) {
//    var oneDay = 24*60*60*1000;
    //if(currentCase == undefined) {
    var currentCase = parent.getSelectedCase();
    //}
    var planStartDate, planEndDate;//, planPerDayQty;
    if(currentCase){
        planStartDate = currentCase.planPerStartDtml;
        planEndDate = currentCase.planPerEndDtml;
//        planPerDayQty = currentCase.planPerDayQty;
    }
    /*var selectableDaysStr = "0-" + planPerDayQty;
    startDate = new Date(parent.changeCaseDateFormat(planStartDate));
    startDate = new Date(startDate.getTime() - oneDay);
    endDate = new Date(parent.changeCaseDateFormat(planEndDate));
    totalDays = parent.getTotalDays(startDate, endDate);
    var totalFullWeeks = Math.floor(totalDays/7);
    endDate = new Date(startDate.getTime() + (7 * (totalFullWeeks + 2) + 1) * oneDay);
    totalDays = parent.getTotalDays(startDate, endDate);
    selectedDaysStr = parent.SkdGridHelper.getSkdGridManager().parseFullEffDayNoHolidayStr(routData.ROUTE_FULL_EFFDT_L);
    var selectedDaysArray = parent.getDaysArray(selectedDaysStr, null);
    var selectableDaysArray = parent.getDaysArray(selectableDaysStr, null);
    var selectedHolDaysArray = parent.getHolidayDayssArray(selectedDaysStr, routData.ROUTE_HOL_DAYS_L);

    var firstDay = startDate.getDay();
    var datesArr = [];
    var i, tempDate;
    var dayCount = 0;
    if(firstDay == 0){
        firstDay = 7;
    }
    for(i=0; i<totalDays;i++) {
        dayCount++;
        tempDate = new Date(startDate.getTime() + oneDay*i);
        var isDisable = false;
        if(selectableDaysArray && !($.inArray(i, selectableDaysArray) > -1)){
            isDisable = true;
        }
        datesArr.push({datedatesArr:tempDate, selected:false, disabled:isDisable, planDay:i, week:Math.ceil(dayCount/7)});
    }
    var fistLegEffeiveDays = $.grep(datesArr, function(obj) {
        return (obj["planDay"] == selectedDaysArray[0]);
    });*/
    var firstEffictDate = getFormattedDate(new Date(parent.changeCaseDateFormat(planStartDate)));
    /*var lastLegEffeiveDays = $.grep(datesArr, function(obj) {
        return (obj["planDay"] == selectedDaysArray[selectedDaysArray.length-1]);
    });*/
    var lastEffectDate = getFormattedDate(new Date(parent.changeCaseDateFormat(planEndDate)));
    $('#from').val(firstEffictDate);
    $('#to').val(lastEffectDate);
}

function getFormattedDate(date) {
    var month = (date.getMonth()+1) > 9 ? (date.getMonth()) : "0" + (date.getMonth()+1);
    var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
    var dateString =
        month + "/" +
        day + "/" +
        date.getFullYear() ;
    return dateString;

}

function onchangeThroughCombo(){
    if ($('#throughCombo').val() == "beyond") {
        $('#to').val("");
    }
}