import { AfterContentInit, AfterViewInit, Component, HTMLComponent, isModel, JsxFactory, Model, OnChanges, OnInit, View } from '../../dist/aurora.js';

interface Data {
    name: string;
}

@Component({
    selector: 'life-cycle-test',
    template: () => {
        return (
            <div $innerHTML="$data.name"></div>
        );
    }
})
class LifeCycleTest implements OnInit, OnChanges, AfterContentInit, AfterViewInit {

    data: Data;

    @View()
    view: HTMLComponent<LifeCycleTest>;

    printData() {
        console.log(JSON.stringify(this.data));
    }

    onInit(): void {
        this.data = { name: 'Foo onInit' };
        this.printData();
    }

    onChanges(): void {
        this.data = { name: 'Foo onChanges' };
        this.printData();
    }

    afterContentInit(): void {
        this.data = { name: 'Foo afterContentInit' };
        this.printData();
    }

    afterViewInit(): void {
        this.data = { name: 'Foo afterViewInit' };
        this.printData();
        let x = 0;
        setInterval(() => {
            this.data = { name: 'Foo setInterval ' + x++ };
            this.printData();
            this.view.emitRootChanges();
            // // OR call emitChangeModel
            // if (isModel(this)) {
            //     this.emitChangeModel('data.name');
            // }
        }, 1000);
    }

}