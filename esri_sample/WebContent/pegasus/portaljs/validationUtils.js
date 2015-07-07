function validateNumber(evt) {
	var regex = /[0-9]/;
	return validateRegularExp(evt, regex);
}
function validateNumberKey(key) {
	var regex = /[0-9]/;
	return validateExp(regex, key);
}
function validateNumberNSpecialChars(evt) {
	var regex = /[0-9]|[@\!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\?]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNColon(evt) {
	var regex = /[0-9:]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNComma(evt) {
	var regex = /[0-9,]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNHyphen(evt) {
	var regex = /[0-9-]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNHyphenNComma(evt) {
	var regex = /[0-9,-]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNHyphenNCommaNPcent(evt) {
	var regex = /[0-9%,-]/;
	return validateRegularExp(evt, regex);
}
function validateTimeWithColon(key){
	var regex = /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/;
	return validateExp(regex,key);
}
function validateGridTimeWithoutColon(key){
	var regex = /^(?:[01]?[0-9]|2[0-3])[0-5][0-9]$/;
	return validateExp(regex,key);
}
function validateGridAlphabets(key) {
	var regex = /^[a-zA-Z ]+$/;
	return validateExp(regex,key);
}
function validateNumberNHyphenNCommaNPcentNAlphabets(evt) {
	var regex = /[0-9 A-Z a-z %,-]/;
	return validateRegularExp(evt, regex);
}
function validateNumberNHyphenNPcentNAlphabets(evt) {
	var regex = /[0-9 A-Z a-z % -]/;
	return validateRegularExp(evt, regex);
}
function validateAlphaNumericCharacters(key) {
	var regex = /^[A-Za-z0-9]+$/;
	return validateExp(regex,key);
}
function validateRegularExp(evt, regex) {
	try {
		var theEvent = evt || window.event;
		var key = theEvent.key || String.fromCharCode(theEvent.which);
		if( !validateExp(regex,key) ) {
			theEvent.returnValue = false;
			if(theEvent.preventDefault) theEvent.preventDefault();
			return false;
		}
		return true;
	}catch (e) {
		alert("Error occurred while validating the expression");
	}
	return false;
}
function validateExp(regex,key){
	return regex.test(key);
}
function isMinValueValid(minControl,maxControl){
	if(minControl != undefined && maxControl != undefined){
		if(parseInt(minControl.value) > parseInt(maxControl.value)){
			return false;
		}
	}
	return true;
}
function validateMultipleDayExp(key){
	var regex = /^(?:\s*\d{1,2}\s*(?:,|-| |$))+$/;
	return validateExp(regex,key);
}
function validateSingleDayExp(key){
	var regex = /^(?:\d{0,2}(?:|$))+$/;
	return validateExp(regex,key);
}
function validateAlphaNumAndPercntExp(key){
	var regex = /^[a-zA-Z0-9%]+$/;
	return validateExp(regex,key);
}
function validateAlphaSpaceAndPercntExp(key){
	var regex = /^[a-zA-Z% ]+$/;
	return validateExp(regex,key);
}
function validateTimeWithoutColon(event) {
	var timeStr = $(event.currentTarget).val();
	if(timeStr) {
		var strLength = timeStr.toString().length;
		if(strLength < 4) {
			for(var i=0;i<4-strLength; i++) {
				timeStr = "0" + timeStr;
			}
		}else {
			for(var i=0;i<4-strLength; i++) {
				timeStr = timeStr + "0";
			}
		}
	}
    var re = /^(20|21|22|23|[01]\d|\d)(([0-5]\d){1,2})$/;
    return re.test(timeStr);
}
function validateCaseDates(event){
	var result=true;
	//event.currentTarget.style.border = EMPTY_STRING;
	var timeStr = $(event.currentTarget).val();
	var currentCase;
	if(currentCase == undefined) {
		currentCase = parent.getSelectedCase();
	}
	var planPerStartDtml, planPerEndDtml, planPerDayQty;
	if(currentCase){
		planStartDate = currentCase.planPerStartDtml;
		planEndDate = currentCase.planPerEndDtml;
		planPerDayQty = currentCase.planPerDayQty;
	}
	if(planStartDate && planEndDate){
		startDate = new Date(changeCaseDateFormat(planStartDate));
		startDate = new Date(startDate.getTime() - oneDay);
		endDate = new Date(changeCaseDateFormat(planEndDate));
		totalDays = getTotalDays(startDate, endDate);
		var totalFullWeeks = Math.floor(totalDays/7);
		endDate = new Date(startDate.getTime() + (7 * (totalFullWeeks + 2) + 1) * oneDay);
		totalDays = getTotalDays(startDate, endDate);
	}else {
		var date = new Date();
		startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		totalDays = getTotalDays(startDate, endDate);
	}
	if(timeStr) {
		timeStr = timeStr.replaceAll(" ", ",");
	}
	var timeArr=[];//=(timeStr.split(COMMA_STRING));
	if(timeStr.indexOf(COMMA_STRING)>=0){
		timeArr=(timeStr.split(COMMA_STRING));
	}else{
		timeArr.push(timeStr);
	}
	var hyphenIndex=-1;
	for(var i=0;i<timeArr.length;i++){
		if(timeArr[i] && timeArr[i].match(/-/g) && timeArr[i].match(/-/g).length > 1) {
			return false;
		}
		hyphenIndex=timeArr[i].indexOf("-");
		if(hyphenIndex>=0){
			if(timeArr[i].substring(0,hyphenIndex)>=totalDays){
				result=false;
			}
			//need to check if finish value is greater than start value  
			/*if(timeArr[i].substring(hyphenIndex+1) != EMPTY_STRING && (timeArr[i].substring(0,hyphenIndex) >= timeArr[i].substring(hyphenIndex+1))){
				result=false;
			}*/
			if(timeArr[i].substring(hyphenIndex+1)>=totalDays){
				result=false;
			}
		}else if(timeArr[i]>=totalDays){
			result=false;
		}
	}
	/*if(!result && timeStr != EMPTY_STRING) {
	    	event.currentTarget.style.border = "1px #ff0000 solid";
	 }*/
	return result;
}

function validateScheduleDays(event){
	var isValid=true;
	var txtValue=$(event.currentTarget).val();
	if(txtValue != EMPTY_STRING){
		isValid=validateMultipleDayExp(txtValue);
		if(isValid){
			isValid=validateCaseDates(event);
		}
		if(!isValid){
			if(event.keyCode != 32) {
				parent.showFilterErrorMsg(NOT_ENOUGH_DAYS_IN_PLAN_ERROR);
			}
			$(event.currentTarget)[0].value="";//($(event.currentTarget).val()).substring(0,($(event.currentTarget).val()).length-1);
		}
	}	
	return isValid;
	
}
function validateScheduleHHMMTime(event){
	var isValid=true;
	var txtValue=$(event.currentTarget).val();
	if(txtValue != EMPTY_STRING){
		isValid=validateSingleDayExp(txtValue);
		if(isValid){
			isValid=validateTimeWithoutColon(event);
		}
		if(!isValid){
			parent.showFilterErrorMsg(TIME_LESS_THAN_2359_ERROR);
			$(event.currentTarget)[0].value=$(event.currentTarget)[0].oldValue;//($(event.currentTarget).val()).substring(0,($(event.currentTarget).val()).length-1);
		}
	}	
	return isValid;
	
}

function validateTimeWithOrWithoutColon(event){
	var value;
	if(event && event.currentTarget) {
		value = $(event.currentTarget).val();
	}else {
		value = event;
	}
	var isValid=true;
	isValid = validateNumberWithOrWithoutColon(value);
	if(isValid){
		isValid = validateTime(event);
	}
	return isValid;
}

function validateNumberWithOrWithoutColon(key){
	var regex = /^(?:\s*\d{0,2}\s*(?:|:|$))+$/;
	return validateExp(regex,key);
}

function validateTime(event) {
	if(event && event.currentTarget) {
		timeStr = $(event.currentTarget).val();
	}else {
		timeStr = event;
	}
	var strLength = timeStr.toString().length;
	if(timeStr && timeStr.indexOf(":") == -1) {
		if(strLength > 4) {
			return false;
		}
		if(strLength < 4) {
			for(var i=0;i<4-strLength; i++) {
				timeStr = "0" + timeStr;
			}
		}
		var re = /^(20|21|22|23|[01]\d|\d)(([0-5]\d){1,2})$/;
	    return re.test(timeStr);
	}else if(timeStr && timeStr.indexOf(":") > -1) {
		if(strLength > 5) {
			return false;
		}
		var colonIndex = timeStr.indexOf(":");
		for(var i=0;i<2-colonIndex; i++) {
			timeStr = "0" + timeStr;
		}
		strLength = timeStr.length;
		for(var i=0;i<5-strLength; i++) {
			timeStr = timeStr + "0";
		}
		var re = /^(20|21|22|23|[01]\d|\d)(:)(([0-5]\d){1,2})$/;
	    return re.test(timeStr);
	}
}
function setOldValue(event){
	parent.closeHeaderMsgWin();
	$(event.currentTarget)[0].oldValue=$(event.currentTarget).val();
}

function containsAll(needles, haystack){ 
	for(var i = 0 , len = needles.length; i < len; i++){
		if($.inArray(needles[i], haystack) == -1) return false;
	}
	return true;
}