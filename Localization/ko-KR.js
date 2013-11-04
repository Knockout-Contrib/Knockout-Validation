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
    required: '필수 입력항목입니다.',
    min: '{0}보다 큰 값을 입력해 주십시오.',
    max: '{0}보다 작은 값을 입력해 주십시오.',
    minLength: '{0}글자 이상으로 입력해 주십시오.',
    maxLength: '{0}글자 이하로 입력해 주십시오.',
    pattern: '입력한 값의 형식이 올바르지 않습니다.',
    step: '이 값은 반드시 {0}씩 증가해야 합니다.',
    email:'올바른 이메일 주소 형식이 아닙니다.',
    date: '올바른 날짜 형식이 아닙니다.',
    dateISO: '올바른 날짜 형식이 아닙니다.',
    number: '숫자를 입력해 주십시오.',
    digit: '숫자를 입력해 주십시오.',
    phoneUS: '올바른 전화번호 형식이 아닙니다.',
    equal: '같은 값을 입력해 주십시오.',
    notEqual: '다른 값을 선택해 주십시오.',
    unique: '고유한 값인지 확인해 주십시오.'
});