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
		required: 'Dit veld is verplicht.',
		min: 'Vul een waarde in groter dan of gelijk aan {0}.',
		max: 'Vul een waarde in kleiner dan of gelijk aan {0}.',
		minLength: 'Vul ten minste {0} tekens in.',
		maxLength: 'Vul ten hoogste {0} tekens in.',
		pattern: 'Vul een correcte waarde in.',
		step: 'Vul een waarde in die deelbaar is door {0}.',
		email: 'Vul een correct e-mailadres in.',
		date: 'Vul een correcte datum in.',
		dateISO: 'Vul een correcte datum in.',
		number: 'Vul een getal in.',
		digit: 'Vul een cijfer in.',
		phoneUS: 'Vul een geldig telefoonnummer in.',
		equal: 'Waarden moeten gelijk zijn.',
		notEqual: 'Vul een andere waarde in.',
		unique: 'Vul een unieke waarde in.'
	  });
	}
	local();
	return local;
}));
