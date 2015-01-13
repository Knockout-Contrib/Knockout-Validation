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
		required: 'Detta fält är obligatoriskt',
		min: 'Fyll i ett värde som är större än eller lika med {0}',
		max: 'Fyll i ett värde som är mindre än eller lika med {0}',
		minLength: 'Fyll i minst {0} tecken',
		maxLength: 'Fyll i färre än {0} tecken',
		pattern: 'Var god kontrollera värdet',
		step: 'Värdet måste ökas med {0}',
		email: 'Fyll i en korrekt e-postadress',
		date: 'Fyll i ett korrekt datum',
		dateISO: 'Fyll i ett korrekt datum',
		number: 'Fyll i ett nummer',
		digit: 'Fyll i en siffra',
		phoneUS: 'Fyll i ett korrekt telefonnummer',
		equal: 'Fyll i samma värde en gång till',
		notEqual: 'Fyll i ett annat värde',
		unique: 'Fyll i ett unikt värde'
	});
}));
