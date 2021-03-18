import * as vscode from 'vscode';

import { query, input, output } from '../services';


function newQueryBox() {
    const queryBox = vscode.window.createInputBox();
    queryBox.ignoreFocusOut = true;
    queryBox.placeholder = 'A | B (convert type A to B)';
    queryBox.prompt = 'types: json, yaml, xml, csv, hjson, json5, ini, toml, hocon';
    queryBox.onDidChangeValue((val) => {
        query.next(val);
    });
    query.setQueryBox(queryBox);
    return queryBox;
}

export function openQueryBox() {
    input.load();
    if (!input.get()) {
        vscode.window.showErrorMessage('No open file or no content in it.');
        return;
    }

    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, () => {
        const queryBox = newQueryBox();
        return output.ready('json').then(() => {
            queryBox.show();
            queryBox.onDidAccept(() => {
                query.setQueryBox(null);
                queryBox.dispose();
            });
        });
    });
}
