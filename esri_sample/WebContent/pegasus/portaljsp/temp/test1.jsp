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
  </style>
  <script>
$.widget("widgets.AdvancedAutoComplete", $.ui.autocomplete, {

    _create: function() {
        this._super();
        this._selectedUIItem;
    },

    _renderItem: function(ul, item) {
        this.createLabelValuePattern(item, this.options.labelValuePattern);
        return $("<li>").attr("data-value", item.value).append(
        $("<a>").text(item.label)).appendTo(ul);
    },

    createLabelValuePattern: function(item, labelValuePattern) {
        if (item != undefined && item.city != undefined) {
            item.label = item[labelValuePattern['label']] + " (" + item.locCd + ")";
            item.value = item.label;
        }
    }
});
  </script>
  <script>
var cache = {};
$(document).ready(function() {
	//method is in viewerUtils.js
	createAdvancedAutoComplete();		
});
var cache = {};	
function createAdvancedAutoComplete(){

	var data = [
		{locCd: "MEMH", city: "MEMPHIS"},{locCd: "SNAA", city: "MEMPHIS"},
		{locCd: "MEM", city: "MEMPHIS"},{locCd: "MEMR", city: "MEMPHIS"},
		{locCd: "LAXH", city: "MEMPHIS"},{locCd: "MEMHA", city: "MEMPHIS"},
		{locCd: "LAXR", city: "MEMPHIS"},{locCd: "ANCH", city: "MEMPHIS"},
		{locCd: "BURR", city: "MEMPHIS"},{locCd: "DWRH", city: "MEMPHIS"},
	];
	getAdvancedAutoComplete("search", {label: "city", value: "city"}, 
				data, "Locations");
}
  function getAdvancedAutoComplete(divId, labelValuePattern, dataSource, placeholder) {
	var jQueryObject = $("#"+ divId);
	var searchAttributes = ["city", "locCd"];
	if(jQueryObject != undefined && jQueryObject.length > 0){
		$("#jQueryObject").attr("placeholder", placeholder);
		return jQueryObject.AdvancedAutoComplete({
	        delay: 0,
	        minLength: 1,
	        labelValuePattern: labelValuePattern,
	        source: function( request, response ) {        
	    		if(request.term != undefined){
    				var re = $.ui.autocomplete.escapeRegex(request.term);
    				var matcher = new RegExp( "^" + re, "i" );
    				var a = $.grep( dataSource, function(item,index){
    					if(searchAttributes != undefined){
                    		for(var i=0; i< searchAttributes.length; i++){
                    			console.log(matcher.test(item["locCd"]));
                    			if( matcher.test(item["locCd"])){
                    				return true;
                    			}
                    		}
                    	} 
    				});
    				response( a );
    			}else {
    				response( dataSource );
    			}          
    		  return;	    		
	    	},
	        select: function(event, ui) {
	        	jQueryObject.AdvancedAutoComplete('option', '_selectedUIItem', ui);
	        },
	        change: function(event, ui) {
	        	jQueryObject.AdvancedAutoComplete('option', '_selectedUIItem', ui);
	        }
	    });
	}    
delete jQueryObject;    
}

  function renderValue(){
	console.log($( "#search" ).AdvancedAutoComplete('option', '_selectedUIItem'));
  }
  </script>
</head>
<body>
 
<label for="search">Search: </label>
<input id="search" placeholder="Locations">
<label for"searchValue" id="searchVal" onclick="renderValue()"> Show </label>
 
 
</body>
</html>