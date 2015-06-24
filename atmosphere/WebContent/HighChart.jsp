
<html>
<head>
  <script type="text/javascript" src="js/jquery-1.9.0.js"></script>
    <script type="text/javascript" src="js/jquery.atmosphere.js"></script>
    <script type="text/javascript" src="http://code.highcharts.com/stock/highstock.js"></script>
    <script src="theme.js"></script>
<body unload="disconnect()"> 
<div id="container" style="min-width: 310px; height: 800px; margin: 0 auto"></div>
<div width="100%" height="100%" id="marqueediv" align="center" ><div><div width="100%" height="100%" id="info" align="center" ><div>
<script type="text/javascript">
var socket=null;
var subSocket=null;
$( window ).unload(function() { 
		socket.unsubscribe();
		subSocket = null;
		alert("11");
		
	});
$(document).ready(function() {


//var obj = JSON.parse( '[{"carePacks":[{"businessCode":"J1PS","description":"HP 1"}],"coveragePeriod":12},{"carePacks": [{"businessCode":"J1PS","description":"HPs"}],"coveragePeriod":13}]');
//alert(obj);

var chart = new Highcharts.Chart({
				chart: {
				animation:false,
				renderTo: 'container',
				ignoreHiddenSeries : false
				},

				xAxis: {
				},
plotOptions: {
    line: {
        marker: {
            enabled: false
        }
    },
    series: {
    	         animation: false
    	     }

},
				series: [{
data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
}, {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
},
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
}
,
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
}
,
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
},{
data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
}, {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
},
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
}
,
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
}
,
 {
data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
}
]
				});
	socket = $.atmosphere;
	var wsUri ='http://'+ document.location.host+'/jmstest/alerts';
	//alert(" wsUri :"+wsUri);
	var request = { url :wsUri  , transport: 'websocket',LogLevel:'debug'};
	 subSocket = socket.subscribe(request);
	var c=0;
	var counter=0;
	socket.onMessage = function(response) {
	//alert ("chart.series :"+chart.series.length);
		if (response.status == 200) {
			var dataCounter=0;
			var data = response.responseBody;
			//alert(" data -:"+data[0]);
			var jsobj=JSON.parse(data);
			
			for(var i =0; i < jsobj.length; i++ ){
			//chart.series[i].addPoint(jsobj[i].data, false, true, false);
			//chart.series[i].addPoint(jsobj[i].data[0], false, true, false);
			//chart.series[i].addPoint(jsobj[i].data[1], false, true, false);
			
			for(var j =0; j < jsobj[i].data.length; j++ ){
			dataCounter=j;
			chart.series[i].addPoint(jsobj[i].data[j], false, true, false);
			}
			}
			//if (c > 15)
			//{
				chart.redraw();
			//	c = 0;
			//}
			//else
			//{
			//	c = c + 1;
			//}
			var marqElement = document.getElementById("marqueediv");
			marqElement.innerHTML = 'counter:'+counter+"&nbsp;"+'data counter :'+dataCounter;
			counter++;
			
			
		}
	};
	socket.onError=function(response){
	var info = document.getElementById("info");
	info.innerHTML=info.innerHTML+" error :"+response;
	}
	socket.onReconnect=function(req,res){
	var info = document.getElementById("info");
		info.innerHTML=info.innerHTML+" onreconnect :"+req +"res :"+res;
	};
	socket.onClientTimeout=function(response){
	var info = document.getElementById("info");
		info.innerHTML=info.innerHTML+" onClientTimeout :"+response;
	};
	
	socket.onTransportFailure = function(errorMsg, request) {
		request.fallbackTransport = "long-polling";
		var marqElement = document.getElementById("marqueediv");
		marqElement.innerHTML = "asdfasdfasdfasdfasdfa asdfdasfas dfasdf asdf asdf asf asfasd";
	};	
	
	
	
	
});
</script>
</body>
</head>
</html>