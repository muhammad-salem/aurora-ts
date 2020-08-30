import { AfterContentInit, AfterViewInit, Component, HTMLComponent, Input, View } from '../../dist/aurora.js';


@Component({
    selector: 'test-app'
})
export class TestApp implements AfterViewInit {

    @Input('selector')
    appSelector: string | string[];

    @View()
    view: HTMLComponent<TestApp>;

    afterViewInit() {
        let apps: string = 'no apps provided';
        if (typeof this.appSelector === 'string') {
            apps = this.appSelector.split(',')
                .map(tag => tag.trim())
                .map(tag => `<${tag} ></${tag}>`)
                .join('\n');
        } else if (Array.isArray(this.appSelector)) {
            apps = this.appSelector
                .map(tag => tag.trim())
                .map(tag => `<${tag} ></${tag}>`)
                .join('\n');
        }
        this.view.innerHTML = apps;
    }

}