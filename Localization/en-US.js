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
    required: 'This field is required.',
    min: 'Please enter a value greater than or equal to {0}.',
    max: 'Please enter a value less than or equal to {0}.',
    minLength: 'Please enter at least {0} characters.',
    maxLength: 'Please enter no more than {0} characters.',
    pattern: 'Please check this value.',
    step: 'The value must increment by {0}',
    email: 'This is not a proper email address',
    date: 'Please enter a proper date',
    dateISO: 'Please enter a proper date',
    number: 'Please enter a number',
    digit: 'Please enter a digit',
    phoneUS: 'Please specify a valid phone number',
    equal: 'Values must equal',
    notEqual: 'Please choose another value.',
    unique: 'Please make sure the value is unique.'
});