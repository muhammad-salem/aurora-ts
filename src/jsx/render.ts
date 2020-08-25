import { EventEmitter } from '../core/events.js';
import { getValueByPath, setValueByPath, updateAttribute, updateValue } from '../core/utils.js';
import { HTMLComponent, isHTMLComponent } from '../elements/component.js';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements.js';
import { isModel, subscribe1way, subscribe2way } from '../model/model-change-detection.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { Fragment, JsxComponent } from './factory.js';
import { ElementMutation } from './mutation.js';

function getChangeEventName(element: HTMLElement, elementAttr: string): string {
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
	nativeElementMutation: ElementMutation;

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

	updateElementData(element: HTMLElement | Text, elementAttr: string, modelProperty: string, isAttr: boolean) {
		// if (isAttr && element instanceof HTMLElement) {
		// 	updateAttribute(element, elementAttr, this.baiseView._model, modelProperty);
		// }
		updateValue(this.baiseView._model, modelProperty, element, elementAttr);
	}

	updateViewData(element: HTMLElement, elementAttr: string, modelProperty: string) {
		updateValue(element, elementAttr, this.baiseView._model, modelProperty);
	}

	getModelPropertyName(viewProperty: string): string {
		let input = this.baiseView.getInputStartWith(viewProperty);
		let dotIndex = viewProperty.indexOf('.');
		let modelProperty = viewProperty;
		if (dotIndex > 0 && input) {
			modelProperty = input.modelProperty + viewProperty.substring(dotIndex);
		} else if (input) {
			modelProperty = input.modelProperty;
		}
		return modelProperty;
	}

	bind1Way(element: HTMLElement, elementAttr: string, viewProperty: string, isAttr: boolean) {
		const modelProperty = this.getModelPropertyName(viewProperty);
		let callback1 = () => {
			this.updateElementData(element, elementAttr, modelProperty, isAttr);
		};
		subscribe1way(this.baiseView._model, modelProperty, element, elementAttr, callback1);
	}

	bind2Way(element: HTMLElement, elementAttr: string, viewProperty: string, isAttr: boolean) {
		const modelProperty = this.getModelPropertyName(viewProperty);
		const callback2 = () => {
			this.updateViewData(element, elementAttr, modelProperty);
		};
		const callback1 = () => {
			this.updateElementData(element, elementAttr, modelProperty, isAttr);
		};
		subscribe2way(this.baiseView._model, modelProperty, element, elementAttr, callback1, callback2);

		const changeEventName = getChangeEventName(element, elementAttr);
		if ((changeEventName === 'input' || changeEventName === 'change')
			&& isModel(element)) {
			element.addEventListener(changeEventName, () => {
				element.emitChangeModel(elementAttr);
			});
		}
		else if (isHTMLComponent(element)) {
			// ignore, it is applied by default
		}
		else {
			if (!this.nativeElementMutation) {
				this.nativeElementMutation = new ElementMutation();
			}
			this.nativeElementMutation.subscribe(element, elementAttr, () => {
				if (isModel(element)) {
					element.emitChangeModel(elementAttr);
				}
			});
		}
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
		result.forEach(match => this.baiseView._model.subscribeModel(match[1], handler));
		this.baiseView._model.emitChangeModel(result[0][1]);
	}

	initView(): void {
		if (this.componentRef.template) {
			this.template = this.componentRef.template(this.baiseView._model);
			if (this.componentRef.isShadowDom) {
				if (this.baiseView.shadowRoot /* OPEN MODE */) {
					this.baiseView.shadowRoot.appendChild(this.createElement(this.template));
				} else /* CLOSED MODE*/ {
					const shadowRoot = Reflect.get(this.baiseView, '_shadowRoot');
					shadowRoot.appendChild(this.createElement(this.template));
				}
			} else {
				this.baiseView.appendChild(this.createElement(this.template));
			}
		}
	}

	initHostListener(): void {
		this.componentRef.hostListeners?.forEach((listener) =>
			this.handelHostListener(listener)
		);
	}

	createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment | Comment {
		const element = this.createElementByTagName(
			viewTemplate.tagName,
			viewTemplate.attributes?.is,
			viewTemplate.attributes?.comment);

		if (element instanceof Comment) {
			return element;
		}

		if (viewTemplate.attributes && viewTemplate.tagName !== Fragment) {
			for (const key in viewTemplate.attributes) {
				this.initAttribute(<HTMLElement>element, key, viewTemplate.attributes[key]);
			}
			// if (isHTMLComponent(element)) {
			// 	element._parentComponentBindMap = bindMap;
			// }
			// Reflect.set(element, '_parentComponentBindMap', bindMap);
		}
		if (viewTemplate.children && viewTemplate.children.length > 0) {
			for (const child of viewTemplate.children) {
				this.appendChild(element, child);
			}
		}
		return element;
	}

	abstract initAttribute(element: HTMLElement, propertyKey: string, propertyValue: any): void;

	createElementByTagName(tagName: string, is?: string, comment?: string): HTMLElement | DocumentFragment | Comment {
		if (Fragment === tagName.toLowerCase()) {
			return document.createDocumentFragment();
		}

		if ('comment' === tagName.toLowerCase()) {
			if (!comment) {
				comment = '//'
			}
			return document.createComment(comment);
		}

		let element: HTMLElement;
		if (tagName.includes('-')) {
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
						const jsxComponent: JsxComponent = { tagName };
						const attributes = {};
						[].slice.call(element.attributes).forEach((attr: Attr) => {
							Reflect.set(attributes, attr.name, attr.value);
						});
						jsxComponent.attributes = attributes;
						const newChild = this.createElement(jsxComponent);
						// const newChild = new ViewClass();
						// [].slice.call(element.attributes).forEach((attr: Attr) => {
						// 	newChild.setAttribute(attr.name, attr.value);
						// });
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
		}
		else {
			// native tags // and custom tags can be used her
			element = document.createElement(tagName, is ? { is } : undefined);
		}
		// if (isHTMLComponent(element)) {
		// 	element.setParentComponent(this.baiseView);
		// }
		return element;
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
		// else if (this.componentRef.encapsulation === 'template' && !this.baiseView.hasParentComponent()) {
		// 	this.addNativeEventListener(this.baiseView, eventName, eventCallback);
		// }
	}
	addNativeEventListener(source: HTMLElement | Window, eventName: string, funcallback: Function) {
		source.addEventListener(eventName, (event: Event) => {
			// funcallback(event);
			funcallback.call(this.baiseView._model, event);
		});
	}
}
