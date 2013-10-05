var api = (function () {

	var isInitialized = 0,
		configuration = ko.validation.configuration,
		utils = ko.validation.utils;

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
		configure: function (options) { ko.validation.init(options); },

		// resets the config back to its original state
		reset: ko.validation.configuration.reset,

		// recursivly walks a viewModel and creates an object that
		// provides validation information for the entire viewModel
		// obj -> the viewModel to walk
		// options -> {
		//      deep: false, // if true, will walk past the first level of viewModel properties
		//      observable: false // if true, returns a computed observable indicating if the viewModel is valid
		// }
		group: function group(obj, options) { // array of observables or viewModel
			options = ko.utils.extend(ko.utils.extend({}, configuration.grouping), options);

			var validatables = ko.observableArray([]),
			result = null,

			//anonymous, immediate function to traverse objects hierarchically
			//if !options.deep then it will stop on top level
			traverse = function traverse(obj, level) {
				var objValues = [],
					val = ko.utils.unwrapObservable(obj);

				//default level value depends on deep option.
				level = (level !== undefined ? level : options.deep ? 1 : -1);

				// if object is observable then add it to the list
				if (ko.isObservable(obj)) {

					//make sure it is validatable object
					if (!obj.isValid) { obj.extend({ validatable: true }); }
					validatables.push(obj);
				}

				//get list of values either from array or object but ignore non-objects
				if (val) {
					if (utils.isArray(val)) {
						objValues = val;
					} else if (utils.isObject(val)) {
						objValues = utils.values(val);
					}
				}

				//process recurisvely if it is deep grouping
				if (level !== 0) {
					ko.utils.arrayForEach(objValues, function (observable) {

						//but not falsy things and not HTML Elements
						if (observable && !observable.nodeType) { traverse(observable, level + 1); }
					});
				}
			};

			//if using observables then traverse structure once and add observables
			if (options.observable) {

				traverse(obj);

				result = ko.computed(function () {
					var errors = [];
					ko.utils.arrayForEach(validatables(), function (observable) {
						if (!observable.isValid()) {
							errors.push(observable.error);
						}
					});
					return errors;
				});

			} else { //if not using observables then every call to error() should traverse the structure
				result = function () {
					var errors = [];
					validatables([]); //clear validatables
					traverse(obj); // and traverse tree again
					ko.utils.arrayForEach(validatables(), function (observable) {
						if (!observable.isValid()) {
							errors.push(observable.error);
						}
					});
					return errors;
				};


			}

			result.showAllMessages = function (show) { // thanks @heliosPortal
				if (show === undefined) {//default to true
					show = true;
				}

				// ensure we have latest changes
				result();

				ko.utils.arrayForEach(validatables(), function (observable) {
					observable.isModified(show);
				});
			};

			obj.errors = result;
			obj.isValid = function () {
				return obj.errors().length === 0;
			};
			obj.isAnyMessageShown = function () {
				var invalidAndModifiedPresent = false;

				// ensure we have latest changes
				result();

				ko.utils.arrayForEach(validatables(), function (observable) {
					if (!observable.isValid() && observable.isModified()) {
						invalidAndModifiedPresent = true;
					}
				});
				return invalidAndModifiedPresent;
			};

			return result;
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
			var ruleName = utils.newId();

			if (ruleObj['message'] === undefined) {
				ruleObj['message'] = 'Error';
			}

			//Create an anonymous rule to reference
			ko.validation.rules[ruleName] = ruleObj;

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
				if (params.message || params.onlyIf) { //if it has a message or condition object, then its an object literal to use
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
					ko.validation.addRule(valueAccessor(), {
						rule: attr,
						params: element.getAttribute(attr) || true
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

				return ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
			};
		}
	};
}());

// expose api publicly
ko.utils.extend(ko.validation, api);