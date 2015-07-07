function ActivityDetailPopUp() {
    this.activityDetailPopUpWin;
    this.dataObject;
    this.activityPopupMap = {};
}

ActivityDetailPopUp.prototype.showPopUp = function(dataObject) {
    var activityDetailPopUp = this;
    activityDetailPopUp.dataObject = dataObject;
    var locCd = this.dataObject.attributes.locCdActual;
    if (this.activityDetailPopUpWin == undefined || this.activityDetailPopUpWin.data("kendoWindow") == undefined) {
        this.activityDetailPopUpWin = $("<div id='popUp" + Math.random() + "'/>").kendoWindow({ /*width: "300px",*/
            /*height: "150px",*/
            draggable: true,
            modal: false,
            open: function(e) {
                //activityDetailPopUp.openWindowEvent();
            },
            close: function(e) {
                //activityDetailPopUp.closeWindowEvent();
            },
            resizable: false,
            actions: ["close"],
            title: "Location Activity Selection"
        });


        this.activityDetailPopUpWin.parent().find('.k-window-content').css({
            "padding-left": "0px",
            "padding-right": "0px",
            "padding-botom": "0px",
            "min-width": "120px",
            "min-height": "80px"
        });
    }


    this.activityDetailPopUpWin.data("kendoWindow").content(this.createLayout());
    this.activityDetailPopUpWin.data("kendoWindow").open().center();

    this.restoreActivityWindow();
    return true;
};

ActivityDetailPopUp.prototype.restoreActivityWindow = function() {
    var locCd = this.dataObject.attributes.locCdActual;
    if (this.activityDetailPopUpWin && this.activityPopupMap[locCd]) {
        var selectedActivities = this.activityPopupMap[locCd];
        var inboundSelection = selectedActivities.inboundActivities;
        var checkboxList;
        if (inboundSelection) {

            checkboxList = $("#activityPopupTable").find("td input.icheckbox");
            if (checkboxList != null) {
                var selectedCount = 0;
                for (var i = 0; i < checkboxList.length; i++) {
                    var checkbox = checkboxList[i];
                    if (inboundSelection.indexOf(checkbox.value) <= -1) {
                        checkbox.checked = false;
                    }

                    if (inboundSelection.indexOf(checkbox.value) >= 0) {
                        selectedCount = selectedCount + 1;
                        checkbox.checked = true;
                    }
                }
                if (checkboxList.length == inboundSelection.length && selectedCount == checkboxList.length) {
                    if ($("#activityPopupTable").find("#inboundAll")[0] != undefined) $("#activityPopupTable").find("#inboundAll")[0].checked = true;
                } else {
                    if ($("#activityPopupTable").find("#inboundAll")[0] != undefined) $("#activityPopupTable").find("#inboundAll")[0].checked = false;
                }
            }

        }
        var outboundSelection = selectedActivities.outboundActivities;
        if (outboundSelection) {
            var selectedCount = 0;
            checkboxList = $("#activityPopupTable").find("td input.ocheckbox");
            if (checkboxList != null) {
                for (var j = 0; j < checkboxList.length; j++) {
                    var checkbox = checkboxList[j];
                    if (outboundSelection.indexOf(checkbox.value) <= -1) {
                        checkbox.checked = false;
                    }

                    if (outboundSelection.indexOf(checkbox.value) >= 0) {
                        checkbox.checked = true;
                        selectedCount = selectedCount + 1;
                    }
                }
                if (checkboxList.length == outboundSelection.length && selectedCount == checkboxList.length) {
                    if ($("#activityPopupTable").find("#outboundAll")[0] != undefined) $("#activityPopupTable").find("#outboundAll")[0].checked = true;
                } else {
                    if ($("#activityPopupTable").find("#outboundAll")[0] != undefined) $("#activityPopupTable").find("#outboundAll")[0].checked = false;
                }
            }
        }
    }
};


