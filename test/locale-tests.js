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
        ko.validation.locale('xyz');
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

QUnit.test('Localization files can be loaded and applied', function(assert) {
    // Simple check to ensure localization files can be loaded with script tag
    assert.equal(ko.validation.locale('ar-JO'), 'ar-jo', 'Arabic - Jordan (ar-JO)');
    assert.equal(ko.validation.locale('bg-BG'), 'bg-bg', 'Bulgarian - Bulgaria (bg-BG)');
    assert.equal(ko.validation.locale('ca-ES'), 'ca-es', 'Catalan - Catalan (ca-ES)');
    assert.equal(ko.validation.locale('cs-CZ'), 'cs-cz', 'Czech - Czech Republic (cs-CZ)');
    assert.equal(ko.validation.locale('da-DK'), 'da-dk', 'Danish - Denmark (da-DK)');
    assert.equal(ko.validation.locale('de-DE'), 'de-de', 'German - Germany (de-DE)');
    assert.equal(ko.validation.locale('el-GR'), 'el-gr', 'Greek - Greece (el-GR)');
    assert.equal(ko.validation.locale('en-US'), 'en-us', 'English - United States (en-US)');
    assert.equal(ko.validation.locale('es-ES'), 'es-es', 'Spanish - Spain (es-ES)');
    assert.equal(ko.validation.locale('fa-IR'), 'fa-ir', 'Farsi - Iran (fa-IR)');
    assert.equal(ko.validation.locale('fr-FR'), 'fr-fr', 'French - France (fr-FR)');
    assert.equal(ko.validation.locale('he-IL'), 'he-il', 'Hebrew - Israel (he-IL)');
    assert.equal(ko.validation.locale('hr-HR'), 'hr-hr', 'Croatian - Croatia (hr-HR)');
    assert.equal(ko.validation.locale('hu-HU'), 'hu-hu', 'Hungarian - Hungary (hu-HU)');
    assert.equal(ko.validation.locale('it-IT'), 'it-it', 'Italian - Italy (it-IT)');
    assert.equal(ko.validation.locale('ja-JP'), 'ja-jp', 'Japanese - Japan (ja-JP)');
    assert.equal(ko.validation.locale('ko-KR'), 'ko-kr', 'Korean - Korea (ko-KR)');
    assert.equal(ko.validation.locale('lv-LV'), 'lv-lv', 'Latvian - Latvia (lv-LV)');
    assert.equal(ko.validation.locale('nb-NO'), 'nb-no', 'Norwegian (Bokmål) - Norway (nb-NO)');
    assert.equal(ko.validation.locale('nl-BE'), 'nl-be', 'Dutch - Belgium (nl-BE)');
    assert.equal(ko.validation.locale('nl-NL'), 'nl-nl', 'Dutch - The Netherlands (nl-NL)');
    assert.equal(ko.validation.locale('pl-PL'), 'pl-pl', 'Polish - Poland (pl-PL)');
    assert.equal(ko.validation.locale('pt-BR'), 'pt-br', 'Portuguese - Brazil (pt-BR)');
    assert.equal(ko.validation.locale('pt-PT'), 'pt-pt', 'Portuguese - Portugal (pt-PT)');
    assert.equal(ko.validation.locale('ro-RO'), 'ro-ro', 'Romanian - Romania (ro-RO)');
    assert.equal(ko.validation.locale('ru-RU'), 'ru-ru', 'Russian - Russia (ru-RU)');
    assert.equal(ko.validation.locale('sv-SE'), 'sv-se', 'Swedish - Sweden (sv-SE)');
    assert.equal(ko.validation.locale('tr-TR'), 'tr-tr', 'Turkish - Turkey (tr-TR)');
    assert.equal(ko.validation.locale('zh-CN'), 'zh-cn', 'Chinese - China (zh-CN)');
    assert.equal(ko.validation.locale('zh-TW'), 'zh-tw', 'Chinese - Taiwan (zh-TW)');
});
