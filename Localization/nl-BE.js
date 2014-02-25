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
    min: 'Vul een waarde in groter dan of gelijk aan {0}.',
    max: 'Vul een waarde in kleiner dan of gelijk aan {0}.',
    minLength: 'Vul ten minste {0} tekens in.',
    maxLength: 'Vul ten hoogste {0} tekens in.',
    pattern: 'Vul een correcte waarde in.',
    step: 'Vul een waarde in die deelbaar is door {0}.',
    email: 'Vul een correct e-mailadres in.',
    date: 'Vul een correcte datum in.',
    dateISO: 'Vul een correcte datum in.',
    number: 'Vul een getal in.',
    digit: 'Vul een cijfer in.',
    phoneUS: 'Vul een geldig telefoonnummer in.',
    equal: 'Waarden moeten gelijk zijn.',
    notEqual: 'Vul een andere waarde in.',
    unique: 'Vul een unieke waarde in.'
});
