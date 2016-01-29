/**
 * Localization file for Slovakia - Slovakian (sk-SK)
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
	return kv.defineLocale('sk-SK', {
        required: 'Tento údaj je povinný.', 
        min: 'Zadajte hodnotu vyššiu alebo rovnú {0}.', 
        max: 'Zadajte hodnotu nižšiu alebo rovnú {0}.',
        minLength: 'Zadajte najmenej {0} znakov.',
        maxLength: 'Zadajte najviac {0} znakov.',
        pattern: 'Skontrolujte túto hodnotu.',
        step: 'Hodnota sa musí zvýšiť o {0}.',
        email: 'Zadajte správnu emailovú adresu.',
        date: 'Zadajte správny dátum.',
        dateISO: 'Zadajte správny dátum.',
        number: 'Zadajte číslo.',
        digit: 'Zadajte číslicu.',
        phoneUS: 'Uveďte platné telefónne číslo.',
        equal: 'Hodnoty musia byť rovnaké.',
        notEqual: 'Zvoľte inú hodnotu.',
        unique: 'Uistite sa, že hodnota je jedinečná.'
	});
}));
