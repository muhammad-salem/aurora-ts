import { HTMLComponent } from '../elements/component.js';
import { JsxComponent } from '../jsx/factory.js';
import { ComponentRender } from '../jsx/render.js';

/**
 * A structural directive selector '*if',
 * An attribute directive selector '[if]'
 */
// export interface TemplateDirective {
//     comment: Comment;
//     component: JsxComponent;
//     viewComponent: HTMLComponent<object>;
//     render: ComponentRender<object>;
// }

/**
 * A structural directive selector as '*if'
 */
export class StructuralDirective<T> {
    constructor(
        private render: ComponentRender<T>,
        private parentComponent: HTMLComponent<T>,
        private comment: Comment,
        private value: string,
        private children: (string | JsxComponent)[]
    ) { }
}

/**
 * An attributes directive selector as '[if]'
 */
export class AttributeDirective<T> {
    constructor(protected viewContainer: ComponentRender<T>, ...values: any[]) { }
}
