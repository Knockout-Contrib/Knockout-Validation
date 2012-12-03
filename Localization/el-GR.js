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
    required: 'Το πεδίο αυτό είναι υποχρεωτικό.',
    min: 'Παρακαλώ εισάγετε μια τιμή μεγαλύτερη ή ίση από {0}.',
    max: 'Παρακαλώ εισάγετε μια τιμή μικρότερη ή ίση από {0}.',
    minLength: 'Παρακαλώ εισάγετε τουλάχιστον {0} χαρακτήρες.',
    maxLength: 'Παρακαλώ εισάγετε το πολύ {0} χαρακτήρες.',
    pattern: 'Παρακαλώ ελέγξτε την τιμή αυτή.',
    step: 'Η τιμή πρέπει να αυξηθεί κατά {0}',
    email: 'Η διεύθυνση email δεν έχει έγκυρη μορφή',
    date: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
    dateISO: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
    number: 'Παρακαλώ εισάγετε έναν αριθμό',
    digit: 'Παρακαλώ εισάγετε ένα ψηφίο',
    phoneUS: 'Παρακαλώ εισάγετε έναν σωστό αριθμό τηλεφώνου',
    equal: 'Οι τιμές πρέπει να είναι ίσες',
    notEqual: 'Παρακαλώ επιλέξτε μια άλλη τιμή.',
    unique: 'Παρακαλώ βεβαιωθείτε ότι η τιμή είναι μοναδική.'
});