#Knockout Validation
A KnockoutJS Plugin for model and property validation

##Getting Started
```javascript
//setup the validation library, you can optionally pass in an 'options' object to configure the plug-in
ko.validation.init();

//start using it!
var myObject = ko.observable().extend({ required: true });
```

##Native Validation Rules
Required
Min
Max
MinLength
MaxLength
Pattern

##Custom Validation Rules
####Adding Re-usable Custom Rules

####Adding 'Anonymous' or Single-Use Custom Rules

##HTML5 Validation Attributes

Required
Min
Max
MinLength
Pattern

##Configuration Options

##Knockout Bindings

###ValidationMessage

###ValidationOptions

##Remote Validation Rules
we are working more on this, but for now you can create a custom rule and use a synchronous AJAX request in your rule to return `true/false` 