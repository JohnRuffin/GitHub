<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Map Options</title>
		<script>
			$(document).ready(function(){
				if(!(typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery())){
					//$("#ntwShowErrorsDrawerDiv").empty();	//hiding network erros div
					//$("#ntwShowModeDrawerDiv").empty();		//hiding netwrok modes div
					$("#schdShowModeDrawerDiv").empty();		//hiding schedule modes div
					$("#utilIndicator").empty();				//hiding schdule lineIindicator div
					$("#schdShowLegTypeDrawerDiv").empty();	//hiding schdule legType div 
					
					//$("#ntwShowErrorsDrawerDiv").hide();	//hiding network erros div
					//$("#ntwShowModeDrawerDiv").hide();		//hiding netwrok modes div
					$("#schdShowModeDrawerDiv").hide();		//hiding schedule modes div
					$("#utilIndicator").hide();				//hiding schdule lineIindicator div
					$("#schdShowLegTypeDrawerDiv").hide();	
					$("#mapOptions").css({"top" :"70px"});
				}
			});
		</script>
	</head>
	<body>
		<div id="mapOptions" class="slidingWinOpt" style="width:400px;">
			<div class="header-title">
				<bean:message key='map.display.option.header.mapsetting' bundle='networkfilters'/>
			</div>
			<div class="slidingWinContent" style="overflow:hidden">
				<div class="slidingWinContent-innercontainer" style="margin-top: -1px; height:98%"> 
					<div id="displayOptionsTabstrip" class="panelBG">
					 	<ul class="tabStripBar display-tabstripbar" style="position:relative; width:99.4%">
							<li id="scheduletabli"><bean:message key='map.display.option.tab.schedule' bundle='networkfilters'/></li>
							<li id="networktabli" class="k-state-active"><bean:message key='map.display.option.tab.network' bundle='networkfilters'/></li>
							<li id="generaltabli"><bean:message key='map.display.option.tab.general' bundle='networkfilters'/></li>
							<li id="networkLegend"><bean:message key='map.display.option.tab.legend' bundle='networkfilters'/></li>
							<div class="buttonbar-in-tabstrip"><input type="button" id="applyDisplaySettings" onclick="applyDisplaySettings()" style="padding-top:1px; padding-left:10px; padding-right:10px; padding-bottom:2px; min-width:55px; width:55px; min-height:16px; height:16px !important;position : absolute;top : -2px;right:0px" value="<bean:message key='map.display.option.applybutton.label' bundle='networkfilters'/>"></div>
						</ul>
						<div id="scheduletabDiv" class="sliding-content-container">
							<div id="utilIndicator" class="section-box">
								<div><label class="section-header">Route utilization color setting</label></div>
								<div class="section-box-content">
									<table border="0">
										<tr>
											<td style="padding-left:25px"><input type="checkbox" checked="checked" id="isUnderSelected" /><label class="label_style" style="padding-left: 15px;padding-right: 5px;"><div class="bar-dark-red">Under</div></label></td>
											<td><input type="checkbox" checked="checked" id="isNormalSelected" /><label class="label_style" style="padding-left: 15px;padding-right: 5px;"><div class="bar-green"></div></label></td>
											<td><input type="checkbox" checked="checked" id="isCautionSelected" /><label class="label_style" style="padding-left: 15px;padding-right: 5px;"><div class="bar-orange"></div></label></div></td>
											<td><input type="checkbox" checked="checked" id="isExcessSelected" /><label class="label_style" style="padding-left: 15px;padding-right: 5px;"><div class="bar-red"></div></label></td>
										</tr>
									</table>
									<table border="0">
										<tr>
											<td><input type="text" id="txtUnder" value="0" onkeypress="validateNumber(event)" class="k-textbox" style="width:50px; margin-right:5px; margin-left:5px; margin-top:0px;text-align:center;"/><span class="k-icon arrow-under"></td>
											<td><input type="text" id="txtNormal" value="10" onkeypress="validateNumber(event)" class="k-textbox" style="width:50px; margin-right:5px; margin-left:5px; margin-top:0px;text-align:center;"/><span class="k-icon arrow-normal"></td>
											<td><input type="text" id="txtCaution"  value="80" onkeypress="validateNumber(event)" class="k-textbox" style="width:50px; margin-right:5px; margin-left:5px; margin-top:0px;text-align:center;"/><span class="k-icon arrow-caution"></td>
											<td><input type="text" id="txtExcess"  value="100" onkeypress="validateNumber(event)" class="k-textbox" style="width:50px; margin-left:5px; margin-right:5px; margin-top:0px;text-align:center;"/><span class="k-icon arrow-excess"></td>
										</tr>
										<tr><td colspan="6"><input type="radio" name="loadindicatorsgrp" id="cuberadio" /><label style="min-width: 10px !important"  for ="cuberadio" class="label_style"><bean:message key='map.display.option.schedule.cube' bundle='networkfilters'/></label> </td>															
										<tr><td colspan="6"><input type="radio" name="loadindicatorsgrp" id="weightradio"/><label for="weightradio" class="label_style"><bean:message key='map.display.option.schedule.weight' bundle='networkfilters'/></label></td></tr>
										<tr><td colspan="6"><input type="radio" name="loadindicatorsgrp" id="highstradio"  checked="checked" /><label for="highstradio" class="label_style"><bean:message key='map.display.option.schedule.highestofcubeweight' bundle='networkfilters'/></label> </td></tr>
									</table>
								</div>
							</div>
							<div id="schdShowLegTypeDrawerDiv" class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.schedule.showlegtype' bundle='networkfilters'/></label></div>
								<div class="section-box-content">
											<div id="networkLegtypeOptions">
												<table>
													<tr><td><input type="checkbox"  id="netlegtypeFlyChk" onclick="validateComboBoxOnCheckbox(this, 'networkFlyCombo','kendoMultiSelectBox')"/><label for="netlegtypeFlyChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeFlyTrunk' bundle='networkfilters'/></label></td><td class="left-padding1"><input id="networkFlyCombo" style="min-width: 190px"/></td></tr>
													<tr><td><input type="checkbox"  id="netlegtypeTruckChk" onclick="validateComboBoxOnCheckbox(this, 'networkTruckCombo','kendoMultiSelectBox')"/><label for="netlegtypeTruckChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeTruck' bundle='networkfilters'/></label></td><td class="left-padding1"><select id="networkTruckCombo" style="min-width: 190px"></select></td></tr>
												</table>
											</div>
											<div>
												<table>
													<tr><td><input type="checkbox"  id="schematiclegtypeRailChk" onclick="validateComboBoxOnCheckbox(this, 'railCombo')"/><label for="schematiclegtypeRailChk" class="label_style"><bean:message key='schematic.display.option.legtypeRail' bundle='schematicresources'/></label></td><td class="left-padding1"><select id="railCombo" style="min-width: 190px"></select></td></tr>
													<tr><td><input type="checkbox"  id="schematiclegtypeShipChk" onclick="validateComboBoxOnCheckbox(this, 'shipCombo')"/><label for="schematiclegtypeShipChk" class="label_style"><bean:message key='schematic.display.option.legtypeShip' bundle='schematicresources'/></label></td><td class="left-padding1"><select id="shipCombo" style="min-width: 190px"></select></td></tr>
												</table>
											</div>
								</div>
							</div>
							<div class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.schedule.legdetail' bundle='networkfilters'/></label></div>
								<div class="section-box-content">
									<div><label class="section-subheading"><bean:message key='schematic.display.option.showcolumnsonmatrix' bundle='schematicresources'/></label></div>
									<div class="section-box-content">
										<table>	
											<tr><td class="top-margin3"><input type="checkbox" checked="checked" id="schematicMatrixweightChk" onclick="showHideColumnsInPopup(this,'TOTAL_WEIGHT', 'leg')"/><label for="schematicMatrixweightChk" class="label_style"><bean:message key='schematic.display.option.weight' bundle='schematicresources'/></label></td></tr>
											<tr><td><input type="checkbox" checked="checked" id="schematicMatrixpiecesChk" onclick="showHideColumnsInPopup(this,'TOTAL_PIECES', 'leg')"/><label for="schematicMatrixpiecesChk" class="label_style"><bean:message key='schematic.display.option.pieces' bundle='schematicresources'/></label></td></tr>
											<tr><td><input type="checkbox" checked="checked" id="schematiMatrixccubeChk" onclick="showHideColumnsInPopup(this,'TOTAL_CUBE', 'leg')"/><label for="schematiMatrixccubeChk" class="label_style"><bean:message key='schematic.display.option.cube' bundle='schematicresources'/></label></td></tr>
										</table>
									</div>
								</div>		
							</div>
							<div class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.schedule.marketview' bundle='networkfilters'/></label></div>
								<div class="section-box-content">
									<%-- <div><label><bean:message key='map.display.option.schedule.showLegDetails' bundle='networkfilters'/></label></div>
									<div class="section-box-content">
										<table>
											<tr><td><input type="radio" name="showMarketContgrp" id="marketviewExpandedradio" /><label for="marketviewExpandedradio" class="label_style"><bean:message key='map.display.option.schedule.marketviewExpanded' bundle='networkfilters'/></label> </td></tr>
											<tr><td><input type="radio" checked="checked" name="showMarketContgrp" id="marketviewCollapsedradio"  /><label for="marketviewCollapsedradio" class="label_style"><bean:message key='map.display.option.schedule.marketviewCollapsed' bundle='networkfilters'/></label> </td></tr>
										</table>
									</div> --%>
									<div><label class="section-subheading"><bean:message key='map.display.option.schedule.marketViewExample' bundle='networkfilters'/></label></div>
									<div id="marketViewExample" class="marketViewExampleDiv">
										
									</div>
									<div style="margin-top:10px;"><label class="section-subheading"><bean:message key='map.display.option.schedule.showLabelsSelectAnyTwo' bundle='networkfilters'/></label></div>
									<div class="section-box-content">
											<div id="marketViewOptions">
												<table width="100%" >
													<tr>
														<td width="33%"><input type="checkbox"  id="routesLabelChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="routesLabelChk" class="label_style"><bean:message key='schematic.display.option.routehash' bundle='schematicresources'/></label></td>
														<td width="33%"><input type="checkbox"  id="marketOrgDestChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="marketOrgDestChk" class="label_style"><bean:message key='schematic.display.option.marketOrgDest' bundle='networkfilters'/></label></td>
														<td width="34%"><input type="checkbox"  id="marketViewWChk" onclick="marketViewChangeHandler(this)"/><label for="marketViewWChk" class="label_style"><bean:message key='map.display.option.schedule.marketviewW' bundle='networkfilters'/></label></td>
																					
													</tr>
													<tr>
														<td><input type="checkbox"  id="iataEquipDescLabelChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="iataEquipDescLabelChk" class="label_style" ><bean:message key='schematic.display.option.iataEquiptype' bundle='schematicresources'/></label></td>
														<td><input type="checkbox"  id="departureTimeLabelChk" onclick="marketViewChangeHandler(this)"/><label for="departureTimeLabelChk" class="label_style"><bean:message key='schematic.display.option.depttime' bundle='schematicresources'/></label></td>
														<td><input type="checkbox"  id="marketViewWPercentChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="marketViewWPercentChk" class="label_style"><bean:message key='map.display.option.schedule.marketviewWPercent' bundle='networkfilters'/></label></td>
													
													</tr>
													<tr>
														<td><input type="checkbox"  id="equipCodeLabelChk" onclick="marketViewChangeHandler(this)"/><label for="equipCodeLabelChk" class="label_style"><bean:message key='schematic.display.option.equipcode' bundle='schematicresources'/></label></td>
														<td><input type="checkbox"  id="effDaysLabelChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="effDaysLabelChk" class="label_style"><bean:message key='schematic.display.option.effdays' bundle='schematicresources'/></label></td>
														<td><input type="checkbox"  id="marketViewCuChk" onclick="marketViewChangeHandler(this)"/><label for="marketViewCuChk" class="label_style"><bean:message key='map.display.option.schedule.marketviewCu' bundle='networkfilters'/></label></td>
													</tr>
													<tr>
														<td><input type="checkbox"  id="marketViewVolChk"  checked="checked" onclick="marketViewChangeHandler(this)"/><label for="marketViewVolChk" class="label_style"><bean:message key='map.display.option.schedule.day' bundle='networkfilters'/></label></td>
														<td><input type="checkbox"  id="arrivalTimeLabelChk" onclick="marketViewChangeHandler(this)"/><label for="arrivalTimeLabelChk" class="label_style"><bean:message key='schematic.display.option.arrivtime' bundle='schematicresources'/></label></td>
														<td><input type="checkbox"  id="marketViewCuPercentChk" checked="checked" onclick="marketViewChangeHandler(this)"/><label for="marketViewCuPercentChk" class="label_style"><bean:message key='map.display.option.schedule.marketviewCuPercent' bundle='networkfilters'/></label></td>
													</tr>
												</table>
											</div>
											
									</div>
								</div>		
							</div>
						</div>
						<div id="networktabDiv" class="sliding-content-container">
							<logic:equal name="isAdvanceQueryModule" value="N">
								<div class="section-box" id="schematicNetworkLinesDiv" style="display: none">
									<div><label class="section-header"><bean:message key='schematic.display.option.showaddnllinelbls' bundle='schematicresources'/></label></div>
									<div class="section-box-content">
									<div><label class="section-header"><bean:message key='schematic.display.option.schedule.showlabels' bundle='schematicresources'/></label></div>
										<div class="section-box-content">
											<table>
												<tr>
													<td colspan="5"><div class="network-routes-line"></div></td>
												<tr>
												<tr >
													<td style="padding-left:24px"><input type="checkbox"  id="labelDepartureDaysChk" /><label for="labelDepartureDaysChk" class="label_style"><bean:message key='map.display.option.network.deptdays' bundle='networkfilters'/></label></td>
													<td style="padding-left:24px"><input type="checkbox"  id="labelArrivalDaysChk" /><label for="labelArrivalDaysChk" class="label_style"><bean:message key='schematic.display.option.arrivaldays' bundle='schematicresources'/></label></td>
												</tr>
												<tr >
													<td style="padding-left:24px"><input type="checkbox"  id="labelAvailableTimeChk" /><label for="labelAvailableTimeChk" class="label_style"><bean:message key='schematic.display.option.availabletime' bundle='schematicresources'/></label></td>
													<td style="padding-left:24px"><input type="checkbox"  id="labelDueTimeChk" /><label for="labelDueTimeChk" class="label_style"><bean:message key='schematic.display.option.duetime' bundle='schematicresources'/></label></td>
												</tr>
											</table>
										</div>
										<!--
										<table>
											<tr><td><label><bean:message key='schematic.display.option.showlanesforupto' bundle='schematicresources'/></label>&nbsp;<input id="remainingdaysinput" type="text" id="startValue2" value="2" class="k-textbox" style="width:30px;height:20px;margin-right:10px"/><label class="common-textformat"><bean:message key='schematic.display.option.remainingdays' bundle='schematicresources'/></label></td></tr>
										</table>
										-->
									</div>	
								</div>							
							</logic:equal>							
							<div class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.lanedetail' bundle='schematicresources'/></label></div>
								<div class="section-box-content">
									<div><label class="section-subheading"><bean:message key='schematic.display.option.showcolumnsonmatrix' bundle='schematicresources'/></label></div>
									<div class="section-box-content left-padding3">
										<table>
											<tr>
												<td><input type="checkbox"  id="popupDisplayOptionWeightChk" checked="checked" onclick="showHideColumnsInPopup(this,'TOTAL_WEIGHT', 'lane')"/>&nbsp;<label for="popupDisplayOptionWeightChk" class="label_style"><bean:message key='schematic.display.option.weight' bundle='schematicresources'/></label></td>
												<td class="left-padding2"><input type="checkbox"  id="popupDisplayOptionCubeChk" checked="checked" onclick="showHideColumnsInPopup(this,'TOTAL_CUBE', 'lane')"/>&nbsp;<label for="popupDisplayOptionCubeChk" class="label_style"><bean:message key='schematic.display.option.cube' bundle='schematicresources'/></label></td>
											</tr>
											<tr>
												<td><input type="checkbox"  id="popupDisplayOptionPiecesChk" checked="checked" onclick="showHideColumnsInPopup(this,'TOTAL_PIECES', 'lane')"/>&nbsp;<label for="popupDisplayOptionPiecesChk" class="label_style"><bean:message key='schematic.display.option.pieces' bundle='schematicresources'/></label></td>
												<td class="left-padding2"><input type="checkbox"  id="popupDisplayOptionOdpdChk" checked="checked" onclick="showHideColumnsInPopup(this,'ODPD', 'lane')"/>&nbsp;<label for="popupDisplayOptionOdpdChk" class="label_style"><bean:message key='schematic.display.option.odpdcount' bundle='schematicresources'/></label></td>
											</tr>
										</table>
									</div>
								</div>
							</div>	
							<div class="section-box">
							<div><label class="section-header"><bean:message key='map.display.option.hub' bundle='networkfilters'/></label></div>
								<div class="section-box-content">
									<div class="section-box-content left-padding3">
										<table >
											<tr>
												<td><input type="radio"  id="sortActivityType" checked="checked" name="showAsHubGroup" value="sortActivityType" /><label for="sortLocationHub" class="label_style" onclick="labelClickHandler('sortActivityType')"><bean:message key='map.display.option.sorts.hub' bundle='networkfilters'/></label></td>
											</tr>
											<tr>
												<td><input type="radio"  id="sortconsolidationActivityType"  name="showAsHubGroup" value="sortconsolidationActivityType"/><label for="sortconsolidationHub" class="label_style" onclick="labelClickHandler('sortconsolidationActivityType')"><bean:message key='map.display.option.sorts.consolidation.hub' bundle='networkfilters'/></label></td>
											</tr>
										</table>
									</div>
								</div>
							</div>		
						</div>
						<div id="prefrencestabDiv" class="sliding-content-container">
							<div class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.map.display' bundle='networkfilters'/></label></div>
								<div class="section-box-content">
									<table>
										<tr>
											<td>
												<table>
													<tr>
														<td><label class="common-textformat"><bean:message key='map.display.option.map.type' bundle='networkfilters'/></label></td>
														<td style="padding-left: 20px;"><label class="common-textformat"><bean:message key='map.display.option.region' bundle='networkfilters'/></label></td>
													</tr>
													<tr>
														<td><select id="baseMapsCmb" style="width:100px" onchange="changeBaseMap(this)"></select></td>
														<td style="padding-left: 20px;"><select id="regionCmb" style="width:100px" onchange="changeRegion(this)"></select></td>
														<td style="padding-left: 10px;"><input type="checkbox" id="autozoomChk" onclick="enableAutoZoom(this)"/><label for="autozoomChk" class="label_style"><bean:message key='map.display.option.auto.zoomon' bundle='networkfilters'/></label></td>
													</tr>
												</table>
											</td>
										</tr>
										<tr><td>&nbsp;</td></tr>
										<tr><td><label class="common-textformat"><bean:message key='map.display.option.opacity' bundle='networkfilters'/></label></td></tr>
										<tr><td style="padding-left: 10px;"><input id="transparencySlider" style="width: 235px" value="0" /></td></tr>
										<tr><td style="padding-left: 10px;"><div style="float:left;width:205px"><label class="common-textformat">0%</label></div><div><label class="common-textformat">100%</label></div></td></tr>
									</table>
								</div>	
							</div>
							<div class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.general.linesandlabels' bundle='networkfilters'/></label></div>
								<div class="left-margin2 top-margin2">
									<table>
										<tr>
											<td valign="top">
												<table>
													<tr><td class="nolblradio"><input id="nolblradio" type="checkbox" checked="checked" onclick="lineLabelRadioClickHandler()"/><label class="label_style"><bean:message key='map.display.option.general.showlocationlabelsas' bundle='networkfilters'/></label></td></tr>
													<tr><td class="left-padding2" style="padding-top:5px"><input type="radio" name="shwptlblgrp" id="ltrIdradio" checked="checked" onclick="lineLabelRadioClickHandler()"/>&nbsp;<label for="ltrIdradio"  class="label_style"><bean:message key='map.display.option.letter.id' bundle='networkfilters'/></label> </td></tr>
													<tr><td class="left-padding2"><input type="radio" name="shwptlblgrp" id="airCtyradio" onclick="lineLabelRadioClickHandler()"/>&nbsp;<label for="airCtyradio" class="label_style"><bean:message key='map.display.option.airport.city' bundle='networkfilters'/></label></td></tr>
												</table>
											</td>
											<td valign="top">
												<table border="0">
													<tr><td class="zoom_option_label"><label class="section-subheading"><bean:message key='map.display.option.zoom.option' bundle='networkfilters'/></label>	</td></tr>
													<tr>
														<td class="left-padding2">
															<select id="zoomLevelId"></select>
														</td>
													</tr>
												</table>
											</td>
										</tr>
										<tr><td colspan="2"><input type="checkbox" checked="checked" id="shwPictureMarkerSymbolsId"/><label class="label_style" for="shwPictureMarkerSymbolsId"><bean:message key='map.display.option.map.display.show.symbols' bundle='networkfilters'/></label></td></tr>
										<tr><td colspan="2"><input type="checkbox" id="shwNumberSymbolsId"/><label class="label_style" for="shwNumberSymbolsId"><bean:message key='map.display.option.map.display.show.symbols.count' bundle='networkfilters'/></label><div class="box-count"></div></td></tr>
									</table>
								</div>
							</div>
							<!-- Hiding geneal symbols and numbers -->
							<!-- 
							<div class="section-box">
								<div><label class="section-header"><bean:message key='map.display.option.general.numbersandsymbols' bundle='networkfilters'/></label></div>
								<div class="left-margin2 top-margin2">
									<table border="0">
										<tr>
											<td valign="top">
												<table border="0">
													<tr><td><label class="section-subheading"><bean:message key='map.display.option.general.showallsymbols' bundle='networkfilters'/></label></td></tr>
													<tr><td class="left-padding2"><input type="checkbox" name="shwPictureMarkerSymbols" id="shwPictureMarkerSymbolsId"   />&nbsp;<label for="ltrIdradio"  class="label_style" onclick="checkboxToggleHandler('shwPictureMarkerSymbolsId')"><bean:message key='map.display.option.general.showpicturessymbols' bundle='networkfilters'/></label> </td></tr>
													<tr><td class="left-padding2"><input type="checkbox" name="shwNumberSymbols" id="shwNumberSymbolsId"   />&nbsp;<label for="ltrIdradio"  class="label_style" onclick="checkboxToggleHandler('shwNumberSymbolsId')"><bean:message key='map.display.option.general.shownumberssymbols' bundle='networkfilters'/></label> </td></tr>
												</table>
											</td>
										</tr>
									</table>
								</div>
							</div>
							-->
							<%-- <div class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.shwconnwthmutltilane' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<table>
									<tr><td><input type="radio" checked name="showContgrp" id="schematicCollapsedradio"  /><label for="schematicCollapsedradio" class="label_style"><bean:message key='schematic.display.option.collapsed' bundle='schematicresources'/></label> </td><td><input type="radio" name="showContgrp" id="schematicExpandedradio" /><label for="schematicExpandedradio" class="label_style"><bean:message key='schematic.display.option.expanded' bundle='schematicresources'/></label> </td></tr>
								</table>
							</div>	
							</div> --%>
							</div>
							<div id="networkLegendTabDiv" class="sliding-content-container">
								<div class="section-box">
									<div><label class="section-header"><bean:message key='map.display.option.networkLegend.lanes' bundle='networkfilters'/></label></div>
									<table border="0" align="center">
										
										<tr>
											<td style="width:110px"><label class="common-textformat">&nbsp;</label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.fly' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.truck' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.other' bundle='networkfilters'/></label></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.inbound' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td><div class="solid-line-orange"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dash-line-orange"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dot-line-orange"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.outbound' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td><div class="solid-line-green"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dash-line-green"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dot-line-green"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.bothdirections' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td><div class="solid-line-blue"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dash-line-blue"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="dot-line-blue"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.noconnectivity' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td colspan="5"><div class="map-arrow-no-connectivity"></div></td>
										</tr>
										<tr>
											<td colspan="7" />
										</tr>
									</table>
									<div style="text-align:left;padding-top: 10px;"><label class="section-header"><bean:message key='map.display.option.scheduleLegend.routes' bundle='networkfilters'/></label></div>
									<table border="0" align="center">
										<tr>
											<td style="width:110px;" colspan="2"><label class="common-textformat">&nbsp;</label></td>
											<td align="center" style="padding-left: 10px;"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.normal' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.caution' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.excess' bundle='networkfilters'/></label></td>
										</tr>
										<tr>
											<td align="right" colspan="2"><label class="common-textformat"><bean:message key='map.display.option.schedule.legtypeFlyTrunk' bundle='networkfilters'/></label></td>
											<td style="padding-left: 10px;"><div class="arrow-green-solid"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-orange-solid"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-red-solid"></div></td>
										</tr>
										<tr>
											<td align="right" colspan="2"><label class="common-textformat"><bean:message key='map.display.option.schedule.legtypeFlyfeeder' bundle='networkfilters'/></label></td>
											<td style="padding-left: 10px;"><div class="arrow-green-dot"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-orange-dot"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-red-dot"></div></td>
										</tr>
										<tr>
											<td align="right" colspan="2"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.trucks' bundle='networkfilters'/></label></td>
											<td style="padding-left: 10px;"><div class="arrow-green-dash"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-orange-dash"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-red-dash"></div></td>
										</tr>
										<tr>
											<td align="right" colspan="2"><label class="common-textformat"><bean:message key='map.display.option.network.other' bundle='networkfilters'/></label></td>
											<td style="padding-left: 10px;"><div class="arrow-green-dash-dot"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-orange-dash-dot"></div></td>
											<td width="10">&nbsp;</td>
											<td><div class="arrow-red-dash-dot"></div></td>
										</tr>
									</table>
								</div>
								<div class="section-box">
									<div><label class="section-header"><bean:message key='map.display.option.networkLegend.Locations' bundle='networkfilters'/></label></div>
									<table border="0" align="center">
										<tr>
											<td><label class="common-textformat">&nbsp;</label></td>
											<td width="10">&nbsp;</td>
											<td align="center" width="60"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.locationonly' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center" width="60"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.locationandhub' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center" width="60"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.inconsistenttransit' bundle='networkfilters'/></label></td>
										</tr>
										<!--  
										<tr><td style="font-size: 10px;padding-left: 10px;padding-right: 20px;padding-bottom: 5px"><bean:message key='map.display.option.networkLegend.search.result' bundle='networkfilters'/></td></tr>
										-->
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.origin' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="circle-orange"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-orange"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-orange-exclamation"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.destination' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="circle-green"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-green"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-green-exclamation"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.bothoandd' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="circle-blue"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-blue"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-blue-exclamation"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.hub' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="circle-red"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-red"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-red-exclamation"></div></td>
										</tr>
										<tr>
											<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.transit' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="diamond-violet"></div></td>
											<td width="10">&nbsp;</td>
											<td align="center">&nbsp;</td>
											<td width="10">&nbsp;</td>
											<td align="center">&nbsp;</div></td>
										</tr>
										<!--  
										<tr><td colspan="5" style="font-size: 10px;padding-right: 20px;padding-left: 10px;padding-bottom: 5px"><bean:message key='map.display.option.networkLegend.show.loc' bundle='networkfilters'/></td></tr>
										-->
										<tr>
											<td colspan="2" />
											<td align="center"><div class="circle-lightblue"></div></td>
											<td align="left" colspan="4"><label><bean:message key='map.display.option.networkLegend.schduleOrigin' bundle='networkfilters'/></td>
										</tr>
										<tr>
											<td colspan="2" />
											<td align="center"><div class="gray-circle"></div></td>
											<td align="left" colspan="4"><bean:message key='map.display.option.networkLegend.any' bundle='networkfilters'/></td>
										</tr>
									</table>
								</div>
								<!-- Code for Symbols -->
								<div class="section-box">
									<div><label class="section-header"><bean:message key='map.display.option.networkLegend.symbols' bundle='networkfilters'/></label></div>
									<table border="0" align="center">
										<tr>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.excesscapacity' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="xs-small"></div></td>
											<td colspan="4">&nbsp;</td>
										</tr>
										<tr>
											<td align="center"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.lineRepresents' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="multiple-lanes-three"></div></td>
											<td>&nbsp;</td>
											<td align="left" colspan="3"><label><bean:message key='map.display.option.networkLegend.multiplelanes.flyortruck' bundle='networkfilters'/></td>
										</tr>
										<tr>
											<td align="right" style="padding-top: 10px;"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.multipleLineRepresents' bundle='networkfilters'/></label></td>
											<td width="10">&nbsp;</td>
											<td align="center"><div class="multiple-modes-three"></div></td>
											<td>&nbsp;</td>
											<td align="left" colspan="3"><label><bean:message key='map.display.option.schematic.networkLegend.multiplelanes.multiplemodes' bundle='networkfilters'/></td>
										</tr>
									</table>
								</div>
							</div> 
						</div>
					<!-- End of contents -->
				</div>
			</div>
		</div>
	</body>
</html>