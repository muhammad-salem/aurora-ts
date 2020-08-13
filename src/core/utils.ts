export function isHTMLElement(object: any): object is HTMLElement {
	return (
		object.prototype instanceof HTMLElement ||
		object.__proto__ instanceof HTMLElement
	);
}

function keyFor(keys: string[], paramPath: string): string | false {
	for (let i = 0; i < keys.length; i++) {
		if (paramPath.startsWith(keys[i])) {
			return keys[i];
		}
	}
	return false;
}

function splitByRegix(str: string, regx: RegExp) {
	return str.split(regx).filter(key => key).map(a => a.trim());
}

interface Args {
	prop: string[];
	params?: string[];
}
export function mapFunArgs(path: string): Args[] {
	const splits = splitByRegix(path, /\(|\)/g);
	let temp: Args = {
		prop: splitByRegix(splits[0], /\.|\[|\]/g)
	};
	const callpaths: Args[] = [temp];
	for (let i = 1; i < splits.length; i++) {
		const args = splitByRegix(splits[i], /,/g);
		if (args.length > 1) {
			temp.params = args;
		} else {
			temp = {
				prop: splitByRegix(splits[i], /\.|\[|\]/g),
			}
			callpaths.push(temp);
		}
	}
	return callpaths;
}

export function getValueByPath(parent: any, objectPath: string, skipFirst?: boolean, resolver?: { [key: string]: any }) {
	const args = mapFunArgs(objectPath);
	let ref = parent;
	if (skipFirst) {
		args[0].prop.splice(0, 1);
	}
	for (let i = 0; i < args.length; i++) {
		const prop = args[i].prop;
		for (let j = 0; j < prop.length; j++) {
			ref = ref[prop[j]];
			if (!ref) {
				return undefined;
			}
		}
		if (args[i].params) {
			const resolverKeys = Object.keys(resolver || {});
			const keyParamters: any[] = [];
			const params = args[i].params as string[];
			for (let j = 0; j < params.length; j++) {
				const param = params[j];
				let rkey;
				if (resolver && (rkey = keyFor(resolverKeys, param))) {
					keyParamters.push(getValueByPath(resolver[<string>rkey], param, true));
				} else if (!Number.isNaN(+param)) {
					// is number
					keyParamters.push(+param);
				} else {
					// is string
					keyParamters.push(param);
				}
			}
			ref = ref(...keyParamters);
		}
	}
	return ref;
}



export function setValueByPath(parent: any, objectPath: string, value: any) {
	const argument = mapFunArgs(objectPath)[0];
	let ref = parent;
	let index;
	for (index = 0; index < argument.prop.length - 1; index++) {
		ref = ref[argument.prop[index]];
		if (!ref) {
			return;
		}
	}
	ref[argument.prop[index]] = value;
}

export function updateValue(from: Object, fromPath: string, to: Object, toPath: string): void {
	setValueByPath(to, toPath, getValueByPath(from, fromPath));
}

export function updateAttribute(to: HTMLElement, toPath: string, from: Object, fromPath: string): void {
	to.setAttribute(toPath, getValueByPath(from, fromPath));
}


// export function getObjectRef(parent: any, objectPath: string, skipFirst: boolean, resolver?: { [key: string]: any }) {
// 	const paths = splitByRegix(objectPath, /\.|\[|\]/g);
// 	if (skipFirst) {
// 		paths.splice(0, 1);
// 	}
// 	console.log(paths);

// 	let ref = parent;
// 	const resolverKeys = Object.keys(resolver || {});
// 	for (let i = 0; i < paths.length; i++) {
// 		const props = splitByRegix(paths[i], /\(|\)|,/g);
// 		ref = ref[props[0]];
// 		if (typeof ref === 'function') {
// 			let keyParamters: any[] = [];
// 			for (let j = 1; j < props.length; j++) {
// 				const param = props[j];
// 				let rkey;
// 				if (resolver && (rkey = keyFor(resolverKeys, param))) {
// 					keyParamters.push(getObjectRef(resolver[<string>rkey], param, true));
// 				} else if (!Number.isNaN(+param)) {
// 					// is number
// 					keyParamters.push(+param);
// 				} else {
// 					// is string
// 					keyParamters.push(param);
// 				}
// 			}
// 			ref = ref(...keyParamters);
// 		}
// 	}
// 	return ref;
// }

// window['getObjectRef'] = getObjectRef;

// Reflect.set(window, 'getObjectRef', getObjectRef);
// Reflect.set(window, 'mapFunArgs', mapFunArgs);
// Reflect.set(window, 'getFromPath', getFromPath);



