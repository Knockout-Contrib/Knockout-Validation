#Knockout Validation
A KnockoutJS Plugin for model and property validation

Contributors:

* [Andy Booth](https://github.com/andybooth)
* [Eric Barnard](https://github.com/ericmbarnard)

##Getting Started
```javascript
//setup the validation library, you can optionally pass in an 'options' object to configure the plug-in
ko.validation.init();

//start using it!
var myObject = ko.observable().extend({ required: true });

//oooh complexity
var myComplexObj = ko.observable().extend({ 
                     required: true,
                     minLength: 3,
                     pattern: {
                          message: 'Hey this doesnt match my pattern',
                          params: '^[A-Z0-9].$'
                     }
                 });

//or a different flavor if you like
var myComplexObj = ko.observable()

myComplexObj.extend({ required: true })
            .extend({ minLength: 3 })
            .extend({ pattern: {
                 message: 'Hey this doesnt match my pattern',
                 params: '^[A-Z0-9].$'
            }});

```
see more examples on the Fiddle: http://jsfiddle.net/ericbarnard/KHFn8/

##Native Validation Rules
**Required**:

```javascript
var myObj = ko.observable('').extend({ required: true });
```
**Min**:

```javascript
var myObj = ko.observable('').extend({ min: 2 });
```
**Max**:

```javascript
var myObj = ko.observable('').extend({ max: 99 });
```
**MinLength**:

```javascript
var myObj = ko.observable('').extend({ minLength: 3 });
```
**MaxLength**:

```javascript
var myObj = ko.observable('').extend({ maxLength: 12 });
```
**Pattern**:

```javascript
var myObj = ko.observable('').extend({ pattern: '^[a-z0-9].$' });
```

##Custom Validation Rules
####Custom Rules
Custom Rules can be created using the simple example below. All you need is to define a validator function and a default message. 
The validator function takes in the observable's value, and the `params` that you pass in with the `extend` method.

```javascript
ko.validation.rules['mustEqual'] = {
    validator: function (val, otherVal) {
        return val === otherVal;
    },
    message: 'The field must equal {0}'
};

ko.validation.init();

var myCustomObj = ko.observable().extend({ mustEqual: 5 }); //the value '5' is the second arg ('otherVal') that is passed to the validator
```
All Validation Messages can be formatted to use the passed in `params` to produce a custom message. 
`message: 'The field must equal {0}'` will be formatted with the `5` during actual validation so the user sees:
`'The field must equal 5'`

####'Anonymous' or Single-Use Custom Rules
Anonymous rules are validation rules that are usually specific to only one object and might be determined on the fly.

```javascript
var testObj = ko.observable(3).extend({
        validation: {
            validator: function (val, someOtherVal) {
                return val === someOtherVal;
            },
            message: 'Must Equal 5',
            params: 5
        }
    });
```

##HTML5 Validation Attributes

Required: `<input type="text" data-bind="value: myProp" required />`

Min: `<input type="text" data-bind="value: myProp" min="2" />`

Max: `<input type="text" data-bind="value: myProp" max="99" />`

MinLength: `<input type="text" data-bind="value: myProp" minLength="10" />`

Pattern: `<input type="text" data-bind="value: myProp" pattern="^[a-z0-9].*" />`

##Configuration Options
```javascript
var options = {
  //default: true
  insertMessages: true, //this toggles Automatic inserting of validation Messages using a SPAN
  //default: null
  messageTemplate: 'myCustomMessageTemplate', //tells the Plugin to use the defined message template as default
  //default: false
  parseInputAttributes: true, //tells Plugin to parse the HTML5 INPUT element validation attributes
  //default: 'validationMessage'
  errorMessageClass: 'myCustomMessageClass' //tells the Plugin to use this CSS Class by default for validation messages
}

ko.validation.init(options);
```
##Knockout Bindings

###ValidationMessage
If you want to customize the display of your objects validation message, use the `validationMessage` binding:

```html
<div>
   <input type="text" data-bind="value: someValue"/>
   <p data-bind="validationMessage: someValue"></p>
<div>
```
###ValidationOptions
If you have large areas of a form that you would like to change how the Validation Plugin is configured, use the `validationOptions` binding.
This will cascade your options through the children of the container that you apply this to.

Use this for:

* Custom Message Templates
* Disabling auto-inserting of messages
* Changing the Validation Message CSS Class

```html
<div data-bind='validationOptions: { messageTemplate: "customMessageTemplate" }'>
    <label>Email: <input data-bind='value: emailAddress' required pattern="@"/></label>
    <label>Location: <input data-bind='value: location'/></label>
    <label>Age: <input data-bind='value: age' required/></label>
</div>
```

##Remote Validation Rules
we are working more on this, but for now you can create a custom rule and use a synchronous AJAX request in your rule to return `true/false` 