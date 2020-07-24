import { Tag } from '../elements/tags.js';
import { ComponentElement } from '../elements/elements.js';
import { JsxComponent } from '../jsx/factory.js';

export interface DirectiveOptions {
    selector: string
}

export interface TypeOf<T> extends Function {
    new(): T;
}

export interface HTMLType extends TypeOf<HTMLElement> {
    prototype: HTMLElement;
}

export interface ServiceOptions {
    provideIn: TypeOf<CustomElementConstructor> | 'root' | 'platform' | 'any' | null
}

export interface PipeOptions {
    name: string,
    pure: boolean
}

export interface ComponentOptions {
    selector: string,
    extend?: Tag,
    template?: string | JsxComponent,
    styles?: string | string[];
}

export interface ChildOptions {
    [key: string]: any;
}

export interface ViewChildOpt {
    selector: string | typeof HTMLElement | CustomElementConstructor,
    childOptions?: ChildOptions
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

export function ViewChild(selector: string | typeof HTMLElement | CustomElementConstructor,
    childOptions?: ChildOptions): Function {
    return (target: Object, propertyKey: string) => {
        ComponentElement.addViewChild(target, propertyKey, name, childOptions);
    };
}

export function ViewChildren(selector: string | typeof HTMLElement | CustomElementConstructor): Function {
    return (target: Object, propertyKey: string) => {
        ComponentElement.addViewChildren(target, propertyKey, name);
    };
}

export function HostListener(eventName: string, args?: string[]): Function {
    // return Reflect.metadata('hostlistener', { eventName, args });
    return (target: Object, propertyKey: string) => {
        ComponentElement.addHostListener(target, propertyKey, eventName, args || []);
    };
}

// function decoratClass(value: any, target: Function,
//     metadataKey: MetadataKey, provicerType: ProviderType) {
//     Reflect.metadata(metadataKey, value)(target);
//     getDefaultApp().getClassModels().push({
//         className: target.name,
//         classRef: target,
//         providerType: provicerType
//     });
// }

export function Pipe(opt: PipeOptions): Function {
    return (target: Function) => {
        ComponentElement.definePipe(target, opt);
        // decoratClass(opt, target, 'pipe', 'pipe');
        return target;
    }
}

export function Service(opt: ServiceOptions): Function {
    return (target: Function) => {
        ComponentElement.defineService(target, opt);
        // decoratClass(opt, target, 'service', 'service');
        return target;
    }
}
export function Directive(opt: DirectiveOptions): Function {
    return (target: Function) => {
        ComponentElement.defineDirective(target, opt);
        // decoratClass(opt, target, 'directive', 'directive');
        return target;
    }
}

export function Component(opt: ComponentOptions): Function {
    return (target: Function) => {
        ComponentElement.defineComponent(target, opt);
        // decoratClass(opt, target, 'component', 'component');
        return target;
    }
}

export function SelfSkip(name?: string): Function {
    return (target: Function, propertyKey: string, index: number) => {
        Reflect.defineMetadata('selfskip', { name, index }, target, propertyKey);
    }
}

export function Optional(): Function {
    return (target: Function, propertyKey: string, index: number) => {
        Reflect.defineMetadata('optional', { index }, target, propertyKey);
    }
}


// export function Type(type: any) { return Reflect.metadata("design:type", type); }
// export function ParamTypes(...types: any[]) { return Reflect.metadata("design:paramtypes", types); }
// export function ReturnType(type: any) { return Reflect.metadata("design:returntype", type); }

// export class DecoratiorsHelper {
//     constructor(private metadata: Metadata) { }

//     Type(propertyKey?: string) {
//         return this.metadata.getMetadata(propertyKey, 'design:type');
//     }

//     ParamTypes(propertyKey?: string) {
//         return this.metadata.getMetadata(propertyKey, 'design:paramtypes');
//     }
//     ReturnType(propertyKey?: string) { return this.metadata.getMetadata(propertyKey, 'design:returntype'); }

//     Input(propertyKey: string): string { return this.metadata.getMetadata(propertyKey, 'input'); }
//     InputPropertys(): string[] { return this.metadata.getPropertyKeyFor('input'); }

//     Output(propertyKey: string): string { return this.metadata.getMetadata(propertyKey, 'output'); }
//     OutputPropertys(): string[] { return this.metadata.getPropertyKeyFor('output'); }

//     View(propertyKey: string): boolean { return this.metadata.getMetadata(propertyKey, 'view'); }
//     ViewPropertys(): string[] { return this.metadata.getPropertyKeyFor('view'); }

//     ViewChild(propertyKey: string): ViewChildOpt { return this.metadata.getMetadata(propertyKey, 'viewchild'); }
//     ViewChildPropertys(): string[] { return this.metadata.getPropertyKeyFor('viewchild'); }

//     ViewChildren(propertyKey: string): ViewChildOpt { return this.metadata.getMetadata(propertyKey, 'viewchildren'); }
//     ViewChildrenPropertys(): string[] { return this.metadata.getPropertyKeyFor('viewchildren'); }

//     HostListener(propertyKey: string): ViewChildOpt { return this.metadata.getMetadata(propertyKey, 'hostlistener'); }
//     HostListenerPropertys(): string[] { return this.metadata.getPropertyKeyFor('hostlistener'); }

//     Pipe(): PipeOptions { return this.metadata.getMetadata(null, 'pipe'); }
//     Service(): ServiceOptions { return this.metadata.getMetadata(null, 'service'); }
//     Directive(): ServiceOptions { return this.metadata.getMetadata(null, 'directive'); }
//     Component(): ServiceOptions { return this.metadata.getMetadata(null, 'component'); }
// }


// window['helper'] = DecoratiorsHelper;