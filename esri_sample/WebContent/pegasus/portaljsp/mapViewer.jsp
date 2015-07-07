<%@page import="com.spacetimeinsight.fedex.common.PegasusConfigUtils"%>
<%@ page import="com.spacetimeinsight.fedex.utils.PegasusDBUtils" %>
<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%
	String esriCssUrl = PegasusConfigUtils.getEsriCssUrl();
	String esriDojoCssUrl = PegasusConfigUtils.getEsriDojoCssUrl();
	String arcgisJSApi = PegasusConfigUtils.getEsriJSApi();
%>



<!DOCTYPE html>
<html>

<head>
<title>Map Viewer</title>
<style>       
	html, body { 
		height: 100%; width: 100%; margin: 0; padding: 0; 
	}      
	#map {        
		padding:0;      
	}	
	
	.k-invalid-msg {
		margin: -1.7em 0em 0em 6em !important;
	}
</style> 
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
<script>
    var isDrawMirrorLineByActualCoordinatesStr = '<%=PegasusDBUtils.getRuleValue("isDrawMirrorLineByActualCoordinates", true) %>';
    var distanceFactorStr = '<%=PegasusDBUtils.getRuleValue("distanceFactor", true) %>';
    var isDrawMirrorLineStr = '<%=PegasusDBUtils.getRuleValue("isDrawMirrorLine", true) %>';
    var isGeodesicLineExceptionStr = '<%=PegasusDBUtils.getRuleValue("isGeodesicLineException", true) %>';
    var isDrawMirrorLineExceptionStr = '<%=PegasusDBUtils.getRuleValue("isDrawMirrorLineException", true) %>';
</script>
<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
<link href="<%=contextName%>/pegasus/portalcss/mapViewer.css<%=jsVersion%>" rel="stylesheet" /><!-- css for map viewer -->
<link href="<%=contextName%>/pegasus/portalcss/popupWindow.css<%=jsVersion%>" type="text/css" rel="stylesheet"  />
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- 
<link href="<%=contextName%>/pegasus/portalcss/jquery.dropdown.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /> --><!--  Windows list pop down button-->

<!-- ESRI CSS-->
<link rel="stylesheet" href="<%=protocol%>:<%=esriDojoCssUrl%>">        
<link rel="stylesheet" href="<%=protocol%>:<%=esriCssUrl%>">
<!-- Esri script  -->
<script src="<%=protocol%>:<%=arcgisJSApi%>"></script>
<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->

<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>

<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/searchCriteriaUtils.js<%=jsVersion%>" type="text/javascript"></script>

<script src="<%=contextName%>/pegasus/portaljs/mapViewer.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/viewerUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/viewerSettings.js<%=jsVersion%>" type="text/javascript"></script>

<script src="<%=contextName%>/pegasus/portaljs/uicontrols.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/lassoComponent.js<%=jsVersion%>" type="text/javascript"></script>

<script src="<%=contextName%>/pegasus/goJS/go.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/marketviewPopUp.js<%=jsVersion%>" type="text/javascript"></script> 
<script src="<%=contextName%>/pegasus/portaljs/activityDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script> 
<script src="<%=contextName%>/pegasus/portaljs/laneDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/legDetailPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonVolumeMatrixUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/activityUtils.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/locationSettings.js<%=jsVersion%>" type="text/javascript" ></script> 
<script src="<%=contextName%>/pegasus/portaljs/controls/popupManager.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxDrawerController.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxCommonUtils.js<%=jsVersion%>" type="text/javascript"></script>

<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>

<script>
var dojoConfig = { parseOnLoad: true };
</script>
<script>

	
	//map viewer entry point for initializing the map view...
	$(document).ready(function() {
		//method is in viewerUtils.js
		initialize();
	});
	
	
</script>
</head>

