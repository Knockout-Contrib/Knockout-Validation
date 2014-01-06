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
    required: 'Dit veld is verplicht.',
    min: 'Geef een waarde in groter of gelijk aan {0}.',
    max: 'Geef een waarde in kleiner of gelijk aan {0}.',
    minLength: 'Geef minstens {0} karakters in.',
    maxLength: 'Geef hoogstens {0} karakters in.',
    pattern: 'Geef een correcte waarde.',
    step: 'Geef een waarde dat deelbaar is door {0}.',
    email: 'Geef een correct emailadres in.',
    date: 'Geef een correcte datum.',
    dateISO: 'Geef een correcte datum.',
    number: 'Geef een getal in.',
    digit: 'Geef een getal in.',
    phoneUS: 'Geef een geldig telefoonnummer in.',
    equal: 'Waarden moeten gelijk zijn.',
    notEqual: 'Kies een andere waarde.',
    unique: 'Geef een unieke waarde.'
});
