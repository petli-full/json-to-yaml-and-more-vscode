import { Request } from './query';
import { decode, encode } from 'any-json-no-cson';


export const convert = (input: string, request: Request): Promise<string> => {
    return decode(input, request.from).then((jsons: any[]) => {
        const results: Thenable<string>[] = [];
        jsons.forEach((j: any) => {
            results.push(encode(j, request.to));
        });
        return Promise.all(results);
    }).then((strs: string[]) => {
        return strs.join('\n---\n');
    });
};
