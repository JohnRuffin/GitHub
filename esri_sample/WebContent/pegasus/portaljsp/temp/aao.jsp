<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Advanced auto complete</title>
<script src="pegasus/portaljs/widgets/advancedAutoComplete.js"></script>
<style>
.ui-autocomplete {
	max-height: 200px;
	overflow-y: auto;
	/* prevent horizontal scrollbar */
	overflow-x: hidden;
	z-index: 20000;
	width: 200px;
}
.div-line{
	border-bottom: 4px #999 solid;
	overflow:visible;
	height:7px;        
	margin: 5px 0 10px 0;
}
.row {
	text-align: center;	
	font-size: 11px;
}
.label {
	font-size: 12px;
}
.tdata {
	text-align: center;	
	width: 70px;	
}

.table {
	width: 40%;
}

.autoCompleteInput{
	width: 250px;
}

.clearable{
    position:relative;
}
.data_field{
    padding-right:17px; /* add space for the 'x' icon*/
}
.icon_clear{
	position:absolute;
	right:10px;
	top: 3px;		
	cursor:pointer;
	font: bold 1em sans-serif;
	color:#38468F;  
}

.remove_icon_clear{
	position:absolute;
	right:10px;
	top: 3px;	
	display:none !important;
	cursor:pointer;
	font: bold 1em sans-serif;
	color:#38468F;  
}

.icon_clear:hover{
	color:#f52;
}

#verticalLayout {
    width: 900px;
}

#verticalLayout span {
    display: block;
    margin-bottom: 2px;
}

#horizontalLayout {
   float: none;
}

#horizontalLayout div {
    float: left;
}
</style>
<script>
var data = [
    		{locCd: "", city: ""},
			{locCd: "MEMH", city: "MEMPHIS"},{locCd: "SNAA", city: "MEMPHIS"},
    		{locCd: "MEM", city: "MEMPHIS"},{locCd: "MEMR", city: "MEMPHIS"},
    		{locCd: "LAXH", city: "MEMPHIS"},{locCd: "MEMHA", city: "MEMPHIS"},
    		{locCd: "LAXR", city: "MEMPHIS"},{locCd: "ANCH", city: "MEMPHIS"},
    		{locCd: "BURR", city: "MEMPHIS"},{locCd: "DWRH", city: "MEMPHIS"},
    	];
    	
$(document).ready(function() {
	
	var locationsAutoComplete = new AdvancedAutoComplete("previous0",
											{label: "city", value: "city"}, 
											data,
											"Locations", ["city", "locCd"]); 		
	
	$(document).on('propertychange keyup input paste', 'input.locations_field', function(){
		var io = $(this).val().length ? 1 : 0 ;
		if(io > 0){
			Util.addClearGlass($(this).attr("ref"));
		}else{
			Util.removeClearGlass($(this).attr("ref"));
		}
	}).on('click', '.icon_clear', function(event) {
		AdvancedAutoComplete.setSelectedItem($(this).attr("ref"), "MEMR", data);
		Util.removeClearGlass($(this).attr("id"));		
	});	
});	

function renderValue(){
	console.log(AdvancedAutoComplete.getSelectedItem("previous0"));
}
</script>
</head>
<body>
<div id="verticalLayout">
	<span>
		<div id="horizontalLayout" style="float: none">
			<div style="float: left">
				<table class="table">
					<tr class="row">		
						<td>Location</td>
						<td>Facility Group</td>
						<td>Country</td>
						<td>Region</td>
					</tr>
					<tr class="row">		
						<td class="tdata">
							<div class="div-line">
								<input id="fromlocation0" type="radio" name="fromActivities0"/><span/> 
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="fromFacility0" type="radio" name="fromActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="fromCountry0" type="radio" name="fromActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="fromRegion0" type="radio" name="fromActivities0"/>				
							</div>
						</td>
					</tr>
					<tr class="row">
						<td colspan="4" class="tdata"> 
						<span class="clearable">
							<input class="locations_field autoCompleteInput" ref="preclear0" type="text" name="locations_field" id="previous0" placeholder="Locations..." />
							<span id="preclear0" ref="previous0" class="remove_icon_clear" >x</span>
						</span>			
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<input type="checkbox" name="showNearBy" /> <label class="label">Show nearby</label>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">On Day</span>
						</td>
					</tr>	
					<tr>
						<td colspan="4"> 
							<span class="label">Activity</span>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">Transit</span>
						</td>
					</tr>
				</table>
			</div>	
			<div style="float: left">
				<table class="table">
					<tr class="row">		
						<td>Location</td>
						<td>Facility Group</td>
						<td>Country</td>
						<td>Region</td>
					</tr>
					<tr class="row">		
						<td class="tdata">
							<div class="div-line">
								<input id="primarylocation0" type="radio" name="primaryActivities0"/><span/> 
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="primaryFacility0" type="radio" name="primaryActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="primaryCountry0" type="radio" name="primaryActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="fromRegion0" type="radio" name="primaryActivities0"/>				
							</div>
						</td>
					</tr>
					<tr class="row">
						<td colspan="4" class="tdata"> 
						<span class="clearable">
							<input class="locations_field autoCompleteInput" ref="priclear0" type="text" name="locations_field" id="primary0" placeholder="Locations..." />
							<span id="priclear0" ref="primary0" class="remove_icon_clear" >x</span>
						</span>			
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<input type="checkbox" name="showNearBy" /> <label class="label">Show nearby</label>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">On Day</span>
						</td>
					</tr>	
					<tr>
						<td colspan="4"> 
							<span class="label">Activity</span>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">Transit</span>
						</td>
					</tr>
				</table>
			</div>
			<div style="float: left">
				<table class="table">
					<tr class="row">		
						<td>Location</td>
						<td>Facility Group</td>
						<td>Country</td>
						<td>Region</td>
					</tr>
					<tr class="row">		
						<td class="tdata">
							<div class="div-line">
								<input id="nextlocation0" type="radio" name="nextActivities0"/><span/> 
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="nextFacility0" type="radio" name="nextActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="nextCountry0" type="radio" name="nextActivities0"/>				
							</div>
						</td>
						<td class="tdata">
							<div class="div-line">
								<input id="nextRegion0" type="radio" name="nextActivities0"/>				
							</div>
						</td>
					</tr>
					<tr class="row">
						<td colspan="4" class="tdata"> 
						<span class="clearable">
							<input class="locations_field autoCompleteInput" ref="nextclear0" type="text" name="locations_field" id="next0" placeholder="Locations..." />
							<span id="nextclear0" ref="next0" class="remove_icon_clear" >x</span>
						</span>			
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<input type="checkbox" name="showNearBy" /> <label class="label">Show nearby</label>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">On Day</span>
						</td>
					</tr>	
					<tr>
						<td colspan="4"> 
							<span class="label">Activity</span>
						</td>
					</tr>
					<tr>
						<td colspan="4"> 
							<span class="label">Transit</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</span>
  
	<span>
		
	</span>
</div>
</body>
</html>