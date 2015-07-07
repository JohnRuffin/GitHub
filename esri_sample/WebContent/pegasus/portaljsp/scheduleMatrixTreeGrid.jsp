<%@ taglib uri="/tags/struts-logic" prefix="logic"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html:html>
<head>
<title>Schedule Matrix</title>

<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonTreeGridImports.jsp" %>
<link href="<%=contextName%>/pegasus/styles/kendo.common.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.default.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<script src="<%=contextName%>/pegasus/js/kendo/kendo.all.min.js<%=jsVersion%>" ></script>
<!-- Pegasus TreeGrid CSS-->
<link href="<%=contextName%>/pegasus/portalcss/treegrid/index.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/treegrid/flexicious.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/treegrid/jquery-ui-1.9.1.custom.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/treegrid/custom.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for slider settings panel-->
<link href="<%=contextName%>/pegasus/portalcss/scheduleMatrix.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for schedule matrix-->
<link href="<%=contextName%>/pegasus/portalcss/popupWindow.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for schedule matrix-->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- jQuery Script -->
<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/searchCriteriaUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonVolumeMatrixUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/matrixTreeGridUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/widgets/advancedDataGrid.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/scheduleMatrixTreeGrid.js<%=jsVersion%>" type="text/javascript" ></script>

<!-- Pegasus TreeGrid JS-->
<script src="<%=contextName%>/pegasus/js/treegrid/themes.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/js/treegrid/Configuration.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/js/treegrid/CustomFilterControl.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/treegrid/CustomHeaderCell.js<%=jsVersion%>"></script>
<!--  
<script src="<%=contextName%>/pegasus/js/treegrid/CustomHeaderCell.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/treegrid/CustomBootstrap.js<%=jsVersion%>"></script>
-->
<!--End code for Pegasus TreeGrid JS-->

<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
<script>
	$(document).ready(function() {
		initialize();
		initalizeMouseEventsForGrouping(getContainerId(),$('#groupBar'));
	});
	var isNetworkScheduleFlag = <%="true".equals(request.getParameter("isNetworkSchedule"))%>;
