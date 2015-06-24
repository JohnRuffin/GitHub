
<html>
<head>
    <script type="text/javascript" src="js/jquery-1.9.0.js"></script>
    
    <script type="text/javascript" src="js/jquery.atmosphere.js"></script>
<body> 
<input type="text" id="input" />
<div width="100%" height="100%" id="marqueediv" align="center" ><div>
<script type="text/javascript">
$(document).ready(function() {
	var counter=0;
	var socketAck = $.atmosphere;
	var wsUriAck ='http://'+ document.location.host+'/jmstest/alerts';
	var requestAck = { url :wsUriAck  , transport: 'websocket',logLevel:'debug'};
	var subsocketAck = socketAck.subscribe(requestAck);
	
	$('#input').keydown(function(e) {
	        if (e.keyCode === 13) {
	            var msg = $(this).val();
		   subsocketAck.push(msg);
	            $(this).val('');
	
	           
	        }
	    });

	socketAck.onMessage = function(response) {
	
		if (response.status == 200) {
		
			var data = response.responseBody;
			if(data.indexOf("ACK:")>=0 || data.indexOf("DISABLE:")>=0||data.indexOf("ENABLE:")>=0){
			var marqElement = document.getElementById("marqueediv");
			marqElement.innerHTML = marqElement.innerHTML +'msg :'+ data+"&nbsp;&#13;";
			}
			
			
		}
	};
	
	socketAck.onTransportFailure = function(errorMsg, request) {
		request.fallbackTransport = "long-polling";
		marqElement.innerHTML = "asdfasdfasdfasdfasdfa asdfdasfas dfasdf asdf asdf asf asfasd";
	};	
	
	
	
	function disconnect() {
		socketAck.unsubscribe();
		subsocketAck = null;
	}
});
</script>
</body>
</head>
</html>