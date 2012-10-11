/// <reference path="Qunit/qunit.js" />
/// <reference path="../Lib/knockout-latest.debug.js" />
/// <reference path="../Src/knockout.validation.js" />

//#region Required Validation

module('Required Validation');

test('Object is Valid and isValid returns True', function () {

    var testObj = ko.observable('')
                    .extend({ required: true });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {

    var testObj = ko.observable('')
                    .extend({ required: true });

    equal(testObj(), '', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Zero is a valid value for required', function () {

    var testObj = ko.observable(0)
                    .extend({ required: true });

    equal(testObj(), 0, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Empty spaces is not a valid value for required', function () {

    var testObj = ko.observable('  ')
                    .extend({ required: true });

    equal(testObj(), '  ', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is valid');
});

test('Issue #90 - "required: false" doesnt force validation', function () {

    var testObj = ko.observable()
                    .extend({ required: false });

    equal(testObj.isValid(), true, 'testObj is valid without value');
    
    testObj('blah');
    equal(testObj.isValid(), true, 'testObj is valid with value');

    testObj(null);
    equal(testObj.isValid(), true, 'testObj is valid without value after set/unset');
});

//#endregion

//#region Min Validation

module('Min Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ min: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ min: 2 });

    testObj(3);

    equal(testObj(), 3, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True (with min: 0)', function () {
    testObj = ko.observable('')
            .extend({ min: 0 });

    testObj("0");

    equal(testObj(), "0", 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ min: 2 });

    testObj(1);

    equal(testObj(), 1, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});
//#endregion

//#region Max Validation

module('Max Validation');
test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ max: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});


test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ max: 5 });

    testObj(3);

    equal(testObj(), 3, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ max: 5 });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region Min Length Validation

module('MinLength Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ minLength: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');

});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ minLength: 5 });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ minLength: 12 });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Issue #33 - Arrays - Valid', function () {
    var testObj = ko.observableArray()
                    .extend({ minLength: 2 });

    testObj(['one', 'two', 'three']);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Issue #33 - Arrays - Invalid', function () {
    var testObj = ko.observableArray()
                    .extend({ minLength: 4 });

    testObj(['one', 'two', 'three']);
    ok(!testObj.isValid(), testObj.error);
});
//#endregion

//#region Max Length Validation

module('MaxLength Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ maxLength: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ maxLength: 10 });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ maxLength: 6 });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Issue #33 - Arrays - Valid', function () {
    var testObj = ko.observableArray()
                    .extend({ maxLength: 4 });

    testObj(['one', 'two', 'three']);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Issue #33 - Arrays - Invalid', function () {
    var testObj = ko.observableArray()
                    .extend({ maxLength: 2 });

    testObj(['one', 'two', 'three']);
    ok(!testObj.isValid(), testObj.error);
});
//#endregion

//#region Pattern Validation

module('Pattern Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ pattern: 'test' });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ pattern: 'some' });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ pattern: 'none' });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Pattern validation matches numbers', function () {
    var testObj = ko.observable('')
                    .extend({ pattern: '^12' });

    testObj(123);

    equal(testObj(), 123, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Pattern validation mismatches numbers', function () {
    var testObj = ko.observable('')
                    .extend({ pattern: 'none' });

    testObj(123);

    equal(testObj(), 123, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Pattern validation doesn\'t break with non-string values', function () {
    var testObj = ko.observable('')
                    .extend({ pattern: '^$' });
	
	// Validation results not important, just shouldn't blow-up
    testObj(null);
	testObj.isValid();

    testObj(undefined);
	testObj.isValid();

    testObj(12345);
	testObj.isValid();

    testObj(12.34);
	testObj.isValid();

    testObj(true);
	testObj.isValid();

    testObj(false);
	testObj.isValid();

    testObj([]);
	testObj.isValid();

    testObj({});
	testObj.isValid();
});

//#endregion

//#region Step Validation

module('Step Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ step: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ step: 3 });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ step: 2 });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Issue 74 - Object is Valid with a step of 0.1 and isValid returns True', function () {
    var testObj = ko.observable('')
                    .extend({ step: 0.1 });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});


test('Issue 74 - Object is Valid with a step of 0.1 and incremented by 0.1 and isValid returns True', function () {
    var testObj = ko.observable(6)
                    .extend({ step: 0.1 });

    testObj(6.1);

    equal(testObj(), 6.1, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Issue 74 - Object is NOT Valid with a step of 0.1 and isValid returns False', function () {
    var testObj = ko.observable('')
                    .extend({ step: 0.1 });

    testObj(5);
    testObj(5.15);

    equal(testObj(), 5.15, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});
//#endregion

//#region Email Validation

module('Email Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ email: true });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ email: true });

    testObj('test@example.com');

    equal(testObj(), 'test@example.com', 'observable still works');
    ok( testObj.isValid(), 'testObj is Valid' );
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ email: true });

    testObj('text#example.com');

    equal(testObj(), 'text#example.com', 'observable still works');
    equal( testObj.isValid(), false, testObj.error );
    equal( testObj.error, 'Please enter a proper email address', "Error Message Needs to be formatted correctly" );
});

test('Email with invalid domain', function(){
    var testObj = ko.observable().extend({ email: true });

    testObj("john@abc.com123");

    equal( testObj.isValid(), false, testObj.error );
    equal( testObj.error, 'Please enter a proper email address');
})
//#endregion

//#region Date Validation

module('Date Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ date: 'test' });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ date: true });

    testObj('11/18/2011');

    equal(testObj(), '11/18/2011', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ date: true });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error);
});

//#endregion

//#region DateISO Validation

