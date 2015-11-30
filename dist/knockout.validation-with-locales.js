/*=============================================================================
	Author:			Eric M. Barnard - @ericmbarnard								
	License:		MIT (http://opensource.org/licenses/mit-license.php)		
																				
	Description:	Validation Library for KnockoutJS							
	Version:		2.0.3											
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

	if (typeof (ko) === 'undefined') {
		throw new Error('Knockout is required, please ensure it is loaded before loading this validation plug-in');
	}

	// create our namespace object
	ko.validation = exports;

	var kv = ko.validation,
		koUtils = ko.utils,
		unwrap = koUtils.unwrapObservable,
		forEach = koUtils.arrayForEach,
		extend = koUtils.extend;
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
		observable: true,   //and using observables
		live: false		    //react to changes to observableArrays if observable === true
	},
	validate: {
		// throttle: 10
	}
};

// make a copy  so we can use 'reset' later
var configuration = extend({}, defaults);

configuration.html5Attributes = ['required', 'pattern', 'min', 'max', 'step', 'maxlength', 'minlength'];
configuration.html5InputTypes = ['email', 'number', 'date'];

configuration.reset = function () {
	extend(configuration, defaults);
};

kv.configuration = configuration;
;kv.utils = (function () {
	var seedId = new Date().getTime();

	var domData = {}; //hash of data objects that we reference from dom elements
	var domDataKey = '__ko_validation__';

	return {
		isArray: function (o) {
			return o.isArray || Object.prototype.toString.call(o) === '[object Array]';
		},
		isObject: function (o) {
			return o !== null && typeof o === 'object';
		},
		isNumber: function(o) {
			return !isNaN(o);	
		},
		isObservableArray: function(instance) {
			return !!instance &&
					typeof instance["remove"] === "function" &&
					typeof instance["removeAll"] === "function" &&
					typeof instance["destroy"] === "function" &&
					typeof instance["destroyAll"] === "function" &&
					typeof instance["indexOf"] === "function" &&
					typeof instance["replace"] === "function";
		},
		values: function (o) {
			var r = [];
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					r.push(o[i]);
				}
			}
			return r;
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
			var options = kv.utils.contextFor(element);

			return options || kv.configuration;
		},
		setDomData: function (node, data) {
			var key = node[domDataKey];

			if (!key) {
				node[domDataKey] = key = kv.utils.newId();
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
		contextFor: function (node) {
			switch (node.nodeType) {
				case 1:
				case 8:
					var context = kv.utils.getDomData(node);
					if (context) { return context; }
					if (node.parentNode) { return kv.utils.contextFor(node.parentNode); }
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
			var savedOriginalTitle = kv.utils.getAttribute(element, 'data-orig-title'),
				currentTitle = element.title,
				hasSavedOriginalTitle = kv.utils.hasAttribute(element, 'data-orig-title');

			return hasSavedOriginalTitle ?
				savedOriginalTitle : currentTitle;
		},
		async: function (expr) {
			if (window.setImmediate) { window.setImmediate(expr); }
			else { window.setTimeout(expr, 0); }
		},
		forEach: function (object, callback) {
			if (kv.utils.isArray(object)) {
				return forEach(object, callback);
			}
			for (var prop in object) {
				if (object.hasOwnProperty(prop)) {
					callback(object[prop], prop);
				}
			}
		}
	};
}());;var api = (function () {

	var isInitialized = 0,
		configuration = kv.configuration,
		utils = kv.utils;

	function cleanUpSubscriptions(context) {
		forEach(context.subscriptions, function (subscription) {
			subscription.dispose();
		});
		context.subscriptions = [];
	}

	function dispose(context) {
		if (context.options.deep) {
			forEach(context.flagged, function (obj) {
				delete obj.__kv_traversed;
			});
			context.flagged.length = 0;
		}

		if (!context.options.live) {
			cleanUpSubscriptions(context);
		}
	}

	function runTraversal(obj, context) {
		context.validatables = [];
		cleanUpSubscriptions(context);
		traverseGraph(obj, context);
		dispose(context);
	}

	function traverseGraph(obj, context, level) {
		var objValues = [],
			val = obj.peek ? obj.peek() : obj;

		if (obj.__kv_traversed === true) {
			return;
		}

		if (context.options.deep) {
			obj.__kv_traversed = true;
			context.flagged.push(obj);
		}

		//default level value depends on deep option.
		level = (level !== undefined ? level : context.options.deep ? 1 : -1);

		// if object is observable then add it to the list
		if (ko.isObservable(obj)) {
			// ensure it's validatable but don't extend validatedObservable because it
			// would overwrite isValid property.
			if (!obj.errors && !utils.isValidatable(obj)) {
				obj.extend({ validatable: true });
			}
			context.validatables.push(obj);

			if (context.options.live && utils.isObservableArray(obj)) {
				context.subscriptions.push(obj.subscribe(function () {
					context.graphMonitor.valueHasMutated();
				}));
			}
		}

		//get list of values either from array or object but ignore non-objects
		// and destroyed objects
		if (val && !unwrap(val._destroy)) {
			if (utils.isArray(val)) {
				objValues = val;
			}
			else if (utils.isObject(val)) {
				objValues = utils.values(val);
			}
		}

		//process recursively if it is deep grouping
		if (level !== 0) {
			utils.forEach(objValues, function (observable) {
				//but not falsy things and not HTML Elements
				if (observable && !observable.nodeType && (!ko.isComputed(observable) || observable.rules)) {
					traverseGraph(observable, context, level + 1);
				}
			});
		}
	}

	function collectErrors(array) {
		var errors = [];
		forEach(array, function (observable) {
			// Do not collect validatedObservable errors
			if (utils.isValidatable(observable) && !observable.isValid()) {
				// Use peek because we don't want a dependency for 'error' property because it
				// changes before 'isValid' does. (Issue #99)
				errors.push(observable.error.peek());
			}
		});
		return errors;
	}

	return {
		//Call this on startup
		//any config can be overridden with the passed in options
		init: function (options, force) {
			//done run this multiple times if we don't really want to
			if (isInitialized > 0 && !force) {
				return;
			}

			//because we will be accessing options properties it has to be an object at least
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

		// resets the config back to its original state
		reset: kv.configuration.reset,

		// recursively walks a viewModel and creates an object that
		// provides validation information for the entire viewModel
		// obj -> the viewModel to walk
		// options -> {
		//	  deep: false, // if true, will walk past the first level of viewModel properties
		//	  observable: false // if true, returns a computed observable indicating if the viewModel is valid
		// }
		group: function group(obj, options) { // array of observables or viewModel
			options = extend(extend({}, configuration.grouping), options);

			var context = {
				options: options,
				graphMonitor: ko.observable(),
				flagged: [],
				subscriptions: [],
				validatables: []
			};

			var result = null;

			//if using observables then traverse structure once and add observables
			if (options.observable) {
				result = ko.computed(function () {
					context.graphMonitor(); //register dependency
					runTraversal(obj, context);
					return collectErrors(context.validatables);
				});
			}
			else { //if not using observables then every call to error() should traverse the structure
				result = function () {
					runTraversal(obj, context);
					return collectErrors(context.validatables);
				};
			}

			result.showAllMessages = function (show) { // thanks @heliosPortal
				if (show === undefined) {//default to true
					show = true;
				}

				result.forEach(function (observable) {
					if (utils.isValidatable(observable)) {
						observable.isModified(show);
					}
				});
			};

			result.isAnyMessageShown = function () {
				var invalidAndModifiedPresent;

				invalidAndModifiedPresent = !!result.find(function (observable) {
					return utils.isValidatable(observable) && !observable.isValid() && observable.isModified();
				});
				return invalidAndModifiedPresent;
			};

			result.filter = function(predicate) {
				predicate = predicate || function () { return true; };
				// ensure we have latest changes
				result();

				return koUtils.arrayFilter(context.validatables, predicate);
			};

			result.find = function(predicate) {
				predicate = predicate || function () { return true; };
				// ensure we have latest changes
				result();

				return koUtils.arrayFirst(context.validatables, predicate);
			};

			result.forEach = function(callback) {
				callback = callback || function () { };
				// ensure we have latest changes
				result();

				forEach(context.validatables, callback);
			};

			result.map = function(mapping) {
				mapping = mapping || function (item) { return item; };
				// ensure we have latest changes
				result();

				return koUtils.arrayMap(context.validatables, mapping);
			};

			/**
			 * @private You should not rely on this method being here.
			 * It's a private method and it may change in the future.
			 *
			 * @description Updates the validated object and collects errors from it.
			 */
			result._updateState = function(newValue) {
				if (!utils.isObject(newValue)) {
					throw new Error('An object is required.');
				}
				obj = newValue;
				if (options.observable) {
					context.graphMonitor.valueHasMutated();
				}
				else {
					runTraversal(newValue, context);
					return collectErrors(context.validatables);
				}
			};
			return result;
		},

		formatMessage: function (message, params, observable) {
			if (utils.isObject(params) && params.typeAttr) {
				params = params.value;
			}
			if (typeof message === 'function') {
				return message(params, observable);
			}
			var replacements = unwrap(params);
			if (replacements == null) {
				replacements = [];
			}
			if (!utils.isArray(replacements)) {
				replacements = [replacements];
			}
			return message.replace(/{(\d+)}/gi, function(match, index) {
				if (typeof replacements[index] !== 'undefined') {
					return replacements[index];
				}
				return match;
			});
		},

		// addRule:
		// This takes in a ko.observable and a Rule Context - which is just a rule name and params to supply to the validator
		// ie: kv.addRule(myObservable, {
		//		  rule: 'required',
		//		  params: true
		//	  });
		//
		addRule: function (observable, rule) {
			observable.extend({ validatable: true });

			var hasRule = !!koUtils.arrayFirst(observable.rules(), function(item) {
				return item.rule && item.rule === rule.rule;
			});

			if (!hasRule) {
				//push a Rule Context to the observables local array of Rule Contexts
				observable.rules.push(rule);
			}
			return observable;
		},

		// addAnonymousRule:
		// Anonymous Rules essentially have all the properties of a Rule, but are only specific for a certain property
		// and developers typically are wanting to add them on the fly or not register a rule with the 'kv.rules' object
		//
		// Example:
		// var test = ko.observable('something').extend{(
		//	  validation: {
		//		  validator: function(val, someOtherVal){
		//			  return true;
		//		  },
		//		  message: "Something must be really wrong!',
		//		  params: true
		//	  }
		//  )};
		addAnonymousRule: function (observable, ruleObj) {
			if (ruleObj['message'] === undefined) {
				ruleObj['message'] = 'Error';
			}

			//make sure onlyIf is honoured
			if (ruleObj.onlyIf) {
				ruleObj.condition = ruleObj.onlyIf;
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
				//	  max: {
				//		  message: 'This special field has a Max of {0}',
				//		  params: 2,
				//		  onlyIf: function() {
				//					  return specialField.IsVisible();
				//				  }
				//	  }
				//  )};
				//
				//if it has an embedded params, a message or condition object, then it's an object literal to use
				if (params && (params.params || params.message || params.onlyIf)) {
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
					var rule = attr;

					if (attr === 'min' || attr === 'max') {
						// If we're validating based on the min and max attributes, we'll
						// need to know what the 'type' attribute is set to
						var typeAttr = element.getAttribute('type');
						if (typeof typeAttr === "undefined" || !typeAttr) {
							// From http://www.w3.org/TR/html-markup/input:
							//   An input element with no type attribute specified represents the
							//   same thing as an input element with its type attribute set to "text".
							typeAttr = "text";
						}
						params = {typeAttr: typeAttr, value: params};
					}
					else if (attr === "minlength" || attr === "maxlength") {
						// Change params from a string to a number
						params = parseInt(params);

						// The Native Rule names are Camel Case, but the HTML5 validation
						// attributes are all lower case
                        rule = (attr === 'minlength') ? 'minLength' : 'maxLength';
					}

					kv.addRule(valueAccessor(), {
						rule: rule,
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
				var ctx = koUtils.arrayFirst(contexts, function (ctx) {
					return ctx.rule && ctx.rule.toLowerCase() === attr.toLowerCase();
				});

				if (!ctx) {
					return;
				}

				// we have a rule matching a validation attribute at this point
				// so lets add it to the element along with the params
				ko.computed({
					read: function() {
						var params = ko.unwrap(ctx.params);

						// we have to do some special things for the pattern validation
						if (ctx.rule === "pattern" && params instanceof RegExp) {
							// we need the pure string representation of the RegExpr without the //gi stuff
							params = params.source;
						}

						element.setAttribute(attr, params);
					},
					disposeWhenNodeIsRemoved: element
				});
			});

			contexts = null;
		},

		//take an existing binding handler and make it cause automatic validations
		makeBindingHandlerValidatable: function (handlerName) {
			var init = ko.bindingHandlers[handlerName].init;

			ko.bindingHandlers[handlerName].init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

				init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

				return ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
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

}());

// expose api publicly
extend(ko.validation, api);
;//Validation Rules:
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
		var testVal;

		if (val === undefined || val === null) {
			return !required;
		}

		testVal = val;
		if (typeof (val) === 'string') {
			if (String.prototype.trim) {
				testVal = val.trim();
			}
			else {
				testVal = val.replace(/^\s+|\s+$/g, '');
			}
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
        if (!isNaN(comparisonValue) && !(comparisonValue instanceof Date)) {
            type = "number";
        }

        var regex, valMatches, comparisonValueMatches;
        switch (type.toLowerCase()) {
            case "week":
                regex = /^(\d{4})-W(\d{2})$/;
                valMatches = val.match(regex);
                if (valMatches === null) {
                    throw new Error("Invalid value for " + validatorName + " attribute for week input.  Should look like " +
                        "'2000-W33' http://www.w3.org/TR/html-markup/input.week.html#input.week.attrs.min");
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
                    throw new Error("Invalid value for " + validatorName + " attribute for month input.  Should look like " +
                        "'2000-03' http://www.w3.org/TR/html-markup/input.month.html#input.month.attrs.min");
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
		if(kv.utils.isEmptyVal(val)) { return true; }
		var normalizedVal = kv.utils.isNumber(val) ? ('' + val) : val;
		return normalizedVal.length >= minLength;
	},
	message: 'Please enter at least {0} characters.'
};

kv.rules['maxLength'] = {
	validator: function (val, maxLength) {
		if(kv.utils.isEmptyVal(val)) { return true; }
		var normalizedVal = kv.utils.isNumber(val) ? ('' + val) : val;
		return normalizedVal.length <= maxLength;
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
	message: 'The value must increment by {0}.'
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
	message: 'Please enter a proper email address.'
};

kv.rules['date'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && !/Invalid|NaN/.test(new Date(value)));
	},
	message: 'Please enter a proper date.'
};

kv.rules['dateISO'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^\d{4}[-/](?:0?[1-9]|1[012])[-/](?:0?[1-9]|[12][0-9]|3[01])$/.test(value));
	},
	message: 'Please enter a proper date.'
};

