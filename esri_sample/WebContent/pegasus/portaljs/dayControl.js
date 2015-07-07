/**
 * @author 927456 Honey Bansal
 * This script belongs each dashboard to show day control 
 * Included in all dashboards
 */
//miili seconds in one day
var oneDay = 24*60*60*1000;
//dummy start date
var startDate = new Date(2013,4,1);
//dummy end date
var endDate = new Date(2013,4,31);
//list of all month names
var monthNames = [ "January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December" ];
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
var totalDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime())/(oneDay))) + 1;
//initialize the layout and other components
var dayControl = function (){};
$(document).ready(function() { 
	hideCalenderDivs();
});
//to hide the inner divs in while initializing the application
function hideCalenderDivs(){
	$("#calenderDiv").hide();
	$("#calBtnBar").hide();
	$("#calOkBtn").hide();
}

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
 */
function showDayControl(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, keyObj, draggable, selectableDaysStr, 
		currentCase, noOpDays, disableZero, holDays, laneStatus, showLocalZuluIcon,callbackOpenHandler,dashboardDiv,gridId) {
	try{
		var calDiv = $('#calenderDiv');
		isDisableZero = disableZero;
		dayControl.callbackOpenHandler = callbackOpenHandler;
		dayControl.dashboardDiv = dashboardDiv;
		if(!calBtn.isOpenState){
			createAndOpenWindow(isSingleDaySelection,selectedDaysStr,calBtn, isDisableUnselected, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus);
			calBtn.isOpenState = true;
			if(lastClickedCalBtn && lastClickedCalBtn!=calBtn){
				lastClickedCalBtn.isOpenState = false;
			}
		}
		lastClickedCalBtn = calBtn;
		keyObject = keyObj;
		calDiv[0].isHeaderClicked = false;
		calDiv.parent().find('.k-window-titlebar')[0].onmousedown = function(event) {
			try {
				calDiv[0].isHeaderClicked = true;
				console.log(calDiv[0].isHeaderClicked);
			}catch (e) {
				console.log("Error while mouseup event");
			}
		};
		
		calDiv.parent().find('.k-window-titlebar')[0].onmouseup = function(event) {
			try {
				calDiv[0].isHeaderClicked = false;
				calDiv.data("kendoWindow").toFront();
				console.log(calDiv[0].isHeaderClicked);
			}catch (e) {
				console.log("Error while mouseup event");
			}
		};
		
		calDiv.focusout(function(event) {
			if(lastClickedCalBtn.isOpenState) {
				var node = event.relatedTarget;
				var flag = false;
				while(node){
					if(node.id == "calenderDiv" || node.id == "calBtnBar"){
						flag = true;
						break;
					}
					node = node.parentNode;
				}
				if(!(calDiv[0].isHeaderClicked) && !flag && !lastClickedCalBtn.isNoDaySelected) {
					$('#calenderDiv').data("kendoWindow").close();
					lastClickedCalBtn.isOpenState = false;
				}
			}
		});
		
		$("#togglePM")[0].firstElementChild.className = "k-icon icon-toggle-plan";
		$("#toggleCalLZ")[0].firstElementChild.className = "k-icon icon-toggle-local";
		if(showLocalZuluIcon) {
			$("#toggleCalLZ").css("display","inline");
		}else {
			$("#toggleCalLZ").css("display","none");
		}
	}catch (e) {
		alert("Error occured in the day control");
	}
}	
/**
 * To close the day control and set the selected days
 */
function setDayAndCloseWindow() {
	try {
		var isNoDaySelected;
		var enabledDays = getEnabledDays();
		if(enabledDays != null && enabledDays.length > 0) {
			if(dayControl.callbackOpenHandler != undefined){
				isNoDaySelected = dayControl.callbackOpenHandler(lastClickedCalBtn, getSelectedDaysStr(), keyObject, getSelectedDaysNoRange(), getHolidaysStr(),dayControl.dashboardDiv);				
			}else{
				isNoDaySelected = setSelectedDays(lastClickedCalBtn, getSelectedDaysStr(), keyObject, getSelectedDaysNoRange(), getHolidaysStr());
			}
		}
		if(isNoDaySelected) {
			//do nothing
		}else{
			$('#calenderDiv').data("kendoWindow").close();
			lastClickedCalBtn.isOpenState = false;
		}
	} catch (e) {
		$('#calenderDiv').data("kendoWindow").close();
		lastClickedCalBtn.isOpenState = false;
		console.log("Error in setDayAndCloseWindow");
	}
}
/**
 * To create and open the day control
 * @param isSingleDaySelection
 * @param selectedDaysStr
 * @param calBtn
 * @param isDisableUnselected
 * @param draggable
 * @param selectableDaysStr
 * @param currentCase
 * @param noOpDays
 */
