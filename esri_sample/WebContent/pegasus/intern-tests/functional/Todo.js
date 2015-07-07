define([
	'intern!object',
	'intern/chai!assert',
	'require'
], function (registerSuite, assert, require) {
	var url = '/SIServer/loginAction.do?login=20349&password=pegasus&languageId=1';

	registerSuite({
		name: 'Todo',

		'submit form': function () {
            var applicationLoader = this.remote.get(require.toUrl(url));
            var applicationBody = applicationLoader.setFindTimeout(30000).findByCssSelector('body.loaded');
			return this.remote
				.get(require.toUrl(url))
				.findById('new-todo')
				.click()
				.pressKeys('Task 1')
				.pressKeys('\n')
				.pressKeys('Task 2')
				.pressKeys('\n')
				.pressKeys('Task 3')
				.getProperty('value')
				.then(function (val) {
					assert.ok(val.indexOf('Task 3') > -1, 'Task 3 should remain in the new todo');
				});
		}
	});
});