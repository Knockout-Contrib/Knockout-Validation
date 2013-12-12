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
		nullParams = ko.observable().extend({ required: null });

	ok(true, "No errors whilst adding rules?  Awesome");
});

test("Issue #376 - empty string should pass validation when required = false", function () {
	var observable = ko.observable("").extend({ required: false });

	ok(observable.isValid(), "Empty string should be vvalid");
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

test('Step validation fix regression check', function () {
	var testObj = ko.observable(33.34).extend({ step: 0.01 });
	ok(!testObj.error(), 'step validation not triggered');
});

test('Step validation any value is allowed', function () {
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
	ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
	var testObj = ko.observable('').extend({ email: true });

	testObj('text#example.com');

	equal(testObj(), 'text#example.com', 'observable still works');
	equal(testObj.isValid(), false, testObj.error());
	equal(testObj.error(), 'Please enter a proper email address', "Error Message Needs to be formatted correctly");
});

test('Email with invalid domain', function () {
	var testObj = ko.observable().extend({ email: true });

	testObj("john@abc.com123");

	equal(testObj.isValid(), false, testObj.error());
	equal(testObj.error(), 'Please enter a proper email address');
});

test('Object is Valid and email is observable and isValid returns True', function () {
	var email = ko.observable(true);
	var testObj = ko.observable('').extend({ email: email });

	testObj('test@example.com');

	equal(testObj(), 'test@example.com', 'observable still works');
	ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and email is observable and isValid returns False', function () {
	var email = ko.observable(true);
	var testObj = ko.observable('').extend({ email: email });

	testObj('text#example.com');

	equal(testObj(), 'text#example.com', 'observable still works');
	equal(testObj.isValid(), false, testObj.error());
	equal(testObj.error(), 'Please enter a proper email address', "Error Message Needs to be formatted correctly");
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
	var testObj = ko.observable('').extend({ unique: { collection: compareObj } });

	testObj(11);

	equal(testObj(), 11, 'observable still works');
	ok(testObj.isValid(), 'testObj is Valid');
});

test('Object is NOT Valid and isValid returns False', function () {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj } });

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