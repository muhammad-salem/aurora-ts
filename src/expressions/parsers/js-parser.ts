import {
    IncrementDecrementOperators, UnaryOperators, ConditionalOperators
} from '../operators/unary.js';
import {
    ArithmeticOperators, ArrayCommaOperators, ArrayOperator,
    AssignmentNode, BitwiseOperators, ComparisonOperators,
    FunctionNode, GroupingOperator, LogicalOperators,
    MemberNode, NavigationNode, ObjectOperator, parseAddSub, parseInfix, RelationalOperators, TernaryNode
} from '../operators/infix.js';
import { NodeExpression, PropertyNode, ValueNode } from '../expression.js';


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

    //operators
    [
        MemberNode.Operators,
        NavigationNode.Operators,
        GroupingOperator.Operators,
        ObjectOperator.Operators,
        ArrayOperator.Operators,
        TernaryNode.Operators,
        FunctionNode.Operators,
        AssignmentNode.Operators,
        ComparisonOperators.Operators,
        ArithmeticOperators.Operators,
        BitwiseOperators.Operators,
        LogicalOperators.Operators,
        RelationalOperators.Operators,
        ArrayCommaOperators.Operators,
        IncrementDecrementOperators.Operators,
        UnaryOperators.Operators,
        ConditionalOperators.Operators,
        // DeleteOperators.Operators
    ]
        .flatMap(item => item)
        .filter((value: string, index: number, array: string[]) => {
            return array.indexOf(value) === index;
        })
        .sort((a, b) => b.length - a.length) //so that ">=" is added before "=" and ">"
        .map(escapeForRegex)
        .join('|'),

    //properties
    //has to be after the operators
    /[a-zA-Z$_][a-zA-Z0-9$_]*/.source,

    //remaining (non-whitespace-)chars, just in case
    //has to be at the end
    /\S/.source
].map(s => `(${s})`).join('|'), 'g');

function genrateTokens(str: string): (NodeExpression | string)[] {
    let tokens: (NodeExpression | string)[] = [];
    str.replace(tokenParser, (substring: string, ...args: any[]): string => {
        let token: NodeExpression | string;

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
    return tokens;
}

// function reduice(tokens: NodeExpression[]) {
//     for (let index = 0; index < tokens.length; index++) {
//         const first = tokens[index];
//         const second = tokens[index + 1];
//         if (first instanceof MemberNode && second instanceof ArrayOperator && second.nodes.length === 0) {
//             const bracketMember = new MemberNode(first, second.nodes[0]);
//             tokens.splice(index, 2, bracketMember);
//             index += 2;
//         } else {
//             index--;
//         }
//     }
// }

// processToken: (nodes: (NodeExpression | string)[]) => NodeExpression{

// }

function oneTimeProcess(tokens: (NodeExpression | string)[]): (NodeExpression | string)[] {
    MemberNode.parseDotMember(tokens);
    NavigationNode.parseNavigation(tokens);
    ArrayOperator.parseBrackets(tokens);

    return tokens;
}

const specialCase = ['+', '-'];

function tokenAnlzise(tokens: (string | NodeExpression)[]): NodeExpression {

    MemberNode.parseBracketMember(tokens);

    IncrementDecrementOperators.parse(tokens);
    UnaryOperators.parse(tokens);
    ConditionalOperators.parse(tokens);
    // DeleteOperators.parse(tokens);

    TernaryNode.parse(tokens);

    // parseAddSub(tokens);
    // parseAddSub(tokens);

    parseInfix(ArithmeticOperators, tokens);
    parseInfix(ComparisonOperators, tokens);
    parseInfix(BitwiseOperators, tokens);
    parseInfix(LogicalOperators, tokens);
    parseInfix(RelationalOperators, tokens);
    parseInfix(ArrayCommaOperators, tokens);
    parseInfix(AssignmentNode, tokens);

    return tokens[0] as NodeExpression;
}


export function parseJS(str: string) {
    let tokens: (NodeExpression | string)[] = genrateTokens(str);
    oneTimeProcess(tokens);
    GroupingOperator.parse(tokens, tokenAnlzise);
    ObjectOperator.parse(tokens, tokenAnlzise);


    // reduice(tokens as NodeExpression[]);
    tokenAnlzise(tokens);
    return tokens[0] as NodeExpression;
}


// var data = {
//     id: 12345,

//     a: {
//         source: 12345,
//         edit(name: string): string {
//             console.log('edit', name);
//             return name + '_edited';
//         },
//         copy(obj: string) {
//             console.log('copy', obj);
//             return { copy: obj };
//         }
//     },
//     b: 5,
//     target: 12345,

//     color: "#FF0",
//     blue: "#00F",

//     age: 20,

//     data: {
//         arr: [
//             5,
//             'alex',
//             {
//                 name: 'jone'
//             }
//         ]
//     }

// };

// function test(str: string) {
//     const node = parseJS(str);
//     console.log(node.toString());
//     console.log(node[0].get(data));
//     console.log(node);
// }
// // const node = parseJS('a.b?.c.d?.e.f?.g');
// // const node = parseJS('(--a.b)+(c.d++)?');
// // const node = parseJS('(a.b?) c:d');
// // const node = parseJS('(a.b?) c:d');

// test(`a = data.arr[0]`);

// Reflect.set(window, 'data', data);
// Reflect.set(window, 'test', test);
// Reflect.set(window, 'parseJS', parseJS);

