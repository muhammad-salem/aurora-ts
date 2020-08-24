import { Component, Fragment, Input, JsxFactory, OnInit } from '../../dist/aurora.js';

@Component({
    selector: 'bind-view',
    template: ({ data }: BindingTableComponent) => {
        let jsx = `{data}`;
        let template = `value="{{data}}"`;
        let oneWay = `$value="data"`;
        let twoWay = `$value="$data"`;

        return (
            <div class="table-responsive-lg">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">View</th>
                            <th scope="col">JSX One Time Render:<br /> <span>{jsx}</span></th>
                            <th scope="col">Template Syntax: <br /><span>{template}</span></th>
                            <th scope="col">One Way Data Binding: <br /><span>{oneWay}</span></th>
                            <th scope="col">Two Way Data Binding: <br /><span>{twoWay}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> $innerHTML="data" <div $innerHTML="data"></div></td>
                            <td><input type="text" value={data} /></td>
                            <td><input type="text" value="{{data}}" /></td>
                            <td><input type="text" $value="data" /></td>
                            <td><input type="text" $value="$data" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
})
class BindingTableComponent {
    data = 'string data';
}

type D = { a: number, b: number, c: number };


@Component({
    selector: 'd-view',
    template: ({ data }: DView) => {
        return (
            <Fragment>
                {/* <div $innerHTML="$data.a"></div>
                <div $innerHTML="$data.b"></div>
                <div $innerHTML="$data.c"></div>
                <br /> */}
                <div>{data.a}</div>
                <div>{data.b}</div>
                <div>{data.c}</div>
            </Fragment>
        );
    }
})
export class DView implements OnInit {
    @Input()
    data: D;

    onInit(): void {
        console.log(this);
    }
}

@Component({
    selector: 'first-child',
    template:
        `<d-view [(data)]="modelA"></d-view>
        <br/>
        <second-child [(modelB)]="modelA" />
         `
})
export class FirstChildComponent {
    @Input()
    modelA: D;
}

@Component({
    selector: 'second-child',
    template: `<d-view [(data)]="modelB"></d-view>`
})
export class SecondChildComponent {
    @Input()
    modelB: D;
}


@Component({
    selector: 'parent-app',
    template:
        `<d-view [(data)]="data"></d-view>
        <br/>
        <first-child [(modelA)]="data" />
         `
})
export class ParentApp {
    data: D = { a: 1, b: 2, c: 3 };
}
