var p = [];
var acknowledge = [];
var pmuStatus = {};
var pmuSelectionStatus = {};
var acknowledgmentGrid;
var configurationGrid;
var count = 0;
var socket = $.atmosphere;
var wsUri ='http://'+ document.location.host+'/jmstest/alerts';
var request = { url :wsUri  , transport: 'websocket'};
var subSocket = socket.subscribe(request);
function initializeWebsocket(){
	
	var obj;

	var DataPointNum = 900;
	var upper_threshold = 55;
	var lower_threshold = 45;
	var num_of_series =2;
	var series = [];
	var allAlarmSeriesData = [];
	var seriesName;
	var time;
	var previousAlarmData = {};
	createSeries(num_of_series);
	socket.onMessage = function(response)
	{
		if (response.status == 200)
		{
			series = [];
			allAlarmSeriesData = [];
			allAlarmSeriesDataMap = {};
			var cloneNode;
			var enableDisable=0;
			if(response.responseBody.indexOf("ACK:") >=0){
				console.log("Acknowledge received");
				enableDisable=1;
				return acknowledgeReceivedHandler(response.responseBody, enableDisable);
			}else if(response.responseBody.indexOf("ENABLE:") >=0){
				console.log("Enabled received");
				enableDisable=1;
				return alarmConfigurationReceivedHandler(response.responseBody, enableDisable);
			}else if(response.responseBody.indexOf("DISABLE:") >=0){
				console.log("Disabled received");
				enableDisable=0;
				return disableAlarmConfigurationReceivedHandler(response.responseBody, enableDisable);
			}
			obj = JSON.parse(response.responseBody);
			
			time = new Date();
			for (var i = 0; i< num_of_series; i++)
			{
				seriesName = obj[i].name
				var nodeData;
				for (var j = 0; j<1; j++)
				{

					p[i] = p[i] + 0.004*(obj[i].data[j]-500);
					if (p[i] > upper_threshold+5)
					{
						p[i] = upper_threshold+5;
					}
					if (p[i]<lower_threshold-5)
					{
						p[i] = lower_threshold -5;
					}
					nodeData = {"id": count++,
						"seriesName":obj[i].name,
						"isAcknowledge": 0,
						"region":"Eastern",
						"state":"West Bengal",
						"pmu":"Kirkland",
						"measurement":"Web Designer",
						"date":time,
						"value":p[i],
						"priority":3,
						"isEnabled": "Yes",
						"isAcknowledgeStatus":"No"
					};
					
					//if(acknowledge[nodeData.seriesName] == 0 || acknowledge[nodeData.seriesName] == undefined){
						if (p[i] < lower_threshold || p[i] > upper_threshold)
						{
							if(isSelectAll("#acknowledgeAll")){
								nodeData["isAcknowledge"] = 1;
							}
							if(previousAlarmData[seriesName] == undefined){
								previousAlarmData[seriesName] = nodeData.value;
								series.push($.extend( {}, nodeData ));
								if(acknowledgmentGrid != undefined)
									acknowledgmentGrid.dataSource.add($.extend( {}, nodeData ));
							}	
						}else if (p[i] > lower_threshold || p[i] < upper_threshold)
						{
							if(isSelectAll("#acknowledgeAll")){
								nodeData["isAcknowledge"] = 1;
							}
							if(previousAlarmData[seriesName] != undefined && ( previousAlarmData[seriesName] < lower_threshold || previousAlarmData[seriesName] > upper_threshold) ){
								nodeData.value = previousAlarmData[seriesName];
								series.push($.extend( {}, nodeData ));
								if(acknowledgmentGrid != undefined)
									acknowledgmentGrid.dataSource.add($.extend( {}, nodeData ));
									
								previousAlarmData[seriesName] = undefined;
							}
						}
					
					//}
					
					if(isSelectAll("#enableAll")){
						nodeData["isAcknowledge"] = 1;
					}
					if(pmuStatus[nodeData.seriesName] == 1 || pmuStatus[nodeData.seriesName] == undefined){
						nodeData.isEnabled = "Yes"
					}else{
						nodeData.isEnabled = "No";
					}
					cloneNode = $.extend( {}, nodeData );
					allAlarmSeriesData.push(cloneNode);
					allAlarmSeriesDataMap[cloneNode.seriesName] = cloneNode;
				}
			}

			if(acknowledgmentGrid==undefined){
				acknowledgmentGrid = initializeGrid("#acknowledgmentGrid", "#acknowledgment", series);
				configurationGrid = initializeGrid("#configurationGrid", "#configuration", allAlarmSeriesData);
			}else {
				//acknowledgment grid
				//acknowledgmentGrid.dataSource.data( $.merge( series, acknowledgmentGrid.dataSource._data ));	

				//configuration grid...
				updateConfigurationGrid(allAlarmSeriesDataMap);				
			}
		}
	}
}

