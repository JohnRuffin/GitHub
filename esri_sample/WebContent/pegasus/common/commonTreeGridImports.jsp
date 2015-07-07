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
%>
<bean:define id="isAdvanceQueryModule" value="Y" scope="request"/>
<bean:parameter id="isSimpleQuery" name="isSimpleQuery" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<!--  Tree Grid UI Framework -->
<!-- Pegasus Application CSS-->
<%-- <link href="<%=contextName%>/pegasus/portalcss/bluetheme.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows --> --%>
<link href="<%=contextName%>/pegasus/portalcss/bluetheme.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/portalcss/icons.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
</head>
<script>
	var CONTEXT_NAME = "<%=contextName%>";
	var SERVER_URL = "<%=serverUrl%>"; 
	var WSSO_URL = "<%=wssoUrl %>";
	if(WSSO_URL == undefined || WSSO_URL == ""){
		WSSO_URL  = SERVER_URL; 
	}
</script>
<body>

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
<script src="<%=contextName%>/pegasus/js/treegrid/jquery.ui-contextmenu.js<%=jsVersion%>"></script>
</body>