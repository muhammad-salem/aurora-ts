import { OnInit, AfterViewInit } from '../core/lifecycle.js';
import { View, Input, HostBinding, Directive } from '../core/decorators.js';
import { StructuralDirective } from './directive.js';
import { JsxComponent } from '../jsx/factory.js';
import { HTMLComponent } from '../elements/component.js';
import { ComponentRender } from '../jsx/render.js';

@Directive({
    selector: '*for',
})
export class ForDirective<T> extends StructuralDirective<T> implements OnInit, AfterViewInit {

    constructor(
        render: ComponentRender<T>,
        parentComponent: HTMLComponent<T>,
        comment: Comment,
        value: string,
        children: (string | JsxComponent)[]
    ) {
        super(render, parentComponent, comment, value, children);
    }

    onInit(): void {

    }

    afterViewInit(): void {

    }

}