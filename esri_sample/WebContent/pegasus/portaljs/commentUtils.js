
var commentID =0;
function refreshhRouteEditorDashBoard() {
	var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
	dashboard.updateSelectedRouteNLegList();
}

function setDashBoardData(routeData, legData) {
	if (parent.selectedDetails.dashboardID == parent.DASHBOARD_ID_MATRIX_ROUTE_EDITOR) {
		parent.selectedLegList = legData;
		parent.selectedRouteList = routeData;
	} else {
		parent.selectedWIPRouteList = routeData;
		parent.selectedWIPLegList = legData;
		
	}
}

function getRouteId() {
	if(parent.selectedDetails != undefined){
		if ($(parent.selectedDetails.selectedCheckBox) != null && $(parent.selectedDetails.selectedCheckBox).length >0) {
			var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
			var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
			var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
			var routeData = routeGrid.dataItem(currentTR);
			return routeData.ROUTE_ID;
		} else {
			return parent.selectedDetails.changedRouteData[0].ROUTE_ID;
		}
	}
}

function getRandomNumber() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
	var string_length = 26;
	var num_chars = chars.length;
	var result = '0x';
	while(result.length < string_length) {
		result+= chars[Math.floor(Math.random() * num_chars)];
	    
	}
	result =  result.toString().substring(0, string_length);
	
	
	//return result.toString(16);
	commentID =commentID+1;
	return commentID;
}

function getDateTimeForamt(date) {
	if (date == undefined) {
		date = new Date();
	}
	var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1) : "0" + (date.getMonth()+1);
	var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
	var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
	var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
	var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());

	var dateString = 
	    month + "/" + 
	    day + "/" + 
	    date.getFullYear() + " " + 
	    hours + ":" + 
	    minutes + ":" + 
	    seconds;
	return dateString;
}