import {
    AfterViewInit, Component, ComponentOptions, HTMLComponent,
    Input, OnInit, View,
    JsxFactory, ViewChild
} from '../../dist/aurora.js';

const compRefPersonEdit: ComponentOptions<PersonComponent> = {
    selector: 'm-person-edit',
    template: ({ personName, personAge }: PersonComponent) => {
        return (
            <>
                {'{{personName}} - {{personAge}}'}
                <input type="text" $value="$personName" />
                <input type="number" $value="$personAge" />
            </>
        );
    }
};

const compRefPersonView: ComponentOptions<PersonComponent> = {
    selector: 'm-person-view',
    template: ({ personName, personAge }: PersonComponent) => {
        return (
            <>
                <div>{personName} - {personAge}</div>
                <div $innerHTML="$personName" />
                {'name:  {{personName}}'}
                <div $innerHTML="$personAge" />
            </>
        );
    }
};

// idea// share the same model // reduce resources
// @SharedModel(true) with [(model)] directive
@Component(compRefPersonEdit)
@Component(compRefPersonView)
export class PersonComponent implements OnInit, AfterViewInit {

    @Input()
    personName: string;

    @Input()
    personAge: number;

    onInit(): void {
        console.log(this);
    }

    @View()
    view: HTMLComponent<PersonComponent>;
    afterViewInit(): void {
        console.log(this.view, this.view.getComponentRef());
        console.log('is edit: ', compRefPersonEdit as any === this.view.getComponentRef());
        console.log('is view: ', compRefPersonView as any === this.view.getComponentRef());
    }
}

@Component({
    selector: 'multi-comp-app1',
    template: ` <m-person-edit
                    [(personName)]="person.personName" 
                    [(personAge)]="person.personAge">
                </m-person-edit>
                <m-person-view [(personName)]="person.personName" 
                             [(personAge)]="person.personAge"/>
                `
})

@Component({
    selector: 'multi-comp-app2',
    template: ` <m-person-edit #edit [(personName)]="person.personName" [(personAge)]="person.personAge"/>
                <m-person-view #view [(personName)]="edit.personName" [(personAge)]="edit.personAge"/>
                <m-person-view #view personName="{{edit.personName}}" personAge="{{edit.personAge}}"/>
                <div>
                    <br />
                    person.personName: {{person.personName}} - person.personAge: {{person.personAge}}
                    <br />
                    edit.personName: {{edit.personName}} - edit.personAge: {{edit.personAge}}
                    <br />
                    view.personName: {{view.personName}} - view.personAge: {{view.personAge}}
                    <br />
                </div>
                `
})
class MultiComponentApp implements OnInit, AfterViewInit {

    person: PersonComponent;

    onInit(): void {
        this.person = new PersonComponent();
        this.person.personName = 'alex';
        this.person.personAge = Math.random();
    }

    @ViewChild('edit')
    editElem: HTMLComponent<PersonComponent>;

    afterViewInit(): void {
        console.log('editElem', this.editElem);
    }

}
