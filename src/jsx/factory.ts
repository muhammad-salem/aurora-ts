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
	element: HTMLElement;
}

export function isJsxComponentWithElement(componet: JsxComponent): componet is JsxComponentWithName {
	return Reflect.has(componet, 'element');
}

export function toJsxComponentWithElement(componet: JsxComponent, element: HTMLElement): void {
	(componet as JsxComponentWithName).element = element;
}

// export type JsxType = HTMLElement | HTMLElement[] | Comment;
// export type JsxType = string | JsxComponent;
// export type JsxType = JsxComponent | JsxComponent[];

export class JsxFactory {

	static Fragment = 'fragment';

	static Directive = 'directive';

	static createElement(tagName: string, attributes: JsxAttributes | undefined, ...children: JsxComponent[]): JsxComponent {
		if (attributes) {
			const keys = Object.keys(attributes);
			let directive = keys.find(key => key.startsWith('*')) || keys.find(key => key === '#directive');
			if (directive) {
				let directiveValue: string = attributes[directive];
				if (directive.startsWith('#')) {
					let temp = directiveValue.split('|', 2);
					Reflect.deleteProperty(attributes, directive);
					directive = temp[0];
					directiveValue = temp[1];
				} else {
					directiveValue = attributes[directive];
					Reflect.deleteProperty(attributes, directive);
				}
				return {
					tagName: JsxFactory.Directive,
					attributes: {
						directiveName: directive,
						directiveValue: directiveValue,
						component: {
							tagName: tagName,
							attributes,
							children
						}
					}
				}
			}
		}
		return {
			tagName: tagName,
			attributes,
			children
		};
	}
}
