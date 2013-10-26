/*=============================================================================
	Author:			Eric M. Barnard - @ericmbarnard								
	License:		MIT (http://opensource.org/licenses/mit-license.php)		
																				
	Description:	Validation Library for KnockoutJS							
===============================================================================
*/
/*globals require: false, exports: false, define: false, ko: false */

(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.validation = {});
    }
}(function ( ko, exports ) {

    if (typeof (ko) === undefined) { throw 'Knockout is required, please ensure it is loaded before loading this validation plug-in'; }

    // create our namespace object
    ko.validation = exports;

    var kv = ko.validation;
    var koUtils = ko.utils;
    var unwrap = koUtils.unwrapObservable;
    var forEach = koUtils.arrayForEach;
    var extend = koUtils.extend;
;/*global ko: false*/

var defaults = {
	registerExtenders: true,
	messagesOnModified: true,
	errorsAsTitle: true,            // enables/disables showing of errors as title attribute of the target element.
	errorsAsTitleOnModified: false, // shows the error when hovering the input field (decorateElement must be true)
	messageTemplate: null,
	insertMessages: true,           // automatically inserts validation messages as <span></span>
	parseInputAttributes: false,    // parses the HTML5 validation attribute from a form element and adds that to the object
	writeInputAttributes: false,    // adds HTML5 input validation attributes to form elements that ko observable's are bound to
	decorateInputElement: false,         // false to keep backward compatibility
	decorateElementOnModified: true,// true to keep backward compatibility
	errorClass: null,               // single class for error message and element
	errorElementClass: 'validationElement',  // class to decorate error element
	errorMessageClass: 'validationMessage',  // class to decorate error message
	allowHtmlMessages: false,		// allows HTML in validation messages
	grouping: {
		deep: false,        //by default grouping is shallow
		observable: true    //and using observables
	},
	validate: {
		// throttle: 10
	}
};

// make a copy  so we can use 'reset' later
var configuration = extend({}, defaults);

configuration.html5Attributes = ['required', 'pattern', 'min', 'max', 'step'];
configuration.html5InputTypes = ['email', 'number', 'date'];

configuration.reset = function () {
	extend(configuration, defaults);
};

kv.configuration = configuration;
;kv.utils = (function () {
	var seedId = new Date().getTime();

	var domData = {}; //hash of data objects that we reference from dom elements
	var domDataKey = '__ko_validation__';

	var utils = {
		isArray: function (o) {
			return o.isArray || Object.prototype.toString.call(o) === '[object Array]';
		},
		isObject: function (o) {
			return o !== null && typeof o === 'object';
		},
		getValue: function (o) {
			return (typeof o === 'function' ? o() : o);
		},
		hasAttribute: function (node, attr) {
			return node.getAttribute(attr) !== null;
		},
		getAttribute: function (element, attr) {
			return element.getAttribute(attr);
		},
		setAttribute: function (element, attr, value) {
			return element.setAttribute(attr, value);
		},
		isValidatable: function (o) {
			return !!(o && o.rules && o.isValid && o.isModified);
		},
		insertAfter: function (node, newNode) {
			node.parentNode.insertBefore(newNode, node.nextSibling);
		},
		newId: function () {
			return seedId += 1;
		},
		getConfigOptions: function (element) {
			var node = element, options;
			do {
				options = utils.contextFor(node, true);
				node = node.parentNode;
			} while (node && !options);

			return options || kv.configuration;
		},
		setDomData: function (node, data) {
			var key = node[domDataKey];

			if (!key) {
				node[domDataKey] = key = utils.newId();
			}

			domData[key] = data;
		},
		getDomData: function (node) {
			var key = node[domDataKey];

			if (!key) {
				return undefined;
			}

			return domData[key];
		},
		contextFor: function (node, checkOnlyNode) {
			switch (node.nodeType) {
				case 1:
				case 8:
					var context = utils.getDomData(node);
					if (context) { return context; }
					if (!checkOnlyNode && node.parentNode) { return utils.contextFor(node.parentNode); }
					break;
			}
			return undefined;
		},
		isEmptyVal: function (val) {
			if (val === undefined) {
				return true;
			}
			if (val === null) {
				return true;
			}
			if (val === "") {
				return true;
			}
		},
		getOriginalElementTitle: function (element) {
			var savedOriginalTitle = utils.getAttribute(element, 'data-orig-title'),
				currentTitle = element.title,
				hasSavedOriginalTitle = utils.hasAttribute(element, 'data-orig-title');

			return hasSavedOriginalTitle ?
				savedOriginalTitle : currentTitle;
		},
		async: function (expr) {
			if (window.setImmediate) { window.setImmediate(expr); }
			else { window.setTimeout(expr, 0); }
		},
		forEach: function (object, callback) {
			if (utils.isArray(object)) {
				return forEach(object, callback);
			}
			for (var prop in object) {
				if (object.hasOwnProperty(prop)) {
					callback(object[prop], prop);
				}
			}
		},

		observablesOf: function (obj, callback, options, level) {
			var result = [];

			if (obj.__kv_traversed === true) {
				return result;
			}

			if (options.deep) {
				if (!options.flagged) {
					options.flagged = [];
				}

		    obj.__kv_traversed = true;
		    options.flagged.push(obj);
			}

			//default level value depends on deep option.
			if (typeof level === "undefined") {
				level = options.deep ? 1 : -1;
			}

			if (ko.isObservable(obj)) {
				callback(obj, result);
			}

			//process recurisvely if it is deep grouping
			if (level !== 0) {
				var values, val = unwrap(obj);

				if (val && (utils.isArray(val) || utils.isObject(val))) {
					values = val;
				} else {
					values = [];
				}

				utils.forEach(values, function (observable) {
					//but not falsy things and not HTML Elements
					if (observable && !observable.nodeType) {
						result.push.apply(result, utils.observablesOf(observable, callback, options, level + 1));
					}
				});
			}

			if (level === 1 && options.deep) {
				// remove flags from objects
				var i = options.flagged.length;
				while (i--) {
					delete options.flagged[i].__kv_traversed;
				}
	      options.flagged.length = 0;
	      delete options.flagged;
			}

			return result;
		}
	};

	return utils;
})();
;var api = (function () {

	var isInitialized = 0,
		configuration = kv.configuration,
		utils = kv.utils;


	function collectErrors(array) {
		var errors = [];
		forEach(array, function (observable) {
			if (!observable.isValid()) {
				errors.push(observable.error);
			}
		});
		return errors;
	}

	function ensureIsValidatable(observable, result) {
		if (!utils.isValidatable(observable)) {
			observable.extend({ validatable: true });
		}
		result.push(observable);
	}


	return {
		//Call this on startup
		//any config can be overridden with the passed in options
		init: function (options, force) {
			//done run this multiple times if we don't really want to
			if (isInitialized > 0 && !force) {
				return;
			}

			//becuase we will be accessing options properties it has to be an object at least
			options = options || {};
			//if specific error classes are not provided then apply generic errorClass
			//it has to be done on option so that options.errorClass can override default
			//errorElementClass and errorMessage class but not those provided in options
			options.errorElementClass = options.errorElementClass || options.errorClass || configuration.errorElementClass;
			options.errorMessageClass = options.errorMessageClass || options.errorClass || configuration.errorMessageClass;

			extend(configuration, options);

			if (configuration.registerExtenders) {
				kv.registerExtenders();
			}

			isInitialized = 1;
		},
		// backwards compatability
		configure: function (options) {
			kv.init(options);
		},

		// resets the config back to its original state
		reset: kv.configuration.reset,

		// recursivly walks a viewModel and creates an object that
		// provides validation information for the entire viewModel
		// obj -> the viewModel to walk
		// options -> {
		//      deep: false, // if true, will walk past the first level of viewModel properties
		//      observable: false // if true, returns a computed observable indicating if the viewModel is valid
		// }
		model: function (model, options) { // array of observables or viewModel
			options = extend(extend({}, configuration.grouping), options);

			var collectedErrors;
			var isValid;
			var observables = utils.observablesOf(model, ensureIsValidatable, options);
			var errors = function () {
				return collectErrors(observables);
			};

			if (options.observable) {
				collectedErrors = ko.computed(errors);
				collectedErrors.throttleEvaluation = 10;
				isValid = ko.observable(collectedErrors().length === 0);
				collectedErrors.subscribe(function (list) { isValid(list.length === 0); });
			} else {
				collectedErrors = errors;
				isValid = function () { return collectedErrors().length === 0; };
			}

			errors = null;
			return extend({
				isValid: isValid,

				errors: collectedErrors,

				markAsModified: function (state) {
					var isModified = arguments.length === 0 || state;
					forEach(observables, function (observable) {
						observable.isModified(isModified);
					});
				},

				isAnyInvalidModified: function () {
					return !!koUtils.arrayFirst(observables, function (observable) {
						return !observable.isValid() && observable.isModified();
					});
				}
			}, model);
		},

		formatMessage: function (message, params) {
			if (typeof (message) === 'function') {
				return message(params);
			}
			return message.replace(/\{0\}/gi, unwrap(params));
		},

		// addRule:
		// This takes in a ko.observable and a Rule Context - which is just a rule name and params to supply to the validator
		// ie: kv.addRule(myObservable, {
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
		// and developers typically are wanting to add them on the fly or not register a rule with the 'kv.rules' object
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
			if (ruleObj['message'] === undefined) {
				ruleObj['message'] = 'Error';
			}

			//add the anonymous rule to the observable
			kv.addRule(observable, ruleObj);
		},

		addExtender: function (ruleName) {
			ko.extenders[ruleName] = function (observable, params) {
				//params can come in a few flavors
				// 1. Just the params to be passed to the validator
				// 2. An object containing the Message to be used and the Params to pass to the validator
				// 3. A condition when the validation rule to be applied
				//
				// Example:
				// var test = ko.observable(3).extend({
				//      max: {
				//          message: 'This special field has a Max of {0}',
				//          params: 2,
				//          onlyIf: function() {
				//                      return specialField.IsVisible();
				//                  }
				//      }
				//  )};
				//
				if (params && (params.message || params.onlyIf)) { //if it has a message or condition object, then its an object literal to use
					return kv.addRule(observable, {
						rule: ruleName,
						message: params.message,
						params: utils.isEmptyVal(params.params) ? true : params.params,
						condition: params.onlyIf
					});
				} else {
					return kv.addRule(observable, {
						rule: ruleName,
						params: params
					});
				}
			};
		},

		// loops through all kv.rules and adds them as extenders to
		// ko.extenders
		registerExtenders: function () { // root extenders optional, use 'validation' extender if would cause conflicts
			if (configuration.registerExtenders) {
				for (var ruleName in kv.rules) {
					if (kv.rules.hasOwnProperty(ruleName)) {
						if (!ko.extenders[ruleName]) {
							kv.addExtender(ruleName);
						}
					}
				}
			}
		},

		//creates a span next to the @element with the specified error class
		insertValidationMessage: function (element) {
			var span = document.createElement('SPAN');
			span.className = utils.getConfigOptions(element).errorMessageClass;
			utils.insertAfter(element, span);
			return span;
		},

		// if html-5 validation attributes have been specified, this parses
		// the attributes on @element
		parseInputValidationAttributes: function (element, valueAccessor) {
			forEach(kv.configuration.html5Attributes, function (attr) {
				if (utils.hasAttribute(element, attr)) {

                    var params = element.getAttribute(attr) || true;

                    if (attr === 'min' || attr === 'max')
                    {
                        // If we're validating based on the min and max attributes, we'll
                        // need to know what the 'type' attribute is set to
                        var typeAttr = element.getAttribute('type');
                        if (typeof typeAttr === "undefined" || !typeAttr)
                        {
                            // From http://www.w3.org/TR/html-markup/input:
                            //   An input element with no type attribute specified represents the 
                            //   same thing as an input element with its type attribute set to "text".
                            typeAttr = "text"; 
                        }                            
                        params = {typeAttr: typeAttr, value: params}; 
                    }
                
					kv.addRule(valueAccessor(), {
						rule: attr,
						params: params
					});
				}
			});

			var currentType = element.getAttribute('type');
			forEach(kv.configuration.html5InputTypes, function (type) {
				if (type === currentType) {
					kv.addRule(valueAccessor(), {
						rule: (type === 'date') ? 'dateISO' : type,
						params: true
					});
				}
			});
		},

		// writes html5 validation attributes on the element passed in
		writeInputValidationAttributes: function (element, valueAccessor) {
			var observable = valueAccessor();

			if (!observable || !observable.rules) {
				return;
			}

			var contexts = observable.rules(); // observable array

			// loop through the attributes and add the information needed
			forEach(kv.configuration.html5Attributes, function (attr) {
				var params;
				var ctx = koUtils.arrayFirst(contexts, function (ctx) {
					return ctx.rule.toLowerCase() === attr.toLowerCase();
				});

				if (!ctx) {
					return;
				}

				params = ctx.params;

				// we have to do some special things for the pattern validation
				if (ctx.rule === "pattern") {
					if (ctx.params instanceof RegExp) {
						params = ctx.params.source; // we need the pure string representation of the RegExpr without the //gi stuff
					}
				}

				// we have a rule matching a validation attribute at this point
				// so lets add it to the element along with the params
				element.setAttribute(attr, params);
			});

			contexts = null;
		},

		//take an existing binding handler and make it cause automatic validations
		makeBindingHandlerValidatable: function (handlerName) {
			var init = ko.bindingHandlers[handlerName].init;

			ko.bindingHandlers[handlerName].init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				return ko.bindingHandlers.exposeValidationResult.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
			};
		},

		// visit an objects properties and apply validation rules from a definition
		setRules: function (target, definition) {
			var setRules = function (target, definition) {
				if (!target || !definition) { return; }

				for (var prop in definition) {
					if (!definition.hasOwnProperty(prop)) { continue; }
					var ruleDefinitions = definition[prop];

					//check the target property exists and has a value
					if (!target[prop]) { continue; }
					var targetValue = target[prop],
						unwrappedTargetValue = unwrap(targetValue),
						rules = {},
						nonRules = {};

					for (var rule in ruleDefinitions) {
						if (!ruleDefinitions.hasOwnProperty(rule)) { continue; }
						if (kv.rules[rule]) {
							rules[rule] = ruleDefinitions[rule];
						} else {
							nonRules[rule] = ruleDefinitions[rule];
						}
					}

					//apply rules
					if (ko.isObservable(targetValue)) {
						targetValue.extend(rules);
					}

					//then apply child rules
					//if it's an array, apply rules to all children
					if (unwrappedTargetValue && utils.isArray(unwrappedTargetValue)) {
						for (var i = 0; i < unwrappedTargetValue.length; i++) {
							setRules(unwrappedTargetValue[i], nonRules);
						}
						//otherwise, just apply to this property
					} else {
						setRules(unwrappedTargetValue, nonRules);
					}
				}
			};
			setRules(target, definition);
		}
	};

})();

