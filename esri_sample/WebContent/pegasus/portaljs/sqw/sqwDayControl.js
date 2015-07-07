/**
 * @author 927456 Honey Bansal
 * This script belongs each dashboard to show day control 
 * Included in all dashboards
 */
//miili seconds in one day
var oneDay = 24 * 60 * 60 * 1000;
//dummy start date
var startDate = new Date(2013, 4, 1);
//dummy end date
var endDate = new Date(2013, 4, 31);
//list of all month names
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//list of all day names
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//flag to make calendar single day selection
var isSingleDaySelection = true;
//plan and month selected cell
var selectedCell, mSelectedCell;
//list of selected cells
var selectedDays;
//last clicked cell
var lastClickedCalBtn;
//source object for parent reference 
var keyObject;
//flag to disable zero in local time view
var isDisableZero = false;
//total days in plan set
var totalDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (oneDay))) + 1;
// for initialization /re-initialization of the current view - selected days string
var initSelectedDaysStr;
//for initialization /re-initialization of the current view - disable unselected flag
var initDisableUnselected;
//for initialization /re-initialization of the current view - plan start date
var initPlanStartDate;
//for initialization /re-initialization of the current view - plan end date
var initPlanEndDate;
//for initialization /re-initialization of the current view - selectable days string
var initSelectableDaysStr;
//for initialization /re-initialization of the current view - non operator days
var initNoOpDays;
//for initialization /re-initialization of the current view - holidays string
var initHolDays;
//for initialization /re-initialization of the current view - lane status
var initLaneStatus;

/** initialize the layout and other components
 */
$(document).ready(function() {
    hideCalenderDivs();
});

/**
 * to hide the inner divs in while initializing the application
 */
function hideCalenderDivs() {
    $("#calenderDiv").hide();
	$("#calBtnBar").hide();
}

//callback handler
var daySelectionCallbackHandler;

/**
 * To create and show the day control
 * @param isSingleDaySelection - to make the calendar single day selection
 * @param selectedDaysStr - to select the days by default string format (1-20,25) or (-TW---- 123--)
 * @param calBtn - current button clicked for opening the calendar
 * @param isDisableUnselected - to disable the days except days in selectableDaysStr
 * @param keyObj - 
 * @param draggable - to make the calendar draggable and open it in center
 * @param selectableDaysStr - to make these days only selectable
 * @param currentCase - current selected plan
 * @param noOpDays - non operator days list
 * @param disableZero - flag to disable zero for local time view
 * @param holDays - holidays list
 * @param laneStatus - lane status string
 * @param selectionCallback - call back handler on successful day selection
 */
function showDayControl(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, keyObj, draggable, selectableDaysStr, currentCase, noOpDays, disableZero, holDays, laneStatus, selectionCallback) {
    try {
        var calDiv = $('#calenderDiv');
        isDisableZero = disableZero;
        document.getElementById("calSelectAllBtn").disabled = false;
        document.getElementById("calClearBtn").disabled = false;
        if (!calBtn.isOpenState) {
            createAndOpenWindow(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus);
            calBtn.isOpenState = true;
            if (lastClickedCalBtn && lastClickedCalBtn != calBtn) {
                lastClickedCalBtn.isOpenState = false;
            }
        }
        lastClickedCalBtn = calBtn;
        keyObject = keyObj;
        var enabledDays = getEnabledDays();
        if (enabledDays.length == 0) {
            document.getElementById("calSelectAllBtn").disabled = true;
            document.getElementById("calClearBtn").disabled = true;
        }
        daySelectionCallbackHandler = selectionCallback;
        calDiv.parent().find('.k-window-titlebar')[0].onclick = function(event) {
			$( "#calendarInputText" ).focus();
		};
		$( "#calendarInputText").focus();
		calDiv.parent().find('#calendarInputText').focusout(function(event) {
			if(lastClickedCalBtn.isOpenState && event.relatedTarget == null) {
				setDayAndCloseWindow();
			}
		});
        calDiv.focusout(function(event) {
        	if(lastClickedCalBtn.isOpenState && !(event.relatedTarget && event.relatedTarget.id == "calendarInputText")) {
				var node = event.relatedTarget;
				var flag = false;
				while(node){
					if(node.id == "calenderDiv"){
						flag = true;
						break;
					}
					node = node.parentNode;
				}
				if(!flag) {
		        	setDayAndCloseWindow();
				}
			}
		});
    } catch (e) {
        alert("Error occured in the day control");
    }
}

/**
 * Clears/resets the calendar input box and the day selections made by the user.
 */
function clearCalInputText() {
	$( "#calendarInputText" ).val("");
	clearAllDaySelections();
}

/**
 * To close the day control and set the selected days
 */
function setDayAndCloseWindow() {
    try {
        var txtValue = document.getElementById("calendarInputText").value;
        respDays = "";
        respDates = "";
        if (txtValue && validateEnteredDays(txtValue)) {
            txtValue = txtValue.replaceAll(" ", ",");
            var selectedPlanDays = getDaysArray(txtValue);
            selectedPlanDays.sort(function(a, b) {
                return a - b;
            });
            var enabledDays = getEnabledDays();
            var selectedDates = [];
            for (var i = 0; i < enabledDays.length; i++) {
                if ($.inArray(enabledDays[i].planDay, selectedPlanDays) > -1) {
                    selectedDates.push(enabledDays[i].date);
                }
            }
            var selectedPlanDaysStr = getRanges(selectedPlanDays);
            respDays = 'Plan day';
            if (selectedPlanDays.length > 1) {
                respDays = respDays + 's';
            }
            respDays = respDays + ' ' + selectedPlanDaysStr;
            if (isDisableZero) {
                respDays = respDays + ' (local)';
            } else {
                respDays = respDays + ' (zulu)';
            }
            respDates = getSelectedDatesStr(selectedDates);

            var responseObj = {
                selectedDays: respDays,
                dateString: respDates,
                selectedPlanDays: selectedPlanDaysStr != undefined ? selectedPlanDaysStr.toString() : ""
            };
            if (daySelectionCallbackHandler != undefined) {
                daySelectionCallbackHandler(lastClickedCalBtn, responseObj, keyObject);
            }
            $('#calenderDiv').data("kendoWindow").close();
            lastClickedCalBtn.isOpenState = false;
        } else {
            var responseObj = {
                selectedDays: "",
                dateString: "",
                selectedPlanDays: ""
            };
            if (daySelectionCallbackHandler != undefined) {
                daySelectionCallbackHandler(lastClickedCalBtn, responseObj, keyObject);
            }
            $('#calenderDiv').data("kendoWindow").close();
            lastClickedCalBtn.isOpenState = false;
        }
    } catch (e) {
        $('#calenderDiv').data("kendoWindow").close();
        lastClickedCalBtn.isOpenState = false;
    }
}

