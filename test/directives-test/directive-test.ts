import {
    AfterViewInit, Component, HTMLComponent,
    Input, JsxFactory, OnInit, updateValue, View
} from '../../dist/aurora.js';


@Component({
    selector: 'if-cf',
})
class IfControlFlow implements OnInit, AfterViewInit {

    _condition: boolean;

    @View()
    view: HTMLComponent<IfControlFlow>;
    parentElement: HTMLElement;
    childNodes: Array<ChildNode>;
    comment: Comment;

    @Input()
    set if(condition: boolean) {
        console.log('set#if', condition);
        this._condition = condition;
        this._updateView();
    }

    onInit(): void {
        console.log('init#if', this._condition);
    }

    afterViewInit(): void {
        console.log('viewinit#if', this._condition, this.view);
        this._initView();
        this._updateView();
    }

    private _initView() {
        this.parentElement = this.view.parentElement as HTMLElement;
        this.comment = document.createComment(`*if="${this._condition}"`);
        this.view.before(this.comment);
        if (this.view.childNodes.length > 0) {
            this.childNodes = [];
            this.view.childNodes.forEach(item => {
                this.childNodes.push(item);
            });
        }
        this.view.remove();
    }

    private _updateView() {
        console.log(this);
        if (this.view && this._condition) {
            let last: ChildNode | Comment = this.comment;
            this.childNodes.forEach(item => {
                last.after(item);
                last = item;
            });
        } else if (this.childNodes) {
            this.childNodes.forEach(item => {
                item.remove();
            });
        }
    }
}

@Component({
    selector: 'directive-test',
    template: ({ condition }: DirectiveTest) => {
        return {
            tagName: JsxFactory.Fragment,
            attributes: {},
            children: [
                {
                    tagName: 'if-cf',
                    attributes: {
                        '$if': 'condition'
                    },
                    children: [
                        '1st child'
                    ]
                },
                {
                    tagName: 'div',
                    attributes: {
                        '$if': 'condition'
                    },
                    children: [
                        '2nd child'
                    ]
                },
                '3rd, child'
            ]
        };
    }
})
@Component({
    selector: 'directive-app',
    template:
        `
        condition: {{condition}} {{!condition}}
        <if-cf [if]="condition" >
            <div>first child</div>
        </if-cf>
        `
})
@Component({
    selector: 'structural-directive-app',
    template:
        `
        condition: {{condition}} {{!condition}}
        <div *if="condition">first child</div>

        <div *for="let person of personList">
            <div>{{person.firstName}}</div>
            <div>{{person.lastName}}</div>
            <div>{{person.age}}</div>
        </div>        
        `
})
class DirectiveTest {

    condition: boolean = true;

    personList: Person[] = [
        new Person('jone', 'alex', 5),
        new Person('A', 'B', 7),
    ];

    constructor() { }
}

class Person {
    constructor(
        public firstName: string,
        public lastName: string,
        public age: number
    ) { }

    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}