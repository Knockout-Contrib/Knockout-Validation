/*global QUnit:false*/


//#region Custom assertions to ensure thoroughly testing

/**
 * Verifies that observable has the expected value, is valid and error message is empty.
 * This helper can be used for checking against any rule applied to an observable.
 * @param observable The observable to check.
 * @param value The expected value of the observable.
 */
QUnit.assert.observableIsValid = function(observable, value) {
	this.strictEqual(observable(), value, 'observable still works');
	this.strictEqual(observable.isValid(), true, 'observable is valid');
	this.strictEqual(observable.error(), null, 'message is empty');
};

/**
 * Verifies that observable has the expected value, is not valid and has the right error message.
 * @param observable The observable to check
 * @param value The expected value of the observable
 * @param ruleMessage The expected value returned by error() method of the observable.
 */
QUnit.assert.observableIsNotValid = function(observable, value, ruleMessage) {
	this.strictEqual(observable(), value, 'observable still works');
	this.strictEqual(observable.isValid(), false, 'observable is not valid');
	this.strictEqual(observable.error(), ruleMessage, 'message is correct');
};

QUnit.assert.violatesRequiredRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'This field is required.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesMinRule = function(observable, value, minValue, customMessage) {
	var ruleMessage = customMessage || 'Please enter a value greater than or equal to ' + minValue.toString() + '.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesMaxRule = function(observable, value, maxValue, customMessage) {
	var ruleMessage = customMessage || 'Please enter a value less than or equal to ' + maxValue.toString() + '.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesMinLengthRule = function(observable, value, minLength, customMessage) {
	var ruleMessage = customMessage || 'Please enter at least ' + minLength.toString() + ' characters.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesMaxLengthRule = function(observable, value, maxLength, customMessage) {
	var ruleMessage = customMessage || 'Please enter no more than ' + maxLength.toString() + ' characters.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesPatternRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please check this value.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesStepRule = function(observable, value, step, customMessage) {
	var ruleMessage = customMessage || 'The value must increment by ' + step.toString() + '.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesEmailRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please enter a proper email address.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesDateRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please enter a proper date.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesNumberRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please enter a number.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesDigitRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please enter a digit.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesPhoneUSRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please specify a valid phone number.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesMustEqualRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Values must equal.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesNotEqualRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please choose another value.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

QUnit.assert.violatesUniqueRule = function(observable, value, customMessage) {
	var ruleMessage = customMessage || 'Please make sure the value is unique.';
	this.observableIsNotValid(observable, value, ruleMessage);
};

//#endregion
