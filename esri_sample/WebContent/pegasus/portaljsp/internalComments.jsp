<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>
<html:html>
<head>
<title>Route Information</title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>
	
<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options -->
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" type="text/css" rel="stylesheet"  /><!--  css for slider -->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commentUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/internalComments.js<%=jsVersion%>" type="text/javascript"></script>
</head>
<script>
	$(document).ready(function() {
		initializeInternalComment();
	});
</script>
</head>

<body onresize="onResize(event)" oncontextmenu="return false;">
	<!--  Progress Window Dialog Place Holder  -->
	<div id="progressDialogDiv" > 
	</div> 
   	<!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
	    </div>	
 	</div>
   	<!--  Buttons Bar - end -->
   <div id="internalCommentDiv">
   		<div id ="internalcommentGrid" style="padding:0px; height:100px;">
   			
   		</div>
   </div>
   
   <div style="display: inline-block !important;margin-top: 90px;padding-left: 500px;">
   		<input style="min-width: 45px !important;" type="button" value="Close" onClick="closeDashboard()"/>
   		<input style="min-width: 45px !important;" type="button" value="Add New Comment" id="addNewComment" onClick="addRowHandler()"/>
   		<input style="min-width: 45px !important;" type="button" value="Cancel" onClick="cancelComments()"/>
   		<input style="min-width: 45px !important;" type="button" value="Print" onClick="printPage()"/>
   	</div>
</body>
</html:html>