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
    required: 'Dieses Feld ist erforderlich.',
    min: 'Bitte geben Sie einen Wert größer oder gleich {0} ein.',
    max: 'Bitte geben Sie einen Wert kleiner oder gleich {0} ein.',
    minLength: 'Bitte geben Sie mindestens {0} Zeichen ein.',
    maxLength: 'Bitte geben Sie nicht mehr als {0} Zeichen ein.',
    pattern: 'Bitte überprüfen Sie diesen Wert.',
    step: 'Der Wert muss um {0} erhöht werden.',
    email: 'Das ist keine gültige Email-Adresse.',
    date: 'Bitte geben Sie ein gültiges Datum ein.',
    dateISO: 'Bitte geben Sie ein gültiges Datum ein.',
    number: 'Bitte geben Sie eine Zahl ein.',
    digit: 'Bitte geben Sie eine Ziffer ein.',
    phoneUS: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    equal: 'Die Werte müssen übereinstimmen.',
    notEqual: 'Bitte wählen Sie einen anderen Wert.',
    unique: 'Bitte stellen Sie sicher, dass der Wert eindeutig ist.'
});
