define([
	'intern!object',
	'intern/chai!assert',
	'require',
	'intern/dojo/node!leadfoot/helpers/pollUntil'	
], function (registerSuite, assert, require, pollUntil) {
	registerSuite({
		name: 'headerFunctional',

		'headerFunctional test': function () {
			var TESTCASE =2;
			console.log("Executing test case: "+TESTCASE);
			switch(TESTCASE){
			case 1:				
				return  this.remote
					.get(require.toUrl('http://mktg-501946-67.corp.ds.fedex.com:8080/SIServer/loginAction.do?login=20349&password=pegasus&languageId=1'))
					.setFindTimeout(2000000)
					.findByXpath('//*[@id="runQryBtn"]')
					.click()
					.getVisibleText()
					.then(function (text) {
						console.log("Pegasus : "+ text);
						assert.strictEqual(text, 'Hello, Elaine!', 'Greeting should be displayed when the form is submitted');
					});
				break;
			case 2:				
				return  this.remote
					.get(require.toUrl('http://mktg-501946-67.corp.ds.fedex.com:8080/SIServer/loginAction.do?login=20349&password=pegasus&languageId=1'))
					.setFindTimeout(2000000)
					.findByXpath('//*[@id="runQryBtn"]')
					.getVisibleText()
					.then(function (text) {
						assert.strictEqual(text, 'RUN', 'Greeting should be displayed when the form is submitted');						
					})
					.click()
					.end();
				break;	
			}			
			
		}
	});
});