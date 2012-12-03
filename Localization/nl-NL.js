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
    min: 'Geef alstublieft een waarde in groter of gelijk aan {0}.',
    max: 'Geef alstublieft een waarde in kleiner of gelijk aan {0}.',
    minLength: 'Geef alstublief minstens {0} karakters in.',
    maxLength: 'Geef alstublief hoogstens {0} karakters in.',
    pattern: 'Verifieer alstublieft deze waarde.',
    step: 'De waarde moet veranderen in stappen van {0}.',
    email: 'Dit is geen correct emailadres.',
    date: 'Geef alstublieft een correcte datum.',
    dateISO: 'Geef alstublieft een correcte datum.',
    number: 'Geef alstublieft een nummer in.',
    digit: 'Geef alstublieft een nummer in.',
    phoneUS: 'Geef alstublieft een geldig telefoonnummer in.',
    equal: 'Waarden moeten gelijk zijn.',
    notEqual: 'Kies alstublieft een andere waarde.',
    unique: 'Verzeker er u van dat deze waarde uniek is.'
});