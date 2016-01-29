/**
 * Localization file for Finnish - Finland (fi-FI)
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
	return kv.defineLocale('fi-FI', {
        required: 'Täytä tämä tämä kenttä.', 
        min: 'Anna arvo joka on suurempi tai sama kuin {0}.',
        max: 'Anna arvo joka on pienempi tai sama kuin {0}.',
        minLength: 'Anna vähintään {0} merkkiä.',
        maxLength: 'Anna enemmän kuin {0} merkkiä.',
        pattern: 'Tarkista arvo.',
        step: 'Anna arvo joka kasvaa {0}:lla.',
        email: 'Anna toimiva sähköpostiosoite.',
        date: 'Anna kelvollinen päivämäärä.',
        dateISO: 'Anna kelvollinen päivämäärä.',
        number: 'Anna numero.',
        digit: 'Anna luku.',
        phoneUS: 'Anna voimassa oleva puhelinnumero.',
        equal: 'Anna samat arvot.',
        notEqual: 'Anna toinen arvo.',
        unique: 'Arvo käytössä, anna toinen arvo.'
	});
}));
