// import { TypeOf } from '../core/decorators.js';
// import { EventEmitter } from '../core/events.js';
// import { isAfterContentChecked, isAfterContentInit, isAfterViewChecked, isAfterViewInit, isDoCheck, isOnChanges, isOnDestroy, isOnInit } from '../core/lifecycle.js';
// import { Observable } from '../core/observable.js';
// import { BaseComponent, HTMLComponent } from '../elements/component.js';
// import { ComponentRef, PropertyRef } from '../elements/elements.js';
// import { Tag } from '../elements/tags.js';
// import { HTMLComponentRender } from '../jsx/html-expression.js';
// import { JSXComponentRender } from '../jsx/jsx-expression.js';
// import { ComponentRender } from '../jsx/render.js';


// export function initTemplateComponentView<T extends Object>(modelClass: TypeOf<T>, componentRef: ComponentRef<T>): TypeOf<HTMLComponent<T>> {
// 	const viewClassName = `${modelClass.name}View`;
// 	const htmlParent = (componentRef.extend as Tag).classRef as TypeOf<HTMLElement>;
// 	let viewClass: TypeOf<HTMLComponent<T>>;
// 	viewClass = class extends htmlParent implements BaseComponent<T> {
// 		// [key: string]: any;

// 		_model: T & { [key: string]: any };
// 		_changeObservable: Observable;
// 		_render: ComponentRender<T>;
// 		_childBindMap: Map<string, Array<string>>;
// 		_parentComponent: BaseComponent<any>;
// 		_parentComponentBindMap: Map<string, string>;

// 		_setAttributeNative: Function;
// 		_getAttributeNative: Function;
// 		_addEventListenerNative: Function;

// 		constructor() {
// 			super();
// 			if (componentRef.encapsulation === 'shadowDom') {
// 				this.attachShadow({ mode: 'open' });
// 			}
// 			// services should be injected her
// 			this._model = new modelClass();
// 			this._changeObservable = new Observable();
// 			this._childBindMap = new Map();
// 			this._render = componentRef.renderType === "html"
// 				? new HTMLComponentRender(this)
// 				: new JSXComponentRender(this);

// 			this._setAttributeNative = this.setAttribute;
// 			this._getAttributeNative = this.getAttribute;
// 			this._addEventListenerNative = this.addEventListener;

// 			this.setAttribute = this._setAttribute;
// 			this.getAttribute = this._getAttribute;
// 			this.addEventListener = this._addEventListener;

// 			componentRef.inputs.forEach(input => {
// 				const inputDefaultValue = this._model[input.modelProperty];
// 				if (inputDefaultValue) {
// 					this._setAttributeHelper(input.viewAttribute, inputDefaultValue);
// 				}
// 			});
// 		}

// 		getComponentRef(): ComponentRef<T> {
// 			return componentRef;
// 		}

// 		setParentComponent(parentComponent: BaseComponent<any>): void {
// 			this._parentComponent = parentComponent;
// 		}

// 		hasParentComponent(): boolean {
// 			return this._parentComponent ? true : false;
// 		}

// 		hasInput(viewProp: string): boolean {
// 			return componentRef.inputs.some(input => input.viewAttribute === viewProp);
// 		}

// 		getInput(viewProp: string): PropertyRef | undefined {
// 			return componentRef.inputs.find(input => input.viewAttribute === viewProp);
// 		}

// 		getInputValue(viewProp: string): any {
// 			const inputRef = this.getInput(viewProp);
// 			if (inputRef) {
// 				return this._model[inputRef.modelProperty];
// 			}
// 		}

// 		setInputValue(viewProp: string, value: any): void {
// 			const inputRef = this.getInput(viewProp);
// 			if (inputRef) {
// 				// console.log('about to change input', inputRef.modelProperty, value);
// 				Reflect.set(this._model, inputRef.modelProperty, value);
// 				this._changeObservable.emit(viewProp);
// 			}
// 		}

// 		hasOutput(viewProp: string): boolean {
// 			return componentRef.outputs.some(output => output.viewAttribute === viewProp);
// 		}

// 		getOutput(viewProp: string): PropertyRef | undefined {
// 			return componentRef.outputs.find(output => output.viewAttribute === viewProp);
// 		}

// 		getEventEmitter<V>(viewProp: string): EventEmitter<V> | undefined {
// 			const outputRef = this.getOutput(viewProp);
// 			if (outputRef) {
// 				return this._model[outputRef.modelProperty] as EventEmitter<V>;
// 			}
// 		}

// 		hasProp(propName: string): boolean {
// 			return Reflect.has(this._model, propName);
// 		}

