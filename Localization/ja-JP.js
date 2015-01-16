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
		required: 'このフィールドは必須入力項目です。',
		min: '{0}以上の値を入力してください。',
		max: '{0}以下の値を入力してください。',
		minLength: '{0}文字以上の文字を入力してください。',
		maxLength: '{0}文字以下の文字数にしてください。',
		pattern: '入力値を確認してください。',
		step: 'この値は{0}で増加します。',
		email:'適切なe-mailアドレスではありません。',
		date: '適切な日付を入力してください。',
		dateISO: '適切な日付を入力してください。',
		number: '数字を入力してください。',
		digit: '数値を入力してください。',
		phoneUS: '有効な電話番号を指定してください。',
		equal: '同一の値にしてください。',
		notEqual: '他の値を選択してください。',
		unique: '一意の値であることを確認してください。'
	  });
	}
	local();
	return local;
}));
