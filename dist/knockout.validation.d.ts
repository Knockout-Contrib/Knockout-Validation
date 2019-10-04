import * as ko from "knockout";

declare module "knockout" {
    export namespace validation {
        export type ValidationObservable<T> = ko.Observable<T> & ObservableValidationExtension;
        export type ValidationComputed<T> = ko.Computed<T> & ObservableValidationExtension;
        export type ValidationPureComputed<T> = ko.PureComputed<T> & ObservableValidationExtension;

        export interface ValidationConfiguration {
            /**
             * If true validation will insert either a <span> element or the template specified by messageTemplate 
             * after any element (e.g. <input>)that uses a KO value binding with a validated field.
             */
            insertMessages?: boolean;
            /**
             * Indicates whether to assign an error class to the <input> tag when your property is invalid.
             * Note that this was previously called decorateElement, and this config option was renamed 2013-11-21.
             */
            decorateInputElement?: boolean;
            /** The CSS class assigned to validation error messages inserted when insertMessages is true. */
            errorMessageClass?: string;
            /** The CSS class assigned to validation error <input> elements, must have decorateInputElement set to true */
            errorElementClass?: string;
            /** Shows tooltips using input ‘title’ attribute. False hides them. */
            errorsAsTitle?: boolean;
            /** If defined, the CSS class assigned to both <input> and validation message. */
            errorClass?: string;
            /** Indicates whether to assign validation rules to your ViewModel using HTML5 validation attributes. */
            parseInputAttributes?: boolean;
            /** Adds HTML5 input validation attributes to form elements that ko observable’s are bound to. */
            writeInputAttributes?: boolean;
            /** Indicates whether validation messages are triggered only when properties are modified or at all times. */
            messagesOnModified?: boolean;
            /** Indicates whether css error classes are added only when properties are modified or at all times. */
            decorateElementOnModified?: boolean;
            /** The id of the <script type="text/html"></script> that you want to use for all your validation messages. */
            messageTemplate?: string;
            /** When using the group or validatedObservable functions. */
            grouping?: ValidationGroupingOptions;
            /** Register custom validation rules defined via ko.validation.rules. */
            registerExtenders?: boolean;
        }

        /** When using the group or validatedObservable functions. */
        export interface ValidationGroupingOptions {
            /** Indicates whether to walk the ViewModel (or object) recursively, or only walk first-level properties. */
            deep?: boolean;
            /** Indicates whether the returned errors object is a ko.computed or a simple function. */
            observable?: boolean;
            /** Indicates whether changes to observableArrays inside the model should cause the validator to re-run. */
            live?: boolean;
        }

        export interface ValidationRule {
            /** The rule name. */
            rule: string;
            /** The rule parameters. */
            params: any;
            /** The rule message. */
            message?: string;
            /** The rule condition. */
            condition?: () => boolean;
        }

        export interface ValidationRuleExtenderParams<T = any> {
            /** The rule parameters. */
            params: T;
            /** The rule message. */
            message?: string;
            /** The rule condition. */
            onlyIf?: () => boolean;
        }

        export interface ObservableValidationExtension {
            /** Holds the error message, we only need one since we stop processing validators when one is invalid. */
            error: ko.Observable<string | null>;
            /** Contains all rules applied to the observable. */
            rules: ko.ObservableArray<ValidationRule>;
            /** Is the observable modified. */
            isModified: ko.Observable<boolean>;
            /** In case async validation is occurring. */
            isValidating: ko.Observable<boolean>;
            /** Indicates whether the observable is valid. */
            isValid: ko.Computed<boolean>;

            /** Manually set error state. */
            setError(error: string): void;

            /** Manually clear error state. */
            clearError(): void;

            /** Dispose validation extension. */
            _disposeValidation(): void;
        }

        export interface ValidationRuleDefinition {
            /** The rule message. */
            message: string;
            /** The rule validator. */
            validator(value: any, params: any): boolean;
            /** The rule condition. */
            condition?: () => boolean;
            /** The rule condition. */
            onlyIf?: () => boolean;
        }

        export interface ValidationAsyncRuleDefinition {
            /** Indicates that this rule is async. */
            async: true;
            /** The rule message. */
            message: string;
            /** The rule async validator. */
            validator(value: any, params: any, callback: ValidationAsyncCallback): void;
            /** The rule condition. */
            condition?: () => boolean;
            /** The rule condition. */
            onlyIf?: () => boolean;
        }

        export interface ValidationGroup extends ValidationGroupFunctions {
            (): string[];
        }

        export interface ValidationGroupComputed extends ko.Computed<string[]>, ValidationGroupFunctions { }

