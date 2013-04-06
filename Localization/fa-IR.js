/// <reference path="../Src/knockout.validation.js" />

/************************************************
* This is an example localization page. All of these
* messages are the default messages for ko.validation
* Localization By: Kiarash Soleimanzadeh(kiarash.s@hotmail.com)
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
