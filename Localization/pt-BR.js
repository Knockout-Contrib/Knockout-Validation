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
    required: 'Este campo é requerido.',
    min: 'Por favor, forneça um valor maior ou igual a {0}.',
    max: 'Por favor, forneça um valor menor ou igual a {0}.',
    minLength: 'Por favor, forneça ao menos {0} caracteres.',
    maxLength: 'Por favor, forneça não mais que {0} caracteres.',
    pattern: 'Por favor, verifique este valor',
    step: 'O valor deve ser incrementado por {0}',
    email: 'Por favor, forneça um endereço eletrônico válido.',
    date: 'Por favor, forneça uma data válida.',
    dateISO: 'Por favor, forneça uma data válida (ISO).',
    number: 'Por favor, forneça um número válido.',
    digit: 'Por favor, forneça somente dígitos.',
    phoneUS: 'Por favor, forneça um telefone válido',
    equal: 'Os valores devem ser iguais',
    notEqual: 'Por faovr, escolha outro valor',
    unique: 'Verifique se o valor é único'
});