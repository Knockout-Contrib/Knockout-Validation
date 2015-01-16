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
		required: 'To pole jest wymagane.',
		min: 'Wprowadź liczbę więszką lub równą {0}.',
		max: 'Wprowadź liczbę mniejszą lub równą {0}.',
		minLength: 'Wprowadź co najmniej {0} znaków.',
		maxLength: 'Wprowadź co najwyżej {0} znaków.',
		pattern: 'Sprawdź to pole.',
		step: 'Wartość musi być wielokrotnością {0}.',
		email: 'Wprowadź poprawny adres e-mail.',
		date: 'Wprowadź poprawną datę.',
		dateISO: 'Wprowadź poprawną datę.',
		number: 'Wprowadź liczbę.',
		digit: 'Wprowadź cyfrę.',
		phoneUS: 'Wprowadź poprawny numer telefonu.',
		equal: 'Wartości muszą być równe.',
		notEqual: 'Wybierz inną wartość.',
		unique: 'Sprawdź czy wartość jest unikalna.'
	  });
	}
	local();
	return local;
}));
