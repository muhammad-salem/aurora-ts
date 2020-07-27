import {
	ComponentOptions, TypeOf, ChildOptions, PipeOptions,
	ServiceOptions, DirectiveOptions
} from '../core/decoratiors.js';
import { findByTagName, Tag } from './tags.js';
import {
	isOnInit, isOnChanges, isDoCheck,
	isAfterContentInit, isAfterContentChecked,
	isAfterViewInit, isAfterViewChecked, isOnDestroy,
} from '../core/lifecycle.js';
import { BaseComponent } from './component.js';
import { ComponentRender } from '../jsx/render.js';
import { dependencyInjector } from '../providers/injector.js';
import { ClassRegistry } from '../providers/provider.js';
import { JsxComponent } from '../jsx/factory.js';

export class PropertyRef {
	constructor(
		public modelProperty: string,
		private _viewNanme?: string,
		descriptor?: PropertyDescriptor
	) { }
	get viewAttribute(): string {
		return this._viewNanme || this.modelProperty;
	}
}

export class ChildRef {
	constructor(
		public modelName: string,
		public selector: string | { new(): HTMLElement; prototype: HTMLElement } | CustomElementConstructor,
		public childOptions?: ChildOptions
	) { }
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

export interface ComponentRef {
	selector: string;
	template: string | JsxComponent;
	styles: string;
	extend: Tag;

	viewClass: CustomElementConstructor;
	inputs: PropertyRef[];
	outputs: PropertyRef[];
	view: string;
	viewChild: ChildRef[];
	ViewChildren: ChildRef[];
	hostBindings: HostBindingRef[];
	hostListeners: ListenerRef[];
	descriptors: PropertyDescriptor[];
}

function findByModelClassOrCreat(modelProperty: Object): BootstropMatadata {
	var bootstrapMetadata: BootstropMatadata = Reflect.get(
		modelProperty,
		'bootstrap'
	);
	if (!bootstrapMetadata) {
		bootstrapMetadata = {};
		Object.defineProperty(modelProperty, 'bootstrap', {
			value: bootstrapMetadata,
		});
	}
	return bootstrapMetadata;
}

// export function setBootstrapMatadata(modelProperty: Object, metadata: Object) {
//     Reflect.set(modelProperty, 'bootstrap', metadata);
// }

export function getBootstrapMatadata<T = any>(modelProperty: Object): T {
	return Reflect.get(modelProperty, 'bootstrap');
}

export class ComponentElement {
	// export const injector: Injector = new Injector();

	static addOptional(modelProperty: Object, propertyName: string, index: number) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
	}

	static addInput(modelProperty: Object, modelName: string, viewNanme: string, descriptor?: PropertyDescriptor) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
		bootstrap.inputs = bootstrap.inputs || [];
		bootstrap.inputs.push(new PropertyRef(modelName, viewNanme, descriptor));
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

	static defineComponent(modelClass: Function, opts: ComponentOptions) {
		var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
		for (const key in opts) {
			bootstrap[key] = Reflect.get(opts, key);
		}
		bootstrap.extend = findByTagName(opts.extend);
		var componentRef: ComponentRef = bootstrap as ComponentRef;
		componentRef.viewClass = initViewClass(
			modelClass as TypeOf<Function>,
			componentRef
		);

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

	// static bootstrapComponents() {
	//     dependencyInjector.getInstance(ClassRegistry).componentSet.forEach(component => {
	//         const options: ElementDefinitionOptions = {};
	//         var componentRef: ComponentRef = getBootstrapMatadata(component.prototype);
	//         const parentTagName = componentRef.extend.name;
	//         if (parentTagName) {
	//             if (parentTagName !== '!' && parentTagName.indexOf('-') === -1) {
	//                 options.extends = parentTagName;
	//             }
	//         }
	//         customElements.define(
	//             componentRef.selector as string,
	//             componentRef.viewClass as CustomElementConstructor,
	//             options
	//         );
	//     });
	// }
}

function initViewClass(modelClass: TypeOf<Function>, componentRef: ComponentRef): CustomElementConstructor {
	const viewClassName = `${modelClass.name}View`;
	const attributes: string[] = componentRef.inputs.map(input => input.viewAttribute);
	const htmlParent = (componentRef.extend as Tag).classRef;
	const viewElement = componentRef.template;
	const clasBody: string = `
            (class ${viewClassName} extends ${htmlParent.name} {
                constructor(...params) {
					super(...params);
				}
			})`;
	let className: { [key: string]: CustomElementConstructor } = {};
	className[viewClassName] = eval(clasBody);
	className[viewClassName] = class extends className[viewClassName]
		implements BaseComponent {
		_model: any;
		render: ComponentRender;

		constructor(...params: any[]) {
			super(...params);
			this._model = new modelClass();
			this.render = new ComponentRender(this, componentRef);
		}

		doBlockCallback = (): void => {
			if (isDoCheck(this._model)) {
				this._model.doCheck();
			}
		};

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			if (newValue === oldValue) {
				return;
			}
			if (isOnChanges(this._model)) {
				this._model.onChanges();
			}
			this.doBlockCallback();
			console.log('changed', name, oldValue, newValue);
		}
		connectedCallback() {
			if (isOnChanges(this._model)) {
				this._model.onChanges();
			}
			if (isOnInit(this._model)) {
				this._model.onInit();
			}
			if (isDoCheck(this._model)) {
				this._model.doCheck();
			}
			if (isAfterContentInit(this._model)) {
				this._model.afterContentInit();
			}
			if (isAfterContentChecked(this._model)) {
				this._model.afterContentChecked();
			}

			// setup ui view
			this.render.initView();

			if (componentRef.view) {
				this._model[componentRef.view] = this;
			}

			if (isAfterViewInit(this._model)) {
				this._model.afterViewInit();
			}
			if (isAfterViewChecked(this._model)) {
				this._model.afterViewChecked();
			}
			this.doBlockCallback = () => {
				if (isDoCheck(this._model)) {
					this._model.doCheck();
				}
				if (isAfterContentChecked(this._model)) {
					this._model.afterContentChecked();
				}
				if (isAfterViewChecked(this._model)) {
					this._model.afterViewChecked();
				}
			};
		}

		adoptedCallback() {
			// restart the process
			this.connectedCallback();
		}
		disconnectedCallback() {
			if (isOnDestroy(this._model)) {
				this._model.onDestroy();
			}
		}
	};
	attributes.forEach((prop) => {
		Object.defineProperty(className[viewClassName].prototype, prop, {
			get(): any {
				return this._model[prop];
			},
			set(value: any) {
				this._model[prop] = value;
			},
		});
	});
	Object.defineProperty(className[viewClassName], 'observedAttributes', {
		get() {
			return attributes;
		},
	});
	Object.defineProperty(modelClass, viewClassName, {
		value: className[viewClassName],
	});
	return className[viewClassName];
}
