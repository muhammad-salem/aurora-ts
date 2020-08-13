import {
	ComponentOptions, TypeOf, ChildOptions, PipeOptions,
	ServiceOptions, DirectiveOptions, JSXRender
} from '../core/decorators.js';
import { findByTagName, Tag } from './tags.js';
import {
	isOnInit, isOnChanges, isDoCheck,
	isAfterContentInit, isAfterContentChecked,
	isAfterViewInit, isAfterViewChecked, isOnDestroy,
} from '../core/lifecycle.js';
import { BaseComponent } from './component.js';
import { ComponentRender } from '../jsx/render.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { JsxComponent } from '../jsx/factory.js';
import { Observable } from '../core/observable.js';
import { findByModelClassOrCreat } from '../reflect/bootstrap-data.js';
import { toJSXRender, HTMLComponentRender } from '../jsx/html-expression.js';
import { JSXComponentRender } from '../jsx/jsx-expression.js';
import { EventEmitter } from '../core/events.js';

export class PropertyRef {
	constructor(public modelProperty: string, private _viewNanme?: string, descriptor?: PropertyDescriptor) { }
	get viewAttribute(): string {
		return this._viewNanme || this.modelProperty;
	}
}

export class ChildRef {
	constructor(public modelName: string, public selector: string | { new(): HTMLElement; prototype: HTMLElement } | CustomElementConstructor, public childOptions?: ChildOptions) { }
}

export class ListenerRef {
	constructor(public eventName: string, public args: string[], public modelCallbackName: string) { }
}

export class HostBindingRef {
	constructor(public viewProperty: string, public hostPropertyName: string) { }
}

export interface BootstropMatadata {
	[key: string]: any;
}

export interface ServiceRef extends ServiceOptions {
	descriptors: PropertyDescriptor[];
}

export interface PipeRef extends PipeOptions {
	name: string;
	pure: boolean;
	descriptors: PropertyDescriptor[];
}
export interface DirectiveRef extends DirectiveOptions {
	inputs: PropertyRef[];
	outputs: PropertyRef[];
	view: string;
	viewChild: ChildRef[];
	ViewChildren: ChildRef[];
	hostListeners: ListenerRef[];
	hostBindings: HostBindingRef[];
	directiveOptions: DirectiveOptions;
	descriptors: PropertyDescriptor[];
}

export interface ComponentRef<T> {
	selector: string;
	template: JSXRender<T>;
	styles: string;
	extend: Tag;

	viewClass: CustomElementConstructor;
	inputs: PropertyRef[];
	outputs: PropertyRef[];
	view: string;
	viewChild: ChildRef[];
	ViewChildren: ChildRef[];
	hostBindings: HostBindingRef[];
	hostListeners: ListenerRef[];
	descriptors: PropertyDescriptor[];

	renderType: 'html' | 'jsx' | 'tsx';
}


export class ComponentElement {

	static addOptional(modelProperty: Object, propertyName: string, index: number) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
	}

	static addInput(modelProperty: Object, modelName: string, viewNanme: string, descriptor?: PropertyDescriptor) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.inputs = bootstrap.inputs || [];
		bootstrap.inputs.push(new PropertyRef(modelName, viewNanme, descriptor));
	}

	static addOutput(modelProperty: Object, modelName: string, viewNanme: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.outputs = bootstrap.outputs || [];
		bootstrap.outputs.push(new PropertyRef(modelName, viewNanme));
	}

	static setComponentView(modelProperty: Object, modelName: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.view = modelName;
	}

	static addViewChild(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor, childOptions?: ChildOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.viewChild = bootstrap.viewChild || [];
		bootstrap.viewChild.push(new ChildRef(modelName, selector, childOptions));
	}

	static addViewChildren(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.ViewChildren = bootstrap.ViewChildren || [];
		bootstrap.ViewChildren.push(new ChildRef(modelName, selector));
	}

	static addHostListener(modelProperty: Object, propertyKey: string, eventName: string, args: string[]) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.hostListeners = bootstrap.hostListeners || [];
		bootstrap.hostListeners.push(new ListenerRef(eventName, args, propertyKey));
	}

	static addHostBinding(modelProperty: Object, propertyKey: string, hostPropertyName: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.hostBinding = bootstrap.hostBinding || [];
		bootstrap.hostBinding.push(
			new HostBindingRef(propertyKey, hostPropertyName)
		);
	}

	static defineDirective(modelClass: Function, opts: DirectiveOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerDirective(modelClass);
	}

	static definePipe(modelClass: Function, opts: PipeOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerPipe(modelClass);
	}

	static defineService(modelClass: Function, opts: ServiceOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerService(modelClass);
	}

	static defineComponent<T extends Object>(modelClass: TypeOf<T>, opts: ComponentOptions<T>) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		bootstrap.extend = findByTagName(opts.extend);
		var componentRef: ComponentRef<T> = bootstrap as ComponentRef<T>;
		if (!componentRef.template) {
			componentRef.renderType = 'html';
		} else if (typeof componentRef.template === 'string') {
			componentRef.template = toJSXRender(componentRef.template);
			componentRef.renderType = 'html';
		} else {
			componentRef.renderType = 'jsx';
		}
		componentRef.inputs = componentRef.inputs || [];
		componentRef.outputs = componentRef.outputs || [];
		componentRef.viewChild = componentRef.viewChild || [];
		componentRef.ViewChildren = componentRef.ViewChildren || [];
		componentRef.hostBindings = componentRef.hostBindings || [];
		componentRef.hostListeners = componentRef.hostListeners || [];
		componentRef.descriptors = componentRef.descriptors || [];

		componentRef.viewClass = initViewClass(modelClass, componentRef);

		dependencyInjector.getInstance(ClassRegistry).registerComponent(modelClass);
		dependencyInjector
			.getInstance(ClassRegistry)
			.registerView(bootstrap.viewClass);
		// setBootstrapMatadata(modelClass.prototype, componentRef);

		const options: ElementDefinitionOptions = {};
		const parentTagName = componentRef.extend?.name;
		if (parentTagName) {
			if (parentTagName !== '!' && parentTagName.indexOf('-') === -1) {
				options.extends = parentTagName;
			}
		}
		customElements.define(
			componentRef?.selector as string,
			componentRef.viewClass as CustomElementConstructor,
			options
		);
	}
}

