<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Schedule More Search Options</title>
<!-- MultiSelectComponent Component-->
<script>
function validateComboBoxOnCheckbox(chkBoxObj, comboBoxId){
	if(chkBoxObj.checked) {
	   	document.getElementById(comboBoxId).removeAttribute("disabled");
    }
	else{
		document.getElementById(comboBoxId).setAttribute("disabled","disabled");
	}
}

function setUtilization(txtUtilToId, txtUtilFromId,lblObj){
	lblObj.innerText = txtUtilToId.value + " - " + txtUtilFromId.value + "%";;
	SQW.closeDialog("dialog");
}

function setUtilizationColor(txtUtilToId, txtUtilFromId){
	//lblObj.innerText = txtUtilToId.value + " - " + txtUtilFromId.value + "%";;				
	SQW.closeDialog("dialog");
}

function enableDisableMultiSelectComponent(bEnable, multiSelecttComp)
    {
    	if (bEnable) {
    		$("#" + multiSelecttComp).each(function() {
    			$(this).removeAttr("disabled");
                $(this).removeClass("ui-state-disabled");
            });
    		$("#" + multiSelecttComp).parent().find('div').parent().find('a').each(function() {
             	$(this).removeClass("ui-state-disabled");
              //   $(this).addClass("label_style_disable");
             });
    	} else {
    		 $("#" + multiSelecttComp).each(function() {
                 $(this).addClass("ui-state-disabled");
                 $(this).attr("disabled", "disabled");
             });
    		 $("#" + multiSelecttComp).parent().find('div').parent().find('a').each(function() {
             	$(this).addClass("ui-state-disabled");
              //   $(this).addClass("label_style_disable");
             });
    	}
         
    }

