import { JsxComponent, Fragment } from '../jsx/factory.js';
import { JSXRender } from '../core/decorators.js';
import { ComponentRender } from './render.js';
import { BaseComponent } from '../elements/component.js';
import { ComponentRef } from '../elements/elements.js';

export class HTMLComponentRender<T> extends ComponentRender<T> {
    constructor(baiseView: BaseComponent<T> & HTMLElement, componentRef: ComponentRef<T>) {
        super(baiseView, componentRef);
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
            this.initElementData(element, elementAttr, viewProperty);
            this.addViewPropertyBinding(element, elementAttr, viewProperty);
            this.addElementPropertyBinding(element, elementAttr, viewProperty);
            bindMap.set(elementAttr, viewProperty);
        }
        else if (elementAttr.startsWith('[')) {
            // [elementAttr]="modelProperty"
            elementAttr = elementAttr.substring(1, elementAttr.length - 1);
            this.initElementData(element, elementAttr, viewProperty);
            this.addViewPropertyBinding(element, elementAttr, viewProperty);
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

    // handleAttributes(element: HTMLElement, propertyKey: string, propertyValue: any) {
    //     // console.log(key, value);

    //     if (propertyKey.startsWith('#')) {
    //         // this.baiseView[key.substring(1)] = element;
    //         Reflect.set(this.baiseView, propertyKey.substring(1), element);
    //     } else if (propertyKey.startsWith('[')) {
    //         return;
    //     } else if (propertyKey.startsWith('(')) {
    //         return;
    //     } else if (typeof propertyValue === 'string' && (/\{\{(.+\w*)*\}\}/g).test(propertyValue)) {
    //         let propertyName = propertyValue.substring(2, propertyValue.length - 2);
    //         // this.templateHandler(element, key);
    //         element.setAttribute(propertyKey, this.baiseView._model[propertyName]);
    //         console.log(propertyName);
    //         if ('_observable' in element) {
    //             // (<BaseComponent>element)._observable.emit(propertyValue);
    //             (<BaseComponent<T>>element)._observable.subscribe(propertyKey, () => {
    //                 this.baiseView._setModelProp(propertyName, (element as HTMLElement).getAttribute(propertyKey));
    //                 // this.baiseView._model[propertyName] = (element as HTMLElement).getAttribute(propertyKey);
    //                 console.log(propertyName, event);
    //             });
    //         } else {
    //             // addListener(propertyKey, () => {
    //             //     this.baiseView._setModelProp(propertyName, element.getAttribute(propertyKey));
    //             // });
    //             // element.addEventListener(propertyKey, (event) => {
    //             //     this.baiseView._setModelProp(propertyName, element.getAttribute(propertyKey));
    //             //     // this.baiseView._model[propertyName] = element.getAttribute(propertyKey);
    //             //     console.log(propertyName, event);
    //             // });
    //         }

    //     } else if (propertyKey.startsWith('on')) {
    //         element.addEventListener(propertyKey.substring(2), (event) => {
    //             if (typeof propertyValue === 'function') {
    //                 propertyValue.call(this.baiseView._model);
    //             } else if (typeof propertyValue === 'string') {
    //                 propertyValue = propertyValue.substring(0, propertyValue.length - 2);
    //                 this.baiseView._model[propertyValue]();
    //             }
    //         });
    //     } else {
    //         if (typeof propertyValue === 'boolean' && propertyValue) {
    //             element.setAttribute(propertyKey, '');
    //         } else {
    //             element.setAttribute(propertyKey, propertyValue);
    //         }
    //     }
    // }

}

export function toJSXRender<T>(html: string): JSXRender<T> {
    // should render her all the variables and resolve binding
    return (model: T) => parseHtmlToJsxComponent(html) as JsxComponent;
}

export function parseHtmlToJsxComponent(html: string): JsxComponent | undefined {
    return childsToJsxComponent(parseHtml(html));
}

export function childsToJsxComponent(childList: (string | Child)[]): JsxComponent | undefined {
    if (!childList) {
        return undefined;
    }
    if (childList.length === 1) {
        const child = childList[0];
        if (typeof child === 'string') {
            /** a case that should never happen **/
            return { tagName: Fragment, children: [child] };
        } else {
            let root: JsxComponent = {
                tagName: child.tag as string,
                attributes: child.attrs
            };
            if (child.childs) {
                root.children = [];
                child.childs.forEach(item => {
                    root.children?.push(createComponent(item));
                });
            }
            return root;
        }

    } else if (childList.length >= 1) {
        let root: JsxComponent = { tagName: Fragment, children: [] };
        childList.forEach(item => {
            root.children?.push(createComponent(item));
        });
        return root;
    }
    return undefined;
}

function createComponent(child: string | Child): string | JsxComponent {
    if (typeof child === 'string') {
        // return { tagName: Fragment, children: [child] };
        return child;
    } else {
        let root: JsxComponent = { tagName: child.tag as string, attributes: child.attrs };
        if (child.childs) {
            root.children = [];
            child.childs.forEach(item => {
                root.children?.push(createComponent(item));
            });
        }
        return root;
    }
}

export interface Child {
    tag?: string;
    attrs?: { [key: string]: string };
    childs?: (Child | string)[];
}
export function parseHtml(html: string): (string | Child)[] {
    const arr: string[] = html.replace(/</g, '<^').split(/[<|>]/g)
        .filter(str => str?.trim())
        .map(str => str?.trim());
    return analysis(arr);
}

/**
 * tag name start with^, end tag name start with ^/
 * @param arr 
 * @param parent 
 */
function analysis(arr: string[]): (Child | string)[] {
    const childStack: (Child | string)[] = [];
    const stackTrace: (Child | string)[] = [];
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        if ((/^\^\w.*\//g).test(current)) {
            // self closing tag // has no childs // should push to parent
            stackTrace.push(defineChild(arr[i]));
            popElement(stackTrace, childStack);
        } else if ((/^\^\w/g).test(current)) {
            stackTrace.push(defineChild(arr[i]));
        } else if ((/^\^\/\w/g).test(current)) {
            popElement(stackTrace, childStack);
        } else {
            stackTrace.push(current);
            popElement(stackTrace, childStack);
        }
    }
    if (stackTrace.length > 0) {
        throw new Error(`error parsing html, had ${stackTrace.length} element, with no closing tag`);
    }
    return childStack;
}

function popElement(stackTrace: (string | Child)[], childStack: (string | Child)[]) {
    const element = stackTrace.pop();
    if (element) {
        const parent = stackTrace.pop();
        if (parent && typeof parent !== 'string') {
            parent.childs = parent.childs || [];
            parent.childs.push(element);
            stackTrace.push(parent);
        }
        else {
            childStack.push(element);
        }
    }
}

function defineChild(htmlStatement: string): Child {
    const currentElement: Child = {};
    const [tagName] = htmlStatement.split(/\s/);
    currentElement.tag = tagName.substring(1);
    const fisrtSpace = htmlStatement.indexOf(' ');

    if (fisrtSpace > 0) {
        const attrs = htmlStatement.substring(fisrtSpace + 1);
        currentElement.attrs = {};
        let key: string | null = null, value: string | null = null;
        const list = attrs.split(/\s/);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (/(\[?\(?\w*\)?\]?)="(.*)"/g.test(item)) {
                const temp = item.split(/="/);
                key = temp[0];
                value = temp[1].substring(0, temp[1].length - 1);
                currentElement.attrs[key] = value;
                key = value = null;
            } else if (/"/g.test(item)) {
                const temp = item.split(/="/);
                key = temp[0];
                value = temp[1];
                while (i < list.length) {
                    i++;
                    let next = list[i];
                    if (/.*"/g.test(next)) {
                        value += ' ' + next.substring(0, next.length - 1);
                        break;
                    } else {
                        value += ' ' + next;
                    }
                }
                currentElement.attrs[key] = value;
                key = value = null;
            } else {
                key = item;
                value = "true";
                currentElement.attrs[key] = value;
                key = value = null;
            }
        }

    }
    return currentElement;
}

// let html = `
//     Text 1
//     <div [(model)]="data" $foo="$bar" (click)="onClick()">
//         child text data
//     </div>
//     Text 2
//     Text 2_A
//     <div class="row">
//         <div class="col-4">
//             child1_A
//             child1_B
//         </div>
//         <div class="col-8">
//             child2
//             <div class="row">
//                 child3
//             </div>
//             child4
//             <input type="text" name="aaa" [prop]="dddd" />
//         </div>
//     </div>
//     Text 3_A
//     Text 3_B
//     `;

// parseHtml(html);
