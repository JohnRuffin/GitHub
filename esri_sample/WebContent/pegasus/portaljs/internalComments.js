
var isInitialized = false;
var gridId ;

function refresh() {
	initializeInternalComment();
}

function initializeInternalComment()  {
	gridId = "internalcommentGrid";
	if (!isInitialized) {
		isInitialized = true;
	} else {
		destroyGrid(gridId);
	}
	initializeGrid(gridId);
	
	var close=  parent.dashboardController.getDashboard('internalCommentsDiv').data('kendoWindow').wrapper.find(".k-i-close");
	/*close.bind("click",function(e) {
		parent.revisionInterCommentcheckbox= undefined;
	});
	if (parent.revisionInterCommentcheckbox != undefined && $(parent.revisionInterCommentcheckbox).prop('checked')) {
		$('#addNewComment').attr("disabled","disabled");
	} else {
		$('#addNewComment').removeAttr("disabled");
	}*/
}

function destroyGrid(gridId){
	if($('#'+gridId).data("kendoGrid")) {
		$('#'+gridId).data("kendoGrid").destroy();
		$('#'+gridId).empty();
	}
}

function initializeGrid(gridId) {
	var grid = $(HASH_STRING + gridId).kendoGrid({
		scrollable: true,
		pageable: false,
		selectable:false,
		reorderable: true,
		resizable: true,
		navigatable: true,
		//dataSource: getGridDataSource($.parseJSON(parent.currentSelectedLegComment.COMMENTS)),
		dataSource: getGridDataSource(getCommnentData(getRouteComment())),
		columns:getGridColumns(),
		editable: {
            confirmation: false
        },
		edit: function(e) {
			var currentTR = e.container.closest('tr');
			var gridData = $(HASH_STRING+gridId).data("kendoGrid");
			var commentData = gridData.dataItem(currentTR);
			/*if (parent.revisionInterCommentcheckbox != undefined && $(parent.revisionInterCommentcheckbox).prop('checked')){
				this.closeCell();
			} else {*/
			if (commentData["operationCd"] != undefined && commentData["operationCd"] != null && commentData["operationCd"].type != undefined) {
				if(commentData["operationCd"].type != 1) {
					this.closeCell();
				}
			} else if (commentData["EDITABLE"] == undefined || commentData["EDITABLE"] ==  false){
				this.closeCell();
			}
			//FDX-1093
			if(e.container.find("input[name='commentDesc']")[0] != undefined){
				e.container.find("input[name='commentDesc']").attr('maxlength', '255');//to fix the max-length in comments cell
			}
			//}
			
		},
		 dataBound:function(){ 
	            this.content.scrollTop(this.tbody.height());
	     }
	});
}
 
function getRouteComment() {
	if(parent.selectedDetails != undefined){
		if ($(parent.selectedDetails.selectedCheckBox) != null && $(parent.selectedDetails.selectedCheckBox).length >0) {
			var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
			var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
			var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
			var routeData = routeGrid.dataItem(currentTR);
			return routeData.COMMENTS;
		} else {
			return parent.selectedDetails.changedRouteData[0].COMMENTS;
		}
	}
	
}

function getCommnentData(comments) {
	if (comments != "" && comments != null) {
		var comments = $.parseJSON(comments);
		comments.sort(function(x, y){
		    return x.createTmstp - y.createTmstp;
		});
		return comments;
	} else {
		return null;
	}
}
function getGridDataSource(data) {
	//var randomNumber = getRandomNumber();
	return new kendo.data.DataSource({
		data:(data != undefined && data != null) ? data : [],
		schema: {
			model:{
				id:"internalComments",
				fields: {
					commentDesc: {
						type: "string",
						editable: true
					},
					createUserNm :{
						type: "string",
						editable: true
					},
					createTmstp:{
						type: "string",
						editable: true
					},
					commentTypeCode:{
						  type: "string",
                          from: "commentTypeCd.type"
					}
					
				}
			},
			parse: function (d) {
				$.each(d, function (idx, dataItem) {	
					parseDateTime(dataItem,'createTmstp');
				});
					
				return d;
			}
		},	
		filter: { field: "commentTypeCode", operator: "equal", value: "0" }
	});
}

function parseDateTime(dataItem, propertyName) {
	if (dataItem[propertyName] != undefined && dataItem[propertyName] != "") {
		var date  = new Date(dataItem[propertyName]);
		var foramtedDate = getDateTimeForamt(date);
		dataItem[propertyName] = foramtedDate;
		
	}
}

