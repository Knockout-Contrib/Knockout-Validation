/// <reference path="../Src/knockout.validation.js" />

/************************************************
* Страница локализации плагина для русского языка
* сообщения в этом файле будут значениями по умолчанию для ko.validation
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
    required: 'Пожалуйста, заполните это поле.',
    min: 'Пожалуйста, введите число большее или равное {0}.',
    max: 'Пожалуйста, введите число меньшее или равное {0}.',
    minLength: 'Пожалуйста, введите по крайней мере {0} символов.',
    maxLength: 'Пожалуйста, введите не больше чем {0} символов.',
    pattern: 'Пожалуйста, проверьте это поле.',
    step: 'Значение должно быть кратным {0}',
    email: 'Пожалуйста, укажите здесь правильный адрес электронной почты',
    date: 'Пожалуйста, введите правильную дату',
    dateISO: 'Пожалуйста, введите правильную дату в формате ISO',
    number: 'Пожалуйста, введите число',
    digit: 'Пожалуйста, введите цифры',
    phoneUS: 'Пожалуйста, укажите правильный телефонный номер',
    equal: 'Значения должны быть равны',
    notEqual: 'Пожалуйста, выберите другое значение.',
    unique: 'Пожалуйста, укажите уникальное значение.'
});
