import {
    ComponentOptions, TypeOf, ChildOptions,
    PipeOptions, ServiceOptions, DirectiveOptions
} from '../core/decoratiors.js';
import { findByTagName, Tag } from './tags.js';
import {
    isOnInit, isOnChanges, isDoCheck,
    isAfterContentInit, isAfterContentChecked,
    isAfterViewInit, isAfterViewChecked, isOnDestroy
} from '../core/lifecycle.js';
import { BaseComponent } from './component.js';
import { ComponentRender } from '../jsx/render.js';

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
    constructor(public modelName: string, public selector:
        string
        | { new(): HTMLElement; prototype: HTMLElement; }
        | CustomElementConstructor,
        public childOptions?: ChildOptions) {
    }
}

export class ListenerRef {
    constructor(public eventName: string, args: string[], public modelCallbackName: string) { }
}

export type ProviderType = 'component' | 'service' | 'directive' | 'pipe' | 'none';

export class BootstropMatadata {
    view: string;
    viewClass: CustomElementConstructor;
    inputs: PropertyRef[] = [];
    outputs: PropertyRef[] = [];
    viewChild: ChildRef[] = [];
    ViewChildren: ChildRef[] = [];
    hostListeners: ListenerRef[] = [];
    descriptors: PropertyDescriptor[];
    componentOptions: ComponentOptions;
    pipeOptions: PipeOptions;
    directiveOptions: DirectiveOptions;
    serviceOptions: ServiceOptions;
}

export class ServiceRef {
    serviceOptions: ServiceOptions;
    descriptors: PropertyDescriptor[];
    constructor(meta: BootstropMatadata) {
        this.serviceOptions = meta.serviceOptions;
        this.descriptors = meta.descriptors || [];
    }
}


export class PipeRef {
    pipeOptions: PipeOptions;
    descriptors: PropertyDescriptor[];
    constructor(meta: BootstropMatadata) {
        this.pipeOptions = meta.pipeOptions;
        this.descriptors = meta.descriptors || [];
    }
}
export class DirectiveRef {
    inputs: PropertyRef[];
    outputs: PropertyRef[];
    view: string;
    viewChild: ChildRef[];
    ViewChildren: ChildRef[];
    hostListeners: ListenerRef[];
    directiveOptions: DirectiveOptions;
    descriptors: PropertyDescriptor[];
    constructor(meta: BootstropMatadata) {
        this.inputs = meta.inputs || [];
        this.outputs = meta.outputs || [];
        this.view = meta.view;
        this.viewChild = meta.viewChild || [];
        this.ViewChildren = meta.ViewChildren || [];
        this.hostListeners = meta.hostListeners || [];
        this.directiveOptions = meta.directiveOptions;
        this.descriptors = meta.descriptors;
    }
}

export class ComponentRef {
    viewClass: CustomElementConstructor;
    inputs: PropertyRef[];
    outputs: PropertyRef[];
    view: string;
    viewChild: ChildRef[];
    ViewChildren: ChildRef[];
    hostListeners: ListenerRef[];
    componentOptions: ComponentOptions;
    descriptors: PropertyDescriptor[];
    constructor(meta: BootstropMatadata) {
        this.inputs = meta.inputs || [];
        this.outputs = meta.outputs || [];
        this.view = meta.view;
        this.viewClass = meta.viewClass;
        this.viewChild = meta.viewChild || [];
        this.ViewChildren = meta.ViewChildren || [];
        this.hostListeners = meta.hostListeners || [];
        this.componentOptions = meta.componentOptions;
        this.descriptors = meta.descriptors;
    }
}

function findByModelClassOrCreat(modelProperty: Object): BootstropMatadata {
    var bootstrapMetadata: BootstropMatadata = Reflect.get(modelProperty, 'bootstrap');
    if (!bootstrapMetadata) {
        bootstrapMetadata = new BootstropMatadata();
        Object.defineProperty(modelProperty, 'bootstrap', { value: bootstrapMetadata });
    }
    return bootstrapMetadata;
}

function setBootstrapMatadata(modelProperty: Object, metadata: Object) {
    Reflect.set(modelProperty, 'bootstrap', metadata);
}


export class ComponentElement {

