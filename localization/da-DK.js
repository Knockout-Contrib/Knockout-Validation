/**
 * Localization file for Danish - Denmark (da-DK)
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
	return kv.defineLocale('da-DK', {
		required: 'Dette felt er påkrævet.',
		min: 'Angiv en værdi der mindst er {0}.',
		max: 'Angiv en værdi der højst er {0}.',
		minLength: 'Indtast mindst {0} tegn.',
		maxLength: 'Indtast højst {0} tegn.',
		pattern: 'Tjek venligst denne værdi.',
		step: 'Værdien skal stige med {0}',
		email: 'Dette er ikke en gyldig e-mail-adresse',
		date: 'Indtast en gyldig dato',
		dateISO: 'Indtast en gyldig dato',
		number: 'Indtast et tal',
		digit: 'Indtast et ciffer',
		phoneUS: 'Indtast et gyldigt telefonnummer',
		equal: 'Indtast den samme værdi igen.',
		notEqual: 'Indtast en anden værdi.',
		unique: 'Sørg for at værdien er unik.'
	});
}));
