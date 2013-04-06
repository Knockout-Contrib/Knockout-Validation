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
    required: 'Detta fält är obligatorisk',
    min: 'Fyll i ett värde som är större än eller lika med {0}',
    max: 'Fyll i ett värde som är mindre än eller lika med {0}',
    minLength: 'Fyll i minst {0} tecken',
    maxLength: 'Fyll i färre än {0} tecken',
    pattern: 'Var god kontrollera värdet',
    step: 'Värdet måste ökas med {0}',
    email: 'Fyll i en korrekt e-postadress',
    date: 'Fyll i ett korrekt datum',
    dateISO: 'Fyll i ett korrekt datum',
    number: 'Fyll i ett nummer',
    digit: 'Fyll i en siffra',
    phoneUS: 'Fyll i ett korrekt telefonnummer',
    equal: 'Fyll i samma värde en gång till',
    notEqual: 'Fyll i ett annat värde',
    unique: 'Fyll i ett unikt värde'
});