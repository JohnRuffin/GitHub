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
    var windowId = "";
 	var toBeSharedfavorite = "";
	$(document).ready(function() { 
		$('#usernames').focus();
		
 	});  

	var manageFavoriteName = "";
	var windowId = "";
 	var toBeSharedfavorite = "";
	//share favorites : share button	
	function openSharedFavoritesWindow(windowId,toBeSharedfavorite){
   		   $("#usernames")[0].value ="";
		     windowId = windowId;
 	        toBeSharedfavorite = toBeSharedfavorite;
 			 setTimeout(function (){document.getElementById('usernames').focus();}, 500); 
		if(windowId == "createFavorite"){
			if(toBeSharedfavorite !=""){
			//	tobeSharedFavoriteList.innerHTML = toBeSharedfavorite+"<br>";
				var sharedfavorites = new Array();
				sharedfavorites.push(toBeSharedfavorite);
				 populateSharedListControl(sharedfavorites);
			}
		}else if(windowId == "manageFavorites"){
			var sharedfavorites = new Array();
		    var sharedfavorites = toBeSharedfavorite.split(",");
			 populateSharedListControl(sharedfavorites);
		   /*  for(i=0;i<sharedfavorites.length;i++){
			 tobeSharedFavoriteList.innerHTML += sharedfavorites[i]+"<br>";	 
		     }
			*/	
		}
	}
	
	function populateSharedListControl(listArray) {
 		var listControl = $("#tobeSharedFavoriteList");
		if(listControl) {
			listControl.empty();
						
			if(listArray) {
				var option;
				var favoriteName;
				for(var i=0; i < listArray.length; i++){
					favoriteName = listArray[i];
					if(listArray[i].indexOf(DEFAULT_STRING) >0){
						favoriteName = listArray[i].substring(0, listArray[i].indexOf(DEFAULT_STRING));	
					}
					
					option = '<option value='+i+' style = "padding-left:25px;color:#003366">'+favoriteName+'</option>';
					listControl.append(option); 
				} 	
			}
		}
 	}
	
	

	function enableDisplayFavoritesBtns(){
		if($('#usernames').val() != ""){
			btnSaveFavorite.disabled = false;
		}else{
			btnSaveFavorite.disabled = true;
		}
	}
		
 	
 	function closeFavoriteWindow() {
 		parent.getFavoriteComponent('<bean:write name="favoriteId" />').closeShareFavoriteWindow();
 	}
 	
	function shareFavorite(){
			var listControl = $("#tobeSharedFavoriteList");
			var selectedFavorites ="" ;
			for(i=0;i<listControl[0].children.length;i++){
				   selectedFavorites+= listControl[0].children[i].innerText+",";
			 }
		   //var shareFavStr = (tobeSharedFavoriteList.innerHTML).replace(/<br>/g, ',')
			parent.getFavoriteComponent('<bean:write name="favoriteId" />').createFavorite(selectedFavorites,$('#usernames').val());
			closeFavoriteWindow();
	}
	
   
</script>

</head>

<body style="width:100%;height:100%">
	<div id = "contentDiv" class="left-margin2">
		<table border = "0">
				<tr><td><label>Share these favorites</label></td></tr>
				<tr><td>
				<!-- <div id = "tobeSharedFavoriteList" class="share-favorite" />  -->	
				<select id = "tobeSharedFavoriteList"  disabled="disabled" size="6"  style="width:215px;">
				</select>
					</td>
				</tr>
				<tr height="5px"/>
				<tr><td><label>Share with</label></td></tr>
				<tr><td><input id="usernames" class="k-input" placeholder="Type User ID's, comma separated" onkeyup = "enableDisplayFavoritesBtns('<bean:write name="favoriteId" />')" style="width:210px;"/></td></tr>
				<tr><td align="right" style="padding-top:10px;">
					<input type="button"  id="btnSaveFavorite"  onClick="shareFavorite()" disabled ="true" value="Save">
					<input type="button" id="btnCancelFavorite" onClick="closeFavoriteWindow()" value="Cancel" style="margin-left:10px;">
				</td></tr>
		</table>
	</div>			
</body>	
</html>

  


