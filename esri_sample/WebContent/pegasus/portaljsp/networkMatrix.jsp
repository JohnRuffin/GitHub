<%@ taglib uri="/tags/struts-logic" prefix="logic"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<!DOCTYPE html>

<html:html locale="true">
<head>
<title>Network Matrix</title>
<!--  Kendo UI Framework -->
<%@ include file="/pegasus/common/commonImports.jsp" %>

<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/jquery/jquery.ui.panel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for Map options --> 
<link href="<%=contextName%>/pegasus/portalcss/sliderPanel.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for slider settings panel-->
<link href="<%=contextName%>/pegasus/portalcss/networkMatrix.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for network matrix-->
<link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="<%=contextName%>/pegasus/portaljs/favoriteComponent.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/dashboardFavorites.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/searchCriteriaUtils.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonVolumeMatrixUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/matrixUtils.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/portaljs/networkMatrix.js<%=jsVersion%>" type="text/javascript" ></script>
<!-- day control -->
<jsp:include page="/pegasus/portaljsp/dayControl.jsp" ></jsp:include>
<script src="<%=contextName%>/pegasus/portaljs/dayControl.js<%=jsVersion%>" type="text/javascript"></script>
</head>

<body style="width:100%;height:100%" oncontextmenu="return false;">
   <div id="networkMatrix" class="matrixDivStyle">
	<!--  Progress Window Dialog placehodler  -->
    <div id="progressDialogDiv" > 
    </div>
     
    <!--  Buttons Bar - start -->	
	<div id="headerButtonsBar" class="window-header k-window-actions btnBarPosition addOverflowStyle">
		<div class="btnsWrapper">
			<a id="btnNetworkMatrixSyncMap" class="iconbtn n-icon" onclick="VIEWER.enableSync(this,DASHBOARD_ID_NETWORK_MATRIX,[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'sync-to-schematic')" title="<bean:message key='header.icon.syncto.map' bundle='matrixresources'/>" href="#">
	     		<span class="k-icon sync-to-map">
	     			<bean:message key='header.icon.syncto.map' bundle='matrixresources'/>
	     		</span>
		    </a>
	 		<a id="btnNetworkMatrixSyncSchematic" class="iconbtn n-icon" onclick="VIEWER.enableSync(this,DASHBOARD_ID_NETWORK_MATRIX,[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX], 'sync-to-map')" title="<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>" href="#">
	       		<span class="k-icon sync-to-schematic">
	       			<bean:message key='header.icon.syncto.schematic' bundle='mapresources'/>
	       		</span>
	       	</a>
	       	<a id="mRefresh" class="iconbtn" onclick="getDashboardContentWindow(DASHBOARD_ID_NETWORK_MATRIX).refreshMatrix(true,true)" title="<bean:message key='header.icon.refresh' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon icon-refresh" style="height: 24px;width: 24px;">
	    		</span>
	    	</a>
	    	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	    	<a id="" class="iconbtn" onclick="getDashboardContentWindow(DASHBOARD_ID_NETWORK_MATRIX).exportToExcel(this)" title="<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>" href="#">
	       		<span class="k-icon export-to-excel">
	       			<bean:message key='header.icon.exportto.excel' bundle='matrixresources'/>
	       		</span>
	       	</a>
	    	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	    	<%-- <a id="toggleMZulu" onclick="getDashboardContentWindow(DASHBOARD_ID_NETWORK_MATRIX).showLocalZuluColumns(this)" toggled=true class="iconbtn" title="<bean:message key='header.icon.zulu' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon icon-toggle-local">
	    			<bean:message key='header.icon.zulu' bundle='matrixresources'/>
	    		</span>
	    	</a> --%>
	    	<a id="mCal" onclick="openDayControl(this,DASHBOARD_ID_NETWORK_MATRIX,DATA_TYPE_NETWORK)" class="iconbtn" title="<bean:message key='header.icon.calendar' bundle='matrixresources'/>" href="#">
	    		<span class="k-icon icon-select-calendar">
	    			<bean:message key='header.icon.calendar' bundle='matrixresources'/>
	    		</span>
	    	</a>    	
	       	<ul id ="networkMatrixFavoritesMenu" class="iconbtn favorite-dropdown" title = "<bean:message key='header.icon.network.matrix.favorites' bundle='matrixresources'/>">
			</ul>
	       	<div class="inline-iconbtn bar-divider-container">
	   			<div class="bar-divider"></div>
	    	</div>
	    </div>	
   </div>
   <!--  Buttons Bar - end -->
   <div id ="favoriteWindowsParentDiv" style="display: none;"></div>
   	<div id="matrixDisplayOptions" class="slidingWinOpt" style="width:430px; height:100%;">
  		<div class="header-title">
			<bean:message key='display.option.label' bundle='matrixresources'/>
		</div>
		<div class="slidingWinContent" style="height:85%; overflow-y:scroll; overflow-x:hidden;">
			<div id="displayOptionsDiv" class="panelBG">
			<!-- Place contents here -->
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<!-- COLUMN LEFT -->
						<td valign="top" width="50%">
							<div class="section-box" >
								<table id="volumecolumnsDiv">
									<tr>
										<td><label class="section-header"><bean:message
													key='display.option.show.volume.columns'
													bundle='matrixresources' />
										</label>
										</td>
									</tr>
									<!-- <tr height=10></tr> -->
								</table>
							</div>
							<div class="section-box">
								<table id="selectablechekboxesDiv" style="height: 310px">
									<tr>
										<td><label class="section-header"><bean:message
													key='display.option.selectcoldishide'
													bundle='matrixresources' />
										</label>
										</td>
										<!-- <td><div id="hideandshowchekboxesDiv"></div> </td> -->
									</tr>
									<!-- <tr height=10></tr> -->
								</table>
							</div>
							
						</td>
						<!-- COLUMN RIGHT -->
						<td class="settings-right-column" valign="top" width="50%">
							<div class="section-box">
								<table id="timeRelatedcolumnsDiv">
									<tr>
										<td><label class="section-header"><bean:message
													key='display.option.show.timeRelated.columns'
													bundle='matrixresources' />
										</label>
										</td>
										<!-- <td><div id="hideandshowchekboxesDiv"></div> </td> -->
									</tr>
								<!-- 	<tr height=10></tr> -->
								</table>

							</div>
							
							<div class="section-box" style="height: 69px">
								<table>
									<tr>
										<td><label class="section-header"><bean:message
													key='display.option.selecttotalsdishide'
													bundle='matrixresources' /> </label></td>
									</tr>
								<!-- 	<tr height=10></tr> -->
										<tr>
											<td class="left-padding2" style="padding-top:4px"><input type="checkbox" class="mtrixchkbox" id="totalsforeachbreakChk" checked=true onclick="onTotalForEachBreak(networkMatrixGrid, this)"/><label
												for="totalsforeachbreakChk" class="label_style matrix_chkboxlabel"><bean:message key='display.option.totalsforeachbreak' bundle='matrixresources' />
											</label>
											</td>
										</tr>
										<tr>
											<td class="left-padding2"><input type="checkbox" class="mtrixchkbox" id="grandtotalsChk" checked=true onclick="onGrandTotal(networkMatrixGrid, this)"/><label
												for="grandtotalsChk" class="label_style matrix_chkboxlabel"><bean:message key='display.option.grandtotals' bundle='matrixresources' />
											</label></td>
										</tr>
									<!-- <tr height=10></tr> -->
									
								</table>
							</div>
						</td>
					</tr>
				</table>		
				</div>
		</div>
	</div>
	<form id="hiddenform" method="POST" action="matrixExportAjaxAction.do?operation=exportToCSV">
    	<input type="hidden" id="matrixdata" name="matrixdata" value="0">
    	<input type="hidden" id="matrixId" name="matrixId" value="NetworkMatrix">
	</form>		
   </div>
 </html:html>