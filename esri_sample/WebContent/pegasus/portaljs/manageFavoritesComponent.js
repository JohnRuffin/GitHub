var FAVORITE_DATA_URL = "dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.FavoriteDataRenderer";

function ManageFavoritesComponent(favoriteComponent, userFavorites, sharedFavorites, favoriteId) {
    this.savedFavoritesByOrder;
    this.savedDeleteFavoriteMap = {};
    this.initialFavoriteState;
    this.userFavorites = this.clone(userFavorites);
    this.sharedFavorites = this.clone(sharedFavorites);
    this.favoriteComponent = favoriteComponent;
    this.savedFavoritesByOrder;
    this.savedDefaultFavorite = this.getDefaultFavoriteName();
    this.acceptFavoriteNames = "";
    this.validInvalidFavoritesMap = {};
    this.renameFavoriteMap = {};
    this.favoriteId = favoriteId;
}

/**
 * re-initialize the user favorites and default favorite
 */
ManageFavoritesComponent.prototype.reinitialize = function(favoriteComponent) {
    if (favoriteComponent) {
        this.favoriteComponent = favoriteComponent;
    }
    //cache the user favorites
    this.userFavorites = this.clone(this.favoriteComponent.userFavorites);
    //cache the shared favorites
    this.sharedFavorites = this.clone(this.favoriteComponent.sharedFavorites);

    this.validateFavorites();
    //cache the default favorite from favorite....
    this.savedDefaultFavorite = this.getDefaultFavoriteName();
};

ManageFavoritesComponent.prototype.validateFavorites = function(favoriteComponent) {
    var userFavorites = this.userFavorites;
    if (userFavorites != undefined) {
        for (i = 0; i < userFavorites.length; i++) {
            if ((userFavorites[i]) == undefined || ((userFavorites[i]) != undefined && (userFavorites[i]).name == undefined)) {
                userFavorites.splice(i, 1);
            }
        }
        this.userFavorites = userFavorites;
    }

    var sharedFavorites = this.sharedFavorites;
    if (sharedFavorites != undefined) {
        for (i = 0; i < sharedFavorites.length; i++) {
            if ((sharedFavorites[i]) == undefined || ((sharedFavorites[i]) != undefined && (sharedFavorites[i]).name == undefined)) {
                sharedFavorites.splice(i, 1);
            }
        }
        this.sharedFavorites = sharedFavorites;
    }
};
/**
 * populating the list controls.....
 */
ManageFavoritesComponent.prototype.populateListControls = function(favoriteComponent, isShareFavorite) {
	if(!isShareFavorite || isShareFavorite == undefined){
		this.reinitialize(favoriteComponent);
	}
    // loading user favorites.....
    this.populateListControl('manageDisplayFavoritesSelect', this.userFavorites);
    // loading shared favorites.....
    this.populateListControl('manageDisplayFavoritesSharedSelect', this.sharedFavorites);
};

/**
 * populate the list control
 * @param divId
 * @param listArray
 */
ManageFavoritesComponent.prototype.populateListControl = function(divId, listArray) {
    var listControl = $("#" + divId);
    if (listControl) {
        listControl.empty();

        if (listArray) {
            var option;
            var favoriteLabel;
            var defaultClass;
            var keys = Object.keys(listArray);
            for (var i = 0; i < keys.length; i++) {
                favoriteLabel = listArray[keys[i]].name;
                if (favoriteLabel != undefined) {
                    if (favoriteLabel == this.getDefaultFavoriteName()) {
                        favoriteLabel = favoriteLabel + DEFAULT_STRING;
                        defaultClass = 'default-favorite';
                    }else{
                    	defaultClass = EMPTY_STRING;
                    }
                    option = '<option value=' + i + ' class ="'+ defaultClass +'" style = "padding-left:25px" title="'+favoriteLabel +'">' + favoriteLabel + '</option>';
                    listControl.append(option);
                }
            }
        }
    }
};

/**
 * event to save all the operations...
 */
ManageFavoritesComponent.prototype.save = function(isManageShareFavorite) {
    //save all operations... 
    this.saveAllOperations(isManageShareFavorite);
    //clear the ui & component...
    this.clear(true);

    //close the manage favorite window.....
    closeManageFavorite(this.favoriteId);
};

/**
 * saving all operations,.....
 */
