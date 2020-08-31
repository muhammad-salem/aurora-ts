import { OnInit } from '../core/lifecycle.js';
import { Directive } from '../core/decorators.js';
import { StructuralDirective } from './directive.js';
import { JsxComponent } from '../jsx/factory.js';
import { ComponentRender } from '../jsx/render.js';
import { subscribe1way } from '../model/model-change-detection.js';

@Directive({
	selector: '*if',
})
export class IfDirective<T> extends StructuralDirective<T> implements OnInit {

	condition: boolean;
	element: HTMLElement;

	constructor(
		render: ComponentRender<T>,
		comment: Comment,
		statement: string,
		component: JsxComponent) {
		super(render, comment, statement, component);
	}

	onInit(): void {
		console.log('IfDirective#onInit()');
		this.element = this.render.createElement(this.component) as HTMLElement;
		const propertySrc = this.render.getPropertySource(this.statement);
		let callback1 = () => {
			this.render.updateElementData(this, 'condition', propertySrc);
			this._updateView();
		};
		subscribe1way(propertySrc.src, propertySrc.property, this, 'condition', callback1);
		callback1();
	}

	private _updateView() {
		if (this.condition) {
			this.comment.after(this.element);
		} else {
			this.element.remove();
		}
	}

}
