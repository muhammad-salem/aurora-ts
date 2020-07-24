

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}


// export type TagNameRef = string | 'none' | CustomElementConstructor | TypeOf<HTMLElement> | Comment | DocumentFragment;

export type JsxAttributes = { [key: string]: any } | null;

export interface JsxComponent {
    tagName: string | DocumentFragment,
    attributes: JsxAttributes,
    children: JsxComponent[]
}

// export type JsxType = HTMLElement | HTMLElement[] | Comment;
// export type JsxType = string | JsxComponent;
// export type JsxType = JsxComponent | JsxComponent[];



export const Fragment = 'fragment';

export class JsxFactory {
    static createElement(tagName: string, attributes: JsxAttributes, ...children: JsxComponent[]): JsxComponent {
        return {
            tagName: Fragment === String(tagName).toLowerCase() ? document.createDocumentFragment() : tagName,
            attributes,
            children
        }
    }
}
