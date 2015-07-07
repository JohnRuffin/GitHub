<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--The viewport meta tag is used to improve the presentation and behavior of the samples 
      on iOS devices-->
<meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
<title>Edit Tools</title>
<link rel="stylesheet" href="http://js.arcgis.com/3.13/dijit/themes/nihilo/nihilo.css">
<link rel="stylesheet" href="http://js.arcgis.com/3.13/esri/css/esri.css">
<link rel="stylesheet" href="css/mapViewer.css">

<script src="/js/jquery/jquery.ui.panel.js" type="text/javascript" ></script> <!-- Slider options panel -->
<script src="http://js.arcgis.com/3.13/"></script>
<script src="js/mapViewer.js"></script>
</head>

<body>
	<div id="mainWindow" data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'headline', gutters:'false'">
	    <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
	    </div>
    </div>
    <!-- Schedule Maintaince Map Drawer -->
<div id="SkdMxMapDrawerContainer">
 <div id="SkdMxMapDrawerController"  class="slidingWinOpt" style="width:680px;top: 0px; height: auto !important">
     	<div class="header-title">
     		Schedule Map        		
		</div>
      	<div class="slidingWinContent" style="overflow:hidden">
			<div class="slidingWinContent-innercontainer" style="margin-top: -10px;"> 
				<div class="sliding-content-container">
					<div class="ui-panel-content-text">
						<div class="section-box">
							<div class="section-box-content" style="overflow: hidden;">								
								<div>
     								<a id="btnDefaultPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Selection tool" href="#">
								   		<span class="k-icon icon-cursor-select">
								   			Select Route 
								   		</span>
								   	</a>
								   	<a id="btnAddPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Add leg tool" href="#">
								   		<span class="k-icon icon-cursor-add">
								   			Add Route/ Leg
								   		</span>
								   	</a>
								   	<a id="btnDeletePointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Delete leg tool" href="#">
								   		<span class="k-icon icon-cursor-delete">
								   			Delete  Route/ Leg
								   		</span>
								   	</a>
								   	
								   </div>	
								   <div id="operationsDiv" style="padding:10px; width: 100%">								  		
									   <a id="btnSMDuplicate" onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " class="iconbtn" title="Duplicate route" href="#">
									   		<span class="k-icon icon-dupicate-route">
									   			Duplicate
									   		</span>
									   	</a>
									   	<!-- SkdMxHelper.getDrawer().selectPointer(this, true); SkdMxHelper.getDrawer().addRoute(this, true) -->
									   	<a id="btnSkdMxRouteTypeSelection" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn" title="Create route" href="#" >
									   		<span class="k-icon icon-add-route">
									   			Select route type tool
									   		</span>
									   	</a>
									   	<!-- SkdMxHelper.getDrawer().selectPointer(this, true); SkdMxHelper.getDrawer().addRoute(this, true) -->
									   	<a id="btnSkdMxAddRoute" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" style="display:none;" class="iconbtn" title="Create route" href="#" >
									   		<span class="k-icon icon-add-route">
									   			Add
									   		</span>
									   	</a>
									   	<!-- <a id="btnSMAdd" onclick="SkdMxHelper.getDrawer().deleteRoute(this, true)" class="iconbtn" title="Delete route" href="#"  >
									   		<span class="k-icon icon-cancel-route">
									   			Delete
									   		</span>
									   	</a> -->
									   	<a id="btnCancelPointer" onclick="SkdMxHelper.getDrawer().selectPointer(this, true)" class="iconbtn smpointer" title="Cancel tool" href="#">
									   		<span class="k-icon icon-cancel-route">
									   			Cancel Route/ Leg
									   		</span>
									   	</a>		
									   	<a id="saveToWip" class="iconbtn"  style="display: none" onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="<bean:message key='header.icon.saveToWip' bundle='filters'/>" href="#">
											<span class="k-icon icon-save-settings-wip-smd">
												<bean:message key='header.icon.saveToWip' bundle='filters'/>
											</span>
										</a>
										<a id="saveToSchedule" class="iconbtn" style="display: none"  onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="<bean:message key='header.icon.saveToSchedule' bundle='filters'/>" href="#">
											<span class="k-icon icon-save-settings">
												<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
											</span>
										</a>
			                            <a id="noSaveToWip" class="iconbtn" title="<bean:message key='header.icon.saveToWip' bundle='filters'/>" href="#">
											<span class="k-icon icon-save-wip-settings-disabled">
												<bean:message key='header.icon.saveToWip' bundle='filters'/>
											</span>
			                            </a>
			                            <a id="noSaveToSchedule" class="iconbtn"  title="Save to Schedule" href="#">
											<span class="k-icon icon-save-settings-disabled">
												<bean:message key='header.icon.saveToSchedule' bundle='filters'/>
											</span>
			                            </a>
										<a id="deleteFromSchedule" class="iconbtn" style="display: none"  onclick="SkdMxHelper.getDrawer().selectPointer(this, true) " title="Delete from Schedule" href="#">
								    		<span class="k-icon icon-delete-route">
								    			Delete from Schedule
								    		</span>
								    	</a>
								    	<a id="noDeleteFromSchedule" class="iconbtn" title="Delete from Schedule" href="#">
								    		<span class="k-icon icon-delete-route-disable">
								    			Delete from Schedule
								    		</span>
								    	</a>					        	
 									</div>		
	 								<div class="clearButtons"></div>
								</div>
							</div>
							<div>
								<div>
									<div id='SchdleMntnceMapDwrContent' style='overflow: scroll; min-width: 218px;'>
							  			<table id='SchdleMntnceMapDwrContentTbl' style="padding-left: 20px; padding-right: 20px;"></table>
			        				</div>
								</div>
							</div>	
						</div>
				</div>
		</div>
	</div>			
	</div>
 </div> 
</body>

</html>