/**
 * validates the plan days entered in the input box including the pattern check.
 */
function validateInputPlanDays(event) {
	closeHeaderMsgWin();
    var isValid = true;
    var txtValue = $(event.currentTarget).val();
    if (txtValue != EMPTY_STRING) {
		if (isSingleDaySelection) {
			isValid = validateSingleDayExp(txtValue);
		} else {
			isValid = validateMultipleDayExp(txtValue);
		}
        if (isValid) {
            isValid = validateEnteredDays(txtValue);
        }
        if (!isValid) {
        	showErrorMsg(NOT_ENOUGH_DAYS_IN_PLAN_ERROR);
            $(event.currentTarget)[0].value = txtValue.substring(0, txtValue.length - 1);
        } else if (event.keyCode == 13) {
            setDayAndCloseWindow();
        }
    }
    return isValid;
}

/**
 * validates the plan days entered in the input box
 */
function validateEnteredDays(txtValue) {
    var enabledDays = getEnabledDays();
    var enabledPlanDays = [];
    if (enabledDays) {
        for (var i = 0; i < enabledDays.length; i++) {
            enabledPlanDays.push(enabledDays[i].planDay);
        }
        if (txtValue) {
            txtValue = txtValue.replaceAll(" ", ",");
        }
        var textEntries = [];
        if (txtValue.indexOf(COMMA_STRING) >= 0) {
            textEntries = (txtValue.split(COMMA_STRING));
        } else {
            textEntries.push(txtValue);
        }
        var hyphenIndex = -1;
        for (var i = 0; i < textEntries.length; i++) {
            var txtEntry = textEntries[i];
            if (txtEntry != EMPTY_STRING) {
                if (txtEntry && txtEntry.match(/-/g) && txtEntry.match(/-/g).length > 1) {
                    return false;
                }
                hyphenIndex = txtEntry.indexOf("-");
                if (hyphenIndex >= 0) {
                    startVal = txtEntry.substring(0, hyphenIndex);
                    endVal = txtEntry.substring(hyphenIndex + 1);
                    for (var j = startVal; j <= endVal; j++) {
                        if (!($.inArray(parseInt(j), enabledPlanDays) > -1)) {
                            return false;
                        }
                    }
                } else if (!($.inArray(parseInt(txtEntry), enabledPlanDays) > -1)) {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
    return true;
}

/**
 * To create and open the day control
 * @param isSingleDaySelection - to make the calendar single day selection
 * @param selectedDaysStr - to select the days by default string format (1-20,25) or (-TW---- 123--)
 * @param calBtn - current button clicked for opening the calendar
 * @param isDisableUnselected - to disable the days except days in selectableDaysStr
 * @param draggable - to make the calendar draggable and open it in center
 * @param selectableDaysStr - to make these days only selectable
 * @param currentCase - current selected plan
 * @param noOpDays - non operator days list
 * @param holDays - holidays list
 * @param laneStatus - lane status string
 */
function createAndOpenWindow(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus) {
    var pos = getPosition(calBtn);
    initializeCalender(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, pos.x + pos.w, pos.y + pos.h, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus);
    $("#calenderDiv").show();
	$("#calBtnBar").show();
    if (draggable) {
        $('#calenderDiv').data("kendoWindow").center();
    }
    $('#calenderDiv').data("kendoWindow").open();
}

/**
 * Initialize the plan/month view components of day control
 * @param isSingleDaySelection - to make the calendar single day selection
 * @param selectedDaysStr - to select the days by default string format (1-20,25) or (-TW---- 123--)
 * @param calBtn - current button clicked for opening the calendar
 * @param isDisableUnselected - to disable the days except days in selectableDaysStr
 * @param topX x position of the window
 * @param topY y position of the window
 * @param draggable - to make the calendar draggable and open it in center
 * @param selectableDaysStr - to make these days only selectable
 * @param currentCase - current selected plan
 * @param noOpDays - non operator days list
 * @param disableZero - flag to disable zero for local time view
 * @param holDays - holidays list
 * @param laneStatus - lane status string
 */
function initializeCalender(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, topX, topY, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus) {
    var window = $('#calenderDiv');
    if (!window.data("kendoWindow")) {
        window.kendoWindow({
            resizable: false,
            draggable: draggable
        });
		window.parent().find(".k-window-action").css("display", "none");
		window.parent().find('.k-window-titlebar').append($("#calBtnBar"));
		window.parent().find('.k-window-titlebar').append($("#closeSqwCal"));
		window.isClosed = false;
		$("#closeSqwCal").click(function(){
            lastClickedCalBtn.isOpenState = false;
			$('#calenderDiv').data("kendoWindow").close();
			setDayAndCloseWindow();
		});
    }
    if (!draggable) {
        window.closest(".k-window").css({
            top: topY,
            left: topX
        });
    }


    if (currentCase == undefined) {
        currentCase = parent.getSelectedCase();
    }
    var planPerStartDtml, planPerEndDtml;
    if (currentCase) {
        planPerStartDtml = currentCase.planPerStartDtml;
        planPerEndDtml = currentCase.planPerEndDtml;
    }

    initDayControl(isSingleDaySelection, selectedDaysStr, isDisableUnselected, planPerStartDtml, planPerEndDtml, selectableDaysStr, noOpDays, holDays, laneStatus);
    $("#planViewDiv").show();
    $("#monthViewDiv").hide();
    toggleMPViewStyle("planViewTab");
}

/**
 * Toggle click handler between plan and month view and copy the day selections from one view to another
 * @param btn
 */
function toggleMPView(source) {
    toggleMPViewStyle(source.id);
    if ($("#monthViewTable").is(":visible") && source.id == "planViewTab") {
        $("#monthViewDiv").hide();
        $("#planViewDiv").show();
        selectSecondTableFromFirst("monthViewTable", "planViewTable");
    } else if ($("#planViewTable").is(":visible") && source.id == "monthViewTab") {
        $("#monthViewDiv").show();
        $("#planViewDiv").hide();
        selectSecondTableFromFirst("planViewTable", "monthViewTable");
    }
}

/**
 * Toggle styles between plan and month view tabs
 * @param btn
 */
function toggleMPViewStyle(viewTab) {
	if (viewTab != "planViewTab") {
		$("#planViewTab").switchClass("active_plan_tab", "deactive_plan_tab");
		$("#monthViewTab").switchClass("deactive_plan_tab", "active_plan_tab");
	} else {
		$("#planViewTab").switchClass("deactive_plan_tab", "active_plan_tab");
		$("#monthViewTab").switchClass("active_plan_tab", "deactive_plan_tab");
	}
}

/**
 * toggles the local and zulu time view links' styles.
 * @param disableZero flag indicating local time (disable zero)
 */
function toggleTimeLinks(disableZero) {
	if (!disableZero) {
		isDisableZero = false;
		$("#localtime").switchClass("active_time_button", "deselected_time_button");
		$("#zulutime").switchClass("deselected_time_button", "active_time_button");
	} else {
		isDisableZero = true;
		$("#zulutime").switchClass("active_time_button", "deselected_time_button");
		$("#localtime").switchClass("deselected_time_button", "active_time_button");
	}
}

/**
 * click handler for local and zulu time change links.
 * @param toZulu flag indicating zulu enabling
 */
function changeLocalToZulu(toZulu) {
    if (toZulu) {
        isDisableZero = false;
    } else {
        isDisableZero = true;
    }
    daysSelectedStr = getSelectedDaysStr();
    initDayControl(isSingleDaySelection, daysSelectedStr, initDisableUnselected, initPlanStartDate, initPlanEndDate, initSelectableDaysStr, initNoOpDays, initHolDays, initLaneStatus);
}

/**
 * To get the total days in the selected plan
 * @param startDate start date
 * @param endDate end date
 * @returns totla days
 */
function getTotalDays(startDate, endDate) {
    return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (oneDay))) + 1;
}

/**
 * To add the plan and month dates in day control
 * @param isSingleDaySel - to make the calendar single day selection
 * @param selectedDaysStr - to select the days by default string format (1-20,25) or (-TW---- 123--)
 * @param isDisableUnselected - to disable the days except days in selectableDaysStr
 * @param planStartDate plan start date
 * @param planEndDate plan end date
 * @param selectableDaysStr - to make these days only selectable
 * @param noOpDays - non operator days list
 * @param holDays - holidays list
 * @param laneStatus - lane status string
 */
function initDayControl(isSingleDaySel, selectedDaysStr, isDisableUnselected, planStartDate, planEndDate, selectableDaysStr, noOpDays, holDays, laneStatus) {
	if (!selectedDaysStr) {
		selectedDaysStr = "";
	}
    isSingleDaySelection = isSingleDaySel;
    initSelectedDaysStr = selectedDaysStr;
    initDisableUnselected = isDisableUnselected;
    initPlanStartDate = planStartDate;
    initPlanEndDate = planEndDate;
    initSelectableDaysStr = selectableDaysStr;
    initNoOpDays = noOpDays;
    initHolDays = holDays;
    initLaneStatus = laneStatus;

    toggleTimeLinks(isDisableZero);

    if (planStartDate && planEndDate) {
        startDate = new Date(changeCaseDateFormat(planStartDate));
        startDate = new Date(startDate.getTime() - oneDay);
        endDate = new Date(changeCaseDateFormat(planEndDate));
        totalDays = getTotalDays(startDate, endDate);
        var totalFullWeeks = Math.floor(totalDays / 7);
        endDate = new Date(startDate.getTime() + (7 * (totalFullWeeks + 2) + 1) * oneDay);
        totalDays = getTotalDays(startDate, endDate);
    } else {
        var date = new Date();
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        totalDays = getTotalDays(startDate, endDate);
    }

    resetCalendar();
    $('#calMonthLbl').html(getYearLbl(startDate, endDate));
    if (!isSingleDaySelection) {
    	$("#calendarInputText").attr("placeholder", "Type (dd, dd-dd) or select");
    	document.getElementById("calSelectAllBtn").disabled = false;
        addObjToWeekLbl("monthViewTable");
        addObjToWeekLbl("planViewTable");
    } else {
    	$("#calendarInputText").attr("placeholder", "Type (dd) or select");
        document.getElementById("calSelectAllBtn").disabled = true;
        removeObjToWeekLbl("monthViewTable");
        removeObjToWeekLbl("planViewTable");
    }

    //called getDatesArray() method each time to remove references in month view and plan view.
    var selectedDaysArray = getDaysArray(selectedDaysStr, noOpDays);
    var selectableDaysArray = getDaysArray(selectableDaysStr, noOpDays);
    var selectedHolDaysArray = getHolidayDayssArray(selectedDaysStr, holDays);
    var noOpDaysArray;

    if (isDisableUnselected) {
        if (!selectedDaysArray) {
            selectedDaysArray = new Object();
        }
        for(var i = 0; i < selectedDaysArray.length; i++){
        	if($.inArray(selectedDaysArray[i],selectableDaysArray) < 0){
            	selectedDaysArray.splice(i, 1);
            }	
        }
        if (!selectableDaysArray || selectableDaysArray.length < 1) {
            removeObjToWeekLbl("monthViewTable");
            removeObjToWeekLbl("planViewTable");
        }
        addMonthDayLbl(getDatesArray(selectableDaysArray));
        addPlanDayLbl(getDatesArray(selectableDaysArray));
    } else {
        addMonthDayLbl(getDatesArray());
        addPlanDayLbl(getDatesArray());
    }
    selectDaysFromArray(selectedDaysArray);
    selectHolidaysFromArray(selectedHolDaysArray);
    // This is only for NetworkSummary matrix calendar.
    if (laneStatus != undefined) {
        selectLaneStatusByDayArray(laneStatus);
    }
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
    document.getElementById("calendarInputText").focus();

}

/**
 * To add month/year label to day control
 * @param startDate start date
 * @param endDate end date
 * @returns month and year label
 */
function getYearLbl(startDate, endDate) {
    var firstMonth = startDate.getMonth();
    var endMonth = endDate.getMonth();
    var yrLbl = monthNames[firstMonth].substring(0, 3);
    for (var i = firstMonth; i < endMonth; i++) {
        yrLbl = yrLbl + "/" + monthNames[i + 1].substring(0, 3);
    }
    return yrLbl;
}

/**
 * To reset and clear the selected days
 */
function resetCalendar() {
    clearTable("monthViewTable");
    clearTable("planViewTable");
    selectedDays = [];
}

/**
 * Clear the days from table identified by the given id.
 * @param tableId
 */
function clearTable(tableId) {
    var table = document.getElementById(tableId);
    while (table.rows[1]) {
        table.deleteRow(table.rows[1].rowIndex);
    }
}

/**
 * Add year label to plan and month view
 * @param lbl
 */
function addYearLbl(lbl) {
    document.getElementById("monthYrLbl").innerText = lbl;
    document.getElementById("planYrLbl").innerText = lbl;
}

/**
 * To get the list if dates with selectable or unselectable flags in the plan or query 
 * @param selectableDaysArray
 * @returns {Array}
 */
function getDatesArray(selectableDaysArray) {
    var firstDay = startDate.getDay();
    var endDay = endDate.getDay();
    var datesArr = [];
    var datesObjArr = [];
    var tempStartDate = new Date(startDate);
    var nextDay = new Date(tempStartDate.getTime() + oneDay);
    var i, tempDate;
    var dayCount = 0;
    if (firstDay == 0) {
        firstDay = 7;
    }
    for (i = firstDay - 1; i > 0; i--) {
        dayCount++;
        tempDate = new Date(startDate.getTime() - oneDay * i);
        datesArr.push({
            date: tempDate,
            selected: false,
            disabled: true,
            planDay: "pre",
            week: Math.ceil(dayCount / 7)
        });
    }
    for (i = 0; i < totalDays; i++) {
        dayCount++;
        tempDate = new Date(startDate.getTime() + oneDay * i);
        var isDisable = false;
        if (selectableDaysArray && !($.inArray(i, selectableDaysArray) > -1)) {
            isDisable = true;
        }
        if (i == 0 && isDisableZero == true) {
            isDisable = true;
        }
        datesArr.push({
            date: tempDate,
            selected: false,
            disabled: isDisable,
            planDay: i,
            week: Math.ceil(dayCount / 7)
        });
    }
    if (endDay > 0) {
        for (i = 7; i > endDay; i--) {
            dayCount++;
            tempDate = new Date(endDate.getTime() + (8 - i) * oneDay);
            datesArr.push({
                date: tempDate,
                selected: false,
                disabled: true,
                planDay: "post",
                week: Math.ceil(dayCount / 7)
            });
        }
    }
    return datesArr;
}

/**
 * To add week labels with click handler in month view
 * @param datesArray
 */
function addMonthDayLbl(datesArray) {
    var size = Math.floor(datesArray.length / 7);
    var dateIndex = 0;
    var row;
    var cell;
    var cellText;
    for (var i = 0; i < size; i++) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.customObj = {
            selected: false,
            disabled: false
        };
        cell.className = "weekBoxStyle";
        if (!isSingleDaySelection) {
            cell.onclick = weekClickHandler;
            cell.className = "weekBoxStyle";
        } else {
            cell.className = "unSelectableWeekBoxStyle";
        }
        cellText = document.createTextNode("W" + (i + 1));
        cell.appendChild(cellText);
        row.appendChild(cell);
        for (var j = 0; j < 7; j++) {
            cell = document.createElement("td");
            if (datesArray[dateIndex].disabled) {
                cell.className = "disabledDayStyle";
            } else {
                cell.className = "unSelectedDayStyle";
                cell.onclick = cellClickHandler;
                cell.onmouseover = mouseOverHandler;
                cell.onmouseout = mouseOutHandler;
            }
            cell.customObj = datesArray[dateIndex];
            cellText = document.createTextNode((datesArray[dateIndex]).date.getDate());
            cell.appendChild(cellText);
            row.appendChild(cell);
            dateIndex++;
        }
        document.getElementById("monthViewTable").appendChild(row);
    }
}

/**
 * To add week labels with click handler in plan view
 * @param datesArray
 */
function addPlanDayLbl(datesArray) {
    var row;
    var cell;
    var cellText;
    var dateIndex = 0;
    var size = Math.ceil(totalDays / 7);
    for (var i = 0; i <= size; i++) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.customObj = {
            selected: false,
            disabled: false
        };
        if (!isSingleDaySelection) {
            cell.onclick = weekClickHandler;
            cell.className = "weekBoxStyle";
        } else {
            cell.className = "unSelectableWeekBoxStyle";
        }
        cellText = document.createTextNode("W" + i);
        cell.appendChild(cellText);
        row.appendChild(cell);
        var j = 0;
        while (j < 7) {
            if (i == 0 && j < 6) {
                cell = document.createElement("td");
                cell.className = "disabledDayStyle";
                cell.customObj = {
                    selected: false,
                    disabled: true,
                    planDay: "pre"
                };
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
                j++;
            } else {
                if (dateIndex < datesArray.length) {
                    if (datesArray[dateIndex].planDay != "pre") {
                        cell = document.createElement("td");
                        cell.customObj = datesArray[dateIndex];
                        if (datesArray[dateIndex].disabled) {
                            cell.className = "disabledDayStyle";
                        } else {
                            cell.className = "unSelectedDayStyle";
                            cell.onclick = cellClickHandler;
                            cell.onmouseover = mouseOverHandler;
                            cell.onmouseout = mouseOutHandler;
                        }
                        if (datesArray[dateIndex].planDay == "post") {
                            cellText = document.createTextNode("");
                        } else {
                            cellText = document.createTextNode(datesArray[dateIndex].planDay);
                        }
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        j++;
                    }
                } else {
                    cell = document.createElement("td");
                    cell.className = "disabledDayStyle";
                    cell.customObj = datesArray[dateIndex] != null ? datesArray[dateIndex] : {
                        selected: false,
                        disabled: true,
                        planDay: "post"
                    };
                    cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    j++;
                }
                dateIndex++;
            }
        }
        document.getElementById("planViewTable").appendChild(row);
    }
}

