﻿/*global QUnit:false*/


//#region Manual Validation

QUnit.module('Manual Validation');

QUnit.test('setError sets isValid and error message', function(assert) {
	var testObj = ko.observable();
	testObj.extend({ validatable: true });

	//check initial validation state
	assert.ok(testObj.isValid());
	assert.equal(testObj.error(), null);

	//manually set an error
	testObj.setError('oh no!');

	//check state was set
	assert.ok(!testObj.isValid());
	assert.equal('oh no!', testObj.error());
});

QUnit.test('clearError clears manually-specified error', function(assert) {
	var testObj = ko.observable();
	testObj.extend({ validatable: true });
	testObj.setError('oh no!');

	//fail the validation
	assert.ok(!testObj.isValid());

	//clear the validation
	var result = testObj.clearError();
	assert.equal(testObj, result, 'The result should be returned to support chaining');

	//check state was cleared
	assert.ok(testObj.isValid());
	assert.equal(testObj.error(), null);
});

QUnit.test('clearError clears automatic errors', function(assert) {
	var testObj = ko.observable(5);
	testObj.extend({ min: 6 });

	//check initial state
	assert.ok(!testObj.isValid());

	var result = testObj.clearError();
	assert.equal(testObj, result, 'The result should be returned to support chaining');

	//check validation was cleared
	assert.ok(testObj.isValid());
	assert.equal(testObj.error(), null);
});

//#endregion

//#region Grouping Tests

QUnit.module('Grouping Tests');

QUnit.test('Error Grouping works', function(assert) {
	var vm = {
		firstName: ko.observable().extend({ required: { message: 'Message 1' } }),
		lastName: ko.observable().extend({ required: { message: 'Message 2' } })
	};

	var errors = ko.validation.group(vm);

	assert.equal(errors().length, 2, 'Grouping correctly finds 2 invalid properties');
	assert.equal(errors()[0], 'Message 1', 'The error itself should be returned, not the observable');
	assert.equal(errors()[1], 'Message 2', 'The error itself should be returned, not the observable');
});

QUnit.test('Nested Grouping works - Observable', function(assert) {
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

	assert.equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

QUnit.test('Nested Grouping works - Not Observable', function(assert) {
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

	assert.equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

QUnit.test('Nested grouping finds items in observableArrays - observable', function(assert) {
	var vm = { array: ko.observableArray([{ one: ko.observable().extend({ required: true }) }]) };

	var errors = ko.validation.group(vm, { deep: true, observable: true });

	assert.equal(errors().length, 1, 'Grouping finds property on object in observableArray');
});

QUnit.test('Nested grouping does not add items newly inserted into observableArrays to result - observable, not live', function(assert) {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: false });

	vm.array.push({ one: ko.observable().extend({ required: true }) });

	assert.equal(errors().length, 0, 'grouping does not add newly items newly inserted into observableArrays to result');
});

QUnit.test('Nested grouping adds items newly inserted into an observableArrays nested in an object in an observableArray to result - observable, live', function(assert) {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ array: ko.observableArray() });
	vm.array()[0].array.push({ one: ko.observable().extend({ required: true }) });

	assert.equal(errors().length, 1, 'grouping adds newly items newly inserted into observableArrays to result');
});

QUnit.test('Nested grouping adds items newly inserted into observableArrays to result - observable, live', function(assert) {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ one: ko.observable().extend({ required: true }) });

	assert.equal(errors().length, 1, 'grouping adds newly items newly inserted into observableArrays to result');
});

QUnit.test('Nested grouping ignores items nested in destroyed objects - not observable', function(assert) {
	var obj = { nested: ko.observable().extend({ required: true }) };

	function getErrorCount() {
		return ko.validation.group(obj, { deep: true, observable: false, live: false })().length;
	}

	assert.equal(getErrorCount(), 1, 'obj is not destroyed and should return nested\'s error');

	obj._destroy = true;

	assert.equal(getErrorCount(), 0, 'obj is destroyed and nested therefore ignored');
});

QUnit.test('Nested grouping ignores items nested in destroyed objects - observable, live', function(assert) {
	var obj = { nested: ko.observable().extend({ required: true }) };
	var array = ko.observableArray([obj]);
	var vm = { array: array };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	assert.equal(errors().length, 1, 'obj is not yet destroyed and nested therefore invalid');
	array.destroy(obj);
	assert.equal(errors().length, 0, 'obj is destroyed and nested therefore ignored');
});

QUnit.test('Nested grouping does not cause the reevaluation of computeds depending on the result for every observable', function(assert) {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	var computedHitCount = 0;
	var computed = ko.computed(function() {
		computedHitCount++;
		errors();
	});

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	assert.equal(computedHitCount, 2, 'first one while creating the computed, second one for adding the item');

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	assert.equal(computedHitCount, 3, 'Only one additional re-evaluation should have been triggered');

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	assert.equal(computedHitCount, 4, 'Only one additional re-evaluation should have been triggered');
});

