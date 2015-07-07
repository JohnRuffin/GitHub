var manageFavoriteComponent;
var manageFavoriteComponentMap = {};
/**
 * initializing list controls/ drop down with the favorites
 */

function initializeManageFavoriteComponent(favoriteId){
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(!manageFavoriteComponent){		
		manageFavoriteComponent = new ManageFavoritesComponent(parent.getFavoriteComponent(favoriteId), parent.getFavoriteComponent(favoriteId).userFavorites, parent.getFavoriteComponent(favoriteId).sharedFavorites, favoriteId);
		setManageFavoriteComponent(favoriteId,manageFavoriteComponent);
	}
	manageFavoriteComponent.populateListControls(parent.getFavoriteComponent(favoriteId));
}


function populateListControls(favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.populateListControls(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId));
	}else{
		initializeManageFavoriteComponent(favoriteId);
	}
}

function manageFavoriteWindowOpen(event, windowId){
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.reinitialize(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId));
	}
}
function getManageFavoriteComponent(dashboardId){
	return manageFavoriteComponentMap[dashboardId];
}
function setManageFavoriteComponent(dashboardId,manageFavoriteComponent){
	manageFavoriteComponentMap[dashboardId] = manageFavoriteComponent;
}
/**
 * 
 */

function setOnLoadState(favoriteId) {
    $("#manageDisplayFavoritesSharedSelect")[0].selectedIndex = -1;
    $("#manageDisplayFavoritesSelect")[0].selectedIndex = -1;
    setAllBtnsDefaultState();
    manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    if(manageFavoriteComponent){
    	manageFavoriteComponent.populateListControls(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId));
    }
    
}



function selectAllFavorites(selectBoxType, selectboxId) {
    var state = $("#" + selectboxId)[0].checked;
    for (i = 0; i < $("#" + selectBoxType)[0].children.length; i++) {
        $("#" + selectBoxType)[0].children[i].selected = state;
    }
    if (state) {
        setAllBtnsDefaultState();
        manageDisplayFavoritesDelete.disabled = false;
        manageDisplayFavoritesShare.disabled = false;
    }else {
    	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    	if(manageFavoriteComponent){
    		manageFavoriteComponent.resetUI();
    	}
    }
}

/**
 * logic to clear and save as default favorite
 * 
 * @param isDefault
 */

function setDefaultFavorite(isDefault,favoriteId) {//take the backup of the favorite
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.setAsDefaultOrClear(isDefault);
	}
}

/**
 * update the list box with the selected favorites 
 * @param selectedFavoritesArray
 * @param selectBoxType
 */
function updateDefaultSelectedFavoritesListBox(defaultFavoriteName, selectBoxType) {
	//get the list control.... 
    var listControl = $("#" + selectBoxType);
    //iterate over all th children in list box
    for (var i = 0; i < listControl[0].children.length; i++) {
    	var listBoxFavoriteName = getSelectedItemLabel(listControl[0].children[i]);
		//remove the favorite from UI
        if (listBoxFavoriteName  != defaultFavoriteName && listBoxFavoriteName.indexOf(DEFAULT_STRING) >= 0){
        	listControl[0].children[i].innerText =  listBoxFavoriteName.substring(0, listBoxFavoriteName.indexOf(DEFAULT_STRING));
        }
    }
}

/**
 * Closes the window....
 */
function closeManageFavorite(favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
   if(manageFavoriteComponent){
	   manageFavoriteComponent.cancel();
	   manageFavoriteComponent.close();
   }
}

/**
 * logic to delete favorites.....
 */

function deleteFavorites(favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.deleteFavorite();
	}
}

function cloneFavoriteState(favoriteId){
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	//clone the favorite
	if(!savedFavoritesByOrder){
		savedFavoritesByOrder = clone(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).userFavorites);
	}
}

function getIndex(favoriteArray, name) {
    for (i = 0; i < favoriteArray.length; i++) {
        if (favoriteArray[i].name == name) {
            return i;
        }
    }
    return -1;
}


function moveFavorite(direction,favoriteId) {	
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.moveFavorite(direction);
	}
}

function performSaveHandler(isManageShareFavorite,favoriteId){
	showBusyCursor(true);
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent ){
		manageFavoriteComponent.save(isManageShareFavorite);
		hideBusyCursor(true);
	}
}

function clone(object) {
    return jQuery.extend(true, {}, object);
}

function updateFavoriteOrder(favoriteId) {
    var selectBoxType = "manageDisplayFavoritesSelect";
    var listControl = $("#" + selectBoxType);
    var favoriteNames = "";
    for (var i = 0; i < listControl[0].children.length; i++) {
        favoriteNames += getSelectedItemLabel(listControl[0].children[i]) + ",";
    }
    manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).updateFavoriteOrder(favoriteNames);
}


