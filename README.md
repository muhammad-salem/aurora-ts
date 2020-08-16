# Aurora

Aurora is a web framework, that can create and define a usable 'custom elements', that compatible with other frameworks, using Typescript.

## `Install`

``` bash
npm i aurora-ts
```

npm i aurora-ts

### `JSX Example`

``` typescript

export interface DataModel {
    name: string;
    version: number;
    description: {
        title: string;
        desc: string;
    };
}

@Component({
    selector: 'app-view',
    template: () => {
        return (
            <Fragment>
                <h1>{viewData.name}</h1>
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
    viewData: DataModel;
}

@Component({
    selector: 'app-edit',
    template:
        `
        <form #form >
            <div class="mb-3" >
                <label for="appName" class="form-label">Name</label>
                <input id="appName" type="text" [(value)]="editData.name"/>
            </div>
            <div class="mb-3" >
                <label for="appversin" class="form-label" > Version </label>
                <input id="appversin" type="number" [(value)]="editData.version"/>
            </div>

            <div class="mb-3" >
                <label for="title" class="form-label" >Title</label>
                <input id="title" type="text" [(value)]="editData.description.title"/>
            </div>

            <div class="mb-3" >
                <label for="desc" class="form-label">Description</label>
                <input id="desc" type="text" [(value)]="editData.description.desc"/>
            </div>
            <div class="btn-group" role="group" aria-label="Basic example" >
                <button type="button" class="btn btn-primary" (click)="printModel()">Print</button>
                <button type="button" class="btn btn-secondary" (click)="saveModel()">Save</button>
            </div>
        </form>
        `
})
export class AppEdit {
    @Input()
    editData: DataModel;

    @Output()
    save = new EventEmitter<DataModel>();

    @View()
    view: HTMLComponent<HTMLEdit> | HTMLElement;

    printModel() {
        console.log(this.editData);
    }

    saveModel() {
        this.save.emit(this.editData);
    }
}

@Component({
    selector: 'root-app',
    encapsulation: 'none',
    template:
        `
        <div class="row" >
            <div class="col-6" >
                <app-edit [(editData)]="model" />
            </div>
            <div class="col-6" >
                <app-view [viewData]="model" />
            </div>
        </div>
        `
})
export class RootApp implements OnInit {

    model: DataModel;

    onInit(): void {
        this.model = {
            name: 'Aurora',
            version: 2,
            description: {
                title: 'Aurora custom element creator',
                desc: `Aurora is a web framework, that can create and define a usable 'custom elements',
                that compatible with other frameworks, using Typescript`
            }
        };
    }

    saveAction(data: any) {
        console.log('tage: rootApp', data);
    }

}
```

in index.html add:

```html
    <script type="module" src="path-to-main-file/index.js"></script>
    <root-app></root-app>
```

#### `Screenshot`

![aurora-capture](https://github.com/salemebo/aurora-ts/raw/master/.img/aurora-capture.gif)
