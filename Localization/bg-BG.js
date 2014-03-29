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
    required: 'Моля, въведете стойност.',
    min: 'Моля, въведете стойност по-голяма или равна на {0}.',
    max: 'Моля, въведете стойност по-малка или равна на {0}.',
    minLength: 'Моля, въведете поне {0} символа.',
    maxLength: 'Моля, въведете по-малко от {0} символа.',
    pattern: 'Моля, проверете тази стойност.',
    step: 'Стойността трябва да се увеличава с {0}.',
    email: 'Това не е валиден e-mail адрес.',
    date: 'Моля, въведете валидна дата.',
    dateISO: 'Моля, въведете валидна дата.',
    number: 'Моля, въведете число.',
    digit: 'Моля, въведете цифра.',
    phoneUS: 'Моля, въведете валиден телефонен номер.',
    equal: 'Стойностите трябва да са равни.',
    notEqual: 'Моля, изберете различна стойност.',
    unique: 'Моля, убедете се, че стойността е уникална.'
});