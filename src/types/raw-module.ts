declare module '*.html' {
    const content: string;
    export default content;
}

declare module '*.html.js' {
    const contentJS: string;
    export default contentJS;
}

declare module '*.txt' {
    const value: string
    export default value
}

declare module '*.json' {
    const value: any
    export default value
}

declare module '*.b64' {
    const value: string
    export default value
}

declare module '*.buf' {
    const value: Uint8Array
    export default value
}

declare module '*.css' {
    const value: string
    export default value
}

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "*.jpg" {
    const content: any;
    export default content;
}

declare module "*.png" {
    const content: any;
    export default content;
}