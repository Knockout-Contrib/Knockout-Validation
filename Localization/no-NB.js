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
    required: 'Dette feltet er obligatorisk',
    min: 'Fyll inn en verdi som er større eller lik {0}',
    max: 'Fyll inn en verdi som er mindre eller lik {0}',
    minLength: 'Fyll inn minst {0} tegn',
    maxLength: 'Fyll inn færre enn {0} tegn',
    pattern: 'Vennligst kontrollér verdien',
    step: 'Verdien må økes med {0}',
    email: 'Dette er ikke en korrekt e-postadresse',
    date: 'Fyll inn en korrekt dato',
    dateISO: 'Fyll inn en korrekt dato',
    number: 'Fyll inn ett nummer',
    digit: 'Fyll inn ett siffer',
    phoneUS: 'Vennlist spesifiser ett korrekt telefonnummer',
    equal: 'Verdiene må være like',
    notEqual: 'Vennligst velg en annen verdi',
    unique: 'Vennligst sørg for at verdien er unik'
});
