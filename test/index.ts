
export * from './tester/test-app.js';
import { TestApp } from './tester/test-app.js';
import { HTMLComponent } from '../src/aurora.js';

// export * from './app/bootstrap-btn.js';
// export * from './app/person.js';
// export * from './app/app-root.js';

// export * from './bind/bind-text.js';
// export * from './html-test/html-app.js';
// export * from './jsx-test/binding-view.js';
// export * from './jsx-test/jsx-app.js';
// export * from './template-test/template-app.js';

// export * from './shadowdom-test/shadowdom.js';
// export * from './life-cycle/lifecycle-test.js';
// export * from './multi-component/m-person.js';

// export * from './directives-test/directive-test.js';

export * from './expressions/template-expressions.js';

let appSelectors = [
    'd1-data',
    'd2-data',
    'exep-app',
    // 'structural-directive-app',
    // 'directive-app',
    // 'directive-test',
    // 'multi-comp-app1',
    // 'multi-comp-app2',
    // 'life-cycle-test',
    // 'tabs-root',
    // 'dev-app',
    // 'parent-app',
    // 'bind-view',
    // 'app-root',
    // 'html-jsx'
];
const testApp = document.createElement('test-app') as HTMLComponent<TestApp>;
testApp._model.appSelector = appSelectors;
window.document.body.prepend(testApp);