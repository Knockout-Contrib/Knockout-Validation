/*global QUnit:false*/


//#region Required Validation

QUnit.module('Required Validation');

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ required: true });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ required: true });
	assert.violatesRequiredRule(testObj, '');
});

QUnit.test('Zero is a valid value for required', function(assert) {
	var testObj = ko.observable(0).extend({ required: true });
	assert.observableIsValid(testObj, 0);
});

QUnit.test('Empty spaces is not a valid value for required', function(assert) {
	var testObj = ko.observable('  ').extend({ required: true });
	assert.violatesRequiredRule(testObj, '  ');
});

QUnit.test('Issue #90 - "required: false" doesnt force validation', function(assert) {
	var testObj = ko.observable().extend({ required: false });
	assert.observableIsValid(testObj, undefined);

	testObj('blah');
	assert.observableIsValid(testObj, 'blah');

	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Undefined params should not cause errors', function(assert) {
	var undefinedParams = ko.observable().extend({ required: undefined }),
		nullParams = ko.observable().extend({ required: null });

	//TODO: Should required rule pass when params is null (it's not quite expected to fail with undefined but pass with null)

	assert.violatesRequiredRule(undefinedParams, undefined);
	assert.observableIsValid(nullParams, undefined);
});

QUnit.test('Issue #376 - empty string should pass validation when required = false', function(assert) {
	var testObj = ko.observable('').extend({ required: false });
	assert.observableIsValid(testObj, '');
});

//#endregion

//#region Min Validation

QUnit.module('Min Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ min: 2 });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ min: 2 });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ min: 2 });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ min: 2 });
	testObj(3);
	assert.observableIsValid(testObj, 3);
});

QUnit.test('Object is Valid and isValid returns True (with min: 0)', function(assert) {
	var testObj = ko.observable('').extend({ min: 0 });
	testObj('0');
	assert.observableIsValid(testObj, '0');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ min: 2 });
	testObj(1);
	assert.violatesMinRule(testObj, 1, 2);
});

QUnit.test('Object is NOT Valid and isValid returns False and min is observable', function(assert) {
	var minValue = ko.observable(3);
	var testObj = ko.observable('').extend({ min: minValue });
	testObj(1);
	assert.violatesMinRule(testObj, 1, 3);
});

QUnit.test('Object is Valid and isValid returns True and min is observable', function(assert) {
	var minValue = ko.observable(3);
	var testObj = ko.observable('').extend({ min: minValue });
	testObj(4);
	assert.observableIsValid(testObj, 4);
});

QUnit.test('Object is Valid and isValid returns True and min is date', function(assert) {
	var obj = new Date(2012, 5, 4);
	var testObj = ko.observable('').extend({ min: new Date(2012, 3, 4) });
	testObj(obj);
	assert.observableIsValid(testObj, obj);
});

QUnit.test('Object is NOT Valid and isValid returns False and min is date', function(assert) {
	var obj = new Date(2011, 5, 4);
	var minValue = new Date(2012, 3, 4);
	var testObj = ko.observable('').extend({ min: minValue });
	testObj(obj);
	assert.violatesMinRule(testObj, obj, minValue);
});

//#endregion

//#region Max Validation

QUnit.module('Max Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ max: 2 });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ max: 2 });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ max: 2 });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ max: 5 });
	testObj(3);
	assert.observableIsValid(testObj, 3);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ max: 5 });
	testObj(6);
	assert.violatesMaxRule(testObj, 6, 5);
});

QUnit.test('Object is NOT Valid and isValid returns False and max is observable', function(assert) {
	var minValue = ko.observable(3);
	var testObj = ko.observable('').extend({ max: minValue });
	testObj(4);
	assert.violatesMaxRule(testObj, 4, minValue());
});

QUnit.test('Object is Valid and isValid returns True and max is observable', function(assert) {
	var minValue = ko.observable(3);
	var testObj = ko.observable('').extend({ max: minValue });
	testObj(1);
	assert.observableIsValid(testObj, 1);
});

QUnit.test('Object is Valid and isValid returns True and max is date', function(assert) {
	var obj = new Date(2011, 5, 4);
	var testObj = ko.observable('').extend({ max: new Date(2012, 3, 4) });
	testObj(obj);
	assert.observableIsValid(testObj, obj);
});

