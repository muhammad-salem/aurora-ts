export function isHTMLElement(object: any): object is HTMLElement {
	return (
		object.prototype instanceof HTMLElement ||
		object.__proto__ instanceof HTMLElement
	);
}
