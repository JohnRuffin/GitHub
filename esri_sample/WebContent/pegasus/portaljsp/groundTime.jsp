          <!--
            |
            | TRAC Parameters: Ground Time tab
            |
            -->
          <div class="sliding-content-container" id="groundTimePnl">
            <div class="section-box">
              <div>
                <label class="section-header">Location(s)</label>
              </div>

              <div class="section-box-content">
                <p>Highlight ground time at the following locations (none = all):</p>
                <div id="locationGndTmWindow">
                  <table cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="width: 173px"><textarea tabindex="2" id="locationGndTm" placeholder="Locations"  rows="2" style="width: 95%;resize: none;min-height: 50px;padding: 4px 0 0 4px;"></textarea></td><!-- onkeyup="styleChangeHandler('orignDestWinOrigin')" -->
                      <td valign="top">
                        <a href="#" title="Open a popup" style="margin-left:5px; cursor: pointer;"><!-- onclick="parent.openSelectLocDialog('orignDestWinOrigin', 'Select Origins', undefined, undefined, false, null, null, this)" --><span class="k-icon k-i-list-popup"></span></a>
                      </td>
                    </tr>
                  </table>
                </div>

                <!--
                <table border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="memGndTmChkBox" type="checkbox">
                    <label class="itrs" for= "memGndTmChkBox"
                      style="padding-left:15px;padding-right:5px">More than 6:00 in MEM</label></td>
                  </tr>
                </table>
                -->
                </div>
            </div>

            <div class="section-box">
              <div>
                <label class="section-header">Duration</label>
                <!-- <label class="section-header">Duration and Days</label> -->
              </div>

              <div class="section-box-content">
                <p>Highlight ground time that exceeds this duration (hh:mm):</p>
                <div id="daysDurationGndTmWindow">
                  <table cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding-left: 15px;">
                      <label class="itrs" style="padding-right:5px;">Duration</label></td>
                      <td><input type="text" id="durationGndTmText" maxlength="5" size="8" placeholder="hh:mm" tabindex="3"></td>
                    </tr>
                    <!--
                    <tr height="100%">
                      <td style="padding-left: 15px;">
                      <label class="itrs" style="padding-right:5px;">Days</label></td>
                      <td><input type="text" id="daysGndTmText" maxlength="5" size="5" value="8-12" tabindex="4" disabled="disabled"></td>
                    </tr>
                  -->
                  </table>
                </div>
              </div>
            </div>
          </div>
