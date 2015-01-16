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
	function local(){
	  ko.validation.localize({
		required: 'Kötelezõ megadni.',
		min: 'Nem lehet kisebb, mint {0}.',
		max: 'Nem lehet nagyobb, mint {0}.',
		minLength: 'Legalább {0} karaktert adjon meg.',
		maxLength: 'Legfeljebb {0} karaktert adjon meg.',
		pattern: 'Kérem ellenõrizze ezt az értéket.',
		step: 'Az értéknek {0} értékkel kell növekednie.',
		email: 'A megadott email cím nem érvényes.',
		date: 'A megadott dátum nem érvényes.',
		dateISO: 'A megadott dátum nem érvényes.',
		number: 'Kérem számot adjon meg.',
		digit: 'Kérem számjegyet adjon meg.',
		phoneUS: 'Kérem, hogy érvényes telefonszámot adjon meg.',
		equal: 'Az értékeknek meg kel egyezniük.',
		notEqual: 'Az értékeknek különbözniük kell.',
		unique: 'Az értéknek egyedieknek kell lennie.'
	  });
	}
	local();
	return local;
}));
