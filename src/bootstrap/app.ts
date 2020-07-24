

// export type ProviderType = 'component' | 'service' | 'directive' | 'pipe' | 'none';

// export type ClassModel = {
//     className: string,
//     classRef: Function,
//     providerType: ProviderType,
//     options?: any
// };


// export class Application {

//     classModels: ClassModel[] = [];
//     getClassModels(): ClassModel[] {
//         return this.classModels;
//     }

//     bootstrap() {
//         this.classModels
//             .filter(model => model.providerType === "component")
//             .forEach(classModelRef => { });
//     }
// }

// // let application: Application;
// // export function setApp(app: Application) {
// //     application = app;
// // }
// // export function getDefaultApp() {
// //     return application ? application : application = new Application();
// // }