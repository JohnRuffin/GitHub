<%@page import="com.enterprisehorizons.util.StringUtils"%>
<%@page import="com.spacetimeinsight.security.bean.JAASAuthenticationTypeInitializer"%>
<%@page import="com.spacetimeinsight.security.bean.JAASConstants"%>
<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%@ taglib uri="/tags/struts-logic" prefix="logic"%>
<%@ page import="com.enterprisehorizons.magma.config.beans.SecurityRoleBean" %>
<%@ page import="com.enterprisehorizons.magma.ecoweb.constants.IWebSessionContants"%>
<%@ page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
<%@ page import="com.spacetimeinsight.security.bean.UserBean"%>
<%@page import="com.enterprisehorizons.magma.server.admin.AdminConfigUtils"%>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
<%@page import="com.spacetimeinsight.fedex.common.PegasusConfigUtils"%>

<%
	if (session == null || session.getAttribute(ServerUtils.USER_BEAN_NAME) == null) {
		response.sendRedirect("/");
		return;
	}
	
	UserBean userBean = (UserBean) session.getAttribute(ServerUtils.USER_BEAN_NAME);
	String groupId = request.getParameter(ServerUtils.PARAM_GROUP_ID);
	String domainId = request.getParameter(ServerUtils.PARAM_DOMAIN_ID);
	String userId = request.getParameter(ServerUtils.PARAM_USER_ID);
	String moduleId = request.getParameter(ServerUtils.PARAM_MODULE_ID);
	String languageId = request.getParameter(ServerUtils.PARAM_LANGUAGE_ID);
	String languageCd = request.getParameter(ServerUtils.PARAM_LANGUAGE_CODE);
	String userName = userBean.getFirstName() + " " + userBean.getLastName();
	if (userId == null) {
		userId = userId != null ? userId : userBean.getLoginId();
	}
	String jsessionId = "";
	if (request.getSession(false) != null) {
		jsessionId = request.getSession(false).getId();
	}
	
	String cloneId = (String)request.getParameter("cloneId");
	String clonedWindowFavorite = "";
	if(!StringUtils.isNull(cloneId)){
		clonedWindowFavorite = (String)request.getSession(false).getAttribute(cloneId);
		//request.getSession(false).removeAttribute("cloneDetails");		
	}else {
		cloneId ="";
	}
	
	if(StringUtils.isNull(clonedWindowFavorite)){
		clonedWindowFavorite = "{}";
	}
	String esriCssUrl = PegasusConfigUtils.getEsriCssUrl();
	String esriDojoCssUrl = PegasusConfigUtils.getEsriDojoCssUrl();	
	String arcgisJSApi = PegasusConfigUtils.getEsriJSApi();	
