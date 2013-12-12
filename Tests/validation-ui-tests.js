/*global
	module:false,
	equal:false,
	notEqual:false,
	strictEqual:false,
	test:false,
	ok:false,
	asyncTest:false,
	start: false,
	stop: false,
	$: false,
	expect: false
*/

module('UI Tests', {
    setup: function () {

    },
    teardown: function () {
        ko.cleanNode($('#testContainer')[0]);
        $('#testContainer').empty();
        ko.validation.reset();
    }
});

//utility functions
var applyTestBindings = function (vm) {
    ko.applyBindingsWithValidation(vm, $('#testContainer')[0]);
};

var addTestHtml = function(html){
    $('#testContainer').html(html);
};

test('hasAttribute works in old IE', function () {

    addTestHtml('<input id="myTestInput" type="text" required />');

    var el = document.getElementById('myTestInput');

    ok(el, 'found element');

    ok(ko.validation.utils.hasAttribute(el, 'required'), 'element correctly has html5 input attribute');
    ok(!ko.validation.utils.hasAttribute(el, 'pattern'), 'element correctly does not have html5 input attribute');
});

test("checked binding sets error class on radio buttons", function() {
    addTestHtml("<input id='testInput1' type='radio' name='group' value='one' data-bind='checked: result' />" +
        "<input id='testInput2' type='radio' name='group' value='two' data-bind='checked: result' />" +
        "<input id='testInput3' type='radio' name='group' value='three' data-bind='checked: result' />");

    var $input = $("#testInput2"),
        vm = {
            result: ko.observable("").extend({ required: true })
        };
    ko.validation.init({ decorateInputElement: true }, true);

    vm.result.isModified(true); //fake a modification

    applyTestBindings(vm);

    ok(!vm.result.isValid(), "Should initially be invalid");
    ok($input.hasClass("validationElement"), "Validation class should have been added");

    $input.prop("checked", true);
    $input.click(); //trigger the validation

    equal(vm.result(), "two", "Value should have changed");
    ok(vm.result.isValid(), "Should now be valid");
    ok(!$input.hasClass("validationElement"), "Validation class should have been removed");
});

//#region Inserting Messages

test('Inserting Messages Works', function () {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.siblings().first().text();

    equal(msg, 'This field is required.', msg);
});

test('Inserting Messages with HTML Works', function () {

    ko.validation.init({
        allowHtmlMessages: true
    }, true);

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: {message: 'This field is <b>required</b>.'} })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.siblings().first().html();

    equal(msg, 'This field is <b>required</b>.', msg);
});

//#endregion

//#region Inserting Messages

test('Decorating Elements Works', function () {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        decorateInputElement: true
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    ok(!$testInput.hasClass('validationElement'), "CSS class shouldn't present");

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    ok($testInput.hasClass('validationElement'), "CSS class should present");
});

test('Decorating Elements On Modified Works', function () {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        decorateInputElement: true,
        decorateElementOnModified: false
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    ok($testInput.hasClass('validationElement'), "CSS class should present");

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    ok(!$testInput.hasClass('validationElement'), "CSS class shouldn't present");
});

//#endregion

//#region Showing errors as titles

test('Showing Errors As Titles Works', function () {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        errorsAsTitleOnModified: true,
        decorateInputElement: true
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.attr('title');

    equal(msg, 'This field is required.', msg);
});

