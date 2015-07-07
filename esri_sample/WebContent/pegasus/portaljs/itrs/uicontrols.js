/**
 * @author: aditya.velala
 */
var isResizing = false; // flag for reszing
var isDragInProgress = false; // drag indicator
var clientX; // mouse x position
var clientY; // mouse y position
//var requestCount = [];
var iframeMap = {};
//var loadingAnimationDialog = null;
// event handlers
var onmouseupHandler, onmousemoveHandler, onmousedownHandler,
    onmousedragHandler, ondblClickHandler;
//method to create kendoComboBox with specfied comboId,placeholder,filterType,dataSource,dataTextField & dataValueField
function createKendoComboBox(comboId, placeholder, filterType, dataSource,
    dataTextField, dataValueField) {
    return createKendoComboBoxByDiv($(HASH_STRING + comboId), placeholder,
        filterType, dataSource, dataTextField, dataValueField);
}

function createKendoComboBoxByDiv(comboDiv, placeholder, filterType, dataSource,
        dataTextField, dataValueField) {
        //create kendoComboBox UI component
        return comboDiv.kendoComboBox({
            minLength: 0,
            dataSource: dataSource,
            filter: filterType,
            placeholder: placeholder,
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            change: function(e) {
                //changes for defect #385
                if (e.sender._oldIndex < 0) {
                    e.sender.text("");
                }
            }
        });
    }
    // create AutoComplete UI component

function _createKendoDropDown(id, dataProvider, labelField, valueField,
    changeFunction) {
    $("#" + id).kendoComboBox({
        minLength: 0,
        dataSource: dataProvider,
        filter: "startswith",
        placeholder: "Select",
        dataTextField: labelField,
        dataValueField: valueField,
        change: function(evt, ui) {
            //changeFunction(this.dataSource.view()[this._current.index()].id);    
        }
    });
}

function setStartValue(e, slider_id, startValue_id, rangeSlider, minValue,
    maxValue) {
    if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
        var startValue = parseInt($("#" + startValue_id).val());
        if (isNaN(startValue) || startValue < minValue || startValue >
            maxValue) {
            //            alert("Value must be a number between 0 and 10");
            return;
        }
        var endValue = getkendoRangeSliderValue(slider_id)[1];
        rangeSlider.value([startValue, endValue]);
    }
}

function setEndValue(e, slider_id, endValue_id, rangeSlider, minValue, maxValue) {
    if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
        var startValue = getkendoRangeSliderValue(slider_id)[0];
        var endValue = parseInt($("#" + endValue_id).val());
        if (isNaN(endValue) || endValue < minValue || endValue > maxValue) {
            //            alert("Value must be a number between 0 and 10");
            return;
        }
        rangeSlider.values(startValue, endValue);
    }
}

function getkendoRangeSliderValue(slider_id) {
    return $("#" + slider_id).data("kendoRangeSlider").value();
}

function rangeSliderOnSlide(e, startValue_id, endValue_id) {
    $("#" + startValue_id)[0].value = e.value[0];
    $("#" + endValue_id)[0].value = e.value[1];
}

function createKendoRangeSlider(sliderDivId, startValue_id, endValue_id,
    minValue, maxValue) {
    return createKendoRangeSliderByDiv($(HASH_STRING + sliderDivId),
        startValue_id, endValue_id, minValue, maxValue);
}

function createKendoRangeSliderByDiv(sliderDivObj, startValue_id, endValue_id,
    minValue, maxValue) {
    var rangeSlider = sliderDivObj.kendoRangeSlider({
        tickPlacement: 'none',
        min: minValue,
        max: maxValue,
        slide: function(e) {
            rangeSliderOnSlide(e, startValue_id, endValue_id);
        }
    }).data("kendoRangeSlider");
    $("#" + startValue_id).keypress(function(e) {
        setStartValue(e, slider_id, startValue_id, rangeSlider,
            minValue, maxValue);
    });
    $("#" + endValue_id).keypress(function(e) {
        setEndValue(e, slider_id, endValue_id, rangeSlider,
            minValue, maxValue);
    });
    return rangeSlider;
}

