# Aurora

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Install Size][badge-size]][badge-size]
[![LICENSE][license-img]][license-url]

[npm-image]: https://img.shields.io/npm/v/aurora-ts.svg
[npm-url]: https://npmjs.org/package/aurora-ts
[downloads-image]: https://img.shields.io/npm/dm/aurora-ts.svg
[downloads-url]: https://npmjs.org/package/aurora-ts
[badge-size]: https://packagephobia.now.sh/badge?p=aurora-ts
[license-img]: https://img.shields.io/github/license/salemebo/aurora-ts.svg
[license-url]: https://github.com/salemebo/aurora-ts/blob/master/LICENSE

Aurora is a web framework, that can create and define a usable 'custom elements', that compatible with other frameworks, using Typescript.

```text
Render Once, Update Attributes/Properties On Change.
No need for Virtual Dom.
```

## `Install - NPM`

``` bash
npm i --save aurora-ts
```

## [HTML Template] and [JSX / TSX] Features

| Support | HTML Template| JSX |
| -------------------- | - | - |
| Parsing Attributes | ✓ | ✓ |
| One Way Data Binding | ✓ | ✓ |
| Two Way Data Binding | ✓ | ✓ |
| Event Binding | ✓ | ✓ |
| Template Parser | ✓ | no need |
| Template Syntax | ✓ | no need |
| Template HTML File | dynamic import | no need |
| JSX Factory | no need | ✓ |
| Fragment | ✓ | ✓ |
| camelCase Property Naming | ✓ | ✓ |

## Libary Features

| Features | Aurora |
| ------- | ------- |
| ES Module | ✓ |
| JavaScript | ✓ |
| Javascript | TO:DO |
| Dependency Injection |  In Progress |
| Directives | TO:DO |
| Services | TO:DO |
| Pipes | TO:DO |
| Lifecycle | ✓ |
| @Input | ✓ |
| @Output | ✓ |
| @View | ✓ |
| @HostListener | ✓ |
| @ViewChild | TO:DO |
| @HostBinding | TO:DO |
| @ViewChildren | TO:DO |
| @SelfSkip | TO:DO |
| @Optional | TO:DO |
| *if Directive | TO:DO |
| *for Directive | TO:DO |
| *switch Directive | TO:DO |
| [Annotation/Decorators reflect-metadata][metadata] | ✓ |
| XSS (cross-site-scripting) | TO:DO |

[metadata]: https://github.com/rbuckton/reflect-metadata

## Web Component standards

| Standards  | Support |
| ------- | ------- |
| [Custom Elements][custom]  | ✓ |
| [Shadow DOM][shadow] |  In Progress |
| [Template Element][template]| TO:DO |

## Custom Elements standards

| Features | Aurora |
| ------- | ------- |
| [Reflecting Properties to Attributes][attr-props] | ✓ |
| [Observing Changes to Attributes][observ-attr] | ✓ |
| [Element Upgrades][elem-upgrd] | ✓ |
| [Styling a Custom Element][style] | TO:DO |
| [Extending native HTML elements][extend-native] | ✓ |
| [Extending a Custom Element][extend-custom] | TO:DO |

[attr-props]: https://developers.google.com/web/fundamentals/web-components/customelements#reflectattr
[observ-attr]: https://developers.google.com/web/fundamentals/web-components/customelements#attrchanges
[elem-upgrd]: https://developers.google.com/web/fundamentals/web-components/customelements#upgrades
[custom]: https://developers.google.com/web/fundamentals/web-components/customelements
[shadow]: https://developers.google.com/web/fundamentals/web-components/customelements#shadowdom
[template]: https://developers.google.com/web/fundamentals/web-components/customelements#fromtemplate
[style]: https://developers.google.com/web/fundamentals/web-components/customelements#styling
[extend-custom]: https://developers.google.com/web/fundamentals/web-components/customelements#extendcustomeel
[extend-native]: https://developers.google.com/web/fundamentals/web-components/customelements#extendhtml

## future support

- wasm

### `[JSX and HTML] -- template parser example`

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
    template: ({viewData}: AppView) => {
        return (
            <Fragment>
                {/* just pass data as text, jsx feature*/}
                <h1>{viewData.name}</h1>
                {/* just pass data as text, from prop viewData.name to innerHTML */}
                <h1 innerHTML="$viewData.name"></h1>
                {/* one way binding for 'innerHTML' to property 'viewData.name' */}
                <h1 $innerHTML="viewData.name"></h1>
                {/* two way binding for 'innerHTML' to property 'viewData.name' */}
                <input type="text" $value="$viewData.name"></h1>

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
    encapsulation: 'custom',
    template:
        `
        <div class="row" >
            <div class="col-6" >
                <app-edit [(editData)]="model" (save)="saveAction($event)" />
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
    <body>
        <root-app></root-app>
        <script type="module" src="path-to-main-file/index.js"></script>
    </body>
 ```

#### `Screenshot`

 ![aurora-capture](https://github.com/salemebo/aurora-ts/raw/master/.img/aurora-capture.gif)

#### `aurora-examples`

 @see <https://github.com/salemebo/aurora-examples>

#### test local

```bash
git clone https://github.com/salemebo/aurora-ts.git
npm i
npm run test
npm run serve
```