        export interface ValidationGroupFunctions {
            showAllMessages(show?: boolean): void;
            isAnyMessageShown(): boolean;
            filter(predicate: (obs: ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>) => boolean): Array<ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>>;
            find(predicate: (obs: ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>) => boolean): ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>;
            forEach(predicate: (obs: ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>) => void): void;
            map<U>(predicate: (obs: ko.Observable<any> | ko.ObservableArray<any> | ko.Computed<any>) => U): U[];
        }

        export type ObjectValidationRuleDefinitions<T = any> = {
            [P in keyof T]:
            T[P] extends object ? ObjectValidationRuleDefinitions<T[P]> :
            T[P] extends Array<infer U> ? ObjectValidationRuleDefinitions<U> :
            { [key: string]: ValidationRuleExtenderParams | ValidationAnonymousRuleDefinition; }
        }

        export type ValidationAsyncCallback = (result: boolean | { isValid: boolean; message: string; }) => void;

        export type ValidationAnonymousRuleDefinition = ValidationRuleDefinition | ValidationAsyncRuleDefinition;

        export interface ValidationExtendOptions {
            validation?: ValidationRule | ValidationRuleDefinition | ValidationAsyncRuleDefinition | Array<ValidationRule | ValidationRuleDefinition | ValidationAsyncRuleDefinition>;
            validatable?: boolean | ExtenderValidatableOptions;

            required?: boolean | ValidationRuleExtenderParams<boolean>;
            min?: number | ValidationRuleExtenderParams<number>;
            max?: number | ValidationRuleExtenderParams<number>;
            minLength?: number | ValidationRuleExtenderParams<number>;
            maxLength?: number | ValidationRuleExtenderParams<number>;
            pattern?: RegExp | ValidationRuleExtenderParams<RegExp>;
            step?: number | ValidationRuleExtenderParams<number>;
            email?: boolean | ValidationRuleExtenderParams<boolean>;
            date?: boolean | ValidationRuleExtenderParams<boolean>;
            dateISO?: boolean | ValidationRuleExtenderParams<boolean>;
            number?: boolean | ValidationRuleExtenderParams<boolean>;
            digit?: boolean | ValidationRuleExtenderParams<boolean>;
            phoneUS?: boolean | ValidationRuleExtenderParams<boolean>;
            equal?: ko.Subscribable<any> | ValidationRuleExtenderParams<ko.Subscribable<any>>;
            notEqual?: ko.Subscribable<any> | ValidationRuleExtenderParams<ko.Subscribable<any>>;
            unique?: ValidationRuleExtenderParams<ExtenderUniqueOptions>;
        }

        export interface ExtenderValidatableOptions {
            enable?: boolean;
            throttle?: number;
        }

        export interface ExtenderUniqueOptions {
            /** array or function returning (observable) array in which the value has to be unique. */
            collection?: ko.MaybeObservableArray<any>;
            /** Function that returns value from an object stored in collection. If it is null the value is compared directly. */
            valueAccessor?: (item: any) => any;
            /** Set to true when object you are validating is automatically updating collection. */
            external?: boolean;
        }

        /** Call this on startup. Any config can be overridden with the passed in options. */
        export function init(options?: ValidationConfiguration, force?: boolean): void;

        /** Resets the config back to its original state. */
        export function reset(): void;

        /**
         * Recursively walks a viewModel and creates an object that provides validation information for the entire viewModel.
         *
         * @param obj The viewModel to walk.
         * @param options The grouping options.
         */
        export function group(obj: any, options?: ValidationGroupingOptions): ValidationGroup;
        /**
         * Recursively walks a viewModel and creates an object that provides validation information for the entire viewModel.
         *
         * @param obj The viewModel to walk.
         * @param options The grouping options.
         */
        export function group(obj: any, options?: ValidationGroupingOptions & { observable: true }): ValidationGroupComputed;

        /**
         * 
         * @param message The message containing replacements.
         * @param params The replacement parameters
         */
        export function formatMessage(message: string | MessageFunction, params: ko.MaybeSubscribable<string | string[]>, observable?: ko.Observable<any>): string;
        export type MessageFunction = (params: ko.MaybeSubscribable<string | string[]>, observable?: ko.Observable<any>) => string;

        /**
         * This takes in a ko.observable and a Rule Context - which is just a rule name and params to supply to the validator.
         * 
         * @example
         *      ko.validation.addRule(myObservable, {
         *          rule: "required",
         *          params: true
         *      });
         * 
         * @param observable The Observable to extend.
         * @param rule The rule configuration.
         */
        export function addRule(observable: ko.Observable<any> | ko.Computed<any>, rule: ValidationRule): typeof observable & ObservableValidationExtension;