/**
 * Mouse over handler to change style on mouse over
 * @param event
 */
function mouseOverHandler(event) {
    event.currentTarget.className = "mouseOverStyle";
}

/**
 * Mouse out handler to remove style on mouse out
 * @param event
 */
function mouseOutHandler(event) {
    if (event.currentTarget.customObj.selected) {
        event.currentTarget.className = "selectedDayStyle";
    } else {
        event.currentTarget.className = "unSelectedDayStyle";
    }
}

/**
 * To add click event on week labels
 * @param tableId
 */
function addObjToWeekLbl(tableId) {
    var table = document.getElementById(tableId);
    for (var i = 1, cell; cell = table.rows[0].cells[i]; i++) {
        cell.customObj = {
            selected: false,
            disabled: false
        };
        cell.onclick = selectColumn;
        cell.className = "weekBoxStyle";
    }
}

/**
 * To remove click event from week labels if single day selection
 * @param tableId
 */
function removeObjToWeekLbl(tableId) {
    var table = document.getElementById(tableId);
    for (var i = 1, cell; cell = table.rows[0].cells[i]; i++) {
        cell.customObj = null;
        cell.onclick = null;
        cell.className = "unSelectableWeekBoxStyle";
    }
}

/**
 * To change the style for select all button
 * @param btn
 */
