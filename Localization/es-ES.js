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
		required: 'Este campo es obligatorio',
		min: 'Por favor, introduzca un valor igual o mayor a {0}',
		max: 'Por favor, introduzca un valor menor o igual a {0}',
		minLength: 'Por favor, introduzca al menos {0} caracteres',
		maxLength: 'Por favor, no introduzca más de {0} caracteres',
		pattern: 'Por favor, compruebe este campo',
		step: 'El valor debe incrementarse por {0}',
		email: 'Este no es una dirección de email correcta',
		date: 'Por favor, introduzca una fecha correcta',
		dateISO: 'Por favor, introduzca una fecha correcta',
		number: 'Por favor, introduzca un número',
		digit: 'Por favor, introduzca un dígito',
		phoneUS: 'Por favor, introduzca un número de teléfono válido para EEUU',
		equal: 'Los valores deben ser iguales',
		notEqual: 'Por favor, elija otro valor',
		unique: 'Por favor, asegurese de que el valor sea único'
	});
}));
