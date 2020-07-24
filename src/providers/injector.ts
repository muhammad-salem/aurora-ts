

// function keysFor(group: string, target: any, propkey?: string) {
//     console.group(group);
//     // console.log(target, propkey);
//     const keys = Reflect.getMetadataKeys(target, propkey);
//     console.log(keys);
//     for (const key of keys) {
//         console.log(key, Reflect.getMetadata(key, target, propkey));
//     }
//     console.groupEnd();
// }

// export function printMetadate(): void {
//     [...ClassProvider.values()].forEach(provider => {
//         console.group(provider.className);
//         keysFor(provider.className, provider.classRef);
//         console.groupEnd();
//     });
//     return void 0;
// }

// export function setupComponents(): void {
//     [...ClassProvider.values()]
//         .filter(ref => ref.providerType === 'component')
//         .forEach(provider => {
//             console.group(provider.className);
//             // const keys: MetaDataKey[] = Reflect.getMetadataKeys(provider.classRef);

//             const componentRef: ComponentRef = new ComponentRef(provider.classRef.prototype);

//             componentRef.inputs = getInputs(provider.classRef)
//                 .map(meta => new PropertyRef(meta.propertyName, meta.value, meta.desc));
//             componentRef.outputs = getOutputs(provider.classRef)
//                 .map(meta => new PropertyRef(meta.propertyName, meta.value, meta.desc));
//             componentRef.hostListeners = getHostListener(provider.classRef)
//                 .map(meta => new ListenerRef(meta.value.eventName, meta.value.args, meta.propertyName));
//             componentRef.viewChild = getViewChild(provider.classRef)
//                 .map(meta => new ChildRef(meta.propertyName, meta.value.selector, meta.value.childOptions));


//             if (Reflect.hasMetadata('design:component', provider.classRef)) {
//                 componentRef.componentOptions = getComponentOptions(provider.classRef)
//                     .map(meta => meta.value)[0];
//                 addComponentRef(provider.classRef.prototype, componentRef);
//                 ComponentElement.defineComponent(provider.classRef, componentRef.componentOptions);
//             }
//             console.log(componentRef);
//             console.groupEnd();
//         });
//     return void 0;
// }

// window['printMetadate'] = printMetadate;
// window['setupComponents'] = setupComponents;