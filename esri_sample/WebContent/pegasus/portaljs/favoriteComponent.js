var FAVORITE_MENU_LABEL_CREATE = "Add to Favorites...";
var FAVORITE_MENU_LABEL_MANAGE = "Manage...";
var FAVORITE_MENU_LABEL_RESET="Clear Favorite";
var FAVORITE_MENU_LABEL_SAVE = "Update";
var WINDOW_TITLE_CREATE_FAVORITE = "Add ";
var WINDOW_TITLE_MANAGE_FAVORITE = "Manage ";
var WINDOW_TITLE_SHARE_FAVORITE = "Share ";
var WINDOW_TITLE_CONF_FAVORITE = "Confirmation Message";
var WINDOW_TITLE_UPDATE_FAVORITE = "Update Favorite";
var WINDOW_TITLE_SAVE_FAVORITE = "Add Favorite";
var WINDOW_FAVORITE = " Favorites";
var WINDOW_TITLE_MOVE_SHARED_FAVORITE = "Move shared favorites to my favorites";
var PROGRESS_DIALOG_APPLY_FAVORITE = "Loading favorite data...";

var FAVORITE_DATA_URL = "dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.FavoriteDataRenderer";

var OPERATION_TYPE_ADD_FAVORITE = "addFavorite";
var OPERATION_TYPE_RETRIEVE_ALL_FAVORITES = "retrieveFavorites";
var OPERATION_TYPE_APPLY_FAVORITE = "applyFavorite";
var OPERATION_TYPE_UPDATE_FAVORITE = "updateFavorite";
var OPERATION_TYPE_DELETE_FAVORITE = "deleteFavorites";
var OPERATION_TYPE_SHARE_FAVORITE = "shareFavorite";
var OPERATION_TYPE_VALIDATE_FAVORITE = "validateFavorite";
var OPERATION_TYPE_SET_DEFAULT_FAVORITE = "defaultFavorite";
var OPERATION_TYPE_ACCEPT_SHARED_FAVORITE = "acceptFavorite";
var OPERATION_TYPE_LOAD_DEFAULT_FAVORITE = "loadDefaultFavorite";
var OPERATION_TYPE_UPDATE_FAVORITE_ORDER = "updateFavoriteOrder";
 
function FavoriteComponent(dashboardId, favoritesDiv,dashboardTitle,favoriteWindowsParentDiv, serverContext, isInParentContainer, isAdvancedQueryFavorite) {
	this.dashboardId = dashboardId;
	if(!favoritesDiv) {
		favoritesDiv = "favoritesDiv";
	}
	if(!favoriteWindowsParentDiv) {
		favoriteWindowsParentDiv = "favoriteWindowsParentDiv";
	}
	if(serverContext == undefined) {
		serverContext = "";
	}
	if(isInParentContainer == undefined) {
		isInParentContainer = true;
	}
	
	this.serverContext = serverContext;
	this.favoritesDiv = favoritesDiv;
	this.isInParentContainer = isInParentContainer;
	this.favoriteWindowsParentDiv = favoriteWindowsParentDiv;
	this.favoritesDatasource =  [{ text:"", spriteCssClass:"k-icon icon-favorites",
									items: [
									    { text: FAVORITE_MENU_LABEL_CREATE},    
									    { text: FAVORITE_MENU_LABEL_SAVE},   
										{ text: FAVORITE_MENU_LABEL_MANAGE},
										{ text: FAVORITE_MENU_LABEL_RESET, cssClass:"menu-separator-bottom"},
									]
								}];
	this.userFavorites;
	this.sharedFavorites; //to the user
	this.maxOrderId;
	this.favoritesMenu;
	this.createFavoriteWindow;
	this.shareFavoriteWindow;
	this.manageFavoriteWindow;
	this.manageFavoritesShareWindow;
	this.moveSharedFavoritesWindow;
	this.confirmationMessageWindow;
	this.defaultfavorite;
	this.dashboardTitle =dashboardTitle+WINDOW_FAVORITE;
	this.isFavoriteApplied=false;
	this.selectedFavoriteItem;
	this.tooltip;
	this.isAdvancedQueryFavorite = isAdvancedQueryFavorite == undefined? true :isAdvancedQueryFavorite;
}

FavoriteComponent.prototype.isDefaultFavoriteAvailable = function() {
	return (this.defaultfavorite != undefined);
};

