import { Observable } from '../core/observable.js';
import { EventEmitter } from '../core/events.js';
import { PropertyRef, ComponentRef } from './elements.js';

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

// export type BindKey = {
// 	element: HTMLElement,
// 	elementAttr: string,
// 	view: string;
// };

export interface BaseComponent<T extends Object> extends HTMLComponent {
	_model: T & { [key: string]: any };
	_changeObservable: Observable;
	_childBindMap: Map<string, Array<string>>;
	_parentComponent: BaseComponent<any>;
	_parentComponentBindMap: Map<string, string>;

	getComponentRef(): ComponentRef<T>;

	hasInput(viewProp: string): boolean;
	getInput(viewProp: string): PropertyRef | undefined;
	getInputValue(viewProp: string): any;
	setInputValue(viewProp: string, value: any): void;
	hasOutput(viewProp: string): boolean;
	getOutput(viewProp: string): PropertyRef | undefined;
	getEventEmitter<V>(viewProp: string): EventEmitter<V> | undefined;
	triggerEvent(eventName: string, value?: any): void;
	hasProp(propName: string): boolean;

	bindAttr(view: string, elementAttr: string): void;
	getBindAttr(view: string): string[];
	searchBindAttr(elementAttr: string): string[];
	searchParentBindAttr(elementAttr: string): [string, string] | undefined;
	notifyParentComponent(eventName: string): void;
	matchParentEvent(elementAttr: string): string | undefined;
	triggerParentEvent(elementAttr: string): void;
}

export function isBaseComponent(object: Object): object is BaseComponent<any> {
	return Reflect.has(object, '_model')
		&& Reflect.has(object, '_changeObservable')
		&& Reflect.has(object, '_parentComponent')
		&& Reflect.has(object, '_childBindMap')
		&& object instanceof Node;
}

export function isNativeElement(element: HTMLElement): element is HTMLElement {
	return element && element instanceof HTMLElement && !element.tagName?.includes('-');
}

