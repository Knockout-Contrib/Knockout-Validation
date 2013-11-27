﻿/*globals require: false, exports: false, define: false, ko: false */

(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports", "module"], function (ko, exports, module) {
            var factoryInstance = factory(ko, exports);
            var config = module.config();
            if (config) {
                ko.validation.init(config);
            }
            return factoryInstance;
        });
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.validation = {});
    }
}(function ( ko, exports ) {

    if (typeof (ko) === undefined) { throw 'Knockout is required, please ensure it is loaded before loading this validation plug-in'; }

    // create our namespace object
    ko.validation = exports;

    var kv = ko.validation;
    var koUtils = ko.utils;
    var unwrap = koUtils.unwrapObservable;
    var forEach = koUtils.arrayForEach;
    var extend = koUtils.extend;