// 		_setAttributeHelper(attrViewName: string, value: any): void {
// 			if (value === null || value === undefined) {
// 				return;
// 			}
// 			if (typeof value === 'boolean') {
// 				if (value) {
// 					this._setAttributeNative(attrViewName, '');
// 				} else {
// 					this.removeAttribute(attrViewName);
// 				}
// 			} else {
// 				this._setAttributeNative(attrViewName, String(value));
// 			}
// 		}

// 		_setAttribute(attrViewName: string, value: any): void {
// 			this.setInputValue(attrViewName, value);
// 			this._setAttributeHelper(attrViewName, value);
// 		}

// 		_getAttribute(attrViewName: string): string | null {
// 			return this.getInputValue(attrViewName);
// 		}

// 		doBlockCallback = (): void => {
// 			if (isDoCheck(this._model)) {
// 				this._model.doCheck();
// 			}
// 		};

// 		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
// 			// console.log('attributeChangedCallback', name, oldValue, newValue);
// 			if (newValue === oldValue) {
// 				return;
// 			}
// 			this._changeObservable.emit(name);
// 			if (isOnChanges(this._model)) {
// 				this._model.onChanges();
// 			}
// 			this.doBlockCallback();
// 		}

// 		connectedCallback() {
// 			let oldAttrValus = [].slice.call(this.attributes);

// 			if (!this.hasParentComponent()) {
// 				oldAttrValus.forEach((attr: Attr) => {
// 					Reflect.set(this, attr.name, attr.value);
// 				});
// 			}
// 			if (isOnChanges(this._model)) {
// 				this._model.onChanges();
// 			}
// 			if (isOnInit(this._model)) {
// 				this._model.onInit();
// 			}
// 			if (isDoCheck(this._model)) {
// 				this._model.doCheck();
// 			}
// 			if (isAfterContentInit(this._model)) {
// 				this._model.afterContentInit();
// 			}
// 			if (isAfterContentChecked(this._model)) {
// 				this._model.afterContentChecked();
// 			}

// 			// setup ui view
// 			this._render.initView();

// 			if (componentRef.encapsulation === 'template' && !this.hasParentComponent()) {
// 				Array.prototype.slice.call(this.attributes).forEach((attr: Attr) => {
// 					this.initOuterAttribute(attr);
// 				});
// 			}

// 			if (componentRef.view) {
// 				// this._model[componentRef.view] = this;
// 				Reflect.set(this._model, componentRef.view, this);
// 			}

// 			if (isAfterViewInit(this._model)) {
// 				this._model.afterViewInit();
// 			}
// 			if (isAfterViewChecked(this._model)) {
// 				this._model.afterViewChecked();
// 			}
// 			this.doBlockCallback = () => {
// 				if (isDoCheck(this._model)) {
// 					this._model.doCheck();
// 				}
// 				if (isAfterContentChecked(this._model)) {
// 					this._model.afterContentChecked();
// 				}
// 				if (isAfterViewChecked(this._model)) {
// 					this._model.afterViewChecked();
// 				}
// 			};
// 		}

// 		initOuterAttribute(attr: Attr) {
// 			// [window, this] scop
// 			let elementAttr = attr.name;
// 			let modelProperty = attr.value;
// 			if (elementAttr.startsWith('(')) {
// 				// (elementAttr)="modelProperty()"
// 				elementAttr = elementAttr.substring(1, elementAttr.length - 1);
// 				// this.handleEvent(element, elementAttr, viewProperty);
// 				modelProperty = modelProperty.endsWith('()') ?
// 					modelProperty.substring(0, modelProperty.length - 2) : modelProperty;
// 				let callback: Function = Reflect.get(window, modelProperty);
// 				this.addEventListener(elementAttr, event => {
// 					callback(event);
// 				});
// 			} else if (elementAttr.startsWith('on')) {
// 				const modelEvent = this.getEventEmitter<any>(elementAttr.substring(2));
// 				if (modelEvent) {
// 					// modelEvent.subscribe(listener);
// 					modelProperty = modelProperty.endsWith('()') ?
// 						modelProperty.substring(0, modelProperty.length - 2) : modelProperty;
// 					let listener: Function = Reflect.get(window, modelProperty);
// 					modelEvent.subscribe((data: any) => {
// 						(listener as Function)(data);
// 					});
// 				}
// 			}
// 		}

// 		adoptedCallback() {
// 			// restart the process
// 			this.innerHTML = '';
// 			this.connectedCallback();
// 		}

