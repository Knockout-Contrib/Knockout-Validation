/*global QUnit:false, $:false*/


QUnit.module('UI Tests', {
    afterEach: function() {
        var $element = $('#testContainer');
        ko.cleanNode($element[0]);
        $element.empty();
        ko.validation.reset();
    }
});

//utility functions
var applyTestBindings = function(vm) {
    ko.applyBindingsWithValidation(vm, $('#testContainer')[0]);
};

var addTestHtml = function(html) {
    $('#testContainer').html(html);
};


QUnit.test('hasAttribute works in old IE', function(assert) {

    addTestHtml('<input id="myTestInput" type="text" required />');

    var el = $('#myTestInput')[0];

    assert.ok(el, 'found element');
    assert.ok(ko.validation.utils.hasAttribute(el, 'required'), 'element correctly has html5 input attribute');
    assert.ok(!ko.validation.utils.hasAttribute(el, 'pattern'), 'element correctly does not have html5 input attribute');
});

QUnit.test('checked binding sets error class on radio buttons', function(assert) {
    addTestHtml("<input id='testInput1' type='radio' name='group' value='one' data-bind='checked: result' />" +
        "<input id='testInput2' type='radio' name='group' value='two' data-bind='checked: result' />" +
        "<input id='testInput3' type='radio' name='group' value='three' data-bind='checked: result' />");

    var $input = $('#testInput2'),
        vm = {
            result: ko.observable('').extend({ required: true })
        };
    ko.validation.init({ decorateInputElement: true }, true);

    vm.result.isModified(true); //fake a modification

    applyTestBindings(vm);

    assert.ok(!vm.result.isValid(), 'Should initially be invalid');
    assert.ok($input.hasClass('validationElement'), 'Validation class should have been added');

    $input.prop('checked', true);
    $input.click(); //trigger the validation

    assert.equal(vm.result(), 'two', 'Value should have changed');
    assert.ok(vm.result.isValid(), 'Should now be valid');
    assert.ok(!$input.hasClass('validationElement'), 'Validation class should have been removed');
});

