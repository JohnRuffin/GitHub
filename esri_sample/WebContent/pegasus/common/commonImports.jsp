<%@page import="com.enterprisehorizons.constants.CommonConstants"%>
<%@page import="com.enterprisehorizons.util.StringUtils"%>
<%@page import="com.spacetimeinsight.fedex.common.PegasusConfigUtils"%>
<%@page import="com.spacetimeinsight.security.bean.JAASAuthenticationTypeInitializer"%>
<%@page import="com.spacetimeinsight.security.bean.JAASConstants"%>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>

<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<%
	String protocol = (request.isSecure() || JAASConstants.KRB_LDAP_DATA_SOURCE.equals(JAASAuthenticationTypeInitializer.getInstance().getJAASAuthenticationType()))?"https":"http";
	String jsVersion = PegasusConfigUtils.getVersionString(false);
	String contextName = ServerUtils.getContextName(request);
	String serverUrl = ServerUtils.getServerContextBaseUrl(request);
	String pegasusPrintServiceUrl = PegasusConfigUtils.getPegasusPrintServiceUrl();	
	String wssoUrl = PegasusConfigUtils.getPegasusWssoUrl();
	boolean isSkdMxModeEnabled = PegasusConfigUtils.isEnableSkdMxMode();
	String skdMxMode = CommonConstants.EMPTY_STRING;
	if(StringUtils.isNull(isSkdMxModeEnabled)){
		skdMxMode =  CommonConstants.EMPTY_STRING;
	}else if(isSkdMxModeEnabled){
		skdMxMode =  CommonConstants.EMPTY_STRING;
	}else if(!isSkdMxModeEnabled){		
		skdMxMode = "none";
	}else {
		skdMxMode = CommonConstants.EMPTY_STRING;
	}
%>
<bean:define id="isAdvanceQueryModule" value="Y" scope="request"/>
<bean:parameter id="isSimpleQuery" name="isSimpleQuery" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<script>
	var CONTEXT_NAME = "<%=contextName%>";
	var SERVER_URL = "<%=serverUrl%>";  
	var WSSO_URL = "<%=wssoUrl %>";
	if(WSSO_URL == undefined || WSSO_URL == ""){
		WSSO_URL  = SERVER_URL; 
	}
	
	var mapLevelConfiguration =[];
	<%
		String mapConfigValue;
		for(int i=0; i<20; i++){
			mapConfigValue = PegasusConfigUtils.getMapConfigValue("level"+i);
			if(!StringUtils.isNull(mapConfigValue)){
	%>
				mapLevelConfiguration["<%="level"+i%>"] = "<%=mapConfigValue%>";
	<%		}
		}
	%>	
</script>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<!--  Kendo UI Framework -->
<link href="<%=contextName%>/pegasus/styles/kendo.common.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.default.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.dataviz.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.dataviz.default.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- Pegasus Application CSS-->
<link href="<%=contextName%>/pegasus/portalcss/bluetheme.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
<link href="<%=contextName%>/pegasus/portalcss/icons.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->

<!-- Pegasus TreeGrid CSS-->
<link href="<%=contextName%>/pegasus/portalcss/treegrid/index.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/treegrid/flexicious.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/treegrid/jquery-ui-1.9.1.custom.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<%-- <link href="<%=contextName%>/pegasus/portalcss/treegrid/custom.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> --%>
</head>
<body>
<!-- Pegasus TreeGrid JS-->
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery-1.8.2.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery-ui-1.9.1.custom.min.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery.maskedinput-1.3.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery.watermarkinput.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery.ui.menu.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/jquery.toaster.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/jquery/treegrid/minified-compiled-jquery.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/loggerUtil.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/pegasus.constants.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonUtils.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/log4javascript/log4javascript.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/treegrid/themes.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/js/treegrid/Configuration.js<%=jsVersion%>" type="text/javascript" ></script>
<script src="<%=contextName%>/pegasus/js/treegrid/CustomFilterControl.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/treegrid/CustomHeaderCell.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/widgets/advancedDataGrid.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/widgets/searchPopUp.js<%=jsVersion%>" type="text/javascript"></script>
<script src="<%=contextName%>/pegasus/portaljs/utils/componentUtils.js<%=jsVersion%>" type="text/javascript"></script>

<script src="<%=contextName%>/pegasus/js/kendo/jquery.min.js<%=jsVersion%>"></script>
<%-- <script src="<%=contextName%>/pegasus/js/kendo/angular.min.js<%=jsVersion%>" ></script> --%>
<script src="<%=contextName%>/pegasus/js/kendo/kendo.all.min.js<%=jsVersion%>" ></script>

<script src="<%=contextName%>/pegasus/jquery/jquery-ui.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/pegasus.constants.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/loggerUtil.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonUtils.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/log4javascript/log4javascript.js<%=jsVersion%>"></script>

<link href="<%=contextName%>/pegasus/styles/kendo.rtl.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.mobile.all.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
</body>