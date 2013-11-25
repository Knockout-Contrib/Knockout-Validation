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

test("Undefined params should not cause errors", function () {
	var undefinedParams = ko.observable().extend({ required: undefined }),
		nullParams      = ko.observable().extend({ required: null });

	ok(true, "No errors whilst adding rules?  Awesome");
});

//#endregion

//#region Min Validation

module('Min Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ min: 2 });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ min: 2 });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    var testObj = ko.observable('')
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

test('Object is NOT Valid and isValid returns False and min is observable', function () {
	var minValue = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ min: minValue });

    testObj(1);

    equal(testObj(), 1, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Object is Valid and isValid returns True and min is observable', function () {
	var minValue = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ min: minValue });

    testObj(4);

    equal(testObj(), 4, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});
//#endregion

//#region Max Validation

module('Max Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ max: 2 });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ max: 2 });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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

test('Object is NOT Valid and isValid returns False and max is observable', function () {
	var minValue = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ max: minValue });

    testObj(4);

    equal(testObj(), 4, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

test('Object is Valid and isValid returns True and max is observable', function () {
	var minValue = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ max: minValue });

    testObj(1);

    equal(testObj(), 1, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});
//#endregion

//#region Min Length Validation

module('MinLength Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ minLength: 2 });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ minLength: 2 });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ minLength: 2 });
    testObj('');
    ok(testObj.isValid(), 'testObj is Valid');
});

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
    ok(!testObj.isValid(), testObj.error());
});

test('Object is Valid and minLength is observable and isValid returns True', function () {
	var minLength = ko.observable(5);
    var testObj = ko.observable('')
                    .extend({ minLength: minLength });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and minLength is observable and isValid returns False', function () {
	var minLength = ko.observable(12);
    var testObj = ko.observable('')
                    .extend({ minLength: minLength });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});
//#endregion

//#region Max Length Validation

module('MaxLength Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ maxLength: 2 });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ maxLength: 2 });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    ok(!testObj.isValid(), testObj.error());
});

test('Object is Valid and maxLength is observable and isValid returns True', function () {
	var maxLength = ko.observable(20);
    var testObj = ko.observable('')
                    .extend({ maxLength: maxLength });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and maxLength is observable and isValid returns False', function () {
	var maxLength = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ maxLength: maxLength });

    testObj('something');

    equal(testObj(), 'something', 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region Pattern Validation

module('Pattern Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ pattern: 'test' });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ pattern: 'test' });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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

    expect(0);
});

test('Pattern validation matches numbers and pattern is observable', function () {
	var pattern = ko.observable('^12');
    var testObj = ko.observable('')
                    .extend({ pattern: pattern });

    testObj(123);

    equal(testObj(), 123, 'observable still works');
    equal(testObj.isValid(), true, 'testObj is valid');
});

test('Pattern validation mismatches numbers and pattern is observable', function () {
	var pattern = ko.observable('none');
    var testObj = ko.observable('')
                    .extend({ pattern: 'none' });

    testObj(123);

    equal(testObj(), 123, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});
//#endregion

//#region Step Validation

module('Step Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ step: 2 });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ step: 2 });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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

test('Step validation fix regression check', function() {
    var testObj = ko.observable(33.34).extend({ step: 0.01});
    ok(!testObj.error(), 'step validation not triggered');
});

test('Step validation any value is allowed', function() {
    var testObj = ko.observable(33.34).extend({ step: 'any' });
    ok(!testObj.error(), '"any" value for step is allowed');
});

test('Object is Valid and step is observable and isValid returns True', function () {
	var step = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ step: step });

    testObj(6);

    equal(testObj(), 6, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and step is observable and isValid returns False', function () {
	var step = ko.observable(3);
    var testObj = ko.observable('')
                    .extend({ step: step });

    testObj(5);

    equal(testObj(), 5, 'observable still works');
    equal(testObj.isValid(), false, 'testObj is not valid');
});

//#endregion

//#region Email Validation

module('Email Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ email: true });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ email: true });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    equal( testObj.isValid(), false, testObj.error());
    equal( testObj.error(), 'Please enter a proper email address', "Error Message Needs to be formatted correctly" );
});