ActivityDetailPopUp.prototype.createLayout = function() {
    var activityDetailPopUp = this;
    var htmlContent = "<div class='top-padding1 left-padding3'><label  class='section-header' style='color:#666666'>Select activities to display </label></div> <div align='center' class='section-box-content right-padding3' style='padding-left:30px'>";
    htmlContent = htmlContent + "<input type='hidden' value='" + this.dataObject.attributes.locCdActual + "' id='locCdActual'/>";

    var activities;
    if (this.dataObject) {
    	//header 
        activities = this.dataObject.attributes.activities;
        htmlContent = htmlContent + "<table id='activityPopupTable' align='center' width='90%' height='100%' ><tr><td align='center' class='grey-text' >";
        htmlContent = htmlContent + "Inbound </td><td style='width:120px'></td>";
        htmlContent = htmlContent + "<td align='center' class='grey-text'>";
        htmlContent = htmlContent + "Outbound";
        htmlContent = htmlContent + "</td></tr>";

        if (activities) {
        	//inbound & outbound all table data
            if (activities.length > 1) {
                htmlContent = htmlContent + "<tr><td align='center'>";
                htmlContent = htmlContent + "<input type='checkbox' id='inboundAll' class='checkbox' value='inbound' onclick='selectAllActivityHandler(\"inbound\", this)'  checked='checked'/><label></label> </td>";
                htmlContent = htmlContent + "<td style='padding-left:15px;'><label class='grey-text' style='color:#003366 !important'>All</label></td><td align='center'><input type='checkbox' id='outboundAll' class='checkbox' value='outbound' onclick='selectAllActivityHandler(\"outbound\", this)'  checked='checked'/><label ></label></td></tr>";
            }
            //loading all the activities
            for (var i = 0; i < activities.length; i++) {
                htmlContent = htmlContent + "<tr><td align='center'>";
                htmlContent = htmlContent + "<input type='checkbox' class='icheckbox' value='" + activities[i] + "' onclick='validateInboundAll()'  checked='checked'/><label></label> </td>";
                htmlContent = htmlContent + "<td style='padding-left:15px;'><label class='grey-text' style='color:#003366 !important'>" + this.dataObject.attributes.locCdActual + "/" + activities[i] + "</label></td><td align='center'><input type='checkbox' class='ocheckbox' value='" + activities[i] + "' onclick='validateOutboundAll()'  checked='checked'/><label ></label></td></tr>";
            }
        }
        htmlContent = htmlContent + "<tr><td  align='center' colspan='3' style='padding-top:15px'>";
        htmlContent = htmlContent + '<input type="button" id="savechangesBtn"  value="OK" onclick="onActivityPopupClick()" disabled="disabled" style="margin-left:-12px !important; min-width: 50px !important; width: 60px !important; position: relative !important;" >';
        htmlContent = htmlContent + '<input type="button" id="cancelchangesBtn"  value="Cancel" onclick="onActivityPopupCancel()" style="margin-left:10px !important; min-width: 50px !important; width: 60px !important; position: relative !important;">';
        htmlContent = htmlContent + "</td></tr></table>";
    }
    htmlContent = htmlContent + "</div>";
    return htmlContent;
};

function validateInboundAll() {
    var iCheckBoxList = $("#activityPopupTable").find("td input.icheckbox");
    var iAllSelected = true;
    if (iCheckBoxList != undefined) {
        for (var i = 0; i < iCheckBoxList.length; i++) {
            if (!iCheckBoxList[i].checked) {
                if ($("#activityPopupTable").find("#inboundAll")[0] != undefined) $("#activityPopupTable").find("#inboundAll")[0].checked = false;
                iAllSelected = false;
                break;
            }
        }
        if(iAllSelected ){
        	if ($("#activityPopupTable").find("#inboundAll")[0] != undefined) {
                $("#activityPopupTable").find("#inboundAll")[0].checked = true;
            }
        }
    }
    changeButtonStateHandler();
}

function changeButtonStateHandler(){
	var iCheckBoxList = $("#activityPopupTable").find("td input.icheckbox:checked");
	var oCheckBoxList = checkboxList = $("#activityPopupTable").find("td input.ocheckbox:checked");
	
	if(iCheckBoxList.length ==0 && oCheckBoxList.length == 0){
		$("#activityPopupTable").find("#savechangesBtn").attr("disabled", true);
	}else {
		$("#activityPopupTable").find("#savechangesBtn").attr("disabled", false);
	}
}