    static addOptional(modelProperty: Object, propertyName: string, index: number) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
    }

    static addInput(modelProperty: Object, modelName: string, viewNanme: string, descriptor?: PropertyDescriptor) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.inputs.push(new PropertyRef(modelName, viewNanme, descriptor));
    }

    static addOutput(modelProperty: Object, modelName: string, viewNanme: string) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.outputs.push(new PropertyRef(modelName, viewNanme));
    }

    static setComponentView(modelProperty: Object, modelName: string) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.view = modelName;
    }

    static addViewChild(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor, childOptions?: ChildOptions) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.viewChild.push(new ChildRef(modelName, selector, childOptions));
    }

    static addViewChildren(modelProperty: Object, modelName: string, selector: string | typeof HTMLElement | CustomElementConstructor) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.ViewChildren.push(new ChildRef(modelName, selector));
    }

    static addHostListener(modelProperty: Object, propertyKey: string, eventName: string, args: string[]) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelProperty);
        bootstrap.hostListeners.push(new ListenerRef(eventName, args, propertyKey));
    }

    static defineDirective(modelClass: Function, opts: DirectiveOptions) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
        bootstrap.directiveOptions = opts;
        setBootstrapMatadata(modelClass.prototype, new DirectiveRef(bootstrap));
    }
    static definePipe(modelClass: Function, opts: PipeOptions) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
        bootstrap.pipeOptions = opts;
        setBootstrapMatadata(modelClass.prototype, new PipeRef(bootstrap));
    }
    static defineService(modelClass: Function, opts: ServiceOptions) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
        bootstrap.serviceOptions = opts;
        setBootstrapMatadata(modelClass.prototype, new ServiceRef(bootstrap));
    }

    static defineComponent(modelClass: Function, opts: ComponentOptions) {
        var bootstrap: BootstropMatadata = findByModelClassOrCreat(modelClass.prototype);
        bootstrap.componentOptions = opts;
        var componentRef: ComponentRef = new ComponentRef(bootstrap);
        setBootstrapMatadata(modelClass.prototype, componentRef);
        if (!componentRef.componentOptions.extend) {
            componentRef.componentOptions.extend = findByTagName('');
        }
        componentRef.viewClass = initViewClass(modelClass as TypeOf<Function>, componentRef);
        const options: ElementDefinitionOptions = {};
        const parentTagName = componentRef.componentOptions.extend?.name;
        if (parentTagName) {
            if (parentTagName !== '!' && parentTagName.indexOf('-') === -1) {
                options.extends = parentTagName;
            }
        }
        customElements.define(
            componentRef.componentOptions?.selector as string,
            componentRef.viewClass as CustomElementConstructor,
            options
        );
    }
}

function initViewClass(modelClass: TypeOf<Function>, componentRef: ComponentRef): CustomElementConstructor {
    const viewClassName = `${modelClass.name}View`;
    const attributes: string[] = componentRef.inputs.map(input => input.viewAttribute);
    const htmlParent = (componentRef.componentOptions.extend as Tag).classRef;
    const viewElement = componentRef.componentOptions.template;

    const clasBody: string = `(
             class ${viewClassName} extends ${htmlParent.name} {
                constructor() {
                    super();
                }
            }
        )`;
    let viewClass: CustomElementConstructor = eval(clasBody);
    Object.defineProperty(viewClass, 'observedAttributes', { get() { return attributes; } });

    viewClass = class extends viewClass implements BaseComponent {
        model: any;
        render: ComponentRender;
        constructor() {
            super();
            this.model = new modelClass();
            this.render = new ComponentRender(this, componentRef);
        }
        doBlockCallback = (): void => {
            if (isDoCheck(this.model)) {
                this.model.doCheck();
            }
        };
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            try {
                this.model[name] = JSON.parse(newValue);
            } catch (error) {
                if (!newValue) {
                    // newValue is false/boolean [removeAttribute is called]
                    this.model[name] = false;
                }
                else if ('' === newValue) {
                    // newValue is true/boolean
                    this.model[name] = true;
                } else {
                    // newValue is string
                    this.model[name] = newValue;
                }
            }
            this.setAttribute('component-changed', '');
            if (isOnChanges(this.model)) {
                this.model.onChanges();
            }
            this.doBlockCallback();
        }
        connectedCallback() {
            if (isOnChanges(this.model)) {
                this.model.onChanges();
            }
            if (isOnInit(this.model)) {
                this.model.onInit();
            }
            if (isDoCheck(this.model)) {
                this.model.doCheck();
            }
            if (isAfterContentInit(this.model)) {
                this.model.afterContentInit();
            }
            if (isAfterContentChecked(this.model)) {
                this.model.afterContentChecked();
            }
            // setup ui view
            // this.innerHTML = JSON.stringify({ viewElement, componentRef });

            this.render.initView()

            if (componentRef.view) {
                this.model[componentRef.view] = this;
            }

            if (isAfterViewInit(this.model)) {
                this.model.afterViewInit();
            }
            if (isAfterViewChecked(this.model)) {
                this.model.afterViewChecked();
            }
            this.doBlockCallback = () => {
                if (isDoCheck(this.model)) {
                    this.model.doCheck();
                }
                if (isAfterContentChecked(this.model)) {
                    this.model.afterContentChecked();
                }
                if (isAfterViewChecked(this.model)) {
                    this.model.afterViewChecked();
                }
            };
        }

        adoptedCallback() {
            // restart the process
            this.connectedCallback();
        }
        disconnectedCallback() {
            if (isOnDestroy(this.model)) {
                this.model.onDestroy();
            }
        }
    };
    attributes.forEach(prop => {
        Object.defineProperty(viewClass.prototype, prop, {
            get(): any {
                return this.model[prop];
            },
            set(value: any) {
                this.model[prop] = value;
            }
        });
    });
    return viewClass;
}

