/**
 * Localization file for Chinese - China (zh-CN)
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
	return kv.defineLocale('zh-CN', {
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