QUnit.test('textInput Binding Works', function(assert) {
    if (!ko.bindingHandlers.textInput) {
        // 'textInput binding not supported (ko.version < 3.2).
        assert.ok(true, 'textInput binding is available in ko >= 3.2. The test will be skipped.');
        return;
    }
    addTestHtml('<input id="myTestInput" data-bind="textInput: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event
    assert.ok(vm.firstName.isValid(), 'First Name is Valid');

    $testInput.val(''); //set it
    $testInput.change(); //trigger change event
    assert.ok(!vm.firstName.isValid(), 'First Name is NOT Valid');

    var msg = $testInput.siblings().first().text();

    assert.equal(msg, 'This field is required.', msg);
});

QUnit.test('selectedOptions Binding Works', function(assert) {

    addTestHtml('<select id="myTestInput" data-bind="options: availableNames, selectedOptions: selectedNames, optionsValue: \'name\', optionsText: \'name\'" multiple="true"></select>');

    var vm = {
        availableNames: ko.observableArray([
            {name: 'First'},
            {name: 'Second'},
            {name: 'Third'}
        ]),
        selectedNames: ko.observableArray()
            .extend({
                validation: {
                    validator: function(value) {
                        return value.length > 0;
                    },
                    message: 'Please select at least one item.'
                }
            })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput');

    $testInput.val('First');
    $testInput.change();
    assert.ok(vm.selectedNames.isValid(), 'selectedNames is Valid');

    $testInput.val('');
    $testInput.change();
    assert.ok(!vm.selectedNames.isValid(), 'selectedNames is NOT Valid');

    var msg = $testInput.siblings().first().text();
    assert.equal(msg, 'Please select at least one item.', msg);
});

QUnit.test('Issue #277 - parseInputAttributes does not duplicate rules when parseInputAttributes=true', function(assert) {
    var done = assert.async();

    ko.validation.init({parseInputAttributes: true, writeInputAttributes: false}, true);

    var testObj = ko.observable('').extend({required: true, email: true});
    addTestHtml('<input type="email" required="required" required data-bind="value: email" />');
    applyTestBindings({ email: testObj });

    setTimeout(function() {
        assert.equal(testObj.rules().length, 2, 'rules are not duplicated');
        assert.equal(testObj.error(), 'This field is required.');

        testObj('abc');
        assert.equal(testObj.error(), 'Please enter a proper email address.');

        done();
    }, 1);
});

QUnit.test('Issue #277 - parseInputAttributes does not duplicate rules when parseInputAttributes=true', function(assert) {
    var done = assert.async();

    ko.validation.init({parseInputAttributes: true, writeInputAttributes: true}, true);

    var testObj = ko.observable('').extend({required: true, email: true});
    addTestHtml('<input type="email" required="required" required data-bind="value: email" />');
    applyTestBindings({ email: testObj });

    setTimeout(function() {
        assert.equal(testObj.rules().length, 2, 'rules are not duplicated');
        assert.equal(testObj.error(), 'This field is required.');

        testObj('abc');
        assert.equal(testObj.error(), 'Please enter a proper email address.');

        done();
    }, 1);
});

QUnit.test('Issue #526 - validation cannot be removed from attached observable', function(assert) {

    var testObj = ko.observable(1).extend({ min: 2 });

    addTestHtml('<input id="myTestInput" data-bind="value: value" type="text" />');
    applyTestBindings({value: testObj});

    assert.violatesMinRule(testObj, 1, 2);
    assert.ok(ko.validation.utils.isValidatable(testObj));

    testObj.extend({validatable: false});
    assert.equal(ko.validation.utils.isValidatable(testObj), false);
});

//#region Inserting Messages

QUnit.test('Inserting Messages Works', function(assert) {

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput').val('a').change().val('').change();
    assert.ok(!vm.firstName.isValid(), 'First Name is NOT Valid');

    var msg = $testInput.siblings().first().text();
    assert.equal(msg, 'This field is required.', msg);
});

QUnit.test('Inserting Messages with HTML Works', function(assert) {

    ko.validation.init({
        allowHtmlMessages: true
    }, true);

    addTestHtml('<input id="myTestInput" data-bind="value: firstName" type="text" />');

    var vm = {
        firstName: ko.observable('').extend({ required: {message: 'This field is <b>required</b>.'} })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput').val('a').change().val('').change();
    assert.ok(!vm.firstName.isValid(), 'First Name is NOT Valid');

    var msg = $testInput.siblings().first().html();
    assert.equal(msg, 'This field is <b>required</b>.', msg);
});

//#endregion

//#region Decorating Elements

QUnit.test('Decorating Elements Works', function(assert) {

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
    assert.ok(!$testInput.hasClass('validationElement'), "CSS class shouldn't present");

    $testInput.val('a').change().val('').change();
    assert.ok($testInput.hasClass('validationElement'), 'CSS class should present');
});

QUnit.test('Decorating Elements On Modified Works', function(assert) {

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

    assert.ok($testInput.hasClass('validationElement'), 'CSS class should present');

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    assert.ok(!$testInput.hasClass('validationElement'), "CSS class shouldn't present");
});

//#endregion

//#region Showing errors as titles

QUnit.test('Showing Errors As Titles Works', function(assert) {

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

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    $testInput.val(''); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    assert.ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.attr('title');

    assert.equal(msg, 'This field is required.', msg);
});

QUnit.test('Original titles are restored', function(assert) {

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

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    $testInput.val(''); //set it
    $testInput.change(); //trigger change event

    var msg = $testInput.attr('title');
    assert.equal(msg, 'This field is required.', msg);

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    assert.equal(msg, 'my-orig-title', msg);

});

QUnit.test('Original titles are restored to blank', function(assert) {
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

	$testInput.val('a'); //set it
	$testInput.change(); //trigger change event

	$testInput.val(''); //set it
	$testInput.change(); //trigger change event

	assert.ok(!vm.firstName.isValid(), 'First Name is NOT Valid');

	//now make the name valid
	vm.firstName('valid name');
	assert.ok(vm.firstName.isValid(), 'Should now be valid');

	//and check that the title was reset to blank
	var updatedTitle = $testInput.attr('title');
	assert.ok(!updatedTitle, 'Title should have been reset to blank');
});

QUnit.test('Original titles are restored with multiple validators, too', function(assert) {

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

    $testInput.val('aa'); //set it
    $testInput.change(); //trigger change event

    $testInput.val(''); //set it
    $testInput.change(); //trigger change event

    var msg = $testInput.attr('title');
    assert.equal(msg, 'This field is required.', msg);

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    assert.equal(msg, 'Please enter at least 2 characters.', msg);

    $testInput.val('aa'); //set it
    $testInput.change(); //trigger change event

    msg = $testInput.attr('title');
    assert.equal(msg, 'my-orig-title', msg);

});

QUnit.test('Showing Errors As Titles is disabled successfully', function(assert) {

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

    $testInput.val('a'); //set it
    $testInput.change(); //trigger change event

    $testInput.val(''); //set it
    $testInput.change(); //trigger change event

    var isValid = vm.firstName.isValid();

    assert.ok(!isValid, 'First Name is NOT Valid');

    var msg = $testInput.attr('title');

    assert.notEqual(msg, 'This field is required.', msg);
});

QUnit.test('Removing error message from title when isModified is reset', function(assert) {
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

    vm.prop('valid').prop('');
    vm.prop.isModified(false);

    assert.ok(!$('#myTestInput').attr('title'));
});

//#endregion

//#region Validation Option Tests

QUnit.test('Validation Options - Basic Tests', function(assert) {
    var testHtml = '<div data-bind="validationOptions: { insertMessages: false }"><input type="text" id="myTestInput" data-bind="value: firstName" /></div>';
    addTestHtml(testHtml);

    var vm = {
        firstName: ko.observable('').extend({ required: true })
    };

    applyTestBindings(vm);

    var $testInput = $('#myTestInput')
        .val('a').change()
        .val('').change();

    assert.violatesRequiredRule(vm.firstName, '');

    var noMsgs = $testInput.siblings().length;
    assert.equal(noMsgs, 0, 'No Messages were inserted');
});

QUnit.test('Validation Options - Nested Test', function(assert) {

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

    var $testInput = $('#myLastName').val('a').change();
    assert.violatesMinLengthRule(vm.someObj.lastName, 'a', 2);

    var noMsgs = $testInput.siblings().length;
    assert.equal(noMsgs, 0, 'No Messages were inserted');
});

QUnit.test('Validation Options - Options only apply to their HTML Contexts', function(assert) {
    var testHtml = '<div>' +
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

    var $testInput = $('#myLastName').val('a').change();
    assert.violatesMinLengthRule(vm.someObj.lastName, 'a', 2);

    var noMsgs = $testInput.siblings().length;
    assert.equal(noMsgs, 0, 'No Messages were inserted');

    var $firstName = $('#myFirstName').val('').change();
    assert.violatesRequiredRule(vm.firstName, '');

    var insertMsgCt = $firstName.siblings('span').length;
    assert.equal(insertMsgCt, 1, 'Should have inserted 1 message beside the first name!');
});

QUnit.test('Issue #43 & #47 - Error messages are not switched correctly', function(assert) {
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
    assert.violatesMinRule(vm.testObj, -1, 1);
    assert.equal(vm.testObj.error(), $msg.text(), 'Min rule was correctly triggered');

    vm.testObj(101); // should invalidate the max rule
    assert.violatesMaxRule(vm.testObj, 101, 100);
    assert.equal(vm.testObj.error(), $msg.text(), 'Max rule was correctly triggered');
});

QUnit.test('Issue #44 - Validation Element - Is Valid Test', function(assert) {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj, validationElement: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({ decorateInputElement: true }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    assert.ok(!$el.hasClass('validationElement'), 'Does not have the validation class');

    vm.testObj(2); // should validate the min rule

    assert.ok(vm.testObj.isValid(), 'Object is valid');
    assert.ok(!$el.hasClass('validationElement'), 'Correctly does not have the validation class');

});

QUnit.test('Issue #44 - Validation Element - Is Invalid Test', function(assert) {
    var vm = {
        testObj: ko.observable().extend({ min: 1, max: 100 })
    };

    // setup the html
    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj, validationElement: testObj"/>');

    // make sure we allow element decorations
    ko.validation.init({ decorateInputElement: true }, true);

    applyTestBindings(vm);

    var $el = $('#testElement');
    assert.ok(!$el.hasClass('validationElement'), 'Does not have the validation class');

    vm.testObj(-1); // should invalidate the min rule

    assert.ok(!vm.testObj.isValid(), 'Object is not valid');
    assert.ok($el.hasClass('validationElement'), 'Correctly does have the validation class');

});

QUnit.test('Issue #519 - validationElement can be applied before element is validatable', function(assert) {
    var vm = {
        testObj: ko.observable()
    };

    addTestHtml('<input type="text" id="testElement" data-bind="value: testObj, validationElement: testObj"/>');
    applyTestBindings(vm);

    assert.strictEqual(!!$("#testElement").attr("class"), false);
    assert.ok(!ko.validation.utils.isValidatable(vm.testObj));

    vm.testObj.extend({ required: true });
    vm.testObj(null);
    assert.ok(ko.validation.utils.isValidatable(vm.testObj));
    assert.strictEqual($("#testElement").attr("class"), "validationElement");
    assert.strictEqual($("#testElement").attr("title"), "This field is required.");

    vm.testObj.extend({ validatable: false });
    assert.ok(!ko.validation.utils.isValidatable(vm.testObj));
    assert.strictEqual($("#testElement").attr("title"), undefined);
});

QUnit.test('Issue #519 - validationMessage can be applied before element is validatable', function(assert) {
    var vm = {
        testObj: ko.observable()
    };

    addTestHtml('<span id="testElement" data-bind="validationMessage: testObj"/>');
    applyTestBindings(vm);

    assert.ok(!$("#testElement").is(':visible'));
    assert.ok(!ko.validation.utils.isValidatable(vm.testObj));

    vm.testObj.extend({ required: true });
    vm.testObj(null);
    assert.ok(ko.validation.utils.isValidatable(vm.testObj));
    assert.ok($("#testElement").is(':visible'));
    assert.strictEqual($("#testElement").html(), "This field is required.");

    vm.testObj.extend({ validatable: false });
    assert.ok(!ko.validation.utils.isValidatable(vm.testObj));
    assert.strictEqual($("#testElement").html(), "");
});

QUnit.test('Issue #481 - writeInputAttributes doesn\'t unwrap params to sync attribute', function(assert) {
    var minValue = ko.observable(4);
    var testObj = ko.observable(10).extend({min: minValue});

    var $element = jQuery('<input type="text" data-bind="value: value">');
    addTestHtml($element);
    ko.validation.init({writeInputAttributes: true}, true);
    applyTestBindings({value: testObj});

    assert.strictEqual($element.attr('min'), '4', 'min attribute is written');
    minValue(15);
    assert.strictEqual($element.attr('min'), '15', 'min attribute is written');
});

QUnit.test('Issue #80 - Write HTML5 Validation Attributes programmatically', function(assert) {

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

    ko.utils.arrayForEach(['required', 'min', 'max', 'step', 'pattern'], function(attr) {
        tests[attr] = $el.attr(attr);
    });

    assert.ok(tests.required, 'Required Found');
    assert.strictEqual(tests.min, '1', 'Min Found');
    assert.strictEqual(tests.max, '100', 'Max Found');
    assert.strictEqual(tests.step, '2', 'Step Found');
    assert.strictEqual(tests.pattern, 'blah', 'Pattern Found');

});

QUnit.test('Issue #400 - Write HTML5 Validation Attributes fails when anonymous rules are used', function(assert) {

    var vm = {
        testObj: ko.observable(15).extend({required: true}).extend({
            validation: [{
                validator: function(value, params) {
                    return parseInt(value, 10) === params;
                },
                message: function(params) {
                    return 'Value must be equal to ' + params;
                },
                params: 1
            }]
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
    var tests = {};

    ko.utils.arrayForEach(['required', 'min', 'max', 'step', 'pattern'], function(attr) {
        tests[attr] = $el.attr(attr);
    });

    assert.ok(tests.required, 'Required Found');
    assert.observableIsNotValid(vm.testObj, 15, 'Value must be equal to 1');
});

QUnit.test('Issue #80 - HTML5 attributes - pattern', function(assert) {

    var pattern = /something/i;
    var patternString = 'something';

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

    assert.strictEqual(param, patternString, 'Patterns Match');
    assert.ok(vm.testObj.isValid(), 'Observable is valid');
    assert.ok(el.validity.valid, 'Element is showing it is valid');
    assert.strictEqual(vm.testObj(), 'something', 'Observable still works');
});


QUnit.module('HTML5 UI Tests', {
    afterEach: function() {
        var $element = $('#testContainer');
        ko.cleanNode($element[0]);
        $element.empty();
        ko.validation.reset();
    }
});

QUnit.test('HTML5 Input types', function(assert) {
    var done = assert.async();
    assert.expect(3);

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
    ko.validation.init({parseInputAttributes: true}, true);

    applyTestBindings(vm);

    // The validators for the HTML5 Input types are applied asynchronously,
    // so we need to wait until the validators have been applied.  This is
    // done by checking to make sure that the rule has been added to the rules
    // list of each observable.
    var intervalsWaited = 0;
    var intervalId = setInterval(function() {
        if (intervalsWaited++ > 1000) {
            clearInterval(intervalId);
            assert.ok(false, 'Async HTML5 Input validators did not apply within a reasonable amount of time');
        }
        var validatorsReady =
            vm.invalidEmail.rules().length > 0 &&
            vm.invalidDate.rules().length > 0 &&
            vm.invalidNumber.rules().length > 0;

        if (validatorsReady) {
            clearInterval(intervalId);
            assert.ok(!vm.invalidEmail.isValid(), 'Expected email to be considered as invalid.');
            assert.ok(!vm.invalidDate.isValid(), 'Expected date to be considered as invalid.');
            assert.ok(!vm.invalidNumber.isValid(), 'Expected date to be considered as invalid.');

            done();
        }
    }, 1);
});

QUnit.test('min Attribute of 20 should fail for value of 8', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber(8); // should fail the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 20.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 20 should fail for value of "8"', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" min="20" data-bind="value: someNumber, validationElement: someNumber" />');
    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('8'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), "Object is not valid");
        assert.equal(vm.someNumber.error(), "Please enter a value greater than or equal to 20.",
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 20 should fail for value of "8" with text type', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" min="20" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('8'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 20.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 20 should pass for value of 110', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber(110); // should validate the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('min Attribute of 20 should pass for value of "110"', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" min="20" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('110'); // should validate the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('max Attribute of 30 should fail for value of 100', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber(100); // should fail the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value less than or equal to 30.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('max Attribute of 30 should fail for value of "100"', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" max="30" data-bind="value: someNumber, validationElement: someNumber" />');
    ko.validation.init({
        parseInputAttributes: true
    }, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('100'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value less than or equal to 30.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('max Attribute of 30 should fail for value of "100" with text type', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="text" max="30" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber(100); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value less than or equal to 30.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('max Attribute of 30 should pass for value of 5', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value:someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber(5); // should validate the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('max Attribute of 30 should pass for value of "5"', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="number" max="30" data-bind="value:someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('5'); // should validate the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('max Attribute of 2010-09 should fail for value of 2011-03', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" max="2010-09" data-bind="value:someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2011-03'); // should fail the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');

        done();
    }, 1);
});

QUnit.test('max Attribute of 2010-09 should succeed for value of 2010-08', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" max="2010-09" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2010-08'); // should succeed the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2010-09 should fail for value of 2010-08', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2010-09" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2010-08'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 2010-09.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2012-05 should fail for value of 2011-01', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2012-05" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2011-01'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 2012-05.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2012-03 should succeed for value of 2013-01', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="month" min="2012-03" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2013-01'); // should succeed the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('max Attribute of 2010-W09 should fail for value of 2011-W03', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" max="2010-W09" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2011-W03'); // should fail the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is not valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value less than or equal to 2010-W09.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('max Attribute of 2010-W09 should succeed for value of 2010-W08', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" max="2010-W09" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2010-W08'); // should succeed the max rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2010-W09 should fail for value of 2010-W08', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="Week" min="2010-W09" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2010-W08'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 2010-W09.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2012-W05 should fail for value of 2011-W01', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" min="2012-W05" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2011-W01'); // should fail the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(!vm.someNumber.isValid(), 'Object is valid');
        assert.equal(vm.someNumber.error(), 'Please enter a value greater than or equal to 2012-W05.',
            'Message needs to be formatted correctly');

        done();
    }, 1);
});

QUnit.test('min Attribute of 2012-W03 should succeed for value of 2013-W01', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var vm = {
        someNumber: ko.validatedObservable()
    };

    addTestHtml('<input id="myTestInput" type="week" min="2012-W03" data-bind="value: someNumber, validationElement: someNumber" />');

    ko.validation.init({parseInputAttributes: true}, true);
    applyTestBindings(vm);

    setTimeout(function() {
        vm.someNumber('2013-W01'); // should succeed the min rule

        var el = $('#myTestInput');

        assert.ok(el, 'found element');
        assert.ok(vm.someNumber.isValid(), 'Object is valid');

        done();
    }, 1);
});

//#endregion