%>
<!DOCTYPE html>
<html:html locale="true">
    <head>
    	<title>Pegasus Portal Framework</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--  Kendo UI Framework -->
		<%@ include file="/pegasus/common/SQWCommonImports.jsp" %>		
		<!-- Pegasus Application CSS-->
		<link rel="stylesheet"  href="<%=contextName%>/pegasus/jquery/jquery-ui.css<%=jsVersion%>" />		
		<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
		<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
		<link href="<%=contextName%>/pegasus/portalcss/mapViewer.css<%=jsVersion%>" rel="stylesheet" /><!-- css for map viewer -->
		<link href="<%=contextName%>/pegasus/portalcss/popupWindow.css<%=jsVersion%>" type="text/css" rel="stylesheet"  />
		<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
		<link href="<%=contextName%>/pegasus/portalcss/schematicViewer.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for schematic viewer -->
		<div style="display:none">
			<jsp:include page="/pegasus/portaljsp/systemSettings.jsp"></jsp:include>
		</div>
		<!-- day control -->
		<div style="display:none">
			<jsp:include page="/pegasus/portaljsp/sqw/sqwDayControl.jsp" ></jsp:include>
		</div>	
		<script src="<%=contextName%>/pegasus/portaljs/sqw/sqwDayControl.js<%=jsVersion%>" type="text/javascript"></script>		
		<!-- ESRI CSS-->
		<link rel="stylesheet" href="<%=protocol%>:<%=esriDojoCssUrl%>">        
		<link rel="stylesheet" href="<%=protocol%>:<%=esriCssUrl%>">
		<!-- Esri script  -->
		<script src="<%=protocol%>:<%=arcgisJSApi%>"></script>
		<script>
        	var CONTEXT_NAME = "<%=contextName%>";
        	var SERVER_URL = "<%=serverUrl%>";
            var dojoConfig = {
                parseOnLoad : true
            };
            var SERVER_PROTOCOL = '<%=protocol%>';
	   		var PEGASUS_PRINT_SERVICE_URL = '<%=pegasusPrintServiceUrl%>';
	   		var IS_CLONE_WINDOW_ID = '<%= cloneId%>';
        </script>
        <script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
		<script src="<%=contextName%>/pegasus/portaljs/dashboardController.js<%=jsVersion%>" type="text/javascript"></script> <!--  Invoke / Main target -->
		<script src="<%=contextName%>/pegasus/portaljs/pegasusHeader.js<%=jsVersion%>" type="text/javascript"></script>
      	<script src="<%=contextName%>/pegasus/portaljs/pegasusViewer.js<%=jsVersion%>" type="text/javascript"></script> <!--  Invoke / Main target -->
      	<script src="<%=contextName%>/pegasus/portaljs/sqw/pegasussqwViewer.js<%=jsVersion%>"></script>
      	<script src="<%=contextName%>/pegasus/portaljs/schematicViewer.js<%=jsVersion%>" type="text/javascript"></script>	
		<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
		<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
		<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>
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
		<script src="<%=contextName%>/pegasus/portaljs/sqw/queryCacheManager.js<%=jsVersion%>"></script><%-- 
		<script src="<%=contextName%>/pegasus/portaljs/applicationFavorites.js<%=jsVersion%>" type="text/javascript"></script> --%>
		<script src="<%=contextName%>/pegasus/goJS/go.js<%=jsVersion%>" type="text/javascript" ></script> <!--  Schematic view  -->
		         
		<script src="<%=contextName%>/pegasus/portaljs/schematicDiagram.js<%=jsVersion%>" type="text/javascript"></script>         
		<script src="<%=contextName%>/pegasus/portaljs/schematicDiagramContainer.js<%=jsVersion%>" type="text/javascript"></script>
		<script src="<%=contextName%>/pegasus/portaljs/transitPopUp.js<%=jsVersion%>" type="text/javascript"></script>   
		
		<script src="<%=contextName%>/pegasus/portaljs/cloneWindowComponent.js<%=jsVersion%>" type="text/javascript"></script>
		
		<script>
        	var cloneWindowFavorite;
	   	     $(document).ready(function() {
	   	        cloneWindowFavorite =  <%= clonedWindowFavorite%> ;
	   	        //alert(cloneWindowFavorite);
	   	        initializeViewer("simpleQuery"); 	
				commonViewer.initialize();						
	   	     });
		</script>
    </head>
	<style>       
		html, body { 
			height: 100%; width: 100%; margin: 0; padding: 0; 
		}      
		#map {        
			padding:0;      
		}
		
		.submenuSelected {
			background-color: blue !important;
			color: #ffffff !important;
		}    
		/* div#facilityEncyclopedia{
			height:100%;
			width:40%;
			background:White;
			float:right;
			overflow:auto;
			text-align: left;
			display: none;
			margin-top : 100px;
		} */
	</style>	 
    <body class="claro bodybg resolution" style="width: 100%; height: 100%"  oncontextmenu="return false;">
    <bean:define id="isAdvanceQueryModule" value="N" scope="request"/>    
     	<%@include file="/pegasus/portaljsp/pegasusHeader.jsp"%>
     	<!-- Header error messages window -->
     	<div class="headerErrorMainDiv">
	     	<div id="headerErrorDiv" class="headerError">
	     	</div>
     	</div>
    	
    	<!--  Progress Window Dialog placehodler  -->
        <div id="progressDialogDiv" style="z-index:20000 !important;"> 
        </div> 
        
		<span id="dummyText" style="display:none"></span>
		
		<!--  Main body component  -->
        <div id="mainBody" style="height: 100%;width: 100%; overflow: hidden;" class="k-content afterheader invisibleDiv">
	         <!--  Buttons Bar - start --> 
			<div id="mapToolbar" class="window-header k-window-actions btnBarPosition addOverflowStyle mapToolbar">
				<div class="btnsWrapper">
		    		<a id="btnMapSyncSchematic" style="display: none" onclick="getDashboardContentWindow(viewerDashboardId).switchAndEnableSync(this,DASHBOARD_ID_MAP_VIEW,[DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'icon-sync-to-matrix')" class="iconbtn n-icon" title="<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>" href="#">
		        		<span class="k-icon sync-to-schematic">
		        			<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>
		        		</span>
		        	</a>
		    		<a id="btnMapSyncMatrix" onclick="getDashboardContentWindow(viewerDashboardId).switchAndEnableSync(this,DASHBOARD_ID_MAP_VIEW,[DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'sync-to-schematic')" class="iconbtn n-icon" title="<bean:message key='header.icon.syncto.matrix' bundle='mapresources'/>" href="#">
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
		        	<a id="printMap" class="iconbtn" title="<bean:message key='header.icon.print' bundle='mapresources'/>" href="#" onclick="triggerPrintMap()">
		        		<span class="k-icon icon-print-map">
		        			<bean:message key='header.icon.print' bundle='mapresources'/>
		        		</span>
		        	</a>
	        	</div>
	       </div>
	       <!--  Buttons Bar - end --> 
        	<a href="javascript:void(0);" class="faciSlider-arrow fSlider-arrow hide" style="z-index: 7; top:25%"></a>
	        <div id="facilityEncyclopedia" class="encyclopediaHPanel fPanel" style=" ">
	        	<br/>
	        	<div id='facilityEncycloContent' style='height:auto; overflow: scroll; min-width: 418px'></div>
	        </div>
		   <div id="mapView" style="height: 100%;width: 100%; overflow: hidden; z-index: 100 !important">
		   	<div id="mapOptionsContainer">
    			<%@include file="/pegasus/portaljsp/mapOptions.jsp" %>
    		</div>
			<div id="networkHPanel" class="hPanel" style="padding-left:5px; height: auto !important; overflow: hidden; z-index: 5;">
				<%@include file="/pegasus/portaljsp/sqw/networkMoreSearchOptions.jsp"%>
			</div>
			<div id ="scheduleHPanel" class="hPanel" style="display:none;padding-left:5px; border:0; height: auto !important; overflow: hidden; z-index: 5; ">
				<%@include file="/pegasus/portaljsp/sqw/scheduleMoreSearchOptions.jsp"%>
			</div>
		   		<div class="headerPanel search_nav resolution" style="z-index: 7; margin-right: 10px">
		   		<table style="width: 100%;">
		   			<tr>
		   				<td style="width: 350px;">
		   				<div id="headerMapOptionsDiv" class="main_menu"  style=" display: inline-flex;">
				   			<ul>
							    <li>
						   			<a href="#" class="sqw-button" onclick="commonViewer.pointerClickHandler()">
						   				<span class="k-icon sqw-icon-pointer"><bean:message key='header.title.pointer' bundle='pegasusresources'/></span>
						   				<span class="icon-label">Pointer</span>
				                   </a>
								</li>	
							</ul>	
							
							<ul id ="mapAreaDiv" title="<bean:message key='header.icon.lasso.tooltip' bundle='mapresources'/>" class="sqw-button">
							</ul>	
							<%-- <ul  title="Plan days">
								<li>
								<a id="mCal" class="sqw-button" onclick="openDayControl(this)" title="<bean:message key='header.icon.calendar' bundle='mapresources'/>" href="#">
					        		<span class="k-icon sqw-icon-select-calendar"> <bean:message key='header.icon.calendar' bundle='mapresources'/></span>
					        		<span class="icon-label">Calendar</span>
					        	</a>
					        	</li>
							</ul>
							<ul  title="Local/Zulu toggle">
								<li>
								<a id="toggleMZulu" class="sqw-button" onclick="toggleTimeView(this, true)" toggled=false class="sqwbutton" title="<bean:message key='header.icon.zulu' bundle='mapresources'/>" href="#">
					        		<span class="k-icon sqw-icon-toggle-local">
					        			<bean:message key='header.icon.zulu' bundle='mapresources'/>
					        		</span>
					        		<span class="icon-label">Local</span>
					        	</a>
					        	</li>
							</ul> --%>
						</div>
		   				</td>
		   				<td align="center">
		   					<div id = "viewerTabs" class="main_menu">
									 <ul>
									    <li class = 'selected'>
											<a href="#" id="networkLink" class="sqw-button" onclick="onMapChange('networkHPanel','networkVPanel', false, this)">
						                 		<bean:message key='header.title.network' bundle='pegasusresources'/>
						                 	</a>
										</li>
										<li>
											<a href="#" id="scheduleLink" class="sqw-button" onclick="onMapChange('scheduleHPanel','scheduleVPanel', false, this)">
						                     	<bean:message key='header.title.schedule' bundle='pegasusresources'/>
											</a>
										</li>
									</ul>		
					   		</div>     
		   				</td>
		   				<td style="width: 450px;">
		   				<div id="networkHeaderMenus" class="main_menu">												
						    <ul>
							    <li> 
							    	<a href="#" class="sqw-button">Map</a>
							    	<ul>
										<li><a href="#" onclick="uicontroller.showSchematicView('map', 'Network')">
											<bean:message key='header.title.network' bundle='pegasusresources'/></a></li>
										<li id="networkSchduleMapViewSubLink" style="display: none"><a href="#" onclick="uicontroller.showSchematicView('map', 'NetworkSchedule')">
											<bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>
										<li id="networkSchduleMapViewSubLinkTpl"><a href="#" style="color: gray;">
											<bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>	
									</ul>
							    </li>
							    <li>
							    	<a href="#" class="sqw-button">Schematic</a>
							    	<ul>
										<li><a href="#" onclick="uicontroller.showSchematicView('schematic', 'Network')">
											<bean:message key='header.title.network' bundle='pegasusresources'/></a></li>
										<li id="networkSchduleSchematicViewSubLink" style="display: none"><a href="#" onclick="uicontroller.showSchematicView('schematic', 'NetworkSchedule')">
											<bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>
										<li id="networkSchduleSchematicViewSubLinkTpl" ><a href="#" style="color: gray;">
											<bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>	
									</ul>
							    </li>
							    <li>
							    	<a href="#" class="sqw-button" >Matrix</a>
									<ul>
										<div id="networkMatrixMenu">
										<!-- <li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX)">Network - Summary</a></li> -->
										<li><a id = "summarymatrixLink" href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX)">Network - Summary</a></li>
										<!--<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_MATRIX)">Network - Detail</a></li> -->
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_MATRIX)">Network - Detail</a></li>
										</div>
										<div id="networkScheduleMatrixMenu" style="display: none;">
										<!-- <li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX)">Schedule Overlay</a></li> -->
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX)">Schedule Overlay</a></li>
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_ALLOCATION_MATRIX)">Allocation</a></li>
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX)">Volume Utilization</a></li>
										</div>
									</ul>
							   </li>	
							   <li>
							   		<a href="#" class="sqw-button" >Sandbox</a>
									<ul>
										<li><a href="#" onclick="openDashboard(DASHBOARD_ID_MODE_ANALYSIS)">Mode Analysis</a></li>
										<div id="schematicSandboxMenu" style="display: none;">
										<li><a href="#" onclick="refreshWithOptimizedPlacement()">Optimize</a></li>
										</div>
										<div id="networkScheduleSandboxMenu" style="display: none;">									
										<li><a href="#" isEnabled = "false" onclick="marketviewSelectHandler(this)">Market View</a></li>
										</div>
									</ul>
							   </li>	
						    </ul>
						</div>
						<div id="scheduleHeaderMenus" class="main_menu" style="display: none; padding-left: 12px;">
						    <ul>
							    <li> 
							    	<a href="#" class="sqw-button" onclick="uicontroller.showSchematicView('map', 'Schedule')">Map</a>
							    	<%-- <ul>
										<li><a href="#"><bean:message key='header.title.network' bundle='pegasusresources'/></a></li>
										<li><a href="#"><bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>
									</ul> --%>
							    </li>
							    <li>
							    	<a href="#" class="sqw-button" onclick="uicontroller.showSchematicView('schematic', 'Schedule')">Schematic</a>
							    	<%-- <ul>
										<li><a href="#"><bean:message key='header.title.network' bundle='pegasusresources'/></a></li>
										<li><a href="#"><bean:message key='header.title.schedule' bundle='pegasusresources'/></a></li>
									</ul> --%>
							    </li>
							    <li>
							    	<a href="#" class="sqw-button" >Matrix</a>
									<ul>
										<!-- <li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX)">Schedule</a></li>  -->
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX)">Schedule</a></li>
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_ALLOCATION_MATRIX)">Allocation</a></li>
										<!-- <li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX)">Volume Utilization</a></li> -->
										<li><a href="#" onclick="SQW.openDashboard(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX)">Volume Utilization</a></li>
									</ul>
							   </li>	
							   <li>
							   		<a href="#" class="sqw-button" >Sandbox</a>
									<ul>
										<li><a href="#" onclick="openDashboard(DASHBOARD_ID_MODE_ANALYSIS)">Mode Analysis</a></li>
										<li><a href="#" onclick="marketviewSelectHandler(this)">Market View</a></li>
									</ul>
							   </li>	
						    </ul>
						</div>
		   				</td>
		   			
		   				
		   			</tr>
		   			<tr>
		   				<td colspan="3" align="center">		   				
		   				<div class="vSlider-arrow show" style="z-index: 5; text-align: center; cursor: pointer; ">Search</div>
		   				</td>
		   			</tr>
		   		</table>
				<a href="javascript:void(0);" class="hSlider-arrow show" style="z-index: 5;"></a>
				
       		</div>
				<div id ="scheduleVPanel" class="vPanel" style="display: none; z-index: 5;top: -195px;" >
					<div id="scheduleDatasets">
					</div>
					<table style="width: 100%;">		
						<tr>
							<td>
								<div id="networkfooterDiv">
									<span class='footer_data_set'>
										<div id="footerTableDiv" style="float: none">
											<hr>
											<table class="footerTable" style="width: 100%;height: 100%;">
												<tr class="row" style=" text-align: left; vertical-align: top;">
													<td style="width: 12%;">	
														<button onclick="SQW.addMoreLocations(1, 'Schedule');Slider.moveSearchButton('vSlider-arrow')">More Locations</button>
													</td>		
													<td>
														<table style="width: 100%;height: 100%;">
															<tr class="row" style=" text-align: left; vertical-align: top;">
																<td>
																	<div id="flightEquipmentDIV">
																		<select id="flightEquipments" multiple name="flightEquipments"></select>
																		<div id="flightsSelectedTextDiv"  class="selectedTextColor" style="float:right; width:170px;"></div>
																	</div>	
																</td>
															</tr>
															<tr class="row" style=" text-align: left; vertical-align: top;">
																<td>
																	<div id="truckGroupDIV">
																		<select id="truckEquipment" multiple="" name="truckEquipment"></select>
																		<div id="trucksSelectedTextDiv"  class="selectedTextColor" style="float:right; width:170px;"></div>
																	</div>
																</td>
															</tr>
														</table>		
													</td>
													<td>
														<table style="width: 100%;height: 100%;">
															<tr class="row" style=" text-align: left; vertical-align: top;">
																<td style="width: 10%;">
																	<a id="scheduleDays" onclick="SQW.openDayControl(this)" href="#" selectedPlanDays="" ref="scheduleDaysText">On Day</a>
																</td>
																<td colspan="4" style="text-align:left">
																	<div id="scheduleDaysText" class="selectedTextColor"></div>
																</td>	
															</tr>
															<tr class="row" style=" text-align: left; vertical-align: center;">
																<td>
																	<select id="departsCmb" style="width: 150" >
																		<option>Departs</option>
																		<option>Arrives</option>
																		<option>Active</option>
																	</select>
																</td>	
																<td align="center" style="width: 55px;"><label class="selectedTextColor"><bean:message key='dep.arr.act.time.window.between' bundle='schedulerfilters'/></label></td>
																<td align="center" style="width: 55px;"><input type="text" id="betweenTime" placeholder="hhmm" maxlength="5" onblur="focusoutHandler(event)" onkeyup="validateAndMove(event,'andTime')" class="k-input" style="width:35px; padding-left:4px; padding-right:4px; text-align:left"/></td>
																<td align="left" style="width: 25px;"><label class="selectedTextColor"><bean:message key='dep.arr.act.time.window.and' bundle='schedulerfilters'/></label></td>
																<td align="left" style="width: 135px; "><input type="text" id="andTime" placeholder="hhmm" maxlength="5" onblur="focusoutHandler(event)" onkeyup="validateAndMove(event,'onDays')" class="k-input" style="width:35px; padding-left:4px; padding-right:4px; text-align:left"/></td>
															</tr>
														</table>		
													</td>
													<td>
														<div class="fav_div">
															<ul id ="scheduleQueryFavoritesMenu" class="iconbtn favorite-dropdown sqw-favorite-dropdown" title = "<bean:message key='header.icon.favorites' bundle='filters'/>">
															</ul>
														</div>
													</td>
													<td style="text-align: right; width: 230px">
														<table style="width: 100%;height: 60px;">
															<tr class="row">		
																<td colspan="3" align="right" valign="bottom">	
																	<button onclick="commonViewer.runQuery()">Run Schedule</button>
																</td>
															</tr>
															<tr class="row">		
																<td colspan="3" align="right" valign="top">
																	<input type="checkbox" name="addResultsToDisplay" id="addScheduleResultsToDisplay" />
																	<label class="label_style">Add results to current display</label>
																	
																	<a id="clearBtn" class="iconbtn" onclick="VIEWER.clearAll(false)" title="<bean:message key='header.icon.clear.query' bundle='filters'/>" href="#">
																		<span class="k-icon sqw-clear-query" >
																			<bean:message key='header.icon.tooltip.clearall' bundle='filters'/>
																		</span>
																	</a>
																</td>	
															</tr>	
														</table>
													</td>
												</tr>
											</table>
										</div>
									</span>
								</div>
							</td>	
						</tr>
					</table>
				</div>
				<div id ="networkVPanel" class="vPanel" style="z-index: 5;">
					<!-- dummy  label please remove-->
					<%@include file="/pegasus/portaljsp/sqw/networksqw.jsp"%>
				</div>
		   		<div id='map' style="height: 100% !important; width: 100% !important;">   			
		        </div>
				<div id="schematicView" style="height: 100%;width: 100%; overflow: hidden; display: none;">
			   		<div id="networkSchematicViewDiv" style="height: 100%; width: 100%; "></div>
					<div id="networkScheduleSchematicViewDiv" style="height: 100%;width: 100%;"></div>
					<div id="scheduleSchematicViewDiv" style="height: 100%;width: 100%; "></div>
			    </div>	
		        <!--  Progress Window Dialog placehodler  -->
		        <div id="progressDialogDiv" > 
		     	</div> 
		   	<span id="status" style="position: absolute; z-index: 100; right: 5px; bottom: 5px;">
		      <bean:message key='map.display.option.loading' bundle='networkfilters'/>
		   	</span>       
  		</div>	
		<!--  Task bar component --> 
        <div id="footer" class="taskbar" style="z-index:9000;">
        	<div id="taskbar" class="minimizetray"></div>
        	<div class="logotray"></div>
        </div>
        <!-- favorite divisions starts -->
		<div id ="favoriteWindowsParentDiv" style="display: none;"></div> 
		<!--  All Windows place holder... -->
		<div id="dropdown-1" class="dropdown-menu has-tip">
	    	<ul id="allWindows" style="display: none;">
	        </ul>
	   	</div>
    </body>
</html:html>