QUnit.test('Nested grouping adds items newly inserted into observableArrays to result - clears validatables before traversing again - observable, live', function(assert) {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	vm.array.push({ one: ko.observable().extend({ required: true }) });

	assert.equal(errors().length, 2, 'validatables are added only once');
});

QUnit.test('Issue #99 - Grouping using observable notifies with null entries', function(assert) {
	var done = assert.async();
	assert.expect(1);

	var vm = {
		items: [
			ko.observable().extend({required: true}),
			ko.observable().extend({required: true})
		]
	};

	var errors = ko.validation.group(vm, {deep: true, observable: true });
	errors.subscribe(function(errors) {
		assert.deepEqual(errors, ['This field is required.'], '1 error is reported');
		done();
	});

	vm.items[0]('1');
});

//#endregion

//#region validatedObservable

QUnit.module('validatedObservable Tests');

QUnit.test('validatedObservable is Valid', function(assert) {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('something');
	obj().testObj2('eric');

	assert.ok(obj(), 'observable works');
	assert.ok(obj.isValid(), 'observable is valid');
});

QUnit.test('validatedObservable is not Valid', function(assert) {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('some');// not length of 5
	obj().testObj2('eric');

	assert.ok(obj(), 'observable works');
	assert.ok(!obj.isValid(), obj.errors()[0]);
});

QUnit.test('validatedObservable is first Valid then made InValid', function(assert) {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	//make it valid
	obj().testObj('something');
	obj().testObj2('eric');

	//now make it invalid
	obj().testObj('some');

	assert.ok(obj(), 'observable works');
	assert.ok(!obj.isValid(), obj.errors()[0]);
});

QUnit.test('validatedObservable does not show error message when not modified', function(assert) {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	assert.ok(obj(), 'observable works');
	assert.ok(!obj.errors.isAnyMessageShown(), 'validation error message is hidden');
});

QUnit.test('validatedObservable does not show error message when modified but correct', function(assert) {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('12345');
	obj().testObj2('a');

	assert.ok(obj(), 'observable works');
	assert.ok(!obj.errors.isAnyMessageShown(), 'validation error message is hidden');
});

QUnit.test('validatedObservable show error message when at least one invalid and modified', function(assert) {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj.isModified(true);

	assert.ok(obj(), 'observable works');
	assert.ok(obj.errors.isAnyMessageShown(), 'validation error message is shown');
});

QUnit.test('validatedObservable is Valid when not modified', function(assert) {
    var obj = ko.validatedObservable({
        testObj: ko.observable('12345').extend({ minLength: 5 }),
        testObj2: ko.observable('a').extend({ required: true })
    });

    assert.ok(obj(), 'observable works');
    assert.ok(obj.isValid(), 'observable is valid');
});

QUnit.test('validatedObservable is not Valid when not modified', function(assert) {

    var obj = ko.validatedObservable({
        testObj: ko.observable('').extend({ minLength: 5 }),
        testObj2: ko.observable('').extend({ required: true })
    });

    assert.ok(obj(), 'observable works');
    assert.ok(!obj.isValid(), obj.errors()[0]);
});

QUnit.test('Issue #454 - validatedObservable throws when config option grouping.observable is false', function(assert) {
	ko.validation.init({grouping: {observable: false}}, true);

	var obj = ko.validatedObservable({
		username: ko.observable().extend({required: true}),
		email: ko.observable().extend({required: true, email: true}),
		admin: ko.observable().extend({required: true})
	});

	assert.ok(obj(), 'observable works');
	assert.ok(!obj.isValid(), obj.errors()[0]);
});

//#endregion

//#region setRules Tests

QUnit.module('setRules Tests');