        /**
         * Anonymous Rules essentially have all the properties of a Rule, but are only specific for a certain property
         * and developers typically are wanting to add them on the fly or not register a rule with the 'ko.validation.rules' object
         * 
         * @example
         *      var test = ko.observable("something").extend({
         *          validation: {
         *              validator: function (val, someOtherVal) {
         *                  return true;
         *              },
         *              message: "Something must be really wrong!",
         *              params: true
         *          }
         *      });
         * 
         * @param observable The Observable to extend.
         * @param ruleObj The rule definition object.
         */
        export function addAnonymousRule(observable: ko.Observable<any> | ko.Computed<any>, ruleObj: ValidationAnonymousRuleDefinition): void;

        /**
         * Creates a knockout extender for the specified rule.
         * 
         * @param ruleName The rule to create extender for.
         */
        export function addExtender(ruleName: string): void;

        /** Loops through all ko.validation.rules and adds them as extenders to ko.extenders. */
        export function registerExtenders(): void;

        /**
         * Creates a span next to the @element with the specified error class.
         *
         * @param element The HTML Element to insert message after.
         */
        export function insertValidationMessage(element: Element): Element;

        /**
         * If html-5 validation attributes have been specified, this parses the attributes on @element.
         *
         * @param element The HTML Element to parse attributes on.
         * @param valueAccessor The valueAccesor containing the observable to validate.
         */
        export function parseInputValidationAttributes(element: Element, valueAccessor: () => any): void;

        /**
         * Writes html5 validation attributes on the element passed in.
         *
         * @param element The HTML Element to write attributes on.
         * @param valueAccessor The valueAccessor containing the observable to validate.
         */
        export function writeInputValidationAttributes(element: Element, valueAccessor: () => any): void;

        /**
         * Take an existing binding handler and make it cause automatic validations.
         * 
         * @param handlerName The binding handler to make validatable.
         */
        export function makeBindingHandlerValidatable(handlerName: string): void;

        /**
         * Visit an objects properties and apply validation rules from a definition.
         * 
         * @param target The target object to set rules for.
         * @param definitions The rules definitions object.
         */
        export function setRules<T>(target: T, definitions: ObjectValidationRuleDefinitions<T>): void;

        /** Validates specified observable. */
        export function validateObservable(observable: ko.Observable<any> | ko.Computed<any>): boolean;

        /**
         * Applies localization to messages.
         * 
         * @param locale The locale to apply.
         */
        export function locale(locale: string): void;

        /**
         * Defines localization messages.
         * 
         * @param locale The locale to define.
         * @param values The messages values.
         */
        export function defineLocale(locale: string, values: Object): void;

        /**
         * Quick function to override rule messages.
         *
         * @param msgTranslations The messages translations to apply.
         */
        export function localize(msgTranslations: any): void;

        export const rules: ValidationRules;

        export interface ValidationRules {
            [name: string]: ValidationRuleDefinition | ValidationAsyncRuleDefinition;

            required: ValidationRuleDefinition;
            min: ValidationRuleDefinition;
            max: ValidationRuleDefinition;
            minLength: ValidationRuleDefinition;
            maxLength: ValidationRuleDefinition;
            pattern: ValidationRuleDefinition;
            step: ValidationRuleDefinition;
            email: ValidationRuleDefinition;
            date: ValidationRuleDefinition;
            dateISO: ValidationRuleDefinition;
            number: ValidationRuleDefinition;
            digit: ValidationRuleDefinition;
            phoneUS: ValidationRuleDefinition;
            equal: ValidationRuleDefinition;
            notEqual: ValidationRuleDefinition;
            unique: ValidationRuleDefinition;
        }

        export namespace utils {
            export function isArray<T = any>(o: any): o is Array<T>;
            export function isObject(o: any): o is object;
            export function isNumber(o: any): o is number;
            export function isObservableArray<T = any>(instance: any): instance is ko.ObservableArray<T>;
            export function values(o: string): any[];
            export function getValue<T>(o: T | (() => T)): T;
            export function hasAttribute(node: Element, attr: string): boolean;
            export function getAttribute(element: Element, attr: string): string;
            export function setAttribute(element: Element, attr: string, value: any): void;
            export function isValidatable(o: any): o is ObservableValidationExtension;
            export function insertAfter(node: Node, newNode: Node): void;
            export function newId(): number;
            export function getConfigOptions(element: Element): ValidationConfiguration;
            export function setDomData(node: Node, data: any): void;
            export function getDomData<T = any>(node: Node): T;
            export function contextFor(node: Node): any;
            export function isEmptyVal(val: any): val is undefined | null | "";
            export function getOriginalElementTitle(element: Element): string;
            export function async(expr: () => void): void;
            export function forEach<T>(array: T[], callback: (item: T, index: number, list: typeof array) => void): void;
            export function forEach<T>(object: T, callback: (key: keyof T, value: any) => void): void;
        }
    }

