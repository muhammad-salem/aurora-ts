import { TemplateUrl } from './decorators.js';

function resolveHtmlFilePath(moduleUrl: string, filename?: string): string {
    if (filename) {
        return moduleUrl.substring(0, moduleUrl.lastIndexOf('/') + 1) + filename;
    }
    return moduleUrl.replace('.js', '.html');
}

export async function fetchHtmlFromModule(fileNameResolver: TemplateUrl): Promise<string> {
    const url = resolveHtmlFilePath(fileNameResolver.moduleMeta?.url, fileNameResolver.filename);
    return fetch(url).then(response => response.text());
}

export async function htmlFullPath(fileFullPath: string): Promise<string> {
    if (fileFullPath.match(/^https?:\/\//g)) {
        let result: string = await fetch(fileFullPath).then(response => response.text());
        return result;
    } else {
        let result = await fetch(window.location.href + fileFullPath).then(response => response.text());
        return result;
    }
}

export async function fetchHtml(fileNameResolver: TemplateUrl | string): Promise<string> {
    if (typeof fileNameResolver === 'string') {
        return htmlFullPath(fileNameResolver);
    } else if (typeof fileNameResolver === 'object' && fileNameResolver.moduleMeta) {
        return fetchHtmlFromModule(fileNameResolver);
    } else if (typeof fileNameResolver === 'object' && fileNameResolver.filename) {
        return htmlFullPath(fileNameResolver.filename);
    }
    throw new Error('');
}