test('Original titles are restored', function () {

    addTestHtml('<input id="myTestInput" title="my-orig-title" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        errorsAsTitleOnModified: true,
        decorateInputElement: true
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var msg = $testInput.attr('title');
    equal(msg, 'This field is required.', msg);

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    equal(msg, 'my-orig-title', msg);

});

test("Original titles are restored to blank", function () {
	addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

	var vm = {
		firstName: ko.observable('').extend({ required: true })
	};

	// make sure the options are ok.
	ko.validation.init({
		errorsAsTitleOnModified: true,
		decorateInputElement: true
	}, true);

	applyTestBindings(vm);

	var $testInput = $('#myTestInput');

	$testInput.val("a"); //set it
	$testInput.change(); //trigger change event

	$testInput.val(""); //set it
	$testInput.change(); //trigger change event

	ok(!vm.firstName.isValid(), 'First Name is NOT Valid');

	//now make the name valid
	vm.firstName("valid name");
	ok(vm.firstName.isValid(), "Should now be valid");

	//and check that the title was reset to blank
	var updatedTitle = $testInput.attr("title");
	ok(!updatedTitle, "Title should have been reset to blank");
});

test('Original titles are restored with multiple validators, too', function () {

    addTestHtml('<input id="myTestInput" title="my-orig-title" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true, minLength: 2 })
    };

    // make sure the options are ok.
    ko.validation.init({
        errorsAsTitleOnModified: true,
        decorateInputElement: true
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("aa"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var msg = $testInput.attr('title');
    equal(msg, 'This field is required.', msg);

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    equal(msg, 'Please enter at least 2 characters.', msg);

    $testInput.val("aa"); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    equal(msg, 'my-orig-title', msg);

});

test('Showing Errors As Titles is disabled sucessfully', function () {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        errorsAsTitleOnModified: true,
        decorateInputElement: true,
		errorsAsTitle: false
    }, true);

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.attr('title');

    notEqual(msg, 'This field is required.', msg);
});

test("Removing error message from title when isModified is reset", function () {

    addTestHtml('<input id="myTestInput" data-bind="value: prop" type="text" />');

    var vm = {
        prop: ko.observable('').extend({ required: true })
    };

    // make sure the options are ok.
    ko.validation.init({
        errorsAsTitleOnModified: true,
        decorateInputElement: true,
        errorsAsTitle: false
    }, true);

    applyTestBindings(vm);

    vm.prop("valid").prop("");
    vm.prop.isModified(false);

    ok(!$("#myTestInput").attr("title"));
});

//#endregion

//#region Validation Option Tests

test('Validation Options - Basic Tests', function () {

    var testHtml = '<div data-bind="validationOptions: { insertMessages: false }"><input type="text" id="myTestInput" data-bind="value: firstName" /></div>';

    addTestHtml(testHtml);

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    $testInput.val(""); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var noMsgs = $testInput.siblings().length;

    equal(noMsgs, 0, 'No Messages were inserted');

});

test('Validation Options - Nested Test', function () {

    var testHtml = '<div data-bind="validationOptions: { insertMessages: false }">' +
                        '<input type="text" id="myTestInput" data-bind="value: firstName" />' +
                        '<div data-bind="with: someObj">' +
                            '<input id="myLastName" type="text" data-bind="value: lastName" />' +
                        '</div>' +
                    '</div>';

    addTestHtml(testHtml);

    var vm = {
        firstName: ko.observable('').extend({ required: true }),
        someObj: {
            lastName: ko.observable().extend({ minLength : 2 })
        }
    };

    applyTestBindings(vm);

    var $testInput = $('#myLastName');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.someObj.lastName.isValid();

    ok(!isValid, 'Last Name is NOT Valid');

    var noMsgs = $testInput.siblings().length;

    equal(noMsgs, 0, 'No Messages were inserted');

});

test('Validation Options - Options only apply to their HTML Contexts', function () {

    var testHtml = '<div >' +
                        '<div data-bind="validationOptions: { insertMessages: false }">' +
                            '<div data-bind="with: someObj">' +
                                '<input id="myLastName" type="text" data-bind="value: lastName" />' +
                            '</div>' +
                        '</div>' +
                        '<input type="text" id="myFirstName" data-bind="value: firstName" />' +
                    '</div>';

    addTestHtml(testHtml);

    var vm = {
        firstName: ko.observable('a').extend({ required: true }),
        someObj: {
            lastName: ko.observable().extend({ minLength: 2 })
        }
    };

    applyTestBindings(vm);

    var $testInput = $('#myLastName');

    $testInput.val("a"); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.someObj.lastName.isValid();

    ok(!isValid, 'Last Name is NOT Valid');

    var noMsgs = $testInput.siblings().length;

    equal(noMsgs, 0, 'No Messages were inserted');

    var $firstName = $('#myFirstName');
    $firstName.val(""); //set it
    $firstName.change(); //trigger change event

    ok(!vm.firstName.isValid(), 'Validation Still works correctly');

    var insertMsgCt = $firstName.siblings('span').length;
    equal(insertMsgCt, 1, 'Should have inserted 1 message beside the first name!');

});

test("Issue #43 & #47 - Error messages are not switched correctly", function () {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 }),
        dummyProp: ko.observable().extend({ required: true })
    };

    vm.errors = ko.validation.group(vm);

    // setup the html
    addTestHtml('<span id="testMessage" data-bind="validationMessage: testObj"></span>');
    applyTestBindings(vm);

    var $msg = $('#testMessage');

    vm.testObj(-1); // should invalidate the min rule

    ok(!vm.testObj.isValid(), vm.testObj.error());
    equal(vm.testObj.error(), $msg.text(), "Min rule was correctly triggered");

    vm.testObj(101); // should invalidate the max rule

    ok(!vm.testObj.isValid(), vm.testObj.error());
    equal(vm.testObj.error(), $msg.text(), "Max rule was correctly triggered");
});

