/**
 * Created by 888608 on 4/8/2015.
 */

isDrawMirrorLineByActualCoordinates: function(x1, y1, x2, y2){
     if((startPoint.x >105 && startPoint.x <155) && (startPoint.y > -40 && startPoint.y <-10)){
     return false;
     }else if((endPoint.x >105 && endPoint.x <155) && (endPoint.y > -40 && endPoint.y <-10)){
     return false;
     }else if((startPoint.x > 100 && startPoint.y > 0) && (endPoint.x < 0 && endPoint.y > 0)){
     return true;
     }


     return false;
}

getDistanceFactor: function(distance, startPoint, endPoint, lineCounter, polylineCount){

    var distFactor;

    if(CoordinateUtils.areSameCoordinates(startPoint, endPoint)){
     return;
     }
     if (this.lineCounter < this.polylineCount) {
     return 1;
     } else if ((this.lineCounter > this.polylineCount) && (this.lineCounter <= 2 * (this.polylineCount))) {
     return;
     } else if ((this.lineCounter > 2 * (this.polylineCount)) && (this.lineCounter <= 3 * (this.polylineCount))) {
     return 2;
     } else if ((this.lineCounter > 3 * (this.polylineCount)) && (this.lineCounter <= 4 * (this.polylineCount))) {
     if(distance > 9500 && distance < 12000){
     if(this.lineCounter % 2 == 0){
     return;
     }else {
     return 4;
     }

     }else if(distance > 12000){
     return ;
     }else  if(distance > 8000 && distance <= 9500){
     return -0.5;
     }else {
     return -1;
     }
     } else if ((this.lineCounter > 4 * (this.polylineCount)) && (this.lineCounter <= this.totalPolylines)) {
     return 3;
     } else if (this.lineCounter == this.polylineCount) {
     if(distance > 10500 && distance < 12000){
     return 2;
     }else if(distance > 12000){
     return ;
     }else  if(distance > 8000 && distance <= 10500){
     return -0.5;
     }else {
     return -1;
     }
     }else {
     return 4;
     }


    return distFactor;
}

isDrawMirrorLine: function(startPoint, endPoint, distance){
    if(this.isDrawMirrorLineException(startPoint, endPoint, distance)){
        return true; // emphasize the curves in the apac2apac region
    }else if((startPoint.x < 0 && startPoint.y > 0) && (endPoint.x > 0 && endPoint.y < 0) ){
        return false;
    }else if(((startPoint.x > 0 && startPoint.x < 90) && startPoint.y > 0) && ((endPoint.x < 0  && endPoint.x > -90 )&& endPoint.y > 0) ){
        return true;
    }else if((startPoint.x > 0 && (startPoint.y < 0  && startPoint.y > -90) && (endPoint.x < -90 && endPoint.x > -180) && endPoint.y > 0) ){
        return false;
    }else if(((startPoint.x < -90 && startPoint.x > -180) && startPoint.y > 0) && (endPoint.x > 0 && endPoint.y > 0) ){
        return false;
    }else if((endPoint.x < 0 && endPoint.y > 0) && (startPoint.x > 0 && startPoint.y < 0) ){
        return false;
    }else if(((endPoint.x > 0 && endPoint.x < 90) && endPoint.y > 0) && ((startPoint.x < 0  && startPoint.x > -90 )&& startPoint.y > 0) ){
        return true;
    }else if((endPoint.x > 0 && (endPoint.y < 0  && endPoint.y > -90) && (startPoint.x < -90 && startPoint.x > -180) && startPoint.y > 0) ){
        return false;
    }else if(((endPoint.x < -90 && endPoint.x > -180) && endPoint.y > 0) && (startPoint.x > 0 && startPoint.y > 0) ){
        return true;
    }else if (distance > 6000 && distance < 7200) {
        return false;
    }/*else if(distance > 10000){
     return false;
     }*/

    return true;
},

isDrawMirrorLineException: function(startPoint, endPoint, distance) {
    if(startPoint.x > 100 && startPoint.x < 175 && startPoint.y < 41 && startPoint.y > -38 && endPoint.x > 100 && endPoint.x < 175 && endPoint.y < 41 && endPoint.y > -38){
        return true; // emphasize the curves in the apac2apac region
    }else if(startPoint.x > 50 && startPoint.x < 85 && startPoint.y < 45 && startPoint.y > 10 && endPoint.x > 100 && endPoint.x < 120 && endPoint.y < 41 && endPoint.y > 20){
        return true;
    }
},

isGeodesicLineException: function(startPoint, endPoint, distance) {
    if((startPoint.y > 0 && endPoint.y < 0) || (startPoint.y < 0 && endPoint.y > 0)){
        return true; // emphasize the curves in the apac2apac region
    }
},
