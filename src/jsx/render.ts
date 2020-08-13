import { BaseComponent, isBaseComponent } from '../elements/component.js';
import { JsxComponent, Fragment } from './factory.js';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { EventEmitter } from '../core/events.js';
import { getValueByPath, setValueByPath, updateAttribute, updateValue } from '../core/utils.js';
import { findByModelClassOrCreat } from '../reflect/bootstrap-data.js';

// export interface Expression {
// 	init(): void;
// }

// interface RuleInterface {
// 	name: string;
// 	rightHandRegx: RegExp;
// 	leftHandRegx: { name: string; regExp: RegExp; handler: Function }[];
// }

// const Rules: RuleInterface[] = [
// 	{
// 		name: 'templet',
// 		rightHandRegx: /\{\{+(\w)+\}\}/g,
// 		leftHandRegx: [
// 			{
// 				name: 'html',
// 				regExp: /\((\w*)\)/g,
// 				handler: HTMLTempletExpression,
// 			},
// 			{
// 				name: 'jsx',
// 				regExp: /(?:\w*)/g,
// 				handler: JSXTempletExpression,
// 			},
// 		],
// 		//      {{propname}}        $propname     bind-propname
// 		// rule: [/\{\{+(\w)+\}\}/g, /\$(\w*)/g, /bind-(\w*)/g]
// 	},
// 	{
// 		name: 'binding',
// 		rightHandRegx: /"(\w*)"/g,
// 		leftHandRegx: [
// 			{
// 				name: 'html',
// 				regExp: /\[+(\w)+\]/g,
// 				handler: HTMLBindingExpression,
// 			},
// 			{
// 				name: 'jsx',
// 				regExp: /bind-(?:\w*)/g,
// 				handler: JSXBindingExpression,
// 			},
// 		],
// 		// rule: [/\[(\w*)\]/g, /\[(\w*)\]="(\w*)"/g, /$/g]
// 	},
// 	{
// 		name: 'binding2way',
// 		rightHandRegx: /(\w)/g,
// 		leftHandRegx: [
// 			{
// 				name: 'html',
// 				regExp: /\[\(+(\w)+\)\]/g,
// 				handler: HTML2BindingExpression,
// 			},
// 			{
// 				name: 'jsx',
// 				regExp: /bindon-(?:\w*)/g,
// 				handler: JSX2BindingExpression,
// 			},
// 		],
// 		// rule: [/\[(\w*)\]/g, /\[(\w*)\]="(\w*)"/g, /$/g]
// 	},
// 	{
// 		name: 'event',
// 		// (click)="true & onClick($event,nama)"
// 		// onclick="true & onClick($event,nama)"
// 		rightHandRegx: /"(\w*) ?(&|\|) ?(\w*)\((,? ?\$?\w)*\)"/g,
// 		leftHandRegx: [
// 			{
// 				name: 'html',
// 				regExp: /\((\w*)\)/g,
// 				handler: HTMLEventExpression,
// 			},
// 			{
// 				name: 'jsx',
// 				regExp: /on(?:\w*)/g,
// 				handler: JSXEventExpression,
// 			},
// 		],
// 	},
// ];

////////////////////////////<BINDING>///////////////////////////////////////////////

// interface BindMap {
// 	[key: string]: string
// }

// interface Binding {
// 	view: HTMLElement;
// 	element: HTMLElement;
// 	model: BindMap;
// 	bindingOneWay: BindMap;
// 	bindingTwoWay: BindMap;
// }

// let elements: Binding[] = [];


// const registerBinding = (item: Binding) => {
// 	elements.push(item);
// };

// const removeBinding = (view: HTMLElement) => {
// 	elements = elements.filter(item => item.view !== view);
// };

// function bindOneWay(item: Binding, elementAttr: string, modelProperty: string): void {
// 	const modelValue = getValueByPath(item.model, modelProperty);
// 	const elementValue = getValueByPath(item.element, elementAttr);
// 	if (modelValue !== elementValue) {
// 		setValueByPath(item.element, elementAttr, modelValue);
// 	}
// }

// function bindTwoWay(item: Binding, elementAttr: string, modelProperty: string): void {
// 	const modelValue = getValueByPath(item.model, modelProperty);
// 	const elementValue = getValueByPath(item.element, elementAttr);
// 	const elementOldValue = getValueByPath(item.element, 'old' + elementAttr);
// 	if (elementValue !== elementOldValue) {
// 		if (elementValue !== modelValue) {
// 			setValueByPath(item.model, modelProperty, elementValue);
// 		}
// 		setValueByPath(item.element, 'old' + elementAttr, elementValue);
// 	}

// }

// setInterval(function () {
// 	if (elements.length === 0) { return; }
// 	elements.forEach(item => {
// 		Object.keys(item.bindingOneWay).forEach(key => {
// 			bindOneWay(item, key, item.bindingOneWay[key]);
// 		});
// 		Object.keys(item.bindingTwoWay).forEach(key => {
// 			bindTwoWay(item, key, item.bindingTwoWay[key]);
// 		});
// 	});
// }, 100);

////////////////////////////<BINDING>///////////////////////////////////////////////

