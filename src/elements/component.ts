import { Observable } from '../core/observable.js';
import { EventEmitter } from '../core/events.js';
import { PropertyRef } from './elements.js';

export interface HTMLComponent {
	attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string
	): void;
	connectedCallback(): void;
	disconnectedCallback(): void;
	adoptedCallback(): void;
}

export type BindKey = {
	element: HTMLElement,
	elementAttr: string,
	view: string;
};

export interface BaseComponent<T extends Object> extends HTMLComponent {
	_model: T & { [key: string]: any };
	_changeObservable: Observable;
	_parentComponent: BaseComponent<any>;
	_bindMap: Map<string, Array<BindKey>>;
	// [key: string]: any;

	hasInput(viewProp: string): boolean;
	getInput(viewProp: string): PropertyRef | undefined;
	getInputValue(viewProp: string): any;
	setInputValue(viewProp: string, value: any): void;
	hasOutput(viewProp: string): boolean;
	getOutput(viewProp: string): PropertyRef | undefined;
	getEventEmitter<V>(viewProp: string): EventEmitter<V> | undefined;
	triggerEvent(eventName: string, value?: any): void;
	hasProp(propName: string): boolean;

	bindAttr(view: string, element: HTMLElement, elementAttr: string): void;
	getBindAttr(view: string): BindKey[];
	searchBindAttr(element: HTMLElement, elementAttr: string): BindKey[];
	notifyParentComponent(eventName: string, element: HTMLElement): void;
}

export function isBaseComponent(object: Object): object is BaseComponent<any> {
	return Reflect.has(object, '_model')
		&& Reflect.has(object, '_changeObservable')
		&& Reflect.has(object, '_parentComponent')
		&& Reflect.has(object, '_bindMap');
}