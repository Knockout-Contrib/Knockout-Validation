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

//#region Custom Rule Validation
module('Custom Rule Validation');
test('Custom Rule Is Valid Test', function () {

    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered


    var testObj = ko.observable(4).extend({ mustEqual: 5 });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Custom Rule Is NOT Valid Test', function () {

    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered


    var testObj = ko.observable(4).extend({ mustEqual: 5 });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    ok(testObj.error(), testObj.error());
    equal(testObj.isValid(), false, 'testObj is valid');
});

test('Custom Rule Is Valid Test and params is observable', function () {
	var mustEqual = ko.observable(5);
    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered


    var testObj = ko.observable(4).extend({ mustEqual: mustEqual });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Custom Rule Is NOT Valid Test and params is observable', function () {
	var mustEqual = ko.observable(5);
    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered


    var testObj = ko.observable(4).extend({ mustEqual: mustEqual });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    ok(testObj.error(), testObj.error());
    equal(testObj.isValid(), false, 'testObj is valid');
});

//#endregion

//#region Custom Validation Message

module('Custom Validation Message');
test('Custom Message Correctly appears', function () {

    var testObj = ko.observable('something').extend({
        required: {
            message: 'This Message is Special'
        }
    });

    testObj('');

    equal(testObj(), '', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is valid');
    equal(testObj.error(), 'This Message is Special', "Message appears correctly");
});

//#endregion

//#region Anonymous Rule Validation

module('Anonymous Rule Validation');
test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable(3).extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: 'Must Equal 5',
            params: 5
        }
    });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable(3).extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: 'Must Equal {0}',
            params: 5
        }
    });

    testObj(4);

    equal(testObj(), 4, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is valid');
    equal(testObj.error(), 'Must Equal 5', 'Error Message Matches');
});

test( 'Issue #81 - Dynamic messages', function () {

    var CustomRule = function () {
        var self = this;

        this.message = 'before';
        this.params = 0;

        this.validator = function ( val, params ) {
            self.message = 'after';

            return false;
        };
    };

    var testObj = ko.observable( 3 ).extend( {
        validation: new CustomRule()
    });

    testObj( 4 );

    equal( testObj.isValid(), false, 'testObj is not valid' );
    equal( testObj.error(), 'after', 'testObj changes messages dynamically' );
});

test('Object is Valid and params is observable and isValid returns True', function () {
	var params = ko.observable(5);
    var testObj = ko.observable(3).extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: 'Must Equal 5',
            params: params
        }
    });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Object is Valid and params is observable isValid returns True', function () {
	var params = ko.observable(5);
    var testObj = ko.observable(3).extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: 'Must Equal {0}',
            params: params
        }
    });

    testObj(4);

    equal(testObj(), 4, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is valid');
    equal(testObj.error(), 'Must Equal 5', 'Error Message Matches');
});

module('Complex Rule Validation');
test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable();
    testObj.extend({ required: true })
           .extend({ minLength: 2 })
           .extend({ pattern: {
                message: 'It must contain some',
                params: 'some'
            }
           });

    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('required') > -1, "required is first error");

    testObj('s');
    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('at least') > -1, "Minimum Length not met");

    testObj('som');
    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('must contain') > -1, "Doesn't match required pattern");

});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable().extend({
                    required: true,
                    minLength: 2,
                    pattern: {
                        message: 'It must contain some',
                        params: 'some'
                    }
                });

    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('required') > -1, "required is first error");

    testObj('s');
    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('at least') > -1, "Minimum Length not met");

    testObj('som');
    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('must contain') > -1, "Doesn't match required pattern");

});

test("Issue #47 - Validation chaining issue with required and email rules", function () {
    var testObj = ko.observable()
                    .extend({ required: true })
                    .extend({ email: { message: 'Invalid email address.' } });

    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('required') > -1, "required is first error");

    testObj('s'); // an invalid email address
    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('Invalid email') > -1, "Email error is second error");
});

test("Issue #43 - Error messages are not switched correctly", function () {
    var testObj = ko.observable().extend({ min: 1, max: 100 });

    testObj(-1); // should invalidate the min rule

    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('enter a value greater than') > -1, "Min rule was correctly triggered");

    testObj(101); // should invalidate the max rule

    ok(!testObj.isValid(), testObj.error());
    ok(testObj.error().indexOf('enter a value less than') > -1, "Max rule was correctly triggered");
});

