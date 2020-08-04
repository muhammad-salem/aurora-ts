
export function findByModelClassOrCreat<T = any>(modelProperty: Object): T {
    var bootstrapMetadata: T = Reflect.get(modelProperty, 'bootstrap');
    if (!bootstrapMetadata) {
        bootstrapMetadata = {} as T;
        Object.defineProperty(modelProperty, 'bootstrap', { value: bootstrapMetadata });
    }
    return bootstrapMetadata;
}

// export function setBootstrapMatadata(modelProperty: Object, metadata: Object) {
//     Reflect.set(modelProperty, 'bootstrap', metadata);
// }

export function getBootstrapMatadata<T = any>(modelProperty: Object): T {
    return Reflect.get(modelProperty, 'bootstrap');
}