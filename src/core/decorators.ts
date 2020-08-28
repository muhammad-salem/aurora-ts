/// <reference path='../types/raw-module.ts'/>
/// <reference path='../reflect/metadata.ts' />

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

export type JSXRender<T> = (model: T) => JsxComponent;
export interface ComponentOptions<T = Function> {
	selector: string;
	/**
	 * template: typeof 'string' ==> html template,
	 * 			 TypeOf 'JSXRender<T>' ==> JSX, create factory
	 * 	if template === null || undefined ==> it had nothing to render, 
	 * and may be inhert from an html element
	 * 				
	 */
	template?: string | JSXRender<T>;
	/**
	 * style for this element
	 */
	styles?: string | { [key: string]: string }[];
	/**
	 * what baisc element should the new component inhert from,
	 * the tag name to inhert from as 'a', 'div', 'table', 'td', 'th', 'tr', etc ...
	 */
	extend?: string;

	/**
	 * An encapsulation policy for the template and CSS styles. One of:
	 * <br/>
	 *  'custom': Use global CSS without any encapsulation.
	 *  'shadow-dom': Use Shadow DOM v1 to encapsulate styles.
	 * 
	 *  'template': like 'custom', with load the template from the documnet ('index.html' file)
	 * 	 			that had the same id as the component "selector".
	 *  'shadow-dom-template': like 'shadowDom', and load template by selector id.
	 * 
	 * Both 'template' & 'shadow-dom-template' encapsulation type:
	 *  should had atrribttes name like lowercase,
	 * 	the browser itself, will convert all attributes to lowercase
	 * ```js
	 * @Input('personage') personAge: number;
	 * @Input('propname') propName: string;
	 * @Output('savebuttonclick') saveButtonClick = new EventEmitter<Persons>();
	 * @View('personform') personForm: HTMLFormElement;
	 * ```
	 * any root element as '<root-app></root-app>',
	 * the supported bind options is 'One way binding *(as passing data only)'
	 *  and 'template parsing' and 'event binding' syntax, HTML (angular) like.
	 * it load its attributes from 'window object'
	 * 
	 * so to pass date to A root element, 
	 * ```html
	 * <script>
	 * 	let appVersion = '0.1.504';
	 * 	function onRootAppClick() {
	 *		console.log('root app clicked');
	 * 	}
	 * 	function onSave(data){
	 *		console.log('root app save', data);
	 * 	}
	 * </script>
	 * <root-app [version]="appVersion" 
	 * 		onclick="onRootAppClick()"
	 * 		(save)="onSave()" ></root-app>
	 * ```
	 * 
	 * default is 'custom'
	 * @type {'custom' | 'shadowDom' | 'template' | 'shadowDom-template'}
	 */
	encapsulation?: 'custom' | 'shadow-dom' | 'template' | 'shadow-dom-template';

	/**
	 * default: 'open'
	 */
	shadowDomMode?: ShadowRootMode;

	/**
	 * default: false
	 */
	shadowDomDelegatesFocus?: boolean;
}

export interface ChildOptions {
	[key: string]: any;
}

export interface ViewChildOpt {
	selector: string | typeof HTMLElement | CustomElementConstructor;
	childOptions?: ChildOptions;
}

export function Input(name?: string): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addInput(target, propertyKey, name || propertyKey);
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

export function ViewChild(selector: string | typeof HTMLElement | CustomElementConstructor,
	childOptions?: ChildOptions): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addViewChild(target, propertyKey, selector, childOptions);
	};
}

export function ViewChildren(selector: string | typeof HTMLElement | CustomElementConstructor): Function {
	return (target: Object, propertyKey: string) => {
		ComponentElement.addViewChildren(target, propertyKey, selector);
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

export function Component<T extends Object>(opt: ComponentOptions<T>): Function {
	return (target: TypeOf<T>) => {
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
