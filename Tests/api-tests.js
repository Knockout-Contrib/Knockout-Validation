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

//#region Manual Validation
module("Manual Validation");
test("setError sets isValid and error message", function () {
	var testObj = ko.observable();
	testObj.extend({ validatable: true });

	//check initial validation state
	ok(testObj.isValid());
	equal(testObj.error(), null);

	//manually set an error
	testObj.setError("oh no!");

	//check state was set
	ok(!testObj.isValid());
	equal("oh no!", testObj.error());
});

test("clearError clears manually-specified error", function () {
	var testObj = ko.observable();
	testObj.extend({ validatable: true });
	testObj.setError("oh no!");

	//fail the validation
	ok(!testObj.isValid());

	//clear the validation
	var result = testObj.clearError();
	equal(testObj, result, "The result should be returned to support chaining");

	//check state was cleared
	ok(testObj.isValid());
	equal(testObj.error(), null);
});

test("clearError clears automatic errors", function () {
	var testObj = ko.observable(5);
	testObj.extend({ min: 6 });

	//check initial state
	ok(!testObj.isValid());

	var result = testObj.clearError();
	equal(testObj, result, "The result should be returned to support chaining");

	//check validation was cleared
	ok(testObj.isValid());
	equal(testObj.error(), null);
});

//#endregion

//#region Grouping Tests
module('Grouping Tests');

test('Error Grouping works', function () {
	var vm = {
		firstName: ko.observable().extend({ required: { message: "Message 1" } }),
		lastName: ko.observable().extend({ required: { message: "Message 2" } })
	};

	var errors = ko.validation.group(vm);

	equal(errors().length, 2, 'Grouping correctly finds 2 invalid properties');
	equal(errors()[0], "Message 1", "The error itself should be returned, not the observable");
	equal(errors()[1], "Message 2", "The error itself should be returned, not the observable");
});

test('Nested Grouping works - Observable', function () {
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

	equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

test('Nested Grouping works - Not Observable', function () {
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

	equal(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

test('Nested grouping finds items in observableArrays - observable', function () {
	var vm = { array: ko.observableArray([{ one: ko.observable().extend({ required: true }) }]) };

	var errors = ko.validation.group(vm, { deep: true, observable: true });

	equal(errors().length, 1, 'Grouping finds property on object in observableArray');
});

test('Nested grouping does not add items newly inserted into observableArrays to result - observable, not live', function () {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: false });

	vm.array.push({ one: ko.observable().extend({ required: true }) });

	equal(errors().length, 0, 'grouping does not add newly items newly inserted into observableArrays to result');
});

test('Nested grouping adds items newly inserted into an observableArrays nested in an object in an observableArray to result - observable, live', function () {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ array: ko.observableArray() });
	vm.array()[0].array.push({ one: ko.observable().extend({ required: true }) });

	equal(errors().length, 1, 'grouping adds newly items newly inserted into observableArrays to result');
});

test('Nested grouping adds items newly inserted into observableArrays to result - observable, live', function () {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ one: ko.observable().extend({ required: true }) });

	equal(errors().length, 1, 'grouping adds newly items newly inserted into observableArrays to result');
});

test('Nested grouping ignores items nested in destroyed objects - not observable', function () {
	var obj = { nested: ko.observable().extend({ required: true }) };

	function getErrorCount() {
		return ko.validation.group(obj, { deep: true, observable: false, live: false })().length;
	}

	equal(getErrorCount(), 1, 'obj is not destroyed and should return nested\'s error');

	obj._destroy = true;

	equal(getErrorCount(), 0, 'obj is destroyed and nested therefore ignored');
});

test('Nested grouping ignores items nested in destroyed objects - observable, live', function () {
	var obj = { nested: ko.observable().extend({ required: true }) };
	var array = ko.observableArray([obj]);
	var vm = { array: array };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	equal(errors().length, 1, 'obj is not yet destroyed and nested therefore invalid');
	array.destroy(obj);
	equal(errors().length, 0, 'obj is destroyed and nested therefore ignored');
});

test('Nested grouping does not cause the reevaluation of computeds depending on the result for every observable', function () {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	var computedHitCount = 0;
	var computed = ko.computed(function () {
		computedHitCount++;
		errors();
	});

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	equal(computedHitCount, 2, 'first one while creating the computed, second one for adding the item');

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	equal(computedHitCount, 3, 'Only one additional re-evaluation should have been triggered');

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	equal(computedHitCount, 4, 'Only one additional re-evaluation should have been triggered');

});

test('Nested grouping adds items newly inserted into observableArrays to result - cleares validatables before traversing again - observable, live', function () {
	var vm = { array: ko.observableArray() };

	var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

	vm.array.push({ one: ko.observable().extend({ required: true }) });
	vm.array.push({ one: ko.observable().extend({ required: true }) });

	equal(errors().length, 2, 'validatables are added only once');
});

//#endregion

//#region validatedObservable
module('validatedObservable Tests');
test('validatedObservable is Valid', function () {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('something');
	obj().testObj2('eric');

	ok(obj(), 'observable works');
	ok(obj.isValid(), 'observable is valid');

});

