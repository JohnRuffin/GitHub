
<html>
<head>
    <script type="text/javascript" src="js/jquery-1.9.0.js"></script>
    <script type="text/javascript" src="js/jquery.atmosphere.js"></script>
<body> 
<script type="text/javascript">
$(document).ready(function() {
	var counter=0;
	var socket = $.atmosphere;
	var wsUri = document.location.toString()+'custom';
	alert(" wsUri :"+wsUri);
	var request = { url :wsUri  , transport: 'websocket', fallbackTransport: 'long-polling'};
	var subSocket = socket.subscribe(request);
	
	socket.onMessage = function(response) {
		if (response.status == 200) {
		
			var data = response.responseBody;
			//alert(" respnse :"+data);
			var marqElement = document.getElementById("marqueediv");
			var messagestr = "<message>";
			//var message = data.substring(data.indexOf(messagestr) + messagestr.length ,data.indexOf("</message"));
			marqElement.innerHTML = 'count :'+ counter+"&nbsp;";
			counter++;
			
		}
	};
	
	socket.onTransportFailure = function(errorMsg, request) {
		request.fallbackTransport = "long-polling";
		marqElement.innerHTML = "Inner HTML";
	};	
	
	
	
	function disconnect() {
		socket.unsubscribe();
		subSocket = null;
	}
});
</script>

<h1 id="marqueediv">  </h1>
</body>
</head>
</html>