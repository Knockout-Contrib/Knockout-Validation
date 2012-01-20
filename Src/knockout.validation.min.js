(function () {
    if (void 0 === typeof ko) throw "Knockout is required, please ensure it is loaded before loading this validation plug-in"; var g = { registerExtenders: !0, messagesOnModified: !0, messageTemplate: null, insertMessages: !0, parseInputAttributes: !1, errorMessageClass: "validationMessage" }, h = ["required", "pattern", "min", "max", "step"], i = function (a) { window.setImmediate ? window.setImmediate(a) : window.setTimeout(a, 0) }, f = function () {
        var a = (new Date).getTime(); return { isArray: function (a) {
            return a.isArray || "[object Array]" ===
Object.prototype.toString.call(a)
        }, isObject: function (a) { return null !== a && "object" === typeof a }, values: function (a) { var c = [], e; for (e in a) a.hasOwnProperty(e) && c.push(a[e]); return c }, hasAttribute: function (a, c) { return null !== a.getAttribute(c) }, isValidatable: function (a) { return a.rules && a.isValid && a.isModified }, insertAfter: function (a, c) { a.parentNode.insertBefore(c, a.nextSibling) }, extend: function (a, c, e) {
            if (!c) return a; for (var d in c) f.isObject(c[d]) ? (a[d] || (a[d] = {}), f.extend(a[d], c[d])) : a[d] = c[d]; e && f.extend(a,
e); return a
        }, newId: function () { return a += 1 } 
        }
    } (); ko.validation = { init: function (a) { f.extend(g, a); g.registerExtenders && ko.validation.registerExtenders(); ko.validation.registerValueBindingHandler() }, configure: function (a) { ko.validation.init(a) }, group: function (a) {
        var a = f.isArray(a) ? a : f.values(a), b = ko.utils.arrayFilter(a, function (a) { return ko.isObservable(a) ? (a.extend({ validatable: !0 }), !0) : !1 }), a = ko.dependentObservable(function () {
            var a = []; ko.utils.arrayForEach(b, function (b) { b.isValid() || a.push(b.error) });
            return a
        }); a.showAllMessages = function () { ko.utils.arrayForEach(b, function (a) { a.isModified(!0) }) }; return a
    }, formatMessage: function (a, b) { return a.replace("{0}", b) }, addRule: function (a, b) { a.extend({ validatable: !0 }); a.rules.push(b); return a }, addAnonymousRule: function (a, b) { var c = f.newId(); ko.validation.rules[c] = { validator: b.validator, message: b.message || "Error" }; ko.validation.addRule(a, { rule: c, params: b.params }) }, addExtender: function (a) {
        ko.extenders[a] = function (b, c) {
            return c.message ? ko.validation.addRule(b,
{ rule: a, message: c.message, params: c.params || !0 }) : ko.validation.addRule(b, { rule: a, params: c })
        } 
    }, registerExtenders: function () { if (g.registerExtenders) for (var a in ko.validation.rules) ko.validation.rules.hasOwnProperty(a) && (ko.extenders[a] || ko.validation.addExtender(a)) }, insertValidationMessage: function (a) { var b = document.createElement("SPAN"); b.className = g.errorMessageClass; f.insertAfter(a, b); return b }, parseInputValidationAttributes: function (a, b) {
        ko.utils.arrayForEach(h, function (c) {
            f.hasAttribute(a, c) &&
ko.validation.addRule(b(), { rule: c, params: a.getAttribute(c) || !0 })
        })
    }, registerValueBindingHandler: function () {
        var a = ko.bindingHandlers.value.init; ko.bindingHandlers.value.init = function (b, c, e, d, j) {
            a(b, c, e); e = f.extend({}, g, j.$data.$validation); e.parseInputAttributes && i(function () { ko.validation.parseInputValidationAttributes(b, c) }); e.insertMessages && f.isValidatable(c()) && (d = ko.validation.insertValidationMessage(b), e.messageTemplate ? ko.renderTemplate(e.messageTemplate, { field: c() }, null, d, "replaceNode") : ko.applyBindingsToNode(d,
{ validationMessage: c() }))
        } 
    } 
    }; ko.validation.utils = f; ko.validation.rules = {}; ko.validation.rules.required = { validator: function (a, b) { return b && a && 0 < (a + "").length }, message: "This field is required." }; ko.validation.rules.min = { validator: function (a, b) { return !a || a >= b }, message: "Please enter a value greater than or equal to {0}." }; ko.validation.rules.max = { validator: function (a, b) { return !a || a <= b }, message: "Please enter a value less than or equal to {0}." }; ko.validation.rules.minLength = { validator: function (a, b) {
        return a &&
a.length >= b
    }, message: "Please enter at least {0} characters."
    }; ko.validation.rules.maxLength = { validator: function (a, b) { return !a || a.length <= b }, message: "Please enter no more than {0} characters." }; ko.validation.rules.pattern = { validator: function (a, b) { return !a || null != a.match(b) }, message: "Please check this value." }; ko.validation.rules.step = { validator: function (a, b) { return 0 === a % b }, message: "The value must increment by {0}" }; ko.bindingHandlers.validationMessage = { update: function (a, b) {
        var c = b(); c.extend({ validatable: !0 });
        ko.bindingHandlers.text.update(a, function () { return !g.messagesOnModified || c.isModified() ? c.isValid() ? null : c.error : null })
    } 
    }; ko.bindingHandlers.validationOptions = { makeValueAccessor: function (a, b) { return function () { var c = { $validation: a() }; return f.extend({}, c, b.$data) } }, init: function (a, b, c, e, d) { b = ko.bindingHandlers.validationOptions.makeValueAccessor(b, d); return ko.bindingHandlers["with"].init(a, b, c, e, d) }, update: function (a, b, c, e, d) {
        b = ko.bindingHandlers.validationOptions.makeValueAccessor(b, d); return ko.bindingHandlers["with"].update(a,
b, c, e, d)
    } 
    }; ko.extenders.validation = function (a, b) { ko.utils.arrayForEach(f.isArray(b) ? b : [b], function (b) { ko.validation.addAnonymousRule(a, b) }); return a }; ko.extenders.validatable = function (a, b) {
        if (b && !f.isValidatable(a)) a.error = null, a.rules = ko.observableArray(), a.isValid = ko.dependentObservable(function () {
            for (var b = 0, e, d, f = a.rules(), g = f.length; b < g; b++) if (d = f[b], e = ko.validation.rules[d.rule], !e.validator(a(), d.params || !0)) return a.error = ko.validation.formatMessage(d.message || e.message, d.params), !1; a.error =
null; return !0
        }), a.isModified = ko.observable(!1), a.subscribe(function () { a.isModified(!0) }); return a
    }; ko.validation.rules.email = { validator: function (a, b) { return b && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a) },
        message: "{0} is not a proper email address"
    }; ko.validation.rules.date = { validator: function (a, b) { return b && !/Invalid|NaN/.test(new Date(a)) }, message: "Please enter a proper date" }; ko.validation.rules.dateISO = { validator: function (a, b) { return b && /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a) }, message: "Please enter a proper date" }; ko.validation.rules.number = { validator: function (a, b) { return b && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a) }, message: "Please enter a number" }; ko.validation.rules.digits = { validator: function (a,
b) { return b && /^\d+$/.test(a) }, message: "Please enter a digit"
    }; ko.validation.rules.phoneUS = { validator: function (a, b) { if ("string" !== typeof a) return !1; a = a.replace(/\s+/g, ""); return b && 9 < a.length && a.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/) }, message: "Please specify a valid phone number" }; ko.validatedObservable = function (a) {
        if (!ko.validation.utils.isObject(a)) return ko.observable(a).extend({ validatable: !0 }); var b = ko.observable(a); b.errors = ko.validation.group(a); b.isValid = ko.dependentObservable(function () {
            return 0 ===
b.errors().length
        }); return b
    } 
})();