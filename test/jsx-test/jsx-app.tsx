import { Input, Component, JsxFactory, Fragment, Output, EventEmitter, View, BaseComponent } from '../../esm2020/aurora.js';



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
        this.view._parentComponent.triggerEvent('appModel');
    }
}

@Component({
    selector: 'ay-kalam',
    template: `
    <div>
        <div [innerHTML]="_model"></div>
        <div>{{_model}}</div>
        <button class="btn btn-primary" (click)="info()" >click</button>
    </div>`
})
class AyKalam {

    _model: string;

    @Input()
    set model(model: AppModel) {
        this._model = JSON.stringify(model);
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
                {/* <div class="col-12" >
                    <ay-kalam $model="appModel" />
                </div> */}
                <div class="col-6">
                    {/* <div class="row">
                        <div class="col-6">
                            <app-edit editData={jsxApp.appModel} />
                        </div>
                        <div class="col-6">
                            <app-edit $editData="$appModel" />
                        </div>
                    </div> */}
                    <app-edit $editData="$appModel" onsave="saveAction()" />
                </div>
                <div class="col-6">
                    <app-view $viewData="appModel" />
                </div>
            </div>
        );
    }
})
export class JsxApp {
    appModel: AppModel = {
        name: 'Aurora',
        version: 2,
        description: {
            title: 'Aurora custom element creator',
            desc: `Aurora is a web framework, that can create and define a usable 'custom elements',
            that compatible with other frameworks, using Typescript`
        }
    };

    saveAction(data: any) {
        console.log('tage: JsxApp', data);
    }

}