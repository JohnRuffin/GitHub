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


<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/data.utils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commentUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/revisionComments.js<%=jsVersion%>" type="text/javascript"></script>

<!-- day control -->
</head>
<style>
img.ui-datepicker-trigger {
  	 position: relative;
	 left: -13px;
	top: 0px;
}
</style>
<script>
	$(document).ready(function() {
		initializeRevisionComment();
		$( "#from" ).datepicker({
		      showOn: "button",
		      buttonImage: "pegasus/assets/icons/table-calendar-icon.png",
		      buttonImageOnly: true,
		      buttonText: "Select date"
		    });
		$( "#to" ).datepicker({
		      showOn: "button",
		      buttonImage: "pegasus/assets/icons/table-calendar-icon.png",
		      buttonImageOnly: true,
		      buttonText: "Select date"
		    });
		 
	});
</script>

</head>

<body  oncontextmenu="return false;">
	<!--  Progress Window Dialog Place Holder  -->
		
	<div id="progressDialogDiv" > 
	</div> 
   	<!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
	    </div>	
 	</div>
   	<!--  Buttons Bar - end -->
   	<div id =revisionDialog style="margin: 0;padding: 0;display:none;">
   		<span style="valign:center"><br/><b><center> You are exiting Revision without saving</center></b> </span></br>
   		<div style="valign:center">
   			<center><input style="min-width: 45px !important;" type="button" id="returnToRevision" value="Return To Revision Comment"  onclick="returnToRevision();"/> </center></br>
   			<center><input style="min-width: 45px !important;" type="button" id="DiscardRevision" value="Discard Revision Comment" onclick="discardRevision();" /><center>
   		</div>
   	</div>
   		<div id = revisionCommentDiv>
   		<input type ="hidden" id ="routeCommentId" />
   		<table width ="800px">
   		 <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">  Route: </td>
   		 	<td> <span style="width: 600px" id="RouteDesc"></span><!--  <input id="RouteDesc" class="k-textbox" style="width: 600px ;height:30px" readonly="readonly" >--> </td>
   		 </tr>
   		 <tr style="height:10px"></tr>
   		 <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">  Changed From: </td>
   		 	<td> <span style="width: 600px" id="changedFrom"></span><!--  <input id="changedFrom" class="k-textbox" style="width: 600px ;height:30px" readonly="readonly">--> </td>
   		 </tr> 	
   		  <tr style="height:10px"></tr>
   		 <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">  Route Detail Comment: </td>
   		 	<td>
   		 	<textarea id="routeDetailComment" class="k-textbox" style="text-transform: uppercase; width: 600px" readonly="readonly"></textarea>
   		 	<!-- <input id="routeDetailCommentCurrent" class="k-textbox" style="width: 100px" readonly="readonly"> -->
   		 	</td>
   		 </tr>
   		 <tr style="height:10px"></tr>
   		  <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">  Revision Comment: </td>
   		 	<td> <textarea id="revisionComment" class="k-textbox" style="text-transform: uppercase; width: 600px;height: 60px" readonly="readonly"></textarea> </td>
   		 </tr> 
   		  <tr style="height:10px"></tr>
   		  <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">  Reason Code: </td>
   		 	<td>
   				 <table style="width:615px"><tbody><tr><td style="width:50px"> <input id="reasonCode" style="text-transform: uppercase; width: 120px" readonly="readonly"> </td>
   		 				<td style=" width:100px;font-weight: bold;color: #000000 !important;"> Revision Date Range:</td>
   				 		<td style=" width:50px;"><input id="from" style="width: 80px;" readonly="readonly"></td>
   		 				<td style="font-weight: bold;color: #000000 !important; width:30px"> 
   		 					<select id="throughCombo" style="width: 150 ;margin-bottom:0px;font-size:13px;margin-right:7px;float:right; padding-left: 0px" onchange="onchangeThroughCombo();">
																		<option>through</option>
																		<option>beyond</option>
																	</select>  
						</td>
   						<td style=" width:50px;"><input id="to" style="width: 100px"  readonly="readonly"></td>
   				 	</tr>
   				</tbody></table> 
   			</td>
   		</tr>
   		 <tr style="height:10px"></tr>
   		<tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;"> Created By: </td>
   		 	<td>
   		 		<table><tr><td style="width:150px;"><span style="width:160px;" id="createdBy"></span> <!-- <input id="createdBy" style="width: 160px"/ readonly="readonly">--> </td>
   		 				<td style="font-weight: bold;color: #000000 !important;"> Creation Date/Time:</td>
   						<td style="padding-left:22px"><span style="width: 160px" id="creationdate"></span><!-- <input id="creationdate" style="width: 160px" readonly="readonly"/>--> </td>
   				 	</tr>
   				</table>
   			</td>
   		</tr>
   		<tr style="height:10px"></tr>
   		 <tr>
   			<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">Requested By:</td>
   			<td><input id="requestedBy" style="text-transform: uppercase; width: 600px" readonly="readonly"/> </td>
   		</tr>
   		 <tr style="height:10px"></tr>
   		<!--  <tr>
   		 	<td style="padding-left:10px;font-weight: bold;color: #000000 !important;"> Crew Notified: </td>
   		 	<td>
   		 		<div style="display: inline-block"><input name="crewNotified" type="radio" id="no"  checked="checked" disabled="disabled" />
   		 								<label style="min-width: 16px; padding-left:15px;font-weight: bold;color: #000000 !important;">No</label>
   		 		<input name="crewNotified" type="radio" id="yes"  checked="checked" disabled="disabled"/><label style="min-width: 16px;padding-left:15px;font-weight: bold;color: #000000 !important;">Yes</label>
   		 		<input id="crewNotifiedDesc" style="width: 60px"/></div>
   			</td>
   		</tr>-->
   		 
   		 <tr style="height:10px"></tr>
   		<tr>
   			<td style="padding-left:10px;font-weight: bold;color: #000000 !important;">Internal Comment:</td>
   			<td><input id="internalComment" style="width: 510px" readonly="readonly"/>
   			<input type="button" name ="internalcommentField" style="min-width: 45px !important;" id="internalcommentId" onclick ="openDashboard(this)" style="opacity: 1;height: 14px;width: 14px;position: relative;top:4px;right: 17px;"/> </td>
   		</tr>
   	</table>
   	</div>
   	<div style="display: inline-block !important;margin-top: 60px;padding-left: 200px;">
   		<input style="min-width: 45px !important;" type="button" id="Previous"  value="Previous" onclick="previous()"/>
   		<input style="min-width: 45px !important;" type="button" value="Save" onclick ="performSave()"/>
   		<input style="min-width: 45px !important;" type="button" value="Cancel" onClick ="performCancel()"/>
   		<input style="min-width: 45px !important;" type="button" id="Edit" value="Edit" onclick="performEdit()"/>
   		<input style="min-width: 45px !important;" type="button" id="Next" value="Next" onClick="next()"/>
   	<!-- 	<input style="min-width: 45px !important;" type="button" id="Add" value="Add" onClick="performAdd()"/>-->
   	</div>
</body>
</html:html>