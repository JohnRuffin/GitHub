var OUTPUT_TYPE_JSON = "json";
var PROGRESS_WINDOW_TITLE_DEFAULT = "Please Wait...";

var progressDialog;
var progressDialogTitle = PROGRESS_WINDOW_TITLE_DEFAULT;
var requestCount = [];
//var serviceRequestTimer;
var progressDialogTimer; /* url, successCallback, showProgressWindow, failureCallback, outputType, progressDialogTitle, progressDialogDiv */

function callService(params) {
    if (!params.url) {
        alert('url not found');
        return;
    }

    //show progress window if there is no property or if its set to true, 
    //in other words do not show progress window if the showProgressWindow flag is false
    if (!params.hasOwnProperty('showProgressWindow') || params.showProgressWindow) {
        if (!params.progressDialogTitle) {
            params.progressDialogTitle = PROGRESS_WINDOW_TITLE_DEFAULT;
        }

        showProgressDialog(true, params.progressDialogTitle, params.progressDialogDiv);
    }


    if (!params.outputType) {
        params.outputType = OUTPUT_TYPE_JSON;
    }

    if (!params.failureCallback) {
        params.failureCallback = this.serviceRequestFailed;
    }

    if (params.paramsMap == undefined) {
        params.paramsMap = {};
    }
    params.paramsMap["rand"] = getTime();    
    params.paramsMap["uniqueRequestId"] = getUniqueId();
    params.paramsMap["effDayPatternStr"] = parent.getSelectedEffDayStrPattern();    
    var uniqueRequestId = params.paramsMap["uniqueRequestId"]; 
    var isLoggerActive = params.paramsMap["isLoggerActive"] || params.paramsMap["isLoggerActive"] == undefined;
    if(isLoggerActive){
    	LoggerUtils.trace("Starting new request with requestId = ["+params.paramsMap["uniqueRequestId"]+"]");
    }
	
    $.post(params.url, params.paramsMap, function(response,io) {
    	var serverRequestTime = params.paramsMap.rand;
    	var serverResponseTime = getTime();
    	if(isLoggerActive){
    		logCallProcessingTime(params, serverRequestTime, serverResponseTime, true, true);
    	} 
    	params.successCallback(response, io, this);    	
    	if(isLoggerActive){
    		logCallProcessingTime(params, serverResponseTime, getTime(), false, true );
    	}    	
    	if(isLoggerActive){
    		LoggerUtils.trace("Completed processing the request with requestId ["+uniqueRequestId+"]");
    	}    	
    }, params.outputType).fail(function(response, io) {
    	var serverRequestTime = params.paramsMap.rand;
    	var serverResponseTime = getTime();
    	if(isLoggerActive){
    		logCallProcessingTime(params, serverRequestTime, serverResponseTime, true, false);
    	}    	
        response.successCallback = params.successCallback;
        response.dataType = params.paramsMap.dataType != undefined ? params.paramsMap.dataType : params.paramsMap.datatype;
        //adding the call back handler to response for future reference..
        params.failureCallback(response, io);
        if(isLoggerActive){
        	logCallProcessingTime(params, serverResponseTime, getTime(), false, false );
    	}
        if(isLoggerActive){
        	LoggerUtils.trace("Completed processing the request with requestId ["+uniqueRequestId+"]");
        }        
    });   
}

function getUniqueId(prefix) {
    var d = new Date().getTime();
    d += (parseInt(Math.random() * 100)).toString();
    if (undefined === prefix) {
        prefix = 'pegasus-request-id-'+parent.getBrowserSessionId();
    }
    d = prefix + d;
    return d;
};


function logCallProcessingTime(params, startTime, endTime, serverProcessFlag, successFlag) {
	var processText = "";
	if (params.progressDialogTitle && params.progressDialogTitle.toLowerCase() != PROGRESS_WINDOW_TITLE_DEFAULT.toLowerCase()) {
		processText = params.progressDialogTitle;
	}
	var paramString = JSON.stringify(params.paramsMap).replace(/\\/g, '');
	var details = "Request [" + params.url + "] with params [" + paramString + "];";
	logProcessingTime(startTime, endTime, serverProcessFlag, successFlag, processText, details);
}

function logProcessingTime(startTime, endTime, serverProcessFlag, successFlag, processText, processDetails) {
	var timeTaken = (endTime - startTime) / 1000;
	var logMessage = "";
	if (successFlag) {
		logMessage = "Successful";
	} else {
		logMessage = "Failure";
	}
	if (serverProcessFlag) {
		logMessage = logMessage + " Server Request Processing";
	} else {
		logMessage = logMessage + " Client Response Rendering";
	}
	if (processText && processText.length > 0) {
		logMessage = logMessage + " (" + processText + ")";
	}
	logMessage = logMessage + " took " + timeTaken + " seconds";
	if (processDetails && processDetails.length > 0) {
		logMessage = logMessage + " - " + processDetails;
	}
	LoggerUtils.trace(logMessage);
}

