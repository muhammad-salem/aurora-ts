/**
 * angulr way: response to '{{expression}}'
 * react way: bind-"sourecPropertyName"="modelPropertName"
 *
 * "$class": "className"
 *
 */
export class HTMLTempletExpression {}

/**
 * response to [sourecPropertyName]="('view/model')PropertName"
 *
 * "$class": "className"
 */
export class HTMLBindingExpression {}

/**
 * response to [(sourecPropertyName)]="('view/model')PropertName"
 *
 * "$class": "className"
 */
export class HTML2BindingExpression {}

/**
 * response to (eventName)="modelCallbackFun()"
 */
export class HTMLEventExpression {}
