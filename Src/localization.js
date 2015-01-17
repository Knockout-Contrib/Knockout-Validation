
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
//hash to contain all translations
ko.validation.localizations = {};
//function to switch between languages
ko.validation.locale = function(iso) {
  var lang = ko.validation.localizations[iso];
  if (!lang) {
    throw new Error(iso+" is not a defined language");
  }
  ko.validation.localize(lang);
};
