/**
 * Module design pattern
 * Context Manager 
 * @returns {Context Manager}
 */
define(["dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dojo/on", "dijit/PopupMenuItem", "dojo/_base/connect", "dijit/registry", "dojo/_base/declare", "dojo/dom", "dojo/dom-construct"], function(Menu, MenuItem, MenuSeparator, on, PopupMenuItem, connect, registry, declare, dom, domConstruct) {

    // This returned object becomes the defined value of this module
    return declare(null, {
        //dijitPopup dijitMenuPopup
        constructor: function(listener) {
            this.isLocationSelected = false;
            this.placemarks;
            this.selectedGraphics;
            this.initialize();
            this.bindedNodes = {};
            this.contextMenuListener = listener;
        },

        initialize: function() {
            var contextMenuComponent = this;
            this.contextMenu = new Menu({
                leftClickToOpen: true
            });
            this.contextMenu.startup();
        },

        bindDomNode: function(id, node) {
            if (node != undefined) {
                this.contextMenu.bindDomNode(node);
                this.bindedNodes[id] = node;
            }
        },

        unBindDomNode: function(id, node) {
            if (node != undefined) {
                this.contextMenu.unBindDomNode(node);
                delete this.bindedNodes[id];
            }
        },

        getMenuNode: function(menuItem) {
            var contextMenuComponent = this;
            if (menuItem != undefined) {
                return new MenuItem({
                    label: menuItem.label,
                    onClick: function(e) {
                    	menuItem.locationData["locCdActual"] = menuItem.locationData["locCd"];
                    	e["graphic"] = {data: {"attributes": menuItem.locationData }, geometry: {x: parseFloat(menuItem.locationData.lonNumerical), y: parseFloat(menuItem.locationData.latNumerical)}};
                        menuItem.callbackMethod(e);
                    }
                });
            }
            return;
        },



        getLabel: function(location) {
            if (location != undefined && location != "lasso") {
                return this.getLabelValuePatterns("location", location);
            }
        },

        getLabelValuePatterns: function(type, item) {
            switch (type) {
            case 'Schedule':
            case 'location':
                //return item.city +","+item.provStCd+","+item.countryCd+" ("+item.locCd+") - "+AdvancedAutoComplete.getFacilityTypeDescription(item.facType);
                return "<b>" + item.locCd + "</b> - " + item.relFacilityName + ", " + (item.provStCd != undefined ? item.provStCd + ", " + item.countryCd : item.countryCd) + " - " + this.getFacilityTypeDescription(item.facType);
                break;
            case 'facilityGroup':
                return "<b>" + item.groupName + "</b> - " + item.grpDesc;
                break;
            case 'country':
                return "<b>" + item.countryCode + "</b> - " + item.countryDesc;
                break;
            case 'region':
                return item.countryCode + " - " + item.countryDesc;
                break;
            default:
                return "";
            }
        },

        getFacilityTypeDescription: function(facilityType) {
            switch (facilityType) {
            case 'HU':
                return "Hub";
                break;
            case 'RP':
                return "Ramp";
                break;
            case 'AP':
                return "Airport";
                break;
            default:
                return facilityType;
            }
        },







        buildMenu: function(data, locationGraphics) {
            if (data == undefined) {
                return;
            }
            this.clear();

            var facilities;
            if (data["facilities"] != undefined) {
                menuNodes = data["facilities"];
                for (i = 0; i < menuNodes.length; i++) {
                	if(menuNodes[i].facType === "AP"){
                		continue;
                	}
                    this.addMenuNode(menuNodes[i].locCd, menuNodes[i]);
                }
            }
        },
        
        triggerSingleMenuNode: function(data, locationGraphics) {
            if (data == undefined) {
                return;
            }
            this.clear();

            var facilities;
            if (data["facilities"] != undefined) {
                menuNodes = data["facilities"];
                var actualMenuNode;
                var customEvent=[];
                var count =0;
                for (i = 0; i < menuNodes.length; i++) {
                	if(menuNodes[i].facType === "AP"){
                		continue;
                	}
                	count++;
                	if(i ==  (menuNodes.length -1) ){
                		if(count == 1){
                			actualMenuNode = menuNodes[i];
                        }
                	}
                }
                
                if(actualMenuNode != undefined){
                	actualMenuNode["locCdActual"] = actualMenuNode["locCd"];
                	customEvent["graphic"] = {data: {"attributes": actualMenuNode }, geometry: {x: parseFloat(actualMenuNode.lonNumerical), y: parseFloat(actualMenuNode.latNumerical)}};
                }
                
                this.contextMenuListener(customEvent);
            }
        },
        
        isValid2BuildMenu: function(data, locationGraphics) {
            if (data == undefined) {
                return;
            }
            this.clear();

            var facilities;
            if (data["facilities"] != undefined) {
                menuNodes = data["facilities"];
                var count =0;
                for (i = 0; i < menuNodes.length; i++) {
                	if(menuNodes[i].facType === "AP"){
                		continue;
                	}
                	count++;
                }
                if(count == 1){
                	return true;
                }
            }
            
            return false;
        },


        highlightGraphics: function(isHighlight, locationGraphics) {
            if (locationGraphics == undefined) {
                locationGraphics = this.selectedGraphics;
            }

            var dojoColorCode;
            if (isHighlight) {
                dojoColorCode = new dojo.Color([255, 153, 0]);
            } else {
                dojoColorCode = new dojo.Color([153, 153, 153]);
            }
            if (locationGraphics != undefined) {
                var graphic;
                for (var i = 0; i < locationGraphics.length; i++) {
                    graphic = this.getVirtualLocationGraphic(isHighlight, locationGraphics[i]);

                    if (graphic == undefined) {
                        graphic = locationGraphics[i];
                    }

                    if (graphic.symbol.outline) {
                        graphic.symbol.outline.setColor(dojoColorCode);
                    }
                    graphic.setSymbol(graphic.symbol.setColor(dojoColorCode));
                }
            }
        },

        getVirtualLocationGraphic: function(isHighlight, actualGraphic) {
            var virtualGraphicList;
            try {
                if (actualGraphic != undefined) {
                    if (actualGraphic.data != undefined && actualGraphic.data.attributes != undefined && actualGraphic.data.attributes.AllLocations != undefined) {
                        virtualGraphicList = getLocationGraphic(isHighlight, actualGraphic.data.attributes.AllLocations[0].locCd);
                        if (virtualGraphicList != undefined && virtualGraphicList.length > 0) {
                            return virtualGraphicList[0];
                        }
                    }
                }
            } catch (error) {
                LoggerUtils.console("Error occured while retrieving the LOCCD while identifying the virtual graphic" + error);
            }

            return;
        },

        createMenu: function(data, graphic) {
            if (data == undefined) {
                return;
            }

            switch (data.length) {
            case 0:
                break;
            case 1:
                this.createMenuNodes(data, graphic);
                break;
            default:
                this.createPopUpMenu(data);
            }
        },

        addMenuNode: function(menuLabel, data) {
            if (this.contextMenu != undefined) {
                this.contextMenu.addChild(this.getMenuNode({
                    label: this.getLabel(data),
                    callbackMethod: this.contextMenuListener,
                    locationData: data
                }));
                return true;
            }
        },

        totalItems: function(domElement) {
            if (domElement != undefined) {
                return domElement.getChildren().length;
            } else {
                return this.contextMenu.getChildren().length;
            }
        },

        clear: function() {
            var menuChildren;
            if (this.contextMenu != undefined) {
                this.contextMenu.destroyRecursive(true);
                $(".dijitPopup").remove();
            }
            this.isLocationSelected = false;
            this.placemarks = undefined;
            this.initialize();
        },

        unBindAllNodes: function() {
            var ids;
            if (this.bindedNodes != undefined) {
                ids = Object.keys(this.bindedNodes);
                if (ids != undefined) {
                    for (var j = 0; j < ids.length; j++) {
                        this.unBindDomNode(ids[j], this.bindedNodes[ids[j]]);
                    }
                }
            }
        }

    });
});