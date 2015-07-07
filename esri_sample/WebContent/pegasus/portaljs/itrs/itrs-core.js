/*eslint-env browser, jquery */
/*eslint camelcase:1, no-unused-vars:1, no-undef:1, no-console:0, dot-notation:1 */

var EMPTY_STRING = "";

// Declare some page-wide variables
var dataLoaded = false;
var loadedEqType = "";
var multiLine = false;
var lastItems, lastGroups, lastOptions; // , lastcontainer;
var timeline;
var hiddenGroups = new vis.DataSet();
var lastGndTmItems;
var lastLocationsGndTm;
var lastDurationGndTm;
var lastSelectedCaseId = null;
// var lastSelectedCaseNm = null;
var lastSelectedSchedId = null;
var lastSelectedSchedNm = null;

var isPrototype = false;
var snapshotMode = false;

var isCycleMode = false;

var lastSummaries = null;
// var summaryDetailPopUp = new SummaryDetailPopUp();

var lastTimeZone = null;
var validationFailed = false;

// These are initialized in document.ready()
var itemTemplates = [];
var tooltipTemplates = [];

// TODO Change this to reference commonCaseMap that's populated by Pegasus
var snapshotCaseList = [
	{	commonCaseId: "0x1a", commonCaseName: "JAN15FNL",
		commonCaseDesc: "JAN15FNL", planPeriod: "JAN15",
		planPerStartDtml: "2015-01-05-05:00", planPerEndDtml: "2015-02-02-04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true },
	{ 	commonCaseId: "0x2b", commonCaseName: "FEB15FNL", 
		commonCaseDesc: "FEB15FNL", planPeriod: "FEB15",
		planPerStartDtml: "2015-02-02-05:00", planPerEndDtml: "2015-03-02-04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true },
	{ 	commonCaseId: "0x3c", commonCaseName: "MAR15FNL", 
		commonCaseDesc: "MAR15FNL", planPeriod: "MAR15",
		planPerStartDtml: "2015-03-02-05:00", planPerEndDtml: "2015-03-30-04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL",allowed: true },
	{ 	commonCaseId: "0x4d", commonCaseName: "APR15PRE", 
		commonCaseDesc: "APR15PRE", planPeriod: "APR15",
		planPerStartDtml: "2015-03-30-05:00", planPerEndDtml: "2015-04-27-04:59",
		planPerDayQty: 28, season: "SPRING", caseType: "PRE", allowed: true }];

var jfsCaseList = [
	{	commonCaseId: "0x2f745a54000100007f05b0bb", commonCaseName: "FEB15FNL",
		commonCaseDesc: "FEB15FNL", planPeriod: "FEB15",
		planPerStartDtml: "2015-02-02-05:00", planPerEndDtml: "2015-03-02-04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true },
	{	commonCaseId: "0x9e4fac54000100007736b0bb", commonCaseName: "APR15PRE",
		commonCaseDesc: "APR15PRE", planPeriod: "APR15",
		planPerStartDtml: "2015-03-30-05:00", planPerEndDtml: "2015-04-27-04:59",
		planPerDayQty: 28, season: "SPRING", caseType: "PRE", allowed: true },
	{	commonCaseId: "0x561a1055000100000101454f", commonCaseName: "JUN15PRE",
		commonCaseDesc: "JUN15PRE", planPeriod: "JUN15",
		planPerStartDtml: "2015-06-01-05:00", planPerEndDtml: "2015-06-29-04:59",
		planPerDayQty: 28, season: "SPRING", caseType: "PRE", allowed: true },
	{	commonCaseId: "0xf75d3454000100008b35b0bb", commonCaseName: "JAN15FNL",
		commonCaseDesc: "JAN15FNL", planPeriod: "JAN15",
		planPerStartDtml: "2015-01-05-05:00", planPerEndDtml: "2015-02-02 04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true },
	{	commonCaseId: "0xfddb8c5400010000ba01b0bb", commonCaseName: "MAR15FNL",
		commonCaseDesc: "MAR15FNL", planPeriod: "MAR15",
		planPerStartDtml: "2015-03-02-05:00", planPerEndDtml: "2015-03-30 04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true }];

var prodOnDevCaseList = [
	{ 	commonCaseId: "0x1a1d0b55000100003960454f", commonCaseName: "FEB15ZVA",
		commonCaseDesc: "FEB15ZVA", planPeriod: "FEB15",
		planPerStartDtml: "2015-01-05-05:00", planPerEndDtml: "2015-02-02-04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "WIF", allowed: true },
	{	commonCaseId: "0x790ac95400010000386db0bb", commonCaseName: "MAY15PRE",
		commonCaseDesc: "MAY15PRE", planPeriod: "MAY15",
		planPerStartDtml: "2015-04-27-05:00", planPerEndDtml: "2015-06-01-04:59",
		planPerDayQty: 35, season: "SPRING", caseType: "PRE", allowed: true },
	{	commonCaseId: "0x9e4fac54000100007736b0bb", commonCaseName: "APR15FNL",
		commonCaseDesc: "APR15FNL", planPeriod: "APR15",
		planPerStartDtml: "2015-03-30-05:00", planPerEndDtml: "2015-04-27-04:59",
		planPerDayQty: 28, season: "SPRING", caseType: "FNL", allowed: true },
	{	commonCaseId: "0xb9eef55400010000431eb0bb", commonCaseName: "JUN15FNL",
		commonCaseDesc: "JUN15FNL", planPeriod: "JUN15",
		planPerStartDtml: "2015-06-01-05:00", planPerEndDtml: "2015-06-29-04:59",
		planPerDayQty: 28, season: "SPRING", caseType: "FNL", allowed: true },
	{	commonCaseId: "0xf41e0b55000100004831454f", commonCaseName: "JAN15ORG",
		commonCaseDesc: "JAN15ORG", planPeriod: "JAN15",
		planPerStartDtml: "2015-01-05-05:00", planPerEndDtml: "2015-02-02 04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "PRE", allowed: true },
	{	commonCaseId: "0xfddb8c5400010000ba01b0bb", commonCaseName: "MAR15FNL",
		commonCaseDesc: "MAR15FNL", planPeriod: "MAR15",
		planPerStartDtml: "2015-03-02-05:00", planPerEndDtml: "2015-03-30 04:59",
		planPerDayQty: 28, season: "WINTER", caseType: "FNL", allowed: true }];

var protoCommonCaseMap = [];

/* queryConfig object prototype */
function QueryConfig(plan, schedule, days, mode, phaseIn, phaseOut, mergeTypes, forcedLinks, patternMatching,
		eqTypes, cycleMode, cycleTimesList) {
	"use strict";
	this.planName = plan;
	this.scheduleName = schedule;
	this.daysStartEnd = days;
	this.schedulerMode = mode;
	this.phaseIn = phaseIn;
	this.phaseOut = phaseOut;
	this.mergeTypes = mergeTypes;
	this.useForcedLinks = forcedLinks;
	this.patternMatching = patternMatching;
	this.eqTypeList = eqTypes;
	this.cycleMode = cycleMode;
	this.cycleTimesList = cycleTimesList;
}

var lastQueryConfig = new QueryConfig("", "", "", "", false, false, false, false, "", "", false, "");

function initializeCommonCaseMap() {
	"use strict";
	if (isPrototype === true) {
		if (snapshotMode) {
			snapshotCaseList.forEach(function(caseObj) {
				protoCommonCaseMap[caseObj.commonCaseId] = caseObj;
			});
		} else {
			// This needs to reflect the cases available in "prod" baseline
			jfsCaseList.forEach(function(caseObj) {
				protoCommonCaseMap[caseObj.commonCaseId] = caseObj;
			});
		}
	}
}

/*global Handlebars */
function initializeTemplates() {
	"use strict";

	// Initialize templates for tooltips
	tooltipTemplates["activity"] = Handlebars.compile($("#activity-tooltip-template").html());
	tooltipTemplates["leg"] = Handlebars.compile($("#leg-tooltip-template").html());
	tooltipTemplates["non-package-stage"] = Handlebars.compile($("#non-package-stage-tooltip-template").html());

	// Initialize templates for items
	itemTemplates["activity"] = Handlebars.compile($("#activity-template").html());
	itemTemplates["activity-multiline"] = Handlebars.compile($("#activity-multiline-template").html());
	itemTemplates["leg"] = Handlebars.compile($("#leg-template").html());
	itemTemplates["leg-multiline"] = Handlebars.compile($("#leg-multiline-template").html());
	itemTemplates["leg-cycle"] = Handlebars.compile($("#leg-cycle-template").html());
	itemTemplates["leg-cycle-end"] = Handlebars.compile($("#leg-cycle-end-template").html());
	itemTemplates["ground-time"] = Handlebars.compile($("#ground-time-template").html());
	itemTemplates["equipment-summary"] = Handlebars.compile($("#equipment-summary-template").html());
}

function getOffsetBetweenDates(start, end) {
	var MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
	// var startDate = moment(start).toDate();
	var startDate = new Date(start);
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	// var startUTCDate = new Date();
	// startUTCDate.setTime(startDate.getTime() + startDate.getTimezoneOffset()*60000);

	// var endDate = moment(end).toDate();
	var endDate = new Date(end);
	endDate.setHours(0);
	endDate.setMinutes(0);
	endDate.setSeconds(0);
	// var endUTCDate = new Date();
	// endUTCDate.setTime(endDate.getTime() + endDate.getTimezoneOffset()*60000);

	return Math.floor((endDate.getTime() - startDate.getTime()) / MILLIS_PER_DAY);
	// return Math.floor(endUTCDate.getTime() / MILLIS_PER_DAY) - Math.floor(startUTCDate.getTime() / MILLIS_PER_DAY);

	/*
	var startDate = Math.floor(new Date(start).getTime() / (24 * 60 * 60 * 1000));
	var endDate = Math.floor(new Date(end).getTime() / (24 * 60 * 60 * 1000));
	return endDate - startDate;
	*/
}

/*
	formatItemForTooltip(item, useLocal)
		generates the formatted tooltip for an item from a DataSet
 */
function formatItemForTooltip(item, useLocal) {
	"use strict";
	var context;
	var tooltip = null;
	var routeType = item.data("routetype");
	var className = item.data("classname");

	if (!isDefined(className)) {
		className = item.context.className;
	}

	if (isDefined(className) && className.indexOf("summary") !== -1) {
		return tooltip;
	}

	// Calculate dayOffset using the Z-values -tc
	var dayOffset = 0;
	var tmFlg = (useLocal ? "L" : "Z");
	var arvlTm, dptrTm;
	if (useLocal) {
		dayOffset = getOffsetBetweenDates(item.data("startl"), item.data("endl"));
		arvlTm = item.data("arvlltm");
		dptrTm = item.data("dptrltm");
	} else {
		dayOffset = getOffsetBetweenDates(item.data("start"), item.data("end"));
		arvlTm = item.data("arvltm");
		dptrTm = item.data("dptrtm");
	}

	if (dayOffset > 0) {
		tmFlg = "(+" + dayOffset + ") " + tmFlg;
	} else if (dayOffset < 0) {
		tmFlg = "(" + dayOffset + ") " + tmFlg;
	}

	// Conditional formatting based on routeType (maint or spare) or className (non-package, staging)
	// This just selects which template to use; templates are defined in main JSP file -tc
	if (routeType === "maint") {
		context = {acty: "MxAlloc", orig: item.data("orig"), dptrtm: dptrTm,
			arvltm: arvlTm, tmflg: tmFlg, gndtm: item.data("gndtm")};
		tooltip = tooltipTemplates["activity"](context);
	} else if (routeType === "spare") {
		context = {acty: "Spare", orig: item.data("orig"), dptrtm: dptrTm,
			arvltm: arvlTm, tmflg: tmFlg, gndtm: item.data("gndtm")};
		tooltip = tooltipTemplates["activity"](context);
	} else if (className === "non-package" || className === "staging") {
		context = {movenbr: item.data("movenbr"), orig: item.data("orig"), dptrtm: dptrTm,
			dest: item.data("dest"), arvltm: arvlTm, tmflg: tmFlg, blktm: item.data("blktm"),
			gndtm: item.data("gndtm")};
		tooltip = tooltipTemplates["non-package-stage"](context);
	} else {
		context = {movenbr: item.data("movenbr"), orig: item.data("orig"), dptrtm: dptrTm,
			dest: item.data("dest"), arvltm: arvlTm, tmflg: tmFlg, blktm: item.data("blktm"),
			gndtm: item.data("gndtm"), cubeload: item.data("cubeload"), wgtload: item.data("wgtload")};
		tooltip = tooltipTemplates["leg"](context);
  }

  return tooltip;
}

/*
	my_template
		template "engine" to generate the content to be displayed for an item;
		it operates in "skinny" (one line) or regular (two lines) mode
 */
function templateForLegOrActivity(skinny, item) {
	"use strict";
	var context;
	var html;
	if (skinny) {
		// Conditional formatting based on routeType (maint or spare) or type (background)
		if (item.routeType === "maint") {
			context = {acty: "Mx", orig: item.orig, dptrtm: item.dptrTm,
				arvltm: item.arvlTm, gndtm: item.gndTm};
			html = itemTemplates["activity"](context);

			// html = "<div class=\"activity\">Mx - " + item.orig + " " + item.dptrTm + "-"
			// 	+ item.arvlTm + " (Gnd " + item.gndTm + ")</div>";
		} else if (item.routeType === "spare") {
			context = {acty: "Spare", orig: item.orig, dptrtm: item.dptrTm,
				arvltm: item.arvlTm, gndtm: item.gndTm};
			html = itemTemplates["activity"](context);

			// html = "<div class=\"activity\">Spare - " + item.orig + " " + item.dptrTm + "-"
			// 	+ item.arvlTm + " (Gnd " + item.gndTm + ")</div>";
		} else if (item.type === "background") {
			context = {gndtm: item.gndTm};
			if (item.className === "summary") {
				context = {eqtype: item.eqType, eqdesc: item.eqDesc,
					acavblqty: item.acAvblQty, acactqty: item.acActQty,
					planactqty: item.planActQty, mingndtmqty: item.minGndTmQty};
				html = itemTemplates["equipment-summary"](context);
				// html = "<div class=\"summary\">" + item.gndTm + "</div>";
			} else {
				html = itemTemplates["ground-time"](context);
			}

			// html = "<div class=\"ground-time\">" + item.gndTm + "</div>";
		} else {
			context = {orig: item.orig, dest: item.dest};
			if (!isCycleMode) {
				html = itemTemplates["leg"](context);
			} else {
				/*
				 * If cycle's defined, we're going to show both the origin
				 * and destination if cycle is equal to "end", hub-in" or
				 * "hub-out"; for hub-in or hub-out, the appropriate end of
				 * the leg will be abbreviated; and if cycle is equal to "hub",
				 * then we only show an abbreviated origin.
				 *
				 * If cycle is not defined, we only show the origin.
				 */
				if (isDefined(item.cycle)) {
					if (item.cycle === "hub") {
						context.orig = context.orig.substring(0, 1);
						html = itemTemplates["leg-cycle"](context);
					} else if (item.cycle === "hub-in") {
						context.dest = context.dest.substring(0, 1);
						html = itemTemplates["leg-cycle-end"](context);
					} else if (item.cycle === "hub-out") {
						context.orig = context.orig.substring(0, 1);
						html = itemTemplates["leg-cycle-end"](context);
					} else if (item.cycle === "end") {
						html = itemTemplates["leg-cycle-end"](context);
					}
				} else {
					html = itemTemplates["leg-cycle"](context);
				}
			}
			// html = "<div class=\"leg\">" + item.orig + "-" + item.dest + "</div>";
			// html = '<div class="combined"><div class="moveNbr">' + item.moveNbr + '</div>' + item.orig + ' - ' + item.dest +'</div>';
		}
	} else {
		// Conditional formatting based on routeType (maint or spare) or type (background)
		if (item.routeType === "maint") {
			context = {acty: "Mx Alloc", orig: item.orig, dptrtm: item.dptrTm,
				dest: item.dest, arvltm: item.arvlTm, gndtm: item.gndTm};
			html = itemTemplates["activity-multiline"](context);

			// html = "<div class=\"activity\">Mx Alloc - " + item.orig + " " + item.dptrTm
			// 	+ "</div><div>(Gnd " + item.gndTm + ") "
			// 	+ item.arvlTm + " " + item.dest + "</div>";
		} else if (item.routeType === "spare") {
			context = {acty: "Spare", orig: item.orig, dptrtm: item.dptrTm,
				dest: item.dest, arvltm: item.arvlTm, gndtm: item.gndTm};
			html = itemTemplates["activity-multiline"](context);

			// html = "<div class=\"activity\">Spare - " + item.orig + " " + item.dptrTm
			// 	+ "</div><div>(Gnd " + item.gndTm + ") "
			// 	+ item.arvlTm + " " + item.dest + "</div>";
		} else if (item.type === "background") {
			context = {gndtm: item.gndTm};
			if (item.className === "summary") {
				context = {eqtype: item.eqType, eqdesc: item.eqDesc,
					acavblqty: item.acAvblQty, acactqty: item.acActQty,
					planactqty: item.planActQty, mingndtmqty: item.minGndTmQty};
				html = itemTemplates["equipment-summary"](context);
				// html = "<div class=\"summary\">" + item.gndTm + "</div>";
			} else {
				html = itemTemplates["ground-time"](context);
			}

			// html = "<div class=\"ground-time\">" + item.gndTm + "</div>";
		} else {
			context = {movenbr: item.moveNbr, orig: item.orig, dptrtm: item.dptrTm, dest: item.dest, 
				arvltm: item.arvlTm};
			html = itemTemplates["leg-multiline"](context);

			// html = "<div class=\"leg\">" + item.moveNbr + "<br/>" + item.orig + "-" + item.dest + "</div>";
		}
	}
	return html;
}

/*
	formatLegOrActivitySkinny
		"bridge" to my_template() with a more meaningful name; also
		functions as a convenience method for the one-line mode
 */
function formatLegOrActivitySkinny(item) {
	"use strict";
	return templateForLegOrActivity(true, item);
}

/*
	formatLegOrActivity
		"bridge" to my_template() with a more meaningful name; also
		functions as a convenience method for the two-line mode
 */
function formatLegOrActivity(item) {
	"use strict";
	return templateForLegOrActivity(false, item);
}

/*
	formatGroupInfo(tailNbr, eqDesc)
		returns a formatted div that contains the tailNbr and eqDesc
 */
/*exported formatGroupInfo */
function formatGroupInfo(tailNbr, eqDesc) {
	"use strict";
	return "<div align='center'><b>" + tailNbr + "</b></div><div align='center'>(" + eqDesc + ")</div>";
}

/*
	startSpinner(target)
		creates, loads, and starts a "busy" spinner in the designated target element
 */
/*global Spinner*/
function startSpinner(target) {
	"use strict";
	var opts = {
		lines: 13, // The number of lines to draw
		length: 20, // The length of each line
		width: 10, // The line thickness
		radius: 30, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: "#000", // #rgb or #rrggbb or array of colors
		speed: 0.6, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: "spinner", // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: "50%", // Top position relative to parent
		left: "50%" // Left position relative to parent
	};

	// var spinner = new Spinner(opts).spin(target);
	new Spinner(opts).spin(target);
}

/*
	stopSpinner
		stops and deletes any spinners (matches on class = spinner
 */
function stopSpinner() {
	"use strict";
	$(".spinner").stop();
	delete $(".spinner");
}

/*
function startLittleSpinner(target) {
	"use strict";
	var opts = {
		lines: 13, // The number of lines to draw
		length: 20, // The length of each line
		width: 10, // The line thickness
		radius: 30, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: "#000", // #rgb or #rrggbb or array of colors
		speed: 0.6, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: "littleSpinner", // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: "50%", // Top position relative to parent
		left: "50%" // Left position relative to parent
	};

	// var spinner = new Spinner(opts).spin(target);
	new Spinner(opts).spin(target);
}

function stopLittleSpinner() {
	"use strict";
	$(".littleSpinner").stop();
	delete $(".littleSpinner");
}
*/

/*exported enableConfiguration */
function enableConfiguration(enabled) {
	"use strict";
	// $("#planComboBox").prop("disabled", !enabled);
	$("#schedComboBox").data("kendoComboBox").enable(!snapshotMode);
	// removed -tc $("#maintenanceChkBox").prop("disabled", !enabled);
	// $("#daysComboBox").prop("disabled", !enabled);
	if (snapshotMode) {
		$("#daysText").val("08-12");
	}
	$("#daysText").prop("disabled", snapshotMode);
	$("#assignComboBox").data("kendoDropDownList").enable(!snapshotMode);
	// removed -tc $("#spareChkBox").prop("disabled", !enabled);
	$("#phaseInChkBox").prop("disabled", snapshotMode);
	$("#phaseOutChkBox").prop("disabled", snapshotMode);
	$("#mergeTypesChk").prop("disabled", snapshotMode);
	// removed -tc $("#nonPackageChk").prop("disabled", !enabled);
	$("#forcedLinksChk").prop("disabled", snapshotMode);
	$("#patternCmbBox").data("kendoDropDownList").enable(!snapshotMode);
	// removed -tc $("#stagingChk").prop("disabled", !enabled);

	// Enable non-snapshot eq types
	$("#allEqRadBtn").prop("disabled", snapshotMode);
	$("#b737RadBtn").prop("disabled", snapshotMode);
	// $("#a300RadBtn").prop("disabled", snapshotMode);
	$("#a310RadBtn").prop("disabled", snapshotMode);
	$("#md10RadBtn").prop("disabled", snapshotMode);

	// $("#b757EqRadBtn").prop("disabled", snapshotMode);
	$("#b767EqRadBtn").prop("disabled", snapshotMode);
	// $("#b777EqRadBtn").prop("disabled", snapshotMode);
	// $("#md11EqRadBtn").prop("disabled", snapshotMode);

	/*
	if (!enabled) {
		// Only do this 1st time through (only matters in snapshot mode)
		$("#sampleEqRadBtn").prop("checked", snapshotMode);
	}

	if (!snapshotMode) {
		$("label[for=sampleEqRadBtn],#sampleEqRadBtn").hide();
	}
	*/

	// This was creating a bug because it was resetting the equipment
	// type and causing the data to be reloaded; just going to default
	// the selected value in the HTML -tc
	// $("#md11RadBtn").prop("checked", true);
}

function saveQueryConfiguration(queryConfig) {
	"use strict";
	queryConfig.planName = $("#planComboBox option:selected").text();
	queryConfig.scheduleName = $("#schedComboBox option:selected").val();
	queryConfig.daysStartEnd = $("#daysText").val();
	queryConfig.schedulerMode = $("#assignComboBox option:selected").val();
	queryConfig.phaseIn = $("#phaseInChkBox").is(":checked");
	queryConfig.phaseOut = $("#phaseOutChkBox").is(":checked");
	queryConfig.mergeTypes = $("#mergeTypesChk").is(":checked");
	queryConfig.useForcedLinks = $("#forcedLinksChk").is(":checked");
	queryConfig.patternMatching = $("#patternCmbBox").val();
	queryConfig.eqTypeList = getEqTypeList(getSelectedEqTypes());
	var cycleMode = $("#cycleModeChkBox").is(":checked");
	queryConfig.cycleMode = cycleMode;
	queryConfig.cycleTimesList = cycleMode ? getCycleTimesList() : "";
	console.log(queryConfig);
}

function checkQueryConfigurationForChanges(queryConfig) {
	"use strict";
	var hasChanged = false;
	if ($("#planComboBox option:selected").text() !== queryConfig.planName) {
		hasChanged = true;
	}
	if ($("#schedComboBox option:selected").val() !== queryConfig.scheduleName) {
		hasChanged = true;
	}
	if ($("#daysText").val() !== queryConfig.daysStartEnd) {
		hasChanged = true;
	}
	if ($("#assignComboBox option:selected").val() !== queryConfig.schedulerMode) {
		hasChanged = true;
	}
	if ($("#phaseInChkBox").is(":checked") !== queryConfig.phaseIn) {
		hasChanged = true;
	}
	if ($("#phaseOutChkBox").is(":checked") !== queryConfig.phaseOut) {
		hasChanged = true;
	}
	if ($("#mergeTypesChk").is(":checked") !== queryConfig.mergeTypes) {
		hasChanged = true;
	}
	if ($("#forcedLinksChk").is(":checked") !== queryConfig.useForcedLinks) {
		hasChanged = true;
	}
	if ($("#patternCmbBox").val() !== queryConfig.patternMatching) {
		hasChanged = true;
	}
	if (getEqTypeList(getSelectedEqTypes()) !== queryConfig.eqTypeList) {
		hasChanged = true;
	}
	if ($("#cycleModeChkBox").is(":checked") !== queryConfig.cycleMode) {
		hasChanged = true;
	} else {
		if (queryConfig.cycleMode && getCycleTimesList() !== queryConfig.cycleTimesList) {
			hasChanged = true;
		}
	}

	return hasChanged;
}

/*exported enableDisplayOptions */
function enableDisplayOptions(enabled) {
	"use strict";
	$("#multiLineChkBox").prop("disabled", !enabled);
	$("#showLoadInfoChkBox").prop("disabled", !enabled);

	// This isn't working. Why? -tc
	$("#origDestDispOrigin").prop("disabled", !enabled);
	$("#operatorCmb").data("kendoDropDownList").enable(enabled);
	$("#origDestDispDest").prop("disabled", !enabled);

	$("#packageLegChkBox").prop("disabled", !enabled);
	$("#maintenanceLegChkBox").prop("disabled", !enabled);
	$("#nonPackageLegChkBox").prop("disabled", !enabled);
	$("#spareLegChkBox").prop("disabled", !enabled);
	$("#stagingLegChkBox").prop("disabled", !enabled);

	$("#domLegChkBox").prop("disabled", !enabled);
	$("#intlLegChkBox").prop("disabled", !enabled);
}

/*exported resetDisplayOptions */
function resetDisplayOptions() {
	"use strict";
	$("#multiLineChkBox").prop("checked", false);
	$("#showLoadInfoChkBox").prop("checked", true);

	$("#origDestDispOrigin").val("");
	$("#origDestDispDest").val("");
	$("#operatorCmb").val("or");

	$("#packageLegChkBox").prop("checked", true);
	$("#maintenanceLegChkBox").prop("checked", true);
	$("#nonPackageLegChkBox").prop("checked", true);
	$("#spareLegChkBox").prop("checked", true);
	$("#stagingLegChkBox").prop("checked", true);

	$("#domLegChkBox").prop("checked", true);
	$("#intlLegChkBox").prop("checked", true);
}

/*exported enableGroundTime */
function enableGroundTime(enabled) {
	"use strict";
	// $("#memGndTmChkBox").prop("disabled", !enabled);
	$("#locationGndTm").prop("disabled", !enabled);
	$("#durationGndTmText").prop("disabled", !enabled);
	$("#daysGndTmText").prop("disabled", !enabled);
}

function resetGroundTime() {
	"use strict";
	$("#locationGndTm").val("");
	$("#durationGndTmText").val("");
}

/*global classListContains */
function updateGroupVisibility(hideGroups) {
	"use strict";
	// console.log("hiddenGroups: " + hiddenGroups.getIds());
	var visibleGroupIds = [];

	// Determine which groups should be visible
	lastItems.forEach(function(item) {
		if (!classListContains(item.className, "gray-out")) {
			if (visibleGroupIds.indexOf(item.group) === -1) {
				visibleGroupIds.push(item.group);
			}
		}
	});
	// console.log("hidingGroups: " + hideGroups + "; visibleGroupIds: " + visibleGroupIds);

	if (hideGroups) {
		// Hide any groups that shouldn't be visible
		lastGroups.forEach(function(group) {
			if (visibleGroupIds.indexOf(group.id) === -1) {
				// console.log("hiding/removing group id=" + group.id);
				hiddenGroups.add(group);
				lastGroups.remove(group.id);
			}
		});
	} else {
		// Show any "hidden" groups that are now visible
		hiddenGroups.forEach(function(group) {
			if (visibleGroupIds.indexOf(group.id) !== -1) {
				// console.log("showing/adding group with id=" + group.id);
				hiddenGroups.remove(group.id);
				lastGroups.add(group);
			}
		});
	}
}

/*
	removeGrayOutNoVolumeStyles
		removes the classes used for graying out or turning off load volumes
		for items in the timeline
 */
/*global removeClassFromList */
function removeGrayOutNoVolumeLegStyles() {
	"use strict";
	lastItems.forEach(function(item) {
		if (item.type !== "background") {
			var newClassName = removeClassFromList(item.className, "gray-out");
			newClassName = removeClassFromList(newClassName, "no-volume");
			// console.log("item.className:" + item.className + "; newClassName:" + newClassName);
			if (item.className !== newClassName) {
				lastItems.update({ id: item.id, className: newClassName });
			}
		}
	});

	updateGroupVisibility(false);  // un-hide
}

/*
	grayOutPackageLegs
		remove the 'no-volume' class and adds the 'gray-out' class to all
		timeline items that represent a package-carrying leg
 */
/*global addClassToList */
function grayOutPackageLegs() {
	"use strict";
	lastItems.forEach(function(item) {
		item.className = removeClassFromList(item.className, "no-volume");
		if (typeof item.routeType === "undefined" && !(classListContains(item.className, "staging")
				|| classListContains(item.className, "non-package"))) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out") });
		}
	});

	updateGroupVisibility(true); // hide
}

/*
	grayOutMaintenanceLegs
		adds the 'gray-out' class to all timeline items that represent a
		maintenance activity
 */
function grayOutMaintenanceLegs() {
	"use strict";
	lastItems.forEach(function(item) {
		if (classListContains(item.className, "maintenance")) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out") });
		}
	});

	updateGroupVisibility(true); // hide
}

/*
	grayOutNonPackageLegs
		adds the 'gray-out' class to all timeline items that represent a
		non-package-carrying leg
 */
function grayOutNonPackageLegs() {
	"use strict";
	lastItems.forEach(function(item) {
		if (classListContains(item.className, "non-package")) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out") });
		}
	});

	updateGroupVisibility(true); // hide
}

/*
	grayOutSpareLegs
		adds the 'gray-out' class to all timeline items that represent a
		spare activity
 */
function grayOutSpareLegs() {
	"use strict";
	lastItems.forEach(function(item) {
		if (classListContains(item.className, "spare")) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out") });
		}
	});

	updateGroupVisibility(true); // hide
}

/*
	grayOutStagingLegs
		adds the 'gray-out' class to all timeline items that represent a
		staging leg
 */
function grayOutStagingLegs() {
	"use strict";
	lastItems.forEach(function(item) {
		if (classListContains(item.className, "staging")) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out") });
		}
	});

	updateGroupVisibility(true); // hide
}

function grayOutLegsByGroup(legGroup) {
	"use strict";
	lastItems.forEach(function(item) {
		// console.log("legGroup: " + item.legGroup);
		if (item.legGroup === legGroup && !classListContains(item.className, "summary")) {
			lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out")});
		}
	});

	updateGroupVisibility(true); // hide
}

function grayOutLegsByOrigDest(origList, destList) {
	"use strict";
	var origins = origList.split(",");

	console.log("origins: [" + origins + "]");
	var destinations = destList.split(",");
	console.log("destinations: [" + destinations + "]");

	if ($("#operatorCmb option:selected").val() === "bi") {
		destinations.forEach(function(dest) {
			if (origins.indexOf(dest) === -1) {
				origins.push(dest);
			}
		})
		destinations = origins;
		console.log("origins (bi): [" + origins + "]");
		console.log("destinations (bi): [" + destinations + "]");
	}

	lastItems.forEach(function(item) {
		// Skip any "summary" items -tc
		if (!classListContains(item.className, "summary")) {
			var originMatch = origins.length > 0 ? false : true;
			origins.forEach(function(orig) {
				if (item.orig === orig) {
					originMatch = true;
					// console.log("origin match: [" + item.orig + "]");
				}
			});
			// console.log("originMatch: " + originMatch);

			var destMatch = destinations.length > 0 ? false : true;
			destinations.forEach(function(dest) {
				if (item.dest === dest) {
					destMatch = true;
					// console.log("destination match: [" + item.orig + "]");
				}
			});
			// console.log("destMatch: " + destMatch);

			if ($("#operatorCmb option:selected").val() === "or") {
				// Gray out leg if it doesn't match either origin OR destination
				if (originMatch === false && destMatch === false) {
					lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out")});
				}
			} else {
				// Gray out leg if it doesn't match both origin AND destination
				if (originMatch === false || destMatch === false) {
					lastItems.update({ id: item.id, className: addClassToList(item.className, "gray-out")});
				}
			}
		}
	});

	updateGroupVisibility(true); // hide
}

/*
	legWithoutVolumes(noVolumeClass)
		adds the noVolumeClass class to all timeline items that represent a
		package-carrying leg
 */
function legsWithoutVolumes(noVolumeClass) {
	"use strict";
	lastItems.forEach(function(item) {
		var newClassName = removeClassFromList(item.className, "gray-out");
		// Exclude for maintenance, non-package, spare, staging
		if (typeof item.routeType === "undefined" && !(classListContains(item.className, "staging")
				|| classListContains(item.className, "non-package")
				|| classListContains(item.className, "summary"))) {
			lastItems.update({ id: item.id, className: addClassToList(newClassName, noVolumeClass) });
		}
	});
}

/*global isDefined, convertToMinutes, lastGndTmItems:true */
function findLocationWithGroundTime(items, locations, duration) {
	"use strict";
	// console.log("entering findLocationWithGroundTime...");
	var durationMins = convertToMinutes(duration);
	if (durationMins <= 0) {
		console.log("Oopsie! Invalid duration.");
		lastGndTmItems = [];
		return;
	}
	var foundItems = [];
	if (isDefined(items)) {
		// Get the largest id value contained in the DataSet
		var nextId = items.max("id").id + 1;
		items.forEach(function(item) {
			// TODO Check if locations is defined
			// Filter out activities (routeType is undefined for legs)
			if (item.routeType === undefined) {
				locations.forEach(function(location) {
					if (item.dest === location || location === "") {
						var gndTmMins = convertToMinutes(item.gndTm);
						// console.log("item.gndTm: " + item.gndTm + "; gndTmMins: " + gndTmMins);
						if (gndTmMins > durationMins) {
							var calcEnd = new Date(item.end);
							var minutes = calcEnd.getUTCMinutes() + gndTmMins;
							calcEnd.setUTCMinutes(minutes);

							// Need to create a background item: need to set id, orig, gndTm, group,
							// className, type, start (=end), and end (=start for next leg/activity)
							var newItem = {
								"id": nextId++,
								"orig": item.orig,
								"start": item.end,
								"end": calcEnd,
								"gndTm": item.gndTm,
								"group": item.group,
								"className": "ground-time",
								"type": "background"
							};
							foundItems.push(newItem);
						}
					}
				});
			}
		});
		// console.log(foundItems);
		lastGndTmItems = foundItems;
	}
}

// TODO This needs to be called from applyDisplaySettings()
function toggleGroundTimeResults(showResults) {
	"use strict";
	if (isDefined(lastItems)) {
		if (showResults) {
			// Retrieve locations(s) and duration
			var locations = $("#locationGndTm").val().replace(/ /g, "").toUpperCase().split(",");
			var duration = $("#durationGndTmText").val().replace(/ /g, "");
			console.log("duration: " + duration);
			if (isDefined(duration) && duration.length < 5) {
				duration = duration.replace(/:/g, "").paddingLeft("0000");
				duration = duration.substring(0, 2) + ":" + duration.substring(2, 4);
			}
			console.log("duration: " + duration);

			// TODO duration needs to be formatted as hh:mm before it's
			// passed to findLocationWithGroundTime()--or I need to make
			// conversion function smarter
			var removeItems = [];

			if (!isDefined(lastGndTmItems) || lastGndTmItems.length === 0) {
				lastLocationsGndTm = locations;
				lastDurationGndTm = duration;
				findLocationWithGroundTime(lastItems, locations, duration);
				lastItems.add(lastGndTmItems);
			} else if (locations !== lastLocationsGndTm || duration !== lastDurationGndTm) {

				// Clean up previous search results
				if (isDefined(lastGndTmItems)) {
					lastGndTmItems.forEach(function(item) {
						removeItems.push(item.id);
					});
					lastItems.remove(removeItems);
					lastGndTmItems = [];
				}

				findLocationWithGroundTime(lastItems, locations, duration);
				lastItems.add(lastGndTmItems);
			}
		} else {
			var removeItems = [];

			if (isDefined(lastGndTmItems)) {
				lastGndTmItems.forEach(function(item) {
					removeItems.push(item.id);
				});
				lastItems.remove(removeItems);
				lastGndTmItems = [];
			}
		}
	}
}

/*
	switchTemplate(newTemplate)
		changes the template that's used to format the displayed content
		for timeline items

		Note: This clears and reloads the timeline (it's pretty obvious).
 */
/*global timeline:true, lastGroups:true, lastItems:true, lastOptions:true */
function switchTemplate(newTemplate) {
	"use strict";
	$("#visualization").hide();
	var lastWindow = timeline.getWindow();
	timeline.clear();
	timeline.setOptions(lastOptions);
	timeline.setOptions({
		template: newTemplate
	});
	timeline.setItems(lastItems);
	timeline.setGroups(lastGroups);
	timeline.setWindow(lastWindow);
	timeline.generateTooltips = true;
	timeline.on("finishedRedraw", function() {
		setToolTips();
	});

	$("#visualization").show();
}

/*
	setToolTips
		sets the tooltips for all of the timeline items; this needs to be called
		whenever the timeline data changes (*after* it's changed)
 */
function setToolTips() {
	"use strict";
	var useLocal = ($("input[type='radio'][name='timeZone']:checked").val() === "local");
	if (timeline.generateTooltips) {
		console.log("Setting tooltips...");
		$("div.item").each(function() {
			$(this).qtip({
				content: {
					// text: $(this).data('title') + ' [' + $(this).data('id')
					// FIXME Need to read this setting from the UI -tc
					text: formatItemForTooltip($(this), useLocal)
				},
				style: {
					classes: "qtip-cluetip"
					// cream-colored: 'qtip-shadow'
					// grayish: 'qtip-cluetip'
					// blue: 'qtip-blue qtip-shadow qtip-rounded'
					// white: 'qtip-light qtip-shadow'
				},
				position: {
					my: "top middle",
					// at: 'center'
					target: "mouse",
					adjust: {
						x: 10,
						y: 10
					}
				},
				show: {
					delay: 500
				}
			});
		});
		timeline.generateTooltips = false;
		lastTimeZone = $("input[type='radio'][name='timeZone']:checked").val();
		console.log("timeZone: " + lastTimeZone);
	}
}

/*global lastSelectedSchedNm:true */
function scheduleListRequestSucceeded(response) { //, io) {
	"use strict";
	if (isDefined(response) && isDefined(response.scheduleList) && isDefined(response.scheduleList.scheduleCount)) {
		var schedCount = response.scheduleList.scheduleCount;
		// var defaultSchedule;
		var scheduleData = [];
		scheduleData.push({name: EMPTY_STRING, id: EMPTY_STRING, hasAccess: true});
		for (var i = 0; i < schedCount; i++) {
			var scheduleObj = response.scheduleList.schedule[i];
			scheduleData.push(scheduleObj);
		}
		scheduleData.sort(simpleSort);
		var schedComboBox = $("#schedComboBox").data("kendoComboBox");
		schedComboBox.setDataSource(scheduleData);
		schedComboBox.value("Master");
		schedComboBox.enable();
		lastSelectedSchedNm = "Master";
	}

	showProgressDialog(false);
}

function onServiceRequestFailure(response, io) {
	"use strict";
	// TODO
    if (isDefined(response)) {
        if (isDefined(response._errorCd) && response._errorCd > 0) {
			console.log("callService returned error: " + response._errorCd + "[" + response._errorDesc + "]");
        } else if (isDefined(io) && (io === "error") && (response.status !== 200)) {
			console.log("callService returned io error: " + response.status);
        }
    }

    showProgressDialog(false);
}

function getCaseList() {
	"use strict";

	if (isPrototype) {
			// commonCaseMap is populated in caseTypeRequestSucceeded() in "pegasusHeader.js"
		return protoCommonCaseMap;
	} else {
		// commonCaseMap is populated in caseTypeRequestSucceeded() in "pegasusHeader.js"
		var commonCaseMap = parent.commonCaseMap;
		if (isDefined(commonCaseMap)) {
			console.log(commonCaseMap);
			return commonCaseMap;
		} else {
			console.log("falling back to protoCommonCaseMap");
			return protoCommonCaseMap;
		}
	}
}

function compareMonth(a, b) {
	var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
		"JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	return months.indexOf(a) - months.indexOf(b);
}

function compareString(a, b) {
	if (a < b) { return -1; }
	if (a > b) { return 1; }
	return 0;
}

function planSort(aa, bb) {
	var a = aa.commonCaseName;
	var b = bb.commonCaseName;
	// format: mmmYYttt, where
	// mmm = three-character month (e.g., JUN)
	// YY = two-digit year (e.g., 15)
	// ttt = case suffix (e.g., FNL, PRE, WIF)
	var aMonth = a.substring(0, 3);
	var aYear = parseInt(a.substring(3, 2));
	var aSuffix = a.substring(5, 3);
	var bMonth = b.substring(0, 3);
	var bYear = parseInt(b.substring(3, 2));
	var bSuffix = b.substring(5, 3);

	if (aMonth === bMonth) {
		if (aYear === bYear) {
			return compareString(aSuffix, bSuffix);
		} else {
			return aYear - bYear;
		}
	} else {
		return compareMonth(aMonth, bMonth);
	}
}

function scheduleSort(aa, bb) {
	var a = aa.scheduleName;
	var b = bb.scheduleName;
	if (a === "Master") { return -1 };
	if (b === "Master") { return 1; };
	return compareString(a, b);
}

function simpleSort(a, b) {
	if (a.commonCaseName < b.commonCaseName) {
		return -1;
	}
	if (a.commonCaseName > b.commonCaseName) {
		return 1;
	}
	return 0;
}

function loadPlanComboBox(caseList) {
	"use strict";
	var comboBox = $("#planComboBox");
	var planData = [];
	for (var caseId in caseList) {
		if (caseId.indexOf("0x") !== -1) {
			var caseObj = caseList[caseId];
			planData.push(caseObj);
		}
	}
	planData.sort(planSort);
	comboBox.data("kendoComboBox").setDataSource(planData);
	/* non-Kendo way...
	for (var caseId in caseList) {
		if (caseId.indexOf("0x") !== -1) {
			var caseObj = caseList[caseId];
			if (caseObj.allowed === true) {
				comboBox.append($("<option />").val(caseObj.commonCaseId).text(caseObj.commonCaseName));
			} else {
				comboBox.append($("<option disabled=\"disabled\" />").val(caseObj.commonCaseId).text(caseObj.commonCaseName));
			}
		}
	};
	*/
}

function resetScheduleComboBox() {
	"use strict";
	$("#schedComboBox").data("kendoComboBox").select(0);
	$("#schedComboBox").data("kendoComboBox").setDataSource([]);
}

/* global callService, showProgressDialog */
function loadScheduleComboBox(caseId) {
	"use strict";
	showProgressDialog(true, "Loading Schedule list...", "dialog");
	if (!isPrototype) {
		callService({
			url: CONTEXT_NAME + SCHEDULE_SERVICE_URL + caseId,
			successCallback: scheduleListRequestSucceeded,
			failureCallback: onServiceRequestFailure,
			showProgressWindow: false
		});
	} else {
		showProgressDialog(false);
		$("#schedComboBox").data("kendoComboBox").enable();
	}
}

function onSelectPlan(caseId) {
	"use strict";
	resetScheduleComboBox();
	loadScheduleComboBox(caseId);
}

function planChangeHandler() {
	"use strict";
	var caseId = $("#planComboBox option:selected").val();
	if (caseId !== lastSelectedCaseId) {
		onSelectPlan(caseId);
		if(!isDefined(caseId)) {
			lastSelectedCaseId = null;
			lastSelectedSchedId = null;
		} else {
			lastSelectedCaseId = caseId;
		}
	}
}

function getEqTypesForId(eqTypeId) {
	switch(eqTypeId) {
		case "b737":
			return "37";
		case "b757":
			return "22,23,67";
		case "b767":
			return "52,76";
		case "b777":
			return "83";
		case "a300":
			return "55,58";
		case "a310":
			return "56,57,59";
		case "md10":
			return "88";
		case "md11":
			return "16,26";
		case "md30":
			return "97,98";
		default:
			return "";
	}
}

function getEqTypeList(eqType) {
	"use strict";
	// if we're in prototype mode, there will only be
	// one eqType
	if (snapshotMode) {
		return getEqTypesForId(eqType);
	} else {
		// process comma-separated list
		var selEqTypes = eqType.split(",");
		var eqTypeList = [];
		selEqTypes.forEach(function(eqTypeId) {
			var eqTypeAry = getEqTypesForId(eqTypeId).split(",");
			eqTypeAry.forEach(function(equip) {
				eqTypeList.push(equip);
			})
		});
		return eqTypeList.join(",");
	}
}

function getMidPointForDates(start, end) {
	"use strict";
	var startDate = new Date(start);
	var endDate = new Date(end);
	var startEndDiff = (endDate.getTime() - startDate.getTime());
	var midPoint = new Date(start);
	midPoint.setTime(midPoint.getTime() + (startEndDiff / 2));
	return midPoint;
}

function orderGroups(groupA, groupB) {
	"use strict";
	var eqTypeSort = groupA.eqType - groupB.eqType;
	if (eqTypeSort === 0) {
		if (groupA.tailNbr === "0") {
			return -1;
		}
		if (groupB.tailNbr === "0") {
			return 1;
		}
		var aAlloc = (isDefined(groupA.allocOnly) && groupA.allocOnly === true) ? 1 : 0;
		var bAlloc = (isDefined(groupB.allocOnly) && groupB.allocOnly === true) ? 1 : 0;
		if (aAlloc === bAlloc) {
			if (groupA.tailNbr < groupB.tailNbr) {
				return -1;
			} else if (groupA.tailNbr > groupB.tailNbr) {
				return 1;
			} else {
				return 0;
				// return groupA.tailNbr - groupB.tailNbr;
			}
		} else {
			return bAlloc - aAlloc;
		}
	} else {
		if (eqTypeSort < 0) {
			return -1;
		} else if (eqTypeSort > 0) {
			return 1;
		} else {
			return 0;
			return eqTypeSort;
		}
	}
	// return (groupA.eqType + "_" + groupA.tailNbr) - (groupB.eqType + "_" + groupB.tailNbr);
}

function showValidationError(message, details) {
	console.log(message + ": [" + details + "]");
	$("#validationError").text("Validation Error: " + message);
	$("#messageArea").show();
	validationFailed = true;
}

function clearValidationError() {
	$("#messageArea").hide();
	$("#validationError").text("");
	validationFailed = false;
}

function getCycleTimesList() {
	"use strict";

	// TODO Need to read values from break1, break2, and break3
	return "0145,0715,1800";
}

/*
	loadTRACData
		uses AJAX calls to retrieve the groups and items, then loads them
		into to the timeline

		Note: This is fine for the prototype, but will need to change for
		the "real" system (for one thing, the groups and items will be returned
		by a single call).
 */
/*global vis */
function loadTRACData(eqType) { // combinedUrl) {
	"use strict";
	// parse out "daysText" to get start/end day
	var days = $("#daysText").val().replace(/ /g, "").split("-");
	console.log("days: [" + days + "]");
	var phaseIn = $("#phaseInChkBox").is(":checked");
	var phaseOut = $("#phaseOutChkBox").is(":checked");
	var phaseInOutCd = null;
	var planComboBox = $("#planComboBox").data("kendoComboBox");
	var planPerDayQty = getCaseList()[planComboBox.value()].planPerDayQty;
	/*
		daysText input is constrained to five chars;
		if there are two days, start = 1st and end = 2nd;
		if there's one day, it's used for both start and end; and
		if there are no days, then start = 1st day of plan, end = last day of plan
	*/

	clearValidationError();

	/* TODO add check for required input parameters
		- UserId (for tracking) - ???
		- CaseOrDbNm - from planComboBox
		- SchedNm - from schedComboBox
		- StartOpZDayNbr - from daysText
		- EndOpZDayNbr - from daysText
		- EqTypeListTxt - from getEqTypeList()
	*/
	var planName = $("#planComboBox option:selected").text();
	if (!isDefined(planName) || planName.length == 0) {
		showValidationError("Please select a 'Plan' from the list.", "CaseOrDbNm must be set");
		return;
	}
	var schedName = $("#schedComboBox option:selected").text();
	if (!isDefined(schedName) || schedName.length == 0) {
		showValidationError("Please select a 'Schedule' from the list.", "SchedNm must be set");
		return;
	}
	// Validation: Make sure user entered at least one value (start or end day)
	if (days.length <= 1) {
		showValidationError("Please enter a start (or end) day for the query.", "StartOpZDayNbr and EndOpZDayNbr must be set");
		return;
	}
	// Only perform this if !phaseIn *and* !phaseOut
	if (!phaseIn && !phaseOut) {
		// Correction: If only one day was entered, set the other to match (single day range);
		// they can't both be 0 because days.length > 1
		if (days.length == 2 && (days[0] == 0 || days[1] == 0)) {
			if (days[0] == 0) {
				days[0] = days[1];
			} else {
				days[1] = days[0];
			}
			console.log("Setting start day = end day [" + days[0] + "]");
			$("#daysText").val(days[0] + "-" + days[1]);
		}
		// Validation: Make sure that start day <= end day
		if (days.length == 2 && days[0] > days[1]) {
			showValidationError("Please enter a start day that is less than or equal to the end day.",
				"StartOpZDayNbr must be less than or equal to EndOpZDayNbr");
			return;
		}
		// Validation: Make sure that end day <= planPerDayQty
		if (days.length == 2 && days[1] > planPerDayQty) {
			showValidationError("Please enter an end day that is less than or equal to " + planPerDayQty + ".",
				"EndOpZDayNbr must be less than or equal to PlanPerDayQty");
			return;
		}
	} else {
		if (phaseIn) {
			days[0] = '01';
			phaseInOutCd = "IN";
		}
		if (phaseOut) {
			days[1] = planPerDayQty;
			if (phaseInOutCd !== "IN") {
				phaseInOutCd = "OUT";
			} else {
				phaseInOutCd = "BOTH";
			}
		}
		$("#daysText").val(days[0] + "-" + days[1]);
	}
	console.log("phaseInOutCd: " + phaseInOutCd);
	var eqTypeList;
	if (!snapshotMode) {
		eqTypeList = getEqTypeList(eqType);
		if (!isDefined(eqTypeList) || eqTypeList.length == 0) {
			showValidationError("Please select at least one equipment group.", "EqTypeListTxt must be set");
			return;
		}
	}

	isCycleMode = $("#cycleModeChkBox").is(":checked");

	var params = {
		// TODO get userId from Pegasus; just not sure how
		// getUserId() doesn't do anything... and it's not required by TRAC engine
		UserId: isPrototype ? "326202" : "userId",
		CaseOrDbNm: $("#planComboBox option:selected").text(),
		SchedNm: $("#schedComboBox option:selected").text(),
		StartOpZDayNbr: days[0],
		EndOpZDayNbr: (days.length < 2) ? days[0] : days[1],
		// TODO Add handing for PhaseInOutCd: IN, OUT, BOTH
		PhaseInOutCd: phaseInOutCd,
		SchedulerModeCd: $("#assignComboBox option:selected").val(),
		PatternMatchingCd: $("#patternCmbBox").val(),
		UseForcedLinksFlg: $("#forcedLinksChk").is(":checked") ? "YES" : "",
		// TODO Do I need to add handling for OperationTxt? Pass nothing = All (LEG, MX, SP)
		EqTypeListTxt: snapshotMode ? eqType : getEqTypeList(eqType),
		MergeEqTypeCd: $("#mergeTypesChk").is(":checked") ? "ALL" : "",
		UseCycleMode: isCycleMode ? "YES" : "NO",
		CycleTimesListTxt: isCycleMode ? getCycleTimesList() : ""
	};
	if (!snapshotMode) {
		console.log("using params: " + JSON.stringify(params));
	}

	$.when(

		$.ajax(
			snapshotMode ? {
				url: "data/" + eqType + "-combined.json",
				dataType: "JSON",
				beforeSend: function() {
					$("#loading").show();
					startSpinner(document.getElementById("loading"));
				},
				complete: function() {
					$("#loading").hide();
					stopSpinner();
				}
			} : {
				type: "POST",
				// url: "http://mktg-326202-w1.corp.ds.fedex.com:7001/itrsService/tracJSON",
				// url: PEGASUS_SERVICE_SERVER_URL + "/itrsService/tracJSON",
				// url: "http://dje00292.ute.fedex.com:7041/itrsService/tracJSON",
				// url: "http://mktg-326202-w1.corp.fedex.com:8080/SIServer/itrsService/tracJSON",
				url: isPrototype ? "http://mktg-326202-w1.corp.ds.fedex.com:7001/itrsService/tracJSON" : CONTEXT_NAME + "/itrsService/tracJSON",
				data: JSON.stringify(params),
				dataType: "JSON",
				beforeSend: function() {
					$("#loading").show();
					startSpinner(document.getElementById("loading"));
				},
				complete: function() {
					$("#loading").hide();
					stopSpinner();
				}
			}
		)
		// FIXME Need to find a better way to switch...
		// Ajax call for "live" data via servlet (with CORS)
		// $.ajax({
		// 	type: "POST",
		// 	url: "http://mktg-326202-w1.corp.ds.fedex.com:7001/itrsService/tracJSON",
		// 	data: JSON.stringify(params),
		// 	dataType: "JSON"
		// })
		// Ajax call for "snapshot" data
		// $.ajax({
		// 	url: "data/" + eqType + "-combined.json",
		// 	dataType: "JSON"
		// })
	).done(function(jsonData) {

		// hide the "loading..." message
		// document.getElementById('loading').style.display = 'none';

		// $("#loading").hide();
		// stopSpinner();

		var summaries = [];
		jsonData.summaries.forEach(function(summary) {
			summaries[summary.eqType] = summary;
		});
		console.log(summaries);
		lastSummaries = summaries;

		// DOM element where the Timeline will be attached
		var container = document.getElementById("visualization");
		// lastContainer = container;

		// Create a DataSet
		var groups = new vis.DataSet(jsonData.groups);
		lastGroups = groups;

		// TODO Use templates to generate the contents for group
		// from eqType, eqDesc, tailNbr (special handling
		// required for tailNbr === 0)
		var summaryGroups = [];
		var groupTemplate = Handlebars.compile($("#group-template").html());
		groups.forEach(function(group) {
			if (group.tailNbr !== "0") {
				var context = {eqtype: group.eqType, eqdesc: group.eqDesc, tailnbr: group.tailNbr};
				groups.update({id: group.id, content: groupTemplate(context)});
			} else {
				// Had to set font-size to increase row-height (default was 8pt) -tc
				groups.update({id: group.id, content: "<span style=\"font-size:12pt\">&nbsp;</span>"});
				summaryGroups.push(groups.get(group.id));
			}
		});

		// Create a DataSet (allows two way data-binding)
		var items = new vis.DataSet(jsonData.items);
		lastItems = items;

		// Figure out where the timeline should start and end
		var timelineStart = 0;
		var timelineEnd = 0;
		items.forEach(function(item) {
			if (item.routeType !== "spare" && item.routeType !== "maint"
					&& item.type !== "background") {
				if (timelineStart === 0) {
					timelineStart = item.start;
					timelineEnd = item.end;
				} else {
					if (item.start < timelineStart) {
						timelineStart = item.start;
					}
					if (item.end > timelineEnd) {
						timelineEnd = item.end;
					}
				}
			}
		});

		var nextItemId = items.max("id").id + 1;
		for (var i = 0; i < summaryGroups.length; i++) {
			var group = summaryGroups[i];
			var summary = summaries[group.eqType];
			var newItem = {id: nextItemId++, start: timelineStart, end: timelineEnd,
				eqDesc: summary.eqDesc, eqType: summary.eqType,
				acAvblQty: summary.acAvblQty, acActQty: summary.acActQty,
				minGndTmQty: summary.minGndTmQty, planActQty: summary.planActQty,
				group: group.id, className: "summary", type: "background"};
			items.add(newItem);
		};

		// Configuration for the Timeline
		var options = {
			groupOrder: orderGroups, // "content",
			orientation: {
				axis: "both",
				item: "top"
			},
			padding: 2,
			margin: {
				axis: 2,
				item: {
					horizontal: 1,
					vertical: 4
				}
			},
			// height: (getHeight()-16)+'px',
			template: multiLine ? formatLegOrActivity : formatLegOrActivitySkinny,
			dataAttributes: "all",
			showCustomTime: true,
			min: timelineStart,
			max: timelineEnd
		};
		lastOptions = options;

		// Create a Timeline
		timeline = new vis.Timeline(container, items, groups, options);
		// Replaced this by setting min, max above in options -tc
		// timeline.setWindow(timelineStart, timelineEnd);
		timeline.setCustomTime(getMidPointForDates(timelineStart, timelineEnd));

		timeline.generateTooltips = true;
		// Set up the tool tips for the items
		// setToolTips();

		timeline.on("finishedRedraw", function() {
			setToolTips();
		});

		dataLoaded = true;
	});
}

/* Moved from load-md11-sample.html on 2015-01-25 (after check-in) */
/*
	applyDisplaySetting
		loads the data if it's not already been loaded; updates/reloads the data, as
		needed, as the user adjusts the settings
 */
/*global dataLoaded:true, loadedEqType:true, multiLine:true, updateProgressDialogTitle */
function applyDisplaySettings(eqType) {
	"use strict";

	// Replace background image with spinner
	$("#itrsSection").hide();

	// Initial load
	if (!dataLoaded) {
		// $("#loading").show();
		// startSpinner(document.getElementById("loading"));

		// Load the data
		loadTRACData(eqType);
		loadedEqType = eqType;

		enableConfiguration(true);

		// $("#multiLineChkBox").prop("checked", true);
		enableDisplayOptions(true);
		enableGroundTime(true);

		// TODO Update the window's title

		saveQueryConfiguration(lastQueryConfig);

		// Collapse the ITRS Options panel
		if (!validationFailed) {
			$("#itrsOptions div span.ui-icon.ui-icon-arrowthickstop-1-e").click();
		}

	// Changing data files
	} else if (!(eqType === loadedEqType) || checkQueryConfigurationForChanges(lastQueryConfig) === true) {
		// $("#loading").show();
		// startSpinner(document.getElementById("loading"));

		$(".vis.timeline.root").remove();

		// Reset the display options to defaults
		resetDisplayOptions();
		resetGroundTime();

		hiddenGroups = new vis.DataSet();
		lastGndTmItems = [];

		// Load the data
		loadTRACData(eqType);
		loadedEqType = eqType;

		// TODO Update the window's title

		saveQueryConfiguration(lastQueryConfig);

		// Collapse the ITRS Options panel
		if (!validationFailed) {
			$("#itrsOptions div span.ui-icon.ui-icon-arrowthickstop-1-e").click();
		}

	// Changing display options
	} else {

		var isMultiLineChecked = $("#multiLineChkBox").is(":checked");
		var shouldShowDialog = (isMultiLineChecked !== multiLine || lastItems.length > 250 || lastGroups.length > 50);

		if (shouldShowDialog) {
			showProgressDialog(true, "Applying changes...", "dialog");
		}

		setTimeout(function() {
			if (isMultiLineChecked !== multiLine) {

				// if (shouldShowDialog) {
				// 	updateProgressDialogTitle("Changing visualization...");
				// }

				if (isMultiLineChecked) {
					switchTemplate(formatLegOrActivity);
				} else {
					switchTemplate(formatLegOrActivitySkinny);
				}
				multiLine = isMultiLineChecked;
			} else {
				var timeZone = $("input[type='radio'][name='timeZone']:checked");
				if (lastTimeZone !== timeZone) {
					timeline.generateTooltips = true;
					setToolTips();
				}
			}
		}, 50);


		// if (shouldShowDialog) {
		// 	updateProgressDialogTitle("Applying filters...");
		// }

		setTimeout(function() {
			// Refine what's displayed
			removeGrayOutNoVolumeLegStyles();

			// Show Load Info?
			if ($("#showLoadInfoChkBox").is(":checked") === false) {
				legsWithoutVolumes("no-volume");
			}

			// Filter out by leg type
			if ($("#packageLegChkBox").is(":checked") === false) {
				grayOutPackageLegs();
			}
			if ($("#maintenanceLegChkBox").is(":checked") === false) {
				grayOutMaintenanceLegs();
			}
			if ($("#nonPackageLegChkBox").is(":checked") === false) {
				grayOutNonPackageLegs();
			}
			if ($("#spareLegChkBox").is(":checked") === false) {
				grayOutSpareLegs();
			}
			if ($("#stagingLegChkBox").is(":checked") === false) {
				grayOutStagingLegs();
			}
			if ($("#domLegChkBox").is(":checked") === false) {
				grayOutLegsByGroup("Dom");
			}
			if ($("#intlLegChkBox").is(":checked") === false) {
				grayOutLegsByGroup("Intl");
			}

			// Filter out by origin and/or destination (eliminate any stray whitespace)
			var orig = $("#origDestDispOrigin").val().replace(/ /g, "").toUpperCase();
			var dest = $("#origDestDispDest").val().replace(/ /g, "").toUpperCase();
			if (orig.length > 0 || dest.length > 0) {
				grayOutLegsByOrigDest(orig, dest);
			}

			// Search for ground time
			if ($("#durationGndTmText").val().length > 0 ) {
				toggleGroundTimeResults(true);
			} else {
				toggleGroundTimeResults(false);
			}

			showProgressDialog(false);

			$("#itrsOptions div span.ui-icon.ui-icon-arrowthickstop-1-e").click();
		}, 50);
	}
}

/*global createOptionsPanelByDiv, createKendoDropDown */
$(document).ready(function() {
	"use strict";

	if (isPrototype === true) {
		initializeCommonCaseMap();
		if (snapshotMode) {
			$("#prototypeEqTable").show();
			$("#liveEqTable").hide();
		} else {
			$("#prototypeEqTable").hide();
			$("#liveEqTable").show();
		}
	} else {
		$("#prototypeEqTable").hide();
		$("#liveEqTable").show();
	}

	//create the drawer
	createOptionsPanelByDiv($("#itrsOptions"), "slide-right", false, true,
		"66px", "450px");
	$("#displayOptionsTabstrip").kendoTabStrip({
		animation: {
			open: {
				effects: "fadeIn"
			}
		}
	});

	$("#daysText").kendoMaskedTextBox({
		mask: "00-00",
		promptChar: "0"
	});

	var planTemplate =
		"#if(data.allowed == true){ #<span>#:data.commonCaseName#</span>"
			+ "#}else{#<div class=\"k-item\" style=\"color:grey\" disabled=\"disabled\">#:data.commonCaseName#</div>#}#";
	createKendoDropDown("planComboBox", "commonCaseName", "commonCaseId", planTemplate, planChangeHandler, "allowed");

	var scheduleTemplate =
		"#if(data.hasAccess == true){ #<span>#:data.name#</span>"
			+ "#}else{#<div class=\"k-item\" style=\"color:grey\" disabled=\"disabled\">#:data.name#</div>#}#";

	createKendoDropDown("schedComboBox", "name", "id", scheduleTemplate, null, "hasAccess");

	$("#durationGndTmText").kendoMaskedTextBox({
		mask: "00:00",
		promptChar: "0"
	});

	$("#assignComboBox").kendoDropDownList();
	$("#patternCmbBox").kendoDropDownList();

	$("#operatorCmb").kendoDropDownList();

	loadPlanComboBox(getCaseList());

	if (isPrototype) {
		$("#planComboBox").data("kendoComboBox").select(0);
	}

	/*
	// Set a trigger to generate a 'resizeEnd' 500 ms after last 'resize'
	$(window).resize(function() {
		if (this.resizeTO) clearTimeout(this.resizeTO);
		this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
		}, 100);
	});

	// Listen for resizeEnd and adjust timeline's height
	$(window).bind('resizeEnd', function() {
		timeline.setOptions( { 'height': (getHeight()-16)+'px' } );
		console.log("resize called");
	});
	*/

	enableConfiguration(false);

	$("#multiLineChkBox").prop("checked", false);
	enableDisplayOptions(false);
	enableGroundTime(false);

	initializeTemplates();
});

/*exported selectAllEqTypes */
function selectAllEqTypes(selected) {
	var eqChkBoxes = $("input[type='checkbox'][name$='EqType']");
	eqChkBoxes.each(function() {
		$(this).prop("checked", selected);
	});
}

/*exported getSelectedEqTypes */
function getSelectedEqTypes() {
	"use strict";
	var eqType = "";
	var selected;
	if (snapshotMode) {
		selected = $("input[type='radio'][name='eqType']:checked");
		if (selected.length > 0) {
			eqType = selected.val();
		}
		console.log("selected eqType: [" + eqType + "]");

		// FIXME Remove - just testing input handling -tc
		var selectedChk = $("input[type='checkbox'][name$='EqType']:checked");
		var eqTypeAry = [];
		selectedChk.each(function() {
			eqTypeAry.push($(this).val());
		});
		console.log("selected eqType(s): [" + eqTypeAry.join(",") + "]");
		//
	} else {
		var eqTypeAry = [];
		selected = $("input[type='checkbox'][name$='EqType']:checked");
		selected.each(function() {
			eqTypeAry.push($(this).val());
		});
		eqType = eqTypeAry.join(",");
	}
	// console.log("eqType: [" + eqType + "]");
	return eqType;
}

/* Export functions that are meant to be shared */
this.applyDisplaySettings = applyDisplaySettings;
this.formatGroupInfo = formatGroupInfo;
this.enableConfiguration = enableConfiguration;
this.enableDisplayOptions = enableDisplayOptions;
this.resetDisplayOptions = resetDisplayOptions;
this.enableGroundTime = enableGroundTime;
this.getSelectedEqTypes = getSelectedEqTypes;
