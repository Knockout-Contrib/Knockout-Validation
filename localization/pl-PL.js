/**
 * Localization file for Polish - Poland (pl-PL)
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
    return kv.defineLocale('pl-PL', {
        required: 'To pole jest wymagane.',
        min: 'Wprowadź liczbę większą lub równą {0}.',
        max: 'Wprowadź liczbę mniejszą lub równą {0}.',
        minLength: 'Wprowadź co najmniej {0} znaków.',
        maxLength: 'Wprowadź co najwyżej {0} znaków.',
        pattern: 'Sprawdź to pole.',
        step: 'Wartość musi być wielokrotnością {0}.',
        email: 'Wprowadź poprawny adres e-mail.',
        date: 'Wprowadź poprawną datę.',
        dateISO: 'Wprowadź poprawną datę.',
        number: 'Wprowadź liczbę.',
        digit: 'Wprowadź cyfrę.',
        phoneUS: 'Wprowadź poprawny numer telefonu.',
        equal: 'Wartości muszą być równe.',
        notEqual: 'Wybierz inną wartość.',
        unique: 'Sprawdź czy wartość jest unikalna.'
    });
}));