// expose api publicly
extend(ko.validation, api);;//Validation Rules:
// You can view and override messages or rules via:
// kv.rules[ruleName]
//
// To implement a custom Rule, simply use this template:
// kv.rules['<custom rule name>'] = {
//      validator: function (val, param) {
//          <custom logic>
//          return <true or false>;
//      },
//      message: '<custom validation message>' //optionally you can also use a '{0}' to denote a placeholder that will be replaced with your 'param'
// };
//
// Example:
// kv.rules['mustEqual'] = {
//      validator: function( val, mustEqualVal ){
//          return val === mustEqualVal;
//      },
//      message: 'This field must equal {0}'
// };
//
kv.rules = {};
kv.rules['required'] = {
	validator: function (val, required) {
		var stringTrimRegEx = /^\s+|\s+$/g,
			testVal;

		if (val === undefined || val === null) {
			return !required;
		}

		testVal = val;
		if (typeof (val) === "string") {
			testVal = val.replace(stringTrimRegEx, '');
		}

		if (!required) {// if they passed: { required: false }, then don't require this
			return true;
		}

		return ((testVal + '').length > 0);
	},
	message: 'This field is required.'
};

function minMaxValidatorFactory(validatorName) {
    var isMaxValidation = validatorName === "max";

    return function (val, options) {
        if (kv.utils.isEmptyVal(val)) {
            return true;
        }

        var comparisonValue, type;
        if (options.typeAttr === undefined) {
            // This validator is being called from javascript rather than
            // being bound from markup
            type = "text";
            comparisonValue = options;
        } else {
            type = options.typeAttr;
            comparisonValue = options.value;
        }

        // From http://www.w3.org/TR/2012/WD-html5-20121025/common-input-element-attributes.html#attr-input-min,
        // if the value is parseable to a number, then the minimum should be numeric
        if (!isNaN(comparisonValue)) {
            type = "number";
        }

        var regex, valMatches, comparisonValueMatches;
        switch (type.toLowerCase()) {
            case "week":
                regex = /^(\d{4})-W(\d{2})$/;
                valMatches = val.match(regex);
                if (valMatches === null) {
                    throw "Invalid value for " + validatorName + " attribute for week input.  Should look like " +
                        "'2000-W33' http://www.w3.org/TR/html-markup/input.week.html#input.week.attrs.min";
                }
                comparisonValueMatches = comparisonValue.match(regex);
                // If no regex matches were found, validation fails
                if (!comparisonValueMatches) {
                    return false;
                }

                if (isMaxValidation) {
                    return (valMatches[1] < comparisonValueMatches[1]) || // older year
                        // same year, older week
                        ((valMatches[1] === comparisonValueMatches[1]) && (valMatches[2] <= comparisonValueMatches[2]));
                } else {
                    return (valMatches[1] > comparisonValueMatches[1]) || // newer year
                        // same year, newer week
                        ((valMatches[1] === comparisonValueMatches[1]) && (valMatches[2] >= comparisonValueMatches[2]));
                }
                break;

            case "month":
                regex = /^(\d{4})-(\d{2})$/;
                valMatches = val.match(regex);
                if (valMatches === null) {
                    throw "Invalid value for " + validatorName + " attribute for month input.  Should look like " +
                        "'2000-03' http://www.w3.org/TR/html-markup/input.month.html#input.month.attrs.min";
                }
                comparisonValueMatches = comparisonValue.match(regex);
                // If no regex matches were found, validation fails
                if (!comparisonValueMatches) {
                    return false;
                }

                if (isMaxValidation) {
                    return ((valMatches[1] < comparisonValueMatches[1]) || // older year
                        // same year, older month
                        ((valMatches[1] === comparisonValueMatches[1]) && (valMatches[2] <= comparisonValueMatches[2])));
                } else {
                    return (valMatches[1] > comparisonValueMatches[1]) || // newer year
                        // same year, newer month
                        ((valMatches[1] === comparisonValueMatches[1]) && (valMatches[2] >= comparisonValueMatches[2]));
                }
                break;

            case "number":
            case "range":
                if (isMaxValidation) {
                    return (!isNaN(val) && parseFloat(val) <= parseFloat(comparisonValue));
                } else {
                    return (!isNaN(val) && parseFloat(val) >= parseFloat(comparisonValue));
                }
                break;

            default:
                if (isMaxValidation) {
                    return val <= comparisonValue;
                } else {
                    return val >= comparisonValue;
                }
        }
    };
}

