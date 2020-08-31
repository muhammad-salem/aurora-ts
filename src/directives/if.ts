import { OnInit, AfterViewInit } from '../core/lifecycle.js';
import { View, Input, HostBinding, Directive } from '../core/decorators.js';
import { StructuralDirective } from './directive.js';
import { JsxComponent } from '../jsx/factory.js';
import { HTMLComponent } from '../elements/component.js';
import { ComponentRender } from '../jsx/render.js';

@Directive({
	selector: '*if',
})
export class IfDirective<T> extends StructuralDirective<T> implements OnInit, AfterViewInit {

	constructor(
		render: ComponentRender<T>,
		parentComponent: HTMLComponent<T>,
		comment: Comment,
		value: string,
		children: (string | JsxComponent)[]
	) {
		super(render, parentComponent, comment, value, children);
	}

	// @Input() comment: Comment;
	// @Input() component: JsxComponent;
	// @Input() viewComponent: HTMLComponent<object>;
	// @Input() render: ComponentRender<object>;

	@HostBinding('condition')
	condition: boolean;

	@View()
	view: HTMLElement;

	@Input()
	set if(condition: boolean) { }

	@Input()
	set ifThen(view: any) { }

	@Input()
	set ifElse(view: any) { }


	onInit(): void {
		console.log('IfDirective#onInit()');
	}

	afterViewInit(): void {
		console.log('IfDirective#onInit()');
	}

}
