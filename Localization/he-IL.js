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
		required: 'שדה נדרש',
		min: 'אנא הכנס ערך גדול יותר או שווה ל- {0}',
		max: 'אנא הכנס ערך קטן יותר או שווה ל- {0}',
		minLength: 'אנא הכנס לפחות {0} תווים',
		maxLength: 'אנא הכנס לא יותר מאשר {0} תווים',
		pattern: 'אנא בדוק את הערך הזה',
		step: 'הערך צריך להשתנות ב - {0}',
		email: 'אנא הכנס כתובת דוא"ל חוקית',
		date: 'אנא הכנס תאריך תקין',
		dateISO: 'אנא הכנס תאריך תקין',
		number: 'אנא הכנס מספר',
		digit: 'אנא הכנס ספרה',
		phoneUS: 'אנא הכנס מספר טלפון תקין',
		equal: 'ערכים חייבים להיות שווים',
		notEqual: 'אנא בחר ערך שונה',
		unique: 'אנא וודא שהערך ייחודי'
	});
}));
