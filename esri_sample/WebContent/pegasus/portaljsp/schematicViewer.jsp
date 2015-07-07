<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html style="height:100%;">
<head>
<title><bean:message key='window.title.schematicwindow' bundle='schematicresources'/></title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
<link href="<%=contextName%>/pegasus/portalcss/schematicViewer.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for schematic viewer -->
<link href="<%=contextName%>/pegasus/portalcss/popupWindow.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for popup window -->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<!-- jQuery Script -->
<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/goJS/go.js<%=jsVersion%>" type="text/javascript" ></script> <!--  Schematic view  -->
<script src="<%=contextName%>/pegasus/portaljs/schematicViewer.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/viewerUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/viewerSettings.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/schematicDiagram.js<%=jsVersion%>" type="text/javascript"></script>         
<script src="<%=contextName%>/pegasus/portaljs/schematicDiagramContainer.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/transitPopUp.js<%=jsVersion%>" type="text/javascript"></script>   
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/searchCriteriaUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/activityDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/laneDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/legDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/uicontrols.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonVolumeMatrixUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>"></script>
<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
<script>
	$(document).ready(function() {
		initialize();
		parent.setDashboardInitialized(parent.DASHBOARD_ID_SCHEMATIC_VIEW);
	});
</script>
</head>

<body style="width:100%;height:100%" oncontextmenu="return false;">
   <div id="schematicView" style="height: 100%;width: 100%; overflow: hidden;">
   		<!--  Progress Window Dialog placehodler  -->
        <div id="progressDialogDiv" > 
        </div> 
		<!--  Buttons Bar - start -->	
		<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
			<div class="btnsWrapper">
		     	<a id="btnExpandCollapse" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).toggleExpand(this, true);" class="iconbtn" title="<bean:message key='header.icon.expandall' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon expand-all">
		     			<bean:message key='header.icon.expandall' bundle='schematicresources'/>
		     		</span>
		     	</a>
		     	<a id="optimizeView" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).refreshWithOptimizedPlacement();" class="iconbtn" title="<bean:message key='header.icon.optimize.view' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon optimize-schematic">
		     			<bean:message key='header.icon.optimize.view' bundle='schematicresources'/>
		     		</span>
		     	</a>
		     	<a id="btnSchematicDirection" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).toggleDirection(this, true)" class="iconbtn" title="<bean:message key='header.icon.display' bundle='mapresources'/>" href="#">
	        		<span class="k-icon icon-both-view">
	        			<bean:message key='header.icon.display' bundle='mapresources'/>
	        		</span>
	        	</a>
		     	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		<a id="schematicSView" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).toggleView(this,true)" class="iconbtn" title="<bean:message key='header.icon.network.view' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon icon-network-view" >
		     		</span>
		     	</a>
		     	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		<a id="btnSchematicSyncMap" class="iconbtn n-icon" onclick="enableSync(this,DASHBOARD_ID_SCHEMATIC_VIEW,[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'icon-sync-to-matrix')" title="<bean:message key='header.icon.syncto.map' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon sync-to-map">
		     			<bean:message key='header.icon.syncto.map' bundle='matrixresources'/>
		     		</span>
		     	</a>
		     	<a id="btnSchematicSyncMatrix" class="iconbtn n-icon" onclick="enableSync(this,DASHBOARD_ID_SCHEMATIC_VIEW,[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'sync-to-map')" title="<bean:message key='header.icon.syncto.matrix' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon icon-sync-to-matrix">
		     		</span>
		     	</a>
		     	<a id="mRefresh" class="iconbtn" title="<bean:message key='header.icon.refresh' bundle='schematicresources'/>" href="#"
		     		onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).resetDashboard(true)">
		     		<span class="k-icon icon-refresh">
		     		</span>
		     	</a>
		     	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
		     	<a id="toggleSZulu" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).toggleTimeView(this, true)" toggled=false class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon icon-toggle-local">
		     		</span>
		     	</a>
		  		<a id="mnCal" onclick="getDashboardContentWindow(DASHBOARD_ID_SCHEMATIC_VIEW).openDayControl(this)" class="iconbtn" title="<bean:message key='header.icon.calendar' bundle='schematicresources'/>" href="#">
		     		<span class="k-icon icon-select-calendar">
		     		</span>
		     	</a>
		     	<ul id ="schematicViewerFavoritesMenu" class="iconbtn favorite-dropdown" title = "<bean:message key='header.icon.favorites' bundle='schematicresources'/>">
				</ul>
		     	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    	</div>	
	    </div>		
		<!--  Buttons Bar - end -->   
       	
       	<div id="networkSchematicViewDiv" style="height: 100%; width: 100%; "></div>
		<div id="networkScheduleSchematicViewDiv" style="height: 100%;width: 100%;"></div>
		<div id="scheduleSchematicViewDiv" style="height: 100%;width: 100%; "></div>	    
	    <div id ="favoriteWindowsParentDiv" style="display: none;"></div>
	    <div id="schematicDrawerContainer">
   			<%@include file="/pegasus/portaljsp/schematicDrawerSettings.jsp" %>
   		</div>
    </div>	
  </body>	
</html>