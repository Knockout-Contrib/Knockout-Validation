/**
 * Localization file for Slovak - Slovak Republic (sk-SK)
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
    return kv.defineLocale('sk-SK', {
        required: 'Toto pole je povinné.',
        min: 'Zadajte číslo väčšie alebo rovné {0}.',
        max: 'Zadajte  číslo menšie alebo rovné {0}.',
        minLength: 'Vložte minimálne {0} znakov.',
        maxLength: 'Vložte najviac {0} znakov.',
        pattern: 'Skontrolujte formát poľa.',
        step: 'Hodnota musí byť násobok {0}.',
        email: 'Neplatná e-mailová adresa.',
        date: 'Zadajte platný dátum.',
        dateISO: 'Zadajte platný dátum.',
        number: 'Zadajte číslo.',
        digit: 'Zadajte číslice.',
        phoneUS: 'Zadajte platné telefónne číslo.',
        equal: 'Hodnoty musia byť rovnaké.',
        notEqual: 'Vyberte inú hodnotu.',
        unique: 'Skontrolujte, či je zadaná hodnota jedinečná.'
    });
}));
