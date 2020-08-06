import { BaseComponent } from '../elements/component.js';
import { JsxComponent, Fragment } from './factory.js';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { EventEmitter } from '../core/events.js';
import { JSXTempletExpression, JSXBindingExpression, JSX2BindingExpression, JSXEventExpression } from './jsx-expression.js';
import { HTMLTempletExpression, HTMLBindingExpression, HTML2BindingExpression, HTMLEventExpression, parseHtmlToJsxComponent, toJSXRender } from './html-expression.js';
import { getByPath as getByPath, setValueByPath } from '../core/utils.js';

export class HTMLParser {
	constructor(public template: string) { }
	parse(): JsxComponent {
		return parseHtmlToJsxComponent(this.template) as JsxComponent;
		// return {
		// 	tagName: Fragment,
		// 	attributes: {},
		// 	children: [],
		// };
	}
}

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

// export class SyntaxExpression {
// 	constructor(private template: string, private element: HTMLElement, private view: CustomElementConstructor) { }
// }

export class ComponentRender<T> {
	template: JsxComponent;

	constructor(public baiseView: BaseComponent & HTMLElement, public componentRef: ComponentRef<T>) {
		// if (typeof componentRef.template === 'string') {
		// 	this.template = new HTMLParser(componentRef.template).parse();
		// 	// } else if (componentRef.template) {
		// 	// 	this.template = componentRef.template(this.baiseView._model);
		// } else if (componentRef.extend) {
		// 	//
		// } else {
		// 	throw new Error('Method not implemented.');
		// }
	}

	templateHandler(element: Object, elemProp: string, regex?: RegExp): void {
		const templateText: string = Reflect.get(element, elemProp);
		const result = [...templateText.matchAll(regex || (/\{\{((\w| |\.|\+|-|\*|\\)*(\(\))?)\}\}/g))];
		if (result.length === 0) {
			return;
		}
		const handler = () => {
			let renderText = templateText;
			result.forEach(match => {
				let tempValue = getByPath(this.baiseView._model, match[1]);
				if (typeof tempValue === 'function') {
					tempValue = tempValue.call(this.baiseView._model);
				}
				renderText = renderText.replace(match[0], tempValue);
			});
			Reflect.set(element, elemProp, renderText);
		}
		result.forEach(match => this.baiseView._observable.subscribe(match[1], handler));
		this.baiseView._observable.emit(result[0][1]);
	}

	// printNode(node: Node) {

	// 	if (node instanceof Text && node.textContent) {
	// 		this.templateHandler(node, 'textContent');
	// 	} else if (node instanceof Element) {
	// 		// console.group(node.nodeName);
	// 		for (let i = 0; i < node.attributes.length; i++) {
	// 			const attr = node.attributes[i];

	// 			if (attr.name.match(/\[\((\w*)\)\]/g)) { // two way binding
	// 				const result = [...attr.value.matchAll(/\[\((\w*)\)\]/g)];
	// 				result.forEach(match => {
	// 					// console.log('two way', match);
	// 					// let tempValue = match[2] ? this.baiseView._model[match[1]]() : this.baiseView._model[match[1]];
	// 					// renderText = renderText.replace(match[0], tempValue);
	// 				});
	// 			} else if (attr.name.match(/\[(\w*)\]/g)) {  // one way binding
	// 				const result = [...attr.value.matchAll(/\[(\w*)\]/g)];
	// 				result.forEach(match => {
	// 					// console.log('one way ', match);
	// 					// let tempValue = match[2] ? this.baiseView._model[match[1]]() : this.baiseView._model[match[1]];
	// 					// renderText = renderText.replace(match[0], tempValue);
	// 				});
	// 			} else if (attr.value.match(/\{\{(.+\w*)*\}\}/g)) {  // templet; -- one time write
	// 				const result = [...attr.value.matchAll(/\{\{(.+\w*)*\}\}/g)];
	// 				let renderText = attr.value;
	// 				result.forEach(match => {
	// 					let tempValue = getByPath(this.baiseView._model, match[1]);
	// 					setValueByPath(node, attr.name, tempValue);
	// 					renderText = renderText.replace(match[0], tempValue);
	// 				});
	// 				attr.value = renderText;
	// 			}
	// 		}
	// 		node.childNodes.forEach(child => this.printNode(child));
	// 		// console.groupEnd();
	// 	}
	// }