FavoriteComponent.prototype.createOrRefreshMenu = function() {
	var favoriteComponent = this;
	if(favoriteComponent == null){
		favoriteComponent = this;
	}
	var favoriteDivObj;
	if(favoriteComponent.isInParentContainer) {
		favoriteDivObj = parent.$("#"+favoriteComponent.favoritesDiv);
	} else {
		favoriteDivObj = $("#"+favoriteComponent.favoritesDiv);
	}
	if(!this.favoritesMenu) {
		this.favoritesMenu = favoriteDivObj.kendoMenu({
			dataSource: this.favoritesDatasource,
			openOnClick: true,
			closeOnClick: true,
			open: function(e) {
				if(favoriteComponent.isInParentContainer) {
					parent.enableDragging(parent.DASHBOARD_ID_QUERY, false);
				}
				if((favoriteComponent.dashboardId).indexOf('queryWindowDiv') >= 0){
					parent.dashboardController.getDashboard('queryWindowDiv').data("kendoWindow").wrapper.find(".window-header").removeClass("addOverflowStyle");
				}else if((favoriteComponent.dashboardId) != 'Application' && (favoriteComponent.dashboardId).indexOf('SQW_') < 0){
					parent.dashboardController.getDashboard(favoriteComponent.dashboardId).data("kendoWindow").wrapper.find(".window-header").removeClass("addOverflowStyle");
				}
				
				setTimeout(function(){
					favoriteComponent.favoritesMenu.find('.k-popup').scrollTop('0');
					favoriteComponent.resizeMenu(favoriteComponent);
				}, 50);
				
				favoriteComponent.tooltip = favoriteComponent.favoritesMenu.attr("title");
				favoriteComponent.favoritesMenu.attr("title", "");
			},
			close: function(e) {
				if(favoriteComponent.isInParentContainer) {
					parent.enableDragging(parent.DASHBOARD_ID_QUERY, true);
				}
				if((favoriteComponent.dashboardId).indexOf('queryWindowDiv') >= 0){
					parent.dashboardController.getDashboard('queryWindowDiv').data("kendoWindow").wrapper.find(".window-header").addClass("addOverflowStyle");
				}else if((favoriteComponent.dashboardId) != 'Application' && (favoriteComponent.dashboardId).indexOf('SQW_') < 0){
					parent.dashboardController.getDashboard(favoriteComponent.dashboardId).data("kendoWindow").wrapper.find(".window-header").addClass("addOverflowStyle");
				}
				favoriteComponent.favoritesMenu.attr("title", favoriteComponent.tooltip);
			},
			select:function(e) {
				favoriteComponent.selectedFavoriteItem = $(e.item);
				var selectedMenuText = $(e.item).children(".k-link").text();
				if(selectedMenuText == FAVORITE_MENU_LABEL_CREATE) {
					favoriteComponent.showCreateFavoriteWindow();
				} else if(selectedMenuText == FAVORITE_MENU_LABEL_MANAGE){
//					favoriteComponent.showManageFavoriteWindow();
					favoriteComponent.showManageShareFavoriteWindow();
				}else if(selectedMenuText == FAVORITE_MENU_LABEL_SAVE){
				    var selectedFavoriteName = EMPTY_STRING;
				    if(this.element.find(".k-state-selected")[0] != null){
					  selectedFavoriteName =  this.element.find(".k-state-selected")[0].innerText;
					}
					if(selectedFavoriteName != ""){
						if(selectedFavoriteName.indexOf(DEFAULT_STRING)!= -1){
							selectedFavoriteName = selectedFavoriteName.slice(0,selectedFavoriteName.indexOf(DEFAULT_STRING));
						}
						favoriteComponent.updateFavorite(selectedFavoriteName);
					}else{
						favoriteComponent.showCreateFavoriteWindow();
					} 
				}/*else if(selectedMenuText.indexOf(" shared favorites ...")!= -1){
					favoriteComponent.showManageShareFavoriteWindow();
				}*/else if(selectedMenuText == FAVORITE_MENU_LABEL_RESET){
					this.element.find(".k-state-selected").removeClass('k-state-selected');
					favoriteComponent.favoritesMenu.removeClass("n-icon-active");
					favoriteComponent.resetDashboard();
				}else if(selectedMenuText != ""){
				    this.element.find(".k-state-selected").removeClass('k-state-selected');
					$(e.item).addClass('k-state-selected');
					favoriteComponent.favoritesMenu.addClass("n-icon-active");
					if(selectedMenuText.indexOf(DEFAULT_STRING)!= -1){
						selectedMenuText = selectedMenuText.slice(0,selectedMenuText.indexOf(DEFAULT_STRING));
					}
					selectedMenuText=jQuery.trim(selectedMenuText);// Make sure leading/trailing whitespace is removed (IE can't handle it)
					favoriteComponent.applyFavorite(selectedMenuText);
				}
			}
		});
		favoriteDivObj.mouseleave(function(e){
			favoriteDivObj.data("kendoMenu").trigger("close");
			if(favoriteDivObj[0].id == "applicationFavoritesMenu") {
				favoriteDivObj.data("kendoMenu").close();
			}
			favoriteDivObj.data("kendoMenu").clicked = false;
		});
	} else {
		if(this.favoritesMenu.data("kendoMenu") != undefined){
			this.favoritesMenu.data("kendoMenu").setOptions({dataSource: this.favoritesDatasource});
		}	
	}
	if(this.favoritesMenu.find(".k-state-selected") != null && this.favoritesMenu.find(".k-state-selected").length > 0) {
		this.favoritesMenu.addClass("n-icon-active");
	}else {
		this.favoritesMenu.removeClass("n-icon-active");
	}
	addMenuTooltips(this.favoritesMenu);
};