QUnit.test('setRules applies rules to all properties', function(assert) {
	var definition = {
		property1: {
			required: true,
			min: 10,
			max: 99,
			ignoredDefinition: { required: true }
		},
		child: {
			property2: {
				pattern: {
					params: '^[a-z0-9].$',
					message: 'Only AlphaNumeric please'
				}
			},
			grandchild: {
				property3: {
					number: true
				}
			},
			ignoredDefinition: { required: true }
		},
		nestedArray: {
			property4: { email: true },
			ignoredDefinition: { required: true }
		}
	};

	var target = {
		property1: ko.observable(),
		ignoredProperty: ko.observable(),
		child: {
			property2: ko.observable(),
			ignoredProperty: ko.observable(),
			grandchild: {
				property3: ko.observable(),
				ignoredProperty: ko.observable()
			}
		},
		nestedArray: ko.observableArray([
            { property4: ko.observable(), ignoredProperty: ko.observable() },
            { property4: ko.observable(), ignoredProperty: ko.observable() },
            { property4: ko.observable(), ignoredProperty: ko.observable() }
		])
	};

	ko.validation.setRules(target, definition);

	//check that all rules have been applied
	assert.deepEqual(target.property1.rules(), [
        { rule: 'required', params: true },
        { rule: 'min', params: 10 },
        { rule: 'max', params: 99 }
	]);

	assert.deepEqual(target.child.property2.rules(), [
        { rule: 'pattern', message: 'Only AlphaNumeric please', params: '^[a-z0-9].$', condition: undefined }
	]);

	assert.deepEqual(target.child.grandchild.property3.rules(), [
        { rule: 'number', params: true }
	]);

	for (var i = 0; i < target.nestedArray().length; i++) {
		assert.deepEqual(target.nestedArray()[i].property4.rules(), [
			{ rule: 'email', params: true }
		]);
	}

	//check that ignored properties have not had rules added
	assert.ok(!target.ignoredProperty.rules);
	assert.ok(!target.child.ignoredProperty.rules);
	assert.ok(!target.child.grandchild.ignoredProperty.rules);
	assert.ok(!target.nestedArray()[0].ignoredProperty.rules);
	assert.ok(!target.nestedArray()[1].ignoredProperty.rules);
	assert.ok(!target.nestedArray()[2].ignoredProperty.rules);
});

QUnit.test('Issue #461 - validatedObservable works with nested view models if grouping.deep is true', function(assert) {
	ko.validation.init({grouping: {deep: true}}, true);

	function Inner() {
		this.admins = ko.observableArray();
		this.admins.push(ko.observable('').extend({required: {params: true, message: 'admins is required'}}));
	}

	var obj = ko.validatedObservable({
		username: ko.observable('x').extend({required: true}),
		inner: new Inner()
	});

	assert.ok(obj(), 'observable works');
	assert.equal(obj.errors().length, 1, 'Must have one error reported');
	assert.equal(obj.errors()[0], 'admins is required');
	assert.ok(!obj.isValid(), obj.errors()[0]);
});

QUnit.test('Issue #461 - validatedObservable works with nested view models if grouping.deep is true using options', function(assert) {
	ko.validation.init({grouping: {deep: false}}, true);

	function Inner() {
		this.admins = ko.observableArray();
		this.admins.push(ko.observable('').extend({required: {params: true, message: 'admins is required'}}));
	}

	var obj = ko.validatedObservable({
		username: ko.observable('x').extend({required: true}),
		inner: new Inner()
	}, {deep: true});

	assert.ok(obj(), 'observable works');
	assert.equal(obj.errors().length, 1, 'Must have one error reported');
	assert.equal(obj.errors()[0], 'admins is required');
	assert.ok(!obj.isValid(), obj.errors()[0]);
});

//#endregion

//#region Removing Validation

QUnit.module('Removing Validation Tests');

QUnit.test('Basic Removal', function(assert) {
	var testObj = ko.observable('')
                    .extend({ min: 2 });

	testObj(3);

	var testFlag = false;

	assert.equal(testObj(), 3, 'observable still works');
	assert.ok(testObj.isValid(), 'testObj is Valid');

	testObj.isValid.subscribe(function() {
		testFlag = true;
	});

	testObj.extend({ validatable: false });

	assert.ok(!testObj.isValid, 'Validation features removed');
	testObj(1);
	assert.ok(!testFlag, 'Subscriptions to isValid didnt fire');
});

//#endregion

//#region validation process tests

QUnit.module('Validation process', {
	afterEach: function() {
		ko.validation.reset();
	}
});

QUnit.test('can be throttled using global configuration', function(assert) {
	var done = assert.async();
	assert.expect(0);

	var _validateObservable = ko.validation.validateObservable;
	ko.validation.validateObservable = function() {
		var result = _validateObservable.apply(this, arguments);
		ko.validation.validateObservable = _validateObservable;
		done();
		return result;
	};

	ko.validation.init({
		validate: {
			throttle: 10
		}
	}, true);

	var observable = ko.observable().extend({ validatable: true });
	observable('1');
	observable.extend({ minLength: 2 });
});

QUnit.test('can be throttled using using local configuration', function(assert) {
	var done = assert.async();
	assert.expect(0);

	var _validateObservable = ko.validation.validateObservable;
	ko.validation.validateObservable = function() {
		var result = _validateObservable.apply(this, arguments);
		ko.validation.validateObservable = _validateObservable;
		done();
		return result;
	};

	var observable = ko.observable().extend({
		validatable: {
			throttle: 10
		}
	});

	observable.extend({ minLength: 2 });
	observable('1');
});

//#endregion