<body class="claro" oncontextmenu="return false;">
   <div id="mapView" style="height: 100%;width: 100%; overflow: hidden;">
   		<div id='map' style="height: 100%; width: 100%;">   			
        </div>
        <div id="timeCostAnimator" class="meter animate modal" style="display:none" >
			<span style="width:100px"><span></span></span>
		</div>
        <!--  Progress Window Dialog placehodler  -->
        <div id="progressDialogDiv" > 
        </div> 
        <div id="printButton" style="display: none"></div>
        <!--  Buttons Bar - start --> 
		<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
			<div class="btnsWrapper">
				<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
				<a id="btnMapLocations" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).openLocationsWindow()" class="iconbtn" title="Manage Map Locations" href="#">
	        		<span class="k-icon icon-locations-view">
	        			Manage Map Locations
	        		</span>
	        	</a>
	        	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		<ul id ="mapAreaDiv" class="iconbtn n-icon" title="<bean:message key='header.icon.lasso.tooltip' bundle='mapresources'/>">
				</ul>
				<div class='btnWrapper' title='Lasso is not available'></div>
	        	<a id="btnMapDirection" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).toggleDirection(this, true)" class="iconbtn" title="<bean:message key='header.icon.display' bundle='mapresources'/>" href="#">
	        		<span class="k-icon icon-both-view">
	        			<bean:message key='header.icon.display' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		<a class="iconbtn" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).syncSchematicViewer()"  title="<bean:message key='header.icon.schematic' bundle='mapresources'/>" href="#">
	        		<span class="k-icon schematic-diagram">
	        			<bean:message key='header.icon.schematic' bundle='mapresources'/>
	        		</span>
	        	</a>
	    		<a id="marketView" class="iconbtn n-icon"  href="#"
	    			onclick="VIEWER.enableMarketView(this,DASHBOARD_ID_MAP_VIEW, null, true)">
	        		<span class="k-icon icon-market-view-disable" title="<bean:message key='header.icon.market.view' bundle='mapresources'/>">
	        			<bean:message key='header.icon.market.view' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<a id="map-view" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).toggleView(this,true)" class="iconbtn" href="#">
	        		<span class="k-icon icon-network-view" >
	        			<bean:message key='header.icon.network.view' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		<a id="btnMapSyncSchematic" onclick="enableSync(this,DASHBOARD_ID_MAP_VIEW,[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'icon-sync-to-matrix')" class="iconbtn n-icon" title="<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>" href="#">
	        		<span class="k-icon sync-to-schematic">
	        			<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>
	        		</span>
	        	</a>
	    		<a id="btnMapSyncMatrix" onclick="enableSync(this,DASHBOARD_ID_MAP_VIEW,[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'sync-to-schematic')" class="iconbtn n-icon" title="<bean:message key='header.icon.syncto.matrix' bundle='mapresources'/>" href="#">
	        		<span class="k-icon icon-sync-to-matrix">
	        			<bean:message key='header.icon.syncto.matrix' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<a id="btnRefresh" class="iconbtn" title="<bean:message key='header.icon.refresh' bundle='mapresources'/>" href="#"
	        		onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).resetDashboard(true)">
	        		<span class="k-icon icon-refresh">
	        			<bean:message key='header.icon.refresh' bundle='mapresources'/>
	        		</span>
	        	</a>
	        
	        	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
                <!-- onclick="triggerPrintMap()"  -->
	    		<a id="printMap" class="iconbtn" title="<bean:message key='header.icon.print' bundle='mapresources'/>" href="#" >
	        		<span class="k-icon icon-print-map-disable">
	        			<bean:message key='header.icon.print' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	 
	        	<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
	    		
	        	<a id="toggleMZulu" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).toggleTimeView(this, true)" toggled=false class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='mapresources'/>" href="#">
	        		<span class="k-icon icon-toggle-local">
	        			<bean:message key='header.icon.zulu' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<a id="mCal" onclick="getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).openDayControl(this)" class="iconbtn" title="<bean:message key='header.icon.calendar' bundle='mapresources'/>" href="#">
	        		<span class="k-icon icon-select-calendar">
	        			<bean:message key='header.icon.calendar' bundle='mapresources'/>
	        		</span>
	        	</a>
	        	<ul id ="mapViewerFavoritesMenu" class="iconbtn favorite-dropdown"  title = "<bean:message key='header.icon.favorites' bundle='mapresources'/>">
				</ul>
				<div class="inline-iconbtn bar-divider-container">
	    			<div class="bar-divider"></div>
	    		</div>
        	</div>
       </div>
       <!--  Buttons Bar - end --> 
		<div id ="favoriteWindowsParentDiv" style="display: none;"></div>
		<div id="mapOptionsContainer">
    		<%@include file="/pegasus/portaljsp/mapOptions.jsp" %>
    	</div>
    	<a href="javascript:void(0);" class="faciSlider-arrow fSlider-arrow hide" style="z-index: 7; top:25%"></a>
        <div id="facilityEncyclopedia" class="encyclopediaHPanel fPanel" style="display:none ">
        	<br/>
        	<div id='facilityEncycloContent' style='height:auto; overflow: scroll; min-width: 418px; min-height: 100px'></div>
        </div>
        <!-- Schedule Maintaince Map Drawer -->
       <div id="SkdMxMapDrawerContainer">
        <div id="SkdMxMapDrawerController"  class="slidingWinOpt" style="width:680px;top: 0px; height: auto !important">
        	<div class="header-title">
        		Schedule Map        		
			</div>
	        <div class="slidingWinContent" style="overflow:hidden">
				<div class="slidingWinContent-innercontainer" style="margin-top: -10px;"> 
					<div class="sliding-content-container">
						<div class="ui-panel-content-text">
							<div class="section-box">
								<div class="section-box-content" style="overflow: hidden;">								
									<div>
						        		<a id="btnDefaultPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Selection tool" href="#">
							        		<span class="k-icon icon-cursor-select">
							        			Select Route 
							        		</span>
							        	</a>
							        	<a id="btnAddPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Add leg tool" href="#">
							        		<span class="k-icon icon-cursor-add">
							        			Add Route/ Leg
							        		</span>
							        	</a>
							        	<a id="btnDeletePointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Delete leg tool" href="#">
							        		<span class="k-icon icon-cursor-delete">
							        			Delete  Route/ Leg
							        		</span>
							        	</a>
							        	
							        </div>	
							        <div id="operationsDiv" style="padding:10px; width: 100%">
						        		<!--<a id="btnSMEdit" onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " class="iconbtn" title="Edit in Route Editor" href="#">
							        		<span class="k-icon icon-edit-route">
							        			Edit
							        		</span>
							        	</a>-->
							        	<a id="btnSMDuplicate" onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " class="iconbtn" title="Duplicate route" href="#">
							        		<span class="k-icon icon-dupicate-route">
							        			Duplicate
							        		</span>
							        	</a>
							        	<!-- SkdMxHelper.getDrawer().selectPointer(this, true); SkdMxHelper.getDrawer().addRoute(this, true) -->
							        	<a id="btnSkdMxRouteTypeSelection" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn" title="Create route" href="#" >
							        		<span class="k-icon icon-add-route">
							        			Select route type tool
							        		</span>
							        	</a>
							        	<!-- SkdMxHelper.getDrawer().selectPointer(this, true); SkdMxHelper.getDrawer().addRoute(this, true) -->
							        	<a id="btnSkdMxAddRoute" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" style="display:none;" class="iconbtn" title="Create route" href="#" >
							        		<span class="k-icon icon-add-route">
							        			Add
							        		</span>
							        	</a>
							        	<!-- <a id="btnSMAdd" onclick="SkdMxHelper.getDrawer().deleteRoute(this, true)" class="iconbtn" title="Delete route" href="#"  >
							        		<span class="k-icon icon-cancel-route">
							        			Delete
							        		</span>
							        	</a> -->
							        	<a id="btnCancelPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Cancel tool" href="#">
							        		<span class="k-icon icon-cancel-route">
							        			Cancel Route/ Leg
							        		</span>
							        	</a>		
							        	<a id="saveToWip" class="iconbtn"  style="display: none" onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="<bean:message key='header.icon.saveToWip' bundle='filters'/>" href="#">
								    		<span class="k-icon icon-save-settings-wip-smd">
								    			<bean:message key='header.icon.saveToWip' bundle='filters'/>
								    		</span>
								    	</a>
								    	<a id="saveToSchedule" class="iconbtn" style="display: none"  onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="<bean:message key='header.icon.saveToSchedule' bundle='filters'/>" href="#">
								    		<span class="k-icon icon-save-settings">
								    			<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
								    		</span>
								    	</a>
                                        <a id="noSaveToWip" class="iconbtn" title="<bean:message key='header.icon.saveToWip' bundle='filters'/>" href="#">
								    		<span class="k-icon icon-save-wip-settings-disabled">
								    			<bean:message key='header.icon.saveToWip' bundle='filters'/>
								    		</span>
                                        </a>
                                        <a id="noSaveToSchedule" class="iconbtn"  title="Save to Schedule" href="#">
								    		<span class="k-icon icon-save-settings-disabled">
								    			<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
								    		</span>
                                        </a>
								    	<a id="deleteFromSchedule" class="iconbtn" style="display: none"  onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="Delete from Schedule" href="#">
								    		<span class="k-icon icon-delete-route">
								    			Delete from Schedule
								    		</span>
								    	</a>
								    	<a id="noDeleteFromSchedule" class="iconbtn" title="Delete from Schedule" href="#">
								    		<span class="k-icon icon-delete-route-disable">
								    			Delete from Schedule
								    		</span>
								    	</a>					        	
								 	</div>	
								 	<div class="clearButtons"></div>
								</div>
							</div>
							<div>
								<div>
									<div id='SchdleMntnceMapDwrContent' style='overflow: scroll; min-width: 218px;'>
						        		<table id='SchdleMntnceMapDwrContentTbl' style="padding-left: 20px; padding-right: 20px;"></table>
						        	</div>
								</div>
							</div>	
						</div>
					</div>
				</div>
			</div>			
		 </div>
	   </div> 
	   <span id="status" style="position: absolute; z-index: 100; right: 5px; bottom: 5px;">
	      <bean:message key='map.display.option.loading' bundle='networkfilters'/>
	   </span>
       
   </div>	
  </body>	