FavoriteComponent.prototype.resizeMenu = function(favoriteComponent) {
	var parentHeight = favoriteComponent.favoritesMenu.parent().parent().parent().parent().find("div.k-window-content").height();
	var menuItemsHeight = 1;
	favoriteComponent.favoritesMenu.find("ul.k-group.k-popup").find("li.k-item").each(function(i){
		menuItemsHeight = menuItemsHeight + $(this).height() + 3;
	});
	if(parentHeight && menuItemsHeight) {
		if(parentHeight > 270 && menuItemsHeight > 270) {
			favoriteComponent.favoritesMenu.find("ul.k-group.k-popup").height(270);
		}else if(parentHeight > menuItemsHeight && menuItemsHeight < 270) {
			favoriteComponent.favoritesMenu.find("ul.k-group.k-popup").height(menuItemsHeight);
		}else if(parentHeight < menuItemsHeight){
			favoriteComponent.favoritesMenu.find("ul.k-group.k-popup").height(parentHeight - 5);
		}
	}
};

FavoriteComponent.prototype.getFavoriteUri = function() {
	return "&favoriteId="+this.dashboardId;
};

FavoriteComponent.prototype.showCreateFavoriteWindow = function() {
	var favoriteComponent = this;
	if(favoriteComponent ==null){
			favoriteComponent=this;
		}
	if(!favoriteComponent.createFavoriteWindow) {
		favoriteComponent.createFavoriteWindow = this.createWindow("createFavoriteDiv", "createFavorite.do?isSimpleQuery=false"+this.getFavoriteUri(), 280, 100, WINDOW_TITLE_CREATE_FAVORITE+favoriteComponent.dashboardTitle);
	}
	var kendowWindow = favoriteComponent.createFavoriteWindow.data("kendoWindow");
	setTimeout(function(){
		 try{
			 document.getElementById("createFavoriteDiv").firstChild.contentWindow.setDefaultState();
		 }catch (e) {
			console.log(e.message);
		}
		kendowWindow.center();
		kendowWindow.open();
	}, 500);
};

FavoriteComponent.prototype.showShareFavoriteWindow = function(windowId,sharedFavorite) {
	var favoriteComponent = this;
	if(!this.shareFavoriteWindow) {
		this.shareFavoriteWindow = this.createWindow("shareFavoriteDiv", "shareFavorite.do?isSimpleQuery=false"+this.getFavoriteUri(),260,230,WINDOW_TITLE_SHARE_FAVORITE+favoriteComponent.dashboardTitle);
	}
	var kendowWindow = this.shareFavoriteWindow.data("kendoWindow");
    setTimeout(function(){
    	kendowWindow.wrapper.context.firstChild.contentWindow.openSharedFavoritesWindow(windowId,sharedFavorite);
    	//document.getElementById("shareFavoriteDiv").firstChild.contentWindow.openSharedFavoritesWindow(windowId,sharedFavorite);
    	kendowWindow.center();
    	kendowWindow.open();
    }, 500);
};

FavoriteComponent.prototype.showManageFavoriteWindow = function() {
	var favoriteComponent = this;
	if(!favoriteComponent.manageFavoriteWindow) {
		favoriteComponent.manageFavoriteWindow = this.createWindow("manageFavoriteDiv", "manageFavorite.do?isSimpleQuery=false"+this.getFavoriteUri(), 300, 280,WINDOW_TITLE_MANAGE_FAVORITE+this.dashboardTitle);
	}
	var kendowWindow = this.manageFavoriteWindow.data("kendoWindow");
	
	kendowWindow.center();
	kendowWindow.open();
};

FavoriteComponent.prototype.resetDashboard = function() {
	var favoriteComponent = this;
	if((favoriteComponent.dashboardId).indexOf('SQW_') >= 0){
		if(typeof getDashboardFavoriteObject == "function") {
			getDashboardFavoriteObject(favoriteComponent.dashboardId).clearSQWFavorite();
		}	
	}else if((this.dashboardId).indexOf('queryWindowDiv') >= 0){
		(parent.getDashboardContentWindow('queryWindowDiv')).resetDashboard(null, true);
	}else{
		if(this.dashboardId=="Application"){
			clearApplicationFavorite();
		}else{
			(parent.getDashboardContentWindow(this.dashboardId)).resetDashboard(null, true);
		}	
	}
};
FavoriteComponent.prototype.showManageShareFavoriteWindow = function() {
	var favoriteComponent = this;
	if(this.isAdvancedQueryFavorite){
		if(!favoriteComponent.manageFavoritesShareWindow) {
			favoriteComponent.manageFavoritesShareWindow = this.createWindow("manageFavoriteShareDiv", "manageShareFavorite.do?isSimpleQuery=false"+this.getFavoriteUri(), 450,340, WINDOW_TITLE_MANAGE_FAVORITE+this.dashboardTitle);
		}
	}else{
		if($("#manageFavoriteShareDiv")[0] != undefined && $("#manageFavoriteShareDiv").data("kendoWindow") != undefined ){
			$("#manageFavoriteShareDiv").data("kendoWindow").destroy();
		}
		favoriteComponent.manageFavoritesShareWindow = this.createWindow("manageFavoriteShareDiv", "manageShareFavorite.do?isSimpleQuery=false"+this.getFavoriteUri(), 450,340, WINDOW_TITLE_MANAGE_FAVORITE+this.dashboardTitle);
	}
	this.retrieveAllFavorites();
	var kendowWindow = this.manageFavoritesShareWindow.data("kendoWindow");
	kendowWindow.center();
	kendowWindow.open();
};

