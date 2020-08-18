import { Input, Component, Output, EventEmitter, View, BaseComponent, OnInit } from '../../esm2020/aurora.js';



interface Model {
    name: string;
    version: number;
    description: {
        title: string;
        desc: string;
    };
}

@Component({
    selector: 'html-view1',
    template:
        `
        <h1>{{viewData.name}}</h1>
        <h2>{{viewData.version}}</h2>
        <div class="card">
            <div class="card-header">
                {{viewData.description.title}}
            </div>
            <div class="card-body">
                {{viewData.description.desc}}
            </div>
        </div>
        `
})
export class HTMLView1 {
    @Input()
    viewData: Model;
}

@Component({
    selector: 'html-view2',
    template:
        `
        <h1 [innerHTML]="viewData.name"></h1>
        <h2 [innerHTML]="viewData.version"></h2>
        <div class="card">
            <div class="card-header" [innerHTML]="viewData.description.title"></div>
            <div class="card-body" [innerHTML]="viewData.description.desc"></div>
        </div>
        `
})
export class HTMLView2 {
    @Input()
    viewData: Model;
}

@Component({
    selector: 'html-edit',
    template:
        `
        <form #form >
            <div class="mb-3" >
                <label for="appName-{{modelId}}" class="form-label">Name</label>
                <input id="appName-{{modelId}}" type="text" [(value)]="editData.name"/>
            </div>
            <div class="mb-3" >
                <label for="appversin-{{modelId}}" class="form-label" > Version </label>
                <input id="appversin-{{modelId}}" type="number" [(value)]="editData.version"/>
            </div>

            <div class="mb-3" >
                <label for="title-{{modelId}}" class="form-label" >Title</label>
                <input id="title-{{modelId}}" type="text" [(value)]="editData.description.title"/>
            </div>

            <div class="mb-3" >
                <label for="desc-{{modelId}}" class="form-label">Description</label>
                <input id="desc-{{modelId}}" type="text" [(value)]="editData.description.desc"/>
            </div>
            <div class="btn-group" role="group" aria-label="Basic example" >
                <button type="button" class="btn btn-primary" (click)="printModel()">Print</button>
                <button type="button" class="btn btn-secondary" (click)="saveModel()">Save</button>
                <button type="button" class="btn btn-primary" (click)="fireEvent()">Event</button>
            </div>
        </form>
        `
})
export class HTMLEdit {

    @Input()
    modelId: string;

    @Input()
    editData: Model;

    @Output()
    save = new EventEmitter<Model>();

    @View()
    view: BaseComponent<HTMLEdit>;

    printModel() {
        console.log(this.editData);
    }

    saveModel() {
        this.save.emit(this.editData);
    }

    fireEvent() {
        // this.view.triggerEvent('editData');
        this.view._parentComponent?.triggerEvent('appModel');
    }
}

@Component({
    selector: 'html-app',
    encapsulation: 'custom',
    template:
        `
        <div class="row">
            <div class="col-12">
                <div class="p-3 my-2 bg-success text-white">
                    No binding just pass data, first way template handler
                </div>
                <div class="row">
                    <div class="col-6" >
                        No binding just pass data template handler
                        <br/>
                        <html-edit modelId="A" editData="{{modelA}}" />
                    </div>
                    <div class="col-6" >
                        One Way Binding
                        <br/>
                        <code>
                            html-view1 [viewData]="modelA"
                        </code>
                        <br/>
                        <html-view1 [viewData]="modelA" />
                    </div>
                </div>
                <div class="p-3 my-2 bg-success text-white">
                    No binding just pass data, 2nd way
                </div>
                <div class="row">
                    <div class="col-6" >
                        No binding just pass data
                        <br/>
                        <html-edit modelId="B" editData="{{modelB}}" />
                    </div>
                    <div class="col-6" >
                        One Way Binding
                        <br/>
                        <code>
                            html-view2 [viewData]="modelB"
                        </code>
                        <br/>
                        <html-view2 [viewData]="modelB" />
                    </div>
                </div>
                <div class="p-3 my-2 bg-success text-white">
                    One Way Binding
                </div>
                <div class="row">
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-edit [editData]="modelC"
                        </code>
                        <br/>
                        <html-edit modelId="C1" [editData]="modelC" />
                    </div>
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-edit [editData]="modelC"
                        </code>
                        <br/>
                        <html-edit modelId="C2" [editData]="modelC" />
                    </div>
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-view2 [viewData]="modelC"
                        </code>
                        <br/>
                        <html-view2 [viewData]="modelC" />
                    </div>
                </div>
                <div class="p-3 my-2 bg-success text-white">
                    One Way Binding & Two Way Binding
                </div>
                <div class="row">
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-edit [editData]="modelD"
                        </code>
                        <br/>
                        <html-edit modelId="D1" [editData]="modelD" />
                    </div>
                    <div class="col-4" >
                        Two Way Binding
                        <br/>
                        <code>
                            html-edit modelId="D2" [(editData)]="modelD"
                        </code>
                        <br/>
                        <html-edit [(editData)]="modelD" />
                    </div>
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-view2 [viewData]="modelD"
                        </code>
                        <br/>
                        <html-view2 [viewData]="modelD" />
                    </div>
                </div>
                <div class="p-3 my-2 bg-success text-white">
                    Two Way Binding
                </div>
                <div class="row">
                    <div class="col-4" >
                        Two Way Binding
                        <br/>
                        <code>
                            html-edit [(editData)]="modelE"
                        </code>
                        <br/>
                        <html-edit modelId="E1" [(editData)]="modelE" />
                    </div>
                    <div class="col-4" >
                        Two Way Binding
                        <br/>
                        <code>
                            html-edit [(editData)]="modelE"
                        </code>
                        <br/>
                        <html-edit modelId="E2" [(editData)]="modelE" />
                    </div>
                    <div class="col-4" >
                        One Way Binding
                        <br/>
                        <code>
                            html-view2 [viewData]="modelE"
                        </code>
                        <br/>
                        <html-view2 [viewData]="modelE" />
                    </div>
                </div>
            </div>
        </div>
        `
})
export class HTMLApp implements OnInit {

    _appModel: Model = {
        name: 'Aurora',
        version: 2,
        description: {
            title: 'Aurora custom element creator',
            desc: `Aurora is a web framework, that can create and define a usable 'custom elements',
            that compatible with other frameworks, using Typescript`
        }
    };

    modelA: Model;
    modelB: Model;
    modelC: Model;
    modelD: Model;
    modelE: Model;

    onInit(): void {
        this.modelA = this.getModel();
        this.modelB = this.getModel();
        this.modelC = this.getModel();
        this.modelD = this.getModel();
        this.modelE = this.getModel();
    }

    saveAction(data: any) {
        console.log('tage: JsxApp', data);
    }

    getModel(): Model {
        return JSON.parse(JSON.stringify(this._appModel));
    }

}