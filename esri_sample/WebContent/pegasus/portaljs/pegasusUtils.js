function initResources() {

}


function createWindow(id, title, div, x, y, width, height) {
    try {
        var taskbarButton;
        var window = Ext.create('Ext.window.Window', {
            id: id,
            autoShow: true,
            layout: 'fit',
            title: title,
            closeAction: 'hide',
            width: width,
            height: height,
            border: false,
            baseCls: 'x-panel',
            maximizable: true,
            minimizable: false,
            constrain: true,
            x: x,
            y: y,
            html: div,
            controls: {
                taskbarButton: taskbarButton
            },
            tools: [{
                type: 'minimize',
                handler: function() {
                    if (window.id == 'esrimaps') {
                        minimizeMapWin(window);
                    } else if (window.id == 'geDiv') {
                        minimizeMapWin(window);
                    } else {
                        minimizeMapWin(window);
                    }
                }
            }],
            listeners: {
                show: function() {

                },
                resize: function(evt) {
                    if (window && window.id == 'esrimaps') {
                        //esri map methods helps to resize and reposition
                        map.reposition();
                        map.resize();
                    }
                },
                close: function(evt) {
                    if (window.id == 'esrimaps') {
                        dojo.byId('map').style.display = 'none';
                    }
                }
            }
        });

    } catch (err) {
        alert("Error while rendering ESRI Maps [" + err + "]");
    }
}

function createWindowContentEl(id, title, div, x, y, width, height, isAutoScroll) {
    try {
        var taskbarButton;
        var window = Ext.create('Ext.window.Window', {
            id: id,
            autoShow: true,
            layout: 'fit',
            title: title,
            closeAction: 'hide',
            width: width,
            height: height,
            border: false,
            baseCls: 'x-panel',
            maximizable: true,
            minimizable: false,
            constrain: true,
            autoScroll: isAutoScroll,
            x: x,
            y: y,
            contentEl: div,
            controls: {
                taskbarButton: taskbarButton
            },
            tools: [{
                type: 'minimize',
                handler: function() {
                    if (window.id == 'esrimaps') {
                        minimizeMapWin(window);
                    } else if (window.id == 'geDiv') {
                        minimizeMapWin(window);
                    } else {
                        minimizeMapWin(window);
                    }
                }
            }],
            listeners: {
                show: function() {

                },
                resize: function(evt) {
                    if (window && window.id == 'gridIframe') {
                        var tBody = $('#grid');
                        tBody[0].style.width = window.width - 20;
                        tBody[0].style.height = window.height - 20;
                    }

                    if (window && window.id == 'esrimaps') {
                        var mapDiv = document.getElementById('map');
                        mapDiv.style.width = window.width;
                        mapDiv.style.height = window.height;
                        //esri map methods helps to resize and reposition
                        map.reposition();
                        map.resize();
                    }
                },
                close: function(evt) {
                    if (window.id == 'esrimaps') {
                        dojo.byId('map').style.display = 'none';
                    }
                }
            }
        });
    } catch (err) {
        alert("Error while rendering ESRI Maps [" + err + "]");
    }
}


function getPictureMarkerSymbol(iconUrl, xoffset, yoffset, width, height, angle) {
    if(!xoffset){
        xoffset = 0;
    }
    if(!yoffset){
        yoffset = 16;
    }
    
    if(!width){
        width = 32;
    }
    if(!height){
        width = 32;
    }
    
    if(!angle){
    	angle =0;
    }
    
    //"../icons/icons-placemark.png"
    var infoSymbol = new esri.symbol.PictureMarkerSymbol({
        "angle": angle,
        "xoffset": xoffset,
        "yoffset": yoffset,
        "type": "esriPMS",
        "url": iconUrl,
        "contentType": "image/png",
        "width": width,
        "height": height
    });

    return infoSymbol;
}