FavoriteComponent.prototype.showMoveSharedFavoritesWindow = function(invalidFavoritesStr, sourceObject) {
	if(!this.moveSharedFavoritesWindow) {
		this.moveSharedFavoritesWindow = this.createWindow("moveSharedFavoritesDiv", "moveSharedFavorites.do?isSimpleQuery=false"+this.getFavoriteUri(), 350,120, WINDOW_TITLE_MOVE_SHARED_FAVORITE);
	}
	var kendowWindow = this.moveSharedFavoritesWindow.data("kendoWindow");
	 setTimeout(function(){
		kendowWindow.wrapper.context.firstChild.contentWindow.openMovetoMyFavoritesWindow(invalidFavoritesStr, sourceObject);
    	//document.getElementById("moveSharedFavoritesDiv").firstChild.contentWindow.openMovetoMyFavoritesWindow(invalidFavoritesStr);
    	kendowWindow.center();
    	kendowWindow.open();
    }, 1000);
};


FavoriteComponent.prototype.showConfirmationMessageWindow = function(message,operation) {
	if(!this.confirmationMessageWindow) {
		this.confirmationMessageWindow = this.createWindow("confirmationMessageDiv", "confirmationMessage.do?isSimpleQuery=false"+this.getFavoriteUri(), 320, 110, WINDOW_TITLE_CONF_FAVORITE);
	}
	var kendowWindow = this.confirmationMessageWindow.data("kendoWindow");
	 setTimeout(function(){
		 if(document.getElementById("confirmationMessageDiv").firstChild.contentWindow.hasOwnProperty("showMessage")) {
			 document.getElementById("confirmationMessageDiv").firstChild.contentWindow.showMessage(message,operation);
		 }
		 if(operation=="updateFavorite"){
			 kendowWindow.title(WINDOW_TITLE_UPDATE_FAVORITE);
		 }else if(operation=="validateFavorite"){
			 kendowWindow.title(WINDOW_TITLE_SAVE_FAVORITE);
		 }else{
			 kendowWindow.title(WINDOW_TITLE_CONF_FAVORITE);
		 }
		 kendowWindow.center();
		 kendowWindow.open();
	}, 500);
};


FavoriteComponent.prototype.closeConfirmationMessageWindow = function() {
	if(this.confirmationMessageWindow) {
		this.confirmationMessageWindow.data("kendoWindow").close();
	}
};


FavoriteComponent.prototype.closeCreateFavoriteWindow = function() {
	if(this.createFavoriteWindow) {
		this.createFavoriteWindow.data("kendoWindow").close();
	}
};

FavoriteComponent.prototype.closeShareFavoriteWindow = function() {
	if(this.shareFavoriteWindow) {
		this.shareFavoriteWindow.data("kendoWindow").close();
	}
};


FavoriteComponent.prototype.closeManageFavoriteWindow = function() {
	if(this.manageFavoriteWindow) {
		this.manageFavoriteWindow.data("kendoWindow").close();
	}
};

FavoriteComponent.prototype.closeManageShareFavoriteWindow = function() {
	if(this.manageFavoritesShareWindow) {
    	this.manageFavoritesShareWindow.data("kendoWindow").close();
		document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.setOnLoadState(this.dashboardId);
	}
};


FavoriteComponent.prototype.closeMoveSharedFavoritesWindow = function() {
	if(this.moveSharedFavoritesWindow) {
		this.moveSharedFavoritesWindow.data("kendoWindow").close();
	}
};
FavoriteComponent.prototype.createWindow = function(windowDiv, windowUrl, width, height, title) {
	var window = $('#' + windowDiv);
	var controller = this;
    
    // checking whether the div is avaialable or not...if not create one....
    if (!window.data("kendoWindow")) {
        $('#'+this.favoriteWindowsParentDiv).append('<div id="' + windowDiv + '" style="height: 100%;width: 100%; overflow: hidden;"> </div>');
        window = $('#' + windowDiv);
    }

    // creating the kendo window
    if (!window.data("kendoWindow")) {
        window.kendoWindow({
        	width: width,
            height: height,
            modal: true,
            resizable: false,
			actions: ["close"],
            title: title,
            content: windowUrl,
        	iframe: true,
        	open: function(e){
        		try{
        			if(windowDiv == "manageFavoriteShareDiv"){
        				document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.manageFavoriteWindowOpen(e, windowDiv);
        			}
        		}catch(er){
        			console.log("Error occured while calling methof manageFavoriteWindowOpen");
        		}
        		
        	}
        });
    }
    
    return window;
};

FavoriteComponent.prototype.retrieveAllFavorites = function(isOnLoad, callBackComponent) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_RETRIEVE_ALL_FAVORITES;
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onRetrieveAllFavorites(response, io, isOnLoad, favoriteComponent);
			if(callBackComponent != undefined && typeof callBackComponent.favoritesRetrieved == "function"){
				callBackComponent.favoritesRetrieved();				
			}else if(callBackComponent != undefined){
				callBackComponent();
			}
		},
		failureCallback : this.onServiceRequestFailure,
		showProgressWindow : false
	});
};