/*Number.prototype.padLeft = function(base,chr){
	   var  len = (String(base || 10).length - String(this).length)+1;
	   return len > 0? new Array(len).join(chr || '0')+this : this;
};*/
/*
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
	  
}*/




function getInteernalCommentEmptyObject(routeID,randomNumber,operationCode) {
	return {
		"valid":true,
		"routeId":routeID,
		"ocaNbr":"0",
		"operationCd":{"type":1},
		"commentDesc":EMPTY_STRING,
		"commentTypeCd":{"type":operationCode},
		"createUserNm":parent.loginUserId,
		"createTmstp":getDateTimeForamt(),
		"crewNotifiedDesc":null,
		"effectiveDateDesc":EMPTY_STRING,
		"origRouteDesc":EMPTY_STRING,
		"reasonDesc":EMPTY_STRING,
		"reqByDesc":EMPTY_STRING,
		"routeCommentId":randomNumber,
		"EDITABLE":true,
		"commentTypeCode":operationCode+""
	};	
}
/*
function getRandomNumber() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
	var string_length = 26;
	var num_chars = chars.length;
	var result = '0x';

	
	
	while(result.length < string_length) {
		result+= chars[Math.floor(Math.random() * num_chars)];
	    
	}
	result =  result.toString().substring(0, string_length);

	
	return result.toString(16);
}*/

function getGridColumns() {
	
	return [{
		field : "commentDesc",
		title : "Comments",
		hidden : false,
		width : "60px",
		attributes : {
			style : "padding-left:4px;height:40px;"
		},
		headerAttributes : {
			title : "Comments",
			style:"text-align:center; word-wrap: break-word;"
		}
	},{
		field : "createUserNm",
		title : "Created By",
		hidden : false,
		width : "40px",
		attributes : {
			style : "padding-left:4px;"
		},
		headerAttributes : {
			title : "Created By",
			style:"text-align:center;"
		}
	},{
		field : "createTmstp",
		title : "Created&nbsp;Date/Time",
		hidden : false,
		width : "40px",
		attributes : {
			style : "padding-left:4px;"
		},
		headerAttributes : {
			title : "Created&nbsp;Date/Time",
			style:"text-align:center;"
		}
	}];
}
/*
function getRouteId() {
	var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
	var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
	var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
	var routeData = routeGrid.dataItem(currentTR);
	return routeData.ROUTE_ID;
}*/

function addRowHandler() {
	var grid = $(HASH_STRING+gridId).data("kendoGrid");
	var datasource = grid.dataSource;
	var randomNumber = getRandomNumber();
	datasource.insert(datasource.data().length, getInteernalCommentEmptyObject(getRouteId(),randomNumber,0));
	$(HASH_STRING+gridId).data("kendoGrid").refresh();
	var kendoDatasource = $(HASH_STRING+gridId).data("kendoGrid").dataSource;
	kendoDatasource.filter({ field: "commentTypeCode", operator: "equal", value: "0" });
	
	scrollToSelectedRow(grid);
}
function closeDashboard() {
	var grid = $(HASH_STRING+gridId).data("kendoGrid");
	var filteredcommentData = new Array();
	if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS) != undefined) {
		parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS);
		if ( $(parent.selectedDetails.selectedCheckBox) != null &&  $(parent.selectedDetails.selectedCheckBox).length >0) {
			var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
			var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
			var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
			var routeData = routeGrid.dataItem(currentTR);
			filteredcommentData= setInternalCommentToRouteObject(grid,routeData);
			/*var commentData = grid.dataSource.data();
			var filteredcommentData = new Array();
			for (var i =0; i <commentData.length; i++) {
				commentData[i].createTmstp = Date.parse(commentData[i].createTmstp);
				if (commentData[i].commentDesc != null && commentData[i].commentDesc != '' && commentData[i].commentDesc != undefined ) {
					filteredcommentData.push(commentData[i]);
				}
			}
			routeData.COMMENTS = JSON.stringify(filteredcommentData, replacer);*/
			var commentList = $.grep(filteredcommentData, function(obj) {
				return (obj["commentTypeCd"].type == 0);
			});
			if ($(parent.selectedDetails.selectedCheckBox).hasClass('k-internal-comment')){
				$(parent.selectedDetails.selectedCheckBox).attr('value',"New/Edit("+commentList.length+")");
			} else if($(parent.selectedDetails.selectedCheckBox).hasClass('k-revision-comment')) {
				var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
				$(parent.selectedDetails.selectedCheckBox).closest("tr").find('.k-internal-comment')
				.attr('value',"New/Edit("+commentList.length+")");
				$(parent.revisionInterCommentButton).attr('value',"New/Edit("+commentList.length+")");
			}
		} else {
			filteredcommentData= setInternalCommentToRouteObject(grid,parent.selectedDetails.changedRouteData[0]);
			var commentList = $.grep(filteredcommentData, function(obj) {
				return (obj["commentTypeCd"].type == 0);
			});
			$(parent.revisionInterCommentButton).attr('value',"New/Edit("+commentList.length+")");
		}
		setLastInternalComment(filteredcommentData);
	}
}

