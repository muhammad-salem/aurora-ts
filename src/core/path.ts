export function getHtmlPath(moduleUrl: string, filename?: string): string {
    if (filename) {
        return moduleUrl.substring(0, moduleUrl.lastIndexOf('/') + 1) + filename;
    }
    return moduleUrl.replace('.js', '.html');
}

export async function fetchHtml(moduleMeta: { url: string }, filename?: string): Promise<string> {
    const url = getHtmlPath(moduleMeta.url, filename);
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

let htmlAppDirectory = window.location.href + 'template';

// export function setHtmlAppDir(url: string) {
//     htmlAppDirectory = url;
// }
// export function getHtmlAppDir(): string {
//     return htmlAppDirectory;
// }

export async function resolvePath(filename: string): Promise<string> {
    return fetch(htmlAppDirectory + '/' + filename).then(response => response.text());
}