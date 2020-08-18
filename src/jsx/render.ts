import { HTMLComponent, isHTMLComponent } from '../elements/component.js';
import { JsxComponent, Fragment } from './factory.js';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { EventEmitter } from '../core/events.js';
import { getValueByPath, setValueByPath, updateAttribute, updateValue } from '../core/utils.js';

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
	componentRef: ComponentRef<T>
	template: JsxComponent;
	templateRegExp: RegExp;

	constructor(public baiseView: HTMLComponent<T>) {
		this.componentRef = baiseView.getComponentRef();
	}

	initElementData(element: HTMLElement, elementAttr: string, viewProperty: string, isAttr: boolean) {
		if (isAttr) {
			updateAttribute(element, elementAttr, this.baiseView._model, viewProperty);
		} else {
			updateValue(this.baiseView._model, viewProperty, element, elementAttr);
		}
	}

	updateElementData(element: HTMLElement | Text, elementAttr: string, viewProperty: string, isAttr: boolean) {
		if (isAttr && element instanceof HTMLElement) {
			updateAttribute(element, elementAttr, this.baiseView._model, viewProperty);
		}
		updateValue(this.baiseView._model, viewProperty, element, elementAttr);
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
			this.baiseView.triggerParentEvent(viewProperty);
		};
		element.addEventListener(getChangeEventName(element, elementAttr), eventListener);
	}

	addViewPropertyBinding(element: HTMLElement, elementAttr: string, viewProperty: string, isAttr: boolean) {
		this.baiseView.addEventListener(getChangeEventName(this.baiseView, viewProperty), () => {
			this.updateElementData(element, elementAttr, viewProperty, isAttr);
		});
	}

	attrTemplateHandler(element: HTMLElement | Text, elementAttr: string, viewProperty: string, isAttr?: boolean) {
		const result = [...viewProperty.matchAll(this.templateRegExp)];
		if (result.length === 0) {
			return;
		}
		const handler = () => {
			let renderText = viewProperty;
			result.forEach(match => {
				let tempValue = getValueByPath(this.baiseView._model, match[1]);
				if (typeof tempValue === 'function') {
					tempValue = tempValue.call(this.baiseView._model);
				}
				renderText = renderText.replace(match[0], tempValue);
			});
			if (isAttr && element instanceof HTMLElement) {
				element.setAttribute(elementAttr, renderText);
			} else {
				setValueByPath(element, elementAttr, renderText);
			}

		}
		result.forEach(match => this.baiseView._changeObservable.subscribe(match[1], handler));
		this.baiseView._changeObservable.emit(result[0][1]);
	}

	initView(): void {
		if (this.componentRef.template) {
			this.template = this.componentRef.template(this.baiseView._model);
			if (this.baiseView.shadowRoot && this.componentRef.encapsulation === 'shadowDom') {
				this.baiseView.shadowRoot.appendChild(this.createElement(this.template));
			} else {
				this.baiseView.appendChild(this.createElement(this.template));
			}
		}
		this.componentRef.hostListeners?.forEach((listener) =>
			this.handelHostListener(listener)
		);
	}

	createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment {
		const element = this.createElementByTagName(viewTemplate.tagName, viewTemplate.attributes?.is);
		if (viewTemplate.attributes) {
			const bindMap: Map<string, string> = new Map();
			for (const key in viewTemplate.attributes) {
				this.initAttribute(<HTMLElement>element, key, viewTemplate.attributes[key], bindMap);
			}
			if (isHTMLComponent(element)) {
				element._parentComponentBindMap = bindMap;
			}
		}
		if (viewTemplate.children && viewTemplate.children.length > 0) {
			for (const child of viewTemplate.children) {
				this.appendChild(element, child);
			}
		}
		return element;
	}

	abstract initAttribute(element: HTMLElement, propertyKey: string, propertyValue: any, bindMap: Map<string, string>): void;

	createElementByTagName(tagName: string, is?: string): HTMLElement | DocumentFragment {
		if (Fragment === tagName.toLowerCase()) {
			return document.createDocumentFragment();
		}
		else if (tagName.includes('-')) {
			let element: HTMLElement;
			let ViewClass = customElements.get(tagName);
			if (ViewClass) {
				element = new ViewClass();
			}
			else {
				element = document.createElement(tagName);
				customElements.whenDefined(tagName).then(() => {
					customElements.upgrade(element);
					ViewClass = customElements.get(tagName);
					if (!(element instanceof ViewClass)) {
						const newChild = new ViewClass();
						[].slice.call(element.attributes).forEach((attr: Attr) => {
							newChild.setAttribute(attr.name, attr.value);
						});
						Object.getOwnPropertyNames(element).forEach(key => {
							Reflect.set(newChild, key, Reflect.get(element, key));
						})
						// element.parentElement?.replaceChild(newChild, element);
						element.replaceWith(newChild);
					}
				});
			}
			// const registry: ClassRegistry = dependencyInjector.getInstance(ClassRegistry);
			// const componentRef = registry.getComponentRef<any>(tagName);

			// if (componentRef) {
			// 	if (componentRef.extend.classRef !== HTMLElement) {
			// 		element = document.createElement(componentRef.extend.name as string, { is: tagName });
			// 		// element.setAttribute('is', tagName);
			// 	} else {
			// 		element = new componentRef.viewClass();
			// 	}
			// } else {
			// 	element = document.createElement(tagName, { is: tagName });
			// }
			Reflect.set(element, '_parentComponent', this.baiseView);
			return element;
		}
		else {
			// native tags // and custom tags
			const element = document.createElement(tagName, is ? { is } : undefined);
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
		// this.textChildTemplateHandler(node, 'textContent');
		this.attrTemplateHandler(node, 'textContent', child);
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
		}
		else if (Reflect.has(source, 'on' + eventName)) {
			this.addNativeEventListener(source, eventName, eventCallback);
		}
		else if (this.componentRef.encapsulation === 'template' && !this.baiseView._parentComponent) {
			this.addNativeEventListener(this.baiseView, eventName, eventCallback);
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
