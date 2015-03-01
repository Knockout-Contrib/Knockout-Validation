/**
 * Localization file for Czech - Czech Republic (cs-CZ)
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
    return kv.defineLocale('cs-CZ', {
        required: 'Toto pole je povinné.',
        min: 'Zadejte číslo větší nebo rovné {0}.',
        max: 'Zadejte číslo menší nebo rovné {0}.',
        minLength: 'Vložte alespoň {0} znaků.',
        maxLength: 'Vložte nejvíce {0} znaků.',
        pattern: 'Zkontrolujte formát pole.',
        step: 'Hodnota musí být násobek {0}.',
        email: 'Neplatná e-mailová adresa.',
        date: 'Zadejte platné datum.',
        dateISO: 'Zadejte platné datum.',
        number: 'Zadejte číslo.',
        digit: 'Zadejte číslice.',
        phoneUS: 'Zadejte platné telefonní číslo.',
        equal: 'Hodnoty musí být stejné.',
        notEqual: 'Vyberte jinou hodnotu.',
        unique: 'Zkontrolujte, zda hodnota je jedinečná.'
    });
}));
