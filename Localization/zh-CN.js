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
		required: '必填字段',
		min: '输入值必须大于等于 {0}',
		max: '输入值必须小于等于 {0}',
		minLength: '至少输入 {0} 个字符',
		maxLength: '输入的字符数不能超过 {0} 个',
		pattern: '请检查此值',
		step: '每次步进值是 {0}',
		email: 'email地址格式不正确',
		date: '日期格式不正确',
		dateISO: '日期格式不正确',
		number: '请输入一个数字',
		digit: '请输入一个数字',
		phoneUS: '请输入一个合法的手机号(US)',
		equal: '输入值不一样',
		notEqual: '请选择另一个值',
		unique: '此值应该是唯一的'
	});
}));