function getChangeEventName(element: HTMLElement, elementAttr: string) {
	if (elementAttr === 'value') {
		if (element instanceof HTMLInputElement) {
			return 'input';
		} else if (element instanceof HTMLSelectElement
			|| element instanceof HTMLTextAreaElement) {
			return 'change';
		}
	}
	return elementAttr;
}


export abstract class ComponentRender<T> {
	template: JsxComponent;
	templateRegExp: RegExp;

	constructor(public baiseView: BaseComponent<T> & HTMLElement,
		public componentRef: ComponentRef<T>) {
	}

	updateElementData(element: HTMLElement, elementAttr: string, viewProperty: string) {
		if (isBaseComponent(element)) {
			let prototype = element._model.constructor.prototype
			var bootstrap: ComponentRef<any> = findByModelClassOrCreat(prototype);
			let input = bootstrap.inputs.find(input => input.viewAttribute === elementAttr);
			if (input) {
				updateAttribute(element, elementAttr, this.baiseView._model, viewProperty);
			} else {
				updateValue(this.baiseView._model, viewProperty, element, elementAttr);
			}
		} else {
			updateValue(this.baiseView._model, viewProperty, element, elementAttr);
		}
	}

	updateViewData(element: HTMLElement, elementAttr: string, viewProperty: string) {
		let input = this.componentRef.inputs.find(input => input.viewAttribute === viewProperty);
		if (input) {
			updateValue(element, elementAttr, this.baiseView._model, input.modelProperty);
		} else {
			updateValue(element, elementAttr, this.baiseView._model, viewProperty);
		}
	}


	addElementPropertyBinding(element: HTMLElement, elementAttr: string, viewProperty: string) {
		this.baiseView.bindAttr(viewProperty, elementAttr);
		const eventListener = () => {
			this.updateViewData(element, elementAttr, viewProperty);
			// console.log(element.tagName.toLowerCase(), elementAttr, viewProperty, this.baiseView._bindMap);
			this.baiseView.notifyParentComponent(viewProperty);
		};
		element.addEventListener(getChangeEventName(element, elementAttr), eventListener);
	}

	addViewPropertyBinding(element: HTMLElement, elementAttr: string, viewProperty: string) {
		this.baiseView.addEventListener(getChangeEventName(this.baiseView, viewProperty), () => {
			this.updateElementData(element, elementAttr, viewProperty);
		});
		// let bind: any[] = Reflect.get(element, '_bind') || [];
		// bind.push({ elementAttr, viewProperty });
		// Reflect.set(element, '_bind', bind);
	}


	templateHandler(element: Object, elemProp: string): void {
		const templateText: string = Reflect.get(element, elemProp);
		const result = [...templateText.matchAll(this.templateRegExp)];
		if (result.length === 0) {
			return;
		}
		const handler = () => {
			let renderText = templateText;
			result.forEach(match => {
				let tempValue = getValueByPath(this.baiseView._model, match[1]);
				if (typeof tempValue === 'function') {
					tempValue = tempValue.call(this.baiseView._model);
				}
				renderText = renderText.replace(match[0], tempValue);
			});
			Reflect.set(element, elemProp, renderText);
		}
		// result.forEach(match => this.baiseView._observable.subscribe(match[1], handler));
		// this.baiseView._observable.emit(result[0][1]);
	}

	initView(): void {
		if (this.componentRef.template) {
			this.template = this.componentRef.template(this.baiseView._model);
			this.baiseView.appendChild(this.createElement(this.template));
		}
		this.componentRef.hostListeners?.forEach((listener) =>
			this.handelHostListener(listener)
		);
	}

	createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment {
		const element = this.createElementByTagName(viewTemplate.tagName);
		if (viewTemplate.attributes) {
			for (const key in viewTemplate.attributes) {
				this.initAttribute(<HTMLElement>element, key, viewTemplate.attributes[key]);
			}
		}
		if (viewTemplate.children) {
			for (const child of viewTemplate.children) {
				this.appendChild(element, child);
			}
		}
		return element;
	}

	abstract initAttribute(element: HTMLElement, propertyKey: string, propertyValue: any): void;

	addOnChangeEventListener(element: HTMLElement, elementAttr: string, viewProperty: string): void {
		// this.bindOneWayAttribute(element, elementAttr, modelProperty);
		element.addEventListener(getChangeEventName(element, elementAttr), () => {
			const value = getValueByPath(element, elementAttr);
			console.log(elementAttr, viewProperty, value);
			setValueByPath(this.baiseView._model, viewProperty, value);
			// let dotIndex = viewProperty.indexOf('.');
			// let fireEventName = dotIndex > 0 ? viewProperty.substring(0, dotIndex) : viewProperty;
			// let eventValue = this.baiseView[fireEventName];
			// fireEventName += 'Change';
			// this.componentRef.outputs
			// 	.filter(out => out.viewAttribute === fireEventName)
			// 	.map(out => this.baiseView._model[out.modelProperty] as EventEmitter<any>)
			// 	.forEach(outEvent =>
			// 		outEvent.emit(eventValue)
			// 	);

			// updateAttribute(this.baiseView, viewProperty, element, elementAttr);
			// this.baiseView._observable.emit(modelProperty);
			// let outs = this.componentRef.outputs.filter(out => out.modelProperty === modelProperty);
			// if (outs?.length === 1) {

			// }
		});
		// this.baiseView.addEventListener(getChangeEventName(this.baiseView, viewProperty), () => {
		// const eventValue = getValueByPath(this.baiseView, viewProperty);
		// // setValueByPath(element, elementAttr, value);
		// viewProperty += 'Change';
		// this.componentRef.outputs
		// 	.filter(out => out.viewAttribute === viewProperty)
		// 	.map(out => this.baiseView._model[out.modelProperty] as EventEmitter<any>)
		// 	.forEach(outEvent => outEvent.emit(eventValue));
		// });
		let bind: any[] = Reflect.get(element, '_bind') || [];
		bind.push({ elementAttr, viewProperty });
		Reflect.set(element, '_bind', bind);
	}

