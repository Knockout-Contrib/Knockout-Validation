/*global QUnit:false*/


//#region Custom Rule Validation

QUnit.module('Custom Rule Validation');

QUnit.test('Custom Rule Is Valid Test', function (assert) {
    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    var testObj = ko.observable(4).extend({ mustEqual: 5 });
    testObj(5);
    assert.observableIsValid(testObj, 5);
});

QUnit.test('Custom Rule Is NOT Valid Test', function (assert) {
    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    var testObj = ko.observable(4).extend({ mustEqual: 5 });
    testObj(6);
    assert.observableIsNotValid(testObj, 6, 'The field must equal 5');
});

QUnit.test('Custom Rule Is Valid Test and params is observable', function (assert) {
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
    assert.observableIsValid(testObj, 5);
});

QUnit.test('Custom Rule Is NOT Valid Test and params is observable', function (assert) {
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
    assert.observableIsNotValid(testObj, 6, 'The field must equal 5');
});

//#endregion

//#region Custom Validation Message

QUnit.module('Custom Validation Message');

QUnit.test('Custom Message Correctly appears', function (assert) {
    var testObj = ko.observable('something').extend({
        required: {
            message: 'This Message is Special'
        }
    });
    testObj('');
    assert.observableIsNotValid(testObj, '', 'This Message is Special');
});

//#endregion

//#region Anonymous Rule Validation

QUnit.module('Anonymous Rule Validation');

QUnit.test('Object is Valid and isValid returns True', function (assert) {
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
    assert.observableIsValid(testObj, 5);
});

QUnit.test('Object is NOT Valid and isValid returns False', function (assert) {
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
    assert.observableIsNotValid(testObj, 4, 'Must Equal 5');
});

QUnit.test('Issue #81 - Dynamic messages', function (assert) {
    var CustomRule = function () {
        var self = this;

        this.message = 'before';
        this.params = 0;

        this.validator = function (/*val, params*/) {
            self.message = 'after';
            return false;
        };
    };
    var testObj = ko.observable(3).extend({ validation: new CustomRule() });
    testObj(4);
    assert.observableIsNotValid(testObj, 4, 'after');
});

QUnit.test('Object is Valid and params is observable and isValid returns True', function (assert) {
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
    assert.observableIsValid(testObj, 5);
});

QUnit.test('Object is NOT Valid and params is observable isValid returns False', function (assert) {
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
    assert.observableIsNotValid(testObj, 4, 'Must Equal 5');
});

QUnit.module('Complex Rule Validation');

QUnit.test('Object is NOT Valid and isValid returns False', function (assert) {
    var testObj = ko.observable();
    testObj.extend({ required: true })
           .extend({ minLength: 2 })
           .extend({ pattern: { message: 'It must contain some', params: 'some' } });

    assert.violatesRequiredRule(testObj, undefined);

    testObj('s');
    assert.violatesMinLengthRule(testObj, 's', 2);

    testObj('som');
    assert.violatesPatternRule(testObj, 'som', 'It must contain some');
});

QUnit.test('Object is Valid and isValid returns True', function (assert) {
    var testObj = ko.observable().extend({
        required: true,
        minLength: 2,
        pattern: {
            message: 'It must contain some',
            params: 'some'
        }
    });
    testObj('awesome');
    assert.observableIsValid(testObj, 'awesome');
});

QUnit.test('Issue #47 - Validation chaining issue with required and email rules', function (assert) {
    var testObj = ko.observable()
                    .extend({ required: true })
                    .extend({ email: { message: 'Invalid email address.' } });

    // First error should be set by required rule
    assert.violatesRequiredRule(testObj, undefined);

    // the second error should be set by email rule (now that the observable has some text)
    testObj('s');
    assert.observableIsNotValid(testObj, 's', 'Invalid email address.');
});

QUnit.test('Issue #43 - Error messages are not switched correctly', function (assert) {
    var testObj = ko.observable().extend({ min: 1, max: 100 });

    testObj(-1); // should invalidate the min rule
    assert.violatesMinRule(testObj, -1, 1);

    testObj(101); // should invalidate the max rule
    assert.violatesMaxRule(testObj, 101, 100);
});

QUnit.test('Issue #43 - Grouping - Error messages are not switched correctly', function (assert) {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 }),
        dummyProp: ko.observable().extend({ required: true })
    };

    vm.errors = ko.validation.group(vm);

    vm.testObj(-1); // should invalidate the min rule
    assert.violatesMinRule(vm.testObj, -1, 1);

    vm.testObj(101); // should invalidate the max rule
    assert.violatesMaxRule(vm.testObj, 101, 100);
});

QUnit.test('Issue #78 - Falsy Params', function (assert) {
    var testObj = ko.observable('')
                    .extend({
                        min: {
                            message: 'something',
                            params: 0
                        }
                    });

    testObj(1);
    assert.observableIsValid(testObj, 1);

    testObj(0);
    assert.observableIsValid(testObj, 0);

    testObj(-1);
    assert.observableIsNotValid(testObj, -1, 'something');
});

