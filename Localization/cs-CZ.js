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
    required: 'Toto pole je povinné.',
    min: 'Zadejte číslo větší nebo rovné {0}.',
    max: 'Zadejte číslo menší nebo rovné {0}.',
    minLength: 'Vložte alespoň {0} znaků.',
    maxLength: 'Vložte nejvíce {0} znaků.',
    pattern: 'Zkontrolujte formát pole.',
    step: 'Hodnota musí být násobek {0}.',
    email: 'Neplatná e-mailová adresa.',
    date: 'Zadejte platné datum.',
    dateISO: 'Zadejte platné datum.',
    number: 'Zadejte číslo.',
    digit: 'Zadejte číslice.',
    phoneUS: 'Zadejte platné telefonní číslo.',
    equal: 'Hodnoty musí být stejné.',
    notEqual: 'Vyberte jinou hodnotu.',
    unique: 'Zkontrolujte, zda hodnota je jedinečná.'
});