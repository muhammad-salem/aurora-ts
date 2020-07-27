import { Component, Input, HostListener } from '../core/decoratiors.js';
import { JsxFactory, Fragment } from '../jsx/factory.js';

const data = { name: 'dddd', age: 9876 };

@Component({
	selector: 'app-root',
	template: (
		<Fragment>
			<h1>data1{'data2'}data3</h1>
			<h1>data1 'data2' data3</h1>
			<progress-bar value="40" min="0" max="100"></progress-bar>
			<div class="row">
				<div class="col-3">
					<person-view #person1 name={data} age="34" allowed></person-view>
				</div>
				<div class="col-3">
					<person-view #person2 name="{{name}}" bind-age="years"></person-view>
				</div>
				<div class="col-3">
					<person-view name="jone" age="25"></person-view>
				</div>
				<div class="col-3">
					<person-view name="alex" age="29"></person-view>
				</div>
			</div>

			<div class="row p-1 m-1">
				<div class="col-12 p-1 m-1">
					<div
						class="btn-group btn-group-vertical"
						role="group"
						aria-label="Basic example"
					>
						<bootstrap-btn size="sm" color="primary">
							Primary
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="secondary">
							Secondary
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="success">
							Success
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="danger">
							Danger
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="warning">
							Warning
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="info">
							Info
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="light">
							Light
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="dark">
							Dark
						</bootstrap-btn>
						<bootstrap-btn size="sm" color="link">
							Link
						</bootstrap-btn>
					</div>
				</div>
				<div class="col-12 p-1 m-1">
					<div class="btn-group" role="group" aria-label="Basic example">
						<bootstrap-btn size="sm" outline color="primary">
							Primary
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="secondary">
							Secondary
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="success">
							Success
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="danger">
							Danger
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="warning">
							Warning
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="info">
							Info
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="light">
							Light
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="dark">
							Dark
						</bootstrap-btn>
						<bootstrap-btn size="sm" outline color="link">
							Link
						</bootstrap-btn>
					</div>
				</div>
				<div class="col-12 p-1 m-1">
					<div class="btn-group" role="group" aria-label="Basic example">
						<bootstrap-btn size="sm" outline color="secondary">
							Left
						</bootstrap-btn>
						<bootstrap-btn size="md" outline color="secondary">
							Middle
						</bootstrap-btn>
						<bootstrap-btn size="lg" outline color="secondary">
							Right
						</bootstrap-btn>
					</div>
				</div>
			</div>
		</Fragment>
	),
	styles: '',
})
export class AppRoot {
	@Input()
	appVesion: string = '10.0.90';

	name = 'Alex';

	@HostListener('person1:select')
	onClose(data: any) {
		console.log('AppRoot=> person1:select', data);
	}
}
