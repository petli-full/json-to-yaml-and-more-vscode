import { Request } from './query';
import { transcode } from 'any-json-no-cson';


export const convert = (input: string, request: Request): Promise<string> => {
    return transcode(input, request.from, request.to);
};
