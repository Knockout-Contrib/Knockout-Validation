/// <reference path="../Src/knockout.validation.js" />
/************************************************
* This is an example localization page. All of these
* messages are the default messages for ko.validation
*
* Currently ko.validation only does a single parameter replacement
* on your message (indicated by the {0}).
*
* The parameter that you provide in your validation extender
* is what is passed to your message to do the {0} replacement.
*
* eg: myProperty.extend({ minLength: 5 });
* ... will provide a message of "Please enter at least 5 characters"
* when validated
*
* This message replacement obviously only works with primitives
* such as numbers and strings. We do not stringify complex objects
* or anything like that currently.
*/
ko.validation.localize({
	required: 'Bu alanın doldurulması zorunludur.',
	min: 'Lütfen {0} veya daha yüksek değer giriniz.',
	max: 'Lütfen {0} veya daha düşük değer giriniz.',
	minLength: 'Lütfen en az {0} karakter giriniz.',
	maxLength: 'Lütfen en fazla {0} karakter giriniz.',
	pattern: 'Lütfen bu alanı kontrol ediniz.',
	step: 'Değer {0} arttırılmalı.',
	email: 'Bu geçerli bir E-Mail adresi değil.',
	date: 'Lütfen geçerli bir tarih giriniz.',
	dateISO: 'Lütfen geçerli bir tarih giriniz.',
	number: 'Lütfen bir sayı değeri giriniz.',
	digit: 'Lütfen bir rakam değeri giriniz.',
	phoneUS: 'Lütfen geçerli bir telefon numarası giriniz.',
	equal: 'Değerler eşit olmalıdır.',
	notEqual: 'Lütfen farklı bir değer seçiniz.',
	unique: 'Lütfen değerin farklı olduğunu kontrol ediniz.'
});
