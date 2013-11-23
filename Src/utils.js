ko.validation.utils = (function () {
	var seedId = new Date().getTime();

	var domData = {}; //hash of data objects that we reference from dom elements
	var domDataKey = '__ko_validation__';

	var utils = {
		isArray: function (o) {
			return o.isArray || Object.prototype.toString.call(o) === '[object Array]';
		},
		isObject: function (o) {
			return o !== null && typeof o === 'object';
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
			var node = element, options;
			do {
				options = utils.contextFor(node, true);
				node = node.parentNode;
			} while (node && !options);

			return options || ko.validation.configuration;
		},
		setDomData: function (node, data) {
			var key = node[domDataKey];

			if (!key) {
				node[domDataKey] = key = utils.newId();
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
		contextFor: function (node, checkOnlyNode) {
			switch (node.nodeType) {
				case 1:
				case 8:
					var context = utils.getDomData(node);
					if (context) { return context; }
					if (!checkOnlyNode && node.parentNode) { return utils.contextFor(node.parentNode); }
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
			var savedOriginalTitle = utils.getAttribute(element, 'data-orig-title'),
				currentTitle = element.title,
				hasSavedOriginalTitle = utils.hasAttribute(element, 'data-orig-title');

			return hasSavedOriginalTitle ?
				savedOriginalTitle : currentTitle;
		},
		async: function (expr) {
			if (window.setImmediate) { window.setImmediate(expr); }
			else { window.setTimeout(expr, 0); }
		},
		forEach: function (object, callback) {
			if (utils.isArray(object)) {
				return ko.utils.arrayForEach(object, callback);
			}
			for (var prop in object) {
				if (object.hasOwnProperty(prop)) {
					callback(object[prop], prop);
				}
			}
		},

		observablesOf: function (obj, callback, options, level) {
			var result = [];

			if (obj.__kv_traversed === true) {
				return result;
			}

			if (options.deep) {
				if (!options.flagged) {
					options.flagged = [];
				}

		    obj.__kv_traversed = true;
		    options.flagged.push(obj);
			}

			//default level value depends on deep option.
			if (typeof level === "undefined") {
				level = options.deep ? 1 : -1;
			}

			if (ko.isObservable(obj)) {
				callback(obj, result);
			}

			//process recurisvely if it is deep grouping
			if (level !== 0) {
				var values, val = ko.utils.unwrapObservable(obj);

				if (val && (utils.isArray(val) || utils.isObject(val))) {
					values = val;
				} else {
					values = [];
				}

				utils.forEach(values, function (observable) {
					//but not falsy things and not HTML Elements
					if (observable && !observable.nodeType) {
						result.push.apply(result, utils.observablesOf(observable, callback, options, level + 1));
					}
				});
			}

			if (level === 1 && options.deep) {
				// remove flags from objects
				var i = options.flagged.length;
				while (i--) {
					delete options.flagged[i].__kv_traversed;
				}
	      options.flagged.length = 0;
	      delete options.flagged;
			}

			return result;
		}
	};

	return utils;
})();
