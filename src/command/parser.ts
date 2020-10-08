import { Client, Message } from 'discord.js';
import { IReceiveResult } from '../receivers';

export interface ICommandResult {
    success: boolean,
    message: string,
}

export interface ICommandInfo {
    name: string,
    help?: string,
    following?: string,
    executor?: (bot: Client, msg: Message, received?: Map<string, any>) => Promise<ICommandResult>,
    receiver?: (strNotProceed: string) => Promise<IReceiveResult>,
    child?: ICommandInfo[],
};

export interface IParsedCommand {
    info: ICommandInfo,
    received: Map<string, any>,
}

export const parseCommand = async (
    accum: ICommandInfo, 
    str: string,
    strNotProceed: string = str,
    received: Map<string, any> = new Map<string, any>(),
): Promise<IParsedCommand> => {
    const current = strNotProceed.split(accum.following ?? " ")[0];
    const nextAccum = accum.child?.filter(v => v.receiver || strNotProceed.substr(current.length + (accum.following ?? " ").length).split(v.following ?? " ")[0] === v.name)[0]
    let   strNotProceedNext = strNotProceed.substr(accum.name.length + (accum.following ?? ' ').length);

    if (accum.receiver) {
        await accum.receiver(strNotProceed)
        .then(r => {
            received.set(accum.name, r.value);
            strNotProceedNext = r.left;
        })
        .catch(e => {
            return Promise.reject(`${e}\n${str}\n${' '.repeat(str.length - strNotProceed.length)}^ here`);
        });
    } else if (current !== accum.name) {
        return Promise.reject(`illegal command - root not found\n${str}`);
    }

    if (strNotProceedNext) {
        if (nextAccum === undefined) {
            return Promise.reject(`command expected to end but following literal found\n${str}\n${' '.repeat(str.length - strNotProceedNext.length)}^ here`);
        } else {
            return parseCommand(nextAccum, str, strNotProceedNext, received);
        }
    } else {
        return Promise.resolve({ info: accum, received: received });
    }
};