kv.rules['min'] = {
	validator: minMaxValidatorFactory("min"),
	message: 'Please enter a value greater than or equal to {0}.'
};

kv.rules['max'] = {
	validator: minMaxValidatorFactory("max"),
	message: 'Please enter a value less than or equal to {0}.'
};
    
kv.rules['minLength'] = {
	validator: function (val, minLength) {
		return kv.utils.isEmptyVal(val) || val.length >= minLength;
	},
	message: 'Please enter at least {0} characters.'
};

kv.rules['maxLength'] = {
	validator: function (val, maxLength) {
		return kv.utils.isEmptyVal(val) || val.length <= maxLength;
	},
	message: 'Please enter no more than {0} characters.'
};

kv.rules['pattern'] = {
	validator: function (val, regex) {
		return kv.utils.isEmptyVal(val) || val.toString().match(regex) !== null;
	},
	message: 'Please check this value.'
};

kv.rules['step'] = {
	validator: function (val, step) {

		// in order to handle steps of .1 & .01 etc.. Modulus won't work
		// if the value is a decimal, so we have to correct for that
		if (kv.utils.isEmptyVal(val) || step === 'any') { return true; }
		var dif = (val * 100) % (step * 100);
		return Math.abs(dif) < 0.00001 || Math.abs(1 - dif) < 0.00001;
	},
	message: 'The value must increment by {0}'
};

