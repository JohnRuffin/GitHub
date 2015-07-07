/***** delete later ***********/
dojo.require("esri.map");
dojo.require("dijit.TooltipDialog");

dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.Popup");
dojo.require("esri.symbol");
dojo.require("esri.geometry");
dojo.require("esri.graphic");
dojo.require("dojo.parser");
dojo.require("dojo.number");
dojo.require("esri.toolbars.draw");
dojo.require("dojox.xml.parser");
dojo.require("dojo.dnd.Source");
dojo.require("dojo.dnd.Target");
dojo.require("dojo/dnd/AutoSource");
dojo.require("dojo/dom");
/*
dojo.require("dijit.dijit-all");
dojo.require("dijit/layout/AccordionPane");
dojo.require("esri.dijit.editing.Editor-all");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("dijit.form.Button");
dojo.require("dijit.Menu");
dojo.require("dijit/form/DropDownButton");
dojo.require("dijit/DropDownMenu");
dojo.require("dijit/MenuItem");
*/
/*
function extendSimpleMarkerSymbol() {
    if (esri.version === 3.3) {
        esri.symbol.SimpleMarkerSymbol.prototype._styles.triangle = "esriSMSTriangle";
        dojo.mixin(esri.symbol.SimpleMarkerSymbol, {
            STYLE_TRIANGLE: "triangle"
        });
        esri.layers._GraphicsLayer.prototype._drawPoint = function(_3e4, _3e5, _3e6, _3e7) {
            var type = _3e6.type,
                map = this._map,
                _mvr = map.__visibleRect,
                _3eb = esri.geometry.toScreenPoint(map.extent, map.width, map.height, _3e5).offset(-_mvr.x, -_mvr.y),
                px = _3eb.x,
                py = _3eb.y,
                _3ee;
            if (type === "simplemarkersymbol") {
                var _3ef = _3e6.style,
                    half = _3e6.size / 2,
                    _3f1 = Math.round,
                    SMS = esri.symbol.SimpleMarkerSymbol;
                switch (_3ef) {
                case SMS.STYLE_SQUARE:
                    _3ee = this._drawPath(_3e4, _3e7, this._smsToPath(SMS, _3ef, px, py, _3f1(px - half), _3f1(px + half), _3f1(py - half), _3f1(py + half), _3f1(py + (half / Math.sqrt(3))), _3f1(py - (2 * half / Math.sqrt(3)))));
                    break;
                case SMS.STYLE_CROSS:
                case SMS.STYLE_X:
                case SMS.STYLE_CIRCLE:
                    _3ee = this._drawCircle(_3e4, _3e7, {
                        cx: px,
                        cy: py,
                        r: half
                    });
                    break;
                case SMS.STYLE_TRIANGLE:
                    _3ee = this._drawPath(_3e4, _3e7, this._smsToPath(SMS, _3ef, px, py, _3f1(px - half), _3f1(px + half), _3f1(py - half), _3f1(py + half), _3f1(py + (half / Math.sqrt(3))), _3f1(py - (2 * half / Math.sqrt(3)))));
                    break;
                default:
                    _3ee = this._drawCircle(_3e4, _3e7, {
                        cx: px,
                        cy: py,
                        r: half
                    });
                }
            } else {
                if (type === "picturemarkersymbol") {
                    var w = _3e6.width,
                        h = _3e6.height;
                    _3ee = this._drawImage(_3e4, _3e7, {
                        x: px - (w / 2),
                        y: py - (h / 2),
                        width: w,
                        height: h,
                        src: _3e6.url
                    });
                } else {
                    if (type === "textsymbol") {
                        _3ee = this._drawText(_3e4, _3e7, {
                            type: "text",
                            text: _3e6.text,
                            x: px,
                            y: py,
                            align: _3e6.align,
                            decoration: _3e6.decoration,
                            rotated: _3e6.rotated,
                            kerning: _3e6.kerning
                        });
                    }
                }
            }
            _3ee.setTransform(dojox.gfx.matrix.multiply(dojox.gfx.matrix.translate(_3e6.xoffset, -_3e6.yoffset), dojox.gfx.matrix.rotategAt(_3e6.angle, _3eb)));
            return _3ee;
        };
        esri.layers._GraphicsLayer.prototype._smsToPath = (function() {
            if (dojo.isIE) {
                return function(SMS, _3d5, x, y, xMh, xPh, yMh, yPh, yPR, yMr) {
                    switch (_3d5) {
                    case SMS.STYLE_SQUARE:
                        return ["M", xMh + "," + yMh, "L", xPh + "," + yMh, xPh + "," + yPh, xMh + "," + yPh, "X", "E"];
                    case SMS.STYLE_CROSS:
                        return ["M", x + "," + yMh, "L", x + "," + yPh, "M", xMh + "," + y, "L", xPh + "," + y, "E"];
                    case SMS.STYLE_X:
                        return ["M", xMh + "," + yMh, "L", xPh + "," + yPh, "M", xMh + "," + yPh, "L", xPh + "," + yMh, "E"];
                    case SMS.STYLE_DIAMOND:
                        return ["M", x + "," + yMh, "L", xPh + "," + y, x + "," + yPh, xMh + "," + y, "X", "E"];
                    case SMS.STYLE_TRIANGLE:
                        return ["M", xMh + "," + yMr, "L", xPh + "," + yMr, x + "," + yPR, "X", "E"];
                    }
                };
            } else {
                return function(SMS, _3dd, x, y, xMh, xPh, yMh, yPh, yPR, yMr) {
                    switch (_3dd) {
                    case SMS.STYLE_SQUARE:
                        return ["M", xMh + "," + yMh, xPh + "," + yMh, xPh + "," + yPh, xMh + "," + yPh, "Z"];
                    case SMS.STYLE_CROSS:
                        return ["M", x + "," + yMh, x + "," + yPh, "M", xMh + "," + y, xPh + "," + y];
                    case SMS.STYLE_X:
                        return ["M", xMh + "," + yMh, xPh + "," + yPh, "M", xMh + "," + yPh, xPh + "," + yMh];
                    case SMS.STYLE_DIAMOND:
                        return ["M", x + "," + yMh, xPh + "," + y, x + "," + yPh, xMh + "," + y, "Z"];
                    case SMS.STYLE_TRIANGLE:
                        return ["M", xMh + "," + yMr, xPh + "," + yMr, x + "," + yPR, "Z"];
                    }
                };
            }
        })();
    }
}
*/