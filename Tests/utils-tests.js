/*global QUnit:false*/


//#region Utils Tests

QUnit.module('Utils tests');

QUnit.test('Issue #31 - Recursively Show All Messages', function(assert) {
	var vm = {
		one: ko.observable().extend({ required: true }),
		two: {
			one: ko.observable().extend({ required: true })
		},
		three: {
			two: {
				one: ko.observable().extend({ required: true })
			}
		}
	};

	var errors = ko.validation.group(vm, { deep: true, observable: false });

	assert.ok(!vm.one.isModified(), 'Level 1 is not modified');
	assert.ok(!vm.two.one.isModified(), 'Level 2 is not modified');
	assert.ok(!vm.three.two.one.isModified(), 'Level 3 is not modified');

	// now show all the messages
	errors.showAllMessages();

	assert.ok(vm.one.isModified(), 'Level 1 is modified');
	assert.ok(vm.two.one.isModified(), 'Level 2 is modified');
	assert.ok(vm.three.two.one.isModified(), 'Level 3 is modified');

	assert.equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

QUnit.test('Issue #31 - Recursively Show All Messages - using computed', function(assert) {
	var vm = {
		one: ko.observable().extend({ required: true }),
		two: {
			one: ko.observable().extend({ required: true })
		},
		three: {
			two: {
				one: ko.observable().extend({ required: true })
			}
		}
	};

	var errors = ko.validation.group(vm, { deep: true, observable: true });

	assert.ok(!vm.one.isModified(), 'Level 1 is not modified');
	assert.ok(!vm.two.one.isModified(), 'Level 2 is not modified');
	assert.ok(!vm.three.two.one.isModified(), 'Level 3 is not modified');

	// now show all the messages
	errors.showAllMessages();

	assert.ok(vm.one.isModified(), 'Level 1 is modified');
	assert.ok(vm.two.one.isModified(), 'Level 2 is modified');
	assert.ok(vm.three.two.one.isModified(), 'Level 3 is modified');

	assert.equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

QUnit.test('Issue #37 - Toggle ShowAllMessages', function(assert) {
	var vm = {
		one: ko.observable().extend({ required: true }),
		two: {
			one: ko.observable().extend({ required: true })
		},
		three: {
			two: {
				one: ko.observable().extend({ required: true })
			}
		}
	};

	var errors = ko.validation.group(vm, { deep: true, observable: true });

	assert.ok(!vm.one.isModified(), 'Level 1 is not modified');
	assert.ok(!vm.two.one.isModified(), 'Level 2 is not modified');
	assert.ok(!vm.three.two.one.isModified(), 'Level 3 is not modified');

	// now show all the messages
	errors.showAllMessages();

	assert.ok(vm.one.isModified(), 'Level 1 is modified');
	assert.ok(vm.two.one.isModified(), 'Level 2 is modified');
	assert.ok(vm.three.two.one.isModified(), 'Level 3 is modified');

	assert.equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');

	// now shut them off
	errors.showAllMessages(false);
	assert.ok(!vm.one.isModified(), 'Level 1 is not modified');
	assert.ok(!vm.two.one.isModified(), 'Level 2 is not modified');
	assert.ok(!vm.three.two.one.isModified(), 'Level 3 is not modified');
});

QUnit.test('Grouping options does not overwrite global configuration options', function(assert) {
	// we cannot access the configuration therefore we test by observing the behavior
	// deep option is false per default;

	// that should not change the config
	ko.validation.group({}, { deep: true });

	var vm = {
		one: ko.observable().extend({ required: true }),
		two: {
			one: ko.observable().extend({ required: true })
		}
	};

	var errors = ko.validation.group(vm);

	assert.equal(errors().length, 1, 'Grouping finds one invalid object because deep option was not specified.');
});

QUnit.test('Issue #235 - formatMessage should unwrap observable parameters', function(assert) {
	var observable = ko.observable('a value');
	var format = 'Format message: {0}';
	var formatted = ko.validation.formatMessage(format, observable);

	assert.equal('Format message: a value', formatted, 'Message should be formatted with the observable value');
	assert.equal('a value', observable(), 'Source observable should not be altered');

	formatted = ko.validation.formatMessage(format, 'a value');
	assert.equal('Format message: a value', formatted, 'Message should be formatted with the non-observable value');
});

QUnit.test('Issue #313 - When recursively iterating object tree with deep option', function(assert) {
	assert.expect(2);

	var ViewModel = function () {
		this.required = ko.observable().extend({ required: true });
		this.child = this;
	};

	var errors = ko.validation.group(new ViewModel(), { observable: true, deep: true });

	assert.ok(true, 'It should not throw stack overflow');
	assert.equal(errors().length, 1);
});

QUnit.test('isValidatable returns false for undefined', function(assert) {
	assert.equal(ko.validation.utils.isValidatable(), false);
	assert.equal(ko.validation.utils.isValidatable(null), false);
	assert.equal(ko.validation.utils.isValidatable(undefined), false);
});

QUnit.test('isObservableArray returns true for observable arrays', function(assert) {
	var obsArray = ko.observableArray(),
		observable = ko.observable(),
		plainObject = {},
		plainArray = [];

	assert.ok(ko.validation.utils.isObservableArray(obsArray));
	assert.ok(!ko.validation.utils.isObservableArray(observable));
	assert.ok(!ko.validation.utils.isObservableArray(plainObject));
	assert.ok(!ko.validation.utils.isObservableArray(plainArray));
	assert.ok(!ko.validation.utils.isObservableArray(null));
	assert.ok(!ko.validation.utils.isObservableArray(undefined));
});

//#endregion
