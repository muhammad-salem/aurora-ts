import { getBootstrapMatadata, ComponentRef, PropertyRef } from "../elements/elements";

export type ProviderType = 'component' | 'service' | 'directive' | 'pipe' | 'self';

// interface ClassRegistry {
//     // [key: string]: WeakSet<Function>;
//     component: WeakSet<Function>;
//     service: WeakSet<Function>;
//     directive: WeakSet<Function>;
//     pipe: WeakSet<Function>;
// }

export class /*ClassProvider implements*/ ClassRegistry {

    viewSet: Set<Function> = new Set();
    componentSet: Set<Function> = new Set();
    serviceSet: Set<Function> = new Set();
    directiveSet: Set<Function> = new Set();
    pipeSet: Set<Function> = new Set();

    registerView(classRef: Function): void { this.viewSet.add(classRef); }
    registerComponent(classRef: Function): void { this.componentSet.add(classRef); }
    registerService(classRef: Function): void { this.serviceSet.add(classRef); }
    registerDirective(classRef: Function): void { this.directiveSet.add(classRef); }
    registerPipe(classRef: Function): void { this.pipeSet.add(classRef); }

    hasComponet(selector: string): boolean {
        for (const modelClass of this.componentSet) {
            const componentRef: ComponentRef = getBootstrapMatadata(modelClass.prototype);
            if (componentRef.selector === selector) {
                return true;
            }
        }
        return false;
    }
    getComponentRef(selector: string): ComponentRef | undefined {
        for (const modelClass of this.componentSet) {
            const componentRef: ComponentRef = getBootstrapMatadata(modelClass.prototype);
            if (componentRef.selector === selector) {
                return componentRef;
            }
        }
    }

    getComponet(selector: string) {
        // this.componentSet.
        for (const modelClass of this.componentSet) {
            const componentRef: ComponentRef = getBootstrapMatadata(modelClass.prototype);
            if (componentRef.selector === selector) {
                return modelClass;
            }
        }
    }

    getComponetView(selector: string) {
        return this.getComponentRef(selector)?.viewClass;
    }


    hasOutput(model: Object, eventName: string): PropertyRef | boolean {
        if (Reflect.has(model, 'bootstrap')) {
            const componentRef: ComponentRef = Reflect.get(model, 'bootstrap');
            if (componentRef.outputs) {
                for (const out of componentRef.outputs) {
                    if (out.viewAttribute === eventName) {
                        return out;
                    }
                }
            }

        }
        return false;
    }

}