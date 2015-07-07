<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>
<html>
<head>
	<title><bean:message key='window.title.querywindow' bundle='filters'/></title>
	<!--imports for jquery-->
	<%@ include file="/pegasus/common/commonImports.jsp" %>
	
	<link rel="stylesheet"  href="<%=contextName%>/pegasus/jquery/jquery-ui.css<%=jsVersion%>" />	
	<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
	<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options -->
	<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
	<!--style sheet for filters panel-->
	<link href="<%=contextName%>/pegasus/portalcss/queryWindow.css<%=jsVersion%>" rel="stylesheet">
	<script src="<%=contextName%>/pegasus/portaljs/uicontrols.js<%=jsVersion%>" type="text/javascript"></script>
	<!--imports for pegasus data-->
	<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>
	<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
	<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
	<!--imports for filter components-->
	<script src="<%=contextName%>/pegasus/portaljs/queryWindow.js<%=jsVersion%>" type="text/javascript"></script>
	<!--imports for product section(auto complete)-->
	<script src="<%=contextName%>/pegasus/portaljs/filtersGrid.js<%=jsVersion%>" type="text/javascript"></script>
	<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
	<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
	<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>"></script>
	<!-- day control -->
	<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
	<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
</head>

<body style="width: 100%" oncontextmenu="return false;">
	<!--  Loading animation placehodler  -->
	<div id="loadingDialog">
	</div>
	<!--  Progress Window Dialog placehodler  -->
     <div id="progressDialogDiv" ></div>
	
	 <div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle" >
    	<div class="btnsWrapper">
    		<button id="runQryBtn" title="Run Query" onclick="getDashboardContentWindow(DASHBOARD_ID_QUERY).runQuery(null,this);">RUN</button>
	    	<a id="toggleQuery" onclick="getDashboardContentWindow(DASHBOARD_ID_QUERY).toggleQueryFlag(this);" class="iconbtn" 
	    			title="<bean:message key='header.icon.toggle.replaceresults' bundle='filters'/>" href="#">
	    		<span class="k-icon replace-results">
	    			<bean:message key='header.icon.toggle.replaceresults' bundle='filters'/>
	    		</span>
	    	</a>
	    	<a id="clearBtn" class="iconbtn" onclick="getDashboardContentWindow(DASHBOARD_ID_QUERY).parent.clearAll(false)" title="<bean:message key='header.icon.clear.query' bundle='filters'/>" href="#">
	    		<span class="k-icon clear-query" >
	    			<bean:message key='header.icon.tooltip.clearall' bundle='filters'/>
	    		</span>
	    	</a>
	    	<div class="inline-iconbtn bar-divider-container">
	    		<div class="bar-divider"></div>
	    	</div>
	    	<a id="toggleQZulu" onclick="getDashboardContentWindow(DASHBOARD_ID_QUERY).toggleLZView(this);" toggled=false class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='filters'/>" href="#">
	    		<span class="k-icon icon-toggle-local">
	    			<bean:message key='header.icon.zulu' bundle='filters'/>
	    		</span>
	    	</a>
			<ul id ="networkQueryFavoritesMenu" class="iconbtn favorite-dropdown" title = "<bean:message key='header.icon.favorites' bundle='filters'/>">
			</ul>
			<ul id ="scheduleQueryFavoritesMenu" class="iconbtn favorite-dropdown" style ="display:none" title = "<bean:message key='header.icon.favorites' bundle='filters'/>">
			</ul>
			<div class="inline-iconbtn bar-divider-container">
	    		<div class="bar-divider"></div>
	    	</div>
	    </div>	
	</div> 
			
	 <div id="filter_components" class="k-content" style="width: 100%;overflow: hidden;">
		<div id="tabStrip" class="window-tabbar-container">
	 		<ul>
				<li class="k-state-active" title="Show Product Routings query options" tabname="Network" style="margin-left:0px; margin-top:5px;">Network</li>
				<li title="Show Schedule query options" style=" margin-left:0px;margin-top:5px;" tabname="Schedule">Schedule</li>
			</ul>
		</div>
		
		<div id="details"></div>

		<div id="networkfilterOptions" class="slidingWinOpt" style="z-index:12000;width:310px; max-height:545px;">
			<div class="header-title">
				<bean:message key='display.option.label' bundle='networkfilters' />
			</div>
			<div id="networkfilterList">
				<div class="ui-panel-content-text">
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.primary.filters' bundle='networkfilters'/></label></div>
						<div class="section-box-content">
							<table>
								<tr><td><input type="checkbox" id="displayConnectionsChk" checked="checked" onclick="showHideWindowItems(this, 'displayConnections')"/><label for="displayConnectionsChk" class="label_style" style="padding-top:2px;"><bean:message key='display.option.display.connections' bundle='networkfilters'/></label></td><td width="10"></td></tr>
								<tr><td><input type="checkbox" id="routingTypeChk" checked="checked" onclick="showHideWindowItems(this, 'routingTypes')"/><label for="routingTypeChk" class="label_style" style="padding-top:2px;"><bean:message key='display.option.routing.type' bundle='networkfilters'/></label></td></tr>
								<tr><td><input type="checkbox" id="productsChk" checked="checked" onclick="showHideWindowItems(this, 'productId', 'productId2');showHideWindowItems(this, 'productIdlbl')"/><label for="productsChk" class="label_style" style="padding-top:2px;"><bean:message key='display.option.products' bundle='networkfilters'/></label></td></tr>
								<tr><td><input type="checkbox" id="productGroupsChk" checked="checked" onclick="showHideWindowItems(this, 'productGrpsId', 'productGrpsId2');showHideWindowItems(this, 'productGrpslbl')"/><label for="productGroupsChk" class="label_style" style="padding-top:2px;"><bean:message key='display.option.product.groups' bundle='networkfilters'/></label></td></tr>
							</table>
						</div>	
					</div>
				</div>
			</div>
        </div>
        
		<div id="generalWindow" style="padding-left:6px;min-height:25px !important;">
			<table>
				<tr>
					<td><label>Query Type</label></td>
					<td ><div style="width:5px"></div></td>
					<td><label>Connectivity</label></td>
					<td ><div style="width:5px"></div></td>
					<td><label>Capacity</label></td>
					<!-- <td ><div style="width:5px"></div></td>
					<td><label>Routing Type</label></td> -->
				</tr>
				<tr>
					<td><div id ="queryTypeCmbDiv"><select id="queryTypeCmb" style="width:140px;height:20px"></select></div></td>
					<td ><div style="width:5px"></div></td>
					<td><div id ="connectivityCmbDiv" ><select id="connectivityCmb" style="width:140px;height:20px"></select></div></td>
					<td ><div style="width:5px"></div></td>
					<td><div id ="capacityTypeCmbDiv"><select id="capacityTypeCmb" style="width:140px;height:20px"></select></div></td>
					<td ><div style="width:5px"></div></td>
					<!-- <td><div id ="routingTypeCmbDiv"><select id="routingTypeCmb" style="width:100px;height:20px"></select></div></td> -->
				</tr>
			</table>
		</div>
		<div id="preActivitiesWindow" style="padding:0px">
			<div id="preActivitiesGrid" style="height:100%; overflow:hidden"></div>
		</div>
		<div id="priActivitiesWindow" style="padding:0px">
        	<table width="100%" height="60%" cellpadding="0" cellspacing="0" border="0">
            	<tr>
                	<td colspan="4" style="width: 100%;">
				  		<div id="priActivitiesGrid" style="width:100%;height: 100%;overflow:hidden"></div>
					</td>
				</tr>
				<tr>
					<td id="productIdDiv" style="width: 70%;padding: 10px 0 5px 10px;">
						<textarea id="productsTextArea" tabindex="1" placeholder="Products" style="height: 100%;width: 100%;resize: none;min-height: 50px;padding: 4px 0 0 4px;"></textarea>                               
					</td>
					<td id="productId2Div" style="padding-top: 10px" valign="top">
						<a href="#" title="Open a popup" onclick="parent.openSelectLocDialog('productsTextArea','Select products',null,null,true,null,null,this)" style="margin-left:10px;"><span class="k-icon k-i-list-popup"></span></a>
					</td>
					<td id="productGrpsIdDiv" style="width: 30%;padding: 10px 0 5px 5px;">
						<textarea id="productGroupsTextArea" tabindex="2" placeholder="Product Groups" style="height: 100%;width: 100%;resize: none;min-height: 50px;padding: 4px 0 0 4px;"></textarea>
					</td>
					<td id="productGrpsId2Div" style="padding-top: 10px" valign="top">
						<a href="#" title="Open a popup" onclick="parent.openSelectLocDialog('productGroupsTextArea','Select products groups',null,null,true,null,null,this)" style="margin-left:10px;"><span class="k-icon k-i-list-popup"></span></a>
					</td>
                </tr>
			</table>
			<table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                	<td style="width: 50%;padding-left: 5px" valign="top">
                		<div id="displayConnectionsDiv">
	                		<table border="0">	
								<tr>
									<td><label><bean:message key='previous.activity.window.display.connections' bundle='networkfilters'/></label></td>
								</tr>
								<tr>
									<td>
										<input type="checkbox" id="previousDirectChk"/> 
										<label for="previousDirectChk" class="label_style"><bean:message key='previous.activity.window.previous.direct' bundle='networkfilters'/></label>
									</td>
									<td>	
										<input type="checkbox" id="nextDirectChk" /> 
										<label for="nextDirectChk" class="label_style"><bean:message key='previous.activity.window.next.direct' bundle='networkfilters'/></label>
									</td>
								</tr>
							</table>
						</div>
					</td>
					<td style="width: 50%;">
						<div id="routingTypesDiv">
							<table border="0">
								<tr>
									<td><label><bean:message key='previous.activity.window.routing.type' bundle='networkfilters'/></label></td>
								</tr>	
								<tr>
									<td style="padding-left: 5px">	
										<input type="checkbox" id="routingHAR" /><label for="routingHAR" class="label_style"><bean:message key='previous.activity.window.routing.type.har' bundle='networkfilters'/></label>
									</td>
									<td width="10">&nbsp;</td>
									<td>	
										<input type="checkbox" id="routingSingleSort" /><label for="routingSingleSort" class="label_style"><bean:message key='previous.activity.window.routing.type.single.sort' bundle='networkfilters'/></label>
									</td>
								</tr>
								<tr>
									<td style="padding-left: 5px">
										<input type="checkbox" id="routingNotHAR" onclick="notHARChangeHandler()"/><label  for="routingNotHAR" class="label_style" ><bean:message key='previous.activity.window.routing.type.nothar' bundle='networkfilters'/></label>
									</td>
									<td>&nbsp;</td>
									<td>
										<input type="checkbox" id="notNextMultiSort" /><label  for="notNextMultiSort"  class="label_style"><bean:message key='previous.activity.window.routing.type.multi.sort' bundle='networkfilters'/></label>
									</td>
								</tr>
								<tr>
									<td style="padding-left: 5px">
										<input type="checkbox" id="routingPTP" /><label  for="routingPTP"  class="label_style"><bean:message key='previous.activity.window.routing.type.ptp' bundle='networkfilters'/></label>
									</td>
									<td>&nbsp;</td>
									<td>
										<input type="checkbox" id="routingCustomSort" /><label  for="routingCustomSort"  class="label_style"><bean:message key='previous.activity.window.routing.type.custom.sort' bundle='networkfilters'/></label>
									</td>
								</tr>          
							</table>
						</div>
					</td>
				</tr>
			</table>
		</div>
		<div id="nxtActivitiesWindow" style="padding:0px">
			<div id="nxtActivitiesGrid" style="height: 100%; width: 100%; overflow:hidden "></div>
		</div>

		<!-- 
		
			Scheduler Windows
		
		-->
		
		<div id="schedulefilterOptions" class="slidingWinOpt" style="z-index:12000; width:360px; max-height:410px;">
			<div class="header-title">
				<bean:message key='display.option.label' bundle='schedulerfilters'/>
			</div>
			<div id="schedulefilterList">
				<div class="ui-panel-content-text">
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.select.display' bundle='schedulerfilters'/></label></div>
						<div class="section-box-content">
							<table>
								<tr><td><input name="defaultDisplay" type="radio" id="byRoute" onclick="selectDefaultDisplayOption(this, '#showByRoute')" checked="checked"/><label for ="byRoute" class="label_style"><bean:message key='display.option.by.route' bundle='schedulerfilters'/></label></td></tr>
								<tr><td><input name="defaultDisplay" type="radio" onclick="selectDefaultDisplayOption(this, '#showByLeg')" id="byLeg"/><label for ="byLeg" class="label_style"><bean:message key='display.option.by.leg' bundle='schedulerfilters'/></label></td></tr>
							</table>
						</div>	
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.select.mode' bundle='schedulerfilters'/></label></div>
						<div class="section-box-content">
							<table>
								<tr>
									<td><input id="flightOpt" type="checkbox" checked="checked" onclick="validateExpandCheckboxes(this, ['flightTrunk','flightFeeder'], true);"/><label for ="flightOpt" class="label_style"><bean:message key='display.option.flight' bundle='schedulerfilters'/></label></td>
									<td><input id="railOpt" type="checkbox" onclick="validateExpandCheckboxes(this, ['railOversize'], true);"/><label for ="railOpt" class="label_style"><bean:message key='display.option.rail' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td><input id="truckOpt" type="checkbox" checked="checked" onclick="validateExpandCheckboxes(this, ['truckStandard','truckOversize'], true);"/><label for ="truckOpt" class="label_style"><bean:message key='display.option.truck' bundle='schedulerfilters'/></label></td>
									<td><input id="shipOpt" type="checkbox" onclick="validateExpandCheckboxes(this, ['shipOversize'], true);" /><label for ="shipOpt" class="label_style"><bean:message key='display.option.ship' bundle='schedulerfilters'/></label></td>
								</tr>
							</table>
						</div>	
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.select.sections' bundle='schedulerfilters'/></label></div>
						<div class="section-box-content">
							<table>
								<tr>
									<td colspan="2" class="common-textformat"><label></label></td>
								</tr>
								<tr>
									<td><label class="section-subheading"><bean:message key='display.option.display' bundle='schedulerfilters'/></label></td>
									<td><label class="section-subheading"><bean:message key='display.option.expand' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td class="left-padding2"><input id="routesOpt" type="checkbox" checked="checked" onclick="showHideWindow(this, 'routeWindow');validateExpandCheckbox(this, 'routesExpandOpt', undefined, 'routeWindow')"/><label style="padding-left:10px;"></label></td>
									<td class="left-padding2"><input id="routesExpandOpt" type="checkbox" checked="checked" onclick="minMaxWindow(this, 'routeWindow')"/><label class="label_style"><bean:message key='display.option.routes' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td class="left-padding2"><input id="orgNDesOpt" type="checkbox" checked="checked" onclick="showHideWindow(this, 'orgDestiWindow');validateExpandCheckbox(this, 'orgNDesExpandOpt', undefined, 'orgDestiWindow')"/><label style="padding-left:10px;"></label></td>
									<td class="left-padding2"><input id="orgNDesExpandOpt" type="checkbox" checked="checked" onclick="minMaxWindow(this, 'orgDestiWindow')"/><label class="label_style"><bean:message key='display.option.origin.destination' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td class="left-padding2"><input id="depNArrOpt" type="checkbox" checked="checked" onclick="showHideWindow(this, 'depArrActTimeWindow');validateExpandCheckbox(this, 'depNArrExpandOpt', undefined, 'depArrActTimeWindow')"/><label style="padding-left:10px;"></label></td>
									<td class="left-padding2"><input id="depNArrExpandOpt"  type="checkbox" checked="checked" onclick="minMaxWindow(this, 'depArrActTimeWindow')"/><label class="label_style"><bean:message key='display.option.times' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td class="left-padding2"><input id="typeOpt" type="checkbox" checked="checked" onclick="showHideWindow(this, 'typesWindow');validateExpandCheckbox(this, 'typeExpandOpt', undefined, 'typesWindow')"/><label style="padding-left:10px;"></label></td>
									<td class="left-padding2"><input id="typeExpandOpt" type="checkbox" checked="checked" onclick="minMaxWindow(this, 'typesWindow')"/><label class="label_style"><bean:message key='display.option.type' bundle='schedulerfilters'/></label></td>
								</tr>
								<tr>
									<td class="left-padding2"><input id="modeOpt" type="checkbox" checked="checked" onclick="showHideWindow(this, 'modeWindow');validateExpandCheckbox(this, 'modeExpandOpt', undefined, 'modeWindow')"/><label style="padding-left:10px;"></label></td>
									<td class="left-padding2"><input id="modeExpandOpt" type="checkbox" checked="checked" onclick="minMaxWindow(this, 'modeWindow')"/><label class="label_style"><bean:message key='display.option.mode' bundle='schedulerfilters'/></label></td>
								</tr>
							</table>
						</div>	
					</div>
				</div>
             </div>
        </div>
		
		<div id="schedulersGeneralDiv" style="margin-top: 30px">
			<table>
				<tr>
					<td colspan="2">
						<div style="height: 18px">
							<label style="margin-left: 10px;"><bean:message key='general.window.results' bundle='schedulerfilters'/></label>
						</div></td>
				</tr>
				<tr>
					<td style="padding-left:30px">
						<div style="height: 20px">
							<input type="radio" id="showByRoute" name="radio2" checked="checked"/><label for="showByRoute" class="label_style"><bean:message key='general.window.by.route' bundle='schedulerfilters'/></label>
						</div>
					</td>
					<td>
						<div style="height: 20px">
							<input id="showDeletedChk" type="checkbox" class="tickCheckBox" /><label for ="showDeletedChk"  class="label_style"><bean:message key='general.window.showDeleted' bundle='schedulerfilters'/></label>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" style="padding-left:30px">
						<div style="height: 20px">
							<input type="radio" id="showByLeg" name="radio2"/><label for="showByLeg" class="label_style"><bean:message key='general.window.by.leg' bundle='schedulerfilters'/></label>
						</div>
					</td>
				</tr>
			</table>
		</div>
		
		<div id="routeWindow" style="overflow: hidden;">
			<table width="100%" height="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td height="100%" width="100%" valign="top">
						<textarea tabindex="1" style="height: 100%;width: 100%; min-height:65px; padding: 0px" id="enterRoute" placeholder=" Route Numbers" onkeypress="validateNumberNHyphenNCommaNPcentNAlphabets(event);" onkeyup="setTruckDescTooltip();" class="k-textbox" ></textarea>
					</td>
					<td valign="top">
						<a href="#" onclick="parent.openSelectLocDialog('enterRoute', 'Select route', undefined, undefined, false, null, null, this)"" style="margin-left:5px;"><span class="k-icon k-i-list-popup"></span></a>
					</td>
				</tr>		
					
			</table>
		</div>
		
		<div id="orgDestiWindow">
			<table cellspacing="0" cellpadding="0" border="0" height="100%" width="100%" style="min-width: 250px">
				<tr height="100%">
					<td style="width: 173px"><div style="width: 100%;height: 100%;"><textarea tabindex="2" onkeyup="styleChangeHandler('orignDestWinOrigin')" id="orignDestWinOrigin" placeholder="Origins" style="height: 80%;width: 95%;resize: none;padding: 4px 0 0 4px;"></textarea></div></td>
					<td valign="top">
						<a href="#" title="Open a popup" onclick="parent.openSelectLocDialog('orignDestWinOrigin', 'Select Origins', undefined, undefined, false, null, null, this)" style="margin-left:5px; cursor: pointer;"><span class="k-icon k-i-list-popup"></span></a>
					</td>
					<td valign="top">
						<table style="padding-left: 5px; padding-right: 5px">
							<tr><td style="width: 100px;text-align: center; padding-bottom: 3px"><select tabindex="3" id="operatorCmb" style="width: 80px; text-align: left;"></select></td></tr>
							<tr><td><input id="isPaired" type="checkbox" class="tickCheckBox"/><label for ="isPaired" class="label_style" style="height: 16px;margin-top: -10px;"><bean:message key='orgin.desti.window.paired' bundle='schedulerfilters'/></label></td></tr>
							<tr><td><input id="isDirect" type="checkbox" class="tickCheckBox" /><label for ="isDirect"  class="label_style" style="height:16px;margin-top: -20px;"><bean:message key='orgin.desti.window.direct' bundle='schedulerfilters'/></label></td></tr>
							<tr><td><input id="isByAirport" type="checkbox" class="tickCheckBox" /><label for ="isByAirport"  class="label_style" style="height:16px;margin-top: -30px;">By related</label><label for ="isByAirport" style="display: inline-block;margin-top: -30px;vertical-align: middle;padding-left: 20px;" class="label_style">airport</label></td></tr>
						</table>
					</td>
					<td style="width: 173px"><div style="width: 100%;height: 100%;"><textarea tabindex="4" onkeyup="styleChangeHandler('orignDestWinDest')" id="orignDestWinDest" placeholder="Destinations" style="height: 80%;width: 95%;resize: none;padding: 4px 0 0 4px;"></textarea></div></td>
					<td valign="top">
						<a href="#" title="Open a popup" onclick="parent.openSelectLocDialog('orignDestWinDest','Select Destinations', undefined, undefined, false, null, null, this)" style="margin-left:5px; cursor: pointer;"><span class="k-icon k-i-list-popup"></span></a>
					</td>
				</tr>
			</table>
		</div>
	
		<div id="depArrActTimeWindow">
			<table id="depArrActTimeTable">
				<tr>
					<td><label style="white-space: nowrap;"><bean:message key='dep.arr.act.time.window.days' bundle='schedulerfilters'/></label></td>
					<td width="5">&nbsp;</td>
					<td><div id="depArrActTimeCalendar" onclick="onDepArrActTimeCalenderClick(this)" class="calendar-mini"></div></img></td>
					<td width="5">&nbsp;</td>
					<td><input type="text" id="onDays" tabindex="5" onkeydown="setOldValue(event)" onkeyup="validateScheduleDays(event)" class="k-input" style="width: 50px; text-align:center"/></td>
					<td width="5">&nbsp;</td>
					<td "><select tabindex="6" id="departsCmb" style="width: 80px"></select></td>
					<td width="5">&nbsp;</td>
					<td><label><bean:message key='dep.arr.act.time.window.between' bundle='schedulerfilters'/></label></td>
					<td width="5">&nbsp;</td>
					<td><input type="text" id="betweenTime"  tabindex="7" placeholder="hhmm" maxlength="4" onblur="focusoutHandler(event)" onkeyup="validateAndMove(event,'andTime')" class="k-input" style="width:35px; padding-left:4px; padding-right:4px; text-align:left"/></td>
					<td width="5">&nbsp;</td>
					<td><label><bean:message key='dep.arr.act.time.window.and' bundle='schedulerfilters'/></label></td>
					<td width="5">&nbsp;</td>
					<td><input type="text" id="andTime"  tabindex="8" placeholder="hhmm" maxlength="4" onblur="focusoutHandler(event)" onkeyup="validateAndMove(event,'onDays')" class="k-input" style="width:35px; padding-left:4px; padding-right:4px; text-align:left"/></td>
					
				</tr>
			</table>
		</div>
		
		<div id="typesWindow" style="height: 100%; width: 100%; padding-right:2px;">
			<table style="height: 100%;width: 100%" border="0">
				<tr>
					<td style="width: 90px">
						<table style="height: 100%; width: 100%">
							<tr><td><label ><bean:message key='types.window.route' bundle='schedulerfilters'/>&nbsp;&nbsp;</label></td></tr>
							<tr>
								<td style="padding-left:10px">
									<table>
										<tr><td><input id="laneHaulChk" type="checkbox" class="tickCheckBox" /><label for ="laneHaulChk"  class="label_style"><bean:message key='types.window.lineHaul' bundle='schedulerfilters'/></label></td></tr>
										<tr><td><input id="stuttleChk" type="checkbox" class="tickCheckBox" /><label for ="stuttleChk"  class="label_style"><bean:message key='types.window.shuttle' bundle='schedulerfilters'/></label></td></tr>
									</table>
								</td>
							</tr>			
							<tr><td><label ><bean:message key='types.window.carriers' bundle='schedulerfilters'/>&nbsp;</label></td></tr>
							<tr>
								<td style="padding-left:10px">
									<table>
										<tr><td><input id="fxChk" type="checkbox" class="tickCheckBox" /><label for ="fxChk"  class="label_style"><bean:message key='types.window.fx' bundle='schedulerfilters'/></label></td></tr>
										<tr><td><input id="contractChk" type="checkbox" class="tickCheckBox" /><label for ="contractChk"  class="label_style"><bean:message key='types.window.contract' bundle='schedulerfilters'/></label></td></tr>
										<tr><td><input id="othersChk" type="checkbox" class="tickCheckBox" /><label for ="othersChk"  class="label_style"><bean:message key='types.window.other' bundle='schedulerfilters'/></label></td></tr>
									</table>
								</td>		
						</table>	
					</td>
					<td>
						<table style="height: 100%;width: 100%">
							<tr>
								<td style="height: 50%;width: 100%;padding-right: 3px; min-width:70px">
									<textarea id="equipmentType" tabindex="9" placeholder="Equipment Type" onkeyup ="toUpperCaseEquipType(event);" style="height: 100%; width: 100%;resize: none;padding: 4px 0 0 4px;"></textarea>
								</td>
								<td valign="top">
									<a href="#" onclick="parent.openSelectLocDialog('equipmentType','Select Equipment',null,null,null,null,null,this)" style="margin-left:5px; cursor: pointer;"><span class="k-icon k-i-list-popup"></span></a>
								</td>
							</tr>
							<tr>
								<td style="height: 50%;width: 100%;padding-right: 3px; min-width:70px">
									<textarea id="legType" tabindex="10" placeholder="Leg Type" style="height: 100%; width: 100%;resize: none;padding: 4px 0 0 4px;"></textarea>
								</td>
								<td valign="top">
									<a href="#" onclick="parent.openSelectLocDialog('legType','Select Leg',null,null,null,null,null,this)" style="margin-left:5px; cursor: pointer;"><span class="k-icon k-i-list-popup"></span></a>
								</td>
						</table>
					</td>	
				</tr>	
			</table>	
		</div>
		
		<div id="modeWindow">
			<div><label class="main-heading"><bean:message key='mode.window.select' bundle='schedulerfilters'/></label></div>
			<div style="margin-top: 10px">
				<table class="modeTable">
					<tr>
						<td align="left"><label class="main-subheading"><bean:message key='mode.window.flight' bundle='schedulerfilters'/></label></td>
						<td style="width:3px;">&nbsp;</td>
						<td align="left"><label class="main-subheading"><bean:message key='mode.window.truck' bundle='schedulerfilters'/></label></td>
						<td style="width:12px;">&nbsp;</td>
						<td align="left"><label class="main-subheading"><bean:message key='mode.window.rail' bundle='schedulerfilters'/></label></td>
						<td style="width:10px;">&nbsp;</td>
						<td align="left"><label class="main-subheading"><bean:message key='mode.window.ship' bundle='schedulerfilters'/></label></td>
					</tr>
					<tr>
						<td style="padding-left:10px"><input id="flightTrunk" type="checkbox" class="tickCheckBox" checked="checked"/><label for ="flightTrunk"  class="label_style"><bean:message key='mode.window.trunk' bundle='schedulerfilters'/></label></td>
						<td>&nbsp;</td>
						<td style="padding-left:10px"><input id="truckStandard" type="checkbox" class="tickCheckBox" checked="checked"  /><label for ="truckStandard"  class="label_style"><bean:message key='mode.window.standard' bundle='schedulerfilters'/></label></td>
						<td>&nbsp;</td>
						<td style="padding-left:10px"><input id="railOversize" type="checkbox" class="tickCheckBox" /><label for ="railOversize"  class="label_style"><bean:message key='mode.window.oversize' bundle='schedulerfilters'/></label></td>
						<td>&nbsp;</td>
						<td style="padding-left:10px"><input id="shipOversize" type="checkbox" class="tickCheckBox" /><label for ="shipOversize"  class="label_style"><bean:message key='mode.window.oversize' bundle='schedulerfilters'/></label></td>
					</tr>
					<tr>
						<td style="padding-left:10px"><input id="flightFeeder"   type="checkbox" class="tickCheckBox" /><label for ="flightFeeder"  class="label_style"><bean:message key='mode.window.feeder' bundle='schedulerfilters'/></label></td>
						<td>&nbsp;</td>
						<td style="padding-left:10px"><input id="truckOversize" type="checkbox" class="tickCheckBox" checked="checked" /><label for ="truckOversize"  class="label_style"><bean:message key='mode.window.oversize' bundle='schedulerfilters'/></label></td>
						<td>&nbsp;</td>
						<td style="padding-left:10px">&nbsp;</td>
						<td>&nbsp;</td>
						<td style="padding-left:10px">&nbsp;</td>
					</tr>
					<%-- <tr>
						<td style="padding-left:10px"><input id="flightOversizeObc" checked="checked" type="checkbox" class="tickCheckBox" /><label for ="flightOversizeObc"  class="label_style"><bean:message key='mode.window.oversize.obc' bundle='schedulerfilters'/></label></td>
					</tr> --%>
				</table>
			
			</div>
		</div>
		
	   	<!-- favorite divisions starts -->
		<div id ="favoriteWindowsParentDiv" style="display: none;"></div> 
		<script>
	 		$(document).ready(function() { 
				initialize();
         	});  
        </script>
	</div>
	
</body>
</html>