test("Issue #43 - Grouping - Error messages are not switched correctly", function () {
    var vm = {
        testObj : ko.observable().extend({ min: 1, max: 100 }),
        dummyProp : ko.observable().extend({ required: true })
    };

    vm.errors = ko.validation.group(vm);

    vm.testObj(-1); // should invalidate the min rule

    ok(!vm.testObj.isValid(), vm.testObj.error());
    ok(vm.testObj.error().indexOf('enter a value greater than') > -1, "Min rule was correctly triggered");

    vm.testObj(101); // should invalidate the max rule

    ok(!vm.testObj.isValid(), vm.testObj.error());
    ok(vm.testObj.error().indexOf('enter a value less than') > -1, "Max rule was correctly triggered");
});

test('Issue #78 - Falsy Params', function () {
    var testObj = ko.observable('')
                    .extend({
                        min: {
                            message: 'something',
                            params: 0
                        }
                    });

    testObj(1);

    equal(testObj(), 1, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');

    testObj(0);
    equal(testObj.isValid(), true, 'testObj is valid');

    testObj(-1);
    equal(testObj.isValid(), false, 'testObj is not valid');

});

test("Issue 374 - onlyIf ignored", function () {
	var observable = ko.observable(),
		validationEnabled = ko.observable(true);
	observable.extend({
		validation: {
			validator: function () { return false; }, //always fail validation
			onlyIf: validationEnabled
		}
	});

	ok(!observable.isValid(), "Should be validating as onlyIf returns true");
	validationEnabled(false);
	ok(observable.isValid(), "Validation should now be disabled");
});

//#endregion

//#region Conditional Validation
module('Conditional Validation in a rule');
test('isValid always returns True when onlyIf Condition evaluates to false', function () {
    var testObj = ko.observable('something').extend({
        required: {
            onlyIf: function() { return false; }
        }
    });
    testObj('');
    equal(testObj(), '', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('isValid returns False When onlyIf Condition evaluates to true and Value is invalid', function () {
    var testObj = ko.observable('something').extend({
        required: {
            onlyIf: function() { return true; }
        }
    });
    testObj('');
    equal(testObj(), '', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not Valid');
});

test('Changing the value of observable used in onlyIf condition triggers validation', function () {
    var person = {
        isMarried: ko.observable(false).extend({ required: true }),
    };
    person.spouseName = ko.observable('').extend({
                          required: { onlyIf: person.isMarried }
                        });
    person.isMarried(false);
    ok(person.spouseName.isValid(), 'Unmarried person is valid without spouse name');

    person.isMarried(true);
    equal(person.spouseName.isValid(), false, 'Married person is not valid without spouse name');
});
//#endregion

//#region Async Tests
module('Async Tests');

asyncTest('Async Rule Is Valid Test', function () {

    ko.validation.rules['mustEqualAsync'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            var isValid = (val === otherVal);
            setTimeout(function () {
                callBack(isValid);
                doAssertions();

                start();
            }, 10);
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    var testObj = ko.observable(5);

    var doAssertions = function () {
        equal(testObj(), 5, 'observable still works');
        equal(testObj.isValid(), true, 'testObj is valid');
    };

    testObj.extend({ mustEqualAsync: 5 });
});

asyncTest('Async Rule Is NOT Valid Test', function () {

    ko.validation.rules['mustEqualAsync'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            var isValid = (val === otherVal);
            setTimeout(function () {
                callBack(isValid);
                doAssertions();

                start();
            }, 10);
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered


    var testObj = ko.observable(4);

    var doAssertions = function () {
        equal(testObj(), 4, 'observable still works');
        ok(testObj.error(), testObj.error());
        equal(testObj.isValid(), false, 'testObj is not valid');
    };

    testObj.extend({ mustEqualAsync: 5 });
});
//#endregion

//#region Message Formatting
module("Message formatting");

test("message parameter receives params and observable", function () {
	var testObj = ko.observable(3);
	testObj.extend({
		validation: {
			validator: function (val, someOtherVal) {
				return val === someOtherVal;
			},
			message: function(params, observable) {
				equal(testObj, observable, "The failing observable should be passed to the message function");

				return "Must equal " + params;
			},
			params: 5
		}
	});

	equal(testObj.error(), "Must equal 5", "The message function was not invoked");
});

asyncTest("message parameter receives params and observable when async", function () {
	var testObj = ko.observable(4);

	ko.validation.rules['mustEqualAsync'] = {
		async: true,
		validator: function (val, otherVal, callBack) {
			var isValid = (val === otherVal);
			setTimeout(function () {
				callBack(isValid);
			}, 10);
		},
		message: function (params, observable) {
			equal(observable, testObj, "The failing observable should be passed to the message function");
			equal(params, 5, "The params should be passed to the message function");

			start();
			return "message";
		}
	};
	ko.validation.registerExtenders(); //make sure the new rule is registered

	testObj.extend({ mustEqualAsync: 5 });
});

//#endregion
