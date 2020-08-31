import { OnInit } from '../core/lifecycle.js';
import { Directive } from '../core/decorators.js';
import { StructuralDirective } from './directive.js';
import { JsxComponent } from '../jsx/factory.js';
import { ComponentRender } from '../jsx/render.js';

@Directive({
    selector: '*for',
})
export class ForDirective<T> extends StructuralDirective<T> implements OnInit {

    constructor(
        render: ComponentRender<T>,
        comment: Comment,
        value: string,
        component: JsxComponent) {
        super(render, comment, value, component);
    }

    onInit(): void {
        console.log('ForDirective#onInit()');
    }

}