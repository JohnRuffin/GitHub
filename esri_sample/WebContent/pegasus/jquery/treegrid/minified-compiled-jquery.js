var flexiciousNmsp = {};
(function() {
    Array.indexOf || (Array.prototype.indexOf = function(a, c) {
        var d;
        for (d = c || 0; d < this.length; d += 1) if (this[d] === a) return d;
        return -1
    });
    Array.removeAll || (Array.prototype.removeAll = function() {
        return this.splice(0, this.length)
    });
    Array.prototype.forEach || (Array.prototype.forEach = function(a, c) {
        var d = this.length >>> 0;
        if ("function" != typeof a) throw new TypeError;
        for (var b = 0; b < d; b++) b in this && a.call(c, this[b], b, this)
    })
})();
flexiciousNmsp.position = {};
(function(a) {
    var c = function(b) {
            this.target = this.options = null;
            this.setTarget(b)
        };
    c.prototype.initialize = function() {};
    c.prototype.parseIntFromString = function(b) {
        return parseInt(b, 10) || 0
    };
    c.prototype.setTarget = function(b) {
        b && (this.target = [], this.target.push(b))
    };
    c.prototype.setOptions = function(b) {
        if (b) {
            this.options || (this.options = {});
            for (var d in b) this.options[d] = b[d]
        }
    };
    a.PluginBase = c;
    var d = function() {
            this.getElements = c.prototype.getElements;
            this.s.top = "auto";
            this.s.left = "auto";
            this.s.width = "auto";
            this.s.height = "auto";
            this.s.opacity = !0;
            this.s.src = "javascript:false;";
            this.s.conditional = /MSIE 6.0/.test(navigator.userAgent)
        };
    d.prototype.createIframe = function() {
        var b = document.createElement("iframe");
        b.className = "bgiframe";
        b.setAttribute("frameborder", "0");
        b.setAttribute("tabindex", "-1");
        b.setAttribute("src", this.s.src);
        b.style.display = "block";
        b.style.position = "absolute";
        b.style.zIndex = "-1";
        return b
    };
    d.prototype.fire = function(b) {
        var d = this.getIframe(b),
            a = d;
        d || (a = this.createIframe());
        a.style.top = "auto" == this.s.top ? -1 * (parseInt(b.style.borderTopWidth, 10) || 0) + "px" : this.prop(this.s.top);
        a.style.left = "auto" == this.s.left ? -1 * (parseInt(b.style.borderLeftWidth, 10) || 0) + "px" : this.prop(this.s.left);
        a.style.width = "auto" == this.s.width ? b.offsetWidth + "px" : this.prop(this.s.width);
        a.style.height = "auto" == this.s.height ? b.offsetHeight + "px" : this.prop(this.s.height);
        a.style.opacity = !0 === this.s.opacity ? "0" : void 0;
        d || b.insertBefore(a)
    };
    d.prototype.getIframe = function(b) {
        b = this.getElements("iframe.bgiframe", b);
        return "0" in b ? b[0] : b
    };
    d.prototype.prop = function(b) {
        return b && b.constructor === Number ? b + "px" : b
    };
    a.Bgiframe = d
})(flexiciousNmsp.position || (flexiciousNmsp.position = {}));
(function(a) {
    a.getElements = a.PluginBase.prototype.getElements;
    a.processCommand = function(c, d, b) {
        var g, f = !1;
        switch (d) {
        case "create":
            g = new a.Position(c, null, b);
            break;
        case "processElement":
            g = [c];
            if (f = !("dataPosition" in g[0])) return a.processCommand(c, "create", b);
            for (c = g.length; c--;) d = g[c].dataPosition, d(b)
        }
        return g
    }
})(flexiciousNmsp.position);
flexiciousNmsp.__extends = function(a, c) {
    function d() {
        this.constructor = a
    }
    d.prototype = c.prototype;
    a.prototype = new d
};
(function(a) {
    var c;
    c = function() {
        this.of = null;
        this.at = this.my = "";
        this.offset = "0 0";
        this.collision = "flip";
        this.using = null
    };
    var d;
    d = function() {
        this.left = this.top = 0
    };
    var b = function() {};
    b.prototype.getOffset = function(b, d) {
        if (!b || !b.ownerDocument) return null;
        d && this.setOffset(b, d);
        var g = {
            top: b.offsetTop || 0,
            left: b.offsetLeft || 0
        };
        if (b.getBoundingClientRect) {
            var a = b.getBoundingClientRect();
            g.top = parseInt(a.top + "", 10);
            g.left = parseInt(a.left + "", 10)
        }
        return g
    };
    b.prototype.setOffset = function(b, d) {
        "absolute" != b.style.position && (b.style.position = "relative");
        var g = this.getOffset(b),
            a = parseInt(b.style.top, 10) || 0,
            e = parseInt(b.style.left, 10) || 0,
            g = {
                top: d.top - g.top + a,
                left: d.left - g.left + e
            },
            a = !1;
        "using" in d && (a = "function" == typeof d.using);
        a ? d.using.call(b, g) : (b.style.top = g.top + "px", b.style.left = g.left + "px")
    };
    a.PositionOffset = b;
    var g = function() {
            this.bgiframe = null;
            this.position = {
                fit: new e,
                flip: new h
            };
            /MSIE 6.0/.test(navigator.userAgent) && (this.bgiframe = new a.Bgiframe)
        };
    flexiciousNmsp.__extends(g, b);
    var f = function() {};
    f.prototype.getWindowWidth = function() {
        var b = 0;
        "number" == typeof window.innerWidth ? b = window.innerWidth : document.documentElement && document.documentElement.clientWidth ? b = document.documentElement.clientWidth : document.body && document.body.clientWidth && (b = document.body.clientWidth || document.body.parentNode.clientWidth);
        return b
    };
    f.prototype.getWindowHeight = function() {
        var b = 0;
        "number" == typeof window.innerHeight ? b = window.innerHeight : document.documentElement && document.documentElement.clientHeight ? b = document.documentElement.clientHeight : document.body && document.body.clientHeight && (b = document.body.clientHeight || document.body.parentNode.clientHeight);
        return b
    };
    f.prototype.getWindowScrollLeft = function() {
        var b = 0;
        "number" == typeof window.pageXOffset ? b = window.pageXOffset : document.body && document.body.scrollLeft ? b = document.body.scrollLeft || document.body.parentNode.scrollLeft : document.documentElement && document.documentElement.scrollLeft && (b = document.documentElement.scrollLeft);
        return b
    };
    f.prototype.getWindowScrollTop = function() {
        var b = 0;
        "number" == typeof window.pageYOffset ? b = window.pageYOffset : document.body && document.body.scrollTop ? b = document.body.scrollTop || document.body.parentNode.scrollTop : document.documentElement && document.documentElement.scrollTop && (b = document.documentElement.scrollTop);
        return b
    };
    var e, b = function() {
            f.apply(this, arguments)
        };
    flexiciousNmsp.__extends(b, f);
    b.prototype.left = function(b, d) {
        var g = b.left + d.elemWidth - this.getWindowWidth() - this.getWindowScrollLeft();
        b.left = 0 < g ? b.left - g : Math.max(0, b.left);
        return b
    };
    b.prototype.top = function(b, d) {
        var g = b.top + d.elemHeight - this.getWindowHeight() - this.getWindowScrollTop();
        b.top = 0 < g ? b.top - g : Math.max(0, b.top);
        return b
    };
    e = b;
    var h, b = function() {
            f.apply(this, arguments)
        };
    flexiciousNmsp.__extends(b, f);
    b.prototype.left = function(b, d) {
        if ("center" != d.at[0]) {
            var g = b.left + d.elemWidth - this.getWindowWidth() - this.getWindowScrollLeft(),
                a = "left" == d.my[0] ? -d.elemWidth : "right" == d.my[0] ? d.elemWidth : 0,
                e = -2 * d.offset[0];
            b.left += 0 > b.left ? a + d.targetWidth + e : 0 < g ? a - d.targetWidth + e : 0
        }
        return b
    };
    b.prototype.top = function(b, d) {
        if ("center" != d.at[1]) {
            var g = b.top + d.elemHeight - this.getWindowHeight() - this.getWindowScrollTop(),
                a = "top" == d.my[1] ? -d.elemHeight : "bottom" == d.my[1] ? d.elemHeight : 0,
                e = "top" == d.at[1] ? d.targetHeight : -d.targetHeight,
                f = -2 * d.offset[1];
            b.top += 0 > b.top ? a + d.targetHeight + f : 0 < g ? a + e + f : 0
        }
        return b
    };
    h = b;
    var j = a.PluginBase,
        k = function(b, d, g) {
            j.call(this, b, d, g)
        };
    flexiciousNmsp.__extends(k, j);
    k.prototype.initialize = function() {
        j.prototype.initialize.call(this);
        this.horizontalPositions = /left|center|right/;
        this.verticalPositions = /top|center|bottom/;
        this.verticalDefault = this.horizontalDefault = "center";
        this.ui = new g
    };
    a.PositionBase = k;
    b = function(b, g, a) {
        j.call(this, b, g, a);
        this.basePosition = new d;
        this.target && (this.setDefaults(), this.options = new c, this.setOptions(a), this.initialize());
        return this.target
    };
    flexiciousNmsp.__extends(b, k);
    b.prototype.initialize = function() {
        k.prototype.initialize.call(this);
        this.setPlugin();
        this.setPlugin()
    };
    b.prototype.setDefaults = function() {
        this.collision || (this.collision = ["flip"]);
        this.offset || (this.offset = [0, 0]);
        this.targetWidth || (this.targetWidth = 0);
        this.targetHeight || (this.targetHeight = 0)
    };
    b.prototype.setPlugin = function(b) {
        b && this.setOptions(b);
        this.options.collision && (this.collision = this.options.collision.split(" "));
        if (this.options.offset) {
            b = this.options.offset.split(" ");
            this.offset = [];
            for (var d = 0; d < b.length; d++) this.offset.push(parseInt(b[d]));
            for (; 2 > this.offset.length;) this.offset.push(0)
        }
        this.setDimension();
        this.setPosition("my");
        this.setPosition("at");
        this.normalize();
        this.setBasePosition();
        for (d = this.target.length; d--;) {
            if (!("dataPosition" in this.target[d])) if (d == this.target.length - 1) {
                var g = this;
                this.target[d].dataPosition = function() {
                    g.setPlugin.apply(g, arguments)
                }
            } else this.target[d].dataPosition = function() {};
            this.processElement(this.target[d])
        }
    };
    b.prototype.normalize = function() {
        1 == this.collision.length && (this.collision[1] = this.collision[0]);
        this.offset[0] = this.parseIntFromString(this.offset[0]);
        1 == this.offset.length && (this.offset[1] = this.offset[0]);
        this.offset[1] = this.parseIntFromString(this.offset[1])
    };
    b.prototype.setDimension = function() {
        this.basePosition = new d;
        9 === this.options.of.nodeType ? (this.targetWidth = this.options.of.offsetWidth || document.body.parentNode.offsetWidth || 0, this.targetHeight = this.options.of.offsetHeight || document.body.parentNode.offsetHeight || 0) : "scrollTo" in this.options.of && this.options.of.document ? (this.targetWidth = this.options.of.offsetWidth || 0, this.targetHeight = this.options.of.offsetHeight || 0, this.basePosition.top = this.options.of.scrollTop || 0, this.basePosition.left = this.options.of.scrollLeft || 0) : "preventDefault" in this.options.of ? (this.options.at = "left top", this.targetHeight = this.targetWidth = 0, this.basePosition.top = this.options.of.pageY || this.options.of.clientY || 0, this.basePosition.left = this.options.of.pageX || this.options.of.clientX || 0) : (this.targetWidth = this.options.of.offsetWidth || 0, this.targetHeight = this.options.of.offsetHeight || 0, this.basePosition = this.ui.getOffset(this.options.of));
        if ((!(this.basePosition.left + this.basePosition.top) || !(this.targetWidth + this.targetHeight)) && "getBoundingClientRect" in this.options.of) {
            var b = this.options.of.getBoundingClientRect();
            this.basePosition.left + this.basePosition.top || (this.basePosition.left = parseInt(b.left + "", 10) || 0, this.basePosition.top = parseInt(b.top + "", 10) || 0);
            this.targetWidth + this.targetHeight || (this.targetWidth = parseInt(b.width + "", 10) || 0, this.targetHeight = parseInt(b.height + "", 10) || 0)
        }
    };
    b.prototype.setPosition = function(b) {
        var d = null,
            d = "string" == typeof this.options[b] ? (this.options[b] || "").split(" ") : this.options[b],
            d = 1 == d.length ? this.horizontalPositions.test(d[0]) ? d.concat([this.verticalDefault]) : this.verticalPositions.test(d[0]) ? [this.horizontalDefault].concat(d) : [this.horizontalDefault, this.verticalDefault] : d;
        d[0] = this.horizontalPositions.test(d[0]) ? d[0] : this.horizontalDefault;
        d[1] = this.verticalPositions.test(d[1]) ? d[1] : this.verticalDefault;
        this.options[b] = d
    };
    b.prototype.setBasePosition = function() {
        switch (this.options.at[0]) {
        case "right":
            this.basePosition.left += this.targetWidth;
            break;
        case this.horizontalDefault:
            this.basePosition.left += this.targetWidth / 2
        }
        switch (this.options.at[1]) {
        case "bottom":
            this.basePosition.top += this.targetHeight;
            break;
        case this.verticalDefault:
            this.basePosition.top += this.targetHeight / 2
        }
        this.basePosition.left += this.offset[0];
        this.basePosition.top += this.offset[1]
    };
    b.prototype.processElement = function(b) {
        var g = b.offsetWidth || 0,
            a = b.offsetHeight || 0,
            e = new d;
        e.left = this.basePosition.left;
        e.top = this.basePosition.top;
        switch (this.options.my[0]) {
        case "right":
            e.left -= g;
            break;
        case this.horizontalDefault:
            e.left -= g / 2
        }
        switch (this.options.my[1]) {
        case "bottom":
            e.top -= a;
            break;
        case this.verticalDefault:
            e.top -= a / 2
        }
        for (var f = ["left", "top"], g = {
            targetWidth: this.targetWidth,
            targetHeight: this.targetHeight,
            elemWidth: g,
            elemHeight: a,
            offset: this.offset,
            my: this.options.my,
            at: this.options.at
        }, a = f.length; a--;) {
            var c = f[a];
            this.ui.position[this.collision[a]] && (e = this.ui.position[this.collision[a]][c](e, g))
        }
        this.ui.bgiframe && this.ui.bgiframe.fire(b);
        e.using = this.options.using;
        this.ui.getOffset(b, e)
    };
    b.prototype.setOptions = function(b) {
        k.prototype.setOptions.call(this, b)
    };
    a.Position = b
})(flexiciousNmsp.position);
(function() {
    var a;
    a = function() {};
    a.TOP_LEVEL_FILTER = "TOP_LEVEL_FILTER";
    a.TEXT_HEIGHT_PADDING = 4;
    a.SCROLL_POLICY_OFF = "off";
    a.SCROLL_POLICY_ON = "on";
    a.SCROLL_POLICY_AUTO = "auto";
    a.SELECT_ALL_CHANGED = "selectAllChanged";
    a.SELECTED_KEYS_CHANGED = "selectedKeysChanged";
    a.FILTER_ABOVE_HEADER = "aboveHeader";
    a.FILTER_BELOW_HEADER = "belowHeader";
    a.CLICK_BEHAVIOR_HOVER_POPUP = "hoverPopup";
    a.CLICK_BEHAVIOR_CLICK_POPUP = "clickPopup";
    a.CLICK_BEHAVIOR_BOTH = "clickAndHoverPopup";
    a.CLICK_BEHAVIOR_NONE = "none";
    a.PERSIST_COLUMN_ORDER = "columnOrder";
    a.PERSIST_COLUMN_VISIBILITY = "columnVisibility";
    a.PERSIST_COLUMN_WIDTH = "columnWidth";
    a.PERSIST_FILTER = "filter";
    a.PERSIST_SORT = "sort";
    a.PERSIST_VERTICAL_SCROLL = "verticalScroll";
    a.PERSIST_HORIZONTAL_SCROLL = "horizontalScroll";
    a.PERSIST_FOOTER_FILTER_VISIBILITY = "footerFilterVisibility";
    a.PERSIST_PAGE_SIZE = "pageSize";
    a.PERSIST_PRINT_SETTINGS = "printSettings";
    a.MCS_LBL_TITLE_TEXT = "Multi Column Sort";
    a.MCS_LBL_HEADER_TEXT = "Please specify the sort order and direction of the columns you wish to sort by:";
    a.MCS_LBL_SORT_BY_TEXT = "Sort By: ";
    a.MCS_LBL_THEN_BY_TEXT = "Then By: ";
    a.MCS_LBL_CHOOSE_COLS = "Choose Columns: ";
    a.MCS_RBN_ASCENDING_LABEL = "Ascending";
    a.MCS_RBN_DESCENDING_LABEL = "Descending";
    a.MCS_BTN_CLEAR_ALL_LABEL = "Clear All";
    a.MCS_BTN_APPLY_LABEL = "Apply";
    a.MCS_BTN_CANCEL_LABEL = "Cancel";
    a.PGR_BTN_WORD_TOOLTIP = "Export to Word";
    a.PGR_BTN_EXCEL_TOOLTIP = "Export to Excel";
    a.PGR_BTN_PDF_TOOLTIP = "Print to PDF";
    a.PGR_BTN_PRINT_TOOLTIP = "Print";
    a.PGR_BTN_CLEAR_FILTER_TOOLTIP = "Clear Filter";
    a.PGR_BTN_RUN_FILTER_TOOLTIP = "Run Filter";
    a.PGR_BTN_FILTER_TOOLTIP = "Show/Hide Filter";
    a.PGR_BTN_FOOTER_TOOLTIP = "Show/Hide Footer";
    a.PGR_BTN_SAVE_PREFS_TOOLTIP = "Save Preferences";
    a.PGR_BTN_OPEN_PREFS_TOOLTIP = "Open Preferences";
    a.PGR_BTN_PREFERENCES_TOOLTIP = "Preferences";
    a.PGR_BTN_COLLAPSE_ALL_TOOLTIP = "Collapse All";
    a.PGR_BTN_SORT_TOOLTIP = "Sort";
    a.PGR_BTN_SETTINGS_TOOLTIP = "Settings";
    a.PGR_BTN_OPEN_SETTINGS_TOOLTIP = "Open Settings";
    a.PGR_BTN_SAVE_SETTINGS_TOOLTIP = "Save Settings";
    a.PGR_BTN_EXP_ALL_TOOLTIP = "Expand All";
    a.PGR_BTN_EXP_ONE_UP_TOOLTIP = "Expand One Level Up";
    a.PGR_BTN_EXP_ONE_DOWN_TOOLTIP = "Expand One Level Down";
    a.PGR_BTN_MCS_TOOLTIP = "Multiple Column Sort";
    a.PGR_BTN_FIRST_PAGE_TOOLTIP = "First Page";
    a.PGR_BTN_PREV_PAGE_TOOLTIP = "Previous Page";
    a.PGR_BTN_NEXT_PAGE_TOOLTIP = "Next Page";
    a.PGR_BTN_LAST_PAGE_TOOLTIP = "Last Page";
    a.PGR_LBL_GOTO_PAGE_TEXT = "Go to Page:";
    a.PGR_ITEMS = "Items";
    a.PGR_TO = "to";
    a.PGR_OF = "of";
    a.PGR_PAGE = "Page";
    a.SELECTED_RECORDS = "Selected Records";
    a.NONE_SELECTED = "None Selected";
    a.EXP_LBL_TITLE_TEXT = "Export Options";
    a.EXP_RBN_CURRENT_PAGE_LABEL = "Current Page";
    a.EXP_RBN_ALL_PAGES_LABEL = "All Pages";
    a.EXP_RBN_SELECT_PGS_LABEL = "Specify Pages";
    a.EXP_LBL_EXPORT_FORMAT_TEXT = "Export Format:";
    a.EXP_LBL_COLS_TO_EXPORT_TEXT = "Columns To Export:";
    a.EXP_BTN_EXPORT_LABEL = "Export";
    a.EXP_BTN_CANCEL_LABEL = "Cancel";
    a.PRT_LBL_TITLE_TEXT = "Print Options";
    a.PRT_LBL_PRT_OPTIONS_TEXT = "Print Options:";
    a.PRT_RBN_CURRENT_PAGE_LABEL = "Current Page";
    a.PRT_RBN_ALL_PAGES_LABEL = "All Pages";
    a.PRT_RBN_SELECT_PGS_LABEL = "Specify Pages";
    a.PRT_CB_PRVW_PRINT_LABEL = "Preview Before Print";
    a.PRT_LBL_COLS_TO_PRINT_TEXT = "Columns to Print:";
    a.PRT_BTN_PRINT_LABEL = "Print";
    a.PRT_BTN_CANCEL_LABEL = "Cancel";
    a.PPRV_LBL_PG_SIZE_TEXT = "Page Size:";
    a.PPRV_LBL_LAYOUT_TEXT = "Layout:";
    a.PPRV_LBL_COLS_TEXT = "Columns:";
    a.PPRV_CB_PAGE_HDR_LABEL = "Page Header";
    a.PPRV_CB_PAGE_FTR_LABEL = "Page Footer";
    a.PPRV_CB_RPT_HDR_LABEL = "Report Header";
    a.PPRV_CB_RPT_FTR_LABEL = "Report Footer";
    a.PPRV_BTN_PRT_LABEL = "Print";
    a.PPRV_BTN_CANCEL_LABEL = "Cancel";
    a.PPRV_LBL_SETTINGS_1_TEXT = "Note: Changing Page Size or Layout will only update the Preview, not the actual Print.";
    a.PPRV_LBL_SETTINGS_2_TEXT = "Please set the Page Size/Layout on Printer Settings via the Print Dialog Box that will be shown when you print.";
    a.PPRV_BTN_PRT_1_LABEL = "Print";
    a.PPRV_BTN_CANCEL_1_LABEL = "Cancel";
    a.PPRV_LBL_TITLE_TEXT = "Print Preview";
    a.SAVE_SETTINGS_TITLE = "The preferences you specify below will be retained when this grid is loaded in the future:";
    a.SAVE_SETTINGS_PREFERENCE_NAME = "Preference Name:";
    a.SAVE_SETTINGS_ORDER_OF_COLUMNS = "Order of Columns";
    a.SAVE_SETTINGS_VISIBILITY_OF_COLUMNS = "Visibility of Columns";
    a.SAVE_SETTINGS_WIDTHS_OF_COLUMNS = "Widths of Columns";
    a.SAVE_SETTINGS_FILTER_CRITERIA = "Filter Criteria";
    a.SAVE_SETTINGS_SORT_SETTINGS = "Sort Settings";
    a.SAVE_SETTINGS_SCROLL_POSITIONS = "Scroll Positions";
    a.SAVE_SETTINGS_FILTER_AND_FOOTER_VISIBILITY = "Filter & Footer Visiblity";
    a.SAVE_SETTINGS_RECORDS_PER_PAGE = "Records Per Page";
    a.SAVE_SETTINGS_PRINT_SETTINGS = "Print Settings";
    a.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES = "Remove All Saved Preferences";
    a.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES = "Clear Saved Preferences";
    a.SAVE_SETTINGS_SAVE_PREFERENCES = "Save Preferences";
    a.SAVE_SETTINGS_CANCEL = "Cancel";
    a.SETTINGS_COLUMNS_TO_SHOW = "Columns To Show";
    a.SETTINGS_SHOW_FOOTERS = "Show Footers";
    a.SETTINGS_SHOW_FILTER = "Show Filter";
    a.SETTINGS_RECORDS_PER_PAGE = "Records Per Page";
    a.SETTINGS_APPLY = "Apply";
    a.SETTINGS_CANCEL = "Cancel";
    a.OPEN_SETTINGS_DEFAULT = "Default?";
    a.OPEN_SETTINGS_PREFERENCE_NAME = "Preference Name";
    a.OPEN_SETTINGS_DELETE = "Delete";
    a.OPEN_SETTINGS_APPLY = "Apply";
    a.OPEN_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES = "Remove All Saved Preferences";
    a.OPEN_SETTINGS_SAVE_CHANGES = "Save Changes";
    a.OPEN_SETTINGS_CLOSE = "Close";
    a.SETTINGS_POPUP_TITLE = "Settings:";
    a.SAVE_SETTINGS_POPUP_TITLE = "Save Settings:";
    a.OPEN_SETTINGS_POPUP_TITLE = "Manage Settings:";
    a.EXPORT_OPTIONS_TITLE = "Export Options";
    a.PRINT_OPTIONS_TITLE = "Print Options";
    a.CELL_POSITION_ABOVE = "above";
    a.CELL_POSITION_BELOW = "below";
    a.CELL_POSITION_BELOW_FIRST = "belowFirst";
    a.CELL_POSITION_ABOVE_LAST = "aboveFirst";
    a.CELL_POSITION_LEFT = "left";
    a.CELL_POSITION_RIGHT = "right";
    a.EVENT_RESIZE = "resize";
    a.EVENT_MOUSE_CLICK = "click";
    a.EVENT_MOUSE_OVER = "mouseover";
    a.EVENT_MOUSE_OUT = "mouseout";
    a.EVENT_CREATION_COMPLETE = "creationComplete";
    a.EVENT_MOUSE_WHEEL = "mousewheel";
    a.EVENT_SCROLL = "scroll";
    a.EVENT_TIMER = "timer";
    a.EVENT_TIMER_COMPLETE = "timer_complete";
    a.EVENT_DRAG_ENTER = "drag_enter";
    a.EVENT_DRAG_DROP = "drag_drop";
    a.EVENT_DRAG_COMPLETE = "drag_complete";
    a.EVENT_CLOSE = "close";
    a.EVENT_FOCUS_IN = "focusin";
    a.EVENT_FOCUS_OUT = "blur";
    a.EVENT_KEY_UP = "keyup";
    a.EVENT_CLICK = "click";
    a.EVENT_LOAD = "load";
    a.EVENT_DOUBLE_CLICK = "dblclick";
    a.EVENT_MOUSE_MOVE = "mousemove";
    a.EVENT_MOUSE_DOWN = "mousedown";
    a.EVENT_MOUSE_UP = "mouseup";
    a.EVENT_MOVE = "move";
    a.EVENT_VALUE_COMMIT = "blur";
    a.EVENT_KEY_DOWN = "keydown";
    a.EVENT_FOCUS_CHANGE = "blur";
    a.EVENT_CHANGE = "change";
    a.STATE_CHECKED = "checked";
    a.CHECK_BOX_STATE_UNCHECKED = "unchecked";
    a.STATE_MIDDLE = "middle";
    a.KEYBOARD_LEFT = 37;
    a.KEYBOARD_UP = 38;
    a.KEYBOARD_RIGHT = 39;
    a.KEYBOARD_DOWN = 40;
    a.KEYBOARD_NUMPAD_MULTIPLY = 106;
    a.KEYBOARD_NUMPAD_DIVIDE = 111;
    a.KEYBOARD_NUMPAD_SUBTRACT = 109;
    a.KEYBOARD_NUMPAD_ADD = 107;
    a.KEYBOARD_TAB = 9;
    a.KEYBOARD_PAGE_DOWN = 34;
    a.KEYBOARD_PAGE_UP = 33;
    a.KEYBOARD_HOME = 36;
    a.KEYBOARD_END = 35;
    a.KEYBOARD_F2 = 113;
    a.KEYBOARD_SPACE = 32;
    a.KEYBOARD_ESCAPE = 27;
    a.KEYBOARD_ENTER = 13;
    a.KEYBOARD_DELETE = 46;
    a.KEYBOARD_BACKSPACE = 8;
    a.MOVE_TOP = "moveTop";
    a.MOVE_UP = "moveUp";
    a.MOVE_DOWN = "moveDown";
    a.MOVE_BOTTOM = "moveBottom";
    a.SELECTION_MODE_SINGLE_ROW = "singleRow";
    a.SELECTION_MODE_MULTIPLE_ROWS = "multipleRows";
    a.SELECTION_MODE_SINGLE_CELL = "singleCell";
    a.SELECTION_MODE_MULTIPLE_CELLS = "multipleCells";
    a.SELECTION_MODE_NONE = "none";
    a.TEMPLATE_HEADER_CELL = "TEMPLATE_HEADER_CELL";
    a.TEMPLATE_ICON_CELL = "TEMPLATE_ICON_CELL";
    a.TEMPLATE_ICON_CELL = "TEMPLATE_ICON_CELL";
    a.TEMPLATE_BODY_CELL = "TEMPLATE_BODY_CELL";
    a.TEMPLATE_FILTER_CELL = "TEMPLATE_FILTER_CELL";
    a.TEMPLATE_FOOTER_CELL = "TEMPLATE_FOOTER_CELL";
    a.TEMPLATE_PAGER_CELL = "TEMPLATE_PAGER_CELL";
    a.TEMPLATE_LEVEL_RENDERER_CELL = "TEMPLATE_LEVEL_RENDERER_CELL";
    a.TEMPLATE_EXPAND_COLLAPSE_CELL = "TEMPLATE_EXPAND_COLLAPSE_CELL";
    a.TEMPLATE_PADDING_CELL = "TEMPLATE_PADDING_CELL";
    a.TEMPLATE_FILL_CELL = "TEMPLATE_FILL_CELL";
    a.TEMPLATE_GRID = "TEMPLATE_GRID";
    a.ALERT_YES = 1;
    a.ALERT_NO = 2;
    a.ALERT_OK = 4;
    a.ALERT_CANCEL = 8;
    a.TEMPLATE_PAGER_CONTROL = "TEMPLATE_PAGER_CONTROL";
    a.IMAGE_PATH = WSSO_URL + "/pegasus/portalcss/treegrid/images/";
    a.VERTICAL_SCROLLBAR_WIDTH = 19;
    a.HORIZONTAL_SCROLLBAR_HEIGHT = 19;
    a.DEFAULT_DATE_FORMAT = "M-dd-yy";
    a.SHORT_DATE_MASK = "mm/dd/yy";
    a.YMD_MASK = "yy-m-d";
    a.MEDIUM_DATE_MASK = "M dd, yy";
    a.LONG_DATE_MASK = "MM D, yy";
    a.FULL_DATE_MASK = "EEEE, MMMM D, YYYY";
    a.SHORT_TIME_MASK = "L:NN A";
    a.MEDIUM_TIME_MASK = "L:NN:SS A";
    a.LONG_TIME_MASK = a.MEDIUM_TIME_MASK + " TZD";
    a.DEFAULT_ALL_ITEM_TEXT = "All";
    /Firefox/i.test(navigator.userAgent) && (a.EVENT_MOUSE_WHEEL = "DOMMouseScroll");
    flexiciousNmsp.Constants = a
})();
(function() {
    var a = function() {
            this.typeCache = {};
            this.constructed && this.constructed()
        };
    a.prototype.constructed = function() {};
    a.prototype.typeName = a.typeName = "TypedObject";
    a.prototype.implementsOrExtends = function(a) {
        if (void 0 != this.typeCache[a]) return this.typeCache[a];
        var d, b, g;
        g = this.getClassNames();
        for (d = 0; d < g.length; d += 1) if (b = g[d], b === a) return this.typeCache[a] = !0;
        return this.typeCache[a] = !1
    };
    a.prototype.getClassNames = function() {
        return ["TypedObject"]
    };
    flexiciousNmsp.TypedObject = a
})();
(function() {
    var a;
    a = function(a, d, b) {
        flexiciousNmsp.TypedObject.apply(this);
        this.type = a;
        this.bubbles = d;
        this.cancelable = b;
        this.defaultPrevented = !1
    };
    flexiciousNmsp.BaseEvent = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "BaseEvent";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.prototype.isDefaultPrevented = function() {
        return this.defaultPrevented
    };
    a.prototype.preventDefault = function() {
        this.defaultPrevented = !0;
        this.triggerEvent && this.triggerEvent != this && this.triggerEvent.preventDefault()
    };
    a.prototype.stopPropagation = function() {
        this.triggerEvent && this.triggerEvent != this && this.triggerEvent.stopPropagation()
    }
})();
(function() {
    var a;
    a = function(a, d, b, g, f, e, h, j, k) {
        "undefined" === typeof d && (d = null);
        "undefined" === typeof b && (b = null);
        flexiciousNmsp.BaseEvent.apply(this, [a, j, k]);
        this.grid = d;
        this.level = b;
        this.column = g;
        this.cell = f;
        this.item = e;
        this.triggerEvent = h
    };
    flexiciousNmsp.FlexDataGridEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "FlexDataGridEvent";
    a.prototype.getClassNames = function() {
        return ["BaseEvent", this.typeName]
    };
    a.CHANGE = "change";
    a.AUTO_REFRESH = "autoRefresh";
    a.DATA_PROVIDER_CHANGE = "dataProviderChange";
    a.COLUMNS_RESIZED = "columnsResized";
    a.COLUMNS_SHIFT = "columnsShift";
    a.COMPONENTS_CREATED = "componentsCreated";
    a.COLUMN_RESIZED = "columnResized";
    a.COLUMN_X_CHANGED = "columnXChanged";
    a.HEADER_CLICKED = "headerClicked";
    a.SELECT_ALL_CHECKBOX_CHANGED = "selectAllCheckBoxChanged";
    a.SELECT_CHECKBOX_CHANGED = "selectCheckBoxChanged";
    a.ITEM_OPEN = "itemOpen";
    a.ITEM_OPENING = "itemOpening";
    a.ITEM_CLOSE = "itemClose";
    a.ITEM_CLOSING = "itemClosing";
    a.ITEM_EDIT_CANCEL = "itemEditCancel";
    a.ITEM_EDIT_VALUE_COMMIT = "itemEditValueCommit";
    a.ITEM_EDIT_END = "itemEditEnd";
    a.ITEM_EDIT_BEGINNING = "itemEditBeginning";
    a.ITEM_EDIT_BEGIN = "itemEditBegin";
    a.ITEM_EDITOR_CREATED = "itemEditorCreated";
    a.ITEM_FOCUS_IN = "itemFocusIn";
    a.ITEM_ROLL_OVER = "itemRollOver";
    a.ITEM_ROLL_OUT = "itemRollOut";
    a.ITEM_CLICK = "itemClick";
    a.ITEM_RIGHT_CLICK = "itemRightClick";
    a.ITEM_DOUBLE_CLICK = "itemDoubleClick";
    a.DYNAMIC_LEVEL_CREATED = "dynamicLevelCreated";
    a.DYNAMIC_ALL_LEVELS_CREATED = "dynamicAllLevelsCreated";
    a.ICON_MOUSE_OVER = "iconMouseOver";
    a.ICON_CLICK = "iconClick";
    a.ICON_MOUSE_OUT = "iconMouseOut";
    a.PREBUILT_FILTER_RUN = "prebuiltFilterRun";
    a.RENDERER_INITIALIZED = "rendererInitialized";
    a.CELL_RENDERED = "cellRendered";
    a.CELL_CREATED = "cellCreated";
    a.COLUMN_STRETCH = "columnStretch";
    a.PLACING_SECTIONS = "placingSections"
})();
(function() {
    var a;
    a = function(a, d, b, g, f) {
        this.printGrid = this.grid = null;
        flexiciousNmsp.BaseEvent.apply(this, [es, f]);
        this.grid = d;
        this.printGrid = b
    };
    flexiciousNmsp.FlexDataGridPrintEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "FlexDataGridPrintEvent";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridPrintEvent", "Event"]
    };
    a.BEFORE_PRINT = "beforePrint";
    a.BEFORE_PRINT_PROVIDER_SET = "beforePrintProviderSet";
    a.AFTER_PRINT = "printComplete"
})(window);
(function() {
    var a;
    a = function() {};
    flexiciousNmsp.JQueryAdapter = a;
    a.prototype.typeName = a.typeName = "JQueryAdapter";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.prototype.setHtml = function(a, d) {
        $(a).html(d)
    };
    a.prototype.getElementByClassName = function(a, d) {
        return $(a).find("." + d)[0]
    };
    a.prototype.addChild = function(a, d) {
        return $(a).append(d)
    };
    a.prototype.insertBefore = function(a, d) {
        return $(a).insertBefore(d)
    };
    a.prototype.removeChild = function(a, d) {
        return $(d).remove()
    };
    a.prototype.findElementWithClassName = function(a, d) {
        return $(a).find("." + d).toArray()[0]
    };
    a.prototype.findElementsWithClassName = function(a, d) {
        return $(a).find("." + d).toArray()
    };
    a.prototype.findFirstElementByTagName = function(a, d) {
        return $(a).find(">" + d).toArray()[0]
    };
    a.prototype.ieVersion = -1;
    a.prototype.isIE = function() {
        a.prototype.ieVersion = -1;
        var c = navigator.userAgent.toLowerCase();
        a.prototype.ieVersion = -1 != c.indexOf("trident") ? 11 : -1 != c.indexOf("msie") ? parseInt(c.split("msie")[1]) : 0;
        11 == a.prototype.ieVersion && (a.ieVersion = 11);
        return a.prototype.ieVersion
    };
    a.prototype.isMoz = function() {
        return $.browser ? $.browser.mozilla : -1 < navigator.userAgent.toLowerCase().indexOf("firefox")
    };
    a.prototype.isWebKit = function() {
        return $.browser ? $.browser.webkit : "WebkitAppearance" in document.documentElement.style
    };
    a.prototype.setupAutoComplete = function(a, d) {
        d.autoCompleteSource && (d.source = d.autoCompleteSource);
        $(a).autocomplete(d)
    };
    a.prototype.setupInputMask = function(a, d) {
        d.inputMask && (d.mask = d.inputMask);
        $(a).mask(d.mask, d)
    };
    a.prototype.setupWaterMark = function(a, d) {
        d.watermark && (d.watermark = d.watermark);
        d.watermarkStyle && (d.watermarkStyle = d.watermarkStyle);
        $(a).Watermark(d.watermark, d.watermarkStyle)
    };
    a.prototype.offset = function(a) {
        return $(a).offset()
    };
    a.prototype.showDialog = function(a, d, b, g, f, e) {
        $(a).dialog({
            modal: b,
            minHeight: f + 50,
            minWidth: g,
            zIndex: 700,
            title: e,
            close: function() {
                $(this).remove()
            }
        })
    };
    a.prototype.setDialogTitle = function(a, d) {
        this.findElementWithClassName(a.parentNode, "ui-dialog-title").innerHTML = d
    };
    a.prototype.removeDialog = function(a) {
        $(a).remove()
    };
    a.prototype.buildUl = function(a) {
        for (var d = "<ul>", b = 0; b < a.length; b++) d += "<li class='flexiciousSortPopupMenuItem' > <a class='" + ("separator" == a[b].type ? "separator" : "") + "' href='#' uniqueidentifier='" + a[b].data + "'>" + a[b].label + "</a>", a[b].children && 0 < a[b].children.length && (d += this.buildUl(a[b].children)), d += "</li>";
        return d + "</ul>"
    };
    a.prototype.createMenu = function(a, d, b) {
        $(d).flxsmenu({
            content: this.buildUl(a),
            flyOut: !0,
            onMenuItemClick: b
        })
    };
    a.prototype.destroyMenu = function(a) {
        $(a).remove()
    };
    a.prototype.createDateTimePickerEditor = function(a, d, b) {
        this.createDateTimePicker(a.getTextBox(), d, b)
    };
    a.prototype.createDateTimePicker = function(a, d, b) {
        a.domElement && (a = a.getTextBox());
        $(a).datepicker({
            dateFormat: d,
            showButtonPanel: !0,
            showOn: "both",
            buttonImageOnly: !0,
            changeYear: !0,
            defaultDate: b,
            buttonImage: flexiciousNmsp.Constants.IMAGE_PATH + "/date_picker.png"
        });
        b && d && $(a).datepicker("setDate", b);
        $("ui-datepicker-div").focus()
    };
    a.prototype.getCurrentDatePicker = function() {
        return $("ui-datepicker-div")
    };
    a.prototype.getDateValue = function(a, d) {
        return $.datepicker.parseDate(d, a)
    };
    a.prototype.formatDate = function(a, d) {
        return $.datepicker.formatDate(d, a)
    };
    a.prototype.isDatePickerElement = function(a) {
        return "OPTION" == a.tagName ? !0 : (a = this.findAncestorByClassName(a, "ui-datepicker")) ? a : !1
    };
    a.prototype.setText = function(a, d) {
        return $(a).text(d)
    };
    a.prototype.setHtml = function(a, d) {
        return $(a).html(d)
    };
    a.prototype.findAncestorByClassName = function(a, d) {
        return $(a).closest("." + d)[0]
    };
    a.prototype.showTooltip = function(a, d, b, g, f, e, h, j, k, l) {
        $(d.domElement || d).position({
            my: "right top",
            at: j + " bottom",
            of: $(a.domElement || a),
            collision: "fit",
            within: $(l.domElement || l)
        })
    };
    a.prototype.positionComponent = function(a, d, b, g, f, e) {
        b || (b = "left top");
        g || (g = "left bottom");
        $(d.domElement || d).position({
            my: b,
            at: g,
            of: $(a.domElement || a),
            collision: "fit",
            offset: f || e ? f + " " + e : null
        })
    };
    a.prototype.stringToJson = function(a) {
        return jQuery.parseJSON(a)
    };
    a.prototype.ajaxGet = function(a, d) {
        $.ajax({
            url: a,
            success: d,
            dataType: "html"
        })
    };
    a.prototype.showToaster = function(a, d, b, g, f, e) {
        e = e || 5E3;
        f = f || 1E3;
        d = {};
        flexiciousNmsp.UIUtils.mergeObjects(d, $.ui.toaster.defaults);
        flexiciousNmsp.UIUtils.mergeObjects(d, {
            timeout: e / 1E3,
            position: "tr",
            speed: f / 1E3
        });
        $("<div><p>" + a + "</p><div>").toaster(d)
    };
    a.toastCount = 0;
    flexiciousNmsp.JQueryAdapter = a
})();
(function() {
    var a;
    a = function() {
        flexiciousNmsp.TypedObject.apply(this);
        this.eventListeners = []
    };
    flexiciousNmsp.EventDispatcher = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "EventDispatcher";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.prototype.addEventListener = function(a, d, b) {
    	//console.log(d);
        "undefined" === typeof this.eventListeners[d] && (this.eventListeners[d] = []);
        this.eventListeners[d].push([b, a])
    };
    a.prototype.removeEventListener = function(a, d) {
        var b, g;
        if (this.eventListeners[a] instanceof Array) {
            g = this.eventListeners[a];
            for (b = 0; b < g.length; b += 1) {
                if (g[b][0] === d) {
                    g.splice(b, 1);
                    break
                }    
            }            
        }
    };
    a.prototype.hasEventListener = function(a) {
        return this.eventListeners[a] instanceof Array ? (a = this.eventListeners[a]) && 0 < a.length : !1
    };
    a.prototype.dispatchEvent = function(a) {
        var d = 0,
            b;
        "string" === typeof a && (a = {
            type: a
        });
        a.target || (a.target = this);
        a.currentTarget = this;
        if (!a.type) throw Error("Event object missing 'type' property.");
        if (this.eventListeners[a.type] instanceof Array) {
            b = this.eventListeners[a.type];
            for (d = 0; d < b.length; d += 1) b[d][0].call("undefined" === typeof b[d][1] ? this : b[d][1], a)
        }
        return !0
    };
    a.prototype.kill = function() {
        this.eventListeners = [];
        this.dead = !0
    };
    a.prototype.killArray = function(a) {
        var d, b;
        for (d = 0; d < a.length; d += 1) b = a[d], b.kill()
    };
    a.prototype.getStyle = function(a) {
        return this[a]
    };
    a.prototype.setStyle = function(a, d) {
        this[a] = d
    }
})();
(function() {
    var a;
    a = function(a, d, b) {
        flexiciousNmsp.TypedObject.apply(this);
        this.classConstruct = a;
        this.properties = d;
        this.passPropertiesToConstructor = b
    };
    flexiciousNmsp.ClassFactory = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ClassFactory";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.prototype.newInstance = function() {
        var a;
        if (this.passPropertiesToConstructor) a = new this.classConstruct(this.properties);
        else if (a = new this.classConstruct, this.properties) for (var d in this.properties) a[d] = this.properties[d];
        return a
    }
})();
(function() {
    function a(d) {
        d = new flexiciousNmsp.DateRange(d);
        return [d.startDate, d.endDate]
    }
    var c = function() {
            flexiciousNmsp.TypedObject.apply(this)
        };
    flexiciousNmsp.UIUtils = c;
    c.adapter = flexiciousNmsp.JQueryAdapter ? new flexiciousNmsp.JQueryAdapter : flexiciousNmsp.DojoAdapter ? new flexiciousNmsp.DojoAdapter : new flexiciousNmsp.ExtAdapter;
    c.prototype = new flexiciousNmsp.TypedObject;
    c.prototype.getClassNames = function() {
        return ["TypedObject", "UIUtils"]
    };
    c.getObjectProperty = function(d, b) {
        if (d) {
            if (b) {
                for (var a = b.split("."), f = d, e = d, c = 0; c < a.length; c++) if (f = e[a[c]]) e = f;
                else return null;
                return f
            }
            return d
        }
        return null
    };
    c.labelObjectProperty = function(d, b) {
        var a = c.getObjectProperty(d, b.getDataField());
        return null != a ? String(a) : ""
    };
    c.concatenateList = function(d, b, a) {
        "undefined" == typeof a && (a = ", ");
        var f = "";
        if (d) for (var e = 0; e < d.length; e++) {
            var h = c.getObjectProperty(d[e], b);
            h && (f += 0 < f.length ? a + h : h)
        }
        return f
    };
    c.labelObjectPropertyList = function(d, b) {
        if (b.getDataField()) {
            var a = b.getDataField().split("/"),
                f = a[1],
                e = 2 < a.length ? a[2] : null;
            return c.concatenateList(c.getObjectProperty(d, a[0]), f, e)
        }
        return ""
    };
    c.dataGridFormatYesNoLabelFunction = function(d, b) {
        var a = c.resolveExpression(d, b.getDataField());
        return c.formatBoolean(a)
    };
    c.dataGridFormatDateLabelFunction = function(d, b) {
        var a = c.resolveExpression(d, b.getDataField());
        return (a = "string" == typeof a ? new Date(Date.parse(a.toString())) : a) ? c.formatDate(a) : null
    };
    c.dataGridFormatCurrencyLabelFunction = function(d, b) {
        var a = c.resolveExpression(d, b.getDataField()),
            a = "string" == typeof a ? parseFloat(a.toString()) : a;
        return isNaN(a) ? "" : c.formatCurrency(a, " ")
    };
    c.formatBoolean = function(d) {
        return d ? "Yes" : "No"
    };
    c.formatDate = function(d, b) {
        "undefined" == typeof b && (b = flexiciousNmsp.Constants.DEFAULT_DATE_FORMAT);
        var a = new flexiciousNmsp.DateFormatter;
        a.formatString = b;
        return a.format(d)
    };
    c.formatCurrency = function(d, b) {
        "undefined" == typeof b && (b = "");
        var a = new flexiciousNmsp.CurrencyFormatter;
        a.currencySymbol = b;
        return a.format(d)
    };
    c.addPopUp = function(d, b, a, f, e) {
        c.addChild(b, d);
        c.adapter.showDialog(d.domElement, b, a, d.getWidth(), d.getHeight(), e)
    };
    c.getDomElementIndex = function(d, b) {
        for (var a = 0; a < d.children.length; a++) if (d.children[a] == b) return a;
        return -1
    };
    c.isPrimitive = function(d) {
        var b = typeof d;
        return "boolean" == b || "number" == b || "string" == b || d instanceof Date || "function" == b
    };
    c.ensureWithinView = function(d, b) {
        d.y + d.height > b.height && (d.y -= d.height);
        d.getX() + d.width > b.width && d.setX(popuup.getX() - d.getWidth())
    };
    c.removePopUp = function(d) {
        c.adapter.removeDialog(d.domElement ? d.domElement : d)
    };
    c.average = function(d, b) {
        "undefined" == typeof b && (b = "");
        return d && 0 < c.getLength(d) ? c.sum(d, b) / c.getLength(d) : 0
    };
    c.getLength = function(d) {
        return !d ? 0 : d.length
    };
    c.sum = function(d, b) {
        "undefined" == typeof b && (b = "");
        for (var a = 0, f = 0; f < d.length; f++) {
            var e = parseFloat(c.toString(c.resolveExpression(d[f], b)));
            isNaN(e) || (a += e)
        }
        return a
    };
    c.min = function(d, b, a) {
        "undefined" == typeof b && (b = "");
        "undefined" == typeof a && (a = "auto");
        for (var f, e = 0; e < d.length; e++) {
            var h = flexiciousNmsp.FilterExpression.convert(a, c.resolveExpression(d[e], b));
            if (null != h && (h < f || !f)) f = h
        }
        return f
    };
    c.max = function(d, b, a) {
        "undefined" == typeof b && (b = "");
        "undefined" == typeof a && (a = "auto");
        for (var f, e = 0; e < d.length; e++) {
            var h = flexiciousNmsp.FilterExpression.convert(a, c.resolveExpression(d[e], b));
            if (null != h && (h > f || !f)) f = h
        }
        return f
    };
    c.pasteToClipBoard = function(d) {
        window.prompt("Press the Ctrl+C key to copy to Clipboard", d)
    };
    c.isStringNumeric = function(d) {
        if ("" == d) return !1;
        for (var b = 0; b < d.length; b++) {
            var a = d.charAt(b);
            if (("0" > a || "9" < a) && "." != a && "-" != a) return !1
        }
        return !0
    };
    c.showConfirm = function() {
        alert("Not implemented = showConfirm")
    };
    c.showError = function(d, b) {
        "undefined" == typeof b && (b = "Error Occurred");
        c.showToaster(d, b, "error")
    };
    c.showMessage = function(d, b) {
        c.showToaster(d, b)
    };
    c.traceData = function(d) {
        Console.log(d)
    };
    c.handleError = function(d) {
        c.showError("Error occurred : " + d.toString(), "Error occured")
    };
    c.removeFromArray = function(d, b) {
        for (var a = 0, f = -1, e = 0; e < d.length; e++) {
            if (d[e] == b) {
                f = a;
                break
            }
            a++
        }
        0 <= f && d.splice(f, 1);
        return d
    };
    c.doesArrayContainValue = function(a, b, g) {
        for (var f = 0; f < a.length; f++) {
            var e = a[f];
            if (e.hasOwnProperty(b) && null != e[b] && e[b].toString().toLocaleLowerCase() == g.toLowerCase()) return e
        }
        return null
    };
    c.doesArrayContainStringValue = function(a, b) {
        for (var g = 0; g < a.length; g++) {
            var f = a[g];
            if (f.toString().toLocaleLowerCase() == b.toLowerCase()) return f
        }
        return null
    };
    c.doesArrayContainObjectValue = function(a, b, g) {
        for (var f = 0; f < a.length; f++) {
            var e = a[f];
            if (null != e[b] && e[b] == g) return e
        }
        return null
    };
    c.openBrowserPopup = function(a, b) {
        "undefined" == typeof b && (b = "width=800,height=600,left=0,top=0,toolbar=No,location=No,scrollbars=Yes,status=No,resizable=No,fullscreen=No");
        return window.open(a, "", b)
    };
    c.areArraysEqual = function(a, b) {
        if (!(null == a && null == b)) if (null != a && null != b) {
            if (a.length != b.length) return !1;
            for (var g = 0; g < a.length; g++) if (a[g] != b[g]) return !1
        } else return !1;
        return !0
    };
    c.createRenderer = function(a, b) {
        var g = eval(a),
            f;
        for (f in b) g[f] = b[f]
    };
    c.getTopLevelApplication = function() {
        return window.document.body
    };
    c.addChild = function(a, b, g) {
        var f, e;
        "function" == typeof a.implementsOrExtends && a.implementsOrExtends("UIComponent") && (f = a, a = a.domElement);
        "function" == typeof b.implementsOrExtends && b.implementsOrExtends("UIComponent") && (e = b, b.invalidateDisplayList(), b = b.domElement);
        f && e && (f.children.push(e), e.parent = f);
        g ? a.insertBefore(b, g) : a.appendChild(b)
    };
    c.removeChild = function(a, b) {
        var g, f;
        "function" == typeof a.implementsOrExtends && a.implementsOrExtends("UIComponent") && (g = a, a = a.domElement);
        "function" == typeof b.implementsOrExtends && b.implementsOrExtends("UIComponent") && (f = b, b = b.domElement);
        g && f && (g.children.splice(g.children.indexOf(f), 1), f.parent = null);
        c.adapter.removeChild(a, b)
    };
    c.extractPropertyValues = function(a, b) {
        for (var g = [], f = 0; f < a.length; f++) {
            var e = a[f];
            e && g.push(c.checkGetterAndRetrieve(e, b))
        }
        return g
    };
    c.toString = function(a) {
        return a ? a.toString() : ""
    };
    c.toPersistenceString = function(a) {
        var b = "";
        if (a.getClassNames && "ArrayCollection" == a.getClassNames() || a instanceof Array) for (var b = b + (a.getClassNames && "ArrayCollection" == a.getClassNames() ? "ac+=" : "ar+="), g = 0; g < a.length; g++) b += a[g].toString() + "+=";
        else "boolean" == typeof a ? b = b + "b+=" + (a ? "y" : "n") : "string" == typeof a ? (b += "s+=", b += a) : "function" == typeof a.getTime ? (b += "d+=", b += a.getTime().toString()) : "number" == typeof a && (b += "n+=", b += a.toString());
        return b
    };
    c.fromPersistenceString = function(a) {
        var b, g = a.split("+=");
        if ("ac" == g[0] || "ar" == g[0]) {
            b = [];
            for (var f = 0, e = 0; e < g.length; e++) {
                var c = g[e];
                0 != f && (null != c && 0 < c.length) && (a.getClassNames && a.getClassNames(), b.push(c));
                f++
            }
        } else {
            if ("b" == g[0]) return "y" == g[1] ? !0 : !1;
            if ("s" == g[0]) return g[1] ? g[1].toString() : "";
            if ("d" == g[0]) return Date.parse(g[1].toString());
            if ("n" == g[0]) return parseFloat(g[1].toString())
        }
        return b
    };
    c.createDateFilter = function(d, b, g, f, e) {
        "undefined" == typeof f && (f = null);
        "undefined" == typeof e && (e = null);
        var c = new flexiciousNmsp.Filter;
        c.filterDescrption = d;
        c.setFilterExpressions([{
            columnName: b,
            filterOperation: flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_BETWEEN,
            filterControlValue: g != flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM ? g : "Custom__" + f.toString() + "__" + e.toString(),
            expression: g != flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM ? a(g) : [f, e]
        }]);
        return c
    };
    c.createListFilter = function(a, b, g) {
        var f = new flexiciousNmsp.Filter;
        f.filterDescrption = a;
        f.setFilterExpressions([{
            columnName: b,
            filterOperation: 1 < g.length ? flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_IN_LIST : flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_EQUALS,
            filterControlValue: g,
            expression: g
        }]);
        return f
    };
    c.getGroupForColumn = function(a, b) {
        if (!a.hasOwnProperty("groupedColumns")) return null;
        for (var g = a.getGroupedColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            if (e.hasOwnProperty("children") && c.isChildRecursive(e, b)) return e
        }
        return null
    };
    c.isChildRecursive = function(a, b) {
        for (var g = !1, f = 0; f < a.children.length; f++) if (g = a.children[f], g.hasOwnProperty("children")) {
            if (g = c.isChildRecursive(g, b)) return !0
        } else if (g == b) return !0;
        return !1
    };
    c.emptyIfNull = function(a) {
        return !a ? "" : a.toString()
    };
    c.capitalizeFirstLetterIfPrefixCache = {};
    c.capitalizeFirstLetterIfPrefix = function(a, b) {
        c.capitalizeFirstLetterIfPrefixCache[a + b] || (c.capitalizeFirstLetterIfPrefixCache[a + b] = 0 < (a && a.length) ? c.doCap(b) : b);
        return c.capitalizeFirstLetterIfPrefixCache[a + b]
    };
    c.doCap = function(a) {
        return a.substr(0, 1).toUpperCase() + a.substr(1)
    };
    c.doLower = function(a) {
        return a.substr(0, 1).toLowerCase() + a.substr(1)
    };
    c.getStyleValue = function(a, b) {
        return a.getColumn() ? a.getColumn().getStyleValue(b) : a.level.getStyleValue(b)
    };
    c.getMouseWheelDelta = function(a) {
        a || (a = window.event);
        return a.wheelDelta ? a.wheelDelta : 0 < a.detail ? 5 : -5
    };
    c.removeAllChildren = function(a) {
        a.innerHTML = ""
    };
    c.expressionCache = {};
    c.resolveExpression = function(a, b, g, f, e, h) {
        "undefined" == typeof g && (g = null);
        "undefined" == typeof f && (f = !1);
        "undefined" == typeof e && (e = !1);
        if (null == b || "" == b) return a;
        c.expressionCache[b] || (c.expressionCache[b] = {}, c.expressionCache[b].isSimple = -1 == b.indexOf(".") && -1 == b.indexOf("["));
        if (c.expressionCache[b].isSimple) {
            if (null != g || e) h ? h.checkSetterAndApply(a, b, g) : a[b] = g;
            return (g = c.checkGetterAndRetrieve(a, b)) ? g : f ? void 0 : null
        }
        b = b.split(".");
        for (e = e = 0; e < b.length; e++) if (h = b[e], -1 != h.indexOf("[")) {
            var j = h.substring(h.indexOf("[") + 1, h.indexOf("]"));
            a = a[h.substring(0, h.indexOf("["))];
            if (parseInt(j) <= a.length - 1) a = a[parseInt(j)];
            else return ""
        } else if (null != a && e <= b.length) if (a.hasOwnProperty(h)) g && e == b.length - 1 && (a[h] = g), a = a[h];
        else return f ? void 0 : null;
        return a
    };
    c.sortArray = function(a, b) {
        if (0 == a.length) return a;
        for (var g = [], f = 0; f < b.length; f++) {
            var e = b[f];
            if (e.sortColumn || null != e.sortCompareFunction) null != e.sortCompareFunction ? g.push(e.sortCompareFunction) : e.sortCaseInsensitive ? g.push(e.isAscending ?
            function(b, a, d) {
                b = c.toString(c.resolveExpression(b, d.sortColumn)).toLowerCase();
                a = c.toString(c.resolveExpression(a, d.sortColumn)).toLowerCase();
                return b < a ? -1 : b > a ? 1 : 0
            } : function(b, a, d) {
                b = c.toString(c.resolveExpression(b, d.sortColumn)).toLowerCase();
                a = c.toString(c.resolveExpression(a, d.sortColumn)).toLowerCase();
                return b > a ? -1 : b < a ? 1 : 0
            }) : e.sortNumeric ? g.push(e.isAscending ?
            function(b, a, d) {
                b = parseFloat(c.resolveExpression(b, d.sortColumn));
                a = parseFloat(c.resolveExpression(a, d.sortColumn));
                return b < a ? -1 : b > a ? 1 : 0
            } : function(b, a, d) {
                b = parseFloat(c.resolveExpression(b, d.sortColumn));
                a = parseFloat(c.resolveExpression(a, d.sortColumn));
                return b > a ? -1 : b < a ? 1 : 0
            }) : g.push(e.isAscending ?
            function(b, a, d) {
                b = c.resolveExpression(b, d.sortColumn);
                a = c.resolveExpression(a, d.sortColumn);
                return b < a ? -1 : b > a ? 1 : 0
            } : function(b, a, d) {
                b = c.resolveExpression(b, d.sortColumn);
                a = c.resolveExpression(a, d.sortColumn);
                return b > a ? -1 : b < a ? 1 : 0
            })
        }
        a.sort(function(a, d) {
            for (var e = 0; e < g.length; e++) {
                var f = g[e](a, d, b[e]);
                if (0 != f) return f
            }
            return 0
        });
        return a
    };
    c.pageArray = function(a, b, g) {
        var f = a.length;
        b *= g;
        g = b + g > f - 1 ? f - 1 : b + g - 1;
        for (f = []; b <= g; b++) f.push(a[b]);
        return f
    };
    c.pageArrayByPageNumbers = function(a, b, g) {
        var f = a.length,
            e = 0 < b[0] ? b[0] - 1 : 0;
        if (b[0] >= b[1]) return c.pageArray(a, e, g);
        var h = e * g;
        b = g * (b[1] - e);
        f = h + b > f - 1 ? f - 1 : h + b - 1;
        for (b = []; h <= f; h++) b.push(a[h]);
        return b
    };
    c.filterArray = function(a, b, g, f, e) {
        g = [];
        for (var h = 0; h < a.length; h++) {
            var j = a[h];
            c.filterRecursive(j, b, f, e) && g.push(j)
        }
        return g
    };
    c.filterRecursive = function(a, b, g, f) {
        if (null != g.grid.globalFilterMatchFunction) return g.grid.globalFilterMatchFunction(a);
        if (0 < b.getFilterExpressions().length && (1 == g.getNestDepth() || g.reusePreviousLevelColumns) || g.getHasFilterFunction()) {
            var e = !0;
            if (0 < b.getFilterExpressions().length && (1 == g.getNestDepth() || g.reusePreviousLevelColumns)) for (var h = b.getFilterExpressions(), j = 0; j < h.length; j++) {
                var k = h[j];
                if (g.grid.filterExcludeObjectsWithoutMatchField && k.columnName && a && !a.hasOwnProperty(k.columnName)) {
                    e = !1;
                    break
                }
                if (!k.isMatch(a, g.grid)) {
                    e = !1;
                    break
                }
            }
            null != g.filterFunction && e && (e = g.filterFunction(a));
            if (!g.nextLevel) return e;
            if (e) {
                if (f) {
                    a = g.getChildren(a);
                    for (j = 0; j < a.length; j++) if (c.filterRecursive(a[j], b, g.nextLevel, f)) return !0;
                    return !1
                }
                return !0
            }
            e = !1;
            h = b.getFilterExpressions();
            for (j = 0; j < h.length; j++) if (h[j].recurse) {
                e = !0;
                break
            }
            if (e) {
                a = g.getChildren(a);
                for (j = 0; j < a.length; j++) if (c.filterRecursive(a[j], b, g.nextLevel, f)) return !0
            }
            return !1
        }
        return !0
    };
    c.recursiveMatch = function(a, b, g, f, e) {
        for (var h = 0; h < a.length; h++) {
            var j = a[h];
            if (e.isMatch(j, g) || f && c.recursiveMatch(f.getChildren(j), b, g, f.nextLevel, e)) return !0
        }
        return !1
    };
    c.filterPageSort = function(a, b, g) {
        "undefined" == typeof g && (g = null);
        0 < b.sorts.length && (a = c.sortArray(a, b.sorts));
        0 < b.getFilterExpressions().length && (a = c.filterArray(a, b, null, null, !1));
        b.recordCount = a.length;
        0 <= b.pageIndex && (a = g ? c.pageArrayByPageNumbers(a, g, b.pageSize) : c.pageArray(a, b.pageIndex, b.pageSize));
        return a
    };
    c.nanToZero = function(a) {
        return isNaN(a) ? 0 : a
    };
    c.gradientFill = function(a, b) {
        c.adapter.isIE() ? !b || 0 == b.length ? a.domElement.style.filter = "" : 10 == c.ieVersion ? a.domElement.style.background = "-ms-linear-gradient(top, " + c.decimalToColor(b[0]) + ", " + c.decimalToColor(b[1]) + ")" : 10 < c.ieVersion ? a.domElement.style.background = "linear-gradient(to bottom , " + c.decimalToColor(b[0]) + ", " + c.decimalToColor(b[1]) + ")" : a.domElement.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + c.decimalToColor(b[0]) + "', endColorstr='" + c.decimalToColor(b[1]) + "')" : c.adapter.isMoz() ? a.domElement.style.background = !b || 0 == b.length ? "" : "-moz-linear-gradient(top, " + c.decimalToColor(b[0]) + ", " + c.decimalToColor(b[1]) + ")" : c.adapter.isWebKit() && (a.domElement.style.background = !b || 0 == b.length ? "" : "-webkit-gradient(linear, left top, left bottom, from(" + c.decimalToColor(b[0]) + "), to(" + c.decimalToColor(b[1]) + "))")
    };
    c.isInUIHierarchy = function(a, b) {
        for (var g = a.parent; g;) {
            if (g == b) return !0;
            g = g.parent
        }
        return !1
    };
    c.getNearestJSObject = function(a) {
        return a ? a.hasOwnProperty("component") ? a.component : a.parentNode ? uiUtil.getNearestJSObject(a.parentNode) : null : null
    };
    c.hasMethod = function(a, b) {
        return "function" == typeof a[b]
    };
    c.hasMethodOrProperty = function(a, b) {
        return "undefined" != typeof a[b]
    };
    c.parseXML = function(a) {
        var b, g;
        try {
            window.DOMParser ? (g = new DOMParser, b = g.parseFromString(a, "text/xml")) : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a))
        } catch (f) {
            b = void 0
        }(!b || !b.documentElement || b.getElementsByTagName("parsererror").length) && alert("Invalid XML: " + a);
        return b
    };
    c.sortOn = function(a, b) {
        a.sort(function(a, d) {
            var e = c.toString(c.resolveExpression(a, b)).toLowerCase(),
                h = c.toString(c.resolveExpression(d, b)).toLowerCase();
            return e < h ? -1 : e > h ? 1 : 0
        })
    };
    c.addDomEventListener = function(a, b, g, f) {
        if (b.addEventListener) b.addEventListener(g, f);
        else if (b.attachEvent) if (c.isIE8()) $(b).on(g, f);
        else b.attachEvent("on" + g, f);
        a.domListeners.push([b, g, f])
    };
    c.removeDomEventListener = function(a, b, g) {
        a.removeEventListener ? a.removeEventListener(b, g) : a.detachEvent && $(a).off(b, g)
    };
    c.attachClass = function(a, b) {
        -1 == a.className.indexOf(b) && (a.className += " " + b)
    };
    c.detachClass = function(a, b) {
        -1 != a.className.indexOf(b) && (a.className = a.className.replace(b, ""))
    };
    c.numericCompare = function(a, b) {
        return isNaN(a) && isNaN(b) ? 0 : isNaN(a) ? 1 : isNaN(b) || a < b ? -1 : a > b ? 1 : 0
    };
    c.setText = function(a, b) {
        c.adapter.setText(a, b)
    };
    c.setHtml = function(a, b) {
        c.adapter.setHtml(a, b)
    };
    c.dateCompare = function(a, b) {
        if (null == a && null == b) return 0;
        if (null == a) return 1;
        if (null == b) return -1;
        var g = a.getTime(),
            f = b.getTime();
        return g < f ? -1 : g > f ? 1 : 0
    };
    c.numericCompare = function(a, b) {
        return isNaN(a) && isNaN(b) ? 0 : isNaN(a) ? 1 : isNaN(b) || a < b ? -1 : a > b ? 1 : 0
    };
    c.stringCompare = function(a, b, g) {
        if (null == a && null == b) return 0;
        if (null == a) return 1;
        if (null == b) return -1;
        g && (a = a.toLocaleLowerCase(), b = b.toLocaleLowerCase());
        a = a.localeCompare(b); - 1 > a ? a = -1 : 1 < a && (a = 1);
        return a
    };
    c.toStringSafe = function(a) {
        return null != a ? a.toString() : ""
    };
    c.showTooltip = function(a, b, g, f, e, h, j, k, l, m) {
        c.adapter.showTooltip(a, b, g, f, e, h, j, k, l, m)
    };
    c.positionComponent = function(a, b, g, f, e, h) {
        c.adapter.positionComponent(a, b, g, f, e, h)
    };
    c.hasLocalStorage = function() {
        try {
            return window.localStorage
        } catch (a) {
            return !1
        }
    };
    c.checkSetterAndApply = function(a, b, g) {
        if ("function" == typeof a["set" + c.capitalizeFirstLetterIfPrefix("set", b)]) a["set" + c.capitalizeFirstLetterIfPrefix("set", b)](g);
        else a[b] = g
    };
    c.getterCache = {};
    c.checkGetterAndRetrieve = function(a, b) {
        c.getterCache[b] || (c.getterCache[b] = "get" + c.capitalizeFirstLetterIfPrefix("get", b));
        return "function" == typeof a[c.getterCache[b]] ? a[c.getterCache[b]]() : a[b]
    };
    c.isMouseEvent = function(a) {
        return 0 <= a.type.toLowerCase().indexOf("mouse") || "click" == a.type.toLowerCase() ? a : null
    };
    c.mergeObjects = function(a, b) {
        for (var g in b) a[g] = b[g]
    };
    c.stringToDate = function(a, b) {
        for (var g, f, e = "", c = "", j = "", k = 0, l = b.length, m = 0; m < l; m++, k++) if (f = "" + a.charAt(k), g = "" + b.charAt(m), "M" == g) isNaN(f) || " " == f ? k-- : c += f;
        else if ("D" == g) isNaN(f) || " " == f ? k-- : e += f;
        else if ("Y" == g) j += f;
        else if (!isNaN(f) && " " != f) return null;
        f = "" + a.charAt(b.length - m + k);
        if ("" != f && " " != f) return null;
        g = c;
        f = j;
        if (isNaN(f) || isNaN(g) || isNaN(e)) return null;
        2 == j.length && 70 > f && (f += 2E3);
        j = new Date(f, g - 1, e);
        return e != j.getDate() || g - 1 != j.getMonth() ? null : j
    };
    c.getThemeById = function(a) {
        for (var b = 0; b < flexiciousNmsp.themes.length; b++) {
            var g = flexiciousNmsp.themes[b];
            if (g.id == a) return g
        }
        return null
    };
    c.isIE8Cached = -1;
    c.ieVersion = 9;
    c.isIE8 = function() {
        if (-1 == c.isIE8Cached) {
            var a = navigator.userAgent.toLowerCase();
            "Microsoft Internet Explorer" == navigator.appName ? null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (c.ieVersion = parseFloat(RegExp.$1), c.isIE8Cached = 9 > c.ieVersion ? 1 : 0) : -1 != a.indexOf("trident") ? (c.isIE8Cached = 0, c.ieVersion = 11) : c.isIE8Cached = 0
        } else return c.isIE8Cached
    };
    c.showToaster = function(a, b, g, f, e, h, j, k) {
        c.adapter.showToaster(a, b, g, f, e, h, j, k)
    };
    c.colorMap = {};
    c.decimalToColor = function(a) {
        if ("undefined" != typeof c.colorMap[a]) return c.colorMap[a];
        a = Number(a).toString(16);
        a = "000000".substr(0, 6 - a.length) + a;
        return "#" + a
    };
    flexiciousNmsp.UIUtils = c
})(window);
(function() {
    var a;
    a = function(a, d) {
        flexiciousNmsp.TypedObject.apply(this);
        this.x = a;
        this.y = d
    };
    flexiciousNmsp.Point = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "Point";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.prototype.getX = function() {
        return this.x
    };
    a.prototype.setX = function(a) {
        this.x = a
    };
    a.prototype.getY = function() {
        return this.y
    };
    a.prototype.setY = function(a) {
        this.y = a
    }
})();
(function() {
    var a = function() {},
        c = a.prototype;
    c.getClassNames = function() {
        return ["CurrencyFormatter"]
    };
    c.formatString = "#,##0.##";
    c.currencySymbol = "$";
    c.format = function(a) {
        if (!this.formatString || isNaN(+a)) return a;
        a = "-" == this.formatString.charAt(0) ? -a : +a;
        var b = 0 > a ? a = -a : 0,
            g = this.formatString.match(/[^\d\-\+#]/g),
            f = g && g[g.length - 1] || ".",
            g = g && g[1] && g[0] || ",",
            e = this.formatString.split(f);
        a = a.toFixed(e[1] && e[1].length);
        a = +a + "";
        var c = e[1] && e[1].lastIndexOf("0"),
            j = a.split(".");
        if (!j[1] || j[1] && j[1].length <= c) a = (+a).toFixed(c + 1);
        c = e[0].split(g);
        e[0] = c.join("");
        var k = e[0] && e[0].indexOf("0");
        if (-1 < k) for (; j[0].length < e[0].length - k;) j[0] = "0" + j[0];
        else 0 == +j[0] && (j[0] = "");
        a = a.split(".");
        a[0] = j[0];
        if (j = c[1] && c[c.length - 1].length) {
            for (var c = a[0], k = "", l = c.length % j, m = 0, n = c.length; m < n; m++) k += c.charAt(m), !((m - l + 1) % j) && m < n - j && (k += g);
            a[0] = k
        }
        a[1] = e[1] && a[1] ? f + a[1] : "";
        return this.currencySymbol + (b ? "-" : "") + a[0] + a[1]
    };
    flexiciousNmsp.CurrencyFormatter = a
})(window);
(function() {
    function a(b, a, g, d) {
        var e = new flexiciousNmsp.DateFormatter;
        0 < a.replace(RegExp(g, "ig"), "").length && (a = d);
        g = a.replace(/TZD/i, "tzd");
        e.formatString = g;
        return e.format(b).replace(/TZD/i, c(b))
    }
    function c(b) {
        if (!b) return "";
        var a = "GMT ";
        0 < b.getTimezoneOffset() / 60 && 10 > b.getTimezoneOffset() / 60 ? a += "-0" + (b.getTimezoneOffset() / 60).toString() : 0 > b.getTimezoneOffset() && -10 < b.getTimezoneOffset() / 60 && (a += "0" + (-1 * b.getTimezoneOffset() / 60).toString());
        return a + "00"
    }
    var d = function() {};
    d.prototype.getClassNames = function() {
        return "DateUtils"
    };
    var b = flexiciousNmsp.Constants;
    d.MONDAY = "monday";
    d.TUESDAY = "tuesday";
    d.WEDNESDAY = "wednesday";
    d.THURSDAY = "thursday";
    d.FRIDAY = "friday";
    d.SATURDAY = "saturday";
    d.SUNDAY = "sunday";
    d.JANUARY = "january";
    d.FEBRUARY = "february";
    d.MARCH = "march";
    d.APRIL = "april";
    d.MAY = "may";
    d.JUNE = "june";
    d.JULY = "july";
    d.AUGUST = "august";
    d.SEPTEMBER = "september";
    d.OCTOBER = "october";
    d.NOVEMBER = "november";
    d.DECEMBER = "december";
    d.YEAR = "fullYear";
    d.MONTH = "month";
    d.WEEK = "week";
    d.DAY_OF_MONTH = "date";
    d.HOURS = "hours";
    d.MINUTES = "minutes";
    d.SECONDS = "seconds";
    d.MILLISECONDS = "milliseconds";
    d.DAY_OF_WEEK = "day";
    d.LAST = -1;
    d.SECOND_VALUE = 1E3;
    d.MINUTE_VALUE = 60 * d.SECOND_VALUE;
    d.HOUR_VALUE = 60 * d.MINUTE_VALUE;
    d.DAY_VALUE = 24 * d.HOUR_VALUE;
    d.WEEK_VALUE = 7 * d.DAY_VALUE;
    var g = null,
        f = null,
        e = function() {
            g || (g = {}, g[d.SUNDAY] = 0, g[d.MONDAY] = 1, g[d.TUESDAY] = 2, g[d.WEDNESDAY] = 3, g[d.THURSDAY] = 4, g[d.FRIDAY] = 5, g[d.SATURDAY] = 6);
            return g
        },
        h = function() {
            f || (f = {}, f[d.JANUARY] = 0, f[d.FEBRUARY] = 1, f[d.MARCH] = 2, f[d.APRIL] = 3, f[d.MAY] = 4, f[d.JUNE] = 5, f[d.JULY] = 6, f[d.AUGUST] = 7, f[d.SEPTEMBER] = 8, f[d.OCTOBER] = 9, f[d.NOVEMBER] = 10, f[d.DECEMBER] = 11);
            return f
        };
    d.dateTimeFormat = function(g, d) {
        "undefined" == typeof d && (d = b.DEFAULT_DATE_FORMAT);
        return a(g, d, "(Y|M|D|E|A|J|H|K|L|N|S|TZD|\\W)+", b.SHORT_DATE_MASK + " " + b.SHORT_TIME_MASK)
    };
    d.getTimeFormat = function(g, d) {
        "undefined" == typeof d && (d = b.SHORT_TIME_MASK);
        return a(g, d, "(A|:|J|H|K|L|N|S|TZD|\\s)+", b.SHORT_TIME_MASK)
    };
    d.millisecondsPerDay = 864E5;
    d.formatString = function(g, d) {
        "undefined" == typeof d && (d = b.SHORT_DATE_MASK);
        return a(g, d, "(Y|M|D|E|\\W)+", b.SHORT_DATE_MASK)
    };
    d.dateAdd = function(b, a, g) {
        g = new Date(g);
        switch (b) {
        case d.YEAR:
        case d.MONTH:
        case d.DAY_OF_MONTH:
        case d.HOURS:
        case d.MINUTES:
        case d.SECONDS:
        case d.MILLISECONDS:
            g["set" + flexiciousNmsp.UIUtils.doCap(b)](g["get" + flexiciousNmsp.UIUtils.doCap(b)]() + a);
            break;
        case d.WEEK:
            g.setTime(7 * a * d.millisecondsPerDay + g.getTime()), g[d.DAY_OF_MONTH] += 7 * a
        }
        return g
    };
    d.dayOfWeek = function(b) {
        return b.getDay()
    };
    d.dayOfYear = function(b) {
        return d.dateDiff(d.DAY_OF_MONTH, new Date(b.getFullYear(), d.monthAsNumber(d.JANUARY), 1), b) + 1
    };
    d.weekOfYear = function(b) {
        return Math.ceil(d.dayOfYear(b) / 7)
    };
    d.toFlexDayOfWeek = function(b) {
        return 0 < b && 8 > b ? b - 1 : 0
    };
    d.dayOfWeekIterationOfMonth = function(b, a, g) {
        var e = d.dayOfWeekAsNumber(a),
            f = new Date(g.getFullYear(), g.getMonth(), 1),
            e = e - d.dayOfWeek(f);
        0 > e && (e += 7);
        f = d.dateAdd(d.DAY_OF_MONTH, e, f);
        if (1 == b) return f;
        if (d.totalDayOfWeekInMonth(a, g) < b || b == d.LAST) b = d.totalDayOfWeekInMonth(a, g);
        return d.dateAdd(d.WEEK, b - 1, f)
    };
    d.daysInMonth = function(b) {
        b = new Date(b.getFullYear(), d.dateAdd(d.MONTH, 1, b).getMonth(), 1);
        return d.dateAdd(d.DAY_OF_MONTH, -1, b).date
    };
    d.totalDayOfWeekInMonth = function(b, a) {
        var g = d.dayOfWeekIterationOfMonth(1, b, a),
            g = d.dateDiff(d.DAY_OF_MONTH, g, new Date(a.getFullYear(), a.getMonth(), d.daysInMonth(a)));
        return Math.floor(g / 7) + 1
    };
    d.toFlexMonth = function(b) {
        return 0 < b && 13 > b ? b - 1 : 0
    };
    d.isDate = function(b) {
        return 0 < Date.parse(b)
    };
    d.dayOfWeekAsString = function(b) {
        return d.formatString(b, "EEEE")
    };
    d.dayOfWeekAsNumber = function(b) {
        return 0 <= e()[b] ? e()[b] : -1
    };
    d.monthAsString = function(b) {
        return d.formatString(b, "MMMM")
    };
    d.monthAsNumber = function(b) {
        return 0 <= h()[b] ? h()[b] : -1
    };
    d.daysInYear = function(b) {
        return d.dateDiff(d.DAY_OF_MONTH, new Date(b.getFullYear(), d.monthAsNumber(d.JANUARY), 1), d.dateAdd(d.YEAR, 1, new Date(b.getFullYear(), d.monthAsNumber(d.JANUARY), 1)))
    };
    d.isLeapYear = function(b) {
        return 365 < d.daysInYear(b)
    };
    d.dateDiff = function(b, a, g) {
        var e = 0;
        switch (b) {
        case d.MILLISECONDS:
            e = g.getTime() - a.getTime();
            break;
        case d.SECONDS:
            e = Math.floor(d.dateDiff(d.MILLISECONDS, a, g) / d.SECOND_VALUE);
            break;
        case d.MINUTES:
            e = Math.floor(d.dateDiff(d.MILLISECONDS, a, g) / d.MINUTE_VALUE);
            break;
        case d.HOURS:
            e = Math.floor(d.dateDiff(d.MILLISECONDS, a, g) / d.HOUR_VALUE);
            break;
        case d.DAY_OF_MONTH:
            e = Math.floor(d.dateDiff(d.MILLISECONDS, a, g) / d.DAY_VALUE);
            break;
        case d.WEEK:
            e = Math.floor(d.dateDiff(d.MILLISECONDS, a, g) / d.WEEK_VALUE);
            break;
        case d.MONTH:
            if (0 > d.dateDiff(d.MILLISECONDS, a, g)) e -= d.dateDiff(d.MONTH, g, a);
            else if (e = 12 * d.dateDiff(d.YEAR, a, g), g.getMonth() != a.getMonth() && (e += g.getMonth() <= a.getMonth() ? 12 - a.getMonth() + g.getMonth() : g.getMonth() - a.getMonth()), g[d.DAY_OF_MONTH] < a[d.DAY_OF_MONTH] || g[d.DAY_OF_MONTH] == a[d.DAY_OF_MONTH] && g[d.MILLISECONDS] < a[d.MILLISECONDS]) e -= 1;
            break;
        case d.YEAR:
            if (e = g.getFullYear() - a.getFullYear(), 0 != e) if (0 > e) {
                if (g[d.MONTH] > a[d.MONTH] || g[d.MONTH] == a[d.MONTH] && g[d.DAY_OF_MONTH] > a[d.DAY_OF_MONTH] || g[d.MONTH] == a[d.MONTH] && g[d.DAY_OF_MONTH] == a[d.DAY_OF_MONTH] && g[d.MILLISECONDS] > a[d.MILLISECONDS]) e += 1
            } else if (g[d.MONTH] < a[d.MONTH] || g[d.MONTH] == a[d.MONTH] && g[d.DAY_OF_MONTH] < a[d.DAY_OF_MONTH] || g[d.MONTH] == a[d.MONTH] && g[d.DAY_OF_MONTH] == a[d.DAY_OF_MONTH] && g[d.MILLISECONDS] < a[d.MILLISECONDS]) e -= 1
        }
        return e
    };
    flexiciousNmsp.DateUtils = d
})(window);
(function() {
    var a = function() {},
        c = a.prototype = new flexiciousNmsp.TypedObject,
        d = flexiciousNmsp.UIUtils;
    c.getClassNames = function() {
        return ["DateFormatter"]
    };
    c.formatString = flexiciousNmsp.Constants.DEFAULT_DATE_FORMAT;
    c.format = function(b) {
        return b instanceof Date ? d.adapter.formatDate(b, this.formatString) : ""
    };
    flexiciousNmsp.DateFormatter = a
})(window);
(function() {
    var a = function() {
            this.formatString = "#,##0.##";
            this.precision = 2
        },
        c = a.prototype;
    c.getClassNames = function() {
        return ["NumberFormatter"]
    };
    c.format = function(a) {
        if (!this.formatString || isNaN(+a)) return a;
        a = "-" == this.formatString.charAt(0) ? -a : +a;
        var b = 0 > a ? a = -a : 0,
            g = this.formatString.match(/[^\d\-\+#]/g),
            f = g && g[g.length - 1] || ".",
            g = g && g[1] && g[0] || ",",
            e = this.formatString.split(f);
        a = a.toFixed(e[1] && e[1].length);
        a = +a + "";
        var c = e[1] && e[1].lastIndexOf("0"),
            j = a.split(".");
        if (!j[1] || j[1] && j[1].length <= c) a = (+a).toFixed(c + 1);
        c = e[0].split(g);
        e[0] = c.join("");
        var k = e[0] && e[0].indexOf("0");
        if (-1 < k) for (; j[0].length < e[0].length - k;) j[0] = "0" + j[0];
        else 0 == +j[0] && (j[0] = "");
        a = a.split(".");
        a[0] = j[0];
        if (j = c[1] && c[c.length - 1].length) {
            for (var c = a[0], k = "", l = c.length % j, m = 0, n = c.length; m < n; m++) k += c.charAt(m), !((m - l + 1) % j) && m < n - j && (k += g);
            a[0] = k
        }
        a[1] = e[1] && a[1] ? f + a[1] : "";
        return (b ? "-" : "") + a[0] + a[1]
    };
    flexiciousNmsp.NumberFormatter = a
})(window);
(function() {
    var a = function(d, b, g) {
            "undefined" == typeof b && (b = null);
            "undefined" == typeof g && (g = null);
            var f = new Date;
            if (d == a.DATE_RANGE_CUSTOM) this.startDate = b, this.endDate = g;
            else if (d == a.DATE_RANGE_THISHOUR) this.startDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 0, 0), this.endDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 59, 59);
            else if (d == a.DATE_RANGE_LAST_SIXTY_MINTUES) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.MINUTES, -60, new Date), this.endDate = new Date;
            else if (d == a.DATE_RANGE_LAST_12_HOURS) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -12, new Date), this.endDate = new Date;
            else if (d == a.DATE_RANGE_LAST_24_HOURS) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -24, new Date), this.endDate = new Date;
            else if (d == a.DATE_RANGE_LAST_7_DAYS) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.DAY_OF_MONTH, -7, new Date), this.endDate = new Date;
            else if (d == a.DATE_RANGE_LASTHOUR) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -1, new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 0, 0)), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -1, new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 59, 59));
            else if (d == a.DATE_RANGE_NEXTHOUR) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 1, new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 0, 0)), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 1, new Date(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), 59, 59));
            else if (d == a.DATE_RANGE_TODAY) this.startDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0), this.endDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 23, 59, 59);
            else if (d == a.DATE_RANGE_YESTERDAY) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -24, new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0)), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -24, new Date(f.getFullYear(), f.getMonth(), f.getDate(), 23, 59, 59));
            else if (d == a.DATE_RANGE_TOMORROW) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 24, new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0)), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 24, new Date(f.getFullYear(), f.getMonth(), f.getDate(), 23, 59, 59));
            else if (d == a.DATE_RANGE_THISWEEK || d == a.DATE_RANGE_LASTWEEK || d == a.DATE_RANGE_NEXTWEEK) {
                this.startDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0);
                for (this.endDate = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0); 1 != this.startDate.getDay();) this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -24, this.startDate);
                for (; 0 != this.endDate.getDay();) this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 24, this.endDate);
                this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.MILLISECONDS, -1, flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 24, this.endDate));
                d == a.DATE_RANGE_LASTWEEK ? (this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -168, this.startDate), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, -168, this.endDate)) : d == a.DATE_RANGE_NEXTWEEK && (this.startDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 168, this.startDate), this.endDate = flexiciousNmsp.DateUtils.dateAdd(flexiciousNmsp.DateUtils.HOURS, 168, this.endDate))
            } else if (d == a.DATE_RANGE_THISMONTH || d == a.DATE_RANGE_LASTMONTH || d == a.DATE_RANGE_NEXTMONTH) this.startDate = new Date(f.getFullYear(), f.getMonth(), 1, 0, 0, 0), this.endDate = new Date(f.getFullYear(), f.getMonth() + 1, 0, 23, 59, 59), d == a.DATE_RANGE_LASTMONTH ? (this.startDate = new Date(f.getFullYear(), f.getMonth() - 1, 1, 0, 0, 0), this.endDate = new Date(f.getFullYear(), f.getMonth(), 0, 23, 59, 59)) : d == a.DATE_RANGE_NEXTMONTH && (this.startDate = new Date(f.getFullYear(), f.getMonth() + 1, 1, 0, 0, 0), this.endDate = new Date(f.getFullYear(), f.getMonth() + 2, 0, 23, 59, 59));
            else if (d == a.DATE_RANGE_THISQUARTER || d == a.DATE_RANGE_LASTQUARTER || d == a.DATE_RANGE_NEXTQUARTER) b = f.getMonth() / 3 + 1, this.startDate = a.getStartOfQuarter(f.getFullYear(), b), this.endDate = a.getEndOfQuarter(f.getFullYear(), b), d == a.DATE_RANGE_LASTQUARTER ? (this.startDate = a.getStartOfQuarter(f.getFullYear(), b - 1), this.endDate = a.getEndOfQuarter(f.getFullYear(), b - 1)) : d == a.DATE_RANGE_NEXTQUARTER && (this.startDate = a.getStartOfQuarter(f.getFullYear(), b + 1), this.endDate = a.getEndOfQuarter(f.getFullYear(), b + 1));
            else if (d == a.DATE_RANGE_THISYEAR || d == a.DATE_RANGE_LASTYEAR || d == a.DATE_RANGE_NEXTYEAR) this.startDate = new Date(f.getFullYear(), 0, 1, 0, 0, 0), this.endDate = new Date(f.getFullYear(), 11, 31, 23, 59, 59), d == a.DATE_RANGE_LASTYEAR ? (this.startDate = new Date(f.getFullYear() - 1, 0, 1, 0, 0, 0), this.endDate = new Date(f.getFullYear() - 1, 11, 31, 23, 59, 59)) : d == a.DATE_RANGE_NEXTYEAR && (this.startDate = new Date(f.getFullYear() + 1, 0, 1, 0, 0, 0), this.endDate = new Date(f.getFullYear() + 1, 11, 31, 23, 59, 59));
            else throw Error("Invalid date range type" + d);
            this.dateRangeType = d
        },
        c = a.prototype;
    c.getClassNames = function() {
        return "DateRange"
    };
    a.DATE_RANGE_LAST_SIXTY_MINTUES = "Last 60 Minutes";
    a.DATE_RANGE_LAST_12_HOURS = "Last 12 Hours";
    a.DATE_RANGE_LAST_24_HOURS = "Last 24 Hours";
    a.DATE_RANGE_LAST_7_DAYS = "Last 7 Days";
    a.DATE_RANGE_THISHOUR = "This Hour";
    a.DATE_RANGE_LASTHOUR = "Last Hour";
    a.DATE_RANGE_NEXTHOUR = "Next Hour";
    a.DATE_RANGE_TODAY = "Today";
    a.DATE_RANGE_YESTERDAY = "Yesterday";
    a.DATE_RANGE_TOMORROW = "Tomorrow";
    a.DATE_RANGE_THISWEEK = "This Week";
    a.DATE_RANGE_LASTWEEK = "Last Week";
    a.DATE_RANGE_NEXTWEEK = "Next Week";
    a.DATE_RANGE_THISMONTH = "This Month";
    a.DATE_RANGE_LASTMONTH = "Last Month";
    a.DATE_RANGE_NEXTMONTH = "Next Month";
    a.DATE_RANGE_THISYEAR = "This Year";
    a.DATE_RANGE_LASTYEAR = "Last Year";
    a.DATE_RANGE_NEXTYEAR = "Next Year";
    a.DATE_RANGE_CUSTOM = "Custom";
    a.DATE_RANGE_THISQUARTER = "This Quarter";
    a.DATE_RANGE_NEXTQUARTER = "Next Quarter";
    a.DATE_RANGE_LASTQUARTER = "Last Quarter";
    a.getStartOfQuarter = function(a, b) {
        1 > b && (b = 4, a--);
        4 < b && (b = 1, a++);
        return 1 == b ? new Date(a, 0, 1, 0, 0, 0, 0) : 2 == b ? new Date(a, 3, 1, 0, 0, 0, 0) : 3 == b ? new Date(a, 6, 1, 0, 0, 0, 0) : new Date(a, 9, 1, 0, 0, 0, 0)
    };
    a.getEndOfQuarter = function(a, b) {
        1 > b && (b = 4, a--);
        4 < b && (b = 1, a++);
        return 1 == b ? new Date(a, 2, flexiciousNmsp.DateUtils.daysInMonth(new Date(a, 2)), 0, 0, 0, 0) : 2 == b ? new Date(a, 5, 30, 23, 59, 59, 999) : 3 == b ? new Date(a, 8, 30, 23, 59, 59, 999) : new Date(a, 11, 31, 23, 59, 59, 999)
    };
    c.startDate = new Date;
    c.endDate = new Date;
    c.dateRangeType = "";
    flexiciousNmsp.DateRange = a
})(window);
(function(a) {
    var c = function(b, a) {
            "undefined" == typeof a && (a = 0);
            flexiciousNmsp.EventDispatcher.apply(this);
            this.delay = b;
            this.repeatCount = a
        },
        d = c.prototype = new flexiciousNmsp.EventDispatcher,
        b = flexiciousNmsp.Constants;
    d.getClassNames = function() {
        return "Timer"
    };
    d.currentCount = 0;
    d.delay = 1E3;
    d.repeatCount = 0;
    d.running = !1;
    d.timeoutObject = null;
    d.reset = function() {
        this.currentCount = 0
    };
    d.start = function() {
        this.running && this.stop();
        this.running = !0;
        var b = this;
        this.timeoutObject = a.setInterval(function() {
            b.onTimer()
        }, this.delay);
        return this
    };
    d.onTimer = function() {
        this.currentCount++;
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(b.EVENT_TIMER));
        0 != this.repeatCount && this.currentCount >= this.repeatCount && (this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(b.EVENT_TIMER_COMPLETE)), this.stop())
    };
    d.stop = function() {
        this.running = !1;
        this.timeoutObject && (a.clearInterval(this.timeoutObject), this.timeoutObject = null)
    };
    d.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.stop()
    };
    d.timeoutObject = null;
    flexiciousNmsp.Timer = c
})(window);
(function() {
    var a = function(a, d, b, g) {
            this.x = a;
            this.y = d;
            this.width = b;
            this.height = g
        };
    a.prototype.getClassNames = function() {
        return "Rectangle"
    };
    a.prototype.getX = function() {
        return this.x
    };
    a.prototype.setX = function(a) {
        this.x = a
    };
    a.prototype.getY = function() {
        return this.y
    };
    a.prototype.setY = function(a) {
        this.y = a
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.setWidth = function(a) {
        this.width = a
    };
    a.prototype.getHeight = function() {
        return this.height
    };
    a.prototype.setHeight = function(a) {
        this.height = a
    };
    flexiciousNmsp.Rectangle = a
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.pageSize = 20;
        this.pageIndex = -1;
        this.pageCount = 1;
        this.recordCount = null;
        this.filterExpressions = [];
        this.sorts = [];
        this.records = this.filterDescrption = null;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.Filter = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "Filter";
    a.prototype.getClassNames = function() {
        return ["Filter ", "TypedObject"]
    };
    a.ALL_ITEM = "All";
    a.prototype.copyFrom = function(a) {
        this.filterDescrption = a.filterDescrption;
        this.pageSize = a.pageSize;
        this.pageIndex = a.pageIndex;
        this.pageCount = a.pageCount;
        this.recordCount = a.recordCount;
        for (var b = [], g = 0, g = 0; g < a.filterExpressions.length; g++) {
            var f = a.filterExpressions[g],
                e = new flexiciousNmsp.FilterExpression;
            e.copyFrom(f);
            (null != e.expression || e.filterControlValue) && b.push(e)
        }
        this.filterExpressions = b;
        if (a = a.sorts) {
            b = [];
            for (g = 0; g < a.length; g++) f = a[g], e = new flexiciousNmsp.FilterSort, e.copyFrom(f), b.push(e);
            this.sorts = b
        }
    };
    a.prototype.addSort = function(a, b, g, f) {
        "undefined" == typeof g && (g = "auto");
        "undefined" == typeof f && (f = null);
        for (var e = 0; e < this.sorts.length; e++) {
            var c = this.sorts[e];
            if (c.sortColumn == a) {
                c.isAscending = b;
                c.sortComparisionType = g;
                c.sortCompareFunction = f;
                return
            }
        }
        e = new flexiciousNmsp.FilterSort;
        e.sortColumn = a;
        e.isAscending = b;
        e.sortComparisionType = g;
        e.sortCompareFunction = f;
        this.sorts.push(e)
    };
    a.prototype.addCriteria = function(a, b) {
        this.addOperatorCriteria(a, FilterExpression.FILTER_OPERATION_TYPE_EQUALS, b)
    };
    a.prototype.addOperatorCriteria = function(a, b, g, f) {
        "undefined" == typeof f && (f = !1);
        for (var e = 0; e < this.filterExpressions.length; e++) {
            var c = this.filterExpressions[e];
            if (c.columnName == a) {
                c.expression = g;
                c.filterOperation = b;
                return
            }
        }
        this.filterExpressions.push(flexiciousNmsp.FilterExpression.createFilterExpression(this, a, b, g, f))
    };
    a.prototype.addFilterExpression = function(a) {
        this.addOperatorCriteria(a.columnName, a.filterOperation, a.expression, a.wasContains)
    };
    a.prototype.removeCriteria = function(a) {
        a = c.doesArrayContainValue(this.filterExpressions, "ColumnName", a);
        null != a && this.filterExpressions.splice(this.filterExpressions.indexOf(a), 1)
    };
    a.prototype.getFilterValue = function(a) {
        for (var b = 0; b < this.filterExpressions.length; b++) {
            var g = this.filterExpressions[b];
            if (g.columnName == a) return g.filterControlValue ? g.filterControlValue : g.expression
        }
        return null
    };
    a.prototype.getFilterExpression = function(a) {
        for (var b = 0; b < this.filterExpressions.length; b++) {
            var g = this.filterExpressions[b];
            if (g.columnName == a) return g.clone()
        }
        return null
    };
    a.prototype.getFilterExpressions = function() {
        return this.filterExpressions
    };
    a.prototype.setFilterExpressions = function(a) {
        return this.filterExpressions = a
    }
})(window);
(function() {
    var a;
    a = function(c, d, b) {
        "undefined" == typeof c && (c = "");
        "undefined" == typeof d && (d = "Equals");
        "undefined" == typeof b && (b = null);
        this.wasContains = !1;
        this.columnName = null;
        this.filterOperation = a.FILTER_OPERATION_TYPE_EQUALS;
        this.filterComparisionType = a.FILTER_COMPARISION_TYPE_AUTO;
        this.filterControl = this.filter = this.filterControlValue = this.expression = null;
        this.recurse = !1;
        this.columnName = c;
        this.filterOperation = d;
        this.expression = b;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.FilterExpression = a;
    flexiciousNmsp.FilterExpression.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "FilterExpression";
    a.prototype.getClassNames = function() {
        return ["FilterExpression ", "TypedObject"]
    };
    a.FILTER_OPERATION_TYPE_NONE = "None";
    a.FILTER_OPERATION_TYPE_EQUALS = "Equals";
    a.FILTER_OPERATION_TYPE_NOT_EQUALS = "NotEquals";
    a.FILTER_OPERATION_TYPE_BEGINS_WITH = "BeginsWith";
    a.FILTER_OPERATION_TYPE_ENDS_WITH = "EndsWith";
    a.FILTER_OPERATION_TYPE_CONTAINS = "Contains";
    a.FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN = "DoesNotContain";
    a.FILTER_OPERATION_TYPE_GREATER_THAN = "GreaterThan";
    a.FILTER_OPERATION_TYPE_LESS_THAN = "LessThan";
    a.FILTER_OPERATION_TYPE_GREATERTHANEQUALS = "GreaterThanEquals";
    a.FILTER_OPERATION_TYPE_LESS_THAN_EQUALS = "LessThanEquals";
    a.FILTER_OPERATION_TYPE_IN_LIST = "InList";
    a.FILTER_OPERATION_TYPE_NOT_IN_LIST = "NotInList";
    a.FILTER_OPERATION_TYPE_BETWEEN = "Between";
    a.FILTER_OPERATION_TYPE_IS_NOT_NULL = "IsNotNull";
    a.FILTER_OPERATION_TYPE_IS_NULL = "IsNull";
    a.FILTER_COMPARISION_TYPE_AUTO = "auto";
    a.FILTER_COMPARISION_TYPE_STRING = "string";
    a.FILTER_COMPARISION_TYPE_NUMBER = "number";
    a.FILTER_COMPARISION_TYPE_DATE = "date";
    a.FILTER_COMPARISION_TYPE_BOOLEAN = "boolean";
    a.prototype.copyFrom = function(a) {
        this.columnName = a.columnName;
        this.filterOperation = a.filterOperation;
        this.filterComparisionType = a.filterComparisionType;
        this.filterControlValue = a.filterControlValue;
        this.recurse = a.recurse;
        this.expression = !a.expression ? null : a.expression.hasOwnProperty("item") ? a.expression.item : a.expression.hasOwnProperty("object") ? a.expression.object : a.expression;
        return this
    };
    a.prototype.clone = function() {
        var c = new a;
        c.columnName = this.columnName;
        c.filterOperation = this.filterOperation;
        c.filterComparisionType = this.filterComparisionType;
        c.expression = this.expression;
        c.filterControlValue = this.filterControlValue;
        c.recurse = this.recurse;
        return c
    };
    a.createFilterExpression = function(c, d, b, g, f) {
        "undefined" == typeof f && (f = !1);
        var e = new a;
        e.filter = c;
        e.columnName = d;
        e.expression = g;
        e.filterOperation = b;
        e.wasContains = f;
        return e
    };
    a.convert = function(c, d) {
        if (null == d) return d;
        if (c == a.FILTER_COMPARISION_TYPE_NUMBER && "number" != typeof d) return parseFloat(d.toString());
        if (c == a.FILTER_COMPARISION_TYPE_DATE && "object" != typeof d) {
            var b = d.toString();
            return 0 < b.length ? new Date(Date.parse(b)) : null
        }
        return c == a.FILTER_COMPARISION_TYPE_BOOLEAN && "boolean" != typeof d ? a.parseBoolean(d.toString()) : c == a.FILTER_COMPARISION_TYPE_STRING && "string" != typeof d ? d.toString() : d
    };
    a.prototype.isMatch = function(c, d) {
        if (this.filterControl && flexiciousNmsp.UIUtils.hasMethod(this.filterControl, "isMatch")) return this.filterControl.isMatch(c);
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_NONE || null == this.expression || null == c || null == this.columnName) return !0;
        var b = null;
        if ((b = d && d.getFilterColumn(this.columnName)) && flexiciousNmsp.UIUtils.hasMethodOrProperty(b, "useLabelFunctionForFilterCompare") && b.useLabelFunctionForFilterCompare) b = b.itemToLabel(c);
        else {
            if (b && null != b.filterCompareFunction) return b.filterCompareFunction(c, this);
            if (b && flexiciousNmsp.UIUtils.hasMethodOrProperty(b, "filterConverterFunction") && null != b.filterConverterFunction) b = b.filterConverterFunction(c, b);
            else if (0 < this.columnName.indexOf(".")) {
                b = flexiciousNmsp.UIUtils.resolveExpression(c, this.columnName, null, !0);
                if (void 0 == b) return !0;
                if (null == b) return !1
            } else if (c.hasOwnProperty(this.columnName)) b = c[this.columnName];
            else return !0
        }
        if (null == b) return !1;
        this.filterControl && flexiciousNmsp.UIUtils.hasMethod(this.filterControl, "convert") ? b = this.filterControl.convert(b.toString()) : this.filterComparisionType != a.FILTER_COMPARISION_TYPE_AUTO && (b = a.convert(this.filterComparisionType, b));
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_BEGINS_WITH) return 0 == b.toString().toLocaleLowerCase().indexOf(this.expression.toString().toLocaleLowerCase().toString());
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_CONTAINS) return 0 <= b.toString().toLocaleLowerCase().indexOf(this.expression.toString().toLocaleLowerCase().toString());
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN) return 0 > b.toString().toLocaleLowerCase().indexOf(this.expression.toString().toLocaleLowerCase().toString());
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_BETWEEN) {
            if (null == this.expression) throw Error("Expression is not an array collection for between filter operation");
            if (2 != this.expression.length) throw Error("Invalid expression for between filter operation. Between filter operation requires array collection with exactly 2 items.");
            return this.expression[0] <= b && b <= this.expression[1]
        }
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_ENDS_WITH) return b.toString().toLowerCase().lastIndexOf(this.expression.toString().toLowerCase()) == b.toString().length - this.expression.toString().length;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_EQUALS) return b == this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_GREATER_THAN) return b > this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_GREATERTHANEQUALS) return b >= this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_IN_LIST) {
            if (null == this.expression) throw Error("expression is not an array collection for between filter operation");
            for (g = 0; g < this.expression.length; g++) if (f = this.expression[g], this.wasContains && f && b) {
                if (0 <= b.toString().indexOf(f.toString())) return !0
            } else if (f == b) return !0;
            return !1
        }
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_IS_NOT_NULL) return null != b;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_LESS_THAN) return b < this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_LESS_THAN_EQUALS) return b <= this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_NOT_EQUALS) return b != this.expression;
        if (this.filterOperation == a.FILTER_OPERATION_TYPE_NOT_IN_LIST) {
            if (null == this.expression) throw Error("expression is not an array collection for between filter operation");
            for (var g = 0; g < this.expression.length; g++) {
                var f = this.expression[g];
                if (f == b) return !1
            }
            return !0
        }
        throw Error("Invalid expression for Filter expression");
    };
    a.parseBoolean = function(a) {
        switch (a.toLowerCase()) {
        case "1":
        case "true":
        case "yes":
        case "y":
            return !0;
        case "0":
        case "false":
        case "no":
        case "n":
            return !1;
        default:
            return Boolean(a)
        }
    }
})(window);
(function() {
    var a;
    a = function(a, d) {
        "undefined" == typeof a && (a = "");
        "undefined" == typeof d && (d = !0);
        this.sortCompareFunction = this.sortColumn = this.column = null;
        this.isAscending = !0;
        this.sortComparisionType = "auto";
        this.sortNumeric = this.sortCaseInsensitive = !1;
        this.sortColumn = a;
        this.isAscending = d;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.FilterSort = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "FilterSort";
    a.prototype.getClassNames = function() {
        return ["FilterSort", "TypedObject"]
    };
    a.prototype.copyFrom = function(a) {
        this.sortColumn = a.sortColumn;
        this.isAscending = a.isAscending;
        this.sortComparisionType = a.sortComparisionType;
        this.sortCaseInsensitive = a.sortCaseInsensitive;
        this.sortNumeric = a.sortNumeric
    }
})(window);
(function() {
    var a;
    a = function() {
        this.printExportOptions = null;
        flexiciousNmsp.Filter.apply(this)
    };
    flexiciousNmsp.PrintExportFilter = a;
    a.prototype = new flexiciousNmsp.Filter;
    a.prototype.typeName = a.typeName = "PrintExportFilter";
    a.prototype.getClassNames = function() {
        return ["PrintExportFilter", "Filter"]
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.level = this.parentObject = null;
        flexiciousNmsp.Filter.apply(this)
    };
    flexiciousNmsp.AdvancedFilter = a;
    a.prototype = new flexiciousNmsp.Filter;
    a.prototype.typeName = a.typeName = "AdvancedFilter";
    a.prototype.getClassNames = function() {
        return ["AdvancedFilter", "Filter"]
    };
    a.prototype.getLevel = function() {
        return this.level
    };
    a.ALL_ITEM = "All";
    a.from = function(d) {
        var b = new a;
        b.pageIndex = d.pageIndex;
        b.pageSize = d.pageSize;
        b.recordCount = d.recordCount;
        b.filterExpressions = d.filterExpressions;
        for (var g in d) d.hasOwnProperty(g) && c.isPrimitive(d[g]) && (b[g] = d[g])
    }
})(window);
(function() {
    var a = function(b) {
            this.iEventDispatcher = b;
            this.filterControls = []
        },
        c = a.prototype,
        d = flexiciousNmsp.Constants;
    c.getClassNames = function() {
        return "FilterContainerImpl"
    };
    c.getFilterArguments = function() {
        for (var b = [], a = 0; a < this.filterControls.length; a++) {
            var d = this.getFilterExpression(this.filterControls[a]);
            null != d && b.push(d)
        }
        return b
    };
    c.resetFilterControls = function() {
        for (var b = 0; b < this.filterControls.length; b++) this.filterControls[b].dispatchEvent(new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.DESTROY));
        this.filterControls.removeAll()
    };
    c.unRegisterIFilterControl = function(b) {
        "none" != b.filterTriggerEvent.toLowerCase() && ("enterkeyup" == b.filterTriggerEvent.toLowerCase() ? b.removeEventListener(d.EVENT_KEY_UP, this.onKeyUp) : b.implementsOrExtends("IDelayedChange") ? b.removeEventListener("delayedChange", this.onChangeHandler) : b.removeEventListener("change", this.onChangeHandler));
        this.filterControls.splice(this.filterControls.indexOf(b), 1)
    };
    c.isIFilterControlRegistered = function(b) {
        return 0 <= this.filterControls.indexOf(b)
    };
    c.registerIFilterControl = function(b) {
        this.filterControls.push(b);
        b.filterTriggerEvent && "none" != b.filterTriggerEvent.toLowerCase() && ("enterkeyup" == b.filterTriggerEvent.toLowerCase() ? b.addEventListener(this, d.EVENT_KEY_UP, this.onKeyUp) : b.implementsOrExtends("IDelayedChange") ? b.addEventListener(this, "delayedChange", this.onChangeHandler) : b.addEventListener(this, "change", this.onChangeHandler))
    };
    c.setFilterFocus = function(b) {
        for (var a = 0; a < this.filterControls.length; a++) {
            var d = this.filterControls[a];
            if (d.searchField == b && d.implementsOrExtends("IFocusManagerComponent")) return this.setFocusOnChild(d), !0
        }
        return !1
    };
    c.setFocusOnChild = function(b) {
        "function" == typeof b.focus && b.focus();
        "function" == typeof b.setSelection && b.setSelection()
    };
    c.getNextFilter = function(b) {
        for (var a, f = 0; f < this.filterControls.length; f++) if (b.currentTarget == this.filterControls[f]) {
            a = f;
            break
        }
        f = b.keyCode == d.KEYBOARD_LEFT || b.keyCode == d.KEYBOARD_TAB && b.shiftKey;
        b = b.keyCode == d.KEYBOARD_RIGHT || b.keyCode == d.KEYBOARD_TAB && !f;
        return !b && !f ? null : this.getNextFocusableFilter(a, b)
    };
    c.getNextFocusableFilter = function(b, a, d) {
        "undefined" == typeof d && (d = !1);
        if (0 == this.filterControls.length) return null;
        if (0 <= b && b <= this.filterControls.length && d && this.filterControls[b].implementsOrExtends("IFocusManagerComponent")) return this.filterControls[b];
        b = this.filterControls[b];
        b.implementsOrExtends("ITriStateCheckBoxFilterControl");
        var e, c = this.iEventDispatcher.dataGrid;
        d = c.getFilterX(b);
        for (var j = 0; j < this.filterControls.length; j++) var k = this.filterControls[j];
        k.implementsOrExtends("IFocusManagerComponent") && (c = c.getFilterX(k), a ? e ? c < e.getX() && (c > d && k.implementsOrExtends("IFocusManagerComponent") && k != b) && (e = k) : c > d && k != b && (e = k) : e ? c > e.getX() && (c < d && k.implementsOrExtends("IFocusManagerComponent") && k != b) && (e = k) : c < d && k != b && (e = k));
        return e
    };
    c.setFilterValue = function(b, a) {
        for (var d = 0; d < this.filterControls.length; d++) var e = this.filterControls[d];
        e.searchField == b && e.setValue(a)
    };
    c.getFilterValue = function(b) {
        for (var a = 0; a < this.filterControls.length; a++) var d = this.filterControls[a];
        return d.searchField == b ? d.getValue() : null
    };
    c.hasField = function(b) {
        for (var a = 0; a < this.filterControls.length; a++) var d = this.filterControls[a];
        return d.searchField == b ? !0 : !1
    };
    c.processFilter = function() {
        this.onChangeHandler(null)
    };
    c.clearFilter = function() {
        for (var b = 0; b < this.filterControls.length; b++) this.filterControls[b].clear()
    };
    c.clearFilter = function() {
        for (var b = 0; b < this.filterControls.length; b++) this.filterControls[b].clear()
    };
    c.onKeyUp = function(b) {
        if (b.keyCode == d.KEYBOARD_ENTER) this.onChangeHandler(b)
    };
    c.onChangeHandler = function(b) {
        var a = new flexiciousNmsp.Filter;
        a.setFilterExpressions(this.getFilterArguments());
        a = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE, a);
        a.triggerEvent = b;
        this.iEventDispatcher.dispatchEvent(a)
    };
    c.getFilterExpression = function(b) {
        if (!b.getEnabled() || !b.implementsOrExtends("IFilterControl")) return null;
        var a, d = new flexiciousNmsp.FilterExpression;
        d.columnName = b.searchField;
        d.filterOperation = b.filterOperation;
        d.wasContains = d.filterOperation == flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_CONTAINS;
        d.filterComparisionType = b.filterComparisionType;
        d.filterControl = b;
        d.filterControlValue = b.getValue();
        if (b.implementsOrExtends("ICustomMatchFilterControl")) return d.columnName = b.searchField, d.filterControl = b, d.expression = d.filterControlValue, d;
        if (b.implementsOrExtends("IDynamicFilterControl")) {
            d = b.filterExpression;
            if (null == d) return null;
            d.columnName = b.searchField;
            d.filterComparisionType = b.filterComparisionType;
            d.filterControl = b;
            return d
        }
        if (b.implementsOrExtends("IRangeFilterControl")) {
            d.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_BETWEEN;
            if (null == b.getSearchRangeStart() || null == b.getSearchRangeEnd()) return null;
            a = [];
            a.push(b.getSearchRangeStart());
            a.push(b.getSearchRangeEnd())
        } else if (b.implementsOrExtends("ISingleSelectFilterControl")) {
            a = b.getSelectedItem();
            if (null == a || null == a[b.dataField] || a[b.dataField].toString() == b.addAllItemText) return null;
            a = a[b.dataField]
        } else if (b.implementsOrExtends("IMultiSelectFilterControl")) {
            a = [];
            d.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_IN_LIST;
            for (var e = b.getValue(), c = 0; c < e.length; c++) {
                var j = e[c];
                if (null != j) {
                    if (j == b.addAllItemText) return null;
                    a.push(j)
                }
            }
            if (0 == a.length) return null
        } else if (b.implementsOrExtends("ITextFilterControl")) {
            null == d.filterOperation && (d.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_BEGINS_WITH);
            if (0 == b.getValue().length) return null;
            a = b.getValue()
        } else if (b.implementsOrExtends("ITriStateCheckBoxFilterControl")) {
            if ("middle" == b.getSelectedState()) return null;
            a = "checked" == b.getSelectedState()
        } else if (b.implementsOrExtends("ISelectedBitFilterControl")) a = b.getSelected();
        else return null;
        null == d.filterOperation && (d.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_EQUALS);
        d.expression = a;
        d.filterControlValue = b.getValue();
        b.gridColumn && b.gridColumn.hasOwnProperty("enableRecursiveSearch") && (d.recurse = b.gridColumn.enableRecursiveSearch);
        return d
    };
    c.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.filterControls = [];
        this.iEventDispatcher = []
    };
    c.filterControls = [];
    flexiciousNmsp.FilterContainerImpl = a
})(window);
(function() {
    var a, c, d, b;
    c = flexiciousNmsp.UIUtils;
    d = flexiciousNmsp.Constants;
    b = [d.EVENT_CHANGE, d.EVENT_CLICK, d.EVENT_DOUBLE_CLICK, d.EVENT_FOCUS_CHANGE, d.EVENT_FOCUS_IN, d.EVENT_FOCUS_OUT, d.EVENT_KEY_DOWN, d.EVENT_KEY_UP, d.EVENT_MOUSE_CLICK, d.EVENT_MOUSE_DOWN, d.EVENT_MOUSE_MOVE, d.EVENT_MOUSE_OUT, d.EVENT_MOUSE_OVER, d.EVENT_MOUSE_UP, d.EVENT_MOUSE_WHEEL, d.EVENT_RESIZE, d.EVENT_SCROLL];
    a = function(b) {
        flexiciousNmsp.EventDispatcher.apply(this);
        "undefined" === typeof b && (b = "span");
        this.width = this.height = 0;
        this._innerHTML = this._text = "";
        this.domListeners = [];
        this.domElement = null;
        this.visible = this.enabled = !0;
        this.data = null;
        this.children = [];
        this.invalid = !1;
        this.setDomElement(document.createElement(b));
        c.attachClass(this.domElement, c.doLower(this.typeName))
    };
    flexiciousNmsp.UIComponent = a;
    flexiciousNmsp.UIUtils.UIComponentFactory = new flexiciousNmsp.ClassFactory(flexiciousNmsp.UIComponent);
    a.prototype = new flexiciousNmsp.EventDispatcher;
    a.prototype.typeName = a.typeName = "UIComponent";
    a.prototype.getClassNames = function() {
        return ["TypedObject", "EventDispatcher", "UIComponent", this.typeName]
    };
    a.prototype.setDomElement = function(b) {
        this.domElement = b;
        this.domElement.component = this
    };
    a.prototype.owns = function(b) {
        if (!b) return !1;
        for (; b;) {
            if (b === this.domElement) return !0;
            b = b.parentNode
        }
        return !1
    };
    a.prototype.updateDisplayList = function() {
        this.initialized || (this.initialize(), this.dispatchEvent(new flexiciousNmsp.BaseEvent(d.EVENT_CREATION_COMPLETE)));
        this.invalid = !1
    };
    a.prototype.render = function() {
        this.updateDisplayList(this.getWidth(), this.getHeight())
    };
    a.prototype.invalidateDisplayList = function() {
        this.invalid || (this.invalid = !0, "undefined" != typeof flexiciousNmsp.DisplayList.instance && flexiciousNmsp.DisplayList.instance().addInvalidObject(this))
    };
    a.prototype.initialize = function() {
        this.initialized = !0
    };
    a.prototype.addChild = function(b) {
        c.addChild(this, b)
    };
    a.prototype.addChildAt = function(b, a) {
        var d = this.getChildAt(a);
        d ? c.insertBefore(b, d) : this.addChild(b)
    };
    a.prototype.removeChild = function(b) {
        c.removeChild(this, b)
    };
    a.prototype.removeChildAt = function(b) {
        b = this.getChildAt(b);
        this.removeChild(b)
    };
    a.prototype.localToGlobal = function(b) {
        var a = c.adapter.offset(this.domElement);
        return new flexiciousNmsp.Point(a.left + b.x, a.top + b.y)
    };
    a.prototype.globalToLocal = function(b) {
        var a = c.adapter.offset(this.domElement);
        return new flexiciousNmsp.Point(b.x - (a ? a.left : 0) + this.domElement.scrollLeft, b.y - (a ? a.top : 0) + this.domElement.scrollTop)
    };
    a.prototype.numChildren = function() {
        return this.children.length
    };
    a.prototype.getChildAt = function(b) {
        return this.children[b]
    };
    a.prototype.kill = function() {
        var b, a, d;
        for (b = 0; b < this.domListeners.length; b += 1) a = this.domListeners[b], d = a[1], a = a[2], this.removeDomEventListener(d, a);
        this.domListeners = [];
        flexiciousNmsp.DisplayList.instance().removeInvalidObject(this);
        for (b = 0; b < this.children.length; b++) this.children[b].kill();
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.domElement && (this.domElement.parentNode && c.removeChild(this.domElement.parentNode, this.domElement), this.domElement = this.domElement.component = null);
        this.parent = null;
        this.children = []
    };
    a.prototype.addDomEventListener = function(b, a) {
        flexiciousNmsp.UIUtils.addDomEventListener(this, this.domElement, b, a)
    };
    a.prototype.removeDomEventListener = function(b, a) {
        flexiciousNmsp.UIUtils.removeDomEventListener(this.domElement, b, a)
    };
    a.prototype.addEventListener = function(a, d, e) {
        flexiciousNmsp.EventDispatcher.prototype.addEventListener.apply(this, [a, d, e]);
        0 <= b.indexOf(d) && this.addDomEventListener(d, this.domEventFired)
    };
    a.prototype.removeEventListener = function(a, d) {
        flexiciousNmsp.EventDispatcher.prototype.removeEventListener.apply(this, [a, d]);
        0 <= b.indexOf(a) && this.removeDomEventListener(a, this.domEventFired)
    };
    a.prototype.domEventFired = function(b) {
        var a, e;
        e = b.currentTarget || b.srcElement;
        if (b.target || b.srcElement) a = new flexiciousNmsp.FlexDataGridEvent(b.type), a.triggerEvent = b, e.component && (a.currentTarget = a.target = e.component, b.type === d.EVENT_SCROLL ? (a.scrollTop = e.scrollTop, a.scrollLeft = e.scrollLeft) : 0 === b.type.indexOf("mouse") ? (a.pageX = b.pageX, a.pageY = b.pageY, e = a.currentTarget.globalToLocal(new flexiciousNmsp.Point(a.pageX, a.pageY)), a.localX = e.x, a.localY = e.y) : 0 === b.type.indexOf("click") ? (a.pageX = b.pageX, a.pageY = b.pageY, e = a.currentTarget.globalToLocal(new flexiciousNmsp.Point(a.pageX, a.pageY)), a.localX = e.x, a.localY = e.y, a.shiftKey = b.shiftKey, a.ctrlKey = b.ctrlKey, a.altKey = b.altKey) : 0 === b.type.indexOf("key") && (null === b.which && (b.which = null !== b.charCode ? b.charCode : b.keyCode), a.keyCode = b.which, a.shiftKey = b.shiftKey, a.ctrlKey = b.ctrlKey, a.altKey = b.altKey), a.currentTarget.dispatchEvent(a))
    };
    a.prototype.validateNow = function() {
        this.updateDisplayList(this.getWidth(), this.getHeight())
    };
    a.prototype.setActualSize = function(b, a) {
        this.setWidth(b);
        this.setHeight(a);
        this.invalidateDisplayList()
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.setWidth = function(b) {
        0 <= b && (this.width = b, this.domElement.style.width = b + "px");
        return b
    };
    a.prototype.getHeight = function() {
        return this.height
    };
    a.prototype.setHeight = function(b) {
        0 <= b && (this.height = b, this.domElement.style.height = b + "px");
        return b
    };
    a.prototype.setActualSizeFromDomElement = function() {
        this.setActualSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
    };
    a.measurer = null;
    a.prototype.measureText = function(b) {
        a.measurer || (a.measurer = new flexiciousNmsp.UIComponent("div"), a.measurer.domElement.style.position = "absolute");
        c.addChild(document.body, a.measurer);
        a.measurer.setInnerHTML(b);
        b = a.measurer.domElement.offsetWidth;
        this.removeChild(a.measurer);
        a.measurer = null;
        return {
            width: b
        }
    };
    a.prototype.getText = function() {
        return this._text
    };
    a.prototype.setText = function(b) {
        this._text = b;
        this.setInnerHTML(b)
    };
    a.prototype.getInnerHTML = function() {
        return this._innerHTML
    };
    a.prototype.setInnerHTML = function(b) {
        this._innerHTML = b;
        c.setHtml(this.domElement, b)
    };
    a.prototype.focus = function() {
        this.domElement.focus()
    };
    a.prototype.move = function(b, a) {
        this.setX(b);
        this.setY(a)
    };
    a.prototype.getX = function() {
        return this.x
    };
    a.prototype.getY = function() {
        return this.y
    };
    a.prototype.setX = function(b) {
        if (0 > b || isNaN(b)) return b;
        this.x = b;
        this.domElement.style.left = b + "px";
        return b
    };
    a.prototype.setY = function(b) {
        if (isNaN(b)) return b;
        this.y = b;
        this.domElement.style.top = b + "px";
        return b
    };
    a.prototype.setVisible = function(b) {
        this.visible != b && (this.visible = b, this.domElement.style.display = b ? "" : "none")
    };
    a.prototype.getVisible = function() {
        return this.visible
    };
    a.prototype.setEnabled = function(b) {
        this.enabled = b;
        this.domElement.disabled = !b
    };
    a.prototype.getEnabled = function() {
        return this.enabled
    };
    a.prototype.setChildIndex = function(b, a) {
        b.domElement.style.zIndex = a
    };
    a.prototype.getHorizontalScrollPolicy = function() {
        return this.horizontalScrollPolicy
    };
    a.prototype.getVerticalScrollPolicy = function() {
        return this.verticalScrollPolicy
    };
    a.prototype.setHorizontalScrollPolicy = function(b) {
        this.horizontalScrollPolicy = b;
        this.domElement.style.overflowX = b == d.SCROLL_POLICY_AUTO ? "auto" : b == d.SCROLL_POLICY_ON ? "scroll" : "hidden"
    };
    a.prototype.setVerticalScrollPolicy = function(b) {
        this.verticalScrollPolicy = b;
        this.domElement.style.overflowY = b == d.SCROLL_POLICY_AUTO ? "auto" : b == d.SCROLL_POLICY_ON ? "scroll" : "hidden"
    };
    a.prototype.getVerticalScrollPosition = function() {
        return this.domElement.scrollTop
    };
    a.prototype.setVerticalScrollPosition = function(b) {
        return this.domElement.scrollTop = b
    };
    a.prototype.getHorizontalScrollPosition = function() {
        return this.domElement.scrollLeft
    };
    a.prototype.setHorizontalScrollPosition = function(b) {
        return this.domElement.scrollLeft = b
    };
    a.prototype.getAutomationName = function() {
        return this.domElement.id
    };
    a.prototype.setAutomationName = function(b) {
        return this.domElement.id = b
    };
    a.prototype.getData = function() {
        return this.data
    };
    a.prototype.setData = function(b) {
        this.data = b
    };
    a.prototype.setErrorString = function(b) {
        (this.errorString = b) ? (this._prevBorder = this.domElement.style.border, this.domElement.style.border = "solid 1px red") : this.errorString || (this.domElement.style.border = this._prevBorder)
    };
    a.prototype.getErrorString = function() {
        return this.errorString
    };
    a.prototype.setHandCursor = function(b) {
        (this.handCursor = b) ? c.attachClass(this.domElement, "handCursor") : c.detachClass(this.domElement, "handCursor")
    };
    a.prototype.getHandCursor = function() {
        return this.handCursor
    };
    a.prototype.setToolTip = function(b) {
        this.toolTip = b;
        this.domElement.title = b
    };
    a.prototype.getHandCursor = function() {
        return this.toolTip
    };
    a.prototype.ownsPoint = function(b) {
        b = this.globalToLocal(b);
        return b.x > (this.getWidth() || this.domElement.offsetWidth) || b.y > (this.getHeight() || this.domElement.offsetHeight) || 0 > b.x || 0 > b.y ? !1 : !0
    }
})();
(function() {
    var a, c;
    a = function() {
        flexiciousNmsp.EventDispatcher.apply(this);
        this.invalidObjects = [];
        this.updatePending = -1;
        this.documentComponent = new flexiciousNmsp.UIComponent;
        this.documentComponent.setDomElement(document);
        this.documentComponent.addEventListener(this, "mousedown", function() {
            a.isMouseDown++
        });
        this.documentComponent.addEventListener(this, "mouseup", function() {
            a.isMouseDown--
        });
        this.documentComponent.addEventListener(this, "mousemove", function(d) {
            a.pageX = d.pageX;
            a.pageY = d.pageY
        })
    };
    flexiciousNmsp.DisplayList = a;
    a.prototype = new flexiciousNmsp.EventDispatcher;
    a.prototype.typeName = a.typeName = "DisplayList";
    a.prototype.getClassNames = function() {
        return ["TypedObject", "EventDispatcher", this.typeName]
    };
    a.isMouseDown = 0;
    c = new a;
    a.instance = function() {
        return c
    };
    a.prototype.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this)
    };
    a.prototype.addInvalidObject = function(a) {
        if (-1 === this.updatePending) {
            var b = this;
            this.updatePending = setTimeout(function() {
                b.validateObjects()
            }, 1)
        }
        this.invalidObjects.push(a)
    };
    a.prototype.removeInvalidObject = function(a) {
        a = this.invalidObjects.indexOf(a);
        0 <= a && this.invalidObjects.splice(a, 1)
    };
    a.prototype.validateObjects = function() {
        -1 !== this.updatePending && window.clearTimeout(this.updatePending);
        for (this.updatePending = -1; 0 < this.invalidObjects.length;) {
            var a = this.invalidObjects.shift();
            a.domElement && a.render()
        }
    };
    a.prototype.validateNow = function(a) {
        var b = this.invalidObjects.indexOf(a);
        0 <= b && (a.render(), this.invalidObjects.splice(b, 1))
    }
})();
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(b) {
        this.tooltipWatcher = this.currentTooltipTrigger = this.currentTooltip = null;
        this.tooltipWatcherTimeout = 1E3;
        this.ownerComponent = b;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.TooltipBehavior = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "TooltipBehavior";
    a.prototype.getClassNames = function() {
        return ["TooltipBehavior", "TypedObject"]
    };
    a.prototype.showTooltip = function(b, a, f, e, h, j, k, l, m) {
        this.currentTooltip && this.hideTooltip();
        a.implementsOrExtends("IExtendedTooltip") && (a.tooltipOwner = this.ownerComponent);
        this.currentTooltip = a;
        this.currentTooltipTrigger = b;
        m || (m = c.getTopLevelApplication());
        c.addChild(m, this.currentTooltip);
        c.checkSetterAndApply(a, "data", f);
        c.checkSetterAndApply(a, "grid", this.ownerComponent);
        c.showTooltip(b, a, f, e, h, j, k, l, m, this.ownerComponent);
        this.tooltipWatcher = new flexiciousNmsp.Timer(this.tooltipWatcherTimeout);
        this.tooltipWatcher.addEventListener(this, d.EVENT_TIMER, function() {
            if (this.ownerComponent) if (this.currentTooltip) {
                var b = !1,
                    b = new flexiciousNmsp.Point(flexiciousNmsp.DisplayList.pageX, flexiciousNmsp.DisplayList.pageY);
                (b = this.currentTooltip.ownsPoint(b) || this.currentTooltipTrigger.ownsPoint(b)) || this.hideTooltip()
            } else this.hideTooltip();
            else this.tooltipWatcher.stop(), this.tooltipWatcher = null
        });
        this.tooltipWatcher.start()
    };
    a.prototype.hideTooltip = function() {
        this.tooltipWatcher && (this.tooltipWatcher.running && this.tooltipWatcher.stop(), this.tooltipWatcher.kill(), this.tooltipWatcher = null);
        this.currentTooltip && (c.removeChild(c.getTopLevelApplication(), this.currentTooltip), "destroy" in this.currentTooltip && this.currentTooltip.destroy.apply(), this.currentTooltip = this.currentTooltipTrigger = null)
    };
    a.prototype.kill = function() {
        this.hideTooltip();
        this.ownerComponent = this.tooltipWatcher = this.currentTooltipTrigger = this.currentTooltip = this.ownerComponent = null
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(b) {
        this.ownerComponent = b;
        b.addEventListener(this, d.EVENT_CREATION_COMPLETE, this.onOwnerCreationComplete);
        flexiciousNmsp.TypedObject.apply(this);
        this.label = new flexiciousNmsp.Label;
        c.attachClass(this.label.domElement, "spinnerLabel");
        this.spinnerVisible = !1
    };
    flexiciousNmsp.SpinnerBehavior = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "SpinnerBehavior";
    a.prototype.getClassNames = function() {
        return ["SpinnerBehavior", "TypedObject"]
    };
    a.prototype.onOwnerCreationComplete = function(b) {
        b = b.currentTarget;
        b.showSpinnerOnFilterPageSort && b.showSpinner()
    };
    a.prototype.showSpinner = function(b) {
        "undefined" == typeof b && (b = "");
        for (var a = this.ownerComponent.getElementsToBlur(), d = 0; d < a.length; d++) {
            var e = a[d];
            c.attachClass(e.domElement || e, "lessOpacity")
        }
        a = this.ownerComponent.getStyle("spinnerRadius") || 10;
        d = this.ownerComponent.getStyle("spinnerColors") || "#000";
        "" == b && (b = this.ownerComponent.spinnerLabel);
        a = {
            lines: 13,
            length: 7,
            width: 4,
            radius: a,
            corners: 1,
            rotate: 0,
            color: d,
            speed: 1,
            trail: 60,
            shadow: !1,
            hwaccel: !1,
            className: "spinner",
            zIndex: 2E9,
            top: "auto",
            left: "auto"
        };
        this.spinner || (this.ownerComponent.spinnerFactory.properties = a, this.spinner = this.ownerComponent.spinnerFactory.newInstance(), this.spinner.grid = this.ownerComponent);
        this.spinner.spin(this.ownerComponent.domElement);
        b && (this.ownerComponent.addChild(this.label), this.label.setText(b), c.positionComponent(this.spinner.el || this.spinner.domElement, this.label, "center top", "center bottom", 0, 30));
        this.spinnerVisible = !0
    };
    a.prototype.showMessage = function(b) {
        this.spinner && this.spinner.stop();
        this.label.parent && c.removeChild(this.ownerComponent, this.label);
        this.ownerComponent.addChild(this.label);
        this.label.setText(b);
        c.positionComponent(this.ownerComponent, this.label, "center center", "center center", 0, 30)
    };
    a.prototype.hideSpinner = function() {
        this.label.parent && c.removeChild(this.ownerComponent, this.label);
        if (this.spinner) {
            this.spinner.stop();
            for (var b = this.ownerComponent.getElementsToBlur(), a = 0; a < b.length; a++) {
                var d = b[a];
                d.domElement && c.detachClass(d.domElement, "lessOpacity")
            }
        }
        this.spinnerVisible = !1
    };
    a.prototype.kill = function() {
        this.hideSpinner();
        this.ownerComponent = null;
        this.label && this.label.kill();
        this.spinner = this.label = null
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.pageSize = 20;
        this.pageIndex = -1;
        this.pageCount = 1;
        this.recordCount = null;
        this.filterExpressions = [];
        this.sorts = [];
        this.records = this.filterDescrption = null;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.Filter = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "Filter";
    a.prototype.getClassNames = function() {
        return ["Filter ", "TypedObject"]
    };
    a.ALL_ITEM = "All";
    a.prototype.copyFrom = function(a) {
        this.filterDescrption = a.filterDescrption;
        this.pageSize = a.pageSize;
        this.pageIndex = a.pageIndex;
        this.pageCount = a.pageCount;
        this.recordCount = a.recordCount;
        for (var b = [], g = 0, g = 0; g < a.filterExpressions.length; g++) {
            var f = a.filterExpressions[g],
                e = new flexiciousNmsp.FilterExpression;
            e.copyFrom(f);
            (null != e.expression || e.filterControlValue) && b.push(e)
        }
        this.filterExpressions = b;
        if (a = a.sorts) {
            b = [];
            for (g = 0; g < a.length; g++) f = a[g], e = new flexiciousNmsp.FilterSort, e.copyFrom(f), b.push(e);
            this.sorts = b
        }
    };
    a.prototype.addSort = function(a, b, g, f) {
        "undefined" == typeof g && (g = "auto");
        "undefined" == typeof f && (f = null);
        for (var e = 0; e < this.sorts.length; e++) {
            var c = this.sorts[e];
            if (c.sortColumn == a) {
                c.isAscending = b;
                c.sortComparisionType = g;
                c.sortCompareFunction = f;
                return
            }
        }
        e = new flexiciousNmsp.FilterSort;
        e.sortColumn = a;
        e.isAscending = b;
        e.sortComparisionType = g;
        e.sortCompareFunction = f;
        this.sorts.push(e)
    };
    a.prototype.addCriteria = function(a, b) {
        this.addOperatorCriteria(a, FilterExpression.FILTER_OPERATION_TYPE_EQUALS, b)
    };
    a.prototype.addOperatorCriteria = function(a, b, g, f) {
        "undefined" == typeof f && (f = !1);
        for (var e = 0; e < this.filterExpressions.length; e++) {
            var c = this.filterExpressions[e];
            if (c.columnName == a) {
                c.expression = g;
                c.filterOperation = b;
                return
            }
        }
        this.filterExpressions.push(flexiciousNmsp.FilterExpression.createFilterExpression(this, a, b, g, f))
    };
    a.prototype.addFilterExpression = function(a) {
        this.addOperatorCriteria(a.columnName, a.filterOperation, a.expression, a.wasContains)
    };
    a.prototype.removeCriteria = function(a) {
        a = c.doesArrayContainValue(this.filterExpressions, "ColumnName", a);
        null != a && this.filterExpressions.splice(this.filterExpressions.indexOf(a), 1)
    };
    a.prototype.getFilterValue = function(a) {
        for (var b = 0; b < this.filterExpressions.length; b++) {
            var g = this.filterExpressions[b];
            if (g.columnName == a) return g.filterControlValue ? g.filterControlValue : g.expression
        }
        return null
    };
    a.prototype.getFilterExpression = function(a) {
        for (var b = 0; b < this.filterExpressions.length; b++) {
            var g = this.filterExpressions[b];
            if (g.columnName == a) return g.clone()
        }
        return null
    };
    a.prototype.getFilterExpressions = function() {
        return this.filterExpressions
    };
    a.prototype.setFilterExpressions = function(a) {
        return this.filterExpressions = a
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["select"]);
        this.registered = this.hasSearch = !1;
        this.filterComparisionType = "auto";
        this.filterOperation = this.searchField = null;
        this.filterTriggerEvent = "change";
        this.gridColumn = this.grid = null;
        this.dataField = "data";
        this.labelField = "label";
        this.labelFunction = null;
        this.addAllItemText = flexiciousNmsp.Filter.ALL_ITEM;
        this._selectedValue = null;
        this._selectedValueDirty = !1;
        this._addAllItemDirty = this._addAllItem = !0;
        this._dataProvider = [];
        this._dataProviderDirty = !1;
        this._selectedIndex = -1;
        this._selectedIndexDirty = !1;
        this._selectedItem = null;
        this._selectedItemDirty = !1;
        this.addEventListener(this, d.EVENT_CHANGE, function() {
            var b, a, d;
            if (this.domElement.selectedIndex != this.getSelectedIndex() && (b = this.getDataProvider(), this._selectedIndex = this.domElement.selectedIndex, this.dataField)) {
                this._selectedValue = this.domElement.options[this.domElement.selectedIndex].value;
                for (d = 0; d < b.length; d++) if (a = b[d], c.resolveExpression(a, this.dataField) == this.domElement.options[this.domElement.selectedIndex].value) {
                    this._selectedItem = a;
                    break
                }
            }
        });
        this.addEventListener(this, d.EVENT_KEY_UP, function(b) {
            if (b.keyCode == d.KEYBOARD_UP || b.keyCode == d.KEYBOARD_DOWN) {
                this.selectedIndex = this.domElement.selectedIndex;
                var a = this;
                setTimeout(function() {
                    a.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE));
                    a.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_VALUE_COMMIT))
                }, 100)
            }
        })
    };
    flexiciousNmsp.ComboBox = a;
    a.prototype = new flexiciousNmsp.UIComponent("select");
    a.prototype.typeName = a.typeName = "ComboBox";
    a.prototype.getClassNames = function() {
        return ["ComboBox", "UIComponent", "IFilterControl", "ISingleSelectFilterControl", "ISelectFilterControl"]
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a]);
        this.commitPropertiesAddAllItem();
        this.commitPropertiesSelectedValue();
        this.commitDataProvider()
    };
    a.prototype.clear = function() {
        this.setSelectedIndex(this.getAddAllItem() ? 0 : -1)
    };
    a.prototype.getValue = function() {
        return this.getSelectedValue()
    };
    a.prototype.setValue = function(b) {
        this.setSelectedValue(b)
    };
    a.prototype.commitDataProvider = function() {
        var b = this.domElement,
            a, d;
        if (this._dataProviderDirty) {
            for (this._dataProviderDirty = !1; 0 < b.options.length;) b.options.remove(0);
            var e = this.getDataProvider();
            for (d = 0; d < e.length; d++) a = e[d], b.options[b.options.length] = new Option(this.itemToLabel(a), c.resolveExpression(a, this.dataField)), d == this.getSelectedIndex() && (b.options[d].selected = "selected")
        }
        if (this._selectedItemDirty) {
            this._selectedIndex = -1;
            this._selectedIndexDirty = !0;
            this._selectedItemDirty = !1;
            e = this.getDataProvider();
            for (d = 0; d < e.length; d++) if (a = e[d], a == this.getSelectedItem()) {
                this._selectedIndex = d;
                break
            }
        }
        this._selectedIndexDirty && (this._selectedIndexDirty = !1, b.selectedIndex = this._selectedIndex)
    };
    a.prototype.commitPropertiesSelectedValue = function() {
        a.setSelectedItemFromValue(this)
    };
    a.prototype.setSelectedValue = function(b) {
        if (!this.dataField || 0 == this.dataField.length) throw Error("Cannot set selected value if value is not set");
        this._selectedValue = b;
        this._selectedValueDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getSelectedValue = function() {
        return this._selectedValueDirty ? this._selectedValue : this.getSelectedItem() && this.getSelectedItem().hasOwnProperty(this.dataField) ? this.getSelectedItem()[this.dataField] : null
    };
    a.prototype.commitPropertiesAddAllItem = function() {
        a.addAllItemToDataProvider(this)
    };
    a.prototype.getAddAllItem = function() {
        return this._addAllItem
    };
    a.prototype.setAddAllItem = function(b) {
        this._addAllItem = b;
        this._addAllItemDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.register = function(b) {
        this.registered && b.unRegisterIFilterControl(this);
        b.registerIFilterControl(this);
        this.registered = !0
    };
    a.prototype.getDataProvider = function() {
        return this._dataProvider
    };
    a.prototype.setDataProvider = function(b) {
        this._dataProvider = b;
        this._dataProviderDirty = !0;
        this._addAllItem && this.setAddAllItem(!0);
        this.invalidateDisplayList()
    };
    a.prototype.getSelectedIndex = function() {
        return this._selectedIndex
    };
    a.prototype.setSelectedIndex = function(b) {
        this._selectedIndex = b;
        this._selectedIndexDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getSelectedItem = function() {
        return this._selectedItem
    };
    a.prototype.setSelectedItem = function(b) {
        this._selectedItem = b;
        this._selectedItemDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.itemToLabel = function(b) {
        return null != this.labelFunction ? this.labelFunction(this, b) : a.itemToLabel(this, b)
    };
    a.itemToLabel = function(b, a) {
        return !a ? "" : null != b.labelFunction ? flexiciousNmsp.UIUtils.emptyIfNull(b.labelFunction(a)) : b.labelField || b.dataField ? flexiciousNmsp.UIUtils.emptyIfNull(flexiciousNmsp.UIUtils.resolveExpression(a, b.labelField || b.dataField)) : ""
    };
    a.prototype.onChange = function() {
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE));
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_VALUE_COMMIT))
    };
    a.addAllItemToDataProvider = function(b) {
        if (b._addAllItemDirty) {
            var a = b.getDataProvider();
            if (a && (b._addAllItemDirty = !1, b.getAddAllItem() && null == c.doesArrayContainValue(a, b.dataField, b.addAllItemText))) {
                var a = a.slice(),
                    d = {};
                d[b.labelField] = b.addAllItemText;
                d[b.dataField] = b.addAllItemText;
                d.selected = !0;
                a.splice(0, 0, d);
                b.setDataProvider(a);
                0 < a.length && b.setSelectedItem(a[0])
            }
        }
    };
    a.setSelectedItemFromValue = function(b) {
        var a, d, e, h, j;
        if (b._selectedValueDirty) {
            b._selectedValueDirty = !1;
            j = b.getDataProvider();
            for (d = 0; d < j.length; d++) if (a = j[d], e = c.resolveExpression(a, b.dataField).toString().toLowerCase(), h = b._selectedValue ? b._selectedValue.toString().toLowerCase() : b._selectedValue, e == h) {
                b.setSelectedItem(a);
                return
            }
            b.setSelectedIndex(-1)
        }
    };
    a.prototype.focus = function() {
        c.isIE8() ? setTimeout(this.domElement.focus, 100) : flexiciousNmsp.UIComponent.prototype.focus.apply(this)
    }
})(window);
(function() {
    var a;
    a = function() {
        this._src = "";
        flexiciousNmsp.UIComponent.apply(this, ["img"])
    };
    flexiciousNmsp.Image = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "Image";
    a.prototype.getClassNames = function() {
        return ["Image", "UIComponent"]
    };
    a.prototype.getSource = function() {
        return this._src
    };
    a.prototype.setSource = function(a) {
        this._src = a;
        this.domElement.src = a
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.getHeight = function() {
        return this.height
    }
})(window);
(function() {
    var a;
    a = function() {
        this._text = "";
        flexiciousNmsp.UIComponent.apply(this, ["label"])
    };
    flexiciousNmsp.Label = a;
    a.prototype = new flexiciousNmsp.UIComponent("label");
    a.prototype.typeName = a.typeName = "Label";
    a.prototype.getClassNames = function() {
        return ["Label", "UIComponent"]
    };
    a.prototype.clear = function() {
        this.setText("")
    };
    a.prototype.getValue = function() {
        return this.getText()
    };
    a.prototype.setValue = function(a) {
        this.setText(a)
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.getHeight = function() {
        return this.height
    }
})(window);
(function() {
    var a;
    a = function() {
        this._href = "";
        flexiciousNmsp.UIComponent.apply(this, ["a"])
    };
    flexiciousNmsp.Anchor = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "Anchor";
    a.prototype.getClassNames = function() {
        return ["Anchor", "Label", "UIComponent"]
    };
    a.prototype.getHref = function() {
        return this._href
    };
    a.prototype.setHref = function(a) {
        this._href = a;
        $(this.domElement).attr("href", a)
    }
})(window);
(function() {
    var a = function() {
            flexiciousNmsp.UIComponent.apply(this, ["div"]);
            this.setWidth(400);
            this.setHeight(150);
            this.invalidateDisplayList();
            this.endDate = this.startDate = null;
            this.dateFormatString = flexiciousNmsp.Constants.DEFAULT_DATE_FORMAT;
            this.combo = null
        },
        c = a.prototype = new flexiciousNmsp.UIComponent,
        d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c.getClassNames = function() {
        return ["DateRangePicker", "UIComponent"]
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a]);
        if (null != this.domElement.parentElement) {
            this.setInnerHTML('<div class="flexiciousGrid flexiciousDatePickerPopup"><div class="datePickerBar"><div class="datePickerStartDate"><input class="datePickerStartDateInput"></div><div class="datePickerEndDate"><input class="datePickerEndDateInput"></div></div><div  class="datePickerButtonBar " ><span class="datePickerButton okBtn button" >Ok</span><span class="datePickerButton cancelBtn button" >Cancel</span></div></div>');
            var f = new Date,
                c = new Date;
            this.combo && (c = new flexiciousNmsp.DateRange(this.combo.defaultDateRangeForDatePicker, null, null), f = this.combo.customDateRange.startDate ? this.combo.customDateRange.startDate : c.startDate, c = this.combo.customDateRange.endDate ? this.combo.customDateRange.endDate : c.endDate);
            this.startDate = f;
            this.endDate = c;
            var m = this;
            d.adapter.createDateTimePicker(d.adapter.getElementByClassName(this.domElement, "datePickerStartDateInput"), this.dateFormatString, f, function(b) {
                m.startDate = b
            }, !0);
            d.adapter.createDateTimePicker(d.adapter.getElementByClassName(this.domElement, "datePickerEndDateInput"), this.dateFormatString, c, function(b) {
                m.endDate = b
            }, !0);
            d.addDomEventListener(this, d.adapter.getElementByClassName(this.domElement, "cancelBtn"), "click", g);
            d.addDomEventListener(this, d.adapter.getElementByClassName(this.domElement, "okBtn"), "click", e)
        }
    };
    var g = function(b) {
            f(b)
        },
        f = function(b) {
            d.removePopUp(d.adapter.findAncestorByClassName(b.currentTarget || b.srcElement, "flexiciousDatePickerPopup").parentNode)
        },
        e = function(a) {
            var g = d.adapter.findAncestorByClassName(a.currentTarget || a.srcElement, "flexiciousDatePickerPopup").parentNode;
            d.adapter.getElementByClassName(g, "datePickerStartDateInput") && (g.component.startDate = d.adapter.getDateValue(d.adapter.getElementByClassName(g, "datePickerStartDateInput").value, g.component.dateFormatString), g.component.endDate = d.adapter.getDateValue(d.adapter.getElementByClassName(g, "datePickerEndDateInput").value, g.component.dateFormatString));
            null != g.component.startDate && null != g.component.endDate && g.component.startDate < g.component.endDate ? (g.component.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(b.EVENT_CHANGE)), f(a)) : d.showMessage("Please select start date and end date, and ensure start date is before end date.")
        };
    flexiciousNmsp.DateRangePicker = a
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        this._text = "";
        flexiciousNmsp.ComboBox.apply(this, ["select"]);
        this.addAllItem = !0;
        this.customDateRange = new flexiciousNmsp.DateRange(flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM, null, null);
        this._dateRangeOptions = this.dateRange = this.popup = null;
        this.dateFormatString = d.DEFAULT_DATE_FORMAT;
        this.defaultDateRangeForDatePicker = flexiciousNmsp.DateRange.DATE_RANGE_LAST_7_DAYS;
        this.showTimePicker = !1;
        this.setDateRangeOptions([flexiciousNmsp.DateRange.DATE_RANGE_LAST_SIXTY_MINTUES, flexiciousNmsp.DateRange.DATE_RANGE_LAST_24_HOURS, flexiciousNmsp.DateRange.DATE_RANGE_LAST_7_DAYS, flexiciousNmsp.DateRange.DATE_RANGE_LASTHOUR, flexiciousNmsp.DateRange.DATE_RANGE_THISHOUR, flexiciousNmsp.DateRange.DATE_RANGE_NEXTHOUR, flexiciousNmsp.DateRange.DATE_RANGE_YESTERDAY, flexiciousNmsp.DateRange.DATE_RANGE_TODAY, flexiciousNmsp.DateRange.DATE_RANGE_TOMORROW, flexiciousNmsp.DateRange.DATE_RANGE_LASTWEEK, flexiciousNmsp.DateRange.DATE_RANGE_THISWEEK, flexiciousNmsp.DateRange.DATE_RANGE_NEXTWEEK, flexiciousNmsp.DateRange.DATE_RANGE_LASTMONTH, flexiciousNmsp.DateRange.DATE_RANGE_THISMONTH, flexiciousNmsp.DateRange.DATE_RANGE_NEXTMONTH, flexiciousNmsp.DateRange.DATE_RANGE_LASTQUARTER, flexiciousNmsp.DateRange.DATE_RANGE_THISQUARTER, flexiciousNmsp.DateRange.DATE_RANGE_NEXTQUARTER, flexiciousNmsp.DateRange.DATE_RANGE_LASTYEAR, flexiciousNmsp.DateRange.DATE_RANGE_THISYEAR, flexiciousNmsp.DateRange.DATE_RANGE_NEXTYEAR, flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM]);
        this.filterComparisionType = flexiciousNmsp.FilterExpression.FILTER_COMPARISION_TYPE_DATE;
        this.addEventListener(this, d.EVENT_MOUSE_CLICK, this.onClick)
    };
    flexiciousNmsp.DateComboBox = a;
    a.prototype = new flexiciousNmsp.ComboBox;
    a.prototype.typeName = a.typeName = "DateComboBox";
    a.prototype.getClassNames = function() {
        return "DateComboBox ComboBox UIComponent IFilterControl IDateComboBox IRangeFilterControl ISingleSelectFilterControl ISelectFilterControl".split(" ")
    };
    a.DROPDOWN_BUTTON_WIDTH = 16;
    a.prototype.onClick = function(b) {
        var g = b.triggerEvent.currentTarget || b.triggerEvent.srcElement,
            f = this.getSelectedItem();
        f && f[this.dataField] == flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM && !(b.localX > g.offsetWidth - a.DROPDOWN_BUTTON_WIDTH) && (this.popup = new flexiciousNmsp.DateRangePicker, this.popup.combo = this, this.popup.addEventListener(this, d.EVENT_CHANGE, this.onDatePicker), this.popup.grid = this.grid, this.popup.dateFormatString = this.dateFormatString, c.addPopUp(this.popup, this.domElement, !0, null, "Select Date"), b.triggerEvent.preventDefault())
    };
    a.prototype.onDatePicker = function(b) {
        this.customDateRange.startDate = this.popup.startDate;
        this.customDateRange.endDate = this.popup.endDate;
        this.dispatchEvent(b)
    };
    a.prototype.getValue = function() {
        if (this.getSelectedValue() == flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM) {
            var b = new flexiciousNmsp.DateRange(this.defaultDateRangeForDatePicker, null, null);
            return flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM + "__" + (this.customDateRange.startDate ? this.customDateRange.startDate.toString() : b.startDate.toString()) + "__" + (this.customDateRange.endDate ? this.customDateRange.endDate.toString() : b.endDate)
        }
        return flexiciousNmsp.ComboBox.prototype.getValue.apply(this)
    };
    a.prototype.setValue = function(b) {
        if (0 == b.toString().indexOf(flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM)) {
            var a = b.toString().split("__");
            3 == a.length ? (flexiciousNmsp.ComboBox.prototype.setValue.apply(this, [a[0]]), this.customDateRange.startDate = new Date(Date.parse(a[1].toString())), this.customDateRange.endDate = new Date(Date.parse(a[2].toString()))) : flexiciousNmsp.ComboBox.prototype.setValue.apply(this, [b])
        } else flexiciousNmsp.ComboBox.prototype.setValue.apply(this, [b])
    };
    a.prototype.getSearchRangeStart = function() {
        return this.getDateRange() ? this.getDateRange().startDate : null
    };
    a.prototype.getSearchRangeEnd = function() {
        return this.getDateRange() ? this.getDateRange().endDate : null
    };
    a.prototype.getMaxValue = function() {
        return new Date(2099, 1, 1)
    };
    a.prototype.getMinValue = function() {
        return new Date(1970, 1, 1)
    };
    a.prototype.getDateRange = function() {
        var b = this.getSelectedItem();
        if (null != b && b[this.labelField].toString() != this.addAllItemText) {
            if (b[this.dataField] == flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM) return null != this.customDateRange.startDate && null != this.customDateRange.endDate && this.customDateRange.startDate.getTime() != this.customDateRange.endDate.getTime() ? this.customDateRange : null;
            this.customDateRange = new flexiciousNmsp.DateRange(flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM, null, null);
            return new flexiciousNmsp.DateRange(b[this.dataField], null, null)
        }
        return null
    };
    a.prototype.setDateRange = function(b) {
        if (null != b) for (var a = this.getDataProvider(), d = 0; d < a.length; d++) {
            var e = a[d];
            if (e.data == b.dateRangeType) {
                this.setSelectedItem(e);
                break
            }
        }
    };
    a.prototype.setDateRangeOptions = function(b) {
        this._dateRangeOptions = b;
        b = [];
        for (var a = 0; a < this._dateRangeOptions.length; a++) {
            var d = this._dateRangeOptions[a];
            b.push({
                label: d,
                data: d
            })
        }
        this.setDataProvider(b)
    };
    a.prototype.getDateRangeOptions = function() {
        return this._dateRangeOptions
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["span"]);
        this.setInnerHTML("<input class='textBox' type='text'/><img class='insideIcon inputIcon'/><img class='outsideIcon inputIcon' style='visibility: hidden' />");
        this.registered = this.hasSearch = !1;
        this.filterComparisionType = "auto";
        this.filterOperation = this.searchField = null;
        this.filterTriggerEvent = "enterKeyUp";
        this.gridColumn = this.grid = null;
        this.delayDuration = 500;
        this.enableDelayChange = !0;
        this.clearTextOnIconClick = this.showIconWhenHasText = !1;
        this.outsideIconPosition = this.outsideIcon = this.insideIconPosition = this.insideIcon = this.onOutsideIconClick = this.onInsideIconClick = this.idValue = this.inputMaskOptions = this.inputMask = this.autoCompleteSource = this.autoCompleteOptions = this.enableAutoComplete = null;
        this.iconGap = 2;
        this.autoCompleteStyleName = null;
        this.watermark = "";
        this.watermarkStyle = "watermarkStyle";
        this.watermarkOptions = {};
        this.iconHeight = this.iconWidth = 12;
        this.addEventListener(this, d.EVENT_KEY_UP, function(b) {
            b = String.fromCharCode(b.keyCode);
            ("0" <= b && "9" >= b || "a" <= b && "z" >= b || "A" <= b && "Z" >= b) && this.dispatchEvent(new flexiciousNmsp.BaseEvent(d.EVENT_VALUE_COMMIT))
        });
        this.addEventListener(this, d.EVENT_KEY_DOWN, function(b) {
            this.textBoxValue = this.getTextBox().value;
            b = String.fromCharCode(b.keyCode);
            ("0" <= b && "9" >= b || "a" <= b && "z" >= b || "A" <= b && "Z" >= b) && this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE))
        })
    };
    flexiciousNmsp.TextInput = a;
    a.prototype = new flexiciousNmsp.UIComponent("span");
    a.prototype.typeName = a.typeName = "TextInput";
    a.prototype.getClassNames = function() {
        return ["TextInput", "UIComponent", "IFilterControl", "ITextFilterControl", "IDelayedChange"]
    };
    a.INSIDE_ICON_CLICK = "insideIconClick";
    a.OUTSIDE_ICON_CLICK = "outsideIconClick";
    a.AUTO_COMPLETE_MATCH_TYPE_BEGINS_WITH = "BeginsWith";
    a.AUTO_COMPLETE_MATCH_TYPE_ENDS_WITH = "EndsWith";
    a.AUTO_COMPLETE_MATCH_TYPE_CONTAINS = "Contains";
    a.prototype.dispatchEvent = function(b) {
        this.enableDelayChange && (b.type == d.EVENT_KEY_UP && this.textBoxValue != this.getTextBox().value) && (null == this.timerInstance && (this.timerInstance = new flexiciousNmsp.Timer(this.delayDuration, 1), this.timerInstance.addEventListener(this, d.EVENT_TIMER_COMPLETE, this.onTimerComplete, !1, 0, !0)), this.timerInstance.reset(), this.timerInstance.repeatCount = 1, this.timerInstance.start());
        return flexiciousNmsp.UIComponent.prototype.dispatchEvent.apply(this, [b])
    };
    a.prototype.onTimerComplete = function() {
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("delayedChange"));
        this.timerInstance && (this.timerInstance.stop(), this.timerInstance = null)
    };
    a.prototype.clear = function() {
        this.getTextBox().value = ""
    };
    a.prototype.getValue = function() {
        return this.getTextBox().value == this.watermark ? "" : this.getTextBox().value
    };
    a.prototype.setValue = function(b) {
        this.getTextBox().value = null != b ? b.toString() : ""
    };
    a.prototype.getTextBox = function() {
        return c.adapter.findElementWithClassName(this.domElement, "textBox")
    };
    a.prototype.getInsideIcon = function() {
        return c.adapter.findElementWithClassName(this.domElement, "insideIcon")
    };
    a.prototype.getOutsideIcon = function() {
        return c.adapter.findElementWithClassName(this.domElement, "outsideIcon")
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var b = this.getTextBox();
        flexiciousNmsp.UIUtils.addDomEventListener(this, b, d.EVENT_KEY_UP, this.setIconVisible);
        this.enableAutoComplete && (this.autoCompleteOptions || (this.autoCompleteOptions = {}), this.autoCompleteOptions.autoCompleteSource = this.autoCompleteSource, c.adapter.setupAutoComplete(b, this.autoCompleteOptions));
        this.inputMask && (this.inputMaskOptions || (this.inputMaskOptions = {}), this.inputMaskOptions.mask = this.inputMask, c.adapter.setupInputMask(b, this.inputMaskOptions));
        this.watermark && (this.watermarkOptions || (this.watermarkOptions = {}), this.watermarkOptions.watermark = this.watermark, this.watermarkOptions.watermarkStyle = this.watermarkStyle, c.adapter.setupWaterMark(b, this.watermarkOptions))
    };
    a.prototype.setIconVisible = function(b) {
        b = b ? (b.srcElement || b.currentTarget).parentNode.component : this;
        b.showIconWhenHasText && b.getInsideIcon() && (b.getInsideIcon().style.visibility = 0 < b.getTextBox().value.length && b.getTextBox().value != b.watermark ? "visible" : "hidden")
    };
    a.prototype.setDataProvider = function(b) {
        this.autoCompleteSource = b
    };
    a.prototype.updateDisplayList = function(b, a) {
        var d = this.getInsideIcon(),
            e = this.getTextBox(),
            c = this.getInsideIcon();
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a]);
        this.getStyle("insideIcon") ? (d.src = this.getStyle("insideIcon"), d.style.top = Math.ceil((this.getHeight() - this.iconHeight) / 2) + "px", d.style.width = this.iconWidth + "px", d.style.height = this.iconHeight + "px", this.setIconVisible(null), d.style.visibility = "") : d && (d.style.visibility = "hidden");
        this.getStyle("outsideIcon") ? (c.src = this.getStyle("outsideIcon"), c.style.top = Math.ceil((this.getHeight() - this.iconHeight) / 2) + "px", c.style.width = this.iconWidth + "px", c.style.height = this.iconHeight + "px", c.style.visibility = "") : c && (c.style.visibility = "hidden");
        if (c || d) {
            var j = this.getStyle("iconGap");
            null == j && (j = 2);
            var k = this.getWidth() - (this.outsideIcon ? this.iconWidth + j : 0) - 2;
            e.style.width = (0 < k ? k : 0) + "px";
            e.style.height = this.getHeight() + "px";
            k = "left" == this.getStyle("outsideIconPosition") ? this.iconWidth + j : 0;
            if (this.getStyle("outsideIcon")) {
                var l = this.width - this.iconWidth - j;
                c.style.left = ("left" == this.getStyle("outsideIconPosition") ? 0 : l + k + j) + "px";
                e.style.left = ("left" == this.getStyle("outsideIconPosition") ? c.getX() + this.iconWidth + j + j : j) + "px"
            }
            this.getStyle("insideIcon") && (d.style.left = ("left" == this.getStyle("insideIconPosition") ? j + 1 : this.width - this.iconWidth - j) + "px", e.style.left = ("left" == this.getStyle("insideIconPosition") ? k + j + this.iconWidth + j : k + j) + "px")
        }
    };
    a.prototype.initialize = function() {
        var b = this.getInsideIcon();
        this.getTextBox();
        var a = this.getInsideIcon();
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.getStyle("insideIcon") && (flexiciousNmsp.UIUtils.addDomEventListener(this, b, d.EVENT_CLICK, this.onInsideIcon), flexiciousNmsp.UIUtils.addDomEventListener(this, b, d.EVENT_LOAD, this.onInsideIconLoad));
        this.getStyle("outsideIcon") && (flexiciousNmsp.UIUtils.addDomEventListener(this, a, d.EVENT_CLICK, this.onOutsideIcon), flexiciousNmsp.UIUtils.addDomEventListener(this, a, d.EVENT_LOAD, this.onOutsideIconLoad))
    };
    a.prototype.onInsideIcon = function(b) {
        b = (b.currentTarget || b.srcElement).parentNode.component;
        b.dispatchEvent(new flexiciousNmsp.BaseEvent(a.INSIDE_ICON_CLICK, !0, !0));
        b.clearTextOnIconClick && (b.clear(), b.forceFilter())
    };
    a.prototype.onInsideIconLoad = function() {};
    a.prototype.onOutsideIconLoad = function() {};
    a.prototype.onOutsideIcon = function(b) {
        (b.currentTarget || b.srcElement).parentNode.component.dispatchEvent(new flexiciousNmsp.BaseEvent(a.OUTSIDE_ICON_CLICK, !0, !0))
    };
    a.prototype.forceFilter = function() {
        this.dispatchEvent(new flexiciousNmsp.BaseEvent(d.EVENT_CHANGE, !0, !0));
        var b = new flexiciousNmsp.BaseEvent(d.EVENT_KEY_UP, !0, !0);
        b.keyCode = d.KEYBOARD_ENTER;
        this.dispatchEvent(b)
    };
    a.prototype.focus = function() {
        var b = this.getTextBox();
        try {
            b.focus()
        } catch (a) {}
    };
    a.prototype.getText = function() {
        return this.getTextBox() ? this.getTextBox().value : ""
    };
    a.prototype.setText = function(b) {
        this.getTextBox() && (this.getTextBox().value = b)
    };
    a.prototype.setSelection = function(b, a) {
        var d = this.getTextBox().value,
            e = this.getTextBox();
        "undefined" == typeof b && (b = 0);
        "undefined" == typeof a && (a = d.length);
        0 != d.length && "number" == typeof b && (a = "number" == typeof a ? a : b, e.setSelectionRange ? e.setSelectionRange(b, a) : e.createTextRange && (d = e.createTextRange(), d.collapse(!0), d.moveEnd("character", a), d.moveStart("character", b), d.select()))
    }
})(window);
(function() {
    var a = function(a) {
            flexiciousNmsp.TextInput.apply(this, [a]);
            this.outsideIcon = b.IMAGE_PATH + "/date_picker.png";
            this.addEventListener(this, "outsideIconClick", function() {
                this.focus();
                this.setSelection()
            });
            this.setHeight(25);
            this.changeTimer = null;
            this.enableChangeTimer = !0
        },
        c = a.prototype = new flexiciousNmsp.TextInput,
        d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c.getClassNames = function() {
        return ["DatePicker", "UIComponent"]
    };
    c.selectedDate = null;
    c.dateFormatString = flexiciousNmsp.Constants.DEFAULT_DATE_FORMAT;
    c.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.enableChangeTimer && (this.changeTimer = new flexiciousNmsp.Timer(500), this.changeTimer.addEventListener(this, b.EVENT_TIMER, this.checkChange), this.initialText = this.getText(), this.changeTimer.start())
    };
    c.setValue = function(b) {
        if (null != b) {
            this.selectedDate = b;
            var a = new flexiciousNmsp.DateFormatter;
            a.formatString = this.dateFormatString;
            flexiciousNmsp.TextInput.prototype.setValue.apply(this, [a.format(b)])
        }
    };
    c.getValue = function() {
        return flexiciousNmsp.TextInput.prototype.getValue.apply(this) ? d.adapter.getDateValue(this.getTextBox().value, this.dateFormatString) : this.selectedDate
    };
    c.getSelectedDate = function() {
        return this.getValue()
    };
    c.setSelectedDate = function(b) {
        var a = this;
        d.adapter.createDateTimePickerEditor(this, this.dateFormatString, b, function(b) {
            a.setValue(b)
        }, !1);
        this.selectedDate = b
    };
    c.owns = function(b) {
        return d.adapter.isDatePickerElement(b) ? !0 : flexiciousNmsp.UIComponent.prototype.owns.apply(this, [b]) || d.adapter.isDatePickerElement(b)
    };
    c.checkChange = function() {
        this.initialText != this.getText() && (this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(b.EVENT_CHANGE)), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(b.EVENT_VALUE_COMMIT)))
    };
    c.focus = function() {
        flexiciousNmsp.TextInput.prototype.focus.apply(this);
        var b = d.adapter.getCurrentDatePicker();
        b && b.focus()
    };
    c.kill = function() {
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        this.changeTimer && this.changeTimer.kill()
    };
    flexiciousNmsp.DatePicker = a
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["span"]);
        this.setInnerHTML("&nbsp;");
        this.registered = this.hasSearch = !1;
        this.filterComparisionType = "auto";
        this.filterOperation = this.searchField = null;
        this.filterTriggerEvent = "change";
        this.gridColumn = this.grid = null;
        this.delayDuration = 500;
        this.enableDelayChange = !0;
        this._selected = this.allowUserToSelectMiddle = this.radioButtonMode = !1;
        this._toggle = !0;
        this._selectedSet = this._middle = !1;
        this.addEventListener(this, "change", function() {});
        this.addEventListener(this, d.EVENT_CLICK, function(b) {
            this.clickHandler(b);
            this.invalidateDisplayList()
        });
        this.cbClass = "";
        c.attachClass(this.domElement, "unSelectableText")
    };
    flexiciousNmsp.TriStateCheckBox = a;
    a.prototype = new flexiciousNmsp.UIComponent("span");
    a.prototype.typeName = a.typeName = "TriStateCheckBox";
    a.prototype.getClassNames = function() {
        return ["TriStateCheckBox", "UIComponent", "IFilterControl", "ITriStateCheckBoxFilterControl", "IDelayedChange"]
    };
    a.STATE_CHECKED = "checked";
    a.STATE_UNCHECKED = "unchecked";
    a.STATE_MIDDLE = "middle";
    a.prototype.dispatchEvent = function(b) {
        this.enableDelayChange && b.type == d.EVENT_CHANGE && (null == this.timerInstance && (this.timerInstance = new flexiciousNmsp.Timer(this.delayDuration), this.timerInstance.addEventListener(this, d.EVENT_TIMER_COMPLETE, this.onTimerComplete, !1, 0, !0)), this.timerInstance.reset(), this.timerInstance.repeatCount = 1, this.timerInstance.start());
        return flexiciousNmsp.UIComponent.prototype.dispatchEvent.apply(this, [b])
    };
    a.prototype.onTimerComplete = function() {
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("delayedChange"));
        this.timerInstance.stop();
        this.timerInstance = null
    };
    a.prototype.clear = function() {
        this.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE)
    };
    a.prototype.getValue = function() {
        return this.getSelectedState()
    };
    a.prototype.setValue = function(b) {
        this.setSelectedState(b)
    };
    a.prototype.getSelectedState = function() {
        return this.getMiddle() ? flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE : this.getSelected() ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED
    };
    a.prototype.setMiddle = function(b) {
        this._selectedSet = !0;
        this._middle != b && (this._selected = !1, this._middle = b, this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE)), this.invalidateDisplayList())
    };
    a.prototype.getMiddle = function() {
        return this._middle
    };
    a.prototype.setSelectedState = function(b) {
        this._selectedSet = !0;
        b == flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE ? (this._middle = !0, this._selected = !1) : b == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED ? (this._selected = !0, this._middle = !1) : b == flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED && (this._middle = this._selected = !1);
        this.invalidateDisplayList()
    };
    a.prototype.setActualSize = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.setActualSize.apply(this, [b, a]);
        this.domElement.style.left = (this.getWidth() - 12) / 2 + "px";
        this.domElement.style.top = (this.getHeight() - 12) / 2 + "px"
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.getHeight = function() {
        return this.height
    };
    a.prototype.clickHandler = function(b) {
        this.getEnabled() ? (this._toggle && (this.allowUserToSelectMiddle ? this.getMiddle() ? this.getSelected() ? this.setMiddle(!1) : (this.setMiddle(!1), this.setSelected(!0)) : this.getSelected() ? this.setSelected(!1) : this.setMiddle(!0) : (this.setMiddle(!1), this.setSelected(!this.getSelected()))), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE))) : b.stopPropagation()
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a]);
        this.cbClass && c.detachClass(this.domElement, this.cbClass);
        this.cbClass = this.radioButtonMode ? this.getEnabled() ? this.getSelected() ? "radioSelected" : "radio" : this.getSelected() ? "radioSelectedDisabled" : "radioDisabled" : this.getMiddle() ? this.getEnabled() ? "checkBoxMiddle" : "checkBoxMiddleDisabled" : this.getEnabled() ? this.getSelected() ? "checkBoxSelected" : "checkBox" : this.getSelected() ? "checkBoxSelectedDisabled" : "checkBoxDisabled";
        c.attachClass(this.domElement, this.cbClass)
    };
    a.prototype.setSelected = function(b) {
        this._selectedSet = !0;
        this._selected != b && (this._selected = b, this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE)), this.invalidateDisplayList())
    };
    a.prototype.getSelected = function() {
        return this._selected
    };
    a.prototype.kill = function() {
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        this.gridColumn = this.grid = null;
        this.timerInstance && this.timerInstance.stop();
        this.timerInstance = null
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(b) {
        flexiciousNmsp.TextInput.apply(this, [b]);
        this.registered = this.hasSearch = !1;
        this.filterComparisionType = "auto";
        this.filterOperation = this.searchField = null;
        this.filterTriggerEvent = "change";
        this.gridColumn = this.grid = null;
        this.selectedValues = [];
        this.highlightedRowIndex = -1;
        this.outsideIcon = d.IMAGE_PATH + "/downArrowIcon.png";
        this.iconHeight = 19;
        this.iconWidth = 16;
        this.dataField = "data";
        this.dropdownWidth = -1;
        this.labelField = "label";
        this.labelFunction = null;
        this.addAllItemText = d.DEFAULT_ALL_ITEM_TEXT;
        this.alwaysVisible = !1;
        this.defaultWidth = 100;
        this._addAllItem = !0;
        this.popup = this._previousValue = null;
        this.addEventListener(this, d.EVENT_CLICK, function(b) {
            b.triggerEvent.target == this.getTextBox() && this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.TextInput.OUTSIDE_ICON_CLICK))
        });
        this.addEventListener(this, d.EVENT_KEY_UP, function(b) {
            var a;
            if (b.triggerEvent.target == this.getTextBox()) if (b.keyCode == d.KEYBOARD_SPACE) this.popup ? (a = c.adapter.findElementsWithClassName(this.popup.domElement, c.doLower(flexiciousNmsp.TriStateCheckBox.typeName)), 0 <= this.highlightedRowIndex && this.highlightedRowIndex < this.getDataProvider().length && a[this.highlightedRowIndex].component.clickHandler(b)) : this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("outsideIconClick"));
            else if (b.keyCode == d.KEYBOARD_ENTER) {
                if (this.popup) this.onOkButton()
            } else b.keyCode == d.KEYBOARD_ESCAPE ? this.popup && this.destroyPopup() : b.keyCode == d.KEYBOARD_UP && 0 < this.getDataProvider().length ? this.popup && (a = c.adapter.findElementsWithClassName(this.popup.domElement, c.doLower(flexiciousNmsp.TriStateCheckBox.typeName)), 0 < this.highlightedRowIndex && this.highlightRow(a[this.highlightedRowIndex - 1])) : b.keyCode == d.KEYBOARD_DOWN && 0 < this.getDataProvider().length && (this.popup && this.popup) && (a = c.adapter.findElementsWithClassName(this.popup.domElement, c.doLower(flexiciousNmsp.TriStateCheckBox.typeName)), this.highlightedRowIndex < this.getDataProvider().length - 1 && this.highlightRow(a[this.highlightedRowIndex + 1]))
        });
        this.addEventListener(this, flexiciousNmsp.TextInput.OUTSIDE_ICON_CLICK, function() {
            this.showPopup()
        })
    };
    flexiciousNmsp.MultiSelectComboBox = a;
    a.prototype = new flexiciousNmsp.TextInput;
    a.prototype.typeName = a.typeName = "MultiSelectComboBox";
    a.prototype.getClassNames = function() {
        return ["MultiSelectComboBox", "UIComponent", "IFilterControl", "IMultiSelectFilterControl", "ISelectFilterControl"]
    };
    a.prototype.showPopup = function(b) {
        if (this.popup) this.destroyPopup();
        else {
            this._previousValue = this.getValue().slice();
            flexiciousNmsp.ComboBox.addAllItemToDataProvider(this);
            var a = new flexiciousNmsp.UIComponent("div");
            a.domElement.className = "multiSelectComboBoxPopup";
            var f = this.getDataProvider();
            if (f && 0 < f.length) {
                for (var e = 0; e < f.length; e++) {
                    var h = f[e],
                        j = new flexiciousNmsp.UIComponent("div");
                    j.domElement.className = "checkBoxRow";
                    var k = new flexiciousNmsp.TriStateCheckBox,
                        h = flexiciousNmsp.ComboBox.itemToLabel(this, h);
                    k.allowUserToSelectMiddle = !1;
                    k.delayDuration = 100;
                    k.domElement.innerHTML = h;
                    k.addEventListener(this, d.EVENT_MOUSE_OVER, function(b) {
                        this.highlightRow(b.triggerEvent.currentTarget || b.triggerEvent.srcElement)
                    });
                    k.addEventListener(this, "delayedChange", function(b) {
                        var a = b.target;
                        b = c.adapter.findElementsWithClassName(this.popup.domElement, c.doLower(flexiciousNmsp.TriStateCheckBox.typeName)).indexOf(a.domElement);
                        b = this.getDataProvider()[b];
                        b = c.resolveExpression(b, this.dataField);
                        var d = this.allUnchecked;
                        this.allUnchecked = a.domElement.innerHTML == this.addAllItemText ? a.getSelectedState() == flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED : !1;
                        if (0 == this.selectedValues.length && !d) {
                            if (a.domElement.innerHTML != this.addAllItemText) for (a = this.getAddAllItem() ? 1 : 0; a < this.getDataProvider().length; a++) d = this.getDataProvider()[a], d = c.resolveExpression(d, this.dataField), d != b && this.selectedValues.push(d)
                        } else a.domElement.innerHTML == this.addAllItemText ? this.selectedValues = [] : a.getSelectedState() == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED && -1 == this.selectedValues.indexOf(b) ? this.selectedValues.push(b) : a.getSelectedState() == flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED && -1 != this.selectedValues.indexOf(b) && this.selectedValues.splice(this.selectedValues.indexOf(b), 1);
                        if (b = c.adapter.findElementWithClassName(this.popup.domElement, "okButton")) b.style.display = this.allUnchecked ? "none" : "";
                        this.updateCheckBoxes()
                    });
                    j.addChild(k);
                    a.addChild(j)
                }
                a.addChild(j)
            }
            f = new flexiciousNmsp.UIComponent("div");
            f.domElement.className = "okCancelDiv";
            f.domElement.innerHTML = "<div class='okCancel'><span class='okButton'>Ok</span><span class='cancelButton'>Cancel</span></div>";
            this.alwaysVisible || a.addChild(f);
            f = new flexiciousNmsp.Point(0, 0);
            f = this.localToGlobal(f);
            b ? f = b.globalToLocal(f) : b = flexiciousNmsp.DisplayList.instance().documentComponent.domElement.body;
            f = new flexiciousNmsp.UIComponent("div");
            f.addChild(a);
            a = f;
            c.addChild(b, a);
            a.setWidth(-1 === this.dropdownWidth ? this.getWidth() : this.dropdownWidth);
            a.domElement.className = "flexiciousGrid";
            c.positionComponent(this.domElement, a.domElement);
            this.popup = a;
            this.popup.addEventListener(this, d.EVENT_CLICK, function(b) {
                if ("okButton" == b.triggerEvent.target.className) this.onOkButton();
                else "cancelButton" == b.triggerEvent.target.className ? (this.setValue(this._previousValue), this.destroyPopup()) : b.triggerEvent.target == this.getTextBox() && this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("outsideIconClick"))
            });
            this.updateCheckBoxes();
            this.alwaysVisible || flexiciousNmsp.DisplayList.instance().documentComponent.addEventListener(this, d.EVENT_MOUSE_UP, this.onDocumentMouseUp)
        }
    };
    a.prototype.clear = function() {
        this.setValue([])
    };
    a.prototype.getValue = function() {
        return this.selectedValues
    };
    a.prototype.setValue = function(b) {
        this.selectedValues = b;
        this.popup ? this.updateCheckBoxes() : this.setLabel()
    };
    a.prototype.getAddAllItem = function() {
        return this._addAllItem
    };
    a.prototype.setAddAllItem = function(b) {
        this._addAllItem = b;
        this._addAllItemDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.updateCheckBoxes = function() {
        for (var b = c.adapter.findElementsWithClassName(this.popup.domElement, c.doLower(flexiciousNmsp.TriStateCheckBox.typeName)), a = 0; a < b.length; a++) {
            var d = b[a],
                e = this.getDataProvider()[a];
            this.allUnchecked ? d.component.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED) : 0 == this.selectedValues.length && this.getAddAllItem() ? d.component.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED) : 0 == a && this.getAddAllItem() ? d.component.setSelectedState(this.selectedValues.length >= this.getDataProvider().length - 1 ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : 0 < this.selectedValues.length ? flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED) : d.component.setSelectedState(0 <= this.selectedValues.indexOf(c.resolveExpression(e, this.dataField)) ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED)
        }
        this.setLabel()
    };
    a.prototype.highlightRow = function(b) {
        var a = c.adapter.findElementsWithClassName(this.popup.domElement, "checkBoxRow"); - 1 !== this.highlightedRowIndex && c.detachClass(a[this.highlightedRowIndex], "hover");
        this.highlightedRowIndex = a.indexOf(b.parentNode);
        c.attachClass(a[this.highlightedRowIndex], "hover")
    };
    a.prototype.onOkButton = function() {
        this.allUnchecked || (this.destroyPopup(), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_CHANGE)), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(d.EVENT_VALUE_COMMIT)))
    };
    a.prototype.destroyPopup = function(b) {
        if (!this.alwaysVisible || b) this.removeChild(this.popup), this.popup = null, flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListener(d.EVENT_MOUSE_UP, this.onDocumentMouseUp)
    };
    a.prototype.onDocumentMouseUp = function(b) {
        this.owns(b.triggerEvent.target) || this.destroyPopup()
    };
    a.prototype.getDataProvider = function() {
        return this._dataProvider
    };
    a.prototype.setDataProvider = function(b) {
        this._dataProvider = b;
        this.getAddAllItem() && (this._addAllItemDirty = !0);
        this.invalidateDisplayList()
    };
    a.prototype.itemToLabel = function(b) {
        return flexiciousNmsp.ComboBox.itemToLabel(this, b)
    };
    a.prototype.updateDisplayList = function() {
        flexiciousNmsp.ComboBox.setSelectedItemFromValue(this);
        flexiciousNmsp.TextInput.prototype.updateDisplayList.apply(this);
        var b = this.getOutsideIcon();
        b.style.top = "1px";
        b.style.display = "none";
        b = this.getInsideIcon();
        b.style.top = "1px"
    };
    a.prototype.setLabel = function() {
        var b = [];
        if (this.getAddAllItem() && (0 == this.selectedValues.length || 1 == this.selectedValues.length && this.selectedValues[0] == this.addAllItemText) || this.getDataProvider().length == this.selectedValues.length + 1) this.getTextBox().value = this.addAllItemText;
        else if (this.getDataProvider() && 0 < this.getDataProvider().length) {
            for (var a = this.getAddAllItem() ? 1 : 0; a < this.getDataProvider().length; a++) {
                var d = this.getDataProvider()[a];
                0 <= this.selectedValues.indexOf(c.resolveExpression(d, this.dataField)) && b.push(this.itemToLabel(d))
            }
            b.sort();
            this.getTextBox().value = b.join(",");
            this.getTextBox().title = this.getTextBox().value
        }
    };
    a.prototype.setSelectedItem = function() {};
    a.prototype.owns = function(b) {
        return flexiciousNmsp.UIComponent.prototype.owns.apply(this, [b]) || this.popup && this.popup.owns(b)
    };
    a.prototype.kill = function() {
        flexiciousNmsp.TextInput.prototype.kill.apply(this);
        this.popup && (this.popup.kill(), this.popup = null)
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.TextInput.prototype.initialize.apply(this);
        this.getTextBox().readOnly = !0;
        this.getHeight() || this.setActualSize(this.defaultWidth, 19);
        this.setLabel()
    };
    a.prototype.getIsAllSelected = function() {
        if (this.selectedValues && 1 == this.selectedValues.length && 0 < this.getDataProvider().length && this.selectedValues[0] == this.getDataProvider()[0][this.dataField] || 0 == this.selectedValues.length && this.getAddAllItem()) return !0;
        for (var b = 0; b < this.getDataProvider().length; b++) {
            var a = this.getDataProvider()[b];
            if (!this.isItemSelected(a) && 0 != this.getDataProvider().indexOf(a)) return !1
        }
        return !0
    };
    a.prototype.isItemSelected = function(b) {
        b = c.resolveExpression(b, this.dataField);
        return -1 != this.selectedValues.indexOf(b)
    };
    a.prototype.getSelectedItems = function(b) {
        for (var a = [], d = this.getDataProvider(), e = 0; e < d.length; e++) b = d[e], this.isItemSelected(b) && a.push(b);
        return a
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["span"]);
        this.registered = this.hasSearch = !1;
        this.filterComparisionType = "auto";
        this.filterOperation = this.searchField = null;
        this.filterTriggerEvent = "change";
        this.gridColumn = this.grid = null;
        this.dataField = "data";
        this.separatorText = "to";
        this.textBoxStart = new flexiciousNmsp.TextInput;
        this.separator = new flexiciousNmsp.Label;
        this.textBoxEnd = new flexiciousNmsp.TextInput
    };
    flexiciousNmsp.NumericRangeBox = a;
    a.prototype = new flexiciousNmsp.UIComponent("span");
    a.prototype.typeName = a.typeName = "NumericRangeBox";
    a.prototype.getClassNames = function() {
        return ["NumericRangeBox", "UIComponent", "IFilterControl", "IRangeFilterControl"]
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a])
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.separator.setText(this.separatorText);
        c.addChild(this, this.textBoxStart);
        c.addChild(this, this.separator);
        c.addChild(this, this.textBoxEnd);
        this.textBoxStart.addEventListener(this, "delayedChange", this.onChange_textBoxStart);
        this.textBoxEnd.addEventListener(this, "delayedChange", this.onChange_textBoxEnd)
    };
    a.prototype.clear = function() {
        this.textBoxEnd.clear();
        this.textBoxStart.clear()
    };
    a.prototype.getValue = function() {
        return null == this.getRange() ? null : this.getRange()
    };
    a.prototype.setValue = function(b) {
        this.setRange(b)
    };
    a.prototype.onChange_textBoxEnd = function() {
        this.onChange()
    };
    a.prototype.onChange_textBoxStart = function() {
        this.onChange()
    };
    a.prototype.onChange = function() {
        this.isRangeValid() && this.dispatchEvent(new flexiciousNmsp.BaseEvent(d.EVENT_CHANGE, !1, !1));
        "" == this.textBoxEnd.getValue() && "" == this.textBoxStart.getValue() && this.dispatchEvent(new flexiciousNmsp.BaseEvent(d.EVENT_CHANGE, !1, !1))
    };
    a.prototype.isRangeValid = function() {
        var b = parseFloat(this.textBoxStart.getValue()),
            a = parseFloat(this.textBoxEnd.getValue());
        return !isNaN(b) && !isNaN(a) && b <= a
    };
    a.prototype.reset = function() {
        this.clear()
    };
    a.prototype.setActualSize = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.setActualSize.apply(this, [b, a]);
        var d = b - 15;
        this.textBoxStart.setActualSize(d / 2, a);
        this.textBoxEnd.setActualSize(d / 2, a)
    };
    a.prototype.focus = function() {
        this.textBoxStart.focus()
    };
    a.prototype.getMinValue = function() {
        return -1 != this.getRangeStart() ? this.getRangeStart() : Number.MIN_VALUE
    };
    a.prototype.getMaxValue = function() {
        return -1 != this.getRangeEnd() ? this.getRangeEnd() : Number.MAX_VALUE
    };
    a.prototype.getSearchRangeStart = function() {
        return this.isRangeValid() ? this.getRangeStart() : null
    };
    a.prototype.getSearchRangeEnd = function() {
        return this.isRangeValid() ? this.getRangeEnd() : null
    };
    a.prototype.getRangeStart = function() {
        var b = parseFloat(this.textBoxStart.getValue());
        return isNaN(b) ? -1 : b
    };
    a.prototype.setRangeStart = function(b) {
        this.textBoxStart.setValue(b.toString())
    };
    a.prototype.getRange = function() {
        if (!this.isRangeValid()) return null;
        var b = [];
        b.push(this.getRangeStart());
        b.push(this.getRangeEnd());
        return b
    };
    a.prototype.setRange = function(b) {
        if (null != b) {
            if (2 != b.length) throw Error("Invalid argument for numeric range box range");
            this.textBoxStart.setValue(b[0].toString());
            this.textBoxEnd.setValue(b[1].toString());
            this.isRangeValid() || this.reset()
        }
    };
    a.prototype.getRangeEnd = function() {
        var b = parseFloat(this.textBoxEnd.getValue());
        return isNaN(b) ? -1 : b
    };
    a.prototype.setRangeEnd = function(b) {
        this.textBoxEnd.setValue(b.toString())
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.StyleDefaults = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "StyleDefaults";
    a.prototype.getClassNames = function() {
        return ["StyleDefaults", "TypedObject"]
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.open = this.hasChildren = !1;
        this.onExpandCollapse = null;
        flexiciousNmsp.UIComponent.apply(this, [])
    };
    flexiciousNmsp.ExpandCollapseIcon = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "ExpandCollapseIcon";
    a.prototype.getClassNames = function() {
        return ["ExpandCollapseIcon", "UIComponent", "IExpandCollapseComponent"]
    };
    a.prototype.refreshCell = function() {
        this.getCell() && this.getCell().refreshCell()
    };
    a.prototype.doClick = function() {
        a.doClick(this)
    };
    a.refreshCell = function(a) {
        if (null != a.parent && a.getRowInfo() && a.getRowInfo().rowPositionInfo.getIsDataRow()) {
            var b = a.getRowInfo().getData();
            b && (a.open = a.getLevel().isItemOpen(b), a.hasChildren = a.getLevel().nextLevelRenderer || (a.getLevel().getIsClientItemLoadMode() ? a.getLevel().nextLevel && 0 < a.getLevel().grid.getLength(a.getLevel().getChildren(b, !0, !1, !1)) : a.getLevel().childrenCountField ? 0 < b[a.getLevel().childrenCountField] : !0), a.setToolTip(a.getLevel().grid.expandCollapseTooltipFunction(a.getCell())))
        }
    };
    a.doClick = function(a) {
        if (null != a.parent && a.getLevel().grid.allowInteractivity && a.getRowInfo() && !a.getRowInfo().getIsFillRow()) {
            a.open = !a.open;
            a.getCell().dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridExpandCollapseCell.EVENT_EXPAND_COLLAPSE));
            var b = a.implementsOrExtends("FlexDataGridExpandCollapseCell") ? a : null;
            b ? b.invalidateBackground() : this.drawIcon(a);
            a.getLevel() && a.setToolTip(a.getLevel().grid.expandCollapseTooltipFunction(a.getCell()))
        }
    };
    a.drawIcon = function(a) {
        if (null != a.parent && a.getLevel()) {
            var b = a.getCell();
            if (!b.getRowInfo() || !b.getRowInfo().getIsFillRow()) if (a.hasChildren) {
                var g = "IMG" == a.domElement.tagName ? a.domElement : c.adapter.findFirstElementByTagName(a.domElement, "img");
                g ? g = g.component : (g = new flexiciousNmsp.UIComponent("img"), c.addChild(a, g));
                g.domElement.className = "disclosureIcon";
                g.domElement.src = a.open ? flexiciousNmsp.Constants.IMAGE_PATH + b.getStyleValue("disclosureOpenIcon") : flexiciousNmsp.Constants.IMAGE_PATH + b.getStyleValue("disclosureClosedIcon");
                g.move(b.getLevel().grid.paddingLeft, (b.getRowInfo().height - 12) / 2);
                g.domElement.style.visibility = "visible"
            } else if (g = "IMG" == a.domElement.tagName ? a.domElement : c.adapter.findFirstElementByTagName(a.domElement, "img")) g.style.visibility = "hidden"
        }
    };
    a.prototype.getLevel = function() {
        return this.getCell() ? this.getCell().getLevel() : null
    };
    a.prototype.getRowInfo = function() {
        return this.getCell() ? this.getCell().getRowInfo() : null
    };
    a.prototype.getCell = function() {
        return this.parent
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        this.destroyed = this._renderer = this._rendererFactory = this.componentInfo = this.currentTextColors = this.currentBackgroundColors = this.rowInfo = this._column = this.level = null;
        this._newlyCreated = !0;
        this.moving = !1;
        this.colIcon = null;
        this.backgroundDirty = !0;
        this.expandCollapseIcon = this._iconTimer = null;
        this.showInAutomationHierarchy = !1;
        this.iconBottom = this.iconRight = this.iconTop = this.iconLeft = -1;
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        c.attachClass(this.domElement, "flexDataGridCell")
    };
    flexiciousNmsp.FlexDataGridCell = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "FlexDataGridCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.prototype.destroy = function() {
        this.currentTextColors = this.currentBackgroundColors = this.rowInfo = this.level = null;
        this.destroyed = !0
    };
    a.prototype.setActualSize = function(b, a) {
        (b != this.getWidth() || a != this.getHeight()) && this.invalidateBackground();
        flexiciousNmsp.UIComponent.prototype.setActualSize.apply(this, [b, a]);
        this.getRenderer() && this.placeComponent(this.getRenderer(), b, a)
    };
    a.prototype.refreshCell = function() {
        this.rowInfo && (this.automationName = this.level.grid.automationName + "_cell_" + this.rowInfo.rowPositionInfo.getRowIndex() + "_" + (this.getColumn() ? this.getColumn().getUniqueIdentifier() : this.rowInfo.cells.indexOf(this)) + "_" + this.rowInfo.rowPositionInfo.getRowType());
        this.destroyed = !1;
        this.currentTextColors = this.currentBackgroundColors = null;
        this.getRenderer();
        this.level.grid.dispatchRendererInitialized && this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.RENDERER_INITIALIZED, this.level.grid, this.level, this.getColumn(), this));
        this.getColumn() && (this.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && (this.rowInfo.getIsDataRow() || this.rowInfo.getIsHeaderRow())) && this.initializeCheckBoxRenderer(this.getRenderer());
        this._newlyCreated = !1;
        this.getColumn() && this.getColumn().enableExpandCollapseIcon && (this.expandCollapseIcon || (this.expandCollapseIcon = new flexiciousNmsp.ExpandCollapseIcon, this.addChild(this.expandCollapseIcon)), flexiciousNmsp.ExpandCollapseIcon.refreshCell(this.expandCollapseIcon), flexiciousNmsp.ExpandCollapseIcon.drawIcon(this.expandCollapseIcon));
        this.placeComponent(this.getRenderer(), this.getWidth(), this.getHeight(), void 0);
        this.colIcon && this.implementsOrExtends("IFlexDataGridDataCell") && this.colIcon.setVisible(!1);
        if (this.getColumn() && this.getColumn().enableIcon) {
            this.getRenderer().setVisible(!this.getColumn().hideText);
            var b = this.getIconUrl();
            b ? (this.colIcon || this.createColumnIcon(), this.colIcon.setToolTip(this.getColumn().iconToolTipFunction(this)), this.colIcon.setVisible(!0), this.colIcon.getSource() != b && this.colIcon.setSource(b), (this.getColumn().showIconOnCellHover || this.getColumn().showIconOnRowHover) && this.colIcon.setVisible(!1)) : this.colIcon && this.colIcon.setSource(b)
        }
        this.invalidateDisplayList()
    };
    a.prototype.createColumnIcon = function() {
        this.colIcon = new flexiciousNmsp.Image;
        this.colIcon.domElement.className = "cellIcon";
        this.addChild(this.colIcon);
        this.colIcon.addEventListener(this, d.EVENT_CLICK, this.onIconMouseClick);
        this.colIcon.addEventListener(this, d.EVENT_MOUSE_OVER, this.onIconMouseOver);
        this.colIcon.addEventListener(this, d.EVENT_MOUSE_OUT, this.onIconMouseOut);
        this.colIcon.setHandCursor(this.getColumn().iconHandCursor)
    };
    a.prototype.onIconMouseOver = function() {
        if (this.getColumn().useIconRollOverTimer) {
            this._iconTimer || (this._iconTimer = new flexiciousNmsp.Timer(this.getColumn().iconMouseOverDelay, 1), this._iconTimer.addEventListener(this, d.EVENT_TIMER, this.onTimerComplete));
            this._iconTimer.start();
            var b = this.getIconUrl(!0);
            this.colIcon.getSource() != b && this.colIcon.setSource(b)
        } else this.onTimerComplete(null)
    };
    a.prototype.onIconMouseClick = function(b) {
        this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ICON_CLICK, this.level.grid, this.level, this.getColumn(), this, this.rowInfo.getData(), b));
        b.stopPropagation()
    };
    a.prototype.onTimerComplete = function(b) {
        this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ICON_MOUSE_OVER, this.level.grid, this.level, this.getColumn(), this, this.rowInfo.getData(), b));
        null != this.getColumn().iconTooltipRenderer && (b = this.getColumn().iconTooltipRenderer.newInstance(), this.level.grid.showTooltip(this.colIcon, b, this.rowInfo.getData()))
    };
    a.prototype.onIconMouseOut = function() {
        if (this.getColumn().useIconRollOverTimer) {
            this._iconTimer.running ? this._iconTimer.stop() : this._iconTimer && this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ICON_MOUSE_OUT, this.level.grid, this.level, this.getColumn(), this, this.rowInfo.getData()));
            var b = this.getIconUrl();
            this.colIcon.getSource() != b && (this.colIcon.setSource(b), this.colIcon.load())
        } else this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ICON_MOUSE_OUT, this.level.grid, this.level, this.getColumn(), this, this.rowInfo.getData()))
    };
    a.prototype.getIconUrl = function(b) {
        "undefined" == typeof b && (b = !1);
        return this.getColumn().iconFunction(this, !this.getEnabled() ? "disabled" : b ? "over" : "")
    };
    a.prototype.setRendererSize = function(b, a, d) {
        flexiciousNmsp.CellUtils.setRendererSize(b, a, d)
    };
    a.prototype.getLevel = function() {
        return this.level
    };
    a.prototype.getLeftPadding = function() {
        return (this.getColumn() ? this.getColumn() : this.level).getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("paddingLeft"))
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [b, a]);
        this.level && (this.drawCell(b, a), this.placeIcon(), this.level.grid.dispatchCellRenderered && this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CELL_RENDERED, this.level.grid, this.level, this.getColumn(), this, this.rowInfo.getData())))
    };
    a.prototype.placeIcon = function() {
        if (this.colIcon) {
            var b = this.getColumn().getStyle("iconWidth") || this.colIcon.domElement.offsetHeight || 11,
                a = this.getColumn().getStyle("iconHeight") || this.colIcon.domElement.offsetWidth || 11;
            if (!this.getColumn() || !this.getEnabled()) this.colIcon.setVisible(!1);
            else {
                this.getColumn().showIconOnCellHover ? this.colIcon.setVisible(this.level.grid.currentCell == this) : this.getColumn().showIconOnRowHover && (null == this.level.grid.currentCell ? this.colIcon.setVisible(!1) : this.colIcon.setVisible(this.level.grid.currentCell.rowInfo == this.rowInfo));
                var d = -1 != this.iconLeft ? this.iconLeft : this.getColumn().getStyle("iconLeft"),
                    e = -1 != this.iconTop ? this.iconTop : this.getColumn().getStyle("iconTop"),
                    c = -1 != this.iconBottom ? this.iconBottom : this.getColumn().getStyle("iconBottom"),
                    j = -1 != this.iconRight ? this.iconRight : this.getColumn().getStyle("iconRight"),
                    k, l;
                0 < d && (k = d);
                0 < e && (l = e);
                0 < j && (k = this.getWidth() - j - a);
                0 < c && (l = this.getHeight() - c - b);
                isNaN(k) && (k = this.getWidth() - 2 - a);
                isNaN(l) && (l = Math.max(0, (this.getHeight() - b) / 2));
                this.colIcon.move(k, l)
            }
        }
    };
    a.prototype.placeExpandCollapseIcon = function() {
        if (this.expandCollapseIcon) if (!this.getColumn() || !this.getColumn().enableExpandCollapseIcon) this.expandCollapseIcon.setVisible(!1);
        else {
            this.expandCollapseIcon.setVisible(!0);
            var b = this.getColumn().getStyle("expandCollapseIconLeft"),
                a = this.getColumn().getStyle("expandCollapseIconTop"),
                d = this.getColumn().getStyle("expandCollapseIconBottom"),
                e = this.getColumn().getStyle("expandCollapseIconRight"),
                c, j;
            0 < b && (c = b);
            0 < a && (j = a);
            0 < e && (c = this.getWidth() - e - this.expandCollapseIcon.getWidth());
            0 < d && (j = this.getHeight() - d - this.expandCollapseIcon.getHeight());
            isNaN(c) && (c = 2);
            isNaN(j) && (j = Math.max(0, (this.getHeight() - 20) / 2));
            this.getColumn().enableHierarchicalNestIndent && (c += this.level.getMaxPaddingCellWidth());
            this.expandCollapseIcon.move(c, j)
        }
    };
    a.prototype.drawCell = function(b, a) {
        parent && this.drawBackground(b, a)
    };
    a.prototype.placeComponent = function(b, a, d, e) {
        "undefined" == typeof e && (e = !0);
        if (!parent) return null;
        if (e) {
            e = c.nanToZero(this.getLeftPadding());
            var h = c.nanToZero(this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("paddingTop"))),
                j = c.nanToZero(this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("paddingRight"))),
                k = c.nanToZero(this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("paddingBottom")));
            this.setRendererSize(b, a - e - j - 1, d - h - k - 1);
            this.invalidateDisplayList();
            this.getRenderer().move(e, h);
            this.placeIcon();
            this.placeExpandCollapseIcon();
            return new flexiciousNmsp.Point(e, h)
        }
        this.setRendererSize(b, a, d);
        return new flexiciousNmsp.Point(0, 0)
    };
    a.prototype.capitalizeFirstLetterIfPrefix = function(b) {
        return flexiciousNmsp.CellUtils.capitalizeFirstLetterIfPrefix(this.getPrefix(), b)
    };
    a.prototype.hasVerticalGridLines = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("verticalGridLines"))
    };
    a.prototype.hasHorizontalGridLines = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("horizontalGridLines"))
    };
    a.prototype.drawBackground = function() {
        flexiciousNmsp.CellUtils.drawBackground(this)
    };
    a.prototype.getRolloverColor = function() {
        return flexiciousNmsp.CellUtils.getRolloverColor(this, "rollOverColor")
    };
    a.prototype.getRolloverTextColor = function() {
        return flexiciousNmsp.CellUtils.getRolloverColor(this, "textRollOverColor")
    };
    a.prototype.getTextColors = function() {
        var b = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != b ? b : flexiciousNmsp.CellUtils.getTextColors(this)
    };
    a.prototype.getBackgroundColors = function() {
        var b = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != b ? b : flexiciousNmsp.CellUtils.getBackgroundColors(this)
    };
    a.prototype.drawRightBorder = function() {
        return flexiciousNmsp.CellUtils.drawRightBorder(this)
    };
    a.prototype.initializeCheckBoxRenderer = function() {
        flexiciousNmsp.CellUtils.initializeCheckBoxRenderer(this, this.level)
    };
    a.prototype.onCheckChange = function() {};
    a.prototype.getStyleValue = function(b) {
        return flexiciousNmsp.CellUtils.getStyleValue(this, b)
    };
    a.prototype.invalidateBackground = function() {
        this.backgroundDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getPerceivedX = function() {
        var b = this.getColumn() && this.getColumn().implementsOrExtends("FlexDataGridColumn") ? this.getColumn() : null;
        return !b ? this.getX() : b.getIsLeftLocked() ? this.getX() : this.getIsRightLocked() ? b.level.grid.getLeftLockedContent().getWidth() + b.level.getUnLockedWidth() + this.getX() : b.level.grid.getLeftLockedContent().getWidth() + this.getX()
    };
    a.prototype.getHorizontalGridLineThickness = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("horizontalGridLineThickness"))
    };
    a.prototype.setSelectable = function(b) {
        var a = c.adapter.isIE();
        b ? (c.detachClass(this.getRenderer().domElement, "unSelectableText"), c.detachClass(this.domElement, "unSelectableText"), a && this.getRenderer().domElement.removeAttribute("unselectable")) : (c.attachClass(this.getRenderer().domElement, "unSelectableText"), c.attachClass(this.domElement, "unSelectableText"), a && this.getRenderer().domElement.setAttribute("unselectable", "on"))
    };
    a.prototype.getIsNewlyCreated = function() {
        return this._newlyCreated
    };
    a.prototype.getIsExpandCollapseCell = function() {
        return this.getColumn() && this.getColumn().enableExpandCollapseIcon
    };
    a.prototype.getIsLocked = function() {
        return this.getColumn() && this.getColumn().getIsLocked()
    };
    a.prototype.setWidth = function(b) {
        var a = this.getWidth() != b;
        flexiciousNmsp.UIComponent.prototype.setWidth.apply(this, [b]);
        a && (this.invalidateBackground(), this.placeComponent(this.getRenderer(), this.getWidth(), this.getHeight(), !0))
    };
    a.prototype.getDrawTopBorder = function() {
        return !1
    };
    a.prototype.setHeight = function(b) {
        b != this.getHeight() && this.invalidateBackground();
        flexiciousNmsp.UIComponent.prototype.setHeight.apply(this, [b])
    };
    a.prototype.getRendererFactory = function() {
        this._rendererFactory || (this._rendererFactory = flexiciousNmsp.UIUtils.UIComponentFactory);
        return this._rendererFactory
    };
    a.prototype.setRendererFactory = function(b) {
        this._rendererFactory = b
    };
    a.prototype.getPrefix = function() {
        return ""
    };
    a.prototype.getWordWrap = function() {
        return "normal" == this.getRenderer().domElement.style.whiteSpace
    };
    a.prototype.setWordWrap = function(b) {
        this.getRenderer().domElement.style.whiteSpace = b ? "normal" : "nowrap"
    };
    a.prototype.getVerticalGridLineThickness = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("verticalGridLineThickness"))
    };
    a.prototype.getVerticalGridLineColor = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("verticalGridLineColor"))
    };
    a.prototype.getIExpandCollapseComponent = function() {
        return this.expandCollapseIcon
    };
    a.prototype.getText = function() {
        var b = this.getRenderer();
        return b.hasOwnProperty("text") ? b.text : this._text
    };
    a.prototype.setText = function(b) {
        this._text = b;
        this.getRenderer().setText(b)
    };
    a.prototype.getColumn = function() {
        return this._column
    };
    a.prototype.getRowInfo = function() {
        return this.rowInfo
    };
    a.prototype.getLevel = function() {
        return this.level
    };
    a.prototype.getGrid = function() {
        return this.getLevel().grid
    };
    a.prototype.setColumn = function(b) {
        this._column = b;
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("columnChanged"))
    };
    a.prototype.setTruncateToFit = function(b) {
        this.getRenderer().hasOwnProperty("truncateToFit") && (this.getRenderer().truncateToFit = b)
    };
    a.prototype.getBackgroundColorString = function() {
        return flexiciousNmsp.CellUtils.getBackGroundColorString(this)
    };
    a.prototype.getIsElastic = function() {
        return !this.getIsRightLocked() && !this.implementsOrExtends("IFixedWidth") && !this.getColumn().implementsOrExtends("IFixedWidth")
    };
    a.prototype.getRenderer = function() {
        this._renderer || (this._renderer = this.getRendererFactory().newInstance(), this.getColumn() && (this.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && (this.rowInfo.getIsDataRow() || this.rowInfo.getIsHeaderRow())) && this._renderer.addEventListener(this, d.EVENT_CLICK, this.onCheckChange), c.attachClass(this._renderer.domElement, "cellRenderer"), this.level && (this.getRenderer().parent != this && this.getRenderer() != this) && this.addChild(this.getRenderer()), this.getColumn() && (this.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && (this.rowInfo.getIsDataRow() || this.rowInfo.getIsHeaderRow()) && !this.getRenderer().hasEventListener(d.EVENT_CHANGE)) && this.getRenderer().addEventListener(this, d.EVENT_CLICK, this.onCheckChange));
        return this._renderer
    };
    a.prototype.getHorizontalGridLineColor = function() {
        return this.getStyleValue(this.getPrefix() + this.capitalizeFirstLetterIfPrefix("horizontalGridLineColor"))
    };
    a.prototype.getIsRightLocked = function() {
        return this.getColumn() && this.getColumn().getIsRightLocked()
    };
    a.prototype.getCheckBoxState = function() {
        return this.getRenderer().implementsOrExtends("TriStateCheckBox") ? this.getRenderer().getSelectedState() : ""
    };
    a.prototype.getNestDepth = function() {
        return this.level ? this.level.getNestDepth() : -1
    };
    a.prototype.getIsChromeCell = function() {
        return this.rowInfo ? this.rowInfo.getIsChromeRow() : !0
    };
    a.prototype.getIsContentArea = function() {
        return this.getIsDataCell() || this.getIsChromeCell() && 1 < this.getNestDepth()
    };
    a.prototype.getIsLeftLocked = function() {
        return this.getColumn() && this.getColumn().getIsLeftLocked()
    };
    a.prototype.getIsDataCell = function() {
        return this.rowInfo ? this.rowInfo.getIsDataRow() : !1
    };
    a.prototype.setEnabled = function(b) {
        this.colIcon && this.colIcon.setSource(this.getIconUrl());
        flexiciousNmsp.UIComponent.prototype.setEnabled.apply(this, [b])
    };
    a.prototype.attachUserClass = function(b) {
        this.previouslyAttached && c.detachClass(this.domElement, this.previouslyAttached);
        b && (c.attachClass(this.domElement, b), this.previouslyAttached = b)
    };
    a.prototype.kill = function() {
        this.domElement && this.destroy();
        this._renderer && this._renderer.kill();
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        this.column = this.rowInfo = this.level = null
    };
    a.prototype.getWidth = function() {
        return this.width
    };
    a.prototype.getHeight = function() {
        return this.height
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.columnGroup = null;
        this._wxInvalid = this.background = this._listenersAdded = !1;
        flexiciousNmsp.FlexDataGridCell.apply(this, [])
    };
    flexiciousNmsp.FlexDataGridColumnGroupCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridColumnGroupCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridColumnGroupCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.prototype.destroy = function() {
        this.setText("");
        this.background = !1;
        this.level && (this._listenersAdded = !1, this.level.grid.removeEventListener(flexiciousNmsp.FlexDataGridEvent.COMPONENTS_CREATED, this.invalidateWX), this.level.removeEventListener(flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, this.invalidateWX), this.getColumn() && this.getColumn().removeEventListener(flexiciousNmsp.FlexDataGridEvent.COLUMN_X_CHANGED, this.invalidateWX));
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, [])
    };
    a.prototype.onColumnsResized = function() {
        if (this.columnGroup) {
            var a = this.columnGroup.getWX();
            this.setWidth(a[0]);
            this.setX(a[1]);
            this.componentInfo && this.componentInfo.setX(this.getX())
        }
        this.invalidateDisplayList()
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        this.onColumnsResized(null);
        this._listenersAdded || (this._listenersAdded = !0, this.level.grid.addEventListener(this, flexiciousNmsp.FlexDataGridEvent.COMPONENTS_CREATED, this.invalidateWX), this.level.addEventListener(this, flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, this.invalidateWX), this.getColumn() && this.getColumn().addEventListener(this, flexiciousNmsp.FlexDataGridEvent.COLUMN_X_CHANGED, this.invalidateWX));
        this.setText(this.columnGroup.getHeaderText());
        this.setToolTip(this.columnGroup.expandCollapseTooltipFunction(this));
        this.setSelectable(!1)
    };
    a.prototype.invalidateWX = function() {
        this._wxInvalid = !0;
        this.invalidateBackground();
        this.invalidateDisplayList()
    };
    a.prototype.updateDisplayList = function(a, b) {
        flexiciousNmsp.FlexDataGridCell.prototype.updateDisplayList.apply(this, [a, b]);
        this._wxInvalid && (this.onColumnsResized(null), this._wxInvalid = !1);
        if (this.level && this.columnGroup && this.columnGroup.enableExpandCollapse) {
            var g = this.columnGroup.expandCollapsePositionFunction(this);
            c.nanToZero(g.getX());
            c.nanToZero(g.getY());
            this.getRenderer().setWidth(this.getWidth - c.nanToZero(this.getStyle("paddingLeft")) - c.nanToZero(this.getStyle("paddingRight")))
        }
    };
    a.prototype.getColumnGroupIcon = function() {
        this._columnGroupIcon || (this._columnGroupIcon = new flexiciousNmsp.Image, this.addChild(this._columnGroupIcon));
        var a = this.level.grid.getStyle("columnGroupOpenIcon");
        this.columnGroup.isClosed() && (a = this.level.grid.getStyle("columnGroupClosedIcon"));
        this._columnGroupIcon.setSource(this.level.grid.imagesRoot + a);
        return this._columnGroupIcon
    };
    a.prototype.getRolloverColor = function() {
        return this.getStyleValue("columnGroupRollOverColors")
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != a ? a : this.currentBackgroundColors ? this.currentBackgroundColors : this.getStyleValue("columnGroupColors")
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.getDrawTopBorder = function() {
        return this.level && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines") && 0 == this.level.getFilterRowHeight() || this.getStyleValue("columnGroupDrawTopBorder")
    };
    a.prototype.getPrefix = function() {
        return "columnGroup"
    };
    a.prototype.getColumn = function() {
        return this.columnGroup ? this.columnGroup.getStartColumn() : flexiciousNmsp.FlexDataGridCell.prototype.getColumn.apply(this, [])
    }
})(window);
(function() {
    var a;
    a = function() {
        this.rowSpan = this.colSpan = 1;
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridDataCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridDataCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridDataCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridDataCell", "IFlexDataGridCell"]
    };
    a.prototype.refreshCell = function() {
        if (!this.rowInfo.getIsFillRow()) {
            flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
            flexiciousNmsp.CellUtils.refreshCell(this);
            var a = this.getRenderer();
            if (a.implementsOrExtends("UIComponent") && this.getColumn() && !this.getColumn().hasCustomItemRenderer()) {
                a = a.domElement;
                this.setSelectable(this.getColumn().selectable);
                this.getColumn().useUnderLine && "underline" != a.style.textDecoration ? a.style.textDecoration = "underline" : !this.getColumn().useUnderLine && "underline" == a.style.textDecoration && (a.style.textDecoration = "");
                a.style.cursor = this.getColumn().useHandCursor ? "pointer" : "";
                this.getColumn().truncateToFit ? (a.style.textOverflow = "ellipsis", a.title = a.innerHTML) : a.style.textOverflow = "clip";
                var d = this.getStyleValue("textAlign") || "";
                d != a.style.textAlign && (a.style.textAlign = d)
            }
            this.getColumn() && this.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && this.setEnabled(this.level.checkRowSelectable(this, this.rowInfo.getData()))
        }
    };
    a.prototype.getLeftPadding = function() {
        return this.getColumn() && this.getColumn().enableHierarchicalNestIndent ? this.level.getMaxPaddingCellWidth() + this.getColumn().getStyle("paddingLeft") : flexiciousNmsp.FlexDataGridCell.prototype.getLeftPadding.apply(this)
    }
})(window);
(function() {
    var a;
    a = function() {
        this.forceRightLock = this.open = this.hasChildren = !1;
        this.rowSpan = this.colSpan = 1;
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridExpandCollapseCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridExpandCollapseCell";
    a.prototype.getClassNames = function() {
        return "FlexDataGridExpandCollapseCell FlexDataGridCell UIComponent IFlexDataGridDataCell IExpandCollapseComponent IFlexDataGridCell".split(" ")
    };
    a.EVENT_EXPAND_COLLAPSE = "expandCollapse";
    a.prototype.destroy = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, []);
        this.forceRightLock = this.open = !1
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        this.invalidateBackground();
        flexiciousNmsp.ExpandCollapseIcon.refreshCell(this)
    };
    a.prototype.doClick = function() {
        this.onClick(null)
    };
    a.prototype.onClick = function() {
        flexiciousNmsp.ExpandCollapseIcon.doClick(this)
    };
    a.prototype.updateDisplayList = function(a, d) {
        var b = this.backgroundDirty;
        flexiciousNmsp.FlexDataGridCell.prototype.updateDisplayList.apply(this, [a, d]);
        b && flexiciousNmsp.ExpandCollapseIcon.drawIcon(this)
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        if (null != a) return a;
        if (this.rowInfo && this.rowInfo.getIsDataRow()) return flexiciousNmsp.FlexDataGridCell.prototype.getBackgroundColors.apply(this, []);
        if ((!this.rowInfo || !this.rowInfo.getIsFillRow()) && this.rowInfo) {
            if (this.rowInfo.getIsHeaderRow()) return this.getStyleValue("headerColors");
            if (this.rowInfo.getIsPagerRow()) return this.getStyleValue("pagerColors");
            if (this.rowInfo.getIsFooterRow()) return this.getStyleValue("footerColors");
            if (this.rowInfo.getIsFilterRow()) return this.getStyleValue("filterColors");
            a = 0 == (this.rowInfo && this.rowInfo.rowPositionInfo.getRowIndex() % 2);
            return this.getStyleValue("alternatingItemColors")[a ? 0 : 1]
        }
        return this.getStyleValue("backgroundColor")
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.setActualSize = function(a, d) {
        flexiciousNmsp.FlexDataGridCell.prototype.setActualSize.apply(this, [a, d])
    };
    a.prototype.getCell = function() {
        return this
    };
    a.prototype.getDrawTopBorder = function() {
        return this.getStyleValue(this.prefix + "DrawTopBorder")
    };
    a.prototype.getIsExpandCollapseCell = function() {
        return !0
    };
    a.prototype.getIsLocked = function() {
        return this.getColumn() ? this.getColumn().getIsLocked() : this.forceRightLock || this.level.grid.lockDisclosureCell
    };
    a.prototype.getPrefix = function() {
        return this.rowInfo ? this.rowInfo.getIsHeaderRow() ? "header" : this.rowInfo.getIsPagerRow() ? "pager" : this.rowInfo.getIsFooterRow() ? "footer" : this.rowInfo.getIsFilterRow() ? "filter" : this.rowInfo.getIsRendererRow() ? "renderer" : "" : ""
    };
    a.prototype.getIsLeftLocked = function() {
        return this.getColumn() ? this.getColumn().getIsLeftLocked() : !this.forceRightLock && this.level.grid.lockDisclosureCell
    };
    a.prototype.getIsRightLocked = function() {
        return this.getColumn() ? this.getColumn().getIsRightLocked() : this.forceRightLock || flexiciousNmsp.FlexDataGridCell.prototype.getIsRightLocked.apply(this, [])
    };
    a.prototype.getIExpandCollapseComponent = function() {
        return this
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.FlexDataGridExpandCollapseCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridExpandCollapseHeaderCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridExpandCollapseCell;
    a.prototype.typeName = a.typeName = "FlexDataGridExpandCollapseHeaderCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridExpandCollapseHeaderCell", "FlexDataGridExpandCollapseCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.prototype.getDrawTopBorder = function() {
        flexiciousNmsp.FlexDataGridExpandCollapseCell.prototype.getDrawTopBorder.apply(this, []) || this.rowInfo.getIsHeaderRow() && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines") && 0 == this.level.getFilterRowHeight() || this.rowInfo.getIsFilterRow() && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines")
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridFilterCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridFilterCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridFilterCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.FILTER_CHANGE = "filterChange";
    a.EVENT_FILTERCHANGE = "filterChange";
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != a ? a : this.currentBackgroundColors ? this.currentBackgroundColors : this.level.getStyleValue("filterColors")
    };
    a.prototype.getIconUrl = function() {
        return null
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.initializeCheckBoxRenderer = function() {};
    a.prototype.getRolloverColor = function() {
        return this.getColumn() ? this.getColumn().getStyleValue("filterRollOverColors") : this.level.getStyleValue("filterRollOverColors")
    };
    a.prototype.destroy = function() {
        var a = this.getRenderer().implementsOrExtends("IFilterControl") ? this.getRenderer() : null;
        a && a.clear();
        this.getRenderer().implementsOrExtends("ISelectFilterControl") && this.getRenderer();
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, [])
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        this.getRenderer().hasOwnProperty("enabled") && (this.getRenderer().enabled = this.level.grid.allowInteractivity)
    };
    a.prototype.getPrefix = function() {
        return "filter"
    };
    a.prototype.getDrawTopBorder = function() {
        return this.level && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines") || this.getStyleValue("filterDrawTopBorder")
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.dataProvider = [];
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridFooterCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridFooterCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridFooterCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.SUM = "sum";
    a.MIN = "min";
    a.MAX = "max";
    a.AVERAGE = "average";
    a.COUNT = "count";
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        this.getColumn() && (null != this.getColumn().footerLabelFunction || null != this.getColumn().footerLabelFunction2 || null != this.getColumn().footerOperation || null != this.getColumn().footerLabel) ? 1 == this.level.getNestDepth() ? this.calculateValue(c.filterArray(this.level.grid.getRootFlat(), this.level.grid.getRootFilter(), this.level.grid, this.level, !1)) : this.calculateValue(this.level.getParentLevel().getChildren(this.rowInfo.getData(), !0, !1, !0)) : this.setText("")
    };
    a.prototype.calculateValue = function(a) {
        this.dataProvider = a;
        null != this.getColumn().footerLabelFunction2 ? this.setText(this.getColumn().footerLabelFunction2(this)) : null != this.getColumn().footerLabelFunction ? this.setText(this.getColumn().footerLabelFunction(this.getColumn())) : this.setText(this.defaultLabelFunction(this.getColumn()))
    };
    a.prototype.defaultLabelFunction = function(d) {
        var b = 0;
        switch (d.footerOperation) {
        case a.SUM:
            b = c.sum(this.dataProvider, d.getDataField());
            break;
        case a.AVERAGE:
            b = c.average(this.dataProvider, d.getDataField());
            break;
        case a.MIN:
            b = c.min(this.dataProvider, d.getDataField());
            break;
        case a.MAX:
            b = c.max(this.dataProvider, d.getDataField());
            break;
        case a.COUNT:
            b = c.getLength(this.dataProvider)
            break;
        default: 
        	//getFormatedTime(this.dataProvider, d.getDataField())
        	//Aditya - Custom Fix for footer
        	try{
        		b = customFooterOperationHandler(this.dataProvider, d.getDataField());
        	}catch(error){
        		console.log("No method definition: exception for footer operation ["+d.footerOperation+"]");
        	}       
        }
        b = b ? "number" == typeof b ? b.toFixed(d.footerOperationPrecision) : b.toString() : "";
        null != d.footerFormatter && (d.footerFormatter.format || (d.footerFormatter = new d.footerFormatter), b = d.footerFormatter.format(b));
        return (null != d.footerLabel ? d.footerLabel : "") + b
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != a ? a : this.currentBackgroundColors ? this.currentBackgroundColors : this.level.getStyleValue("footerColors")
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.initializeCheckBoxRenderer = function() {};
    a.prototype.getRolloverColor = function() {
        return this.getColumn() ? this.getColumn().getStyleValue("footerRollOverColors") : this.level.getStyleValue("footerRollOverColors")
    };
    a.prototype.getPrefix = function() {
        return "footer"
    };
    a.prototype.getDrawTopBorder = function() {
        return this.getStyleValue("footerDrawTopBorder")
    };
    a.prototype.setVisible = function(a) {
        flexiciousNmsp.FlexDataGridCell.prototype.setVisible.apply(this, [a])
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        this.sortAscending = this.resizingPrevious = this.resizing = !1;
        this.sortable = !0;
        this.sortLabel = this.icon = null;
        this._iconOffset = 0;
        this.addEventListener(d.EVENT_CLICK, this.onHeaderClick);
        this.addEventListener(d.EVENT_MOUSE_MOVE, this.onMouseMove);
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridHeaderCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridHeaderCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridHeaderCell", "FlexDataGridCell", "UIComponent", "IFlexDataGridCell"]
    };
    a.EVENT_HEADERCLICKED = "headerClicked";
    a.prototype.destroySortIcon = function() {
        this.icon && null != this.icon.parent && c.removeChild(this.icon.parent, this.icon);
        this.sortLabel && null != this.sortLabel.parent && (c.removeChild(this.sortLabel.parent, this.sortLabel), this.sortLabel.removeEventListener(d.EVENT_CLICK, this.onSortLabelClick, !1));
        this.icon = this.sortLabel = null
    };
    a.prototype.onMouseMove = function(b) {
        this.level && this.level.grid.enableMultiColumnSort && (b.target == this.sortLabel || b.target == this.icon) && this.level.grid.getHeaderContainer().killResize()
    };
    a.prototype.move = function(b, a) {
        flexiciousNmsp.FlexDataGridCell.prototype.move.apply(this, [b, a]);
        this.getColumn() && this.getColumn().setX(this.getX())
    };
    a.prototype.setX = function(b) {
        flexiciousNmsp.FlexDataGridCell.prototype.setX.apply(this, [b])
    };
    a.prototype.onSortLabelClick = function(b) {
        var a = this.level.grid;
        if (this.level && this.level.grid.getEnableSplitHeader() && this.getColumn() && this.getColumn().sortable && a.getEnableSplitHeader()) a.getContainerForCell(this).onHeaderCellClicked(this, b, !0);
        else this.getColumn().sortable && a.multiColumnSortShowPopup()
    };
    a.prototype.createSortIcon = function(b) {
        this.icon && this.destroySortIcon();
        if (!this.getColumn() || this.getColumn().sortable) {
            var a = this.level.grid;
            if (this.level.getEnableMultiColumnSort()) {
                var f = new flexiciousNmsp.Label;
                f.domElement.className = "sortLabel";
                f.useHandCursor = !a.getEnableSplitHeader();
                f.buttonMode = !a.getEnableSplitHeader();
                f.mouseChildren = a.getEnableSplitHeader();
                f.setToolTip(a.multiColumnSortGetTooltip(this));
                f.addEventListener(this, d.EVENT_CLICK, this.onSortLabelClick, !1);
                f.setText(this.level.getSortIndex(this.getColumn()).toString())
            }
            var e = this.getIsLocked() ? this.getIsLeftLocked() ? a.getLeftLockedHeader() : a.getRightLockedHeader() : b;
            b = this.sortAscending ? this.level.createAscendingSortIcon() : this.level.createDescendingSortIcon();
            b.parent != a && (c.addChild(e, b), this.level.getEnableMultiColumnSort() && c.addChild(e, f));
            this.icon = b;
            this.level.getEnableMultiColumnSort() && (this.sortLabel = f);
            this.placeSortIcon()
        }
    };
    a.prototype.setRendererSize = function(b, a, d) {
        this.level && this.level.grid.getEnableSplitHeader() && this.getColumn() && this.getColumn().sortable ? a -= this.level.grid.headerSortSeparatorRight : this.icon && (a -= 8);
        flexiciousNmsp.FlexDataGridCell.prototype.setRendererSize.apply(this, [b, a, d])
    };
    a.prototype.destroy = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, []);
        this.sortable = this.sortAscending = this.resizingPrevious = this.resizing = !1;
        this.destroySortIcon()
    };
    a.prototype.onHeaderClick = function() {
        this.level && this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.HEADER_CLICKED, this.level.grid, this.level, this.getColumn(), this))
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        var b = this.level.hasSort(this.getColumn());
        b && (this.sortAscending = b.isAscending, this.destroySortIcon(), this.createSortIcon(this.parent));
        this.setSelectable(!1);
        this.getRenderer().setData(this.rowInfo.getData())
    };
    a.prototype.placeSortIcon = function() {
        if (this.icon) {
            var b = new flexiciousNmsp.Point(this.getWidth() - 8, (this.getHeight() - 18) / 2),
                b = this.icon.parent.globalToLocal(this.localToGlobal(b));
            this.icon.move(b.getX(), b.getY());
            this.sortLabel && this.level.getEnableMultiColumnSort() && (this.sortLabel.setWidth(this.level.grid.getStyle("multiColumnSortNumberWidth")), this.sortLabel.setHeight(this.level.grid.getStyle("multiColumnSortNumberHeight")), this.sortLabel.move(b.getX(), b.getY() + 4))
        }
    };
    a.prototype.updateDisplayList = function(b, a) {
        flexiciousNmsp.FlexDataGridCell.prototype.updateDisplayList.apply(this, [b, a]);
        this.drawSortSeparator()
    };
    a.prototype.drawSortSeparator = function() {
        if (this.level && this.level.grid.getEnableSplitHeader() && this.getColumn() && this.getColumn().sortable) {
            var b = this.level.grid.getHeaderSortSeparatorRight();
            this.sortSeparator || (this.sortSeparator = new flexiciousNmsp.UIComponent("span"), c.addChild(this, this.sortSeparator));
            this.sortSeparator.setActualSize(1, this.getHeight() - 6);
            this.sortSeparator.move(this.getWidth() - b, 3);
            this.sortSeparator.domElement.className = "sortSeparator"
        }
        this.placeSortIcon()
    };
    a.prototype.getBackgroundColors = function() {
        var b = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != b ? b : this.currentBackgroundColors ? this.currentBackgroundColors : this.getStyleValue("headerColors")
    };
    a.prototype.getTextColors = function() {
        var b = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != b ? b : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.initializeCheckBoxRenderer = function() {
        var b = this.getRenderer().implementsOrExtends("TriStateCheckBox") ? this.getRenderer() : null;
        if (b) {
            var a = this.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn");
            a && a.enableLabelAndCheckBox && (b.label = a.getHeaderText());
            1 != this.level.getNestDepth() ? (flexiciousNmsp.CellUtils.initializeCheckBoxRenderer(this, this.level.getParentLevel()), this.level.enableSingleSelect && (b.radioButtonMode = !0, b.setEnabled(!1))) : (b.radioButtonMode = this.getColumn().radioButtonMode, b.enableDelayChange = !1, this.getColumn().radioButtonMode || !this.getColumn().allowSelectAll ? b.setEnabled(!1) : (b.setEnabled(!0), a = this.level.grid.getRootFlat(), this.level.grid.getIsClientFilterPageSortMode() && (a = c.filterArray(a, this.level.grid.getRootFilter(), this.level.grid, this.level, !1)), b.setSelectedState(this.level.getSelectedKeysState(a)), b.getSelectedState() == flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED && (this.level.grid.enableSelectionExclusion ? this.level.grid.getSelectionInfo().getHasAnySelections() && b.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE) : 0 < this.level.grid.getSelectedObjects().length && b.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE))))
        }
    };
    a.prototype.onCheckChange = function(b) {
        b.target.implementsOrExtends("TriStateCheckBox") && (1 == this.level.getNestDepth() ? (this.level.selectAll(b.target.getSelected()), this.level.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.SELECT_ALL_CHECKBOX_CHANGED, this.level.grid, this.level, this.getColumn(), this, null, b))) : this.level.grid.enableSelectionExclusion ? this.level.getParentLevel().selectRow(this.rowInfo.getData(), b.target.getSelected()) : (b.target.getSelected() ? this.level.getParentLevel().selectRow(this.rowInfo.getData(), !0, !1, !1, !1, null) : this.level.getParentLevel().selectRow(this.rowInfo.getData(), !1, !1, !1, !1, null), this.selectLevel(this.level, this.level.getParentLevel().getChildren(this.rowInfo.getData()), b.target.getSelected())), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.SELECT_ALL_CHECKBOX_CHANGED, this.level.grid, this.level, this.getColumn(), this)))
    };
    a.prototype.selectLevel = function(b, a, d) {
        "undefined" == typeof d && (d = !0);
        for (var e = 0; e < a.length; e++) b.selectRow(a[e], d)
    };
    a.prototype.getRolloverColor = function() {
        return this.getStyleValue("headerRollOverColors")
    };
    a.prototype.getIsSorted = function() {
        return null != this.icon
    };
    a.prototype.getPrefix = function() {
        return "header"
    };
    a.prototype.getDrawTopBorder = function() {
        return this.level && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines") && 0 == this.level.getFilterRowHeight() || this.getStyleValue("headerDrawTopBorder")
    };
    a.prototype.setColumn = function(b) {
        flexiciousNmsp.FlexDataGridCell.prototype.setColumn.apply(this, [b])
    };
    a.prototype.placeComponent = function(b, a, d, e) {
        flexiciousNmsp.FlexDataGridCell.prototype.placeComponent.apply(this, [b, a, d, e])
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.resizing = !1;
        this.headerColors = null;
        flexiciousNmsp.UIComponent.apply(this)
    };
    flexiciousNmsp.FlexDataGridHeaderSeperator = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "FlexDataGridHeaderSeperator";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridHeaderSeperator", "UIComponent", "IFixedWidth"]
    };
    a.prototype.updateDisplayList = function(a, b) {
        var g = 0,
            f = this.parent && this.parent.implementsOrExtends("FlexDataGrid") ? this.parent : null;
        f && (g = f.getStyle("columnMoveResizeSeparatorColor"));
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [a, b]);
        this.domElement.style.backgroundColor = c.decimalToColor(g)
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridLevelRendererCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridLevelRendererCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridLevelRendererCell", "FlexDataGridCell", "UIComponent", "IFixedWidth", "IFlexDataGridCell"]
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != a ? a : this.getStyleValue("rendererColors")
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.getRolloverColor = function() {
        return this.getStyleValue("rendererRollOverColors")
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this, []);
        this.getRenderer().setData(this.rowInfo.getData())
    };
    a.prototype.getPrefix = function() {
        return "renderer"
    };
    a.prototype.getDrawTopBorder = function() {
        return this.getStyleValue("rendererDrawTopBorder")
    }
})(window);
(function() {
    var a;
    a = function() {
        this.forceRightLock = !1;
        this.scrollBarPad = null;
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridPaddingCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridPaddingCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridPaddingCell", "FlexDataGridCell", "UIComponent", "IFixedWidth", "IFlexDataGridCell"]
    };
    a.prototype.destroy = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, []);
        this.scrollBarPad = !1
    };
    a.prototype.setActualSize = function(a, d) {
        flexiciousNmsp.FlexDataGridCell.prototype.setActualSize.apply(this, [a, d])
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        if (null != a) return a;
        if (this.rowInfo && this.rowInfo.getIsDataRow()) return flexiciousNmsp.FlexDataGridCell.prototype.getBackgroundColors.apply(this, []);
        if ((!this.rowInfo || !this.rowInfo.getIsFillRow()) && this.rowInfo) {
            if (this.rowInfo.getIsHeaderRow()) return this.getStyleValue("headerColors");
            if (this.rowInfo.getIsPagerRow()) return this.getStyleValue("pagerColors");
            if (this.rowInfo.getIsFooterRow()) return this.getStyleValue("footerColors");
            if (this.rowInfo.getIsFilterRow()) return this.getStyleValue("filterColors");
            a = 0 == (this.rowInfo && this.rowInfo.rowPositionInfo.getRowIndex() % 2);
            return this.getStyleValue("alternatingItemColors")[a ? 0 : 1]
        }
        return this.getStyleValue("backgroundColor")
    };
    a.prototype.getTextColors = function() {
        return 0
    };
    a.prototype.getIsLocked = function() {
        return this.scrollBarPad ? !1 : this.forceRightLock || this.level.grid.lockDisclosureCell
    };
    a.prototype.getPrefix = function() {
        return this.rowInfo ? this.rowInfo.getIsHeaderRow() ? "header" : this.rowInfo.getIsPagerRow() ? "pager" : this.rowInfo.getIsFooterRow() ? "footer" : this.rowInfo.getIsFilterRow() ? "filter" : this.rowInfo.getIsRendererRow() ? "renderer" : "" : ""
    };
    a.prototype.getDrawTopBorder = function() {
        return this.getStyleValue(this.prefix + "DrawTopBorder") || this.rowInfo.getIsHeaderRow() && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines") && 0 == this.level.getFilterRowHeight() || this.rowInfo.getIsFilterRow() && 1 < this.level.getNestDepth() && !this.level.grid.getStyle("horizontalGridLines")
    };
    a.prototype.getIsLeftLocked = function() {
        return this.scrollBarPad ? !1 : !this.forceRightLock && this.level.grid.lockDisclosureCell
    };
    a.prototype.getIsRightLocked = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.getIsRightLocked.apply(this, [])
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.FlexDataGridCell.apply(this)
    };
    flexiciousNmsp.FlexDataGridPagerCell = a;
    a.prototype = new flexiciousNmsp.FlexDataGridCell;
    a.prototype.typeName = a.typeName = "FlexDataGridPagerCell";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridPagerCell", "FlexDataGridCell", "UIComponent", "IFixedWidth", "IFlexDataGridCell"]
    };
    a.prototype.getBackgroundColors = function() {
        var a = flexiciousNmsp.CellUtils.getBackgroundColorFromGrid(this);
        return null != a ? a : this.getStyleValue("pagerColors")
    };
    a.prototype.getTextColors = function() {
        var a = flexiciousNmsp.CellUtils.getTextColorFromGrid(this);
        return null != a ? a : this.currentTextColors ? this.currentTextColors : this.getStyle("color")
    };
    a.prototype.getRolloverColor = function() {
        return this.getStyleValue("pagerRollOverColors")
    };
    a.prototype.setActualSize = function(a, d) {
        flexiciousNmsp.FlexDataGridCell.prototype.setActualSize.apply(this, [a, d]);
        this.invalidateDisplayList()
    };
    a.prototype.setRendererSize = function(a, d, b) {
        a.setActualSize(d, b)
    };
    a.prototype.destroy = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.destroy.apply(this, [])
    };
    a.prototype.refreshCell = function() {
        flexiciousNmsp.FlexDataGridCell.prototype.refreshCell.apply(this);
        var a = this.getRenderer();
        a.doDispatchEvents = !1;
        var d = this.level.grid;
        a.setPageSize(this.level.pageSize);
        var b = this.rowInfo.getData(),
            g = d.getItemFilter(this.level, b);
        a.setPageIndex(-1);
        a.setTotalRecords(-1);
        if (this.level.enablePaging) if (1 == this.level.getNestDepth()) a.setTotalRecords(d.getTotalRecords()), a.setPageIndex(g && 0 <= g.pageIndex ? g.pageIndex : 0);
        else if (b && !this.level.getIsClientFilterPageSortMode()) {
            if (d = d.getContainerForCell(this).findLoadingInfo(b, this.level.getParentLevel(), 0 < this.level.childrenField.length)) a.setTotalRecords(d.totalRecords), a.setPageIndex(d.pageIndex)
        } else b && b.hasOwnProperty("length") ? (a.setTotalRecords(b.length), a.setPageIndex(g && 0 <= g.pageIndex ? g.pageIndex : 0)) : b && (b = this.level.getParentLevel().getChildren(b, !0, !1, !0), d.getLength(b) && a.setTotalRecords(b.length), a.setPageIndex(g && 0 <= g.pageIndex ? g.pageIndex : 0));
        a.doDispatchEvents = !0;
        a.render()
    };
    a.prototype.getPrefix = function() {
        return "pager"
    };
    a.prototype.getDrawTopBorder = function() {
        return this.getStyleValue("pagerDrawTopBorder")
    };
    a.prototype.getIsLocked = function() {
        return !0
    };
    a.prototype.setRendererSize = function(a, d, b) {
        flexiciousNmsp.CellUtils.setRendererSize(a, d, b)
    };
    a.prototype.setWidth = function(a) {
        flexiciousNmsp.FlexDataGridCell.prototype.setWidth.apply(this, [a])
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g) {
        "undefined" == typeof d && (d = null);
        this.cause = this.filter = this.triggerEvent = null;
        this.filter = d;
        flexiciousNmsp.BaseEvent.apply(this, [a, b, g]);
        this.triggerEvent = this.triggerEvent
    };
    flexiciousNmsp.ExtendedFilterPageSortChangeEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "ExtendedFilterPageSortChangeEvent";
    a.prototype.getClassNames = function() {
        return ["ExtendedFilterPageSortChangeEvent", "Event"]
    };
    a.FILTER_PAGE_SORT_CHANGE = "filterPageSortChange";
    a.FILTER_CHANGE = "filterChange";
    a.PAGE_CHANGE = "pageChange";
    a.SORT_CHANGE = "sortChange";
    a.ITEM_LOAD = "itemLoad";
    a.prototype.clone = function() {
        return new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(this.type, this.filter, this.bubbles, this.cancelable)
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g) {
        this.cause = this.triggerEvent = this.filter = null;
        flexiciousNmsp.BaseEvent.apply(this, [a, b, g]);
        this.filter = d
    };
    flexiciousNmsp.FilterPageSortChangeEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "FilterPageSortChangeEvent";
    a.prototype.getClassNames = function() {
        return ["FilterPageSortChangeEvent", "Event"]
    };
    a.FILTER_PAGE_SORT_CHANGE = "filterPageSortChange";
    a.FILTER_CHANGE = "filterChange";
    a.PAGE_CHANGE = "pageChange";
    a.SORT_CHANGE = "sortChange";
    a.DESTROY = "destroy";
    a.prototype.clone = function() {
        return new flexiciousNmsp.FilterPageSortChangeEvent(this.type, this.filter, this.bubbles, this.cancelable)
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g, f, e, h, j, k) {
        "undefined" === typeof d && (d = null);
        "undefined" === typeof b && (b = null);
        flexiciousNmsp.FlexDataGridEvent.apply(this, [a, d, b, g, f, e, h, j, k]);
        this.newValue = this.itemEditor = null
    };
    flexiciousNmsp.FlexDataGridItemEditEvent = a;
    a.prototype = new flexiciousNmsp.FlexDataGridEvent;
    a.prototype.typeName = a.typeName = "FlexDataGridItemEditEvent";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridEvent", this.typeName]
    }
})();
(function() {
    var a;
    a = function(a, d, b, g, f) {
        flexiciousNmsp.BaseEvent.apply(this, [a, g, f]);
        this.grid = d;
        this.recordsToLoad = b
    };
    flexiciousNmsp.FlexDataGridVirtualScrollEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "FlexDataGridVirtualScrollEvent";
    a.prototype.getClassNames = function() {
        return ["BaseEvent", this.typeName]
    };
    a.VIRTUAL_SCROLL = "virtualScroll"
})();
(function() {
    var a;
    a = function(a, d, b, g, f) {
        this.isDefault = this.preferenceName = this.customData = this.preferenceXml = this.preferenceKey = null;
        flexiciousNmsp.BaseEvent.apply(this, [a, g, f]);
        this.preferenceKey = d;
        this.preferenceXml = b
    };
    flexiciousNmsp.PreferencePersistenceEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "PreferencePersistenceEvent";
    a.prototype.getClassNames = function() {
        return ["PreferencePersistenceEvent", "Event"]
    };
    a.PREFERENCES_LOADING = "preferencesLoading";
    a.LOAD_PREFERENCES = "loadPreferencesEvent";
    a.PERSIST_PREFERENCES = "persistPreferencesEvent";
    a.CLEAR_PREFERENCES = "clearPreferencesEvent"
})(window);
(function() {
    var a;
    a = function(a, d, b, g) {
        flexiciousNmsp.FilterPageSortChangeEvent.apply(this, [a, b, g])
    };
    flexiciousNmsp.PrintExportDataRequestEvent = a;
    a.prototype = new flexiciousNmsp.FilterPageSortChangeEvent;
    a.prototype.typeName = a.typeName = "PrintExportDataRequestEvent";
    a.prototype.getClassNames = function() {
        return ["PrintExportDataRequestEvent", "FilterPageSortChangeEvent"]
    };
    a.PRINT_EXPORT_DATA_REQUEST = "printExportDataRequest";
    a.PRINT_EXPORT_DATA_RECD = "printExportDataReceived";
    a.prototype.clone = function() {
        return new a(this.type, this.filter, this.bubbles, this.cancelable)
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g) {
        flexiciousNmsp.BaseEvent.apply(this, [a, b, g]);
        "undefined" === typeof d && (d = null);
        this.data = d
    };
    flexiciousNmsp.WrapperEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "WrapperEvent";
    a.prototype.getClassNames = function() {
        return ["BaseEvent", this.typeName]
    }
})();
(function() {
    var a;
    a = function(a, d, b) {
        this.textWritten = this.exportOptions = null;
        flexiciousNmsp.BaseEvent.apply(this, [a, d, b])
    };
    flexiciousNmsp.ExportEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "ExportEvent";
    a.prototype.getClassNames = function() {
        return ["ExportEvent", "Event"]
    };
    a.BEFORE_EXPORT = "beforeExport";
    a.AFTER_EXPORT = "afterExport"
})(window);
(function() {
    var a;
    a = function() {
        this.printExportOption = a.PRINT_EXPORT_CURRENT_PAGE;
        this.pageTo = this.pageFrom = -1;
        this.popupParent = null;
        this.showWarningMessage = this.showColumnPicker = !0;
        this.excludeHiddenColumns = this.hideHiddenColumns = !1;
        this.saveFileMessage = "File generated. Download?";
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.PrintExportOptions = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "PrintExportOptions";
    a.prototype.getClassNames = function() {
        return ["PrintExportOptions", "TypedObject"]
    };
    a.PRINT_EXPORT_CURRENT_PAGE = "Current Page";
    a.PRINT_EXPORT_ALL_PAGES = "All Pages";
    a.PRINT_EXPORT_SELECTED_PAGES = "Selected Pages";
    a.PRINT_EXPORT_SELECTED_RECORDS = "Selected Records"
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.PrintExportOptions.apply(this);
        this.echoUrl = "http://www.flexicious.com/Home/Echo";
        this.exporters = [new flexiciousNmsp.CsvExporter, new flexiciousNmsp.DocExporter, new flexiciousNmsp.HtmlExporter, new flexiciousNmsp.TxtExporter, new flexiciousNmsp.XmlExporter];
        this.exportOptionsRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ExportOptionsView);
        this.exportOptionsView = null;
        this.exporter = new flexiciousNmsp.CsvExporter;
        this.useSaveFileMessage = !1;
        this.enableLocalFilePersistence = !0;
        this.copyToClipboard = !1;
        this.exportFileName = "download";
        this.modalWindows = this.printExportParameters = null;
        this.tableWidth = 0;
        this.useExcelExporter = this.exportAllRecords = !1;
        this.availableColumns = [];
        this.columnsToExport = [];
        this.grid = null;
        this.openNewWindow = !1
    };
    flexiciousNmsp.ExportOptions = a;
    a.prototype = new flexiciousNmsp.PrintExportOptions;
    a.prototype.typeName = a.typeName = "ExportOptions";
    a.prototype.getClassNames = function() {
        return ["ExportOptions", "PrintExportOptions", "TypedObject"]
    };
    a.CSV_EXPORT = 0;
    a.DOC_EXPORT = 1;
    a.HTML_EXPORT = 2;
    a.TXT_EXPORT = 3;
    a.create = function(c) {
        "undefined" == typeof c && (c = 0);
        var d = new a;
        d.exporter = d.exporters[c];
        return d
    };
    a.prototype.getExporterName = function() {
        return this.exporter.getName()
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function() {
        this.nestIndent = 15;
        this.exportOptions = null;
        this.allRecords = [];
        this.nestDepth = 0;
        this.reusePreviousLevelColumns = !1;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.Exporter = c;
    c.prototype = new flexiciousNmsp.TypedObject;
    c.prototype.typeName = c.typeName = "Exporter";
    c.prototype.getClassNames = function() {
        return ["Exporter", "TypedObject"]
    };
    c.prototype.writeHeader = function() {
        return ""
    };
    c.prototype.writeRecord = function() {
        return ""
    };
    c.prototype.writeFooter = function() {
        return ""
    };
    c.getColumnHeader = function(b, a) {
        var d = b.getLevel().grid,
            c = b.getHeaderText() ? b.getHeaderText() : b.getDataField() ? b.getDataField() : "Column " + (a + 1);
        if (d) for (var d = d.getGroupedColumns(), j = 0; j < d.length; j++) {
            var k = d[j];
            if (k.implementsOrExtends("FlexDataGridColumnGroup") && 0 <= k.getAllColumns().indexOf(b)) return k.getHeaderText() + " - " + c
        }
        return c
    };
    c.prototype.saveFile = function(a, f, e) {
        if (e.openNewWindow) {
            var c = d.openBrowserPopup("about:blank");
            d.setHtml(c.document.body, a);
            c.document.title = e.exportFileName;
            c.print();
            c.close();
            d.removePopUp(e.exportOptionsView)
        } else if (swfobject.hasFlashPlayerVersion("9.0.18")) {
            var j = document.createElement("DIV");
            j.className = "bottomButtonBarSave";
            j.innerHTML = "You need Flash 10 for this to work!";
            d.addChild(e.exportOptionsView.domElement, j);
            Downloadify.create(j, {
                filename: function() {
                    return f
                },
                data: function() {
                    return a
                },
                onComplete: function() {
                    j.parentNode.removeChild(j);
                    d.removePopUp(e.exportOptionsView)
                },
                onCancel: function() {
                    j.parentNode.removeChild(j);
                    d.removePopUp(e.exportOptionsView)
                },
                onError: function() {
                    j.parentNode.removeChild(j);
                    d.removePopUp(e.exportOptionsView)
                },
                swf: b.IMAGE_PATH + "/media/downloadify.swf",
                downloadImage: b.IMAGE_PATH + "/download.png",
                width: 100,
                height: 30,
                transparent: !1,
                append: !1
            })
        } else this.uploadToServer(a, e)
    };
    c.prototype.uploadForEcho = function(b, a) {
        if (a.grid) {
            var e = new flexiciousNmsp.ExportEvent(flexiciousNmsp.ExportEvent.AFTER_EXPORT, !1, !1);
            e.exportOptions = a;
            e.textWritten = b;
            a.grid.dispatchEvent(e);
            e.textWritten != b && (b = e.textWritten)
        }
        a.copyToClipboard ? d.pasteToClipBoard(b) : a.enableLocalFilePersistence ? this.saveFile(b, a.exportFileName + "." + this.getExtension(), a) : this.uploadToServer(b, a)
    };
    c.prototype.uploadToServer = function(b, d) {
        var e = document.createElement("DIV");
        e.innerHTML = '<form id="flxsexportform" action="' + d.echoUrl + '" method="post" target="_blank"><input type="hidden" id="flxsbody" name="body" /><input type="hidden" id="flxscontentType" name="contentType" /><input type="hidden" id="flxsextension" name="extension" /></form>';
        a.document.body.appendChild(e);
        document.getElementById("flxsbody").value = b;
        document.getElementById("flxscontentType").value = this.getContentType();
        document.getElementById("flxsextension").value = this.getExtension();
        document.getElementById("flxsexportform").submit();
        e.parentNode.removeChild(e)
    };
    c.prototype.isIncludedInExport = function(b) {
        return !this.exportOptions || 0 == this.exportOptions.columnsToExport.length || d.doesArrayContainValue(this.exportOptions.columnsToExport, "name", b.getUniqueIdentifier())
    };
    c.prototype.getSpaces = function(b, a) {
        "undefined" == typeof a && (a = " ");
        if (!this.reusePreviousLevelColumns || !b.hasOwnProperty("enableHierarchicalNestIndent") || !b.enableHierarchicalNestIndent) return "";
        for (var d = "", c = 0; c < this.nestIndent * this.getNestDepth();) d += a, c++;
        return d
    };
    c.prototype.getName = function() {
        return ""
    };
    c.prototype.getExtension = function() {
        return ""
    };
    c.prototype.getContentType = function() {
        return ""
    };
    c.prototype.getNestDepth = function() {
        return this.nestDepth
    };
    c.prototype.getNestIndent = function() {
        return this.nestIndent
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.Exporter.apply(this)
    };
    flexiciousNmsp.CsvExporter = a;
    a.prototype = new flexiciousNmsp.Exporter;
    a.prototype.typeName = a.typeName = "CsvExporter";
    a.prototype.getClassNames = function() {
        return ["CsvExporter", "Exporter"]
    };
    a.prototype.writeHeader = function(a) {
        return this.buildHeader(a) + "\r\n"
    };
    a.prototype.buildHeader = function(a) {
        for (var d = "", b = 0, g = 0; g++ < this.getNestDepth();) d += " ,";
        a = a.getExportableColumns();
        for (g = 0; g < a.length; g++) {
            var f = a[g];
            this.isIncludedInExport(f) && (d += this.escapeCsv(flexiciousNmsp.Exporter.getColumnHeader(f, b++)) + ",")
        }
        0 == d.indexOf("ID") && (d = " " + d);
        return d
    };
    a.prototype.escapeCsv = function(a) {
        return a ? a.toString().replace('"\n', '"').replace(/"/g, '""') : ""
    };
    a.prototype.writeRecord = function(a, d) {
        var b = "",
            g = 0;
        if (!this.reusePreviousLevelColumns) for (; g++ < this.getNestDepth();) b += " ,";
        for (var g = a.getExportableColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            this.isIncludedInExport(e) && (b += '"' + this.getSpaces(e) + this.escapeCsv(e.itemToLabel(d)) + '",')
        }
        0 < b.length && (b = b.substr(0, b.length - 1));
        return b + "\r\n"
    };
    a.prototype.writeFooter = function() {
        return ""
    };
    a.prototype.getExtension = function() {
        return "csv"
    };
    a.prototype.getContentType = function() {
        return "application/vnd.ms-excel"
    };
    a.prototype.getName = function() {
        return "Excel"
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.Exporter.apply(this)
    };
    flexiciousNmsp.HtmlExporter = a;
    a.prototype = new flexiciousNmsp.Exporter;
    a.prototype.typeName = a.typeName = "HtmlExporter";
    a.prototype.getClassNames = function() {
        return ["HtmlExporter", "Exporter"]
    };
    a.prototype.writeHeader = function(a) {
        var d = "";
        0 < this.getNestDepth() && (d += "<tr><td colspan='" + (a.currentExportLevel.getParentLevel().getExportableColumns(null, !1, this.exportOptions).length + 1) + "'>");
        d += "<table " + (this.exportOptions && this.exportOptions.tableWidth ? "width='" + this.exportOptions.tableWidth + "'" : "") + "><tr>" + this.buildTh(a) + "</tr>\r\n";
        0 < this.getNestDepth() && (d += "</td></tr>");
        return d
    };
    a.prototype.buildTh = function(a) {
        var d = "",
            b = 0;
        0 < this.getNestDepth() && (d += "<th width='" + this.getNestDepth() * this.getNestIndent() + "'></th>");
        a = a.getExportableColumns();
        for (var g = 0; g < a.length; g++) {
            var f = a[g];
            this.isIncludedInExport(f) && (d += "<th>" + flexiciousNmsp.Exporter.getColumnHeader(f, b++) + "</th>\r\n")
        }
        return d
    };
    a.prototype.writeRecord = function(a, d) {
        var b = "<tr>\r\n";
        0 < this.getNestDepth() && !this.reusePreviousLevelColumns && (b += "<td width='" + this.getNestDepth() * this.getNestIndent() + "'></td>");
        for (var g = a.getExportableColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            this.isIncludedInExport(e) && (b += "<td>" + this.getSpaces(e, "&nbsp;") + this.escapeHtml(e.itemToLabel(d)) + "</td>\r\n")
        }
        return b + "</tr>\r\n"
    };
    a.prototype.escapeHtml = function(a) {
        return a ? a.toString().replace('"\n', '"').replace(/"/g, '""') : ""
    };
    a.prototype.writeFooter = function() {
        return "</table>\r\n"
    };
    a.prototype.getExtension = function() {
        return "html"
    };
    a.prototype.getContentType = function() {
        return "text/html"
    };
    a.prototype.getName = function() {
        return "Html"
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.HtmlExporter.apply(this)
    };
    flexiciousNmsp.DocExporter = a;
    a.prototype = new flexiciousNmsp.HtmlExporter;
    a.prototype.typeName = a.typeName = "DocExporter";
    a.prototype.getClassNames = function() {
        return ["DocExporter", "HtmlExporter", "Exporter"]
    };
    a.prototype.getExtension = function() {
        return "doc"
    };
    a.prototype.getContentType = function() {
        return "application/msword"
    };
    a.prototype.getName = function() {
        return "Word"
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.ExcelExporter.apply(this)
    };
    flexiciousNmsp.ExcelExporter = a;
    a.prototype = new flexiciousNmsp.HtmlExporter;
    a.prototype.typeName = a.typeName = "ExcelExporter";
    a.prototype.getClassNames = function() {
        return ["ExcelExporter", "HtmlExporter", "Exporter"]
    };
    a.prototype.writeHeader = function(a) {
        return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n<style>\n</style>\n</head>\n<body>\n' + flexiciousNmsp.HtmlExporter.prototype.writeHeader.apply(this, [a]).replace("<table ", "<table border=1")
    };
    a.prototype.writeFooter = function() {
        return flexiciousNmsp.HtmlExporter.prototype.writeFooter.apply(this, []) + "\n</body>\n</html>"
    };
    a.prototype.getExtension = function() {
        return "xls"
    };
    a.prototype.getContentType = function() {
        return "application/vnd.ms-excel"
    };
    a.prototype.getName = function() {
        return "Excel"
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.Exporter.apply(this)
    };
    flexiciousNmsp.TxtExporter = a;
    a.prototype = new flexiciousNmsp.Exporter;
    a.prototype.typeName = a.typeName = "TxtExporter";
    a.prototype.getClassNames = function() {
        return ["TxtExporter", "Exporter"]
    };
    a.prototype.writeHeader = function(a) {
        return this.buildHeader(a) + "\r\n"
    };
    a.prototype.buildHeader = function(a) {
        var d = "",
            b = 0;
        a = a.getExportableColumns();
        for (var g = 0; g < a.length; g++) {
            var f = a[g];
            this.isIncludedInExport(f) && (d += flexiciousNmsp.Exporter.getColumnHeader(f, b++) + "\t")
        }
        return d
    };
    a.prototype.writeRecord = function(a, d) {
        for (var b = "", g = a.getExportableColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            this.isIncludedInExport(e) && (b += e.itemToLabel(d) + "\t")
        }
        0 < b.length && (b = b.substr(0, b.length - 1));
        return b + "\r\n"
    };
    a.prototype.writeFooter = function() {
        return ""
    };
    a.prototype.getExtension = function() {
        return "txt"
    };
    a.prototype.getContentType = function() {
        return "text/plain"
    };
    a.prototype.getName = function() {
        return "Text"
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.Exporter.apply(this)
    };
    flexiciousNmsp.XmlExporter = a;
    a.prototype = new flexiciousNmsp.Exporter;
    a.prototype.typeName = a.typeName = "XmlExporter";
    a.prototype.getClassNames = function() {
        return ["XmlExporter", "Exporter"]
    };
    a.prototype.writeHeader = function() {
        return "<records>\r\n"
    };
    a.prototype.writeRecord = function(a, d) {
        for (var b = "<record\r\n ", g = a.getExportableColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            this.isIncludedInExport(e) && (b += e.getDataField().replace(/\./g, "") + "='" + this.escapeXml(e.itemToLabel(d)) + "'\r\n")
        }
        return b + "/>\r\n"
    };
    a.prototype.escapeXml = function(a) {
        return a ? a.replace('"\n', '"').replace(/'/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;") : ""
    };
    a.prototype.writeFooter = function() {
        return "</records>\r\n"
    };
    a.prototype.getExtension = function() {
        return "xml"
    };
    a.prototype.getContentType = function() {
        return "text/xml"
    };
    a.prototype.getName = function() {
        return "Xml"
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        this._grid = this._exportOptions = null;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.ExportController = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ExportController";
    a.prototype.getClassNames = function() {
        return ["ExportController", "TypedObject"]
    };
    a._instance = new flexiciousNmsp.ExportController;
    a.instance = function() {
        return a._instance
    };
    a.prototype.doexport = function(b, a) {
        "undefined" == typeof a && (a = null);
        a || (a = new flexiciousNmsp.ExportOptions);
        a.availableColumns = [];
        a.columnsToExport = [];
        a.printExportParameters = b.printExportParameters;
        a.grid = b;
        if (a.grid) {
            var d = new flexiciousNmsp.ExportEvent(flexiciousNmsp.ExportEvent.BEFORE_EXPORT);
            d.exportOptions = a;
            a.grid.dispatchEvent(d)
        }
        return this.exportWithOptions(b, a)
    };
    a.prototype.exportWithOptions = function(b, a) {
        var f, e;
        this._exportOptions = a;
        this._grid = b;
        a.availableColumns = [];
        if (a.useExcelExporter) {
            e = a.exporters;
            for (f = 0; f < e.length; f++) {
                var h = e[f];
                if (h.implementsOrExtends("CsvExporter")) {
                    f = e.indexOf(h);
                    e.splice(f, 1, new flexiciousNmsp.ExcelExporter);
                    break
                }
            }
        }
        e = b.getExportableColumns(a);
        for (f = 0; f < e.length; f++) a.availableColumns.push({
            name: e[f].getUniqueIdentifier()
        });
        if (a.hideHiddenColumns) for (f = 0; f < e.length; f++) h = e[f], h.getVisible() && a.columnsToExport.push({
            name: h.getUniqueIdentifier()
        });
        a.showColumnPicker ? (e = a.exportOptionsRenderer.newInstance(), a.exportOptionsView = e, e.setGrid(b), e.exportOptions = a, e.addEventListener(this, d.EVENT_CLOSE, this.onExportOptionsClose), (f = a.popupParent) || (f = c.getTopLevelApplication()), c.addPopUp(e, f, a.modalWindows, null, d.EXPORT_OPTIONS_TITLE)) : this.doExport()
    };
    a.prototype.onExportOptionsClose = function(b) {
        b.target.removeEventListener(d.EVENT_CLOSE, this.onExportOptionsClose);
        var a = b.target;
        b.detail == d.ALERT_OK && (this._exportOptions = a.exportOptions, this.doExport())
    };
    a.prototype.doExport = function() {};
    a.prototype.dispatchDataRequest = function() {
        var b = this._exportOptions;
        b.saveFileMessage && (b.useSaveFileMessage = !0);
        var a = this._grid,
            d = new flexiciousNmsp.PrintExportFilter;
        d.copyFrom(a.createFilter());
        d.printExportOptions = b;
        a.addEventListener(this, flexiciousNmsp.PrintExportDataRequestEvent.PRINT_EXPORT_DATA_RECD, this.onPrintRequestDataRecieved);
        b = new flexiciousNmsp.PrintExportDataRequestEvent(flexiciousNmsp.PrintExportDataRequestEvent.PRINT_EXPORT_DATA_REQUEST, d);
        a.dispatchEvent(b)
    };
    a.prototype.onPrintRequestDataRecieved = function() {
        this._grid.removeEventListener(flexiciousNmsp.PrintExportDataRequestEvent.PRINT_EXPORT_DATA_RECD, this.onPrintRequestDataRecieved);
        this.runExport(this._grid.getDataForPrintExport, !0)
    };
    a.prototype.runExport = function() {}
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        d.attachClass(this.domElement, "flexiciousGrid");
        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox;
        this.cbxColumns.alwaysVisible = !0;
        this.cbxExporters = new flexiciousNmsp.ComboBox;
        this.setWidth(500);
        this.exportOptions = new flexiciousNmsp.ExportOptions
    };
    flexiciousNmsp.ExportOptionsView = c;
    c.prototype = new flexiciousNmsp.Label;
    c.prototype.typeName = c.typeName = "ExportOptionsView";
    c.prototype.getClassNames = function() {
        return ["ExportOptionsView", "UIComponent"]
    };
    c.prototype.setGrid = function(b) {
        this._grid = b;
        this.enablePaging = b.getEnablePaging();
        this.pageCount = 0 < b.getPageSize() ? Math.ceil(b.getTotalRecords() / b.getPageSize()) : 1;
        this.selectedObjectsCount = b.getSelectedObjectsTopLevel().length
    };
    c.prototype.titlewindow1_creationCompleteHandler = function() {
        0 < this.exportOptions.columnsToExport.length && (this.cbxColumns.selectedValues = d.extractPropertyValues(exportOptions.columnsToExport, "name"))
    };
    c.prototype.onOK = function() {
        for (var g = document.getElementsByName("flxsExportpaging"), f = 0; f <= g.length; f++) if (!0 == g[f].checked) {
            this.exportOptions.printExportOption = g[f].value;
            break
        }
        g = parseInt(d.adapter.findElementWithClassName(this.domElement, "txtPageFrom").value);
        f = parseInt(d.adapter.findElementWithClassName(this.domElement, "txtPageTo").value);
        d.adapter.findElementWithClassName(this.domElement, "RBN_SELECT_PGS").checked ? 1 <= g && 1 <= f && g <= this.pageCount && f <= this.pageCount && g <= f ? (this.exportOptions.pageFrom = g, this.exportOptions.pageTo = f, this.close(b.ALERT_OK)) : a.alert("Please ensure that the 'page from' is less than or equal to 'page to'") : this.close(b.ALERT_OK)
    };
    c.prototype.close = function(a) {
        var d = new flexiciousNmsp.BaseEvent(b.EVENT_CLOSE);
        d.detail = a;
        this.dispatchEvent(d)
    };
    c.prototype.updateExportColumns = function() {
        this.exportOptions.columnsToExport = this.cbxColumns.getSelectedItems();
        1 == this.exportOptions.columnsToExport.length && "All" == this.exportOptions.columnsToExport[0].name && (this.exportOptions.columnsToExport = [])
    };
    c.prototype.onChangeExportOptions = function() {
        this.exportOptions.exporter = this.cbxExporters.getSelectedItem()
    };
    c.prototype.onCancel = function() {
        d.removePopUp(this)
    };
    c.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var a = new flexiciousNmsp.UIComponent("div");
        a.domElement.className = "exportOptionsView";
        this.addChild(a);
        var f;
        f = "" + ("   <div class='columnsLabel'>" + b.EXP_LBL_COLS_TO_EXPORT_TEXT + "</div>  <div class='options'>   <input type='radio' class='RBN_CURRENT_PAGE' checked name='flxsExportpaging'  value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE + "'> " + b.EXP_RBN_CURRENT_PAGE_LABEL + "<br/>   <input type='radio' class='RBN_ALL_PAGES' name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES + "'> " + b.EXP_RBN_ALL_PAGES_LABEL + "<br/>   <input type='radio' class='RBN_SELECT_PGS' name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES + "'> " + b.EXP_RBN_SELECT_PGS_LABEL + "<br/>   <input  type='number' class='txtPageFrom' maxlength='5 '>   <label> " + b.PGR_TO + "</label>   <input   type='number' class='txtPageTo' maxlength='5'>   <label>" + this.pageCount + "</label><br/>   <input " + (0 < this.selectedObjectsCount ? "" : "disabled") + " type='radio' class='rbnSelectedRecords'   name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS + "'> " + b.SELECTED_RECORDS + "(" + (0 == this.selectedObjectsCount ? "None Selected)" : this.selectedObjectsCount + " selected)") + "<br/>   <label class='LBL_EXPORT_FORMAT'> " + b.EXP_LBL_EXPORT_FORMAT_TEXT + "</label></div><br/><br/>");
        f += "<div class='bottomButtonBar'> <a class='BTN_EXPORT button' alt='Export'>" + (this.exportOptions.openNewWindow ? b.PRT_BTN_PRINT_LABEL : b.EXP_BTN_EXPORT_LABEL) + "</a> <a class='BTN_CANCEL button' alt='Cancel'>" + b.EXP_BTN_CANCEL_LABEL + "</a></div>";
        a.setInnerHTML(f);
        f = d.adapter.findElementWithClassName(this.domElement, "BTN_EXPORT");
        var e = d.adapter.findElementWithClassName(this.domElement, "BTN_CANCEL");
        flexiciousNmsp.UIUtils.addDomEventListener(this, f, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onOK()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, e, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onCancel()
        });
        this.cbxColumns.setDataProvider(this.exportOptions.availableColumns);
        this.cbxColumns.labelField = "name";
        this.cbxColumns.dataField = "name";
        this.cbxColumns.addEventListener(this, b.EVENT_CHANGE, this.updateExportColumns);
        a.addChild(this.cbxColumns);
        this.cbxColumns.showPopup(a);
        this.cbxExporters.setDataProvider(this.exportOptions.exporters);
        this.cbxExporters.labelField = "name";
        this.cbxExporters.dataField = "name";
        this.cbxExporters.setSelectedValue(this.exportOptions.getExporterName());
        this.cbxExporters.addEventListener(this, b.EVENT_CHANGE, this.onChangeExportOptions);
        a.addChild(this.cbxExporters)
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.Constants;
    a = function() {
        this.DEFAULT_TABLE_WIDTH = 1E3;
        flexiciousNmsp.ExportController.apply(this)
    };
    flexiciousNmsp.ExtendedExportController = a;
    a.prototype = new flexiciousNmsp.ExportController;
    a.prototype.typeName = a.typeName = "ExtendedExportController";
    a.prototype.getClassNames = function() {
        return ["ExtendedExportController", "ExportController", "TypedObject"]
    };
    a._instance = new a;
    a.instance = function() {
        return a._instance
    };
    a.prototype.doExport = function() {
        var a = this._exportOptions,
            b = this._grid.implementsOrExtends("FlexDataGrid") ? this._grid : null;
        "server" == b.getFilterPageSortMode() && (a.printExportOption == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES || a.printExportOption == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES) ? this.dispatchDataRequest() : this.runExport(b.getDataForPrintExport(a))
    };
    a.prototype.runExport = function(a) {
        this.runNestedExport(a)
    };
    a.prototype.runNestedExport = function(a, b) {
        "undefined" == typeof b && (b = null);
        var g = this._grid;
        b || (b = g.getColumnLevel());
        g = this._exportOptions;
        g.exporter.exportOptions = g;
        for (var f = 0; f < a.length; f++) g.exporter.allRecords.push(a[f]);
        g.tableWidth || (g.tableWidth = c.DEFAULT_TABLE_WIDTH);
        for (var f = g.exporter.writeHeader(this._grid), e = 0; e < a.length; e++) f += this.writeRecord(a[e], b);
        this.setExportLevel(b);
        f += g.exporter.writeFooter(this._grid);
        g.exporter.uploadForEcho(f, g);
        this.setExportLevel(null)
    };
    a.prototype.writeRecord = function(a, b) {
        var g = this._grid.implementsOrExtends("FlexDataGrid") ? this._grid : null,
            f = this._exportOptions,
            e = "";
        this.setExportLevel(b);
        e += f.exporter.writeRecord(this._grid, a);
        if (b.nextLevel) {
            this.setExportLevel(b.nextLevel);
            var c = b.getChildren(a, !0, !1, !0);
            if (0 < g.getLength(c)) {
                g.currentExportLevel.reusePreviousLevelColumns || (e += f.exporter.writeHeader(g));
                for (var j = 0; j < c.length; j++) e += this.writeRecord(c[j], b.nextLevel);
                g.currentExportLevel.reusePreviousLevelColumns || (e += f.exporter.writeFooter(g))
            }
        }
        return e
    };
    a.prototype.setExportLevel = function(a) {
        var b = this._grid.implementsOrExtends("FlexDataGrid") ? this._grid : null;
        this.getExportOptions().exporter.nestDepth = a ? a.getNestDepth() - 1 : 0;
        this.getExportOptions().exporter.reusePreviousLevelColumns = a ? a.reusePreviousLevelColumns : !1;
        b.currentExportLevel = a
    };
    a.prototype.getExportOptions = function() {
        return this._exportOptions
    };
    a.prototype.getGrid = function() {
        return this._grid
    }
})(window);
(function() {
    var a;
    a = function() {
        this.loadDefaultPreferenceOnCreationComplete = !0;
        this.defaultPreferenceName = "Default";
        this.savedPreferences = [];
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.GridPreferencesInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "GridPreferencesInfo";
    a.prototype.getClassNames = function() {
        return ["GridPreferencesInfo", "TypedObject"]
    };
    a.prototype.toPreferenceString = function(a) {
        var d;
        d = "" + ((this.loadDefaultPreferenceOnCreationComplete ? "y" : "n") + a.multiPrefGridPrefPropDelimiter);
        d += this.defaultPreferenceName + a.multiPrefGridPrefPropDelimiter;
        for (var b = 0; b < this.savedPreferences.length; b++) {
            var g = this.savedPreferences[b];
            d += g.name + a.multiPrefPrefPropDelimiter;
            d += g.preferences + a.multiPrefPrefPropDelimiter;
            d += a.multiPrefDelimiter
        }
        return d
    };
    a.prototype.fromPreferenceString = function(a, d) {
        var b = d.split(a.multiPrefGridPrefPropDelimiter);
        if (b && 1 == b.length) {
            this.loadDefaultPreferenceOnCreationComplete = !0;
            var g = new flexiciousNmsp.PreferenceInfo;
            g.name = this.defaultPreferenceName;
            g.preferences = b[0];
            this.savedPreferences.push(g);
            return this
        }
        this.loadDefaultPreferenceOnCreationComplete = "y" == b[0];
        this.defaultPreferenceName = b[1];
        b = b[2].split(a.multiPrefDelimiter);
        for (g = 0; g < b.length; g++) if (d = b[g]) {
            var f = new flexiciousNmsp.PreferenceInfo,
                e = d.split(a.multiPrefPrefPropDelimiter);
            f.name = e[0];
            f.preferences = e[1];
            this.savedPreferences.push(f)
        }
        return this
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        d.attachClass(this.domElement, "flexiciousGrid");
        this.setWidth(600)
    };
    flexiciousNmsp.OpenSettingsPopup = c;
    c.prototype = new flexiciousNmsp.UIComponent;
    c.prototype.typeName = c.typeName = "OpenSettingsPopup";
    c.prototype.getClassNames = function() {
        return ["OpenSettingsPopup", "UIComponent"]
    };
    c.prototype.setGrid = function(b) {
        this.grid = b;
        this.gpi = this.grid.getGridPreferencesInfo();
        this.currentPref = this.grid.getCurrentPreferenceInfo()
    };
    c.prototype.onClearSettings = function() {
        this.grid.clearPreferences();
        d.showMessage("Preferences Cleared!");
        d.removePopUp(this)
    };
    c.prototype.onSaveSettings = function() {
        this.grid.persistPreferences(this.currentPref.name, this.currentPref.name == this.gpi.defaultPreferenceName);
        "server" != this.grid.preferencePersistenceMode && d.showMessage("Preferences Saved!");
        d.removePopUp(this)
    };
    c.prototype.onCancel = function() {
        d.removePopUp(this)
    };
    c.prototype.openSettings_cbDefaultChangeHandler = function() {};
    c.prototype.onDeleteLinkBtnlick = function() {
        this.onDeletePref(rptPrefs.dataProvider.getItemAt(event.currentTarget.repeaterIndex).implementsOrExtends("PreferenceInfo"))
    };
    c.prototype.onDeletePref = function(b) {
        b.isSystemPref ? a.alert("This is a system preference, it cannot be deleted") : a.confirm("Are you sure you wish to delete this preference?") && this.gpi.savedPreferences.splice(this.gpi.savedPreferences.indexOf(b), 1)
    };
    c.prototype.onDeleteLinkBtnlick = function(b) {
        this.onDeletePref(this.gpi.savedPreferences[b])
    };
    c.prototype.onApplyPref = function(b) {
        this.grid.setCurrentPreferenceInfo(b, !0);
        this.currentPref = b;
        d.removePopUp(this)
    };
    c.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var a = "<div>The preferences you specify below will be retained when this grid is loaded in the future:</div>";
        this.grid.enableMultiplePreferences && (a += '<div ></span><span id="' + this.grid.id + "-link-button-" + e + '" class="openSettingslinkbtn"  tabindex="0"><label>  ' + b.OPEN_SETTINGS_DEFAULT + "</label><label>  " + b.OPEN_SETTINGS_PREFERENCE_NAME + "</label><label>  " + b.OPEN_SETTINGS_DELETE + "</label><label>  " + b.OPEN_SETTINGS_APPLY + "</label></div><div style='...'/>");
        for (var a = a + "<table border='0' style='...'><tr><td>Name</td><td>Is Default?</td><td>Apply</td><td>Delete</td></tr>", f = this.grid.getGridPreferencesInfo().savedPreferences, e = 0; e < f.length; e++) a += "<tr><td> + item.name + </td><td> + item.defaultPreferenceName + </td></tr>";
        a = a + "<table border='0' style='...'> <tr><td>   <div style='...'><input class='cbDefault' onchange='openSettings_cbDefaultChangeHandler'></input><label class='txtName'></label><a href=''>[Delete]</a><a href=''>[Apply]</a></td></tr></table></div>" + ("<div class='bottomButtonBar'> <a  class='BTN_REMOVE_PREFS button' alt='" + b.OPEN_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES + "'> " + b.OPEN_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES + "</a> <a  class='BTN_SAVE_CHANGES button' alt='" + b.OPEN_SETTINGS_SAVE_CHANGES + "'> " + b.OPEN_SETTINGS_SAVE_CHANGES + "</a> <a class='BTN_CLOSE button' alt='" + b.OPEN_SETTINGS_CLOSE + "'> " + b.OPEN_SETTINGS_CLOSE + "</a></div>");
        this.setInnerHTML(a);
        var a = d.adapter.findElementWithClassName(this.domElement, "DELETE_LINK_BTN"),
            f = d.adapter.findElementWithClassName(this.domElement, "APPLY_LINK_BTN"),
            e = d.adapter.findElementWithClassName(this.domElement, "BTN_REMOVE_PREFS"),
            c = d.adapter.findElementWithClassName(this.domElement, "BTN_SAVE_CHANGES"),
            j = d.adapter.findElementWithClassName(this.domElement, "BTN_CLOSE");
        flexiciousNmsp.UIUtils.addDomEventListener(this, cbDefaultBtn, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousSortPopup").component.onDefaultRadioButtonClick()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, a, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousSortPopup").component.onDeleteLinkBtnlick()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, f, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousSortPopup").component.onApplyLinkBtnClick()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, e, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onClearSettings()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, c, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onSaveSettings()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, j, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onCancel()
        })
    }
})(window);
(function() {
    var a;
    a = function() {
        this.name = null;
        this.isSystemPref = !1;
        this.preferences = null;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.PreferenceInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "PreferenceInfo";
    a.prototype.getClassNames = function() {
        return ["PreferenceInfo", "TypedObject"]
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        c.attachClass(this.domElement, "flexiciousGrid");
        this.setWidth(600);
        this.setHeight(120)
    };
    flexiciousNmsp.SaveSettingsPopup = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "SaveSettingsPopup";
    a.prototype.getClassNames = function() {
        return ["SaveSettingsPopup", "UIComponent"]
    };
    a.prototype.setGrid = function(b) {
        this.grid = b;
        this.preferencesSet = this.grid.preferencesSet;
        this.filtersEnabled = this.grid.getEnableFilters();
        this.preferenceName = this.grid.getCurrentPreferenceInfo() ? grid.getCurrentPreferenceInfo().name : "Default";
        this.preferenceIsDefault = this.grid.getCurrentPreferenceInfo() ? grid.getCurrentPreferenceInfo().name == grid.getGridPreferencesInfo().defaultPreferenceName : "Default"
    };
    a.prototype.onClearSettings = function() {
        this.grid.clearPreferences();
        c.showMessage("Preferences Cleared!");
        c.removePopUp(this)
    };
    a.prototype.onCancel = function() {
        c.removePopUp(this)
    };
    a.prototype.onSaveSettings = function() {
        var b = [];
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_COLUMN_ORDER").checked && b.push(d.PERSIST_COLUMN_ORDER);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_COLUMN_VISIBILITY").checked && b.push(d.PERSIST_COLUMN_VISIBILITY);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_COLUMN_WIDTH").checked && b.push(d.PERSIST_COLUMN_WIDTH);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_FILTER").checked && b.push(d.PERSIST_FILTER);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_SORT").checked && b.push(d.PERSIST_SORT);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_FOOTER_FILTER_VISIBILITY").checked && b.push(d.PERSIST_FOOTER_FILTER_VISIBILITY);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_PAGE_SIZE").checked && b.push(d.PERSIST_PAGE_SIZE);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_PRINT_SETTINGS").checked && b.push(d.PERSIST_PRINT_SETTINGS);
        c.adapter.findElementWithClassName(this.domElement, "cbPERSIST_SCROLL").checked && (b.push(d.PERSIST_VERTICAL_SCROLL), b.push(d.PERSIST_HORIZONTAL_SCROLL));
        this.grid.preferencesToPersist = b.join(",");
        this.grid.enableMultiplePreferences ? this.grid.persistPreferences(c.adapter.findElementWithClassName(this.domElement, "txtPreferenceName").value, c.adapter.findElementWithClassName(this.domElement, "cbDefaultPreference").checked) : this.grid.persistPreferences();
        "server" != this.grid.preferencePersistenceMode && c.showMessage("Preferences Saved!");
        c.removePopUp(this)
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var b = "<div>" + d.SAVE_SETTINGS_TITLE + "</div>";
        this.grid.enableMultiplePreferences && (b += "<div style='float:left;'><span>" + d.SAVE_SETTINGS_PREFERENCE_NAME + "</span><input class='txtPreferenceName' value='" + this.preferenceName + "'><input class='cbDefaultPreference' type='checkbox' " + (this.preferenceIsDefault ? "checked" : "") + "> Is Default?</div><div style='clear:both;'/>");
        b += "<table border='0' style='width: 550px'> <tr><td>   <div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_COLUMN_ORDER' checked> " + d.SAVE_SETTINGS_ORDER_OF_COLUMNS + " <br/>   <input type='checkbox' class='cbPERSIST_COLUMN_VISIBILITY' checked> " + d.SAVE_SETTINGS_VISIBILITY_OF_COLUMNS + "<br/>   <input type='checkbox' class='cbPERSIST_COLUMN_WIDTH' checked> " + d.SAVE_SETTINGS_WIDTHS_OF_COLUMNS + "</div>   </td><td><div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_FILTER' checked> " + d.SAVE_SETTINGS_FILTER_CRITERIA + "<br/>   <input type='checkbox' class='cbPERSIST_SORT' checked> " + d.SAVE_SETTINGS_SORT_SETTINGS + "<br/>   <input type='checkbox' class='cbPERSIST_SCROLL' checked> " + d.SAVE_SETTINGS_SCROLL_POSITIONS + "</div>   </td><td><div style='display: inline-block;'><input type='checkbox' class='cbPERSIST_FOOTER_FILTER_VISIBILITY' checked> " + d.SAVE_SETTINGS_FILTER_AND_FOOTER_VISIBILITY + "<br/>   <input type='checkbox' class='cbPERSIST_PAGE_SIZE' checked> " + d.SAVE_SETTINGS_RECORDS_PER_PAGE + "<br/>   <input type='checkbox' class='cbPERSIST_PRINT_SETTINGS' checked> " + d.SAVE_SETTINGS_PRINT_SETTINGS + "</div>   </td></tr></table></div>";
        b += "<div class='bottomButtonBar'> <a  class='BTN_REMOVE_PREFS button' alt='" + (this.grid.enableMultiplePreferences ? d.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES : d.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES) + "'>" + (this.grid.enableMultiplePreferences ? d.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES : d.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES) + "</a> <a  class='BTN_SAVE_PREF button' alt='" + d.SAVE_SETTINGS_SAVE_PREFERENCES + "'> " + d.SAVE_SETTINGS_SAVE_PREFERENCES + "</a> <a class='BTN_CANCEL button' alt='" + d.SAVE_SETTINGS_CANCEL + "'>" + d.SAVE_SETTINGS_CANCEL + "</a></div>";
        this.setInnerHTML(b);
        var b = c.adapter.findElementWithClassName(this.domElement, "BTN_REMOVE_PREFS"),
            a = c.adapter.findElementWithClassName(this.domElement, "BTN_SAVE_PREF"),
            f = c.adapter.findElementWithClassName(this.domElement, "BTN_CANCEL");
        flexiciousNmsp.UIUtils.addDomEventListener(this, b, "click", function(b) {
            c.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onClearSettings()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, a, "click", function(b) {
            c.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onSaveSettings()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, f, "click", function(b) {
            c.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onCancel()
        })
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox;
        this.cbxColumns.alwaysVisible = !0;
        c.attachClass(this.domElement, "flexiciousGrid");
        this.setWidth(500);
        this.invalidateDisplayList()
    };
    flexiciousNmsp.SettingsPopup = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "SettingsPopup";
    a.prototype.getClassNames = function() {
        return ["SettingsPopup", "UIComponent"]
    };
    a.prototype.setGrid = function(b) {
        this.grid = b;
        b = [];
        for (var a = this.grid.getSettingsColumns(), d = 0; d < a.length; d++) {
            var e = a[d];
            e.getVisible() && b.push(e)
        }
        a.length != b.length && (this.cbxColumns.selectedValues = c.extractPropertyValues(b, "uniqueIdentifier"));
        this.cbxColumns.setDataProvider(a);
        this.cbxColumns.dataField = "uniqueIdentifier";
        this.cbxColumns.labelField = "headerText";
        this._filterVisible = this.grid.getFilterVisible();
        this._footerVisible = this.grid.getFooterVisible();
        this._pageSize = this.grid.getPageSize();
        this._enablePaging = this.grid.getEnablePaging();
        this._enableFilters = this.grid.getEnableFilters();
        this._enableFooters = this.grid.getEnableFooters()
    };
    a.prototype.onOK = function() {
        for (var b = this.cbxColumns.selectedValues, a = this.grid.getSettingsColumns(), d = this.grid.getColumns(), e = 0; e < d.length; e++) {
            var h = d[e]; - 1 != a.indexOf(h) && h.setVisible(0 <= b.indexOf(h.getUniqueIdentifier()) || this.cbxColumns.getIsAllSelected())
        }
        this._enableFilters && this.grid.setFilterVisible(c.adapter.findElementWithClassName(this.domElement, "cbFilters").checked);
        this._enableFooters && this.grid.setFooterVisible(c.adapter.findElementWithClassName(this.domElement, "cbFooter").checked);
        this.grid.validateNow();
        this._enablePaging && this.grid.setPageSize(parseInt(c.adapter.findElementWithClassName(this.domElement, "txtPageSize").value));
        this.grid.refreshLayout();
        c.removePopUp(this)
    };
    a.prototype.onCancel = function() {
        c.removePopUp(this)
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var b = new flexiciousNmsp.UIComponent("div");
        b.domElement.className = "settingsPopup";
        this.addChild(b);
        var a;
        a = "" + ("  <div class='columnsLabel'> " + d.SETTINGS_COLUMNS_TO_SHOW + "</div>  <div class='options'> <input type='checkbox' " + (this._enableFooters ? "" : 'style="visibility:hidden"') + " class='cbFooter' " + (this._footerVisible ? "checked" : "") + "/>  <span " + (this._enableFooters ? "" : 'style="visibility:hidden"') + "> " + d.SETTINGS_SHOW_FOOTERS + "</span> <br/> <input type='checkbox' " + (this._enableFilters ? "" : 'style="visibility:hidden"') + " class='cbFilters' " + (this._filterVisible ? "checked" : "") + "/>  <span " + (this._enableFilters ? "" : 'style="visibility:hidden"') + "> " + d.SETTINGS_SHOW_FILTER + "</span><br/><br/> <div " + (this._enablePaging ? "" : 'style="visibility:hidden"') + "><span>" + d.SETTINGS_RECORDS_PER_PAGE + "</span> <input class='txtPageSize' type='number' value='" + this._pageSize + "'></div></div>");
        a += "<div class='bottomButtonBar'> <a  class='BTN_SAVE_PREF button' alt='" + d.SETTINGS_APPLY + "'>" + d.SETTINGS_APPLY + "</a> <a class='BTN_CANCEL button' alt='" + d.SETTINGS_CANCEL + "'>" + d.SETTINGS_CANCEL + "</a></div>";
        b.setInnerHTML(a);
        a = c.adapter.findElementWithClassName(this.domElement, "BTN_SAVE_PREF");
        var f = c.adapter.findElementWithClassName(this.domElement, "BTN_CANCEL");
        flexiciousNmsp.UIUtils.addDomEventListener(this, a, "click", function(b) {
            c.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onOK()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, f, "click", function(b) {
            c.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onCancel()
        });
        b.addChild(this.cbxColumns);
        this.cbxColumns.showPopup(b)
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function() {
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.UserSettingsController = c;
    c.prototype = new flexiciousNmsp.TypedObject;
    c.prototype.typeName = c.typeName = "UserSettingsController";
    c.prototype.getClassNames = function() {
        return ["UserSettingsController", "TypedObject"]
    };
    c.instance = function() {
        c._instance || (c._instance = new c);
        return c._instance
    };
    c.prototype.clearPreferences = function(b) {
        b = b.persistable;
        if ("client" == b.preferencePersistenceMode) d.hasLocalStorage() ? a.localStorage[b.getPreferencePersistenceKey()] = null : d.showError("Local Storage is not supported for your browser. Please implement server persistence or disable persistence");
        else {
            var f = new flexiciousNmsp.PreferencePersistenceEvent(flexiciousNmsp.PreferencePersistenceEvent.CLEAR_PREFERENCES, b.getPreferencePersistenceKey(), null);
            b.dispatchEvent(f)
        }
        b.enableMultiplePreferences && (b.getGridPreferencesInfo().savedPreferences = [])
    };
    c.prototype.loadPreferences = function(b) {
        var a = b.persistable,
            e = a.getPreferencePersistenceKey(),
            c = new flexiciousNmsp.PreferencePersistenceEvent(flexiciousNmsp.PreferencePersistenceEvent.PREFERENCES_LOADING, e, null);
        a.dispatchEvent(c);
        if ("client" == a.preferencePersistenceMode) {
            var j;
            if (d.hasLocalStorage()) try {
                j = localStorage[a.getPreferencePersistenceKey()]
            } catch (k) {
                j = null
            } else d.showError("Local Storage is not supported for your browser. Please implement server persistence or disable persistence");
            var l = "";
            if (a.enableMultiplePreferences && null != j) {
                var m = (new flexiciousNmsp.GridPreferencesInfo).fromPreferenceString(b, j);
                a.setGridPreferencesInfo(m, !1);
                for (l = 0; l < m.savedPreferences.length; l++) e = m.savedPreferences[l], e.name == m.defaultPreferenceName && (j = e.preferences, a.setCurrentPreferenceInfo(e, !1))
            }
            null != j && "null" != j && (0 <= j.indexOf(b.prefCustomDataDelimiter) && j.split(b.prefCustomDataDelimiter), (!a.enableMultiplePreferences || m.loadDefaultPreferenceOnCreationComplete) && a.setPreferences(j))
        } else b = new flexiciousNmsp.PreferencePersistenceEvent(flexiciousNmsp.PreferencePersistenceEvent.LOAD_PREFERENCES, e, null), b.customData = l, a.dispatchEvent(b)
    };
    c.prototype.persistPreferences = function(b, a, e) {
        "undefined" == typeof a && (a = "Default");
        "undefined" == typeof e && (e = !1);
        var c = b.persistable,
            j = this.getPreferencesString(b),
            k = new flexiciousNmsp.PreferencePersistenceEvent(flexiciousNmsp.PreferencePersistenceEvent.PERSIST_PREFERENCES, c.getPreferencePersistenceKey(), j);
        k.preferenceName = a;
        k.isDefault = e;
        c.dispatchEvent(k);
        c.preferencesSet = !0;
        k.customData && (j += b.prefCustomDataDelimiter + k.customData);
        if (c.enableMultiplePreferences) {
            for (var k = null, l = 0; l < c.getGridPreferencesInfo().savedPreferences.length; l++) {
                var m = c.getGridPreferencesInfo().savedPreferences[l];
                if (m.name == a) {
                    k = m;
                    break
                }
            }
            k || (k = new flexiciousNmsp.PreferenceInfo, k.name = a, c.getGridPreferencesInfo().savedPreferences.push(k));
            k.preferences = j;
            e && (c.getGridPreferencesInfo().defaultPreferenceName = a);
            "client" == c.preferencePersistenceMode && (d.hasLocalStorage() ? localStorage[c.getPreferencePersistenceKey()] = c.getGridPreferencesInfo().toPreferenceString(b) : d.showError("Local Storage is not supported for your browser. Please implement server persistence or disable persistence"));
            c.setCurrentPreferenceInfo(k, !1)
        } else "client" == c.preferencePersistenceMode && (d.hasLocalStorage() ? localStorage[c.getPreferencePersistenceKey()] = j : d.showError("Local Storage is not supported for your browser. Please implement server persistence or disable persistence"))
    };
    c.prototype.getPreferencesString = function(b) {
        return this.getCompactPreferencesString(b)
    };
    c.prototype.parsePreferences = function(b, d) {
        if (!d || 0 == d.length) return [];
        var e = b.persistable;
        try {
            return this.parseCompactPreferencesString(b, d)
        } catch (c) {
            if (b.silentFailure) return [];
            if (b.allowClearOnCorruption) a.confirm(b.showErrorMessageWhenCorrupt.replace("__ERRORMESSAGE__", c.message)) && e.clearPreferences();
            else throw c;
        }
        return []
    };
    c.prototype.parseCompactPreferencesString = function(a, f) {
        for (var e = [], c = f.split(a.prefDelimiter), j = c[0].split(a.prefColDelimiter), k = [], l = [], m = [], n = [], p = [], q = a.persistable, s = 0; s < j.length; s++) {
            var r = j[s].split(a.prefColPrefDelimiter),
                w = r[0];
            k.push(w);
            "o" != r[1] && l.push({
                key: w,
                property: "y" == r[1]
            });
            "o" != r[2] && m.push({
                key: w,
                property: r[2]
            });
            "o" != r[3] && null != r[3] && n.push({
                key: w,
                property: d.fromPersistenceString(r[3])
            });
            if ("o" != r[4]) for (var v = new flexiciousNmsp.FilterSort, E = q.getColumns(), z = 0; z < E.length; z++) {
                var u = E[z];
                if (u.getUniqueIdentifier() == w) {
                    v.sortColumn = u.getSortFieldName();
                    v.isAscending = "y" == r[4];
                    p.push(v);
                    break
                }
            }
        }
        e.push({
            key: b.PERSIST_COLUMN_ORDER,
            data: k
        });
        0 < l.length && e.push({
            key: b.PERSIST_COLUMN_VISIBILITY,
            data: l
        });
        0 < m.length && e.push({
            key: b.PERSIST_COLUMN_WIDTH,
            data: m
        });
        0 < p.length && e.push({
            key: b.PERSIST_SORT,
            data: p
        });
        0 < n.length && e.push({
            key: b.PERSIST_FILTER,
            data: n
        });
        "o" != c[1] && e.push({
            key: b.PERSIST_VERTICAL_SCROLL,
            data: c[1].toString()
        });
        "o" != c[2] && e.push({
            key: b.PERSIST_HORIZONTAL_SCROLL,
            data: c[2].toString()
        });
        "o" != c[3] && e.push({
            key: b.PERSIST_FOOTER_FILTER_VISIBILITY,
            data: ["y" == c[3].toString().charAt(0), "y" == c[3].toString().charAt(1)]
        });
        "o" != c[4] && e.push({
            key: b.PERSIST_PAGE_SIZE,
            data: c[4].toString()
        });
        "o" != c[5] && e.push({
            key: b.PERSIST_PRINT_SETTINGS,
            data: c[5].toString()
        });
        return e
    };
    c.prototype.getCompactPreferencesString = function(a) {
        for (var f = a.persistable.implementsOrExtends("IExtendedDataGrid") ? a.persistable : null, e = f.preferencesToPersist.split(","), c = f.getColumns(), j = "", k = 0, l = a.prefColPrefDelimiter, m = f.createFilter().sorts, n = 0; n < c.length; n++) {
            var p = c[n],
                q = p.getUniqueIdentifier(),
                s = null;
            p.getSearchField() && (s = f.getFilterValue(p.getSearchField()));
            for (var r = null, w = 0; w < m.length; w++) {
                var v = m[w];
                if (v.sortColumn == p.getSortFieldName()) {
                    r = v;
                    break
                }
            }
            j += q + l;
            j += (e.indexOf(b.PERSIST_COLUMN_VISIBILITY) ? p.getVisible() ? "y" : "n" : "o") + l;
            j += (e.indexOf(b.PERSIST_COLUMN_WIDTH) ? parseInt(p.getWidth()).toString() : "o") + l;
            j += (e.indexOf(b.PERSIST_FILTER) && null != s && "" != s ? d.toPersistenceString(s) : "o") + l;
            j += (e.indexOf(b.PERSIST_SORT) && r ? r.isAscending ? "y" : "n" : "o") + l;
            j += a.prefColDelimiter;
            k++
        }
        j += a.prefDelimiter;
        j += (e.indexOf(b.PERSIST_VERTICAL_SCROLL) ? f.getVerticalScrollPosition() : "o") + a.prefDelimiter;
        j += (e.indexOf(b.PERSIST_HORIZONTAL_SCROLL) ? f.getHorizontalScrollPosition() : "o") + a.prefDelimiter;
        j += (e.indexOf(b.PERSIST_FOOTER_FILTER_VISIBILITY) ? (f.footerVisible ? "y" : "n") + (f.filterVisible ? "y" : "n") : "o") + a.prefDelimiter;
        j += (e.indexOf(b.PERSIST_PAGE_SIZE) ? f.getPageSize() : "o") + a.prefDelimiter;
        return j += (e.indexOf(b.PERSIST_PRINT_SETTINGS) ? f.lastPrintOptionsString ? f.lastPrintOptionsString : f.persistedPrintOptionsString : "o") + a.prefDelimiter
    };
    c.prototype.getLegacyPreferences = function(a) {
        for (var d = a.persistable.implementsOrExtends("IExtendedDataGrid") ? a.persistable : null, e = d.preferencesToPersist.split(","), c = [], j = 0; j < e.length; j++) var k = e[j];
        if (k == b.PERSIST_COLUMN_ORDER) c.push({
            key: k,
            data: this.getColumnOrder(a)
        });
        else if (k == b.PERSIST_COLUMN_VISIBILITY) c.push({
            key: k,
            data: this.getColumnVisibility(a)
        });
        else if (k == b.PERSIST_COLUMN_WIDTH) c.push({
            key: k,
            data: this.getColumnWidths(a)
        });
        else if (k == b.PERSIST_FILTER) {
            a = [];
            e = d.getColumns();
            for (j = 0; j < e.length; j++) {
                var l = e[j];
                if (l.getSearchField()) var m = d.getFilterValue(l.getSearchField());
                m && a.push({
                    key: l.getUniqueIdentifier(),
                    property: m
                })
            }
            c.push({
                key: k,
                data: a
            })
        } else k == b.PERSIST_SORT ? c.push({
            key: k,
            data: d.createFilter().sorts
        }) : k == b.PERSIST_VERTICAL_SCROLL ? c.push({
            key: k,
            data: d.getVerticalScrollPosition()
        }) : k == b.PERSIST_HORIZONTAL_SCROLL ? c.push({
            key: k,
            data: d.getHorizontalScrollPosition()
        }) : k == b.PERSIST_FOOTER_FILTER_VISIBILITY ? c.push({
            key: k,
            data: [d.footerVisible, d.filterVisible]
        }) : k == b.PERSIST_PAGE_SIZE ? c.push({
            key: k,
            data: d.getPageSize()
        }) : k == b.PERSIST_PRINT_SETTINGS && c.push({
            key: k,
            data: d.lastPrintOptionsString ? d.lastPrintOptionsString : d.persistedPrintOptionsString
        });
        return c
    };
    c.prototype.getColumnOrder = function(b) {
        var a = [];
        b = (b.persistable.implementsOrExtends("IExtendedDataGrid") ? b.persistable : null).getColumns();
        for (var d = 0; d < b.length; d++) a.push(b[d].getUniqueIdentifier());
        return a
    };
    c.prototype.getPropertyValues = function(b, a) {
        for (var d = [], c = (b.persistable.implementsOrExtends("IExtendedDataGrid") ? b.persistable : null).getColumns(), j = 0; j < c.length; j++) {
            var k = c[j];
            k.hasOwnProperty(a) && d.push({
                key: k.getUniqueIdentifier(),
                property: k[a]
            })
        }
        return d
    };
    c.prototype.getColumnVisibility = function(b) {
        return this.getPropertyValues(b, "visible")
    };
    c.prototype.getColumnWidths = function(b) {
        return this.getPropertyValues(b, "width")
    };
    c.prototype.setPreferences = function(d, c) {
        try {
            for (var e = d.persistable.implementsOrExtends("IExtendedDataGrid") ? d.persistable : null, h = 0; h < c.length; h++) {
                var j = c[h];
                if (j.key == b.PERSIST_COLUMN_ORDER) this.setColumnOrder(d, j.data);
                else if (j.key == b.PERSIST_COLUMN_VISIBILITY) this.setColumnVisibility(d, j.data);
                else if (j.key == b.PERSIST_COLUMN_WIDTH) this.setColumnWidths(d, j.data);
                else if (j.key == b.PERSIST_SORT) e.processSort(j.data);
                else if (j.key == b.PERSIST_FILTER) {
                    e.clearFilter();
                    for (var k = e.getColumns(), l = 0; l < k.length; l++) for (var m = k[l], n = 0; n < j.data.length; n++) {
                        var p = j.data[n];
                        m && p && m.getUniqueIdentifier() == p.key && null != p.property && e.setFilterValue(m.getSearchField(), p.property.hasOwnProperty("item") ? p.property.item : p.property, !1)
                    }
                } else j.key == b.PERSIST_VERTICAL_SCROLL ? e.setVerticalScrollPosition(j.data) : j.key == b.PERSIST_HORIZONTAL_SCROLL ? e.horizontalScrollPosition = j.data : j.key == b.PERSIST_FOOTER_FILTER_VISIBILITY ? (e.footerVisible = j.data[0], e.filterVisible = j.data[1]) : j.key == b.PERSIST_PAGE_SIZE ? e.setPageSize(parseInt(j.data)) : j.key == b.PERSIST_PRINT_SETTINGS && (e.persistedPrintOptionsString = j.data ? j.data.toString() : "")
            }
        } catch (q) {
            if (!d.silentFailure) if (d.allowClearOnCorruption) a.confirm(d.showErrorMessageWhenCorrupt.replace("__ERRORMESSAGE__", q.message)) && e.clearPreferences();
            else throw q;
        }
    };
    c.prototype.setColumnOrder = function(b, a) {
        var d = b.persistable.implementsOrExtends("IExtendedDataGrid") ? b.persistable : null,
            c = [];
        if (d.getHasGroupedColumns()) {
            for (var j = d.getGroupedColumns(), c = Array(Math.max(j.length, a.length)), k = 0; k < j.length; k++) {
                var l = j[k],
                    m = 0;
                if (l.implementsOrExtends("FlexDataGridColumnGroup")) {
                    var n = this.getFirstColumn(l);
                    n && (m = a.indexOf(n.getUniqueIdentifier()));
                    this.rearrangeColumns(l, a, b)
                } else m = a.indexOf(l.getUniqueIdentifier()); - 1 == m && (m = d.getColumns().indexOf(l));
                for (-1 == m && (m = j.indexOf(l)); c[m] && m < c.length;) m++;
                c[m] ? c.push(l) : c[m] = l
            }
            d.setGroupedColumns(this.removeUndefined(c))
        } else {
            c = Array(d.getColumns().length);
            j = d.getColumns();
            for (k = 0; k < j.length; k++) {
                l = j[k];
                m = a.indexOf(l.getUniqueIdentifier());
                for (-1 == m && (m = d.getColumns().indexOf(l)); c[m] && m < c.length;) m++;
                c[m] ? c.push(l) : c[m] = l
            }
            d.setColumns(this.removeUndefined(c))
        }
    };
    c.prototype.rearrangeColumns = function(b, a, d) {
        if (b.implementsOrExtends("FlexDataGridColumnGroup") ? b.getIsColumnOnly() : this.getIsColumnOnly(b)) {
            d = b.getColumns();
            for (var c = [], j = 0; j < a.length; j++) for (var k = a[j], l = 0; l < d.length; l++) {
                var m = d[l];
                m.getUniqueIdentifier() == k && c.push(m)
            }
            for (a = 0; a < d.length; a++) j = d[a], -1 == c.indexOf(j) && c.push(j);
            b.implementsOrExtends("FlexDataGridColumnGroup");
            b.setColumns(c)
        } else {
            b = b.hasOwnProperty("columnGroups") ? b.columnGroups : b.children;
            for (c = 0; c < b.length; c++) j = b[c], j.implementsOrExtends("FlexDataGridColumnGroup") && this.rearrangeColumns(j, a, d)
        }
    };
    c.prototype.getIsColumnOnly = function(b) {
        b = b.getAllColumns();
        for (var a = 0; a < b.length; a++) if (b[a].implementsOrExtends("FlexDataGridColumnGroup")) return !1;
        return !0
    };
    c.prototype.removeUndefined = function(b) {
        for (var a = [], d = 0; d < b.length; d++) {
            var c = b[d];
            c && a.push(c)
        }
        return a
    };
    c.prototype.getFirstColumn = function(b) {
        b = b.getAllColumns();
        for (var a = 0; a < b; a++) {
            var d = b[a];
            if (d.implementsOrExtends("FlexDataGridColumnGroup")) {
                if (d = this.getFirstColumn(d)) return d
            } else return d
        }
        return null
    };
    c.prototype.setPropertyValues = function(b, a, e) {
        for (var c = (b.persistable.implementsOrExtends("IExtendedDataGrid") ? b.persistable : null).getColumns(), j = 0; j < c.length; j++) for (var k = c[j], l = 0; l < a.length; l++) {
            var m = a[l];
            k.getUniqueIdentifier() == m.key && (b.userWidthsOverrideFitToContent && ("width" == e && k.hasOwnProperty("columnWidthMode") && "fitToContent" == k.getColumnWidthMode()) && k.setColumnWidthMode("fixed"), "width" == e && m.property && (m.property = parseInt(m.property)), d.checkSetterAndApply(k, e, m.property))
        }
    };
    c.prototype.setColumnVisibility = function(b, a) {
        this.setPropertyValues(b, a, "visible")
    };
    c.prototype.setColumnWidths = function(b, a) {
        b.persistable.implementsOrExtends("IExtendedDataGrid");
        this.setPropertyValues(b, a, "width")
    }
})(window);
(function() {
    var a;
    a = function() {
        this.silentFailure = !1;
        this.allowClearOnCorruption = !0;
        this.showErrorMessageWhenCorrupt = "Error occurred while applying preferences: __ERRORMESSAGE__. Do you wish to clear preferences?";
        this.useCompactPreferences = !0;
        this.prefDelimiter = "~|";
        this.prefColDelimiter = "@|";
        this.prefColPrefDelimiter = "&|";
        this.prefCustomDataDelimiter = "#|";
        this.multiPrefDelimiter = "$|";
        this.multiPrefGridPrefPropDelimiter = "*|";
        this.multiPrefPrefPropDelimiter = "%|";
        this.persistable = null;
        this.saveSettingsPopupRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.SaveSettingsPopup, null);
        this.openSettingsPopupRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.OpenSettingsPopup, null);
        this.settingsPopupRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.SettingsPopup, null);
        this.userWidthsOverrideFitToContent = !1;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.UserSettingsOptions = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "UserSettingsOptions";
    a.prototype.getClassNames = function() {
        return ["UserSettingsOptions", "TypedObject"]
    };
    a.create = function(c) {
        var d = new a;
        d.persistable = c;
        d.useCompactPreferences = !0;
        d.grid = c;
        return d
    };
    a.prototype.getGrid = function() {
        return this.persistable
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.PrintArea.apply(this, ["div"])
    };
    flexiciousNmsp.PageFooter = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "PageFooter";
    a.prototype.getClassNames = function() {
        return ["PageFooter", "PrintArea", "HBox"]
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.PrintArea.apply(this, ["div"])
    };
    flexiciousNmsp.PageHeader = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "PageHeader";
    a.prototype.getClassNames = function() {
        return ["PageHeader", "PrintArea", "HBox"]
    }
})(window);
(function() {
    var a;
    a = function(a, d, b) {
        this._height = this._width = this.name = null;
        this.isLandscape = !1;
        this.name = a;
        this.width = d;
        this.height = b;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.PageSize = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "PageSize";
    a.prototype.getClassNames = function() {
        return ["PageSize", "TypedObject"]
    };
    a.PAGE_LAYOUT_POTRAIT = "Portrait";
    a.PAGE_LAYOUT_LANDSCAPE = "Landscape";
    a.PAGE_SIZE_A3 = new a("A3", 842, 1191);
    a.PAGE_SIZE_A4 = new a("A4", 595, 842);
    a.PAGE_SIZE_A5 = new a("A5", 420, 595);
    a.PAGE_SIZE_LEGAL = new a("Legal", 612, 1008);
    a.PAGE_SIZE_LETTER = new a("Letter", 612, 792);
    a.getByName = function(c) {
        return "A3" == c ? a.PAGE_SIZE_A3.clone() : "A4" == c ? a.PAGE_SIZE_A4.clone() : "A5" == c ? a.PAGE_SIZE_A5.clone() : "Letter" == c ? a.PAGE_SIZE_LETTER.clone() : "Legal" == c ? a.PAGE_SIZE_LEGAL : a.PAGE_SIZE_A4.clone()
    };
    a.getBySize = function(c, d) {
        return c == a.PAGE_SIZE_A3.getWidth() && d == a.PAGE_SIZE_A3.getHeight() ? a.PAGE_SIZE_A3.clone() : c == a.PAGE_SIZE_A3.getHeight() && d == a.PAGE_SIZE_A3.getWidth() ? a.PAGE_SIZE_A3.clone().rotate() : c == a.PAGE_SIZE_A4.getWidth() && d == a.PAGE_SIZE_A4.getHeight() ? a.PAGE_SIZE_A4.clone() : c == a.PAGE_SIZE_A4.getHeight() && d == a.PAGE_SIZE_A4.getWidth() ? a.PAGE_SIZE_A4.clone().rotate() : c == a.PAGE_SIZE_A5.getWidth() && d == a.PAGE_SIZE_A5.getHeight() ? a.PAGE_SIZE_A5.clone() : c == a.PAGE_SIZE_A5.getHeight() && d == a.PAGE_SIZE_A5.getWidth() ? a.PAGE_SIZE_A5.clone().rotate() : c == a.PAGE_SIZE_LEGAL.getWidth() && d == a.PAGE_SIZE_LEGAL.getHeight() ? a.PAGE_SIZE_LEGAL.clone() : c == a.PAGE_SIZE_LEGAL.getHeight() && d == a.PAGE_SIZE_LEGAL.getWidth() ? a.PAGE_SIZE_LEGAL.clone().rotate() : c == a.PAGE_SIZE_LETTER.getWidth() && d == a.PAGE_SIZE_LETTER.getHeight() ? a.PAGE_SIZE_LETTER.clone() : c == a.PAGE_SIZE_LETTER.getHeight() && d == a.PAGE_SIZE_LETTER.getWidth() ? a.PAGE_SIZE_LETTER.clone().rotate() : new a("Custom", c, d)
    };
    a.prototype.clone = function() {
        return new a(this.name, this.getWidth(), this.getHeight())
    };
    a.prototype.rotate = function() {
        this.isLandscape = !this.isLandscape;
        return this
    };
    a.prototype.getWidth = function() {
        return this.isLandscape ? this._height : this._width
    };
    a.prototype.setWidth = function(a) {
        this._width = a
    };
    a.prototype.getHeight = function() {
        return this.isLandscape ? this._width : this._height
    };
    a.prototype.setHeight = function(a) {
        this._height = a
    }
})(window);
(function() {
    var a;
    a = function() {
        this.pageRecords = [];
        this.allRecords = [];
        this.currentPage = 1;
        this._printable = this.printComponent = this.printOptions = this.totalPages = null;
        flexiciousNmsp.PrintArea.apply(this)
    };
    flexiciousNmsp.PrintArea = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "PrintArea";
    a.prototype.getClassNames = function() {
        return ["PrintArea", "HBox", "IPrintArea"]
    };
    a.prototype.getPrintable = function() {
        return this._printable
    };
    a.prototype.setPrintable = function(a) {
        this._printable = a
    };
    a.prototype.getPrintDataGrid = function() {
        return this._printComponent
    };
    a.prototype.setPrintDataGrid = function(a) {
        this._printComponent = a
    };
    a.prototype.getExtendedDataGrid = function() {
        return this._printable
    };
    a.prototype.setExtendedDataGrid = function(a) {
        this._printable = a
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        this.preview = !0;
        this.previewWindow = null;
        this.printToPdf = !1;
        this.printedPages = [];
        this.pageSize = flexiciousNmsp.PageSize.PAGE_SIZE_LETTER.clone();
        this.reportHeaderRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ReportHeader);
        this.reportFooterRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ReportFooter);
        this.pageHeaderRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PageHeader);
        this.pageFooterRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PageHeader);
        this.printComponentRenderer = null;
        this.printOptionsViewrenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PrintOptionsView);
        this.printPreviewViewrenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PrintPreview);
        this.availableColumns = [];
        this.columnsToPrint = [];
        this.columnWidths = [];
        this.includePrintFooter = this.includePrintHeader = this.includePageFooter = this.includePageHeader = !0;
        this.printExportParameters = null;
        this.modalWindows = !0;
        this.printAsBitmap = !1;
        this.printComponent = this.printable = this.printContainer = null;
        this.windowStyleProperties = {};
        this.propertiesToTransfer = [];
        this.stylesToTransfer = [];
        this.includeInvisibleColumns = !0;
        this.asynch = !1;
        this.asynchTimeInterval = 1;
        this.asynchDelayCapture = !1;
        this.windowStyleProperties.backgroundColor = "#FFFFFF";
        this.windowStyleProperties.paddingTop = "20";
        this.windowStyleProperties.paddingBottom = "20";
        this.windowStyleProperties.paddingLeft = "20";
        this.windowStyleProperties.paddingRight = "20";
        flexiciousNmsp.PrintExportOptions.apply(this)
    };
    flexiciousNmsp.PrintOptions = a;
    a.prototype = new flexiciousNmsp.PrintExportOptions;
    a.prototype.typeName = a.typeName = "PrintOptions";
    a.prototype.getClassNames = function() {
        return ["PrintOptions", "PrintExportOptions", "TypedObject"]
    };
    a.prototype.loadFromPersistedString = function(a, b) {
        var g, f;
        if (a.useCompactPreferences) {
            var e = b.split("~/");
            if (8 == e.length) {
                var h = c.fromPersistenceString(e[0]);
                for (f = 0; f < h.length; f++) g = h[f], this.columnsToPrint.push({
                    name: g
                });
                h = c.fromPersistenceString(e[1]);
                for (f = 0; f < h.length; f++) g = h[f], this.columnWidths.push(parseInt(g));
                this.includePageFooter = "y" == e[2];
                this.includePageHeader = "y" == e[3];
                this.includePrintFooter = "y" == e[4];
                this.includePrintFooter = "y" == e[5];
                this.pageSize = flexiciousNmsp.PageSize.getByName(e[6]);
                this.pageSize.isLandscape = "y" == e[7]
            }
        }
    };
    a.prototype.toPersistenceString = function(a) {
        if (a.useCompactPreferences) {
            a = "";
            for (var b = [], g = 0; g < this.columnsToPrint.length; g++) b.push(this.columnsToPrint[g].name);
            a += c.toPersistenceString(b) + "~/";
            a += c.toPersistenceString(this.columnWidths) + "~/";
            a += (this.includePageFooter ? "y" : "n") + "~/";
            a += (this.includePageHeader ? "y" : "n") + "~/";
            a += (this.includePrintFooter ? "y" : "n") + "~/";
            a += (this.includePrintFooter ? "y" : "n") + "~/";
            a += this.pageSize.name + "~/";
            return a += this.pageSize.isLandscape ? "y" : "n"
        }
    };
    a.create = function(d) {
        "undefined" == typeof d && (d = !1);
        var b = new a;
        b.printToPdf = d;
        return b
    };
    a.prototype.getPrintDataGridRenderer = function() {
        return this.printComponentRenderer
    };
    a.prototype.setPrintDataGridRenderer = function(a) {
        this.printComponentRenderer = a
    };
    a.prototype.getExtendedDataGrid = function() {
        return this.printable
    };
    a.prototype.setExtendedDataGrid = function(a) {
        this.printable = a
    };
    a.prototype.getPrintDataGrid = function() {
        return this.printComponent
    };
    a.prototype.setPrintDataGrid = function(a) {
        this.printComponent = a
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"]);
        d.attachClass(this.domElement, "flexiciousGrid");
        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox;
        this.cbxColumns.alwaysVisible = !0;
        this.setWidth(500);
        this.printOptions = new flexiciousNmsp.PrintOptions
    };
    flexiciousNmsp.PrintOptionsView = c;
    c.prototype = new flexiciousNmsp.UIComponent;
    c.prototype.typeName = c.typeName = "PrintOptionsView";
    c.prototype.getClassNames = function() {
        return ["PrintOptionsView", "UIComponent"]
    };
    c.prototype.setGrid = function(b) {
        this._grid = b;
        this.enablePaging = b.getEnablePaging();
        this.pageCount = 0 < b.getPageSize() ? Math.ceil(b.getTotalRecords() / b.getPageSize()) : 1;
        this.selectedObjectsCount = b.getSelectedObjectsTopLevel().length
    };
    c.prototype.titlewindow1_creationCompleteHandler = function() {
        0 < this.printOptions.columnsToPrint.length && (this.cbxColumns.selectedValues = d.extractPropertyValues(this.printOptions.columnsToPrint, "name"))
    };
    c.prototype.onOK = function() {
        for (var g = document.getElementsByName("flxsExportpaging"), c = 0; c <= g.length; c++) if (!0 == g[c].checked) {
            this.printOptions.printExportOption = g[c].value;
            break
        }
        g = parseInt(d.adapter.findElementWithClassName(this.domElement, "txtPageFrom").value);
        c = parseInt(d.adapter.findElementWithClassName(this.domElement, "txtPageTo").value);
        d.adapter.findElementWithClassName(this.domElement, "RBN_SELECT_PGS").checked ? 1 <= g && 1 <= c && g <= this.pageCount + 1 && c <= this.pageCount + 1 && g <= c ? (this.printOptions.pageFrom = g, this.printOptions.pageTo = c, this.close(b.ALERT_OK)) : a.alert("Please ensure that the 'page from' is less than or equal to 'page to'") : this.close(b.ALERT_OK)
    };
    c.prototype.close = function(a) {
        var d = new flexiciousNmsp.BaseEvent(b.EVENT_CLOSE);
        d.detail = a;
        this.dispatchEvent(d)
    };
    c.prototype.updateExportColumns = function() {
        this.printOptions.columnsToPrint = this.cbxColumns.getSelectedItems();
        1 == this.printOptions.columnsToPrint.length && "All" == this.printOptions.columnsToPrint[0].name && (this.printOptions.columnsToPrint = [])
    };
    c.prototype.onCancel = function() {
        d.removePopUp(this)
    };
    c.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var a = new flexiciousNmsp.UIComponent("div");
        a.domElement.className = "printOptionsView";
        this.addChild(a);
        var c;
        c = "" + ("   <div class='columnsLabel'>" + b.PRT_LBL_COLS_TO_PRINT_TEXT + "</div>  <div class='options'>   <input type='radio' class='RBN_CURRENT_PAGE' checked name='flxsExportpaging'  value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE + "'>" + b.PRT_RBN_CURRENT_PAGE_LABEL + "<br/>   <input type='radio' class='RBN_ALL_PAGES' name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES + "'> " + b.PRT_RBN_ALL_PAGES_LABEL + "<br/>   <input type='radio' class='RBN_SELECT_PGS' name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES + "'> " + b.PRT_RBN_SELECT_PGS_LABEL + "<br/>   <input  type='number' class='txtPageFrom' maxlength='5 '>   <label>" + b.PGR_TO + "</label>   <input   type='number' class='txtPageTo' maxlength='5'>   <label>" + (this.pageCount + 1) + "</label><br/>   <input " + (0 < this.selectedObjectsCount ? "" : "disabled") + " type='radio' class='rbnSelectedRecords'   name='flxsExportpaging' value='" + flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS + "'>" + b.SELECTED_RECORDS + "(" + (0 == this.selectedObjectsCount ? " None Selected)" : this.selectedObjectsCount + " selected)") + "<br/></div><br/><br/>");
        c += "<div class='bottomButtonBar'> <a  class='BTN_EXPORT button' alt='Export'>" + b.EXP_BTN_EXPORT_LABEL + "</a> <a class='BTN_CANCEL button' alt='Cancel'>" + b.EXP_BTN_CANCEL_LABEL + "</a></div>";
        a.setInnerHTML(c);
        c = d.adapter.findElementWithClassName(this.domElement, "BTN_EXPORT");
        var e = d.adapter.findElementWithClassName(this.domElement, "BTN_CANCEL");
        flexiciousNmsp.UIUtils.addDomEventListener(this, c, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onOK()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, e, "click", function(b) {
            d.adapter.findAncestorByClassName(b.target || b.srcElement, "flexiciousGrid").component.onCancel()
        });
        this.cbxColumns.setDataProvider(this.printOptions.availableColumns);
        this.cbxColumns.labelField = "name";
        this.cbxColumns.dataField = "name";
        this.cbxColumns.addEventListener(this, b.EVENT_CHANGE, this.updateExportColumns);
        a.addChild(this.cbxColumns);
        this.cbxColumns.showPopup(a)
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {
        flexiciousNmsp.UIComponent.apply(this, ["div"])
    };
    flexiciousNmsp.PrintPreview = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "PrintPreview";
    a.prototype.getClassNames = function() {
        return ["PrintPreview", "TitleWindow", "IPrintPreview"]
    };
    a.prototype.getCurrentPage = function() {
        return this._currentPage
    };
    a.prototype.setCurrentPage = function(a) {
        this._currentPage = a
    };
    a.prototype.getTotalPages = function() {
        return this._totalPages
    };
    a.prototype.setTotalPages = function(a) {
        this._totalPages = a
    };
    a.prototype.getPrintOptions = function() {
        return this._printOptions
    };
    a.prototype.setPrintOptions = function(a) {
        this._printOptions = a;
        var b = [];
        this.rbnPageSize.selectedValue = a.pageSize.name;
        this.rbnPageLayout.selectedValue = a.pageSize.isLandscape ? PageSize.PAGE_LAYOUT_LANDSCAPE : PageSize.PAGE_LAYOUT_POTRAIT;
        a = a.columnsToPrint;
        for (var g = 0; g < a.length; g++) b.push(a[g].name);
        0 < b.length && (cbxColumns.selectedValues = b)
    };
    a.prototype.getContent = function() {
        return this.pageContent
    };
    a.prototype.recreate = function(a) {
        "undefined" == typeof a && (a = "pageOptionsChanged");
        this.printOptions.pageSize = PageSize.getByName(rbnPageSize.selectedValue.toString());
        this.printOptions.pageSize.isLandscape = rbnPageLayout.selectedValue == PageSize.PAGE_LAYOUT_LANDSCAPE;
        this.printOptions.columnsToPrint = new flexiciousNmsp.Array(cbxColumns.selectedItems);
        1 == this.printOptions.columnsToPrint.length && "All" == this.printOptions.columnsToPrint[0][cbxColumns.labelField] && this.printOptions.columnsToPrint.removeAll();
        dispatchEvent(new flexiciousNmsp.PrintPreviewEvent(a))
    };
    a.prototype.showSettingsMessage = function() {
        this.printOptions.showWarningMessage && (settingsMessage.visible = settingsMessage.includeInLayout = !0)
    };
    a.prototype.titlewindow1_creationCompleteHandler = function() {
        this.title = Constants.PPRV_LBL_TITLE_TEXT;
        Constants.applyLabels("PPRV", [LBL_PG_SIZE, LBL_LAYOUT, LBL_COLS, CB_PAGE_HDR, CB_PAGE_FTR, CB_RPT_FTR, CB_RPT_HDR, BTN_PRT, BTN_CANCEL, LBL_SETTINGS_1, LBL_SETTINGS_2, BTN_PRT_1, BTN_CANCEL_1], ["text", "label", "toolTip"])
    };
    a.prototype.getProgress = function() {
        return this._progress
    };
    a.prototype.setProgress = function(a) {
        var b = a.split("|");
        this._progress = a;
        pb.visible = !0;
        pb.setProgress(parseInt(b[0]), parseInt(b[1]));
        pb.label = "Processing page " + b[0] + " of " + b[1];
        pb.validateNow()
    };
    a.prototype.onPrint = function() {
        this.isPrinting = !0;
        dispatchEvent(new flexiciousNmsp.PrintPreviewEvent(PrintPreviewEvent.PRINT_REQUESTED))
    };
    a.prototype.onCancel = function() {
        c.removePopUp(this)
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        var a = "<div>The preferences you specify below will be retained when this grid is loaded in the future:</div>";
        this.grid.enableMultiplePreferences && (a += "<table border='0' style='...'> <tr><td>   <div style='...'><label> to</label>   <label class='LBL_PRT_OPTIONS'>Print Options:</label><br/>   <input type='radio' class='RBN_CURRENT_PAGE' checked value='" + this.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE + "'> Current Page<br/>   <input type='radio' class='RBN_ALL_PAGES' checked value='" + this.PrintExportOptions.PRINT_EXPORT_ALL_PAGES + "'> All Pages<br/>   <input type='radio' class='RBN_SELECT_PGS' checked value='" + this.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES + "'> Specify Pages<br/>   <input type='text' class='txtPageFrom' maxlength='50'>   <label> to</label>   <input type='text' class='txtPageTo' maxlength='50'>   <label>" + max(this.pageCount + 1) + "</label><br/>   <input type='radio' class='rbnSelectedRecords' checked value='" + this.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS + "'>TODO Label<br/>   <label class='LBL_COLS_TO_PRINT'> Columns to Print:</label></div>   </td></tr></table></div>");
        this.setInnerHTML(a + "<div style='...'><a  class='BTN_PRINT button' alt='Print'>Print</a> <a class='BTN_CANCEL button' alt='Cancel'>Cancel</a></div>");
        var a = c.adapter.findElementWithClassName(this.domElement, "BTN_PRINT"),
            b = c.adapter.findElementWithClassName(this.domElement, "BTN_CANCEL");
        flexiciousNmsp.UIUtils.addDomEventListener(this, a, "click", function(a) {
            c.adapter.findAncestorByClassName(a.target || a.srcElement, "printOptionsView").component.onPrint()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, b, "click", function(a) {
            c.adapter.findAncestorByClassName(a.target || a.srcElement, "printOptionsView").component.onCancel()
        })
    }
})(window);
(function() {
    var a;
    a = function(a, d, b) {
        this.printOptions = null;
        flexiciousNmsp.BaseEvent.apply(this, [a, d, b])
    };
    flexiciousNmsp.PrintPreviewEvent = a;
    a.prototype = new flexiciousNmsp.BaseEvent;
    a.prototype.typeName = a.typeName = "PrintPreviewEvent";
    a.prototype.getClassNames = function() {
        return ["PrintPreviewEvent", "Event"]
    };
    a.PAGE_INDEX_CHANGED = "pageIndexChanged";
    a.COLUMNS_CHANGED = "columnsChanged";
    a.DATAGRID_RECREATE_REQUIRED = "gridRecreateRequired";
    a.COLUMNS_RESIZED = "gridColumnsResized";
    a.PAGE_OPTIONS_CHANGED = "pageOptionsChanged";
    a.PRINT_REQUESTED = "printRequested";
    a.PDF_BYTES_READY = "pdfBytesReady";
    a.BEFORE_PRINT = "beforePrint";
    a.AFTER_PRINT = "afterPrint"
})(window);
(function() {
    var a, c = flexiciousNmsp.Constants;
    a = function() {
        this.rowsOnPage = [];
        this._printable = this.printComponent = this.printOptions = null;
        this.printComponentRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PrintFlexDataGrid, void 0);
        this._printDataGridDirty = !1;
        this._printerHeader = null;
        this.reportHeaderRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ReportHeader, void 0);
        this._printerHeaderDirty = !1;
        this._printerFooter = null;
        this.reportFooterRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ReportFooter, void 0);
        this._printerFooterDirty = !1;
        this._pageHeader = null;
        this.pageHeaderRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PageHeader, void 0);
        this._pageHeaderDirty = !1;
        this._pageFooter = null;
        this.pageFooterRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PageFooter, void 0);
        this._pageFooterDirty = !1;
        this.currentPage = 1;
        this._pageRecordsDirty = !1;
        this.middlePageRowCount = this.firstPageRowCount = this.totalPages = null;
        this.showing = "none";
        this.horizontalScrollPolicy = this.verticalScrollPolicy = c.SCROLL_POLICY_OFF;
        this.setStyle("verticalGap", "0");
        flexiciousNmsp.UIComponent.apply(this)
    };
    flexiciousNmsp.PrintWindow = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "PrintWindow";
    a.prototype.getClassNames = function() {
        return ["PrintWindow", "UIComponent"]
    };
    a.prototype.createChildren = function() {
        flexiciousNmsp.UIComponent.prototype.createChildren.apply(this, []);
        this.printerHeader || (this.printerHeader = this.reportHeaderRenderer.newInstance());
        this.pageHeader || (this.pageHeader = this.pageHeaderRenderer.newInstance());
        this.printComponent || (this.printComponent = this.printComponentRenderer.newInstance());
        this.pageFooter || (this.pageFooter = this.pageFooterRenderer.newInstance());
        this.printerFooter || (this.printerFooter = this.reportFooterRenderer.newInstance())
    };
    a.prototype.removeIfExists = function(a) {
        a && 0 <= this.indexOf(a) && this.removeChild(a)
    };
    a.prototype.commitProperties = function() {
        flexiciousNmsp.UIComponent.prototype.commitProperties.apply(this, []);
        var a = this.getPrintAreas();
        this._printerHeaderDirty && (this._printerHeaderDirty = !1, this.addChild(this.printerHeader));
        this._pageHeaderDirty && (this._pageHeaderDirty = !1, this.addChild(this.pageHeader));
        this._printDataGridDirty && (this._printDataGridDirty = !1, this.addChild(this.printComponent));
        this._pageFooterDirty && (this._pageFooterDirty = !1, this.addChild(this.pageFooter));
        this._printerFooterDirty && (this._printerFooterDirty = !1, this.addChild(this.printerFooter));
        if (this._pageRecordsDirty && (this._pageRecordsDirty = !1, this.getPrintDataGrid())) {
            var b = [],
                g = [];
            if (this.getPrintDataGrid().getDataProvider()) {
                var c = this.getPrintDataGrid().getDataProvider();
                if (!c.implementsOrExtends("IHierarchicalCollectionView")) {
                    for (var e = this.getPageStart(), h = this.getPageEnd(); e < h; e++) b.push(c[e]);
                    for (h = 0; h < c.length; h++) g.push(c[h])
                }
            }
            for (c = 0; c < a.length; c++) h = a[c], h.currentPage = this.currentPage, h.pageRecords = b, h.allRecords = g
        }
        for (b = 0; b < a.length; b++) g = a[b], g.totalPages = this.totalPages, g.printOptions = this.printOptions, g.printComponent = this.printComponent, g.printable = this.printable
    };
    a.prototype.getPageStart = function() {
        if (0 < this.rowsOnPage.length) {
            for (var a, b = 1; b < this.currentPage; b++) a += this.rowsOnPage[b - 1];
            return a
        }
        return 1 == this.currentPage ? 0 : 2 == this.currentPage ? this.firstPageRowCount : this.middlePageRowCount * (this.currentPage - 2) + this.firstPageRowCount
    };
    a.prototype.getPageEnd = function() {
        var a = this.getPrintDataGrid().getDataProvider(),
            b = this.getPageStart() + (0 < this.rowsOnPage.length ? this.rowsOnPage[this.currentPage - 1] : 1 == this.currentPage ? this.firstPageRowCount : this.middlePageRowCount);
        return b = b > a.length ? a.length : b
    };
    a.prototype.callValidate = function() {
        this.validateNow();
        if (this.printComponent) {
            var a = this.printComponent.getHeight(),
                b = this.getGridHeight();
            a != b && (this.printComponent.setHeight(b), this.validateNow())
        }
    };
    a.prototype.getGridHeight = function() {
        return this.getHeight() - (this.printerHeader && this.printerHeader.includeInLayout ? this.printerHeader.getHeight() : 0) - (this.printerFooter && this.printerFooter.includeInLayout ? this.printerFooter.getHeight() : 0) - (this.pageHeader && this.pageHeader.includeInLayout ? this.pageHeader.getHeight() : 0) - (this.pageFooter && this.pageFooter.includeInLayout ? this.pageFooter.getHeight() : 0) - this.getStyle("paddingTop") - this.getStyle("paddingBottom")
    };
    a.prototype.showFirstPage = function(a) {
        "undefined" == typeof a && (a = !0);
        "first" != this.showing && (this.showing = "first", this.showHide(this.printerFooter, !1), this.showHide(this.printerHeader, this.printOptions.includePrintHeader), this.showHide(this.pageHeader, this.printOptions.includePageHeader), this.showHide(this.pageFooter, this.printOptions.includePageFooter), a && this.callValidate())
    };
    a.prototype.showLastPage = function(a) {
        "undefined" == typeof a && (a = !0);
        "last" != this.showing && (this.showing = "last", this.showHide(this.printerFooter, this.printOptions.includePrintFooter), this.showHide(this.printerHeader, !1), this.showHide(this.pageHeader, this.printOptions.includePageHeader), this.showHide(this.pageFooter, this.printOptions.includePageFooter), a && this.callValidate())
    };
    a.prototype.showMiddlePage = function(a) {
        "undefined" == typeof a && (a = !0);
        "middle" != this.showing && (this.showing = "middle", this.showHide(this.printerFooter, !1), this.showHide(this.printerHeader, !1), this.showHide(this.pageHeader, this.printOptions.includePageHeader), this.showHide(this.pageFooter, this.printOptions.includePageFooter), a && this.callValidate())
    };
    a.prototype.showSinglePage = function(a) {
        "undefined" == typeof a && (a = !0);
        "single" != this.showing && (this.showing = "single", this.showHide(this.printerFooter, this.printOptions.includePrintFooter), this.showHide(this.printerHeader, this.printOptions.includePrintHeader), this.showHide(this.pageHeader, this.printOptions.includePageHeader), this.showHide(this.pageFooter, this.printOptions.includePageFooter), a && this.callValidate())
    };
    a.prototype.showHide = function(a, b) {
        a && a.getVisible() != b && (this.obj.setVisible(b), this.obj.includeInLayout = b)
    };
    a.prototype.onColumnResize = function() {
        this.printOptions.columnWidths.removeAll();
        for (var a = this.getPrintDataGrid().getColumns(), b = 0; b < a.length; b++) {
            var g = a[b];
            g.getVisible() && this.printOptions.columnWidths.push(g.width)
        }
        document.dispatchEvent(new flexiciousNmsp.PrintPreviewEvent(flexiciousNmsp.PrintPreviewEvent.COLUMNS_RESIZED));
        if (this.getPrintDataGrid().variableRowHeight) {
            document.dispatchEvent(new flexiciousNmsp.PrintPreviewEvent(flexiciousNmsp.PrintPreviewEvent.DATAGRID_RECREATE_REQUIRED));
            this.getPrintDataGrid().horizontalScrollPolicy = "on";
            for (g = b = 0; g < a.length; g++) {
                var c = a[g];
                c.getVisible() && (c.width = this.printOptions.columnWidths[b++])
            }
            this.getPrintDataGrid().horizontalScrollPolicy = "off"
        }
    };
    a.prototype.onItemOpen = function() {
        document.dispatchEvent(new flexiciousNmsp.PrintPreviewEvent(flexiciousNmsp.PrintPreviewEvent.DATAGRID_RECREATE_REQUIRED))
    };
    a.prototype.getPageFooter = function() {
        return this._pageFooter
    };
    a.prototype.setPageFooter = function(a) {
        this.removeIfExists(a);
        this._pageFooter = a;
        this._pageFooterDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getPrinterHeader = function() {
        return this._printerHeader
    };
    a.prototype.setPrinterHeader = function(a) {
        this.removeIfExists(a);
        this._printerHeader = a;
        this._printerHeaderDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getPrintAreas = function() {
        var a = [];
        this.printerHeader && a.push(this.printerHeader);
        this.printerFooter && a.push(this.printerFooter);
        this.pageHeader && a.push(this.pageHeader);
        this.pageFooter && a.push(this.pageFooter);
        return a
    };
    a.prototype.getPrintable = function() {
        return this._printable
    };
    a.prototype.setPrintable = function(a) {
        this.setPrintable(a)
    };
    a.prototype.getExtendedDataGrid = function() {
        return this._printable
    };
    a.prototype.setExtendedDataGrid = function(a) {
        this._printable = a
    };
    a.prototype.getPageHeader = function() {
        return this._pageHeader
    };
    a.prototype.setPageHeader = function(a) {
        this.removeIfExists(a);
        this.setPageHeader(a);
        this._pageHeaderDirty = !0;
        this.invalidateDisplayList()
    };
    a.prototype.getPrintDataGrid = function() {
        return this._printComponent
    };
    a.prototype.getPrinterFooter = function() {
        return this._printerFooter
    };
    a.prototype.setPrinterFooter = function(a) {
        this.removeIfExists(a);
        this.setPrinterFooter(a);
        this._printerFooterDirty = !0;
        this.invalidateDisplayList()
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.PrintArea.apply(this, ["div"])
    };
    flexiciousNmsp.ReportFooter = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "ReportFooter";
    a.prototype.getClassNames = function() {
        return ["ReportFooter", "PrintArea", "UIComponent"]
    }
})(window);
(function() {
    var a;
    a = function() {
        flexiciousNmsp.PrintArea.apply(this, ["div"])
    };
    flexiciousNmsp.ReportHeader = a;
    a.prototype = new flexiciousNmsp.Label;
    a.prototype.typeName = a.typeName = "ReportHeader";
    a.prototype.getClassNames = function() {
        return ["ReportHeader", "PrintArea", "UIComponent"]
    }
})(window);
(function() {
    var a = function() {
            flexiciousNmsp.UIComponent.apply(this, ["span"]);
            this.addEventListener(this, d.EVENT_CLICK, function(a) {
                if (0 <= a.triggerEvent.target.className.indexOf("toolbarButtonIconCell") && !(0 <= a.triggerEvent.target.className.indexOf("disabled"))) {
                    var b = c.adapter.findElementsWithClassName(this.domElement, "toolbarButtonIconCell").indexOf(a.triggerEvent.target);
                    this.grid.runToolbarAction(this.grid.toolbarActions[b], a.triggerEvent.target, this)
                }
            });
            c.attachClass(this.domElement, "flexiciousGridPager");
            this._totalRecords = this._pageIndex = 0;
            this._pageSize = 10;
            this.grid = this.rowInfo = this.level = null
        };
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "PagerControl";
    var c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a.prototype.getClassNames = function() {
        return ["PagerControl", "UIComponent", "IExtendedPager"]
    };
    a.prototype.doDispatchEvents = !0;
    a.prototype.getPageSize = function() {
        return this._pageSize
    };
    a.prototype.setPageSize = function(a) {
        this._pageSize = a
    };
    a.prototype.getPageIndex = function() {
        return this._pageIndex
    };
    a.prototype.setPageIndex = function(a) {
        this._pageIndex != a && (this._pageIndex = a, this.onPageChanged(), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("pageIndexChanged")))
    };
    a.prototype.setTotalRecords = function(a) {
        this._totalRecords = a;
        this.setPageIndex(0);
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("reset"));
        this.refresh()
    };
    a.prototype.getTotalRecords = function() {
        return this._totalRecords
    };
    a.prototype.onImgFirstClick = function() {
        this._pageIndex = 0;
        this.onPageChanged()
    };
    a.prototype.onImgPreviousClick = function() {
        0 < this._pageIndex && (this._pageIndex--, this.onPageChanged())
    };
    a.prototype.onImgNextClick = function() {
        this._pageIndex < this.getPageCount() - 1 && (this._pageIndex++, this.onPageChanged())
    };
    a.prototype.onImgLastClick = function() {
        this._pageIndex < this.getPageCount() - 1 && (this._pageIndex = this.getPageCount() - 1, this.onPageChanged())
    };
    a.prototype.onPageCbxChange = function(a) {
        this._pageIndex = parseInt(a.target.value) - 1;
        this.onPageChanged()
    };
    a.prototype.onPageChanged = function() {
        var a = this.getPageDropdown();
        a && a.selectedIndex != this._pageIndex && (a.selectedIndex = this._pageIndex);
        this.doDispatchEvents && this.dispatchEvent(new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE))
    };
    a.prototype.onCreationComplete = function() {
        this.grid.enableToolbarActions && (this.grid.addEventListener(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.onGridSelectionChange), this.createToolbarActions())
    };
    a.prototype.reset = function() {
        this._pageIndex = 0;
        this.getPageDropdown().selectedIndex = 0;
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent("reset"))
    };
    a.prototype.getPageStart = function() {
        return 0 == this._totalRecords ? 0 : this._pageIndex * this._pageSize + 1
    };
    a.prototype.getPageEnd = function() {
        var a = (this._pageIndex + 1) * this._pageSize;
        return a > this._totalRecords ? this._totalRecords : a
    };
    a.prototype.getPageCount = function() {
        return 0 < this.getPageSize() ? Math.ceil(this.getTotalRecords() / this.getPageSize()) : 0
    };
    a.prototype.onWordExport = function() {
        this.grid.toolbarWordHandlerFunction()
    };
    a.prototype.onExcelExport = function() {
        this.grid.toolbarExcelHandlerFunction()
    };
    a.prototype.onPrint = function() {
        this.grid.toolbarPrintHandlerFunction()
    };
    a.prototype.onPdf = function() {
        this.grid.toolbarPdfHandlerFunction()
    };
    a.prototype.onClearFilter = function() {
        this.grid.clearFilter()
    };
    a.prototype.onProcessFilter = function() {
        this.grid.processFilter()
    };
    a.prototype.onShowHideFilter = function() {
        this.grid.setFilterVisible(!this.grid.getFilterVisible());
        this.grid.rebuild()
    };
    a.prototype.onShowHideFooter = function() {
        this.grid.footerVisible = !this.grid.footerVisible;
        this.grid.placeSections()
    };
    a.prototype.onShowSettingsPopup = function() {
        var a = this.grid.popupFactorySettingsPopup.newInstance();
        a.setGrid(this.grid);
        c.addPopUp(a, this.grid, !1, null, d.SETTINGS_POPUP_TITLE)
    };
    a.prototype.onOpenSettingsPopup = function() {
        var a = this.grid.popupFactoryOpenSettingsPopup.newInstance();
        a.setGrid(this.grid);
        c.addPopUp(a, this.grid, !1, null, d.OPEN_SETTINGS_POPUP_TITLE)
    };
    a.prototype.onSaveSettingsPopup = function() {
        var a = this.grid.popupFactorySaveSettingsPopup.newInstance();
        a.setGrid(this.grid);
        c.addPopUp(a, this.grid, !1, null, d.SAVE_SETTINGS_POPUP_TITLE)
    };
    a.prototype.createToolbarActions = function() {};
    a.prototype.onToolbarActionsChanged = function() {
        this.createToolbarActions()
    };
    a.prototype.onGridSelectionChange = function() {};
    a.prototype.toolbarActionFilterFunction = function(a) {
        return a.level == this.level.getNestDepth() || -1 == a.level
    };
    a.prototype.getPageDropdown = function() {
        return c.adapter.findElementWithClassName(this.domElement, "pageDropdown")
    };
    a.prototype.destroy = function() {
        this.destroyButtons([a.ACTION_FIRST_PAGE, a.ACTION_FIRST_PAGE, a.ACTION_PREV_PAGE, a.ACTION_NEXT_PAGE, a.ACTION_LAST_PAGE, a.ACTION_SORT, a.ACTION_SETTINGS, a.ACTION_SAVE_SETTINGS, a.ACTION_FILTER_SHOW_HIDE, a.ACTION_RUN_FILTER, a.ACTION_CLEAR_FILTER, a.ACTION_PRINT, a.ACTION_PDF, a.ACTION_WORD, a.ACTION_EXCEL]);
        var b = this.getPageDropdown();
        b && (b.pagerControl = null, c.removeDomEventListener(b, "change", e))
    };
    a.prototype.addToolbarActionsHTML = function() {
        for (var a = "", b = this.grid.id || this.grid.domElement.id, d = 0; d < this.grid.toolbarActions.length; d++) var e = this.grid.toolbarActions[d],
            a = a + (e.seperatorBefore ? "<span id='" + b + "_" + e.code + "' class='pagerDiv separatorCell'>|</span>" : ""),
            a = a + ("<span valign='middle' class='pagerDiv iconCell toolbarButtonIconCell'  title='" + e.tooltip + "'" + (e.iconUrl ? "style='background: transparent url(" + e.iconUrl + ") no-repeat left center;padding-left:20px' >" : ">") + e.name + "</span>"),
            a = a + (e.seperatorAfter ? "<span  class='pagerDiv separatorCell'>|</span>" : "");
        return a
    };
    a.prototype.updateDisplayList = function(a, b) {
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [a, b]);
        this.refresh()
    };
    a.prototype.initialize = function() {
        var b = this.grid.id || this.grid.domElement.id,
            b = b + "_",
            g = "<span class='pagerTable' style='float: left;height:" + this.getHeight() + "px'>" + (this.level.enablePaging ? "<span  class='pagerDiv pageInfo'></span>" : "") + (this.level.enablePaging ? "<span  class='pagerDiv toolbarButtonDiv lineSep'>&nbsp;</span>" : "") + (this.level.enablePaging ? "<span  id='" + b + "btnFirstPage' class='pagerDiv iconCell firstPage'><img alt='First Page' tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/firstPage.png' class='imageButtonFirstPage' alt='" + d.PGR_BTN_FIRST_PAGE_TOOLTIP + "' title='" + d.PGR_BTN_FIRST_PAGE_TOOLTIP + "'></span>" : "") + (this.level.enablePaging ? "<span  id='" + b + "btnPreviousPage' class='pagerDiv iconCell prevPage'><img alt='Previous Page' tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/prevPage.png' class='imageButtonPrevPage' alt='" + d.PGR_BTN_PREV_PAGE_TOOLTIP + "' title='" + d.PGR_BTN_PREV_PAGE_TOOLTIP + "'></span>" : "") + (this.level.enablePaging ? "<span  id='" + b + "btnNextPage' class='pagerDiv iconCell nextPage'><img alt='Next Page' tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/nextPage.png' class='imageButtonNextPage' alt='" + d.PGR_BTN_NEXT_PAGE_TOOLTIP + "' title='" + d.PGR_BTN_NEXT_PAGE_TOOLTIP + "'></span>" : "") + (this.level.enablePaging ? "<span  id='" + b + "btnLastPage' class='pagerDiv iconCell lastPage'><img alt='Last Page' tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/lastPage.png' class='imageButtonLastPage' alt='" + d.PGR_BTN_LAST_PAGE_TOOLTIP + "' title='" + d.PGR_BTN_LAST_PAGE_TOOLTIP + "'></span>" : "") + (this.level.enablePaging ? "<span  class='pagerDiv lineSep'>&nbsp;</span>" : "") + (this.level.enablePaging ? "<span  id='" + b + "lblGotoPage'  class='pagerDiv  gotoPage'>" + flexiciousNmsp.Constants.PGR_LBL_GOTO_PAGE_TEXT + " <select class='pageDropdown'> </select> </span>" : "") + (this.level.enablePaging ? "<span  class='pagerDiv lineSep'>&nbsp;</span>" : "") + "</span>",
            g = g + ("<span class='pagerTable' style='float: right;height:" + this.getHeight() + "px'>" + this.addToolbarActionsHTML());
        1 == this.level.getNestDepth() && (g += (this.grid.enableDrillDown ? "<span  id='" + b + "btnCollapseOne' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/collapseOne.png' class='imageButtonExpandUp' alt='" + d.PGR_BTN_EXP_ONE_UP_TOOLTIP + "' title='" + d.PGR_BTN_EXP_ONE_UP_TOOLTIP + "'></span>" : "") + (this.grid.enableDrillDown ? "<span  id='" + b + "btnExpandOne' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/expandOne.png' class='imageButtonExpandDown' alt='" + d.PGR_BTN_EXP_ONE_DOWN_TOOLTIP + "' title='" + d.PGR_BTN_EXP_ONE_DOWN_TOOLTIP + "'></span>" : "") + (this.grid.enableDrillDown ? "<span  class='pagerDiv  lineSep'>&nbsp;</span>" : "") + (this.grid.enableDrillDown ? "<span  id='" + b + "btnCollapseAll' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/collapseAll.png' class='imageButtonCollapseAll' alt='" + d.PGR_BTN_COLLAPSE_ALL_TOOLTIP + "' title='" + d.PGR_BTN_COLLAPSE_ALL_TOOLTIP + "'></span>" : "") + (this.grid.enableDrillDown ? "<span  id='" + b + "btnExpandAll' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/expandAll.png' class='imageButtonExpandAll' alt='" + d.PGR_BTN_EXP_ALL_TOOLTIP + "' title='" + d.PGR_BTN_EXP_ALL_TOOLTIP + "'></span>" : "") + (this.grid.enableDrillDown ? "<span  class='pagerDiv  lineSep'>&nbsp;</span>" : "") + (this.grid.enableMultiColumnSort ? "<span  id='" + b + "btnSort' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/sort.png' class='imageButtonSort' alt='" + d.PGR_BTN_SORT_TOOLTIP + "' title='" + d.PGR_BTN_SORT_TOOLTIP + "'></span>" : "") + (this.grid.enableMultiColumnSort ? "<span  class='pagerDiv  lineSep'>&nbsp;</span>" : "") + (this.grid.enablePreferencePersistence ? "<span  id='" + b + "btnSettings' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/settings.png' class='imageButtonSettings' alt='" + d.PGR_BTN_SETTINGS_TOOLTIP + "' title='" + d.PGR_BTN_SETTINGS_TOOLTIP + "'></span>" : "") + (this.grid.enablePreferencePersistence && this.grid.enableMultiplePreferences ? "<span  class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/openSettings.png' class='imageButtonOpenSettings' alt='" + d.PGR_BTN_OPEN_SETTINGS_TOOLTIP + "' title='" + d.PGR_BTN_OPEN_SETTINGS_TOOLTIP + "'></span>" : "") + (this.grid.enablePreferencePersistence ? "<span  id='" + b + "btnSaveSettings' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/saveSettings.png' class='imageButtonSaveSettings' alt='" + d.PGR_BTN_SAVE_SETTINGS_TOOLTIP + "' title='" + d.PGR_BTN_SAVE_SETTINGS_TOOLTIP + "'></span>" : "") + (this.grid.enablePreferencePersistence ? "<span  class='pagerDiv  lineSep'>&nbsp;</span>" : "") + (this.level.getEnableFilters() ? "<span  id='" + b + "btnFilterShowHide' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/filterShowHide.png' class='imageButtonFilterShowHide' alt='" + d.PGR_BTN_FILTER_TOOLTIP + "' title='" + d.PGR_BTN_FILTER_TOOLTIP + "r'></span>" : "") + (this.level.getEnableFilters() ? "<span  id='" + b + "btnFilter' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/filter.png' class='imageButtonFilter' alt='" + d.PGR_BTN_RUN_FILTER_TOOLTIP + "' title='" + d.PGR_BTN_RUN_FILTER_TOOLTIP + "'></span>" : "") + (this.level.getEnableFilters() ? "<span  id='" + b + "btnClearFilter' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/clearFilter.png' class='imageButtonClearFilter' alt='" + d.PGR_BTN_CLEAR_FILTER_TOOLTIP + "' title='" + d.PGR_BTN_CLEAR_FILTER_TOOLTIP + "'></span>" : "") + (this.level.getEnableFilters() ? "<span  class='pagerDiv  lineSep'>&nbsp;</span>" : "") + (this.grid.enablePrint ? "<span  id='" + b + "btnPrint' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/print.png' class='imageButtonPrint' alt='" + d.PGR_BTN_PRINT_TOOLTIP + "' title='" + d.PGR_BTN_PRINT_TOOLTIP + "'></span>" : "") + (this.grid.enablePrint || this.level.enablePdf ? "<span  class='pagerDiv  separatorCell'>&nbsp;</span>" : "") + (this.grid.enableExport ? "<span  id='" + b + "btnWord' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/word.png' class='imageButtonWord' alt='" + d.PGR_BTN_WORD_TOOLTIP + "' title='" + d.PGR_BTN_WORD_TOOLTIP + "'></span>" : "") + (this.grid.enableExport ? "<span  id='" + b + "btnExcel' class='pagerDiv  iconCell'><img tabindex='0' src='" + this.grid.getThemeToolbarIconFolder() + "/export.png' class='imageButtonExcel' alt='" + d.PGR_BTN_EXCEL_TOOLTIP + "' title='" + d.PGR_BTN_EXCEL_TOOLTIP + "'></span>" : "") + "</span>");
        this.setInnerHTML(g);
        this.initializeButtons([a.ACTION_FIRST_PAGE, a.ACTION_FIRST_PAGE, a.ACTION_PREV_PAGE, a.ACTION_NEXT_PAGE, a.ACTION_LAST_PAGE, a.ACTION_SORT, a.ACTION_SETTINGS, a.ACTION_OPEN_SETTINGS, a.ACTION_SAVE_SETTINGS, a.ACTION_OPEN_SETTINGS, a.ACTION_FILTER_SHOW_HIDE, a.ACTION_RUN_FILTER, a.ACTION_CLEAR_FILTER, a.ACTION_PRINT, a.ACTION_PDF, a.ACTION_WORD, a.ACTION_EXCEL, a.ACTION_EXPAND_UP, a.ACTION_EXPAND_ALL, a.ACTION_EXPAND_DOWN, a.ACTION_COLLAPSE_ALL]);
        b = this.getPageDropdown();
        this.level.enablePaging && (b.pagerControl = this, c.addDomEventListener(this, b, "change", e));
        this.grid.addEventListener(this, flexiciousNmsp.FlexDataGrid.EVENT_CHANGE, this.refresh);
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this)
    };
    a.prototype.enableDisableButton = function(a, b) {
        a.enabled = b;
        if (a.enabled) c.detachClass(a, "disabled");
        else {
            c.attachClass(a, "disabled");
            var d = c.adapter.findFirstElementByTagName(a, "IMG");
            d && c.detachClass(d, "over")
        }
    };
    a.prototype.rebuild = function() {
        this.invalidateDisplayList()
    };
    a.prototype.refresh = function() {
        for (var a = c.adapter.findElementsWithClassName(this.domElement, "toolbarButtonIconCell"), b = 0; b < a.length; b++) {
            var e = a[b],
                g = this.grid.toolbarActions[b];
            this.enableDisableButton(e, this.grid.isToolbarActionValid(g, e, this));
            var f = g.iconUrl;
            !e.enabled && g.disabledIconUrl && (f = g.disabledIconUrl);
            e.style.background = "background: transparent url(" + f + ") no-repeat left center"
        }
        if (b = c.adapter.findElementWithClassName(this.domElement, "pageInfo")) b.innerHTML = d.PGR_ITEMS + " " + this.getPageStart() + " " + d.PGR_TO + " " + this.getPageEnd() + " " + d.PGR_OF + " " + this.getTotalRecords() + ". " + d.PGR_PAGE + " " + (this.getPageIndex() + 1) + " " + d.PGR_OF + " " + this.getPageCount();
        (b = c.adapter.findElementWithClassName(this.domElement, "firstPage")) && this.enableDisableButton(b, 0 < this.getPageIndex());
        (b = c.adapter.findElementWithClassName(this.domElement, "prevPage")) && this.enableDisableButton(b, 0 < this.getPageIndex());
        (b = c.adapter.findElementWithClassName(this.domElement, "nextPage")) && this.enableDisableButton(b, this.getPageIndex() < this.getPageCount() - 1);
        (b = c.adapter.findElementWithClassName(this.domElement, "lastPage")) && this.enableDisableButton(b, this.getPageIndex() < this.getPageCount() - 1);
        a = this.getPageDropdown();
        e = this.getPageIndex();
        if (a) {
            a.options.length = 0;
            for (b = 1; b <= this.getPageCount(); b++) g = document.createElement("option"), g.value = b, g.text = b, g.selected = e + 1 == b ? "selected" : "", a.options.add(g)
        }
    };
    a.ACTION_FIRST_PAGE = "firstPage";
    a.ACTION_PREV_PAGE = "prevPage";
    a.ACTION_NEXT_PAGE = "nextPage";
    a.ACTION_LAST_PAGE = "lastPage";
    a.ACTION_SORT = "sort";
    a.ACTION_SETTINGS = "settings";
    a.ACTION_OPEN_SETTINGS = "openSettings";
    a.ACTION_SAVE_SETTINGS = "saveSettings";
    a.ACTION_FILTER_SHOW_HIDE = "filterShowHide";
    a.ACTION_RUN_FILTER = "filter";
    a.ACTION_CLEAR_FILTER = "clearFilter";
    a.ACTION_PRINT = "print";
    a.ACTION_PDF = "pdf";
    a.ACTION_WORD = "word";
    a.ACTION_EXCEL = "excel";
    a.ACTION_EXPAND_DOWN = "expandDown";
    a.ACTION_EXPAND_UP = "expandUp";
    a.ACTION_EXPAND_ALL = "expandAll";
    a.ACTION_COLLAPSE_ALL = "collapseAll";
    var b = function(a) {
            a = a.currentTarget || a.srcElement;
            !(0 <= a.parentNode.className.indexOf("disabled")) && -1 == a.className.indexOf("over") && (a.className = "over")
        },
        g = function(a) {
            a = a.currentTarget || a.srcElement;
            !(0 <= a.parentNode.className.indexOf("disabled")) && -1 != a.className.indexOf("over") && (a.className = a.className.replace("over", ""))
        },
        f = function(a) {
            a = a.currentTarget || a.srcElement;
            0 <= a.parentNode.className.indexOf("disabled") || a.pagerControl.processAction(a.code)
        },
        e = function(a) {
            a = a.currentTarget || a.srcElement;
            var b = a.pagerControl;
            b.setPageIndex(parseInt(a.value) - 1);
            b.refresh()
        };
    a.prototype.destroyButtons = function(a) {
        for (var d = 0; d < a.length; d++) {
            var e = a[d],
                l = c.adapter.findElementWithClassName(this.domElement, "imageButton" + c.doCap(e));
            l && (l.code = e, c.removeDomEventListener(l, "mouseover", b), c.removeDomEventListener(l, "mouseout", g), c.removeDomEventListener(l, "click", f), l.pagerControl = null, l.src = "")
        }
    };
    a.prototype.initializeButtons = function(a) {
        for (var d = 0; d < a.length; d++) {
            var e = a[d],
                l = c.adapter.findElementWithClassName(this.domElement, "imageButton" + c.doCap(e));
            l && (l.code = e, c.addDomEventListener(this, l, "mouseover", b), c.addDomEventListener(this, l, "mouseout", g), c.addDomEventListener(this, l, "click", f), l.pagerControl = this)
        }
    };
    a.prototype.processAction = function(b) {
        if (b == a.ACTION_FIRST_PAGE) this.onImgFirstClick();
        else if (b == a.ACTION_PREV_PAGE) this.onImgPreviousClick();
        else if (b == a.ACTION_NEXT_PAGE) this.onImgNextClick();
        else if (b == a.ACTION_LAST_PAGE) this.onImgLastClick();
        else if (b == a.ACTION_SETTINGS) this.onShowSettingsPopup();
        else if (b == a.ACTION_OPEN_SETTINGS) this.onOpenSettingsPopup();
        else if (b == a.ACTION_SAVE_SETTINGS) this.onSaveSettingsPopup();
        else if (b == a.ACTION_CLEAR_FILTER) this.onClearFilter();
        else if (b == a.ACTION_EXCEL) this.onExcelExport();
        else if (b == a.ACTION_FILTER_SHOW_HIDE) this.onShowHideFilter();
        else if (b == a.ACTION_PDF) this.onPdf();
        else if (b == a.ACTION_PRINT) this.onPrint();
        else if (b == a.ACTION_RUN_FILTER) this.onProcessFilter();
        else if (b == a.ACTION_SORT) this.grid.multiColumnSortShowPopup();
        else if (b == a.ACTION_WORD) this.onWordExport();
        else b == a.ACTION_EXPAND_ALL ? this.grid.expandAll() : b == a.ACTION_EXPAND_UP ? this.grid.expandUp() : b == a.ACTION_EXPAND_DOWN ? this.grid.expandDown() : b == a.ACTION_COLLAPSE_ALL && this.grid.collapseAll();
        this.refresh()
    };
    a.prototype.kill = function() {
        this.dead || (this.destroy(), this.grid = this.rowInfo = this.level = null, flexiciousNmsp.UIComponent.prototype.kill.apply(this))
    };
    flexiciousNmsp.PagerControl = a
})(window);
(function() {
    var a = function() {
            flexiciousNmsp.UIComponent.apply(this, ["div"]);
            this.setWidth(600);
            this.setHeight(220);
            this.currentSorts = [];
            this.cols = [];
            this.domElement.className = "flexiciousGrid flexiciousSortPopup"
        },
        c = a.prototype = new flexiciousNmsp.UIComponent;
    c.typeName = a.typeName = "MultiColumnSortPopup";
    var d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c.getClassNames = function() {
        return ["MultiColumnSortPopup", "UIComponent"]
    };
    c.loadColumns = function(a, b, d) {
        "undefined" == typeof d && (d = !1);
        for (var g = {}, c = a.getSortableColumns(), l = 0; l < c.length; l++) {
            var m = c[l],
                g = {};
            g.label = m.getHeaderText();
            g.column = m;
            g.data = m.getUniqueIdentifier();
            b.push(g)
        }
        if (d) for (l = 0; l < a.currentSorts.length; l++) for (var g = a.currentSorts[l], c = a.getSortableColumns(), n = 0; n < c.length; n++) m = c[n], g.sortColumn == m.getSortFieldName() && (g.column = m, this.currentSorts.push(g));
        a.nextLevel && !a.nextLevel.reusePreviousLevelColumns && (b.push({
            label: "",
            type: "separator"
        }), g = {
            label: "..."
        }, g.data = a, g.children = [], b.push(g), this.loadColumns(a.nextLevel, g.children, d))
    };
    c.initialize = function() {
        this.currentSorts = [];
        this.cols = [];
        this.loadColumns(this.grid.getColumnLevel(), this.cols, !1);
        this.loadColumns(this.grid.getColumnLevel(), [], !0);
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.domElement.id = this.grid.id + "-sortpopup";
        for (var a = "<div class='sortPopupHeader'>" + b.MCS_LBL_HEADER_TEXT + "</div>", e = 0; e < this.grid.multiColumnSortNumberFields; e++) var c = this.currentSorts.length > e ? this.currentSorts[e] : null,
            a = a + ('<div class="sortPopupRow"><span class="sortPopupLabel">' + (0 == e ? b.MCS_LBL_SORT_BY_TEXT : b.MCS_LBL_THEN_BY_TEXT) + '</span><input type="hidden" id="' + this.grid.id + "-sort-value-" + e + '" value="' + (null == c ? "" : c.column.getUniqueIdentifier() + "") + '"> </input><span id="' + this.grid.id + "-sort-button-" + e + '" class="sortPopupDropdown ui-widget ui-corner-all ui-state-default"  tabindex="0"><span ' + (null == c ? "" : 'uniqueIdentifier="' + c.column.getUniqueIdentifier() + '" ') + " >" + (null == c ? b.MCS_LBL_CHOOSE_COLS : c.column.getHeaderText()) + '</span><span class="sortPopupDownArrow ui-icon ui-icon-triangle-1-s"></span></span> <input ' + (null == c ? 'disabled="disabled"' : c.isAscending ? "checked" : "") + ' id="' + this.grid.id + "-sort-radio-asc-" + e + '"  type="radio" name="srt' + e + '" value="asc"></input><span ' + (null == c ? 'class="disabledLabel"' : "") + ' id="' + this.grid.id + "-sort-radio-asc-lbl-" + e + '">' + b.MCS_RBN_ASCENDING_LABEL + "</span><input " + (null == c ? 'disabled="disabled"' : c.isAscending ? "" : "checked") + ' id="' + this.grid.id + "-sort-radio-desc-" + e + '" type="radio" name="srt' + e + '" value="desc"></input><span ' + (null == c ? 'class="disabledLabel"' : "") + '  id="' + this.grid.id + "-sort-radio-desc-lbl-" + e + '">' + b.MCS_RBN_DESCENDING_LABEL + "</span></div>");
        a += "<div style='float:right;padding-top: 10px;padding-bottom: 10px;padding-right: 10px'> <a  class='BTN_CLEAR_ALL button' alt='" + b.MCS_BTN_CLEAR_ALL_LABEL + "'>" + b.MCS_BTN_CLEAR_ALL_LABEL + "</a> <a  class='BTN_SAVE_CHANGES button' alt='" + b.MCS_BTN_APPLY_LABEL + "'>" + b.MCS_BTN_APPLY_LABEL + "</a> <a class='BTN_CLOSE button' alt='" + b.MCS_BTN_CANCEL_LABEL + "'>" + b.MCS_BTN_CANCEL_LABEL + "</a></div>";
        this.setInnerHTML(a);
        for (e = 0; e < this.grid.multiColumnSortNumberFields; e++) d.adapter.createMenu(this.cols, document.getElementById(this.grid.id + "-sort-button-" + e), g);
        a = d.adapter.findElementWithClassName(this.domElement, "BTN_CLEAR_ALL");
        e = d.adapter.findElementWithClassName(this.domElement, "BTN_SAVE_CHANGES");
        c = d.adapter.findElementWithClassName(this.domElement, "BTN_CLOSE");
        flexiciousNmsp.UIUtils.addDomEventListener(this, a, "click", function(a) {
            d.adapter.findAncestorByClassName(a.target || a.srcElement, "flexiciousSortPopup").component.onClearClick()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, e, "click", function(a) {
            d.adapter.findAncestorByClassName(a.target || a.srcElement, "flexiciousSortPopup").component.onApplyClick()
        });
        flexiciousNmsp.UIUtils.addDomEventListener(this, c, "click", function(a) {
            d.adapter.findAncestorByClassName(a.target || a.srcElement, "flexiciousSortPopup").component.closeWindow()
        })
    };
    var g = function(a, b) {
            var g = a[0],
                c = parseInt(a[0].id.substr(a[0].id.length - 1, 1)),
                k = d.adapter.findAncestorByClassName(g, "flexiciousSortPopup").component.grid,
                l = document.getElementById(k.id + "-sort-value-" + c),
                m = k.getColumnLevel().getColumnByDataField(b.uniqueIdentifier || b.attributes.getNamedItem("uniqueidentifier").value, "uniqueIdentifier", !0);
            if ("JQueryAdapter" == d.adapter.typeName) {
                var g = g.firstChild,
                    n;
                n = [m.getHeaderText()];
                for (var p = 1; p < m.getLevel().getNestDepth();) p++, n.push(">");
                n = n.reverse().join(" ");
                g.innerHTML = n
            }
            l.value = m.getUniqueIdentifier();
            l = document.getElementById(k.id + "-sort-radio-asc-" + c);
            m = document.getElementById(k.id + "-sort-radio-desc-" + c);
            l.disabled = "";
            m.disabled = "";
            !l.checked && !m.checked && (l.checked = "checked");
            d.detachClass(document.getElementById(k.id + "-sort-radio-desc-lbl-" + c), "disabledLabel");
            d.detachClass(document.getElementById(k.id + "-sort-radio-asc-lbl-" + c), "disabledLabel")
        };
    c.onClearClick = function(a) {
        this.grid.removeAllSorts();
        this.closeWindow(a)
    };
    c.onApplyClick = function(a) {
        var b = this.grid;
        b.removeAllSorts();
        for (var d = 0; d < b.multiColumnSortNumberFields; d++) {
            var g = document.getElementById(b.id + "-sort-value-" + d);
            if (g.value) {
                var g = g.value,
                    g = b.getColumnLevel().getColumnByDataField(g, "uniqueIdentifier", !0),
                    c = document.getElementById(b.id + "-sort-radio-asc-" + d),
                    l = new flexiciousNmsp.FilterSort;
                l.column = g;
                l.sortColumn = g.getSortFieldName();
                l.isAscending = c.checked;
                l.column.getLevel().addSort(l)
            }
        }
        b.rebuildBody();
        b.rebuildHeader();
        this.closeWindow(a)
    };
    c.closeWindow = function() {
        d.removePopUp(this);
        for (var a = 0; a < this.grid.multiColumnSortNumberFields; a++) flexiciousNmsp.UIUtils.adapter.destroyMenu(document.getElementById(this.grid.id + "-sort-button-" + a))
    };
    c.grid = null;
    flexiciousNmsp.MultiColumnSortPopup = a
})(window);
(function() {
    var a = function(a, b) {
            this.factory = a;
            this.subFactory = b
        },
        c = a.prototype;
    c.getClassNames = function() {
        return "FactoryKey"
    };
    c.kill = function() {
        this.subFactory = this.factory = null
    };
    c.factory = null;
    c.subFactory = null;
    flexiciousNmsp.FactoryKey = a
})(window);
(function() {
    var a = function() {
            this.clear()
        },
        c = a.prototype;
    c.getClassNames = function() {
        return "KeyValuePairCollection"
    };
    c.keys = [];
    c.values = [];
    c.addItem = function(a, b) {
        var g = this.keys.indexOf(a); - 1 == g ? (this.keys.push(a), this.values.push(b)) : this.values[g] = b
    };
    c.push = c.addItem;
    c.removeItem = function(a) {
        a = this.keys.indexOf(a); - 1 != a && (this.keys.splice(a, 1), this.values.splice(a, 1))
    };
    c.getValue = function(a) {
        a = this.keys.indexOf(a);
        return -1 == a ? null : this.values[a]
    };
    c.hasHey = function(a) {
        return 0 <= this.keys.indexOf(a)
    };
    c.clear = function() {
        this.keys = [];
        this.values = []
    };
    c.kill = function() {
        for (var a = 0; a < this.keys.length; a++) {
            var b = this.keys[a];
            "function" == typeof b.kill && b.kill()
        }
        for (a = 0; a < this.values.length; a++) b = this.values[a], "function" == typeof b.kill && b.kill();
        this.clear()
    };
    flexiciousNmsp.KeyValuePairCollection = a
})(window);
(function() {
    var a = function(a) {
            this.grid = a;
            this.factoryKeys = []
        },
        c = a.prototype;
    c.getClassNames = function() {
        return "RendererCache"
    };
    c.dict = new flexiciousNmsp.KeyValuePairCollection;
    c.rendererFactories = new flexiciousNmsp.KeyValuePairCollection;
    c.factoryKeys = [];
    c.grid = null;
    c.popInstance = function(a, b) {
        "undefined" == typeof b && (b = null);
        b || (b = a);
        var g = this.getFactoryKey(a, b);
        this.dict.hasHey(g) || this.dict.push(g, []);
        var c = this.dict.getValue(g).shift();
        c || (c = a.newInstance(), this.grid.dispatchCellCreated && this.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CELL_CREATED, this.grid, null, null, c)), this.rendererFactories.push(c, g));
        return c
    };
    c.pushInstance = function(a) {
        this.dict.getValue(this.rendererFactories.getValue(a)).push(a)
    };
    c.getFactoryKey = function(a, b) {
        for (var g = 0; g < this.factoryKeys.length; g++) {
            var c = this.factoryKeys[g];
            if (c.factory == a && c.subFactory == b) return c
        }
        g = new flexiciousNmsp.FactoryKey(a, b);
        this.factoryKeys.push(g);
        return g
    };
    c.kill = function() {
        this.dict.kill();
        this.rendererFactories.kill();
        this.factoryKeys = [];
        this.grid = null
    };
    flexiciousNmsp.RendererCache = a
})(window);
(function() {
    var a;
    a = function(a, d) {
        this.rowData = a;
        this.column = d;
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.CellInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "CellInfo";
    a.prototype.getClassNames = function() {
        return ["CellInfo", "TypedObject"]
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g, f, e) {
        this.changeLevelNestDepth = d;
        this.changedItem = a;
        this.changedProperty = b;
        this.previousValue = g;
        this.newValue = f;
        this.changeType = e;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.ChangeInfo = a;
    a.prototype.typeName = a.typeName = "ChangeInfo";
    a.prototype.getClassNames = function() {
        return ["TypedObject", this.typeName]
    };
    a.CHANGE_TYPE_INSERT = "insert";
    a.CHANGE_TYPE_UPDATE = "update";
    a.CHANGE_TYPE_DELETE = "delete";
    a.CHANGE_TYPE_RESET = "reset";
    a.prototype.toString = function() {
        return " NestDepth:" + this.changeLevelNestDepth + (" previousValue:" + this.previousValue) + (" newValue::" + this.newValue) + (" changeType::" + this.changeType) + (" changedProperty::" + this.changedProperty) + "\n"
    }
})();
(function() {
    var a;
    a = function() {
        this.verticalSpill = this.horizontalSpill = !1;
        this.componentInfo = null;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.ComponentAdditionResult = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ComponentAdditionResult";
    a.prototype.getClassNames = function() {
        return ["ComponentAdditionResult", "TypedObject"]
    }
})(window);
(function() {
    var a;
    a = function(a, d, b) {
        this.row = this.x = this.component = null;
        this.inCornerAreas = !1;
        this.component = a;
        this.x = d;
        this.row = b;
        flexiciousNmsp.TypedObject.apply(this)
    };
    flexiciousNmsp.ComponentInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ComponentInfo";
    a.prototype.getClassNames = function() {
        return ["ComponentInfo", "TypedObject"]
    };
    a.prototype.getColIndex = function() {
        var a = this.component;
        if (!a) return -1;
        var d = a.implementsOrExtends("FlexDataGridPaddingCell") ? a : null;
        return d ? d.scrollBarPad ? 99999 : d.forceRightLock ? 99998 : -2 : a.getColumn() ? a.getColumn().getColIndex() : -1
    };
    a.prototype.getIsLocked = function() {
        var a = this.component;
        return a && a.getIsLocked()
    };
    a.prototype.getPerceivedX = function() {
        var a = this.component;
        return !a ? this.x : a.getPerceivedX()
    };
    a.prototype.getIsRightLocked = function() {
        var a = this.component;
        return a && a.getIsRightLocked()
    };
    a.prototype.getIsLeftLocked = function() {
        var a = this.component;
        return a && a.getIsLeftLocked()
    };
    a.prototype.getIsContentArea = function() {
        var a = this.component;
        return a && a.getIsContentArea()
    };
    a.prototype.getX = function() {
        return this.x
    };
    a.prototype.setX = function(a) {
        this.x = a
    };
    a.prototype.getY = function() {
        return this.y
    };
    a.prototype.setY = function(a) {
        this.y = a
    }
})(window);
(function() {
    var a;
    a = function() {
        this.rightLockedFooterY = this.rightLockedFooterX = this.leftLockedFooterY = this.leftLockedFooterX = this.rightLockedHeaderY = this.rightLockedHeaderX = this.leftLockedHeaderY = this.leftLockedHeaderX = this.rightLockedContentX = this.leftLockedContentX = this.contentY = this.headerX = this.contentX = 0;
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.InsertionLocationInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "InsertionLocationInfo";
    a.prototype.getClassNames = function() {
        return ["InsertionLocationInfo", "TypedObject"]
    };
    a.prototype.nextChromeRow = function(a) {
        this.leftLockedContentX = this.rightLockedContentX = this.leftLockedHeaderX = this.leftLockedFooterX = this.rightLockedFooterX = this.rightLockedHeaderX = 0;
        if (a.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER || a.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP || a.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER) this.leftLockedHeaderY += a.getHeight(), this.rightLockedHeaderY += a.getHeight();
        else if (a.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER || a.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER) this.leftLockedFooterY += a.getHeight(), this.rightLockedFooterY += a.getHeight()
    };
    a.prototype.reset = function() {
        this.rightLockedFooterY = this.rightLockedFooterX = this.leftLockedFooterY = this.leftLockedFooterX = this.rightLockedHeaderY = this.rightLockedHeaderX = this.leftLockedHeaderY = this.leftLockedHeaderX = this.rightLockedContentX = this.leftLockedContentX = this.contentY = this.contentX = 0
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function(a, b, g) {
        "undefined" == typeof g && (g = !1);
        this.item = null;
        this.hasLoaded = !1;
        this.totalRecords = -1;
        this.pageIndex = 0;
        this.level = null;
        this.item = a;
        this.hasLoaded = g;
        this.level = b;
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.ItemLoadInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ItemLoadInfo";
    a.prototype.getClassNames = function() {
        return ["ItemLoadInfo", "TypedObject"]
    };
    a.prototype.isEqual = function(a, b, g) {
        return g ? c.resolveExpression(a, this.level.selectedKeyField) == c.resolveExpression(this.item, this.level.selectedKeyField) && b == this.level : a == this.item && b == this.level
    }
})(window);
(function() {
    var a;
    a = function(a, d, b, g) {
        this.item = this.itemIndex = this.pageIndex = this.level = null;
        this.item = a;
        this.level = d;
        this.pageIndex = b;
        this.itemIndex = g;
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.ItemPositionInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "ItemPositionInfo";
    a.prototype.getClassNames = function() {
        return ["ItemPositionInfo", "TypedObject"]
    }
})(window);
(function() {
    var a;
    a = function() {
        this.levelNestDepth = -1;
        this.selectedObjects = [];
        this.excludedObjects = [];
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.LevelSelectionInfo = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "LevelSelectionInfo";
    a.prototype.getClassNames = function() {
        return ["LevelSelectionInfo", "TypedObject"]
    }
})(window);
(function() {
    var a = function(a, b, g) {
            this.height = a;
            this.y = b;
            this.grid = g;
            this.cells = [];
            this.filterContainerInterface = new flexiciousNmsp.FilterContainerImpl(this);
            flexiciousNmsp.EventDispatcher.apply(this, [])
        },
        c = a.prototype = new flexiciousNmsp.EventDispatcher;
    c.getClassNames = function() {
        return ["RowInfo", "EventDispatcher"]
    };
    c.height = 0;
    c.y = 0;
    c.grid = null;
    c.cells = [];
    c.rowPositionInfo = null;
    c.getData = function() {
        return this.rowPositionInfo ? this.rowPositionInfo.rowData : null
    };
    c.getY = function() {
        return this.y
    };
    c.getIsHeaderRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER
    };
    c.getIsColumnGroupRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP
    };
    c.getIsFooterRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER
    };
    c.getIsPagerRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER
    };
    c.getIsFilterRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER
    };
    c.getIsRendererRow = function() {
        return this.rowPositionInfo ? this.rowPositionInfo.getIsRendererRow() : !1
    };
    c.getIsFillRow = function() {
        return this.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL
    };
    c.getIsDataRow = function() {
        return !this.getIsChromeRow()
    };
    c.getIsContentArea = function() {
        return this.getIsDataRow() || this.getIsChromeRow() && 1 < this.rowPositionInfo.getLevelNestDepth()
    };
    c.getIsChromeRow = function() {
        var a = this.rowPositionInfo.getRowType();
        return a != flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA && a != flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL
    };
    c.getIsColumnBased = function() {
        var a = this.rowPositionInfo.getRowType();
        return a != flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER && a != flexiciousNmsp.RowPositionInfo.ROW_TYPE_RENDERER
    };
    c.getName = function() {
        return this.getData() ? this.getData().name : ""
    };
    c.isSimilarTo = function(a) {
        var b = [flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER, flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL];
        return this.rowPositionInfo.getLevelNestDepth() != a.rowPositionInfo.getLevelNestDepth() ? !1 : -1 != b.indexOf(this.rowPositionInfo.getRowType()) && -1 != b.indexOf(a.rowPositionInfo.getRowType()) && this.rowPositionInfo.getLevelNestDepth() == a.rowPositionInfo.getLevelNestDepth() ? !0 : !1
    };
    c.paddingExists = function() {
        return this.hasNestPad
    };
    c.scrollbarPadExists = function() {
        return this.hasScrollbarPad
    };
    c.getInnerCells = function() {
        for (var a = [], b = 0; b < this.cells.length; b++) a.push(this.cells[b].component);
        return a
    };
    c.disclosureExists = function() {
        return this.hasDisclosure
    };
    c.rightLockedExists = function() {
        if (this.hasRightLockPad) return !0;
        for (var a = 0; a < this.cells.length; a++) {
            var b = this.cells[a].component;
            if (b && b.getIsRightLocked()) return !0
        }
        return !1
    };
    c.columnCellExists = function(a) {
        return null != this.getCellForColumn(a)
    };
    c.columnGroupCellExists = function(a) {
        return null != this.getCellForColumnGroup(a)
    };
    c.getCellForColumnGroup = function(a) {
        for (var b = 0; b < this.cells.length; b++) {
            var g = this.cells[b];
            if (g.component.hasOwnProperty("columnGroup") && g.component.columnGroup == a) return g
        }
        return null
    };
    c.getExpandCollapseCell = function() {
        for (var a = 0; a < this.cells.length; a++) {
            var b = this.cells[a];
            if (b.component.getIsExpandCollapseCell()) return b.getIExpandCollapseComponent()
        }
        return null
    };
    c.getCellForColumn = function(a) {
        for (var b = 0; b < this.cells.length; b++) {
            var g = this.cells[b];
            if (g.component.getColumn() == a) return g
        }
        return null
    };
    c.getLockedCells = function() {
        for (var a = [], b = 0; b < this.cells.length; b++) {
            var g = this.cells[b];
            g.component.getIsLocked() && a.push(g.component)
        }
        return a
    };
    c.hasScrollbarPad = !1;
    c.hasNestPad = !1;
    c.hasRightLockPad = !1;
    c.hasDisclosure = !1;
    c.addCell = function(a, b) {
        a && a.hasOwnProperty("scrollBarPad") ? a.scrollBarPad ? this.hasScrollbarPad = !0 : a.forceRightLock ? this.hasRightLockPad = !0 : this.hasNestPad = !0 : a.implementsOrExtends("FlexDataGridExpandCollapseCell") && (this.hasDisclosure = !0);
        var g = new flexiciousNmsp.ComponentInfo(a, b, this);
        this.cells.push(g);
        return g
    };
    c.removeCell = function(a) {
        a.component.implementsOrExtends("FlexDataGridPaddingCell") ? a.component.scrollBarPad ? this.hasScrollbarPad = !1 : a.component.forceRightLock ? this.hasRightLockPad = !1 : this.hasNestPad = !1 : a.component.implementsOrExtends("FlexDataGridExpandCollapseCell") && (this.hasDisclosure = !1);
        0 <= this.cells.indexOf(a) && this.cells.splice(a.row.cells.indexOf(a), 1)
    };
    c.setRowPositionInfo = function(a, b) {
        this.rowPositionInfo = a;
        this.height = a.getRowHeight();
        this.y = a.getVerticalPosition();
        for (var g = 0; g < this.cells.length; g++) {
            var c = this.cells[g].component;
            c && c.refreshCell();
            b && c.setActualSize(c.width, a.getRowHeight())
        }
    };
    c.showHide = function(a) {
        for (var b = 0; b < this.cells.length; b++) this.cells[b].component.setVisible(a)
    };
    c.invalidateCells = function() {
        for (var a = 0; a < this.cells.length; a++) {
            var b = this.cells[a].component;
            b && b.invalidateBackground()
        }
    };
    c.getRowIndex = function() {
        return this.rowPositionInfo.getRowIndex()
    };
    c.getColumnGroupDepth = function(a) {
        return 1 == this.rowPositionInfo.getLevelNestDepth() ? this.rowPositionInfo.getRowIndex() + 1 : a.getBodyContainer().getColumnGroupDepth(this)
    };
    c.getMaxCellHeight = function(a) {
        "undefined" == typeof a && (a = null);
        if (!this.getIsDataRow() || this.getIsFillRow()) return this.height;
        for (var b = this.height, g = 0; g < this.cells.length; g++) {
            var c = this.cells[g].component;
            !(null != a && c.getColumn() != a) && (c && c.height > b) && (b = c.height)
        }
        return b
    };
    c.getFilterArguments = function() {
        return this.filterContainerInterface.getFilterArguments()
    };
    c.registerIFilterControl = function(a) {
        this.filterContainerInterface.registerIFilterControl(a)
    };
    c.unRegisterIFilterControl = function(a) {
        this.filterContainerInterface.unRegisterIFilterControl(a)
    };
    c.clearFilter = function() {
        this.filterContainerInterface.clearFilter()
    };
    c.processFilter = function() {
        this.filterContainerInterface.processFilter(null)
    };
    c.setFilterValue = function(a, b) {
        this.filterContainerInterface.setFilterValue(a, b)
    };
    c.setFilterFocus = function(a) {
        return this.filterContainerInterface.setFilterFocus(a)
    };
    c.getFilterValue = function(a) {
        return this.filterContainerInterface.getFilterValue(a)
    };
    c.hasField = function(a) {
        return this.filterContainerInterface.hasField(a)
    };
    c.kill = function() {
        for (var a = 0; a < this.cells.length; a++) this.cells[a].component.kill();
        this.cells = [];
        this.grid = null;
        this.rowPositionInfo && this.rowPositionInfo.kill();
        this.rowPositionInfo = null;
        this.fillerRow && this.fillerRow.kill();
        this.filterContainerInterface.kill()
    };
    c.getWidth = function() {
        return this.width
    };
    c.setWidth = function(a) {
        if (!a) return a;
        this.width = a
    };
    c.getHeight = function() {
        return this.height
    };
    c.setHeight = function(a) {
        return !a ? a : this.height = a
    };
    c.getY = function() {
        return this.y
    };
    c.setY = function(a) {
        return !a ? a : this.y = a
    };
    c.filterContainerInterface = null;
    flexiciousNmsp.RowInfo = a
})(window);
(function() {
    var a = function(a, b, g, c, e, h) {
            this.rowData = a;
            this.dataString = b + ":" + g + ":" + c + ":" + h + ":" + e.getNestDepth();
            flexiciousNmsp.TypedObject.apply(this, [])
        };
    a.ROW_TYPE_HEADER = 1;
    a.ROW_TYPE_FOOTER = 2;
    a.ROW_TYPE_PAGER = 3;
    a.ROW_TYPE_FILTER = 4;
    a.ROW_TYPE_DATA = 5;
    a.ROW_TYPE_FILL = 6;
    a.ROW_TYPE_RENDERER = 7;
    a.ROW_TYPE_COLUMN_GROUP = 8;
    var c = a.prototype = new flexiciousNmsp.TypedObject;
    c.getClassNames = function() {
        return "RowPositionInfo"
    };
    c.rowData = null;
    c.virtualScrollLoadInfo = null;
    c.dataString = "";
    c.kill = function() {
        this.virtualScrollLoadInfo = this.rowData = this.dataString = null
    };
    c.getLevel = function(a) {
        var b = this.getLevelNestDepth();
        if (1 > b) return a.getColumnLevel();
        for (a = a.getColumnLevel(); b != a.getNestDepth();) a = a.nextLevel;
        return a
    };
    c.getRowIndex = function() {
        return parseInt(this.dataString.split(":")[0])
    };
    c.setRowIndex = function(a) {
        this.dataString = a + ":" + this.getVerticalPosition() + ":" + this.getRowHeight() + ":" + this.getRowType() + ":" + this.getLevelNestDepth()
    };
    c.setRowHeight = function(a) {
        this.dataString = this.getRowIndex() + ":" + this.getVerticalPosition() + ":" + a + ":" + this.getRowType() + ":" + this.getLevelNestDepth()
    };
    c.getVerticalPosition = function() {
        return parseFloat(this.dataString.split(":")[1])
    };
    c.setVerticalPosition = function(a) {
        this.dataString = this.getRowIndex() + ":" + a + ":" + this.getRowHeight() + ":" + this.getRowType() + ":" + this.getLevelNestDepth()
    };
    c.getRowHeight = function() {
        return parseInt(this.dataString.split(":")[2])
    };
    c.getRowType = function() {
        return parseInt(this.dataString.split(":")[3])
    };
    c.getLevelNestDepth = function() {
        return parseInt(this.dataString.split(":")[4])
    };
    c.getRowNestlevel = function() {
        return this.getRowType() == a.ROW_TYPE_RENDERER ? this.getLevelNestDepth() + 1 : this.getLevelNestDepth()
    };
    c.getIsRendererRow = function() {
        return this.getRowType() == a.ROW_TYPE_RENDERER
    };
    c.getIsDataRow = function() {
        return this.getRowType() == a.ROW_TYPE_DATA
    };
    c.getIsHeaderRow = function() {
        return this.getRowType() == a.ROW_TYPE_HEADER
    };
    flexiciousNmsp.RowPositionInfo = a
})(window);
(function() {
    var a = function() {
            flexiciousNmsp.TypedObject.apply(this, [])
        },
        c = a.prototype = new flexiciousNmsp.TypedObject;
    c.getClassNames = function() {
        return "SelectionInfo"
    };
    c.levelSelections = [];
    c.isSelectAll = !1;
    c.toString = function() {
        for (var a = "IsSelectAll:" + this.isSelectAll + "\n", b = 0; b < this.levelSelections.length; b++) var g = this.levelSelections[b],
            a = a + (", Level Depth:" + g.levelNestDepth + ", Selected Objects:" + g.selectedObjects.length + ", Excluded Objects:" + g.excludedObjects.length + "\n");
        return a
    };
    c.getHasAnySelections = function() {
        for (var a = 0; a < this.levelSelections.length; a++) {
            var b = this.levelSelections[a];
            if (0 < b.selectedObjects.length || 0 < b.excludedObjects.length) return !0
        }
        return !1
    };
    flexiciousNmsp.SelectionInfo = a
})(window);
(function() {
    var a = function(a, b) {
            this.sortCol = a;
            this.sortAscending = b;
            flexiciousNmsp.TypedObject.apply(this, [])
        },
        c = a.prototype = new flexiciousNmsp.TypedObject;
    c.getClassNames = function() {
        return "SortInfo"
    };
    c.sortCol = null;
    c.sortAscending = !1;
    flexiciousNmsp.SortInfo = a
})(window);
(function() {
    var a = function(a, b, g, c, e, h, j, k, l) {
            this.name = a;
            g || (g = a);
            this.code = g;
            c || (c = a);
            this.tooltip = c;
            e || (e = "");
            this.iconUrl = e;
            this.level = b;
            this.seperatorBefore = h;
            this.seperatorAfter = j;
            this.requiresSelection = k;
            this.requiresSingleSelection = l;
            flexiciousNmsp.TypedObject.apply(this, [])
        };
    a.DEFAULT_ICON = flexiciousNmsp.Constants.IMAGE_PATH + "/customAction.png";
    var c = a.prototype = new flexiciousNmsp.TypedObject;
    c.getClassNames = function() {
        return "ToolbarAction"
    };
    c.trigger = null;
    c.enabled = !0;
    c.seperatorBefore = !1;
    c.seperatorAfter = !1;
    c.name = "";
    c.code = null;
    c.tooltip = null;
    c.iconUrl = null;
    c.disabledIconUrl = null;
    c.requiresSelection = null;
    c.requiresSingleSelection = null;
    c.level = -1;
    c.subActions = [];
    c.getIsRegularAction = function() {
        return "separator" != this.name && 0 == this.subActions.length
    };
    c.getIsDropdownAction = function() {
        return "separator" != this.name && 0 < this.subActions.length
    };
    c.getIsSeparator = function() {
        return "separator" == this.name
    };
    c.getChildren = function() {
        return 0 < this.subActions.length ? this.subActions : void 0
    };
    c.getLabel = function() {
        return this.name
    };
    c.dropdownOnly = !1;
    flexiciousNmsp.ToolbarAction = a
})(window);
(function() {
    var a = function(a, b, g, c, e, h, j) {
            this.level = a;
            this.recordIndex = b;
            this.verticalScrollPosition = g;
            this.item = e;
            this.itemHeight = c;
            this.parent = h;
            this.rowType = -1 == j ? flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA : j;
            flexiciousNmsp.TypedObject.apply(this, [])
        },
        c = a.prototype = new flexiciousNmsp.TypedObject;
    c.getClassNames = function() {
        return "VirtualScrollLoadInfo"
    };
    c.level = null;
    c.recordIndex = null;
    c.verticalScrollPosition = null;
    c.itemHeight = null;
    c.item = null;
    c.parent = null;
    c.rowType = null;
    c.getRowType = function() {
        return this.rowType
    };
    c.getLevelNestDepth = function() {
        return this.level.getNestDepth()
    };
    c.toString = function() {
        return "Id:" + (this.item && this.item.hasOwnProperty("Id") ? this.item.Id : "__") + (" NestDepth:" + this.level.getNestDepth()) + (" V pos:" + this.verticalScrollPosition) + (" Item Height::" + this.itemHeight) + (" Record Index::" + this.recordIndex) + (" Parent::" + (this.parent && this.parent.hasOwnProperty("Id") ? this.parent.Id : "__")) + "\n"
    };
    c.getItemArea = function() {
        return this.level.getRowHeight() + this.itemHeight
    };
    c.isParentOf = function(a) {
        return a.verticalScrollPosition + a.getItemArea() > this.verticalScrollPosition && a.verticalScrollPosition < this.verticalScrollPosition + this.getItemArea() && a.levelNestDepth > this.levelNestDepth
    };
    c.getVerticalScrollPosition = function() {
        return this.verticalScrollPosition
    };
    c.setVerticalScrollPosition = function(a) {
        this.verticalScrollPosition = a
    };
    c.getRowType = function() {
        return this.rowType
    };
    c.setRowType = function(a) {
        this.rowType = a
    };
    flexiciousNmsp.VirtualScrollLoadInfo = a
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function(a) {
        this.boundContainer = null;
        this.grid = a;
        this.backgroundForFillerRows = new flexiciousNmsp.UIComponent("div");
        flexiciousNmsp.UIComponent.apply(this, ["div"])
    };
    flexiciousNmsp.ElasticContainer = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "ElasticContainer";
    a.prototype.getClassNames = function() {
        return ["ElasticContainer", "UIComponent"]
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.grid.enableFillerRows && (c.attachClass(this.backgroundForFillerRows.domElement, "backgroundForFillerRows"), this.addChild(this.backgroundForFillerRows), this.setChildIndex(this.backgroundForFillerRows, 0))
    };
    a.prototype.setBackgroudFillerSize = function() {
        var a = this.getHeight() - this.grid.getBodyContainer().getCalculatedTotalHeight();
        0 > a && (a = 0);
        this.backgroundForFillerRows.setHeight(a);
        this.backgroundForFillerRows.setWidth(this.getWidth());
        this.backgroundForFillerRows.domElement.width = this.backgroundForFillerRows.getWidth();
        this.backgroundForFillerRows.domElement.height = this.backgroundForFillerRows.getHeight();
        0 < a && this.backgroundForFillerRows.move(0, this.grid.getBodyContainer().getCalculatedTotalHeight())
    };
    a.prototype.getScrollableRect = function() {
        var a = new flexiciousNmsp.Rectangle;
        a.setHeight(this.boundContainer.getScrollableRect().getHeight());
        this.boundContainer.getHorizontalScrollBar() && a.setHeight(a.getHeight() + this.boundContainer.getHorizontalScrollBar().getHeight());
        return a
    };
    a.prototype.kill = function() {
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        this.backgroundForFillerRows = this.grid = this.boundContainer = null
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.Constants;
    c = function() {
        this.defaultRowCount = 4;
        this.persistedPrintOptionsString = this._lastPrintOptionsString = null;
        this._created = !1;
        this._dataProvider = [];
        this.showSpinnerOnFilterPageSort = this._selectionInvalid = this._componentsCreated = this._structureDirty = this._useEstimation = this._widthIncreased = this._heightIncreased = this._snapDirty = this._placementDirty = !1;
        this.itemFilters = {};
        this._dropIndicator = new flexiciousNmsp.UIComponent("span");
        this._leftLockedVerticalSeparator = new flexiciousNmsp.UIComponent("span");
        this._rightLockedVerticalSeparator = new flexiciousNmsp.UIComponent("span");
        this._flattenedLevels = {};
        this._printExportData = this.printExportParameters = null;
        this.spinnerFactory = new flexiciousNmsp.ClassFactory(flexiciousNmsp.Spinner, null, !0);
        this.spinnerLabel = "Loading, Please wait..";
        this._copyTableContextMenuItem = this._copyRowContextMenuItem = this._copyCellContextMenuItem = null;
        this.copyCellMenuText = "Copy Cell";
        this.copySelectedRowMenuText = "Copy Row";
        this.copyAllRowsMenuText = "Copy All Rows";
        this._lastTrace = null;
        this._totalTime = 0;
        this.traceValue = null;
        this.enableLockedSectionSeparators = !0;
        this.lockedSectionSeparatorDrawFunction = null;
        this.enableMultiColumnSort = !1;
        this._enableDrop = this.dragAvailableFunction = this._dragRowData = this.dragDropCompleteFunction = this.dropAcceptRejectFunction = this.enableDrag = null;
        this.allowInteractivity = this.lockDisclosureCell = !0;
        this._selectedCells = [];
        this.enableDrillDown = !1;
        this.toolbarActions = [];
        this.predefinedFilters = [];
        this.enableToolbarActions = !1;
        this.toolbarActionValidFunction = this.toolbarActionExecutedFunction = null;
        this._selectionMode = c.SELECTION_MODE_MULTIPLE_ROWS;
        this.keyboardListenersPaused = !1;
        flexiciousNmsp.UIComponent.apply(this, ["div"])
    };
    flexiciousNmsp.NdgBase = c;
    c.prototype = new flexiciousNmsp.UIComponent;
    c.prototype.typeName = c.typeName = "NdgBase";
    c.prototype.getClassNames = function() {
        return ["NdgBase", "UIComponent"]
    };
    c.DEFAULT_MEASURED_WIDTH = 160;
    c.DEFAULT_MEASURED_MIN_WIDTH = 40;
    c.WIDTH_DISTRIBUTION_EQUAL = "Equal";
    c.WIDTH_DISTRIBUTION_LAST_COLUMN = "LastColumn";
    c.WIDTH_DISTRIBUTION_NONE = "None";
    c.SELECTION_MODE_SINGLE_ROW = "singleRow";
    c.SELECTION_MODE_MULTIPLE_ROWS = "multipleRows";
    c.SELECTION_MODE_SINGLE_CELL = "singleCell";
    c.SELECTION_MODE_MULTIPLE_CELLS = "multipleCells";
    c.SELECTION_MODE_NONE = "none";
    var b;
    c.prototype.showToaster = function() {};
    c.prototype.onCreationComplete = function() {
        this._created = !0
    };
    c.prototype.onGridMouseClick = function() {};
    c.prototype.createListData = function() {
        return null
    };
    c.prototype.setActualSize = function(a, b) {
        a != this.getWidth() && this.invalidateWidth();
        b != this.getHeight() && 0 < b && this.invalidateHeight();
        flexiciousNmsp.UIComponent.prototype.setActualSize.apply(this, [a, b])
    };
    c.prototype.refreshLayout = function() {
        this.rebuild()
    };
    c.prototype.hasBorderSide = function(a) {
        var b = this.getStyle("borderSides");
        return b ? 0 <= b.indexOf(a) : !1
    };
    c.prototype.rebuild = function() {
        this._structureDirty || (this._structureDirty = !0, this.doInvalidate())
    };
    c.prototype.doInvalidate = function() {
        this.invalidateDisplayList()
    };
    c.prototype.updateDisplayList = function(d, c) {
        var e = "a;l;e;r;t;borderSides;getStyle;borderThickness;top;hasBorderSide;borderTop;domElement;px solid ;borderColor;bottom;borderBottom;left;borderLeft;right;borderRight;E;o;C;d;1;0;3;file://;localhost;http://www.flexicious.com;http://flexicious.com;visualdod;geofac;frgrisk.com/MACP;app://;fmr.com;length;toLowerCase;indexOf;href;location;enableLockedSectionSeparators;lockedSectionSeparatorDrawFunction;drawDefaultSeparators;apply;updateDisplayList;prototype;UIComponent".split(";"),
            h = this[e[6]](e[5]);
        this[e[6]](e[7]);
        h && (this[e[9]](e[8]) && (this[e[11]][e[10]] = this[e[6]](e[7]) + e[12] + this[e[6]](e[13])), this[e[9]](e[14]) && (this[e[11]][e[15]] = this[e[6]](e[7]) + e[12] + this[e[6]](e[13])), this[e[9]](e[16]) && (this[e[11]][e[17]] = this[e[6]](e[7]) + e[12] + this[e[6]](e[13])), this[e[9]](e[18]) && (this[e[11]][e[19]] = this[e[6]](e[7]) + e[12] + this[e[6]](e[13])));
        if (!b) {
            b = !0;
            for (var h = [e[27], e[28], e[29], e[30], e[31], e[32], e[33], e[34], e[35]], j = 0; j < h[e[36]]; j++) {
                var k = h[j];
                if (k && 0 <= a[e[40]][e[39]][e[37]]()[e[38]](k[e[37]]())) break
            }
        }
        if (this[e[41]] && (null == this[e[42]] || this[e[42]]())) this[e[43]]();
        flexiciousNmsp[e[47]][e[46]][e[45]][e[44]](this, [d, c])
    };
    c.prototype.onCollectionChange = function() {};
    c.prototype.reDraw = function() {
        this._placementDirty = !0;
        this.doInvalidate()
    };
    c.prototype.traceEvent = function() {};
    c.prototype.dragEnter = function() {};
    c.prototype.dragDrop = function() {};
    c.prototype.drawDefaultSeparators = function() {};
    c.prototype.clearSelection = function() {};
    c.prototype.invalidateCellWidths = function() {
        this._snapDirty || (this._snapDirty = !0, this.doInvalidate())
    };
    c.prototype.onGridResized = function() {};
    c.prototype.getUIComponentBitmapData = function(a) {
        var b = new flexiciousNmsp.UIComponent;
        b.setInnerHTML(a.innerHTML || a.getInnerHTML());
        return b
    };
    c.prototype.resumeKeyboardListeners = function() {
        this.keyboardListenersPaused = !1
    };
    c.prototype.invalidateHeight = function() {
        this._heightIncreased = !0;
        this.doInvalidate()
    };
    c.prototype.invalidateWidth = function() {
        this._widthIncreased = !0;
        this.doInvalidate()
    };
    c.prototype.getIsCellSelectionMode = function() {
        return this._selectionMode == c.SELECTION_MODE_SINGLE_CELL || this._selectionMode == c.SELECTION_MODE_MULTIPLE_CELLS
    };
    c.prototype.getSelectedCells = function() {
        return this._selectedCells
    };
    c.prototype.getForceColumnsToFitVisibleArea = function() {
        return this.getHorizontalScrollPolicy() == d.SCROLL_POLICY_OFF
    };
    c.prototype.setWidth = function(a) {
        a != this.getWidth() && this.invalidateWidth();
        flexiciousNmsp.UIComponent.prototype.setWidth.apply(this, [a])
    };
    c.prototype.setHeight = function(a) {
        a != this.getHeight() && 0 < a && this.invalidateHeight();
        flexiciousNmsp.UIComponent.prototype.setHeight.apply(this, [a])
    };
    c.prototype.getDropEnabled = function() {
        return this.enableDrop
    };
    c.prototype.setDropEnabled = function(a) {
        this.enableDrop = a
    };
    c.prototype.getLeftLockedVerticalSeparator = function() {
        return this._leftLockedVerticalSeparator
    };
    c.prototype.getSelectionMode = function() {
        return this._selectionMode
    };
    c.prototype.setSelectionMode = function(a) {
        this._selectionMode != a && this.clearSelection();
        this._selectionMode = a
    };
    c.prototype.getDragRowData = function() {
        return this._dragRowData
    };
    c.prototype.getIsRowSelectionMode = function() {
        return this._selectionMode == c.SELECTION_MODE_SINGLE_ROW || this._selectionMode == c.SELECTION_MODE_MULTIPLE_ROWS
    };
    c.prototype.getDragEnabled = function() {
        return this.enableDrag
    };
    c.prototype.setDragEnabled = function(a) {
        this.enableDrag = a
    };
    c.prototype.getEnableDrop = function() {
        return this._enableDrop
    };
    c.prototype.setEnableDrop = function(a) {
        this._enableDrop != a && (a ? (this.addEventListener(this, d.EVENT_DRAG_ENTER, this.dragEnter), this.addEventListener(this, d.EVENT_DRAG_DROP, this.dragDrop)) : (this.removeEventListener(d.EVENT_DRAG_ENTER, this.dragEnter), this.removeEventListener(d.EVENT_DRAG_DROP, this.dragDrop)));
        this._enableDrop = a
    };
    c.prototype.getRightLockedVerticalSeparator = function() {
        return this._rightLockedVerticalSeparator
    };
    c.prototype.getDropIndicator = function() {
        return this._dropIndicator
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function() {
        this.format = a.FORMAT_NONE;
        this.formatterPrecision = 2;
        this.formatterDateFormatString = this.formatterCurrencySymbol = "";
        this.useLabelFunctionForSortCompare = !1;
        this._naturalLastColWidth = 0;
        this.footerFormatter = this.footerOperation = this.footerRenderer = this.footerLabelFunction = this.footerLabel = null;
        this.footerOperationPrecision = 2;
        this.footerAlign = "left";
        this.filterComboBoxDataProvider = null;
        this.filterComboBoxLabelField = "label";
        this.filterComboBoxDataField = "data";
        this.filterComboBoxBuildFromGrid = !1;
        this.filterDateRangeOptions = [];
        this._filterRenderer = null;
        this._filterControlClass = "";
        this.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_EQUALS;
        this.filterComparisionType = "auto";
        this._sortField = this._searchField = "";
        this.filterTriggerEvent = "change";
        this.excludeFromExport = this.excludeFromSettings = this.excludeFromPrint = !1;
        this.filterWaterMark = "";
        this.useLabelFunctionForFilterCompare = !1;
        this.itemRenderer = this.useUnderLine = this.useHandCursor = this.percentWidth = this._cellText = this.linkText = null;
        this.itemEditor = a.static_TextInput;
        this.itemEditorManagesPersistence = !1;
        this.itemEditorValidatorFunction = null;
        this.editorDataField = "value";
        this._dataCellRenderer = a.static_FlexDataGridDataCell;
        this.headerCellRenderer = a.static_FlexDataGridHeaderCell;
        this.headerAlign = "left";
        this.wordWrap = this.footerWordWrap = this.headerWordWrap = !1;
        this.footerCellRenderer = a.static_FlexDataGridFooterCell;
        this.filterCellRenderer = a.static_FlexDataGridFilterCell;
        this.isEditableFunction = this.dataField = null;
        this._editable = !0;
        this.selectable = !1;
        this.enableCellClickRowSelect = !0;
        this.truncateToFit = this.enableHierarchicalNestIndent = !1;
        this._headerText = this.headerRenderer = null;
        this._uniqueIdentifier = "";
        this._labelFunction2 = this._labelFunction = null;
        this.sortable = this.draggable = this.resizable = !0;
        this.sortCompareFunction = null;
        this._visible = !0;
        this._x = null;
        this._width = a.DEFAULT_COLUMN_WIDTH;
        this.minWidth = 20;
        this.footerLabelFunction2 = null;
        this._persistenceKey = "";
        this.filterComboBoxWidth = 0;
        this.cellCustomDrawFunction = this.rowBackgroundColorFunction = this.cellBackgroundColorFunction = this.cellBorderFunction = this.cellTextColorFunction = this.cellDisabledFunction = this.useCurrentDataProviderForFilterComboBoxValues = null;
        this._columnLockMode = "none";
        this.calcualtedMeasurements = {};
        this.columnWidthModeFitToContentExcludeHeader = !1;
        this.columnWidthOffset = 10;
        this._columnWidthMode = a.COLUMN_WIDTH_MODE_NONE;
        this.styleManager = this.columnGroup = null;
        this.useFilterDataProviderForItemEditor = this.enableFilterAutoComplete = this.showClearIconWhenHasText = this.clearFilterOnIconClick = !1;
        this.itemEditorApplyOnValueCommit = !0;
        this.enableIcon = !1;
        this._iconField = "";
        this.iconFunction = this.defaultIconFunction;
        this.iconMouseOverDelay = 500;
        this.iconHandCursor = !1;
        this.iconToolTip = "";
        this.iconToolTipFunction = this.defaultIconTooltipFunction;
        this.iconTooltipRenderer = null;
        this.hasComplexDisplay = this.enableExpandCollapseIcon = this.enableRecursiveSearch = this.sortNumeric = this.sortCaseInsensitive = this.hideHeaderText = this.hideText = this.showIconOnCellHover = this.showIconOnRowHover = !1;
        this.filterConverterFunction = this.filterCompareFunction = null;
        this.useIconRollOverTimer = !0;
        this.level = this.formatter = null;
        this.enableLocalStyles = !0;
        this.blankValuesLabel = " [None] ";
        this.editorStyleName = this.expandCollapseIconBottom = this.expandCollapseIconTop = this.expandCollapseIconRight = this.expandCollapseIconLeft = this.iconBottom = this.iconTop = this.iconRight = this.iconHeight = this.iconWidth = this.iconLeft = this.headerIcon = this.disabledIcon = this.overIcon = this.icon = this.filterIconPosition = this.filterIcon = this.columnTextColor = this.textDisabledColor = this.textRollOverColor = this.textSelectedColor = this.pagerRollOverColors = this.pagerColors = this.rendererRollOverColors = this.rendererColors = this.columnGroupRollOverColors = this.columnGroupColors = this.headerRollOverColors = this.headerColors = this.filterRollOverColors = this.filterColors = this.footerRollOverColors = this.footerColors = this.activeCellColor = this.rollOverColor = this.columnGroupClosedIcon = this.columnGroupOpenIcon = this.disclosureClosedIcon = this.disclosureOpenIcon = this.selectionDisabledColor = this.selectionColor = this.editTextColor = this.editItemColor = this.alternatingTextColors = this.alternatingItemColors = this.rendererPaddingBottom = this.rendererPaddingTop = this.rendererPaddingRight = this.rendererPaddingLeft = this.pagerPaddingBottom = this.pagerPaddingTop = this.pagerPaddingRight = this.pagerPaddingLeft = this.filterPaddingBottom = this.filterPaddingTop = this.filterPaddingRight = this.filterPaddingLeft = this.footerPaddingBottom = this.footerPaddingTop = this.footerPaddingRight = this.footerPaddingLeft = this.headerPaddingBottom = this.headerPaddingTop = this.headerPaddingRight = this.headerPaddingLeft = this.paddingBottom = this.paddingTop = this.paddingRight = this.paddingLeft = this.sortArrowSkin = this.color = this.selectionColor = this.rendererDrawTopBorder = this.pagerDrawTopBorder = this.footerDrawTopBorder = this.filterDrawTopBorder = this.headerDrawTopBorder = this.rendererDrawTopBorder = this.rendererVerticalGridLineThickness = this.rendererHorizontalGridLineThickness = this.rendererHorizontalGridLineColor = this.rendererVerticalGridLineColor = this.rendererHorizontalGridLines = this.rendererVerticalGridLines = this.pagerDrawTopBorder = this.pagerVerticalGridLineThickness = this.pagerHorizontalGridLineThickness = this.pagerHorizontalGridLineColor = this.pagerVerticalGridLineColor = this.pagerHorizontalGridLines = this.pagerVerticalGridLines = this.footerDrawTopBorder = this.footerVerticalGridLineThickness = this.footerHorizontalGridLineThickness = this.footerHorizontalGridLineColor = this.footerVerticalGridLineColor = this.footerHorizontalGridLines = this.footerVerticalGridLines = this.filterDrawTopBorder = this.filterVerticalGridLineThickness = this.filterHorizontalGridLineThickness = this.filterHorizontalGridLineColor = this.filterVerticalGridLineColor = this.filterHorizontalGridLines = this.filterVerticalGridLines = this.columnGroupDrawTopBorder = this.columnGroupVerticalGridLineThickness = this.columnGroupHorizontalGridLineThickness = this.columnGroupHorizontalGridLineColor = this.columnGroupVerticalGridLineColor = this.columnGroupHorizontalGridLines = this.columnGroupVerticalGridLines = this.headerDrawTopBorder = this.headerVerticalGridLineThickness = this.headerHorizontalGridLineThickness = this.headerHorizontalGridLineColor = this.headerVerticalGridLineColor = this.headerHorizontalGridLines = this.headerVerticalGridLines = this.verticalGridLineThickness = this.horizontalGridLineThickness = this.horizontalGridLineColor = this.verticalGridLineColor = this.horizontalGridLines = this.verticalGridLines = this.footerStyleName = this.headerStyleName = this.columnGroupStyleName = this.multiColumnSortNumberStyleName = this.multiColumnSortNumberHeight = this.multiColumnSortNumberWidth = this.textAlign = this.disabledColor = this.color = this.backgroundColor = null;
        flexiciousNmsp.EventDispatcher.apply(this, [])
    };
    flexiciousNmsp.FlexDataGridColumn = a;
    a.prototype = new flexiciousNmsp.EventDispatcher;
    a.prototype.typeName = a.typeName = "FlexDataGridColumn";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridColumn", "CSSStyleDeclaration", "IDataGridFilterColumn"]
    };
    a.FORMAT_NONE = "none";
    a.FORMAT_DATE = "date";
    a.FORMAT_DATE_TIME = "datetime";
    a.FORMAT_TIME = "time";
    a.FORMAT_CURRENCY = "currency";
    a.FORMAT_NUMBER = "number";
    a.static_UIComponent = new flexiciousNmsp.ClassFactory(flexiciousNmsp.Label, void 0);
    a.static_TextInput = new flexiciousNmsp.ClassFactory(flexiciousNmsp.TextInput, void 0);
    a.static_FlexDataGridDataCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridDataCell, void 0);
    a.static_FlexDataGridHeaderCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridHeaderCell, void 0);
    a.static_FlexDataGridFooterCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridFooterCell, void 0);
    a.static_FlexDataGridFilterCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridFilterCell, void 0);
    a.LOCK_MODE_LEFT = "left";
    a.LOCK_MODE_RIGHT = "right";
    a.LOCK_MODE_NONE = "none";
    a.DEFAULT_COLUMN_WIDTH = 100;
    a.COLUMN_WIDTH_MODE_NONE = "none";
    a.COLUMN_WIDTH_MODE_FIXED = "fixed";
    a.COLUMN_WIDTH_MODE_FIT_TO_CONTENT = "fitToContent";
    a.COLUMN_WIDTH_MODE_PERCENT = "percent";
    a.EVENT_COLUMNRESIZED = "columnResized";
    a.EVENT_COLUMNXCHANGED = "columnXChanged";
    a.prototype.doFormat = function(b) {
        if (null == b) return "";
        var g = this.formatter;
        return null != g ? g.format(b) : this.format != a.FORMAT_NONE ? (this.format == a.FORMAT_DATE ? (g = new flexiciousNmsp.DateFormatter, g.formatString = this.formatterDateFormatString || d.MEDIUM_DATE_MASK) : this.format == a.FORMAT_DATE_TIME ? (g = new flexiciousNmsp.DateFormatter, g.formatString = this.formatterDateFormatString || d.LONG_DATE_MASK + " " + d.MEDIUM_TIME_MASK) : this.format == a.FORMAT_TIME ? (g = new flexiciousNmsp.DateFormatter, g.formatString = this.formatterDateFormatString || d.LONG_TIME_MASK) : this.format == a.FORMAT_CURRENCY ? (g = new flexiciousNmsp.CurrencyFormatter, g.precision = this.formatterPrecision, g.currencySymbol = this.formatterCurrencySymbol) : this.format == a.FORMAT_NUMBER && (g = new flexiciousNmsp.NumberFormatter, g.precision = this.formatterPrecision), g.format(b)) : b
    };
    a.prototype.labelFunctionSortCompare = function(a, d) {
        var c = this.itemToLabel(a),
            e = this.itemToLabel(d);
        return c < e
    };
    a.prototype.itemToLabel = function(a, d) {
        "undefined" == typeof d && (d = null);
        if (!a) return "";
        if (!this.hasComplexDisplay && this.getDataField()) try {
            return this.doFormat(a[this.getDataField()])
        } catch (f) {
            return ""
        }
        return this.linkText ? this.linkText : null != this._labelFunction ? this.doFormat(c.toStringSafe(this._labelFunction(a, this))) : null != this._labelFunction2 ? this.doFormat(c.toStringSafe(this._labelFunction2(a, this, d))) : this.getDataField() ? this.doFormat(c.toStringSafe(c.resolveExpression(a, this.getDataField()))) : ""
    };
    a.prototype.getAdjacentColumn = function(a) {
        var d = this.level.getVisibleColumns();
        a = this.getColIndex() + a;
        return 0 < a && a < d.length ? d[a] : null
    };
    a.prototype.getStyleValue = function(a) {
        var d = this.getStyle(a);
        void 0 == d && (d = this.level.getStyleValue(a));
        return d
    };
    a.prototype.getIndex = function() {
        if (null != this.calcualtedMeasurements.getIndex) return this.calcualtedMeasurements.getIndex;
        this.calcualtedMeasurements.getIndex = this.level.getColumns().indexOf(this);
        return this.level.getColumns().indexOf(this)
    };
    a.prototype.deriveRenderer = function(b) {
        "undefined" == typeof b && (b = 5);
        b = b == flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA ? this.itemRenderer : b == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL ? a.static_UIComponent : b == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER || b == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP ? this.headerRenderer : b == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER ? this.footerRenderer : null;
        return null == b ? a.static_UIComponent : b
    };
    a.prototype.hasCustomItemRenderer = function() {
        return null != this.itemRenderer
    };
    a.prototype.dispatchEvent = function(a) {
        return a.implementsOrExtends("FlexDataGridEvent") && this.level ? this.level.dispatchEvent(a) : flexiciousNmsp.EventDispatcher.prototype.dispatchEvent.apply(this, [a])
    };
    a.prototype.getDistinctValues = function(a, d, f, e) {
        "undefined" == typeof d && (d = null);
        "undefined" == typeof f && (f = null);
        "undefined" == typeof e && (e = null);
        f = null == f ? [] : f;
        d = null == d ? [] : d;
        e = null == e ? this.level : e;
        for (var h = 0; h < a.length; h++) {
            var j = a[h];
            e.nextLevel && e.nextLevel.reusePreviousLevelColumns && this.getDistinctValues(e.getChildren(j), d, f, e.nextLevel);
            var k = null,
                l = this.itemToLabel(j);
            if (l || this.blankValuesLabel && j && j.hasOwnProperty(this.getDataField())) k = {
                label: !l ? this.blankValuesLabel : l,
                data: l
            };
            null != k && 0 > f.indexOf(l) && (d.push(k), f.push(l))
        }
        1 == e.getNestDepth() && c.sortOn(d, "label");
        return d
    };
    a.prototype.itemToLabelCommon = function(a) {
        return this.itemToLabel(a)
    };
    a.prototype.getNestedSortCompareFunction = function() {
        this.getDataField()
    };
    a.prototype.isValidStyleValue = function(a) {
        return null != a
    };
    a.prototype.defaultIconFunction = function(a, d) {
        "undefined" == typeof d && (d = "");
        if (a.rowInfo.getIsHeaderRow()) return this.getStyle("headerIcon");
        if (a.rowInfo.getIsDataRow()) {
            var f = "over" == d && this.getStyle("overIcon") ? "overIcon" : "disabled" == d && this.getStyle("disabledIcon") ? "disabledIcon" : "icon";
            return (f = this.getStyle(f)) ? f : c.resolveExpression(a.rowInfo.getData(), this.getIconField())
        }
        return null
    };
    a.prototype.defaultIconTooltipFunction = function() {
        return this.iconToolTip
    };
    a.prototype.setStyle = function(a, d) {
        this[a] = d
    };
    a.prototype.getIsLocked = function() {
        return this._columnLockMode != a.LOCK_MODE_NONE
    };
    a.prototype.getIsSortable = function() {
        return this.sortable
    };
    a.prototype.getIsFirstRightLocked = function() {
        if (null != this.calcualtedMeasurements.isFirstRightLocked) return this.calcualtedMeasurements.isFirstRightLocked;
        var a = this.level.getRightLockedColumns();
        if (0 == a.length) return !1;
        a = 0 == a.indexOf(this);
        return this.calcualtedMeasurements.isFirstRightLocked = a
    };
    a.prototype.getIsLastUnLocked = function() {
        if (null != this.calcualtedMeasurements.isLastUnLocked) return this.calcualtedMeasurements.isLastUnLocked;
        var a = this.level.getUnLockedColumns();
        if (0 == a.length) return !1;
        a = a.indexOf(this) == a.length - 1;
        return this.calcualtedMeasurements.isLastUnLocked = a
    };
    a.prototype.getFilterControl = function() {
        return this._filterControlClass
    };
    a.prototype.setFilterControl = function(a) {
        this._filterControlClass = a
    };
    a.prototype.getIsLastLeftLocked = function() {
        return this.getIsLastleftLocked()
    };
    a.prototype.getIsLastleftLocked = function() {
        if (null != this.calcualtedMeasurements.isLastleftLocked) return this.calcualtedMeasurements.isLastleftLocked;
        var a = this.level.getLeftLockedColumns();
        if (0 == a.length) return !1;
        a = a.indexOf(this) == a.length - 1;
        this.calcualtedMeasurements.isLastleftLocked = this.getIsLeftLocked() && a;
        return this.getIsLeftLocked() && a
    };
    a.prototype.getIsRightLocked = function() {
        return this._columnLockMode == a.LOCK_MODE_RIGHT
    };
    a.prototype.getX = function() {
        this.level._wxInvalid && this.level.setColumnLevel();
        return this._x
    };
    a.prototype.setX = function(a) {
        this._x != a && (this._x = a, this.level && (a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMN_X_CHANGED, this.level.grid, this.level, this), this.dispatchEvent(a)))
    };
    a.prototype.getColumnLockMode = function() {
        return this._columnLockMode
    };
    a.prototype.setColumnLockMode = function(a) {
        this._columnLockMode != a && this.level && this.level.invalidateCache();
        this._columnLockMode = a
    };
    a.prototype.getUniqueIdentifier = function() {
        return this._uniqueIdentifier ? this._uniqueIdentifier : this.getHeaderText() ? this.getHeaderText() : this.getDataField() ? this.getDataField() : "Column " + (this.getColIndex() + 1)
    };
    a.prototype.setUniqueIdentifier = function(a) {
        this._uniqueIdentifier = a
    };
    a.prototype.getSortField = function() {
        return 0 == this._sortField.length ? this.getDataField() : this._sortField
    };
    a.prototype.setSortField = function(a) {
        this._sortField = a
    };
    a.prototype.getIconField = function() {
        return this._iconField ? this._iconField : this.getDataField()
    };
    a.prototype.setIconField = function(a) {
        this._iconField = a
    };
    a.prototype.getColIndex = function() {
        if (null != this.calcualtedMeasurements.colIndex) return this.calcualtedMeasurements.colIndex;
        this.calcualtedMeasurements.colIndex = this.level.getVisibleColumns().indexOf(this);
        return this.level.getVisibleColumns().indexOf(this)
    };
    a.prototype.getOwner = function() {
        return this.level.grid
    };
    a.prototype.getWidth = function() {
        return this._width
    };
    a.prototype.setWidth = function(a) {
        this._width != a && !(a < this._minWidth) && (this._width = a, this.level && (this.level._wxInvalid = !0, this.getIsLocked() || this.headerWordWrap && this.level.grid.variableHeaderHeight ? (this.level.grid.setPreservePager(!0), this.level.grid.reDraw()) : this.level.grid.invalidateCellWidths(), this.level.grid.invalidateFiller()), a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMN_RESIZED, this.level ? this.level.grid : null, this.level, this), this.dispatchEvent(a))
    };
    a.prototype.getColumnLockMode = function() {
        return this._columnLockMode
    };
    a.prototype.setColumnLockMode = function(a) {
        this._columnLockMode != a && this.level && this.level.invalidateCache();
        this._columnLockMode = a
    };
    a.prototype.getNestDepth = function() {
        return this.level ? this.level.getNestDepth() : 1
    };
    a.prototype.getIsFirstUnLocked = function() {
        if (null != this.calcualtedMeasurements.isFirstUnLocked) return this.calcualtedMeasurements.isFirstUnLocked;
        var a = this.level.getUnLockedColumns();
        if (0 == a.length) return !1;
        a = 0 == a.indexOf(this);
        return this.calcualtedMeasurements.isFirstUnLocked = a
    };
    a.prototype.getSearchField = function() {
        return 0 == this._searchField.length ? this.getDataField() : this._searchField
    };
    a.prototype.setSearchField = function(a) {
        this._searchField = a
    };
    a.prototype.getVisible = function() {
        return this._visible
    };
    a.prototype.setVisible = function(a) {
        if (this._visible != a && (this._visible = a, this.level)) {
            for (a = 0; a < this.level._columns.length; a++) this.level._columns[a].calcualtedMeasurements = {};
            this.level.invalidateCache();
            this.level._wxInvalid = !0;
            this.level.grid.reDraw()
        }
    };
    a.prototype.getPersistenceKey = function() {
        return this.getUniqueIdentifier()
    };
    a.prototype.setPersistenceKey = function(a) {
        this._persistenceKey = a
    };
    a.prototype.getFilterRenderer = function() {
        if (null == this._filterRenderer && 0 < this._filterControlClass.length) {
            var a = eval("flexiciousNmsp." + this._filterControlClass);
            this._filterRenderer = new flexiciousNmsp.ClassFactory(a, void 0);
            "MultiSelectComboBox" == a.typeName && (this.filterOperation = flexiciousNmsp.FilterExpression.FILTER_OPERATION_TYPE_IN_LIST)
        } else null == this._filterRenderer && (this._filterRenderer = flexiciousNmsp.UIUtils.UIComponentFactory);
        return this._filterRenderer
    };
    a.prototype.setFilterRenderer = function(a) {
        this._filterRenderer = a;
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("filterRendererChanged"))
    };
    a.prototype.getDataCellRenderer = function() {
        return this._dataCellRenderer
    };
    a.prototype.setDataCellRenderer = function(a) {
        this._dataCellRenderer = a
    };
    a.prototype.getIsLeftLocked = function() {
        return this._columnLockMode == a.LOCK_MODE_LEFT
    };
    a.prototype.getEditable = function() {
        return this._editable && this.level.grid.editable
    };
    a.prototype.setEditable = function(a) {
        this._editable = a
    };
    a.prototype.getClickBehavior = function() {
        return null
    };
    a.prototype.getSortFieldName = function() {
        return this.getSortField()
    };
    a.prototype.getIsLastrightLocked = function() {
        if (null != this.calcualtedMeasurements.isLastrightLocked) return this.calcualtedMeasurements.isLastrightLocked;
        var a = this.level.getRightLockedColumns();
        if (0 == a.length) return !1;
        a = a.indexOf(this) == a.length - 1;
        this.calcualtedMeasurements.isLastrightLocked = this.getIsRightLocked() && a;
        return this.getIsRightLocked() && a
    };
    a.prototype.getHeaderText = function() {
        return null != this._headerText ? this._headerText : this.getDataField()
    };
    a.prototype.setHeaderText = function(a) {
        this._headerText = a
    };
    a.prototype.getIsElastic = function() {
        return !this.getIsRightLocked() && !this.implementsOrExtends("IFixedWidth)")
    };
    a.prototype.getLabel = function() {
        return this.getHeaderText()
    };
    a.prototype.getColumnWidthMode = function() {
        return this._columnWidthMode
    };
    a.prototype.setColumnWidthMode = function(a) {
        return this._columnWidthMode = a
    };
    a.prototype.setFooterFormatter = function(a) {
        return this.footerFormatter = a
    };
    a.prototype.getDataField = function() {
        return this.dataField
    };
    a.prototype.setDataField = function(a) {
        if ((this.dataField = a) && 0 < a.indexOf(".")) this.sortCompareFunction = this.getNestedSortCompareFunction(), this.hasComplexDisplay = !0
    };
    a.prototype.getLabelFunction = function() {
        return this._labelFunction
    };
    a.prototype.setLabelFunction = function(a) {
        this._labelFunction = a;
        this.hasComplexDisplay = !0
    };
    a.prototype.getLabelFunction2 = function() {
        return this._labelFunction2
    };
    a.prototype.setLabelFunction2 = function(a) {
        this._labelFunction2 = a;
        this.hasComplexDisplay = !0
    };
    a.prototype.getLevel = function() {
        return this.level
    };
    a.prototype.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.grid = this.level = null
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(a) {
        this.grid = null;
        this.verticalSpill = !1;
        this.rows = [];
        this._sortInfo = {};
        this._loadedItems = [];
        this.itemVerticalPositions = [];
        this._horizontalScrollPending = -1;
        this.enableHorizontalRecycling = !0;
        this._keyboardhandled = this.columnDraggingToRight = !1;
        this.lastSelectedRowIndex = -1;
        this.itemClickTimer = null;
        this.itemClickTimerDuration = 250;
        this._inEdit = !1;
        this.resizeCursorID = -1;
        this.startX = this.columnDraggingDropTargetCell = this.columnDraggingDragCell = this.columnResizingCell = null;
        this.cellsWithColSpanOrRowSpan = [];
        this.grid = a;
        flexiciousNmsp.UIComponent.apply(this, ["div"])
    };
    flexiciousNmsp.FlexDataGridContainerBase = a;
    a._levelRendererFactory = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridLevelRendererCell, void 0);
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "FlexDataGridContainerBase";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridContainerBase", "Container", "UIComponent"]
    };
    a.EVENT_HEADERCLICKED = "headerClicked";
    a.EVENT_COLUMNSRESIZED = "columnsResized";
    a.prototype.createChildren = function() {
        flexiciousNmsp.UIComponent.prototype.createChildren.apply(this, []);
        this == this.grid.getHeaderContainer() ? this.grid.addEventListener(this, d.EVENT_MOUSE_MOVE, this.onGridMouseMove) : this == this.grid.getBodyContainer() && this.grid.addEventListener(this, d.EVENT_FOCUS_CHANGE, this.onEditorKeyFocusChange)
    };
    a.prototype.onGridMouseMove = function(a) {
        -1 != this.resizeCursorID && !this.columnResizingCell && (a = this.getCellFromMouseEventTarget(a.target)) && (a.rowInfo && !a.rowInfo.getIsHeaderRow()) && this.killResize()
    };
    a.prototype.getCellFromMouseEventTarget = function(a) {
        return a ? a.implementsOrExtends("IFlexDataGridCell") ? a : a.hasOwnProperty("parent") ? this.getCellFromMouseEventTarget(a.parent) : null : null
    };
    a.prototype.removeAllComponents = function() {
        for (this._inEdit && this.endEdit(this.getEditor()); 0 < this.rows.length;) this.removeComponents(this.rows[0]);
        c.removeAllChildren(this)
    };
    a.prototype.createComponents = function() {
        this.lastSelectedRowIndex = -1;
        this.removeAllComponents(!1);
        this._sortInfo = {};
        this.grid.currentPoint.contentX = this.grid.currentPoint.leftLockedContentX = this.grid.currentPoint.rightLockedContentX = 0;
        this.grid.currentPoint.contentY = 0
    };
    a.prototype.isInVisibleHorizontalRange = function(a, d) {
        if (this.grid.getForceColumnsToFitVisibleArea() || !this.enableHorizontalRecycling) return !0;
        var c = a + d,
            e = this.grid.getBodyContainer()._visibleRangeH;
        return 0 == e.length || !(c < e[0]) && !(a > e[1])
    };
    a.prototype.removeComponent = function(a) {
        this.removeEventListeners(a);
        this.grid.currentCell == a.component && (this.grid.currentCell = null);
        a.row.removeCell(a);
        if (!(null == a.component || null == a.component.parent)) {
            c.removeChild(a.component.parent, a.component);
            var d = a.component;
            d && d.destroy();
            this.grid.rendererCache.pushInstance(a.component)
        }
    };
    a.prototype.reDraw = function() {
        this.removeAllComponents(!0);
        this.createComponents(this.grid.getColumnLevel());
        this.validateNow();
        this.snapToColumnWidths()
    };
    a.prototype.recycleH = function() {
        var a = new flexiciousNmsp.KeyValuePairCollection,
            d, c, e = this.getRowsForRecycling();
        for (d = 0; d < e.length; d++) if (c = e[d], a.addItem(c, []), c.getIsColumnBased()) for (var h = 0; h < c.cells.length; h++) {
            var j = c.cells[h],
                k = j.component;
            k && (!this.isInVisibleHorizontalRange(j.getX(), j.component.getWidth()) && !k.getIsLocked()) && !(k && 1 < k.colSpan) && a.getValue(c).push(j)
        }
        e = this.getRowsForRecycling();
        for (d = 0; d < e.length; d++) if (c = e[d], c.getIsColumnBased()) {
            h = a.getValue(c);
            for (this.processRowPositionInfo(c.rowPositionInfo, !1, c, h); 0 < h.length;) this.removeComponent(h[h.length - 1]), h.pop()
        }
        this.grid.getHasRowSpanOrColSpan() && this.snapToColumnWidths()
    };
    a.prototype.getRowsForRecycling = function() {
        return this.rows
    };
    a.prototype.processRowPositionInfo = function(a, d, c, e) {
        "undefined" == typeof d && (d = !0);
        "undefined" == typeof c && (c = null);
        "undefined" == typeof e && (e = null);
        a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER ? this.processHeaderLevel(a.getLevel(this.grid), a, d, a.rowData, flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER, c, e) : a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP ? this.processHeaderLevel(a.getLevel(this.grid), a, d, a.rowData, flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP, c, e) : a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER ? this.processHeaderLevel(a.getLevel(this.grid), a, d, a.rowData, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER, c, e) : a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER ? this.processHeaderLevel(a.getLevel(this.grid), a, d, a.rowData, flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER, c, e) : a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER ? this.processHeaderLevel(a.getLevel(this.grid), a, d, a.rowData, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER, c, e) : a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_RENDERER && this.processRendererLevel(a, d)
    };
    a.prototype.removeComponents = function(a) {
        for (; 0 < a.cells.length;) this.removeComponent(a.cells[0]);
        a.getIsFillRow() || this.rows.splice(this.rows.indexOf(a), 1);
        a.getIsFilterRow() && a.removeEventListener(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE, this.onFilterChange)
    };
    a.prototype.setCurrentCellToFirst = function() {
        var a = this.getFirstAvailableCell(null, !1);
        a && (this.grid.currentCell = a)
    };
    a.prototype.getFirstAvailableCell = function(a, d) {
        "undefined" == typeof d && (d = !0);
        if (0 < this.rows.length) {
            var c = this.rows[d ? this.rows.length - 1 : 0];
            return a && c.getIsColumnBased() && a.rowInfo.getIsColumnBased() && a.getColumn() && c.getCellForColumn(a.getColumn()) ? c.getCellForColumn(a.getColumn()).component : this.getFirstHoverableCell(c)
        }
        return null
    };
    a.prototype.getFirstHoverableCell = function(a, d, c) {
        "undefined" == typeof d && (d = !1);
        "undefined" == typeof c && (c = !1);
        if (0 < a.cells.length) for (var e = 0; e < a.cells.length; e++) {
            var h = a.cells[e].component;
            if (!d || h.implementsOrExtends("IFlexDataGridDataCell")) if ((!c || h.getColumn() && h.getColumn().getEditable()) && this.isHoverableCell(h)) return h
        }
        return null
    };
    a.prototype.isHoverableCell = function(a) {
        return (a.implementsOrExtends("IFlexDataGridDataCell") || a.implementsOrExtends("FlexDataGridHeaderCell") || a.implementsOrExtends("FlexDataGridFooterCell") || a.implementsOrExtends("FlexDataGridFilterCell") || a.implementsOrExtends("FlexDataGridPagerCell") || a.implementsOrExtends("FlexDataGridLevelRendererCell") || a.implementsOrExtends("FlexDataGridExpandCollapseCell") || a.implementsOrExtends("FlexDataGridColumnGroupCell")) && a.getEnabled() && !a.implementsOrExtends("FlexDataGridExpandCollapseHeaderCell")
    };
    a.prototype.addEventListeners = function(a) {
        if (a = a.component) a.addEventListener(this, d.EVENT_MOUSE_OVER, this.onCellMouseOver), a.addEventListener(this, d.EVENT_KEY_UP, this.onCellKeyUp, !1, -99), a.addEventListener(this, d.EVENT_CLICK, this.onCellMouseClick), a.addEventListener(this, d.EVENT_DOUBLE_CLICK, this.onCellDoubleClick), a.addEventListener(this, d.EVENT_MOUSE_OUT, this.onCellMouseOut);
        if (a.implementsOrExtends("FlexDataGridHeaderCell")) {
            a.addEventListener(this, d.EVENT_MOUSE_MOVE, this.onHeaderCellMouseMove);
            a.addEventListener(this, d.EVENT_MOUSE_OUT, this.onHeaderCellMouseOut);
            a.addEventListener(this, d.EVENT_MOUSE_DOWN, this.onHeaderCellMouseDown);
            var g = a.getColumn();
            g && g.implementsOrExtends("FlexDataGridCheckBoxColumn") && a.addEventListener(this, flexiciousNmsp.FlexDataGridEvent.SELECT_ALL_CHECKBOX_CHANGED, this.selectAllChangedHandler);
            a.addEventListener(this, d.EVENT_MOVE, this.placeSortIcon);
            a.addEventListener(this, d.EVENT_RESIZE, this.placeSortIcon)
        } else a.implementsOrExtends("FlexDataGridColumnGroupCell") && (a.addEventListener(this, d.EVENT_MOUSE_MOVE, this.onHeaderCellMouseMove), a.addEventListener(this, d.EVENT_MOUSE_OUT, this.onHeaderCellMouseOut), a.addEventListener(this, d.EVENT_MOUSE_DOWN, this.onHeaderCellMouseDown));
        this.grid.enableDrop && a && a.addEventListener(this, d.EVENT_MOUSE_MOVE, this.onCellDropMouseMove)
    };
    a.prototype.onCellMouseOver = function(a) {
        if (!this.grid.contextMenuShown) {
            var d = a.currentTarget;
            d != this.grid.currentCell && this.handleMouseOver(d, a); - 1 != this.resizeCursorID && (!d.implementsOrExtends("FlexDataGridHeaderCell") && !d.implementsOrExtends("FlexDataGridColumnGroupCell")) && (d.domElement.style.cursor = "", this.resizeCursorID = -1)
        }
    };
    a.prototype.calculateColumnDraggingDropTargetCell = function(a) {
        if (!this.grid.contextMenuShown) {
            var d = this.grid.getStyle("checkIconClass"),
                c = this.grid.getStyle("crossIconClass"),
                e = this.getCellFromMouseEventTarget(a.target);
            if (e) {
                var h = e.implementsOrExtends("FlexDataGridHeaderCell") ? e : null,
                    j = this.columnDraggingDragCell,
                    k = new flexiciousNmsp.Point(0, e.getHeight()),
                    l = e.implementsOrExtends("FlexDataGridColumnGroupCell") ? e : null,
                    m = this.columnDraggingDragCell;
                this.columnDraggingToRight = a.localX > e.getWidth() / 2;
                "rtl" == this.grid.getStyle("layoutDirection") && (this.columnDraggingToRight = !this.columnDraggingToRight);
                h && j ? this.columnDraggingDragCell && this.columnResizingGlyph && this.columnDraggingDragCell.level == h.level && this.columnDraggingDragCell.getColumn().columnGroup == h.getColumn().columnGroup ? (k = this.grid.globalToLocal(h.localToGlobal(k)), this.columnDraggingToRight && k.setX(k.getX() + h.getWidth()), this.columnResizingGlyph.move(k.getX(), k.getY()), this.columnDraggingDropTargetCell = h, this.columnResizingCellGlyph && this.columnResizingCellGlyph.colIcon.setSource(this.grid.imagesRoot + d)) : this.columnResizingCellGlyph && this.columnResizingCellGlyph.colIcon.setSource(this.grid.imagesRoot + c) : l && m ? m && this.columnResizingGlyph && m.columnGroup && m.columnGroup.parentGroup == l.columnGroup.parentGroup && m.getColumn().getColumnLockMode() == l.getColumn().getColumnLockMode() ? (k = this.grid.globalToLocal(l.localToGlobal(k)), this.columnDraggingToRight && k.setX(k.getX() + l.getWidth()), this.columnResizingGlyph.move(k.getX(), k.getY()), this.columnDraggingDropTargetCell = l, this.columnResizingCellGlyph && this.columnResizingCellGlyph.colIcon.setSource(this.grid.imagesRoot + d)) : this.columnResizingCellGlyph && this.columnResizingCellGlyph.colIcon.setSource(this.grid.imagesRoot + c) : this.columnResizingCellGlyph && this.columnResizingCellGlyph.colIcon.setSource(this.grid.imagesRoot + c)
            }
        }
    };
    a.prototype.onCellDropMouseMove = function() {};
    a.prototype.handleMouseOver = function(a, d) {
        if (this.grid.allowInteractivity && a.getEnabled() && -1 == this.resizeCursorID) {
            var f = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_ROLL_OVER, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData(), d);
            a.level.dispatchEvent(f);
            c.isMouseEvent(d) && this._keyboardhandled ? this._keyboardhandled = !1 : (this.grid.currentCell && this.highlightRow(this.grid.currentCell, this.grid.currentCell.rowInfo, !1), 0 <= d.type.toLowerCase().indexOf("key") && (this._keyboardhandled = !0), this.grid.currentCell = a, (this.grid.useRollOver || !this.grid.currentCell.rowInfo.getIsDataRow()) && this.highlightRow(this.grid.currentCell, this.grid.currentCell.rowInfo, !0))
        }
    };
    a.prototype.onCellMouseOut = function(a) {
        this.handleMouseOut(a.currentTarget, a)
    };
    a.prototype.handleMouseOut = function(a, d) {
        if (!this.grid.currentCell || this.grid.currentCell.rowInfo != a.rowInfo) {
            var c = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_ROLL_OUT, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData(), d);
            a.level.dispatchEvent(c)
        }
    };
    a.prototype.onCellMouseClick = function(a) {
        var d = a.currentTarget;
        if (d.implementsOrExtends("FlexDataGridHeaderCell")) {
            var c = d.getWidth() - 2 - a.localX <= this.grid.getColumnLevel().headerSeperatorWidth,
                e = a.localX <= this.grid.getColumnLevel().headerSeperatorWidth;
            if (c || e) return
        }
        this._inEdit && this.endEdit(this.getEditor());
        this.handleMouseClick(d, a)
    };
    a.prototype.onCellDoubleClick = function(a) {
        this.handleDoubleClick(a.currentTarget, a)
    };
    a.prototype.handleDoubleClick = function(a) {
        this.grid.allowInteractivity && a.enabled && a.implementsOrExtends("IFlexDataGridDataCell") && a.getColumn() && a.getColumn().getEditable() && this.grid.enableDoubleClickEdit && this.beginEdit(a)
    };
    a.prototype.emulateClick = function(a) {
        var g = new flexiciousNmsp.BaseEvent(d.EVENT_CLICK, !0, !1);
        this.handleMouseClick(a, g)
    };
    a.prototype.handleMouseClick = function(a, g) {
        if (this.grid.allowInteractivity && (!this.itemClickTimer || !this.itemClickTimer.running)) if (this.itemClickTimer = new flexiciousNmsp.Timer(this.itemClickTimerDuration, 1), this.itemClickTimer.addEventListener(this, d.EVENT_TIMER, this.onItemClickTimer), this.itemClickTimer.start(), !a.getEnabled() && a.getColumn() && a.getColumn().enableExpandCollapseIcon && a.rowInfo && a.rowInfo.getIsDataRow()) a.getIExpandCollapseComponent().doClick();
        else {
            var f = 0 <= g.type.toLowerCase().indexOf("key") ? g : null,
                e = c.isMouseEvent(g) ? g : null,
                e = e && e.shiftKey || f && f.shiftKey,
                h = !1;
            this.grid.currentCell = a;
            var j = a.implementsOrExtends("FlexDataGridHeaderCell") ? a : null,
                k = a.implementsOrExtends("FlexDataGridColumnGroupCell") ? a : null;
            if (j) this.onHeaderCellClicked(j, g);
            else if (a.implementsOrExtends("FlexDataGridExpandCollapseCell") || a.getColumn() && a.getColumn().enableExpandCollapseIcon && g && (g.triggerEvent && "IMG" == g.triggerEvent.target.tagName) && a.getRowInfo().getIsDataRow()) a.getIExpandCollapseComponent().doClick();
            else if (k && k.columnGroup.enableExpandCollapse) k.columnGroup.isClosed() ? k.columnGroup.openColumns() : k.columnGroup.closeColumns(), k.invalidateDisplayList();
            else if (this.grid.getIsRowSelectionMode() && a.getColumn()) {
                if (a.getColumn().enableCellClickRowSelect) {
                    if (a.implementsOrExtends("IFlexDataGridDataCell") && a.getColumn() && (!a.getColumn().getEditable() || this.grid.enableDoubleClickEdit) && a.level.checkRowSelectable(a, a.rowInfo.getData())) if (h = !a.level.isItemSelected(a.rowInfo.getData()), this.grid.isCtrlKeyDownOrSticky(g) || (h = !0, this.grid.clearSelection()), a.level.selectRow(a.rowInfo.getData(), h), this.highlightRow(a, a.rowInfo, !0, h ? a.getStyleValue("selectionColor") : a.getRolloverColor()), e && -1 < this.lastSelectedRowIndex) {
                        e = h = 0;
                        this.lastSelectedRowIndex > a.rowInfo.rowPositionInfo.getRowIndex() ? (h = a.rowInfo.rowPositionInfo.getRowIndex(), e = this.lastSelectedRowIndex) : (h = this.lastSelectedRowIndex, e = a.rowInfo.rowPositionInfo.getRowIndex());
                        for (; h <= e; h++) j = this.itemVerticalPositions[h], j.getLevel(this.grid).selectRow(j.rowData, !0, !1, !0)
                    } else e || (this.lastSelectedRowIndex = a.rowInfo.rowPositionInfo.getRowIndex());
                    this.grid.invalidateSelection()
                }
                h = !0
            } else if (a.implementsOrExtends("IFlexDataGridDataCell") && a.getColumn() && (!a.getColumn().getEditable() || this.grid.enableDoubleClickEdit) && !a.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && this.grid.getIsCellSelectionMode()) this.lastSelectedRowIndex = a.rowInfo.rowPositionInfo.getRowIndex(), e = !a.level.isCellSelected(a.rowInfo.getData(), a.getColumn()), this.grid.isCtrlKeyDownOrSticky(g) || (e = !0, this.grid.clearSelection()), a.level.selectCell(a, e), this.highlightRow(a, null, !0, e ? a.getStyleValue("selectionColor") : a.getRolloverColor()), this.grid.invalidateSelection(), h = !0;
            h && (a.rowInfo && a.rowInfo.getIsDataRow() && !a.rowInfo.getIsFillRow()) && (e = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_CLICK, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData(), g), e.isItemSelected = a.level.isItemSelected(a.rowInfo.getData()), a.level.dispatchEvent(e));
            if (a.implementsOrExtends("IFlexDataGridDataCell") && a.getColumn() && a.getColumn().getEditable() && (!this.grid.enableDoubleClickEdit || f && f.keyCode == d.KEYBOARD_F2) && (null == a.getColumn().isEditableFunction || a.getColumn().isEditableFunction(a))) this.beginEdit(a), g.preventDefault()
        }
    };
    a.prototype.onItemClickTimer = function() {
        this.itemClickTimer.stop();
        this.itemClickTimer.removeEventListener(d.EVENT_TIMER, this.onItemClickTimer);
        this.itemClickTimer = null
    };
    a.prototype.onCellKeyUp = function() {};
    a.prototype.handleArrowKey = function(a, g, c) {
        var e, h = 0 <= c.type.toLowerCase().indexOf("key") ? c : null;
        if (h.ctrlKey && h.shiftKey && g == d.KEYBOARD_DOWN || g == d.KEYBOARD_NUMPAD_MULTIPLY) this.grid.expandChildrenOf(a.rowInfo.getData(), !0, a.level);
        else if (h.ctrlKey && h.shiftKey && g == d.KEYBOARD_UP || g == d.KEYBOARD_NUMPAD_DIVIDE) this.grid.expandChildrenOf(a.rowInfo.getData(), !1, a.level);
        else if (h.ctrlKey && h.shiftKey && g == d.KEYBOARD_LEFT || g == d.KEYBOARD_NUMPAD_SUBTRACT)(a = this.getCellForRowColumn(a.rowInfo.getData(), null, !0)) && (a.getIExpandCollapseComponent() && a.getIExpandCollapseComponent().open) && a.getIExpandCollapseComponent().doClick();
        else if (h.ctrlKey && h.shiftKey && g == d.KEYBOARD_RIGHT || g == d.KEYBOARD_NUMPAD_ADD)(a = this.getCellForRowColumn(a.rowInfo.getData(), null, !0)) && (a.getIExpandCollapseComponent() && !a.getIExpandCollapseComponent().open) && a.getIExpandCollapseComponent().doClick();
        else if (g == d.KEYBOARD_UP) {
            e = this.getCellInDirection(a, d.CELL_POSITION_ABOVE, !1, !1, !0, !0);
            if (!e) return !1;
            e.rowInfo == a.rowInfo && (h = this.grid.getContainerInDirection(this.grid.getContainerName(this.grid.getContainerForCell(a)), !0)) && (e = h.getFirstAvailableCell(a));
            c && c.preventDefault()
        } else if (g == d.KEYBOARD_DOWN) {
            e = this.getCellInDirection(a, d.CELL_POSITION_BELOW, !1, !1, !0, !0);
            if (!e) return !1;
            e.rowInfo == a.rowInfo && (h = this.grid.getContainerInDirection(this.grid.getContainerName(this.grid.getContainerForCell(a)), !1)) && (e = h.getFirstAvailableCell(a, !1));
            c && c.preventDefault()
        } else g == d.KEYBOARD_LEFT || g == d.KEYBOARD_TAB && c.shiftKey ? (e = this.getCellInDirection(a, d.CELL_POSITION_LEFT, !1, !1, !0, !0), c && c.preventDefault()) : g == d.KEYBOARD_RIGHT || g == d.KEYBOARD_TAB ? (e = this.getCellInDirection(a, d.CELL_POSITION_RIGHT, !1, !1, !0, !0), c && c.preventDefault()) : g == d.KEYBOARD_PAGE_DOWN && 2 < this.rows.length ? (e = this.getFirstHoverableCell(this.rows[this.rows.length - (this.grid.getVerticalScrollPosition() == this.grid.getBodyContainer().getMaxVerticalScrollPosition() ? 1 : 2)]), e.rowInfo == a.rowInfo && (a = this.grid.getVerticalScrollPosition() == this.grid.getBodyContainer().getMaxVerticalScrollPosition(), this.grid.scrollToExistingRow(Math.min(e.rowInfo.rowPositionInfo.getVerticalPosition(), this.grid.getBodyContainer().getMaxVerticalScrollPosition()), !0), this.grid.validateNow(), this.grid.getBodyContainer().validateNow(), a || (e = this.getFirstHoverableCell(this.rows[1 < this.rows.length ? 1 : 0]))), c && c.preventDefault()) : g == d.KEYBOARD_PAGE_UP && 2 < this.rows.length ? (e = this.getFirstHoverableCell(this.rows[0 == this.grid.getVerticalScrollPosition() ? 0 : 1]), e.rowInfo == a.rowInfo && (a = 0 == this.grid.getVerticalScrollPosition(), this.grid.scrollToExistingRow(Math.max(e.rowInfo.rowPositionInfo.getVerticalPosition() - this.grid.getBodyContainer().getHeight(), 0), !1), this.grid.validateNow(), this.grid.getBodyContainer().validateNow(), !a && 2 < this.rows.length && (e = this.getFirstHoverableCell(this.rows[this.rows.length - 2]))), c && c.preventDefault()) : g == d.KEYBOARD_HOME ? (0 < this.grid.getVerticalScrollPosition() && (this.grid.scrollToExistingRow(0, !1), this.grid.validateNow()), e = this.getFirstHoverableCell(this.rows[0]), c && c.preventDefault()) : g == d.KEYBOARD_END ? (this.grid.getVerticalScrollPosition() < this.grid.getBodyContainer().getMaxVerticalScrollPosition() && (this.grid.scrollToExistingRow(this.grid.getBodyContainer().getMaxVerticalScrollPosition(), !0), this.grid.validateNow()), e = this.getFirstHoverableCell(this.rows[this.rows.length - 1]), c && c.preventDefault()) : g == d.KEYBOARD_F2 && a.getColumn().getEditable() ? this.handleMouseClick(a, c) : g == d.KEYBOARD_SPACE && this.handleMouseClick(a, c);
        return e && (this.grid.getSelectionMode() == flexiciousNmsp.NdgBase.SELECTION_MODE_SINGLE_CELL && e.implementsOrExtends("IFlexDataGridDataCell") && !this.grid.useRollOver ? this.handleMouseClick(e, c) : (this.handleMouseOver(e, c), e.implementsOrExtends("FlexDataGridFilterCell") && e.getRenderer().focus()), this.grid.getContainerForCell(e) == this.grid.getBodyContainer()) ? (c = !1, g == d.KEYBOARD_DOWN && e.rowInfo.getY() >= this.getVerticalScrollPosition() + this.getHeight() ? (this.setVerticalScrollPosition(e.rowInfo.getY() + e.rowInfo.getHeight() - this.getHeight()), c = !0) : g == d.KEYBOARD_UP && e.rowInfo.getY() <= this.getVerticalScrollPosition() && (this.setVerticalScrollPosition(e.rowInfo.getY()), c = !0), c) : !1
    };
    a.prototype.handleCellKeyUp = function(a, g, c) {
        this.grid.enableKeyboardNavigation && !this.grid.getBodyContainer().getInEdit() && (g == d.KEYBOARD_UP || g == d.KEYBOARD_DOWN || g == d.KEYBOARD_LEFT || g == d.KEYBOARD_RIGHT || g == d.KEYBOARD_TAB || g == d.KEYBOARD_PAGE_DOWN || g == d.KEYBOARD_PAGE_UP || g == d.KEYBOARD_HOME || g == d.KEYBOARD_END || g == d.KEYBOARD_NUMPAD_SUBTRACT || g == d.KEYBOARD_NUMPAD_ADD || g == d.KEYBOARD_F2 || g == d.KEYBOARD_NUMPAD_MULTIPLY ? this != this.grid.getBodyContainer() && (g == d.KEYBOARD_PAGE_DOWN || g == d.KEYBOARD_PAGE_UP || g == d.KEYBOARD_HOME || g == d.KEYBOARD_END) ? this.grid.getBodyContainer().handleCellKeyUp(this.grid.getBodyContainer().getFirstAvailableCell(null, !1), g, c) : this.handleArrowKey(a, g, c) : g == d.KEYBOARD_SPACE && this.handleSpaceBar(a, c))
    };
    a.prototype.handleSpaceBar = function(a, d) {
        this.handleMouseClick(a, d)
    };
    a.prototype.beginEdit = function(a) {
        if (a.getColumn().getEditable()) {
            var g = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_EDIT_BEGINNING, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData());
            a.getColumn().dispatchEvent(g);
            if (!g.isDefaultPrevented()) {
                this._inEdit && this.endEdit(this.getEditor());
                g = this.getEditCell();
                this.setEditCell(a);
                g && g.rowInfo.invalidateCells();
                this.getEditCell().rowInfo.invalidateCells();
                this._inEdit = !0;
                this.setEditor(this.getEditCell().getColumn().itemEditor.newInstance());
                if (this.getEditor().implementsOrExtends("ISelectFilterControl") && (g = this.getEditor().implementsOrExtends("ISelectFilterControl") ? this.getEditor() : null, this.getEditCell().getColumn().useFilterDataProviderForItemEditor)) {
                    var f = this.getEditCell().getColumn();
                    this.getEditor().setAddAllItem(!1);
                    f.filterComboBoxBuildFromGrid ? this.getEditor().setDataProvider(f.getDistinctValues(this.grid.getRootFlat())) : f.filterComboBoxDataProvider && this.getEditor().setDataProvider(f.filterComboBoxDataProvider);
                    g.labelField = f.filterComboBoxLabelField;
                    g.dataField = f.filterComboBoxDataField
                }
                this.getEditCell().attachUserClass(this.getEditCell().getColumn().getStyle("editorStyleName"));
                this.getEditCell().setText("");
                g = a.getIsLeftLocked() ? this.grid.getIsLeftLocked() : a.getIsLocked() ? this.grid.getIsRightLocked() : this;
                c.addChild(g, this.getEditor());
                this.getEditor().grid = this.grid;
                this.getEditor().automationName = this.grid.automationName + "_" + this.getEditCell().getColumn().getUniqueIdentifier() + "_editor";
                f = this.getEditor().implementsOrExtends("TextInput");
                f = this.getEditCell().placeComponent(this.getEditor(), this.getEditCell().getWidth() - (f ? 2 : 0), this.getEditCell().getHeight() - (f ? 4 : 0), !1);
                g = g.globalToLocal(this.getEditCell().localToGlobal(f));
                a.getColumn().itemEditorManagesPersistence || (this.grid.checkSetterAndApply(this.getEditor(), this.getEditCell().getColumn().editorDataField, c.resolveExpression(this.getEditCell().rowInfo.getData(), this.getEditCell().getColumn().getDataField())), this.getEditor().validateNow());
                this.getEditor().domElement.className = "editor";
                this.getEditor().move(g.getX(), g.getY());
                this.getEditor().addEventListener(this, d.EVENT_VALUE_COMMIT, this.onEditorValueCommit);
                this.getEditor().addEventListener(this, d.EVENT_KEY_DOWN, this.onEditorKeyDown);
                flexiciousNmsp.DisplayList.instance().documentComponent.addEventListener(this, d.EVENT_MOUSE_UP, this.cancelEdit, !0);
                flexiciousNmsp.DisplayList.instance().documentComponent.addEventListener(this, d.EVENT_RESIZE, this.onStageResize, !0, 0);
                this.getEditor().focus();
                this.getEditor().implementsOrExtends("TextInput") && (g = this.getEditor().getText(), 0 < g.length && this.getEditor().setSelection(g.length, g.length));
                g = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_EDIT_BEGIN, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData());
                g.itemEditor = this.getEditor();
                a.getColumn().dispatchEvent(g);
                g = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_FOCUS_IN, this.grid, a.level, a.getColumn(), a, a.rowInfo.getData());
                g.itemEditor = this.getEditor();
                this.grid.dispatchEvent(g)
            }
        }
    };
    a.prototype.refreshCells = function() {
        for (var a = 0; a < this.rows.length; a++) for (var d = this.rows[a], c = 0; c < d.cells.length; c++) {
            var e = d.cells[c].component;
            e && e.refreshCell()
        }
    };
    a.prototype.onStageResize = function() {
        this.endEdit(this.getEditor());
        flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListener(d.EVENT_RESIZE, this.onStageResize, !0, 0)
    };
    a.prototype.onEditorKeyDown = function(a) {
        if (a.keyCode == d.KEYBOARD_ESCAPE) this.cancelEdit(a);
        else if (a.keyCode == d.KEYBOARD_ENTER || a.keyCode == d.KEYBOARD_TAB) {
            var g = this.getEditCell(),
                f = c.resolveExpression(g.rowInfo.getData(), g.getColumn().getDataField()),
                e = this.grid.checkGetterAndRetrieve(this.getEditor(), g.getColumn().editorDataField);
            if (null == f && "" == e) this.endEdit(this.getEditor());
            else if (f != e) if (this.populateValue(a)) this.endEdit(this.getEditor());
            else return;
            else this.endEdit(this.getEditor());
            g.refreshCell();
            var h;
            a.keyCode == d.KEYBOARD_ENTER && (h = this.getCellInDirection(g, d.CELL_POSITION_BELOW, !0, !0));
            if (a.keyCode == d.KEYBOARD_TAB && (f = g.rowInfo, e = g.getColumn(), h = this.getCellInDirection(g, a.shiftKey ? d.CELL_POSITION_LEFT : d.CELL_POSITION_RIGHT, !0, !0), !h || h == g))(g = this.getCellForRowColumn(f.getData(), e)) || (g = this.getCellForRowColumn(f.getData(), null, !0)), h = this.getCellInDirection(g, a.shiftKey ? d.CELL_POSITION_ABOVE_LAST : d.CELL_POSITION_BELOW_FIRST, !0, !0);
            h && (g = new flexiciousNmsp.CellInfo(h.rowInfo.getData(), h.getColumn()), h && (!h.getIsLocked() && !this.grid.getForceColumnsToFitVisibleArea()) && (f = new flexiciousNmsp.Point(0, 0), f = h.localToGlobal(f), f = this.globalToLocal(f), h = 0, h = f.getX(), (h > this.getHorizontalScrollPosition() + this.getWidth() || h < this.getHorizontalScrollPosition()) && this.grid.gotoHorizontalPosition(Math.min(h, this.grid.getMaxHorizontalScrollPosition()))), h = this.getCellForRowColumn(g.rowData, g.getColumn()), g = h.implementsOrExtends("IFlexDataGridDataCell") && h.getColumn() && h.getColumn().getEditable(), this.grid.enableDoubleClickEdit ? g && (this.beginEdit(h), a.preventDefault()) : g ? (a.preventDefault(), this.beginEdit(h)) : this.handleMouseClick(h, a))
        }
    };
    a.prototype.doInvalidate = function() {
        this.invalidateDisplayList()
    };
    a.prototype.invalidateDisplayList = function() {
        flexiciousNmsp.UIComponent.prototype.invalidateDisplayList.apply(this, [])
    };
    a.prototype.gotoHorizontalPosition = function(a) {
        if (null == this.grid.getDataProvider()) this._horizontalScrollPending = a, this.doInvalidate();
        else if (this.getHorizontalScrollPosition() != a) {
            var d = this.getHorizontalScrollPosition() < a;
            this.horizontalScrollPosition = a;
            this.recycleH(this.grid.getColumnLevel(), d);
            this.grid.synchronizeHorizontalScroll()
        }
    };
    a.prototype.scrollToExistingRow = function() {};
    a.prototype.isOutOfVisibleArea = function() {
        return !1
    };
    a.prototype.endEdit = function(a) {
        if (this._inEdit) {
            this._inEdit = !1;
            var g = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_EDIT_END, this.grid, this.getEditCell().level, this.getEditCell().getColumn(), this.getEditCell(), this.getEditCell().rowInfo.getData());
            g.itemEditor = this.getEditor();
            this.getEditCell().getColumn().dispatchEvent(g);
            this.getEditCell().refreshCell();
            this.grid.highlightRow(this.getEditCell(), this.getEditCell().rowInfo, !1);
            this.grid.invalidateCells();
            this.grid.currentCell = null;
            this.setEditCell(null);
            flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListener(d.EVENT_MOUSE_UP, this.cancelEdit, !0);
            this.getEditor().removeEventListener(d.EVENT_VALUE_COMMIT, this.onEditorValueCommit);
            this.getEditor().removeEventListener(d.EVENT_KEY_DOWN, this.onEditorKeyDown);
            a.kill()
        }
    };
    a.prototype.onEditorKeyFocusChange = function(a) {
        a.preventDefault()
    };
    a.prototype.cancelEdit = function(a) {
        if (!(c.isMouseEvent(a) && (this.owns(a.target) || this.getEditor() && this.getEditor().owns(a.triggerEvent.target)) && (!a.target.implementsOrExtends("IFlexDataGridCell") || !a.target.rowInfo.getIsFillRow()) || c.isMouseEvent(a) && a && !flexiciousNmsp.DisplayList.isMouseDown)) {
            var d = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_EDIT_CANCEL, this.grid, this.getEditCell().level, this.getEditCell().getColumn(), this.getEditCell(), this.getEditCell().rowInfo.getData(), a);
            d.itemEditor = a.target;
            this.getEditCell().getColumn().dispatchEvent(d);
            d.isDefaultPrevented() || this.endEdit(this.getEditor())
        }
    };
    a.prototype.onEditorValueCommit = function(a) {
        this.getEditCell().getColumn().itemEditorApplyOnValueCommit && this.populateValue(a)
    };
    a.prototype.populateValue = function(a) {
        var d = this.getEditCell();
        if (d.getColumn().itemEditorManagesPersistence) return !0;
        var f = new flexiciousNmsp.FlexDataGridItemEditEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_EDIT_VALUE_COMMIT, this.grid, d.level, d.getColumn(), d, d.rowInfo.getData(), a);
        f.itemEditor = a.currentTarget;
        f.item = this.getEditCell().rowInfo.getData();
        f.newValue = this.grid.checkGetterAndRetrieve(this.getEditor(), d.getColumn().editorDataField);
        d.getColumn().dispatchEvent(f);
        if (f.isDefaultPrevented()) return !1;
        if (null == d.getColumn().itemEditorValidatorFunction || d.getColumn().itemEditorValidatorFunction(this.getEditor())) this.grid.enableTrackChanges && this.grid.trackChange(d.rowInfo.getData(), flexiciousNmsp.ChangeInfo.CHANGE_TYPE_UPDATE, d.level, d.getColumn().getDataField(), c.resolveExpression(d.rowInfo.getData(), d.getColumn().getDataField()), f.newValue), c.resolveExpression(d.rowInfo.getData(), d.getColumn().getDataField(), this.grid.checkGetterAndRetrieve(this.getEditor(), d.getColumn().editorDataField), !1, !0, this.grid), d.refreshCell();
        else if (null != d.getColumn().itemEditorValidatorFunction) return !1;
        return !0
    };
    a.prototype.invalidateCells = function() {
        for (var a = this.getAllRows(), d = 0; d < a.length; d++) for (var c = a[d], e = 0; e < c.cells.length; e++) {
            var h = c.cells[e];
            h.component.implementsOrExtends("IFlexDataGridCell") && h.component.invalidateBackground()
        }
    };
    a.prototype.getAllRows = function() {
        return this.rows
    };
    a.prototype.highlightRow = function(a, d, c, e) {
        "undefined" == typeof e && (e = 0);
        this.grid.highlightRow(a, d, c, e)
    };
    a.prototype.getCellInDirection = function(a, g, c, e, h, j) {
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof e && (e = !1);
        "undefined" == typeof h && (h = !0);
        "undefined" == typeof j && (j = !1);
        var k, l, m, n = a.rowInfo;
        l = n.getInnerCells();
        l.sort(function(a, b) {
            return a.getPerceivedX() - b.getPerceivedX()
        });
        l.indexOf(a);
        var p = g == d.CELL_POSITION_ABOVE || g == d.CELL_POSITION_ABOVE_LAST,
            q = g == d.CELL_POSITION_LEFT,
            s = g == d.CELL_POSITION_ABOVE || g == d.CELL_POSITION_BELOW || g == d.CELL_POSITION_BELOW_FIRST || g == d.CELL_POSITION_ABOVE_LAST,
            r;
        if (g == d.CELL_POSITION_LEFT || g == d.CELL_POSITION_RIGHT) m = a.rowInfo;
        else for (l = 0; l < this.rows.length; l++) if (k = this.rows[l], m || (m = p ? k : this.rows[this.rows.length - 1]), p && k != n && k.getY() > m.getY() && k.getY() < n.getY() && (!c || k.getIsDataRow())) m = k;
        else if (!p && k != n && k.getY() < m.getY() && k.getY() > n.getY() && (!c || k.getIsDataRow())) m = k;
        g == d.CELL_POSITION_ABOVE_LAST && !this.grid.getForceColumnsToFitVisibleArea() && h ? this.grid.gotoHorizontalPosition(this.grid.getMaxHorizontalScrollPosition()) : g == d.CELL_POSITION_BELOW_FIRST && (!this.grid.getForceColumnsToFitVisibleArea() && h) && this.grid.gotoHorizontalPosition(0);
        h && (s && this.isOutOfVisibleArea(m)) && (p ? this.scrollToExistingRow(Math.max(0, this.getVerticalScrollPosition() - m.getHeight()), !1) : this.scrollToExistingRow(Math.min(this.getMaxVerticalScrollPosition(), this.getVerticalScrollPosition() + m.getHeight()), !0));
        k = m.cells.slice();
        k.sort(function(a, b) {
            return a.getPerceivedX() - b.getPerceivedX()
        });
        (g == d.CELL_POSITION_ABOVE_LAST || g == d.CELL_POSITION_RIGHT) && k.reverse();
        if (g == d.CELL_POSITION_ABOVE || g == d.CELL_POSITION_BELOW) return n.getIsColumnBased() && m.getIsColumnBased() && a.getColumn() && m.getCellForColumn(a.getColumn()) ? this.checkRowSpanColSpan(m.getCellForColumn(a.getColumn()).component, a, g, c, e, h, j) : this.checkRowSpanColSpan(this.getFirstHoverableCell(m, c, e), a, g, c, e, h, j);
        for (l = 0; l < k.length; l++) if (m = k[l].component, !j || this.isHoverableCell(m)) if (!c || m.implementsOrExtends("IFlexDataGridDataCell")) if (!e || m.getColumn() && m.getColumn().getEditable()) {
            if (g == d.CELL_POSITION_BELOW_FIRST || g == d.CELL_POSITION_ABOVE_LAST) return this.checkRowSpanColSpan(m, a, g, c, e, h, j);
            if (g == d.CELL_POSITION_LEFT || g == d.CELL_POSITION_RIGHT) g == d.CELL_POSITION_LEFT ? m.getPerceivedX() < a.getPerceivedX() && (r = m) : m.getPerceivedX() > a.getPerceivedX() && (r = m);
            else throw Error("Invalid cell direction" + g);
        }
        n = new flexiciousNmsp.CellInfo(a.rowInfo.getData(), a.getColumn());
        m = null;
        if (h && !this.grid.getForceColumnsToFitVisibleArea() && (!q && this.grid.getHorizontalScrollPosition() < this.grid.getMaxHorizontalScrollPosition() || q && 0 < this.grid.getHorizontalScrollPosition())) {
            if (r) {
                if (a.getIsLeftLocked() && !r.getIsLocked() && !q || a.getIsRightLocked() && !r.getIsLocked() && q) return this.checkRowSpanColSpan(r, a, g, c, e, h, j);
                if (a.parent == r.parent) {
                    if (r.parent == this.grid.getBodyContainer() && (l = r.rowInfo.getData(), q = r.getColumn(), l && q && !this.grid.getForceColumnsToFitVisibleArea())) {
                        if (r.getX() + r.getWidth() >= this.getHorizontalScrollPosition() && r.getX() < this.getHorizontalScrollPosition()) return this.grid.gotoHorizontalPosition(r.getX()), this.checkRowSpanColSpan(this.getCellForRowColumn(l, q), a, g, c, e, h, j);
                        if (r.getX() + r.getWidth() > this.getHorizontalScrollPosition() + this.getWidth() && r.getX() < this.getHorizontalScrollPosition() + this.getWidth()) return this.grid.gotoHorizontalPosition(Math.min(this.getHorizontalScrollPosition() + r.getWidth(), this.grid.getMaxHorizontalScrollPosition())), this.checkRowSpanColSpan(this.getCellForRowColumn(l, q), a, g, c, e, h, j)
                    }
                    return this.checkRowSpanColSpan(r, a, g, c, e, h, j)
                }
                m = r
            }
            this.grid.gotoHorizontalPosition(!q ? Math.min(this.grid.getHorizontalScrollPosition() + a.getWidth(), this.grid.getMaxHorizontalScrollPosition()) : Math.max(this.grid.getHorizontalScrollPosition() - a.getWidth(), 0));
            r = n.getColumn() ? n.getColumn().getAdjacentColumn(q ? -1 : 1) : null;
            if (!r) return this.checkRowSpanColSpan(m, a, g, c, e, h, j);
            a = this.getCellForRowColumn(n.rowData, r);
            if (null == a) {
                k = r.level.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]);
                q && (k = k.reverse());
                for (l = 0; l < k.length; l++) if (p = k[l], p.getColIndex() < r.getColIndex && q || p.getColIndex > r.getColIndex && !q) if (p = this.getCellForRowColumn(n.rowData, p)) {
                    a = p;
                    break
                }
            }
            r = (l = this.getCellInDirection(a, g, c, e, h)) ? l : m
        }
        return this.checkRowSpanColSpan(r, a, g, c, e, h, j)
    };
    a.prototype.checkRowSpanColSpan = function(a, d, c, e, h, j, k) {
        return this.grid.getHasRowSpanOrColSpan() ? a == d ? a : a && this.isCoveredByRowSpanOrColspan(a) ? this.getCellInDirection(a, c, e, h, j, k) : a : a
    };
    a.prototype.isCoveredByRowSpanOrColspan = function(a) {
        return this.isCoveredByRowSpan(a) || this.isCoveredByColSpan(a)
    };
    a.prototype.isCoveredByRowSpan = function(a) {
        if (!this.grid.getHasRowSpanOrColSpan()) return !1;
        for (var d = 0; d < this.rows.length; d++) {
            var c = this.rows[d];
            if (c.rowPositionInfo.getVerticalPosition() < a.rowInfo.rowPositionInfo.getVerticalPosition()) {
                var e = c.getMaxCellHeight(a.getColumn());
                if (e > c.getHeight() && e + c.rowPositionInfo.getVerticalPosition() > a.rowInfo.rowPositionInfo.getVerticalPosition()) return !0
            } else break
        }
        return !1
    };
    a.prototype.isCoveredByColSpan = function(a) {
        if (!this.grid.getHasRowSpanOrColSpan()) return !1;
        for (var d = 0; d < a.rowInfo.cells.length; d++) {
            var c = a.rowInfo.cells[d].component;
            if (c.getPerceivedX() > a.getPerceivedX()) break;
            if (c && (c.getColumn() && c.getWidth() > c.getColumn().getWidth()) && c.getPerceivedX() + c.getWidth() > a.getPerceivedX()) return !0
        }
        return !1
    };
    a.prototype.getCellForRowColumn = function(a, d, c) {
        "undefined" == typeof c && (c = !1);
        for (var e = 0; e < this.rows.length; e++) {
            var h = this.rows[e];
            if (h.rowPositionInfo.rowData == a) for (var j = 0; j < h.cells.length; j++) {
                var k = h.cells[j].component;
                if (c && k.getIsExpandCollapseCell() || k && k.getColumn() == d && null != d || null == d && !k.getIsLocked() && k.implementsOrExtends("IFlexDataGridDataCell")) return k
            }
        }
        return null
    };
    a.prototype.removeEventListeners = function(a) {
        a = a.component;
        if (a.implementsOrExtends("FlexDataGridPagerCell")) {
            var g = a.getRenderer();
            1 == g.level.getNestDepth() ? g.removeEventListener(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE, this.rootPageChange) : g.removeEventListener(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE, this.onPageChange)
        }
        a.implementsOrExtends("FlexDataGridHeaderCell") && (a.removeEventListener(d.EVENT_MOUSE_MOVE, this.onHeaderCellMouseMove), a.removeEventListener(d.EVENT_MOUSE_OUT, this.onHeaderCellMouseOut), a.removeEventListener(d.EVENT_MOUSE_DOWN, this.onHeaderCellMouseDown), a.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && a.removeEventListener(flexiciousNmsp.FlexDataGridEvent.SELECT_ALL_CHECKBOX_CHANGED, this.selectAllChangedHandler), a.removeEventListener(d.EVENT_MOVE, this.placeSortIcon), a.removeEventListener(d.EVENT_RESIZE, this.placeSortIcon));
        a.implementsOrExtends("FlexDataGridColumnGroupCell") && (a.removeEventListener(d.EVENT_MOUSE_MOVE, this.onHeaderCellMouseMove), a.removeEventListener(d.EVENT_MOUSE_OUT, this.onHeaderCellMouseOut), a.removeEventListener(d.EVENT_MOUSE_DOWN, this.onHeaderCellMouseDown));
        a.implementsOrExtends("FlexDataGridFilterCell") && a.getRenderer().implementsOrExtends("IFilterControl") && a.rowInfo.unRegisterIFilterControl(a.getRenderer());
        this.grid.enableDrop && a && a.removeEventListener(d.EVENT_MOUSE_MOVE, this.onCellDropMouseMove);
        a.removeEventListener(d.EVENT_MOUSE_OVER, this.onCellMouseOver);
        a.removeEventListener(d.EVENT_KEY_UP, this.onCellKeyUp);
        a.removeEventListener(d.EVENT_CLICK, this.onCellMouseClick);
        a.removeEventListener(d.EVENT_DOUBLE_CLICK, this.onCellDoubleClick);
        a.removeEventListener(d.EVENT_MOUSE_OUT, this.onCellMouseOut)
    };
    a.prototype.addRow = function(a, d, c) {
        var e = new flexiciousNmsp.RowInfo(a, this.implementsOrExtends("FlexDataGridBodyContainer") ? c.getVerticalPosition() : this.grid.currentPoint.contentY, this.grid);
        e.rowPositionInfo = c;
        this.grid.currentPoint.contentY += a;
        this.grid.currentPoint.contentX = this.grid.currentPoint.leftLockedContentX = this.grid.currentPoint.rightLockedContentX = 0;
        if (!e.getIsFillRow()) {
            if (d) this.rows.push(e);
            else {
                for (a = 0; a < this.rows.length && e.getY() > this.rows[a].getY();) a++;
                this.rows.splice(a, 0, e)
            }
            e.getIsFilterRow() && e.addEventListener(this, flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE, this.onFilterChange)
        }
        return e
    };
    a.prototype.getBorderWidth = function() {
        return 0
    };
    a.prototype.getBorderHeight = function() {
        return 0
    };
    a.prototype.addCell = function(a, d, f) {
        "undefined" == typeof f && (f = null);
        var e = new flexiciousNmsp.ComponentAdditionResult,
            h = f;
        if (a.implementsOrExtends("IFlexDataGridCell")) if (a.getIsLeftLocked()) {
            var j = 0;
            if (a.getIsContentArea()) h = this.addToSection(a, d, "left", f);
            else if (a.rowInfo.getIsFooterRow() || a.rowInfo.getIsPagerRow()) {
                f || (c.addChild(this.grid.getLeftLockedFooter(), a), h = d.addCell(a, this.grid.currentPoint.leftLockedFooterX));
                h.setX(this.grid.currentPoint.leftLockedFooterX);
                if (a.getColumn() && a.getColumn().getIsLastLeftLocked() || 1 == a.level.getNestDepth() && 0 == a.level.getLeftLockedColumns().length) j = this.grid.getLeftLockedContent().getWidth() - this.grid.currentPoint.leftLockedFooterX, a.setActualSize(j - this.getBorderWidth(a), a.getHeight() - this.getBorderHeight(a));
                this.grid.currentPoint.leftLockedFooterX += a.getWidth();
                a.setY(this.grid.currentPoint.leftLockedFooterY);
                h.inCornerAreas = !0
            } else if (a.rowInfo.getIsHeaderRow() || a.rowInfo.getIsFilterRow() || a.rowInfo.getIsColumnGroupRow()) {
                f || (c.addChild(this.grid.getLeftLockedHeader(), a), h = d.addCell(a, this.grid.currentPoint.leftLockedHeaderX));
                h.setX(this.grid.currentPoint.leftLockedHeaderX);
                if (a.getColumn() && a.getColumn().getIsLastLeftLocked() || 1 == a.level.getNestDepth() && 0 == a.level.getLeftLockedColumns().length) j = this.grid.getLeftLockedContent().getWidth() - this.grid.currentPoint.leftLockedHeaderX, a.setActualSize(j - this.getBorderWidth(a), a.getHeight() - this.getBorderHeight(a));
                this.grid.currentPoint.leftLockedHeaderX += a.getWidth();
                a.setY(this.grid.currentPoint.leftLockedHeaderY);
                h.inCornerAreas = !0
            }
        } else if (a.getIsRightLocked()) if (a.getIsContentArea()) h = this.addToSection(a, d, "right");
        else if (a.rowInfo.getIsFooterRow() || a.rowInfo.getIsPagerRow()) f || (c.addChild(this.grid.getRightLockedFooter(), a), h = d.addCell(a, this.grid.currentPoint.rightLockedFooterX)), h.setX(this.grid.currentPoint.rightLockedFooterX), a.getColumn() && a.getColumn().getIsLastrightLocked() && (j = this.grid.getRightLockedContent().getWidth() - this.grid.currentPoint.rightLockedFooterX, a.setActualSize(j - this.getBorderWidth(a), a.getHeight() - this.getBorderHeight(a))), this.grid.currentPoint.rightLockedFooterX += a.getWidth(), a.setY(this.grid.currentPoint.rightLockedFooterY), h.inCornerAreas = !0;
        else {
            if (a.rowInfo.getIsHeaderRow() || a.rowInfo.getIsFilterRow() || a.rowInfo.getIsColumnGroupRow()) f || (c.addChild(this.grid.getRightLockedHeader(), a), h = d.addCell(a, this.grid.currentPoint.rightLockedHeaderX)), h.setX(this.grid.currentPoint.rightLockedHeaderX), a.getColumn() && a.getColumn().getIsLastrightLocked() && (j = this.grid.getRightLockedContent().getWidth() - this.grid.currentPoint.rightLockedHeaderX, a.setActualSize(j - this.getBorderWidth(a), a.getHeight() - this.getBorderHeight(a))), this.grid.currentPoint.rightLockedHeaderX += a.getWidth(), a.setY(this.grid.currentPoint.rightLockedHeaderY), h.inCornerAreas = !0
        } else f || (c.addChild(this, a), h = d.addCell(a, this.grid.currentPoint.contentX)), h.setX(this.grid.currentPoint.contentX), this.grid.currentPoint.contentX += a.getWidth();
        else f || (c.addChild(this, a), h = d.addCell(a, this.grid.currentPoint.contentX)), h.setX(this.grid.currentPoint.contentX), this.grid.currentPoint.contentX += a.getWidth();
        e.componentInfo = h;
        h.component.implementsOrExtends("IFlexDataGridCell") && (h.component.componentInfo = h);
        e.horizontalSpill = this.grid.currentPoint.contentX > this.getWidth();
        e.verticalSpill = this.grid.currentPoint.contentY > this.getHeight() + 1;
        return e
    };
    a.prototype.addToSection = function(a, d, f, e) {
        "undefined" == typeof e && (e = null);
        var h = 0;
        e || c.addChild(this.grid["get" + c.doCap(f) + "LockedContent"](), a);
        h = a.rowInfo.getIsRendererRow() || a.rowInfo.getIsPagerRow() || (0 < a.rowInfo.cells.length || 1 == a.level.getNestDepth()) && 0 == a.level["get" + c.doCap(f) + "LockedColumns"]().length || a.getColumn() && a.getColumn()["getIsLast" + f + "Locked"]();
        d = e ? e : d.addCell(a, this.grid.currentPoint[f + "LockedContentX"]);
        d.setX(this.grid.currentPoint[f + "LockedContentX"]);
        h && (h = this.grid["get" + c.doCap(f) + "LockedContent"]().getWidth() - this.grid.currentPoint[f + "LockedContentX"], a.setActualSize(h - this.getBorderWidth(a), a.getHeight() - this.getBorderHeight(a)));
        this.grid.currentPoint[f + "LockedContentX"] += a.getWidth();
        return d
    };
    a.prototype.findLoadingInfo = function(a, d, c) {
        "undefined" == typeof c && (c = !1);
        for (var e = 0; e < this._loadedItems.length; e++) {
            var h = this._loadedItems[e];
            if (h.isEqual(a, d, c)) return h
        }
        return null
    };
    a.prototype.processRendererLevel = function(b, d) {
        "undefined" == typeof d && (d = !1);
        var c = b.getLevel(this.grid),
            e = c.getStyleValue("horizontalGridLines") ? 1 : 0,
            h = this.addRow(c.levelRendererHeight, d, b);
        h.paddingExists() || this.addPadding(c.getNestDepth(), h, c.levelRendererHeight - e, c);
        e = this.grid.rendererCache.popInstance(a._levelRendererFactory);
        e.setRendererFactory(c.nextLevelRenderer);
        e.level = c;
        e.rowInfo = h;
        this.addEventListeners(this.addCell(e, h).componentInfo);
        e.refreshCell();
        e.setActualSize(b.getLevel(this.grid).getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]) - this.getBorderWidth(e), c.levelRendererHeight - this.getBorderHeight(e));
        this.grid.placeComponents(h);
        return !0
    };
    a.prototype.placeComponents = function() {
        for (var a = 0; a < this.rows.length; a++) this.grid.placeComponents(this.rows[a])
    };
    a.prototype.processHeaderLevel = function(a, c, f, e, h, j, k) {
        a.getStyleValue("horizontalGridLines");
        var l = a.getRowHeightFromType(h);
        j ? (this.grid.currentPoint.contentX = this.grid.currentPoint.rightLockedContentX = this.grid.currentPoint.leftLockedContentX = 0, f = j) : f = this.addRow(l, f, c);
        var m = c ? c.getRowNestlevel() : 0;
        if (this.grid.enableDefaultDisclosureIcon && ((this.isInVisibleHorizontalRange(this.grid.currentPoint.contentX, a.nestIndent * (m - 1)) || this.grid.lockDisclosureCell) && (!j || !f.paddingExists()) ? this.addPadding(c.getRowNestlevel(), f, l, a) : this.grid.lockDisclosureCell || (this.grid.currentPoint.contentX += a.nestIndent * (m - 1)), !f.getIsPagerRow() && (a.nextLevel || a.nextLevelRenderer)))(this.isInVisibleHorizontalRange(this.grid.currentPoint.contentX, a.nestIndent) || this.grid.lockDisclosureCell) && (!j || !f.disclosureExists()) ? f.getIsColumnGroupRow() || (c = this.grid.rendererCache.popInstance(a.expandCollapseHeaderCellRenderer), c.rowInfo = f, c.level = a, c.setActualSize(a.getMaxDisclosureCellWidth() - this.getBorderWidth(c), (1 < a.getMaxColumnGroupDepth() && h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER ? this.grid.getHeaderContainer().getHeight() : l) - this.getBorderHeight(c)), this.addEventListeners(this.addCell(c, f).componentInfo)) : this.grid.lockDisclosureCell || (this.grid.currentPoint.contentX += a.getMaxDisclosureCellWidth());
        if (h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER) e = this.grid.rendererCache.popInstance(a.pagerCellRenderer, a.getPagerRenderer()), e.setRendererFactory(a.getPagerRenderer()), e.level = a, e.rowInfo = f, j = e.getRenderer(), j.grid = null, j.grid = this.grid, k = 1 == a.getNestDepth() ? this.getPagerWidth() : a.getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]), this.grid.getStyle("pagerStyleName") && e.attachUserClass(this.grid.getStyle("pagerStyleName")), e.setActualSize(k - this.getBorderWidth(e), l - this.getBorderHeight(e)), e.invalidateDisplayList(), 1 == a.getNestDepth() && e.setVisible(0 < this.grid.getPagerRowHeight()), this.addEventListeners(this.addCell(e, f).componentInfo), j.rowInfo = f, j.level = a, e.refreshCell(), 1 == a.getNestDepth() ? j.addEventListener(this, flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE, this.rootPageChange) : j.addEventListener(this, flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE, this.onPageChange);
        else {
            c = a.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE, flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT]);
            var n;
            h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER && (n = 1 == a.getNestDepth() ? this.grid.getRootFlat() : a.getChildren(e));
            if (h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP) {
                h = f.getColumnGroupDepth(this.grid);
                h = a.getColumnGroupsAtLevel(h);
                for (n = 0; n < h.length; n++) if (c = h[n], m = c.getWX(), c.getStartColumn() && (this.isInVisibleHorizontalRange(m[1], m[0]) || c.getStartColumn().getIsLocked()) && (!j || !f.columnGroupCellExists(c))) m = this.processColumnGroupCell(a, c.columnGroupCellRenderer, f, e, l, c, k), m.setText(c.getHeaderText()), m.refreshCell()
            } else {
                for (m = this.grid.currentPoint.headerX = 0; m < c.length; m++) {
                    var p = c[m];
                    p.getWidth() || p.setWidth(100);
                    (this.isInVisibleHorizontalRange(this.grid.currentPoint.headerX, p.getWidth()) || p.getIsLocked()) && (!j || !f.columnCellExists(p)) ? h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER ? this.processHeaderCell(a, c, m, f, e, l, k) : h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER ? this.processFilterCell(a, c, m, f, e, n, k) : this.processFooterCell(a, c, m, f, e, k) : p.getIsLocked() || (this.grid.currentPoint.contentX += p.getWidth());
                    p.getIsLocked() || (this.grid.currentPoint.headerX += p.getWidth())
                }
                1 == a.getNestDepth() && (this.grid.getForceColumnsToFitVisibleArea() || this.getWidth() >= a.getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]) || 0 < this.getMaxHorizontalScrollPosition() && 20 > this.getMaxHorizontalScrollPosition() - this.getHorizontalScrollPosition()) && !f.scrollbarPadExists() && this.addPadding(2, f, this.getHeight(), a, !1, !0, d.VERTICAL_SCROLLBAR_WIDTH);
                c = a.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT]);
                for (var q = 0, m = 0; m < c.length; m++) {
                    p = c[m];
                    this.grid.currentPoint.contentX = this.getWidth() - q - p.getWidth() + 1;
                    if (!j || !f.columnCellExists(p)) h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER ? this.processHeaderCell(a, c, m, f, e, l, k) : h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER ? this.processFilterCell(a, c, m, f, e, n, k) : this.processFooterCell(a, c, m, f, e, k);
                    q += p.getWidth()
                }
            }
        }
        this.grid.placeComponents(f);
        return !0
    };
    a.prototype.getPagerWidth = function() {
        var a = this.grid.getStyle("borderThickness");
        return this.grid.getWidth() - (this.grid.hasBorderSide("left") ? a : 0) - (this.grid.hasBorderSide("right") ? a : 0)
    };
    a.prototype.initializeRendererFromColumn = function(a, d) {
        if (a.implementsOrExtends("IFilterControl")) {
            var c = a.implementsOrExtends("TextInput") ? a : null;
            c && (d.hasOwnProperty("filterWaterMark") && (c.watermark = d.filterWaterMark), d.getStyle("filterIcon") && c.setStyle("insideIcon", d.getStyle("filterIcon")), d.hasOwnProperty("clearFilterOnIconClick") && (c.clearTextOnIconClick = d.clearFilterOnIconClick), d.hasOwnProperty("enableFilterAutoComplete") && d.enableFilterAutoComplete && (c.enableAutoComplete = !0), d.hasOwnProperty("showClearIconWhenHasText") && (c.showIconWhenHasText = d.showClearIconWhenHasText));
            if (c = a.implementsOrExtends("MultiSelectComboBox") ? a : null) d.hasOwnProperty("filterWaterMark") && (c.searchBoxWatermark = d.filterWaterMark), d.getStyle("filterIcon") && c.setStyle("filterIcon", d.getStyle("filterIcon"));
            a.grid = d.getOwner();
            a.searchField = d.getSearchField();
            a.filterOperation = d.filterOperation;
            a.filterTriggerEvent = d.filterTriggerEvent;
            d.filterComparisionType != flexiciousNmsp.FilterExpression.FILTER_COMPARISION_TYPE_AUTO && (a.filterComparisionType = d.filterComparisionType);
            a.gridColumn = d
        }
        c = a.implementsOrExtends("ISelectFilterControl") ? a : null;
        null != c && (null != d.filterComboBoxDataProvider && c.setDataProvider(d.filterComboBoxDataProvider), "data" != d.filterComboBoxDataField && (c.dataField = d.filterComboBoxDataField), "label" != d.filterComboBoxLabelField && (c.labelField = d.filterComboBoxLabelField), c.setAddAllItem(!0), d.filterComboBoxWidth && (c.dropdownWidth = d.filterComboBoxWidth));
        c = a.implementsOrExtends("ITriStateCheckBoxFilterControl") ? a : null;
        null != c && (c.allowUserToSelectMiddle = !0, c.setSelectedState("middle"));
        if ((c = a.implementsOrExtends("IDateComboBox") ? a : null) && 0 < d.filterDateRangeOptions.length) c.dateRangeOptions = d.filterDateRangeOptions;
        a.invalidateDisplayList()
    };
    a.prototype.processFilterCell = function(a, d, c, e, h, j) {
        a.getStyleValue("horizontalGridLines");
        d = d[c];
        c = a.getFilterRowHeight();
        var k = this.grid.rendererCache.popInstance(d.filterCellRenderer, d.getFilterRenderer());
        k.setRendererFactory(d.getFilterRenderer());
        k.rowInfo = e;
        k.level = a;
        k.setColumn(d);
        k.setActualSize(d.getWidth() - this.getBorderWidth(k), c - this.getBorderHeight(k));
        this.addEventListeners(this.addCell(k, e).componentInfo);
        k.setActualSize(d.getWidth() - this.getBorderWidth(k), c - this.getBorderHeight(k));
        1 == a.getNestDepth() && k.setVisible(0 < a.getFilterRowHeight());
        k.attachUserClass(d.getStyleValue("filterStyleName"));
        if ((c = k.getRenderer()) && c.implementsOrExtends("IFilterControl")) this.initializeRendererFromColumn(c, d), this.initializeFilterRenderer(c, d, h, j, a), e.registerIFilterControl(c)
    };
    a.prototype.initializeFilterRenderer = function(a, c, f, e, h) {
        if (null != a) if (c.filterComboBoxBuildFromGrid) this.buildFilter(a, c, 1 == h.getNestDepth() ? null : f, e);
        else if (c.filterComboBoxDataProvider && (a.setDataProvider(c.filterComboBoxDataProvider), l)) for (var j = 0; j < l.filterExpressions.length; j++) {
            var k = l.filterExpressions[j];
            k.columnName == c.getSearchField() && a.setValue(k.expression)
        }
        c.hasOwnProperty("enableFilterAutoComplete") && c.enableFilterAutoComplete && this.buildFilter(a, c, 1 == h.getNestDepth() ? null : f, e);
        var l = this.grid.itemFilters[1 == h.getNestDepth() ? d.TOP_LEVEL_FILTER : f];
        if (l && c.getSearchField() && (c = l.getFilterValue(c.getSearchField()), a = a.implementsOrExtends("IFilterControl") ? a : null)) a.clear(), c && a.setValue(c)
    };
    a.prototype.buildFilter = function(a, c, f, e) {
        "undefined" == typeof f && (f = null);
        "undefined" == typeof e && (e = null);
        e = c.getDistinctValues(e);
        a.setDataProvider(e);
        if (f = this.grid.itemFilters[null == f ? d.TOP_LEVEL_FILTER : f]) for (e = 0; e < f.filterExpressions.length; e++) {
            var h = f.filterExpressions[e];
            h.columnName == c.getSearchField() && a.setValue(h.expression)
        }
    };
    a.prototype.processFooterCell = function(a, d, c, e, h, j) {
        a.getStyleValue("horizontalGridLines");
        d = d[c];
        c = a.getFooterRowHeight();
        var k = d.deriveRenderer(flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER),
            l = (j = this.getExistingCell(j, k, d)) ? j.component : this.grid.rendererCache.popInstance(d.footerCellRenderer, k);
        l.setRendererFactory(k);
        l.rowInfo = e;
        l.level = a;
        l.setColumn(d);
        l.setActualSize(d.getWidth() - this.getBorderWidth(l), c - this.getBorderHeight(l));
        l.setWordWrap(d.footerWordWrap);
        j ? this.addCell(l, e, j) : this.addEventListeners(this.addCell(l, e, j).componentInfo);
        l.getRenderer().domElement.style.textAlign = d.footerAlign || d.getStyleValue("textAlign");
        l.attachUserClass(d.getStyleValue("footerStyleName"));
        null != h && l.refreshCell();
        1 == a.getNestDepth() && l.setVisible(0 < a.getFooterRowHeight());
        l.invalidateDisplayList()
    };
    a.prototype.processColumnGroupCell = function(a, d, c, e, h, j, k) {
        a.getStyleValue("horizontalGridLines");
        e = j.columnGroupRenderer;
        e || (e = flexiciousNmsp.UIUtils.UIComponentFactory);
        d = (k = this.getExistingCell(k, d, j.getStartColumn())) ? k.component : this.grid.rendererCache.popInstance(d, e);
        d.setRendererFactory(e);
        d.rowInfo = c;
        d.level = a;
        d.columnGroup = j;
        k ? this.addCell(d, c, k) : this.addEventListeners(this.addCell(d, c, k).componentInfo);
        0 == d.getHeight() && d.setActualSize(j.getWX()[0] - this.getBorderWidth(d), h - this.getBorderHeight(d));
        d.attachUserClass(a.getStyleValue("columnGroupStyleName"));
        return d
    };
    a.prototype.processHeaderCell = function(a, d, c, e, h, j, k) {
        a.getStyleValue("horizontalGridLines");
        d = d[c];
        c = d.deriveRenderer(flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER);
        var l = (k = this.getExistingCell(k, c, d)) ? k.component : this.grid.rendererCache.popInstance(d.headerCellRenderer, c);
        l.setRendererFactory(c);
        l.rowInfo = e;
        l.level = a;
        l.setColumn(d);
        l.setText(d.getHeaderText());
        l.getRenderer().domElement.style.textAlign = d.headerAlign || d.getStyleValue("textAlign");
        l.setWordWrap(d.headerWordWrap);
        1 < a.getMaxColumnGroupDepth() ? null == d.columnGroup ? l.setActualSize(d.getWidth() - this.getBorderWidth(l), this.grid.getHeaderContainer().getHeight() - this.getBorderHeight(l)) : l.setActualSize(d.getWidth() - this.getBorderWidth(l), this.grid.getHeaderContainer().getHeight() - (d.columnGroup.getHeight() + d.columnGroup.getY()) - this.getBorderHeight(l)) : l.setActualSize(d.getWidth() - this.getBorderWidth(l), j - this.getBorderHeight(l));
        k ? this.addCell(l, e, k) : this.addEventListeners(this.addCell(l, e, k).componentInfo);
        l.attachUserClass(d.getStyleValue("headerStyleName"));
        0 == a.currentSorts.length && (a.initialSortField && a.initialSortField == d.getDataField()) && (l.sortAscending = a.initialSortAscending, this.sortByCell(l));
        null != h && l.refreshCell()
    };
    a.prototype.getExistingCell = function() {
        return null
    };
    a.prototype.onFilterChange = function(a) {
        var c;
        a.triggerEvent && (c = a.triggerEvent.currentTarget.parent.rowInfo);
        var f = a.filter;
        f.pageIndex = 0;
        var e = c ? c.rowPositionInfo.getLevel(this.grid) : this.grid.getColumnLevel();
        f.pageSize = e.pageSize;
        this.grid.itemFilters[1 == e.getNestDepth() ? d.TOP_LEVEL_FILTER : c.getData()] = flexiciousNmsp.AdvancedFilter.from(f);
        c = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_PAGE_SORT_CHANGE, this.createFilter(e, 1 == e.getNestDepth() ? null : c.getData()));
        c.filter.pageIndex = f.pageIndex;
        c.filter.sorts = e.currentSorts;
        c.triggerEvent = a;
        c.cause = flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE;
        1 != e.getNestDepth() && e.dispatchEvent(c)
    };
    a.prototype.onPageChange = function(a) {
        this.dispatchPageChange(a)
    };
    a.prototype.rootPageChange = function(a) {
        this.dispatchPageChange(a)
    };
    a.prototype.dispatchPageChange = function(a) {
        var c = a.target;
        if (c && !c.level.getIsClientFilterPageSortMode() && 1 < c.level.getNestDepth()) {
            var f = this.findLoadingInfo(c.rowInfo.getData(), c.level.getParentLevel(), 0 < c.level.childrenField.length);
            f && (f.totalRecords = c.getTotalRecords(), f.pageIndex = c.getPageIndex())
        }
        if (f = this.grid.itemFilters[1 == c.level.getNestDepth() ? d.TOP_LEVEL_FILTER : c.rowInfo.getData()]) f.pageIndex = c.getPageIndex();
        f = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_PAGE_SORT_CHANGE, this.createFilter(c.level, 1 == c.level.getNestDepth() ? null : c.rowInfo.getData()));
        f.filter.pageIndex = c.getPageIndex();
        f.triggerEvent = a;
        f.cause = flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE;
        c.level.dispatchEvent(f)
    };
    a.prototype.createFilter = function(a, c) {
        return a.createFilter(c, this.grid.itemFilters[null == c ? d.TOP_LEVEL_FILTER : c])
    };
    a.prototype.killResize = function() {};
    a.prototype.onHeaderCellMouseMove = function(a) {
        var c = a.currentTarget;
        if (this.columnDraggingDragCell && flexiciousNmsp.DisplayList.isMouseDown)"w-resize" == c.domElement.style.cursor && (c.domElement.style.cursor = ""), this.calculateColumnDraggingDropTargetCell(a);
        else if (this.columnResizingCell || this.columnResizingGlyph || !a.target.implementsOrExtends("FlexDataGridHeaderCell")) this.killResize();
        else {
            var f = new flexiciousNmsp.Point(a.localX, a.localY);
            if (c) if (a.target != c && a.target.implementsOrExtends("UIComponent") && (f = c.globalToLocal(a.target.localToGlobal(f))), a = c.getWidth() - f.getX() <= this.grid.getColumnLevel().headerSeperatorWidth, (f = f.getX() <= this.grid.getColumnLevel().headerSeperatorWidth) || a) {
                if (-1 == this.resizeCursorID) {
                    if (f) {
                        if (f = this.getCellInDirection(c, d.CELL_POSITION_LEFT), !f || !f.getColumn() || !f.getColumn().resizable) return
                    } else if (a && (!c.getColumn().resizable || c.getColumn().getIsLastUnLocked() || c.getColumn().getIsLastrightLocked())) return;
                    c.domElement.style.cursor = "w-resize";
                    this.resizeCursorID = 1
                }
            } else - 1 != this.resizeCursorID && (c.domElement.style.cursor = "", this.resizeCursorID = -1)
        }
    };
    a.prototype.onHeaderCellMouseOut = function() {};
    a.prototype.columnDraggingMouseMoveHandler = function(a) {
        if (!flexiciousNmsp.DisplayList.isMouseDown || !this.columnDraggingDragCell) this.columnDraggingMouseUpHandler(a);
        else {
            var d = new flexiciousNmsp.Point(0, 0),
                f = new flexiciousNmsp.Point(0, 0),
                f = this.columnDraggingDragCell.localToGlobal(f),
                f = this.grid.globalToLocal(f);
            if (!this.columnResizingGlyph) {
                this.columnDraggingDragCell.moving = !0;
                this.columnDraggingDropTargetCell = null;
                this.columnResizingGlyph = new flexiciousNmsp.FlexDataGridHeaderSeperator;
                d = this.grid.globalToLocal(this.columnDraggingDragCell.localToGlobal(d));
                c.addChild(this.grid, this.columnResizingGlyph);
                c.attachClass(this.columnResizingGlyph.domElement, "columnResizingGlyph");
                c.attachClass(this.columnResizingGlyph.domElement, "flexiciousUnSelectableText");
                var e = this.grid.getStyle("activeCellColor"),
                    h = this.columnDraggingDragCell.getHeight();
                this.columnDraggingDragCell.currentBackgroundColors = [e, e];
                this.columnDraggingDragCell.setHeight(this.grid.getHeight() - f.getY());
                this.columnDraggingDragCell.invalidateDisplayList();
                this.columnDraggingDragCell.validateNow();
                this.columnDraggingDragCell.setHeight(h);
                this.columnResizingGlyph.move(d.getX(), f.getY());
                this.columnResizingGlyph.setActualSize(1, this.grid.getHeight() - f.getY() - this.grid.isHScrollBarVisible - this.columnDraggingDragCell.getHeight());
                this.startX = this.columnResizingGlyph.getX();
                this.startY = this.columnResizingGlyph.getY();
                this.columnResizingCellGlyph = new flexiciousNmsp.FlexDataGridHeaderCell;
                this.columnResizingCellGlyph.setColumn(this.columnDraggingDragCell.getColumn());
                this.columnResizingCellGlyph.level = this.columnDraggingDragCell.level;
                this.columnResizingCellGlyph.rowInfo = this.columnDraggingDragCell.rowInfo;
                this.columnResizingCellGlyph.setText(this.columnDraggingDragCell.getText());
                c.attachClass(this.columnResizingCellGlyph.domElement, "flexDataGridHeaderCell");
                c.attachClass(this.columnResizingCellGlyph.domElement, "columnResizingCellGlyph");
                c.attachClass(this.columnResizingCellGlyph.domElement, "flexiciousUnSelectableText");
                c.attachClass(document.body, "flexiciousUnSelectableText");
                c.addChild(this.grid, this.columnResizingCellGlyph);
                this.columnResizingCellGlyph.refreshCell();
                this.columnResizingCellGlyph.createColumnIcon();
                this.columnResizingCellGlyph.move(d.getX(), f.getY() + 16);
                this.columnResizingCellGlyph.setActualSize(this.columnDraggingDragCell.getWidth(), this.columnDraggingDragCell.getHeight());
                this.columnResizingCellGlyph.iconRight = 8;
                this.columnResizingCellGlyph.iconTop = 4
            }
            this.columnResizingCellGlyph && null != this.columnResizingCellGlyph.parent && (d = new flexiciousNmsp.Point(a.pageX, a.pageY), d = this.grid.globalToLocal(d), this.columnResizingCellGlyph.move(d.x, d.y + 16))
        }
    };
    a.prototype.columnDraggingMouseUpHandler = function() {
        var a = flexiciousNmsp.DisplayList.instance().documentComponent;
        a.removeEventListener(d.EVENT_MOUSE_MOVE, this.columnDraggingMouseMoveHandler, !0);
        a.removeEventListener(d.EVENT_MOUSE_UP, this.columnDraggingMouseUpHandler, !0);
        c.detachClass(this.grid.domElement, "flexiciousUnSelectableText");
        c.detachClass(document.body, "flexiciousUnSelectableText");
        if (this.columnDraggingDragCell) {
            this.columnResizingGlyph && null != this.columnResizingGlyph.parent && c.removeChild(this.grid, this.columnResizingGlyph);
            this.columnResizingCellGlyph && null != this.columnResizingCellGlyph.parent && (this.columnResizingCellGlyph.destroy(), c.removeChild(this.grid, this.columnResizingCellGlyph));
            if (this.columnDraggingDropTargetCell && this.columnDraggingDropTargetCell != this.columnDraggingDragCell && this.columnDraggingDropTargetCell.implementsOrExtends("FlexDataGridHeaderCell")) this.grid.shiftColumns(this.columnDraggingDragCell.getColumn(), this.columnDraggingDropTargetCell.getColumn(), this.columnDraggingDropTargetCell.level), this.columnDraggingToRight && this.grid.shiftColumns(this.columnDraggingDropTargetCell.getColumn(), this.columnDraggingDragCell.getColumn(), this.columnDraggingDropTargetCell.level);
            else if (this.columnDraggingDropTargetCell && this.columnDraggingDropTargetCell != this.columnDraggingDragCell && this.columnDraggingDropTargetCell.implementsOrExtends("FlexDataGridColumnGroupCell") && this.columnDraggingDragCell.implementsOrExtends("FlexDataGridColumnGroupCell")) {
                var a = this.columnDraggingDragCell,
                    g, f, e;
                if (this.columnDraggingToRight) {
                    e = this.columnDraggingDropTargetCell.getColumn().columnGroup.getAllColumns();
                    for (f = 0; f < e.length; f++) g = e[f], this.grid.shiftColumns(g, a.getColumn(), this.columnDraggingDropTargetCell.level, !0)
                } else {
                    e = a.columnGroup.getAllColumns();
                    for (f = 0; f < e.length; f++) g = e[f], this.grid.shiftColumns(g, this.columnDraggingDropTargetCell.getColumn(), this.columnDraggingDropTargetCell.level, !0)
                }
            }
            this.columnDraggingDragCell.moving = !1;
            this.columnResizingCellGlyph = this.columnDraggingDropTargetCell = this.columnResizingGlyph = this.columnDraggingDragCell = null
        }
    };
    a.prototype.onHeaderCellMouseDown = function(a) {
        var g = a.currentTarget,
            f = a.currentTarget,
            e = flexiciousNmsp.DisplayList.instance().documentComponent,
            h = g.globalToLocal(new flexiciousNmsp.Point(a.pageX, a.pageY)).getX(),
            j = g.getWidth() - 4 - h <= this.grid.getColumnLevel().headerSeperatorWidth,
            h = h <= this.grid.getColumnLevel().headerSeperatorWidth; - 1 == this.resizeCursorID ? !this.columnDraggingDragCell && !this.columnResizingCell && g.getColumn().draggable && (e.addEventListener(this, d.EVENT_MOUSE_MOVE, this.columnDraggingMouseMoveHandler, !0), e.addEventListener(this, d.EVENT_MOUSE_UP, this.columnDraggingMouseUpHandler, !0), this.columnDraggingDragCell = a.currentTarget) : f && (!this.columnDraggingDragCell && !this.columnResizingCell) && g.getColumn().resizable && (f.resizing = !0, f.resizingPrevious = h, this.columnResizingCell = f, c.attachClass(this.grid.domElement, "flexiciousUnSelectableText"), j || (this.columnResizingCell = this.getCellInDirection(this.columnResizingCell, d.CELL_POSITION_LEFT)), e.addEventListener(this, d.EVENT_MOUSE_MOVE, this.columnResizingHandler, !0, 0, !0), e.addEventListener(this, d.EVENT_MOUSE_UP, this.columnResizeMouseUpHandler, !0, 0, !0), this.columnResizingGlyph = new flexiciousNmsp.FlexDataGridHeaderSeperator, this.columnResizingGlyph.mouseEnabled = !1, a = new flexiciousNmsp.Point(h ? 0 : g.getWidth(), 0), a = this.grid.globalToLocal(g.localToGlobal(a)), c.addChild(this.grid, this.columnResizingGlyph), c.attachClass(this.columnResizingGlyph.domElement, "columnResizingGlyph"), c.attachClass(this.columnResizingGlyph.domElement, "flexiciousUnSelectableText"), this.columnResizingGlyph.move(a.getX(), 0), this.columnResizingGlyph.setActualSize(1, this.grid.getHeight() - this.grid.isHScrollBarVisible), this.startX = this.columnResizingGlyph.getX())
    };
    a.prototype.columnResizingHandler = function(a) {
        if (!flexiciousNmsp.DisplayList.isMouseDown || !this.columnResizingCell) this.columnResizeMouseUpHandler(a);
        else {
            a = new flexiciousNmsp.Point(a.pageX, a.pageY);
            a = this.grid.globalToLocal(a);
            var d = this.columnResizingCell.getColumn() ? this.columnResizingCell.getColumn().minWidth + 1 : 20,
                c = this.startX - this.columnResizingCell.getWidth() + d,
                d = this.grid.getWidth() - d;
            this.columnResizingGlyph.move(Math.min(Math.max(c, a.getX()), d), 0)
        }
    };
    a.prototype.getCurrentEditCell = function() {
        return this.getEditCell()
    };
    a.prototype.getCurrentEditor = function() {
        return this.getEditor()
    };
    a.prototype.columnResizeMouseUpHandler = function(a) {
        c.detachClass(this.grid.domElement, "flexiciousUnSelectableText");
        if (this.columnResizingCell) {
            var g = this.columnResizingGlyph.getX() - this.startX,
                f = this.columnResizingCell.getColumn();
            if (this.columnResizingCell.resizingPrevious) {
                f = this.getCellInDirection(this.columnResizingCell, d.CELL_POSITION_LEFT);
                if (!f || !f.getColumn() || !f.getColumn().resizable) return;
                f = f.getColumn()
            }
            this.grid.enableColumnWidthUserOverride && f.setColumnWidthMode(flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIXED);
            if (!f.getIsLocked() && (this.grid.getForceColumnsToFitVisibleArea() || 1 != f.level.getNestDepth())) {
                var e = f.getIsLeftLocked() ? [flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT] : f.getIsRightLocked() ? [flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT] : [flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE],
                    h = f.level.getVisibleColumns(e),
                    e = [],
                    j = 0,
                    k = !1,
                    l, m;
                for (l = 0; l < h.length; l++) m = h[l], k && m.getIsElastic() && (j++, e.push(m)), k || (k = m == f);
                g /= j;
                for (l = h = 0; l < e.length; l++) m = e[l], m != f && m.getIsElastic() && (j = g, m.getWidth() - g < m.minWidth && (j = m.getWidth() - m.minWidth), m.setWidth(m.getWidth() - j), h += j, this.grid.enableColumnWidthUserOverride && m.setColumnWidthMode(flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIXED));
                f.setWidth(f.getWidth() + h)
            } else f.setWidth(f.getWidth() + g), this.grid.getColumnLevel().adjustColumnWidths();
            this.grid.variableRowHeight && this.grid.rebuildBody();
            f.getIsLocked() && this.grid.reDraw();
            e = flexiciousNmsp.DisplayList.instance().documentComponent;
            e.removeEventListener(d.EVENT_MOUSE_MOVE, this.columnResizingHandler, !0);
            e.removeEventListener(d.EVENT_MOUSE_UP, this.columnResizeMouseUpHandler, !0);
            c.removeChild(this.grid, this.columnResizingGlyph);
            this.columnResizingCell.resizing = !1;
            this.columnResizingGlyph = this.columnResizingCell = null;
            this.resizeCursorID = -1;
            e = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, f.level.grid, f.level, f, null, a);
            this.dispatchEvent(e);
            f.level.dispatchEvent(e);
            this.grid.invalidateCells();
            this.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMN_STRETCH, f.level.grid, f.level, f, null, a))
        }
    };
    a.prototype.snapToColumnWidths = function() {
        this.cellsWithColSpanOrRowSpan = [];
        var a = this.getRowsForSnapping(),
            d, c, e;
        for (d = 0; d < a.length; d++) if (c = a[d], c.getIsRendererRow() || c.getIsPagerRow()) for (e = 0; e < c.cells.length; e++) {
            var h = c.cells[e];
            (h.component.implementsOrExtends("FlexDataGridPagerCell") || h.component.implementsOrExtends("FlexDataGridLevelRendererCell")) && h.component.setWidth(c.rowPositionInfo.getLevel(this.grid).getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]))
        } else if (c.getIsColumnGroupRow()) for (e = 0; e < c.cells.length; e++) {
            if (h = c.cells[e].component) h.onColumnsResized(null)
        } else this.snapRowToColumnWidth(c);
        this.hideSpannedCells();
        this.cellsWithColSpanOrRowSpan = []
    };
    a.prototype.getColSpan = function(a) {
        if (null == this.grid.getColSpanFunction()) return 1;
        var d = 1,
            c = a.implementsOrExtends("IFlexDataGridDataCell") ? a : null;
        null != this.grid.getColSpanFunction() && (d = this.grid.getColSpanFunction()(a));
        c && (c.colSpan = d);
        return d
    };
    a.prototype.getRowSpan = function(a) {
        if (null == this.grid.getRowSpanFunction()) return 1;
        var d = 1,
            c = a.implementsOrExtends("IFlexDataGridDataCell") ? a : null;
        null != this.grid.getRowSpanFunction() && (d = this.grid.getRowSpanFunction()(a), 1 < d && (a.rowInfo.rowPositionInfo.rowSpan = Math.max(d, a.rowInfo.rowPositionInfo.rowSpan)));
        c && (c.rowSpan = d);
        return d
    };
    a.prototype.getCellWidth = function(a) {
        if (null == this.grid.getColSpanFunction() || a.implementsOrExtends("FlexDataGridHeaderCell") || a.implementsOrExtends("FlexDataGridColumnGroupCell")) return a.getColumn() ? a.getColumn().getWidth() : a.getWidth();
        var d = this.getColSpan(a);
        if (!a.getVisible()) return 0;
        if (1 == d) return a.getColumn() ? a.getColumn().getWidth() : a.getWidth();
        this.cellsWithColSpanOrRowSpan.push(a);
        var c = a.level.getColumnsByLockMode([a.getColumn().getColumnLockMode()]);
        if (0 == d) return a.getIsLocked() ? a.getIsLeftLocked() ? this.grid.getLeftLockedContent().getWidth() - a.getColumn().getX() : this.grid.getRightLockedContent().getWidth() - a.getColumn().getX() : this.grid.getBodyContainer().getWidth() + this.grid.getBodyContainer().getMaxHorizontalScrollPosition() - a.getColumn().getX() - this.grid.isVScrollBarVisible;
        var e = a.getColumn() ? a.getColumn().getWidth() : a.getWidth();
        a = c.indexOf(a.getColumn());
        for (var h = a + 1; h < Math.min(c.length, a + d); h++) e += c[h].getWidth();
        return e
    };
    a.prototype.getCellHeight = function(a) {
        if (null == this.grid.getRowSpanFunction() || !a.rowInfo.getIsDataRow()) return a.getHeight();
        var d = a.rowInfo,
            c = this.getRowSpan(a);
        if (!a.getVisible()) return 0;
        if (1 == c) return d.getHeight();
        0 == c && (c = this.rows.length);
        this.cellsWithColSpanOrRowSpan.push(a);
        a = this.itemVerticalPositions.indexOf(d.rowPositionInfo);
        for (var d = d.getHeight(), e = a + 1; e < Math.min(this.itemVerticalPositions.length, a + c); e++) d += this.itemVerticalPositions[e].getRowHeight();
        return d
    };
    a.prototype.hideSpannedCells = function() {
        for (var a = 0; a < this.cellsWithColSpanOrRowSpan.length; a++) {
            var d = this.cellsWithColSpanOrRowSpan[a];
            d.parent.setChildIndex(d, d.parent.numChildren() - 1)
        }
    };
    a.prototype.getRowsForSnapping = function() {
        return this.getAllRows()
    };
    a.prototype.snapRowToColumnWidth = function(a) {
        var d = new flexiciousNmsp.InsertionLocationInfo;
        this.grid.getForceColumnsToFitVisibleArea() || a.cells.sort(function(a, b) {
            return a.getColIndex() - b.getColIndex()
        });
        for (var c = 0; c < a.cells.length; c++) {
            var e = a.cells[c];
            if (e.component) {
                var h = e.component,
                    j = h.getColumn();
                0 == d.contentX && (j && !j.getIsLocked()) && (d.contentX = j.getX());
                var k = this.getCellWidth(h),
                    j = j ? j.getWidth() : e.component.getWidth();
                h.getIsLocked() ? h.getIsLeftLocked() ? (h.getColumn() && h.getColumn().getIsLastLeftLocked() && (k = this.grid.getLeftLockedContent().getWidth() - d.leftLockedContentX), e.setX(d.leftLockedContentX), d.leftLockedContentX += j) : h.getIsRightLocked() && (h.getColumn() && h.getColumn().getIsLastrightLocked() && (k = this.grid.getRightLockedContent().getWidth() - d.rightLockedContentX), e.setX(d.rightLockedContentX), d.rightLockedContentX += j) : (e.setX(d.contentX), d.contentX += j);
                h.setActualSize(k - this.getBorderWidth(h), this.getCellHeight(h) - this.getBorderHeight(h))
            }
        }
        this.grid.placeComponents(a)
    };
    a.prototype.placeSortIcon = function(a) {
        a = a.target;
        a.level.hasSort(a.getColumn()) && a.placeSortIcon()
    };
    a.prototype.selectAllChangedHandler = function(a) {
        this.onSelectAllChanged(a)
    };
    a.prototype.onSelectAllChanged = function(a) {
        var d = a.target;
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(a.type, d.level.grid, d.level, d.getColumn(), d, null, a))
    };
    a.prototype.sortByColumn = function(a) {
        var d = new flexiciousNmsp.FilterSort(a.getSortFieldName()),
            c = a.level.getSortIndex(a, !1, !0);
        d.isAscending = c ? !c.isAscending : !0;
        a.level.addSort(d);
        1 == a.level.getNestDepth() && this.grid.rebuildHeader()
    };
    a.prototype.onHeaderCellClicked = function(a, d, f) {
        "undefined" == typeof f && (f = !1);
        if (this.grid.allowInteractivity) {
            var e = a.level,
                h = a.rowInfo.getData(),
                j = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.HEADER_CLICKED, e.grid, e, a.getColumn(), a, null, d, !1, !0);
            this.dispatchEvent(j);
            e.dispatchEvent(j);
            if (a.getColumn().sortable) {
                d = c.isMouseEvent(d);
                if (f || this.grid.getEnableSplitHeader() && d && d.localX > d.currentTarget.getWidth() - this.grid.headerSortSeparatorRight) this.sortByColumn(a.getColumn());
                else {
                    a.sortAscending = a.getColumn().level.hasSort(a.getColumn()) ? !a.sortAscending : !0;
                    for (f = 0; f < a.rowInfo.cells.length; f++) d = a.rowInfo.cells[f], (d = d.component.implementsOrExtends("FlexDataGridHeaderCell") ? d.component : null) && d.destroySortIcon();
                    this.storeSort(a.rowInfo.getData(), a.getColumn(), a.sortAscending);
                    this.sortByCell(a)
                }
                a = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_PAGE_SORT_CHANGE, this.createFilter(e, 1 == e.getNestDepth() ? null : h));
                a.cause = flexiciousNmsp.ExtendedFilterPageSortChangeEvent.SORT_CHANGE;
                1 == e.getNestDepth() && (a.filter.parentObject = null);
                e.dispatchEvent(a);
                1 == e.getNestDepth() && e.getIsClientFilterPageSortMode() && this.grid.rebuildBody()
            }
        }
    };
    a.prototype.storeSort = function(a, d, c) {
        this._sortInfo[a] ? (this._sortInfo[a].sortCol = d, this._sortInfo[a].sortAscending = c) : this._sortInfo[a] = new flexiciousNmsp.SortInfo(d, c)
    };
    a.prototype.sortByCell = function(a) {
        a.level.setCurrentSort(a.getColumn(), a.sortAscending);
        a.createSortIcon(this)
    };
    a.prototype.filterPageSort = function(a, g, f, e, h, j, k, l) {
        var m = g.getColumnOwnerLevel();
        if (0 == m.currentSorts.length && m.initialSortField) for (var n = m.getVisibleColumns(), p = 0; p < n.length; p++) {
            var q = n[p];
            q.getDataField() == m.initialSortField && m.setCurrentSort(q, m.initialSortAscending)
        }
        0 < m.currentSorts.length && j && 0 < this.grid.getLength(a) && (a = c.sortArray(a, m.currentSorts));
        j = this.grid.itemFilters[null == f || g.reusePreviousLevelColumns || g.nextLevel && g.nextLevel.reusePreviousLevelColumns ? d.TOP_LEVEL_FILTER : f];
        this.grid.getHasFilterFunction() && (j = this.grid.createFilter());
        j && e && (a = c.filterArray(a, j, this.grid, g, this.grid.enableHideIfNoChildren));
        l && this.grid.updateTotalRecords && this.grid.setTotalRecords(this.grid.getLength(a));
        g.enablePaging && h && (f = (j = this.grid.itemFilters[null == f ? d.TOP_LEVEL_FILTER : f]) ? j.pageIndex : 0, a = k && 2 == k.length ? c.pageArrayByPageNumbers(a, k, g.pageSize) : c.pageArray(a, f, g.pageSize));
        return a
    };
    a.prototype.addPadding = function(a, d, c, e, h, j, k) {
        "undefined" == typeof h && (h = !1);
        "undefined" == typeof j && (j = !1);
        "undefined" == typeof k && (k = -1);
        return 1 < a ? (a = this.grid.rendererCache.popInstance(e.nestIndentPaddingCellRenderer, j ? e.scrollbarPadRenderer : e.nestIndentPaddingRenderer), a.rowInfo = d, a.level = e, a.forceRightLock = h, a.scrollBarPad = j, a.setActualSize(-1 == k ? e.getMaxPaddingCellWidth() - this.getBorderWidth(a) : k - this.getBorderWidth(a), c - this.getBorderHeight(a)), a.invalidateBackground(), this.addEventListeners(this.addCell(a, d).componentInfo), a) : null
    };
    a.prototype.updateDisplayList = function(a, d) {
        -1 != this._horizontalScrollPending && (this.gotoHorizontalPosition(this._horizontalScrollPending), this._horizontalScrollPending = -1);
        flexiciousNmsp.UIComponent.prototype.updateDisplayList.apply(this, [a, d])
    };
    a.prototype.getChildIds = function(a) {
        for (var d = 0; d < this.rows.length; d++) for (var c = this.rows[d], e = 0; e < c.cells.length; e++) a.push(a.length + 1)
    };
    a.prototype.getSelectedIds = function(a) {
        for (var d = [], c = [], e = 0; e < this.rows.length; e++) for (var h = this.rows[e], j = h.rowPositionInfo.getLevel(this.grid), j = 0 <= j.getSelectedKeys().indexOf(j.getItemKey(h.getData())), k = 0; k < h.cells.length; k++) d.push(d.length), j && c.push(d.length + a);
        return c
    };
    a.prototype.getChildId = function(a, d) {
        for (var c = 0; c < this.rows.length; c++) for (var e = this.rows[c], h = 0; h < e.cells.length; h++) {
            var j = e.cells[h];
            a.push(a.length);
            if (j.component == d) return a.length + 1
        }
        return 0
    };
    a.prototype.getChildAtId = function(a, d) {
        for (var c = 0; c < this.rows.length; c++) for (var e = this.rows[c], h = 0; h < e.cells.length; h++) {
            var j = e.cells[h];
            a.push(a.length);
            if (a.length == d - 2) return j.component
        }
        return null
    };
    a.prototype.refreshCheckBoxes = function() {
        for (var a = 0; a < this.rows.length; a++) {
            var d = this.rows[a];
            if (d.getIsDataRow() || d.getIsHeaderRow()) for (var c = 0; c < d.cells.length; c++) {
                var e = d.cells[c].component;
                e.implementsOrExtends("FlexDataGridCell") && e.getColumn() && e.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") && e.initializeCheckBoxRenderer(e._renderer)
            }
        }
    };
    a.prototype.getItemVerticalPositions = function() {
        return this.itemVerticalPositions
    };
    a.prototype.getInEdit = function() {
        return this._inEdit
    };
    a.prototype.getTraceRows = function() {
        for (var a = "", d = 0; d < this.rows.length; d++) {
            for (var c = this.rows[d], a = a + (c.rowPositionInfo.getRowIndex() + ":" + c.getY() + ":" + c.rowPositionInfo.getVerticalPosition() + ":" + c.rowPositionInfo.getRowType() + ":" + c.cells.length + ":"), e = 0; e < c.cells.length; e++) var h = c.cells[e],
                j = h.component,
                k = j ? j.getColumn() : null,
                a = a + ("|" + j.text + "|" + h.getX() + "|" + (k ? k.getHeaderText() : " "));
            a += "\n"
        }
        return a
    };
    a.prototype.getEditor = function() {
        return this.grid._editor
    };
    a.prototype.setEditor = function(a) {
        this.grid._editor = a
    };
    a.prototype.getEditCell = function() {
        return this.grid._editCell
    };
    a.prototype.setEditCell = function(a) {
        this.grid._editCell = a
    };
    a.prototype.getTraceCells = function() {
        for (var a = "", d = this.getChildren(), c = 0; c < d.length; c++) var e = d[c],
            a = a + (e.getX() + ":" + e.getY() + ":" + e.getWidth() + ":" + e.getText() + "\n");
        return a
    };
    a.prototype.kill = function() {
        this.grid = null;
        for (var a = 0; a < this.rows.length; a++) this.rows[a].kill();
        flexiciousNmsp.UIComponent.prototype.kill.apply(this)
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(a) {
        this.grid = a;
        this.matchSticks = [];
        this.openItems = [];
        this.backgroundForFillerRows = new flexiciousNmsp.UIComponent("div");
        this._calculatedTotalHeight = 0;
        this._recreateRows = this._drawDirty = this._processing = this._heightCalculated = !1;
        this._rowCache = {};
        this.currentRowPointer = null;
        this._visibleRange = [];
        this._visibleRangeH = [];
        this.fillerRows = [];
        this.onDisabledCell = !1;
        this._verticalScrollPending = -1;
        this.parentMap = {};
        this.verticalMask = this.horizontalMask = 0;
        this.variableRowHeightRenderers = null;
        flexiciousNmsp.FlexDataGridContainerBase.apply(this, [a])
    };
    flexiciousNmsp.FlexDataGridBodyContainer = a;
    a.prototype = new flexiciousNmsp.FlexDataGridContainerBase(null);
    a.prototype.typeName = a.typeName = "FlexDataGridBodyContainer";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridBodyContainer", "FlexDataGridContainerBase", "Container", "UIComponent"]
    };
    a.prototype.initialize = function() {
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
        this.grid.enableFillerRows && (c.attachClass(this.backgroundForFillerRows.domElement, "backgroundForFillerRows"), this.addChild(this.backgroundForFillerRows), this.setChildIndex(this.backgroundForFillerRows, 0))
    };
    a.prototype.updateDisplayList = function(a, d) {
        this.grid.traceEvent("begin section list" + this._drawDirty + "" + this._verticalScrollPending); - 1 != this._verticalScrollPending && (this.gotoVerticalPosition(this._verticalScrollPending), this._verticalScrollPending = -1);
        this._drawDirty && (this._drawDirty = !1, this.drawRows(!1), this._recreateRows = !1, this.grid.synchronizeLockedVerticalScroll(), this.grid.synchronizeHorizontalScroll(), this.domElement.style.display = "none", this.domElement.style.display = "block");
        flexiciousNmsp.FlexDataGridContainerBase.prototype.updateDisplayList.apply(this, [a, d]);
        this.grid.traceEvent("end section list")
    };
    a.prototype.getScrollableRect = function() {
        var a = new flexiciousNmsp.Rectangle;
        a.setHeight(this.calculateTotalHeight());
        a.setWidth(this.grid.getColumnLevel().getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]) - 1);
        return a
    };
    a.prototype.onFilterChange = function(a) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.onFilterChange.apply(this, [a]);
        a = a.triggerEvent.currentTarget.parent.rowInfo;
        if (!this.grid.itemFilters[null == a.getData() ? d.TOP_LEVEL_FILTER : a.getData()]) this.grid.itemFilters[null == a.getData() ? d.TOP_LEVEL_FILTER : a.getData()] = new flexiciousNmsp.AdvancedFilter;
        this.grid.itemFilters[null == a.getData() ? d.TOP_LEVEL_FILTER : a.getData()].pageIndex = 0;
        this.expandCollapse(a.getData());
        this.expandCollapse(a.getData())
    };
    a.prototype.onPageChange = function(a) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.onPageChange.apply(this, [a]);
        if (a.target.level.getIsClientFilterPageSortMode()) {
            a = a.target;
            if (!this.grid.itemFilters[null == a.rowInfo.getData() ? d.TOP_LEVEL_FILTER : a.rowInfo.getData()]) this.grid.itemFilters[null == a.rowInfo.getData() ? d.TOP_LEVEL_FILTER : a.rowInfo.getData()] = new flexiciousNmsp.AdvancedFilter;
            this.grid.itemFilters[null == a.rowInfo.getData() ? d.TOP_LEVEL_FILTER : a.rowInfo.getData()].pageIndex = a.getPageIndex();
            a = a.rowInfo.getData();
            this.expandCollapse(a);
            this.expandCollapse(a)
        }
    };
    a.prototype.getRowPositionInfo = function(a, d) {
        "undefined" == typeof d && (d = null);
        for (var c = this.itemVerticalPositions, e = 0; e < c.length; e++) {
            var h = c[e];
            if (null != d) {
                if (d.areItemsEqual(a, h.rowData)) return h
            } else if (h.rowData == a) return h
        }
        return null
    };
    a.prototype.getRowPositionInfoFromRows = function(a) {
        for (var d = this.rows, c = 0; c < d.length; c++) {
            var e = d[c];
            if (e.getData() == a) return e.rowPositionInfo
        }
        return null
    };
    a.prototype.binarySearch = function(a, d, c, e) {
        if (e < c) return null;
        var h = parseInt((c + e) / 2);
        return 0 == a.length ? null : 0 < a.length && a[a.length - 1].getVerticalPosition() < d ? a[a.length - 1] : 0 <= d - a[h].getVerticalPosition() && d - a[h].getVerticalPosition() <= a[h].getRowHeight() ? a[h] : a[h].getVerticalPosition() > d ? this.binarySearch(a, d, c, h - 1) : a[h].getVerticalPosition() < d ? this.binarySearch(a, d, h + 1, e) : null
    };
    a.prototype.getItemVerticalPositions = function() {
        return this.itemVerticalPositions.slice()
    };
    a.prototype.getItemAtPosition = function(a) {
        return this.binarySearch(this.itemVerticalPositions, a, 0, this.itemVerticalPositions.length)
    };
    a.prototype.setVisibleRange = function() {
        var a = this.getVerticalScrollPosition(),
            d = Math.max(a - this.grid.getColumnLevel().getRowHeight(), 0),
            a = Math.min(a + this.getHeight() + this.grid.getColumnLevel().getRowHeight(), this.calculateTotalHeight());
        this._visibleRange = [this.getItemAtPosition(d), this.getItemAtPosition(a)];
        this._visibleRangeH = [0 < this.getHorizontalScrollPosition() - this.horizontalMask ? this.getHorizontalScrollPosition() - this.horizontalMask : 0, this.getHorizontalScrollPosition() + (this.getWidth() + this.horizontalMask)]
    };
    a.prototype.createComponents = function(a, d) {
        "undefined" == typeof d && (d = 0);
        this._heightCalculated || this.calculateTotalHeight();
        this.getVerticalScrollPosition() > this._calculatedTotalHeight && this.setVerticalScrollPosition(0);
        flexiciousNmsp.FlexDataGridContainerBase.prototype.createComponents.apply(this, [a, d]);
        this.currentRowPointer && this.currentRowPointer.rowData && (this.grid.currentPoint.contentY = this.currentRowPointer.getVerticalPosition());
        this._recreateRows = this._drawDirty = !0;
        this.doInvalidate()
    };
    a.prototype.getRowsForRecycling = function() {
        return this.getAllRows()
    };
    a.prototype.getRowsForSnapping = function() {
        var a = this.getAllRows(),
            d;
        for (d in this._rowCache) a.concat(this._rowCache[d]);
        return a
    };
    a.prototype.recycleH = function(a, d) {
        "undefined" == typeof d && (d = !0);
        this.setVisibleRange();
        this.endEdit(this.getEditor());
        flexiciousNmsp.FlexDataGridContainerBase.prototype.recycleH.apply(this, [a, d]);
        0 < this.fillerRows.length && (this.resizeFillerCells(), this.fillerRows[0] = this.processItem(this.fillerRows[0].rowPositionInfo, !0, this.fillerRows[0]))
    };
    a.prototype.getRowsForRecycling = function() {
        for (var a = this.rows.slice(), d = this.fillerRows, c = 0; c < d.length; c++) a.push(d[c]);
        return a
    };
    a.prototype.recycle = function(a, d, c, e) {
        "undefined" == typeof c && (c = 0);
        "undefined" == typeof e && (e = !0);
        this.getVerticalScrollPosition() + c > this.getMaxVerticalScrollPosition() && this.setVerticalScrollPosition(this.getMaxVerticalScrollPosition());
        0 > this.getVerticalScrollPosition() + c && this.setVerticalScrollPosition(0);
        this.setVisibleRange();
        var h;
        a = d ? c >= this.getHeight() : 0 - c >= this.getHeight();
        if (0 != this.rows.length || this.grid.recalculateSeedOnEachScroll) {
            var j = [];
            for (h = 0; h < this.rows.length; h++) if (c = this.rows[h], a || c.getY() < this._visibleRange[0].getVerticalPosition() || c.getY() > this._visibleRange[1].getVerticalPosition()) {
                if (this.grid.getHasRowSpanOrColSpan() && !c.getIsFillRow()) {
                    var k = c.getMaxCellHeight();
                    if (k > c.getHeight() && k + c.rowPositionInfo.getVerticalPosition() > this.getVerticalScrollPosition()) {
                        e = !1;
                        continue
                    }
                }
                j.push(c)
            }
            for (h = 0; h < j.length; h++) c = j[h], this.rows.splice(this.rows.indexOf(c), 1), this.saveRowInCache(c);
            c = this._visibleRange[0];
            j = this._visibleRange[1];
            if (e) if (d) {
                if (null == j) return;
                !a && (0 < this.rows.length && this.rows[this.rows.length - 1].rowPositionInfo.getRowIndex() <= j.getRowIndex()) && (c = this.rows[this.rows.length - 1].rowPositionInfo);
                if (null == c) return;
                this.itemVerticalPositions.length > c.getRowIndex() + 1 && !(this.grid.recalculateSeedOnEachScroll && c.getRowIndex() == j.getRowIndex()) && (c = this.itemVerticalPositions[c.getRowIndex() + 1])
            } else {
                if (null == c) return;
                !a && (0 < this.rows.length && this.rows[0].rowPositionInfo.getRowIndex() >= c.getRowIndex()) && (j = this.rows[0].rowPositionInfo);
                this.grid.recalculateSeedOnEachScroll || j && 0 < j.getRowIndex() && (j = this.itemVerticalPositions[j.getRowIndex() - 1])
            }
            null == c || null == j || this.drawRowsUsingCache(c, j, d, a)
        }
    };
    a.prototype.drawRowsUsingCache = function(a, d, c, e) {
        var h;
        if (this.grid.getHasRowSpanOrColSpan() && 0 < this.getVerticalScrollPosition() && !c) {
            var j = this.itemVerticalPositions;
            for (h = 0; h < j.length; h++) {
                var k = j[h];
                if (k.getRowIndex() > a.getRowIndex()) break;
                1 < k.rowSpan && k.rowSpan + k.getRowIndex() >= a.getRowIndex() && (this.rowExists(k) || this.processItemPositionInfoUsingCache(k, 0, !0))
            }
        }
        for (j = a.getRowIndex(); j <= d.getRowIndex(); j++) {
            k = this.itemVerticalPositions[j];
            if (!e) {
                var l = !1;
                for (h = 0; h < this.rows.length; h++) if (this.rows[h].rowPositionInfo == k) {
                    l = !0;
                    break
                }
                if (l) continue
            }
            h = this.rows.length;
            c || (h = j - a.getRowIndex());
            k && this.processItemPositionInfoUsingCache(k, h, c)
        }
        this.grid.getHasRowSpanOrColSpan() && this.snapToColumnWidths()
    };
    a.prototype.processItemPositionInfoUsingCache = function(a, d, c) {
        "undefined" == typeof c && (c = !0);
        var e, h = !1,
            j = a.getLevelNestDepth() + "" + a.getRowType();
        this._rowCache[j] && 0 < this._rowCache[j].length && (e = this._rowCache[j].pop(), h = !0);
        if (h) {
            e.showHide(!0);
            e.invalidateCells();
            e.setRowPositionInfo(a, this.grid.variableRowHeight);
            this.rows.splice(d, 0, e);
            if (this._recreateRows) {
                d = e.cells;
                e.cells = [];
                for (this.processRowPositionInfo(a, c, e, d); 0 < d.length;) this.removeComponent(d[0]), d.splice(0, 1)
            }
            this.grid.placeComponents(e)
        } else this.grid.currentPoint.contentY = a.getVerticalPosition(), this.processRowPositionInfo(a, c)
    };
    a.prototype.checkInconsistency = function() {
        this.rows[0].getY();
        for (var a = 0; a < this.rows.length; a++) var d = this.rows[a];
        d.getY();
        d.getY()
    };
    a.prototype.positionExists = function(a) {
        for (var d = 0; d < this.rows.length; d++) if (this.rows[d].rowPositionInfo == a) return !0;
        return !1
    };
    a.prototype.keyDownHandler = function() {};
    a.prototype.validateDisplayList = function() {
        this.grid.placeBottomBar()
    };
    a.prototype.rowExists = function(a) {
        for (var d = 0; d < this.rows.length; d++) if (this.rows[d].rowPositionInfo == a) return !0;
        return !1
    };
    a.prototype.removeMatchSticks = function() {
        for (; 0 < this.matchSticks.length;) {
            var a = this.matchSticks[this.matchSticks.length - 1];
            a.parent.vMatch = null;
            a.parent.hMatch = null;
            c.removeChild(a.parent, a);
            this.matchSticks.pop()
        }
    };
    a.prototype.removeAllComponents = function(a) {
        this._inEdit && this.endEdit(this.getEditor());
        if (a) {
            for (a = 0; a < this.rows.length; a++) this.saveRowInCache(this.rows[a]);
            this.rows = []
        } else {
            flexiciousNmsp.FlexDataGridContainerBase.prototype.removeAllComponents.apply(this, [a]);
            for (this.grid.enableFillerRows && this.grid.invalidateFiller(); 0 < this.fillerRows.length;) a = this.fillerRows.pop(), this.removeComponents(a);
            this._rowCache = {}
        }
    };
    a.prototype.saveRowInCache = function(a) {
        a.showHide(!1);
        var d = a.rowPositionInfo.getLevelNestDepth() + "" + a.rowPositionInfo.getRowType();
        this._rowCache[d] || (this._rowCache[d] = []); - 1 == this._rowCache[d].indexOf(a) && this._rowCache[d].push(a);
        for (d = 0; d < a.cells.length; d++) {
            var c = a.cells[d];
            (c = c.component.implementsOrExtends("FlexDataGridHeaderCell") ? c.component : null) && c.destroySortIcon()
        }
    };
    a.prototype.shiftColumns = function(a, d) {
        for (var c = this.getAllRows(), e = 0; e < c.length; e++) {
            var h = c[e],
                j = h.cells.slice(),
                k = h.getCellForColumn(a),
                l = h.getCellForColumn(d);
            k && l && (-1 != j.indexOf(k) && j.splice(j.indexOf(k), 1), -1 != j.indexOf(l) && j.splice(j.indexOf(l), 0, k));
            h.cells = j
        }
    };
    a.prototype.drawRows = function(a) {
        "undefined" == typeof a && (a = !1);
        this.addMatchSticks();
        this.setVisibleRange();
        var d = this._visibleRange[0],
            c = this._visibleRange[1];
        this.grid.currentPoint.contentY = 0 == this._visibleRange.length || null == this._visibleRange[0] ? 0 : this._visibleRange[0].getVerticalPosition();
        this.grid.currentPoint.contentX = this.grid.currentPoint.leftLockedContentX = this.grid.currentPoint.rightLockedContentX = 0;
        null != d && null != c && this.drawRowsUsingCache(d, c, !0, !0);
        (this._calculatedTotalHeight < this.getHeight() || a) && this.drawFiller(c);
        return !0
    };
    a.prototype.drawFiller = function(a) {
        this.grid.enableFillerRows ? this.grid.invalidateFiller() : (a = 0 < this.fillerRows.length ? this.fillerRows[0].rowPositionInfo : new flexiciousNmsp.RowPositionInfo({}, a ? a.getRowIndex() + 1 : 1, 0, this.getHeight(), this.grid.getColumnLevel(), flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL), 0 == this.fillerRows.length && this.fillerRows.push(null), this.fillerRows[0] = this.processItem(a, !1, this.fillerRows[0]))
    };
    a.prototype.adjustFiller = function(a) {
        if (this.grid.enableFillerRows) this.grid.invalidateFiller();
        else if (0 < this.fillerRows.length) for (var d = this.fillerRows[0].cells, c = 0; c < d.length; c++) {
            var e = d[c];
            e.component && e.component.setHeight(e.component.getHeight() + a)
        }
    };
    a.prototype.setBackgroudFillerSize = function() {
        var a = this.getHeight(),
            a = a - this.grid.isVScrollBarVisible,
            a = a - this._calculatedTotalHeight;
        0 > a && (a = 1);
        this.backgroundForFillerRows.setHeight(a - this.getHorizontalScrollBar().getHeight());
        this.backgroundForFillerRows.setWidth(this.getWidth() + this.grid.isVScrollBarVisible);
        if (0 < a) {
            var d = this.grid.getColumnLevel().getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]);
            this.backgroundForFillerRows.move(Math.min(this.getHorizontalScrollPosition(), d - this.getWidth()), this.grid.getBodyContainer().getCalculatedTotalHeight())
        }
        this.backgroundForFillerRows.domElement.style.display = 2 > a ? "none" : ""
    };
    a.prototype.onWidthChanged = function() {
        this._calculatedTotalHeight < this.getHeight() && this.grid.enableFillerRows && this.grid.invalidateFiller()
    };
    a.prototype.onHeightChanged = function() {
        this.grid.enableFillerRows ? this.grid.invalidateFiller() : (this._calculatedTotalHeight < this.getHeight() && 0 == this.fillerRows.length && this.drawFiller(this._visibleRange.length ? this._visibleRange[1] : null), this.resizeFillerCells())
    };
    a.prototype.resizeFillerCells = function() {
        if (this.grid.enableFillerRows) this.grid.invalidateFiller();
        else if (0 < this.fillerRows.length) for (var a = this.fillerRows[0].cells, d = 0; d < a.length; d++) {
            var c = a[d];
            c.component && c.component.setHeight(this.getHeight() - this.grid.isHScrollBarVisible)
        }
    };
    a.prototype.processRowPositionInfo = function(a, d, c, e) {
        "undefined" == typeof d && (d = !0);
        "undefined" == typeof c && (c = null);
        "undefined" == typeof e && (e = null);
        a.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA ? this.processItem(a, d, c, e) : flexiciousNmsp.FlexDataGridContainerBase.prototype.processRowPositionInfo.apply(this, [a, d, c, e])
    };
    a.prototype.addEventListeners = function(a) {
        if (a && !a.row.getIsFillRow()) {
            flexiciousNmsp.FlexDataGridContainerBase.prototype.addEventListeners.apply(this, [a]);
            if (a = a.component) this.grid.enableDrag && (a.addEventListener(this, d.EVENT_DRAG_COMPLETE, this.onCellDragComplete), a.addEventListener(this, d.EVENT_MOUSE_MOVE, this.onCellDragMouseMove), a.addEventListener(this, d.EVENT_MOUSE_DOWN, this.onCellDragMouseDown)), this.grid.enableDrop && (a.addEventListener(this, d.EVENT_DRAG_ENTER, this.onDragEnter), a.addEventListener(this, d.EVENT_DRAG_DROP, this.onDragDrop));
            a.getIsExpandCollapseCell() && a.addEventListener(this, flexiciousNmsp.FlexDataGridExpandCollapseCell.EVENT_EXPAND_COLLAPSE, this.onExpandCollapse)
        }
    };
    a.prototype.onCellDragComplete = function(a) {
        this.grid.dragComplete(a.target)
    };
    a.prototype.onCellDragMouseMove = function(a) {
        this.grid.allowInteractivity && !this.grid.getHeaderContainer().columnDraggingDragCell && !this.grid.getHeaderContainer().columnResizingCell && (this.onDisabledCell || flexiciousNmsp.DisplayList.isMouseDown && (this.grid._isScrolling || this.grid.dragBegin(a)))
    };
    a.prototype.onCellDragMouseDown = function(a) {
        this.grid.allowInteractivity && (!this.grid.getHeaderContainer().columnDraggingDragCell && !this.grid.getHeaderContainer().columnResizingCell) && (this.onDisabledCell = (a = a.currentTarget) && !a.getEnabled())
    };
    a.prototype.onDragEnter = function(a) {
        this.grid.dragEnterInternal(a)
    };
    a.prototype.onDragDrop = function(a) {
        this.grid.dragDropInternal(a)
    };
    a.prototype.onCellDropMouseMove = function(a) {
        this.grid.allowInteractivity && (this.grid.enableDrop && flexiciousNmsp.DisplayList.isMouseDown) && (a = a.currentTarget, this.isOutOfVisibleArea(a.rowInfo) && (this.grid.globalToLocal(a.localToGlobal(new flexiciousNmsp.Point(0, 0))).getY() > this.grid.getHeight() / 2 ? this.grid.scrollToExistingRow(this.getVerticalScrollPosition() + a.getHeight(), !0) : this.grid.scrollToExistingRow(this.getVerticalScrollPosition() - a.getHeight(), !1)))
    };
    a.prototype.removeEventListeners = function(a) {
        a && !a.row.getIsFillRow() && (flexiciousNmsp.FlexDataGridContainerBase.prototype.removeEventListeners.apply(this, [a]), a.component.getIsExpandCollapseCell() ? a.component.removeEventListener(flexiciousNmsp.FlexDataGridExpandCollapseCell.EVENT_EXPAND_COLLAPSE, this.onExpandCollapse) : a.component.implementsOrExtends("IFlexDataGridDataCell") && (a = a.component, this.grid.enableDrag && (a.removeEventListener(d.EVENT_DRAG_COMPLETE, this.onCellDragComplete), a.removeEventListener(d.EVENT_MOUSE_MOVE, this.onCellDragMouseMove), a.removeEventListener(d.EVENT_MOUSE_DOWN, this.onCellDragMouseDown)), this.grid.enableDrop && (a.removeEventListener(d.EVENT_DRAG_ENTER, this.onDragEnter), a.removeEventListener(d.EVENT_DRAG_DROP, this.onDragDrop))))
    };
    a.prototype.handleSpaceBar = function(a, d) {
        var c = 0 <= d.type.toLowerCase().indexOf("key") ? d : null;
        if (c && c.ctrlKey) {
            if (this.getRowPositionInfoFromRows(a.rowInfo.getData()), (c = a.rowInfo.getExpandCollapseCell()) && c.hasChildren) this.handleExpandCollapse(c), c.refreshCell()
        } else flexiciousNmsp.FlexDataGridContainerBase.prototype.handleSpaceBar.apply(this, [a, d])
    };
    a.prototype.handleArrowKey = function(a, c, f) {
        if (flexiciousNmsp.FlexDataGridContainerBase.prototype.handleArrowKey.apply(this, [a, c, f])) return this.setCurrentRowAtScrollPosition(this.getVerticalScrollPosition()) ? (this.recycle(this.grid.getColumnLevel(), c == d.KEYBOARD_DOWN), !0) : !1
    };
    a.prototype.processItem = function(a, d, c, e) {
        "undefined" == typeof d && (d = !0);
        var h = a.getLevel(this.grid);
        h.getStyleValue("horizontalGridLines");
        var j = a.getRowHeight();
        c ? (this.grid.currentPoint.contentX = this.grid.currentPoint.leftLockedContentX = this.grid.currentPoint.rightLockedContentX = 0, d = c) : d = this.addRow(j, d, a);
        if (this.grid.enableDefaultDisclosureIcon && ((this.grid.lockDisclosureCell || this.isInVisibleHorizontalRange(this.grid.currentPoint.contentX, h.nestIndent * (a.getRowNestlevel() - 1))) && (!c || !d.paddingExists()) ? this.addPadding(a.getRowNestlevel(), d, j, h) : this.grid.lockDisclosureCell || (this.grid.currentPoint.contentX += h.nestIndent * (a.getRowNestlevel() - 1)), h.nextLevel || h.nextLevelRenderer))(this.grid.lockDisclosureCell || this.isInVisibleHorizontalRange(this.grid.currentPoint.contentX, h.nestIndent)) && (!c || !d.disclosureExists()) ? (a = this.grid.rendererCache.popInstance(h.expandCollapseCellRenderer), a.level = h, a.setActualSize(h.getMaxDisclosureCellWidth() - this.getBorderWidth(a), j - this.getBorderHeight(a)), a.rowInfo = d, this.addEventListeners(this.addCell(a, d).componentInfo), a.refreshCell()) : this.grid.lockDisclosureCell || (this.grid.currentPoint.contentX += h.getMaxDisclosureCellWidth());
        j = h.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE, flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT]);
        for (a = 0; a < j.length; a++) {
            var k = j[a];
            (this.isInVisibleHorizontalRange(this.grid.currentPoint.contentX, k.getWidth()) || k.getIsLocked()) && (!c || !d.columnCellExists(k)) ? this.pushCell(k, d, e) : k.getIsLocked() || (this.grid.currentPoint.contentX += k.getWidth())
        }
        j = h.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT]);
        for (a = h = 0; a < j.length; a++) k = j[a], this.grid.currentPoint.contentX = this.getWidth() - h - k.getWidth() + 1, (!c || !d.columnCellExists(k)) && this.pushCell(k, d, e), h += k.getWidth();
        this.grid.placeComponents(d);
        return d
    };
    a.prototype.pushCell = function(a, d, c) {
        a.getWidth() || a.setWidth(75);
        var e = a.deriveRenderer(d.rowPositionInfo.getRowType()),
            h = !1,
            j, k = !1;
        if (c) {
            var l = this.getExistingCell(c, e, a);
            l && (k = !0, h = !1, j = l.component)
        }
        k || (j = this.grid.rendererCache.popInstance(a.getDataCellRenderer(), e), h = !0);
        j.setRendererFactory(e);
        j.level = d.rowPositionInfo.getLevel(this.grid);
        j.rowInfo = d;
        j.setColumn(a);
        j.setActualSize(a.getWidth() - this.getBorderWidth(j), d.getHeight() - this.getBorderHeight(j));
        j.setWordWrap(a.wordWrap);
        a = this.addCell(j, d, l);
        d.getIsDataRow() && h && this.addEventListeners(a.componentInfo);
        j.refreshCell();
        return a
    };
    a.prototype.gridMouseOut = function() {
        this.grid.getIsRowSelectionMode() && this.grid.currentCell && this.grid.highlightRow(null, this.grid.currentCell.rowInfo, !1);
        this.grid.currentCell && (this.grid.highlightRow(this.grid.currentCell, this.grid.currentCell.rowInfo, !1), this.grid.currentCell.rowInfo.invalidateCells());
        this.grid.currentCell = null
    };
    a.prototype.onExpandCollapse = function(a) {
        this.handleExpandCollapse(a.target.getIExpandCollapseComponent())
    };
    a.prototype.handleExpandCollapse = function(a) {
        var d = a.getRowInfo().getData(),
            c = a.getRowInfo().rowPositionInfo,
            e = a.getLevel();
        if (a.hasChildren && e) {
            var h, j = !1;
            e.isItemOpen(d) ? (j = !0, h = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_CLOSING, e.grid, e, null, a.getCell(), d)) : (j = !1, h = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_OPENING, e.grid, e, null, a.getCell(), d));
            e.dispatchEvent(h);
            h.isDefaultPrevented() || (e.getIsClientItemLoadMode() ? this.expandCollapse(d, c) : !this.isLoading(d, a.getLevel()) && !this.grid.enableVirtualScroll ? (c = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.ITEM_LOAD, this.createFilter(e.nextLevel, d)), a.getLevel().dispatchEvent(c), c = new flexiciousNmsp.ItemLoadInfo(d, e, void 0), c.pageIndex = 0, this._loadedItems.push(c)) : this.expandCollapse(d, c), j ? e.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_CLOSE, e.grid, e, null, a.getCell(), d)) : e.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_OPEN, e.grid, e, null, a.getCell(), d)), this.grid.invalidateCells(), this.resizeFillerCells())
        }
    };
    a.prototype.gotoRow = function(a) {
        return 0 <= a && a < this.itemVerticalPositions.length ? (this.gotoVerticalPosition(this.itemVerticalPositions[0 < a ? a - 1 : 0].getVerticalPosition()), !0) : !1
    };
    a.prototype.selectText = function(a) {
        if (a) {
            a = a.toLowerCase();
            for (var d = this.rows, c = 0; c < d.length; c++) for (var e = d[c], h = 0; h < e.cells.length; h++) {
                var j = e.cells[h];
                if (e.getIsDataRow() && (j = j.component)) {
                    var k = j.getRenderer();
                    k && k.text && 0 <= k.text.toLowerCase().indexOf(a) && (j.currentBackgroundColors = j.getStyleValue("selectionColor"))
                }
            }
        }
    };
    a.prototype.quickFind = function(a, d, c, e) {
        if (!a) return [];
        d || (d = this.getRootFlat());
        c || (c = this.grid.getColumnLevel());
        e || (e = []);
        for (var h = 0; h < d.length; h++) {
            for (var j = d[h], k = 0; k < c.getVisibleColumns().length; k++) {
                var l = c.getVisibleColumns()[k].itemToLabel(j);
                if (l && 0 <= l.toLowerCase().indexOf(a.toLowerCase())) {
                    e.push(j);
                    break
                }
            }
            c.nextLevel && (j = this.filterPageSort(c.getChildren(j), c, j, !0, !1, !0), this.quickFind(a, j, c.nextLevel, e))
        }
        return e
    };
    a.prototype.gotoItem = function(a, c, f, e, h) {
        "undefined" == typeof e && (e = null);
        "undefined" == typeof h && (h = !0);
        if (this.grid.enableVirtualScroll) throw Error("This method is not supported when enableVirtualScroll=true");
        e || (e = this.grid.getColumnLevel());
        for (var j = this.itemVerticalPositions, k = 0; k < j.length; k++) {
            var l = j[k],
                m = l.getLevel(this.grid);
            if (l.getIsDataRow() && (m == e && m.isItemEqual(a, l.rowData, f) || !f && a == l.rowData)) {
                this.gotoRow(l.getRowIndex() + 1);
                if (c) {
                    this.validateNow();
                    for (a = 0; a < this.rows.length; a++) if (c = this.rows[a], c.rowPositionInfo == l) for (f = 0; f < c.cells.length; f++) if (e = c.cells[f].component) return this.grid.currentCell = e, this.grid.highlightRow(e, c, !0), !0
                }
                return !0
            }
        }
        if (!h) return !1;
        l = [];
        this.getObjectStack(a, l, f);
        for (k = 0; k < l.length; k++) if (h = l[k], h.level.nextLevel && !h.level.isItemOpen(h.item) && this.addOpenItem(h.item), j = h.pageIndex, -1 != j) {
            if (!this.grid.itemFilters[null == h.item ? d.TOP_LEVEL_FILTER : h.item]) this.grid.itemFilters[null == h.item ? d.TOP_LEVEL_FILTER : h.item] = new flexiciousNmsp.AdvancedFilter;
            this.grid.itemFilters[null == h.item ? d.TOP_LEVEL_FILTER : h.item].pageIndex = j;
            null == h.level.getParentLevel() && (this.grid.getPagerControl().setPageIndex(j), this.grid.validateNow(), this.gotoItem(a, c, f, e, !1))
        }
        return !0
    };
    a.prototype.getObjectStack = function(a, d, c, e, h) {
        e || (e = this.getRootFlat());
        h || (h = this.grid.getColumnLevel());
        for (var j = 0, k = 0; k < e.length; k++) {
            var l = e[k];
            if (h.isItemEqual(a, l, c)) return d.push(new flexiciousNmsp.ItemPositionInfo(l, h, h.enablePaging ? j / h.pageSize : -1, j)), !0;
            if (h.nextLevel) {
                var m = this.filterPageSort(h.getChildren(l), h, l, !0, !1, !0);
                if (this.getObjectStack(a, d, c, m, h.nextLevel)) return d.push(new flexiciousNmsp.ItemPositionInfo(l, h, h.enablePaging ? j % h.pageSize : -1, j)), !0
            }
            j++
        }
        return !1
    };
    a.prototype.scrollToExistingRow = function(a, d) {
        this.getVerticalScrollPosition() != a && a <= this.getMaxVerticalScrollPosition() + this.grid.getColumnLevel().getRowHeight() && (this.setVerticalScrollPosition(a), this.grid.traceValue = a, this.recycle(this.grid.getColumnLevel(), d, 0, !1), this.grid.synchronizeLockedVerticalScroll())
    };
    a.prototype.isOutOfVisibleArea = function(a) {
        return this.isYOutOfVisibleArea(a.getY(), a.getHeight())
    };
    a.prototype.isYOutOfVisibleArea = function(a, d) {
        return a < this.getVerticalScrollPosition() || a + d > this.getVerticalScrollPosition() + this.getHeight() - (this.getHorizontalScrollBar() ? this.getHorizontalScrollBar().getHeight() : 0)
    };
    a.prototype.gotoVerticalPosition = function(a) {
        null == this.grid.getDataProvider() ? (this._verticalScrollPending = a, this.doInvalidate()) : (0 > a && (a = 0), a + this.getHeight() > this.calculateTotalHeight() && !this.implementsOrExtends("PrintFlexDataGridBodyContainer") && (a = Math.max(0, this.calculateTotalHeight() - this.getHeight() + this.grid.getRowHeight())), this.getVerticalScrollPosition() != a && (this.setVerticalScrollPosition(a), this._drawDirty = !0, this._recreateRows = !1, this.doInvalidate()))
    };
    a.prototype.isLoading = function(a, d, c) {
        "undefined" == typeof c && (c = !1);
        return null != this.findLoadingInfo(a, d, c)
    };
    a.prototype.setChildData = function(a, d, c, e, h) {
        "undefined" == typeof e && (e = -1);
        this.grid.clearFlattenedCache();
        for (var j = this._loadedItems, k = 0; k < j.length; k++) {
            var l = j[k];
            if (l.isEqual(a, c, h)) {
                c = !1;
                !this.grid.enableSelectionExclusion && this.grid.enableSelectionCascade && l.level.isItemSelected(l.item) && (c = !0);
                l.totalRecords = -1 == e ? this.grid.getLength(d) : e;
                l.level.childrenCountField && l.item.hasOwnProperty(l.level.childrenCountField) && (l.item[l.level.childrenCountField] = l.totalRecords, (e = this.getCellForRowColumn(l.item, null, !0)) && e.refreshCell());
                e = l.level.getChildren(l.item);
                e = [];
                for (h = 0; h < d.length; h++) j = d[h], e.push(j), c && l.level.nextLevel && l.level.nextLevel.addSelectedItem(j);
                e instanceof Array && (l.item[l.level.childrenField] = e);
                l.hasLoaded ? (this.expandCollapse(a), this.expandCollapse(a)) : (l.hasLoaded = !0, 0 < l.totalRecords && this.expandCollapse(a));
                break
            }
        }
        this.grid.enableDynamicLevels && this.grid.ensureLevelsCreated()
    };
    a.prototype.expandCollapse = function(a, d, c) {
        "undefined" == typeof d && (d = null);
        "undefined" == typeof c && (c = !0);
        var e, h;
        if (null == d) {
            var j = this.itemVerticalPositions;
            for (h = 0; h < j.length; h++) if (e = j[h], e.rowData == a && e.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA) {
                d = e;
                break
            }
        }
        j = d.getLevel(this.grid);
        if (j.isItemOpen(a)) {
            this.removeOpenItem(a, d);
            if (this.grid.enableVirtualScroll) return;
            e = d;
            j = [];
            j.push(a);
            for (var k = a = 0, l = this.itemVerticalPositions.length - 1 > d.getRowIndex() ? this.itemVerticalPositions[d.getRowIndex() + 1] : null, m = []; l && l.getRowNestlevel() > d.getRowNestlevel();) a++, 0 > m.indexOf(l) && (m.push(l), j.push(l.rowData), l.getIsDataRow() && l.getLevel(this.grid).isItemOpen(l.rowData) && this.removeOpenItem(l.rowData, l)), l = this.itemVerticalPositions.length - 1 > d.getRowIndex() ? this.itemVerticalPositions[d.getRowIndex() + a] : null;
            a--;
            var n;
            if (0 < a) {
                var p = this.itemVerticalPositions.splice(d.getRowIndex() + 1, a),
                    l = this.itemVerticalPositions.length - 1 > d.getRowIndex() ? this.itemVerticalPositions[d.getRowIndex() + 1] : null,
                    q = [];
                for (h = 0; h < this.rows.length; h++) if (n = this.rows[h], n.getIsChromeRow() && 0 <= j.indexOf(n.getData())) q.push(n);
                else if (n.getIsRendererRow() && 0 <= j.indexOf(n.getData())) q.push(n);
                else for (var s = 0; s < m.length; s++) if (n.rowPositionInfo == m[s]) {
                    q.push(n);
                    break
                }
                l ? k = l.getVerticalPosition() - d.getVerticalPosition() - d.getRowHeight() : 0 < p.length && (k = p[p.length - 1].getVerticalPosition() + p[p.length - 1].getRowHeight() - (e.getVerticalPosition() + e.getRowHeight()));
                for (h = 0; h < q.length; h++) n = q[h], this.rows.splice(this.rows.indexOf(n), 1), this.saveRowInCache(n);
                this.adjustRowPositions(d, 0 - a, 0 - k);
                this.setVisibleRange();
                d = this._visibleRange[1];
                this._visibleRange[1] = this.getItemAtPosition(d.getVerticalPosition() + k);
                this._visibleRange[1] || (this._visibleRange[1] = d);
                d != this._visibleRange[1] && (this.grid.currentPoint.contentY = this.rows[this.rows.length - 1].getY() + this.rows[this.rows.length - 1].getHeight())
            }
        } else {
            this.addOpenItem(a, d);
            if (this.grid.enableVirtualScroll) return;
            e = d;
            h = [];
            l = j.nextLevelRenderer ? [d.rowData] : j.getChildren(d.rowData);
            j = this.calculateTotalHeight(l, j.nextLevelRenderer ? j : j.nextLevel, d.getVerticalPosition() + e.getRowHeight(), d.getRowNestlevel() + 1, d, h, a);
            this.adjustRowPositions(d, h.length, j);
            j = h.reverse();
            for (h = 0; h < j.length; h++) a = j[h], this.itemVerticalPositions.splice(d.getRowIndex() + 1, 0, a);
            this.grid.currentPoint.contentY = e.getVerticalPosition() + e.getRowHeight()
        }
        this.grid.showSpinnerOnFilterPageSort && this.grid.hideSpinner();
        d = this.getVerticalScrollPosition();
        h = this.getHorizontalScrollPosition();
        this.removeAllComponents(!0);
        this.drawRows();
        c && this.getVerticalScrollBar() && (d >= this.getMaxVerticalScrollPosition() ? isNaN(k) || this.setVerticalScrollPosition(Math.max(0, d - k)) : 0 > d && this.setVerticalScrollPosition(0), d <= this.getMaxVerticalScrollPosition() && (this.setVerticalScrollPosition(d + 1), this.setVerticalScrollPosition(d - 1)));
        this.grid.currentCell = this.getCellForRowColumn(e.rowData, null, !0);
        this.grid.currentCell && this.grid.currentCell.getEnabled() && this.grid.highlightRow(this.grid.currentCell, this.grid.currentCell.rowInfo, !0);
        !this.grid.getForceColumnsToFitVisibleArea() && 0 < h && (this.setHorizontalScrollPosition(h), this.recycleH())
    };
    a.prototype.adjustRowPositions = function(a, d, c) {
        for (var e = a.getRowIndex() + 1; e < this.itemVerticalPositions.length; e++) a = this.itemVerticalPositions[e], a.setRowIndex(a.getRowIndex() + d), a.setVerticalPosition(a.getVerticalPosition() + c);
        d = this._calculatedTotalHeight;
        this._calculatedTotalHeight += c;
        this.checkScrollChange(d);
        this.checkAutoAdjust();
        for (c = 0; c < this.rows.length; c++) d = this.rows[c], d.setY(d.rowPositionInfo.getVerticalPosition())
    };
    a.prototype.invalidateCalculatedHeight = function() {
        this._heightCalculated = !1
    };
    a.prototype.setCurrentRowAtScrollPosition = function(a) {
        var d = this.currentRowPointer ? this.currentRowPointer.rowData : null,
            c = this.currentRowPointer ? this.currentRowPointer.getRowType() : null;
        this.currentRowPointer = this.getItemAtPosition(a);
        return null != this.currentRowPointer && (d != this.currentRowPointer.rowData || c != this.currentRowPointer.getRowType() || this.grid.recalculateSeedOnEachScroll)
    };
    a.prototype.getFilteredPagedSortedData = function(a, d, c, e, h, j) {
        "undefined" == typeof d && (d = !0);
        "undefined" == typeof c && (c = !0);
        "undefined" == typeof e && (e = !0);
        "undefined" == typeof h && (h = null);
        "undefined" == typeof j && (j = !1);
        var k = [];
        this.gatherFilteredPagedSortedData(a, k, this.getRootFlat(), this.grid.getColumnLevel(), null, d, c, e, h, j);
        return k
    };
    a.prototype.gatherFilteredPagedSortedData = function(a, d, c, e, h, j, k, l, m, n) {
        c = this.filterPageSort(c, e, h, j, k, l, m);
        for (h = 0; h < c.length; h++) {
            var p = c[h];
            a[p] = e;
            d.push(p);
            e.nextLevel && n && this.gatherFilteredPagedSortedData(a, d, e.getChildren(p), e.nextLevel, p, j, k, l, m, n)
        }
    };
    a.prototype.getRootFlat = function() {
        return this.grid.getDataProvider()
    };
    a.prototype.calculateTotalHeight = function(a, d, c, e, h, j, k, l) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof d && (d = null);
        if (this._heightCalculated && null == h) return this._calculatedTotalHeight;
        this.grid.variableRowHeight && null == flexiciousNmsp.FlexDataGrid.measurerText.parent && this.grid.addChild(flexiciousNmsp.FlexDataGrid.measurerText);
        this.grid.variableRowHeightUseRendererForCalculation && (null == this.variableRowHeightRenderers && !l) && (this.variableRowHeightRenderers = new flexiciousNmsp.KeyValuePairCollection);
        var m = 0;
        l || (m = this._calculatedTotalHeight);
        var n = 0;
        a || (h || (this.itemVerticalPositions = []), a = this.getRootFlat());
        d || (d = this.grid.getColumnLevel());
        d.getIsClientFilterPageSortMode() && (a = this.filterPageSort(a, d, k, !0, !0, !0, null, null == h && 1 == d.getNestDepth()));
        var p = 0,
            q, s, r = h ? h.getLevel(this.grid) : null;
        if (h && !r.nextLevelRenderer) {
            var w = r.nextLevel.displayOrder.split(",");
            for (s = 0; s < w.length; s++) {
                q = w[s];
                var v = this.processSection(j, h.getRowIndex(), k, c, d, k, this.getChromeType(q), h, r),
                    n = n + v;
                c += v;
                if ("body" == q) break
            }
        }
        for (var E = 0, z = this.grid.getLength(a), u = 0; u < z; u++) {
            var y = a[u];
            this.parentMap[d.getItemKey(y)] = k;
            if (y && (E++, h ? r.nextLevelRenderer || (p = this.addToExpandingPositions(j, h.getRowIndex(), y, c, d, k, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA)) : p = this.addToVerticalPositions(y, c, d, k, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA), n += p, c += p, q = (d.nextLevel || d.nextLevelRenderer) && d.isItemOpen(y), !q && null == d.nextLevel && (this.grid.enableDynamicLevels && this.grid.dynamicLevelHasChildrenFunction(y)) && (d.nextLevel = this.grid.getColumnLevel().clone(!1), d.nextLevel.reusePreviousLevelColumns = !0, this.grid.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.DYNAMIC_LEVEL_CREATED, this.grid, d.nextLevel)), this.grid.getColumnLevel().initializeLevel(this.grid), this.grid.reDraw()), q)) if (d.nextLevelRenderer) d.levelRendererHeight || (p = d.nextLevelRenderer.newInstance(), d.levelRendererHeight = p.getHeight()), p = h ? this.addToExpandingPositions(j, h.getRowIndex(), y, c, d, k, flexiciousNmsp.RowPositionInfo.ROW_TYPE_RENDERER) : this.addToVerticalPositions(y, c, d, k, flexiciousNmsp.RowPositionInfo.ROW_TYPE_RENDERER), n += p, c += p;
            else {
                e++;
                q = 0;
                var F = d.getChildren(y);
                if (0 < this.grid.getLength(F)) {
                    w = d.nextLevel.displayOrder.split(",");
                    for (s = 0; s < w.length && !(q = w[s], v = this.processSection(j, h ? h.getRowIndex() - 1 : 0, y, c, d.nextLevel, y, this.getChromeType(q), h, r), n += v, c += v, "body" == q); s++);
                    q = this.calculateTotalHeight(F, d.nextLevel, c, e, h, j, y, !0);
                    n += q;
                    c += q;
                    F = !1;
                    w = d.nextLevel.displayOrder.split(",");
                    for (s = 0; s < w.length; s++) q = w[s], F && (v = this.processSection(j, h ? h.getRowIndex() : -1, y, c, d.nextLevel, y, this.getChromeType(q), h, r), n += v, c += v), "body" == q && (F = !0)
                }
                e--
            }
        }
        if (h && !r.nextLevelRenderer) {
            a = !1;
            w = r.nextLevel.displayOrder.split(",");
            for (s = 0; s < w.length; s++) q = w[s], a && (v = this.processSection(j, h.getRowIndex(), k, c, d, k, this.getChromeType(q), h, r), n += v, c += v), "body" == q && (a = !0)
        }!h && 0 == e && (this._heightCalculated = !0, this._calculatedTotalHeight = n, this.verticalSpill = this._calculatedTotalHeight > this.getHeight(), this.checkAutoAdjust());
        this.grid.variableRowHeight && null != flexiciousNmsp.FlexDataGrid.measurerText.parent && this.grid.removeChild(flexiciousNmsp.FlexDataGrid.measurerText);
        this.grid.variableRowHeightUseRendererForCalculation && (null != this.variableRowHeightRenderers && !l) && this.clearVariableRowHeightRenderes();
        l || this.checkScrollChange(m);
        return n
    };
    a.prototype.checkScrollChange = function(a) {
        var c = this.getHeight();
        a || (a = 0);
        this.grid.enableHeightAutoAdjust && (c = this.grid.maxAutoAdjustHeight);
        a < c && this._calculatedTotalHeight > c ? (this.grid.showHideVScroll(!0, d.VERTICAL_SCROLLBAR_WIDTH), this.setBackgroudFillerSize()) : a > c && this._calculatedTotalHeight < c && (this.grid.showHideVScroll(!1, d.VERTICAL_SCROLLBAR_WIDTH), this.setBackgroudFillerSize())
    };
    a.prototype.clearVariableRowHeightRenderes = function() {
        for (var a = this.variableRowHeightRenderers.keys, d = 0; d < a.length; d++) this.grid.removeChild(this.variableRowHeightRenderers.getValue(a[d]));
        this.variableRowHeightRenderers.clear();
        this.variableRowHeightRenderers = null
    };
    a.prototype.processSection = function(a, d, c, e, h, j, k, l) {
        d = 0;
        k == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER && h.enablePaging && (d = l ? this.addToExpandingPositions(a, l.getRowIndex(), c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER) : this.addToVerticalPositions(c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER));
        h.reusePreviousLevelColumns || (k == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER && h.getEnableFilters() && (d = l ? this.addToExpandingPositions(a, l.getRowIndex(), c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER) : this.addToVerticalPositions(c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER)), k == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER && (d = l ? this.addToExpandingPositions(a, l.getRowIndex(), c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER) : this.addToVerticalPositions(c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER)));
        k == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER && h.getEnableFooters() && (d = l ? this.addToExpandingPositions(a, l.getRowIndex(), c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER) : this.addToVerticalPositions(c, e, h, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER));
        return d
    };
    a.prototype.getChromeType = function(a) {
        if ("header" == a) return flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER;
        if ("footer" == a) return flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER;
        if ("pager" == a) return flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER;
        if ("filter" == a) return flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER;
        if ("body" == a) return flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA;
        throw Error("Invalid section specified for the displayOrder property " + a);
    };
    a.prototype.checkAutoAdjust = function() {
        this.ensureAutoAjustHeight()
    };
    a.prototype.ensureAutoAjustHeight = function() {
        if (this.grid.enableHeightAutoAdjust) {
            var a = this.grid.getStyle("borderThickness"),
                a = this.grid.hasBorderSide("bottom") ? a : 0,
                a = Math.min(this._calculatedTotalHeight + this.grid.getHeaderSectionHeight() + (0 == this._calculatedTotalHeight ? this.grid.getRowHeight() : 0) + this.grid.getFooterRowHeight() + a + (this.grid.getHorizontalScrollBar() ? this.grid.getHorizontalScrollBar().getHeight() : 0) + (this.grid.noDataMessage && 0 == this._calculatedTotalHeight ? this.grid.spinner && this.grid.spinner.getHeight() ? this.grid.spinner.getHeight() : 2 * this.grid.getRowHeight() : 0), this.grid.maxAutoAdjustHeight),
                a = a + 2;
            !isNaN(a) && a != this.grid.getHeight() && (this.grid.setHeight(a), this.grid.invalidateDisplayList())
        }
    };
    a.prototype.addToVerticalPositions = function(a, d, c, e, h) {
        e = this.grid.calculateRowHeight(a, c, h);
        var j = 1;
        if (h == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER) for (var j = c.getMaxColumnGroupDepth(), k = 1; k < j; k++) this.itemVerticalPositions.push(new flexiciousNmsp.RowPositionInfo(a, this.itemVerticalPositions.length, d, e, c, flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP)), d += e;
        this.itemVerticalPositions.push(new flexiciousNmsp.RowPositionInfo(a, this.itemVerticalPositions.length, d, e, c, h));
        return e * j
    };
    a.prototype.addToExpandingPositions = function(a, d, c, e, h, j, k) {
        j = this.grid.calculateRowHeight(c, h, k);
        var l = 1;
        if (k == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER) for (var l = h.getMaxColumnGroupDepth(), m = 1; m < l; m++) a.push(new flexiciousNmsp.RowPositionInfo(c, d + a.length + 1, e, j, h, flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP)), e += j;
        a.push(new flexiciousNmsp.RowPositionInfo(c, d + a.length + 1, e, j, h, k));
        return j * l
    };
    a.prototype.addCell = function(a, d, c) {
        "undefined" == typeof c && (c = null);
        a.getVisible() || a.setVisible(!0);
        c = flexiciousNmsp.FlexDataGridContainerBase.prototype.addCell.apply(this, [a, d, c]);
        this.currentRowPointer && (c.verticalSpill = this.grid.currentPoint.contentY > this.currentRowPointer.getVerticalPosition() + this.getHeight() + 1);
        c.horizontalSpill = this.grid.currentPoint.contentX > this._visibleRangeH[1];
        d.rowPositionInfo.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILL && (a.parent.setChildIndex(a, 0), a.setHeight(this.getHeight() - this.grid.isHScrollBarVisible));
        return c
    };
    a.prototype.onHeaderCellClicked = function(a, d, c) {
        "undefined" == typeof c && (c = !1);
        flexiciousNmsp.FlexDataGridContainerBase.prototype.onHeaderCellClicked.apply(this, [a, d, c]);
        if (a.level != this.grid.getColumnLevel()) this.onChildHeaderClicked(a)
    };
    a.prototype.onChildHeaderClicked = function(a) {
        a.getColumn() && a.getColumn().sortable && this.grid.rebuildBody()
    };
    a.prototype.onSelectAllChanged = function(a) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.onSelectAllChanged.apply(this, [a]);
        this.grid.invalidateSelection()
    };
    a.prototype.addRow = function(a, d, c) {
        a = flexiciousNmsp.FlexDataGridContainerBase.prototype.addRow.apply(this, [a, d, c]);
        this.verticalSpill = this.grid.currentPoint.contentY > this.getHeight();
        return a
    };
    a.prototype.getAllRows = function() {
        var a = this.rows.slice(),
            d, c = this.fillerRows;
        for (d = 0; d < c.length; d++) a.push(c[d]);
        for (var e in this._rowCache) for (d = 0; d < this._rowCache[e].length; d++) a.push(this._rowCache[e][d]);
        return a
    };
    a.prototype.nextPage = function() {
        this.gotoVerticalPosition(this.getVerticalScrollPosition() + this.getHeight())
    };
    a.prototype.getColumnGroupDepth = function(a) {
        a = this.itemVerticalPositions.indexOf(a.rowPositionInfo);
        for (var d = 1, c = a; 5 > c && !(c + a > this.itemVerticalPositions.length) && !this.itemVerticalPositions[c + a].rowInfo.getIsHeaderRow(); c++) d++;
        return d
    };
    a.prototype.clearAllCollections = function() {
        this.grid.clearOpenItemsOnDataProviderChange && this.clearOpenItems()
    };
    a.prototype.clearOpenItems = function() {
        this.openItems = [];
        this._loadedItems = []
    };
    a.prototype.addOpenItem = function(a, d, f) {
        "undefined" == typeof d && (d = null);
        "undefined" == typeof f && (f = !0);
        if (d && d.getLevel(this.grid).selectedKeyField) {
            d = d.getLevel(this.grid);
            f = this.grid.getOpenItems();
            for (var e = 0; e < f.length; e++) {
                var h = f[e];
                if (c.resolveExpression(a, d.selectedKeyField) == c.resolveExpression(h, d.selectedKeyField)) return
            }
            0 <= !this.openItems.indexOf(a) && this.openItems.push(a)
        } else(!f || 0 <= !this.openItems.indexOf(a)) && this.openItems.push(a)
    };
    a.prototype.removeOpenItem = function(a, d) {
        "undefined" == typeof d && (d = null);
        if (d && d.getLevel(this.grid).selectedKeyField) for (var f = d.getLevel(this.grid), e = this.grid.getOpenItems(), h = 0; h < e.length; h++) {
            var j = e[h];
            if (c.resolveExpression(a, f.selectedKeyField) == c.resolveExpression(j, f.selectedKeyField)) {
                this.openItems.splice(this.openItems.indexOf(j), 1);
                break
            }
        } else 0 <= this.openItems.indexOf(a) && this.openItems.splice(this.openItems.indexOf(a), 1)
    };
    a.prototype.getLoadedItems = function() {
        return this._loadedItems
    };
    a.prototype.setVerticalScrollPosition = function(a) {
        0 > a && (a = 0);
        flexiciousNmsp.FlexDataGridContainerBase.prototype.setVerticalScrollPosition.apply(this, [a])
    };
    a.prototype.getValidNextPage = function() {
        return 0 < this.getHeight() && this.calculateTotalHeight() > this.getHeight() && this.getVerticalScrollPosition() < this.calculateTotalHeight() - this.getHeight()
    };
    a.prototype.getOnScreenRows = function() {
        this._drawDirty && this.validateNow();
        for (var a = [], d = 0; d < this.rows.length; d++) {
            var c = this.rows[d];
            c.getY() >= this.getVerticalScrollPosition() && c.getY() < this.getVerticalScrollPosition() + this.getHeight() && a.push(c)
        }
        return a
    };
    a.prototype.getCalculatedTotalHeight = function() {
        return this._calculatedTotalHeight
    };
    a.prototype.getNumTotalRows = function() {
        return this.itemVerticalPositions.length
    };
    a.prototype.getVerticalScrollBar = function() {
        return new flexiciousNmsp.Rectangle(0, 0, this.domElement ? this.domElement.offsetWidth - this.domElement.clientWidth : 0, this.getHeight())
    };
    a.prototype.getHorizontalScrollBar = function() {
        return new flexiciousNmsp.Rectangle(0, 0, this.getWidth(), this.domElement ? this.domElement.offsetHeight - this.domElement.clientHeight : 0)
    };
    a.prototype.getVerticalScrollPosition = function() {
        return this.domElement.scrollTop
    };
    a.prototype.getHorizontalScrollPosition = function() {
        return this.domElement.scrollLeft
    };
    a.prototype.setHorizontalScrollPosition = function(a) {
        this.domElement.scrollLeft = a
    };
    a.prototype.getMaxHorizontalScrollPosition = function() {
        return this.domElement.scrollWidth - this.domElement.clientWidth
    };
    a.prototype.getMaxVerticalScrollPosition = function() {
        return this._calculatedTotalHeight - this.getHeight()
    };
    a.prototype.addMatchSticks = function() {
        this.addMatchStick(this);
        this.addMatchStick(this.grid.getLeftLockedContent());
        this.addMatchStick(this.grid.getRightLockedContent());
        this.addHMatchStick(this);
        this.addHMatchStick(this.grid.getFilterContainer());
        this.addHMatchStick(this.grid.getFooterContainer());
        this.addHMatchStick(this.grid.getHeaderContainer())
    };
    a.prototype.addMatchStick = function(a) {
        a.vMatch || (a.vMatch = new flexiciousNmsp.UIComponent("div"), a.vMatch.domElement.className = "matchStick", c.addChild(a, a.vMatch), this.matchSticks.push(a.vMatch));
        a.vMatch.setHeight(this._calculatedTotalHeight);
        a != this && a.vMatch.setHeight(this._calculatedTotalHeight + d.HORIZONTAL_SCROLLBAR_HEIGHT);
        this.maxVerticalScrollPosition = this._calculatedTotalHeight - this.height
    };
    a.prototype.addHMatchStick = function(a) {
        !a.hMatch && !this.grid.getForceColumnsToFitVisibleArea() && (a.hMatch = new flexiciousNmsp.UIComponent("div"), a.hMatch.domElement.className = "matchStick", c.addChild(a, a.hMatch), this.matchSticks.push(a.hMatch), this.maxHorizontalScrollPosition = g - this.width);
        if (a.hMatch) {
            var g = this.grid.getColumnLevel().getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]) - 1;
            a.hMatch.setWidth(g);
            a != this && a.hMatch.setWidth(g + d.VERTICAL_SCROLLBAR_WIDTH)
        }
    };
    a.prototype.kill = function() {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.kill.apply(this);
        this.openItems = [];
        for (var a = 0; a < this.itemVerticalPositions.length; a++) this.itemVerticalPositions[a].kill();
        this.itemVerticalPositions = [];
        this._rowCache = {};
        this.parentMap = {};
        for (this.fillerRow = null; 0 < this.matchSticks.length;) this.matchSticks[this.matchSticks.length - 1].kill(), this.matchSticks.pop();
        this.matchSticks = [];
        this.currentRowPointer = null;
        this._visibleRange = [];
        this._visibleRangeH = []
    };
    a.prototype.kill = function() {
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        for (var a = this.getAllRows(), d = 0; d < a.length; d++) {
            for (var c = a[d], e = 0; e < c.cells.length; e++) c.cells[e].component.kill();
            c.kill()
        }
        this.grid = null;
        this.rows = []
    };
    a.prototype.getWidth = function() {
        return this.width || this.domElement.offsetWidth
    };
    a.prototype.setWidth = function(a) {
        if (0 < a.toString().indexOf("%")) this.domElement.style.width = a, this.width = 0;
        else {
            if (0 > a || isNaN(a)) return a;
            this.width = a;
            this.domElement.style.width = a + "px"
        }
        return a
    };
    a.prototype.getHeight = function() {
        return this.height || this.domElement.offsetHeight
    };
    a.prototype.setHeight = function(a) {
        if (0 < a.toString().indexOf("%")) this.domElement.style.height = a, this.height = 0;
        else {
            if (0 > a || isNaN(a)) return a;
            this.height = a;
            this.domElement.style.height = a + "px"
        }
        return a
    }
})(window);
(function() {
    var a;
    a = function() {
        this.radioButtonMode = !1;
        this.allowSelectAll = !0;
        this.enableLabelAndCheckBox = !1;
        flexiciousNmsp.FlexDataGridColumn.apply(this, []);
        this.setColumnWidthMode(flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIXED);
        this.setDataCellRenderer(flexiciousNmsp.FlexDataGridCheckBoxColumn.static_FlexDataGridDataCellUIComponent);
        this.headerRenderer = this.itemRenderer = a.static_TriStateCheckBox;
        this.setWidth(25);
        this.resizable = this.sortable = !1;
        this.excludeFromSettings = this.excludeFromPrint = this.excludeFromExport = !0;
        this.setEditable(!1);
        this.enableDataCellOptmization = !1;
        this.headerPaddingLeft = this.paddingRight = this.paddingLeft = 1;
        this.setHeaderText("");
        this.headerPaddingRight = 1
    };
    flexiciousNmsp.FlexDataGridCheckBoxColumn = a;
    a.prototype = new flexiciousNmsp.FlexDataGridColumn;
    a.prototype.typeName = a.typeName = "FlexDataGridCheckBoxColumn";
    a.prototype.getClassNames = function() {
        return "FlexDataGridCheckBoxColumn FlexDataGridColumn CSSStyleDeclaration IFactory IFixedWidth IDataGridFilterColumn".split(" ")
    };
    a.static_TriStateCheckBox = new flexiciousNmsp.ClassFactory(flexiciousNmsp.TriStateCheckBox, void 0);
    a.static_FlexDataGridDataCellUIComponent = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridDataCell, void 0);
    a.prototype.newInstance = function() {
        return new flexiciousNmsp.FlexDataGridCheckBoxColumn
    };
    a.prototype.getEnableSelectAll = function() {
        return this.allowSelectAll
    };
    a.prototype.setEnableSelectAll = function(a) {
        this.allowSelectAll = a
    };
    a.prototype.getEnableRadioButtonMode = function() {
        return this.radioButtonMode
    };
    a.prototype.setEnableRadioButtonMode = function(a) {
        this.radioButtonMode = a
    }
})(window);
(function() {
    var a;
    a = function() {
        this.columnGroupCellRenderer = a.static_FlexDataGridColumnGroupCell;
        this.parentGroup = null;
        this.columnGroups = [];
        this.calculatedEnd = this.calculatedStart = this._startColumn = null;
        this._columns = [];
        this.level = this.headerText = this._endColumn = null;
        this._y = this._depth = 0;
        this.enableExpandCollapse = this.columnGroupRenderer = null;
        this.expandCollapsePositionFunction = this.defaultPositionFunction;
        this.expandTooltip = "Expand";
        this.collapseTooltip = "Collapse";
        this.expandCollapseTooltipFunction = this.defaultExpandCollapseTooltipFunction;
        this._groupedColumns = [];
        this.collapseStateColumn = null;
        this.useLastColumnAsCollapseStateColumn = !1;
        flexiciousNmsp.TypedObject.apply(this, [])
    };
    flexiciousNmsp.FlexDataGridColumnGroup = a;
    a.prototype = new flexiciousNmsp.EventDispatcher;
    a.prototype.typeName = a.typeName = "FlexDataGridColumnGroup";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridColumnGroup", "EventDispatcher"]
    };
    a.static_FlexDataGridColumnGroupCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridColumnGroupCell);
    a.prototype.getColumns = function() {
        return this._columns
    };
    a.prototype.invalidateCalculations = function() {
        if (this.calculatedEnd || this.calculatedStart) this.calculatedEnd = this.calculatedStart = null, this.parentGroup && this.parentGroup.invalidateCalculations()
    };
    a.prototype.invalidateCalculationsDown = function() {
        this.calculatedEnd = this.calculatedStart = null;
        for (var a = 0; a < this.columnGroups.length; a++) this.columnGroups[a].invalidateCalculationsDown()
    };
    a.prototype.defaultExpandCollapseTooltipFunction = function() {
        return !this.enableExpandCollapse ? "" : this.isClosed() ? this.expandTooltip + " " + this.getHeaderText() : this.collapseTooltip + " " + this.getHeaderText()
    };
    a.prototype.defaultPositionFunction = function(a) {
        return new flexiciousNmsp.Point(2, a.getHeight() / 4)
    };
    a.prototype.isClosed = function() {
        var a = this.getAllColumns();
        if (0 == a.length) return !1;
        this.collapseStateColumn || (this.collapseStateColumn = a[0]);
        for (var d = 0; d < a.length; d++) if (a[d].getVisible() && a[d] != this.collapseStateColumn) return !1;
        return !0
    };
    a.prototype.openColumns = function() {
        for (var a = this.getAllColumns(), d = 0; d < a.length; d++) {
            var b = a[d];
            b._visible = !0;
            b.calcualtedMeasurements = {}
        }
        a = this.getStartColumn();
        a.level.invalidateCache();
        a.level._wxInvalid = !0;
        a.level.grid.reDraw()
    };
    a.prototype.closeColumns = function() {
        this.collapseStateColumn || (this.collapseStateColumn = this.getStartColumn());
        for (var a = this.getAllColumns(), d = 0; d < a.length; d++) {
            var b = a[d];
            b._visible = b == this.collapseStateColumn;
            b.calcualtedMeasurements = {}
        }
        this.collapseStateColumn.level.invalidateCache();
        this.collapseStateColumn.level._wxInvalid = !0;
        this.collapseStateColumn.level.grid.reDraw()
    };
    a.prototype.initializeGroup = function() {
        var a;
        for (a = 0; a < this.columnGroups.length; a++) {
            var d = this.columnGroups[a];
            d.parentGroup = this;
            d.level = this.level;
            d.initializeGroup()
        }
        d = !1;
        if (0 == this.columnGroups.length) {
            var b = this.level.getColumns();
            for (a = 0; a < b.length; a++) {
                var g = b[a];
                if (g == this.getStartColumn()) d = !0;
                else if (g == this.getEndColumn()) {
                    g.columnGroup = this;
                    break
                }
                if (this.getStartColumn() == this.getEndColumn()) break;
                d && (g.columnGroup = this)
            }
        }
    };
    a.prototype.initializeDepthY = function(a, d) {
        "undefined" == typeof a && (a = 1);
        "undefined" == typeof d && (d = 0);
        0 == this._y && (this._y = d);
        0 == this._depth && (this._depth = a);
        a += 1;
        d += this.getHeight();
        if (0 < this.columnGroups.length) for (var b = 0; b < this.columnGroups.length; b++) {
            var g = this.columnGroups[b];
            g.level || (g.level = this.level);
            g.initializeDepthY(a, d)
        }
    };
    a.prototype.getWX = function() {
        return !this.getStartColumn() ? [-1, -1] : this.getEndColumn() && this.getEndColumn().getVisible() ? [this.getEndColumn().getX() + this.getEndColumn().getWidth() - this.getStartColumn().getX(), this.getStartColumn().getX()] : [this.getStartColumn().getWidth(), this.getStartColumn().getX()]
    };
    a.prototype.getAllColumns = function(a) {
        "undefined" == typeof a && (a = null);
        var d;
        a || (a = []);
        for (d = 0; d < this._columns.length; d++) {
            var b = this._columns[d]; - 1 == a.indexOf(b) && a.push(b)
        }
        for (d = 0; d < this.columnGroups.length; d++) this.columnGroups[d].getAllColumns(a);
        return a
    };
    a.prototype.getColumnAtExtremity = function(a) {
        "undefined" == typeof a && (a = !0);
        if (a && this.calculatedStart) return this.calculatedStart;
        if (!a && this.calculatedEnd) return this.calculatedEnd;
        var d, b, g;
        if (0 < this.columnGroups.length && 0 == this.getColumns().length) for (b = 0; b < this.columnGroups.length; b++) g = this.columnGroups[b].getColumnAtExtremity(a), !d && g && (d = g), g && (a && d.getColIndex() > g.getColIndex() && (d = g), !a && d.getColIndex() < g.getColIndex() && (d = g));
        else if (a) for (b = 0; b < this._columns.length; b++) {
            if (g = this._columns[b], g.getVisible()) {
                d = g;
                break
            }
        } else if (!a) {
            b = this._columns.slice().reverse();
            for (var f = 0; f < b.length; f++) if (g = b[f], g.getVisible()) {
                d = g;
                break
            }
        }
        a ? this.calculatedStart = d : this.calculatedEnd = d;
        return d
    };
    a.prototype.clone = function(a) {
        var d = new flexiciousNmsp.FlexDataGridColumnGroup;
        if (this._startColumn) {
            var b = this.level.getPrintableColumns().indexOf(this._startColumn);
            d.setStartColumn(a.getPrintableColumns()[b])
        }
        this._endColumn && (b = this.level.getPrintableColumns().indexOf(this._endColumn), d.setEndColumn(a.getPrintableColumns()[b]));
        for (b = 0; b < this.columnGroups.length; b++) d.columnGroups.push(this.columnGroups[b].clone(a));
        d.setColumns(this._columns);
        d.setHeaderText(this.getHeaderText());
        d.level = a;
        return d
    };
    a.prototype.getDepth = function() {
        return this._depth
    };
    a.prototype.getY = function() {
        return this._y
    };
    a.prototype.getChildren = function() {
        return this.getAllColumns()
    };
    a.prototype.setChildren = function(a) {
        this.setColumns(a)
    };
    a.prototype.getIsColumnOnly = function() {
        return 0 == this.columnGroups.length && 0 < this._columns.length
    };
    a.prototype.getRootGroup = function() {
        return this.parentGroup ? this.parentGroup.getRootGroup() : this
    };
    a.prototype.getHeight = function() {
        return this.level.getHeaderHeight()
    };
    a.prototype.getGroupedColumns = function() {
        return 0 == this._groupedColumns.length ? this.getColumns() : this._groupedColumns
    };
    a.prototype.setGroupedColumns = function(a) {
        this._groupedColumns = a.slice();
        var d = [],
            b = [],
            g;
        for (g = 0; g < a.length; g++) {
            var f = a[g];
            if (f.implementsOrExtends("FlexDataGridColumnGroup")) {
                for (var e = f.getAllColumns(), h = 0; h < e.length; h++) d.push(e[h]);
                b.push(f)
            } else f.columnGroup = this, d.push(f)
        }
        this.setColumns(d);
        this.columnGroups = b
    };
    a.prototype.getColumns = function() {
        return this._columns.slice()
    };
    a.prototype.setColumns = function(a) {
        this.invalidateCalculations();
        this._columns = a;
        0 < a.length && (this.setStartColumn(a[0]), this.setEndColumn(a[a.length - 1]), this.useLastColumnAsCollapseStateColumn && (this.collapseStateColumn = this.getEndColumn()))
    };
    a.prototype.getEndColumn = function() {
        return this.calculatedEnd ? this.calculatedEnd : this.getColumnAtExtremity(!1)
    };
    a.prototype.setEndColumn = function(a) {
        this._endColumn = a
    };
    a.prototype.getStartColumn = function() {
        return this.calculatedStart ? this.calculatedStart : this.getColumnAtExtremity(!0)
    };
    a.prototype.setStartColumn = function(a) {
        this._startColumn = a
    };
    a.prototype.getHeaderText = function() {
        return this.headerText
    };
    a.prototype.setHeaderText = function(a) {
        this.headerText = a
    };
    a.prototype.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.columnGroups && this.killArray(this.columnGroups);
        this._columns && this.killArray(this._columns);
        this.parentGroup = null
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function(d) {
        this.reusePreviousLevelColumns = !1;
        this._headerHeight = this._rowHeight = 25;
        this._selectedObjects = [];
        this.levelName = this.parentField = this.childrenCountField = this.disabledField = this.selectableField = this.selectedKeyField = "";
        this.headerSeperatorWidth = 4;
        this.nestIndent = 15;
        this.currentSorts = [];
        this._nestDepth = null;
        this._filterArgs = [];
        this._parentLevel = this._calculatedSelectedKeysCursor = this._calculatedSelectedKeys = null;
        this.columnGroups = [];
        this._groupedColumns = [];
        this.hasGroupedColumns = !1;
        this._columns = [];
        this.columnWidthModeFitToContentSampleSize = 100;
        this.initialSortField = this.nextLevel = null;
        this.initialSortAscending = !0;
        this.forcePagerRow = this.enablePaging = !1;
        this._pagerRenderer = null;
        this.pageSize = 5;
        this._pageIndex = 0;
        this.pagerPosition = null;
        this._enableFooters = !1;
        this.pagerVisible = this.footerVisible = !0;
        this._footerRowHeight = 25;
        this._pagerRowHeight = 30;
        this._filterRowHeight = 25;
        this._enableFilters = !1;
        this.headerVisible = this.filterVisible = !0;
        this.itemLoadMode = this.filterPageSortMode = "client";
        this.nextLevelRenderer = null;
        this.levelRendererHeight = 0;
        this.expandCollapseCellRenderer = a.static_FlexDataGridExpandCollapseCell;
        this.expandCollapseHeaderCellRenderer = a.static_FlexDataGridExpandCollapseHeaderCell;
        this.nestIndentPaddingCellRenderer = a.static_FlexDataGridPaddingCell;
        this._cellCustomDrawFunction = this.cellBorderFunction = this.rowTextColorFunction = this._rowBackgroundFunction = this.rowSelectableFunction = this.rowDisabledFunction = this.scrollbarPadRenderer = this.nestIndentPaddingRenderer = null;
        this.pagerCellRenderer = flexiciousNmsp.FlexDataGridColumnLevel.static_FlexDataGridPagerCell;
        this.additionalFilterArgumentsFunction = null;
        this.displayOrder = "pager,header,filter,body,footer";
        this._cachedVisibleColumns = {};
        this._lockCache = {};
        this._flowHeaderColumns = this._flowColumns = null;
        this._wxInvalid = !0;
        this.selectedField = this.filterFunction = this._enableRowNumbers = null;
        this.defaultSelectionField = "";
        this.enableSingleSelect = !1;
        this._unSelectedObjects = [];
        this._pendingStyles = [];
        this.grid = d;
        this.minHeaderHeight = 20;
        this.childrenField = "children";
        this.textDisabledColor = this.textRollOverColor = this.textSelectedColor = this.pagerRollOverColors = this.pagerColors = this.rendererRollOverColors = this.rendererColors = this.columnGroupRollOverColors = this.columnGroupColors = this.headerRollOverColors = this.headerColors = this.filterRollOverColors = this.filterColors = this.footerRollOverColors = this.footerColors = this.activeCellColor = this.rollOverColor = this.columnGroupClosedIcon = this.columnGroupOpenIcon = this.disclosureClosedIcon = this.disclosureOpenIcon = this.selectionDisabledColor = this.selectionColor = this.editTextColor = this.editItemColor = this.alternatingTextColors = this.alternatingItemColors = this.rendererPaddingBottom = this.rendererPaddingTop = this.rendererPaddingRight = this.rendererPaddingLeft = this.pagerPaddingBottom = this.pagerPaddingTop = this.pagerPaddingRight = this.pagerPaddingLeft = this.filterPaddingBottom = this.filterPaddingTop = this.filterPaddingRight = this.filterPaddingLeft = this.footerPaddingBottom = this.footerPaddingTop = this.footerPaddingRight = this.footerPaddingLeft = this.headerPaddingBottom = this.headerPaddingTop = this.headerPaddingRight = this.headerPaddingLeft = this.paddingBottom = this.paddingTop = this.paddingRight = this.paddingLeft = this.sortArrowSkin = this.color = this.selectionColor = this.rendererDrawTopBorder = this.pagerDrawTopBorder = this.footerDrawTopBorder = this.filterDrawTopBorder = this.headerDrawTopBorder = this.rendererDrawTopBorder = this.rendererVerticalGridLineThickness = this.rendererHorizontalGridLineThickness = this.rendererHorizontalGridLineColor = this.rendererVerticalGridLineColor = this.rendererHorizontalGridLines = this.rendererVerticalGridLines = this.pagerDrawTopBorder = this.pagerVerticalGridLineThickness = this.pagerHorizontalGridLineThickness = this.pagerHorizontalGridLineColor = this.pagerVerticalGridLineColor = this.pagerHorizontalGridLines = this.pagerVerticalGridLines = this.footerDrawTopBorder = this.footerVerticalGridLineThickness = this.footerHorizontalGridLineThickness = this.footerHorizontalGridLineColor = this.footerVerticalGridLineColor = this.footerHorizontalGridLines = this.footerVerticalGridLines = this.filterDrawTopBorder = this.filterVerticalGridLineThickness = this.filterHorizontalGridLineThickness = this.filterHorizontalGridLineColor = this.filterVerticalGridLineColor = this.filterHorizontalGridLines = this.filterVerticalGridLines = this.columnGroupDrawTopBorder = this.columnGroupVerticalGridLineThickness = this.columnGroupHorizontalGridLineThickness = this.columnGroupHorizontalGridLineColor = this.columnGroupVerticalGridLineColor = this.columnGroupHorizontalGridLines = this.columnGroupVerticalGridLines = this.headerDrawTopBorder = this.headerVerticalGridLineThickness = this.headerHorizontalGridLineThickness = this.headerHorizontalGridLineColor = this.headerVerticalGridLineColor = this.headerHorizontalGridLines = this.headerVerticalGridLines = this.verticalGridLineThickness = this.horizontalGridLineThickness = this.horizontalGridLineColor = this.verticalGridLineColor = this.horizontalGridLines = this.verticalGridLines = this.footerStyleName = this.headerStyleName = this.columnGroupStyleName = this.multiColumnSortNumberStyleName = this.multiColumnSortNumberHeight = this.multiColumnSortNumberWidth = this.textIndent = this.textFieldClass = this.textDecoration = this.textAlign = this.locale = this.letterSpacing = this.kerning = this.fontWeight = this.fontThickness = this.fontStyle = this.fontSize = this.fontSharpness = this.fontGridFitType = this.fontFamily = this.fontAntiAliasType = this.disabledColor = this.color = this.backgroundColor = null;
        flexiciousNmsp.EventDispatcher.apply(this)
    };
    flexiciousNmsp.FlexDataGridColumnLevel = a;
    a.prototype = new flexiciousNmsp.EventDispatcher;
    a.prototype.typeName = a.typeName = "FlexDataGridColumnLevel";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridColumnLevel", "CSSStyleDeclaration"]
    };
    a.static_FlexDataGridExpandCollapseCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridExpandCollapseCell, void 0);
    a.static_FlexDataGridExpandCollapseHeaderCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridExpandCollapseHeaderCell, void 0);
    a.static_FlexDataGridPaddingCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridPaddingCell, void 0);
    a.static_FlexDataGridPagerCell = new flexiciousNmsp.ClassFactory(flexiciousNmsp.FlexDataGridPagerCell, void 0);
    a.static_FlexDataGridPager = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PagerControl, void 0);
    a.EVENT_ITEMCLOSE = "itemClose";
    a.EVENT_ITEMOPEN = "itemOpen";
    a.EVENT_ITEMOPENING = "itemOpening";
    a.EVENT_ITEMLOAD = "itemLoad";
    a.EVENT_FILTERPAGESORTCHANGE = "filterPageSortChange";
    a.EVENT_HEADERCLICKED = "headerClicked";
    a.EVENT_COLUMNSRESIZED = "columnsResized";
    a.EVENT_ITEMEDITBEGINNING = "itemEditBeginning";
    a.EVENT_ITEMEDITBEGIN = "itemEditBegin";
    a.EVENT_ITEMEDITEND = "itemEditEnd";
    a.EVENT_ITEMEDITCANCEL = "itemEditCancel";
    a.EVENT_ITEMEDITVALUECOMMIT = "itemEditValueCommit";
    a.EVENT_CHANGE = "change";
    a.EVENT_ITEMROLLOVER = "itemRollOver";
    a.EVENT_ITEMROLLOUT = "itemRollOut";
    a.EVENT_ITEMCLICK = "itemClick";
    a.EVENT_ITEMDOUBLECLICK = "itemDoubleClick";
    a.prototype.getMaxColumnGroupDepthOrHeight = function(a, b, c) {
        "undefined" == typeof a && (a = 0);
        "undefined" == typeof b && (b = null);
        "undefined" == typeof c && (c = "depth");
        null == b && (b = this.columnGroups);
        "depth" == c && (a += 1);
        for (var f = a, e = 0; e < b.length; e++) {
            var h = b[e];
            "height" == c && (a += h.getHeight());
            var j = this.getMaxColumnGroupDepthOrHeight(f, h.columnGroups, c);
            j > a && (a = j);
            "height" == c && (a -= h.getHeight())
        }
        return a
    };
    a.prototype.getMaxColumnGroupDepth = function() {
        return this.getMaxColumnGroupDepthOrHeight(0, null, "depth")
    };
    a.prototype.checkRowDisabled = function(a, b) {
        return b && b.hasOwnProperty(this.disabledField) && b[this.disabledField]
    };
    a.prototype.getSortIndex = function(a, b, c) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = !1);
        if (this.reusePreviousLevelColumns && this.getParentLevel()) return this.getParentLevel().getSortIndex(a);
        for (var f = 0, e = 0; e < this.currentSorts.length; e++) {
            var h = this.currentSorts[e];
            f++;
            if (a.getSortFieldName() == h.sortColumn) return c ? h : f
        }
        return c ? null : b ? 1 : -1
    };
    a.prototype.hasSort = function(a) {
        if (this.reusePreviousLevelColumns && this.getParentLevel()) return this.getParentLevel().hasSort(a);
        for (var b = 0; b < this.currentSorts.length; b++) {
            var c = this.currentSorts[b];
            if (a.getSortFieldName() == c.sortColumn) return c
        }
        return null
    };
    a.prototype.addSort = function(a) {
        var b = this.getColumnByDataField(a.sortColumn, "sortField"),
            c = new flexiciousNmsp.FilterSort;
        if (b) {
            var f = this.getSortIndex(b, !1, !0);
            f && (c = f);
            c.sortNumeric = a.sortNumeric;
            c.sortCaseInsensitive = a.sortCaseInsensitive;
            c.sortColumn = a.sortColumn;
            c.sortCompareFunction = null != a.sortCompareFunction ? a.sortCompareFunction : null != b.sortCompareFunction ? b.sortCompareFunction : null;
            c.isAscending = a.isAscending;
            f || this.currentSorts.push(c)
        } else this.currentSorts.push(a)
    };
    a.prototype.removeAllSorts = function() {
        this.currentSorts.removeAll();
        this.nextLevel && this.nextLevel.removeAllSorts()
    };
    a.prototype.setCurrentSort = function(a, b) {
        this.reusePreviousLevelColumns && this.getParentLevel() && this.getParentLevel().setCurrentSort(a, b);
        this.currentSorts.removeAll();
        var c = new flexiciousNmsp.FilterSort;
        c.sortCaseInsensitive = a.sortCaseInsensitive;
        c.sortNumeric = a.sortNumeric;
        c.sortColumn = a.getSortFieldName();
        c.sortCompareFunction = a.sortCompareFunction;
        c.isAscending = b;
        this.currentSorts.push(c)
    };
    a.prototype.createAscendingSortIcon = function() {
        return this.createSortArrow(!0)
    };
    a.prototype.createDescendingSortIcon = function() {
        return this.createSortArrow(!1)
    };
    a.prototype.createSortArrow = function(a) {
        var b = new flexiciousNmsp.UIComponent("img"),
            c = this.getStyleValue("sortArrowSkin");
        b.domElement.src = this.grid.imagesRoot + c;
        b.domElement.className = "sortIcon";
        a || (b.domElement.className += " descendingSort");
        return b
    };
    a.prototype.onSelectedKeysChange = function() {
        this.grid.invalidateSelection();
        this._calculatedSelectedKeys = null
    };
    a.prototype.checkRowSelectable = function(a, b) {
        return null != this.rowSelectableFunction ? this.rowSelectableFunction(a, b) : null != this.rowDisabledFunction ? !this.rowDisabledFunction(a, b) : this.selectableField && b.hasOwnProperty(this.selectableField) ? b[this.selectableField] : !0
    };
    a.prototype.calculateChromeTopHeight = function() {
        return this.getHeaderHeight() * this.getMaxColumnGroupDepth()
    };
    a.prototype.calculateChromeBottomHeight = function() {
        var a;
        a = 0 + (this.getEnableFooters() ? this.getFooterRowHeight() : 0);
        return a += this.enablePaging ? this.getPagerRowHeight() : 0
    };
    a.prototype.setDepth = function(a) {
        "undefined" == typeof a && (a = 1);
        this._nestDepth = a;
        this.nextLevel && (a++, this.nextLevel.setDepth(a));
        1 < this.getNestDepth() && 0 == this.displayOrder.indexOf("pager") && (this.displayOrder = "header,filter,body,footer,pager")
    };
    a.prototype.setParentLevel = function() {
        this.nextLevel && (this.nextLevel._parentLevel = this, this.nextLevel.setParentLevel(this))
    };
    a.prototype.setGrid = function(a) {
        this.grid = a;
        this.nextLevel && this.nextLevel.setGrid(a)
    };
    a.prototype.invalidateCache = function() {
        this._cachedVisibleColumns = {};
        this._lockCache = {};
        this._flowColumns = null
    };
    a.prototype.setColumnLevel = function() {
        this._wxInvalid = !1;
        this.invalidateCache();
        var a;
        if (!this.reusePreviousLevelColumns || !this.getParentLevel()) {
            this.invalidateCalculationsDown();
            var b = new flexiciousNmsp.InsertionLocationInfo,
                c = this.getVisibleColumns();
            for (a = 0; a < c.length; a++) {
                var f = c[a];
                f.getIsLeftLocked() ? (f.setX(b.leftLockedContentX), b.leftLockedContentX += f.getWidth()) : f.getIsRightLocked() ? (f.setX(b.rightLockedContentX), b.rightLockedContentX += f.getWidth()) : (f.setX(b.contentX), b.contentX += f.getWidth());
                f.level = this
            }
            b = this.columnGroups;
            for (a = 0; a < b.length; a++) c = b[a], c.level = this, c.initializeGroup(), c.initializeDepthY()
        }
        this.nextLevel && this.nextLevel.setColumnLevel()
    };
    a.prototype.invalidateCalculationsDown = function() {
        for (var a = 0; a < this.columnGroups.length; a++) this.columnGroups[a].invalidateCalculationsDown()
    };
    a.prototype.clearSelection = function(a) {
        "undefined" == typeof a && (a = !0);
        0 < this.getSelectedCells().length && this.getSelectedCells().removeAll();
        0 < this._selectedObjects.length || 0 < this._unSelectedObjects.length ? (this._selectedObjects.removeAll(), this._unSelectedObjects.removeAll(), this.onSelectedKeysChange()) : a = !1;
        this.nextLevel && this.nextLevel.clearSelection(!1);
        a && (a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.grid, this, null), this.dispatchEvent(a))
    };
    a.prototype.initializeLevel = function() {
        this.setDepth();
        this.setGrid(this.grid);
        this.setParentLevel();
        this.setColumnLevel();
        this.ensureRowNumberColumn()
    };
    a.prototype.cascadeProperty = function(a, b) {
        this[a] = b;
        this.nextLevel && this.nextLevel.cascadeProperty(a, b)
    };
    a.prototype.transferProps = function(a, b, g) {
        "undefined" == typeof g && (g = !1);
        var f = new flexiciousNmsp.FlexDataGridColumnLevel;
        f.grid = a.grid;
        for (var e in a) if (a.hasOwnProperty(e) && c.isPrimitive(a[e]) && b[e] != a[e] && (!g || a[e] != f[e])) b[e] = a[e]
    };
    a.prototype.clone = function(a) {
        "undefined" == typeof a && (a = !0);
        var b = new flexiciousNmsp.FlexDataGridColumnLevel,
            c = [],
            f;
        this.transferProps(this, b);
        if (a) {
            var e = !1,
                h = this.getGroupedColumns();
            for (a = 0; a < h.length; a++) f = h[a], f.implementsOrExtends("FlexDataGridColumnGroup") && (e = !0);
            for (a = 0; a < h.length; a++) f = h[a], c.push(this.cloneColumn(f));
            e ? b.setGroupedColumns(c.slice()) : b.setColumns(c.slice());
            b.currentSorts = this.currentSorts.slice();
            this.nextLevel && (b.nextLevel = this.nextLevel.clone())
        }
        return b
    };
    a.prototype.cloneColumn = function(a) {
        var b;
        b = a.implementsOrExtends("IFactory") ? a.newInstance() : a.implementsOrExtends("FlexDataGridColumnGroup") ? new flexiciousNmsp.FlexDataGridColumnGroup : new flexiciousNmsp.FlexDataGridColumn;
        for (var g in a) if (a.hasOwnProperty(g) && (c.isPrimitive(a[g]) || a[g].implementsOrExtends("IFactory") || a[g].implementsOrExtends("Function") || a[g].implementsOrExtends("Formatter)"))) b[g] = a[g];
        if (a.implementsOrExtends("FlexDataGridColumnGroup")) {
            g = [];
            var f = [];
            a = 0 < a.columnGroups.length ? a.columnGroups : a.getChildren();
            for (var e = 0; e < a.length; e++) {
                var h = this.cloneColumn(a[e]);
                h.implementsOrExtends("FlexDataGridColumnGroup") ? f.push(h) : g.push(h)
            }
            0 < g.length ? b.setColumns(g) : 0 < f.length && (b.columnGroups = f)
        }
        return b
    };
    a.prototype.getRowHeightFromType = function(a) {
        return a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER || a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP ? this.getHeaderHeight() : a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER ? this.getFooterRowHeight() : a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER ? this.getPagerRowHeight() : a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_RENDERER ? this.levelRendererHeight : a == flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER ? this.getFilterRowHeight() : this.getRowHeight()
    };
    a.prototype.getSumOfColumnWidths = function(a) {
        "undefined" == typeof a && (a = null);
        a || (a = [flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE, flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT, flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT]);
        var b = 0;
        a = this.getVisibleColumns(a);
        for (var c = 0; c < a.length; c++) b += a[c].getWidth();
        return b
    };
    a.prototype.getVisibleColumns = function(a) {
        "undefined" == typeof a && (a = null);
        var b = a ? a.join("_") : "";
        if (this._cachedVisibleColumns[b]) return this._cachedVisibleColumns[b];
        for (var c = [], f = this.getColumns(), e = 0; e < f.length; e++) {
            var h = f[e];
            h.getVisible() && (!a || 0 <= a.indexOf(h.getColumnLockMode())) && c.push(h)
        }
        return this._cachedVisibleColumns[b] = c
    };
    a.prototype.getExportableColumns = function(a, b, c) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof b && (b = !1);
        "undefined" == typeof c && (c = null);
        var f = [],
            e, h = this.getColumns();
        for (e = 0; e < h.length; e++) {
            var j = h[e];
            !j.excludeFromExport && -1 == f.indexOf(j) && f.push(j)
        }
        if (b && this.nextLevel) {
            a = this.nextLevel.getExportableColumns(a, b, c);
            for (e = 0; e < a.length; e++) b = a[e], -1 == f.indexOf(b) && f.push(b)
        }
        a = [];
        if (c) for (e = 0; e < f.length; e++) b = f[e], (!c.excludeHiddenColumns || b.getVisible()) && a.push(b);
        else return f;
        return a
    };
    a.prototype.getSortableColumns = function() {
        for (var a = [], b = this.getColumns(), c = 0; c < b.length; c++) {
            var f = b[c];
            f.sortable && -1 == a.indexOf(f) && a.push(f)
        }
        return a
    };
    a.prototype.getFilterArguments = function() {
        return this._filterArgs
    };
    a.prototype.clearFilter = function(a) {
        "undefined" == typeof a && (a = !0);
        this._filterArgs.removeAll();
        a && this.nextLevel.clearFilter(!0)
    };
    a.prototype.getShowableColumns = function(a, b) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof b && (b = !1);
        var c = [],
            f, e = this.getColumns();
        for (f = 0; f < e.length; f++) {
            var h = e[f];
            !h.excludeFromSettings && -1 == c.indexOf(h) && c.push(h)
        }
        if (b && this.nextLevel) {
            e = this.nextLevel.getShowableColumns(a, b);
            for (f = 0; f < e.length; f++) h = e[f], -1 == c.indexOf(h) && c.push(h)
        }
        return c
    };
    a.prototype.getPrintableColumns = function(a, b) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof b && (b = !0);
        var c = [],
            f, e = this.getColumns();
        for (f = 0; f < e.length; f++) {
            var h = e[f];
            !h.excludeFromPrint && -1 == c.indexOf(h) && c.push(h)
        }
        if (b && this.nextLevel) {
            e = this.nextLevel.getPrintableColumns(a, b);
            for (f = 0; f < e.length; f++) h = e[f], -1 == c.indexOf(h) && c.push(h)
        }
        return c
    };
    a.prototype.createFilter = function(a, b) {
        var c = new flexiciousNmsp.AdvancedFilter,
            f, e;
        c.sorts = this.currentSorts.slice();
        if (b) {
            var h = b.filterExpressions;
            for (f = 0; f < h.length; f++) e = h[f], c.filterExpressions.push(e)
        }
        if (null != this.additionalFilterArgumentsFunction) {
            h = this.additionalFilterArgumentsFunction(this);
            for (f = 0; f < h.length; f++) e = h[f], c.filterExpressions.push(e)
        }
        this.enablePaging && -1 == c.pageIndex && (c.pageIndex = 0);
        c.pageSize = this.pageSize;
        c.parentObject = a;
        c.level = this;
        return c
    };
    a.prototype.getWidestRightLockedWidth = function(a) {
        "undefined" == typeof a && (a = -1);
        var b = this.getRightLockedWidth();
        a < b && (a = b);
        b = this.nextLevel ? this.nextLevel.getWidestRightLockedWidth(a) : 0;
        a < b && (a = b);
        return a
    };
    a.prototype.getWidestLeftLockedWidth = function(a) {
        "undefined" == typeof a && (a = -1);
        var b = this.getLeftLockedWidth();
        a < b && (a = b);
        b = this.nextLevel ? this.nextLevel.getWidestLeftLockedWidth(a) : 0;
        a < b && (a = b);
        return a
    };
    a.prototype.getColumnsByLockMode = function(a) {
        if (this._lockCache[a]) return this._lockCache[a];
        for (var b = [], c = this.getVisibleColumns(a), f = 0; f < c.length; f++) b.push(c[f]);
        return this._lockCache[a] = b
    };
    a.prototype.getWidestWidth = function(a, b) {
        "undefined" == typeof b && (b = !0);
        var c = this.grid.lockDisclosureCell ? 0 : this.getNestDepth() * this.getNestIndent(),
            c = c + this.getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]);
        a < c && (a = c);
        c = this.nextLevel && b ? this.nextLevel.getWidestWidth(a) : 0;
        a < c && (a = c);
        return a
    };
    a.prototype.getColumnsByWidthMode = function(a) {
        for (var b = [], c = this.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]), f = 0; f < c.length; f++) {
            var e = c[f];
            0 <= a.indexOf(e.getColumnWidthMode()) && b.push(e)
        }
        return b
    };
    a.prototype.setColumnWidthsUsingWidthMode = function(a) {
        "undefined" == typeof a && (a = !1);
        var b = 0,
            c = this.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]),
            f, e, h;
        if (!this.grid.getForceColumnsToFitVisibleArea()) {
            var j = this.getColumns();
            for (e = 0; e < j.length; e++) h = j[e], h._naturalLastColWidth && (h.setWidth(h._naturalLastColWidth), h._naturalLastColWidth = 0);
            0 < c.length && (h = c[c.length - 1])
        }
        j = this.getAvailableWidth();
        if (a) for (e = 0; e < c.length; e++) a = c[e], a.setWidth(j / c.length);
        else {
            0 < this.getColumnsByWidthMode([flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIT_TO_CONTENT]).length && (f = this.grid.flatten(this.getNestDepth(), !1, !0, !0, !0, this.columnWidthModeFitToContentSampleSize));
            for (e = 0; e < c.length; e++) if (a = c[e], this.grid.getForceColumnsToFitVisibleArea() || a.getIsLocked() || !a.getIsLastUnLocked()) a.getColumnWidthMode() == flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIXED || a.getColumnWidthMode() == flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_NONE ? b += a.getWidth() : a.getColumnWidthMode() == flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIT_TO_CONTENT && (this.applyColumnWidthFromContent(a, f), b += a.getWidth());
            if (this.grid.getForceColumnsToFitVisibleArea()) {
                f = j - b;
                if (0 < f) {
                    c = this.getColumnsByWidthMode([flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_PERCENT]);
                    for (e = 0; e < c.length; e++) if (a = c[e], h = a.percentWidth) a.setWidth(h * f / 100), b += a.getWidth()
                }
                f = j - b;
                c = this.getColumnsByWidthMode([flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_NONE, flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_PERCENT]);
                for (e = 0; e < c.length; e++) a = c[e], a.setWidth(a.getWidth() + f / c.length), a.getWidth() < a.minWidth && a.setWidth(a.minWidth);
                f = j - this.getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]);
                c = this.getColumnsByWidthMode([flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_NONE, flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_PERCENT, flexiciousNmsp.FlexDataGridColumn.COLUMN_WIDTH_MODE_FIT_TO_CONTENT]);
                for (e = b = 0; e < c.length; e++) a = c[e], a.getWidth() > a.minWidth && (b += a.getWidth());
                if (0 < b) for (e = 0; e < c.length; e++) a = c[e], a.getWidth() > a.minWidth && a.setWidth(a.getWidth() + f * a.getWidth() / b);
                c = this.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]);
                e = this.getSumOfColumnWidths([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE]) - j;
                0 < c.length && (a = c[c.length - 1], a.setWidth(a.getWidth() - e));
                c = this.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT]);
                0 < c.length && (e = this.getWidestRightLockedWidth() - this.grid.getRightLockedContent().getWidth(), a = c[c.length - 1], a.setWidth(a.getWidth() - e));
                c = this.getVisibleColumns([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT]);
                0 < c.length && (e = this.getWidestLeftLockedWidth() - this.grid.getLeftLockedContent().getWidth(), a = c[c.length - 1], a.setWidth(a.getWidth() - e));
                this.nextLevel && this.nextLevel.setColumnWidthsUsingWidthMode();
                this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, this.grid))
            } else b < j && h && (h._naturalLastColWidth || (h._naturalLastColWidth = h.getWidth()), h.setWidth(j - b)), this.nextLevel && this.nextLevel.setColumnWidthsUsingWidthMode()
        }
    };
    a.prototype.applyColumnWidthFromContent = function(a, b) {
        for (var c = a.columnWidthOffset, f = "", e = 0; e < b.length; e++) {
            var h = b[e];
            null != h && (h = a.itemToLabel(h).toString()) && f.length < h.length && (f = h)
        }
        a.getHeaderText() && (f.length < a.getHeaderText().length && !a.columnWidthModeFitToContentExcludeHeader) && (f = a.getHeaderText());
        0 < f.length && (f = this.grid.measureText(f), a.setWidth(f.width + c + a.getStyleValue("paddingLeft") + a.getStyleValue("paddingRight")));
        a.getWidth() < a.minWidth && a.setWidth(a.minWidth)
    };
    a.prototype.getAvailableWidth = function() {
        return this.grid.getForceColumnsToFitVisibleArea() ? this.grid.getBodyContainer().getWidth() - this.grid.isVScrollBarVisible : Math.max(this.grid.getColumnLevel().getWidestWidth(-1, !1), this.grid.getBodyContainer().getWidth() - this.grid.isVScrollBarVisible)
    };
    a.prototype.adjustColumnWidths = function(a, b) {
        "undefined" == typeof b && (b = !1);
        this.setColumnWidthsUsingWidthMode(b)
    };
    a.prototype.getStyleValue = function(a) {
        var b = this.getStyle(a);
        void 0 == b && (b = this.grid.getStyle(a));
        return b
    };
    a.prototype.invalidateList = function() {
        this.grid && this.grid.reDraw()
    };
    a.prototype.areAllSelected = function(a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            if (!this.existsInCursor(c) && this.checkRowSelectable(null, c) || this.nextLevel && this.nextLevel.reusePreviousLevelColumns && !this.nextLevel.areAllSelected(this.getChildren(c), !1)) return !1
        }
        return !0
    };
    a.prototype.getItemKey = function(a, b) {
        "undefined" == typeof b && (b = !1);
        return b && this.selectedKeyField ? this.getValue(c.resolveExpression(a, this.selectedKeyField)) + "|" + this.getNestDepth() : this.selectedKeyField ? this.getValue(c.resolveExpression(a, this.selectedKeyField)) : a
    };
    a.prototype.getValue = function(a) {
        return a
    };
    a.prototype.isItemEqual = function(a, b, c) {
        return !c && b == a || c && this.getItemKey(b) == a
    };
    a.prototype.areItemsEqual = function(a, b) {
        return this.selectedKeyField ? c.resolveExpression(a, this.selectedKeyField) == c.resolveExpression(b, this.selectedKeyField) : a == b
    };
    a.prototype.getItemFromKey = function(a, b) {
        "undefined" == typeof b && (b = null);
        b || (b = this.grid.getRootFlat());
        for (var c = 0; c < b.length; c++) {
            var f = b[c];
            if (this.getItemKey(f) == a || this.nextLevel && (f = this.nextLevel.getItemFromKey(a, this.getChildren(f)))) return f
        }
        return null
    };
    a.prototype.isItemSelected = function(a, b) {
        "undefined" == typeof b && (b = !0);
        if (b && this.grid.enableSelectionExclusion) return this.getCheckBoxStateBasedOnExclusion(a) == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED;
        var g = !1;
        this.selectedKeyField ? (g = c.resolveExpression(a, this.selectedKeyField), g = -1 != this.getSelectedKeys().indexOf(g)) : g = -1 != this._selectedObjects.indexOf(a);
        return g
    };
    a.prototype.isItemOpen = function(a) {
        if (this.selectedKeyField) {
            a = c.resolveExpression(a, this.selectedKeyField);
            for (var b = this.grid.getOpenItems(), g = 0; g < b.length; g++) if (a == c.resolveExpression(b[g], this.selectedKeyField)) return !0;
            return !1
        }
        return 0 <= this.grid.getOpenItems().indexOf(a)
    };
    a.prototype.isCellSelected = function(a, b) {
        for (var c = this.getSelectedCells(), f = 0; f < c.length; f++) {
            var e = c[f];
            if (e.rowData == a && e.getColumn() == b) return e
        }
        return null
    };
    a.prototype.selectCell = function(a, b) {
        "undefined" == typeof b && (b = !0);
        var c = this.isCellSelected(a.rowInfo.getData(), a.getColumn());
        a.getColumn() && (b ? c || (a.level.grid.getSelectionMode() == flexiciousNmsp.NdgBase.SELECTION_MODE_SINGLE_CELL && this.getSelectedCells().removeAll(), this.getSelectedCells().push(new flexiciousNmsp.CellInfo(a.rowInfo.getData(), a.getColumn()))) : b || c && this.getSelectedCells().splice(this.getSelectedCells().indexOf(c), 1), c = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.grid, this, null), this.dispatchEvent(c))
    };
    a.prototype.shiftColumns = function(a, b, c) {
        "undefined" == typeof c && (c = !1);
        var f = this.getColumns().slice();
        f.splice(f.indexOf(a), 1);
        f.splice(f.indexOf(b), 0, a);
        this.setColumns(f);
        if (a.columnGroup && !c) {
            c = a.level.getGroupedColumns();
            for (f = 0; f < c.length; f++) {
                var e = c[f];
                e.implementsOrExtends("FlexDataGridColumnGroup") && this.swapColumns(e, a, b)
            }
        }
        this.setColumnLevel();
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COLUMNS_SHIFT, this.grid, this));
        this.grid.reDraw()
    };
    a.prototype.swapColumns = function(a, b, c) {
        var f = a.getColumns();
        0 <= f.indexOf(b) && 0 <= f.indexOf(c) && (f.splice(f.indexOf(b), 1), f.splice(f.indexOf(c), 0, b), a.setColumns(f));
        for (f = 0; f < a.columnGroups.length; f++) {
            var e = a.columnGroups[f];
            e.implementsOrExtends("FlexDataGridColumnGroup") && this.swapColumns(e, b, c)
        }
    };
    a.prototype.selectAll = function(a, b, g, f, e, h) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof g && (g = null);
        "undefined" == typeof f && (f = null);
        if (1 == this.getNestDepth()) {
            this.grid._useSelectedSelectAllState = a ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
            if (this.grid.enableSelectionExclusion) return this.grid.setSelectAllState(a ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED), !1;
            this.clearSelection(!1)
        }
        var j = !1;
        if (a) {
            g || (g = this.grid.getRootFlat(), 1 == this.getNestDepth() && this.grid.getIsClientFilterPageSortMode() && (g = c.filterArray(g, this.grid.getRootFilter(), this.grid, this, !1)));
            for (var k = 0; k < g.length; k++) {
                var l = g[k];
                if (!this.enableSingleSelect || !a || !this.defaultSelectionField || c.resolveExpression(l, this.defaultSelectionField)) {
                    var m = !0;
                    null != this.rowDisabledFunction && (m = !this.rowDisabledFunction(null, l));
                    m && (m = this.checkRowSelectable(null, l));
                    f && m && (m = 0 <= f.indexOf(e ? this.getItemKey(l) : l));
                    m && (this.addSelectedItem(l), j = !0);
                    if (this.nextLevel && (this.grid.enableSelectionCascade || f) && this.nextLevel.selectAll(a, !1, this.getChildren(l), f, e, h) && h) this.grid.getBodyContainer().addOpenItem(l), j = !0;
                    if (this.enableSingleSelect && m && !this.defaultSelectionField) break
                }
            }
        }
        b && (a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.grid, this, null), this.dispatchEvent(a));
        j && 1 == this.getNestDepth() && this.grid.rebuildBody();
        return j
    };
    a.prototype.selectRow = function(a, b, g, f, e, h) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof g && (g = !0);
        "undefined" == typeof f && (f = !0);
        "undefined" == typeof e && (e = !0);
        "undefined" == typeof h && (h = null);
        var j;
        if (this.grid.enableSelectionExclusion) this.selectRowExclusion(a, b);
        else {
            if (f && this.nextLevel && this.grid.enableSelectionCascade) {
                var k = this.getChildren(a, !1, !1, !1);
                if (this.nextLevel.enableSingleSelect) for (j = 0; j < k.length; j++) {
                    var l = k[j];
                    if (this.nextLevel.defaultSelectionField) {
                        if (c.resolveExpression(l, this.nextLevel.defaultSelectionField)) {
                            this.nextLevel.selectRow(l, b, !1, !0, !1, a);
                            break
                        }
                    } else {
                        this.nextLevel.selectRow(l, b, !1, !0, !1, a);
                        break
                    }
                } else for (j = 0; j < k.length; j++) this.nextLevel.selectRow(k[j], b, !1, !0, !1, a)
            }
            if (null != this.rowDisabledFunction && this.rowDisabledFunction(null, a) || !this.checkRowSelectable(null, a)) return;
            if (b && this.enableSingleSelect && 1 < this.getNestDepth()) {
                h || (h = this.grid.getParent(a, this));
                k = this.grid.getChildren(h, this.getParentLevel());
                for (j = 0; j < k.length; j++) l = k[j], this.getItemKey(l) != this.getItemKey(a) && this.isItemSelected(l) && this.selectRow(l, !1, !1, !1, !1, h)
            }
            this.grid.getSelectionMode() == flexiciousNmsp.NdgBase.SELECTION_MODE_SINGLE_ROW && this.grid.clearSelection();
            b ? this.addSelectedItem(a) : b || this.removeSelectedItem(a);
            f && (this.grid.enableSelectionBubble && e) && (this.enableSingleSelect && b ? this.getParentLevel() && (a = this.grid.getParent(a, this), this.getParentLevel().selectRow(a, !0, !1, !1, !1)) : this.bubbleSelection(a))
        }
        g && (g = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.grid, this, null), this.dispatchEvent(g))
    };
    a.prototype.bubbleSelection = function(a) {
        if (this.getParentLevel() && (a = this.grid.getParent(a, this))) {
            var b = this.grid.getChildren(a, this.getParentLevel());
            this.areAllSelected(b) ? this.getParentLevel().selectRow(a, !0, !1, !1, !1) : this.getParentLevel().isItemSelected(a, !1) && this.getParentLevel().selectRow(a, !1, !1, !1, !1);
            this.getParentLevel().bubbleSelection(a)
        }
    };
    a.prototype.existsInCursor = function(a) {
        return this.isItemSelected(a)
    };
    a.prototype.addSelectedItem = function(a) {
        -1 == this._selectedObjects.indexOf(a) && (this._selectedObjects.push(a), this.onSelectedKeysChange(), this.storeChain(a))
    };
    a.prototype.setEnablePaging = function(a) {
        this.enablePaging = a
    };
    a.prototype.storeChain = function(a) {
        this.grid.enableSelectionExclusion && (this.grid.selectionChain[this.getItemKey(a)] || (this.grid.selectionChain[this.getItemKey(a)] = []), this.pushIntoChain(this.grid.selectionChain[this.getItemKey(a)], a), this.grid.selectionChain[this.getItemKey(a)].reverse())
    };
    a.prototype.pushIntoChain = function(a, b) {
        a.push(b);
        if (this.getParentLevel()) {
            var c = this.grid.getParent(b, this);
            c && this.getParentLevel().pushIntoChain(a, c)
        }
    };
    a.prototype.removeSelectedItem = function(a) {
        if (0 < this.selectedKeyField.length && -1 == this._selectedObjects.indexOf(a)) for (var b = c.resolveExpression(a, this.selectedKeyField), g = 0; g < this._selectedObjects.length; g++) {
            var f = this._selectedObjects[g];
            if (b == c.resolveExpression(a, this.selectedKeyField)) {
                a = f;
                break
            }
        }
        a = this._selectedObjects.indexOf(a);
        0 <= a && this._selectedObjects.splice(a, 1);
        this.onSelectedKeysChange()
    };
    a.prototype.setSelectedKeysState = function(a) {
        this.clearSelection(!1);
        if (a == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED) {
            a = this.grid.getDataProvider();
            for (var b = 0; b < a.length; b++) this.addSelectedItem(a[b])
        }
        a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this.grid, this, null);
        this.dispatchEvent(a)
    };
    a.prototype.setSelectedObjects = function(a, b) {
        "undefined" == typeof b && (b = !0);
        this.selectAll(!0, !0, null, a, !1, b)
    };
    a.prototype.setSelectedKeys = function(a, b) {
        "undefined" == typeof b && (b = !0);
        this.selectAll(!0, !0, null, a, !0, b)
    };
    a.prototype.getSelectedObjectsDeep = function(a, b, c) {
        "undefined" == typeof b && (b = !1);
        "undefined" == typeof c && (c = !1);
        for (var f = c ? this._unSelectedObjects : this._selectedObjects, e = 0; e < f.length; e++) {
            var h = f[e];
            a.push(b ? this.getItemKey(h) : h)
        }
        this.nextLevel && this.nextLevel.getSelectedObjectsDeep(a, b, c)
    };
    a.prototype.getSelectedKeysState = function(a) {
        return 0 == this.grid.getLength(a) ? flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED : this.areAllSelected(a) ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : this.areAnySelected(a) ? flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED
    };
    a.prototype.areAnySelected = function(a, b) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof b && (b = !1);
        for (var c = 0; c < a.length; c++) {
            for (var f = a[c], e = 0; e < this._selectedObjects.length; e++) if (f == this._selectedObjects[e]) return !0;
            if (b && this.nextLevel && this.nextLevel.areAnySelected(this.getChildren(f))) return !0
        }
        return !1
    };
    a.prototype.getChildren = function(a, b, c, f) {
        "undefined" == typeof b && (b = !1);
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof f && (f = !1);
        return this.grid.getChildren(a, this, b, c, f)
    };
    a.prototype.getChildrenLength = function(a, b, c, f) {
        "undefined" == typeof b && (b = !1);
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof f && (f = !1);
        return this.grid.getChildrenLength(a, this, b, c, f)
    };
    a.prototype.dispatchEvent = function(a) {
        if (a.implementsOrExtends("FlexDataGridEvent") || a.implementsOrExtends("ExtendedFilterPageSortChangeEvent")) this.grid.dispatchEvent(a) || a.preventDefault();
        return flexiciousNmsp.EventDispatcher.prototype.dispatchEvent.apply(this, [a])
    };
    a.prototype.showColumns = function(a) {
        for (var b = this.getColumns(), g = 0; g < b.length; g++) {
            var f = b[g];
            f.setVisible(c.doesArrayContainObjectValue(a, "name", f.getUniqueIdentifier()))
        }
        this.nextLevel && this.nextLevel.showColumns(a)
    };
    a.prototype.showPrintableColumns = function() {
        for (var a = this.getColumns(), b = 0; b < a.length; b++) {
            var c = a[b];
            c.setVisible(!c.excludeFromPrint)
        }
        this.nextLevel && this.nextLevel.showPrintableColumns()
    };
    a.prototype.getColumnByDataField = function(a, b) {
        "undefined" == typeof b && (b = "dataField");
        for (var g = this.getColumns(), f = 0; f < g.length; f++) {
            var e = g[f];
            if (e["get" + c.doCap(b)]() == a) return e
        }
        return this.nextLevel && !this.nextLevel.reusePreviousLevelColumns && (g = this.nextLevel.getColumnByDataField(a, b)) ? g : null
    };
    a.prototype.getColumnByUniqueIdentifier = function(a) {
        for (var b = this.getColumns(), c = 0; c < b.length; c++) {
            var f = b[c];
            if (f.getUniqueIdentifier() == a) return f
        }
        return null
    };
    a.prototype.clearColumns = function() {
        this._columns = []
    };
    a.prototype.addColumn = function(a) {
        this._columns.push(a);
        a.level = this;
        this.setColumns(this._columns);
        this.adjustColumnWidths()
    };
    a.prototype.removeColumn = function(a) {
        a = a ? a.getIndex() : -1;
        0 <= a && this._columns.splice(a, 1);
        this.setColumns(this._columns)
    };
    a.prototype.distributeColumnWidthsEqually = function() {
        this.adjustColumnWidths(-1, !0)
    };
    a.prototype.getColumnGroupsAtLevel = function(a, b, c, f) {
        "undefined" == typeof b && (b = null);
        "undefined" == typeof c && (c = null);
        "undefined" == typeof f && (f = 0);
        f++;
        null == c && (c = []);
        null == b && (b = this.columnGroups);
        for (var e = 0; e < b.length; e++) {
            var h = b[e];
            f == a ? c.push(h) : this.getColumnGroupsAtLevel(a, h.columnGroups, c, f)
        }
        return c
    };
    a.prototype.ensureRowNumberColumn = function() {};
    a.prototype.getOpenKeys = function(a, b) {
        "undefined" == typeof b && (b = null);
        b || (b = this.grid.getRootFlat());
        for (var c = 0; c < b.length; c++) {
            var f = b[c];
            this.isItemOpen(f) && a.push(this.getItemKey(f));
            this.nextLevel && this.nextLevel.getOpenKeys(a, this.getChildren(f))
        }
    };
    a.prototype.setOpenKeys = function(a, b) {
        "undefined" == typeof b && (b = null);
        b || (b = this.grid.getRootFlat());
        for (var c = 0; c < b.length; c++) {
            var f = b[c];
            0 <= a.indexOf(this.getItemKey(f)) && this.grid.getBodyContainer().addOpenItem(f);
            this.nextLevel && this.nextLevel.setOpenKeys(a, this.getChildren(f))
        }
    };
    a.prototype.setSelectedItemsBasedOnSelectedField = function(a, b, c) {
        "undefined" == typeof b && (b = null);
        "undefined" == typeof c && (c = !0);
        for (var f = !1, e = 0; e < a.length; e++) {
            var h = a[e];
            h.hasOwnProperty(this.selectedField) && h[this.selectedField] && (b && c && 0 <= !this.grid.getOpenItems().indexOf(b) && this.grid.getOpenItems().push(b), this.isItemSelected(h, !1) || (this.addSelectedItem(h), f = !0));
            this.nextLevel && (f = this.nextLevel.setSelectedItemsBasedOnSelectedField(this.getChildren(h), h, c) || f)
        }
        return f
    };
    a.prototype.addUnSelectedItem = function(a) {
        this._unSelectedObjects.push(a);
        this.storeChain(a)
    };
    a.prototype.removeUnSelectedItem = function(a) {
        if (0 < this.selectedKeyField.length && -1 == this._unSelectedObjects.indexOf(a)) for (var b = c.resolveExpression(a, this.selectedKeyField), g = 0; g < this._unSelectedObjects.length; g++) {
            var f = this._unSelectedObjects[g];
            if (b == c.resolveExpression(a, this.selectedKeyField)) {
                a = f;
                break
            }
        }
        a = this._unSelectedObjects.indexOf(a);
        0 <= a && this._unSelectedObjects.splice(a, 1)
    };
    a.prototype.selectRowExclusion = function(a, b) {
        if (this.checkRowSelectable(null, a)) {
            if (b) {
                if (b) if (this.isItemUnSelected(a)) this.removeUnSelectedItem(a);
                else if (!this.isItemSelected(a, !1) && (this.addSelectedItem(a), this.enableSingleSelect && 1 < this.getNestDepth())) for (var c = this.grid.selectionChain[this.getItemKey(a)], f = 0; f < this._selectedObjects.length; f++) {
                    var e = this._selectedObjects[f],
                        h = this.grid.selectionChain[this.getItemKey(e)];
                    c && h && 1 < h.length && 1 < c.length && !this.areItemsEqual(e, a) && this.getParentLevel().areItemsEqual(h[this.getNestDepth() - 2], c[this.getNestDepth() - 2]) && this.removeSelectedItem(e)
                }
            } else this.isItemSelected(a, !1) ? this.removeSelectedItem(a) : this.isItemUnSelected(a) || this.addUnSelectedItem(a);
            this.grid.enableSelectionCascade && this.nextLevel && this.nextLevel.getItemsInSelectionHierarchy(a, !0, this.getNestDepth(), null, !0)
        }
    };
    a.prototype.getCheckBoxStateBasedOnExclusion = function(a, b, c) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = !0);
        var f = this.grid.getSelectAllState();
        if (c && null != this.rowDisabledFunction && this.rowDisabledFunction(null, a) || c && null != this.rowSelectableFunction && !this.rowSelectableFunction(null, a)) return flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
        this.isItemSelected(a, !1) ? f = flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : this.isItemUnSelected(a) ? f = flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED : this.grid.enableSelectionCascade && this.getParentLevel() && (c = this.grid.getParent(a, this)) && (f = this.getParentLevel().getCheckBoxStateBasedOnExclusion(c, !1, !1));
        if (this.grid.enableSelectionBubble && (this.nextLevel && b) && (b = this.getNumChildren(a), 0 != b)) {
            var e = c = 0;
            c = this.nextLevel.getItemsInSelectionHierarchy(a, !1, this.getNestDepth(), null, !1, !1).length;
            e = this.nextLevel.getItemsInSelectionHierarchy(a, !1, this.getNestDepth(), null, !1, !0).length;
            if (this.nextLevel.enableSingleSelect) f = 0 < c ? flexiciousNmsp.TriStateCheckBox.STATE_CHECKED : flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
            else if (e == b) f = flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
            else if (c == b) f = flexiciousNmsp.TriStateCheckBox.STATE_CHECKED;
            else if (!(0 == c && 0 == e) && this.grid.enableTriStateCheckbox && (c || e)) f = flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE
        }
        return f
    };
    a.prototype.isItemUnSelected = function(a) {
        if (this.selectedKeyField) {
            a = c.resolveExpression(a, this.selectedKeyField);
            for (var b = 0; b < this._unSelectedObjects.length; b++) if (c.resolveExpression(this._unSelectedObjects[b], this.selectedKeyField) == a) return !0;
            return !1
        }
        return 0 <= this._selectedObjects.indexOf(a)
    };
    a.prototype.getNumChildren = function(a) {
        if (this.childrenCountField) return c.resolveExpression(a, this.childrenCountField);
        for (var b = this.grid.getBodyContainer().getLoadedItems(), g = 0; g < b.length; g++) {
            var f = b[g];
            if (f.isEqual(a, this, 0 < this.selectedKeyField.length)) return f.totalRecords
        }
        return this.grid.getLength(this.getChildren(a))
    };
    a.prototype.getItemsInSelectionHierarchy = function(a, b, c, f, e, h) {
        f || (f = []);
        var j = [],
            k = [],
            l, m, n, p = h ? this._unSelectedObjects : this._selectedObjects;
        for (m = 0; m < p.length; m++) {
            n = p[m];
            l = this.grid.selectionChain[this.getItemKey(n)];
            if (null == l) return f;
            var q = l[c - 1];
            l = this.grid.getLevel(c);
            l.areItemsEqual(q, a) && (f.push(n), j.push(n))
        }
        if (e) {
            for (m = 0; m < this._unSelectedObjects.length; m++) n = this._unSelectedObjects[m], l = this.grid.selectionChain[this.getItemKey(n)], q = l[c - 1], l = this.grid.getLevel(c), l.areItemsEqual(q, a) && k.push(n);
            for (m = 0; m < j.length; m++) n = j[m], this._selectedObjects.splice(this._selectedObjects.indexOf(n), 1);
            for (m = 0; m < k.length; m++) n = k[m], this._unSelectedObjects.splice(this._unSelectedObjects.indexOf(n), 1);
            this.onSelectedKeysChange()
        }
        b && this.nextLevel && this.nextLevel.getItemsInSelectionHierarchy(a, b, c, f, e, h);
        return f
    };
    a.prototype.calculateHeaderHeights = function() {
        if (this.headerVisible) {
            this.grid.measurer || (this.grid.measurer = new flexiciousNmsp.UIComponent("div"), this.grid.measurer.domElement.style.position = "absolute");
            this.grid.addChild(this.grid.measurer);
            this.grid.getBodyContainer().variableRowHeightRenderers = new flexiciousNmsp.KeyValuePairCollection;
            for (var a = this.minHeaderHeight, b = this.getFlowHeaderColumns(), c = 0; c < b.length; c++) var f = b[c],
                e = f.getStyleValue("headerPaddingLeft"),
                h = f.getStyleValue("headerPaddingTop"),
                j = f.getStyleValue("headerPaddingRight"),
                k = f.getStyleValue("headerPaddingBottom"),
                a = this.grid.measureCellHeight(f, e, j, h, k, f.headerRenderer, a, f.getHeaderText(), null, this.getStyleValue("headerStyleName"));
            this.setHeaderHeight(a);
            this.grid.getBodyContainer().clearVariableRowHeightRenderes();
            this.grid.removeChild(this.grid.measurer)
        }
    };
    a.prototype.getFlowHeaderColumns = function() {
        if (this._flowHeaderColumns) return this._flowHeaderColumns;
        this._flowHeaderColumns = [];
        for (var a = this.getVisibleColumns(), b = 0; b < a.length; b++) {
            var c = a[b];
            c.headerWordWrap ? this._flowHeaderColumns.push(c) : this.grid.variableRowHeightUseRendererForCalculation && c.headerRenderer && this._flowHeaderColumns.push(c)
        }
        return this._flowHeaderColumns
    };
    a.prototype.getRightLockedWidth = function() {
        for (var a = 0, b = this.getRightLockedColumns(), c = 0; c < b.length; c++) a += b[c].getWidth();
        return a
    };
    a.prototype.getPagerHeight = function() {
        return this._pagerRowHeight
    };
    a.prototype.setPagerHeight = function(a) {
        this._pagerRowHeight = a
    };
    a.prototype.getHeaderHeight = function() {
        return this.headerVisible ? 0 != this._headerHeight ? this._headerHeight : this.getRowHeight() : 0
    };
    a.prototype.setHeaderHeight = function(a) {
        this._headerHeight != a && this.invalidateList();
        this._headerHeight = a
    };
    a.prototype.getPagerRenderer = function() {
        null == this._pagerRenderer && (this._pagerRenderer = a.static_FlexDataGridPager);
        return this._pagerRenderer
    };
    a.prototype.setPagerRenderer = function(a) {
        this._pagerRenderer = a
    };
    a.prototype.getUnLockedColumns = function() {
        return this.getColumnsByLockMode([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE])
    };
    a.prototype.getGroupedColumns = function() {
        return 0 == this._groupedColumns.length ? this.getColumns() : this._groupedColumns
    };
    a.prototype.setGroupedColumns = function(a) {
        this._groupedColumns = a.slice();
        this.hasGroupedColumns = 1 <= this._groupedColumns.length;
        this.invalidateCache();
        for (var b = [], c = [], f = 0; f < a.length; f++) {
            var e = a[f];
            if (e.implementsOrExtends("FlexDataGridColumnGroup")) {
                for (var h = 0; h < e.getAllColumns().length; h++) {
                    var j = e.getAllColumns()[h];
                    b.push(j)
                }
                c.push(e)
            } else b.push(e)
        }
        this.setColumns(b);
        this.columnGroups = c
    };
    a.prototype.getIsClientFilterPageSortMode = function() {
        return "client" == this.filterPageSortMode
    };
    a.prototype.getTraceCols = function() {
        for (var a = "", b = this.getColumns(), c = 0; c < b.length; c++) var f = b[c],
            a = a + (f.getHeaderText() + ":" + f.getWidth()),
            a = a + "\n";
        return a
    };
    a.prototype.getMaxPaddingCellWidth = function() {
        for (var a = this, b = 0; null != a;) b += 1 == a.getNestDepth() ? 0 : a.getNestIndent(), a = a.getParentLevel();
        return b
    };
    a.prototype.getFilterRowHeight = function() {
        return this.getEnableFilters() && this.filterVisible ? 0 != this._filterRowHeight ? this._filterRowHeight : this.getRowHeight() : 0
    };
    a.prototype.setFilterRowHeight = function(a) {
        this._filterRowHeight != a && this.invalidateList();
        this._filterRowHeight = a
    };
    a.prototype.getFlowColumns = function() {
        if (this._flowColumns) return this._flowColumns;
        this._flowColumns = [];
        for (var a = this.getVisibleColumns(), b = 0; b < a.length; b++) {
            var c = a[b];
            c.wordWrap ? this._flowColumns.push(c) : this.grid.variableRowHeightUseRendererForCalculation && c.itemRenderer && this._flowColumns.push(c)
        }
        return this._flowColumns
    };
    a.prototype.getSelectedObjects = function() {
        return this._selectedObjects
    };
    a.prototype.getUnLockedWidth = function() {
        for (var a = 0, b = this.getUnLockedColumns(), c = 0; c < b.length; c++) a += b[c].getWidth();
        return a
    };
    a.prototype.getLeftLockedColumns = function() {
        return this.getColumnsByLockMode([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT])
    };
    a.prototype.getFilterHeight = function() {
        return this._filterRowHeight
    };
    a.prototype.setFilterHeight = function(a) {
        this._filterRowHeight = a
    };
    a.prototype.getIsClientItemLoadMode = function() {
        return "client" == this.itemLoadMode
    };
    a.prototype.getMaxDisclosureCellWidth = function() {
        return this.getDeepNestIndent() - this.getMaxPaddingCellWidth()
    };
    a.prototype.getColumnOwnerLevel = function() {
        return this.reusePreviousLevelColumns && this.getParentLevel() ? this.getParentLevel().getColumnOwnerLevel() : this
    };
    a.prototype.getSelectedKeys = function() {
        if (this._calculatedSelectedKeys) return this._calculatedSelectedKeys;
        for (var a = [], b = 0; b < this._selectedObjects.length; b++) a.push(this.getItemKey(this._selectedObjects[b]));
        return this._calculatedSelectedKeys = a
    };
    a.prototype.getDeepNestIndent = function() {
        for (var a = this.grid.getColumnLevel(), b = 0; null != a;) b += 1 == a.getNestDepth() ? 0 : a.nestIndent, !a.nextLevel && a.nextLevelRenderer && (b += a.nestIndent), a = a.nextLevel;
        return b
    };
    a.prototype.getHasFilterFunction = function() {
        return null != this.filterFunction || this.nextLevel && this.nextLevel.getHasFilterFunction()
    };
    a.prototype.getRightLockedColumns = function() {
        return this.getColumnsByLockMode([flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT])
    };
    a.prototype.getRowHeight = function() {
        return this._rowHeight
    };
    a.prototype.setRowHeight = function(a) {
        this._rowHeight != a && this.invalidateList();
        this._rowHeight = a
    };
    a.prototype.getEnableMultiColumnSort = function() {
        return this.grid.enableMultiColumnSort
    };
    a.prototype.getUnSelectedObjects = function() {
        return this._unSelectedObjects
    };
    a.prototype.getSelectedItem = function() {
        return 0 < this._selectedObjects.length ? this._selectedObjects[0] : this.nextLevel ? this.nextLevel.selectedItem : null
    };
    a.prototype.getCellCustomBackgroundDrawFunction = function() {
        return this._cellCustomDrawFunction
    };
    a.prototype.setCellCustomBackgroundDrawFunction = function(a) {
        this._cellCustomDrawFunction = a
    };
    a.prototype.getEnableFilters = function() {
        return this._enableFilters
    };
    a.prototype.setEnableFilters = function(a) {
        this._enableFilters = a;
        this.invalidateList();
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("enableFiltersChanged", void 0, void 0))
    };
    a.prototype.getEnableFooters = function() {
        return this._enableFooters
    };
    a.prototype.setEnableFooters = function(a) {
        this._enableFooters = a;
        this.invalidateList();
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("enableFootersChanged"))
    };
    a.prototype.getFooterRowHeight = function() {
        return this.getEnableFooters() && this.footerVisible ? 0 != this._footerRowHeight ? this._footerRowHeight : this.getRowHeight() : 0
    };
    a.prototype.setFooterRowHeight = function(a) {
        this._footerRowHeight != a && this.invalidateList();
        this._footerRowHeight = a
    };
    a.prototype.getSelectedCells = function() {
        return this.grid ? this.grid.getSelectedCells() : []
    };
    a.prototype.getNestDepth = function() {
        return this._nestDepth
    };
    a.prototype.getColumns = function() {
        return this.reusePreviousLevelColumns && this.getParentLevel() ? this.getParentLevel().getColumns() : this._columns ? this._columns.slice() : []
    };
    a.prototype.setColumns = function(a) {
        this._columns = a.slice(0);
        this.ensureRowNumberColumn();
        this.invalidateCache();
        for (a = 0; a < this._columns.length; a++) {
            var b = this._columns[a];
            b.level = this;
            b.calcualtedMeasurements = {}
        }
    };
    a.prototype.getParentLevel = function() {
        return this._parentLevel
    };
    a.prototype.getPagerRowHeight = function() {
        return this.enablePaging && this.pagerVisible || this.forcePagerRow ? 0 != this._pagerRowHeight ? this._pagerRowHeight : this.getRowHeight() : 0
    };
    a.prototype.setPagerRowHeight = function(a) {
        this._pagerRowHeight != a && this.invalidateList();
        this._pagerRowHeight = a
    };
    a.prototype.getLeftLockedWidth = function() {
        for (var a = 0, b = this.getLeftLockedColumns(), c = 0; c < b.length; c++) a += b[c].getWidth();
        if (this.grid.lockDisclosureCell && (this.nextLevel || this.nextLevelRenderer || "server" == this.itemLoadMode) && this.grid.enableDefaultDisclosureIcon) a += this.getNestDepth() * this.nestIndent;
        return a
    };
    a.prototype.getNestIndent = function() {
        return this.nestIndent
    };
    a.prototype.getLevelRendererHeight = function(a) {
        return this.levelRendererHeight = a
    };
    a.prototype.kill = function() {
        flexiciousNmsp.EventDispatcher.prototype.kill.apply(this);
        this.invalidateCache();
        this._selectedObjects = [];
        this.openItems = [];
        this.currentSorts = [];
        this._columns && this.killArray(this._columns);
        this._columns = [];
        this.columnGroups && this.killArray(this.columnGroups);
        this.columnGroups = [];
        this.grid = null;
        this.nextLevel && this.nextLevel.kill()
    }
})(window);
(function() {
    var a;
    a = function(a) {
        this.chromeType = flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER;
        flexiciousNmsp.FlexDataGridContainerBase.apply(this, [a]);
        this.horizontalScrollPolicy = this.verticalScrollPolicy = "off";
        this.addEventListener("widthChanged", this.onWidthChanged)
    };
    flexiciousNmsp.FlexDataGridHeaderContainer = a;
    a.prototype = new flexiciousNmsp.FlexDataGridContainerBase(null);
    a.prototype.typeName = a.typeName = "FlexDataGridHeaderContainer";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridHeaderContainer", "FlexDataGridContainerBase", "Container", "UIComponent"]
    };
    a.prototype.setWidth = function(a) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.setWidth.apply(this, [a]);
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("widthChanged"))
    };
    a.prototype.onWidthChanged = function() {
        if (this.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER) {
            var a = this.getPagerCell();
            if (a && (a = a.component)) a.setActualSize(this.getPagerWidth(), a.getHeight()), a.invalidateDisplayList()
        }
    };
    a.prototype.onCellDropMouseMove = function(a) {
        this.grid.enableDrop && flexiciousNmsp.DisplayList.isMouseDown && (a = a.currentTarget, this.getY() > this.grid.getBodyContainer().getY() ? this.grid.scrollToExistingRow(this.grid.getBodyContainer().getVerticalScrollPosition() + a.getHeight(), !0) : this.grid.scrollToExistingRow(this.grid.getBodyContainer().getVerticalScrollPosition() - a.getHeight(), !1))
    };
    a.prototype.getScrollableRect = function() {
        var a = flexiciousNmsp.FlexDataGridContainerBase.getScrollableRect.apply(this);
        this.grid.getBodyContainer().getVerticalScrollBar() && a.setWidth(a.getWidth() + this.grid.getBodyContainer().getVerticalScrollBar().getWidth());
        return a
    };
    a.prototype.createComponents = function(a, d, b) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.createComponents.apply(this, [a]);
        b || (b = this.grid.getDataProvider(), a.getIsClientFilterPageSortMode() && (b = this.filterPageSort(b, this.grid.getColumnLevel(), null, !0, !1, !0)));
        d = this.getHeight();
        var g = 0;
        if (this.chromeType == flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER) {
            var f = a.getMaxColumnGroupDepth();
            d /= f;
            for (var e = 1; e < f; e++) {
                var h = new flexiciousNmsp.RowPositionInfo(b, e - 1, g, d, this.grid.getColumnLevel(), flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP),
                    g = g + d;
                this.processHeaderLevel(a, h, !1, b, flexiciousNmsp.RowPositionInfo.ROW_TYPE_COLUMN_GROUP)
            }
        }
        this.grid.currentPoint.leftLockedHeaderX = this.grid.currentPoint.rightLockedHeaderX = 0;
        f = new flexiciousNmsp.RowPositionInfo(b, f, g, d, this.grid.getColumnLevel(), this.chromeType);
        this.processHeaderLevel(a, f, !1, b, this.chromeType)
    };
    a.prototype.rootPageChange = function(a) {
        var d = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE);
        d.triggerEvent = a;
        this.dispatchEvent(d)
    };
    a.prototype.onFilterChange = function(a) {
        flexiciousNmsp.FlexDataGridContainerBase.prototype.onFilterChange.apply(this, [a]);
        var d = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE);
        d.triggerEvent = a;
        this.dispatchEvent(d)
    };
    a.prototype.getRowsForRecycling = function() {
        return this.rows.slice().reverse()
    };
    a.prototype.getPagerCell = function() {
        for (var a = 0; a < this.rows.length; a++) for (var d = this.rows[a], b = 0; b < d.cells.length; b++) {
            var g = d.cells[b];
            if (g.component.implementsOrExtends("FlexDataGridPagerCell")) return g
        }
        return null
    };
    a.prototype.getPager = function() {
        var a = this.getPagerCell();
        return a && a.component && a.component.implementsOrExtends("FlexDataGridPagerCell") ? a.component.getRenderer() : null
    };
    a.prototype.addCell = function(a, d) {
        var b = flexiciousNmsp.FlexDataGridContainerBase.prototype.addCell.apply(this, [a, d]);
        b.horizontalSpill = !1;
        return b
    };
    a.prototype.setFilterValue = function(a, d) {
        for (var b = 0; b < this.rows.length; b++) for (var g = this.rows[b], f = 0; f < g.cells.length; f++) {
            var e = g.cells[f].component;
            if (e && e.getColumn() && e.getColumn().getSearchField() == a) {
                g = e.getRenderer();
                g.implementsOrExtends("ISelectFilterControl") && g.validateNow();
                g.setValue(d);
                g.validateNow();
                break
            }
        }
    };
    a.prototype.getFilterArguments = function() {
        for (var a = 0; a < this.rows.length; a++) {
            var d = this.rows[a];
            if (0 == a) return d.getFilterArguments()
        }
        return []
    };
    a.prototype.setFilterFocus = function(a) {
        for (var d = 0; d < this.rows.length; d++) {
            var b = this.rows[d];
            if (0 == d) return b.setFilterFocus(a)
        }
        return !1
    };
    a.prototype.getMaxHorizontalScrollPosition = function() {
        return this.grid.getBodyContainer().getMaxHorizontalScrollPosition()
    };
    a.prototype.setWidth = function(a) {
        flexiciousNmsp.UIComponent.prototype.setWidth.apply(this, [a]);
        this.grid && (this.grid.getPager() && this == this.grid.getPagerContainer()) && this.grid.getPager().parent.setWidth(this.getPagerWidth())
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils,
        d = flexiciousNmsp.Constants;
    a = function(a) {
        this._openItemVerticalPositions = [];
        this.virtualScrollTimer = this._pendingActiveCell = null;
        this.virtualScrollDelay = 500;
        this.loadedViewPort = new flexiciousNmsp.Rectangle;
        flexiciousNmsp.FlexDataGridBodyContainer.apply(this, [a])
    };
    flexiciousNmsp.FlexDataGridVirtualBodyContainer = a;
    a.prototype = new flexiciousNmsp.FlexDataGridBodyContainer(null);
    a.prototype.typeName = a.typeName = "FlexDataGridVirtualBodyContainer";
    a.prototype.getClassNames = function() {
        return ["FlexDataGridVirtualBodyContainer", "FlexDataGridBodyContainer", "FlexDataGridContainerBase", "Container", "UIComponent"]
    };
    a.prototype.calculateTotalHeight = function(a, c, d, e, h, j, k, l) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof c && (c = null);
        "undefined" == typeof d && (d = 0);
        "undefined" == typeof e && (e = 0);
        "undefined" == typeof h && (h = null);
        "undefined" == typeof j && (j = null);
        "undefined" == typeof k && (k = null);
        "undefined" == typeof l && (l = !1);
        if (!this.grid.enableVirtualScroll || h) return flexiciousNmsp.FlexDataGridBodyContainer.prototype.calculateTotalHeight.apply(this, [a, c, d, e, h, j, k, l]);
        if (this._heightCalculated) return this._calculatedTotalHeight;
        null == a && (flexiciousNmsp.FlexDataGridBodyContainer.prototype.calculateTotalHeight.apply(this, [a, c, d, e, h, j, k]), this._calculatedTotalHeight = this.grid.getTotalRecords() * this.grid.getRowHeight());
        return this._calculatedTotalHeight
    };
    a.prototype.handleArrowKey = function(a, c, f) {
        if (this.grid.enableVirtualScroll) {
            if (c == d.KEYBOARD_END) this.gotoVerticalPosition(this.getMaxVerticalScrollPosition());
            else if (c == d.KEYBOARD_HOME) this.gotoVerticalPosition(0);
            else if (c == d.KEYBOARD_PAGE_DOWN) this.gotoVerticalPosition(Math.min(this.getVerticalScrollPosition() + this.getHeight(), this.getMaxVerticalScrollPosition()));
            else if (c == d.KEYBOARD_PAGE_UP) this.gotoVerticalPosition(Math.max(this.getVerticalScrollPosition() - this.getHeight(), 0));
            else if (c == d.KEYBOARD_UP || c == d.KEYBOARD_DOWN) this._keyboardhandled = !0, this.isYOutOfVisibleArea(a.rowInfo.getY() - a.getHeight() - a.getHeight(), a.getHeight()) && c == d.KEYBOARD_UP ? (this._pendingActiveCell = new CellInfo(0, a.getColumn()), this.gotoVerticalPosition(Math.max(this.getVerticalScrollPosition() - this.grid.getColumnLevel().getRowHeight(), 0))) : this.isYOutOfVisibleArea(a.rowInfo.getY() + a.getHeight(), a.getHeight()) && c == d.KEYBOARD_DOWN ? (this._pendingActiveCell = new CellInfo(this.rows.length, a.getColumn()), this.gotoVerticalPosition(Math.min(this.getVerticalScrollPosition() + this.grid.getColumnLevel().getRowHeight(), this.getMaxVerticalScrollPosition()))) : flexiciousNmsp.FlexDataGridBodyContainer.prototype.handleArrowKey.apply(this, [a, c, f]);
            else return flexiciousNmsp.FlexDataGridBodyContainer.prototype.handleArrowKey.apply(this, [a, c, f]);
            return !1
        }
        return flexiciousNmsp.FlexDataGridBodyContainer.prototype.handleArrowKey.apply(this, [a, c, f])
    };
    a.prototype.gotoVerticalPosition = function(a) {
        0 != this.getHeight() && (this.grid.enableVirtualScroll ? (this.setVerticalScrollPosition(a), this.grid.synchronizeLockedVerticalScroll(), this.dispatchScroll(a, void 0)) : flexiciousNmsp.FlexDataGridBodyContainer.prototype.gotoVerticalPosition.apply(this, [a]))
    };
    a.prototype.setCurrentRowAtScrollPosition = function(a) {
        if (!this.grid.enableVirtualScroll) return flexiciousNmsp.FlexDataGridBodyContainer.prototype.setCurrentRowAtScrollPosition.apply(this, [a]);
        var c = new flexiciousNmsp.Rectangle;
        c.setY(Math.max(0, a - this.grid.getColumnLevel().getRowHeight()));
        c.setHeight(this.getHeight());
        c.setWidth(this.getWidth() - 1);
        c.setX(0);
        this.grid.showSpinnerOnFilterPageSort && this.grid.showSpinner();
        if (this.grid.enableDrawAsYouScroll || !this.grid._isScrolling) 0 < this.virtualScrollDelay && !this.grid.enableDrawAsYouScroll ? (null == this.virtualScrollTimer && (this.virtualScrollTimer = new flexiciousNmsp.Timer(this.virtualScrollDelay, 1), this.virtualScrollTimer.addEventListener(this, d.EVENT_TIMER_COMPLETE, this.onTimerComplete, !1, 0, !0)), this.virtualScrollTimer.reset(), this.virtualScrollTimer.repeatCount = 1, this.virtualScrollTimer.start()) : this.dispatchScroll(a, void 0);
        return !1
    };
    a.prototype.onTimerComplete = function() {
        this.virtualScrollTimer && (this.virtualScrollTimer.stop(), this.virtualScrollTimer.removeEventListener(d.EVENT_TIMER_COMPLETE, this.onTimerComplete, !1));
        this.dispatchScroll(this.getVerticalScrollPosition(), void 0);
        this.virtualScrollTimer = null
    };
    a.prototype.getOpenVirtualScrollInfo = function(a, c) {
        "undefined" == typeof c && (c = -1);
        var d = this._openItemVerticalPositions.slice();
        d.sort(function(a, b) {
            return a.getLevelNestDepth() - b.getLevelNestDepth()
        });
        d.reverse();
        for (var e = 0; e < d.length; e++) {
            var h = d[e];
            if (h.getVerticalScrollPosition() <= a && a < h.verticalScrollPosition + h.getItemArea() - 1 && (-1 == c || c == h.levelNestDepth)) return h
        }
        return null
    };
    a.prototype.doScroll = function() {
        this.dispatchScroll(this.getVerticalScrollPosition(), void 0)
    };
    a.prototype.dispatchScroll = function(a, c) {
        var d = Math.max(0, a - this.grid.getColumnLevel().getRowHeight());
        this.loadedViewPort.setY(d);
        c = [];
        for (var e = Math.min(this.getMaxVerticalScrollPosition() + this.getHeight(), a + this.getHeight() + 3 * this.grid.getColumnLevel().getRowHeight()); d < e && !(d >= this.getCalculatedTotalHeight());) d += this.addRecord(c, d);
        this.loadedViewPort.setHeight(e);
        this.loadedViewPort.setWidth(this.getWidth());
        this.loadedViewPort.setX(0);
        d = new flexiciousNmsp.FlexDataGridVirtualScrollEvent(flexiciousNmsp.FlexDataGridVirtualScrollEvent.VIRTUAL_SCROLL, this.grid, c);
        this.grid.dispatchEvent(d)
    };
    a.prototype.getVpFromRecordIndex = function(a, c, d) {
        var e = 1 == d.getNestDepth() ? null : this.getOpenVirtualScrollInfo(a, d.getNestDepth() - 1),
            h = !1;
        e || (e = new flexiciousNmsp.VirtualScrollLoadInfo(this.grid.getColumnLevel(), 0, 0, this._calculatedTotalHeight, null, null, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA), h = !0);
        return (a = this.getAnchorArea(e, a, d)) ? a.verticalScrollPosition + a.getItemArea() + (c - a.recordIndex) * d.getRowHeight() - d.getRowHeight() : e.verticalScrollPosition + (d.reusePreviousLevelColumns || 1 == d.getNestDepth() ? 0 : d.getHeaderHeight()) + c * d.getRowHeight() + (h ? 0 : e.level.getRowHeight())
    };
    a.prototype.getTopLevelRecordIndex = function(a) {
        var c = this.getOpenVirtualScrollInfo(a, 1);
        if (c) return c.recordIndex;
        c = new flexiciousNmsp.VirtualScrollLoadInfo(this.grid.getColumnLevel(), 0, 0, this._calculatedTotalHeight, null, null, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA);
        return (c = this.getAnchorArea(c, a, this.grid.getColumnLevel())) ? Math.floor(c.recordIndex + (a - c.getVerticalScrollPosition() - c.getItemArea()) / this.grid.getColumnLevel().getRowHeight()) : Math.floor(a / this.grid.getColumnLevel().getRowHeight())
    };
    a.prototype.addRecord = function(a, c) {
        var d = this.getOpenVirtualScrollInfo(c),
            e, h = !1;
        d ? e = d.level.nextLevel ? d.level.nextLevel : d.level : (d = new flexiciousNmsp.VirtualScrollLoadInfo(this.grid.getColumnLevel(), 0, 0, this._calculatedTotalHeight, null, null, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA), e = this.grid.getColumnLevel(), h = !0);
        var j = this.getAnchorArea(d, c, e),
            k = 0,
            l = 0,
            m = null;
        if (j) k = j.recordIndex + (c - j.verticalScrollPosition - j.itemHeight) / e.getRowHeight(), k = Math.floor(k), l = j.verticalScrollPosition + j.getItemArea() + (k - j.recordIndex - 1) * e.getRowHeight(), m = 1 == e.getNestDepth() ? null : d.item;
        else if (c < d.verticalScrollPosition + d.level.getRowHeight()) k = d.recordIndex, e = d.level, l = d.verticalScrollPosition, m = 1 == e.getNestDepth() ? null : this.getParentOpenItem(d.verticalScrollPosition, d.levelNestDepth).item;
        else {
            if (e && 1 < e.getNestDepth() && !e.reusePreviousLevelColumns && c < d.verticalScrollPosition + d.level.getRowHeight() + e.getHeaderHeight()) return m = 1 == e.getNestDepth() ? null : d.item, a.push(new flexiciousNmsp.VirtualScrollLoadInfo(e, -1, c, e.getHeaderHeight(), m, m, flexiciousNmsp.RowPositionInfo.ROW_TYPE_HEADER)), e.getHeaderHeight();
            k = (c - d.verticalScrollPosition - (h ? 0 : d.level.getRowHeight())) / e.getRowHeight();
            k = Math.floor(k);
            l = 0;
            1 < e.getNestDepth() && !e.reusePreviousLevelColumns && (k--, l = e.getHeaderHeight());
            l = d.verticalScrollPosition + k * e.getRowHeight() + (h ? 0 : d.level.getRowHeight()) + l;
            m = 1 == e.getNestDepth() ? null : d.item
        }
        h = e.getRowHeight();
        if (d.level.enableFooters && c >= d.verticalScrollPosition + d.getItemArea() - d.level.getFooterRowHeight()) return a.push(new flexiciousNmsp.VirtualScrollLoadInfo(e, -1, c, e.getFooterRowHeight(), m, m, flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER)), e.getFooterRowHeight();
        a.push(new flexiciousNmsp.VirtualScrollLoadInfo(e, k, l, e.getRowHeight(), null, m, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA));
        return h
    };
    a.prototype.getAnchorArea = function(a, c, d) {
        var e = this._openItemVerticalPositions.slice();
        e.sort(function(a, b) {
            return a.verticalScrollPosition - b.verticalScrollPosition
        });
        e.reverse();
        for (var h = 0; h < e.length; h++) {
            var j = e[h];
            if (j.level == d && j.verticalScrollPosition >= a.verticalScrollPosition && j.verticalScrollPosition + j.getItemArea() <= a.verticalScrollPosition + a.getItemArea() && j.verticalScrollPosition + j.getItemArea() <= c) return j
        }
        return null
    };
    a.prototype.clearOpenItems = function() {
        this._openItemVerticalPositions = [];
        flexiciousNmsp.FlexDataGridBodyContainer.prototype.clearOpenItems.apply(this, [])
    };
    a.prototype.findRowPositionInfo = function(a) {
        var c = null;
        if (a = this.getCellForRowColumn(a, null, !0)) c = a.rowInfo.rowPositionInfo;
        if (null == c) throw Error("Cannot expand an item that has not been drawn when enableVirtualScroll='true'.");
        return c
    };
    a.prototype.getChromeHeight = function(a) {
        return (a.reusePreviousLevelColumns ? 0 : a.getHeaderHeight()) + (a.enableFooters ? a.getFooterRowHeight() : 0) + (a.forcePagerRow ? a.getPagerRowHeight() : 0)
    };
    a.prototype.getParentOpenItemFromObject = function(a) {
        for (var c = 0; c < this.itemVerticalPositions.length; c++) {
            var d = this.itemVerticalPositions[c];
            if (d.virtualScrollLoadInfo && d.virtualScrollLoadInfo.level.areItemsEqual(d.virtualScrollLoadInfo.item, a)) return d.virtualScrollLoadInfo.parent
        }
        return null
    };
    a.prototype.getParentOpenItem = function(a, c) {
        var d = this._openItemVerticalPositions.slice();
        d.sort(function(a, b) {
            return a.getVerticalPosition() - b.getVerticalPosition()
        });
        d.reverse();
        for (var e = 0; e < d.length; e++) {
            var h = d[e];
            if (h.verticalScrollPosition < a && h.levelNestDepth < c) return h
        }
        return null
    };
    a.prototype.onChildHeaderClicked = function(a) {
        this.grid.enableVirtualScroll ? this.dispatchScroll(this.getVerticalScrollPosition()) : flexiciousNmsp.FlexDataGridBodyContainer.prototype.onChildHeaderClicked.apply(this, [a])
    };
    a.prototype.clearAllCollections = function() {
        flexiciousNmsp.FlexDataGridBodyContainer.prototype.clearAllCollections.apply(this, []);
        this._openItemVerticalPositions = []
    };
    a.prototype.addOpenItem = function(a, d, f) {
        "undefined" == typeof d && (d = null);
        "undefined" == typeof f && (f = !0);
        flexiciousNmsp.FlexDataGridBodyContainer.prototype.addOpenItem.apply(this, [a, d, f]);
        if (this.grid.enableVirtualScroll) {
            var e = d.getVerticalPosition();
            null == d && (d = this.findRowPositionInfo(a));
            var e = this.getCellForRowColumn(d.rowData, null, !0),
                h = d.getLevel(this.grid);
            f = h.nextLevel;
            a = c.resolveExpression(a, h.childrenCountField);
            if (d.virtualScrollLoadInfo) h = new flexiciousNmsp.VirtualScrollLoadInfo(h, d.virtualScrollLoadInfo.recordIndex, this.getVpFromRecordIndex(d.getVerticalPosition(), d.virtualScrollLoadInfo.recordIndex, h), h.getRowHeight(), d.rowData, null, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA);
            else {
                var e = e.setY(),
                    j = [];
                this.addRecord(j, e);
                0 == j.length && (e += h.getRowHeight(), this.addRecord(j, e));
                h = j[0];
                h.item = d.rowData;
                h.verticalScrollPosition = e
            }
            h.itemHeight = a * f.getRowHeight() + this.getChromeHeight(f);
            for (d = 0; d < this._openItemVerticalPositions.length; d++) f = this._openItemVerticalPositions[d], f.verticalScrollPosition >= h.verticalScrollPosition && (f.verticalScrollPosition += h.itemHeight);
            for (d = this.getParentOpenItem(h.verticalScrollPosition, h.levelNestDepth); d;) d.itemHeight += h.itemHeight, d = this.getParentOpenItem(d.verticalScrollPosition, d.levelNestDepth);
            this._openItemVerticalPositions.push(h);
            this._calculatedTotalHeight += h.itemHeight;
            this.dispatchScroll(this.getVerticalScrollPosition());
            this.setVirtualScrollProperties()
        }
    };
    a.prototype.removeOpenItem = function(a, c) {
        "undefined" == typeof c && (c = null);
        if (this.grid.enableVirtualScroll) {
            null == c && (c = this.findRowPositionInfo(a));
            for (var d = c.getLevel(this.grid), e = 0; e < this._openItemVerticalPositions.length; e++) {
                var h = this._openItemVerticalPositions[e],
                    j = h.level;
                if (d == j && j.areItemsEqual(h.item, a)) break
            }
            this.removeOpenItemVerticalPosition(h, c.getVerticalPosition());
            if (this._openItemVerticalPositions.length != this.openItems.length) throw Error("Invalid state - cannot synchronize open items and openItemVerticalPositions. This may happen if you directly modify the openItems collection when enableVirtualScroll=true. Please use the addOpenItem and removeOpenItem methods instead.");
            this.dispatchScroll(this.getVerticalScrollPosition());
            this.setVirtualScrollProperties()
        } else flexiciousNmsp.FlexDataGridBodyContainer.prototype.removeOpenItem.apply(this, [a, c])
    };
    a.prototype.removeOpenItemVerticalPosition = function(a, c) {
        var d, e, h = [];
        for (e = 0; e < this._openItemVerticalPositions.length; e++) d = this._openItemVerticalPositions[e], a.isParentOf(d) && h.push(d);
        for (e = 0; e < h.length; e++) d = h[e], this.removeOpenItemVerticalPosition(d, d.verticalScrollPosition);
        this.openItems.splice(this.openItems.indexOf(a.item), 1);
        h = this._openItemVerticalPositions.splice(this._openItemVerticalPositions.indexOf(a), 1)[0];
        this._calculatedTotalHeight -= h.itemHeight;
        for (e = 0; e < this._openItemVerticalPositions.length; e++) d = this._openItemVerticalPositions[e], d.verticalScrollPosition <= c && c < d.verticalScrollPosition + d.itemHeight && (d.itemHeight -= h.itemHeight), d.verticalScrollPosition > c && (d.verticalScrollPosition -= h.itemHeight)
    };
    a.prototype.setVirtualScrollProperties = function() {};
    a.prototype.setVirtualScrollData = function(a) {
        this.grid.showSpinnerOnFilterPageSort && this.grid.hideSpinner();
        this.itemVerticalPositions = [];
        var c = -1,
            d;
        for (d = 0; d < a.length; d++) {
            var e = a[d]; - 1 == c && (c = e.verticalScrollPosition);
            e.getRowType() == flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA ? (c += this.addToVerticalPositions(e.item, c, e.level, null, flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA), this.itemVerticalPositions[this.itemVerticalPositions.length - 1].virtualScrollLoadInfo = e) : c += this.processSection([], 0, e.parent, c, e.level, e.parent, e.getRowType(), null, null);
            this.itemVerticalPositions[this.itemVerticalPositions.length - 1].rowData = e.item
        }
        this.grid.currentPoint.reset();
        this.removeAllComponents(!0);
        this.addMatchSticks(null);
        for (d = 0; d < this.itemVerticalPositions.length; d++) this.processItemPositionInfoUsingCache(this.itemVerticalPositions[d], this.rows.length, !0);
        if (this._pendingActiveCell && 0 < this.rows.length && (a = "0" == this._pendingActiveCell.rowData.toString() ? this.getFirstVisibleRow() : this.getLastVisibleRow())) c = a.getCellForColumn(this._pendingActiveCell.getColumn()).component, !c && 0 < a.cells.length && (c = a.cells[0]), c && (this.grid.currentCell = c, this.grid.highlightRow(c, c.rowInfo, !0), this.grid.traceValue = c.getText()), this._pendingActiveCell = null
    };
    a.prototype.getFirstVisibleRow = function() {
        var a = this.rows.slice();
        c.sortOn(a, "y");
        for (var d = 0; d < a.length; d++) {
            var f = a[d];
            if (f.getY() > this.getVerticalScrollPosition()) return f
        }
        return 0 < a.length ? a[0] : null
    };
    a.prototype.getLastVisibleRow = function() {
        var a = this.rows.slice();
        c.sortOn(a, "y");
        for (var d = 0; d < a.length; d++) {
            var f = a[d];
            if (f.getY() + 2 * f.rowPositionInfo.getLevel(this.grid).getRowHeight() > this.getVerticalScrollPosition() + this.getHeight()) return f
        }
        return 0 < a.length ? a[a.length - 1] : null
    };
    a.prototype.recycle = function(a, c, d, e) {
        "undefined" == typeof d && (d = 0);
        "undefined" == typeof e && (e = !0);
        this.grid.enableVirtualScroll || flexiciousNmsp.FlexDataGridBodyContainer.prototype.recycle.apply(this, [a, c, d, e])
    }
})(window);
(function() {
    var a;
    a = function(a) {
        this.grid = a;
        flexiciousNmsp.UIComponent.apply(this, ["div"])
    };
    flexiciousNmsp.LockedContent = a;
    a.prototype = new flexiciousNmsp.UIComponent;
    a.prototype.typeName = a.typeName = "LockedContent";
    a.prototype.getClassNames = function() {
        return ["LockedContent", "ExtendedUIComponent", "UIComponent"]
    };
    a.prototype.placeSection = function() {
        for (var a, d = [], b = 0; b < this.numChildren(); b++) {
            var g = this.getChildAt(b).component;
            if (g) {
                var f = g.getVisible(),
                    e = g.rowInfo;
                e && (e.getIsPagerRow() ? g.setVisible(this.grid.getPagerVisible()) : e.getIsHeaderRow() ? g.setVisible(this.grid.getHeaderVisible()) : e.getIsFilterRow() && g.setVisible(this.grid.getFilterVisible()));
                f && !g.getVisible() ? (a = g.getHeight(), d.push(g)) : !f && g.getVisible() && (a = 0 - g.getHeight(), d.push(g))
            }
        }
        if (0 < d.length) for (b = 0; b < this.numChildren(); b++) if (g = this.getChildAt(b).component) 0 <= !d.indexOf(g) && g.setY(g.getY() - a), g.invalidateDisplayList()
    };
    a.prototype.kill = function() {
        flexiciousNmsp.UIComponent.prototype.kill.apply(this);
        this.grid = null
    }
})(window);
(function(a) {
    var c, d = flexiciousNmsp.UIUtils,
        b = flexiciousNmsp.Constants;
    c = function(a, c) {
        c.id ? this.__id = c.id : (flexiciousNmsp.idCounter || (flexiciousNmsp.idCounter = 0), this.__id = "grid" + flexiciousNmsp.idCounter++);
        flexiciousNmsp.registry || (flexiciousNmsp.registry = {});
        flexiciousNmsp.registry[this.__id] = this;
        flexiciousNmsp.NdgBase.apply(this, ["div"]);
        this.itemFilters = {};
        a && this.setDomElement(a);
        d.attachClass(this.domElement, "flexiciousGrid");
        this.rendererCache = null;
        this._preferencePersistenceKey = this.themeID = "";
        this._leftLockedFooter = this._leftLockedContent = this._leftLockedHeader = this.currentCell = this._treeDataGridPager = this._treeDataGridFooter = this._treeDataGridFilter = this._treeDataGridHeader = this._columnLevel = this._treeDataGridContainer = null;
        this.enableKeyboardNavigation = !0;
        this._rightLockedContent = this._rightLockedFooter = this._rightLockedContent = this._rightLockedHeader = null;
        this.currentPoint = new flexiciousNmsp.InsertionLocationInfo;
        this.isVScrollBarVisible = this.isHScrollBarVisible = 0;
        this.useRollOver = !0;
        this._preservePager = this._dataProviderSet = !1;
        this.bottomBarLeft = new flexiciousNmsp.UIComponent;
        this.bottomBarRight = new flexiciousNmsp.UIComponent;
        this.hasFilter = this.contextMenuShown = !1;
        this._multiSortRenderer = null;
        this._isScrolling = !1;
        this.itemFilters = {};
        this._needHorizontalRecycle = !1;
        this.enableDoubleClickEdit = this.enableExport = this._dragColumn = null;
        this.enableDynamicLevels = this.enableDrawAsYouScroll = !1;
        this.dynamicLevelHasChildrenFunction = this.defaultDynamicLevelHasChildrenFunction;
        this.enableSelectionCascade = this.enableSelectionBubble = this.enableTriStateCheckbox = !0;
        this.enableHeightAutoAdjust = null;
        this.maxAutoAdjustHeight = 500;
        this.enablePdf = this.enablePrint = this.enableCopy = this.enableHideIfNoChildren = null;
        this._selectAllState = flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED;
        this._editCell = this._editor = null;
        this._triggerEvent = !0;
        this._filterDirty = !1;
        this._currentExpandLevel = 0;
        this.updateTotalRecords = !0;
        this._totalRecords = 0;
        this.inRebuildBody = !1;
        this.tooltipBehavior = new flexiciousNmsp.TooltipBehavior(this);
        this.currentExportLevel = null;
        this.lastAutoRefresh = new Date;
        this.enableAutoRefresh = null;
        this.autoRefreshInterval = 3E4;
        this.autoRefreshTimer = null;
        this.expandTooltip = "Expand";
        this.collapseTooltip = "Collapse";
        this.expandCollapseTooltipFunction = this.defaultExpandCollapseTooltipFunction;
        this.builtInActions = "edit,delete,moveTo,moveUp,moveDown,separator,addRow,filter";
        this.errorMap = new flexiciousNmsp.KeyValuePairCollection;
        this.variableRowHeightUseRendererForCalculation = this.variableRowHeight = this.allowMultipleRowDrag = this.hasErrors = !1;
        this.variableRowHeightOffset = 0;
        this.clearErrorsOnDataProviderChange = this.clearOpenItemsOnDataProviderChange = this.clearSelectionOnDataProviderChange = this.rebuildGridOnDataProviderChange = !0;
        this.clearSelectionOnFilter = !1;
        this.generateColumns = !0;
        this.editable = !1;
        this.cellTextColorFunction = this.cellBackgroundColorFunction = this.enableVirtualScroll = null;
        this.enableDefaultDisclosureIcon = !0;
        this._changes = [];
        this.enableTrackChanges = !1;
        this.enableSelectionBasedOnSelectedField = null;
        this.dispatchCellCreated = this.dispatchRendererInitialized = this.dispatchCellRenderered = !1;
        this.enableEditRowHighlight = this.enableActiveCellHighlight = !0;
        this.multiColumnSortNumberFields = 4;
        this.filterExcludeObjectsWithoutMatchField = !1;
        this.globalFilterMatchFunction = null;
        this.noDataMessage = "No Records Found";
        this._enableSplitHeader = !0;
        this.enableSelectionExclusion = !1;
        this.selectionChain = {};
        this._hasRowSpanOrColSpan = !1;
        this._colSpanFunction = this._rowSpanFunction = null;
        this.enableEagerDraw = !1;
        this.getRowHeightFunction = null;
        this.toolbarPrintHandlerFunction = this.defaultPrintHandlerFunction;
        this.toolbarPdfHandlerFunction = this.defaultPdfHandlerFunction;
        this.toolbarWordHandlerFunction = this.defaultWordHandlerFunction;
        this.toolbarExcelHandlerFunction = this.defaultExcelHandlerFunction;
        this.printComponentFactory = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PrintFlexDataGrid);
        this.enableFillerRows = this.enableStickyControlKeySelection = !0;
        this.recalculateSeedOnEachScroll = !1;
        this.spinner = this.getChildrenFunction = null;
        this.spinnerBehavior = new flexiciousNmsp.SpinnerBehavior(this);
        this.enableColumnWidthUserOverride = this.enableDelayChange = this.enableLocalStyles = !0;
        this._fillerInvalidated = this.variableHeaderHeight = this._changePending = this.inUpdate = !1;
        this.preferencesToPersist = this.concatenatePersistenceValues();
        this.enablePreferencePersistence = !1;
        this.preferencePersistenceMode = "client";
        this._userPersistedColumnWidths = this.preferencesSet = !1;
        this.useCompactPreferences = !0;
        this._preferencesLoaded = !1;
        this.userSettingsOptionsFunction = this.defaultUseSettingsOptionsFunction;
        this.pdfPrinter = null;
        this.enableMultiplePreferences = !1;
        this._gridPreferencesInfo = new flexiciousNmsp.GridPreferencesInfo;
        this.showSpinnerOnFilterPageSort = !1;
        this._currentPreference = null;
        this.autoLoadPreferences = !0;
        this.popupFactorySaveSettingsPopup = new flexiciousNmsp.ClassFactory(flexiciousNmsp.SaveSettingsPopup);
        this.popupFactoryOpenSettingsPopup = new flexiciousNmsp.ClassFactory(flexiciousNmsp.OpenSettingsPopup);
        this.popupFactorySettingsPopup = new flexiciousNmsp.ClassFactory(flexiciousNmsp.SettingsPopup);
        this.popupFactoryPrintOptions = new flexiciousNmsp.ClassFactory(flexiciousNmsp.PrintOptionsView);
        this.popupFactoryExportOptions = new flexiciousNmsp.ClassFactory(flexiciousNmsp.ExportOptionsView);
        this.printOptions = flexiciousNmsp.PrintOptions.create();
        this.pdfOptions = flexiciousNmsp.PrintOptions.create(!0);
        this.excelOptions = flexiciousNmsp.ExportOptions.create();
        this.excelOptions.popupParent = this;
        this.wordOptions = flexiciousNmsp.ExportOptions.create(flexiciousNmsp.ExportOptions.DOC_EXPORT);
        this.wordOptions.popupParent = this;
        this.htmlOptions = flexiciousNmsp.ExportOptions.create(flexiciousNmsp.ExportOptions.HTML_EXPORT);
        this.htmlOptions.openNewWindow = !0;
        this.htmlOptions.popupParent = this;
        this.doubleClickEnabled = !0;
        this.columnMoveAlpha = this.headerSortSeparatorRight = this.headerSortSeparatorColor = this.columnMoveResizeSeparatorColor = this.fixedColumnFillColors = this.dragRowBorderStyle = this.dragAlpha = this.errorBorderColor = this.errorBackgroundColor = this.lockedSeperatorColor = this.lockedSeperatorThickness = this.textDisabledColor = this.textRollOverColor = this.textSelectedColor = this.pagerRollOverColors = this.pagerColors = this.rendererRollOverColors = this.rendererColors = this.columnGroupRollOverColors = this.columnGroupColors = this.headerRollOverColors = this.headerColors = this.filterRollOverColors = this.filterColors = this.footerRollOverColors = this.footerColors = this.activeCellColor = this.rollOverColor = this.columnGroupClosedIcon = this.columnGroupOpenIcon = this.disclosureClosedIcon = this.disclosureOpenIcon = this.selectionDisabledColor = this.editTextColor = this.editItemColor = this.alternatingTextColors = this.alternatingItemColors = this.rendererPaddingBottom = this.rendererPaddingTop = this.rendererPaddingRight = this.rendererPaddingLeft = this.pagerPaddingBottom = this.pagerPaddingTop = this.pagerPaddingRight = this.pagerPaddingLeft = this.filterPaddingBottom = this.filterPaddingTop = this.filterPaddingRight = this.filterPaddingLeft = this.footerPaddingBottom = this.footerPaddingTop = this.footerPaddingRight = this.footerPaddingLeft = this.columnGroupPaddingBottom = this.columnGroupPaddingTop = this.columnGroupPaddingRight = this.columnGroupPaddingLeft = this.headerPaddingBottom = this.headerPaddingTop = this.headerPaddingRight = this.headerPaddingLeft = this.paddingBottom = this.paddingTop = this.paddingRight = this.paddingLeft = this.crossIconClass = this.checkIconClass = this.sortArrowSkin = this.selectionColor = this.rendererDrawTopBorder = this.pagerDrawTopBorder = this.footerDrawTopBorder = this.filterDrawTopBorder = this.headerDrawTopBorder = this.rendererDrawTopBorder = this.rendererVerticalGridLineThickness = this.rendererHorizontalGridLineThickness = this.rendererHorizontalGridLineColor = this.rendererVerticalGridLineColor = this.rendererHorizontalGridLines = this.rendererVerticalGridLines = this.pagerDrawTopBorder = this.pagerVerticalGridLineThickness = this.pagerHorizontalGridLineThickness = this.pagerHorizontalGridLineColor = this.pagerVerticalGridLineColor = this.pagerHorizontalGridLines = this.pagerVerticalGridLines = this.footerDrawTopBorder = this.footerVerticalGridLineThickness = this.footerHorizontalGridLineThickness = this.footerHorizontalGridLineColor = this.footerVerticalGridLineColor = this.footerHorizontalGridLines = this.footerVerticalGridLines = this.filterDrawTopBorder = this.filterVerticalGridLineThickness = this.filterHorizontalGridLineThickness = this.filterHorizontalGridLineColor = this.filterVerticalGridLineColor = this.filterHorizontalGridLines = this.filterVerticalGridLines = this.columnGroupDrawTopBorder = this.columnGroupVerticalGridLineThickness = this.columnGroupHorizontalGridLineThickness = this.columnGroupHorizontalGridLineColor = this.columnGroupVerticalGridLineColor = this.columnGroupHorizontalGridLines = this.columnGroupVerticalGridLines = this.headerDrawTopBorder = this.headerVerticalGridLineThickness = this.headerHorizontalGridLineThickness = this.headerHorizontalGridLineColor = this.headerVerticalGridLineColor = this.headerHorizontalGridLines = this.headerVerticalGridLines = this.verticalGridLineThickness = this.horizontalGridLineThickness = this.horizontalGridLineColor = this.verticalGridLineColor = this.horizontalGridLines = this.verticalGridLines = this.footerStyleName = this.pagerStyleName = this.headerStyleName = this.columnGroupStyleName = this.multiColumnSortNumberStyleName = this.multiColumnSortNumberHeight = this.multiColumnSortNumberWidth = this.textAlign = this.backgroundColor = this.spinnerGridAlpha = this.spinnerThickness = this.spinnerRadius = this.spinnerColors = this.borderThickness = this.borderSides = this.borderColor = this.toolbarImagesRoot = this.imagesRoot = null;
        this.rendererCache = new flexiciousNmsp.RendererCache(this);
        this._treeDataGridContainer = this.createBodyContainer();
        this._treeDataGridHeader = this.createChromeContainer();
        this._treeDataGridFooter = this.createChromeContainer();
        this._treeDataGridPager = this.createChromeContainer();
        this._treeDataGridFilter = this.createChromeContainer();
        this.delegate = this.resizeTimer = null;
        c.delegate && (this.delegate = c.delegate);
        this.enableResizeTimer = !0;
        this.getFilterContainer().chromeType = flexiciousNmsp.RowPositionInfo.ROW_TYPE_FILTER;
        this.getPagerContainer().chromeType = flexiciousNmsp.RowPositionInfo.ROW_TYPE_PAGER;
        this.getFooterContainer().chromeType = flexiciousNmsp.RowPositionInfo.ROW_TYPE_FOOTER;
        this._leftLockedHeader = this.createLockedContent();
        this._leftLockedFooter = this.createLockedContent();
        this._leftLockedContent = this.createElasticContainer();
        this._leftLockedContent.boundContainer = this.getBodyContainer();
        this._rightLockedHeader = this.createLockedContent();
        this._rightLockedFooter = this.createLockedContent();
        this._rightLockedContent = this.createElasticContainer();
        this._rightLockedContent.boundContainer = this.getBodyContainer();
        this.addEventListener(this, b.EVENT_MOUSE_OUT, this.onGridMouseOut);
        this.addEventListener(this, b.EVENT_CREATION_COMPLETE, this.onCreationComplete);
        this.addEventListener(this, b.EVENT_DOUBLE_CLICK, this.onDoubleClick);
        this.setHorizontalScrollPolicy(b.SCROLL_POLICY_OFF);
        this._leftLockedContent.addEventListener(this, b.EVENT_MOUSE_WHEEL, this.onMouseWheel);
        this._rightLockedContent.addEventListener(this, b.EVENT_MOUSE_WHEEL, this.onMouseWheel);
        this.addEventListener(this, b.EVENT_KEY_DOWN, this.keyDownHandler);
        for (var f in flexiciousNmsp.StyleDefaults.defaults) this.checkSetterAndApply(this, f, flexiciousNmsp.StyleDefaults.defaults[f]);
        c && c.configuration && this.buildFromXml(c.configuration);
        c && c.dataProvider && this.setDataProvider(c.dataProvider);
        if (c && c.styles) for (f in c.styles) d.checkSetterAndApply(this, f, c.styles[f]);
        this.addEventListener(this, b.EVENT_CREATION_COMPLETE, this.onCreationComplete);
        this.addEventListener(this, b.EVENT_RESIZE, this.onGridResized);
        this.addEventListener(this, b.EVENT_CLICK, this.onGridMouseClick)
    };
    flexiciousNmsp.FlexDataGrid = c;
    c.measurerText = new flexiciousNmsp.UIComponent("div");
    c.prototype = new flexiciousNmsp.NdgBase;
    c.prototype.typeName = c.typeName = "FlexDataGrid";
    c.prototype.getClassNames = function() {
        return "FlexDataGrid;NdgBase;UIComponent;IExtendedFlexDataGrid; ISpinnerOwner;IFocusManagerComponent;IExtendedDataGrid".split(";")
    };
    c.MOVE_TOP = "moveTop";
    c.MOVE_UP = "moveUp";
    c.MOVE_DOWN = "moveDown";
    c.MOVE_BOTTOM = "moveBottom";
    c.CELL_POSITION_ABOVE = "above";
    c.CELL_POSITION_BELOW = "below";
    c.CELL_POSITION_BELOW_FIRST = "belowFirst";
    c.CELL_POSITION_ABOVE_LAST = "aboveFirst";
    c.CELL_POSITION_LEFT = "left";
    c.CELL_POSITION_RIGHT = "right";
    c.EVENT_COMPONENTSCREATED = "componentsCreated";
    c.EVENT_PRINTEXPORTDATAREQUEST = "printExportDataRequest";
    c.EVENT_LOADPREFERENCES = "loadPreferencesEvent";
    c.EVENT_PREFERENCESLOADING = "preferencesLoading";
    c.EVENT_PERSISTPREFERENCES = "persistPreferencesEvent";
    c.EVENT_CLEARPREFERENCES = "clearPreferencesEvent";
    c.EVENT_ITEMCLOSE = "itemClose";
    c.EVENT_ITEMOPEN = "itemOpen";
    c.EVENT_ITEMOPENING = "itemOpening";
    c.EVENT_ITEMCLOSING = "itemClosing";
    c.EVENT_ITEMLOAD = "itemLoad";
    c.EVENT_FILTERPAGESORTCHANGE = "filterPageSortChange";
    c.EVENT_HEADERCLICKED = "headerClicked";
    c.EVENT_COLUMNSSHIFT = "columnsShift";
    c.EVENT_COLUMNSRESIZED = "columnsResized";
    c.EVENT_ITEMEDITBEGINNING = "itemEditBeginning";
    c.EVENT_ITEMEDITBEGIN = "itemEditBegin";
    c.EVENT_ITEMEDITEND = "itemEditEnd";
    c.EVENT_ITEMFOCUSIN = "itemFocusIn";
    c.EVENT_ITEMEDITCANCEL = "itemEditCancel";
    c.EVENT_ITEMEDITVALUECOMMIT = "itemEditValueCommit";
    c.EVENT_CHANGE = "change";
    c.EVENT_ITEMROLLOVER = "itemRollOver";
    c.EVENT_ITEMROLLOUT = "itemRollOut";
    c.EVENT_ITEMCLICK = "itemClick";
    c.EVENT_ITEMDOUBLECLICK = "itemDoubleClick";
    c.EVENT_RENDERERINITIALIZED = "rendererInitialized";
    c.EVENT_CELLRENDERED = "cellRendered";
    c.EVENT_DYNAMICLEVELCREATED = "dynamicLevelCreated";
    c.EVENT_DYNAMICALLLEVELSCREATED = "dynamicAllLevelsCreated";
    c.EVENT_SCROLL = "scroll";
    c.EVENT_BEFOREEXPORT = "beforeExport";
    c.EVENT_AFTEREXPORT = "afterExport";
    c.EVENT_BEFOREPRINT = "beforePrint";
    c.EVENT_BEFOREPRINTPROVIDERSET = "beforePrintProviderSet";
    c.EVENT_PRINTCOMPLETE = "printComplete";
    c.EVENT_AUTOREFRESH = "autoRefresh";
    c.EVENT_TOOLBARACTIONEXECUTED = "toolbarActionExecuted";
    c.EVENT_SELECTALLCHECKBOXCHANGED = "selectAllCheckBoxChanged";
    c.EVENT_PDFBYTESREADY = "pdfBytesReady";
    c.EVENT_PREBUILTFILTERRUN = "prebuiltFilterRun";
    c.EVENT_VIRTUALSCROLL = "virtualScroll";
    c.EVENT_CREATION_COMPLETE = "creationComplete";
    c.EVENT_ICONCLICK = "iconClick";
    c.EVENT_ICONMOUSEOVER = "iconMouseOver";
    c.EVENT_ICONMOUSEOUT = "iconMouseOut";
    c.EVENT_ROWCHANGED = "rowChanged";
    c.EVENT_PAGESIZECHANGED = "pageSizeChanged";
    c.EVENT_PLACINGSECTIONS = "placingSections";
    c.prototype.createBodyContainer = function() {
        return new flexiciousNmsp.FlexDataGridVirtualBodyContainer(this)
    };
    c.prototype.createChromeContainer = function() {
        return new flexiciousNmsp.FlexDataGridHeaderContainer(this)
    };
    c.prototype.getFilterContainer = function() {
        return this._treeDataGridFilter
    };
    c.prototype.createLockedContent = function() {
        return new flexiciousNmsp.LockedContent(this)
    };
    c.prototype.createElasticContainer = function() {
        return new flexiciousNmsp.ElasticContainer(this)
    };
    c.prototype.onMouseWheel = function(a) {
        var c = new flexiciousNmsp.FlexDataGridEvent(b.EVENT_SCROLL),
            f = this.getVerticalScrollPosition(),
            f = f - d.getMouseWheelDelta(a.triggerEvent);
        f > this.getBodyContainer().getMaxVerticalScrollPosition() ? f = this.getBodyContainer().getMaxVerticalScrollPosition() : 0 > f && (f = 0);
        c.scrollTop = f;
        c.type = a.type;
        this.getBodyContainer().setVerticalScrollPosition(f);
        this.onContainerScroll(c)
    };
    c.prototype.concatenatePersistenceValues = function() {
        return [b.PERSIST_COLUMN_ORDER, b.PERSIST_COLUMN_VISIBILITY, b.PERSIST_COLUMN_WIDTH, b.PERSIST_FILTER, b.PERSIST_SORT, b.PERSIST_VERTICAL_SCROLL, b.PERSIST_HORIZONTAL_SCROLL, b.PERSIST_FOOTER_FILTER_VISIBILITY, b.PERSIST_PAGE_SIZE, b.PERSIST_PRINT_SETTINGS].join()
    };
    c.prototype.measure = function() {
        var a = this.getColumns().length;
        if (0 == a) this.measuredMinHeight = this.measuredHeight = this.getHeaderSectionHeight() + this.defaultRowCount * this.getRowHeight() + this.getFooterRowHeight(), this.measuredWidth = flexiciousNmsp.NdgBase.DEFAULT_MEASURED_WIDTH, this.measuredMinWidth = flexiciousNmsp.NdgBase.DEFAULT_MEASURED_MIN_WIDTH;
        else {
            for (var b = 0, c = 0, d = 0; d < a; d++) this.getColumns()[d].getVisible() && (b += 100, c += this.getColumns()[d].minWidth);
            this.measuredWidth = Math.max(Math.min(this.getWidth() ? this.getWidth() : 1E3, b), 200);
            this.measuredMinHeight = this.measuredHeight = this.getHeaderSectionHeight() + this.defaultRowCount * this.getRowHeight() + this.getFooterRowHeight()
        }
    };
    c.prototype.initialize = function() {
        flexiciousNmsp.NdgBase.prototype.initialize.apply(this)
    };
    c.prototype.updateDisplayList = function(a, b) {
        this.traceEvent("update display list");
        this.enableDynamicLevels && null == this.getColumnLevel().nextLevel && (this.ensureLevelsCreated(), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.DYNAMIC_ALL_LEVELS_CREATED, this, this.getColumnLevel())));
        flexiciousNmsp.NdgBase.prototype.updateDisplayList.apply(this, [a, b]);
        this.inUpdate = !0;
        this._filterDirty && 0 < this.getHeight() && (this.processFilter(), this._filterDirty = !1);
        this._structureDirty && (0 < this.getHeight() && null != parent) && (this.getForceColumnsToFitVisibleArea() || (this.setHorizontalScrollPosition(0), this.setVerticalScrollPosition(0)), this.enableSelectionBasedOnSelectedField && this.setSelectedItemsBasedOnSelectedField(void 0, void 0), this.getBodyContainer().invalidateCalculatedHeight(), this.placed = !0, this.createComponents(), this.getForceColumnsToFitVisibleArea() || this.recycleH(!0), this._placementDirty = this._structureDirty = !1);
        this._placementDirty && (0 < this.getHeight() && this._componentsCreated) && (this.createComponents(), this.getForceColumnsToFitVisibleArea() || this.recycleH(!0), this._snapDirty = this._placementDirty = !1);
        this._selectionInvalid && (this.invalidateCells(), this.refreshCheckBoxes(), this._selectionInvalid = !1);
        if (this._heightIncreased || this._widthIncreased) this.variableRowHeight ? (this.placeSections(), this.rebuildBody()) : (this.placeSections(), this.getBodyContainer().recycle(this.getColumnLevel(), !0), this.getForceColumnsToFitVisibleArea() || this.recycleH(!0)), this._widthIncreased = this._heightIncreased = !1;
        this._snapDirty && (this._snapDirty = !1, this.snapToColumnWidths());
        this._needHorizontalRecycle && (this._needHorizontalRecycle = !1, this.recycleH(!0));
        if (this._changePending) {
            this._changePending = !1;
            var c = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this);
            this.dispatchEvent(c)
        }
        this._fillerInvalidated && (this._fillerInvalidated = !1, this.drawFiller());
        flexiciousNmsp.NdgBase.prototype.updateDisplayList.apply(this, [a, b]);
        var d = this;
        setTimeout(function() {
            d.placeBottomBar()
        }, 100);
        this.traceEvent("end display list");
        this.inUpdate = !1
    };
    c.prototype.invalidateDisplayList = function() {
        this.inUpdate || flexiciousNmsp.UIComponent.prototype.invalidateDisplayList.apply(this, [])
    };
    c.prototype.invalidateHorizontalScroll = function() {
        this._needHorizontalRecycle = !0;
        this.invalidateDisplayList()
    };
    c.prototype.placeBottomBar = function() {
        if (this.domElement) if (this.getHorizontalScrollBar()) {
            d.attachClass(this.bottomBarLeft.domElement, "bottomBar");
            d.attachClass(this.bottomBarRight.domElement, "bottomBar");
            this.bottomBarLeft.domElement.id = "bottomBar";
            this.getStyle("borderThickness");
            this.bottomBarLeft.setHeight(this.getHorizontalScrollBar().getHeight());
            this.bottomBarRight.setHeight(this.getHorizontalScrollBar().getHeight());
            var a = this.getBodyContainer().getY() + this.getBodyContainer().getHeight() - this.getHorizontalScrollBar().getHeight();
            this.bottomBarLeft.setY(a);
            this.bottomBarRight.setY(a);
            this.bottomBarLeft.setWidth(this.getLeftLockedContent().getWidth() - this.getStyle("lockedSeperatorThickness") + 1);
            this.bottomBarLeft.setX(this.getLeftLockedContent().getX());
            this.bottomBarRight.setWidth(this.getRightLockedContent().getWidth() - (0 == this.getRightLockedContent().getWidth() ? 3 : this.getStyle("lockedSeperatorThickness")));
            this.bottomBarRight.setX(this.getRightLockedContent().getX() + (0 < this.getRightLockedContent().getWidth() ? this.getStyle("lockedSeperatorThickness") : 0));
            d.gradientFill(this.bottomBarRight, this.getStyle("fixedColumnFillColors"));
            d.gradientFill(this.bottomBarLeft, this.getStyle("fixedColumnFillColors"));
            0 == this.getRightLockedContent().getWidth() && d.gradientFill(this.bottomBarRight, [])
        } else d.gradientFill(this.bottomBarRight, []), d.gradientFill(this.bottomBarLeft, [])
    };
    c.prototype.ensureLevelsCreated = function(a, b) {
        "undefined" == typeof a && (a = null);
        "undefined" == typeof b && (b = null);
        null == a && (a = this.getRootFlat());
        null == b && (b = this.getColumnLevel());
        for (var c = 0; c < a.length; c++) {
            var f = a[c],
                g = this.getChildren(f, b),
                m = this.getLength(g);
            b.childrenCountField && f.hasOwnProperty(b.childrenCountField) && (m = d.resolveExpression(f, b.childrenCountField));
            null == b.nextLevel && 0 < m && (b.nextLevel = this.getColumnLevel().clone(!1), this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.DYNAMIC_LEVEL_CREATED, this, b.nextLevel)), b.nextLevel.reusePreviousLevelColumns = !0, this.getColumnLevel().initializeLevel(this), this.reDraw());
            this.ensureLevelsCreated(g, b.nextLevel)
        }
    };
    c.prototype.onCreationComplete = function() {
        this.enablePreferencePersistence && (!this._preferencesLoaded && this.autoLoadPreferences) && (this._preferencesLoaded = !0, this.loadPreferences())
    };
    c.prototype.onDoubleClick = function(a) {
        if (this.doubleClickEnabled) {
            var b = this.currentCell;
            b && (a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.ITEM_DOUBLE_CLICK, this, b.level, b.getColumn(), b, b.rowInfo ? b.rowInfo.getData() : null, a), b.level.dispatchEvent(a))
        }
    };
    c.prototype.keyDownHandler = function(a) {
        if (!a.ctrlKey || !a.shiftKey) {
            var c = a.triggerEvent.target;
            if (!(a.keyCode == b.KEYBOARD_LEFT || a.keyCode == b.KEYBOARD_RIGHT || a.keyCode == b.KEYBOARD_TAB) || !c || !this.getFilterContainer().owns(c)) if (!this.keyboardListenersPaused && !a.isDefaultPrevented() && this.allowInteractivity && this.enableKeyboardNavigation && !this.getBodyContainer()._inEdit && (this.getIsRowSelectionMode() || this.getIsCellSelectionMode())) this.currentCell || this.getBodyContainer().setCurrentCellToFirst(), this.currentCell && this.getContainerForCell(this.currentCell).handleCellKeyUp(this.currentCell, a.keyCode, a)
        }
    };
    c.prototype.keyUpOrDown = function() {};
    c.prototype.onGridMouseOut = function() {
        this.getBodyContainer().gridMouseOut()
    };
    c.prototype.checkNoDataMessage = function(a) {
        "undefined" == typeof a && (a = !1);
        this.noDataMessage && this._dataProviderSet && (0 == this.getLength(this.getDataProvider()) || a ? this.showMessage(this.noDataMessage) : this.hideSpinner())
    };
    c.prototype.clearAllCollections = function() {
        this.clearSelectionOnDataProviderChange && this.clearSelection();
        this.clearErrorsOnDataProviderChange && this.clearAllErrors();
        this._flattenedLevels = {};
        this.hasErrors = !1;
        this.getBodyContainer().clearAllCollections();
        this.clearChanges()
    };
    c.prototype.clearChanges = function() {
        this._changes = [];
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("rowChanged", !1, !1))
    };
    c.prototype.placeSections = function() {
        if (this.getColumnLevel()) {
            !this.getWidth() && !this.getHeight() && (this.measure(), this.setWidth(this.measuredWidth), this.setHeight(this.measuredHeight));
            this.placedHeight = this.getHeight();
            this.placedWidth = this.getWidth();
            this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.PLACING_SECTIONS, this));
            var a = this.getStyle("borderThickness"),
                c = this.hasBorderSide("left") ? a : 0,
                f = this.hasBorderSide("right") ? a : 0,
                g = this.hasBorderSide("top") ? a : 0,
                l = this.hasBorderSide("bottom") ? a : 0,
                a = this.getColumnLevel().getWidestLeftLockedWidth(),
                m = this.getColumnLevel().getWidestRightLockedWidth(),
                n = this.getStyle("lockedSeperatorThickness"),
                p = 0 < this.getColumnLevel().getLeftLockedColumns().length ? n : 0,
                n = this.getWidth() - a - p - m - (m ? n : 0) - c - f - 0;
            d.isIE8() && (n -= 1);
            this.getLeftLockedContent().setHorizontalScrollPolicy(b.SCROLL_POLICY_OFF);
            this.getLeftLockedContent().setVerticalScrollPolicy(b.SCROLL_POLICY_OFF);
            this.getRightLockedContent().setHorizontalScrollPolicy(b.SCROLL_POLICY_OFF);
            this.getRightLockedContent().setVerticalScrollPolicy(b.SCROLL_POLICY_OFF);
            this.getFilterContainer().setWidth(n + 0);
            this.getHeaderContainer().setWidth(n + 0);
            this.getFooterContainer().setWidth(n + 0);
            this.getBodyContainer().setWidth(n);
            this.getPagerContainer().setWidth(this.getWidth() - c - f - 1);
            this.getLeftLockedHeader().setWidth(a);
            this.getLeftLockedFooter().setWidth(a);
            this.getLeftLockedContent().setWidth(a);
            this.getRightLockedHeader().setWidth(m);
            this.getRightLockedFooter().setWidth(m);
            this.getRightLockedContent().setWidth(m);
            this.getColumnLevel().adjustColumnWidths();
            this.snapToColumnWidths();
            this.variableHeaderHeight && this.getColumnLevel().calculateHeaderHeights();
            c = this.getHeight() - this.getHeaderSectionHeight() - this.getFooterRowHeight() - g - l - 1;
            c = Math.max(this.getColumnLevel().getRowHeight(), c);
            this.getBodyContainer().setHeight(this.getLeftLockedContent().setHeight(this.getRightLockedContent().setHeight(c)));
            this.getFilterContainer().setHeight(this.getColumnLevel().getFilterRowHeight());
            this.getHeaderContainer().setHeight(this.getColumnLevel().getHeaderHeight() * this.getColumnLevel().getMaxColumnGroupDepth());
            this.getFooterContainer().setHeight(this.getColumnLevel().getFooterRowHeight());
            this.getPagerContainer().setHeight(this.getColumnLevel().getPagerRowHeight());
            c = this.getHeaderContainer().getHeight() + this.getFilterContainer().getHeight();
            this.getLeftLockedHeader().setHeight(c);
            this.getRightLockedHeader().setHeight(c);
            c = this.getColumnLevel().getFooterRowHeight();
            this.getLeftLockedFooter().setHeight(c);
            this.getRightLockedFooter().setHeight(c);
            this.getLeftLockedHeader().setX(0);
            this.getLeftLockedFooter().setX(0);
            this.getLeftLockedContent().setX(0);
            this.getPagerContainer().setX(0);
            c = this.getWidth() - this.getRightLockedContent().getWidth() - 2;
            this.getRightLockedHeader().setX(c);
            this.getRightLockedFooter().setX(c);
            this.getRightLockedContent().setX(c);
            c = a + (a ? p : 0);
            this.getFilterContainer().setX(c);
            this.getFooterContainer().setX(c);
            this.getBodyContainer().setX(c);
            this.getHeaderContainer().setX(c);
            this._rightLockedContent.setVisible(0 < m);
            this._rightLockedFooter.setVisible(0 < m);
            this._rightLockedHeader.setVisible(0 < m);
            a = this.getDisplayOrder().split(",");
            for (p = m = 0; p < a.length; p++) c = a[p], m += this.placeSectionByName(c, m - (this.getDisplayOrder().indexOf(c) > this.getDisplayOrder().indexOf("body") ? this.isHScrollBarVisible : 0));
            a = d.decimalToColor(this.getStyle("borderColor"));
            this.hasBorderSide("left") && (this.domElement.style.borderLeft = "solid " + this.getStyle("borderThickness") + "px " + a);
            this.hasBorderSide("right") && (this.domElement.style.borderRight = "solid " + this.getStyle("borderThickness") + "px " + a);
            this.hasBorderSide("top") && (this.domElement.style.borderTop = "solid " + this.getStyle("borderThickness") + "px " + a);
            this.hasBorderSide("bottom") && (this.domElement.style.borderBottom = "solid " + this.getStyle("borderThickness") + "px " + a);
            this.enableLockedSectionSeparators && this.drawDefaultSeperators();
            this.getBodyContainer().removeMatchSticks();
            this.getBodyContainer().addMatchSticks()
        }
    };
    c.prototype.getFilterX = function(a) {
        return a.parent.getPerceivedX()
    };
    c.prototype.pauseKeyboardListeners = function(b) {
        this.keyboardListenersPaused = !0;
        a.setTimeout(this.resumeKeyboardListeners, 100);
        b && (this.currentCell = b.parent)
    };
    c.prototype.getContainerForCell = function(a) {
        return a.level == this.getColumnLevel() ? a.rowInfo.getIsHeaderRow() || a.rowInfo.getIsColumnGroupRow() ? this.getHeaderContainer() : a.rowInfo.getIsFooterRow() ? this.getFooterContainer() : a.rowInfo.getIsFilterRow() ? this.getFilterContainer() : a.rowInfo.getIsPagerRow() ? this.getPagerContainer() : this.getBodyContainer() : this.getBodyContainer()
    };
    c.prototype.getContainerInDirection = function(a, b) {
        for (var c = null, d = null, f = this.getDisplayOrder().split(","), g = !1, n = 0; n < f.length; n++) {
            var p = f[n];
            p == a && (g = !0);
            this.getNamedContainer(p) && (p != a && !g) && (c = this.getNamedContainer(p));
            this.getNamedContainer(p) && (p != a && g && null == d) && (d = this.getNamedContainer(p))
        }
        return b ? c : d
    };
    c.prototype.getContainerName = function(a) {
        return a == this.getHeaderContainer() ? "header" : a == this.getFooterContainer() ? "footer" : a == this.getPagerContainer() ? "pager" : a == this.getFilterContainer() ? "filter" : "body"
    };
    c.prototype.getNamedContainer = function(a) {
        return "header" == a ? this.getHeaderContainer() : "footer" == a && this.getFooterRowHeight() ? this.getFooterContainer() : "pager" == a && this.getPagerRowHeight() ? this.getPagerContainer() : "filter" == a && this.getFilterRowHeight() ? this.getFilterContainer() : "body" == a ? this.getBodyContainer() : null
    };
    c.prototype.placeSectionByName = function(a, b) {
        var c = this.getDisplayOrder().indexOf("filter") < this.getDisplayOrder().indexOf("header");
        if ("header" == a) return this.getHeaderVisible() ? (this.getHeaderContainer().setY(b), c || (this.getLeftLockedHeader().setY(b), this.getRightLockedHeader().setY(b)), this.getHeaderContainer().getHeight()) : 0;
        if ("footer" == a) return this.getFooterVisible() && this.getEnableFooters() ? (this.getLeftLockedFooter().setY(b), this.getRightLockedFooter().setY(b), this.getFooterContainer().setY(b), this.getFooterContainer().getHeight()) : 0;
        if ("pager" == a) return this.getPagerVisible() && this.getEnablePaging() || this.getForcePagerRow() ? (this.getPagerContainer().setY(b), this.getPagerContainer().getHeight()) : 0;
        if ("filter" == a) return this.getFilterVisible() && this.getEnableFilters() ? (this.getFilterContainer().setY(b), c && (this.getLeftLockedHeader().setY(b), this.getRightLockedHeader().setY(b)), this.getFilterContainer().getHeight()) : 0;
        if ("body" == a) return this.getLeftLockedContent().setY(b), this.getRightLockedContent().setY(b), this.getBodyContainer().setY(b), this.getBodyContainer().getHeight();
        throw Error("Invalid section specified for the displayOrder property " + a);
    };
    c.prototype.snapToColumnWidths = function() {
        if (!this._placementDirty && !this._structureDirty && !this._snapDirty) for (var a = [this.getBodyContainer(), this.getFilterContainer(), this.getHeaderContainer(), this.getFooterContainer()], b = 0; b < a.length; b++) a[b].snapToColumnWidths()
    };
    c.prototype.createComponents = function(a) {
        "undefined" == typeof a && (a = 0);
        this.enableHeightAutoAdjust && this.getBodyContainer().ensureAutoAjustHeight();
        var c = this.spinnerBehavior.spinnerVisible,
            d = document.activeElement && document.activeElement.component ? document.activeElement.component : null;
        this.currentDataFld = "";
        if (d && null != d.implementsOrExtends && d.implementsOrExtends("IFilterControl") && d.hasOwnProperty("parent") && (d = d.parent) && d.getColumn()) this.currentDataFld = d.getColumn().getDataField();
        if (0 == this.getColumns().length && 0 < this.getLength(this.getDataProvider()) && this.generateColumns) {
            var d = [],
                f = this.getRootFlat()[0],
                g;
            for (g in f) if (f.hasOwnProperty(g) && "uid" != g) {
                var m = new flexiciousNmsp.FlexDataGridColumn;
                m.setDataField(g);
                d.push(m)
            }
            if (0 == d.length) for (var n in f)"uid" != n && (g = new flexiciousNmsp.FlexDataGridColumn, g.setDataField(n), d.push(g));
            this.setColumns(d)
        }
        n = this.getPreservePager();
        this.traceEvent("create comp start");
        for (this.getColumnLevel().initializeLevel(this); this.numChildren() > (n ? 1 : 0);) this.removeChildAt(n ? this.getChildAt(0) == this.getPagerContainer() ? 1 : 0 : 0);
        this.currentPoint.reset();
        g = [this.getBodyContainer(), this.getFilterContainer(), this.getHeaderContainer(), this.getFooterContainer()];
        for (d = 0; d < g.length; d++) g[d].removeAllComponents(!1);
        this._widthIncreased = this._heightIncreased = !1;
        this.placeSections();
        this.getFilterContainer().addEventListener(this, flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE, this.onRootFilterChange);
        this.addComponent(this.getFilterContainer());
        this.getHeaderContainer().addEventListener(this, flexiciousNmsp.FlexDataGridEvent.SELECT_ALL_CHECKBOX_CHANGED, this.onSelectAllChanged);
        this.getHeaderContainer().addEventListener(this, flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, this.onColumnResized);
        this.addComponent(this.getHeaderContainer());
        this.addComponent(this.getBodyContainer());
        this.addComponent(this.getFooterContainer());
        this.addComponent(this.getLeftLockedContent());
        this.addComponent(this.getRightLockedContent());
        this.addComponent(this.getLeftLockedHeader());
        this.addComponent(this.getRightLockedHeader());
        this.addComponent(this.getLeftLockedFooter());
        this.addComponent(this.getRightLockedFooter());
        n || this.addComponent(this.getPagerContainer());
        this.addComponent(this.getLeftLockedVerticalSeparator());
        this.addComponent(this.getRightLockedVerticalSeparator());
        this.addComponent(this.bottomBarLeft);
        this.addComponent(this.bottomBarRight);
        this._dropIndicator.setVisible(!1);
        this.getBodyContainer().verticalSpill = !1;
        this.traceEvent("begin calc");
        this.getBodyContainer().calculateTotalHeight();
        this.traceEvent("end calc");
        this.getColumnLevel().adjustColumnWidths();
        g = this.getBodyContainer().filterPageSort(this.getDataProvider(), this.getColumnLevel(), null, !0, !1, !0);
        if (this.getColumnLevel().getEnableFilters()) {
            this.traceEvent("begin filter");
            this.getFilterContainer().createComponents(this.getColumnLevel(), 0, g);
            if (this.currentDataFld && (d = this.getColumnLevel().getColumnByDataField(this.currentDataFld)) && 0 < this.getFilterContainer().rows.length) this.setFilterFocus(d.getSearchField()), this.currentCell = this.getFilterContainer().getCellForRowColumn(this.getFilterContainer().rows[0].getData(), d);
            this.traceEvent("end filter");
            this.currentPoint.nextChromeRow(this.getFilterContainer())
        }
        this.getBodyContainer().setVisibleRange();
        this.traceEvent("begin header");
        this.getHeaderContainer().createComponents(this.getColumnLevel(), 0, g);
        this.traceEvent("end header");
        this.currentPoint.nextChromeRow(this.getHeaderContainer());
        this.getColumnLevel().getEnableFooters() && (this.traceEvent("begin footer"), this.getFooterContainer().createComponents(this.getColumnLevel(), 0, g), this.traceEvent("end footer"), this.currentPoint.nextChromeRow(this.getFooterContainer()));
        if (!n && (this.getColumnLevel().enablePaging || this.getColumnLevel().forcePagerRow)) this.traceEvent("begin pager"), this.getPagerContainer().createComponents(this.getColumnLevel(), 0, g), this.traceEvent("end pager"), this.currentPoint.nextChromeRow(this.getPagerContainer());
        this.getBodyContainer().createComponents(this.getColumnLevel(), a);
        this.getBodyContainer().addEventListener(this, b.EVENT_SCROLL, this.onContainerScroll);
        this.getBodyContainer().addEventListener(this, flexiciousNmsp.FlexDataGridEvent.COLUMNS_RESIZED, this.onColumnResized);
        n || this.getPagerContainer().addEventListener(this, flexiciousNmsp.ExtendedFilterPageSortChangeEvent.PAGE_CHANGE, this.onRootPageChange);
        this.addComponent(this.getDropIndicator());
        this.invalidateDisplayList();
        this.traceEvent("create comp complete");
        !this._componentsCreated && this.enableResizeTimer && (this.resizeTimer = new flexiciousNmsp.Timer(1E3), this.resizeTimer.addEventListener(this, b.EVENT_TIMER, this.checkResize), this.resizeTimer.start());
        this._componentsCreated = !0;
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.COMPONENTS_CREATED, this));
        this.setPreservePager(!1);
        this.getRightLockedFooter().placeSection();
        this.getRightLockedHeader().placeSection();
        this.getLeftLockedFooter().placeSection();
        this.getLeftLockedHeader().placeSection();
        !this._dataProviderSet && c && this.showSpinnerOnFilterPageSort ? this.showSpinner() : this.checkNoDataMessage()
    };
    c.prototype.onContextMenuSelect = function() {};
    c.prototype.setContextMenuShownFalse = function() {
        this.contextMenuShown = !1
    };
    c.prototype.onTableContextMenuItemClick = function() {
        var a = flexiciousNmsp.ExportOptions.create(flexiciousNmsp.ExportOptions.TXT_EXPORT);
        a.showColumnPicker = !1;
        a.copyToClipboard = !0;
        a.printExportOption = flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES;
        a.flexiciousNmsp.ExtendedExportController.instance().doexport(this, a);
        d.showMessage("Copied to clipboard.")
    };
    c.prototype.onCellContextMenuItemClick = function(a) {
        if (!this.currentCell && (a && a.target.implementsOrExtends("IFlexDataGridDataCell") && (this.currentCell = a.target), !this.currentCell.implementsOrExtends("IFlexDataGridDataCell"))) {
            d.showError("Invalid Cell Selected.");
            return
        }
        if (this.currentCell && this.currentCell.getColumn() && (a = this.currentCell.getColumn().itemToLabel(this.currentCell.rowInfo.getData(), this.currentCell))) d.pasteToClipBoard(a), d.showMessage("Copied to clipboard.")
    };
    c.prototype.onRowContextMenuItemClick = function(a) {
        if (!this.currentCell && (a && a.target.implementsOrExtends("IFlexDataGridDataCell") && (this.currentCell = a.target), !this.currentCell.implementsOrExtends("IFlexDataGridDataCell)"))) {
            d.showError("Invalid Cell Selected.");
            return
        }
        this.currentCell && this.currentCell.getColumn() && (d.pasteToClipBoard(this.getRowText(this.currentCell.rowInfo.getData(), this.currentCell.getColumn().level.getVisibleColumns())), d.showMessage("Copied to clipboard."))
    };
    c.prototype.dragComplete = function() {
        this._dropIndicator.setVisible(!1)
    };
    c.prototype.getRowText = function(a, b) {
        for (var c = "", d = 0; d < b.length; d++) {
            var f = b[d];
            f.getVisible() && (c += f.itemToLabel(a) + "\t")
        }
        return c + "\n"
    };
    c.prototype.onRootFilterChange = function(a) {
        this.clearSelectionOnFilter && this.clearSelection();
        this._triggerEvent && this.processRootFilter(a.triggerEvent)
    };
    c.prototype.processFilter = function() {
        this.processRootFilter(null)
    };
    c.prototype.processRootFilter = function(a) {
        "undefined" == typeof a && (a = null);
        this.itemFilters[b.TOP_LEVEL_FILTER] || (this.itemFilters[b.TOP_LEVEL_FILTER] = new flexiciousNmsp.AdvancedFilter, this.itemFilters[b.TOP_LEVEL_FILTER].pageIndex = 0);
        this.itemFilters[b.TOP_LEVEL_FILTER].pageIndex = 0;
        this.itemFilters[b.TOP_LEVEL_FILTER].filterExpressions = a ? a.filter.filterExpressions : this.getFilterArguments();
        if (null != this.getColumnLevel().additionalFilterArgumentsFunction) for (var c = this.getColumnLevel().additionalFilterArgumentsFunction(), d = 0; d < c.length; d++) this.itemFilters[b.TOP_LEVEL_FILTER].filterExpressions.push(c[d]);
        this.hasFilter = 0 < this.itemFilters[b.TOP_LEVEL_FILTER].filterExpressions.length;
        this.getColumnLevel().getIsClientFilterPageSortMode() && (this.gotoVerticalPosition(0), this.rebuildBody(!0), this.getHeaderContainer().refreshCells(), this.getFooterContainer().refreshCells(), this._filterDirty || this.checkNoDataMessage(0 == this.getBodyContainer().itemVerticalPositions.length));
        c = this.itemFilters[b.TOP_LEVEL_FILTER];
        c.level = this.getColumnLevel();
        c.sorts = this.getColumnLevel().currentSorts;
        c = new flexiciousNmsp.ExtendedFilterPageSortChangeEvent(flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_PAGE_SORT_CHANGE, c ? c : this.getBodyContainer().createFilter(this.getColumnLevel(), null));
        c.triggerEvent = a;
        c.cause = flexiciousNmsp.ExtendedFilterPageSortChangeEvent.FILTER_CHANGE;
        this.getColumnLevel().dispatchEvent(c)
    };
    c.prototype.onRootPageChange = function(a) {
        this.setVerticalScrollPosition(0);
        var c = a.triggerEvent.target;
        this.itemFilters[b.TOP_LEVEL_FILTER] || (this.itemFilters[b.TOP_LEVEL_FILTER] = new flexiciousNmsp.AdvancedFilter, this.itemFilters[b.TOP_LEVEL_FILTER].pageIndex = 0);
        this.itemFilters[b.TOP_LEVEL_FILTER].pageIndex = c.getPageIndex();
        this.getColumnLevel().getIsClientFilterPageSortMode() ? this.rebuildBody() : this.getBodyContainer().dispatchPageChange(a.triggerEvent)
    };
    c.prototype.showHideVScroll = function(a, b) {
        var c = 0;
        !this.isVScrollBarVisible && a ? (c -= b, this.isVScrollBarVisible = b) : this.isVScrollBarVisible && !a && (c += this.isVScrollBarVisible, this.isVScrollBarVisible = 0);
        0 != c && (this.getColumnLevel().adjustColumnWidths(), this.invalidateCellWidths(), this.invalidateDisplayList(), this.enableFillerRows && this.invalidateFiller())
    };
    c.prototype.showHideHScroll = function(a, b) {
        var c = 0;
        !this.isHScrollBarVisible && a ? (c -= b, this.isHScrollBarVisible = b) : this.isHScrollBarVisible && !a && (c += this.isHScrollBarVisible, this.isHScrollBarVisible = 0);
        if (0 != c) {
            var d = this.getDisplayOrder().indexOf("pager") > this.getDisplayOrder().indexOf("body"),
                f = this.getDisplayOrder().indexOf("footer") > this.getDisplayOrder().indexOf("body");
            d && this.getPagerContainer().setY(this.getPagerContainer().getY() + c);
            f && (this.getFooterContainer().setY(this.getFooterContainer().getY() + c), this.getLeftLockedFooter().setY(this.getFooterContainer().getY() + c), this.getRightLockedFooter().setY(this.getFooterContainer().getY() + c));
            this.getBodyContainer().ensureAutoAjustHeight();
            this.getBodyContainer().adjustFiller(c);
            this.invalidateDisplayList()
        }
    };
    c.prototype.multiColumnSortGetTooltip = function() {
        var a = "";
        this.getEnableSplitHeader() || (a += "Click to open multiple column sort.");
        return a
    };
    c.prototype.multiColumnSortShowPopup = function() {
        var a = this.getMultiSortRenderer().newInstance();
        a.grid = this;
        d.addPopUp(a, this, !0, null, b.MCS_LBL_TITLE_TEXT)
    };
    c.prototype.refreshCheckBoxes = function() {
        this.getHeaderContainer().refreshCheckBoxes();
        this.getBodyContainer().refreshCheckBoxes()
    };
    c.prototype.refreshCells = function() {
        this.getBodyContainer().refreshCells();
        this.getEnableFooters() && this.getFooterContainer().refreshCells()
    };
    c.prototype.onColumnResized = function() {
        this.snapToColumnWidths();
        this.validateNow();
        this.getForceColumnsToFitVisibleArea() || this.recycleH(!0);
        this.getStyle("horizontalScrollPolicy") == b.SCROLL_POLICY_AUTO && this.placeBottomBar();
        this.getBodyContainer().addMatchSticks()
    };
    c.prototype.onSelectAllChanged = function() {
        this._selectionInvalid = !0;
        this.doInvalidate()
    };
    c.prototype.onSelectChanged = function() {
        this._selectionInvalid = !0;
        this.doInvalidate()
    };
    var g = 0,
        f = 0;
    c.prototype.onContainerScroll = function(a) {
        this.dispatchEvent(a);
        var b, c = this.getBodyContainer();
        a.scrollTop > this.getBodyContainer().getMaxVerticalScrollPosition() ? a.scrollTop = this.getBodyContainer().getMaxVerticalScrollPosition() : 0 > a.scrollTop && (a.scrollTop = 0);
        if (g != a.scrollTop) {
            b = a.scrollTop - g;
            if (g + b > c.getMaxVerticalScrollPosition()) {
                this.synchronizeLockedVerticalScroll();
                return
            }
            g = a.scrollTop;
            a = c.getVerticalScrollPosition();
            0 <= a && c.setCurrentRowAtScrollPosition(a) && (c.recycle(this.getColumnLevel(), 0 < b, b), this.getForceColumnsToFitVisibleArea() || c.recycleH())
        } else if (f != a.scrollLeft) {
            this.synchronizeHorizontalScroll();
            b = a.scrollLeft - f;
            if (f + b > this.getColumnLevel().getWidestWidth()) return;
            f = a.scrollLeft;
            this.recycleH(b)
        }
        this.synchronizeHorizontalScroll();
        this.synchronizeLockedVerticalScroll();
        if (this.enableVirtualScroll) {
            var d = this;
            setTimeout(function() {
                d.synchronizeLockedVerticalScroll()
            }, 500)
        }
    };
    c.prototype.recycleH = function() {
        this.getBodyContainer().recycleH(this.getColumnLevel(), this.right);
        this.getHeaderContainer().recycleH(this.getColumnLevel(), this.right);
        this.getEnableFooters() && this.getFooterContainer().recycleH(this.getColumnLevel(), this.right);
        this.getEnableFilters() && this.getFilterContainer().recycleH(this.getColumnLevel(), this.right);
        this.synchronizeHorizontalScroll();
        this.enableFillerRows && this.invalidateFiller()
    };
    c.prototype.setChildData = function(a, b, c, d, f) {
        "undefined" == typeof d && (d = -1);
        "undefined" == typeof f && (f = !0);
        this.showSpinnerOnFilterPageSort && this.hideSpinner();
        this.getBodyContainer().setChildData(a, b, c, d, f)
    };
    c.prototype.invalidateCells = function() {
        for (var a = [this.getBodyContainer(), this.getFilterContainer(), this.getHeaderContainer(), this.getFooterContainer()], b = 0; b < a.length; b++) a[b].invalidateCells()
    };
    c.prototype.invalidateList = function() {
        this.rebuild()
    };
    c.prototype.clearSelection = function() {
        0 < this.getSelectedCells().length && this.getSelectedCells().removeAll();
        this.getColumnLevel().clearSelection();
        this.invalidateSelection();
        this.selectionChain = {};
        this.enableSelectionExclusion && (this._selectAllState = flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED)
    };
    c.prototype.getCellInDirection = function(a, b) {
        return this.getBodyContainer().getCellInDirection(a, b)
    };
    c.prototype.getRootFlat = function() {
        return this.getBodyContainer().getRootFlat()
    };
    c.prototype.flatten = function(a, b, c, d, f, g) {
        "undefined" == typeof a && (a = 1);
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = !1);
        var n = a + "" + b + "" + c + "" + d + "" + f + "" + g;
        if (this._flattenedLevels[n]) return this._flattenedLevels[n];
        for (var p = [], q = this.getRootFlat(), s = 0; s < q.length && !(this.flattenRecursive(a, p, q[s], this.getColumnLevel(), b, c, d, f), -1 != g && p.length > g); s++);
        return this._flattenedLevels[n] = p
    };
    c.prototype.clearFlattenedCache = function() {
        this._flattenedLevels = {}
    };
    c.prototype.flattenRecursive = function(a, b, c, d, f, g, n, p) {
        (null == d || f && d.getNestDepth() <= a || d.getNestDepth() == a || -1 == a) && b.push(c);
        if (d.nextLevel && (d.nextLevel.getNestDepth() <= a || -1 == a)) {
            c = d.getChildren(c, g, n, p);
            for (var q = 0; q < c.length; q++) this.flattenRecursive(a, b, c[q], d.nextLevel, f, g, n, p)
        }
    };
    c.prototype.highlightRow = function(a, b, c, d) {
        "undefined" == typeof d && (d = 0);
        b = this.getIsRowSelectionMode() && !b.getIsChromeRow() ? b.cells : [new flexiciousNmsp.ComponentInfo(a, 0, null)];
        var f, g;
        a && (f = a.getRolloverColor(), g = a.getRolloverTextColor());
        for (var n = 0; n < b.length; n++) {
            var p = b[n].component;
            p && (null == f && null == p && (f = p.getRolloverColor()), c ? f && this.useRollOver && (p.currentBackgroundColors = 0 != d ? d : p == this.currentCell && p.rowInfo.getIsDataRow() && this.enableActiveCellHighlight ? a.getStyleValue("activeCellColor") : f, p.currentTextColors = g, p.invalidateBackground()) : p.currentBackgroundColors && (p.currentBackgroundColors = null, p.currentTextColors = null, p.invalidateBackground()))
        }
    };
    c.prototype.dragBegin = function(a) {
        if (flexiciousNmsp.DisplayList.isMouseDown && !flexiciousNmsp.DisplayList.isMouseDown) {
            var b = new flexiciousNmsp.Point(0, 0);
            a = a.currentTarget;
            if (a.getEnabled() && a && (null == this.dragAvailableFunction || this.dragAvailableFunction(a))) this._dragColumn = a.getColumn(), this._dragRowData = a.rowInfo.getData(), b = a.localToGlobal(b), this.globalToLocal(b)
        }
    };
    c.prototype.dragEnterInternal = function(a) {
        this.dragEnter(a)
    };
    c.prototype.dragDropInternal = function(a) {
        this.dragDrop(a)
    };
    c.prototype.dragAcceptReject = function() {};
    c.prototype.scrollToExistingRow = function(a, b) {
        this.getBodyContainer().scrollToExistingRow(a, b);
        flexiciousNmsp.DisplayList.isMouseDown && this._dropIndicator.setVisible(!1)
    };
    c.prototype.getCellForRowColumn = function(a, b) {
        return this.getBodyContainer().getCellForRowColumn(a, b)
    };
    c.prototype.showDropIndicator = function(a) {
        this._dropIndicator.setVisible(!0);
        this._dropIndicator.setX(1);
        a ? this._dropIndicator.setY(this.globalToLocal(a.localToGlobal(new flexiciousNmsp.Point(0, a.getHeight()))).getY()) : this._dropIndicator.setY(this.getBodyContainer().getY() + this.getBodyContainer().getCalculatedTotalHeight());
        this._dropIndicator.setWidth(this.getWidth() - this.isVScrollBarVisible);
        this._dropIndicator.setHeight(this.getStyle("dropIndicatorThickness"))
    };
    c.prototype.dragDrop = function() {};
    c.prototype.generateImageForDrag = function() {};
    c.prototype.invalidateSelection = function() {
        this._selectionInvalid = !0;
        this.doInvalidate()
    };
    c.prototype.placeComponents = function(a) {
        this.placeChildComponents(a.cells)
    };
    c.prototype.placeChildComponents = function(a) {
        for (var b = 0; b < a.length; b++) this.placeComponent(a[b])
    };
    c.prototype.getCornerY = function(a) {
        var b = this.getDisplayOrder().indexOf("filter") < this.getDisplayOrder().indexOf("header");
        return a.row.getIsFilterRow() ? b ? 0 : this.getColumnLevel().getHeaderHeight() * this.getColumnLevel().getMaxColumnGroupDepth() : a.row.getIsHeaderRow() || a.row.getIsColumnGroupRow() ? (b = b ? this.getFilterRowHeight() : 0, a.component.implementsOrExtends("FlexDataGridColumnGroupCell") ? b + a.component.columnGroup.getDepth() * this.getColumnLevel().getHeaderHeight() - this.getColumnLevel().getHeaderHeight() : b + this.getColumnLevel().getMaxColumnGroupDepth() * this.getColumnLevel().getHeaderHeight() - this.getColumnLevel().getHeaderHeight() - (a.component.getHeight() - a.row.getHeight())) : a.component.getY()
    };
    c.prototype.placeComponent = function(a) {
        var b = a.row && !a.inCornerAreas ? a.row.getY() - (a.row.getIsHeaderRow() || a.row.getIsColumnGroupRow() ? a.component.getHeight() - a.row.getHeight() : 0) : this.getCornerY(a),
            c = a.component.implementsOrExtends("FlexDataGridColumnGroupCell") ? a.component.getX() : a.getX();
        a.component.move(c, b)
    };
    c.prototype.addComponent = function(a) {
        this.addChild(a)
    };
    c.prototype.drawDefaultSeperators = function() {
        this.getLeftLockedVerticalSeparator().setVisible(!1);
        this.getRightLockedVerticalSeparator().setVisible(!1);
        var a = d.decimalToColor(this.getStyle("lockedSeperatorColor"));
        0 < this.getColumnLevel().getLeftLockedColumns().length && (d.attachClass(this.getLeftLockedVerticalSeparator().domElement, "leftLockedVerticalSeparator"), this.getLeftLockedVerticalSeparator().setX(this.getLeftLockedContent().getWidth()), this.getLeftLockedVerticalSeparator().setY(this.getHeaderContainer().getY()), this.getLeftLockedVerticalSeparator().setHeight(this.getHeaderContainer().getHeight() + this.getFilterContainer().getHeight() + this.getBodyContainer().getHeight() + this.getFooterContainer().getHeight() - this.isHScrollBarVisible), this.getLeftLockedVerticalSeparator().setWidth(this.getStyle("lockedSeperatorThickness")), this.getLeftLockedVerticalSeparator().setVisible(!0), this.getLeftLockedVerticalSeparator().domElement.style.backgroundColor = a, this.setChildIndex(this.getLeftLockedVerticalSeparator(), this.numChildren()));
        0 < this.getColumnLevel().getRightLockedColumns().length && (d.attachClass(this.getRightLockedVerticalSeparator().domElement, "rightLockedVerticalSeparator"), this.getRightLockedVerticalSeparator().setX(this.getRightLockedContent().getX()), this.getRightLockedVerticalSeparator().setY(this.getHeaderContainer().getY()), this.getRightLockedVerticalSeparator().setHeight(this.getHeaderContainer().getHeight() + this.getFilterContainer().getHeight() + this.getBodyContainer().getHeight() + this.getFooterContainer().getHeight() - this.isHScrollBarVisible), this.getRightLockedVerticalSeparator().setWidth(this.getStyle("lockedSeperatorThickness")), this.getRightLockedVerticalSeparator().setVisible(!0), this.getRightLockedVerticalSeparator().domElement.style.backgroundColor = a, this.setChildIndex(this.getRightLockedVerticalSeparator(), this.numChildren()))
    };
    c.prototype.gotoHorizontalPosition = function(a) {
        this.getBodyContainer().gotoHorizontalPosition(a);
        this.recycleH(!0)
    };
    c.prototype.gotoVerticalPosition = function(a) {
        this.getBodyContainer().gotoVerticalPosition(a);
        this.synchronizeLockedVerticalScroll()
    };
    c.prototype.getExportableColumns = function(a) {
        return this.getColumnLevel().getExportableColumns(null, !0, a)
    };
    c.prototype.removeAllSorts = function() {
        this.getDataProvider();
        this.getColumnLevel().removeAllSorts();
        this.getColumnLevel().getIsClientFilterPageSortMode() ? this.rebuild() : this.processFilter()
    };
    c.prototype.getPrintableColumns = function(a) {
        for (var b = [], c = this.getPrintableColumns(), d = 0; d < c.length; d++) {
            var f = c[d];
            (!a.excludeHiddenColumns || f.getVisible()) && b.push(f)
        }
        return b
    };
    c.prototype.createFilter = function() {
        return this.getFilterContainer().createFilter(this.getColumnLevel(), null)
    };
    c.prototype.clearAllFilters = function() {
        this.itemFilters = {};
        this.rebuild()
    };
    c.prototype.clearFilter = function() {
        this.itemFilters[b.TOP_LEVEL_FILTER] = null;
        0 < this.getFilterContainer().rows.length && (this._triggerEvent = !1, this.getFilterContainer().rows[0].clearFilter(), this._triggerEvent = !0, this.getFilterContainer().rows[0].processFilter())
    };
    c.prototype.shiftColumns = function(a, b, c, d) {
        "undefined" == typeof d && (d = !1);
        c.shiftColumns(a, b, d);
        this.getBodyContainer().shiftColumns(a, b);
        this.reDraw()
    };
    c.prototype.isToolbarActionValid = function(a, b, c) {
        return null != this.toolbarActionValidFunction ? this.toolbarActionValidFunction(a, b, c) : a.requiresSingleSelection ? 1 == this.getSelectedKeys().length && (a = a.level, b = this.getLevelForItem(this.getSelectedObjects()[0]), -1 == a || b && b.getNestDepth() == a) ? !0 : !1 : a.requiresSelection ? 0 < this.getSelectedKeys().length : !0
    };
    c.prototype.enableDisableToolbarAction = function(a, b) {
        var c = this.getActionByCode(a);
        c && (c.enabled = b)
    };
    c.prototype.getToolbarActionButton = function(a) {
        return (a = this.getActionByCode(a)) ? a.trigger : null
    };
    c.prototype.setToolbarActionButtonProperty = function(a, b, c) {
        (a = this.getToolbarActionButton(a)) && (a.hasOwnProperty(b) ? a[b] = c : a.setStyle(b, c))
    };
    c.prototype.defaultDynamicLevelHasChildrenFunction = function(a) {
        return 0 < this.getLength(this.getChildren(a, this.getColumnLevel()))
    };
    c.prototype.getSelectedObjects = function(a, b) {
        "undefined" == typeof a && (a = !1);
        "undefined" == typeof b && (b = !1);
        for (var c = [], d = b ? this.getColumnLevel().getUnSelectedObjects() : this.getColumnLevel().getSelectedObjects(), f = 0; f < d.length; f++) {
            var g = d[f];
            c.push(a ? this.getColumnLevel().getItemKey(g) : g)
        }
        this.getColumnLevel().nextLevel && this.getColumnLevel().nextLevel.getSelectedObjectsDeep(c, a, b);
        return c
    };
    c.prototype.getOpenObjects = function() {
        return this.getOpenItems().source.slice()
    };
    c.prototype.getOpenKeys = function() {
        var a = [];
        this.getColumnLevel().getOpenKeys(a);
        return a
    };
    c.prototype.setOpenKeys = function(a) {
        this.getBodyContainer().clearOpenItems();
        this.getColumnLevel().setOpenKeys(a);
        this.rebuild()
    };
    c.prototype.setSelectedObjects = function(a, b) {
        "undefined" == typeof b && (b = !0);
        this.getColumnLevel().setSelectedObjects(a, b)
    };
    c.prototype.setSelectedKeys = function(a, b) {
        "undefined" == typeof b && (b = !0);
        this.getColumnLevel().setSelectedKeys(a, b)
    };
    c.prototype.getSelectedKeys = function() {
        return this.getSelectedObjects(!0)
    };
    c.prototype.getUnSelectedKeys = function() {
        return this.getSelectedObjects(!0, !0)
    };
    c.prototype.gotoRow = function(a) {
        this.getBodyContainer().gotoRow(a);
        this.synchronizeLockedVerticalScroll()
    };
    c.prototype.selectText = function(a) {
        this.getBodyContainer().selectText(a)
    };
    c.prototype.gotoItem = function(a, b, c) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = null);
        this.getBodyContainer().gotoItem(a, b, !1, c);
        this.synchronizeLockedVerticalScroll()
    };
    c.prototype.gotoKey = function(a, b, c) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = null);
        this.getBodyContainer().gotoItem(a, b, !0, c);
        this.synchronizeLockedVerticalScroll()
    };
    c.prototype.quickFind = function(a) {
        return this.getBodyContainer().quickFind(a)
    };
    c.prototype.getCurrentEditCell = function() {
        return this._editCell
    };
    c.prototype.getCurrentEditor = function() {
        return this._editor
    };
    c.prototype.synchronizeLockedVerticalScroll = function() {
        this.getLeftLockedContent().setVerticalScrollPosition(this.getBodyContainer().getVerticalScrollPosition());
        this.getRightLockedContent().setVerticalScrollPosition(this.getBodyContainer().getVerticalScrollPosition())
    };
    c.prototype.synchronizeHorizontalScroll = function() {
        this.getHeaderContainer().setHorizontalScrollPosition(this.getBodyContainer().getHorizontalScrollPosition());
        this.getFooterContainer().setHorizontalScrollPosition(this.getBodyContainer().getHorizontalScrollPosition());
        this.getFilterContainer().setHorizontalScrollPosition(this.getBodyContainer().getHorizontalScrollPosition())
    };
    c.prototype.getFilteredPagedSortedData = function(a, b, c, d, f) {
        "undefined" == typeof b && (b = !0);
        "undefined" == typeof c && (c = !0);
        "undefined" == typeof d && (d = !0);
        "undefined" == typeof f && (f = null);
        return this.getBodyContainer().getFilteredPagedSortedData(a, b, c, d, f)
    };
    c.prototype.getItemAtPosition = function(a) {
        return this.getBodyContainer().getItemAtPosition(a)
    };
    c.prototype.getParentContainer = function(a) {
        return a.parent == this.getBodyContainer || a.parent == this.getLeftLockedContent || a.parent == this.getRightLockedContent ? this.getBodyContainer() : a.rowInfo.getIsFilterRow() && a.level == this.getColumnLevel() ? this.getFilterContainer() : a.rowInfo.getIsHeaderRow() && a.level == this.getColumnLevel() ? this.getHeaderContainer() : a.rowInfo.getIsFooterRow() && a.level == this.getColumnLevel() ? this.getFooterContainer() : this.getBodyContainer()
    };
    c.prototype.getChildrenLength = function(a, b, c, d, f) {
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof d && (d = !1);
        "undefined" == typeof f && (f = !1);
        a = this.getChildren(a, b, c, d, f);
        return this.getLength(a)
    };
    c.prototype.getLength = function(a) {
        return d.getLength(a)
    };
    c.prototype.getChildren = function(a, b, c, d, f) {
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof d && (d = !1);
        "undefined" == typeof f && (f = !1);
        var g;
        if (null != this.getChildrenFunction) g = this.getChildrenFunction(a, b);
        else {
            if (null == b.childrenField || "" == b.childrenField) return [];
            g = a.hasOwnProperty(b.childrenField) ? a[b.childrenField] : []
        }
        return null == g ? [] : c || d || f ? this.getBodyContainer().filterPageSort(g, b.nextLevel ? b.nextLevel : b, a, c, d, f) : g
    };
    c.prototype.getParent = function(a, b) {
        return this.enableVirtualScroll ? this.getVirtualBodyContainer().getParentOpenItemFromObject(a) : null == b.parentField || "" == b.parentField ? this.getBodyContainer().parentMap[b.getItemKey(a)] : a[b.parentField]
    };
    c.prototype.getDataForPrintExport = function(a) {
        return a.printExportOption == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE ? this.getIsClientFilterPageSortMode() ? this.getFilteredPagedSortedData({}, !0, !0, !0) : this.getDataProvider() : a.printExportOption == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS ? this.getSelectedObjectsTopLevel() : this.getIsClientFilterPageSortMode() ? a.printExportOption == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES ? this.getFilteredPagedSortedData({}, !0, !0, !0, [a.pageFrom, a.pageTo]) : this.getFilteredPagedSortedData({}, !0, !1, !0, null) : this._printExportData
    };
    c.prototype.showColumns = function(a) {
        this.getColumnLevel().showColumns(a)
    };
    c.prototype.showPrintableColumns = function() {
        this.getColumnLevel().showPrintableColumns()
    };
    c.prototype.getFilterArguments = function() {
        return this.getFilterContainer().getFilterArguments()
    };
    c.prototype.getRootFilter = function() {
        this.itemFilters[b.TOP_LEVEL_FILTER] || (this.itemFilters[b.TOP_LEVEL_FILTER] = new flexiciousNmsp.AdvancedFilter, this.itemFilters[b.TOP_LEVEL_FILTER].pageIndex = 0);
        return this.itemFilters[b.TOP_LEVEL_FILTER]
    };
    c.prototype.setFilterValue = function(a, b, c) {
        "undefined" == typeof c && (c = !0);
        var d = this.getColumnLevel().getColumnByDataField(a, "searchField");
        this.getRootFilter().addOperatorCriteria(d.getSearchField(), d.filterOperation, b);
        0 == this.getFilterContainer().rows.length && this.rebuildFilter();
        this.getFilterContainer().setFilterValue(a, b);
        c && this.processFilter()
    };
    c.prototype.setFilterFocus = function(a) {
        return this.getFilterContainer().setFilterFocus(a)
    };
    c.prototype.getFilterValue = function(a) {
        return this.getRootFilter().getFilterValue(a)
    };
    c.prototype.processSort = function(a) {
        this.getColumnLevel().removeAllSorts();
        for (var b = 0; b < a.length; b++){
        	var c = a[b];
        	this.getColumnLevel().addSort(c);
            this.rebuildBody();
            this.rebuildHeader()
        }        
    };
    c.prototype.clearColumns = function() {
        this.getColumnLevel().clearColumns()
    };
    c.prototype.addColumn = function(a) {
        this.getColumnLevel().addColumn(a)
    };
    c.prototype.removeColumn = function(a) {
        this.getColumnLevel().removeColumn(a)
    };
    c.prototype.getColumnByDataField = function(a) {
        return this.getColumnLevel().getColumnByDataField(a)
    };
    c.prototype.getColumnByUniqueIdentifier = function(a) {
        return this.getColumnLevel().getColumnByUniqueIdentifier(a)
    };
    c.prototype.distributeColumnWidthsEqually = function() {
        this.getColumnLevel().distributeColumnWidthsEqually()
    };
    c.prototype.getLevel = function(a) {
        for (var b = this.getColumnLevel(); null != b;) {
            if (b.getNestDepth() == a) return b;
            b = b.nextLevel
        }
        return null
    };
    c.prototype.expandToLevel = function(a, b) {
        if (this.enableVirtualScroll) throw Error("This method is not supported when enableVirtualScroll=true");
        if (a < this.getMaxDepth() && 0 <= a) {
            this._currentExpandLevel = a;
            this.getBodyContainer().clearOpenItems();
            if (0 < this._currentExpandLevel) for (var c = this.flatten(this._currentExpandLevel, !0, !0, !1, !0, -1), d = 0; d < c.length; d++) {
                var f = c[d];
                if (b && b > d) return;
                this.getBodyContainer().addOpenItem(f, null, !1)
            }
            this.dispatchEvent(new flexiciousNmsp.BaseEvent("expandChanged"));
            this.rebuildBody()
        }
    };
    c.prototype.rebuildBody = function(a) {
        "undefined" == typeof a && (a = !1);
        this.inRebuildBody || (this.inRebuildBody = !0, this.updateTotalRecords = a, this.getBodyContainer().invalidateCalculatedHeight(), this.currentPoint.reset(), this.getBodyContainer().createComponents(this.getColumnLevel()), this.updateTotalRecords = !0, this.inRebuildBody = !1)
    };
    c.prototype.rebuildHeader = function() {
        this.currentPoint.reset();
        this.getHeaderContainer().createComponents(this.getColumnLevel())
    };
    c.prototype.rebuildPager = function() {
        this.currentPoint.reset();
        this.getPagerContainer().createComponents(this.getColumnLevel())
    };
    c.prototype.rebuildFooter = function() {
        this.currentPoint.reset();
        this.getFooterContainer().createComponents(this.getColumnLevel())
    };
    c.prototype.rebuildFilter = function() {
        this.currentPoint.reset();
        this.getFilterContainer().createComponents(this.getColumnLevel())
    };
    c.prototype.redrawBody = function() {
        this.currentPoint.reset();
        this.getBodyContainer().createComponents(this.getColumnLevel())
    };
    c.prototype.expandUp = function() {
        this.expandToLevel(this._currentExpandLevel - 1)
    };
    c.prototype.expandDown = function() {
        this.expandToLevel(this._currentExpandLevel + 1)
    };
    c.prototype.expandAllColumnGroups = function(a) {
        "undefined" == typeof a && (a = 1);
        a = this.getColumnLevel().getColumnGroupsAtLevel(a);
        for (var b = 0; b < a.length; b++) a[b].openColumns()
    };
    c.prototype.collapseAllColumnGroups = function(a) {
        "undefined" == typeof a && (a = 1);
        a = this.getColumnLevel().getColumnGroupsAtLevel(a);
        for (var b = 0; b < a.length; b++) a[b].closeColumns()
    };
    c.prototype.expandAll = function() {
        this.expandToLevel(this.getMaxDepth() - 1)
    };
    c.prototype.collapseAll = function() {
        this.expandToLevel(0)
    };
    c.prototype.showTooltip = function(a, b, c, d, f, g, n, p, q) {
        "undefined" == typeof d && (d = null);
        "undefined" == typeof f && (f = 0);
        "undefined" == typeof g && (g = 0);
        "undefined" == typeof n && (n = !0);
        "undefined" == typeof p && (p = "left");
        "undefined" == typeof q && (q = null);
        this.tooltipBehavior.showTooltip(a, b, c, d, f, g, n, p, q)
    };
    c.prototype.hideTooltip = function() {
        this.tooltipBehavior.hideTooltip()
    };
    c.prototype.dispatchEvent = function(a) {
        a.implementsOrExtends("ExtendedFilterPageSortChangeEvent") && this.showSpinnerOnFilterPageSort && ("server" == this.getFilterPageSortMode() || "itemLoad" == a.type) && this.showSpinner();
        return a.type == flexiciousNmsp.FlexDataGridEvent.CHANGE && this.enableDelayChange && !this.inUpdate && a.grid == this ? (this._changePending = !0, this.invalidateDisplayList(), !1) : a.type == flexiciousNmsp.FlexDataGridEvent.CHANGE && null == a.grid ? !1 : flexiciousNmsp.NdgBase.prototype.dispatchEvent.apply(this, [a])
    };
    c.prototype.getItemFilter = function(a, c) {
        return this.itemFilters[1 == a.getNestDepth() ? b.TOP_LEVEL_FILTER : c]
    };
    c.prototype.dispatchAutoRefreshEvent = function(a) {
        this.lastAutoRefresh = new Date;
        this.enableAutoRefresh && this.autoRefreshTimer && (this.autoRefreshTimer.stop(), this.autoRefreshTimer.start());
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.AUTO_REFRESH, this, null, null, null, null, a))
    };
    c.prototype.defaultExpandCollapseTooltipFunction = function(a) {
        return !this.allowInteractivity ? "" : a.level.isItemOpen(a.rowInfo.getData()) ? this.collapseTooltip : this.expandTooltip
    };
    c.prototype.setToolbarActions = function(a) {
        this.toolbarActions = [];
        for (var b = 0; b < a.length; b++) {
            var c = this.extractActionFromObject(a[b]);
            this.toolbarActions.push(c)
        }
    };
    c.prototype.extractAction = function(a) {
        var b = a.implementsOrExtends("ToolbarAction") ? a : null;
        if (!b) {
            var b = new flexiciousNmsp.ToolbarAction(""),
                c;
            for (c in a) a.hasOwnProperty(c) && d.isPrimitive(a[c]) && (b[c] = a[c])
        }
        return b
    };
    c.prototype.addToolbarAction = function(a, b) {
        "undefined" == typeof b && (b = -1);
        var c = this.extractAction(a);
        0 <= b ? this.toolbarActions.splice(b, 0, c) : this.toolbarActions.push(c);
        this.toolbarActions.refresh()
    };
    c.prototype.removeToolbarAction = function(a) {
        for (var b, c = this.toolbarActions, d = 0; d < c.length; d++) {
            var f = c[d];
            if (f.code == a) {
                b = f;
                break
            }
        }
        b && (this.toolbarActions.splice(this.toolbarActions.indexOf(b), 1), this.toolbarActions.refresh())
    };
    c.prototype.runToolbarAction = function(a, c, d) {
        null != this.toolbarActionExecutedFunction && this.toolbarActionExecutedFunction(a, c, d);
        c = new flexiciousNmsp.WrapperEvent("toolbarActionExecuted", a);
        this.dispatchEvent(c);
        if (!c.isDefaultPrevented() && a) if ("filter" == a.code) this.setPreservePager(!0), this.setEnableFilters(!this.getEnableFilters());
        else if ("sort" == a.code) this.multiColumnSortShowPopup();
        else if ("addRow" == a.code) a = this.getRootFlat(), a.implementsOrExtends("Array") ? a.push(this.obj) : a.hasOwnProperty("addItem") && a.push(this.obj), this.trackChange(this.obj, flexiciousNmsp.ChangeInfo.CHANGE_TYPE_INSERT), this.rebuild();
        else if ("delete" == a.code) {
            if (c = this.getSelectedItem()) {
                a = this.getRootFlat();
                var f = this.getLevelForItem(c);
                f && 1 < f.getNestDepth() && (d = this.getParent(c, f)) && (a = this.getChildren(d, f));
                a.implementsOrExtends("Array") && a.splice(c, 1);
                this.clearSelection();
                this.trackChange(c, flexiciousNmsp.ChangeInfo.CHANGE_TYPE_DELETE);
                this.rebuild()
            }
        } else if (a.code == b.MOVE_UP || a.code == b.MOVE_DOWN || a.code == b.MOVE_TOP || a.code == b.MOVE_BOTTOM) {
            c = this.getSelectedObjects()[0];
            d = this.getBodyContainer().rows;
            for (var g = 0; g < d.length; g++) {
                var m = d[g];
                if (m.getData() == c) {
                    f = m;
                    break
                }
            }
            f && (f.rowPositionInfo.getLevel(this), 1 == this.level.getNestDepth() ? f = this.getRootFlat() : (f = this.getParent(c, this.level), f = this.getChildren(f, this.level.getParentLevel())), d = f.indexOf(c), a = this.getNewIndex(f, c, a.code), f.splice(d, 1), f.splice(a, 1, c), this.setPreservePager(!0), this.rebuild())
        }
    };
    c.prototype.getNewIndex = function(a, b, c) {
        b = a.indexOf(b);
        return c == Constants.MOVE_UP ? 0 == b ? 0 : --b : b == a.length - 1 ? a.length - 1 : ++b
    };
    c.prototype.createBuiltinAction = function(a, b, c, d) {
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof d && (d = !1);
        var f = new flexiciousNmsp.ToolbarAction(a);
        f.code = b ? b : a;
        if (b = this.getActionByCode(f.code)) return b;
        f.iconUrl = this.getStyle("toolbarAction" + flexiciousNmsp.CellUtils.doCap(f.code) + "IconUrl");
        f.disabledIconUrl = this.getStyle("toolbarAction" + flexiciousNmsp.CellUtils.doCap(f.code) + "DisabledIconUrl");
        f.requiresSelection = c;
        f.requiresSingleSelection = d;
        f.tooltip = a;
        return f
    };
    c.prototype.getActionByCode = function(a) {
        for (var b = this.toolbarActions, c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.code == a) return d
        }
        return null
    };
    c.prototype.setPredefinedFilters = function(a) {
        this.predefinedFilters.removeAll();
        for (var b = 0; b < a.length; b++);
        a = new Filter;
        a.copyFrom(this.getItem);
        this.predefinedFilters.push(a);
        this.predefinedFilters.refresh()
    };
    c.prototype.setErrorByKey = function(a, b, c) {
        var d = this.getColumnLevel().getItemFromKey(a);
        if (d) this.setErrorByObject(d, b, c);
        else throw Error("Item with key " + a + " not found.");
    };
    c.prototype.setErrorByObject = function(a, b, c) {
        this.errorMap.getValue(a) || this.errorMap.addItem(a, {});
        this.errorMap.getValue(a)[b] = c;
        this.hasErrors = !0;
        a = this.getBodyContainer().getCellForRowColumn(a, null);
        this._editor && this._editor.setErrorString(c);
        a && a.rowInfo.invalidateCells()
    };
    c.prototype.clearErrorByKey = function(a, b) {
        "undefined" == typeof b && (b = "");
        var c = this.getColumnLevel().getItemFromKey(a);
        if (c) this.clearErrorByObject(c, b);
        else throw Error("Item with key " + a + " not found.");
        this.hasErrors = 0 < this.getAllErrorString().length
    };
    c.prototype.clearAllErrors = function() {
        this.errorMap.clear();
        this.getBodyContainer().invalidateCells()
    };
    c.prototype.clearErrorByObject = function(a, b) {
        "undefined" == typeof b && (b = "");
        if (b && this.errorMap.getValue(a)) {
            delete this.errorMap.getValue(a)[b];
            for (var c in this.getValue(a)) this.hasErrors = !0;
            this.hasErrors || this.errorMap.removeItem(a)
        } else this.errorMap.getValue(a) && this.errorMap.removeItem(a);
        (c = this.getBodyContainer().getCellForRowColumn(a, null)) && c.rowInfo.invalidateCells()
    };
    c.prototype.getError = function(a) {
        return this.errorMap.getValue(a)
    };
    c.prototype.getAllErrorString = function() {
        for (var a = "", b = 0; b < this.errorMap.keys.length; b++) {
            var c = this.errorMap.keys[b],
                d = this.getLevelForItem(c);
            if (d) {
                var d = d.getItemKey(this.getItem),
                    a = a + ("Item with ID " + d + " has the following errors\n"),
                    c = this.errorMap.getValue(c),
                    f;
                for (f in c) a += f + "" + c[f] + "\n"
            }
        }
        return a
    };
    c.prototype.getLevelForItem = function(a, b, c) {
        "undefined" == typeof b && (this.flat = null);
        "undefined" == typeof c && (this.level = null);
        b || (b = this.getRootFlat());
        this.level || (this.level = this.getColumnLevel());
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            if (this.level.areItemsEqual(d, a)) return this.level;
            if (this.level.nextLevel && (d = this.getLevelForItem(a, this.level.getChildren(d), this.level.nextLevel))) return d
        }
        return null
    };
    c.prototype.calculateRowHeight = function(a, b, c) {
        var d = b.getRowHeightFromType(c);
        if (!this.variableRowHeight || c != flexiciousNmsp.RowPositionInfo.ROW_TYPE_DATA) return d;
        if (null != this.getRowHeightFunction) return this.getRowHeightFunction(a, b, c);
        c = b.getFlowColumns();
        this.measurer || (this.measurer = new flexiciousNmsp.UIComponent("div"), this.measurer.domElement.style.position = "absolute");
        this.addChild(this.measurer);
        for (var f = 0; f < c.length; f++) var g = c[f],
            n = g.getStyleValue("paddingLeft"),
            p = g.getStyleValue("paddingTop"),
            q = g.getStyleValue("paddingRight"),
            s = g.getStyleValue("paddingBottom"),
            n = n + (g.enableHierarchicalNestIndent ? b.getMaxPaddingCellWidth() : 0),
            d = this.measureCellHeight(g, n, q, p, s, g.itemRenderer, d, g.itemToLabel(a), a, g);
        this.removeChild(this.measurer);
        this.measurer = null;
        return d
    };
    c.prototype.measureCellHeight = function(a, b, c, d, f, g, n, p, q) {
        this.variableRowHeightUseRendererForCalculation && g ? (b = null, this.getBodyContainer().variableRowHeightRenderers.getValue(a) && (b = this.getBodyContainer().variableRowHeightRenderers.getValue(a)), b || (b = g.newInstance(), this.getBodyContainer().variableRowHeightRenderers.addItem(a, b), this.addChild(b)), b.setWidth(a.getWidth()), b.setText(p), b.setData(q), b.validateNow(), a = b.getWidth() + d + f + 2, n = a > n ? a : n) : (this.measurer.setInnerHTML(p), this.measurer.domElement.style.width = a.getWidth() - b - c - 4 + "px", this.measurer.domElement.style.height = "auto", this.measurer.domElement.style.whiteSpace = "normal", this.measurer.setInnerHTML(p), n = this.measurer.domElement.offsetHeight > n ? Math.max(n, Math.ceil(this.measurer.domElement.offsetHeight) + d + f + 2) : n);
        return n
    };
    c.prototype.showToaster = function(a, b, c, d, f, g, n) {
        flexiciousNmsp.Toaster.showToaster(a, b, c, d, f, g, n)
    };
    c.prototype.addSelectedItem = function(a) {
        this.getColumnLevel().addSelectedItem(a)
    };
    c.prototype.expandChildrenOf = function(a, b, c) {
        "undefined" == typeof c && (c = null);
        c || (c = this.getColumnLevel());
        this.addRemoveFromOpenItems(a, b, c);
        this.rebuildBody();
        this.validateNow();
        (this.currentCell = this.getBodyContainer().getCellForRowColumn(a, null, !0)) && this.highlightRow(this.currentCell, this.currentCell.rowInfo, !0)
    };
    c.prototype.addRemoveFromOpenItems = function(a, b, c) {
        if (c.nextLevel || c.nextLevelRenderer) {
            var d = this.getChildren(a, c);
            if (0 < this.getLength(d) && (b && !c.isItemOpen(a) ? this.getBodyContainer().addOpenItem(a) : !b && c.isItemOpen(a) && this.getBodyContainer().removeOpenItem(a), c.nextLevel)) for (a = 0; a < d.length; a++) this.addRemoveFromOpenItems(d[a], b, c.nextLevel)
        }
    };
    c.prototype.trackChange = function(a, b, c, d, f, g) {
        "undefined" == typeof c && (c = null);
        "undefined" == typeof d && (d = null);
        "undefined" == typeof f && (f = null);
        "undefined" == typeof g && (g = null);
        if (this.enableTrackChanges) {
            for (var n = this.getChanges(), p = 0; p < n.length; p++) {
                var q = n[p];
                if (q.changedItem == a && q.changeType == b && q.changedProperty == d) {
                    q.newValue = g;
                    this.dispatchEvent(new flexiciousNmsp.BaseEvent("rowChanged"));
                    return
                }
            }
            c = c ? c : this.getLevelForItem(a);
            this.getChanges().push(new flexiciousNmsp.ChangeInfo(a, c ? c.getNestDepth() : 1, d, f, g, b));
            this.dispatchEvent(new flexiciousNmsp.BaseEvent("rowChanged"))
        }
    };
    c.prototype.setSelectedItemsBasedOnSelectedField = function(a, b) {
        "undefined" == typeof a && (a = !1);
        "undefined" == typeof b && (b = !0);
        var c = this.getColumnLevel().setSelectedItemsBasedOnSelectedField(this.getRootFlat(), null, b);
        a && this.rebuildBody();
        c && (c = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this, this.getColumnLevel(), null), this.dispatchEvent(c))
    };
    c.prototype.addEventListener = function(a, b, c, d, f) {
        flexiciousNmsp.NdgBase.prototype.addEventListener.apply(this, [a, b, c, d, f]);
        a == flexiciousNmsp.FlexDataGridEvent.CELL_RENDERED ? this.dispatchCellRenderered = !0 : a == flexiciousNmsp.FlexDataGridEvent.RENDERER_INITIALIZED ? this.dispatchRendererInitialized = !0 : a == flexiciousNmsp.FlexDataGridEvent.CELL_CREATED && (this.dispatchCellCreated = !0)
    };
    c.prototype.getFilterColumn = function(a) {
        for (var b = this.getColumns(), c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.getSearchField() == a) return d
        }
        return null
    };
    c.prototype.showMessage = function(a) {
        this.spinnerBehavior.showMessage(a)
    };
    c.prototype.onGridResized = function() {
        this.noDataMessage && (this.spinner && this.spinner.getVisible()) && this.checkNoDataMessage(!0)
    };
    c.prototype.defaultWordHandlerFunction = function() {
        var a = this.wordOptions;
        a.exportOptionsRenderer = this.popupFactoryExportOptions;
        flexiciousNmsp.ExtendedExportController.instance().doexport(this, a)
    };
    c.prototype.defaultExcelHandlerFunction = function() {
        var a = this.excelOptions;
        a.exportOptionsRenderer = this.popupFactoryExportOptions;
        flexiciousNmsp.ExtendedExportController.instance().doexport(this, a)
    };
    c.prototype.defaultPrintHandlerFunction = function() {
        var a = this.htmlOptions;
        a.exportOptionsRenderer = this.popupFactoryExportOptions;
        flexiciousNmsp.ExtendedExportController.instance().doexport(this, a)
    };
    c.prototype.defaultPdfHandlerFunction = function() {
        var a = this.pdfOptions;
        a.asynch = !0;
        a.printOptionsViewrenderer = this.popupFactoryPrintOptions;
        a.showWarningMessage = !1
    };
    c.prototype.createPrintComponentFactory = function() {
        return this.printComponentFactory
    };
    c.prototype.isCtrlKeyDownOrSticky = function(a) {
        return a.ctrlKey && (this.getSelectionMode() == flexiciousNmsp.NdgBase.SELECTION_MODE_MULTIPLE_ROWS || this.getSelectionMode() == flexiciousNmsp.NdgBase.SELECTION_MODE_MULTIPLE_CELLS) || this.enableStickyControlKeySelection
    };
    c.prototype.getUserSettingsController = function() {
        return flexiciousNmsp.UserSettingsController.instance()
    };
    c.prototype.alignColumnGroups = function() {
        for (var a = this.getColumnLevel().columnGroups, b = 0; b < a.length; b++) this.cascadeColumnGroups(a[b]);
        this.getColumnLevel().setGroupedColumns(this.getColumnLevel().getGroupedColumns())
    };
    c.prototype.cascadeColumnGroups = function(a) {
        a.setGroupedColumns(a.getGroupedColumns());
        a = a.columnGroups;
        for (var b = 0; b < a.length; b++) this.cascadeColumnGroups(a[b])
    };
    c.prototype.getRowSpanBasedOnOpenItemCount = function(a) {
        return this.getOpenItemCount(a)
    };
    c.prototype.getOpenItemCount = function(a) {
        if (a.rowInfo.getIsDataRow() && !a.rowInfo.getIsFillRow() && a.getColumn() && a.getColumn().getColIndex() == a.level.getNestDepth() - 1 && a.getColumn().getIsLeftLocked() && a.level.isItemOpen(a.rowInfo.getData())) {
            var b = this.getChildren(a.rowInfo.getData(), a.level),
                c = this.getLength(b) + 1;
            a.level.nextLevel && (c += this.getRecursiveOpenItemCount(b, a.level.nextLevel));
            return c
        }
        return 1
    };
    c.prototype.getRecursiveOpenItemCount = function(a, b) {
        for (var c = 0, d = 0; d < a.length; d++) {
            var f = a[d];
            b.isItemOpen(f) && (f = this.getChildren(f, b), c += this.getLength(f), b.nextLevel && (c += this.getRecursiveOpenItemCount(f, b.nextLevel)))
        }
        return c
    };
    c.prototype.showSpinner = function(a) {
        "undefined" == typeof a && (a = "");
        this.spinnerBehavior.showSpinner(a)
    };
    c.prototype.hideSpinner = function() {
        this.spinnerBehavior.hideSpinner()
    };
    c.prototype.invalidateFiller = function() {
        this.enableFillerRows && (this._fillerInvalidated = !0, this.doInvalidate())
    };
    c.prototype.drawFiller = function() {
        var a = this.getStyle("alternatingItemColors");
        this.getBodyContainer().setBackgroudFillerSize();
        this.getLeftLockedContent().setBackgroudFillerSize();
        this.getRightLockedContent().setBackgroudFillerSize();
        var b = this.getStyle("verticalGridLines"),
            c = this.getStyle("verticalGridLineThickness"),
            d = this.getStyle("verticalGridLineColor");
        this.getStyle("lockedSeperatorThickness");
        for (var f = this.getStyle("horizontalGridLines"), g = this.getStyle("horizontalGridLineThickness"), n = this.getStyle("horizontalGridLineColor"), p = [this.getLeftLockedContent(), this.getRightLockedContent(), this.getBodyContainer()], q = 0; q < p.length; q++) {
            var s = p[q],
                r = s == this.getLeftLockedContent() ? this.getColumnLevel().getLeftLockedColumns() : s == this.getRightLockedContent() ? this.getColumnLevel().getRightLockedColumns() : this.getColumnLevel().getUnLockedColumns(),
                w = s,
                w = s.backgroundForFillerRows;
            w.domElement.innerHTML = "<div style='position:relative'></div>";
            for (var v = 0, E = this.getBodyContainer().getItemVerticalPositions().length, z = this.getColumnLevel().getRowHeight(), u = {}, y = {}, F = {}, L = s.getHorizontalScrollPosition(); v < w.getHeight();) {
                var G = !1;
                v + z > w.getHeight() && (z = w.getHeight() - v, G = !0);
                var H = 0,
                    A = 0 == E % 2;
                if (this.enableDefaultDisclosureIcon && (this.getColumnLevel().nextLevel || this.getColumnLevel().nextLevelRenderer) && (s == this.getLeftLockedContent() && this.lockDisclosureCell || s == this.getBodyContainer() && !this.lockDisclosureCell)) H = this.drawFillerCell(w, a[A ? 0 : 1], v, H, 0 == r.length ? w.getWidth() : this.getColumnLevel().getDeepNestIndent(), b, c, d, f, g, n, z, !0, !0, 0);
                for (var B = 0; B < r.length; B++) {
                    var x = r[B],
                        C = null != F[x.getUniqueIdentifier()] ? F[x.getUniqueIdentifier()] : this.getBodyContainer().isInVisibleHorizontalRange(H, x.getWidth()) || x.getIsLocked();
                    F[x.getUniqueIdentifier()] = C;
                    var O = null != y[x.getUniqueIdentifier()] ? y[x.getUniqueIdentifier()] : s == this.getLeftLockedContent() && x.getIsLastLeftLocked() || s == this.getRightLockedContent() && x.getIsLastrightLocked() || s == this.getBodyContainer() && x.getIsLastUnLocked();
                    y[x.getUniqueIdentifier()] = O;
                    var I = a[A ? 0 : 1];
                    if (null == u[x.getUniqueIdentifier()]) {
                        var K = x.getStyle("backgroundColor");
                        x.isValidStyleValue(K) ? u[x.getUniqueIdentifier()] = K : u[x.getUniqueIdentifier()] = -1
                    } - 1 != u[x.getUniqueIdentifier()] && (I = u[x.getUniqueIdentifier()]);
                    H = this.drawFillerCell(w, I, v, H, x.getWidth(), b && !O, c, d, f, g, n, z, !1, C, L)
                }
                v += z;
                E++;
                if (G) break
            }
        }
    };
    c.prototype.drawFillerCell = function(a, b, c, f, g, m, n, p, q, s, r, w, v, E, z) {
        E && (v = document.createElement("div"), v.className = "flexDataGridCell", v.style.width = g + "px", v.style.height = w + "px", v.style.left = f - z + "px", v.style.top = c + "px", v.style.backgroundColor = d.decimalToColor(b), m && (v.style.borderRight = "solid " + n + "px " + d.decimalToColor(p)), q && (v.style.borderBottom = "solid " + s + "px " + d.decimalToColor(r)), a.domElement.firstChild.appendChild(v));
        return f + g
    };
    c.prototype.getCellBorderFunction = function() {
        return this.getColumnLevel().cellBorderFunction
    };
    c.prototype.setCellBorderFunction = function(a) {
        this.getColumnLevel().cellBorderFunction = a
    };
    c.prototype.getVisibleColumns = function() {
        return this.getColumnLevel().getVisibleColumns()
    };
    c.prototype.getCanExpandDown = function() {
        return 1 < this.getMaxDepth() && this._currentExpandLevel < this.getMaxDepth() - 1
    };
    c.prototype.getToolbarActionMoveDown = function() {
        var a = this.createBuiltinAction("", c.MOVE_DOWN, !0, !0);
        a.requiresSingleSelection = !0;
        return a
    };
    c.prototype.getSettingsColumns = function() {
        return this.getColumnLevel().getShowableColumns()
    };
    c.prototype.getExpandCollapseHeaderCellRenderer = function() {
        return this.getColumnLevel().expandCollapseHeaderCellRenderer
    };
    c.prototype.setExpandCollapseHeaderCellRenderer = function(a) {
        this.getColumnLevel().expandCollapseHeaderCellRenderer = a
    };
    c.prototype.getFilterFunction = function() {
        return this.getColumnLevel().filterFunction
    };
    c.prototype.setFilterFunction = function(a) {
        this.getColumnLevel().filterFunction = a
    };
    c.prototype.getHeaderContainer = function() {
        return this._treeDataGridHeader
    };
    c.prototype.getExpandCollapseCellRenderer = function() {
        return this.getColumnLevel().expandCollapseCellRenderer
    };
    c.prototype.setExpandCollapseCellRenderer = function(a) {
        this.getColumnLevel().expandCollapseCellRenderer = a
    };
    c.prototype.getHeaderSectionHeight = function() {
        return (this.getEnablePaging() || this.getForcePagerRow() ? this.getColumnLevel().getPagerRowHeight() : 0) + (this.getEnableFilters() ? this.getColumnLevel().getFilterRowHeight() : 0) + this.getColumnLevel().getHeaderHeight() * this.getColumnLevel().getMaxColumnGroupDepth()
    };
    c.prototype.getLeftLockedFooter = function() {
        return this._leftLockedFooter
    };
    c.prototype.getCellCustomBackgroundDrawFunction = function() {
        return this.getColumnLevel().cellCustomBackgroundDrawFunction
    };
    c.prototype.setCellCustomBackgroundDrawFunction = function(a) {
        this.getColumnLevel().cellCustomBackgroundDrawFunction = a
    };
    c.prototype.getSelectedObjectsTopLevel = function() {
        return this.getColumnLevel().getSelectedObjects()
    };
    c.prototype.getSelectedKeys = function() {
        return this.getSelectedObjects(!0)
    };
    c.prototype.getDragColumn = function() {
        return this._dragColumn
    };
    c.prototype.getAdditionalFilterArgumentsFunction = function() {
        return this.getColumnLevel().additionalFilterArgumentsFunction
    };
    c.prototype.setAdditionalFilterArgumentsFunction = function(a) {
        this.getColumnLevel().additionalFilterArgumentsFunction = a
    };
    c.prototype.getCanExpandUp = function() {
        return 1 < this.getMaxDepth() && 0 < this._currentExpandLevel
    };
    c.prototype.getFooterVisible = function() {
        return this.getColumnLevel().footerVisible
    };
    c.prototype.setFooterVisible = function(a) {
        this.getColumnLevel().footerVisible = a
    };
    c.prototype.getRowDisabledFunction = function() {
        return this.getColumnLevel().rowDisabledFunction
    };
    c.prototype.setRowDisabledFunction = function(a) {
        this.getColumnLevel().rowDisabledFunction = a
    };
    c.prototype.getToolbarActionSeparator = function() {
        return this.createBuiltinAction("separator", "separator", !1)
    };
    c.prototype.getRowCount = function() {
        return this.getBodyContainer().getOnScreenRows().length
    };
    c.prototype.getSelectedIndices = function() {
        for (var a = [], b = this.getSelectedObjectsTopLevel(), c = 0; c < b.length; c++) {
            var d = b[c];
            a.push(this.getDataProvider().indexOf(d))
        }
        return a
    };
    c.prototype.getVirtualBodyContainer = function() {
        return this.getBodyContainer()
    };
    c.prototype.getUseElements = function() {
        return !1
    };
    c.prototype.getFilterVisible = function() {
        return this.getColumnLevel().filterVisible
    };
    c.prototype.setFilterVisible = function(a) {
        this.getColumnLevel();
        this.getColumnLevel().filterVisible = a
    };
    c.prototype.getSelectedKeyField = function() {
        return this.getColumnLevel().selectedKeyField
    };
    c.prototype.setSelectedKeyField = function(a) {
        this.getColumnLevel().selectedKeyField = a
    };
    c.prototype.setEditedItemPosition = function(a) {
        var b = a.rowIndex;
        a = a.getColIndex();
        if (b >= this.getBodyContainer().itemVerticalPositions.length) throw Error("Invalid Row index " + b + ". Max row index " + (this.getBodyContainer().itemVerticalPositions.length - 1));
        var c = this.getBodyContainer().itemVerticalPositions[b],
            d = c.getLevel(this).getVisibleColumns();
        if (a >= d.length) throw Error("Invalid Column index " + a + ". Max col index " + (d.length - 1));
        c = this.getBodyContainer().getCellForRowColumn(c.rowData, d[a]);
        if (!c) throw Error("Cell at Column index " + a + ", RowIndex " + b + " not found");
        this.getBodyContainer().emulateClick(c)
    };
    c.prototype.getPager = function() {
        return this.getPagerContainer().getPager()
    };
    c.prototype.getPagerRowHeight = function() {
        return this.getColumnLevel().getPagerRowHeight()
    };
    c.prototype.setPagerRowHeight = function(a) {
        this.getColumnLevel().setPagerRowHeight(a)
    };
    c.prototype.getNextLevelRenderer = function() {
        return this.getColumnLevel().nextLevelRenderer
    };
    c.prototype.setNextLevelRenderer = function(a) {
        this.getColumnLevel().setNextLevelRenderer(a)
    };
    c.prototype.getHasFilterFunction = function() {
        return this.getColumnLevel().getHasFilterFunction()
    };
    c.prototype.getHasGroupedColumns = function() {
        return this.getColumnLevel().hasGroupedColumns
    };
    c.prototype.getHasRowSpanOrColSpan = function() {
        return this._hasRowSpanOrColSpan
    };
    c.prototype.getItemLoadMode = function() {
        return this.getColumnLevel().itemLoadMode
    };
    c.prototype.setItemLoadMode = function(a) {
        this.getColumnLevel().itemLoadMode = a
    };
    c.prototype.getHeaderSortSeparatorRight = function() {
        return void 0 !== this.getStyle("headerSortSeparatorRight") ? this.getStyle("headerSortSeparatorRight") : 20
    };
    c.prototype.getOpenItems = function() {
        return this.getBodyContainer().openItems
    };
    c.prototype.setOpenItems = function() {
        this.getBodyContainer().openItems = this.val
    };
    c.prototype.getChildrenCountField = function() {
        return this.getColumnLevel()._childrenCountField
    };
    c.prototype.setChildrenCountField = function(a) {
        this.getColumnLevel()._childrenCountField = a
    };
    c.prototype.setVerticalScrollPolicy = function(a) {
        this.getBodyContainer().setVerticalScrollPolicy(a)
    };
    c.prototype.setEnabled = function(a) {
        flexiciousNmsp.NdgBase.setEnabled.apply(this, []);
        this.getBodyContainer() && this.getBodyContainer().setEnabled(a);
        this.getFooterContainer() && this.getFooterContainer().setEnabled(a);
        this.getFilterContainer() && this.getFilterContainer().setEnabled(a);
        this.getFooterContainer() && this.getFooterContainer().setEnabled(a);
        this.getPagerContainer() && this.getPagerContainer().setEnabled(a);
        this.getHeaderContainer() && this.getHeaderContainer().setEnabled(a);
        this.getLeftLockedContent() && this.getLeftLockedContent().setEnabled(a);
        this.getRightLockedContent() && this.getRightLockedContent().setEnabled(a);
        this.getLeftLockedHeader() && this.getLeftLockedHeader().setEnabled(a);
        this.getLeftLockedFooter() && this.getLeftLockedFooter().setEnabled(a);
        this.getRightLockedHeader() && this.getRightLockedHeader().setEnabled(a);
        this.getRightLockedFooter() && this.getRightLockedFooter().setEnabled(a)
    };
    c.prototype.getToolbarActionEdit = function() {
        return this.createBuiltinAction("Edit", "edit", !0, !0)
    };
    c.prototype.getEnableSplitHeader = function() {
        return this._enableSplitHeader && this.enableMultiColumnSort
    };
    c.prototype.setEnableSplitHeader = function(a) {
        this._enableSplitHeader = a
    };
    c.prototype.getRightLockedFooter = function() {
        return this._rightLockedFooter
    };
    c.prototype.getLevelRendererHeight = function() {
        return this.getColumnLevel().levelRendererHeight
    };
    c.prototype.setLevelRendererHeight = function(a) {
        this.getColumnLevel().levelRendererHeight = a
    };
    c.prototype.getLockedColumnCount = function() {
        return -1
    };
    c.prototype.getCurrentSorts = function() {
        return this.getColumnLevel().currentSorts
    };
    c.prototype.getPreservePager = function() {
        return this._preservePager && null != this.getPagerContainer().getPager()
    };
    c.prototype.setPreservePager = function(a) {
        this._componentsCreated && (this._preservePager = a)
    };
    c.prototype.getHorizontalScrollBar = function() {
        return this.getBodyContainer().getHorizontalScrollBar()
    };
    c.prototype.getPagerVisible = function() {
        return this.getColumnLevel().pagerVisible
    };
    c.prototype.setPagerVisible = function(a) {
        this.getColumnLevel().pagerVisible = a
    };
    c.prototype.getGroupedColumns = function() {
        return 0 == this.getColumnLevel()._groupedColumns.length ? this.getColumns() : this.getColumnLevel()._groupedColumns
    };
    c.prototype.setGroupedColumns = function(a) {
        this.getColumnLevel().setGroupedColumns(a);
        this.enableEagerDraw && this.rebuild();
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("columnsChanged"))
    };
    c.prototype.getPagerControl = function() {
        return this.getPagerContainer().getPager()
    };
    c.prototype.getPageSize = function() {
        return this.getColumnLevel().pageSize
    };
    c.prototype.setPageSize = function(a) {
        this.getColumnLevel().pageSize != a && (this.dispatchEvent(new flexiciousNmsp.BaseEvent("pageSizeChanged")), this.getIsClientFilterPageSortMode() || (this.getColumnLevel().pageSize = a, this.itemFilters[b.TOP_LEVEL_FILTER] && (this.itemFilters[b.TOP_LEVEL_FILTER].pageSize = a), this.processRootFilter()), this.getColumnLevel().pageSize = a, this.setPageIndex(0), this.getRootFilter().pageIndex = 0);
        this.enablePreferencePersistence && this._preferencesLoaded && this.rebuild()
    };
    c.prototype.getFilterRowHeight = function() {
        return this.getColumnLevel().getFilterRowHeight()
    };
    c.prototype.setFilterRowHeight = function(a) {
        this.getColumnLevel().setFilterRowHeight(a)
    };
    c.prototype.getVerticalScrollBar = function() {
        return this.getBodyContainer().getVerticalScrollBar()
    };
    c.prototype.getVerticalScrollPosition = function() {
        return this.getBodyContainer().getVerticalScrollPosition()
    };
    c.prototype.setVerticalScrollPosition = function(a) {
        this.getBodyContainer().gotoVerticalPosition(a)
    };
    c.prototype.getToolbarActionDelete = function() {
        return this.createBuiltinAction("Delete", "delete", !0, !0)
    };
    c.prototype.getChanges = function() {
        return this._changes
    };
    c.prototype.getHorizontalScrollPosition = function() {
        return this.getBodyContainer().getHorizontalScrollPosition()
    };
    c.prototype.setHorizontalScrollPosition = function(a) {
        this.getBodyContainer().gotoHorizontalPosition(a)
    };
    c.prototype.getRowSelectableFunction = function() {
        return this.getColumnLevel().rowSelectableFunction
    };
    c.prototype.setRowSelectableFunction = function(a) {
        this.getColumnLevel().rowSelectableFunction = a
    };
    c.prototype.getChildrenField = function() {
        return this.getColumnLevel().childrenField
    };
    c.prototype.setChildrenField = function(a) {
        this.getColumnLevel().childrenField = a
    };
    c.prototype.getMaxDepth = function() {
        for (var a = this.getColumnLevel(); null != a.nextLevel;) a = a.nextLevel;
        return a.getNestDepth() + (a.nextLevelRenderer ? 1 : 0)
    };
    c.prototype.getPagerCellRenderer = function() {
        return this.getColumnLevel().pagerCellRenderer
    };
    c.prototype.setPagerCellRenderer = function(a) {
        this.getColumnLevel().pagerCellRenderer = a
    };
    c.prototype.getLeftLockedContent = function() {
        return this._leftLockedContent
    };
    c.prototype.getExportableColumns = function() {
        return this.currentExportLevel ? this.currentExportLevel.getExportableColumns() : this.getColumnLevel().getExportableColumns()
    };
    c.prototype.getEnableFooters = function() {
        return this.getColumnLevel().getEnableFooters()
    };
    c.prototype.setEnableFooters = function(a) {
        this.getColumnLevel().setEnableFooters(a)
    };
    c.prototype.getColumnCount = function() {
        return this.getVisibleColumns().length
    };
    c.prototype.getToolbarActionAddRow = function() {
        return this.createBuiltinAction("Add Row", "addRow")
    };
    c.prototype.getSelectedItem = function() {
        return this.getColumnLevel().selectedItem
    };
    c.prototype.setSelectedItem = function(a) {
        this.clearSelection();
        this.addSelectedItem(a)
    };
    c.prototype.getRightLockedHeader = function() {
        return this._rightLockedHeader
    };
    c.prototype.getSelectedIndex = function() {
        return 0 < this.getSelectedObjectsTopLevel().length ? this.getDataProvider().indexOf(this.getSelectedObjects()[0]) : -1
    };
    c.prototype.setSelectedIndex = function(a) {
        this.clearSelection();
        (a = this.getDataProvider()[a]) && this.addSelectedItem(a)
    };
    c.prototype.getFilterRows = function() {
        return this.getFilterContainer().rows.slice()
    };
    c.prototype.getElementsToBlur = function() {
        return [this.getLeftLockedContent(), this.getRightLockedContent(), this.getBodyContainer()]
    };
    c.prototype.getHeaderSeperatorWidth = function() {
        return this.getColumnLevel().headerSeperatorWidth
    };
    c.prototype.setHeaderSeperatorWidth = function(a) {
        this.getColumnLevel().headerSeperatorWidth = a
    };
    c.prototype.getPagerContainer = function() {
        return this._treeDataGridPager
    };
    c.prototype.getColumnNames = function() {
        return d.extractPropertyValues(this.getVisibleColumns(), "headerText").join("|")
    };
    c.prototype.getRightLockedContent = function() {
        return this._rightLockedContent
    };
    c.prototype.getToolbarActionMoveUp = function() {
        var a = this.createBuiltinAction("", c.MOVE_UP, !0, !0);
        a.requiresSingleSelection = !0;
        return a
    };
    c.prototype.getColumns = function() {
        return this.getColumnLevel().getColumns()
    };
    c.prototype.setColumns = function(a) {
        this.getColumnLevel().setColumns(a);
        this.enableEagerDraw && this.rebuild();
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("columnsChanged"))
    };
    c.prototype.getPageIndex = function() {
        return this.getPagerContainer().getPager() ? this.getPagerContainer().getPager().getPageIndex() - 1 : null
    };
    c.prototype.setPageIndex = function(a) {
        this.getPagerContainer().getPager() && this.getPagerContainer().getPager().setPageIndex(a)
    };
    c.prototype.getNestIndent = function() {
        return this.getColumnLevel().nestIndent
    };
    c.prototype.setNestIndent = function(a) {
        this.getColumnLevel().nestIndent = a
    };
    c.prototype.getVerticalSpill = function() {
        return this.getBodyContainer().verticalSpill
    };
    c.prototype.getDisplayOrder = function() {
        return this.getColumnLevel().displayOrder
    };
    c.prototype.setDisplayOrder = function(a) {
        this.getColumnLevel().displayOrder = a
    };
    c.prototype.getColumnGroups = function() {
        return this.getColumnLevel().columnGroups
    };
    c.prototype.getNestIndentPaddingCellRenderer = function() {
        return this.getColumnLevel().nestIndentPaddingCellRenderer
    };
    c.prototype.setNestIndentPaddingCellRenderer = function(a) {
        this.getColumnLevel().nestIndentPaddingCellRenderer = a
    };
    c.prototype.getHeaderRowHeight = function() {
        return this.getColumnLevel().getHeaderHeight()
    };
    c.prototype.setHeaderRowHeight = function(a) {
        this.getColumnLevel().setHeaderHeight(a)
    };
    c.prototype.getMultiSortRenderer = function() {
        null == this._multiSortRenderer && (this._multiSortRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.MultiColumnSortPopup));
        return this._multiSortRenderer
    };
    c.prototype.setMultiSortRenderer = function(a) {
        this._multiSortRenderer = a
    };
    c.prototype.getEnableFilters = function() {
        return this.getColumnLevel().getEnableFilters()
    };
    c.prototype.setEnableFilters = function(a) {
        this.getColumnLevel().setEnableFilters(a)
    };
    c.prototype.getInitialSortField = function() {
        return this.getColumnLevel().initialSortField
    };
    c.prototype.setInitialSortField = function(a) {
        this.getColumnLevel().initialSortField = a
    };
    c.prototype.getHeaderVisible = function() {
        return this.getColumnLevel().headerVisible
    };
    c.prototype.setHeaderVisible = function(a) {
        this.getColumnLevel().headerVisible = a
    };
    c.prototype.getToolbarActionFilter = function() {
        return this.createBuiltinAction("Filter", "filter")
    };
    c.prototype.getToolbarActionSort = function() {
        return this.createBuiltinAction("Sort", "sort", !1, !1)
    };
    c.prototype.getSelectedItems = function() {
        return this.getSelectedObjects().slice()
    };
    c.prototype.getFilterPageSortMode = function() {
        return this.getColumnLevel().filterPageSortMode
    };
    c.prototype.setFilterPageSortMode = function(a) {
        this.getColumnLevel().filterPageSortMode = a
    };
    c.prototype.getRightLockedWidth = function() {
        return this.getColumnLevel().getWidestRightLockedWidth()
    };
    c.prototype.getInitialSortAscending = function() {
        return this.getColumnLevel().initialSortAscending
    };
    c.prototype.setInitialSortAscending = function(a) {
        this.getColumnLevel().initialSortAscending = a
    };
    c.prototype.getFooterContainer = function() {
        return this._treeDataGridFooter
    };
    c.prototype.getLeftLockedHeader = function() {
        return this._leftLockedHeader
    };
    c.prototype.getForcePagerRow = function() {
        return this.getColumnLevel().forcePagerRow
    };
    c.prototype.setForcePagerRow = function(a) {
        this.getColumnLevel().forcePagerRow = a
    };
    c.prototype.getHorizontalScrollPolicy = function() {
        return this.getBodyContainer().getHorizontalScrollPolicy()
    };
    c.prototype.setHorizontalScrollPolicy = function(a) {
        this.getBodyContainer().setHorizontalScrollPolicy(a)
    };
    c.prototype.getIsClientFilterPageSortMode = function() {
        return "client" == this.getColumnLevel().filterPageSortMode
    };
    c.prototype.getCurrentTooltipTrigger = function() {
        return this.tooltipBehavior.currentTooltipTrigger
    };
    c.prototype.getFooterRows = function() {
        return this.getFooterContainer().rows.slice()
    };
    c.prototype.getMaxHorizontalScrollPosition = function() {
        return this.getBodyContainer().getMaxHorizontalScrollPosition()
    };
    c.prototype.getBodyContainer = function() {
        return this._treeDataGridContainer
    };
    c.prototype.getPrintableColumns = function() {
        return this.getColumnLevel().getPrintableColumns()
    };
    c.prototype.getPagerRenderer = function() {
        return this.getColumnLevel().getPagerRenderer()
    };
    c.prototype.setPagerRenderer = function(a) {
        this.getColumnLevel().setPagerRenderer(a)
    };
    c.prototype.getToolbarActionMoveTo = function() {
        var a = this.createBuiltinAction("Move to", "moveTo", !0, !0);
        a.requiresSingleSelection = !0;
        return a
    };
    c.prototype.getDisabledField = function() {
        return this.getColumnLevel().disabledField
    };
    c.prototype.setDisabledField = function(a) {
        this.getColumnLevel().disabledField = a
    };
    c.prototype.getLockedColumnWidth = function() {
        return -1
    };
    c.prototype.getElementToCenter = function() {
        return this
    };
    c.prototype.getSortableColumns = function() {
        return this.getColumnLevel().getSortableColumns()
    };
    c.prototype.getSelectionInfo = function() {
        var a = new flexiciousNmsp.SelectionInfo;
        a.isSelectAll = this.getSelectAllState() == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED;
        for (var b = this.getColumnLevel(); b;) {
            var c = new flexiciousNmsp.LevelSelectionInfo;
            c.levelNestDepth = b.getNestDepth();
            c.selectedObjects = b._selectedObjects;
            c.excludedObjects = b._unSelectedObjects;
            a.levelSelections.push(c);
            b = b.nextLevel
        }
        return a
    };
    c.prototype.getFooterRowHeight = function() {
        return this.getColumnLevel().getFooterRowHeight()
    };
    c.prototype.setFooterRowHeight = function(a) {
        this.getColumnLevel().setFooterRowHeight(a)
    };
    c.prototype.getSpinnerParent = function() {
        return this
    };
    c.prototype.getIsScrolling = function() {
        return this._isScrolling
    };
    c.prototype.getEnablePaging = function() {
        return this.getColumnLevel().enablePaging
    };
    c.prototype.setEnablePaging = function(a) {
        this.getColumnLevel().enablePaging = a
    };
    c.prototype.getSelectAllState = function() {
        return this.enableSelectionExclusion ? this._selectAllState : this.getColumnLevel().getSelectedKeysState(this.getDataProvider())
    };
    c.prototype.setSelectAllState = function(a) {
        this._useSelectedSelectAllState = a;
        this.enableSelectionExclusion ? (this.clearSelection(), this._selectAllState = a, a = new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.CHANGE, this, this.getColumnLevel(), null), this.dispatchEvent(a)) : this.getColumnLevel().setSelectedKeysState(a);
        this.invalidateSelection()
    };
    c.prototype.getSelectableField = function() {
        return this.getColumnLevel().selectableField
    };
    c.prototype.setSelectableField = function(a) {
        this.getColumnLevel().selectableField = a
    };
    c.prototype.getVirtualScrollDelay = function() {
        return this.getVirtualBodyContainer().virtualScrollDelay
    };
    c.prototype.setVirtualScrollDelay = function(a) {
        this.getVirtualBodyContainer().virtualScrollDelay = a
    };
    c.prototype.getDataProviderNoFilters = function() {
        return this.getRootFlat()
    };
    c.prototype.getTraceRows = function() {
        for (var a = "", b = this.getColumns(), c = 0; c < b.length; c++) a += b[c].width + "";
        return a
    };
    c.prototype.getColumnLevel = function() {
        this._columnLevel || this.setColumnLevel(new flexiciousNmsp.FlexDataGridColumnLevel(this));
        return this._columnLevel
    };
    c.prototype.setColumnLevel = function(a) {
        this._columnLevel && this._columnLevel != a && (a.transferProps(this._columnLevel, a, !0), a.grid = this);
        this._columnLevel = a;
        a.initializeLevel(this);
        this.enableEagerDraw && this.rebuild()
    };
    c.prototype.getDataProviderNoPaging = function() {
        return d.filterArray(this.getRootFlat(), this.getRootFilter(), this, this.getColumnLevel(), !1)
    };
    c.prototype.getSelectedField = function() {
        return this.getColumnLevel().selectedField
    };
    c.prototype.setSelectedField = function(a) {
        this.getColumnLevel().selectedField = a
    };
    c.prototype.getCurrentTooltip = function() {
        return this.tooltipBehavior.getCurrentTooltip()
    };
    c.prototype.getEnableRowNumbers = function() {
        return this.getColumnLevel().enableRowNumbers
    };
    c.prototype.setEnableRowNumbers = function(a) {
        this.getColumnLevel().enableRowNumbers = a
    };
    c.prototype.getDataProvider = function() {
        return this._dataProvider
    };
    c.prototype.setDataProvider = function(a) {
        if (!(a instanceof Array)) {
            var b = [];
            null != a && b.push(a);
            a = b
        }
        this._dataProvider != a && (this._dataProvider = a, this.rebuildGridOnDataProviderChange || !this._dataProviderSet ? this.rebuild() : this.rebuildBody(), this.clearAllCollections());
        if ("server" == this.getFilterPageSortMode()) {
            if (this._useSelectedSelectAllState == flexiciousNmsp.TriStateCheckBox.STATE_CHECKED) {
                a = this._dataProvider;
                for (b = 0; b < a.length; b++) {
                    var c = a[b];
                    this.getColumnLevel().isItemSelected(c) || this.getColumnLevel().selectRow(c, !0)
                }
            }
            this.showSpinnerOnFilterPageSort && this.hideSpinner();
            this.checkNoDataMessage();
            this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flexiciousNmsp.FlexDataGridEvent.DATA_PROVIDER_CHANGE, this));
            if (this.getHasRowSpanOrColSpan() && 0 < this.getVerticalScrollPosition() && this._dataProviderSet) {
                a = this.getVerticalScrollPosition();
                this.gotoVerticalPosition(0);
                for (this.validateNow(); this.getVerticalScrollPosition() < a;) this.gotoVerticalPosition(this.getVerticalScrollPosition() + this.getBodyContainer().getHeight()), this.validateNow()
            }
        }
        this._dataProviderSet = !0
    };
    c.prototype.getVerticalScrollBarOffset = function() {
        return this.getVerticalScrollBar() ? this.getVerticalScrollBar().width : 0
    };
    c.prototype.getPeristenceKey = function() {
        return this.getPreferencePersistenceKey()
    };
    c.prototype.clearPreferences = function() {
        this._preferencesSet = !1;
        this.getUserSettingsController().clearPreferences(this.userSettingsOptionsFunction())
    };
    c.prototype.persistPreferences = function(a, b) {
        "undefined" == typeof a && (a = "Default");
        "undefined" == typeof b && (b = !1);
        this.getUserSettingsController().persistPreferences(this.userSettingsOptionsFunction(), a, b)
    };
    c.prototype.loadPreferences = function() {
        this._preferencesLoaded = !0;
        this.getUserSettingsController().loadPreferences(this.userSettingsOptionsFunction())
    };
    c.prototype.setPreferencesFromSettings = function(a) {
        this._preferencesSet = !0;
        var c = this._triggerEvent = !1,
            d = this.userSettingsOptionsFunction();
        this.getUserSettingsController().setPreferences(d, a);
        if (null != d.grid) for (d = 0; d < a.length; d++) {
            var f = a[d];
            f.key == b.PERSIST_COLUMN_WIDTH ? this._userPersistedColumnWidths = !0 : f.key == b.PERSIST_FILTER && (c = !0)
        }
        this._triggerEvent = !0;
        c && (this._filterDirty = !0, this.doInvalidate())
    };
    c.prototype.defaultUseSettingsOptionsFunction = function() {
        return flexiciousNmsp.UserSettingsOptions.create(this)
    };
    c.prototype.getGridPreferencesInfo = function() {
        return this._gridPreferencesInfo
    };
    c.prototype.setGridPreferencesInfo = function(a, b) {
        "undefined" == typeof b && (b = !0);
        var c = (this._gridPreferencesInfo = a) ? a.savedPreferences : [];
        if (c && 0 < c.length && b) {
            for (var d = c[0], f = 0; f < c.length; f++) {
                var g = c[f];
                if (g.name == a.defaultPreferenceName) {
                    d = g;
                    break
                }
            }
            this.setPreferences(d.preferences)
        }
    };
    c.prototype.getCurrentPreferenceInfo = function() {
        return this._currentPreference
    };
    c.prototype.setCurrentPreferenceInfo = function(a, b) {
        "undefined" == typeof b && (b = !0);
        (this._currentPreference = a) && b && this.setPreferences(a.preferences);
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("gridPreferencesChanged"))
    };
    c.prototype.getAutoLoadPreferences = function() {
        return this.autoLoadPreferences
    };
    c.prototype.getPreferences = function() {
        return this.getUserSettingsController().getPreferencesString(this.userSettingsOptionsFunction())
    };
    c.prototype.setPreferences = function(a) {
        this.setPreferencesFromSettings(this.getUserSettingsController().parsePreferences(this.userSettingsOptionsFunction(), a))
    };
    c.prototype.getPreferencesLoaded = function() {
        return this._preferencesLoaded
    };
    c.prototype.getPreferencePersistenceKey = function() {
        return 0 < this._preferencePersistenceKey.length ? this._preferencePersistenceKey : this.id
    };
    c.prototype.setPreferencePersistenceKey = function(a) {
        this._preferencePersistenceKey = a
    };
    c.prototype.getLocalName = function(a) {
        return a.localName || a.baseName
    };
    c.prototype.buildFromXml = function(a) {
        this.parse(a, this)
    };
    c.prototype.parse = function(a, b) {
        a = a.replace(RegExp('"', "g"), "'");
        for (var c = d.parseXML(a).childNodes, f = 0; f < c.length; f++) {
            var g = c[f];
            if (this.getLocalName(g)) {
                for (var m = g.attributes, n = 0; n < m.length; n++) this.applyAttribute(b, m[n], g);
                g = g.childNodes;
                for (m = 0; m < g.length; m++) n = g[m], this.getLocalName(n) && ("level" == this.getLocalName(n) ? this.extractLevel(n, b.getColumnLevel()) : "filters" == this.getLocalName(n) ? this.extractFilters(n, b) : "actions" == this.getLocalName(n) ? this.extractActions(n, b) : "columns" == this.getLocalName(n) && this.extractColumns(n, b.getColumnLevel()))
            }
        }
        b.getColumnLevel().initializeLevel(b);
        b.rebuild()
    };
    c.prototype.executeFunctionByName = function(a, b) {
        for (var c = Array.prototype.slice.call(arguments, 2), d = a.split("."), f = d.pop(), g = 0; g < d.length; g++) b = b[d[g]];
        return b[f].apply(b, c)
    };
    c.prototype.applyAttribute = function(a, b, c) {
        var f = flexiciousNmsp[a.typeName].ALL_EVENTS;
        if (!f) {
            flexiciousNmsp[a.typeName].ALL_EVENTS = [];
            for (var g in flexiciousNmsp[a.typeName]) 0 == g.indexOf("EVENT_") && flexiciousNmsp[a.typeName].ALL_EVENTS.push(flexiciousNmsp[a.typeName][g]);
            f = flexiciousNmsp[a.typeName].ALL_EVENTS
        }
        b = b.name;
        c = c.attributes.getNamedItem(b).value;
        this.delegate && (c && c.length && "{" == c[0] && "}" == c[c.length - 1]) && (c = c.replace(/{/, "").replace(/}/, ""), c = c.replace(/\(/, ",").replace(/\)/, ""), c = c.split(","), c = this.executeFunctionByName(c.shift(), this.delegate, c));
        if (0 < b.indexOf("Function") || 0 < b.indexOf("Renderer") || 0 < b.indexOf("Editor") || 0 <= b.indexOf("spinnerFactory") || 0 <= b.indexOf("filterDateRangeOptions") || 0 < b.indexOf("Formatter") || 0 == b.indexOf("on") || 0 <= f.indexOf(b)) if (c = null != this.delegate && void 0 != this.delegate[c] ? this.delegate[c] : eval(c), 0 == b.indexOf("on") || 0 <= f.indexOf(b)) a.addEventListener(this, 0 == b.indexOf("on") ? b.substring(2) : b, c);
        else {
            if ("filterRenderer" == b || "footerRenderer" == b || "headerRenderer" == b || "pagerRenderer" == b || "itemRenderer" == b || "nextLevelRenderer" == b || "iconTooltipRenderer" == b || "spinnerFactory" == b || "itemEditor" == b) if (!c.implementsOrExtends || !c.implementsOrExtends("ClassFactory")) c = new flexiciousNmsp.ClassFactory(c)
        } else if ("false" == c.toLowerCase()) c = !1;
        else if ("true" == c.toLowerCase()) c = !0;
        else if (0 == c.indexOf("[")) {
            c = c.substring(1, c.length - 1).split(",");
            for (f = 0; f < c.length; f++) 0 == c[f].indexOf("0x") && (c[f] = parseInt(c[f], 16))
        } else 0 == c.indexOf("0x") ? c = parseInt(c, 16) : 0 == c.indexOf("eval__") ? c = eval(c.split("eval__")[1]) : d.isStringNumeric(c) && (c = parseFloat(c));
        this.checkSetterAndApply(a, b, c)
    };
    c.prototype.extractActionFromObject = function(a) {
        var b = a;
        if (!b) {
            var b = new flexiciousNmsp.ToolbarAction(""),
                c;
            for (c in a) d.isPrimitive(a[c]) && (b[c] = a[c])
        }
        return b
    };
    c.prototype.checkSetterAndApply = function(a, b, c) {
        d.checkSetterAndApply(a, b, c)
    };
    c.prototype.checkGetterAndRetrieve = function(a, b) {
        return d.checkGetterAndRetrieve(a, b)
    };
    c.prototype.extractActions = function(a, b) {
        for (var c = [], d = a.childNodes, f = 0; f < d.length; f++) {
            var g = d[f];
            this.getLocalName(g) && c.push(b.hasOwnProperty("toolbarAction" + flexiciousNmsp.CellUtils.doCap(g.attributes.getNamedItem("code").value)) ? this.extractAction(g, b["toolbarAction" + flexiciousNmsp.CellUtils.doCap(g.attributes.getNamedItem("code").value)]) : this.extractAction(g))
        }
        b.setToolbarActions(c)
    };
    c.prototype.extractAction = function(a, b) {
        b || (b = new flexiciousNmsp.ToolbarAction(a.attributes.getNamedItem("code").value));
        for (var c = a.attributes, d = 0; d < c.length; d++) this.applyAttribute(b, c[d], a);
        return b
    };
    c.prototype.extractFilters = function(a, b) {
        for (var c = [], f = a.childNodes, g = 0; g < f.length; g++) {
            var m = f[g];
            if (this.getLocalName(m)) if ("date" == m.attributes.getNamedItem("type").value) c.push(d.createDateFilter(m.attributes.getNamedItem("description").value, m.attributes.getNamedItem("fld").value, m.attributes.getNamedItem("dateRange").value, m.attributes.getNamedItem("dateRange").value == flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM ? new Date(m.attributes.getNamedItem("start").value) : null, m.attributes.getNamedItem("dateRange").value == flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM ? new Date(m.attributes.getNamedItem("end").value) : null));
            else if ("list" == m.attributes.getNamedItem("type").value) c.push(d.createListFilter(m.attributes.getNamedItem("description").value, m.attributes.getNamedItem("fld").value, m.attributes.getNamedItem("values").value.split(",")));
            else {
                var n = new flexiciousNmsp.Filter;
                n.filterDescrption = m.attributes.getNamedItem("description");
                c.push(n)
            }
        }
        b.setPredefinedFilters(c)
    };
    c.prototype.extractColumns = function(a, b) {
        for (var c = [], d = !1, f = 0; f < a.childNodes.length; f++) {
            var g = a.childNodes[f];
            this.getLocalName(g) && ("columnGroup" == this.getLocalName(g) ? (d = !0, c.push(this.extractColGroup(g))) : c.push(this.extractCol(g)))
        }
        d ? b.setGroupedColumns(c) : b.setColumns(c);
        return {
            cols: c,
            hasColumnGroups: d,
            j: f,
            colNode: g
        }
    };
    c.prototype.extractLevel = function(a, b) {
        for (var c = a.attributes, d = 0; d < c.length; d++) this.applyAttribute(b, c[d], a);
        c = a.childNodes;
        for (d = 0; d < c.length; d++) {
            var f = c[d];
            if (this.getLocalName(f)) if ("nextLevel" == this.getLocalName(f)) {
                b.nextLevel = new flexiciousNmsp.FlexDataGridColumnLevel(b.grid);
                for (var g, n = f.childNodes, p = 0; p < n.length; p++) {
                    var q = n[p];
                    g = p;
                    if (this.getLocalName(q)) break
                }
                this.extractLevel(f.childNodes[g], b.nextLevel)
            } else "columns" == this.getLocalName(f) && this.extractColumns(f, b)
        }
    };
    c.prototype.extractColGroup = function(a) {
        for (var b = new flexiciousNmsp.FlexDataGridColumnGroup, c = a.attributes, d = 0; d < c.length; d++) this.applyAttribute(b, c[d], a);
        for (var c = [], d = !1, f = 0, g = a.childNodes, n = 0; n < g.length; n++) {
            var p = g[n],
                f = n;
            if (this.getLocalName(p)) break
        }
        a = a.childNodes[f].childNodes;
        for (f = 0; f < a.length; f++) p = a[f], this.getLocalName(p) && ("columnGroup" == this.getLocalName(p) ? (d = !0, c.push(this.extractColGroup(p))) : c.push(this.extractCol(p)));
        d ? b.columnGroups = c : b.setColumns(c);
        return b
    };
    c.prototype.extractCol = function(a) {
        var b = new flexiciousNmsp.FlexDataGridColumn;
        a.attributes.getNamedItem("type") && "checkbox" == a.attributes.getNamedItem("type").value && (b = new flexiciousNmsp.FlexDataGridCheckBoxColumn);
        for (var c = a.attributes, d = 0; d < c.length; d++) {
            var f = c[d];
            "type" != this.getLocalName(f) && this.applyAttribute(b, f, a)
        }
        return b
    };
    c.prototype.setTotalRecords = function(a) {
        this._totalRecords = a;
        if (this.getEnablePaging()) {
            var b = this.getPagerContainer().getPager();
            b && b.getTotalRecords() != a && b.setTotalRecords(a)
        }
    };
    c.prototype.getTotalRecords = function() {
        return this._totalRecords
    };
    c.prototype.getRowHeight = function() {
        return this.getColumnLevel().getRowHeight()
    };
    c.prototype.setRowHeight = function(a) {
        this.getColumnLevel().setRowHeight(a)
    };
    c.prototype.getprintExportData = function() {
        return this._printExportData
    };
    c.prototype.setPrintExportData = function(a) {
        this._printExportData = a;
        this.dispatchEvent(new flexiciousNmsp.BaseEvent("printExportDataReceived"))
    };
    c.prototype.getRowSpanFunction = function() {
        return this.rowSpanFunction
    };
    c.prototype.setRowSpanFunction = function(a) {
        this.rowSpanFunction = a;
        this._hasRowSpanOrColSpan = null != a
    };
    c.prototype.getColSpanFunction = function() {
        return this._colSpanFunction
    };
    c.prototype.setColSpanFunction = function(a) {
        this._colSpanFunction = a;
        this._hasRowSpanOrColSpan = null != a
    };
    c.prototype.kill = function() {
        delete flexiciousNmsp.registry[this.__id];
        this.getBodyContainer().kill();
        this.getHeaderContainer().kill();
        this.getFooterContainer().kill();
        this.getPagerContainer().kill();
        this.getFilterContainer().kill();
        this.getLeftLockedHeader().kill();
        this.getLeftLockedFooter().kill();
        this.getLeftLockedContent().kill();
        this.getRightLockedHeader().kill();
        this.getRightLockedFooter().kill();
        this.getRightLockedContent().kill();
        this.rendererCache.kill();
        this.getColumnLevel().kill();
        this.resizeTimer && this.resizeTimer.kill();
        this.tooltipBehavior.kill();
        this.spinnerBehavior.kill();
        flexiciousNmsp.UIComponent.prototype.kill.apply(this)
    };
    c.prototype.checkResize = function() {
        this.domElement || this.resizeTimer.kill();
        0 > this.domElement.style.width.indexOf("%") && 0 > this.domElement.style.height.indexOf("%") && this.resizeTimer.kill();
        this.placedHeight && this.placedWidth && (0 < this.domElement.style.width.indexOf("%") && this.domElement.offsetWidth != this.placedWidth && 0 < this.domElement.offsetWidth && this.invalidateWidth(), 0 < this.domElement.style.height.indexOf("%") && this.domElement.offsetHeight != this.placedHeight && 0 < this.domElement.offsetHeight && this.invalidateHeight())
    };
    c.prototype.applyTheme = function(a) {
        this.themeID = a;
        for (var b = 0; b < flexiciousNmsp.themes.length; b++) {
            var c = flexiciousNmsp.themes[b];
            if (c.id == a) {
                d.mergeObjects(this, c);
                this.rebuild();
                break
            }
        }
    };
    c.prototype.getThemeToolbarIconFolder = function() {
        return this.toolbarImagesRoot
    };
    c.prototype.getWidth = function() {
        return this.width || this.domElement.offsetWidth
    };
    c.prototype.setWidth = function(a) {
        flexiciousNmsp.NdgBase.prototype.setWidth.apply(this, [a]);
        if (0 < a.toString().indexOf("%")) this.domElement.style.width = a, this.width = 0;
        else {
            if (0 > a || isNaN(a)) return a;
            this.width = a;
            this.domElement.style.width = a + "px"
        }
        return a
    };
    c.prototype.getHeight = function() {
        return this.height || this.domElement.offsetHeight
    };
    c.prototype.setHeight = function(a) {
        flexiciousNmsp.NdgBase.prototype.setHeight.apply(this, [a]);
        if (0 < a.toString().indexOf("%")) this.domElement.style.height = a, this.height = 0;
        else {
            if (0 > a || isNaN(a)) return a;
            this.height = a;
            this.domElement.style.height = a + "px"
        }
        return a
    }
})(window);
(function() {
    var a, c = flexiciousNmsp.UIUtils;
    a = function() {};
    flexiciousNmsp.CellUtils = a;
    a.prototype = new flexiciousNmsp.TypedObject;
    a.prototype.typeName = a.typeName = "CellUtils";
    a.prototype.getClassNames = function() {
        return ["CellUtils", "TypedObject"]
    };
    a.drawBackground = function(d) {
        if (d.backgroundDirty) {
            d.backgroundDirty = !1;
            var b, g = d.getColumn(),
                f = d.level;
            g && null != g.cellCustomDrawFunction && (b = g.cellCustomDrawFunction(d));
            null != f.cellCustomBackgroundDrawFunction && (b = f.cellCustomBackgroundDrawFunction(d));
            !1 != b && (d.hasVerticalGridLines() && d.getVerticalGridLineThickness(), d.hasHorizontalGridLines() && d.getHorizontalGridLineThickness(), b = d.getBackgroundColors(), b instanceof Array ? (d.domElement.style.backgroundColor = "", c.gradientFill(d, b)) : (c.gradientFill(d, null), d.domElement.style.backgroundColor = c.decimalToColor(b)), b = d.getTextColors(), 0 == b ? d.domElement.style.color = "#000000" : null != b && (d.domElement.style.color = c.decimalToColor(b)));
            a.drawBorders(d)
        }
    };
    a.getRolloverColor = function(a, b) {
        return a.rowInfo && a.rowInfo.getIsFillRow() ? a.getStyleValue("color") : a.getColumn() ? a.getColumn().getStyleValue(b) : a.getStyleValue(b)
    };
    a.getTextColors = function(a) {
        var b = a.rowInfo,
            c = a.level,
            f = a.getColumn();
        if (b && b.getIsFillRow()) return a.getStyleValue("color");
        if (a.currentTextColors) return a.currentTextColors;
        var e;
        if (!a.getEnabled() && (e = a.getStyleValue("textDisabledColor"), null != e) || f && null != f.cellTextColorFunction && (e = f.cellTextColorFunction(a), null != e) || null != c.rowTextColorFunction && (e = c.rowTextColorFunction(a), null != e) || c.grid.getBodyContainer().getCurrentEditCell() && c.grid.getBodyContainer().getCurrentEditCell().rowInfo == a.rowInfo && (e = a.getStyleValue("editTextColor"))) return e;
        e = 0 == b.rowPositionInfo.getRowIndex() % 2;
        if (a.getStyleValue("alternatingTextColors")[e ? 0 : 1] != a.getStyleValue("textSelectedColor")) if (c.isItemSelected(b.getData()) || f && c.isCellSelected(b.getData(), f)) return a.getStyleValue("textSelectedColor");
        return f && f.getStyle("columnTextColor") ? a.getStyleValue("columnTextColor") : a.getStyleValue("alternatingTextColors")[e ? 0 : 1]
    };
    a.getBackgroundColorFromGrid = function(a) {
        return null != a.level.grid.cellBackgroundColorFunction ? a.level.grid.cellBackgroundColorFunction(a) : null
    };
    a.getTextColorFromGrid = function(a) {
        return null != a.level.grid.cellTextColorFunction ? a.level.grid.cellTextColorFunction(a) : null
    };
    a.getBackgroundColors = function(a) {
        var b = a.rowInfo,
            c = a.level,
            f = a.getColumn(),
            e = 0 == b.rowPositionInfo.getRowIndex() % 2;
        if (b && b.getIsFillRow()) return c.grid.enableFillerRows ? a.getStyleValue("alternatingItemColors")[e ? 0 : 1] : c.grid.getStyle("backgroundColor");
        var h;
        return !a.getEnabled() && (h = a.getStyleValue("selectionDisabledColor"), "null" != h && null != h) || f && null != f.cellBackgroundColorFunction && (h = f.cellBackgroundColorFunction(a), null != h) || null != c.rowBackgroundColorFunction && (h = c.rowBackgroundColorFunction(a), null != h) ? h : c.grid.hasErrors && c.grid.getError(b.getData()) ? a.getStyleValue("errorBackgroundColor") : c.grid.enableEditRowHighlight && (c.grid.getBodyContainer().getCurrentEditCell() && c.grid.getBodyContainer().getCurrentEditCell().rowInfo == a.rowInfo) && (h = a.getStyleValue("editItemColors")) ? h : a.currentBackgroundColors ? a.currentBackgroundColors : c.grid.hasErrors && c.grid.getError(b.getData()) ? a.getStyleValue("errorBackgroundColor") : c.isItemSelected(b.getData()) && c.grid.getIsRowSelectionMode() || f && c.isCellSelected(b.getData(), f) ? a.getStyleValue("selectionColor") : f && f.isValidStyleValue(f.getStyle("backgroundColor")) ? f.getStyle("backgroundColor") : a.getStyleValue("alternatingItemColors")[e ? 0 : 1]
    };
    a.drawBorders = function(a) {
        var b = a.rowInfo,
            g = a.level,
            f = a.getColumn();
        a.hasHorizontalGridLines();
        a && a.getErrorString() && a.setErrorString("");
        if (g.grid.hasErrors && f && (b = g.grid.getError(b.getData())) && b[f.getDataField()]) {
            a.setErrorString(b[f.getDataField()]);
            return
        }
        if (f && null != f.cellBorderFunction && (f = f.cellBorderFunction(a), !1 == f) || null != g.cellBorderFunction && (f = g.cellBorderFunction(a), !1 == f)) return;
        a.hasHorizontalGridLines() && (a.domElement.style.borderBottom = "solid " + a.getHorizontalGridLineThickness() + "px " + c.decimalToColor(a.getHorizontalGridLineColor()));
        a.getDrawTopBorder() && (a.domElement.style.borderTop = "solid " + a.getHorizontalGridLineThickness() + "px " + c.decimalToColor(a.getHorizontalGridLineColor()));
        a.drawRightBorder(a.width, a.height)
    };
    a.getStyleValue = function(a, b) {
        return a.getColumn() ? a.getColumn().getStyleValue(b) : a.level.getStyleValue(b)
    };
    a.drawRightBorder = function(a) {
        if (a.implementsOrExtends("FlexDataGridPagerCell")) a.domElement.style.borderRight = "";
        else if (a.implementsOrExtends("FlexDataGridPaddingCell") && a.level.getNestDepth() != a.level.grid.getMaxDepth()) a.domElement.style.borderRight = "";
        else if (a.getColumn() && a.getColumn().getIsLastleftLocked()) a.domElement.style.borderRight = "";
        else {
            if (a.scrollBarPad || a.getColumn()) if (a.scrollBarPad || a.getColumn().getIsLastUnLocked() || a.getColumn().getIsLastrightLocked()) {
                a.scrollBarPad && (a.domElement.style.borderLeft = "solid " + a.getVerticalGridLineThickness() + "px " + c.decimalToColor(a.getVerticalGridLineColor()));
                a.domElement.style.borderRight = "";
                return
            }
            a.hasVerticalGridLines() && a.getVerticalGridLineThickness();
            a.hasHorizontalGridLines() && a.getHorizontalGridLineThickness();
            var b = a.implementsOrExtends("FlexDataGridColumnGroupCell") ? a : null,
                g = a.implementsOrExtends("FlexDataGridPaddingCell") ? a : null;
            if ((!b || !b.background) && a.hasVerticalGridLines()) {
                if (g) g.scrollBarPad && (a.domElement.style.borderLeft = "solid " + a.getVerticalGridLineThickness() + "px " + c.decimalToColor(a.getVerticalGridLineColor()));
                else if (b && (b.columnGroup.getEndColumn().getIsLastUnLocked() || b.columnGroup.getEndColumn().getIsLastrightLocked())) return;
                a.domElement.style.borderRight = "solid " + a.getVerticalGridLineThickness() + "px " + c.decimalToColor(a.getVerticalGridLineColor())
            }
        }
    };
    a.refreshCell = function(a) {
        a.backgroundDirty = !0;
        var b = a.rowInfo;
        if (!b.getIsFillRow()) {
            var c = a.level,
                f = a.getColumn();
            b && a.setAutomationName(c.grid.getAutomationName() + "_cell_" + b.rowPositionInfo.getRowIndex() + "_" + (f ? f.getUniqueIdentifier() : b.cells.indexOf(a)) + "_" + b.rowPositionInfo.getRowType());
            var e = !0;
            f && (a.setText(f.itemToLabel(b.getData(), a)), null != f.cellDisabledFunction && (e = !f.cellDisabledFunction(a)));
            null != c.rowDisabledFunction && (e = !c.rowDisabledFunction(a, b.getData()));
            c = a.getRenderer();
            c.setData(b.getData());
            c.setEnabled(e);
            a.getEnabled() != e && a.setEnabled(e)
        }
    };
    a.setRendererSize = function(a, b, c) {
        var f = a.parent,
            e = f && f.implementsOrExtends("IFlexDataGridCell") && f.hasVerticalGridLines() ? f.getVerticalGridLineThickness() : 0,
            f = f && f.implementsOrExtends("IFlexDataGridCell") && f.hasHorizontalGridLines() ? f.getHorizontalGridLineThickness() : 0;
        a.setActualSize(b - e, c - f)
    };
    a.capitalizeFirstLetterIfPrefix = function(c, b) {
        return 0 < (c && c.length) ? a.doCap(b) : b
    };
    a.doCap = function(a) {
        return a.substr(0, 1).toUpperCase() + a.substr(1)
    };
    a.initializeCheckBoxRenderer = function(a, b) {
        var c = a.getRenderer().implementsOrExtends("TriStateCheckBox") ? a.getRenderer() : null,
            f = a.getColumn() && a.getColumn().implementsOrExtends("FlexDataGridCheckBoxColumn") ? a.getColumn() : null;
        c && f && (c.enableDelayChange = !1, c.radioButtonMode = f.radioButtonMode || b.enableSingleSelect, b.grid.enableSelectionExclusion ? c.setSelectedState(b.getCheckBoxStateBasedOnExclusion(a.rowInfo.getData())) : b.grid.enableTriStateCheckbox ? b.isItemSelected(a.rowInfo.getData()) ? c.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED) : b.nextLevel && b.nextLevel.areAnySelected(b.getChildren(a.rowInfo.getData()), !0) ? b.nextLevel && b.nextLevel.enableSingleSelect ? c.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_CHECKED) : c.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_MIDDLE) : c.setSelectedState(flexiciousNmsp.TriStateCheckBox.STATE_UNCHECKED) : c.setSelected(b.isItemSelected(a.rowInfo.getData())), f.enableLabelAndCheckBox && a.implementsOrExtends("IFlexDataGridDataCell") && (c.label = f.itemToLabel(a.rowInfo.getData(), a)))
    };
    a.getBackGroundColorString = function(a) {
        a = a.getBackgroundColors();
        return a instanceof Array ? a.join(",") : c.getColorName(a).toString()
    }
})(window);
flexiciousNmsp.xml2json = function(a, c, d) {
    c || (c = "\t");
    var b = {
        toObj: function(a) {
            var c = {};
            if (1 == a.nodeType) {
                if (a.attributes.length) for (var d = 0; d < a.attributes.length; d++) c["@" + a.attributes[d].nodeName] = (a.attributes[d].nodeValue || "").toString();
                if (a.firstChild) {
                    for (var g = d = 0, k = !1, l = a.firstChild; l; l = l.nextSibling) 1 == l.nodeType ? k = !0 : 3 == l.nodeType && l.nodeValue.match(/[^ \f\n\r\t\v]/) ? d++ : 4 == l.nodeType && g++;
                    if (k) if (2 > d && 2 > g) {
                        b.removeWhite(a);
                        for (l = a.firstChild; l; l = l.nextSibling) 3 == l.nodeType ? c["#text"] = b.escape(l.nodeValue) : 4 == l.nodeType ? c["#cdata"] = b.escape(l.nodeValue) : c[l.nodeName] ? c[l.nodeName] instanceof Array ? c[l.nodeName][c[l.nodeName].length] = b.toObj(l) : c[l.nodeName] = [c[l.nodeName], b.toObj(l)] : c[l.nodeName] = b.toObj(l)
                    } else a.attributes.length ? c["#text"] = b.escape(b.innerXml(a)) : c = b.escape(b.innerXml(a));
                    else if (d) a.attributes.length ? c["#text"] = b.escape(b.innerXml(a)) : c = b.escape(b.innerXml(a));
                    else if (g) if (1 < g) c = b.escape(b.innerXml(a));
                    else for (l = a.firstChild; l; l = l.nextSibling) c["#cdata"] = b.escape(l.nodeValue)
                }!a.attributes.length && !a.firstChild && (c = null)
            } else 9 == a.nodeType ? c = b.toObj(a.documentElement) : alert("unhandled node type: " + a.nodeType);
            return c
        },
        toJson: function(a, c, d) {
            var g = c ? '"' + c + '"' : "";
            if (a instanceof Array) {
                for (var k = 0, l = a.length; k < l; k++) a[k] = b.toJson(a[k], "", d + "\t");
                g += (c ? ":[" : "[") + (1 < a.length ? "\n" + d + "\t" + a.join(",\n" + d + "\t") + "\n" + d : a.join("")) + "]"
            } else if (null == a) g += (c && ":") + "null";
            else if ("object" == typeof a) {
                k = [];
                for (l in a) k[k.length] = b.toJson(a[l], l, d + "\t");
                g += (c ? ":{" : "{") + (1 < k.length ? "\n" + d + "\t" + k.join(",\n" + d + "\t") + "\n" + d : k.join("")) + "}"
            } else g = "string" == typeof a ? g + ((c && ":") + '"' + a.toString() + '"') : g + ((c && ":") + a.toString());
            return g
        },
        innerXml: function(a) {
            var b = "";
            if ("innerHTML" in a) b = a.innerHTML;
            else {
                var c = function(a) {
                        var b = "";
                        if (1 == a.nodeType) {
                            for (var b = b + ("<" + a.nodeName), d = 0; d < a.attributes.length; d++) b += " " + a.attributes[d].nodeName + '="' + (a.attributes[d].nodeValue || "").toString() + '"';
                            if (a.firstChild) {
                                b += ">";
                                for (d = a.firstChild; d; d = d.nextSibling) b += c(d);
                                b += "</" + a.nodeName + ">"
                            } else b += "/>"
                        } else 3 == a.nodeType ? b += a.nodeValue : 4 == a.nodeType && (b += "<![CDATA[" + a.nodeValue + "]]\x3e");
                        return b
                    };
                for (a = a.firstChild; a; a = a.nextSibling) b += c(a)
            }
            return b
        },
        escape: function(a) {
            return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
        },
        removeWhite: function(a) {
            a.normalize && a.normalize();
            for (var c = a.firstChild; c;) if (3 == c.nodeType) if (c.nodeValue.match(/[^ \f\n\r\t\v]/)) c = c.nextSibling;
            else {
                var d = c.nextSibling;
                a.removeChild(c);
                c = d
            } else 1 == c.nodeType && b.removeWhite(c), c = c.nextSibling;
            return a
        },
        cleanResult: function(a) {
            for (var c in a) if (a[c] instanceof Array) {
                a.children = a[c];
                for (var d = 0; d < a[c].length; d++)"children" != c && "parent" != c && b.cleanResult(a[c][d]), a[c][d].parent = a
            } else flexiciousNmsp.UIUtils.isPrimitive(a[c]) || (a.children = [a[c]], "children" != c && "parent" != c && b.cleanResult(a[c]), a[c].parent = a)
        },
        parseXML: function(a) {
            var b = null;
            if (window.DOMParser) try {
                b = (new DOMParser).parseFromString(a, "text/xml")
            } catch (c) {
                b = null
            } else if (window.ActiveXObject) try {
                b = new ActiveXObject("Microsoft.XMLDOM"), b.async = !1, b.loadXML(a) || window.alert(b.parseError.reason + b.parseError.srcText)
            } catch (d) {
                b = null
            } else alert("cannot parse xml string!");
            return b
        }
    };
    9 == a.nodeType && (a = a.documentElement);
    a = b.parseXML(a);
    var g = b.toObj(b.removeWhite(a));
    if (d) return b.cleanResult(g), g;
    a = b.toJson(g, a.nodeName, "\t");
    c = flexiciousNmsp.UIUtils.adapter.stringToJson("{\n" + (c ? c : "") + (c ? a.replace(/\t/g, c) : a.replace(/\t|\n/g, "")) + "\n}");
    c = c["#document"];
    b.cleanResult(c);
    return c
};
!
function(a, c, d) {
    function b(a, b) {
        var d = c.createElement(a || "div"),
            e;
        for (e in b) d[e] = b[e];
        return d
    }
    function g(a) {
        for (var b = 1, c = arguments.length; b < c; b++) a.appendChild(arguments[b]);
        return a
    }
    function f(a, b) {
        var c = a.style,
            e, f;
        if (c[b] !== d) return b;
        b = b.charAt(0).toUpperCase() + b.slice(1);
        for (f = 0; f < k.length; f++) if (e = k[f] + b, c[e] !== d) return e
    }
    function e(a, b) {
        for (var c in b) a.style[f(a, c) || c] = b[c];
        return a
    }
    function h(a) {
        for (var b = 1; b < arguments.length; b++) {
            var c = arguments[b],
                e;
            for (e in c) a[e] === d && (a[e] = c[e])
        }
        return a
    }

    function j(a) {
        for (var b = {
            x: a.offsetLeft,
            y: a.offsetTop
        }; a = a.offsetParent;) b.x += a.offsetLeft, b.y += a.offsetTop;
        return b
    }
    var k = ["webkit", "Moz", "ms", "O"],
        l = {},
        m, n;
    a = b("style", {
        type: "text/css"
    });
    g(c.getElementsByTagName("head")[0], a);
    n = a.sheet || a.styleSheet;
    var p = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        speed: 1,
        trail: 100,
        opacity: 0.25,
        fps: 20,
        zIndex: 2E9,
        className: "spinner",
        top: "auto",
        left: "auto",
        position: "relative"
    };
    a = function w(a) {
        if (!this.spin) return new w(a);
        this.opts = h(a || {}, w.defaults, p)
    };
    a.defaults = {};
    h(a.prototype, {
        spin: function(a) {
            this.stop();
            var c = this,
                d = c.opts,
                f = c.el = e(b(0, {
                    className: d.className
                }), {
                    position: d.position,
                    width: 0,
                    zIndex: d.zIndex
                }),
                g = d.radius + d.length + d.width,
                h, k;
            a && (a.insertBefore(f, a.firstChild || null), k = j(a), h = j(f), e(f, {
                left: ("auto" == d.left ? k.x - h.x + (a.offsetWidth >> 1) : parseInt(d.left, 10) + g) + "px",
                top: ("auto" == d.top ? k.y - h.y + (a.offsetHeight >> 1) : parseInt(d.top, 10) + g) + "px"
            }));
            f.setAttribute("aria-role", "progressbar");
            c.lines(f, c.opts);
            if (!m) {
                var l = 0,
                    n = d.fps,
                    p = n / d.speed,
                    q = (1 - d.opacity) / (p * d.trail / 100),
                    s = p / d.lines;
                (function C() {
                    l++;
                    for (var a = d.lines; a; a--) {
                        var b = Math.max(1 - (l + a * s) % p * q, d.opacity);
                        c.opacity(f, d.lines - a, b, d)
                    }
                    c.timeout = c.el && setTimeout(C, ~~ (1E3 / n))
                })()
            }
            return c
        },
        stop: function() {
            var a = this.el;
            a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), this.el = d);
            return this
        },
        lines: function(a, c) {
            function d(a, g) {
                return e(b(), {
                    position: "absolute",
                    width: c.length + c.width + "px",
                    height: c.width + "px",
                    background: a,
                    boxShadow: g,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~ (360 / c.lines * f + c.rotate) + "deg) translate(" + c.radius + "px,0)",
                    borderRadius: (c.corners * c.width >> 1) + "px"
                })
            }
            for (var f = 0, h; f < c.lines; f++) {
                h = b();
                var j = 1 + ~ (c.width / 2) + "px",
                    k = c.hwaccel ? "translate3d(0,0,0)" : "",
                    p = c.opacity,
                    q;
                if (q = m) {
                    q = c.opacity;
                    var s = c.trail,
                        A = f,
                        B = c.lines,
                        x = ["opacity", s, ~~ (100 * q), A, B].join("-"),
                        A = 0.01 + 100 * (A / B),
                        B = Math.max(1 - (1 - q) / s * (100 - A), q),
                        C = m.substring(0, m.indexOf("Animation")).toLowerCase(),
                        C = C && "-" + C + "-" || "";
                    l[x] || (n.insertRule("@" + C + "keyframes " + x + "{0%{opacity:" + B + "}" + A + "%{opacity:" + q + "}" + (A + 0.01) + "%{opacity:1}" + (A + s) % 100 + "%{opacity:" + q + "}100%{opacity:" + B + "}}", n.cssRules.length), l[x] = 1);
                    q = x + " " + 1 / c.speed + "s linear infinite"
                }
                h = e(h, {
                    position: "absolute",
                    top: j,
                    transform: k,
                    opacity: p,
                    animation: q
                });
                c.shadow && g(h, e(d("#000", "0 0 4px #000"), {
                    top: "2px"
                }));
                g(a, g(h, d(c.color, "0 0 1px rgba(0,0,0,.1)")))
            }
            return a
        },
        opacity: function(a, b, c) {
            b < a.childNodes.length && (a.childNodes[b].style.opacity = c)
        }
    });
    var q = function(a, c) {
            return b("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c)
        },
        s = e(b("group"), {
            behavior: "url(#default#VML)"
        });
    !f(s, "transform") && s.adj ? (n.addRule(".spin-vml", "behavior:url(#default#VML)"), a.prototype.lines = function(a, b) {
        function c() {
            return e(q("group", {
                coordsize: h + " " + h,
                coordorigin: -f + " " + -f
            }), {
                width: h,
                height: h
            })
        }
        function d(a, h, j) {
            g(k, g(e(c(), {
                rotation: 360 / b.lines * a + "deg",
                left: ~~h
            }), g(e(q("roundrect", {
                arcsize: b.corners
            }), {
                width: f,
                height: b.width,
                left: b.radius,
                top: -b.width >> 1,
                filter: j
            }), q("fill", {
                color: b.color,
                opacity: b.opacity
            }), q("stroke", {
                opacity: 0
            }))))
        }
        var f = b.length + b.width,
            h = 2 * f,
            j = 2 * -(b.width + b.length) + "px",
            k = e(c(), {
                position: "absolute",
                top: j,
                left: j
            });
        if (b.shadow) for (j = 1; j <= b.lines; j++) d(j, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
        for (j = 1; j <= b.lines; j++) d(j);
        return g(a, k)
    }, a.prototype.opacity = function(a, b, c, d) {
        a = a.firstChild;
        d = d.shadow && d.lines || 0;
        if (a && b + d < a.childNodes.length && (a = (a = (a = a.childNodes[b + d]) && a.firstChild) && a.firstChild)) a.opacity = c
    }) : m = f(s, "animation");
    flexiciousNmsp.Spinner = a
}(window, document);
(function() {
    Downloadify = window.Downloadify = {
        queue: {},
        uid: (new Date).getTime(),
        getTextForSave: function(a) {
            return (a = Downloadify.queue[a]) ? a.getData() : ""
        },
        getFileNameForSave: function(a) {
            return (a = Downloadify.queue[a]) ? a.getFilename() : ""
        },
        saveComplete: function(a) {
            (a = Downloadify.queue[a]) && a.complete();
            return !0
        },
        saveCancel: function(a) {
            (a = Downloadify.queue[a]) && a.cancel();
            return !0
        },
        saveError: function(a) {
            (a = Downloadify.queue[a]) && a.error();
            return !0
        },
        addToQueue: function(a) {
            Downloadify.queue[a.queue_name] = a
        },
        getUID: function(a) {
            "" == a.id && (a.id = "downloadify_" + Downloadify.uid++);
            return a.id
        }
    };
    Downloadify.create = function(a, c) {
        a = "string" == typeof a ? document.getElementById(a) : a;
        return new Downloadify.Container(a, c)
    };
    Downloadify.Container = function(a, c) {
        var d = this;
        d.el = a;
        d.enabled = !0;
        d.dataCallback = null;
        d.filenameCallback = null;
        d.data = null;
        d.filename = null;
        d.enable = function() {
            document.getElementById(d.flashContainer.id).setEnabled(!0);
            d.enabled = !0
        };
        d.disable = function() {
            document.getElementById(d.flashContainer.id).setEnabled(!1);
            d.enabled = !1
        };
        d.getData = function() {
            return !d.enabled ? "" : d.dataCallback ? d.dataCallback() : d.data ? d.data : ""
        };
        d.getFilename = function() {
            return d.filenameCallback ? d.filenameCallback() : d.filename ? d.filename : ""
        };
        d.complete = function() {
            "function" === typeof d.options.onComplete && d.options.onComplete()
        };
        d.cancel = function() {
            "function" === typeof d.options.onCancel && d.options.onCancel()
        };
        d.error = function() {
            "function" === typeof d.options.onError && d.options.onError()
        };
        d.options = c;
        d.options.append || (d.el.innerHTML = "");
        d.flashContainer = document.createElement("span");
        d.el.appendChild(d.flashContainer);
        d.queue_name = Downloadify.getUID(d.flashContainer);
        "function" === typeof d.options.filename ? d.filenameCallback = d.options.filename : d.options.filename && (d.filename = d.options.filename);
        "function" === typeof d.options.data ? d.dataCallback = d.options.data : d.options.data && (d.data = d.options.data);
        var b = {
            queue_name: d.queue_name,
            width: d.options.width,
            height: d.options.height
        },
            g = {
                allowScriptAccess: "always"
            },
            f = {
                id: d.flashContainer.id,
                name: d.flashContainer.id
            };
        !1 === d.options.enabled && (d.enabled = !1);
        !0 === d.options.transparent && (g.wmode = "transparent");
        d.options.downloadImage && (b.downloadImage = d.options.downloadImage);
        swfobject.embedSWF(d.options.swf, d.flashContainer.id, d.options.width, d.options.height, "10", null, b, g, f);
        Downloadify.addToQueue(d)
    };
    Downloadify.defaultOptions = {
        swf: "media/downloadify.swf",
        downloadImage: "images/download.png",
        width: 100,
        height: 30,
        transparent: !0,
        append: !1
    }
})();
"undefined" != typeof jQuery &&
function(a) {
    a.fn.downloadify = function(c) {
        return this.each(function() {
            c = a.extend({}, Downloadify.defaultOptions, c);
            var d = Downloadify.create(this, c);
            a(this).data("Downloadify", d)
        })
    }
}(jQuery);
var swfobject = function() {
        function a() {
            if (!I) {
                try {
                    var a = u.getElementsByTagName("body")[0].appendChild(u.createElement("span"));
                    a.parentNode.removeChild(a)
                } catch (b) {
                    return
                }
                I = !0;
                for (var a = L.length, c = 0; c < a; c++) L[c]()
            }
        }
        function c(a) {
            I ? a() : L[L.length] = a
        }
        function d(a) {
            if (typeof z.addEventListener != r) z.addEventListener("load", a, !1);
            else if (typeof u.addEventListener != r) u.addEventListener("load", a, !1);
            else if (typeof z.attachEvent != r) {
                var b = z;
                b.attachEvent("onload", a);
                A[A.length] = [b, "onload", a]
            } else if ("function" == typeof z.onload) {
                var c = z.onload;
                z.onload = function() {
                    c();
                    a()
                }
            } else z.onload = a
        }
        function b() {
            var a = G.length;
            if (0 < a) for (var b = 0; b < a; b++) {
                var c = G[b].id,
                    d = G[b].callbackFn,
                    j = {
                        success: !1,
                        id: c
                    };
                if (0 < t.pv[0]) {
                    var k = m(c);
                    if (k) if (n(G[b].swfVersion) && !(t.wk && 312 > t.wk)) q(c, !0), d && (j.success = !0, j.ref = g(c), d(j));
                    else if (G[b].expressInstall && f()) {
                        j = {};
                        j.data = G[b].expressInstall;
                        j.width = k.getAttribute("width") || "0";
                        j.height = k.getAttribute("height") || "0";
                        k.getAttribute("class") && (j.styleclass = k.getAttribute("class"));
                        k.getAttribute("align") && (j.align = k.getAttribute("align"));
                        for (var l = {}, k = k.getElementsByTagName("param"), p = k.length, s = 0; s < p; s++)"movie" != k[s].getAttribute("name").toLowerCase() && (l[k[s].getAttribute("name")] = k[s].getAttribute("value"));
                        e(j, l, c, d)
                    } else h(k), d && d(j)
                } else if (q(c, !0), d) {
                    if ((c = g(c)) && typeof c.SetVariable != r) j.success = !0, j.ref = c;
                    d(j)
                }
            }
        }
        function g(a) {
            var b = null;
            if ((a = m(a)) && "OBJECT" == a.nodeName) typeof a.SetVariable != r ? b = a : (a = a.getElementsByTagName(w)[0]) && (b = a);
            return b
        }
        function f() {
            return !K && n("6.0.65") && (t.win || t.mac) && !(t.wk && 312 > t.wk)
        }
        function e(a, b, c, d) {
            K = !0;
            C = d || null;
            O = {
                success: !1,
                id: c
            };
            var e = m(c);
            if (e) {
                "OBJECT" == e.nodeName ? (B = j(e), x = null) : (B = e, x = c);
                a.id = E;
                if (typeof a.width == r || !/%$/.test(a.width) && 310 > parseInt(a.width, 10)) a.width = "310";
                if (typeof a.height == r || !/%$/.test(a.height) && 137 > parseInt(a.height, 10)) a.height = "137";
                u.title = u.title.slice(0, 47) + " - Flash Player Installation";
                d = t.ie && t.win ? "ActiveX" : "PlugIn";
                d = "MMredirectURL=" + encodeURI(z.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + d + "&MMdoctitle=" + u.title;
                b.flashvars = typeof b.flashvars != r ? b.flashvars + ("&" + d) : d;
                t.ie && (t.win && 4 != e.readyState) && (d = u.createElement("div"), c += "SWFObjectNew", d.setAttribute("id", c), e.parentNode.insertBefore(d, e), e.style.display = "none", function() {
                    4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
                }());
                k(a, b, c)
            }
        }
        function h(a) {
            if (t.ie && t.win && 4 != a.readyState) {
                var b = u.createElement("div");
                a.parentNode.insertBefore(b, a);
                b.parentNode.replaceChild(j(a), b);
                a.style.display = "none";
                (function() {
                    4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
                })()
            } else a.parentNode.replaceChild(j(a), a)
        }
        function j(a) {
            var b = u.createElement("div");
            if (t.win && t.ie) b.innerHTML = a.innerHTML;
            else if (a = a.getElementsByTagName(w)[0]) if (a = a.childNodes) for (var c = a.length, d = 0; d < c; d++)!(1 == a[d].nodeType && "PARAM" == a[d].nodeName) && 8 != a[d].nodeType && b.appendChild(a[d].cloneNode(!0));
            return b
        }
        function k(a, b, c) {
            var d, e = m(c);
            if (t.wk && 312 > t.wk) return d;
            if (e) if (typeof a.id == r && (a.id = c), t.ie && t.win) {
                var f = "",
                    g;
                for (g in a) a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? f += ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (f += " " + g + '="' + a[g] + '"'));
                g = "";
                for (var h in b) b[h] != Object.prototype[h] && (g += '<param name="' + h + '" value="' + b[h] + '" />');
                e.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + g + "</object>";
                H[H.length] = a.id;
                d = m(a.id)
            } else {
                h = u.createElement(w);
                h.setAttribute("type", v);
                for (var j in a) a[j] != Object.prototype[j] && ("styleclass" == j.toLowerCase() ? h.setAttribute("class", a[j]) : "classid" != j.toLowerCase() && h.setAttribute(j, a[j]));
                for (f in b) b[f] != Object.prototype[f] && "movie" != f.toLowerCase() && (a = h, g = f, j = b[f], c = u.createElement("param"), c.setAttribute("name", g), c.setAttribute("value", j), a.appendChild(c));
                e.parentNode.replaceChild(h, e);
                d = h
            }
            return d
        }
        function l(a) {
            var b = m(a);
            b && "OBJECT" == b.nodeName && (t.ie && t.win ? (b.style.display = "none", function() {
                if (4 == b.readyState) {
                    var c = m(a);
                    if (c) {
                        for (var d in c)"function" == typeof c[d] && (c[d] = null);
                        c.parentNode.removeChild(c)
                    }
                } else setTimeout(arguments.callee, 10)
            }()) : b.parentNode.removeChild(b))
        }
        function m(a) {
            var b = null;
            try {
                b = u.getElementById(a)
            } catch (c) {}
            return b
        }
        function n(a) {
            var b = t.pv;
            a = a.split(".");
            a[0] = parseInt(a[0], 10);
            a[1] = parseInt(a[1], 10) || 0;
            a[2] = parseInt(a[2], 10) || 0;
            return b[0] > a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
        }
        function p(a, b, c, d) {
            if (!t.ie || !t.mac) {
                var e = u.getElementsByTagName("head")[0];
                if (e) {
                    c = c && "string" == typeof c ? c : "screen";
                    d && (Q = J = null);
                    if (!J || Q != c) d = u.createElement("style"), d.setAttribute("type", "text/css"), d.setAttribute("media", c), J = e.appendChild(d), t.ie && (t.win && typeof u.styleSheets != r && 0 < u.styleSheets.length) && (J = u.styleSheets[u.styleSheets.length - 1]), Q = c;
                    t.ie && t.win ? J && typeof J.addRule == w && J.addRule(a, b) : J && typeof u.createTextNode != r && J.appendChild(u.createTextNode(a + " {" + b + "}"))
                }
            }
        }
        function q(a, b) {
            if (S) {
                var c = b ? "visible" : "hidden";
                I && m(a) ? m(a).style.visibility = c : p("#" + a, "visibility:" + c)
            }
        }
        function s(a) {
            return null != /[\\\"<>\.;]/.exec(a) && typeof encodeURIComponent != r ? encodeURIComponent(a) : a
        }
        var r = "undefined",
            w = "object",
            v = "application/x-shockwave-flash",
            E = "SWFObjectExprInst",
            z = window,
            u = document,
            y = navigator,
            F = !1,
            L = [function() {
                if (F) {
                    var a = u.getElementsByTagName("body")[0],
                        c = u.createElement(w);
                    c.setAttribute("type", v);
                    var d = a.appendChild(c);
                    if (d) {
                        var e = 0;
                        (function() {
                            if (typeof d.GetVariable != r) {
                                var f = d.GetVariable("$version");
                                f && (f = f.split(" ")[1].split(","), t.pv = [parseInt(f[0], 10), parseInt(f[1], 10), parseInt(f[2], 10)])
                            } else if (10 > e) {
                                e++;
                                setTimeout(arguments.callee, 10);
                                return
                            }
                            a.removeChild(c);
                            d = null;
                            b()
                        })()
                    } else b()
                } else b()
            }],
            G = [],
            H = [],
            A = [],
            B, x, C, O, I = !1,
            K = !1,
            J, Q, S = !0,
            t, U = typeof u.getElementById != r && typeof u.getElementsByTagName != r && typeof u.createElement != r,
            M = y.userAgent.toLowerCase(),
            N = y.platform.toLowerCase(),
            V = N ? /win/.test(N) : /win/.test(M),
            N = N ? /mac/.test(N) : /mac/.test(M),
            M = /webkit/.test(M) ? parseFloat(M.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
            R = !+"\v1",
            P = [0, 0, 0],
            D = null;
        if (typeof y.plugins != r && typeof y.plugins["Shockwave Flash"] == w) {
            if ((D = y.plugins["Shockwave Flash"].description) && !(typeof y.mimeTypes != r && y.mimeTypes[v] && !y.mimeTypes[v].enabledPlugin)) F = !0, R = !1, D = D.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), P[0] = parseInt(D.replace(/^(.*)\..*$/, "$1"), 10), P[1] = parseInt(D.replace(/^.*\.(.*)\s.*$/, "$1"), 10), P[2] = /[a-zA-Z]/.test(D) ? parseInt(D.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
        } else if (typeof z.ActiveXObject != r) try {
            var T = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (T && (D = T.GetVariable("$version"))) R = !0, D = D.split(" ")[1].split(","), P = [parseInt(D[0], 10), parseInt(D[1], 10), parseInt(D[2], 10)]
        } catch (W) {}
        t = {
            w3: U,
            pv: P,
            wk: M,
            ie: R,
            win: V,
            mac: N
        };
        t.w3 && ((typeof u.readyState != r && "complete" == u.readyState || typeof u.readyState == r && (u.getElementsByTagName("body")[0] || u.body)) && a(), I || (typeof u.addEventListener != r && u.addEventListener("DOMContentLoaded", a, !1), t.ie && t.win && (u.attachEvent("onreadystatechange", function() {
            "complete" == u.readyState && (u.detachEvent("onreadystatechange", arguments.callee), a())
        }), z == top &&
        function() {
            if (!I) {
                try {
                    u.documentElement.doScroll("left")
                } catch (b) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                a()
            }
        }()), t.wk &&
        function() {
            I || (/loaded|complete/.test(u.readyState) ? a() : setTimeout(arguments.callee, 0))
        }(), d(a)));
        t.ie && t.win && window.attachEvent("onunload", function() {
            for (var a = A.length, b = 0; b < a; b++) A[b][0].detachEvent(A[b][1], A[b][2]);
            a = H.length;
            for (b = 0; b < a; b++) l(H[b]);
            for (var c in t) t[c] = null;
            t = null;
            for (var d in swfobject) swfobject[d] = null;
            swfobject = null
        });
        return {
            registerObject: function(a, b, c, d) {
                if (t.w3 && a && b) {
                    var e = {};
                    e.id = a;
                    e.swfVersion = b;
                    e.expressInstall = c;
                    e.callbackFn = d;
                    G[G.length] = e;
                    q(a, !1)
                } else d && d({
                    success: !1,
                    id: a
                })
            },
            getObjectById: function(a) {
                if (t.w3) return g(a)
            },
            embedSWF: function(a, b, d, g, h, j, l, m, p, s) {
                var u = {
                    success: !1,
                    id: b
                };
                t.w3 && !(t.wk && 312 > t.wk) && a && b && d && g && h ? (q(b, !1), c(function() {
                    d += "";
                    g += "";
                    var c = {};
                    if (p && typeof p === w) for (var t in p) c[t] = p[t];
                    c.data = a;
                    c.width = d;
                    c.height = g;
                    t = {};
                    if (m && typeof m === w) for (var v in m) t[v] = m[v];
                    if (l && typeof l === w) for (var x in l) t.flashvars = typeof t.flashvars != r ? t.flashvars + ("&" + x + "=" + l[x]) : x + "=" + l[x];
                    if (n(h)) v = k(c, t, b), c.id == b && q(b, !0), u.success = !0, u.ref = v;
                    else {
                        if (j && f()) {
                            c.data = j;
                            e(c, t, b, s);
                            return
                        }
                        q(b, !0)
                    }
                    s && s(u)
                })) : s && s(u)
            },
            switchOffAutoHideShow: function() {
                S = !1
            },
            ua: t,
            getFlashPlayerVersion: function() {
                return {
                    major: t.pv[0],
                    minor: t.pv[1],
                    release: t.pv[2]
                }
            },
            hasFlashPlayerVersion: n,
            createSWF: function(a, b, c) {
                if (t.w3) return k(a, b, c)
            },
            showExpressInstall: function(a, b, c, d) {
                t.w3 && f() && e(a, b, c, d)
            },
            removeSWF: function(a) {
                t.w3 && l(a)
            },
            createCSS: function(a, b, c, d) {
                t.w3 && p(a, b, c, d)
            },
            addDomLoadEvent: c,
            addLoadEvent: d,
            getQueryParamValue: function(a) {
                var b = u.location.search || u.location.hash;
                if (b) {
                    /\?/.test(b) && (b = b.split("?")[1]);
                    if (null == a) return s(b);
                    for (var b = b.split("&"), c = 0; c < b.length; c++) if (b[c].substring(0, b[c].indexOf("=")) == a) return s(b[c].substring(b[c].indexOf("=") + 1))
                }
                return ""
            },
            expressInstallCallback: function() {
                if (K) {
                    var a = m(E);
                    a && B && (a.parentNode.replaceChild(B, a), x && (q(x, !0), t.ie && t.win && (B.style.display = "block")), C && C(O));
                    K = !1
                }
            }
        }
    }();