import {
    AfterViewInit, Component, HTMLComponent,
    JsxFactory, View, parseJS
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