    /** Creates a validation group observable. */
    export function validatedObservable<T extends object | null | undefined>(initialValue?: T, options?: validation.ValidationGroupingOptions & { observable: true }): ko.Observable<T> & { errors: validation.ValidationGroupComputed, isValid: ko.Observable<boolean> };
    /** Creates a validation group observable. */
    export function validatedObservable<T extends object | null | undefined>(initialValue?: T, options?: validation.ValidationGroupingOptions): ko.Observable<T> & { errors: validation.ValidationGroup, isValid: ko.Observable<boolean> };
    /** Creates a new empty Validated Observable. */
    export function validatedObservable<T>(initialValue: T): validation.ValidationObservable<T>;

    /** Apply Binding with specified validation options. */
    export function applyBindingsWithValidation(viewModel: any, options?: validation.ValidationConfiguration): void;
    /** Apply Binding with specified validation options. */
    export function applyBindingsWithValidation(viewModel: any, rootNode?: any, options?: validation.ValidationConfiguration): void;

    export interface BindingHandlers {
        validationCore: {
            init(element: HTMLElement, valueAccessor: () => ko.MaybeSubscribable<any>, allBindingsAccessor: ko.AllBindings, viewModel: any, bindingContext: ko.BindingContext<any>): void;
        };
        validationMessage: {
            init(element: HTMLElement, valueAccessor: () => ko.MaybeSubscribable<any>): void;
        };
        validationCovalidationElementre: {
            init(element: HTMLElement, valueAccessor: () => ko.MaybeSubscribable<any>, allBindingsAccessor: ko.AllBindings): void;
        };
        validationOptions: {
            init(element: HTMLElement, valueAccessor: () => ko.MaybeSubscribable<validation.ValidationConfiguration>, allBindingsAccessor: ko.AllBindings, viewModel: any, bindingContext: ko.BindingContext<any>): void;
        };
    }

    export interface Extenders {
        /**
         * This is for creating custom validation logic on the fly.
         * 
         * @example
         *      var test = ko.observable("something").extend({
         *          validation: {
         *              validator: function (val, someOtherVal) {
         *                  return true;
         *              },
         *              message: "Something must be really wrong!",
         *              params: true
         *          }
         *      });
         */
        validation<T extends ko.Subscribable<any>>(target: T, options: validation.ValidationRule | validation.ValidationRule[]): T & validation.ObservableValidationExtension;
        /**
         * This is the extender that makes a Knockout Observable also 'Validatable'
         * 
         * @example
         *  // This will ensure that the Observable object is setup properly to respond to rules
         *  var test = ko.observable("something").extend({ validatable: true });
         * 
         *  // This will remove the validation properties from the Observable object should you need to do that.
         *  test.extend({ validatable: false });
         */
        validatable<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ExtenderValidatableOptions): T & validation.ObservableValidationExtension;

        required<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        min<T extends ko.Subscribable<any>>(target: T, options: number | validation.ValidationRuleExtenderParams<number>): T & validation.ObservableValidationExtension;
        max<T extends ko.Subscribable<any>>(target: T, options: number | validation.ValidationRuleExtenderParams<number>): T & validation.ObservableValidationExtension;
        minLength<T extends ko.Subscribable<any>>(target: T, options: number | validation.ValidationRuleExtenderParams<number>): T & validation.ObservableValidationExtension;
        maxLength<T extends ko.Subscribable<any>>(target: T, options: number | validation.ValidationRuleExtenderParams<number>): T & validation.ObservableValidationExtension;
        pattern<T extends ko.Subscribable<any>>(target: T, options: RegExp | validation.ValidationRuleExtenderParams<RegExp>): T & validation.ObservableValidationExtension;
        step<T extends ko.Subscribable<any>>(target: T, options: number | validation.ValidationRuleExtenderParams<number>): T & validation.ObservableValidationExtension;
        email<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        date<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        dateISO<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        number<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        digit<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        phoneUS<T extends ko.Subscribable<any>>(target: T, options: boolean | validation.ValidationRuleExtenderParams<boolean>): T & validation.ObservableValidationExtension;
        equal<T extends ko.Subscribable<any>>(target: T, options: ko.Subscribable<any> | validation.ValidationRuleExtenderParams<ko.Subscribable<any>>): T & validation.ObservableValidationExtension;
        notEqual<T extends ko.Subscribable<any>>(target: T, options: ko.Subscribable<any> | validation.ValidationRuleExtenderParams<ko.Subscribable<any>>): T & validation.ObservableValidationExtension;
        unique<T extends ko.Subscribable<any>>(target: T, options: validation.ValidationRuleExtenderParams<validation.ExtenderUniqueOptions>): T & validation.ObservableValidationExtension;
    }

    export interface SubscribableFunctions<T> {
        extend(requestedExtenders: validation.ValidationExtendOptions): this & validation.ObservableValidationExtension;
    }

    export interface ObservableExtenderOptions extends validation.ValidationExtendOptions { }
}

export = ko.validation;
