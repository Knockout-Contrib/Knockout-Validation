/// <reference path="../Lib/knockout-latest.debug.js" />


(function () {
    if (typeof (ko) === undefined) throw 'Knockout is required, please ensure it is loaded before loading this validation plug-in';

    //#region Utilities

    function isArray(o) { return o.isArray || Object.prototype.toString.call(o) === '[object Array]'; }
    function isObject(o) { return o != null && typeof o === 'object'; }
    function values(o) { var r = []; for (var i in o) { r.push(o[i]); } return r; }
    function hasAttribute(node, attr) { if (node.hasAttribute) return (node.hasAttribute(attr)); else return (!!node.getAttribute(attr)); }
    function isValidatable(o) { return o.rules && o.isValid && o.isModified; }
    function insertAfter(node, newNode) { node.parentNode.insertBefore(newNode, node.nextSibling); }
    function extend(o, p, q) { if (!p) return o; for (var i in p) { if (isObject(p[i])) { if (!o[i]) o[i] = {}; extend(o[i], p[i]); } else { o[i] = p[i]; } } if (q) extend(o, q); return o; }
    var newId = (function () { var a = new Date().getTime(); return function () { return a++ } })();

    //#endregion

    var configuration = {
        registerExtenders: true,
        messagesOnModified: true,
        messageTemplate: null,
        insertMessages: true,
        parseInputAttributes: false,
        errorMessageClass: 'validationMessage'
    };

    ko.validation = {

        //Call this on startup
        //any config can be overridden with the passed in options
        init: function (options) {
            extend(configuration, options);

            if (configuration.registerExtenders) {
                ko.validation.registerExtenders();
            }

            ko.validation.registerValueBindingHandler();
        },
        //backwards compatability
        configure: function (options) { ko.validation.init(options); },

        group: function (obj) { // array of observables or viewModel
            var group = isArray(obj) ? obj : values(obj);
            var observables = ko.utils.arrayFilter(group, function (item) {
                if (ko.isObservable(item)) {
                    item.extend({ validatable: true });
                    return true;
                }
                return false;
            });
            var result = ko.dependentObservable(function () {
                var errors = [];
                ko.utils.arrayForEach(observables, function (observable) {

                    if (!observable.isValid()) {
                        errors.push(observable.error);
                    }
                });
                return errors;
            });
            result.showAllMessages = function () {
                ko.utils.arrayForEach(observables, function (observable) {
                    observable.isModified(true);
                });
            };
            return result;
        },
        formatMessage: function (message, params) {
            return message.replace('{0}', params);
        },

        // addRule: 
        // This takes in a ko.observable and a Rule Context - which is just a rule name and params to supply to the validator
        // ie: ko.validation.addRule(myObservable, {
        //          rule: 'required',
        //          params: true
        //      });
        //
        addRule: function (observable, rule) {
            observable.extend({ validatable: true });

            //push a Rule Context to the observables local array of Rule Contexts
            observable.rules.push(rule);
            return observable;
        },

        // addAnonymousRule:
        // Anonymous Rules essentially have all the properties of a Rule, but are only specific for a certain property
        // and developers typically are wanting to add them on the fly or not register a rule with the 'ko.validation.rules' object
        //
        // Example:
        // var test = ko.observable('something').extend{(
        //      validation: {
        //          validator: function(val, someOtherVal){
        //              return true;
        //          },
        //          message: "Something must be really wrong!',
        //          params: true
        //      }
        //  )};
        addAnonymousRule: function (observable, ruleObj) {
            var ruleName = newId();

            //Create an anonymous rule to reference
            ko.validation.rules[ruleName] = {
                validator: ruleObj.validator,
                message: ruleObj.message || 'Error'
            };

            //add the anonymous rule to the observable
            ko.validation.addRule(observable, {
                rule: ruleName,
                params: ruleObj.params
            });
        },


        addExtender: function (ruleName) {
            ko.extenders[ruleName] = function (observable, params) {
                //params can come in a few flavors
                // 1. Just the params to be passed to the validator
                // 2. An object containing the Message to be used and the Params to pass to the validator
                //
                // Example:
                // var test = ko.observable(3).extend({
                //      max: {
                //          message: 'This special field has a Max of {0}',
                //          params: 2
                //      }
                //  )};
                //
                if (params.message) { //if it has a message object, then its an object literal to use
                    return ko.validation.addRule(observable, {
                        rule: ruleName,
                        message: params.message,
                        params: params.params || true
                    });
                } else {
                    return ko.validation.addRule(observable, {
                        rule: ruleName,
                        params: params
                    });
                }
            };
        },
        registerExtenders: function () { // root extenders optional, use 'validation' extender if would cause conflicts
            if (configuration.registerExtenders) {
                for (var ruleName in ko.validation.rules) {
                    if (ko.validation.rules.hasOwnProperty(ruleName)) {
                        if (!ko.extenders[ruleName]) {
                            ko.validation.addExtender(ruleName);
                        }
                    }
                }
            }
        },
        insertValidationMessage: function (element) {
            var span = document.createElement('SPAN');
            span.className = configuration.errorMessageClass;
            insertAfter(element, span);
            return span;
        },
        registerValueBindingHandler: function () { // parse html5 input validation attributes where value binder, optional feature
            var init = ko.bindingHandlers.value.init;

            ko.bindingHandlers.value.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

                init(element, valueAccessor, allBindingsAccessor);

                //if the bindingContext contains a $validation object, they must be using a validationOptions binding
                var config = extend({}, configuration, bindingContext.$data.$validation);

                if (config.parseInputAttributes) {
                    setTimeout(function () {
                        ko.utils.arrayForEach(['required', 'min', 'max', 'maxLength', 'pattern'], function (attr) {
                            if (hasAttribute(element, attr)) {
                                ko.validation.addRule(valueAccessor(), {
                                    rule: attr,
                                    params: element.getAttribute(attr) || true
                                });
                            }
                        });
                    }, 0);
                }
                if (config.insertMessages && isValidatable(valueAccessor())) {
                    var validationMessageElement = ko.validation.insertValidationMessage(element);
                    if (config.messageTemplate) {
                        ko.renderTemplate(config.messageTemplate, { field: valueAccessor() }, null, validationMessageElement, 'replaceNode');
                    } else {
                        ko.applyBindingsToNode(validationMessageElement, { validationMessage: valueAccessor() });
                    }
                }
            };
        }
    };

    //#region Core Validation Rules

    //Validation Rules:
    // You can view and override messages or rules via:
    // ko.validation.rules[ruleName] 
    // 
    // To implement a custom Rule, simply use this template:
    // ko.validation.rules['<custom rule name>'] = {
    //      validator: function (val, param) {
    //          <custom logic>
    //          return <true or false>;
    //      },
    //      message: '<custom validation message>' //optionally you can also use a '{0}' to denote a placeholder that will be replaced with your 'param'
    // };
    //
    // Example:
    // ko.validation.rules['mustEqual'] = {
    //      validator: function( val, mustEqualVal ){
    //          return val === mustEqualVal;
    //      }, 
    //      message: 'This field must equal {0}'
    // };
    //
    ko.validation.rules = {};
    ko.validation.rules['required'] = {
        validator: function (val, required) {
            return required && val && (val+'').length > 0;
        },
        message: 'This field is required.'
    };

    ko.validation.rules['min'] = {
        validator: function (val, min) {
            return !val || val >= min;
        },
        message: 'Please enter a value greater than or equal to {0}.'
    };

    ko.validation.rules['max'] = {
        validator: function (val, max) {
            return !val || val <= max;
        },
        message: 'Please enter a value less than or equal to {0}.'
    };

    ko.validation.rules['minLength'] = {
        validator: function (val, minLength) {
            return val && val.length >= minLength;
        },
        message: 'Please enter at least {0} characters.'
    };

    ko.validation.rules['maxLength'] = {
        validator: function (val, maxLength) {
            return !val || val.length <= maxLength;
        },
        message: 'Please enter no more than {0} characters.'
    };

    ko.validation.rules['pattern'] = {
        validator: function (val, regex) {
            return !val || val.match(regex) != null;
        },
        message: 'Please check this value.'
    };

    //#endregion

    //#region Knockout Binding Handlers

    ko.bindingHandlers.validationMessage = { // individual error message, if modified or post binding
        update: function (element, valueAccessor) {
            var obsv = valueAccessor();
            obsv.extend({ validatable: true });

            var errorMsgAccessor = function () {
                if (!configuration.messagesOnModified || obsv.isModified()) {
                    return obsv.isValid() ? null : obsv.error;
                } else {
                    return null;
                }
            };

            ko.bindingHandlers.text.update(element, errorMsgAccessor);
        }
    };

    // ValidationOptions:
    // This binding handler allows you to override the initial config by setting any of the options for a specific element or context of elements
    //
    // Example:
    // <div data-bind="validationOptions: { insertMessages: true, messageTemplate: 'customTemplate', errorMessageClass: 'mySpecialClass'}">
    //      <input type="text" data-bind="value: someValue"/>
    //      <input type="text" data-bind="value: someValue2"/>
    // </div>
    ko.bindingHandlers.validationOptions = {
        makeValueAccessor: function (valueAccessor, bindingContext) {
            return function () {
                var validationAddIn = { $validation: valueAccessor() };

                var newBindingContext = extend({}, validationAddIn, bindingContext.$data);
                //bc.$data.$validation = valueAccessor();
                return newBindingContext;
            };
        },

        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            //We don't want to change the context of the 'WITH' binding... just simply pull the options out of the binding string
            // so we just pass the same context down, and store the validation options on the $data item.
            var newValueAccessor = ko.bindingHandlers.validationOptions.makeValueAccessor(valueAccessor, bindingContext);
            return ko.bindingHandlers['with'].init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var newValueAccessor = ko.bindingHandlers.validationOptions.makeValueAccessor(valueAccessor, bindingContext);
            return ko.bindingHandlers['with'].update(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };
    //#endregion

    //#region Knockout Extenders

    // Validation Extender:
    // This is for creating custom validation logic on the fly
    // Example:
    // var test = ko.observable('something').extend{(
    //      validation: {
    //          validator: function(val, someOtherVal){
    //              return true;
    //          },
    //          message: "Something must be really wrong!',
    //          params: true
    //      }
    //  )};
    ko.extenders['validation'] = function (observable, rules) { // allow single rule or array
        ko.utils.arrayForEach(isArray(rules) ? rules : [rules], function (rule) {
            // the 'rule' being passed in here has no name to identify a core Rule,
            // so we add it as an anonymous rule
            // If the developer is wanting to use a core Rule, but use a different message see the 'addExtender' logic for examples
            ko.validation.addAnonymousRule(observable, rule);
        });
        return observable;
    };

    //This is the extender that makes a Knockout Observable also 'Validatable'
    //examples include:
    // 1. var test = ko.observable('something').extend({validatable: true});
    // this will ensure that the Observable object is setup properly to respond to rules
    // 
    // 2. test.extend({validatable: false});
    // this will remove the validation properties from the Observable object should you need to do that.
    ko.extenders['validatable'] = function (observable, enable) {
        if (enable && !isValidatable(observable)) {

            observable.error = null; // holds the error message, we only need one since we stop processing validators when one is invalid

            // observable.rules:
            // ObservableArray of Rule Contexts, where a Rule Context is simply the name of a rule and the params to supply to it
            //
            // Rule Context = { rule: '<rule name>', params: '<passed in params>', message: '<Override of default Message>' }            
            observable.rules = ko.observableArray(); //holds the rule Contexts to use as part of validation

            observable.isValid = ko.dependentObservable(function () {
                var i = 0,
                    r, // the rule validator to execute
                    ctx, // the current Rule Context for the loop
                    rules = observable.rules(), //cache for iterator
                    len = rules.length; //cache for iterator

                for (; i < len; i++) {

                    //get the Rule Context info to give to the core Rule
                    ctx = rules[i];

                    //get the core Rule to use for validation
                    var r = ko.validation.rules[ctx.rule];

                    //Execute the validator and see if its valid
                    if (!r.validator(observable(), ctx.params || true)) { // default param is true, eg. required = true

                        //not valid, so format the error message and stick it in the 'error' variable
                        observable.error = ko.validation.formatMessage(ctx.message || r.message, ctx.params);
                        return false;
                    }
                }
                observable.error = null;
                return true;
            });

            observable.isModified = ko.observable(false);
            observable.subscribe(function (newValue) {
                observable.isModified(true);
            });
        }
        return observable;
    }

    //#endregion

})();