function getPolylineEndPoint(paths) {

    if (paths != null) {
        var lastPathArray = paths[(paths.length - 1)];

        return lastPathArray;
        //return lastPathArray[(lastPathArray.length-1)];
    }
    return null;
}

function getCircle(x, y) {
    var m_center = getMapPoint(x, y, map.spatialReference);
    var m_circleGeometry = new esri.geometry.Polygon();
    m_circleGeometry.addRing(createCirclePoints(1000000, m_center));
    var m_graphic = new esri.Graphic(m_circleGeometry, null, null);
    graphicsLayer.add(m_graphic);
    return m_graphic;
}

function getCircleGraphic(m_center) {
    //var m_center = getMapPoint(x, y, map.spatialReference);
    var m_circleGeometry = new esri.geometry.Polygon(map.spatialReference);
    m_circleGeometry.addRing(createCirclePoints(300000, m_center));
    var m_graphic = new esri.Graphic(m_circleGeometry, getFeatureSymbol(m_circleGeometry));
    graphicsLayer.add(m_graphic);
    return m_graphic;
}



//create the circle polygon
function createCirclePoints(m_radius, m_center) {
    var cosinus;
    var sinus;
    var x;
    var y;
    var arrayOfPoints = new Array();

    //create the array of points which will compose the circle
    for (var i = 0; i < 32; i++) {
        sinus = Math.sin((Math.PI * 2.0) * (i / 32));
        cosinus = Math.cos((Math.PI * 2.0) * (i / 32));
        x = m_center.x + m_radius * cosinus;
        y = m_center.y + m_radius * sinus;
        //arrayOfPoints[i] = new  esri.geometry.Point(x, y);
        arrayOfPoints[i] = [x, y];
    }

    //add the first point at the end of the array to close the polygon
    arrayOfPoints.push(arrayOfPoints[0]);

    return arrayOfPoints;
}


function getGraphicByDistance(circleGraphic, graphic2MeasureFrom, distance) {
    var nearestGraphicsDataCollection = getGraphicsInExtentByType(circleGraphic, null);
    if (nearestGraphicsDataCollection != null) {
        var graphic = null;
        for (var i = 0; i < nearestGraphicsDataCollection.length; i++) {
            graphic = nearestGraphicsDataCollection[i];
            if (graphic.attributes != null) {
                if (100 == distance) {
                    return graphic;
                }
            }
        }
    }

    return null;
}

function laneEditEndHandler(_graphic, dragSource, isStartPoint) {
    //get all nearest graphics
    var nearestGraphicsDataCollection = getGraphicsInExtentByType(_graphic, null);
    //trace(nearestGraphicsDataCollection.length +" Nearest Placemraks Count");
    if (nearestGraphicsDataCollection != null) {
        var graphic = null;
        var distance = 10000000; //assuming nearest distance
        var x = 0;
        var y = 0;
        //var destName:String = getLaneDtlsFromGraphic(dragSource).destLocCd; 
        //var origName:String = getLaneDtlsFromGraphic(dragSource).origLocCd;
        var nearestGraphic = new esri.Graphic(dragSource.geometry, dragSource.symbol, dragSource.data);
        for (var i = 0; i < nearestGraphicsDataCollection.length; i++) {
            var graphic = nearestGraphicsDataCollection[i];
            if (graphic.attributes != null) { //&& graphic.attributes.name != destName && graphic.attributes.name != origName
                //trace( ArcGISUtils.getDistance(graphic.geometry, endPointDragGraphic.geometry));
                if (distance > getDistance(graphic.geometry, dragSource.geometry)) {
                    distance = getDistance(graphic.geometry, dragSource.geometry);
                    nearestGraphic = graphic;
                }
            }
        }

        if (nearestGraphic.geometry) {
            x = (nearestGraphic.geometry).x;
            y = (nearestGraphic.geometry).y;
        } else {
            x = (nearestGraphic.geometry).x;
            y = (nearestGraphic.geometry).y;
        }

        //trace(nearestGraphic.attributes.name);
        (dragSource.geometry).x = x;
        (dragSource.geometry).y = y;


        //name
        dragSource.name = nearestGraphic.name;
        //updated statistics
        if (nearestGraphic.attributes) {
            if (isStartPoint && dragSource.data.dragSource.data) {
                dragSource.data.dragSource.data.originMovedTo = nearestGraphic;
            } else {
                if (dragSource.data.dragSource.data) {
                    dragSource.data.dragSource.data.destMovedTo = nearestGraphic;
                }
            }

        }


        //applyEdits(endPointDragGraphic)
        graphicsLayer.refresh();
    }

    drawTool.deactivate();

    return nearestGraphic;
}