kv.rules['number'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value));
	},
	message: 'Please enter a number.'
};

kv.rules['digit'] = {
	validator: function (value, validate) {
		if (!validate) { return true; }
		return kv.utils.isEmptyVal(value) || (validate && /^\d+$/.test(value));
	},
	message: 'Please enter a digit.'
};

kv.rules['phoneUS'] = {
	validator: function (phoneNumber, validate) {
		if (!validate) { return true; }
		if (kv.utils.isEmptyVal(phoneNumber)) { return true; } // makes it optional, use 'required' rule if it should be required
		if (typeof (phoneNumber) !== 'string') { return false; }
		phoneNumber = phoneNumber.replace(/\s+/g, "");
		return validate && phoneNumber.length > 9 && phoneNumber.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
	},
	message: 'Please specify a valid phone number.'
};

kv.rules['equal'] = {
	validator: function (val, params) {
		var otherValue = params;
		return val === kv.utils.getValue(otherValue);
	},
	message: 'Values must equal.'
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
ko.bindingHandlers['validationCore'] = (function () {

	return {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var config = kv.utils.getConfigOptions(element);
			var observable = valueAccessor();

			// parse html5 input validation attributes, optional feature
			if (config.parseInputAttributes) {
				kv.utils.async(function () { kv.parseInputValidationAttributes(element, valueAccessor); });
			}

			// if requested insert message element and apply bindings
			if (config.insertMessages && kv.utils.isValidatable(observable)) {

				// insert the <span></span>
				var validationMessageElement = kv.insertValidationMessage(element);

				// if we're told to use a template, make sure that gets rendered
				if (config.messageTemplate) {
					ko.renderTemplate(config.messageTemplate, { field: observable }, null, validationMessageElement, 'replaceNode');
				} else {
					ko.applyBindingsToNode(validationMessageElement, { validationMessage: observable });
				}
			}

			// write the html5 attributes if indicated by the config
			if (config.writeInputAttributes && kv.utils.isValidatable(observable)) {

				kv.writeInputValidationAttributes(element, valueAccessor);
			}

			// if requested, add binding to decorate element
			if (config.decorateInputElement && kv.utils.isValidatable(observable)) {
				ko.applyBindingsToNode(element, { validationElement: observable });
			}
		}
	};

}());

