import { Component, Input, View, HostListener } from '../core/decoratiors.js';
import { OnInit, OnChanges, AfterViewInit } from '../core/lifecycle.js';
import { LogService } from './person.js';


@Component({
	selector: 'bootstrap-btn',
	extend: 'button',
	template: '',
	styles: '',
})
export class PrimaryButton implements OnInit, OnChanges, AfterViewInit {
	@Input() color:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'light'
		| 'dark'
		| 'link' = 'primary';
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
	}

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent) {
		console.log('button clicked!', event, this);
	}
}