</html>


<div id="locationSettingDiv" style="width: 100%;display: none; overflow: hidden;">			
	<div style="margin-top:5px;">
		<div id="generalTabDiv" class="section-box">
			<div style="padding-top:10px"><label class="section-header">Show Location Types</label></div>
			<div class="section-box-content">
				<table>
					<tr>
						<td class="left-padding"><input type="radio" name="locations"  id="isNoneLocations" checked="checked" onclick="showMapLocationSelectionHandler('isNoneLocations')"/>&nbsp;<label for="isNoneLocations" class="label_style">No selections</label> </td>
					</tr>
					<tr>
						<td class="left-padding"><input type="radio" name="locations" id="isDefaultConfig"  onclick="showMapLocationSelectionHandler('isDefaultConfig')"/>&nbsp;<label for="isDefaultConfig" class="label_style">Default</label> </td>
					</tr>
					<tr>
						<td class="left-padding"><input type="radio" name="locations" id="isManual" onclick="showMapLocationSelectionHandler('isManual')" />&nbsp;<label for="isManual" class="label_style">Show selected locations types</label> </td>											
					</tr>
					
					<tr>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="hubsChk" disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="hubsChk" class="label_style"><bean:message key='map.display.option.map.display.hubs' bundle='networkfilters'/></label> </td>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="airportFeeder" disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="airportFeeder" class="label_style">Airport - Feeders</label> </td>
					</tr>
					<tr>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="airportTrunk" disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="airportTrunk" class="label_style">Airport - Trunk</label> </td>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="airportLineHaul" disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="airportLineHaul" class="label_style">Airport - Commercial Line Haul</label> </td>
					</tr>
					<tr>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="rampsChk" disabled="disabled" onclick="loadFacilityLocationsLayer()"/>&nbsp;<label for="rampsChk" class="label_style"><bean:message key='map.display.option.map.display.ramps' bundle='networkfilters'/></label> </td>
						<td class="left-padding2"><input type="checkbox" class="locationSelectionsChk" id="dockChk" disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="dockChk" class="label_style"><bean:message key='map.display.option.map.display.dock' bundle='networkfilters'/></label> </td>
					</tr>
					<tr>
						<td class="left-padding2"><input type="checkbox" id="stations"  disabled="disabled"  onclick="loadFacilityLocationsLayer()"/>&nbsp;<label for="stations" class="label_style">Stations</label> </td>
						<td class="left-padding2"><input type="checkbox" id="meetPoints" class="locationSelectionsChk"  disabled="disabled" onclick="loadFacilityLocationsLayer();"/>&nbsp;<label for="meetPoints" class="label_style">Meet Points</label> </td>
					</tr>
					<tr>
						<td class="left-padding2"><input type="checkbox" id="userAddedLocations"  class="locationSelectionsChk" disabled="disabled" onclick="loadUserAddedLocations()"/>&nbsp;<label  class="label_style" style="cursor: pointer;" onclick="openLocationsPopup()" >User Added Locations</label></td>
				    </tr>					
				</table>
			</div>	
				<div><label class="section-header">Display</label></div>
				<table style="padding-top:5px">
					<tr><td class="left-padding2"><input type="radio" name="shwlocdisplaygrp" id="displayUsedOnlyRadio" checked="checked" onclick="loadFacilityLocationsLayer();" />&nbsp;<label for="displayUsedOnlyRadio"  class="label_style">Used only</label> </td></tr>
					<tr><td class="left-padding2"><input type="radio" name="shwlocdisplaygrp" id="displayAllradio" onclick="loadFacilityLocationsLayer();" />&nbsp;<label for="displayAllradio" class="label_style">All</label></td></tr>
				</table>
			
		</div>
	</div>
</div>

<div id="routeSettingsDiv" style="width: 100%;display: none; overflow: hidden;">			
	<div style="margin-top:5px;">
	<div style="padding-top:5px" id="routeWizard">
							
	</div>
	<div style="clear: both; height: 20px;"></div>
	<div id="buttonDiv" style="width: 400px;text-align: center; margin-left: 55px;">
		<!-- <input id ="saveButton" type="button" value="Edit in RE" />
		<input id ="sendtoWIPButton" type="button" value="Send to WIP" />  -->
		<input id ="addtoWIPButton" type="button" value="Edit In Map" onclick="editRouteFromMapHandler()" />
        <input id ="undeleteBtn" type="button" value="Un-Delete" onclick="UnDeleteRouteManager.undeleteRouteFromMapHandler()" />
	</div>	
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
	   