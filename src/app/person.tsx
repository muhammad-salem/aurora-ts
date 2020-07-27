import {
	Service, Component, Input, Output, View, ViewChild,
	ViewChildren, Optional, HostListener, SelfSkip, HostBinding
} from '../core/decoratiors.js';

import { OnInit } from '../core/lifecycle.js';
import { EventEmitter } from '../core/events.js';
import { JsxFactory, Fragment } from '../jsx/factory.js';

@Service({ provideIn: 'root' })
export class LogService {
	constructor() { }
	info(message: string) {
		var date = new Date();
		console.log(
			`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} -- ${message}`
		);
	}
}

@Component({
	selector: 'person-view',
	template: (
		<Fragment>
			<p id="p-name" #pName $class="className" onclick="dddd">
				Your name is $name
			</p>
			<p id="p-age">youur age is: $years, born in Year of $yearOfBirth()</p>
			<div if="id===1">
				Dummy Test
				<p>Data</p>
			</div>
		</Fragment>
	),
	styles: '',
})
export class Person implements OnInit {
	@Input() name: string;
	@Input('age') years: number;
	@Output() open: EventEmitter<any> = new EventEmitter();
	@Output('select') _select: EventEmitter<any> = new EventEmitter();

	className: string = 'p1 m1';

	@View() view: HTMLElement;

	@ViewChild(HTMLParagraphElement, { id: 'p-name' })
	childName!: HTMLParagraphElement;
	@ViewChild(HTMLParagraphElement, { id: 'p-age' })
	childAge!: HTMLParagraphElement;

	@ViewChildren(HTMLParagraphElement) children: HTMLParagraphElement[];

	constructor(@Optional() private service: LogService) {
		this.name = 'ahmed';
	}
	onInit(): void {
		console.log('onInit', this);
		this.open.emit('init data');
	}

	yearOfBirth() {
		return 2020 - this.years;
	}

	@HostBinding('class.valid') get valid() {
		return true;
	}
	@HostBinding('class.invalid') get invalid() {
		return false;
	}

	@HostListener('window:load', ['$event'])
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
		this._select.emit({ name: 'alex', age: 24 });
	}

	@HostListener('select')
	onClose(data: any) {
		console.log('select', data);
	}

	@Input()
	set resize(e: Event) {
		console.log(this, e);
		console.log(Reflect.metadata('component', 'dd'));
	}

	collectData(@Optional() data: Object, @SelfSkip('GG') ddd: Person): string[] {
		return [];
	}
}