QUnit.test('Object is NOT Valid and isValid returns False and max is date', function(assert) {
	var obj = new Date(2013, 5, 4);
	var maxValue = new Date(2012, 3, 4);
	var testObj = ko.observable('').extend({ max: maxValue });
	testObj(obj);
	assert.violatesMaxRule(testObj, obj, maxValue);
});

//#endregion

//#region Min Length Validation

QUnit.module('MinLength Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ minLength: 2 });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ minLength: 2 });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ minLength: 2 });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ minLength: 5 });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ minLength: 12 });
	testObj('something');
	assert.violatesMinLengthRule(testObj, 'something', 12);
});

QUnit.test('Issue #33 - Arrays - Valid', function(assert) {
	var testObj = ko.observableArray().extend({ minLength: 2 });
	var obj = ['one', 'two', 'three'];
	testObj(obj);
	assert.observableIsValid(testObj, obj);
});

QUnit.test('Issue #33 - Arrays - Invalid', function(assert) {
	var testObj = ko.observableArray().extend({ minLength: 4 });
	var obj = ['one', 'two', 'three'];
	testObj(obj);
	assert.violatesMinLengthRule(testObj, obj, 4);
});

QUnit.test('Object is Valid and minLength is observable and isValid returns True', function(assert) {
	var minLength = ko.observable(5);
	var testObj = ko.observable('').extend({ minLength: minLength });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and minLength is observable and isValid returns False', function(assert) {
	var minLength = ko.observable(12);
	var testObj = ko.observable('').extend({ minLength: minLength });
	testObj('something');
	assert.violatesMinLengthRule(testObj, 'something', 12);
});

QUnit.test('Issue #457 - Number is valid when digits are within applicable length', function(assert) {
	var minLength = ko.observable(5);
	var testObj = ko.observable('').extend({ minLength: minLength });
	testObj(12345);
	assert.observableIsValid(testObj, 12345);
});

QUnit.test('Issue #457 - Number is invalid when digits are outside of applicable length', function(assert) {
	var minLength = ko.observable(5);
	var testObj = ko.observable('').extend({ minLength: minLength });
	testObj(1234);
	assert.violatesMinLengthRule(testObj, 1234, 5);
});

//#endregion

//#region Max Length Validation

QUnit.module('MaxLength Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ maxLength: 2 });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ maxLength: 2 });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ maxLength: 2 });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ maxLength: 10 });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ maxLength: 6 });
	testObj('something');
	assert.violatesMaxLengthRule(testObj, 'something', 6);
});

QUnit.test('Issue #33 - Arrays - Valid', function(assert) {
	var testObj = ko.observableArray().extend({ maxLength: 4 });
	var obj = ['one', 'two', 'three'];
	testObj(obj);
	assert.observableIsValid(testObj, obj);
});

QUnit.test('Issue #33 - Arrays - Invalid', function(assert) {
	var testObj = ko.observableArray().extend({ maxLength: 2 });
	var obj = ['one', 'two', 'three'];
	testObj(obj);
	assert.violatesMaxLengthRule(testObj, obj, 2);
});

QUnit.test('Object is Valid and maxLength is observable and isValid returns True', function(assert) {
	var maxLength = ko.observable(20);
	var testObj = ko.observable('').extend({ maxLength: maxLength });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and maxLength is observable and isValid returns False', function(assert) {
	var maxLength = ko.observable(3);
	var testObj = ko.observable('').extend({ maxLength: maxLength });
	testObj('something');
	assert.violatesMaxLengthRule(testObj, 'something', 3);
});

QUnit.test('Issue #457 - Number is valid when digits are within applicable length', function(assert) {
	var maxLength = ko.observable(5);
	var testObj = ko.observable('').extend({ maxLength: maxLength });
	testObj(1);
	assert.observableIsValid(testObj, 1);
});

QUnit.test('Issue #457 - Number is invalid when digits are outside of applicable length', function(assert) {
	var maxLength = ko.observable(5);
	var testObj = ko.observable('').extend({ maxLength: maxLength });
	testObj(123456);
	assert.violatesMaxLengthRule(testObj, 123456, 5);
});