kv.rules['email'] = {
	validator: function (val, validate) {
		if (!validate) { return true; }

		//I think an empty email address is also a valid entry
		//if one want's to enforce entry it should be done with 'required: true'
		return kv.utils.isEmptyVal(val) || (
			// jquery validate regex - thanks Scott Gonzalez
			validate && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(val)
		);
	},
	message: 'Please enter a proper email address'
};

kv.rules['date'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && !/Invalid|NaN/.test(new Date(value)));
	},
	message: 'Please enter a proper date'
};

kv.rules['dateISO'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value));
	},
	message: 'Please enter a proper date'
};

kv.rules['number'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value));
	},
	message: 'Please enter a number'
};

kv.rules['digit'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^\d+$/.test(value));
	},
	message: 'Please enter a digit'
};

kv.rules['phoneUS'] = {
	validator: function (phoneNumber, validate) {
		if (!validate) { return true; }
		if (kv.utils.isEmptyVal(phoneNumber)) { return true; } // makes it optional, use 'required' rule if it should be required
		if (typeof (phoneNumber) !== 'string') { return false; }
		phoneNumber = phoneNumber.replace(/\s+/g, "");
		return validate && phoneNumber.length > 9 && phoneNumber.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
	},
	message: 'Please specify a valid phone number'
};

