<%@page import="com.enterprisehorizons.util.StringUtils"%>
<%@page import="com.spacetimeinsight.security.bean.JAASAuthenticationTypeInitializer"%>
<%@page import="com.spacetimeinsight.security.bean.JAASConstants"%>
<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%@ page import="com.enterprisehorizons.magma.config.beans.SecurityRoleBean" %>
<%@ page import="com.enterprisehorizons.magma.ecoweb.constants.IWebSessionContants"%>
<%@ page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
<%@ page import="com.spacetimeinsight.security.bean.UserBean"%>
<%@page import="com.enterprisehorizons.magma.server.admin.AdminConfigUtils"%>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
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
%>
<!DOCTYPE html>
<html:html locale="true">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="cache-control" content="max-age=0" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="-1" />		
		<meta http-equiv="pragma" content="no-cache" />
        <!--  Kendo UI Framework -->
		<%@ include file="/pegasus/common/commonImports.jsp" %>
		
        <!-- JQuery CSS-->
		<link rel="stylesheet"  href="<%=contextName%>/pegasus/jquery/jquery-ui.css<%=jsVersion%>" />
		<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
        <link href="<%=contextName%>/pegasus/portalcss/searchPopUp.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
		<!--   
        	<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
        	<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">        
        -->
		<jsp:include page="/pegasus/portaljsp/systemSettings.jsp"></jsp:include>
		<!-- day control -->
		<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
		<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" ></script>
		<script>
        	var CONTEXT_NAME = "<%=contextName%>";
        	var SERVER_URL = "<%=serverUrl%>";
            var dojoConfig = {
                parseOnLoad : true
            };
            var loginUserId = "<%=userId%>";
        </script>
        <!-- GO JS  -->
        <script src="<%=contextName%>/pegasus/goJS/go.js<%=jsVersion%>"  ></script> <!--  Schematic view  -->
        <!-- Pegasus Application scripts -->
        <script src="<%=contextName%>/pegasus/portaljs/uicontrols.js<%=jsVersion%>" ></script>
        <script src="<%=contextName%>/pegasus/portaljs/dashboardController.js<%=jsVersion%>" ></script>
        <script src="<%=contextName%>/pegasus/portaljs/pegasusUtils.js<%=jsVersion%>" ></script> <!-- Map options panel -->
        <script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" ></script>
        <script src="<%=contextName%>/pegasus/portaljs/drag.drop.js<%=jsVersion%>"  ></script> <!--  Drag & drop between map and grid -->	
        <script src="<%=contextName%>/pegasus/portaljs/pegasusViewer.js<%=jsVersion%>" ></script> <!--  Invoke / Main target -->
		<script src="<%=contextName%>/pegasus/portaljs/searchCriteriaUtils.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/pegasusHeader.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/applicationFavorites.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/cloneWindowComponent.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxCommonUtils.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxServiceController.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/controls/skdMxGridController.js<%=jsVersion%>" ></script>	
		<script src="<%=contextName%>/pegasus/portaljs/controls/dataManager.js<%=jsVersion%>" ></script>
		<script src="<%=contextName%>/pegasus/portaljs/controls/dataController.js<%=jsVersion%>" ></script>
		
		
		<script>
		 var SERVER_PROTOCOL = '<%=protocol%>';
		 var PEGASUS_PRINT_SERVICE_URL = '<%=pegasusPrintServiceUrl%>';
		 var IS_CLONE_WINDOW_ID = '<%= cloneId%>';
		 var cloneWindowFavorite;
		 /*
            dojo.ready(function() {
            	loadAllComponents(); 
                              
            });
            */ 
            $(document).ready(function() {
            	cloneWindowFavorite =  <%= clonedWindowFavorite%> ;
            	initializeViewer("advanceQuery");          	
            });
            
            /*
            $(window).resize(function() {
			  console.log("resize");
			});
			*/
        </script>
        <title>Pegasus Portal Framework</title>
    </head>

     <body style="height: 100%; width: 100%;" class="bodybg" oncontextmenu="return false;">
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
        <div id="mainBody" class="k-content afterheader">
		</div>

		<!--  Task bar component --> 
        <div id="footer" class="taskbar" style="z-index:9000;">
        	<div id="taskbar" class="minimizetray"></div>
        	<div class="logotray"></div>
        </div>
        
		<!--  All Windows place holder... -->
		<div id="dropdown-1" class="dropdown-menu has-tip">
	    	<ul id="allWindows" style="display: none;">
	        </ul>
	   	</div>
	   	
	   	<div id="filterViewPopUpDiv" style="height:100%;width:100%;overflow: hidden !important;display:none">
	   		<div style="height:100%;width:100%">
	   			<table id="networkFilter" cellspacing="0" cellpadding="0" border="0">
	   				<tr>
	   					<td>Direction</td>
	   					<td>Error</td>
	   					<td style="padding-left: 5px">Mode</td>
	   				</tr>
	   				<tr>
	   					<td><input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionBothRadio" value="both" checked="checked" onclick="filterElementClickHandler(event)" onchange="filterToggleDirection(this)" /><label for="ntwFilterDirectionBothRadio" class="label_style">Both</label></td>
	   					<td>
	   						<select id="connErrorCombo" onchange="filterElementClickHandler(event)" style="height: 18px;margin: 0;padding: 0;width: 150px">
	   							<option value="None">None</option><option value="Connectivity and capacity">Connectivity and capacity</option>
	   							<option value="Connectivity">Connectivity</option>
	   							<option value="Capacity">Capacity</option>
	   						</select>
	   					</td>
	   					<td style="padding-left: 5px">
	   						<select id="showModes" style="height: 18px;margin: 0;padding: 0;width: 150px">
							</select>
	   					</td>
	   				</tr>
	   				<tr>
	   					<td><input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionInboundRadio" value="inbound" onclick="filterElementClickHandler(event)" onchange="filterToggleDirection(this)"/><label for="ntwFilterDirectionInboundRadio" class="label_style">Inbound</label></td>
	   					<td></td>
	   					<td></td>
	   				</tr>
	   				<tr>
	   					<td><input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionOutboundRadio" value="outbound" onclick="filterElementClickHandler(event)" onchange="filterToggleDirection(this)"/><label for="ntwFilterDirectionOutboundRadio" class="label_style">Outbound</label></td>
	   					<td></td>
	   					<td></td>
	   				</tr>
	   			</table>
	   			<table id="scheduleOverlayFilter" style="display: none;">
	   				<tr>
	   					<td>Mode</td>
	   					<td style="width:100px;height:20px"></td>
	   					<td>Leg Type</td>
	   					<td style="width: 50px;"></td>
	   					<td>Equipment Type</td>
	   					<td></td>
	   				</tr>
	   				<tr>
	   					<td><input id="scheduleOverlayFlightChk" checked="checked" onclick="validateDropDownOnCheckbox(this, 'scheduleOverlayFlightCombo');filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td><select id="scheduleOverlayFlightCombo" onchange="filterElementClickHandler(event)" style="height: 18px;margin: 0;padding: 0;width: 70px"><option value="al">All</option><option value="trunk">Trunk</option><option value="feeder">Feeder</option></select></td>
	   					<td><input id="schdllegtypeOverlayFlyChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:30px;text-overflow:ellipsis;"><label id="flightLegTypesOverlay"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('flightLegTypesOverlay', 'Select Fly Leg Type', undefined, 'schdllegtypeOverlayFlyChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   					<td><input id="schdlequiptypeOverlayFlyChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:50px;text-overflow:ellipsis;"><label id="flightEquipTypesOverlay"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('flightEquipTypesOverlay', 'Select Fly Equipment Type', undefined, 'schdlequiptypeOverlayFlyChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   				</tr>
	   				<tr>
	   					<td><input id="scheduleOverlayTruckChk" checked="checked" onclick="validateDropDownOnCheckbox(this, 'scheduleOverlayFilterModeTruckCombo');filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td><select id="scheduleOverlayFilterModeTruckCombo" onchange="filterElementClickHandler(event)" style="height: 18px;margin: 0;padding: 0;width: 70px"><option value="al">All</option><option value="standard">Standard</option><option value="oversize">Oversize</option></select></td>
	   					<td><input  id="schdllegtypeOverlayTruckChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:30px;text-overflow:ellipsis;"><label id="truckLegTypesOverlay"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('truckLegTypesOverlay', 'Select Truck Leg Type', undefined, 'schdllegtypeOverlayTruckChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   					<td><input  id="schdlequiptypeOverlayTruckChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:50px;text-overflow:ellipsis;"><label id="truckEquipTypesOverlay"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('truckEquipTypesOverlay', 'Select Truck Equipment Type', undefined, 'schdlequiptypeOverlayTruckChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   				</tr>
	   			</table>
	   			<table id="scheduleFilter" style="display: none;">
	   				<tr>
	   					<td>Mode</td>
	   					<td style="width:100px;height:20px"></td>
	   					<td>Leg Type</td>
	   					<td style="width: 50px;"></td>
	   					<td>Equipment Type</td>
	   					<td></td>
	   				</tr>
	   				<tr>
	   					<td><input id="scheduleFlightChk" checked="checked" onclick="validateDropDownOnCheckbox(this, 'scheduleFlightCombo');filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td><select id="scheduleFlightCombo" onchange="filterElementClickHandler(event)" style="height: 18px;margin: 0;padding: 0;width: 70px"><option value="al">All</option><option value="trunk">Trunk</option><option value="feeder">Feeder</option></select></td>
	   					<td><input id="schdllegtypeFlyChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:30px;text-overflow:ellipsis;"><label id="flightLegTypes"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('flightLegTypes', 'Select Fly Leg Type', undefined, 'schdllegtypeFlyChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   					<td><input id="schdlequiptypeFlyChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Fly</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:50px;text-overflow:ellipsis;"><label id="flightEquipTypes"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('flightEquipTypes', 'Select Fly Equipment Type', undefined, 'schdlequiptypeFlyChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   				</tr>
	   				<tr>
	   					<td><input id="scheduleTruckChk" checked="checked" onclick="validateDropDownOnCheckbox(this, 'scheduleFilterModeTruckCombo');filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td><select id="scheduleFilterModeTruckCombo" onchange="filterElementClickHandler(event)" style="height: 18px;margin: 0;padding: 0;width: 70px"><option value="al">All</option><option value="standard">Standard</option><option value="oversize">Oversize</option></select></td>
	   					<td><input  id="schdllegtypeTruckChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:30px;text-overflow:ellipsis;"><label id="truckLegTypes"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('truckLegTypes', 'Select Truck Leg Type', undefined, 'schdllegtypeTruckChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   					<td><input  id="schdlequiptypeTruckChk" onclick="filterElementClickHandler(event)" type="checkbox"/><label class="label_style" style="">Truck</label></td>
	   					<td valign="top">
	   						<div style="overflow: hidden;position: absolute;padding-left: 25px;width:50px;text-overflow:ellipsis;"><label id="truckEquipTypes"></label></div>
	   						<a href="#" onclick="openLegTypesWindow('truckEquipTypes', 'Select Truck Equipment Type', undefined, 'schdlequiptypeTruckChk', false, this)" style="margin-left:5px;position: absolute;"><span class="k-icon k-i-minimize"></span></a>
	   					</td>
	   				</tr>
	   			</table>
	   		</div>
	   	</div>
    </body>
</html:html>