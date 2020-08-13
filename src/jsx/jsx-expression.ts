import { ComponentRender } from './render.js';
import { BaseComponent, isBaseComponent } from '../elements/component.js';
import { ComponentRef } from '../elements/elements.js';
import { setValueByPath, getValueByPath, updateValue, updateAttribute } from '../core/utils.js';

export class JSXComponentRender<T> extends ComponentRender<T> {
    constructor(baiseView: BaseComponent<T> & HTMLElement, componentRef: ComponentRef<T>) {
        super(baiseView, componentRef);
        this.templateRegExp = (/\$(\w*)(\(\))?/g);
    }

    initAttribute(element: HTMLElement, elementAttr: string, viewProperty: any): void {

        if (elementAttr.startsWith('#')) {
            // this.baiseView[elementAttr.substring(1)] = element;
            Reflect.set(this.baiseView, elementAttr.substring(1), element);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'string' && viewProperty.startsWith('$')) {
            // $elementAttr="$viewProperty" 
            elementAttr = elementAttr.substring(1);
            viewProperty = viewProperty.substring(1);
            this.updateElementData(element, elementAttr, viewProperty);
            this.addViewPropertyBinding(element, elementAttr, viewProperty);
            this.addElementPropertyBinding(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'string') {
            // $elementAttr="viewProperty" 
            elementAttr = elementAttr.substring(1);
            this.updateElementData(element, elementAttr, viewProperty);
            this.addViewPropertyBinding(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'object') {
            // bad practice
            // $elementAttr={viewProperty} // as an object
            elementAttr = elementAttr.substring(1);
            setValueByPath(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('on')) {
            // onelementAttr="modelProperty()"
            // onelementAttr={modelProperty} // as an function
            let func: Function;
            if (typeof viewProperty === 'string') {
                if (viewProperty.endsWith('()')) {
                    viewProperty = viewProperty.substring(0, viewProperty.length - 2);
                }
                let method = this.baiseView._model[viewProperty];
                if (method && typeof method === 'function') {
                    func = method;
                } else {
                    console.error('can not find event callback func for', elementAttr, viewProperty);
                    return;
                }
            }
            else if (typeof viewProperty === 'function') {
                func = viewProperty;
            }
            element.addEventListener(elementAttr.substring(2), (event) => {
                func.call(this.baiseView._model);
            });
        }
        else {
            if (typeof viewProperty === 'boolean' && !viewProperty) {
                element.removeAttribute(elementAttr);
            } else {
                element.setAttribute(elementAttr, viewProperty);
            }
            // setValueByPath(element, elementAttr, modelProperty);
            // Reflect.set(element, elementAttr, modelProperty);
        }
    }

    // handleAttributes(element: HTMLElement, propertyKey: string, propertyValue: any) {
    //     if (propertyKey.startsWith('#')) {
    //         Reflect.set(this.baiseView, propertyKey.substring(1), element);
    //     } else if (propertyKey.startsWith('$')) {
    //         // a JSX binding 
    //         const elementAttr = propertyKey.substring(1);
    //         let viewProperty = propertyValue;
    //         console.log(element, elementAttr, this.baiseView, viewProperty);
    //         if (typeof viewProperty === 'string' && viewProperty.startsWith('$')) {
    //             // 2 way binding
    //             viewProperty = viewProperty.substring(1);
    //             let eventName = (element instanceof HTMLInputElement && elementAttr === 'value') ?
    //                 'input' : elementAttr;
    //             element.addEventListener(eventName, (event: Event) => {
    //                 updateValue(element, elementAttr, this.baiseView, viewProperty);
    //                 this.baiseView._observable.emit(viewProperty);
    //             });
    //         }
    //         this.baiseView.addEventListener(viewProperty, (event: Event) => {
    //             updateValue(this.baiseView, viewProperty, element, elementAttr);
    //             // this.baiseView._observable.emit(viewProperty);
    //         });
    //         updateValue(this.baiseView, viewProperty, element, elementAttr);
    //         // updateAttribute(element, elementAttr, this.baiseView, viewProperty);
    //         // element.setAttribute(elementAttr, getValueByPath(this.baiseView, viewProperty));
    //     } else if (propertyKey.startsWith('on')) {
    //         element.addEventListener(propertyKey.substring(2), (event) => {
    //             (<Function>propertyValue).call(this.baiseView._model);
    //         });
    //     } else {
    //         if (typeof propertyValue === 'object') {
    //             let modelName = this.getModelName(propertyValue);
    //             let handler: ProxyHandler<Object> = {
    //                 set: (target: Object, p: string | number | symbol, value: any, receiver: any): boolean => {
    //                     Reflect.set(target, p, value, receiver);
    //                     console.log('set', target, p, modelName + '.' + p.toString());
    //                     this.baiseView._observable.emit(modelName + '.' + p.toString());
    //                     return true;
    //                 }
    //             };
    //             let proxy = new Proxy(propertyValue, handler);
    //             element.setAttribute(propertyKey, proxy);
    //         } else {
    //             element.setAttribute(propertyKey, propertyValue);
    //         }
    //     }
    // }
    //
    // getModelName(target: Object): string | undefined {
    //     let keys = Object.keys(this.baiseView._model);
    //     for (let i = 0; i < keys.length; i++) {
    //         if (this.baiseView._model[keys[i]] === target) {
    //             return keys[i];
    //         }
    //     }
    //     return undefined;
    // }
}