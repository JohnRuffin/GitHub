<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Network More Search Options</title>
		<script>
			function showHideNetworkRoutingDiv(){
			  if (document.getElementById('ntwLaneLevelQueryRadio').checked) {
			       	document.getElementById('divNetworkLaneRounting').style.display  = 'block';
			       	document.getElementById('divNetworkFullRounting').style.display  = 'none';
			       	if(parent.isScheduleForNetworkFlag){
			       		$("#scheduleHPanel").css("top", "380px");
			       	}
			    } else {
			    	document.getElementById('divNetworkLaneRounting').style.display  = 'none';
			    	document.getElementById('divNetworkFullRounting').style.display  = 'block';
					if(parent.isScheduleForNetworkFlag){
						$("#scheduleHPanel").css("top", "510px");
			       	}
			    }   
		    	SQW.togglePrimaryOptions();
		    	SQW.filterPrimaryActivities();
			}
					
		</script>
	</head>
	<body>
		<div class="searchfilterDivStyles">
			<div id="parentNetworkDiv" style="height: auto !important;width: 100%; overflow-y: auto; overflow-x: auto; ">
				<label class="section_header_text" for="lblNetworkSearch"><bean:message key='header.tittle.network.moreOptions' bundle='pegasusresources'/></label>
				<div id="divSearchOption" class="section-box-content-network">
					<label class="sub_header_text" for="lblNetworkSearchQuery"><b><bean:message key='header.tittle.network.queryType' bundle='pegasusresources'/></b></label>
					<div id="divNetworkSearchQueryOption" class="section-box-content-network">
						<input type="radio" name="networkSearchQueryType" id="ntwLaneLevelQueryRadio" value="L" checked="checked"  onclick="showHideNetworkRoutingDiv()"/><label for="ntwLaneLevelQueryRadio" class="label_style active_item_label"><bean:message key='display.radio.network.queryType.laneLevel' bundle='pegasusresources'/></label><br/> 
						<input type="radio" name="networkSearchQueryType" id="ntwFullRoutingQueryRadio" value="F"  onclick="showHideNetworkRoutingDiv()"/><label for="ntwFullRoutingQueryRadio" class="label_style active_item_label"><bean:message key='display.radio.network.queryType.fullRouting' bundle='pegasusresources'/></label><br/>
					</div>
					
					<label class="sub_header_text" for="lblNetworkRounting"><b><bean:message key='header.tittle.network.routingType' bundle='pegasusresources'/></b></label>
					<div id="divNetworkLaneRounting" style="display:block; margin-top:-3px;height:18px" class="section-box-content-network">
						<input type="checkbox"  id="ntwLaneRountingHoldChk" /><label class="active_item_label" for="ntwLaneRountingHoldChk"><bean:message key='display.option.network.laneRountingType.holdAtRamp' bundle='pegasusresources'/></label><br>
					</div>
					<div class="section-box-content-network" id="divNetworkFullRounting" style="display:none;margin-top:-3px;" class="section-box-content-network">
						<input type="checkbox" id="ntwFullRountingPointChk" checked="checked"/><label class="active_item_label" for="ntwFullRountingPointChk"><bean:message key='display.option.network.fullRountingType.pointToPoint' bundle='pegasusresources'/></label><br>
						<input type="checkbox" id="ntwFullRountingSingleChk" checked="checked" onclick="SQW.togglePrimaryOptions()"/><label class="active_item_label" for="ntwFullRountingSingleChk"><bean:message key='display.option.network.fullRountingType.singleSort' bundle='pegasusresources'/></label><br>
						<input type="checkbox" id="ntwFullRountingMultiChk" checked="checked" onclick="SQW.togglePrimaryOptions()"/><label class="active_item_label" for="ntwFullRountingMultiChk"><bean:message key='display.option.network.fullRountingType.multiSort' bundle='pegasusresources'/></label><br>
						<input type="checkbox" id="ntwFullRountingCustomChk" checked="checked" onclick="SQW.togglePrimaryOptions()"/><label class="active_item_label" for="ntwFullRountingCustomChk"><bean:message key='display.option.network.fullRountingType.custom' bundle='pegasusresources'/></label><br>
						<input type="checkbox" id="ntwFullRountingAtRampChk" checked="checked" onclick="SQW.modifyFullRoutingSearchOptions()"/><label class="active_item_label" for="ntwFullRountingAtRampChk"><bean:message key='display.option.network.fullRountingType.atRamp' bundle='pegasusresources'/></label><br>
						<div id="divNetworkAtRampRouting" style="padding-left: 15px;padding-top: 5px;">
							<input type="radio" name="ntwAtRampRoutingOption" id="ntwAtRampRoutingHoldRadio" value="Hold" onchange="SQW.modifyFullRoutingSearchOptions(true)"  checked="checked" /><label for="ntwAtRampRoutingHoldRadio" class="label_style" style="padding-top:2px;"><bean:message key='display.radio.network.fullRountingType.holdAtRamp' bundle='pegasusresources'/></label><br/>
							<input type="radio" name="ntwAtRampRoutingOption" id="ntwAtRampRoutingNotHoldRadio" value="NotHold" onchange="SQW.modifyFullRoutingSearchOptions()" /><label for="ntwAtRampRoutingNotHoldRadio" class="label_style" style="padding-top:2px;"><bean:message key='display.radio.network.fullRountingType.notHoldAtRamp' bundle='pegasusresources'/></label><br/>
						</div>
					</div>
					
					<label class="sub_header_text" for="lblNetworkConnectivity" style="line-height: 30px; !important"><b><bean:message key='header.tittle.network.connectivity' bundle='pegasusresources'/></b></label><br>
					<div id="divNetworkConnectivity" class="section-box-content-network">
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwConnectivityAnyStatusRadio" value="Any status" checked="checked" /><label for="ntwConnectivityAnyStatusRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.connectivity.anyStatusOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwConnectivityAllErrorRadio" value="All errors" /><label for="ntwConnectivityAllErrorRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.connectivity.allErrorsOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwConnectivityErrorRadio" value="Has connectivity errors"  /><label for="ntwConnectivityErrorRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.connectivity.errorOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwConnectivityOKRadio"  value="Connectivity is OK"/><label for="ntwConnectivityOKRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.connectivity.okOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwCapacityExcessRadio" value="Has excess capacity"  /><label for="ntwCapacityExcessRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.capacity.excessOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwCapacityPartialRadio" value="Has partial capacity" /><label for="ntwCapacityPartialRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.capacity.partialOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwCapacityEmptyRadio" value="Has empty capacity" /><label for="ntwCapacityEmptyRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.capacity.emptyOnly' bundle='pegasusresources'/></label><br/>
						<input type="radio" name="ntwConnectivityCapacityOption" id="ntwCapacityOKRadio" value="Capacity is OK" /><label for="ntwCapacityOKRadio" class="label_style active_item_label" style="padding-top:2px;"><bean:message key='display.radio.network.capacity.okOnly' bundle='pegasusresources'/></label><br/>
					</div>
				</div>
			</div>
			<hr/>
			<div style="height: auto !important;width: 100%; overflow-x: auto;overflow-y: auto;">
				<div id="divNtwFilterOption" class="section-box-content-network" >
					<div style="width: 100%">
						<label class="section_header_text" for="lblNetworkFilter"><bean:message key='header.tittle.network.filter' bundle='pegasusresources'/></label>
						<!--<input type="button" name="btnNtwFilterApply" onclick = "applyDisplaySettings()" class="applyBtn" value= "Apply"/>-->
					</div>
					<table border="0" width="100%" style="overflow: hidden;">
						<tr>
							<th align="left" style="width: 105px"><label class="sub_header_text" for="lblNtwFilterDirection"><bean:message key='header.tittle.network.filter.direction' bundle='pegasusresources'/></label></th>
							<th align="left"><label class="sub_header_text" for="lblNtwFilterError"><bean:message key='header.tittle.network.filter.errors' bundle='pegasusresources'/></label></th>
						</tr>
						<tr>
							<td class="section-box-content-network" width="100px">
								<input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionBothRadio" value="both" checked="checked" onclick="applyDisplaySettings()" onchange="commonViewerUtils.toggleDirection(this)" /><label for="ntwFilterDirectionBothRadio" class="label_style" style="padding-top:2px;"><bean:message key='display.radio.network.filter.direction.both' bundle='pegasusresources'/></label><br/>
								<input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionInboundRadio" value="inbound" onclick="applyDisplaySettings()" onchange="commonViewerUtils.toggleDirection(this)"/><label for="ntwFilterDirectionInboundRadio" class="label_style" style="padding-top:2px;"><bean:message key='display.radio.network.filter.direction.inbound' bundle='pegasusresources'/></label><br/>
								<input type="radio" name="ntwFilterDirectionOption" id="ntwFilterDirectionOutboundRadio" value="outbound" onclick="applyDisplaySettings()" onchange="commonViewerUtils.toggleDirection(this)"/><label for="ntwFilterDirectionOutboundRadio" class="label_style" style="padding-top:2px;"><bean:message key='display.radio.network.filter.direction.outbound' bundle='pegasusresources'/></label><br/>
							</td>
							<td class="section-box-content-network">
								<input type="checkbox" id="ntwFilterErrorConnectivityChk" value = "Connectivity" onclick="applyDisplaySettings()"/><label for="ntwFilterErrorConnectivityChk"><bean:message key='display.radio.network.filter.errors.connectivity' bundle='pegasusresources'/></label><br>
								<input type="checkbox" id="ntwFilterErrorCapacityChk" value = "Capacity" onclick="applyDisplaySettings()"/><label for="ntwFilterErrorCapacityChk"><bean:message key='display.radio.network.filter.errors.capacity' bundle='pegasusresources'/></label><br/>
								<br/>
							</td>
						</tr>
					</table>
					<table border="0" width="100%" style="overflow: hidden;">
						<tr>
							<td>
								<label class="sub_header_text" for="lblNetworkFilterMode"><b><bean:message key='header.tittle.network.filter.mode' bundle='pegasusresources'/></b></label>
								<div class="section-box-content-network" style="margin-top: -3px;padding-bottom: 20px">
									<input type="checkbox" id="flySuggestedChk" checked="checked" onclick="applyDisplaySettings()"/><label for="flySuggestedChk"><bean:message key='display.option.network.filter.mode.flightSuggested' bundle='pegasusresources'/></label><br>
									<input type="checkbox" id="flyMandatoryChk" checked="checked" onclick="applyDisplaySettings()"/><label for="flyMandatoryChk"><bean:message key='display.option.network.filter.mode.flightMandatory' bundle='pegasusresources'/></label><br/>
									<input type="checkbox" id="truckSuggestedChk" checked="checked" onclick="applyDisplaySettings()"/><label for="truckSuggestedChk"><bean:message key='display.option.network.filter.mode.truckSuggested' bundle='pegasusresources'/></label><br/>
									<input type="checkbox" id="truckMandatoryChk" checked="checked" onclick="applyDisplaySettings()"/><label for="truckMandatoryChk"><bean:message key='display.option.network.filter.mode.truckMndatory' bundle='pegasusresources'/></label><br/>
									<input type="checkbox" id="otherSuggestedChk" checked="checked" onclick="applyDisplaySettings()"/><label for="otherSuggestedChk"><bean:message key='display.option.network.filter.mode.otherSuggested' bundle='pegasusresources'/></label><br/>
									<input type="checkbox" id="otherMandatoryChk" checked="checked" onclick="applyDisplaySettings()"/><label for="otherMandatoryChk"><bean:message key='display.option.network.filter.mode.otherMndatory' bundle='pegasusresources'/></label><br/>
									<input type="checkbox" id="differentmodeChk" onclick="applyDisplaySettings()"/><label for="differentmodeChk"><bean:message key='display.option.network.filter.mode.differentMode' bundle='pegasusresources'/></label><br/>
								</div>
							</td>
						</tr>
					</table>
				</div> 
			</div>
			<hr/>
		</div>
	</body>
</html>