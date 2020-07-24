import { BaseComponent } from '../elements/component';
import { JsxComponent } from './factory';
import { ComponentRef } from '../elements/elements';

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
    constructor(public baiseView: BaseComponent, public componentRef: ComponentRef) {
        if (typeof componentRef.componentOptions.template === 'string') {
            this.template = new HTMLParser(componentRef.componentOptions.template).parse();
        } else if (componentRef.componentOptions.template) {
            this.template = componentRef.componentOptions.template;
        } else if (componentRef.componentOptions.extend) {
            // 
        }
        else {
            throw new Error("Method not implemented.");
        }
    }
    initView(): void {
        console.log(this.template);
    }
}

export function appendChild(parent: Node, child: any) {
    if (typeof child === "undefined" || child === null) {
        return;
    }
    if (Array.isArray(child)) {
        for (const value of child) {
            appendChild(parent, value);
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