test('Email with invalid domain', function(){
    var testObj = ko.observable().extend({ email: true });

    testObj("john@abc.com123");

    equal( testObj.isValid(), false, testObj.error());
    equal( testObj.error(), 'Please enter a proper email address');
});

test('Object is Valid and email is observable and isValid returns True', function () {
	var email = ko.observable(true);
    var testObj = ko.observable('').extend({ email: email });

    testObj('test@example.com');

    equal(testObj(), 'test@example.com', 'observable still works');
    ok( testObj.isValid(), 'testObj is Valid' );
});

test('Object is NOT Valid and email is observable and isValid returns False', function () {
	var email = ko.observable(true);
    var testObj = ko.observable('').extend({ email: email });

    testObj('text#example.com');

    equal(testObj(), 'text#example.com', 'observable still works');
    equal( testObj.isValid(), false, testObj.error());
    equal( testObj.error(), 'Please enter a proper email address', "Error Message Needs to be formatted correctly" );
});
//#endregion

//#region Date Validation

module('Date Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ date: 'test' });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ date: 'test' });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    equal(testObj.isValid(), false, testObj.error());
});

test('Object is Valid and date is observable and isValid returns True', function () {
	var date = ko.observable(true);
    var testObj = ko.observable('').extend({ date: date });

    testObj('11/18/2011');

    equal(testObj(), '11/18/2011', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
	var date = ko.observable(true);
    var testObj = ko.observable('').extend({ date: date });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error());
});

//#endregion

//#region DateISO Validation

module('DateISO Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ dateISO: 'test' });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ dateISO: 'test' });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    equal(testObj.isValid(), false, testObj.error());
});

test('Object is Valid and dateISO is observable and isValid returns True', function () {
	var dateISO = ko.observable(true);
    var testObj = ko.observable('').extend({ dateISO: dateISO });

    testObj('2011-11-18');

    equal(testObj(), '2011-11-18', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and dateISO is observable and isValid returns False', function () {
	var dateISO = ko.observable(true);
    var testObj = ko.observable('').extend({ dateISO: dateISO });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error());
});

//#endregion

//#region Number Validation

module('Number Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ number: true });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ number: true });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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

test('Number is Valid (starting with point) and isValid returns True', function () {
    var testObj = ko.observable('').extend({ number: true });

    testObj(".15");

    equal(testObj(), ".15", 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
    var testObj = ko.observable('').extend({ number: true });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error());
});

test('Number is Valid (starting with point) and number is observable and isValid returns True', function () {
	var number = ko.observable(true);
    var testObj = ko.observable('').extend({ number: number });

    testObj(".15");

    equal(testObj(), ".15", 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and number is observable and isValid returns False', function () {
	var number = ko.observable(true);
    var testObj = ko.observable('').extend({ number: number });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error());
});
//#endregion

//#region Digit Validation

module('Digit Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ digit: true });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ digit: true });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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
    equal(testObj.isValid(), false, testObj.error());
});

test('Object is Valid and digit is observable and isValid returns True', function () {
	var digit = ko.observable(true);
    var testObj = ko.observable('').extend({ digit: digit });

    testObj(2);

    equal(testObj(), 2, 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and digit is observable and isValid returns False', function () {
	var digit = ko.observable(true);
    var testObj = ko.observable('').extend({ digit: digit });

    testObj('stuff');

    equal(testObj(), 'stuff', 'observable still works');
    equal(testObj.isValid(), false, testObj.error());
});

//#endregion

//#region PhoneUS Validation
module('PhoneUS Validation');

test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ phoneUS: true });
    testObj();
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when null value is present - Preserves Optional Properties', function () {

    var testObj = ko.observable().extend({ phoneUS: true });
    testObj(null);
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is Valid when empty string is present - Preserves Optional Properties', function () {

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

