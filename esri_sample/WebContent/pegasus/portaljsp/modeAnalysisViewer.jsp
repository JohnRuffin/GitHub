<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>
<html>
<head>
<title><bean:message key='window.title.modeanalysiswindow' bundle='modeanalysisresources'/></title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>

<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options -->
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
<link href="<%=contextName%>/pegasus/portalcss/modeAnalysisViewer.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for mode analysis viewer -->

<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/goJS/go.js<%=jsVersion%>" type="text/javascript" ></script>

<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->

<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/validationUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/uicontrols.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/viewerUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/modeAnalysisViewer.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/ganttChartDiagram.js<%=jsVersion%>" type="text/javascript"></script>

<script>
	var isFetchLocations = <%="true".equals(request.getParameter("isFetchLocations"))%>;	
	var localZuluBtnName = "<%="true".equals(request.getParameter("isFetchLocations")) ? "toggleMapMAZulu" : "toggleMAZulu"%>";
	
	$(document).ready(function() {
		initializeModeAnalysis(isFetchLocations);
	});
</script>
</head>

<body onresize="onResize(event)" oncontextmenu="return false;">
   <div id="modeAnalysisView" class="">
  	 	<!--  Progress Window Dialog Place Holder  -->
        <div id="progressDialogDiv" > 
        </div> 

        <!--  Confirmation Dialog placehodler  need to make it generic component-->
        <div id='alertWindow' style="display: none;text-align: center;">
        	<div style="margin-top: 5px"><label style="white-space: pre-wrap !important;">If you click 'Yes' below, rows you added manually to the analysis will be removed. Do you want to continue?</label></div>
        	<div style="margin-top: 25px;">
        		<input onclick="alertClickHandler(event, true)" style="min-width: 45px !important;" type="button" value="Yes"/>
        		<input onclick="alertClickHandler(event, false)" style="min-width: 45px !important;" type="button" value="No"/>
        	</div>
        </div>
        
		<!--  Buttons Bar - start -->	
		<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
			<div class="btnsWrapper">
		     	<a id="mSynchMap" class="iconbtn" onclick="getDashboardContentWindow('<%="true".equals(request.getParameter("isFetchLocations")) ? "mapModeAnalysisViewDiv" : "modeAnalysisViewDiv"%>').showDetailsOnMap()"
		     				title="<bean:message key='header.icon.syncto.map' bundle='modeanalysisresources'/>" href="#">
		    		<span class="k-icon sync-to-map">
		    			<bean:message key='header.icon.syncto.map' bundle='modeanalysisresources'/>
		    		</span>
		    	</a>
		    	<a class="iconbtn" onclick="getDashboardContentWindow('<%="true".equals(request.getParameter("isFetchLocations")) ? "mapModeAnalysisViewDiv" : "modeAnalysisViewDiv"%>').clearClickhandler()" title="<bean:message key='header.icon.clear' bundle='modeanalysisresources'/>" href="#">
		    		<span class="k-icon clear-query">
		    			<bean:message key='header.icon.clear' bundle='modeanalysisresources'/>
		    		</span>
		    	</a>
		     	<div class="inline-iconbtn bar-divider-container">
		   			<div class="bar-divider"></div>
		    	</div>
		    	<a class="iconbtn" onclick="getDashboardContentWindow('<%="true".equals(request.getParameter("isFetchLocations")) ? "mapModeAnalysisViewDiv" : "modeAnalysisViewDiv"%>').exportDataToExcel()"  title="<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>" href="#">
		       		<span class="k-icon export-to-excel">
		       			<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>
		       		</span>
		       	</a>
		       	<div class="inline-iconbtn bar-divider-container">
		   			<div class="bar-divider"></div>
		    	</div>
		     	<a id="<%="true".equals(request.getParameter("isFetchLocations")) ? "toggleMapMAZulu" : "toggleMAZulu"%>" onclick="toggleTimeView(this);getDashboardContentWindow('<%="true".equals(request.getParameter("isFetchLocations")) ? "mapModeAnalysisViewDiv" : "modeAnalysisViewDiv"%>').toggleLocalZuluTime(event)" toggled=false class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='modeanalysisresources'/>" href="#">
		     		<span class="k-icon icon-toggle-local">
		     			<bean:message key='header.icon.zulu' bundle='modeanalysisresources'/>
		     		</span>
		     	</a>
		     	<ul id="<%="true".equals(request.getParameter("isFetchLocations")) ? "modeAnalysisMapFavoritesMenu" : "modeAnalysisFavoritesMenu"%>" class="iconbtn favorite-dropdown" title="<bean:message key='header.icon.favorites' bundle='modeanalysisresources'/>">
				</ul>
		     	<div class="inline-iconbtn bar-divider-container">
		   			<div class="bar-divider"></div>
		    	</div>
		    </div>	
	    </div>
		<!--  Buttons Bar - end -->
	   	
	   	<div id ="favoriteWindowsParentDiv" style="display: none;"></div>
	   	<div id="modeanalysisDisplayOptions" class="slidingWinOpt" style="width:200px; height:100%;">
	  		<div class="header-title">
				<bean:message key='display.option.label' bundle='modeanalysisresources'/>
			</div>
			<div class="slidingWinContent" style="height:98%; overflow-y:auto; overflow-x:hidden">
				<div class="panelBG">
					<!-- Place contents here -->
					<div class="buttonbarContainer">
						<div class="buttonbar-in-tabstrip">
							<input type="button" id="applyDisplaySettings" onclick="applyDisplaySettings(event)" style="float:right; padding-top:1px; padding-left:10px; padding-right:10px; padding-bottom:2px; min-width:50px; min-height:18px; height:18px" value="<bean:message key='map.display.option.applybutton.label' bundle='networkfilters'/>">
						</div>
					</div> 
					<div style="margin-left: 20px;margin-top: 25px">
						<input type="checkbox" checked="checked" id="showOnlyViableResultsChk"/><label for="showOnlyViableResults" class="label_style"><bean:message key='display.option.showOnlyViableResults' bundle='modeanalysisresources'/></label>
					</div>
					<%-- <tr><td><label class="section-header"><bean:message key='schematic.display.option.showlanesforupto' bundle='schematicresources'/></label><input id="remainingdaysinput" type="text" id="startValue2" value="2" class="k-textbox" style="width:30px;height:20px;margin-right:10px"/><label class="common-textformat"><bean:message key='schematic.display.option.remainingdays' bundle='schematicresources'/></label></td></tr> --%>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.speeds' bundle='modeanalysisresources'/></label></div>
						<div class="section-box-content" style="text-align: right;padding-right: 5px; padding-top:3px">
							<table width="100%">
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px;"><bean:message key='display.option.flight' bundle='modeanalysisresources'/></label><input id="flight" value="525" type="text" class="k-input numeric-value" style="width: 30px;" ></td></tr>
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px;"><bean:message key='display.option.truck' bundle='modeanalysisresources'/></label><input id="truck" value="45" class="k-input numeric-value" type="text" style="width: 30px;"></td></tr>
							</table>
						</div>
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.offsets' bundle='modeanalysisresources'/></label></div>
						<div class="section-box-content" style="text-align: right; padding-right: 5px; padding-top:3px">
							<table  width="100%">
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px;"><bean:message key='display.option.availableTime' bundle='modeanalysisresources'/></label><input id="availableTime" type="text" value="0" class="k-input numeric-value" style="width: 30px;"></td></tr>
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px;"><bean:message key='display.option.dueTime' bundle='modeanalysisresources'/></label><input id="dueTime" type="text" value="0" class="k-input numeric-value" style="width: 30px;"></td></tr>
							</table>
						</div>
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.ZuluMidnightsToConsider' bundle='modeanalysisresources'/></label></div>
						<div class="section-box-content" style="text-align: right;padding-right: 5px; padding-top:3px">
							<table width="100%">
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px; padding-left:0px"><bean:message key='display.option.originToActivity' bundle='modeanalysisresources'/></label><input id="originToActivity" type="text" value="1" class="k-input numeric-value" style="width: 30px;"></td></tr>
								<tr><td><label class="label_style" style="padding-top:2px;padding-right: 10px; padding-left:0px"><bean:message key='display.option.activityToDest' bundle='modeanalysisresources'/></label><input id="activityToDest" type="text" value="1" class="k-input numeric-value" style="width: 30px;"></td></tr>
							</table>
						</div>	
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.display' bundle='modeanalysisresources'/></label></div>
						<div class="section-box-content">
							<table>
								<tr><td><input id="leftFlightOption" type="checkbox" checked="checked" ><label for="leftFlightOption" class="label_style" style="padding-top:2px;"><bean:message key='display.option.flightsFromOrigin' bundle='modeanalysisresources'/></label></td></tr>
								<tr><td><input id="leftTruckOption" type="checkbox" checked="checked" ><label for="leftTruckOption" class="label_style" style="padding-top:2px;"><bean:message key='display.option.trucksFromOrigin' bundle='modeanalysisresources'/></label></td></tr>
								<tr><td><input id="rightFlightOption" type="checkbox" checked="checked" ><label for="rightFlightOption" class="label_style" style="padding-top:2px;"><bean:message key='display.option.flightsToDestination' bundle='modeanalysisresources'/></label></td></tr>
								<tr><td><input id="rightTruckOption" type="checkbox" checked="checked" ><label for="rightTrucksOption" class="label_style" style="padding-top:2px;"><bean:message key='display.option.trucksToDestination' bundle='modeanalysisresources'/></label></td></tr>
							</table>
						</div>	
					</div>
					<div class="section-box">
						<div><label class="section-header"><bean:message key='display.option.legend' bundle='modeanalysisresources'/></label></div>
						<div class="section-box-content">
							<table>
								<tr>
									<td>
										<label class="label_style" style="padding-left: 0px"><bean:message key='display.option.origin' bundle='modeanalysisresources'/></label>
									</td>
									<td>
										<input id="leftFlight" class="gradientVioletBtn" type="button" value="<bean:message key='header.button.flight' bundle='modeanalysisresources'/>" />
									</td>
								</tr>
								<tr>
									<td>
										<label></label>
									</td>	
									<td>
										<input id="leftTruck" type="button" class="gradientOrangeBtn"  value="<bean:message key='header.button.truck' bundle='modeanalysisresources'/>" />
									</td>
								</tr>
								<tr>
									<td height="10px">
									</td>
								</tr>
								<tr>
									<td>
										<label class="label_style" style="padding-left: 0px"><bean:message key='display.option.destination' bundle='modeanalysisresources'/></label>
									</td>	
									<td>
										<input id="rightFlight" class="gradientBlueBtn" type="button"  value="<bean:message key='header.button.flight' bundle='modeanalysisresources'/>" />
									</td>
								</tr>
								<tr>
									<td>
										<label></label>
									</td>	
									<td>
										<input id="rightTruck" class="gradientGreenBtn" type="button"  value="<bean:message key='header.button.truck' bundle='modeanalysisresources'/>" />
									</td>
								</tr>
							</table>		
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="upperDiv" style="height: 217px">
			<div id="leftDiv" class="leftDiv">
				<div class="topLeftDiv">
					<div id="topLeftOriginsDiv" style="height: 166px">
						<div style="padding-top: 5px; text-align:center" class="modeAnalysisTitle"><label><bean:message key='header.title.origins' bundle='modeanalysisresources'/></label></div>
						<div style="padding-top: 10px;" class="left-padding1">
							<input id="showOrigins" onclick="originCheckBoxClickHandler()" type="checkbox"/><label class="label_style"><bean:message key='header.title.region' bundle='modeanalysisresources'/></label>
						</div>
						<div class="left-padding4">
							<input id="modeOrigins" style="width: 120px"/>
						</div>
						<div style="padding-top: 3px;" class="left-padding1">
							<input type="checkbox" id="originActivityCheckBox" onclick="originCheckBoxClickHandler()"/><label class="label_style"><bean:message key='header.title.activity' bundle='modeanalysisresources'/></label>
						</div>
						<div class="left-padding4">
							<input id="originActivity" style="width: 90px; text-align:left;"/>
						</div>
						<div style="padding-top: 3px;" class="left-padding1">
							<input type="checkbox" id="originTimeCheckBox" onclick="applyOriginTimeHandler(event)"/><label class="label_style" ><bean:message key='header.title.time' bundle='modeanalysisresources'/></label>
						</div>
						<div class="left-padding4">
							<span><input id="originTime" onkeypress="locTimeKeyPressHandler(event)" onblur="timeblurHandler(event)" placeholder="hh:mm"  maxlength="5" class="k-input" style="width: 45px; height:18px; text-align:center"/></span>
							<span style="float:right; margin-right:5px;"><input id="applyOrigins" style="min-width: 50px !important; height:20px !important" onclick="applyModeData(event, 'modeOrigins')" type="button" value="<bean:message key='header.button.apply' bundle='modeanalysisresources'/>"/></span>
						</div>
					</div>
				</div>
				<div class="leftTableLabelDiv">
					<table class="locActTable" cellpadding="0" cellspacting="0" border="0">
						<tr>
							<td class="locActCol"><bean:message key='header.title.location' bundle='modeanalysisresources'/></td>
							<td class="locActCol"><bean:message key='header.title.activity' bundle='modeanalysisresources'/></td>
							<td class="locActCol"><bean:message key='header.title.time' bundle='modeanalysisresources'/></td>
						</tr>
					</table>
				</div>
			</div>
			<div id="rightDiv" class="rightDiv" style="width: 205px">
				<div class="rightFirstVDiv">
					<div class="topRightDiv">
						<div id="topRightDestinationsDiv">
							<div style="padding-top: 5px; text-align:center" class="modeAnalysisTitle"><label><bean:message key='header.title.destinations' bundle='modeanalysisresources'/></label></div>
							<div style="padding-top: 10px" class="left-padding1">
								<input id="showDestinations" onclick="destinationCheckBoxClickHandler()" type="checkbox"/><label class="label_style"><bean:message key='header.title.region' bundle='modeanalysisresources'/></label>
							</div>
							<div class="left-padding4">
								<input id="modeDestinations" style="width: 120px"/>
							</div>
							<div style="padding-top: 3px" class="left-padding1">
								<input type="checkbox" id="destinationActivityCheckBox" onclick="destinationCheckBoxClickHandler()"/><label class="label_style"><bean:message key='header.title.activity' bundle='modeanalysisresources'/></label>
							</div>
							<div class="left-padding4">
								<input id="destinationActivity" style="width: 90px"/>
							</div>
							<div style="padding-top: 3px;" class="left-padding1">
								<input type="checkbox" id="destinationTimeCheckBox" onclick="applyDestinationTimeHandler(event)"/><label class="label_style"><bean:message key='header.title.time' bundle='modeanalysisresources'/></label>
							</div>
							<div class="left-padding4">
								<span><input id="destinationTime" onkeypress="locTimeKeyPressHandler(event)" onblur="timeblurHandler(event)" maxlength="5" placeholder="hh:mm" class="k-input" style="width: 45px; height:18px; text-align:center"/></span>
								<span style="float:right; margin-right:5px;"><input id="applyDestinations" style="min-width: 50px !important;" onclick="applyModeData(event, 'modeDestinations')" type="button" value="<bean:message key='header.button.apply' bundle='modeanalysisresources'/>"/></span>
							</div>
						</div>
					</div>
					<div class="rightTableLabelDiv">
						<table class="locActTable" cellspacing="0" cellpadding="0">
							<tr>
								<td class="locActCol"><bean:message key='header.title.time' bundle='modeanalysisresources'/></td>
								<td class="locActCol"><bean:message key='header.title.location' bundle='modeanalysisresources'/></td>
								<td class="locActCol"><bean:message key='header.title.activity' bundle='modeanalysisresources'/></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			
			<div id="centerDiv" class="centerDiv">
				<div class="centerTopDiv">
					<div id="centerTopFirstDiv" class="centerTopFirstDiv" style="overflow: hidden; font-size:95%;">
					<table width="100%" style="text-align: center;" border="0" cellspacing="0" cellpadding="0" >
							<tr>
								<td style="padding-top: 10px ;padding-left: 10px;">
									<table>
										<tr>
											<td>
												<label class="section-header" style="vertical-align: bottom; font-weight: bold;color: #000000 !important;"><bean:message key='header.title.location' bundle='modeanalysisresources'/></label>
											</td>	
										</tr>
										<tr>
											<td>
												<input type="text" id="hubLocation" style="width:60px;" />
											</td>	
										</tr>
									</table>		
								</td>
								<td>
									<label></label>
								</td>
								<td>
									<label style="float: left;padding-bottom: 10px"><bean:message key='header.title.filterBy' bundle='modeanalysisresources'/></label>
								</td>
							</tr>	
							<tr>
								<td style="vertical-align:bottom; ">
									<table>
									<tr>
										<td style="padding-right:5px;">
											
											<table id="applyActivityConstraintsTable" class="centerTopFirstTable">
												<tr style="vertical-align: bottom;">	
													<td style="padding-left:5px;text-align:center"><label><bean:message key='header.title.activity' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:5px;text-align:center"><label><bean:message key='header.title.activity.start' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:5px;text-align:center"><label><bean:message key='header.title.activity.duration' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:5px;text-align:center"><label><bean:message key='display.option.dueTime' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:5px;text-align:center"><label><bean:message key='header.title.activity.end' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:2px; text-align:center"><label style="white-space: normal !important;"><bean:message key='header.title.min.processing.time' bundle='modeanalysisresources'/></label></td>
													<td style="padding-left:5px;text-align:center"><label><bean:message key='header.title.activity.availTime' bundle='modeanalysisresources'/></label></td>
												</tr>
												<tr>	
													<td style="padding-left:5px;text-align:center"><input type="text" id="hubActivity" style="width:50px;"/></td>
													<td style="padding-left:5px;text-align:center"><input id="actStart" type="text" onblur="timeblurHandler(event);activityStartHandler(event);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right:4px"/></td>
													<td style="padding-left:5px;text-align:center"><input id="actDuration" type="text" onblur="timeblurHandler(event);activityDurationHandler(event);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right:4px"/></td>
													<td style="padding-left:5px;text-align:center"><label  id="headerDueTimeLbl" style="width:50px;"></label></td>
													<td style="padding-left:5px;text-align:center"><input id="actEnd" type="text" onblur="timeblurHandler(event);activityEndHandler(event);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right:4px"/></td>
													<td style="padding-left:5px;text-align:center"><input id="minProTime" type="text" onblur="timeblurHandler(event);minProTimeHandler(event);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right: 4px;margin-left: 10px;margin-right: 10px;" value="15"/></td>
													<td style="padding-left:5px;text-align:center"><label  id="headerAvailTimeLbl" style="width:50px;"></label></td>
												</tr>
											</table>
										</td>
									</tr>
									</table>	
								</td>
								<td style="vertical-align: bottom; padding-right: 10px;"><input type="button" style="width:120px" value="<bean:message key='header.button.refresh' bundle='modeanalysisresources'/>" onclick="refreshChartHandler()"/></td>
								<td style="vertical-align: bottom;">
									<div id="applyOandDConstraintsTable">
										<!-- <div id="mt" style="position: relative;top: 52px;left: -26px;">
											<div id="a1pplyOandDConstraintsTable" style="/* position: relative; */background: red;width: 120px;height: 10px;display: inline-block;/* top: 60px; *//* left: 6px; */"></div>
											<div id="a11pplyOandDConstraintsTable" style="/* position: relative; */background: red;width: 120px;height: 10px;/* top: 50px; */display: inline;/* left: 46px; */display: inline-block;margin-left: 40px;"></div>
										</div> -->
										<table border="0" cellspacing="0" cellpadding="0">
											<tr style="vertical-align: bottom;">
												<td style=" width: 40px;visibility: hidden;"><label style="white-space: normal !important;"><bean:message key='header.title.allModes' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.allModes' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.canTruck' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.mustFly' bundle='modeanalysisresources'/></label></td>
												
												<td style=" width: 40px;visibility: hidden;"><label style="white-space: normal !important;"><bean:message key='header.title.allModes' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 70px;visibility: hidden;"><label style="white-space: normal !important;"><bean:message key='header.title.allModes' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.allModes' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.canTruck' bundle='modeanalysisresources'/></label></td>
												<td style=" width: 40px; "><label class="label_style" style="white-space: normal !important;"><bean:message key='header.title.mustFly' bundle='modeanalysisresources'/></label></td>
											</tr>
											<tr style="text-align: center;">	
												<td align="right"><label><bean:message key='header.title.origins' bundle='modeanalysisresources'/></label></td>
												<td style="padding-left:4px;"><div class="div-line"><input name="originDisplay" type="radio" id="allmodesOrigin" onclick="applyFilterConstraints(this)" checked="checked"/><label style="min-width: 16px;"></label></td>
												<td ><div class="div-line"><input name="originDisplay" type="radio" id="canTruckOrigin" onclick="applyFilterConstraints(this)" /><label style="min-width: 16px;"></label></td>
												<td ><div class="div-line"><input name="originDisplay" type="radio" id="mustFlyOrigin" onclick="applyFilterConstraints(this)" /><label style="min-width: 16px;"></label></td>
												<td><label></label></td>
												<td><label style="padding-left:10px !important;margin-left: 10px;"><bean:message key='header.title.destinations' bundle='modeanalysisresources'/></label></td>
												<td style="padding-left:4px;"><div class="div-line"><input name="destinationsDisplay" type="radio" id="allmodesDest" onclick="applyFilterConstraints(this)" checked="checked"/><label style="min-width: 16px;"></label></td>
												<td ><div class="div-line"><input name="destinationsDisplay" type="radio" id="canTruckDest" onclick="applyFilterConstraints(this)" /><label style="min-width: 16px;"></label></td>
												<td ><div class="div-line"><input name="destinationsDisplay" type="radio" id="mustFlyDest" onclick="applyFilterConstraints(this)" /><label style="min-width: 16px;"></label></td>
											</tr>
										</table>
										<table>
											<tr style="text-align: center;">	
												<td><label><bean:message key='header.title.travelTimeFromOrigin' bundle='modeanalysisresources'/></label></td>
												<td><input id="travelTimeFromOrigin" type="text" onblur="timeblurHandler(event,true);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right:4px;width: 40px;"/></td>
												<td><label><bean:message key='header.title.hours' bundle='modeanalysisresources'/></label></td>
												
												<td><label style="padding-left: 25px;"><bean:message key='header.title.travelTimeToDestination' bundle='modeanalysisresources'/></label></td>
												<td><input id="travelTimeToDestination" type="text" onblur="timeblurHandler(event,true);" maxlength="5" placeholder="hh:mm" class="k-input" style="height:18px; padding-left:4px; padding-right:4px;width: 40px;"/></td>
												<td><label><bean:message key='header.title.hours' bundle='modeanalysisresources'/></label></td>
											</tr>
										</table>
									</div>
								</td>
							</tr>
						</table>
					</div>
					
					<div id="scaleDiv" class="scale">
					</div>
				</div>
				<div id="sliderOuterDiv" class="sliderOuterDiv">
					<div id="slider" class="sliderDiv">
						<input />
	         			<input />
					</div>
				</div>
				<div id="sliderBox" class="sliderBoxStyle" onmousedown="sliderBoxMouseDownHandler(event)" onmouseup="sliderBoxMouseUpHandler(event)">
					<div id="dashedLine" class="dashedVLine">
						<label id="dueTimeLbl" class="dueTimeLbl">Due Time</label>
					</div>
				</div>
			</div>
		</div>
		
		<div id="lowerDiv" style="overflow-y:scroll">
			<div id="leftDiv" class="leftDiv">
				<div id="bottomLeftDiv" class="leftTableLabelDiv">
					<table id="originTable" class="locActTable" cellpadding="0" cellspacting="0" border="0">
						<tr>
						</tr>
					</table>
				</div>
			</div>
			
			<div id="rightDiv" class="rightDiv">
				<div class="rightFirstVDiv">
					<div id="bottomRightDiv" class="rightTableLabelDiv">
						<table id="destinationTable" class="locActTable" cellspacing="0" cellpadding="0">
							<tr>
							</tr>
						</table>
					</div>
				</div>
				<div class="rightSecondVDiv">
					<div class="topRightRightDiv"></div>
					<div>
						<table id="addRemoveRowTable" class="addRemoveRowTable" cellspacing="0" cellpadding="0">
							<tr>
								<td>
									<a onclick="addRemoveRowClickHandler(event)" class="k-window-action iconbtn" href="#!">
							     		<span class="k-icon add-row" style="height: 16px;width: 16px;">
							     		</span>
							     	</a>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			
			<div id="centerDiv" class="centerLowerDiv">
				<div id="gantChartOuterDiv" class="gantChartOuterDiv">
					<div id="ganttChart" class="ganttChartDiv">
					</div>
				</div>
			</div>
 		</div>
	</div>
</body>	
</html>