/**
 * Is an utility component.
 * @author 888608
 */

var Util = function() {

    };
    
/**
 * utility method to orderBy FacilityType 
 * @param a
 * @param b
 * @returns
 */
Util.orderByFacilityType = function(a, b) {
    if (a["facType"] != undefined) {
        var aid = a.facType;
        var bid = b.facType;
        return (aid == bid) ? Util.orderByFacilityLabel(a, b, sqwConstants.SCHEDULE) : (aid > bid) ? 1 : -1;
    }
};
/**
 * utility method to orderBy FacilityLabel 
 * @param a
 * @param b
 * @param facilityLocationType
 * @returns
 */
Util.orderByFacilityLabel = function(a, b, facilityLocationType) {
    if (a["facType"] != undefined) {
        var aid = AdvancedAutoComplete.getLabelValuePatterns(facilityLocationType, a);
        var bid = AdvancedAutoComplete.getLabelValuePatterns(facilityLocationType, b);;
        return (aid == bid) ? 0 : (aid > bid) ? 1 : -1;
    }
};

/**
 * utility method used to search the entire datasource and returns the exact match result set.
 * @param itemId	- unique id that need to searched for in the datasource
 * @param dataSource	- 
 * @param searchAttributes	- array of strings. this is used in filtering the data
 * @returns	{Object}
 */
Util.getExactMatchResults = function(itemId, dataSource, searchAttributes) {
    if (itemId != undefined) {
        //creates the reqular expression
        var reqularExpressionPattern = $.ui.autocomplete.escapeRegex(itemId);
        //returns the exact match results....
        return Util.getFilteredResults(dataSource, searchAttributes, new RegExp("^" + reqularExpressionPattern + "$", "i"));
    }
};

/**
 * utility method used to search the entire datasource and returns the matched result sets.
 * @param itemId	- unique id that need to searched for in the datasource
 * @param dataSource	- 
 * @param searchAttributes	- array of strings. this is used in filtering the data
 * @returns	{Object}
 */
Util.getMatchedResults = function(facilityLocationType, itemId, dataSource, searchAttributes) {
    if (itemId != undefined) {
        //create regular expression
        var reqularExpressionPattern = $.ui.autocomplete.escapeRegex(itemId);
        //returns the results after filtering
        var results = Util.getFilteredResults(dataSource, searchAttributes, new RegExp("^" + reqularExpressionPattern, "i"));
        if (facilityLocationType == sqwConstants.SCHEDULE) {
            return results.sort(Util.orderByFacilityType);
        }

        return results;
    }
};

/**
 * Returns the results after performing the search/filter
 * @param dataSource	- 
 * @param searchAttributes	-array of strings. this is used in filtering the data
 * @param matcher	- is an {RegExp} object
 * @returns {Array} of objects
 */
Util.getFilteredResults = function(dataSource, searchAttributes, matcher) {
    var filteredResultset;
    if (matcher != undefined) {
        //iterate and search the datasource for matched items
        filteredResultset = $.grep(dataSource, function(item, index) {
            //searchAttributes is an array of values on which the component need to search/filter the datasource
            if (searchAttributes != undefined) {
                for (var i = 0; i < searchAttributes.length; i++) {
                    if (item[searchAttributes[i]] != undefined && matcher.test(item[searchAttributes[i]])) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        });
    }
    if (filteredResultset != undefined && (filteredResultset.length > 0 && filteredResultset.length > 1000)) {
        console.log("Total matched results [" + filteredResultset.length + "]");
        filteredResultset = filteredResultset.slice(0, 1500);
    }
    return filteredResultset;
};

/**
 * adding the "x" option to the input box 
 * @param id - ID of an span element
 */
Util.addClearGlass = function(id) {
    $('#' + id).removeClass("remove_icon_clear");
    $('#' + id).addClass("icon_clear");
};

/**
 * removing the "x" option to the input box 
 * @param id - ID of an span element
 */
Util.removeClearGlass = function(id) {
    $('#' + id).removeClass("icon_clear");
    $('#' + id).addClass("remove_icon_clear");
};

