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
    required: 'Este campo es obligatorio',
    min: 'Por favor, introduzca un valor igual o mayor a {0}',
    max: 'Por favor, introduzca un valor menor o igual a {0}',
    minLength: 'Por favor, introduzca al menos {0} caracteres',
    maxLength: 'Por favor, no introduzca más de {0} caracteres',
    pattern: 'Por favor, compruebe este campo',
    step: 'El valor debe incrementarse por {0}',
    email: 'Este no es una dirección de email correcta',
    date: 'Por favor, introduzca una fecha correcta',
    dateISO: 'Por favor, introduzca una fecha correcta',
    number: 'Por favor, introduzca un número',
    digit: 'Por favor, introduzca un dígito',
    phoneUS: 'Por favor, introduzca un número de teléfono válido para EEUU',
    equal: 'Los valores deben ser iguales',
    notEqual: 'Por favor, elija otro valor',
    unique: 'Por favor, asegurese de que el valor sea único'
});