	// initViewFromString(): void {
	// 	var template = document.createElement('template');
	// 	template.innerHTML = this.componentRef.template as string;
	// 	template.content.childNodes.forEach(child => this.printNode(child));
	// 	// console.log(template);
	// 	// this.baiseView.innerHTML = this.componentRef.template as string;
	// 	this.baiseView.appendChild(template.content);
	// }

	initView(): void {
		// if (typeof this.componentRef.template === 'string') {
		// 	// this.initViewFromString();
		// 	// const component = parseHtmlToJsxComponent(this.componentRef.template);
		// 	// if (component) {
		// 	// 	this.template = component;
		// 	// }
		// 	this.template = parseHtmlToJsxComponent(this.componentRef.template) as JsxComponent;
		// 	// this.template = toJSXRender(this.componentRef.template)(this.baiseView._model);
		// } else {
		// 	this.template = this.componentRef.template(this.baiseView._model);
		// }

		if (typeof this.componentRef.template === 'string') {
			this.template = new HTMLParser(this.componentRef.template).parse();
		} else if (this.componentRef.template) {
			this.template = this.componentRef.template(this.baiseView._model);
		}
		this.baiseView.appendChild(this.createElement(this.template));
		this.componentRef.hostListeners?.forEach((listener) =>
			this.handelHostListener(listener)
		);

	}

	createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment {
		const element = this.createElementByTagName(viewTemplate.tagName);

		if (viewTemplate.attributes) {
			for (const key in viewTemplate.attributes) {
				this.handleAttributes(<HTMLElement>element, key, viewTemplate.attributes[key]);
			}
		}
		if (viewTemplate.children) {
			for (const child of viewTemplate.children) {
				this.appendChild(element, child);
			}
		}

		return element;
	}

	createElementByTagName(tagName: string): HTMLElement | DocumentFragment {
		if (Fragment === tagName.toLowerCase()) {
			return document.createDocumentFragment();
			// } else if (isTagNameNative(tagName)) {
			//     return document.createElement(tagName);
		} else if (tagName.includes('-')) {
			const registry: ClassRegistry = dependencyInjector.getInstance(ClassRegistry);
			const componentRef: ComponentRef<T> | undefined = registry.getComponentRef(tagName);
			return componentRef ?
				new componentRef.viewClass() : document.createElement(tagName);
		} else {
			// native tags
			return document.createElement(tagName);
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
		} else if (Reflect.has(child, 'tagName')) {
			parent.appendChild(this.createElement(child));
		} else {
			this.appendTextNode(parent, String(child));
		}
	}

	appendTextNode(parent: Node, child: string) {
		var node = document.createTextNode(child);
		parent.appendChild(node);
		if ((/\$(\w*)(\(\))?/g).test(child)) {
			this.templateHandler(node, 'textContent', /\$(\w*)(\(\))?/g);
		} else {
			this.templateHandler(node, 'textContent');
		}
	}

	handleAttributes(element: HTMLElement, key: string, value: any) {
		// console.log(key, value);

		if (key.startsWith('#')) {
			// this.baiseView[key.substring(1)] = element;
			Reflect.set(this.baiseView, key.substring(1), element);
		} else if (key.startsWith('$')) {
			return;
		} else if (key.startsWith('[')) {
			return;
		} else if (key.startsWith('(')) {
			return;
		} else if (typeof value === 'string' && (/\{\{(.+\w*)*\}\}/g).test(value)) {
			let propertyName = value.substring(2, value.length - 2);
			// this.templateHandler(element, key);
			element.setAttribute(key, this.baiseView._model[propertyName]);
		} else {
			if (typeof value === 'boolean' && value) {
				element.setAttribute(key, '');
			} else {
				element.setAttribute(key, value);
			}
		}
	}

	handelHostListener(listener: ListenerRef) {
		let eventName: string = listener.eventName,
			source: HTMLElement | Window,
			eventCallback: Function = this.baiseView._model[
				listener.modelCallbackName
			];
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
