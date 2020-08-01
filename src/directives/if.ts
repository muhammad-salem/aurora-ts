import { OnInit, AfterViewInit } from '../core/lifecycle.js';
import { Directive, View, Input } from '../core/decorators.js';

@Directive({
	selector: '[if]',
})
export class IfDirective implements OnInit, AfterViewInit {
	@View()
	comment: Comment;

	@Input() if: boolean;

	@Input()
	set ifThen(view: any) {}

	@Input()
	set ifElse(view: any) {}

	constructor() {}
	onInit(): void {
		console.log('IfDirective#onInit()');
	}
	afterViewInit(): void {
		console.log('IfDirective#onInit()');
	}
}
