<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>
<html:html>
<head>
<title>Route Information</title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
	
<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options -->
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/scheduleMaintenance.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/searchPopUp.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxREGridController.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/scheduleMatrixRouteEditor.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxCommonUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/scheduleMaintenanceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>

<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>"></script>
</head>
<script>
	$(document).ready(function() {
		initializeRouteEditor();
	});
      
</script>
</head>

<body onresize="onResize(event)" oncontextmenu="return false;">
	<!--  Progress Window Dialog Place Holder  -->
	<div id="progressDialogDiv" > 
	</div> 
   	<!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
			<!-- <a id="dupicateRoute" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR).addDuplicateRoute(this);" class="iconbtn" title="<bean:message key='header.icon.dupicateRoute' bundle='filters'/>" href="#">
	    		<span class="k-icon dupicate-route">
	    			<bean:message key='header.icon.dupicateRoute' bundle='filters'/>
	    		</span>
	    	</a>-->
			<a id="saveToWip" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR).saveToWIP(this);" class="iconbtn" title="<bean:message key='header.icon.saveToWip' bundle='filters'/>" href="#">
	    		<span class="k-icon save-settings-disable">
	    			<bean:message key='header.icon.saveToWip' bundle='filters'/>
	    		</span>
	    	</a>
	    	<a id="saveToSchedule" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR).saveToSchedule(this);" class="iconbtn" title="<bean:message key='header.icon.saveToSchedule' bundle='filters'/>" href="#">
	    		<span class="k-icon save-settings-disable">
	    			<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
	    		</span>
	    	</a>
			<a id="toggleREZulu" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR).showLocalZuluColumns(this);" toggled=false class="iconbtn" title="<bean:message key='header.icon.toggleLZTime' bundle='filters'/>" href="#">
	    		<span class="k-icon icon-toggle-local">
	    			<bean:message key='header.icon.toggleLZTime' bundle='filters'/>
	    		</span>
	    	</a>
	    	<a id="deleteRoute" onclick="parent.getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR).deleteRoute(this);" class="iconbtn" title="Delete Route" href="#">
	    		<span class="k-icon icon-delete-route" style="height:24px !important;width:24px !important;-webkit-transform: scale(0.8)">
	    			Delete Route
	    		</span>
	    	</a>
	    </div>	
 	</div>
   	<!--  Buttons Bar - end -->
	<div id="scheduleMatrixMainDiv" style="height: 100%;width:100%;">
		<div id="routeMatrixDiv" style="padding:0px; height:100px;">
			<div id="routeMatrixGrid" style="overflow:hidden"></div>
			<script type="text/x-kendo-template" id="legsGrid">
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