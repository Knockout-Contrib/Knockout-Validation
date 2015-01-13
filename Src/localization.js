
//quick function to override rule messages
ko.validation.localize = function (msgTranslations) {
	var rules = ko.validation.rules;

	//loop the properties in the object and assign the msg to the rule
	for (var ruleName in msgTranslations) {
		if (rules.hasOwnProperty(ruleName)) {
			rules[ruleName].message = msgTranslations[ruleName];
		}
	}
};