function openSharedFavorites(favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    var selectedSharedFavoriteList = "";
    selectedSharedFavoriteList = obtainSelectedFavoritesNamesAsString('manageDisplayFavoritesSelect');
    parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).showShareFavoriteWindow("manageFavorites", selectedSharedFavoriteList);
    closeManageFavorite(favoriteId);
}


function enableDisplayFavoritesBtns(selectBoxType,favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    var listControl = $("#" + selectBoxType);
    if (selectBoxType == 'manageDisplayFavoritesSelect') {
        $("#manageDisplayFavoritesSharedSelect")[0].selectedIndex = -1;
        setAllBtnsDefaultState();
        var favoriteComponent = parent.getFavoriteComponent(manageFavoriteComponent.favoriteId);
        if (listControl[0].selectedIndex != -1) {
            manageDisplayFavoritesDelete.disabled = false;
            manageDisplayFavoritesShare.disabled = false;
            setSingleSelectBtnState(listControl, selectBoxType);
            if (listControl[0].selectedOptions.length == 1) {
               /* if (favoriteComponent.defaultfavorite != null && favoriteComponent.defaultfavorite.name != null && favoriteComponent.defaultfavorite.name+DEFAULT_STRING == listControl[0].selectedOptions[0].textContent + DEFAULT_STRING) {
                    manageDisplayFavoritesRemoveDefault.disabled = false;
                    $("#manageDisplayFavoritesSetDefault").attr("disabled", "disabled");
                }*/
            	if (listControl[0].selectedOptions[0].textContent.indexOf(DEFAULT_STRING ) > 0 ) {
                    manageDisplayFavoritesRemoveDefault.disabled = false;
                    $("#manageDisplayFavoritesSetDefault").attr("disabled", "disabled");
                }
            }

        }
    } else if (selectBoxType == 'manageDisplayFavoritesSharedSelect') {
        $("#manageDisplayFavoritesSelect")[0].selectedIndex = -1;
        setAllBtnsDefaultState();
        if (listControl[0].selectedIndex != -1) {
            manageDisplayFavoritesDelete.disabled = false;
            setSingleSelectBtnState(listControl, selectBoxType);
        }
    }
    
    resetCheckBoxSelection();
}

function resetCheckBoxSelection(){
	var selectedNodes = $('#manageDisplayFavoritesSelect').val();
    if(!selectedNodes || selectedNodes .length != $('#manageDisplayFavoritesSelect').children().length || selectedNodes .length  <=0){
    	$("#manageDisplayFavoritesChkBox").attr("checked", false);
    }else if(selectedNodes .length == $('#manageDisplayFavoritesSelect').children().length){
    	$("#manageDisplayFavoritesChkBox").attr("checked", true);
    }
}
function setSingleSelectBtnState(listControl, selectBoxType) {
    var count = 0;
    for (i = 0; i < listControl[0].children.length; i++) {
        if (listControl[0].children[i].selected) {
            count++;
            if (count > 1) break;
        }
    }
    if (count == 1) {
        if (selectBoxType == "manageDisplayFavoritesSelect") {
            if (listControl[0].selectedIndex != 0) manageDisplayFavoritesMoveUp.disabled = false;
            if (listControl[0].selectedIndex != listControl[0].children.length - 1) manageDisplayFavoritesMoveDown.disabled = false;
            manageDisplayFavoritesSetDefault.disabled = false;
        } else if (selectBoxType == "manageDisplayFavoritesSharedSelect") {
            manageDisplayFavoritesMoveLeft.disabled = false;
        }
    }
}


function setAllBtnsDefaultState() {
    manageDisplayFavoritesMoveUp.disabled = true;
    manageDisplayFavoritesMoveDown.disabled = true;
    manageDisplayFavoritesSetDefault.disabled = true;
    manageDisplayFavoritesMoveLeft.disabled = true;
    manageDisplayFavoritesShare.disabled = true;
    manageDisplayFavoritesDelete.disabled = true;
    manageDisplayFavoritesRemoveDefault.disabled = true;
}

function obtainSelectedFavoritesNamesAsString(selectBoxType) {
    var listControl = $("#" + selectBoxType);
    var selectedFavorites = "";
    for (var i = 0; i < listControl[0].children.length; i++) {
        if (listControl[0].children[i].selected) selectedFavorites += getSelectedItemLabel(listControl[0].children[i]) + ",";
    }
    return selectedFavorites;
}


