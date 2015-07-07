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
%>
<bean:define id="isAdvanceQueryModule" value="Y" scope="request"/>
<bean:parameter id="isSimpleQuery" name="isSimpleQuery" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<script>
	var CONTEXT_NAME = "<%=contextName%>";
	var SERVER_URL = "<%=serverUrl%>";   	
</script>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<!--  Kendo UI Framework -->
<link href="<%=contextName%>/pegasus/styles/kendo.common.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />
<link href="<%=contextName%>/pegasus/styles/kendo.default.min.css<%=jsVersion%>" rel="stylesheet" type="text/css" />

<!-- Pegasus Application Simple Query Module-->
<link href="<%=contextName%>/pegasus/portalcss/sqw/sqw_bluetheme.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
<link href="<%=contextName%>/pegasus/portalcss/sqw/sqw_search_tab.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- Single Query Window - css for search panel -->
<link href="<%=contextName%>/pegasus/portalcss/sqw/sqw_modal_window.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- Single Query Window - css for modal window -->
<link href="<%=contextName%>/pegasus/portalcss/sqw/sqw_filter_tab.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- Single Query Window - css for filter panel -->
<link href="<%=contextName%>/pegasus/portalcss/sqw/sqw_calendar_widget.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- Single Query Window - css for Calendar Widget -->

<link href="<%=contextName%>/pegasus/portalcss/icons.css<%=jsVersion%>" rel="stylesheet" type="text/css" /> <!-- css for windows -->
</head>
<body>
<script src="<%=contextName%>/pegasus/js/kendo/jquery.min.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/kendo/kendo.all.min.js<%=jsVersion%>" ></script>
<script src="<%=contextName%>/pegasus/jquery/jquery-ui.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/pegasus.constants.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/loggerUtil.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/portaljs/commonUtils.js<%=jsVersion%>"></script>
<script src="<%=contextName%>/pegasus/js/log4javascript/log4javascript.js<%=jsVersion%>"></script>
</body>