/**
 * Localization file for Dutch - Belgium (nl-BE)
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
    return kv.defineLocale('nl-BE', {
        required: 'Dit veld is verplicht.',
        min: 'Vul een waarde in groter dan of gelijk aan {0}.',
        max: 'Vul een waarde in kleiner dan of gelijk aan {0}.',
        minLength: 'Vul ten minste {0} tekens in.',
        maxLength: 'Vul ten hoogste {0} tekens in.',
        pattern: 'Vul een correcte waarde in.',
        step: 'Vul een waarde in die deelbaar is door {0}.',
        email: 'Vul een correct e-mailadres in.',
        date: 'Vul een correcte datum in.',
        dateISO: 'Vul een correcte datum in.',
        number: 'Vul een getal in.',
        digit: 'Vul een cijfer in.',
        phoneUS: 'Vul een geldig telefoonnummer in.',
        equal: 'Waarden moeten gelijk zijn.',
        notEqual: 'Vul een andere waarde in.',
        unique: 'Vul een unieke waarde in.'
    });
}));
