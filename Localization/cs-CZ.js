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
		required: 'Toto pole je povinné.',
		min: 'Zadejte číslo větší nebo rovné {0}.',
		max: 'Zadejte číslo menší nebo rovné {0}.',
		minLength: 'Vložte alespoň {0} znaků.',
		maxLength: 'Vložte nejvíce {0} znaků.',
		pattern: 'Zkontrolujte formát pole.',
		step: 'Hodnota musí být násobek {0}.',
		email: 'Neplatná e-mailová adresa.',
		date: 'Zadejte platné datum.',
		dateISO: 'Zadejte platné datum.',
		number: 'Zadejte číslo.',
		digit: 'Zadejte číslice.',
		phoneUS: 'Zadejte platné telefonní číslo.',
		equal: 'Hodnoty musí být stejné.',
		notEqual: 'Vyberte jinou hodnotu.',
		unique: 'Zkontrolujte, zda hodnota je jedinečná.'
	  });
	}
	local();
	return local;
}));
