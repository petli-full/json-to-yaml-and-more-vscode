import * as vscode from 'vscode';
import { input } from './input';
import { query } from './query';
import { output } from './output';
import { convert } from './convert';


export function initServices(): vscode.Disposable {
    const queryDisposer = query.subscribe(
        q => output.ready(q.to)
            .then(() => convert(input.get(), q))
            .then(converted => output.display(converted))
    );

    return {
        dispose: (): void => {
            queryDisposer.dispose();
        }
    };
};

export {
    input,
    output,
    query,
    convert,
};