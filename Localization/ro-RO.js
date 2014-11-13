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
    required: 'Acest câmp este obligatoriu.',
    min: 'Introduceţi un număr mai mare sau egal cu {0}.',
    max: 'Introduceţi un număr mai mic sau egal cu {0}.',
    minLength: 'Introduceţi cel puţin {0} caractere.',
    maxLength: 'Introduceţi maxim {0} caractere.',
    pattern: 'Verificaţi această valoare.',
    step: 'Valoarea trebuie să crească cu {0}.',
    email: 'Adresa de email nu este validă.',
    date: 'Vă rugăm introduceţi o dată validă.',
    dateISO: 'Vă rugăm introduceţi o dată validă.',
    number: 'Introduceţi un număr.',
    digit: 'Introduceţi o cifră.',
    phoneUS: 'Vă rugăm să specificați un număr de telefon valid.',
    equal: 'Valorile trebuie să fie egale.',
    notEqual: 'Vă rugăm să alegeți o altă valoare.',
    unique: 'Vă rugăm să vă asigurați că valoarea este unică.'
});
