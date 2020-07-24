
import { Service, Component, Input, Output, View, ViewChild, ViewChildren, Optional, HostListener, SelfSkip } from '../core/decoratiors.js';
import { OnInit } from '../core/lifecycle.js';
import { EventEmitter } from '../core/events.js';
import { JsxFactory, Fragment } from '../jsx/factory.js';


@Service({ provideIn: 'root' })
export class LogService {
    constructor(private logger: typeof console) { }
    info(message: string) {
        var date = new Date();
        console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} -- ${message}`);
    }
}


@Component({
    selector: 'person-view',
    template: (
        <Fragment>
            <p id="p-name" bind-textContent="name">name</p>
            <p id="p-age" bind-textContent="age">age</p>
            <div if="id===1">
                Dummy Test
                 <p>Data</p>
            </div>
        </Fragment>
    )
})
export class Person implements OnInit {
    @Input() name: string;
    @Input('age') years: number;
    @Output() open: EventEmitter<any> = new EventEmitter();
    @Output('close') _close: EventEmitter<any> = new EventEmitter();

    @View() view: HTMLElement;

    @ViewChild(HTMLParagraphElement, { id: 'p-name' }) childName!: HTMLParagraphElement;
    @ViewChild(HTMLParagraphElement, { id: 'p-age' }) childAge!: HTMLParagraphElement;

    @ViewChildren(HTMLParagraphElement) children: HTMLParagraphElement[];

    constructor(@Optional() private service: LogService) {
        this.name = 'ahmed';
    }
    onInit(): void {
        console.log("onInit", this);
        this.open.emit('init data');
    }

    @HostListener('windows:load', ['$event'])
    onLoad(e: Event) {
        console.log(this, e);
    }

    @HostListener('window:resize', ['$event'])
    onResize(e: Event) {
        console.log(this, e);
    }

    @HostListener('click', ['$event.target'])
    onClick(btn: Event) {
        console.log('button', btn, 'number of clicks:');
    }

    @Input()
    set resize(e: Event) {
        console.log(this, e);
        console.log(Reflect.metadata("component", 'dd'));
    }

    collectData(@Optional() data: Object, @SelfSkip('GG') ddd: Person): string[] {
        return [];
    }
}