//#endregion

//#region Pattern Validation

QUnit.module('Pattern Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ pattern: 'test' });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ pattern: 'test' });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ pattern: 'test' });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ pattern: 'some' });
	testObj('something');
	assert.observableIsValid(testObj, 'something');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('')
                    .extend({ pattern: 'none' });

	testObj('something');

	assert.equal(testObj(), 'something', 'observable still works');
	assert.equal(testObj.isValid(), false, 'testObj is not valid');
});

QUnit.test('Pattern validation matches numbers', function(assert) {
	var testObj = ko.observable('').extend({ pattern: '^12' });
	testObj(123);
	assert.observableIsValid(testObj, 123);
});

QUnit.test('Pattern validation mismatches numbers', function(assert) {
	var testObj = ko.observable('').extend({ pattern: 'none' });
	testObj(123);
	assert.violatesPatternRule(testObj, 123);
});

QUnit.test('Pattern validation does not break with non-string values', function(assert) {
	assert.expect(1);

	var testObj = ko.observable('').extend({ pattern: '^$' });

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

	assert.ok(true, 'all checks succeeded');
});

QUnit.test('Pattern validation matches numbers and pattern is observable', function(assert) {
	var pattern = ko.observable('^12');
	var testObj = ko.observable('').extend({ pattern: pattern });
	testObj(123);
	assert.observableIsValid(testObj, 123);
});

QUnit.test('Pattern validation mismatches numbers and pattern is observable', function(assert) {
	var pattern = ko.observable('none');
	var testObj = ko.observable('').extend({ pattern: pattern });
	testObj(123);
	assert.violatesPatternRule(testObj, 123);
});

//#endregion

//#region Step Validation

QUnit.module('Step Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ step: 2 });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ step: 2 });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ step: 2 });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ step: 3 });
	testObj(6);
	assert.observableIsValid(testObj, 6);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ step: 2 });
	testObj(5);
	assert.violatesStepRule(testObj, 5, 2);
});

QUnit.test('Issue 74 - Object is Valid with a step of 0.1 and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ step: 0.1 });
	testObj(6);
	assert.observableIsValid(testObj, 6);
});

QUnit.test('Issue 74 - Object is Valid with a step of 0.1 and incremented by 0.1 and isValid returns True', function(assert) {
	var testObj = ko.observable(6).extend({ step: 0.1 });
	testObj(6.1);
	assert.observableIsValid(testObj, 6.1);
});

QUnit.test('Issue 74 - Object is NOT Valid with a step of 0.1 and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ step: 0.1 });
	testObj(5);
	testObj(5.15);
	assert.violatesStepRule(testObj, 5.15, 0.1);
});

QUnit.test('Step validation fix regression check', function(assert) {
	var testObj = ko.observable(33.34).extend({ step: 0.01 });
	assert.observableIsValid(testObj, 33.34);
});

QUnit.test('Step validation any value is allowed', function(assert) {
	var testObj = ko.observable(33.34).extend({ step: 'any' });
	assert.observableIsValid(testObj, 33.34);
});

QUnit.test('Object is Valid and step is observable and isValid returns True', function(assert) {
	var step = ko.observable(3);
	var testObj = ko.observable('').extend({ step: step });
	testObj(6);
	assert.observableIsValid(testObj, 6);
});

QUnit.test('Object is NOT Valid and step is observable and isValid returns False', function(assert) {
	var step = ko.observable(3);
	var testObj = ko.observable('').extend({ step: step });
	testObj(5);
	assert.violatesStepRule(testObj, 5, 3);
});

//#endregion

//#region Email Validation

QUnit.module('Email Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ email: true });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ email: true });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ email: true });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ email: true });
	testObj('test@example.com');
	assert.observableIsValid(testObj, 'test@example.com');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ email: true });
	testObj('text#example.com');
	assert.violatesEmailRule(testObj, 'text#example.com');
});

QUnit.test('Email with invalid domain', function(assert) {
	var testObj = ko.observable().extend({ email: true });
	testObj('john@abc.com123');
	assert.violatesEmailRule(testObj, 'john@abc.com123');
});

