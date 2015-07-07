<%@ taglib uri="/tags/struts-logic" prefix="logic"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>
<html:html>
<head>
<title>Schedule Maintenance</title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>

<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for slider settings panel-->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/scheduleMaintenance.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/searchPopUp.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- jQuery Script -->
<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxREGridController.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/scheduleWIPMatrix.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxCommonUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/scheduleMaintenanceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>

<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>"></script>
<script>
	$(document).ready(function() {
		initializeWIPMatrix();
	});
</script>
</head>

<body style="width:100%;height:100%" oncontextmenu="return false;">
	<!--  Progress Window Dialog placehodler  -->
 	<div id="progressDialogDiv" > 
 	</div>
	<!--  Buttons Bar - start -->
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
			<a id ="WIPHeaderId" onclick="parent.VIEWER.enableRouteEditor(this, true)" title="Enable WIP" class="iconbtn" title="" href="#">
	    		<span class="k-icon icon-add-route">
	    		</span>
			 </a>
			<a id="deleteFromWIP" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).deleteFromSchedule(this);" class="iconbtn" title="Delete from Schedule" href="#">
	    		<span class="k-icon icon-delete-route-disable" style="height:24px !important;width:24px !important;-webkit-transform: scale(0.8)">Delete from Schedule</span>
	    	</a>
			<a id="saveToScheduleWIP" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).saveToSchedule(this);" class="iconbtn" title="<bean:message key='header.icon.saveToSchedule' bundle='filters'/>" href="#">
	    		<span class="k-icon save-settings-disable">
	    			<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
	    		</span>
	    	</a>
			<a id="toggleWIPZulu" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).showLocalZuluColumns(this);" toggled=false class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='filters'/>" href="#">
	    		<span class="k-icon icon-toggle-local">
	    			<bean:message key='header.icon.zulu' bundle='filters'/>
	    		</span>
	    	</a>
	    </div>	
 	</div>
   <!--  Buttons Bar - end -->
   	<div id="scheduleMatrixMainWIPDiv" style="height: 100%;width:100%;">
		<div id="routeMatrixWIPDiv" style="padding:0px; height:100px;">
			<div id="routeMatrixWIPGrid" style="overflow:hidden"></div>
			<script type="text/x-kendo-template" id="legsWIPGrid">
			<div id="tabstrip">
				<ul>
					<li class="k-state-active">Legs</li>
					<li>Allocation</li>
					<li>Utilization</li>
					<li>Seasons</li>
				</ul>
				<div>
					<div class="k-legs-grid"></div>
				</div>
				<div>
					<div class="k-allocation-grid"></div>
				</div>
				<div>
					<div id="utilizationGrid"></div>
				</div>
				<div>
					<div class="k-seasons-grid"></div>
				</div>
			</div>
			</script>
			<script type="text/x-kendo-template" id="allocGridTemp">
				<div class="k-locAllocation-grid"></div>
			</script>
		</div>
	</div>
		<!--<div id="routeNumberDialog" style="margin: 0;padding: 0;display:none;">
	  	<div id="routeNumberMain" style="overflow:auto; width:82%;height:100%;float: left;">
	 		<ul id="listView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;" ></ul>
		</div>
		<div id="routeNumberSub" style="overflow:auto;width:18%;height:100%;float:left;">
		 	<ul id="subListView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;"></ul>
		</div>
	</div>
	<div id="truckNumberDialog" style="margin: 0;padding: 0;display:none;">
		<div id="truckNumberSub" style="overflow:auto;width:100%;height:100%;float:left;">
 			<ul id="trucksubListView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;">
	 		</ul>
		</div>
	</div>
 	<div id="scheduleMatrixWIP" style="height: 100%;width:100%;">
		<div style="padding:0px; height:100px;">
			<div id="scheduleMatrixWIPGrid" style="overflow:hidden"></div>
		</div>
		<div style="float: right; height: 30px;bottom: 5px;position: absolute;width: 100%;text-align: right;right: 10px;">
			<input type="button" value="Time & Cost" onClick="timeAndCostScheduleData();"/>
			<input type="button" value="Save" onClick="saveScheduleData();"/>
			<input id="delete" type="button" value="Remove from WIP" class="sqw-button" onClick="deleteScheduleData();"/>
		 	<input type="button" value="Cancel" onclick="closeWIPWindow(this);"/>
		</div>
		<div id="commentsWindowDiv" style="width: 100%;height: 100%;display: none; overflow:hidden; padding:0px; padding-top:10px; ">
			<div style="height: 232px;width: 340px;overflow-y: scroll;  margin-left:10px;"><label style="white-space: pre-wrap;height: 250px;width: 340px" id="comments"></label></div>
			<div style="height: 0px;width: 340px;"></div>
			<div style="height: 100%;width: 100%; text-align: center;" class="footerCloseButtonDivStyle" padding-bottom:10px><input type="button" onclick="commentsOKButtonEvent()" value="OK"/></div>
		</div>
	</div>-->
	 <!--  Confirmation Dialog placehodler  need to make it generic component-->
	<div id='alertWindow' style="display: none;text-align: center;">
		<div id="confirmationDiv" style="margin-top: 10px; display: table;width: 100%">
		</div>
		<div style="margin-top: 25px;">
			<input id="yesLegBtn" onclick="alertClickHandler(event, true, 'legRow')" style="display:none; min-width: 45px !important; width:130px; display: table-cell; vertical-align: middle;" type="button" value="Yes - Delete Leg"/>
			<input id="yesBtn" onclick="alertClickHandler(event, true)" style="min-width: 45px !important; width:130px; display: table-cell; vertical-align: middle;" type="button" value="Yes - Delete Route"/>
			<input id="noBtn" onclick="alertClickHandler(event, false)" style="min-width: 45px !important; width:130px; display: table-cell; vertical-align: middle;" type="button" value="No - Do Not Delete"/>
		</div>
	</div>
	<div id ="revisionAlertWindow">		
	</div>
	<div id="routeNumberDialog" style="margin: 0;padding: 0;display:none;">
	  	<div id="routeNumberMain" style="overflow:auto; width:82%;height:300px;float: left;">
	 		<ul id="listView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;" ></ul>
		</div>
		<div id="routeNumberSub" style="overflow:auto;width:18%;height:300px;float:left;">
		 	<ul id="subListView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;"></ul>
		</div>
		<div style="width: 100%;position: absolute;bottom: 0;border-top: 1px solid #94c0d2;text-align: center;padding-top: 5px;padding-bottom: 5px;">
			<input type="button" value="Apply" onClick="getRouteNo(event)"/>
		</div>
	</div>
	<div id="truckNumberDialog" style="margin: 0;padding: 0;display:none;">
		<div id="truckNumberSub" style="overflow:auto;width:100%;height:250px;float:left;">
 			<ul id="trucksubListView" style="padding:5px;border:none;font-size:0.9em;font-family: HelveticaNeue, Helvetica Neue, Helvetica, Arial;font-weight: bold;">
	 		</ul>
		</div>
		<div style="width: 100%;position: absolute;bottom: 0;border-top: 1px solid #94c0d2;text-align: center;padding-top: 5px;padding-bottom: 5px;">
		<input type="button" value="Apply" onClick="getRouteNo(event)" style="min-width: 0px !important;min-height: 0px !important"/>
		</div>
	</div>
</body>
</html:html>