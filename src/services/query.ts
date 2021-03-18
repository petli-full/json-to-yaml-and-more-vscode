import * as vscode from 'vscode';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


const supportedTypes = [
    'json',
    'yaml',
    'xml',
    'csv',
    'hjson',
    'json5',
    'ini',
    'toml',
    'hocon',
];

interface Query {
    setQueryBox: (qbox: null | vscode.InputBox) => void;
    subscribe: (callback: (val: Request) => Thenable<any>) => vscode.Disposable;
    next: (input: string) => void;
};

const query$ = new Subject<string>();
let queryBox: null | vscode.InputBox = null;

const setQueryBox = (qbox: null | vscode.InputBox) => {
    queryBox = qbox;
};

const setQueryError = (error: any, hideAfter: number) => {
    if (queryBox) {
        const errorMsg = String(error).trim();
        queryBox.validationMessage = String(errorMsg);
        if (errorMsg) {
            setTimeout(() => {
                if (queryBox && queryBox.validationMessage === errorMsg) {
                    queryBox.validationMessage = '';
                }
            }, hideAfter);
        }
    };
};

const subscribe = (callback: (val: Request) => Thenable<any>) => {
    const handle = query$.pipe(
        debounceTime(750),
        distinctUntilChanged(),
    ).subscribe((val) => {
        const request = parseRequest(val);
        if (request) {
            if (queryBox) {
                setQueryError('', 0);
                queryBox.busy = true;
            };
            callback(request).then(() => {
                if (queryBox) { queryBox.busy = false; };
            }, reason => {
                if (queryBox) { queryBox.busy = false; };
                setQueryError(reason, 5000);
            });
        } else {
            setQueryError('invalid input', 2000);
        }
    });

    return {
        dispose: (): any => {
            handle.unsubscribe();
        }
    };
};

const next = (val: string) => {
    const trimmed = val.trim();
    query$.next(trimmed);
};


export interface Request {
    from: string;
    to: string;
}

const parseRequest = (val: string): Request | null => {
    const pairs = val.split('|');
    if (pairs.length === 2) {
        const from = pairs[0].trim().toLowerCase();
        const to = pairs[1].trim().toLocaleLowerCase();
        if (supportedTypes.includes(from) && supportedTypes.includes(to)) {
            return { from, to };
        }
    }

    return null;
};

export const query: Query = {
    setQueryBox,
    subscribe,
    next,
};
