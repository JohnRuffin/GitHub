<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>jQuery UI Autocomplete - Categories</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
  <script src="../../pegasus/js/kendo/jquery.min.js"></script>
  <script src="../../pegasus/jquery/jquery-ui.js"></script>
  <style>
	.ui-autocomplete {
		max-height: 100px;
		overflow-y: auto;
		/* prevent horizontal scrollbar */
		overflow-x: hidden;
	}
	.ui-autocomplete-loading {
		background: white url('images/ui-anim_basic_16x16.gif') right center no-repeat;
	}  
  </style>
  <script>
$.widget( "widgets.AdvanceAutoComplete", $.ui.autocomplete, {	
	
	_create: function(){
		this._super();
		this._selectedUIItem;
	},
	
	_renderItem: function( ul, item ) {
		this.createLabelValuePattern(item, this.options.labelValuePattern);
		return	$("<li>").attr("data-value", item.value)
						 .append( $("<a>")
						 .text(item.label))
						 .appendTo(ul);			
	},
	
	createLabelValuePattern: function (item, labelValuePattern) {
		if(item != undefined && item.city != undefined){
			item.label = item[labelValuePattern['label']] +" ("+item.locCd+")";
			item.value = item.label;
		}	
	}
});
  </script>
  <script>
var cache = {};
$(document).ready(function() {
	//method is in viewerUtils.js
	getAdvancedAutoComplete();		
});
	
function getAdvancedAutoComplete(){
	
	 var autocomplete = $( "#search" ).AdvanceAutoComplete({
		delay: 0,
		minLength: 1,
		labelValuePattern: {label: "city", value: "city"},
		source: function( request, response ) {        
		if ( "Locations" in cache ) {
			if(request.term != undefined){
				var re = $.ui.autocomplete.escapeRegex(request.term);
				var matcher = new RegExp( "^" + re, "i" );
				var a = $.grep( cache[ "Locations" ], function(item,index){
					return matcher.test(item.locCd);
				});
				response( a );
			}else {
				response( cache[ "Locations" ] );
			}          
		  return;
		}
	
		$.getJSON( "http://mktg-501946-67.corp.ds.fedex.com:8080/SIServer/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.MasterServiceDataRenderer&datatype=FACILITY_LIST&commonCaseId=0x95a1d652000100008d41454f&rand=111394488966889", request, function( data, status, xhr ) {
		  cache[ "Locations" ] = data;
		  response( data );
			});
		}, 
		select: function (event, ui) {					
			$( "#search" ).AdvanceAutoComplete('option', '_selectedUIItem', ui);
		},
		change: function(event, ui){			
			$( "#search" ).AdvanceAutoComplete('option', '_selectedUIItem', ui);
		}
    });	 
	return autocomplete;
}
  
  function renderValue(){
	console.log($( "#search" ).AdvanceAutoComplete('option', '_selectedUIItem'));
  }
  </script>
</head>
<body>
 
<label for="search">Search: </label>
<input id="search" placeholder="Locations">
<label for"searchValue" id="searchVal" onclick="renderValue()"> Show </label>
 
 
</body>
</html>