<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Advanced auto complete</title>
<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
<script src="../../pegasus/js/kendo/jquery.min.js"></script>
<script src="../../pegasus/portaljs/widgets/widgetUtils.js"></script>
<script src="../../pegasus/jquery/jquery-ui.js"></script>
<script src="../../pegasus/portaljs/widgets/advancedAutoComplete.js"></script> 
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
	width: 200px;
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
    width: 80%;
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
var books = [
    { locCd: 'The Gunslinger',               city: '1982' },
    { locCd: 'The Drawing of the Three',     city: '1987' },
    { locCd: 'The Waste Lands',              city: '1991' },
    { locCd: 'Wizard and Glass',             city: '1997' },
    { locCd: 'The Wolves of the Calla',      city: '2003' },
    { locCd: 'Song of Susannah',             city: '2004' },
    { locCd: 'The Dark Tower',               city: '2004' },
    { locCd: 'The Wind Through the Keyhole', city: '2012' }
];
    	
$(document).ready(function() {	
	addMoreLocations(1)
});	

function addMoreLocations(count){
	var templateStr;
	$.get('http://mktg-501946-67.corp.ds.fedex.com:8080/SIServer/pegasus/portaljsp/networkTemplate.html', function(template) {
		for(var i =0; i<count; i++){
			templateStr = template.replace(/@count/g , i);		
			$("#verticalLayout").append("<span>" +templateStr+"</span>");	
			renderUI(i);	
		}		
	});	
}

function renderValue(){
	console.log(AdvancedAutoComplete.getSelectedItem("previous0"));
}

function renderUI(count){
	var locationsAutoComplete = new AdvancedAutoComplete("previous"+count,
											{label: "city", value: "city"}, 
											data,
											"Locations", ["city", "locCd"]); 		
	var locationsAutoComplete = new AdvancedAutoComplete("primary"+count,
											{label: "city", value: "city"}, 
											data,
											"Locations", ["city", "locCd"]); 
											
	var locationsAutoComplete = new AdvancedAutoComplete("next"+count,
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
}

function facilityDatasourceChangeHandler(id, dropdownId){
	if($("#"+id).is(':checked')){
		$( "#"+dropdownId ).AdvancedAutoComplete('option', 'source', data)
	}else {
		$( "#"+dropdownId ).AdvancedAutoComplete('option', 'source', books)
	}
}
</script>

</head>
<body>

<div id="verticalLayout">
	
</div>

</body>
</html>