function toggleBtn(btn) {}

/**
 * To select/deselect all the days in a column
 * @param e
 */
function selectColumn(e) {
    var table = e.target.parentElement.parentElement.parentElement;
    var row, cell;
    var headerCell = e.target;
    if (headerCell.customObj && headerCell.customObj.selected) {
        for (var i = 1; row = table.rows[i]; i++) {
            cell = row.cells[headerCell.cellIndex];
            if (!cell.customObj.disabled) {
                cell.className = "unSelectedDayStyle";
                cell.customObj.selected = false;
                selectedDays.pop(cell.customObj);
            }
        }
    } else {
        for (var i = 1; row = table.rows[i]; i++) {
            cell = row.cells[headerCell.cellIndex];
            if (!cell.customObj.disabled) {
                cell.className = "selectedDayStyle";
                cell.customObj.selected = true;
                selectedDays.push(cell.customObj);
            }
        }
    }
    if (headerCell.customObj) {
        headerCell.customObj.selected = !headerCell.customObj.selected;
    }
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
}

/**
 * To select/deselect all the days in a row
 * @param e
 */
function weekClickHandler(e) {
    var row = e.target.parentNode;
    var cell;
    if (e.target.customObj && e.target.customObj.selected) {
        for (var i = 1; cell = row.cells[i]; i++) {
            if (!cell.customObj.disabled) {
                cell.className = "unSelectedDayStyle";
                cell.customObj.selected = false;
                selectedDays.pop(cell.customObj);
            }
        }
    } else {
        for (var i = 1; cell = row.cells[i]; i++) {
            if (!cell.customObj.disabled) {
                cell.className = "selectedDayStyle";
                cell.customObj.selected = true;
                selectedDays.push(cell.customObj);
            }
        }
    }
    e.target.customObj.selected = !e.target.customObj.selected;
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
}