module('DateISO Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ dateISO: 'test' });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ dateISO: true }); 

    testObj('2011-11-18');

    equal(testObj(), '2011-11-18', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ dateISO: true });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error);
});

//#endregion

//#region Number Validation

module('Number Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ number: true });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ number: true });

    testObj(200.01);

    equal(testObj(), 200.01, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ number: true });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error);
});

//#endregion

//#region Digit Validation

module('Digit Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ digit: true });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ digit: true });

    testObj(2);

    equal(testObj(), 2, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ digit: true });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error);
});

//#endregion

//#region PhoneUS Validation
module('PhoneUS Validation');

test('Object is Valid when no value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ phoneUS: true });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});


test('Object is Valid and isValid returns True', function () {
    var testObj = ko.observable('').extend({ phoneUS: true });

    testObj('765-523-4569');

    equal(testObj(), '765-523-4569', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ phoneUS: true });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

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
    ok(testObj.error, testObj.error);
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
    equal(testObj.error, 'This Message is Special', "Message appears correctly");
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
    equal(testObj.error, 'Must Equal 5', 'Error Message Matches');
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
    equal( testObj.error, 'after', 'testObj changes messages dynamically' );
});

//#endregion

//#region Anonymous Rule Validation

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

    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('required') > -1, "required is first error");

    testObj('s');
    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('at least') > -1, "Minimum Length not met");

    testObj('som');
    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('must contain') > -1, "Doesn't match required pattern");

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

    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('required') > -1, "required is first error");

    testObj('s');
    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('at least') > -1, "Minimum Length not met");

    testObj('som');
    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('must contain') > -1, "Doesn't match required pattern");

});

test("Issue #47 - Validation chaining issue with required and email rules", function () {
    var testObj = ko.observable()
                    .extend({ required: true })
                    .extend({ email: { message: 'Invalid email address.' } });

    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('required') > -1, "required is first error");

    testObj('s'); // an invalid email address
    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('Invalid email') > -1, "Email error is second error");
});

test("Issue #43 - Error messages are not switched correctly", function () {
    var testObj = ko.observable().extend({ min: 1, max: 100 });

    testObj(-1); // should invalidate the min rule

    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('enter a value greater than') > -1, "Min rule was correctly triggered");

    testObj(101); // should invalidate the max rule

    ok(!testObj.isValid(), testObj.error);
    ok(testObj.error.indexOf('enter a value less than') > -1, "Max rule was correctly triggered");
});

test("Issue #43 - Grouping - Error messages are not switched correctly", function () {
    var vm = {
        testObj : ko.observable().extend({ min: 1, max: 100 }),
        dummyProp : ko.observable().extend({ required: true })
    };

    vm.errors = ko.validation.group(vm);

    vm.testObj(-1); // should invalidate the min rule

    ok(!vm.testObj.isValid(), vm.testObj.error);
    ok(vm.testObj.error.indexOf('enter a value greater than') > -1, "Min rule was correctly triggered");

    vm.testObj(101); // should invalidate the max rule

    ok(!vm.testObj.isValid(), vm.testObj.error);
    ok(vm.testObj.error.indexOf('enter a value less than') > -1, "Max rule was correctly triggered");
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
//#endregion

//#region Equal tests
module("Equal Tests");

test('Object is Valid and isValid returns True', function () {
    var compareObj = ko.observable(12);
    var testObj = ko.observable('').extend({ equal: compareObj });

    testObj(12);

    equal(testObj(), 12, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var compareObj = ko.observable(12);
    var testObj = ko.observable('').extend({ equal: compareObj });

    testObj(11);

    equal(testObj(), 11, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region NotEqual tests
module("Not Equal Tests");

test('Object is Valid and isValid returns True', function () {
    var compareObj = ko.observable(12);
    var testObj = ko.observable('').extend({ notEqual: compareObj });

    testObj(11);

    equal(testObj(), 11, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var compareObj = ko.observable(12);
    var testObj = ko.observable('').extend({ notEqual: compareObj });

    testObj(12);

    equal(testObj(), 12, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region Unique tests
module("Unique Tests");

test('Object is Valid and isValid returns True', function () {
    var compareObj = ko.observableArray([11, 12, 13]);
    var testObj = ko.observable('').extend({ unique: { collection: compareObj} });

    testObj(11);

    equal(testObj(), 11, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var compareObj = ko.observableArray([11, 12, 13, 13]);
    var testObj = ko.observable('').extend({ unique: { collection: compareObj} });

    testObj(13);

    equal(testObj(), 13, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region Utils Tests
module('Grouping Tests');

test('Error Grouping works', function () {
    var vm = {
        firstName: ko.observable().extend({ required: true }),
        lastName: ko.observable().extend({ required: 2 })
    };

    var errors = ko.validation.group(vm);

    equals(errors().length, 2, 'Grouping correctly finds 2 invalid properties');
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

    equals(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
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

    equals(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
});

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

    equals(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
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

    equals(errors().length, 3, 'Grouping correctly finds 3 invalid properties');
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

    equals(errors().length, 3, 'Grouping correctly finds 3 invalid properties');

    // now shut them off
    errors.showAllMessages(false);
    ok(!vm.one.isModified(), "Level 1 is not modified");
    ok(!vm.two.one.isModified(), "Level 2 is not modified");
    ok(!vm.three.two.one.isModified(), "Level 3 is not modified");
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
    ok(person.spouseName.isValid(), 'Unmarried person is valid without spouse name')

    person.isMarried(true);
    equal(person.spouseName.isValid(), false, 'Married person is not valid without spouse name')
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
        ok(testObj.error, testObj.error);
        equal(testObj.isValid(), false, 'testObj is not valid');
    };

    testObj.extend({ mustEqualAsync: 5 });
});

//#endregion
