/**
 * Localization file for Spanish - Spain (es-ES)
 */
(function(factory) {
	// Module systems magic dance.
	/*global require,ko.validation,define,module*/
	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
		// CommonJS or Node
        module.exports = factory(require('../'));
	} else if (typeof define === 'function' && define['amd']) {
		// AMD anonymous module
		define(['knockout.validation'], factory);
	} else {
		// <script> tag: use the global `ko.validation` object
		factory(ko.validation);
	}
}(function(kv) {
	if (!kv || typeof kv.defineLocale !== 'function') {
		throw new Error('Knockout-Validation is required, please ensure it is loaded before this localization file');
	}
	return kv.defineLocale('es-ES', {
		required: 'Este campo es obligatorio',
		min: 'Por favor, introduzca un valor igual o mayor a {0}',
		max: 'Por favor, introduzca un valor menor o igual a {0}',
		minLength: 'Por favor, introduzca al menos {0} caracteres',
		maxLength: 'Por favor, no introduzca más de {0} caracteres',
		pattern: 'Por favor, compruebe este campo',
		step: 'El valor debe incrementarse por {0}',
		email: 'Este no es una dirección de email correcta',
		date: 'Por favor, introduzca una fecha correcta',
		dateISO: 'Por favor, introduzca una fecha correcta',
		number: 'Por favor, introduzca un número',
		digit: 'Por favor, introduzca un dígito',
		phoneUS: 'Por favor, introduzca un número de teléfono válido para EEUU',
		equal: 'Los valores deben ser iguales',
		notEqual: 'Por favor, elija otro valor',
		unique: 'Por favor, asegurese de que el valor sea único'
	});
}));
