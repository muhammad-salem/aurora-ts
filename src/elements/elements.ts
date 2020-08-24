import {
	ComponentOptions, TypeOf, ChildOptions, PipeOptions,
	ServiceOptions, DirectiveOptions, JSXRender
} from '../core/decorators.js';
import { findByTagName, Tag } from './tags.js';
import { HTMLComponent } from './component.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { findByModelClassOrCreat } from '../reflect/bootstrap-data.js';
import { htmlTemplateToJSXRender } from '../jsx/html-template-parser.js';
import { toJSXRender } from '../jsx/html-string-parser.js';
import { initCustomElementView } from '../view/custom-element.js';

export class PropertyRef {
	constructor(public modelProperty: string, private _viewNanme?: string) { }
	get viewAttribute(): string {
		return this._viewNanme || this.modelProperty;
	}
}

export class ChildRef {
	constructor(public modelName: string, public selector: string | { new(): HTMLElement; prototype: HTMLElement } | CustomElementConstructor, public childOptions?: ChildOptions) { }
}

export class ListenerRef {
	constructor(public eventName: string, public args: string[], public modelCallbackName: string) { }
}

export class HostBindingRef {
	constructor(public viewProperty: string, public hostPropertyName: string) { }
}

export interface BootstropMatadata {
	[key: string]: any;
}

export interface ServiceRef extends ServiceOptions {
	descriptors: PropertyDescriptor[];
}

export interface PipeRef extends PipeOptions {
	name: string;
	pure: boolean;
	descriptors: PropertyDescriptor[];
}
export interface DirectiveRef extends DirectiveOptions {
	inputs: PropertyRef[];
	outputs: PropertyRef[];
	view: string;
	viewChild: ChildRef[];
	ViewChildren: ChildRef[];
	hostListeners: ListenerRef[];
	hostBindings: HostBindingRef[];
	directiveOptions: DirectiveOptions;
	descriptors: PropertyDescriptor[];
}

export interface ComponentRef<T> {
	selector: string;
	template: JSXRender<T>;
	styles: string;
	extend: Tag;

	viewClass: TypeOf<HTMLComponent<T>>; //CustomElementConstructor;
	inputs: PropertyRef[];
	outputs: PropertyRef[];
	view: string;
	viewChild: ChildRef[];
	ViewChildren: ChildRef[];
	hostBindings: HostBindingRef[];
	hostListeners: ListenerRef[];
	descriptors: PropertyDescriptor[];

	renderType: 'html' | 'jsx' | 'tsx';
	encapsulation: 'custom' | 'shadow-dom' | 'template' | 'shadow-dom-template';
	isShadowDom: boolean;
}


export class ComponentElement {

	static addOptional(modelProperty: Object) {
	}

	static addInput(modelProperty: Object, modelName: string, viewNanme: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.inputs = bootstrap.inputs || [];
		bootstrap.inputs.push(new PropertyRef(modelName, viewNanme));
	}

	static addOutput(modelProperty: Object, modelName: string, viewNanme: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.outputs = bootstrap.outputs || [];
		bootstrap.outputs.push(new PropertyRef(modelName, viewNanme));
	}

	static setComponentView(modelProperty: Object, modelName: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.view = modelName;
	}

	static addViewChild(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor, childOptions?: ChildOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.viewChild = bootstrap.viewChild || [];
		bootstrap.viewChild.push(new ChildRef(modelName, selector, childOptions));
	}

	static addViewChildren(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.ViewChildren = bootstrap.ViewChildren || [];
		bootstrap.ViewChildren.push(new ChildRef(modelName, selector));
	}

	static addHostListener(modelProperty: Object, propertyKey: string, eventName: string, args: string[]) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.hostListeners = bootstrap.hostListeners || [];
		bootstrap.hostListeners.push(new ListenerRef(eventName, args, propertyKey));
	}

	static addHostBinding(modelProperty: Object, propertyKey: string, hostPropertyName: string) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.hostBinding = bootstrap.hostBinding || [];
		bootstrap.hostBinding.push(
			new HostBindingRef(propertyKey, hostPropertyName)
		);
	}

	static defineDirective(modelClass: Function, opts: DirectiveOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerDirective(modelClass);
	}

	static definePipe(modelClass: Function, opts: PipeOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerPipe(modelClass);
	}

	static defineService(modelClass: Function, opts: ServiceOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		dependencyInjector.getInstance(ClassRegistry).registerService(modelClass);
	}

	static defineComponent<T extends Object>(modelClass: TypeOf<T>, opts: ComponentOptions<T>) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		bootstrap.extend = findByTagName(opts.extend);
		var componentRef: ComponentRef<T> = bootstrap as ComponentRef<T>;
		if (!componentRef.template) {
			componentRef.renderType = 'html';
		} else if (typeof componentRef.template === 'string') {
			componentRef.template = toJSXRender(componentRef.template);
			// componentRef.template = htmlTemplateToJSXRender(componentRef.template);
			componentRef.renderType = 'html';
		} else {
			componentRef.renderType = 'jsx';
		}

		if (!componentRef.template && /template/g.test(componentRef.encapsulation)) {
			const template = document.querySelector('#' + componentRef.selector);
			if (template && template instanceof HTMLTemplateElement) {
				componentRef.template = htmlTemplateToJSXRender(template);
			} else {
				// didn't find this template in 'index.html' document
			}
		}

		componentRef.inputs = componentRef.inputs || [];
		componentRef.outputs = componentRef.outputs || [];
		componentRef.viewChild = componentRef.viewChild || [];
		componentRef.ViewChildren = componentRef.ViewChildren || [];
		componentRef.hostBindings = componentRef.hostBindings || [];
		componentRef.hostListeners = componentRef.hostListeners || [];
		componentRef.descriptors = componentRef.descriptors || [];
		componentRef.encapsulation = componentRef.encapsulation || 'custom';
		componentRef.isShadowDom = /shadow-dom/g.test(componentRef.encapsulation);

		componentRef.viewClass = initCustomElementView(modelClass, componentRef);

		dependencyInjector.getInstance(ClassRegistry).registerComponent(modelClass);
		dependencyInjector
			.getInstance(ClassRegistry)
			.registerView(bootstrap.viewClass);
		// setBootstrapMatadata(modelClass.prototype, componentRef);

		const options: ElementDefinitionOptions = {};
		const parentTagName = componentRef.extend?.name;
		if (parentTagName) {
			if (parentTagName !== '!' && parentTagName.indexOf('-') === -1) {
				options.extends = parentTagName;
			}
		}
		customElements.define(
			componentRef?.selector as string,
			componentRef.viewClass as CustomElementConstructor,
			options
		);
	}
}
