
<html>
<head>
    <script type="text/javascript" src="http://localhost:8080/atmosphere/js/jquery-1.9.0.js"></script>
    <script type="text/javascript" src="http://localhost:8080/atmosphere/js/jquery.form.js"></script>
    <script type="text/javascript" src="http://localhost:8080/atmosphere/js/jquery.atmosphere.js"></script>
<body> 
<div width="100%" height="100%" id="marqueediv" align="center" ><h3 style="color: #FF0000 "><marquee scrollamount="8" width="500" id="mar"></marquee></h3><div>
<script type="text/javascript">
$(document).ready(function() {
	var counter=0;
	var socket = $.atmosphere;
	var wsUri = document.location.toString()+'alerts';
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
		marqElement.innerHTML = "asdfasdfasdfasdfasdfa asdfdasfas dfasdf asdf asdf asf asfasd";
	};	
	
	
	
	function disconnect() {
		socket.unsubscribe();
		subSocket = null;
	}
});
</script>
</body>
</head>
</html>