</script>
</head>
<body style="width:100%;height:100%" oncontextmenu="return false;">
  	<div id="scheduleMatrixTreeGrid">
    	<div id="groupBar" class ="group-bar">Drag a column here to group by that column.</div>
    	<div id="scheduleMatrixTreeGridDivContainer" style="position: absolute;  left: 10px;right: 10px;top:60px; bottom: 10px;"></div>
	</div>
	
	<div id ="favoriteWindowsParentDiv" style="display: none;"></div>
 	
 	<div id="matrixDisplayOptions" class="slidingWinOpt" style="width:465px; height:100%;">
		<div class="header-title"><bean:message key='display.option.label' bundle='matrixresources'/></div>
		<div class="slidingWinContent" style="height:85%; overflow-y:scroll; overflow-x:hidden;">
			<div id="displayOptionsDiv" class="panelBG">
 				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td valign="top" width="50%">
							<div class="section-box">
								<table id="selectablechekboxesDiv">
									<tr>
										<td>
											<label class="section-header"><bean:message key='display.option.selectcoldishide' bundle='matrixresources' /></label>
										</td>
									</tr>
								</table>
							</div>
						</td>
						<td class="settings-right-column" valign="top" width="50%">
							<div class="section-box">
								<table id="timeRelatedcolumnsDiv">
									<tr>
										<td>
											<label class="section-header"><bean:message key='display.option.show.timeRelated.columns' bundle='matrixresources' /></label>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
   	
   	<!--  Progress Window Dialog placehodler  -->
    <div id="progressDialogDiv"></div>
    
    <!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
		
			<a id="routeEdit_<%="true".equals(request.getParameter("isNetworkSchedule"))%>" onclick="" class="iconbtn" title="Open Route(s) in WIP" href="#">
	    		<span class="k-icon edit-route-disable">
	    		</span>
	    	</a>		
	 		<a id="mConnectivity" onclick="openScheduleMatrixDashboard(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, <%="true".equals(request.getParameter("isNetworkSchedule"))%>)" class="iconbtn" title="<bean:message key='header.icon.volumeutilization.matrix' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon open-utilization-matrix">
	    		</span>
	    	</a>
	    	<a id="openODPD" onclick="openScheduleMatrixDashboard(DASHBOARD_ID_ALLOCATION_MATRIX, <%="true".equals(request.getParameter("isNetworkSchedule"))%> )" class="iconbtn" title="<bean:message key='header.icon.allocation.matrix' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon open-allocations-matrix">
	    		</span>
	    	</a>
	    	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	 		<a id="btnScheduleMatrixSyncMap" class="iconbtn n-icon" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').switchAndEnableSync(this,'<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>','<%="true".equals(request.getParameter("isNetworkSchedule")) ? "mapViewDiv,schematicViewDiv,networkMatrixTreeGridDiv,scheduleMatrixTreeGridDiv" : "mapViewDiv,schematicViewDiv,networkMatrixTreeGridDiv,networkscheduleMatrixTreeGridDiv"%>', 'sync-to-schematic',true)" title="<bean:message key='header.icon.syncto.map' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon sync-to-map">
	    			<bean:message key='header.icon.syncto.map' bundle='matrixresources'/>
	    		</span>
	    	</a>
		    <a id="btnScheduleMatrixSyncSchematic" class="iconbtn n-icon" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').switchAndEnableSync(this,'<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>','<%="true".equals(request.getParameter("isNetworkSchedule")) ? "mapViewDiv,schematicViewDiv,networkMatrixTreeGridDiv,scheduleMatrixTreeGridDiv" : "mapViewDiv,schematicViewDiv,networkMatrixTreeGridDiv,networkscheduleMatrixTreeGridDiv"%>', 'sync-to-map',true)" title="<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>" href="#">
	       		<span class="k-icon sync-to-schematic">
	       			<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>
	       		</span>
	       	</a>
	 	   	<a id="mRefresh" class="iconbtn" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').refreshMatrix(true,true)" title="<bean:message key='header.icon.refresh' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon icon-refresh">
	    			<bean:message key='header.icon.refresh' bundle='matrixresources'/>
	    		</span>
	    	</a>
	    	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	       	<a id="" class="iconbtn" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').exportToExcel(this)" title="<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>" href="#">
	       		<span class="k-icon export-to-excel">
	       			<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>
	       		</span>
	       	</a>
	       	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	    	<%-- <a id="toggleMZulu" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').showLocalZuluColumns(this)" toggled=true class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon icon-toggle-local">
	    			<bean:message key='header.icon.zulu' bundle='matrixresources'/>
	    		</span>
	    	</a> 
	    	<a id="mnCal" onclick="getDashboardContentWindow('<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkscheduleMatrixTreeGridDiv" : "scheduleMatrixTreeGridDiv")%>').openDayControl(this)" class="iconbtn" title="<bean:message key='header.icon.calendar' bundle='matrixresources'/>" href="#">
	     		<span class="k-icon icon-select-calendar">
	     		</span>
	     	</a> --%>
	       	<ul id ="<%=("true".equals(request.getParameter("isNetworkSchedule")) ? "networkScheduleMatrixFavoritesMenu" : "scheduleMatrixTreeGridFavoritesMenu")%>" class="iconbtn favorite-dropdown" 
	         	title = "<%=("true".equals(request.getParameter("isNetworkSchedule"))?"Create and manage network schedule matrix favorites":"Create and manage schedule matrix favorites")%>">
			</ul>
			<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    	</div>
	    </div>	
 	</div>
	<!--  Confirmation Dialog for SM to WIP routes transfer-->
	<div id='alertSmToWipWindow' style="display: none;text-align: center;">
		<div id="confirmationDiv" style="margin-top: 10px; display: table;width: 100%">
		</div>
		<div style="margin-top: 25px;">
			<input id="OkBtn" onclick="okClickHandler(event)" style="display:none; min-width: 45px !important; width:130px; display: table-cell; vertical-align: middle;" type="button" value="OK"/>
		</div>
	</div>
	<div id="commentsWindowDiv" style="width: 100%;height: 100%;display: none; overflow:hidden; padding:0px; padding-top:10px; background: white !important; ">
		<div style="height: 232px;width: 340px;overflow-y: scroll;  margin-left:10px; background: white !important;"><label style="white-space: pre-wrap;height: 250px;width: 340px;padding: 0;" id="comments"></label></div>
		<div style="height: 0px;width: 340px;"></div>
		<div style="height: 100%;width: 100%; text-align: center;" class="footerCloseButtonDivStyle" padding-bottom:10px><input type="button" onclick="commentsOKButtonEvent()" value="OK"/></div>
	</div>
</body>
</html:html>