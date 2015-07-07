/*eslint-env browser, jquery */
/*eslint camelcase:1, no-unused-vars:1, no-undef:1, no-console:0, no-extend-native:0 */

function isDefined(obj) {
	"use strict";
	return obj && obj !== "null" && obj !== "undefined";
}

/*
	getHeight
		returns the current height of the browser's content area
 */

/* global self */
function getHeight() {
	"use strict";
	if (self.innerHeight) {
		return self.innerHeight;
	}
	if (document.documentElement && document.documentElement.clientHeight) {
		return document.documentElement.clientHeight;
	}
	if (document.body) {
		return document.body.clientHeight;
	}
}

/*
	getHeight2
		more compact, less readable version of getHeight()
 */
function getHeight2() {
	"use strict";
	return window.innerHeight || document.documentElement.clientHeight
		|| document.body.clientHeight;
}

function addClassToList(classList, clazz) {
	"use strict";
	var classes = classList.split(" ");
	var index = classes.indexOf(clazz);
	if (index === -1) {
		classes.push(clazz);
	}
	return classes.join(" ");
}

function removeClassFromList(classList, clazz) {
	"use strict";
	var classes = classList.split(" ");
	var index = classes.indexOf(clazz);
	if (index > -1) {
		classes.splice(index, 1);
	}
	return classes.join(" ");
}

function classListContains(classList, clazz) {
	"use strict";
	var found = false;
	if (isDefined(classList)) {
		var classes = classList.split(" ");
		classes.forEach(function(classEntry) {
			if (classEntry === clazz) {
				found = true;
				return;
			}
		});
	}
	return found;
}

function hhmmToMins(hhmm) {
	"use strict";
	var ary = hhmm.split(":");
	if (ary.length === 1) {
		return Number(ary[0]);
	} else if (ary.length === 2) {
		return Number(ary[0]) * 60 + Number(ary[1]);
	} else {
		console.log("ary.length: " + ary.length);
	}
}

function ddhhmmToMins(ddhhmm) {
	"use strict";
	var days = ddhhmm.split("d")[0];
	var hhmm = ddhhmm.split(" ")[1];
	return Number(days) * 24 * 60 + hhmmToMins(hhmm);
}

function convertToMinutes(time) {
	"use strict";
	var hhmmRegex = /^(\d+):([0-5]\d)/i;
	if (hhmmRegex.test(time)) {
		return hhmmToMins(time);
	}
	var ddhhmmRegex = /^(\d+)d\s([0-2]?\d):([0-5]\d)/i;
	if (ddhhmmRegex.test(time)) {
		return ddhhmmToMins(time);
	}
	return -1;
}

var PROGRESS_WINDOW_TITLE_DEFAULT = "Please Wait...";
var progressDialog;
var progressDialogTitle = PROGRESS_WINDOW_TITLE_DEFAULT;
var requestCount = [];
var progressDialogTimer;

function closeProgressDialogWindow() {
    "use strict";
    if (progressDialog != null && progressDialog.data("kendoWindow")) {
        if (requestCount.length === 0) {
            progressDialog.data("kendoWindow").close();
            progressDialog.isClosed = true;
        }
    }
}

function closeProgressDialog() {
    "use strict";
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

function updateProgressDialogTitle(title) {
    "use strict";
    if (!title) {
        title = PROGRESS_WINDOW_TITLE_DEFAULT;
    }
    progressDialogTitle = title;

    if (progressDialog) {
        var progressDialogWindow = progressDialog.data("kendoWindow");
        if (progressDialogWindow) {
            progressDialogWindow.title(title);
            progressDialogWindow.center();
        }
    }

}

/* global isPrototype */
function createProgressDialog(progressDialogDiv) {
    "use strict";
    if (progressDialog) {
        return;
    }

    if (!progressDialogDiv) {
        progressDialogDiv = "progressDialogDiv";
    }

    progressDialog = $("#" + progressDialogDiv).kendoWindow({
        width: "200px",
        height: "80px",
        modal: true,
        resizable: false,
        actions: [],
        title: progressDialogTitle,
        // content: "progress.html",
        open: function() {
            $("#header").css("z-index", "9000");
            $("#footer").css("z-index", "9000");
            $(progressDialog).parent(".k-window").css("z-index", "20000");
        },
        close: function() {
            //clear the request count map...
            requestCount = [];
            progressDialog.isClosed = true;
            $("#header").css("z-index", "30000");
            $("#footer").css("z-index", "30000");
            $(progressDialog).parent(".k-window").css("z-index", "10000");
        }
    });

    progressDialog.parent().find(".k-window-title").css({
        "margin-left": "5px"
    });
    $(progressDialog).parent(".k-window").css({
        "z-index": "20000",
        "overflow": "hidden"
    });
    // progressDialog.data("kendoWindow").content('<img width="100%" height="100%" src="pegasus/assets/icons/fedex_loading_air.gif" />');
    if (isPrototype) {
        progressDialog.data("kendoWindow").content("<div align=\"center\"><img width=\"60px\" height=\"60px\" src=\"assets/itrs/airplane_takeoff-512x512.png\"></div>");
    } else {
        progressDialog.data("kendoWindow").content("<div align=\"center\"><img width=\"60px\" height=\"60px\" src=\"pegasus/assets/itrs/airplane_takeoff-512x512.png\"></div>");
    }
    progressDialog.css({
        "overflow": "hidden",
        "padding": "10px"
    });
    progressDialog.parent().find(".k-window-action").css("visibility", "hidden");

    // return progressDialog;
}

/* exported showProgressDialog */
function showProgressDialog(isShow, message, progressDialogDiv) {
    "use strict";
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

        progressDialog.data("kendoWindow").center();
        progressDialog.isClosed = false;

        requestCount.push(Math.random());
    } else {
        closeProgressDialog();
    }
}

String.prototype.paddingLeft = function(paddingValue) {
    "use strict";
    return String(paddingValue + this).slice(-paddingValue.length);
};

String.prototype.paddingRight = function(paddingValue) {
    "use strict";
    return String(this + paddingValue).slice(paddingValue.length);
};

/* Export functions that are meant to be shared */
this.isDefined = isDefined;
this.getHeight = getHeight;
this.getHeight2 = getHeight2;
this.addClassToList = addClassToList;
this.removeClassFromList = removeClassFromList;
this.classListContains = classListContains;
this.convertToMinutes = convertToMinutes;
this.showProgressDialog = showProgressDialog;
