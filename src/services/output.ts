import * as vscode from 'vscode';


interface Output {
    ready: (type: string) => Thenable<vscode.TextEditor>;
    display: (result: string) => Thenable<vscode.TextEditor>;
};

let editor$: null | Thenable<vscode.TextEditor> = null;
let _editor: null | vscode.TextEditor = null;

const typeToLanguageId = (type: string): string => {
    const languageIdMap: { [key: string]: string } = {
        json: 'json',
        yaml: 'yaml',
        xml: 'xml',
        ini: 'ini',
        toml: 'ini',
        json5: 'plaintext',
        hjson: 'plaintext',
        csv: 'plaintext',
    };

    let languageId = languageIdMap[type];
    if (!languageId) {
        if (_editor !== null) {
            languageId = _editor.document.languageId;
        } else {
            languageId = 'json';
        }
    }

    return languageId;
};

const ready = (type: string): Thenable<vscode.TextEditor> => {
    const languageId = typeToLanguageId(type);

    if (editor$ === null || (_editor !== null && _editor.document.isClosed)) {
        editor$ = vscode.workspace.openTextDocument({ language: languageId, content: '' }).then(doc => {
            return vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside).then(editor => {
                _editor = editor;
                return editor;
            });
        });
        return editor$;
    } else if (_editor === null) {
        return editor$.then(() => ready(type));
    } else if (_editor.document.languageId !== languageId) {
        editor$ = vscode.languages.setTextDocumentLanguage(_editor.document, languageId).then(doc => {
            if (doc.isClosed || _editor === null) {
                return vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside).then(editor => {
                    _editor = editor;
                    return editor;
                });
            }
            return _editor;
        });
        return editor$;
    }

    return editor$;
};

const display = (result: string): Thenable<vscode.TextEditor> => {
    return ready('').then((editor) => {
        const allText = new vscode.Range(0, 0, editor.document.lineCount, 0);
        const startPos = editor.document.positionAt(0);
        return editor.edit(builder => {
            builder.delete(allText);
            builder.insert(startPos, result);
        }).then(() => editor);
    });
};

export const output: Output = {
    ready,
    display,
};