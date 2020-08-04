import {
	Service, Component, Input, Output, View, ViewChild,
	ViewChildren, Optional, HostListener, SelfSkip, HostBinding,
	OnInit, EventEmitter, JsxFactory
} from '../../esm2020/aurora.js';

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
	<p id="p-name" #nameArea class="{{className}}" onclick="resize()">
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
	@Output() open: EventEmitter<any> = new EventEmitter();
	@Output('select') _select: EventEmitter<any> = new EventEmitter();

	@Input()
	person: Person = {
		name: 'Delila',
		age: 24
	};

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
	template: ({ person, save }: PersonEdit) => {
		return (
			<form>
				<input type="text" value={person.name} ></input>
				<input type="text" value={person.age} ></input>
				<input type="submit" onclick={save}></input>
			</form>
		);
	}
})
class PersonEdit {
	@Input()
	person: Person;


	@Input()
	data: Person;


	@Output()
	save = new EventEmitter<Person>();
}



// type SS = (model: PersonModel) => JsxComponent;

// type SSD<T> = (model: T) => JsxComponent;

// const d: SS = (persn: PersonModel) => {
// 	return <div>{persn.name}</div>
// };
// let persn: PersonModel = new PersonModel(new LogService());
// console.log(d(persn));

// const s: SSD<PersonModel> = ({ name, years }: PersonModel) => {
// 	return <div name={name} $attr="$name">{years}</div>
// };
// console.log(s(persn));

// type jsxRender<T> = (model: T) => JsxComponent;

// interface FF<T> {
// 	template: jsxRender<T> | string
// }

// function sss1(com: FF<PersonModel>) {
// 	console.log((com.template as jsxRender<PersonModel>)(persn));
// }

// function sss2<T extends object>(com: FF<T>) {
// 	console.log((com.template as jsxRender<T>)(persn as T));
// }

// sss1({
// 	template: s
// });

// sss2({
// 	template: d
// });
