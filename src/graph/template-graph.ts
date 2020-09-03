//
// https://stackoverflow.com/questions/37469768/infix-to-binary-expression-tree/37482279#37482279
//


//abstract base-class
export abstract class GraphNode {
    parent: GraphNode;
    constructor() {
        Object.defineProperty(this, 'parent', {
            writable: true,
            enumerable: false,
            value: null
        });
    }
    abstract compute(ctx: object): any;
    abstract toString(): string;
}

//leaf-node
export class ValueNode extends GraphNode {

    constructor(public value: string | number | boolean) {
        super();
        if (typeof value === 'string' && value.startsWith(`'`) && value.endsWith(`'`)) {
            value = `"${value.substring(1, value.length - 1)}"`
        }
        this.value = JSON.parse(value as string);
    }

    compute() { return this.value; }

    toString() {
        if (typeof this.value === 'string') {
            return `"${this.value}"`;
        }
        return String(this.value);
    }
}

//leaf-node
export class PropertyNode extends GraphNode {

    constructor(public property: string) { super(); }

    compute(ctx: { [key: string]: any }) { return ctx[this.property]; }

    toString() { return this.property; }

}

export class UnaryNode extends GraphNode {

    static operators = ['!'];

    constructor(public node: GraphNode) {
        super();
        node.parent = this;
    }

    compute(ctx: object) {
        return !this.node.compute(ctx);
    }

    toString(): string {
        return `!(${this.node.toString()})`;
    }

}

export class ConditionalNode extends GraphNode {

    static operators = ['?'];

    constructor(public node: GraphNode) {
        super();
        node.parent = this;
    }

    compute(ctx: object) {
        return this.node.compute(ctx) || false;
    }

    toString(): string {
        return `(${this.node.toString()})?`;
    }

}

export class TernaryNode extends GraphNode {

    static operators = [':'];

    constructor(public condition: ConditionalNode, public execution: GraphNode, public falsey: GraphNode) {
        super();
        this.parent = condition.parent;
        condition.parent = execution.parent = falsey.parent = this;
    }

    compute(ctx: object) {
        return this.condition.compute(ctx) ?
            this.execution.compute(ctx) : this.falsey.compute(ctx);
    }

    toString(): string {
        return `${this.condition.toString()} (${this.execution.toString()}) : (${this.falsey.toString()})`;
    }

}

export class NavigationNode extends GraphNode {

    static operators = ['?.'];

    constructor(public beais: GraphNode, public optional: GraphNode) {
        super();
        this.parent = beais.parent;
        beais.parent = optional.parent = this;
    }

    compute(ctx: object) {
        const beaisvalue = this.beais.compute(ctx);
        return beaisvalue && this.optional.compute(beaisvalue);
    }

    toString(): string {
        return `${this.beais.toString()}?.(${this.optional.toString()})`;
    }

}

/** only from text number and string, no Somble */
export class ArrayIndexNode extends GraphNode {

    static operators = ['[', ']'];

    constructor(public index: ValueNode) {
        super();
        index.parent = this;
    }

    compute(ctx: object) {
        return this.index.compute();
    }

    toString(): string {
        return `[${this.index.toString()}]`;
    }

}

/** [ "alex", 1, true ]  */
export class LiteralArrayNode extends GraphNode {

    static operators = [','];

    static parse(tokens: (GraphNode | string)[]) {
        const values: GraphNode[] = [];
        tokens.forEach(token => {
            if (token instanceof ValueNode) {
                values.push(token);
            }
        });
        return new LiteralArrayNode(values);
    }

    constructor(public values: GraphNode[]) {
        super();
        values.forEach(v => v.parent = this);
    }

    compute(ctx: object) {
        return this.values.map(value => value.compute(ctx));
    }

    toString(): string {
        return `[${this.values.map(value => value.toString())}]`;
    }

}

export type BasicsArrayType = PropertyNode | DotNode | FunctionNode | LiteralArrayNode;

/** only from text number and string, no Somble */
export class ArrayNode extends GraphNode {

    constructor(public beais: BasicsArrayType, public index?: ArrayIndexNode | ValueNode) {
        super();
        this.parent = beais.parent;
        beais.parent = this;
        if (index) {
            index.parent = this;
        }
    }

    compute(ctx: object) {
        const beaisvalue = this.beais.compute(ctx);
        if (this.index) {
            const indexValue = this.index.compute(ctx);
            return Reflect.get(beaisvalue, indexValue as string);
        }
        return beaisvalue;
    }

