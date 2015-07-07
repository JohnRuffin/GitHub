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
            this.highlightedGraphics = [];
        },

        getHighlightedGraphics: function() {
            return this.highlightedGraphics;
        },

        clearHighlightedGraphics: function() {
            delete this.highlightedGraphics;
            this.highlightedGraphics = [];
        },

        initialize: function() {
            var contextMenuComponent = this;
            this.contextMenu = new Menu({
                leftClickToOpen: false,
                onMouseLeave: function(e) {
                    if (!contextMenuComponent.isLocationSelected) {
                        //contextMenuComponent.highlightGraphics(false, contextMenuComponent.placemarks);                		
                    }
                }
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
                        contextMenuComponent.isLocationSelected = true;
                        contextMenuComponent.highlightGraphics(true, contextMenuComponent.placemarks);
                        if (contextMenuComponent.selectedGraphics == undefined) {
                            contextMenuComponent.selectedGraphics = [];
                            parent.selectedHighlightedGraphic = [];
                        }
                        if (contextMenuComponent.selectedGraphics && contextMenuComponent.placemarks) {
                            $.merge(contextMenuComponent.selectedGraphics, contextMenuComponent.placemarks);
                            $.merge(parent.selectedHighlightedGraphic, contextMenuComponent.placemarks);

                        }
                        e["menuItem"] = menuItem;
                        menuItem.callbackMethod(e);
                    }
                });
            }
            return;
        },

        createPopupMenuItem: function(locations, callback, type) {
            if (locations != undefined) {
                var pSubMenu = new Menu({

                });
                pSubMenu.addChild(this.getMenuNode({
                    label: "All",
                    callbackMethod: callback,
                    type: type,
                    locations: locations
                }));
                for (var i = 0; i < locations.length; i++) {
                    pSubMenu.addChild(this.getMenuNode({
                        label: this.getLabel(locations[i]),
                        callbackMethod: callback,
                        type: type,
                        locations: [locations[i]]
                    }));
                }
                return pSubMenu;
            }
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

        getPopUpMenuItem: function(locations, type) {
            switch (type) {
            case "from":
                return new PopupMenuItem({
                    label: "From",
                    popup: this.createPopupMenuItem(locations, this.contextMenuListener, type)
                });
                break;
            case "through":
                return new PopupMenuItem({
                    label: "Through",
                    popup: this.createPopupMenuItem(locations, this.contextMenuListener, type)
                });
                break;
            case "to":
                return new PopupMenuItem({
                    label: "To",
                    popup: this.createPopupMenuItem(locations, this.contextMenuListener, type)
                });
                break;
            case "origin":
                return new PopupMenuItem({
                    label: "Origin",
                    popup: this.createPopupMenuItem(locations, this.contextMenuListener, type)
                });
                break;
            case "destination":
                return new PopupMenuItem({
                    label: "Destination",
                    popup: this.createPopupMenuItem(locations, this.contextMenuListener, type)
                });
                break;
            }
        },

        createPopUpMenu: function(locations) {
            if (locations != undefined) {
                if (parent.isNetworkQuery) {
                    this.contextMenu.addChild(this.getPopUpMenuItem(locations, "from"));
                    this.contextMenu.addChild(this.getPopUpMenuItem(locations, "through"));
                    this.contextMenu.addChild(this.getPopUpMenuItem(locations, "to"));
                } else {
                    this.contextMenu.addChild(this.getPopUpMenuItem(locations, "origin"));
                    this.contextMenu.addChild(this.getPopUpMenuItem(locations, "destination"));
                }
            }
        },

        createMenuNodes: function(locations, graphic) {
            if (locations != undefined) {
                if (parent.isNetworkQuery) {
                    this.contextMenu.addChild(this.getMenuNode({
                        label: "From",
                        callbackMethod: this.contextMenuListener,
                        locations: [locations[0]],
                        type: locations[0] == "lasso" ? "lassoFrom" : undefined,
                        graphic: graphic
                    }));
                    this.contextMenu.addChild(this.getMenuNode({
                        label: "Through",
                        callbackMethod: this.contextMenuListener,
                        locations: [locations[0]],
                        type: locations[0] == "lasso" ? "lassoThrough" : undefined,
                        graphic: graphic
                    }));
                    this.contextMenu.addChild(this.getMenuNode({
                        label: "To",
                        callbackMethod: this.contextMenuListener,
                        locations: [locations[0]],
                        type: locations[0] == "lasso" ? "lassoTo" : undefined,
                        graphic: graphic
                    }));
                } else {
                    this.contextMenu.addChild(this.getMenuNode({
                        label: "Origin",
                        callbackMethod: this.contextMenuListener,
                        locations: [locations[0]],
                        type: locations[0] == "lasso" ? "lassoOrigin" : undefined,
                        graphic: graphic
                    }));
                    this.contextMenu.addChild(this.getMenuNode({
                        label: "Destination",
                        callbackMethod: this.contextMenuListener,
                        locations: [locations[0]],
                        type: locations[0] == "lasso" ? "lassoDestination" : undefined,
                        graphic: graphic
                    }));
                }
            }
        },

        buildMenu: function(data, locationGraphics) {
            if (data == undefined) {
                return;
            }
            this.clear();
            this.placemarks = locationGraphics;
            if (data["locations"] != undefined) {
                this.createMenu(data.locations, data["graphic"]);
            }

            var menuNodes;
            if (data["menuNodes"] != undefined) {
                menuNodes = data["menuNodes"];
                for (i = 0; i < menuNodes.length; i++) {
                    this.addMenuNode(menuNodes[i], locationGraphics);
                }
            }
        },

        highlightGraphics: function(isHighlight, locationGraphics, key) {
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
                    if(graphic.geometry.type == "polyline"){
                        continue;
                    }
                    if (graphic.symbol.outline) {
                        graphic.symbol.outline.setColor(dojoColorCode);
                    }
                    graphic.setSymbol(graphic.symbol.setColor(dojoColorCode));
                    if (isHighlight && key != undefined) {
                        this.highlightedGraphics[key] = graphic;
                    }
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
                    label: menuLabel,
                    callbackMethod: this.contextMenuListener,
                    locations: data
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