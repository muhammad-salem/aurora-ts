import { TypeOf } from '../core/decorators.js';
import { EventEmitter, Subscription } from '../core/events.js';
import { isAfterContentChecked, isAfterContentInit, isAfterViewChecked, isAfterViewInit, isDoCheck, isOnChanges, isOnDestroy, isOnInit } from '../core/lifecycle.js';
import { ToCamelCase } from '../core/utils.js';
import { BaseComponent, HTMLComponent } from '../elements/component.js';
import { ComponentRef, PropertyRef } from '../elements/elements.js';
import { Tag } from '../elements/tags.js';
import { HTMLComponentRender } from '../jsx/html-expression.js';
import { JSXComponentRender } from '../jsx/jsx-expression.js';
import { ComponentRender } from '../jsx/render.js';
import { Model, defineModel, isModel } from '../model/model-change-detection.js';


export function initCustomElementView<T extends Object>(modelClass: TypeOf<T>, componentRef: ComponentRef<T>): TypeOf<HTMLComponent<T>> {
	const viewClassName = `${modelClass.name}View`;
	const htmlParent = (componentRef.extend as Tag).classRef as TypeOf<HTMLElement>;
	let viewClass: TypeOf<HTMLComponent<T>>;
	viewClass = class extends htmlParent implements BaseComponent<T> {

		_model: T & { [key: string]: any } & Model;
		_render: ComponentRender<T>;
		_shadowRoot: ShadowRoot;

		_setAttributeNative: Function;
		_getAttributeNative: Function;
		_addEventListenerNative: Function;

		constructor() {
			super();
			if (componentRef.isShadowDom) {
				this._shadowRoot = this.attachShadow({ mode: 'open' });
			}
			// services should be injected her
			let model = new modelClass();
			defineModel(model);
			if (isModel(model)) {
				this._model = model;
			}
			// if model had view decorator
			if (componentRef.view) {
				// this._model[componentRef.view] = this;
				Reflect.set(this._model, componentRef.view, this);
			}

			this._render = componentRef.renderType === "html"
				? new HTMLComponentRender(this)
				: new JSXComponentRender(this);

			this._setAttributeNative = this.setAttribute;
			this._getAttributeNative = this.getAttribute;
			this._addEventListenerNative = this.addEventListener;

			this.setAttribute = this._setAttribute;
			this.getAttribute = this._getAttribute;
			this.addEventListener = this._addEventListener;

			componentRef.inputs.forEach(input => {
				const inputDefaultValue = this._model[input.modelProperty];
				if (inputDefaultValue) {
					this._setAttributeHelper(input.viewAttribute, inputDefaultValue);
				}
			});
		}

		getComponentRef(): ComponentRef<T> {
			return componentRef;
		}

		hasInputStartWith(viewProp: string): boolean {
			let dotIndex = viewProp.indexOf('.');
			if (dotIndex > 0) {
				viewProp = viewProp.substring(0, dotIndex);
			}
			return this.hasInput(viewProp);
		}

		getInputStartWith(viewProp: string): PropertyRef | undefined {
			let dotIndex = viewProp.indexOf('.');
			if (dotIndex > 0) {
				viewProp = viewProp.substring(0, dotIndex);
			}
			return this.getInput(viewProp);
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
				// this._changeObservable.emit(viewProp);
				this._model.emitChangeModel(inputRef.modelProperty);
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
			if (value === null || value === undefined) {
				return;
			}
			this.setInputValue(attrViewName, value);
			this._setAttributeHelper(attrViewName, value);
		}

		_getAttribute(attrViewName: string): string | null {
			return this.getInputValue(attrViewName);
		}

		doBlockCallback = (): void => {
			if (isDoCheck(this._model)) {
				this._model.doCheck();
			}
		};

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			if (newValue === oldValue) {
				return;
			}
			// this._changeObservable.emit(name);
			const inputRef = this.getInput(name);
			if (inputRef) {
				this._model.emitChangeModel(inputRef.modelProperty);
			}
			if (isOnChanges(this._model)) {
				this._model.onChanges();
			}
			this.doBlockCallback();
		}

		connectedCallback() {

			// if (!this.hasParentComponent() && this.attributes.length > 0) {
			// 	let oldAttrValus = [].slice.call(this.attributes);
			//	oldAttrValus.forEach((attr: Attr) => {
			// 		Reflect.set(this, attr.name, attr.value);
			// 	});
			// }

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

			// if (componentRef.encapsulation === 'template' && !this.hasParentComponent()) {
			// 	Array.prototype.slice.call(this.attributes).forEach((attr: Attr) => {
			// 		this.initOuterAttribute(attr);
			// 	});
			// }

			// setup ui view
			this._render.initView();

			// init Host Listener events
			this._render.initHostListener();

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

		// initOuterAttribute(attr: Attr) {
		// 	// [window, this] scop
		// 	let elementAttr = attr.name;
		// 	let modelProperty = attr.value;
		// 	if (elementAttr.startsWith('(')) {
		// 		// (elementAttr)="modelProperty()"
		// 		elementAttr = elementAttr.substring(1, elementAttr.length - 1);
		// 		// this.handleEvent(element, elementAttr, viewProperty);
		// 		modelProperty = modelProperty.endsWith('()') ?
		// 			modelProperty.substring(0, modelProperty.length - 2) : modelProperty;
		// 		let callback: Function = Reflect.get(window, modelProperty);
		// 		this.addEventListener(elementAttr, event => {
		// 			callback(event);
		// 		});
		// 	} else if (elementAttr.startsWith('on')) {
		// 		const modelEvent = this.getEventEmitter<any>(elementAttr.substring(2));
		// 		if (modelEvent) {
		// 			// modelEvent.subscribe(listener);
		// 			modelProperty = modelProperty.endsWith('()') ?
		// 				modelProperty.substring(0, modelProperty.length - 2) : modelProperty;
		// 			let listener: Function = Reflect.get(window, modelProperty);
		// 			modelEvent.subscribe((data: any) => {
		// 				(listener as Function)(data);
		// 			});
		// 		}
		// 	}
		// }

		adoptedCallback() {
			// restart the process
			this.innerHTML = '';
			this.connectedCallback();
		}

		disconnectedCallback() {
			// notify first, then call model.onDestroy func
			// this._changeObservable.emit('destroy');
			if (isOnDestroy(this._model)) {
				this._model.onDestroy();
			}
		}

		// events api
		_addEventListener(eventName: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
			if ('on' + eventName in this) {
				this._addEventListenerNative(eventName, (event: Event) => {
					(listener as Function)(event);
				}, options);
				return;
			}
			const modelOutput = this.getEventEmitter<any>(eventName);
			if (modelOutput) {
				// modelOutput.subscribe(listener);
				modelOutput.subscribe((data: any) => {
					(listener as Function)(data);
				});
			}
			else {
				// this._changeObservable.subscribe(eventName, (listener as EventListener));
				this._model.subscribeModel(eventName, listener as EventListener);
			}
		}

		triggerOutput(eventName: string, value?: any): void {
			const modelEvent = this.getEventEmitter<any>(eventName);
			if (modelEvent) {
				modelEvent.emit(value);
				return;
			}
		}

		triggerModelChange(eventName: string, value?: any): void {
			// this._changeObservable.emit(eventName, value);
			this._model.emitChangeModel(eventName);
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
		let eventListener: Function | undefined;
		let subscription: Subscription<any>;
		Object.defineProperty(viewClass.prototype, 'on' + ToCamelCase(output.viewAttribute), {
			// get(): EventEmitter<any> {
			// 	// return this._model[output.modelProperty];
			// },
			get(): Function | undefined {
				// return this._model[output.modelProperty];
				return eventListener;
			},
			set(event: string | Function): void {
				if (!event) {
					if (subscription) {
						subscription.unsubscribe();
						eventListener = undefined;
					}
				}
				if (typeof event === 'string') {
					if (event.endsWith('()')) {
						event = event.substring(0, event.length - 2);
					}
					event = Reflect.get(window, event);
				}
				eventListener = event as Function;
				subscription = (this._model[output.modelProperty] as EventEmitter<any>).subscribe(event);
			},
			enumerable: true
		});
	});
	Object.defineProperty(viewClass, 'observedAttributes', {
		get() {
			return componentRef.inputs.map(input => input.viewAttribute);
		}
	});
	Object.defineProperty(viewClass, 'name', { value: viewClassName });
	Object.defineProperty(modelClass, componentRef.selector, { value: viewClass });
	return viewClass;
}