    toString(): string {
        return `${this.beais.toString()}${this.index?.toString()}`;
    }
}

export class BinaryNode extends GraphNode {

    static operators = [
        '*', '/', '+', '-',
        '==', '===',

        '!=', '!==',
        '<', '>', '<=', '>=',

        '&&', '||', '&', '|',
        'instanceof'
    ];

    constructor(public op: string, public left: GraphNode, public right: GraphNode,) {
        super();
        left.parent = this;
        right.parent = this;
    }

    compute(ctx: object) {

        let rv = this.right.compute(ctx);
        let lv = this.left.compute(ctx);

        switch (this.op) {

            //logic operators
            case '&&': return lv && rv;
            case '||': return lv || rv;
            case '&': return lv & rv;
            case '|': return lv | rv;

            //comparison-operators
            case '=': return lv = rv;
            case '==': return lv == rv;
            case '===': return lv === rv;

            case '!=': return lv != rv;
            case '!==': return lv !== rv;

            case '<=': return lv <= rv;
            case '>=': return lv >= rv;
            case '>': return lv > rv;
            case '<': return lv < rv;

            //computational operators
            case '+': return lv + rv;
            case '-': return lv - rv;
            case '*': return lv * rv;
            case '/': return lv / rv;

            case 'instanceof': return lv instanceof rv;

        }
        throw new Error(`operator not implemented "${this.op}"`);
    }

    toString() {
        return '( ' + this.left.toString() + ' ' + this.op + ' ' + this.right.toString() + ' )';
    }

}

//dot is kind of special:
export class DotNode extends BinaryNode {

    static operators = ['.'];

    constructor(left: PropertyNode, right: PropertyNode) {
        super('.', left, right);
    }

    compute(ctx: any) {
        //especially because of this composition:
        //fetch the right property in the context of the left result
        return this.right.compute(this.left.compute(ctx));
    }
    toString() {
        return this.left.toString() + '.' + this.right.toString();
    }
}

export class EqualNode extends BinaryNode {

    static operators = ['='];

    constructor(left: PropertyNode, right: PropertyNode) {
        super('=', left, right);
    }

    compute(ctx: any) {
        let rightValue = this.right.compute(ctx);
        if (this.left instanceof DotNode) {
            let parent = (this.left.parent as BinaryNode).left;
            let newLeft = (parent as BinaryNode).left;
            let newRigth = (parent as BinaryNode).right as PropertyNode;
            Reflect.set(newLeft.compute(ctx), newRigth.property, rightValue);
        } else if (this.left instanceof PropertyNode) {
            Reflect.set(this.left.parent.compute(ctx), this.left.property, rightValue);
        } else {
            Reflect.set(ctx, this.left.compute(ctx), rightValue);
        }
        return rightValue;
    }

    toString() {
        return this.left.toString() + ' = ' + this.right.toString();
    }

}


export class FunctionNode extends GraphNode {

    static operators = ['(', ')'];

    constructor(public funcName: PropertyNode | DotNode, public params: GraphNode[] | LiteralArrayNode) {
        super();
        this.parent = funcName.parent;
        funcName.parent = this;
        if (params instanceof LiteralArrayNode) {
            params.parent = this;
        } else {
            params.forEach(param => param.parent = this);
        }
    }

    compute(ctx: object) {
        let paramters =
            (this.params instanceof LiteralArrayNode)
                ? this.params.compute(ctx)
                : this.params.map(param => param.compute(ctx));
        let funCallBack = this.funcName.compute(ctx) as Function;
        let value = funCallBack(...paramters);
        return value;
    }

    toString(): string {
        const strParams =
            (this.params instanceof LiteralArrayNode)
                ? this.params.toString()
                : this.params.map(param => param.toString()).join(', ');
        return `${this.funcName.toString()}(${strParams})`;
    }
}

export class PipeNode extends GraphNode {

    static operators = ['|'];

    constructor(public funcName: PropertyNode | DotNode, public params: GraphNode[]) {
        super();
        this.parent = funcName.parent;
        funcName.parent = this;
        params.forEach(param => param.parent = this);
    }

    compute(ctx: object) {
        let paramters = this.params.map(param => param.compute(ctx));
        let funCallBack = this.funcName.compute(ctx) as Function;
        let value = funCallBack(...paramters);
        return value;
    }

    toString(): string {
        return `${this.funcName.toString()}(${this.params.map(param => param.toString())})`;
    }
}