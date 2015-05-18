# 2.0.3 (2015-05-18)

### Features
* Add Arabic - Jordan (ar-JO) localization #546


### Bug Fixes

* formatMessage fails when params is falsy #547
* async rules cannot return immediately #341


# 2.0.2 (2015-02-02)

### Bug Fixes

* use `peerDependencies` for npm package dependencies #528
* `validationElement` and `validationMessage` bindings throw if observable is not validatable #519
* validation cannot be removed from attached observable #526
* localization may not work in node.js; some files were still not working with RequireJS #509
* Nuget package will contain the same file names as for Bower or NPM


# 2.0.1 (2015-01-26)

This release enables [cdnjs](https://cdnjs.com/libraries/knockout-validation) npm auto-update and fixes localization loading issue with RequireJS.


### Bug Fixes

* Localization loading randomly breaks when using requirejs #509


### Localization

* add localization file for Chinese - Taiwan (zh-TW) #513


# 2.0.0 (2015-01-20)

### Features

- new localization files: Hebrew, Italian, Persian, Hungarian, Croatian, Brazilian, Japanese, Swedish, Norwegian, Chinese, German, Catalan, Danish, Korean, Latvian, Romanian, Bulgarian, Portuguese, Czech, Turkish  #165, #177, #196, #201, #203, #204, #212, #221, #261, #270, #322, #327, #329, #340, #378, #411, #415, #416, #430, #467
- add config option `errorsAsTitle` to disable setting element 'title' with error description. Default is `true` #168
- add config option `grouping.live` to react to changes to observableArrays #223
- add config option `decorateElementOnModified` #320
- add config option `allowHtmlMessages` for allowing HTML in validation messages #364
- add config option `validate.throttle` to implement throttling for validation #344
- add support for HTML5 date, email and number input types #130
- decorate radio buttons using checked binding #193
- Number validator - Allow numbers starting with point. #236
- step rule supports value `any` #271
- remove dependency on jQuery #318
- update knockout dependency to v3.0.0 #358
- add `setRules` method #337
- min and max validation use type attribute to determine behavior #355
- make library available through npm #357
- support observable params for validators #363
- min and max rules work with Date observables #459
- allow grouping options to be specified to `validatedObservable` #461
- add version in banner #428
- add support for `textInput` binding #451
- add support for `selectedOptions` binding #426
- add basic collection methods to errors, exposing raw validatables. #449
- ko.validation.group does not resolve deferred computed values unless they have rules defined on them. #163
- make localization files AMD and CommonJS/Node compatible #492
- enable loading of multiple locales and add possibility to switch between them #492


### Bug Fixes

- unwrap parameters before using them in `formatMessage` #235
- make attached error property to be observable #247, #173
- grouping options does not overwrite global configuration options #248
- titles are not reset when data becomes valid #170
- reorder `phoneUS` validation checks to preserve optional properties if observable is not initialized or null. #234
- fix memory leaks in `addAnonymousRule` rules #346
- handle rule `params` which may be undefined #334
- `unique` rule can behave incorrectly for external values #365
- use update binding handler instead of utility method setTextContent #368
- `onlyIf` doesn’t affect anonymous validation rule #374
- fix group returns observables in errors array, not the value of each error #383
- fix initial value for isValid of `validatedObservable` #387
- fix check for knockout library #447
- make `formatMessage` aware if min and max rules were created from Javascript #385
- `writeInputAttributes` fails when anonymous rules are used #400
- `maxLength` rule fails if the value (of the observable) is a number #457
- `applyBindingsWithValidation` fails when called with viewModel and options #137
- `applyBindingsWithValidation` should extend provided config #472
- `dateISO` rule accepts months or days outside the valid range #265
- `writeInputValidationAttributes` does not support write HTML5 attributes correctly when `params` is observable #481
- prevent `ko.validation.group` to notify with intermediary validation state #99
- grouping over validatedObservable objects is not possible #494
- `showAllMessages` throws when accessing `isModified` when grouping over validatedObservable instances #269
- `validatedObservable` does not react when its value changes #442
- updating a validatedObservable will not reset initial validation result #209
- `parseInputAttributes` option may duplicate rules when enabled #277


### Breaking Changes

- remove `ko.validation.configure` method, `ko.validation.init` must be used instead #496
- rename `decorateElement` to `decorateInputElement` #361
- do not change original data by `group` method #465, #225
- loading localization files using `script` tags or with and `AMD loader` no longer changes the language automatically. A call to `ko.validation.locale` is required #506
- rename some localization files due to invalid identifiers, no-NB.js → nb-NO.js, ca-CA.js → ca-ES.js c2d0ec19bc0abea073a4bbabc933e7299aa6af5b
- change project structure #511 - directories are now lowercase
