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
		required: 'Το πεδίο αυτό είναι υποχρεωτικό.',
		min: 'Παρακαλώ εισάγετε μια τιμή μεγαλύτερη ή ίση από {0}.',
		max: 'Παρακαλώ εισάγετε μια τιμή μικρότερη ή ίση από {0}.',
		minLength: 'Παρακαλώ εισάγετε τουλάχιστον {0} χαρακτήρες.',
		maxLength: 'Παρακαλώ εισάγετε το πολύ {0} χαρακτήρες.',
		pattern: 'Παρακαλώ ελέγξτε την τιμή αυτή.',
		step: 'Η τιμή πρέπει να αυξηθεί κατά {0}',
		email: 'Η διεύθυνση email δεν έχει έγκυρη μορφή',
		date: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
		dateISO: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
		number: 'Παρακαλώ εισάγετε έναν αριθμό',
		digit: 'Παρακαλώ εισάγετε ένα ψηφίο',
		phoneUS: 'Παρακαλώ εισάγετε έναν σωστό αριθμό τηλεφώνου',
		equal: 'Οι τιμές πρέπει να είναι ίσες',
		notEqual: 'Παρακαλώ επιλέξτε μια άλλη τιμή.',
		unique: 'Παρακαλώ βεβαιωθείτε ότι η τιμή είναι μοναδική.'
	});
}));
