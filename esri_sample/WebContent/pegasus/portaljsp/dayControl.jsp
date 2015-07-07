<%@ taglib prefix="tiles" uri="/tags/struts-tiles"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/struts-bean" prefix="bean"%>
<div id="calenderDiv" style="display: none;">
   	<div id="monthViewDiv">
		<div id="monthYrLblDiv" class="calYrLblDiv"><label id="monthYrLbl"></label></div>
		<table id="monthViewTable" cellspacing="0" cellpadding="0" class="tableStyle">
			<tr class="unSelectableWeekBoxStyle">
				<td><input id="selectAllMonth" type="button" value="Select All" class="selectAllStyle" checked="checked" onclick="selectAllDays(this, 'monthViewTable');toggleBtn(this);"></input></td>
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
		<div id="planYrLblDiv" class="calYrLblDiv"><label id="planYrLbl"></label></div>
		<table id="planViewTable" cellspacing="0" cellpadding="0" class="tableStyle">
			<tr class="unSelectableWeekBoxStyle">
				<td><input id="selectAllPlan" type="button" value="Select All" class="selectAllStyle" checked="checked" onclick="selectAllDays(this, 'planViewTable');toggleBtn(this)"></input></td>
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
	<div id="calOkBtn" class="calendar-btn-div">
		<input type="button" value="OK" class="calendar-btn-style" onclick="setDayAndCloseWindow();"/>
	</div>
</div>

<div id="calBtnBar" class="k-window-actions calendar-header " style="width:97%;display: none;"  >
	<a id="togglePM" class="k-window-action iconbtn"  href="#" onclick="toggleMPView(this);" isPlanView="true">
		<span class="k-icon icon-toggle-plan" title="<bean:message key='header.icon.toggle.planmonth' bundle='filters'/>" style="height: 24px;width: 24px;">
		</span>
	</a>
	<a id="toggleCalLZ" class="k-window-action iconbtn" style="display:none" title="<bean:message key='header.icon.toggle.localzulu' bundle='filters'/>" href="#" onclick="toggleCalLZView(this);" toggled="false">
		<span class="k-icon icon-toggle-local" style="height: 24px;width: 24px;">
			<bean:message key='header.icon.toggle.localzulu' bundle='filters'/>
		</span>
	</a>
</div>