function obtainSelectedFavoritesNamesAsArray(selectBoxType) {
    var listControl = $("#" + selectBoxType);
    var selectedFavoritesArray = new Array();
    var favoriteName;
    for (var i = 0; i < listControl[0].children.length; i++) {
        if (listControl[0].children[i].selected) {
        	favoriteName  = getSelectedItemLabel(listControl[0].children[i]);
        	if(favoriteName.indexOf(DEFAULT_STRING ) > -1 ){
        		favoriteName = favoriteName.substring(0, favoriteName.indexOf(DEFAULT_STRING ));
        	}
            selectedFavoritesArray.push(favoriteName);
        }
    }
    return selectedFavoritesArray;
}


function acceptSharedFavorites(favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
	if(manageFavoriteComponent){
		manageFavoriteComponent.acceptSharedFavorites('manageDisplayFavoritesSharedSelect');
	}
}

function validateFavoriteToBeAccepted(selectedFavoritesArray, userFavorites,favoriteId) {
    // need to improve for multiselection in share window
    var validInvalidFavoritesMap = {};
    var validFavoritesStr = "";
    var invalidFavoritesStr = "";
    var invalidFavoritesArray = new Array();
    var validFavoritesArray = new Array();
    manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    if(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).userFavorites != null ){
    	var userFav = getObjectValues(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).userFavorites);
        if (userFav) {
            for (j = 0; j < userFav.length; j++) {
                for (i = 0; i < selectedFavoritesArray.length; i++) {
                    if (userFav[j].name == selectedFavoritesArray[i]) {
                        invalidFavoritesArray.push(selectedFavoritesArray[i]);
                        invalidFavoritesStr += selectedFavoritesArray[i] + ",";
                        break;
                    }
                }
            }
        }
    }
    
    if (invalidFavoritesStr == EMPTY_STRING) {
        validFavoritesStr = selectedFavoritesArray.toString();
        validFavoritesArray = selectedFavoritesArray;
    }
    validInvalidFavoritesMap["validFavoritesStr"] = validFavoritesStr;
    validInvalidFavoritesMap["validFavoritesArray"] = validFavoritesArray;
    validInvalidFavoritesMap["invalidFavoritesStr"] = invalidFavoritesStr;
    validInvalidFavoritesMap["invalidFavoritesArray"] = invalidFavoritesArray;
    return validInvalidFavoritesMap;

}

function updateFavoritesonAccept(selectedFavoritesArray, newFavoriteName,favoriteId) {
	manageFavoriteComponent = getManageFavoriteComponent(favoriteId);
    var userFavoriteArray = getObjectValues(parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).userFavorites);
    var shareFavoriteArray = parent.getFavoriteComponent(manageFavoriteComponent.favoriteId).sharedFavorites;
    var flag = false;

    if (userFavoriteArray == null) {
        userFavoriteArray = [];
    }

    for (j = 0; j < selectedFavoritesArray.length; j++) {
        if (newFavoriteName == "") {
            for (var i = 0; i < userFavoriteArray.length; i++) {
                if (userFavoriteArray[i].name == selectedFavoritesArray[j]) {
                    flag = true;
                }
            }
            if (!flag && selectedFavoritesArray[j]) {
                userFavoriteArray.splice(0, 0, getFavoriteObject(shareFavoriteArray, selectedFavoritesArray[j]));
            }
        } else {
            var selectedObject = getFavoriteObject(shareFavoriteArray, selectedFavoritesArray[j]);
            selectedObject.name = newFavoriteName;
            userFavoriteArray.splice(0, 0, selectedObject);
        }
        if (shareFavoriteArray != null) {
            if (newFavoriteName != "") {
                for (var i = 0; i < shareFavoriteArray.length; i++) {
                    if (shareFavoriteArray[i].name == newFavoriteName) {
                        var selectedIndex = getIndex(shareFavoriteArray, newFavoriteName);
                        shareFavoriteArray.splice(selectedIndex, 1);
                    }
                }
            } else {
                for (var i = 0; i < shareFavoriteArray.length; i++) {
                    if (shareFavoriteArray[i].name == selectedFavoritesArray[j]) {
                        var selectedIndex = getIndex(shareFavoriteArray, selectedFavoritesArray[j]);
                        shareFavoriteArray.splice(selectedIndex, 1);
                    }
                }
            }
        }
    }
    // populateListControl('manageDisplayFavoritesSelect', userFavoriteArray);
    // populateListControl('manageDisplayFavoritesSharedSelect',
    // shareFavoriteArray);

}

function getFavoriteObject(favoriteArray, selectedItem) {
    for (i = 0; i < favoriteArray.length; i++) {
        if (favoriteArray[i].name == selectedItem) return favoriteArray[i];
    }
    return null;
}

function getObjectValues(mapObject){
	return $.map(mapObject, function(val, key) { return val; });
}

function getSelectedItemLabel(listCtrlItem) {
	 return (listCtrlItem.label != undefined && listCtrlItem.label != "") ? listCtrlItem.label : $(listCtrlItem).text();
}