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
		required: 'Aquest camp es obligatori',
		min: 'Introduir un valor igual o major que {0}',
		max: 'Introduir un valor menor o igual que {0}',
		minLength: 'Ha de tenir un mínim de {0} caràcters',
		maxLength: 'No pot tenir mes de {0} caràcters',
		pattern: 'Si us plau, comproveu aquest campo',
		step: "El valor ha d'incrementar-se en {0}",
		email: 'Aquesta no es una adreça de correu electrònic correcta',
		date: 'Introduir una data correcta',
		dateISO: 'Introduir una data correcta',
		number: 'Ha de ser un nombre',
		digit: 'Introduir un dígit',
		phoneUS: 'Ha de ser un número de telèfon vàlid',
		equal: 'Els valors han de ser iguals',
		notEqual: 'Elegiu un altre valor',
		unique: 'Ha de ser un valor únic'
	});
}));
