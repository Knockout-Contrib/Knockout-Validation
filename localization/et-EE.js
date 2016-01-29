/**
 * Localization file for Estonian - Estonia (et-EE)
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
	return kv.defineLocale('et-EE', {
		required: 'See väli on kohustuslik.',
		min: 'Palun sisesta sõna, mis on võrdne või suurem kui {0}.',
		max: 'Palun sisesta sõna, mis on võrdne või väiksem kui {0}.',
		minLength: 'Palun sisesta vähemalt {0} tähemärki.',
		maxLength: 'Palun ära sisesta rohkem kui {0} tähemärki.',
		pattern: 'Palun kontrolli seda välja.',
		step: 'Pikkus peab suurenema {0} võrra.',
		email: 'Palun sisesta korrektne meiliaadress.',
		date: 'Palun sisesta korrektne kuupäev.',
		dateISO: 'Palun sisesta korrektne kuupäev.',
		number: 'Palun sisesta number.',
		digit: 'Palun sisesta number.',
		phoneUS: 'Palun sisesta kehtiv telefoninumber.',
		equal: 'Sisestatud väljad peavad kattuma.',
		notEqual: 'Palun vali muu sõna.',
		unique: 'Palun veendu, et sisestatud tekst oleks unikaalne.'
	});
}));
