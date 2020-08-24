import { isHTMLComponent } from '../elements/component.js';

export interface Model {
    __observable: { [key: string]: Function[] };
    subscribeModel(eventName: string, callback: Function): void;
    emitChangeModel(eventName: string, source?: any[]): void;
}

export function isModel(object: any): object is Model {
    return object.__observable
        && object.subscribeModel
        && object.emitChangeModel;
}

export function defineModel(object: any): void {
    if (!isModel(object) && typeof object === 'object') {
        const observable: { [key: string]: Function[] } = {};
        Object.defineProperty(object, '__observable', { value: observable });
        Object.defineProperty(object, 'subscribeModel', {
            value: (eventName: string, callback: Function) => {
                observable[eventName] = observable[eventName] || [];
                observable[eventName].push(callback);
            }
        });
        Object.defineProperty(object, 'emitChangeModel', {
            value: (eventName: string, source?: any[]) => {
                if (!source) {
                    source = [object];
                } else {
                    source.push(object);
                }
                let calls = Object.keys(observable)
                    .filter(key => key.startsWith(eventName) || eventName.startsWith(key));
                calls.forEach(key => {
                    observable[key].forEach(call => call(source));
                });
            }
        });
    }
}

export function subscribe2way(obj1: any, obj1ChildName: string, obj2: any, obj2ChildName: string, callback1?: Function, callback2?: Function) {

    let subject1: any, subject2: any;
    if (isHTMLComponent(obj1)) {
        subject1 = obj1._model;
    } else {
        subject1 = obj1;
    }
    if (isHTMLComponent(obj2)) {
        subject2 = obj2._model;
    } else {
        subject2 = obj2;
    }

    defineModel(subject1);
    defineModel(subject2);

    subject1.subscribeModel(obj1ChildName, (source: any[]) => {
        if (callback1) {
            callback1();
        }
        // updateValue(obj1, obj1ChildName, obj2, obj2ChildName);
        if (!source.includes(subject2) && isModel(subject2)) {
            subject2.emitChangeModel(obj2ChildName, source);
        }
    });
    subject2.subscribeModel(obj2ChildName, (source: any[]) => {
        if (callback2) {
            callback2();
        }
        // updateValue(obj2, obj2ChildName, obj1, obj1ChildName);
        if (!source.includes(subject1) && isModel(subject1)) {
            subject1.emitChangeModel(obj1ChildName, source);
        }
    });
}

export function subscribe1way(obj1: any, obj1ChildName: string, obj2: any, obj2ChildName: string, callback?: Function) {

    let subject1: any, subject2: any;
    if (isHTMLComponent(obj1)) {
        subject1 = obj1._model;
    } else {
        subject1 = obj1;
    }
    if (isHTMLComponent(obj2)) {
        subject2 = obj2._model;
    } else {
        subject2 = obj2;
    }

    defineModel(subject1);
    defineModel(subject2);

    subject1.subscribeModel(obj1ChildName, (source: any[]) => {
        if (callback) {
            callback();
        }
        // updateValue(obj1, obj1ChildName, obj2, obj2ChildName);
        if (!source.includes(subject2) && isModel(subject2)) {
            subject2.emitChangeModel(obj2ChildName, source);
        }
    });
}

// class A { _data: string; set data(data: string) { this._data = data }; get data() { return this._data; } }
// class B { _data: string; set data(data: string) { this._data = data }; get data() { return this._data; } }
// class C { _data: string; set data(data: string) { this._data = data }; get data() { return this._data; } }
// class D { _data: string; set data(data: string) { this._data = data }; get data() { return this._data; } }
// class P {
//     _data: string; set data(data: string) { this._data = data }; get data() { return this._data; }
//     a = new A(); b = new B(); c = new C(); d = new D();
// }

// let p = new P();
// let a = new A();
// let b = new B();
// let c = new C();
// let d = new D();

// subscribe2way(p, 'a.data', a, 'data', () => { console.log('subscribe2way p.a <=> a'); });
// subscribe2way(p, 'b.data', b, 'data', () => { console.log('subscribe2way p.b <=> c'); });
// subscribe2way(p, 'c.data', c, 'data', () => { console.log('subscribe2way p.c <=> b'); });
// subscribe2way(p, 'd.data', d, 'data', () => { console.log('subscribe2way p.d <=> d'); });


// subscribe1way(a, 'data', b, 'data', () => { console.log('subscribe2way a  => b'); });
// subscribe1way(a, 'data', c, 'data', () => { console.log('subscribe1way a  => c'); });
// subscribe1way(a, 'data', d, 'data', () => { console.log('subscribe1way a  => d'); });


// subscribe1way(d, 'data', b, 'data', () => { console.log('subscribe1way d  => b'); });
// subscribe1way(c, 'data', d, 'data', () => { console.log('subscribe2way c  => d'); });


// Reflect.set(window, 'a', a);
// Reflect.set(window, 'b', b);
// Reflect.set(window, 'c', c);
// Reflect.set(window, 'd', d);
// Reflect.set(window, 'p', p);

// Reflect.set(window, 'defineModel', defineModel);

// if (isModel(p) && isModel(p.a) && isModel(p.b) && isModel(p.c) && isModel(p.d)) {

//     p.a.subscribeModel('data', (source: any[]) => {
//         p.data = p.a.data;
//         if (!source.includes(p)) {
//             if (isModel(p)) { p.emitChangeModel('data', source); }
//         }
//     });
//     p.b.subscribeModel('data', (source: any[]) => {
//         p.data = p.b.data;
//         if (!source.includes(p)) {
//             if (isModel(p)) { p.emitChangeModel('data', source); }
//         }
//     });
//     p.c.subscribeModel('data', (source: any[]) => {
//         p.data = p.c.data;
//         if (!source.includes(p)) {
//             if (isModel(p)) { p.emitChangeModel('data', source); }
//         }
//     });
//     p.d.subscribeModel('data', (source: any[]) => {
//         p.data = p.d.data;
//         if (!source.includes(p)) {
//             if (isModel(p)) { p.emitChangeModel('data', source); }
//         }
//     });
//     ////////////////
//     p.subscribeModel('data', (source: any[]) => {
//         p.a.data = p.data;
//         if (!source.includes(p.a)) {
//             if (isModel(p.a)) { p.a.emitChangeModel('data', source); }
//         }
//     });
//     p.subscribeModel('data', (source: any[]) => {
//         p.b.data = p.data;
//         if (!source.includes(p.b)) {
//             if (isModel(p.b)) { p.b.emitChangeModel('data', source); }
//         }
//     });
//     p.subscribeModel('data', (source: any[]) => {
//         p.c.data = p.data;
//         if (!source.includes(p.c)) {
//             if (isModel(p.c)) { p.c.emitChangeModel('data', source); }
//         }
//     });
//     p.subscribeModel('data', (source: any[]) => {
//         p.d.data = p.data;
//         if (!source.includes(p.d)) {
//             if (isModel(p.d)) { p.d.emitChangeModel('data', source); }
//         }
//     });
// }

