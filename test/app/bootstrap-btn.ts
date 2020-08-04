
import {
	Component, Input, View, HostListener,
	OnInit, OnChanges, AfterViewInit
} from '../../esm2020/aurora.js';
import { LogService } from './person.js';

@Component({
	selector: 'bootstrap-btn',
	extend: 'button'
})
export class PrimaryButton implements OnInit, OnChanges, AfterViewInit {
	@Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' = 'primary';
	@Input() outline: boolean = false;
	@Input() size: 'lg' | 'sm' | 'md' = 'md';

	@View()
	view: HTMLButtonElement;
	logger: LogService;
	constructor() {
		this.logger = new LogService();
	}
	afterViewInit(): void {
		this.view.classList.add('btn');
		let className = 'btn';
		className += this.outline ? '-outline' : '';
		className += '-' + this.color;
		this.view.classList.add(className);
		this.view.classList.add('btn-' + this.size);
		this.view.className;
	}
	onInit(): void { }

	onChanges(): void {
		// console.log(this.view === this._view);
		this.logger.info('info: logger');
		if (this.view) {
			this.view.className = "";
			this.afterViewInit();
		}
	}

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent) {
		console.log('button clicked!', event, this);
	}
}