/**
 * To seelect/deselect a single cell
 * @param e
 */
function cellClickHandler(e) {
    var cell = e.target;
    if (isSingleDaySelection) {
        if (selectedCell != null) {
            if (selectedCell.customObj && !selectedCell.customObj.disabled) {
                selectedCell.className = "unSelectedDayStyle";
                selectedCell.customObj.selected = false;
                if (mSelectedCell != null) {
                    mSelectedCell.className = "unSelectedDayStyle";
                    mSelectedCell.customObj.selected = false;
                }
                cell.className = "selectedDayStyle";
                cell.customObj.selected = true;
                selectedCell = cell;
            }
        } else {
            if (cell.customObj && !cell.customObj.disabled) {
                cell.className = "selectedDayStyle";
                cell.customObj.selected = true;
                selectedCell = cell;
            }
        }
        selectedDays = [];
        selectedDays.push(selectedCell.customObj);
        document.getElementById("calendarInputText").value = getSelectedDaysStr();
        setDayAndCloseWindow();
    }
    if (!isSingleDaySelection && cell.customObj && !cell.customObj.disabled) {
        if (cell.customObj.selected) {
            cell.className = "unSelectedDayStyle";
            cell.customObj.selected = false;
            selectedDays.pop(cell.customObj);
        } else {
            cell.className = "selectedDayStyle";
            cell.customObj.selected = true;
            selectedDays.push(cell.customObj);
        }
    }
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
}

