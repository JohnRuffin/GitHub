/**
 * object of favoriteComponent for the selected dashboard
 */
var favoriteComponent;

/**
 * method to get the favoriteComponent for the selected dashboard
 * @returns favoriteComponent
 */
function getFavoriteComponent(dashboardId) {
	if(typeof getDashboardFavoriteComponent == "function") {
		return getDashboardFavoriteComponent(dashboardId);
	}
	return favoriteComponent;
}

/**
 * method to get the favoriteDetails of the selected dashboard
 * @param isApplicationLevel
 * @returns {favoriteDetails}
 */
function getFavoriteDetails(isApplicationLevel,dashboardId) {
	var favoriteDetails = {};
	var dashboardObject = null ;
	try {
		if(typeof getDashboardFavoriteObject == "function") {
			dashboardObject = getDashboardFavoriteObject(dashboardId);
			favoriteDetails["headerButtonSettings"] = dashboardObject.getHeaderButtonSettings(isApplicationLevel);
			favoriteDetails["displayOptionSettings"] = dashboardObject.getDisplayOptionSettings(isApplicationLevel);
			favoriteDetails["contentSettings"] = dashboardObject.getContentFavoriteSettings(isApplicationLevel);
		}else{
			favoriteDetails["headerButtonSettings"] = getHeaderButtonSettings(isApplicationLevel);
			favoriteDetails["displayOptionSettings"] = getDisplayOptionSettings(isApplicationLevel);
			favoriteDetails["contentSettings"] = getContentFavoriteSettings(isApplicationLevel);
		}	
	} catch(e) {
		parent.showErrorMsg("Error ["+e.message+"] occurred while getting the favorite details");
	}	
	return favoriteDetails; 
}

/**
 * method to apply the favoriteDetails of the selected dashboard
 * @param favoriteDetails
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
function applyFavoriteDetails(favoriteDetails, dashboardId, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	try {	
		var dashboardObject;
		if(favoriteDetails) {
			if(typeof getDashboardFavoriteObject == "function") {
				dashboardObject = getDashboardFavoriteObject(dashboardId);
				if(favoriteDetails["headerButtonSettings"] != undefined){
					dashboardObject.applyHeaderButtonSettings(favoriteDetails["headerButtonSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
				
				if(favoriteDetails["displayOptionSettings"] != undefined){
					dashboardObject.applyDisplayOptionSettings(favoriteDetails["displayOptionSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
				if(favoriteDetails["contentSettings"] != undefined){
					dashboardObject.applyContentFavoriteSettings(favoriteDetails["contentSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
			}else{
				if(favoriteDetails["headerButtonSettings"] != undefined){
					applyHeaderButtonSettings(favoriteDetails["headerButtonSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
				
				if(favoriteDetails["displayOptionSettings"] != undefined){
					applyDisplayOptionSettings(favoriteDetails["displayOptionSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
				if(favoriteDetails["contentSettings"] != undefined){
					applyContentFavoriteSettings(favoriteDetails["contentSettings"], isDefaultFavorite, isApplicationLevel, isRefreshDashboard);
				}
			}	
		} 
	} catch(e) {
		parent.showErrorMsg("Error ["+e.message+"] occurred while applying the favorite details");
	}	
}
