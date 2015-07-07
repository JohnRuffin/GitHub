<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<div id="calenderDiv">
	<div id="calTimeTypeDiv" align="left">
		<a id="localtime" href="#" onclick="changeLocalToZulu(false)">Local time</a><a id="zulutime" href="#" onclick="changeLocalToZulu(true)">Zulu time</a>
	</div>
	<div id="switchMonthPlanViewDiv" align="left">
		<a id="planViewTab" href="#" onclick="toggleMPView(this);">Plan view</a><a id="monthViewTab" href="#" onclick="toggleMPView(this);">Calendar view</a>
	</div>
	                 
   	<div id="monthViewDiv">
		<table id="monthViewTable" cellspacing="0" cellpadding="0" class="tableStyle">
			<tr class="unSelectableWeekBoxStyle">
				<td></td>
				<td>M</td>
				<td>T</td>
				<td>W</td>
				<td>T</td>
				<td>F</td>
				<td>S</td>
				<td>S</td>
			</tr>
		</table>
	</div>
	<div id="planViewDiv">
		<table id="planViewTable" cellspacing="0" cellpadding="0" class="tableStyle">
			<tr class="unSelectableWeekBoxStyle">
				<td></td>
				<td>M</td>
				<td>T</td>
				<td>W</td>
				<td>T</td>
				<td>F</td>
				<td>S</td>
				<td>S</td>
			</tr>
		</table>
	</div>
	<div style="float:right; width: 210px !important">
		<input id="calSelectAllBtn" type="button" value="Select All" onclick="selectAllDays()"/>
		<input id="calClearBtn" type="button" value="Clear All" onclick="clearAllDaySelections()"/>
	</div>
</div>

<div id="calBtnBar" class="calendar-header" style="float:left; margin-top:4px; width:85%; " >
	<span class="clearable" style="float:left;">
		<input id="calendarInputText" class="locations_field"  ref="calclear" onClearClick="clearCalInputText" type="text" value="" style="float:left; width:180px;" onkeyup="return validateInputPlanDays(event)"/>
		<span id="calclear" ref="calendarInputText" class="remove_icon_clear" style="float:right; top: 3px !important" ></span>
	</span>
	<label id="calMonthLbl" style="float:right;" ></label>
</div>
<span id="closeSqwCal" class="k-icon calendar-btn-close" style="float:right;" />