function setInternalCommentToRouteObject(grid,routeData) {
	var commentData = grid.dataSource.data();
	var filteredcommentData = new Array();
	for (var i =0; i <commentData.length; i++) {
		commentData[i].createTmstp = Date.parse(commentData[i].createTmstp);
		if (commentData[i].commentDesc != null && commentData[i].commentDesc != '' && commentData[i].commentDesc != undefined ) {
			filteredcommentData.push(commentData[i]);
		}
	}
	routeData.COMMENTS = JSON.stringify(filteredcommentData, replacer);
	return filteredcommentData;
}

function setLastInternalComment(filteredcommentData) {
	if (parent.revisionInterCommentButton != undefined) {
		var commentList = $.grep(filteredcommentData, function(obj) {
			return (obj["commentTypeCd"].type == 0);
		});
		if (commentList.length>0) {
			commentList.sort(function(x, y){
				return x.createTmstp - y.createTmstp;
			});
			var commentObject = commentList[commentList.length-1];
			(parent.getDashboardContentWindow(parent.DASHBOARD_ID_REVISION_COMMENTS)).$('#internalComment').val(commentObject["commentDesc"]);
		} else {
			(parent.getDashboardContentWindow(parent.DASHBOARD_ID_REVISION_COMMENTS)).$('#internalComment').val("");
		}
		parent.revisionInterCommentButton = undefined;
	}
}

function cancelComments() {
	var grid = $(HASH_STRING+gridId).data("kendoGrid");
	if (parent.dashboardController.getDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS) != undefined) {
		parent.dashboardController.closeDashboard(parent.DASHBOARD_ID_INTERNAL_COMMENTS);
		var commentData = grid.dataSource.data();
		var filteredcommentData = new Array();
		for (var i =0; i <commentData.length; i++) {
			commentData[i].createTmstp = Date.parse(commentData[i].createTmstp);
			if (commentData[i].EDITABLE  == undefined) {
				filteredcommentData.push(commentData[i]);
			}
		}
		if ( $(parent.selectedDetails.selectedCheckBox) != null &&  $(parent.selectedDetails.selectedCheckBox).length >0) {
			var currentTR = $(parent.selectedDetails.selectedCheckBox).closest("tr");
			var dashboard = parent.getDashboardContentWindow(parent.selectedDetails.dashboardID);
			var routeGrid = dashboard.$("#"+parent.selectedDetails.grid_id).data("kendoGrid");
			var routeData = routeGrid.dataItem(currentTR);
			routeData.COMMENTS = JSON.stringify(filteredcommentData, replacer);
		} else {
			parent.selectedDetails.changedRouteData[0].COMMENTS  = JSON.stringify(filteredcommentData, replacer);
		}
		setLastInternalComment(filteredcommentData);
		//parent.currentSelectedRouteComment = routeData;
		//refreshhRouteEditorDashBoard();
	}

}

function scrollToSelectedRow(grid) {
    grid.element.find(".k-grid-content").animate({
        scrollTop: grid.tbody.height()
    }, 1);
}
function printPage() {
	 var w = parent.open();
    
	// var w= window;
     var html = "<!DOCTYPE HTML>";
       html += '<html lang="en-us">';
       html += '<head><style></style></head>';
       html += "<body>";
       var grid = $(HASH_STRING+gridId).data("kendoGrid");
       var table ="<table border='1' cellspacing='0' cellpadding='0' style='width=100%;'><tr><th width='50%'>Comments</th><th width='20%'>Created By</th><th wisth='30%'>Created Date/Time</th></tr>";
       var tableRows ="";
       var commentData = grid.dataSource.data();
       for (var i =0; i <commentData.length; i++) {
    	   var tableRows =tableRows + "<tr><td>"+commentData[i].commentDesc +"</td><td>" +commentData[i].createUserNm +"</td><td>"+ commentData[i].createTmstp+"</td></tr>";
		}
       if (tableRows != "") {
    	   html = html + table +tableRows+"</table>";
       }
       html += "</body>";
       w.document.write(html);
       w.window.print();
       w.document.close();
}