function createAndOpenWindow(isSingleDaySelection, selectedDaysStr, calBtn, isDisableUnselected, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus){
	var pos = getPosition(calBtn);
	initializeCalender(isSingleDaySelection, selectedDaysStr, isDisableUnselected, pos.x + pos.w, pos.y + pos.h, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus);
	$("#calenderDiv").show();
	$("#calBtnBar").show();
	if(draggable) {
		$('#calenderDiv').data("kendoWindow").center();
	}
	$('#calenderDiv').data("kendoWindow").open();
	if(isSingleDaySelection){
		$("#calOkBtn").hide();
	}else {
		$("#calOkBtn").show();
	}
}
/**
 * Initialize the plan/month view components of day control
 * @param isSingleDaySelection
 * @param selectedDaysStr
 * @param isDisableUnselected
 * @param topX
 * @param topY
 * @param draggable
 * @param selectableDaysStr
 * @param currentCase
 * @param noOpDays
 */
function initializeCalender(isSingleDaySelection, selectedDaysStr, isDisableUnselected, topX, topY, draggable, selectableDaysStr, currentCase, noOpDays, holDays, laneStatus){
	var window = $('#calenderDiv');
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			resizable: false,
			draggable: draggable
		});
		window.parent().find(".k-window-action").css("visibility", "hidden");
		window.parent().find('.k-window-titlebar').append($("#calBtnBar"));
	}
	if(!draggable) {
		window.closest(".k-window").css({
			top: topY,
		    left: topX
		});
	}
	if(currentCase == undefined) {
		currentCase = parent.getSelectedCase();
	}
	var planPerStartDtml, planPerEndDtml, planPerDayQty;
	if(currentCase){
		planPerStartDtml = currentCase.planPerStartDtml;
		planPerEndDtml = currentCase.planPerEndDtml;
		planPerDayQty = currentCase.planPerDayQty;
	}
	
	initDayControl(isSingleDaySelection, selectedDaysStr, isDisableUnselected, planPerStartDtml, planPerEndDtml, planPerDayQty, selectableDaysStr, noOpDays, holDays, laneStatus);
	document.getElementById("togglePM").isPlanView = true;
	$("#planViewDiv").show();
	$("#monthViewDiv").hide();
}
/**
 * Toggle click handler between plan and month view
 * @param btn
 */
function toggleMPView(btn){
	if($("#monthViewTable").is(":visible")){
		$("#monthViewDiv").hide();
		$("#planViewDiv").show();
		$("#togglePM")[0].firstElementChild.className = "k-icon icon-toggle-plan";
		$("#togglePM")[0].firstElementChild.title="Switch to Month day";
		selectSecondTableFromFirst("monthViewTable", "planViewTable");
	}else{
		$("#monthViewDiv").show();
		$("#planViewDiv").hide();
		$("#togglePM")[0].firstElementChild.className = "k-icon icon-toggle-month";
		$("#togglePM")[0].firstElementChild.title="Switch to Plan day";
		selectSecondTableFromFirst("planViewTable", "monthViewTable");
	}
}
/**
 * To get the total days in the selected plan
 * @param startDate
 * @param endDate
 * @returns
 */
function getTotalDays(startDate, endDate) {
	return Math.round(Math.abs((endDate.getTime() - startDate.getTime())/(oneDay))) + 1;
}
/**
 * To add the plan and month dates in day control
 * @param isSingleDaySel
 * @param selectedDaysStr
 * @param isDisableUnselected
 * @param planStartDate
 * @param planEndDate
 * @param planTotalDays
 * @param selectableDaysStr
 * @param noOpDays
 */
