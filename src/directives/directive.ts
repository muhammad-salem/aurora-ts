import { JsxAttrComponent } from '../jsx/factory.js';
import { ComponentRender } from '../view/render.js';
// import { ComponentRender } from '../view/render.js';

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
        protected render: ComponentRender<T>,
        protected comment: Comment,
        protected statement: string,
        protected component: JsxAttrComponent
    ) { }
}

/**
 * An attributes directive selector as '[if]'
 */
export class AttributeDirective<T> {
    constructor(protected render: ComponentRender<T>, ...values: any[]) { }
}
