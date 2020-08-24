import { Input, Component, Fragment, JsxFactory, OnInit } from '../../dist/aurora.js';

interface Developer {
    name: string;
    age: number;
    job: {
        title: string;
        lang: string;
    }
}

@Component({
    selector: 'dev-edit',
    template: ({ print }: DeveloperEdit) => {
        return (
            <Fragment>
                <input type="text" $value="$name" />
                <input type="number" $value="$age" />
                <input type="text" $value="$job.title" />
                <input type="text" $value="$job.lang" />
                <button onclick={print}>Print</button>
            </Fragment>
        );
    }
})
export class DeveloperEdit implements Developer {
    @Input()
    name: string;

    @Input()
    age: number;

    @Input()
    job: {
        title: string;
        lang: string;
    }

    print() {
        console.log(this);
    }
}

@Component({
    selector: 'dev-view',
    template: ({ print }: DeveloperView) => {
        return (
            <Fragment>
                <p innerHTML="{{name}}"></p>
                <p $innerHTML="age"></p>
                <p $innerHTML="job.title"></p>
                <p $innerHTML="job.lang"></p>

                {/* <input type="text" $value="$name" />
                <input type="number" $value="$age" />
                <input type="text" $value="$job.title" />
                <input type="text" $value="$job.lang" /> */}

                <button onclick={print}>Print</button>

            </Fragment>
        );
    }
})
export class DeveloperView implements Developer {
    @Input()
    name: string;

    @Input()
    age: number;

    @Input()
    job: {
        title: string;
        lang: string;
    }

    print() {
        console.log(this);
    }
}

@Component({
    selector: 'dev-app',
    template: () => {
        return (
            <Fragment>

                <input type="text" $value="$data.name" />
                <input type="number" $value="$data.age" />
                <input type="text" $value="$data.job.title" />
                <input type="text" $value="$data.job.lang" />
                <br />
                <dev-view
                    $name="$data.name"
                    $age="$data.age"
                    $job="$data.job"
                ></dev-view>
                <br />
                <dev-edit
                    $name="$data.name"
                    $age="$data.age"
                    $job="$data.job"
                ></dev-edit>
            </Fragment>
        );
    }
})
export class DeveloperModelApp implements OnInit {

    data: Developer;

    onInit(): void {
        this.data = {
            name: 'alex',
            age: 35,
            job: {
                title: 'senior',
                lang: 'typescript'
            }
        };
    }
}
