
interface ObservedCallback {
    oldValue?: any;
    callbackArray: Function[];
}

export class ObservableValue {
    private subscripers: Map<string, ObservedCallback> = new Map();
    constructor() { }
    emit(propertyPath: string, value?: any): void {
        const observed = this.subscripers.get(propertyPath);
        if (observed) {
            observed.oldValue = value;
            observed.callbackArray.forEach(callback => {
                try {
                    callback(value);
                } catch (error) {
                    console.error("error at call ", callback.name);
                }
            });
        } else {
            this.subscripers.set(propertyPath, { oldValue: value, callbackArray: [] });
        }
    }
    subscribe(attrName: string, callback: Function): void {
        const observed = this.subscripers.get(attrName);
        if (observed) {
            observed.callbackArray.push(callback);
            observed.oldValue || callback(observed.oldValue);
        } else {
            this.subscripers.set(attrName, { callbackArray: [callback] });
        }
    }

    destroy() {
        this.subscripers.clear();
    }
}


export class Observable {
    private subscripers: Map<string, Function[]> = new Map();
    constructor() { }
    emit(propertyPath: string): void {
        [...this.subscripers.keys()]
            .filter(key => key?.startsWith(propertyPath) || propertyPath.startsWith(key))
            // .filter(key => propertyPath.startsWith(key))
            // .filter(key => key === propertyPath)
            .map(key => this.subscripers.get(key))
            .forEach(callbacks => {
                callbacks?.forEach(callback => {
                    try {
                        callback();
                    } catch (error) {
                        console.error("error at call ", callback.name);
                    }
                });
            });
    }

    emitValue(propertyPath: string, value?: any): void {
        this.subscripers.get(propertyPath)?.forEach(callback => {
            try {
                callback(value);
            } catch (error) {
                console.error("error at call ", callback.name);
            }
        });
    }

    subscribe(attrName: string, callback: Function): void {
        const callbacks = this.subscripers.get(attrName);
        if (callbacks) {
            callbacks.push(callback);
        } else {
            this.subscripers.set(attrName, [callback]);
        }
    }

    destroy() {
        this.subscripers.clear();
    }

    has(attrName: string): boolean {
        return this.subscripers.has(attrName);
    }
}
