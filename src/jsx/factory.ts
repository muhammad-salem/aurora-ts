declare global {
	export namespace JSX {
		interface IntrinsicElements {
			[elemName: string]: 'fragment' | any;
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

// export type JsxType = HTMLElement | HTMLElement[] | Comment;
// export type JsxType = string | JsxComponent;
// export type JsxType = JsxComponent | JsxComponent[];

export const Fragment = 'fragment';

export class JsxFactory {
	static createElement(tagName: string, attributes: JsxAttributes | undefined, ...children: JsxComponent[]): JsxComponent {
		return {
			tagName: tagName,
			attributes,
			children,
		};
	}
}
