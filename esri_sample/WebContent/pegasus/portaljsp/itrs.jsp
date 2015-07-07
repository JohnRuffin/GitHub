  <html>
  <head>
    <title>ITRS Placeholder</title>

    <%@page import="com.spacetimeinsight.fedex.common.PegasusConfigUtils"%>
    <%@page import="com.enterprisehorizons.magma.server.util.ServerUtils"%>

    <%
      // added for ITRS -tc
      String jsVersion = PegasusConfigUtils.getVersionString(false);
      String contextName = ServerUtils.getContextName(request);
      String serviceServerUrl = PegasusConfigUtils.getPegasusServiceServerUrl();
    %>

    <script type="text/javascript">
      var CONTEXT_NAME = "<%=contextName %>";
      var PEGASUS_SERVICE_SERVER_URL = "<%=serviceServerUrl %>";
    </script>

    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=PT+Sans+Narrow" />
  
    <!-- styles for ITRS Timeline -->
    <link href="<%=contextName%>/pegasus/portalcss/itrs/vis-3.12.0.min.css" rel="stylesheet" type="text/css">
    <link href="<%=contextName%>/pegasus/portalcss/itrs/jquery.qtip.min.css" rel="stylesheet" type="text/css">

    <!-- styles for sliderWinOpt and Pegasus UI -->
    <link href="<%=contextName%>/pegasus/styles/kendo.common.min.css<%=jsVersion%>" rel="stylesheet">
    <link href="<%=contextName%>/pegasus/styles/kendo.default.min.css<%=jsVersion%>" rel="stylesheet">
    <link href="<%=contextName%>/pegasus/portalcss/bluetheme.css<%=jsVersion%>" rel="stylesheet">
    <link href="<%=contextName%>/pegasus/portalcss/icons.css<%=jsVersion%>" rel="stylesheet">
    <!-- ### used mine -tc ### -->
    <link href="<%=contextName%>/pegasus/portalcss/itrs/sliderPanel.css<%=jsVersion%>" rel="stylesheet">
    
    <!-- styles added orig/dest, etc. -->
    <link href="<%=contextName%>/pegasus/portalcss/dayControl.css<%=jsVersion%>" rel="stylesheet">
    <link href="<%=contextName%>/pegasus/portalcss/queryWindow.css<%=jsVersion%>" rel="stylesheet">
    
    <link href="<%=contextName%>/pegasus/portalcss/itrs/itrs-light.css" rel="stylesheet" type="text/css">
    
    <!-- shared JS files -->
    <script src="<%=contextName%>/pegasus/js/kendo/jquery.min.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/commonUtils.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/js/log4javascript/log4javascript.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/loggerUtil.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/serviceUtils.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/pegasusHeader.js<%=jsVersion%>" type="text/javascript"></script>
    
    <!-- JS files for slideWinOpt and Pegasus UI -->
    <script src="<%=contextName%>/pegasus/jquery/jquery-ui.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/jquery/jquery.ui.panel.js<%=jsVersion%>" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/js/kendo/kendo.all.min.js<%=jsVersion%>" type="text/javascript"></script>
    <!-- ### used mine -tc ### -->
    <script src="<%=contextName%>/pegasus/portaljs/itrs/uicontrols.js" type="text/javascript"></script>
    
    <!-- scripts added for orig/dest, etc. -->
    <!--
    <script src="scripts/portaljs/data.utils.js" type="text/javascript"></script>
    <script src="scripts/portaljs/pegasus.constants.js" type="text/javascript"></script>
    <script src="scripts/portaljs/PegasusViewer.js" type="text/javascript"></script>
    <script src="scripts/portaljs/queryWindow.js" type="text/javascript"></script>
    <script src="scripts/portaljs/widgets/advancedDataGrid.js" type="text/javascript"></script>
    <script src="scripts/portaljs/widgets/searchPopUp.js" type="text/javascript"></script>
    -->
    
    <!-- JS files for ITRS Timeline -->
    <script src="<%=contextName%>/pegasus/portaljs/itrs/vis-custom-3.12.0.min.js" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/itrs/jquery.qtip.min.js" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/itrs/spin.min.js" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/itrs/handlebars-v3.0.1.js" type="text/javascript"></script>

    <script src="<%=contextName%>/pegasus/portaljs/itrs/itrs-core.js" type="text/javascript"></script>
    <script src="<%=contextName%>/pegasus/portaljs/itrs/utilities.js" type="text/javascript"></script>

  </head>

  <body class="claro">
    <div id="itrsOptions" class="itrsSlidingWinOpt" style="width:560px;">
      <div class="header-title">
        Interactive TRAC/Route Sheet
      </div>
      <div class="itrsSlidingWinContent" style="overflow:hidden">
        <div class="itrsSlidingWinContent-innercontainer" style="margin-top: -1px; height:98%"> 
          <div id="displayOptionsTabstrip" class="panelBG">
            <ul class="tabStripBar display-tabstripbar" style="position:relative; width:99.4%">
              <li id="configureTab" class="k-state-active">Configuration</li>
              <li id="optionsTab">Display Options</li>
              <li id="groundTimeTab">Ground Time</li>
              <li id="legendTab">Legend</li>
              <div class="buttonbar-in-tabstrip ui-state-default"><input type="button" id="applyDisplaySettings" onclick="applyDisplaySettings(getSelectedEqTypes())"
                style="padding-top:1px;padding-left:10px;padding-right:10px;padding-bottom:2px;min-width:55px;width:55px;
                min-height:16px;height:16px !important;position:absolute;top:-2px;right:0px" value="Apply"></div>
            </ul>

            <!-- Insert content here -->

            <%@ include file="/pegasus/portaljsp/configuration.jsp" %>
            
            <%@ include file="/pegasus/portaljsp/displayOptions.jsp" %>

            <%@ include file="/pegasus/portaljsp/groundTime.jsp" %>

            <%@ include file="/pegasus/portaljsp/legend.jsp" %>

          </div>
        </div>
      </div>
    </div>

    <div id="spacer">
      &nbsp;
    </div>

    <div id="dialog"></div>

    <div id="messageArea" style="display:none;">
        <span id="validationError"
          style="margin-left:20px;color:red;font-weight:bold;">&nbsp;</span>
    </div>

    <div id="visualization" style="margin-left:8px;margin-right:8px;"></div>
    
    <div id="itrsSection" class="itrsSection">
      <img class="watermark" src="<%=contextName%>/pegasus/assets/itrs/airplane_takeoff-512x512.png" />
    </div>

    <div id="loading"></div>

    <div id="summaryDetailPopup"></div>

    <!-- Handlebars templates for tooltips -->
    <script id="leg-tooltip-template" type="text/x-handlebars-template">
      <div align="center"><b>{{movenbr}}</b><br/>
      <table style="font-size:11;color:black;" cellpadding="2" cellspacing="6">
        <tr>
          <td>{{orig}}-{{dest}}</td><td>&nbsp;</td><td align="right">{{dptrtm}}-{{arvltm}} {{tmflg}}</td>
        </tr>
        <tr>
          <td>Blk: {{blktm}}</td><td>&nbsp;</td><td align="right">Gnd: {{gndtm}}</td>
        </tr>
        <tr>
          <td>Cube: {{cubeload}}%</td><td>&nbsp;</td><td align="right">Wgt: {{wgtload}}%</td>
        </tr>
      </table>
      </div>
    </script>
      <!--
      {{orig}} {{dptrtm}} to {{dest}} {{arvltm}}<br/>
      Flt Tm: {{flttm}} - Gnd Tm: {{gndtm}}<br/>
      Cube: {{cubeload}}% - Wgt: {{wgtload}}%</div>
      -->

    <script id="activity-tooltip-template" type="text/x-handlebars-template">
      <div align="center"><b>{{acty}}</b><br/>
      <table style="font-size:11;color:black;" cellpadding="2" cellspacing="6">
        <tr>
          <td>{{orig}}</td><td>&nbsp;</td><td align="right">{{dptrtm}}-{{arvltm}} {{tmflg}}</td>
        </tr>
        <tr>
          <td>&nbsp;</td><td>&nbsp;</td><td align="right">Gnd: {{gndtm}}</td>
        </tr>
      </table>
      </div>
    </script>

    <script id="non-package-stage-tooltip-template" type="text/x-handlebars-template">
      <div align="center"><b>{{movenbr}}</b><br/>
      <table style="font-size:11;color:black;" cellpadding="2" cellspacing="6">
        <tr>
          <td>{{orig}}-{{dest}}</td><td>&nbsp;</td><td align="right">{{dptrtm}}-{{arvltm}} {{tmflg}}</td>
        </tr>
        <tr>
          <td>Blk: {{blktm}}</td><td>&nbsp;</td><td align="right">Gnd: {{gndtm}}</td>
        </tr>
      </table>
      </div>
    </script>

    <!-- Handlebars templates for items -->
    <script id="activity-template" type="text/x-handlebars-template">
      <div class="activity">{{acty}} - {{orig}} <!-- {{dptrtm}}-{{arvltm}} -->
        (Gnd: {{gndtm}})</div>
    </script>

    <script id="leg-template" type="text/x-handlebars-template">
      <div class="leg">{{orig}}-{{dest}}</div>
    </script>

    <script id="leg-cycle-template" type="text/x-handlebars-template">
      <div class="leg">{{orig}}_</div>
    </script>

    <script id="leg-cycle-end-template" type="text/x-handlebars-template">
      <div class="leg">{{orig}}_{{dest}}</div>
    </script>

    <script id="activity-multiline-template" type="text/x-handlebars-template">
      <div class="activity">{{acty}} - {{orig}} </div>
      <div>{{dptrtm}}-{{arvltm}} (Gnd: {{gndtm}}) </div>
    </script>

    <script id="leg-multiline-template" type="text/x-handlebars-template">
      <div class="leg">{{movenbr}}<br/>{{orig}}/{{dptrtm}}-{{dest}}/{{arvltm}}</div>
    </script>

    <script id="ground-time-template" type="text/x-handlebars-template">
      <div class="ground-time">{{gndtm}}</div>
    </script>

    <script id="group-template" type="text/x-handlebars-template">
      <span class="tailnbr">{{tailnbr}}</span><br/>{{eqdesc}}
    </script>

     <!-- 757-200 ROLLS (22) - 67 Available, 66 Used in Plan, 66 Used - 45 Min. Ground Time -->
    <script id="equipment-summary-template" type="text/x-handlebars-template">
      <div class="summary">{{eqdesc}} ({{eqtype}}) - {{acavblqty}} Available, 
        {{planactqty}} Used in Plan,
        {{acactqty}} Used - {{mingndtmqty}} Min. Ground Time</div>
    </script>

  </body>
</html>
