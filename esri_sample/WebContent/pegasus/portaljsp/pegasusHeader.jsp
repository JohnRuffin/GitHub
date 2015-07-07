<%@page import="com.spacetimeinsight.security.bean.JAASAuthenticationTypeInitializer"%>
<%@page import="com.spacetimeinsight.security.bean.JAASConstants"%>

<html:html locale="true">
<div id="header" class="headerbar" style="z-index:9000">
	
	<div class="left">
   		<table height="30" border="0">
        	<tr>
        		<td title="Case Types" style="padding-right:9px;">
                   <label class="label_style text-grey" style="padding-left:0px">Case Types</label> 
                </td>
                <td>
					<div>
						<input id="caseTypes" readonly/> 
					</div>
                </td>
                <td>
                	<a class="iconbtn" style="margin-left:2px;height:15px" onclick="openSelectLocDialog('caseTypes','Select Case Types',null,null,false,null,null,this)" title="Select Case Types" href="#">
			    		<span class="k-icon k-i-list-popup"></span>
			    	</a>
                </td> 
            	<td id="plan" title="<bean:message key='header.title.plan' bundle='pegasusresources'/>" style="padding-right:9px;">
                   <label class="label_style text-grey" style="padding-left:0px"><bean:message key='header.title.plan' bundle='pegasusresources'/></label> 
                </td>
                <td>
					<div id ="planCmbDiv">
						<input id="planCmb"  /> 
						<!-- <select id="planCmb" class="selectStyle"></select>  -->
					</div>
                </td>
                <td>
                	<a class="iconbtn" style="margin-left:2px;" onclick="refreshPlanList();" title="<bean:message key='header.icon.refresh' bundle='pegasusresources'/>" href="#">
			    		<span class="k-icon icon-plan-refresh">
			    			<bean:message key='header.icon.refresh' bundle='pegasusresources'/>
			    		</span>
			    	</a>
                </td> 
                <td id="schedule" title="<bean:message key='header.title.schedule' bundle='pegasusresources'/>" style="padding-right:9px;">
                    <label class="label_style text-grey" style="padding-left:0px"><bean:message key='header.title.schedule' bundle='pegasusresources'/></label>
                </td>
                <td>
                    <div id ="scheduleCmbDiv"><select id="scheduleCmb" class="selectStyle"></select></div>
                </td>
                <td style="width: 10px;"></td>
                <td>
                </td>
        	</tr>
		</table>
	</div>
    <div id="headerBtnBar" class="right">
    	<table cellpadding="0" cellspacing="0" height="30" border="0">
           	<tr>
           		<logic:equal name="isAdvanceQueryModule" value="Y">
           		<td style="display:none">
				    <a id ="routeEditorHeaderId" onclick="VIEWER.enableRouteEditor(this, true)" title="Enable WIP" class="iconbtn" title="" href="#">
			    		<span class="k-icon icon-add-route">
			    		</span>
			    	</a>
                </td>
           		<td>
				     <!-- <ul id="scheduleMaintenanaceMenu"   class ="iconbtn schedule-maintenance-dropdown" style="background-color:transparent;">
                     </ul>-->
                      <a id ="scheduleMaintenanaceMenu" onclick="enablescheduleMaintenanace(this)" title="Enable Schedule Maintenance" class="iconbtn" title="" href="#">
			    		<span class="k-icon icon-schedule-maintenance">
			    		</span>
			    	</a>
				<!--title="Schedule maintenance mode is off"-->
                </td>

                <!-- added for ITRS -tc -->
                <td id="enableItrsBtn">
                    <a id ="itrsBtn" onclick="openITRSHandler()" title="ITRS" class="iconbtn" title="" href="#">
                        <span class="k-icon icon-itrs-enabled">
                        </span>
                    </a>
                </td>
                <td style="display:none" id="disableBtn">
                    <a id ="itrsBtn" title="ITRS" class="iconbtn" title="" href="#">
                        <span class="k-icon icon-itrs-disabled">
                        </span>
                    </a>
                </td>

	         		<td>
	         			<a onclick="openDashboard('modeAnalysisViewDiv')" class="iconbtn" title="<bean:message key='header.icon.mode.analysis' bundle='pegasusresources'/>" href="#">
				    		<span class="k-icon icon-mode-anaylsis-disable">
				    			<bean:message key='header.icon.mode.analysis' bundle='pegasusresources'/>
				    		</span>
				    	</a>
	               	</td>
	       			<td>
	         			<a onclick="cloneDashboardHandler()" class="iconbtn" title="<bean:message key='header.icon.clone' bundle='pegasusresources'/>" href="#">
				    		<span class="k-icon icon-clone-disable">
				    			<bean:message key='header.icon.clone' bundle='pegasusresources'/>
				    		</span>
				    	</a>
	                </td>
	         		<td>
						<ul id ="winsCmbDiv" class="iconbtn winselect-dropdown" style="background-color:transparent;"  title="<bean:message key='header.icon.window' bundle='pegasusresources'/>"></ul>
	               </td>
               </logic:equal>
                <td>
                	<div class="bar-divider" style="margin-right:9px;"></div>
                </td>
                <%-- <td>
                	<a class="iconbtn" title="<bean:message key='header.icon.calendar' bundle='pegasusresources'/>" href="#">
			    		<span class="k-icon icon-select-calendar">
			    			<bean:message key='header.icon.calendar' bundle='pegasusresources'/>
			    		</span>
			    	</a>
                </td>  --%>
         		<td>
         			<ul id ="applicationFavoritesMenu" class="iconbtn favorite-dropdown"  
         				title="<bean:message key='header.icon.favorites' bundle='pegasusresources'/>" style="background-color:transparent;">
					</ul>
                </td>
                <td>
                	<div class="bar-divider" style="margin-right:9px;"></div>
                </td>
         		<td>
         			<a class="iconbtn" onclick="openSystemSettingsWin()" title="<bean:message key='header.icon.setting' bundle='pegasusresources'/>" href="#">
			    		<span class="k-icon icon-system-settings-disable">
			    			<bean:message key='header.icon.setting' bundle='pegasusresources'/>
			    		</span>
			    	</a>
                </td>
                <td>
                	<a class="iconbtn" onclick="openHelpWindow()" title="<bean:message key='header.title.help' bundle='pegasusresources'/>" href="#">
			    		<span class="k-icon icon-help">
			    			<bean:message key='header.title.help' bundle='pegasusresources'/>
			    		</span>
			    	</a>
               </td>
                <td>
                	<div class="bar-divider" style="margin-right:9px;"></div>
                </td>
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                    	<tr>
                        	<td align="center" style="padding-left:5px;">
                           		<span class="usertitle"><b>
                           			<logic:present name="stiUser" >
										<bean:write name="stiUser" property="firstName" />&nbsp;<bean:write name="stiUser" property="lastName"/> 
									</logic:present></b>
								</span>
                            </td>
                         </tr>
                         <% if (!(request.isSecure() || JAASConstants.KRB_LDAP_DATA_SOURCE.equals(JAASAuthenticationTypeInitializer.getInstance().getJAASAuthenticationType()))) { %>
                         <tr>   
                            <td align="center" style="padding-left:5px;"><span style="color:blue; font-size:9pt;"><a href="#" onclick="resetLogout();"><bean:message key='header.title.logout' bundle='pegasusresources'/></a></span></td>
                        </tr> 
                        <% } %>
                    </table>
                </td>
               <%--  <td>
                	<table width="100%" cellpadding="0" cellspacing="0">
                    	<tr>
                        	<td colspan="2" align="left">
                           		<span class="usertitle"><b>
                           			<logic:present name="stiUser" >
										<bean:write name="stiUser" property="firstName" />&nbsp;<bean:write name="stiUser" property="lastName"/> 
									</logic:present></b>
								</span>
                            </td>
                         </tr>
                         <tr>   
                            <td align="left"><span style="color:blue"><a href="#" onclick="resetLogout();"><bean:message key='header.title.logout' bundle='pegasusresources'/></a></span></td>
                            <td align="right"><span style="color:blue"><a href="#"><bean:message key='header.title.help' bundle='pegasusresources'/></a></span></td>   
                        </tr> 
                    </table>    
                </td> --%>
            </tr>
         </table>   
   	</div>
    <div id="headercoverId" class="headercover" disabled="disabled"></div>
    <div class="clear"></div>
    <div id ="applicationFavoriteWindowsParentDiv" style="display: none;"></div>
</div>
</html:html>