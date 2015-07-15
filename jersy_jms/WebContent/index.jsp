<%@page import="javax.jms.*" %>
<%@page import="javax.naming.*" %>
<%@page import="com.spacetimeinsight.atmosphere.*" %>
 
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
	var request = { url :wsUri,
					transport: 'websocket',
					fallbackTransport: 'sse',
					contentType : "application/json"};
	var subSocket = socket.subscribe(request);
	
	
	socket.onMessage = function(response) {
		if (response.status == 200) {
		
			var data = response.responseBody;
			//alert(" respnse :"+data);
			var marqElement = document.getElementById("marqueediv");
			var messagestr = "<message>";			
			marqElement.innerHTML = 'count :'+ counter+"&nbsp;";
			counter++;
			console.log(data);
		}
	};
	
	socket.onTransportFailure = function(errorMsg, request) {
		request.fallbackTransport = "long-polling";
		marqElement.innerHTML = "Inner HTML";
		document.getElementById("protocol").innerHTML = "Protocol Using: SSE";
	};	
	
	
	
	function disconnect() {
		socket.unsubscribe();
		subSocket = null;
	}
	
	setTimeout(function(){
		subSocket.push(JSON.stringify({ author: 'Pegasus', message: 'Hello World!' }));
	}, 5000);
});
</script>

<h1 id="marqueediv">  </h1>
<h1 id="protocol">  </h1>
</body>
</head>
</html>