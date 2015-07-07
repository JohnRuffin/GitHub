/**
 * Is an utility component.
 * @author 888608
 */



/**
 * Is a custom implementation for auto complete component
 */

$.widget("widgets.AdvancedDialog", $.ui.dialog, {

    //overriding the create method;
    _create: function() {
        this._super();
        this.contentDivIds = [];
    }
});

/**
 * constructor for the component to create, initialize and bind events 
 * @param divId
 * @param contentDivIds
 * @param options
 * @returns 
 */
function AdvancedDialog(divId, contentDivIds, options) {
    this.divId = divId;
    this.contentDivIds = contentDivIds;
    if (options != undefined) {
        this.width = options.width == undefined ? 300 : options.width;
        this.height = options.height == undefined ? 350 : options.height;
        this.position = options.position;
        this.openListener = options.openListener;
    }

    this.createWidget();
    this.updatePosition();
    this.bindEvents();
}
/**
 * private method to create widget  
 * @returns {AdvancedDialog}
 */
AdvancedDialog.prototype.createWidget = function() {
    var advancedDialog = this;
    var jQueryObject = $("#" + this.divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        //returns the advanced auto complete component
        var dialog = jQueryObject.AdvancedDialog({
            autoOpen: false,
            height: advancedDialog.height,
            width: advancedDialog.width,
            defaultWidth: advancedDialog.width,
            defaultHeight: advancedDialog.height,
            modal: true,
            contentDivIds: advancedDialog.contentDivIds,
            position: {
                my: "left top",
                at: "left bottom",
                of: $("#" + advancedDialog.position)
            },
            show: {
                //effect: "blind",
                duration: 500
            },
            hide: {
                //effect: "explode",
                duration: 500
            },
            open: function(e) {
                if (advancedDialog.openListener != undefined) {
                    advancedDialog.openListener(e, AdvancedDialog.getPropertyValue(advancedDialog.divId, "datasetType"), AdvancedDialog.getPropertyValue(advancedDialog.divId, "targetDivId"), AdvancedDialog.getPropertyValue(advancedDialog.divId, "type"));
                }
            }
        });

        //remove the button bar
        jQueryObject.AdvancedDialog().parent().find(".ui-button.ui-widget").remove();
        //add the background image
        jQueryObject.AdvancedDialog().parent().find(".ui-dialog-titlebar").addClass("dialogHeader");
        jQueryObject.AdvancedDialog().parent().find(".ui-dialog-titlebar").append('<a href="#" class="ui-multiselect-close" onclick=\'AdvancedDialog.trigger("close", "' + this.divId + '")\'><span class="ui-icon ui-icon-circle-close"></span></a>');

        return dialog;
    }
    delete jQueryObject;
};
/**
 * triggers the close handler for the AdvancedDialog
 * @param eventType
 * @param divId
 */
AdvancedDialog.trigger = function(eventType, divId) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        AdvancedDialog.closeDialog(divId);
    }
    delete jQueryObject;
};

AdvancedDialog.prototype.updatePosition = function() {
    var advancedDialog = this;
    var jQueryObject = $("#" + this.divId);

    if (jQueryObject != undefined && jQueryObject.length > 0 && advancedDialog.position != undefined) {
        AdvancedDialog.setPropertyValue(this.divId, "position", {
            my: "left top",
            at: "left bottom",
            of: $("#" + advancedDialog.position)
        });
    } else {
        AdvancedDialog.setPropertyValue(this.divId, "position", {
            my: "center",
            at: "center",
            of: window
        });
    }
    delete jQueryObject;
};

AdvancedDialog.prototype.bindEvents = function() {
    var advancedDialog = this;
    var jQueryObject = $("#" + this.divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        //refresh event
        jQueryObject.bind("refresh", function(e) {
            if (advancedDialog.openListener != undefined) {
                advancedDialog.openListener(e, AdvancedDialog.getPropertyValue(advancedDialog.divId, "datasetType"), AdvancedDialog.getPropertyValue(advancedDialog.divId, "targetDivId"), AdvancedDialog.getPropertyValue(advancedDialog.divId, "type"));
            }
        });
    }

};

