<%@ taglib uri="/tags/struts-bean" prefix="bean" %>
<%@ taglib uri="/tags/struts-logic" prefix="logic" %>
<%@ taglib uri="/tags/struts-html" prefix="html" %>
<%@ taglib uri="/tags/struts-nested" prefix="nested" %>
<%@ taglib uri="/tags/fileupload" prefix="upload" %>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
<!DOCTYPE html>
<html>
<head lang="en">
    <jsp:include page="/common/style.jsp"/>
    <meta charset="UTF-8">
    <style type="text/css">
        @import "<%=ServerUtils.getContextName(request)%>/js/dojo/resources/dojo.css";
        @import "<%=ServerUtils.getContextName(request)%>/js/dijit/themes/tundra/tundra.css";
    </style>
    <script>
        function loadIframeRenderer(uri){
            if(uri != undefined){
                document.getElementById("iframeDiv").src=uri;
            }
        }
    </script>
</head>
<body  style="margin-left: 10px;" class="tundra bodybg" >
    <br/>
    <h2> Menu Options: </h3>
    <li>
        <ul><a href="#" onclick="loadIframeRenderer('dynamicJavascript.do?operation=loadRules')">Configure Map Rules</a></ul>
    </li>

    <br/>
    <iframe width="98%" height="700px" id="iframeDiv"></iframe>
    <button style=" margin-left: 50%;margin-right: 35px;margin-top: 10px;"
            dojoType="dijit.form.Button"
            type="button"
            onclick="window.location =  '<%=ServerUtils.getContextName(request)%>/adminMain.do'  ">
        <bean:message key="admin.monitor.home.button" bundle="admin" />
    </button>
</body>
</html>