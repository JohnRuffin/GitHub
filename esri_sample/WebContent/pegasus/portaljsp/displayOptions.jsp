          <!--
            |
            | TRAC Parameters: Display Options tab
            |
            -->
          <div class="sliding-content-container" id="optionsPnl">
            <div class="section-box">
              <div><label class="section-header">General</label></div>

              <div class="section-box-content">
                <table border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="multiLineChkBox" type="checkbox">
                    <label class="itrs" for= "multiLineChkBox"
                      style="padding-left:15px;padding-right:5px">Show Move Number</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="showLoadInfoChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="showLoadInfoChkBox" 
                      style="padding-left:15px;padding-right:5px">Show Load Info</label></td>
                  </tr>

                  <tr>
                    <td class="itrs-start">
                      <input id="showZuluRadBtn" type="radio" name="timeZone" value="zulu" checked="checked"><label class="itrs" for="showZuluRadBtn" style="padding-left:15px;">Show Zulu Times</label></td>
                    <td class="itrs">
                      <input id="showLocalRadBtn" type="radio" name="timeZone" value="local" ><label class="itrs" for="showLocalRadBtn" style="padding-left:15px;">Show Local Times</label></td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="section-box">
              <div>
                <label class="section-header">Origins and
                Destinations</label>
              </div>

              <div class="section-box-content">
                <!-- TODO Add content -->
                <p>Focus on specific origins and destinations</p>

                <div id="origDestDisplayWindow" style="padding:0px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                  <!-- <table cellspacing="0" cellpadding="0" border="0" height="100%" width="100%" style="min-width: 250px"> -->
                    <tr>
                      <td style="width:173px;" valign="top"><textarea tabindex="2" id="origDestDispOrigin" placeholder="Origins" rows="2" style="width:95%;resize:none;min-height:50px;padding:4px 0 0 4px;"></textarea></td><!-- onkeyup="styleChangeHandler('orignDestWinOrigin')" -->
                      <td valign="top">
                        <a href="#" title="Open a popup" style="margin-left:5px;cursor:pointer;"><!-- onclick="parent.openSelectLocDialog('orignDestWinOrigin', 'Select Origins', undefined, undefined, false, null, null, this)" --><span class="k-icon k-i-list-popup"></span></a>
                      </td>
                      <td valign="top">
                        <table style="padding-left:5px;padding-right:5px">
                          <tr><td style="width:100px;text-align:center;padding-bottom:3px"><select tabindex="3" id="operatorCmb" style="width:60px;text-align:left;">
                            <option value="or" selected="selected"> OR </option>
                            <option value="and"> AND </option>
                            <option value="bi"> BI </option>
                          </select></td></tr>
                        </table>
                      </td>
                      <td style="width: 173px;"><textarea tabindex="4" id="origDestDispDest" placeholder="Destinations" rows="2" style="width: 95%;resize: none;min-height: 50px;padding: 4px 0 0 4px;"></textarea></td><!-- onkeyup="styleChangeHandler('orignDestWinDest')" -->
                      <td valign="top">
                        <a href="#" title="Open a popup" style="margin-left:5px; cursor: pointer;"><!-- onclick="parent.openSelectLocDialog('orignDestWinDest','Select Destinations', undefined, undefined, false, null, null, this)" --><span class="k-icon k-i-list-popup"></span></a>
                      </td>
                    </tr>
                  </table>
                </div>

              </div>
            </div>

            <div class="section-box">
              <div>
                <label class="section-header">Leg Types</label>
              </div>

              <div class="section-box-content">
                <p>Focus on the selected types of legs ("dims" out the others)</p>
                <table border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="maintenanceLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="maintenanceLegChkBox"
                      style="padding-left:15px;padding-right:5px">Maintenance Legs</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="spareLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="spareLegChkBox"
                      style="padding-left:15px;padding-right:5px">Spare Legs</label></td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-left:15px">
                    <input id="nonPackageLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="nonPackageLegChkBox" 
                      style="padding-left:15px;padding-right:5px">Non-Package Legs [<i>B, C, D, E, G, J, M, O, T, U, V, X</i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="stagingLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="stagingLegChkBox"
                      style="padding-left:15px;padding-right:5px">Staging Legs [<i>Q, R, S</i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="packageLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for= "packageLegChkBox"
                      style="padding-left:15px;padding-right:5px">Package Legs [<i>A, F, H, I, P</i>]</label></td>
                  </tr>
                  <!--
                  <tr>
                    <td style="padding-left:15px">
                    <input id="charterLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for="charterLegChkBox"
                      style="padding-left:15px;padding-right:5px">Charter Legs [<i>C, R, U</i>]</label></td>
                  </tr>
                  -->
                </table>
              </div>

              <div class="section-box-content">
                <p>Focus on selected groups of legs ("dims" out the others)</p>
                <table border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="domLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for= "domLegChkBox"
                      style="padding-left:15px;padding-right:5px">Domestic Legs [<i>B, D, F, P, S</i>]</label></td>
                    <td style="padding-left:15px">
                    <input id="intlLegChkBox" type="checkbox" checked="checked">
                    <label class="itrs" for= "intlLegChkBox"
                      style="padding-left:15px;padding-right:5px">International Legs [<i>E, H, I, Q</i>]</label></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
