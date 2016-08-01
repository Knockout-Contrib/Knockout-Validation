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

function validateSync(observable, rule, ctx) {
	//Execute the validator and see if its valid
	if (!rule.validator(observable(), (ctx.params === undefined ? true : ko.utils.unwrapObservable(ctx.params)))) { // default param is true, eg. required = true

		//not valid, so format the error message and stick it in the 'error' variable
		return ko.validation.formatMessage(
			ctx.message || rule.message,
			ko.utils.unwrapObservable(ctx.params),
			observable
		);
	}
	return null;
}

function validateAsync(observable, rule, ctx) {
	observable.__isValidatingAsync(true);

	var callback = function (valObj) {
		var isValid = false,
			msg = '';

		if (observable.__errorManual() || observable.__errorSync()) {

			// since we're returning early, make sure we turn this off
			observable.__isValidatingAsync(false);

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
			observable.__errorAsync(
				ko.validation.formatMessage(
					msg || ctx.message || rule.message,
					ko.utils.unwrapObservable(ctx.params),
					observable
				)
			);
		}

		// tell it that we're done
		observable.__isValidatingAsync(false);
	};

	ko.validation.utils.async(function() {
		//fire the validator and hand it the callback
		rule.validator(
			observable(),
			ctx.params === undefined ? true : ko.utils.unwrapObservable(ctx.params),
			callback
		);
	});
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

	options = ko.utils.extend(ko.utils.extend({
		enable: true,
	}, ko.validation.configuration.validate), options);

	if (options.enable && !ko.validation.utils.isValidatable(observable)) {
		var validationOptions = {
			throttleEvaluation : options.throttle,
		};

		// holds an error set by setError (and cleared by clearError)
		observable.__errorManual = ko.observable(null);

		// holds an error from synchronous validation rules
		observable.__errorSync = ko.pureComputed(function () {
			var i,
				rule, // the rule validator to execute
				ctx, // the current Rule Context for the loop
				ruleContexts = observable.rules(), //cache for iterator
				len = ruleContexts.length, //cache for iterator
				error = null;

			for (i = 0; i < len; i++) {

				//get the Rule Context info to give to the core Rule
				ctx = ruleContexts[i];

				// checks an 'onlyIf' condition
				if (ctx.condition && !ctx.condition()) {
					continue;
				}

				//get the core Rule to use for validation
				rule = ctx.rule ? ko.validation.rules[ctx.rule] : ctx;

				if (rule['async'] || ctx['async']) {
					// skip async rules
					continue;

				} else {
					//run normal sync validation
					error = validateSync(observable, rule, ctx);
					if (error) {
						return error; //break out of the loop
					}
				}
			}

			// all sync rules are satisfied, fire async validation
			(function () {
				for (i = 0; i < len; i++) {

					//get the Rule Context info to give to the core Rule
					ctx = ruleContexts[i];

					// checks an 'onlyIf' condition
					if (ctx.condition && !ctx.condition()) {
						continue;
					}

					//get the core Rule to use for validation
					rule = ctx.rule ? ko.validation.rules[ctx.rule] : ctx;

					if (rule['async'] || ctx['async']) {
						validateAsync(observable, rule, ctx);

					} else {
						// skip sync rules
						continue;
					}
				}
			}());

			return null;
		});

		ko.utils.extend(observable.__errorSync, validationOptions);

		// holds an error from asynchronous validation rules
		observable.__errorAsync = ko.observable(null);
		// is async validation currently running
		observable.__isValidatingAsync = ko.observable(false);

		// holds the overall error message
		observable.error = ko.pureComputed(function () {
			return observable.__errorManual() || observable.__errorSync() || observable.__errorAsync() || null;
		});

		// readonly overall validity status
		observable.isValid = ko.pureComputed(function () {
			return !observable.error();
		});

		// readonly "async validation is running"
		observable.isValidating = ko.pureComputed(observable.__isValidatingAsync);

		// observable.rules:
		// ObservableArray of Rule Contexts, where a Rule Context is simply the name of a rule and the params to supply to it
		//
		// Rule Context = { rule: '<rule name>', params: '<passed in params>', message: '<Override of default Message>' }
		observable.rules = ko.observableArray(); //holds the rule Contexts to use as part of validation

		// this could also be called `isMessageVisible`
		observable.isModified = ko.observable(false);

		//manually set error state
		observable.setError = function (error) {
			observable.__errorManual(error);
			return observable;
		};

		//manually clear error state
		observable.clearError = function () {
			observable.__errorManual(null);
			return observable;
		};

		var h_change;
		if (options.setModifiedOnChange) {
			//subscribe to changes in the observable
			h_change = observable.subscribe(function () {
				observable.isModified(true);
			});
		}

		observable._disposeValidation = function () {
			// first dispose of the subscriptions
			observable.rules.removeAll();
			observable.clearError();
			observable.__errorSync.dispose();
			observable.error.dispose();
			observable.isValid.dispose();
			observable.isValidating.dispose();

			if (h_change) {
				h_change.dispose();
			}

			delete observable.__errorManual;
			delete observable.__errorSync;
			delete observable.__errorAsync;
			delete observable.__isValidatingAsync;
			delete observable.error;
			delete observable.isValid;
			delete observable.isValidating;
			delete observable.rules;
			delete observable.isModified;
			delete observable.setError;
			delete observable.clearError;
			delete observable._disposeValidation;
		};
	} else if (options.enable === false && observable._disposeValidation) {
		observable._disposeValidation();
	}
	return observable;
};

ko.validation.validateObservable = function (observable) {
	return observable.isValid();
};

