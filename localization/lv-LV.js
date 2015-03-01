/**
 * Localization file for Latvian - Latvia (lv-LV)
 */
(function(factory) {
    /*global ko,require,define,module*/
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory(require('../'));
    } else if (typeof define === 'function' && define.amd) {
        define(['knockout.validation'], factory);
    } else {
        factory(ko.validation);
    }
}(function(kv) {
    return kv.defineLocale('lv-LV', {
        required: 'Lauks ir obligāts.',
        min: 'Lūdzu, ievadiet vērtību lielāku vai vienādu ar {0}.',
        max: 'Lūdzu, ievadiet vērtību mazāku vai vienādu par {0}.',
        minLength: 'Lūdzu, ievadiet vismaz {0} simbolus.',
        maxLength: 'Lūdzu, ievadiet ne vairāk kā {0} simbolus.',
        pattern: 'Lūdzu, pārbaudiet norādītās vērtības formātu.',
        step: 'Norādītām vērtībām jābūt pieaugošām ar soli {0}',
        email: 'Norādītā e-pasta adrese neatbilst formātam',
        date: 'Lūdzu, norādiet atbilstošu datuma formātu.',
        dateISO: 'Lūdzu, norādiet atbilstošu datuma formātu.',
        number: 'Lūdzu, ievadiet numuru.',
        digit: 'Lūdzu, ievadiet ciparu.',
        phoneUS: 'Lūdzu, norādiet formātam atbilstošu telefona numuru.',
        equal: 'Norādītām vērtībām jābūt vienādām.',
        notEqual: 'Norādītās vērtības nav vienādas.',
        unique: 'Vērtībai jābūt unikālai.'
    });
}));
