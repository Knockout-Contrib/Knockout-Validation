/**
 * Localization file for Ukrainian - Ukraine (ua-UK)
 */
(function(factory) {
	// Module systems magic dance.
	/*global require,ko.validation,define,module*/
	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
		// CommonJS or Node
        module.exports = factory(require('../'));
	} else if (typeof define === 'function' && define['amd']) {
		// AMD anonymous module
		define(['knockout.validation'], factory);
	} else {
		// <script> tag: use the global `ko.validation` object
		factory(ko.validation);
	}
}(function(kv) {
	if (!kv || typeof kv.defineLocale !== 'function') {
		throw new Error('Knockout-Validation is required, please ensure it is loaded before this localization file');
	}
	return kv.defineLocale('uk-UA', {
	    required: 'Будь ласка, заповніть це поле.',
	    min: 'Будь ласка, введіть число більше або рівне {0}.',
	    max: 'Будь ласка, введіть число менше або рівне {0}.',
	    minLength: 'Будь ласка, введіть принаймні {0} символів.',
	    maxLength: 'Будь ласка, введіть не більше як {0} символів.',
	    pattern: 'Будь ласка, перевірте це поле.',
	    step: 'Значення має бути кратним {0}',
	    email: 'Будь ласка, вкажіть тут правильну адресу електронної пошти',
	    date: 'Будь ласка, введіть правильну',
	    dateISO: 'Будь ласка, введіть правильну дату у форматі ISO',
	    number: 'Будь ласка, введіть число',
	    digit: 'Будь ласка, введіть цифри',
	    phoneUS: 'Будь ласка, вкажіть правильний телефонний номер',
	    equal: 'Значення повинні бути рівні',
	    notEqual: 'Будь ласка, виберіть інше значення.',
	    unique: 'Будь ласка, вкажіть унікальне значення.'
	});
}));