QUnit.test('Object is Valid and email is observable and isValid returns True', function(assert) {
	var email = ko.observable(true);
	var testObj = ko.observable('').extend({ email: email });
	testObj('test@example.com');
	assert.observableIsValid(testObj, 'test@example.com');
});

QUnit.test('Object is NOT Valid and email is observable and isValid returns False', function(assert) {
	var email = ko.observable(true);
	var testObj = ko.observable('').extend({ email: email });
	testObj('text#example.com');
	assert.violatesEmailRule(testObj, 'text#example.com');
});

//#endregion

//#region Date Validation

QUnit.module('Date Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ date: 'test' });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ date: 'test' });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ date: 'test' });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ date: true });
	testObj('11/18/2011');
	assert.observableIsValid(testObj, '11/18/2011');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ date: true });
	testObj('stuff');
	assert.violatesDateRule(testObj, 'stuff');
});

QUnit.test('Object is Valid and date is observable and isValid returns True', function(assert) {
	var date = ko.observable(true);
	var testObj = ko.observable('').extend({ date: date });
	testObj('11/18/2011');
	assert.observableIsValid(testObj, '11/18/2011');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var date = ko.observable(true);
	var testObj = ko.observable('').extend({ date: date });
	testObj('stuff');
	assert.violatesDateRule(testObj, 'stuff');
});

//#endregion

//#region DateISO Validation

QUnit.module('DateISO Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ dateISO: 'test' });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ dateISO: 'test' });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ dateISO: 'test' });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ dateISO: true });
	testObj('2011-11-18');
	assert.observableIsValid(testObj, '2011-11-18');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ dateISO: true });
	testObj('stuff');
	assert.violatesDateRule(testObj, 'stuff');
});

QUnit.test('Object is Valid and dateISO is observable and isValid returns True', function(assert) {
	var dateISO = ko.observable(true);
	var testObj = ko.observable('').extend({ dateISO: dateISO });
	testObj('2011-11-18');
	assert.observableIsValid(testObj, '2011-11-18');
});

QUnit.test('Object is NOT Valid and dateISO is observable and isValid returns False', function(assert) {
	var dateISO = ko.observable(true);
	var testObj = ko.observable('').extend({ dateISO: dateISO });
	testObj('stuff');
	assert.violatesDateRule(testObj, 'stuff');
});

QUnit.test('Object is NOT Valid if month is not in acceptable range', function(assert) {
	var testObj = ko.observable('').extend({ dateISO: true });
	testObj('2011-13-18');
	assert.violatesDateRule(testObj, '2011-13-18');
});

QUnit.test('Object is NOT Valid if day is not in acceptable range', function(assert) {
	var testObj = ko.observable('').extend({ dateISO: true });
	testObj('2011-12-40');
	assert.violatesDateRule(testObj, '2011-12-40');
});

//#endregion

//#region Number Validation

QUnit.module('Number Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ number: true });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ number: true });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ number: true });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ number: true });
	testObj(200.01);
	assert.observableIsValid(testObj, 200.01);
});

QUnit.test('Number is Valid (starting with point) and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ number: true });
	testObj('.15');
	assert.observableIsValid(testObj, '.15');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ number: true });
	testObj('stuff');
	assert.violatesNumberRule(testObj, 'stuff');
});

QUnit.test('Number is Valid (starting with point) and number is observable and isValid returns True', function(assert) {
	var number = ko.observable(true);
	var testObj = ko.observable('').extend({ number: number });
	testObj('.15');
	assert.observableIsValid(testObj, '.15');
});

QUnit.test('Object is NOT Valid and number is observable and isValid returns False', function(assert) {
	var number = ko.observable(true);
	var testObj = ko.observable('').extend({ number: number });
	testObj('stuff');
	assert.violatesNumberRule(testObj, 'stuff');
});

//#endregion

//#region Digit Validation

QUnit.module('Digit Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ digit: true });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ digit: true });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ digit: true });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ digit: true });
	testObj(2);
	assert.observableIsValid(testObj, 2);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ digit: true });
	testObj('stuff');
	assert.violatesDigitRule(testObj, 'stuff');
});

