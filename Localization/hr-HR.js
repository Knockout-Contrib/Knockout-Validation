/************************************************
* This is an example localization page. All of these
* messages are the default messages for ko.validation
*
* Currently ko.validation does multiple parameter replacement
* on your message (indicated by the {0}, {1}, etc.).
*
* The parameters that you provide in your validation extender
* are what are passed to your message to do the {0}, {1} etc. replacements.
*
* eg: myProperty.extend({ minLength: 5 });
* ... will provide a message of "Please enter at least 5 characters"
* when validated
*
* eg: myProperty.extend({ between: [1, 5] });
* ... will provide a message of "Please enter between 1 and 5 characters"
* when validated
*
* This message replacement obviously only works with primitives
* such as numbers and strings. We do not stringify complex objects
* or anything like that currently.
*/
(function(factory) {
	// Module systems magic dance.
	/*global require,ko,define*/
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory(require("knockout"));
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `mapping` property
		factory(ko);
	}
}(function(ko) {
	if (!ko.validation && typeof ko.validation.localize !== 'function') {
		throw new Error('Knockout-Validation is required, please ensure it is loaded before this localization file');
	}
	ko.validation.localize({
		required: 'Ovo polje je obavezno.',
		min: 'Unesena vrijednost mora biti jednaka ili veća od {0}.',
		max: 'Unesena vrijednost mora biti jednaka ili manja od {0}.',
		minLength: 'Minimalna dužina polja je {0} znakova.',
		maxLength: 'Maksimalna dužina polja je {0} znakova.',
		pattern: 'Unesena vrijednost nije ispravnog formata.',
		step: 'Vrijednost se mora povećavati za {0}.',
		email: 'Potrebno je unijeti ispravnu e-mail adresu.',
		date: 'Potrebno je unijeti ispravan datum.',
		dateISO: 'Potrebno je unijeti ispravan datum.',
		number: 'Unesena vrijednost mora biti broj.',
		digit: 'Unesena vrijednost mora biti znamenka.',
		phoneUS: 'Potrebno je unijeti ispravan broj telefona.',
		equal: 'Vrijednosti moraju biti jednake.',
		notEqual: 'Unesite drugu vrijednost.',
		unique: 'Unesena vrijednost mora biti jedinstvena.'
	});
}));
