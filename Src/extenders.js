(function () {
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
		ko.utils.arrayForEach(ko.validation.utils.isArray(rules) ? rules : [rules], function (rule) {
			// the 'rule' being passed in here has no name to identify a core Rule,
			// so we add it as an anonymous rule
			// If the developer is wanting to use a core Rule, but use a different message see the 'addExtender' logic for examples
			ko.validation.addAnonymousRule(observable, rule);
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
		if (!ko.validation.utils.isObject(options)) {
			options = { enable: options };
		}

		if (!('enable' in options)) {
			options.enable = true;
		}

		if (options.enable && !ko.validation.utils.isValidatable(observable)) {
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
				ko.validation.process(observable);
			});

			var config = ko.validation.configuration.validate;
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
		var params = ko.utils.unwrapObservable(typeof ctx.params === "undefined" ? true : ctx.params);
		//Execute the validator and see if its valid
		if (!rule.validator(observable(), params)) {
			//not valid, so format the error message and stick it in the 'error' variable
			observable.error(ko.validation.formatMessage(ctx.message || rule.message, params));
			return false;
		}
		return true;
	}

	function validateAsync(observable, rule, ctx) {
		var params = ko.utils.unwrapObservable(ctx.params || true);

		observable.isValidating(true);
		//fire the validator and hand it the callback
		rule.validator(observable(), params, function (validationResult) {
			if (observable.isValid()) {
				var message, isValid = validationResult;

				//we were handed back a complex object
				if (ko.validation.utils.isObject(validationResult)) {
					isValid = validationResult.isValid;
					message = validationResult.message || '';
				}

				if (!isValid) {
					observable.error(ko.validation.formatMessage(message || ctx.message || rule.message, params));
				}
			}

			// since we're returning early, make sure we turn this off
			observable.isValidating(false);
		});
	}

	ko.validation.process = function (observable) {
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
			rule = ctx.rule ? ko.validation.rules[ctx.rule] : ctx;

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