// override for KO's default 'value', 'checked', 'textInput' and selectedOptions bindings
kv.makeBindingHandlerValidatable("value");
kv.makeBindingHandlerValidatable("checked");
if (ko.bindingHandlers.textInput) {
	kv.makeBindingHandlerValidatable("textInput");
}
kv.makeBindingHandlerValidatable("selectedOptions");


ko.bindingHandlers['validationMessage'] = { // individual error message, if modified or post binding
	update: function (element, valueAccessor) {
		var obsv = valueAccessor(),
			config = kv.utils.getConfigOptions(element),
			val = unwrap(obsv),
			msg = null,
			isModified = false,
			isValid = false;

		if (obsv === null || typeof obsv === 'undefined') {
			throw new Error('Cannot bind validationMessage to undefined value. data-bind expression: ' +
				element.getAttribute('data-bind'));
		}

		isModified = obsv.isModified && obsv.isModified();
		isValid = obsv.isValid && obsv.isValid();

		var error = null;
		if (!config.messagesOnModified || isModified) {
			error = isValid ? null : obsv.error;
		}

		var isVisible = !config.messagesOnModified || isModified ? !isValid : false;
		var isCurrentlyVisible = element.style.display !== "none";

		if (config.allowHtmlMessages) {
			koUtils.setHtml(element, error);
		} else {
			ko.bindingHandlers.text.update(element, function () { return error; });
		}

		if (isCurrentlyVisible && !isVisible) {
			element.style.display = 'none';
		} else if (!isCurrentlyVisible && isVisible) {
			element.style.display = '';
		}
	}
};

