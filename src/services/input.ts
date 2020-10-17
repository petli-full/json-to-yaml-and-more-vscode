import * as vscode from 'vscode';


interface Input {
    load: () => void;
    get: () => string;
    getFilename: () => string;
};

let _input = '';
let _filename = '';

const load = () => {
    const doc = vscode.window.activeTextEditor?.document;
    _input = (doc ? doc.getText() : '').trim();
    _filename = (doc ? doc.fileName : '').trim();
};

const get = (): string => {
    return _input;
};

const getFilename = (): string => {
    return _filename;
};


export const input: Input = {
    load,
    get,
    getFilename,
};