function updateConfigurationGrid(allAlarmSeriesDataMap){
	var _data = configurationGrid.dataSource.data();
	if(_data != undefined){
		var node;
		for(var i=0; i<_data.length; i++){
			node = allAlarmSeriesDataMap[_data[i].seriesName];
			_data[i].value = node.value;
			_data[i].isEnabled = node.isEnabled;
		}
		configurationGrid.refresh();
	}
}

function createSeries(n) {

	var time = (new Date()).getTime();
	var lines = [];
	var upperlines = [];
	var lowerlines = [];

	for (var ii = 0; ii< n; ii++){
		p.push(50);
	}
}

function initializeTabStripAndGrid(){
	$("#tabstrip").kendoTabStrip({
		animation:  {
			open: {
				effects: "fadeIn"
			}
		}
	});
}

function initializeGrid(gridId, textarea, _dataSource){
	var grid = $(gridId).kendoGrid({
		dataSource: {
			change: function(){
			 // $(textarea).val(JSON.stringify(this.data(), true));
			},
			data: (_dataSource=== undefined?data:_dataSource),
			schema: {
				model: {
					id:"id",
					fields: {
						isAcknowledge:{type:"bool"},
						region: { type: "string" },
						state: { type: "string" },
						pmu: { type: "string" },
						measurement: { type: "string" },
						value: { type: "number" },
						priority: { type: "number" },
						date: { type: "date" },
						isEnabled: {type: "string"},
						isAcknowledgeStatus: {type: "string"}
					}
				}
			},
			 pageSize: 10
		},
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 10
		},
		autoBind: true,
		sortable: true,
		reorderable: true,
        resizable: true,
		scrollable: {
			virtual: true
		},
		groupable: true,
		filterable: true,
		selectable: "multiple/rows",
		dataBound: function(e){
			var grid = this;
			var dataSource = this.dataSource;
		},
		change:function(){
			var grid = this;

		},
		columns: (gridId === "#acknowledgmentGrid")? getAlarmColumns():getConfigurationColumns()
	}).data("kendoGrid");

	grid.tbody.on("change", ".ob-paid", function (e) {
	  var row = $(e.target).closest("tr");
	  var item = grid.dataItem(row);
	  item.set("isAcknowledge", $(e.target).is(":checked") ? 1 : 0);
	});

	{
		grid.dataSource.read();
	}

	return grid;
}

function getConfigurationColumns(){
	return [
			{
			  title:"Select",
			  field:"isAcknowledge",
			  template: "<input name='isAcknowledge' class='ob-paid' type='checkbox' data-bind='checked: isAcknowledge' #= isAcknowledge ? checked='checked' : '' #/>",
			  width: 85
			},
			{
				field: "region",
				title: "Region",
				width: 100
			},
			{
				field: "state",
				title: "State",
				width: 150
			},
			{
				field: "seriesName",
				title: "PMU",
				width: 150
			},
			{
				field: "measurement",
				title: "Measurement",
				width: 150
			},
			{
				field: "value",
				title: "Value",
				width: 200
			},
			{
				field: "priority",
				title: "Priority",
				width: 85
			},
			{
				field: "date",
				title: "Date",
				template: '#= kendo.toString(date,"MM/dd/yyyy HH:mm:ss.sss") #'
			},
			{
			  title:"Is Enabled?",
			  field:"isEnabled",			  
			  width: 130
			}
		];
	
}

function getAlarmColumns(){
	return [
			{
			  title:"Select",
			  field:"isAcknowledge",
			  template: "<input name='isAcknowledge' class='ob-paid' type='checkbox' data-bind='checked: isAcknowledge' #= isAcknowledge ? checked='checked' : '' #/>",
			  width: 85
			},
			{
				field: "region",
				title: "Region",
				width: 100
			},
			{
				field: "state",
				title: "State",
				width: 150
			},
			{
				field: "seriesName",
				title: "PMU",
				width: 150
			},
			{
				field: "measurement",
				title: "Measurement",
				width: 150
			},
			{
				field: "value",
				title: "Value",
				width: 200
			},
			{
				field: "priority",
				title: "Priority",
				width: 85
			},
			{
				field: "date",
				title: "Date",
				template: '#= kendo.toString(date,"MM/dd/yyyy HH:mm:ss.sss") #'
			},
			{
				field: "isAcknowledgeStatus",
				title: "Is Acknowledged?",
				width: 180
			}
		];
}

function parseFilterDates(filter, fields){
	if(filter.filters){
		for(var i = 0; i < filter.filters.length; i++){
			parseFilterDates(filter.filters[i], fields);
		}
	}
	else{
		if(fields[filter.field].type == "date"){
			filter.value = kendo.parseDate(filter.value);
		}
	}
}

function acknowledgeAllClickHandler() {
	processCheckboxHandler("#acknowledgeAll", "#acknowledgmentGrid", "isAcknowledge");
}