ko.bindingHandlers['validationElement'] = {
	update: function (element, valueAccessor, allBindingsAccessor) {
		var obsv = valueAccessor(),
			config = kv.utils.getConfigOptions(element),
			val = unwrap(obsv),
			msg = null,
			isModified = false,
			isValid = false;

		if (obsv === null || typeof obsv === 'undefined') {
			throw new Error('Cannot bind validationElement to undefined value. data-bind expression: ' +
				element.getAttribute('data-bind'));
		}

		isModified = obsv.isModified && obsv.isModified();
		isValid = obsv.isValid && obsv.isValid();

		// create an evaluator function that will return something like:
		// css: { validationElement: true }
		var cssSettingsAccessor = function () {
			var css = {};

			var shouldShow = ((!config.decorateElementOnModified || isModified) ? !isValid : false);

			// css: { validationElement: false }
			css[config.errorElementClass] = shouldShow;

			return css;
		};

		//add or remove class on the element;
		ko.bindingHandlers.css.update(element, cssSettingsAccessor, allBindingsAccessor);
		if (!config.errorsAsTitle) { return; }

		ko.bindingHandlers.attr.update(element, function () {
			var
				hasModification = !config.errorsAsTitleOnModified || isModified,
				title = kv.utils.getOriginalElementTitle(element);

			if (hasModification && !isValid) {
				return { title: obsv.error, 'data-orig-title': title };
			} else if (!hasModification || isValid) {
				return { title: title, 'data-orig-title': null };
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
ko.bindingHandlers['validationOptions'] = (function () {
	return {
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
}());
;// Validation Extender:
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
		var config = kv.configuration.validate || {};
		var validationOptions = {
			throttleEvaluation : options.throttle || config.throttle
		};

		observable.error = ko.observable(null); // holds the error message, we only need one since we stop processing validators when one is invalid

		// observable.rules:
		// ObservableArray of Rule Contexts, where a Rule Context is simply the name of a rule and the params to supply to it
		//
		// Rule Context = { rule: '<rule name>', params: '<passed in params>', message: '<Override of default Message>' }
		observable.rules = ko.observableArray(); //holds the rule Contexts to use as part of validation

		//in case async validation is occurring
		observable.isValidating = ko.observable(false);

		//the true holder of whether the observable is valid or not
		observable.__valid__ = ko.observable(true);

		observable.isModified = ko.observable(false);

		// a semi-protected observable
		observable.isValid = ko.computed(observable.__valid__);

		//manually set error state
		observable.setError = function (error) {
			var previousError = observable.error.peek();
			var previousIsValid = observable.__valid__.peek();

			observable.error(error);
			observable.__valid__(false);

			if (previousError !== error && !previousIsValid) {
				// if the observable was not valid before then isValid will not mutate,
				// hence causing any grouping to not display the latest error.
				observable.isValid.notifySubscribers();
			}
		};

		//manually clear error state
		observable.clearError = function () {
			observable.error(null);
			observable.__valid__(true);
			return observable;
		};

		//subscribe to changes in the observable
		var h_change = observable.subscribe(function () {
			observable.isModified(true);
		});

		// we use a computed here to ensure that anytime a dependency changes, the
		// validation logic evaluates
		var h_obsValidationTrigger = ko.computed(extend({
			read: function () {
				var obs = observable(),
					ruleContexts = observable.rules();

				kv.validateObservable(observable);

				return true;
			}
		}, validationOptions));

		extend(h_obsValidationTrigger, validationOptions);

		observable._disposeValidation = function () {
			//first dispose of the subscriptions
			observable.isValid.dispose();
			observable.rules.removeAll();
			h_change.dispose();
			h_obsValidationTrigger.dispose();

			delete observable['rules'];
			delete observable['error'];
			delete observable['isValid'];
			delete observable['isValidating'];
			delete observable['__valid__'];
			delete observable['isModified'];
            delete observable['setError'];
            delete observable['clearError'];
            delete observable['_disposeValidation'];
		};
	} else if (options.enable === false && observable._disposeValidation) {
		observable._disposeValidation();
	}
	return observable;
};

function validateSync(observable, rule, ctx) {
	//Execute the validator and see if its valid
	if (!rule.validator(observable(), (ctx.params === undefined ? true : unwrap(ctx.params)))) { // default param is true, eg. required = true

		//not valid, so format the error message and stick it in the 'error' variable
		observable.setError(kv.formatMessage(
					ctx.message || rule.message,
					unwrap(ctx.params),
					observable));
		return false;
	} else {
		return true;
	}
}

function validateAsync(observable, rule, ctx) {
	observable.isValidating(true);

	var callBack = function (valObj) {
		var isValid = false,
			msg = '';

		if (!observable.__valid__()) {

			// since we're returning early, make sure we turn this off
			observable.isValidating(false);

			return; //if its already NOT valid, don't add to that
		}

		//we were handed back a complex object
		if (valObj['message']) {
			isValid = valObj.isValid;
			msg = valObj.message;
		} else {
			isValid = valObj;
		}

		if (!isValid) {
			//not valid, so format the error message and stick it in the 'error' variable
			observable.error(kv.formatMessage(
				msg || ctx.message || rule.message,
				unwrap(ctx.params),
				observable));
			observable.__valid__(isValid);
		}

		// tell it that we're done
		observable.isValidating(false);
	};

	kv.utils.async(function() {
	    //fire the validator and hand it the callback
        rule.validator(observable(), ctx.params === undefined ? true : unwrap(ctx.params), callBack);
	});
}

kv.validateObservable = function (observable) {
	var i = 0,
		rule, // the rule validator to execute
		ctx, // the current Rule Context for the loop
		ruleContexts = observable.rules(), //cache for iterator
		len = ruleContexts.length; //cache for iterator

	for (; i < len; i++) {

		//get the Rule Context info to give to the core Rule
		ctx = ruleContexts[i];

		// checks an 'onlyIf' condition
		if (ctx.condition && !ctx.condition()) {
			continue;
		}

		//get the core Rule to use for validation
		rule = ctx.rule ? kv.rules[ctx.rule] : ctx;

		if (rule['async'] || ctx['async']) {
			//run async validation
			validateAsync(observable, rule, ctx);

		} else {
			//run normal sync validation
			if (!validateSync(observable, rule, ctx)) {
				return false; //break out of the loop
			}
		}
	}
	//finally if we got this far, make the observable valid again!
	observable.clearError();
	return true;
};
;
var _locales = {};
var _currentLocale;

kv.defineLocale = function(name, values) {
	if (name && values) {
		_locales[name.toLowerCase()] = values;
		return values;
	}
	return null;
};

kv.locale = function(name) {
	if (name) {
		name = name.toLowerCase();

		if (_locales.hasOwnProperty(name)) {
			kv.localize(_locales[name]);
			_currentLocale = name;
		}
		else {
			throw new Error('Localization ' + name + ' has not been loaded.');
		}
	}
	return _currentLocale;
};

//quick function to override rule messages
kv.localize = function (msgTranslations) {
	var rules = kv.rules;

	//loop the properties in the object and assign the msg to the rule
	for (var ruleName in msgTranslations) {
		if (rules.hasOwnProperty(ruleName)) {
			rules[ruleName].message = msgTranslations[ruleName];
		}
	}
};

// Populate default locale (this will make en-US.js somewhat redundant)
(function() {
	var localeData = {};
	var rules = kv.rules;

	for (var ruleName in rules) {
		if (rules.hasOwnProperty(ruleName)) {
			localeData[ruleName] = rules[ruleName].message;
		}
	}
	kv.defineLocale('en-us', localeData);
})();

// No need to invoke locale because the messages are already defined along with the rules for en-US
_currentLocale = 'en-us';
;/**
 * Possible invocations:
 * 		applyBindingsWithValidation(viewModel)
 * 		applyBindingsWithValidation(viewModel, options)
 * 		applyBindingsWithValidation(viewModel, rootNode)
 *		applyBindingsWithValidation(viewModel, rootNode, options)
 */
ko.applyBindingsWithValidation = function (viewModel, rootNode, options) {
	var node = document.body,
		config;

	if (rootNode && rootNode.nodeType) {
		node = rootNode;
		config = options;
	}
	else {
		config = rootNode;
	}

	kv.init();

	if (config) {
		config = extend(extend({}, kv.configuration), config);
		kv.utils.setDomData(node, config);
	}

	ko.applyBindings(viewModel, node);
};

//override the original applyBindings so that we can ensure all new rules and what not are correctly registered
var origApplyBindings = ko.applyBindings;
ko.applyBindings = function (viewModel, rootNode) {

	kv.init();

	origApplyBindings(viewModel, rootNode);
};

ko.validatedObservable = function (initialValue, options) {
	if (!options && !kv.utils.isObject(initialValue)) {
		return ko.observable(initialValue).extend({ validatable: true });
	}

	var obsv = ko.observable(initialValue);
	obsv.errors = kv.group(kv.utils.isObject(initialValue) ? initialValue : {}, options);
	obsv.isValid = ko.observable(obsv.errors().length === 0);

	if (ko.isObservable(obsv.errors)) {
		obsv.errors.subscribe(function(errors) {
			obsv.isValid(errors.length === 0);
		});
	}
	else {
		ko.computed(obsv.errors).subscribe(function (errors) {
			obsv.isValid(errors.length === 0);
		});
	}

	obsv.subscribe(function(newValue) {
		if (!kv.utils.isObject(newValue)) {
			/*
			 * The validation group works on objects.
			 * Since the new value is a primitive (scalar, null or undefined) we need
			 * to create an empty object to pass along.
			 */
			newValue = {};
		}
		// Force the group to refresh
		obsv.errors._updateState(newValue);
		obsv.isValid(obsv.errors().length === 0);
	});

	return obsv;
};
;/**
 * Localization file for Arabic - Jordan (ar-JO)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('ar-JO', {
        required: 'مطلوب.',
        min: 'أدخل قيمة اكبر من {0}.',
        max: 'أدخل قيمة اقل من {0}.',
        minLength: 'أدخل  {0} احرف أو أكثر.',
        maxLength: 'أدخل {0} أحرف أو أقل.',
        pattern: 'قيمة غير صحيحة.',
        step: 'يجب ان تضاف بمقدار {0}.',
        email: 'صيغة البريد الالكتروني غير صحيحة.',
        date: 'صيغة التاريخ غير صحيحة.',
        dateISO: 'صيغة التاريخ غير صحيحة.',
        number: 'يرجى إدخال رقم.',
        digit: 'يرجى إدخال منزلة.',
        phoneUS: 'صيغة رقم الهاتف غير صحيحة.',
        equal: 'القيمة غير مساوية.',
        notEqual: 'يرجى اختيار قيمة اخرى.',
        unique: 'يرجى التحقق من عدم اختبار قيمة مشابهة.'
    });
}));
;/**
 * Localization file for Bulgarian - Bulgaria (bg-BG)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('bg-BG', {
        required: 'Моля, въведете стойност.',
        min: 'Моля, въведете стойност по-голяма или равна на {0}.',
        max: 'Моля, въведете стойност по-малка или равна на {0}.',
        minLength: 'Моля, въведете поне {0} символа.',
        maxLength: 'Моля, въведете по-малко от {0} символа.',
        pattern: 'Моля, проверете тази стойност.',
        step: 'Стойността трябва да се увеличава с {0}.',
        email: 'Това не е валиден e-mail адрес.',
        date: 'Моля, въведете валидна дата.',
        dateISO: 'Моля, въведете валидна дата.',
        number: 'Моля, въведете число.',
        digit: 'Моля, въведете цифра.',
        phoneUS: 'Моля, въведете валиден телефонен номер.',
        equal: 'Стойностите трябва да са равни.',
        notEqual: 'Моля, изберете различна стойност.',
        unique: 'Моля, убедете се, че стойността е уникална.'
    });
}));
;/**
 * Localization file for Catalan - Catalan (ca-ES)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('ca-ES', {
        required: 'Aquest camp es obligatori',
        min: 'Introduir un valor igual o major que {0}',
        max: 'Introduir un valor menor o igual que {0}',
        minLength: 'Ha de tenir un mínim de {0} caràcters',
        maxLength: 'No pot tenir mes de {0} caràcters',
        pattern: 'Si us plau, comproveu aquest campo',
        step: "El valor ha d'incrementar-se en {0}",
        email: 'Aquesta no es una adreça de correu electrònic correcta',
        date: 'Introduir una data correcta',
        dateISO: 'Introduir una data correcta',
        number: 'Ha de ser un nombre',
        digit: 'Introduir un dígit',
        phoneUS: 'Ha de ser un número de telèfon vàlid',
        equal: 'Els valors han de ser iguals',
        notEqual: 'Elegiu un altre valor',
        unique: 'Ha de ser un valor únic'
    });
}));
;/**
 * Localization file for Czech - Czech Republic (cs-CZ)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('cs-CZ', {
        required: 'Toto pole je povinné.',
        min: 'Zadejte číslo větší nebo rovné {0}.',
        max: 'Zadejte číslo menší nebo rovné {0}.',
        minLength: 'Vložte alespoň {0} znaků.',
        maxLength: 'Vložte nejvíce {0} znaků.',
        pattern: 'Zkontrolujte formát pole.',
        step: 'Hodnota musí být násobek {0}.',
        email: 'Neplatná e-mailová adresa.',
        date: 'Zadejte platné datum.',
        dateISO: 'Zadejte platné datum.',
        number: 'Zadejte číslo.',
        digit: 'Zadejte číslice.',
        phoneUS: 'Zadejte platné telefonní číslo.',
        equal: 'Hodnoty musí být stejné.',
        notEqual: 'Vyberte jinou hodnotu.',
        unique: 'Zkontrolujte, zda hodnota je jedinečná.'
    });
}));
;/**
 * Localization file for Danish - Denmark (da-DK)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('da-DK', {
        required: 'Dette felt er påkrævet.',
        min: 'Angiv en værdi der mindst er {0}.',
        max: 'Angiv en værdi der højst er {0}.',
        minLength: 'Indtast mindst {0} tegn.',
        maxLength: 'Indtast højst {0} tegn.',
        pattern: 'Tjek venligst denne værdi.',
        step: 'Værdien skal stige med {0}',
        email: 'Dette er ikke en gyldig e-mail-adresse',
        date: 'Indtast en gyldig dato',
        dateISO: 'Indtast en gyldig dato',
        number: 'Indtast et tal',
        digit: 'Indtast et ciffer',
        phoneUS: 'Indtast et gyldigt telefonnummer',
        equal: 'Indtast den samme værdi igen.',
        notEqual: 'Indtast en anden værdi.',
        unique: 'Sørg for at værdien er unik.'
    });
}));
;/**
 * Localization file for German - Germany (de-DE)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('de-DE', {
        required: 'Dieses Feld ist erforderlich.',
        min: 'Bitte geben Sie einen Wert größer oder gleich {0} ein.',
        max: 'Bitte geben Sie einen Wert kleiner oder gleich {0} ein.',
        minLength: 'Bitte geben Sie mindestens {0} Zeichen ein.',
        maxLength: 'Bitte geben Sie nicht mehr als {0} Zeichen ein.',
        pattern: 'Bitte überprüfen Sie diesen Wert.',
        step: 'Der Wert muss um {0} erhöht werden.',
        email: 'Das ist keine gültige Email-Adresse.',
        date: 'Bitte geben Sie ein gültiges Datum ein.',
        dateISO: 'Bitte geben Sie ein gültiges Datum ein.',
        number: 'Bitte geben Sie eine Zahl ein.',
        digit: 'Bitte geben Sie eine Ziffer ein.',
        phoneUS: 'Bitte geben Sie eine gültige Telefonnummer ein.',
        equal: 'Die Werte müssen übereinstimmen.',
        notEqual: 'Bitte wählen Sie einen anderen Wert.',
        unique: 'Bitte stellen Sie sicher, dass der Wert eindeutig ist.'
    });
}));
;/**
 * Localization file for Greek - Greece (el-GR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('el-GR', {
        required: 'Το πεδίο αυτό είναι υποχρεωτικό.',
        min: 'Παρακαλώ εισάγετε μια τιμή μεγαλύτερη ή ίση από {0}.',
        max: 'Παρακαλώ εισάγετε μια τιμή μικρότερη ή ίση από {0}.',
        minLength: 'Παρακαλώ εισάγετε τουλάχιστον {0} χαρακτήρες.',
        maxLength: 'Παρακαλώ εισάγετε το πολύ {0} χαρακτήρες.',
        pattern: 'Παρακαλώ ελέγξτε την τιμή αυτή.',
        step: 'Η τιμή πρέπει να αυξηθεί κατά {0}',
        email: 'Η διεύθυνση email δεν έχει έγκυρη μορφή',
        date: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
        dateISO: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
        number: 'Παρακαλώ εισάγετε έναν αριθμό',
        digit: 'Παρακαλώ εισάγετε ένα ψηφίο',
        phoneUS: 'Παρακαλώ εισάγετε έναν σωστό αριθμό τηλεφώνου',
        equal: 'Οι τιμές πρέπει να είναι ίσες',
        notEqual: 'Παρακαλώ επιλέξτε μια άλλη τιμή.',
        unique: 'Παρακαλώ βεβαιωθείτε ότι η τιμή είναι μοναδική.'
    });
}));
;/**
 * Localization file for Spanish - Spain (es-ES)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('es-ES', {
        required: 'Este campo es obligatorio',
        min: 'Por favor, introduzca un valor igual o mayor a {0}',
        max: 'Por favor, introduzca un valor menor o igual a {0}',
        minLength: 'Por favor, introduzca al menos {0} caracteres',
        maxLength: 'Por favor, no introduzca más de {0} caracteres',
        pattern: 'Por favor, compruebe este campo',
        step: 'El valor debe incrementarse por {0}',
        email: 'Este no es una dirección de email correcta',
        date: 'Por favor, introduzca una fecha correcta',
        dateISO: 'Por favor, introduzca una fecha correcta',
        number: 'Por favor, introduzca un número',
        digit: 'Por favor, introduzca un dígito',
        phoneUS: 'Por favor, introduzca un número de teléfono válido para EEUU',
        equal: 'Los valores deben ser iguales',
        notEqual: 'Por favor, elija otro valor',
        unique: 'Por favor, asegurese de que el valor sea único'
    });
}));
;/**
 * Localization file for Farsi - Iran (fa-IR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('fa-IR', {
        required: 'تکمیل این فیلد اجباری است.',
        min: 'لطفاً مقداری بزرگتر یا برابر {0} وارد نمائید.',
        max: 'لطفاً مقداری کوچکتر یا برابر {0} وارد نمائید.',
        minLength: 'لطفاً حداقل {0} حرف وارد نمائید.',
        maxLength: 'لطفاً حداکثر {0} حرف وارد نمائید.',
        pattern: 'لطفاً یک مقدار معتبر وارد نمائید.',
        step: 'مقدار باید با {0} افزایش پبدا کند.',
        email: 'لطفاً یک آدرس ایمیل معتبر وارد نمائید.',
        date: 'لطفاً یک تاریخ معتبر وارد نمائید.',
        dateISO: 'لطفاً یک تاریخ معتبر وارد نمائید.',
        number: 'لطفاً یک عدد وارد نمائید.',
        digit: 'لطفاً یک عدد وارد نمائید.',
        phoneUS: 'لطفاً یک شماره تماس معتبر وارد نمائید.',
        equal: 'مقدارها باید برابر باشند.',
        notEqual: 'لطفاً یک مقدار دیگر وارد نمائید.',
        unique: 'لطفاً یک مقدار منحصربه فرد وارد نمائید.'
    });
}));
;/**
 * Localization file for French - France (fr-FR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('fr-FR', {
        required: 'Ce champ est obligatoire.',
        min: 'Veuillez saisir une valeur supérieure ou égale à {0}.',
        max: 'Veuillez saisir une valeur inférieure ou égale à {0}.',
        minLength: 'Veuillez saisir au moins {0} caractères.',
        maxLength: 'Veuillez saisir au plus {0} caractères.',
        pattern: 'Veuillez corriger ce champ.',
        step: 'Le pas d\'incrémentation de la valeur doit être de {0}.',
        email: 'Ceci n\'est pas une adresse électronique valide.',
        date: 'Veuillez saisir une date valide.',
        dateISO: 'Veuillez saisir une date (ISO) valide.',
        number: 'Veuillez saisir un nombre.',
        digit: 'Veuillez saisir un chiffre.',
        phoneUS: 'Veuillez saisir un numéro de téléphone valide.',
        equal: 'Les valeurs doivent être égales.',
        notEqual: 'Veuillez saisir une autre valeur.',
        unique: 'Veuillez vérifier que la valeur est unique.'
    });
}));
;/**
 * Localization file for Hebrew - Israel (he-IL)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('he-IL', {
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
}));
;/**
 * Localization file for Croatian - Croatia (hr-HR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('hr-HR', {
        required: 'Ovo polje je obavezno.',
        min: 'Unesena vrijednost mora biti jednaka ili veća od {0}.',
        max: 'Unesena vrijednost mora biti jednaka ili manja od {0}.',
        minLength: 'Minimalna dužina polja je {0} znakova.',
        maxLength: 'Maksimalna dužina polja je {0} znakova.',
        pattern: 'Unesena vrijednost nije ispravnog formata.',
        step: 'Vrijednost se mora povećavati za {0}.',
        email: 'Potrebno je unijeti ispravnu e-mail adresu.',
        date: 'Potrebno je unijeti ispravan datum.',
        dateISO: 'Potrebno je unijeti ispravan datum.',
        number: 'Unesena vrijednost mora biti broj.',
        digit: 'Unesena vrijednost mora biti znamenka.',
        phoneUS: 'Potrebno je unijeti ispravan broj telefona.',
        equal: 'Vrijednosti moraju biti jednake.',
        notEqual: 'Unesite drugu vrijednost.',
        unique: 'Unesena vrijednost mora biti jedinstvena.'
    });
}));
;/**
 * Localization file for Hungarian - Hungary (hu-HU)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('hu-HU', {
        required: 'Kötelezõ megadni.',
        min: 'Nem lehet kisebb, mint {0}.',
        max: 'Nem lehet nagyobb, mint {0}.',
        minLength: 'Legalább {0} karaktert adjon meg.',
        maxLength: 'Legfeljebb {0} karaktert adjon meg.',
        pattern: 'Kérem ellenõrizze ezt az értéket.',
        step: 'Az értéknek {0} értékkel kell növekednie.',
        email: 'A megadott email cím nem érvényes.',
        date: 'A megadott dátum nem érvényes.',
        dateISO: 'A megadott dátum nem érvényes.',
        number: 'Kérem számot adjon meg.',
        digit: 'Kérem számjegyet adjon meg.',
        phoneUS: 'Kérem, hogy érvényes telefonszámot adjon meg.',
        equal: 'Az értékeknek meg kel egyezniük.',
        notEqual: 'Az értékeknek különbözniük kell.',
        unique: 'Az értéknek egyedieknek kell lennie.'
    });
}));
;/**
 * Localization file for Italian - Italy (it-IT)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('it-IT', {
        required: 'Il campo è obbligatorio.',
        min: 'Inserire un valore superiore od uguale a {0}.',
        max: 'Inserire un valore inferiore od uguale a {0}.',
        minLength: 'Inserire almeno {0} caratteri.',
        maxLength: 'Inserire al massimo {0} caratteri.',
        pattern: 'Controllare il valore inserito.',
        step: 'Il valore deve essere incrementato di {0}.',
        email: 'Indirizzo email non valido.',
        date: 'Inserire una data valida.',
        dateISO: 'Inserire una data valida.',
        number: 'Inserire un valore numerico.',
        digit: 'Inserire una cifra.',
        phoneUS: 'Specificare un numero di telefono valido.',
        equal: 'I valori devono essere uguali.',
        notEqual: 'Il valore deve essere differente.',
        unique: 'Il valore deve essere univoco.'
    });
}));
;/**
 * Localization file for Japanese - Japan (ja-JP)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('ja-JP', {
        required: 'このフィールドは必須入力項目です。',
        min: '{0}以上の値を入力してください。',
        max: '{0}以下の値を入力してください。',
        minLength: '{0}文字以上の文字を入力してください。',
        maxLength: '{0}文字以下の文字数にしてください。',
        pattern: '入力値を確認してください。',
        step: 'この値は{0}で増加します。',
        email:'適切なe-mailアドレスではありません。',
        date: '適切な日付を入力してください。',
        dateISO: '適切な日付を入力してください。',
        number: '数字を入力してください。',
        digit: '数値を入力してください。',
        phoneUS: '有効な電話番号を指定してください。',
        equal: '同一の値にしてください。',
        notEqual: '他の値を選択してください。',
        unique: '一意の値であることを確認してください。'
    });
}));
;/**
 * Localization file for Korean - Korea (ko-KR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('ko-KR', {
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
}));
;/**
 * Localization file for Latvian - Latvia (lv-LV)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('lv-LV', {
        required: 'Lauks ir obligāts.',
        min: 'Lūdzu, ievadiet vērtību lielāku vai vienādu ar {0}.',
        max: 'Lūdzu, ievadiet vērtību mazāku vai vienādu par {0}.',
        minLength: 'Lūdzu, ievadiet vismaz {0} simbolus.',
        maxLength: 'Lūdzu, ievadiet ne vairāk kā {0} simbolus.',
        pattern: 'Lūdzu, pārbaudiet norādītās vērtības formātu.',
        step: 'Norādītām vērtībām jābūt pieaugošām ar soli {0}',
        email: 'Norādītā e-pasta adrese neatbilst formātam',
        date: 'Lūdzu, norādiet atbilstošu datuma formātu.',
        dateISO: 'Lūdzu, norādiet atbilstošu datuma formātu.',
        number: 'Lūdzu, ievadiet numuru.',
        digit: 'Lūdzu, ievadiet ciparu.',
        phoneUS: 'Lūdzu, norādiet formātam atbilstošu telefona numuru.',
        equal: 'Norādītām vērtībām jābūt vienādām.',
        notEqual: 'Norādītās vērtības nav vienādas.',
        unique: 'Vērtībai jābūt unikālai.'
    });
}));
;/**
 * Localization file for Norwegian (Bokmål) - Norway (nb-NO)
 */
(function(factory) {
    factory(ko.validation);
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
;/**
 * Localization file for Dutch - Belgium (nl-BE)
 */
(function(factory) {
    factory(ko.validation);
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
;/**
 * Localization file for Dutch - The Netherlands (nl-NL)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('nl-NL', {
        required: 'Dit veld is verplicht.',
        min: 'Vul een waarde in groter of gelijk aan {0}.',
        max: 'Vul een waarde in kleiner of gelijk aan {0}.',
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
;/**
 * Localization file for Polish - Poland (pl-PL)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('pl-PL', {
        required: 'To pole jest wymagane.',
        min: 'Wprowadź liczbę więszką lub równą {0}.',
        max: 'Wprowadź liczbę mniejszą lub równą {0}.',
        minLength: 'Wprowadź co najmniej {0} znaków.',
        maxLength: 'Wprowadź co najwyżej {0} znaków.',
        pattern: 'Sprawdź to pole.',
        step: 'Wartość musi być wielokrotnością {0}.',
        email: 'Wprowadź poprawny adres e-mail.',
        date: 'Wprowadź poprawną datę.',
        dateISO: 'Wprowadź poprawną datę.',
        number: 'Wprowadź liczbę.',
        digit: 'Wprowadź cyfrę.',
        phoneUS: 'Wprowadź poprawny numer telefonu.',
        equal: 'Wartości muszą być równe.',
        notEqual: 'Wybierz inną wartość.',
        unique: 'Sprawdź czy wartość jest unikalna.'
    });
}));
;/**
 * Localization file for Portuguese - Brazil (pt-BR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('pt-BR', {
        required: 'Este campo é obrigatório.',
        min: 'Por favor, informe um valor maior ou igual a {0}.',
        max: 'Por favor, informe um valor menor ou igual a {0}.',
        minLength: 'Por favor, informe ao menos {0} caracteres.',
        maxLength: 'Por favor, informe no máximo {0} caracteres.',
        pattern: 'Por favor, verifique este valor',
        step: 'O valor deve ser incrementado por {0}',
        email: 'Por favor, informe um e-mail válido.',
        date: 'Por favor, informe uma data válida.',
        dateISO: 'Por favor, informe uma data válida (ISO).',
        number: 'Por favor, informe um número válido.',
        digit: 'Por favor, utilize somente dígitos.',
        phoneUS: 'Por favor, informe um telefone válido',
        equal: 'Os valores devem ser iguais',
        notEqual: 'Por favor, informe outro valor',
        unique: 'Verifique se o valor é único'
    });
}));
;/**
 * Localization file for Portuguese - Portugal (pt-PT)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('pt-PT', {
        required: 'Este campo é obrigatório.',
        min: 'Por favor, introduza um valor maior ou igual a {0}.',
        max: 'Por favor, introduza um valor menor ou igual a {0}.',
        minLength: 'Por favor, introduza pelo menos {0} caracteres.',
        maxLength: 'Por favor, introduza no máximo {0} caracteres.',
        pattern: 'Por favor, verifique este valor',
        step: 'O valor deve ser incrementado por {0}',
        email: 'Por favor, introduza um e-mail válido.',
        date: 'Por favor, introduza uma data válida.',
        dateISO: 'Por favor, introduza uma data válida (ISO).',
        number: 'Por favor, introduza um número válido.',
        digit: 'Por favor, utilize somente dígitos.',
        phoneUS: 'Por favor, introduza um telefone válido',
        equal: 'Os valores devem ser iguais',
        notEqual: 'Por favor, introduza outro valor',
        unique: 'Verifique se o valor é único'
    });
}));
;/**
 * Localization file for Romanian - Romania (ro-RO)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('ro-RO', {
        required: 'Acest câmp este obligatoriu.',
        min: 'Introduceţi un număr mai mare sau egal cu {0}.',
        max: 'Introduceţi un număr mai mic sau egal cu {0}.',
        minLength: 'Introduceţi cel puţin {0} caractere.',
        maxLength: 'Introduceţi maxim {0} caractere.',
        pattern: 'Verificaţi această valoare.',
        step: 'Valoarea trebuie să crească cu {0}.',
        email: 'Adresa de email nu este validă.',
        date: 'Vă rugăm introduceţi o dată validă.',
        dateISO: 'Vă rugăm introduceţi o dată validă.',
        number: 'Introduceţi un număr.',
        digit: 'Introduceţi o cifră.',
        phoneUS: 'Vă rugăm să specificați un număr de telefon valid.',
        equal: 'Valorile trebuie să fie egale.',
        notEqual: 'Vă rugăm să alegeți o altă valoare.',
        unique: 'Vă rugăm să vă asigurați că valoarea este unică.'
    });
}));
;/**
 * Localization file for Russian - Russia (ru-RU)
 */
(function(factory) {
    factory(ko.validation);
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
;/**
 * Localization file for Swedish - Sweden (sv-SE)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('sv-SE', {
        required: 'Detta fält är obligatoriskt',
        min: 'Fyll i ett värde som är större än eller lika med {0}',
        max: 'Fyll i ett värde som är mindre än eller lika med {0}',
        minLength: 'Fyll i minst {0} tecken',
        maxLength: 'Fyll inte i fler än {0} tecken',
        pattern: 'Var god kontrollera värdet',
        step: 'Värdet måste ökas med {0}',
        email: 'Fyll i en korrekt e-postadress',
        date: 'Fyll i ett korrekt datum',
        dateISO: 'Fyll i ett korrekt datum',
        number: 'Fyll i ett nummer',
        digit: 'Fyll i en siffra',
        phoneUS: 'Fyll i ett korrekt telefonnummer',
        equal: 'Fyll i samma värde en gång till',
        notEqual: 'Fyll i ett annat värde',
        unique: 'Fyll i ett unikt värde'
    });
}));
;/**
 * Localization file for Turkish - Turkey (tr-TR)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('tr-TR', {
        required: 'Bu alanın doldurulması zorunludur.',
        min: 'Lütfen {0} veya daha yüksek değer giriniz.',
        max: 'Lütfen {0} veya daha düşük değer giriniz.',
        minLength: 'Lütfen en az {0} karakter giriniz.',
        maxLength: 'Lütfen en fazla {0} karakter giriniz.',
        pattern: 'Lütfen bu alanı kontrol ediniz.',
        step: 'Değer {0} arttırılmalı.',
        email: 'Bu geçerli bir E-Mail adresi değil.',
        date: 'Lütfen geçerli bir tarih giriniz.',
        dateISO: 'Lütfen geçerli bir tarih giriniz.',
        number: 'Lütfen bir sayı değeri giriniz.',
        digit: 'Lütfen bir rakam değeri giriniz.',
        phoneUS: 'Lütfen geçerli bir telefon numarası giriniz.',
        equal: 'Değerler eşit olmalıdır.',
        notEqual: 'Lütfen farklı bir değer seçiniz.',
        unique: 'Lütfen değerin farklı olduğunu kontrol ediniz.'
    });
}));
;/**
 * Localization file for Ukrainian - Ukraine (uk-UA)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
	return kv.defineLocale('uk-UA', {
	    required: 'Будь ласка, заповніть це поле.',
	    min: 'Будь ласка, введіть число більше або рівне {0}.',
	    max: 'Будь ласка, введіть число менше або рівне {0}.',
	    minLength: 'Будь ласка, введіть принаймні {0} символів.',
	    maxLength: 'Будь ласка, введіть не більше як {0} символів.',
	    pattern: 'Будь ласка, перевірте це поле.',
	    step: 'Значення має бути кратним {0}',
	    email: 'Будь ласка, вкажіть тут правильну адресу електронної пошти',
	    date: 'Будь ласка, введіть правильну',
	    dateISO: 'Будь ласка, введіть правильну дату у форматі ISO',
	    number: 'Будь ласка, введіть число',
	    digit: 'Будь ласка, введіть цифри',
	    phoneUS: 'Будь ласка, вкажіть правильний телефонний номер',
	    equal: 'Значення повинні бути рівні',
	    notEqual: 'Будь ласка, виберіть інше значення.',
	    unique: 'Будь ласка, вкажіть унікальне значення.'
	});
}));
;/**
 * Localization file for Chinese - China (zh-CN)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('zh-CN', {
        required: '必填字段',
        min: '输入值必须大于等于 {0}',
        max: '输入值必须小于等于 {0}',
        minLength: '至少输入 {0} 个字符',
        maxLength: '输入的字符数不能超过 {0} 个',
        pattern: '请检查此值',
        step: '每次步进值是 {0}',
        email: 'email地址格式不正确',
        date: '日期格式不正确',
        dateISO: '日期格式不正确',
        number: '请输入一个数字',
        digit: '请输入一个数字',
        phoneUS: '请输入一个合法的手机号(US)',
        equal: '输入值不一样',
        notEqual: '请选择另一个值',
        unique: '此值应该是唯一的'
    });
}));
;/**
 * Localization file for Chinese - Taiwan (zh-TW)
 */
(function(factory) {
    factory(ko.validation);
}(function(kv) {
    return kv.defineLocale('zh-TW', {
        required: '此欄位為必填欄位',
        min: '輸入值必須大於等於 {0}',
        max: '輸入值必須小於等於 {0}',
        minLength: '請至少輸入 {0} 個字元',
        maxLength: '最大長度為 {0} 個字元',
        pattern: '請檢查此值',
        step: '每次遞增值是 {0}',
        email: 'email格式不正確',
        date: '日期格式不正確',
        dateISO: '日期格式不正確',
        number: '請輸入一組數字',
        digit: '請輸入一組數字',
        phoneUS: '請輸入一組有效的電話號碼(US)',
        equal: '兩次輸入值不相同',
        notEqual: '請選擇其他數值',
        unique: '請確認此值為唯一值'
    });
}));
;}));