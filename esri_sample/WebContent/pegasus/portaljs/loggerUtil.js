/**
 * 
 */
var LoggerUtils = (function() {
    var DATA_SERVLET_URL = "dataServlet/DataRendererServlet";
    this.loggerDataUrl;
    this.loggerDataUrl;
    this.log;

    function constructorFn() {

    };

    constructorFn.initialize = function(url) {
        this.loggerDataUrl = url;
        if (this.loggerDataUrl == undefined) {
            this.loggerDataUrl = DATA_SERVLET_URL + "?renderertype=com.spacetimeinsight.fedex.renderer.LoggerDataRenderer";
        }
        log4javascript.logLog.setQuietMode(true);
        this.log = log4javascript.getLogger();

        var ajaxAppender = new log4javascript.AjaxAppender(this.loggerDataUrl);
        ajaxAppender.setWaitForResponse(true);
        ajaxAppender.setLayout(new log4javascript.JsonLayout());
        ajaxAppender.setThreshold(log4javascript.Level.TRACE);
        ajaxAppender.setRequestSuccessCallback(this.loggerSuccessCallbackHandler);
        ajaxAppender.setFailCallback(this.loggerFailureCallbackHandler);
        
        this.log.addAppender(ajaxAppender);
        this.log.setLevel(log4javascript.Level.TRACE);       
    };

    constructorFn.loggerFailureCallbackHandler = function(response, io) {
        //console.log("Logged the message");
    };
    
    constructorFn.loggerSuccessCallbackHandler = function(response, io) {
        //console.log("Logged the message");
    };

    constructorFn.trace = function(message) {
        if (this.log == undefined) {
            this.initialize();
        }
        if (this.log != undefined) {
            this.log.trace(message);
        }
    };

    constructorFn.debug = function(message) {
        if (this.log == undefined) {
            this.initialize();
        }
        if (this.log != undefined) {
            this.log.debug(message);
        }
    };

    constructorFn.error = function(message) {
        if (this.log == undefined) {
            this.initialize();
        }
        if (this.log != undefined) {
            this.log.error(message);
        }
    };
    
    constructorFn.console = function(message) {        
        //console.log(message);
    };


    return constructorFn;
})();

/*
StopWatch.trace = function (response, io) {
		
};

StopWatch.prototype.currentTime = function () {
    return this.performance ? window.performance.now() : new Date().getTime();
};

StopWatch.prototype.start = function (currentLogName) {
	console.log("Started Executing: "+currentLogName);
	var currentLogName = currentLogName || 'Elapsed:';
	if(this.loggerMap[currentLogName] == undefined){
		this.loggerMap[currentLogName] = {};
	}
	this.loggerMap[currentLogName]["startTime"] = this.currentTime();
	this.loggerMap[currentLogName]["running"] = true;    
};

StopWatch.prototype.stop = function (name) {
	var currentLogName = name || 'Elapsed:';
	if(this.loggerMap[currentLogName] != undefined){
		this.loggerMap[currentLogName]["stopTime"] = this.currentTime();
		this.loggerMap[currentLogName]["running"] = false;    
	    this.printElapsed(name);
	}	
};

StopWatch.prototype.getElapsedMilliseconds = function (currentLogName) {
    if (this.loggerMap[currentLogName]["running"]) {
    	this.loggerMap[currentLogName]["stopTime"] = this.currentTime();
    }

    return this.loggerMap[currentLogName]["stopTime"] - this.loggerMap[currentLogName]["startTime"];
};

StopWatch.prototype.getElapsedSeconds = function (currentLogName) {
    return this.getElapsedMilliseconds(currentLogName) / 1000;
};

StopWatch.prototype.printElapsed = function (name) {
	var currentLogName = name || 'Elapsed:';

    console.log(currentLogName, '[' + this.getElapsedMilliseconds(currentLogName) + 'ms]', '[' + this.getElapsedSeconds(currentLogName) + 's]');
    delete this.loggerMap[currentLogName];
    console.log("Completed Executing: "+currentLogName);
};*/