FavoriteComponent.prototype.createFavorite = function(name,usernames) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_ADD_FAVORITE;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = name;
	paramsMap.userNames = usernames;
	paramsMap.favoriteData = JSON.stringify(getFavoriteDetails(EMPTY_STRING,paramsMap.dashboardId));
	paramsMap.orderId = this.maxOrderId;
	this.maxOrderId;
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onCreateFavoriteSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});
	
};

FavoriteComponent.prototype.applyFavorite = function(name) {
	var favoriteData;
	var favoriteDataList;
	var favoriteComponent = this;
	if(favoriteComponent ==null){
			favoriteComponent=this;
		}
	if(favoriteComponent.isInParentContainer) {
		favoriteData=parent.getFavoriteDataCache();
	}else{
		favoriteData=getFavoriteDataCache();
	}
	if(favoriteData == null){
		var paramsMap = {};
		paramsMap.operation = OPERATION_TYPE_APPLY_FAVORITE;
		if(typeof getFavoriteType == "function") {
			paramsMap.dashboardId = getFavoriteType();
		} else {
			paramsMap.dashboardId = this.dashboardId; 
		}
		paramsMap.favoriteName = name;
		//progressDialogTitle : PROGRESS_DIALOG_APPLY_FAVORITE,
			
		callService({
			url: FAVORITE_DATA_URL,
			paramsMap: paramsMap,
			successCallback: function(response, io, favoriteComponent){
				favoriteComponent.onApplyFavoriteSuccess(response, io, favoriteComponent);
			},
			failureCallback : function(response, io, favoriteComponent){
				favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
			},
			showProgressWindow : false
		});	
	}else{
		favoriteDataList=favoriteData.userFavorites[favoriteComponent.dashboardId];
		for(var i=0;i<favoriteDataList.length;i++){
			if(favoriteDataList[i].name==name){
				favoriteComponent.isFavoriteApplied=true;
				applyFavoriteDetails(jQuery.parseJSON(favoriteDataList[i].favoriteData),favoriteComponent.dashboardId);
				return;
			}	
		}
	}
};


FavoriteComponent.prototype.getNoOfFavorites = function() {
	return this.favoritesDatasource[0].items.length-2;
};

FavoriteComponent.prototype.onCreateFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else {
		var favoriteComponent = favoriteComponent;
		//favoriteComponent.retrieveAllFavorites();
		if(response.favoriteName != null &&  response.favoriteName !=""){
			var errorMsg = "Favorite(s) have not been shared with "+response.favoriteName+" as these user(s) do(es) not exist. ";
			if(favoriteComponent.isInParentContainer) {
		   		parent.showFilterErrorMsg(errorMsg);
		   	} else {
		   		showFilterErrorMsg(errorMsg);
		   	}    	

		}else if(response.success){
			favoriteComponent.showConfirmationMessageWindow("",response.operation);
		}
    }		
};

FavoriteComponent.prototype.onApplyFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else {
		favoriteComponent.isFavoriteApplied=true;
		applyFavoriteDetails(response,favoriteComponent.dashboardId);
	}
};

FavoriteComponent.prototype.onRetrieveAllFavorites = function(response, io, isOnLoad, favoriteComponent) {
    if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else {		
		if(favoriteComponent ==null){
			favoriteComponent=this;
		}
		if(response.favoriteData) {
			if(favoriteComponent.isInParentContainer) {
				parent.setFavoriteDataCache(response.favoriteData);//creating favoriteData Cache
			}	
			favoriteComponent.onInitalizeFavorite(response.favoriteData, isOnLoad, favoriteComponent);
		}
		if(document.getElementById("manageFavoriteDiv"))
			setTimeout(document.getElementById("manageFavoriteDiv").firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId),500);
		if(document.getElementById("manageFavoriteShareDiv"))
				setTimeout(document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId),500);
	}   
};
FavoriteComponent.prototype.onInitalizeFavorite = function(favoriteResponceData, isOnLoad, favoriteComponent) {
		if(favoriteComponent ==null){
			favoriteComponent=this;
		}
		var favoriteData;
		if(favoriteComponent && favoriteComponent.isInParentContainer) {
			favoriteData=parent.getFavoriteDataCache();
		}else{
			favoriteData=favoriteResponceData;
		}
		if(favoriteData) {
			favoriteComponent.userFavorites = favoriteData.userFavorites[favoriteComponent.dashboardId];
			favoriteComponent.sharedFavorites = favoriteData.sharedFavorites[favoriteComponent.dashboardId];
			favoriteComponent.maxOrderId = favoriteData.maxOrderId;
			var noOfSharedFavorites = 0;
			if(favoriteComponent.sharedFavorites) {
				noOfSharedFavorites = favoriteComponent.sharedFavorites.length;
			}
			favoriteComponent.addFavorites(favoriteComponent.userFavorites, noOfSharedFavorites);
			if(favoriteData && favoriteData.defaultFavorite && favoriteData.defaultFavorite[favoriteComponent.dashboardId]) {
				favoriteComponent.defaultfavorite  = jQuery.parseJSON((favoriteData.defaultFavorite[favoriteComponent.dashboardId]).favoriteData);
				favoriteComponent.defaultfavorite.name=(favoriteData.defaultFavorite[favoriteComponent.dashboardId]).name;
			}else {
				favoriteComponent.defaultfavorite = null;
			}
			var defaultFavName = "";
			if(favoriteData && favoriteData.defaultFavorite && (favoriteData.defaultFavorite[favoriteComponent.dashboardId]) && (favoriteData.defaultFavorite[favoriteComponent.dashboardId]).name){
				if(isOnLoad == undefined){
					isOnLoad  = true;
				}
				defaultFavName = (favoriteData.defaultFavorite[favoriteComponent.dashboardId]).name;
			}
			favoriteComponent.updateDefaultMenuItem(defaultFavName,isOnLoad, favoriteComponent);
		}
};