AdvancedDialog.openDialog = function(dialogDivId, innerDivId, options) {
    var jQueryObject = $("#" + dialogDivId);
    var contentDivIds;
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        contentDivIds = AdvancedDialog.getPropertyValue(dialogDivId, "contentDivIds");
        if (contentDivIds != undefined && innerDivId != undefined) {
            for (var i = 0; i < contentDivIds.length; i++) {
                if (contentDivIds[i] == innerDivId) {
                    AdvancedDialog.showDialogContent(contentDivIds[i]);
                } else {
                    AdvancedDialog.hideDialogContent(contentDivIds[i]);
                }
            }
        }
        AdvancedDialog.setDialogOptions(dialogDivId, options);
        $("#" + dialogDivId).AdvancedDialog("open");

    }
    delete jQueryObject;
};

AdvancedDialog.setDialogOptions = function(divId, options) {
    var jQueryObject = $("#" + divId);
    if (jQueryObject != undefined && jQueryObject.length > 0 && options != undefined) {
        if (options.width != undefined) {
            AdvancedDialog.setPropertyValue(divId, "width", options.width);
        } else {
            AdvancedDialog.setPropertyValue(divId, "width", AdvancedDialog.getPropertyValue(divId, "defaultWidth"));
        }
        if (options.height != undefined) {
            AdvancedDialog.setPropertyValue(divId, "height", options.height);
        } else {
            AdvancedDialog.setPropertyValue(divId, "height", AdvancedDialog.getPropertyValue(divId, "defaultHeight"));
        }

        if (options.position != undefined) {
            AdvancedDialog.setPropertyValue(divId, "position", {
                my: "left top",
                at: "left bottom",
                of: $("#" + options.position)
            });
        } else {
            AdvancedDialog.setPropertyValue(divId, "position", {
                my: "center",
                at: "center",
                of: window
            });
        }

        if (options.datasetType != undefined) {
            AdvancedDialog.setPropertyValue(divId, "datasetType", options.datasetType);
        } else {
            AdvancedDialog.setPropertyValue(divId, "datasetType", "");
        }

        if (options.targetDivId != undefined) {
            AdvancedDialog.setPropertyValue(divId, "targetDivId", options.targetDivId);
        } else {
            AdvancedDialog.setPropertyValue(divId, "targetDivId", "");
        }

        if (options.type != undefined) {
            AdvancedDialog.setPropertyValue(divId, "type", options.type);
        } else {
            AdvancedDialog.setPropertyValue(divId, "type", "location");
        }

        if (options.draggable != undefined) {
            AdvancedDialog.setPropertyValue(divId, "draggable", options.draggable);
        } else {
            AdvancedDialog.setPropertyValue(divId, "draggable", true);
        }

        if (options.resizable != undefined) {
            AdvancedDialog.setPropertyValue(divId, "resizable", options.resizable);
        } else {
            AdvancedDialog.setPropertyValue(divId, "resizable", true);
        }

    }
    delete jQueryObject;
};

AdvancedDialog.getPropertyValue = function(divId, propertyName) {
    var jQueryObject = $("#" + divId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        return jQueryObject.AdvancedDialog('option', propertyName);
    }
};

AdvancedDialog.setPropertyValue = function(divId, name, value) {
    var jQueryObject = $("#" + divId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.AdvancedDialog('option', name, value);
    }
};

AdvancedDialog.hideDialogContent = function(contentDivId) {
    var jQueryObject = $("#" + contentDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        $("#" + contentDivId).hide();
    }
    delete jQueryObject;
};

AdvancedDialog.showDialogContent = function(contentDivId) {
    var jQueryObject = $("#" + contentDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        $("#" + contentDivId).show();
    }
    delete jQueryObject;
};

AdvancedDialog.closeDialog = function(divId) {
    var jQueryObject = $("#" + divId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        $("#" + divId).AdvancedDialog("close");
    }
    delete jQueryObject;
};
