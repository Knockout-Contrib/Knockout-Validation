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
		required: 'Ce champ est obligatoire.',
		min: 'Veuillez saisir une valeur supérieure ou égale à {0}.',
		max: 'Veuillez saisir une valeur inférieure ou égale à {0}.',
		minLength: 'Veuillez saisir au moins {0} caractères.',
		maxLength: 'Veuillez saisir au plus {0} caractères.',
		pattern: 'Veuillez corriger ce champ.',
		step: 'Le pas d\'incrémentation de la valeur doit être de {0}.',
		email: 'Ceci n\'est pas une adresse électronique valide.',
		date: 'Veuillez saisir une date valide.',
		dateISO: 'Veuillez saisir une date (ISO) valide.',
		number: 'Veuillez saisir un nombre.',
		digit: 'Veuillez saisir un chiffre.',
		phoneUS: 'Veuillez saisir un numéro de téléphone valide.',
		equal: 'Les valeurs doivent être égales.',
		notEqual: 'Veuillez saisir une autre valeur.',
		unique: 'Veuillez vérifier que la valeur est unique.'
	  });
	}
	local();
	return local;
}));
