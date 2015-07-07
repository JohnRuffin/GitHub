<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Schematic Drawer Settings</title>
		<script>
			/* $(document).ready(function(){
				if(!(typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery())){
					$("#ntwSchematicErrorsDiv").hide();
					$("#ntwSchematicModeDiv").hide();
					$("#schdSchematicModeDiv").hide();
					$("#schdSchematicLinesDiv").hide();
					$("#schdSchematicLegTypeDiv").hide();
				}
			}); */
		</script>
	</head>
	<body>
		<div id="mapOptions" class="slidingWinOpt mapWindowSettings" style="width:410px">
   		<div class="header-title">
			Schematic Settings
		</div>
		<div class="slidingWinContent" style="overflow:hidden">
			 <div class="slidingWinContent-innercontainer" style="margin-top: -1px; height:90%">
				<div id="displayOptionsTabstrip" class="panelBG">
					<ul class="tabStripBar display-tabstripbar schematictabbar" style="position:relative; width:99.4%">
						<li id="scheduletabli" class="k-state-active"><bean:message key='schematic.display.option.tab.schedule' bundle='schematicresources'/></li>
						<li id="networktabli"><bean:message key='schematic.display.option.tab.network' bundle='schematicresources'/></li>
						<li id="networkLegend"><bean:message key='schematic.display.option.tab.legend' bundle='schematicresources'/></li>
						<div class="buttonbar-in-tabstrip"><input type="button" id="applyDisplaySettings" onclick="applyDisplaySettings()" style="padding-top:1px; padding-left:10px; padding-right:10px; padding-bottom:2px; min-width:50px; min-height:18px; height:18px" value="<bean:message key='map.display.option.applybutton.label' bundle='networkfilters'/>"></div>
					</ul>
					<div id="scheduletabDiv" class="sliding-content-container">
						<div id="schdSchematicModeDiv" class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.schedule.showmodes' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<table>
									<tr>
									<td><input type="checkbox"  id="scheduleFlightChk"  checked="checked"/><label for="scheduleFlightChk" class="label_style"><bean:message key='map.display.option.schedule.flight' bundle='networkfilters'/></label></td>
									<td><input type="checkbox"  id="scheduleTruckChk"  checked="checked"/><label for="scheduleTruckChk" class="label_style"><bean:message key='map.display.option.schedule.truck' bundle='networkfilters'/></label> </td>
									</tr>
								</table>
							</div>	
						</div>
						<div class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.schematiclabels' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<div><label class="section-header"><bean:message key='schematic.display.option.schedule.showlabels' bundle='schematicresources'/></label></div>
								<div class="section-box-content">
									<table>	
										<tr>
											<td>
												<table style="width:100%">
													<tr>
														<td align="left" style="padding-left:40px;">
															<input type="checkbox"  id="routesLabelChk"/><label for="routesLabelChk" class="label_style"><bean:message key='schematic.display.option.routehash' bundle='schematicresources'/></label>
														</td>
														<td align="center">
															<input type="checkbox"  id="iataEquipDescLabelChk"/><label for="iataEquipDescLabelChk" style="white-space:normal;width:60px" class="label_style"><bean:message key='schematic.display.option.iataEquiptype' bundle='schematicresources'/></label>		
														</td>
														<td align="right" style="padding-right:40px">
															<input type="checkbox"  id="equipCodeLabelChk"/><label for="equipCodeLabelChk" class="label_style"><bean:message key='schematic.display.option.equipcode' bundle='schematicresources'/></label>
														</td>
													</tr>
												</table>
											</td>
										</tr>
										<tr>
											<td colspan="5"><div class="routes-line"></div></td>
										<tr>
											<td>
												<table style="width:100%">
													<tr>
														<td align="left" class="left-padding3">
															<input type="checkbox"  id="departureTimeLabelChk"/><label for="departureTimeLabelChk" class="label_style"><bean:message key='schematic.display.option.depttime' bundle='schematicresources'/></label>
														</td>
														<td align="center" style="padding-right:25px">	
															<input type="checkbox"  id="effDaysLabelChk"/><label for="effDaysLabelChk" class="label_style"><bean:message key='schematic.display.option.effdays' bundle='schematicresources'/></label>
														</td>
														<td align="right" style="padding-right:15px">
															<input type="checkbox"  id="arrivalTimeLabelChk"/><label for="arrivalTimeLabelChk" class="label_style"><bean:message key='schematic.display.option.arrivtime' bundle='schematicresources'/></label>
														</td>
													</tr>
												</table>		
											</td>
										</tr>		
									</table>
								</div>
							</div>	
						</div>
						<div id="schdSchematicLinesDiv" class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.schematiclines' bundle='schematicresources'/></label></div>
								<div class="section-box-content">
								<div><label class="section-header"><bean:message key='map.display.option.schedule.percentutilIndicator' bundle='networkfilters'/></label></div>
									<div class="section-box-content">
										<table>
											<tr><td style="text-align: center;"><label class="common-textformat"><bean:message key='map.display.option.schedule.showlineswithinrange' bundle='networkfilters'/></label></td></tr>
											<tr>
												<td>
													<table>
														<tr>
															<td style="padding-right: 10px">
																<input type="checkbox"  id="weightChk" onclick="disableTextBoxes(this,['txtWeightPercentageLow','txtWeightPercentageHigh'])"/><label for="weightChk" class="label_style"><bean:message key='map.display.option.weight' bundle='networkfilters'/></label>
															</td>
															<td><input type="text" id="txtWeightPercentageLow" value="20" onkeypress="validateNumber(event)"  class="k-textbox" style="width:30px;margin-right:10px; margin-left:-10px;"/></td>
															<td>to</td>
															<td><input type="text" id="txtWeightPercentageHigh" value="180" onkeypress="validateNumber(event)"  class="k-textbox" style="width:30px;margin-left:10px"/></td>
															<td style="padding-left:10px;"><label><bean:message key='map.display.option.schedule.percent.util' bundle='networkfilters'/></label></td>
														</tr>
													</table>
												</td>
											</tr>
											<tr>
												<td>
													<table>
														<tr>
															<td style="padding-right: 10px">
																<input type="checkbox"  id="cubeChk" onclick="disableTextBoxes(this,['txtCubePercentageLow','txtCubePercentageHigh'])"/><label for="cubeChk" class="label_style"><bean:message key='map.display.option.cube' bundle='networkfilters'/></label>
															</td>
															<td><input type="text" id="txtCubePercentageLow" value="20" onkeypress="validateNumber(event)"  class="k-textbox" style="width:30px;margin-right:10px; margin-left:-10px;"/></td>
															<td>to</td>
															<td><input type="text" id="txtCubePercentageHigh" value="180" onkeypress="validateNumber(event)"  class="k-textbox" style="width:30px;margin-left:10px"/></td>
															<td style="padding-left:10px;"><label><bean:message key='map.display.option.schedule.percent.util' bundle='networkfilters'/></label></td>
														</tr>
													</table>
												</td>
											</tr>	
										</table>
									</div>		
									<div><label class="section-header"><bean:message key='map.display.option.schedule.loadcautionindicator' bundle='networkfilters'/></label></div>
									<div class="section-box-content">
										<table>
											<tr><td><label class="common-textformat"></label></td></tr>
											<tr><td style="text-align: center; padding-left:90px;"><label class="common-textformat"><bean:message key='map.display.option.schedule.setlinecolorranges' bundle='networkfilters'/></label></td></tr>
											<tr>
												<td>
													<table border="0">
														<tr>
															<td><input type="radio" name="loadindicatorsgrp" id="cuberadio" checked="checked"/><label for ="cuberadio" class="label_style"><bean:message key='map.display.option.schedule.cube' bundle='networkfilters'/></label> </td>															<td><div class="bar-green"></div></td>
															<td align="center"><input type="text" id="txtCautionLow" onkeypress="validateNumber(event)"  value="20" class="k-textbox" style="width:30px; margin-right:5px; margin-left:5px"/></td>
															<td><div class="bar-orange"></div></td>
															<td align="center"><input type="text" id="txtCautionHigh" onkeypress="validateNumber(event)" value="180" class="k-textbox" style="width:30px; margin-left:5px; margin-right:5px"/></td>
															<td><div class="bar-red"></div></td>
														</tr>
														<tr><td colspan="6"><input type="radio" name="loadindicatorsgrp" id="weightradio"/><label for="weightradio" class="label_style"><bean:message key='map.display.option.schedule.weight' bundle='networkfilters'/></label></td></tr>
														<tr><td colspan="6"><input type="radio" name="loadindicatorsgrp" id="highstradio" /><label for="highstradio" class="label_style"><bean:message key='map.display.option.schedule.highestofcubeweight' bundle='networkfilters'/></label> </td></tr>
													</table>
												</td>
											</tr>
											
										</table>
									</div>																		
								</div>
								
						</div>
						<div id="schdSchematicLegTypeDiv" class="section-box">
							<div><label class="section-header"><bean:message key='map.display.option.schedule.showlegtype' bundle='networkfilters'/></label></div>
							<div class="section-box-content">
												<div id="networkLegtypeOptions">
													<table>
														<tr><td><input type="checkbox"  id="netlegtypeFlyChk" onclick="validateComboBoxOnCheckbox(this, 'networkFlyCombo','kendoMultiSelectBox')"/><label for="netlegtypeFlyChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeFlyTrunk' bundle='networkfilters'/></label></td><td class="left-padding1"><input id="networkFlyCombo" style="min-width: 190px"/></td></tr>
														<tr><td><input type="checkbox"  id="netlegtypeTruckChk" onclick="validateComboBoxOnCheckbox(this, 'networkTruckCombo','kendoMultiSelectBox')"/><label for="netlegtypeTruckChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeTruck' bundle='networkfilters'/></label></td><td class="left-padding1"><select id="networkTruckCombo" style="min-width: 190px"></select></td></tr>
													</table>
												</div>	
												<div id="scheduleLegtypeOptions" style="display:none">
													<table>
														<tr><td><input type="checkbox"  id="schdllegtypeFlyChk" onclick="validateComboBoxOnCheckbox(this, 'scheduleFlyCombo','kendoMultiSelectBox')"/><label for="schdllegtypeFlyChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeFlyTrunk' bundle='networkfilters'/></label></td><td class="left-padding1"><input id="scheduleFlyCombo" style="min-width: 190px"/></td></tr>
														<tr><td><input type="checkbox"  id="schdllegtypeTruckChk" onclick="validateComboBoxOnCheckbox(this, 'scheduletruckCombo','kendoMultiSelectBox')"/><label for="schdllegtypeTruckChk" class="label_style"><bean:message key='map.display.option.schedule.legtypeTruck' bundle='networkfilters'/></label></td><td class="left-padding1"><select id="scheduletruckCombo" style="min-width: 190px"></select></td></tr>
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
							<div><label class="section-header"><bean:message key='schematic.display.option.lanedetail' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<div><label class="section-header"><bean:message key='schematic.display.option.showcolumnsonmatrix' bundle='schematicresources'/></label></div>
								<div class="section-box-content">
									<table>	
										<%-- <tr>
											<td><input type="checkbox"  id="schematicfcstChk"/><label for="schematicfcstChk" class="label_style"><bean:message key='schematic.display.option.fcst' bundle='schematicresources'/></label></td>
											<td><input type="checkbox"  id="schematicproductsChk"/><label for="schematicproductsChk" class="label_style"><bean:message key='schematic.display.option.products' bundle='schematicresources'/></label></td>
										</tr>
										<tr>
											<td><input type="checkbox"  id="schematicfcstutilChk"/><label for="schematicfcstutilChk" class="label_style"><bean:message key='schematic.display.option.fcstavailable' bundle='schematicresources'/></label></td>
											<td><input type="checkbox"  id="schematicavailproductsChk"/><label for="schematicavailproductsChk" class="label_style"><bean:message key='schematic.display.option.availproducts' bundle='schematicresources'/></label></td>
										</tr>
										<tr>
											<td><input type="checkbox"  id="schematicwtutilChk"/><label for="schematicwtutilChk" class="label_style"><bean:message key='schematic.display.option.percentwtutil' bundle='schematicresources'/></label></td>
											<td><input type="checkbox"  id="schematiccubeutilChk"/><label for="schematiccubeutilChk" class="label_style"><bean:message key='schematic.display.option.percentcubeutil' bundle='schematicresources'/></label></td>
										</tr>
										<tr><td></td></tr>
										<tr><td></td></tr> --%>
										<tr><td><input type="checkbox" checked="checked" id="schematicMatrixweightChk" onclick="showHideColumnsInPopup(this,'TOTAL_WEIGHT', 'leg')"/><label for="schematicMatrixweightChk" class="label_style"><bean:message key='schematic.display.option.weight' bundle='schematicresources'/></label></td></tr>
										<tr><td><input type="checkbox" checked="checked" id="schematicMatrixpiecesChk" onclick="showHideColumnsInPopup(this,'TOTAL_PIECES', 'leg')"/><label for="schematicMatrixpiecesChk" class="label_style"><bean:message key='schematic.display.option.pieces' bundle='schematicresources'/></label></td></tr>
										<tr><td><input type="checkbox" checked="checked" id="schematiMatrixccubeChk" onclick="showHideColumnsInPopup(this,'TOTAL_CUBE', 'leg')"/><label for="schematiMatrixccubeChk" class="label_style"><bean:message key='schematic.display.option.cube' bundle='schematicresources'/></label></td></tr>
									</table>
								</div>
							</div>		
						</div>
					</div>					
					<div id="networktabDiv" class="sliding-content-container" >
						<div id="ntwSchematicErrorsDiv" style="margin-left:5px">
							<table class="section-table">
								<tr><td class="left-padding3"><input type="checkbox"  id="showerrorsChk" onclick="parent.validateComboBoxOnCheckboxByDiv(this, $('#connErrorCombo'))"/><label for="showerrorsChk" class="label_style"><bean:message key='schematic.display.option.showerrors' bundle='schematicresources'/></label>&nbsp;&nbsp;&nbsp;<select id="connErrorCombo" disabled style="min-width: 190px; height:20px;margin-top: -2px"></select></td></tr>
								<%-- <tr><td><input type="checkbox"  id="showchangesChk"/><label for="showchangesChk" class="label_style"><bean:message key='map.display.option.network.showchanges' bundle='networkfilters'/></label></td></tr> --%>
							</table>
						</div>
						<div class="section-box">
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
						<div id="ntwSchematicModeDiv" class="section-box">
							<div><label class="section-header"><bean:message key='schematic.display.option.showmodes' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<table>
									<tr>
										<td><input type="checkbox"  id="flyChk" checked onclick="validateExpandCheckboxes(this, ['flySuggestedChk', 'flyMandatoryChk'], true);"/><label for="flyChk" class="label_style"><bean:message key='map.display.option.network.fly' bundle='networkfilters'/></label></td>
										<td><input type="checkbox"  id="truckChk" checked onclick="validateExpandCheckboxes(this, ['truckSuggestedChk', 'truckMandatoryChk'], true);"/><label for="truckChk" class="label_style"><bean:message key='map.display.option.network.truck' bundle='networkfilters'/></label></td>
										<td><input type="checkbox"  id="otherChk" checked onclick="validateExpandCheckboxes(this, ['otherSuggestedChk', 'otherMandatoryChk'], true);"/><label for="otherChk" class="label_style"><bean:message key='map.display.option.network.other' bundle='networkfilters'/></label></td>
									</tr>
									<tr >
										<td style="padding-left:15px"><input type="checkbox"  id="flySuggestedChk" onclick="validateParentCheckbox(this, 'flyChk', ['flyMandatoryChk']);" checked/><label for="flySuggestedChk" class="label_style_disable"><bean:message key='map.display.option.network.suggested' bundle='networkfilters'/></label></td>
										<td style="padding-left:15px"><input type="checkbox"  id="truckSuggestedChk" onclick="validateParentCheckbox(this, 'truckChk', ['truckMandatoryChk']);" checked/><label for="truckSuggestedChk" class="label_style_disable"><bean:message key='map.display.option.network.suggested' bundle='networkfilters'/></label></td>
										<td style="padding-left:15px"><input type="checkbox"  id="otherSuggestedChk" onclick="validateParentCheckbox(this, 'otherChk', ['otherMandatoryChk']);" checked/><label for="otherSuggestedChk" class="label_style_disable"><bean:message key='map.display.option.network.suggested' bundle='networkfilters'/></label></td>
									</tr>
									<tr >
										<td style="padding-left:15px"><input type="checkbox"  id="flyMandatoryChk" onclick="validateParentCheckbox(this, 'flyChk', ['flySuggestedChk']);" checked/><label for="flyMandatoryChk" class="label_style_disable"><bean:message key='map.display.option.network.mandatory' bundle='networkfilters'/></label></td>
										<td style="padding-left:15px"><input type="checkbox"  id="truckMandatoryChk" onclick="validateParentCheckbox(this, 'truckChk', ['truckSuggestedChk']);" checked /><label for="truckMandatoryChk" class="label_style_disable"><bean:message key='map.display.option.network.mandatory' bundle='networkfilters'/></label></td>
										<td style="padding-left:15px"><input type="checkbox"  id="otherMandatoryChk" onclick="validateParentCheckbox(this, 'otherChk', ['otherSuggestedChk']);" checked/><label for="otherMandatoryChk" class="label_style_disable"><bean:message key='map.display.option.network.mandatory' bundle='networkfilters'/></label></td>
									</tr>
									<tr>
										<td colspan="3"><input type="checkbox" id="differentmodeChk" onclick="disableShowModes(this)" /><label for="differentmodeChk" class="label_style_disable"><bean:message key='map.display.option.network.used.differentmode' bundle='networkfilters'/></label></td>
									</tr>
								</table>								
							</div>	
						</div>
						<div class="section-box">
						<div><label class="section-header"><bean:message key='schematic.display.option.lanedetail' bundle='schematicresources'/></label></div>
							<div class="section-box-content">
								<div><label class="section-header"><bean:message key='schematic.display.option.showcolumnsonmatrix' bundle='schematicresources'/></label></div>
								<div class="section-box-content">
									<table>
										<tr >
											<td style="padding-left:24px"><input type="checkbox"  id="popupDisplayOptionWeightChk" checked="checked" /><label for="popupDisplayOptionWeightChk" class="label_style"><bean:message key='schematic.display.option.weight' bundle='schematicresources'/></label></td>
											<td style="padding-left:24px"><input type="checkbox"  id="popupDisplayOptionCubeChk" checked="checked" /><label for="popupDisplayOptionCubeChk" class="label_style"><bean:message key='schematic.display.option.cube' bundle='schematicresources'/></label></td>
										</tr>
										<tr >
											<td style="padding-left:24px"><input type="checkbox"  id="popupDisplayOptionPiecesChk" checked="checked" /><label for="popupDisplayOptionPiecesChk" class="label_style"><bean:message key='schematic.display.option.pieces' bundle='schematicresources'/></label></td>
											<td style="padding-left:24px"><input type="checkbox"  id="popupDisplayOptionOdpdChk" checked="checked" /><label for="popupDisplayOptionOdpdChk" class="label_style"><bean:message key='schematic.display.option.odpdcount' bundle='schematicresources'/></label></td>
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
					<div id="networkLegendTabDiv" class="sliding-content-container">
						<div class="section-box">
							<div><label class="section-header"><bean:message key='map.display.option.schematicLegend.lanes' bundle='networkfilters'/></label></div>
							<table border="0" align="center">
								<tr>
									<td><label class="common-textformat">&nbsp;</label></td>
									<td width="5">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.fly' bundle='networkfilters'/></label></td>
									<td width="5">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.truck' bundle='networkfilters'/></label></td>
									<td width="5">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.network.other' bundle='networkfilters'/></label></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.inbound' bundle='networkfilters'/></label></td>
									<td width="5">&nbsp;</td>
									<td><div class="solid-line-orange"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dash-line-orange"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dot-line-orange"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.outbound' bundle='networkfilters'/></label></td>
									<td width="5">&nbsp;</td>
									<td><div class="solid-line-green"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dash-line-green"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dot-line-green"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.bothdirections' bundle='networkfilters'/></label></td>
									<td width="5">&nbsp;</td>
									<td><div class="solid-line-blue"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dash-line-blue"></div></td>
									<td width="5">&nbsp;</td>
									<td><div class="dot-line-blue"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.noconnectivity' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td colspan="5"><div class="map-arrow-no-connectivity"></div></td>
								</tr>
										
							</table>
							<div style="text-align:left"><label class="section-header"><bean:message key='map.display.option.schemeticLegend.routes' bundle='networkfilters'/></label></div>
							<table border="0" width="90%" align="center">
								<tr>
									<td><label class="common-textformat">&nbsp;</label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.normal' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.caution' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.excess' bundle='networkfilters'/></label></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.schedule.legtypeFlyTrunk' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-green-solid"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-orange-solid"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-red-solid"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.schedule.legtypeFlyfeeder' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-green-dot"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-orange-dot"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-red-dot"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.scheduleLegend.trucks' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-green-dash"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-orange-dash"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-red-dash"></div></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.network.other' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-green-dash-dot"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-orange-dash-dot"></div></td>
									<td width="10">&nbsp;</td>
									<td><div class="arrow-red-dash-dot"></div></td>
								</tr>
							</table>
						</div>
						<div class="section-box">
							<div><label class="section-header"><bean:message key='map.display.option.networkLegend.Locations' bundle='networkfilters'/></label></div>
							<table border="0">
								<tr>
									<td colspan="3" align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.origin' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="rectangle-orange"></div></td>
									<td colspan="2" >&nbsp;</td>
								</tr>
								<tr>
									<td colspan="3" align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.destination' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="rectangle-green"></div></td>
									<td colspan="2" >&nbsp;</td>
								</tr>
								<tr>
									<td colspan="3" align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.bothoandd' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="rectangle-blue"></div></td>
									<td colspan="2" >&nbsp;</td>
								</tr>
								<tr>
									<td colspan="3" align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.hub' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="rectangle-red"></div></td>
									<td colspan="2" >&nbsp;</td>
								</tr>
								<tr>
									<td colspan="3" align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.transit' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="diamond-violet-exclamation"></div></td>
									<td colspan="2">&nbsp;</td>
								</tr>
								<tr>
									<td colspan="7" align="center">&nbsp;</td>
								</tr>
								<tr>
									<td colspan="3">&nbsp;</td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="rectangle-light-blue"></div></td>
									<td colspan="2" align="left"><label for ="cuberadio" class="label_style"><bean:message key='map.display.option.networkLegend.schduleOrigin' bundle='networkfilters'/></label></td>
								</tr>
							</table>
						</div> 
						<!-- Code for Symbols -->
						<div class="section-box">
							<div><label class="section-header"><bean:message key='map.display.option.networkLegend.symbols' bundle='networkfilters'/></label></div>
							<table border="0" align="center">
								<tr>
									<td align="center"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.lineRepresents' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="multiple-lanes-three"></div></td>
									<td>&nbsp;</td>
									<td align="left" colspan="3"><label><bean:message key='map.display.option.networkLegend.multiplelanes.flyortruck' bundle='networkfilters'/></td>
								</tr>
								<tr>
									<td align="right"><label class="common-textformat"><bean:message key='map.display.option.networkLegend.multipleLineRepresents' bundle='networkfilters'/></label></td>
									<td width="10">&nbsp;</td>
									<td align="center"><div class="multiple-modes-three"></div></td>
									<td>&nbsp;</td>
									<td align="left" colspan="3"><label><bean:message key='map.display.option.schematic.networkLegend.multiplelanes.multiplemodes' bundle='networkfilters'/></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			 </div> 
			</div>
		 </div>
	</body>
</html>