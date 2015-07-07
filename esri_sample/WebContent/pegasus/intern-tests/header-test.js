/*
 * A very simple AMD module with no dependencies
 */

define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!../jquery/treegrid/jquery-1.8.2',
  'intern/order!../portaljs/loggerUtil',
  'intern/order!../portaljs/commonUtils',
  'intern/order!../portaljs/systemSettings',
  'intern/order!../portaljs/pegasusViewer',
  'intern/order!../portaljs/serviceUtils',
  'intern/order!../portaljs/pegasusHeader'
], function (registerSuite, assert) {
  registerSuite({
    name: 'pegasusHeader',

    'verify constants': function () {
    	assert.strictEqual(PLAN_SERVICE_URL, "/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer&datatype=CaseTypeRequest",
        'to check PLAN_SERVICE_URL for the default value no false space etc added ');
    	assert.strictEqual(SCHEDULE_AUTHORIZATION_SERVICE_URL, '/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer&datatype=AuthorizationRequest&commonCaseId=',
        'to check SCHEDULE_AUTHORIZATION_SERVICE_URL for the default value no false space etc added ');
    },
	'async test': function () {
      var dfd = this.async(10000);
	  
	  callService({
		url : "/SIServer"+PLAN_SERVICE_URL,
		successCallback : dfd.callback(function (error, data) {
          assert.strictEqual((error.errorCd).toString(), '0');
        }), 
		failureCallback : dfd.callback(function (error, data) {
          
		  assert.strictEqual(data, 'Hello world!');
        }),
		showProgressWindow : false
	  });
	}
	
/*	'greeting form': function () {
        var applicationLoader = this.remote.get(require.toUrl('/SIServer/loginAction.do?login=20349&password=pegasus&languageId=1'));
        var applicationBody = applicationLoader.setFindTimeout(30000).findByCssSelector('body.loaded');
        var queryWindowTab = applicationBody.findById('queryWindowDiv').find('iframe').findById('filter_components').find('li').findByCssSelector('k-state-active');
      return queryWindowTab
          .getVisibleText()
          .then(function (text) {
            assert.strictEqual(text, 'Network',
              'When the form loaded, Netowrk tab should be selected by default');
          });
    }*/
  });
});