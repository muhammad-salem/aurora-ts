import {
    BinaryNode, DotNode, EqualNode, GraphNode,
    PropertyNode, ConditionalNode, TernaryNode, UnaryNode, ValueNode, FunctionNode, NavigationNode, ArrayIndexNode, LiteralArrayNode, ArrayNode, BasicsArrayType
} from './template-graph.js';

function escapeForRegex(str: string): string {
    return String(str).replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
}

//dynamically build my parsing regex:
const tokenParser = new RegExp([
    //numbers
    /\d+(?:\.\d*)?|\.\d+/.source,

    //string-literal
    /["](?:\\[\s\S]|[^"])+["]|['](?:\\[\s\S]|[^'])+[']/.source,

    //booleans
    "true|false",
    // /true|false/g.source,

    //operators
    [
        UnaryNode.operators,
        ConditionalNode.operators,
        TernaryNode.operators,
        DotNode.operators,
        FunctionNode.operators,
        EqualNode.operators,
        ArrayIndexNode.operators,
        LiteralArrayNode.operators,
        NavigationNode.operators,
        BinaryNode.operators
    ]
        .flatMap(item => item)
        .sort((a, b) => b.length - a.length) //so that ">=" is added before "=" and ">"
        .map(escapeForRegex)
        .join('|'),

    //properties
    //has to be after the operators
    /[a-zA-Z$_][a-zA-Z0-9$_]*/.source,

    //remaining (non-whitespace-)chars, just in case
    //has to be at the end
    /\S/.source
].map(s => "(" + s + ")").join("|"), "g");

function parse(str: string): GraphNode {
    let tokens: (GraphNode | string)[] = [];
    str.replace(tokenParser, (substring: string, ...args: any[]): string => {
        let token: GraphNode | string;

        const num: string = args[0];
        const str: string = args[1];
        const bool: string = args[2];
        const op: string = args[3];
        const property: string = args[4];
        // const whitespace: number = args[5];
        // const index: number = args[6];
        // const template: string = args[7];

        // console.log(args);

        if (num) {
            token = new ValueNode(+num);
        } else if (str) {
            token = new ValueNode(str);
        } else if (bool) {
            token = new ValueNode(bool === "true");
        } else if (property) {
            token = new PropertyNode(property);
        }
        else if (!op) {
            throw new Error(`unexpected token '${substring}'`);
        } else {
            token = substring;
        }
        tokens.push(token);
        return substring;
    });

    for (let i; (i = tokens.indexOf('.')) > -1;) {
        tokens.splice(i - 1, 3, new DotNode(tokens[i - 1] as PropertyNode, tokens[i + 1] as PropertyNode))
    }

    for (let i; (i = tokens.indexOf('=')) > -1;) {
        tokens.splice(i - 1, 3, new EqualNode(tokens[i - 1] as PropertyNode, tokens[i + 1] as PropertyNode))
    }

    NavigationNode.operators.forEach(token => {
        for (let i = -1; (i = tokens.indexOf(token, i + 1)) > -1;) {
            tokens.splice(i - 1, 3, new NavigationNode(
                tokens[i - 1] as GraphNode,
                tokens[i + 1] as GraphNode
            ));
        }
    });

    for (let i, j; (i = tokens.lastIndexOf('[')) > -1 && (j = tokens.indexOf(']', i)) > -1;) {
        let previousNode = tokens[i - 1];
        let node: GraphNode;
        if (previousNode === ']' || previousNode instanceof PropertyNode || previousNode instanceof LiteralArrayNode
            || previousNode instanceof DotNode || previousNode instanceof FunctionNode) {
            node = new ArrayIndexNode(
                processToken(tokens.slice(i + 1, j)) as ValueNode
            );
        } else {
            node = LiteralArrayNode.parse(tokens.slice(i + 1, j));
        }
        tokens.splice(i, j + 1 - i, node);
    }

    for (let i, j; (i = tokens.lastIndexOf('(')) > -1 && (j = tokens.indexOf(')', i)) > -1;) {
        if (i > 0) {
            const parentNode = tokens[i - 1];
            if (parentNode instanceof PropertyNode || parentNode instanceof DotNode) {
                const funcNode = new FunctionNode(
                    parentNode,
                    LiteralArrayNode.parse(tokens.slice(i + 1, j)));
                tokens.splice(i - 1, j + 2 - i, funcNode);
                continue;
            }
        }
        tokens.splice(i, j + 1 - i, processToken(tokens.slice(i + 1, j)));
    }

    ConditionalNode.operators.forEach(token => {
        for (let i = -1; (i = tokens.indexOf(token, i + 1)) > -1;) {
            tokens.splice(i - 1, 2, new ConditionalNode(tokens[i - 1] as GraphNode));
        }
    });

    TernaryNode.operators.forEach(token => {
        for (let i = -1; (i = tokens.indexOf(token, i + 1)) > -1;) {
            tokens.splice(i - 2, 4, new TernaryNode(
                tokens[i - 2] as ConditionalNode,
                tokens[i - 1] as GraphNode,
                tokens[i + 1] as GraphNode
            ));
        }
    });

    if (~tokens.indexOf('(') || ~tokens.indexOf(')')) {
        throw new Error('mismatching brackets');
    }

    return processToken(tokens);
}

