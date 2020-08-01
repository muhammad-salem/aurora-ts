///<reference path="html-module.ts"/>
/// <reference path="../reflect/metadata.ts" />


import { ComponentElement } from '../elements/elements.js';
import { JsxComponent } from '../jsx/factory.js';

export interface DirectiveOptions {
	selector: string;
}

export interface TypeOf<T> extends Function {
	new(): T;
}

export interface HTMLType extends TypeOf<HTMLElement> {
	prototype: HTMLElement;
}

export interface ServiceOptions {
	provideIn: TypeOf<CustomElementConstructor> | 'root' | 'platform' | 'any' | null;
}

export interface PipeOptions {
	name: string;
	pure: boolean;
}

export interface ComponentOptions {
	selector: string;
	template?: string | JsxComponent;
	style?: string | { [key: string]: string }[];
	extend?: string;
}

export interface ChildOptions {
	[key: string]: any;
}

export interface ViewChildOpt {
	selector: string | typeof HTMLElement | CustomElementConstructor;
	childOptions?: ChildOptions;
}

export function Input(name?: string): Function {
	return (target: Object, propertyKey: string, desc?: PropertyDescriptor) => {
		ComponentElement.addInput(target, propertyKey, name || propertyKey, desc);
	};
}
export function Output(name?: string): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addOutput(target, propertyKey, name || propertyKey);
	};
}
export function View(): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.setComponentView(target, propertyKey);
	};
}

export function ViewChild(
	selector: string | typeof HTMLElement | CustomElementConstructor,
	childOptions?: ChildOptions
): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addViewChild(target, propertyKey, name, childOptions);
	};
}

export function ViewChildren(
	selector: string | typeof HTMLElement | CustomElementConstructor
): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addViewChildren(target, propertyKey, name);
	};
}

export function HostListener(eventName: string, args?: string[]): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addHostListener(
			target,
			propertyKey,
			eventName,
			args || []
		);
	};
}

export function HostBinding(hostPropertyName: string): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addHostBinding(target, propertyKey, hostPropertyName);
	};
}

export function Pipe(opt: PipeOptions): Function {
	return (target: Function) => {
		ComponentElement.definePipe(target, opt);
		return target;
	};
}

export function Service(opt: ServiceOptions): Function {
	return (target: Function) => {
		ComponentElement.defineService(target, opt);
		return target;
	};
}
export function Directive(opt: DirectiveOptions): Function {
	return (target: Function) => {
		ComponentElement.defineDirective(target, opt);
		return target;
	};
}

export function Component(opt: ComponentOptions): Function {
	return (target: Function) => {
		ComponentElement.defineComponent(target, opt);
		return target;
	};
}

export function SelfSkip(name?: string): Function {
	return (target: Function, propertyKey: string, index: number) => {
		Reflect.defineMetadata('selfskip', { name, index }, target, propertyKey);
	};
}

export function Optional(): Function {
	return (target: Function, propertyKey: string, index: number) => {
		Reflect.defineMetadata('optional', { index }, target, propertyKey);
	};
}
