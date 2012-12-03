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
    required: 'שדה נדרש',
    min: 'אנא הכנס ערך גדול יותר או שווה ל- {0}',
    max: 'אנא הכנס ערך קטן יותר או שווה ל- {0}',
    minLength: 'אנא הכנס לפחות {0} תווים',
    maxLength: 'אנא הכנס לא יותר מאשר {0} תווים',
    pattern: 'אנא בדוק את הערך הזה',
    step: 'הערך צריך להשתנות ב - {0}',
    email: 'אנא הכנס כתובת דוא"ל חוקית',
    date: 'אנא הכנס תאריך תקין',
    dateISO: 'אנא הכנס תאריך תקין',
    number: 'אנא הכנס מספר',
    digit: 'אנא הכנס ספרה',
    phoneUS: 'אנא הכנס מספר טלפון תקין',
    equal: 'ערכים חייבים להיות שווים',
    notEqual: 'אנא בחר ערך שונה',
    unique: 'אנא וודא שהערך ייחודי'
});