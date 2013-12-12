/*global
	module:false,
	equal:false,
	notEqual:false,
	strictEqual:false,
	deepEqual:false,
	test:false,
	ok:false,
	asyncTest:false,
	start: false,
	stop: false,
	expect: false
*/


//#region Utils Tests

module("Utils tests");

test('Issue #31 - Recursively Show All Messages', function () {
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

	ok(!vm.one.isModified(), "Level 1 is not modified");
	ok(!vm.two.one.isModified(), "Level 2 is not modified");
	ok(!vm.three.two.one.isModified(), "Level 3 is not modified");

	// now show all the messages
	errors.showAllMessages();

	ok(vm.one.isModified(), "Level 1 is modified");
	ok(vm.two.one.isModified(), "Level 2 is modified");
	ok(vm.three.two.one.isModified(), "Level 3 is modified");

	equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

test('Issue #31 - Recursively Show All Messages - using computed', function () {
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

	ok(!vm.one.isModified(), "Level 1 is not modified");
	ok(!vm.two.one.isModified(), "Level 2 is not modified");
	ok(!vm.three.two.one.isModified(), "Level 3 is not modified");

	// now show all the messages
	errors.showAllMessages();

	ok(vm.one.isModified(), "Level 1 is modified");
	ok(vm.two.one.isModified(), "Level 2 is modified");
	ok(vm.three.two.one.isModified(), "Level 3 is modified");

	equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

test('Issue #37 - Toggle ShowAllMessages', function () {
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

	ok(!vm.one.isModified(), "Level 1 is not modified");
	ok(!vm.two.one.isModified(), "Level 2 is not modified");
	ok(!vm.three.two.one.isModified(), "Level 3 is not modified");

	// now show all the messages
	errors.showAllMessages();

	ok(vm.one.isModified(), "Level 1 is modified");
	ok(vm.two.one.isModified(), "Level 2 is modified");
	ok(vm.three.two.one.isModified(), "Level 3 is modified");

	equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');

	// now shut them off
	errors.showAllMessages(false);
	ok(!vm.one.isModified(), "Level 1 is not modified");
	ok(!vm.two.one.isModified(), "Level 2 is not modified");
	ok(!vm.three.two.one.isModified(), "Level 3 is not modified");
});

test('Grouping options does not overwrite global configuration options', function () {
	// we can not access the configuration therefore we test by observing the behavior
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

	equal(errors().length, 1, 'Grouping finds one invalid object because deep option was not specified.');
});

test("Issue #235 - formatMessage should unwrap observable parameters", function () {
	var observable = ko.observable("a value");
	var format = "Format message: {0}";
	var formatted = ko.validation.formatMessage(format, observable);

	equal("Format message: a value", formatted, "Message should be formatted with the observable value");
	equal("a value", observable(), "Source observable should not be altered");

	formatted = ko.validation.formatMessage(format, "a value");
	equal("Format message: a value", formatted, "Message should be formatted with the non-observable value");
});

test("Issue #313 - When recursivly iterating object tree with deep option", function () {
	var ViewModel = function () {
		this.required = ko.observable().extend({ required: true });
		this.child = this;
	};

	var errors = ko.validation.group(new ViewModel(), { observable: true, deep: true });

	ok(true, "It should not throw stack overflow");
	equal(errors().length, 1);
});

test("isValidatable returns false for undefined", function () {
	equal(ko.validation.utils.isValidatable(), false);
	equal(ko.validation.utils.isValidatable(null), false);
	equal(ko.validation.utils.isValidatable(undefined), false);
});

test("isObservableArray returns true for observable arrays", function () {
	var obsArray = ko.observableArray(),
		observable = ko.observable(),
		plainObject = {},
		plainArray = [];

	ok(ko.validation.utils.isObservableArray(obsArray));
	ok(!ko.validation.utils.isObservableArray(observable));
	ok(!ko.validation.utils.isObservableArray(plainObject));
	ok(!ko.validation.utils.isObservableArray(plainArray));
	ok(!ko.validation.utils.isObservableArray(null));
	ok(!ko.validation.utils.isObservableArray(undefined));
});
//#endregion