function initDayControl(isSingleDaySel, selectedDaysStr, isDisableUnselected, planStartDate, planEndDate, planTotalDays, selectableDaysStr, noOpDays, holDays, laneStatus) {
	dayControl.isSingleDaySel = isSingleDaySel;
	dayControl.selectedDaysStr = selectedDaysStr;
	dayControl.isDisableUnselected = isDisableUnselected;
	dayControl.planStartDate = planStartDate;
	dayControl.planEndDate = planEndDate;
	dayControl.planTotalDays = planTotalDays;
	dayControl.selectableDaysStr = selectableDaysStr;
	dayControl.noOpDays = noOpDays;
	dayControl.laneStatus = laneStatus;

	isSingleDaySelection = isSingleDaySel;
	if(planStartDate && planEndDate){
		startDate = new Date(changeCaseDateFormat(planStartDate));
		startDate = new Date(startDate.getTime() - oneDay);
		endDate = new Date(changeCaseDateFormat(planEndDate));
		totalDays = getTotalDays(startDate, endDate);
		var totalFullWeeks = Math.floor(totalDays/7);
		endDate = new Date(startDate.getTime() + (7 * (totalFullWeeks + 2) + 1) * oneDay);
		totalDays = getTotalDays(startDate, endDate);
	}else {
		var date = new Date();
		startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		totalDays = getTotalDays(startDate, endDate);
	}
		
	resetCalendar();
	addYearLbl(getYearLbl(startDate,endDate));
	if(!isSingleDaySelection) {
		addObjToWeekLbl("monthViewTable");
		addObjToWeekLbl("planViewTable");
	}else{
		removeObjToWeelLbl("monthViewTable");
		removeObjToWeelLbl("planViewTable");
	}

	//called getDatesArray() method each time to remove references in month view and plan view.
	var selectedDaysArray = getDaysArray(selectedDaysStr, noOpDays);
	var selectableDaysArray = getDaysArray(selectableDaysStr, noOpDays);
	var selectedHolDaysArray = getHolidayDayssArray(selectedDaysStr, holDays);
	var noOpDaysArray;
	
	if(isDisableUnselected) {
		if(!selectedDaysArray){
			selectedDaysArray = new Object();
		}
		if(selectableDaysArray && selectableDaysArray.length > 0) {
			var tempSelectedDayArray = [];
			for(var i = 0; i < selectedDaysArray.length; i++){
	        	if($.inArray(selectedDaysArray[i],selectableDaysArray) >= 0){
	        		tempSelectedDayArray.push(selectedDaysArray[i]);
	            }	
	        }
			selectedDaysArray = tempSelectedDayArray;
		}
		if(!selectableDaysArray || selectableDaysArray.length < 1){
			removeObjToWeelLbl("monthViewTable");
			removeObjToWeelLbl("planViewTable");
		}
		addMonthDayLbl(getDatesArray(selectableDaysArray));
		addPlanDayLbl(getDatesArray(selectableDaysArray));
		if(selectedDaysArray && selectableDaysArray && selectedDaysArray.toString() == selectableDaysArray.toString()) {
			if(document.getElementById("selectAllMonth").checked){
				toggleBtn(document.getElementById("selectAllMonth"));
			}
			if(document.getElementById("selectAllPlan").checked){
				toggleBtn(document.getElementById("selectAllPlan"));
			}
		}
	}else {
		addMonthDayLbl(getDatesArray());
		addPlanDayLbl(getDatesArray());
	}
	selectDaysFromArray(selectedDaysArray);
	selectHolidaysFromArray(selectedHolDaysArray);
	// This is only for NetworkSummary matrix calendar.
	if (laneStatus != undefined) {
		selectLaneStatusByDayArray(laneStatus);
	}

}
/**
 * To add month/year label to day control
 * @param startDate
 * @param endDate
 * @returns
 */
function getYearLbl(startDate,endDate){
	var firstMonth = startDate.getMonth();
	var endMonth = endDate.getMonth();
	var yrLbl = monthNames[firstMonth];
	for(var i=firstMonth;i<endMonth;i++){
		yrLbl = yrLbl + "/" + monthNames[i+1];
	}
	return yrLbl;
}
/**
 * To reset and clear the selected days
 */
function resetCalendar(){
	if(!document.getElementById("selectAllMonth").checked){
		toggleBtn(document.getElementById("selectAllMonth"));
	}
	if(!document.getElementById("selectAllPlan").checked){
		toggleBtn(document.getElementById("selectAllPlan"));
	}
	document.getElementById("selectAllMonth").checked = true;
	document.getElementById("selectAllPlan").checked = true;
	
	clearTable("monthViewTable");
	clearTable("planViewTable");
	
	selectedDays = [];
}
/**
 * Clear the days from table
 * @param tableId
 */
