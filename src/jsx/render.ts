import { BaseComponent } from '../elements/component.js';
import { JsxComponent, Fragment } from './factory.js';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { EventEmitter } from '../core/events.js';
import { JSXTempletExpression, JSXBindingExpression, JSX2BindingExpression, JSXEventExpression } from './jsx-expression.js';
import { HTMLTempletExpression, HTMLBindingExpression, HTML2BindingExpression, HTMLEventExpression } from './html-expression.js';

export class HTMLParser {
	constructor(public template: string) { }
	parse(): JsxComponent {
		return {
			tagName: Fragment,
			attributes: {},
			children: [],
		};
	}
}

export interface Expression {
	init(): void;
}

interface RuleInterface {
	name: string;
	rightHandRegx: RegExp;
	leftHandRegx: { name: string; regExp: RegExp; handler: Function }[];
}

const Rules: RuleInterface[] = [
	{
		name: 'templet',
		rightHandRegx: /\{\{+(\w)+\}\}/g,
		leftHandRegx: [
			{
				name: 'html',
				regExp: /\((\w*)\)/g,
				handler: HTMLTempletExpression,
			},
			{
				name: 'jsx',
				regExp: /(?:\w*)/g,
				handler: JSXTempletExpression,
			},
		],
		//      {{propname}}        $propname     bind-propname
		// rule: [/\{\{+(\w)+\}\}/g, /\$(\w*)/g, /bind-(\w*)/g]
	},
	{
		name: 'binding',
		rightHandRegx: /"(\w*)"/g,
		leftHandRegx: [
			{
				name: 'html',
				regExp: /\[+(\w)+\]/g,
				handler: HTMLBindingExpression,
			},
			{
				name: 'jsx',
				regExp: /bind-(?:\w*)/g,
				handler: JSXBindingExpression,
			},
		],
		// rule: [/\[(\w*)\]/g, /\[(\w*)\]="(\w*)"/g, /$/g]
	},
	{
		name: 'binding2way',
		rightHandRegx: /(\w)/g,
		leftHandRegx: [
			{
				name: 'html',
				regExp: /\[\(+(\w)+\)\]/g,
				handler: HTML2BindingExpression,
			},
			{
				name: 'jsx',
				regExp: /bindon-(?:\w*)/g,
				handler: JSX2BindingExpression,
			},
		],
		// rule: [/\[(\w*)\]/g, /\[(\w*)\]="(\w*)"/g, /$/g]
	},
	{
		name: 'event',
		// (click)="true & onClick($event,nama)"
		// onclick="true & onClick($event,nama)"
		rightHandRegx: /"(\w*) ?(&|\|) ?(\w*)\((,? ?\$?\w)*\)"/g,
		leftHandRegx: [
			{
				name: 'html',
				regExp: /\((\w*)\)/g,
				handler: HTMLEventExpression,
			},
			{
				name: 'jsx',
				regExp: /on(?:\w*)/g,
				handler: JSXEventExpression,
			},
		],
	},
];

export class SyntaxExpression {
	constructor(
		private template: string,
		private element: HTMLElement,
		private view: CustomElementConstructor
	) { }
}

export class ComponentRender {
	template: JsxComponent;

	constructor(public baiseView: BaseComponent & HTMLElement, public componentRef: ComponentRef) {
		if (typeof componentRef.template === 'string') {
			this.template = new HTMLParser(componentRef.template).parse();
		} else if (componentRef.template) {
			this.template = componentRef.template;
		} else if (componentRef.extend) {
			//
		} else {
			throw new Error('Method not implemented.');
		}
	}

	initView(): void {
		this.baiseView.appendChild(this.createElement(this.template));
		this.componentRef.hostListeners?.forEach((listener) =>
			this.handelHostListener(listener)
		);
	}

	createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment {
		const element = this.setupElement(viewTemplate.tagName);

		if (viewTemplate.attributes) {
			for (const key in viewTemplate.attributes) {
				this.handleAttributes(
					<HTMLElement>element,
					key,
					viewTemplate.attributes[key]
				);
			}
		}
		if (viewTemplate.children) {
			for (const child of viewTemplate.children) {
				this.appendChild(element, child);
			}
		}

		return element;
	}

	setupElement(tagName: string): HTMLElement | DocumentFragment {
		if (Fragment === tagName.toLowerCase()) {
			return document.createDocumentFragment();
			// } else if (isTagNameNative(tagName)) {
			//     return document.createElement(tagName);
		} else if (tagName.includes('-')) {
			const registry: ClassRegistry = dependencyInjector.getInstance(
				ClassRegistry
			);
			const componentRef: ComponentRef | undefined = registry.getComponentRef(
				tagName
			);
			return componentRef
				? new componentRef.viewClass()
				: document.createElement(tagName);
		} else {
			return document.createElement(tagName);
		}
	}

	appendChild(parent: Node, child: any) {
		if (typeof child === 'undefined' || child === null) {
			return;
		}
		if ((child as JsxComponent).tagName) {
			parent.appendChild(this.createElement(child));
		} else if (Array.isArray(child)) {
			for (const value of child) {
				this.appendChild(parent, value);
			}
		} else if (typeof child === 'string') {
			parent.appendChild(document.createTextNode(child));
		} else if (child instanceof Node) {
			parent.appendChild(child);
		} else if (typeof child === 'boolean') {
			// <>{condition && <a>Display when condition is true</a>}</>
			// if condition is false, the child is a boolean, but we don't want to display anything
		} else {
			parent.appendChild(document.createTextNode(String(child)));
		}
	}

	handleAttributes(element: HTMLElement, key: string, value: any) {
		// console.log(key, value);

		if (key.startsWith('#')) {
			this.baiseView[key.substring(1)] = element;
			// Reflect.set(this.baiseView, key.substring(1), element);
		} else if (key.startsWith('$')) {
			return;
		} else if (
			key in element &&
			typeof value === 'string' &&
			value.includes('{{') &&
			value.includes('}}')
		) {
			let property = value as string;
			property = property.substring(2, property.length - 3);
			Reflect.set(element, key, this.baiseView[property]);
		} else {
			Reflect.set(element, key, value);
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