FavoriteComponent.prototype.applyDefaultFavorite = function(isRefreshDashboard) {
	var favoriteComponent = this;
	if(favoriteComponent.defaultfavorite) {
		favoriteComponent.isFavoriteApplied=true;
		applyFavoriteDetails(favoriteComponent.defaultfavorite,favoriteComponent.dashboardId, true, false, isRefreshDashboard);
		favoriteComponent.updateDefaultMenuItem(favoriteComponent.defaultfavorite.name,true, favoriteComponent);
	}
};


FavoriteComponent.prototype.addFavorites = function(favoritesArray, noOfSharedFavorites, savedFavorite) {
	var noOfFavorites = 0;
	var selectedMenuText;
	var favoriteComponent=this;
	var items = favoriteComponent.favoritesDatasource[0].items;
	if(items.length>4){
		items.splice(4,items.length);
	}
	//if its a save operation...then set the saved favorite as selected by default....
	if(savedFavorite != undefined){
		selectedMenuText=savedFavorite;
	}
	if(favoriteComponent!=null && favoriteComponent.favoritesMenu!=null && favoriteComponent.favoritesMenu.find(".k-state-selected")!=null && favoriteComponent.favoritesMenu.find(".k-state-selected")[0] != null ){
		//as the operation is other than the save operation...
		//read the selected item from list and mark as selected ..
		//once again while rerendering the menu...
		if(selectedMenuText == undefined){
			selectedMenuText=favoriteComponent.favoritesMenu.find(".k-state-selected")[0].innerText;
		}
		
		if(selectedMenuText!=null && selectedMenuText != EMPTY_STRING){ 
			if(selectedMenuText.indexOf(DEFAULT_STRING)!= -1){
				selectedMenuText = selectedMenuText.slice(0,selectedMenuText.indexOf(DEFAULT_STRING));
			}
		}
	}
	if(favoritesArray) {
		noOfFavorites = favoritesArray.length;
		for(var i = 0; i < noOfFavorites; i++) {
			if(selectedMenuText!=null && selectedMenuText==favoritesArray[i].name){
				if(favoriteComponent.defaultfavorite != null && favoriteComponent.defaultfavorite.name != null && favoriteComponent.defaultfavorite.name==favoritesArray[i].name){
					items.push({text:favoritesArray[i].name+DEFAULT_STRING,cssClass:'k-state-selected'});	
				}else{
					items.push({text:favoritesArray[i].name,cssClass:'k-state-selected'});
				}
					
			}else{
				if(favoriteComponent.defaultfavorite != null && favoriteComponent.defaultfavorite.name != null && favoriteComponent.defaultfavorite.name==favoritesArray[i].name){
					items.push({text:favoritesArray[i].name+DEFAULT_STRING});	
				}else if(favoritesArray[i].name != undefined){
					items.push({text:favoritesArray[i].name});
				}	
			}
		}
	}
	/*if(noOfSharedFavorites > 0) {
		items.push({text: "View "+noOfSharedFavorites+" shared favorites ...", spriteCssClass:"k-icon favorites-shared", cssClass:"menu-separator-top"});
	}*/
	this.createOrRefreshMenu();		
		
};

FavoriteComponent.prototype.onServiceRequestFailure = function(response, io) {
	onServiceRequestFailure(response,io);
	favoriteComponent.closeCreateFavoriteWindow();
};


FavoriteComponent.prototype.updateFavorite = function(name) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_UPDATE_FAVORITE;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = name;
	paramsMap.favoriteData = JSON.stringify(getFavoriteDetails(EMPTY_STRING,paramsMap.dashboardId));
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){ 
			favoriteComponent.onUpdateFavoriteSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){ 
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});
	
};

FavoriteComponent.prototype.onUpdateFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else{
		if(response.success){
		    if(response && response.favoriteName != null && response.operation!= null){
		    	favoriteComponent.showConfirmationMessageWindow(response.favoriteName,response.operation);
			}
		    favoriteComponent.refreshFavoriteCache(OPT_TYPE_UPDATE,response.favoriteData, favoriteComponent);
		}	
	} 
};


FavoriteComponent.prototype.deleteFavorite = function(names,isShared) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_DELETE_FAVORITE;
	paramsMap.isShare = isShared;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = names;
	favoriteComponent.tobeDeletedFavorites=names;
    callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onDeleteFavoriteSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){ 
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});
	
};


