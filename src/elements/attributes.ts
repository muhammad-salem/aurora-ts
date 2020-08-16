import { isHTMLComponent } from './component.js';
import { findByModelClassOrCreat } from '../reflect/bootstrap-data.js';
import { ComponentRef } from '../elements/elements.js';


export interface AttrRef {
    readonly [attr: string]: string[];
}

/**
 * @see https://html.spec.whatwg.org/multipage/indices.html#elements-3
 */
export const GlobalAttributes = [
    'accesskey',
    'autocapitalize',
    'autofocus',
    'contenteditable',
    'dir',
    'draggable',
    'enterkeyhint',
    'hidden',
    'inputmode',
    'is',
    'itemid',
    'itemprop',
    'itemref',
    'itemscope',
    'itemtype',
    'lang',
    'nonce',
    'spellcheck',
    'style',
    'tabindex',
    'title',
    'translate'
];

export const Attrs: AttrRef = {
    a: [...GlobalAttributes, 'href', 'target', 'download', 'ping', 'rel', 'hreflang', 'type', 'referrerpolicy'],
    abbr: GlobalAttributes,
    address: GlobalAttributes,
    area: [...GlobalAttributes, 'alt', 'coords', 'shape', 'href', 'target', 'download', 'ping', 'rel', 'referrerpolicy'],
    article: GlobalAttributes,
    aside: GlobalAttributes,
    audio: [...GlobalAttributes, 'src', 'crossorigin', 'preload', 'autoplay', 'loop', 'muted', 'controls'],
    b: GlobalAttributes,
    base: [...GlobalAttributes, 'href', 'targetreferrerpolicy'],
    bdi: GlobalAttributes,
    bdo: GlobalAttributes,
    blockquote: [...GlobalAttributes, 'cite'],
    body: [...GlobalAttributes, 'onafterprint; onbeforeprint; onbeforeunload; onhashchange; onlanguagechange; onmessage; onmessageerror; onoffline; ononline; onpagehide; onpageshow; onpopstate; onrejectionhandled; onstorage; onunhandledrejection; onunload'],
    br: GlobalAttributes,
    button: [...GlobalAttributes, 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'name', 'type', 'value'],
    canvas: [...GlobalAttributes, 'width', 'height'],
    caption: GlobalAttributes,
    cite: GlobalAttributes,
    code: GlobalAttributes,
    col: [...GlobalAttributes, 'span'],
    colgroup: [...GlobalAttributes, 'span'],
    data: [...GlobalAttributes, 'value'],
    datalist: GlobalAttributes,
    dd: GlobalAttributes,
    del: [...GlobalAttributes, 'cite', 'datetime'],
    details: [...GlobalAttributes, 'open'],
    dfn: GlobalAttributes,
    dialog: [...GlobalAttributes, 'open'],
    div: GlobalAttributes,
    dl: GlobalAttributes,
    dt: GlobalAttributes,
    em: GlobalAttributes,
    embed: [...GlobalAttributes, 'src', 'type', 'width', 'height', 'any*'],
    fieldset: [...GlobalAttributes, 'disabled', 'form', 'name'],
    figcaption: GlobalAttributes,
    figure: GlobalAttributes,
    footer: GlobalAttributes,
    form: [...GlobalAttributes, 'accept-charset', 'action', 'autocomplete', 'enctype', 'method', 'name', 'novalidate', 'target'],
    h1: GlobalAttributes,
    h2: GlobalAttributes,
    h3: GlobalAttributes,
    h4: GlobalAttributes,
    h5: GlobalAttributes,
    h6: GlobalAttributes,
    head: GlobalAttributes,
    header: GlobalAttributes,
    hgroup: GlobalAttributes,
    hr: GlobalAttributes,
    html: [...GlobalAttributes, 'manifest'],
    i: GlobalAttributes,
    iframe: [...GlobalAttributes, 'src', 'srcdoc', 'name', 'sandbox', 'allow', 'allowfullscreen', 'allowpaymentrequest', 'width', 'height', 'referrerpolicy', 'loading'],
    img: [...GlobalAttributes, 'alt', 'src', 'srcset', 'sizes', 'crossorigin', 'usemap', 'ismap', 'width', 'height', 'referrerpolicy', 'decoding', 'loading'],
    input: [...GlobalAttributes, 'accept', 'alt', 'autocomplete', 'checked', 'dirname', 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'height', 'list', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'src', 'step', 'type', 'value', 'width'],
    ins: [...GlobalAttributes, 'cite', 'datetime'],
    kbd: GlobalAttributes,
    label: [...GlobalAttributes, 'for'],
    legend: GlobalAttributes,
    li: [...GlobalAttributes, 'value'],
    link: [...GlobalAttributes, 'href', 'crossorigin', 'rel', 'as', 'media', 'hreflang', 'type', 'sizes', 'imagesrcset', 'imagesizes', 'referrerpolicy', 'integrity', 'color', 'disabled'],
    main: GlobalAttributes,
    map: [...GlobalAttributes, 'name'],
    mark: GlobalAttributes,
    menu: GlobalAttributes,
    meta: [...GlobalAttributes, 'name', 'http-equiv', 'content', 'charset'],
    meter: [...GlobalAttributes, 'value', 'min', 'max', 'low', 'high', 'optimum'],
    nav: GlobalAttributes,
    noscript: GlobalAttributes,
    object: [...GlobalAttributes, 'data', 'type', 'name', 'usemap', 'form', 'width', 'height'],
    ol: [...GlobalAttributes, 'reversed', 'start', 'type'],
    optgroup: [...GlobalAttributes, 'disabled', 'label'],
    option: [...GlobalAttributes, 'disabled', 'label', 'selected', 'value'],
    output: [...GlobalAttributes, 'for', 'form', 'name'],
    p: GlobalAttributes,
    param: [...GlobalAttributes, 'name', 'value'],
    picture: GlobalAttributes,
    pre: GlobalAttributes,
    progress: [...GlobalAttributes, 'value', 'max'],
    q: [...GlobalAttributes, 'cite'],
    rp: GlobalAttributes,
    rt: GlobalAttributes,
    ruby: GlobalAttributes,
    s: GlobalAttributes,
    samp: GlobalAttributes,
    script: [...GlobalAttributes, 'src', 'type', 'async', 'defer', 'crossorigin', 'integrity', 'referrerpolicy'],
    section: GlobalAttributes,
    select: [...GlobalAttributes, 'autocomplete', 'disabled', 'form', 'multiple', 'name', 'required', 'size'],
    slot: [...GlobalAttributes, 'name'],
    small: GlobalAttributes,
    source: [...GlobalAttributes, 'src', 'type', 'srcset', 'sizes', 'media'],
    span: GlobalAttributes,
    strong: GlobalAttributes,
    style: [...GlobalAttributes, 'media'],
    sub: GlobalAttributes,
    summary: GlobalAttributes,
    sup: GlobalAttributes,
    table: GlobalAttributes,
    tbody: GlobalAttributes,
    td: [...GlobalAttributes, 'colspan', 'rowspan', 'headers'],
    template: GlobalAttributes,
    textarea: [...GlobalAttributes, 'cols', 'dirname', 'disabled', 'form', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'rows', 'wrap'],
    tfoot: GlobalAttributes,
    th: [...GlobalAttributes, 'colspan', 'rowspan', 'headers', 'scope', 'abbr'],
    thead: GlobalAttributes,
    time: [...GlobalAttributes, 'datetime'],
    title: GlobalAttributes,
    tr: GlobalAttributes,
    track: [...GlobalAttributes, 'default', 'kind', 'label', 'src', 'srclang'],
    u: GlobalAttributes,
    ul: GlobalAttributes,
    var: GlobalAttributes,
    video: [...GlobalAttributes, 'src', 'crossorigin', 'poster', 'preload', 'autoplay', 'playsinline', 'loop', 'muted', 'controls', 'width', 'height'],
    wbr: GlobalAttributes,
    'virtual-scroller': GlobalAttributes
};


export function hasNativeAttr(element: string | HTMLElement, attr: string): boolean {
    if (typeof element === 'string') {
        return Attrs[element.toLowerCase()]?.includes(attr);
    } else if (element instanceof HTMLElement) {
        const tagName = element.tagName.toLowerCase();
        return Attrs[tagName]?.includes(attr);
    }
    return false;
}

export function hasComponentAttr(element: HTMLElement, attr: string): boolean {
    if (isHTMLComponent(element)) {
        var componentRef: ComponentRef<any> = element.getComponentRef();
        return componentRef.inputs.some(input => input.viewAttribute === attr);
    }
    return false;
}

export function hasAttr(element: HTMLElement, attr: string): boolean {
    return hasNativeAttr(element, attr) || hasComponentAttr(element, attr);
}