test('validatedObservable is not Valid', function () {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('some');// not length of 5
	obj().testObj2('eric');

	ok(obj(), 'observable works');
	ok(!obj.isValid(), obj.errors()[0]);

});

test('validatedObservable is first Valid then made InValid', function () {

	var obj = ko.validatedObservable({
		testObj: ko.observable('').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	//make it valid
	obj().testObj('something');
	obj().testObj2('eric');

	//now make it invalid
	obj().testObj('some');

	ok(obj(), 'observable works');
	ok(!obj.isValid(), obj.errors()[0]);

});

test('validatedObservable does not show error message when not modified', function () {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	ok(obj(), 'observable works');
	ok(!obj().isAnyMessageShown(), 'validation error message is hidden');

});


test('validatedObservable does not show error message when modified but correct', function () {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj('12345');
	obj().testObj2('a');

	ok(obj(), 'observable works');
	ok(!obj().isAnyMessageShown(), 'validation error message is hidden');

});

test('validatedObservable show error message when at least one invalid and modified', function () {
	var obj = ko.validatedObservable({
		testObj: ko.observable('a').extend({ minLength: 5 }),
		testObj2: ko.observable('').extend({ required: true })
	});

	obj().testObj.isModified(true);

	ok(obj(), 'observable works');
	ok(obj().isAnyMessageShown(), 'validation error message is shown');

});

test('validatedObservable is Valid when not modified', function () {

    var obj = ko.validatedObservable({
        testObj: ko.observable('12345').extend({ minLength: 5 }),
        testObj2: ko.observable('a').extend({ required: true })
    });
    
    ok(obj(), 'observable works');
    ok(obj.isValid(), 'observable is valid');

});

test('validatedObservable is not Valid when not modified', function () {

    var obj = ko.validatedObservable({
        testObj: ko.observable('').extend({ minLength: 5 }),
        testObj2: ko.observable('').extend({ required: true })
    });

    ok(obj(), 'observable works');
    ok(!obj.isValid(), obj.errors()[0]);

});

//#endregion

//#region setRules Tests
module("setRules Tests");

test("setRules applies rules to all properties", function () {
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
					params: "^[a-z0-9].$",
					message: "Only AlphaNumeric please"
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
				ignoredProperty: ko.observable(),
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
	deepEqual(target.property1.rules(), [
        { rule: "required", params: true },
        { rule: "min", params: 10 },
        { rule: "max", params: 99 }
	]);

	deepEqual(target.child.property2.rules(), [
        { rule: "pattern", message: "Only AlphaNumeric please", params: "^[a-z0-9].$", condition: undefined }
	]);

	deepEqual(target.child.grandchild.property3.rules(), [
        { rule: "number", params: true }
	]);

	for (var i = 0; i < target.nestedArray.length; i) {
		deepEqual(target.nestedArray[i].property3.rules(), [
			{ rule: "email", params: true }
		]);
	}

	//check that ignored properties have not had rules added
	ok(!target.ignoredProperty.rules);
	ok(!target.child.ignoredProperty.rules);
	ok(!target.child.grandchild.ignoredProperty.rules);
	ok(!target.nestedArray()[0].ignoredProperty.rules);
	ok(!target.nestedArray()[1].ignoredProperty.rules);
	ok(!target.nestedArray()[2].ignoredProperty.rules);
});

//#endregion

//#region Removing Validation
module('Removing Validation Tests');

test('Basic Removal', function () {
	var testObj = ko.observable('')
                    .extend({ min: 2 });

	testObj(3);

	var testFlag = false;

	equal(testObj(), 3, 'observable still works');
	ok(testObj.isValid(), 'testObj is Valid');

	testObj.isValid.subscribe(function () {
		testFlag = true;
	});

	testObj.extend({ validatable: false });

	ok(!testObj.isValid, 'Validation features removed');
	testObj(1);
	ok(!testFlag, 'Subscriptions to isValid didnt fire');

});
//#endregion

//#region validation process tests
module("Validation process", {
	setup: function () {
		var isStarted = false;
		ko.validation._validateObservable = ko.validation.validateObservable;
		ko.validation.validateObservable = function () {
			ok(true, "Triggered only once");
			if (!isStarted) {
				isStarted = true;
				start();
			}

			return ko.validation._validateObservable.apply(this, arguments);
		};
	},

	teardown: function () {
		ko.validation.validateObservable = ko.validation._validateObservable;
	}
});

asyncTest("can be throttled using global configuration", function () {
	expect(2); // one for initialization and when value changed

	ko.validation.init({
		validate: {
			throttle: 10
		}
	}, true);

	var observable = ko.observable().extend({ validatable: true });
	observable("1");
	observable.extend({ minLength: 2 });

	ko.validation.init({ validate: {} }, true);
});

asyncTest("can be throttled using using local configuration", function () {
	expect(2); // one for initialization and when value changed

	var observable = ko.observable().extend({
		validatable: {
			throttle: 10
		}
	});

	observable.extend({ minLength: 2 });
	observable("1");
});

//#endregion

test("formatMessage passes observable to function", function () {
	var inParams = { value: 123 },
		inObservable = ko.observable();
	ko.validation.formatMessage(function (params, observable) {
		equal(params, inParams);
		equal(observable, inObservable);
	}, inParams, inObservable);
});