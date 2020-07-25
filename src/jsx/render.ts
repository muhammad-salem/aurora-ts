import { BaseComponent } from '../elements/component';
import { JsxComponent, Fragment } from './factory';
import { ComponentRef, ListenerRef, PropertyRef } from '../elements/elements';
import { dependencyInjector } from '../providers/injector';
import { ClassRegistry } from '../providers/provider';
import { EventEmitter } from '../core/events';

export class HTMLParser {
    constructor(public template: string) { }
    parse(): JsxComponent {
        return {
            tagName: 'div',
            attributes: {},
            children: []
        }
    }
}

export class ComponentRender {

    template: JsxComponent;

    constructor(public baiseView: BaseComponent & HTMLElement, public componentRef: ComponentRef) {
        if (typeof componentRef.template === 'string') {
            this.template = new HTMLParser(componentRef.template).parse();
        } else if (componentRef.template) {
            this.template = componentRef.template;
        } else if (componentRef.extend) {
            // 
        }
        else {
            throw new Error("Method not implemented.");
        }
    }

    initView(): void {
        // console.log(this);
        this.baiseView.appendChild(this.createElement(this.template));
        this.componentRef.hostListeners?.forEach(listener => this.handelHostListener(listener));
    }

    createElement(viewTemplate: JsxComponent): HTMLElement | DocumentFragment {
        const element = this.setupElement(viewTemplate.tagName);

        if (viewTemplate.attributes) {
            for (const key in viewTemplate.attributes) {
                this.handleAttributes(<HTMLElement>element, key, viewTemplate.attributes[key]);
            }
        }
        if (viewTemplate.children) {
            for (const child of viewTemplate.children) {
                this.appendChild(element, child);
            }
        }

        return element;
    }

    setupElement(tagName: string): HTMLElement | DocumentFragment {
        if (Fragment === tagName.toLowerCase()) {
            return document.createDocumentFragment();
            // } else if (isTagNameNative(tagName)) {
            //     return document.createElement(tagName);
        } else if (tagName.includes('-')) {
            const registry: ClassRegistry = dependencyInjector
                .getInstance(ClassRegistry);
            const componentRef: ComponentRef | undefined = registry.getComponentRef(tagName);
            return componentRef ? new componentRef.viewClass() : document.createElement(tagName);
        } else {
            return document.createElement(tagName);
        }
    }

    appendChild(parent: Node, child: any) {
        if (typeof child === "undefined" || child === null) {
            return;
        }
        if ((child as JsxComponent).tagName) {
            parent.appendChild(this.createElement(child));
        } else if (Array.isArray(child)) {
            for (const value of child) {
                this.appendChild(parent, value);
            }
        } else if (typeof child === "string") {
            parent.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            parent.appendChild(child);
        } else if (typeof child === "boolean") {
            // <>{condition && <a>Display when condition is true</a>}</>
            // if condition is false, the child is a boolean, but we don't want to display anything
        } else {
            parent.appendChild(document.createTextNode(String(child)));
        }
    }

    handleAttributes(element: HTMLElement, key: string, value: any) {
        if (key.startsWith('#')) {
            this.baiseView[key.substring(1)] = element;
        } else {
            Reflect.set(element, key, value);
            if (typeof value === "boolean" && value) {
                element.setAttribute(key, "");
            } else {
                element.setAttribute(key, value);
            }
        }
    }

    handelHostListener(listener: ListenerRef) {
        let eventName: string = listener.eventName,
            source: HTMLElement | Window,
            eventCallback: Function = this.baiseView.model[listener.modelCallbackName];
        if (listener.eventName.includes(':')) {
            let eventSource = eventName.substring(0, eventName.indexOf(':'));
            eventName = eventName.substring(eventName.indexOf(':') + 1);
            if ('window' === eventSource.toLowerCase()) {
                source = window;
                this.addNativeEventListener(source, eventName, eventCallback);
                return;
            } else if (eventSource in this.baiseView) {
                source = Reflect.get(this.baiseView, eventSource);
                if (!Reflect.has(source, 'model')) {
                    this.addNativeEventListener(source, eventName, eventCallback);
                    return;
                }
            } else {
                source = this.baiseView;
            }
        } else {
            source = this.baiseView;
        }
        const sourceModel = Reflect.get(source, 'model');
        const output = dependencyInjector
            .getInstance(ClassRegistry)
            .hasOutput(sourceModel, eventName);
        if (output) {
            (sourceModel[(output as PropertyRef).modelProperty] as EventEmitter<any>)
                .subscribe((value: any) => {
                    eventCallback.call(sourceModel, value);
                });
        }
        else if (Reflect.has(source, 'on' + eventName)) {
            this.addNativeEventListener(source, eventName, eventCallback);
        }
    }
    addNativeEventListener(source: HTMLElement | Window, eventName: string, funcallback: Function) {
        source.addEventListener(eventName, (event: Event) => {
            // funcallback(event);
            funcallback.call(this.baiseView.model, event);
        });
    }
    private hasEventEmitter(source: HTMLElement | Window, eventName: string) {
        if (this.componentRef.outputs) {
            for (const output of this.componentRef.outputs) {
                if (output.viewAttribute === eventName) {
                    return true;
                }
            }
        }
        return false;
    }

}