function enableAlarmAllClickHandler() {
	processCheckboxHandler("#enableAll", "#configurationGrid", "isAcknowledge");
}

function processCheckboxHandler(buttonId, divId, propertyName){
	if($(buttonId).text() == "Select All"){
		$(buttonId).text("Deselect All");
		updateMatrixCheckboxStates(divId, propertyName, true);
	}else {
		$(buttonId).text("Select All");
		updateMatrixCheckboxStates(divId, propertyName, false);
	}
}

function isSelectAll(buttonId){
	if($(buttonId).text() == "Select All"){
		return false;
	}

	return true;
}

function updateMatrixCheckboxStates(matrixId, propertyName, propertyValue) {
	var grid = $(matrixId).data("kendoGrid");
	var data = grid.dataSource.data();
	if(data != undefined){
		for(var i=0;i< data.length; i++){
			data[i][propertyName] = propertyValue;
		}
	}
	grid.refresh();
}

function acknowledgeHandler(){
	var _ackDataNodes = acknowledgmentGrid.dataSource.data();
	if(_ackDataNodes != undefined){
		var ackStr='ACK:';
		for(var i =0; i<_ackDataNodes.length; i++){
			if(_ackDataNodes[i].isAcknowledge == 1 && ackStr.indexOf(_ackDataNodes[i].seriesName) <= -1){
				ackStr = ackStr+_ackDataNodes[i].seriesName+","	
			}
		}
		console.log(ackStr);
		subSocket.push(ackStr);
	}
	
	if(isSelectAll("#acknowledgeAll")){
		$("#acknowledgeAll").text("Select All");
	}	
}

function acknowledgeReceivedHandler(responseBody, enableDisable){
	var seriesNamesStr = responseBody.substring(4);
	if(seriesNamesStr != undefined){
		var _ackDataNodes = acknowledgmentGrid.dataSource.data();
		var seriesNames = seriesNamesStr.split(",");		
		for(var j =_ackDataNodes.length-1; j>=0; j--){
			if(_ackDataNodes[j]!= undefined && seriesNames.indexOf( _ackDataNodes[j].seriesName) >=0 ){
				_ackDataNodes[j].isAcknowledgeStatus = "Yes"
				acknowledge[_ackDataNodes[j].seriesName]=enableDisable;
			}
		}	
		acknowledgmentGrid.refresh();
	}	
}

function enableAlarmConfigurationHandler(){
	var _ackDataNodes = configurationGrid.dataSource.data();
	if(_ackDataNodes != undefined){
		var ackStr='ENABLE:';
		for(var i =0; i<_ackDataNodes.length; i++){
			if(_ackDataNodes[i].isAcknowledge == 1 && ackStr.indexOf(_ackDataNodes[i].seriesName) <= -1){
				ackStr = ackStr+_ackDataNodes[i].seriesName+","					
			}
		}
		console.log(ackStr);
		subSocket.push(ackStr);
	}
	
	if(isSelectAll("#enableAll")){
		$("#enableAll").text("Select All");
	}
}

function alarmConfigurationReceivedHandler(responseBody, enableDisable){
	var seriesNamesStr = responseBody.substring(7);
	if(seriesNamesStr != undefined){
		var seriesNames = seriesNamesStr.split(",");		
		for(var j =seriesNames.length-1; j>=0; j--){
			if(seriesNames[j]!= undefined  ){
				pmuStatus[seriesNames[j]] = 1;
				acknowledge[seriesNames[j]]=enableDisable;
			}
		}	
		acknowledgmentGrid.refresh();
		configurationGrid.refresh();
	}	
}

function disableAlarmConfigurationHandler(){
	var _ackDataNodes = configurationGrid.dataSource.data();
	if(_ackDataNodes != undefined){
		var ackStr='DISABLE:';
		for(var i =0; i<_ackDataNodes.length; i++){
			if(_ackDataNodes[i].isAcknowledge == 1 && ackStr.indexOf(_ackDataNodes[i].seriesName) <= -1){
				ackStr = ackStr+_ackDataNodes[i].seriesName+","					
			}
		}
		console.log(ackStr);
		subSocket.push(ackStr);
	}
	
	if(isSelectAll("#enableAll")){
		$("#enableAll").text("Select All");
	}
}

function disableAlarmConfigurationReceivedHandler(responseBody, enableDisable){
	var seriesNamesStr = responseBody.substring(8);
	if(seriesNamesStr != undefined){
		var seriesNames = seriesNamesStr.split(",");		
		for(var j =seriesNames.length-1; j>=0; j--){
			if(seriesNames[j]!= undefined  ){
				pmuStatus[seriesNames[j]] = 0;
				acknowledge[seriesNames[j]]=enableDisable;
			}
		}
		acknowledgmentGrid.refresh();
		configurationGrid.refresh();		
	}	
}