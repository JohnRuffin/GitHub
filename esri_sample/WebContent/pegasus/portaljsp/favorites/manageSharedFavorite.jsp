<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html>
<head>
<title>Manage Favorite</title>

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

function closeFavoriteWindow() {
	parent.getFavoriteComponent('<bean:write name="favoriteId" />').closeManageShareFavoriteWindow();
}

</script>
 	
</head>

<body style="width:100%;height:100%">
	<div id = "contentDiv" class="left-margin2">
		<table border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td valign="top">
			    	<table border="0">
						<tr height = "3%"><td><label >My Favorites</label></td></tr>
				  		<tr>
				     		<td style="height:20px">
						  		<input  type = "checkbox" id ="manageDisplayFavoritesChkBox"  name = "Select All " value= "checked" onchange="selectAllFavorites('manageDisplayFavoritesSelect','manageDisplayFavoritesChkBox')"/>
								<label style = "padding-left:20px; padding-top:2px;">Select All</label>
							</td>
						</tr>
						<tr>
							<td><select id="manageDisplayFavoritesSelect" size="12" multiple="multiple" style="width:145px; height:240px;" onchange = "enableDisplayFavoritesBtns('manageDisplayFavoritesSelect', '<bean:write name="favoriteId" />')" /></td>
						</tr>		
					</table>
				</td>
				<td class="left-padding2" valign="top">
					<table border="0" style="margin-top:25px;">
					       	  <tr height = "20px"/>
						  	  <tr><td> <button id="manageDisplayFavoritesMoveUp" disabled ="true" onclick="moveFavorite('up','<bean:write name="favoriteId" />')" style="width:100px"><div class="inline-block" style="vertical-align:middle; margin-top:-4px;">Move</div><div class="arrow-up inline-block left-margin1"></div></button></td> </tr>	
		  	                  <tr height = "5px"/> 							  
							  <tr><td><button id="manageDisplayFavoritesMoveDown" disabled ="true" onclick="moveFavorite('down','<bean:write name="favoriteId" />')" style="width:100px"><div class="inline-block" style="vertical-align:middle; margin-top:-4px;">Move</div><div class="arrow-down inline-block left-margin1"></div></button></td></tr>
							  <tr height = "5px"/>
							  <tr><td><button id="manageDisplayFavoritesMoveLeft" disabled ="true" onclick="acceptSharedFavorites('<bean:write name="favoriteId" />')" style="width:100px"><div class="inline-block" style="vertical-align:middle; margin-top:-4px;">Move</div><div class="arrow-left inline-block left-margin1"></div></td></tr>
							  <tr height = "5px"/>
							  <tr><td><input type="button"  id="manageDisplayFavoritesDelete"  disabled ="true" onclick="deleteFavorites('<bean:write name="favoriteId" />')" value="Delete" style="width:100px"></td></tr>
							  <tr height = "5px"/>
	   						  <tr><td><input type="button"  id="manageDisplayFavoritesShare"   disabled ="true" onclick="openSharedFavorites('<bean:write name="favoriteId" />')" value="Share..." style="width:100px"></td></tr>
	   						  <tr height = "5px"/>
							   <tr><td><input type="button"  id="manageDisplayFavoritesSetDefault"  disabled ="true" onclick="setDefaultFavorite(true,'<bean:write name="favoriteId" />')" value=" Set Default" style="width:100px"></td></tr>
							  <tr height = "5px"/>
	   						  <tr><td><input type="button"  id="manageDisplayFavoritesRemoveDefault"  disabled ="true" onclick="setDefaultFavorite(false,'<bean:write name="favoriteId" />')" value=" Clear Default" style="width:100px"></td></tr>
					 </table>
				</td>
				<div id = "shared">
				  	<td id = "shared1" style = "padding-left:5px" valign="top">
						<table border = "0">
					   		<tr height = "3%"><td><label style = "padding-top:2px;">Shared Favorites</label></td></tr>
					   		<tr>
							   	<td style="height:20px">
							   		<div style="display: none;">
									 	<input  type = "checkbox" name = "Select All " id ="manageDisplayFavoritesSharedChkBox" value= "checked" onchange = "selectAllFavorites('manageDisplayFavoritesSharedSelect','manageDisplayFavoritesSharedChkBox')" />
									 	<label style = "padding-left:15px; padding-top:3px;">Select All</label>
							  		</div>
							  	</td>
					   		</tr>
						   	<tr>
							  <td>
								 <select name="manageDisplayFavoritesSharedSelect" id="manageDisplayFavoritesSharedSelect" size="12"  style="width:145px; height:240px" onchange = "enableDisplayFavoritesBtns('manageDisplayFavoritesSharedSelect','<bean:write name="favoriteId" />')"/>
							  </td>
						   	</tr>
				  		</table>
					 </td>
				</div>
			</tr>
			<tr>
			  	<td colspan="3" align="center" style="padding-top:5px;">
					<input type="button" id="manageDisplayFavoritesSave" value="OK" onclick = "performSaveHandler(true,'<bean:write name="favoriteId" />');" disabled = "true" style="width:80px; margin-right:10px;">
					<input type="button" id="manageDisplayFavoritesCancel" onclick = "closeManageFavorite('<bean:write name="favoriteId" />');" value="Cancel" style="width:80px; margin-right:10px;">
				</td>
		    </tr>
	  	</table>
	</div> 
</body>	
</html>