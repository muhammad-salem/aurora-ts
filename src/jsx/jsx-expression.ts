import { ComponentRender } from './render.js';
import { BaseComponent } from '../elements/component.js';
import { ComponentRef } from '../elements/elements.js';
import { setValueByPath } from '../core/utils.js';

export class JSXComponentRender<T> extends ComponentRender<T> {
    constructor(baiseView: BaseComponent<T> & HTMLElement, componentRef: ComponentRef<T>) {
        super(baiseView, componentRef);
        // this.templateRegExp = (/\$(\w*)(\(\))?/g);
        this.templateRegExp = (/0\$\#\$(\w*)?/g);
    }

    initAttribute(element: HTMLElement, elementAttr: string, viewProperty: any, bindMap: Map<string, string>): void {

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
            bindMap.set(elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'string') {
            // $elementAttr="viewProperty" 
            elementAttr = elementAttr.substring(1);
            this.updateElementData(element, elementAttr, viewProperty);
            this.addViewPropertyBinding(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'object') {
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
                func.call(this.baiseView._model, event);
            });
        }
        else if (typeof viewProperty === 'string' && viewProperty.startsWith('$')) {
            // bad practice
            // elementAttr="$viewProperty" // as an object
            viewProperty = viewProperty.substring(1);
            this.updateElementData(element, elementAttr, viewProperty);
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

}