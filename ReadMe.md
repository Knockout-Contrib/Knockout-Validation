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
var myComplexObj = ko.observable()
                     .extend({ required: true })
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
####Adding Re-usable Custom Rules

####Adding 'Anonymous' or Single-Use Custom Rules

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

###ValidationOptions

##Remote Validation Rules
we are working more on this, but for now you can create a custom rule and use a synchronous AJAX request in your rule to return `true/false` 