kv.rules['equal'] = {
	validator: function (val, params) {
		var otherValue = params;
		return val === kv.utils.getValue(otherValue);
	},
	message: 'Values must equal'
};

kv.rules['notEqual'] = {
	validator: function (val, params) {
		var otherValue = params;
		return val !== kv.utils.getValue(otherValue);
	},
	message: 'Please choose another value.'
};

//unique in collection
// options are:
//    collection: array or function returning (observable) array
//              in which the value has to be unique
//    valueAccessor: function that returns value from an object stored in collection
//              if it is null the value is compared directly
//    external: set to true when object you are validating is automatically updating collection
kv.rules['unique'] = {
	validator: function (val, options) {
		var c = kv.utils.getValue(options.collection),
			external = kv.utils.getValue(options.externalValue),
			counter = 0;

		if (!val || !c) { return true; }

		koUtils.arrayFilter(c, function (item) {
			if (val === (options.valueAccessor ? options.valueAccessor(item) : item)) { counter++; }
		});
		// if value is external even 1 same value in collection means the value is not unique
		return counter < (!!external ? 1 : 2);
	},
	message: 'Please make sure the value is unique.'
};


//now register all of these!
(function () {
	kv.registerExtenders();
}());
;// The core binding handler
// this allows us to setup any value binding that internally always
// performs the same functionality
ko.bindingHandlers.exposeValidationResult = (function () {
	return {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var config = kv.utils.getConfigOptions(element);
			var observable = valueAccessor();

			// parse html5 input validation attributes, optional feature
			if (config.parseInputAttributes) {
				kv.utils.async(function () { kv.parseInputValidationAttributes(element, valueAccessor); });
			}

			if (!kv.utils.isValidatable(observable)) {
				return false;
			}

			if (config.insertMessages) {
				var messageNode = kv.insertValidationMessage(element);
				ko.applyBindingsToNode(messageNode, { validationMessage: observable });
			}

			// write the html5 attributes if indicated by the config
			if (config.writeInputAttributes) {
				kv.writeInputValidationAttributes(element, valueAccessor);
			}

			// if requested, add binding to decorate element
			if (config.decorateInputElement) {
				ko.applyBindingsToNode(element, { validationStyle: observable });
			}
		}
	};

}());

