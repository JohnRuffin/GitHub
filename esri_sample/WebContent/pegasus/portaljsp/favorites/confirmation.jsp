<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html>
<head>
<title>Update Favorite</title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
<bean:parameter id="favoriteId" name="favoriteId"  />
<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/portalcss/bluetheme.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
<link href="<%=contextName%>/pegasus/portalcss/icons.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
<script>
	$(document).ready(function() {

 	});  
	
	function showMessage(favoriteName,operation){
		if(operation == "addFavorite"){
			 $("#confirmMessage")[0].innerText ="Favorite(s) have been shared successfully";
		}else if(operation == "updateFavorite"){
		    $("#confirmMessage")[0].innerText ="' "+favoriteName+" ' has been updated successfully";
		}else if(operation == "validateFavorite"){
		    $("#confirmMessage")[0].innerText ="' "+favoriteName+" ' has been added successfully";
		}else if(operation == "deleteFavorite"){
		    $("#confirmMessage")[0].innerText ="Favorite(s) have been saved successfully";
		}
 	} 
	
 	function closeFavoriteWindow() {
 		parent.getFavoriteComponent('<bean:write name="favoriteId" />').closeConfirmationMessageWindow();
 	}
 </script>

</head>

<body style="width:100%;height:100%">
	<div id = "contentDiv" class="left-margin2">
		<table cellpadding="0" cellspacing="0" border="0" style="width:99%;height:100%">
			<tr height = "10px"/>
			<tr>
				<td align="center" style="height:45px"> <div id = "confirmMessage"/></td>
			</tr>
			<tr height = "10px"/>
			<tr>	
				<td align="center" >
					<input type="button" id="btnConfirm" onClick="closeFavoriteWindow()" value="OK"> 	
				</td>	
			</tr>
		</table>	
	</div>
</body>	
</html>