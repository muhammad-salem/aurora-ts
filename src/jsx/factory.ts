declare global {
	export namespace JSX {
		interface IntrinsicElements {
			[elemName: string]: 'fragment' | 'comment' | any;
		}
	}
}


// export type TagNameRef = string | 'none' | CustomElementConstructor | TypeOf<HTMLElement> | Comment | DocumentFragment;

export type JsxAttributes = { [key: string]: any };

export interface JsxComponent {
	tagName: string;
	attributes?: JsxAttributes;
	children?: (string | JsxComponent)[];
}

export interface JsxComponentWithName extends JsxComponent {
	definedElement: HTMLElement;
}

export function isJsxComponentWithName(componet: JsxComponent): componet is JsxComponentWithName {
	return Reflect.has(componet, 'definedElement');
}

export function toJsxComponentWithName(componet: JsxComponent, definedElement: HTMLElement): void {
	(componet as JsxComponentWithName).definedElement = definedElement;
}

// export type JsxType = HTMLElement | HTMLElement[] | Comment;
// export type JsxType = string | JsxComponent;
// export type JsxType = JsxComponent | JsxComponent[];

export class JsxFactory {

	static Fragment = 'fragment';

	static createElement(tagName: string, attributes: JsxAttributes | undefined, ...children: JsxComponent[]): JsxComponent {
		return {
			tagName: tagName,
			attributes,
			children,
		};
	}
}
