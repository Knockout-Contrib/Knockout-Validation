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
/**
 * Localization file for Thai - Thai (th-TH)
 */
(function(factory) {
	// Module systems magic dance.
	/*global require,ko.validation,define,module*/
	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
		// CommonJS or Node
        module.exports = factory(require('../'));
	} else if (typeof define === 'function' && define['amd']) {
		// AMD anonymous module
		define(['knockout.validation'], factory);
	} else {
		// <script> tag: use the global `ko.validation` object
		factory(ko.validation);
	}
}(function(kv) {
	if (!kv || typeof kv.defineLocale !== 'function') {
		throw new Error('Knockout-Validation is required, please ensure it is loaded before this localization file');
	}
	return kv.defineLocale('en-US', {
		required: 'จำเป็นต้องกรอกค่าในช่องนี้',
		min: 'กรุณากรอกค่าที่มีค่ามากกว่าหรือเท่ากับ {0}',
		max: 'กรุณากรอกค่าที่มีค่าน้อยกว่าหรือเท่ากับ {0}',
		minLength: 'ความยาวของข้อความต้องไม่น้อยกว่า {0} ตัวอักษร',
		maxLength: 'ความยาวของข้อความต้องไม่เกิน {0} ตัวอักษร',
		pattern: 'รูปแบบข้อความไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
		step: 'ค่าต้องเพิ่มขึ้นทีละ {0}',
		email: 'กรุณากรอกอีเมลให้ถูกต้อง',
		date: 'กรุณากรอกวันที่ให้ถูกต้อง',
		dateISO: 'กรุณากรอกวันที่ให้ถูกต้อง.',
		number: 'กรุณากรอกตัวเลข',
		digit: 'กรุณากรอกตัวเลข',
		phoneUS: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
		equal: 'ต้องมีค่าเท่ากัน',
		notEqual: 'ต้องมีค่าต้องไม่เท่ากัน',
		unique: 'ต้องไม่ซ้ำกับค่าอื่นๆ'
	});
}));