QUnit.test('Issue 374 - onlyIf ignored', function (assert) {
    var observable = ko.observable(),
		validationEnabled = ko.observable(true);

    observable.extend({
        validation: {
            validator: function () { return false; }, //always fail validation
            onlyIf: validationEnabled
        }
    });

    // Should be validating as onlyIf returns true
    assert.observableIsNotValid(observable, undefined, 'Error');

    // Validation should now be disabled
    validationEnabled(false);
    assert.observableIsValid(observable, undefined);
});

//#endregion

//#region Conditional Validation

QUnit.module('Conditional Validation in a rule');

QUnit.test('isValid always returns True when onlyIf Condition evaluates to false', function (assert) {
    var testObj = ko.observable('something').extend({
        required: {
            onlyIf: function () { return false; }
        }
    });
    testObj('');
    assert.observableIsValid(testObj, '');
});

QUnit.test('isValid returns False When onlyIf Condition evaluates to true and Value is invalid', function (assert) {
    var testObj = ko.observable('something').extend({
        required: {
            onlyIf: function () { return true; }
        }
    });
    testObj('');
    assert.violatesRequiredRule(testObj, '');
});

QUnit.test('Changing the value of observable used in onlyIf condition triggers validation', function (assert) {
    var person = {
        isMarried: ko.observable(false).extend({ required: true })
    };
    person.spouseName = ko.observable('').extend({
        required: { onlyIf: person.isMarried }
    });
    person.isMarried(false);
    assert.observableIsValid(person.spouseName, '');

    person.isMarried(true);
    assert.violatesRequiredRule(person.spouseName, '');
});

//#endregion

//#region Async Tests

QUnit.module('Async Tests');

QUnit.test('Async Rule Is Valid Test', function (assert) {
    var done = assert.async();
    assert.expect(2);

    ko.validation.rules['mustEqualAsync'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            var isValid = (val === otherVal);
            setTimeout(function () {
                callBack(isValid);
                assert.equal(testObj(), 5, 'observable still works');
                assert.equal(testObj.isValid(), true, 'testObj is valid');
                done();
            }, 10);
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    var testObj = ko.observable(5);
    testObj.extend({ mustEqualAsync: 5 });
});

QUnit.test('Async Rule Is NOT Valid Test', function (assert) {
    var done = assert.async();
    assert.expect(3);

    ko.validation.rules['mustEqualAsync'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            var isValid = (val === otherVal);
            setTimeout(function () {
                callBack(isValid);

                assert.equal(testObj(), 4, 'observable still works');
                assert.ok(testObj.error(), 'The field must equal 5', testObj.error());
                assert.equal(testObj.isValid(), false, 'testObj is not valid');

                done();
            }, 10);
        },
        message: 'The field must equal {0}'
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    var testObj = ko.observable(4);
    testObj.extend({ mustEqualAsync: 5 });
});

QUnit.test('Issue #341 Async Rule that is not valid and returns synchronously should be invalid after callback', function (assert) {
    var done = assert.async();
    ko.validation.rules['immediatelyFalse'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            callBack(false);
            assert.ok(!testObj.isValid());
            done();
        },
        message: 'this should be false.'
    };
    ko.validation.registerExtenders();

    var testObj = ko.observable(0);
    testObj.extend({ immediatelyFalse: true });
});

QUnit.test('Issue #341 Async Rule that is not valid and returns synchronously should be invalid when first checked', function (assert) {
    ko.validation.rules['immediatelyFalse'] = {
        async: true,
        validator: function (val, otherVal, callBack) {
            callBack(false);
        },
        message: 'this should be false.'
    };
    ko.validation.registerExtenders();

    var testObj = ko.observable(0);
    testObj.extend({ immediatelyFalse: true });
    assert.ok(!testObj.isValid());
});



//#endregion

//#region Message Formatting

QUnit.module('Message formatting');

QUnit.test('message parameter receives params and observable', function (assert) {
    var testObj = ko.observable(3);
    testObj.extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: function (params, observable) {
                assert.equal(testObj, observable, 'The failing observable should be passed to the message function');

                return 'Must equal ' + params;
            },
            params: 5
        }
    });

    assert.equal(testObj.error(), 'Must equal 5', 'The message function was not invoked');
});

QUnit.test('message parameter receives params and observable when async', function (assert) {
    var done = assert.async();
    assert.expect(2);

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
            assert.equal(observable, testObj, 'The failing observable should be passed to the message function');
            assert.equal(params, 5, 'The params should be passed to the message function');
            done();

            return 'message';
        }
    };
    ko.validation.registerExtenders(); //make sure the new rule is registered

    testObj.extend({ mustEqualAsync: 5 });
});

//#endregion