test('Object is Valid and phoneUS is observable and isValid returns True', function () {
	var phoneUS = ko.observable(true);
    var testObj = ko.observable('').extend({ phoneUS: phoneUS });

    testObj('765-523-4569');

    equal(testObj(), '765-523-4569', 'observable still works');
    ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and phoneUS is observable and isValid returns False', function () {
	var phoneUS = ko.observable(true);
    var testObj = ko.observable('').extend({ phoneUS: phoneUS });

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
//#endregion

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

test('Correct unique validation behaviour for external values', function () {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj, externalValue: true } });

	testObj(12);
	equal(testObj.isValid(), false, 'testObj is not valid');

	testObj(13);
	equal(testObj.isValid(), false, 'testObj is not valid');

	testObj(10);
	equal(testObj.isValid(), true, 'testObj is valid');
});

test('Issue #365 - Correct unique validation behaviour for external values that are in the collection', function () {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj, externalValue: 12 } });

	testObj(12);
	equal(testObj.isValid(), false, 'testObj is not valid');

	testObj(10);
	equal(testObj.isValid(), true, 'testObj is valid');
});

//#endregion

//#region Grouping Tests
module('Grouping Tests');

test('Error Grouping works', function () {
    var vm = {
        firstName: ko.observable().extend({ required: true }),
        lastName: ko.observable().extend({ required: 2 })
    };

    var errors = ko.validation.group(vm);

    equal(errors().length, 2, 'Grouping correctly finds 2 invalid properties');
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
    var vm = { array: ko.observableArray( [ { one: ko.observable().extend( { required: true } ) } ]) };
    
    var errors = ko.validation.group(vm, { deep: true, observable: true });
    
    equal(errors().length, 1, 'Grouping finds property on object in observableArray');
});

test('Nested grouping does not add items newly inserted into observableArrays to result - observable, not live', function () {
    var vm = { array: ko.observableArray() };
    
    var errors = ko.validation.group(vm, { deep: true, observable: true, live: false }); 

    vm.array.push( { one:  ko.observable().extend( { required: true } ) });
    
    equal(errors().length, 0, 'grouping does not add newly items newly inserted into observableArrays to result');
});

test('Nested grouping adds items newly inserted into an observableArrays nested in an object in an observableArray to result - observable, live', function () {
    var vm = { array: ko.observableArray() };

    var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

    vm.array.push({ array: ko.observableArray() });
    vm.array()[0].array.push( { one:  ko.observable().extend( { required: true } ) });
    
    equal(errors().length, 1, 'grouping adds newly items newly inserted into observableArrays to result');
});

test('Nested grouping adds items newly inserted into observableArrays to result - observable, live', function () {
    var vm = { array: ko.observableArray() };
    
    var errors = ko.validation.group(vm, { deep: true, observable: true, live: true });

    vm.array.push( { one:  ko.observable().extend( { required: true } ) });
    
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
    var vm = { array: array};

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

test("Issue #313 - When recursivly iterating object tree with deep option", function() {
    var ViewModel = function() {
        this.required = ko.observable().extend({ required: true});
        this.child = this;
    };

    var errors = ko.validation.group(new ViewModel(), { observable: true, deep: true});

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
        ok(testObj.error(), testObj.error());
        equal(testObj.isValid(), false, 'testObj is not valid');
    };

    testObj.extend({ mustEqualAsync: 5 });
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

    ko.validation.init({ validate: {
        throttle: 10
    }}, true);

    var observable = ko.observable().extend({ validatable: true });
    observable("1");
    observable.extend({ minLength: 2 });

    ko.validation.init({ validate: {} }, true);
});

asyncTest("can be throttled using using local configuration", function () {
    expect(2); // one for initialization and when value changed

    var observable = ko.observable().extend({ validatable: {
        throttle: 10
    } });

    observable.extend({ minLength: 2 });
    observable("1");
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
