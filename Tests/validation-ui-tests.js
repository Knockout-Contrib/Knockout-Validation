/// <reference path="jquery-1.7.1.js" />
/// <reference path="../Lib/knockout-latest.debug.js" />
/// <reference path="../Src/knockout.validation.js" />
/// <reference path="Qunit/qunit.js" />

module('UI Tests', {
    setup: function () {

    },
    teardown: function () {
        ko.cleanNode($('#testContainer')[0]);
        $('#testContainer').empty();
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

    equals(msg, 'This field is required.', msg);
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

    equals(noMsgs, 0, 'No Messages were inserted');

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

    equals(noMsgs, 0, 'No Messages were inserted');

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

    equals(noMsgs, 0, 'No Messages were inserted');

    var $firstName = $('#myFirstName');
    $firstName.val(""); //set it 
    $firstName.change(); //trigger change event

    ok(!vm.firstName.isValid(), 'Validation Still works correctly');

    var insertMsgCt = $firstName.siblings('span').length;
    equals(insertMsgCt, 1, 'Should have inserted 1 message beside the first name!');

});
//#endregion