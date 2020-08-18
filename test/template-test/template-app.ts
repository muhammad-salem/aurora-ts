import { Component, OnInit, Output, EventEmitter, HostListener } from '../../esm2020/aurora.js';
import { trace } from 'console';

interface CustomTemplateModel {
    name: string
    type: string;
}


function onCustomTemplateSave(data: CustomTemplateModel) {
    console.log(data.name, data.type);
    alert(JSON.stringify(data));
}
function templateClicked() {
    console.log('templateClicked called');
}

Reflect.set(window, 'onCustomTemplateSave', onCustomTemplateSave);

@Component({
    selector: 'custom-template-id',
    encapsulation: 'template'
})

export class CustomTemplate implements OnInit {

    model: CustomTemplateModel;

    @Output()
    save = new EventEmitter<CustomTemplateModel>();

    @Output('datachange')
    dataChange = new EventEmitter<CustomTemplateModel>();

    constructor() { }

    onInit() {
        this.model = {
            name: 'CustomTemplate',
            type: 'custom template'
        };
    }

    onSaveButtonClick() {
        this.save.emit(this.model);
    }

    // @HostListener('model')
    onChangeButtonClick() {
        console.log(`@HostListener('model')`);
        this.dataChange.emit(this.model);
    }
}


Reflect.set(window, 'templateClicked', templateClicked);