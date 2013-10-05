
//quick function to override rule messages
ko.validation.localize = function (msgTranslations) {

	var msg, rule;

	//loop the properties in the object and assign the msg to the rule
	for (rule in msgTranslations) {
		if (ko.validation.rules.hasOwnProperty(rule)) {
			ko.validation.rules[rule].message = msgTranslations[rule];
		}
	}
};