function serviceRequestFailed(response, io) {
    requestCount.pop();
    //by default call the method on parent
    parent.onServiceRequestFailure(response, io);
}

function showProgressDialog(isShow, message, progressDialogDiv) {
    if (message) {
        updateProgressDialogTitle(message);
    }

    if (!progressDialog) {
        createProgressDialog(progressDialogDiv);
    }

    if (isShow) {
        if (progressDialog.isClosed) {
            progressDialog.data("kendoWindow").open();
        }
        //some times..there is an error while showing the popup...
        //progressDialog.data("kendoWindow").toFront();
        if(progressDialog.data("kendoWindow") != undefined){
            progressDialog.data("kendoWindow").center();
        }
        progressDialog.isClosed = false;

        requestCount.push(Math.random());
    } else {
        //$("#mapOptions").css("z-index", 12000);
        closeProgressDialog();
    }
}


function bindOpenEvent(callbackMethod) {
    var dialog;
    if (progressDialog != undefined) {
        dialog = progressDialog.data("kendoWindow");
        dialog.bind("open", callbackMethod);
    }
}

function unbindOpenEvent(callbackMethod) {
    var dialog;
    if (progressDialog != undefined) {
        dialog = progressDialog.data("kendoWindow");
        dialog.unbind("open", callbackMethod);
    }
}

var dialog = $("#dialog").data("kendoWindow");


function getOpenRequestCount() {
    return requestCount.length;
}

function closeProgressDialog() {
    if (requestCount.length > 0) {
        requestCount.pop();
    }
    if (progressDialogTimer) {
        clearTimeout(progressDialogTimer);
    }
    progressDialogTimer = setTimeout(function() {
        closeProgressDialogWindow();
    }, 100);
}

function closeProgressDialogWindow() {
    if (progressDialog != null && progressDialog.data("kendoWindow")) {
        if (requestCount.length == 0) {
            progressDialog.data("kendoWindow").close();
            progressDialog.isClosed = true;
        }
    }
}

function updateProgressDialogTitle(title) {
    if (!title) {
        title = PROGRESS_WINDOW_TITLE_DEFAULT;
    }
    progressDialogTitle = title;

    if (progressDialog) {
        var progressDialogWindow = progressDialog.data("kendoWindow");
        if (progressDialogWindow) {
            progressDialogWindow.title(title);
            // progressDialog.parent().css({"width": getProgressWindowWidth(title)+"px"});
            // progressDialog.parent().find('.k-window-content').css({"width": getProgressWindowWidth(title)+"px"});
            progressDialogWindow.center();
        }
    }

}

function createProgressDialog(progressDialogDiv) {
    if (progressDialog) {
        return;
    }

    if (!progressDialogDiv) {
        progressDialogDiv = "progressDialogDiv";
    }

    progressDialog = $("#" + progressDialogDiv).kendoWindow({
        width: "200px",
        //chnage to calculate dynamically based on text length
        height: "40px",
        minHeight: "40px",
        modal: true,
        resizable: false,
        actions: [],
        title: progressDialogTitle,
        open: function() {
            $("#header").css("z-index", "9000");
            $("#footer").css("z-index", "9000");
            $(progressDialog).parent(".k-window").css("z-index", "20000");
        },
        close: function(e) {
            //clear the request count map... 
            requestCount = [];
            progressDialog.isClosed = true;
            $("#header").css("z-index", "30000");
            $("#footer").css("z-index", "30000");
            $(progressDialog).parent(".k-window").css("z-index", "10000");
        }
    });

    progressDialog.parent().find('.k-window-title').css({
        "margin-left": "5px"
    });
    $(progressDialog).parent(".k-window").css({
        "z-index": "20000",
        "overflow": "hidden"
    });
    progressDialog.data("kendoWindow").content('<img style="display: block;margin: auto;" src="pegasus/assets/icons/fedex_loading.gif" />');

    progressDialog.css({
        "overflow": "hidden",
        "padding": "0px"
    });
    progressDialog.parent().find(".k-window-action").css("visibility", "hidden");

    return progressDialog;
}

function getProgressWindowWidth(text) {
    var len = parent.VIEWER.getTextLength(text);
    if (len < 238) {
        len = 238;
    } else {
        len += 50;
    }

    return len;
}

function getProgressDialog() {
    return progressDialog;
}