// override for KO's default 'value' and 'checked' bindings
kv.makeBindingHandlerValidatable("value");
kv.makeBindingHandlerValidatable("checked");


ko.bindingHandlers.validationMessage = { // individual error message, if modified or post binding
	update: function (element, valueAccessor) {
		var validatable = valueAccessor();

		if (!kv.utils.isValidatable(validatable)) {
			throw new Error("Observable is not validatable");
		}

		var
			config     = kv.utils.getConfigOptions(element),
			isModified = validatable.isModified(),
			isValid    = validatable.error.isEmpty();

		var error = null, shouldShowError = false;
		if (!config.messagesOnModified || isModified) {
			error = isValid ? null : validatable.error();
			shouldShowError = !isValid;
		}

		var updateErrorBinding = config.allowHtmlMessages ? 'html' : 'text';
		ko.bindingHandlers[updateErrorBinding].update(element, function () { return error; });

		var isCurrentlyErrorVisible = element.style.display !== "none";
		if (isCurrentlyErrorVisible && !shouldShowError) {
			element.style.display = 'none';
		} else if (!isCurrentlyErrorVisible && shouldShowError) {
			element.style.display = '';
		}
	}
};

ko.bindingHandlers.validationStyle = {
	update: function (element, valueAccessor) {
		var validatable = valueAccessor();

		if (!kv.utils.isValidatable(validatable)) {
			throw new Error("Observable is not validatable");
		}

		var
			config     = kv.utils.getConfigOptions(element),
			isModified = validatable.isModified(),
			isValid    = validatable.error.isEmpty();

		//add or remove class on the element;
		ko.bindingHandlers.css.update(element, function () {
			var classes = {};
			classes[config.errorElementClass] = !config.decorateElementOnModified || isModified ? !isValid : false;

			return classes;
		});

		if (config.errorsAsTitle) {
			ko.bindingHandlers.validationStyle.setErrorAsTitleOn(element, validatable, config);
		}
	},

	setErrorAsTitleOn: function (element, validatable, config) {
		var
			isValid = validatable.error.isEmpty(),
			isModified = validatable.isModified();

		ko.bindingHandlers.attr.update(element, function () {
			if (!config.errorsAsTitleOnModified || isModified) {
				var title = kv.utils.getOriginalElementTitle(element);
				if (!isValid) {
					return { title: validatable.error, 'data-orig-title': title };
				} else {
					return { title: title, 'data-orig-title': null };
				}
			}
		});
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
ko.bindingHandlers['validationOptions'] = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var options = unwrap(valueAccessor());
		if (options) {
			var newConfig = extend({}, kv.configuration);
			extend(newConfig, options);

			//store the validation options on the node so we can retrieve it later
			kv.utils.setDomData(element, newConfig);
		}
	}
};

