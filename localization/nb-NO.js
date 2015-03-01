/**
 * Localization file for Norwegian (Bokmål) - Norway (nb-NO)
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
    return kv.defineLocale('nb-NO', {
        required: 'Dette feltet er obligatorisk',
        min: 'Fyll inn en verdi som er større eller lik {0}',
        max: 'Fyll inn en verdi som er mindre eller lik {0}',
        minLength: 'Fyll inn minst {0} tegn',
        maxLength: 'Fyll inn færre enn {0} tegn',
        pattern: 'Vennligst kontrollér verdien',
        step: 'Verdien må økes med {0}',
        email: 'Dette er ikke en korrekt e-postadresse',
        date: 'Fyll inn en korrekt dato',
        dateISO: 'Fyll inn en korrekt dato',
        number: 'Fyll inn ett nummer',
        digit: 'Fyll inn ett siffer',
        phoneUS: 'Vennlist spesifiser ett korrekt telefonnummer',
        equal: 'Verdiene må være like',
        notEqual: 'Vennligst velg en annen verdi',
        unique: 'Vennligst sørg for at verdien er unik'
    });
}));
