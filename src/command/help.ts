import { Client, Message, MessageEmbed, EmbedFieldData } from 'discord.js';

import { rootCmd } from '../command';
import { parseCommand, ICommandResult, ICommandInfo } from './parser';
import { receiveAll } from '../receivers';

const helpBasicExecutor = (_: Client, msg: Message): Promise<ICommandResult> => {
    msg.channel.send(new MessageEmbed({
        color: 0xffff00,
        fields: rootCmd.child?.map(v => ({ name: v.name, value: v.help ?? "No help." } as EmbedFieldData)),
    }));

    return Promise.resolve({ success: true, message: "Basic help message sent." });
}

const helpDetailExecutor = async (_: Client, msg: Message, received: Map<string, any>): Promise<ICommandResult> => {
    const parsed = await parseCommand(rootCmd, "'" + received.get('args'))
    .catch(_ => {
        msg.reply("No such command.");
        return Promise.reject({ success: false, message: "No help message available." })
    });

    msg.reply(parsed.info.help ?? "Sorry, no help available.")
    return Promise.resolve({ success: true, message: "Help message sent." });
}

const helpDetailCommandInfo = {
    name: "args",
    executor: helpDetailExecutor,
    receiver: receiveAll,
} as ICommandInfo;

export const helpCommandInfo = {
    name: "help",
    help: "The command that will be very useful to you.",
    executor: helpBasicExecutor,
    child: [ helpDetailCommandInfo ]
} as ICommandInfo;