FavoriteComponent.prototype.onDeleteFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else if(response.success){
		var noOfSharedFavorites;
		if(favoriteComponent.sharedFavorites)
			noOfSharedFavorites = favoriteComponent.sharedFavorites.length;
		favoriteComponent.addFavorites(favoriteComponent.userFavorites, noOfSharedFavorites);
		favoriteComponent.refreshFavoriteCache(OPT_TYPE_DELETE,favoriteComponent.tobeDeletedFavorites, favoriteComponent);
		favoriteComponent.tobeDeletedFavorites=EMPTY_STRING;
	}
};




FavoriteComponent.prototype.validateFavorite = function(name) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_VALIDATE_FAVORITE;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = name;
	paramsMap.userNames = "";
	paramsMap.favoriteData = JSON.stringify(getFavoriteDetails(EMPTY_STRING,paramsMap.dashboardId));
	paramsMap.orderId = this.maxOrderId;
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onValidateFavoriteSuccess(response, io, name, favoriteComponent);
		},
		failureCallback : this.onServiceRequestFailure,
		showProgressWindow : false
	});
	
};


FavoriteComponent.prototype.onValidateFavoriteSuccess = function(response, io, name, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else {
			if(response.success){
				favoriteComponent.maxOrderId;
				var noOfSharedFavorites;
				if(favoriteComponent.sharedFavorites)
					noOfSharedFavorites = favoriteComponent.sharedFavorites.length;
				if(favoriteComponent.userFavorites){
					favoriteComponent.userFavorites.splice(0, 0,(response.favoriteData[favoriteComponent.dashboardId])[0]);
				}else{
					favoriteComponent.userFavorites=[];
					favoriteComponent.userFavorites.splice(0, 0,(response.favoriteData[favoriteComponent.dashboardId])[0]);
				}
				favoriteComponent.addFavorites(favoriteComponent.userFavorites, noOfSharedFavorites,name);
				favoriteComponent.closeCreateFavoriteWindow();
				favoriteComponent.closeCreateFavoriteWindow();
				favoriteComponent.showConfirmationMessageWindow(response.favoriteName,response.operation);
				if(document.getElementById("manageFavoriteDiv"))
					setTimeout(document.getElementById("manageFavoriteDiv").firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId),500);
				if(document.getElementById("manageFavoriteShareDiv"))
						setTimeout(document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId),500);
				if(favoriteComponent.isInParentContainer){
					parent.getFavoriteDataCache().userFavorites[favoriteComponent.dashboardId]=favoriteComponent.userFavorites;
				}else{
					getFavoriteDataCache().userFavorites[favoriteComponent.dashboardId]=favoriteComponent.userFavorites;
				}
			}else{
				var errorMsg = response.favoriteName+" already Exists.Please choose another name ";
				if(favoriteComponent.isInParentContainer) {
					parent.showFilterErrorMsg(errorMsg);
				} else {
					showFilterErrorMsg(errorMsg);
				}  			
			}
	}
};


FavoriteComponent.prototype.setDefaultFavorite = function(name,isDefault) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_SET_DEFAULT_FAVORITE;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = name;
	if(isDefault!=null){
		paramsMap.isDefault=isDefault;
	}else{
		paramsMap.isDefault=true;
	}
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onDefaultFavoriteSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});
	
};


FavoriteComponent.prototype.onDefaultFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	}else {
			if(response.success && response.favoriteName){
				favoriteComponent.updateDefaultMenuItem(response.favoriteName,false, favoriteComponent);
			}
		}
};


FavoriteComponent.prototype.acceptSharedFavorite = function(originalName,newName) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_ACCEPT_SHARED_FAVORITE;
	
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteName = originalName;
	paramsMap.newName = newName;
	callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onAcceptedFavoriteSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});	
};


FavoriteComponent.prototype.onAcceptedFavoriteSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else if(response.success){
			var noOfSharedFavorites = favoriteComponent.sharedFavorites.length;
		//	favoriteComponent.userFavorites.splice(0, 0,response.favoriteName);
			favoriteComponent.addFavorites(favoriteComponent.userFavorites, noOfSharedFavorites);
			 setTimeout(function(){ 
				 $("#manageFavoriteShareDiv").data("kendoWindow").wrapper.context.firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId);
			        //document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.populateListControls();
					}, 500);
	}
};

FavoriteComponent.prototype.updateFavoriteOrder = function(names) {
	var favoriteComponent = this;
	var paramsMap = {};
	paramsMap.operation = OPERATION_TYPE_UPDATE_FAVORITE_ORDER;
	if(typeof getFavoriteType == "function") {
		paramsMap.dashboardId = getFavoriteType();
	} else {
		paramsMap.dashboardId = this.dashboardId; 
	}
	paramsMap.favoriteNames = names;
    callService({
		url: FAVORITE_DATA_URL,
		paramsMap: paramsMap,
		successCallback: function(response, io){
			favoriteComponent.onUpdateFavoriteOrderSuccess(response, io, favoriteComponent);
		},
		failureCallback : function(response, io){
			favoriteComponent.onServiceRequestFailure(response, io, favoriteComponent);
		},
		showProgressWindow : false
	});
	
};