function getDistance(p1, p2) {
    p1 = toGeographic(p1);
    p2 = toGeographic(p2);
    with(Math) { // Convert coordinates from degrees to Radians
        var lat1 = p1.y * (Math.PI / 180);
        var lon1 = p1.x * (Math.PI / 180);
        var lat2 = p2.y * (Math.PI / 180);
        var lon2 = p2.x * (Math.PI / 180);
        // Calculate the total extent of the route
        var distance = 2 * asin(sqrt(pow((sin((lat1 - lat2) / 2)), 2) + cos(lat1) * cos(lat2) * pow((sin((lon1 - lon2) / 2)), 2)));

        return distance;
    }
}

function toWebmercater(geoPoint) {
    return new esri.geometry.geographicToWebMercator(geoPoint);
}

function toGeographic(webmercatorPoint) {
    return esri.geometry.webMercatorToGeographic(webmercatorPoint);
}

function toGeodesic(points, n, renderEsriGeodesic) {
	if(renderEsriGeodesic){
		return geodesicEsriRenderer(points, n);		
	}else {
		return geodesicRenderer(points, n);
	}    
}

function geodesicEsriRenderer(points, n) {
	if (!n) {
        n = 32;
    };
	var start = points[0], end  = points[1];
	var lineMidPoint = getGeoDesicMidPoint(start,end);
	var nearestDestinatoinPoint = getGeoDesicMidPoint(lineMidPoint, end);
	var nearestOriginPoint = getGeoDesicMidPoint(start, lineMidPoint);
	var geodesicGeomGeo = getGeodesicPolyline([start, nearestOriginPoint, lineMidPoint, nearestDestinatoinPoint, end]);
	var allPoints = geodesicGeomGeo.paths[0];
	if(allPoints){
		var mapPoints = [];
		for(var i=0; i< allPoints.length; i++){
			mapPoints.push(getMapPoint(allPoints[i][1], allPoints[i][0]));
		}
		return mapPoints;	
	}
	return [];
}

function getGeodesicPolyline(mappoints){
	var webmercaterMapPoints = [];
	
	if(mappoints){
		for(var i =0; i< mappoints.length; i++){
			webmercaterMapPoints .push (toWebmercater(mappoints[i]));			
		}
	}
	
	//create polyline
	var polyline = new esri.geometry.Polyline();
	polyline.addPath(webmercaterMapPoints );
	//convert to wgs84 and densify to show shortest great circle path
	return esri.geometry.geodesicDensify(esri.geometry.webMercatorToGeographic(polyline),150000000000000000000000);
}

function getGeoDesicMidPoint(originPoint, destinationPoint){
	var geodiscLine = getGeodesicPolyline([originPoint, destinationPoint]);
	return geodiscLine.getExtent().getCenter();
}

