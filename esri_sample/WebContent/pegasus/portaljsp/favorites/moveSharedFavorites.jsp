<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html>
<head>
<title>Create Favorite</title>

<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
<bean:parameter id="favoriteId" name="favoriteId"  />
<!-- Pegasus Application CSS-->
<script src="<%=contextName%>/pegasus/portaljs/manageFavorites.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/manageFavoritesComponent.js<%=jsVersion%>" type="text/javascript"></script>

<script>
	$(document).ready(function() {
		initializeManageFavoriteComponent('<bean:write name="favoriteId" />');
	}); 
	var invalidFavoritesArray;
	var invalidFavoriteLabel;
	var manageFavoriteComponent;
	 function openMovetoMyFavoritesWindow(invalidFavoritesStr, manageFavoriteObject){
		 setTimeout(function (){$('#txtFavoriteName').focus();}, 500); 
		 if(invalidFavoritesStr != undefined){
			 invalidFavoritesArray = invalidFavoritesStr.split(",");
			 invalidFavoritesArray.splice(1,1);
			 invalidFavoriteLabel = invalidFavoritesArray[0];
			 invalidFavoriteName.innerHTML ="You already have a favorite named <b>' "+invalidFavoritesArray[0]+" ' </b>Would like to rename the shared favorite?";
			 manageFavoriteComponent = manageFavoriteObject;
		 }
	 }

	
	function resetNameAndAcceptFavorite(){
		if(isValidName()){
			if(isValidFavoriteName($("#txtFavoriteName")[0].value)){
				/* parent.getFavoriteComponent('<bean:write name="favoriteId" />').acceptSharedFavorite(invalidFavoritesArray[0],getFavoriteNameTrim());
				updateFavoritesonAccept(invalidFavoritesArray,getFavoriteNameTrim()); */
				if(manageFavoriteComponent){
					manageFavoriteComponent.renameInvalidFavorite(invalidFavoriteLabel, getFavoriteNameTrim());
				}
				closeFavoriteWindow();
			}	
		}
	}
	
	function isValidFavoriteName(favoritename){
		var   userfavorites= parent.getFavoriteComponent('<bean:write name="favoriteId" />').userFavorites;
		if(userfavorites != null ){
			 for(i=0;i<userfavorites.length;i++){
				  if(userfavorites[i]==favoritename){
					   var errorMsg = favoritename+" already Exists.Please choose another name ";
					   parent.showFilterErrorMsg(errorMsg);
			    	   return false;
				  }
				}
		}
       
	 return true;	
	}
	
	
	function enableDisplayFavoritesBtns(){
		if(isValidName()){
			btnSaveFavorite.disabled = false;
		}else{
			btnSaveFavorite.disabled = true;
		}
	}
	
 	function closeFavoriteWindow() {
 		parent.getFavoriteComponent('<bean:write name="favoriteId" />').closeMoveSharedFavoritesWindow();
		$("#txtFavoriteName")[0].value ="";
 	}
 	
 	function isValidName(){
    	var favoriteName = getFavoriteNameTrim();
    	if(favoriteName == "" || $.trim(favoriteName) == ""){
    		return false
    	}
    	
    	return true;
    }
    
    function getFavoriteNameTrim(){
    	var favoriteName = $('#txtFavoriteName').val();
    	return $.trim(favoriteName);
    }
    
</script>

</head>

<body style="width:100%;height:100%">
	<div id = "contentDiv" class="left-margin2">
		<table border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td valign="top">
			    	<table border="0">
				  		<tr>	
				     		<td colspan="2" align = "center">
							<div id = "invalidFavoriteName"/>
							</td>
						</tr>
						<tr  height ="5px"/>
						<tr>
							<td align="center"><input id="txtFavoriteName" maxlength="50" value ="" onkeyup = "enableDisplayFavoritesBtns('<bean:write name="favoriteId" />')"  style="width:180px;"/></td>
						</tr>		
					</table>
				</td>
			</tr>
			<tr>	
				<td align="center" style="padding-top:10px;">
					<input type="button" id="btnSaveFavorite" onClick="resetNameAndAcceptFavorite();" disabled ="true" value="Save">
					<input type="button" id="btnCancel" onClick="closeFavoriteWindow();" value="Cancel" style="margin-left:10px;">	
				</td>	
			</tr>
		</table>	
	</div>
</body>	
</html>