/**
 * selects all the days for plan and month view tables
 * @param btn
 * @param tableId
 */
function selectAllDays() {
    selectAllTableDays("planViewTable");
    selectAllTableDays("monthViewTable");
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
}

/**
 * selects all the days for the given table
 * @param btn
 * @param tableId
 */
function selectAllTableDays(tableId) {
    selectedDays = [];
    var table = document.getElementById(tableId);
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, cell; cell = row.cells[j]; j++) {
            if (cell.customObj && !cell.customObj.disabled) {
                if (i != 0 && j != 0) {
                    cell.className = "selectedDayStyle";
                    selectedDays.push(cell.customObj);
                }
                cell.customObj.selected = true;
            }
        }
    }
}

/**
 * To select the days in month view which were selected in plan view and vice versa 
 * @param firstTableId
 * @param secondTableId
 */
function selectSecondTableFromFirst(firstTableId, secondTableId) {
    clearTableSelection(secondTableId);
    var firstTable = document.getElementById(firstTableId);
    var secondTable = document.getElementById(secondTableId);
    for (var i = 1, fRow; fRow = firstTable.rows[i]; i++) {
        for (var j = 1, fCell; fCell = fRow.cells[j]; j++) {
            if (fCell.customObj.selected) {
                for (var k = 1, sRow; sRow = secondTable.rows[k]; k++) {
                    for (var l = 1, sCell; sCell = sRow.cells[l]; l++) {
                        if (fCell.customObj.planDay == sCell.customObj.planDay) {
                            sCell.className = "selectedDayStyle";
                            sCell.customObj.selected = true;
                            selectedCell = fCell;
                            mSelectedCell = sCell;
                            break;
                        }
                    }
                }
            }
        }
    }
}

/**
 * To clear all the selected days for plan and month view tables
 * @param tableId
 */
function clearAllDaySelections() {
    clearTableSelection("planViewTable");
    clearTableSelection("monthViewTable");
    document.getElementById("calendarInputText").value = getSelectedDaysStr();
}

/**
 * To clear all the selected days
 * @param tableId
 */
function clearTableSelection(tableId) {
    var table = document.getElementById(tableId);
    for (var k = 1, row; row = table.rows[k]; k++) {
        for (var l = 1, cell; cell = row.cells[l]; l++) {
            if (cell.customObj && !cell.customObj.disabled) {
                cell.className = "unSelectedDayStyle";
                cell.customObj.selected = false;
            }
        }
    }
}

/**
 * To show the days as selected by default which are in days list
 * @param days
 */
function selectDaysFromArray(days) {
    var table = document.getElementById("planViewTable");
    var day;
    for (var i = 0; i < days.length; i++) {
        day = days[i];
        for (var k = 1, row; row = table.rows[k]; k++) {
            for (var l = 1, cell; cell = row.cells[l]; l++) {
                if (cell.customObj && (cell.customObj.planDay == day)) {
                    if (day == 0 && isDisableZero) {
                        cell.customObj.selected = false;
                        cell.className = "disabledDayStyle";
                    } else {
                        cell.className = "selectedDayStyle";
                        cell.customObj.selected = true;
                    }
                    if (cell.customObj.disabled) {
                        cell.style.cursor = "default";
                    }
                }
            }
        }
    }
    selectSecondTableFromFirst("planViewTable", "monthViewTable");
}

/**
 * To show the holidays days as canceled days added days which are in the given days map
 * @param days
 */
function selectHolidaysFromArray(daysMap) {
    var table = document.getElementById("planViewTable");
    var day;

    for (var key in daysMap) {
        var holidayStyle = key == "C" ? "deletedDayStyle" : "addedDayStyle";
        days = daysMap[key];
        for (var i = 0; i < days.length; i++) {
            day = days[i];
            if (day != "") {
                for (var k = 1, row; row = table.rows[k]; k++) {
                    for (var l = 1, cell; cell = row.cells[l]; l++) {
                        if (cell.customObj && (cell.customObj.planDay == day)) {
                            cell.className = holidayStyle;
                            cell.customObj.selected = true;
                            if (cell.customObj.disabled) {
                                cell.style.cursor = "default";
                            }
                        }
                    }
                }
            }
        }
    }

    selectSecondTableFromFirst("planViewTable", "monthViewTable");
}

/**
 * To show the days as lane status as per the given lane status string.
 * @param days
 */
