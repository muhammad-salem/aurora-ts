import { Component, Input } from '../core/decoratiors.js';
import { JsxFactory, Fragment } from '../jsx/factory.js'


@Component({
    selector: 'app-root',
    template:
        (<Fragment>
            <h1></h1>
            <progress-bar value="40" min="0" max="100"></progress-bar>

            <div class="row">
                <div class="col-4">
                    <person-view name="nancy" age="34"></person-view>
                </div>
                <div class="col-4">
                    <person-view name="jone" age="25"></person-view>
                </div>
                <div class="col-4">
                    <person-view name="alex" age="29"></person-view>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <button is="bootstrap-btn" size="sm" btnName="primary" type="reset">primary-button</button>
                </div>
                <div class="col-4">
                    <bootstrap-btn is="bootstrap-btn" btnName="success" size="lg" type="submit">OK</bootstrap-btn>
                </div>
                <div class="col-4">

                </div>
            </div>
        </Fragment>)
})
export class AppRoot {
    @Input()
    appVesion: string = '10.0.90';
}