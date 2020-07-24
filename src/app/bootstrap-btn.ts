import { Component, Input, View, HostListener } from '../core/decoratiors.js';
import { findByTagName } from '../elements/tags.js';
import { OnInit, OnChanges, AfterViewInit } from '../core/lifecycle.js';
import { LogService } from './person.js';



@Component({
    selector: 'bootstrap-btn',
    extend: findByTagName('button'),
})
export class PrimaryButton implements OnInit, OnChanges, AfterViewInit {

    @Input() btnName: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' = 'primary';
    @Input() outline: boolean = false;
    @Input() type: 'submit' | 'button' | 'reset' = 'button';

    @Input() size: 'lg' | 'sm' | 'md' = 'md';

    @View()
    view: HTMLButtonElement;
    logger: LogService;
    constructor() {
        this.logger = new LogService(console);
    }
    afterViewInit(): void {
        this.view.classList.add('btn');
        let className = 'btn';
        className += this.outline ? '-outline' : '';
        className += '-' + this.btnName;
        this.view.classList.add(className);
        this.view.classList.add('btn-' + this.size);
    }
    onInit(): void { }

    onChanges(): void {
        // console.log(this.view === this._view);
        this.logger.info('info: logger');
    }

    @HostListener('click', [])
    onClick() {
        console.log('button clicked!', this);
    }
}