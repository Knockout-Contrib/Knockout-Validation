/**
 * Localization file for Bulgarian - Bulgaria (bg-BG)
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
    return kv.defineLocale('bg-BG', {
        required: 'Моля, въведете стойност.',
        min: 'Моля, въведете стойност по-голяма или равна на {0}.',
        max: 'Моля, въведете стойност по-малка или равна на {0}.',
        minLength: 'Моля, въведете поне {0} символа.',
        maxLength: 'Моля, въведете по-малко от {0} символа.',
        pattern: 'Моля, проверете тази стойност.',
        step: 'Стойността трябва да се увеличава с {0}.',
        email: 'Това не е валиден e-mail адрес.',
        date: 'Моля, въведете валидна дата.',
        dateISO: 'Моля, въведете валидна дата.',
        number: 'Моля, въведете число.',
        digit: 'Моля, въведете цифра.',
        phoneUS: 'Моля, въведете валиден телефонен номер.',
        equal: 'Стойностите трябва да са равни.',
        notEqual: 'Моля, изберете различна стойност.',
        unique: 'Моля, убедете се, че стойността е уникална.'
    });
}));