QUnit.test('Object is Valid and digit is observable and isValid returns True', function(assert) {
	var digit = ko.observable(true);
	var testObj = ko.observable('').extend({ digit: digit });
	testObj(2);
	assert.observableIsValid(testObj, 2);
});

QUnit.test('Object is NOT Valid and digit is observable and isValid returns False', function(assert) {
	var digit = ko.observable(true);
	var testObj = ko.observable('').extend({ digit: digit });
	testObj('stuff');
	assert.violatesDigitRule(testObj, 'stuff');
});

//#endregion

//#region PhoneUS Validation

QUnit.module('PhoneUS Validation');

QUnit.test('Object is Valid when observable has not been initialized - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ phoneUS: true });
	assert.observableIsValid(testObj, undefined);
});

QUnit.test('Object is Valid when null value is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ phoneUS: true });
	testObj(null);
	assert.observableIsValid(testObj, null);
});

QUnit.test('Object is Valid when empty string is present - Preserves Optional Properties', function(assert) {
	var testObj = ko.observable().extend({ phoneUS: true });
	testObj('');
	assert.observableIsValid(testObj, '');
});

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var testObj = ko.observable('').extend({ phoneUS: true });
	testObj('765-523-4569');
	assert.observableIsValid(testObj, '765-523-4569');
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var testObj = ko.observable('').extend({ phoneUS: true });
	testObj(5);
	assert.violatesPhoneUSRule(testObj, 5);
});

QUnit.test('Object is Valid and phoneUS is observable and isValid returns True', function(assert) {
	var phoneUS = ko.observable(true);
	var testObj = ko.observable('').extend({ phoneUS: phoneUS });
	testObj('765-523-4569');
	assert.observableIsValid(testObj, '765-523-4569');
});

QUnit.test('Object is NOT Valid and phoneUS is observable and isValid returns False', function(assert) {
	var phoneUS = ko.observable(true);
	var testObj = ko.observable('').extend({ phoneUS: phoneUS });
	testObj(5);
	assert.violatesPhoneUSRule(testObj, 5);
});

//#endregion

//#region Equal tests

QUnit.module('Equal Tests');

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var compareObj = ko.observable(12);
	var testObj = ko.observable('').extend({ equal: compareObj });
	testObj(12);
	assert.observableIsValid(testObj, 12);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var compareObj = ko.observable(12);
	var testObj = ko.observable('').extend({ equal: compareObj });
	testObj(11);
	assert.violatesMustEqualRule(testObj, 11);
});

//#endregion

//#region NotEqual tests

QUnit.module('Not Equal Tests');

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var compareObj = ko.observable(12);
	var testObj = ko.observable('').extend({ notEqual: compareObj });
	testObj(11);
	assert.observableIsValid(testObj, 11);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var compareObj = ko.observable(12);
	var testObj = ko.observable('').extend({ notEqual: compareObj });
	testObj(12);
	assert.violatesNotEqualRule(testObj, 12);
});

//#endregion

//#region Unique tests

QUnit.module('Unique Tests');

QUnit.test('Object is Valid and isValid returns True', function(assert) {
	var compareObj = ko.observableArray([11, 12, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj } });
	testObj(11);
	assert.observableIsValid(testObj, 11);
});

QUnit.test('Object is NOT Valid and isValid returns False', function(assert) {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj } });
	testObj(13);
	assert.violatesUniqueRule(testObj, 13);
});

QUnit.test('Correct unique validation behaviour for external values', function(assert) {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj, externalValue: true } });

	testObj(12);
	assert.violatesUniqueRule(testObj, 12);

	testObj(13);
	assert.violatesUniqueRule(testObj, 13);

	testObj(10);
	assert.observableIsValid(testObj, 10);
});

QUnit.test('Issue #365 - Correct unique validation behaviour for external values that are in the collection', function(assert) {
	var compareObj = ko.observableArray([11, 12, 13, 13]);
	var testObj = ko.observable('').extend({ unique: { collection: compareObj, externalValue: 12 } });

	testObj(12);
	assert.violatesUniqueRule(testObj, 12);

	testObj(10);
	assert.observableIsValid(testObj, 10);
});

//#endregion