;(function () {
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
		forEach(kv.utils.isArray(rules) ? rules : [rules], function (rule) {
			// the 'rule' being passed in here has no name to identify a core Rule,
			// so we add it as an anonymous rule
			// If the developer is wanting to use a core Rule, but use a different message see the 'addExtender' logic for examples
			kv.addAnonymousRule(observable, rule);
		});
		return observable;
	};


	function trackIsModified() {
		this.target.isModified(true);
	}

	function clearError() {
		this(null);
	}

	function isErrorEmpty() {
		return this() === null;
	}

	//This is the extender that makes a Knockout Observable also 'Validatable'
	//examples include:
	// 1. var test = ko.observable('something').extend({validatable: true});
	// this will ensure that the Observable object is setup properly to respond to rules
	//
	// 2. test.extend({validatable: false});
	// this will remove the validation properties from the Observable object should you need to do that.
	ko.extenders['validatable'] = function (observable, options) {
		if (!kv.utils.isObject(options)) {
			options = { enable: options };
		}

		if (!('enable' in options)) {
			options.enable = true;
		}

		if (options.enable && !kv.utils.isValidatable(observable)) {
			observable.error = ko.observable(null); // holds the error message, we only need one since we stop processing validators when one is invalid
			observable.error.clear = clearError;
			observable.error.isEmpty = isErrorEmpty;

			// observable.rules:
			// ObservableArray of Rule Contexts, where a Rule Context is simply the name of a rule and the params to supply to it
			//
			// Rule Context = { rule: '<rule name>', params: '<passed in params>', message: '<Override of default Message>' }
			observable.rules = ko.observableArray(); //holds the rule Contexts to use as part of validation

			//in case async validation is occuring
			observable.isValidating = ko.observable(false);

			observable.isModified = ko.observable(false);

			observable.isValid = ko.observable(true);
			observable.error.subscribe(function (error) {
				observable.isValid(observable.error.isEmpty());
			});

			//subscribe to changes in the observable
			var isModifiedSubscription = observable.subscribe(trackIsModified);

			// we use a computed here to ensure that anytime a dependency changes, the
			// validation logic evaluates
			var validationTrigger = ko.computed(function () {
				observable(); // create dependency
				kv.process(observable);
			});

			var config = kv.configuration.validate;
			validationTrigger.throttleEvaluation = options.throttle || config && config.throttle;

			observable._disposeValidation = function () {
				this.rules.removeAll();
				isModifiedSubscription.dispose();
				validationTrigger.dispose();

				delete this['rules'];
				delete this['error'];
				delete this['isValid'];
				delete this['isValidating'];
				delete this['isModified'];
			};
		} else if (options.enable === false && observable._disposeValidation) {
			observable._disposeValidation();
		}
		return observable;
	};

	function validateSync(observable, rule, ctx) {
		var params = unwrap(typeof ctx.params === "undefined" ? true : ctx.params);
		//Execute the validator and see if its valid
		if (!rule.validator(observable(), params)) {
			//not valid, so format the error message and stick it in the 'error' variable
			observable.error(kv.formatMessage(ctx.message || rule.message, params));
			return false;
		}
		return true;
	}

	function validateAsync(observable, rule, ctx) {
		var params = unwrap(ctx.params || true);

		observable.isValidating(true);
		//fire the validator and hand it the callback
		rule.validator(observable(), params, function (validationResult) {
			if (observable.isValid()) {
				var message, isValid = validationResult;

				//we were handed back a complex object
				if (kv.utils.isObject(validationResult)) {
					isValid = validationResult.isValid;
					message = validationResult.message || '';
				}

				if (!isValid) {
					observable.error(kv.formatMessage(message || ctx.message || rule.message, params));
				}
			}

			// since we're returning early, make sure we turn this off
			observable.isValidating(false);
		});
	}

	kv.process = function (observable) {
		var rule, // the rule validator to execute
			ctx, // the current Rule Context for the loop
			ruleContexts = observable.rules(); //cache for iterator

		for (var i = 0, count = ruleContexts.length; i < count; i++) {
			ctx = ruleContexts[i];
			// checks an 'onlyIf' condition
			if (ctx.condition && !ctx.condition()) {
				continue;
			}

			//get the core Rule to use for validation
			rule = ctx.rule ? kv.rules[ctx.rule] : ctx;

			if (rule.async || ctx.async) {
				//TODO: all async validators are run without waiting result from prev validator
				validateAsync(observable, rule, ctx);
			} else if (!validateSync(observable, rule, ctx)) {
				return false; //break out of the loop
			}
		}
		//finally if we got this far, make the observable valid again!
		observable.error.clear();
		return true;
	};
})();
;
//quick function to override rule messages
kv.localize = function (msgTranslations) {

	var msg, rule;

	//loop the properties in the object and assign the msg to the rule
	for (rule in msgTranslations) {
		if (kv.rules.hasOwnProperty(rule)) {
			kv.rules[rule].message = msgTranslations[rule];
		}
	}
};;ko.applyBindingsWithValidation = function (viewModel, rootNode, options) {
	var len = arguments.length,
		node, config;

	if (len > 2) { // all parameters were passed
		node = rootNode;
		config = options;
	} else if (len < 2) {
		node = document.body;
	} else { //have to figure out if they passed in a root node or options
		if (arguments[1].nodeType) { //its a node
			node = rootNode;
		} else {
			config = arguments[1];
		}
	}

	kv.init();

	if (config) {
		kv.utils.setDomData(node, config);
	}

	ko.applyBindings(viewModel, rootNode);
};

//override the original applyBindings so that we can ensure all new rules and what not are correctly registered
var origApplyBindings = ko.applyBindings;
ko.applyBindings = function (viewModel, rootNode) {

	kv.init();

	origApplyBindings(viewModel, rootNode);
};

ko.validatedObservable = function (initialValue) {
	return ko.observable(initialValue).extend({ validatable: true });
};
;}));