function geodesicRenderer(points, n){
	if (!n) {
        n = 32;
    }; // The number of line segments to use
    var locs = null;
    var pathsArray = new Array();
    if (n == -1) {
        locs = points;
    } else {
        locs = new Array();
        var previousPoint = null;
        var isWebMercator = false;
        for (var i = 0; i < points.length - 1; i++) {
            with(Math) {
                if (points[i]) {
                    //points[i] = toGeographic(points[i]);
                    //isWebMercator = true;
                }
                if (points[i + 1]) {
                    //points[i+1] = toGeographic(points[i+1]);
                    //isWebMercator = true;
                }

                // Convert coordinates from degrees to Radians
                var lat1 = points[i].y * (Math.PI / 180);
                var lon1 = points[i].x * (Math.PI / 180);
                var lat2 = points[i + 1].y * (Math.PI / 180);
                var lon2 = points[i + 1].x * (Math.PI / 180);
                // Calculate the total extent of the route
                var d = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin((lon1 - lon2) / 2)), 2)));
                // Calculate  positions at fixed intervals along the route
                for (var k = 0; k <= n; k++) {
                    var f = (k / n);
                    var A = Math.sin((1 - f) * d) / sin(d);
                    var B = Math.sin(f * d) / sin(d);
                    // Obtain 3D Cartesian coordinates of each point
                    var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
                    var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
                    var z = A * Math.sin(lat1) + B * Math.sin(lat2);
                    // Convert these to latitude/longitude
                    var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                    var lon = Math.atan2(y, x);
                    //trace(f+" "+A+" "+B+" "+z);
                    // Create a Location (remember to convert back to degrees)
                    var p = getMapPoint(lat / (Math.PI / 180), lon / (Math.PI / 180));
                    if (previousPoint != null && ((previousPoint.x < 0 && p.x > 0) || (previousPoint.x > 0 && p.x < 0)) && (abs(previousPoint.x) + abs(p.x)) > 180) {
                        var closePoint = getClosePointToMeridian(lat1, lon1, lat2, lon2, ((k - 1) / n), d, 200);
                        var newPoint = getMapPoint(previousPoint.x > 0 ? 180 : -180, closePoint.y);
                        locs.push(isWebMercator ? toWebmercater(newPoint) : newPoint);
                        pathsArray.push(locs);
                        locs = new Array();
                        newPoint = getMapPoint(previousPoint.x > 0 ? -180 : 180, closePoint.y);
                        locs.push(isWebMercator ? toWebmercater(newPoint) : newPoint);
                    }
                    previousPoint = p;
                    //trace(p.x+": "+p.y);
                    // Add this to the array
                    locs.push(isWebMercator ? toWebmercater(p) : p);
                }
            }
        }
    }

    pathsArray.push(locs);
    return pathsArray;	
}


function getClosePointToMeridian(lat1, lon1, lat2, lon2, k, d, n) {
    var p = null;
    var p1 = null;

    with(Math) {
        for (var i = 0; i <= n; i++) {
            var f = k + (i / n);
            var A = Math.sin((1 - f) * d) / sin(d);
            var B = Math.sin(f * d) / sin(d);
            // Obtain 3D Cartesian coordinates of each point
            var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
            var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
            var z = A * Math.sin(lat1) + B * Math.sin(lat2);
            // Convert these to latitude/longitude
            var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
            var lon = Math.atan2(y, x);
            //trace(f+" "+A+" "+B+" "+z);
            // Create a Location (remember to convert back to degrees)
            p = getMapPoint(lon / (Math.PI / 180), lat / (Math.PI / 180));
            if (p1 != null) {
                if (p1.x > 0 && p.x < 0) {
                    return p1;
                }
                if (p1.x < 0 && p.x > 0) {
                    return p1;
                }
            }
            p1 = p;
        }
    }

    return p;
}

function calculatePoint(a, b, distance) {
    a = toWebmercater(a);
    b = toWebmercater(b);
    var p;
    var magnitude = Math.sqrt(Math.pow((b.y - a.y),2) + Math.pow((b.x - a.y),2));
    x = (a.x + (distance * ((b.x - a.x)/magnitude)));
    y = (a.y + (distance * ((b.y - a.y)/magnitude)));
    return toGeographic(getMapPoint(x, y));
}