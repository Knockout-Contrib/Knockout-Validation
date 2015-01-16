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
		required: 'تکمیل این فیلد اجباری است.',
		min: 'لطفاً مقداری بزرگتر یا برابر {0} وارد نمائید.',
		max: 'لطفاً مقداری کوچکتر یا برابر {0} وارد نمائید.',
		minLength: 'لطفاً حداقل {0} حرف وارد نمائید.',
		maxLength: 'لطفاً حداکثر {0} حرف وارد نمائید.',
		pattern: 'لطفاً یک مقدار معتبر وارد نمائید.',
		step: 'مقدار باید با {0} افزایش پبدا کند.',
		email: 'لطفاً یک آدرس ایمیل معتبر وارد نمائید.',
		date: 'لطفاً یک تاریخ معتبر وارد نمائید.',
		dateISO: 'لطفاً یک تاریخ معتبر وارد نمائید.',
		number: 'لطفاً یک عدد وارد نمائید.',
		digit: 'لطفاً یک عدد وارد نمائید.',
		phoneUS: 'لطفاً یک شماره تماس معتبر وارد نمائید.',
		equal: 'مقدارها باید برابر باشند.',
		notEqual: 'لطفاً یک مقدار دیگر وارد نمائید.',
		unique: 'لطفاً یک مقدار منحصربه فرد وارد نمائید.'
	  });
	}
	local();
	return local;
}));