function selectLaneStatusByDayArray(laneStatus) {
    var table = document.getElementById("planViewTable");
    var day;

    var laneStatArr = laneStatus.split(",");
    var day = -1;
    var capStat = -1;
    var conStat = -1;
    var laneStatStr = "";
    var capacityArray = new Array();
    var connectivityArray = new Array();
    for (var i = 0; i < laneStatArr.length; i++) {
        laneStatStr = laneStatArr[i];
        var dayArr = laneStatStr.split("-");
        day = parseInt(dayArr[0]);

        var connCapStatArr = dayArr[1].split(":");
        capStat = parseInt(connCapStatArr[0]);
        conStat = parseInt(connCapStatArr[1]);
        var holidayStyle = getLaneStatusStyle(conStat, capStat); //capStat == "5" ? "deletedDayStyle" : "addedDayStyle";
        for (var k = 1, row; row = table.rows[k]; k++) {
            for (var l = 1, cell; cell = row.cells[l]; l++) {
                if (cell.customObj && (cell.customObj.planDay == day)) {
                    cell.className = holidayStyle;
                    cell.customObj.selected = true;
                    if (cell.customObj.disabled) {
                        cell.style.cursor = "default";
                    }
                }
            }
        }
    }

    //return effDaysDay;
/*
	for (var key in daysMap) {
		var holidayStyle = key == "C" ? "deletedDayStyle" : "addedDayStyle";
		days = daysMap[key];
		for(var i=0;i<days.length;i++){
			day = days[i];
			if (day != "") {
			for(var k=1,row; row=table.rows[k];k++){
				for(var l=1,cell; cell=row.cells[l];l++){
					if(cell.customObj && (cell.customObj.planDay == day)) {
						cell.className = holidayStyle;
						cell.customObj.selected = true;
						if(cell.customObj.disabled) {
							cell.style.cursor = "default";
						}
					}
				 }
			  }
		   }
		}
	} */

    selectSecondTableFromFirst("planViewTable", "monthViewTable");
}

/**
 * gives the lane status style
 * @param conStat
 * @param capStat
 * @returns
 */
function getLaneStatusStyle(conStat, capStat) {
    //var laneStatus = null;
    var style = null;
    var textColor = null;
    if (conStat == 0) {
        style = "noPathStyle";
        color = "#ff0000";
        textColor = "#ffffff"; /*laneStatus = CON_STAT_STR_NO_PATH;*/
    } else if (conStat == 1 || conStat == 2) {
        style = "prodRestrictedStyle";
        color = "#ff0000";
        textColor = "#ffffff"; /*laneStatus = CON_STAT_STR_PROD_RESTRICTED;*/
    } else if (conStat == 3) {
        style = "badLaneStyle";
        color = "#ff0000";
        textColor = "#ffffff"; /*laneStatus = CON_STAT_STR_BAD_LANE;*/
    } else {
        if (capStat == 0) {
            style = "notEffectiveStyle";
            color = "#808080";
            textColor = "#ffffff"; /*laneStatus = CAP_STAT_STR_NOT_EFFECTIVE;*/
        } else if (capStat == 1) {
            style = "naStyle";
            color = "#006600";
            textColor = "#ffffff"; /*laneStatus = CAP_STAT_STR_NOT_MINIFLOWED;*/
        } else if (capStat == 2) {
            style = "okStyle";
            color = "#0080ff";
            textColor = "#ffffff"; /*laneStatus = CAP_STAT_STR_ALL_VOLUME_FLOWED;*/
        } else if (capStat == 3) {
            style = "zeroStyle";
            color = "#ff0000";
            textColor = "#ffffff"; /*laneStatus = CAP_STAT_STR_NO_VOLUME_FLOWED;*/
        } else if (capStat == 4) {
            style = "partialStyle";
            color = "#ffff00";
            textColor = "#333333"; /*laneStatus = CAP_STAT_STR_PARTIAL_VOLUME_FLOWED;*/
        } else if (capStat == 5) {
            style = "excessStyle";
            color = "#ffc800";
            textColor = "#333333"; /*laneStatus = CAP_STAT_STR_EXCESS_VOLUME;*/
        } else if (capStat == 6) {
            style = "unknownStyle";
            color = "#ffffff";
            textColor = "#333333"; /*laneStatus = CAP_STAT_STR_UNKNOWN;*/
        }
    }
    if (style) {
        return style;
    }
    return "";
}


/**
 * To get the list of days to show as selected from days string
 * @param dayStr days string
 * @param noOpDays non operator days list
 * @returns {Array}
 */
function getDaysArray(dayStr, noOpDays) {
    var days = [];
    if (dayStr != undefined) {
        var daysStrArray = dayStr.toString().split(" ");
        if (daysStrArray && daysStrArray.length > 1) {
            var weekNum;
            for (var i = 1; i <= daysStrArray[1].length; i++) {
                weekNum = daysStrArray[1].charAt(i - 1);
                if (weekNum == i) {
                    for (var j = 1; j <= daysStrArray[0].length; j++) {
                        if (daysStrArray[0].charAt(j - 1) != "-") {
                            days.push(j + (7 * (i - 1)));
                        }
                    }
                }
            }
        } else {
            daysStrArray = dayStr.toString().split(",");
            for (var i = 0, tempStr; tempStr = daysStrArray[i]; i++) {
                var tempStrArray = tempStr.toString().split("-");
                if (tempStrArray.length == 2) {
                    for (var j = parseInt(tempStrArray[0]); j <= parseInt(tempStrArray[1]); j++) {
                        days.push(j);
                    }
                } else if (tempStrArray.length == 1) {
                    days.push(parseInt(tempStrArray[0]));
                }
            }
        }
    }
    if (noOpDays) {
        var noOpDaysArray = noOpDays.toString().split("X");
        for (var j = 0; j < noOpDaysArray.length; j++) {
            var index = days.indexOf(parseInt(noOpDaysArray[j]));
            if (index > -1) {
                days.splice(index, 1);
            }
        }
    }
    return days;
}

/**
 * gets holidays map from the given day string and where the corresponding selected day marked as '-'
 * @param selectedDaysStr selected days string
 * @param dayStr days string
 * @returns {___map0}
 */
