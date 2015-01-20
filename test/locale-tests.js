/*global QUnit:false*/

QUnit.module('Localization Tests', {
    afterEach: function() {
        ko.validation.locale('en-US');
    }
});

QUnit.test('Default locale should be en-us', function(assert) {
    assert.equal(ko.validation.locale(), 'en-us');
});

QUnit.test('Locale identifiers should be case insensitive', function(assert) {
    assert.equal(ko.validation.locale('RO-RO'), 'ro-ro');
});

QUnit.test('Changing locale should change rules messages', function(assert) {
    ko.validation.locale('ro-RO');
    assert.equal(ko.validation.rules.required.message, 'Acest câmp este obligatoriu.');
});

QUnit.test('Reverting to default locale is possible', function(assert) {
    ko.validation.locale('ro-RO');
    assert.equal(ko.validation.locale(), 'ro-ro');
    assert.equal(ko.validation.rules.required.message, 'Acest câmp este obligatoriu.');

    ko.validation.locale('en-us');
    assert.equal(ko.validation.locale(), 'en-us');
    assert.equal(ko.validation.rules.required.message, 'This field is required.');
});

QUnit.test('Locale does not change when locale name is falsy', function(assert) {
    var currentLocale = ko.validation.locale();
    assert.equal(currentLocale, 'en-us');

    ko.validation.locale(null);
    assert.equal(currentLocale, 'en-us');

    ko.validation.locale(false);
    assert.equal(currentLocale, 'en-us');

    ko.validation.locale(undefined);
    assert.equal(currentLocale, 'en-us');

    ko.validation.locale('');
    assert.equal(currentLocale, 'en-us');
});

QUnit.test('Changing locale to a not loaded language throws', function(assert) {
    assert.throws(function() {
        ko.validation.locale('fr-FR');
    });
});

QUnit.test('Defining locales works', function(assert) {
    var result = ko.validation.defineLocale('de-DE', {
        required: 'Dieses Feld ist erforderlich.'
    });
    assert.equal(ko.validation.locale('de-DE'), 'de-de');
    assert.equal(ko.validation.rules.required.message, 'Dieses Feld ist erforderlich.');

    // Since the localization specified only required rule, the others should be left to their original values
    assert.equal(ko.validation.rules.email.message, 'Please enter a proper email address.');

    // defineLocale should return the values that were passed in
    assert.deepEqual(result, {required: 'Dieses Feld ist erforderlich.'});
});