function clearTable(tableId){
	var table = document.getElementById(tableId);
	while(table.rows[1]){
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
	var nextDay = new Date(tempStartDate.getTime()+oneDay);
	var i, tempDate;
	var dayCount = 0;
	if(firstDay == 0){
		firstDay = 7;
	}
	for(i=firstDay-1; i>0; i--){
		dayCount++;
		tempDate = new Date(startDate.getTime() - oneDay*i);
		datesArr.push({date:tempDate, selected:false, disabled:true, planDay:"pre", week:Math.ceil(dayCount/7)});
	}
	for(i=0; i<totalDays;i++) {
		dayCount++;
		tempDate = new Date(startDate.getTime() + oneDay*i);
		var isDisable = false;
		if(selectableDaysArray && !($.inArray(i, selectableDaysArray) > -1)){
			isDisable = true;
		}
		if(i==0 && isDisableZero == true){
			isDisable = true;
		}
		datesArr.push({date:tempDate, selected:false, disabled:isDisable, planDay:i, week:Math.ceil(dayCount/7)});
	}
	if(endDay > 0) {
		for(i=7; i>endDay;i--){
			dayCount++;
			tempDate = new Date(endDate.getTime() + (8-i)*oneDay);
			datesArr.push({date:tempDate, selected:false, disabled:true, planDay:"post", week:Math.ceil(dayCount/7)});
		}
	}
	return datesArr;
}
/**
 * To add week labels with click handler in month view
 * @param datesArray
 */
function addMonthDayLbl(datesArray) {
	var size = Math.floor(datesArray.length/7);
	var dateIndex = 0;
	var row;
	var cell;
	var cellText;
	for(var i=0; i<size; i++) {
		row = document.createElement("tr");
		cell = document.createElement("td");
		cell.customObj = {selected:false, disabled:false};
		cell.className = "weekBoxStyle";
		if(!isSingleDaySelection){
			cell.onclick = weekClickHandler;
			cell.className = "weekBoxStyle";
		}else{
			cell.className = "unSelectableWeekBoxStyle";
		}
		cellText = document.createTextNode("W"+(i+1));
		cell.appendChild(cellText);
        row.appendChild(cell);
		for(var j=0; j<7; j++) {
			cell = document.createElement("td");
			if(datesArray[dateIndex].disabled){
				cell.className = "disabledDayStyle";
			}else {
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
	var size = Math.ceil(totalDays/7);
	for(var i=0; i<=size; i++) {
		row = document.createElement("tr");
		cell = document.createElement("td");
		cell.customObj = {selected:false, disabled:false};
		if(!isSingleDaySelection){
			cell.onclick = weekClickHandler;
			cell.className = "weekBoxStyle";
		}else{
			cell.className = "unSelectableWeekBoxStyle";
		}
		cellText = document.createTextNode("W"+i);
		cell.appendChild(cellText);
        row.appendChild(cell);
        var j = 0;
        while(j<7) {
        	if(i==0 && j<6) {
				cell = document.createElement("td");
	        	cell.className = "disabledDayStyle";
	        	cell.customObj = {selected:false, disabled:true, planDay:"pre"};
	        	cellText = document.createTextNode("");
	        	cell.appendChild(cellText);
		        row.appendChild(cell);
        		j++;
			}else {
	        	if(dateIndex < datesArray.length) {
	        		if(datesArray[dateIndex].planDay != "pre") {
	    				cell = document.createElement("td");
			        	cell.customObj = datesArray[dateIndex];
			        	if(datesArray[dateIndex].disabled){
							cell.className = "disabledDayStyle";
						}else {
							cell.className = "unSelectedDayStyle";
							cell.onclick = cellClickHandler;
							cell.onmouseover = mouseOverHandler;
							cell.onmouseout = mouseOutHandler;
						}
			        	if(datesArray[dateIndex].planDay == "post"){
			        		cellText = document.createTextNode("");
						}else{
							cellText = document.createTextNode(datesArray[dateIndex].planDay);
						}
						cell.appendChild(cellText);
				        row.appendChild(cell);
				        j++;
	        		}
	        	}else {
	        		cell = document.createElement("td");
		        	cell.className = "disabledDayStyle";
		        	cell.customObj = datesArray[dateIndex] != null ? datesArray[dateIndex] : {selected:false, disabled:true, planDay:"post"};
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
	if(event.currentTarget.customObj.addedDay){
		event.currentTarget.className = "addedDayStyle";
	}else if(event.currentTarget.customObj.deletedDay) {
		event.currentTarget.className = "deletedDayStyle";
	}else if(event.currentTarget.customObj.selected) {
		event.currentTarget.className = "selectedDayStyle";
	}else {
		event.currentTarget.className = "unSelectedDayStyle";
	}
}
/**
 * To add click event on week labels
 * @param tableId
 */
function addObjToWeekLbl(tableId) {
	var table = document.getElementById(tableId);
	for (var i = 0, cell; cell = table.rows[0].cells[i]; i++) {
		if(i==0) {
			cell.firstChild.style.display = "inline";
		}else {
			cell.customObj = {selected:false, disabled:false};
			cell.onclick = selectColumn;
			cell.className = "weekBoxStyle";
		}
	}
}
/**
 * To remove click event from week labels if single day selection
 * @param tableId
 */
function removeObjToWeelLbl(tableId) {
	var table = document.getElementById(tableId);
	for (var i = 0, cell; cell = table.rows[0].cells[i]; i++) {
		if(i==0) {
			cell.firstChild.style.display = "none";
		}else {
			cell.customObj = null;
			cell.onclick = null;
			cell.className = "unSelectableWeekBoxStyle";
		}
	}
}
/**
 * To change the style for select all button
 * @param btn
 */
function toggleBtn(btn) {
	if(btn.checked) {
		btn.value = "Select None";
		btn.checked = false;
		//btn.style.borderStyle = "inset";
	}else{
		btn.value = "Select All";
		btn.checked = true;
		//btn.style.borderStyle = "outset";
	}
}
/**
 * To select/deselect all the days in a column
 * @param e
 */
function selectColumn(e) {
	var table = e.target.parentElement.parentElement.parentElement;
	var row, cell;
	var headerCell = e.target;
	if(headerCell.customObj && headerCell.customObj.selected){
		for (var i = 1; row = table.rows[i]; i++) {
			cell = row.cells[headerCell.cellIndex];
			if(!cell.customObj.disabled){
				cell.className = "unSelectedDayStyle";
				cell.customObj.selected = false;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedDays.pop(cell.customObj);
			}
		}
	}else {
		for (var i = 1; row = table.rows[i]; i++) {
			cell = row.cells[headerCell.cellIndex];
			if(!cell.customObj.disabled){
				cell.className = "selectedDayStyle";
				cell.customObj.selected = true;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedDays.push(cell.customObj);
			}
		}
	}
	if(headerCell.customObj) {
		headerCell.customObj.selected = !headerCell.customObj.selected;
	}
}
/**
 * To select/deselect all the days in a row
 * @param e
 */
function weekClickHandler(e){
	var row = e.target.parentNode;
	var cell;
	if(e.target.customObj && e.target.customObj.selected) {
		for (var i = 1; cell = row.cells[i]; i++) {
			if(!cell.customObj.disabled){
				cell.className = "unSelectedDayStyle";
				cell.customObj.selected = false;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedDays.pop(cell.customObj);
			}
		}
	}else{
		for (var i = 1; cell = row.cells[i]; i++) {
			if(!cell.customObj.disabled){
				cell.className = "selectedDayStyle";
				cell.customObj.selected = true;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedDays.push(cell.customObj);
			}
		}
	}
	e.target.customObj.selected = !e.target.customObj.selected;
}
/**
 * To seelect/deselect a single cell
 * @param e
 */
function cellClickHandler(e) {
	var cell = e.target;
	if(e.ctrlKey || e.key == "Ctrl") {
		if(cell.customObj.deletedDay) {
			cell.className = "addedDayStyle";
			cell.customObj.selected = true;
			cell.customObj.deletedDay = false;
			cell.customObj.addedDay = true;
			selectedDays.push(cell.customObj);
		}else {
			cell.className = "deletedDayStyle";
			cell.customObj.selected = false;
			cell.customObj.deletedDay = true;
			cell.customObj.addedDay = false;
			selectedDays.pop(cell.customObj);
		}
	}else if(isSingleDaySelection){
		if(selectedCell != null){
			if(selectedCell.customObj && !selectedCell.customObj.disabled){
				selectedCell.className = "unSelectedDayStyle";
				selectedCell.customObj.selected = false;
				if(mSelectedCell != null) {
					mSelectedCell.className = "unSelectedDayStyle";
					mSelectedCell.customObj.selected = false;
				}
				cell.className = "selectedDayStyle";
				cell.customObj.selected = true;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedCell = cell;
			}
		}else {
			if(cell.customObj && !cell.customObj.disabled){
				cell.className = "selectedDayStyle";
				cell.customObj.selected = true;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
				selectedCell = cell;
			}
		}
		selectedDays = [];
		selectedDays.push(selectedCell.customObj);
		setDayAndCloseWindow();
	}else if(!isSingleDaySelection && cell.customObj && !cell.customObj.disabled){
		if(cell.customObj.selected) {
			cell.className = "unSelectedDayStyle";
			cell.customObj.selected = false;
			cell.customObj.deletedDay = false;
			cell.customObj.addedDay = false;
			selectedDays.pop(cell.customObj);
		}else{
			cell.className = "selectedDayStyle";
			cell.customObj.selected = true;
			cell.customObj.deletedDay = false;
			cell.customObj.addedDay = false;
			selectedDays.push(cell.customObj);
		}
	}
}
/**
 * To select/deselect all the days
 * @param btn
 * @param tableId
 */
function selectAllDays(btn, tableId){
	var table = document.getElementById(tableId);
	for(var i=0,row; row=table.rows[i];i++){
		for(var j=0,cell; cell=row.cells[j];j++){
			if(cell.customObj && !cell.customObj.disabled) {
				if(i!=0 && j!=0) {
					cell.className = btn.checked == true ? "selectedDayStyle" : "unSelectedDayStyle";
					if(btn.checked){
						selectedDays.push(cell.customObj);
					}else{
						selectedDays.pop(cell.customObj);
					}
				}
				cell.customObj.selected = btn.checked;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
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
	for (var i=1,fRow; fRow=firstTable.rows[i];i++){
		for(var j=1,fCell; fCell=fRow.cells[j];j++){
			if(fCell.customObj.selected || fCell.customObj.deletedDay){
				for(var k=1,sRow; sRow=secondTable.rows[k];k++){
					for(var l=1,sCell; sCell=sRow.cells[l];l++){
						if(fCell.customObj.planDay == sCell.customObj.planDay) {
							sCell.className = fCell.className; //"selectedDayStyle";
							sCell.customObj.selected = fCell.customObj.selected;
							sCell.customObj.addedDay = fCell.customObj.addedDay;
							sCell.customObj.deletedDay = fCell.customObj.deletedDay;
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
 * To clear all the selected days
 * @param tableId
 */
function clearTableSelection(tableId) {
	var table = document.getElementById(tableId);
	for(var k=1,row; row=table.rows[k];k++){
		for(var l=1,cell; cell=row.cells[l];l++){
			if(cell.customObj && !cell.customObj.disabled) {
				cell.className = "unSelectedDayStyle";
				cell.customObj.selected = false;
				cell.customObj.deletedDay = false;
				cell.customObj.addedDay = false;
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
	for(var i=0;i<days.length;i++){
		day = days[i];
		for(var k=1,row; row=table.rows[k];k++){
			for(var l=1,cell; cell=row.cells[l];l++){
				if(cell.customObj && (cell.customObj.planDay == day)) {
					cell.className = "selectedDayStyle";
					cell.customObj.selected = true;
					if(cell.customObj.disabled) {
						cell.style.cursor = "default";
					}
				}
			}
		}
	}
	selectSecondTableFromFirst("planViewTable", "monthViewTable");
}

/**
 * To show the days as selected by default which are in days list
 * @param days
 */
function selectHolidaysFromArray(daysMap) {
	var table = document.getElementById("planViewTable");
	var day;
	
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
						if(key == "C") {
							cell.customObj.selected = false;
							cell.customObj.deletedDay = true;
							cell.customObj.addedDay = false;
						}else if(key == "H") {
							cell.customObj.selected = true;
							cell.customObj.deletedDay = false;
							cell.customObj.addedDay = true;
						}
						if(cell.customObj.disabled) {
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
 * To show the days as selected by default which are in days list
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
	for(var i=0; i<laneStatArr.length; i++) {
		laneStatStr = laneStatArr[i];
		var dayArr = laneStatStr.split("-");
		day = parseInt(dayArr[0]);
		
		var connCapStatArr =dayArr[1].split(":");
		capStat = parseInt(connCapStatArr[0]);
		conStat = parseInt(connCapStatArr[1]);
		var holidayStyle = getLaneStatusStyle(conStat, capStat);//capStat == "5" ? "deletedDayStyle" : "addedDayStyle";
				
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


function getLaneStatusStyle(conStat, capStat) {
	//var laneStatus = null;
	var style = null;
	var textColor = null;
	if (conStat == 0) {
		style = "noPathStyle";
		color = "#ff0000";
		textColor = "#ffffff";
		/*laneStatus = CON_STAT_STR_NO_PATH;*/
	} else if (conStat == 1 || conStat == 2) {
		style = "prodRestrictedStyle";
		color = "#ff0000"; 
		textColor = "#ffffff";
		/*laneStatus = CON_STAT_STR_PROD_RESTRICTED;*/
	} else if (conStat == 3) {
		style = "badLaneStyle";
		color = "#ff0000"; 
		textColor = "#ffffff";
		/*laneStatus = CON_STAT_STR_BAD_LANE;*/
	} else {
		if (capStat == 0) {
			style = "notEffectiveStyle";
			color = "#808080";
			textColor = "#ffffff";
			/*laneStatus = CAP_STAT_STR_NOT_EFFECTIVE;*/
		} else if (capStat == 1) {
			style = "naStyle";
			color = "#006600";
	     	textColor = "#ffffff";
	     	/*laneStatus = CAP_STAT_STR_NOT_MINIFLOWED;*/
		} else if (capStat == 2) {
			style = "okStyle";
			color = "#0080ff";
	     	textColor = "#ffffff";
	     	/*laneStatus = CAP_STAT_STR_ALL_VOLUME_FLOWED;*/
		} else if (capStat == 3) {
			style = "zeroStyle";
			color = "#ff0000";
	     	textColor = "#ffffff";
	     	/*laneStatus = CAP_STAT_STR_NO_VOLUME_FLOWED;*/
		} else if (capStat == 4) {
			style = "partialStyle";
			color = "#ffff00";
	     	textColor = "#333333";
	     	/*laneStatus = CAP_STAT_STR_PARTIAL_VOLUME_FLOWED;*/
		} else if (capStat == 5) {
			style = "excessStyle";
			color = "#ffc800";
	     	textColor = "#333333";
	     	/*laneStatus = CAP_STAT_STR_EXCESS_VOLUME;*/
		} else if (capStat == 6) {
			style = "unknownStyle";
			color = "#ffffff";
	     	textColor = "#333333";
	     	/*laneStatus = CAP_STAT_STR_UNKNOWN;*/
		}
	}
	if(style) {
		return style;
	}
	return "";
}


/**
 * To get the list of days to show as selected from days string
 * @param dayStr
 * @param noOpDays
 * @returns {Array}
 */
function getDaysArray(dayStr, noOpDays) {
	var days = [];
	if(dayStr != undefined) {
		var daysStrArray = dayStr.toString().split(" ");
		if(daysStrArray && daysStrArray.length > 1) {
			for(var i=0;i<daysStrArray.length;i++){
				if(i==0) {
					if(daysStrArray[i].charAt(6) != "-") {
						days.push(0);
					}
				}else {
					for(var j=0;j<7;j++){
						if(daysStrArray[i].charAt(j) != "-"){
							days.push((j + 1) + (7 * (i-1)));
						}
					}
				}
			}
		}else {		
			daysStrArray = dayStr.toString().split(",");
			for(var i=0,tempStr;tempStr=daysStrArray[i];i++){
				var tempStrArray = tempStr.toString().split("-");
				if(tempStrArray.length == 2){
					for(var j=parseInt(tempStrArray[0]);j<=parseInt(tempStrArray[1]); j++){
						days.push(j);
					}
				}else if(tempStrArray.length == 1){
					days.push(parseInt(tempStrArray[0]));
				}
			}
		}
	}
	if(noOpDays) {
		var noOpDaysArray = noOpDays.toString().split("X");
		for(var j=0; j<noOpDaysArray.length; j++) {
			var index = days.indexOf(parseInt(noOpDaysArray[j]));
			if(index > -1) {
				days.splice(index, 1);
			}
		}
	}
	return days;
}
/**
 * holidays array index is always starting from 1
 * @param holEffDays
 * @returns
 */
function convertHolidayString(holEffDays) {
	if(holEffDays != null) {
		var holDayStringArray = holEffDays.split(",");
 		var weeks = [];
 		var holidays = [];
 		for(var i=0; i<holDayStringArray.length; i++) {
 			weeks = holDayStringArray[i].split(" ");
 			if(weeks && weeks.length == 2) {
 				for(var j=0; j<weeks[1].length; j++) {
 					holidays[weeks[1].charAt(j)] = weeks[0];
 				}
 			}
 		}
 		return holidays;
	}
	return "";
}
/**
 * daysStrArray array index is always starting from 1
 * @param holEffDays
 * @returns
 */
function getHolidayDayssArray(selectedDaysStr, dayStr) {
	var addedDays = [];
	var cancelledDays = [];
	var map = new Object(); 
	try {
		if(dayStr != undefined) {
			var daysStrArray = [];
			if(dayStr.indexOf(" ") < 0) {
				daysStrArray = dayStr.split(",");
			}else {
				daysStrArray = convertHolidayString(dayStr);
			}
			var effDaysStrArray = selectedDaysStr.toString().split(" ");
			if(daysStrArray && effDaysStrArray && (daysStrArray.length == effDaysStrArray.length)) {
				for(var i=1; i<daysStrArray.length; i++){
					for(var j=0; j<daysStrArray[i].length; j++){
						if(daysStrArray[i].charAt(j) == "H" && effDaysStrArray[i].charAt(j) != "-"){
							addedDays.push((j + 1) + (7 * (i-1)));
						} else if(daysStrArray[i].charAt(j) == "C" && effDaysStrArray[i].charAt(j) != "-"){
							cancelledDays.push((j + 1) + (7 * (i-1)));
						}
					}
				}
			}else {
				for(var i=1; i<daysStrArray.length; i++){
					for(var j=0; j<daysStrArray[i].length; j++){
						if(daysStrArray[i].charAt(j) == "H"){
							addedDays.push((j + 1) + (7 * (i-1)));
						} else if(daysStrArray[i].charAt(j) == "C"){
							cancelledDays.push((j + 1) + (7 * (i-1)));
						}
					}
				}
			}
		}
		map["C"] = cancelledDays;
		map["H"] = addedDays;
	}catch (e) {
		console.log("Error in getHolidayDayssArray");
	}
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
	return txt.replace(new RegExp(replace, 'g'),with_this);
}
/**
 * Correct the format of date in the selected case
 * @param date
 * @returns
 */
function changeCaseDateFormat(date){
	return date.replace("-","\/").replace("-","\/").replace("-"," ");
}

function getSelectedDaysNoRange() {
	var sDays = getSelectedDays();
	var tempSD = new Array();
	for(var i=0,sd;sd=sDays[i];i++){
		tempSD.push(parseInt(sd.planDay));
	}
	tempSD.sort(function(a,b){
	    return a-b;
	});
	return tempSD;
}

/**
 * To get the list of slected days in day control
 * @returns {Array}
 */
function getSelectedDays(){
	if($("#monthViewTable").is(":visible")){
		selectSecondTableFromFirst("monthViewTable", "planViewTable");
	}
	var sDays = [];
	var table = document.getElementById("planViewTable");
	for(var k=1,row; row=table.rows[k];k++){
		for(var l=1,cell; cell=row.cells[l];l++){
			if(cell.customObj && (cell.customObj.selected == true)) {
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
	for(var k=1,row; row=table.rows[k];k++){
		for(var l=1,cell; cell=row.cells[l];l++){
			if(cell.customObj && (cell.customObj.disabled == false)) {
				eDays.push(cell.customObj);
			}
		}
	}
	return eDays;
}

function getHolidaysStr() {
	if($("#monthViewTable").is(":visible")){
		selectSecondTableFromFirst("monthViewTable", "planViewTable");
	}
	var holidayStr = "";
	var table = document.getElementById("planViewTable");
	for(var k=1,row; row=table.rows[k];k++){
		if(k > 0 && k <= dayControl.planTotalDays/7 + 1) {
			for(var l=1,cell; cell=row.cells[l];l++){
				if(cell.customObj && (cell.customObj.addedDay == true)) {
					holidayStr = holidayStr + "H";
				}else if(cell.customObj && (cell.customObj.deletedDay == true)) {
					holidayStr = holidayStr + "C";
				}else {
					holidayStr = holidayStr + "-";
				}
			}
			holidayStr = holidayStr + ",";
		}
	}
	holidayStr = holidayStr.substring(0, holidayStr.length - 1);
	return holidayStr;
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
	for(var i=0,sd;sd=sDays[i];i++){
		tempSD.push(parseInt(sd.planDay));
	}
	tempSD.sort(function(a,b){
	    return a-b;
	});
	
	var range = getRanges(tempSD);
	if(range) {
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
	if(array != undefined && typeof array == "string") {
		array = array.split(",");
	}
	var ranges = [], rstart, rend;
	for (var i = 0; i < array.length; i++) {
		rstart = array[i];
	    rend = rstart;
	    while (array[i + 1] - array[i] == 1) {
	    	rend = array[i + 1]; // increment the index if the numbers sequential
	    	i++;
	    }
	    ranges.push(rstart == rend ? rstart+'' : rstart + '-' + rend);
	}
	return ranges;
}

/**
 * Get the x and y coordinates of any component
 */
function getPosition(eDest) {
	var position = new Object();

	position.x = Position_getPageOffsetLeft(eDest) ;
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
function Position_getPageOffsetLeft (eItem) {
	var retLeft = eItem.offsetLeft;

	while((eItem = eItem.offsetParent) != null) {
	  retLeft += eItem.offsetLeft;
	}
	
	return retLeft;
}
/**
 * Get y coordinate
 * @param eItem
 * @returns
 */
function Position_getPageOffsetTop (eItem) {
	var retTop = eItem.offsetTop;

	while( (eItem = eItem.offsetParent) != null) {
	  retTop += eItem.offsetTop;
	}

	return retTop;
}

function toggleCalLZView(btn){
	try {
		if (btn.toggled) {
	        btn.children[0].className = "k-icon icon-toggle-local";
	        btn.toggled = false;
	    } else {
	        btn.children[0].className = "k-icon icon-toggle-zulu";
	        btn.toggled = true;
	    }
		enableDisableZero(btn.toggled);
	}catch (e) {
		console.log("Error in toggling Local/Zulu");
	}
}

function enableDisableZero(isEnabled) {
	isDisableZero = !isEnabled;
	initDayControl(dayControl.isSingleDaySel, getSelectedDaysStr(), dayControl.isDisableUnselected, dayControl.planStartDate, dayControl.planEndDate, dayControl.planTotalDays, dayControl.selectableDaysStr, dayControl.noOpDays, dayControl.holDays, dayControl.laneStatus);
}