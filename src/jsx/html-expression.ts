import { ComponentRender } from './render.js';
import { HTMLComponent } from '../elements/component.js';
import { hasAttr } from '../elements/attributes.js';

export class HTMLComponentRender<T> extends ComponentRender<T> {
    constructor(baiseView: HTMLComponent<T>) {
        super(baiseView);
        this.templateRegExp = (/\{\{((\w| |\.|\+|-|\*|\\)*(\(\))?)\}\}/g);
    }

    initAttribute(element: HTMLElement, elementAttr: string, viewProperty: string, bindMap: Map<string, string>): void {

        if (elementAttr.startsWith('#')) {
            // this.baiseView[elementAttr.substring(1)] = element;
            Reflect.set(this.baiseView, elementAttr.substring(1), element);
        }
        else if (elementAttr.startsWith('[(')) {
            // [(elementAttr)]="modelProperty"
            elementAttr = elementAttr.substring(2, elementAttr.length - 2);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            this.addViewPropertyBinding(element, elementAttr, viewProperty, isAttr);
            this.addElementPropertyBinding(element, elementAttr, viewProperty);
            bindMap.set(elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('[')) {
            // [elementAttr]="modelProperty"
            elementAttr = elementAttr.substring(1, elementAttr.length - 1);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            this.addViewPropertyBinding(element, elementAttr, viewProperty, isAttr);
        }
        else if (typeof viewProperty === 'string' && (/^\{\{(.+\w*)*\}\}/g).test(viewProperty)) {
            // elementAttr="{{viewProperty}}" // just pass data
            viewProperty = viewProperty.substring(2, viewProperty.length - 2);
            const isAttr = hasAttr(element, elementAttr);
            this.initElementData(element, elementAttr, viewProperty, isAttr);
            // this.addViewPropertyBinding(element, elementAttr, viewProperty, isAttr);
        }
        else if (typeof viewProperty === 'string' && (/\{\{|\}\}/g).test(viewProperty)) {
            // elementAttr="any string{{viewProperty}}any text" // just pass data
            const isAttr = hasAttr(element, elementAttr);
            this.attrTemplateHandler(element, elementAttr, viewProperty, isAttr);
        }
        else if (elementAttr.startsWith('(')) {
            // (elementAttr)="modelProperty()"
            elementAttr = elementAttr.substring(1, elementAttr.length - 1);
            this.handleEvent(element, elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('on')) {
            // onelementAttr="modelProperty()"
            this.handleEvent(element, elementAttr.substring(2), viewProperty);
        }
        else {
            if (typeof viewProperty === 'boolean' && !viewProperty) {
                element.removeAttribute(elementAttr);
            } else {
                element.setAttribute(elementAttr, viewProperty);
            }
        }
    }

    private handleEvent(element: HTMLElement, elementAttr: string, modelProperty: string) {
        modelProperty = modelProperty.endsWith('()') ?
            modelProperty.substring(0, modelProperty.length - 2) : modelProperty;
        let callback: Function = this.baiseView._model[modelProperty];
        element.addEventListener(elementAttr, event => {
            callback.call(this.baiseView._model);
        });
    }
}