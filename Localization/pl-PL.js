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
    required: 'To pole jest wymagane.',
    min: 'Wprowadź liczbę więszką lub równą {0}.',
    max: 'Wprowadź liczbę mniejszą lub równą {0}.',
    minLength: 'Wprowadź co najmniej {0} znaków.',
    maxLength: 'Wprowadź co najwyżej {0} znaków.',
    pattern: 'Sprawdź to pole.',
    step: 'Wartość musi być wielokrotnością {0}.',
    email: 'Wprowadź poprawny adres e-mail.',
    date: 'Wprowadź poprawną datę.',
    dateISO: 'Wprowadź poprawną datę.',
    number: 'Wprowadź liczbę.',
    digit: 'Wprowadź cyfrę.',
    phoneUS: 'Wprowadź poprawny numer telefonu.',
    equal: 'Wartości muszą być równe.',
    notEqual: 'Wybierz inną wartość.',
    unique: 'Sprawdź czy wartość jest unikalna.'
});