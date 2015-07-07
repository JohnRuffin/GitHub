var CRITERIA_BROWSER_SESSION_ID = "BROWSER_SESSION_ID";
var CRITERIA_IS_NW_RELATED = "IS_NW_RELATED";

var CRITERIA_LANE_ID = "LANE_ID";
var CRITERIA_LEG_ID = "LEG_ID";

var CRITERIA_ORIGIN = "ORIGIN";
var CRITERIA_DESTINATION = "DESTINATION";
var CRITERIA_ORIGIN_ACTY = "ORIGIN_ACTY";
var CRITERIA_DESTINATION_ACTY = "DESTINATION_ACTY";

var CRITERIA_DAY = "DAY";
var CRITERIA_DIRECTION = "DIRECTION";
var CRITERIA_SM = "SM";
var CRITERIA_MM = "MM";
var CRITERIA_USED_MODE_FLAG = "USED_MODE_FLAG";

var CRITERIA_MODE = "MODE";
var CRITERIA_LEG_TYPE = "LEG_TYPE";
var CRITERIA_EQUIP_TYPE = "EQUIP_TYPE";
var CRITERIA_PERCENT_WEIGHT = "PERCENT_WEIGHT";
var CRITERIA_PERCENT_CUBE = "PERCENT_CUBE";
var CRITERIA_CONVEYANCE = "CONVEYANCE";

var TYPE_BOOLEAN = "java.lang.Boolean";
var TYPE_STRING = "java.lang.String";
var TYPE_INTEGER = "java.lang.Integer";
var TYPE_DOUBLE = "java.lang.Double";
var TYPE_DATE = "java.util.Date";

var OPERATOR_EQUALS = "EQUALS";
var OPERATOR_IN = "IN";
var OPERATOR_LIKE = "LIKE";
var OPERATOR_GREATER_THAN_EQUALS = "GREATER_THAN_EQUALS";
var OPERATOR_GREATER_THAN = "GREATER_THAN";
var OPERATOR_LESSER_THAN = "LESSER_THAN";
var OPERATOR_LESSER_THAN_EQUALS = "LESSER_THAN_EQUALS";
var OPERATOR_NOT_EQUALS = "NOT_EQUALS";

function FilterBean(propertyname, propertytype, operator, comparatorvalue) {
	this.propertyname = propertyname;
	this.propertytype = propertytype;
	this.operator = operator;
	this.comparatorvalue = comparatorvalue;
	this.ismatchany = false;
};

FilterBean.prototype.setValue = function(value) {
	this.comparatorvalue = value;
};

function SearchCriteria() {
	this.filterbean = [];
};

SearchCriteria.prototype.setCriteria = function(name, value, ismatchany, type, operator) {
	var filterBean = this.getCriteria(name, operator);
	if(value === undefined || value.toString() == "") {
		if(filterBean) {
			this.removeCriteria(name, operator);
		}
		return;
	}
	
	if(!filterBean) {
		filterBean = this.getDefaultCriteria(name);
		this.filterbean.push(filterBean);
	} 
			
	if(ismatchany) {
		filterBean.ismatchany = ismatchany;
	}
	
	if(type) {
		filterBean.propertytype = type;
	}
	
	if(operator) {
		filterBean.operator = operator;
	} else {	
		if(value.toString().split(",").length > 1) {
			filterBean.operator = OPERATOR_IN; 
		} else {
			filterBean.operator = OPERATOR_EQUALS;
		}
	}
	
	filterBean.comparatorvalue = value;
};

SearchCriteria.prototype.removeCriteria = function(name, operator) {
	var indices = [];
	for(var i = 0; i < this.filterbean.length; i++) {
		if(this.filterbean[i].propertyname == name) {
			if(operator) {
				if(this.filterbean[i].operator == operator) {
					indices.push(i);
				}
			} else {
				indices.push(i);
			}			
		}
	}
	var noOfIndices = indices.length; 
	for(var i = noOfIndices-1; i >= 0; i--) {
		this.filterbean.splice(indices[i], 1);
	}
};

SearchCriteria.prototype.getCriteria = function(name, operator) {
	var filterBean;
	for(var i = 0; i < this.filterbean.length; i++) {
		if(this.filterbean[i].propertyname == name) {
			if(operator) {
				if(this.filterbean[i].operator == operator) {
					filterBean = this.filterbean[i];
					break;
				}
			} else {
				filterBean = this.filterbean[i];
				break;
			}
		}
	}
	
	return filterBean;
};

SearchCriteria.prototype.getDefaultCriteria = function(name) {
	var filterBean;
	var type;
	
	if(name == CRITERIA_IS_NW_RELATED) {
		type = TYPE_BOOLEAN;
	} else if(name == CRITERIA_DAY) {
		type = TYPE_INTEGER;
	} else {
		type = TYPE_STRING;
	}
	
	return new FilterBean(name, type, OPERATOR_EQUALS);;
};

SearchCriteria.prototype.getSearchCriteria = function() {
	return JSON.stringify(this);	
};