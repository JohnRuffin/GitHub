          <!--
            |
            | TRAC Parameters: Configuration tab
            |
            -->
          <div class="sliding-content-container" id="configurePnl">
            <div class="section-box">
              <div>
                <label class="section-header">TRAC Parameters</label>
              </div>
              <div class="section-box-content">
                <table border="0">
                  <tr> 
                    <td class="itrs-start"><label class="itrs" for="planComboBox" style="padding-right:5px;">Plan</label></td>
                    <td class="itrs"><select id="planComboBox" style="width:100px;">
                      <!-- Loaded programmatically -->
                    </select></td>

                    <td class="itrs-start"><label class="itrs" for="schedComboBox" style="padding-right:5px;">Schedule</label></td>
                    <td class="itrs"><select id="schedComboBox" style="width:80px;">
                      <option value="Master" selected="selected"> Master </option>
                    </select></td>
                  </tr>

                  <tr>
                    <td class="itrs-start"><label class="itrs" for="daysText" style="padding-right:5px;">Days</label></td>
                    <td class="itrs"><input type="text" id="daysText" maxlength="5" size="5"
                        style="height:20px;width:100px;"></td>

                    <td class="itrs-start"><label class="itrs" for="assignComboBox" style="padding-right:5px;">Assignment</label></td>
                    <td class="itrs"><select id="assignComboBox" style="width:60px;">
                      <option value="LIFO"> LIFO </option>
                      <option value="FIFO"> FIFO </option>
                    </select></td>
                  </tr>

                  <tr>
                    <td class="itrs-start" colspan="2">
                    <input id="phaseInChkBox" type="checkbox"><label class="itrs" for="phaseInChkBox" 
                      style="padding-left:15px;">Phase In</label> 
                    <input id="phaseOutChkBox" type="checkbox"><label class="itrs" for="phaseOutChkBox"
                      style="padding-left:15px;">Phase Out</label></td>

                    <td class="itrs-start"><label class="itrs" for="patternCmbBox" style="padding-right:5px;">Pattern Matching</label></td>
                    <td class="itrs"><select id="patternCmbBox" style="width:60px;">
                      <option value="none" selected="selected"> None </option>
                      <option value="old"> Old </option>
                      <option value="new"> New </option>
                    </select></td>
                  </tr>

                  <tr>
                    <td class="itrs-start" colspan="2" style="padding-top:0px;">
                    <input id="forcedLinksChk" type="checkbox"><label class="itrs" for=
                    "forcedLinksChk" style="padding-left:15px;">Use Forced Links</label></td>
                    <td class="itrs-start" colspan="2" style="padding-top:0px;">
                    <input id="mergeTypesChk" type="checkbox"><label class="itrs" for="mergeTypesChk" 
                      style="padding-left:15px;">Merge Equip Types</label></td>
                  </tr>
 
                   <tr>
                    <td class="itrs-start" colspan="2" style="padding-top:0px;">
                    <input id="cycleModeChkBox" type="checkbox"><label class="itrs" for="cycleModeChkBox" 
                      style="padding-left:15px;">Use Cycle Mode</label></td>
                  </tr>

                  <tr>
                    <td class="itrs-start" style="padding-top:0px;">&nbsp;</td>
                    <td class="itrs">
                      <input type="text" id="break1" maxlength="4" size="4"
                        style="height:20px;" value="0145" disabled="disabled">&nbsp;
                      <input type="text" id="break2" maxlength="4" size="4"
                        style="height:20px;" value="0715" disabled="disabled">&nbsp;
                      <input type="text" id="break3" maxlength="4" size="4"
                        style="height:20px;" value="1800" disabled="disabled"></td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="section-box">
              <div>
                <label class="section-header">Equipment Types</label>
              </div>
              
              <!-- TODO Add controls -->
              <div class="section-box-content">
                <p>Select the equipment types to show.</p>
                <!--
                  "Snapshot" version of table
                -->
                <table id="prototypeEqTable" border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="allEqRadBtn" type="radio" name="eqType" value="all">
                    <label class="itrs" for="allEqRadBtn"
                      style="padding-left:15px;padding-right:5px">All</label></td>
                    
                    <td style="padding-left:15px">
                    <input id="a300RadBtn" type="radio" name="eqType" value="a300">
                    <label class="itrs" for="a300RadBtn"
                      style="padding-left:15px;padding-right:5px">A300 [<i>55, 58 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b737RadBtn" type="radio" name="eqType" value="b737">
                    <label class="itrs" for="b737RadBtn"
                      style="padding-left:15px;padding-right:5px">B737 [<i>37, 90 </i>]</label></td>

                    <td style="padding-left:15px">
                    <input id="a310RadBtn" type="radio" name="eqType" value="a310">
                    <label class="itrs" for="a310RadBtn"
                      style="padding-left:15px;padding-right:5px">A310 [<i>57, 59 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b757RadBtn" type="radio" name="eqType" value="b757">
                    <label class="itrs" for="b757RadBtn"
                      style="padding-left:15px;padding-right:5px">B757 [<i>22, 23, 67 </i>]</label></td>

                    <td style="padding-left:15px">
                    <input id="md10RadBtn" type="radio" name="eqType" value="md10">
                    <label class="itrs" for="md10RadBtn"
                      style="padding-left:15px;padding-right:5px">MD10 [<i>88 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b767RadBtn" type="radio" name="eqType" value="b767">
                    <label class="itrs" for="b767RadBtn"
                      style="padding-left:15px;padding-right:5px">B767 [<i>52, 76</i>]</label></td>

                    <td style="padding-left:15px">
                    <input id="md11RadBtn" type="radio" name="eqType" value="md11" checked="checked">
                    <label class="itrs" for="md11RadBtn"
                      style="padding-left:15px;padding-right:5px">MD11 [<i>16, 26 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b777RadBtn" type="radio" name="eqType" value="b777">
                    <label class="itrs" for="b777RadBtn"
                      style="padding-left:15px;padding-right:5px">B777 [<i>83 </i>]</label></td>

                    <td style="padding-left:15px">
                    <input id="sampleEqRadBtn" type="radio" name="eqType" value="b757-sample">
                    <label class="itrs" for="sampleEqRadBtn"
                      style="padding-left:15px;padding-right:5px">B757 "Sample" [<i>22, 23</i>]</label></td>
                  </tr>
                  <tr>
                    <td></td>

                    <td style="padding-left:15px">
                    <input id="md11SampleRadBtn" type="radio" name="eqType" value="md11-sample"
                      checked="checked">
                    <label class="itrs" for="md11SampleRadBtn"
                      style="padding-left:15px;padding-right:5px">MD11 "Sample" [<i>16, 26</i>]</label></td>
                  </tr>
                </table>


                <!--
                  Live version of table
                  o   B777 (83)
                  o   MD11 (16, 26) ***
                  o   MD30 (97, 98)
                  o   MD10 (88)
                  o   B767  (52,76)
                  o   A300 (55, 58)
                  o   A310 (56, 57, 59)
                  o   B757 (22, 23, 67)
                -->
                <table id="liveEqTable" border="0">
                  <tr>
                    <td style="padding-left:15px">
                    <input id="a300ChkBx" type="checkbox" name="a300EqType" value="a300">
                    <label class="itrs" for="a300ChkBx"
                      style="padding-left:15px;padding-right:5px">A300 [<i>55, 58 </i>]</label></td>

                    <td style="padding-left:15px">
                    <input id="b777EqChkBx" type="checkbox" name="b777EqType" value="b777">
                    <label class="itrs" for="b777EqChkBx"
                      style="padding-left:15px;padding-right:5px">B777 [<i>83 </i>]</label></td>

                    <td style="padding-left:15px" rowspan="2" valign="bottom">
                    <input id="selectAllBtn" type="button" name="selectAll" value="Select All"
                      style="padding-left:15px;min-height:16px;height:16px !important"
                      onclick="selectAllEqTypes(true)"></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="a310ChkBx" type="checkbox" name="a310EqType" value="a310">
                    <label class="itrs" for="a310ChkBx"
                      style="padding-left:15px;padding-right:5px">A310 [<i>56, 57, 59 </i>]</label></td>
                    
                    <td style="padding-left:15px">
                    <input id="md10ChkBx" type="checkbox" name="md10EqType" value="md10">
                    <label class="itrs" for="md10ChkBx"
                      style="padding-left:15px;padding-right:5px">MD10 [<i>88 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b737EqChkBx" type="checkbox" name="b737EqType" value="b737">
                    <label class="itrs" for="b737EqChkBx"
                      style="padding-left:15px;padding-right:5px">B737 [<i>37 </i>]</label></td>
                    
                    <td style="padding-left:15px">
                    <input id="md11ChkBx" type="checkbox" name="md11EqType" value="md11">
                    <label class="itrs" for="md11ChkBx"
                      style="padding-left:15px;padding-right:5px">MD11 [<i>16, 26 </i>]</label></td>

                    <td style="padding-left:15px" rowspan="2" valign="top">
                    <input id="deselectAllBtn" type="button" name="deselectAll" value="Deselect All"
                      style="padding-left:15px;min-height:16px;height:16px !important"
                      onclick="selectAllEqTypes(false)"></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b757EqChkBx" type="checkbox" name="b757EqType" value="b757">
                    <label class="itrs" for="b757EqChkBx"
                      style="padding-left:15px;padding-right:5px">B757 [<i>22, 23, 67 </i>]</label></td>
                    
                    <td style="padding-left:15px">
                    <input id="md30ChkBx" type="checkbox" name="md30EqType" value="md30">
                    <label class="itrs" for="md30ChkBx"
                      style="padding-left:15px;padding-right:5px">MD30 [<i>97, 98 </i>]</label></td>
                  </tr>
                  <tr>
                    <td style="padding-left:15px">
                    <input id="b767EqChkBx" type="checkbox" name="b767EqType" value="b767">
                    <label class="itrs" for="b767EqChkBx"
                      style="padding-left:15px;padding-right:5px">B767 [<i>52, 76 </i>]</label></td>

                    <td style="padding-left:15px"></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
