import { Component, Input, HostListener, View } from '../../esm2020/aurora.js';
import { Person } from './person.js';
// import personHTML from './app-root.html';


@Component({
    selector: 'app-root',
    template:
        `
<div [name]="name" [(id)]="id" (click)="onClick()">
    {{appVersion}}
    {{appName}}
</div>

<h1 [textContent]="ddd" [name]=@text></h1>
<h2>data1{'data2'}data3</h2>
<h3>data1 'data2' data3</h3>
<h4>data1 {JSON.stringify(data)} data3</h4>

<person-edit #personEdit person="{{person1}}" (save)="printPerson($event)"></person-edit>

<progress-bar value="40" min="0" max="100" person="{{person1}}"></progress-bar>

<div class="row">
    <div class="col-3">
        <person-view #pm1 person="{{person1}}" name="dddddddd" age="34" allowed></person-view>
    </div>
    <div class="col-3">
        <person-view #pm2 person="{{person2}}" name="{{name}}" bind-age="years"></person-view>
    </div>
    <div class="col-3">
        <person-view #pm3 name="jone" age="25" person="{{person3}}"></person-view>
    </div>
    <div class="col-3">
        <person-view #pm4 name="alex" age="29" person="{{person4}}"></person-view>
    </div>
</div>

<div class="row p-1 m-1">
    <div class="col-12 p-1 m-1">
        <div class="btn-group btn-group-vertical" role="group">
            <bootstrap-button size="sm" color="primary">Primary</bootstrap-button>
            <bootstrap-button size="sm" color="secondary">Secondary</bootstrap-button>
            <bootstrap-button size="sm" color="success">Success</bootstrap-button>
            <bootstrap-button size="sm" color="danger">Danger</bootstrap-button>
            <bootstrap-button size="sm" color="warning">Warning</bootstrap-button>
            <bootstrap-button size="sm" color="info">Info</bootstrap-button>
            <bootstrap-button size="sm" color="light">Light</bootstrap-button>
            <bootstrap-button size="sm" color="dark">Dark</bootstrap-button>
            <bootstrap-button size="sm" color="link">Link</bootstrap-button>
        </div>
    </div>
    <div class="col-12 p-1 m-1">
        <div class="btn-group" role="group" aria-label="Basic example">
            <bootstrap-button size="sm" outline color="primary">Primary</bootstrap-button>
            <bootstrap-button size="sm" outline color="secondary">Secondary</bootstrap-button>
            <bootstrap-button size="sm" outline color="success">Success</bootstrap-button>
            <bootstrap-button size="sm" outline color="danger">Danger</bootstrap-button>
            <bootstrap-button size="sm" outline color="warning">Warning</bootstrap-button>
            <bootstrap-button size="sm" outline color="info">Info</bootstrap-button>
            <bootstrap-button size="sm" outline color="light">Light</bootstrap-button>
            <bootstrap-button size="sm" outline color="dark">Dark</bootstrap-button>
            <bootstrap-button size="sm" outline color="link">Link</bootstrap-button>
        </div>
    </div>
    <div class="col-12 p-1 m-1">
        <div class="btn-group" role="group" aria-label="Basic example">
            <bootstrap-button size="sm" outline color="secondary">Left</bootstrap-button>
            <bootstrap-button size="md" outline color="secondary">Middle</bootstrap-button>
            <bootstrap-button size="lg" outline color="secondary">Right</bootstrap-button>
        </div>
    </div>
</div>
`
})
export class AppRoot {
    @Input()
    appVersion: string = '20.7.29';

    @Input()
    appName = 'Alex';

    @Input()
    name = 'Jone Alex';

    @View()
    view: HTMLElement;

    person1: Person = { name: 'jone', age: 39 };
    person2: Person = { name: 'alex', age: 46 };
    person3: Person = { name: 'delilya', age: 25 };
    person4: Person = { name: 'kelwa', age: 14 };

    @HostListener('person1:select')
    onClose(data: any) {
        console.log('AppRoot => person1:select', data);
    }

    @HostListener('personEdit:input')
    onPersonEdit(data: any) {
        console.log('personEdit:input', data, this.view);
    }

    @HostListener('personEdit:person.age')
    onPersonAge(data: any) {
        console.log('personEdit:person.age', data, this.view);
    }
}
