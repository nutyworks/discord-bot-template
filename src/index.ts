import { Client, Message } from 'discord.js';
import dotenv from 'dotenv';

import { parseCommand } from './command/parser';
import { rootCmd } from './command';

dotenv.config();

const bot = new Client();

const onReady = () => {
    console.log(`${bot.user?.tag} is ready!`);

    bot.user?.setPresence({
        activity: {
            type: "LISTENING",
            name: "ㅁㄴㅇㄹ",
        },
        status: "online",
    });
}

const onMessage = (msg: Message) => {
    if (msg.author.bot) return;

    if (msg.content.startsWith("'")) {
        parseCommand(rootCmd, msg.content)
        .then(v => {
            if (v.info.executor) {
                v.info.executor(bot, msg, v.received)
                .then(v => {
                    console.log(msg.author.tag, msg.content);
                    console.log(v);
                })
                .catch(e => {
                    console.log(msg.author.tag, msg.content);
                    console.log(e);
                });
            } else {
                msg.channel.send(v.info.help ?? "No help.");
            }
        })
        .catch(e => {
            console.log(msg.author.tag, msg.content, e);
            msg.channel.send(
                '```md\n# Error: ' + e + '```'
            )
        });
    }
}

bot.on("ready", onReady);
bot.on("message", onMessage);
bot.on("error", (err) => {
    console.error(err);
})

bot.login(process.env.TOKEN);