// 		disconnectedCallback() {
// 			// notify first, then call model.onDestroy func
// 			this._changeObservable.emit('destroy');
// 			if (isOnDestroy(this._model)) {
// 				this._model.onDestroy();
// 			}
// 		}

// 		// events api
// 		_addEventListener(eventType: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
// 			if ('on' + eventType in this) {
// 				// this._nativeAddEventListener(eventType, listener, options);
// 				this._addEventListenerNative(eventType, (event: Event) => {
// 					(listener as Function)(event);
// 				}, options);
// 				return;
// 			}
// 			const modelEvent = this.getEventEmitter<any>(eventType);
// 			if (modelEvent) {
// 				// modelEvent.subscribe(listener);
// 				modelEvent.subscribe((data: any) => {
// 					(listener as Function)(data);
// 				});
// 			}
// 			else {
// 				this._changeObservable.subscribe(eventType, (listener as EventListener));
// 			}
// 		}

// 		triggerEvent(eventName: string, value?: any): void {
// 			const modelEvent = this.getEventEmitter<any>(eventName);
// 			if (modelEvent) {
// 				modelEvent.emit(value);
// 				return;
// 			}
// 		}

// 		triggerChangeEvent(eventName: string, value?: any): void {
// 			if (this._changeObservable.has(eventName)) {
// 				if (value || typeof value === 'boolean') {
// 					this._changeObservable.emitValue(eventName, value);
// 				} else {
// 					this._changeObservable.emit(eventName);
// 				}
// 			}
// 			if (this.hasParentComponent()) {
// 				this.triggerParentEvent(value);
// 			}
// 		}

// 		bindAttr(view: string, elementAttr: string): void {
// 			let viewAttr = this._childBindMap.get(view);
// 			if (viewAttr) {
// 				viewAttr.push(elementAttr);
// 			} else {
// 				this._childBindMap.set(view, [elementAttr]);
// 			}
// 		}

// 		getBindAttr(view: string): string[] {
// 			return this._childBindMap.get(view) || [];
// 		}

// 		searchBindAttr(elementAttr: string): string[] {
// 			return [...this._childBindMap.entries()]
// 				.filter(entry =>
// 					entry[1]
// 						.some(item => elementAttr.startsWith(item))
// 				)
// 				.flatMap(entry => entry[0]);
// 		}

// 		notifyParentComponent(eventName: string): void {
// 			if (this.hasParentComponent()) {
// 				let attrs = this._parentComponent.searchBindAttr(eventName);
// 				attrs.forEach(view => {
// 					this._parentComponent.triggerEvent(view);
// 				});
// 			}
// 		}

// 		searchParentBindAttr(elementAttr: string): [string, string] | undefined {
// 			if (this._parentComponentBindMap) {
// 				return [...this._parentComponentBindMap.entries()]
// 					.find(row => elementAttr.startsWith(row[0]));
// 			}
// 		}

// 		matchParentEvent(elementAttr: string): string | undefined {
// 			let data = this.searchParentBindAttr(elementAttr);
// 			if (data) {
// 				elementAttr = elementAttr.replace(data[0], data[1]);
// 				return elementAttr;
// 			}
// 		}

// 		triggerParentEvent(elementAttr: string): void {
// 			if (this.hasParentComponent()) {
// 				let parnetEventName = this.matchParentEvent(elementAttr);
// 				if (parnetEventName) {
// 					this._parentComponent._changeObservable.emit(parnetEventName);
// 				}
// 			}
// 			// else if (componentRef.isRichHTML) {
// 			// 	this.triggerEvent(elementAttr);
// 			// }
// 		}
// 	};

// 	componentRef.inputs.forEach(input => {
// 		Object.defineProperty(viewClass.prototype, input.viewAttribute, {
// 			get(): any {
// 				return this._model[input.modelProperty];
// 			},
// 			set(value: any) {
// 				this._model[input.modelProperty] = value;
// 			},
// 			enumerable: true
// 		});
// 	});

// 	componentRef.outputs.forEach(output => {
// 		Object.defineProperty(viewClass.prototype, output.viewAttribute, {
// 			get(): EventEmitter<any> {
// 				return this._model[output.modelProperty];
// 			},
// 			enumerable: true
// 		});
// 	});
// 	Object.defineProperty(viewClass, 'observedAttributes', {
// 		get() {
// 			return componentRef.inputs.map(input => input.viewAttribute);
// 		}
// 	});
// 	Object.defineProperty(modelClass, viewClassName, { value: viewClass });
// 	Object.defineProperty(viewClass, 'name', { value: viewClassName });
// 	return viewClass;
// }
