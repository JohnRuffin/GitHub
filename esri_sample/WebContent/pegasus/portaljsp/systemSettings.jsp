<%@page import="com.spacetimeinsight.fedex.common.PegasusConfigUtils"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>

<!DOCTYPE html>

<html:html locale="true">
<head>
<title>Pegasus</title>
<%
	String jsVersion = PegasusConfigUtils.getVersionString(false);
	String contextName = ServerUtils.getContextName(request);
%>
<!-- Pegasus Application CSS-->
<script src="<%=contextName%>/pegasus/portaljs/systemSettings.js<%=jsVersion%>" type="text/javascript" ></script> 
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>

<script>
	$(document).ready(function() {
		if(isAdvanceQuery()){
			initialize();
		}	
		});

</script>
</head>

<body style="width:100%;height:100%" oncontextmenu="return false;">
   <div id="systemSettingMainDiv" style="height: 95%;width: 100%; overflow: hidden;">
	<!--  Progress Window Dialog placehodler  -->
    <div id="progressDialogDiv" > 
    </div>
     
    <!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions" style="padding-bottom:0px;padding-top: 0px;padding-right: 12px;padding-left: 0px;"  >
 		
   </div>
   <!--  Buttons Bar - end -->
   
   <div id="systemSettingDiv" style="width: 100%;display: none; overflow: hidden;">
			<div class="section-box">
				<label class="section-header"><bean:message key='window.system.setting.label.setdefaults' bundle='pegasusresources' /> </label>
				<table border="0" style="width: 100%; padding-top: 10px">
					<tr>
						<td>
							<label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.effdays' bundle='pegasusresources' /> </label>
						</td>
						<td>
							<label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.time' bundle='pegasusresources' /></label>
						</td>
					</tr>
					<tr>
						<td style="padding-left: 25px"><input type="radio" name="effdaysgrp" id="mtwtfssradio" value="M,T,W,T,F,S,S"
							checked="checked" /><label for="mtwtfssradio"
							class="label_style"><bean:message key='window.system.setting.label.mtwtfss' bundle='pegasusresources' /> </label>
						</td>
						<td style="padding-left: 25px"><input type="radio" name="timezoneradiogrp"
							id="localtimeradio" checked="checked" /><label
							for="localtimeradio" class="label_style"><bean:message key='window.system.setting.label.local' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>
						<td style="padding-left: 25px"><input type="radio" name="effdaysgrp" id="mtwrfsnradio"  value="M,T,W,R,F,S,N"/><label
							for="mtwrfsnradio" class="label_style"><bean:message key='window.system.setting.label.mtwrfsn' bundle='pegasusresources' /> </label>
						</td>
						<td style="padding-left: 25px"><input type="radio" name="timezoneradiogrp"
							id="zulutimeradio" /><label for="zulutimeradio"
							class="label_style"><bean:message key='window.system.setting.label.zulu' bundle='pegasusresources' /> </label>
						</td>
					</tr>
				</table>
				<table border="0" style="width: 100%; padding-top: 10px">
					<tr>
						<td><label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.weight' bundle='pegasusresources' /> </label>
						</td>
						<td><label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.length' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>
						<td style="padding-left: 25px"><input type="radio" name="weightgrp" id="poundsradio"
							checked="checked" /><label for="poundsradio" class="label_style"><bean:message key='window.system.setting.label.pounds' bundle='pegasusresources' /> </label>
						</td>
						<td style="padding-left: 25px"><input type="radio" name="lenghtgrp" id="milesradio"
							checked="checked" /><label for="milesradio" class="label_style"><bean:message key='window.system.setting.label.miles' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>
						<td style="padding-left: 25px"><input type="radio" name="weightgrp" id="kgradio" /><label for="kgradio" class="label_style"><bean:message key='window.system.setting.label.kg' bundle='pegasusresources' />
						</label>
						</td>
						<td style="padding-left: 25px"><input type="radio" name="lenghtgrp" id="kmradio" /><label for="kmradio" class="label_style"><bean:message key='window.system.setting.label.km' bundle='pegasusresources' />
						</label>
						</td>
					</tr>
				</table>
				<table style="width: 100%; padding-top: 10px">
					<tr>
						<td><label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.onstartdefaultplan' bundle='pegasusresources' /> </label>
						</td>
						<td><label class="common-textformat" style="padding-left: 15px"><bean:message key='window.system.setting.label.effdaysdisplay' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>
						<td style="padding-left: 25px"><input type="radio" name="planradiogrp" id="lastUsedRadio" /><label
							for="lastUsedRadio" class="label_style"><bean:message key='window.system.setting.label.lastUsed' bundle='pegasusresources' /> </label>
						</td>
						<td style="padding-left: 25px"><input type="radio" name="effdaysradiogroup" id="effDaysRadio"  checked/><label
							for="effDaysRadio" class="label_style"><bean:message key='window.system.setting.label.effday' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>	
						<td style="padding-left: 25px"><input type="radio" checked  name="planradiogrp" id="choosePlanRadio" /><label
							for="choosePlanRadio" class="label_style"><bean:message key='window.system.setting.label.choosePlan' bundle='pegasusresources' /> </label>
						</td>
						<td style="padding-left: 25px"><input type="radio"  name="effdaysradiogroup" id="keywordEffDaysRadio" /><label
							for="keywordEffDaysRadio" class="label_style"><bean:message key='window.system.setting.label.keywordeffdays' bundle='pegasusresources' /> </label>
						</td>
					</tr>
					<tr>
						<td></td>
						<td style="padding-left: 25px"><input type="radio"  name="effdaysradiogroup" id="weeklyPatternRadio" /><label
							for="weeklyPatternRadio" class="label_style"><bean:message key='window.system.setting.label.weeklypattern' bundle='pegasusresources' /> </label>
						</td>
					</tr>
				</table>
			</div>
			<div class="section-box" style="height:205px; overflow-y: hidden;">
				<div>
	        		<label class="section-header"><bean:message key='window.system.setting.label.volumegroups' bundle='pegasusresources' /> </label>
	    		</div>
				<table style="width: 100%; padding-top: 5px">
					<tr>
						<td>
						<div style="height:180px; overflow-y: scroll;">
							<div class="treeview-back" style="padding-left: 9px";">
		            			<div id="treeview" style="overflow-y: hidden;"></div>
		        			</div>
			    		</div>
						</td>
					</tr>
				</table>
    		</div>
			<div style="margin-top:5px;">
				<table align="center">
					<tr>
						<td><input type="button" id="savechangesBtn" style="width:50px;" onclick="onSaveSystemSettings(true)" value="<bean:message key='window.system.setting.label.savechanges' bundle='pegasusresources' />" >
							
						</td>
						<td><input type="button" id="cancelBtn" style="width:50px;" onclick="onCancelSystemSettings()" value="<bean:message key='window.system.setting.label.cancel' bundle='pegasusresources' />" >
						
						</td>
					</tr>
				</table>
			</div>
		</div>
   </div>
 </html:html>