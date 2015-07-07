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
<script>
	$(document).ready(function() {

 	});  
	
	function setDefaultState(){
		$("#txtFavoriteName")[0].value ="";
		btnCreateFavorite.disabled = true;
		btnShareFavorite.disabled = true;
		//$('#txtFavoriteName').focus();
		setTimeout(function (){$('#txtFavoriteName').focus();}, 500); 
 	} 
 	
 	function closeFavoriteWindow() {
 		parent.getFavoriteComponent('<bean:write name="favoriteId" />').closeCreateFavoriteWindow();
 	}
 	
 	function validateFavoriteExists(){
 		if(isValidFavoriteName()){
 			parent.getFavoriteComponent('<bean:write name="favoriteId" />').validateFavorite($('#txtFavoriteName').val());	
 		}else {
 			btnCreateFavorite.disabled = true;
    		btnShareFavorite.disabled = true;
 		}
	}
 	
    function enableDisplayFavoritesBtns(){
    	if(isValidFavoriteName()){
    		btnCreateFavorite.disabled = false;
    		btnShareFavorite.disabled = false;
    	}else{
    		btnCreateFavorite.disabled = true;
    		btnShareFavorite.disabled = true;
    	}
    }
    function openSharedFavorites(){
    	if(isValidFavoriteName()){
    		parent.getFavoriteComponent('<bean:write name="favoriteId" />').showShareFavoriteWindow("createFavorite",getFavoriteNameTrim());	
    	}else {
    		btnCreateFavorite.disabled = true;
    		btnShareFavorite.disabled = true;
    	}
    }
    
    function isValidFavoriteName(){
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
				     		<td colspan="2"><label>Favorite Name</label></td>
						</tr>
						<tr>
							<td><input id="txtFavoriteName" maxlength="50" value ="" onkeyup = "enableDisplayFavoritesBtns()" class="k-input" style="width:140px; padding-left:2px;" restrict/></td>
						    <td class="left-padding2"><input type="button"  id="btnShareFavorite"  onClick=" validateFavoriteExists();openSharedFavorites()" value="Share..." disabled ="true" ></td>
						</tr>		
					</table>
				</td>
			</tr>
			<tr>	
				<td align="right" style="padding-top:10px;">
					<input type="button" id="btnCreateFavorite" onClick="validateFavoriteExists()" disabled ="true" value="Save"><input type="button" id="favoriteCancel" onClick="closeFavoriteWindow();" value="Cancel" style="margin-left:10px;">	
				</td>	
			</tr>
		</table>	
	</div>
</body>	
</html>