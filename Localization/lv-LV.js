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
		required: 'Lauks ir obligāts.',
		min: 'Lūdzu, ievadiet vērtību lielāku vai vienādu ar {0}.',
		max: 'Lūdzu, ievadiet vērtību mazāku vai vienādu par {0}.',
		minLength: 'Lūdzu, ievadiet vismaz {0} simbolus.',
		maxLength: 'Lūdzu, ievadiet ne vairāk kā {0} simbolus.',
		pattern: 'Lūdzu, pārbaudiet norādītās vērtības formātu.',
		step: 'Norādītām vērtībām jābūt pieaugošām ar soli {0}',
		email: 'Norādītā e-pasta adrese neatbilst formātam',
		date: 'Lūdzu, norādiet atbilstošu datuma formātu.',
		dateISO: 'Lūdzu, norādiet atbilstošu datuma formātu.',
		number: 'Lūdzu, ievadiet numuru.',
		digit: 'Lūdzu, ievadiet ciparu.',
		phoneUS: 'Lūdzu, norādiet formātam atbilstošu telefona numuru.',
		equal: 'Norādītām vērtībām jābūt vienādām.',
		notEqual: 'Norādītās vērtības nav vienādas.',
		unique: 'Vērtībai jābūt unikālai.'
	});
}));
