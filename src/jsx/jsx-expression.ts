import { ComponentRender } from './render.js';
import { HTMLComponent } from '../elements/component.js';
import { setValueByPath } from '../core/utils.js';
import { hasAttr } from '../elements/attributes.js';

export class JSXComponentRender<T> extends ComponentRender<T> {
    constructor(baiseView: HTMLComponent<T>) {
        super(baiseView);
    }

    initAttribute(element: HTMLElement, elementAttr: string, viewProperty: any): void {

        if (elementAttr.startsWith('#')) {
            // <app-tag #element-name ></app-tag>
            Reflect.set(this.baiseView, elementAttr.substring(1), element);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'string' && viewProperty.startsWith('$')) {
            // $elementAttr="$viewProperty" 
            elementAttr = elementAttr.substring(1);
            viewProperty = viewProperty.substring(1);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            this.bind2Way(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('$') && typeof viewProperty === 'string') {
            // $elementAttr="viewProperty" 
            elementAttr = elementAttr.substring(1);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            this.bind1Way(element, elementAttr, viewProperty);
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
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
        }
        else if (typeof viewProperty === 'string' && (/^\{\{(.+\w*)*\}\}/g).test(viewProperty)) {
            // elementAttr="{{viewProperty}}" // just pass data
            viewProperty = viewProperty.substring(2, viewProperty.length - 2);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            this.bind1Way(element, elementAttr, viewProperty);
        }
        else if (typeof viewProperty === 'string' && (/\{\{|\}\}/g).test(viewProperty)) {
            // elementAttr="any string{{viewProperty}}any text" // just pass data
            const isAttr = hasAttr(element, elementAttr);
            this.attrTemplateHandler(element, elementAttr, viewProperty, isAttr);
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