test("Issue #44 - Validation Element - Is Valid Test", function () {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj, validationElement: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({ decorateInputElement: true }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    ok(!$el.hasClass('validationElement'), 'Does not have the validation class');

    vm.testObj(2); // should validate the min rule

    ok(vm.testObj.isValid(), "Object is valid");
    ok(!$el.hasClass('validationElement'), 'Correctly does not have the validation class');

});

test("Issue #44 - Validation Element - Is Invalid Test", function () {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj, validationElement: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({ decorateInputElement: true }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    ok(!$el.hasClass('validationElement'), 'Does not have the validation class');

    vm.testObj(-1); // should invalidate the min rule

    ok(!vm.testObj.isValid(), "Object is not valid");
    ok($el.hasClass('validationElement'), 'Correctly does have the validation class');

});

test("Issue #80 - Write HTML5 Validation Attributes programmatically", function () {

    var vm = {
        testObj: ko.observable(15).extend({ min: 1, max: 100, required: true, step: 2, pattern: /blah/i })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({
        decorateInputElement: true,
        writeInputAttributes: true
    }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    var tests = {};

    ko.utils.arrayForEach(['required', 'min', 'max', 'step', 'pattern'], function (attr) {
        tests[attr] = $el.attr(attr);
    });

    ok(tests.required, "Required Found");
    strictEqual(tests.min, "1", "Min Found");
    strictEqual(tests.max, "100", "Max Found");
    strictEqual(tests.step, "2", "Step Found");
    strictEqual(tests.pattern, "blah", "Pattern Found");

});

test("Issue #80 - HTML5 attributes - pattern", function () {

    var pattern = /something/i;
    var patternString = "something";

    var vm = {
        testObj: ko.observable('something').extend({
            pattern: pattern
        })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({
        decorateInputElement: true,
        writeInputAttributes: true
    }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    var el = $el.get(0);

    var param = $el.attr('pattern');

    // fire the validity check event
    el.checkValidity();

    strictEqual(param, patternString, "Patterns Match");
    ok(vm.testObj.isValid(), 'Observable is valid');
    ok(el.validity.valid, "Element is showing it is valid");
    strictEqual(vm.testObj(), 'something', 'Observable still works');
});

module('HTML5 UI Tests', {
    setup: function () {

    },
    teardown: function () {
        ko.cleanNode($('#testContainer')[0]);
        $('#testContainer').empty();
        ko.validation.reset();
    }
});

test("HTML5 Input types", function () {

    var vm = {
        invalidEmail: ko.validatedObservable('invalidEmail'),
        invalidDate: ko.validatedObservable('no date'),
        invalidNumber: ko.validatedObservable('invalidNumber')
    };

    // setup the html
    addTestHtml('<input type="email" id="emailInput" data-bind="value: invalidEmail"/>' +
        '<input type="date" id="dateInput" data-bind="value: invalidDate"/>'+
        '<input type="number" id="numberInput" data-bind="value: invalidNumber"/>');

    // make sure we parse element attributes
    ko.validation.init({
        parseInputAttributes: true
    }, true);

    applyTestBindings(vm);
    stop();

    // The validators for the HTML5 Input types are applied asynchronously,
    // so we need to wait until the validators have been applied.  This is
    // done by checking to make sure that the rule has been added to the rules
    // list of each observable.
    var intervalsWaited = 0;
    var intervalId = setInterval(function() {
        if (intervalsWaited++ > 1000) {
            clearInterval(intervalId);
            ok(false, 'Async HTML5 Input validators did not apply within a reasonable amount of time');
            start();
        }
        var validatorsReady =
            vm.invalidEmail.rules().length > 0 &&
            vm.invalidDate.rules().length > 0 &&
            vm.invalidNumber.rules().length > 0;
        if (validatorsReady) {
			runAssertions();
        }
    }, 1);

    function runAssertions()
    {
        clearInterval(intervalId);

        var $emailInput = $('#emailInput');
        var emailInput = $emailInput.get(0);
        var $dateInput = $('#dateInput');
        var dateInput = $dateInput.get(0);
        var $numberInput = $('#numberInput');
        var numberInput = $numberInput.get(0);

        ok(!vm.invalidEmail.isValid(), 'Expected email to be considered as invalid.');
        ok(!vm.invalidDate.isValid(), 'Expected date to be considered as invalid.');
        ok(!vm.invalidNumber.isValid(), 'Expected date to be considered as invalid.');

        start();
    }
});

test('min Attribute of 20 should fail for value of 8', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber(8); // should fail the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('min Attribute of 20 should fail for value of "8"', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" min="20" data-bind="value:someNumber", validationElement: someNumber" />');
    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("8"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('min Attribute of 20 should fail for value of "8" with text type', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" min="20" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("8"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('min Attribute of 20 should pass for value of 110', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true,
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber(110); // should validate the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);

});

test('MIN Attribute of 20 should pass for value of "110"', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true,
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("110"); // should validate the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);

});

test('max Attribute of 30 should fail for value of 100', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber(100); // should fail the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('max Attribute of 30 should fail for value of "100"', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" max="30" data-bind="value:someNumber", validationElement: someNumber" />');
    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("100"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('max Attribute of 30 should fail for value of "100" with text type', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" max="30" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber(100); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('max Attribute of 30 should pass for value of 5', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true,
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber(5); // should validate the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);

});

test('max Attribute of 30 should pass for value of "5"', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true,
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("5"); // should validate the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);

});

test('max Attribute of 2010-09 should fail for value of 2011-03', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" max="2010-09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2011-03"); // should fail the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('max Attribute of 2010-09 should succeed for value of 2010-08', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" max="2010-09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2010-08"); // should succeed the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2010-09 should fail for value of 2010-08', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2010-09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2010-08"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2012-05 should fail for value of 2011-01', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2012-05" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2011-01"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2012-03 should succeed for value of 2013-01', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2012-03" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2013-01"); // should succeed the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('max Attribute of 2010-W09 should fail for value of 2011-W03', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" max="2010-W09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2011-W03"); // should fail the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is not valid");

        start();
    }, 1);
});

test('max Attribute of 2010-W09 should succeed for value of 2010-W08', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" max="2010-W09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2010-W08"); // should succeed the max rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2010-W09 should fail for value of 2010-W08', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="Week" min="2010-W09" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2010-W08"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2012-W05 should fail for value of 2011-W01', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" min="2012-W05" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2011-W01"); // should fail the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(!vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

test('min Attribute of 2012-W03 should succeed for value of 2013-W01', function () {

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" min="2012-W03" data-bind="value:someNumber", validationElement: someNumber" />');

    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);
    stop();

    setTimeout(function() {
        vm.someNumber("2013-W01"); // should succeed the min rule

        var el = $('#myTestInput');

        ok(el, 'found element');
        ok(vm.someNumber.isValid(), "Object is valid");

        start();
    }, 1);
});

//#endregion