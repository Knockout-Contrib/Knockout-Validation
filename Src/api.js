﻿var api = (function () {

	var isInitialized = 0,
		configuration = ko.validation.configuration,
		utils = ko.validation.utils;


	function collectErrors(array) {
		var errors = [];
		ko.utils.arrayForEach(array, function (observable) {
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

			ko.utils.extend(configuration, options);

			if (configuration.registerExtenders) {
				ko.validation.registerExtenders();
			}

			isInitialized = 1;
		},
		// backwards compatability
		configure: function (options) {
			ko.validation.init(options);
		},

		// resets the config back to its original state
		reset: ko.validation.configuration.reset,

		// recursivly walks a viewModel and creates an object that
		// provides validation information for the entire viewModel
		// obj -> the viewModel to walk
		// options -> {
		//      deep: false, // if true, will walk past the first level of viewModel properties
		//      observable: false // if true, returns a computed observable indicating if the viewModel is valid
		// }
		model: function (model, options) { // array of observables or viewModel
			options = ko.utils.extend(ko.utils.extend({}, configuration.grouping), options);

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
			return ko.utils.extend({
				isValid: isValid,

				errors: collectedErrors,

				markAsModified: function (state) {
					var isModified = arguments.length === 0 || state;
					ko.utils.arrayForEach(observables, function (observable) {
						observable.isModified(isModified);
					});
				},

				isAnyInvalidModified: function () {
					return !!ko.utils.arrayFirst(observables, function (observable) {
						return !observable.isValid() && observable.isModified();
					});
				}
			}, model);
		},

		formatMessage: function (message, params) {
			if (typeof (message) === 'function') {
				return message(params);
			}
			return message.replace(/\{0\}/gi, ko.utils.unwrapObservable(params));
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
			if (ruleObj['message'] === undefined) {
				ruleObj['message'] = 'Error';
			}

			//add the anonymous rule to the observable
			ko.validation.addRule(observable, ruleObj);
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
					return ko.validation.addRule(observable, {
						rule: ruleName,
						message: params.message,
						params: utils.isEmptyVal(params.params) ? true : params.params,
						condition: params.onlyIf
					});
				} else {
					return ko.validation.addRule(observable, {
						rule: ruleName,
						params: params
					});
				}
			};
		},

		// loops through all ko.validation.rules and adds them as extenders to
		// ko.extenders
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
			ko.utils.arrayForEach(ko.validation.configuration.html5Attributes, function (attr) {
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
                
					ko.validation.addRule(valueAccessor(), {
						rule: attr,
						params: params
					});
				}
			});

			var currentType = element.getAttribute('type');
			ko.utils.arrayForEach(ko.validation.configuration.html5InputTypes, function (type) {
				if (type === currentType) {
					ko.validation.addRule(valueAccessor(), {
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
			ko.utils.arrayForEach(ko.validation.configuration.html5Attributes, function (attr) {
				var params;
				var ctx = ko.utils.arrayFirst(contexts, function (ctx) {
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
						unwrappedTargetValue = ko.utils.unwrapObservable(targetValue),
						rules = {},
						nonRules = {};

					for (var rule in ruleDefinitions) {
						if (!ruleDefinitions.hasOwnProperty(rule)) { continue; }
						if (ko.validation.rules[rule]) {
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
ko.utils.extend(ko.validation, api);