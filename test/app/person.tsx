import {
	Service, Component, Input, Output, View, ViewChild,
	ViewChildren, Optional, HostListener, SelfSkip, HostBinding,
	OnInit, EventEmitter, JsxFactory
} from '../../dist/aurora.js';

// import html from './person-view.html';

@Service({ provideIn: 'root' })
export class LogService {
	constructor() { }
	info(message: string) {
		let date = new Date();
		console.log(
			`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} -- ${message}`
		);
	}
}

export interface Person {
	name: string;
	age: number;
}


@Component({
	selector: 'person-view',
	template:
		`
	<div>
		{{person.name}}
		{{person.age}}
	</div>
	<p id="p-name" #nameArea class="{{className}}" onclick="onResize()">
		Your name is {{name}}
	</p>
	<p id="p-age" #ageArea>youur age is: {{years}}, born in Year of {{yearOfBirth()}}</p>
	<div if="id===1">
		Dummy Test
		<p>Data</p>
	</div>
	`
})
export class PersonModel implements OnInit {

	@Input() name: string;
	@Input('age') years: number = 87;
	@Input()
	person: Person = {
		name: 'Delila',
		age: 24
	};

	@Output() open: EventEmitter<any> = new EventEmitter();
	@Output('select') _select: EventEmitter<any> = new EventEmitter();


	className: string = 'p1 m1';

	@View() view: HTMLElement;

	@ViewChild(HTMLParagraphElement, { id: 'p-name' })
	childName!: HTMLParagraphElement;

	@ViewChild(HTMLParagraphElement, { id: 'p-age' })
	childAge!: HTMLParagraphElement;

	@ViewChildren(HTMLParagraphElement) children: HTMLParagraphElement[];


	@HostBinding('class.valid')
	valid: boolean;

	@HostBinding('class.invalid')
	invalid: boolean;

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
		this._select.emit(this.person);
	}

	@HostListener('select')
	onClose(data: any) {
		console.log('select', data);
	}

	@Input()
	set resize(msg: string) {
		console.log(this, msg);
		console.log(Reflect.metadata('component', 'dd'));
	}

	collectData(@Optional() data: Object, @SelfSkip('GG') ddd: Person): string[] {
		return [];
	}
}


@Component({
	selector: 'person-edit',
	template: ({ person, printPerson }: PersonEdit) => {
		return (
			<form #form >
				<input if="show" type="text" $value="$person.name" />
				<input type="number" $value="$person.age" />
				<input type="button" onclick={printPerson} value="Save" />
			</form >
		);
	}
})
class PersonEdit {
	@Input()
	person: Person;

	@Input()
	show = true;

	@Output()
	save = new EventEmitter<Person>();

	printPerson() {
		console.log(this.person);
		this.save.emit(this.person);
	}
}


@Component({
	selector: 'progress-bar',
	template: '<progress [min]="min" [max]="max" [value]="value" ></progress>'
})
class ProgressBar {

	@Input()
	min: number;

	@Input()
	max: number;

	@Input()
	value: number;

}
