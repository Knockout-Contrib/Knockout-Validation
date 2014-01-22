ko.applyBindingsWithValidation = function (viewModel, rootNode, options) {
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

	ko.validation.init();

	if (config) { ko.validation.utils.setDomData(node, config); }

	ko.applyBindings(viewModel, rootNode);
};

//override the original applyBindings so that we can ensure all new rules and what not are correctly registered
var origApplyBindings = ko.applyBindings;
ko.applyBindings = function (viewModel, rootNode) {

	ko.validation.init();

	origApplyBindings(viewModel, rootNode);
};

ko.validatedObservable = function (initialValue) {
	if (!ko.validation.utils.isObject(initialValue)) { return ko.observable(initialValue).extend({ validatable: true }); }

	var obsv = ko.observable(initialValue);
	obsv.errors = ko.validation.group(initialValue);
	obsv.isValid = ko.observable(initialValue.isValid());	
	obsv.errors.subscribe(function (errors) {
		obsv.isValid(errors.length === 0);
	});

	return obsv;
};
