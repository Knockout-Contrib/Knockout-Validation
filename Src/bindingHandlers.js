// The core binding handler
// this allows us to setup any value binding that internally always
// performs the same functionality
ko.bindingHandlers['validationCore'] = (function () {

	return {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var config = ko.validation.utils.getConfigOptions(element);

			// parse html5 input validation attributes, optional feature
			if (config.parseInputAttributes) {
				ko.validation.utils.async(function () { ko.validation.parseInputValidationAttributes(element, valueAccessor); });
			}

			// if requested insert message element and apply bindings
			if (config.insertMessages && ko.validation.utils.isValidatable(valueAccessor())) {

				// insert the <span></span>
				var validationMessageElement = ko.validation.insertValidationMessage(element);

				// if we're told to use a template, make sure that gets rendered
				if (config.messageTemplate) {
					ko.renderTemplate(config.messageTemplate, { field: valueAccessor() }, null, validationMessageElement, 'replaceNode');
				} else {
					ko.applyBindingsToNode(validationMessageElement, { validationMessage: valueAccessor() });
				}
			}

			// write the html5 attributes if indicated by the config
			if (config.writeInputAttributes && ko.validation.utils.isValidatable(valueAccessor())) {

				ko.validation.writeInputValidationAttributes(element, valueAccessor);
			}

			// if requested, add binding to decorate element
			if (config.decorateElement && ko.validation.utils.isValidatable(valueAccessor())) {
				ko.applyBindingsToNode(element, { validationElement: valueAccessor() });
			}
		},

		update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			// hook for future extensibility
		}
	};

}());

// override for KO's default 'value' and 'checked' bindings
ko.validation.makeBindingHandlerValidatable("value");
ko.validation.makeBindingHandlerValidatable("checked");


ko.bindingHandlers['validationMessage'] = { // individual error message, if modified or post binding
	update: function (element, valueAccessor) {
		var obsv = valueAccessor(),
			config = ko.validation.utils.getConfigOptions(element),
			val = ko.utils.unwrapObservable(obsv),
			msg = null,
			isModified = false,
			isValid = false;

		obsv.extend({ validatable: true });

		isModified = obsv.isModified();
		isValid = obsv.isValid();

		// create a handler to correctly return an error message
		var errorMsgAccessor = function () {
			if (!config.messagesOnModified || isModified) {
				return isValid ? null : obsv.error;
			} else {
				return null;
			}
		};

		//toggle visibility on validation messages when validation hasn't been evaluated, or when the object isValid
		var visiblityAccessor = function () {
			return (!config.messagesOnModified || isModified) ? !isValid : false;
		};

		ko.bindingHandlers.text.update(element, errorMsgAccessor);
		ko.bindingHandlers.visible.update(element, visiblityAccessor);
	}
};

ko.bindingHandlers['validationElement'] = {
	update: function (element, valueAccessor) {
		var obsv = valueAccessor(),
			config = ko.validation.utils.getConfigOptions(element),
			val = ko.utils.unwrapObservable(obsv),
			msg = null,
			isModified = false,
			isValid = false;

		obsv.extend({ validatable: true });

		isModified = obsv.isModified();
		isValid = obsv.isValid();

		// create an evaluator function that will return something like:
		// css: { validationElement: true }
		var cssSettingsAccessor = function () {
			var css = {};

			var shouldShow = ((!config.decorateElementOnModified || isModified) ? !isValid : false);

			if (!config.decorateElement) { shouldShow = false; }

			// css: { validationElement: false }
			css[config.errorElementClass] = shouldShow;

			return css;
		};

		//add or remove class on the element;
		ko.bindingHandlers.css.update(element, cssSettingsAccessor);
		if (!config.errorsAsTitle) { return; }

		var origTitle = ko.validation.utils.getAttribute(element, 'data-orig-title'),
			elementTitle = element.title,
			titleIsErrorMsg = ko.validation.utils.getAttribute(element, 'data-orig-title') === "true";

		var errorMsgTitleAccessor = function () {
			if (!config.errorsAsTitleOnModified || isModified) {
				if (!isValid) {
					return { title: obsv.error, 'data-orig-title': ko.validation.utils.getOriginalElementTitle(element) };
				} else {
					return { title: ko.validation.utils.getOriginalElementTitle(element), 'data-orig-title': null };
				}
			}
		};
		ko.bindingHandlers.attr.update(element, errorMsgTitleAccessor);
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
			var options = ko.utils.unwrapObservable(valueAccessor());
			if (options) {
				var newConfig = ko.utils.extend({}, ko.validation.configuration);
				ko.utils.extend(newConfig, options);

				//store the validation options on the node so we can retrieve it later
				ko.validation.utils.setDomData(element, newConfig);
			}
		}
	};
}());