ManageFavoritesComponent.prototype.saveAllOperations = function(isManageShareFavorite) {
	parent.showProgressDialog(true, "Operation in progress..." );
    var manageFavoriteComponent = this;
    var paramsMap = {};
    paramsMap.operation = "saveAll";

    //get the dashbaord id....
    if (typeof getFavoriteType == "function") {
        paramsMap.dashboardId = this.favoriteComponent.getFavoriteType();
    } else {
        paramsMap.dashboardId = this.favoriteComponent.dashboardId;
    }
    //set the default favorite name....
    paramsMap.defaultFavoriteName = this.savedDefaultFavorite;
    if (this.savedDefaultFavorite) {
        paramsMap.isDefault = true;
    } else {
        paramsMap.defaultFavoriteName = this.getDefaultFavoriteName();
        paramsMap.isDefault = false;
    }

    //get the favorite's that need  to delete....
    if (this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"]) {
        var deleteFavoriteNames = this.clone(this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"]);
        if (deleteFavoriteNames) {
            deleteFavoriteNames = deleteFavoriteNames.toString();
            if (deleteFavoriteNames.indexOf(DEFAULT_STRING) >= 0) {
                deleteFavoriteNames = deleteFavoriteNames.replace(DEFAULT_STRING, "");
            }
            paramsMap.deletedFavoriteNames = deleteFavoriteNames;
            paramsMap.isShare = false;
        }
    }
    
    //get the favorite's that need  to delete....
    if (this.savedDeleteFavoriteMap["manageDisplayFavoritesSharedSelect"]) {
        var deleteSharedFavoriteNames = this.clone(this.savedDeleteFavoriteMap["manageDisplayFavoritesSharedSelect"]);
        if (deleteSharedFavoriteNames != undefined) {
        	deleteSharedFavoriteNames  = deleteSharedFavoriteNames .toString();
            if (deleteSharedFavoriteNames .indexOf(DEFAULT_STRING) >= 0) {
            	deleteSharedFavoriteNames  = deleteSharedFavoriteNames .replace(DEFAULT_STRING, "");
            }
            paramsMap.deleteSharedFavoriteNames  = deleteSharedFavoriteNames ;
            paramsMap.isDeleteSharedFavorite = true;
        }
    }
    
    if (this.validInvalidFavoritesMap != undefined &&
            (this.validInvalidFavoritesMap["validFavoritesStr"] != "" || 
             this.validInvalidFavoritesMap["invalidFavoritesStr"] != ""))  {
       paramsMap.acceptFavoriteNames = this.acceptFavoriteNames;
       paramsMap.newName = "";
       paramsMap.renameFavoriteMap = JSON.stringify(this.renameFavoriteMap);
   }
    
   /* if (this.validInvalidFavoritesMap != null && this.validInvalidFavoritesMap != undefined && this.validInvalidFavoritesMap["invalidFavoritesStr"] != undefined) {
        parent.getFavoriteComponent(this.favoriteId).showMoveSharedFavoritesWindow(this.validInvalidFavoritesMap["invalidFavoritesStr"]);
    }*/
    
    //get the favorite order.......
    paramsMap.favoriteOrder = this.getFavoriteOrder("manageDisplayFavoritesSelect");

    parent.callService({
        url: FAVORITE_DATA_URL,
        paramsMap: paramsMap,
        successCallback: function(response, io) {
            //once ...favorite operations are successfully....then retrieve all the favorites.....
            manageFavoriteComponent.favoriteComponent.retrieveAllFavorites(false, manageFavoriteComponent);
            manageFavoriteComponent.validInvalidFavoritesMap = null;
        },
        failureCallback: this.onServiceRequestFailure,
        showProgressWindow: false
    });

};

/**
 * method to set or clear the favorite.....
 * @param isDefault
 */
ManageFavoritesComponent.prototype.setAsDefaultOrClear = function(isDefault) {
    // save the state of the favorites..before any modifications....
    if (this.savedFavoritesByOrder == null || this.savedFavoritesByOrder == undefined) {
        this.savedFavoritesByOrder = this.clone(this.favoriteComponent.userFavorites);
    }
    if (!this.savedDefaultFavorite) {
        this.savedDefaultFavorite = this.getDefaultFavoriteName();
    }
    //get the selected favorite item label....
    var selectedItemLabel = this.getSelectedListItemLabel("manageDisplayFavoritesSelect");

    if (isDefault) { //it's a default favorite.... 
        //update the listbox with the favorite as DEFAULT_STRING as label name...
        this.resetListBox(selectedItemLabel, "manageDisplayFavoritesSelect");
        //cache the favorite as default favorite.... 
        this.savedDefaultFavorite = selectedItemLabel;
        //update the list box with the default label string...
        this.setSelectedListItemLabel("manageDisplayFavoritesSelect", selectedItemLabel + DEFAULT_STRING, isDefault);
    } else {
        //clear the favorite....
        if (selectedItemLabel.indexOf(DEFAULT_STRING) >= 0) { //remove the label (DEFAULT_STRING) from list box ....
            if (this.savedDefaultFavorite == selectedItemLabel.substring(0, selectedItemLabel.indexOf(DEFAULT_STRING))) { //mark the flag as true
                this.savedDefaultFavorite = null;
            }
            //update the ui ...
            this.setSelectedListItemLabel("manageDisplayFavoritesSelect", selectedItemLabel.substring(0, selectedItemLabel.indexOf(DEFAULT_STRING)));
        }
    }
    //reset the ui / component...
    this.resetUI();
    manageDisplayFavoritesSave.disabled = false;
};

/**
 * move favorite...
 */
ManageFavoritesComponent.prototype.moveFavorite = function(direction) {
    //take the backup of the favorite
    if (!this.savedFavoritesByOrder) {
        this.savedFavoritesByOrder = this.clone(this.favoriteComponent.userFavorites);
    }

    var listControl = $("#manageDisplayFavoritesSelect");
    var selectedItem = listControl[0].selectedIndex;
    var userFavorites = this.userFavorites;
    listControl.empty();
    if (direction == "up") {
        for (var i = 0; i < userFavorites.length; i++) {
            if (i == selectedItem & i != 0) {
                var temp = userFavorites[i - 1];
                userFavorites[i - 1] = userFavorites[i];
                userFavorites[i] = temp;
            }
        }

        var optionLabelName;
        var defaultClass;
        for (i = 0; i < userFavorites.length; i++) {
            if ((userFavorites[i]).name == this.savedDefaultFavorite) {
                optionLabelName = this.savedDefaultFavorite + DEFAULT_STRING;
                defaultClass = 'default-favorite';
            } else {
                optionLabelName = (userFavorites[i]).name;
                defaultClass = EMPTY_STRING;
            }
            var option = '<option value=' + i + ' class ="'+ defaultClass +'" style = "padding-left:25px" title="'+optionLabelName +'">' + optionLabelName + '</option>';
            listControl.append(option);
        }
        //fix #398
       	listControl[0].children[selectedItem - 1].selected = true;
        var hiddenOptions=-1;;
        if($(listControl[0]).scrollTop() != null && $(listControl[0]).scrollTop() > 0){
        	hiddenOptions=($(listControl[0]).scrollTop())/16;
        }
        if(selectedItem <= hiddenOptions){
        	$(listControl[0]).scrollTop($(listControl[0]).scrollTop() - 20);
        }
    } else if (direction == "down") {

        for (i = 0; i < userFavorites.length - 1; i++) {
            if (i == selectedItem & i != userFavorites.length) {
                var temp = userFavorites[i + 1];
                userFavorites[i + 1] = userFavorites[i];
                userFavorites[i] = temp;
            }
        }
        var optionLabelName;
        var defaultClass;
        for (i = 0; i < userFavorites.length; i++) {
            if ((userFavorites[i]).name == this.savedDefaultFavorite) {
                optionLabelName = this.savedDefaultFavorite + DEFAULT_STRING;
                defaultClass = 'default-favorite';
            } else {
                optionLabelName = (userFavorites[i]).name;
                defaultClass = EMPTY_STRING;
            }
            var option = '<option value=' + i + ' class ="'+ defaultClass +'" style = "padding-left:25px"  title="'+optionLabelName +'">' + optionLabelName + '</option>';
            listControl.append(option);
        }
        //fix #398
        (selectedItem + 1 != listControl[0].children.length - 1) ? listControl[0].children[selectedItem + 1].selected = true : listControl[0].children[listControl[0].children.length - 1].selected = true;
        var hiddenOptions=-1;;
        if($(listControl[0]).scrollTop() != null && $(listControl[0]).scrollTop() > 0){
        	hiddenOptions=($(listControl[0]).scrollTop())/16;
        }
        if(selectedItem >= (hiddenOptions + 14)){
        	$(listControl[0]).scrollTop($(listControl[0]).scrollTop() + 23);
        }

    }
    enableDisplayFavoritesBtns("manageDisplayFavoritesSelect",this.favoriteId);
    manageDisplayFavoritesSave.disabled = false;
    this.userFavorites = userFavorites;
};

/**
 * update the list box / ui control order...
 * @param listBoxId
 */
ManageFavoritesComponent.prototype.acceptSharedFavorites = function(listBoxId) {
    this.validInvalidFavoritesMap = validateFavoriteToBeAccepted(obtainSelectedFavoritesNamesAsArray(listBoxId), this.userFavorites,this.favoriteId);
    if (this.validInvalidFavoritesMap["validFavoritesStr"] != "") {
        this.updateFavoritesOnAccept(this.validInvalidFavoritesMap["validFavoritesArray"], "",this.favoriteId);
        if(this.validInvalidFavoritesMap["validFavoritesStr"].indexOf(DEFAULT_STRING) >= 0){
        	this.acceptFavoriteNames += this.validInvalidFavoritesMap["validFavoritesStr"].substring(0, this.validInvalidFavoritesMap["validFavoritesStr"].indexOf(DEFAULT_STRING))+",";
        }else {
        	this.acceptFavoriteNames += this.validInvalidFavoritesMap["validFavoritesStr"]+",";
        }
        
    }
    if (this.validInvalidFavoritesMap["invalidFavoritesStr"] != undefined && this.validInvalidFavoritesMap["invalidFavoritesStr"] != "") {
        parent.getFavoriteComponent(this.favoriteId).showMoveSharedFavoritesWindow(this.validInvalidFavoritesMap["invalidFavoritesStr"], this);
    }
    
    // enable OK button
    manageDisplayFavoritesSave.disabled = false;
    $('#manageDisplayFavoritesSelect').trigger("onchange");
/*if (validInvalidFavoritesMap["validFavoritesStr"] != "") {
        parent.getFavoriteComponent(this.favoriteId).acceptSharedFavorite(validInvalidFavoritesMap["validFavoritesStr"], "");
        updateFavoritesonAccept(validInvalidFavoritesMap["validFavoritesArray"], "");
    }
    if (validInvalidFavoritesMap["invalidFavoritesStr"] != "") {
        parent.getFavoriteComponent(this.favoriteId).showMoveSharedFavoritesWindow(validInvalidFavoritesMap["invalidFavoritesStr"]);
    }*/

};


ManageFavoritesComponent.prototype.updateFavoritesOnAccept = function() {
    if (this.savedFavoritesByOrder == null || this.savedFavoritesByOrder == undefined) {
        this.savedFavoritesByOrder = this.clone(this.favoriteComponent.userFavorites);
    }

    if (this.validInvalidFavoritesMap != undefined) {
        var validFavorites = this.validInvalidFavoritesMap["validFavoritesArray"];
        var invalidFavorites = this.validInvalidFavoritesMap["invalidFavoritesArray"];
        this.updateListBoxes(validFavorites, invalidFavorites);
    }
};

ManageFavoritesComponent.prototype.updateListBoxes = function(validFavorites, invalidFavorites) {
    if (validFavorites != undefined) {
    	var favoriteObject;
    	for(var i=0;i<validFavorites.length; i++){
    		favoriteObject = getFavoriteObject(this.sharedFavorites, validFavorites[i]);
    		if(favoriteObject != null && favoriteObject!= undefined){
    			if(this.userFavorites == undefined){
    				this.userFavorites = [];
    			}
    			this.userFavorites.push(favoriteObject);
    			var selectedIndex = getIndex(this.sharedFavorites, validFavorites[i]);
                this.sharedFavorites.splice(selectedIndex, 1);
    		}
    	}
    	this.populateListControls(null, true);
    }

    if (invalidFavorites != undefined) {

    }
};

ManageFavoritesComponent.prototype.renameInvalidFavorite = function(favoriteName, renameTo){
	this.renameFavoriteMap[favoriteName] = renameTo;
	this.acceptFavoriteNames += favoriteName+",";
	var favoriteObject = getFavoriteObject(this.sharedFavorites, favoriteName);
	
	if(favoriteObject != undefined){
		favoriteObject =  this.deepclone(favoriteObject);
		favoriteObject.name = renameTo;
		favoriteObject.actualName = favoriteName;
		if(this.userFavorites == undefined){
			this.userFavorites  = [];
		}
		this.userFavorites.push(favoriteObject);
        var value = getIndex(this.sharedFavorites, favoriteName);
        this.sharedFavorites.splice(value, 1);
	}
	this.populateListControls(null, true);
};

/**
 * update the list box / ui control order...
 * @param listBoxId
 */
ManageFavoritesComponent.prototype.updateFavoriteOrder = function(listBoxId) {
    var listControl = $("#" + listBoxId);
    var favoriteNames = "";
    var favoriteName;
    for (var i = 0; i < listControl[0].children.length; i++) {
        favoriteName = getSelectedItemLabel(listControl[0].children[i]);
        if (favoriteName.indexOf(DEFAULT_STRING) >= 0) {
            favoriteName = favoriteName.substring(0, favoriteName.indexOf(DEFAULT_STRING));
        }
        favoriteNames += favoriteName + ",";
    }
    this.favoriteComponent.updateFavoriteOrder(favoriteNames, this);

};

/**
 *  get the favorite order......
 * @param listBoxId
 * @returns {String}
 */
ManageFavoritesComponent.prototype.getFavoriteOrder = function(listBoxId) {
    var listControl = $("#" + listBoxId);
    var favoriteNames = "";
    var favoriteName;
    for (var i = 0; i < listControl[0].children.length; i++) {
        favoriteName = getSelectedItemLabel(listControl[0].children[i]);
        if (favoriteName.indexOf(DEFAULT_STRING) >= 0) {
            favoriteName = favoriteName.substring(0, favoriteName.indexOf(DEFAULT_STRING));
        }
        favoriteNames += favoriteName + ",";
    }
    return favoriteNames;

};


/**
 * delete favorite and cache the favorites.... that are need to be deleted....
 */
ManageFavoritesComponent.prototype.deleteFavorite = function() {
    if (!this.savedFavoritesByOrder) {
        this.savedFavoritesByOrder = this.clone(this.favoriteComponent.userFavorites);
    }

    var selectedFavoriteList = "";
    var selectedSharedFavoriteList = "";
    var selectedFavoritesArray;
    var selectedSharedFavoritesArray;
    selectedFavoriteList = obtainSelectedFavoritesNamesAsString('manageDisplayFavoritesSelect');
    selectedSharedFavoriteList = obtainSelectedFavoritesNamesAsString('manageDisplayFavoritesSharedSelect');

    if (selectedFavoriteList != "") {
        selectedFavoritesArray = new Array();
        selectedFavoritesArray = obtainSelectedFavoritesNamesAsArray('manageDisplayFavoritesSelect');
    }

    var selectedDeleteList;
    if (!this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"] && selectedFavoritesArray != undefined) {
        this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"] = this.clone(selectedFavoritesArray);
    } else {
        selectedDeleteList = this.clone(selectedFavoritesArray);
        var tempDeleteList = this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"];
        if(tempDeleteList != undefined){
        	this.mergeDeleteList(tempDeleteList, selectedDeleteList);
        }
        //this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"] = tempDeleteList;
    }
    if (this.hasDefaultFavorite(selectedFavoritesArray)) {
        this.savedDefaultFavorite = null;
    }

    if (selectedFavoritesArray != "" && selectedFavoritesArray != undefined) {
        //perform the delete operation and update the list box with the selected favorites (not persisted to DB)
        this.updateSelectedFavoritesListBox(selectedFavoritesArray, 'manageDisplayFavoritesSelect');
        //perform delete operation and updating the user favorites that are cached in the favorite component... (not persisted to DB)
        this.updateUserFavorites(selectedFavoritesArray, 'manageDisplayFavoritesSelect');
    }
    if (selectedSharedFavoriteList != "" && selectedSharedFavoriteList != undefined) {
        selectedSharedFavoritesArray = new Array();
        selectedSharedFavoritesArray = obtainSelectedFavoritesNamesAsArray('manageDisplayFavoritesSharedSelect');
        var selectedSharedDeleteList;
        if (!this.savedDeleteFavoriteMap["manageDisplayFavoritesSharedSelect"]) {
            this.savedDeleteFavoriteMap["manageDisplayFavoritesSharedSelect"] = this.clone(selectedSharedFavoritesArray);
        } else {
        	selectedSharedDeleteList = this.clone(selectedSharedFavoritesArray);
            var tempDeleteSharedList = this.savedDeleteFavoriteMap["manageDisplayFavoritesSharedSelect"];
            this.mergeDeleteList(tempDeleteSharedList, selectedSharedDeleteList);
            //this.savedDeleteFavoriteMap["manageDisplayFavoritesSelect"] = tempDeleteList;
        }
        
        this.updateSelectedFavoritesListBox(selectedSharedFavoritesArray, 'manageDisplayFavoritesSharedSelect');
        this.updateUserFavorites(selectedSharedFavoritesArray, 'manageDisplayFavoritesSharedSelect');
        //parent.getFavoriteComponent(this.favoriteId).deleteFavorite(selectedSharedFavoriteList,true);	 
    }

    // enable OK button
    manageDisplayFavoritesSave.disabled = false;
    $('#manageDisplayFavoritesSelect').trigger("onchange");
};

/**
 * get the favorite name
 */
ManageFavoritesComponent.prototype.getDefaultFavoriteName = function() {
    if (this.favoriteComponent && this.favoriteComponent.defaultfavorite) {
        return this.favoriteComponent.defaultfavorite.name;
    }

    return null;
};

/**
 * checks whether the array of favorites are having default array...
 * @param favoriteNames
 * @returns {Boolean}
 */
ManageFavoritesComponent.prototype.hasDefaultFavorite = function(favoriteNames) {
    var listControl = $("#manageDisplayFavoritesSelect");
    var favoriteName;
    if(listControl[0].children.length > 0){
    	for (var i = 0; i < listControl[0].children.length; i++) {
            if (listControl[0].children[i].selected) {
            	favoriteName  = getSelectedItemLabel(listControl[0].children[i]);
            	if (favoriteNames && favoriteNames instanceof Array) {
                    for (var j = 0; j < favoriteNames.length; j++) {
                    	if(favoriteName.indexOf(DEFAULT_STRING ) > -1 &&  favoriteName.substring(0, favoriteName.indexOf(DEFAULT_STRING )) == favoriteNames[j]){
                    		favoriteNames[j] = favoriteNames[j]+ DEFAULT_STRING;
                    		return true;
                    	}
                    }
                }
            }
        }
    }
    
    return false;
};

/**
 * returns whetehr the favorite is a default favorite....or not...
 * @param favoriteName
 * @returns {Boolean}
 */
ManageFavoritesComponent.prototype.isDefaultFavorite = function(favoriteName) {
    if (favoriteName) {
        return favoriteName.indexOf(DEFAULT_STRING) >= 0;
    }
    return false;
};


ManageFavoritesComponent.prototype.updateSelectedFavoritesListBox = function(selectedFavoritesArray, listBoxId) {
    //get the list control.... 
    var listControl = $("#" + listBoxId);
    //iterate over all th children in list box
    for (var i = 0; i < listControl[0].children.length; i++) {
        //remove the selected favorite from the available list of favorites in list box....... 
        for (var j = 0; j < selectedFavoritesArray.length; j++) {
            //remove the favorite from UI
            if (getSelectedItemLabel(listControl[0].children[i]) == selectedFavoritesArray[j]) listControl[0].remove(i);
        }
    }
};

ManageFavoritesComponent.prototype.updateUserFavorites = function(selectedFavoritesArray, listBoxId) {
    var userFavorite;
    if (listBoxId == "manageDisplayFavoritesSharedSelect") {
        userFavorite = this.sharedFavorites;
    } else {
        userFavorite = this.userFavorites;
    }
    if (userFavorite == null || userFavorite == undefined) {
        return;
    }
    var favoriteName;
    for (var i = 0; i < userFavorite.length; i++) {
        for (var j = 0; j < selectedFavoritesArray.length; j++) {
            favoriteName = (selectedFavoritesArray[j]);
            if (favoriteName.indexOf(DEFAULT_STRING) >= 0) {
                favoriteName = favoriteName.substring(0, favoriteName.indexOf(DEFAULT_STRING));
            }

            if (userFavorite[i].name == favoriteName) {
                var value = getIndex(userFavorite, userFavorite[i].name);
                userFavorite.splice(value, 1);
            }
        }
    }
    if (listBoxId == "manageDisplayFavoritesSharedSelect") {
        this.sharedFavorites = userFavorite;
    } else {
        this.userFavorites = userFavorite;
    }
};

ManageFavoritesComponent.prototype.resetListBox = function(selectedItemLabel, listBoxId) {
    //get the list control.... 
    var listControl = $("#" + listBoxId);
    //iterate over all th children in list box
    for (var i = 0; i < listControl[0].children.length; i++) {
        var listBoxFavoriteName = getSelectedItemLabel(listControl[0].children[i]);
        //remove the favorite from UI
        if (listBoxFavoriteName != selectedItemLabel && listBoxFavoriteName.indexOf(DEFAULT_STRING) >= 0) {
            listControl[0].children[i].innerText = listBoxFavoriteName.substring(0, listBoxFavoriteName.indexOf(DEFAULT_STRING));
            listControl[0].children[i].className = EMPTY_STRING;
        }
    }

};

ManageFavoritesComponent.prototype.getSelectedListItem = function(listBoxId) {
    var listControl = $("#" + listBoxId);
    var selectFavoriteIndex = listControl[0].selectedIndex;
    if (selectFavoriteIndex >= 0) {
        return listControl[0].children[selectFavoriteIndex];
    }
    return null;
};

ManageFavoritesComponent.prototype.getSelectedListItemLabel = function(listBoxId) {
    var listItem = this.getSelectedListItem(listBoxId);
    if (listItem) {
    	return getSelectedItemLabel(listItem);
    }

    return null;
};

ManageFavoritesComponent.prototype.setSelectedListItemLabel = function(listBoxId, labelName, isDefault) {
    var listItem = this.getSelectedListItem(listBoxId);
    if (listItem) {
        listItem.innerText = labelName;
    }
    if(isDefault){
    	listItem.className = "default-favorite";
    }else{
    	listItem.className = EMPTY_STRING;
    }
};

/**
 * close the window and cancel the operation
 */
ManageFavoritesComponent.prototype.cancel = function() {
    if (this.savedFavoritesByOrder) {
        this.reinitialize();
        this.restoreListControl("manageDisplayFavoritesSelect", this.savedFavoritesByOrder);
        this.clear(false);
    }
    this.savedDeleteFavoriteMap = {};
    this.resetUI();    
};

ManageFavoritesComponent.prototype.close = function() {
	closeFavoriteWindow();
};

/**
 * populate the list control
 * @param divId
 * @param listArray
 */
ManageFavoritesComponent.prototype.restoreListControl = function(divId, listArray) {
    var listControl = $("#" + divId);
    if (listControl) {
        listControl.empty();

        if (listArray) {
            var option;
            var favoriteLabel;
            var defaultClass;
            var keys = Object.keys(listArray);
            for (var i = 0; i < keys.length; i++) {
                favoriteLabel = listArray[keys[i]].name;
                if (favoriteLabel == this.getDefaultFavoriteName()) {
                    favoriteLabel = favoriteLabel + DEFAULT_STRING;
                    defaultClass = 'default-favorite';
	            }else{
	            	defaultClass = EMPTY_STRING;
	            }
                option = '<option value=' + i + ' class ="'+ defaultClass +'" style = "padding-left:25px"  title="'+favoriteLabel +'">' + favoriteLabel + '</option>';
                listControl.append(option);
            }
        }
    }
};

/**
 * close the window and cancel the operation
 */
ManageFavoritesComponent.prototype.clear = function(isSaveOperation) {
    this.savedFavoritesByOrder = null;
    if (!isSaveOperation) {
        this.savedDefaultFavorite = this.getDefaultFavoriteName();
        this.validInvalidFavoritesMap = null;
        this.acceptFavoriteNames = "";
        this.renameFavoriteMap = {};
    }

    this.savedDeleteFavoriteMap = {};
};

/**
 * close the window and cancel the operation
 */
ManageFavoritesComponent.prototype.resetUI = function() {
    // disable the button once the operation is completed.....
    $("#manageDisplayFavoritesSave").attr("disabled", "disabled");
    $('#manageDisplayFavoritesSelect').children().removeAttr('selected');
    $('#manageDisplayFavoritesSelect').trigger("onchange");
};

ManageFavoritesComponent.prototype.favoritesRetrieved = function() {
   this.close();
   parent.showProgressDialog(false);
};

/**
 * clones an object
 * @param object
 * @returns
 */
ManageFavoritesComponent.prototype.clone = function(object) {
    if (object) {
        return $.map(object, function(val, key) {
            return val;
        });
    }
    return null;
};

ManageFavoritesComponent.prototype.deepclone = function(object) {
    if (object) {
    	 return $.extend(true, {}, object);
    }
    return null;
};

ManageFavoritesComponent.prototype.mergeDeleteList = function(array1, array2) {
    return $.merge(array1, array2);
};