function initViewClass<T extends Object>(modelClass: TypeOf<T>, componentRef: ComponentRef<T>): CustomElementConstructor {
	const viewClassName = `${modelClass.name}View`;
	const htmlParent = (componentRef.extend as Tag).classRef as TypeOf<HTMLElement>;
	let viewClass: CustomElementConstructor;
	viewClass = class extends htmlParent implements BaseComponent<T> {
		// [key: string]: any;

		_model: T & { [key: string]: any };
		_changeObservable: Observable;
		_render: ComponentRender<T>;
		_parentComponent: BaseComponent<any>;
		_bindMap: Map<string, Array<string>>;

		_setAttributeNative: Function;
		_addEventListenerNative: Function;

		constructor() {
			super();
			this._model = new modelClass();
			this._changeObservable = new Observable();
			this._bindMap = new Map();
			this._render = componentRef.renderType === "html" ?
				new HTMLComponentRender(this, componentRef) :
				new JSXComponentRender(this, componentRef);

			this._setAttributeNative = this.setAttribute;
			this._addEventListenerNative = this.addEventListener;

			this.setAttribute = this._setAttribute;
			// this.getAttribute = this._getAttribute;
			this.addEventListener = this._addEventListener;

			componentRef.inputs.forEach(input => {
				const inputDefaultValue = this._model[input.modelProperty];
				if (inputDefaultValue) {
					this._setAttribute(input.viewAttribute, inputDefaultValue);
				}
			});
		}

		hasInput(viewProp: string): boolean {
			return componentRef.inputs.some(input => input.viewAttribute === viewProp);
		}

		getInput(viewProp: string): PropertyRef | undefined {
			return componentRef.inputs.find(input => input.viewAttribute === viewProp);
		}

		getInputValue(viewProp: string): any {
			const inputRef = this.getInput(viewProp);
			if (inputRef) {
				return this._model[inputRef.modelProperty];
			}
		}

		setInputValue(viewProp: string, value: any): void {
			const inputRef = this.getInput(viewProp);
			if (inputRef) {
				// console.log('about to change input', inputRef.modelProperty, value);
				Reflect.set(this._model, inputRef.modelProperty, value);
				this._changeObservable.emit(viewProp);
			}
		}

		hasOutput(viewProp: string): boolean {
			return componentRef.outputs.some(output => output.viewAttribute === viewProp);
		}

		getOutput(viewProp: string): PropertyRef | undefined {
			return componentRef.outputs.find(output => output.viewAttribute === viewProp);
		}

		getEventEmitter<V>(viewProp: string): EventEmitter<V> | undefined {
			const outputRef = this.getOutput(viewProp);
			if (outputRef) {
				return this._model[outputRef.modelProperty] as EventEmitter<V>;
			}
		}

		hasProp(propName: string): boolean {
			return Reflect.has(this._model, propName);
		}

		_setAttributeHelper(attrViewName: string, value: any): void {
			if (value === null || value === undefined) {
				return;
			}
			if (typeof value === 'boolean') {
				if (value) {
					this._setAttributeNative(attrViewName, '');
				} else {
					this.removeAttribute(attrViewName);
				}
			} else {
				this._setAttributeNative(attrViewName, String(value));
			}
		}

		_setAttribute(attrViewName: string, value: any): void {
			this.setInputValue(attrViewName, value);
			this._setAttributeHelper(attrViewName, value);
		}

		// _getAttribute(attrViewName: string): string | null {
		// 	return this.getInputValue(attrViewName);
		// }

		doBlockCallback = (): void => {
			if (isDoCheck(this._model)) {
				this._model.doCheck();
			}
		};

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			// console.log('attributeChangedCallback', name, oldValue, newValue);
			if (newValue === oldValue) {
				return;
			}
			this._changeObservable.emit(name);
			if (isOnChanges(this._model)) {
				this._model.onChanges();
			}
			this.doBlockCallback();
		}

		connectedCallback() {
			if (isOnChanges(this._model)) {
				this._model.onChanges();
			}
			if (isOnInit(this._model)) {
				this._model.onInit();
			}
			if (isDoCheck(this._model)) {
				this._model.doCheck();
			}
			if (isAfterContentInit(this._model)) {
				this._model.afterContentInit();
			}
			if (isAfterContentChecked(this._model)) {
				this._model.afterContentChecked();
			}

			// setup ui view
			this._render.initView();

			if (componentRef.view) {
				// this._model[componentRef.view] = this;
				Reflect.set(this._model, componentRef.view, this);
			}

			if (isAfterViewInit(this._model)) {
				this._model.afterViewInit();
			}
			if (isAfterViewChecked(this._model)) {
				this._model.afterViewChecked();
			}
			this.doBlockCallback = () => {
				if (isDoCheck(this._model)) {
					this._model.doCheck();
				}
				if (isAfterContentChecked(this._model)) {
					this._model.afterContentChecked();
				}
				if (isAfterViewChecked(this._model)) {
					this._model.afterViewChecked();
				}
			};
		}

		adoptedCallback() {
			// restart the process
			this.innerHTML = '';
			this.connectedCallback();
		}

		disconnectedCallback() {
			if (isOnDestroy(this._model)) {
				this._model.onDestroy();
			}
			this._changeObservable.emit('destroy');
		}

		// events api
		_addEventListener(eventType: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
			// console.log('tag', this.tagName.toLowerCase(), 'eventType', eventType);
			if ('on' + eventType in this) {
				// this._nativeAddEventListener(eventType, listener, options);
				this._addEventListenerNative(eventType, (event: Event) => {
					console.log('tag', this.tagName, 'call eventType', eventType, 'event', event);
					(listener as Function)(event);
				}, options);
				return;
			}
			const modelEvent = this.getEventEmitter<any>(eventType);
			if (modelEvent) {
				// modelEvent.subscribe(listener);
				modelEvent.subscribe((data: any) => {
					console.log('tag', this.tagName, 'call eventType', eventType, 'data', data, 'modelEvent', modelEvent);
					(listener as Function)(data);
				});
			}
			else {
				this._changeObservable.subscribe(eventType, (listener as EventListener));
			}
		}

		triggerEvent(eventName: string, value?: any): void {
			// console.log('tag', this.tagName.toLowerCase(), 'triggerEvent', event);
			const modelEvent = this.getEventEmitter<any>(eventName);
			if (modelEvent) {
				modelEvent.emit(value);
				return;
			}
			if (this._changeObservable.has(eventName)) {
				if (value) {
					this._changeObservable.emitValue(eventName, value);
				} else {
					this._changeObservable.emit(eventName);
				}
				return;
			}
		}

		bindAttr(view: string, elementAttr: string): void {
			let viewAttr = this._bindMap.get(view);
			if (viewAttr) {
				viewAttr.push(view);
			} else {
				this._bindMap.set(view, [elementAttr]);
			}
		}

		getBindAttr(view: string): string[] {
			return this._bindMap.get(view) || [];
		}
		searchBindAttr(elementAttr: string): string[] {
			return [...this._bindMap.entries()]
				.filter(entry => entry[1].some(item => elementAttr.startsWith(item)))
				.map(entry => entry[0]);
		}

		notifyParentComponent(eventName: string): void {
			if (this._parentComponent) {
				let parent = this._parentComponent;
				let attrs = parent.searchBindAttr(eventName);
				attrs.forEach(attr => {
					parent.triggerEvent(attr);
				});
			}
		}
	};

	componentRef.inputs.forEach(input => {
		Object.defineProperty(viewClass.prototype, input.viewAttribute, {
			get(): any {
				return this._model[input.modelProperty];
			},
			set(value: any) {
				this._model[input.modelProperty] = value;
			},
			enumerable: true
		});
	});

	componentRef.outputs.forEach(output => {
		Object.defineProperty(viewClass.prototype, output.viewAttribute, {
			get(): EventEmitter<any> {
				return this._model[output.modelProperty];
			},
			enumerable: true
		});
	});
	Object.defineProperty(viewClass, 'observedAttributes', {
		get() {
			return componentRef.inputs.map(input => input.viewAttribute);
		}
	});
	Object.defineProperty(modelClass, viewClassName, { value: viewClass });
	Object.defineProperty(viewClass, 'name', { value: viewClassName });
	return viewClass;
}
