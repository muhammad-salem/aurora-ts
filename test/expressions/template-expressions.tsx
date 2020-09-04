import {
    AfterViewInit, Component, HTMLComponent,
    JsxFactory, View, parseJS, htmlFullPath, fetchHtml, Input, Service
} from '../../dist/aurora.js';


@Component({
    selector: 'exep-app',
    template: ({ }: ExpressionTest) => {
        return (
            <>
                a = {'{{a}}'}
                <br />
                show = {'{{show}}'}
                <div #directive='*if|show' >
                    show app 1
                </div>
                <div #directive="*if|show" >
                    show app 2
                </div>
            </>
        );
    }
})
export class ExpressionTest implements AfterViewInit {

    show = false;

    a = 0;

    exp1 = parseJS('show = !show');
    exp2 = parseJS('a += 2');

    @View()
    view: HTMLComponent<ExpressionTest>;

    afterViewInit(): void {
        setInterval(() => {
            // this.show = !this.show;
            // console.log(this.exp1.get(this), this.exp2.get(this), this);
            this.exp1.get(this), this.exp2.get(this);
            this.view.emitChanges('show', 'a');
        }, 1000);
    }
}

interface XService {
    log(...args: any[]): void;
}

class YService {
    print(...args: any[]): void {
        console.log(...args);
    }
}

@Component({
    selector: 'd1-data',
    templateUrl: 'test/expressions/d-data.html2'
})
class Data1 {
    @Input()
    name: string;

    data = 'component 1';
    constructor(public x: XService, public y: YService) { }
}

fetchHtml('test/expressions/d-data.html').then((html: string) => {
    @Component({
        selector: 'd2-data',
        template: html
    })
    class Data2 {
        data = 'component 2';
    }
});