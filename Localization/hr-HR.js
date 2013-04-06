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
    required: 'Ovo polje je obavezno.',
    min: 'Unesena vrijednost mora biti jednaka ili veća od {0}.',
    max: 'Unesena vrijednost mora biti jednaka ili manja od {0}.',
    minLength: 'Minimalna dužina polja je {0} znakova.',
    maxLength: 'Maksimalna dužina polja je {0} znakova.',
    pattern: 'Unesena vrijednost nije ispravnog formata.',
    step: 'Vrijednost se mora povećavati za {0}.',
    email: 'Potrebno je unijeti ispravnu e-mail adresu.',
    date: 'Potrebno je unijeti ispravan datum.',
    dateISO: 'Potrebno je unijeti ispravan datum.',
    number: 'Unesena vrijednost mora biti broj.',
    digit: 'Unesena vrijednost mora biti znamenka.',
    phoneUS: 'Potrebno je unijeti ispravan broj telefona.',
    equal: 'Vrijednosti moraju biti jednake.',
    notEqual: 'Unesite drugu vrijednost.',
    unique: 'Unesena vrijednost mora biti jedinstvena.'
});