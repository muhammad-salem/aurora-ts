
declare global {
    namespace Reflect {
        function decorate(decorators: Function[], target: any, key?: string | symbol, desc?: any): any;
    }
}

export function __decorate(decorators: Function[], target: any, key?: string | symbol, desc?: any): any {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key as string) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    }
    else {
        for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key as string, r), r;
}

export function __param(paramIndex: number, decorator: Function): Function {
    return function (target: Function, key: string) { decorator(target, key, paramIndex); }
}

export function __metadata(metadataKey: any, metadataValue: any): Function | undefined {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
}

if (window && !Reflect.has(window, '__decorate')) {
    Reflect.set(window, '__decorate', __decorate);
}

if (window && !Reflect.has(window, '__param')) {
    Reflect.set(window, '__param', __param);
}

if (window && !Reflect.has(window, '__metadata')) {
    Reflect.set(window, '__metadata', __metadata);
}