FavoriteComponent.prototype.onUpdateFavoriteOrderSuccess = function(response, io, favoriteComponent) {
	if(response && response._errorCd && response._errorCd > 0) {
		if(favoriteComponent.isInParentContainer) {
	   		parent.showFilterErrorMsg(response._errorDesc);
	   	} else {
	   		showFilterErrorMsg(response._errorDesc);
	   	}    	
	} else if(response.success) {
			var noOfSharedFavorites = favoriteComponent.sharedFavorites?favoriteComponent.sharedFavorites.length:0;
			favoriteComponent.addFavorites(favoriteComponent.userFavorites, noOfSharedFavorites);
			 setTimeout(function(){ 
				 if(document.getElementById("manageFavoriteShareDiv")){
					 document.getElementById("manageFavoriteShareDiv").firstChild.contentWindow.populateListControls(favoriteComponent.dashboardId);
				 }
			}, 500);
//		refreshFavoriteCache(OPT_TYPE_UPDATE,response.favoriteData);
	}
};


FavoriteComponent.prototype.updateDefaultMenuItem =function(defaultFavorite,onload, favoriteComponent){
       var items = favoriteComponent.favoritesDatasource[0].items;
			 if(onload){
				for(i=0;i<items.length;i++){
					if(items[i].text  == undefined){
						items.splice(i, 1);
					}
					 if(items[i].text == defaultFavorite){
						 items[i] = {text:defaultFavorite+DEFAULT_STRING,cssClass:'k-state-selected'};
						  break;
					 }else if(items[i].text == defaultFavorite+DEFAULT_STRING){
						 items[i] = {text:items[i].text,cssClass:'k-state-selected'};
					 }
				 }
			 }else{
				for(i=0;i<items.length;i++){
				    var defaultMenuItem = items[i].text;
				    if(defaultMenuItem   == undefined){
						items.splice(i, 1);
					}
				    if(defaultMenuItem != undefined && defaultMenuItem.indexOf(DEFAULT_STRING)!= -1 && defaultMenuItem.substring(0, defaultMenuItem.indexOf(DEFAULT_STRING)) != defaultFavorite ){
						 items[i] = {text :defaultMenuItem.slice(0,defaultMenuItem.indexOf(DEFAULT_STRING)),cssClass:''};
						}else if(defaultMenuItem == defaultFavorite){
						 items[i] = {text:defaultFavorite+DEFAULT_STRING};
						}
				  }
			 }
	favoriteComponent.createOrRefreshMenu();
};

FavoriteComponent.prototype.resetFavoriteMenu = function() {
	if(this.selectedFavoriteItem != undefined){
		this.selectedFavoriteItem.find(".k-state-selected").removeClass('k-state-selected');
	}else {
		try{
			var menuItem =  $(this.favoritesMenu).find("li.k-state-selected");
			menuItem .removeClass('k-state-selected');
				
		}catch(e){
			console.log("Error while adding tooltips to menu...["+e.message+"]");
		}
		
	}
};

FavoriteComponent.prototype.refreshFavoriteCache = function(operationType,favoriteData, favoriteComponent) {
	var favoriteDataCache;
	var favoriteDataList;
	if(favoriteComponent.isInParentContainer) {
		favoriteDataCache=parent.getFavoriteDataCache();
	}else{
		favoriteDataCache=getFavoriteDataCache();
	}
	if(favoriteDataCache != null){
		favoriteDataList=favoriteDataCache.userFavorites[favoriteComponent.dashboardId];
		if(operationType==OPT_TYPE_CREATE){
			if(favoriteDataList==null)
				favoriteDataList=[];
			favoriteDataList.push((favoriteData[favoriteComponent.dashboardId])[0]);
		}else if(operationType==OPT_TYPE_UPDATE){
			for(var i=0;i<favoriteDataList.length;i++){
				if((favoriteDataList[i]).name==(favoriteData[favoriteComponent.dashboardId])[0].name){
					favoriteDataList.splice(i, 1);
					if((favoriteData[favoriteComponent.dashboardId])[0].isDefault){
						favoriteDataCache.defaultFavorite[favoriteComponent.dashboardId]=(favoriteData[favoriteComponent.dashboardId])[0];	
						favoriteComponent.defaultfavorite = jQuery.parseJSON((favoriteDataCache.defaultFavorite[favoriteComponent.dashboardId]).favoriteData);;
					}
				}
			}
			favoriteDataList.push((favoriteData[favoriteComponent.dashboardId])[0]);
		}else if(operationType==OPT_TYPE_DELETE){
			var favoriteDataNameList=favoriteData.split(COMMA_STRING);
			for(var j=0;j<favoriteDataList.length;j++){
				for(var i=0;i<favoriteDataList.length;i++){
					if((favoriteDataList[i]).name==favoriteDataNameList[j]){
						favoriteDataList.splice(i, 1);
					}
				}
			}	
		}
		favoriteDataCache.userFavorites[favoriteComponent.dashboardId]=favoriteDataList;
//		set the updated cache
		parent.setFavoriteDataCache(favoriteDataCache);
	}
};