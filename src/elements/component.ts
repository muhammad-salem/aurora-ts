import { Observable } from '../core/observable.js';
import { EventEmitter } from '../core/events.js';
import { ComponentRef, PropertyRef } from './elements.js';

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

// export class ComponentMap<T> {

// 	constructor(public componentRef: ComponentRef<T>, public _model: any) { }

// 	hasInput(viewProp: string): boolean {
// 		return this.componentRef.inputs.some(input => input.viewAttribute === viewProp);
// 	}

// 	getInput(viewProp: string): PropertyRef | undefined {
// 		return this.componentRef.inputs.find(input => input.viewAttribute === viewProp);
// 	}

// 	getInputValue(viewProp: string) {
// 		const inputRef = this.getInput(viewProp);
// 		if (inputRef) {
// 			return this._model[inputRef.modelProperty];
// 		}
// 	}

// 	setInputValue(viewProp: string, value: any) {
// 		const inputRef = this.getInput(viewProp);
// 		if (inputRef) {
// 			this._model[inputRef.modelProperty] = value;
// 		}
// 	}

// 	hasOutput(viewProp: string): boolean {
// 		return this.componentRef.outputs.some(output => output.viewAttribute === viewProp);
// 	}

// 	getOutput(viewProp: string): PropertyRef | undefined {
// 		return this.componentRef.outputs.find(output => output.viewAttribute === viewProp);
// 	}

// 	getOutputValue<V>(viewProp: string): EventEmitter<V> | undefined {
// 		const outputRef = this.getOutput(viewProp);
// 		if (outputRef) {
// 			return this._model[outputRef.modelProperty] as EventEmitter<V>;
// 		}
// 	}

// 	hasProp(propName: string): boolean {
// 		return Reflect.has(this._model, propName);
// 	}
// }

export interface BaseComponent<T extends Object> extends HTMLComponent {
	_model: T & { [key: string]: any };
	_changeObservable: Observable;
	_parentComponent: BaseComponent<any>;
	_bindMap: Map<string, Array<string>>;
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

	bindAttr(view: string, elementAttr: string): void;
	getBindAttr(view: string): string[];
	searchBindAttr(elementAttr: string): string[];
	notifyParentComponent(eventName: string): void;
}

export function isBaseComponent(object: Object): object is BaseComponent<any> {
	return Reflect.has(object, '_model')
		&& Reflect.has(object, '_changeObservable')
		&& Reflect.has(object, '_parentComponent')
		&& Reflect.has(object, '_bindMap');
}