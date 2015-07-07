<%@ taglib uri="/tags/struts-bean" prefix="bean" %>
<%@ taglib uri="/tags/struts-logic" prefix="logic" %>
<%@ taglib uri="/tags/struts-html" prefix="html" %>
<%@ taglib uri="/tags/struts-nested" prefix="nested" %>
<%@ taglib uri="/tags/fileupload" prefix="upload" %>
<%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>
<%@ page import="com.spacetimeinsight.fedex.utils.PegasusDBUtils" %>

<html:html locale="true">
<head>
    <jsp:include page="/common/style.jsp"/>
    <style type="text/css">
        @import "<%=ServerUtils.getContextName(request)%>/js/dojo/resources/dojo.css";
        @import "<%=ServerUtils.getContextName(request)%>/js/dijit/themes/tundra/tundra.css";

        th{
            font-weight: bold;
            margin-left: 10px;
            align-content: center;
        }
    </style>
    <title>Dynamic javascript framework for Esri Map</title>

</head>
<body class="tundra bodybg">
<form name="configureRulesForm" method="post" action="<%=ServerUtils.getContextName(request)%>/dynamicJavascript.do">
    <input type="hidden" name="operation" id="operation" value="saveRules" />
    <table width="100%" height="100%">
        <tr>
            <th>isDrawMirrorLineByActualCoordinates</th>
            <td>
                <textarea id="isDrawMirrorLineByActualCoordinates" name="isDrawMirrorLineByActualCoordinates" style="width: 1100px; height: 130px;"><%=PegasusDBUtils.getRuleValue("isDrawMirrorLineByActualCoordinates") %></textarea>
            </td>
        </tr>
        <tr>
            <th>distanceFactor</th>
            <td>
                <textarea id="distanceFactor" name="distanceFactor" style="width: 1100px; height: 230px;"><%=PegasusDBUtils.getRuleValue("distanceFactor") %></textarea>
            </td>
        </tr>
        <tr>
            <th>isDrawMirrorLine</th>
            <td>
                <textarea id="isDrawMirrorLine" name="isDrawMirrorLine" style="width: 1100px; height: 230px;"><%=PegasusDBUtils.getRuleValue("isDrawMirrorLine") %></textarea>
            </td>
        </tr>
        <tr>
            <th>isGeodesicLineException</th>
            <td>
                <textarea id="isGeodesicLineException" name="isGeodesicLineException" style="width: 1100px; height: 230px;"><%=PegasusDBUtils.getRuleValue("isGeodesicLineException") %></textarea>
            </td>
        </tr>
        <tr>
            <th>isDrawMirrorLineException</th>
            <td>
                <textarea id="isDrawMirrorLineException" name="isDrawMirrorLineException" style="width: 1100px; height: 230px;"><%=PegasusDBUtils.getRuleValue("isDrawMirrorLineException") %></textarea>
            </td>
        </tr>
        <tr>
            <td colspan="2" align="center">
                <input type="submit" id="saveBtn" value="Save" />
            </td>
        </tr>
    </table>
    <br/>
    <br/>
</form>
</body>
</html:html>