QUnit.module('Formatting Tests');

QUnit.test('formatMessage passes observable to function', function(assert) {
	var inParams = { value: 123 },
		inObservable = ko.observable();
	ko.validation.formatMessage(function (params, observable) {
		assert.equal(params, inParams);
		assert.equal(observable, inObservable);
	}, inParams, inObservable);
});

QUnit.test('formatMessage may use multiple replacements', function(assert) {
	var params = [1, 5],
		message = 'Value must be between {0} and {1}.',
		obsv = ko.observable(10);

	var result = ko.validation.formatMessage(message, params, obsv);
	assert.equal(result, 'Value must be between 1 and 5.');
});


QUnit.module('applyBindingsWithValidation Tests');

QUnit.test('can be invoked with (viewModel)', function(assert) {
	assert.expect(2);

	ko.validation.init({}, true);

	var _applyBindings = ko.applyBindings;
	var _setDomData = ko.validation.utils.setDomData;

	var viewModel = {};

	ko.validation.utils.setDomData = function(/*node, data*/) {
		// We don't expect a call to setDomData when no options are provided to applyBindingsWithValidation
		assert.ok(false, 'Unexpected setDomData call');
	};
	ko.applyBindings = function(viewModelOrBindingContext, rootNode) {
		assert.strictEqual(viewModelOrBindingContext, viewModel, 'viewModelOrBindingContext is correct');
		assert.strictEqual(rootNode, document.body, 'rootNode is correct');
	};

	ko.applyBindingsWithValidation(viewModel);

	// Restore methods
	ko.applyBindings = _applyBindings;
	ko.validation.utils.setDomData = _setDomData;
});

QUnit.test('can be invoked with (viewModel, options)', function(assert) {
	assert.expect(4);

	ko.validation.init({}, true);

	var _applyBindings = ko.applyBindings;
	var _setDomData = ko.validation.utils.setDomData;

	var viewModel = {};
	var options = ko.utils.extend(ko.utils.extend({}, ko.validation.configuration), {messageTemplate: '<span></span>'});

	ko.validation.utils.setDomData = function(node, data) {
		assert.strictEqual(node, document.body, 'rootNode is correct');
		assert.propEqual(data, options, 'data is correct');
	};
	ko.applyBindings = function(viewModelOrBindingContext, rootNode) {
		assert.strictEqual(viewModelOrBindingContext, viewModel, 'viewModelOrBindingContext is correct');
		assert.strictEqual(rootNode, document.body, 'rootNode is correct');
	};

	ko.applyBindingsWithValidation(viewModel, {messageTemplate: '<span></span>'});

	// Restore methods
	ko.applyBindings = _applyBindings;
	ko.validation.utils.setDomData = _setDomData;
});

QUnit.test('can be invoked with (viewModel, rootNode)', function(assert) {
	assert.expect(2);

	ko.validation.init({}, true);

	var _applyBindings = ko.applyBindings;
	var _setDomData = ko.validation.utils.setDomData;

	var viewModel = {};
	var element = document.createElement('div');

	ko.validation.utils.setDomData = function(/*node, data*/) {
		// We don't expect a call to setDomData when no options are provided to applyBindingsWithValidation
		assert.ok(false, 'Unexpected setDomData call');
	};

	ko.applyBindings = function(viewModelOrBindingContext, rootNode) {
		assert.strictEqual(viewModelOrBindingContext, viewModel, 'viewModelOrBindingContext is correct');
		assert.strictEqual(rootNode, element, 'rootNode is correct');
	};

	ko.applyBindingsWithValidation(viewModel, element);

	// Restore methods
	ko.applyBindings = _applyBindings;
	ko.validation.utils.setDomData = _setDomData;
});

QUnit.test('can be invoked with (viewModel, rootNode, options)', function(assert) {

	ko.validation.init({}, true);

	var _applyBindings = ko.applyBindings;
	var _setDomData = ko.validation.utils.setDomData;

	var viewModel = {};
	var element = document.createElement('div');
	var options = ko.utils.extend(ko.utils.extend({}, ko.validation.configuration), {messageTemplate: '<span></span>'});

	ko.validation.utils.setDomData = function(node, data) {
		assert.strictEqual(node, element, 'node is correct');
		assert.propEqual(data, options, 'data is correct');
	};
	ko.applyBindings = function(viewModelOrBindingContext, rootNode) {
		assert.strictEqual(viewModelOrBindingContext, viewModel, 'viewModelOrBindingContext is correct');
		assert.strictEqual(rootNode, element, 'rootNode is correct');
	};

	ko.applyBindingsWithValidation(viewModel, element, {messageTemplate: '<span></span>'});

	// Restore methods
	ko.applyBindings = _applyBindings;
	ko.validation.utils.setDomData = _setDomData;
});