function getHolidayDayssArray(selectedDaysStr, dayStr) {
    var addedDays = [];
    var cancelledDays = [];
    var map = new Object();

    if (dayStr != undefined) {
        var daysStrArray = dayStr.toString().split(" ");
        var effDaysStrArray = selectedDaysStr.toString().split(" ");
        if (daysStrArray && daysStrArray.length > 1) {
            var weekNum;
            for (var i = 1; i <= daysStrArray[1].length; i++) {
                weekNum = daysStrArray[1].charAt(i - 1);
                if (weekNum == i) {
                    for (var j = 1; j <= daysStrArray[0].length; j++) {
                        if (daysStrArray[0].charAt(j - 1) == "H" && effDaysStrArray[0].charAt(j - 1) != "-") {
                            addedDays.push(j + (7 * (i - 1)));
                        } else if (daysStrArray[0].charAt(j - 1) == "C" && effDaysStrArray[0].charAt(j - 1) != "-") {
                            cancelledDays.push(j + (7 * (i - 1)));
                        }
                    }
                }
            }
        }
    }
    map["C"] = cancelledDays;
    map["H"] = addedDays;
    return map;
}

/**
 * To replace all occurances of sub string in a string
 * @param txt
 * @param replace
 * @param with_this
 * @returns
 */
function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

/**
 * Correct the format of date in the selected case
 * @param date
 * @returns
 */
function changeCaseDateFormat(date) {
    return date.replace("-", "\/").replace("-", "\/").replace("-", " ");
}

/**
 * To get the list of slected days in day control
 * @returns {Array}
 */
function getSelectedDays() {
    if ($("#monthViewTable").is(":visible")) {
        selectSecondTableFromFirst("monthViewTable", "planViewTable");
    }
    var sDays = [];
    var table = document.getElementById("planViewTable");
    for (var k = 1, row; row = table.rows[k]; k++) {
        for (var l = 1, cell; cell = row.cells[l]; l++) {
            if (cell.customObj && (cell.customObj.selected == true)) {
                sDays.push(cell.customObj);
            }
        }
    }
    return sDays;
}

/**
 * To get the list of enabled days in day control
 * @returns {Array}
 */
function getEnabledDays() {
    var eDays = [];
    var table = document.getElementById("planViewTable");
    for (var k = 1, row; row = table.rows[k]; k++) {
        for (var l = 1, cell; cell = row.cells[l]; l++) {
            if (cell.customObj && (cell.customObj.disabled == false)) {
                eDays.push(cell.customObj);
            }
        }
    }
    return eDays;
}

/*function getSelectedDaysStr() {
	var sDays = getSelectedDays();
	var tempSD = "";
	if(sDays && sDays.length>0){
		tempSD = sDays[0].planDay;
	}
	for(var i=1,sd;sd=sDays[i];i++){
		tempSD = tempSD + "," + sd.planDay;
	}
	return tempSD;
}*/

/**
 * Get the list of selected days in range format
 */
function getSelectedDaysStr() {
    var sDays = getSelectedDays();
    var tempSD = new Array();
    for (var i = 0, sd; sd = sDays[i]; i++) {
        tempSD.push(parseInt(sd.planDay));
    }
    tempSD.sort(function(a, b) {
        return a - b;
    });

    var range = getRanges(tempSD);
    if (range) {
        return range.toString();
    }
    return EMPTY_STRING;
}

/**
 * Convert the list of days in range format
 * @param array
 * @returns {Array}
 */
function getRanges(array) {
    if (array != undefined && typeof array == "string") {
        array = array.split(",");
    }
    var ranges = [],
        rstart, rend;
    for (var i = 0; i < array.length; i++) {
        rstart = array[i];
        rend = rstart;
        while (array[i + 1] - array[i] == 1) {
            rend = array[i + 1]; // increment the index if the numbers sequential
            i++;
        }
        ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
    }
    return ranges;
}

/**
 * Get the list of selected dates in range format
 */
function getSelectedDatesStr(datesArr) {
    if (datesArr.length == 1) {
        var dt = datesArr[0];
        return dayNames[dt.getDay()].substring(0, 3) + ', ' + monthNames[dt.getMonth()].substring(0, 3) + ' ' + dt.getDate();
    }
    datesArr.sort(function(a, b) {
        return a - b;
    });
    var response = '',
        rstart, rend, rnext;
    var currentMonth, day, displayMonth = -1;
    for (var i = 0; i < datesArr.length; i++) {
        rstart = datesArr[i];
        rend = rstart;
        rnext = datesArr[i + 1];
        day = rstart.getDate();
        while (((rnext - rend) == oneDay) && rnext.getMonth() == rend.getMonth()) {
            i++;
            rend = datesArr[i];
            rnext = datesArr[i + 1];
        }
        currentMonth = rstart.getMonth();

        if (currentMonth != displayMonth) {
            if (response.length > 0) {
                response = response + '; ';
            }
            response = response + (monthNames[currentMonth].substring(0, 3)) + ' ';
        } else if (response.length > 0) {
            response = response + ', ';
        }

        displayMonth = currentMonth;
        response = response + (rstart == rend ? rstart.getDate() + '' : rstart.getDate() + '-' + rend.getDate());
    }
    if (response) {
        return response.toString();
    }
    return EMPTY_STRING;
}

/**
 * Get the x and y coordinates of any component
 */
function getPosition(eDest) {
    var position = new Object();

    position.x = Position_getPageOffsetLeft(eDest);
    position.y = Position_getPageOffsetTop(eDest);
    position.w = eDest.offsetWidth;
    position.h = eDest.offsetHeight;

    return position;
}

/**
 * Get x coordinate
 * @param eItem
 * @returns
 */
function Position_getPageOffsetLeft(eItem) {
    var retLeft = eItem.offsetLeft;

    while ((eItem = eItem.offsetParent) != null) {
        retLeft += eItem.offsetLeft;
    }

    return retLeft;
}

/**
 * Get y coordinate
 * @param eItem
 * @returns
 */
function Position_getPageOffsetTop(eItem) {
    var retTop = eItem.offsetTop;

    while ((eItem = eItem.offsetParent) != null) {
        retTop += eItem.offsetTop;
    }

    return retTop;
}