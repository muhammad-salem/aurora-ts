import { Input, Component, JsxFactory, Fragment, Output, EventEmitter, View, BaseComponent, OnInit } from '../../esm2020/aurora.js';



export interface AppModel {
    name: string;
    version: number;
    description: {
        title: string;
        desc: string;
    };
}

@Component({
    selector: 'app-view1',
    template: ({ viewData }: AppView1) => {
        return (
            <Fragment>
                <h1> {viewData.name} </h1>
                <h2> {viewData.version} </h2>
                <div class="card">
                    <div class="card-header">
                        {viewData.description.title}
                    </div>
                    <div class="card-body">
                        {viewData.description.desc}
                    </div>
                </div>
            </Fragment>
        );
    }
})
export class AppView1 {
    @Input()
    viewData: AppModel;
}

@Component({
    selector: 'app-view',
    template: () => {
        return (
            <Fragment>
                <h1 $innerHTML="viewData.name"></h1>
                <h2 $innerHTML="viewData.version"></h2>
                <div class="card">
                    <div class="card-header" $innerHTML="viewData.description.title"></div>
                    <div class="card-body" $innerHTML="viewData.description.desc" ></div>
                </div>
            </Fragment>
        );
    }
})
export class AppView {
    @Input()
    viewData: AppModel;
}

@Component({
    selector: 'app-edit',
    template: ({ editData, printModel, saveModel }: AppEdit) => {
        return (
            <form #form >
                <div class="mb-3">
                    <label for="appName" class="form-label">Name</label>
                    <input id="appName" type="text" $value="$editData.name" />
                </div>
                <div class="mb-3">
                    <label for="appversin" class="form-label">Version</label>
                    <input id="appversin" type="number" $value="$editData.version" />
                </div>

                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input id="title" type="text" $value="$editData.description.title" />
                </div>

                <div class="mb-3">
                    <label for="desc" class="form-label">Description</label>
                    <input id="desc" type="text" $value="$editData.description.desc" />
                </div>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary" onclick={printModel}>Print</button>
                    <button type="button" class="btn btn-secondary" onclick={saveModel}>Save</button>
                    <button type="button" class="btn btn-primary" onclick="fireEvent()">Event</button>
                </div>
            </form>

        );
    }
})
export class AppEdit {
    @Input()
    editData: AppModel;

    @Output()
    save = new EventEmitter<AppModel>();

    @View()
    view: BaseComponent<AppEdit>;

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
    selector: 'ay-kalam',
    template: `
    <div>
        <div [innerHTML]="model"></div>
        <div>{{model}}</div>
        <button class="btn btn-primary" (click)="info()" >click</button>
    </div>`
})
class AyKalam {

    _model: string;

    @Input()
    set model(model: any) {
        this._model = JSON.stringify(model);
    }

    get model(): any {
        return this._model;
    }

    info() {
        console.log(this._model);
    }

}

@Component({
    selector: 'jsx-app',
    template: (jsxApp: JsxApp) => {
        return (
            <div class="row">
                <div class="col-12">
                    <div class="p-3 my-2 bg-success text-white">
                        No binding just pass data, first way
                    </div>
                    <div class="row">
                        <div class="col-6" >
                            No binding just pass data
                            <br />
                            <code>
                                {`<app-edit editData={jsxApp.modelA} />`}
                            </code>
                            <br />
                            <app-edit editData={jsxApp.modelA} />
                        </div>
                        <div class="col-6" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-view $viewData="modelA" />`}
                            </code>
                            <br />
                            <app-view $viewData="modelA" />
                        </div>
                    </div>
                    <div class="p-3 my-2 bg-success text-white">
                        No binding just pass data, 2nd way
                    </div>
                    <div class="row">
                        <div class="col-6" >
                            No binding just pass data
                            <br />
                            <code>
                                {`<app-edit editData="$modelB" />`}
                            </code>
                            <br />
                            <app-edit editData="$modelB" />
                        </div>
                        <div class="col-6" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-view $viewData="modelB" />`}
                            </code>
                            <br />
                            <app-view $viewData="modelB" />
                        </div>
                    </div>
                    <div class="p-3 my-2 bg-success text-white">
                        One Way Binding
                    </div>
                    <div class="row">
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="modelC"/>`}
                            </code>
                            <br />
                            <app-edit $editData="modelC" />
                        </div>
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="modelC"/>`}
                            </code>
                            <br />
                            <app-edit $editData="modelC" />
                        </div>
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-view $viewData="modelC" />`}
                            </code>
                            <br />
                            <app-view $viewData="modelC" />
                        </div>
                    </div>
                    <div class="p-3 my-2 bg-success text-white">
                        One Way Binding & Two Way Binding
                    </div>
                    <div class="row">
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="modelD"/>`}
                            </code>
                            <br />
                            <app-edit $editData="modelD" />
                        </div>
                        <div class="col-4" >
                            Two Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="$modelD"/>`}
                            </code>
                            <br />
                            <app-edit $editData="$modelD" />
                        </div>
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-view $viewData="modelD" />`}
                            </code>
                            <br />
                            <app-view $viewData="modelD" />
                        </div>
                    </div>
                    <div class="p-3 my-2 bg-success text-white">
                        Two Way Binding
                    </div>
                    <div class="row">
                        <div class="col-4" >
                            Two Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="$modelE"/>`}
                            </code>
                            <br />
                            <app-edit $editData="$modelE" />
                        </div>
                        <div class="col-4" >
                            Two Way Binding
                            <br />
                            <code>
                                {`<app-edit $editData="$modelE"/>`}
                            </code>
                            <br />
                            <app-edit $editData="$modelE" />
                        </div>
                        <div class="col-4" >
                            One Way Binding
                            <br />
                            <code>
                                {`<app-view $viewData="modelE" />`}
                            </code>
                            <br />
                            <app-view $viewData="modelE" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})
export class JsxApp implements OnInit {

    _appModel: AppModel = {
        name: 'Aurora',
        version: 2,
        description: {
            title: 'Aurora custom element creator',
            desc: `Aurora is a web framework, that can create and define a usable 'custom elements',
            that compatible with other frameworks, using Typescript`
        }
    };

    modelA: AppModel;
    modelB: AppModel;
    modelC: AppModel;
    modelD: AppModel;
    modelE: AppModel;

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

    getModel(): AppModel {
        return JSON.parse(JSON.stringify(this._appModel));
    }

}