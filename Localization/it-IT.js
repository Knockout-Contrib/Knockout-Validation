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
		required: 'Il campo è obbligatorio.',
		min: 'Inserire un valore superiore od uguale a {0}.',
		max: 'Inserire un valore inferiore od uguale a {0}.',
		minLength: 'Inserire almeno {0} caratteri.',
		maxLength: 'Inserire al massimo {0} caratteri.',
		pattern: 'Controllare il valore inserito.',
		step: 'Il valore deve essere incrementato di {0}.',
		email: 'Indirizzo email non valido.',
		date: 'Inserire una data valida.',
		dateISO: 'Inserire una data valida.',
		number: 'Inserire un valore numerico.',
		digit: 'Inserire una cifra.',
		phoneUS: 'Specificare un numero di telefono valido.',
		equal: 'I valori devono essere uguali.',
		notEqual: 'Il valore deve essere differente.',
		unique: 'Il valore deve essere univoco.'
	});
}));