$(document).ready(function() {
	//adding more location...
	SQW.initializeScheduleSearchOptions();
	$("#schudleDirectionDiv").hide();
	$("#scheduleFilterContainerDiv *").attr("disabled", "disabled");		
	$( "#hrefSchdUtiWeight").click(function(e) {
		if($("#hrefSchdUtiWeight").attr("disabled")=="disabled"){
			e.preventDefault();
		}
		else{
			SQW.openDialog("dialog", "dialog1", {position: "hrefSchdUtiWeight",
												draggable: false, 
												resizable: true,
												width: 265, 
												title: "Utilization: weight",
												height: 131});	
			AdvancedDialog.setPropertyValue("dialog", "title", "Utilization: weight");									
		}					
	});
	
	$( "#hrefSchdUtiCube").click(function(e) {
		if($("#hrefSchdUtiCube").attr("disabled")=="disabled"){
			e.preventDefault();
		}
		else{
			SQW.openDialog("dialog", "dialog2",{position: "hrefSchdUtiCube",
											draggable: false, 
											resizable: true,
											title: "Utilization: cube",
											width: 260, 
											height: 131});
		}						
		AdvancedDialog.setPropertyValue("dialog", "title", "Utilization: cube");
	});
	
	$( "#hrefSchdUtiColor").click(function(e) {
		if($("#hrefSchdUtiColor").attr("disabled")=="disabled"){
			e.preventDefault();
		}
		else{
			SQW.openDialog("dialog", "dialog3",{width: 369, 
												height: 169,
												title: "Utilization line color",
												position: "hrefSchdUtiColor", 
												draggable: false, 
												resizable: false});						
		}
		AdvancedDialog.setPropertyValue("dialog", "title", "Utilization line color");
	});
});	
</script>
</head>
<body>
	<div id="divScheduleSearchOption" class="searchfilterDivStyles">
		<div id="dialog" class="ui-dialog-parent-content" title="Utilization: weight">
			<div id="dialog1">
				<p>
					<input type="text" id="txtWeightPercentageLow" value="80" style="width:30px;max-width:30px">
					% to 
					<input type="text" id="txtWeightPercentageHigh" value="100" style="width:30px;max-width:30px"> 
				    % utilization
				</p>
				<br>
				<center>
					<input type="button" id="btnApplySchdUtilWght" align="middle" class="applyBtnStyle" onclick="setUtilization(txtWeightPercentageLow, txtWeightPercentageHigh,lblSchdUtiWeightValue);applyDisplaySettings()" value="Apply"/>
				</center>
			</div>
			<div id="dialog2">
				<p>
					<input type="text" id="txtCubePercentageLow" value="80" onkeypress="validateNumber(event)" class="k-textbox" style="width:35px; margin-right:5px; margin-left:5px; margin-top:0px;">
					% to 
					<input type="text" id="txtCubePercentageHigh" value="100" onkeypress="validateNumber(event)" class="k-textbox" style="width:35px; margin-right:5px; margin-left:5px; margin-top:0px;"> 
				    % utilization
				</p>
				<br>
				<center>
					<input type="button" id="btnApplySchdUtilCube" class="applyBtnStyle" align="middle" onclick="setUtilization(txtCubePercentageLow, txtCubePercentageHigh, lblSchdUtiCubeValue);applyDisplaySettings()" value="Apply"/>
				</center>
				
			</div>
			<div id="dialog3">
				<table border = "0">
					<tbody>
						<tr>
							<td colspan="3"><label>Line color</label></td>
							<td width="10px"></td>
							<td valign="middle"><div class="bar-green"></div></td>
							<td valign="middle"><div class="bar-orange"></div></td>
							<td valign="middle"><div class="bar-red"></div></td>
						</tr>
						<tr>
							<td colspan="3"></td>
							<td width="10px"></td>
							<td>|</td>
							<td>|</td>
							<td>|</td>
						</tr>
						<tr>
							<td colspan="3"><label>% Utilization</label></td>
							<td width="10px"></td>
							<td align="left">
								<label id="lblCautionLow">0  to </label>
							</td>
							<td align="left">
								<input type="text" id="txtCautionLow" value="20" onkeypress="validateNumber(event)" class="k-textbox" style="width:35px; margin-right:5px; margin-left:5px; margin-top:0px;"><label> to </label>
							</td>
							<td align="left">
								<input type="text" id="txtCautionHigh" value="180" onkeypress="validateNumber(event)" class="k-textbox" style="width:35px; margin-left:5px; margin-right:5px; margin-top:0px;"><label> and above</label>
							</td>
						</tr>
							
						<tr>
							<td align="center" colspan="7">
								<br>
								<input type="button"  class="applyBtnStyle" id="btnApplySchdUtilLine" onclick="setUtilizationColor(txtCautionLow, txtCautionHigh);applyDisplaySettings()" value="Apply"/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="dialog4" style="max-height: 600px;">
				<p>
					<div id="dialog4Div" ></div>
				</p>
			</div>
		</div>
		<div id="parentScheduleDiv" style="min-height: 370px;width: 100%; overflow-y: auto; overflow-x: auto; ">
			<label class="section_header_text" for="lblScheduleSearch"><bean:message key='header.tittle.network.moreOptions' bundle='pegasusresources'/></label>
			<div id="divScheduleODRelation" class="section-box-content">
				<div>
					<label for="lblScheduleODRelation" class="sub_header_text"><b><bean:message key='header.tittle.schedule.odRelation' bundle='pegasusresources'/></b></label>			
				</div>
				<div id="divScheduleODRelationContent" class="section-box-content">
					<table>
						<tr>
							<td>
								<input id="isPaired" type="checkbox" class="tickCheckBox"><label for="isPaired" class="label_style active_item_label"><bean:message key='display.option.schedule.odRelation.paired' bundle='pegasusresources'/></label>
							</td>
						</tr>
						<tr>
							<td>
								<input id="isDirect" type="checkbox" class="tickCheckBox"><label for="isDirect" class="label_style active_item_label"><bean:message key='display.option.schedule.odRelation.direct' bundle='pegasusresources'/></label>
							</td>
						</tr>
						<tr>
							<td>
								<input id="isByAirport" type="checkbox" class="tickCheckBox"><label for="isByAirport" class="label_style active_item_label"><bean:message key='display.option.schedule.odRelation.byAirport' bundle='pegasusresources'/></label>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div id="divScheduleRoute" class="section-box-content">
				<div>
					<label for="lblScheduleRoute" class="sub_header_text"><b><bean:message key='header.tittle.schedule.route' bundle='pegasusresources'/></b></label>
				</div>
				<div id="divScheduleRouteContent" class="section-box-content">
					<table>
						<tr>
							<td>
								<input id="laneHaulChk" type="checkbox" class="tickCheckBox"><label for="laneHaulChk" class="active_item_label"><bean:message key='display.option.schedule.route.linehaul' bundle='pegasusresources'/></label>
							</td>
						</tr>
						<tr>
							<td>
								<input id="stuttleChk" type="checkbox" class="tickCheckBox"><label for="stuttleChk" class="active_item_label"><bean:message key='display.option.schedule.route.shuttle' bundle='pegasusresources'/></label>
							</td>
						</tr>
					</table>
				</div>	
			</div>		
			<div id="divScheduleCarrier" class="section-box-content">
				<div>
					<label for="lblScheduleCarrier" class="sub_header_text"><b><bean:message key='header.tittle.schedule.carrier' bundle='pegasusresources'/></b></label>
				</div>
				<div id="divScheduleCarrierContent" class="section-box-content">
					<table>
						<tr>
							<td>
								<input id="fxChk" type="checkbox" class="tickCheckBox"><label for="fxChk" class="active_item_label"><bean:message key='display.option.schedule.carrier.fedEx' bundle='pegasusresources'/></label>
							</td>
						</tr>
						<tr>
							<td>
								<input id="contractChk" type="checkbox" class="tickCheckBox"><label for="contractChk" class="active_item_label"><bean:message key='display.option.schedule.carrier.contract' bundle='pegasusresources'/></label>
							</td>
						</tr>
						<tr>
							<td>
								<input id="othersChk" type="checkbox" class="tickCheckBox"><label for="othersChk" class="active_item_label"><bean:message key='display.option.schedule.carrier.other' bundle='pegasusresources'/></label>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div id="divScheduleMode" class="section-box-content">
				<div>
					<label for="lblScheduleMode" class="sub_header_text"><b><bean:message key='header.tittle.schedule.mode' bundle='pegasusresources'/></b></label>
				</div>
				<div id="divScheduleModeContent" class="section-box-content">
					<table>
						<tr>
							<td style="vertical-align: top">
								<input type="checkbox" id="scheduleModeFlyChk" checked="checked" onclick="validateComboBoxOnCheckbox(this, 'scheduleModeFlyCombo')">
								<label for="scheduleModeFlyChk" class="active_item_label"><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
							</td>
							<td style="padding-left: 30px">
								<select id="scheduleModeFlyCombo" class="selectModes">
									<option><bean:message key='display.select.schedule.mode.fly.all' bundle='pegasusresources'/></option>
									<option><bean:message key='display.select.schedule.mode.fly.trunk' bundle='pegasusresources'/></option>
									<option><bean:message key='display.select.schedule.mode.fly.feeder' bundle='pegasusresources'/></option>
								</select>
							</td>
						</tr>
						<tr>
							<td style="vertical-align: top">
								<input type="checkbox" id="scheduleModeTruckChk" checked="checked" onclick="validateComboBoxOnCheckbox(this, 'scheduleModeTruckCombo')">
								<label for="scheduleModeTruckChk" class="active_item_label"><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
							</td>
							<td style="padding-left: 30px">
								<select id="scheduleModeTruckCombo" class="selectModes">
									<option><bean:message key='display.select.schedule.mode.truck.all' bundle='pegasusresources'/></option>
									<option><bean:message key='display.select.schedule.mode.truck.standard' bundle='pegasusresources'/></option>
									<option><bean:message key='display.select.schedule.mode.truck.oversize' bundle='pegasusresources'/></option>
								</select>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div id="divScheduleLegType" class="section-box-content">
				<div>
					<label for="lblScheduleLegType" class="sub_header_text"><b><bean:message key='header.tittle.schedule.legType' bundle='pegasusresources'/></b></label>
				</div>
				<div id="divScheduleLegTypeContent" class="section-box-content">
					<table>
						<tr>
							<td colspan="2">
								<div id="flylegtypeSearchDIV">
									<select id="flylegtypeSearch" multiple="" name="flylegtypeSearch"></select>
								<div id="flylegtypeSearchTextDiv"></div>
							</div>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<div id="trucklegtypeSearchDIV">
									<select id="trucklegtypeSearch" multiple="" name="trucklegtypeSearch"></select>
								<div id="trucklegtypeSearchTextDiv"></div>
							</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<hr/>
		<div id="scheduleFilterContainerDiv">
			<div id="divSchduleFilter"  class="section-box-content">
				<div style="width: 100%">
					<label class="section_header_text" for="lblScheduleFilter"><bean:message key='header.tittle.network.filter' bundle='pegasusresources'/></label>
				<!--<input type="button" name="btnScheduleFilterApply" value= "Apply" onclick="applyDisplaySettings()" style="min-height:20px; height:20px;min-width: 55px;width: 55px; margin-left: 100px">-->
				</div>
				
				<div id="schudleDirectionDiv" style="padding-top: 4px;">
					<label class="sub_header_text" for="lblSchduleFilterDirection"><bean:message key='header.tittle.network.filter.direction' bundle='pegasusresources'/></label>
					<div class="section-box-content" style="padding-top: 4px;">
						<input type="radio" name="schdFilterDirectionOption" id="schduleFilterDirectionBothRadio" value="both" checked="checked" onclick="applyDisplaySettings()" disabled=""><label for="schduleFilterDirectionBothRadio" class="label_style_disable" style="padding-top:2px;">Both</label><br>
						<input type="radio" name="schdFilterDirectionOption" id="schduleFilterDirectionInboundRadio" value="inbound" onclick="applyDisplaySettings()" disabled=""><label for="schduleFilterDirectionInboundRadio" class="label_style_disable" style="padding-top:2px;">Inbound</label><br>
						<input type="radio" name="schdFilterDirectionOption" id="schduleFilterDirectionOutboundRadio" value="outbound" onclick="applyDisplaySettings()" disabled=""><label for="schduleFilterDirectionOutboundRadio" class="label_style_disable" style="padding-top:2px;">Outbound</label><br>
					</div> 
				</div>
				
				<div class="section-box-content" >
					<label class="sub_header_text" for="lblSchduleFilterUtilization"><bean:message key='header.tittle.schedule.filter.utilization' bundle='pegasusresources'/></label>
					<div class="section-box-content" style="padding-bottom: 4px;">
						<table border="0" width="100%" style="overflow: hidden;">
							<tr>
								<td>
									<input type="checkbox" id="weightChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'hrefSchdUtiWeight')"/><label for="weightChk" align="left"><bean:message key='display.option.schedule.filter.utilization.weight' bundle='pegasusresources'/></label>
								</td>
								<td>
									<label id="lblSchdUtiWeightValue"  class="selectedTextColor">80 - 100%</label>
								</td>
								<td>
									<a href="#" id="hrefSchdUtiWeight" align="right" class="ui-state-disabled"><bean:message key='display.href.change' bundle='pegasusresources'/></a>
								</td>
							</tr>
							<tr>
								<td>
									<input type="checkbox" id="cubeChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'hrefSchdUtiCube')"/><label for="cubeChk" align="left"><bean:message key='display.option.schedule.filter.utilization.cube' bundle='pegasusresources'/></label>
								</td>
								<td>
									<label id="lblSchdUtiCubeValue"  class="selectedTextColor">80 - 100%</label>
								</td>
								<td>
									<a href="#" id="hrefSchdUtiCube" class="ui-state-disabled"><bean:message key='display.href.change' bundle='pegasusresources'/></a>
								</td>
							</tr>
						</table>
					</div>
					<label class="sub_header_text" for="lblSchFilterUtiLine"><b><bean:message key='header.tittle.schedule.filter.utilization.lineColor' bundle='pegasusresources'/></b></label>
					<div class="section-box-content" id="schudleUtilizationDiv">
						<table border="0" width="100%" style="overflow: hidden;">
							<tr>
								<td>
									<input type="radio" name="scheduleFilterUtilization" id="cuberadio" value="cube" checked="checked" onclick="applyDisplaySettings()"/><label class="label_style" for="cuberadio" ><bean:message key='display.radio.schedule.filter.utilization.cube' bundle='pegasusresources'/></label>
								</td>
								<td style="width: 100px"></td>
								<td>
									<a href="#" id="hrefSchdUtiColor" class="ui-state-disabled"><bean:message key='display.href.change' bundle='pegasusresources'/></a>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<input type="radio" name="scheduleFilterUtilization" id="weightradio" value="weight" onclick="applyDisplaySettings()"/><label class="label_style" for="weightradio" ><bean:message key='display.radio.schedule.filter.utilization.weight' bundle='pegasusresources'/></label>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<input type="radio" name="scheduleFilterUtilization" id="highstradio" value="highestCubeWght" onclick="applyDisplaySettings()"/><label class="label_style" for="highstradio" ><bean:message key='display.radio.schedule.filter.utilization.highest' bundle='pegasusresources'/></label>
								</td>
							</tr>
						</table>
					</div>
					<label for="lblScheduleFilterMode" class="sub_header_text"><b><bean:message key='header.tittle.schedule.mode' bundle='pegasusresources'/></b></label>
					<div class="section-box-content" >
						<table border="0" width="100%" style="overflow: hidden;">
							<tr>
								<td style="vertical-align: top">
									<input type="checkbox" id="scheduleFlightChk" onclick="validateComboBoxOnCheckbox(this, 'scheduleFlightCombo');applyDisplaySettings()"><label for="scheduleFlightChk" ><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
								</td>
								<td style="padding-left: 8px">
									<select id="scheduleFlightCombo"  class="selectModes" disabled="disabled" onchange="applyDisplaySettings()">
										<option value="All"><bean:message key='display.select.schedule.mode.fly.all' bundle='pegasusresources'/></option>
										<option value="2"><bean:message key='display.select.schedule.mode.fly.trunk' bundle='pegasusresources'/></option>
										<option value="1"><bean:message key='display.select.schedule.mode.fly.feeder' bundle='pegasusresources'/></option>
									</select>
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top">
									<input type="checkbox" id="scheduleTruckChk" onclick="validateComboBoxOnCheckbox(this, 'scheduleFilterModeTruckCombo');applyDisplaySettings()"><label for="scheduleTruckChk" ><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
								</td>
								<td style="padding-left: 8px">
									<select id="scheduleFilterModeTruckCombo" class="selectModes" disabled="disabled" onchange="applyDisplaySettings()">
										<option><bean:message key='display.select.schedule.mode.truck.all' bundle='pegasusresources'/></option>
										<option><bean:message key='display.select.schedule.mode.truck.standard' bundle='pegasusresources'/></option>
										<option><bean:message key='display.select.schedule.mode.truck.oversize' bundle='pegasusresources'/></option>
									</select>
								</td>
							</tr>
						</table>
					</div>
					<label for="lblScheduleFilterLegType" class="sub_header_text"><b><bean:message key='header.tittle.schedule.legType' bundle='pegasusresources'/></b></label>
					<div class="section-box-content">
						<table id ="networkLegtypeOptions">
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="netlegtypeFlyChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'networkFlyCombo')"><label for="netlegtypeFlyChk" ><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="networkFlyCombo" multiple="" name="networkFlyCombo"></select>
									<div id="flylegtypeFilterTextDiv"></div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="netlegtypeTruckChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'networkTruckCombo')"><label for="netlegtypeTruckChk" ><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="networkTruckCombo" multiple="" name="networkTruckCombo"></select>
									<div id="trucklegtypeFilterTextDiv"></div>
								</td>
							</tr>
						</table>	
						<table id ="scheduleLegtypeOptions">
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="schdllegtypeFlyChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'scheduleFlyCombo')"><label for="schdllegtypeFlyChk" ><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="scheduleFlyCombo" multiple="" name="networkFlyCombo"></select>
									<div id="scheduleflylegtypeFilterTextDiv"></div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="schdllegtypeTruckChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'scheduletruckCombo')"><label for="schdllegtypeTruckChk" ><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="scheduletruckCombo" multiple="" name="networkTruckCombo"></select>
									<div id="scheduletrucklegtypeFilterTextDiv"></div>
								</td>
							</tr>
						</table>
					</div>
					<label class="sub_header_text"><b>Equipment Type</b></label>
					<div class="section-box-content">
						<table id ="networkEquipmenttypeOptions">
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="netequiptypeFlyChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'networkEquipmentFlyCombo')"><label for="netequiptypeFlyChk" ><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="networkEquipmentFlyCombo" multiple="" name="networkEquipmentFlyCombo"></select>
									<div id="flyEqptypeFilterTextDiv"></div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="netequiptypeTruckChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'networkEquipmentTruckCombo')"><label for="netequiptypeTruckChk" ><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="networkEquipmentTruckCombo" multiple="" name="networkEquipmentTruckCombo"></select>
									<div id="truckEqptypeFilterTextDiv"></div>
								</td>
							</tr>
						</table>	
						<table id ="scheduleEquipmenttypeOptions">
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="schdlequiptypeFlyChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'scheduleEquipmentFlyCombo')"><label for="schdlequiptypeFlyChk" ><bean:message key='display.option.schedule.mode.fly' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="scheduleEquipmentFlyCombo" multiple="" name="scheduleEquipmentFlyCombo"></select>
									<div id="scheduleflyEqptypeFilterTextDiv1"></div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 37px">
									<input type="checkbox" id="schdlequiptypeTruckChk" onclick="applyDisplaySettings();enableDisableMultiSelectComponent(this.checked, 'scheduleEquipmenttruckCombo')"><label for="schdlequiptypeTruckChk" ><bean:message key='display.option.schedule.mode.truck' bundle='pegasusresources'/></label>
								</td>
								<td>
									<select id="scheduleEquipmenttruckCombo" multiple="" name="scheduleEquipmenttruckCombo"></select>
									<div id="scheduletruckEqptypeFilterTextDiv1"></div>
								</td>
							</tr>
						</table>	
					</div>
				</div>
			</div>
		</div>
		<hr/>
	</div>
</body>
</html>