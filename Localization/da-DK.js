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
		required: 'Dette felt er påkrævet.',
		min: 'Angiv en værdi der mindst er {0}.',
		max: 'Angiv en værdi der højst er {0}.',
		minLength: 'Indtast mindst {0} tegn.',
		maxLength: 'Indtast højst {0} tegn.',
		pattern: 'Tjek venligst denne værdi.',
		step: 'Værdien skal stige med {0}',
		email: 'Dette er ikke en gyldig e-mail-adresse',
		date: 'Indtast en gyldig dato',
		dateISO: 'Indtast en gyldig dato',
		number: 'Indtast et tal',
		digit: 'Indtast et ciffer',
		phoneUS: 'Indtast et gyldigt telefonnummer',
		equal: 'Indtast den samme værdi igen.',
		notEqual: 'Indtast en anden værdi.',
		unique: 'Sørg for at værdien er unik.'
	  });
	}
	local();
	return local;
}));
