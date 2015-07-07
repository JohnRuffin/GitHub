<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Advanced auto complete</title>
<script src="pegasus/portaljs/widgets/widgetUtils.js"></script>
<script src="pegasus/portaljs/widgets/advancedAutoComplete.js"></script>
<script src="pegasus/portaljs/widgets/advancedDialog.js"></script>
<script src="pegasus/portaljs/sqw/networksqw.js"></script>
		        <!-- MultiSelectComponent Component-->
<script src="pegasus/portaljs/jquery.multiselect.js"></script>
<script src="pegasus/portaljs/jquery.multiselect.filter.js"></script>
<script src="pegasus/portaljs/widgets/multiSelectComponent.js"></script>

<link href="pegasus/portalcss/jquery.multiselect.css" rel="stylesheet" type="text/css" />
<link href="pegasus/portalcss/jquery.multiselect.filter.css" rel="stylesheet" type="text/css" />

<script>
	$(document).ready(function() {
		//adding more location...
		SQW.initialize();		
	});
</script>	
</head>
<body>
	<div id="horizontalLayout" style="float: none; overflow: auto; max-height: 680px; min-height: 182px;">	
		
	</div>
	<div class="network-footer">
	<table style="width: 100%;">		
		<tr>
			<td>
				<div id="networkfooterDiv">
					<span class='footer_data_set'>
						<div id="footerTableDiv" style="float: none">
							<hr>
							<table class="footerTable" style="width: 100%;height: 100%;">
								<tr class="row" style=" text-align: left; vertical-align: top;">		
									<td style="width: 33%;">
									<button onclick="SQW.addMoreLocations(1);Slider.moveSearchButton('vSlider-arrow')">More Locations</button>
										
									</td>
									<td style="width: 33%;">
										<div id="productDIV">
											<table style="width: 100%;height: 100%;">
												<tr class="row" style=" text-align: left; vertical-align: top;">
													<td style="width: 40%;">
														<select id="products" multiple="" name="products"></select>
													</td>
													<td style="width: 60%;">
														<div id="productSelectedTextDiv" class="selectedTextColor"></div>
													</td>
												</tr>
											</table>
										</div>
										<div id="productGroupDIV">
											<table style="width: 100%;height: 100%;">
												<tr class="row" style=" text-align: left; vertical-align: top;">
													<td style="width: 40%;">
														<select id="productGroups" multiple="" name="productGroups"></select>
													</td>
													<td style="width: 60%;">
														<div id="productGroupSelectedTextDiv" class="selectedTextColor"></div>
													</td>
												</tr>
											</table>
										</div>
									</td>
									<td style="width: 33%;">
										<div class="fav_div">
											<ul id ="networkQueryFavoritesMenu" class="iconbtn favorite-dropdown sqw-favorite-dropdown" title = "<bean:message key='header.icon.favorites' bundle='filters'/>">
											</ul>
										</div>
									</td>
									<td style="text-align: right;width: 33%;">
										<table style="width: 100%;height: 100%;">
											<tr class="row">		
												<td>
													<button onclick="commonViewer.runQuery(undefined, 'Network')">Run Network</button>
												</td>
												<td>	
													<button id="scheduleOverlayBtn" onclick="commonViewer.runNetworkScheduleQuery(undefined, 'NetworkSchedule')">Run Schedule</button>
												</td>
											</tr>
											<tr class="row" >		
												<td colspan="2" valign="top">
													<input type="checkbox" name="addResultsToDisplay" id="addNetworkResultsToDisplay" /> 
													<label class="label_style">Add results to current display</label>
												</td>
											</tr>
											<tr class="row">	
												<td>	
													
												</td>
												<td>
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
</body>
</html>


<div id="showNearBy" title="Show Nearby Locations">
	<div id="content1">
		<table style="width: 100%;">
			<tr>
				<td>
				<div class="verticalLayout_Span">
					<label>Location</label>					
				</div>
				</td>
				<td>
				<div class="verticalLayout_Span">
					<label>Locations within</label>
				</div>	
				</td>
			</tr>
			<tr>
				<td>
				<span class="clearable">
					<input class="locations_field autoCompleteInput ui-autocomplete-input" style="width: 275px !important; font-size: 9px;" type="text" type="text" name="location" id="showNearByLocCd"
					locCd="" readonly="readonly" placeholder="Location" >
					<span id="clear" ref="showNearByLocCd" class="remove_icon_clear">x</span>					
				</span>
				</td>
				<td style="text-align: right;">
					<select id="miles" onchange="SQW.milesChangeHandler()">
						<option value="25">25 miles</option>
						<option value="50">50 miles</option>
						<option value="75">75 miles</option>
						<option value="100">100 miles</option>
						<option value="200">200 miles</option>
						<option value="300">300 miles</option>
						<option value="500">500 miles</option>
					</select>
				</td>
			</tr>
		</table>
		
		
		<hr/>
		<div style="overflow: scroll; min-height: 100px; max-height: 600px;">	
			<table id="dialogDatasource">
			    	    
			</table>
		</div>
		<div align="center">
			<input type="button" value="Ok" style="min-height:20px; height:20px;min-width: 55px;width: 55px;" onclick="SQW.nearByLocationsSelectionHandler()"/>
		</div>
	</div>
	
	<div id="content2">
		
	</div>
</div>