	elementRender(element: any) {
		if (element instanceof HTMLElement) {
			let bind: { elementAttr: string, viewProperty: string }[] = Reflect.get(element, '_bind');
			bind?.forEach(args => {
				this.updateElementData(element, args.elementAttr, args.viewProperty);
			});
			element.childNodes.forEach(child => {
				this.elementRender(child);
			});
		}
	}


	updateViewHTML() {
		this.baiseView.childNodes.forEach(child => {
			this.elementRender(child);
		});
	}

	createElementByTagName(tagName: string): HTMLElement | DocumentFragment {
		if (Fragment === tagName.toLowerCase()) {
			return document.createDocumentFragment();
			// 	// } else if (isTagNameNative(tagName)) {
			// 	//     return document.createElement(tagName);
			// } else if (tagName.includes('-')) {
			// 	const registry: ClassRegistry = dependencyInjector.getInstance(ClassRegistry);
			// 	const componentRef: ComponentRef<T> | undefined = registry.getComponentRef(tagName);
			// 	const element =  componentRef ?
			// 		new componentRef.viewClass() : document.createElement(tagName);
			//  Reflect.set(element, '_parentComponent', this.baiseView);
			//  return element;
		} else {
			// native tags // and custom tags
			const element = document.createElement(tagName);
			Reflect.set(element, '_parentComponent', this.baiseView);
			return element;
		}
	}

	appendChild(parent: Node, child: any) {
		if (!child) {
			return;
		}

		if (typeof child === 'string') {
			this.appendTextNode(parent, String(child));
		} else if (Array.isArray(child)) {
			for (const value of child) {
				this.appendChild(parent, value);
			}
		} else if (child instanceof Node) {
			parent.appendChild(child);
		} else if (typeof child === 'boolean') {
			// <>{condition && <a>Display when condition is true</a>}</>
			// if condition is false, the child is a boolean, but we don't want to display anything
		} else if (typeof child === 'object' && Reflect.has(child, 'tagName')) {
			parent.appendChild(this.createElement(child));
		} else {
			this.appendTextNode(parent, String(child));
		}
	}

	appendTextNode(parent: Node, child: string) {
		var node = document.createTextNode(child);
		parent.appendChild(node);
		this.templateHandler(node, 'textContent');
	}

	handelHostListener(listener: ListenerRef) {
		let eventName: string = listener.eventName,
			source: HTMLElement | Window,
			eventCallback: Function = this.baiseView._model[listener.modelCallbackName];
		if (listener.eventName.includes(':')) {
			const eventSource = eventName.substring(0, eventName.indexOf(':'));
			eventName = eventName.substring(eventName.indexOf(':') + 1);
			if ('window' === eventSource.toLowerCase()) {
				source = window;
				this.addNativeEventListener(source, eventName, eventCallback);
				return;
			} else if (eventSource in this.baiseView) {
				source = Reflect.get(this.baiseView, eventSource);
				if (!Reflect.has(source, '_model')) {
					this.addNativeEventListener(source, eventName, eventCallback);
					return;
				}
			} else {
				source = this.baiseView;
			}
		} else {
			source = this.baiseView;
		}
		const sourceModel = Reflect.get(source, '_model');
		const output = dependencyInjector
			.getInstance(ClassRegistry)
			.hasOutput(sourceModel, eventName);
		if (output) {
			(sourceModel[(output as PropertyRef).modelProperty] as EventEmitter<any>).subscribe((value: any) => {
				eventCallback.call(sourceModel, value);
			});
		} else if (Reflect.has(source, 'on' + eventName)) {
			this.addNativeEventListener(source, eventName, eventCallback);
		}
	}
	addNativeEventListener(source: HTMLElement | Window, eventName: string, funcallback: Function) {
		source.addEventListener(eventName, (event: Event) => {
			// funcallback(event);
			funcallback.call(this.baiseView._model, event);
		});
	}
	private hasEventEmitter(source: HTMLElement | Window, eventName: string) {
		if (this.componentRef.outputs) {
			for (const output of this.componentRef.outputs) {
				if (output.viewAttribute === eventName) {
					return true;
				}
			}
		}
		return false;
	}
}