function validateParentCheckbox(checkboxObj, parentCheckboxId, otherCheckboxIds) {
    var isDisabled = !checkboxObj.checked;
    if (isDisabled) {
        for (var i = 0; i < otherCheckboxIds.length; i++) {
            if ($(HASH_STRING + otherCheckboxIds[i])[0].checked) {
                isDisabled = false;
                break;
            }
        }
    }
    $(HASH_STRING + parentCheckboxId)[0].checked = !isDisabled;
}

function validateExpandCheckboxes(checkboxObj, itemIds, ifEnbldMrkCheck) {
    if (itemIds) {
        for (var i = 0; i < itemIds.length; i++) {
            validateExpandCheckbox(checkboxObj, itemIds[i], ifEnbldMrkCheck);
        }
    }
}

function validateExpandCheckbox(checkboxObj, itemId, ifEnbldMrkCheck,
    windowName) {
    validateExpandCheckboxByDiv(checkboxObj, $(HASH_STRING + itemId),
        ifEnbldMrkCheck, windowName);
}

function validateExpandCheckboxByDiv(checkboxObj, itemDivObj, ifEnbldMrkCheck,
    windowName) {
    if (checkboxObj.checked) {
        itemDivObj.removeAttr("disabled");
        if (ifEnbldMrkCheck) {
            itemDivObj[0].checked = true;
        }
    } else {
        itemDivObj[0].checked = false;
        itemDivObj.attr("disabled", true);
    }
    if (windowName != undefined) {
        if ($("#" + windowName).data("kendoWindow").options.isMinimized) {
            itemDivObj[0].checked = false;
        }
    }
}

function validateComboBoxOnCheckbox(checkboxObj, comboId, comboType) {
    validateComboBoxOnCheckboxByDiv(checkboxObj, $(HASH_STRING + comboId),
        comboType);
}

function validateComboBoxOnCheckboxByDiv(checkboxObj, comboDivObj, comboType) {
    if (comboType == null || comboType == EMPTY_STRING) {
        if (checkboxObj != undefined && checkboxObj.checked) {
            comboDivObj.data("kendoComboBox").enable(true);
        } else {
            comboDivObj.data("kendoComboBox").enable(false);
        }
    } else {
        if (checkboxObj.checked) {
            comboDivObj.data(comboType).enable(true);
        } else {
            comboDivObj.data(comboType).enable(false);
        }
    }
}

function getItem(target) {
    var itemIndex = target[0].value;
    return tabStrip.tabGroup.children("li").eq(itemIndex);
}

function createOptionsPanel(itmeId, collapseType, isCollapsed,
    isTrueVerticalText, vHeight, width) {
    return createOptionsPanelByDiv($(HASH_STRING + itmeId), collapseType,
        isCollapsed, isTrueVerticalText, vHeight, width);
}

function createOptionsPanelByDiv(panelDiv, collapseType, isCollapsed,
    isTrueVerticalText, vHeight, width) {
    return panelDiv.panel({
        collapseType: collapseType,
        /* changed from collapsed to expanded so it would actually work -tc */
        expanded: !isCollapsed,
        trueVerticalText: isTrueVerticalText,
        /* no defined in jquery.ui.panel.js -tc */
        vHeight: vHeight,
        /* no defined in jquery.ui.panel.js -tc */
        width: width
    });
}

function updateControl(controlArr, flag, dashboard) {
    for (var i = 0; i < controlArr.length; i++) {
        if (dashboard.$("#" + controlArr[i]) && dashboard.$("#" +
            controlArr[i]).length > 0) {
            dashboard.$("#" + controlArr[i])[0].checked = flag;
        }
    }
}

function updatekendoCombo(controlArr, controlType, dashboard) {
    for (var i = 0; i < controlArr.length; i++) {
        if (dashboard.$("#" + controlArr[i]) && dashboard.$("#" +
            controlArr[i]).length > 0) {
            dashboard.$("#" + controlArr[i]).data(controlType).select(0);
        }
    }
}

function updatekendoMultiSelect(controlArr, controlType, dashboard) {
    for (var i = 0; i < controlArr.length; i++) {
        if (dashboard.$("#" + controlArr[i]) && dashboard.$("#" +
            controlArr[i]).length > 0) {
            dashboard.$("#" + controlArr[i]).data(controlType).value(
                EMPTY_STRING);
        }
    }
}