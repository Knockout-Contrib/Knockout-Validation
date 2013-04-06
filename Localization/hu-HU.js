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
    required: 'Kötelezõ megadni.',
    min: 'Nem lehet kisebb, mint {0}.',
    max: 'Nem lehet nagyobb, mint {0}.',
    minLength: 'Legalább {0} karaktert adjon meg.',
    maxLength: 'Legfeljebb {0} karaktert adjon meg.',
    pattern: 'Kérem ellenõrizze ezt az értéket.',
    step: 'Az értéknek {0} értékkel kell növekednie.',
    email: 'A megadott email cím nem érvényes.',
    date: 'A megadott dátum nem érvényes.',
    dateISO: 'A megadott dátum nem érvényes.',
    number: 'Kérem számot adjon meg.',
    digit: 'Kérem számjegyet adjon meg.',
    phoneUS: 'Kérem, hogy érvényes telefonszámot adjon meg.',
    equal: 'Az értékeknek meg kel egyezniük.',
    notEqual: 'Az értékeknek különbözniük kell.',
    unique: 'Az értéknek egyedieknek kell lennie.'
});