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
    required: 'Aquest camp es obligatori',
    min: 'Introduir un valor igual o major que {0}',
    max: 'Introduir un valor menor o igual que {0}',
    minLength: 'Ha de tenir un mínim de {0} caràcters',
    maxLength: 'No pot tenir mes de {0} caràcters',
    pattern: 'Si us plau, comproveu aquest campo',
    step: "El valor ha d'incrementar-se en {0}",
    email: 'Aquesta no es una adreça de correu electrònic correcta',
    date: 'Introduir una data correcta',
    dateISO: 'Introduir una data correcta',
    number: 'Ha de ser un nombre',
    digit: 'Introduir un dígit',
    phoneUS: 'Ha de ser un número de telèfon vàlid',
    equal: 'Els valors han de ser iguals',
    notEqual: 'Elegiu un altre valor',
    unique: 'Ha de ser un valor únic'
});