function processToken(tokens: (GraphNode | string)[]): GraphNode {

    UnaryNode.operators.forEach(token => {
        for (let i = -1; (i = tokens.indexOf(token, i + 1)) > -1;) {
            tokens.splice(i, 2, new UnaryNode(tokens[i + 1] as GraphNode));
        }
    });

    BinaryNode.operators.forEach(token => {
        for (var i = 1; (i = tokens.indexOf(token, i - 1)) > -1;) {
            tokens.splice(i - 1, 3, new BinaryNode(token, tokens[i - 1] as GraphNode, tokens[i + 1] as GraphNode));
        }
    });

    for (let i = tokens.length - 1; i > 0; i -= 2) {
        let node = tokens[i];
        let preNode = tokens[i - 1];
        if (node instanceof ArrayIndexNode || preNode instanceof LiteralArrayNode) {
            const arrNode = new ArrayNode(preNode as BasicsArrayType, node as ValueNode);
            tokens.splice(i - 1, 2, arrNode);
        }
    }

    if (tokens.length !== 1) {
        console.log("error: ", tokens.slice());
        throw new Error("something went wrong");
    }
    return tokens[0] as GraphNode;
}


// var tree = parse("((a.source = id)&& (target= id) && ( !( color != blue) || ( age<= 23 )))")
// var tree = parse("1=1=age+10>30"); //to test operator precedence
// var tree = parse(`a.source = \`'data     data2'\` dd3 `);


var data = {
    id: 12345,

    a: {
        source: 12345,
        edit(name: string): string {
            console.log('edit', name);
            return name + '_edited';
        },
        copy(obj: string) {
            console.log('copy', obj);
            return { copy: obj };
        }
    },
    b: 5,
    target: 12345,

    color: "#FF0",
    blue: "#00F",

    age: 20,

    data: {
        arr: [
            0,
            'alex',
            {
                name: 'jone'
            }
        ]
    }

}

// let statement = `a.sourcev ? '999' : false || 'fff' `;
// let statement = `a.edit("data?.dd") === ("data?.dd" + "_edited") !== true`;
// let statement = `a.copy("{"name": "alex"}")?.name`;
// let statement = `a.source?.name`;
// let statement = 'data.arr.length';
// let statement = `["alex", 3, true, "jone"][3]? 'x': 8`;
let statement = `arr = ["alex", 3, true, "jone"][2] ? 'x': 8`;

var tree = parse(statement);

console.log('tree:', tree);
console.log('compute tree:', tree.compute(data));
console.log(data);
console.log(tree.toString());
console.log(JSON.stringify(tree, null, 2));


// function parseJs(rule: string) {
//     return Function("ctx", `return(${rule.replace(/[a-z$_][a-z0-9$_\.]*/gi, "ctx.$&")})`);
// }
// statement1 = 'a.x = {\'ss\': \'dd\', \'dd\':98}';
// let statement1P = parseJs(statement1);

// console.log(statement1, statement1P, statement1P(data));
