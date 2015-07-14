<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Atmosphere Chat</title>
    <script type="text/javascript" src="jquery/jquery-2.0.3.js"></script>
    <script type="text/javascript" src="jquery/jquery.atmosphere.js"></script>
    <script type="text/javascript" src="jquery/application.js"></script>
    <style>
    * {font-family: tahoma; font-size: 12px; padding: 0px; margin: 0px;}
    p {line-height: 18px;}
    div {width: 500px; margin-left: auto; margin-right: auto;}
    #content {padding: 5px; background: #ddd; border-radius: 5px; border: 1px solid #CCC; margin-top: 10px;}
    #header {padding: 5px; background: #f5deb3; border-radius: 5px; border: 1px solid #CCC; margin-top: 10px;}
    #input {border-radius: 2px; border: 1px solid #ccc; margin-top: 10px; padding: 5px; width: 400px;}
    #status {width: 88px; display: block; float: left; margin-top: 15px;}
    </style>
</head>
<body>
    <div id="header"><h3>Atmosphere Chat. Default transport is SSE, fallback is long-polling</h3></div>
    <div id="content"></div>
    <div>
        <span id="status">Connecting...</span>
        <input type="text" id="input" disabled="disabled"/>
    </div>
</body>
</html>