function validateOutboundAll() {
    var oCheckBoxList = checkboxList = $("#activityPopupTable").find("td input.ocheckbox");
    
    var oAllSelected = true;
    if (oCheckBoxList != undefined) {
        for (var i = 0; i < oCheckBoxList.length; i++) {
            if (!oCheckBoxList[i].checked) {
                if ($("#activityPopupTable").find("#outboundAll")[0] != undefined) $("#activityPopupTable").find("#outboundAll")[0].checked = false;
                oAllSelected = false;
                break;
            }
        }
        if ( oAllSelected && $("#activityPopupTable").find("#outboundAll")[0] != undefined) {
            $("#activityPopupTable").find("#outboundAll")[0].checked = true;
        }
    }
    changeButtonStateHandler();
}

function onActivityPopupCancel() {
    if (activityPopUp) {
        activityPopUp.activityDetailPopUpWin.data("kendoWindow").close();
    }
}

ActivityDetailPopUp.prototype.selectAllActivityHandler = function(activityType, isSelected) {
    var checkheckboxList;
    if (activityType == "inbound") {
        checkheckboxList = $("#activityPopupTable").find("td input.icheckbox");
        this.setActivities(checkheckboxList, isSelected);
    } else if (activityType == "outbound") {
        checkheckboxList = $("#activityPopupTable").find("td input.ocheckbox");
        this.setActivities(checkheckboxList, isSelected);
    }
    
    changeButtonStateHandler();
};

ActivityDetailPopUp.prototype.getSelectedActivities = function() {
    if (this.activityDetailPopUpWin) {
        var inboundCheckboxList = $("#activityPopupTable").find("td input.icheckbox");
        var outboundCheckboxList = $("#activityPopupTable").find("td input.ocheckbox");
        var selectedActivities = {};
        selectedActivities.inboundActivities = this.getActivities(inboundCheckboxList);
        selectedActivities.outboundActivities = this.getActivities(outboundCheckboxList);
        selectedActivities.locCd = $("#locCdActual").val();
        selectedActivities.allSelected = this.isAllSelected();
        this.activityDetailPopUpWin.data("kendoWindow").close();
        var locCd = this.dataObject.attributes.locCdActual;

        //saving all activites in the map...
        this.activityPopupMap[locCd] = selectedActivities;

        return selectedActivities;
    }
};

ActivityDetailPopUp.prototype.close = function(isDestroy) {
	if(this.activityDetailPopUpWin.data("kendoWindow") != undefined){
		this.activityDetailPopUpWin.data("kendoWindow").close();	
	}
    
    if(isDestroy){
    	activityWhereClause = "";
		activityPopUp.clear();
		if(this.activityDetailPopUpWin.data("kendoWindow")){
			this.activityDetailPopUpWin.data("kendoWindow").destroy();	
		}
    }
};

ActivityDetailPopUp.prototype.clear = function() {
	this.activityPopupMap = {};
};

ActivityDetailPopUp.prototype.isAllSelected = function() {
    if (this.activityDetailPopUpWin) {
        if ($("#inboundAll") && $("#inboundAll").length < 1) {
            return false;
        }

        if ($("#outboundAll") && $("#outboundAll").length < 1) {
            return false;
        }
        return ($("#inboundAll")[0].checked && $("#outboundAll")[0].checked);
    }
};

ActivityDetailPopUp.prototype.setActivities = function(checkboxList, flag) {
    if (this.activityDetailPopUpWin) {
        var selectedActivities = [];
        if (checkboxList != null) {
            for (var i = 0; i < checkboxList.length; i++) {
                var checkbox = checkboxList[i];
                checkbox.checked = flag;
            }
        }
    }
};

ActivityDetailPopUp.prototype.getActivities = function(checkboxList) {
    if (this.activityDetailPopUpWin) {
        var selectedActivities = [];
        if (checkboxList != null) {
            for (var i = 0; i < checkboxList.length; i++) {
                var checkbox = checkboxList[i];
                if (checkbox.checked) {
                    selectedActivities.push(checkbox.value);
                }
            }

        }
        return selectedActivities;
    }
};