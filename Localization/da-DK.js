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
    required: 'Dette felt er påkrævet.',
    min: 'Angiv en værdi der mindst er {0}.',
    max: 'Angiv en værdi der højst er {0}.',
    minLength: 'Indtast mindst {0} tegn.',
    maxLength: 'Indtast højst {0} tegn.',
    pattern: 'Tjek venligst denne værdi.',
    step: 'Værdien skal stige med {0}',
    email: 'Dette er ikke en gyldig e-mail-adresse',
    date: 'Indtast en gyldig dato',
    dateISO: 'Indtast en gyldig dato',
    number: 'Indtast et tal',
    digit: 'Indtast et ciffer',
    phoneUS: 'Indtast et gyldigt telefonnummer',
    equal: 'Indtast den samme værdi igen.',
    notEqual: 'Indtast en anden værdi.',
    unique: 'Sørg for at værdien er unik.'
});
