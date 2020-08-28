import { EventEmitter } from '../core/events.js';
import { PropertyRef, ComponentRef } from './elements.js';
import { Model } from '../model/model-change-detection.js';

export interface CustomElement {
	attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
	connectedCallback(): void;
	disconnectedCallback(): void;
	adoptedCallback(): void;
}

export interface BaseComponent<T extends Object> extends CustomElement {
	_model: T & Model & { [key: string]: any };
	// _changeObservable: Observable;

	getComponentRef(): ComponentRef<T>;

	hasInputStartWith(viewProp: string): boolean;
	getInputStartWith(viewProp: string): PropertyRef | undefined;
	getInput(viewProp: string): PropertyRef | undefined;
	getInputValue(viewProp: string): any;
	setInputValue(viewProp: string, value: any): void;

	hasInput(viewProp: string): boolean;
	hasProp(propName: string): boolean;
	hasOutput(viewProp: string): boolean;

	getOutput(viewProp: string): PropertyRef | undefined;
	getEventEmitter<V>(viewProp: string): EventEmitter<V> | undefined;

	triggerOutput(eventName: string, value?: any): void;
	triggerModelChange(eventName: string, value?: any, source?: HTMLElement): void;
	emitRootChanges(): void;
}

export interface HTMLComponent<T> extends BaseComponent<T>, HTMLElement { }

export function isHTMLComponent(object: any): object is HTMLComponent<any> {
	return Reflect.has(object, '_model')
		// && Reflect.has(object, '_changeObservable')
		&& object instanceof HTMLElement;
}

export function isNativeElement(element: HTMLElement): element is HTMLElement {
	return element && element instanceof HTMLElement && !element.tagName?.includes('-');
}

type BindValue = { attrName: string, source: Object };

interface BindingProperty {
	oneWay: { [key: string]: BindValue },
	twoWay: { [key: string]: BindValue },

	addOneWay(attrName: string, element: HTMLElement, elementAttr: string): void;
	addTwoWay(attrName: string, element: HTMLElement, elementAttr: string): void;


}