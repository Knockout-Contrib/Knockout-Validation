/**
 * Localization file for Russian - Russia (ru-RU)
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
    return kv.defineLocale('ru-RU', {
        required: 'Пожалуйста, заполните это поле.',
        min: 'Пожалуйста, введите число большее или равное {0}.',
        max: 'Пожалуйста, введите число меньшее или равное {0}.',
        minLength: 'Пожалуйста, введите по крайней мере {0} символов.',
        maxLength: 'Пожалуйста, введите не больше чем {0} символов.',
        pattern: 'Пожалуйста, проверьте это поле.',
        step: 'Значение должно быть кратным {0}',
        email: 'Пожалуйста, укажите здесь правильный адрес электронной почты',
        date: 'Пожалуйста, введите правильную дату',
        dateISO: 'Пожалуйста, введите правильную дату в формате ISO',
        number: 'Пожалуйста, введите число',
        digit: 'Пожалуйста, введите цифры',
        phoneUS: 'Пожалуйста, укажите правильный телефонный номер',
        equal: 'Значения должны быть равны',
        notEqual: 'Пожалуйста, выберите другое значение.',
        unique: 'Пожалуйста, укажите уникальное значение.'
    });
}));
