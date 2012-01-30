/// <reference path="jquery-1.7.1.js" />
/// <reference path="../Lib/knockout-latest.debug.js" />
/// <reference path="../Src/knockout.validation.js" />
/// <reference path="Qunit/qunit.js" />

module('UI Tests');

test('Error Grouping works', function () {

    var errorCount = $('#errorCount').text();

    equals(errorCount, '6', 'Correct Error Count');
});

test('Inserting Messages Works', function () {
    var $firstName = $('#firstNameTxt');

    $firstName.val('a'); //has a minLength of 2
    $firstName.change(); //trigger change event

    var isValid = window.viewModel.firstName.isValid();

    ok(!isValid, 'First Name is NOT Valid');

    var msg = $firstName.siblings().first().text();

    equals(msg, 'Please enter at least 2 characters.', msg);
});