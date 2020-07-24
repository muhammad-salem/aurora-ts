
export class DependencyInjector {
    diMap: Map<Function, Object> = new Map();
    constructor() { }

    lookuo(constructor: Function, args: []): Object {
        let instance = this.diMap.get(constructor);
        if (instance) {
            return instance;
        }
        const metaData = Reflect.getMetadata('design:paramtypes', constructor);
        // console.log(metaData);
        // const argumentsInstances = metaData.map((params) => this.lookuo(params));
        return instance || {};
        // return this.#diMap.get(classFun) || (() => {
        //     let instance;

        //     return instance;
        // })();
    }
}